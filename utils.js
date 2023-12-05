/** @type {"test" | "prod" | null} */
let currentEnv = null;

/**
 * @param {"test" | "prod" | null} env
 */
export const envIs = (env) => currentEnv === env;

/**
 * @param {unknown} value
 */
export const isNil = (value) => value === undefined || value === null;

/**
 * @param {[string, string]} inputs
 */
export const parseInput = (inputs) =>
  inputs.map((input) =>
    input
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
  );

/**
 * @param {unknown} string
 * @param {string} separator
 */
export const safeSplit = (string, separator) => {
  const regex = new RegExp(`\\s*${separator}\\s*`, "g");
  return String(string || "").split(regex);
};

/**
 * @param {"test" | "prod" | null} env
 */
export const setEnv = (env) => (currentEnv = env);

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
