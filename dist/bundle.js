(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});


var newInfectedData = [100, 203, 1513, 4315, 3971, 19758, 59609, 88739, 52170, 39232, 37002, 39407, 43007, 44713, 54563, 58410, 58298, 62387, 70832, 79764, 89667, 93000];

exports.newInfectedData = newInfectedData;

},{}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Scroller = require("./Scroller");

var _Scroller2 = _interopRequireDefault(_Scroller);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DropDown(mapMain, dropDownElem) {

  var that = this;
  var isOpen = false;

  var $select = dropDownElem.find(".head");
  var scrollable = dropDownElem.find(".scrollable");
  var closeImg = dropDownElem.find(" .close_button img");

  var container = scrollable.find(".content");

  var head = dropDownElem.find(".text");

  $select.click(function (e) {
    e.stopPropagation();
    mapMain.state.isPlaing = false;
    if (isOpen) {
      that.close();
    } else {
      that.open();
    }
  });

  $(".scrollable").click(function (e) {
    e.stopPropagation();
    mapMain.state.isPlaing = false;
  });

  this.close = function () {
    scrollable.css('visibility', 'hidden');
    isOpen = false;
    closeImg.css({
      transform: "rotate(0deg)"
    });
  };

  this.open = function () {
    scrollable.css('visibility', 'visible');
    isOpen = true;
    closeImg.css({
      transform: "rotate(180deg)"
    });
  };

  this.render = function () {
    if (mapMain.state.regionId) {
      head.text(mapMain.data[mapMain.state.regionId].shortName);
    } else {
      head.text("Регион");
    }

    // Dirty Hack
    container.empty();
    Object.keys(mapMain.data).forEach(function (region) {

      var shortName = mapMain.data[region].shortName;

      var elem = $("<div class=\"item\" data-regionId=\"" + region + "\"> " + shortName + " </div>");

      if (region === mapMain.state.regionId) {
        elem = $("<div class=\"active\" data-regionId=\"" + region + "\"> " + shortName + " </div>");
      }

      container.append(elem);

      elem.click(function (e) {
        e.stopPropagation();
        mapMain.state.regionId = this.dataset.regionid;
        mapMain.render();
        that.close();
      });
    });
    that.close();
  };

  this.scroller = new _Scroller2.default(dropDownElem.find(".scrollable"));
}

exports.default = DropDown;

},{"./Scroller":11}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function DropDownMobile(mapMain, dropDownElem) {
  var that = this;
  var isOpen = false;
  var $select = dropDownElem.find(" .head");
  var scrollable = dropDownElem.find(".scrollable");
  var closeImg = dropDownElem.find(" .close_button img");

  var container = scrollable.find(".content");

  var head = dropDownElem.find(".text");

  var dropDownElems = dropDownElem.find(".togle-abs-rel");

  $select.click(function (e) {
    e.stopPropagation();
    if (isOpen) {
      that.close();
    } else {
      that.open();
    }
  });

  $(".scrollable").click(function (e) {
    e.stopPropagation();
  });

  this.close = function () {
    scrollable.css('visibility', 'hidden');
    isOpen = false;
    closeImg.css({
      transform: "rotate(0deg)"
    });
  };

  this.open = function () {
    scrollable.css('visibility', 'visible');
    isOpen = true;
    closeImg.css({
      transform: "rotate(180deg)"
    });
  };

  dropDownElems.click(function (e) {
    e.stopPropagation();
    mapMain.state.display = this.dataset.displaytype;
    mapMain.render();
    that.close();
  });

  this.render = function () {
    $.each(dropDownElems, function (i, e) {
      if (e.dataset.displaytype == mapMain.state.display) {
        e.classList.add("active");
        head.text(e.innerHTML);
      } else {
        e.classList.remove("active");
      }
    });
    that.close();
  };
}

exports.default = DropDownMobile;

},{}],4:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _wolfy87Eventemitter = require("wolfy87-eventemitter");

var _wolfy87Eventemitter2 = _interopRequireDefault(_wolfy87Eventemitter);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var scrollToElemTop = function scrollToElemTop($elem, isLast) {

  console.log(window.disableScroll);

  var winHeight = $(window).height();

  var helperElem = $('.prop');

  var setHelperPosotin = function setHelperPosotin(winHeight, $elem) {
    var helperPosition = $elem.offset().top + winHeight;

    if (helperPosition > helperElem.offset().top) {
      helperElem.css({
        top: helperPosition
      });
    }
  };

  if (!isLast) setHelperPosotin(winHeight, $elem);

  var topPosition = $elem.offset().top;

  //перемотка к нужному месту
  $('body').clearQueue().animate({
    scrollTop: topPosition
  }, {
    duration: 1000,
    done: function done() {
      return window.disableScroll = false;
    }
  });
};

function Footer(id) {

  var footer = $(".plate11, .line.bottom");

  this.ee = new _wolfy87Eventemitter2.default();

  this.init = function () {
    (0, _utils.hideElem)(footer);
  };

  var that = this;

  $('.scrollBtn')[id].onclick = function () {
    that.show();
  };

  this.show = function () {
    // sideBars.select(id);
    this.ee.emitEvent("show", [id]);
    this.isShown = true;
    (0, _utils.showElem)(footer);
    scrollToElemTop($($('.footer')[id]), true);
  };
}

exports.default = Footer;

},{"./utils":23,"wolfy87-eventemitter":21}],5:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils");

function Legend(mapMain) {

  var initColors = function initColors() {
    $(".legend .bloc .color").each(function (id, e) {
      var color = (0, _utils.getColor)((id + 1) / 10);
      $(e).css({
        "background-color": color
      });
    });
  };

  var renderValues = function renderValues() {
    var multiplier = mapMain.state.display == "abs" ? 100 : 10;

    $(".legend .bloc .val").each(function (id, e) {
      $(e).text(multiplier * Math.pow(2, id));
    });
  };

  this.init = function () {
    initColors();
    renderValues();
  };

  this.render = function () {
    renderValues();
  };
}

exports.default = Legend;

},{"./utils":23}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function PieChart(mainElem, rad) {
  var path = null;
  var svgElem = mainElem.find("#svg-pie")[0];

  this.render = function (deg) {
    if (!svgElem) return;
    if (path) {
      svgElem.removeChild(path);
      path = null;
    }
    if (isNaN(deg)) return;

    if (deg > 359) {
      path = svgElem.querySelector("circle").cloneNode(true);
      path.setAttribute("fill", "url(#img1)");
      svgElem.appendChild(path);
      return;
    }

    var cx = rad,
        cy = rad,
        rx = rad,
        ry = rad;

    var p = svgElem.createSVGPoint();
    p.x = 0;
    p.y = 1;

    var m = svgElem.createSVGMatrix();

    var p2 = p.matrixTransform(m.rotate(deg));

    p2.x = cx - p2.x * rx;
    p2.y = cy - p2.y * ry;

    path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    var d = void 0;

    if (deg > 180) {
      d = "M" + cx + " " + (cy - ry) + "A" + rx + " " + ry + " 0 1 1" + p2.x + " " + p2.y + "L" + cx + " " + cy + "z";
    } else {
      d = "M" + cx + " " + (cy - ry) + "A" + rx + " " + ry + " 0 0 1" + p2.x + " " + p2.y + "L" + cx + " " + cy + "z";
    }

    path.setAttribute("d", d);
    path.setAttribute("fill", "url(#img1)");

    svgElem.appendChild(path);
  };
}

exports.default = PieChart;

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Play(mapMain) {

  var that = this;

  this.play = function () {
    if (!mapMain.state.isPlaing) {
      return;
    }

    if (mapMain.render) {

      if (mapMain.state.year == 2014) {
        mapMain.state.year = 1994;
      } else {
        mapMain.state.year++;
      }

      mapMain.render();
    }

    setTimeout(function () {
      that.play();
    }, 1000);
  };
}

exports.default = Play;

},{}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _PieChart = require("./PieChart");

var _PieChart2 = _interopRequireDefault(_PieChart);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function PopUp(mapMain, mainElem, rad, isMobile) {

  var pieChart = new _PieChart2.default(mainElem, rad);

  var popUp = mainElem;
  var closeButton = popUp.find(".head .btn.close");
  var pieContainer = popUp.find(".body .pie");

  var dataFields = popUp.find(".body .data .item");
  var stateNameFeald = popUp.find(".head .region span");
  var infectedFeald = dataFields.find(".infected");
  var diedFeald = dataFields.find(".dead");
  // console.log(infectedFeald);
  var infectedTextFeald = $(dataFields.find(".label")[0]);
  // console.log(dataFields.find(".label")[0],infectedTextFeald);

  var close = function close() {
    hide();
    mapMain.state.regionId = "";
    mapMain.render();
  };

  closeButton.click(function (e) {
    close();
  });

  var hide = function hide() {
    popUp.css('opacity', 0);
    popUp.css('visibility', "hidden");
  };

  var open = function open() {
    popUp.css('opacity', 1);
    popUp.css('visibility', "visible");
  };

  popUp.click(function (e) {
    e.stopPropagation();
  });

  this.render = function () {
    if (!mapMain.state.regionId) {
      hide();
      return;
    }

    var name = void 0,
        infected = void 0,
        died = void 0,
        infectedText = void 0;
    if (isMobile) {
      name = mapMain.data[mapMain.state.regionId].shortName;
    } else {
      name = mapMain.data[mapMain.state.regionId].name;
    }

    if (mapMain.state.display == "rel") {
      pieContainer.hide();
      $(dataFields[1]).hide();
      $(dataFields[0]).find(".infected").css({
        width: "auto"
      });
      died = null;
      infected = mapMain.data[mapMain.state.regionId].relInfected[mapMain.state.year] || "н/д";
      infectedText = "Число инфицированных на&nbsp;100 тысяч населения";
    } else {
      infected = mapMain.data[mapMain.state.regionId].absInfected[mapMain.state.year] || "н/д";
      died = mapMain.data[mapMain.state.regionId].absDied[mapMain.state.year] || "н/д";
      pieContainer.show();
      $(dataFields[1]).show();
      $(dataFields[0]).find(".infected").css({
        width: "23%"
      });
      pieChart.render(360 * (died / infected));
      infectedText = "Общее число инфицированных";
    }

    stateNameFeald.text(name);
    infectedFeald.text(infected);
    infectedTextFeald.html(infectedText);
    diedFeald.text(died);

    // if (mapMain.state.regionId && !isMobile) {
    //    setPosition(findPosition());
    // }
    open();
  };
}

exports.default = PopUp;

},{"./PieChart":6}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _SvgMap = require("./SvgMap");

var _SvgMap2 = _interopRequireDefault(_SvgMap);

var _Legend = require("./Legend");

var _Legend2 = _interopRequireDefault(_Legend);

var _Years = require("./Years");

var _Years2 = _interopRequireDefault(_Years);

var _DropDown = require("./DropDown");

var _DropDown2 = _interopRequireDefault(_DropDown);

var _PopUp = require("./PopUp");

var _PopUp2 = _interopRequireDefault(_PopUp);

var _TogleBtn = require("./TogleBtn");

var _TogleBtn2 = _interopRequireDefault(_TogleBtn);

var _Play = require("./Play");

var _Play2 = _interopRequireDefault(_Play);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function RegInfo(data) {

  this.data = data;
  var self = this;

  // -------------Map State------------
  this.state = {
    year: 2012,
    regionId: "",
    display: "abs",
    isPlaing: true
  };

  this.popUpElem = $(".hide-mobile .banner");

  var svgMap = new _SvgMap2.default(this);
  var legend = new _Legend2.default(this);
  var years = new _Years2.default(this);
  var dropDown = new _DropDown2.default(this, $(".map.hide-mobile .item.drop_down"));
  var popUp = new _PopUp2.default(this, this.popUpElem, 40, false);
  var togleBtn = new _TogleBtn2.default(this);
  var play = new _Play2.default(this);

  var findPosition = function findPosition() {
    if (!svgMap.selectedReg) return;

    var mapRect = svgMap.mapElem.getBoundingClientRect();
    var regRect = svgMap.selectedReg.getBoundingClientRect();
    var popUpRect = self.popUpElem[0].getBoundingClientRect();

    var top = void 0,
        left = void 0;

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
      left: left
    };
  };

  var setPosition = function setPosition(obj) {
    if (!obj) return;
    var format = ["right", "top", "left", "bottom"];
    format.forEach(function (prop) {
      self.popUpElem[0].style[prop] = obj[prop] ? obj[prop] + "px" : "";
    });
  };

  this.render = function () {
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

  this.init = function () {
    legend.init();
    dropDown.scroller.create();
    play.play();

    document.body.addEventListener("click", function (e) {
      self.state.regionId = "";
      self.state.isPlaing = false;
      self.render();
    });

    window.onresize = function () {
      setPosition(findPosition());
    };
  };
} //
//
// import {addMouseewheelEvent} from "./utils";
// import DropDownMobile from "./DropDownMobile";
//
// import {getColor} from "./utils";


;

exports.default = RegInfo;

},{"./DropDown":2,"./Legend":5,"./Play":7,"./PopUp":8,"./SvgMap":13,"./TogleBtn":14,"./Years":16}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _DropDown = require("./DropDown");

var _DropDown2 = _interopRequireDefault(_DropDown);

var _PopUp = require("./PopUp");

var _PopUp2 = _interopRequireDefault(_PopUp);

var _TogleBtn = require("./TogleBtn");

var _TogleBtn2 = _interopRequireDefault(_TogleBtn);

var _DropDownMobile = require("./DropDownMobile");

var _DropDownMobile2 = _interopRequireDefault(_DropDownMobile);

var _YearSelect = require("./YearSelect");

var _YearSelect2 = _interopRequireDefault(_YearSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function RegInfoMobile(data) {

  this.data = data;
  var mapMain = this;

  // -------------Map State------------
  this.state = {
    year: 1999,
    regionId: "Москва",
    display: "abs"
  };

  var dropDown = new _DropDown2.default(this, $(".map.hide-desktop .item.drop_down:last-of-type"));
  var dropDownMobile = new _DropDownMobile2.default(this, $(".map.hide-desktop .item.drop_down").first());
  var popUp = new _PopUp2.default(this, $(".hide-desktop .banner"), 50, true);
  var yearSelect = new _YearSelect2.default(this, $('.year-select'));

  this.render = function () {
    dropDown.render();
    popUp.render();
    yearSelect.render();
    dropDownMobile.render();
  };

  this.init = function () {
    dropDown.scroller.create();

    document.body.addEventListener("click", function (e) {
      mapMain.render();
    });
  };
};

exports.default = RegInfoMobile;

},{"./DropDown":2,"./DropDownMobile":3,"./PopUp":8,"./TogleBtn":14,"./YearSelect":15}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

function Scroller(mainElem) {
  var scrollContainer = mainElem[0],
      scrollContentWrapper = mainElem.find('.content-wrapper')[0],
      scrollContent = mainElem.find('.content')[0],
      contentPosition = 0,
      scrollerBeingDragged = false,
      scroller = void 0,
      topPosition = void 0,
      scrollerHeight = void 0,
      normalizedPosition = void 0;

  function calculateScrollerHeight() {
    // *Calculation of how tall scroller should be
    var visibleRatio = scrollContainer.offsetHeight / scrollContentWrapper.scrollHeight;
    visibleRatio = 0.05;
    return visibleRatio * scrollContainer.offsetHeight;
  }

  function moveScroller(evt) {
    // Move Scroll bar to top offset
    var scrollPercentage = evt.target.scrollTop / scrollContentWrapper.scrollHeight;
    topPosition = scrollPercentage * (scrollContainer.offsetHeight * 0.915) + scrollContainer.offsetHeight * 0.05; // 5px arbitrary offset so scroll bar doesn't move too far beyond content wrapper bounding box
    scroller.style.top = topPosition + 'px';
  }

  function startDrag(evt) {
    normalizedPosition = evt.pageY;
    contentPosition = scrollContentWrapper.scrollTop;
    scrollerBeingDragged = true;
  }

  function stopDrag(evt) {
    scrollerBeingDragged = false;
  }

  function scrollBarScroll(evt) {
    if (scrollerBeingDragged === true) {
      var mouseDifferential = evt.pageY - normalizedPosition;
      var scrollEquivalent = mouseDifferential * (scrollContentWrapper.scrollHeight / scrollContainer.offsetHeight);
      scrollContentWrapper.scrollTop = contentPosition + scrollEquivalent;
    }
  }

  this.create = function () {
    // *Creates scroller element and appends to '.scrollable' div
    // create scroller element
    scroller = document.createElement("div");
    scroller.className = 'scroller';

    // determine how big scroller should be based on content
    scrollerHeight = calculateScrollerHeight();

    if (scrollerHeight / scrollContainer.offsetHeight < 1) {
      // *If there is a need to have scroll bar based on content size
      scroller.style.height = scrollerHeight + 'px';

      // append scroller to scrollContainer div
      scrollContainer.appendChild(scroller);

      // show scroll path divot
      scrollContainer.className += ' showScroll';

      // attach related draggable listeners
      scroller.addEventListener('mousedown', startDrag);
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('mousemove', scrollBarScroll);
    }
  };

  var onWheel = function onWheel(e) {
    return e.stopPropagation();
  };

  (0, _utils.addMouseewheelEvent)(scrollContentWrapper, onWheel);

  // *** Listeners ***
  scrollContentWrapper.addEventListener('scroll', moveScroller);
}

exports.default = Scroller;

},{"./utils":23}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils");

var _wolfy87Eventemitter = require("wolfy87-eventemitter");

var _wolfy87Eventemitter2 = _interopRequireDefault(_wolfy87Eventemitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function SideBars(quizElems) {
  var state = {
    isVisible: null
  };

  var $mainElem = $(".side-panel");
  var $sideBars = $(".side-box");

  var select = function select(i) {
    $sideBars.removeClass("box-selected");
    $sideBars[i] && $sideBars[i].classList.add("box-selected");
  };

  $sideBars.click(function () {
    quizElems[parseInt(this.dataset.id)].show();
    select(parseInt(this.dataset.id));
  });

  var render = function render() {

    quizElems.forEach(function (e, i) {
      if (e.result && e.result) {
        $sideBars[i].classList.add("box-true");
      } else if (e.result === false) {
        $sideBars[i].classList.add("box-false");
      }
    });
  };

  this.select = select;
  this.render = render;
  this.show = function () {
    (0, _utils.showElem)($mainElem);
  };
}

exports.default = SideBars;

},{"./utils":23,"wolfy87-eventemitter":21}],13:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils");

function SvgMap(mapMain) {

  this.render = null;
  this.selectedReg = null;
  this.mapElem = document.getElementById("svg-map");
  var that = this;

  var regions = $("#svg-map path, #svg-map polygon");
  var selectedReg = null;

  var setRegsColor = function setRegsColor(year) {
    Object.keys(mapMain.data).forEach(function (reginoId) {

      var value = void 0,
          percent = void 0;

      if (mapMain.state.display == "abs") {

        value = mapMain.data[reginoId].absInfected[year];

        if (value < 100) {
          percent = 0;
        } else {
          percent = Math.log2(value / 100) / 9;
        }
      } else {
        value = mapMain.data[reginoId].relInfected[year];

        if (value < 10) {
          percent = 0;
        } else {
          percent = Math.log2(value / 10) / 9;
        }
      }

      $('#' + reginoId).css({
        'fill': (0, _utils.getColor)(percent)
      });
    });
  };

  var setSelectedRegion = function setSelectedRegion(regionId) {
    that.selectedReg && that.selectedReg.classList.remove('selected');
    if (regionId) {
      that.selectedReg = document.getElementById(regionId);
      that.selectedReg.classList.add('selected');
    }
  };

  this.render = function () {
    setRegsColor(mapMain.state.year);
    setSelectedRegion(mapMain.state.regionId);
    if (mapMain.state.regionId) {
      this.mapElem.classList.add('regSelected');
    } else {
      this.mapElem.classList.remove('regSelected');
    }
  };

  regions.click(function (e) {
    e.stopPropagation();
    // mapMain.state.isPlaing =false;
    if (e.target.id === mapMain.state.regionId) {
      that.mapElem.classList.remove('regSelected');
      mapMain.state.regionId = "";
    } else {
      mapMain.state.regionId = e.target.id;
      e.target.parentElement.insertBefore(e.target, null);
    }
    mapMain.render();
  });
}

exports.default = SvgMap;

},{"./utils":23}],14:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function TogleBtn(mapMain) {
  var btn = $(".map .map_header .btn");

  btn.click(function (e) {
    e.stopPropagation();
    mapMain.state.isPlaing = false;
    mapMain.state.display = this.dataset.displaytype;
    mapMain.render();
  });

  var setButtons = function setButtons(display) {
    btn.each(function (i, elem) {
      if (elem.dataset.displaytype == display) elem.classList.add('active');else elem.classList.remove('active');
    });
  };

  this.render = function () {
    setButtons(mapMain.state.display);
  };
}

exports.default = TogleBtn;

},{}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function YearSelect(mapMain, mainElem) {
  var year = mainElem.find(".selected-year");
  var moreBtn = mainElem.find(".more");
  var lessBtn = mainElem.find(".less");

  moreBtn.click(function () {
    if (mapMain.state.year < 2014) mapMain.state.year++;
    mapMain.render();
  });

  lessBtn.click(function () {
    if (mapMain.state.year > 1994) mapMain.state.year--;
    mapMain.render();
  });

  this.render = function () {
    year.text(mapMain.state.year);
  };
}

exports.default = YearSelect;

},{}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function Years(mapMain) {
  this.render = function () {

    $(".years .col").each(function (id, e) {
      var year = parseInt($(e).attr("id"));
      if (year === mapMain.state.year) {
        $(e).addClass("active");
      } else {
        $(e).removeClass("active");
      }
    });
  };

  // _____________click__________

  $(".years .col").on("click", function (e) {
    e.stopPropagation();
    mapMain.state.isPlaing = false;
    var year = parseInt($(this).attr("id"));
    mapMain.state.year = year;
    mapMain.render();
  });
}

exports.default = Years;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var keyReasonChart = function () {

  //	Наркотики	Гетеросекс.	Гомосекс.	От матерей

  //как расположенны бары на диаграмме
  var barsPosition = ["drags", "fromMather", "hetero", "homo"];

  //как представленые данные в элементе матрици
  var legend = {
    drags: 0,
    hetero: 1,
    homo: 2,
    fromMather: 3
  };

  var valMatrix = [[3.3, 43, 53, 0.7], [6, 41, 52.9, 0.1], [84, 7, 8.7, 0.3], [87, 10.9, 1.9, 0.2], [79.1, 17.8, 2.7, 0.4], [91.8, 7.4, 0.6, 0.1], [95.5, 4.2, 0.2, 0.1], [93.2, 6.4, 0.2, 0.2], [81.2, 17.7, 0.4, 0.7], [72.3, 25.4, 0.5, 1.7], [66.7, 29.9, 0.8, 2.5], [64.1, 31.8, 1.1, 3.0], [63.3, 33.0, 0.7, 2.9], [61.5, 35.2, 1.0, 2.3], [61.3, 35.6, 1.1, 2.0], [59.8, 37, 1.4, 1.8], [57.9, 39.7, 1.3, 1.1], [56.2, 41.4, 1.3, 1.1], [56.4, 41.7, 1.1, 0.8], [54.9, 43.1, 1, 1.0], [58.4, 39.7, 1.1, 0.8]];

  var defYearVal = [25, 25, 25, 25];

  var years = document.querySelectorAll('.key-reason-canvas .year');

  var yearsMobile = document.querySelectorAll(".key-reason-mobile .year");

  var setValue = function setValue(year, valArr) {
    var bars = year.querySelectorAll(".bar");
    [].forEach.call(bars, function (elem, i) {
      var name = barsPosition[i];
      var percent = valArr[legend[name]];
      elem.classList.add(name);
      elem.style.height = percent + "%";
    });
  };

  var setValueMobile = function setValueMobile(year, valArr) {
    var bars = year.querySelectorAll(".bar");
    [].forEach.call(bars, function (elem, i) {
      var name = barsPosition[i];
      var percent = valArr[legend[name]];
      elem.classList.add(name);
      elem.style.width = percent + "%";
    });
  };

  var setYears = function setYears(i, fn, years) {
    if (i > years.length - 1) {
      $(".key-reason-mobile-year-text").css({
        opacity: 0.9
      });
      return;
    }
    fn(years[i], valMatrix[i]);
    setTimeout(setYears, 80, ++i, fn, years);
  };

  var startIndex = 0;

  var show = function show() {
    // setYears(startIndex, setValue, years)
    setTimeout(setYears, 1000, 0, setValue, years);
    setTimeout(setYears, 1000, 0, setValueMobile, yearsMobile);
  };

  //move init to some global init

  var initYears = function initYears(i, fn, years) {
    if (i > 20) return;
    fn(years[i], defYearVal);
    initYears(++i, fn, years);
  };

  initYears(startIndex, setValue, years);
  initYears(startIndex, setValueMobile, yearsMobile);

  return {
    show: show
  };
}();

