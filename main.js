"use strict";

  import {addMouseewheelEvent} from "./utils";
  import {getColor} from "./utils";


  import RegInfo from "./RegInfo"
  import RegInfoMobile from "./RegInfoMobile";

  import newInfectedChartMobile from "./newInfectedChartMobile"


(function() {

  /*
   ██████  ██       ██████  ██████   █████  ██      ███████
  ██       ██      ██    ██ ██   ██ ██   ██ ██      ██
  ██   ███ ██      ██    ██ ██████  ███████ ██      ███████
  ██    ██ ██      ██    ██ ██   ██ ██   ██ ██           ██
   ██████  ███████  ██████  ██████  ██   ██ ███████ ███████
  */

  let disableScroll = false;


  /*
  ██      ██ ██████  ██████   █████  ██████  ██    ██     ███████ ██    ██ ███    ██  ██████ ████████ ██  ██████  ███    ██ ███████
  ██      ██ ██   ██ ██   ██ ██   ██ ██   ██  ██  ██      ██      ██    ██ ████   ██ ██         ██    ██ ██    ██ ████   ██ ██
  ██      ██ ██████  ██████  ███████ ██████    ████       █████   ██    ██ ██ ██  ██ ██         ██    ██ ██    ██ ██ ██  ██ ███████
  ██      ██ ██   ██ ██   ██ ██   ██ ██   ██    ██        ██      ██    ██ ██  ██ ██ ██         ██    ██ ██    ██ ██  ██ ██      ██
  ███████ ██ ██████  ██   ██ ██   ██ ██   ██    ██        ██       ██████  ██   ████  ██████    ██    ██  ██████  ██   ████ ███████
  */



 let scrollToElemTop = ($elem, isLast) => {

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

  let showElem = ($elem) => {

    $elem.css({
        display: "block",
      }).clearQueue()
      .animate({
        opacity: 1
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

    function Footer(id) {

      let footer = $(".plate11, .line.bottom");

      this.init = function() {
        hideElem(footer)
      };

      let that = this;

      $('.scrollBtn')[id].onclick = function() {
        that.show();
      };

      this.show = function() {
        sideBars.select(id);
        this.isShown = true;
        showElem(footer)
        scrollToElemTop($($('.footer')[id]),true)
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
        quizElems[parseInt(this.dataset.id)].show();
        select(parseInt(this.dataset.id))
      })

      let render = () => {

        quizElems.forEach((e, i) => {
          if (e.result && e.result) {
            $sideBars[i].classList.add("box-true")
          } else if (e.result === false) {
            $sideBars[i].classList.add("box-false")
          }
        })
      }


      this.isShown = false
      this.select = select;
      this.render = render;
      this.show = function(){
        this.isShown = true;
        showElem($mainElem)
      }
    }

    let sideBars = new SideBars();

    let getDataAndMap = function() {
      $(".map_body").load("map.svg",function() {

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
      newInfectedChartMobile.show();

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
      new Footer(7),
    ];


    // quizElems.forEach(elem => elem.init());


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

})();
