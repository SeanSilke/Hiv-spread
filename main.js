
doElsCollide = function(el1, el2) {

    var rect1 = el1.getBoundingClientRect();
    var rect2 = el2.getBoundingClientRect();

    return  (rect1.left < rect2.left + rect2.width &&
       rect1.left + rect1.width > rect2.left &&
       rect1.top < rect2.top + rect2.height &&
       rect1.height + rect1.top > rect2.top)
};

var getColor = function(percent){
  if (percent>1) return "rgb(180,32,37)"

  var r = Math.floor( 232 - (232 -180)*percent);
  var g = Math.floor(232 - (232 -32) * percent);
  var b = Math.floor(232 - (232 -37) * percent);

  return `rgb(${r},${g},${b})`

};

function insertAfter(elem, refElem) {
  return refElem.parentNode.insertBefore(elem, refElem.nextSibling);
}

// ------------Data process functions------


let newDataProseed = function(csvFile){
    var r  = {}
    var regionsArr =  csvFile.split("\n")
    regionsArr.pop() //remove end line

    regionsArr.forEach (function(e, i){
        e = e.split(";")
        key = e.shift();
        shortName = e.shift();
        name = e.shift();
        r[key] = {
          name: name,
          shortName: shortName,
          rowYearsData: e,
        }
    })

    var years = []
    for(var i = 0 ; i <= 20; i++){
      years.push(1994+i);
    }



   Object.keys(r).forEach(function(region) {

     r[region].absDied = {};
     r[region].absInfected = {};
     r[region].relInfected = {}
     years.forEach(function(year){
       r[region].absInfected[year] = infectedInYear(year,r[region].rowYearsData)
       r[region].absDied[year] = diedInYear(year,r[region].rowYearsData)
       r[region].relInfected[year] = relnIfectedInYear(year,r[region].rowYearsData)
     })


   })

  return r;

}

let infectedInYear = function(year, rowRregData) {
  let ofset = 0 + (2014 - year)*3;
  return rowRregData[ofset]
}


let diedInYear = function(year, rowRregData){
  let ofset = 1 + (2014 - year)*3;
  return rowRregData[ofset];
}

let relnIfectedInYear = function(year, rowRregData){
  let ofset = 2 + (2014 - year)*3;
  return rowRregData[ofset];
}





