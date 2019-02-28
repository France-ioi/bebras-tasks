function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         before:  [ 
            {x: 3, s: 1},
            {x: 7, s: 1},
            {x: 10, s: 1},
            {x: 13, s: 1},
            {x: 17, s: 1}
            ],
         after: [ 
            {x: 2, s: 1},
            {x: 4, s: 1},
            {x: 10, s: 1},
            {x: 11, s: 1},
            {x: 16, s: 1}
            ],
            paperWidth: 650,
            paperHeight: 40
      },
      medium: {
         before: [ 
            {x: 3, s: 1},
            {x: 7, s: -1},
            {x: 10, s: 1},
            {x: 13, s: 1},
            {x: 17, s: -1}
            ],
         after: [ 
            {x: 2, s: 1},
            {x: 4, s: 1},
            {x: 10, s: -1},
            {x: 11, s: 1},
            {x: 16, s: -1}
            ],
            paperWidth: 650,
            paperHeight: 40
      },
      hard: {
         before: [ 
            {x: 0, y: 3},
            {x: 1, y: 1},
            {x: 2, y: 4},
            {x: 5, y: 4},
            {x: 4, y: 2}
            ],
         after: [
            {x: 1, y: 1 },
            {x: 3, y: 4 },
            {x: 3, y: 2 },
            {x: 4, y: 0 },
            {x: 5, y: 3 }
            ],
            paperWidth: 180,
            paperHeight: 180,
            nbPerSide: 6
      }
   };
   var nbPositions = 18;
   var nbPerSide;
   var paperWidth;
   var paperHeight;
   var margin = 1;
   var size; // cellSize
   var before;
   var after;
   var mapBefore;
   var mapAfter;
   var mapElements1;
   var mapElements2;
   var mapElements3;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      after = JSON.parse(JSON.stringify(data[level].after));
      before = JSON.parse(JSON.stringify(data[level].before));
      paperWidth = data[level].paperWidth;
      paperHeight = data[level].paperHeight;
      nbPerSide = data[level].nbPerSide;
      if(level != "hard"){
         size = (paperWidth-2*margin) / nbPositions;
      }else{
         size = paperWidth / nbPerSide;
      }
      
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){

      }
   };

   subTask.resetDisplay = function() {
      initTables();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = (level != "hard") ? Beav.Array.make(nbPositions, 0) : Beav.Matrix.make(nbPerSide, nbPerSide, 0);
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      var result;
      if (level != "hard" && countItems(answer,0) == answer.length) {
         result = { successRate: 0, message: taskStrings.placeBeavers };
      }else if(level == "hard" && countItems(answer) == 0){
         result = { successRate: 0, message: taskStrings.placeBeavers };
      }else{
         var mapAfter = mapItemsOfList(after);
         var nbSmall = countItems(mapAfter, -1);
         var nbBig = countItems(mapAfter, 1);
         if (level != "hard" && countItems(answer, -1) != nbSmall) {
            result = { successRate: 0, message: taskStrings.missing(nbSmall,"small") };
         } else if (level != "hard" && countItems(answer, 1) != nbBig) {
            result = { successRate: 0, message: taskStrings.missing(nbBig,"big") };
         }else if(level == "hard" && countItems(answer) != nbBig) {
            result = { successRate: 0, message: taskStrings.missing(nbBig) };
         } else if (Beav.Object.eq(answer, mapAfter)) {
            result = { successRate: 1, message: taskStrings.success };
         } else {
            result = { successRate: 0, message: taskStrings.failure };
         }
      }
      return result;
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initTables() {
      var table1Id = (level != "hard") ? "table1" : "table1_hard";
      var table2Id = (level != "hard") ? "table2" : "table2_hard";
      var map1Id = (level != "hard") ? "map1" : "map1_hard";
      var map2Id = (level != "hard") ? "map2" : "map2_hard";

      var map1 = buildGrid(map1Id, false, true);
      var map2 = buildGrid(map2Id, true, true);
      mapBefore = mapItemsOfList(before);
      mapAfter = mapItemsOfList(after);
      mapElements1 = (level != "hard") ? createMap(map1, false) : createMapHard(map1, false);
      mapElements2 = (level != "hard") ? createMap(map2, true) : createMapHard(map2, true);

      var table1 = buildGrid(table1Id, false, false);
      var table2 = buildGrid(table2Id, false, false);
      var tableBefore = tableItemsOfItems(before);
      var tableAfter = tableItemsOfItems(after);
      fillTable(table1, tableBefore);
      fillTable(table2, tableAfter);

      updateMap(mapElements1, mapBefore);
      restart();
   };

   var restart = function() {
      updateDisplay();
   };

   var mapItemsOfList = function(items) {
      if(level != "hard"){
         var m = Beav.Array.make(nbPositions, 0);
         for (var x = 0; x < m.length; x++) { 
            for (var iItem = 0; iItem < items.length; iItem++) {
               var item = items[iItem];
               if (item.x == x) {
                  m[x] = item.s;
               }
            }
         }
      }else{
         var m = Beav.Matrix.make(nbPerSide, nbPerSide, 0);
         Beav.Matrix.forEach(m, function(v,x,y) {
            if (Beav.Array.has(items, {x:x, y:y}))
               m[x][y] = 1;
         });
      }
      return m;
   };

   var tableItemsOfItems = function(items) {
      var m = mapItemsOfList(items);
      if(level != "hard"){
         var count = 0;
         for (var x = 0; x < nbPositions; x++) {
            count += m[x];
            m[x] = count;
         }
      }else{
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
      }
      return m;
   };

   var fillTable = function(paper, m) {
      if(level != "hard"){
         for (var x = 0; x < m.length; x++) {
            var item = paper.text(x * size + size/2, 1 + size/2, m[x]).attr({'font-size': 16}); 
         }
      }else{
         Beav.Matrix.forEach(m, function(v,x,y) {
            var item = paper.text(x * size + size/2, y * size + size/2, v).attr({'font-size': 16}); 
         });
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
            var smallItem = paper.image("beaver_small.png", xPosSmall, yPosSmall, widthSmall, heightSmall); 
            var largeItem = paper.image("beaver.png", xPosLarge, yPosLarge, widthLarge, heightLarge); 
            if (isInteractive) {
               smallItem.click(clickHandler(x));
               largeItem.click(clickHandler(x));
            }
            return { small: smallItem, large: largeItem };
         });
   };

   function createMapHard(paper, isInteractive) {
      var margin = 2;
      return  Beav.Matrix.init(nbPerSide, nbPerSide, function(x,y) {
         var item = paper.image("castor_tete_original.png", x*size+margin, y*size+margin, 26, 26); 
         if (isInteractive) {
            item.click(clickHandler(x, y));
         }
         return item;
      });
   };

   var updateMap = function(mapElements, mapItems) {
      if(level != "hard"){
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
      }else{
         Beav.Matrix.forEach(mapItems, function(v,x,y) {
            Beav.Dom.showOrHide(mapElements[x][y], v);
         });
      }
   };

   var buildGrid = function(name, isInteractive, hasBackground) {
      var paper = subTask.raphaelFactory.create(name,name,paperWidth,paperHeight);
      paper.clear();
      if(level != "hard"){
         var grid = Beav.Array.make(nbPositions, 0);
         for (var x = 0; x < grid.length; x++) {
            var item = paper.rect(x * size + margin, margin, size, size)
                            .attr({"stroke-width": 2, stroke: "black", fill: "white"});
            if (isInteractive) {
               item.click(clickHandler(x));
            }
         }
      }else{
         if (hasBackground) {
            paper.image("bg_map_claire.png", 0, 0, paperWidth, paperHeight).attr({"opacity": 0.5});
         }
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
      }
      return paper;
   };

   var clickHandler = function(x,y) {
      return function() { toggleAt(x,y); };
   };

   var toggleAt = function(x,y) {
      if (level == "easy") {
         answer[x] = 1 - answer[x];
      } else if(level == "medium"){
         answer[x] = ((answer[x] + 3) % 3) - 1;
      }else{
         answer[x][y] = 1 - answer[x][y];
         Beav.Dom.showOrHide(mapElements2[x][y], answer[x][y]);
      }
      updateMap(mapElements2, answer);
      displayHelper.stopShowingResult();
   };

   var goodAnswer = function() {
      return Beav.Object.eq(answer, mapAfter);
   };

   var countItems = function(mapItems, size) {
      if(level != "hard"){
         return Beav.Array.filterCount(mapItems, function(v,x) { 
            return v == size; }); 
      }else{
         return Beav.Matrix.filterCount(mapItems, function(v,x,y) { return v; });
      }
      
   };

   var updateDisplay = function() {
      updateMap(mapElements2, answer);
   }
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
