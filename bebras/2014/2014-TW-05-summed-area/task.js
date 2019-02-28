function initTask() {
   var paperSize = 180;
   var nbPerSide = 6;
   var cellSize = paperSize / nbPerSide;
   var items1 = [ 
      {x: 0, y: 3},
      {x: 1, y: 1},
      {x: 2, y: 4},
      {x: 5, y: 4},
      {x: 4, y: 2}
      ];
   var items2Answer;
   var mapItems1;
   var mapItems2Answer;
   var mapElements2;
   var countItems2Answer;
   var mapElements1;
   var mapElements2;
   var mapElements3;

   var getItems2Answer = function(randomSeed) {
      // for debug:  randomSeed = 1; 
      var r = function(idBit) { return Beav.Random.bit(randomSeed, idBit); }
      return [
         {x: 1, y: 1 + r(0)},
         {x: 3, y: 4 - r(1)},
         {x: 3, y: 2 - r(0)},
         {x: 4, y: 0},
         {x: 5, y: 3 + r(1)}
         ];
      // LATER: obfuscate better?
   };

   task.load = function(views, callback) {
      // displayHelper.hideValidateButton = true;
      platform.getTaskParams(null, null, function(taskParams) {
         items2Answer = getItems2Answer(taskParams.randomSeed);
         var map1 = buildGrid("map1", false, true);
         var map2 = buildGrid("map2", true, true);
         mapItems1 = mapItemsOfList(items1);
         mapItems2Answer = mapItemsOfList(items2Answer);
         mapElements1 = createMap(map1, false);
         mapElements2 = createMap(map2, true);

         var table1 = buildGrid("table1", false, false);
         var table2 = buildGrid("table2", false, false);
         var tableItems1 = tableItemsOfItems(items1);
         var tableItems2 = tableItemsOfItems(items2Answer);
         fillTable(table1, tableItems1);
         fillTable(table2, tableItems2);

         updateMap(mapElements1, mapItems1);
         countItems2Answer = items2Answer.length;
         restart();
         // for debug: updateMap(mapElements2, mapItems2Solution);

         if (views.solution) {
            setTimeout(function(){ // timeout as workaround for raphael
               var table3 = buildGrid("table3", false, false);
               fillTable(table3, tableItems2);
               var map3 = buildGrid("map3", false, true);
               mapElements3 = createMap(map3, false);
               updateMap(mapElements3, mapItems2Answer);
            });
         }
         callback();
      });
   };

   var reset = function() {
      mapItems2 = Beav.Matrix.make(nbPerSide, nbPerSide, 0);
   };

   var restart = function() {
      reset();
      updateDisplay();
   };

   task.reloadAnswer = function(strAnswer, callback) {
      reset();
      if (strAnswer != "")
         mapItems2 = $.parseJSON(strAnswer);
      updateDisplay();
      callback();
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify(mapItems2));
   };

   var mapItemsOfList = function(items) {
      var m = Beav.Matrix.make(nbPerSide, nbPerSide, 0);
      Beav.Matrix.forEach(m, function(v,x,y) {
         if (Beav.Array.has(items, {x:x, y:y}))
            m[x][y] = 1;
      });
      return m;
   };

   var tableItemsOfItems = function(items) {
      var m = mapItemsOfList(items);
      for (var y = 0; y < nbPerSide; y++) {
         var count = 0;
         for (var x = 0; x < nbPerSide; x++) {
            if (m[x][y] == 1)
               count++;
            m[x][y] = count;
            if (y > 0)
               m[x][y] += m[x][y-1];
         }
      }
      return m;
   };

   var fillTable = function(paper, m) {
      var size = cellSize;
      Beav.Matrix.forEach(m, function(v,x,y) {
         // console.log("y = " + y + " at " + (y * size + size/2));
         var item = paper.text(x * size + size/2, y * size + size/2, v).attr({'font-size': 16}); 
      });
   };

   var createMap = function(paper, interactive) {
      var size = cellSize;
      var margin = 2;
      return Beav.Matrix.init(nbPerSide, nbPerSide, function(x,y) {
         var item = paper.image("castor_tete_original.png", x*size+margin, y*size+margin, 26, 26); 
         // var item = paper.image("castor_tete_original.png", x*size+margin, (y+5/80)*size+margin, size-2*margin, size*70/80-2*margin); 
         if (interactive) {
            item.click(clickHandler(x, y));
         }
         return item;
      });
   };

   var updateMap = function(mapElements, mapItems) {
      Beav.Matrix.forEach(mapItems, function(v,x,y) {
         Beav.Dom.showOrHide(mapElements[x][y], v);
      });
   };

   var buildGrid = function(name, isInteractive, hasBackground) {
      var paper = Raphael(name, paperSize, paperSize);   
      paper.clear();
      if (hasBackground) {
         paper.image("bg_map_claire.png", 0, 0, paperSize, paperSize).attr({"opacity": 0.5});
      }
      // paper.setStart();
      var size = cellSize;
      var grid = Beav.Matrix.make(nbPerSide, nbPerSide, 0);
      Beav.Matrix.forEach(grid, function(v,x,y) {
         var border = paper.rect(x * size, y * size, size, size)
                         .attr({"stroke-width": 2, stroke: "black", fill: "none"});
         var item = paper.rect(x * size, y * size, size, size)
                         .attr({"stroke-width": 0, stroke: "black", fill: "white", opacity: 0.1});
         if (isInteractive) {
            item.click(clickHandler(x, y));
         }
      });
      // var grid = paper.setFinish();
      return paper;
   };

   var clickHandler = function(x, y) {
      return function() { toggleAt(x,y); };
   };

   var toggleAt = function(x, y) {
      // console.log(point.x + "," + point.y);
      var m = mapItems2;
      m[x][y] = 1 - m[x][y];
      Beav.Dom.showOrHide(mapElements2[x][y], m[x][y]);
      displayHelper.stopShowingResult();
      /* // automatic validation deactivated:
      if (goodAnswer()) {
         platform.validate("done");
      }
      */
   };

   var goodAnswer = function() {
      return Beav.Object.eq(mapItems2, mapItems2Answer);
   };

   var countItems = function(mapItems) {
      return Beav.Matrix.filterCount(mapItems, function(v,x,y) { return v; }); 
   };

   var updateDisplay = function() {
      updateMap(mapElements2, mapItems2);
   }

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         if (strAnswer == "") {
            callback(taskParams.minScore, "Cliquez sur les cases où se trouvent les 5 castors.");
            return;
         }
         var mapItems2Answer = mapItemsOfList(getItems2Answer(taskParams.randomSeed));
         var mapItems2 = $.parseJSON(strAnswer);

         if (countItems(mapItems2) != countItems(mapItems2Answer)) {
            callback(taskParams.minScore, "Vous devez placer exactement 5 castors.");
         } else if (Beav.Object.eq(mapItems2, mapItems2Answer)) {
            callback(taskParams.maxScore, "Bravo, vous avez bien placé les castors&nbsp;!");
         } else {
            callback(taskParams.minScore, "Les castors ne sont pas à la bonne place. Essayez encore.");
         }
      });
   }
}
initTask();
