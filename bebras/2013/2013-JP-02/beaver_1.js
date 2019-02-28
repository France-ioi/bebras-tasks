
function loadBeaver1(id, mode) {
   var rsr = Raphael(id, '50', '90');
	beaver1Objects(rsr, "s0.6,0.6,0,0", mode);
}

function beaver1Objects(paperRaph,scale, mode)
{
	var rsr = paperRaph; 
   var layer1 = rsr.set();
   var listElems = [];

   if (mode != "onlyLetter") {
      var path3011 = rsr.path("m 39.802705,89.827369 c 0,0 -50.029927,-37.771307 -24.23324,-62.413833 25.79668,-24.6425265 35.959,63.154648 35.959,63.154648 z");
      path3011.attr({id: 'path3011',parent: 'layer1',fill: '#e58f56',"fill-opacity": '1',stroke: '#000000',"stroke-width": '1.27',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1',"stroke-miterlimit": '4',"stroke-dasharray": 'none'});
      path3011.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path3011');
      var path6643 = rsr.path("m 77.865658,79.034363 c 4.10115,0.40151 8.4987,-6.66654 -0.59231,-11.88215 -1.55941,-7.61657 1.1954,-13.79398 -9.99632,-16.2883 -8.366566,-0.24844 -5.889696,14.56271 -5.889696,14.56271 2.00985,6.34745 8.824636,12.53186 16.478326,13.60774 z");
      path6643.attr({id: 'path6643',parent: 'layer1',fill: '#e58f56',"fill-opacity": '1',stroke: '#000000',"stroke-width": '1.25',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6643.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6643');
      var path6645 = rsr.path("m 61.863042,72.937263 c 0,0 15.523176,6.35084 9.741656,19.45986 0,0 8.12612,1.39349 8.82386,6.70617 1.00251,7.633257 -9.8235,6.380837 -18.052136,5.304617 -6.22028,-0.81354 -3.20294,-9.454297 -4.93046,-11.516537 -5.04159,-6.01847 -4.5366,-19.82403 4.41708,-19.95411 z");
      path6645.attr({id: 'path6645',parent: 'layer1',fill: '#e58f56',"fill-opacity": '1',stroke: '#000000',"stroke-width": '1.5',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6645.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6645');
      var path6649 = rsr.path("m 44.379352,47.164553 c 0,0 -11.74477,11.30014 -7.42258,34.04045 1.41949,4.05875 8.93009,18.895967 17.71287,11.94265 29.211286,-0.0422 21.468676,-39.73944 12.165026,-46.79165 -16.996166,-28.57701 -22.455316,0.80855 -22.455316,0.80855 z");
      path6649.attr({id: 'path6649',parent: 'layer1',fill: '#e58f56',"fill-opacity": '1',stroke: '#000000',"stroke-width": '1.5',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6649.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6649');
      var path6687 = rsr.path("m 59.038142,88.984393 c 0,0 2.23152,1.73773 -1.61615,6.73692 0,0 10.010056,4.426027 8.046516,10.018907 -1.978016,5.63418 -10.766096,4.84577 -24.222126,-1.38702 -6.20455,-2.87392 -5.3582,-8.886517 -2.48738,-11.974377 2.19726,-2.36337 -1.34883,-6.49788 -1.9153,-12.72299");
      path6687.attr({id: 'path6687',parent: 'layer1',fill: '#e58f56',"fill-opacity": '1',stroke: '#000000',"stroke-width": '1.5',"stroke-linecap": 'round',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6687.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6687');
      var path6651 = rsr.path("m 47.701082,40.998543 c 0,0 0.19032,35.48093 7.24475,43.15685 3.98428,4.33529 12.177896,2.62265 14.349336,1.58547 3.92983,-1.87709 4.29213,-8.26482 4.29213,-8.26482 0,0 5.4642,-16.65076 -10.297436,-38.17251 -17.97892,-24.54933 -15.58878,1.69501 -15.58878,1.69501 z");
      path6651.attr({id: 'path6651',parent: 'layer1',fill: '#ffad76',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',display: 'inline'});
      path6651.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6651');
      var path6653 = rsr.path("m 64.457918,14.251493 c 0,0 1.49038,-15.24277988 -5.699256,-9.3111999 -2.04289,1.68541 1.41015,9.0041699 1.41015,9.0041699 z");
      path6653.attr({id: 'path6653',parent: 'layer1',fill: '#e58f56',"fill-opacity": '1',stroke: '#000000',"stroke-width": '1.38',"stroke-linecap": 'round',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6653.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6653');
      var path6655 = rsr.path("m 74.864058,32.236743 c 0,0 3.35058,-21.34937 -18.928156,-21.02843 -11.34507,0.16341 -19.8661,5.70733 -19.39981,19.75872 0,0 -9.3607,16.46451 10.45703,23.96047 0,0 11.37078,2.99434 23.451176,-0.48642 0,0 18.75239,-6.658 4.41976,-22.20434 z");
      path6655.attr({id: 'path6655',parent: 'layer1',fill: '#e58f56',"fill-opacity": '1',stroke: '#000000',"stroke-width": '1.5',"stroke-linecap": 'round',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6655.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6655');
      var path6657 = rsr.path("m 66.439438,23.668593 c 0,0 -2.1666,-1.11979 -2.31693,2.03765 -0.100066,2.09687 0.12335,3.53833 2.1251,3.44965 1.98343,-0.0878 1.55841,-3.14969 1.55841,-3.14969 0,0 -0.23331,-2.33761 -1.36658,-2.33761 z");
      path6657.attr({id: 'path6657',parent: 'layer1',fill: '#000000',stroke: '#000000',"stroke-width": '1.15',"stroke-linecap": 'round',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6657.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6657');
      var path6659 = rsr.path("m 79.544908,41.591013 c 0,0 -10.8026,13.1784 -19.745346,-2.17649");
      path6659.attr({id: 'path6659',parent: 'layer1',fill: '#ffad76',"fill-opacity": '1',stroke: '#000000',"stroke-width": '1.27',"stroke-linecap": 'round',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6659.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6659');
      var path6661 = rsr.path("m 60.720212,39.599633 c 0,0 -2.85461,-9.036 8.621506,-7.84882 0,0 7.39929,1.84329 8.75823,5.39353 2.37652,6.20903 2.96795,4.76463 2.96795,4.76463");
      path6661.attr({id: 'path6661',parent: 'layer1',fill: '#ffad76',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',display: 'inline'});
      path6661.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6661');
      var path6663 = rsr.path("m 66.595728,35.382123 c 0,0 -11.463796,-5.63208 -22.548036,-7.94685");
      path6663.attr({id: 'path6663',parent: 'layer1',fill: 'none',stroke: '#000000',"stroke-width": '1.38',"stroke-linecap": 'round',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6663.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6663');
      var path6665 = rsr.path("m 66.181838,37.732363 c 0,0 -21.991906,-1.6445 -22.731896,-1.2706");
      path6665.attr({id: 'path6665',parent: 'layer1',fill: 'none',stroke: '#000000',"stroke-width": '1.38',"stroke-linecap": 'round',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6665.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6665');
      var path6667 = rsr.path("m 65.934128,40.708853 -21.394976,5.01353");
      path6667.attr({id: 'path6667',parent: 'layer1',fill: 'none',stroke: '#000000',"stroke-width": '1.38',"stroke-linecap": 'round',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6667.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6667');
      var path6673 = rsr.path("m 57.269332,12.058293 c 0,0 -3.21707,-13.6550199 -9.43103,-6.6657199 -1.76565,1.98596 2.82623,7.5816799 2.82623,7.5816799");
      path6673.attr({id: 'path6673',parent: 'layer1',fill: '#e58f56',"fill-opacity": '1',stroke: '#000000',"stroke-width": '1.5',"stroke-linecap": 'round',"stroke-linejoin": 'round',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6673.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6673');
      var path6685 = rsr.path("m 49.383222,82.004453 c 4.03183,0.85152 9.18232,-5.68822 0.72223,-11.87497 -0.70958,-7.74212 2.70995,-13.57788 -8.13826,-17.29172 -8.28809,-1.16998 -7.46041,13.82402 -7.46041,13.82402 1.29729,6.53044 7.38817,13.42895 14.87644,15.34267 z");
      path6685.attr({id: 'path6685',parent: 'layer1',fill: '#e58f56',"fill-opacity": '1',stroke: '#000000',"stroke-width": '1.31',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',display: 'inline'});
      path6685.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path6685');
      var path3015 = rsr.path("m 75.027094,34.116773 c 0.03109,4.532351 3.15848,7.958389 5.627904,8.036592 1.157714,-3.017266 3.031588,-5.714369 0.715419,-8.986372 -1.744859,-1.320309 -4.474577,-0.197078 -6.343323,0.94978 z");
      path3015.attr({id: 'path3015',parent: 'layer1',fill: '#000000',"fill-opacity": '1',stroke: '#000000',"stroke-width": '0.13',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1'});
      path3015.transform(scale + "t-2.1014418,-2.6536698").data('id', 'path3015');

      listElems = [path3011, path6643 ,  path6645,  path6649 ,  path6687 ,  path6651 ,  path6653 ,  path6655 ,  path6657 ,  path6659 ,  path6661 ,  path6663 ,  path6665 ,  path6667 ,  path6673 ,  path6685 ,  path3015 ];
   }

   if (mode == "onlyLetter") {
      var text = rsr.text(45, 50, "A");
      text.attr({"font-size": "74"});
      text.transform(scale);
      listElems.push(text);
   }

   if (mode == "withLetter") {
      var text = rsr.text(50, 130, "A");
      text.attr({"font-size": "40"});
      text.transform(scale);
      listElems.push(text);
   }

   return listElems;
}
