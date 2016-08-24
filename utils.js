let getColor = function(percent) {
  if (percent > 1) return "rgb(180,32,37)";

  let r = Math.floor(232 - (232 - 180) * percent);
  let g = Math.floor(232 - (232 - 32) * percent);
  let b = Math.floor(232 - (232 - 37) * percent);

  return `rgb(${r},${g},${b})`;

};

let getColorMeta = function(startColor, endColor, percent) {
  // console.log(percent);
  if (percent >= 1 || isNaN(percent)) return startColor.join(",")
  let noName = function(start, end, percent) {
    return Math.abs(
      Math.floor(start * (1 - percent) + end * percent)
    );
  };

  return startColor.map(function(elem, i) {
    return noName(elem, endColor[i], percent);
  }).join(",");
};


let addMouseewheelEvent = function(elem, fn) {
  if (document.addEventListener) {
    if ('onwheel' in document) {
      // IE9+, FF17+, Ch31+
      elem.addEventListener("wheel", fn);
    } else if ('onmousewheel' in document) {
      // устаревший вариант события
      elem.addEventListener("mousewheel", fn);
    } else {
      // Firefox < 17
      elem.addEventListener("MozMousePixelScroll", fn);
    }
  } else { // IE8-
    elem.attachEvent("onmousewheel", fn);
  }

}

let showElem = ($elem) => {

  $elem.css({
      display: "block",
    }).clearQueue()
    .animate({
      opacity: 1
    }, 1000);
};

let hideElem = ($elem) => {
  $elem.css({
    display: "none",
    opacity: 0,
    transition: "opacity 1s"
  });
};

export {getColor,addMouseewheelEvent, getColorMeta,showElem, hideElem}
