function initTask() {
   var difficulty;
   var isEasy;
   var nbPositions = 18;
   var paperWidth = 650;
   var paperHeight = 40;
   var margin = 1;
   var size = (paperWidth-2*margin) / nbPositions; // cellSize
   var items1 = [ 
      {x: 3, s: 1},
      {x: 7, s: -1},
      {x: 10, s: 1},
      {x: 13, s: 1},
      {x: 17, s: -1}
      ];
   var items1Easy =  [ 
      {x: 3, s: 1},
      {x: 7, s: 1},
      {x: 10, s: 1},
      {x: 13, s: 1},
      {x: 17, s: 1}
      ];
   var items2Answer;
   var mapItems1;
   var mapItems2;
   var mapItems2Answer;
   var mapElements1;
   var mapElements2;
   var mapElements3;
   var countItems2Answer;

   var getItems2Answer = function(randomSeed) {
      // for debug: 
      // randomSeed = 9155449613;
      var r = function(idBit) { return Beav.Random.bit(randomSeed, idBit); }
      var items = [
         {x: 2, s: 1},
         {x: 4 + r(0), s: 1},
         {x: 10, s: -1},
         {x: 11, s: 1},
         {x: 16 + r(1), s: -1}
         ];
      if (isEasy) {
         items = [
            {x: 2, s: 1},
            {x: 4 + r(0), s: 1},
            {x: 10, s: 1},
            {x: 11, s: 1},
            {x: 16 + r(1), s: 1}
            ];
      }
      return items;
   };

   task.load = function(views, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         difficulty = taskParams.options.difficulty ? taskParams.options.difficulty : "hard";
         // LATER: check difficulty is easy or hard
         $("." + difficulty).show();
         isEasy = (difficulty == "easy");
         if (isEasy) {
            items1 = items1Easy;
         }

         $(".map, .table").width(paperWidth).height(paperHeight);
         //displayHelper.hideValidateButton = true;

         items2Answer = getItems2Answer(taskParams.randomSeed);

         var table1 = buildGrid("table1", false);
         var table2 = buildGrid("table2", false);
         var tableItems1 = tableItemsOfItems(items1);
         var tableItems2 = tableItemsOfItems(items2Answer);
         setTimeout(function(){ // timeout as workaround for raphael
            fillTable(table1, tableItems1);
            fillTable(table2, tableItems2);
         });

         var map1 = buildGrid("map1", false);
         var map2 = buildGrid("map2", true);
         mapItems1 = mapItemsOfList(items1);
         mapItems2Answer = mapItemsOfList(items2Answer);
         mapElements1 = createMap(map1, false);
         mapElements2 = createMap(map2, true);

         updateMap(mapElements1, mapItems1);
         countItems2Answer = items2Answer.length;
         restart();
         // for debug: updateMap(mapElements2, mapItems2Solution);

         if (views.solution) {
            setTimeout(function(){ // timeout as workaround for raphael
               var table3 = buildGrid("table3", false);
               fillTable(table3, tableItems2);
               var map3 = buildGrid("map3", false);
               mapElements3 = createMap(map3, false);
               updateMap(mapElements3, mapItems2Answer);
           });
         }
         callback();
      });
   };

   var reset = function() {
      mapItems2 = Beav.Array.make(nbPositions, 0);
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
      var m = Beav.Array.make(nbPositions, 0);
      for (var x = 0; x < m.length; x++) { 
         for (var iItem = 0; iItem < items.length; iItem++) {
            var item = items[iItem];
            if (item.x == x) {
               m[x] = item.s;
            }
         }
      }
      return m;
   };

   var tableItemsOfItems = function(items) {
      var m = mapItemsOfList(items);
      var count = 0;
      for (var x = 0; x < nbPositions; x++) {
         count += m[x];
         m[x] = count;
      }
      return m;
   };

   var fillTable = function(paper, m) {
         for (var x = 0; x < m.length; x++) {
         var item = paper.text(x * size + size/2, 1 + size/2, m[x]).attr({'font-size': 16}); 
      }
   };

   var createMap = function(paper, isInteractive) {
      return Beav.Array.init(nbPositions, function(x) {
         var heightLarge = size - 4 * margin;
         var widthLarge = 85 * (heightLarge / 108);
         var yPosLarge = 3*margin;
         var xPosLarge = x*size + (size - widthLarge) / 2;
         var heightSmall = heightLarge * 3 / 4;
         var widthSmall = widthLarge * 3 / 4;
         var yPosSmall = 3*margin + (heightLarge - heightSmall);
         var xPosSmall = x*size + (size - widthSmall) / 2;
         // console.log(xPos + ", " + yPos + " ," + widthLarge + " , " + heightLarge)
         // paper.image("beaver.png", xPos, yPos, widthLarge, heightLarge); 
         var smallItem = paper.image("beaver_small.png", xPosSmall, yPosSmall, widthSmall, heightSmall); 
         var largeItem = paper.image("beaver.png", xPosLarge, yPosLarge, widthLarge, heightLarge); 
         if (isInteractive) {
            smallItem.click(clickHandler(x));
            largeItem.click(clickHandler(x));
         }
         return { small: smallItem, large: largeItem };
      });
   };

   var updateMap = function(mapElements, mapItems) {
      for (var x = 0; x < mapItems.length; x++) {
         var v = mapItems[x];
         var els = mapElements[x];
         els.small.hide();
         els.large.hide();
         if (v == -1) {
            els.small.show();
         } else if (v == 1) {
            els.large.show();
         }
      }
   };

   var buildGrid = function(name, isInteractive) {
      var paper = Raphael(name, paperWidth, paperHeight);   
      paper.clear();
      // paper.setStart();

      var grid = Beav.Array.make(nbPositions, 0);
      for (var x = 0; x < grid.length; x++) {
         var item = paper.rect(x * size + margin, margin, size, size)
                         .attr({"stroke-width": 2, stroke: "black", fill: "white"});
         if (isInteractive) {
            item.click(clickHandler(x));
         }
      }
      // var grid = paper.setFinish();
      return paper;
   };

   var clickHandler = function(x) {
      return function() { toggleAt(x); };
   };

   var toggleAt = function(x) {
      if (isEasy) {
         mapItems2[x] = 1 - mapItems2[x];
      } else {
         mapItems2[x] = ((mapItems2[x] + 3) % 3) - 1;
      }
      updateMap(mapElements2, mapItems2);
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

   var countItems = function(mapItems, size) {
      return Beav.Array.filterCount(mapItems, function(v,x) { 
         return v == size; }); 
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
         var nbSmall = countItems(mapItems2Answer, -1);
         var nbBig = countItems(mapItems2Answer, 1);
         if (countItems(mapItems2, -1) != nbSmall) {
            callback(taskParams.minScore, "Vous devez placer exactement " + nbSmall + " petits castors.");
         } else if (countItems(mapItems2, 1) != nbBig) {
            callback(taskParams.minScore, "Vous devez placer exactement " + nbBig + " grands castors.");
         } else if (Beav.Object.eq(mapItems2, mapItems2Answer)) {
            callback(taskParams.maxScore, "Bravo, vous avez bien placé les castors&nbsp;!");
         } else {
            callback(taskParams.minScore, "Les castors ne sont pas à la bonne place. Essayez encore.");
         }
      });
   }
}
initTask();
