var paths = [];
var texts = [];

var neighbors = [
   [1, 16, 15, 3, 18, 2, 5, 4],
   [0, 16, 17, 13, 12, 3, 2, 9, 8, 4],
   [0, 5, 6, 10, 9, 1, 3, 18],
   [0, 18, 2, 1, 12, 11, 15],
   [0, 1, 8, 7, 5],
   [0, 4, 7, 6, 2],
   [5, 7, 10, 2],
   [4, 8, 10, 6, 5],
   [1, 9, 10, 7, 4],
   [1, 2, 10, 8],
   [2, 6, 7, 8, 9],
   [3, 12, 13, 14, 15],
   [1, 13, 11, 3],
   [1, 17, 14, 11, 12],
   [11, 13, 17, 16, 15],
   [0, 3, 11, 14, 16],
   [0, 15, 14, 17, 1],
   [1, 16, 14, 13],
   [0, 2, 3]
];

function checkNeighborsValid() {
   var matrix = [];
   for (var iArea = 0; iArea < 19; iArea++) {
      matrix[iArea] = [];
      for (var iArea2 = 0; iArea2 < 19; iArea2++) {
         matrix[iArea][iArea2] = 0;
      }
   }
   for (var iArea = 0; iArea < 19; iArea++) {
      for (var iNeighbor = 0; iNeighbor < neighbors[iArea].length; iNeighbor++) {
         var neighbor = neighbors[iArea][iNeighbor];
         matrix[iArea][neighbor]++;
         matrix[neighbor][iArea]++;
      }
   }
   for (var iArea = 0; iArea < 19; iArea++) {
      for (var iArea2 = 0; iArea2 < 19; iArea2++) {
         var nb = matrix[iArea][iArea2];
         if ((nb != 2) && (nb != 0)) {
            alert("invalid matrix");
         }
      }
   }
//   console.log(JSON.stringify(matrix));
}

function checkNeighbors(answer) {
   for (var iArea = 0; iArea < 19; iArea++) {
      var color1 = answer[iArea];
      for (var iNeighbor = 0; iNeighbor < neighbors[iArea].length; iNeighbor++) {
         var neighbor = neighbors[iArea][iNeighbor];
         var color2 = answer[neighbor];
         if ((color1 != 0) && (color2 != 0) && (color1 == color2))
            return false;
      }
   }
   return true;
}

