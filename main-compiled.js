"use strict";

(function () {

  /*
   ██████  ██       ██████  ██████   █████  ██      ███████
  ██       ██      ██    ██ ██   ██ ██   ██ ██      ██
  ██   ███ ██      ██    ██ ██████  ███████ ██      ███████
  ██    ██ ██      ██    ██ ██   ██ ██   ██ ██           ██
   ██████  ███████  ██████  ██████  ██   ██ ███████ ███████
  */

  var scrollInProgress = false;

  /*
  ██      ██ ██████  ██████   █████  ██████  ██    ██     ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
  ██      ██ ██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
  ██      ██ ██████  ██████  ███████ ██████    ████       █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
  ██      ██ ██   ██ ██   ██ ██   ██ ██   ██    ██        ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
  ███████ ██ ██████  ██   ██ ██   ██ ██   ██    ██        ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
  */

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

  var scrollToElemTop = function scrollToElemTop($elem, isLast) {

    var winHeight = $(window).height();

    var helperElem = $('.prop');

    var setHelperPosotin = function setHelperPosotin(winHeight, $elem) {
      console.log($elem);
      var helperPosition = $elem.offset().top + winHeight;

      if (helperPosition > helperElem.offset().top) {
        helperElem.css({
          top: helperPosition
        });
      }
    };

    if (!isLast) setHelperPosotin(winHeight, $elem);

    //перемотка к нужному месту
    $('html, body').clearQueue().animate({
      scrollTop: $elem.offset().top
    }, {
      duration: 1000,
      done: function done() {
        return scrollInProgress = false;
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

    scrollInProgress = true;

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
        return scrollInProgress = false;
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

  /*
  ██      ███████  ██████  ███████ ███    ██ ██████
  ██      ██      ██       ██      ████   ██ ██   ██
  ██      █████   ██   ███ █████   ██ ██  ██ ██   ██
  ██      ██      ██    ██ ██      ██  ██ ██ ██   ██
  ███████ ███████  ██████  ███████ ██   ████ ██████
  */

  function Legend(mapMain) {

    var initColors = function initColors() {
      $(".legend .bloc .color").each(function (id, e) {
        var color = getColor((id + 1) / 10);
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

  /*
  ██    ██ ███████  █████  ██████  ███████
   ██  ██  ██      ██   ██ ██   ██ ██
    ████   █████   ███████ ██████  ███████
     ██    ██      ██   ██ ██   ██      ██
     ██    ███████ ██   ██ ██   ██ ███████
  */

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

  /*
  ███████  ██████ ██████   ██████  ██      ██      ███████ ██████
  ██      ██      ██   ██ ██    ██ ██      ██      ██      ██   ██
  ███████ ██      ██████  ██    ██ ██      ██      █████   ██████
       ██ ██      ██   ██ ██    ██ ██      ██      ██      ██   ██
  ███████  ██████ ██   ██  ██████  ███████ ███████ ███████ ██   ██
  */

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

    addMouseewheelEvent(scrollContentWrapper, onWheel);

    // *** Listeners ***
    scrollContentWrapper.addEventListener('scroll', moveScroller);
  }

  /*
  ██████  ██ ███████  ██████ ██   ██  █████  ██████  ████████
  ██   ██ ██ ██      ██      ██   ██ ██   ██ ██   ██    ██
  ██████  ██ █████   ██      ███████ ███████ ██████     ██
  ██      ██ ██      ██      ██   ██ ██   ██ ██   ██    ██
  ██      ██ ███████  ██████ ██   ██ ██   ██ ██   ██    ██
  */

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

  /*
  ██████   ██████  ██████  ██    ██ ██████
  ██   ██ ██    ██ ██   ██ ██    ██ ██   ██
  ██████  ██    ██ ██████  ██    ██ ██████
  ██      ██    ██ ██      ██    ██ ██
  ██       ██████  ██       ██████  ██
  */

  function PopUp(mapMain, mainElem, rad, isMobile) {

    var pieChart = new PieChart(mainElem, rad);

    var popUp = mainElem;
    var closeButton = popUp.find(".head .btn.close");
    var pieContainer = popUp.find(".body .pie");

    var dataFields = popUp.find(".body .data .item");
    var stateNameFeald = popUp.find(".head .region span");
    var infectedFeald = dataFields.find(".infected");
    var diedFeald = dataFields.find(".dead");
    var infectedTextFeald = $(dataFields.find(".leble")[0]);

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
        infectedText = "Число инфицированных на 100 тысяч населения";
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
      infectedTextFeald.text(infectedText);
      diedFeald.text(died);

      // if (mapMain.state.regionId && !isMobile) {
      //    setPosition(findPosition());
      // }
      open();
    };
  }

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

  /*
  ███    ███  █████  ██████
  ████  ████ ██   ██ ██   ██
  ██ ████ ██ ███████ ██████
  ██  ██  ██ ██   ██ ██
  ██      ██ ██   ██ ██
  */

  function Map(mapMain) {

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
          'fill': getColor(percent)
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

  /*
  ████████  ██████   ██████  ██      ███████ ██████  ████████ ███    ██
     ██    ██    ██ ██       ██      ██      ██   ██    ██    ████   ██
     ██    ██    ██ ██   ███ ██      █████   ██████     ██    ██ ██  ██
     ██    ██    ██ ██    ██ ██      ██      ██   ██    ██    ██  ██ ██
     ██     ██████   ██████  ███████ ███████ ██████     ██    ██   ████
  */

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

  /*
  ██████  ██████   ██████  ██████      ██████   ██████  ██     ██ ███    ██
  ██   ██ ██   ██ ██    ██ ██   ██     ██   ██ ██    ██ ██     ██ ████   ██
  ██   ██ ██████  ██    ██ ██████      ██   ██ ██    ██ ██  █  ██ ██ ██  ██
  ██   ██ ██   ██ ██    ██ ██          ██   ██ ██    ██ ██ ███ ██ ██  ██ ██
  ██████  ██   ██  ██████  ██          ██████   ██████   ███ ███  ██   ████
  */

  function DropDown(mapMain, mainElem) {

    var that = this;
    var isOpen = false;
    var $select = mainElem.find(" .head");
    var scrollable = mainElem.find(".scrollable");
    var closeImg = mainElem.find(" .close_button img");

    var container = scrollable.find(".content");

    var head = mainElem.find(".text");

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
          console.log("click");
          e.stopPropagation();
          mapMain.state.regionId = this.dataset.regionid;
          mapMain.render();
          that.close();
        });
      });
      that.close();
    };

    this.scroller = new Scroller(mainElem.find(".scrollable"));
  }

  function DropDownMobile(mapMain, mainElem) {
    var that = this;
    var isOpen = false;
    var $select = mainElem.find(" .head");
    var scrollable = mainElem.find(".scrollable");
    var closeImg = mainElem.find(" .close_button img");

    var container = scrollable.find(".content");

    var head = mainElem.find(".text");

    var dropDownElems = mainElem.find(".togle-abs-rel");

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

  /*
  ███    ███  █████  ██████      ███    ███  █████  ██ ███    ██
  ████  ████ ██   ██ ██   ██     ████  ████ ██   ██ ██ ████   ██
  ██ ████ ██ ███████ ██████      ██ ████ ██ ███████ ██ ██ ██  ██
  ██  ██  ██ ██   ██ ██          ██  ██  ██ ██   ██ ██ ██  ██ ██
  ██      ██ ██   ██ ██          ██      ██ ██   ██ ██ ██   ████
  */

  function mapMain(data) {

    this.data = data;
    var mapMain = this;

    // -------------Map State------------
    this.state = {
      year: 1994,
      regionId: "",
      display: "abs",
      isPlaing: true
    };

    this.popUpElem = $(".hide-mobile .banner");

    var map = new Map(this);
    var legend = new Legend(this);
    var years = new Years(this);
    var dropDown = new DropDown(this, $(".map.hide-mobile"));
    var popUp = new PopUp(this, this.popUpElem, 40, false);
    var togleBtn = new TogleBtn(this);
    var play = new Play(this);

    var findPosition = function findPosition() {
      if (!map.selectedReg) return;

      var mapRect = map.mapElem.getBoundingClientRect();
      var regRect = map.selectedReg.getBoundingClientRect();
      var popUpRect = mapMain.popUpElem[0].getBoundingClientRect();

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
        mapMain.popUpElem[0].style[prop] = obj[prop] ? obj[prop] + "px" : "";
      });
    };

    this.render = function () {
      map.render();
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
        mapMain.state.regionId = "";
        mapMain.state.isPlaing = false;
        mapMain.render();
      });

      window.onresize = function () {
        setPosition(findPosition());
      };
    };
  };

  function mapMainMobile(data) {

    this.data = data;
    var mapMain = this;

    // -------------Map State------------
    this.state = {
      year: 1999,
      regionId: "Москва",
      display: "abs"
    };

    var dropDown = new DropDown(this, $(".map.hide-desktop .item.drop_down:last-of-type"));
    var dropDownMobile = new DropDownMobile(this, $(".map.hide-desktop .item.drop_down").first());
    var popUp = new PopUp(this, $(".hide-desktop .banner"), 50, true);
    var yearSelect = new YearSelect(this, $('.year-select'));

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

  $(function () {

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
          var color = getColorMeta(startColor, endColor, val / max);
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

    // newInfectedChartMobile.show();

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
        return Math.round(percent * 100) == rightAnswer;
      };

      return {
        isRight: isRight
      };
    };

    var valPicker3 = function valPicker3(fn, state) {
      var circle = document.querySelector('.guess-growth-main-small');
      var textFeald = document.querySelector('.guess-growth-main-text');
      var r = 46;
      var text = "1 000 000";
      var selectedVal = 1000000;

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
        selectedVal = calculeteNewVal(h);
        text = valToText(selectedVal);
        requestAnimationFrame(changeR);
        requestAnimationFrame(changeText);
        //что записывать в состояние. Это вообще используется?
        state.selected = h / 230;
        fn();
      };

      var onDragY = function onDragY(event, ui) {

        var h = 230 - ui.position.left;
        r = calculeteNewR(h);
        selectedVal = calculeteNewVal(h);
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
        return selectedVal < 3000000 && selectedVal > 2000000;
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
      $('.footer img')[id].onclick = function () {
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

      // console.log($('.footer img')[id]);

      $('.footer img')[id].onclick = function () {
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

      $('.footer img')[id].onclick = function () {
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
        mainElems[parseInt(this.dataset.id)].show();
        select(parseInt(this.dataset.id));
      });

      var render = function render() {

        mainElems.forEach(function (e, i) {
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
          var map = new mapMain(data);
          var mapMobile = new mapMainMobile(data);
          map.init();
          map.render();
          mapMobile.init();
          mapMobile.render();
        });
      });
    };

    // getDataAndMap();

    // keyReasonChart.show();

    var mainElems = [new hookUpQueston(0, $(".question-one"), 2, ".plate3"), new hookUpQueston(1, $(".question-two"), 3, ".plate5", getDataAndMap), new hookUpQueston(2, $(".question-three"), 2, ".answer-three, .plate6-after", function () {
      newInfectedChart.show();
      newInfectedChartMobile.show();
    }), new hookUpValQueston(3, $(".question-four"), valPicker3, ".answer-four, .plate7-after"), new hookUpValQueston(4, $(".question-five"), valPicker2, ".answer-five", keyReasonChart.show), new hookUpValQueston(5, $(".question-six"), valPicker, ".answer-six"), new hookUpQueston(6, $(".question-seven"), 1, ".answer-seven, .plate10-after"), new Footer(7)];

    mainElems.forEach(function (elem) {
      return elem.init();
    });

    // mainElems.forEach(elem => elem.show());

    var results = [{
      title: "Плохой",
      text: "СПИД, как известно, не спит. А вы почти ничего о нём не знаете"
    }, {
      title: "Средний",
      text: "Кажется, вы, по крайней мере, знаете, чем отличается ВИЧ от СПИД"
    }, {
      title: "Хороший",
      text: "Вы отлично разбираетесь в этой невесёлой теме!"
    }];

    var renderResult = function renderResult() {

      var resultVal = mainElems.reduce(function (val, e) {
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
      for (var i = mainElems.length - 1; i >= 0; i--) {
        var e = mainElems[i];
        if (i == 0 && !e.isShown) {
          mainElems[i].show();
          sideBars.show();
          return;
        }
        if (e.isShown && e.result !== null && i < mainElems.length - 1) {
          if (!mainElems[i + 1].isShown) mainElems[i + 1].show();
          return;
        }
      }
    };

    var oldScrollPositoin = window.pageYOffset || document.documentElement.scrollTop;

    addMouseewheelEvent(document, onWheel);

    function onWheel(e) {
      e = e || window.event;

      if (scrollInProgress) {
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
