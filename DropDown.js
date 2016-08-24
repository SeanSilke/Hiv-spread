import Scroller from "./Scroller"


function DropDown(mapMain, dropDownElem) {

  let that = this;
  let isOpen = false;

  let $select = dropDownElem.find(".head");
  let scrollable = dropDownElem.find(".scrollable");
  let closeImg = dropDownElem.find(" .close_button img");

  let container = scrollable.find(".content");

  let head = dropDownElem.find(".text");

  $select.click(
    function(e) {
      e.stopPropagation();
      mapMain.state.isPlaing = false;
      if (isOpen) {
        that.close();
      } else {
        that.open();
      }
    }
  );

  $(".scrollable").click(
    function(e) {
      e.stopPropagation();
      mapMain.state.isPlaing = false;
    }
  );


  this.close = function() {
    scrollable.css('visibility', 'hidden');
    isOpen = false;
    closeImg.css({
      transform : "rotate(0deg)",
    })
  };

  this.open = function() {
    scrollable.css('visibility', 'visible');
    isOpen = true;
    closeImg.css({
      transform: "rotate(180deg)",
    })
  };

  this.render = function() {
    if (mapMain.state.regionId) {
      head.text(mapMain.data[mapMain.state.regionId].shortName);
    } else {
      head.text("Регион");
    }

    // Dirty Hack
    container.empty();
    Object.keys(mapMain.data).forEach(
      function(region) {

        let shortName = mapMain.data[region].shortName;

        let elem = $(`<div class="item" data-regionId="${region}"> ${shortName} </div>`);

        if (region === mapMain.state.regionId) {
          elem = $(`<div class="active" data-regionId="${region}"> ${shortName} </div>`);
        }

        container.append(elem);

        elem.click(function(e) {
          e.stopPropagation();
          mapMain.state.regionId = this.dataset.regionid;
          mapMain.render();
          that.close();
        });
      }
    );
    that.close();
  };

  this.scroller = new Scroller(dropDownElem.find(".scrollable"));
}


export default DropDown;
