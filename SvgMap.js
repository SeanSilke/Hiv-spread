import {getColor} from "./utils"

function SvgMap(mapMain) {

  this.render = null;
  this.selectedReg = null;
  this.mapElem = document.getElementById("svg-map");
  let that = this;


  let regions = $("#svg-map path, #svg-map polygon");
  let selectedReg = null;

  let setRegsColor = function(year) {
    Object.keys(mapMain.data).forEach(function(reginoId) {

      let value, percent;

      if (mapMain.state.display == "abs") {

        value = mapMain.data[reginoId].absInfected[year];

        if (value < 100) {
          percent = 0;
        } else {
          percent = (Math.log2(value / 100)) / 9;
        }
      } else {
        value = mapMain.data[reginoId].relInfected[year];

        if (value < 10) {
          percent = 0;
        } else {
          percent = (Math.log2(value / 10)) / 9;
        }

      }

      $('#' + reginoId).css({
        'fill': getColor(percent),
      });
    });
  };

  let setSelectedRegion = function(regionId) {
    that.selectedReg && that.selectedReg.classList.remove('selected');
    if (regionId) {
      that.selectedReg = document.getElementById(regionId);
      that.selectedReg.classList.add('selected');
    }
  };



  this.render = function() {
    setRegsColor(mapMain.state.year);
    setSelectedRegion(mapMain.state.regionId);
    if (mapMain.state.regionId) {
      this.mapElem.classList.add('regSelected');
    } else {
      this.mapElem.classList.remove('regSelected');
    }
  };

  regions.click(
    function(e) {
      e.stopPropagation();
      // mapMain.state.isPlaing =false;
      if (e.target.id === mapMain.state.regionId) {
        that.mapElem.classList.remove('regSelected');
        mapMain.state.regionId = "";
      } else {
        mapMain.state.regionId = e.target.id;
        e.target.parentElement.insertBefore(e.target, null);
      }
      mapMain.render();
    }
  );
}



export default SvgMap;
