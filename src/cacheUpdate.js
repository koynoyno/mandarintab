// import { getRandomWord } from "./getRandomWord.js";
// import { getRandomNumber } from "./npm/getRandomNumber.js";

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

export let getRandomWord = (testTypeLength, items) => {
  let randomWords = [];
  const newDate = new Date().getDate();
  // const newDate = new Date().getMinutes(); // for debugging purposes

  if (items.randomWords.length !== parseInt(items.dayLimit)) {
    for (let i = 0; i < parseInt(items.dayLimit); i++) {
      randomWords[i] = getRandomNumber(testTypeLength);
    }
    chrome.storage.local.set({ randomWords: randomWords });
  } else if (items.date !== newDate) {
    for (let i = 0; i < parseInt(items.dayLimit); i++) {
      randomWords[i] = getRandomNumber(testTypeLength);
    }
    chrome.storage.local.set({ randomWords: randomWords, date: newDate });
  } else {
    randomWords = items.randomWords;
  }

  return randomWords[getRandomNumber(randomWords.length)];
};

// TODO: omg please optimize this
export let getRandomNumber = (data) => {
  return Math.floor(Math.random() * data);
};
