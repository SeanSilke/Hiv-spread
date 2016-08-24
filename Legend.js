import {getColor} from "./utils"

function Legend(mapMain) {

  let initColors = function() {
    $(".legend .bloc .color").each(function(id, e) {
      let color = getColor((id + 1) / 10);
      $(e).css({
        "background-color": color
      });
    });
  };

  let renderValues = function() {
    let multiplier = mapMain.state.display == "abs" ? 100 : 10;

    $(".legend .bloc .val").each(function(id, e) {
      $(e).text(multiplier * Math.pow(2, id));
    });
  };

  this.init = function() {
    initColors();
    renderValues();
  };

  this.render = function() {
    renderValues();
  };

}

export default Legend;
