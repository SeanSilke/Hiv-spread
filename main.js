$(function(){

//----Data----
let data  = {
  byRegionArr: [],
}

// -------------Global State----------
let state = {
  year: 1999,
  regionId: "",
}


let regionsArr =

[ "Алтайский_край",
  "Амурская_область",
  "Архангельская_область",
  "Астраханская_область",
  "Белгородская_область",
  "Брянская_область",
  "Владимирская_область",
  "Волгоградская_область",
  "Вологодская_область",
  "Воронежская_область",
  "Еврейская_автономная_область",
  "Забайкальский_край",
  "Ивановская_область",
  "Иркутская_область",
  "Кабардино-Балкарская_Республика",
  "Калининградская_область",
  "Калужская_область",
  "Камчатский_край",
  "Карачаево-Черкесская_Республика",
  "Кемеровская_область",
  "Кировская_область",
  "Костромская_область",
  "Краснодарский_край",
  "Красноярский_край",
  "Курганская_область",
  "Курская_область",
  "Ленинградская_область",
  "Липецкая_область",
  "Магаданская_область",
  "Москва",
  "Московская_область",
  "Мурманская_область",
  "Ненецкий_АО",
  "Нижегородская_область",
  "Новгородская_область",
  "Новосибирская_область",
  "Омская_область",
  "Оренбургская_область",
  "Орловская_область",
  "Пензенская_область",
  "Пермский_край",
  "Приморский_край",
  "Псковская_область",
  "Республика_Адыгея",
  "Республика_Алтай",
  "Республика_Башкортостан",
  "Республика_Бурятия",
  "Республика_Дагестан",
  "Республика_Ингушетия",
  "Республика_Калмыкия",
  "Республика_Карелия",
  "Республика_Коми",
  "Республика_Марий_Эл",
  "Республика_Мордовия",
  "Республика_Саха", // Не валидный id
  "Республика_Северная_Осетия_—_Алания",
  "Республика_Татарстан",
  "Республика_Тыва",
  "Республика_Хакасия",
  "Ростовская_область",
  "Рязанская_область",
  "Самарская_область",
  "Санкт-Петербург",
  "Саратовская_область",
  "Сахалинская_область",
  "Свердловская_область",
  "Смоленская_область",
  "Ставропольский_край",
  "Тамбовская_область",
  "Тверская_область",
  "Томская_область",
  "Тульская_область",
  "Тюменская_область",// данный сейчас вместе с автономными областями . На карте  отмеченна облать отдельно
  "Удмуртская_Республика",
  "Ульяновская_область",
  "Хабаровский_край",
  "Ханты-Мансийский_АО",
  "Челябинская_область",
  "Чеченская_Республика",
  "Чувашская_Республика",
  "Чукотский_АО",
  "Ямало-Ненецкий_АО",
  "Ярославская_область",
  "Крым",
  "Севастополь"
]




// ------------Data process functions------

let proseedData = function(csvFile) {
  return csvFile.split("\n").map(e => e.split(";"));
}


//Не верное название функциии - по сымыслу это
// прочто колличество зараженных на данный год, а не прирост
// зараженных
let getInfectedInYear = function(year) {
  let ofset = 0 + (2014 - year)*3;
  return data.byRegionArr.map(e =>e[ofset]);
}

let diedInYear = function(year){
  let ofset = 1 + (2014 - year)*3;
  return data.byRegionArr.map(e =>e[ofset]);
}

let diedInRegion = function(redId){
  return diedInYear(state.year)[regionsArr.indexOf(redId)]
}

let infectedInRegion = function(redId){
  return getInfectedInYear(state.year)[regionsArr.indexOf(redId)]
}


let tesFunction =() =>{

}



// ------------------Map---------------

var getColor = function(percent){
  if (percent>1) return "rgb(180,32,37)"

  var r = Math.floor( 232 - (232 -180)*percent);
  var g = Math.floor(232 - (232 -32) * percent);
  var b = Math.floor(232 - (232 -37) * percent);

  return `rgb(${r},${g},${b})`



};

var setColor = function(dataArr) {

    for(i=0; i < regionsArr.length; i++) {
      $('#'+ regionsArr[i]).css({
        'fill': getColor(dataArr[i]/1000) ,
        // "stroke" : getColor(dataArr[i]/1000)

      });
      }
}


var setRegion = (function(){

  var oldElem = null

  var fn = function ( ) {
      oldElem && oldElem.classList.remove('selected');
      if (state.regionId){
      var elem =  document.getElementById(state.regionId)
      elem.classList.add('selected')
      oldElem = elem;
    }
  }

  return fn;

})()


//          ---Render Map----
var renderMap =  function() {
  setColor(getInfectedInYear(state.year));
  setRegion()
}



// ------------ Region hover------------

$("#svg-map path, #svg-map polygon").mouseover(
  function(e){
    e.target.parentElement.insertBefore(e.target, e.target.firstChild);
  }
)

$("#svg-map path, #svg-map polygon").click(
  function(e){
    state.regionId = e.target.id;
    renderAll();
  }
)

//

var renderAll = function() {
  renderMap();
  renderBanner()
  renderYear();
  setRegion();
  dropDowdn.render();
}


// ----------------Read Data---------------

var blob = null;
var xhr = new XMLHttpRequest();
xhr.open("GET", "attempt3.csv");
xhr.responseType = "blob";//force the HTTP response, response-type header to be blob
xhr.onload = function()
{
    blob = xhr.response;//xhr.response is now a blob object
    myReader.readAsText(blob);
}
xhr.send();


var myReader = new FileReader();
myReader.addEventListener("loadend", function(e){
    data.byRegionArr = proseedData(e.srcElement.result)
    renderAll();

    ///////
    tesFunction();
});

//----Init legned ------

var iniLegend = function(){
  $(".legend .bloc").each(function(id,e){
    var color = getColor((id+1)/10)
    $(e).css({"background-color": color})
  })
}

iniLegend();

//-------renderYear----------------

var renderYear = function() {

$(".years .col").each( function(id,e){
  var year = parseInt($(e).attr("id"))
  if (year === state.year){
    $(e).css({"background-color": "#B42025"})
  }else {
    $(e).css({"background-color": ""})
  }
  // var year = parseInt ($(this).attr("id"))
  // setColor(getInfectedInYear(year))
})

}


//--------Init Years---------------



// _____________Year click__________


$(".years .col").on("click", function(){
  var year = parseInt ($(this).attr("id"))
  state.year = year;
  renderAll();
})


document.body.addEventListener("click",
  function(e){
    dropDowdn.close();
  }
)

//------------   Drop down close_button    -------------------


var dropDowdn = (function(){

var isOpen = false;
var scrollable = $(".scrollable");
var closeButton = $(".map_header .item.drop_down .close_button");
var container =  $(".scrollable .content");
var head = $(".drop_down .head");

$(".map_header .item.drop_down").click(
  function(e){
    e.stopPropagation();
  }
)

var close = function() {
  scrollable.css('visibility', 'hidden')
   isOpen = false
}

var open = function() {
  scrollable.css('visibility', 'visible')
   isOpen = true;
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

  head.text(state.regionId || "Регион")
  //Dirty Hack
  container.empty();

  regionsArr.forEach(

    function(region){

      var elem = $(`<div class="item" data-regionId="${region}"> ${region} </div>`);


      if (region === state.regionId){
        elem = $(`<div class="active" data-regionId="${region}"> ${region} </div>`);
      }

      container.append(elem)

      elem.click(function(){
        state.regionId = this.dataset.regionid;
        renderAll();
        close();
      })
    }
  )
}

return {
  open: open,
  close: close,
  render: render,
}

})()


//Не вызывать в рендер аллл, а испольняется одни раз
dropDowdn.render();

$("select").change(function(){
  state.regionId =  this.value;
  renderAll();
})



//------------Render Banner----------------


var  renderBanner =  (function () {

      //------------renderPie----------------
  var renderPie = ( function(){

  var path = null;


  var renderPie = function(deg){

  var svgElem=document.getElementById("svg-pie");

  if(path) svgElem.removeChild(path);


  var cx=50;
  var cy=50;
  var rx=40;
  var ry=40;

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


var banner = $(".banner")
var closeButton = $(".banner .head .btn.close")



var close = function() {
  banner.css('visibility', 'hidden')
  state.regionId = "";
  renderAll();
}

var open = function() {
  banner.css('visibility', 'visible')
}

closeButton.click(close)

var renderBanner = function( ) {

  var infected = infectedInRegion(state.regionId);
  var died = diedInRegion(state.regionId);

  $(".banner .head .region span").text(state.regionId);
  $(".banner .body .data .item .infected").text(infected);
  $(".banner .body .data .item .dead").text(died)

  renderPie(360*(died/infected))
  if(state.regionId){
    open();
  }
}

return renderBanner

})()


})
