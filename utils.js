import { Worker } from "worker_threads";

/** @type {"test" | "prod" | null} */
let currentEnv = null;

/**
 * @param {"test" | "prod" | null} env
 */
export const envIs = (env) => currentEnv === env;

/**
 * @param {string} url
 */
export const fetchText = async (url) => {
  const response = await fetch(url);
  return response.text();
};

/**
 * @param {number} a
 * @param {number} b
 * @returns {number}
 */
export const gcd = (a, b) => (b ? gcd(b, a % b) : a);

/**
 * @param {string} line
 * @param {string | RegExp} [separator]
 */
export const getNumbers = (line, separator) =>
  safeSplit(line, separator || /\s+/g)
    .map(Number)
    .filter((n) => !Number.isNaN(n));

/**
 * @param {any} value
 */
export const isIterable = (value) =>
  value &&
  typeof value === "object" &&
  typeof value[Symbol.iterator] === "function";

/**
 * @param {unknown} value
 */
export const isNil = (value) => value === undefined || value === null;

/**
 * @param {number} a
 * @param {number} b
 */
export const lcm = (a, b) => (a * b) / gcd(a, b);

/**
 * @param {string} input
 */
export const parseInput = (input) =>
  input
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

/**
 * @param {[string, string]} inputs
 */
export const parseInputs = (inputs) => inputs.map(parseInput);

/**
 * @param {unknown} string
 * @param {string | RegExp} separator
 */
export const safeSplit = (string, separator) => {
  const regex =
    separator instanceof RegExp
      ? separator
      : new RegExp(`\\s*${separator}\\s*`, "g");
  return String(string || "").split(regex);
};

/**
 * @param {"test" | "prod" | null} env
 */
export const setEnv = (env) => (currentEnv = env);

/**
 * @param {string | URL} url
 * @param {number} amount
 */
export const spawnWorkers = (url, amount) => {
  const free = () => Promise.race(jobs);

  /**
   * @template T, R
   * @param {T} data
   * @returns {Promise<R>}
   */
  const start = async (data) => {
    const index = jobs.indexOf(null);
    if (index < 0) {
      throw new Error(`no free workers (${amount} total)`);
    }
    jobs[index] = new Promise((resolve) => {
      console.debug(`starting worker ${index + 1}/${amount}`);
      const worker = new Worker(url);
      worker.on("message", (result) => {
        worker.terminate();
        jobs[index] = null;
        resolve(result);
      });
      worker.postMessage(data);
    });
    return jobs[index];
  };

  /** @type {(Promise<any> | null)[]} */
  const jobs = Array.from({ length: amount }, () => null);

  return { free, start };
};

// Console colors

/**
 * @param {unknown} value
 */
export const green = (value) => `${GREEN}${value}${RESET}`;

/**
 * @param {unknown} value
 */
export const magenta = (value) => `${MAGENTA}${value}${RESET}`;

/**
 * @param {unknown} value
 */
export const red = (value) => `${RED}${value}${RESET}`;

const GREEN = "\x1b[32m";
const MAGENTA = "\x1b[35m";
const RED = "\x1b[31m";
const RESET = "\x1b[0m";
