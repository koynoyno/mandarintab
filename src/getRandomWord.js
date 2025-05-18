import { getRandomNumber } from "./npm/getRandomNumber.js";

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
