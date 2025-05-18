// not used

export let drawQR = async () => {
    let qr = QRCode("test", {
        // text: `plecoapi://x-callback-url/df?hw=${char}&sec=sents`,
        text: `plecoapi://x-callback-url/df?hw=中文&sec=sents`,
        width: 128,
        height: 128,
        colorDark: "#000000",
        colorLight: "#ffffff",
      });
    // add QR code
    app.insertAdjacentHTML(
    //   "beforeend",
      "afterbegin",
      `<p class="qr" align="center">${qr}</p>`
    );
};
  