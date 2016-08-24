function Years(mapMain) {
  this.render = function() {

    $(".years .col").each(function(id, e) {
      let year = parseInt($(e).attr("id"));
      if (year === mapMain.state.year) {
        $(e).addClass("active");
      } else {
        $(e).removeClass("active");
      }
    });

  };

  // _____________click__________

  $(".years .col").on("click", function(e) {
    e.stopPropagation();
    mapMain.state.isPlaing = false;
    let year = parseInt($(this).attr("id"));
    mapMain.state.year = year;
    mapMain.render();
  });

}

export default Years;
