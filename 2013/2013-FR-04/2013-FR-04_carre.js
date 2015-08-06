function loadCarre() {
	var rsr = Raphael('carre', '78.5', '54.5');
	var layer1 = rsr.set();
	var path3857 = rsr.path("m 6,36.884284 -1,35.5 53,0 25.5,-21 0,-32.5");
	path3857.attr({id: 'path3857',parent: 'layer1',fill: '#00ff00',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1'});
	path3857.transform("t-5,-17.375").data('id', 'path3857');
	var path3087 = rsr.path("m 28.26683,17.901254 54.5473,0 -25.325532,18.294739 -52.5991843,0 z");
	path3087.attr({id: 'path3087',parent: 'layer1',fill: '#008000',"fill-opacity": '1',stroke: '#00ff00',"stroke-width": '0.93',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
	path3087.transform("t-5,-17.375").data('id', 'path3087');
	var path3859 = rsr.path("m 58.5,36.384284 0,35");
	path3859.attr({id: 'path3859',parent: 'layer1',fill: '#008000',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1'});
	path3859.transform("t-5,-17.375").data('id', 'path3859');
	layer1.attr({'id': 'layer1','name': 'layer1'});layer1.transform("t-5,-17.375");
	var rsrGroups = [layer1];
}	