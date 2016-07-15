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

    let setButtons = function(display){
      btn.each(function(i,elem){
        if(elem.dataset.displaytype == display) elem.classList.add('active');
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
        scrollerHeight;

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
          let scrollEquivalent = mouseDifferential * (scrollContentWrapper.scrollHeight / scrollContainer.offsetHeight);
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
          path.setAttribute("fill", "url(#img1)" );
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
      if(top < mapRect.top) {
        top = mapRect.top + 20;
      }
      if(left + popUpRect.width > mapRect.left + mapRect.width) {
         left = regRect.left - popUpRect.width;
       }

       left = left + pageXOffset;
       top = top + pageYOffset;

      return {
        top: top ,
        left: left,
      };
    };

    let setPosition = function(obj) {
      if(!obj) return;
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

    let onresize = function(){
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

  window.onresize = function(){
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



let getColorMeta = function(startColor, endColor, percent) {
  var noName = function(start,end, percent ){
    return  Math.abs(
      Math.floor(start *(1-percent) + end*percent)
    );
  };


  return startColor.map(function(elem,i){
    return  noName(elem, endColor[i], percent);
  }).join(",");
};

console.log(
getColorMeta([26,14,14],[22,47,57], 0.5)
);

$( ".map_body" ).load( "map.svg", function() {
  mapMain();
  // window.scrollTo(0,document.body.scrollHeight);

  // window.onscroll = doThisStuffOnScroll;

  let H = document.body.offsetHeight

  window.document.body.style.background = 'linear-gradient(rgb(26,14,14), rgb(44,108,111))'

  function doThisStuffOnScroll() {
    let scrolled = window.pageYOffset || document.documentElement.scrollTop;
    let percent = (scrolled + window.innerHeight) / H;

    let color =  getColorMeta([26,14,14], [44,108,111], percent)
    console.log(`rgb(${color})`);

      window.document.body.style.backgroundColor =`rgb(${color})`;
  }
});


// Шапка  + волна #rgb(26,14,14)
// 1 вопрос + ответ #rgb(22,47,57)
// 2 вопрос + карта #rgb(26,14,14)
// 3 вопрос + график + волна #rgb(19,50,61)
// 4 вопрос + волна #rgb(19,50,61)
// 5 вопрос + график #rgb(12,35,42)
// 6 вопрос + график #rgb(12,35,42)
// 7 вопрос + волна + карта #rgb(22,47,57)
// подвал с результатами  #rgb(44,108,111)
