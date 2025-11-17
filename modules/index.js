require('dotenv').config();

const { FortNightreport } = require('./fortnight/class/FortNightReport');
const { BhavcopyAnalyzer } = require('./bhavcopy/class/BhavcopyAnalyzer');

module.exports = { FortNightreport, BhavcopyAnalyzer };