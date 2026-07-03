const { FortNightreport } = require('../core/fortnight/FortNightReport');

const main = async () => {
    try {
        const fortnight = new FortNightreport();

        const result = await fortnight.run();

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