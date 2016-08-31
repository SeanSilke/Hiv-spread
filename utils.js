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

let scrollToElemTop = ($elem, isLast) => {

  window.disableScroll = true;

  let winHeight = $(window).height()

  let helperElem = $('.prop');

  let setHelperPosotin = (winHeight,$elem) => {
    let helperPosition = ($elem.offset().top + winHeight);

    if ( helperPosition > helperElem.offset().top) {
      helperElem.css({
        top: helperPosition
      });
    }
  }

 if(!isLast) setHelperPosotin(winHeight ,$elem);


 let topPosition =  $elem.offset().top

 //перемотка к нужному месту
 $('body').clearQueue()
   .animate({
     scrollTop: topPosition,
   }, {
     duration: 1000,
     done: ()=> window.disableScroll = false
   });


}





let scrollToElemCenter = ($elem, isLast) => {

  let setHelperPosotin = (winHeight,$elem) => {
    let helperPosition = ($elem.offset().top + $elem.height() / 2 + winHeight / 2);

    if ( helperPosition > $('.prop').offset().top) {
      $('.prop').css({
        top: helperPosition
      });
    }
  }

  window.disableScroll = true;

  let winHeight = $(window).height()

  //Добавление элемента
  if (!isLast) {
    setHelperPosotin(winHeight,$elem);
  }

  //определение финальной позиции
  let scrollTo;


  // если элемнет больше размера экрана то прокрутка будте до его верха
  // if ( $elem.height() < winHeight){
    scrollTo =  $elem.offset().top - winHeight / 2 + $elem.height() / 2
  // }else {
  //   scrollTo =  $elem.offset().top;
  // }

  //перемотка к нужному месту
  $('html, body').clearQueue()
    .animate({
      scrollTop: scrollTo
    }, {
      duration: 1000,
      done: ()=> window.disableScroll = false
    });
}



export {getColor,addMouseewheelEvent, getColorMeta,showElem, hideElem, scrollToElemTop}
