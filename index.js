const path = require('path');
const runWorker = require('./worker/worker');

async function main() {
    try {
        const [bhavcopy, fortnight] = await Promise.all([
            runWorker(path.join(__dirname,'.','worker','fortnight')),
            runWorker(path.join(__dirname, '.','worker','bhavcopy' )),
        ]);

        console.dir({bhavcopy,fortnight},{ depth: 3 });
    }
    catch (err) {
        console.error(err);
    }
}

if(require.main === module) {
    require('dotenv').config();
    main();
}
module.exports.handler = main;