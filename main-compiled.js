"use strict";

var showElem = function showElem($elem) {
  $elem.css({
    display: "block"
  }).animate({
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

var getColor = function getColor(percent) {
  if (percent > 1) return "rgb(180,32,37)";

  var r = Math.floor(232 - (232 - 180) * percent);
  var g = Math.floor(232 - (232 - 32) * percent);
  var b = Math.floor(232 - (232 - 37) * percent);

  return "rgb(" + r + "," + g + "," + b + ")";
};

function insertAfter(elem, refElem) {
  return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}

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

var mapMain = function mapMain() {

  //----Data----
  var data = {};

  // -------------Global State------------
  var state = {
    year: 1999,
    regionId: "",
    display: "abs"
  };

  /*
  ███    ███  █████  ██████
  ████  ████ ██   ██ ██   ██
  ██ ████ ██ ███████ ██████
  ██  ██  ██ ██   ██ ██
  ██      ██ ██   ██ ██
  */

  var map = function () {

    var map = {
      render: null,
      selectedReg: null,
      mapElem: null
    };
    map.mapElem = document.getElementById("svg-map");
    var regions = $("#svg-map path, #svg-map polygon");
    var btn = $(".map .map_header .btn");
    var selectedReg = null;

    btn.click(function (e) {
      e.stopPropagation();
      // btn.toggleClass("active");
      state.display = this.dataset.displaytype;
      renderAll();
    });

    var setRegsColor = function setRegsColor(year) {

      Object.keys(data).forEach(function (reginoId) {

        var value = void 0,
            percent = void 0;

        if (state.display == "abs") {

          value = data[reginoId].absInfected[year];

          if (value < 100) {
            percent = 0;
          } else {
            percent = Math.log2(value / 100) / 9;
          }
        } else {
          value = data[reginoId].relInfected[year];

          if (value < 10) {
            percent = 0;
          } else {
            percent = Math.log2(value / 10) / 9;
          }
        }

        $('#' + reginoId).css({
          'fill': getColor(percent)
        });
      });
    };

    var setSelectedRegion = function setSelectedRegion(regionId) {
      map.selectedReg && map.selectedReg.classList.remove('selected');
      if (regionId) {
        map.selectedReg = document.getElementById(regionId);
        map.selectedReg.classList.add('selected');
      }
    };

    var setButtons = function setButtons(display) {
      btn.each(function (i, elem) {
        if (elem.dataset.displaytype == display) elem.classList.add('active');else elem.classList.remove('active');
      });
    };

    var render = function render() {
      setRegsColor(state.year);
      setSelectedRegion(state.regionId);
      setButtons(state.display);
      if (state.regionId) {
        map.mapElem.classList.add('regSelected');
      } else {
        map.mapElem.classList.remove('regSelected');
      }
    };

    regions.click(function (e) {
      e.stopPropagation();
      if (e.target.id === state.regionId) {
        map.mapElem.classList.remove('regSelected');
        state.regionId = "";
      } else {
        state.regionId = e.target.id;
        e.target.parentElement.insertBefore(e.target, null);
      }
      renderAll();
    });

    map.render = render;
    map.selectedReg = selectedReg;

    return map;
  }();

  /*
  ██      ███████  ██████  ███████ ███    ██ ██████
  ██      ██      ██       ██      ████   ██ ██   ██
  ██      █████   ██   ███ █████   ██ ██  ██ ██   ██
  ██      ██      ██    ██ ██      ██  ██ ██ ██   ██
  ███████ ███████  ██████  ███████ ██   ████ ██████
  */

  var legend = function () {

    //----Init legned ------

    var initColors = function initColors() {
      $(".legend .bloc .color").each(function (id, e) {
        var color = getColor((id + 1) / 10);
        $(e).css({
          "background-color": color
        });
      });
    };

    var renderValues = function renderValues() {
      var multiplier = state.display == "abs" ? 100 : 10;

      $(".legend .bloc .val").each(function (id, e) {
        $(e).text(multiplier * Math.pow(2, id));
      });
    };

    var init = function init() {
      initColors();
      renderValues();
    };

    var render = function render() {
      renderValues();
    };

    return {
      "init": init,
      render: render
    };
  }();

  /*
  ██    ██ ███████  █████  ██████  ███████
   ██  ██  ██      ██   ██ ██   ██ ██
    ████   █████   ███████ ██████  ███████
     ██    ██      ██   ██ ██   ██      ██
     ██    ███████ ██   ██ ██   ██ ███████
  */

  var years = function () {

    var render = function render() {

      $(".years .col").each(function (id, e) {
        var year = parseInt($(e).attr("id"));
        if (year === state.year) {
          $(e).addClass("active");
        } else {
          $(e).removeClass("active");
        }
      });
    };

    // _____________click__________

    $(".years .col").on("click", function (e) {
      e.stopPropagation();
      var year = parseInt($(this).attr("id"));
      state.year = year;
      renderAll();
    });

    return {
      render: render
    };
  }();

  /*
  ██████  ██████   ██████  ██████      ██████   ██████  ██     ██ ███    ██
  ██   ██ ██   ██ ██    ██ ██   ██     ██   ██ ██    ██ ██     ██ ████   ██
  ██   ██ ██████  ██    ██ ██████      ██   ██ ██    ██ ██  █  ██ ██ ██  ██
  ██   ██ ██   ██ ██    ██ ██          ██   ██ ██    ██ ██ ███ ██ ██  ██ ██
  ██████  ██   ██  ██████  ██          ██████   ██████   ███ ███  ██   ████
  */

  var dropDowdn = function () {

    var isOpen = false;
    var $select = $(".map_header .drop_down .head");
    var scrollable = $(".scrollable");
    var closeImg = $(".map_header .item.drop_down .close_button img");
    var container = $(".scrollable .content");
    var head = $(".drop_down .text");

    $select.click(function (e) {
      e.stopPropagation();
      if (isOpen) {
        close();
      } else {
        open();
      }
    });

    $(".scrollable").click(function (e) {
      e.stopPropagation();
    });

    var close = function close() {
      scrollable.css('visibility', 'hidden');
      isOpen = false;
      closeImg[0].style.transform = "rotate(0deg)";
    };

    var open = function open() {
      scrollable.css('visibility', 'visible');
      isOpen = true;
      closeImg[0].style.transform = "rotate(180deg)";
    };

    var render = function render() {
      if (state.regionId) {
        head.text(data[state.regionId].shortName);
      } else {
        head.text("Регион");
      }

      // state.regionId && head.text(data[state.regionId].shortName || "Регион")
      // Dirty Hack
      container.empty();
      Object.keys(data).forEach(function (region) {

        var shortName = data[region].shortName;

        var elem = $("<div class=\"item\" data-regionId=\"" + region + "\"> " + shortName + " </div>");

        if (region === state.regionId) {
          elem = $("<div class=\"active\" data-regionId=\"" + region + "\"> " + shortName + " </div>");
        }

        container.append(elem);

        elem.click(function (e) {
          e.stopPropagation();
          state.regionId = this.dataset.regionid;
          renderAll();
          close();
        });
      });
      close();
    };

    var createScroller = function () {

      var scrollContainer = document.querySelector('.scrollable'),
          scrollContentWrapper = document.querySelector('.scrollable .content-wrapper'),
          scrollContent = document.querySelector('.scrollable .content'),
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

      function createScroller() {
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
      }

      // *** Listeners ***
      scrollContentWrapper.addEventListener('scroll', moveScroller);

      return createScroller;
    }();

    return {
      open: open,
      close: close,
      render: render,
      createScroller: createScroller
    };
  }();

  /*
  ██████   ██████   ██████ ██    ██ ███    ███ ███████ ███    ██ ████████      ██████ ██      ██  ██████ ██   ██ ███████
  ██   ██ ██    ██ ██      ██    ██ ████  ████ ██      ████   ██    ██        ██      ██      ██ ██      ██  ██  ██
  ██   ██ ██    ██ ██      ██    ██ ██ ████ ██ █████   ██ ██  ██    ██        ██      ██      ██ ██      █████   ███████
  ██   ██ ██    ██ ██      ██    ██ ██  ██  ██ ██      ██  ██ ██    ██        ██      ██      ██ ██      ██  ██       ██
  ██████   ██████   ██████  ██████  ██      ██ ███████ ██   ████    ██         ██████ ███████ ██  ██████ ██   ██ ███████
  */

  document.body.addEventListener("click", function (e) {
    state.regionId = "";
    renderAll();
  });

  /*
  ██████   ██████  ██████  ██    ██ ██████
  ██   ██ ██    ██ ██   ██ ██    ██ ██   ██
  ██████  ██    ██ ██████  ██    ██ ██████
  ██      ██    ██ ██      ██    ██ ██
  ██       ██████  ██       ██████  ██
  */

  var popUp = function () {

    var popUp = $(".banner");
    var closeButton = $(".banner .head .btn.close");
    var pieContainer = $(".banner .body .pie");

    var dataFields = $(".banner .body .data .item");
    var stateNameFeald = popUp.find(".head .region span");
    var infectedFeald = dataFields.find(".infected");
    var diedFeald = dataFields.find(".dead");
    var infectedTextFeald = $(dataFields.find(".leble")[0]);

    var close = function close() {
      hide();
      state.regionId = "";
      renderAll();
    };

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

    closeButton.click(function (e) {
      close();
    });

    var renderPie = function () {
      var path = null;
      var svgElem = document.getElementById("svg-pie");

      var renderPie = function renderPie(deg) {
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

        var cx = 40,
            cy = 40,
            rx = 40,
            ry = 40;

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
      return renderPie;
    }();

    var findPosition = function findPosition() {

      if (!map.selectedReg) return;

      var mapRect = map.mapElem.getBoundingClientRect();
      var regRect = map.selectedReg.getBoundingClientRect();
      var popUpRect = popUp[0].getBoundingClientRect();

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
        popUp[0].style[prop] = obj[prop] ? obj[prop] + "px" : "";
      });
    };

    var render = function render() {

      if (!state.regionId) {
        hide();
        return;
      }

      var name = void 0,
          infected = void 0,
          died = void 0,
          infectedText = void 0;

      name = data[state.regionId].name;

      if (state.display == "rel") {
        pieContainer.hide();
        $(dataFields[1]).hide();
        $(dataFields[0]).find(".infected").css({
          width: "auto"
        });
        died = null;
        infected = data[state.regionId].relInfected[state.year] || "н/д";
        infectedText = "Число инфицированных на 100 тысяч населения";
      } else {
        infected = data[state.regionId].absInfected[state.year] || "н/д";
        died = data[state.regionId].absDied[state.year] || "н/д";
        pieContainer.show();
        $(dataFields[1]).show();
        $(dataFields[0]).find(".infected").css({
          width: "23%"
        });
        renderPie(360 * (died / infected));
        infectedText = "Общее число инфицированных";
      }

      stateNameFeald.text(name);
      infectedFeald.text(infected);
      infectedTextFeald.text(infectedText);
      diedFeald.text(died);

      if (state.regionId) {
        setPosition(findPosition());
        open();
      }
    };

    var onresize = function onresize() {
      setPosition(findPosition());
    };

    return {
      render: render,
      onresize: onresize
    };
  }();

  /*
  ██████  ███████ ███    ██ ██████  ███████ ██████
  ██   ██ ██      ████   ██ ██   ██ ██      ██   ██
  ██████  █████   ██ ██  ██ ██   ██ █████   ██████
  ██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
  ██   ██ ███████ ██   ████ ██████  ███████ ██   ██
  */

  var renderAll = function renderAll() {
    map.render();
    years.render();
    dropDowdn.render();
    legend.render();
    popUp.render();
  };

  var initAll = function initAll() {
    legend.init();
    dropDowdn.createScroller();
  };

  window.onresize = function () {
    popUp.onresize();
  };

  /*
  ██████  ███████  █████  ██████      ██████   █████  ████████  █████
  ██   ██ ██      ██   ██ ██   ██     ██   ██ ██   ██    ██    ██   ██
  ██████  █████   ███████ ██   ██     ██   ██ ███████    ██    ███████
  ██   ██ ██      ██   ██ ██   ██     ██   ██ ██   ██    ██    ██   ██
  ██   ██ ███████ ██   ██ ██████      ██████  ██   ██    ██    ██   ██
  */

  (function () {
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

      data = newDataProseed(e.srcElement.result);
      initAll();
      renderAll();
    });
  })();
};

