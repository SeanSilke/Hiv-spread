
import EventEmitter from "wolfy87-eventemitter";
import {showElem, hideElem} from "./utils"


let scrollToElemTop = ($elem, isLast) => {

  console.log(window.disableScroll);

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


function Footer(id) {

  let footer = $(".plate11, .line.bottom");

  this.ee = new EventEmitter();

  this.init = function() {
    hideElem(footer)
  };

  let that = this;

  $('.scrollBtn')[id].onclick = function() {
    that.show();
  };

  this.show = function() {
    // sideBars.select(id);
    this.ee.emitEvent("show",[id])
    this.isShown = true;
    showElem(footer)
    scrollToElemTop($($('.footer')[id]),true)

  };

}


export default Footer;
