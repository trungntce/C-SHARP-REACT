// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck



var MenuClassname = 'vertical-menu2';



function reportWindowSize() {
   if (!document.getElementsByClassName(MenuClassname).length) return;
       document.getElementsByClassName(MenuClassname)[0].style.position = "";
       document.getElementsByClassName(MenuClassname)[0].style.top = "0";
       document.getElementsByClassName(MenuClassname)[0].style.position = "fixed";

       location.reload();
   }


   window.onresize = reportWindowSize;
   window.addEventListener("resize", reportWindowSize);


   document.onload = () => {
       setInterval(function () { increaseheight(); }, 500);
       if (document && document.body)
           document.body.setAttribute('data-sidebar-size', 'sm')

   }


   window.onload = () => {  
       if (document && document.body)
           document.body.setAttribute('data-sidebar-size', 'sm')

   }


   function addSecs(date, s) {
       let milliseconds = s * 1000; // 1 seconds = 1000 milliseconds
       return new Date(date.getTime() + milliseconds);
   }



   var lastWheel = new Date();
   window.addEventListener('wheel', function (event) {

       if (addSecs(lastWheel, 0.5) > new Date()) {
           return;
       }
       
       lastWheel = new Date();

       if (event.deltaY < 0) {
           newback();
       }
       else if (event.deltaY > 0) {
           newnext();
       }
       //alert('inheight=' + window.innerHeight + "     outerheight=" + window.outerHeight);
       
   });





export function newback() {
if (!document.getElementsByClassName(MenuClassname).length) return;
       var pos = (parseInt(document.getElementsByClassName(MenuClassname)[0].style.top) || 0);
       //console.log(pos);
       var minmax = 0;
       var stoppoint = pos + getHeight();

       if (pos > minmax) return;

       document.getElementsByClassName(MenuClassname)[0].style.position = "fixed"
       document.getElementsByClassName(MenuClassname)[0].style.position = "";

       var i = 1;
       var nextinter = setInterval(function () {
           if (pos >= minmax) {
               clearInterval(nextinter);
               return;
           }

           if (pos < stoppoint || pos > -430) { pos = pos + i * 2; i++; }
           else {
               document.getElementsByClassName(MenuClassname)[0].style.top = (stoppoint > 0 ? 0 : stoppoint) + "px";
               clearInterval(nextinter);
               return;
           }

           document.getElementsByClassName(MenuClassname)[0].style.top = (pos > 0 ? 0 : pos) + "px";

       }, 10);

setTimeout(function () {
   if (!document.getElementsByClassName(MenuClassname).length) return;
           document.getElementsByClassName(MenuClassname)[0].style.position = "fixed";
       }, 1500);

   }





const valheight = 768;
export function newnext() {

if (!document.getElementsByClassName(MenuClassname).length) return;
      
       var pos = (parseInt(document.getElementsByClassName(MenuClassname)[0].style.top) || 0);
       //console.log(pos);
var minmax = -document.getElementsByClassName('rownewlayout')[0].offsetHeight + getHeight()-60;
var stoppoint = pos - getHeight() + (getHeight() < valheight ? 60 : 10) ;

       //if (pos<0 && pos > minmax) return;
       document.getElementsByClassName(MenuClassname)[0].style.position = "fixed"
       document.getElementsByClassName(MenuClassname)[0].style.position = "";

       var i = 1;
       var nextinter = setInterval(function () {

           if (pos <= minmax) {
               clearInterval(nextinter);
               return;
           }

           if (pos > stoppoint) { pos = pos - i * 2; i++; }
           else {
               document.getElementsByClassName(MenuClassname)[0].style.top =
                   (stoppoint < minmax ? minmax : stoppoint) + "px";
               clearInterval(nextinter);
           }

           document.getElementsByClassName(MenuClassname)[0].style.top = (pos < minmax ? minmax : pos) + "px";
       }, 10);


setTimeout(function () {
   if (!document.getElementsByClassName(MenuClassname).length) return;
           document.getElementsByClassName(MenuClassname)[0].style.position = "fixed";
       }, 1500);

   }


