//
let content = document.body.innerHTML;
//
//
// function hanged(str){
//   var preds = ["В","но","а","и","без","от","в","на","из","с","к","ко","по","во","до","над","под","о","об","обо","за","для"];
//   var tarr = str.split(" ");
//   var strout = "";
//   for (var i=0;i<tarr.length; i++) {
//    strout+=tarr[i];
//    var pr = false;
//    for (var j=0;j<preds.length; j++) {
//     if(tarr[i]==preds[j]){
//      pr = true;
//      break;
//     }
//    }
//    if(pr){strout+= "&nbsp;"} else {strout+=" "}
//   };
//   return strout;
 // }
//



 var preds = ["в","на","В","Но","но","а","и","без","от","в","на","из",
  "с","к","ко","по","во","до","над","под","о","об","обо","за","для"];

// let str = "на"
//
// console.log( str.charCodeAt(0), str.charCodeAt(1));
//
// str = "на"
//
// console.log(str.length ,str.charCodeAt(0), str.charCodeAt(1));

let hangedGaps =  function(str) {
  return  str.split(" ").reduce(function(finstr, curElem){
    // console.log(curElem,preds.indexOf(curElem));
    // console.log(curElem, preds.indexOf(curElem));
     if(preds.indexOf(curElem) >=0) {
       return finstr+curElem+"&nbsp;";
       console.log("hi");
     }
     return finstr+curElem+" ";
   }," ")
 }
//
//
// console.log(myGaps("Но полгода назад снова вышла на передовицы: оказалось"));

 // document.body.innerHTML= hangedGaps(content)

 console.log(hangedGaps(content));