var getColorMeta = function getColorMeta(startColor, endColor, percent) {
  var noName = function noName(start, end, percent) {
    return Math.abs(Math.floor(start * (1 - percent) + end * percent));
  };

  return startColor.map(function (elem, i) {
    return noName(elem, endColor[i], percent);
  }).join(",");
};

// console.log(
// getColorMeta([26,14,14],[22,47,57], 0.5)
// );

var onscroll = function () {
  var bgColor = null;
  var H = document.body.offsetHeight;

  var onscroll = function onscroll() {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    var percent = (scrolled + window.innerHeight) / H;
    var color = getColorMeta([26, 14, 14], [44, 108, 111], percent);
    if (color !== bgColor) {
      window.requestAnimationFrame(function () {
        window.document.body.style.backgroundColor = "rgb(" + color + ")";
      });
      bgColor = color;
    }
  };

  onscroll();

  return onscroll;
}();

$(".map_body").load("map.svg", function () {
  mapMain();
  // window.scrollTo(0,document.body.scrollHeight);
  window.onscroll = onscroll;
});

// console.log($(".chart.top-spread .body"));

// $(".top-spread-map").load("top-spread.svg", function() {
//   // console.log("Done");
//
// });

// Шапка  + волна #rgb(26,14,14)
// 1 вопрос + ответ #rgb(22,47,57)
// 2 вопрос + карта #rgb(26,14,14)
// 3 вопрос + график + волна #rgb(19,50,61)
// 4 вопрос + волна #rgb(19,50,61)
// 5 вопрос + график #rgb(12,35,42)
// 6 вопрос + график #rgb(12,35,42)
// 7 вопрос + волна + карта #rgb(22,47,57)
// подвал с результатами  #rgb(44,108,111)

