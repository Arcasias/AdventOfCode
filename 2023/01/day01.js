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
    for (const char of line) {
      const number = Number(char);
      if (!isNaN(number)) {
        numbers.push(number);
      }
    }
    if (!numbers.length) {
      return acc;
    }
    const numberStr = numbers.join("");
    return acc + Number(`${numberStr[0]}${numberStr.at(-1)}`);
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
      const numberIndex = NUMBERS.findIndex(
        (n) => n === line.slice(i, i + n.length)
      );
      if (numberIndex >= 0) {
        numbers.push(numberIndex);
      } else {
        const number = Number(char);
        if (!isNaN(number)) {
          numbers.push(number);
        }
      }
    }
    if (!numbers.length) {
      return acc;
    }
    const numberStr = numbers.join("");
    return acc + Number(`${numberStr[0]}${numberStr.at(-1)}`);
  }, 0);
};
