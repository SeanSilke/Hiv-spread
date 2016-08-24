
import {showElem} from "./utils";
import EventEmitter from "wolfy87-eventemitter";

function SideBars(quizElems) {
  let state = {
    isVisible: null,
  }

  let $mainElem = $(".side-panel");
  let $sideBars = $(".side-box");

  let select = (i) => {
    $sideBars.removeClass("box-selected")
    $sideBars[i] && $sideBars[i].classList.add("box-selected");
  }

  $sideBars.click(function() {
    quizElems[parseInt(this.dataset.id)].show();
    select(parseInt(this.dataset.id))
  })

  let render = () => {

    quizElems.forEach((e, i) => {
      if (e.result && e.result) {
        $sideBars[i].classList.add("box-true")
      } else if (e.result === false) {
        $sideBars[i].classList.add("box-false")
      }
    })
  }


  this.select = select;
  this.render = render;
  this.show = function(){
    showElem($mainElem)
  }
}

export default SideBars;