// let data = {
//   1994: 100,
//   1995: 203,
//   1996: 1513,
//   1997: 4315,
//   1998: 3971,
//   1999: 19758,
//   2000: 59609,
//   2001: 88739,
//   2002: 52170,
//   2003: 39232,
//   2004: 37002,
//   2005: 39407,
//   2006: 43007,
//   2007: 44713,
//   2008: 54563,
//   2009: 58410,
//   2010: 58298,
//   2011: 62387,
//   2012: 70832,
//   2013: 79764,
//   2014: 89667,
//   2015: 93000,
// };

var data = [100, 203, 1513, 4315, 3971, 19758, 59609, 88739, 52170, 39232, 37002, 39407, 43007, 44713, 54563, 58410, 58298, 62387, 70832, 79764, 89667, 93000];

(function () {

  var bars = document.querySelectorAll('.chart.newInfected .body .canvas .bar');

  //rgb(24,179,172)
  //rgb(203,132,125)
  var startColor = [228, 152, 152];
  //rgb(190,32,37)
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

  setTimeout(function () {
    rendernewInfected();
  }, 200);
})();

$(function () {

  var circle = document.querySelector('.guess-growth-main-small');
  var textFeald = document.querySelector('.guess-growth-main-text');
  var r = 46;
  var text = "1 000 000";

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

  var calculeteNewR = function calculeteNewR(h) {
    return 46 + (230 - 46) * (1 - h / 230);
  };

  var calculeteNewVal = function calculeteNewVal(h) {
    return 1000000 + 4000000 * (1 - h / 230);
  };

  var onDrag = function onDrag(event, ui) {
    var h = ui.position.top;
    r = calculeteNewR(ui.position.top);
    text = valToText(calculeteNewVal(h));
    requestAnimationFrame(changeR);
    requestAnimationFrame(changeText);
  };

  $(".valuepicker-picker").draggable({
    containment: "parent",
    axis: "y",
    drag: onDrag
  });
});

