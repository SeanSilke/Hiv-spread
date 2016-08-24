
import {getColorMeta} from "./utils"

console.log("hi");

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

export default  newInfectedChartMobile;