function loadCircle(id) {
   var rsr = Raphael(id, '410', '410');

   var scale = "s0.8,0.8,0,0";
   var textTrans = "t10,-7";
/*
   params = [
      {color: "red", letter: "0"},
      {color: "blue", letter: "1"},
      {color: "green", letter: "2"},
      {color: "yellow", letter: "3"},
      {color: "green", letter: "4"},
      {color: "blue", letter: "5"},
      {color: "red", letter: "6"},
      {color: "yellow", letter: "7"},
      {color: "red", letter: "8"},
      {color: "yellow", letter: "9"},
      {color: "blue", letter: "10"},
      {color: "red", letter: "11"},
      {color: "green", letter: "12"},
      {color: "yellow", letter: "13"},
      {color: "green", letter: "14"},
      {color: "blue", letter: "15"},
      {color: "yellow", letter: "16"},
      {color: "red", letter: "17"},
      {color: "blue", letter: "18"}
   ];
*/
   var params = [];
   for (var iParam = 0; iParam < 19; iParam++) {
      params[iParam] = {color: "white", letter: ""};
   }
   var layer1 = rsr.set();
   var circle = rsr.circle(254, 250, 240);
   circle.attr({fill: "black"});
   circle.transform(scale);

   paths[0] = rsr.path("M 358.04112,742.68406 C 279.30406,736.94434 209.37879,696.00267 165.48111,629.93901 99.513628,530.66148 112.58915,399.04306 196.87092,313.96869 c 37.94071,-38.29752 86.38318,-63.04066 140.95743,-71.99734 16.60334,-2.72492 58.92858,-2.72492 75.53192,0 91.80225,15.06651 167.24185,76.81435 198.91731,162.81522 10.24778,27.8234 14.83708,54.48184 14.86059,86.32265 0.0228,30.77979 -3.38669,52.06473 -12.93678,80.76418 -26.43326,79.4359 -94.2499,142.59008 -175.39079,163.33253 -24.92038,6.37052 -56.21576,9.26804 -80.76948,7.47813 l 0,0 z m 40.73341,-23.43556 c 43.20328,-4.66744 80.21441,-19.23623 115.40859,-45.42862 12.6844,-9.44005 33.81037,-30.26587 43.0657,-42.45385 43.76386,-57.63092 58.30736,-128.55173 40.70538,-198.49824 -19.27419,-76.59156 -81.93251,-141.16784 -157.99819,-162.83452 -82.06468,-23.37543 -166.9437,-1.37058 -227.2866,58.92396 -43.05075,43.01624 -66.86232,100.57374 -66.86232,161.62008 0,61.53374 23.68195,118.4742 67.49749,162.28974 37.81812,37.81813 84.68418,60.37265 137.82165,66.32734 11.67923,1.30881 35.78113,1.33617 47.6483,0.0541 l 0,-4e-5 z");
   paths[0].attr({id: 'path3823',parent: 'layer1',fill: params[0].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[0].transform(scale + "t-121.85521,-238.18085").data('id', 'path3823');
   paths[1] = rsr.path("M 244.56136,245.24594 230.46053,239.33625 206.82707,137.63871 C 193.82867,81.705075 183.55473,35.583978 183.99609,35.14739 c 0.44135,-0.436586 5.79589,-2.089109 11.89895,-3.672274 33.75081,-8.755116 68.48463,-9.680744 103.67624,-2.762886 11.93613,2.346366 41.06356,11.512749 44.44858,13.987935 1.83431,1.34128 -0.17458,8.485932 -27.38329,97.389485 l -29.36283,95.94201 -13.01342,7.6182 c -7.15738,4.19001 -13.59498,7.59291 -14.30578,7.56199 -0.71079,-0.0309 -7.63772,-2.71558 -15.39318,-5.96591 l 0,0 z");
   paths[1].attr({id: 'path3866',parent: 'layer1',fill: params[1].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[1].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3866');
   paths[2] = rsr.path("M 125.6656,441.39353 C 108.55887,429.89588 85.161969,407.54678 71.646586,389.79367 57.798849,371.60399 45.154534,347.95006 37.519131,325.95088 c -3.149257,-9.07367 -3.570765,-11.29105 -2.297263,-12.08493 0.857821,-0.53476 36.908958,-14.11978 80.113632,-30.18894 43.20468,-16.06916 79.57669,-29.67316 80.82669,-30.23113 1.25,-0.55796 9.0789,-3.56802 17.39755,-6.68903 l 15.12482,-5.67456 15.13178,6.32254 15.13177,6.32254 0.82122,18.12135 c 0.65498,14.45295 0.51102,18.51042 -0.71114,20.04337 -1.22157,1.53221 -125.47619,148.59844 -128.16182,151.69075 -0.40005,0.46062 -2.75389,-0.52456 -5.23077,-2.18931 l 0,0 z");
   paths[2].attr({id: 'path3868',parent: 'layer1',fill: params[2].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[2].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3868');
   paths[3] = rsr.path("m 317.5267,368.98729 -54.77185,-77.70631 -0.78817,-18.6626 -0.78816,-18.6626 13.2563,-7.69784 13.25631,-7.69784 92.63833,37.88808 92.63836,37.88807 -0.64484,3.39762 c -3.29455,17.35891 -24.40504,58.08086 -39.83086,76.83336 -6.60996,8.03545 -27.74351,29.08203 -35.76175,35.61459 -7.92688,6.45813 -22.36988,16.55011 -23.65137,16.52628 -0.42924,-0.008 -25.42778,-34.98234 -55.5523,-77.72081 l 0,0 z");
   paths[3].attr({id: 'path3870',parent: 'layer1',fill: params[3].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[3].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3870');
   paths[4] = rsr.path("m 79.259953,145.45326 c -9.92123,-6.74849 -18.294282,-12.52565 -18.606782,-12.83815 -1.736563,-1.73657 13.73719,-22.20679 28.608436,-37.846084 17.349303,-18.245339 37.170223,-33.155744 59.849513,-45.022137 14.68656,-7.684392 30.39108,-13.933656 31.58102,-12.566957 0.86668,0.995437 10.40905,41.795736 10.37405,44.356374 -0.0144,1.053934 -88.5396,73.275944 -92.562966,75.516154 -0.662568,0.36892 -9.322039,-4.85072 -19.243271,-11.5992 z");
   paths[4].attr({id: 'path3872',parent: 'layer1',fill: params[4].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[4].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3872');
   paths[5] = rsr.path("m 31.995158,307.23398 c -8.469503,-29.9347 -8.445875,-76.01648 0.05635,-109.89993 4.687105,-18.67926 15.207845,-44.70422 23.303919,-57.64647 l 3.334507,-5.33049 17.585158,11.90679 c 9.671836,6.54873 18.019817,12.34145 18.551068,12.8727 0.733898,0.7339 -15.781967,135.53315 -16.659924,135.97503 -1.003918,0.5053 -44.10575,16.38373 -44.473434,16.38373 -0.27058,0 -1.034519,-1.91761 -1.697643,-4.26136 z");
   paths[5].attr({id: 'path3874',parent: 'layer1',fill: params[5].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[5].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3874');
   paths[6] = rsr.path("m 81.284523,289.05216 c 0.364654,-2.34375 2.502933,-18.57955 4.751732,-36.07955 2.248799,-17.5 4.177378,-31.9121 4.285731,-32.02688 0.425281,-0.45053 50.679304,4.89628 51.234114,5.45109 0.81071,0.81072 -15.24057,48.99544 -16.83908,50.5496 -1.25668,1.22182 -41.271759,16.41811 -43.143348,16.3843 -0.523686,-0.009 -0.653804,-1.93481 -0.289149,-4.27856 z");
   paths[6].attr({id: 'path3876',parent: 'layer1',fill: params[6].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[6].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3876');
   paths[7] = rsr.path("m 115.82869,221.26579 c -12.93342,-1.34476 -23.89254,-2.82225 -24.353597,-3.28331 -1.294421,-1.29442 6.128098,-56.73341 7.79762,-58.24064 5.281507,-4.76807 48.711617,-39.15559 49.452007,-39.15559 0.50532,0 3.99825,9.58807 7.76208,21.30682 l 6.84331,21.30681 -10.10161,30.39773 c -7.9826,24.02122 -10.49838,30.36789 -11.99305,30.25546 -1.04029,-0.0782 -12.47333,-1.24252 -25.40676,-2.58728 z");
   paths[7].attr({id: 'path3878',parent: 'layer1',fill: params[7].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[7].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3878');
   paths[8] = rsr.path("m 164.22406,158.35988 c -11.10939,-34.03131 -12.94797,-40.64908 -11.57742,-41.67165 0.89611,-0.66859 9.77529,-7.72483 19.73151,-15.68053 9.95622,-7.955706 18.61359,-14.351979 19.23859,-14.213944 0.88335,0.195093 24.74544,98.738824 24.03536,99.259264 -0.0944,0.0692 -8.73289,2.96919 -19.19653,6.44437 l -19.02481,6.31853 -13.2067,-40.45604 z");
   paths[8].attr({id: 'path3880',parent: 'layer1',fill: params[8].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[8].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3880');
   paths[9] = rsr.path("m 193.93873,249.96551 c -6.46557,-18.4851 -15.34823,-48.03583 -14.63387,-48.68379 1.82152,-1.65222 36.08333,-12.49147 36.83695,-11.65394 0.87025,0.96713 11.3067,45.41514 11.27139,48.00392 -0.0156,1.14281 -4.98163,3.53495 -15.06895,7.25871 -8.27513,3.05479 -15.68059,5.7925 -16.45657,6.08381 -0.77598,0.29131 -1.65301,-0.16261 -1.94895,-1.00871 l 0,0 z");
   paths[9].attr({id: 'path3882',parent: 'layer1',fill: params[9].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[9].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3882');
   paths[10] = rsr.path("m 128.57936,275.40659 c 0.11652,-3.1895 36.2582,-107.3067 36.78021,-105.95671 2.8551,7.38363 26.63439,82.38794 26.24396,82.77836 -0.27546,0.27547 -12.65791,5.03433 -27.51654,10.57525 -14.85864,5.54093 -28.93332,10.83306 -31.27707,11.76029 -2.34375,0.92724 -4.2475,1.3065 -4.23056,0.84281 z");
   paths[10].attr({id: 'path3884',parent: 'layer1',fill: params[10].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[10].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3884');
   paths[11] = rsr.path("m 393.90749,280.05575 c -26.29456,-10.79238 -47.95164,-19.76585 -48.12684,-19.94105 -0.43949,-0.43949 6.83469,-26.46232 7.39752,-26.46407 0.24927,-7.8e-4 18.68894,4.97061 40.97705,11.04753 22.28811,6.07692 40.65425,10.91853 40.81364,10.75914 0.22903,-0.22903 3.07284,16.62437 7.1372,42.29742 0.16975,1.07225 0.15138,1.94369 -0.0408,1.93653 -0.1922,-0.007 -21.86319,-8.84313 -48.15775,-19.6355 l 10e-6,0 z");
   paths[11].attr({id: 'path3888',parent: 'layer1',fill: params[11].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[11].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3888');
   paths[12] = rsr.path("m 316.14238,248.19069 c -14.82224,-6.09518 -26.95206,-11.29283 -26.95514,-11.55034 -0.0165,-1.38053 5.75042,-19.05404 6.16873,-18.90486 0.26854,0.0958 12.87357,3.53973 28.01118,7.65323 15.13762,4.11351 27.61166,7.55441 27.72009,7.64646 0.38053,0.32303 -7.06218,26.30175 -7.52613,26.26988 -0.25805,-0.0177 -12.59648,-5.01919 -27.41873,-11.11437 z");
   paths[12].attr({id: 'path3890',parent: 'layer1',fill: params[12].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[12].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3890');
   paths[13] = rsr.path("m 343.14562,229.27622 c -26.20899,-7.16498 -47.69504,-13.08582 -47.74677,-13.1574 -0.12219,-0.16911 16.57481,-54.48589 16.8263,-54.73738 0.10513,-0.10514 14.43423,14.30591 31.84244,32.02455 45.05164,45.85501 48.05932,48.96235 47.35893,48.92815 -0.34549,-0.0169 -22.0719,-5.89293 -48.2809,-13.05792 l 0,0 z");
   paths[13].attr({id: 'path3892',parent: 'layer1',fill: params[13].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[13].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3892');
   paths[14] = rsr.path("M 414.92791,248.84787 395.47948,243.5116 365.3011,212.77766 c -16.59811,-16.90367 -30.17907,-30.94037 -30.1799,-31.19266 -0.002,-0.51304 49.3633,-51.14679 49.86517,-51.14679 0.17544,0 7.64436,6.52621 16.59759,14.5027 8.95324,7.97648 16.80002,14.94323 17.43731,15.48165 1.11759,0.94421 1.41617,2.58241 8.4137,46.16244 3.99024,24.85091 7.36504,45.75114 7.49955,46.44495 0.13451,0.69381 0.0639,1.23733 -0.15682,1.20783 -0.22075,-0.0295 -9.15316,-2.45496 -19.84979,-5.38991 z");
   paths[14].attr({id: 'path3894',parent: 'layer1',fill: params[14].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[14].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3894');
   paths[15] = rsr.path("m 459.01094,306.56123 c -11.47481,-4.75067 -14.35017,-6.27896 -14.8762,-7.90687 -1.33511,-4.13179 -22.10492,-136.50235 -21.51127,-137.09601 0.92382,-0.92382 33.11931,-15.46022 33.4684,-15.11112 1.09611,1.0961 10.15275,21.54023 12.68624,28.63745 10.82279,30.31853 15.39566,64.81227 12.68567,95.68966 -1.43762,16.3801 -6.12033,41.92212 -7.65292,41.74307 -0.31668,-0.037 -6.97665,-2.71727 -14.79992,-5.95618 z");
   paths[15].attr({id: 'path3896',parent: 'layer1',fill: params[15].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[15].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3896');
   paths[16] = rsr.path("m 378.0357,121.51393 c -23.23804,-20.69237 -42.11613,-37.858314 -41.9513,-38.146554 0.16482,-0.288241 2.90854,-9.058557 6.09715,-19.489592 3.18861,-10.431034 5.93095,-19.106039 6.09409,-19.277789 0.6765,-0.712193 21.42392,10.862771 31.42495,17.531951 23.22991,15.490841 44.61654,36.307881 60.81865,59.198874 8.07539,11.40924 14.51207,22.31532 13.6358,23.10401 -1.17229,1.05512 -31.65827,14.71483 -32.82519,14.70783 -0.57373,-0.003 -20.0561,-16.93637 -43.29415,-37.62873 l 0,0 z");
   paths[16].attr({id: 'path3898',parent: 'layer1',fill: params[16].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[16].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3898');
   paths[17] = rsr.path("m 323.28179,169.58662 -10.29811,-10.38356 11.02509,-36.02471 c 6.0638,-19.81359 11.16628,-36.169759 11.33885,-36.347048 0.33802,-0.347271 47.65064,41.415928 47.7312,42.132688 0.0267,0.23707 -11.0997,11.81044 -24.72523,25.71861 l -24.77369,25.28757 -10.29811,-10.38355 z");
   paths[17].attr({id: 'path3900',parent: 'layer1',fill: params[17].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[17].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3900');
   paths[18] = rsr.path("m 231.42473,480.14875 c -24.32096,-2.84999 -47.45731,-8.91203 -68.10345,-17.84402 -8.38739,-3.62857 -24.68552,-12.12742 -29.36663,-15.31356 l -2.0119,-1.36938 47.76756,-56.38924 c 26.27215,-31.01409 55.3474,-65.34654 64.61168,-76.29435 l 16.84412,-19.9051 1.92141,2.66372 c 1.05677,1.46505 25.73706,36.41372 54.84509,77.66372 l 52.92368,75 -3.98302,2.52016 c -6.28959,3.97957 -25.49854,12.92638 -35.87957,16.71136 -10.74761,3.91863 -30.30998,8.91678 -43.10345,11.01286 -8.25234,1.35205 -48.67146,2.45716 -56.46552,1.54383 z");
   paths[18].attr({id: 'path3902',parent: 'layer1',fill: params[18].color,"fill-opacity": '1',stroke: '#000000',"stroke-width": '2.86',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   paths[18].transform(scale + "t-121.85521,-238.18085 t121.85521,238.18085").data('id', 'path3902');

   
   texts[0] = rsr.text(569.07745, 628.28558, params[0].letter);
   texts[0].attr({id: 'text3904',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[0].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text3904');
   texts[1] = rsr.text(369.51666, 378.62762, params[1].letter);
   texts[1].attr({id: 'text3904-1',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[1].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text39041');
   texts[2] = rsr.text(270.4426, 571.22021, params[2].letter);
   texts[2].attr({id: 'text3904-4',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[2].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text39044');
   texts[3] = rsr.text(469.51666, 577.70172, params[3].letter);
   texts[3].attr({id: 'text3904-9',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[3].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text39049');
   texts[4] = rsr.text(243.59076, 343.44244, params[4].letter);
   texts[4].attr({id: 'text3904-8',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[4].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text39048');
   texts[5] = rsr.text(170.44258, 472.14612, params[5].letter);
   texts[5].attr({id: 'text3904-2',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[5].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text39042');
   texts[6] = rsr.text(220.44258, 502.70169, params[6].letter);
   texts[6].attr({id: 'text3904-5',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[6].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text39045');
   texts[7] = rsr.text(236.18333, 431.4054, params[7].letter);
   texts[7].attr({id: 'text3904-7',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[7].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text39047');
   texts[8] = rsr.text(298.22037, 398.07208, params[8].letter);
   texts[8].attr({id: 'text3904-52',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[8].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text390452');
   texts[9] = rsr.text(317.66483, 469.36835, params[9].letter);
   texts[9].attr({id: 'text3904-14',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[9].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text390414');
   texts[10] = rsr.text(275.99814, 484.1832, params[10].letter);
   texts[10].attr({id: 'text3904-3',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[10].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text39043');
   texts[11] = rsr.text(504.70187, 512.8869, params[11].letter);
   texts[11].attr({id: 'text3904-16',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[11].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text390416');
   texts[12] = rsr.text(439.88705, 489.73871, params[12].letter);
   texts[12].attr({id: 'text3904-76',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[12].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text390476');
   texts[13] = rsr.text(435.25742, 451.77579, params[13].letter);
   texts[13].attr({id: 'text3904-92',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[13].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text390492');
   texts[14] = rsr.text(499.1463, 438.81284, params[14].letter);
   texts[14].attr({id: 'text3904-54',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[14].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text390454');
   texts[15] = rsr.text(567.66486, 471.22021, params[15].letter);
   texts[15].attr({id: 'text3904-12',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[15].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text390412');
   texts[16] = rsr.text(505.62778, 352.70169, params[16].letter);
   texts[16].attr({id: 'text3904-41',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[16].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text390441');
   texts[17] = rsr.text(452.85001, 385.1091, params[17].letter);
   texts[17].attr({id: 'text3904-87',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[17].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text390487');
   texts[18] = rsr.text(367.66483, 648.99799, params[18].letter);
   texts[18].attr({id: 'text3904-77',parent: 'layer1',"font-size": '30px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   texts[18].transform(textTrans + scale + "t-121.85521,-238.18085").data('id', 'text390477');
   layer1.attr({'id': 'layer1','name': 'layer1'});layer1.transform(scale + "t-121.85521,-238.18085");

   for (var iArea = 0; iArea < 19; iArea++) {
      paths[iArea].node.id = "path" + iArea;
      texts[iArea].node.id = "text" + iArea;
      setClickArea(iArea);
      selectedColors[iArea] = 0;
   }

   // debug edges
   /*
   for (var iArea1 = 0; iArea1 < 19; iArea1++) {
      for (var iArea2 = 0; iArea2 < 19; iArea2++) {
         rsr.path("M " + texts[iArea1].x +","+ texts[iArea1].y + "L " + texts[iArea2].x +","+ texts[iArea2].y)
            .attr({stroke:'black', "stroke-with":2});   
      }
   }
   */
}

function setClickArea(iArea) {
   $("#path" + iArea + ",#text" + iArea).mousedown(function() { clickArea(iArea) });
}

function clickArea(iArea, fakeClick) {
   var col = currentColor;
   if (selectedColors[iArea] == col) 
     col = 0;
   if (selectedColors[iArea] != 0) {
      nbPiecesToColor++;
   }
   if (col != 0) {
      nbPiecesToColor--;
   }
   selectedColors[iArea] = col;
   paths[iArea].animate({fill: colors[col]}, 200);      
   texts[iArea].attr("text", colorsLetters[col]);   
   $("#success").html("");
   $("#nbPiecesToColor").html(nbPiecesToColor);
   if (checkNeighbors(selectedColors)) {
      $("#error").html("");
      if (nbPiecesToColor == 0) {
         if (!fakeClick) {
            $("#success").html("Bravo ! Vous avez tout colorié correctement.");
            platform.validate("done", function(){});
         }
      }
      else if (nbPiecesToColor == 1 && selectedColors[0] == 0) {
        $("#error").html("N'oubliez pas de colorier le contour du vitrail !");
      }
   } else {
      $("#error").html("Attention : des morceaux qui se touchent ont la même couleur !");
   }
}

