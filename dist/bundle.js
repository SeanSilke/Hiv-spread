(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{"./Scroller":9}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
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

},{"./utils":16}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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

},{"./PieChart":4}],7:[function(require,module,exports){
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

},{"./DropDown":1,"./Legend":3,"./Play":5,"./PopUp":6,"./SvgMap":10,"./TogleBtn":11,"./Years":13}],8:[function(require,module,exports){
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

},{"./DropDown":1,"./DropDownMobile":2,"./PopUp":6,"./TogleBtn":11,"./YearSelect":12}],9:[function(require,module,exports){
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

},{"./utils":16}],10:[function(require,module,exports){
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

},{"./utils":16}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
"use strict";

var _utils = require("./utils");

var _RegInfo = require("./RegInfo");

var _RegInfo2 = _interopRequireDefault(_RegInfo);

var _RegInfoMobile = require("./RegInfoMobile");

var _RegInfoMobile2 = _interopRequireDefault(_RegInfoMobile);

var _newInfectedChartMobile = require("./newInfectedChartMobile");

var _newInfectedChartMobile2 = _interopRequireDefault(_newInfectedChartMobile);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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

    var newInfectedChart = function () {

      var data = [100, 203, 1513, 4315, 3971, 19758, 59609, 88739, 52170, 39232, 37002, 39407, 43007, 44713, 54563, 58410, 58298, 62387, 70832, 79764, 89667, 93000];

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
          var color = getColorMeta(startColor, endColor, val / max);
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

    // newInfectedChart.show();


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
        hideElem(answer);
      };

      var showAnswers = function showAnswers() {
        showElem(answer);
        onAnswer && onAnswer();
        // scrollToElemCenter(answer)
        scrollToElemTop($($(".answerButton")[id]));
      };

      var initQuestion = function initQuestion() {
        hideElem(question);
      };

      var showQuestin = function showQuestin() {
        showElem(question);
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
        hideElem(answer);
      };

      var showAnswers = function showAnswers() {
        showElem(answer);
        onAnswer && onAnswer();
        // scrollToElemCenter(answer)
        scrollToElemTop($($(".answerButton")[id]));
      };

      var initQuestion = function initQuestion() {
        hideElem(question);
      };

      var showQuestin = function showQuestin() {
        showElem(question);
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

    function Footer(id) {

      var footer = $(".plate11, .line.bottom");

      this.init = function () {
        hideElem(footer);
      };

      var that = this;

      $('.scrollBtn')[id].onclick = function () {
        that.show();
      };

      this.show = function () {
        sideBars.select(id);
        this.isShown = true;
        showElem(footer);
        scrollToElemTop($($('.footer')[id]), true);
        renderResult();
      };
    }

    /*
    ███████ ██ ██████  ███████ ██████   █████  ██████  ███████
    ██      ██ ██   ██ ██      ██   ██ ██   ██ ██   ██ ██
    ███████ ██ ██   ██ █████   ██████  ███████ ██████  ███████
         ██ ██ ██   ██ ██      ██   ██ ██   ██ ██   ██      ██
    ███████ ██ ██████  ███████ ██████  ██   ██ ██   ██ ███████
    */

    function SideBars() {
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

      this.isShown = false;
      this.select = select;
      this.render = render;
      this.show = function () {
        this.isShown = true;
        showElem($mainElem);
      };
    }

    var sideBars = new SideBars();

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
    _newInfectedChartMobile2.default.show();

    var quizElems = [new hookUpQueston(0, $(".question-one"), 2, ".plate3"), new hookUpQueston(1, $(".question-two"), 3, ".plate5", getDataAndMap), new hookUpQueston(2, $(".question-three"), 2, ".answer-three, .plate6-after", function () {
      newInfectedChart.show();
      _newInfectedChartMobile2.default.show();
    }), new hookUpValQueston(3, $(".question-four"), valPicker3, ".answer-four, .plate7-after"), new hookUpValQueston(4, $(".question-five"), valPicker2, ".answer-five", keyReasonChart.show), new hookUpValQueston(5, $(".question-six"), valPicker, ".answer-six"), new hookUpQueston(6, $(".question-seven"), 1, ".answer-seven, .plate10-after"), new Footer(7)];

    // quizElems.forEach(elem => elem.init());


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

  /*
  ███████ ██   ██  █████  ██████  ███████     ██████  ████████ ███    ██
  ██      ██   ██ ██   ██ ██   ██ ██          ██   ██    ██    ████   ██
  ███████ ███████ ███████ ██████  █████       ██████     ██    ██ ██  ██
       ██ ██   ██ ██   ██ ██   ██ ██          ██   ██    ██    ██  ██ ██
  ███████ ██   ██ ██   ██ ██   ██ ███████     ██████     ██    ██   ████
  */

  $(".share-btn").click(function () {
    console.log(this.dataset.network);
    share(this.dataset.network);
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
})();

},{"./RegInfo":7,"./RegInfoMobile":8,"./newInfectedChartMobile":15,"./utils":16}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require("./utils");

console.log("hi");

var newInfectedChartMobile = function () {

  var data = [100, 203, 1513, 4315, 3971, 19758, 59609, 88739, 52170, 39232, 37002, 39407, 43007, 44713, 54563, 58410, 58298, 62387, 70832, 79764, 89667, 93000];

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

},{"./utils":16}],16:[function(require,module,exports){
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

exports.getColor = getColor;
exports.addMouseewheelEvent = addMouseewheelEvent;
exports.getColorMeta = getColorMeta;

},{}]},{},[14])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJEcm9wRG93bi5qcyIsIkRyb3BEb3duTW9iaWxlLmpzIiwiTGVnZW5kLmpzIiwiUGllQ2hhcnQuanMiLCJQbGF5LmpzIiwiUG9wVXAuanMiLCJSZWdJbmZvLmpzIiwiUmVnSW5mb01vYmlsZS5qcyIsIlNjcm9sbGVyLmpzIiwiU3ZnTWFwLmpzIiwiVG9nbGVCdG4uanMiLCJZZWFyU2VsZWN0LmpzIiwiWWVhcnMuanMiLCJtYWluLmpzIiwibmV3SW5mZWN0ZWRDaGFydE1vYmlsZS5qcyIsInV0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7O0FDQUE7Ozs7OztBQUdBLFNBQVMsUUFBVCxDQUFrQixPQUFsQixFQUEyQixZQUEzQixFQUF5Qzs7QUFFdkMsTUFBSSxPQUFPLElBQVg7QUFDQSxNQUFJLFNBQVMsS0FBYjs7QUFFQSxNQUFJLFVBQVUsYUFBYSxJQUFiLENBQWtCLE9BQWxCLENBQWQ7QUFDQSxNQUFJLGFBQWEsYUFBYSxJQUFiLENBQWtCLGFBQWxCLENBQWpCO0FBQ0EsTUFBSSxXQUFXLGFBQWEsSUFBYixDQUFrQixvQkFBbEIsQ0FBZjs7QUFFQSxNQUFJLFlBQVksV0FBVyxJQUFYLENBQWdCLFVBQWhCLENBQWhCOztBQUVBLE1BQUksT0FBTyxhQUFhLElBQWIsQ0FBa0IsT0FBbEIsQ0FBWDs7QUFFQSxVQUFRLEtBQVIsQ0FDRSxVQUFTLENBQVQsRUFBWTtBQUNWLE1BQUUsZUFBRjtBQUNBLFlBQVEsS0FBUixDQUFjLFFBQWQsR0FBeUIsS0FBekI7QUFDQSxRQUFJLE1BQUosRUFBWTtBQUNWLFdBQUssS0FBTDtBQUNELEtBRkQsTUFFTztBQUNMLFdBQUssSUFBTDtBQUNEO0FBQ0YsR0FUSDs7QUFZQSxJQUFFLGFBQUYsRUFBaUIsS0FBakIsQ0FDRSxVQUFTLENBQVQsRUFBWTtBQUNWLE1BQUUsZUFBRjtBQUNBLFlBQVEsS0FBUixDQUFjLFFBQWQsR0FB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QixFQUE2QyxFQUE3QztBQUNEO0FBQ0YsR0FYRCxNQVdPO0FBQUU7QUFDUCxTQUFLLFdBQUwsQ0FBaUIsY0FBakIsRUFBaUMsRUFBakM7QUFDRDtBQUVGLENBaEJEOztRQWtCUSxRLEdBQUEsUTtRQUFTLG1CLEdBQUEsbUI7UUFBcUIsWSxHQUFBLFkiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiaW1wb3J0IFNjcm9sbGVyIGZyb20gXCIuL1Njcm9sbGVyXCJcblxuXG5mdW5jdGlvbiBEcm9wRG93bihtYXBNYWluLCBkcm9wRG93bkVsZW0pIHtcblxuICBsZXQgdGhhdCA9IHRoaXM7XG4gIGxldCBpc09wZW4gPSBmYWxzZTtcblxuICBsZXQgJHNlbGVjdCA9IGRyb3BEb3duRWxlbS5maW5kKFwiLmhlYWRcIik7XG4gIGxldCBzY3JvbGxhYmxlID0gZHJvcERvd25FbGVtLmZpbmQoXCIuc2Nyb2xsYWJsZVwiKTtcbiAgbGV0IGNsb3NlSW1nID0gZHJvcERvd25FbGVtLmZpbmQoXCIgLmNsb3NlX2J1dHRvbiBpbWdcIik7XG5cbiAgbGV0IGNvbnRhaW5lciA9IHNjcm9sbGFibGUuZmluZChcIi5jb250ZW50XCIpO1xuXG4gIGxldCBoZWFkID0gZHJvcERvd25FbGVtLmZpbmQoXCIudGV4dFwiKTtcblxuICAkc2VsZWN0LmNsaWNrKFxuICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBtYXBNYWluLnN0YXRlLmlzUGxhaW5nID0gZmFsc2U7XG4gICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgIHRoYXQuY2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoYXQub3BlbigpO1xuICAgICAgfVxuICAgIH1cbiAgKTtcblxuICAkKFwiLnNjcm9sbGFibGVcIikuY2xpY2soXG4gICAgZnVuY3Rpb24oZSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgIG1hcE1haW4uc3RhdGUuaXNQbGFpbmcgPSBmYWxzZTtcbiAgICB9XG4gICk7XG5cblxuICB0aGlzLmNsb3NlID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsYWJsZS5jc3MoJ3Zpc2liaWxpdHknLCAnaGlkZGVuJyk7XG4gICAgaXNPcGVuID0gZmFsc2U7XG4gICAgY2xvc2VJbWcuY3NzKHtcbiAgICAgIHRyYW5zZm9ybSA6IFwicm90YXRlKDBkZWcpXCIsXG4gICAgfSlcbiAgfTtcblxuICB0aGlzLm9wZW4gPSBmdW5jdGlvbigpIHtcbiAgICBzY3JvbGxhYmxlLmNzcygndmlzaWJpbGl0eScsICd2aXNpYmxlJyk7XG4gICAgaXNPcGVuID0gdHJ1ZTtcbiAgICBjbG9zZUltZy5jc3Moe1xuICAgICAgdHJhbnNmb3JtOiBcInJvdGF0ZSgxODBkZWcpXCIsXG4gICAgfSlcbiAgfTtcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChtYXBNYWluLnN0YXRlLnJlZ2lvbklkKSB7XG4gICAgICBoZWFkLnRleHQobWFwTWFpbi5kYXRhW21hcE1haW4uc3RhdGUucmVnaW9uSWRdLnNob3J0TmFtZSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhlYWQudGV4dChcItCg0LXQs9C40L7QvVwiKTtcbiAgICB9XG5cbiAgICAvLyBEaXJ0eSBIYWNrXG4gICAgY29udGFpbmVyLmVtcHR5KCk7XG4gICAgT2JqZWN0LmtleXMobWFwTWFpbi5kYXRhKS5mb3JFYWNoKFxuICAgICAgZnVuY3Rpb24ocmVnaW9uKSB7XG5cbiAgICAgICAgbGV0IHNob3J0TmFtZSA9IG1hcE1haW4uZGF0YVtyZWdpb25dLnNob3J0TmFtZTtcblxuICAgICAgICBsZXQgZWxlbSA9ICQoYDxkaXYgY2xhc3M9XCJpdGVtXCIgZGF0YS1yZWdpb25JZD1cIiR7cmVnaW9ufVwiPiAke3Nob3J0TmFtZX0gPC9kaXY+YCk7XG5cbiAgICAgICAgaWYgKHJlZ2lvbiA9PT0gbWFwTWFpbi5zdGF0ZS5yZWdpb25JZCkge1xuICAgICAgICAgIGVsZW0gPSAkKGA8ZGl2IGNsYXNzPVwiYWN0aXZlXCIgZGF0YS1yZWdpb25JZD1cIiR7cmVnaW9ufVwiPiAke3Nob3J0TmFtZX0gPC9kaXY+YCk7XG4gICAgICAgIH1cblxuICAgICAgICBjb250YWluZXIuYXBwZW5kKGVsZW0pO1xuXG4gICAgICAgIGVsZW0uY2xpY2soZnVuY3Rpb24oZSkge1xuICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgbWFwTWFpbi5zdGF0ZS5yZWdpb25JZCA9IHRoaXMuZGF0YXNldC5yZWdpb25pZDtcbiAgICAgICAgICBtYXBNYWluLnJlbmRlcigpO1xuICAgICAgICAgIHRoYXQuY2xvc2UoKTtcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgKTtcbiAgICB0aGF0LmNsb3NlKCk7XG4gIH07XG5cbiAgdGhpcy5zY3JvbGxlciA9IG5ldyBTY3JvbGxlcihkcm9wRG93bkVsZW0uZmluZChcIi5zY3JvbGxhYmxlXCIpKTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBEcm9wRG93bjtcbiIsImZ1bmN0aW9uIERyb3BEb3duTW9iaWxlKG1hcE1haW4sIGRyb3BEb3duRWxlbSkge1xuICBsZXQgdGhhdCA9IHRoaXM7XG4gIGxldCBpc09wZW4gPSBmYWxzZTtcbiAgbGV0ICRzZWxlY3QgPSBkcm9wRG93bkVsZW0uZmluZChcIiAuaGVhZFwiKTtcbiAgbGV0IHNjcm9sbGFibGUgPSBkcm9wRG93bkVsZW0uZmluZChcIi5zY3JvbGxhYmxlXCIpO1xuICBsZXQgY2xvc2VJbWcgPSBkcm9wRG93bkVsZW0uZmluZChcIiAuY2xvc2VfYnV0dG9uIGltZ1wiKTtcblxuICBsZXQgY29udGFpbmVyID0gc2Nyb2xsYWJsZS5maW5kKFwiLmNvbnRlbnRcIik7XG5cbiAgbGV0IGhlYWQgPSBkcm9wRG93bkVsZW0uZmluZChcIi50ZXh0XCIpO1xuXG4gIGxldCBkcm9wRG93bkVsZW1zID0gZHJvcERvd25FbGVtLmZpbmQoXCIudG9nbGUtYWJzLXJlbFwiKTtcblxuICAkc2VsZWN0LmNsaWNrKFxuICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICBpZiAoaXNPcGVuKSB7XG4gICAgICAgIHRoYXQuY2xvc2UoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoYXQub3BlbigpO1xuICAgICAgfVxuICAgIH1cbiAgKTtcblxuICAkKFwiLnNjcm9sbGFibGVcIikuY2xpY2soXG4gICAgZnVuY3Rpb24oZSkge1xuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICB9XG4gICk7XG5cbiAgdGhpcy5jbG9zZSA9IGZ1bmN0aW9uKCkge1xuICAgIHNjcm9sbGFibGUuY3NzKCd2aXNpYmlsaXR5JywgJ2hpZGRlbicpO1xuICAgIGlzT3BlbiA9IGZhbHNlO1xuICAgIGNsb3NlSW1nLmNzcyh7XG4gICAgICB0cmFuc2Zvcm0gOiBcInJvdGF0ZSgwZGVnKVwiLFxuICAgIH0pXG4gIH07XG5cbiAgdGhpcy5vcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgc2Nyb2xsYWJsZS5jc3MoJ3Zpc2liaWxpdHknLCAndmlzaWJsZScpO1xuICAgIGlzT3BlbiA9IHRydWU7XG4gICAgY2xvc2VJbWcuY3NzKHtcbiAgICAgIHRyYW5zZm9ybTogXCJyb3RhdGUoMTgwZGVnKVwiLFxuICAgIH0pXG4gIH07XG5cbiAgZHJvcERvd25FbGVtcy5jbGljayhmdW5jdGlvbihlKXtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIG1hcE1haW4uc3RhdGUuZGlzcGxheSA9IHRoaXMuZGF0YXNldC5kaXNwbGF5dHlwZTtcbiAgICBtYXBNYWluLnJlbmRlcigpO1xuICAgIHRoYXQuY2xvc2UoKTtcbiAgfSlcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgICQuZWFjaCggZHJvcERvd25FbGVtcywgKGksZSk9PiB7XG4gICAgICBpZihlLmRhdGFzZXQuZGlzcGxheXR5cGUgPT0gbWFwTWFpbi5zdGF0ZS5kaXNwbGF5KXtcbiAgICAgICAgZS5jbGFzc0xpc3QuYWRkKFwiYWN0aXZlXCIpXG4gICAgICAgIGhlYWQudGV4dChlLmlubmVySFRNTClcbiAgICAgIH1lbHNle1xuICAgICAgICBlLmNsYXNzTGlzdC5yZW1vdmUoXCJhY3RpdmVcIilcbiAgICAgIH1cbiAgICB9IClcbiAgICB0aGF0LmNsb3NlKCk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IERyb3BEb3duTW9iaWxlO1xuIiwiaW1wb3J0IHtnZXRDb2xvcn0gZnJvbSBcIi4vdXRpbHNcIlxuXG5mdW5jdGlvbiBMZWdlbmQobWFwTWFpbikge1xuXG4gIGxldCBpbml0Q29sb3JzID0gZnVuY3Rpb24oKSB7XG4gICAgJChcIi5sZWdlbmQgLmJsb2MgLmNvbG9yXCIpLmVhY2goZnVuY3Rpb24oaWQsIGUpIHtcbiAgICAgIGxldCBjb2xvciA9IGdldENvbG9yKChpZCArIDEpIC8gMTApO1xuICAgICAgJChlKS5jc3Moe1xuICAgICAgICBcImJhY2tncm91bmQtY29sb3JcIjogY29sb3JcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIGxldCByZW5kZXJWYWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICBsZXQgbXVsdGlwbGllciA9IG1hcE1haW4uc3RhdGUuZGlzcGxheSA9PSBcImFic1wiID8gMTAwIDogMTA7XG5cbiAgICAkKFwiLmxlZ2VuZCAuYmxvYyAudmFsXCIpLmVhY2goZnVuY3Rpb24oaWQsIGUpIHtcbiAgICAgICQoZSkudGV4dChtdWx0aXBsaWVyICogTWF0aC5wb3coMiwgaWQpKTtcbiAgICB9KTtcbiAgfTtcblxuICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBpbml0Q29sb3JzKCk7XG4gICAgcmVuZGVyVmFsdWVzKCk7XG4gIH07XG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICByZW5kZXJWYWx1ZXMoKTtcbiAgfTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBMZWdlbmQ7XG4iLCJmdW5jdGlvbiBQaWVDaGFydChtYWluRWxlbSwgcmFkKSB7XG4gIGxldCBwYXRoID0gbnVsbDtcbiAgbGV0IHN2Z0VsZW0gPSBtYWluRWxlbS5maW5kKFwiI3N2Zy1waWVcIilbMF07XG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbihkZWcpIHtcbiAgICBpZiAoIXN2Z0VsZW0pIHJldHVybjtcbiAgICBpZiAocGF0aCkge1xuICAgICAgc3ZnRWxlbS5yZW1vdmVDaGlsZChwYXRoKTtcbiAgICAgIHBhdGggPSBudWxsO1xuICAgIH1cbiAgICBpZiAoaXNOYU4oZGVnKSkgcmV0dXJuO1xuXG4gICAgaWYgKGRlZyA+IDM1OSkge1xuICAgICAgcGF0aCA9IHN2Z0VsZW0ucXVlcnlTZWxlY3RvcihcImNpcmNsZVwiKS5jbG9uZU5vZGUodHJ1ZSk7XG4gICAgICBwYXRoLnNldEF0dHJpYnV0ZShcImZpbGxcIiwgXCJ1cmwoI2ltZzEpXCIpO1xuICAgICAgc3ZnRWxlbS5hcHBlbmRDaGlsZChwYXRoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgY3ggPSByYWQsXG4gICAgICBjeSA9IHJhZCxcbiAgICAgIHJ4ID0gcmFkLFxuICAgICAgcnkgPSByYWQ7XG5cbiAgICBsZXQgcCA9IHN2Z0VsZW0uY3JlYXRlU1ZHUG9pbnQoKTtcbiAgICBwLnggPSAwO1xuICAgIHAueSA9IDE7XG5cblxuICAgIGxldCBtID0gc3ZnRWxlbS5jcmVhdGVTVkdNYXRyaXgoKTtcblxuXG4gICAgbGV0IHAyID0gcC5tYXRyaXhUcmFuc2Zvcm0obS5yb3RhdGUoZGVnKSk7XG5cbiAgICBwMi54ID0gY3ggLSBwMi54ICogcng7XG4gICAgcDIueSA9IGN5IC0gcDIueSAqIHJ5O1xuXG4gICAgcGF0aCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnROUyhcImh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnXCIsIFwicGF0aFwiKTtcblxuICAgIGxldCBkO1xuXG4gICAgaWYgKGRlZyA+IDE4MCkge1xuICAgICAgZCA9IFwiTVwiICsgY3ggKyBcIiBcIiArIChjeSAtIHJ5KSArIFwiQVwiICsgcnggKyBcIiBcIiArIHJ5ICsgXCIgMCAxIDFcIiArIHAyLnggKyBcIiBcIiArIHAyLnkgKyBcIkxcIiArIGN4ICsgXCIgXCIgKyBjeSArIFwielwiO1xuICAgIH0gZWxzZSB7XG4gICAgICBkID0gXCJNXCIgKyBjeCArIFwiIFwiICsgKGN5IC0gcnkpICsgXCJBXCIgKyByeCArIFwiIFwiICsgcnkgKyBcIiAwIDAgMVwiICsgcDIueCArIFwiIFwiICsgcDIueSArIFwiTFwiICsgY3ggKyBcIiBcIiArIGN5ICsgXCJ6XCI7XG4gICAgfVxuXG4gICAgcGF0aC5zZXRBdHRyaWJ1dGUoXCJkXCIsIGQpO1xuICAgIHBhdGguc2V0QXR0cmlidXRlKFwiZmlsbFwiLCBcInVybCgjaW1nMSlcIik7XG5cbiAgICBzdmdFbGVtLmFwcGVuZENoaWxkKHBhdGgpO1xuXG4gIH07XG5cbn1cblxuXG5cbmV4cG9ydCBkZWZhdWx0IFBpZUNoYXJ0XG4iLCJmdW5jdGlvbiBQbGF5KG1hcE1haW4pIHtcblxuICBsZXQgdGhhdCA9IHRoaXM7XG5cbiAgdGhpcy5wbGF5ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFtYXBNYWluLnN0YXRlLmlzUGxhaW5nKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgaWYgKG1hcE1haW4ucmVuZGVyKSB7XG5cbiAgICAgIGlmIChtYXBNYWluLnN0YXRlLnllYXIgPT0gMjAxNCkge1xuICAgICAgICBtYXBNYWluLnN0YXRlLnllYXIgPSAxOTk0XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXBNYWluLnN0YXRlLnllYXIrKztcbiAgICAgIH1cblxuICAgICAgbWFwTWFpbi5yZW5kZXIoKTtcbiAgICB9XG5cbiAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgdGhhdC5wbGF5KCk7XG4gICAgfSwgMTAwMCk7XG4gIH1cblxufVxuXG5leHBvcnQgZGVmYXVsdCBQbGF5O1xuIiwiaW1wb3J0IFBpZUNoYXJ0IGZyb20gXCIuL1BpZUNoYXJ0XCJcblxuZnVuY3Rpb24gUG9wVXAobWFwTWFpbiwgbWFpbkVsZW0sIHJhZCwgaXNNb2JpbGUpIHtcblxuXG4gIGxldCBwaWVDaGFydCA9IG5ldyBQaWVDaGFydChtYWluRWxlbSwgcmFkKTtcblxuICBsZXQgcG9wVXAgPSBtYWluRWxlbTtcbiAgbGV0IGNsb3NlQnV0dG9uID0gcG9wVXAuZmluZChcIi5oZWFkIC5idG4uY2xvc2VcIik7XG4gIGxldCBwaWVDb250YWluZXIgPSBwb3BVcC5maW5kKFwiLmJvZHkgLnBpZVwiKTtcblxuICBsZXQgZGF0YUZpZWxkcyA9IHBvcFVwLmZpbmQoXCIuYm9keSAuZGF0YSAuaXRlbVwiKTtcbiAgbGV0IHN0YXRlTmFtZUZlYWxkID0gcG9wVXAuZmluZChcIi5oZWFkIC5yZWdpb24gc3BhblwiKTtcbiAgbGV0IGluZmVjdGVkRmVhbGQgPSBkYXRhRmllbGRzLmZpbmQoXCIuaW5mZWN0ZWRcIik7XG4gIGxldCBkaWVkRmVhbGQgPSBkYXRhRmllbGRzLmZpbmQoXCIuZGVhZFwiKTtcbiAgLy8gY29uc29sZS5sb2coaW5mZWN0ZWRGZWFsZCk7XG4gIGxldCBpbmZlY3RlZFRleHRGZWFsZCA9ICQoZGF0YUZpZWxkcy5maW5kKFwiLmxhYmVsXCIpWzBdKTtcbiAgLy8gY29uc29sZS5sb2coZGF0YUZpZWxkcy5maW5kKFwiLmxhYmVsXCIpWzBdLGluZmVjdGVkVGV4dEZlYWxkKTtcblxuICBsZXQgY2xvc2UgPSBmdW5jdGlvbigpIHtcbiAgICBoaWRlKCk7XG4gICAgbWFwTWFpbi5zdGF0ZS5yZWdpb25JZCA9IFwiXCI7XG4gICAgbWFwTWFpbi5yZW5kZXIoKTtcbiAgfTtcblxuICBjbG9zZUJ1dHRvbi5jbGljayhmdW5jdGlvbihlKSB7XG4gICAgY2xvc2UoKTtcbiAgfSk7XG5cbiAgbGV0IGhpZGUgPSBmdW5jdGlvbigpIHtcbiAgICBwb3BVcC5jc3MoJ29wYWNpdHknLCAwKTtcbiAgICBwb3BVcC5jc3MoJ3Zpc2liaWxpdHknLCBcImhpZGRlblwiKTtcblxuICB9O1xuXG4gIGxldCBvcGVuID0gZnVuY3Rpb24oKSB7XG4gICAgcG9wVXAuY3NzKCdvcGFjaXR5JywgMSk7XG4gICAgcG9wVXAuY3NzKCd2aXNpYmlsaXR5JywgXCJ2aXNpYmxlXCIpO1xuICB9O1xuXG5cbiAgcG9wVXAuY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gIH0pO1xuXG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoIW1hcE1haW4uc3RhdGUucmVnaW9uSWQpIHtcbiAgICAgIGhpZGUoKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBsZXQgbmFtZSwgaW5mZWN0ZWQsIGRpZWQsIGluZmVjdGVkVGV4dDtcbiAgICBpZiAoaXNNb2JpbGUpIHtcbiAgICAgIG5hbWUgPSBtYXBNYWluLmRhdGFbbWFwTWFpbi5zdGF0ZS5yZWdpb25JZF0uc2hvcnROYW1lO1xuICAgIH0gZWxzZSB7XG4gICAgICBuYW1lID0gbWFwTWFpbi5kYXRhW21hcE1haW4uc3RhdGUucmVnaW9uSWRdLm5hbWU7XG4gICAgfVxuXG4gICAgaWYgKG1hcE1haW4uc3RhdGUuZGlzcGxheSA9PSBcInJlbFwiKSB7XG4gICAgICBwaWVDb250YWluZXIuaGlkZSgpO1xuICAgICAgJChkYXRhRmllbGRzWzFdKS5oaWRlKCk7XG4gICAgICAkKGRhdGFGaWVsZHNbMF0pLmZpbmQoXCIuaW5mZWN0ZWRcIikuY3NzKHtcbiAgICAgICAgd2lkdGg6IFwiYXV0b1wiXG4gICAgICB9KTtcbiAgICAgIGRpZWQgPSBudWxsO1xuICAgICAgaW5mZWN0ZWQgPSBtYXBNYWluLmRhdGFbbWFwTWFpbi5zdGF0ZS5yZWdpb25JZF0ucmVsSW5mZWN0ZWRbbWFwTWFpbi5zdGF0ZS55ZWFyXSB8fCBcItC9L9C0XCI7XG4gICAgICBpbmZlY3RlZFRleHQgPSBcItCn0LjRgdC70L4g0LjQvdGE0LjRhtC40YDQvtCy0LDQvdC90YvRhSDQvdCwJm5ic3A7MTAwINGC0YvRgdGP0Ycg0L3QsNGB0LXQu9C10L3QuNGPXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGluZmVjdGVkID0gbWFwTWFpbi5kYXRhW21hcE1haW4uc3RhdGUucmVnaW9uSWRdLmFic0luZmVjdGVkW21hcE1haW4uc3RhdGUueWVhcl0gfHwgXCLQvS/QtFwiO1xuICAgICAgZGllZCA9IG1hcE1haW4uZGF0YVttYXBNYWluLnN0YXRlLnJlZ2lvbklkXS5hYnNEaWVkW21hcE1haW4uc3RhdGUueWVhcl0gfHwgXCLQvS/QtFwiO1xuICAgICAgcGllQ29udGFpbmVyLnNob3coKTtcbiAgICAgICQoZGF0YUZpZWxkc1sxXSkuc2hvdygpO1xuICAgICAgJChkYXRhRmllbGRzWzBdKS5maW5kKFwiLmluZmVjdGVkXCIpLmNzcyh7XG4gICAgICAgIHdpZHRoOiBcIjIzJVwiXG4gICAgICB9KTtcbiAgICAgIHBpZUNoYXJ0LnJlbmRlcigzNjAgKiAoZGllZCAvIGluZmVjdGVkKSk7XG4gICAgICBpbmZlY3RlZFRleHQgPSBcItCe0LHRidC10LUg0YfQuNGB0LvQviDQuNC90YTQuNGG0LjRgNC+0LLQsNC90L3Ri9GFXCI7XG4gICAgfVxuXG4gICAgc3RhdGVOYW1lRmVhbGQudGV4dChuYW1lKTtcbiAgICBpbmZlY3RlZEZlYWxkLnRleHQoaW5mZWN0ZWQpO1xuICAgIGluZmVjdGVkVGV4dEZlYWxkLmh0bWwoaW5mZWN0ZWRUZXh0KTtcbiAgICBkaWVkRmVhbGQudGV4dChkaWVkKTtcblxuICAgIC8vIGlmIChtYXBNYWluLnN0YXRlLnJlZ2lvbklkICYmICFpc01vYmlsZSkge1xuICAgIC8vICAgIHNldFBvc2l0aW9uKGZpbmRQb3NpdGlvbigpKTtcbiAgICAvLyB9XG4gICAgb3BlbigpO1xuICB9O1xuXG59XG5cblxuZXhwb3J0IGRlZmF1bHQgUG9wVXBcbiIsIi8vXG4vL1xuLy8gaW1wb3J0IHthZGRNb3VzZWV3aGVlbEV2ZW50fSBmcm9tIFwiLi91dGlsc1wiO1xuLy8gaW1wb3J0IERyb3BEb3duTW9iaWxlIGZyb20gXCIuL0Ryb3BEb3duTW9iaWxlXCI7XG4vL1xuLy8gaW1wb3J0IHtnZXRDb2xvcn0gZnJvbSBcIi4vdXRpbHNcIjtcblxuXG5cblxuXG5pbXBvcnQgU3ZnTWFwIGZyb20gXCIuL1N2Z01hcFwiO1xuaW1wb3J0IExlZ2VuZCBmcm9tIFwiLi9MZWdlbmRcIjtcbmltcG9ydCBZZWFycyBmcm9tICBcIi4vWWVhcnNcIjtcbmltcG9ydCBEcm9wRG93biBmcm9tIFwiLi9Ecm9wRG93blwiO1xuaW1wb3J0IFBvcFVwIGZyb20gXCIuL1BvcFVwXCI7XG5pbXBvcnQgVG9nbGVCdG4gZnJvbSAnLi9Ub2dsZUJ0bic7XG5pbXBvcnQgUGxheSBmcm9tIFwiLi9QbGF5XCI7XG5cblxuXG5cbmZ1bmN0aW9uIFJlZ0luZm8oZGF0YSkge1xuXG4gIHRoaXMuZGF0YSA9IGRhdGE7XG4gIGxldCBzZWxmID0gdGhpcztcblxuICAvLyAtLS0tLS0tLS0tLS0tTWFwIFN0YXRlLS0tLS0tLS0tLS0tXG4gIHRoaXMuc3RhdGUgPSB7XG4gICAgeWVhcjogMjAxMixcbiAgICByZWdpb25JZDogXCJcIixcbiAgICBkaXNwbGF5OiBcImFic1wiLFxuICAgIGlzUGxhaW5nOiB0cnVlLFxuICB9O1xuXG4gIHRoaXMucG9wVXBFbGVtID0gJChcIi5oaWRlLW1vYmlsZSAuYmFubmVyXCIpO1xuXG4gIGxldCBzdmdNYXAgPSBuZXcgU3ZnTWFwKHRoaXMpO1xuICBsZXQgbGVnZW5kID0gbmV3IExlZ2VuZCh0aGlzKTtcbiAgbGV0IHllYXJzID0gbmV3IFllYXJzKHRoaXMpO1xuICBsZXQgZHJvcERvd24gPSBuZXcgRHJvcERvd24odGhpcywgJChcIi5tYXAuaGlkZS1tb2JpbGUgLml0ZW0uZHJvcF9kb3duXCIpKTtcbiAgbGV0IHBvcFVwID0gbmV3IFBvcFVwKHRoaXMsIHRoaXMucG9wVXBFbGVtLCA0MCwgZmFsc2UpO1xuICBsZXQgdG9nbGVCdG4gPSBuZXcgVG9nbGVCdG4odGhpcyk7XG4gIGxldCBwbGF5ID0gbmV3IFBsYXkodGhpcyk7XG5cblxuICBsZXQgZmluZFBvc2l0aW9uID0gZnVuY3Rpb24oKSB7XG4gICAgaWYgKCFzdmdNYXAuc2VsZWN0ZWRSZWcpIHJldHVybjtcblxuICAgIGxldCBtYXBSZWN0ID0gc3ZnTWFwLm1hcEVsZW0uZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IHJlZ1JlY3QgPSBzdmdNYXAuc2VsZWN0ZWRSZWcuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgbGV0IHBvcFVwUmVjdCA9IHNlbGYucG9wVXBFbGVtWzBdLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgbGV0IHRvcCwgbGVmdDtcblxuICAgIGxlZnQgPSByZWdSZWN0LmxlZnQgKyByZWdSZWN0LndpZHRoO1xuICAgIHRvcCA9IHJlZ1JlY3QudG9wIC0gcG9wVXBSZWN0LmhlaWdodDtcbiAgICBpZiAodG9wIDwgbWFwUmVjdC50b3ApIHtcbiAgICAgIHRvcCA9IG1hcFJlY3QudG9wICsgMjA7XG4gICAgfVxuICAgIGlmIChsZWZ0ICsgcG9wVXBSZWN0LndpZHRoID4gbWFwUmVjdC5sZWZ0ICsgbWFwUmVjdC53aWR0aCkge1xuICAgICAgbGVmdCA9IHJlZ1JlY3QubGVmdCAtIHBvcFVwUmVjdC53aWR0aDtcbiAgICB9XG5cbiAgICBsZWZ0ID0gbGVmdCArIHBhZ2VYT2Zmc2V0O1xuICAgIHRvcCA9IHRvcCArIHBhZ2VZT2Zmc2V0O1xuXG4gICAgcmV0dXJuIHtcbiAgICAgIHRvcDogdG9wLFxuICAgICAgbGVmdDogbGVmdCxcbiAgICB9O1xuICB9O1xuXG4gIGxldCBzZXRQb3NpdGlvbiA9IGZ1bmN0aW9uKG9iaikge1xuICAgIGlmICghb2JqKSByZXR1cm47XG4gICAgbGV0IGZvcm1hdCA9IFtcInJpZ2h0XCIsIFwidG9wXCIsIFwibGVmdFwiLCBcImJvdHRvbVwiXTtcbiAgICBmb3JtYXQuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBzZWxmLnBvcFVwRWxlbVswXS5zdHlsZVtwcm9wXSA9IG9ialtwcm9wXSA/IG9ialtwcm9wXSArIFwicHhcIiA6IFwiXCI7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICBzdmdNYXAucmVuZGVyKCk7XG4gICAgeWVhcnMucmVuZGVyKCk7XG4gICAgZHJvcERvd24ucmVuZGVyKCk7XG4gICAgbGVnZW5kLnJlbmRlcigpO1xuICAgIHBvcFVwLnJlbmRlcigpO1xuICAgIHRvZ2xlQnRuLnJlbmRlcigpO1xuICAgIGlmICh0aGlzLnN0YXRlLnJlZ2lvbklkKSB7XG5cbiAgICAgIHNldFBvc2l0aW9uKGZpbmRQb3NpdGlvbigpKTtcbiAgICB9XG5cbiAgfTtcblxuXG4gIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgIGxlZ2VuZC5pbml0KCk7XG4gICAgZHJvcERvd24uc2Nyb2xsZXIuY3JlYXRlKCk7XG4gICAgcGxheS5wbGF5KCk7XG5cbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLFxuICAgICAgZnVuY3Rpb24oZSkge1xuICAgICAgICBzZWxmLnN0YXRlLnJlZ2lvbklkID0gXCJcIjtcbiAgICAgICAgc2VsZi5zdGF0ZS5pc1BsYWluZyA9IGZhbHNlO1xuICAgICAgICBzZWxmLnJlbmRlcigpO1xuICAgICAgfVxuICAgICk7XG5cbiAgICB3aW5kb3cub25yZXNpemUgPSBmdW5jdGlvbigpIHtcbiAgICAgIHNldFBvc2l0aW9uKGZpbmRQb3NpdGlvbigpKTtcbiAgICB9O1xuICB9O1xuXG59O1xuXG5cbmV4cG9ydCBkZWZhdWx0IFJlZ0luZm87XG4iLCJcblxuXG5pbXBvcnQgRHJvcERvd24gZnJvbSBcIi4vRHJvcERvd25cIjtcbmltcG9ydCBQb3BVcCBmcm9tIFwiLi9Qb3BVcFwiO1xuaW1wb3J0IFRvZ2xlQnRuIGZyb20gJy4vVG9nbGVCdG4nO1xuaW1wb3J0IERyb3BEb3duTW9iaWxlIGZyb20gXCIuL0Ryb3BEb3duTW9iaWxlXCI7XG5pbXBvcnQgWWVhclNlbGVjdCBmcm9tIFwiLi9ZZWFyU2VsZWN0XCJcblxuXG5cbmZ1bmN0aW9uIFJlZ0luZm9Nb2JpbGUoZGF0YSkge1xuXG4gIHRoaXMuZGF0YSA9IGRhdGE7XG4gIGxldCBtYXBNYWluID0gdGhpcztcblxuICAvLyAtLS0tLS0tLS0tLS0tTWFwIFN0YXRlLS0tLS0tLS0tLS0tXG4gIHRoaXMuc3RhdGUgPSB7XG4gICAgeWVhcjogMTk5OSxcbiAgICByZWdpb25JZDogXCLQnNC+0YHQutCy0LBcIixcbiAgICBkaXNwbGF5OiBcImFic1wiXG4gIH07XG5cbiAgbGV0IGRyb3BEb3duID0gbmV3IERyb3BEb3duKHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgJChcIi5tYXAuaGlkZS1kZXNrdG9wIC5pdGVtLmRyb3BfZG93bjpsYXN0LW9mLXR5cGVcIilcbiAgICAgICAgICAgICAgICAgICAgKTtcbiAgbGV0IGRyb3BEb3duTW9iaWxlID0gbmV3IERyb3BEb3duTW9iaWxlKHRoaXMsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICQoXCIubWFwLmhpZGUtZGVza3RvcCAuaXRlbS5kcm9wX2Rvd25cIikuZmlyc3QoKVxuICAgICAgICAgICAgICAgICAgICApO1xuICBsZXQgcG9wVXAgPSBuZXcgUG9wVXAodGhpcywgJChcIi5oaWRlLWRlc2t0b3AgLmJhbm5lclwiKSwgNTAsIHRydWUpO1xuICBsZXQgeWVhclNlbGVjdCA9IG5ldyBZZWFyU2VsZWN0KHRoaXMsICQoJy55ZWFyLXNlbGVjdCcpKTtcblxuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuICAgIGRyb3BEb3duLnJlbmRlcigpO1xuICAgIHBvcFVwLnJlbmRlcigpO1xuICAgIHllYXJTZWxlY3QucmVuZGVyKCk7XG4gICAgZHJvcERvd25Nb2JpbGUucmVuZGVyKCk7XG4gIH07XG5cblxuICB0aGlzLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICBkcm9wRG93bi5zY3JvbGxlci5jcmVhdGUoKTtcblxuICAgIGRvY3VtZW50LmJvZHkuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsXG4gICAgICBmdW5jdGlvbihlKSB7XG4gICAgICAgIG1hcE1haW4ucmVuZGVyKCk7XG4gICAgICB9XG4gICAgKTtcbiAgfTtcblxufTtcblxuXG5cbmV4cG9ydCBkZWZhdWx0IFJlZ0luZm9Nb2JpbGU7XG4iLCJpbXBvcnQge2FkZE1vdXNlZXdoZWVsRXZlbnR9IGZyb20gXCIuL3V0aWxzXCI7XG5cblxuZnVuY3Rpb24gU2Nyb2xsZXIobWFpbkVsZW0pIHtcbiAgbGV0IHNjcm9sbENvbnRhaW5lciA9IG1haW5FbGVtWzBdLFxuICAgIHNjcm9sbENvbnRlbnRXcmFwcGVyID0gbWFpbkVsZW0uZmluZCgnLmNvbnRlbnQtd3JhcHBlcicpWzBdLFxuICAgIHNjcm9sbENvbnRlbnQgPSBtYWluRWxlbS5maW5kKCcuY29udGVudCcpWzBdLFxuICAgIGNvbnRlbnRQb3NpdGlvbiA9IDAsXG4gICAgc2Nyb2xsZXJCZWluZ0RyYWdnZWQgPSBmYWxzZSxcbiAgICBzY3JvbGxlcixcbiAgICB0b3BQb3NpdGlvbixcbiAgICBzY3JvbGxlckhlaWdodCxcbiAgICBub3JtYWxpemVkUG9zaXRpb247XG5cbiAgZnVuY3Rpb24gY2FsY3VsYXRlU2Nyb2xsZXJIZWlnaHQoKSB7XG4gICAgLy8gKkNhbGN1bGF0aW9uIG9mIGhvdyB0YWxsIHNjcm9sbGVyIHNob3VsZCBiZVxuICAgIGxldCB2aXNpYmxlUmF0aW8gPSBzY3JvbGxDb250YWluZXIub2Zmc2V0SGVpZ2h0IC8gc2Nyb2xsQ29udGVudFdyYXBwZXIuc2Nyb2xsSGVpZ2h0O1xuICAgIHZpc2libGVSYXRpbyA9IDAuMDU7XG4gICAgcmV0dXJuIHZpc2libGVSYXRpbyAqIHNjcm9sbENvbnRhaW5lci5vZmZzZXRIZWlnaHQ7XG4gIH1cblxuICBmdW5jdGlvbiBtb3ZlU2Nyb2xsZXIoZXZ0KSB7XG4gICAgLy8gTW92ZSBTY3JvbGwgYmFyIHRvIHRvcCBvZmZzZXRcbiAgICBsZXQgc2Nyb2xsUGVyY2VudGFnZSA9IGV2dC50YXJnZXQuc2Nyb2xsVG9wIC8gc2Nyb2xsQ29udGVudFdyYXBwZXIuc2Nyb2xsSGVpZ2h0O1xuICAgIHRvcFBvc2l0aW9uID0gc2Nyb2xsUGVyY2VudGFnZSAqIChzY3JvbGxDb250YWluZXIub2Zmc2V0SGVpZ2h0ICogMC45MTUpICsgc2Nyb2xsQ29udGFpbmVyLm9mZnNldEhlaWdodCAqIDAuMDU7IC8vIDVweCBhcmJpdHJhcnkgb2Zmc2V0IHNvIHNjcm9sbCBiYXIgZG9lc24ndCBtb3ZlIHRvbyBmYXIgYmV5b25kIGNvbnRlbnQgd3JhcHBlciBib3VuZGluZyBib3hcbiAgICBzY3JvbGxlci5zdHlsZS50b3AgPSB0b3BQb3NpdGlvbiArICdweCc7XG4gIH1cblxuICBmdW5jdGlvbiBzdGFydERyYWcoZXZ0KSB7XG4gICAgbm9ybWFsaXplZFBvc2l0aW9uID0gZXZ0LnBhZ2VZO1xuICAgIGNvbnRlbnRQb3NpdGlvbiA9IHNjcm9sbENvbnRlbnRXcmFwcGVyLnNjcm9sbFRvcDtcbiAgICBzY3JvbGxlckJlaW5nRHJhZ2dlZCA9IHRydWU7XG4gIH1cblxuICBmdW5jdGlvbiBzdG9wRHJhZyhldnQpIHtcbiAgICBzY3JvbGxlckJlaW5nRHJhZ2dlZCA9IGZhbHNlO1xuICB9XG5cbiAgZnVuY3Rpb24gc2Nyb2xsQmFyU2Nyb2xsKGV2dCkge1xuICAgIGlmIChzY3JvbGxlckJlaW5nRHJhZ2dlZCA9PT0gdHJ1ZSkge1xuICAgICAgbGV0IG1vdXNlRGlmZmVyZW50aWFsID0gZXZ0LnBhZ2VZIC0gbm9ybWFsaXplZFBvc2l0aW9uO1xuICAgICAgbGV0IHNjcm9sbEVxdWl2YWxlbnQgPSBtb3VzZURpZmZlcmVudGlhbCAqXG4gICAgICAgIChzY3JvbGxDb250ZW50V3JhcHBlci5zY3JvbGxIZWlnaHQgLyBzY3JvbGxDb250YWluZXIub2Zmc2V0SGVpZ2h0KTtcbiAgICAgIHNjcm9sbENvbnRlbnRXcmFwcGVyLnNjcm9sbFRvcCA9IGNvbnRlbnRQb3NpdGlvbiArIHNjcm9sbEVxdWl2YWxlbnQ7XG4gICAgfVxuICB9XG5cbiAgdGhpcy5jcmVhdGUgPSBmdW5jdGlvbigpIHtcbiAgICAvLyAqQ3JlYXRlcyBzY3JvbGxlciBlbGVtZW50IGFuZCBhcHBlbmRzIHRvICcuc2Nyb2xsYWJsZScgZGl2XG4gICAgLy8gY3JlYXRlIHNjcm9sbGVyIGVsZW1lbnRcbiAgICBzY3JvbGxlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgc2Nyb2xsZXIuY2xhc3NOYW1lID0gJ3Njcm9sbGVyJztcblxuICAgIC8vIGRldGVybWluZSBob3cgYmlnIHNjcm9sbGVyIHNob3VsZCBiZSBiYXNlZCBvbiBjb250ZW50XG4gICAgc2Nyb2xsZXJIZWlnaHQgPSBjYWxjdWxhdGVTY3JvbGxlckhlaWdodCgpO1xuXG4gICAgaWYgKHNjcm9sbGVySGVpZ2h0IC8gc2Nyb2xsQ29udGFpbmVyLm9mZnNldEhlaWdodCA8IDEpIHtcbiAgICAgIC8vICpJZiB0aGVyZSBpcyBhIG5lZWQgdG8gaGF2ZSBzY3JvbGwgYmFyIGJhc2VkIG9uIGNvbnRlbnQgc2l6ZVxuICAgICAgc2Nyb2xsZXIuc3R5bGUuaGVpZ2h0ID0gc2Nyb2xsZXJIZWlnaHQgKyAncHgnO1xuXG4gICAgICAvLyBhcHBlbmQgc2Nyb2xsZXIgdG8gc2Nyb2xsQ29udGFpbmVyIGRpdlxuICAgICAgc2Nyb2xsQ29udGFpbmVyLmFwcGVuZENoaWxkKHNjcm9sbGVyKTtcblxuICAgICAgLy8gc2hvdyBzY3JvbGwgcGF0aCBkaXZvdFxuICAgICAgc2Nyb2xsQ29udGFpbmVyLmNsYXNzTmFtZSArPSAnIHNob3dTY3JvbGwnO1xuXG4gICAgICAvLyBhdHRhY2ggcmVsYXRlZCBkcmFnZ2FibGUgbGlzdGVuZXJzXG4gICAgICBzY3JvbGxlci5hZGRFdmVudExpc3RlbmVyKCdtb3VzZWRvd24nLCBzdGFydERyYWcpO1xuICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCBzdG9wRHJhZyk7XG4gICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgc2Nyb2xsQmFyU2Nyb2xsKTtcbiAgICB9XG5cbiAgfVxuXG4gIGxldCBvbldoZWVsID0gKGUpID0+IGUuc3RvcFByb3BhZ2F0aW9uKClcblxuICBhZGRNb3VzZWV3aGVlbEV2ZW50KHNjcm9sbENvbnRlbnRXcmFwcGVyLG9uV2hlZWwpO1xuXG4gIC8vICoqKiBMaXN0ZW5lcnMgKioqXG4gIHNjcm9sbENvbnRlbnRXcmFwcGVyLmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIG1vdmVTY3JvbGxlcik7XG5cbn1cblxuZXhwb3J0IGRlZmF1bHQgU2Nyb2xsZXI7XG4iLCJpbXBvcnQge2dldENvbG9yfSBmcm9tIFwiLi91dGlsc1wiXG5cbmZ1bmN0aW9uIFN2Z01hcChtYXBNYWluKSB7XG5cbiAgdGhpcy5yZW5kZXIgPSBudWxsO1xuICB0aGlzLnNlbGVjdGVkUmVnID0gbnVsbDtcbiAgdGhpcy5tYXBFbGVtID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdmctbWFwXCIpO1xuICBsZXQgdGhhdCA9IHRoaXM7XG5cblxuICBsZXQgcmVnaW9ucyA9ICQoXCIjc3ZnLW1hcCBwYXRoLCAjc3ZnLW1hcCBwb2x5Z29uXCIpO1xuICBsZXQgc2VsZWN0ZWRSZWcgPSBudWxsO1xuXG4gIGxldCBzZXRSZWdzQ29sb3IgPSBmdW5jdGlvbih5ZWFyKSB7XG4gICAgT2JqZWN0LmtleXMobWFwTWFpbi5kYXRhKS5mb3JFYWNoKGZ1bmN0aW9uKHJlZ2lub0lkKSB7XG5cbiAgICAgIGxldCB2YWx1ZSwgcGVyY2VudDtcblxuICAgICAgaWYgKG1hcE1haW4uc3RhdGUuZGlzcGxheSA9PSBcImFic1wiKSB7XG5cbiAgICAgICAgdmFsdWUgPSBtYXBNYWluLmRhdGFbcmVnaW5vSWRdLmFic0luZmVjdGVkW3llYXJdO1xuXG4gICAgICAgIGlmICh2YWx1ZSA8IDEwMCkge1xuICAgICAgICAgIHBlcmNlbnQgPSAwO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHBlcmNlbnQgPSAoTWF0aC5sb2cyKHZhbHVlIC8gMTAwKSkgLyA5O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YWx1ZSA9IG1hcE1haW4uZGF0YVtyZWdpbm9JZF0ucmVsSW5mZWN0ZWRbeWVhcl07XG5cbiAgICAgICAgaWYgKHZhbHVlIDwgMTApIHtcbiAgICAgICAgICBwZXJjZW50ID0gMDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwZXJjZW50ID0gKE1hdGgubG9nMih2YWx1ZSAvIDEwKSkgLyA5O1xuICAgICAgICB9XG5cbiAgICAgIH1cblxuICAgICAgJCgnIycgKyByZWdpbm9JZCkuY3NzKHtcbiAgICAgICAgJ2ZpbGwnOiBnZXRDb2xvcihwZXJjZW50KSxcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9O1xuXG4gIGxldCBzZXRTZWxlY3RlZFJlZ2lvbiA9IGZ1bmN0aW9uKHJlZ2lvbklkKSB7XG4gICAgdGhhdC5zZWxlY3RlZFJlZyAmJiB0aGF0LnNlbGVjdGVkUmVnLmNsYXNzTGlzdC5yZW1vdmUoJ3NlbGVjdGVkJyk7XG4gICAgaWYgKHJlZ2lvbklkKSB7XG4gICAgICB0aGF0LnNlbGVjdGVkUmVnID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocmVnaW9uSWQpO1xuICAgICAgdGhhdC5zZWxlY3RlZFJlZy5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICAgIH1cbiAgfTtcblxuXG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICBzZXRSZWdzQ29sb3IobWFwTWFpbi5zdGF0ZS55ZWFyKTtcbiAgICBzZXRTZWxlY3RlZFJlZ2lvbihtYXBNYWluLnN0YXRlLnJlZ2lvbklkKTtcbiAgICBpZiAobWFwTWFpbi5zdGF0ZS5yZWdpb25JZCkge1xuICAgICAgdGhpcy5tYXBFbGVtLmNsYXNzTGlzdC5hZGQoJ3JlZ1NlbGVjdGVkJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMubWFwRWxlbS5jbGFzc0xpc3QucmVtb3ZlKCdyZWdTZWxlY3RlZCcpO1xuICAgIH1cbiAgfTtcblxuICByZWdpb25zLmNsaWNrKFxuICAgIGZ1bmN0aW9uKGUpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAvLyBtYXBNYWluLnN0YXRlLmlzUGxhaW5nID1mYWxzZTtcbiAgICAgIGlmIChlLnRhcmdldC5pZCA9PT0gbWFwTWFpbi5zdGF0ZS5yZWdpb25JZCkge1xuICAgICAgICB0aGF0Lm1hcEVsZW0uY2xhc3NMaXN0LnJlbW92ZSgncmVnU2VsZWN0ZWQnKTtcbiAgICAgICAgbWFwTWFpbi5zdGF0ZS5yZWdpb25JZCA9IFwiXCI7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtYXBNYWluLnN0YXRlLnJlZ2lvbklkID0gZS50YXJnZXQuaWQ7XG4gICAgICAgIGUudGFyZ2V0LnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGUudGFyZ2V0LCBudWxsKTtcbiAgICAgIH1cbiAgICAgIG1hcE1haW4ucmVuZGVyKCk7XG4gICAgfVxuICApO1xufVxuXG5cblxuZXhwb3J0IGRlZmF1bHQgU3ZnTWFwO1xuIiwiZnVuY3Rpb24gVG9nbGVCdG4obWFwTWFpbikge1xuICBsZXQgYnRuID0gJChcIi5tYXAgLm1hcF9oZWFkZXIgLmJ0blwiKTtcblxuICBidG4uY2xpY2soZnVuY3Rpb24oZSkge1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgbWFwTWFpbi5zdGF0ZS5pc1BsYWluZyA9IGZhbHNlO1xuICAgIG1hcE1haW4uc3RhdGUuZGlzcGxheSA9IHRoaXMuZGF0YXNldC5kaXNwbGF5dHlwZTtcbiAgICBtYXBNYWluLnJlbmRlcigpO1xuICB9KTtcblxuICBsZXQgc2V0QnV0dG9ucyA9IGZ1bmN0aW9uKGRpc3BsYXkpIHtcbiAgICBidG4uZWFjaChmdW5jdGlvbihpLCBlbGVtKSB7XG4gICAgICBpZiAoZWxlbS5kYXRhc2V0LmRpc3BsYXl0eXBlID09IGRpc3BsYXkpIGVsZW0uY2xhc3NMaXN0LmFkZCgnYWN0aXZlJyk7XG4gICAgICBlbHNlIGVsZW0uY2xhc3NMaXN0LnJlbW92ZSgnYWN0aXZlJyk7XG4gICAgfSk7XG4gIH07XG5cbiAgdGhpcy5yZW5kZXIgPSBmdW5jdGlvbigpIHtcbiAgICBzZXRCdXR0b25zKG1hcE1haW4uc3RhdGUuZGlzcGxheSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgVG9nbGVCdG47XG4iLCJmdW5jdGlvbiBZZWFyU2VsZWN0KG1hcE1haW4sIG1haW5FbGVtKSB7XG4gIGxldCB5ZWFyID0gbWFpbkVsZW0uZmluZChcIi5zZWxlY3RlZC15ZWFyXCIpO1xuICBsZXQgbW9yZUJ0biA9IG1haW5FbGVtLmZpbmQoXCIubW9yZVwiKTtcbiAgbGV0IGxlc3NCdG4gPSBtYWluRWxlbS5maW5kKFwiLmxlc3NcIik7XG5cbiAgbW9yZUJ0bi5jbGljaygoKSA9PiB7XG4gICAgaWYgKG1hcE1haW4uc3RhdGUueWVhciA8IDIwMTQpIG1hcE1haW4uc3RhdGUueWVhcisrO1xuICAgIG1hcE1haW4ucmVuZGVyKCk7XG4gIH0pXG5cbiAgbGVzc0J0bi5jbGljaygoKSA9PiB7XG4gICAgaWYgKG1hcE1haW4uc3RhdGUueWVhciA+IDE5OTQpIG1hcE1haW4uc3RhdGUueWVhci0tO1xuICAgIG1hcE1haW4ucmVuZGVyKCk7XG4gIH0pXG5cbiAgdGhpcy5yZW5kZXIgPSAoKSA9PiB7XG4gICAgeWVhci50ZXh0KG1hcE1haW4uc3RhdGUueWVhcilcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBZZWFyU2VsZWN0O1xuIiwiZnVuY3Rpb24gWWVhcnMobWFwTWFpbikge1xuICB0aGlzLnJlbmRlciA9IGZ1bmN0aW9uKCkge1xuXG4gICAgJChcIi55ZWFycyAuY29sXCIpLmVhY2goZnVuY3Rpb24oaWQsIGUpIHtcbiAgICAgIGxldCB5ZWFyID0gcGFyc2VJbnQoJChlKS5hdHRyKFwiaWRcIikpO1xuICAgICAgaWYgKHllYXIgPT09IG1hcE1haW4uc3RhdGUueWVhcikge1xuICAgICAgICAkKGUpLmFkZENsYXNzKFwiYWN0aXZlXCIpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgJChlKS5yZW1vdmVDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICB9O1xuXG4gIC8vIF9fX19fX19fX19fX19jbGlja19fX19fX19fX19cblxuICAkKFwiLnllYXJzIC5jb2xcIikub24oXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICBtYXBNYWluLnN0YXRlLmlzUGxhaW5nID0gZmFsc2U7XG4gICAgbGV0IHllYXIgPSBwYXJzZUludCgkKHRoaXMpLmF0dHIoXCJpZFwiKSk7XG4gICAgbWFwTWFpbi5zdGF0ZS55ZWFyID0geWVhcjtcbiAgICBtYXBNYWluLnJlbmRlcigpO1xuICB9KTtcblxufVxuXG5leHBvcnQgZGVmYXVsdCBZZWFycztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4gIGltcG9ydCB7YWRkTW91c2Vld2hlZWxFdmVudH0gZnJvbSBcIi4vdXRpbHNcIjtcbiAgaW1wb3J0IHtnZXRDb2xvcn0gZnJvbSBcIi4vdXRpbHNcIjtcblxuXG4gIGltcG9ydCBSZWdJbmZvIGZyb20gXCIuL1JlZ0luZm9cIlxuICBpbXBvcnQgUmVnSW5mb01vYmlsZSBmcm9tIFwiLi9SZWdJbmZvTW9iaWxlXCI7XG5cbiAgaW1wb3J0IG5ld0luZmVjdGVkQ2hhcnRNb2JpbGUgZnJvbSBcIi4vbmV3SW5mZWN0ZWRDaGFydE1vYmlsZVwiXG5cblxuKGZ1bmN0aW9uKCkge1xuXG4gIC8qXG4gICDilojilojilojilojilojiloggIOKWiOKWiCAgICAgICDilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paI4paIXG4gIOKWiOKWiCAgICAgICDilojiloggICAgICDilojiloggICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAgICAg4paI4paIXG4gIOKWiOKWiCAgIOKWiOKWiOKWiCDilojiloggICAgICDilojiloggICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiOKWiFxuICDilojiloggICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAgICAgICAgIOKWiOKWiFxuICAg4paI4paI4paI4paI4paI4paIICDilojilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIICDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiFxuICAqL1xuXG4gIGxldCBkaXNhYmxlU2Nyb2xsID0gZmFsc2U7XG5cblxuICAvKlxuICDilojiloggICAgICDilojilogg4paI4paI4paI4paI4paI4paIICDilojilojilojilojilojiloggICDilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgIOKWiOKWiCAgICAg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICDilojilogg4paI4paI4paIICAgIOKWiOKWiCAg4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paIICAgIOKWiOKWiCDilojilojilojilojilojilojilohcbiAg4paI4paIICAgICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCAg4paI4paIICDilojiloggICAgICDilojiloggICAgICDilojiloggICAg4paI4paIIOKWiOKWiOKWiOKWiCAgIOKWiOKWiCDilojiloggICAgICAgICDilojiloggICAg4paI4paIIOKWiOKWiCAgICDilojilogg4paI4paI4paI4paIICAg4paI4paIIOKWiOKWiFxuICDilojiloggICAgICDilojilogg4paI4paI4paI4paI4paI4paIICDilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojilojilojilojilojiloggICAg4paI4paI4paI4paIICAgICAgIOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiCAgICDilojilogg4paI4paIIOKWiOKWiCAg4paI4paIIOKWiOKWiCAgICAgICAgIOKWiOKWiCAgICDilojilogg4paI4paIICAgIOKWiOKWiCDilojilogg4paI4paIICDilojilogg4paI4paI4paI4paI4paI4paI4paIXG4gIOKWiOKWiCAgICAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICDilojiloggICAg4paI4paIICAgICAgICDilojiloggICAgICDilojiloggICAg4paI4paIIOKWiOKWiCAg4paI4paIIOKWiOKWiCDilojiloggICAgICAgICDilojiloggICAg4paI4paIIOKWiOKWiCAgICDilojilogg4paI4paIICDilojilogg4paI4paIICAgICAg4paI4paIXG4gIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojilogg4paI4paI4paI4paI4paI4paIICDilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCAgICDilojiloggICAgICAgIOKWiOKWiCAgICAgICDilojilojilojilojilojiloggIOKWiOKWiCAgIOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIICAgIOKWiOKWiCAgICDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAg4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiFxuICAqL1xuXG5cblxuIGxldCBzY3JvbGxUb0VsZW1Ub3AgPSAoJGVsZW0sIGlzTGFzdCkgPT4ge1xuXG4gICBsZXQgd2luSGVpZ2h0ID0gJCh3aW5kb3cpLmhlaWdodCgpXG5cbiAgIGxldCBoZWxwZXJFbGVtID0gJCgnLnByb3AnKTtcblxuICAgbGV0IHNldEhlbHBlclBvc290aW4gPSAod2luSGVpZ2h0LCRlbGVtKSA9PiB7XG4gICAgIGxldCBoZWxwZXJQb3NpdGlvbiA9ICgkZWxlbS5vZmZzZXQoKS50b3AgKyB3aW5IZWlnaHQpO1xuXG4gICAgIGlmICggaGVscGVyUG9zaXRpb24gPiBoZWxwZXJFbGVtLm9mZnNldCgpLnRvcCkge1xuICAgICAgIGhlbHBlckVsZW0uY3NzKHtcbiAgICAgICAgIHRvcDogaGVscGVyUG9zaXRpb25cbiAgICAgICB9KTtcbiAgICAgfVxuICAgfVxuXG4gIGlmKCFpc0xhc3QpIHNldEhlbHBlclBvc290aW4od2luSGVpZ2h0ICwkZWxlbSk7XG5cblxuICBsZXQgdG9wUG9zaXRpb24gPSAgJGVsZW0ub2Zmc2V0KCkudG9wXG5cbiAgLy/Qv9C10YDQtdC80L7RgtC60LAg0Log0L3Rg9C20L3QvtC80YMg0LzQtdGB0YLRg1xuICAkKCdib2R5JykuY2xlYXJRdWV1ZSgpXG4gICAgLmFuaW1hdGUoe1xuICAgICAgc2Nyb2xsVG9wOiB0b3BQb3NpdGlvbixcbiAgICB9LCB7XG4gICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgIGRvbmU6ICgpPT4gZGlzYWJsZVNjcm9sbCA9IGZhbHNlXG4gICAgfSk7XG5cblxuIH1cblxuXG4gIGxldCBzY3JvbGxUb0VsZW1DZW50ZXIgPSAoJGVsZW0sIGlzTGFzdCkgPT4ge1xuXG4gICAgbGV0IHNldEhlbHBlclBvc290aW4gPSAod2luSGVpZ2h0LCRlbGVtKSA9PiB7XG4gICAgICBsZXQgaGVscGVyUG9zaXRpb24gPSAoJGVsZW0ub2Zmc2V0KCkudG9wICsgJGVsZW0uaGVpZ2h0KCkgLyAyICsgd2luSGVpZ2h0IC8gMik7XG5cbiAgICAgIGlmICggaGVscGVyUG9zaXRpb24gPiAkKCcucHJvcCcpLm9mZnNldCgpLnRvcCkge1xuICAgICAgICAkKCcucHJvcCcpLmNzcyh7XG4gICAgICAgICAgdG9wOiBoZWxwZXJQb3NpdGlvblxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBkaXNhYmxlU2Nyb2xsID0gdHJ1ZTtcblxuICAgIGxldCB3aW5IZWlnaHQgPSAkKHdpbmRvdykuaGVpZ2h0KClcblxuICAgIC8v0JTQvtCx0LDQstC70LXQvdC40LUg0Y3Qu9C10LzQtdC90YLQsFxuICAgIGlmICghaXNMYXN0KSB7XG4gICAgICBzZXRIZWxwZXJQb3NvdGluKHdpbkhlaWdodCwkZWxlbSk7XG4gICAgfVxuXG4gICAgLy/QvtC/0YDQtdC00LXQu9C10L3QuNC1INGE0LjQvdCw0LvRjNC90L7QuSDQv9C+0LfQuNGG0LjQuFxuICAgIGxldCBzY3JvbGxUbztcblxuXG4gICAgLy8g0LXRgdC70Lgg0Y3Qu9C10LzQvdC10YIg0LHQvtC70YzRiNC1INGA0LDQt9C80LXRgNCwINGN0LrRgNCw0L3QsCDRgtC+INC/0YDQvtC60YDRg9GC0LrQsCDQsdGD0LTRgtC1INC00L4g0LXQs9C+INCy0LXRgNGF0LBcbiAgICAvLyBpZiAoICRlbGVtLmhlaWdodCgpIDwgd2luSGVpZ2h0KXtcbiAgICAgIHNjcm9sbFRvID0gICRlbGVtLm9mZnNldCgpLnRvcCAtIHdpbkhlaWdodCAvIDIgKyAkZWxlbS5oZWlnaHQoKSAvIDJcbiAgICAvLyB9ZWxzZSB7XG4gICAgLy8gICBzY3JvbGxUbyA9ICAkZWxlbS5vZmZzZXQoKS50b3A7XG4gICAgLy8gfVxuXG4gICAgLy/Qv9C10YDQtdC80L7RgtC60LAg0Log0L3Rg9C20L3QvtC80YMg0LzQtdGB0YLRg1xuICAgICQoJ2h0bWwsIGJvZHknKS5jbGVhclF1ZXVlKClcbiAgICAgIC5hbmltYXRlKHtcbiAgICAgICAgc2Nyb2xsVG9wOiBzY3JvbGxUb1xuICAgICAgfSwge1xuICAgICAgICBkdXJhdGlvbjogMTAwMCxcbiAgICAgICAgZG9uZTogKCk9PiBkaXNhYmxlU2Nyb2xsID0gZmFsc2VcbiAgICAgIH0pO1xuXG4gIH1cblxuICBsZXQgc2hvd0VsZW0gPSAoJGVsZW0pID0+IHtcblxuICAgICRlbGVtLmNzcyh7XG4gICAgICAgIGRpc3BsYXk6IFwiYmxvY2tcIixcbiAgICAgIH0pLmNsZWFyUXVldWUoKVxuICAgICAgLmFuaW1hdGUoe1xuICAgICAgICBvcGFjaXR5OiAxXG4gICAgICB9LCAxMDAwKTtcbiAgfTtcblxuICBsZXQgaGlkZUVsZW0gPSAoJGVsZW0pID0+IHtcbiAgICAkZWxlbS5jc3Moe1xuICAgICAgZGlzcGxheTogXCJub25lXCIsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgdHJhbnNpdGlvbjogXCJvcGFjaXR5IDFzXCJcbiAgICB9KTtcbiAgfTtcblxuICBsZXQgZG9FbHNDb2xsaWRlID0gZnVuY3Rpb24oZWwxLCBlbDIpIHtcblxuICAgIGxldCByZWN0MSA9IGVsMS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgcmVjdDIgPSBlbDIuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG5cbiAgICByZXR1cm4gKHJlY3QxLmxlZnQgPCByZWN0Mi5sZWZ0ICsgcmVjdDIud2lkdGggJiZcbiAgICAgIHJlY3QxLmxlZnQgKyByZWN0MS53aWR0aCA+IHJlY3QyLmxlZnQgJiZcbiAgICAgIHJlY3QxLnRvcCA8IHJlY3QyLnRvcCArIHJlY3QyLmhlaWdodCAmJlxuICAgICAgcmVjdDEuaGVpZ2h0ICsgcmVjdDEudG9wID4gcmVjdDIudG9wKTtcbiAgfTtcblxuICAvLyAtLS0tLS0tLS0tLS1EYXRhIHByb2Nlc3MgZnVuY3Rpb25zLS0tLS0tXG5cblxuICBsZXQgbmV3RGF0YVByb3NlZWQgPSBmdW5jdGlvbihjc3ZGaWxlKSB7XG4gICAgbGV0IHIgPSB7fTtcbiAgICBsZXQgcmVnaW9uc0FyciA9IGNzdkZpbGUuc3BsaXQoXCJcXG5cIik7XG4gICAgcmVnaW9uc0Fyci5wb3AoKTsgLy9yZW1vdmUgZW5kIGxpbmVcblxuICAgIHJlZ2lvbnNBcnIuZm9yRWFjaChmdW5jdGlvbihlLCBpKSB7XG4gICAgICBlID0gZS5zcGxpdChcIjtcIik7XG4gICAgICBsZXQga2V5ID0gZS5zaGlmdCgpO1xuICAgICAgbGV0IHNob3J0TmFtZSA9IGUuc2hpZnQoKTtcbiAgICAgIGxldCBuYW1lID0gZS5zaGlmdCgpO1xuICAgICAgcltrZXldID0ge1xuICAgICAgICBuYW1lOiBuYW1lLFxuICAgICAgICBzaG9ydE5hbWU6IHNob3J0TmFtZSxcbiAgICAgICAgcm93WWVhcnNEYXRhOiBlLFxuICAgICAgfTtcbiAgICB9KTtcblxuICAgIGxldCB5ZWFycyA9IFtdO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDw9IDIwOyBpKyspIHtcbiAgICAgIHllYXJzLnB1c2goMTk5NCArIGkpO1xuICAgIH1cblxuXG5cbiAgICBPYmplY3Qua2V5cyhyKS5mb3JFYWNoKGZ1bmN0aW9uKHJlZ2lvbikge1xuXG4gICAgICByW3JlZ2lvbl0uYWJzRGllZCA9IHt9O1xuICAgICAgcltyZWdpb25dLmFic0luZmVjdGVkID0ge307XG4gICAgICByW3JlZ2lvbl0ucmVsSW5mZWN0ZWQgPSB7fTtcbiAgICAgIHllYXJzLmZvckVhY2goZnVuY3Rpb24oeWVhcikge1xuICAgICAgICByW3JlZ2lvbl0uYWJzSW5mZWN0ZWRbeWVhcl0gPSBpbmZlY3RlZEluWWVhcih5ZWFyLCByW3JlZ2lvbl0ucm93WWVhcnNEYXRhKTtcbiAgICAgICAgcltyZWdpb25dLmFic0RpZWRbeWVhcl0gPSBkaWVkSW5ZZWFyKHllYXIsIHJbcmVnaW9uXS5yb3dZZWFyc0RhdGEpO1xuICAgICAgICByW3JlZ2lvbl0ucmVsSW5mZWN0ZWRbeWVhcl0gPSByZWxuSWZlY3RlZEluWWVhcih5ZWFyLCByW3JlZ2lvbl0ucm93WWVhcnNEYXRhKTtcbiAgICAgIH0pO1xuXG5cbiAgICB9KTtcblxuICAgIHJldHVybiByO1xuXG4gIH07XG5cbiAgbGV0IGluZmVjdGVkSW5ZZWFyID0gZnVuY3Rpb24oeWVhciwgcm93UnJlZ0RhdGEpIHtcbiAgICBsZXQgb2ZzZXQgPSAwICsgKDIwMTQgLSB5ZWFyKSAqIDM7XG4gICAgcmV0dXJuIHJvd1JyZWdEYXRhW29mc2V0XTtcbiAgfTtcblxuXG4gIGxldCBkaWVkSW5ZZWFyID0gZnVuY3Rpb24oeWVhciwgcm93UnJlZ0RhdGEpIHtcbiAgICBsZXQgb2ZzZXQgPSAxICsgKDIwMTQgLSB5ZWFyKSAqIDM7XG4gICAgcmV0dXJuIHJvd1JyZWdEYXRhW29mc2V0XTtcbiAgfTtcblxuICBsZXQgcmVsbklmZWN0ZWRJblllYXIgPSBmdW5jdGlvbih5ZWFyLCByb3dScmVnRGF0YSkge1xuICAgIGxldCBvZnNldCA9IDIgKyAoMjAxNCAtIHllYXIpICogMztcbiAgICByZXR1cm4gcm93UnJlZ0RhdGFbb2ZzZXRdO1xuICB9O1xuXG4gIGxldCBnZXRDb2xvck1ldGEgPSBmdW5jdGlvbihzdGFydENvbG9yLCBlbmRDb2xvciwgcGVyY2VudCkge1xuICAgIC8vIGNvbnNvbGUubG9nKHBlcmNlbnQpO1xuICAgIGlmIChwZXJjZW50ID49IDEgfHwgaXNOYU4ocGVyY2VudCkpIHJldHVybiBzdGFydENvbG9yLmpvaW4oXCIsXCIpXG4gICAgbGV0IG5vTmFtZSA9IGZ1bmN0aW9uKHN0YXJ0LCBlbmQsIHBlcmNlbnQpIHtcbiAgICAgIHJldHVybiBNYXRoLmFicyhcbiAgICAgICAgTWF0aC5mbG9vcihzdGFydCAqICgxIC0gcGVyY2VudCkgKyBlbmQgKiBwZXJjZW50KVxuICAgICAgKTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIHN0YXJ0Q29sb3IubWFwKGZ1bmN0aW9uKGVsZW0sIGkpIHtcbiAgICAgIHJldHVybiBub05hbWUoZWxlbSwgZW5kQ29sb3JbaV0sIHBlcmNlbnQpO1xuICAgIH0pLmpvaW4oXCIsXCIpO1xuICB9O1xuXG5cblxuICAvKlxuICDilojiloggICAgIOKWiOKWiCDilojilogg4paI4paI4paIICAgIOKWiOKWiCDilojilojilojilojilojiloggICDilojilojilojilojilojiloggIOKWiOKWiCAgICAg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojilojiloggICAg4paI4paIICAgICDilojilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCDilojilojilojilojilojiloggICDilojilojilojilojilojiloggIOKWiOKWiCAgICAgIOKWiOKWiFxuICDilojiloggICAgIOKWiOKWiCDilojilogg4paI4paI4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAg4paI4paIIOKWiOKWiCAgICAg4paI4paIICAgICDilojiloggICAg4paI4paIIOKWiOKWiOKWiOKWiCAgIOKWiOKWiCAgICAg4paI4paIICAgICAg4paI4paIICAgICAg4paI4paIICAg4paI4paIIOKWiOKWiCAgICDilojilogg4paI4paIICAgICAg4paI4paIXG4gIOKWiOKWiCAg4paIICDilojilogg4paI4paIIOKWiOKWiCDilojiloggIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAgIOKWiOKWiCDilojiloggIOKWiCAg4paI4paIICAgICDilojiloggICAg4paI4paIIOKWiOKWiCDilojiloggIOKWiOKWiCAgICAg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgIOKWiOKWiCDilojiloggICAgICDilojilohcbiAg4paI4paIIOKWiOKWiOKWiCDilojilogg4paI4paIIOKWiOKWiCAg4paI4paIIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAgIOKWiOKWiCDilojilogg4paI4paI4paIIOKWiOKWiCAgICAg4paI4paIICAgIOKWiOKWiCDilojiloggIOKWiOKWiCDilojiloggICAgICAgICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiFxuICAg4paI4paI4paIIOKWiOKWiOKWiCAg4paI4paIIOKWiOKWiCAgIOKWiOKWiOKWiOKWiCDilojilojilojilojilojiloggICDilojilojilojilojilojiloggICDilojilojilogg4paI4paI4paIICAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAg4paI4paI4paI4paIICAgICDilojilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiFxuICAqL1xuXG5cbiAgbGV0IG9uc2Nyb2xsID0gKGZ1bmN0aW9uKCkge1xuICAgIGxldCBiZ0NvbG9yID0gbnVsbDtcbiAgICBsZXQgSCA9IGRvY3VtZW50LmJvZHkub2Zmc2V0SGVpZ2h0O1xuXG5cbiAgICBsZXQgY29sb3JzID0gW1xuICAgICAgWzI2LCAxNCwgMTRdLFxuICAgICAgWzIyLCA0NywgNTddLFxuICAgICAgWzI2LCAxNCwgMTRdLFxuICAgICAgWzE5LCA1MCwgNjFdLFxuICAgICAgWzE5LCA1MCwgNjFdLFxuICAgICAgWzEyLCAzNSwgNDJdLFxuICAgICAgWzEyLCAzNSwgNDJdLFxuICAgICAgWzIyLCA0NywgNTddLFxuICAgICAgWzQ0LCAxMDgsIDExMV0sXG4gICAgXVxuXG4gICAgbGV0IHJlZkVsZW1TZWxlY3RvcnMgPSBbXG4gICAgICAnLnBsYXRlMScsXG4gICAgICBcIi5wbGF0ZTItM1wiLFxuICAgICAgXCIucGxhdGU0LTVcIixcbiAgICAgIFwiLnBsYXRlNlwiLFxuICAgICAgXCIucGxhdGU3XCIsXG4gICAgICBcIi5wbGF0ZThcIixcbiAgICAgIFwiLnBsYXRlOVwiLFxuICAgICAgXCIucGxhdGUxMFwiLFxuICAgICAgXCIucGxhdGUxMVwiXG4gICAgXTtcblxuICAgIGxldCBjYWxjUmVmUG9pbnQgPSAoZWxlbSkgPT4gKCQoZWxlbSkub3V0ZXJIZWlnaHQoKSAvIDIgKyAkKGVsZW0pLm9mZnNldCgpLnRvcCk7XG5cbiAgICBsZXQgcmVmUG9pbnQgPSByZWZFbGVtU2VsZWN0b3JzLm1hcChjYWxjUmVmUG9pbnQpO1xuXG5cbiAgICBsZXQgZ2V0Qm90b21SZWZJbmRleCA9IChweCkgPT4ge1xuICAgICAgbGV0IGk7XG4gICAgICBmb3IgKGkgPSAwOyBpIDwgcmVmUG9pbnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHJlZlBvaW50W2ldID4gcHgpIGJyZWFrO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBpO1xuICAgIH07XG5cbiAgICBsZXQgZ2V0UGVyc2VudHMgPSAocHgsIHJlZlRvcCwgcmVmQm90b20pID0+ICgocHggLSByZWZUb3ApIC8gKHJlZkJvdG9tIC0gcmVmVG9wKSk7XG5cbiAgICBsZXQgb25zY3JvbGwgPSBmdW5jdGlvbigpIHtcbiAgICAgIGxldCBzY3JvbGxlZCA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuICAgICAgbGV0IHdpbmRvd0NlbnRlciA9IHNjcm9sbGVkICsgd2luZG93LmlubmVySGVpZ2h0IC8gMjtcblxuICAgICAgbGV0IGJvdG9tSW5kZXggPSBnZXRCb3RvbVJlZkluZGV4KHdpbmRvd0NlbnRlcik7XG4gICAgICBsZXQgcGVyY2VudCA9IGdldFBlcnNlbnRzKHdpbmRvd0NlbnRlciwgcmVmUG9pbnRbYm90b21JbmRleCAtIDFdLCByZWZQb2ludFtib3RvbUluZGV4XSk7XG4gICAgICBsZXQgY29sb3IgPSBnZXRDb2xvck1ldGEoY29sb3JzW2JvdG9tSW5kZXggLSAxXSwgY29sb3JzW2JvdG9tSW5kZXhdLCBwZXJjZW50KTtcblxuICAgICAgaWYgKGNvbG9yICE9PSBiZ0NvbG9yKSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgd2luZG93LmRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYHJnYigke2NvbG9yfSlgO1xuICAgICAgICB9KTtcbiAgICAgICAgYmdDb2xvciA9IGNvbG9yO1xuICAgICAgfVxuICAgIH07XG5cbiAgICByZXR1cm4gb25zY3JvbGw7XG5cbiAgfSkoKTtcblxuICB3aW5kb3cub25zY3JvbGwgPSBvbnNjcm9sbDtcblxuXG5cbiAgJChmdW5jdGlvbigpIHtcblxuXG4gICAgbGV0IG5ld0luZmVjdGVkQ2hhcnQgPSAoKCkgPT4ge1xuXG4gICAgICBsZXQgZGF0YSA9IFtcbiAgICAgICAgMTAwLFxuICAgICAgICAyMDMsXG4gICAgICAgIDE1MTMsXG4gICAgICAgIDQzMTUsXG4gICAgICAgIDM5NzEsXG4gICAgICAgIDE5NzU4LFxuICAgICAgICA1OTYwOSxcbiAgICAgICAgODg3MzksXG4gICAgICAgIDUyMTcwLFxuICAgICAgICAzOTIzMixcbiAgICAgICAgMzcwMDIsXG4gICAgICAgIDM5NDA3LFxuICAgICAgICA0MzAwNyxcbiAgICAgICAgNDQ3MTMsXG4gICAgICAgIDU0NTYzLFxuICAgICAgICA1ODQxMCxcbiAgICAgICAgNTgyOTgsXG4gICAgICAgIDYyMzg3LFxuICAgICAgICA3MDgzMixcbiAgICAgICAgNzk3NjQsXG4gICAgICAgIDg5NjY3LFxuICAgICAgICA5MzAwMCxcbiAgICAgIF07XG5cblxuICAgICAgbGV0IGJhcnMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuY2hhcnQubmV3SW5mZWN0ZWQgLmJvZHkgLmNhbnZhcyAuYmFyJyk7XG5cblxuICAgICAgbGV0IHN0YXJ0Q29sb3IgPSBbMjI4LCAxNTIsIDE1Ml07XG4gICAgICBsZXQgZW5kQ29sb3IgPSBbMTkwLCAzMiwgMzddO1xuICAgICAgbGV0IG1heCA9IDEwMCAqIDEwMDA7XG5cbiAgICAgIGxldCBpID0gMDtcblxuICAgICAgbGV0IHJlbmRlcm5ld0luZmVjdGVkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChpID49IGRhdGEubGVuZ3RoKSB7XG4gICAgICAgICAgbGV0IGxhYmVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uZXdJbmZlY3RlZF9sYWJlbF90ZXh0Jyk7XG4gICAgICAgICAgW10uZm9yRWFjaC5jYWxsKGxhYmVscywgZWxlbSA9PiBlbGVtLnN0eWxlLm9wYWNpdHkgPSAwLjkpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdmFsID0gZGF0YVtpXTtcbiAgICAgICAgaWYgKHZhbCA8IDQwMDApIHtcbiAgICAgICAgICBiYXJzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2IoMjQsMTc5LDE3MiknO1xuICAgICAgICAgIGJhcnNbaV0uc3R5bGUubWFyZ2luVG9wID0gMjYwICogMC45OCArIFwicHhcIjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBsZXQgY29sb3IgPSBnZXRDb2xvck1ldGEoc3RhcnRDb2xvciwgZW5kQ29sb3IsIHZhbCAvIG1heCk7XG4gICAgICAgICAgYmFyc1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBgcmdiKCR7Y29sb3J9KWA7XG4gICAgICAgICAgYmFyc1tpXS5zdHlsZS5tYXJnaW5Ub3AgPSAoMSAtIHZhbCAvIG1heCkgKiAyNjAgKyBcInB4XCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaSA9PSAzKSB7XG4gICAgICAgICAgYmFyc1tpXS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSAncmdiKDI0LDE3OSwxNzIpJztcbiAgICAgICAgfVxuXG4gICAgICAgIGkrKztcbiAgICAgICAgc2V0VGltZW91dChyZW5kZXJuZXdJbmZlY3RlZCwgMzApO1xuICAgICAgfTtcblxuICAgICAgbGV0IHNob3cgPSAoKSA9PiB7XG5cbiAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICByZW5kZXJuZXdJbmZlY3RlZCgpO1xuICAgICAgICB9LCAxMDAwKTtcblxuICAgICAgfTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgc2hvd1xuICAgICAgfVxuXG4gICAgfSkoKTtcblxuXG4gICAgLy8gbmV3SW5mZWN0ZWRDaGFydC5zaG93KCk7XG5cblxuICAgIGxldCBrZXlSZWFzb25DaGFydCA9ICgoKSA9PiB7XG5cbiAgICAgIC8vXHTQndCw0YDQutC+0YLQuNC60LhcdNCT0LXRgtC10YDQvtGB0LXQutGBLlx00JPQvtC80L7RgdC10LrRgS5cdNCe0YIg0LzQsNGC0LXRgNC10LlcblxuICAgICAgLy/QutCw0Log0YDQsNGB0L/QvtC70L7QttC10L3QvdGLINCx0LDRgNGLINC90LAg0LTQuNCw0LPRgNCw0LzQvNC1XG4gICAgICBsZXQgYmFyc1Bvc2l0aW9uID0gW1wiZHJhZ3NcIiwgXCJmcm9tTWF0aGVyXCIsIFwiaGV0ZXJvXCIsIFwiaG9tb1wiXTtcblxuXG4gICAgICAvL9C60LDQuiDQv9GA0LXQtNGB0YLQsNCy0LvQtdC90YvQtSDQtNCw0L3QvdGL0LUg0LIg0Y3Qu9C10LzQtdC90YLQtSDQvNCw0YLRgNC40YbQuFxuICAgICAgbGV0IGxlZ2VuZCA9IHtcbiAgICAgICAgZHJhZ3M6IDAsXG4gICAgICAgIGhldGVybzogMSxcbiAgICAgICAgaG9tbzogMixcbiAgICAgICAgZnJvbU1hdGhlcjogM1xuICAgICAgfTtcblxuICAgICAgbGV0IHZhbE1hdHJpeCA9IFtcbiAgICAgICAgWzMuMywgNDMsIDUzLCAwLjddLFxuICAgICAgICBbNiwgNDEsIDUyLjksIDAuMV0sXG4gICAgICAgIFs4NCwgNywgOC43LCAwLjNdLFxuICAgICAgICBbODcsIDEwLjksIDEuOSwgMC4yXSxcbiAgICAgICAgWzc5LjEsIDE3LjgsIDIuNywgMC40XSxcbiAgICAgICAgWzkxLjgsIDcuNCwgMC42LCAwLjFdLFxuICAgICAgICBbOTUuNSwgNC4yLCAwLjIsIDAuMV0sXG4gICAgICAgIFs5My4yLCA2LjQsIDAuMiwgMC4yXSxcbiAgICAgICAgWzgxLjIsIDE3LjcsIDAuNCwgMC43XSxcbiAgICAgICAgWzcyLjMsIDI1LjQsIDAuNSwgMS43XSxcbiAgICAgICAgWzY2LjcsIDI5LjksIDAuOCwgMi41XSxcbiAgICAgICAgWzY0LjEsIDMxLjgsIDEuMSwgMy4wXSxcbiAgICAgICAgWzYzLjMsIDMzLjAsIDAuNywgMi45XSxcbiAgICAgICAgWzYxLjUsIDM1LjIsIDEuMCwgMi4zXSxcbiAgICAgICAgWzYxLjMsIDM1LjYsIDEuMSwgMi4wXSxcbiAgICAgICAgWzU5LjgsIDM3LCAxLjQsIDEuOF0sXG4gICAgICAgIFs1Ny45LCAzOS43LCAxLjMsIDEuMV0sXG4gICAgICAgIFs1Ni4yLCA0MS40LCAxLjMsIDEuMV0sXG4gICAgICAgIFs1Ni40LCA0MS43LCAxLjEsIDAuOF0sXG4gICAgICAgIFs1NC45LCA0My4xLCAxLCAxLjBdLFxuICAgICAgICBbNTguNCwgMzkuNywgMS4xLCAwLjhdXG4gICAgICBdO1xuXG4gICAgICBsZXQgZGVmWWVhclZhbCA9IFsyNSwgMjUsIDI1LCAyNV07XG5cbiAgICAgIGxldCB5ZWFycyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5rZXktcmVhc29uLWNhbnZhcyAueWVhcicpO1xuXG4gICAgICBsZXQgeWVhcnNNb2JpbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKFwiLmtleS1yZWFzb24tbW9iaWxlIC55ZWFyXCIpO1xuXG4gICAgICBsZXQgc2V0VmFsdWUgPSBmdW5jdGlvbih5ZWFyLCB2YWxBcnIpIHtcbiAgICAgICAgbGV0IGJhcnMgPSB5ZWFyLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuYmFyXCIpO1xuICAgICAgICBbXS5mb3JFYWNoLmNhbGwoYmFycywgZnVuY3Rpb24oZWxlbSwgaSkge1xuICAgICAgICAgIGxldCBuYW1lID0gYmFyc1Bvc2l0aW9uW2ldO1xuICAgICAgICAgIGxldCBwZXJjZW50ID0gdmFsQXJyW2xlZ2VuZFtuYW1lXV07XG4gICAgICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKG5hbWUpO1xuICAgICAgICAgIGVsZW0uc3R5bGUuaGVpZ2h0ID0gcGVyY2VudCArIFwiJVwiO1xuICAgICAgICB9KTtcbiAgICAgIH07XG5cbiAgICAgIGxldCBzZXRWYWx1ZU1vYmlsZSA9IGZ1bmN0aW9uKHllYXIsIHZhbEFycikge1xuICAgICAgICBsZXQgYmFycyA9IHllYXIucXVlcnlTZWxlY3RvckFsbChcIi5iYXJcIik7XG4gICAgICAgIFtdLmZvckVhY2guY2FsbChiYXJzLCBmdW5jdGlvbihlbGVtLCBpKSB7XG4gICAgICAgICAgbGV0IG5hbWUgPSBiYXJzUG9zaXRpb25baV07XG4gICAgICAgICAgbGV0IHBlcmNlbnQgPSB2YWxBcnJbbGVnZW5kW25hbWVdXTtcbiAgICAgICAgICBlbGVtLmNsYXNzTGlzdC5hZGQobmFtZSk7XG4gICAgICAgICAgZWxlbS5zdHlsZS53aWR0aCA9IHBlcmNlbnQgKyBcIiVcIjtcbiAgICAgICAgfSk7XG4gICAgICB9O1xuXG4gICAgICBsZXQgc2V0WWVhcnMgPSAoaSwgZm4sIHllYXJzKSA9PiB7XG4gICAgICAgIGlmIChpID4geWVhcnMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICQoXCIua2V5LXJlYXNvbi1tb2JpbGUteWVhci10ZXh0XCIpLmNzcyh7XG4gICAgICAgICAgICBvcGFjaXR5OiAwLjksXG4gICAgICAgICAgfSlcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZm4oeWVhcnNbaV0sIHZhbE1hdHJpeFtpXSk7XG4gICAgICAgIHNldFRpbWVvdXQoc2V0WWVhcnMsIDgwLCArK2ksIGZuLCB5ZWFycyk7XG4gICAgICB9O1xuXG4gICAgICBsZXQgc3RhcnRJbmRleCA9IDA7XG5cbiAgICAgIGxldCBzaG93ID0gKCkgPT4ge1xuICAgICAgICAvLyBzZXRZZWFycyhzdGFydEluZGV4LCBzZXRWYWx1ZSwgeWVhcnMpXG4gICAgICAgIHNldFRpbWVvdXQoc2V0WWVhcnMsIDEwMDAsIDAsIHNldFZhbHVlLCB5ZWFycyk7XG4gICAgICAgIHNldFRpbWVvdXQoc2V0WWVhcnMsIDEwMDAsIDAsIHNldFZhbHVlTW9iaWxlLCB5ZWFyc01vYmlsZSk7XG4gICAgICB9XG5cbiAgICAgIC8vbW92ZSBpbml0IHRvIHNvbWUgZ2xvYmFsIGluaXRcblxuICAgICAgbGV0IGluaXRZZWFycyA9IChpLCBmbiwgeWVhcnMpID0+IHtcbiAgICAgICAgaWYgKGkgPiAyMCkgcmV0dXJuO1xuICAgICAgICBmbih5ZWFyc1tpXSwgZGVmWWVhclZhbCk7XG4gICAgICAgIGluaXRZZWFycygrK2ksIGZuLCB5ZWFycyk7XG4gICAgICB9O1xuXG4gICAgICBpbml0WWVhcnMoc3RhcnRJbmRleCwgc2V0VmFsdWUsIHllYXJzKTtcbiAgICAgIGluaXRZZWFycyhzdGFydEluZGV4LCBzZXRWYWx1ZU1vYmlsZSwgeWVhcnNNb2JpbGUpXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIHNob3c6IHNob3csXG4gICAgICB9XG5cbiAgICB9KSgpO1xuXG5cbiAgICAvKlxuICAgIOKWiOKWiCAgICDilojiloggIOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiFxuICAgIOKWiOKWiCAgICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgIOKWiOKWiCDilojilogg4paI4paIICAgICAg4paI4paIICDilojiloggIOKWiOKWiCAgICAgIOKWiOKWiCAgIOKWiOKWiFxuICAgIOKWiOKWiCAgICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiCAgIOKWiOKWiOKWiOKWiOKWiOKWiFxuICAgICDilojiloggIOKWiOKWiCAg4paI4paIICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAgICAgIOKWiOKWiCDilojiloggICAgICDilojiloggIOKWiOKWiCAg4paI4paIICAgICAg4paI4paIICAg4paI4paIXG4gICAgICDilojilojilojiloggICDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAg4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paIICAg4paI4paIXG4gICAgKi9cblxuXG4gICAgbGV0IHZhbFBpY2tlciA9IGZ1bmN0aW9uKGZuLCBzdGF0ZSkge1xuXG4gICAgICBsZXQgbWV0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVkLW1ldGVyLTknKTtcbiAgICAgIGxldCBncmVlbk1ldGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRoZXJtb21ldGVyLTkgLmdyZWVuLW1ldGVyLTknKTtcbiAgICAgIGxldCByaWJib25TbGlkZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcjcmliYm9uLXNsaWRlci05Jyk7XG4gICAgICBsZXQgcGVyY2VudDtcbiAgICAgIGxldCBtYXggPSA4NDg7XG4gICAgICBsZXQgdGV4dCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5yZWQtbWV0ZXItOT5kaXYnKTtcbiAgICAgIGxldCByaWdodEFuc3dlciA9IDEyO1xuXG5cbiAgICAgIGxldCByZW5kZXJNb2JpbGUgPSAocGVyY2VudCkgPT4ge1xuICAgICAgICAkKFwiLmFuc3dlcnMtbW9iaWxlLmhpZGUtZGVza3RvcCAucmVkLW1ldGVyLTlcIilbMF0uc3R5bGUubGVmdCA9ICgtMSArIHBlcmNlbnQpICogMTAwICsgXCIlXCI7XG4gICAgICAgICQoXCIudmFsdWVwaWNrZXItbW9iaWxlLXBpY2tlci05XCIpWzBdLnN0eWxlLmxlZnQgPSAocGVyY2VudCkgKiAyMzUgKyBcInB4XCI7XG4gICAgICAgICQoXCIudmFsdWVwaWNrZXItbW9iaWxlLXBpY2tlci05XCIpLnRleHQoTWF0aC5yb3VuZChwZXJjZW50ICogMTQpICsgMSk7XG4gICAgICB9XG5cblxuICAgICAgbGV0IHJlbmRlciA9IChwZXJjZW50KSA9PiB7XG4gICAgICAgIHJlbmRlck1vYmlsZShwZXJjZW50KVxuICAgICAgICByaWJib25TbGlkZXIuc3R5bGUubGVmdCA9IHBlcmNlbnQgKiBtYXggKyBcInB4XCI7XG4gICAgICAgIG1ldGVyLnN0eWxlLmxlZnQgPSAoMCAtICgxIC0gcGVyY2VudCkgKiAxMDApICsgXCIlXCI7XG4gICAgICAgIHRleHQuaW5uZXJIVE1MID0gTWF0aC5yb3VuZChwZXJjZW50ICogMTQpICsgMTtcbiAgICAgICAgaWYgKHBlcmNlbnQgPCAwLjA3NSkge1xuICAgICAgICAgIG1ldGVyLmNsYXNzTGlzdC5hZGQoXCJzbWFsbFwiKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtZXRlci5jbGFzc0xpc3QucmVtb3ZlKFwic21hbGxcIik7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHBlcmNlbnQgPiAwLjkyKSB7XG4gICAgICAgICAgZ3JlZW5NZXRlci5jbGFzc0xpc3QuYWRkKFwiYmlnXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGdyZWVuTWV0ZXIuY2xhc3NMaXN0LnJlbW92ZShcImJpZ1wiKTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgcmVuZGVyKDAuNCk7XG5cbiAgICAgIGxldCBvbkRyYWcgPSAoZXZlbnQsIHVpKSA9PiB7XG4gICAgICAgIHVpLnBvc2l0aW9uLmxlZnQgPSBNYXRoLm1pbig4NDgsIHVpLnBvc2l0aW9uLmxlZnQpO1xuICAgICAgICBwZXJjZW50ID0gdWkucG9zaXRpb24ubGVmdCAvIDg0ODtcbiAgICAgICAgcmVuZGVyKHBlcmNlbnQpO1xuICAgICAgICAvL9C+0LHRgNCw0LHQvtGC0LrRgyDQv9GA0LDQstC40LvRjNC90L4g0L7RgtCy0LXRgtCwINGA0LXRiNC40Lsg0L/RgNC+0LLQvtC00LjRgtGMINCyINGB0LXRgNC10LrRgtC+0YDQtSDQv9C+INGN0YLQvtC80YMg0LzQvtC20L3QvlxuICAgICAgICAvLyDQvdC1INC/0LXRgNC10LTQvtCy0LDRgtGMINGB0L7RgdGC0L7Rj9C90LjQtSDRgdC10LvQtdC60YLQvtGA0LAg0LIg0YHQvtGB0YLQvtGP0L3QuNC1INCy0L7Qv9GA0L7RgdCwXG4gICAgICAgIHN0YXRlLnNlbGVjdGVkID0gTWF0aC5yb3VuZChwZXJjZW50ICogMTQpICsgMTtcbiAgICAgICAgZm4oKTtcbiAgICAgIH07XG5cbiAgICAgICQocmliYm9uU2xpZGVyKS5kcmFnZ2FibGUoe1xuICAgICAgICBjb250YWlubWVudDogXCJwYXJlbnRcIixcbiAgICAgICAgYXhpczogXCJ4XCIsXG4gICAgICAgIGRyYWc6IG9uRHJhZyxcbiAgICAgIH0pO1xuXG4gICAgICBsZXQgb25EcmFnTW9iaWxlID0gKGV2ZW50LCB1aSkgPT4ge1xuICAgICAgICBwZXJjZW50ID0gdWkucG9zaXRpb24ubGVmdCAvIDIzNTtcbiAgICAgICAgcmVuZGVyKHBlcmNlbnQpO1xuXG4gICAgICAgIC8v0L7QsdGA0LDQsdC+0YLQutGDINC/0YDQsNCy0LjQu9GM0L3QviDQvtGC0LLQtdGC0LAg0YDQtdGI0LjQuyDQv9GA0L7QstC+0LTQuNGC0Ywg0LIg0YHQtdGA0LXQutGC0L7RgNC1INC/0L4g0Y3RgtC+0LzRgyDQvNC+0LbQvdC+XG4gICAgICAgIC8vINC90LUg0L/QtdGA0LXQtNC+0LLQsNGC0Ywg0YHQvtGB0YLQvtGP0L3QuNC1INGB0LXQu9C10LrRgtC+0YDQsCDQsiDRgdC+0YHRgtC+0Y/QvdC40LUg0LLQvtC/0YDQvtGB0LBcbiAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSBNYXRoLnJvdW5kKHBlcmNlbnQgKiAxNCkgKyAxO1xuICAgICAgICAvL2NhbGxiYWNrIGNhbGxcbiAgICAgICAgZm4oKTtcbiAgICAgIH07XG5cbiAgICAgICQoXCIudmFsdWVwaWNrZXItbW9iaWxlLXBpY2tlci05XCIpLmRyYWdnYWJsZSh7XG4gICAgICAgIGNvbnRhaW5tZW50OiBcInBhcmVudFwiLFxuICAgICAgICBheGlzOiBcInhcIixcbiAgICAgICAgZHJhZzogb25EcmFnTW9iaWxlLFxuICAgICAgfSk7XG5cblxuICAgICAgbGV0IGlzUmlnaHQgPSAoKSA9PiAoTWF0aC5yb3VuZChwZXJjZW50ICogMTQpICsgMSA9PSByaWdodEFuc3dlcilcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaXNSaWdodFxuICAgICAgfVxuICAgIH07XG5cbiAgICAvKlxuICAgIOKWiOKWiCAgICDilojiloggIOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIXG4gICAg4paI4paIICAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAgICAg4paI4paIICAg4paI4paIIOKWiOKWiCDilojiloggICAgICDilojiloggIOKWiOKWiCAg4paI4paIICAgICAg4paI4paIICAg4paI4paIICAgICAg4paI4paIXG4gICAg4paI4paIICAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojilogg4paI4paIICAgICAg4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paIXG4gICAgIOKWiOKWiCAg4paI4paIICDilojiloggICDilojilogg4paI4paIICAgICAg4paI4paIICAgICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAg4paI4paIICDilojiloggICAgICDilojiloggICDilojilogg4paI4paIXG4gICAgICDilojilojilojiloggICDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAg4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paIICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiFxuICAgICovXG5cblxuICAgIGxldCB2YWxQaWNrZXIyID0gZnVuY3Rpb24oZm4sIHN0YXRlKSB7XG4gICAgICBsZXQgbWV0ZXIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmVkLW1ldGVyLTgnKTtcbiAgICAgIGxldCBncmVlbk1ldGVyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnRoZXJtb21ldGVyIC5ncmVlbi1tZXRlcicpO1xuICAgICAgbGV0IHJpYmJvblNsaWRlciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJyNyaWJib24tc2xpZGVyLTgnKTtcbiAgICAgIGxldCBwZXJjZW50O1xuICAgICAgbGV0IG1heCA9IDg0ODtcbiAgICAgIGxldCB0ZXh0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnJlZC1tZXRlci04PmRpdicpO1xuICAgICAgbGV0IHJpZ2h0QW5zd2VyID0gNDA7XG5cblxuICAgICAgbGV0IHJlbmRlck1vYmlsZSA9IChwZXJjZW50KSA9PiB7XG4gICAgICAgICQoXCIuYW5zd2Vycy1tb2JpbGUuaGlkZS1kZXNrdG9wIC5yZWQtbWV0ZXItOFwiKVswXS5zdHlsZS5sZWZ0ID0gKC0xICsgcGVyY2VudCkgKiAxMDAgKyBcIiVcIjtcbiAgICAgICAgJChcIi52YWx1ZXBpY2tlci1tb2JpbGUtcGlja2VyLThcIilbMF0uc3R5bGUubGVmdCA9IChwZXJjZW50KSAqIDIzNSArIFwicHhcIjtcbiAgICAgICAgJChcIi52YWx1ZXBpY2tlci1tb2JpbGUtcGlja2VyLThcIikudGV4dChNYXRoLnJvdW5kKHBlcmNlbnQgKiAxMDApICsgXCIlXCIpO1xuICAgICAgfVxuXG4gICAgICBsZXQgcmVuZGVyID0gKHBlcmNlbnQpID0+IHtcbiAgICAgICAgcmVuZGVyTW9iaWxlKHBlcmNlbnQpO1xuICAgICAgICByaWJib25TbGlkZXIuc3R5bGUubGVmdCA9IHBlcmNlbnQgKiBtYXggKyBcInB4XCI7XG4gICAgICAgIG1ldGVyLnN0eWxlLmxlZnQgPSAoMCAtICgxIC0gcGVyY2VudCkgKiAxMDApICsgXCIlXCI7XG4gICAgICAgIHRleHQuaW5uZXJIVE1MID0gTWF0aC5yb3VuZChwZXJjZW50ICogMTAwKSArIFwiJVwiO1xuICAgICAgICBpZiAocGVyY2VudCA8IDAuMDc1KSB7XG4gICAgICAgICAgbWV0ZXIuY2xhc3NMaXN0LmFkZChcInNtYWxsXCIpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1ldGVyLmNsYXNzTGlzdC5yZW1vdmUoXCJzbWFsbFwiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocGVyY2VudCA+IDAuOTIpIHtcbiAgICAgICAgICBncmVlbk1ldGVyLmNsYXNzTGlzdC5hZGQoXCJiaWdcIik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZ3JlZW5NZXRlci5jbGFzc0xpc3QucmVtb3ZlKFwiYmlnXCIpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZW5kZXIoMC41KTtcblxuICAgICAgbGV0IG9uRHJhZyA9IChldmVudCwgdWkpID0+IHtcbiAgICAgICAgdWkucG9zaXRpb24ubGVmdCA9IE1hdGgubWluKDg0OCwgdWkucG9zaXRpb24ubGVmdCk7XG4gICAgICAgIHBlcmNlbnQgPSB1aS5wb3NpdGlvbi5sZWZ0IC8gODQ4O1xuICAgICAgICByZW5kZXIocGVyY2VudCk7XG5cbiAgICAgICAgLy/QvtCx0YDQsNCx0L7RgtC60YMg0L/RgNCw0LLQuNC70YzQvdC+INC+0YLQstC10YLQsCDRgNC10YjQuNC7INC/0YDQvtCy0L7QtNC40YLRjCDQsiDRgdC10YDQtdC60YLQvtGA0LUg0L/QviDRjdGC0L7QvNGDINC80L7QttC90L5cbiAgICAgICAgLy8g0L3QtSDQv9C10YDQtdC00L7QstCw0YLRjCDRgdC+0YHRgtC+0Y/QvdC40LUg0YHQtdC70LXQutGC0L7RgNCwINCyINGB0L7RgdGC0L7Rj9C90LjQtSDQstC+0L/RgNC+0YHQsFxuICAgICAgICBzdGF0ZS5zZWxlY3RlZCA9IE1hdGgucm91bmQocGVyY2VudCAqIDEwMCk7XG4gICAgICAgIGZuKCk7XG4gICAgICB9O1xuXG4gICAgICAkKHJpYmJvblNsaWRlcikuZHJhZ2dhYmxlKHtcbiAgICAgICAgY29udGFpbm1lbnQ6IFwicGFyZW50XCIsXG4gICAgICAgIGF4aXM6IFwieFwiLFxuICAgICAgICBkcmFnOiBvbkRyYWcsXG4gICAgICB9KTtcblxuXG4gICAgICBsZXQgb25EcmFnTW9iaWxlID0gKGV2ZW50LCB1aSkgPT4ge1xuICAgICAgICBwZXJjZW50ID0gdWkucG9zaXRpb24ubGVmdCAvIDIzNTtcbiAgICAgICAgcmVuZGVyKHBlcmNlbnQpO1xuXG4gICAgICAgIC8v0L7QsdGA0LDQsdC+0YLQutGDINC/0YDQsNCy0LjQu9GM0L3QviDQvtGC0LLQtdGC0LAg0YDQtdGI0LjQuyDQv9GA0L7QstC+0LTQuNGC0Ywg0LIg0YHQtdGA0LXQutGC0L7RgNC1INC/0L4g0Y3RgtC+0LzRgyDQvNC+0LbQvdC+XG4gICAgICAgIC8vINC90LUg0L/QtdGA0LXQtNC+0LLQsNGC0Ywg0YHQvtGB0YLQvtGP0L3QuNC1INGB0LXQu9C10LrRgtC+0YDQsCDQsiDRgdC+0YHRgtC+0Y/QvdC40LUg0LLQvtC/0YDQvtGB0LBcbiAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSBNYXRoLnJvdW5kKHBlcmNlbnQgKiAxMDApO1xuICAgICAgICAvL2NhbGxiYWNrIGNhbGxcbiAgICAgICAgZm4oKTtcbiAgICAgIH07XG5cbiAgICAgICQoXCIudmFsdWVwaWNrZXItbW9iaWxlLXBpY2tlci04XCIpLmRyYWdnYWJsZSh7XG4gICAgICAgIGNvbnRhaW5tZW50OiBcInBhcmVudFwiLFxuICAgICAgICBheGlzOiBcInhcIixcbiAgICAgICAgZHJhZzogb25EcmFnTW9iaWxlLFxuICAgICAgfSk7XG5cbiAgICAgIGxldCBpc1JpZ2h0ID0gKCkgPT4ge1xuICAgICAgICBsZXQgYW5zd2VyID0gIE1hdGgucm91bmQocGVyY2VudCAqIDEwMClcblxuICAgICAgICByZXR1cm4gYW5zd2VyID4gMzUgJiYgYW5zd2VyIDwgNDU7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzUmlnaHRcbiAgICAgIH1cblxuICAgIH07XG5cbiAgICAvKlxuICAgIOKWiOKWiCAgICDilojiloggIOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIXG4gICAg4paI4paIICAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAgICAg4paI4paIICAg4paI4paIIOKWiOKWiCDilojiloggICAgICDilojiloggIOKWiOKWiCAg4paI4paIICAgICAg4paI4paIICAg4paI4paIICAgICAg4paI4paIXG4gICAg4paI4paIICAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paIICAgICAg4paI4paI4paI4paI4paI4paIICDilojilogg4paI4paIICAgICAg4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paI4paIICAg4paI4paI4paI4paI4paIXG4gICAgIOKWiOKWiCAg4paI4paIICDilojiloggICDilojilogg4paI4paIICAgICAg4paI4paIICAgICAg4paI4paIIOKWiOKWiCAgICAgIOKWiOKWiCAg4paI4paIICDilojiloggICAgICDilojiloggICDilojiloggICAgICDilojilohcbiAgICAgIOKWiOKWiOKWiOKWiCAgIOKWiOKWiCAgIOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paIICAgICAg4paI4paIICDilojilojilojilojilojilogg4paI4paIICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojilogg4paI4paI4paI4paI4paI4paIXG4gICAgKi9cblxuXG4gICAgbGV0IHZhbFBpY2tlcjMgPSBmdW5jdGlvbihmbiwgc3RhdGUpIHtcbiAgICAgIGxldCBjaXJjbGUgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3Vlc3MtZ3Jvd3RoLW1haW4tc21hbGwnKTtcbiAgICAgIGxldCB0ZXh0RmVhbGQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuZ3Vlc3MtZ3Jvd3RoLW1haW4tdGV4dCcpO1xuICAgICAgbGV0IGJhc2VSID0gMzguMzMzMzMzMzMzMztcbiAgICAgIGxldCByID0gMzguMzMzMzMzMzMzMztcbiAgICAgIGxldCBoID0gMDtcbiAgICAgIGxldCB0ZXh0ID0gXCIxIDAwMCAwMDBcIjtcbiAgICAgIGxldCBzZWxlY3RlZFZhbCA9IDA7XG4gICAgICBsZXQgYmFzZVZhbCA9IDEwMDAwMDA7XG4gICAgICBsZXQgdG90YWxWYWwgPSAxMDAwMDAwO1xuXG4gICAgICBsZXQgdmFsVG9UZXh0ID0gdmFsID0+IHtcbiAgICAgICAgdmFsID0gTWF0aC5yb3VuZCh2YWwgLyAxMDApICogMTAwO1xuXG4gICAgICAgIGxldCBhcnIgPSAodmFsICsgXCJcIikuc3BsaXQoXCJcIik7XG4gICAgICAgIGFyci5zcGxpY2UoNCwgMCwgXCIgXCIpO1xuICAgICAgICBhcnIuc3BsaWNlKDEsIDAsIFwiIFwiKTtcbiAgICAgICAgcmV0dXJuIGFyci5qb2luKFwiXCIpO1xuICAgICAgfTtcblxuXG4gICAgICBsZXQgY2hhbmdlUiA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBjaXJjbGUuc3R5bGUud2lkdGggPSByICsgXCJweFwiO1xuICAgICAgICBjaXJjbGUuc3R5bGUuaGVpZ2h0ID0gciArIFwicHhcIjtcbiAgICAgIH07XG5cbiAgICAgIGxldCBjaGFuZ2VUZXh0ID0gKCkgPT4gdGV4dEZlYWxkLmlubmVySFRNTCA9IHRleHQ7XG5cbiAgICAgIGxldCBjYWxjdWxldGVOZXdSID0gcGVyc2VudCA9PiBiYXNlUiArIGJhc2VSKnBlcnNlbnQgO1xuXG4gICAgICBsZXQgY2FsY3VsZXRlTmV3VmFsID0gcGVyc2VudCA9PiBiYXNlVmFsICsgYmFzZVZhbCpwZXJzZW50O1xuXG4gICAgICBsZXQgb25EcmFnID0gKGV2ZW50LCB1aSkgPT4ge1xuXG4gICAgICAgIGggPSB1aS5wb3NpdGlvbi50b3A7XG4gICAgICAgIGxldCBwZXJzZW50ICA9ICgxIC0gaCAvIDIzMCkgKiA1XG4gICAgICAgIHIgPSBjYWxjdWxldGVOZXdSKHBlcnNlbnQpO1xuICAgICAgICBzZWxlY3RlZFZhbCA9IGNhbGN1bGV0ZU5ld1ZhbChwZXJzZW50KVxuICAgICAgICB0ZXh0ID0gdmFsVG9UZXh0KHNlbGVjdGVkVmFsKTtcbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNoYW5nZVIpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2hhbmdlVGV4dCk7XG4gICAgICAgIC8v0YfRgtC+INC30LDQv9C40YHRi9Cy0LDRgtGMINCyINGB0L7RgdGC0L7Rj9C90LjQtS4g0K3RgtC+INCy0L7QvtCx0YnQtSDQuNGB0L/QvtC70YzQt9GD0LXRgtGB0Y8/XG4gICAgICAgIHN0YXRlLnNlbGVjdGVkID0gaCAvIDIzMDtcbiAgICAgICAgZm4oKTtcbiAgICAgIH07XG5cbiAgICAgIGxldCBvbkRyYWdZID0gKGV2ZW50LCB1aSkgPT4ge1xuICAgICAgICBoID0gdWkucG9zaXRpb24ubGVmdDtcbiAgICAgICAgbGV0IHBlcnNlbnQgID0gKCBoIC8gMjMwKSAqIDVcbiAgICAgICAgciA9IGNhbGN1bGV0ZU5ld1IocGVyc2VudCk7XG4gICAgICAgIHNlbGVjdGVkVmFsID0gY2FsY3VsZXRlTmV3VmFsKHBlcnNlbnQpXG4gICAgICAgIHRleHQgPSB2YWxUb1RleHQoc2VsZWN0ZWRWYWwpO1xuICAgICAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2hhbmdlUik7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShjaGFuZ2VUZXh0KTtcbiAgICAgICAgLy/Rh9GC0L4g0LfQsNC/0LjRgdGL0LLQsNGC0Ywg0LIg0YHQvtGB0YLQvtGP0L3QuNC1LiDQrdGC0L4g0LLQvtC+0LHRidC1INC40YHQv9C+0LvRjNC30YPQtdGC0YHRjz9cbiAgICAgICAgc3RhdGUuc2VsZWN0ZWQgPSBoIC8gMjMwO1xuICAgICAgICBmbigpO1xuICAgICAgfTtcblxuICAgICAgJChcIi52YWx1ZXBpY2tlci1tb2JpbGUtcGlja2VyXCIpLmRyYWdnYWJsZSh7XG4gICAgICAgIGNvbnRhaW5tZW50OiBcInBhcmVudFwiLFxuICAgICAgICBheGlzOiBcInhcIixcbiAgICAgICAgZHJhZzogb25EcmFnWSxcbiAgICAgIH0pO1xuXG4gICAgICAkKFwiLnZhbHVlcGlja2VyLXBpY2tlclwiKS5kcmFnZ2FibGUoe1xuICAgICAgICBjb250YWlubWVudDogXCJwYXJlbnRcIixcbiAgICAgICAgYXhpczogXCJ5XCIsXG4gICAgICAgIGRyYWc6IG9uRHJhZyxcbiAgICAgIH0pO1xuXG5cbiAgICAgIGxldCBpc1JpZ2h0ID0gKCkgPT4gKHNlbGVjdGVkVmFsID4gMzAwMDAwMCAmJiBzZWxlY3RlZFZhbCA8IDQwMDAwMDApXG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGlzUmlnaHRcbiAgICAgIH1cbiAgICB9O1xuXG5cblxuICAgIGZ1bmN0aW9uIGhvb2tVcFZhbFF1ZXN0b24oaWQsIHF1ZXN0aW9uLCBWYWxQaWNrZXIsIEFuc3dlclNlbGVjdG9ycywgb25BbnN3ZXIpIHtcblxuICAgICAgbGV0IGFuc3dlckJ1dHRvbiA9IHF1ZXN0aW9uLmZpbmQoXCIuYW5zd2VyQnV0dG9uXCIpO1xuICAgICAgbGV0IGFuc3dlciA9ICQoQW5zd2VyU2VsZWN0b3JzKTtcbiAgICAgIHRoaXMuaXNTaG93biA9IGZhbHNlO1xuXG5cbiAgICAgIGxldCBpbml0QW5zd2VycyA9ICgpID0+IHtcbiAgICAgICAgaGlkZUVsZW0oYW5zd2VyKVxuICAgICAgfTtcblxuICAgICAgbGV0IHNob3dBbnN3ZXJzID0gKCkgPT4ge1xuICAgICAgICBzaG93RWxlbShhbnN3ZXIpO1xuICAgICAgICBvbkFuc3dlciAmJiBvbkFuc3dlcigpO1xuICAgICAgICAvLyBzY3JvbGxUb0VsZW1DZW50ZXIoYW5zd2VyKVxuICAgICAgICBzY3JvbGxUb0VsZW1Ub3AoJCgkKFwiLmFuc3dlckJ1dHRvblwiKVtpZF0pKVxuICAgICAgfTtcblxuICAgICAgbGV0IGluaXRRdWVzdGlvbiA9ICgpID0+IHtcbiAgICAgICAgaGlkZUVsZW0ocXVlc3Rpb24pO1xuICAgICAgfTtcblxuICAgICAgbGV0IHNob3dRdWVzdGluID0gKCkgPT4ge1xuICAgICAgICBzaG93RWxlbShxdWVzdGlvbilcbiAgICAgICAgLy8gc2Nyb2xsVG9FbGVtQ2VudGVyKHF1ZXN0aW9uKVxuICAgICAgICBzY3JvbGxUb0VsZW1Ub3AoJCgkKCcuZm9vdGVyJylbaWRdKSlcbiAgICAgIH07XG5cbiAgICAgIGxldCBzdGF0ZSA9IHtcbiAgICAgICAgc2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzQW5zd2VyZWQ6IGZhbHNlLFxuICAgICAgICByaWdodDogMTIsXG4gICAgICB9O1xuXG4gICAgICBsZXQgcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChzdGF0ZS5pc0Fuc3dlcmVkKSB7XG4gICAgICAgICAgcmVtb3ZlQnV0dG9uKCk7XG4gICAgICAgICAgZGlzYWJsZVNjcm9sbCA9IHRydWU7XG4gICAgICAgICAgc2V0VGltZW91dChzaG93QW5zd2VycywgMTAwMCk7XG4gICAgICAgICAgcXVlc3Rpb24uYWRkQ2xhc3MoXCJhbnN3ZXJlZFwiKTtcbiAgICAgICAgICBzaWRlQmFycy5yZW5kZXIoKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhdGUuc2VsZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgICBhbnN3ZXJCdXR0b24uYWRkQ2xhc3MoXCJhY3RpdmVcIik7XG4gICAgICAgIH07XG4gICAgICB9O1xuXG4gICAgICBsZXQgcmVtb3ZlQnV0dG9uID0gKCkgPT4ge1xuICAgICAgICBhbnN3ZXJCdXR0b24uY3NzKHtcbiAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiXG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgbGV0IHZhbFBpY2tlciA9IFZhbFBpY2tlcihyZW5kZXIsIHN0YXRlKTtcblxuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgdGhpcy5yZXN1bHQgPSBudWxsO1xuXG4gICAgICAvL0NsaWNrIG9uIGFuc3dlclxuICAgICAgYW5zd2VyQnV0dG9uLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBzdGF0ZS5pc0Fuc3dlcmVkID0gdHJ1ZTtcbiAgICAgICAgdGhhdC5yZXN1bHQgPSB2YWxQaWNrZXIuaXNSaWdodCgpXG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vU2hvdyBxdWVzdGlvblxuICAgICAgJCgnLnNjcm9sbEJ0bicpW2lkXS5vbmNsaWNrID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoYXQuc2hvdygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmluaXQgPSAoKSA9PiB7XG4gICAgICAgIGluaXRRdWVzdGlvbigpO1xuICAgICAgICBpbml0QW5zd2VycygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnNob3cgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgc2lkZUJhcnMuc2VsZWN0KGlkKTtcbiAgICAgICAgaWYgKGlkID09IDApIHtcbiAgICAgICAgICBzaWRlQmFycy5zaG93KClcbiAgICAgICAgfVxuICAgICAgICBzaG93UXVlc3RpbigpO1xuICAgICAgICB0aGlzLmlzU2hvd24gPSB0cnVlO1xuICAgICAgfVxuXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIGhvb2tVcFF1ZXN0b24oaWQsIHF1ZXN0aW9uLCByaWdodCwgQW5zd2VyU2VsZWN0b3JzLCBvbkFuc3dlcikge1xuXG5cbiAgICAgIGxldCBhbnN3ZXJCdXR0b24gPSBxdWVzdGlvbi5maW5kKFwiLmFuc3dlckJ1dHRvblwiKTtcbiAgICAgIGxldCBhbnN3ZXIgPSAkKEFuc3dlclNlbGVjdG9ycyk7XG5cblxuICAgICAgbGV0IGluaXRBbnN3ZXJzID0gKCkgPT4ge1xuICAgICAgICBoaWRlRWxlbShhbnN3ZXIpXG4gICAgICB9O1xuXG4gICAgICBsZXQgc2hvd0Fuc3dlcnMgPSAoKSA9PiB7XG4gICAgICAgIHNob3dFbGVtKGFuc3dlcik7XG4gICAgICAgIG9uQW5zd2VyICYmIG9uQW5zd2VyKCk7XG4gICAgICAgIC8vIHNjcm9sbFRvRWxlbUNlbnRlcihhbnN3ZXIpXG4gICAgICAgIHNjcm9sbFRvRWxlbVRvcCgkKCQoXCIuYW5zd2VyQnV0dG9uXCIpW2lkXSkpXG4gICAgICB9O1xuXG4gICAgICBsZXQgaW5pdFF1ZXN0aW9uID0gKCkgPT4ge1xuICAgICAgICBoaWRlRWxlbShxdWVzdGlvbik7XG4gICAgICB9O1xuXG5cbiAgICAgIGxldCBzaG93UXVlc3RpbiA9ICgpID0+IHtcbiAgICAgICAgc2hvd0VsZW0ocXVlc3Rpb24pO1xuICAgICAgICAvLyBzY3JvbGxUb0VsZW1DZW50ZXIocXVlc3Rpb24pO1xuICAgICAgICBzY3JvbGxUb0VsZW1Ub3AoJCgkKCcuZm9vdGVyJylbaWRdKSlcbiAgICAgIH07XG5cbiAgICAgIGxldCBzdGF0ZSA9IHtcbiAgICAgICAgc2VsZWN0ZWQ6IG51bGwsXG4gICAgICAgIGlzQW5zd2VyZWQ6IGZhbHNlLFxuICAgICAgICByaWdodDogcmlnaHQsXG4gICAgICB9O1xuXG4gICAgICBsZXQgcmVuZGVyID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmIChzdGF0ZS5pc0Fuc3dlcmVkKSB7XG4gICAgICAgICAgZGlzYWJsZVNjcm9sbCA9IHRydWU7XG4gICAgICAgICAgcmVtb3ZlQnV0dG9uKCk7XG4gICAgICAgICAgc2V0VGltZW91dChzaG93QW5zd2VycywgMTAwMCk7XG4gICAgICAgICAgcXVlc3Rpb24uYWRkQ2xhc3MoXCJhbnN3ZXJlZFwiKTtcbiAgICAgICAgICBzaWRlQmFycy5yZW5kZXIoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAoc3RhdGUuc2VsZWN0ZWQgIT09IG51bGwpIHtcbiAgICAgICAgICAgIGFuc3dlckJ1dHRvbi5hZGRDbGFzcyhcImFjdGl2ZVwiKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmVuZGVyT3B0aW9ucygpO1xuICAgICAgfTtcblxuICAgICAgbGV0IG9wdGlvbnMgPSBxdWVzdGlvbi5maW5kKFwiLmFuc3dlcnMgLml0ZW0gLmVsZW1cIik7XG5cbiAgICAgIGxldCByZW5kZXJPcHRpb25zID0gKCkgPT4ge1xuICAgICAgICBpZiAoIXN0YXRlLmlzQW5zd2VyZWQpIHtcbiAgICAgICAgICAkLmVhY2gob3B0aW9ucywgZnVuY3Rpb24oaSwgZWxlbSkge1xuICAgICAgICAgICAgaWYgKGkgPT0gc3RhdGUuc2VsZWN0ZWQpIHtcbiAgICAgICAgICAgICAgJChlbGVtKS5hZGRDbGFzcyhcInNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgJChlbGVtKS5yZW1vdmVDbGFzcyhcInNlbGVjdGVkXCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmIChzdGF0ZS5zZWxlY3RlZCAhPT0gc3RhdGUucmlnaHQpIHtcbiAgICAgICAgICAgIG9wdGlvbnNbc3RhdGUuc2VsZWN0ZWRdLmNsYXNzTGlzdC5hZGQoXCJ3cm9uZ1wiKTtcbiAgICAgICAgICAgIG9wdGlvbnNbc3RhdGUuc2VsZWN0ZWRdLmNsYXNzTGlzdC5yZW1vdmUoXCJzZWxlY3RlZFwiKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgb3B0aW9uc1tzdGF0ZS5yaWdodF0uY2xhc3NMaXN0LmFkZChcInJpZ2h0XCIpO1xuICAgICAgICB9O1xuICAgICAgfTtcblxuICAgICAgbGV0IGluaXRPcHRpb25zID0gKCkgPT4ge1xuICAgICAgICBsZXQgb25TZWxlY3QgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICBzdGF0ZS5zZWxlY3RlZCA9IHBhcnNlSW50KGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5pZCk7XG4gICAgICAgICAgcmVuZGVyKCk7XG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMub24oXCJjbGlja1wiLCBvblNlbGVjdCk7XG4gICAgICB9O1xuXG4gICAgICBsZXQgcmVtb3ZlQnV0dG9uID0gKCkgPT4ge1xuICAgICAgICBhbnN3ZXJCdXR0b24uY3NzKHtcbiAgICAgICAgICBvcGFjaXR5OiAwLFxuICAgICAgICAgIHBvaW50ZXJFdmVudHM6IFwibm9uZVwiXG4gICAgICAgIH0pO1xuICAgICAgfTtcblxuICAgICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgICAgdGhpcy5yZXN1bHQgPSBudWxsO1xuXG4gICAgICBhbnN3ZXJCdXR0b24uY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgICAgIHN0YXRlLmlzQW5zd2VyZWQgPSB0cnVlO1xuICAgICAgICB0aGF0LnJlc3VsdCA9IHN0YXRlLnNlbGVjdGVkID09IHN0YXRlLnJpZ2h0XG4gICAgICAgIHJlbmRlcigpO1xuICAgICAgfSk7XG5cbiAgICAgICQoJy5zY3JvbGxCdG4nKVtpZF0ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGF0LnNob3coKTtcbiAgICAgIH1cblxuICAgICAgbGV0IGluaXQgPSAoKSA9PiB7XG4gICAgICAgIGluaXRPcHRpb25zKCk7XG4gICAgICAgIGluaXRRdWVzdGlvbigpO1xuICAgICAgICBpbml0QW5zd2VycygpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLmlzU2hvd24gPSBmYWxzZTtcblxuICAgICAgdGhpcy5zaG93ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHNpZGVCYXJzLnNlbGVjdChpZCk7XG4gICAgICAgIGlmIChpZCA9PSAwKSB7XG4gICAgICAgICAgc2lkZUJhcnMuc2hvdygpXG4gICAgICAgIH1cbiAgICAgICAgc2hvd1F1ZXN0aW4oKTtcbiAgICAgICAgdGhpcy5pc1Nob3duID0gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuaW5pdCA9IGluaXQ7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIEZvb3RlcihpZCkge1xuXG4gICAgICBsZXQgZm9vdGVyID0gJChcIi5wbGF0ZTExLCAubGluZS5ib3R0b21cIik7XG5cbiAgICAgIHRoaXMuaW5pdCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBoaWRlRWxlbShmb290ZXIpXG4gICAgICB9O1xuXG4gICAgICBsZXQgdGhhdCA9IHRoaXM7XG5cbiAgICAgICQoJy5zY3JvbGxCdG4nKVtpZF0ub25jbGljayA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGF0LnNob3coKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMuc2hvdyA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBzaWRlQmFycy5zZWxlY3QoaWQpO1xuICAgICAgICB0aGlzLmlzU2hvd24gPSB0cnVlO1xuICAgICAgICBzaG93RWxlbShmb290ZXIpXG4gICAgICAgIHNjcm9sbFRvRWxlbVRvcCgkKCQoJy5mb290ZXInKVtpZF0pLHRydWUpXG4gICAgICAgIHJlbmRlclJlc3VsdCgpO1xuICAgICAgfTtcblxuICAgIH1cblxuICAgIC8qXG4gICAg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCDilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojilojilojilojilojiloggICDilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paI4paIXG4gICAg4paI4paIICAgICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAgICDilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojilohcbiAgICDilojilojilojilojilojilojilogg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojilojilojilojiloggICDilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojilojilojilojilojiloggIOKWiOKWiOKWiOKWiOKWiOKWiOKWiFxuICAgICAgICAg4paI4paIIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAgICAg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICDilojiloggICAgICDilojilohcbiAgICDilojilojilojilojilojilojilogg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojilojilojilojilojilojilohcbiAgICAqL1xuXG4gICAgZnVuY3Rpb24gU2lkZUJhcnMoKSB7XG4gICAgICBsZXQgc3RhdGUgPSB7XG4gICAgICAgIGlzVmlzaWJsZTogbnVsbCxcbiAgICAgIH1cblxuICAgICAgbGV0ICRtYWluRWxlbSA9ICQoXCIuc2lkZS1wYW5lbFwiKTtcbiAgICAgIGxldCAkc2lkZUJhcnMgPSAkKFwiLnNpZGUtYm94XCIpO1xuXG4gICAgICBsZXQgc2VsZWN0ID0gKGkpID0+IHtcbiAgICAgICAgJHNpZGVCYXJzLnJlbW92ZUNsYXNzKFwiYm94LXNlbGVjdGVkXCIpXG4gICAgICAgICRzaWRlQmFyc1tpXSAmJiAkc2lkZUJhcnNbaV0uY2xhc3NMaXN0LmFkZChcImJveC1zZWxlY3RlZFwiKTtcbiAgICAgIH1cblxuICAgICAgJHNpZGVCYXJzLmNsaWNrKGZ1bmN0aW9uKCkge1xuICAgICAgICBxdWl6RWxlbXNbcGFyc2VJbnQodGhpcy5kYXRhc2V0LmlkKV0uc2hvdygpO1xuICAgICAgICBzZWxlY3QocGFyc2VJbnQodGhpcy5kYXRhc2V0LmlkKSlcbiAgICAgIH0pXG5cbiAgICAgIGxldCByZW5kZXIgPSAoKSA9PiB7XG5cbiAgICAgICAgcXVpekVsZW1zLmZvckVhY2goKGUsIGkpID0+IHtcbiAgICAgICAgICBpZiAoZS5yZXN1bHQgJiYgZS5yZXN1bHQpIHtcbiAgICAgICAgICAgICRzaWRlQmFyc1tpXS5jbGFzc0xpc3QuYWRkKFwiYm94LXRydWVcIilcbiAgICAgICAgICB9IGVsc2UgaWYgKGUucmVzdWx0ID09PSBmYWxzZSkge1xuICAgICAgICAgICAgJHNpZGVCYXJzW2ldLmNsYXNzTGlzdC5hZGQoXCJib3gtZmFsc2VcIilcbiAgICAgICAgICB9XG4gICAgICAgIH0pXG4gICAgICB9XG5cblxuICAgICAgdGhpcy5pc1Nob3duID0gZmFsc2VcbiAgICAgIHRoaXMuc2VsZWN0ID0gc2VsZWN0O1xuICAgICAgdGhpcy5yZW5kZXIgPSByZW5kZXI7XG4gICAgICB0aGlzLnNob3cgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLmlzU2hvd24gPSB0cnVlO1xuICAgICAgICBzaG93RWxlbSgkbWFpbkVsZW0pXG4gICAgICB9XG4gICAgfVxuXG4gICAgbGV0IHNpZGVCYXJzID0gbmV3IFNpZGVCYXJzKCk7XG5cbiAgICBsZXQgZ2V0RGF0YUFuZE1hcCA9IGZ1bmN0aW9uKCkge1xuICAgICAgJChcIi5tYXBfYm9keVwiKS5sb2FkKFwibWFwLnN2Z1wiLGZ1bmN0aW9uKCkge1xuXG4gICAgICBsZXQgYmxvYiA9IG51bGw7XG4gICAgICBsZXQgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG4gICAgICB4aHIub3BlbihcIkdFVFwiLCBcIkhJVl9EYXRhX2J5X3JlZy5jc3ZcIik7XG4gICAgICB4aHIucmVzcG9uc2VUeXBlID0gXCJibG9iXCI7IC8vZm9yY2UgdGhlIEhUVFAgcmVzcG9uc2UsIHJlc3BvbnNlLXR5cGUgaGVhZGVyIHRvIGJlIGJsb2JcbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgYmxvYiA9IHhoci5yZXNwb25zZTsgLy94aHIucmVzcG9uc2UgaXMgbm93IGEgYmxvYiBvYmplY3RcbiAgICAgICAgbXlSZWFkZXIucmVhZEFzVGV4dChibG9iKTtcbiAgICAgIH07XG4gICAgICB4aHIuc2VuZCgpO1xuXG4gICAgICBsZXQgbXlSZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgbXlSZWFkZXIuYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRlbmRcIiwgZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGxldCBkYXRhID0gbmV3RGF0YVByb3NlZWQoZS5zcmNFbGVtZW50LnJlc3VsdCk7XG4gICAgICAgIGxldCByZWdJbmZvID0gbmV3IFJlZ0luZm8oZGF0YSk7XG4gICAgICAgIGxldCByZWdJbmZvTW9iaWxlID0gbmV3IFJlZ0luZm9Nb2JpbGUoZGF0YSlcbiAgICAgICAgcmVnSW5mby5pbml0KClcbiAgICAgICAgcmVnSW5mby5yZW5kZXIoKTtcbiAgICAgICAgcmVnSW5mb01vYmlsZS5pbml0KCk7XG4gICAgICAgIHJlZ0luZm9Nb2JpbGUucmVuZGVyKCk7XG4gICAgICB9KTtcbiAgICB9KVxuICAgIH1cblxuICAgIGdldERhdGFBbmRNYXAoKTtcblxuICAgIC8vIGtleVJlYXNvbkNoYXJ0LnNob3coKTtcbiAgICAgIG5ld0luZmVjdGVkQ2hhcnRNb2JpbGUuc2hvdygpO1xuXG4gICAgbGV0IHF1aXpFbGVtcyA9IFtcbiAgICAgIG5ldyBob29rVXBRdWVzdG9uKDAsICQoXCIucXVlc3Rpb24tb25lXCIpLCAyLCBcIi5wbGF0ZTNcIiksXG4gICAgICBuZXcgaG9va1VwUXVlc3RvbigxLCAkKFwiLnF1ZXN0aW9uLXR3b1wiKSwgMywgXCIucGxhdGU1XCIsIGdldERhdGFBbmRNYXApLFxuICAgICAgbmV3IGhvb2tVcFF1ZXN0b24oMiwgJChcIi5xdWVzdGlvbi10aHJlZVwiKSwgMiwgXCIuYW5zd2VyLXRocmVlLCAucGxhdGU2LWFmdGVyXCIsXG4gICAgICAgIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIG5ld0luZmVjdGVkQ2hhcnQuc2hvdygpO1xuICAgICAgICAgIG5ld0luZmVjdGVkQ2hhcnRNb2JpbGUuc2hvdygpO1xuICAgICAgICB9KSxcbiAgICAgIG5ldyBob29rVXBWYWxRdWVzdG9uKDMsICQoXCIucXVlc3Rpb24tZm91clwiKSwgdmFsUGlja2VyMywgXCIuYW5zd2VyLWZvdXIsIC5wbGF0ZTctYWZ0ZXJcIiksXG4gICAgICBuZXcgaG9va1VwVmFsUXVlc3Rvbig0LCAkKFwiLnF1ZXN0aW9uLWZpdmVcIiksIHZhbFBpY2tlcjIsIFwiLmFuc3dlci1maXZlXCIsIGtleVJlYXNvbkNoYXJ0LnNob3cpLFxuICAgICAgbmV3IGhvb2tVcFZhbFF1ZXN0b24oNSwgJChcIi5xdWVzdGlvbi1zaXhcIiksIHZhbFBpY2tlciwgXCIuYW5zd2VyLXNpeFwiKSxcbiAgICAgIG5ldyBob29rVXBRdWVzdG9uKDYsICQoXCIucXVlc3Rpb24tc2V2ZW5cIiksIDEsIFwiLmFuc3dlci1zZXZlbiwgLnBsYXRlMTAtYWZ0ZXJcIiksXG4gICAgICBuZXcgRm9vdGVyKDcpLFxuICAgIF07XG5cblxuICAgIC8vIHF1aXpFbGVtcy5mb3JFYWNoKGVsZW0gPT4gZWxlbS5pbml0KCkpO1xuXG5cbiAgICAvLyBxdWl6RWxlbXMuZm9yRWFjaChlbGVtID0+IGVsZW0uc2hvdygpKTtcblxuXG4gICAgbGV0IHJlc3VsdHMgPSBbe1xuICAgICAgdGV4dDogXCLQodCf0JjQlCwg0LrQsNC6INC40LfQstC10YHRgtC90L4sINC90LUg0YHQv9C40YIuINCQINCy0Ysg0L/QvtGH0YLQuCDQvdC40YfQtdCz0L4g0L4g0L3RkdC8INC90LUg0LfQvdCw0LXRgtC1XCIsXG4gICAgfSwge1xuICAgICAgdGV4dDogXCLQmtCw0LbQtdGC0YHRjywg0LLRiywg0L/QviDQutGA0LDQudC90LXQuSDQvNC10YDQtSwg0LfQvdCw0LXRgtC1LCDRh9C10Lwg0L7RgtC70LjRh9Cw0LXRgtGB0Y8g0JLQmNCnINC+0YIg0KHQn9CY0JRcIixcbiAgICB9LCB7XG4gICAgICB0ZXh0OiBcItCS0Ysg0L7RgtC70LjRh9C90L4g0YDQsNC30LHQuNGA0LDQtdGC0LXRgdGMINCyINGN0YLQvtC5INC90LXQstC10YHRkdC70L7QuSDRgtC10LzQtSFcIixcbiAgICB9LCBdXG5cblxuICAgIGxldCByZW5kZXJSZXN1bHQgPSBmdW5jdGlvbigpIHtcblxuICAgICAgbGV0IHJlc3VsdFZhbCA9IHF1aXpFbGVtcy5yZWR1Y2UoKHZhbCwgZSkgPT4ge1xuICAgICAgICBpZiAoZSBpbnN0YW5jZW9mIGhvb2tVcFZhbFF1ZXN0b24gfHwgZSBpbnN0YW5jZW9mIGhvb2tVcFF1ZXN0b24pIHtcbiAgICAgICAgICB2YWwgPSAoZS5yZXN1bHQpID8gdmFsICsgMSA6IHZhbFxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWw7XG4gICAgICB9LCAwKVxuXG4gICAgICBsZXQgcmVzdWx0VGV4dElkID0gcmVzdWx0VmFsID4gNSA/IDIgOiByZXN1bHRWYWwgPiAzID8gMSA6IDA7XG4gICAgICBsZXQgb2JqID0gcmVzdWx0c1tyZXN1bHRUZXh0SWRdXG5cbiAgICAgICQoXCIucGxhdGUxMSAucmVzdWx0IC5jb21tZW50XCIpLnRleHQob2JqLnRleHQpXG4gICAgfVxuXG5cbiAgICBsZXQgc2hvd05leHQgPSAoKSA9PiB7XG4gICAgICBmb3IgKGxldCBpID0gcXVpekVsZW1zLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGxldCBlID0gcXVpekVsZW1zW2ldO1xuICAgICAgICBpZiAoaSA9PSAwICYmICFlLmlzU2hvd24pIHtcbiAgICAgICAgICBxdWl6RWxlbXNbaV0uc2hvdygpO1xuICAgICAgICAgIHNpZGVCYXJzLnNob3coKVxuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZS5pc1Nob3duICYmIGUucmVzdWx0ICE9PSBudWxsICYmIGkgPCBxdWl6RWxlbXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgIGlmICghcXVpekVsZW1zW2kgKyAxXS5pc1Nob3duKSBxdWl6RWxlbXNbaSArIDFdLnNob3coKTtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cblxuICAgIGxldCBvbGRTY3JvbGxQb3NpdG9pbiA9IHdpbmRvdy5wYWdlWU9mZnNldCB8fCBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wO1xuXG4gICAgYWRkTW91c2Vld2hlZWxFdmVudChkb2N1bWVudCxvbldoZWVsKVxuXG4gICAgZnVuY3Rpb24gb25XaGVlbChlKSB7XG4gICAgICBlID0gZSB8fCB3aW5kb3cuZXZlbnQ7XG5cbiAgICAgIGlmIChkaXNhYmxlU2Nyb2xsKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiAoZS5yZXR1cm5WYWx1ZSA9IGZhbHNlKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBsZXQgbmV3U2Nyb2xsUG9zaXRvaW4gPSB3aW5kb3cucGFnZVlPZmZzZXQgfHwgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcDtcblxuICAgICAgLy8gd2hlZWxEZWx0YSDQvdC1INC00LDQtdGCINCy0L7Qt9C80L7QttC90L7RgdGC0Ywg0YPQt9C90LDRgtGMINC60L7Qu9C40YfQtdGB0YLQstC+INC/0LjQutGB0LXQu9C10LlcbiAgICAgIGxldCBkZWx0YSA9IGUuZGVsdGFZIHx8IGUuZGV0YWlsIHx8IGUud2hlZWxEZWx0YTtcblxuICAgICAgaWYgKG5ld1Njcm9sbFBvc2l0b2luID09IG9sZFNjcm9sbFBvc2l0b2luICYmIGRlbHRhID4gMTApIHtcbiAgICAgICAgc2hvd05leHQoKTtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IChlLnJldHVyblZhbHVlID0gZmFsc2UpO1xuICAgICAgfVxuICAgICAgaWYgKGRlbHRhID4gMTApIHtcbiAgICAgICAgb2xkU2Nyb2xsUG9zaXRvaW4gPSBuZXdTY3JvbGxQb3NpdG9pbjtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xuXG4gIC8qXG4gIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojiloggICDilojiloggIOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paIICDilojilojilojilojilojilojiloggICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiCAgICDilojilohcbiAg4paI4paIICAgICAg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAgICAgICAgIOKWiOKWiCAgIOKWiOKWiCAgICDilojiloggICAg4paI4paI4paI4paIICAg4paI4paIXG4gIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCDilojilojilojilojilojilojilogg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiCAg4paI4paI4paI4paI4paIICAgICAgIOKWiOKWiOKWiOKWiOKWiOKWiCAgICAg4paI4paIICAgIOKWiOKWiCDilojiloggIOKWiOKWiFxuICAgICAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICAgICAgICAg4paI4paIICAg4paI4paIICAgIOKWiOKWiCAgICDilojiloggIOKWiOKWiCDilojilohcbiAg4paI4paI4paI4paI4paI4paI4paIIOKWiOKWiCAgIOKWiOKWiCDilojiloggICDilojilogg4paI4paIICAg4paI4paIIOKWiOKWiOKWiOKWiOKWiOKWiOKWiCAgICAg4paI4paI4paI4paI4paI4paIICAgICDilojiloggICAg4paI4paIICAg4paI4paI4paI4paIXG4gICovXG5cbiAgJChcIi5zaGFyZS1idG5cIikuY2xpY2soZnVuY3Rpb24oKSB7XG4gICAgY29uc29sZS5sb2codGhpcy5kYXRhc2V0Lm5ldHdvcmspO1xuICAgIHNoYXJlKHRoaXMuZGF0YXNldC5uZXR3b3JrKTtcbiAgfSlcblxuXG4gIGxldCBzaGFyZSA9IChuZXR3b3JrKSA9PiB7XG5cbiAgICBsZXQgdGl0bGUgPSBcItCg0L7RgdGB0LjRjyDQvdCwINC/0L7RgNC+0LPQtSDRjdC/0LjQtNC10LzQuNC4INCS0JjQp1wiO1xuICAgIGxldCBkZXNjcmlwdGlvbiA9IFwi0KLRgNC10LLQvtC20L3Ri9C1INGE0LDQutGC0Ysg0L4g0LzQsNGB0YjRgtCw0LHQsNGFINCx0LXQtNGB0YLQstC40Y8g4oCUINCyINGB0L/QtdGG0L/RgNC+0LXQutGC0LUgwqvQk9Cw0LfQtdGC0YsuUnXCu1wiO1xuICAgIGxldCBsaW5rID0gXCJodHRwOi8vZHluLmlnLnJhbWJsZXIucnUvSElWLXNwcmVhZC9cIjtcbiAgICBsZXQgY2xvc2VMaW5rID0gXCJodHRwOi8vZHluLmlnLnJhbWJsZXIucnUvSElWLXNwcmVhZC9jbG9zZS5odG1sXCJcbiAgICBsZXQgdHdpdHRlclRleHQgPSB0aXRsZSArIFwiLlwiICsgXCIgXCIgKyBkZXNjcmlwdGlvbjtcbiAgICBsZXQgaW1hZ2UgPSBcImh0dHA6Ly9keW4uaWcucmFtYmxlci5ydS9ISVYtc3ByZWFkL3NoYXJlLWltZy5wbmdcIlxuXG4gICAgaWYgKG5ldHdvcmsgPT0gXCJ2a1wiKSB7XG4gICAgICBsZXQgdXJsID0gXCJodHRwOi8vdmsuY29tL3NoYXJlLnBocD91cmw9XCIgKyBsaW5rICsgXCImZGVzY3JpcHRpb249XCIgK1xuICAgICAgICBkZXNjcmlwdGlvbiArIFwiJmltYWdlPVwiICsgaW1hZ2UgKyBcIiZ0aXRsZT1cIiArIHRpdGxlO1xuICAgICAgd2luZG93Lm9wZW4odXJsLCBcIl9ibGFua1wiLCBcIndpZHRoPTQwMCxoZWlnaHQ9NTAwXCIpO1xuICAgIH0gZWxzZSBpZiAobmV0d29yayA9PSBcImZiXCIpIHtcbiAgICAgIGxldCBhcHBJZCA9IDYxMDQxNTcxNTc4NTc3NTtcbiAgICAgIGxldCB1cmwgPSBcImh0dHBzOi8vd3d3LmZhY2Vib29rLmNvbS9kaWFsb2cvZmVlZD9hcHBfaWQ9XCIgKyBhcHBJZCArXG4gICAgICAgIFwiJmRlc2NyaXB0aW9uPVwiICsgZGVzY3JpcHRpb24gKyBcIiZkaXNwbGF5PXBvcHVwJmxpbms9XCIgKyBsaW5rICsgXCImbmFtZT1cIiArIHRpdGxlICsgXCImbmV4dD1cIiArXG4gICAgICAgIGNsb3NlTGluayArIFwiJnBpY3R1cmU9XCIgKyBpbWFnZTtcbiAgICAgIHdpbmRvdy5vcGVuKHVybCwgXCJfYmxhbmtcIiwgXCJ3aWR0aD00MDAsaGVpZ2h0PTUwMFwiKTtcbiAgICB9IGVsc2UgaWYgKG5ldHdvcmsgPT0gXCJ0d1wiKSB7XG4gICAgICBsZXQgdXJsID0gXCJodHRwczovL3R3aXR0ZXIuY29tL2ludGVudC90d2VldD9vcmlnaW5hbF9yZWZlcmVyPVwiICsgbGluayArXG4gICAgICAgIFwiJnRleHQ9XCIgKyB0d2l0dGVyVGV4dCArIFwiJnR3X3A9dHdlZXRidXR0b24mdXJsPVwiICsgbGluaztcbiAgICAgIHdpbmRvdy5vcGVuKHVybCwgXCJfYmxhbmtcIiwgXCJ3aWR0aD00MDAsaGVpZ2h0PTUwMFwiKTtcbiAgICB9XG5cbiAgfVxuXG59KSgpO1xuIiwiXG5pbXBvcnQge2dldENvbG9yTWV0YX0gZnJvbSBcIi4vdXRpbHNcIlxuXG5jb25zb2xlLmxvZyhcImhpXCIpO1xuXG5sZXQgbmV3SW5mZWN0ZWRDaGFydE1vYmlsZSA9ICgoKSA9PiB7XG5cbiAgbGV0IGRhdGEgPSBbXG4gICAgMTAwLFxuICAgIDIwMyxcbiAgICAxNTEzLFxuICAgIDQzMTUsXG4gICAgMzk3MSxcbiAgICAxOTc1OCxcbiAgICA1OTYwOSxcbiAgICA4ODczOSxcbiAgICA1MjE3MCxcbiAgICAzOTIzMixcbiAgICAzNzAwMixcbiAgICAzOTQwNyxcbiAgICA0MzAwNyxcbiAgICA0NDcxMyxcbiAgICA1NDU2MyxcbiAgICA1ODQxMCxcbiAgICA1ODI5OCxcbiAgICA2MjM4NyxcbiAgICA3MDgzMixcbiAgICA3OTc2NCxcbiAgICA4OTY2NyxcbiAgICA5MzAwMCxcbiAgXTtcblxuXG4gIGxldCBiYXJzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmNoYXJ0Lm5ld0luZmVjdGVkLW1vYmlsZSAuYm9keSAuY2FudmFzIC5ibG9jaycpO1xuXG5cbiAgbGV0IHN0YXJ0Q29sb3IgPSBbMjI4LCAxNTIsIDE1Ml07XG4gIGxldCBlbmRDb2xvciA9IFsxOTAsIDMyLCAzN107XG4gIGxldCBtYXggPSAxMDAgKiAxMDAwO1xuXG4gIGxldCBpID0gMDtcblxuICBsZXQgcmVuZGVybmV3SW5mZWN0ZWQgPSBmdW5jdGlvbigpIHtcbiAgICBpZiAoaSA+PSBkYXRhLmxlbmd0aCkge1xuICAgICAgbGV0IGxhYmVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5uZXdJbmZlY3RlZF9sYWJlbF90ZXh0Jyk7XG4gICAgICBbXS5mb3JFYWNoLmNhbGwobGFiZWxzLCBlbGVtID0+IGVsZW0uc3R5bGUub3BhY2l0eSA9IDAuOSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGxldCB2YWwgPSBkYXRhW2ldO1xuICAgIGlmICh2YWwgPCA0MDAwKSB7XG4gICAgICBiYXJzW2ldLnN0eWxlLmJhY2tncm91bmRDb2xvciA9ICdyZ2IoMjQsMTc5LDE3MiknO1xuICAgICAgYmFyc1tpXS5zdHlsZS5tYXJnaW5MZWZ0ID0gLTE5MCAqIDAuOTggKyBcInB4XCI7XG4gICAgfSBlbHNlIHtcbiAgICAgIGxldCBjb2xvciA9IGdldENvbG9yTWV0YShzdGFydENvbG9yLCBlbmRDb2xvciwgdmFsIC8gbWF4KTtcbiAgICAgIGJhcnNbaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gYHJnYigke2NvbG9yfSlgO1xuICAgICAgYmFyc1tpXS5zdHlsZS5tYXJnaW5MZWZ0ID0gKDAgLSAxOTApICogKDEgLSB2YWwgLyBtYXgpICsgXCJweFwiO1xuICAgIH1cblxuICAgIGlmIChpID09IDMpIHtcbiAgICAgIGJhcnNbaV0uc3R5bGUuYmFja2dyb3VuZENvbG9yID0gJ3JnYigyNCwxNzksMTcyKSc7XG4gICAgfVxuXG4gICAgaSsrO1xuICAgIHNldFRpbWVvdXQocmVuZGVybmV3SW5mZWN0ZWQsIDMwKTtcbiAgfTtcblxuICBsZXQgc2hvdyA9ICgpID0+IHtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICByZW5kZXJuZXdJbmZlY3RlZCgpO1xuICAgIH0sIDEwMDApO1xuXG4gIH07XG5cbiAgcmV0dXJuIHtcbiAgICBzaG93XG4gIH1cblxufSkoKTtcblxuZXhwb3J0IGRlZmF1bHQgIG5ld0luZmVjdGVkQ2hhcnRNb2JpbGU7XG4iLCJsZXQgZ2V0Q29sb3IgPSBmdW5jdGlvbihwZXJjZW50KSB7XG4gIGlmIChwZXJjZW50ID4gMSkgcmV0dXJuIFwicmdiKDE4MCwzMiwzNylcIjtcblxuICBsZXQgciA9IE1hdGguZmxvb3IoMjMyIC0gKDIzMiAtIDE4MCkgKiBwZXJjZW50KTtcbiAgbGV0IGcgPSBNYXRoLmZsb29yKDIzMiAtICgyMzIgLSAzMikgKiBwZXJjZW50KTtcbiAgbGV0IGIgPSBNYXRoLmZsb29yKDIzMiAtICgyMzIgLSAzNykgKiBwZXJjZW50KTtcblxuICByZXR1cm4gYHJnYigke3J9LCR7Z30sJHtifSlgO1xuXG59O1xuXG5sZXQgZ2V0Q29sb3JNZXRhID0gZnVuY3Rpb24oc3RhcnRDb2xvciwgZW5kQ29sb3IsIHBlcmNlbnQpIHtcbiAgLy8gY29uc29sZS5sb2cocGVyY2VudCk7XG4gIGlmIChwZXJjZW50ID49IDEgfHwgaXNOYU4ocGVyY2VudCkpIHJldHVybiBzdGFydENvbG9yLmpvaW4oXCIsXCIpXG4gIGxldCBub05hbWUgPSBmdW5jdGlvbihzdGFydCwgZW5kLCBwZXJjZW50KSB7XG4gICAgcmV0dXJuIE1hdGguYWJzKFxuICAgICAgTWF0aC5mbG9vcihzdGFydCAqICgxIC0gcGVyY2VudCkgKyBlbmQgKiBwZXJjZW50KVxuICAgICk7XG4gIH07XG5cbiAgcmV0dXJuIHN0YXJ0Q29sb3IubWFwKGZ1bmN0aW9uKGVsZW0sIGkpIHtcbiAgICByZXR1cm4gbm9OYW1lKGVsZW0sIGVuZENvbG9yW2ldLCBwZXJjZW50KTtcbiAgfSkuam9pbihcIixcIik7XG59O1xuXG5cbmxldCBhZGRNb3VzZWV3aGVlbEV2ZW50ID0gZnVuY3Rpb24oZWxlbSwgZm4pIHtcbiAgaWYgKGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICBpZiAoJ29ud2hlZWwnIGluIGRvY3VtZW50KSB7XG4gICAgICAvLyBJRTkrLCBGRjE3KywgQ2gzMStcbiAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihcIndoZWVsXCIsIGZuKTtcbiAgICB9IGVsc2UgaWYgKCdvbm1vdXNld2hlZWwnIGluIGRvY3VtZW50KSB7XG4gICAgICAvLyDRg9GB0YLQsNGA0LXQstGI0LjQuSDQstCw0YDQuNCw0L3RgiDRgdC+0LHRi9GC0LjRj1xuICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwibW91c2V3aGVlbFwiLCBmbik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIEZpcmVmb3ggPCAxN1xuICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKFwiTW96TW91c2VQaXhlbFNjcm9sbFwiLCBmbik7XG4gICAgfVxuICB9IGVsc2UgeyAvLyBJRTgtXG4gICAgZWxlbS5hdHRhY2hFdmVudChcIm9ubW91c2V3aGVlbFwiLCBmbik7XG4gIH1cblxufVxuXG5leHBvcnQge2dldENvbG9yLGFkZE1vdXNlZXdoZWVsRXZlbnQsIGdldENvbG9yTWV0YX1cbiJdfQ==