exports.default = keyReasonChart;

},{}],18:[function(require,module,exports){
"use strict";

var _utils = require("./utils");

var _RegInfo = require("./RegInfo");

var _RegInfo2 = _interopRequireDefault(_RegInfo);

var _RegInfoMobile = require("./RegInfoMobile");

var _RegInfoMobile2 = _interopRequireDefault(_RegInfoMobile);

var _newInfectedChartMobile = require("./newInfectedChartMobile");

var _newInfectedChartMobile2 = _interopRequireDefault(_newInfectedChartMobile);

var _newInfectedChart = require("./newInfectedChart");

var _newInfectedChart2 = _interopRequireDefault(_newInfectedChart);

var _keyReasonChart = require("./keyReasonChart");

var _keyReasonChart2 = _interopRequireDefault(_keyReasonChart);

var _share = require("./share.js");

var _share2 = _interopRequireDefault(_share);

var _SideBars = require("./SideBars");

var _SideBars2 = _interopRequireDefault(_SideBars);

var _Footer = require("./Footer");

var _Footer2 = _interopRequireDefault(_Footer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var a = 10;


// import eventEmitter from "wolfy87-eventemitter"

// console.log(eventEmitter);


(function () {

  /*
   ██████  ██       ██████  ██████   █████  ██      ███████
  ██       ██      ██    ██ ██   ██ ██   ██ ██      ██
  ██   ███ ██      ██    ██ ██████  ███████ ██      ███████
  ██    ██ ██      ██    ██ ██   ██ ██   ██ ██           ██
   ██████  ███████  ██████  ██████  ██   ██ ███████ ███████
  */

  var disableScroll = false;

  /*
  ██      ██ ██████  ██████   █████  ██████  ██    ██     ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
  ██      ██ ██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
  ██      ██ ██████  ██████  ███████ ██████    ████       █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
  ██      ██ ██   ██ ██   ██ ██   ██ ██   ██    ██        ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
  ███████ ██ ██████  ██   ██ ██   ██ ██   ██    ██        ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
  */

  var scrollToElemTop = function scrollToElemTop($elem, isLast) {

    console.log(disableScroll);

    var winHeight = $(window).height();

    var helperElem = $('.prop');

    var setHelperPosotin = function setHelperPosotin(winHeight, $elem) {
      var helperPosition = $elem.offset().top + winHeight;

      if (helperPosition > helperElem.offset().top) {
        helperElem.css({
          top: helperPosition
        });
      }
    };

    if (!isLast) setHelperPosotin(winHeight, $elem);

    var topPosition = $elem.offset().top;

    //перемотка к нужному месту
    $('body').clearQueue().animate({
      scrollTop: topPosition
    }, {
      duration: 1000,
      done: function done() {
        return disableScroll = false;
      }
    });
  };

  var scrollToElemCenter = function scrollToElemCenter($elem, isLast) {

    var setHelperPosotin = function setHelperPosotin(winHeight, $elem) {
      var helperPosition = $elem.offset().top + $elem.height() / 2 + winHeight / 2;

      if (helperPosition > $('.prop').offset().top) {
        $('.prop').css({
          top: helperPosition
        });
      }
    };

    disableScroll = true;

    var winHeight = $(window).height();

    //Добавление элемента
    if (!isLast) {
      setHelperPosotin(winHeight, $elem);
    }

    //определение финальной позиции
    var scrollTo = void 0;

    // если элемнет больше размера экрана то прокрутка будте до его верха
    // if ( $elem.height() < winHeight){
    scrollTo = $elem.offset().top - winHeight / 2 + $elem.height() / 2;
    // }else {
    //   scrollTo =  $elem.offset().top;
    // }

    //перемотка к нужному месту
    $('html, body').clearQueue().animate({
      scrollTop: scrollTo
    }, {
      duration: 1000,
      done: function done() {
        return disableScroll = false;
      }
    });
  };

  var doElsCollide = function doElsCollide(el1, el2) {

    var rect1 = el1.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();

    return rect1.left < rect2.left + rect2.width && rect1.left + rect1.width > rect2.left && rect1.top < rect2.top + rect2.height && rect1.height + rect1.top > rect2.top;
  };

  // ------------Data process functions------


  var newDataProseed = function newDataProseed(csvFile) {
    var r = {};
    var regionsArr = csvFile.split("\n");
    regionsArr.pop(); //remove end line

    regionsArr.forEach(function (e, i) {
      e = e.split(";");
      var key = e.shift();
      var shortName = e.shift();
      var name = e.shift();
      r[key] = {
        name: name,
        shortName: shortName,
        rowYearsData: e
      };
    });

    var years = [];
    for (var i = 0; i <= 20; i++) {
      years.push(1994 + i);
    }

    Object.keys(r).forEach(function (region) {

      r[region].absDied = {};
      r[region].absInfected = {};
      r[region].relInfected = {};
      years.forEach(function (year) {
        r[region].absInfected[year] = infectedInYear(year, r[region].rowYearsData);
        r[region].absDied[year] = diedInYear(year, r[region].rowYearsData);
        r[region].relInfected[year] = relnIfectedInYear(year, r[region].rowYearsData);
      });
    });

    return r;
  };

  var infectedInYear = function infectedInYear(year, rowRregData) {
    var ofset = 0 + (2014 - year) * 3;
    return rowRregData[ofset];
  };

  var diedInYear = function diedInYear(year, rowRregData) {
    var ofset = 1 + (2014 - year) * 3;
    return rowRregData[ofset];
  };

  var relnIfectedInYear = function relnIfectedInYear(year, rowRregData) {
    var ofset = 2 + (2014 - year) * 3;
    return rowRregData[ofset];
  };

  var getColorMeta = function getColorMeta(startColor, endColor, percent) {
    // console.log(percent);
    if (percent >= 1 || isNaN(percent)) return startColor.join(",");
    var noName = function noName(start, end, percent) {
      return Math.abs(Math.floor(start * (1 - percent) + end * percent));
    };

    return startColor.map(function (elem, i) {
      return noName(elem, endColor[i], percent);
    }).join(",");
  };

  /*
  ██     ██ ██ ███    ██ ██████   ██████  ██     ██      ██████  ███    ██     ███████  ██████ ██████   ██████  ██      ██
  ██     ██ ██ ████   ██ ██   ██ ██    ██ ██     ██     ██    ██ ████   ██     ██      ██      ██   ██ ██    ██ ██      ██
  ██  █  ██ ██ ██ ██  ██ ██   ██ ██    ██ ██  █  ██     ██    ██ ██ ██  ██     ███████ ██      ██████  ██    ██ ██      ██
  ██ ███ ██ ██ ██  ██ ██ ██   ██ ██    ██ ██ ███ ██     ██    ██ ██  ██ ██          ██ ██      ██   ██ ██    ██ ██      ██
   ███ ███  ██ ██   ████ ██████   ██████   ███ ███       ██████  ██   ████     ███████  ██████ ██   ██  ██████  ███████ ███████
  */

  var onscroll = function () {
    var bgColor = null;
    var H = document.body.offsetHeight;

    var colors = [[26, 14, 14], [22, 47, 57], [26, 14, 14], [19, 50, 61], [19, 50, 61], [12, 35, 42], [12, 35, 42], [22, 47, 57], [44, 108, 111]];

    var refElemSelectors = ['.plate1', ".plate2-3", ".plate4-5", ".plate6", ".plate7", ".plate8", ".plate9", ".plate10", ".plate11"];

    var calcRefPoint = function calcRefPoint(elem) {
      return $(elem).outerHeight() / 2 + $(elem).offset().top;
    };

    var refPoint = refElemSelectors.map(calcRefPoint);

    var getBotomRefIndex = function getBotomRefIndex(px) {
      var i = void 0;
      for (i = 0; i < refPoint.length; i++) {
        if (refPoint[i] > px) break;
      };
      return i;
    };

    var getPersents = function getPersents(px, refTop, refBotom) {
      return (px - refTop) / (refBotom - refTop);
    };

    var onscroll = function onscroll() {
      var scrolled = window.pageYOffset || document.documentElement.scrollTop;
      var windowCenter = scrolled + window.innerHeight / 2;

      var botomIndex = getBotomRefIndex(windowCenter);
      var percent = getPersents(windowCenter, refPoint[botomIndex - 1], refPoint[botomIndex]);
      var color = getColorMeta(colors[botomIndex - 1], colors[botomIndex], percent);

      if (color !== bgColor) {
        window.requestAnimationFrame(function () {
          window.document.body.style.backgroundColor = "rgb(" + color + ")";
        });
        bgColor = color;
      }
    };

    return onscroll;
  }();

  window.onscroll = onscroll;

  $(function () {

    /*
    ██    ██  █████  ██      ██████  ██  ██████ ██   ██ ███████ ██████
    ██    ██ ██   ██ ██      ██   ██ ██ ██      ██  ██  ██      ██   ██
    ██    ██ ███████ ██      ██████  ██ ██      █████   █████   ██████
     ██  ██  ██   ██ ██      ██      ██ ██      ██  ██  ██      ██   ██
      ████   ██   ██ ███████ ██      ██  ██████ ██   ██ ███████ ██   ██
    */

    var valPicker = function valPicker(fn, state) {

      var meter = document.querySelector('.red-meter-9');
      var greenMeter = document.querySelector('.thermometer-9 .green-meter-9');
      var ribbonSlider = document.querySelector('#ribbon-slider-9');
      var percent = void 0;
      var max = 848;
      var text = document.querySelector('.red-meter-9>div');
      var rightAnswer = 12;

      var renderMobile = function renderMobile(percent) {
        $(".answers-mobile.hide-desktop .red-meter-9")[0].style.left = (-1 + percent) * 100 + "%";
        $(".valuepicker-mobile-picker-9")[0].style.left = percent * 235 + "px";
        $(".valuepicker-mobile-picker-9").text(Math.round(percent * 14) + 1);
      };

      var render = function render(percent) {
        renderMobile(percent);
        ribbonSlider.style.left = percent * max + "px";
        meter.style.left = 0 - (1 - percent) * 100 + "%";
        text.innerHTML = Math.round(percent * 14) + 1;
        if (percent < 0.075) {
          meter.classList.add("small");
        } else {
          meter.classList.remove("small");
        }
        if (percent > 0.92) {
          greenMeter.classList.add("big");
        } else {
          greenMeter.classList.remove("big");
        }
      };

      render(0.4);

      var onDrag = function onDrag(event, ui) {
        ui.position.left = Math.min(848, ui.position.left);
        percent = ui.position.left / 848;
        render(percent);
        //обработку правильно ответа решил проводить в серекторе по этому можно
        // не передовать состояние селектора в состояние вопроса
        state.selected = Math.round(percent * 14) + 1;
        fn();
      };

      $(ribbonSlider).draggable({
        containment: "parent",
        axis: "x",
        drag: onDrag
      });

      var onDragMobile = function onDragMobile(event, ui) {
        percent = ui.position.left / 235;
        render(percent);

        //обработку правильно ответа решил проводить в серекторе по этому можно
        // не передовать состояние селектора в состояние вопроса
        state.selected = Math.round(percent * 14) + 1;
        //callback call
        fn();
      };

      $(".valuepicker-mobile-picker-9").draggable({
        containment: "parent",
        axis: "x",
        drag: onDragMobile
      });

      var isRight = function isRight() {
        return Math.round(percent * 14) + 1 == rightAnswer;
      };

      return {
        isRight: isRight
      };
    };

    /*
    ██    ██  █████  ██      ██████  ██  ██████ ██   ██ ███████ ██████  ██████
    ██    ██ ██   ██ ██      ██   ██ ██ ██      ██  ██  ██      ██   ██      ██
    ██    ██ ███████ ██      ██████  ██ ██      █████   █████   ██████   █████
     ██  ██  ██   ██ ██      ██      ██ ██      ██  ██  ██      ██   ██ ██
      ████   ██   ██ ███████ ██      ██  ██████ ██   ██ ███████ ██   ██ ███████
    */

    var valPicker2 = function valPicker2(fn, state) {
      var meter = document.querySelector('.red-meter-8');
      var greenMeter = document.querySelector('.thermometer .green-meter');
      var ribbonSlider = document.querySelector('#ribbon-slider-8');
      var percent = void 0;
      var max = 848;
      var text = document.querySelector('.red-meter-8>div');
      var rightAnswer = 40;

      var renderMobile = function renderMobile(percent) {
        $(".answers-mobile.hide-desktop .red-meter-8")[0].style.left = (-1 + percent) * 100 + "%";
        $(".valuepicker-mobile-picker-8")[0].style.left = percent * 235 + "px";
        $(".valuepicker-mobile-picker-8").text(Math.round(percent * 100) + "%");
      };

      var render = function render(percent) {
        renderMobile(percent);
        ribbonSlider.style.left = percent * max + "px";
        meter.style.left = 0 - (1 - percent) * 100 + "%";
        text.innerHTML = Math.round(percent * 100) + "%";
        if (percent < 0.075) {
          meter.classList.add("small");
        } else {
          meter.classList.remove("small");
        }
        if (percent > 0.92) {
          greenMeter.classList.add("big");
        } else {
          greenMeter.classList.remove("big");
        }
      };

      render(0.5);

      var onDrag = function onDrag(event, ui) {
        ui.position.left = Math.min(848, ui.position.left);
        percent = ui.position.left / 848;
        render(percent);

        //обработку правильно ответа решил проводить в серекторе по этому можно
        // не передовать состояние селектора в состояние вопроса
        state.selected = Math.round(percent * 100);
        fn();
      };

      $(ribbonSlider).draggable({
        containment: "parent",
        axis: "x",
        drag: onDrag
      });

      var onDragMobile = function onDragMobile(event, ui) {
        percent = ui.position.left / 235;
        render(percent);

        //обработку правильно ответа решил проводить в серекторе по этому можно
        // не передовать состояние селектора в состояние вопроса
        state.selected = Math.round(percent * 100);
        //callback call
        fn();
      };

      $(".valuepicker-mobile-picker-8").draggable({
        containment: "parent",
        axis: "x",
        drag: onDragMobile
      });

      var isRight = function isRight() {
        var answer = Math.round(percent * 100);

        return answer > 35 && answer < 45;
      };

      return {
        isRight: isRight
      };
    };

    /*
    ██    ██  █████  ██      ██████  ██  ██████ ██   ██ ███████ ██████  ██████
    ██    ██ ██   ██ ██      ██   ██ ██ ██      ██  ██  ██      ██   ██      ██
    ██    ██ ███████ ██      ██████  ██ ██      █████   █████   ██████   █████
     ██  ██  ██   ██ ██      ██      ██ ██      ██  ██  ██      ██   ██      ██
      ████   ██   ██ ███████ ██      ██  ██████ ██   ██ ███████ ██   ██ ██████
    */

    var valPicker3 = function valPicker3(fn, state) {
      var circle = document.querySelector('.guess-growth-main-small');
      var textFeald = document.querySelector('.guess-growth-main-text');
      var baseR = 38.3333333333;
      var r = 38.3333333333;
      var h = 0;
      var text = "1 000 000";
      var selectedVal = 0;
      var baseVal = 1000000;
      var totalVal = 1000000;

      var valToText = function valToText(val) {
        val = Math.round(val / 100) * 100;

        var arr = (val + "").split("");
        arr.splice(4, 0, " ");
        arr.splice(1, 0, " ");
        return arr.join("");
      };

      var changeR = function changeR() {
        circle.style.width = r + "px";
        circle.style.height = r + "px";
      };

      var changeText = function changeText() {
        return textFeald.innerHTML = text;
      };

      var calculeteNewR = function calculeteNewR(persent) {
        return baseR + baseR * persent;
      };

      var calculeteNewVal = function calculeteNewVal(persent) {
        return baseVal + baseVal * persent;
      };

      var onDrag = function onDrag(event, ui) {

        h = ui.position.top;
        var persent = (1 - h / 230) * 5;
        r = calculeteNewR(persent);
        selectedVal = calculeteNewVal(persent);
        text = valToText(selectedVal);
        requestAnimationFrame(changeR);
        requestAnimationFrame(changeText);
        //что записывать в состояние. Это вообще используется?
        state.selected = h / 230;
        fn();
      };

      var onDragY = function onDragY(event, ui) {
        h = ui.position.left;
        var persent = h / 230 * 5;
        r = calculeteNewR(persent);
        selectedVal = calculeteNewVal(persent);
        text = valToText(selectedVal);
        requestAnimationFrame(changeR);
        requestAnimationFrame(changeText);
        //что записывать в состояние. Это вообще используется?
        state.selected = h / 230;
        fn();
      };

      $(".valuepicker-mobile-picker").draggable({
        containment: "parent",
        axis: "x",
        drag: onDragY
      });

      $(".valuepicker-picker").draggable({
        containment: "parent",
        axis: "y",
        drag: onDrag
      });

      var isRight = function isRight() {
        return selectedVal > 3000000 && selectedVal < 4000000;
      };

      return {
        isRight: isRight
      };
    };

    function hookUpValQueston(id, question, ValPicker, AnswerSelectors, onAnswer) {

      var answerButton = question.find(".answerButton");
      var answer = $(AnswerSelectors);
      this.isShown = false;

      var initAnswers = function initAnswers() {
        (0, _utils.hideElem)(answer);
      };

      var showAnswers = function showAnswers() {
        (0, _utils.showElem)(answer);
        onAnswer && onAnswer();
        // scrollToElemCenter(answer)
        scrollToElemTop($($(".answerButton")[id]));
      };

      var initQuestion = function initQuestion() {
        (0, _utils.hideElem)(question);
      };

      var showQuestin = function showQuestin() {
        (0, _utils.showElem)(question);
        // scrollToElemCenter(question)
        scrollToElemTop($($('.footer')[id]));
      };

      var state = {
        selected: null,
        isAnswered: false,
        right: 12
      };

      var render = function render() {
        if (state.isAnswered) {
          removeButton();
          disableScroll = true;
          setTimeout(showAnswers, 1000);
          question.addClass("answered");
          sideBars.render();
        }
        if (state.selected !== null) {
          answerButton.addClass("active");
        };
      };

      var removeButton = function removeButton() {
        answerButton.css({
          opacity: 0,
          pointerEvents: "none"
        });
      };

      var valPicker = ValPicker(render, state);

      var that = this;
      this.result = null;

      //Click on answer
      answerButton.click(function () {
        state.isAnswered = true;
        that.result = valPicker.isRight();
        render();
      });

      //Show question
      $('.scrollBtn')[id].onclick = function () {
        that.show();
      };

      this.init = function () {
        initQuestion();
        initAnswers();
      };

      this.show = function () {
        sideBars.select(id);
        if (id == 0) {
          sideBars.show();
        }
        showQuestin();
        this.isShown = true;
      };
    };

    function hookUpQueston(id, question, right, AnswerSelectors, onAnswer) {

      var answerButton = question.find(".answerButton");
      var answer = $(AnswerSelectors);

      var initAnswers = function initAnswers() {
        (0, _utils.hideElem)(answer);
      };

      var showAnswers = function showAnswers() {
        (0, _utils.showElem)(answer);
        onAnswer && onAnswer();
        // scrollToElemCenter(answer)
        scrollToElemTop($($(".answerButton")[id]));
      };

      var initQuestion = function initQuestion() {
        (0, _utils.hideElem)(question);
      };

      var showQuestin = function showQuestin() {
        (0, _utils.showElem)(question);
        // scrollToElemCenter(question);
        scrollToElemTop($($('.footer')[id]));
      };

      var state = {
        selected: null,
        isAnswered: false,
        right: right
      };

      var render = function render() {
        if (state.isAnswered) {
          disableScroll = true;
          removeButton();
          setTimeout(showAnswers, 1000);
          question.addClass("answered");
          sideBars.render();
        } else {
          if (state.selected !== null) {
            answerButton.addClass("active");
          }
        }
        renderOptions();
      };

      var options = question.find(".answers .item .elem");

      var renderOptions = function renderOptions() {
        if (!state.isAnswered) {
          $.each(options, function (i, elem) {
            if (i == state.selected) {
              $(elem).addClass("selected");
            } else {
              $(elem).removeClass("selected");
            }
          });
        } else {
          if (state.selected !== state.right) {
            options[state.selected].classList.add("wrong");
            options[state.selected].classList.remove("selected");
          }
          options[state.right].classList.add("right");
        };
      };

      var initOptions = function initOptions() {
        var onSelect = function onSelect(event) {
          state.selected = parseInt(event.currentTarget.dataset.id);
          render();
        };
        options.on("click", onSelect);
      };

      var removeButton = function removeButton() {
        answerButton.css({
          opacity: 0,
          pointerEvents: "none"
        });
      };

      var that = this;
      this.result = null;

      answerButton.click(function () {
        state.isAnswered = true;
        that.result = state.selected == state.right;
        render();
      });

      $('.scrollBtn')[id].onclick = function () {
        that.show();
      };

      var init = function init() {
        initOptions();
        initQuestion();
        initAnswers();
      };

      this.isShown = false;

      this.show = function () {
        sideBars.select(id);
        if (id == 0) {
          sideBars.show();
        }
        showQuestin();
        this.isShown = true;
      };
      this.init = init;
    };

    var getDataAndMap = function getDataAndMap() {
      $(".map_body").load("map.svg", function () {

        var blob = null;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "HIV_Data_by_reg.csv");
        xhr.responseType = "blob"; //force the HTTP response, response-type header to be blob
        xhr.onload = function () {
          blob = xhr.response; //xhr.response is now a blob object
          myReader.readAsText(blob);
        };
        xhr.send();

        var myReader = new FileReader();
        myReader.addEventListener("loadend", function (e) {

          var data = newDataProseed(e.srcElement.result);
          var regInfo = new _RegInfo2.default(data);
          var regInfoMobile = new _RegInfoMobile2.default(data);
          regInfo.init();
          regInfo.render();
          regInfoMobile.init();
          regInfoMobile.render();
        });
      });
    };

    getDataAndMap();

    // keyReasonChart.show();
    // newInfectedChartMobile.show();

    var footer = new _Footer2.default(7);

    var quizElems = [new hookUpQueston(0, $(".question-one"), 2, ".plate3"), new hookUpQueston(1, $(".question-two"), 3, ".plate5", getDataAndMap), new hookUpQueston(2, $(".question-three"), 2, ".answer-three, .plate6-after", function () {
      _newInfectedChart2.default.show();
      _newInfectedChartMobile2.default.show();
    }), new hookUpValQueston(3, $(".question-four"), valPicker3, ".answer-four, .plate7-after"), new hookUpValQueston(4, $(".question-five"), valPicker2, ".answer-five", _keyReasonChart2.default.show), new hookUpValQueston(5, $(".question-six"), valPicker, ".answer-six"), new hookUpQueston(6, $(".question-seven"), 1, ".answer-seven, .plate10-after"), footer];

    var sideBars = new _SideBars2.default(quizElems);

    footer.ee.on("show", function (e) {
      sideBars.select(e);
      renderResult();
    });

    quizElems.forEach(function (elem) {
      return elem.init();
    });

    // quizElems.forEach(elem => elem.show());


    var results = [{
      text: "СПИД, как известно, не спит. А вы почти ничего о нём не знаете"
    }, {
      text: "Кажется, вы, по крайней мере, знаете, чем отличается ВИЧ от СПИД"
    }, {
      text: "Вы отлично разбираетесь в этой невесёлой теме!"
    }];

    var renderResult = function renderResult() {

      var resultVal = quizElems.reduce(function (val, e) {
        if (e instanceof hookUpValQueston || e instanceof hookUpQueston) {
          val = e.result ? val + 1 : val;
        }
        return val;
      }, 0);

      var resultTextId = resultVal > 5 ? 2 : resultVal > 3 ? 1 : 0;
      var obj = results[resultTextId];

      $(".plate11 .result .comment").text(obj.text);
    };

    var showNext = function showNext() {
      for (var i = quizElems.length - 1; i >= 0; i--) {
        var e = quizElems[i];
        if (i == 0 && !e.isShown) {
          quizElems[i].show();
          sideBars.show();
          return;
        }
        if (e.isShown && e.result !== null && i < quizElems.length - 1) {
          if (!quizElems[i + 1].isShown) quizElems[i + 1].show();
          return;
        }
      }
    };

    var oldScrollPositoin = window.pageYOffset || document.documentElement.scrollTop;

    (0, _utils.addMouseewheelEvent)(document, onWheel);

    function onWheel(e) {
      e = e || window.event;

      if (disableScroll) {
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
        return;
      }

      var newScrollPositoin = window.pageYOffset || document.documentElement.scrollTop;

      // wheelDelta не дает возможность узнать количество пикселей
      var delta = e.deltaY || e.detail || e.wheelDelta;

      if (newScrollPositoin == oldScrollPositoin && delta > 10) {
        showNext();
        e.preventDefault ? e.preventDefault() : e.returnValue = false;
      }
      if (delta > 10) {
        oldScrollPositoin = newScrollPositoin;
      }
    }
  });

  $(".share-btn, .share-btn-big").click(function () {
    (0, _share2.default)(this.dataset.network);
  });
})();

},{"./Footer":4,"./RegInfo":9,"./RegInfoMobile":10,"./SideBars":12,"./keyReasonChart":17,"./newInfectedChart":19,"./newInfectedChartMobile":20,"./share.js":22,"./utils":23}],19:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils");

var _Data = require("./Data.js");

var newInfectedChart = function () {

  var data = _Data.newInfectedData;

  var bars = document.querySelectorAll('.chart.newInfected .body .canvas .bar');

  var startColor = [228, 152, 152];
  var endColor = [190, 32, 37];
  var max = 100 * 1000;

  var i = 0;

  var rendernewInfected = function rendernewInfected() {
    if (i >= data.length) {
      var labels = document.querySelectorAll('.newInfected_label_text');
      [].forEach.call(labels, function (elem) {
        return elem.style.opacity = 0.9;
      });
      return;
    }
    var val = data[i];
    if (val < 4000) {
      bars[i].style.backgroundColor = 'rgb(24,179,172)';
      bars[i].style.marginTop = 260 * 0.98 + "px";
    } else {
      var color = (0, _utils.getColorMeta)(startColor, endColor, val / max);
      bars[i].style.backgroundColor = "rgb(" + color + ")";
      bars[i].style.marginTop = (1 - val / max) * 260 + "px";
    }

    if (i == 3) {
      bars[i].style.backgroundColor = 'rgb(24,179,172)';
    }

    i++;
    setTimeout(rendernewInfected, 30);
  };

  var show = function show() {

    setTimeout(function () {
      rendernewInfected();
    }, 1000);
  };

  return {
    show: show
  };
}();

exports.default = newInfectedChart;

},{"./Data.js":1,"./utils":23}],20:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils");

var _Data = require("./Data.js");

var newInfectedChartMobile = function () {

  var data = _Data.newInfectedData;

  var bars = document.querySelectorAll('.chart.newInfected-mobile .body .canvas .block');

  var startColor = [228, 152, 152];
  var endColor = [190, 32, 37];
  var max = 100 * 1000;

  var i = 0;

  var rendernewInfected = function rendernewInfected() {
    if (i >= data.length) {
      var labels = document.querySelectorAll('.newInfected_label_text');
      [].forEach.call(labels, function (elem) {
        return elem.style.opacity = 0.9;
      });
      return;
    }
    var val = data[i];
    if (val < 4000) {
      bars[i].style.backgroundColor = 'rgb(24,179,172)';
      bars[i].style.marginLeft = -190 * 0.98 + "px";
    } else {
      var color = (0, _utils.getColorMeta)(startColor, endColor, val / max);
      bars[i].style.backgroundColor = "rgb(" + color + ")";
      bars[i].style.marginLeft = (0 - 190) * (1 - val / max) + "px";
    }

    if (i == 3) {
      bars[i].style.backgroundColor = 'rgb(24,179,172)';
    }

    i++;
    setTimeout(rendernewInfected, 30);
  };

  var show = function show() {

    setTimeout(function () {
      rendernewInfected();
    }, 1000);
  };

  return {
    show: show
  };
}();

exports.default = newInfectedChartMobile;

},{"./Data.js":1,"./utils":23}],21:[function(require,module,exports){
/*!
 * EventEmitter v5.1.0 - git.io/ee
 * Unlicense - http://unlicense.org/
 * Oliver Caldwell - http://oli.me.uk/
 * @preserve
 */

;(function (exports) {
    'use strict';

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    function isValidListener (listener) {
        if (typeof listener === 'function' || listener instanceof RegExp) {
            return true
        } else if (listener && typeof listener === 'object') {
            return isValidListener(listener.listener)
        } else {
            return false
        }
    }

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        if (!isValidListener(listener)) {
            throw new TypeError('listener must be a function');
        }

        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listenersMap = this.getListenersAsObject(evt);
        var listeners;
        var listener;
        var i;
        var key;
        var response;

        for (key in listenersMap) {
            if (listenersMap.hasOwnProperty(key)) {
                listeners = listenersMap[key].slice(0);

                for (i = 0; i < listeners.length; i++) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}(this || {}));

},{}],22:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var share = function share(network) {

  var title = "Россия на пороге эпидемии ВИЧ";
  var description = "Тревожные факты о масштабах бедствия — в спецпроекте «Газеты.Ru»";
  var link = "http://dyn.ig.rambler.ru/HIV-spread/";
  var closeLink = "http://dyn.ig.rambler.ru/HIV-spread/close.html";
  var twitterText = title + "." + " " + description;
  var image = "http://dyn.ig.rambler.ru/HIV-spread/share-img.png";

  if (network == "vk") {
    var url = "http://vk.com/share.php?url=" + link + "&description=" + description + "&image=" + image + "&title=" + title;
    window.open(url, "_blank", "width=400,height=500");
  } else if (network == "fb") {
    var appId = 610415715785775;
    var _url = "https://www.facebook.com/dialog/feed?app_id=" + appId + "&description=" + description + "&display=popup&link=" + link + "&name=" + title + "&next=" + closeLink + "&picture=" + image;
    window.open(_url, "_blank", "width=400,height=500");
  } else if (network == "tw") {
    var _url2 = "https://twitter.com/intent/tweet?original_referer=" + link + "&text=" + twitterText + "&tw_p=tweetbutton&url=" + link;
    window.open(_url2, "_blank", "width=400,height=500");
  }
};

exports.default = share;

},{}],23:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getColor = function getColor(percent) {
  if (percent > 1) return "rgb(180,32,37)";

  var r = Math.floor(232 - (232 - 180) * percent);
  var g = Math.floor(232 - (232 - 32) * percent);
  var b = Math.floor(232 - (232 - 37) * percent);

  return "rgb(" + r + "," + g + "," + b + ")";
};

var getColorMeta = function getColorMeta(startColor, endColor, percent) {
  // console.log(percent);
  if (percent >= 1 || isNaN(percent)) return startColor.join(",");
  var noName = function noName(start, end, percent) {
    return Math.abs(Math.floor(start * (1 - percent) + end * percent));
  };

  return startColor.map(function (elem, i) {
    return noName(elem, endColor[i], percent);
  }).join(",");
};

var addMouseewheelEvent = function addMouseewheelEvent(elem, fn) {
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
  } else {
    // IE8-
    elem.attachEvent("onmousewheel", fn);
  }
};

var showElem = function showElem($elem) {

  $elem.css({
    display: "block"
  }).clearQueue().animate({
    opacity: 1
  }, 1000);
};

var hideElem = function hideElem($elem) {
  $elem.css({
    display: "none",
    opacity: 0,
    transition: "opacity 1s"
  });
};

