var dirs = [[0,-1],[-1,0],[0,1],[1,0]];

var letters = 
    [["ACB?", "BDEC", "EABC", "BDE?", "ECAD", "ABD?"],
     ["A?BD", "BC??", "?CBD", "B??E", "?DA?", "A?BE"],
     ["AD?B", "??CB", "CDB?", "BED?", "D??C", "?EDB"],
     ["CBAD", "AB?D", "??CD", "C?AB", "ACDE", "DBEA"]];

// for(var i = 1; i < letters.length; i++)
//     for(var j = 0; j < letters[0].length; j++)
//         if(letters[i][j].charAt(1) != letters[i-1][j].charAt(3))
//             alert(i + " " + j + "A" + letters[i][j].charAt(1) + letters[i-1][j].charAt(3));

// for(var i = 0; i < letters.length; i++)
//     for(var j = 1; j < letters[0].length; j++)
//         if(letters[i][j].charAt(0) != letters[i][j-1].charAt(2))
//             alert(i + " " + j + "B" + letters[i][j].charAt(0) + letters[i][j-1].charAt(2));

// for(var i = 0; i < letters.length; i++)
//     for(var j = 1; j < letters[0].length; j++)
//         for(var k = 1; k < 4; k++)
//             for(var k2 = 0; k2 < k; k2++)
//                 if(letters[i][j].charAt(k2) == letters[i][j].charAt(k) &&
//                    letters[i][j].charAt(k2) != '?')
//                     alert("C");

var setIntervalHandle = null;
function reinit() {
    if(setIntervalHandle != null)
        clearInterval(setIntervalHandle);
    hidePrince();
}

function checkCommand(command) {
   if(command.length > 50) {
      return "La séquence des portes est trop longue ! Vous ne devez pas dépasser 50 caractères.";
   }
   for(var i = 0; i < command.length; i++)
      if(command.charAt(i) < "A" || command.charAt(i) > "E") {
        return "Un des caractères est invalide.";
   }
   return "";
}

function getDoor(lin, col, letter) {
   var ok = false;
   for(var door = 0; door < 4; door++) {
      if(letters[lin][col].charAt(door) == letter) {
         return door;
      }
   }
   return -1;
}

function execute() {
   if (typeof Tracker !== 'undefined') {Tracker.trackData({dataType:"clickitem", item:"execute"});}
   $("#error, #success").html("");
   reinit();
   var command = $("#answer").val();
   command = command.replace(/\s+/g, '').toUpperCase();
   var result = checkCommand(command);
   if (result != "") {
      $("#error").html(result);
      return;
   }
   var lin = 1, col = 0, pos = 1;
   if(getDoor(lin, col, command.charAt(0)) != 0) {
      $("#error").html("Le code de la première porte est mauvais.");
      return;
   }
   setPrinceAt(lin, col);

   setIntervalHandle = setInterval(function () {
      if(pos == command.length) {
         clearInterval(setIntervalHandle);
         if(lin == 2 && col == 5) {
            $("#success").html("Bravo ! Le prince est sauvé.");
            platform.validate("done", function(){});
         } else {
            $("#error").html("La princesse n'est pas arrivée à destination.")
         }
         return;
      }
      var door = getDoor(lin, col, command.charAt(pos));
      if(door < 0) {
         $("#error").html("Il n'y a pas de porte nommée " + command.charAt(pos) + " ici.");
         setIntervalHandle = clearInterval(setIntervalHandle);
         return;
      }
      lin += dirs[door][0];
      col += dirs[door][1];
      if(lin < 0 || col < 0 || lin >= letters.length || col >= letters[0].length) {
         $("#error").html("La princesse est tombée par la fenêtre !");
         // Cette porte ne mène nulle part
         setIntervalHandle = clearInterval(setIntervalHandle);
         return;
      }
      setPrinceAt(lin, col);
      pos++;
   }, 500);
}

var prince;
function setPrinceAt(lin, col) {
   prince.show();
   if(lin == 2 && col == 5) {
      lin = 1.85;
   }
   prince.transform("t"+(197+76.2*col)+","+(64.5+76*lin));
}
function hidePrince() {
   prince.hide();
}

