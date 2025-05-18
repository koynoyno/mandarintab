// Adapt RegExp, so it could match following strings

// "˙ㄍㄜ"
// "ㄐㄩㄝˊ ˙ㄉㄜ"
// "ㄕㄣˊ ˙ㄇㄜ"

// and turn it into following strings respectively

// "ㄍㄜ˙"
// "ㄐㄩㄝˊ ㄉㄜ˙"
// "ㄕㄣˊ ㄇㄜ˙",



const inputs = ["˙ㄍㄜ", "ㄐㄩㄝˊ ˙ㄉㄜ", "ㄕㄣˊ ˙ㄇㄜ"];
const regex = /(?:\s|)(˙)([ㄅ-ㄙ])/g;

inputs.forEach(input => {
  const result = input.replace(regex, (fullMatch, group1, group2) => {
    return group2 + group1;
  });
  console.log(result);
});