$(function () {

  // let valArr = [10, 80, 5, 5];

  //	Наркотики	Гетеросекс.	Гомосекс.	От матерей

  //как расположенны бары на диограмме
  var barsPosition = ["drags", "fromMather", "hetero", "homo"];

  //как представленые данные в элементе матрици
  var legend = {
    drags: 0,
    hetero: 1,
    homo: 2,
    fromMather: 3
  };

  var valMatrix = [[3.3, 43, 53, 0.7], [6, 41, 52.9, 0.1], [84, 7, 8.7, 0.3], [87, 10.9, 1.9, 0.2], [79.1, 17.8, 2.7, 0.4], [91.8, 7.4, 0.6, 0.1], [95.5, 4.2, 0.2, 0.1], [93.3, 6.4, 0.2, 0.2], [81.2, 17.7, 0.4, 0.7], [72.3, 25.4, 0.5, 1.7], [66.7, 29.9, 0.8, 2.5], [64.2, 31.8, 1.1, 3.0], [63.3, 33.0, 0.7, 2.9], [61.5, 35.2, 1.0, 2.3], [61.3, 35.6, 1.1, 2.0], [59.8, 37.1, 1.4, 1.8], [57.9, 39.7, 1.3, 1.1], [56.2, 41.4, 1.3, 1.1], [56.4, 41.7, 1.1, 0.8], [54.9, 43.1, 1, 1.0], [58.4, 39.7, 1.1, 0.8]];

  var years = document.querySelectorAll('.key-reason-canvas .year');

  var setValue = function setValue(year, valArr) {
    var bars = year.querySelectorAll(".bar");
    [].forEach.call(bars, function (elem, i) {
      var name = barsPosition[i];
      var percent = valArr[legend[name]];
      elem.classList.add(name);
      elem.style.height = percent + "%";
    });
  };

  var setYears = function setYears(i, fn, years) {
    if (i > years.length - 1) return;
    fn(years[i], valMatrix[i]);
    setTimeout(setYears, 200, ++i, fn, years);
  };

  var initYears = function initYears(i, fn) {
    if (i > 20) return;
    fn(years[i], [25, 25, 25, 25]);
    initYears(++i, fn);
  };

  //move init to some global init
  initYears(0, setValue);

  setTimeout(setYears, 700, 0, setValue, years);
});

