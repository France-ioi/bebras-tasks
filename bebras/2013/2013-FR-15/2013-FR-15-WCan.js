function loadWCan() {
	if (!document.getElementById("wcan")) {return;}
	var rsr = Raphael('wcan', '60.40268', '60.47559');
    var scale = "t3,3 s0.35,0.35,0,0";
	var layer1 = rsr.set();
	layer1.attr({'id': 'layer1','name': 'layer1'});layer1.transform("t-253.01455,-428.01768");
	var g3769 = rsr.set();
	var path2989 = rsr.path("m 275,504.36218 0,71 c 0,0 12.38257,15.06667 38,15 24.99984,-0.0651 38,-15 38,-15 l 0,-71 z");
	path2989.attr({id: 'path2989',parent: 'layer1',fill: '#00b100',"fill-opacity": '1',stroke: '#000000',"stroke-width": '2',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
	path2989.transform(scale + "t-253.01455,-428.01768").data('id', 'path2989');
	var path2985 = rsr.path("m 348.46363,498.19571 c 10.98546,4.72865 5.13261,10.87509 -13.0727,13.72845 -18.20531,2.85337 -41.86911,1.33315 -52.85456,-3.3955 -10.98546,-4.72865 -5.13261,-10.87509 13.0727,-13.72846 17.973,-2.81695 41.32113,-1.37506 52.48957,3.24156");
	path2985.attr({id: 'path2985',parent: 'layer1',fill: '#000000',"fill-opacity": '1',"fill-rule": 'nonzero',stroke: '#0000ff',"stroke-width": '0',"stroke-linecap": 'butt',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',"stroke-dashoffset": '0'});
	path2985.transform(scale + "t-253.01455,-428.01768 m-1.0092857,0,0,1.3263301,631.89473,-162.52601").data('id', 'path2985');
	var path3763 = rsr.path("m 351,518.36218 c 0,0 -9.57508,3.30444 -10,17.5 -0.3638,12.15385 9,15.5 9,15.5 l 55,-63 -8,-9 z");
	path3763.attr({id: 'path3763',parent: 'layer1',fill: '#00b100',"fill-opacity": '1',stroke: '#000000',"stroke-width": '2',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
	path3763.transform(scale + "t-253.01455,-428.01768").data('id', 'path3763');
	var path3765 = rsr.path("m 441.05206,475.3042 c 5.8494,8.74801 2.73295,20.11892 -6.96079,25.39765 -9.69373,5.27873 -22.29393,2.46632 -28.14333,-6.28169 -5.8494,-8.74801 -2.73295,-20.11892 6.96079,-25.39764 9.57004,-5.21137 22.00216,-2.54387 27.94899,5.99688");
	path3765.attr({id: 'path3765',parent: 'layer1',fill: '#007c00',"fill-opacity": '1',"fill-rule": 'nonzero',stroke: '#000000',"stroke-width": '2',"stroke-linecap": 'butt',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',"stroke-dashoffset": '0'});
	path3765.transform(scale + "t-253.01455,-428.01768 m0.66325201,0.64105344,-0.40719201,0.46935592,313.59984,-8.696812").data('id', 'path3765');
	var path3767 = rsr.path("m 274,532.36218 c 0,0 -25.09295,-51.02812 -19,-71 4.9069,-16.08416 22.34794,-29.65767 39,-32 15.81993,-2.22528 33.84334,6.66856 44,19 11.92976,14.4842 12,62 12,62 l -5,-6 c 0,0 -1.92461,-39.286 -14,-53 -8.79474,-9.98817 -23.83832,-16.97008 -37,-15 -13.59226,2.03453 -28.15744,12.80441 -32,26 -5.3048,18.217 7.08429,37.25156 16,54 4.11326,7.72689 -4,16 -4,16 z");
	path3767.attr({id: 'path3767',parent: 'layer1',fill: '#007c00',"fill-opacity": '1',stroke: '#000000',"stroke-width": '2',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
	path3767.transform(scale + "t-253.01455,-428.01768").data('id', 'path3767');
	g3769.attr({'id': 'g3769','transformG': 'translate(-253.01455,-428.01768)','parent': 'layer1','name': 'g3769'});g3769.transform("m1.5239862,0,0,1.5203794,-132.59274,-222.73282");
	var rsrGroups = [layer1,g3769];
}