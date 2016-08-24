import {getColorMeta} from "./utils";
import {newInfectedData} from "./Data.js"

let newInfectedChart = (() => {

  let data = newInfectedData;


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


export default newInfectedChart;
