"use strict";

(function(){

  let h = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

let showElem = ($elem, isLast) => {
  $elem.css({
    display: "block",
  }).animate({
    opacity: 1
  }, 1000);

  let center = $elem.height() > h ? h/2 : $elem.height()/2;

  if (!isLast){
  $('.prop').css({
    top:($elem.offset().top + $elem.height()/2 + h/2  )
  });
}

  let scrollTo = $elem.height() < h ? $elem.offset().top - h/2 + $elem.height()/2 : $elem.offset().top;


  $('html, body').animate({
    scrollTop: scrollTo
  }, 1000);


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
  var noName = function(start, end, percent) {
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

  let onscroll = function() {
    let scrolled = window.pageYOffset || document.documentElement.scrollTop;
    let percent = (scrolled + window.innerHeight) / H;
    let color = getColorMeta([26, 14, 14], [44, 108, 111], percent);
    if (color !== bgColor) {
      window.requestAnimationFrame(function() {
        window.document.body.style.backgroundColor = `rgb(${color})`;
      });
      bgColor = color;
    }
  };

  onscroll();

  return onscroll;

})();

window.onscroll = onscroll;



/*
███    ███  █████  ██████      ███    ███  █████  ██ ███    ██
████  ████ ██   ██ ██   ██     ████  ████ ██   ██ ██ ████   ██
██ ████ ██ ███████ ██████      ██ ████ ██ ███████ ██ ██ ██  ██
██  ██  ██ ██   ██ ██          ██  ██  ██ ██   ██ ██ ██  ██ ██
██      ██ ██   ██ ██          ██      ██ ██   ██ ██ ██   ████
*/





let mapMain = function() {

  //----Data----
  let data = {

  };

  // -------------Global State------------
  let state = {
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

  let map = (function() {


    let map = {
      render: null,
      selectedReg: null,
      mapElem: null,
    };
    map.mapElem = document.getElementById("svg-map");
    let regions = $("#svg-map path, #svg-map polygon");
    let btn = $(".map .map_header .btn");
    let selectedReg = null;

    btn.click(function(e) {
      e.stopPropagation();
      // btn.toggleClass("active");
      state.display = this.dataset.displaytype;
      renderAll();
    });

    let setRegsColor = function(year) {

      Object.keys(data).forEach(function(reginoId) {

        let value, percent;

        if (state.display == "abs") {

          value = data[reginoId].absInfected[year];

          if (value < 100) {
            percent = 0;
          } else {
            percent = (Math.log2(value / 100)) / 9;
          }
        } else {
          value = data[reginoId].relInfected[year];

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
      map.selectedReg && map.selectedReg.classList.remove('selected');
      if (regionId) {
        map.selectedReg = document.getElementById(regionId);
        map.selectedReg.classList.add('selected');
      }
    };

    let setButtons = function(display) {
      btn.each(function(i, elem) {
        if (elem.dataset.displaytype == display) elem.classList.add('active');
        else elem.classList.remove('active');
      });
    };

    let render = function() {
      setRegsColor(state.year);
      setSelectedRegion(state.regionId);
      setButtons(state.display);
      if (state.regionId) {
        map.mapElem.classList.add('regSelected');
      } else {
        map.mapElem.classList.remove('regSelected');
      }
    };

    regions.click(
      function(e) {
        e.stopPropagation();
        if (e.target.id === state.regionId) {
          map.mapElem.classList.remove('regSelected');
          state.regionId = "";
        } else {
          state.regionId = e.target.id;
          e.target.parentElement.insertBefore(e.target, null);
        }
        renderAll();
      }
    );

    map.render = render;
    map.selectedReg = selectedReg;

    return map;

  })();

  /*
  ██      ███████  ██████  ███████ ███    ██ ██████
  ██      ██      ██       ██      ████   ██ ██   ██
  ██      █████   ██   ███ █████   ██ ██  ██ ██   ██
  ██      ██      ██    ██ ██      ██  ██ ██ ██   ██
  ███████ ███████  ██████  ███████ ██   ████ ██████
  */


  let legend = (function() {

    //----Init legned ------

    let initColors = function() {
      $(".legend .bloc .color").each(function(id, e) {
        let color = getColor((id + 1) / 10);
        $(e).css({
          "background-color": color
        });
      });
    };

    let renderValues = function() {
      let multiplier = state.display == "abs" ? 100 : 10;

      $(".legend .bloc .val").each(function(id, e) {
        $(e).text(multiplier * Math.pow(2, id));
      });
    };

    let init = function() {
      initColors();
      renderValues();
    };

    let render = function() {
      renderValues();
    };

    return {
      "init": init,
      render: render,
    };
  })();

  /*
  ██    ██ ███████  █████  ██████  ███████
   ██  ██  ██      ██   ██ ██   ██ ██
    ████   █████   ███████ ██████  ███████
     ██    ██      ██   ██ ██   ██      ██
     ██    ███████ ██   ██ ██   ██ ███████
  */

  let years = (function() {

    let render = function() {

      $(".years .col").each(function(id, e) {
        let year = parseInt($(e).attr("id"));
        if (year === state.year) {
          $(e).addClass("active");
        } else {
          $(e).removeClass("active");
        }
      });

    };

    // _____________click__________

    $(".years .col").on("click", function(e) {
      e.stopPropagation();
      let year = parseInt($(this).attr("id"));
      state.year = year;
      renderAll();
    });

    return {
      render: render
    };


  })();

  /*
  ██████  ██████   ██████  ██████      ██████   ██████  ██     ██ ███    ██
  ██   ██ ██   ██ ██    ██ ██   ██     ██   ██ ██    ██ ██     ██ ████   ██
  ██   ██ ██████  ██    ██ ██████      ██   ██ ██    ██ ██  █  ██ ██ ██  ██
  ██   ██ ██   ██ ██    ██ ██          ██   ██ ██    ██ ██ ███ ██ ██  ██ ██
  ██████  ██   ██  ██████  ██          ██████   ██████   ███ ███  ██   ████
  */

  let dropDowdn = (function() {

    let isOpen = false;
    let $select = $(".map_header .drop_down .head");
    let scrollable = $(".scrollable");
    let closeImg = $(".map_header .item.drop_down .close_button img");
    let container = $(".scrollable .content");
    let head = $(".drop_down .text");

    $select.click(
      function(e) {
        e.stopPropagation();
        if (isOpen) {
          close();
        } else {
          open();
        }
      }
    );

    $(".scrollable").click(
      function(e) {
        e.stopPropagation();
      }
    );


    let close = function() {
      scrollable.css('visibility', 'hidden');
      isOpen = false;
      closeImg[0].style.transform = "rotate(0deg)";
    };

    let open = function() {
      scrollable.css('visibility', 'visible');
      isOpen = true;
      closeImg[0].style.transform = "rotate(180deg)";
    };

    let render = function() {
      if (state.regionId) {
        head.text(data[state.regionId].shortName);
      } else {
        head.text("Регион");
      }

      // state.regionId && head.text(data[state.regionId].shortName || "Регион")
      // Dirty Hack
      container.empty();
      Object.keys(data).forEach(
        function(region) {

          let shortName = data[region].shortName;

          let elem = $(`<div class="item" data-regionId="${region}"> ${shortName} </div>`);

          if (region === state.regionId) {
            elem = $(`<div class="active" data-regionId="${region}"> ${shortName} </div>`);
          }

          container.append(elem);

          elem.click(function(e) {
            e.stopPropagation();
            state.regionId = this.dataset.regionid;
            renderAll();
            close();
          });
        }
      );
      close();
    };


    let createScroller = (function() {

      let scrollContainer = document.querySelector('.scrollable'),
        scrollContentWrapper = document.querySelector('.scrollable .content-wrapper'),
        scrollContent = document.querySelector('.scrollable .content'),
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

    }());


    return {
      open: open,
      close: close,
      render: render,
      createScroller: createScroller,
    };

  })();

  /*
  ██████   ██████   ██████ ██    ██ ███    ███ ███████ ███    ██ ████████      ██████ ██      ██  ██████ ██   ██ ███████
  ██   ██ ██    ██ ██      ██    ██ ████  ████ ██      ████   ██    ██        ██      ██      ██ ██      ██  ██  ██
  ██   ██ ██    ██ ██      ██    ██ ██ ████ ██ █████   ██ ██  ██    ██        ██      ██      ██ ██      █████   ███████
  ██   ██ ██    ██ ██      ██    ██ ██  ██  ██ ██      ██  ██ ██    ██        ██      ██      ██ ██      ██  ██       ██
  ██████   ██████   ██████  ██████  ██      ██ ███████ ██   ████    ██         ██████ ███████ ██  ██████ ██   ██ ███████
  */

  document.body.addEventListener("click",
    function(e) {
      state.regionId = "";
      renderAll();
    }
  );

  /*
  ██████   ██████  ██████  ██    ██ ██████
  ██   ██ ██    ██ ██   ██ ██    ██ ██   ██
  ██████  ██    ██ ██████  ██    ██ ██████
  ██      ██    ██ ██      ██    ██ ██
  ██       ██████  ██       ██████  ██
  */


  let popUp = (function() {

    let popUp = $(".banner");
    let closeButton = $(".banner .head .btn.close");
    let pieContainer = $(".banner .body .pie");

    let dataFields = $(".banner .body .data .item");
    let stateNameFeald = popUp.find(".head .region span");
    let infectedFeald = dataFields.find(".infected");
    let diedFeald = dataFields.find(".dead");
    let infectedTextFeald = $(dataFields.find(".leble")[0]);

    let close = function() {
      hide();
      state.regionId = "";
      renderAll();
    };

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

    closeButton.click(function(e) {
      close();
    });

    let renderPie = (function() {
      let path = null;
      let svgElem = document.getElementById("svg-pie");

      let renderPie = function(deg) {
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



        let cx = 40,
          cy = 40,
          rx = 40,
          ry = 40;

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
      return renderPie;
    })();


    let findPosition = function() {

      if (!map.selectedReg) return;

      let mapRect = map.mapElem.getBoundingClientRect();
      let regRect = map.selectedReg.getBoundingClientRect();
      let popUpRect = popUp[0].getBoundingClientRect();

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
        popUp[0].style[prop] = obj[prop] ? obj[prop] + "px" : "";
      });
    };



    let render = function() {

      if (!state.regionId) {
        hide();
        return;
      }

      let name, infected, died, infectedText;

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

    let onresize = function() {
      setPosition(findPosition());
    };

    return {
      render: render,
      onresize: onresize,
    };

  })();

  /*
  ██████  ███████ ███    ██ ██████  ███████ ██████
  ██   ██ ██      ████   ██ ██   ██ ██      ██   ██
  ██████  █████   ██ ██  ██ ██   ██ █████   ██████
  ██   ██ ██      ██  ██ ██ ██   ██ ██      ██   ██
  ██   ██ ███████ ██   ████ ██████  ███████ ██   ██
  */

  let renderAll = function() {
    map.render();
    years.render();
    dropDowdn.render();
    legend.render();
    popUp.render();
  };

  let initAll = function() {
    legend.init();
    dropDowdn.createScroller();
  };

  window.onresize = function() {
    popUp.onresize();
  };


  /*
  ██████  ███████  █████  ██████      ██████   █████  ████████  █████
  ██   ██ ██      ██   ██ ██   ██     ██   ██ ██   ██    ██    ██   ██
  ██████  █████   ███████ ██   ██     ██   ██ ███████    ██    ███████
  ██   ██ ██      ██   ██ ██   ██     ██   ██ ██   ██    ██    ██   ██
  ██   ██ ███████ ██   ██ ██████      ██████  ██   ██    ██    ██   ██
  */

  (function() {
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

      data = newDataProseed(e.srcElement.result);
      initAll();
      renderAll();

    });
  })();

};



/*
██████  ███████  ██████  ██ ███    ██ ███████
██   ██ ██      ██       ██ ████   ██ ██
██████  █████   ██   ███ ██ ██ ██  ██ █████
██   ██ ██      ██    ██ ██ ██  ██ ██ ██
██████  ███████  ██████  ██ ██   ████ ███████
*/



$(function() {

  $(".map_body").load("map.svg", function() {
    // mapMain();
  });

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

    //rgb(24,179,172)
    //rgb(203,132,125)
    let startColor = [228, 152, 152];
    //rgb(190,32,37)
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
        console.log("show newInfectedChart");
        rendernewInfected();
      }, 1000);

    }

    return {
      show
    }

  })();


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
      [93.3, 6.4, 0.2, 0.2],
      [81.2, 17.7, 0.4, 0.7],
      [72.3, 25.4, 0.5, 1.7],
      [66.7, 29.9, 0.8, 2.5],
      [64.2, 31.8, 1.1, 3.0],
      [63.3, 33.0, 0.7, 2.9],
      [61.5, 35.2, 1.0, 2.3],
      [61.3, 35.6, 1.1, 2.0],
      [59.8, 37.1, 1.4, 1.8],
      [57.9, 39.7, 1.3, 1.1],
      [56.2, 41.4, 1.3, 1.1],
      [56.4, 41.7, 1.1, 0.8],
      [54.9, 43.1, 1, 1.0],
      [58.4, 39.7, 1.1, 0.8]
    ];

    let defYearVal = [25, 25, 25, 25];

    let years = document.querySelectorAll('.key-reason-canvas .year');

    let setValue = function(year, valArr) {
      let bars = year.querySelectorAll(".bar");
      [].forEach.call(bars, function(elem, i) {
        let name = barsPosition[i];
        let percent = valArr[legend[name]];
        elem.classList.add(name);
        elem.style.height = percent + "%";
      });
    };

    let setYears = (i, fn, years) => {
      if (i > years.length - 1) return;
      fn(years[i], valMatrix[i]);
      setTimeout(setYears, 80, ++i, fn, years);
    };


    let initYears = (i, fn) => {
      if (i > 20) return;
      fn(years[i], defYearVal);
      initYears(++i, fn);
    };

    let startIndex = 0;

    let show = () => {
      console.log("show");
      // setYears(startIndex, setValue, years)
      setTimeout(setYears, 1000, 0, setValue, years);
    }

    //move init to some global init
    initYears(startIndex, setValue);

    return {
      show: show,
    }

    // let canvas = $('.key-reason-canvas');
    //
    //
    // document.addEventListener('scroll', function(e) {
    //   console.log(canvas.is(":visible"),canvas.offset());
    // });

  })();

  let valPicker = function(fn, state) {

    let meter = document.querySelector('.red-meter-9');
    let greenMeter = document.querySelector('.thermometer-9 .green-meter-9');
    let ribbonSlider = document.querySelector('#ribbon-slider-9');
    let percent;
    let max = 848;
    let text = document.querySelector('.red-meter-9>div');


    let render = (percent) => {
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
      let percent = ui.position.left / 848;
      render(percent);
      state.selected = Math.round(percent * 14) + 1;
      fn();
    };

    $(ribbonSlider).draggable({
      containment: "parent",
      axis: "x",
      drag: onDrag,
    });
  };

  let valPicker2 = function(fn, state) {
    let meter = document.querySelector('.red-meter-8');
    let greenMeter = document.querySelector('.thermometer .green-meter');
    let ribbonSlider = document.querySelector('#ribbon-slider-8');
    let percent;
    let max = 848;
    let text = document.querySelector('.red-meter-8>div');


    let render = (percent) => {
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
      let percent = ui.position.left / 848;
      render(percent);
      state.selected = Math.round(percent * 14) + 1;
      fn();
    };

    $(ribbonSlider).draggable({
      containment: "parent",
      axis: "x",
      drag: onDrag,
    });

  };

  let valPicker3 = function(fn, state) {
    let circle = document.querySelector('.guess-growth-main-small');
    let textFeald = document.querySelector('.guess-growth-main-text');
    let r = 46;
    let text = "1 000 000";

    let valToText = val => {
      val = Math.round(val / 100) * 100;

      var arr = (val + "").split("");
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
      drag: onDrag,
    });
  };



  let hookUpValQueston = (question, valPicker, AnswerSelectors, onAnswer) => {

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
        showAnswers();
        question.css({
          "pointer-events": "none"
        });
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

    answerButton.click(function() {
      state.isAnswered = true;
      render();
    });

    valPicker(render, state);

    let init = () => {
      initQuestion();
      initAnswers();
    }

    return {
      show: showQuestin,
      init: init,
    };

  };

  let hookUpQueston = function(question, right, AnswerSelectors, onAnswer) {


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

    let options = question.find(".answers .item .elem");

    let state = {
      selected: null,
      isAnswered: false,
      right: right,
    };

    let render = function() {
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

    answerButton.click(function() {
      state.isAnswered = true;
      render();
    });

    let init = () => {
      initOptions();
      initQuestion();
      initAnswers();
    }

    return {
      show: showQuestin,
      init: init,
    };
  };

  let footer = (() => {

    let footer = $(".plate11, .line.bottom");

    let init = () => {
      hideElem(footer)
    };

    let show = () => {
      showElem(footer, true)
    };

    return {
      show: show,
      init: init,
    }
  })();


  let elems = [
    hookUpQueston($(".question-one"), 2, ".plate3"),
    hookUpQueston($(".question-two"), 3, ".plate4 .comment, .plate5", mapMain),
    hookUpQueston($(".question-three"), 3, ".answer-three", newInfectedChart.show),
    hookUpValQueston($(".question-four"), valPicker3, ".answer-four, .plate7-after"),
    hookUpValQueston($(".question-five"), valPicker2, ".answer-five", keyReasonChart.show),
    hookUpValQueston($(".question-six"), valPicker, ".answer-six"),
    hookUpQueston($(".question-seven"), 1, ".answer-seven, .plate10-after"),
    footer
  ];

  elems.forEach(elem => elem.init());


  $.each($('.footer img'),
    (i, elem) => {
      elem.onclick = elems[i].show;
    });
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

})();
