// not used

export let pinyinToZhuyin = (pinyinText) => {
    const pinyinZhuyinMap = {
      'a': 'ㄚ',
      'o': 'ㄛ',
      'e': 'ㄜ',
      'ê': 'ㄝ',
      'ai': 'ㄞ',
      'ei': 'ㄟ',
      'ao': 'ㄠ',
      'ou': 'ㄡ',
      'an': 'ㄢ',
      'en': 'ㄣ',
      'ang': 'ㄤ',
      'eng': 'ㄥ',
      'er': 'ㄦ',
      'yi': 'ㄧ',
      'ya': 'ㄧㄚ',
      'yao': 'ㄧㄠ',
      'ye': 'ㄧㄝ',
      'yan': 'ㄧㄢ',
      'yin': 'ㄧㄣ',
      'yang': 'ㄧㄤ',
      'ying': 'ㄧㄥ',
      'wu': 'ㄨ',
      'wa': 'ㄨㄚ',
      'wo': 'ㄨㄛ',
      'wai': 'ㄨㄞ',
      'wan': 'ㄨㄢ',
      'wen': 'ㄨㄣ',
      'wang': 'ㄨㄤ',
      'yu': 'ㄩ',
      'yue': 'ㄩㄝ',
      'yuan': 'ㄩㄢ',
      'yun': 'ㄩㄣ',
    };
  
    const initialMap = {
      'b': 'ㄅ',
      'p': 'ㄆ',
      'm': 'ㄇ',
      'f': 'ㄈ',
      'd': 'ㄉ',
      't': 'ㄊ',
      'n': 'ㄋ',
      'l': 'ㄌ',
      'g': 'ㄍ',
      'k': 'ㄎ',
      'h': 'ㄏ',
      'j': 'ㄐ',
      'q': 'ㄑ',
      'x': 'ㄒ',
      'zh': 'ㄓ',
      'ch': 'ㄔ',
      'sh': 'ㄕ',
      'r': 'ㄖ',
      'z': 'ㄗ',
      'c': 'ㄘ',
      's': 'ㄙ',
    };
  
    const toneMap = {
      '1': 'ˉ',
      '2': 'ˊ',
      '3': 'ˇ',
      '4': 'ˋ',
      '5': '˙',
    };
  
    const pinyinSyllables = pinyinText.match(/([bpmfdtnlgkhjqxzcsr]?[wy]?[aeiouê]+[nr]?[12345]?)/gi);
    let zhuyinText = '';
  
    for (const syllable of pinyinSyllables) {
      const initial = syllable.match(/^[bpmfdtnlgkhjqxzcsr]?[wy]?/i)[0];
      const final = syllable.match(/[aeiouê]+[nr]?/i)[0];
      const tone = syllable.match(/\d/);

let zhuyin = '';

if (initial) {
  zhuyin += initialMap[initial.toLowerCase()] || initial;
}
zhuyin += pinyinZhuyinMap[final.toLowerCase()] || final;

if (tone) {
  const toneMark = toneMap[tone[0]];
  const tonePosition = zhuyin.search(/[\u3105-\u3129\u312B]/) + 1;
  zhuyin = zhuyin.slice(0, tonePosition) + toneMark + zhuyin.slice(tonePosition);
}

zhuyinText += zhuyin;

  }

  return zhuyinText;
};

// // Test the function
// const pinyinText = "xū yào";
// console.log(pinyinToZhuyin(pinyinText)); // Output: ㄒㄩ ㄧㄠˋ