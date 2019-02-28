function loadBleu(div) {
   var rsr = Raphael(div, '80', '80');
   var blue = DrawBleu(rsr);
   blue.transform("t40,40");
}
function DrawBleu(rsr) {
   var path4617 = rsr.path("m 0,-30 28.57,19.81 -10.81,33.31 -35.57,0 -10.81,-33.31 z");
   path4617.attr({id: 'path4617',opacity: '0.91000001',fill: '#0000ff',"fill-opacity": '1',stroke: '#0000ff',"stroke-width": '4',"stroke-linecap": 'round',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   return path4617;
}