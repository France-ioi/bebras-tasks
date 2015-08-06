function loadRonde() {
	var rsr = Raphael('ronde', '77.5', '65.937279');
	var layer1 = rsr.set();
	var path3047 = rsr.path("m 2.86136,19.223543 0,29.265787 c 0,0 4.415876,17.04508 37.38864,17.52541 33.06353,0.48165 39.38864,-18.03885 39.38864,-18.03885 l 0,-28.238912");
	path3047.attr({id: 'path3047',parent: 'layer1',fill: '#ff0000',stroke: '#000000',"stroke-width": '0.74',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1'});
	path3047.transform("t-2.5,-0.4470054").data('id', 'path3047');
	var path3015 = rsr.path("m 164,52.862183 c 0,5.246705 -16.56546,9.5 -37,9.5 -20.43454,0 -37,-4.253295 -37,-9.5 0,-5.246706 16.56546,-9.5 37,-9.5 20.43454,0 37,4.253294 37,9.5 z");
	path3015.attr({id: 'path3015',parent: 'layer1',fill: '#800000',stroke: '#ff0000',"stroke-width": '2',"stroke-linecap": 'butt',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',"stroke-dashoffset": '0'});
	path3015.transform("t-2.5,-0.4470054 m1,0,0,1.9400448,-86,-81.762393").data('id', 'path3015');
	layer1.attr({'id': 'layer1','name': 'layer1'});layer1.transform("t-2.5,-0.4470054");
	var rsrGroups = [layer1];
}