import { parentPort } from "worker_threads";

parentPort?.on("message", ({ seeds, steps }) => {
  let min = Infinity;
  for (let i = 0; i < seeds.length; i++) {
    let value = seeds[i];
    if (value === 0) {
      break;
    }
    for (let j = 0; j < steps.length; j++) {
      const step = steps[j];
      for (let k = 0; k < step.length; k++) {
        if (value >= step[k][1] && value < step[k][1] + step[k][2]) {
          value = step[k][0] + (value - step[k][1]);
          break;
        }
      }
    }
    if (value < min) {
      min = value;
    }
  }

  parentPort?.postMessage(min);
});
