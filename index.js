const { BhavcopyAnalyzer, FortNightreport } = require('./class');


const main = async() => {
    // ---- USAGE ----
    const bhavcopyReport = new BhavcopyAnalyzer();
    const fortNightReport = new FortNightreport();
    await fortNightReport.init();
      
    const data = await Promise.all([
        bhavcopyReport.run(),
        fortNightReport.run()
    ]);

    console.dir(data,{depth : 3});
}

main();