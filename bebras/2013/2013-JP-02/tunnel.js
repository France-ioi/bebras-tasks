function loadTunnel(id, color) {

   var rsr = Raphael(id, '130', '90');
   tunnelObjects(rsr, color, "s0.6,0.6,0,0");
}	

function tunnelObjects(paperRaph, color, scale)
{
	var rsr = paperRaph;
   var layer1 = rsr.set();
   var path40948 = rsr.path("m 898.02291,727.94637 c 0,0 138.67789,2.60097 158.54699,2.25 0,0 -54.9779,-105.53845 2.4211,-102.89976 7.5489,0.34702 9.2268,23.25465 8.9103,92.56443 -0.01,2.26118 -10.8314,10.58533 -10.8314,10.58533");
   path40948.attr({id: 'path4094-8',parent: 'layer1',fill: '#808080',stroke: '#000000',"stroke-width": '1.12',"stroke-linecap": 'round',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
   path40948.transform(scale + "t-871.2383,-615.46313").data('id', 'path40948');
   var path4096 = rsr.path("m 872.39539,731.32423 c 0,0 -4.0905,-103.94829 11.14301,-113.57313 4.43092,-2.79954 176.3844,-1.1846 176.3844,-1.1846 0,0 -6.2724,2.72741 -3.0808,113.71416");
   path4096.attr({id: 'path4096',parent: 'layer1',fill: color,stroke: '#000000',"stroke-width": '1.3',"stroke-linecap": 'round',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
   path4096.transform(scale + "t-871.2383,-615.46313").data('id', 'path4096');
   var path4094 = rsr.path("m 871.97223,731.32423 c 0,0 160.23397,-0.46148 185.05897,0 0,0 -3.2699,-114.10685 3.1031,-114.75773 17.8093,-1.81887 12.7705,82.14283 13.0526,96.20991 0.1326,6.61294 -16.1557,18.54782 -16.1557,18.54782");
   path4094.attr({id: 'path4094',parent: 'layer1',fill: 'none',stroke: '#000000',"stroke-width": '1.3',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
   path4094.transform(scale + "t-871.2383,-615.46313").data('id', 'path4094');
   layer1.attr({'id': 'layer1','name': 'layer1'});layer1.transform(scale + "t-871.2383,-615.46313");

	return [path40948, path4096, path4094];	
}


