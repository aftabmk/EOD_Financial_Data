const { BhavcopyAnalyzer } = require('../class');

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