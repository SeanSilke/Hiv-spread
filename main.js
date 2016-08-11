"use strict";

$(".map_body").load("map.svg", function() {

  let h = window.innerHeight ||
    document.documentElement.clientHeight ||
    document.body.clientHeight;

  let showInProgress = false;

  let showElem = ($elem, isLast) => {
    showInProgress = true;
    $elem.css({
        display: "block",
      }).clearQueue()
      .animate({
        opacity: 1
      }, 1000);

    let center = $elem.height() > h ? h / 2 : $elem.height() / 2;

    let helperPosition = ($elem.offset().top + $elem.height() / 2 + h / 2);

    if (!isLast && helperPosition > $('.prop').offset().top) {
      $('.prop').css({
        top: helperPosition
      });
    }

    let scrollTo = $elem.height() < h ? $elem.offset().top - h / 2 + $elem.height() / 2 : $elem.offset().top;


    $('html, body').clearQueue()
      .animate({
        scrollTop: scrollTo
      }, {
        duration: 1000,
        done: () => showInProgress = false
      });

  };

  let hideElem = ($elem) => {
    $elem.css({
      display: "none",
      opacity: 0,
      transition: "opacity 1s"
    });
  };

  let doElsCollide = function(el1, el2) {

    let rect1 = el1.getBoundingClientRect();
    let rect2 = el2.getBoundingClientRect();

    return (rect1.left < rect2.left + rect2.width &&
      rect1.left + rect1.width > rect2.left &&
      rect1.top < rect2.top + rect2.height &&
      rect1.height + rect1.top > rect2.top);
  };

  let getColor = function(percent) {
    if (percent > 1) return "rgb(180,32,37)";

    let r = Math.floor(232 - (232 - 180) * percent);
    let g = Math.floor(232 - (232 - 32) * percent);
    let b = Math.floor(232 - (232 - 37) * percent);

    return `rgb(${r},${g},${b})`;

  };

  function insertAfter(elem, refElem) {
    return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
  }

  // ------------Data process functions------


  let newDataProseed = function(csvFile) {
    let r = {};
    let regionsArr = csvFile.split("\n");
    regionsArr.pop(); //remove end line

    regionsArr.forEach(function(e, i) {
      e = e.split(";");
      let key = e.shift();
      let shortName = e.shift();
      let name = e.shift();
      r[key] = {
        name: name,
        shortName: shortName,
        rowYearsData: e,
      };
    });

    let years = [];
    for (let i = 0; i <= 20; i++) {
      years.push(1994 + i);
    }



    Object.keys(r).forEach(function(region) {

      r[region].absDied = {};
      r[region].absInfected = {};
      r[region].relInfected = {};
      years.forEach(function(year) {
        r[region].absInfected[year] = infectedInYear(year, r[region].rowYearsData);
        r[region].absDied[year] = diedInYear(year, r[region].rowYearsData);
        r[region].relInfected[year] = relnIfectedInYear(year, r[region].rowYearsData);
      });


    });

    return r;

  };

  let infectedInYear = function(year, rowRregData) {
    let ofset = 0 + (2014 - year) * 3;
    return rowRregData[ofset];
  };


  let diedInYear = function(year, rowRregData) {
    let ofset = 1 + (2014 - year) * 3;
    return rowRregData[ofset];
  };

  let relnIfectedInYear = function(year, rowRregData) {
    let ofset = 2 + (2014 - year) * 3;
    return rowRregData[ofset];
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



  /*
  ██     ██ ██ ███    ██ ██████   ██████  ██     ██      ██████  ███    ██     ███████  ██████ ██████   ██████  ██      ██
  ██     ██ ██ ████   ██ ██   ██ ██    ██ ██     ██     ██    ██ ████   ██     ██      ██      ██   ██ ██    ██ ██      ██
  ██  █  ██ ██ ██ ██  ██ ██   ██ ██    ██ ██  █  ██     ██    ██ ██ ██  ██     ███████ ██      ██████  ██    ██ ██      ██
  ██ ███ ██ ██ ██  ██ ██ ██   ██ ██    ██ ██ ███ ██     ██    ██ ██  ██ ██          ██ ██      ██   ██ ██    ██ ██      ██
   ███ ███  ██ ██   ████ ██████   ██████   ███ ███       ██████  ██   ████     ███████  ██████ ██   ██  ██████  ███████ ███████
  */


  let onscroll = (function() {
    let bgColor = null;
    let H = document.body.offsetHeight;


    let colors = [
      [26, 14, 14],
      [22, 47, 57],
      [26, 14, 14],
      [19, 50, 61],
      [19, 50, 61],
      [12, 35, 42],
      [12, 35, 42],
      [22, 47, 57],
      [44, 108, 111],
    ]

    let refElemSelectors = [
      '.plate1',
      ".plate2-3",
      ".plate4-5",
      ".plate6",
      ".plate7",
      ".plate8",
      ".plate9",
      ".plate10",
      ".plate11"
    ];

    let calcRefPoint = (elem) => ($(elem).outerHeight() / 2 + $(elem).offset().top);

    let refPoint = refElemSelectors.map(calcRefPoint);


    let getBotomRefIndex = (px) => {
      let i;
      for (i = 0; i < refPoint.length; i++) {
        if (refPoint[i] > px) break;
      };
      return i;
    };

    let getPersents = (px, refTop, refBotom) => ((px - refTop) / (refBotom - refTop));

    let onscroll = function() {
      let scrolled = window.pageYOffset || document.documentElement.scrollTop;
      let windowCenter = scrolled + window.innerHeight / 2;
      // console.log("windowCenter",windowCenter);

      let botomIndex = getBotomRefIndex(windowCenter);
      let percent = getPersents(windowCenter, refPoint[botomIndex - 1], refPoint[botomIndex]);
      let color = getColorMeta(colors[botomIndex - 1], colors[botomIndex], percent);
      // console.log(colors[botomIndex-1],colors[botomIndex], percent);

      if (color !== bgColor) {
        window.requestAnimationFrame(function() {
          window.document.body.style.backgroundColor = `rgb(${color})`;
        });
        bgColor = color;
      }
    };

    // onscroll();

    return onscroll;

  })();

  window.onscroll = onscroll;



  /*
  ██      ███████  ██████  ███████ ███    ██ ██████
  ██      ██      ██       ██      ████   ██ ██   ██
  ██      █████   ██   ███ █████   ██ ██  ██ ██   ██
  ██      ██      ██    ██ ██      ██  ██ ██ ██   ██
  ███████ ███████  ██████  ███████ ██   ████ ██████
  */

  function Legend(mapMain) {

    let initColors = function() {
      $(".legend .bloc .color").each(function(id, e) {
        let color = getColor((id + 1) / 10);
        $(e).css({
          "background-color": color
        });
      });
    };

    let renderValues = function() {
      let multiplier = mapMain.state.display == "abs" ? 100 : 10;

      $(".legend .bloc .val").each(function(id, e) {
        $(e).text(multiplier * Math.pow(2, id));
      });
    };

    this.init = function() {
      initColors();
      renderValues();
    };

    this.render = function() {
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
    this.render = function() {

      $(".years .col").each(function(id, e) {
        let year = parseInt($(e).attr("id"));
        if (year === mapMain.state.year) {
          $(e).addClass("active");
        } else {
          $(e).removeClass("active");
        }
      });

    };

    // _____________click__________

    $(".years .col").on("click", function(e) {
      e.stopPropagation();
      mapMain.state.isPlaing = false;
      let year = parseInt($(this).attr("id"));
      mapMain.state.year = year;
      mapMain.render();
    });

  }

  function Play(mapMain) {

    let that = this;

    this.play = function() {
      if (!mapMain.state.isPlaing) {
        return;
      }

      if (mapMain.render) {

        if (mapMain.state.year == 2014) {
          mapMain.state.year = 1994
        } else {
          mapMain.state.year++;
        }

        mapMain.render();
      }

      setTimeout(function() {
        that.play();
      }, 1000);
    }

  }


  /*
  ███████  ██████ ██████   ██████  ██      ██      ███████ ██████
  ██      ██      ██   ██ ██    ██ ██      ██      ██      ██   ██
  ███████ ██      ██████  ██    ██ ██      ██      █████   ██████
       ██ ██      ██   ██ ██    ██ ██      ██      ██      ██   ██
  ███████  ██████ ██   ██  ██████  ███████ ███████ ███████ ██   ██
  */


  function Scroller(mainElem) {

    let scrollContainer = mainElem[0],
      scrollContentWrapper = mainElem.find('.content-wrapper')[0],
      scrollContent = mainElem.find('.content')[0],
      contentPosition = 0,
      scrollerBeingDragged = false,
      scroller,
      topPosition,
      scrollerHeight,
      normalizedPosition;


    function calculateScrollerHeight() {
      // *Calculation of how tall scroller should be
      let visibleRatio = scrollContainer.offsetHeight / scrollContentWrapper.scrollHeight;
      visibleRatio = 0.05;
      return visibleRatio * scrollContainer.offsetHeight;
    }

    function moveScroller(evt) {
      // Move Scroll bar to top offset
      let scrollPercentage = evt.target.scrollTop / scrollContentWrapper.scrollHeight;
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
        let mouseDifferential = evt.pageY - normalizedPosition;
        let scrollEquivalent = mouseDifferential *
          (scrollContentWrapper.scrollHeight / scrollContainer.offsetHeight);
        scrollContentWrapper.scrollTop = contentPosition + scrollEquivalent;
      }
    }

    this.create = function() {
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

  }

  /*
  ██████  ██ ███████  ██████ ██   ██  █████  ██████  ████████
  ██   ██ ██ ██      ██      ██   ██ ██   ██ ██   ██    ██
  ██████  ██ █████   ██      ███████ ███████ ██████     ██
  ██      ██ ██      ██      ██   ██ ██   ██ ██   ██    ██
  ██      ██ ███████  ██████ ██   ██ ██   ██ ██   ██    ██
  */


  function PieChart(mainElem, rad) {
    let path = null;
    let svgElem = mainElem.find("#svg-pie")[0];

    this.render = function(deg) {
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

      let cx = rad,
        cy = rad,
        rx = rad,
        ry = rad;

      let p = svgElem.createSVGPoint();
      p.x = 0;
      p.y = 1;


      let m = svgElem.createSVGMatrix();


      let p2 = p.matrixTransform(m.rotate(deg));

      p2.x = cx - p2.x * rx;
      p2.y = cy - p2.y * ry;

      path = document.createElementNS("http://www.w3.org/2000/svg", "path");

      let d;

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


    let pieChart = new PieChart(mainElem, rad);

    let popUp = mainElem;
    let closeButton = popUp.find(".head .btn.close");
    let pieContainer = popUp.find(".body .pie");

    let dataFields = popUp.find(".body .data .item");
    let stateNameFeald = popUp.find(".head .region span");
    let infectedFeald = dataFields.find(".infected");
    let diedFeald = dataFields.find(".dead");
    let infectedTextFeald = $(dataFields.find(".leble")[0]);

    let close = function() {
      hide();
      mapMain.state.regionId = "";
      mapMain.render();
    };

    closeButton.click(function(e) {
      close();
    });

    let hide = function() {
      popUp.css('opacity', 0);
      popUp.css('visibility', "hidden");

    };

    let open = function() {
      popUp.css('opacity', 1);
      popUp.css('visibility', "visible");
    };


    popUp.click(function(e) {
      e.stopPropagation();
    });


    this.render = function() {
      if (!mapMain.state.regionId) {
        hide();
        return;
      }

      let name, infected, died, infectedText;
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
    let year = mainElem.find(".selected-year");
    let moreBtn = mainElem.find(".more");
    let lessBtn = mainElem.find(".less");

    moreBtn.click(() => {
      if (mapMain.state.year < 2014) mapMain.state.year++;
      mapMain.render();
    })

    lessBtn.click(() => {
      if (mapMain.state.year > 1994) mapMain.state.year--;
      mapMain.render();
    })

    this.render = () => {
      year.text(mapMain.state.year)
    }
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
    let that = this;


    let regions = $("#svg-map path, #svg-map polygon");
    let selectedReg = null;

    let setRegsColor = function(year) {
      Object.keys(mapMain.data).forEach(function(reginoId) {

        let value, percent;

        if (mapMain.state.display == "abs") {

          value = mapMain.data[reginoId].absInfected[year];

          if (value < 100) {
            percent = 0;
          } else {
            percent = (Math.log2(value / 100)) / 9;
          }
        } else {
          value = mapMain.data[reginoId].relInfected[year];

          if (value < 10) {
            percent = 0;
          } else {
            percent = (Math.log2(value / 10)) / 9;
          }

        }

        $('#' + reginoId).css({
          'fill': getColor(percent),
        });
      });
    };

    let setSelectedRegion = function(regionId) {
      that.selectedReg && that.selectedReg.classList.remove('selected');
      if (regionId) {
        that.selectedReg = document.getElementById(regionId);
        that.selectedReg.classList.add('selected');
      }
    };



    this.render = function() {
      setRegsColor(mapMain.state.year);
      setSelectedRegion(mapMain.state.regionId);
      if (mapMain.state.regionId) {
        this.mapElem.classList.add('regSelected');
      } else {
        this.mapElem.classList.remove('regSelected');
      }
    };

    regions.click(
      function(e) {
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
      }
    );
  }

  /*
  ████████  ██████   ██████  ██      ███████ ██████  ████████ ███    ██
     ██    ██    ██ ██       ██      ██      ██   ██    ██    ████   ██
     ██    ██    ██ ██   ███ ██      █████   ██████     ██    ██ ██  ██
     ██    ██    ██ ██    ██ ██      ██      ██   ██    ██    ██  ██ ██
     ██     ██████   ██████  ███████ ███████ ██████     ██    ██   ████
  */


  function TogleBtn(mapMain) {
    let btn = $(".map .map_header .btn");

    btn.click(function(e) {
      e.stopPropagation();
      mapMain.state.isPlaing = false;
      mapMain.state.display = this.dataset.displaytype;
      mapMain.render();
    });

    let setButtons = function(display) {
      btn.each(function(i, elem) {
        if (elem.dataset.displaytype == display) elem.classList.add('active');
        else elem.classList.remove('active');
      });
    };

    this.render = function() {
      setButtons(mapMain.state.display);
    }

  }

  /*
  ██████  ██████   ██████  ██████      ██████   ██████  ██     ██ ███    ██
  ██   ██ ██   ██ ██    ██ ██   ██     ██   ██ ██    ██ ██     ██ ████   ██
  ██   ██ ██████  ██    ██ ██████      ██   ██ ██    ██ ██  █  ██ ██ ██  ██
  ██   ██ ██   ██ ██    ██ ██          ██   ██ ██    ██ ██ ███ ██ ██  ██ ██
  ██████  ██   ██  ██████  ██          ██████   ██████   ███ ███  ██   ████
  */

  function DropDown(mapMain, mainElem) {

    let that = this;
    let isOpen = false;
    let $select = mainElem.find(".map_header .drop_down .head");
    let scrollable = mainElem.find(".scrollable");
    let closeImg = mainElem.find(".map_header .item.drop_down .close_button img");

    let container = scrollable.find(".content");

    let head = mainElem.find(".drop_down .text");

    $select.click(
      function(e) {
        e.stopPropagation();
        mapMain.state.isPlaing = false;
        if (isOpen) {
          that.close();
        } else {
          that.open();
        }
      }
    );

    $(".scrollable").click(
      function(e) {
        e.stopPropagation();
        mapMain.state.isPlaing = false;
      }
    );


    this.close = function() {
      scrollable.css('visibility', 'hidden');
      isOpen = false;
      closeImg[0].style.transform = "rotate(0deg)";
    };

    this.open = function() {
      scrollable.css('visibility', 'visible');
      isOpen = true;
      closeImg[0].style.transform = "rotate(180deg)";
    };

    this.render = function() {
      if (mapMain.state.regionId) {
        head.text(mapMain.data[mapMain.state.regionId].shortName);
      } else {
        head.text("Регион");
      }

      // Dirty Hack
      container.empty();
      Object.keys(mapMain.data).forEach(
        function(region) {

          let shortName = mapMain.data[region].shortName;

          let elem = $(`<div class="item" data-regionId="${region}"> ${shortName} </div>`);

          if (region === mapMain.state.regionId) {
            elem = $(`<div class="active" data-regionId="${region}"> ${shortName} </div>`);
          }

          container.append(elem);

          elem.click(function(e) {
            console.log("click");
            e.stopPropagation();
            mapMain.state.regionId = this.dataset.regionid;
            mapMain.render();
            that.close();
          });
        }
      );
      that.close();
    };

    this.scroller = new Scroller(mainElem.find(".scrollable"));
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
    let mapMain = this;

    // -------------Map State------------
    this.state = {
      year: 1994,
      regionId: "",
      display: "abs",
      isPlaing: true,
    };

    this.popUpElem = $(".hide-mobile .banner");

    let map = new Map(this);
    let legend = new Legend(this);
    let years = new Years(this);
    let dropDown = new DropDown(this, $(".map.hide-mobile"));
    let popUp = new PopUp(this, this.popUpElem, 40, false);
    let togleBtn = new TogleBtn(this);
    let play = new Play(this);


    let findPosition = function() {
      if (!map.selectedReg) return;

      let mapRect = map.mapElem.getBoundingClientRect();
      let regRect = map.selectedReg.getBoundingClientRect();
      let popUpRect = mapMain.popUpElem[0].getBoundingClientRect();

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
        mapMain.popUpElem[0].style[prop] = obj[prop] ? obj[prop] + "px" : "";
      });
    };

    this.render = function() {
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


    this.init = function() {
      legend.init();
      dropDown.scroller.create();
      play.play();

      document.body.addEventListener("click",
        function(e) {
          mapMain.state.regionId = "";
          mapMain.state.isPlaing = false;
          mapMain.render();
        }
      );

      window.onresize = function() {
        setPosition(findPosition());
      };
    };

  };


  function mapMainMobile(data) {

    this.data = data;
    let mapMain = this;

    // -------------Map State------------
    this.state = {
      year: 1999,
      regionId: "Москва",
      display: "abs"
    };

    let dropDown = new DropDown(this, $(".map.hide-desktop"));
    let popUp = new PopUp(this, $(".hide-desktop .banner"), 50, true);
    let togleBtn = new TogleBtn(this);
    let yearSelect = new YearSelect(this, $('.year-select'));

    this.render = function() {
      dropDown.render();
      popUp.render();
      togleBtn.render();
      yearSelect.render();
    };


    this.init = function() {
      dropDown.scroller.create();
    };

  };



  $(function() {

    let newInfectedChartMobile = (() => {

      let data = [
        100,
        203,
        1513,
        4315,
        3971,
        19758,
        59609,
        88739,
        52170,
        39232,
        37002,
        39407,
        43007,
        44713,
        54563,
        58410,
        58298,
        62387,
        70832,
        79764,
        89667,
        93000,
      ];


      let bars = document.querySelectorAll('.chart.newInfected-mobile .body .canvas .block');


      let startColor = [228, 152, 152];
      let endColor = [190, 32, 37];
      let max = 100 * 1000;

      let i = 0;

      let rendernewInfected = function() {
        if (i >= data.length) {
          let labels = document.querySelectorAll('.newInfected_label_text');
          [].forEach.call(labels, elem => elem.style.opacity = 0.9);
          return;
        }
        let val = data[i];
        if (val < 4000) {
          bars[i].style.backgroundColor = 'rgb(24,179,172)';
          bars[i].style.marginLeft = -190 * 0.98 + "px";
        } else {
          let color = getColorMeta(startColor, endColor, val / max);
          bars[i].style.backgroundColor = `rgb(${color})`;
          bars[i].style.marginLeft = (0 - 190) * (1 - val / max) + "px";
        }

        if (i == 3) {
          bars[i].style.backgroundColor = 'rgb(24,179,172)';
        }

        i++;
        setTimeout(rendernewInfected, 30);
      };

      let show = () => {

        setTimeout(function() {
          rendernewInfected();
        }, 1000);

      };

      return {
        show
      }

    })();

    // newInfectedChartMobile.show();

    let newInfectedChart = (() => {

      let data = [
        100,
        203,
        1513,
        4315,
        3971,
        19758,
        59609,
        88739,
        52170,
        39232,
        37002,
        39407,
        43007,
        44713,
        54563,
        58410,
        58298,
        62387,
        70832,
        79764,
        89667,
        93000,
      ];


      let bars = document.querySelectorAll('.chart.newInfected .body .canvas .bar');


      let startColor = [228, 152, 152];
      let endColor = [190, 32, 37];
      let max = 100 * 1000;

      let i = 0;

      let rendernewInfected = function() {
        if (i >= data.length) {
          let labels = document.querySelectorAll('.newInfected_label_text');
          [].forEach.call(labels, elem => elem.style.opacity = 0.9);
          return;
        }
        let val = data[i];
        if (val < 4000) {
          bars[i].style.backgroundColor = 'rgb(24,179,172)';
          bars[i].style.marginTop = 260 * 0.98 + "px";
        } else {
          let color = getColorMeta(startColor, endColor, val / max);
          bars[i].style.backgroundColor = `rgb(${color})`;
          bars[i].style.marginTop = (1 - val / max) * 260 + "px";
        }

        if (i == 3) {
          bars[i].style.backgroundColor = 'rgb(24,179,172)';
        }

        i++;
        setTimeout(rendernewInfected, 30);
      };

      let show = () => {

        setTimeout(function() {
          rendernewInfected();
        }, 1000);

      };

      return {
        show
      }

    })();


    // newInfectedChart.show();


    let keyReasonChart = (() => {

      //	Наркотики	Гетеросекс.	Гомосекс.	От матерей

      //как расположенны бары на диаграмме
      let barsPosition = ["drags", "fromMather", "hetero", "homo"];


      //как представленые данные в элементе матрици
      let legend = {
        drags: 0,
        hetero: 1,
        homo: 2,
        fromMather: 3
      };

      let valMatrix = [
        [3.3, 43, 53, 0.7],
        [6, 41, 52.9, 0.1],
        [84, 7, 8.7, 0.3],
        [87, 10.9, 1.9, 0.2],
        [79.1, 17.8, 2.7, 0.4],
        [91.8, 7.4, 0.6, 0.1],
        [95.5, 4.2, 0.2, 0.1],
        [93.2, 6.4, 0.2, 0.2],
        [81.2, 17.7, 0.4, 0.7],
        [72.3, 25.4, 0.5, 1.7],
        [66.7, 29.9, 0.8, 2.5],
        [64.1, 31.8, 1.1, 3.0],
        [63.3, 33.0, 0.7, 2.9],
        [61.5, 35.2, 1.0, 2.3],
        [61.3, 35.6, 1.1, 2.0],
        [59.8, 37, 1.4, 1.8],
        [57.9, 39.7, 1.3, 1.1],
        [56.2, 41.4, 1.3, 1.1],
        [56.4, 41.7, 1.1, 0.8],
        [54.9, 43.1, 1, 1.0],
        [58.4, 39.7, 1.1, 0.8]
      ];

      let defYearVal = [25, 25, 25, 25];

      let years = document.querySelectorAll('.key-reason-canvas .year');

      let yearsMobile = document.querySelectorAll(".key-reason-mobile .year");

      let setValue = function(year, valArr) {
        let bars = year.querySelectorAll(".bar");
        [].forEach.call(bars, function(elem, i) {
          let name = barsPosition[i];
          let percent = valArr[legend[name]];
          elem.classList.add(name);
          elem.style.height = percent + "%";
        });
      };

      let setValueMobile = function(year, valArr) {
        let bars = year.querySelectorAll(".bar");
        [].forEach.call(bars, function(elem, i) {
          let name = barsPosition[i];
          let percent = valArr[legend[name]];
          elem.classList.add(name);
          elem.style.width = percent + "%";
        });
      };

      let setYears = (i, fn, years) => {
        if (i > years.length - 1) {
          $(".key-reason-mobile-year-text").css({
            opacity: 0.9,
          })
          return;
        }
        fn(years[i], valMatrix[i]);
        setTimeout(setYears, 80, ++i, fn, years);
      };

      let startIndex = 0;

      let show = () => {
        // setYears(startIndex, setValue, years)
        setTimeout(setYears, 1000, 0, setValue, years);
        setTimeout(setYears, 1000, 0, setValueMobile, yearsMobile);
      }

      //move init to some global init

      let initYears = (i, fn, years) => {
        if (i > 20) return;
        fn(years[i], defYearVal);
        initYears(++i, fn, years);
      };

      initYears(startIndex, setValue, years);
      initYears(startIndex, setValueMobile, yearsMobile)

      return {
        show: show,
      }

    })();

    let valPicker = function(fn, state) {

      let meter = document.querySelector('.red-meter-9');
      let greenMeter = document.querySelector('.thermometer-9 .green-meter-9');
      let ribbonSlider = document.querySelector('#ribbon-slider-9');
      let percent;
      let max = 848;
      let text = document.querySelector('.red-meter-9>div');
      let rightAnswer = 12;


      let renderMobile = (percent) => {
        $(".answers-mobile.hide-desktop .red-meter-9")[0].style.left = (-1 + percent) * 100 + "%";
        $(".valuepicker-mobile-picker-9")[0].style.left = (percent) * 235 + "px";
        $(".valuepicker-mobile-picker-9").text(Math.round(percent * 14) + 1);
      }


      let render = (percent) => {
        renderMobile(percent)
        ribbonSlider.style.left = percent * max + "px";
        meter.style.left = (0 - (1 - percent) * 100) + "%";
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

      let onDrag = (event, ui) => {
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
        drag: onDrag,
      });

      let onDragMobile = (event, ui) => {
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
        drag: onDragMobile,
      });


      let isRight = () => (Math.round(percent * 14) + 1 == rightAnswer)

      return {
        isRight
      }
    };


    let valPicker2 = function(fn, state) {
      let meter = document.querySelector('.red-meter-8');
      let greenMeter = document.querySelector('.thermometer .green-meter');
      let ribbonSlider = document.querySelector('#ribbon-slider-8');
      let percent;
      let max = 848;
      let text = document.querySelector('.red-meter-8>div');
      let rightAnswer = 40;


      let renderMobile = (percent) => {
        $(".answers-mobile.hide-desktop .red-meter-8")[0].style.left = (-1 + percent) * 100 + "%";
        $(".valuepicker-mobile-picker-8")[0].style.left = (percent) * 235 + "px";
        $(".valuepicker-mobile-picker-8").text(Math.round(percent * 100) + "%");
      }

      let render = (percent) => {
        renderMobile(percent);
        ribbonSlider.style.left = percent * max + "px";
        meter.style.left = (0 - (1 - percent) * 100) + "%";
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

      let onDrag = (event, ui) => {
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
        drag: onDrag,
      });


      let onDragMobile = (event, ui) => {
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
        drag: onDragMobile,
      });

      let isRight = () => {
        return Math.round(percent * 100) == rightAnswer;
      }

      return {
        isRight
      }

    };


    let valPicker3 = function(fn, state) {
      let circle = document.querySelector('.guess-growth-main-small');
      let textFeald = document.querySelector('.guess-growth-main-text');
      let r = 46;
      let text = "1 000 000";
      let selectedVal = 1000000;

      let valToText = val => {
        val = Math.round(val / 100) * 100;

        let arr = (val + "").split("");
        arr.splice(4, 0, " ");
        arr.splice(1, 0, " ");
        return arr.join("");
      };


      let changeR = function() {
        circle.style.width = r + "px";
        circle.style.height = r + "px";
      };

      let changeText = () => textFeald.innerHTML = text;

      let calculeteNewR = h => 46 + (230 - 46) * (1 - h / 230);

      let calculeteNewVal = h => 1000000 + (4000000) * (1 - h / 230);

      let onDrag = (event, ui) => {

        let h = ui.position.top;
        r = calculeteNewR(ui.position.top);
        selectedVal = calculeteNewVal(h)
        text = valToText(selectedVal);
        requestAnimationFrame(changeR);
        requestAnimationFrame(changeText);
        //что записывать в состояние. Это вообще используется?
        state.selected = h / 230;
        fn();
      };

      let onDragY = (event, ui) => {

        let h = 230 - ui.position.left;
        r = calculeteNewR(h);
        selectedVal = calculeteNewVal(h)
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
        drag: onDragY,
      });

      $(".valuepicker-picker").draggable({
        containment: "parent",
        axis: "y",
        drag: onDrag,
      });


      let isRight = () => (selectedVal < 3000000 && selectedVal > 2000000)

      return {
        isRight
      }
    };



    function hookUpValQueston(id, question, ValPicker, AnswerSelectors, onAnswer) {

      let answerButton = question.find(".answerButton");

      let answer = $(AnswerSelectors);


      let initAnswers = () => {
        hideElem(answer)
      };

      let showAnswers = () => {
        showElem(answer);
        onAnswer && onAnswer();
      };

      let initQuestion = () => {
        hideElem(question);
      };

      let showQuestin = () => {
        showElem(question)
      };

      let state = {
        selected: null,
        isAnswered: false,
        right: 12,
      };

      let render = function() {
        if (state.isAnswered) {
          removeButton();
          //костыль для нормальной обработки проктутки
          showInProgress = true;
          setTimeout(showAnswers, 1000);
          question.addClass("answered");
          sideBars.render();
        }
        if (state.selected !== null) {
          answerButton.addClass("active");
        };
      };

      let removeButton = () => {
        answerButton.css({
          opacity: 0,
          pointerEvents: "none"
        });
      };

      let valPicker = ValPicker(render, state);

      let that = this;
      this.result = null;

      answerButton.click(function() {
        state.isAnswered = true;
        that.result = valPicker.isRight()
        render();
      });

      $('.footer img')[id].onclick = function() {
        that.show();
      }

      this.init = () => {
        initQuestion();
        initAnswers();
      }

      this.isShown = false;

      this.show = function() {
        sideBars.select(id);
        if (id == 0) {
          sideBars.show()
        }
        showQuestin();
        this.isShown = true;
      }

    };

    function hookUpQueston(id, question, right, AnswerSelectors, onAnswer) {


      let answerButton = question.find(".answerButton");
      let answer = $(AnswerSelectors);


      let initAnswers = () => {
        hideElem(answer)
      };

      let showAnswers = () => {
        showElem(answer);
        onAnswer && onAnswer();
      };

      let initQuestion = () => {
        hideElem(question);
      };


      let showQuestin = () => {
        showElem(question)
      };

      let state = {
        selected: null,
        isAnswered: false,
        right: right,
      };

      let render = function() {
        if (state.isAnswered) {
          removeButton();
          //костыль для нормальной обработки проктутки
          showInProgress = true;
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

      let options = question.find(".answers .item .elem");

      let renderOptions = () => {
        if (!state.isAnswered) {
          $.each(options, function(i, elem) {
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

      let initOptions = () => {
        let onSelect = (event) => {
          state.selected = parseInt(event.currentTarget.dataset.id);
          render();
        };
        options.on("click", onSelect);
      };

      let removeButton = () => {
        answerButton.css({
          opacity: 0,
          pointerEvents: "none"
        });
      };

      let that = this;
      this.result = null;

      answerButton.click(function() {
        state.isAnswered = true;
        that.result = state.selected == state.right
        render();
      });

      // console.log($('.footer img')[id]);

      $('.footer img')[id].onclick = function() {
        that.show();
      }

      let init = () => {
        initOptions();
        initQuestion();
        initAnswers();
      }

      this.isShown = false;

      this.show = function() {
        sideBars.select(id);
        if (id == 0) {
          sideBars.show()
        }
        showQuestin();
        this.isShown = true;
      }
      this.init = init;
    };

    function Footer(id) {

      let footer = $(".plate11, .line.bottom");

      this.init = function() {
        hideElem(footer)
      };

      let that = this;

      $('.footer img')[id].onclick = function() {
        that.show();
      };

      this.show = function() {
        sideBars.select(id);
        console.log("show end");
        this.isShown = true;
        showElem(footer, true)
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
        mainElems[parseInt(this.dataset.id)].show();
        select(parseInt(this.dataset.id))
      })

      let render = () => {

        mainElems.forEach((e, i) => {
          if (e.result && e.result) {
            $sideBars[i].classList.add("box-true")
          } else if (e.result === false) {
            $sideBars[i].classList.add("box-false")
          }
        })
      }

      let show = () => {

        $mainElem.clearQueue()
          .animate({
            opacity: 1
          }, 1000);
      }

      this.isShown = false
      this.select = select;
      this.render = render;
      this.show = function() {
        this.isShown = true;
        show();
      };
    }

    let sideBars = new SideBars();

    let getDataAndMap = function() {
      let blob = null;
      let xhr = new XMLHttpRequest();
      xhr.open("GET", "HIV_Data_by_reg.csv");
      xhr.responseType = "blob"; //force the HTTP response, response-type header to be blob
      xhr.onload = function() {
        blob = xhr.response; //xhr.response is now a blob object
        myReader.readAsText(blob);
      };
      xhr.send();

      let myReader = new FileReader();
      myReader.addEventListener("loadend", function(e) {

        let data = newDataProseed(e.srcElement.result);
        let map = new mapMain(data);
        let mapMobile = new mapMainMobile(data)
        map.init()
        map.render();
        mapMobile.init();
        mapMobile.render();
      });
    }

    // getDataAndMap();

    // keyReasonChart.show();

    let mainElems = [
      new hookUpQueston(0, $(".question-one"), 2, ".plate3"),
      new hookUpQueston(1, $(".question-two"), 3, ".plate5", getDataAndMap),
      new hookUpQueston(2, $(".question-three"), 2, ".answer-three",
        function() {
          newInfectedChart.show();
          newInfectedChartMobile.show();
        }),
      new hookUpValQueston(3, $(".question-four"), valPicker3, ".answer-four, .plate7-after"),
      new hookUpValQueston(4, $(".question-five"), valPicker2, ".answer-five", keyReasonChart.show),
      new hookUpValQueston(5, $(".question-six"), valPicker, ".answer-six"),
      new hookUpQueston(6, $(".question-seven"), 1, ".answer-seven, .plate10-after"),
      new Footer(7),
    ];


    mainElems.forEach(elem => elem.init());


    // mainElems.forEach(elem => elem.show());


    let results = [{
      title: "Плохой",
      text: "СПИД, как известно, не спит. А вы почти ничего о нём не знаете",
    }, {
      title: "Средний",
      text: "Кажется, вы, по крайней мере, знаете, чем отличается ВИЧ от СПИД",
    }, {
      title: "Хороший",
      text: "Вы отлично разбираетесь в этой невесёлой теме!",
    }, ]


    let renderResult = function() {

      let resultVal = mainElems.reduce((val, e) => {
        if (e instanceof hookUpValQueston || e instanceof hookUpQueston) {
          val = (e.result) ? val + 1 : val
        }
        return val;
      }, 0)

      let resultTextId = resultVal > 5 ? 2 : resultVal > 3 ? 1 : 0;
      let obj = results[resultTextId]

      $(".plate11 .result .comment").text(obj.text)
    }


    let showNext = () => {
      for (let i = mainElems.length - 1; i >= 0; i--) {
        let e = mainElems[i];
        if (i == 0 && !e.isShown) {
          mainElems[i].show();
          sideBars.show()
          return;
        }
        if (e.isShown && e.result !== null && i < mainElems.length - 1) {
          if (!mainElems[i + 1].isShown) mainElems[i + 1].show();
          return;
        }
      }
    }


    let oldScrollPositoin = window.pageYOffset || document.documentElement.scrollTop;

    if (document.addEventListener) {
      if ('onwheel' in document) {
        // IE9+, FF17+, Ch31+
        document.addEventListener("wheel", onWheel);
      } else if ('onmousewheel' in document) {
        // устаревший вариант события
        document.addEventListener("mousewheel", onWheel);
      } else {
        // Firefox < 17
        document.addEventListener("MozMousePixelScroll", onWheel);
      }
    } else { // IE8-
      document.attachEvent("onmousewheel", onWheel);
    }


    function onWheel(e) {
      e = e || window.event;

      if (showInProgress) {
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
        return;
      }

      let newScrollPositoin = window.pageYOffset || document.documentElement.scrollTop;

      // wheelDelta не дает возможность узнать количество пикселей
      let delta = e.deltaY || e.detail || e.wheelDelta;

      if (newScrollPositoin == oldScrollPositoin && delta > 10) {
        showNext();
        e.preventDefault ? e.preventDefault() : (e.returnValue = false);
      }
      if (delta > 10) {
        oldScrollPositoin = newScrollPositoin
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

  $(".share-btn").click(function() {
    console.log(this.dataset.network);
    share(this.dataset.network);
  })


  let share = (network) => {

    let title = "Россия на пороге эпидемии ВИЧ";
    let description = "Тревожные факты о масштабах бедствия — в спецпроекте «Газеты.Ru»";
    let link = "http://dyn.ig.rambler.ru/HIV-spread/";
    let closeLink = "http://dyn.ig.rambler.ru/HIV-spread/close.html"
    let twitterText = title + "." + " " + description;
    let image = "http://dyn.ig.rambler.ru/HIV-spread/share-img.png"

    if (network == "vk") {
      let url = "http://vk.com/share.php?url=" + link + "&description=" +
        description + "&image=" + image + "&title=" + title;
      window.open(url, "_blank", "width=400,height=500");
    } else if (network == "fb") {
      let appId = 610415715785775;
      let url = "https://www.facebook.com/dialog/feed?app_id=" + appId +
        "&description=" + description + "&display=popup&link=" + link + "&name=" + title + "&next=" +
        closeLink + "&picture=" + image;
      window.open(url, "_blank", "width=400,height=500");
    } else if (network == "tw") {
      let url = "https://twitter.com/intent/tweet?original_referer=" + link +
        "&text=" + twitterText + "&tw_p=tweetbutton&url=" + link;
      window.open(url, "_blank", "width=400,height=500");
    }

  }

  // console.log($(".chart.top-spread .body"));

  // $(".top-spread-map").load("top-spread.svg", function() {
  //   // console.log("Done");
  //
  // });




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


  //all code is wrapped  in iiaf to prevent main scope pollution
});
