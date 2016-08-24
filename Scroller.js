import {addMouseewheelEvent} from "./utils";


function Scroller(mainElem) {
  let scrollContainer = mainElem[0],
    scrollContentWrapper = mainElem.find('.content-wrapper')[0],
    scrollContent = mainElem.find('.content')[0],
    contentPosition = 0,
    scrollerBeingDragged = false,
    scroller,
    topPosition,
    scrollerHeight,
    normalizedPosition;

  function calculateScrollerHeight() {
    // *Calculation of how tall scroller should be
    let visibleRatio = scrollContainer.offsetHeight / scrollContentWrapper.scrollHeight;
    visibleRatio = 0.05;
    return visibleRatio * scrollContainer.offsetHeight;
  }

  function moveScroller(evt) {
    // Move Scroll bar to top offset
    let scrollPercentage = evt.target.scrollTop / scrollContentWrapper.scrollHeight;
    topPosition = scrollPercentage * (scrollContainer.offsetHeight * 0.915) + scrollContainer.offsetHeight * 0.05; // 5px arbitrary offset so scroll bar doesn't move too far beyond content wrapper bounding box
    scroller.style.top = topPosition + 'px';
  }

  function startDrag(evt) {
    normalizedPosition = evt.pageY;
    contentPosition = scrollContentWrapper.scrollTop;
    scrollerBeingDragged = true;
  }

  function stopDrag(evt) {
    scrollerBeingDragged = false;
  }

  function scrollBarScroll(evt) {
    if (scrollerBeingDragged === true) {
      let mouseDifferential = evt.pageY - normalizedPosition;
      let scrollEquivalent = mouseDifferential *
        (scrollContentWrapper.scrollHeight / scrollContainer.offsetHeight);
      scrollContentWrapper.scrollTop = contentPosition + scrollEquivalent;
    }
  }

  this.create = function() {
    // *Creates scroller element and appends to '.scrollable' div
    // create scroller element
    scroller = document.createElement("div");
    scroller.className = 'scroller';

    // determine how big scroller should be based on content
    scrollerHeight = calculateScrollerHeight();

    if (scrollerHeight / scrollContainer.offsetHeight < 1) {
      // *If there is a need to have scroll bar based on content size
      scroller.style.height = scrollerHeight + 'px';

      // append scroller to scrollContainer div
      scrollContainer.appendChild(scroller);

      // show scroll path divot
      scrollContainer.className += ' showScroll';

      // attach related draggable listeners
      scroller.addEventListener('mousedown', startDrag);
      window.addEventListener('mouseup', stopDrag);
      window.addEventListener('mousemove', scrollBarScroll);
    }

  }

  let onWheel = (e) => e.stopPropagation()

  addMouseewheelEvent(scrollContentWrapper,onWheel);

  // *** Listeners ***
  scrollContentWrapper.addEventListener('scroll', moveScroller);

}

export default Scroller;
