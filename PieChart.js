function PieChart(mainElem, rad) {
  let path = null;
  let svgElem = mainElem.find("#svg-pie")[0];

  this.render = function(deg) {
    if (!svgElem) return;
    if (path) {
      svgElem.removeChild(path);
      path = null;
    }
    if (isNaN(deg)) return;

    if (deg > 359) {
      path = svgElem.querySelector("circle").cloneNode(true);
      path.setAttribute("fill", "url(#img1)");
      svgElem.appendChild(path);
      return;
    }

    let cx = rad,
      cy = rad,
      rx = rad,
      ry = rad;

    let p = svgElem.createSVGPoint();
    p.x = 0;
    p.y = 1;


    let m = svgElem.createSVGMatrix();


    let p2 = p.matrixTransform(m.rotate(deg));

    p2.x = cx - p2.x * rx;
    p2.y = cy - p2.y * ry;

    path = document.createElementNS("http://www.w3.org/2000/svg", "path");

    let d;

    if (deg > 180) {
      d = "M" + cx + " " + (cy - ry) + "A" + rx + " " + ry + " 0 1 1" + p2.x + " " + p2.y + "L" + cx + " " + cy + "z";
    } else {
      d = "M" + cx + " " + (cy - ry) + "A" + rx + " " + ry + " 0 0 1" + p2.x + " " + p2.y + "L" + cx + " " + cy + "z";
    }

    path.setAttribute("d", d);
    path.setAttribute("fill", "url(#img1)");

    svgElem.appendChild(path);

  };

}



export default PieChart
