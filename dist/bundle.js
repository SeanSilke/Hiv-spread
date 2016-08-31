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
    this.ee.emitEvent("show", [id]);
    (0, _utils.showElem)(footer);
    (0, _utils.scrollToElemTop)($($('.footer')[id]), true);
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

  window.disableScroll = false;

  /*
  ██      ██ ██████  ██████   █████  ██████  ██    ██     ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
  ██      ██ ██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
  ██      ██ ██████  ██████  ███████ ██████    ████       █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
  ██      ██ ██   ██ ██   ██ ██   ██ ██   ██    ██        ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
  ███████ ██ ██████  ██   ██ ██   ██ ██   ██    ██        ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
  */

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
        (0, _utils.scrollToElemTop)($($(".answerButton")[id]));
      };

      var initQuestion = function initQuestion() {
        (0, _utils.hideElem)(question);
      };

      var showQuestin = function showQuestin() {
        (0, _utils.showElem)(question);
        // scrollToElemCenter(question)
        (0, _utils.scrollToElemTop)($($('.footer')[id]));
      };

      var state = {
        selected: null,
        isAnswered: false,
        right: 12
      };

      var render = function render() {
        if (state.isAnswered) {
          removeButton();
          window.disableScroll = true;
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
        (0, _utils.scrollToElemTop)($($(".answerButton")[id]));
      };

      var initQuestion = function initQuestion() {
        (0, _utils.hideElem)(question);
      };

      var showQuestin = function showQuestin() {
        (0, _utils.showElem)(question);
        // scrollToElemCenter(question);
        (0, _utils.scrollToElemTop)($($('.footer')[id]));
      };

      var state = {
        selected: null,
        isAnswered: false,
        right: right
      };

      var render = function render() {
        if (state.isAnswered) {
          window.disableScroll = true;
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

      if (window.disableScroll) {
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

var scrollToElemTop = function scrollToElemTop($elem, isLast) {

  window.disableScroll = true;

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

var scrollToElemCenter = function scrollToElemCenter($elem, isLast) {

  var setHelperPosotin = function setHelperPosotin(winHeight, $elem) {
    var helperPosition = $elem.offset().top + $elem.height() / 2 + winHeight / 2;

    if (helperPosition > $('.prop').offset().top) {
      $('.prop').css({
        top: helperPosition
      });
    }
  };

  window.disableScroll = true;

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
      return window.disableScroll = false;
    }
  });
};

exports.getColor = getColor;
exports.addMouseewheelEvent = addMouseewheelEvent;
exports.getColorMeta = getColorMeta;
exports.showElem = showElem;
exports.hideElem = hideElem;
exports.scrollToElemTop = scrollToElemTop;

},{}]},{},[18])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEYXRhLmpzIiwiRHJvcERvd24uanMiLCJEcm9wRG93bk1vYmlsZS5qcyIsIkZvb3Rlci5qcyIsIkxlZ2VuZC5qcyIsIlBpZUNoYXJ0LmpzIiwiUGxheS5qcyIsIlBvcFVwLmpzIiwiUmVnSW5mby5qcyIsIlJlZ0luZm9Nb2JpbGUuanMiLCJTY3JvbGxlci5qcyIsIlNpZGVCYXJzLmpzIiwiU3ZnTWFwLmpzIiwiVG9nbGVCdG4uanMiLCJZZWFyU2VsZWN0LmpzIiwiWWVhcnMuanMiLCJrZXlSZWFzb25DaGFydC5qcyIsIm1haW4uanMiLCJuZXdJbmZlY3RlZENoYXJ0LmpzIiwibmV3SW5mZWN0ZWRDaGFydE1vYmlsZS5qcyIsIm5vZGVfbW9kdWxlcy93b2xmeTg3LWV2ZW50ZW1pdHRlci9FdmVudEVtaXR0ZXIuanMiLCJzaGFyZS5qcyIsInV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7OztBQ0VBLElBQUksa0JBQW1CLENBQ25CLEdBRG1CLEVBRW5CLEdBRm1CLEVBR25CLElBSG1CLEVBSW5CLElBSm1CLEVBS25CLElBTG1CLEVBTW5CLEtBTm1CLEVBT25CLEtBUG1CLEVBUW5CLEtBUm1CLEVBU25CLEtBVG1CLEVBVW5CLEtBVm1CLEVBV25CLEtBWG1CLEVBWW5CLEtBWm1CLEVBYW5CLEtBYm1CLEVBY25CLEtBZG1CLEVBZW5CLEtBZm1CLEVBZ0JuQixLQWhCbUIsRUFpQm5CLEtBakJtQixFQWtCbkIsS0FsQm1CLEVBbUJuQixLQW5CbUIsRUFvQm5CLEtBcEJtQixFQXFCbkIsS0FyQm1CLEVBc0JuQixLQXRCbUIsQ0FBdkI7O1FBeUJVLGUsR0FBQSxlOzs7Ozs7Ozs7QUMzQlY7Ozs7OztBQUdBLFNBQVMsUUFBVCxDQUFrQixPQUFsQixFQUEyQixZQUEzQixFQUF5Qzs7QUFFdkMsTUFBSSxPQUFPLElBQVg7QUFDQSxNQUFJLFNBQVMsS0FBYjs7QUFFQSxN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Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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RSxZQUFGLEVBQWdCLFVBQWhCLEdBQ0csT0FESCxDQUNXO0FBQ1AsZUFBVztBQURKLEdBRFgsRUFHSztBQUNELGNBQVUsSUFEVDtBQUVELFVBQU07QUFBQSxhQUFLLE9BQU8sYUFBUCxHQUF1QixLQUE1QjtBQUFBO0FBRkwsR0FITDtBQU9ELENBeENEOztRQTRDUSxRLEdBQUEsUTtRQUFTLG1CLEdBQUEsbUI7UUFBcUIsWSxHQUFBLFk7UUFBYSxRLEdBQUEsUTtRQUFVLFEsR0FBQSxRO1FBQVUsZSxHQUFBLGUiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiXG5cbmxldCBuZXdJbmZlY3RlZERhdGEgPSAgW1xuICAgIDEwMCxcbiAgICAyMDMsXG4gICAgMTUxMyxcbiAgICA0MzE1LFxuICAgIDM5NzEsXG4gICAgMTk3NTgsXG4gICAgNTk2MDksXG4gICAgODg3MzksXG4gICAgNTIxNzAsXG4gICAgMzkyMzIsXG4gICAgMzcwMDIsXG4gICAgMzk0MDcsXG4gICAgNDMwMDcsXG4gICAgNDQ3MTMsXG4gICAgNTQ1NjMsXG4gICAgNTg0MTAsXG4gICAgNTgyOTgsXG4gICAgNjIzODcsXG4gICAgNzA4MzIsXG4gICAgNzk3NjQsXG4gICAgODk2NjcsXG4gICAgOTMwMDAsXG4gIF07XG5cbiAgZXhwb3J0IHtuZXdJbmZlY3RlZERhdGF9XG4iLCJpbXBvcnQgU2Nyb2xsZXIgZnJvbSBcIi4vU2Nyb2xsZXJcIlxuXG5cbmZ1bmN0aW9uIERyb3BEb3duKG1hcE1haW4sIGRyb3BEb3duRWxlbSkge1xuXG4gIGxldCB0aGF0ID0gdGhpcztcbiAgbGV0IGlzT3BlbiA9IGZhbHNlO1xuXG4gIGxldCAkc2VsZWN0ID0gZHJvcERvd25FbGVtLmZpbmQoXCIuaGVhZFwiKTtcbiAgbGV0IHNjcm9sbGFibGUgPSBkcm9wRG93bkVsZW0uZmluZChcIi5zY3JvbGxhYmxlXCIpO1xuICBsZXQgY2xvc2VJbWcgPSBkcm9wRG93bkVsZW0uZmluZChcIiAuY2xvc2VfYnV0dG9uIGltZ1wiKTtcblxuICBsZXQgY29udGFpbmVyID0gc2Nyb2xsYWJsZS5maW5kKFwiLmNvbnRlbnRcIik7XG5cbiAgbGV0IGhlYWQgPSBkcm9wRG93bkVsZW0uZmluZChcIi50ZXh0XCIpO1xuXG4gICRzZWxlY3QuY2xpY2soXG4gICAgZnVuY3Rpb24oZSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIG1hcE1haW4uc3RhdGUuaXNQbGFpbmcgPSBmYWxzZTtcbiAgICAgIGlmIChpc09wZW4pIHtcbiAgICAgICAgdGhhdC5jbG9zZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhhdC5vcGVuKCk7XG4gICAgICB9XG4gICAgfVxuICApO1xuXG4gICQoXCIuc2Nyb2xsYWJsZVwiKS5jbGljayhcbiAgICBmdW5jdGlvbihlKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgbWFwTWFpbi5zdGF0ZS5pc1BsYWluZyA9IGZhbHNlO1xuICAgIH1cbiAgKTtcblxuXG4gIHRoaXMuY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBzY3JvbGxhYmxlLmNzcygndmlzaWJpbGl0eScsICdoaWRkZW4nKTtcbiAgICBpc09wZW4gPSBmYWxzZTtcbiAgICBjbG9zZUltZy5jc3Moe1xuICAgICAgdHJhbnNmb3JtIDogXCJyb3RhdGUoMGRlZylcIixcbiAgICB9KVxuICB9O1xuXG4gIHRoaXMub3BlbiA9IGZ1bmN0aW9uKCkge1xuICAgIHNjcm9sbGFibGUuY3NzKCd2aXNpYmlsaXR5JywgJ3Zpc2libGUnKTtcbiAgICBpc09wZW4gPSB0cnVlO1xuICAgIGNsb3NlSW1nLmNzcyh7XG4gICAgICB0cmFuc2Zvcm06IFwicm90YXRlKDE4MGRlZylcIixcbiAgICB9KVxuICB9O1xuXG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKG1hcE1haW4uc3RhdGUucmVnaW9uSWQpIHtcbiAgICAgIGhlYWQudGV4dChtYXBNYWluLmRhdGFbbWFwTWFpbi5zdGF0ZS5yZWdpb25JZF0uc2hvcnROYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGVhZC50ZXh0KFwi0KDQtdCz0LjQvtC9XCIpO1xuICAgIH1cblxuICAgIC8vIERpcnR5IEhhY2tcbiAgICBjb250YWluZXIuZW1wdHkoKTtcbiAgICBPYmplY3Qua2V5cyhtYXBNYWluLmRhdGEpLmZvckVhY2goXG4gICAgICBmdW5jdGlvbihyZWdpb24pIHtcblxuICAgICAgICBsZXQgc2hvcnROYW1lID0gbWFwTWFpbi5kYXRhW3JlZ2lvbl0uc2hvcnROYW1lO1xuXG4gICAgICAgIGxldCBlbGVtID0gJChgPGRpdiBjbGFzcz1cIml0ZW1cIiBkYXRhLXJlZ2lvbklkPVwiJHtyZWdpb259XCI+ICR7c2hvcnROYW1lfSA8L2Rpdj5gKTtcblxuICAgICAgICBpZiAocmVnaW9uID09PSBtYXBNYWluLnN0YXRlLnJlZ2lvbklkKSB7XG4gICAgICAgICAgZWxlbSA9ICQoYDxkaXYgY2xhc3M9XCJhY3RpdmVcIiBkYXRhLXJlZ2lvbklkPVwiJHtyZWdpb259XCI+ICR7c2hvcnROYW1lfSA8L2Rpdj5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnRhaW5lci5hcHBlbmQoZWxlbSk7XG5cbiAgICAgICAgZWxlbS5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICBtYXBNYWluLnN0YXRlLnJlZ2lvbklkID0gdGhpcy5kYXRhc2V0LnJlZ2lvbmlkO1xuICAgICAgICAgIG1hcE1haW4ucmVuZGVyKCk7XG4gICAgICAgICAgdGhhdC5jbG9zZSgpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICApO1xuICAgIHRoYXQuY2xvc2UoKTtcbiAgfTtcblxuICB0aGlzLnNjcm9sbGVyID0gbmV3IFNjcm9sbGVyKGRyb3BEb3duRWxlbS5maW5kKFwiLnNjcm9sbGFibGVcIikpO1xufVxuXG5cbmV4cG9ydCBkZWZhdWx0IERyb3BEb3duO1xuIiwiZnVuY3Rpb24gRHJvcERvd25Nb2JpbGUobWFwTWFpbiwgZHJvcERvd25FbGVtKSB7XG4gIGxldCB0aGF0ID0gdGhpcztcbiAgbGV0IGlzT3BlbiA9IGZhbHNlO1xuICBsZXQgJHNlbGVjdCA9IGRyb3BEb3duRWxlbS5maW5kKFwiIC5oZWFkXCIpO1xuICBsZXQgc2Nyb2xsYWJsZSA9IGRyb3BEb3duRWxlbS5maW5kKFwiLnNjcm9sbGFibGVcIik7XG4gIGxldCBjbG9zZUltZyA9IGRyb3BEb3duRWxlbS5maW5kKFwiIC5jbG9zZV9idXR0b24gaW1nXCIpO1xuXG4gIGxldCBjb250YWluZXIgPSBzY3JvbGxhYmxlLmZpbmQoXCIuY29udGVudFwiKTtcblxuICBsZXQgaGVhZCA9IGRyb3BEb3duRWxlbS5maW5kKFwiLnRleHRcIik7XG5cbiAgbGV0IGRyb3BEb3duRWxlbXMgPSBkcm9wRG93bkVsZW0uZmluZChcIi50b2dsZS1hYnMtcmVsXCIpO1xuXG4gICRzZWxlY3QuY2xpY2soXG4gICAgZnVuY3Rpb24oZSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIGlmIChpc09wZW4pIHtcbiAgICAgICAgdGhhdC5jbG9zZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhhdC5vcGVuKCk7XG4gICAgICB9XG4gICAgfVxuICApO1xuXG4gICQoXCIuc2Nyb2xsYWJsZVwiKS5jbGljayhcbiAgICBmdW5jdGlvbihlKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH1cbiAgKTtcblxuICB0aGlzLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsYWJsZS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgaXNPcGVuID0gZmFsc2U7XG4gICAgY2xvc2VJbWcuY3NzKHtcbiAgICAgIHRyYW5zZm9ybSA6IFwicm90YXRlKDBkZWcpXCIsXG4gICAgfSlcbiAgfTtcblxuICB0aGlzLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICBzY3JvbGxhYmxlLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgaXNPcGVuID0gdHJ1ZTtcbiAgICBjbG9zZUltZy5jc3Moe1xuICAgICAgdHJhbnNmb3JtOiBcInJvdGF0ZSgxODBkZWcpXCIsXG4gICAgfSlcbiAgfTtcblxuICBkcm9wRG93bkVsZW1zLmNsaWNrKGZ1bmN0aW9uKGUpe1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgbWFwTWFpbi5zdGF0ZS5kaXNwbGF5ID0gdGhpcy5kYXRhc2V0LmRpc3BsYXl0eXBlO1xuICAgIG1hcE1haW4ucmVuZGVyKCk7XG4gICAgdGhhdC5jbG9zZSgpO1xuICB9KVxuXG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgJC5lYWNoKCBkcm9wRG93bkVsZW1zLCAoaSxlKT0+IHtcbiAgICAgIGlmKGUuZGF0YXNldC5kaXNwbGF5dHlwZSA9PSBtYXBNYWluLnN0YXRlLmRpc3BsYXkpe1xuICAgICAgICBlLmNsYXNzTGlzdC5hZGQoXCJhY3RpdmVcIilcbiAgICAgICAgaGVhZC50ZXh0KGUuaW5uZXJIVE1MKVxuICAgICAgfWVsc2V7XG4gICAgICAgIGUuY2xhc3NMaXN0LnJlbW92ZShcImFjdGl2ZVwiKVxuICAgICAgfVxuICAgIH0gKVxuICAgIHRoYXQuY2xvc2UoKTtcbiAgfTtcbn1cblxuZXhwb3J0IGRlZmF1bHQgRHJvcERvd25Nb2JpbGU7XG4iLCJcbmltcG9ydCBFdmVudEVtaXR0ZXIgZnJvbSBcIndvbGZ5ODctZXZlbnRlbWl0dGVyXCI7XG5pbXBvcnQge3Nob3dFbGVtLCBoaWRlRWxlbSwgc2Nyb2xsVG9FbGVtVG9wfSBmcm9tIFwiLi91dGlsc1wiXG5cblxuZnVuY3Rpb24gRm9vdGVyKGlkKSB7XG5cbiAgbGV0IGZvb3RlciA9ICQoXCIucGxhdGUxMSwgLmxpbmUuYm90dG9tXCIpO1xuXG4gIHRoaXMuZWUgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgdGhpcy5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgaGlkZUVsZW0oZm9vdGVyKVxuICB9O1xuXG4gIGxldCB0aGF0ID0gdGhpcztcblxuICAkKCcuc2Nyb2xsQnRuJylbaWRdLm9uY2xpY2sgPSBmdW5jdGlvbigpIHtcbiAgICB0aGF0LnNob3coKTtcbiAgfTtcblxuICB0aGlzLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLmVlLmVtaXRFdmVudChcInNob3dcIixbaWRdKVxuICAgIHNob3dFbGVtKGZvb3RlcilcbiAgICBzY3JvbGxUb0VsZW1Ub3AoJCgkKCcuZm9vdGVyJylbaWRdKSx0cnVlKVxuICB9O1xuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgRm9vdGVyO1xuIiwiaW1wb3J0IHtnZXRDb2xvcn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5mdW5jdGlvbiBMZWdlbmQobWFwTWFpbikge1xuXG4gIGxldCBpbml0Q29sb3JzID0gZnVuY3Rpb24oKSB7XG4gICAgJChcIi5sZWdlbmQgLmJsb2MgLmNvbG9yXCIpLmVhY2goZnVuY3Rpb24oaWQsIGUpIHtcbiAgICAgIGxldCBjb2xvciA9IGdldENvbG9yKChpZCArIDEpIC8gMTApO1xuICAgICAgJChlKS5jc3Moe1xuICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogY29sb3JcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIGxldCByZW5kZXJWYWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgbXVsdGlwbGllciA9IG1hcE1haW4uc3RhdGUuZGlzcGxheSA9PSBcImFic1wiID8gMTAwIDogMTA7XG5cbiAgICAkKFwiLmxlZ2VuZCAuYmxvYyAudmFsXCIpLmVhY2goZnVuY3Rpb24oaWQsIGUpIHtcbiAgICAgICQoZSkudGV4dChtdWx0aXBsaWVyICogTWF0aC5wb3coMiwgaWQpKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBpbml0Q29sb3JzKCk7XG4gICAgcmVuZGVyVmFsdWVzKCk7XG4gIH07XG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZW5kZXJWYWx1ZXMoKTtcbiAgfTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBMZWdlbmQ7XG4iLCJmdW5jdGlvbiBQaWVDaGFydChtYWluRWxlbSwgcmFkKSB7XG4gIGxldCBwYXRoID0gbnVsbDtcbiAgbGV0IHN2Z0VsZW0gPSBtYWluRWxlbS5maW5kKFwiI3N2Zy1waWVcIilbMF07XG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbihkZWcpIHtcbiAgICBpZiAoIXN2Z0VsZW0pIHJldHVybjtcbiAgICBpZiAocGF0aCkge1xuICAgICAgc3ZnRWxlbS5yZW1vdmVDaGlsZChwYXRoKTtcbiAgICAgIHBhdGggPSBudWxsO1xuICAgIH1cbiAgICBpZiAoaXNOYU4oZGVnKSkgcmV0dXJuO1xuXG4gICAgaWYgKGRlZyA+IDM1OSkge1xuICAgICAgcGF0aCA9IHN2Z0VsZW0ucXVlcnlTZWxlY3RvcihcImNpcmNsZVwiKS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJ1cmwoI2ltZzEpXCIpO1xuICAgICAgc3ZnRWxlbS5hcHBlbmRDaGlsZChwYXRoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY3ggPSByYWQsXG4gICAgICBjeSA9IHJhZCxcbiAgICAgIHJ4ID0gcmFkLFxuICAgICAgcnkgPSByYWQ7XG5cbiAgICBsZXQgcCA9IHN2Z0VsZW0uY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICBwLnggPSAwO1xuICAgIHAueSA9IDE7XG5cblxuICAgIGxldCBtID0gc3ZnRWxlbS5jcmVhdGVTVkdNYXRyaXgoKTtcblxuXG4gICAgbGV0IHAyID0gcC5tYXRyaXhUcmFuc2Zvcm0obS5yb3RhdGUoZGVnKSk7XG5cbiAgICBwMi54ID0gY3ggLSBwMi54ICogcng7XG4gICAgcDIueSA9IGN5IC0gcDIueSAqIHJ5O1xuXG4gICAgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwicGF0aFwiKTtcblxuICAgIGxldCBkO1xuXG4gICAgaWYgKGRlZyA+IDE4MCkge1xuICAgICAgZCA9IFwiTVwiICsgY3ggKyBcIiBcIiArIChjeSAtIHJ5KSArIFwiQVwiICsgcnggKyBcIiBcIiArIHJ5ICsgXCIgMCAxIDFcIiArIHAyLnggKyBcIiBcIiArIHAyLnkgKyBcIkxcIiArIGN4ICsgXCIgXCIgKyBjeSArIFwielwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBkID0gXCJNXCIgKyBjeCArIFwiIFwiICsgKGN5IC0gcnkpICsgXCJBXCIgKyByeCArIFwiIFwiICsgcnkgKyBcIiAwIDAgMVwiICsgcDIueCArIFwiIFwiICsgcDIueSArIFwiTFwiICsgY3ggKyBcIiBcIiArIGN5ICsgXCJ6XCI7XG4gICAgfVxuXG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIGQpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInVybCgjaW1nMSlcIik7XG5cbiAgICBzdmdFbGVtLmFwcGVuZENoaWxkKHBhdGgpO1xuXG4gIH07XG5cbn1cblxuXG5cbmV4cG9ydCBkZWZhdWx0IFBpZUNoYXJ0XG4iLCJmdW5jdGlvbiBQbGF5KG1hcE1haW4pIHtcblxuICBsZXQgdGhhdCA9IHRoaXM7XG5cbiAgdGhpcy5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFtYXBNYWluLnN0YXRlLmlzUGxhaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG1hcE1haW4ucmVuZGVyKSB7XG5cbiAgICAgIGlmIChtYXBNYWluLnN0YXRlLnllYXIgPT0gMjAxNCkge1xuICAgICAgICBtYXBNYWluLnN0YXRlLnllYXIgPSAxOTk0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXBNYWluLnN0YXRlLnllYXIrKztcbiAgICAgIH1cblxuICAgICAgbWFwTWFpbi5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdGhhdC5wbGF5KCk7XG4gICAgfSwgMTAwMCk7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5O1xuIiwiaW1wb3J0IFBpZUNoYXJ0IGZyb20gXCIuL1BpZUNoYXJ0XCJcblxuZnVuY3Rpb24gUG9wVXAobWFwTWFpbiwgbWFpbkVsZW0sIHJhZCwgaXNNb2JpbGUpIHtcblxuXG4gIGxldCBwaWVDaGFydCA9IG5ldyBQaWVDaGFydChtYWluRWxlbSwgcmFkKTtcblxuICBsZXQgcG9wVXAgPSBtYWluRWxlbTtcbiAgbGV0IGNsb3NlQnV0dG9uID0gcG9wVXAuZmluZChcIi5oZWFkIC5idG4uY2xvc2VcIik7XG4gIGxldCBwaWVDb250YWluZXIgPSBwb3BVcC5maW5kKFwiLmJvZHkgLnBpZVwiKTtcblxuICBsZXQgZGF0YUZpZWxkcyA9IHBvcFVwLmZpbmQoXCIuYm9keSAuZGF0YSAuaXRlbVwiKTtcbiAgbGV0IHN0YXRlTmFtZUZlYWxkID0gcG9wVXAuZmluZChcIi5oZWFkIC5yZWdpb24gc3BhblwiKTtcbiAgbGV0IGluZmVjdGVkRmVhbGQgPSBkYXRhRmllbGRzLmZpbmQoXCIuaW5mZWN0ZWRcIik7XG4gIGxldCBkaWVkRmVhbGQgPSBkYXRhRmllbGRzLmZpbmQoXCIuZGVhZFwiKTtcbiAgLy8gY29uc29sZS5sb2coaW5mZWN0ZWRGZWFsZCk7XG4gIGxldCBpbmZlY3RlZFRleHRGZWFsZCA9ICQoZGF0YUZpZWxkcy5maW5kKFwiLmxhYmVsXCIpWzBdKTtcbiAgLy8gY29uc29sZS5sb2coZGF0YUZpZWxkcy5maW5kKFwiLmxhYmVsXCIpWzBdLGluZmVjdGVkVGV4dEZlYWxkKTtcblxuICBsZXQgY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBoaWRlKCk7XG4gICAgbWFwTWFpbi5zdGF0ZS5yZWdpb25JZCA9IFwiXCI7XG4gICAgbWFwTWFpbi5yZW5kZXIoKTtcbiAgfTtcblxuICBjbG9zZUJ1dHRvbi5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgY2xvc2UoKTtcbiAgfSk7XG5cbiAgbGV0IGhpZGUgPSBmdW5jdGlvbigpIHtcbiAgICBwb3BVcC5jc3MoJ29wYWNpdHknLCAwKTtcbiAgICBwb3BVcC5jc3MoJ3Zpc2liaWxpdHknLCBcImhpZGRlblwiKTtcblxuICB9O1xuXG4gIGxldCBvcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgcG9wVXAuY3NzKCdvcGFjaXR5JywgMSk7XG4gICAgcG9wVXAuY3NzKCd2aXNpYmlsaXR5JywgXCJ2aXNpYmxlXCIpO1xuICB9O1xuXG5cbiAgcG9wVXAuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH0pO1xuXG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIW1hcE1haW4uc3RhdGUucmVnaW9uSWQpIHtcbiAgICAgIGhpZGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgbmFtZSwgaW5mZWN0ZWQsIGRpZWQsIGluZmVjdGVkVGV4dDtcbiAgICBpZiAoaXNNb2JpbGUpIHtcbiAgICAgIG5hbWUgPSBtYXBNYWluLmRhdGFbbWFwTWFpbi5zdGF0ZS5yZWdpb25JZF0uc2hvcnROYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbWFwTWFpbi5kYXRhW21hcE1haW4uc3RhdGUucmVnaW9uSWRdLm5hbWU7XG4gICAgfVxuXG4gICAgaWYgKG1hcE1haW4uc3RhdGUuZGlzcGxheSA9PSBcInJlbFwiKSB7XG4gICAgICBwaWVDb250YWluZXIuaGlkZSgpO1xuICAgICAgJChkYXRhRmllbGRzWzFdKS5oaWRlKCk7XG4gICAgICAkKGRhdGFGaWVsZHNbMF0pLmZpbmQoXCIuaW5mZWN0ZWRcIikuY3NzKHtcbiAgICAgICAgd2lkdGg6IFwiYXV0b1wiXG4gICAgICB9KTtcbiAgICAgIGRpZWQgPSBudWxsO1xuICAgICAgaW5mZWN0ZWQgPSBtYXBNYWluLmRhdGFbbWFwTWFpbi5zdGF0ZS5yZWdpb25JZF0ucmVsSW5mZWN0ZWRbbWFwTWFpbi5zdGF0ZS55ZWFyXSB8fCBcItC9L9C0XCI7XG4gICAgICBpbmZlY3RlZFRleHQgPSBcItCn0LjRgdC70L4g0LjQvdGE0LjRhtC40YDQvtCy0LDQvdC90YvRhSDQvdCwJm5ic3A7MTAwINGC0YvRgdGP0Ycg0L3QsNGB0LXQu9C10L3QuNGPXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZmVjdGVkID0gbWFwTWFpbi5kYXRhW21hcE1haW4uc3RhdGUucmVnaW9uSWRdLmFic0luZmVjdGVkW21hcE1haW4uc3RhdGUueWVhcl0gfHwgXCLQvS/QtFwiO1xuICAgICAgZGllZCA9IG1hcE1haW4uZGF0YVttYXBNYWluLnN0YXRlLnJlZ2lvbklkXS5hYnNEaWVkW21hcE1haW4uc3RhdGUueWVhcl0gfHwgXCLQvS/QtFwiO1xuICAgICAgcGllQ29udGFpbmVyLnNob3coKTtcbiAgICAgICQoZGF0YUZpZWxkc1sxXSkuc2hvdygpO1xuICAgICAgJChkYXRhRmllbGRzWzBdKS5maW5kKFwiLmluZmVjdGVkXCIpLmNzcyh7XG4gICAgICAgIHdpZHRoOiBcIjIzJVwiXG4gICAgICB9KTtcbiAgICAgIHBpZUNoYXJ0LnJlbmRlcigzNjAgKiAoZGllZCAvIGluZmVjdGVkKSk7XG4gICAgICBpbmZlY3RlZFRleHQgPSBcItCe0LHRidC10LUg0YfQuNGB0LvQviDQuNC90YTQuNGG0LjRgNC+0LLQsNC90L3Ri9GFXCI7XG4gICAgfVxuXG4gICAgc3RhdGVOYW1lRmVhbGQudGV4dChuYW1lKTtcbiAgICBpbmZlY3RlZEZlYWxkLnRleHQoaW5mZWN0ZWQpO1xuICAgIGluZmVjdGVkVGV4dEZlYWxkLmh0bWwoaW5mZWN0ZWRUZXh0KTtcbiAgICBkaWVkRmVhbGQudGV4dChkaWVkKTtcblxuICAgIC8vIGlmIChtYXBNYWluLnN0YXRlLnJlZ2lvbklkICYmICFpc01vYmlsZSkge1xuICAgIC8vICAgIHNldFBvc2l0aW9uKGZpbmRQb3NpdGlvbigpKTtcbiAgICAvLyB9XG4gICAgb3BlbigpO1xuICB9O1xuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUG9wVXBcbiIsIi8vXG4vL1xuLy8gaW1wb3J0IHthZGRNb3VzZWV3aGVlbEV2ZW50fSBmcm9tIFwiLi91dGlsc1wiO1xuLy8gaW1wb3J0IERyb3BEb3duTW9iaWxlIGZyb20gXCIuL0Ryb3BEb3duTW9iaWxlXCI7XG4vL1xuLy8gaW1wb3J0IHtnZXRDb2xvcn0gZnJvbSBcIi4vdXRpbHNcIjtcblxuXG5cblxuXG5pbXBvcnQgU3ZnTWFwIGZyb20gXCIuL1N2Z01hcFwiO1xuaW1wb3J0IExlZ2VuZCBmcm9tIFwiLi9MZWdlbmRcIjtcbmltcG9ydCBZZWFycyBmcm9tICBcIi4vWWVhcnNcIjtcbmltcG9ydCBEcm9wRG93biBmcm9tIFwiLi9Ecm9wRG93blwiO1xuaW1wb3J0IFBvcFVwIGZyb20gXCIuL1BvcFVwXCI7XG5pbXBvcnQgVG9nbGVCdG4gZnJvbSAnLi9Ub2dsZUJ0bic7XG5pbXBvcnQgUGxheSBmcm9tIFwiLi9QbGF5XCI7XG5cblxuXG5cbmZ1bmN0aW9uIFJlZ0luZm8oZGF0YSkge1xuXG4gIHRoaXMuZGF0YSA9IGRhdGE7XG4gIGxldCBzZWxmID0gdGhpcztcblxuICAvLyAtLS0tLS0tLS0tLS0tTWFwIFN0YXRlLS0tLS0tLS0tLS0tXG4gIHRoaXMuc3RhdGUgPSB7XG4gICAgeWVhcjogMjAxMixcbiAgICByZWdpb25JZDogXCJcIixcbiAgICBkaXNwbGF5OiBcImFic1wiLFxuICAgIGlzUGxhaW5nOiB0cnVlLFxuICB9O1xuXG4gIHRoaXMucG9wVXBFbGVtID0gJChcIi5oaWRlLW1vYmlsZSAuYmFubmVyXCIpO1xuXG4gIGxldCBzdmdNYXAgPSBuZXcgU3ZnTWFwKHRoaXMpO1xuICBsZXQgbGVnZW5kID0gbmV3IExlZ2VuZCh0aGlzKTtcbiAgbGV0IHllYXJzID0gbmV3IFllYXJzKHRoaXMpO1xuICBsZXQgZHJvcERvd24gPSBuZXcgRHJvcERvd24odGhpcywgJChcIi5tYXAuaGlkZS1tb2JpbGUgLml0ZW0uZHJvcF9kb3duXCIpKTtcbiAgbGV0IHBvcFVwID0gbmV3IFBvcFVwKHRoaXMsIHRoaXMucG9wVXBFbGVtLCA0MCwgZmFsc2UpO1xuICBsZXQgdG9nbGVCdG4gPSBuZXcgVG9nbGVCdG4odGhpcyk7XG4gIGxldCBwbGF5ID0gbmV3IFBsYXkodGhpcyk7XG5cblxuICBsZXQgZmluZFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFzdmdNYXAuc2VsZWN0ZWRSZWcpIHJldHVybjtcblxuICAgIGxldCBtYXBSZWN0ID0gc3ZnTWFwLm1hcEVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IHJlZ1JlY3QgPSBzdmdNYXAuc2VsZWN0ZWRSZWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IHBvcFVwUmVjdCA9IHNlbGYucG9wVXBFbGVtWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgbGV0IHRvcCwgbGVmdDtcblxuICAgIGxlZnQgPSByZWdSZWN0LmxlZnQgKyByZWdSZWN0LndpZHRoO1xuICAgIHRvcCA9IHJlZ1JlY3QudG9wIC0gcG9wVXBSZWN0LmhlaWdodDtcbiAgICBpZiAodG9wIDwgbWFwUmVjdC50b3ApIHtcbiAgICAgIHRvcCA9IG1hcFJlY3QudG9wICsgMjA7XG4gICAgfVxuICAgIGlmIChsZWZ0ICsgcG9wVXBSZWN0LndpZHRoID4gbWFwUmVjdC5sZWZ0ICsgbWFwUmVjdC53aWR0aCkge1xuICAgICAgbGVmdCA9IHJlZ1JlY3QubGVmdCAtIHBvcFVwUmVjdC53aWR0aDtcbiAgICB9XG5cbiAgICBsZWZ0ID0gbGVmdCArIHBhZ2VYT2Zmc2V0O1xuICAgIHRvcCA9IHRvcCArIHBhZ2VZT2Zmc2V0O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogdG9wLFxuICAgICAgbGVmdDogbGVmdCxcbiAgICB9O1xuICB9O1xuXG4gIGxldCBzZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm47XG4gICAgbGV0IGZvcm1hdCA9IFtcInJpZ2h0XCIsIFwidG9wXCIsIFwibGVmdFwiLCBcImJvdHRvbVwiXTtcbiAgICBmb3JtYXQuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBzZWxmLnBvcFVwRWxlbVswXS5zdHlsZVtwcm9wXSA9IG9ialtwcm9wXSA/IG9ialtwcm9wXSArIFwicHhcIiA6IFwiXCI7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICBzdmdNYXAucmVuZGVyKCk7XG4gICAgeWVhcnMucmVuZGVyKCk7XG4gICAgZHJvcERvd24ucmVuZGVyKCk7XG4gICAgbGVnZW5kLnJlbmRlcigpO1xuICAgIHBvcFVwLnJlbmRlcigpO1xuICAgIHRvZ2xlQnRuLnJlbmRlcigpO1xuICAgIGlmICh0aGlzLnN0YXRlLnJlZ2lvbklkKSB7XG5cbiAgICAgIHNldFBvc2l0aW9uKGZpbmRQb3NpdGlvbigpKTtcbiAgICB9XG5cbiAgfTtcblxuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGxlZ2VuZC5pbml0KCk7XG4gICAgZHJvcERvd24uc2Nyb2xsZXIuY3JlYXRlKCk7XG4gICAgcGxheS5wbGF5KCk7XG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLFxuICAgICAgZnVuY3Rpb24oZSkge1xuICAgICAgICBzZWxmLnN0YXRlLnJlZ2lvbklkID0gXCJcIjtcbiAgICAgICAgc2VsZi5zdGF0ZS5pc1BsYWluZyA9IGZhbHNlO1xuICAgICAgICBzZWxmLnJlbmRlcigpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHNldFBvc2l0aW9uKGZpbmRQb3NpdGlvbigpKTtcbiAgICB9O1xuICB9O1xuXG59O1xuXG5cbmV4cG9ydCBkZWZhdWx0IFJlZ0luZm87XG4iLCJcblxuXG5pbXBvcnQgRHJvcERvd24gZnJvbSBcIi4vRHJvcERvd25cIjtcbmltcG9ydCBQb3BVcCBmcm9tIFwiLi9Qb3BVcFwiO1xuaW1wb3J0IFRvZ2xlQnRuIGZyb20gJy4vVG9nbGVCdG4nO1xuaW1wb3J0IERyb3BEb3duTW9iaWxlIGZyb20gXCIuL0Ryb3BEb3duTW9iaWxlXCI7XG5pbXBvcnQgWWVhclNlbGVjdCBmcm9tIFwiLi9ZZWFyU2VsZWN0XCJcblxuXG5cbmZ1bmN0aW9uIFJlZ0luZm9Nb2JpbGUoZGF0YSkge1xuXG4gIHRoaXMuZGF0YSA9IGRhdGE7XG4gIGxldCBtYXBNYWluID0gdGhpcztcblxuICAvLyAtLS0tLS0tLS0tLS0tTWFwIFN0YXRlLS0tLS0tLS0tLS0tXG4gIHRoaXMuc3RhdGUgPSB7XG4gICAgeWVhcjogMTk5OSxcbiAgICByZWdpb25JZDogXCLQnNC+0YHQutCy0LBcIixcbiAgICBkaXNwbGF5OiBcImFic1wiXG4gIH07XG5cbiAgbGV0IGRyb3BEb3duID0gbmV3IERyb3BEb3duKHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgJChcIi5tYXAuaGlkZS1kZXNrdG9wIC5pdGVtLmRyb3BfZG93bjpsYXN0LW9mLXR5cGVcIilcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgbGV0IGRyb3BEb3duTW9iaWxlID0gbmV3IERyb3BEb3duTW9iaWxlKHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICQoXCIubWFwLmhpZGUtZGVza3RvcCAuaXRlbS5kcm9wX2Rvd25cIikuZmlyc3QoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICBsZXQgcG9wVXAgPSBuZXcgUG9wVXAodGhpcywgJChcIi5oaWRlLWRlc2t0b3AgLmJhbm5lclwiKSwgNTAsIHRydWUpO1xuICBsZXQgeWVhclNlbGVjdCA9IG5ldyBZZWFyU2VsZWN0KHRoaXMsICQoJy55ZWFyLXNlbGVjdCcpKTtcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIGRyb3BEb3duLnJlbmRlcigpO1xuICAgIHBvcFVwLnJlbmRlcigpO1xuICAgIHllYXJTZWxlY3QucmVuZGVyKCk7XG4gICAgZHJvcERvd25Nb2JpbGUucmVuZGVyKCk7XG4gIH07XG5cblxuICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBkcm9wRG93bi5zY3JvbGxlci5jcmVhdGUoKTtcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXG4gICAgICBmdW5jdGlvbihlKSB7XG4gICAgICAgIG1hcE1haW4ucmVuZGVyKCk7XG4gICAgICB9XG4gICAgKTtcbiAgfTtcblxufTtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlZ0luZm9Nb2JpbGU7XG4iLCJpbXBvcnQge2FkZE1vdXNlZXdoZWVsRXZlbnR9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuZnVuY3Rpb24gU2Nyb2xsZXIobWFpbkVsZW0pIHtcbiAgbGV0IHNjcm9sbENvbnRhaW5lciA9IG1haW5FbGVtWzBdLFxuICAgIHNjcm9sbENvbnRlbnRXcmFwcGVyID0gbWFpbkVsZW0uZmluZCgnLmNvbnRlbnQtd3JhcHBlcicpWzBdLFxuICAgIHNjcm9sbENvbnRlbnQgPSBtYWluRWxlbS5maW5kKCcuY29udGVudCcpWzBdLFxuICAgIGNvbnRlbnRQb3NpdGlvbiA9IDAsXG4gICAgc2Nyb2xsZXJCZWluZ0RyYWdnZWQgPSBmYWxzZSxcbiAgICBzY3JvbGxlcixcbiAgICB0b3BQb3NpdGlvbixcbiAgICBzY3JvbGxlckhlaWdodCxcbiAgICBub3JtYWxpemVkUG9zaXRpb247XG5cbiAgZnVuY3Rpb24gY2FsY3VsYXRlU2Nyb2xsZXJIZWlnaHQoKSB7XG4gICAgLy8gKkNhbGN1bGF0aW9uIG9mIGhvdyB0YWxsIHNjcm9sbGVyIHNob3VsZCBiZVxuICAgIGxldCB2aXNpYmxlUmF0aW8gPSBzY3JvbGxDb250YWluZXIub2Zmc2V0SGVpZ2h0IC8gc2Nyb2xsQ29udGVudFdyYXBwZXIuc2Nyb2xsSGVpZ2h0O1xuICAgIHZpc2libGVSYXRpbyA9IDAuMDU7XG4gICAgcmV0dXJuIHZpc2libGVSYXRpbyAqIHNjcm9sbENvbnRhaW5lci5vZmZzZXRIZWlnaHQ7XG4gIH1cblxuICBmdW5jdGlvbiBtb3ZlU2Nyb2xsZXIoZXZ0KSB7XG4gICAgLy8gTW92ZSBTY3JvbGwgYmFyIHRvIHRvcCBvZmZzZXRcbiAgICBsZXQgc2Nyb2xsUGVyY2VudGFnZSA9IGV2dC50YXJnZXQuc2Nyb2xsVG9wIC8gc2Nyb2xsQ29udGVudFdyYXBwZXIuc2Nyb2xsSGVpZ2h0O1xuICAgIHRvcFBvc2l0aW9uID0gc2Nyb2xsUGVyY2VudGFnZSAqIChzY3JvbGxDb250YWluZXIub2Zmc2V0SGVpZ2h0ICogMC45MTUpICsgc2Nyb2xsQ29udGFpbmVyLm9mZnNldEhlaWdodCAqIDAuMDU7IC8vIDVweCBhcmJpdHJhcnkgb2Zmc2V0IHNvIHNjcm9sbCBiYXIgZG9lc24ndCBtb3ZlIHRvbyBmYXIgYmV5b25kIGNvbnRlbnQgd3JhcHBlciBib3VuZGluZyBib3hcbiAgICBzY3JvbGxlci5zdHlsZS50b3AgPSB0b3BQb3NpdGlvbiArICdweCc7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydERyYWcoZXZ0KSB7XG4gICAgbm9ybWFsaXplZFBvc2l0aW9uID0gZXZ0LnBhZ2VZO1xuICAgIGNvbnRlbnRQb3NpdGlvbiA9IHNjcm9sbENvbnRlbnRXcmFwcGVyLnNjcm9sbFRvcDtcbiAgICBzY3JvbGxlckJlaW5nRHJhZ2dlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wRHJhZyhldnQpIHtcbiAgICBzY3JvbGxlckJlaW5nRHJhZ2dlZCA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gc2Nyb2xsQmFyU2Nyb2xsKGV2dCkge1xuICAgIGlmIChzY3JvbGxlckJlaW5nRHJhZ2dlZCA9PT0gdHJ1ZSkge1xuICAgICAgbGV0IG1vdXNlRGlmZmVyZW50aWFsID0gZXZ0LnBhZ2VZIC0gbm9ybWFsaXplZFBvc2l0aW9uO1xuICAgICAgbGV0IHNjcm9sbEVxdWl2YWxlbnQgPSBtb3VzZURpZmZlcmVudGlhbCAqXG4gICAgICAgIChzY3JvbGxDb250ZW50V3JhcHBlci5zY3JvbGxIZWlnaHQgLyBzY3JvbGxDb250YWluZXIub2Zmc2V0SGVpZ2h0KTtcbiAgICAgIHNjcm9sbENvbnRlbnRXcmFwcGVyLnNjcm9sbFRvcCA9IGNvbnRlbnRQb3NpdGlvbiArIHNjcm9sbEVxdWl2YWxlbnQ7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAvLyAqQ3JlYXRlcyBzY3JvbGxlciBlbGVtZW50IGFuZCBhcHBlbmRzIHRvICcuc2Nyb2xsYWJsZScgZGl2XG4gICAgLy8gY3JlYXRlIHNjcm9sbGVyIGVsZW1lbnRcbiAgICBzY3JvbGxlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgc2Nyb2xsZXIuY2xhc3NOYW1lID0gJ3Njcm9sbGVyJztcblxuICAgIC8vIGRldGVybWluZSBob3cgYmlnIHNjcm9sbGVyIHNob3VsZCBiZSBiYXNlZCBvbiBjb250ZW50XG4gICAgc2Nyb2xsZXJIZWlnaHQgPSBjYWxjdWxhdGVTY3JvbGxlckhlaWdodCgpO1xuXG4gICAgaWYgKHNjcm9sbGVySGVpZ2h0IC8gc2Nyb2xsQ29udGFpbmVyLm9mZnNldEhlaWdodCA8IDEpIHtcbiAgICAgIC8vICpJZiB0aGVyZSBpcyBhIG5lZWQgdG8gaGF2ZSBzY3JvbGwgYmFyIGJhc2VkIG9uIGNvbnRlbnQgc2l6ZVxuICAgICAgc2Nyb2xsZXIuc3R5bGUuaGVpZ2h0ID0gc2Nyb2xsZXJIZWlnaHQgKyAncHgnO1xuXG4gICAgICAvLyBhcHBlbmQgc2Nyb2xsZXIgdG8gc2Nyb2xsQ29udGFpbmVyIGRpdlxuICAgICAgc2Nyb2xsQ29udGFpbmVyLmFwcGVuZENoaWxkKHNjcm9sbGVyKTtcblxuICAgICAgLy8gc2hvdyBzY3JvbGwgcGF0aCBkaXZvdFxuICAgICAgc2Nyb2xsQ29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHNob3dTY3JvbGwnO1xuXG4gICAgICAvLyBhdHRhY2ggcmVsYXRlZCBkcmFnZ2FibGUgbGlzdGVuZXJzXG4gICAgICBzY3JvbGxlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzdGFydERyYWcpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzdG9wRHJhZyk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgc2Nyb2xsQmFyU2Nyb2xsKTtcbiAgICB9XG5cbiAgfVxuXG4gIGxldCBvbldoZWVsID0gKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICBhZGRNb3VzZWV3aGVlbEV2ZW50KHNjcm9sbENvbnRlbnRXcmFwcGVyLG9uV2hlZWwpO1xuXG4gIC8vICoqKiBMaXN0ZW5lcnMgKioqXG4gIHNjcm9sbENvbnRlbnRXcmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIG1vdmVTY3JvbGxlcik7XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2Nyb2xsZXI7XG4iLCJcbmltcG9ydCB7c2hvd0VsZW19IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQgRXZlbnRFbWl0dGVyIGZyb20gXCJ3b2xmeTg3LWV2ZW50ZW1pdHRlclwiO1xuXG5mdW5jdGlvbiBTaWRlQmFycyhxdWl6RWxlbXMpIHtcbiAgbGV0IHN0YXRlID0ge1xuICAgIGlzVmlzaWJsZTogbnVsbCxcbiAgfVxuXG4gIGxldCAkbWFpbkVsZW0gPSAkKFwiLnNpZGUtcGFuZWxcIik7XG4gIGxldCAkc2lkZUJhcnMgPSAkKFwiLnNpZGUtYm94XCIpO1xuXG4gIGxldCBzZWxlY3QgPSAoaSkgPT4ge1xuICAgICRzaWRlQmFycy5yZW1vdmVDbGFzcyhcImJveC1zZWxlY3RlZFwiKVxuICAgICRzaWRlQmFyc1tpXSAmJiAkc2lkZUJhcnNbaV0uY2xhc3NMaXN0LmFkZChcImJveC1zZWxlY3RlZFwiKTtcbiAgfVxuXG4gICRzaWRlQmFycy5jbGljayhmdW5jdGlvbigpIHtcbiAgICBxdWl6RWxlbXNbcGFyc2VJbnQodGhpcy5kYXRhc2V0LmlkKV0uc2hvdygpO1xuICAgIHNlbGVjdChwYXJzZUludCh0aGlzLmRhdGFzZXQuaWQpKVxuICB9KVxuXG4gIGxldCByZW5kZXIgPSAoKSA9PiB7XG5cbiAgICBxdWl6RWxlbXMuZm9yRWFjaCgoZSwgaSkgPT4ge1xuICAgICAgaWYgKGUucmVzdWx0ICYmIGUucmVzdWx0KSB7XG4gICAgICAgICRzaWRlQmFyc1tpXS5jbGFzc0xpc3QuYWRkKFwiYm94LXRydWVcIilcbiAgICAgIH0gZWxzZSBpZiAoZS5yZXN1bHQgPT09IGZhbHNlKSB7XG4gICAgICAgICRzaWRlQmFyc1tpXS5jbGFzc0xpc3QuYWRkKFwiYm94LWZhbHNlXCIpXG4gICAgICB9XG4gICAgfSlcbiAgfVxuXG5cbiAgdGhpcy5zZWxlY3QgPSBzZWxlY3Q7XG4gIHRoaXMucmVuZGVyID0gcmVuZGVyO1xuICB0aGlzLnNob3cgPSBmdW5jdGlvbigpe1xuICAgIHNob3dFbGVtKCRtYWluRWxlbSlcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBTaWRlQmFycztcbiIsImltcG9ydCB7Z2V0Q29sb3J9IGZyb20gXCIuL3V0aWxzXCJcblxuZnVuY3Rpb24gU3ZnTWFwKG1hcE1haW4pIHtcblxuICB0aGlzLnJlbmRlciA9IG51bGw7XG4gIHRoaXMuc2VsZWN0ZWRSZWcgPSBudWxsO1xuICB0aGlzLm1hcEVsZW0gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN2Zy1tYXBcIik7XG4gIGxldCB0aGF0ID0gdGhpcztcblxuXG4gIGxldCByZWdpb25zID0gJChcIiNzdmctbWFwIHBhdGgsICNzdmctbWFwIHBvbHlnb25cIik7XG4gIGxldCBzZWxlY3RlZFJlZyA9IG51bGw7XG5cbiAgbGV0IHNldFJlZ3NDb2xvciA9IGZ1bmN0aW9uKHllYXIpIHtcbiAgICBPYmplY3Qua2V5cyhtYXBNYWluLmRhdGEpLmZvckVhY2goZnVuY3Rpb24ocmVnaW5vSWQpIHtcblxuICAgICAgbGV0IHZhbHVlLCBwZXJjZW50O1xuXG4gICAgICBpZiAobWFwTWFpbi5zdGF0ZS5kaXNwbGF5ID09IFwiYWJzXCIpIHtcblxuICAgICAgICB2YWx1ZSA9IG1hcE1haW4uZGF0YVtyZWdpbm9JZF0uYWJzSW5mZWN0ZWRbeWVhcl07XG5cbiAgICAgICAgaWYgKHZhbHVlIDwgMTAwKSB7XG4gICAgICAgICAgcGVyY2VudCA9IDA7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGVyY2VudCA9IChNYXRoLmxvZzIodmFsdWUgLyAxMDApKSAvIDk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhbHVlID0gbWFwTWFpbi5kYXRhW3JlZ2lub0lkXS5yZWxJbmZlY3RlZFt5ZWFyXTtcblxuICAgICAgICBpZiAodmFsdWUgPCAxMCkge1xuICAgICAgICAgIHBlcmNlbnQgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlcmNlbnQgPSAoTWF0aC5sb2cyKHZhbHVlIC8gMTApKSAvIDk7XG4gICAgICAgIH1cblxuICAgICAgfVxuXG4gICAgICAkKCcjJyArIHJlZ2lub0lkKS5jc3Moe1xuICAgICAgICAnZmlsbCc6IGdldENvbG9yKHBlcmNlbnQpLFxuICAgICAgfSk7XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IHNldFNlbGVjdGVkUmVnaW9uID0gZnVuY3Rpb24ocmVnaW9uSWQpIHtcbiAgICB0aGF0LnNlbGVjdGVkUmVnICYmIHRoYXQuc2VsZWN0ZWRSZWcuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcbiAgICBpZiAocmVnaW9uSWQpIHtcbiAgICAgIHRoYXQuc2VsZWN0ZWRSZWcgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChyZWdpb25JZCk7XG4gICAgICB0aGF0LnNlbGVjdGVkUmVnLmNsYXNzTGlzdC5hZGQoJ3NlbGVjdGVkJyk7XG4gICAgfVxuICB9O1xuXG5cblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHNldFJlZ3NDb2xvcihtYXBNYWluLnN0YXRlLnllYXIpO1xuICAgIHNldFNlbGVjdGVkUmVnaW9uKG1hcE1haW4uc3RhdGUucmVnaW9uSWQpO1xuICAgIGlmIChtYXBNYWluLnN0YXRlLnJlZ2lvbklkKSB7XG4gICAgICB0aGlzLm1hcEVsZW0uY2xhc3NMaXN0LmFkZCgncmVnU2VsZWN0ZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5tYXBFbGVtLmNsYXNzTGlzdC5yZW1vdmUoJ3JlZ1NlbGVjdGVkJyk7XG4gICAgfVxuICB9O1xuXG4gIHJlZ2lvbnMuY2xpY2soXG4gICAgZnVuY3Rpb24oZSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIC8vIG1hcE1haW4uc3RhdGUuaXNQbGFpbmcgPWZhbHNlO1xuICAgICAgaWYgKGUudGFyZ2V0LmlkID09PSBtYXBNYWluLnN0YXRlLnJlZ2lvbklkKSB7XG4gICAgICAgIHRoYXQubWFwRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdyZWdTZWxlY3RlZCcpO1xuICAgICAgICBtYXBNYWluLnN0YXRlLnJlZ2lvbklkID0gXCJcIjtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1hcE1haW4uc3RhdGUucmVnaW9uSWQgPSBlLnRhcmdldC5pZDtcbiAgICAgICAgZS50YXJnZXQucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoZS50YXJnZXQsIG51bGwpO1xuICAgICAgfVxuICAgICAgbWFwTWFpbi5yZW5kZXIoKTtcbiAgICB9XG4gICk7XG59XG5cblxuXG5leHBvcnQgZGVmYXVsdCBTdmdNYXA7XG4iLCJmdW5jdGlvbiBUb2dsZUJ0bihtYXBNYWluKSB7XG4gIGxldCBidG4gPSAkKFwiLm1hcCAubWFwX2hlYWRlciAuYnRuXCIpO1xuXG4gIGJ0bi5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBtYXBNYWluLnN0YXRlLmlzUGxhaW5nID0gZmFsc2U7XG4gICAgbWFwTWFpbi5zdGF0ZS5kaXNwbGF5ID0gdGhpcy5kYXRhc2V0LmRpc3BsYXl0eXBlO1xuICAgIG1hcE1haW4ucmVuZGVyKCk7XG4gIH0pO1xuXG4gIGxldCBzZXRCdXR0b25zID0gZnVuY3Rpb24oZGlzcGxheSkge1xuICAgIGJ0bi5lYWNoKGZ1bmN0aW9uKGksIGVsZW0pIHtcbiAgICAgIGlmIChlbGVtLmRhdGFzZXQuZGlzcGxheXR5cGUgPT0gZGlzcGxheSkgZWxlbS5jbGFzc0xpc3QuYWRkKCdhY3RpdmUnKTtcbiAgICAgIGVsc2UgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdhY3RpdmUnKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIHNldEJ1dHRvbnMobWFwTWFpbi5zdGF0ZS5kaXNwbGF5KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBUb2dsZUJ0bjtcbiIsImZ1bmN0aW9uIFllYXJTZWxlY3QobWFwTWFpbiwgbWFpbkVsZW0pIHtcbiAgbGV0IHllYXIgPSBtYWluRWxlbS5maW5kKFwiLnNlbGVjdGVkLXllYXJcIik7XG4gIGxldCBtb3JlQnRuID0gbWFpbkVsZW0uZmluZChcIi5tb3JlXCIpO1xuICBsZXQgbGVzc0J0biA9IG1haW5FbGVtLmZpbmQoXCIubGVzc1wiKTtcblxuICBtb3JlQnRuLmNsaWNrKCgpID0+IHtcbiAgICBpZiAobWFwTWFpbi5zdGF0ZS55ZWFyIDwgMjAxNCkgbWFwTWFpbi5zdGF0ZS55ZWFyKys7XG4gICAgbWFwTWFpbi5yZW5kZXIoKTtcbiAgfSlcblxuICBsZXNzQnRuLmNsaWNrKCgpID0+IHtcbiAgICBpZiAobWFwTWFpbi5zdGF0ZS55ZWFyID4gMTk5NCkgbWFwTWFpbi5zdGF0ZS55ZWFyLS07XG4gICAgbWFwTWFpbi5yZW5kZXIoKTtcbiAgfSlcblxuICB0aGlzLnJlbmRlciA9ICgpID0+IHtcbiAgICB5ZWFyLnRleHQobWFwTWFpbi5zdGF0ZS55ZWFyKVxuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFllYXJTZWxlY3Q7XG4iLCJmdW5jdGlvbiBZZWFycyhtYXBNYWluKSB7XG4gIHRoaXMucmVuZGVyID0gZnVuY3Rpb24oKSB7XG5cbiAgICAkKFwiLnllYXJzIC5jb2xcIikuZWFjaChmdW5jdGlvbihpZCwgZSkge1xuICAgICAgbGV0IHllYXIgPSBwYXJzZUludCgkKGUpLmF0dHIoXCJpZFwiKSk7XG4gICAgICBpZiAoeWVhciA9PT0gbWFwTWFpbi5zdGF0ZS55ZWFyKSB7XG4gICAgICAgICQoZSkuYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAkKGUpLnJlbW92ZUNsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gIH07XG5cbiAgLy8gX19fX19fX19fX19fX2NsaWNrX19fX19fX19fX1xuXG4gICQoXCIueWVhcnMgLmNvbFwiKS5vbihcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIG1hcE1haW4uc3RhdGUuaXNQbGFpbmcgPSBmYWxzZTtcbiAgICBsZXQgeWVhciA9IHBhcnNlSW50KCQodGhpcykuYXR0cihcImlkXCIpKTtcbiAgICBtYXBNYWluLnN0YXRlLnllYXIgPSB5ZWFyO1xuICAgIG1hcE1haW4ucmVuZGVyKCk7XG4gIH0pO1xuXG59XG5cbmV4cG9ydCBkZWZhdWx0IFllYXJzO1xuIiwibGV0IGtleVJlYXNvbkNoYXJ0ID0gKCgpID0+IHtcblxuICAvL1x00J3QsNGA0LrQvtGC0LjQutC4XHTQk9C10YLQtdGA0L7RgdC10LrRgS5cdNCT0L7QvNC+0YHQtdC60YEuXHTQntGCINC80LDRgtC10YDQtdC5XG5cbiAgLy/QutCw0Log0YDQsNGB0L/QvtC70L7QttC10L3QvdGLINCx0LDRgNGLINC90LAg0LTQuNCw0LPRgNCw0LzQvNC1XG4gIGxldCBiYXJzUG9zaXRpb24gPSBbXCJkcmFnc1wiLCBcImZyb21NYXRoZXJcIiwgXCJoZXRlcm9cIiwgXCJob21vXCJdO1xuXG5cbiAgLy/QutCw0Log0L/RgNC10LTRgdGC0LDQstC70LXQvdGL0LUg0LTQsNC90L3Ri9C1INCyINGN0LvQtdC80LXQvdGC0LUg0LzQsNGC0YDQuNGG0LhcbiAgbGV0IGxlZ2VuZCA9IHtcbiAgICBkcmFnczogMCxcbiAgICBoZXRlcm86IDEsXG4gICAgaG9tbzogMixcbiAgICBmcm9tTWF0aGVyOiAzXG4gIH07XG5cbiAgbGV0IHZhbE1hdHJpeCA9IFtcbiAgICBbMy4zLCA0MywgNTMsIDAuN10sXG4gICAgWzYsIDQxLCA1Mi45LCAwLjFdLFxuICAgIFs4NCwgNywgOC43LCAwLjNdLFxuICAgIFs4NywgMTAuOSwgMS45LCAwLjJdLFxuICAgIFs3OS4xLCAxNy44LCAyLjcsIDAuNF0sXG4gICAgWzkxLjgsIDcuNCwgMC42LCAwLjFdLFxuICAgIFs5NS41LCA0LjIsIDAuMiwgMC4xXSxcbiAgICBbOTMuMiwgNi40LCAwLjIsIDAuMl0sXG4gICAgWzgxLjIsIDE3LjcsIDAuNCwgMC43XSxcbiAgICBbNzIuMywgMjUuNCwgMC41LCAxLjddLFxuICAgIFs2Ni43LCAyOS45LCAwLjgsIDIuNV0sXG4gICAgWzY0LjEsIDMxLjgsIDEuMSwgMy4wXSxcbiAgICBbNjMuMywgMzMuMCwgMC43LCAyLjldLFxuICAgIFs2MS41LCAzNS4yLCAxLjAsIDIuM10sXG4gICAgWzYxLjMsIDM1LjYsIDEuMSwgMi4wXSxcbiAgICBbNTkuOCwgMzcsIDEuNCwgMS44XSxcbiAgICBbNTcuOSwgMzkuNywgMS4zLCAxLjFdLFxuICAgIFs1Ni4yLCA0MS40LCAxLjMsIDEuMV0sXG4gICAgWzU2LjQsIDQxLjcsIDEuMSwgMC44XSxcbiAgICBbNTQuOSwgNDMuMSwgMSwgMS4wXSxcbiAgICBbNTguNCwgMzkuNywgMS4xLCAwLjhdXG4gIF07XG5cbiAgbGV0IGRlZlllYXJWYWwgPSBbMjUsIDI1LCAyNSwgMjVdO1xuXG4gIGxldCB5ZWFycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5rZXktcmVhc29uLWNhbnZhcyAueWVhcicpO1xuXG4gIGxldCB5ZWFyc01vYmlsZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoXCIua2V5LXJlYXNvbi1tb2JpbGUgLnllYXJcIik7XG5cbiAgbGV0IHNldFZhbHVlID0gZnVuY3Rpb24oeWVhciwgdmFsQXJyKSB7XG4gICAgbGV0IGJhcnMgPSB5ZWFyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmFyXCIpO1xuICAgIFtdLmZvckVhY2guY2FsbChiYXJzLCBmdW5jdGlvbihlbGVtLCBpKSB7XG4gICAgICBsZXQgbmFtZSA9IGJhcnNQb3NpdGlvbltpXTtcbiAgICAgIGxldCBwZXJjZW50ID0gdmFsQXJyW2xlZ2VuZFtuYW1lXV07XG4gICAgICBlbGVtLmNsYXNzTGlzdC5hZGQobmFtZSk7XG4gICAgICBlbGVtLnN0eWxlLmhlaWdodCA9IHBlcmNlbnQgKyBcIiVcIjtcbiAgICB9KTtcbiAgfTtcblxuICBsZXQgc2V0VmFsdWVNb2JpbGUgPSBmdW5jdGlvbih5ZWFyLCB2YWxBcnIpIHtcbiAgICBsZXQgYmFycyA9IHllYXIucXVlcnlTZWxlY3RvckFsbChcIi5iYXJcIik7XG4gICAgW10uZm9yRWFjaC5jYWxsKGJhcnMsIGZ1bmN0aW9uKGVsZW0sIGkpIHtcbiAgICAgIGxldCBuYW1lID0gYmFyc1Bvc2l0aW9uW2ldO1xuICAgICAgbGV0IHBlcmNlbnQgPSB2YWxBcnJbbGVnZW5kW25hbWVdXTtcbiAgICAgIGVsZW0uY2xhc3NMaXN0LmFkZChuYW1lKTtcbiAgICAgIGVsZW0uc3R5bGUud2lkdGggPSBwZXJjZW50ICsgXCIlXCI7XG4gICAgfSk7XG4gIH07XG5cbiAgbGV0IHNldFllYXJzID0gKGksIGZuLCB5ZWFycykgPT4ge1xuICAgIGlmIChpID4geWVhcnMubGVuZ3RoIC0gMSkge1xuICAgICAgJChcIi5rZXktcmVhc29uLW1vYmlsZS15ZWFyLXRleHRcIikuY3NzKHtcbiAgICAgICAgb3BhY2l0eTogMC45LFxuICAgICAgfSlcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZm4oeWVhcnNbaV0sIHZhbE1hdHJpeFtpXSk7XG4gICAgc2V0VGltZW91dChzZXRZZWFycywgODAsICsraSwgZm4sIHllYXJzKTtcbiAgfTtcblxuICBsZXQgc3RhcnRJbmRleCA9IDA7XG5cbiAgbGV0IHNob3cgPSAoKSA9PiB7XG4gICAgLy8gc2V0WWVhcnMoc3RhcnRJbmRleCwgc2V0VmFsdWUsIHllYXJzKVxuICAgIHNldFRpbWVvdXQoc2V0WWVhcnMsIDEwMDAsIDAsIHNldFZhbHVlLCB5ZWFycyk7XG4gICAgc2V0VGltZW91dChzZXRZZWFycywgMTAwMCwgMCwgc2V0VmFsdWVNb2JpbGUsIHllYXJzTW9iaWxlKTtcbiAgfVxuXG4gIC8vbW92ZSBpbml0IHRvIHNvbWUgZ2xvYmFsIGluaXRcblxuICBsZXQgaW5pdFllYXJzID0gKGksIGZuLCB5ZWFycykgPT4ge1xuICAgIGlmIChpID4gMjApIHJldHVybjtcbiAgICBmbih5ZWFyc1tpXSwgZGVmWWVhclZhbCk7XG4gICAgaW5pdFllYXJzKCsraSwgZm4sIHllYXJzKTtcbiAgfTtcblxuICBpbml0WWVhcnMoc3RhcnRJbmRleCwgc2V0VmFsdWUsIHllYXJzKTtcbiAgaW5pdFllYXJzKHN0YXJ0SW5kZXgsIHNldFZhbHVlTW9iaWxlLCB5ZWFyc01vYmlsZSlcblxuICByZXR1cm4ge1xuICAgIHNob3c6IHNob3csXG4gIH1cblxufSkoKTtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IGtleVJlYXNvbkNoYXJ0O1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgbGV0IGEgPSAxMDtcbiAgaW1wb3J0IHthZGRNb3VzZWV3aGVlbEV2ZW50fSBmcm9tIFwiLi91dGlsc1wiO1xuICBpbXBvcnQge2dldENvbG9yLHNob3dFbGVtLGhpZGVFbGVtLCBzY3JvbGxUb0VsZW1Ub3B9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuICBpbXBvcnQgUmVnSW5mbyBmcm9tIFwiLi9SZWdJbmZvXCJcbiAgaW1wb3J0IFJlZ0luZm9Nb2JpbGUgZnJvbSBcIi4vUmVnSW5mb01vYmlsZVwiO1xuXG4gIGltcG9ydCBuZXdJbmZlY3RlZENoYXJ0TW9iaWxlIGZyb20gXCIuL25ld0luZmVjdGVkQ2hhcnRNb2JpbGVcIjtcbiAgaW1wb3J0IG5ld0luZmVjdGVkQ2hhcnQgZnJvbSBcIi4vbmV3SW5mZWN0ZWRDaGFydFwiO1xuICBpbXBvcnQga2V5UmVhc29uQ2hhcnQgZnJvbSBcIi4va2V5UmVhc29uQ2hhcnRcIjtcblxuICBpbXBvcnQgc2hhcmUgZnJvbSBcIi4vc2hhcmUuanNcIjtcbiAgaW1wb3J0IFNpZGVCYXJzIGZyb20gXCIuL1NpZGVCYXJzXCJcblxuICBpbXBvcnQgRm9vdGVyIGZyb20gXCIuL0Zvb3RlclwiXG5cbiAgLy8gaW1wb3J0IGV2ZW50RW1pdHRlciBmcm9tIFwid29sZnk4Ny1ldmVudGVtaXR0ZXJcIlxuXG4gIC8vIGNvbnNvbGUubG9nKGV2ZW50RW1pdHRlcik7XG5cblxuXG4oZnVuY3Rpb24oKSB7XG5cbiAgLypcbiAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paIICDilojiloggICAgICDilojilojilojilojilojilojilohcbiAg4paI4paIICAgICAgIOKWiOKWiCAgICAgIOKWiOKWiCAgICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAgICDilojilohcbiAg4paI4paIICAg4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgICDilojilogg4paI4paI4paI4paI4paI4paIICDilojilojilojilojilojilojilogg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paI4paIXG4gIOKWiOKWiCAgICDilojilogg4paI4paIICAgICAg4paI4paIICAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgICAgICAgICAg4paI4paIXG4gICDilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIICDilojilojilojilojilojiloggIOKWiOKWiCAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paI4paI4paI4paI4paI4paIXG4gICovXG5cbiAgd2luZG93LmRpc2FibGVTY3JvbGwgPSBmYWxzZTtcblxuXG4gIC8qXG4gIOKWiOKWiCAgICAgIOKWiOKWiCDilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIICDilojiloggICAg4paI4paIICAgICDilojilojilojilojilojilojilogg4paI4paIICAgIOKWiOKWiCDilojilojiloggICAg4paI4paIICDilojilojilojilojilojilogg4paI4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAg4paI4paI4paI4paI4paI4paIICDilojilojiloggICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiFxuICDilojiloggICAgICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAg4paI4paIICDilojiloggIOKWiOKWiCAgICAgIOKWiOKWiCAgICAgIOKWiOKWiCAgICDilojilogg4paI4paI4paI4paIICAg4paI4paIIOKWiOKWiCAgICAgICAgIOKWiOKWiCAgICDilojilogg4paI4paIICAgIOKWiOKWiCDilojilojilojiloggICDilojilogg4paI4paIXG4gIOKWiOKWiCAgICAgIOKWiOKWiCDilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiCAgICDilojilojilojiloggICAgICAg4paI4paI4paI4paI4paIICAg4paI4paIICAgIOKWiOKWiCDilojilogg4paI4paIICDilojilogg4paI4paIICAgICAgICAg4paI4paIICAgIOKWiOKWiCDilojiloggICAg4paI4paIIOKWiOKWiCDilojiloggIOKWiOKWiCDilojilojilojilojilojilojilohcbiAg4paI4paIICAgICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCAgICDilojiloggICAgICAgIOKWiOKWiCAgICAgIOKWiOKWiCAgICDilojilogg4paI4paIICDilojilogg4paI4paIIOKWiOKWiCAgICAgICAgIOKWiOKWiCAgICDilojilogg4paI4paIICAgIOKWiOKWiCDilojiloggIOKWiOKWiCDilojiloggICAgICDilojilohcbiAg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCDilojilojilojilojilojiloggIOKWiOKWiCAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAg4paI4paIICAgIOKWiOKWiCAgICAgICAg4paI4paIICAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAg4paI4paI4paI4paIICDilojilojilojilojilojiloggICAg4paI4paIICAgIOKWiOKWiCAg4paI4paI4paI4paI4paI4paIICDilojiloggICDilojilojilojilogg4paI4paI4paI4paI4paI4paI4paIXG4gICovXG5cblxuXG4gIGxldCBkb0Vsc0NvbGxpZGUgPSBmdW5jdGlvbihlbDEsIGVsMikge1xuXG4gICAgbGV0IHJlY3QxID0gZWwxLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgIGxldCByZWN0MiA9IGVsMi5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIHJldHVybiAocmVjdDEubGVmdCA8IHJlY3QyLmxlZnQgKyByZWN0Mi53aWR0aCAmJlxuICAgICAgcmVjdDEubGVmdCArIHJlY3QxLndpZHRoID4gcmVjdDIubGVmdCAmJlxuICAgICAgcmVjdDEudG9wIDwgcmVjdDIudG9wICsgcmVjdDIuaGVpZ2h0ICYmXG4gICAgICByZWN0MS5oZWlnaHQgKyByZWN0MS50b3AgPiByZWN0Mi50b3ApO1xuICB9O1xuXG4gIC8vIC0tLS0tLS0tLS0tLURhdGEgcHJvY2VzcyBmdW5jdGlvbnMtLS0tLS1cblxuXG4gIGxldCBuZXdEYXRhUHJvc2VlZCA9IGZ1bmN0aW9uKGNzdkZpbGUpIHtcbiAgICBsZXQgciA9IHt9O1xuICAgIGxldCByZWdpb25zQXJyID0gY3N2RmlsZS5zcGxpdChcIlxcblwiKTtcbiAgICByZWdpb25zQXJyLnBvcCgpOyAvL3JlbW92ZSBlbmQgbGluZVxuXG4gICAgcmVnaW9uc0Fyci5mb3JFYWNoKGZ1bmN0aW9uKGUsIGkpIHtcbiAgICAgIGUgPSBlLnNwbGl0KFwiO1wiKTtcbiAgICAgIGxldCBrZXkgPSBlLnNoaWZ0KCk7XG4gICAgICBsZXQgc2hvcnROYW1lID0gZS5zaGlmdCgpO1xuICAgICAgbGV0IG5hbWUgPSBlLnNoaWZ0KCk7XG4gICAgICByW2tleV0gPSB7XG4gICAgICAgIG5hbWU6IG5hbWUsXG4gICAgICAgIHNob3J0TmFtZTogc2hvcnROYW1lLFxuICAgICAgICByb3dZZWFyc0RhdGE6IGUsXG4gICAgICB9O1xuICAgIH0pO1xuXG4gICAgbGV0IHllYXJzID0gW107XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gMjA7IGkrKykge1xuICAgICAgeWVhcnMucHVzaCgxOTk0ICsgaSk7XG4gICAgfVxuXG5cblxuICAgIE9iamVjdC5rZXlzKHIpLmZvckVhY2goZnVuY3Rpb24ocmVnaW9uKSB7XG5cbiAgICAgIHJbcmVnaW9uXS5hYnNEaWVkID0ge307XG4gICAgICByW3JlZ2lvbl0uYWJzSW5mZWN0ZWQgPSB7fTtcbiAgICAgIHJbcmVnaW9uXS5yZWxJbmZlY3RlZCA9IHt9O1xuICAgICAgeWVhcnMuZm9yRWFjaChmdW5jdGlvbih5ZWFyKSB7XG4gICAgICAgIHJbcmVnaW9uXS5hYnNJbmZlY3RlZFt5ZWFyXSA9IGluZmVjdGVkSW5ZZWFyKHllYXIsIHJbcmVnaW9uXS5yb3dZZWFyc0RhdGEpO1xuICAgICAgICByW3JlZ2lvbl0uYWJzRGllZFt5ZWFyXSA9IGRpZWRJblllYXIoeWVhciwgcltyZWdpb25dLnJvd1llYXJzRGF0YSk7XG4gICAgICAgIHJbcmVnaW9uXS5yZWxJbmZlY3RlZFt5ZWFyXSA9IHJlbG5JZmVjdGVkSW5ZZWFyKHllYXIsIHJbcmVnaW9uXS5yb3dZZWFyc0RhdGEpO1xuICAgICAgfSk7XG5cblxuICAgIH0pO1xuXG4gICAgcmV0dXJuIHI7XG5cbiAgfTtcblxuICBsZXQgaW5mZWN0ZWRJblllYXIgPSBmdW5jdGlvbih5ZWFyLCByb3dScmVnRGF0YSkge1xuICAgIGxldCBvZnNldCA9IDAgKyAoMjAxNCAtIHllYXIpICogMztcbiAgICByZXR1cm4gcm93UnJlZ0RhdGFbb2ZzZXRdO1xuICB9O1xuXG5cbiAgbGV0IGRpZWRJblllYXIgPSBmdW5jdGlvbih5ZWFyLCByb3dScmVnRGF0YSkge1xuICAgIGxldCBvZnNldCA9IDEgKyAoMjAxNCAtIHllYXIpICogMztcbiAgICByZXR1cm4gcm93UnJlZ0RhdGFbb2ZzZXRdO1xuICB9O1xuXG4gIGxldCByZWxuSWZlY3RlZEluWWVhciA9IGZ1bmN0aW9uKHllYXIsIHJvd1JyZWdEYXRhKSB7XG4gICAgbGV0IG9mc2V0ID0gMiArICgyMDE0IC0geWVhcikgKiAzO1xuICAgIHJldHVybiByb3dScmVnRGF0YVtvZnNldF07XG4gIH07XG5cbiAgbGV0IGdldENvbG9yTWV0YSA9IGZ1bmN0aW9uKHN0YXJ0Q29sb3IsIGVuZENvbG9yLCBwZXJjZW50KSB7XG4gICAgLy8gY29uc29sZS5sb2cocGVyY2VudCk7XG4gICAgaWYgKHBlcmNlbnQgPj0gMSB8fCBpc05hTihwZXJjZW50KSkgcmV0dXJuIHN0YXJ0Q29sb3Iuam9pbihcIixcIilcbiAgICBsZXQgbm9OYW1lID0gZnVuY3Rpb24oc3RhcnQsIGVuZCwgcGVyY2VudCkge1xuICAgICAgcmV0dXJuIE1hdGguYWJzKFxuICAgICAgICBNYXRoLmZsb29yKHN0YXJ0ICogKDEgLSBwZXJjZW50KSArIGVuZCAqIHBlcmNlbnQpXG4gICAgICApO1xuICAgIH07XG5cbiAgICByZXR1cm4gc3RhcnRDb2xvci5tYXAoZnVuY3Rpb24oZWxlbSwgaSkge1xuICAgICAgcmV0dXJuIG5vTmFtZShlbGVtLCBlbmRDb2xvcltpXSwgcGVyY2VudCk7XG4gICAgfSkuam9pbihcIixcIik7XG4gIH07XG5cblxuXG4gIC8qXG4gIOKWiOKWiCAgICAg4paI4paIIOKWiOKWiCDilojilojiloggICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgICDilojiloggICAgICDilojilojilojilojilojiloggIOKWiOKWiOKWiCAgICDilojiloggICAgIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgICAg4paI4paIXG4gIOKWiOKWiCAgICAg4paI4paIIOKWiOKWiCDilojilojilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgICDilojilogg4paI4paIICAgICDilojiloggICAgIOKWiOKWiCAgICDilojilogg4paI4paI4paI4paIICAg4paI4paIICAgICDilojiloggICAgICDilojiloggICAgICDilojiloggICDilojilogg4paI4paIICAgIOKWiOKWiCDilojiloggICAgICDilojilohcbiAg4paI4paIICDiloggIOKWiOKWiCDilojilogg4paI4paIIOKWiOKWiCAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAg4paI4paIIOKWiOKWiCAg4paIICDilojiloggICAgIOKWiOKWiCAgICDilojilogg4paI4paIIOKWiOKWiCAg4paI4paIICAgICDilojilojilojilojilojilojilogg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojiloggICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiFxuICDilojilogg4paI4paI4paIIOKWiOKWiCDilojilogg4paI4paIICDilojilogg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAg4paI4paIIOKWiOKWiCDilojilojilogg4paI4paIICAgICDilojiloggICAg4paI4paIIOKWiOKWiCAg4paI4paIIOKWiOKWiCAgICAgICAgICDilojilogg4paI4paIICAgICAg4paI4paIICAg4paI4paIIOKWiOKWiCAgICDilojilogg4paI4paIICAgICAg4paI4paIXG4gICDilojilojilogg4paI4paI4paIICDilojilogg4paI4paIICAg4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiCDilojilojiloggICAgICAg4paI4paI4paI4paI4paI4paIICDilojiloggICDilojilojilojiloggICAgIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgIOKWiOKWiCAg4paI4paI4paI4paI4paI4paIICDilojilojilojilojilojilojilogg4paI4paI4paI4paI4paI4paI4paIXG4gICovXG5cblxuICBsZXQgb25zY3JvbGwgPSAoZnVuY3Rpb24oKSB7XG4gICAgbGV0IGJnQ29sb3IgPSBudWxsO1xuICAgIGxldCBIID0gZG9jdW1lbnQuYm9keS5vZmZzZXRIZWlnaHQ7XG5cblxuICAgIGxldCBjb2xvcnMgPSBbXG4gICAgICBbMjYsIDE0LCAxNF0sXG4gICAgICBbMjIsIDQ3LCA1N10sXG4gICAgICBbMjYsIDE0LCAxNF0sXG4gICAgICBbMTksIDUwLCA2MV0sXG4gICAgICBbMTksIDUwLCA2MV0sXG4gICAgICBbMTIsIDM1LCA0Ml0sXG4gICAgICBbMTIsIDM1LCA0Ml0sXG4gICAgICBbMjIsIDQ3LCA1N10sXG4gICAgICBbNDQsIDEwOCwgMTExXSxcbiAgICBdXG5cbiAgICBsZXQgcmVmRWxlbVNlbGVjdG9ycyA9IFtcbiAgICAgICcucGxhdGUxJyxcbiAgICAgIFwiLnBsYXRlMi0zXCIsXG4gICAgICBcIi5wbGF0ZTQtNVwiLFxuICAgICAgXCIucGxhdGU2XCIsXG4gICAgICBcIi5wbGF0ZTdcIixcbiAgICAgIFwiLnBsYXRlOFwiLFxuICAgICAgXCIucGxhdGU5XCIsXG4gICAgICBcIi5wbGF0ZTEwXCIsXG4gICAgICBcIi5wbGF0ZTExXCJcbiAgICBdO1xuXG4gICAgbGV0IGNhbGNSZWZQb2ludCA9IChlbGVtKSA9PiAoJChlbGVtKS5vdXRlckhlaWdodCgpIC8gMiArICQoZWxlbSkub2Zmc2V0KCkudG9wKTtcblxuICAgIGxldCByZWZQb2ludCA9IHJlZkVsZW1TZWxlY3RvcnMubWFwKGNhbGNSZWZQb2ludCk7XG5cblxuICAgIGxldCBnZXRCb3RvbVJlZkluZGV4ID0gKHB4KSA9PiB7XG4gICAgICBsZXQgaTtcbiAgICAgIGZvciAoaSA9IDA7IGkgPCByZWZQb2ludC5sZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocmVmUG9pbnRbaV0gPiBweCkgYnJlYWs7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGk7XG4gICAgfTtcblxuICAgIGxldCBnZXRQZXJzZW50cyA9IChweCwgcmVmVG9wLCByZWZCb3RvbSkgPT4gKChweCAtIHJlZlRvcCkgLyAocmVmQm90b20gLSByZWZUb3ApKTtcblxuICAgIGxldCBvbnNjcm9sbCA9IGZ1bmN0aW9uKCkge1xuICAgICAgbGV0IHNjcm9sbGVkID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG4gICAgICBsZXQgd2luZG93Q2VudGVyID0gc2Nyb2xsZWQgKyB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyO1xuXG4gICAgICBsZXQgYm90b21JbmRleCA9IGdldEJvdG9tUmVmSW5kZXgod2luZG93Q2VudGVyKTtcbiAgICAgIGxldCBwZXJjZW50ID0gZ2V0UGVyc2VudHMod2luZG93Q2VudGVyLCByZWZQb2ludFtib3RvbUluZGV4IC0gMV0sIHJlZlBvaW50W2JvdG9tSW5kZXhdKTtcbiAgICAgIGxldCBjb2xvciA9IGdldENvbG9yTWV0YShjb2xvcnNbYm90b21JbmRleCAtIDFdLCBjb2xvcnNbYm90b21JbmRleF0sIHBlcmNlbnQpO1xuXG4gICAgICBpZiAoY29sb3IgIT09IGJnQ29sb3IpIHtcbiAgICAgICAgd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbigpIHtcbiAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiKCR7Y29sb3J9KWA7XG4gICAgICAgIH0pO1xuICAgICAgICBiZ0NvbG9yID0gY29sb3I7XG4gICAgICB9XG4gICAgfTtcblxuICAgIHJldHVybiBvbnNjcm9sbDtcblxuICB9KSgpO1xuXG4gIHdpbmRvdy5vbnNjcm9sbCA9IG9uc2Nyb2xsO1xuXG5cblxuICAkKGZ1bmN0aW9uKCkge1xuXG5cbiAgICAvKlxuICAgIOKWiOKWiCAgICDilojiloggIOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiFxuICAgIOKWiOKWiCAgICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgIOKWiOKWiCDilojilogg4paI4paIICAgICAg4paI4paIICDilojiloggIOKWiOKWiCAgICAgIOKWiOKWiCAgIOKWiOKWiFxuICAgIOKWiOKWiCAgICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiOKWiFxuICAgICDilojiloggIOKWiOKWiCAg4paI4paIICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgICAgIOKWiOKWiCDilojiloggICAgICDilojiloggIOKWiOKWiCAg4paI4paIICAgICAg4paI4paIICAg4paI4paIXG4gICAgICDilojilojilojiloggICDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAg4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paIICAg4paI4paIXG4gICAgKi9cblxuXG4gICAgbGV0IHZhbFBpY2tlciA9IGZ1bmN0aW9uKGZuLCBzdGF0ZSkge1xuXG4gICAgICBsZXQgbWV0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVkLW1ldGVyLTknKTtcbiAgICAgIGxldCBncmVlbk1ldGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRoZXJtb21ldGVyLTkgLmdyZWVuLW1ldGVyLTknKTtcbiAgICAgIGxldCByaWJib25TbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmliYm9uLXNsaWRlci05Jyk7XG4gICAgICBsZXQgcGVyY2VudDtcbiAgICAgIGxldCBtYXggPSA4NDg7XG4gICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWQtbWV0ZXItOT5kaXYnKTtcbiAgICAgIGxldCByaWdodEFuc3dlciA9IDEyO1xuXG5cbiAgICAgIGxldCByZW5kZXJNb2JpbGUgPSAocGVyY2VudCkgPT4ge1xuICAgICAgICAkKFwiLmFuc3dlcnMtbW9iaWxlLmhpZGUtZGVza3RvcCAucmVkLW1ldGVyLTlcIilbMF0uc3R5bGUubGVmdCA9ICgtMSArIHBlcmNlbnQpICogMTAwICsgXCIlXCI7XG4gICAgICAgICQoXCIudmFsdWVwaWNrZXItbW9iaWxlLXBpY2tlci05XCIpWzBdLnN0eWxlLmxlZnQgPSAocGVyY2VudCkgKiAyMzUgKyBcInB4XCI7XG4gICAgICAgICQoXCIudmFsdWVwaWNrZXItbW9iaWxlLXBpY2tlci05XCIpLnRleHQoTWF0aC5yb3VuZChwZXJjZW50ICogMTQpICsgMSk7XG4gICAgICB9XG5cblxuICAgICAgbGV0IHJlbmRlciA9IChwZXJjZW50KSA9PiB7XG4gICAgICAgIHJlbmRlck1vYmlsZShwZXJjZW50KVxuICAgICAgICByaWJib25TbGlkZXIuc3R5bGUubGVmdCA9IHBlcmNlbnQgKiBtYXggKyBcInB4XCI7XG4gICAgICAgIG1ldGVyLnN0eWxlLmxlZnQgPSAoMCAtICgxIC0gcGVyY2VudCkgKiAxMDApICsgXCIlXCI7XG4gICAgICAgIHRleHQuaW5uZXJIVE1MID0gTWF0aC5yb3VuZChwZXJjZW50ICogMTQpICsgMTtcbiAgICAgICAgaWYgKHBlcmNlbnQgPCAwLjA3NSkge1xuICAgICAgICAgIG1ldGVyLmNsYXNzTGlzdC5hZGQoXCJzbWFsbFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXRlci5jbGFzc0xpc3QucmVtb3ZlKFwic21hbGxcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBlcmNlbnQgPiAwLjkyKSB7XG4gICAgICAgICAgZ3JlZW5NZXRlci5jbGFzc0xpc3QuYWRkKFwiYmlnXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyZWVuTWV0ZXIuY2xhc3NMaXN0LnJlbW92ZShcImJpZ1wiKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmVuZGVyKDAuNCk7XG5cbiAgICAgIGxldCBvbkRyYWcgPSAoZXZlbnQsIHVpKSA9PiB7XG4gICAgICAgIHVpLnBvc2l0aW9uLmxlZnQgPSBNYXRoLm1pbig4NDgsIHVpLnBvc2l0aW9uLmxlZnQpO1xuICAgICAgICBwZXJjZW50ID0gdWkucG9zaXRpb24ubGVmdCAvIDg0ODtcbiAgICAgICAgcmVuZGVyKHBlcmNlbnQpO1xuICAgICAgICAvL9C+0LHRgNCw0LHQvtGC0LrRgyDQv9GA0LDQstC40LvRjNC90L4g0L7RgtCy0LXRgtCwINGA0LXRiNC40Lsg0L/RgNC+0LLQvtC00LjRgtGMINCyINGB0LXRgNC10LrRgtC+0YDQtSDQv9C+INGN0YLQvtC80YMg0LzQvtC20L3QvlxuICAgICAgICAvLyDQvdC1INC/0LXRgNC10LTQvtCy0LDRgtGMINGB0L7RgdGC0L7Rj9C90LjQtSDRgdC10LvQtdC60YLQvtGA0LAg0LIg0YHQvtGB0YLQvtGP0L3QuNC1INCy0L7Qv9GA0L7RgdCwXG4gICAgICAgIHN0YXRlLnNlbGVjdGVkID0gTWF0aC5yb3VuZChwZXJjZW50ICogMTQpICsgMTtcbiAgICAgICAgZm4oKTtcbiAgICAgIH07XG5cbiAgICAgICQocmliYm9uU2xpZGVyKS5kcmFnZ2FibGUoe1xuICAgICAgICBjb250YWlubWVudDogXCJwYXJlbnRcIixcbiAgICAgICAgYXhpczogXCJ4XCIsXG4gICAgICAgIGRyYWc6IG9uRHJhZyxcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgb25EcmFnTW9iaWxlID0gKGV2ZW50LCB1aSkgPT4ge1xuICAgICAgICBwZXJjZW50ID0gdWkucG9zaXRpb24ubGVmdCAvIDIzNTtcbiAgICAgICAgcmVuZGVyKHBlcmNlbnQpO1xuXG4gICAgICAgIC8v0L7QsdGA0LDQsdC+0YLQutGDINC/0YDQsNCy0LjQu9GM0L3QviDQvtGC0LLQtdGC0LAg0YDQtdGI0LjQuyDQv9GA0L7QstC+0LTQuNGC0Ywg0LIg0YHQtdGA0LXQutGC0L7RgNC1INC/0L4g0Y3RgtC+0LzRgyDQvNC+0LbQvdC+XG4gICAgICAgIC8vINC90LUg0L/QtdGA0LXQtNC+0LLQsNGC0Ywg0YHQvtGB0YLQvtGP0L3QuNC1INGB0LXQu9C10LrRgtC+0YDQsCDQsiDRgdC+0YHRgtC+0Y/QvdC40LUg0LLQvtC/0YDQvtGB0LBcbiAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSBNYXRoLnJvdW5kKHBlcmNlbnQgKiAxNCkgKyAxO1xuICAgICAgICAvL2NhbGxiYWNrIGNhbGxcbiAgICAgICAgZm4oKTtcbiAgICAgIH07XG5cbiAgICAgICQoXCIudmFsdWVwaWNrZXItbW9iaWxlLXBpY2tlci05XCIpLmRyYWdnYWJsZSh7XG4gICAgICAgIGNvbnRhaW5tZW50OiBcInBhcmVudFwiLFxuICAgICAgICBheGlzOiBcInhcIixcbiAgICAgICAgZHJhZzogb25EcmFnTW9iaWxlLFxuICAgICAgfSk7XG5cblxuICAgICAgbGV0IGlzUmlnaHQgPSAoKSA9PiAoTWF0aC5yb3VuZChwZXJjZW50ICogMTQpICsgMSA9PSByaWdodEFuc3dlcilcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNSaWdodFxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKlxuICAgIOKWiOKWiCAgICDilojiloggIOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIXG4gICAg4paI4paIICAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAgICAg4paI4paIICAg4paI4paIIOKWiOKWiCDilojiloggICAgICDilojiloggIOKWiOKWiCAg4paI4paIICAgICAg4paI4paIICAg4paI4paIICAgICAg4paI4paIXG4gICAg4paI4paIICAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojilogg4paI4paIICAgICAg4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paIXG4gICAgIOKWiOKWiCAg4paI4paIICDilojiloggICDilojilogg4paI4paIICAgICAg4paI4paIICAgICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAg4paI4paIICDilojiloggICAgICDilojiloggICDilojilogg4paI4paIXG4gICAgICDilojilojilojiloggICDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAg4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paIICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiFxuICAgICovXG5cblxuICAgIGxldCB2YWxQaWNrZXIyID0gZnVuY3Rpb24oZm4sIHN0YXRlKSB7XG4gICAgICBsZXQgbWV0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVkLW1ldGVyLTgnKTtcbiAgICAgIGxldCBncmVlbk1ldGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRoZXJtb21ldGVyIC5ncmVlbi1tZXRlcicpO1xuICAgICAgbGV0IHJpYmJvblNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyaWJib24tc2xpZGVyLTgnKTtcbiAgICAgIGxldCBwZXJjZW50O1xuICAgICAgbGV0IG1heCA9IDg0ODtcbiAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlZC1tZXRlci04PmRpdicpO1xuICAgICAgbGV0IHJpZ2h0QW5zd2VyID0gNDA7XG5cblxuICAgICAgbGV0IHJlbmRlck1vYmlsZSA9IChwZXJjZW50KSA9PiB7XG4gICAgICAgICQoXCIuYW5zd2Vycy1tb2JpbGUuaGlkZS1kZXNrdG9wIC5yZWQtbWV0ZXItOFwiKVswXS5zdHlsZS5sZWZ0ID0gKC0xICsgcGVyY2VudCkgKiAxMDAgKyBcIiVcIjtcbiAgICAgICAgJChcIi52YWx1ZXBpY2tlci1tb2JpbGUtcGlja2VyLThcIilbMF0uc3R5bGUubGVmdCA9IChwZXJjZW50KSAqIDIzNSArIFwicHhcIjtcbiAgICAgICAgJChcIi52YWx1ZXBpY2tlci1tb2JpbGUtcGlja2VyLThcIikudGV4dChNYXRoLnJvdW5kKHBlcmNlbnQgKiAxMDApICsgXCIlXCIpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcmVuZGVyID0gKHBlcmNlbnQpID0+IHtcbiAgICAgICAgcmVuZGVyTW9iaWxlKHBlcmNlbnQpO1xuICAgICAgICByaWJib25TbGlkZXIuc3R5bGUubGVmdCA9IHBlcmNlbnQgKiBtYXggKyBcInB4XCI7XG4gICAgICAgIG1ldGVyLnN0eWxlLmxlZnQgPSAoMCAtICgxIC0gcGVyY2VudCkgKiAxMDApICsgXCIlXCI7XG4gICAgICAgIHRleHQuaW5uZXJIVE1MID0gTWF0aC5yb3VuZChwZXJjZW50ICogMTAwKSArIFwiJVwiO1xuICAgICAgICBpZiAocGVyY2VudCA8IDAuMDc1KSB7XG4gICAgICAgICAgbWV0ZXIuY2xhc3NMaXN0LmFkZChcInNtYWxsXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1ldGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzbWFsbFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGVyY2VudCA+IDAuOTIpIHtcbiAgICAgICAgICBncmVlbk1ldGVyLmNsYXNzTGlzdC5hZGQoXCJiaWdcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ3JlZW5NZXRlci5jbGFzc0xpc3QucmVtb3ZlKFwiYmlnXCIpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZW5kZXIoMC41KTtcblxuICAgICAgbGV0IG9uRHJhZyA9IChldmVudCwgdWkpID0+IHtcbiAgICAgICAgdWkucG9zaXRpb24ubGVmdCA9IE1hdGgubWluKDg0OCwgdWkucG9zaXRpb24ubGVmdCk7XG4gICAgICAgIHBlcmNlbnQgPSB1aS5wb3NpdGlvbi5sZWZ0IC8gODQ4O1xuICAgICAgICByZW5kZXIocGVyY2VudCk7XG5cbiAgICAgICAgLy/QvtCx0YDQsNCx0L7RgtC60YMg0L/RgNCw0LLQuNC70YzQvdC+INC+0YLQstC10YLQsCDRgNC10YjQuNC7INC/0YDQvtCy0L7QtNC40YLRjCDQsiDRgdC10YDQtdC60YLQvtGA0LUg0L/QviDRjdGC0L7QvNGDINC80L7QttC90L5cbiAgICAgICAgLy8g0L3QtSDQv9C10YDQtdC00L7QstCw0YLRjCDRgdC+0YHRgtC+0Y/QvdC40LUg0YHQtdC70LXQutGC0L7RgNCwINCyINGB0L7RgdGC0L7Rj9C90LjQtSDQstC+0L/RgNC+0YHQsFxuICAgICAgICBzdGF0ZS5zZWxlY3RlZCA9IE1hdGgucm91bmQocGVyY2VudCAqIDEwMCk7XG4gICAgICAgIGZuKCk7XG4gICAgICB9O1xuXG4gICAgICAkKHJpYmJvblNsaWRlcikuZHJhZ2dhYmxlKHtcbiAgICAgICAgY29udGFpbm1lbnQ6IFwicGFyZW50XCIsXG4gICAgICAgIGF4aXM6IFwieFwiLFxuICAgICAgICBkcmFnOiBvbkRyYWcsXG4gICAgICB9KTtcblxuXG4gICAgICBsZXQgb25EcmFnTW9iaWxlID0gKGV2ZW50LCB1aSkgPT4ge1xuICAgICAgICBwZXJjZW50ID0gdWkucG9zaXRpb24ubGVmdCAvIDIzNTtcbiAgICAgICAgcmVuZGVyKHBlcmNlbnQpO1xuXG4gICAgICAgIC8v0L7QsdGA0LDQsdC+0YLQutGDINC/0YDQsNCy0LjQu9GM0L3QviDQvtGC0LLQtdGC0LAg0YDQtdGI0LjQuyDQv9GA0L7QstC+0LTQuNGC0Ywg0LIg0YHQtdGA0LXQutGC0L7RgNC1INC/0L4g0Y3RgtC+0LzRgyDQvNC+0LbQvdC+XG4gICAgICAgIC8vINC90LUg0L/QtdGA0LXQtNC+0LLQsNGC0Ywg0YHQvtGB0YLQvtGP0L3QuNC1INGB0LXQu9C10LrRgtC+0YDQsCDQsiDRgdC+0YHRgtC+0Y/QvdC40LUg0LLQvtC/0YDQvtGB0LBcbiAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSBNYXRoLnJvdW5kKHBlcmNlbnQgKiAxMDApO1xuICAgICAgICAvL2NhbGxiYWNrIGNhbGxcbiAgICAgICAgZm4oKTtcbiAgICAgIH07XG5cbiAgICAgICQoXCIudmFsdWVwaWNrZXItbW9iaWxlLXBpY2tlci04XCIpLmRyYWdnYWJsZSh7XG4gICAgICAgIGNvbnRhaW5tZW50OiBcInBhcmVudFwiLFxuICAgICAgICBheGlzOiBcInhcIixcbiAgICAgICAgZHJhZzogb25EcmFnTW9iaWxlLFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBpc1JpZ2h0ID0gKCkgPT4ge1xuICAgICAgICBsZXQgYW5zd2VyID0gIE1hdGgucm91bmQocGVyY2VudCAqIDEwMClcblxuICAgICAgICByZXR1cm4gYW5zd2VyID4gMzUgJiYgYW5zd2VyIDwgNDU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzUmlnaHRcbiAgICAgIH1cblxuICAgIH07XG5cbiAgICAvKlxuICAgIOKWiOKWiCAgICDilojiloggIOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIXG4gICAg4paI4paIICAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAgICAg4paI4paIICAg4paI4paIIOKWiOKWiCDilojiloggICAgICDilojiloggIOKWiOKWiCAg4paI4paIICAgICAg4paI4paIICAg4paI4paIICAgICAg4paI4paIXG4gICAg4paI4paIICAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojilogg4paI4paIICAgICAg4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paIXG4gICAgIOKWiOKWiCAg4paI4paIICDilojiloggICDilojilogg4paI4paIICAgICAg4paI4paIICAgICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAg4paI4paIICDilojiloggICAgICDilojiloggICDilojiloggICAgICDilojilohcbiAgICAgIOKWiOKWiOKWiOKWiCAgIOKWiOKWiCAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paIICAgICAg4paI4paIICDilojilojilojilojilojilogg4paI4paIICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paIXG4gICAgKi9cblxuXG4gICAgbGV0IHZhbFBpY2tlcjMgPSBmdW5jdGlvbihmbiwgc3RhdGUpIHtcbiAgICAgIGxldCBjaXJjbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3Vlc3MtZ3Jvd3RoLW1haW4tc21hbGwnKTtcbiAgICAgIGxldCB0ZXh0RmVhbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3Vlc3MtZ3Jvd3RoLW1haW4tdGV4dCcpO1xuICAgICAgbGV0IGJhc2VSID0gMzguMzMzMzMzMzMzMztcbiAgICAgIGxldCByID0gMzguMzMzMzMzMzMzMztcbiAgICAgIGxldCBoID0gMDtcbiAgICAgIGxldCB0ZXh0ID0gXCIxIDAwMCAwMDBcIjtcbiAgICAgIGxldCBzZWxlY3RlZFZhbCA9IDA7XG4gICAgICBsZXQgYmFzZVZhbCA9IDEwMDAwMDA7XG4gICAgICBsZXQgdG90YWxWYWwgPSAxMDAwMDAwO1xuXG4gICAgICBsZXQgdmFsVG9UZXh0ID0gdmFsID0+IHtcbiAgICAgICAgdmFsID0gTWF0aC5yb3VuZCh2YWwgLyAxMDApICogMTAwO1xuXG4gICAgICAgIGxldCBhcnIgPSAodmFsICsgXCJcIikuc3BsaXQoXCJcIik7XG4gICAgICAgIGFyci5zcGxpY2UoNCwgMCwgXCIgXCIpO1xuICAgICAgICBhcnIuc3BsaWNlKDEsIDAsIFwiIFwiKTtcbiAgICAgICAgcmV0dXJuIGFyci5qb2luKFwiXCIpO1xuICAgICAgfTtcblxuXG4gICAgICBsZXQgY2hhbmdlUiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjaXJjbGUuc3R5bGUud2lkdGggPSByICsgXCJweFwiO1xuICAgICAgICBjaXJjbGUuc3R5bGUuaGVpZ2h0ID0gciArIFwicHhcIjtcbiAgICAgIH07XG5cbiAgICAgIGxldCBjaGFuZ2VUZXh0ID0gKCkgPT4gdGV4dEZlYWxkLmlubmVySFRNTCA9IHRleHQ7XG5cbiAgICAgIGxldCBjYWxjdWxldGVOZXdSID0gcGVyc2VudCA9PiBiYXNlUiArIGJhc2VSKnBlcnNlbnQgO1xuXG4gICAgICBsZXQgY2FsY3VsZXRlTmV3VmFsID0gcGVyc2VudCA9PiBiYXNlVmFsICsgYmFzZVZhbCpwZXJzZW50O1xuXG4gICAgICBsZXQgb25EcmFnID0gKGV2ZW50LCB1aSkgPT4ge1xuXG4gICAgICAgIGggPSB1aS5wb3NpdGlvbi50b3A7XG4gICAgICAgIGxldCBwZXJzZW50ICA9ICgxIC0gaCAvIDIzMCkgKiA1XG4gICAgICAgIHIgPSBjYWxjdWxldGVOZXdSKHBlcnNlbnQpO1xuICAgICAgICBzZWxlY3RlZFZhbCA9IGNhbGN1bGV0ZU5ld1ZhbChwZXJzZW50KVxuICAgICAgICB0ZXh0ID0gdmFsVG9UZXh0KHNlbGVjdGVkVmFsKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoYW5nZVIpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2hhbmdlVGV4dCk7XG4gICAgICAgIC8v0YfRgtC+INC30LDQv9C40YHRi9Cy0LDRgtGMINCyINGB0L7RgdGC0L7Rj9C90LjQtS4g0K3RgtC+INCy0L7QvtCx0YnQtSDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8/XG4gICAgICAgIHN0YXRlLnNlbGVjdGVkID0gaCAvIDIzMDtcbiAgICAgICAgZm4oKTtcbiAgICAgIH07XG5cbiAgICAgIGxldCBvbkRyYWdZID0gKGV2ZW50LCB1aSkgPT4ge1xuICAgICAgICBoID0gdWkucG9zaXRpb24ubGVmdDtcbiAgICAgICAgbGV0IHBlcnNlbnQgID0gKCBoIC8gMjMwKSAqIDVcbiAgICAgICAgciA9IGNhbGN1bGV0ZU5ld1IocGVyc2VudCk7XG4gICAgICAgIHNlbGVjdGVkVmFsID0gY2FsY3VsZXRlTmV3VmFsKHBlcnNlbnQpXG4gICAgICAgIHRleHQgPSB2YWxUb1RleHQoc2VsZWN0ZWRWYWwpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2hhbmdlUik7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShjaGFuZ2VUZXh0KTtcbiAgICAgICAgLy/Rh9GC0L4g0LfQsNC/0LjRgdGL0LLQsNGC0Ywg0LIg0YHQvtGB0YLQvtGP0L3QuNC1LiDQrdGC0L4g0LLQvtC+0LHRidC1INC40YHQv9C+0LvRjNC30YPQtdGC0YHRjz9cbiAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSBoIC8gMjMwO1xuICAgICAgICBmbigpO1xuICAgICAgfTtcblxuICAgICAgJChcIi52YWx1ZXBpY2tlci1tb2JpbGUtcGlja2VyXCIpLmRyYWdnYWJsZSh7XG4gICAgICAgIGNvbnRhaW5tZW50OiBcInBhcmVudFwiLFxuICAgICAgICBheGlzOiBcInhcIixcbiAgICAgICAgZHJhZzogb25EcmFnWSxcbiAgICAgIH0pO1xuXG4gICAgICAkKFwiLnZhbHVlcGlja2VyLXBpY2tlclwiKS5kcmFnZ2FibGUoe1xuICAgICAgICBjb250YWlubWVudDogXCJwYXJlbnRcIixcbiAgICAgICAgYXhpczogXCJ5XCIsXG4gICAgICAgIGRyYWc6IG9uRHJhZyxcbiAgICAgIH0pO1xuXG5cbiAgICAgIGxldCBpc1JpZ2h0ID0gKCkgPT4gKHNlbGVjdGVkVmFsID4gMzAwMDAwMCAmJiBzZWxlY3RlZFZhbCA8IDQwMDAwMDApXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzUmlnaHRcbiAgICAgIH1cbiAgICB9O1xuXG5cblxuICAgIGZ1bmN0aW9uIGhvb2tVcFZhbFF1ZXN0b24oaWQsIHF1ZXN0aW9uLCBWYWxQaWNrZXIsIEFuc3dlclNlbGVjdG9ycywgb25BbnN3ZXIpIHtcblxuICAgICAgbGV0IGFuc3dlckJ1dHRvbiA9IHF1ZXN0aW9uLmZpbmQoXCIuYW5zd2VyQnV0dG9uXCIpO1xuICAgICAgbGV0IGFuc3dlciA9ICQoQW5zd2VyU2VsZWN0b3JzKTtcbiAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xuXG5cbiAgICAgIGxldCBpbml0QW5zd2VycyA9ICgpID0+IHtcbiAgICAgICAgaGlkZUVsZW0oYW5zd2VyKVxuICAgICAgfTtcblxuICAgICAgbGV0IHNob3dBbnN3ZXJzID0gKCkgPT4ge1xuICAgICAgICBzaG93RWxlbShhbnN3ZXIpO1xuICAgICAgICBvbkFuc3dlciAmJiBvbkFuc3dlcigpO1xuICAgICAgICAvLyBzY3JvbGxUb0VsZW1DZW50ZXIoYW5zd2VyKVxuICAgICAgICBzY3JvbGxUb0VsZW1Ub3AoJCgkKFwiLmFuc3dlckJ1dHRvblwiKVtpZF0pKVxuICAgICAgfTtcblxuICAgICAgbGV0IGluaXRRdWVzdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaGlkZUVsZW0ocXVlc3Rpb24pO1xuICAgICAgfTtcblxuICAgICAgbGV0IHNob3dRdWVzdGluID0gKCkgPT4ge1xuICAgICAgICBzaG93RWxlbShxdWVzdGlvbilcbiAgICAgICAgLy8gc2Nyb2xsVG9FbGVtQ2VudGVyKHF1ZXN0aW9uKVxuICAgICAgICBzY3JvbGxUb0VsZW1Ub3AoJCgkKCcuZm9vdGVyJylbaWRdKSlcbiAgICAgIH07XG5cbiAgICAgIGxldCBzdGF0ZSA9IHtcbiAgICAgICAgc2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzQW5zd2VyZWQ6IGZhbHNlLFxuICAgICAgICByaWdodDogMTIsXG4gICAgICB9O1xuXG4gICAgICBsZXQgcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChzdGF0ZS5pc0Fuc3dlcmVkKSB7XG4gICAgICAgICAgcmVtb3ZlQnV0dG9uKCk7XG4gICAgICAgICAgd2luZG93LmRpc2FibGVTY3JvbGwgPSB0cnVlO1xuICAgICAgICAgIHNldFRpbWVvdXQoc2hvd0Fuc3dlcnMsIDEwMDApO1xuICAgICAgICAgIHF1ZXN0aW9uLmFkZENsYXNzKFwiYW5zd2VyZWRcIik7XG4gICAgICAgICAgc2lkZUJhcnMucmVuZGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHN0YXRlLnNlbGVjdGVkICE9PSBudWxsKSB7XG4gICAgICAgICAgYW5zd2VyQnV0dG9uLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgbGV0IHJlbW92ZUJ1dHRvbiA9ICgpID0+IHtcbiAgICAgICAgYW5zd2VyQnV0dG9uLmNzcyh7XG4gICAgICAgICAgb3BhY2l0eTogMCxcbiAgICAgICAgICBwb2ludGVyRXZlbnRzOiBcIm5vbmVcIlxuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGxldCB2YWxQaWNrZXIgPSBWYWxQaWNrZXIocmVuZGVyLCBzdGF0ZSk7XG5cbiAgICAgIGxldCB0aGF0ID0gdGhpcztcbiAgICAgIHRoaXMucmVzdWx0ID0gbnVsbDtcblxuICAgICAgLy9DbGljayBvbiBhbnN3ZXJcbiAgICAgIGFuc3dlckJ1dHRvbi5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgc3RhdGUuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgIHRoYXQucmVzdWx0ID0gdmFsUGlja2VyLmlzUmlnaHQoKVxuICAgICAgICByZW5kZXIoKTtcbiAgICAgIH0pO1xuXG4gICAgICAvL1Nob3cgcXVlc3Rpb25cbiAgICAgICQoJy5zY3JvbGxCdG4nKVtpZF0ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGF0LnNob3coKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5pbml0ID0gKCkgPT4ge1xuICAgICAgICBpbml0UXVlc3Rpb24oKTtcbiAgICAgICAgaW5pdEFuc3dlcnMoKTtcbiAgICAgIH1cblxuICAgICAgdGhpcy5zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNpZGVCYXJzLnNlbGVjdChpZCk7XG4gICAgICAgIGlmIChpZCA9PSAwKSB7XG4gICAgICAgICAgc2lkZUJhcnMuc2hvdygpXG4gICAgICAgIH1cbiAgICAgICAgc2hvd1F1ZXN0aW4oKTtcbiAgICAgICAgdGhpcy5pc1Nob3duID0gdHJ1ZTtcbiAgICAgIH1cblxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBob29rVXBRdWVzdG9uKGlkLCBxdWVzdGlvbiwgcmlnaHQsIEFuc3dlclNlbGVjdG9ycywgb25BbnN3ZXIpIHtcblxuXG4gICAgICBsZXQgYW5zd2VyQnV0dG9uID0gcXVlc3Rpb24uZmluZChcIi5hbnN3ZXJCdXR0b25cIik7XG4gICAgICBsZXQgYW5zd2VyID0gJChBbnN3ZXJTZWxlY3RvcnMpO1xuXG5cbiAgICAgIGxldCBpbml0QW5zd2VycyA9ICgpID0+IHtcbiAgICAgICAgaGlkZUVsZW0oYW5zd2VyKVxuICAgICAgfTtcblxuICAgICAgbGV0IHNob3dBbnN3ZXJzID0gKCkgPT4ge1xuICAgICAgICBzaG93RWxlbShhbnN3ZXIpO1xuICAgICAgICBvbkFuc3dlciAmJiBvbkFuc3dlcigpO1xuICAgICAgICAvLyBzY3JvbGxUb0VsZW1DZW50ZXIoYW5zd2VyKVxuICAgICAgICBzY3JvbGxUb0VsZW1Ub3AoJCgkKFwiLmFuc3dlckJ1dHRvblwiKVtpZF0pKVxuICAgICAgfTtcblxuICAgICAgbGV0IGluaXRRdWVzdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaGlkZUVsZW0ocXVlc3Rpb24pO1xuICAgICAgfTtcblxuXG4gICAgICBsZXQgc2hvd1F1ZXN0aW4gPSAoKSA9PiB7XG4gICAgICAgIHNob3dFbGVtKHF1ZXN0aW9uKTtcbiAgICAgICAgLy8gc2Nyb2xsVG9FbGVtQ2VudGVyKHF1ZXN0aW9uKTtcbiAgICAgICAgc2Nyb2xsVG9FbGVtVG9wKCQoJCgnLmZvb3RlcicpW2lkXSkpXG4gICAgICB9O1xuXG4gICAgICBsZXQgc3RhdGUgPSB7XG4gICAgICAgIHNlbGVjdGVkOiBudWxsLFxuICAgICAgICBpc0Fuc3dlcmVkOiBmYWxzZSxcbiAgICAgICAgcmlnaHQ6IHJpZ2h0LFxuICAgICAgfTtcblxuICAgICAgbGV0IHJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoc3RhdGUuaXNBbnN3ZXJlZCkge1xuICAgICAgICAgIHdpbmRvdy5kaXNhYmxlU2Nyb2xsID0gdHJ1ZTtcbiAgICAgICAgICByZW1vdmVCdXR0b24oKTtcbiAgICAgICAgICBzZXRUaW1lb3V0KHNob3dBbnN3ZXJzLCAxMDAwKTtcbiAgICAgICAgICBxdWVzdGlvbi5hZGRDbGFzcyhcImFuc3dlcmVkXCIpO1xuICAgICAgICAgIHNpZGVCYXJzLnJlbmRlcigpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChzdGF0ZS5zZWxlY3RlZCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgYW5zd2VyQnV0dG9uLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZW5kZXJPcHRpb25zKCk7XG4gICAgICB9O1xuXG4gICAgICBsZXQgb3B0aW9ucyA9IHF1ZXN0aW9uLmZpbmQoXCIuYW5zd2VycyAuaXRlbSAuZWxlbVwiKTtcblxuICAgICAgbGV0IHJlbmRlck9wdGlvbnMgPSAoKSA9PiB7XG4gICAgICAgIGlmICghc3RhdGUuaXNBbnN3ZXJlZCkge1xuICAgICAgICAgICQuZWFjaChvcHRpb25zLCBmdW5jdGlvbihpLCBlbGVtKSB7XG4gICAgICAgICAgICBpZiAoaSA9PSBzdGF0ZS5zZWxlY3RlZCkge1xuICAgICAgICAgICAgICAkKGVsZW0pLmFkZENsYXNzKFwic2VsZWN0ZWRcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAkKGVsZW0pLnJlbW92ZUNsYXNzKFwic2VsZWN0ZWRcIik7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKHN0YXRlLnNlbGVjdGVkICE9PSBzdGF0ZS5yaWdodCkge1xuICAgICAgICAgICAgb3B0aW9uc1tzdGF0ZS5zZWxlY3RlZF0uY2xhc3NMaXN0LmFkZChcIndyb25nXCIpO1xuICAgICAgICAgICAgb3B0aW9uc1tzdGF0ZS5zZWxlY3RlZF0uY2xhc3NMaXN0LnJlbW92ZShcInNlbGVjdGVkXCIpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBvcHRpb25zW3N0YXRlLnJpZ2h0XS5jbGFzc0xpc3QuYWRkKFwicmlnaHRcIik7XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICBsZXQgaW5pdE9wdGlvbnMgPSAoKSA9PiB7XG4gICAgICAgIGxldCBvblNlbGVjdCA9IChldmVudCkgPT4ge1xuICAgICAgICAgIHN0YXRlLnNlbGVjdGVkID0gcGFyc2VJbnQoZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmlkKTtcbiAgICAgICAgICByZW5kZXIoKTtcbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucy5vbihcImNsaWNrXCIsIG9uU2VsZWN0KTtcbiAgICAgIH07XG5cbiAgICAgIGxldCByZW1vdmVCdXR0b24gPSAoKSA9PiB7XG4gICAgICAgIGFuc3dlckJ1dHRvbi5jc3Moe1xuICAgICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgICAgcG9pbnRlckV2ZW50czogXCJub25lXCJcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XG4gICAgICB0aGlzLnJlc3VsdCA9IG51bGw7XG5cbiAgICAgIGFuc3dlckJ1dHRvbi5jbGljayhmdW5jdGlvbigpIHtcbiAgICAgICAgc3RhdGUuaXNBbnN3ZXJlZCA9IHRydWU7XG4gICAgICAgIHRoYXQucmVzdWx0ID0gc3RhdGUuc2VsZWN0ZWQgPT0gc3RhdGUucmlnaHRcbiAgICAgICAgcmVuZGVyKCk7XG4gICAgICB9KTtcblxuICAgICAgJCgnLnNjcm9sbEJ0bicpW2lkXS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoYXQuc2hvdygpO1xuICAgICAgfVxuXG4gICAgICBsZXQgaW5pdCA9ICgpID0+IHtcbiAgICAgICAgaW5pdE9wdGlvbnMoKTtcbiAgICAgICAgaW5pdFF1ZXN0aW9uKCk7XG4gICAgICAgIGluaXRBbnN3ZXJzKCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xuXG4gICAgICB0aGlzLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2lkZUJhcnMuc2VsZWN0KGlkKTtcbiAgICAgICAgaWYgKGlkID09IDApIHtcbiAgICAgICAgICBzaWRlQmFycy5zaG93KClcbiAgICAgICAgfVxuICAgICAgICBzaG93UXVlc3RpbigpO1xuICAgICAgICB0aGlzLmlzU2hvd24gPSB0cnVlO1xuICAgICAgfVxuICAgICAgdGhpcy5pbml0ID0gaW5pdDtcbiAgICB9O1xuXG5cblxuXG4gICAgbGV0IGdldERhdGFBbmRNYXAgPSBmdW5jdGlvbigpIHtcbiAgICAgICQoXCIubWFwX2JvZHlcIikubG9hZChcIm1hcC5zdmdcIiwgZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgICBsZXQgYmxvYiA9IG51bGw7XG4gICAgICAgICAgbGV0IHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuICAgICAgICAgIHhoci5vcGVuKFwiR0VUXCIsIFwiSElWX0RhdGFfYnlfcmVnLmNzdlwiKTtcbiAgICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJibG9iXCI7IC8vZm9yY2UgdGhlIEhUVFAgcmVzcG9uc2UsIHJlc3BvbnNlLXR5cGUgaGVhZGVyIHRvIGJlIGJsb2JcbiAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBibG9iID0geGhyLnJlc3BvbnNlOyAvL3hoci5yZXNwb25zZSBpcyBub3cgYSBibG9iIG9iamVjdFxuICAgICAgICAgICAgbXlSZWFkZXIucmVhZEFzVGV4dChibG9iKTtcbiAgICAgICAgICB9O1xuICAgICAgICAgIHhoci5zZW5kKCk7XG5cbiAgICAgICAgICBsZXQgbXlSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgICAgIG15UmVhZGVyLmFkZEV2ZW50TGlzdGVuZXIoXCJsb2FkZW5kXCIsIGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICAgICAgbGV0IGRhdGEgPSBuZXdEYXRhUHJvc2VlZChlLnNyY0VsZW1lbnQucmVzdWx0KTtcbiAgICAgICAgICAgIGxldCByZWdJbmZvID0gbmV3IFJlZ0luZm8oZGF0YSk7XG4gICAgICAgICAgICBsZXQgcmVnSW5mb01vYmlsZSA9IG5ldyBSZWdJbmZvTW9iaWxlKGRhdGEpXG4gICAgICAgICAgICByZWdJbmZvLmluaXQoKVxuICAgICAgICAgICAgcmVnSW5mby5yZW5kZXIoKTtcbiAgICAgICAgICAgIHJlZ0luZm9Nb2JpbGUuaW5pdCgpO1xuICAgICAgICAgICAgcmVnSW5mb01vYmlsZS5yZW5kZXIoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSlcbiAgICAgIH1cblxuICAgIGdldERhdGFBbmRNYXAoKTtcblxuICAgIC8vIGtleVJlYXNvbkNoYXJ0LnNob3coKTtcbiAgICAvLyBuZXdJbmZlY3RlZENoYXJ0TW9iaWxlLnNob3coKTtcblxuICAgIGxldCBmb290ZXIgPSBuZXcgRm9vdGVyKDcpO1xuXG5cbiAgICBsZXQgcXVpekVsZW1zID0gW1xuICAgICAgbmV3IGhvb2tVcFF1ZXN0b24oMCwgJChcIi5xdWVzdGlvbi1vbmVcIiksIDIsIFwiLnBsYXRlM1wiKSxcbiAgICAgIG5ldyBob29rVXBRdWVzdG9uKDEsICQoXCIucXVlc3Rpb24tdHdvXCIpLCAzLCBcIi5wbGF0ZTVcIiwgZ2V0RGF0YUFuZE1hcCksXG4gICAgICBuZXcgaG9va1VwUXVlc3RvbigyLCAkKFwiLnF1ZXN0aW9uLXRocmVlXCIpLCAyLCBcIi5hbnN3ZXItdGhyZWUsIC5wbGF0ZTYtYWZ0ZXJcIixcbiAgICAgICAgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgbmV3SW5mZWN0ZWRDaGFydC5zaG93KCk7XG4gICAgICAgICAgbmV3SW5mZWN0ZWRDaGFydE1vYmlsZS5zaG93KCk7XG4gICAgICAgIH0pLFxuICAgICAgbmV3IGhvb2tVcFZhbFF1ZXN0b24oMywgJChcIi5xdWVzdGlvbi1mb3VyXCIpLCB2YWxQaWNrZXIzLCBcIi5hbnN3ZXItZm91ciwgLnBsYXRlNy1hZnRlclwiKSxcbiAgICAgIG5ldyBob29rVXBWYWxRdWVzdG9uKDQsICQoXCIucXVlc3Rpb24tZml2ZVwiKSwgdmFsUGlja2VyMiwgXCIuYW5zd2VyLWZpdmVcIiwga2V5UmVhc29uQ2hhcnQuc2hvdyksXG4gICAgICBuZXcgaG9va1VwVmFsUXVlc3Rvbig1LCAkKFwiLnF1ZXN0aW9uLXNpeFwiKSwgdmFsUGlja2VyLCBcIi5hbnN3ZXItc2l4XCIpLFxuICAgICAgbmV3IGhvb2tVcFF1ZXN0b24oNiwgJChcIi5xdWVzdGlvbi1zZXZlblwiKSwgMSwgXCIuYW5zd2VyLXNldmVuLCAucGxhdGUxMC1hZnRlclwiKSxcbiAgICAgIGZvb3RlcixcbiAgICBdO1xuXG4gICAgbGV0IHNpZGVCYXJzID0gbmV3IFNpZGVCYXJzKHF1aXpFbGVtcyk7XG5cbiAgICBmb290ZXIuZWUub24oXCJzaG93XCIsIChlKT0+e1xuICAgICAgc2lkZUJhcnMuc2VsZWN0KGUpO1xuICAgICAgcmVuZGVyUmVzdWx0KCk7XG4gICAgfSlcblxuXG4gICAgcXVpekVsZW1zLmZvckVhY2goZWxlbSA9PiBlbGVtLmluaXQoKSk7XG5cblxuICAgIC8vIHF1aXpFbGVtcy5mb3JFYWNoKGVsZW0gPT4gZWxlbS5zaG93KCkpO1xuXG5cbiAgICBsZXQgcmVzdWx0cyA9IFt7XG4gICAgICB0ZXh0OiBcItCh0J/QmNCULCDQutCw0Log0LjQt9Cy0LXRgdGC0L3Qviwg0L3QtSDRgdC/0LjRgi4g0JAg0LLRiyDQv9C+0YfRgtC4INC90LjRh9C10LPQviDQviDQvdGR0Lwg0L3QtSDQt9C90LDQtdGC0LVcIixcbiAgICB9LCB7XG4gICAgICB0ZXh0OiBcItCa0LDQttC10YLRgdGPLCDQstGLLCDQv9C+INC60YDQsNC50L3QtdC5INC80LXRgNC1LCDQt9C90LDQtdGC0LUsINGH0LXQvCDQvtGC0LvQuNGH0LDQtdGC0YHRjyDQktCY0Kcg0L7RgiDQodCf0JjQlFwiLFxuICAgIH0sIHtcbiAgICAgIHRleHQ6IFwi0JLRiyDQvtGC0LvQuNGH0L3QviDRgNCw0LfQsdC40YDQsNC10YLQtdGB0Ywg0LIg0Y3RgtC+0Lkg0L3QtdCy0LXRgdGR0LvQvtC5INGC0LXQvNC1IVwiLFxuICAgIH0sIF1cblxuXG4gICAgbGV0IHJlbmRlclJlc3VsdCA9IGZ1bmN0aW9uKCkge1xuXG4gICAgICBsZXQgcmVzdWx0VmFsID0gcXVpekVsZW1zLnJlZHVjZSgodmFsLCBlKSA9PiB7XG4gICAgICAgIGlmIChlIGluc3RhbmNlb2YgaG9va1VwVmFsUXVlc3RvbiB8fCBlIGluc3RhbmNlb2YgaG9va1VwUXVlc3Rvbikge1xuICAgICAgICAgIHZhbCA9IChlLnJlc3VsdCkgPyB2YWwgKyAxIDogdmFsXG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbDtcbiAgICAgIH0sIDApXG5cbiAgICAgIGxldCByZXN1bHRUZXh0SWQgPSByZXN1bHRWYWwgPiA1ID8gMiA6IHJlc3VsdFZhbCA+IDMgPyAxIDogMDtcbiAgICAgIGxldCBvYmogPSByZXN1bHRzW3Jlc3VsdFRleHRJZF1cblxuICAgICAgJChcIi5wbGF0ZTExIC5yZXN1bHQgLmNvbW1lbnRcIikudGV4dChvYmoudGV4dClcbiAgICB9XG5cblxuICAgIGxldCBzaG93TmV4dCA9ICgpID0+IHtcbiAgICAgIGZvciAobGV0IGkgPSBxdWl6RWxlbXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgICAgbGV0IGUgPSBxdWl6RWxlbXNbaV07XG4gICAgICAgIGlmIChpID09IDAgJiYgIWUuaXNTaG93bikge1xuICAgICAgICAgIHF1aXpFbGVtc1tpXS5zaG93KCk7XG4gICAgICAgICAgc2lkZUJhcnMuc2hvdygpXG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlLmlzU2hvd24gJiYgZS5yZXN1bHQgIT09IG51bGwgJiYgaSA8IHF1aXpFbGVtcy5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgaWYgKCFxdWl6RWxlbXNbaSArIDFdLmlzU2hvd24pIHF1aXpFbGVtc1tpICsgMV0uc2hvdygpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuXG4gICAgbGV0IG9sZFNjcm9sbFBvc2l0b2luID0gd2luZG93LnBhZ2VZT2Zmc2V0IHx8IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxUb3A7XG5cbiAgICBhZGRNb3VzZWV3aGVlbEV2ZW50KGRvY3VtZW50LG9uV2hlZWwpXG5cbiAgICBmdW5jdGlvbiBvbldoZWVsKGUpIHtcbiAgICAgIGUgPSBlIHx8IHdpbmRvdy5ldmVudDtcblxuICAgICAgaWYgKHdpbmRvdy5kaXNhYmxlU2Nyb2xsKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiAoZS5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgbmV3U2Nyb2xsUG9zaXRvaW4gPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblxuICAgICAgLy8gd2hlZWxEZWx0YSDQvdC1INC00LDQtdGCINCy0L7Qt9C80L7QttC90L7RgdGC0Ywg0YPQt9C90LDRgtGMINC60L7Qu9C40YfQtdGB0YLQstC+INC/0LjQutGB0LXQu9C10LlcbiAgICAgIGxldCBkZWx0YSA9IGUuZGVsdGFZIHx8IGUuZGV0YWlsIHx8IGUud2hlZWxEZWx0YTtcblxuICAgICAgaWYgKG5ld1Njcm9sbFBvc2l0b2luID09IG9sZFNjcm9sbFBvc2l0b2luICYmIGRlbHRhID4gMTApIHtcbiAgICAgICAgc2hvd05leHQoKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IChlLnJldHVyblZhbHVlID0gZmFsc2UpO1xuICAgICAgfVxuICAgICAgaWYgKGRlbHRhID4gMTApIHtcbiAgICAgICAgb2xkU2Nyb2xsUG9zaXRvaW4gPSBuZXdTY3JvbGxQb3NpdG9pbjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG5cblxuICAkKFwiLnNoYXJlLWJ0biwgLnNoYXJlLWJ0bi1iaWdcIikuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgc2hhcmUodGhpcy5kYXRhc2V0Lm5ldHdvcmspO1xuICB9KVxuXG59KSgpO1xuIiwiaW1wb3J0IHtnZXRDb2xvck1ldGF9IGZyb20gXCIuL3V0aWxzXCI7XG5pbXBvcnQge25ld0luZmVjdGVkRGF0YX0gZnJvbSBcIi4vRGF0YS5qc1wiXG5cbmxldCBuZXdJbmZlY3RlZENoYXJ0ID0gKCgpID0+IHtcblxuICBsZXQgZGF0YSA9IG5ld0luZmVjdGVkRGF0YTtcblxuXG4gIGxldCBiYXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNoYXJ0Lm5ld0luZmVjdGVkIC5ib2R5IC5jYW52YXMgLmJhcicpO1xuXG5cbiAgbGV0IHN0YXJ0Q29sb3IgPSBbMjI4LCAxNTIsIDE1Ml07XG4gIGxldCBlbmRDb2xvciA9IFsxOTAsIDMyLCAzN107XG4gIGxldCBtYXggPSAxMDAgKiAxMDAwO1xuXG4gIGxldCBpID0gMDtcblxuICBsZXQgcmVuZGVybmV3SW5mZWN0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoaSA+PSBkYXRhLmxlbmd0aCkge1xuICAgICAgbGV0IGxhYmVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uZXdJbmZlY3RlZF9sYWJlbF90ZXh0Jyk7XG4gICAgICBbXS5mb3JFYWNoLmNhbGwobGFiZWxzLCBlbGVtID0+IGVsZW0uc3R5bGUub3BhY2l0eSA9IDAuOSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCB2YWwgPSBkYXRhW2ldO1xuICAgIGlmICh2YWwgPCA0MDAwKSB7XG4gICAgICBiYXJzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2IoMjQsMTc5LDE3MiknO1xuICAgICAgYmFyc1tpXS5zdHlsZS5tYXJnaW5Ub3AgPSAyNjAgKiAwLjk4ICsgXCJweFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgY29sb3IgPSBnZXRDb2xvck1ldGEoc3RhcnRDb2xvciwgZW5kQ29sb3IsIHZhbCAvIG1heCk7XG4gICAgICBiYXJzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGByZ2IoJHtjb2xvcn0pYDtcbiAgICAgIGJhcnNbaV0uc3R5bGUubWFyZ2luVG9wID0gKDEgLSB2YWwgLyBtYXgpICogMjYwICsgXCJweFwiO1xuICAgIH1cblxuICAgIGlmIChpID09IDMpIHtcbiAgICAgIGJhcnNbaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYigyNCwxNzksMTcyKSc7XG4gICAgfVxuXG4gICAgaSsrO1xuICAgIHNldFRpbWVvdXQocmVuZGVybmV3SW5mZWN0ZWQsIDMwKTtcbiAgfTtcblxuICBsZXQgc2hvdyA9ICgpID0+IHtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICByZW5kZXJuZXdJbmZlY3RlZCgpO1xuICAgIH0sIDEwMDApO1xuXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBzaG93XG4gIH1cblxufSkoKTtcblxuXG5leHBvcnQgZGVmYXVsdCBuZXdJbmZlY3RlZENoYXJ0O1xuIiwiXG5pbXBvcnQge2dldENvbG9yTWV0YX0gZnJvbSBcIi4vdXRpbHNcIjtcbmltcG9ydCB7bmV3SW5mZWN0ZWREYXRhfSBmcm9tIFwiLi9EYXRhLmpzXCJcblxuXG5sZXQgbmV3SW5mZWN0ZWRDaGFydE1vYmlsZSA9ICgoKSA9PiB7XG5cbiAgbGV0IGRhdGEgPSBuZXdJbmZlY3RlZERhdGE7XG5cblxuICBsZXQgYmFycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5jaGFydC5uZXdJbmZlY3RlZC1tb2JpbGUgLmJvZHkgLmNhbnZhcyAuYmxvY2snKTtcblxuXG4gIGxldCBzdGFydENvbG9yID0gWzIyOCwgMTUyLCAxNTJdO1xuICBsZXQgZW5kQ29sb3IgPSBbMTkwLCAzMiwgMzddO1xuICBsZXQgbWF4ID0gMTAwICogMTAwMDtcblxuICBsZXQgaSA9IDA7XG5cbiAgbGV0IHJlbmRlcm5ld0luZmVjdGVkID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKGkgPj0gZGF0YS5sZW5ndGgpIHtcbiAgICAgIGxldCBsYWJlbHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcubmV3SW5mZWN0ZWRfbGFiZWxfdGV4dCcpO1xuICAgICAgW10uZm9yRWFjaC5jYWxsKGxhYmVscywgZWxlbSA9PiBlbGVtLnN0eWxlLm9wYWNpdHkgPSAwLjkpO1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBsZXQgdmFsID0gZGF0YVtpXTtcbiAgICBpZiAodmFsIDwgNDAwMCkge1xuICAgICAgYmFyc1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiKDI0LDE3OSwxNzIpJztcbiAgICAgIGJhcnNbaV0uc3R5bGUubWFyZ2luTGVmdCA9IC0xOTAgKiAwLjk4ICsgXCJweFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgY29sb3IgPSBnZXRDb2xvck1ldGEoc3RhcnRDb2xvciwgZW5kQ29sb3IsIHZhbCAvIG1heCk7XG4gICAgICBiYXJzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9IGByZ2IoJHtjb2xvcn0pYDtcbiAgICAgIGJhcnNbaV0uc3R5bGUubWFyZ2luTGVmdCA9ICgwIC0gMTkwKSAqICgxIC0gdmFsIC8gbWF4KSArIFwicHhcIjtcbiAgICB9XG5cbiAgICBpZiAoaSA9PSAzKSB7XG4gICAgICBiYXJzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2IoMjQsMTc5LDE3MiknO1xuICAgIH1cblxuICAgIGkrKztcbiAgICBzZXRUaW1lb3V0KHJlbmRlcm5ld0luZmVjdGVkLCAzMCk7XG4gIH07XG5cbiAgbGV0IHNob3cgPSAoKSA9PiB7XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgcmVuZGVybmV3SW5mZWN0ZWQoKTtcbiAgICB9LCAxMDAwKTtcblxuICB9O1xuXG4gIHJldHVybiB7XG4gICAgc2hvd1xuICB9XG5cbn0pKCk7XG5cbmV4cG9ydCBkZWZhdWx0ICBuZXdJbmZlY3RlZENoYXJ0TW9iaWxlO1xuIiwiLyohXG4gKiBFdmVudEVtaXR0ZXIgdjUuMS4wIC0gZ2l0LmlvL2VlXG4gKiBVbmxpY2Vuc2UgLSBodHRwOi8vdW5saWNlbnNlLm9yZy9cbiAqIE9saXZlciBDYWxkd2VsbCAtIGh0dHA6Ly9vbGkubWUudWsvXG4gKiBAcHJlc2VydmVcbiAqL1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuXG4gICAgLyoqXG4gICAgICogQ2xhc3MgZm9yIG1hbmFnaW5nIGV2ZW50cy5cbiAgICAgKiBDYW4gYmUgZXh0ZW5kZWQgdG8gcHJvdmlkZSBldmVudCBmdW5jdGlvbmFsaXR5IGluIG90aGVyIGNsYXNzZXMuXG4gICAgICpcbiAgICAgKiBAY2xhc3MgRXZlbnRFbWl0dGVyIE1hbmFnZXMgZXZlbnQgcmVnaXN0ZXJpbmcgYW5kIGVtaXR0aW5nLlxuICAgICAqL1xuICAgIGZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHt9XG5cbiAgICAvLyBTaG9ydGN1dHMgdG8gaW1wcm92ZSBzcGVlZCBhbmQgc2l6ZVxuICAgIHZhciBwcm90byA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGU7XG4gICAgdmFyIG9yaWdpbmFsR2xvYmFsVmFsdWUgPSBleHBvcnRzLkV2ZW50RW1pdHRlcjtcblxuICAgIC8qKlxuICAgICAqIEZpbmRzIHRoZSBpbmRleCBvZiB0aGUgbGlzdGVuZXIgZm9yIHRoZSBldmVudCBpbiBpdHMgc3RvcmFnZSBhcnJheS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gbGlzdGVuZXJzIEFycmF5IG9mIGxpc3RlbmVycyB0byBzZWFyY2ggdGhyb3VnaC5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gbG9vayBmb3IuXG4gICAgICogQHJldHVybiB7TnVtYmVyfSBJbmRleCBvZiB0aGUgc3BlY2lmaWVkIGxpc3RlbmVyLCAtMSBpZiBub3QgZm91bmRcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBpbmRleE9mTGlzdGVuZXIobGlzdGVuZXJzLCBsaXN0ZW5lcikge1xuICAgICAgICB2YXIgaSA9IGxpc3RlbmVycy5sZW5ndGg7XG4gICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgIGlmIChsaXN0ZW5lcnNbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gLTE7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxpYXMgYSBtZXRob2Qgd2hpbGUga2VlcGluZyB0aGUgY29udGV4dCBjb3JyZWN0LCB0byBhbGxvdyBmb3Igb3ZlcndyaXRpbmcgb2YgdGFyZ2V0IG1ldGhvZC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSB0YXJnZXQgbWV0aG9kLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBUaGUgYWxpYXNlZCBtZXRob2RcbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBmdW5jdGlvbiBhbGlhcyhuYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBhbGlhc0Nsb3N1cmUoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpc1tuYW1lXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIGxpc3RlbmVyIGFycmF5IGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFdpbGwgaW5pdGlhbGlzZSB0aGUgZXZlbnQgb2JqZWN0IGFuZCBsaXN0ZW5lciBhcnJheXMgaWYgcmVxdWlyZWQuXG4gICAgICogV2lsbCByZXR1cm4gYW4gb2JqZWN0IGlmIHlvdSB1c2UgYSByZWdleCBzZWFyY2guIFRoZSBvYmplY3QgY29udGFpbnMga2V5cyBmb3IgZWFjaCBtYXRjaGVkIGV2ZW50LiBTbyAvYmFbcnpdLyBtaWdodCByZXR1cm4gYW4gb2JqZWN0IGNvbnRhaW5pbmcgYmFyIGFuZCBiYXouIEJ1dCBvbmx5IGlmIHlvdSBoYXZlIGVpdGhlciBkZWZpbmVkIHRoZW0gd2l0aCBkZWZpbmVFdmVudCBvciBhZGRlZCBzb21lIGxpc3RlbmVycyB0byB0aGVtLlxuICAgICAqIEVhY2ggcHJvcGVydHkgaW4gdGhlIG9iamVjdCByZXNwb25zZSBpcyBhbiBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byByZXR1cm4gdGhlIGxpc3RlbmVycyBmcm9tLlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9uW118T2JqZWN0fSBBbGwgbGlzdGVuZXIgZnVuY3Rpb25zIGZvciB0aGUgZXZlbnQuXG4gICAgICovXG4gICAgcHJvdG8uZ2V0TGlzdGVuZXJzID0gZnVuY3Rpb24gZ2V0TGlzdGVuZXJzKGV2dCkge1xuICAgICAgICB2YXIgZXZlbnRzID0gdGhpcy5fZ2V0RXZlbnRzKCk7XG4gICAgICAgIHZhciByZXNwb25zZTtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICAvLyBSZXR1cm4gYSBjb25jYXRlbmF0ZWQgYXJyYXkgb2YgYWxsIG1hdGNoaW5nIGV2ZW50cyBpZlxuICAgICAgICAvLyB0aGUgc2VsZWN0b3IgaXMgYSByZWd1bGFyIGV4cHJlc3Npb24uXG4gICAgICAgIGlmIChldnQgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJlc3BvbnNlID0ge307XG4gICAgICAgICAgICBmb3IgKGtleSBpbiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGtleSkgJiYgZXZ0LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICByZXNwb25zZVtrZXldID0gZXZlbnRzW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSBldmVudHNbZXZ0XSB8fCAoZXZlbnRzW2V2dF0gPSBbXSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2U7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFRha2VzIGEgbGlzdCBvZiBsaXN0ZW5lciBvYmplY3RzIGFuZCBmbGF0dGVucyBpdCBpbnRvIGEgbGlzdCBvZiBsaXN0ZW5lciBmdW5jdGlvbnMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge09iamVjdFtdfSBsaXN0ZW5lcnMgUmF3IGxpc3RlbmVyIG9iamVjdHMuXG4gICAgICogQHJldHVybiB7RnVuY3Rpb25bXX0gSnVzdCB0aGUgbGlzdGVuZXIgZnVuY3Rpb25zLlxuICAgICAqL1xuICAgIHByb3RvLmZsYXR0ZW5MaXN0ZW5lcnMgPSBmdW5jdGlvbiBmbGF0dGVuTGlzdGVuZXJzKGxpc3RlbmVycykge1xuICAgICAgICB2YXIgZmxhdExpc3RlbmVycyA9IFtdO1xuICAgICAgICB2YXIgaTtcblxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBmbGF0TGlzdGVuZXJzLnB1c2gobGlzdGVuZXJzW2ldLmxpc3RlbmVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmbGF0TGlzdGVuZXJzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSByZXF1ZXN0ZWQgbGlzdGVuZXJzIHZpYSBnZXRMaXN0ZW5lcnMgYnV0IHdpbGwgYWx3YXlzIHJldHVybiB0aGUgcmVzdWx0cyBpbnNpZGUgYW4gb2JqZWN0LiBUaGlzIGlzIG1haW5seSBmb3IgaW50ZXJuYWwgdXNlIGJ1dCBvdGhlcnMgbWF5IGZpbmQgaXQgdXNlZnVsLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gcmV0dXJuIHRoZSBsaXN0ZW5lcnMgZnJvbS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEFsbCBsaXN0ZW5lciBmdW5jdGlvbnMgZm9yIGFuIGV2ZW50IGluIGFuIG9iamVjdC5cbiAgICAgKi9cbiAgICBwcm90by5nZXRMaXN0ZW5lcnNBc09iamVjdCA9IGZ1bmN0aW9uIGdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCkge1xuICAgICAgICB2YXIgbGlzdGVuZXJzID0gdGhpcy5nZXRMaXN0ZW5lcnMoZXZ0KTtcbiAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG4gICAgICAgIGlmIChsaXN0ZW5lcnMgaW5zdGFuY2VvZiBBcnJheSkge1xuICAgICAgICAgICAgcmVzcG9uc2UgPSB7fTtcbiAgICAgICAgICAgIHJlc3BvbnNlW2V2dF0gPSBsaXN0ZW5lcnM7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gcmVzcG9uc2UgfHwgbGlzdGVuZXJzO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiBpc1ZhbGlkTGlzdGVuZXIgKGxpc3RlbmVyKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbGlzdGVuZXIgPT09ICdmdW5jdGlvbicgfHwgbGlzdGVuZXIgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgICAgICAgIHJldHVybiB0cnVlXG4gICAgICAgIH0gZWxzZSBpZiAobGlzdGVuZXIgJiYgdHlwZW9mIGxpc3RlbmVyID09PSAnb2JqZWN0Jykge1xuICAgICAgICAgICAgcmV0dXJuIGlzVmFsaWRMaXN0ZW5lcihsaXN0ZW5lci5saXN0ZW5lcilcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWRkcyBhIGxpc3RlbmVyIGZ1bmN0aW9uIHRvIHRoZSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogVGhlIGxpc3RlbmVyIHdpbGwgbm90IGJlIGFkZGVkIGlmIGl0IGlzIGEgZHVwbGljYXRlLlxuICAgICAqIElmIHRoZSBsaXN0ZW5lciByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgaXQgaXMgY2FsbGVkLlxuICAgICAqIElmIHlvdSBwYXNzIGEgcmVndWxhciBleHByZXNzaW9uIGFzIHRoZSBldmVudCBuYW1lIHRoZW4gdGhlIGxpc3RlbmVyIHdpbGwgYmUgYWRkZWQgdG8gYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBldnQgTmFtZSBvZiB0aGUgZXZlbnQgdG8gYXR0YWNoIHRoZSBsaXN0ZW5lciB0by5cbiAgICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBsaXN0ZW5lciBNZXRob2QgdG8gYmUgY2FsbGVkIHdoZW4gdGhlIGV2ZW50IGlzIGVtaXR0ZWQuIElmIHRoZSBmdW5jdGlvbiByZXR1cm5zIHRydWUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWQgYWZ0ZXIgY2FsbGluZy5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uIGFkZExpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcbiAgICAgICAgaWYgKCFpc1ZhbGlkTGlzdGVuZXIobGlzdGVuZXIpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBsaXN0ZW5lcnMgPSB0aGlzLmdldExpc3RlbmVyc0FzT2JqZWN0KGV2dCk7XG4gICAgICAgIHZhciBsaXN0ZW5lcklzV3JhcHBlZCA9IHR5cGVvZiBsaXN0ZW5lciA9PT0gJ29iamVjdCc7XG4gICAgICAgIHZhciBrZXk7XG5cbiAgICAgICAgZm9yIChrZXkgaW4gbGlzdGVuZXJzKSB7XG4gICAgICAgICAgICBpZiAobGlzdGVuZXJzLmhhc093blByb3BlcnR5KGtleSkgJiYgaW5kZXhPZkxpc3RlbmVyKGxpc3RlbmVyc1trZXldLCBsaXN0ZW5lcikgPT09IC0xKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzW2tleV0ucHVzaChsaXN0ZW5lcklzV3JhcHBlZCA/IGxpc3RlbmVyIDoge1xuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICAgICAgICAgIG9uY2U6IGZhbHNlXG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgYWRkTGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcm90by5vbiA9IGFsaWFzKCdhZGRMaXN0ZW5lcicpO1xuXG4gICAgLyoqXG4gICAgICogU2VtaS1hbGlhcyBvZiBhZGRMaXN0ZW5lci4gSXQgd2lsbCBhZGQgYSBsaXN0ZW5lciB0aGF0IHdpbGwgYmVcbiAgICAgKiBhdXRvbWF0aWNhbGx5IHJlbW92ZWQgYWZ0ZXIgaXRzIGZpcnN0IGV4ZWN1dGlvbi5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGF0dGFjaCB0aGUgbGlzdGVuZXIgdG8uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSBldmVudCBpcyBlbWl0dGVkLiBJZiB0aGUgZnVuY3Rpb24gcmV0dXJucyB0cnVlIHRoZW4gaXQgd2lsbCBiZSByZW1vdmVkIGFmdGVyIGNhbGxpbmcuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uYWRkT25jZUxpc3RlbmVyID0gZnVuY3Rpb24gYWRkT25jZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuYWRkTGlzdGVuZXIoZXZ0LCB7XG4gICAgICAgICAgICBsaXN0ZW5lcjogbGlzdGVuZXIsXG4gICAgICAgICAgICBvbmNlOiB0cnVlXG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBhZGRPbmNlTGlzdGVuZXIuXG4gICAgICovXG4gICAgcHJvdG8ub25jZSA9IGFsaWFzKCdhZGRPbmNlTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIERlZmluZXMgYW4gZXZlbnQgbmFtZS4gVGhpcyBpcyByZXF1aXJlZCBpZiB5b3Ugd2FudCB0byB1c2UgYSByZWdleCB0byBhZGQgYSBsaXN0ZW5lciB0byBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gSWYgeW91IGRvbid0IGRvIHRoaXMgdGhlbiBob3cgZG8geW91IGV4cGVjdCBpdCB0byBrbm93IHdoYXQgZXZlbnQgdG8gYWRkIHRvPyBTaG91bGQgaXQganVzdCBhZGQgdG8gZXZlcnkgcG9zc2libGUgbWF0Y2ggZm9yIGEgcmVnZXg/IE5vLiBUaGF0IGlzIHNjYXJ5IGFuZCBiYWQuXG4gICAgICogWW91IG5lZWQgdG8gdGVsbCBpdCB3aGF0IGV2ZW50IG5hbWVzIHNob3VsZCBiZSBtYXRjaGVkIGJ5IGEgcmVnZXguXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ30gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGNyZWF0ZS5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5kZWZpbmVFdmVudCA9IGZ1bmN0aW9uIGRlZmluZUV2ZW50KGV2dCkge1xuICAgICAgICB0aGlzLmdldExpc3RlbmVycyhldnQpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogVXNlcyBkZWZpbmVFdmVudCB0byBkZWZpbmUgbXVsdGlwbGUgZXZlbnRzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmdbXX0gZXZ0cyBBbiBhcnJheSBvZiBldmVudCBuYW1lcyB0byBkZWZpbmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8uZGVmaW5lRXZlbnRzID0gZnVuY3Rpb24gZGVmaW5lRXZlbnRzKGV2dHMpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBldnRzLmxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmRlZmluZUV2ZW50KGV2dHNbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGEgbGlzdGVuZXIgZnVuY3Rpb24gZnJvbSB0aGUgc3BlY2lmaWVkIGV2ZW50LlxuICAgICAqIFdoZW4gcGFzc2VkIGEgcmVndWxhciBleHByZXNzaW9uIGFzIHRoZSBldmVudCBuYW1lLCBpdCB3aWxsIHJlbW92ZSB0aGUgbGlzdGVuZXIgZnJvbSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xSZWdFeHB9IGV2dCBOYW1lIG9mIHRoZSBldmVudCB0byByZW1vdmUgdGhlIGxpc3RlbmVyIGZyb20uXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbn0gbGlzdGVuZXIgTWV0aG9kIHRvIHJlbW92ZSBmcm9tIHRoZSBldmVudC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVMaXN0ZW5lciA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVyKGV2dCwgbGlzdGVuZXIpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVycyA9IHRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KTtcbiAgICAgICAgdmFyIGluZGV4O1xuICAgICAgICB2YXIga2V5O1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVycykge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVycy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgaW5kZXggPSBpbmRleE9mTGlzdGVuZXIobGlzdGVuZXJzW2tleV0sIGxpc3RlbmVyKTtcblxuICAgICAgICAgICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgbGlzdGVuZXJzW2tleV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWxpYXMgb2YgcmVtb3ZlTGlzdGVuZXJcbiAgICAgKi9cbiAgICBwcm90by5vZmYgPSBhbGlhcygncmVtb3ZlTGlzdGVuZXInKTtcblxuICAgIC8qKlxuICAgICAqIEFkZHMgbGlzdGVuZXJzIGluIGJ1bGsgdXNpbmcgdGhlIG1hbmlwdWxhdGVMaXN0ZW5lcnMgbWV0aG9kLlxuICAgICAqIElmIHlvdSBwYXNzIGFuIG9iamVjdCBhcyB0aGUgc2Vjb25kIGFyZ3VtZW50IHlvdSBjYW4gYWRkIHRvIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBUaGUgb2JqZWN0IHNob3VsZCBjb250YWluIGtleSB2YWx1ZSBwYWlycyBvZiBldmVudHMgYW5kIGxpc3RlbmVycyBvciBsaXN0ZW5lciBhcnJheXMuIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSBhZGRlZC5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBpdCBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBhZGQgdGhlIGFycmF5IG9mIGxpc3RlbmVycyB0byBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICogWWVhaCwgdGhpcyBmdW5jdGlvbiBkb2VzIHF1aXRlIGEgYml0LiBUaGF0J3MgcHJvYmFibHkgYSBiYWQgdGhpbmcuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R8UmVnRXhwfSBldnQgQW4gZXZlbnQgbmFtZSBpZiB5b3Ugd2lsbCBwYXNzIGFuIGFycmF5IG9mIGxpc3RlbmVycyBuZXh0LiBBbiBvYmplY3QgaWYgeW91IHdpc2ggdG8gYWRkIHRvIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIGFkZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5hZGRMaXN0ZW5lcnMgPSBmdW5jdGlvbiBhZGRMaXN0ZW5lcnMoZXZ0LCBsaXN0ZW5lcnMpIHtcbiAgICAgICAgLy8gUGFzcyB0aHJvdWdoIHRvIG1hbmlwdWxhdGVMaXN0ZW5lcnNcbiAgICAgICAgcmV0dXJuIHRoaXMubWFuaXB1bGF0ZUxpc3RlbmVycyhmYWxzZSwgZXZ0LCBsaXN0ZW5lcnMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmVzIGxpc3RlbmVycyBpbiBidWxrIHVzaW5nIHRoZSBtYW5pcHVsYXRlTGlzdGVuZXJzIG1ldGhvZC5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIHJlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLiBUaGUgb2JqZWN0IHNob3VsZCBjb250YWluIGtleSB2YWx1ZSBwYWlycyBvZiBldmVudHMgYW5kIGxpc3RlbmVycyBvciBsaXN0ZW5lciBhcnJheXMuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYW4gZXZlbnQgbmFtZSBhbmQgYW4gYXJyYXkgb2YgbGlzdGVuZXJzIHRvIGJlIHJlbW92ZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgaXQgYSByZWd1bGFyIGV4cHJlc3Npb24gdG8gcmVtb3ZlIHRoZSBsaXN0ZW5lcnMgZnJvbSBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R8UmVnRXhwfSBldnQgQW4gZXZlbnQgbmFtZSBpZiB5b3Ugd2lsbCBwYXNzIGFuIGFycmF5IG9mIGxpc3RlbmVycyBuZXh0LiBBbiBvYmplY3QgaWYgeW91IHdpc2ggdG8gcmVtb3ZlIGZyb20gbXVsdGlwbGUgZXZlbnRzIGF0IG9uY2UuXG4gICAgICogQHBhcmFtIHtGdW5jdGlvbltdfSBbbGlzdGVuZXJzXSBBbiBvcHRpb25hbCBhcnJheSBvZiBsaXN0ZW5lciBmdW5jdGlvbnMgdG8gcmVtb3ZlLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnJlbW92ZUxpc3RlbmVycyA9IGZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVycyhldnQsIGxpc3RlbmVycykge1xuICAgICAgICAvLyBQYXNzIHRocm91Z2ggdG8gbWFuaXB1bGF0ZUxpc3RlbmVyc1xuICAgICAgICByZXR1cm4gdGhpcy5tYW5pcHVsYXRlTGlzdGVuZXJzKHRydWUsIGV2dCwgbGlzdGVuZXJzKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogRWRpdHMgbGlzdGVuZXJzIGluIGJ1bGsuIFRoZSBhZGRMaXN0ZW5lcnMgYW5kIHJlbW92ZUxpc3RlbmVycyBtZXRob2RzIGJvdGggdXNlIHRoaXMgdG8gZG8gdGhlaXIgam9iLiBZb3Ugc2hvdWxkIHJlYWxseSB1c2UgdGhvc2UgaW5zdGVhZCwgdGhpcyBpcyBhIGxpdHRsZSBsb3dlciBsZXZlbC5cbiAgICAgKiBUaGUgZmlyc3QgYXJndW1lbnQgd2lsbCBkZXRlcm1pbmUgaWYgdGhlIGxpc3RlbmVycyBhcmUgcmVtb3ZlZCAodHJ1ZSkgb3IgYWRkZWQgKGZhbHNlKS5cbiAgICAgKiBJZiB5b3UgcGFzcyBhbiBvYmplY3QgYXMgdGhlIHNlY29uZCBhcmd1bWVudCB5b3UgY2FuIGFkZC9yZW1vdmUgZnJvbSBtdWx0aXBsZSBldmVudHMgYXQgb25jZS4gVGhlIG9iamVjdCBzaG91bGQgY29udGFpbiBrZXkgdmFsdWUgcGFpcnMgb2YgZXZlbnRzIGFuZCBsaXN0ZW5lcnMgb3IgbGlzdGVuZXIgYXJyYXlzLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGFuIGV2ZW50IG5hbWUgYW5kIGFuIGFycmF5IG9mIGxpc3RlbmVycyB0byBiZSBhZGRlZC9yZW1vdmVkLlxuICAgICAqIFlvdSBjYW4gYWxzbyBwYXNzIGl0IGEgcmVndWxhciBleHByZXNzaW9uIHRvIG1hbmlwdWxhdGUgdGhlIGxpc3RlbmVycyBvZiBhbGwgZXZlbnRzIHRoYXQgbWF0Y2ggaXQuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge0Jvb2xlYW59IHJlbW92ZSBUcnVlIGlmIHlvdSB3YW50IHRvIHJlbW92ZSBsaXN0ZW5lcnMsIGZhbHNlIGlmIHlvdSB3YW50IHRvIGFkZC5cbiAgICAgKiBAcGFyYW0ge1N0cmluZ3xPYmplY3R8UmVnRXhwfSBldnQgQW4gZXZlbnQgbmFtZSBpZiB5b3Ugd2lsbCBwYXNzIGFuIGFycmF5IG9mIGxpc3RlbmVycyBuZXh0LiBBbiBvYmplY3QgaWYgeW91IHdpc2ggdG8gYWRkL3JlbW92ZSBmcm9tIG11bHRpcGxlIGV2ZW50cyBhdCBvbmNlLlxuICAgICAqIEBwYXJhbSB7RnVuY3Rpb25bXX0gW2xpc3RlbmVyc10gQW4gb3B0aW9uYWwgYXJyYXkgb2YgbGlzdGVuZXIgZnVuY3Rpb25zIHRvIGFkZC9yZW1vdmUuXG4gICAgICogQHJldHVybiB7T2JqZWN0fSBDdXJyZW50IGluc3RhbmNlIG9mIEV2ZW50RW1pdHRlciBmb3IgY2hhaW5pbmcuXG4gICAgICovXG4gICAgcHJvdG8ubWFuaXB1bGF0ZUxpc3RlbmVycyA9IGZ1bmN0aW9uIG1hbmlwdWxhdGVMaXN0ZW5lcnMocmVtb3ZlLCBldnQsIGxpc3RlbmVycykge1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIHZhbHVlO1xuICAgICAgICB2YXIgc2luZ2xlID0gcmVtb3ZlID8gdGhpcy5yZW1vdmVMaXN0ZW5lciA6IHRoaXMuYWRkTGlzdGVuZXI7XG4gICAgICAgIHZhciBtdWx0aXBsZSA9IHJlbW92ZSA/IHRoaXMucmVtb3ZlTGlzdGVuZXJzIDogdGhpcy5hZGRMaXN0ZW5lcnM7XG5cbiAgICAgICAgLy8gSWYgZXZ0IGlzIGFuIG9iamVjdCB0aGVuIHBhc3MgZWFjaCBvZiBpdHMgcHJvcGVydGllcyB0byB0aGlzIG1ldGhvZFxuICAgICAgICBpZiAodHlwZW9mIGV2dCA9PT0gJ29iamVjdCcgJiYgIShldnQgaW5zdGFuY2VvZiBSZWdFeHApKSB7XG4gICAgICAgICAgICBmb3IgKGkgaW4gZXZ0KSB7XG4gICAgICAgICAgICAgICAgaWYgKGV2dC5oYXNPd25Qcm9wZXJ0eShpKSAmJiAodmFsdWUgPSBldnRbaV0pKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIFBhc3MgdGhlIHNpbmdsZSBsaXN0ZW5lciBzdHJhaWdodCB0aHJvdWdoIHRvIHRoZSBzaW5ndWxhciBtZXRob2RcbiAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlLmNhbGwodGhpcywgaSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHBhc3MgYmFjayB0byB0aGUgbXVsdGlwbGUgZnVuY3Rpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIG11bHRpcGxlLmNhbGwodGhpcywgaSwgdmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gU28gZXZ0IG11c3QgYmUgYSBzdHJpbmdcbiAgICAgICAgICAgIC8vIEFuZCBsaXN0ZW5lcnMgbXVzdCBiZSBhbiBhcnJheSBvZiBsaXN0ZW5lcnNcbiAgICAgICAgICAgIC8vIExvb3Agb3ZlciBpdCBhbmQgcGFzcyBlYWNoIG9uZSB0byB0aGUgbXVsdGlwbGUgbWV0aG9kXG4gICAgICAgICAgICBpID0gbGlzdGVuZXJzLmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChpLS0pIHtcbiAgICAgICAgICAgICAgICBzaW5nbGUuY2FsbCh0aGlzLCBldnQsIGxpc3RlbmVyc1tpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogUmVtb3ZlcyBhbGwgbGlzdGVuZXJzIGZyb20gYSBzcGVjaWZpZWQgZXZlbnQuXG4gICAgICogSWYgeW91IGRvIG5vdCBzcGVjaWZ5IGFuIGV2ZW50IHRoZW4gYWxsIGxpc3RlbmVycyB3aWxsIGJlIHJlbW92ZWQuXG4gICAgICogVGhhdCBtZWFucyBldmVyeSBldmVudCB3aWxsIGJlIGVtcHRpZWQuXG4gICAgICogWW91IGNhbiBhbHNvIHBhc3MgYSByZWdleCB0byByZW1vdmUgYWxsIGV2ZW50cyB0aGF0IG1hdGNoIGl0LlxuICAgICAqXG4gICAgICogQHBhcmFtIHtTdHJpbmd8UmVnRXhwfSBbZXZ0XSBPcHRpb25hbCBuYW1lIG9mIHRoZSBldmVudCB0byByZW1vdmUgYWxsIGxpc3RlbmVycyBmb3IuIFdpbGwgcmVtb3ZlIGZyb20gZXZlcnkgZXZlbnQgaWYgbm90IHBhc3NlZC5cbiAgICAgKiBAcmV0dXJuIHtPYmplY3R9IEN1cnJlbnQgaW5zdGFuY2Ugb2YgRXZlbnRFbWl0dGVyIGZvciBjaGFpbmluZy5cbiAgICAgKi9cbiAgICBwcm90by5yZW1vdmVFdmVudCA9IGZ1bmN0aW9uIHJlbW92ZUV2ZW50KGV2dCkge1xuICAgICAgICB2YXIgdHlwZSA9IHR5cGVvZiBldnQ7XG4gICAgICAgIHZhciBldmVudHMgPSB0aGlzLl9nZXRFdmVudHMoKTtcbiAgICAgICAgdmFyIGtleTtcblxuICAgICAgICAvLyBSZW1vdmUgZGlmZmVyZW50IHRoaW5ncyBkZXBlbmRpbmcgb24gdGhlIHN0YXRlIG9mIGV2dFxuICAgICAgICBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgIC8vIFJlbW92ZSBhbGwgbGlzdGVuZXJzIGZvciB0aGUgc3BlY2lmaWVkIGV2ZW50XG4gICAgICAgICAgICBkZWxldGUgZXZlbnRzW2V2dF07XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZXZ0IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgICAgICAgICAvLyBSZW1vdmUgYWxsIGV2ZW50cyBtYXRjaGluZyB0aGUgcmVnZXguXG4gICAgICAgICAgICBmb3IgKGtleSBpbiBldmVudHMpIHtcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzLmhhc093blByb3BlcnR5KGtleSkgJiYgZXZ0LnRlc3Qoa2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBkZWxldGUgZXZlbnRzW2tleV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gUmVtb3ZlIGFsbCBsaXN0ZW5lcnMgaW4gYWxsIGV2ZW50c1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX2V2ZW50cztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiByZW1vdmVFdmVudC5cbiAgICAgKlxuICAgICAqIEFkZGVkIHRvIG1pcnJvciB0aGUgbm9kZSBBUEkuXG4gICAgICovXG4gICAgcHJvdG8ucmVtb3ZlQWxsTGlzdGVuZXJzID0gYWxpYXMoJ3JlbW92ZUV2ZW50Jyk7XG5cbiAgICAvKipcbiAgICAgKiBFbWl0cyBhbiBldmVudCBvZiB5b3VyIGNob2ljZS5cbiAgICAgKiBXaGVuIGVtaXR0ZWQsIGV2ZXJ5IGxpc3RlbmVyIGF0dGFjaGVkIHRvIHRoYXQgZXZlbnQgd2lsbCBiZSBleGVjdXRlZC5cbiAgICAgKiBJZiB5b3UgcGFzcyB0aGUgb3B0aW9uYWwgYXJndW1lbnQgYXJyYXkgdGhlbiB0aG9zZSBhcmd1bWVudHMgd2lsbCBiZSBwYXNzZWQgdG8gZXZlcnkgbGlzdGVuZXIgdXBvbiBleGVjdXRpb24uXG4gICAgICogQmVjYXVzZSBpdCB1c2VzIGBhcHBseWAsIHlvdXIgYXJyYXkgb2YgYXJndW1lbnRzIHdpbGwgYmUgcGFzc2VkIGFzIGlmIHlvdSB3cm90ZSB0aGVtIG91dCBzZXBhcmF0ZWx5LlxuICAgICAqIFNvIHRoZXkgd2lsbCBub3QgYXJyaXZlIHdpdGhpbiB0aGUgYXJyYXkgb24gdGhlIG90aGVyIHNpZGUsIHRoZXkgd2lsbCBiZSBzZXBhcmF0ZS5cbiAgICAgKiBZb3UgY2FuIGFsc28gcGFzcyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiB0byBlbWl0IHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGVtaXQgYW5kIGV4ZWN1dGUgbGlzdGVuZXJzIGZvci5cbiAgICAgKiBAcGFyYW0ge0FycmF5fSBbYXJnc10gT3B0aW9uYWwgYXJyYXkgb2YgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byBlYWNoIGxpc3RlbmVyLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmVtaXRFdmVudCA9IGZ1bmN0aW9uIGVtaXRFdmVudChldnQsIGFyZ3MpIHtcbiAgICAgICAgdmFyIGxpc3RlbmVyc01hcCA9IHRoaXMuZ2V0TGlzdGVuZXJzQXNPYmplY3QoZXZ0KTtcbiAgICAgICAgdmFyIGxpc3RlbmVycztcbiAgICAgICAgdmFyIGxpc3RlbmVyO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGtleTtcbiAgICAgICAgdmFyIHJlc3BvbnNlO1xuXG4gICAgICAgIGZvciAoa2V5IGluIGxpc3RlbmVyc01hcCkge1xuICAgICAgICAgICAgaWYgKGxpc3RlbmVyc01hcC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAgICAgbGlzdGVuZXJzID0gbGlzdGVuZXJzTWFwW2tleV0uc2xpY2UoMCk7XG5cbiAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdGVuZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZSBsaXN0ZW5lciByZXR1cm5zIHRydWUgdGhlbiBpdCBzaGFsbCBiZSByZW1vdmVkIGZyb20gdGhlIGV2ZW50XG4gICAgICAgICAgICAgICAgICAgIC8vIFRoZSBmdW5jdGlvbiBpcyBleGVjdXRlZCBlaXRoZXIgd2l0aCBhIGJhc2ljIGNhbGwgb3IgYW4gYXBwbHkgaWYgdGhlcmUgaXMgYW4gYXJncyBhcnJheVxuICAgICAgICAgICAgICAgICAgICBsaXN0ZW5lciA9IGxpc3RlbmVyc1tpXTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAobGlzdGVuZXIub25jZSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyLmxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlID0gbGlzdGVuZXIubGlzdGVuZXIuYXBwbHkodGhpcywgYXJncyB8fCBbXSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlID09PSB0aGlzLl9nZXRPbmNlUmV0dXJuVmFsdWUoKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcihldnQsIGxpc3RlbmVyLmxpc3RlbmVyKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBbGlhcyBvZiBlbWl0RXZlbnRcbiAgICAgKi9cbiAgICBwcm90by50cmlnZ2VyID0gYWxpYXMoJ2VtaXRFdmVudCcpO1xuXG4gICAgLyoqXG4gICAgICogU3VidGx5IGRpZmZlcmVudCBmcm9tIGVtaXRFdmVudCBpbiB0aGF0IGl0IHdpbGwgcGFzcyBpdHMgYXJndW1lbnRzIG9uIHRvIHRoZSBsaXN0ZW5lcnMsIGFzIG9wcG9zZWQgdG8gdGFraW5nIGEgc2luZ2xlIGFycmF5IG9mIGFyZ3VtZW50cyB0byBwYXNzIG9uLlxuICAgICAqIEFzIHdpdGggZW1pdEV2ZW50LCB5b3UgY2FuIHBhc3MgYSByZWdleCBpbiBwbGFjZSBvZiB0aGUgZXZlbnQgbmFtZSB0byBlbWl0IHRvIGFsbCBldmVudHMgdGhhdCBtYXRjaCBpdC5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7U3RyaW5nfFJlZ0V4cH0gZXZ0IE5hbWUgb2YgdGhlIGV2ZW50IHRvIGVtaXQgYW5kIGV4ZWN1dGUgbGlzdGVuZXJzIGZvci5cbiAgICAgKiBAcGFyYW0gey4uLip9IE9wdGlvbmFsIGFkZGl0aW9uYWwgYXJndW1lbnRzIHRvIGJlIHBhc3NlZCB0byBlYWNoIGxpc3RlbmVyLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLmVtaXQgPSBmdW5jdGlvbiBlbWl0KGV2dCkge1xuICAgICAgICB2YXIgYXJncyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSk7XG4gICAgICAgIHJldHVybiB0aGlzLmVtaXRFdmVudChldnQsIGFyZ3MpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBTZXRzIHRoZSBjdXJyZW50IHZhbHVlIHRvIGNoZWNrIGFnYWluc3Qgd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLiBJZiBhXG4gICAgICogbGlzdGVuZXJzIHJldHVybiB2YWx1ZSBtYXRjaGVzIHRoZSBvbmUgc2V0IGhlcmUgdGhlbiBpdCB3aWxsIGJlIHJlbW92ZWRcbiAgICAgKiBhZnRlciBleGVjdXRpb24uIFRoaXMgdmFsdWUgZGVmYXVsdHMgdG8gdHJ1ZS5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIG5ldyB2YWx1ZSB0byBjaGVjayBmb3Igd2hlbiBleGVjdXRpbmcgbGlzdGVuZXJzLlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gQ3VycmVudCBpbnN0YW5jZSBvZiBFdmVudEVtaXR0ZXIgZm9yIGNoYWluaW5nLlxuICAgICAqL1xuICAgIHByb3RvLnNldE9uY2VSZXR1cm5WYWx1ZSA9IGZ1bmN0aW9uIHNldE9uY2VSZXR1cm5WYWx1ZSh2YWx1ZSkge1xuICAgICAgICB0aGlzLl9vbmNlUmV0dXJuVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEZldGNoZXMgdGhlIGN1cnJlbnQgdmFsdWUgdG8gY2hlY2sgYWdhaW5zdCB3aGVuIGV4ZWN1dGluZyBsaXN0ZW5lcnMuIElmXG4gICAgICogdGhlIGxpc3RlbmVycyByZXR1cm4gdmFsdWUgbWF0Y2hlcyB0aGlzIG9uZSB0aGVuIGl0IHNob3VsZCBiZSByZW1vdmVkXG4gICAgICogYXV0b21hdGljYWxseS4gSXQgd2lsbCByZXR1cm4gdHJ1ZSBieSBkZWZhdWx0LlxuICAgICAqXG4gICAgICogQHJldHVybiB7KnxCb29sZWFufSBUaGUgY3VycmVudCB2YWx1ZSB0byBjaGVjayBmb3Igb3IgdGhlIGRlZmF1bHQsIHRydWUuXG4gICAgICogQGFwaSBwcml2YXRlXG4gICAgICovXG4gICAgcHJvdG8uX2dldE9uY2VSZXR1cm5WYWx1ZSA9IGZ1bmN0aW9uIF9nZXRPbmNlUmV0dXJuVmFsdWUoKSB7XG4gICAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCdfb25jZVJldHVyblZhbHVlJykpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLl9vbmNlUmV0dXJuVmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGZXRjaGVzIHRoZSBldmVudHMgb2JqZWN0IGFuZCBjcmVhdGVzIG9uZSBpZiByZXF1aXJlZC5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge09iamVjdH0gVGhlIGV2ZW50cyBzdG9yYWdlIG9iamVjdC5cbiAgICAgKiBAYXBpIHByaXZhdGVcbiAgICAgKi9cbiAgICBwcm90by5fZ2V0RXZlbnRzID0gZnVuY3Rpb24gX2dldEV2ZW50cygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50cyB8fCAodGhpcy5fZXZlbnRzID0ge30pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZXZlcnRzIHRoZSBnbG9iYWwge0BsaW5rIEV2ZW50RW1pdHRlcn0gdG8gaXRzIHByZXZpb3VzIHZhbHVlIGFuZCByZXR1cm5zIGEgcmVmZXJlbmNlIHRvIHRoaXMgdmVyc2lvbi5cbiAgICAgKlxuICAgICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBOb24gY29uZmxpY3RpbmcgRXZlbnRFbWl0dGVyIGNsYXNzLlxuICAgICAqL1xuICAgIEV2ZW50RW1pdHRlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24gbm9Db25mbGljdCgpIHtcbiAgICAgICAgZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBvcmlnaW5hbEdsb2JhbFZhbHVlO1xuICAgICAgICByZXR1cm4gRXZlbnRFbWl0dGVyO1xuICAgIH07XG5cbiAgICAvLyBFeHBvc2UgdGhlIGNsYXNzIGVpdGhlciB2aWEgQU1ELCBDb21tb25KUyBvciB0aGUgZ2xvYmFsIG9iamVjdFxuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiBFdmVudEVtaXR0ZXI7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgICBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cyl7XG4gICAgICAgIG1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgZXhwb3J0cy5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG4gICAgfVxufSh0aGlzIHx8IHt9KSk7XG4iLCJsZXQgc2hhcmUgPSAobmV0d29yaykgPT4ge1xuXG4gIGxldCB0aXRsZSA9IFwi0KDQvtGB0YHQuNGPINC90LAg0L/QvtGA0L7Qs9C1INGN0L/QuNC00LXQvNC40Lgg0JLQmNCnXCI7XG4gIGxldCBkZXNjcmlwdGlvbiA9IFwi0KLRgNC10LLQvtC20L3Ri9C1INGE0LDQutGC0Ysg0L4g0LzQsNGB0YjRgtCw0LHQsNGFINCx0LXQtNGB0YLQstC40Y8g4oCUINCyINGB0L/QtdGG0L/RgNC+0LXQutGC0LUgwqvQk9Cw0LfQtdGC0YsuUnXCu1wiO1xuICBsZXQgbGluayA9IFwiaHR0cDovL2R5bi5pZy5yYW1ibGVyLnJ1L0hJVi1zcHJlYWQvXCI7XG4gIGxldCBjbG9zZUxpbmsgPSBcImh0dHA6Ly9keW4uaWcucmFtYmxlci5ydS9ISVYtc3ByZWFkL2Nsb3NlLmh0bWxcIlxuICBsZXQgdHdpdHRlclRleHQgPSB0aXRsZSArIFwiLlwiICsgXCIgXCIgKyBkZXNjcmlwdGlvbjtcbiAgbGV0IGltYWdlID0gXCJodHRwOi8vZHluLmlnLnJhbWJsZXIucnUvSElWLXNwcmVhZC9zaGFyZS1pbWcucG5nXCJcblxuICBpZiAobmV0d29yayA9PSBcInZrXCIpIHtcbiAgICBsZXQgdXJsID0gXCJodHRwOi8vdmsuY29tL3NoYXJlLnBocD91cmw9XCIgKyBsaW5rICsgXCImZGVzY3JpcHRpb249XCIgK1xuICAgICAgZGVzY3JpcHRpb24gKyBcIiZpbWFnZT1cIiArIGltYWdlICsgXCImdGl0bGU9XCIgKyB0aXRsZTtcbiAgICB3aW5kb3cub3Blbih1cmwsIFwiX2JsYW5rXCIsIFwid2lkdGg9NDAwLGhlaWdodD01MDBcIik7XG4gIH0gZWxzZSBpZiAobmV0d29yayA9PSBcImZiXCIpIHtcbiAgICBsZXQgYXBwSWQgPSA2MTA0MTU3MTU3ODU3NzU7XG4gICAgbGV0IHVybCA9IFwiaHR0cHM6Ly93d3cuZmFjZWJvb2suY29tL2RpYWxvZy9mZWVkP2FwcF9pZD1cIiArIGFwcElkICtcbiAgICAgIFwiJmRlc2NyaXB0aW9uPVwiICsgZGVzY3JpcHRpb24gKyBcIiZkaXNwbGF5PXBvcHVwJmxpbms9XCIgKyBsaW5rICsgXCImbmFtZT1cIiArIHRpdGxlICsgXCImbmV4dD1cIiArXG4gICAgICBjbG9zZUxpbmsgKyBcIiZwaWN0dXJlPVwiICsgaW1hZ2U7XG4gICAgd2luZG93Lm9wZW4odXJsLCBcIl9ibGFua1wiLCBcIndpZHRoPTQwMCxoZWlnaHQ9NTAwXCIpO1xuICB9IGVsc2UgaWYgKG5ldHdvcmsgPT0gXCJ0d1wiKSB7XG4gICAgbGV0IHVybCA9IFwiaHR0cHM6Ly90d2l0dGVyLmNvbS9pbnRlbnQvdHdlZXQ/b3JpZ2luYWxfcmVmZXJlcj1cIiArIGxpbmsgK1xuICAgICAgXCImdGV4dD1cIiArIHR3aXR0ZXJUZXh0ICsgXCImdHdfcD10d2VldGJ1dHRvbiZ1cmw9XCIgKyBsaW5rO1xuICAgIHdpbmRvdy5vcGVuKHVybCwgXCJfYmxhbmtcIiwgXCJ3aWR0aD00MDAsaGVpZ2h0PTUwMFwiKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBzaGFyZTtcbiIsImxldCBnZXRDb2xvciA9IGZ1bmN0aW9uKHBlcmNlbnQpIHtcbiAgaWYgKHBlcmNlbnQgPiAxKSByZXR1cm4gXCJyZ2IoMTgwLDMyLDM3KVwiO1xuXG4gIGxldCByID0gTWF0aC5mbG9vcigyMzIgLSAoMjMyIC0gMTgwKSAqIHBlcmNlbnQpO1xuICBsZXQgZyA9IE1hdGguZmxvb3IoMjMyIC0gKDIzMiAtIDMyKSAqIHBlcmNlbnQpO1xuICBsZXQgYiA9IE1hdGguZmxvb3IoMjMyIC0gKDIzMiAtIDM3KSAqIHBlcmNlbnQpO1xuXG4gIHJldHVybiBgcmdiKCR7cn0sJHtnfSwke2J9KWA7XG5cbn07XG5cbmxldCBnZXRDb2xvck1ldGEgPSBmdW5jdGlvbihzdGFydENvbG9yLCBlbmRDb2xvciwgcGVyY2VudCkge1xuICAvLyBjb25zb2xlLmxvZyhwZXJjZW50KTtcbiAgaWYgKHBlcmNlbnQgPj0gMSB8fCBpc05hTihwZXJjZW50KSkgcmV0dXJuIHN0YXJ0Q29sb3Iuam9pbihcIixcIilcbiAgbGV0IG5vTmFtZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIHBlcmNlbnQpIHtcbiAgICByZXR1cm4gTWF0aC5hYnMoXG4gICAgICBNYXRoLmZsb29yKHN0YXJ0ICogKDEgLSBwZXJjZW50KSArIGVuZCAqIHBlcmNlbnQpXG4gICAgKTtcbiAgfTtcblxuICByZXR1cm4gc3RhcnRDb2xvci5tYXAoZnVuY3Rpb24oZWxlbSwgaSkge1xuICAgIHJldHVybiBub05hbWUoZWxlbSwgZW5kQ29sb3JbaV0sIHBlcmNlbnQpO1xuICB9KS5qb2luKFwiLFwiKTtcbn07XG5cblxubGV0IGFkZE1vdXNlZXdoZWVsRXZlbnQgPSBmdW5jdGlvbihlbGVtLCBmbikge1xuICBpZiAoZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgIGlmICgnb253aGVlbCcgaW4gZG9jdW1lbnQpIHtcbiAgICAgIC8vIElFOSssIEZGMTcrLCBDaDMxK1xuICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwid2hlZWxcIiwgZm4pO1xuICAgIH0gZWxzZSBpZiAoJ29ubW91c2V3aGVlbCcgaW4gZG9jdW1lbnQpIHtcbiAgICAgIC8vINGD0YHRgtCw0YDQtdCy0YjQuNC5INCy0LDRgNC40LDQvdGCINGB0L7QsdGL0YLQuNGPXG4gICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJtb3VzZXdoZWVsXCIsIGZuKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gRmlyZWZveCA8IDE3XG4gICAgICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoXCJNb3pNb3VzZVBpeGVsU2Nyb2xsXCIsIGZuKTtcbiAgICB9XG4gIH0gZWxzZSB7IC8vIElFOC1cbiAgICBlbGVtLmF0dGFjaEV2ZW50KFwib25tb3VzZXdoZWVsXCIsIGZuKTtcbiAgfVxuXG59XG5cbmxldCBzaG93RWxlbSA9ICgkZWxlbSkgPT4ge1xuXG4gICRlbGVtLmNzcyh7XG4gICAgICBkaXNwbGF5OiBcImJsb2NrXCIsXG4gICAgfSkuY2xlYXJRdWV1ZSgpXG4gICAgLmFuaW1hdGUoe1xuICAgICAgb3BhY2l0eTogMVxuICAgIH0sIDEwMDApO1xufTtcblxubGV0IGhpZGVFbGVtID0gKCRlbGVtKSA9PiB7XG4gICRlbGVtLmNzcyh7XG4gICAgZGlzcGxheTogXCJub25lXCIsXG4gICAgb3BhY2l0eTogMCxcbiAgICB0cmFuc2l0aW9uOiBcIm9wYWNpdHkgMXNcIlxuICB9KTtcbn07XG5cbmxldCBzY3JvbGxUb0VsZW1Ub3AgPSAoJGVsZW0sIGlzTGFzdCkgPT4ge1xuXG4gIHdpbmRvdy5kaXNhYmxlU2Nyb2xsID0gdHJ1ZTtcblxuICBsZXQgd2luSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpXG5cbiAgbGV0IGhlbHBlckVsZW0gPSAkKCcucHJvcCcpO1xuXG4gIGxldCBzZXRIZWxwZXJQb3NvdGluID0gKHdpbkhlaWdodCwkZWxlbSkgPT4ge1xuICAgIGxldCBoZWxwZXJQb3NpdGlvbiA9ICgkZWxlbS5vZmZzZXQoKS50b3AgKyB3aW5IZWlnaHQpO1xuXG4gICAgaWYgKCBoZWxwZXJQb3NpdGlvbiA+IGhlbHBlckVsZW0ub2Zmc2V0KCkudG9wKSB7XG4gICAgICBoZWxwZXJFbGVtLmNzcyh7XG4gICAgICAgIHRvcDogaGVscGVyUG9zaXRpb25cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gaWYoIWlzTGFzdCkgc2V0SGVscGVyUG9zb3Rpbih3aW5IZWlnaHQgLCRlbGVtKTtcblxuXG4gbGV0IHRvcFBvc2l0aW9uID0gICRlbGVtLm9mZnNldCgpLnRvcFxuXG4gLy/Qv9C10YDQtdC80L7RgtC60LAg0Log0L3Rg9C20L3QvtC80YMg0LzQtdGB0YLRg1xuICQoJ2JvZHknKS5jbGVhclF1ZXVlKClcbiAgIC5hbmltYXRlKHtcbiAgICAgc2Nyb2xsVG9wOiB0b3BQb3NpdGlvbixcbiAgIH0sIHtcbiAgICAgZHVyYXRpb246IDEwMDAsXG4gICAgIGRvbmU6ICgpPT4gd2luZG93LmRpc2FibGVTY3JvbGwgPSBmYWxzZVxuICAgfSk7XG5cblxufVxuXG5cblxuXG5cbmxldCBzY3JvbGxUb0VsZW1DZW50ZXIgPSAoJGVsZW0sIGlzTGFzdCkgPT4ge1xuXG4gIGxldCBzZXRIZWxwZXJQb3NvdGluID0gKHdpbkhlaWdodCwkZWxlbSkgPT4ge1xuICAgIGxldCBoZWxwZXJQb3NpdGlvbiA9ICgkZWxlbS5vZmZzZXQoKS50b3AgKyAkZWxlbS5oZWlnaHQoKSAvIDIgKyB3aW5IZWlnaHQgLyAyKTtcblxuICAgIGlmICggaGVscGVyUG9zaXRpb24gPiAkKCcucHJvcCcpLm9mZnNldCgpLnRvcCkge1xuICAgICAgJCgnLnByb3AnKS5jc3Moe1xuICAgICAgICB0b3A6IGhlbHBlclBvc2l0aW9uXG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICB3aW5kb3cuZGlzYWJsZVNjcm9sbCA9IHRydWU7XG5cbiAgbGV0IHdpbkhlaWdodCA9ICQod2luZG93KS5oZWlnaHQoKVxuXG4gIC8v0JTQvtCx0LDQstC70LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQsFxuICBpZiAoIWlzTGFzdCkge1xuICAgIHNldEhlbHBlclBvc290aW4od2luSGVpZ2h0LCRlbGVtKTtcbiAgfVxuXG4gIC8v0L7Qv9GA0LXQtNC10LvQtdC90LjQtSDRhNC40L3QsNC70YzQvdC+0Lkg0L/QvtC30LjRhtC40LhcbiAgbGV0IHNjcm9sbFRvO1xuXG5cbiAgLy8g0LXRgdC70Lgg0Y3Qu9C10LzQvdC10YIg0LHQvtC70YzRiNC1INGA0LDQt9C80LXRgNCwINGN0LrRgNCw0L3QsCDRgtC+INC/0YDQvtC60YDRg9GC0LrQsCDQsdGD0LTRgtC1INC00L4g0LXQs9C+INCy0LXRgNGF0LBcbiAgLy8gaWYgKCAkZWxlbS5oZWlnaHQoKSA8IHdpbkhlaWdodCl7XG4gICAgc2Nyb2xsVG8gPSAgJGVsZW0ub2Zmc2V0KCkudG9wIC0gd2luSGVpZ2h0IC8gMiArICRlbGVtLmhlaWdodCgpIC8gMlxuICAvLyB9ZWxzZSB7XG4gIC8vICAgc2Nyb2xsVG8gPSAgJGVsZW0ub2Zmc2V0KCkudG9wO1xuICAvLyB9XG5cbiAgLy/Qv9C10YDQtdC80L7RgtC60LAg0Log0L3Rg9C20L3QvtC80YMg0LzQtdGB0YLRg1xuICAkKCdodG1sLCBib2R5JykuY2xlYXJRdWV1ZSgpXG4gICAgLmFuaW1hdGUoe1xuICAgICAgc2Nyb2xsVG9wOiBzY3JvbGxUb1xuICAgIH0sIHtcbiAgICAgIGR1cmF0aW9uOiAxMDAwLFxuICAgICAgZG9uZTogKCk9PiB3aW5kb3cuZGlzYWJsZVNjcm9sbCA9IGZhbHNlXG4gICAgfSk7XG59XG5cblxuXG5leHBvcnQge2dldENvbG9yLGFkZE1vdXNlZXdoZWVsRXZlbnQsIGdldENvbG9yTWV0YSxzaG93RWxlbSwgaGlkZUVsZW0sIHNjcm9sbFRvRWxlbVRvcH1cbiJdfQ==
