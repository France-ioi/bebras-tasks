function loadVert(div) {
   var rsr = Raphael(div, '80', '80');
   DrawVert(rsr);
}

function DrawVert(rsr) {
   var polygon16 = rsr.path("m 0,-30 30,60 -60,0 z");
   polygon16.attr({"fill": '#00ff00',stroke: '#02ff00',"stroke-width": '0.7',"stroke-opacity": '1',"fill-opacity": '1'});
   return polygon16;
}