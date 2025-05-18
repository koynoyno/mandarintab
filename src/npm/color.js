export default String.prototype.splitAndKeep = function (separator, method) {
  let str = this;
  let splitAndKeep = (str, separator, method = "separate") => {
    if (method == "separate") {
      str = str.split(new RegExp(`(${separator})`, "g"));
    } else if (method == "infront") {
      str = str.split(new RegExp(`(?=${separator})`, "g"));
    } else if (method == "behind") {
      str = str.split(new RegExp(`(.*?${separator})`, "g"));
      str = str.filter(function (el) {
        return el !== "";
      });
    }
    return str;
  };

  if (Array.isArray(separator)) {
    let parts = splitAndKeep(str, separator[0], method);
    for (let i = 1; i < separator.length; i++) {
      let partsTemp = parts;
      parts = [];
      for (let p = 0; p < partsTemp.length; p++) {
        parts = parts.concat(splitAndKeep(partsTemp[p], separator[i], method));
      }
    }
    return parts;
  } else {
    return splitAndKeep(str, separator, method);
  }
};

// TODO: can it work asynchronously?
// TODO: make it work for Zhuyin as well
