export let ifFirstLaunch = (char) => {
  let message;

  // document
  //   .querySelector(".app")

  // if mobile
  // app.insertAdjacentHTML(
  //   "afterbegin",
  //   '<p id="welcome" align="center">Press "aA" and check Chinese Tab settings</strong> 🐼</p>'
  // );


  // TODO i18n
  //  if (char == "simplified" ) { message = `继续浏览`} else { message =`繼續瀏覽`}

  // if desktop
  // app.insertAdjacentHTML(
  //   "afterbegin",
  //   `<p id="welcome" align="center">${message} 🐼</p>`
  // );


  // app.insertAdjacentHTML(
  //   // "beforeend",
  //   "afterbegin",
  //   // '<img src="images/panda_easter.png" id="panda" draggable="false" title="酷酷酷！"/>' +
  //     `<p id="welcome" class="" align="center">${message}</p>`
  // );
  // hide forever
  chrome.storage.local.set({ firstLaunch: false });

  // open settings
  // Firefox prohibits it's as "no surprises policy"
  // chrome.action.openPopup();
};
