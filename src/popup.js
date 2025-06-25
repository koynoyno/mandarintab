// apply settings
let saveSettings = (id, checkbox = false) => {

  let value;
  if (checkbox) {
    value = document.querySelector(`#${id}`).checked;
  } else {
    value = document.querySelector(`#${id}`).value;
  }

  switch (id) {
    // remove cache if level or day limit is changed
    case "levelHSK":
    case "levelTOCFL":
      chrome.storage.local.set({ level: value, randomWords: [], cache: {} });
      chrome.tabs.reload();
      break;
      
    case "dayLimit":
      chrome.storage.local.set({ [id]: value, randomWords: [], cache: {} });
      chrome.tabs.reload();
      break;

    // remove cache and redraw #level options if test type is toggled
    case "testType":
      // reset cache
      chrome.storage.local.set({ [id]: value, randomWords: [], cache: {} });
      redrawTestLevels(value);
      let currentTest = (value == "hsk3") ? document.querySelector("#levelTOCFL") : document.querySelector("#levelHSK");
      let currentValue = currentTest.value;
      // set level to 5 if tocfl selected
      if (value == "tocfl" && currentValue > 5) {
        chrome.storage.local.set({ level: "5" });
        levelTOCFL.value = "5";
      } else {
        levelHSK.value = currentValue;
      }

      // BETA
      // Automatically switch char type
      let char = document.querySelector("#char");
      if (value == "tocfl") {
        char.value = "traditional";
        chrome.storage.local.set({ char: "traditional" });
      } else if (value == "hsk3") {
        char.value = "simplified";
        chrome.storage.local.set({ char: "simplified" });
      }

      // BETA
      // hide 'translationLabel' and 'colorLabel' when switching to TOCFL
      if (value == "tocfl") {
        document.getElementById('char').hidden = true;
        document.getElementById('charOptions').hidden = true;
      //   document.getElementById('colorLabel').hidden = true;
      //   document.getElementById('translationLabel').hidden = true;
      //   // display them back when switching to HSK
      } else {
        document.getElementById('char').hidden = false;
        document.getElementById('charOptions').hidden = false;
      //   document.getElementById('colorLabel').hidden = false;
      //   document.getElementById('translationLabel').hidden = false;
      }

      // TODO: switch to traditional if tocfl
      // if (value == "tocfl") {
      //   chrome.storage.local.set({ char: "traditional" });
      // }

      chrome.tabs.reload();
      break;

    // TODO: disable Simplified when TOCFL is selected?
    case "fontTypeSafari":
      chrome.storage.local.set({ fontType: value });
      chrome.tabs.reload();
      break;
    case "ai":
      chrome.storage.local.set({ ai: value });
      chrome.tabs.reload();
      aiSettings.hidden = !value;
      // supportText.hidden = value;
      // supportTextAI.hidden = !value;
      break;
    default:
      chrome.storage.local.set({ [id]: value });
      chrome.tabs.reload();
  }
};

// =============================================
// get settings on window load
let restoreSettings = () => {

  chrome.storage.local.get(
    null,
    (items) => {
      redrawTestLevels(items.testType);
      testType.value = items.testType;
      // level.value = items.level;
      // char.value = items.char;
      dayLimit.value = items.dayLimit;
      if (items.ua.browser == "Safari") {
        fontTypeSafari.value = items.fontType;
      } else {
        fontType.value = items.fontType;
      }
      sentenceExamples.checked = items.sentenceExamples;
      // color.checked = items.color;
      pinyin.checked = items.pinyin;
      zhuyin.checked = items.zhuyin;
      ai.checked = items.ai;
      color.checked = items.color;
      translation.checked = items.translation;
      // darkMode.checked = items.darkMode;
      // BETA show translation and colors only if HSK selected
      if (testType.value === "hsk3") {
        levelHSK.value = items.level;
        // document.getElementById('colorLabel').hidden = false;
        // document.getElementById('translationLabel').hidden = false;
        document.getElementById('char').hidden = false;
        document.getElementById('charOptions').hidden = false;

        // color.checked = items.color;
        // translation.checked = items.translation;
        char.value = items.char;
      } else {
        levelTOCFL.value = items.level;
      }

      // fonts settings for various platforms 
      // const ua = items.ua;

      console.log(`items.ua: ${items.ua}`)
      // if (!ua) return;
      if (items.ua.os == "macOS") {
        document.getElementById('fontTypeLabel').removeAttribute("hidden")
        if (items.ua.browser == "Safari" || items.ua.os == "iOS") {
          document.getElementById('fontTypeSafari').removeAttribute("hidden")
        } else {
          document.getElementById('fontType').removeAttribute("hidden")
        }
      }

      // hide AI checkbox on mobile
      if (!items.ua.mobile) {
        document.getElementById('ai').removeAttribute("hidden")
        document.getElementById('aiLabel').removeAttribute("hidden")
      }
      // ai settings
      aiSettings.hidden = !items.ai;
      if (items.ai) {
        // document.getElementById('supportTextAI').removeAttribute("hidden")
        // document.getElementById('supportText').setAttribute("hidden", "hidden")

        if (items.customModel) {
          customModel.value = items.customModel;
        }
        if (items.customPrompt) {
          customPrompt.value = items.customPrompt;
        }
        if (items.keepInRAM) {
          keepInRAM.checked = items.keepInRAM;
        }
      }
    }
  );
};

