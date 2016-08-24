


import DropDown from "./DropDown";
import PopUp from "./PopUp";
import TogleBtn from './TogleBtn';
import DropDownMobile from "./DropDownMobile";
import YearSelect from "./YearSelect"



function RegInfoMobile(data) {

  this.data = data;
  let mapMain = this;

  // -------------Map State------------
  this.state = {
    year: 1999,
    regionId: "Москва",
    display: "abs"
  };

  let dropDown = new DropDown(this,
                      $(".map.hide-desktop .item.drop_down:last-of-type")
                    );
  let dropDownMobile = new DropDownMobile(this,
                          $(".map.hide-desktop .item.drop_down").first()
                    );
  let popUp = new PopUp(this, $(".hide-desktop .banner"), 50, true);
  let yearSelect = new YearSelect(this, $('.year-select'));

  this.render = function() {
    dropDown.render();
    popUp.render();
    yearSelect.render();
    dropDownMobile.render();
  };


  this.init = function() {
    dropDown.scroller.create();

    document.body.addEventListener("click",
      function(e) {
        mapMain.render();
      }
    );
  };

};



export default RegInfoMobile;
