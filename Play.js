function Play(mapMain) {

  let that = this;

  this.play = function() {
    if (!mapMain.state.isPlaing) {
      return;
    }

    if (mapMain.render) {

      if (mapMain.state.year == 2014) {
        mapMain.state.year = 1994
      } else {
        mapMain.state.year++;
      }

      mapMain.render();
    }

    setTimeout(function() {
      that.play();
    }, 1000);
  }

}

export default Play;
