const cheerio = require('cheerio');

class GetFortnightDates {
    constructor(url, selector) {
        this.url = url;
        this.selector = selector;
    }

    async getDates(count = Infinity) {
        const html = await fetch(this.url).then(r => r.text());
        const $ = cheerio.load(html);

        const select = $(this.selector);

        if (!select.length) {
            throw new Error(`Element not found: ${this.selector}`);
        }

        return select.find('option')
          .slice(0, count)
          .map((_, el) => {
              const value = $(el).attr('value') || '';

              const match = value.match(
                  /FIIInvestSector_[A-Za-z]+\d{1,2}\d{4}\.html$/
              );

              return match ? match[0] : null;
          })
          .get()
          .filter(Boolean);
    }
}

module.exports = GetFortnightDates;