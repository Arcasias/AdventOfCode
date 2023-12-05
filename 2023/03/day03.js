export const EXAMPLE = `
467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..
`;
export const EXPECTED = [4361, 467835];

/**
 * @param {string[]} lines
 */
export const partOne = async (lines) => {
  /**
   * @param {number} x
   * @param {number} y
   */
  const check = (x, y) => {
    const value = lines[y]?.[x];
    return Boolean(value && !/[\.\d]/.test(value));
  };

  let answer = 0;
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      let strNumber = "";
      const checks = [
        check(x - 1, y - 1),
        check(x - 1, y),
        check(x - 1, y + 1),
      ];
      while (!isNaN(Number(line[x]))) {
        strNumber += line[x];
        checks.push(check(x, y - 1), check(x, y + 1));
        x++;
      }
      if (strNumber) {
        checks.push(check(x, y - 1), check(x, y), check(x, y + 1));

        if (checks.includes(true)) {
          answer += Number(strNumber);
        }
      }
    }
  }

  return answer;
};

/**
 * @param {string[]} lines
 */
export const partTwo = async (lines) => {
  /**
   * @param {number} x
   * @param {number} y
   */
  const check = (x, y) => {
    const value = lines[y]?.[x];
    return value === "*" ? [x, y].join(",") : "";
  };

  /** @type {Record<string, number[]>} */
  const gearMap = {};

  let answer = 0;
  for (let y = 0; y < lines.length; y++) {
    const line = lines[y];
    for (let x = 0; x < line.length; x++) {
      let strNumber = "";
      const gears = [check(x - 1, y - 1), check(x - 1, y), check(x - 1, y + 1)];
      while (!isNaN(Number(line[x]))) {
        strNumber += line[x];
        gears.push(check(x, y - 1), check(x, y + 1));
        x++;
      }
      if (!strNumber) {
        continue;
      }

      gears.push(check(x, y - 1), check(x, y), check(x, y + 1));

      const validGears = gears.filter(Boolean);
      for (const coordinates of validGears) {
        if (!gearMap[coordinates]) {
          gearMap[coordinates] = [];
        }
        gearMap[coordinates].push(Number(strNumber));
      }
    }
  }

  for (const numbers of Object.values(gearMap)) {
    if (numbers.length === 2) {
      answer += numbers[0] * numbers[1];
    }
  }

  return answer;
};
