export const EXAMPLE = [
  `
1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet
`,
  `
two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen
`,
];
export const EXPECTED = [142, 281];

/**
 * @param {string[]} targets
 * @param {string} line
 * @param {number} i
 */
const findTarget = (targets, line, i) => {
  for (const target of targets) {
    if (target === line.slice(i, i + target.length)) {
      return NUMBERS.indexOf(target);
    }
  }
  return null;
};

const NUMBERS = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
];

/**
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  return lines.reduce((acc, line) => {
    const numbers = [];
    for (let i = 0; i < line.length; i++) {
      const num = Number(line[i]);
      if (!isNaN(num)) {
        numbers.push(num);
      }
    }
    if (numbers.length) {
      const numberStr = numbers.join("");
      return acc + Number(`${numberStr[0]}${numberStr.at(-1)}`);
    } else {
      return acc;
    }
  }, 0);
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  return lines.reduce((acc, line) => {
    const numbers = [];
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const targets = NUMBERS.filter((num) => num[0] === char);
      if (targets.length) {
        const target = findTarget(targets, line, i);
        if (target) {
          numbers.push(target);
        }
      } else {
        const num = parseInt(char, 10);
        if (!isNaN(num)) {
          numbers.push(num);
        }
      }
    }
    if (numbers.length) {
      const numberStr = numbers.join("");
      return acc + Number(`${numberStr[0]}${numberStr.at(-1)}`);
    } else {
      return acc;
    }
  }, 0);
};
