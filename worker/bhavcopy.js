const { BhavcopyAnalyzer } = require('../core/bhavcopy/BhavcopyAnalyzer');

const main = async () => {
    try {
        const bhavcopy = new BhavcopyAnalyzer();

        const result = await bhavcopy.run();

        process.send({
            success: true,
            data: result
        });
    }
    catch (err) {
        process.send({
            success: false,
            error: err.message
        });
    }
};

main();