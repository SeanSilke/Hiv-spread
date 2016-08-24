import PieChart from "./PieChart"

function PopUp(mapMain, mainElem, rad, isMobile) {


  let pieChart = new PieChart(mainElem, rad);

  let popUp = mainElem;
  let closeButton = popUp.find(".head .btn.close");
  let pieContainer = popUp.find(".body .pie");

  let dataFields = popUp.find(".body .data .item");
  let stateNameFeald = popUp.find(".head .region span");
  let infectedFeald = dataFields.find(".infected");
  let diedFeald = dataFields.find(".dead");
  // console.log(infectedFeald);
  let infectedTextFeald = $(dataFields.find(".label")[0]);
  // console.log(dataFields.find(".label")[0],infectedTextFeald);

  let close = function() {
    hide();
    mapMain.state.regionId = "";
    mapMain.render();
  };

  closeButton.click(function(e) {
    close();
  });

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


  this.render = function() {
    if (!mapMain.state.regionId) {
      hide();
      return;
    }

    let name, infected, died, infectedText;
    if (isMobile) {
      name = mapMain.data[mapMain.state.regionId].shortName;
    } else {
      name = mapMain.data[mapMain.state.regionId].name;
    }

    if (mapMain.state.display == "rel") {
      pieContainer.hide();
      $(dataFields[1]).hide();
      $(dataFields[0]).find(".infected").css({
        width: "auto"
      });
      died = null;
      infected = mapMain.data[mapMain.state.regionId].relInfected[mapMain.state.year] || "н/д";
      infectedText = "Число инфицированных на&nbsp;100 тысяч населения";
    } else {
      infected = mapMain.data[mapMain.state.regionId].absInfected[mapMain.state.year] || "н/д";
      died = mapMain.data[mapMain.state.regionId].absDied[mapMain.state.year] || "н/д";
      pieContainer.show();
      $(dataFields[1]).show();
      $(dataFields[0]).find(".infected").css({
        width: "23%"
      });
      pieChart.render(360 * (died / infected));
      infectedText = "Общее число инфицированных";
    }

    stateNameFeald.text(name);
    infectedFeald.text(infected);
    infectedTextFeald.html(infectedText);
    diedFeald.text(died);

    // if (mapMain.state.regionId && !isMobile) {
    //    setPosition(findPosition());
    // }
    open();
  };

}


export default PopUp
