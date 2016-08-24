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



export default keyReasonChart;
