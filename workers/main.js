const { Worker } = require("worker_threads");

const NUM_JOBS = 4;

const main = async () => {
  for (let i = 1; i <= NUM_JOBS; i++) {
    const worker = new Worker("./worker.js", {
      workerData: { jobId: i }
    });

    worker.on("message", msg => {
      // optional: handle completion
    });

    worker.on("error", err => {
      console.error(err);
    });

    worker.on("exit", code => {
      if (code !== 0)
        console.error(`Worker stopped with exit code ${code}`);
    });
  }
};

main();