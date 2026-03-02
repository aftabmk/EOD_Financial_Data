const { workerData, parentPort } = require("worker_threads");

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function formatTime(ms) {
  const d = new Date(ms);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

const main = async () => {
  const start = Date.now();

  await delay(2000);

  const end = Date.now();
  const duration = end - start;

  const result = {
    id: workerData.jobId,
    start: formatTime(start),
    end: formatTime(end),
    duration
  };

  console.log(result);
  parentPort.postMessage(result);
};

main()
