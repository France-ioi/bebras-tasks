function loadRouge(div) {
   var rsr = Raphael(div, '80', '80');
   var rouge = DrawRouge(rsr);
   rouge.transform("t40,40");
}

function DrawRouge(rsr) {
   var circle10 = rsr.circle(0, 0, 30);
   circle10.attr({fill: '#ff0000',stroke: '#f90b11',"stroke-width": '0.7',"stroke-opacity": '1'});
   return circle10;
}