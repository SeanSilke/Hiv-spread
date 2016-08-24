function YearSelect(mapMain, mainElem) {
  let year = mainElem.find(".selected-year");
  let moreBtn = mainElem.find(".more");
  let lessBtn = mainElem.find(".less");

  moreBtn.click(() => {
    if (mapMain.state.year < 2014) mapMain.state.year++;
    mapMain.render();
  })

  lessBtn.click(() => {
    if (mapMain.state.year > 1994) mapMain.state.year--;
    mapMain.render();
  })

  this.render = () => {
    year.text(mapMain.state.year)
  }
}

export default YearSelect;