function loadPalace() {
   var rsr = Raphael('palace', '700', '355.46103');
   RaphaelPalace = rsr;
   var layer1 = rsr.set();
   var rect307520 = rsr.rect(552.97864, 554.14209, 53.373497, 21.659224);
   rect307520.attr({id: 'rect3075-2-0',x: '552.97864',y: '554.14209',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect307520.transform("t13,-348.08075").data('id', 'rect307520');
   var rect30455 = rsr.rect(476.9202, 576.83392, 21.653875, 106.6189);
   rect30455.attr({y: '576.83392',x: '476.9202',id: 'rect3045-5',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect30455.transform("t13,-348.08075").data('id', 'rect30455');
   var rect30413 = rsr.rect(553.59625, 511.79559, 20.302231, 171.78983);
   rect30413.attr({id: 'rect3041-3',x: '553.59625',y: '511.79559',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect30413.transform("t13,-348.08075").data('id', 'rect30413');
   var rect30415 = rsr.rect(476.92969, 434.47592, 21.634903, 29.582102);
   rect30415.attr({id: 'rect3041-5',x: '476.92969',y: '434.47592',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect30415.transform("t13,-348.08075").data('id', 'rect30415');
   var rect30752 = rsr.rect(510.43713, 477.88156, 95.626274, 21.410641);
   rect30752.attr({id: 'rect3075-2',x: '510.43713',y: '477.88156',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect30752.transform("t13,-348.08075").data('id', 'rect30752');
   var rect303365 = rsr.rect(552.92841, 368.44403, 21.637903, 27.781513);
   rect303365.attr({y: '368.44403',x: '552.92841',id: 'rect3033-6-5',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1'});
   rect303365.transform("t13,-348.08075").data('id', 'rect303365');
   var text30435531 = rsr.text(557, 377.58917, 'B');
   text30435531.attr({id: 'text3043-55-3-1',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text30435531.transform("t13,-348.08075").data('id', 'text30435531');
   var rect30336 = rsr.rect(477.88608, 368.44403, 21.637903, 27.781513);
   rect30336.attr({y: '368.44403',x: '477.88608',id: 'rect3033-6',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1'});
   rect30336.transform("t13,-348.08075").data('id', 'rect30336');
   var rect3017 = rsr.rect(139.1411, 401.41876, 466.98782, 21.447979);
   rect3017.attr({id: 'rect3017',x: '139.1411',y: '401.41876',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3017.transform("t13,-348.08075").data('id', 'rect3017');
   var rect3033 = rsr.rect(400.92847, 368.44403, 21.637903, 27.781513);
   rect3033.attr({y: '368.44403',x: '400.92847',id: 'rect3033',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1'});
   rect3033.transform("t13,-348.08075").data('id', 'rect3033');
   var rect30018 = rsr.rect(385.44232, 385.83765, 52.610168, 52.610168);
   rect30018.attr({y: '385.83765',x: '385.44232',id: 'rect3001-8',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect30018.transform("t13,-348.08075").data('id', 'rect30018');
   var rect3027 = rsr.rect(171.39902, 368.44403, 21.637903, 27.781513);
   rect3027.attr({y: '368.44403',x: '171.39902',id: 'rect3027',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1'});
   rect3027.transform("t13,-348.08075").data('id', 'rect3027');
   var rect30013 = rsr.rect(155.91289, 385.83765, 52.610168, 52.610168);
   rect30013.attr({y: '385.83765',x: '155.91289',id: 'rect3001-3',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect30013.transform("t13,-348.08075").data('id', 'rect30013');
   var rect3029 = rsr.rect(248.96552, 368.23178, 21.56378, 107.49746);
   rect3029.attr({id: 'rect3029',x: '248.96552',y: '368.23178',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3029.transform("t13,-348.08075").data('id', 'rect3029');
   var rect3031 = rsr.rect(324.91818, 368.18445, 21.658461, 177.97202);
   rect3031.attr({id: 'rect3031',x: '324.91818',y: '368.18445',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3031.transform("t13,-348.08075").data('id', 'rect3031');
   var rect300188 = rsr.rect(233.44232, 385.83765, 52.610168, 52.610168);
   rect300188.attr({y: '385.83765',x: '233.44232',id: 'rect3001-88',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect300188.transform("t13,-348.08075").data('id', 'rect300188');
   var rect3041 = rsr.rect(400.92996, 511.22824, 21.634903, 29.582102);
   rect3041.attr({id: 'rect3041',x: '400.92996',y: '511.22824',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3041.transform("t13,-348.08075").data('id', 'rect3041');
   var rect3051 = rsr.rect(324.93854, 642.11475, 21.617765, 41.31897);
   rect3051.attr({y: '642.11475',x: '324.93854',id: 'rect3051',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3051.transform("t13,-348.08075").data('id', 'rect3051');
   var rect3053 = rsr.rect(400.93607, 645.77094, 21.622681, 37.70237);
   rect3053.attr({id: 'rect3053',x: '400.93607',y: '645.77094',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3053.transform("t13,-348.08075").data('id', 'rect3053');
   var rect3055 = rsr.rect(139.96933, 554.15424, 29.582102, 21.634903);
   rect3055.attr({y: '554.15424',x: '139.96933',id: 'rect3055',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3055.transform("t13,-348.08075").data('id', 'rect3055');
   var rect3057 = rsr.rect(199.26729, 477.77972, 44.033951, 21.614243);
   rect3057.attr({id: 'rect3057',x: '199.26729',y: '477.77972',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3057.transform("t13,-348.08075").data('id', 'rect3057');
   var rect3061 = rsr.rect(140.57613, 630.58972, 112.34703, 21.652323);
   rect3061.attr({id: 'rect3061',x: '140.57613',y: '630.58972',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3061.transform("t13,-348.08075").data('id', 'rect3061');
   var rect3065 = rsr.rect(362.50229, 630.85663, 243.25769, 21.118483);
   rect3065.attr({y: '630.85663',x: '362.50229',id: 'rect3065',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3065.transform("t13,-348.08075").data('id', 'rect3065');
   var rect3069 = rsr.rect(256.06549, 554.18793, 235.21469, 21.567562);
   rect3069.attr({y: '554.18793',x: '256.06549',id: 'rect3069',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3069.transform("t13,-348.08075").data('id', 'rect3069');
   var rect3075 = rsr.rect(362.44989, 477.56802, 35.032005, 22.03767);
   rect3075.attr({id: 'rect3075',x: '362.44989',y: '477.56802',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3075.transform("t13,-348.08075").data('id', 'rect3075');
   var rect3077 = rsr.rect(173.39024, 500.81058, 21.655455, 183.18602);
   rect3077.attr({id: 'rect3077',x: '173.39024',y: '500.81058',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4.19999981',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3077.transform("t13,-348.08075").data('id', 'rect3077');
   var rect3001 = rsr.rect(157.44234, 538.66663, 52.610168, 52.610168);
   rect3001.attr({y: '538.66663',x: '157.44234',id: 'rect3001',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3001.transform("t13,-348.08075").data('id', 'rect3001');
   var rect3079 = rsr.rect(65.305626, 477.75964, 104.24453, 21.654388);
   rect3079.attr({y: '477.75964',x: '65.305626',id: 'rect3079',parent: 'layer1',fill: '#803300',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3079.transform("t13,-348.08075").data('id', 'rect3079');
   var rect3045 = rsr.rect(248.92047, 576.83392, 21.653875, 106.6189);
   rect3045.attr({y: '576.83392',x: '248.92047',id: 'rect3045',parent: 'layer1',fill: '#440055',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3045.transform("t13,-348.08075").data('id', 'rect3045');
   var rect30011 = rsr.rect(157.91289, 462.28177, 52.610168, 52.610168);
   rect30011.attr({y: '462.28177',x: '157.91289',id: 'rect3001-1',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect30011.transform("t13,-348.08075").data('id', 'rect30011');
   var rect30014 = rsr.rect(385.44232, 462.28177, 52.610168, 52.610168);
   rect30014.attr({y: '462.28177',x: '385.44232',id: 'rect3001-4',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect30014.transform("t13,-348.08075").data('id', 'rect30014');
   var rect300128 = rsr.rect(385.44232, 538.66663, 52.610168, 52.610168);
   rect300128.attr({y: '538.66663',x: '385.44232',id: 'rect3001-28',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect300128.transform("t13,-348.08075").data('id', 'rect300128');
   var rect30017 = rsr.rect(309.44232, 615.11078, 52.610168, 52.610168);
   rect30017.attr({y: '615.11078',x: '309.44232',id: 'rect3001-7',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect30017.transform("t13,-348.08075").data('id', 'rect30017');
   var rect30010 = rsr.rect(157.44234, 615.11078, 52.610168, 52.610168);
   rect30010.attr({y: '615.11078',x: '157.44234',id: 'rect3001-0',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect30010.transform("t13,-348.08075").data('id', 'rect30010');
   var rect30012 = rsr.rect(385.44232, 615.11078, 52.610168, 52.610168);
   rect30012.attr({y: '615.11078',x: '385.44232',id: 'rect3001-2',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect30012.transform("t13,-348.08075").data('id', 'rect30012');
   var rect300134 = rsr.rect(233.44232, 615.11078, 52.610168, 52.610168);
   rect300134.attr({y: '615.11078',x: '233.44232',id: 'rect3001-34',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect300134.transform("t13,-348.08075").data('id', 'rect300134');
   var rect300179 = rsr.rect(309.44232, 538.66663, 52.610168, 52.610168);
   rect300179.attr({y: '538.66663',x: '309.44232',id: 'rect3001-79',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect300179.transform("t13,-348.08075").data('id', 'rect300179');
   var rect3001790 = rsr.rect(233.44232, 538.66663, 52.610168, 52.610168);
   rect3001790.attr({y: '538.66663',x: '233.44232',id: 'rect3001-790',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3001790.transform("t13,-348.08075").data('id', 'rect3001790');
   var rect300127 = rsr.rect(233.44232, 462.28177, 52.610168, 52.610168);
   rect300127.attr({y: '462.28177',x: '233.44232',id: 'rect3001-27',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect300127.transform("t13,-348.08075").data('id', 'rect300127');
   var rect300157 = rsr.rect(309.44232, 462.28177, 52.610168, 52.610168);
   rect300157.attr({y: '462.28177',x: '309.44232',id: 'rect3001-57',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect300157.transform("t13,-348.08075").data('id', 'rect300157');
   var rect30015 = rsr.rect(309.44232, 385.83765, 52.610168, 52.610168);
   rect30015.attr({y: '385.83765',x: '309.44232',id: 'rect3001-5',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect30015.transform("t13,-348.08075").data('id', 'rect30015');
   var rect4130 = rsr.rect(116.40426, 348.58075, 13.884164, 119.5467);
   rect4130.attr({id: 'rect4130',x: '116.40426',y: '348.58075',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect4130.transform("t13,-348.08075").data('id', 'rect4130');
   var rect4132 = rsr.rect(116.50877, 348.86621, 502.2561, 14.175133);
   rect4132.attr({y: '348.86621',x: '116.50877',id: 'rect4132',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect4132.transform("t13,-348.08075").data('id', 'rect4132');
   var rect4138 = rsr.rect(612.57397, 348.72021, 13.859139, 352.04886);
   rect4138.attr({id: 'rect4138',x: '612.57397',y: '348.72021',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect4138.transform("t13,-348.08075").data('id', 'rect4138');
   var rect4136 = rsr.rect(116.5082, 688.8656, 509.91779, 14.176272);
   rect4136.attr({id: 'rect4136',x: '116.5082',y: '688.8656',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect4136.transform("t13,-348.08075").data('id', 'rect4136');
   var rect4134 = rsr.rect(116.41677, 511.83057, 13.859139, 190.75102);
   rect4134.attr({y: '511.83057',x: '116.41677',id: 'rect4134',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect4134.transform("t13,-348.08075").data('id', 'rect4134');
   var rect4140 = rsr.rect(71.752045, 416.23331, 39.729534, 50.816845);
   rect4140.attr({id: 'rect4140',x: '71.752045',y: '416.23331',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1'});
   rect4140.transform("t13,-348.08075").data('id', 'rect4140');
   var rect4146 = rsr.rect(101.56198, 407.72775, 9.6195402, 8.6955976);
   rect4146.attr({id: 'rect4146',x: '101.56198',y: '407.72775',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect4146.transform("t13,-348.08075").data('id', 'rect4146');
   var rect4148 = rsr.rect(86.561981, 407.72775, 9.6195402, 8.6955976);
   rect4148.attr({y: '407.72775',x: '86.561981',id: 'rect4148',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect4148.transform("t13,-348.08075").data('id', 'rect4148');
   var rect4150 = rsr.rect(71.561981, 407.72775, 9.6195402, 8.6955976);
   rect4150.attr({id: 'rect4150',x: '71.561981',y: '407.72775',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect4150.transform("t13,-348.08075").data('id', 'rect4150');
   var rect4152 = rsr.rect(71.752045, 519.92908, 39.729534, 50.816845);
   rect4152.attr({y: '519.92908',x: '71.752045',id: 'rect4152',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1'});
   rect4152.transform("t13,-348.08075").data('id', 'rect4152');
   var rect4154 = rsr.rect(101.56198, 511.42352, 9.6195402, 8.6955976);
   rect4154.attr({y: '511.42352',x: '101.56198',id: 'rect4154',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect4154.transform("t13,-348.08075").data('id', 'rect4154');
   var rect4156 = rsr.rect(86.561981, 511.42352, 9.6195402, 8.6955976);
   rect4156.attr({id: 'rect4156',x: '86.561981',y: '511.42352',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect4156.transform("t13,-348.08075").data('id', 'rect4156');
   var rect4158 = rsr.rect(71.561981, 511.42352, 9.6195402, 8.6955976);
   rect4158.attr({y: '511.42352',x: '71.561981',id: 'rect4158',parent: 'layer1',fill: '#808080',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect4158.transform("t13,-348.08075").data('id', 'rect4158');
   var text5170 = rsr.text(10.326738, 477.0614, 'Entrée');
   text5170.attr({id: 'text5170',parent: 'layer1',"font-size": '16px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   text5170.transform("t13,-348.08075").data('id', 'text5170');
   var path5174 = rsr.path("m 10.718279,488.60506 45.642222,-0");
   path5174.attr({id: 'path5174',parent: 'layer1',fill: 'none',stroke: '#000000',"stroke-width": '2',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',"arrow-end": 'classic-wide-long'});
   path5174.transform("t13,-348.08075").data('id', 'path5174');
   var text3043 = rsr.text(143.8289, 488.21399, 'A');
   text3043.attr({id: 'text3043',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text3043.transform("t13,-348.08075").data('id', 'text3043');
   var text30437 = rsr.text(327.71442, 675.43964, 'D');
   text30437.attr({id: 'text3043-7',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text30437.transform("t13,-348.08075").data('id', 'text30437');
   var text30435 = rsr.text(367.52725, 488.58838, 'B');
   text30435.attr({id: 'text3043-5',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text30435.transform("t13,-348.08075").data('id', 'text30435');
   var text30430 = rsr.text(328.98105, 527.74792, 'D');
   text30430.attr({id: 'text3043-0',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text30430.transform("t13,-348.08075").data('id', 'text30430');
   var text30434 = rsr.text(366.83392, 565.72089, 'B');
   text30434.attr({id: 'text3043-4',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text30434.transform("t13,-348.08075").data('id', 'text30434');
   var text304308 = rsr.text(291.16815, 565.02753, 'C');
   text304308.attr({id: 'text3043-08',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304308.transform("t13,-348.08075").data('id', 'text304308');
   var text304371 = rsr.text(252.54189, 674.78632, 'D');
   text304371.attr({id: 'text3043-71',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304371.transform("t13,-348.08075").data('id', 'text304371');
   var text304350 = rsr.text(215.30229, 641.12, 'A');
   text304350.attr({id: 'text3043-50',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304350.transform("t13,-348.08075").data('id', 'text304350');
   var text30431 = rsr.text(253.88855, 602.92041, 'B');
   text30431.attr({id: 'text3043-1',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text30431.transform("t13,-348.08075").data('id', 'text30431');
   var text30436 = rsr.text(176.79608, 676.78632, 'D');
   text30436.attr({id: 'text3043-6',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text30436.transform("t13,-348.08075").data('id', 'text30436');
   var text30432 = rsr.text(142.82312, 642.12, 'C');
   text30432.attr({id: 'text3043-2',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text30432.transform("t13,-348.08075").data('id', 'text30432');
   var text304351 = rsr.text(178.06271, 604.26709, 'B');
   text304351.attr({id: 'text3043-51',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304351.transform("t13,-348.08075").data('id', 'text304351');
   var text304303 = rsr.text(143.51646, 564.03632, 'A');
   text304303.attr({id: 'text3043-03',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304303.transform("t13,-348.08075").data('id', 'text304303');
   var text304348 = rsr.text(176.67601, 527.82794, 'D');
   text304348.attr({id: 'text3043-48',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304348.transform("t13,-348.08075").data('id', 'text304348');
   var text30438 = rsr.text(215.34232, 488.6684, 'B');
   text30438.attr({id: 'text3043-8',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text30438.transform("t13,-348.08075").data('id', 'text30438');
   var text30433 = rsr.text(253, 377.58917, 'D');
   text30433.attr({id: 'text3043-3',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text30433.transform("t13,-348.08075").data('id', 'text30433');
   var text304330 = rsr.text(175.91621, 377.58038, 'C');
   text304330.attr({id: 'text3043-30',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304330.transform("t13,-348.08075").data('id', 'text304330');
   var text304356 = rsr.text(141.51646, 411.70377, 'A');
   text304356.attr({id: 'text3043-56',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304356.transform("t13,-348.08075").data('id', 'text304356');
   var text3043484 = rsr.text(214.03566, 412.70377, 'B');
   text3043484.attr({id: 'text3043-484',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text3043484.transform("t13,-348.08075").data('id', 'text3043484');
   var text304355 = rsr.text(404.46567, 377.58917, 'D');
   text304355.attr({id: 'text3043-55',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304355.transform("t13,-348.08075").data('id', 'text304355');
   var text304313 = rsr.text(329.08524, 376.58917, 'A');
   text304313.attr({id: 'text3043-13',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304313.transform("t13,-348.08075").data('id', 'text304313');
   var text304367 = rsr.text(291.12814, 412.70377, 'E');
   text304367.attr({id: 'text3043-67',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304367.transform("t13,-348.08075").data('id', 'text304367');
   var text304388 = rsr.text(253.88855, 450.77554, 'C');
   text304388.attr({id: 'text3043-88',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304388.transform("t13,-348.08075").data('id', 'text304388');
   var text304338 = rsr.text(329.67438, 450.04218, 'C');
   text304338.attr({id: 'text3043-38',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304338.transform("t13,-348.08075").data('id', 'text304338');
   var text304317 = rsr.text(367.56732, 412.70377, 'B');
   text304317.attr({id: 'text3043-17',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304317.transform("t13,-348.08075").data('id', 'text304317');
   var text3043507 = rsr.text(443.4332, 412.70377, 'E');
   text3043507.attr({id: 'text3043-507',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text3043507.transform("t13,-348.08075").data('id', 'text3043507');
   var text30439 = rsr.text(406.15356, 527.86804, 'E');
   text30439.attr({id: 'text3043-9',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text30439.transform("t13,-348.08075").data('id', 'text30439');
   var text304312 = rsr.text(442.46555, 565.68091, 'D');
   text304312.attr({id: 'text3043-12',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304312.transform("t13,-348.08075").data('id', 'text304312');
   var text304398 = rsr.text(443.59494, 641.50677, 'A');
   text304398.attr({id: 'text3043-98',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304398.transform("t13,-348.08075").data('id', 'text304398');
   var text304383 = rsr.text(406.11353, 675.4397, 'B');
   text304383.attr({id: 'text3043-83',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304383.transform("t13,-348.08075").data('id', 'text304383');
   var text304339 = rsr.text(367.03403, 641.4267, 'C');
   text304339.attr({id: 'text3043-39',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304339.transform("t13,-348.08075").data('id', 'text304339');
   var rect300188 = rsr.rect(461.44205, 385.83765, 52.610168, 52.610168);
   rect300188.attr({y: '385.83765',x: '461.44205',id: 'rect3001-8-8',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect300188.transform("t13,-348.08075").data('id', 'rect300188');
   var rect300140 = rsr.rect(461.44205, 462.28177, 52.610168, 52.610168);
   rect300140.attr({y: '462.28177',x: '461.44205',id: 'rect3001-4-0',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect300140.transform("t13,-348.08075").data('id', 'rect300140');
   var rect300121 = rsr.rect(461.44205, 615.11078, 52.610168, 52.610168);
   rect300121.attr({y: '615.11078',x: '461.44205',id: 'rect3001-2-1',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect300121.transform("t13,-348.08075").data('id', 'rect300121');
   var rect300182 = rsr.rect(537.44226, 385.83765, 52.610168, 52.610168);
   rect300182.attr({y: '385.83765',x: '537.44226',id: 'rect3001-8-2',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect300182.transform("t13,-348.08075").data('id', 'rect300182');
   var rect3001283 = rsr.rect(537.44226, 538.66663, 52.610168, 52.610168);
   rect3001283.attr({y: '538.66663',x: '537.44226',id: 'rect3001-28-3',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3001283.transform("t13,-348.08075").data('id', 'rect3001283');
   var rect300123 = rsr.rect(537.44226, 615.11078, 52.610168, 52.610168);
   rect300123.attr({y: '615.11078',x: '537.44226',id: 'rect3001-2-3',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect300123.transform("t13,-348.08075").data('id', 'rect300123');
   var path4160 = rsr.path("m 554.04595,555.27032 19.40279,19.40279");
   path4160.attr({id: 'path4160',parent: 'layer1',fill: 'none',stroke: '#0000ff',"stroke-width": '7',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   path4160.transform("t13,-348.08075").data('id', 'path4160');
   var path4162 = rsr.path("m 573.44874,555.27032 -19.40279,19.40279");
   path4162.attr({id: 'path4162',parent: 'layer1',fill: '#0000ff',stroke: '#0000ff',"stroke-width": '7',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   path4162.transform("t13,-348.08075").data('id', 'path4162');
   var text4610 = rsr.text(652.03064, 613.4101, 'Prince');
   text4610.attr({id: 'text4610',parent: 'layer1',"font-size": '16px',"font-style": 'normal',"font-weight": 'normal',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',fill: '#000000',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans'});
   text4610.transform("t23,-352.08075").data('id', 'text4610');
   var path4982 = rsr.path("M 636.41095,608.01863 580.97439,579.37641");
   path4982.attr({id: 'path4982',parent: 'layer1',fill: 'none',stroke: '#000000',"stroke-width": '2',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none',"arrow-end": 'classic-wide-long'});
   path4982.transform("t13,-348.08075").data('id', 'path4982');
   var text3043553 = rsr.text(481.42328, 377.58917, 'C');
   text3043553.attr({id: 'text3043-55-3',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text3043553.transform("t13,-348.08075").data('id', 'text3043553');
   var text3043847 = rsr.text(519.39319, 412.71255, 'A');
   text3043847.attr({id: 'text3043-84-7',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text3043847.transform("t13,-348.08075").data('id', 'text3043847');
   var rect300145 = rsr.rect(537.44226, 462.28177, 52.610168, 52.610168);
   rect300145.attr({y: '462.28177',x: '537.44226',id: 'rect3001-4-5',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect300145.transform("t13,-348.08075").data('id', 'rect300145');
   var rect3001280 = rsr.rect(461.44205, 538.66663, 52.610168, 52.610168);
   rect3001280.attr({y: '538.66663',x: '461.44205',id: 'rect3001-28-0',parent: 'layer1',fill: '#e3d7f4',"fill-rule": 'evenodd',stroke: '#000000',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   rect3001280.transform("t13,-348.08075").data('id', 'rect3001280');
   var text304340 = rsr.text(590.79993, 412.71255, 'D');
   text304340.attr({id: 'text3043-4-0',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304340.transform("t13,-348.08075").data('id', 'text304340');
   var text3043407 = rsr.text(591.72388, 488.58838, 'B');
   text3043407.attr({id: 'text3043-4-07',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text3043407.transform("t13,-348.08075").data('id', 'text3043407');
   var text3043405 = rsr.text(590.95203, 565.68091, 'D');
   text3043405.attr({id: 'text3043-4-05',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text3043405.transform("t13,-348.08075").data('id', 'text3043405');
   var text304344 = rsr.text(592.64783, 641.50677, 'E');
   text304344.attr({id: 'text3043-4-4',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304344.transform("t13,-348.08075").data('id', 'text304344');
   var text30438475 = rsr.text(519.39319, 489.14789, 'A');
   text30438475.attr({id: 'text3043-84-7-5',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text30438475.transform("t13,-348.08075").data('id', 'text30438475');
   var text304305 = rsr.text(480.46539, 450.92584, 'D');
   text304305.attr({id: 'text3043-0-5',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304305.transform("t13,-348.08075").data('id', 'text304305');
   var text304398 = rsr.text(557.75317, 527.86804, 'E');
   text304398.attr({id: 'text3043-9-8',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304398.transform("t13,-348.08075").data('id', 'text304398');
   var text3043512 = rsr.text(557.3269, 602.92041, 'B');
   text3043512.attr({id: 'text3043-51-2',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text3043512.transform("t13,-348.08075").data('id', 'text3043512');
   var text3043086 = rsr.text(481.44537, 602.91162, 'C');
   text3043086.attr({id: 'text3043-08-6',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text3043086.transform("t13,-348.08075").data('id', 'text3043086');
   var text304372 = rsr.text(518.26379, 641.97693, 'D');
   text304372.attr({id: 'text3043-7-2',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text304372.transform("t13,-348.08075").data('id', 'text304372');
   var text3043444 = rsr.text(481.75299, 675.4397, 'E');
   text3043444.attr({id: 'text3043-4-4-4',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text3043444.transform("t13,-348.08075").data('id', 'text3043444');
   var text3043987 = rsr.text(557.59497, 675.4397, 'A');
   text3043987.attr({id: 'text3043-98-7',parent: 'layer1',"font-size": '18px',"font-style": 'normal',"font-variant": 'normal',"font-weight": 'normal',"font-stretch": 'normal',"text-align": 'start',"line-height": '125%',"letter-spacing": '0px',"word-spacing": '0px',"writing-mode": 'lr-tb',"text-anchor": 'start',fill: '#ffffff',"fill-opacity": '1',stroke: 'none','stroke-width':'1','stroke-opacity':'1',"font-family": 'Sans',"-inkscape-font-specification": 'Sans'});
   text3043987.transform("t13,-348.08075").data('id', 'text3043987');
   layer1.attr({'id': 'layer1','name': 'layer1'});layer1.transform("t13,-348.08075");
   var rsrGroups = [layer1];


   var prince1 = rsr.path("m -9.701354,-9.701354 19.40279,19.40279");
   prince1.attr({id: 'path4160',fill: 'none',stroke: '#ff0000',"stroke-width": '7',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   var prince2 = rsr.path("m 9.701354,-9.701354 -19.40279,19.40279");
   prince2.attr({id: 'path4162',fill: 'none',stroke: '#ff0000',"stroke-width": '7',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
   prince = rsr.set();
   prince.push(prince1);
   prince.push(prince2);
   hidePrince();
}