let redrawTestLevels = (testType) => {
  if (testType == "hsk3") {
    levelTOCFL.hidden = true;
    levelHSK.hidden = false;
  }
  if (testType == "tocfl") {
    levelHSK.hidden = true;
    levelTOCFL.hidden = false;
  }
};

// multiple size="6"

// -------------------------------------------------------------

document.addEventListener("DOMContentLoaded", async () => {
  // document.body.classList.add(localStorage.getItem("darkMode"));
  restoreSettings();
});

window.addEventListener("load", async () => {
  // TODO: optimize with event delegation
  // https://davidwalsh.name/event-delegate


  // selects

  testType.addEventListener("change", () => {
    saveSettings("testType");
  });

  levelHSK.addEventListener("change", () => {
    saveSettings("levelHSK");
  });

  levelTOCFL.addEventListener("change", () => {
    saveSettings("levelTOCFL");
  });

  char.addEventListener("change", () => {
    saveSettings("char");
  });

  dayLimit.addEventListener("change", () => {
    saveSettings("dayLimit");
  });

  fontType.addEventListener("change", () => {
    saveSettings("fontType");
  });

  fontTypeSafari.addEventListener("change", () => {
    saveSettings("fontTypeSafari");
  });



  // checkboxes

  sentenceExamples.addEventListener("click", () => {
    saveSettings("sentenceExamples", { checkbox: true });
  });

  // qr.addEventListener("click", () => {
  //   saveSettings("qr", { checkbox: true });
  // });

  color.addEventListener("click", () => {
    saveSettings("color", { checkbox: true });
  });

  pinyin.addEventListener("click", () => {
    saveSettings("pinyin", { checkbox: true });
  });

  zhuyin.addEventListener("click", () => {
    saveSettings("zhuyin", { checkbox: true });
  });

  translation.addEventListener("click", () => {
    saveSettings("translation", { checkbox: true });
  });

  ai.addEventListener("click", () => {
    saveSettings("ai", { checkbox: true });
  });

  // darkMode.addEventListener("click", () => {
  //   saveSettings("darkMode", { checkbox: true });
  // });

  // button event listeners
  // feedback.addEventListener("click", () => {
  //   chrome.tabs.update({
  //     // TODO: replace, google forms sucks with popups and stuff
  //     url: "https://forms.gle/A2j7TKjXwUfuALqz7",
  //   });
  //   window.close();
  // });


  // doesn't work properly in Safari
  customModel.addEventListener("focusout", (event) => {
    saveSettings("customModel");
  })

  // workaround for Safari
  customModel.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      saveSettings("customModel");
    }
  });

  // doesn't work properly in Safari
  customPrompt.addEventListener("focusout", (event) => {
    saveSettings("customPrompt");
  })

  // customPrompt field requires separate lines?
  // workaround for Safari
  customPrompt.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      saveSettings("customPrompt");
    }
  })

  keepInRAM.addEventListener("click", () => {
    saveSettings("keepInRAM", { checkbox: true });
  })

  chrome.storage.local.get(
    { ua: null },
    (items) => {
      if (items.ua.browser == "Safari") {
        window.onblur = function () {
          saveSettings("customModel");
          saveSettings("customPrompt");
        }
      }
    }
  )



  // support.addEventListener("click", () => {
  //   chrome.tabs.create({
  //     url: "https://chinesetab.com",
  //   });
  //   // window.close();
  // });

  // kofi.addEventListener("click", () => {
  //   chrome.tabs.update({
  //     // url: "https://ko-fi.com/chinesetab",
  //     url: "https://github.com/sponsors/koynoyno",
  //   });
  //   window.close();
  // });
});
