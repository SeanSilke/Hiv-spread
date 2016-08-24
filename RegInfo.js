//
//
// import {addMouseewheelEvent} from "./utils";
// import DropDownMobile from "./DropDownMobile";
//
// import {getColor} from "./utils";





import SvgMap from "./SvgMap";
import Legend from "./Legend";
import Years from  "./Years";
import DropDown from "./DropDown";
import PopUp from "./PopUp";
import TogleBtn from './TogleBtn';
import Play from "./Play";




function RegInfo(data) {

  this.data = data;
  let self = this;

  // -------------Map State------------
  this.state = {
    year: 2012,
    regionId: "",
    display: "abs",
    isPlaing: true,
  };

  this.popUpElem = $(".hide-mobile .banner");

  let svgMap = new SvgMap(this);
  let legend = new Legend(this);
  let years = new Years(this);
  let dropDown = new DropDown(this, $(".map.hide-mobile .item.drop_down"));
  let popUp = new PopUp(this, this.popUpElem, 40, false);
  let togleBtn = new TogleBtn(this);
  let play = new Play(this);


  let findPosition = function() {
    if (!svgMap.selectedReg) return;

    let mapRect = svgMap.mapElem.getBoundingClientRect();
    let regRect = svgMap.selectedReg.getBoundingClientRect();
    let popUpRect = self.popUpElem[0].getBoundingClientRect();

    let top, left;

    left = regRect.left + regRect.width;
    top = regRect.top - popUpRect.height;
    if (top < mapRect.top) {
      top = mapRect.top + 20;
    }
    if (left + popUpRect.width > mapRect.left + mapRect.width) {
      left = regRect.left - popUpRect.width;
    }

    left = left + pageXOffset;
    top = top + pageYOffset;

    return {
      top: top,
      left: left,
    };
  };

  let setPosition = function(obj) {
    if (!obj) return;
    let format = ["right", "top", "left", "bottom"];
    format.forEach(function(prop) {
      self.popUpElem[0].style[prop] = obj[prop] ? obj[prop] + "px" : "";
    });
  };

  this.render = function() {
    svgMap.render();
    years.render();
    dropDown.render();
    legend.render();
    popUp.render();
    togleBtn.render();
    if (this.state.regionId) {

      setPosition(findPosition());
    }

  };


  this.init = function() {
    legend.init();
    dropDown.scroller.create();
    play.play();

    document.body.addEventListener("click",
      function(e) {
        self.state.regionId = "";
        self.state.isPlaing = false;
        self.render();
      }
    );

    window.onresize = function() {
      setPosition(findPosition());
    };
  };

};


export default RegInfo;
