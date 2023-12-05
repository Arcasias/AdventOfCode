import { existsSync } from "fs";
import { mkdir, readFile, writeFile } from "fs/promises";
import {
  green,
  isIterable,
  magenta,
  parseInput,
  parseInputs,
  red,
  setEnv,
} from "./utils.js";

/**
 * @param {number} index
 * @param {(lines: string[]) => Promise<number>} solver
 */
const execPart = async (index, solver) => {
  console.log(`${YEAR}: day ${magenta(DAY)} / part ${magenta(index + 1)}:`);
  setEnv("test");
  const exampleResult = await solver(exampleInputs[index]);
  const [logFn, color] =
    expected[index] === exampleResult
      ? [console.log, green]
      : [console.error, red];
  logFn(
    `• [TEST] (expects: ${color(expected[index])}) ${color(exampleResult)}`
  );
  setEnv("prod");
  logFn(`• [PROD] ${color(await solver(input))}`);
  setEnv(null);
};

const arg = process.argv[3];
const now = new Date();

const DAY = String(parseInt(arg, 10) || now.getDate()).padStart(2, "0");
const YEAR = String(now.getFullYear());

const DIR = `./${YEAR}/${DAY}/`;
const SCRIPT_NAME = `day${DAY}`;
const SCRIPT_PATH = `${DIR}${SCRIPT_NAME}.js`;
const INPUT_PATH = `${DIR}input.txt`;

// If no dir for today: create it & exit process
if (!existsSync(DIR)) {
  const [template] = await Promise.all([
    readFile("./template.js", "utf-8"),
    mkdir(DIR),
  ]);
  await Promise.all([
    writeFile(SCRIPT_PATH, template, "utf-8"),
    writeFile(INPUT_PATH, "", "utf-8"),
  ]);

  console.log(`Creating directory ${SCRIPT_NAME}`);
  process.exit(0);
}

// Import input & script
const [{ EXPECTED, EXAMPLE, partOne, partTwo }, rawInput] = await Promise.all([
  import(SCRIPT_PATH),
  readFile(INPUT_PATH, "utf-8"),
]);

const expected = isIterable(EXPECTED) ? EXPECTED : [EXPECTED, EXPECTED];
const input = parseInput(rawInput);
const exampleInputs = parseInputs(
  isIterable(EXAMPLE) ? EXAMPLE : [EXAMPLE, EXAMPLE]
);

await execPart(0, partOne);
await execPart(1, partTwo);