export function clickToggle(noset) {



if (!document.getElementsByClassName("rownewlayout").length) return;



if (getHeight() < valheight)
if (document.getElementById("page-topbar") && document.getElementsByClassName(MenuClassname).length) {
   var pos = (parseInt(document.getElementsByClassName(MenuClassname)[0].style.top) || 0)
   if (pos < -150) {
       document.getElementById("page-topbar").style.display = "none";
   }
   else document.getElementById("page-topbar").style.display = "";
}


if (noset == 1) {        
   if (window.innerWidth > 992 && window.outerWidth > 992) {
       if (document.body.getAttribute("data-sidebar-size") == "sm") {
           document.getElementsByClassName("rownewlayout")[0].style.paddingLeft = "72px";
       }
       else{
           document.getElementsByClassName("rownewlayout")[0].style.paddingLeft = "256px";
       }
       //document.getElementsByClassName("rownewlayout")[0].style.width = "100%";
   }
   else {
       document.getElementsByClassName("rownewlayout")[0].style.paddingLeft = "0";   
       //document.getElementsByClassName("rownewlayout")[0].style.width = "auto";
   }        
   return;
}      

if (document.body.getAttribute("data-sidebar-size") == "lg") {
   document.body.setAttribute("data-sidebar-size", "sm");
   document.getElementsByClassName("rownewlayout")[0].style.paddingLeft = "72px";
   //document.getElementsByClassName("rownewlayout")[0].style.width = "auto";
}
else {
   document.body.setAttribute("data-sidebar-size", "lg");
   document.getElementsByClassName("rownewlayout")[0].style.paddingLeft = "256px";
   //document.getElementsByClassName("rownewlayout")[0].style.width = "100%";        
}    


var arrsub = document.getElementsByClassName("sub-menu");
for (var i = 0; i < arrsub.length; i++) {
   arrsub[i].classList.remove("active");
   arrsub[i].classList.remove("mm-active");
   arrsub[i].classList.add("mm-collapse");
   arrsub[i].classList.add("mm-show");
}
}


function getHeight() {
var height = window.innerHeight > window.innerHeight ? window.innerHeight : window.innerHeight;
//if (window.innerWidth > 768 && window.innerWidth > 768) {
   return height;
//}
//return height - height * 0.2 - height * 0.005;
}



function increaseheight() {

getHeight();
clickToggle(1);
       
       if (!document.getElementsByClassName("rownewlayout").length) return;

               var arr = document.getElementsByClassName("rownewlayout")[0];
               if (!arr) return;
               var minheight = "";
               if (window.outerWidth > 768 && window.innerWidth > 768) {

                   for (var i = 0; i < arr.childNodes.length; i++) {
                       var child = arr.childNodes[i];
                       if (child.classList.toString().indexOf('col-md-2') >= 0 ||
                           child.classList.toString().indexOf('col-md-4') >= 0) {
                           //if (i >= 6 && child.offsetTop < 1058)
                           minheight = getHeight() + "px";
                           //child.style["min-height"] = "740px";
                       }
                   }
               }
               else minheight = "";

               for (var i = 0; i < arr.childNodes.length; i++) {
                   var child = arr.childNodes[i];
                   if (child.classList.toString().indexOf('col-md-2') >= 0 ||
                       child.classList.toString().indexOf('col-md-4') >= 0) {                           
                       if (child.style["min-height"] != minheight
                           && child.style["min-height"] != getHeight() + "px") child.style["min-height"] = minheight;
                   }
               }

var height1 = (parseInt(minheight)-200)+"px";
var arr1 = document.getElementsByClassName("width16");
for (var i = 0; i < arr1.length; i++) {
   var child = arr1[i];
   if (child.style["min-height"] != height1
           && child.style["min-height"] != height1 +"px") child.style["min-height"] = height1;        
}
}

setInterval(function () { increaseheight(); }, 300);

