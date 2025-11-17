const { BASE_URL, URL_BUILDER } = require('../constant');

class BhavcopyFetcher {
  constructor() {
    this.baseUrl = BASE_URL;
    this.urlBuilder = URL_BUILDER;
  }

  async fetch(date) {
    if (!date) throw new Error("❌ Missing date argument (format: DDMMYYYY)");

    const url = `${this.baseUrl}/${this.urlBuilder}${date}.csv`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`);
    }

    const csvText = await response.text();
    const rows = csvText.split(/\r?\n/).filter((line) => line.trim() !== "");
    if (rows.length < 2) throw new Error("Empty or invalid CSV data.");

    const headers = rows[0].split(",").map((h) => h.trim());

    // Convert CSV → JSON
    const jsonData = rows
      .slice(1)
      .map((row) => {
        const values = row.split(",");
        const obj = {};
        headers.forEach((key, i) => {
          obj[key] = values[i]?.trim() ?? null;
        });
        return obj;
      })
      .filter((row) => row.SERIES === "EQ");

    return jsonData;
  }
}

module.exports = { BhavcopyFetcher };