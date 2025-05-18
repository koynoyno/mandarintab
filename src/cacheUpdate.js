import { getRandomWord } from "./getRandomWord.js";
import { getRandomNumber } from "./npm/getRandomNumber.js";

export let cacheUpdate = async (items) => {
  const { default: testType } = await import(
    `../tests/${items.testType}/${items.testType}_${items.level}.js`
  );

  let rand;
  let testTypeLength = testType.words.length;

  // select a random word if dayLimit is set
  if (parseInt(items.dayLimit) !== 0) {
    rand = getRandomWord(testTypeLength, items);
  } else {
    rand = getRandomNumber(testTypeLength);
  }

  // update and return items
  return testType.words[rand];
};
