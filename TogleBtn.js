function TogleBtn(mapMain) {
  let btn = $(".map .map_header .btn");

  btn.click(function(e) {
    e.stopPropagation();
    mapMain.state.isPlaing = false;
    mapMain.state.display = this.dataset.displaytype;
    mapMain.render();
  });

  let setButtons = function(display) {
    btn.each(function(i, elem) {
      if (elem.dataset.displaytype == display) elem.classList.add('active');
      else elem.classList.remove('active');
    });
  };

  this.render = function() {
    setButtons(mapMain.state.display);
  }
}

export default TogleBtn;
