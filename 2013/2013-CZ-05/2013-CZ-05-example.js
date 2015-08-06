function loadExample() {
   var rsr = Raphael('example', '200', '100');
   var scale = "s0.3,0.3,0,0";

   var layer1 = rsr.set();
   var text3009 = rsr.text(394.28571, 420.93362, '\n');
   text3009.attr({id: 'text3009',parent: 'layer1',"font-size": '40px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   text3009.transform(scale + "t-38.40625,-21.8125").data('id', 'text3009');
   var path2985 = rsr.path("m 38.57143,306.71932 283.57144,0 0,-108.57143 z");
   path2985.attr({id: 'path2985',parent: 'layer1',fill: '#fd7805',"fill-opacity": '1',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1'});
   path2985.transform(scale + "t-38.40625,-21.8125").data('id', 'path2985');
   var path4809 = rsr.path("M 260.88866,167.35383 C 291.21735,4.6597659 402.70136,93.137916 408.96245,98.305886");
   path4809.attr({id: 'path4809',parent: 'layer1',fill: 'none',stroke: '#000000',"stroke-width": '3.28',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1',"marker-end": 'none',"arrow-end":'classic-wide-long',"stroke-miterlimit": '4',"stroke-dasharray": 'none'});
   path4809.transform(scale + "t-38.40625,-21.8125").data('id', 'path4809');
   var path29855 = rsr.path("m 442.69196,22.005023 0,283.571437 108.57143,0 z");
   path29855.attr({id: 'path2985-5',parent: 'layer1',fill: '#fd7805',"fill-opacity": '1',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1'});
   path29855.transform(scale + "t-38.40625,-21.8125").data('id', 'path29855');
   layer1.attr({'id': 'layer1','name': 'layer1'});layer1.transform("t-38.40625,-21.8125");
}