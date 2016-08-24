
import {getColorMeta} from "./utils";
import {newInfectedData} from "./Data.js"


let newInfectedChartMobile = (() => {

  let data = newInfectedData;


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

export default  newInfectedChartMobile;
