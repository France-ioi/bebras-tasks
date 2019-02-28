function loadImageCompass() {
   var rsr = Raphael('compass', '100', '100');
   var layer1 = rsr.set();
   var scale = "s0.3,0.3,0,0";
   var path3801 = rsr.path("m 101,66.352749 45.90752,79.514151 -91.815037,0 z");
   path3801.attr({id: 'path3801',parent: 'layer1',fill: '#000000',"fill-opacity": '0.98039216',"fill-rule": 'nonzero',stroke: '#000000',"stroke-width": '3',"stroke-linecap": 'butt',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',"stroke-dashoffset": '0'});
   path3801.transform(scale + "t-10.144531,-17.537964 m0.55629933,0,0,0.92603558,103.18296,8.7889602").data('id', 'path3801');

   var path3803 = rsr.path("m 101,66.352749 45.90752,79.514151 -91.815037,0 z");
   path3803.attr({id: 'path3803',parent: 'layer1',fill: '#000000',"fill-opacity": '0.98039216',"fill-rule": 'nonzero',stroke: '#000000',"stroke-width": '3',"stroke-linecap": 'butt',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',"stroke-dashoffset": '0'});
   path3803.transform(scale + "t-10.144531,-17.537964 m-0.55629933,0,0,-0.92603558,215.55542,331.31191").data('id', 'path3803');

   var path3805 = rsr.path("m 101,66.352749 45.90752,79.514151 -91.815037,0 z");
   path3805.attr({id: 'path3805',parent: 'layer1',fill: '#000000',"fill-opacity": '0.98039216',"fill-rule": 'nonzero',stroke: '#000000',"stroke-width": '3',"stroke-linecap": 'butt',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',"stroke-dashoffset": '0'});
   path3805.transform(scale + "t-10.144531,-17.537964 m0,-0.55629933,0.92603558,0,-1.164444,226.33913").data('id', 'path3805');

   var path3807 = rsr.path("m 101,66.352749 45.90752,79.514151 -91.815037,0 z");
   path3807.attr({id: 'path3807',parent: 'layer1',fill: '#000000',"fill-opacity": '0.98039216',"fill-rule": 'nonzero',stroke: '#000000',"stroke-width": '3',"stroke-linecap": 'butt',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',"stroke-dashoffset": '0'});
   path3807.transform(scale + "t-10.144531,-17.537964 m0,-0.55629933,-0.92603558,0,321.3585,226.33913").data('id', 'path3807');

   var text3809 = rsr.text(160, 48, 'N');
   text3809.attr({id: 'text3809',parent: 'layer1',"font-size": '56px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   text3809.transform(scale + "t-10.144531,-17.537964").data('id', 'text3809');

   var text3813 = rsr.text(35, 174, 'O');
   text3813.attr({id: 'text3813',parent: 'layer1',"font-size": '56px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   text3813.transform(scale + "t-10.144531,-17.537964").data('id', 'text3813');

   var text3817 = rsr.text(282, 172, 'E');
   text3817.attr({id: 'text3817',parent: 'layer1',"font-size": '56px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   text3817.transform(scale + "t-10.144531,-17.537964").data('id', 'text3817');
   
   var text3821 = rsr.text(158, 300, 'S');
   text3821.attr({id: 'text3821',parent: 'layer1',"font-size": '56px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   text3821.transform(scale + "t-10.144531,-17.537964").data('id', 'text3821');

   layer1.attr({'id': 'layer1','name': 'layer1'});
}