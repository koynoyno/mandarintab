/**
 * UPDATE FROM 4/9/2024: fix "2048" diplaying as 二千零四十零八
 * can delete .bk version after thorough testing
 * 
 * Return Chinese version of a given number
 * @param {number} n - wordsSeenNumber
 * @param {boolean} color — items.color
 */
export let toChineseNumber = (n, color) => {
  if (!Number.isInteger(n) || n < 0) {
    throw Error('请输入自然数');
  }

  const digits = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九'];
  const positions = ['', '十', '百', '千', '万', '十万', '百万', '千万', '亿', '十亿', '百亿', '千亿'];
  const charArray = String(n).split('');
  let result = '';
  let prevIsZero = false; // Track if the previous character was a zero

  // Process each digit
  for (let i = 0; i < charArray.length; i++) {
    const ch = charArray[i];
    const position = charArray.length - i - 1;

    if (ch === '0') {
      // If it's zero, only add it if the previous wasn't a zero and if it's not the last position
      if (!prevIsZero && position !== 0) {
        result += digits[0];
      }
      prevIsZero = true;
    } else {
      // If it's a non-zero digit
      if (!(ch === '1' && position === 1 && result === '')) {
        // Avoid adding '一' at the start of tens (like '一十')
        result += digits[parseInt(ch)];
      }
      result += positions[position]; // Add the position
      prevIsZero = false; // Reset zero flag
    }
  }

  // Special case for tens (like '一十' to '十')
  if (n >= 10 && n < 20) {
    result = result.replace(/^一十/, '十');
  }

  // TODO: support colors
  if (color) {
    // Implement color processing if required
  }

  return result;
}
