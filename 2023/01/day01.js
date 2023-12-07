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
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  return lines.reduce((acc, line) => {
    const numbers = line.replace(/\D+/g, "");
    return numbers ? acc + Number(numbers[0] + numbers.at(-1)) : acc;
  }, 0);
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  const NUMBER_NAMES =
    "zero,one,two,three,four,five,six,seven,eight,nine".split(",");
  return lines.reduce((acc, line) => {
    let numbers = "";
    for (let i = 0; i < line.length; i++) {
      const index = NUMBER_NAMES.findIndex(
        (n) => n === line.slice(i, i + n.length)
      );
      if (index > -1) {
        numbers += index;
      } else if (!isNaN(+line[i])) {
        numbers += line[i];
      }
    }
    return numbers ? acc + Number(numbers[0] + numbers.at(-1)) : acc;
  }, 0);
};
