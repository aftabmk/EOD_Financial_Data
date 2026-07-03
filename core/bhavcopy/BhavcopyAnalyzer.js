const { DISALLOWED } = require('./constant');
const { BhavcopyFetcher } = require("./BhavcopyFetcher");
const { getLastTradingDays } = require('./utils/prevDays');

class BhavcopyAnalyzer {
  constructor() {
    this.dates = getLastTradingDays();
    this.map = new Map();
  }

  async fetchAll() {
    const fetchInstance = new BhavcopyFetcher();

    const data = await Promise.allSettled(
      this.dates.map((date) => fetchInstance.fetch(date))
    );

    this.allData = data
      .filter((r) => r.status === "fulfilled")
      .flatMap((r) => r.value);
  }

  buildMap() {
    for (const stock of this.allData) {
      const { SYMBOL, CLOSE_PRICE, TTL_TRD_QNTY, TURNOVER_LACS, DELIV_PER } =
        stock;

      if (!this.map.has(SYMBOL)) {
        this.map.set(SYMBOL, {
          ltp: [],
          qty: [],
          turnover: [],
          delivery: [],
        });
      }

      const entry = this.map.get(SYMBOL);
      entry.ltp.push(Number(CLOSE_PRICE) || 0);
      entry.qty.push(Number(TTL_TRD_QNTY) || 0);
      entry.turnover.push(Number(Math.floor(TURNOVER_LACS / 100)) || 0);
      entry.delivery.push(Number(DELIV_PER) || 0);
    }
  }

  filterStocks() {

    for (const [symbol, { ltp, turnover, delivery }] of this
      .map) {
      const excluded = DISALLOWED.some((str) =>
        symbol.includes(str)
      );

      const valid =
        3 <= ltp.length &&
        turnover.every((v) => 100 <= v) &&
        delivery.every((v) => 60 < v) &&
        !excluded;

      if (!valid) this.map.delete(symbol);
    }
  }

  getResults() {
    return Object.fromEntries(this.map);
  }

  async run() {
    await this.fetchAll();
    this.buildMap();
    this.filterStocks();
    
    return this.getResults();
  }
}

module.exports = { BhavcopyAnalyzer };