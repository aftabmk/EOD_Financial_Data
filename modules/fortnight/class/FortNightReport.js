const cheerio = require("cheerio");
const { PAGE_URL } = require("../constant");
const { getFortnightDates } = require("../utils/fortnightDate"); // adjust path

class FortNightreport {
  constructor() {
    if (!PAGE_URL) throw new Error("PAGE_URL is required");
    const { current, previous } = getFortnightDates();
    this.currentUrl = PAGE_URL.replace("[date]", current);
    this.previousUrl = PAGE_URL.replace("[date]", previous);
  }

  // -------------------------
  //   FETCH (MODULARIZED)
  // -------------------------
  async fetchPage() {
    const opts = {
      method: "GET",
      cache: "no-store",
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        Accept: "*/*",
        "Accept-Language": "en-US,en;q=0.9",
      },
    };

    try {
      // Run both in parallel: current + fallback previous
      const [current, previous] = await Promise.allSettled([
        fetch(this.currentUrl, opts),
        fetch(this.previousUrl, opts),
      ]);

      // --- CURRENT FIRST ---
      if (current.status === "fulfilled" && current.value.ok) {
        return await current.value.text();
      }

      // --- FALLBACK ---
      if (previous.status === "fulfilled" && previous.value.ok) {
        console.warn("⚠️ Current failed. Using previous fortnight...");
        return await previous.value.text();
      }

      // --- Both Failed ---
      const currErr =
        current.status === "rejected"
          ? current.reason
          : `HTTP ${current.value.status}`;

      const prevErr =
        previous.status === "rejected"
          ? previous.reason
          : `HTTP ${previous.value.status}`;

      throw new Error(
        `Both fetches failed:\nCurrent: ${currErr}\nPrevious: ${prevErr}`
      );
    } catch (err) {
      throw new Error("Fetch error: " + err.message);
    }
  }

  // -------------------------
  //   VALUE PARSER
  // -------------------------
  parseValue(text) {
    const clean = text.replace(/[,\s]/g, "").replace(/[()]/g, "-");
    if (clean === "" || clean === "-") return null;
    const num = Number(clean);
    return isNaN(num) ? null : num;
  }

  // -------------------------
  //   DATE RANGE PARSER
  // -------------------------
  parseDateRange(text) {
    const regex = /([A-Za-z]+)\s*(\d{1,2})-(\d{1,2}),\s*(\d{4})/g;
    const results = [];
    let match;

    const fmt = (d) => d.toISOString().slice(0, 10);

    while ((match = regex.exec(text)) !== null) {
      const [, month, startDay, endDay, year] = match;

      const start = new Date(`${month} ${startDay}, ${year}`);
      const end = new Date(`${month} ${endDay}, ${year}`);

      results.push({
        start: fmt(start),
        end: fmt(end),
      });
    }

    return results.length > 0 ? results : null;
  }

  // -------------------------
  //   EXTRACT (MODULARIZED)
  // -------------------------
  async run() {
    try {
      // fetchPage handles 4xx fallback
      const html = await this.fetchPage();
      const $ = cheerio.load(html);

      let targetTable = null;

      $("table").each((_, table) => {
        const text = $(table).text();
        if (
          text.includes("Net Investment") &&
          text.includes("Equity") &&
          text.includes("INR")
        ) {
          targetTable = $(table);
        }
      });

      if (!targetTable) {
        console.warn("❌ Net Equity table not found.");
        return {};
      }

      const rows = targetTable.find("tr").toArray();
      if (rows.length < 5) return {};

      const headerText = targetTable.text().match(/Net Investment[^\n]+/);
      if (!headerText) {
        console.warn("⚠️ No header with date range found");
        return {};
      }

      const range = this.parseDateRange(headerText[0]);
      if (!range) {
        console.warn("⚠️ Could not parse date range");
        return {};
      }

      const [{ end : start},{ end }] = range;
      const result = {};

      rows.forEach((row) => {
        const tds = $(row).find("td");
        if (tds.length < 3) return;

        const cells = tds
          .map((i, el) => $(el).text().trim())
          .get()
          .filter(Boolean);

        if (cells[0] === "Grand Total") return;

        const sector = cells[1];
        const startVal = this.parseValue(cells[26] || "");
        const endVal = this.parseValue(cells[50] || "");

        if (startVal === null || endVal === null) return;

        result[sector] = {
          [start]: startVal,
          [end]: endVal,
        };
      });

      return result;
    } catch (err) {
      return { error: err.message };
    }
  }
}

module.exports = { FortNightreport };
