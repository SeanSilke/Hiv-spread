"use strict";

  let a = 10;
  import {addMouseewheelEvent} from "./utils";
  import {getColor,showElem,hideElem} from "./utils";


  import RegInfo from "./RegInfo"
  import RegInfoMobile from "./RegInfoMobile";

  import newInfectedChartMobile from "./newInfectedChartMobile";
  import newInfectedChart from "./newInfectedChart";
  import keyReasonChart from "./keyReasonChart";

  import share from "./share.js";
  import SideBars from "./SideBars"

  import Footer from "./Footer"

  // import eventEmitter from "wolfy87-eventemitter"

  // console.log(eventEmitter);



(function() {

  /*
   ██████  ██       ██████  ██████   █████  ██      ███████
  ██       ██      ██    ██ ██   ██ ██   ██ ██      ██
  ██   ███ ██      ██    ██ ██████  ███████ ██      ███████
  ██    ██ ██      ██    ██ ██   ██ ██   ██ ██           ██
   ██████  ███████  ██████  ██████  ██   ██ ███████ ███████
  */

  let  disableScroll = false;


  /*
  ██      ██ ██████  ██████   █████  ██████  ██    ██     ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
  ██      ██ ██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
  ██      ██ ██████  ██████  ███████ ██████    ████       █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
  ██      ██ ██   ██ ██   ██ ██   ██ ██   ██    ██        ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
  ███████ ██ ██████  ██   ██ ██   ██ ██   ██    ██        ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
  */



 let scrollToElemTop = ($elem, isLast) => {

   console.log(disableScroll);

   let winHeight = $(window).height()

   let helperElem = $('.prop');

   let setHelperPosotin = (winHeight,$elem) => {
     let helperPosition = ($elem.offset().top + winHeight);

     if ( helperPosition > helperElem.offset().top) {
       helperElem.css({
         top: helperPosition
       });
     }
   }

  if(!isLast) setHelperPosotin(winHeight ,$elem);


  let topPosition =  $elem.offset().top

  //перемотка к нужному месту
  $('body').clearQueue()
    .animate({
      scrollTop: topPosition,
    }, {
      duration: 1000,
      done: ()=> disableScroll = false
    });


 }


  let scrollToElemCenter = ($elem, isLast) => {

    let setHelperPosotin = (winHeight,$elem) => {
      let helperPosition = ($elem.offset().top + $elem.height() / 2 + winHeight / 2);

      if ( helperPosition > $('.prop').offset().top) {
        $('.prop').css({
          top: helperPosition
        });
      }
    }

    disableScroll = true;

    let winHeight = $(window).height()

    //Добавление элемента
    if (!isLast) {
      setHelperPosotin(winHeight,$elem);
    }

    //определение финальной позиции
    let scrollTo;


    // если элемнет больше размера экрана то прокрутка будте до его верха
    // if ( $elem.height() < winHeight){
      scrollTo =  $elem.offset().top - winHeight / 2 + $elem.height() / 2
    // }else {
    //   scrollTo =  $elem.offset().top;
    // }

    //перемотка к нужному месту
    $('html, body').clearQueue()
      .animate({
        scrollTop: scrollTo
      }, {
        duration: 1000,
        done: ()=> disableScroll = false
      });

  }


  let doElsCollide = function(el1, el2) {

    let rect1 = el1.getBoundingClientRect();
    let rect2 = el2.getBoundingClientRect();

    return (rect1.left < rect2.left + rect2.width &&
      rect1.left + rect1.width > rect2.left &&
      rect1.top < rect2.top + rect2.height &&
      rect1.height + rect1.top > rect2.top);
  };

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

      let botomIndex = getBotomRefIndex(windowCenter);
      let percent = getPersents(windowCenter, refPoint[botomIndex - 1], refPoint[botomIndex]);
      let color = getColorMeta(colors[botomIndex - 1], colors[botomIndex], percent);

      if (color !== bgColor) {
        window.requestAnimationFrame(function() {
          window.document.body.style.backgroundColor = `rgb(${color})`;
        });
        bgColor = color;
      }
    };

    return onscroll;

  })();

  window.onscroll = onscroll;



  $(function() {


    /*
    ██    ██  █████  ██      ██████  ██  ██████ ██   ██ ███████ ██████
    ██    ██ ██   ██ ██      ██   ██ ██ ██      ██  ██  ██      ██   ██
    ██    ██ ███████ ██      ██████  ██ ██      █████   █████   ██████
     ██  ██  ██   ██ ██      ██      ██ ██      ██  ██  ██      ██   ██
      ████   ██   ██ ███████ ██      ██  ██████ ██   ██ ███████ ██   ██
    */


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

    /*
    ██    ██  █████  ██      ██████  ██  ██████ ██   ██ ███████ ██████  ██████
    ██    ██ ██   ██ ██      ██   ██ ██ ██      ██  ██  ██      ██   ██      ██
    ██    ██ ███████ ██      ██████  ██ ██      █████   █████   ██████   █████
     ██  ██  ██   ██ ██      ██      ██ ██      ██  ██  ██      ██   ██ ██
      ████   ██   ██ ███████ ██      ██  ██████ ██   ██ ███████ ██   ██ ███████
    */


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
        let answer =  Math.round(percent * 100)

        return answer > 35 && answer < 45;
      }

      return {
        isRight
      }

    };

    /*
    ██    ██  █████  ██      ██████  ██  ██████ ██   ██ ███████ ██████  ██████
    ██    ██ ██   ██ ██      ██   ██ ██ ██      ██  ██  ██      ██   ██      ██
    ██    ██ ███████ ██      ██████  ██ ██      █████   █████   ██████   █████
     ██  ██  ██   ██ ██      ██      ██ ██      ██  ██  ██      ██   ██      ██
      ████   ██   ██ ███████ ██      ██  ██████ ██   ██ ███████ ██   ██ ██████
    */


    let valPicker3 = function(fn, state) {
      let circle = document.querySelector('.guess-growth-main-small');
      let textFeald = document.querySelector('.guess-growth-main-text');
      let baseR = 38.3333333333;
      let r = 38.3333333333;
      let h = 0;
      let text = "1 000 000";
      let selectedVal = 0;
      let baseVal = 1000000;
      let totalVal = 1000000;

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

      let calculeteNewR = persent => baseR + baseR*persent ;

      let calculeteNewVal = persent => baseVal + baseVal*persent;

      let onDrag = (event, ui) => {

        h = ui.position.top;
        let persent  = (1 - h / 230) * 5
        r = calculeteNewR(persent);
        selectedVal = calculeteNewVal(persent)
        text = valToText(selectedVal);
        requestAnimationFrame(changeR);
        requestAnimationFrame(changeText);
        //что записывать в состояние. Это вообще используется?
        state.selected = h / 230;
        fn();
      };

      let onDragY = (event, ui) => {
        h = ui.position.left;
        let persent  = ( h / 230) * 5
        r = calculeteNewR(persent);
        selectedVal = calculeteNewVal(persent)
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


      let isRight = () => (selectedVal > 3000000 && selectedVal < 4000000)

      return {
        isRight
      }
    };



    function hookUpValQueston(id, question, ValPicker, AnswerSelectors, onAnswer) {

      let answerButton = question.find(".answerButton");
      let answer = $(AnswerSelectors);
      this.isShown = false;


      let initAnswers = () => {
        hideElem(answer)
      };

      let showAnswers = () => {
        showElem(answer);
        onAnswer && onAnswer();
        // scrollToElemCenter(answer)
        scrollToElemTop($($(".answerButton")[id]))
      };

      let initQuestion = () => {
        hideElem(question);
      };

      let showQuestin = () => {
        showElem(question)
        // scrollToElemCenter(question)
        scrollToElemTop($($('.footer')[id]))
      };

      let state = {
        selected: null,
        isAnswered: false,
        right: 12,
      };

      let render = function() {
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

      let removeButton = () => {
        answerButton.css({
          opacity: 0,
          pointerEvents: "none"
        });
      };

      let valPicker = ValPicker(render, state);

      let that = this;
      this.result = null;

      //Click on answer
      answerButton.click(function() {
        state.isAnswered = true;
        that.result = valPicker.isRight()
        render();
      });

      //Show question
      $('.scrollBtn')[id].onclick = function() {
        that.show();
      }

      this.init = () => {
        initQuestion();
        initAnswers();
      }

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
        // scrollToElemCenter(answer)
        scrollToElemTop($($(".answerButton")[id]))
      };

      let initQuestion = () => {
        hideElem(question);
      };


      let showQuestin = () => {
        showElem(question);
        // scrollToElemCenter(question);
        scrollToElemTop($($('.footer')[id]))
      };

      let state = {
        selected: null,
        isAnswered: false,
        right: right,
      };

      let render = function() {
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

      $('.scrollBtn')[id].onclick = function() {
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




    let getDataAndMap = function() {
      $(".map_body").load("map.svg", function() {

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
            let regInfo = new RegInfo(data);
            let regInfoMobile = new RegInfoMobile(data)
            regInfo.init()
            regInfo.render();
            regInfoMobile.init();
            regInfoMobile.render();
          });
        })
      }

    getDataAndMap();

    // keyReasonChart.show();
    // newInfectedChartMobile.show();

    let footer = new Footer(7);


    let quizElems = [
      new hookUpQueston(0, $(".question-one"), 2, ".plate3"),
      new hookUpQueston(1, $(".question-two"), 3, ".plate5", getDataAndMap),
      new hookUpQueston(2, $(".question-three"), 2, ".answer-three, .plate6-after",
        function() {
          newInfectedChart.show();
          newInfectedChartMobile.show();
        }),
      new hookUpValQueston(3, $(".question-four"), valPicker3, ".answer-four, .plate7-after"),
      new hookUpValQueston(4, $(".question-five"), valPicker2, ".answer-five", keyReasonChart.show),
      new hookUpValQueston(5, $(".question-six"), valPicker, ".answer-six"),
      new hookUpQueston(6, $(".question-seven"), 1, ".answer-seven, .plate10-after"),
      footer,
    ];

    let sideBars = new SideBars(quizElems);

    footer.ee.on("show", (e)=>{
      sideBars.select(e);
      renderResult();
    })


    quizElems.forEach(elem => elem.init());


    // quizElems.forEach(elem => elem.show());


    let results = [{
      text: "СПИД, как известно, не спит. А вы почти ничего о нём не знаете",
    }, {
      text: "Кажется, вы, по крайней мере, знаете, чем отличается ВИЧ от СПИД",
    }, {
      text: "Вы отлично разбираетесь в этой невесёлой теме!",
    }, ]


    let renderResult = function() {

      let resultVal = quizElems.reduce((val, e) => {
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
      for (let i = quizElems.length - 1; i >= 0; i--) {
        let e = quizElems[i];
        if (i == 0 && !e.isShown) {
          quizElems[i].show();
          sideBars.show()
          return;
        }
        if (e.isShown && e.result !== null && i < quizElems.length - 1) {
          if (!quizElems[i + 1].isShown) quizElems[i + 1].show();
          return;
        }
      }
    }


    let oldScrollPositoin = window.pageYOffset || document.documentElement.scrollTop;

    addMouseewheelEvent(document,onWheel)

    function onWheel(e) {
      e = e || window.event;

      if (disableScroll) {
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
        oldScrollPositoin = newScrollPositoin;
      }
    }
  });



  $(".share-btn, .share-btn-big").click(function() {
    share(this.dataset.network);
  })

})();
