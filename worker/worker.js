const { fork } = require('child_process');

function runWorker(workerPath) {
	return new Promise((resolve, reject) => {
		const child = fork(workerPath);

		child.on('message', (msg) => {
			if (msg.success) {
				resolve(msg.data);
			} else {
				reject(new Error(msg.error));
			}
		});

		child.on('error', reject);

		child.on('exit', (code) => {
			if (code !== 0) {
				reject(new Error(`Worker exited with code ${code}`));
			}
		});
	});
}

module.exports = runWorker;