exports.getColor = getColor;
exports.addMouseewheelEvent = addMouseewheelEvent;
exports.getColorMeta = getColorMeta;
exports.showElem = showElem;
exports.hideElem = hideElem;

},{}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEYXRhLmpzIiwiRHJvcERvd24uanMiLCJEcm9wRG93bk1vYmlsZS5qcyIsIkZvb3Rlci5qcyIsIkxlZ2VuZC5qcyIsIlBpZUNoYXJ0LmpzIiwiUGxheS5qcyIsIlBvcFVwLmpzIiwiUmVnSW5mby5qcyIsIlJlZ0luZm9Nb2JpbGUuanMiLCJTY3JvbGxlci5qcyIsIlNpZGVCYXJzLmpzIiwiU3ZnTWFwLmpzIiwiVG9nbGVCdG4uanMiLCJZZWFyU2VsZWN0LmpzIiwiWWVhcnMuanMiLCJrZXlSZWFzb25DaGFydC5qcyIsIm1haW4uanMiLCJuZXdJbmZlY3RlZENoYXJ0LmpzIiwibmV3SW5mZWN0ZWRDaGFydE1vYmlsZS5qcyIsIm5vZGVfbW9kdWxlcy93b2xmeTg3LWV2ZW50ZW1pdHRlci9FdmVudEVtaXR0ZXIuanMiLCJzaGFyZS5qcyIsInV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0VBLElBQUksa0JBQW1CLENBQ25CLEdBRG1CLEVBRW5CLEdBRm1CLEVBR25CLElBSG1CLEVBSW5CLElBSm1CLEVBS25CLElBTG1CLEVBTW5CLEtBTm1CLEVBT25CLEtBUG1CLEVBUW5CLEtBUm1CLEVBU25CLEtBVG1CLEVBVW5CLEtBVm1CLEVBV25CLEtBWG1CLEVBWW5CLEtBWm1CLEVBYW5CLEtBYm1CLEVBY25CLEtBZG1CLEVBZW5CLEtBZm1CLEVBZ0JuQixLQWhCbUIsRUFpQm5CLEtBakJtQixFQWtCbkIsS0FsQm1CLEVBbUJuQixLQW5CbUIsRUFvQm5CLEtBcEJtQixFQXFCbkIsS0FyQm1CLEVBc0JuQixLQXRCbUIsQ0FBdkI7O1FBeUJVLGUsR0FBQSxlOzs7Ozs7Ozs7QUMzQlY7Ozs7OztBQUdBLFNBQVMsUUFBVCxDQUFrQixPQUFsQixFQUEyQixZQUEzQixFQUF5Qzs7QUFFdkMsTUFBSSxPQUFPLElBQVg7QUFDQSxNQUFJLFNBQVMsS0FBYjs7QUFFQSxN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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LFNBQVMsQ0FBVCxDQUFiLEVBQTBCLE9BQTFCLENBQVA7QUFDRCxHQUZNLEVBRUosSUFGSSxDQUVDLEdBRkQsQ0FBUDtBQUdELENBWkQ7O0FBZUEsSUFBSSxzQkFBc0IsU0FBdEIsbUJBQXNCLENBQVMsSUFBVCxFQUFlLEVBQWYsRUFBbUI7QUFDM0MsTUFBSSxTQUFTLGdCQUFiLEVBQStCO0FBQzdCLFFBQUksYUFBYSxRQUFqQixFQUEyQjtBQUN6QjtBQUNBLFdBQUssZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsRUFBL0I7QUFDRCxLQUhELE1BR08sSUFBSSxrQkFBa0IsUUFBdEIsRUFBZ0M7QUFDckM7QUFDQSxXQUFLLGdCQUFMLENBQXNCLFlBQXRCLEVBQW9DLEVBQXBDO0FBQ0QsS0FITSxNQUdBO0FBQ0w7QUFDQSxXQUFLLGdCQUFMLENBQXNCLHFCQUF0QixFQUE2QyxFQUE3QztBQUNEO0FBQ0YsR0FYRCxNQVdPO0FBQUU7QUFDUCxTQUFLLFdBQUwsQ0FBaUIsY0FBakIsRUFBaUMsRUFBakM7QUFDRDtBQUVGLENBaEJEOztBQWtCQSxJQUFJLFdBQVcsU0FBWCxRQUFXLENBQUMsS0FBRCxFQUFXOztBQUV4QixRQUFNLEdBQU4sQ0FBVTtBQUNOLGFBQVM7QUFESCxHQUFWLEVBRUssVUFGTCxHQUdHLE9BSEgsQ0FHVztBQUNQLGFBQVM7QUFERixHQUhYLEVBS0ssSUFMTDtBQU1ELENBUkQ7O0FBVUEsSUFBSSxXQUFXLFNBQVgsUUFBVyxDQUFDLEtBQUQsRUFBVztBQUN4QixRQUFNLEdBQU4sQ0FBVTtBQUNSLGFBQVMsTUFERDtBQUVSLGFBQVMsQ0FGRDtBQUdSLGdCQUFZO0FBSEosR0FBVjtBQUtELENBTkQ7O1FBUVEsUSxHQUFBLFE7UUFBUyxtQixHQUFBLG1CO1FBQXFCLFksR0FBQSxZO1FBQWEsUSxHQUFBLFE7UUFBVSxRLEdBQUEsUSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJcblxubGV0IG5ld0luZmVjdGVkRGF0YSA9ICBbXG4gICAgMTAwLFxuICAgIDIwMyxcbiAgICAxNTEzLFxuICAgIDQzMTUsXG4gICAgMzk3MSxcbiAgICAxOTc1OCxcbiAgICA1OTYwOSxcbiAgICA4ODczOSxcbiAgICA1MjE3MCxcbiAgICAzOTIzMixcbiAgICAzNzAwMixcbiAgICAzOTQwNyxcbiAgICA0MzAwNyxcbiAgICA0NDcxMyxcbiAgICA1NDU2MyxcbiAgICA1ODQxMCxcbiAgICA1ODI5OCxcbiAgICA2MjM4NyxcbiAgICA3MDgzMixcbiAgICA3OTc2NCxcbiAgICA4OTY2NyxcbiAgICA5MzAwMCxcbiAgXTtcblxuICBleHBvcnQge25ld0luZmVjdGVkRGF0YX1cbiIsImltcG9ydCBTY3JvbGxlciBmcm9tIFwiLi9TY3JvbGxlclwiXG5cblxuZnVuY3Rpb24gRHJvcERvd24obWFwTWFpbiwgZHJvcERvd25FbGVtKSB7XG5cbiAgbGV0IHRoYXQgPSB0aGlzO1xuICBsZXQgaXNPcGVuID0gZmFsc2U7XG5cbiAgbGV0ICRzZWxlY3QgPSBkcm9wRG93bkVsZW0uZmluZChcIi5oZWFkXCIpO1xuICBsZXQgc2Nyb2xsYWJsZSA9IGRyb3BEb3duRWxlbS5maW5kKFwiLnNjcm9sbGFibGVcIik7XG4gIGxldCBjbG9zZUltZyA9IGRyb3BEb3duRWxlbS5maW5kKFwiIC5jbG9zZV9idXR0b24gaW1nXCIpO1xuXG4gIGxldCBjb250YWluZXIgPSBzY3JvbGxhYmxlLmZpbmQoXCIuY29udGVudFwiKTtcblxuICBsZXQgaGVhZCA9IGRyb3BEb3duRWxlbS5maW5kKFwiLnRleHRcIik7XG5cbiAgJHNlbGVjdC5jbGljayhcbiAgICBmdW5jdGlvbihlKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbWFwTWFpbi5zdGF0ZS5pc1BsYWluZyA9IGZhbHNlO1xuICAgICAgaWYgKGlzT3Blbikge1xuICAgICAgICB0aGF0LmNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGF0Lm9wZW4oKTtcbiAgICAgIH1cbiAgICB9XG4gICk7XG5cbiAgJChcIi5zY3JvbGxhYmxlXCIpLmNsaWNrKFxuICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBtYXBNYWluLnN0YXRlLmlzUGxhaW5nID0gZmFsc2U7XG4gICAgfVxuICApO1xuXG5cbiAgdGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHNjcm9sbGFibGUuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgIGlzT3BlbiA9IGZhbHNlO1xuICAgIGNsb3NlSW1nLmNzcyh7XG4gICAgICB0cmFuc2Zvcm0gOiBcInJvdGF0ZSgwZGVnKVwiLFxuICAgIH0pXG4gIH07XG5cbiAgdGhpcy5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsYWJsZS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgIGlzT3BlbiA9IHRydWU7XG4gICAgY2xvc2VJbWcuY3NzKHtcbiAgICAgIHRyYW5zZm9ybTogXCJyb3RhdGUoMTgwZGVnKVwiLFxuICAgIH0pXG4gIH07XG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAobWFwTWFpbi5zdGF0ZS5yZWdpb25JZCkge1xuICAgICAgaGVhZC50ZXh0KG1hcE1haW4uZGF0YVttYXBNYWluLnN0YXRlLnJlZ2lvbklkXS5zaG9ydE5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoZWFkLnRleHQoXCLQoNC10LPQuNC+0L1cIik7XG4gICAgfVxuXG4gICAgLy8gRGlydHkgSGFja1xuICAgIGNvbnRhaW5lci5lbXB0eSgpO1xuICAgIE9iamVjdC5rZXlzKG1hcE1haW4uZGF0YSkuZm9yRWFjaChcbiAgICAgIGZ1bmN0aW9uKHJlZ2lvbikge1xuXG4gICAgICAgIGxldCBzaG9ydE5hbWUgPSBtYXBNYWluLmRhdGFbcmVnaW9uXS5zaG9ydE5hbWU7XG5cbiAgICAgICAgbGV0IGVsZW0gPSAkKGA8ZGl2IGNsYXNzPVwiaXRlbVwiIGRhdGEtcmVnaW9uSWQ9XCIke3JlZ2lvbn1cIj4gJHtzaG9ydE5hbWV9IDwvZGl2PmApO1xuXG4gICAgICAgIGlmIChyZWdpb24gPT09IG1hcE1haW4uc3RhdGUucmVnaW9uSWQpIHtcbiAgICAgICAgICBlbGVtID0gJChgPGRpdiBjbGFzcz1cImFjdGl2ZVwiIGRhdGEtcmVnaW9uSWQ9XCIke3JlZ2lvbn1cIj4gJHtzaG9ydE5hbWV9IDwvZGl2PmApO1xuICAgICAgICB9XG5cbiAgICAgICAgY29udGFpbmVyLmFwcGVuZChlbGVtKTtcblxuICAgICAgICBlbGVtLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgIG1hcE1haW4uc3RhdGUucmVnaW9uSWQgPSB0aGlzLmRhdGFzZXQucmVnaW9uaWQ7XG4gICAgICAgICAgbWFwTWFpbi5yZW5kZXIoKTtcbiAgICAgICAgICB0aGF0LmNsb3NlKCk7XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICk7XG4gICAgdGhhdC5jbG9zZSgpO1xuICB9O1xuXG4gIHRoaXMuc2Nyb2xsZXIgPSBuZXcgU2Nyb2xsZXIoZHJvcERvd25FbGVtLmZpbmQoXCIuc2Nyb2xsYWJsZVwiKSk7XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgRHJvcERvd247XG4iLCJmdW5jdGlvbiBEcm9wRG93bk1vYmlsZShtYXBNYWluLCBkcm9wRG93bkVsZW0pIHtcbiAgbGV0IHRoYXQgPSB0aGlzO1xuICBsZXQgaXNPcGVuID0gZmFsc2U7XG4gIGxldCAkc2VsZWN0ID0gZHJvcERvd25FbGVtLmZpbmQoXCIgLmhlYWRcIik7XG4gIGxldCBzY3JvbGxhYmxlID0gZHJvcERvd25FbGVtLmZpbmQoXCIuc2Nyb2xsYWJsZVwiKTtcbiAgbGV0IGNsb3NlSW1nID0gZHJvcERvd25FbGVtLmZpbmQoXCIgLmNsb3NlX2J1dHRvbiBpbWdcIik7XG5cbiAgbGV0IGNvbnRhaW5lciA9IHNjcm9sbGFibGUuZmluZChcIi5jb250ZW50XCIpO1xuXG4gIGxldCBoZWFkID0gZHJvcERvd25FbGVtLmZpbmQoXCIudGV4dFwiKTtcblxuICBsZXQgZHJvcERvd25FbGVtcyA9IGRyb3BEb3duRWxlbS5maW5kKFwiLnRvZ2xlLWFicy1yZWxcIik7XG5cbiAgJHNlbGVjdC5jbGljayhcbiAgICBmdW5jdGlvbihlKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgaWYgKGlzT3Blbikge1xuICAgICAgICB0aGF0LmNsb3NlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGF0Lm9wZW4oKTtcbiAgICAgIH1cbiAgICB9XG4gICk7XG5cbiAgJChcIi5zY3JvbGxhYmxlXCIpLmNsaWNrKFxuICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuICApO1xuXG4gIHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBzY3JvbGxhYmxlLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICBpc09wZW4gPSBmYWxzZTtcbiAgICBjbG9zZUltZy5jc3Moe1xuICAgICAgdHJhbnNmb3JtIDogXCJyb3RhdGUoMGRlZylcIixcbiAgICB9KVxuICB9O1xuXG4gIHRoaXMub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgIHNjcm9sbGFibGUuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICBpc09wZW4gPSB0cnVlO1xuICAgIGNsb3NlSW1nLmNzcyh7XG4gICAgICB0cmFuc2Zvcm06IFwicm90YXRlKDE4MGRlZylcIixcbiAgICB9KVxuICB9O1xuXG4gIGRyb3BEb3duRWxlbXMuY2xpY2soZnVuY3Rpb24oZSl7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBtYXBNYWluLnN0YXRlLmRpc3BsYXkgPSB0aGlzLmRhdGFzZXQuZGlzcGxheXR5cGU7XG4gICAgbWFwTWFpbi5yZW5kZXIoKTtcbiAgICB0aGF0LmNsb3NlKCk7XG4gIH0pXG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICAkLmVhY2goIGRyb3BEb3duRWxlbXMsIChpLGUpPT4ge1xuICAgICAgaWYoZS5kYXRhc2V0LmRpc3BsYXl0eXBlID09IG1hcE1haW4uc3RhdGUuZGlzcGxheSl7XG4gICAgICAgIGUuY2xhc3NMaXN0LmFkZChcImFjdGl2ZVwiKVxuICAgICAgICBoZWFkLnRleHQoZS5pbm5lckhUTUwpXG4gICAgICB9ZWxzZXtcbiAgICAgICAgZS5jbGFzc0xpc3QucmVtb3ZlKFwiYWN0aXZlXCIpXG4gICAgICB9XG4gICAgfSApXG4gICAgdGhhdC5jbG9zZSgpO1xuICB9O1xufVxuXG5leHBvcnQgZGVmYXVsdCBEcm9wRG93bk1vYmlsZTtcbiIsIlxuaW1wb3J0IEV2ZW50RW1pdHRlciBmcm9tIFwid29sZnk4Ny1ldmVudGVtaXR0ZXJcIjtcbmltcG9ydCB7c2hvd0VsZW0sIGhpZGVFbGVtfSBmcm9tIFwiLi91dGlsc1wiXG5cblxubGV0IHNjcm9sbFRvRWxlbVRvcCA9ICgkZWxlbSwgaXNMYXN0KSA9PiB7XG5cbiAgY29uc29sZS5sb2cod2luZG93LmRpc2FibGVTY3JvbGwpO1xuXG4gIGxldCB3aW5IZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KClcblxuICBsZXQgaGVscGVyRWxlbSA9ICQoJy5wcm9wJyk7XG5cbiAgbGV0IHNldEhlbHBlclBvc290aW4gPSAod2luSGVpZ2h0LCRlbGVtKSA9PiB7XG4gICAgbGV0IGhlbHBlclBvc2l0aW9uID0gKCRlbGVtLm9mZnNldCgpLnRvcCArIHdpbkhlaWdodCk7XG5cbiAgICBpZiAoIGhlbHBlclBvc2l0aW9uID4gaGVscGVyRWxlbS5vZmZzZXQoKS50b3ApIHtcbiAgICAgIGhlbHBlckVsZW0uY3NzKHtcbiAgICAgICAgdG9wOiBoZWxwZXJQb3NpdGlvblxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiBpZighaXNMYXN0KSBzZXRIZWxwZXJQb3NvdGluKHdpbkhlaWdodCAsJGVsZW0pO1xuXG5cbiBsZXQgdG9wUG9zaXRpb24gPSAgJGVsZW0ub2Zmc2V0KCkudG9wXG5cbiAvL9C/0LXRgNC10LzQvtGC0LrQsCDQuiDQvdGD0LbQvdC+0LzRgyDQvNC10YHRgtGDXG4gJCgnYm9keScpLmNsZWFyUXVldWUoKVxuICAgLmFuaW1hdGUoe1xuICAgICBzY3JvbGxUb3A6IHRvcFBvc2l0aW9uLFxuICAgfSwge1xuICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgZG9uZTogKCk9PiB3aW5kb3cuZGlzYWJsZVNjcm9sbCA9IGZhbHNlXG4gICB9KTtcbn1cblxuXG5mdW5jdGlvbiBGb290ZXIoaWQpIHtcblxuICBsZXQgZm9vdGVyID0gJChcIi5wbGF0ZTExLCAubGluZS5ib3R0b21cIik7XG5cbiAgdGhpcy5lZSA9IG5ldyBFdmVudEVtaXR0ZXIoKTtcblxuICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBoaWRlRWxlbShmb290ZXIpXG4gIH07XG5cbiAgbGV0IHRoYXQgPSB0aGlzO1xuXG4gICQoJy5zY3JvbGxCdG4nKVtpZF0ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgIHRoYXQuc2hvdygpO1xuICB9O1xuXG4gIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKCkge1xuICAgIC8vIHNpZGVCYXJzLnNlbGVjdChpZCk7XG4gICAgdGhpcy5lZS5lbWl0RXZlbnQoXCJzaG93XCIsW2lkXSlcbiAgICB0aGlzLmlzU2hvd24gPSB0cnVlO1xuICAgIHNob3dFbGVtKGZvb3RlcilcbiAgICBzY3JvbGxUb0VsZW1Ub3AoJCgkKCcuZm9vdGVyJylbaWRdKSx0cnVlKVxuXG4gIH07XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBGb290ZXI7XG4iLCJpbXBvcnQge2dldENvbG9yfSBmcm9tIFwiLi91dGlsc1wiXG5cbmZ1bmN0aW9uIExlZ2VuZChtYXBNYWluKSB7XG5cbiAgbGV0IGluaXRDb2xvcnMgPSBmdW5jdGlvbigpIHtcbiAgICAkKFwiLmxlZ2VuZCAuYmxvYyAuY29sb3JcIikuZWFjaChmdW5jdGlvbihpZCwgZSkge1xuICAgICAgbGV0IGNvbG9yID0gZ2V0Q29sb3IoKGlkICsgMSkgLyAxMCk7XG4gICAgICAkKGUpLmNzcyh7XG4gICAgICAgIFwiYmFja2dyb3VuZC1jb2xvclwiOiBjb2xvclxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IHJlbmRlclZhbHVlcyA9IGZ1bmN0aW9uKCkge1xuICAgIGxldCBtdWx0aXBsaWVyID0gbWFwTWFpbi5zdGF0ZS5kaXNwbGF5ID09IFwiYWJzXCIgPyAxMDAgOiAxMDtcblxuICAgICQoXCIubGVnZW5kIC5ibG9jIC52YWxcIikuZWFjaChmdW5jdGlvbihpZCwgZSkge1xuICAgICAgJChlKS50ZXh0KG11bHRpcGxpZXIgKiBNYXRoLnBvdygyLCBpZCkpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGluaXRDb2xvcnMoKTtcbiAgICByZW5kZXJWYWx1ZXMoKTtcbiAgfTtcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHJlbmRlclZhbHVlcygpO1xuICB9O1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IExlZ2VuZDtcbiIsImZ1bmN0aW9uIFBpZUNoYXJ0KG1haW5FbGVtLCByYWQpIHtcbiAgbGV0IHBhdGggPSBudWxsO1xuICBsZXQgc3ZnRWxlbSA9IG1haW5FbGVtLmZpbmQoXCIjc3ZnLXBpZVwiKVswXTtcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKGRlZykge1xuICAgIGlmICghc3ZnRWxlbSkgcmV0dXJuO1xuICAgIGlmIChwYXRoKSB7XG4gICAgICBzdmdFbGVtLnJlbW92ZUNoaWxkKHBhdGgpO1xuICAgICAgcGF0aCA9IG51bGw7XG4gICAgfVxuICAgIGlmIChpc05hTihkZWcpKSByZXR1cm47XG5cbiAgICBpZiAoZGVnID4gMzU5KSB7XG4gICAgICBwYXRoID0gc3ZnRWxlbS5xdWVyeVNlbGVjdG9yKFwiY2lyY2xlXCIpLmNsb25lTm9kZSh0cnVlKTtcbiAgICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInVybCgjaW1nMSlcIik7XG4gICAgICBzdmdFbGVtLmFwcGVuZENoaWxkKHBhdGgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjeCA9IHJhZCxcbiAgICAgIGN5ID0gcmFkLFxuICAgICAgcnggPSByYWQsXG4gICAgICByeSA9IHJhZDtcblxuICAgIGxldCBwID0gc3ZnRWxlbS5jcmVhdGVTVkdQb2ludCgpO1xuICAgIHAueCA9IDA7XG4gICAgcC55ID0gMTtcblxuXG4gICAgbGV0IG0gPSBzdmdFbGVtLmNyZWF0ZVNWR01hdHJpeCgpO1xuXG5cbiAgICBsZXQgcDIgPSBwLm1hdHJpeFRyYW5zZm9ybShtLnJvdGF0ZShkZWcpKTtcblxuICAgIHAyLnggPSBjeCAtIHAyLnggKiByeDtcbiAgICBwMi55ID0gY3kgLSBwMi55ICogcnk7XG5cbiAgICBwYXRoID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudE5TKFwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiwgXCJwYXRoXCIpO1xuXG4gICAgbGV0IGQ7XG5cbiAgICBpZiAoZGVnID4gMTgwKSB7XG4gICAgICBkID0gXCJNXCIgKyBjeCArIFwiIFwiICsgKGN5IC0gcnkpICsgXCJBXCIgKyByeCArIFwiIFwiICsgcnkgKyBcIiAwIDEgMVwiICsgcDIueCArIFwiIFwiICsgcDIueSArIFwiTFwiICsgY3ggKyBcIiBcIiArIGN5ICsgXCJ6XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGQgPSBcIk1cIiArIGN4ICsgXCIgXCIgKyAoY3kgLSByeSkgKyBcIkFcIiArIHJ4ICsgXCIgXCIgKyByeSArIFwiIDAgMCAxXCIgKyBwMi54ICsgXCIgXCIgKyBwMi55ICsgXCJMXCIgKyBjeCArIFwiIFwiICsgY3kgKyBcInpcIjtcbiAgICB9XG5cbiAgICBwYXRoLnNldEF0dHJpYnV0ZShcImRcIiwgZCk7XG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJmaWxsXCIsIFwidXJsKCNpbWcxKVwiKTtcblxuICAgIHN2Z0VsZW0uYXBwZW5kQ2hpbGQocGF0aCk7XG5cbiAgfTtcblxufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgUGllQ2hhcnRcbiIsImZ1bmN0aW9uIFBsYXkobWFwTWFpbikge1xuXG4gIGxldCB0aGF0ID0gdGhpcztcblxuICB0aGlzLnBsYXkgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIW1hcE1haW4uc3RhdGUuaXNQbGFpbmcpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAobWFwTWFpbi5yZW5kZXIpIHtcblxuICAgICAgaWYgKG1hcE1haW4uc3RhdGUueWVhciA9PSAyMDE0KSB7XG4gICAgICAgIG1hcE1haW4uc3RhdGUueWVhciA9IDE5OTRcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hcE1haW4uc3RhdGUueWVhcisrO1xuICAgICAgfVxuXG4gICAgICBtYXBNYWluLnJlbmRlcigpO1xuICAgIH1cblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICB0aGF0LnBsYXkoKTtcbiAgICB9LCAxMDAwKTtcbiAgfVxuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFBsYXk7XG4iLCJpbXBvcnQgUGllQ2hhcnQgZnJvbSBcIi4vUGllQ2hhcnRcIlxuXG5mdW5jdGlvbiBQb3BVcChtYXBNYWluLCBtYWluRWxlbSwgcmFkLCBpc01vYmlsZSkge1xuXG5cbiAgbGV0IHBpZUNoYXJ0ID0gbmV3IFBpZUNoYXJ0KG1haW5FbGVtLCByYWQpO1xuXG4gIGxldCBwb3BVcCA9IG1haW5FbGVtO1xuICBsZXQgY2xvc2VCdXR0b24gPSBwb3BVcC5maW5kKFwiLmhlYWQgLmJ0bi5jbG9zZVwiKTtcbiAgbGV0IHBpZUNvbnRhaW5lciA9IHBvcFVwLmZpbmQoXCIuYm9keSAucGllXCIpO1xuXG4gIGxldCBkYXRhRmllbGRzID0gcG9wVXAuZmluZChcIi5ib2R5IC5kYXRhIC5pdGVtXCIpO1xuICBsZXQgc3RhdGVOYW1lRmVhbGQgPSBwb3BVcC5maW5kKFwiLmhlYWQgLnJlZ2lvbiBzcGFuXCIpO1xuICBsZXQgaW5mZWN0ZWRGZWFsZCA9IGRhdGFGaWVsZHMuZmluZChcIi5pbmZlY3RlZFwiKTtcbiAgbGV0IGRpZWRGZWFsZCA9IGRhdGFGaWVsZHMuZmluZChcIi5kZWFkXCIpO1xuICAvLyBjb25zb2xlLmxvZyhpbmZlY3RlZEZlYWxkKTtcbiAgbGV0IGluZmVjdGVkVGV4dEZlYWxkID0gJChkYXRhRmllbGRzLmZpbmQoXCIubGFiZWxcIilbMF0pO1xuICAvLyBjb25zb2xlLmxvZyhkYXRhRmllbGRzLmZpbmQoXCIubGFiZWxcIilbMF0saW5mZWN0ZWRUZXh0RmVhbGQpO1xuXG4gIGxldCBjbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIGhpZGUoKTtcbiAgICBtYXBNYWluLnN0YXRlLnJlZ2lvbklkID0gXCJcIjtcbiAgICBtYXBNYWluLnJlbmRlcigpO1xuICB9O1xuXG4gIGNsb3NlQnV0dG9uLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICBjbG9zZSgpO1xuICB9KTtcblxuICBsZXQgaGlkZSA9IGZ1bmN0aW9uKCkge1xuICAgIHBvcFVwLmNzcygnb3BhY2l0eScsIDApO1xuICAgIHBvcFVwLmNzcygndmlzaWJpbGl0eScsIFwiaGlkZGVuXCIpO1xuXG4gIH07XG5cbiAgbGV0IG9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICBwb3BVcC5jc3MoJ29wYWNpdHknLCAxKTtcbiAgICBwb3BVcC5jc3MoJ3Zpc2liaWxpdHknLCBcInZpc2libGVcIik7XG4gIH07XG5cblxuICBwb3BVcC5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgfSk7XG5cblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmICghbWFwTWFpbi5zdGF0ZS5yZWdpb25JZCkge1xuICAgICAgaGlkZSgpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBuYW1lLCBpbmZlY3RlZCwgZGllZCwgaW5mZWN0ZWRUZXh0O1xuICAgIGlmIChpc01vYmlsZSkge1xuICAgICAgbmFtZSA9IG1hcE1haW4uZGF0YVttYXBNYWluLnN0YXRlLnJlZ2lvbklkXS5zaG9ydE5hbWU7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5hbWUgPSBtYXBNYWluLmRhdGFbbWFwTWFpbi5zdGF0ZS5yZWdpb25JZF0ubmFtZTtcbiAgICB9XG5cbiAgICBpZiAobWFwTWFpbi5zdGF0ZS5kaXNwbGF5ID09IFwicmVsXCIpIHtcbiAgICAgIHBpZUNvbnRhaW5lci5oaWRlKCk7XG4gICAgICAkKGRhdGFGaWVsZHNbMV0pLmhpZGUoKTtcbiAgICAgICQoZGF0YUZpZWxkc1swXSkuZmluZChcIi5pbmZlY3RlZFwiKS5jc3Moe1xuICAgICAgICB3aWR0aDogXCJhdXRvXCJcbiAgICAgIH0pO1xuICAgICAgZGllZCA9IG51bGw7XG4gICAgICBpbmZlY3RlZCA9IG1hcE1haW4uZGF0YVttYXBNYWluLnN0YXRlLnJlZ2lvbklkXS5yZWxJbmZlY3RlZFttYXBNYWluLnN0YXRlLnllYXJdIHx8IFwi0L0v0LRcIjtcbiAgICAgIGluZmVjdGVkVGV4dCA9IFwi0KfQuNGB0LvQviDQuNC90YTQuNGG0LjRgNC+0LLQsNC90L3Ri9GFINC90LAmbmJzcDsxMDAg0YLRi9GB0Y/RhyDQvdCw0YHQtdC70LXQvdC40Y9cIjtcbiAgICB9IGVsc2Uge1xuICAgICAgaW5mZWN0ZWQgPSBtYXBNYWluLmRhdGFbbWFwTWFpbi5zdGF0ZS5yZWdpb25JZF0uYWJzSW5mZWN0ZWRbbWFwTWFpbi5zdGF0ZS55ZWFyXSB8fCBcItC9L9C0XCI7XG4gICAgICBkaWVkID0gbWFwTWFpbi5kYXRhW21hcE1haW4uc3RhdGUucmVnaW9uSWRdLmFic0RpZWRbbWFwTWFpbi5zdGF0ZS55ZWFyXSB8fCBcItC9L9C0XCI7XG4gICAgICBwaWVDb250YWluZXIuc2hvdygpO1xuICAgICAgJChkYXRhRmllbGRzWzFdKS5zaG93KCk7XG4gICAgICAkKGRhdGFGaWVsZHNbMF0pLmZpbmQoXCIuaW5mZWN0ZWRcIikuY3NzKHtcbiAgICAgICAgd2lkdGg6IFwiMjMlXCJcbiAgICAgIH0pO1xuICAgICAgcGllQ2hhcnQucmVuZGVyKDM2MCAqIChkaWVkIC8gaW5mZWN0ZWQpKTtcbiAgICAgIGluZmVjdGVkVGV4dCA9IFwi0J7QsdGJ0LXQtSDRh9C40YHQu9C+INC40L3RhNC40YbQuNGA0L7QstCw0L3QvdGL0YVcIjtcbiAgICB9XG5cbiAgICBzdGF0ZU5hbWVGZWFsZC50ZXh0KG5hbWUpO1xuICAgIGluZmVjdGVkRmVhbGQudGV4dChpbmZlY3RlZCk7XG4gICAgaW5mZWN0ZWRUZXh0RmVhbGQuaHRtbChpbmZlY3RlZFRleHQpO1xuICAgIGRpZWRGZWFsZC50ZXh0KGRpZWQpO1xuXG4gICAgLy8gaWYgKG1hcE1haW4uc3RhdGUucmVnaW9uSWQgJiYgIWlzTW9iaWxlKSB7XG4gICAgLy8gICAgc2V0UG9zaXRpb24oZmluZFBvc2l0aW9uKCkpO1xuICAgIC8vIH1cbiAgICBvcGVuKCk7XG4gIH07XG5cbn1cblxuXG5leHBvcnQgZGVmYXVsdCBQb3BVcFxuIiwiLy9cbi8vXG4vLyBpbXBvcnQge2FkZE1vdXNlZXdoZWVsRXZlbnR9IGZyb20gXCIuL3V0aWxzXCI7XG4vLyBpbXBvcnQgRHJvcERvd25Nb2JpbGUgZnJvbSBcIi4vRHJvcERvd25Nb2JpbGVcIjtcbi8vXG4vLyBpbXBvcnQge2dldENvbG9yfSBmcm9tIFwiLi91dGlsc1wiO1xuXG5cblxuXG5cbmltcG9ydCBTdmdNYXAgZnJvbSBcIi4vU3ZnTWFwXCI7XG5pbXBvcnQgTGVnZW5kIGZyb20gXCIuL0xlZ2VuZFwiO1xuaW1wb3J0IFllYXJzIGZyb20gIFwiLi9ZZWFyc1wiO1xuaW1wb3J0IERyb3BEb3duIGZyb20gXCIuL0Ryb3BEb3duXCI7XG5pbXBvcnQgUG9wVXAgZnJvbSBcIi4vUG9wVXBcIjtcbmltcG9ydCBUb2dsZUJ0biBmcm9tICcuL1RvZ2xlQnRuJztcbmltcG9ydCBQbGF5IGZyb20gXCIuL1BsYXlcIjtcblxuXG5cblxuZnVuY3Rpb24gUmVnSW5mbyhkYXRhKSB7XG5cbiAgdGhpcy5kYXRhID0gZGF0YTtcbiAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS1NYXAgU3RhdGUtLS0tLS0tLS0tLS1cbiAgdGhpcy5zdGF0ZSA9IHtcbiAgICB5ZWFyOiAyMDEyLFxuICAgIHJlZ2lvbklkOiBcIlwiLFxuICAgIGRpc3BsYXk6IFwiYWJzXCIsXG4gICAgaXNQbGFpbmc6IHRydWUsXG4gIH07XG5cbiAgdGhpcy5wb3BVcEVsZW0gPSAkKFwiLmhpZGUtbW9iaWxlIC5iYW5uZXJcIik7XG5cbiAgbGV0IHN2Z01hcCA9IG5ldyBTdmdNYXAodGhpcyk7XG4gIGxldCBsZWdlbmQgPSBuZXcgTGVnZW5kKHRoaXMpO1xuICBsZXQgeWVhcnMgPSBuZXcgWWVhcnModGhpcyk7XG4gIGxldCBkcm9wRG93biA9IG5ldyBEcm9wRG93bih0aGlzLCAkKFwiLm1hcC5oaWRlLW1vYmlsZSAuaXRlbS5kcm9wX2Rvd25cIikpO1xuICBsZXQgcG9wVXAgPSBuZXcgUG9wVXAodGhpcywgdGhpcy5wb3BVcEVsZW0sIDQwLCBmYWxzZSk7XG4gIGxldCB0b2dsZUJ0biA9IG5ldyBUb2dsZUJ0bih0aGlzKTtcbiAgbGV0IHBsYXkgPSBuZXcgUGxheSh0aGlzKTtcblxuXG4gIGxldCBmaW5kUG9zaXRpb24gPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIXN2Z01hcC5zZWxlY3RlZFJlZykgcmV0dXJuO1xuXG4gICAgbGV0IG1hcFJlY3QgPSBzdmdNYXAubWFwRWxlbS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgcmVnUmVjdCA9IHN2Z01hcC5zZWxlY3RlZFJlZy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgcG9wVXBSZWN0ID0gc2VsZi5wb3BVcEVsZW1bMF0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICBsZXQgdG9wLCBsZWZ0O1xuXG4gICAgbGVmdCA9IHJlZ1JlY3QubGVmdCArIHJlZ1JlY3Qud2lkdGg7XG4gICAgdG9wID0gcmVnUmVjdC50b3AgLSBwb3BVcFJlY3QuaGVpZ2h0O1xuICAgIGlmICh0b3AgPCBtYXBSZWN0LnRvcCkge1xuICAgICAgdG9wID0gbWFwUmVjdC50b3AgKyAyMDtcbiAgICB9XG4gICAgaWYgKGxlZnQgKyBwb3BVcFJlY3Qud2lkdGggPiBtYXBSZWN0LmxlZnQgKyBtYXBSZWN0LndpZHRoKSB7XG4gICAgICBsZWZ0ID0gcmVnUmVjdC5sZWZ0IC0gcG9wVXBSZWN0LndpZHRoO1xuICAgIH1cblxuICAgIGxlZnQgPSBsZWZ0ICsgcGFnZVhPZmZzZXQ7XG4gICAgdG9wID0gdG9wICsgcGFnZVlPZmZzZXQ7XG5cbiAgICByZXR1cm4ge1xuICAgICAgdG9wOiB0b3AsXG4gICAgICBsZWZ0OiBsZWZ0LFxuICAgIH07XG4gIH07XG5cbiAgbGV0IHNldFBvc2l0aW9uID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKCFvYmopIHJldHVybjtcbiAgICBsZXQgZm9ybWF0ID0gW1wicmlnaHRcIiwgXCJ0b3BcIiwgXCJsZWZ0XCIsIFwiYm90dG9tXCJdO1xuICAgIGZvcm1hdC5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgIHNlbGYucG9wVXBFbGVtWzBdLnN0eWxlW3Byb3BdID0gb2JqW3Byb3BdID8gb2JqW3Byb3BdICsgXCJweFwiIDogXCJcIjtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHN2Z01hcC5yZW5kZXIoKTtcbiAgICB5ZWFycy5yZW5kZXIoKTtcbiAgICBkcm9wRG93bi5yZW5kZXIoKTtcbiAgICBsZWdlbmQucmVuZGVyKCk7XG4gICAgcG9wVXAucmVuZGVyKCk7XG4gICAgdG9nbGVCdG4ucmVuZGVyKCk7XG4gICAgaWYgKHRoaXMuc3RhdGUucmVnaW9uSWQpIHtcblxuICAgICAgc2V0UG9zaXRpb24oZmluZFBvc2l0aW9uKCkpO1xuICAgIH1cblxuICB9O1xuXG5cbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgbGVnZW5kLmluaXQoKTtcbiAgICBkcm9wRG93bi5zY3JvbGxlci5jcmVhdGUoKTtcbiAgICBwbGF5LnBsYXkoKTtcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXG4gICAgICBmdW5jdGlvbihlKSB7XG4gICAgICAgIHNlbGYuc3RhdGUucmVnaW9uSWQgPSBcIlwiO1xuICAgICAgICBzZWxmLnN0YXRlLmlzUGxhaW5nID0gZmFsc2U7XG4gICAgICAgIHNlbGYucmVuZGVyKCk7XG4gICAgICB9XG4gICAgKTtcblxuICAgIHdpbmRvdy5vbnJlc2l6ZSA9IGZ1bmN0aW9uKCkge1xuICAgICAgc2V0UG9zaXRpb24oZmluZFBvc2l0aW9uKCkpO1xuICAgIH07XG4gIH07XG5cbn07XG5cblxuZXhwb3J0IGRlZmF1bHQgUmVnSW5mbztcbiIsIlxuXG5cbmltcG9ydCBEcm9wRG93biBmcm9tIFwiLi9Ecm9wRG93blwiO1xuaW1wb3J0IFBvcFVwIGZyb20gXCIuL1BvcFVwXCI7XG5pbXBvcnQgVG9nbGVCdG4gZnJvbSAnLi9Ub2dsZUJ0bic7XG5pbXBvcnQgRHJvcERvd25Nb2JpbGUgZnJvbSBcIi4vRHJvcERvd25Nb2JpbGVcIjtcbmltcG9ydCBZZWFyU2VsZWN0IGZyb20gXCIuL1llYXJTZWxlY3RcIlxuXG5cblxuZnVuY3Rpb24gUmVnSW5mb01vYmlsZShkYXRhKSB7XG5cbiAgdGhpcy5kYXRhID0gZGF0YTtcbiAgbGV0IG1hcE1haW4gPSB0aGlzO1xuXG4gIC8vIC0tLS0tLS0tLS0tLS1NYXAgU3RhdGUtLS0tLS0tLS0tLS1cbiAgdGhpcy5zdGF0ZSA9IHtcbiAgICB5ZWFyOiAxOTk5LFxuICAgIHJlZ2lvbklkOiBcItCc0L7RgdC60LLQsFwiLFxuICAgIGRpc3BsYXk6IFwiYWJzXCJcbiAgfTtcblxuICBsZXQgZHJvcERvd24gPSBuZXcgRHJvcERvd24odGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAkKFwiLm1hcC5oaWRlLWRlc2t0b3AgLml0ZW0uZHJvcF9kb3duOmxhc3Qtb2YtdHlwZVwiKVxuICAgICAgICAgICAgICAgICAgICApO1xuICBsZXQgZHJvcERvd25Nb2JpbGUgPSBuZXcgRHJvcERvd25Nb2JpbGUodGhpcyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgJChcIi5tYXAuaGlkZS1kZXNrdG9wIC5pdGVtLmRyb3BfZG93blwiKS5maXJzdCgpXG4gICAgICAgICAgICAgICAgICAgICk7XG4gIGxldCBwb3BVcCA9IG5ldyBQb3BVcCh0aGlzLCAkKFwiLmhpZGUtZGVza3RvcCAuYmFubmVyXCIpLCA1MCwgdHJ1ZSk7XG4gIGxldCB5ZWFyU2VsZWN0ID0gbmV3IFllYXJTZWxlY3QodGhpcywgJCgnLnllYXItc2VsZWN0JykpO1xuXG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgZHJvcERvd24ucmVuZGVyKCk7XG4gICAgcG9wVXAucmVuZGVyKCk7XG4gICAgeWVhclNlbGVjdC5yZW5kZXIoKTtcbiAgICBkcm9wRG93bk1vYmlsZS5yZW5kZXIoKTtcbiAgfTtcblxuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGRyb3BEb3duLnNjcm9sbGVyLmNyZWF0ZSgpO1xuXG4gICAgZG9jdW1lbnQuYm9keS5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIixcbiAgICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgbWFwTWFpbi5yZW5kZXIoKTtcbiAgICAgIH1cbiAgICApO1xuICB9O1xuXG59O1xuXG5cblxuZXhwb3J0IGRlZmF1bHQgUmVnSW5mb01vYmlsZTtcbiIsImltcG9ydCB7YWRkTW91c2Vld2hlZWxFdmVudH0gZnJvbSBcIi4vdXRpbHNcIjtcblxuXG5mdW5jdGlvbiBTY3JvbGxlcihtYWluRWxlbSkge1xuICBsZXQgc2Nyb2xsQ29udGFpbmVyID0gbWFpbkVsZW1bMF0sXG4gICAgc2Nyb2xsQ29udGVudFdyYXBwZXIgPSBtYWluRWxlbS5maW5kKCcuY29udGVudC13cmFwcGVyJylbMF0sXG4gICAgc2Nyb2xsQ29udGVudCA9IG1haW5FbGVtLmZpbmQoJy5jb250ZW50JylbMF0sXG4gICAgY29udGVudFBvc2l0aW9uID0gMCxcbiAgICBzY3JvbGxlckJlaW5nRHJhZ2dlZCA9IGZhbHNlLFxuICAgIHNjcm9sbGVyLFxuICAgIHRvcFBvc2l0aW9uLFxuICAgIHNjcm9sbGVySGVpZ2h0LFxuICAgIG5vcm1hbGl6ZWRQb3NpdGlvbjtcblxuICBmdW5jdGlvbiBjYWxjdWxhdGVTY3JvbGxlckhlaWdodCgpIHtcbiAgICAvLyAqQ2FsY3VsYXRpb24gb2YgaG93IHRhbGwgc2Nyb2xsZXIgc2hvdWxkIGJlXG4gICAgbGV0IHZpc2libGVSYXRpbyA9IHNjcm9sbENvbnRhaW5lci5vZmZzZXRIZWlnaHQgLyBzY3JvbGxDb250ZW50V3JhcHBlci5zY3JvbGxIZWlnaHQ7XG4gICAgdmlzaWJsZVJhdGlvID0gMC4wNTtcbiAgICByZXR1cm4gdmlzaWJsZVJhdGlvICogc2Nyb2xsQ29udGFpbmVyLm9mZnNldEhlaWdodDtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1vdmVTY3JvbGxlcihldnQpIHtcbiAgICAvLyBNb3ZlIFNjcm9sbCBiYXIgdG8gdG9wIG9mZnNldFxuICAgIGxldCBzY3JvbGxQZXJjZW50YWdlID0gZXZ0LnRhcmdldC5zY3JvbGxUb3AgLyBzY3JvbGxDb250ZW50V3JhcHBlci5zY3JvbGxIZWlnaHQ7XG4gICAgdG9wUG9zaXRpb24gPSBzY3JvbGxQZXJjZW50YWdlICogKHNjcm9sbENvbnRhaW5lci5vZmZzZXRIZWlnaHQgKiAwLjkxNSkgKyBzY3JvbGxDb250YWluZXIub2Zmc2V0SGVpZ2h0ICogMC4wNTsgLy8gNXB4IGFyYml0cmFyeSBvZmZzZXQgc28gc2Nyb2xsIGJhciBkb2Vzbid0IG1vdmUgdG9vIGZhciBiZXlvbmQgY29udGVudCB3cmFwcGVyIGJvdW5kaW5nIGJveFxuICAgIHNjcm9sbGVyLnN0eWxlLnRvcCA9IHRvcFBvc2l0aW9uICsgJ3B4JztcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0YXJ0RHJhZyhldnQpIHtcbiAgICBub3JtYWxpemVkUG9zaXRpb24gPSBldnQucGFnZVk7XG4gICAgY29udGVudFBvc2l0aW9uID0gc2Nyb2xsQ29udGVudFdyYXBwZXIuc2Nyb2xsVG9wO1xuICAgIHNjcm9sbGVyQmVpbmdEcmFnZ2VkID0gdHJ1ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHN0b3BEcmFnKGV2dCkge1xuICAgIHNjcm9sbGVyQmVpbmdEcmFnZ2VkID0gZmFsc2U7XG4gIH1cblxuICBmdW5jdGlvbiBzY3JvbGxCYXJTY3JvbGwoZXZ0KSB7XG4gICAgaWYgKHNjcm9sbGVyQmVpbmdEcmFnZ2VkID09PSB0cnVlKSB7XG4gICAgICBsZXQgbW91c2VEaWZmZXJlbnRpYWwgPSBldnQucGFnZVkgLSBub3JtYWxpemVkUG9zaXRpb247XG4gICAgICBsZXQgc2Nyb2xsRXF1aXZhbGVudCA9IG1vdXNlRGlmZmVyZW50aWFsICpcbiAgICAgICAgKHNjcm9sbENvbnRlbnRXcmFwcGVyLnNjcm9sbEhlaWdodCAvIHNjcm9sbENvbnRhaW5lci5vZmZzZXRIZWlnaHQpO1xuICAgICAgc2Nyb2xsQ29udGVudFdyYXBwZXIuc2Nyb2xsVG9wID0gY29udGVudFBvc2l0aW9uICsgc2Nyb2xsRXF1aXZhbGVudDtcbiAgICB9XG4gIH1cblxuICB0aGlzLmNyZWF0ZSA9IGZ1bmN0aW9uKCkge1xuICAgIC8vICpDcmVhdGVzIHNjcm9sbGVyIGVsZW1lbnQgYW5kIGFwcGVuZHMgdG8gJy5zY3JvbGxhYmxlJyBkaXZcbiAgICAvLyBjcmVhdGUgc2Nyb2xsZXIgZWxlbWVudFxuICAgIHNjcm9sbGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICBzY3JvbGxlci5jbGFzc05hbWUgPSAnc2Nyb2xsZXInO1xuXG4gICAgLy8gZGV0ZXJtaW5lIGhvdyBiaWcgc2Nyb2xsZXIgc2hvdWxkIGJlIGJhc2VkIG9uIGNvbnRlbnRcbiAgICBzY3JvbGxlckhlaWdodCA9IGNhbGN1bGF0ZVNjcm9sbGVySGVpZ2h0KCk7XG5cbiAgICBpZiAoc2Nyb2xsZXJIZWlnaHQgLyBzY3JvbGxDb250YWluZXIub2Zmc2V0SGVpZ2h0IDwgMSkge1xuICAgICAgLy8gKklmIHRoZXJlIGlzIGEgbmVlZCB0byBoYXZlIHNjcm9sbCBiYXIgYmFzZWQgb24gY29udGVudCBzaXplXG4gICAgICBzY3JvbGxlci5zdHlsZS5oZWlnaHQgPSBzY3JvbGxlckhlaWdodCArICdweCc7XG5cbiAgICAgIC8vIGFwcGVuZCBzY3JvbGxlciB0byBzY3JvbGxDb250YWluZXIgZGl2XG4gICAgICBzY3JvbGxDb250YWluZXIuYXBwZW5kQ2hpbGQoc2Nyb2xsZXIpO1xuXG4gICAgICAvLyBzaG93IHNjcm9sbCBwYXRoIGRpdm90XG4gICAgICBzY3JvbGxDb250YWluZXIuY2xhc3NOYW1lICs9ICcgc2hvd1Njcm9sbCc7XG5cbiAgICAgIC8vIGF0dGFjaCByZWxhdGVkIGRyYWdnYWJsZSBsaXN0ZW5lcnNcbiAgICAgIHNjcm9sbGVyLmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNlZG93bicsIHN0YXJ0RHJhZyk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHN0b3BEcmFnKTtcbiAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCBzY3JvbGxCYXJTY3JvbGwpO1xuICAgIH1cblxuICB9XG5cbiAgbGV0IG9uV2hlZWwgPSAoZSkgPT4gZS5zdG9wUHJvcGFnYXRpb24oKVxuXG4gIGFkZE1vdXNlZXdoZWVsRXZlbnQoc2Nyb2xsQ29udGVudFdyYXBwZXIsb25XaGVlbCk7XG5cbiAgLy8gKioqIExpc3RlbmVycyAqKipcbiAgc2Nyb2xsQ29udGVudFdyYXBwZXIuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgbW92ZVNjcm9sbGVyKTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBTY3JvbGxlcjtcbiIsIlxuaW1wb3J0IHtzaG93RWxlbX0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSBcIndvbGZ5ODctZXZlbnRlbWl0dGVyXCI7XG5cbmZ1bmN0aW9uIFNpZGVCYXJzKHF1aXpFbGVtcykge1xuICBsZXQgc3RhdGUgPSB7XG4gICAgaXNWaXNpYmxlOiBudWxsLFxuICB9XG5cbiAgbGV0ICRtYWluRWxlbSA9ICQoXCIuc2lkZS1wYW5lbFwiKTtcbiAgbGV0ICRzaWRlQmFycyA9ICQoXCIuc2lkZS1ib3hcIik7XG5cbiAgbGV0IHNlbGVjdCA9IChpKSA9PiB7XG4gICAgJHNpZGVCYXJzLnJlbW92ZUNsYXNzKFwiYm94LXNlbGVjdGVkXCIpXG4gICAgJHNpZGVCYXJzW2ldICYmICRzaWRlQmFyc1tpXS5jbGFzc0xpc3QuYWRkKFwiYm94LXNlbGVjdGVkXCIpO1xuICB9XG5cbiAgJHNpZGVCYXJzLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgIHF1aXpFbGVtc1twYXJzZUludCh0aGlzLmRhdGFzZXQuaWQpXS5zaG93KCk7XG4gICAgc2VsZWN0KHBhcnNlSW50KHRoaXMuZGF0YXNldC5pZCkpXG4gIH0pXG5cbiAgbGV0IHJlbmRlciA9ICgpID0+IHtcblxuICAgIHF1aXpFbGVtcy5mb3JFYWNoKChlLCBpKSA9PiB7XG4gICAgICBpZiAoZS5yZXN1bHQgJiYgZS5yZXN1bHQpIHtcbiAgICAgICAgJHNpZGVCYXJzW2ldLmNsYXNzTGlzdC5hZGQoXCJib3gtdHJ1ZVwiKVxuICAgICAgfSBlbHNlIGlmIChlLnJlc3VsdCA9PT0gZmFsc2UpIHtcbiAgICAgICAgJHNpZGVCYXJzW2ldLmNsYXNzTGlzdC5hZGQoXCJib3gtZmFsc2VcIilcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cblxuICB0aGlzLnNlbGVjdCA9IHNlbGVjdDtcbiAgdGhpcy5yZW5kZXIgPSByZW5kZXI7XG4gIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKCl7XG4gICAgc2hvd0VsZW0oJG1haW5FbGVtKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFNpZGVCYXJzO1xuIiwiaW1wb3J0IHtnZXRDb2xvcn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5mdW5jdGlvbiBTdmdNYXAobWFwTWFpbikge1xuXG4gIHRoaXMucmVuZGVyID0gbnVsbDtcbiAgdGhpcy5zZWxlY3RlZFJlZyA9IG51bGw7XG4gIHRoaXMubWFwRWxlbSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3ZnLW1hcFwiKTtcbiAgbGV0IHRoYXQgPSB0aGlzO1xuXG5cbiAgbGV0IHJlZ2lvbnMgPSAkKFwiI3N2Zy1tYXAgcGF0aCwgI3N2Zy1tYXAgcG9seWdvblwiKTtcbiAgbGV0IHNlbGVjdGVkUmVnID0gbnVsbDtcblxuICBsZXQgc2V0UmVnc0NvbG9yID0gZnVuY3Rpb24oeWVhcikge1xuICAgIE9iamVjdC5rZXlzKG1hcE1haW4uZGF0YSkuZm9yRWFjaChmdW5jdGlvbihyZWdpbm9JZCkge1xuXG4gICAgICBsZXQgdmFsdWUsIHBlcmNlbnQ7XG5cbiAgICAgIGlmIChtYXBNYWluLnN0YXRlLmRpc3BsYXkgPT0gXCJhYnNcIikge1xuXG4gICAgICAgIHZhbHVlID0gbWFwTWFpbi5kYXRhW3JlZ2lub0lkXS5hYnNJbmZlY3RlZFt5ZWFyXTtcblxuICAgICAgICBpZiAodmFsdWUgPCAxMDApIHtcbiAgICAgICAgICBwZXJjZW50ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZXJjZW50ID0gKE1hdGgubG9nMih2YWx1ZSAvIDEwMCkpIC8gOTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFsdWUgPSBtYXBNYWluLmRhdGFbcmVnaW5vSWRdLnJlbEluZmVjdGVkW3llYXJdO1xuXG4gICAgICAgIGlmICh2YWx1ZSA8IDEwKSB7XG4gICAgICAgICAgcGVyY2VudCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVyY2VudCA9IChNYXRoLmxvZzIodmFsdWUgLyAxMCkpIC8gOTtcbiAgICAgICAgfVxuXG4gICAgICB9XG5cbiAgICAgICQoJyMnICsgcmVnaW5vSWQpLmNzcyh7XG4gICAgICAgICdmaWxsJzogZ2V0Q29sb3IocGVyY2VudCksXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfTtcblxuICBsZXQgc2V0U2VsZWN0ZWRSZWdpb24gPSBmdW5jdGlvbihyZWdpb25JZCkge1xuICAgIHRoYXQuc2VsZWN0ZWRSZWcgJiYgdGhhdC5zZWxlY3RlZFJlZy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICAgIGlmIChyZWdpb25JZCkge1xuICAgICAgdGhhdC5zZWxlY3RlZFJlZyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHJlZ2lvbklkKTtcbiAgICAgIHRoYXQuc2VsZWN0ZWRSZWcuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgICB9XG4gIH07XG5cblxuXG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgc2V0UmVnc0NvbG9yKG1hcE1haW4uc3RhdGUueWVhcik7XG4gICAgc2V0U2VsZWN0ZWRSZWdpb24obWFwTWFpbi5zdGF0ZS5yZWdpb25JZCk7XG4gICAgaWYgKG1hcE1haW4uc3RhdGUucmVnaW9uSWQpIHtcbiAgICAgIHRoaXMubWFwRWxlbS5jbGFzc0xpc3QuYWRkKCdyZWdTZWxlY3RlZCcpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLm1hcEVsZW0uY2xhc3NMaXN0LnJlbW92ZSgncmVnU2VsZWN0ZWQnKTtcbiAgICB9XG4gIH07XG5cbiAgcmVnaW9ucy5jbGljayhcbiAgICBmdW5jdGlvbihlKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgLy8gbWFwTWFpbi5zdGF0ZS5pc1BsYWluZyA9ZmFsc2U7XG4gICAgICBpZiAoZS50YXJnZXQuaWQgPT09IG1hcE1haW4uc3RhdGUucmVnaW9uSWQpIHtcbiAgICAgICAgdGhhdC5tYXBFbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3JlZ1NlbGVjdGVkJyk7XG4gICAgICAgIG1hcE1haW4uc3RhdGUucmVnaW9uSWQgPSBcIlwiO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWFwTWFpbi5zdGF0ZS5yZWdpb25JZCA9IGUudGFyZ2V0LmlkO1xuICAgICAgICBlLnRhcmdldC5wYXJlbnRFbGVtZW50Lmluc2VydEJlZm9yZShlLnRhcmdldCwgbnVsbCk7XG4gICAgICB9XG4gICAgICBtYXBNYWluLnJlbmRlcigpO1xuICAgIH1cbiAgKTtcbn1cblxuXG5cbmV4cG9ydCBkZWZhdWx0IFN2Z01hcDtcbiIsImZ1bmN0aW9uIFRvZ2xlQnRuKG1hcE1haW4pIHtcbiAgbGV0IGJ0biA9ICQoXCIubWFwIC5tYXBfaGVhZGVyIC5idG5cIik7XG5cbiAgYnRuLmNsaWNrKGZ1bmN0aW9uKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIG1hcE1haW4uc3RhdGUuaXNQbGFpbmcgPSBmYWxzZTtcbiAgICBtYXBNYWluLnN0YXRlLmRpc3BsYXkgPSB0aGlzLmRhdGFzZXQuZGlzcGxheXR5cGU7XG4gICAgbWFwTWFpbi5yZW5kZXIoKTtcbiAgfSk7XG5cbiAgbGV0IHNldEJ1dHRvbnMgPSBmdW5jdGlvbihkaXNwbGF5KSB7XG4gICAgYnRuLmVhY2goZnVuY3Rpb24oaSwgZWxlbSkge1xuICAgICAgaWYgKGVsZW0uZGF0YXNldC5kaXNwbGF5dHlwZSA9PSBkaXNwbGF5KSBlbGVtLmNsYXNzTGlzdC5hZGQoJ2FjdGl2ZScpO1xuICAgICAgZWxzZSBlbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ2FjdGl2ZScpO1xuICAgIH0pO1xuICB9O1xuXG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgc2V0QnV0dG9ucyhtYXBNYWluLnN0YXRlLmRpc3BsYXkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFRvZ2xlQnRuO1xuIiwiZnVuY3Rpb24gWWVhclNlbGVjdChtYXBNYWluLCBtYWluRWxlbSkge1xuICBsZXQgeWVhciA9IG1haW5FbGVtLmZpbmQoXCIuc2VsZWN0ZWQteWVhclwiKTtcbiAgbGV0IG1vcmVCdG4gPSBtYWluRWxlbS5maW5kKFwiLm1vcmVcIik7XG4gIGxldCBsZXNzQnRuID0gbWFpbkVsZW0uZmluZChcIi5sZXNzXCIpO1xuXG4gIG1vcmVCdG4uY2xpY2soKCkgPT4ge1xuICAgIGlmIChtYXBNYWluLnN0YXRlLnllYXIgPCAyMDE0KSBtYXBNYWluLnN0YXRlLnllYXIrKztcbiAgICBtYXBNYWluLnJlbmRlcigpO1xuICB9KVxuXG4gIGxlc3NCdG4uY2xpY2soKCkgPT4ge1xuICAgIGlmIChtYXBNYWluLnN0YXRlLnllYXIgPiAxOTk0KSBtYXBNYWluLnN0YXRlLnllYXItLTtcbiAgICBtYXBNYWluLnJlbmRlcigpO1xuICB9KVxuXG4gIHRoaXMucmVuZGVyID0gKCkgPT4ge1xuICAgIHllYXIudGV4dChtYXBNYWluLnN0YXRlLnllYXIpXG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgWWVhclNlbGVjdDtcbiIsImZ1bmN0aW9uIFllYXJzKG1hcE1haW4pIHtcbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcblxuICAgICQoXCIueWVhcnMgLmNvbFwiKS5lYWNoKGZ1bmN0aW9uKGlkLCBlKSB7XG4gICAgICBsZXQgeWVhciA9IHBhcnNlSW50KCQoZSkuYXR0cihcImlkXCIpKTtcbiAgICAgIGlmICh5ZWFyID09PSBtYXBNYWluLnN0YXRlLnllYXIpIHtcbiAgICAgICAgJChlKS5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgICQoZSkucmVtb3ZlQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgfTtcblxuICAvLyBfX19fX19fX19fX19fY2xpY2tfX19fX19fX19fXG5cbiAgJChcIi55ZWFycyAuY29sXCIpLm9uKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgbWFwTWFpbi5zdGF0ZS5pc1BsYWluZyA9IGZhbHNlO1xuICAgIGxldCB5ZWFyID0gcGFyc2VJbnQoJCh0aGlzKS5hdHRyKFwiaWRcIikpO1xuICAgIG1hcE1haW4uc3RhdGUueWVhciA9IHllYXI7XG4gICAgbWFwTWFpbi5yZW5kZXIoKTtcbiAgfSk7XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgWWVhcnM7XG4iLCJsZXQga2V5UmVhc29uQ2hhcnQgPSAoKCkgPT4ge1xuXG4gIC8vXHTQndCw0YDQutC+0YLQuNC60LhcdNCT0LXRgtC10YDQvtGB0LXQutGBLlx00JPQvtC80L7RgdC10LrRgS5cdNCe0YIg0LzQsNGC0LXRgNC10LlcblxuICAvL9C60LDQuiDRgNCw0YHQv9C+0LvQvtC20LXQvdC90Ysg0LHQsNGA0Ysg0L3QsCDQtNC40LDQs9GA0LDQvNC80LVcbiAgbGV0IGJhcnNQb3NpdGlvbiA9IFtcImRyYWdzXCIsIFwiZnJvbU1hdGhlclwiLCBcImhldGVyb1wiLCBcImhvbW9cIl07XG5cblxuICAvL9C60LDQuiDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90YvQtSDQtNCw0L3QvdGL0LUg0LIg0Y3Qu9C10LzQtdC90YLQtSDQvNCw0YLRgNC40YbQuFxuICBsZXQgbGVnZW5kID0ge1xuICAgIGRyYWdzOiAwLFxuICAgIGhldGVybzogMSxcbiAgICBob21vOiAyLFxuICAgIGZyb21NYXRoZXI6IDNcbiAgfTtcblxuICBsZXQgdmFsTWF0cml4ID0gW1xuICAgIFszLjMsIDQzLCA1MywgMC43XSxcbiAgICBbNiwgNDEsIDUyLjksIDAuMV0sXG4gICAgWzg0LCA3LCA4LjcsIDAuM10sXG4gICAgWzg3LCAxMC45LCAxLjksIDAuMl0sXG4gICAgWzc5LjEsIDE3LjgsIDIuNywgMC40XSxcbiAgICBbOTEuOCwgNy40LCAwLjYsIDAuMV0sXG4gICAgWzk1LjUsIDQuMiwgMC4yLCAwLjFdLFxuICAgIFs5My4yLCA2LjQsIDAuMiwgMC4yXSxcbiAgICBbODEuMiwgMTcuNywgMC40LCAwLjddLFxuICAgIFs3Mi4zLCAyNS40LCAwLjUsIDEuN10sXG4gICAgWzY2LjcsIDI5LjksIDAuOCwgMi41XSxcbiAgICBbNjQuMSwgMzEuOCwgMS4xLCAzLjBdLFxuICAgIFs2My4zLCAzMy4wLCAwLjcsIDIuOV0sXG4gICAgWzYxLjUsIDM1LjIsIDEuMCwgMi4zXSxcbiAgICBbNjEuMywgMzUuNiwgMS4xLCAyLjBdLFxuICAgIFs1OS44LCAzNywgMS40LCAxLjhdLFxuICAgIFs1Ny45LCAzOS43LCAxLjMsIDEuMV0sXG4gICAgWzU2LjIsIDQxLjQsIDEuMywgMS4xXSxcbiAgICBbNTYuNCwgNDEuNywgMS4xLCAwLjhdLFxuICAgIFs1NC45LCA0My4xLCAxLCAxLjBdLFxuICAgIFs1OC40LCAzOS43LCAxLjEsIDAuOF1cbiAgXTtcblxuICBsZXQgZGVmWWVhclZhbCA9IFsyNSwgMjUsIDI1LCAyNV07XG5cbiAgbGV0IHllYXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmtleS1yZWFzb24tY2FudmFzIC55ZWFyJyk7XG5cbiAgbGV0IHllYXJzTW9iaWxlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChcIi5rZXktcmVhc29uLW1vYmlsZSAueWVhclwiKTtcblxuICBsZXQgc2V0VmFsdWUgPSBmdW5jdGlvbih5ZWFyLCB2YWxBcnIpIHtcbiAgICBsZXQgYmFycyA9IHllYXIucXVlcnlTZWxlY3RvckFsbChcIi5iYXJcIik7XG4gICAgW10uZm9yRWFjaC5jYWxsKGJhcnMsIGZ1bmN0aW9uKGVsZW0sIGkpIHtcbiAgICAgIGxldCBuYW1lID0gYmFyc1Bvc2l0aW9uW2ldO1xuICAgICAgbGV0IHBlcmNlbnQgPSB2YWxBcnJbbGVnZW5kW25hbWVdXTtcbiAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgIGVsZW0uc3R5bGUuaGVpZ2h0ID0gcGVyY2VudCArIFwiJVwiO1xuICAgIH0pO1xuICB9O1xuXG4gIGxldCBzZXRWYWx1ZU1vYmlsZSA9IGZ1bmN0aW9uKHllYXIsIHZhbEFycikge1xuICAgIGxldCBiYXJzID0geWVhci5xdWVyeVNlbGVjdG9yQWxsKFwiLmJhclwiKTtcbiAgICBbXS5mb3JFYWNoLmNhbGwoYmFycywgZnVuY3Rpb24oZWxlbSwgaSkge1xuICAgICAgbGV0IG5hbWUgPSBiYXJzUG9zaXRpb25baV07XG4gICAgICBsZXQgcGVyY2VudCA9IHZhbEFycltsZWdlbmRbbmFtZV1dO1xuICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgICAgZWxlbS5zdHlsZS53aWR0aCA9IHBlcmNlbnQgKyBcIiVcIjtcbiAgICB9KTtcbiAgfTtcblxuICBsZXQgc2V0WWVhcnMgPSAoaSwgZm4sIHllYXJzKSA9PiB7XG4gICAgaWYgKGkgPiB5ZWFycy5sZW5ndGggLSAxKSB7XG4gICAgICAkKFwiLmtleS1yZWFzb24tbW9iaWxlLXllYXItdGV4dFwiKS5jc3Moe1xuICAgICAgICBvcGFjaXR5OiAwLjksXG4gICAgICB9KVxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBmbih5ZWFyc1tpXSwgdmFsTWF0cml4W2ldKTtcbiAgICBzZXRUaW1lb3V0KHNldFllYXJzLCA4MCwgKytpLCBmbiwgeWVhcnMpO1xuICB9O1xuXG4gIGxldCBzdGFydEluZGV4ID0gMDtcblxuICBsZXQgc2hvdyA9ICgpID0+IHtcbiAgICAvLyBzZXRZZWFycyhzdGFydEluZGV4LCBzZXRWYWx1ZSwgeWVhcnMpXG4gICAgc2V0VGltZW91dChzZXRZZWFycywgMTAwMCwgMCwgc2V0VmFsdWUsIHllYXJzKTtcbiAgICBzZXRUaW1lb3V0KHNldFllYXJzLCAxMDAwLCAwLCBzZXRWYWx1ZU1vYmlsZSwgeWVhcnNNb2JpbGUpO1xuICB9XG5cbiAgLy9tb3ZlIGluaXQgdG8gc29tZSBnbG9iYWwgaW5pdFxuXG4gIGxldCBpbml0WWVhcnMgPSAoaSwgZm4sIHllYXJzKSA9PiB7XG4gICAgaWYgKGkgPiAyMCkgcmV0dXJuO1xuICAgIGZuKHllYXJzW2ldLCBkZWZZZWFyVmFsKTtcbiAgICBpbml0WWVhcnMoKytpLCBmbiwgeWVhcnMpO1xuICB9O1xuXG4gIGluaXRZZWFycyhzdGFydEluZGV4LCBzZXRWYWx1ZSwgeWVhcnMpO1xuICBpbml0WWVhcnMoc3RhcnRJbmRleCwgc2V0VmFsdWVNb2JpbGUsIHllYXJzTW9iaWxlKVxuXG4gIHJldHVybiB7XG4gICAgc2hvdzogc2hvdyxcbiAgfVxuXG59KSgpO1xuXG5cblxuZXhwb3J0IGRlZmF1bHQga2V5UmVhc29uQ2hhcnQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuICBsZXQgYSA9IDEwO1xuICBpbXBvcnQge2FkZE1vdXNlZXdoZWVsRXZlbnR9IGZyb20gXCIuL3V0aWxzXCI7XG4gIGltcG9ydCB7Z2V0Q29sb3Isc2hvd0VsZW0saGlkZUVsZW19IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuICBpbXBvcnQgUmVnSW5mbyBmcm9tIFwiLi9SZWdJbmZvXCJcbiAgaW1wb3J0IFJlZ0luZm9Nb2JpbGUgZnJvbSBcIi4vUmVnSW5mb01vYmlsZVwiO1xuXG4gIGltcG9ydCBuZXdJbmZlY3RlZENoYXJ0TW9iaWxlIGZyb20gXCIuL25ld0luZmVjdGVkQ2hhcnRNb2JpbGVcIjtcbiAgaW1wb3J0IG5ld0luZmVjdGVkQ2hhcnQgZnJvbSBcIi4vbmV3SW5mZWN0ZWRDaGFydFwiO1xuICBpbXBvcnQga2V5UmVhc29uQ2hhcnQgZnJvbSBcIi4va2V5UmVhc29uQ2hhcnRcIjtcblxuICBpbXBvcnQgc2hhcmUgZnJvbSBcIi4vc2hhcmUuanNcIjtcbiAgaW1wb3J0IFNpZGVCYXJzIGZyb20gXCIuL1NpZGVCYXJzXCJcblxuICBpbXBvcnQgRm9vdGVyIGZyb20gXCIuL0Zvb3RlclwiXG5cbiAgLy8gaW1wb3J0IGV2ZW50RW1pdHRlciBmcm9tIFwid29sZnk4Ny1ldmVudGVtaXR0ZXJcIlxuXG4gIC8vIGNvbnNvbGUubG9nKGV2ZW50RW1pdHRlcik7XG5cblxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLypcbiAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paIICDilojiloggICAgICDilojilojilojilojilojilojilohcbiAg4paI4paIICAgICAgIOKWiOKWiCAgICAgIOKWiOKWiCAgICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAgICDilojilohcbiAg4paI4paIICAg4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgICDilojilogg4paI4paI4paI4paI4paI4paIICDilojilojilojilojilojilojilogg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paI4paIXG4gIOKWiOKWiCAgICDilojilogg4paI4paIICAgICAg4paI4paIICAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgICAgICAgICAg4paI4paIXG4gICDilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIICDilojilojilojilojilojiloggIOKWiOKWiCAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paI4paI4paI4paI4paI4paIXG4gICovXG5cbiAgbGV0ICBkaXNhYmxlU2Nyb2xsID0gZmFsc2U7XG5cblxuICAvKlxuICDilojiloggICAgICDilojilogg4paI4paI4paI4paI4paI4paIICDilojilojilojilojilojiloggICDilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgIOKWiOKWiCAgICAg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICDilojilogg4paI4paI4paIICAgIOKWiOKWiCAg4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paIICAgIOKWiOKWiCDilojilojilojilojilojilojilohcbiAg4paI4paIICAgICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCAg4paI4paIICDilojiloggICAgICDilojiloggICAgICDilojiloggICAg4paI4paIIOKWiOKWiOKWiOKWiCAgIOKWiOKWiCDilojiloggICAgICAgICDilojiloggICAg4paI4paIIOKWiOKWiCAgICDilojilogg4paI4paI4paI4paIICAg4paI4paIIOKWiOKWiFxuICDilojiloggICAgICDilojilogg4paI4paI4paI4paI4paI4paIICDilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojilojilojilojilojiloggICAg4paI4paI4paI4paIICAgICAgIOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiCAgICDilojilogg4paI4paIIOKWiOKWiCAg4paI4paIIOKWiOKWiCAgICAgICAgIOKWiOKWiCAgICDilojilogg4paI4paIICAgIOKWiOKWiCDilojilogg4paI4paIICDilojilogg4paI4paI4paI4paI4paI4paI4paIXG4gIOKWiOKWiCAgICAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICDilojiloggICAg4paI4paIICAgICAgICDilojiloggICAgICDilojiloggICAg4paI4paIIOKWiOKWiCAg4paI4paIIOKWiOKWiCDilojiloggICAgICAgICDilojiloggICAg4paI4paIIOKWiOKWiCAgICDilojilogg4paI4paIICDilojilogg4paI4paIICAgICAg4paI4paIXG4gIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojilogg4paI4paI4paI4paI4paI4paIICDilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCAgICDilojiloggICAgICAgIOKWiOKWiCAgICAgICDilojilojilojilojilojiloggIOKWiOKWiCAgIOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIICAgIOKWiOKWiCAgICDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAg4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiFxuICAqL1xuXG5cblxuIGxldCBzY3JvbGxUb0VsZW1Ub3AgPSAoJGVsZW0sIGlzTGFzdCkgPT4ge1xuXG4gICBjb25zb2xlLmxvZyhkaXNhYmxlU2Nyb2xsKTtcblxuICAgbGV0IHdpbkhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKVxuXG4gICBsZXQgaGVscGVyRWxlbSA9ICQoJy5wcm9wJyk7XG5cbiAgIGxldCBzZXRIZWxwZXJQb3NvdGluID0gKHdpbkhlaWdodCwkZWxlbSkgPT4ge1xuICAgICBsZXQgaGVscGVyUG9zaXRpb24gPSAoJGVsZW0ub2Zmc2V0KCkudG9wICsgd2luSGVpZ2h0KTtcblxuICAgICBpZiAoIGhlbHBlclBvc2l0aW9uID4gaGVscGVyRWxlbS5vZmZzZXQoKS50b3ApIHtcbiAgICAgICBoZWxwZXJFbGVtLmNzcyh7XG4gICAgICAgICB0b3A6IGhlbHBlclBvc2l0aW9uXG4gICAgICAgfSk7XG4gICAgIH1cbiAgIH1cblxuICBpZighaXNMYXN0KSBzZXRIZWxwZXJQb3NvdGluKHdpbkhlaWdodCAsJGVsZW0pO1xuXG5cbiAgbGV0IHRvcFBvc2l0aW9uID0gICRlbGVtLm9mZnNldCgpLnRvcFxuXG4gIC8v0L/QtdGA0LXQvNC+0YLQutCwINC6INC90YPQttC90L7QvNGDINC80LXRgdGC0YNcbiAgJCgnYm9keScpLmNsZWFyUXVldWUoKVxuICAgIC5hbmltYXRlKHtcbiAgICAgIHNjcm9sbFRvcDogdG9wUG9zaXRpb24sXG4gICAgfSwge1xuICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICBkb25lOiAoKT0+IGRpc2FibGVTY3JvbGwgPSBmYWxzZVxuICAgIH0pO1xuXG5cbiB9XG5cblxuICBsZXQgc2Nyb2xsVG9FbGVtQ2VudGVyID0gKCRlbGVtLCBpc0xhc3QpID0+IHtcblxuICAgIGxldCBzZXRIZWxwZXJQb3NvdGluID0gKHdpbkhlaWdodCwkZWxlbSkgPT4ge1xuICAgICAgbGV0IGhlbHBlclBvc2l0aW9uID0gKCRlbGVtLm9mZnNldCgpLnRvcCArICRlbGVtLmhlaWdodCgpIC8gMiArIHdpbkhlaWdodCAvIDIpO1xuXG4gICAgICBpZiAoIGhlbHBlclBvc2l0aW9uID4gJCgnLnByb3AnKS5vZmZzZXQoKS50b3ApIHtcbiAgICAgICAgJCgnLnByb3AnKS5jc3Moe1xuICAgICAgICAgIHRvcDogaGVscGVyUG9zaXRpb25cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgZGlzYWJsZVNjcm9sbCA9IHRydWU7XG5cbiAgICBsZXQgd2luSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpXG5cbiAgICAvL9CU0L7QsdCw0LLQu9C10L3QuNC1INGN0LvQtdC80LXQvdGC0LBcbiAgICBpZiAoIWlzTGFzdCkge1xuICAgICAgc2V0SGVscGVyUG9zb3Rpbih3aW5IZWlnaHQsJGVsZW0pO1xuICAgIH1cblxuICAgIC8v0L7Qv9GA0LXQtNC10LvQtdC90LjQtSDRhNC40L3QsNC70YzQvdC+0Lkg0L/QvtC30LjRhtC40LhcbiAgICBsZXQgc2Nyb2xsVG87XG5cblxuICAgIC8vINC10YHQu9C4INGN0LvQtdC80L3QtdGCINCx0L7Qu9GM0YjQtSDRgNCw0LfQvNC10YDQsCDRjdC60YDQsNC90LAg0YLQviDQv9GA0L7QutGA0YPRgtC60LAg0LHRg9C00YLQtSDQtNC+INC10LPQviDQstC10YDRhdCwXG4gICAgLy8gaWYgKCAkZWxlbS5oZWlnaHQoKSA8IHdpbkhlaWdodCl7XG4gICAgICBzY3JvbGxUbyA9ICAkZWxlbS5vZmZzZXQoKS50b3AgLSB3aW5IZWlnaHQgLyAyICsgJGVsZW0uaGVpZ2h0KCkgLyAyXG4gICAgLy8gfWVsc2Uge1xuICAgIC8vICAgc2Nyb2xsVG8gPSAgJGVsZW0ub2Zmc2V0KCkudG9wO1xuICAgIC8vIH1cblxuICAgIC8v0L/QtdGA0LXQvNC+0YLQutCwINC6INC90YPQttC90L7QvNGDINC80LXRgdGC0YNcbiAgICAkKCdodG1sLCBib2R5JykuY2xlYXJRdWV1ZSgpXG4gICAgICAuYW5pbWF0ZSh7XG4gICAgICAgIHNjcm9sbFRvcDogc2Nyb2xsVG9cbiAgICAgIH0sIHtcbiAgICAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgICAgIGRvbmU6ICgpPT4gZGlzYWJsZVNjcm9sbCA9IGZhbHNlXG4gICAgICB9KTtcblxuICB9XG5cblxuICBsZXQgZG9FbHNDb2xsaWRlID0gZnVuY3Rpb24oZWwxLCBlbDIpIHtcblxuICAgIGxldCByZWN0MSA9IGVsMS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgcmVjdDIgPSBlbDIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICByZXR1cm4gKHJlY3QxLmxlZnQgPCByZWN0Mi5sZWZ0ICsgcmVjdDIud2lkdGggJiZcbiAgICAgIHJlY3QxLmxlZnQgKyByZWN0MS53aWR0aCA+IHJlY3QyLmxlZnQgJiZcbiAgICAgIHJlY3QxLnRvcCA8IHJlY3QyLnRvcCArIHJlY3QyLmhlaWdodCAmJlxuICAgICAgcmVjdDEuaGVpZ2h0ICsgcmVjdDEudG9wID4gcmVjdDIudG9wKTtcbiAgfTtcblxuICAvLyAtLS0tLS0tLS0tLS1EYXRhIHByb2Nlc3MgZnVuY3Rpb25zLS0tLS0tXG5cblxuICBsZXQgbmV3RGF0YVByb3NlZWQgPSBmdW5jdGlvbihjc3ZGaWxlKSB7XG4gICAgbGV0IHIgPSB7fTtcbiAgICBsZXQgcmVnaW9uc0FyciA9IGNzdkZpbGUuc3BsaXQoXCJcXG5cIik7XG4gICAgcmVnaW9uc0Fyci5wb3AoKTsgLy9yZW1vdmUgZW5kIGxpbmVcblxuICAgIHJlZ2lvbnNBcnIuZm9yRWFjaChmdW5jdGlvbihlLCBpKSB7XG4gICAgICBlID0gZS5zcGxpdChcIjtcIik7XG4gICAgICBsZXQga2V5ID0gZS5zaGlmdCgpO1xuICAgICAgbGV0IHNob3J0TmFtZSA9IGUuc2hpZnQoKTtcbiAgICAgIGxldCBuYW1lID0gZS5zaGlmdCgpO1xuICAgICAgcltrZXldID0ge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBzaG9ydE5hbWU6IHNob3J0TmFtZSxcbiAgICAgICAgcm93WWVhcnNEYXRhOiBlLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGxldCB5ZWFycyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IDIwOyBpKyspIHtcbiAgICAgIHllYXJzLnB1c2goMTk5NCArIGkpO1xuICAgIH1cblxuXG5cbiAgICBPYmplY3Qua2V5cyhyKS5mb3JFYWNoKGZ1bmN0aW9uKHJlZ2lvbikge1xuXG4gICAgICByW3JlZ2lvbl0uYWJzRGllZCA9IHt9O1xuICAgICAgcltyZWdpb25dLmFic0luZmVjdGVkID0ge307XG4gICAgICByW3JlZ2lvbl0ucmVsSW5mZWN0ZWQgPSB7fTtcbiAgICAgIHllYXJzLmZvckVhY2goZnVuY3Rpb24oeWVhcikge1xuICAgICAgICByW3JlZ2lvbl0uYWJzSW5mZWN0ZWRbeWVhcl0gPSBpbmZlY3RlZEluWWVhcih5ZWFyLCByW3JlZ2lvbl0ucm93WWVhcnNEYXRhKTtcbiAgICAgICAgcltyZWdpb25dLmFic0RpZWRbeWVhcl0gPSBkaWVkSW5ZZWFyKHllYXIsIHJbcmVnaW9uXS5yb3dZZWFyc0RhdGEpO1xuICAgICAgICByW3JlZ2lvbl0ucmVsSW5mZWN0ZWRbeWVhcl0gPSByZWxuSWZlY3RlZEluWWVhcih5ZWFyLCByW3JlZ2lvbl0ucm93WWVhcnNEYXRhKTtcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHJldHVybiByO1xuXG4gIH07XG5cbiAgbGV0IGluZmVjdGVkSW5ZZWFyID0gZnVuY3Rpb24oeWVhciwgcm93UnJlZ0RhdGEpIHtcbiAgICBsZXQgb2ZzZXQgPSAwICsgKDIwMTQgLSB5ZWFyKSAqIDM7XG4gICAgcmV0dXJuIHJvd1JyZWdEYXRhW29mc2V0XTtcbiAgfTtcblxuXG4gIGxldCBkaWVkSW5ZZWFyID0gZnVuY3Rpb24oeWVhciwgcm93UnJlZ0RhdGEpIHtcbiAgICBsZXQgb2ZzZXQgPSAxICsgKDIwMTQgLSB5ZWFyKSAqIDM7XG4gICAgcmV0dXJuIHJvd1JyZWdEYXRhW29mc2V0XTtcbiAgfTtcblxuICBsZXQgcmVsbklmZWN0ZWRJblllYXIgPSBmdW5jdGlvbih5ZWFyLCByb3dScmVnRGF0YSkge1xuICAgIGxldCBvZnNldCA9IDIgKyAoMjAxNCAtIHllYXIpICogMztcbiAgICByZXR1cm4gcm93UnJlZ0RhdGFbb2ZzZXRdO1xuICB9O1xuXG4gIGxldCBnZXRDb2xvck1ldGEgPSBmdW5jdGlvbihzdGFydENvbG9yLCBlbmRDb2xvciwgcGVyY2VudCkge1xuICAgIC8vIGNvbnNvbGUubG9nKHBlcmNlbnQpO1xuICAgIGlmIChwZXJjZW50ID49IDEgfHwgaXNOYU4ocGVyY2VudCkpIHJldHVybiBzdGFydENvbG9yLmpvaW4oXCIsXCIpXG4gICAgbGV0IG5vTmFtZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIHBlcmNlbnQpIHtcbiAgICAgIHJldHVybiBNYXRoLmFicyhcbiAgICAgICAgTWF0aC5mbG9vcihzdGFydCAqICgxIC0gcGVyY2VudCkgKyBlbmQgKiBwZXJjZW50KVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHN0YXJ0Q29sb3IubWFwKGZ1bmN0aW9uKGVsZW0sIGkpIHtcbiAgICAgIHJldHVybiBub05hbWUoZWxlbSwgZW5kQ29sb3JbaV0sIHBlcmNlbnQpO1xuICAgIH0pLmpvaW4oXCIsXCIpO1xuICB9O1xuXG5cblxuICAvKlxuICDilojiloggICAgIOKWiOKWiCDilojilogg4paI4paI4paIICAgIOKWiOKWiCDilojilojilojilojilojiloggICDilojilojilojilojilojiloggIOKWiOKWiCAgICAg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojilojiloggICAg4paI4paIICAgICDilojilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCDilojilojilojilojilojiloggICDilojilojilojilojilojiloggIOKWiOKWiCAgICAgIOKWiOKWiFxuICDilojiloggICAgIOKWiOKWiCDilojilogg4paI4paI4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAg4paI4paIIOKWiOKWiCAgICAg4paI4paIICAgICDilojiloggICAg4paI4paIIOKWiOKWiOKWiOKWiCAgIOKWiOKWiCAgICAg4paI4paIICAgICAg4paI4paIICAgICAg4paI4paIICAg4paI4paIIOKWiOKWiCAgICDilojilogg4paI4paIICAgICAg4paI4paIXG4gIOKWiOKWiCAg4paIICDilojilogg4paI4paIIOKWiOKWiCDilojiloggIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAgIOKWiOKWiCDilojiloggIOKWiCAg4paI4paIICAgICDilojiloggICAg4paI4paIIOKWiOKWiCDilojiloggIOKWiOKWiCAgICAg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgIOKWiOKWiCDilojiloggICAgICDilojilohcbiAg4paI4paIIOKWiOKWiOKWiCDilojilogg4paI4paIIOKWiOKWiCAg4paI4paIIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAgIOKWiOKWiCDilojilogg4paI4paI4paIIOKWiOKWiCAgICAg4paI4paIICAgIOKWiOKWiCDilojiloggIOKWiOKWiCDilojiloggICAgICAgICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiFxuICAg4paI4paI4paIIOKWiOKWiOKWiCAg4paI4paIIOKWiOKWiCAgIOKWiOKWiOKWiOKWiCDilojilojilojilojilojiloggICDilojilojilojilojilojiloggICDilojilojilogg4paI4paI4paIICAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAg4paI4paI4paI4paIICAgICDilojilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiFxuICAqL1xuXG5cbiAgbGV0IG9uc2Nyb2xsID0gKGZ1bmN0aW9uKCkge1xuICAgIGxldCBiZ0NvbG9yID0gbnVsbDtcbiAgICBsZXQgSCA9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0O1xuXG5cbiAgICBsZXQgY29sb3JzID0gW1xuICAgICAgWzI2LCAxNCwgMTRdLFxuICAgICAgWzIyLCA0NywgNTddLFxuICAgICAgWzI2LCAxNCwgMTRdLFxuICAgICAgWzE5LCA1MCwgNjFdLFxuICAgICAgWzE5LCA1MCwgNjFdLFxuICAgICAgWzEyLCAzNSwgNDJdLFxuICAgICAgWzEyLCAzNSwgNDJdLFxuICAgICAgWzIyLCA0NywgNTddLFxuICAgICAgWzQ0LCAxMDgsIDExMV0sXG4gICAgXVxuXG4gICAgbGV0IHJlZkVsZW1TZWxlY3RvcnMgPSBbXG4gICAgICAnLnBsYXRlMScsXG4gICAgICBcIi5wbGF0ZTItM1wiLFxuICAgICAgXCIucGxhdGU0LTVcIixcbiAgICAgIFwiLnBsYXRlNlwiLFxuICAgICAgXCIucGxhdGU3XCIsXG4gICAgICBcIi5wbGF0ZThcIixcbiAgICAgIFwiLnBsYXRlOVwiLFxuICAgICAgXCIucGxhdGUxMFwiLFxuICAgICAgXCIucGxhdGUxMVwiXG4gICAgXTtcblxuICAgIGxldCBjYWxjUmVmUG9pbnQgPSAoZWxlbSkgPT4gKCQoZWxlbSkub3V0ZXJIZWlnaHQoKSAvIDIgKyAkKGVsZW0pLm9mZnNldCgpLnRvcCk7XG5cbiAgICBsZXQgcmVmUG9pbnQgPSByZWZFbGVtU2VsZWN0b3JzLm1hcChjYWxjUmVmUG9pbnQpO1xuXG5cbiAgICBsZXQgZ2V0Qm90b21SZWZJbmRleCA9IChweCkgPT4ge1xuICAgICAgbGV0IGk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcmVmUG9pbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHJlZlBvaW50W2ldID4gcHgpIGJyZWFrO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBpO1xuICAgIH07XG5cbiAgICBsZXQgZ2V0UGVyc2VudHMgPSAocHgsIHJlZlRvcCwgcmVmQm90b20pID0+ICgocHggLSByZWZUb3ApIC8gKHJlZkJvdG9tIC0gcmVmVG9wKSk7XG5cbiAgICBsZXQgb25zY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBzY3JvbGxlZCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgICAgbGV0IHdpbmRvd0NlbnRlciA9IHNjcm9sbGVkICsgd2luZG93LmlubmVySGVpZ2h0IC8gMjtcblxuICAgICAgbGV0IGJvdG9tSW5kZXggPSBnZXRCb3RvbVJlZkluZGV4KHdpbmRvd0NlbnRlcik7XG4gICAgICBsZXQgcGVyY2VudCA9IGdldFBlcnNlbnRzKHdpbmRvd0NlbnRlciwgcmVmUG9pbnRbYm90b21JbmRleCAtIDFdLCByZWZQb2ludFtib3RvbUluZGV4XSk7XG4gICAgICBsZXQgY29sb3IgPSBnZXRDb2xvck1ldGEoY29sb3JzW2JvdG9tSW5kZXggLSAxXSwgY29sb3JzW2JvdG9tSW5kZXhdLCBwZXJjZW50KTtcblxuICAgICAgaWYgKGNvbG9yICE9PSBiZ0NvbG9yKSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd2luZG93LmRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYHJnYigke2NvbG9yfSlgO1xuICAgICAgICB9KTtcbiAgICAgICAgYmdDb2xvciA9IGNvbG9yO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gb25zY3JvbGw7XG5cbiAgfSkoKTtcblxuICB3aW5kb3cub25zY3JvbGwgPSBvbnNjcm9sbDtcblxuXG5cbiAgJChmdW5jdGlvbigpIHtcblxuXG4gICAgLypcbiAgICDilojiloggICAg4paI4paIICDilojilojilojilojiloggIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICDilojilojilojilojilojilogg4paI4paIICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojilojilojilojilojilohcbiAgICDilojiloggICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAgICDilojiloggICDilojilogg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAg4paI4paIICDilojiloggICAgICDilojiloggICDilojilohcbiAgICDilojiloggICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICAgICDilojilojilojilojilojiloggIOKWiOKWiCDilojiloggICAgICDilojilojilojilojiloggICDilojilojilojilojiloggICDilojilojilojilojilojilohcbiAgICAg4paI4paIICDilojiloggIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAgICDilojiloggICAgICDilojilogg4paI4paIICAgICAg4paI4paIICDilojiloggIOKWiOKWiCAgICAgIOKWiOKWiCAgIOKWiOKWiFxuICAgICAg4paI4paI4paI4paIICAg4paI4paIICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICAgICDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgIOKWiOKWiFxuICAgICovXG5cblxuICAgIGxldCB2YWxQaWNrZXIgPSBmdW5jdGlvbihmbiwgc3RhdGUpIHtcblxuICAgICAgbGV0IG1ldGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlZC1tZXRlci05Jyk7XG4gICAgICBsZXQgZ3JlZW5NZXRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aGVybW9tZXRlci05IC5ncmVlbi1tZXRlci05Jyk7XG4gICAgICBsZXQgcmliYm9uU2xpZGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignI3JpYmJvbi1zbGlkZXItOScpO1xuICAgICAgbGV0IHBlcmNlbnQ7XG4gICAgICBsZXQgbWF4ID0gODQ4O1xuICAgICAgbGV0IHRleHQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVkLW1ldGVyLTk+ZGl2Jyk7XG4gICAgICBsZXQgcmlnaHRBbnN3ZXIgPSAxMjtcblxuXG4gICAgICBsZXQgcmVuZGVyTW9iaWxlID0gKHBlcmNlbnQpID0+IHtcbiAgICAgICAgJChcIi5hbnN3ZXJzLW1vYmlsZS5oaWRlLWRlc2t0b3AgLnJlZC1tZXRlci05XCIpWzBdLnN0eWxlLmxlZnQgPSAoLTEgKyBwZXJjZW50KSAqIDEwMCArIFwiJVwiO1xuICAgICAgICAkKFwiLnZhbHVlcGlja2VyLW1vYmlsZS1waWNrZXItOVwiKVswXS5zdHlsZS5sZWZ0ID0gKHBlcmNlbnQpICogMjM1ICsgXCJweFwiO1xuICAgICAgICAkKFwiLnZhbHVlcGlja2VyLW1vYmlsZS1waWNrZXItOVwiKS50ZXh0KE1hdGgucm91bmQocGVyY2VudCAqIDE0KSArIDEpO1xuICAgICAgfVxuXG5cbiAgICAgIGxldCByZW5kZXIgPSAocGVyY2VudCkgPT4ge1xuICAgICAgICByZW5kZXJNb2JpbGUocGVyY2VudClcbiAgICAgICAgcmliYm9uU2xpZGVyLnN0eWxlLmxlZnQgPSBwZXJjZW50ICogbWF4ICsgXCJweFwiO1xuICAgICAgICBtZXRlci5zdHlsZS5sZWZ0ID0gKDAgLSAoMSAtIHBlcmNlbnQpICogMTAwKSArIFwiJVwiO1xuICAgICAgICB0ZXh0LmlubmVySFRNTCA9IE1hdGgucm91bmQocGVyY2VudCAqIDE0KSArIDE7XG4gICAgICAgIGlmIChwZXJjZW50IDwgMC4wNzUpIHtcbiAgICAgICAgICBtZXRlci5jbGFzc0xpc3QuYWRkKFwic21hbGxcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbWV0ZXIuY2xhc3NMaXN0LnJlbW92ZShcInNtYWxsXCIpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChwZXJjZW50ID4gMC45Mikge1xuICAgICAgICAgIGdyZWVuTWV0ZXIuY2xhc3NMaXN0LmFkZChcImJpZ1wiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBncmVlbk1ldGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJiaWdcIik7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHJlbmRlcigwLjQpO1xuXG4gICAgICBsZXQgb25EcmFnID0gKGV2ZW50LCB1aSkgPT4ge1xuICAgICAgICB1aS5wb3NpdGlvbi5sZWZ0ID0gTWF0aC5taW4oODQ4LCB1aS5wb3NpdGlvbi5sZWZ0KTtcbiAgICAgICAgcGVyY2VudCA9IHVpLnBvc2l0aW9uLmxlZnQgLyA4NDg7XG4gICAgICAgIHJlbmRlcihwZXJjZW50KTtcbiAgICAgICAgLy/QvtCx0YDQsNCx0L7RgtC60YMg0L/RgNCw0LLQuNC70YzQvdC+INC+0YLQstC10YLQsCDRgNC10YjQuNC7INC/0YDQvtCy0L7QtNC40YLRjCDQsiDRgdC10YDQtdC60YLQvtGA0LUg0L/QviDRjdGC0L7QvNGDINC80L7QttC90L5cbiAgICAgICAgLy8g0L3QtSDQv9C10YDQtdC00L7QstCw0YLRjCDRgdC+0YHRgtC+0Y/QvdC40LUg0YHQtdC70LXQutGC0L7RgNCwINCyINGB0L7RgdGC0L7Rj9C90LjQtSDQstC+0L/RgNC+0YHQsFxuICAgICAgICBzdGF0ZS5zZWxlY3RlZCA9IE1hdGgucm91bmQocGVyY2VudCAqIDE0KSArIDE7XG4gICAgICAgIGZuKCk7XG4gICAgICB9O1xuXG4gICAgICAkKHJpYmJvblNsaWRlcikuZHJhZ2dhYmxlKHtcbiAgICAgICAgY29udGFpbm1lbnQ6IFwicGFyZW50XCIsXG4gICAgICAgIGF4aXM6IFwieFwiLFxuICAgICAgICBkcmFnOiBvbkRyYWcsXG4gICAgICB9KTtcblxuICAgICAgbGV0IG9uRHJhZ01vYmlsZSA9IChldmVudCwgdWkpID0+IHtcbiAgICAgICAgcGVyY2VudCA9IHVpLnBvc2l0aW9uLmxlZnQgLyAyMzU7XG4gICAgICAgIHJlbmRlcihwZXJjZW50KTtcblxuICAgICAgICAvL9C+0LHRgNCw0LHQvtGC0LrRgyDQv9GA0LDQstC40LvRjNC90L4g0L7RgtCy0LXRgtCwINGA0LXRiNC40Lsg0L/RgNC+0LLQvtC00LjRgtGMINCyINGB0LXRgNC10LrRgtC+0YDQtSDQv9C+INGN0YLQvtC80YMg0LzQvtC20L3QvlxuICAgICAgICAvLyDQvdC1INC/0LXRgNC10LTQvtCy0LDRgtGMINGB0L7RgdGC0L7Rj9C90LjQtSDRgdC10LvQtdC60YLQvtGA0LAg0LIg0YHQvtGB0YLQvtGP0L3QuNC1INCy0L7Qv9GA0L7RgdCwXG4gICAgICAgIHN0YXRlLnNlbGVjdGVkID0gTWF0aC5yb3VuZChwZXJjZW50ICogMTQpICsgMTtcbiAgICAgICAgLy9jYWxsYmFjayBjYWxsXG4gICAgICAgIGZuKCk7XG4gICAgICB9O1xuXG4gICAgICAkKFwiLnZhbHVlcGlja2VyLW1vYmlsZS1waWNrZXItOVwiKS5kcmFnZ2FibGUoe1xuICAgICAgICBjb250YWlubWVudDogXCJwYXJlbnRcIixcbiAgICAgICAgYXhpczogXCJ4XCIsXG4gICAgICAgIGRyYWc6IG9uRHJhZ01vYmlsZSxcbiAgICAgIH0pO1xuXG5cbiAgICAgIGxldCBpc1JpZ2h0ID0gKCkgPT4gKE1hdGgucm91bmQocGVyY2VudCAqIDE0KSArIDEgPT0gcmlnaHRBbnN3ZXIpXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzUmlnaHRcbiAgICAgIH1cbiAgICB9O1xuXG4gICAgLypcbiAgICDilojiloggICAg4paI4paIICDilojilojilojilojiloggIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICDilojilojilojilojilojilogg4paI4paIICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiFxuICAgIOKWiOKWiCAgICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgIOKWiOKWiCDilojilogg4paI4paIICAgICAg4paI4paIICDilojiloggIOKWiOKWiCAgICAgIOKWiOKWiCAgIOKWiOKWiCAgICAgIOKWiOKWiFxuICAgIOKWiOKWiCAgICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiFxuICAgICDilojiloggIOKWiOKWiCAg4paI4paIICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgICAgIOKWiOKWiCDilojiloggICAgICDilojiloggIOKWiOKWiCAg4paI4paIICAgICAg4paI4paIICAg4paI4paIIOKWiOKWiFxuICAgICAg4paI4paI4paI4paIICAg4paI4paIICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICAgICDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojilojilojilojilojilojilohcbiAgICAqL1xuXG5cbiAgICBsZXQgdmFsUGlja2VyMiA9IGZ1bmN0aW9uKGZuLCBzdGF0ZSkge1xuICAgICAgbGV0IG1ldGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlZC1tZXRlci04Jyk7XG4gICAgICBsZXQgZ3JlZW5NZXRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy50aGVybW9tZXRlciAuZ3JlZW4tbWV0ZXInKTtcbiAgICAgIGxldCByaWJib25TbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmliYm9uLXNsaWRlci04Jyk7XG4gICAgICBsZXQgcGVyY2VudDtcbiAgICAgIGxldCBtYXggPSA4NDg7XG4gICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWQtbWV0ZXItOD5kaXYnKTtcbiAgICAgIGxldCByaWdodEFuc3dlciA9IDQwO1xuXG5cbiAgICAgIGxldCByZW5kZXJNb2JpbGUgPSAocGVyY2VudCkgPT4ge1xuICAgICAgICAkKFwiLmFuc3dlcnMtbW9iaWxlLmhpZGUtZGVza3RvcCAucmVkLW1ldGVyLThcIilbMF0uc3R5bGUubGVmdCA9ICgtMSArIHBlcmNlbnQpICogMTAwICsgXCIlXCI7XG4gICAgICAgICQoXCIudmFsdWVwaWNrZXItbW9iaWxlLXBpY2tlci04XCIpWzBdLnN0eWxlLmxlZnQgPSAocGVyY2VudCkgKiAyMzUgKyBcInB4XCI7XG4gICAgICAgICQoXCIudmFsdWVwaWNrZXItbW9iaWxlLXBpY2tlci04XCIpLnRleHQoTWF0aC5yb3VuZChwZXJjZW50ICogMTAwKSArIFwiJVwiKTtcbiAgICAgIH1cblxuICAgICAgbGV0IHJlbmRlciA9IChwZXJjZW50KSA9PiB7XG4gICAgICAgIHJlbmRlck1vYmlsZShwZXJjZW50KTtcbiAgICAgICAgcmliYm9uU2xpZGVyLnN0eWxlLmxlZnQgPSBwZXJjZW50ICogbWF4ICsgXCJweFwiO1xuICAgICAgICBtZXRlci5zdHlsZS5sZWZ0ID0gKDAgLSAoMSAtIHBlcmNlbnQpICogMTAwKSArIFwiJVwiO1xuICAgICAgICB0ZXh0LmlubmVySFRNTCA9IE1hdGgucm91bmQocGVyY2VudCAqIDEwMCkgKyBcIiVcIjtcbiAgICAgICAgaWYgKHBlcmNlbnQgPCAwLjA3NSkge1xuICAgICAgICAgIG1ldGVyLmNsYXNzTGlzdC5hZGQoXCJzbWFsbFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXRlci5jbGFzc0xpc3QucmVtb3ZlKFwic21hbGxcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBlcmNlbnQgPiAwLjkyKSB7XG4gICAgICAgICAgZ3JlZW5NZXRlci5jbGFzc0xpc3QuYWRkKFwiYmlnXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyZWVuTWV0ZXIuY2xhc3NMaXN0LnJlbW92ZShcImJpZ1wiKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmVuZGVyKDAuNSk7XG5cbiAgICAgIGxldCBvbkRyYWcgPSAoZXZlbnQsIHVpKSA9PiB7XG4gICAgICAgIHVpLnBvc2l0aW9uLmxlZnQgPSBNYXRoLm1pbig4NDgsIHVpLnBvc2l0aW9uLmxlZnQpO1xuICAgICAgICBwZXJjZW50ID0gdWkucG9zaXRpb24ubGVmdCAvIDg0ODtcbiAgICAgICAgcmVuZGVyKHBlcmNlbnQpO1xuXG4gICAgICAgIC8v0L7QsdGA0LDQsdC+0YLQutGDINC/0YDQsNCy0LjQu9GM0L3QviDQvtGC0LLQtdGC0LAg0YDQtdGI0LjQuyDQv9GA0L7QstC+0LTQuNGC0Ywg0LIg0YHQtdGA0LXQutGC0L7RgNC1INC/0L4g0Y3RgtC+0LzRgyDQvNC+0LbQvdC+XG4gICAgICAgIC8vINC90LUg0L/QtdGA0LXQtNC+0LLQsNGC0Ywg0YHQvtGB0YLQvtGP0L3QuNC1INGB0LXQu9C10LrRgtC+0YDQsCDQsiDRgdC+0YHRgtC+0Y/QvdC40LUg0LLQvtC/0YDQvtGB0LBcbiAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSBNYXRoLnJvdW5kKHBlcmNlbnQgKiAxMDApO1xuICAgICAgICBmbigpO1xuICAgICAgfTtcblxuICAgICAgJChyaWJib25TbGlkZXIpLmRyYWdnYWJsZSh7XG4gICAgICAgIGNvbnRhaW5tZW50OiBcInBhcmVudFwiLFxuICAgICAgICBheGlzOiBcInhcIixcbiAgICAgICAgZHJhZzogb25EcmFnLFxuICAgICAgfSk7XG5cblxuICAgICAgbGV0IG9uRHJhZ01vYmlsZSA9IChldmVudCwgdWkpID0+IHtcbiAgICAgICAgcGVyY2VudCA9IHVpLnBvc2l0aW9uLmxlZnQgLyAyMzU7XG4gICAgICAgIHJlbmRlcihwZXJjZW50KTtcblxuICAgICAgICAvL9C+0LHRgNCw0LHQvtGC0LrRgyDQv9GA0LDQstC40LvRjNC90L4g0L7RgtCy0LXRgtCwINGA0LXRiNC40Lsg0L/RgNC+0LLQvtC00LjRgtGMINCyINGB0LXRgNC10LrRgtC+0YDQtSDQv9C+INGN0YLQvtC80YMg0LzQvtC20L3QvlxuICAgICAgICAvLyDQvdC1INC/0LXRgNC10LTQvtCy0LDRgtGMINGB0L7RgdGC0L7Rj9C90LjQtSDRgdC10LvQtdC60YLQvtGA0LAg0LIg0YHQvtGB0YLQvtGP0L3QuNC1INCy0L7Qv9GA0L7RgdCwXG4gICAgICAgIHN0YXRlLnNlbGVjdGVkID0gTWF0aC5yb3VuZChwZXJjZW50ICogMTAwKTtcbiAgICAgICAgLy9jYWxsYmFjayBjYWxsXG4gICAgICAgIGZuKCk7XG4gICAgICB9O1xuXG4gICAgICAkKFwiLnZhbHVlcGlja2VyLW1vYmlsZS1waWNrZXItOFwiKS5kcmFnZ2FibGUoe1xuICAgICAgICBjb250YWlubWVudDogXCJwYXJlbnRcIixcbiAgICAgICAgYXhpczogXCJ4XCIsXG4gICAgICAgIGRyYWc6IG9uRHJhZ01vYmlsZSxcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgaXNSaWdodCA9ICgpID0+IHtcbiAgICAgICAgbGV0IGFuc3dlciA9ICBNYXRoLnJvdW5kKHBlcmNlbnQgKiAxMDApXG5cbiAgICAgICAgcmV0dXJuIGFuc3dlciA+IDM1ICYmIGFuc3dlciA8IDQ1O1xuICAgICAgfVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1JpZ2h0XG4gICAgICB9XG5cbiAgICB9O1xuXG4gICAgLypcbiAgICDilojiloggICAg4paI4paIICDilojilojilojilojiloggIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICDilojilojilojilojilojilogg4paI4paIICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiFxuICAgIOKWiOKWiCAgICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgIOKWiOKWiCDilojilogg4paI4paIICAgICAg4paI4paIICDilojiloggIOKWiOKWiCAgICAgIOKWiOKWiCAgIOKWiOKWiCAgICAgIOKWiOKWiFxuICAgIOKWiOKWiCAgICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiFxuICAgICDilojiloggIOKWiOKWiCAg4paI4paIICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgICAgIOKWiOKWiCDilojiloggICAgICDilojiloggIOKWiOKWiCAg4paI4paIICAgICAg4paI4paIICAg4paI4paIICAgICAg4paI4paIXG4gICAgICDilojilojilojiloggICDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAg4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paIICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiFxuICAgICovXG5cblxuICAgIGxldCB2YWxQaWNrZXIzID0gZnVuY3Rpb24oZm4sIHN0YXRlKSB7XG4gICAgICBsZXQgY2lyY2xlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmd1ZXNzLWdyb3d0aC1tYWluLXNtYWxsJyk7XG4gICAgICBsZXQgdGV4dEZlYWxkID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmd1ZXNzLWdyb3d0aC1tYWluLXRleHQnKTtcbiAgICAgIGxldCBiYXNlUiA9IDM4LjMzMzMzMzMzMzM7XG4gICAgICBsZXQgciA9IDM4LjMzMzMzMzMzMzM7XG4gICAgICBsZXQgaCA9IDA7XG4gICAgICBsZXQgdGV4dCA9IFwiMSAwMDAgMDAwXCI7XG4gICAgICBsZXQgc2VsZWN0ZWRWYWwgPSAwO1xuICAgICAgbGV0IGJhc2VWYWwgPSAxMDAwMDAwO1xuICAgICAgbGV0IHRvdGFsVmFsID0gMTAwMDAwMDtcblxuICAgICAgbGV0IHZhbFRvVGV4dCA9IHZhbCA9PiB7XG4gICAgICAgIHZhbCA9IE1hdGgucm91bmQodmFsIC8gMTAwKSAqIDEwMDtcblxuICAgICAgICBsZXQgYXJyID0gKHZhbCArIFwiXCIpLnNwbGl0KFwiXCIpO1xuICAgICAgICBhcnIuc3BsaWNlKDQsIDAsIFwiIFwiKTtcbiAgICAgICAgYXJyLnNwbGljZSgxLCAwLCBcIiBcIik7XG4gICAgICAgIHJldHVybiBhcnIuam9pbihcIlwiKTtcbiAgICAgIH07XG5cblxuICAgICAgbGV0IGNoYW5nZVIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgY2lyY2xlLnN0eWxlLndpZHRoID0gciArIFwicHhcIjtcbiAgICAgICAgY2lyY2xlLnN0eWxlLmhlaWdodCA9IHIgKyBcInB4XCI7XG4gICAgICB9O1xuXG4gICAgICBsZXQgY2hhbmdlVGV4dCA9ICgpID0+IHRleHRGZWFsZC5pbm5lckhUTUwgPSB0ZXh0O1xuXG4gICAgICBsZXQgY2FsY3VsZXRlTmV3UiA9IHBlcnNlbnQgPT4gYmFzZVIgKyBiYXNlUipwZXJzZW50IDtcblxuICAgICAgbGV0IGNhbGN1bGV0ZU5ld1ZhbCA9IHBlcnNlbnQgPT4gYmFzZVZhbCArIGJhc2VWYWwqcGVyc2VudDtcblxuICAgICAgbGV0IG9uRHJhZyA9IChldmVudCwgdWkpID0+IHtcblxuICAgICAgICBoID0gdWkucG9zaXRpb24udG9wO1xuICAgICAgICBsZXQgcGVyc2VudCAgPSAoMSAtIGggLyAyMzApICogNVxuICAgICAgICByID0gY2FsY3VsZXRlTmV3UihwZXJzZW50KTtcbiAgICAgICAgc2VsZWN0ZWRWYWwgPSBjYWxjdWxldGVOZXdWYWwocGVyc2VudClcbiAgICAgICAgdGV4dCA9IHZhbFRvVGV4dChzZWxlY3RlZFZhbCk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShjaGFuZ2VSKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoYW5nZVRleHQpO1xuICAgICAgICAvL9GH0YLQviDQt9Cw0L/QuNGB0YvQstCw0YLRjCDQsiDRgdC+0YHRgtC+0Y/QvdC40LUuINCt0YLQviDQstC+0L7QsdGJ0LUg0LjRgdC/0L7Qu9GM0LfRg9C10YLRgdGPP1xuICAgICAgICBzdGF0ZS5zZWxlY3RlZCA9IGggLyAyMzA7XG4gICAgICAgIGZuKCk7XG4gICAgICB9O1xuXG4gICAgICBsZXQgb25EcmFnWSA9IChldmVudCwgdWkpID0+IHtcbiAgICAgICAgaCA9IHVpLnBvc2l0aW9uLmxlZnQ7XG4gICAgICAgIGxldCBwZXJzZW50ICA9ICggaCAvIDIzMCkgKiA1XG4gICAgICAgIHIgPSBjYWxjdWxldGVOZXdSKHBlcnNlbnQpO1xuICAgICAgICBzZWxlY3RlZFZhbCA9IGNhbGN1bGV0ZU5ld1ZhbChwZXJzZW50KVxuICAgICAgICB0ZXh0ID0gdmFsVG9UZXh0KHNlbGVjdGVkVmFsKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoYW5nZVIpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2hhbmdlVGV4dCk7XG4gICAgICAgIC8v0YfRgtC+INC30LDQv9C40YHRi9Cy0LDRgtGMINCyINGB0L7RgdGC0L7Rj9C90LjQtS4g0K3RgtC+INCy0L7QvtCx0YnQtSDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8/XG4gICAgICAgIHN0YXRlLnNlbGVjdGVkID0gaCAvIDIzMDtcbiAgICAgICAgZm4oKTtcbiAgICAgIH07XG5cbiAgICAgICQoXCIudmFsdWVwaWNrZXItbW9iaWxlLXBpY2tlclwiKS5kcmFnZ2FibGUoe1xuICAgICAgICBjb250YWlubWVudDogXCJwYXJlbnRcIixcbiAgICAgICAgYXhpczogXCJ4XCIsXG4gICAgICAgIGRyYWc6IG9uRHJhZ1ksXG4gICAgICB9KTtcblxuICAgICAgJChcIi52YWx1ZXBpY2tlci1waWNrZXJcIikuZHJhZ2dhYmxlKHtcbiAgICAgICAgY29udGFpbm1lbnQ6IFwicGFyZW50XCIsXG4gICAgICAgIGF4aXM6IFwieVwiLFxuICAgICAgICBkcmFnOiBvbkRyYWcsXG4gICAgICB9KTtcblxuXG4gICAgICBsZXQgaXNSaWdodCA9ICgpID0+IChzZWxlY3RlZFZhbCA+IDMwMDAwMDAgJiYgc2VsZWN0ZWRWYWwgPCA0MDAwMDAwKVxuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBpc1JpZ2h0XG4gICAgICB9XG4gICAgfTtcblxuXG5cbiAgICBmdW5jdGlvbiBob29rVXBWYWxRdWVzdG9uKGlkLCBxdWVzdGlvbiwgVmFsUGlja2VyLCBBbnN3ZXJTZWxlY3RvcnMsIG9uQW5zd2VyKSB7XG5cbiAgICAgIGxldCBhbnN3ZXJCdXR0b24gPSBxdWVzdGlvbi5maW5kKFwiLmFuc3dlckJ1dHRvblwiKTtcbiAgICAgIGxldCBhbnN3ZXIgPSAkKEFuc3dlclNlbGVjdG9ycyk7XG4gICAgICB0aGlzLmlzU2hvd24gPSBmYWxzZTtcblxuXG4gICAgICBsZXQgaW5pdEFuc3dlcnMgPSAoKSA9PiB7XG4gICAgICAgIGhpZGVFbGVtKGFuc3dlcilcbiAgICAgIH07XG5cbiAgICAgIGxldCBzaG93QW5zd2VycyA9ICgpID0+IHtcbiAgICAgICAgc2hvd0VsZW0oYW5zd2VyKTtcbiAgICAgICAgb25BbnN3ZXIgJiYgb25BbnN3ZXIoKTtcbiAgICAgICAgLy8gc2Nyb2xsVG9FbGVtQ2VudGVyKGFuc3dlcilcbiAgICAgICAgc2Nyb2xsVG9FbGVtVG9wKCQoJChcIi5hbnN3ZXJCdXR0b25cIilbaWRdKSlcbiAgICAgIH07XG5cbiAgICAgIGxldCBpbml0UXVlc3Rpb24gPSAoKSA9PiB7XG4gICAgICAgIGhpZGVFbGVtKHF1ZXN0aW9uKTtcbiAgICAgIH07XG5cbiAgICAgIGxldCBzaG93UXVlc3RpbiA9ICgpID0+IHtcbiAgICAgICAgc2hvd0VsZW0ocXVlc3Rpb24pXG4gICAgICAgIC8vIHNjcm9sbFRvRWxlbUNlbnRlcihxdWVzdGlvbilcbiAgICAgICAgc2Nyb2xsVG9FbGVtVG9wKCQoJCgnLmZvb3RlcicpW2lkXSkpXG4gICAgICB9O1xuXG4gICAgICBsZXQgc3RhdGUgPSB7XG4gICAgICAgIHNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc0Fuc3dlcmVkOiBmYWxzZSxcbiAgICAgICAgcmlnaHQ6IDEyLFxuICAgICAgfTtcblxuICAgICAgbGV0IHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoc3RhdGUuaXNBbnN3ZXJlZCkge1xuICAgICAgICAgIHJlbW92ZUJ1dHRvbigpO1xuICAgICAgICAgIGRpc2FibGVTY3JvbGwgPSB0cnVlO1xuICAgICAgICAgIHNldFRpbWVvdXQoc2hvd0Fuc3dlcnMsIDEwMDApO1xuICAgICAgICAgIHF1ZXN0aW9uLmFkZENsYXNzKFwiYW5zd2VyZWRcIik7XG4gICAgICAgICAgc2lkZUJhcnMucmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXRlLnNlbGVjdGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgYW5zd2VyQnV0dG9uLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgbGV0IHJlbW92ZUJ1dHRvbiA9ICgpID0+IHtcbiAgICAgICAgYW5zd2VyQnV0dG9uLmNzcyh7XG4gICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGxldCB2YWxQaWNrZXIgPSBWYWxQaWNrZXIocmVuZGVyLCBzdGF0ZSk7XG5cbiAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgIHRoaXMucmVzdWx0ID0gbnVsbDtcblxuICAgICAgLy9DbGljayBvbiBhbnN3ZXJcbiAgICAgIGFuc3dlckJ1dHRvbi5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgc3RhdGUuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgIHRoYXQucmVzdWx0ID0gdmFsUGlja2VyLmlzUmlnaHQoKVxuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICAvL1Nob3cgcXVlc3Rpb25cbiAgICAgICQoJy5zY3JvbGxCdG4nKVtpZF0ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGF0LnNob3coKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbml0ID0gKCkgPT4ge1xuICAgICAgICBpbml0UXVlc3Rpb24oKTtcbiAgICAgICAgaW5pdEFuc3dlcnMoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNpZGVCYXJzLnNlbGVjdChpZCk7XG4gICAgICAgIGlmIChpZCA9PSAwKSB7XG4gICAgICAgICAgc2lkZUJhcnMuc2hvdygpXG4gICAgICAgIH1cbiAgICAgICAgc2hvd1F1ZXN0aW4oKTtcbiAgICAgICAgdGhpcy5pc1Nob3duID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBob29rVXBRdWVzdG9uKGlkLCBxdWVzdGlvbiwgcmlnaHQsIEFuc3dlclNlbGVjdG9ycywgb25BbnN3ZXIpIHtcblxuXG4gICAgICBsZXQgYW5zd2VyQnV0dG9uID0gcXVlc3Rpb24uZmluZChcIi5hbnN3ZXJCdXR0b25cIik7XG4gICAgICBsZXQgYW5zd2VyID0gJChBbnN3ZXJTZWxlY3RvcnMpO1xuXG5cbiAgICAgIGxldCBpbml0QW5zd2VycyA9ICgpID0+IHtcbiAgICAgICAgaGlkZUVsZW0oYW5zd2VyKVxuICAgICAgfTtcblxuICAgICAgbGV0IHNob3dBbnN3ZXJzID0gKCkgPT4ge1xuICAgICAgICBzaG93RWxlbShhbnN3ZXIpO1xuICAgICAgICBvbkFuc3dlciAmJiBvbkFuc3dlcigpO1xuICAgICAgICAvLyBzY3JvbGxUb0VsZW1DZW50ZXIoYW5zd2VyKVxuICAgICAgICBzY3JvbGxUb0VsZW1Ub3AoJCgkKFwiLmFuc3dlckJ1dHRvblwiKVtpZF0pKVxuICAgICAgfTtcblxuICAgICAgbGV0IGluaXRRdWVzdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaGlkZUVsZW0ocXVlc3Rpb24pO1xuICAgICAgfTtcblxuXG4gICAgICBsZXQgc2hvd1F1ZXN0aW4gPSAoKSA9PiB7XG4gICAgICAgIHNob3dFbGVtKHF1ZXN0aW9uKTtcbiAgICAgICAgLy8gc2Nyb2xsVG9FbGVtQ2VudGVyKHF1ZXN0aW9uKTtcbiAgICAgICAgc2Nyb2xsVG9FbGVtVG9wKCQoJCgnLmZvb3RlcicpW2lkXSkpXG4gICAgICB9O1xuXG4gICAgICBsZXQgc3RhdGUgPSB7XG4gICAgICAgIHNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc0Fuc3dlcmVkOiBmYWxzZSxcbiAgICAgICAgcmlnaHQ6IHJpZ2h0LFxuICAgICAgfTtcblxuICAgICAgbGV0IHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoc3RhdGUuaXNBbnN3ZXJlZCkge1xuICAgICAgICAgIGRpc2FibGVTY3JvbGwgPSB0cnVlO1xuICAgICAgICAgIHJlbW92ZUJ1dHRvbigpO1xuICAgICAgICAgIHNldFRpbWVvdXQoc2hvd0Fuc3dlcnMsIDEwMDApO1xuICAgICAgICAgIHF1ZXN0aW9uLmFkZENsYXNzKFwiYW5zd2VyZWRcIik7XG4gICAgICAgICAgc2lkZUJhcnMucmVuZGVyKCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHN0YXRlLnNlbGVjdGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgICBhbnN3ZXJCdXR0b24uYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJlbmRlck9wdGlvbnMoKTtcbiAgICAgIH07XG5cbiAgICAgIGxldCBvcHRpb25zID0gcXVlc3Rpb24uZmluZChcIi5hbnN3ZXJzIC5pdGVtIC5lbGVtXCIpO1xuXG4gICAgICBsZXQgcmVuZGVyT3B0aW9ucyA9ICgpID0+IHtcbiAgICAgICAgaWYgKCFzdGF0ZS5pc0Fuc3dlcmVkKSB7XG4gICAgICAgICAgJC5lYWNoKG9wdGlvbnMsIGZ1bmN0aW9uKGksIGVsZW0pIHtcbiAgICAgICAgICAgIGlmIChpID09IHN0YXRlLnNlbGVjdGVkKSB7XG4gICAgICAgICAgICAgICQoZWxlbSkuYWRkQ2xhc3MoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICQoZWxlbSkucmVtb3ZlQ2xhc3MoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoc3RhdGUuc2VsZWN0ZWQgIT09IHN0YXRlLnJpZ2h0KSB7XG4gICAgICAgICAgICBvcHRpb25zW3N0YXRlLnNlbGVjdGVkXS5jbGFzc0xpc3QuYWRkKFwid3JvbmdcIik7XG4gICAgICAgICAgICBvcHRpb25zW3N0YXRlLnNlbGVjdGVkXS5jbGFzc0xpc3QucmVtb3ZlKFwic2VsZWN0ZWRcIik7XG4gICAgICAgICAgfVxuICAgICAgICAgIG9wdGlvbnNbc3RhdGUucmlnaHRdLmNsYXNzTGlzdC5hZGQoXCJyaWdodFwiKTtcbiAgICAgICAgfTtcbiAgICAgIH07XG5cbiAgICAgIGxldCBpbml0T3B0aW9ucyA9ICgpID0+IHtcbiAgICAgICAgbGV0IG9uU2VsZWN0ID0gKGV2ZW50KSA9PiB7XG4gICAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSBwYXJzZUludChldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuaWQpO1xuICAgICAgICAgIHJlbmRlcigpO1xuICAgICAgICB9O1xuICAgICAgICBvcHRpb25zLm9uKFwiY2xpY2tcIiwgb25TZWxlY3QpO1xuICAgICAgfTtcblxuICAgICAgbGV0IHJlbW92ZUJ1dHRvbiA9ICgpID0+IHtcbiAgICAgICAgYW5zd2VyQnV0dG9uLmNzcyh7XG4gICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgIHRoaXMucmVzdWx0ID0gbnVsbDtcblxuICAgICAgYW5zd2VyQnV0dG9uLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBzdGF0ZS5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgdGhhdC5yZXN1bHQgPSBzdGF0ZS5zZWxlY3RlZCA9PSBzdGF0ZS5yaWdodFxuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICAkKCcuc2Nyb2xsQnRuJylbaWRdLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhhdC5zaG93KCk7XG4gICAgICB9XG5cbiAgICAgIGxldCBpbml0ID0gKCkgPT4ge1xuICAgICAgICBpbml0T3B0aW9ucygpO1xuICAgICAgICBpbml0UXVlc3Rpb24oKTtcbiAgICAgICAgaW5pdEFuc3dlcnMoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pc1Nob3duID0gZmFsc2U7XG5cbiAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzaWRlQmFycy5zZWxlY3QoaWQpO1xuICAgICAgICBpZiAoaWQgPT0gMCkge1xuICAgICAgICAgIHNpZGVCYXJzLnNob3coKVxuICAgICAgICB9XG4gICAgICAgIHNob3dRdWVzdGluKCk7XG4gICAgICAgIHRoaXMuaXNTaG93biA9IHRydWU7XG4gICAgICB9XG4gICAgICB0aGlzLmluaXQgPSBpbml0O1xuICAgIH07XG5cblxuXG5cbiAgICBsZXQgZ2V0RGF0YUFuZE1hcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJChcIi5tYXBfYm9keVwiKS5sb2FkKFwibWFwLnN2Z1wiLCBmdW5jdGlvbigpIHtcblxuICAgICAgICAgIGxldCBibG9iID0gbnVsbDtcbiAgICAgICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICAgICAgeGhyLm9wZW4oXCJHRVRcIiwgXCJISVZfRGF0YV9ieV9yZWcuY3N2XCIpO1xuICAgICAgICAgIHhoci5yZXNwb25zZVR5cGUgPSBcImJsb2JcIjsgLy9mb3JjZSB0aGUgSFRUUCByZXNwb25zZSwgcmVzcG9uc2UtdHlwZSBoZWFkZXIgdG8gYmUgYmxvYlxuICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGJsb2IgPSB4aHIucmVzcG9uc2U7IC8veGhyLnJlc3BvbnNlIGlzIG5vdyBhIGJsb2Igb2JqZWN0XG4gICAgICAgICAgICBteVJlYWRlci5yZWFkQXNUZXh0KGJsb2IpO1xuICAgICAgICAgIH07XG4gICAgICAgICAgeGhyLnNlbmQoKTtcblxuICAgICAgICAgIGxldCBteVJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKCk7XG4gICAgICAgICAgbXlSZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlbmRcIiwgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgICAgICBsZXQgZGF0YSA9IG5ld0RhdGFQcm9zZWVkKGUuc3JjRWxlbWVudC5yZXN1bHQpO1xuICAgICAgICAgICAgbGV0IHJlZ0luZm8gPSBuZXcgUmVnSW5mbyhkYXRhKTtcbiAgICAgICAgICAgIGxldCByZWdJbmZvTW9iaWxlID0gbmV3IFJlZ0luZm9Nb2JpbGUoZGF0YSlcbiAgICAgICAgICAgIHJlZ0luZm8uaW5pdCgpXG4gICAgICAgICAgICByZWdJbmZvLnJlbmRlcigpO1xuICAgICAgICAgICAgcmVnSW5mb01vYmlsZS5pbml0KCk7XG4gICAgICAgICAgICByZWdJbmZvTW9iaWxlLnJlbmRlcigpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KVxuICAgICAgfVxuXG4gICAgZ2V0RGF0YUFuZE1hcCgpO1xuXG4gICAgLy8ga2V5UmVhc29uQ2hhcnQuc2hvdygpO1xuICAgIC8vIG5ld0luZmVjdGVkQ2hhcnRNb2JpbGUuc2hvdygpO1xuXG4gICAgbGV0IGZvb3RlciA9IG5ldyBGb290ZXIoNyk7XG5cblxuICAgIGxldCBxdWl6RWxlbXMgPSBbXG4gICAgICBuZXcgaG9va1VwUXVlc3RvbigwLCAkKFwiLnF1ZXN0aW9uLW9uZVwiKSwgMiwgXCIucGxhdGUzXCIpLFxuICAgICAgbmV3IGhvb2tVcFF1ZXN0b24oMSwgJChcIi5xdWVzdGlvbi10d29cIiksIDMsIFwiLnBsYXRlNVwiLCBnZXREYXRhQW5kTWFwKSxcbiAgICAgIG5ldyBob29rVXBRdWVzdG9uKDIsICQoXCIucXVlc3Rpb24tdGhyZWVcIiksIDIsIFwiLmFuc3dlci10aHJlZSwgLnBsYXRlNi1hZnRlclwiLFxuICAgICAgICBmdW5jdGlvbigpIHtcbiAgICAgICAgICBuZXdJbmZlY3RlZENoYXJ0LnNob3coKTtcbiAgICAgICAgICBuZXdJbmZlY3RlZENoYXJ0TW9iaWxlLnNob3coKTtcbiAgICAgICAgfSksXG4gICAgICBuZXcgaG9va1VwVmFsUXVlc3RvbigzLCAkKFwiLnF1ZXN0aW9uLWZvdXJcIiksIHZhbFBpY2tlcjMsIFwiLmFuc3dlci1mb3VyLCAucGxhdGU3LWFmdGVyXCIpLFxuICAgICAgbmV3IGhvb2tVcFZhbFF1ZXN0b24oNCwgJChcIi5xdWVzdGlvbi1maXZlXCIpLCB2YWxQaWNrZXIyLCBcIi5hbnN3ZXItZml2ZVwiLCBrZXlSZWFzb25DaGFydC5zaG93KSxcbiAgICAgIG5ldyBob29rVXBWYWxRdWVzdG9uKDUsICQoXCIucXVlc3Rpb24tc2l4XCIpLCB2YWxQaWNrZXIsIFwiLmFuc3dlci1zaXhcIiksXG4gICAgICBuZXcgaG9va1VwUXVlc3Rvbig2LCAkKFwiLnF1ZXN0aW9uLXNldmVuXCIpLCAxLCBcIi5hbnN3ZXItc2V2ZW4sIC5wbGF0ZTEwLWFmdGVyXCIpLFxuICAgICAgZm9vdGVyLFxuICAgIF07XG5cbiAgICBsZXQgc2lkZUJhcnMgPSBuZXcgU2lkZUJhcnMocXVpekVsZW1zKTtcblxuICAgIGZvb3Rlci5lZS5vbihcInNob3dcIiwgKGUpPT57XG4gICAgICBzaWRlQmFycy5zZWxlY3QoZSk7XG4gICAgICByZW5kZXJSZXN1bHQoKTtcbiAgICB9KVxuXG5cbiAgICBxdWl6RWxlbXMuZm9yRWFjaChlbGVtID0+IGVsZW0uaW5pdCgpKTtcblxuXG4gICAgLy8gcXVpekVsZW1zLmZvckVhY2goZWxlbSA9PiBlbGVtLnNob3coKSk7XG5cblxuICAgIGxldCByZXN1bHRzID0gW3tcbiAgICAgIHRleHQ6IFwi0KHQn9CY0JQsINC60LDQuiDQuNC30LLQtdGB0YLQvdC+LCDQvdC1INGB0L/QuNGCLiDQkCDQstGLINC/0L7Rh9GC0Lgg0L3QuNGH0LXQs9C+INC+INC90ZHQvCDQvdC1INC30L3QsNC10YLQtVwiLFxuICAgIH0sIHtcbiAgICAgIHRleHQ6IFwi0JrQsNC20LXRgtGB0Y8sINCy0YssINC/0L4g0LrRgNCw0LnQvdC10Lkg0LzQtdGA0LUsINC30L3QsNC10YLQtSwg0YfQtdC8INC+0YLQu9C40YfQsNC10YLRgdGPINCS0JjQpyDQvtGCINCh0J/QmNCUXCIsXG4gICAgfSwge1xuICAgICAgdGV4dDogXCLQktGLINC+0YLQu9C40YfQvdC+INGA0LDQt9Cx0LjRgNCw0LXRgtC10YHRjCDQsiDRjdGC0L7QuSDQvdC10LLQtdGB0ZHQu9C+0Lkg0YLQtdC80LUhXCIsXG4gICAgfSwgXVxuXG5cbiAgICBsZXQgcmVuZGVyUmVzdWx0ID0gZnVuY3Rpb24oKSB7XG5cbiAgICAgIGxldCByZXN1bHRWYWwgPSBxdWl6RWxlbXMucmVkdWNlKCh2YWwsIGUpID0+IHtcbiAgICAgICAgaWYgKGUgaW5zdGFuY2VvZiBob29rVXBWYWxRdWVzdG9uIHx8IGUgaW5zdGFuY2VvZiBob29rVXBRdWVzdG9uKSB7XG4gICAgICAgICAgdmFsID0gKGUucmVzdWx0KSA/IHZhbCArIDEgOiB2YWxcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdmFsO1xuICAgICAgfSwgMClcblxuICAgICAgbGV0IHJlc3VsdFRleHRJZCA9IHJlc3VsdFZhbCA+IDUgPyAyIDogcmVzdWx0VmFsID4gMyA/IDEgOiAwO1xuICAgICAgbGV0IG9iaiA9IHJlc3VsdHNbcmVzdWx0VGV4dElkXVxuXG4gICAgICAkKFwiLnBsYXRlMTEgLnJlc3VsdCAuY29tbWVudFwiKS50ZXh0KG9iai50ZXh0KVxuICAgIH1cblxuXG4gICAgbGV0IHNob3dOZXh0ID0gKCkgPT4ge1xuICAgICAgZm9yIChsZXQgaSA9IHF1aXpFbGVtcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBsZXQgZSA9IHF1aXpFbGVtc1tpXTtcbiAgICAgICAgaWYgKGkgPT0gMCAmJiAhZS5pc1Nob3duKSB7XG4gICAgICAgICAgcXVpekVsZW1zW2ldLnNob3coKTtcbiAgICAgICAgICBzaWRlQmFycy5zaG93KClcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGUuaXNTaG93biAmJiBlLnJlc3VsdCAhPT0gbnVsbCAmJiBpIDwgcXVpekVsZW1zLmxlbmd0aCAtIDEpIHtcbiAgICAgICAgICBpZiAoIXF1aXpFbGVtc1tpICsgMV0uaXNTaG93bikgcXVpekVsZW1zW2kgKyAxXS5zaG93KCk7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG5cbiAgICBsZXQgb2xkU2Nyb2xsUG9zaXRvaW4gPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblxuICAgIGFkZE1vdXNlZXdoZWVsRXZlbnQoZG9jdW1lbnQsb25XaGVlbClcblxuICAgIGZ1bmN0aW9uIG9uV2hlZWwoZSkge1xuICAgICAgZSA9IGUgfHwgd2luZG93LmV2ZW50O1xuXG4gICAgICBpZiAoZGlzYWJsZVNjcm9sbCkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0ID8gZS5wcmV2ZW50RGVmYXVsdCgpIDogKGUucmV0dXJuVmFsdWUgPSBmYWxzZSk7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgbGV0IG5ld1Njcm9sbFBvc2l0b2luID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG5cbiAgICAgIC8vIHdoZWVsRGVsdGEg0L3QtSDQtNCw0LXRgiDQstC+0LfQvNC+0LbQvdC+0YHRgtGMINGD0LfQvdCw0YLRjCDQutC+0LvQuNGH0LXRgdGC0LLQviDQv9C40LrRgdC10LvQtdC5XG4gICAgICBsZXQgZGVsdGEgPSBlLmRlbHRhWSB8fCBlLmRldGFpbCB8fCBlLndoZWVsRGVsdGE7XG5cbiAgICAgIGlmIChuZXdTY3JvbGxQb3NpdG9pbiA9PSBvbGRTY3JvbGxQb3NpdG9pbiAmJiBkZWx0YSA+IDEwKSB7XG4gICAgICAgIHNob3dOZXh0KCk7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiAoZS5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcbiAgICAgIH1cbiAgICAgIGlmIChkZWx0YSA+IDEwKSB7XG4gICAgICAgIG9sZFNjcm9sbFBvc2l0b2luID0gbmV3U2Nyb2xsUG9zaXRvaW47XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuXG5cbiAgJChcIi5zaGFyZS1idG4sIC5zaGFyZS1idG4tYmlnXCIpLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgIHNoYXJlKHRoaXMuZGF0YXNldC5uZXR3b3JrKTtcbiAgfSlcblxufSkoKTtcbiIsImltcG9ydCB7Z2V0Q29sb3JNZXRhfSBmcm9tIFwiLi91dGlsc1wiO1xuaW1wb3J0IHtuZXdJbmZlY3RlZERhdGF9IGZyb20gXCIuL0RhdGEuanNcIlxuXG5sZXQgbmV3SW5mZWN0ZWRDaGFydCA9ICgoKSA9PiB7XG5cbiAgbGV0IGRhdGEgPSBuZXdJbmZlY3RlZERhdGE7XG5cblxuICBsZXQgYmFycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jaGFydC5uZXdJbmZlY3RlZCAuYm9keSAuY2FudmFzIC5iYXInKTtcblxuXG4gIGxldCBzdGFydENvbG9yID0gWzIyOCwgMTUyLCAxNTJdO1xuICBsZXQgZW5kQ29sb3IgPSBbMTkwLCAzMiwgMzddO1xuICBsZXQgbWF4ID0gMTAwICogMTAwMDtcblxuICBsZXQgaSA9IDA7XG5cbiAgbGV0IHJlbmRlcm5ld0luZmVjdGVkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGkgPj0gZGF0YS5sZW5ndGgpIHtcbiAgICAgIGxldCBsYWJlbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmV3SW5mZWN0ZWRfbGFiZWxfdGV4dCcpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKGxhYmVscywgZWxlbSA9PiBlbGVtLnN0eWxlLm9wYWNpdHkgPSAwLjkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgdmFsID0gZGF0YVtpXTtcbiAgICBpZiAodmFsIDwgNDAwMCkge1xuICAgICAgYmFyc1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiKDI0LDE3OSwxNzIpJztcbiAgICAgIGJhcnNbaV0uc3R5bGUubWFyZ2luVG9wID0gMjYwICogMC45OCArIFwicHhcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGNvbG9yID0gZ2V0Q29sb3JNZXRhKHN0YXJ0Q29sb3IsIGVuZENvbG9yLCB2YWwgLyBtYXgpO1xuICAgICAgYmFyc1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiKCR7Y29sb3J9KWA7XG4gICAgICBiYXJzW2ldLnN0eWxlLm1hcmdpblRvcCA9ICgxIC0gdmFsIC8gbWF4KSAqIDI2MCArIFwicHhcIjtcbiAgICB9XG5cbiAgICBpZiAoaSA9PSAzKSB7XG4gICAgICBiYXJzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2IoMjQsMTc5LDE3MiknO1xuICAgIH1cblxuICAgIGkrKztcbiAgICBzZXRUaW1lb3V0KHJlbmRlcm5ld0luZmVjdGVkLCAzMCk7XG4gIH07XG5cbiAgbGV0IHNob3cgPSAoKSA9PiB7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgcmVuZGVybmV3SW5mZWN0ZWQoKTtcbiAgICB9LCAxMDAwKTtcblxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgc2hvd1xuICB9XG5cbn0pKCk7XG5cblxuZXhwb3J0IGRlZmF1bHQgbmV3SW5mZWN0ZWRDaGFydDtcbiIsIlxuaW1wb3J0IHtnZXRDb2xvck1ldGF9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQge25ld0luZmVjdGVkRGF0YX0gZnJvbSBcIi4vRGF0YS5qc1wiXG5cblxubGV0IG5ld0luZmVjdGVkQ2hhcnRNb2JpbGUgPSAoKCkgPT4ge1xuXG4gIGxldCBkYXRhID0gbmV3SW5mZWN0ZWREYXRhO1xuXG5cbiAgbGV0IGJhcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2hhcnQubmV3SW5mZWN0ZWQtbW9iaWxlIC5ib2R5IC5jYW52YXMgLmJsb2NrJyk7XG5cblxuICBsZXQgc3RhcnRDb2xvciA9IFsyMjgsIDE1MiwgMTUyXTtcbiAgbGV0IGVuZENvbG9yID0gWzE5MCwgMzIsIDM3XTtcbiAgbGV0IG1heCA9IDEwMCAqIDEwMDA7XG5cbiAgbGV0IGkgPSAwO1xuXG4gIGxldCByZW5kZXJuZXdJbmZlY3RlZCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChpID49IGRhdGEubGVuZ3RoKSB7XG4gICAgICBsZXQgbGFiZWxzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLm5ld0luZmVjdGVkX2xhYmVsX3RleHQnKTtcbiAgICAgIFtdLmZvckVhY2guY2FsbChsYWJlbHMsIGVsZW0gPT4gZWxlbS5zdHlsZS5vcGFjaXR5ID0gMC45KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHZhbCA9IGRhdGFbaV07XG4gICAgaWYgKHZhbCA8IDQwMDApIHtcbiAgICAgIGJhcnNbaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYigyNCwxNzksMTcyKSc7XG4gICAgICBiYXJzW2ldLnN0eWxlLm1hcmdpbkxlZnQgPSAtMTkwICogMC45OCArIFwicHhcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGNvbG9yID0gZ2V0Q29sb3JNZXRhKHN0YXJ0Q29sb3IsIGVuZENvbG9yLCB2YWwgLyBtYXgpO1xuICAgICAgYmFyc1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiKCR7Y29sb3J9KWA7XG4gICAgICBiYXJzW2ldLnN0eWxlLm1hcmdpbkxlZnQgPSAoMCAtIDE5MCkgKiAoMSAtIHZhbCAvIG1heCkgKyBcInB4XCI7XG4gICAgfVxuXG4gICAgaWYgKGkgPT0gMykge1xuICAgICAgYmFyc1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiKDI0LDE3OSwxNzIpJztcbiAgICB9XG5cbiAgICBpKys7XG4gICAgc2V0VGltZW91dChyZW5kZXJuZXdJbmZlY3RlZCwgMzApO1xuICB9O1xuXG4gIGxldCBzaG93ID0gKCkgPT4ge1xuXG4gICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgIHJlbmRlcm5ld0luZmVjdGVkKCk7XG4gICAgfSwgMTAwMCk7XG5cbiAgfTtcblxuICByZXR1cm4ge1xuICAgIHNob3dcbiAgfVxuXG59KSgpO1xuXG5leHBvcnQgZGVmYXVsdCAgbmV3SW5mZWN0ZWRDaGFydE1vYmlsZTtcbiIsIi8qIVxuICogRXZlbnRFbWl0dGVyIHY1LjEuMCAtIGdpdC5pby9lZVxuICogVW5saWNlbnNlIC0gaHR0cDovL3VubGljZW5zZS5vcmcvXG4gKiBPbGl2ZXIgQ2FsZHdlbGwgLSBodHRwOi8vb2xpLm1lLnVrL1xuICogQHByZXNlcnZlXG4gKi9cblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIC8qKlxuICAgICAqIENsYXNzIGZvciBtYW5hZ2luZyBldmVudHMuXG4gICAgICogQ2FuIGJlIGV4dGVuZGVkIHRvIHByb3ZpZGUgZXZlbnQgZnVuY3Rpb25hbGl0eSBpbiBvdGhlciBjbGFzc2VzLlxuICAgICAqXG4gICAgICogQGNsYXNzIEV2ZW50RW1pdHRlciBNYW5hZ2VzIGV2ZW50IHJlZ2lzdGVyaW5nIGFuZCBlbWl0dGluZy5cbiAgICAgKi9cbiAgICBmdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7fVxuXG4gICAgLy8gU2hvcnRjdXRzIHRvIGltcHJvdmUgc3BlZWQgYW5kIHNpemVcbiAgICB2YXIgcHJvdG8gPSBFdmVudEVtaXR0ZXIucHJvdG90eXBlO1xuICAgIHZhciBvcmlnaW5hbEdsb2JhbFZhbHVlID0gZXhwb3J0cy5FdmVudEVtaXR0ZXI7XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyB0aGUgaW5kZXggb2YgdGhlIGxpc3RlbmVyIGZvciB0aGUgZXZlbnQgaW4gaXRzIHN0b3JhZ2UgYXJyYXkuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IGxpc3RlbmVycyBBcnJheSBvZiBsaXN0ZW5lcnMgdG8gc2VhcmNoIHRocm91Z2guXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGxvb2sgZm9yLlxuICAgICAqIEByZXR1cm4ge051bWJlcn0gSW5kZXggb2YgdGhlIHNwZWNpZmllZCBsaXN0ZW5lciwgLTEgaWYgbm90IGZvdW5kXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVycywgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGkgPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzW2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICAgICAgICAgIHJldHVybiBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIC0xO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFsaWFzIGEgbWV0aG9kIHdoaWxlIGtlZXBpbmcgdGhlIGNvbnRleHQgY29ycmVjdCwgdG8gYWxsb3cgZm9yIG92ZXJ3cml0aW5nIG9mIHRhcmdldCBtZXRob2QuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgdGFyZ2V0IG1ldGhvZC5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gVGhlIGFsaWFzZWQgbWV0aG9kXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgZnVuY3Rpb24gYWxpYXMobmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gYWxpYXNDbG9zdXJlKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXNbbmFtZV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBSZXR1cm5zIHRoZSBsaXN0ZW5lciBhcnJheSBmb3IgdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBXaWxsIGluaXRpYWxpc2UgdGhlIGV2ZW50IG9iamVjdCBhbmQgbGlzdGVuZXIgYXJyYXlzIGlmIHJlcXVpcmVkLlxuICAgICAqIFdpbGwgcmV0dXJuIGFuIG9iamVjdCBpZiB5b3UgdXNlIGEgcmVnZXggc2VhcmNoLiBUaGUgb2JqZWN0IGNvbnRhaW5zIGtleXMgZm9yIGVhY2ggbWF0Y2hlZCBldmVudC4gU28gL2JhW3J6XS8gbWlnaHQgcmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIGJhciBhbmQgYmF6LiBCdXQgb25seSBpZiB5b3UgaGF2ZSBlaXRoZXIgZGVmaW5lZCB0aGVtIHdpdGggZGVmaW5lRXZlbnQgb3IgYWRkZWQgc29tZSBsaXN0ZW5lcnMgdG8gdGhlbS5cbiAgICAgKiBFYWNoIHByb3BlcnR5IGluIHRoZSBvYmplY3QgcmVzcG9uc2UgaXMgYW4gYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmV0dXJuIHRoZSBsaXN0ZW5lcnMgZnJvbS5cbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbltdfE9iamVjdH0gQWxsIGxpc3RlbmVyIGZ1bmN0aW9ucyBmb3IgdGhlIGV2ZW50LlxuICAgICAqL1xuICAgIHByb3RvLmdldExpc3RlbmVycyA9IGZ1bmN0aW9uIGdldExpc3RlbmVycyhldnQpIHtcbiAgICAgICAgdmFyIGV2ZW50cyA9IHRoaXMuX2dldEV2ZW50cygpO1xuICAgICAgICB2YXIgcmVzcG9uc2U7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgLy8gUmV0dXJuIGEgY29uY2F0ZW5hdGVkIGFycmF5IG9mIGFsbCBtYXRjaGluZyBldmVudHMgaWZcbiAgICAgICAgLy8gdGhlIHNlbGVjdG9yIGlzIGEgcmVndWxhciBleHByZXNzaW9uLlxuICAgICAgICBpZiAoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXNwb25zZSA9IHt9O1xuICAgICAgICAgICAgZm9yIChrZXkgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGV2dC50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2Vba2V5XSA9IGV2ZW50c1trZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0gZXZlbnRzW2V2dF0gfHwgKGV2ZW50c1tldnRdID0gW10pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBUYWtlcyBhIGxpc3Qgb2YgbGlzdGVuZXIgb2JqZWN0cyBhbmQgZmxhdHRlbnMgaXQgaW50byBhIGxpc3Qgb2YgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtPYmplY3RbXX0gbGlzdGVuZXJzIFJhdyBsaXN0ZW5lciBvYmplY3RzLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9uW119IEp1c3QgdGhlIGxpc3RlbmVyIGZ1bmN0aW9ucy5cbiAgICAgKi9cbiAgICBwcm90by5mbGF0dGVuTGlzdGVuZXJzID0gZnVuY3Rpb24gZmxhdHRlbkxpc3RlbmVycyhsaXN0ZW5lcnMpIHtcbiAgICAgICAgdmFyIGZsYXRMaXN0ZW5lcnMgPSBbXTtcbiAgICAgICAgdmFyIGk7XG5cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgZmxhdExpc3RlbmVycy5wdXNoKGxpc3RlbmVyc1tpXS5saXN0ZW5lcik7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gZmxhdExpc3RlbmVycztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgcmVxdWVzdGVkIGxpc3RlbmVycyB2aWEgZ2V0TGlzdGVuZXJzIGJ1dCB3aWxsIGFsd2F5cyByZXR1cm4gdGhlIHJlc3VsdHMgaW5zaWRlIGFuIG9iamVjdC4gVGhpcyBpcyBtYWlubHkgZm9yIGludGVybmFsIHVzZSBidXQgb3RoZXJzIG1heSBmaW5kIGl0IHVzZWZ1bC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIHJldHVybiB0aGUgbGlzdGVuZXJzIGZyb20uXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBBbGwgbGlzdGVuZXIgZnVuY3Rpb25zIGZvciBhbiBldmVudCBpbiBhbiBvYmplY3QuXG4gICAgICovXG4gICAgcHJvdG8uZ2V0TGlzdGVuZXJzQXNPYmplY3QgPSBmdW5jdGlvbiBnZXRMaXN0ZW5lcnNBc09iamVjdChldnQpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzKGV2dCk7XG4gICAgICAgIHZhciByZXNwb25zZTtcblxuICAgICAgICBpZiAobGlzdGVuZXJzIGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge307XG4gICAgICAgICAgICByZXNwb25zZVtldnRdID0gbGlzdGVuZXJzO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlIHx8IGxpc3RlbmVycztcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gaXNWYWxpZExpc3RlbmVyIChsaXN0ZW5lcikge1xuICAgICAgICBpZiAodHlwZW9mIGxpc3RlbmVyID09PSAnZnVuY3Rpb24nIHx8IGxpc3RlbmVyIGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgICB9IGVsc2UgaWYgKGxpc3RlbmVyICYmIHR5cGVvZiBsaXN0ZW5lciA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgIHJldHVybiBpc1ZhbGlkTGlzdGVuZXIobGlzdGVuZXIubGlzdGVuZXIpXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2VcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZHMgYSBsaXN0ZW5lciBmdW5jdGlvbiB0byB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFRoZSBsaXN0ZW5lciB3aWxsIG5vdCBiZSBhZGRlZCBpZiBpdCBpcyBhIGR1cGxpY2F0ZS5cbiAgICAgKiBJZiB0aGUgbGlzdGVuZXIgcmV0dXJucyB0cnVlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkIGFmdGVyIGl0IGlzIGNhbGxlZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhcyB0aGUgZXZlbnQgbmFtZSB0aGVuIHRoZSBsaXN0ZW5lciB3aWxsIGJlIGFkZGVkIHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGF0dGFjaCB0aGUgbGlzdGVuZXIgdG8uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBldmVudCBpcyBlbWl0dGVkLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyB0cnVlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkIGFmdGVyIGNhbGxpbmcuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkTGlzdGVuZXIgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICghaXNWYWxpZExpc3RlbmVyKGxpc3RlbmVyKSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignbGlzdGVuZXIgbXVzdCBiZSBhIGZ1bmN0aW9uJyk7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnNBc09iamVjdChldnQpO1xuICAgICAgICB2YXIgbGlzdGVuZXJJc1dyYXBwZWQgPSB0eXBlb2YgbGlzdGVuZXIgPT09ICdvYmplY3QnO1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGluZGV4T2ZMaXN0ZW5lcihsaXN0ZW5lcnNba2V5XSwgbGlzdGVuZXIpID09PSAtMSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyc1trZXldLnB1c2gobGlzdGVuZXJJc1dyYXBwZWQgPyBsaXN0ZW5lciA6IHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgICAgICAgICBvbmNlOiBmYWxzZVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIGFkZExpc3RlbmVyXG4gICAgICovXG4gICAgcHJvdG8ub24gPSBhbGlhcygnYWRkTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIFNlbWktYWxpYXMgb2YgYWRkTGlzdGVuZXIuIEl0IHdpbGwgYWRkIGEgbGlzdGVuZXIgdGhhdCB3aWxsIGJlXG4gICAgICogYXV0b21hdGljYWxseSByZW1vdmVkIGFmdGVyIGl0cyBmaXJzdCBleGVjdXRpb24uXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBhdHRhY2ggdGhlIGxpc3RlbmVyIHRvLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byBiZSBjYWxsZWQgd2hlbiB0aGUgZXZlbnQgaXMgZW1pdHRlZC4gSWYgdGhlIGZ1bmN0aW9uIHJldHVybnMgdHJ1ZSB0aGVuIGl0IHdpbGwgYmUgcmVtb3ZlZCBhZnRlciBjYWxsaW5nLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmFkZE9uY2VMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZE9uY2VMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmFkZExpc3RlbmVyKGV2dCwge1xuICAgICAgICAgICAgbGlzdGVuZXI6IGxpc3RlbmVyLFxuICAgICAgICAgICAgb25jZTogdHJ1ZVxuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgYWRkT25jZUxpc3RlbmVyLlxuICAgICAqL1xuICAgIHByb3RvLm9uY2UgPSBhbGlhcygnYWRkT25jZUxpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBEZWZpbmVzIGFuIGV2ZW50IG5hbWUuIFRoaXMgaXMgcmVxdWlyZWQgaWYgeW91IHdhbnQgdG8gdXNlIGEgcmVnZXggdG8gYWRkIGEgbGlzdGVuZXIgdG8gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIElmIHlvdSBkb24ndCBkbyB0aGlzIHRoZW4gaG93IGRvIHlvdSBleHBlY3QgaXQgdG8ga25vdyB3aGF0IGV2ZW50IHRvIGFkZCB0bz8gU2hvdWxkIGl0IGp1c3QgYWRkIHRvIGV2ZXJ5IHBvc3NpYmxlIG1hdGNoIGZvciBhIHJlZ2V4PyBOby4gVGhhdCBpcyBzY2FyeSBhbmQgYmFkLlxuICAgICAqIFlvdSBuZWVkIHRvIHRlbGwgaXQgd2hhdCBldmVudCBuYW1lcyBzaG91bGQgYmUgbWF0Y2hlZCBieSBhIHJlZ2V4LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBjcmVhdGUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZGVmaW5lRXZlbnQgPSBmdW5jdGlvbiBkZWZpbmVFdmVudChldnQpIHtcbiAgICAgICAgdGhpcy5nZXRMaXN0ZW5lcnMoZXZ0KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFVzZXMgZGVmaW5lRXZlbnQgdG8gZGVmaW5lIG11bHRpcGxlIGV2ZW50cy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nW119IGV2dHMgQW4gYXJyYXkgb2YgZXZlbnQgbmFtZXMgdG8gZGVmaW5lLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmRlZmluZUV2ZW50cyA9IGZ1bmN0aW9uIGRlZmluZUV2ZW50cyhldnRzKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXZ0cy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kZWZpbmVFdmVudChldnRzW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhIGxpc3RlbmVyIGZ1bmN0aW9uIGZyb20gdGhlIHNwZWNpZmllZCBldmVudC5cbiAgICAgKiBXaGVuIHBhc3NlZCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBhcyB0aGUgZXZlbnQgbmFtZSwgaXQgd2lsbCByZW1vdmUgdGhlIGxpc3RlbmVyIGZyb20gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lciBmcm9tLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb259IGxpc3RlbmVyIE1ldGhvZCB0byByZW1vdmUgZnJvbSB0aGUgZXZlbnQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlTGlzdGVuZXIgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBpbmRleDtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnMpIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGluZGV4ID0gaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyc1trZXldLCBsaXN0ZW5lcik7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgIGxpc3RlbmVyc1trZXldLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFsaWFzIG9mIHJlbW92ZUxpc3RlbmVyXG4gICAgICovXG4gICAgcHJvdG8ub2ZmID0gYWxpYXMoJ3JlbW92ZUxpc3RlbmVyJyk7XG5cbiAgICAvKipcbiAgICAgKiBBZGRzIGxpc3RlbmVycyBpbiBidWxrIHVzaW5nIHRoZSBtYW5pcHVsYXRlTGlzdGVuZXJzIG1ldGhvZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIGFkZCB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgYWRkZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gYWRkIHRoZSBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqIFllYWgsIHRoaXMgZnVuY3Rpb24gZG9lcyBxdWl0ZSBhIGJpdC4gVGhhdCdzIHByb2JhYmx5IGEgYmFkIHRoaW5nLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIGFkZCB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byBhZGQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkTGlzdGVuZXJzID0gZnVuY3Rpb24gYWRkTGlzdGVuZXJzKGV2dCwgbGlzdGVuZXJzKSB7XG4gICAgICAgIC8vIFBhc3MgdGhyb3VnaCB0byBtYW5pcHVsYXRlTGlzdGVuZXJzXG4gICAgICAgIHJldHVybiB0aGlzLm1hbmlwdWxhdGVMaXN0ZW5lcnMoZmFsc2UsIGV2dCwgbGlzdGVuZXJzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBsaXN0ZW5lcnMgaW4gYnVsayB1c2luZyB0aGUgbWFuaXB1bGF0ZUxpc3RlbmVycyBtZXRob2QuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiByZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSByZW1vdmVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGEgcmVndWxhciBleHByZXNzaW9uIHRvIHJlbW92ZSB0aGUgbGlzdGVuZXJzIGZyb20gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIHJlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIHJlbW92ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVMaXN0ZW5lcnMgPSBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcnMoZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgLy8gUGFzcyB0aHJvdWdoIHRvIG1hbmlwdWxhdGVMaXN0ZW5lcnNcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyh0cnVlLCBldnQsIGxpc3RlbmVycyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEVkaXRzIGxpc3RlbmVycyBpbiBidWxrLiBUaGUgYWRkTGlzdGVuZXJzIGFuZCByZW1vdmVMaXN0ZW5lcnMgbWV0aG9kcyBib3RoIHVzZSB0aGlzIHRvIGRvIHRoZWlyIGpvYi4gWW91IHNob3VsZCByZWFsbHkgdXNlIHRob3NlIGluc3RlYWQsIHRoaXMgaXMgYSBsaXR0bGUgbG93ZXIgbGV2ZWwuXG4gICAgICogVGhlIGZpcnN0IGFyZ3VtZW50IHdpbGwgZGV0ZXJtaW5lIGlmIHRoZSBsaXN0ZW5lcnMgYXJlIHJlbW92ZWQgKHRydWUpIG9yIGFkZGVkIChmYWxzZSkuXG4gICAgICogSWYgeW91IHBhc3MgYW4gb2JqZWN0IGFzIHRoZSBzZWNvbmQgYXJndW1lbnQgeW91IGNhbiBhZGQvcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuIFRoZSBvYmplY3Qgc2hvdWxkIGNvbnRhaW4ga2V5IHZhbHVlIHBhaXJzIG9mIGV2ZW50cyBhbmQgbGlzdGVuZXJzIG9yIGxpc3RlbmVyIGFycmF5cy5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhbiBldmVudCBuYW1lIGFuZCBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgdG8gYmUgYWRkZWQvcmVtb3ZlZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBtYW5pcHVsYXRlIHRoZSBsaXN0ZW5lcnMgb2YgYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtCb29sZWFufSByZW1vdmUgVHJ1ZSBpZiB5b3Ugd2FudCB0byByZW1vdmUgbGlzdGVuZXJzLCBmYWxzZSBpZiB5b3Ugd2FudCB0byBhZGQuXG4gICAgICogQHBhcmFtIHtTdHJpbmd8T2JqZWN0fFJlZ0V4cH0gZXZ0IEFuIGV2ZW50IG5hbWUgaWYgeW91IHdpbGwgcGFzcyBhbiBhcnJheSBvZiBsaXN0ZW5lcnMgbmV4dC4gQW4gb2JqZWN0IGlmIHlvdSB3aXNoIHRvIGFkZC9yZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9uW119IFtsaXN0ZW5lcnNdIEFuIG9wdGlvbmFsIGFycmF5IG9mIGxpc3RlbmVyIGZ1bmN0aW9ucyB0byBhZGQvcmVtb3ZlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLm1hbmlwdWxhdGVMaXN0ZW5lcnMgPSBmdW5jdGlvbiBtYW5pcHVsYXRlTGlzdGVuZXJzKHJlbW92ZSwgZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgdmFyIHNpbmdsZSA9IHJlbW92ZSA/IHRoaXMucmVtb3ZlTGlzdGVuZXIgOiB0aGlzLmFkZExpc3RlbmVyO1xuICAgICAgICB2YXIgbXVsdGlwbGUgPSByZW1vdmUgPyB0aGlzLnJlbW92ZUxpc3RlbmVycyA6IHRoaXMuYWRkTGlzdGVuZXJzO1xuXG4gICAgICAgIC8vIElmIGV2dCBpcyBhbiBvYmplY3QgdGhlbiBwYXNzIGVhY2ggb2YgaXRzIHByb3BlcnRpZXMgdG8gdGhpcyBtZXRob2RcbiAgICAgICAgaWYgKHR5cGVvZiBldnQgPT09ICdvYmplY3QnICYmICEoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSkge1xuICAgICAgICAgICAgZm9yIChpIGluIGV2dCkge1xuICAgICAgICAgICAgICAgIGlmIChldnQuaGFzT3duUHJvcGVydHkoaSkgJiYgKHZhbHVlID0gZXZ0W2ldKSkge1xuICAgICAgICAgICAgICAgICAgICAvLyBQYXNzIHRoZSBzaW5nbGUgbGlzdGVuZXIgc3RyYWlnaHQgdGhyb3VnaCB0byB0aGUgc2luZ3VsYXIgbWV0aG9kXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpbmdsZS5jYWxsKHRoaXMsIGksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE90aGVyd2lzZSBwYXNzIGJhY2sgdG8gdGhlIG11bHRpcGxlIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICBtdWx0aXBsZS5jYWxsKHRoaXMsIGksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFNvIGV2dCBtdXN0IGJlIGEgc3RyaW5nXG4gICAgICAgICAgICAvLyBBbmQgbGlzdGVuZXJzIG11c3QgYmUgYW4gYXJyYXkgb2YgbGlzdGVuZXJzXG4gICAgICAgICAgICAvLyBMb29wIG92ZXIgaXQgYW5kIHBhc3MgZWFjaCBvbmUgdG8gdGhlIG11bHRpcGxlIG1ldGhvZFxuICAgICAgICAgICAgaSA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgICAgICAgICB3aGlsZSAoaS0tKSB7XG4gICAgICAgICAgICAgICAgc2luZ2xlLmNhbGwodGhpcywgZXZ0LCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZXMgYWxsIGxpc3RlbmVycyBmcm9tIGEgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIElmIHlvdSBkbyBub3Qgc3BlY2lmeSBhbiBldmVudCB0aGVuIGFsbCBsaXN0ZW5lcnMgd2lsbCBiZSByZW1vdmVkLlxuICAgICAqIFRoYXQgbWVhbnMgZXZlcnkgZXZlbnQgd2lsbCBiZSBlbXB0aWVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGEgcmVnZXggdG8gcmVtb3ZlIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gW2V2dF0gT3B0aW9uYWwgbmFtZSBvZiB0aGUgZXZlbnQgdG8gcmVtb3ZlIGFsbCBsaXN0ZW5lcnMgZm9yLiBXaWxsIHJlbW92ZSBmcm9tIGV2ZXJ5IGV2ZW50IGlmIG5vdCBwYXNzZWQuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlRXZlbnQgPSBmdW5jdGlvbiByZW1vdmVFdmVudChldnQpIHtcbiAgICAgICAgdmFyIHR5cGUgPSB0eXBlb2YgZXZ0O1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZ2V0RXZlbnRzKCk7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgLy8gUmVtb3ZlIGRpZmZlcmVudCB0aGluZ3MgZGVwZW5kaW5nIG9uIHRoZSBzdGF0ZSBvZiBldnRcbiAgICAgICAgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IgdGhlIHNwZWNpZmllZCBldmVudFxuICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1tldnRdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGV2dCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBldmVudHMgbWF0Y2hpbmcgdGhlIHJlZ2V4LlxuICAgICAgICAgICAgZm9yIChrZXkgaW4gZXZlbnRzKSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpICYmIGV2dC50ZXN0KGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIGV2ZW50c1trZXldO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGluIGFsbCBldmVudHNcbiAgICAgICAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgcmVtb3ZlRXZlbnQuXG4gICAgICpcbiAgICAgKiBBZGRlZCB0byBtaXJyb3IgdGhlIG5vZGUgQVBJLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUFsbExpc3RlbmVycyA9IGFsaWFzKCdyZW1vdmVFdmVudCcpO1xuXG4gICAgLyoqXG4gICAgICogRW1pdHMgYW4gZXZlbnQgb2YgeW91ciBjaG9pY2UuXG4gICAgICogV2hlbiBlbWl0dGVkLCBldmVyeSBsaXN0ZW5lciBhdHRhY2hlZCB0byB0aGF0IGV2ZW50IHdpbGwgYmUgZXhlY3V0ZWQuXG4gICAgICogSWYgeW91IHBhc3MgdGhlIG9wdGlvbmFsIGFyZ3VtZW50IGFycmF5IHRoZW4gdGhvc2UgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIHRvIGV2ZXJ5IGxpc3RlbmVyIHVwb24gZXhlY3V0aW9uLlxuICAgICAqIEJlY2F1c2UgaXQgdXNlcyBgYXBwbHlgLCB5b3VyIGFycmF5IG9mIGFyZ3VtZW50cyB3aWxsIGJlIHBhc3NlZCBhcyBpZiB5b3Ugd3JvdGUgdGhlbSBvdXQgc2VwYXJhdGVseS5cbiAgICAgKiBTbyB0aGV5IHdpbGwgbm90IGFycml2ZSB3aXRoaW4gdGhlIGFycmF5IG9uIHRoZSBvdGhlciBzaWRlLCB0aGV5IHdpbGwgYmUgc2VwYXJhdGUuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gZW1pdCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBlbWl0IGFuZCBleGVjdXRlIGxpc3RlbmVycyBmb3IuXG4gICAgICogQHBhcmFtIHtBcnJheX0gW2FyZ3NdIE9wdGlvbmFsIGFycmF5IG9mIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gZWFjaCBsaXN0ZW5lci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5lbWl0RXZlbnQgPSBmdW5jdGlvbiBlbWl0RXZlbnQoZXZ0LCBhcmdzKSB7XG4gICAgICAgIHZhciBsaXN0ZW5lcnNNYXAgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBsaXN0ZW5lcnM7XG4gICAgICAgIHZhciBsaXN0ZW5lcjtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBrZXk7XG4gICAgICAgIHZhciByZXNwb25zZTtcblxuICAgICAgICBmb3IgKGtleSBpbiBsaXN0ZW5lcnNNYXApIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNNYXAuaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVycyA9IGxpc3RlbmVyc01hcFtrZXldLnNsaWNlKDApO1xuXG4gICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IGxpc3RlbmVycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGUgbGlzdGVuZXIgcmV0dXJucyB0cnVlIHRoZW4gaXQgc2hhbGwgYmUgcmVtb3ZlZCBmcm9tIHRoZSBldmVudFxuICAgICAgICAgICAgICAgICAgICAvLyBUaGUgZnVuY3Rpb24gaXMgZXhlY3V0ZWQgZWl0aGVyIHdpdGggYSBiYXNpYyBjYWxsIG9yIGFuIGFwcGx5IGlmIHRoZXJlIGlzIGFuIGFyZ3MgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXIgPSBsaXN0ZW5lcnNbaV07XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKGxpc3RlbmVyLm9uY2UgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lci5saXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZSA9IGxpc3RlbmVyLmxpc3RlbmVyLmFwcGx5KHRoaXMsIGFyZ3MgfHwgW10pO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZSA9PT0gdGhpcy5fZ2V0T25jZVJldHVyblZhbHVlKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIoZXZ0LCBsaXN0ZW5lci5saXN0ZW5lcik7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgZW1pdEV2ZW50XG4gICAgICovXG4gICAgcHJvdG8udHJpZ2dlciA9IGFsaWFzKCdlbWl0RXZlbnQnKTtcblxuICAgIC8qKlxuICAgICAqIFN1YnRseSBkaWZmZXJlbnQgZnJvbSBlbWl0RXZlbnQgaW4gdGhhdCBpdCB3aWxsIHBhc3MgaXRzIGFyZ3VtZW50cyBvbiB0byB0aGUgbGlzdGVuZXJzLCBhcyBvcHBvc2VkIHRvIHRha2luZyBhIHNpbmdsZSBhcnJheSBvZiBhcmd1bWVudHMgdG8gcGFzcyBvbi5cbiAgICAgKiBBcyB3aXRoIGVtaXRFdmVudCwgeW91IGNhbiBwYXNzIGEgcmVnZXggaW4gcGxhY2Ugb2YgdGhlIGV2ZW50IG5hbWUgdG8gZW1pdCB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byBlbWl0IGFuZCBleGVjdXRlIGxpc3RlbmVycyBmb3IuXG4gICAgICogQHBhcmFtIHsuLi4qfSBPcHRpb25hbCBhZGRpdGlvbmFsIGFyZ3VtZW50cyB0byBiZSBwYXNzZWQgdG8gZWFjaCBsaXN0ZW5lci5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5lbWl0ID0gZnVuY3Rpb24gZW1pdChldnQpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICByZXR1cm4gdGhpcy5lbWl0RXZlbnQoZXZ0LCBhcmdzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0cyB0aGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBhZ2FpbnN0IHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy4gSWYgYVxuICAgICAqIGxpc3RlbmVycyByZXR1cm4gdmFsdWUgbWF0Y2hlcyB0aGUgb25lIHNldCBoZXJlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkXG4gICAgICogYWZ0ZXIgZXhlY3V0aW9uLiBUaGlzIHZhbHVlIGRlZmF1bHRzIHRvIHRydWUuXG4gICAgICpcbiAgICAgKiBAcGFyYW0geyp9IHZhbHVlIFRoZSBuZXcgdmFsdWUgdG8gY2hlY2sgZm9yIHdoZW4gZXhlY3V0aW5nIGxpc3RlbmVycy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5zZXRPbmNlUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiBzZXRPbmNlUmV0dXJuVmFsdWUodmFsdWUpIHtcbiAgICAgICAgdGhpcy5fb25jZVJldHVyblZhbHVlID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGFnYWluc3Qgd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLiBJZlxuICAgICAqIHRoZSBsaXN0ZW5lcnMgcmV0dXJuIHZhbHVlIG1hdGNoZXMgdGhpcyBvbmUgdGhlbiBpdCBzaG91bGQgYmUgcmVtb3ZlZFxuICAgICAqIGF1dG9tYXRpY2FsbHkuIEl0IHdpbGwgcmV0dXJuIHRydWUgYnkgZGVmYXVsdC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4geyp8Qm9vbGVhbn0gVGhlIGN1cnJlbnQgdmFsdWUgdG8gY2hlY2sgZm9yIG9yIHRoZSBkZWZhdWx0LCB0cnVlLlxuICAgICAqIEBhcGkgcHJpdmF0ZVxuICAgICAqL1xuICAgIHByb3RvLl9nZXRPbmNlUmV0dXJuVmFsdWUgPSBmdW5jdGlvbiBfZ2V0T25jZVJldHVyblZhbHVlKCkge1xuICAgICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnX29uY2VSZXR1cm5WYWx1ZScpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fb25jZVJldHVyblZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRmV0Y2hlcyB0aGUgZXZlbnRzIG9iamVjdCBhbmQgY3JlYXRlcyBvbmUgaWYgcmVxdWlyZWQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IFRoZSBldmVudHMgc3RvcmFnZSBvYmplY3QuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgcHJvdG8uX2dldEV2ZW50cyA9IGZ1bmN0aW9uIF9nZXRFdmVudHMoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9ldmVudHMgfHwgKHRoaXMuX2V2ZW50cyA9IHt9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmV2ZXJ0cyB0aGUgZ2xvYmFsIHtAbGluayBFdmVudEVtaXR0ZXJ9IHRvIGl0cyBwcmV2aW91cyB2YWx1ZSBhbmQgcmV0dXJucyBhIHJlZmVyZW5jZSB0byB0aGlzIHZlcnNpb24uXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gTm9uIGNvbmZsaWN0aW5nIEV2ZW50RW1pdHRlciBjbGFzcy5cbiAgICAgKi9cbiAgICBFdmVudEVtaXR0ZXIubm9Db25mbGljdCA9IGZ1bmN0aW9uIG5vQ29uZmxpY3QoKSB7XG4gICAgICAgIGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gb3JpZ2luYWxHbG9iYWxWYWx1ZTtcbiAgICAgICAgcmV0dXJuIEV2ZW50RW1pdHRlcjtcbiAgICB9O1xuXG4gICAgLy8gRXhwb3NlIHRoZSBjbGFzcyBlaXRoZXIgdmlhIEFNRCwgQ29tbW9uSlMgb3IgdGhlIGdsb2JhbCBvYmplY3RcbiAgICBpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7XG4gICAgICAgIGRlZmluZShmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gRXZlbnRFbWl0dGVyO1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpe1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IEV2ZW50RW1pdHRlcjtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGV4cG9ydHMuRXZlbnRFbWl0dGVyID0gRXZlbnRFbWl0dGVyO1xuICAgIH1cbn0odGhpcyB8fCB7fSkpO1xuIiwibGV0IHNoYXJlID0gKG5ldHdvcmspID0+IHtcblxuICBsZXQgdGl0bGUgPSBcItCg0L7RgdGB0LjRjyDQvdCwINC/0L7RgNC+0LPQtSDRjdC/0LjQtNC10LzQuNC4INCS0JjQp1wiO1xuICBsZXQgZGVzY3JpcHRpb24gPSBcItCi0YDQtdCy0L7QttC90YvQtSDRhNCw0LrRgtGLINC+INC80LDRgdGI0YLQsNCx0LDRhSDQsdC10LTRgdGC0LLQuNGPIOKAlCDQsiDRgdC/0LXRhtC/0YDQvtC10LrRgtC1IMKr0JPQsNC30LXRgtGLLlJ1wrtcIjtcbiAgbGV0IGxpbmsgPSBcImh0dHA6Ly9keW4uaWcucmFtYmxlci5ydS9ISVYtc3ByZWFkL1wiO1xuICBsZXQgY2xvc2VMaW5rID0gXCJodHRwOi8vZHluLmlnLnJhbWJsZXIucnUvSElWLXNwcmVhZC9jbG9zZS5odG1sXCJcbiAgbGV0IHR3aXR0ZXJUZXh0ID0gdGl0bGUgKyBcIi5cIiArIFwiIFwiICsgZGVzY3JpcHRpb247XG4gIGxldCBpbWFnZSA9IFwiaHR0cDovL2R5bi5pZy5yYW1ibGVyLnJ1L0hJVi1zcHJlYWQvc2hhcmUtaW1nLnBuZ1wiXG5cbiAgaWYgKG5ldHdvcmsgPT0gXCJ2a1wiKSB7XG4gICAgbGV0IHVybCA9IFwiaHR0cDovL3ZrLmNvbS9zaGFyZS5waHA/dXJsPVwiICsgbGluayArIFwiJmRlc2NyaXB0aW9uPVwiICtcbiAgICAgIGRlc2NyaXB0aW9uICsgXCImaW1hZ2U9XCIgKyBpbWFnZSArIFwiJnRpdGxlPVwiICsgdGl0bGU7XG4gICAgd2luZG93Lm9wZW4odXJsLCBcIl9ibGFua1wiLCBcIndpZHRoPTQwMCxoZWlnaHQ9NTAwXCIpO1xuICB9IGVsc2UgaWYgKG5ldHdvcmsgPT0gXCJmYlwiKSB7XG4gICAgbGV0IGFwcElkID0gNjEwNDE1NzE1Nzg1Nzc1O1xuICAgIGxldCB1cmwgPSBcImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9kaWFsb2cvZmVlZD9hcHBfaWQ9XCIgKyBhcHBJZCArXG4gICAgICBcIiZkZXNjcmlwdGlvbj1cIiArIGRlc2NyaXB0aW9uICsgXCImZGlzcGxheT1wb3B1cCZsaW5rPVwiICsgbGluayArIFwiJm5hbWU9XCIgKyB0aXRsZSArIFwiJm5leHQ9XCIgK1xuICAgICAgY2xvc2VMaW5rICsgXCImcGljdHVyZT1cIiArIGltYWdlO1xuICAgIHdpbmRvdy5vcGVuKHVybCwgXCJfYmxhbmtcIiwgXCJ3aWR0aD00MDAsaGVpZ2h0PTUwMFwiKTtcbiAgfSBlbHNlIGlmIChuZXR3b3JrID09IFwidHdcIikge1xuICAgIGxldCB1cmwgPSBcImh0dHBzOi8vdHdpdHRlci5jb20vaW50ZW50L3R3ZWV0P29yaWdpbmFsX3JlZmVyZXI9XCIgKyBsaW5rICtcbiAgICAgIFwiJnRleHQ9XCIgKyB0d2l0dGVyVGV4dCArIFwiJnR3X3A9dHdlZXRidXR0b24mdXJsPVwiICsgbGluaztcbiAgICB3aW5kb3cub3Blbih1cmwsIFwiX2JsYW5rXCIsIFwid2lkdGg9NDAwLGhlaWdodD01MDBcIik7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgc2hhcmU7XG4iLCJsZXQgZ2V0Q29sb3IgPSBmdW5jdGlvbihwZXJjZW50KSB7XG4gIGlmIChwZXJjZW50ID4gMSkgcmV0dXJuIFwicmdiKDE4MCwzMiwzNylcIjtcblxuICBsZXQgciA9IE1hdGguZmxvb3IoMjMyIC0gKDIzMiAtIDE4MCkgKiBwZXJjZW50KTtcbiAgbGV0IGcgPSBNYXRoLmZsb29yKDIzMiAtICgyMzIgLSAzMikgKiBwZXJjZW50KTtcbiAgbGV0IGIgPSBNYXRoLmZsb29yKDIzMiAtICgyMzIgLSAzNykgKiBwZXJjZW50KTtcblxuICByZXR1cm4gYHJnYigke3J9LCR7Z30sJHtifSlgO1xuXG59O1xuXG5sZXQgZ2V0Q29sb3JNZXRhID0gZnVuY3Rpb24oc3RhcnRDb2xvciwgZW5kQ29sb3IsIHBlcmNlbnQpIHtcbiAgLy8gY29uc29sZS5sb2cocGVyY2VudCk7XG4gIGlmIChwZXJjZW50ID49IDEgfHwgaXNOYU4ocGVyY2VudCkpIHJldHVybiBzdGFydENvbG9yLmpvaW4oXCIsXCIpXG4gIGxldCBub05hbWUgPSBmdW5jdGlvbihzdGFydCwgZW5kLCBwZXJjZW50KSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKFxuICAgICAgTWF0aC5mbG9vcihzdGFydCAqICgxIC0gcGVyY2VudCkgKyBlbmQgKiBwZXJjZW50KVxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIHN0YXJ0Q29sb3IubWFwKGZ1bmN0aW9uKGVsZW0sIGkpIHtcbiAgICByZXR1cm4gbm9OYW1lKGVsZW0sIGVuZENvbG9yW2ldLCBwZXJjZW50KTtcbiAgfSkuam9pbihcIixcIik7XG59O1xuXG5cbmxldCBhZGRNb3VzZWV3aGVlbEV2ZW50ID0gZnVuY3Rpb24oZWxlbSwgZm4pIHtcbiAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICBpZiAoJ29ud2hlZWwnIGluIGRvY3VtZW50KSB7XG4gICAgICAvLyBJRTkrLCBGRjE3KywgQ2gzMStcbiAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcIndoZWVsXCIsIGZuKTtcbiAgICB9IGVsc2UgaWYgKCdvbm1vdXNld2hlZWwnIGluIGRvY3VtZW50KSB7XG4gICAgICAvLyDRg9GB0YLQsNGA0LXQstGI0LjQuSDQstCw0YDQuNCw0L3RgiDRgdC+0LHRi9GC0LjRj1xuICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwibW91c2V3aGVlbFwiLCBmbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZpcmVmb3ggPCAxN1xuICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiTW96TW91c2VQaXhlbFNjcm9sbFwiLCBmbik7XG4gICAgfVxuICB9IGVsc2UgeyAvLyBJRTgtXG4gICAgZWxlbS5hdHRhY2hFdmVudChcIm9ubW91c2V3aGVlbFwiLCBmbik7XG4gIH1cblxufVxuXG5sZXQgc2hvd0VsZW0gPSAoJGVsZW0pID0+IHtcblxuICAkZWxlbS5jc3Moe1xuICAgICAgZGlzcGxheTogXCJibG9ja1wiLFxuICAgIH0pLmNsZWFyUXVldWUoKVxuICAgIC5hbmltYXRlKHtcbiAgICAgIG9wYWNpdHk6IDFcbiAgICB9LCAxMDAwKTtcbn07XG5cbmxldCBoaWRlRWxlbSA9ICgkZWxlbSkgPT4ge1xuICAkZWxlbS5jc3Moe1xuICAgIGRpc3BsYXk6IFwibm9uZVwiLFxuICAgIG9wYWNpdHk6IDAsXG4gICAgdHJhbnNpdGlvbjogXCJvcGFjaXR5IDFzXCJcbiAgfSk7XG59O1xuXG5leHBvcnQge2dldENvbG9yLGFkZE1vdXNlZXdoZWVsRXZlbnQsIGdldENvbG9yTWV0YSxzaG93RWxlbSwgaGlkZUVsZW19XG4iXX0=