$(function () {

  var valPicker = function valPicker(fn, state) {

    var meter = document.querySelector('.red-meter-9');
    var greenMeter = document.querySelector('.thermometer-9 .green-meter-9');
    var ribbonSlider = document.querySelector('#ribbon-slider-9');
    var percent = void 0;
    var max = 848;
    var text = document.querySelector('.red-meter-9>div');

    var render = function render(percent) {
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
      var percent = ui.position.left / 848;
      render(percent);
      state.selected = Math.round(percent * 14) + 1;
      fn();
    };

    $(ribbonSlider).draggable({
      containment: "parent",
      axis: "x",
      drag: onDrag
    });
  };

  var valPicker2 = function valPicker2(fn, state) {
    var meter = document.querySelector('.red-meter-8');
    var greenMeter = document.querySelector('.thermometer .green-meter');
    var ribbonSlider = document.querySelector('#ribbon-slider-8');
    var percent = void 0;
    var max = 848;
    var text = document.querySelector('.red-meter-8>div');

    var render = function render(percent) {
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
      var percent = ui.position.left / 848;
      render(percent);
      state.selected = Math.round(percent * 14) + 1;
      fn();
    };

    $(ribbonSlider).draggable({
      containment: "parent",
      axis: "x",
      drag: onDrag
    });
  };

  var valPicker3 = function valPicker3(fn, state) {
    var circle = document.querySelector('.guess-growth-main-small');
    var textFeald = document.querySelector('.guess-growth-main-text');
    var r = 46;
    var text = "1 000 000";

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

    var calculeteNewR = function calculeteNewR(h) {
      return 46 + (230 - 46) * (1 - h / 230);
    };

    var calculeteNewVal = function calculeteNewVal(h) {
      return 1000000 + 4000000 * (1 - h / 230);
    };

    var onDrag = function onDrag(event, ui) {
      var h = ui.position.top;
      r = calculeteNewR(ui.position.top);
      text = valToText(calculeteNewVal(h));
      requestAnimationFrame(changeR);
      requestAnimationFrame(changeText);
      //что записывать в состояние
      state.selected = h / 230;
      fn();
    };

    $(".valuepicker-picker").draggable({
      containment: "parent",
      axis: "y",
      drag: onDrag
    });
  };

  var hookUpValQueston = function hookUpValQueston(question, valPicker, AnswerSelectors) {

    var answerButton = question.find(".answerButton");

    var answer = $(AnswerSelectors);

    var initAnswers = function initAnswers() {
      hideElem(answer);
    };

    var showAnswers = function showAnswers() {
      showElem(answer);
    };

    initAnswers();

    var initQuestion = function initQuestion() {
      hideElem(question);
    };

    var showQuestin = function showQuestin() {
      showElem(question);
    };

    initQuestion();

    var state = {
      selected: null,
      isAnswered: false,
      right: 12
    };

    var render = function render() {
      if (state.isAnswered) {
        removeButton();
        showAnswers();
        question.css({
          "pointer-events": "none"
        });
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

    answerButton.click(function () {
      state.isAnswered = true;
      render();
    });

    valPicker(render, state);

    return {
      show: showQuestin
    };
  };

  var hookUpQueston = function hookUpQueston(question, right, AnswerSelectors) {

    var answerButton = question.find(".answerButton");
    var answer = $(AnswerSelectors);

    var initAnswers = function initAnswers() {
      hideElem(answer);
    };

    var showAnswers = function showAnswers() {
      showElem(answer);
    };

    initAnswers();

    var initQuestion = function initQuestion() {
      hideElem(question);
    };

    var showQuestin = function showQuestin() {
      showElem(question);
    };

    initQuestion();

    var options = question.find(".answers .item .elem");

    var state = {
      selected: null,
      isAnswered: false,
      right: right
    };

    var render = function render() {
      if (state.isAnswered) {
        removeButton();
        showAnswers();
        question.css({
          "pointer-events": "none"
        });
      } else {
        if (state.selected !== null) {
          answerButton.addClass("active");
        }
      }
      renderOptions();
    };

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

    initOptions();

    var removeButton = function removeButton() {
      answerButton.css({
        opacity: 0,
        pointerEvents: "none"
      });
    };

    answerButton.click(function () {
      state.isAnswered = true;
      render();
    });

    return {
      show: showQuestin
    };
  };

  var footer = function () {

    var footer = $(".plate11, .line.bottom");

    var init = function init() {
      hideElem(footer);
    };

    var show = function show() {
      showElem(footer);
    };

    init();

    return {
      show: show
    };
  }();

  var questions = [hookUpQueston($(".question-one"), 2, ".plate3, .plate2 .comment"), hookUpQueston($(".question-two"), 3, ".plate4 .comment, .plate5"), hookUpQueston($(".question-three"), 3, ".answer-three"), hookUpValQueston($(".question-four"), valPicker3, ".answer-four, .plate7-after"), hookUpValQueston($(".question-five"), valPicker2, ".answer-five"), hookUpValQueston($(".question-six"), valPicker, ".answer-six"), hookUpQueston($(".question-seven"), 1, ".answer-seven"), footer];

  $.each($('.footer img'), function (i, elem) {
    elem.onclick = questions[i].show;
  });
});
