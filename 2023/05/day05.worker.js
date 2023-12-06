import { parentPort } from "worker_threads";

/**
 * @param {{
 *  seeds: Uint32Array;
 *  steps: Uint32Array[][];
 * }} params
 */
const onMessage = ({ seeds, steps }) => {
  let min = Infinity;
  for (let i = 0; i < seeds.length; i++) {
    let value = seeds[i];
    if (value === 0) {
      break;
    }
    for (let j = 0; j < steps.length; j++) {
      const step = steps[j];
      for (let k = 0; k < step.length; k++) {
        const stepRange = step[k];
        if (value >= stepRange[1] && value < stepRange[1] + stepRange[2]) {
          value = stepRange[0] + (value - stepRange[1]);
          break;
        }
      }
    }
    if (value < min) {
      min = value;
    }
  }

  parentPort?.postMessage(min);
};

parentPort?.on("message", onMessage);