$(function(){

  //----Data----
  let data  = {

  }

  // -------------Global State------------
  let state = {
    year: 1999,
    regionId: "",
    display: "abs"
  }

  // ------------------Map---------------

  var map = (function(){


    var regions = $("#svg-map path, #svg-map polygon");
    var btn = $(".map .map_header .btn")
    var selectReg = null;

    btn.click(function(){
      btn.toggleClass("active")
      state.display = this.dataset.displaytype
      renderAll();
    })

    var setRegsColor = function(year) {

      Object.keys(data).forEach(function(reginoId){

        var value, percent;

        if (state.display == "abs"){

          value = data[reginoId].absInfected[year];

          if (value < 100) {
            percent = 0;
          } else {
            percent = (Math.log2(value / 100)) / 9;
          }
        }else {
          value = data[reginoId].relInfected[year];

          if (value < 10) {
            percent = 0;
          } else {
            percent = (Math.log2(value / 10)) / 9;
          }

        }

        $('#'+ reginoId).css({
          'fill': getColor(percent) ,
        });
      })
    }

    var setSelectRegion = function(regionId) {
        selectReg && selectReg.classList.remove('selected');
        if (regionId){
          var elem =  document.getElementById(regionId)
          elem.classList.add('selected')
          selectReg = elem;
      }
    }

    //          ---Render Map----
    var render =  function() {
      setRegsColor(state.year);
      setSelectRegion(state.regionId)
    }

    regions.mouseover(
      function(e){
        if (selectReg) {
          e.target.parentElement.insertBefore(e.target, selectReg);
        } else {
          e.target.parentElement.insertBefore(e.target, null)
        }
      }
    )

    regions.click(
      function(e){
        state.regionId = e.target.id;
        e.target.parentElement.insertBefore(e.target, null)
        renderAll();
      }
    )


    return {
            render: render,
          }

  })();

  // ---------------Legend----------------
  var legend = (function() {

    //----Init legned ------

    var initColors = function () {
      $(".legend .bloc .color").each(function(id,e){
        var color = getColor((id+1)/10)
        $(e).css({"background-color": color})
      })
    }

    var renderValues = function () {
      var multiplier = state.display == "abs" ? 100 : 10;

      $(".legend .bloc .year").each(function(id,e){
        $(e).text(multiplier*Math.pow(2, id))
      })
    }

    var init = function(){
      initColors();
      renderValues();
    }

    var render =  function() {
      renderValues();
    }

    return {
              "init": init,
              render: render,
            };
    })();

  //-------Years----------------

  var years = (function(){

    var render = function() {

      $(".years .col").each( function(id,e){
        var year = parseInt($(e).attr("id"))
        if (year === state.year){
          $(e).addClass( "active" )
        }else {
          $(e).removeClass( "active" )
        }
      })

    }

    // _____________click__________

    $(".years .col").on("click", function(){
      var year = parseInt ($(this).attr("id"))
      state.year = year;
      renderAll();
    })

    return {render: render}


  })();


  //------------   Drop down  -------------------

  var dropDowdn = (function(){

    var isOpen = false;
    var scrollable = $(".scrollable");
    var closeButton = $(".map_header .item.drop_down .close_button");
    var closeImg = $(".map_header .item.drop_down .close_button img");
    var container =  $(".scrollable .content");
    var head = $(".drop_down .head");

    $(".map_header .item.drop_down").click(
      function(e){
        e.stopPropagation();
      }
    )


    var close = function() {
      scrollable.css('visibility', 'hidden');
       isOpen = false;
       closeImg[0].style.transform = "rotate(0deg)";
    }

    var open = function() {
      scrollable.css('visibility', 'visible')
       isOpen = true;
       closeImg[0].style.transform = "rotate(180deg)";
    }

    closeButton.click(
      function(e){
        e.stopPropagation();
        if(isOpen){
          close();
         } else {
          open();
        }
      }
    )


    var render = function() {

      state.regionId && head.text(data[state.regionId].shortName || "Регион")
      // Dirty Hack
      container.empty();
      Object.keys(data).forEach(
        function(region){

          shortName = data[region].shortName;

          var elem = $(`<div class="item" data-regionId="${region}"> ${shortName} </div>`);

          if (region === state.regionId){
            elem = $(`<div class="active" data-regionId="${region}"> ${shortName} </div>`);
          }

          container.append(elem)

          elem.click(function(){
            state.regionId = this.dataset.regionid;
            renderAll();
            close();
          })
        }
      )
    };


    var createScroller =  (function () {

      var scrollContainer = document.querySelector('.scrollable'),
          scrollContentWrapper = document.querySelector('.scrollable .content-wrapper'),
          scrollContent = document.querySelector('.scrollable .content'),
          contentPosition = 0,
          scrollerBeingDragged = false,
          scroller,
          topPosition,
          scrollerHeight;

      function calculateScrollerHeight() {
          // *Calculation of how tall scroller should be
          var visibleRatio = scrollContainer.offsetHeight / scrollContentWrapper.scrollHeight;
          visibleRatio = 0.05;
          return visibleRatio * scrollContainer.offsetHeight;
      }

      function moveScroller(evt) {
          // Move Scroll bar to top offset
          var scrollPercentage = evt.target.scrollTop / scrollContentWrapper.scrollHeight;
          topPosition = scrollPercentage * (scrollContainer.offsetHeight *0.92 ) + scrollContainer.offsetHeight *0.05 ; // 5px arbitrary offset so scroll bar doesn't move too far beyond content wrapper bounding box
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

          if (scrollerHeight / scrollContainer.offsetHeight < 1){
              // *If there is a need to have scroll bar based on content size
              scroller.style.height = scrollerHeight + 'px';

              // append scroller to scrollContainer div
              scrollContainer.appendChild(scroller);

              // show scroll path divot
              scrollContainer.className += ' showScroll';

              // attach related draggable listeners
              scroller.addEventListener('mousedown', startDrag);
              window.addEventListener('mouseup', stopDrag);
              window.addEventListener('mousemove', scrollBarScroll)
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

  // -----------  Close Drop down on document click ----------
  document.body.addEventListener("click",
    function(e){
      dropDowdn.close();
    }
  )

  //------------ popUp ----------------

  var  popUp =  (function () {

    var popUp = $(".banner")
    var closeButton = $(".banner .head .btn.close")
    var pieContainer = $(".banner .body .pie");

    var dataFields = $(".banner .body .data .item");
    var stateNameFeald = popUp.find(".head .region span");
    var infectedFeald = dataFields.find(".infected");
    var diedFeald = dataFields.find(".dead");
    var infectedTextFeald = $(dataFields.find(".leble")[0]);


    var renderPie = ( function(){
      var path = null;
      var svgElem=document.getElementById("svg-pie");

      var renderPie = function(deg){
        if(!svgElem) return;
        if(path) svgElem.removeChild(path);

        var cx=50,
            cy=50,
            rx=40,
            ry=40;

        var p = svgElem.createSVGPoint();
            p.x = 0;
            p.y = 1;


        var m = svgElem.createSVGMatrix();


        var p2 = p.matrixTransform(m.rotate(deg));

        p2.x = cx + p2.x*rx;
        p2.y = cy + p2.y*ry;


        path = document.createElementNS("http://www.w3.org/2000/svg","path");

        svgElem.appendChild(path);

        var d="M"+cx+" "+(cy+ry)+"A"+rx+" "+ry+" 0 0 1"+p2.x+" "+p2.y+"L"+cx+" "+cy+"z";

        path.setAttribute("d",d);
        path.setAttribute("fill","url(#img1)");

    }
      return renderPie
    })();


    var close = function() {
      popUp.css('visibility', 'hidden')
      state.regionId = "";
      renderAll();
    }

    var open = function() {
      popUp.css('visibility', 'visible')
    }

    closeButton.click(close)



    var isCollide = function(){
      var r = document.getElementById(state.regionId);

      if (r && popUp[0]){
        var collide =  doElsCollide(popUp[0], r);
      }

      return collide;
    };



    var positions = [
      {top: 19, right: 1},
      {top: 19, left: 1},
      {bottom: 19, left:1},
      {bottom: 19, right: 1},
    ]

    var findPosition = function() {
      // popUp.css('visibility', 'hidden');
      var i = 0;
      while (isCollide() && i < positions.length){
        console.log(i, isCollide());
        setPosition(positions[i])
        i++;
      }
      // popUp.css('visibility', 'visible')
    }

    var setPosition = function(obj){

      var format = ["right", "top", "left", "bottom"];
      format.forEach(function(prop) {
        popUp[0].style[prop] = obj[prop] ? obj[prop] + "%" : ""
      })
    }

    //init position
    setPosition({top: 19, right: 1});


    var render = function( ) {

      if(!state.regionId) return;

      var name, infected, died,infectedText;

      name =  data[state.regionId].name;

      if(state.display == "rel")
        {
          pieContainer.hide();
          $(dataFields[1]).hide();
          $(dataFields[0]).find(".infected").css({width:"auto"});
          died = null;
          infected = data[state.regionId].relInfected[state.year] || "н/д";
          infectedText = "Число инфицированных на 100 тысяч населения"
        }
      else
        {
          infected = data[state.regionId].absInfected[state.year] || "н/д";
          died = data[state.regionId].absDied[state.year] || "н/д";
          pieContainer.show()
          $(dataFields[1]).show();
          $(dataFields[0]).find(".infected").css({width:"23%"});
          renderPie(360*(died/infected))
          infectedText = "Общее число инфицированных";
        }

      stateNameFeald.text(name);
      infectedFeald.text(infected);
      infectedTextFeald.text(infectedText)
      diedFeald.text(died);

      if(state.regionId){
        findPosition();
        open();
      }
    }

    return {
        render:render,
      }

  })()

  var renderAll = function() {
    map.render();
    years.render();
    popUp.render()
    dropDowdn.render();
    legend.render();
  };

  var initAll = function() {
    legend.init();
    dropDowdn.createScroller()
  };


  // ----------------Read Data---------------

(function() {
  var blob = null;
  var xhr = new XMLHttpRequest();
  // xhr.open("GET", "attempt3.csv");
  xhr.open("GET", "HIV_Data_by_reg.csv");
  xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
  xhr.onload = function()
  {
      blob = xhr.response;//xhr.response is now a blob object
      myReader.readAsText(blob);
  }
  xhr.send();


  var myReader = new FileReader();
  myReader.addEventListener("loadend", function(e){


      data =  newDataProseed(e.srcElement.result);
      initAll();
      renderAll();

  });
})();

})
