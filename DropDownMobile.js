function DropDownMobile(mapMain, dropDownElem) {
  let that = this;
  let isOpen = false;
  let $select = dropDownElem.find(" .head");
  let scrollable = dropDownElem.find(".scrollable");
  let closeImg = dropDownElem.find(" .close_button img");

  let container = scrollable.find(".content");

  let head = dropDownElem.find(".text");

  let dropDownElems = dropDownElem.find(".togle-abs-rel");

  $select.click(
    function(e) {
      e.stopPropagation();
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

  dropDownElems.click(function(e){
    e.stopPropagation();
    mapMain.state.display = this.dataset.displaytype;
    mapMain.render();
    that.close();
  })

  this.render = function() {
    $.each( dropDownElems, (i,e)=> {
      if(e.dataset.displaytype == mapMain.state.display){
        e.classList.add("active")
        head.text(e.innerHTML)
      }else{
        e.classList.remove("active")
      }
    } )
    that.close();
  };
}

export default DropDownMobile;
