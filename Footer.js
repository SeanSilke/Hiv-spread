
import EventEmitter from "wolfy87-eventemitter";
import {showElem, hideElem, scrollToElemTop} from "./utils"


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
    this.ee.emitEvent("show",[id])
    showElem(footer)
    scrollToElemTop($($('.footer')[id]),true)
  };

}


export default Footer;
