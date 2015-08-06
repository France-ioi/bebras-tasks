function loadJaune(div) {
   var rsr = Raphael(div, '80', '80');
   var jaune = DrawJaune(rsr);
   jaune.transform("t40,40");
}

function DrawJaune(rsr) {
   var rect14 = rsr.rect(0.0, 0.0, 64, 64);
   rect14.attr({y: '-32.0',x: '-32.0',fill: '#ffff00',stroke: '#ffff00',"stroke-width": '0.34',"stroke-opacity": '1'});
   return rect14;
}