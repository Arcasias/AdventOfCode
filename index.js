import { existsSync } from "fs";
import { readFile, writeFile } from "fs/promises";
import { green, isNil, magenta, parseInput, red } from "./utils.js";

const day = parseInt(process.argv[3], 10) || new Date().getDate();
const fileName = `./day${String(day).padStart(2, "0")}.js`;

if (!existsSync(fileName)) {
  const template = await readFile("./template.js", "utf-8");
  await writeFile(fileName, template, "utf-8");

  console.log(`Creating file ${fileName}`);
  process.exit(0);
}

const {
  EXPECTED,
  EXPECTED1,
  EXPECTED2,
  PROD,
  PROD1,
  PROD2,
  TEST,
  TEST1,
  TEST2,
  part1,
  part2,
} = await import(fileName);

const expected = isNil(EXPECTED1)
  ? [EXPECTED, EXPECTED]
  : [EXPECTED1, EXPECTED2];
const prodInputs = parseInput(isNil(PROD1) ? [PROD, PROD] : [PROD1, PROD2]);
const testInputs = parseInput(isNil(TEST1) ? [TEST, TEST] : [TEST1, TEST2]);

const testResult1 = await part1(testInputs[0]);
const log1 = expected[0] === testResult1 ? console.log : console.error;
const col1 = expected[0] === testResult1 ? green : red;
log1(`Day ${day} / part ${magenta(1)}:`);
log1(`• [TEST] (expects: ${col1(expected[0])}) ${col1(testResult1)}`);
log1(`• [PROD] ${col1(await part1(prodInputs[0]))}`);

const testResult2 = await part2(testInputs[1]);
const log2 = expected[1] === testResult2 ? console.log : console.error;
const col2 = expected[1] === testResult2 ? green : red;
log2(`Day ${day} / part ${magenta(2)}:`);
log2(`• [TEST] (expects: ${col2(expected[1])}) ${col2(testResult2)}`);
log1(`• [PROD] ${col2(await part2(prodInputs[1]))}`);
