function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         nbColumns: 17,
         nbLines: 3,
         ghostMaxInit: 14,
         bestSteps: 3
      },
      medium: {
         nbColumns: 17,
         nbLines: 5,
         ghostMaxInit: 30,
         bestSteps: 4
      },
      hard: {
         nbColumns: 17,
         nbLines: 17,
         ghostMaxInit: 126,
         bestSteps: 6
      }
   };
   var paperWidth;
   var paperHeight;
   var nbColumns;
   var nbLines;
   var cellSize = 25;
   var margin = 10;
   var hasWall = [];
   var bestSteps; 
   var ghostMin;
   var ghostMax; 
   var nbSteps = 0;
   var minNbSteps = 10000;
   var cells;
   var monster;
   var randomSeed;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      randomSeed = subTask.taskParams.randomSeed;
      ghostMin = 0;
      ghostMax = data[level].ghostMaxInit;
      nbColumns = data[level].nbColumns;
      nbLines = data[level].nbLines;
      bestSteps = data[level].bestSteps;
      paperWidth = nbColumns * cellSize + 2 * margin;
      paperHeight = nbLines * cellSize + 2 * margin;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
         innerReloadAnswerNoDisplay();
      }
   };

   subTask.resetDisplay = function() {
      initMoat();
      initUndo();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [];
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      var result;
      innerReloadAnswerNoDisplay();
      if (ghostMin >= ghostMax) {
         if (nbSteps > bestSteps) {
            result = { successRate: 0.5, message: taskStrings.almost };
         } else {
            result = { successRate: 1, message: taskStrings.success };
         }
         // var extraSteps = nbSteps - bestSteps;
         // var score = Math.max(subTask.taskParams.minScore, subTask.taskParams.maxScore - extraSteps);
      } else {
         result = { successRate: 0, message: taskStrings.failure };
      }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initMoat() {
      $("#anim").width(paperWidth).height(paperHeight);
      paper = subTask.raphaelFactory.create("anim","anim",paperWidth,paperHeight);
      var setRectGrille = paper.set();
      placeTowers();

      cells = [];
      for (var iLig = 0; iLig < nbLines; iLig++) {
         cells[iLig] = [];
         for (var iCol = 0; iCol < nbColumns; iCol++) {
            var rect = paper.rect(margin + iCol * cellSize, margin + iLig * cellSize, cellSize, cellSize);
            cells[iLig].push(rect);
            var fill = '#ffff00';
            if (cellRank(iLig, iCol) == -1) {
               fill = '#808080';
            }
            rect.attr({'stroke': '#000000', 'fill': fill});
            setClick(rect, iLig, iCol);
            setRectGrille.push(rect);
         }
      }
      monster = paper.image("monster.png", 0, 0, cellSize-2, cellSize-2 -4).hide();
      updateDisplay();
   };

   function initUndo() {
      $("#cancelLast").off("click");
      $("#cancelLast").click(cancelLastStep);
   };

   function placeTowers() {
      var towerPos = [];
      for(var iDirection = 0; iDirection < 2; iDirection++){
         var n = (iDirection == 0) ? nbLines : nbColumns;
         var pos;
         if(n <= 3){
            pos = [ 0, Math.floor(n-1) ];
         }else if(n >= 5 && n < 9){
            pos = [ 0, Math.floor(n/2), Math.floor(n-1) ];
         }else if(n >= 9 && n < 13){
            pos = [ 0, Math.floor(n/3), Math.floor(n*2/3),Math.floor(n-1) ];
         }else if(n >= 13){
            pos = [ Math.floor(n/4), Math.floor(n/2), Math.floor(n*3/4), 0, Math.floor(n-1) ];
         }
         towerPos[iDirection] = pos;
      }
      var towerSize = 7;
      var towerAttr = {'fill': '#FF8888', 'stroke': '#000000'};
      for(var iDir = 0; iDir < 2; iDir++){
         var n = (iDir == 1) ? nbLines : nbColumns;
         for (var iTower = 0; iTower < towerPos[iDir].length; iTower++) {
            var x1 = (iDir == 1) ? margin + towerPos[iDir][iTower] * cellSize : margin - towerSize;
            var x2 = (iDir == 1) ? x1 : margin + n * cellSize;
            var y1 = (iDir == 1) ? margin - towerSize : margin + towerPos[iDir][iTower] * cellSize;
            var y2 = (iDir == 1) ? margin + n * cellSize : y1;
            var w = (iDir == 1) ? cellSize : towerSize;
            var h = (iDir == 1) ? towerSize : cellSize;
            paper.rect(x1,y1,w,h).attr(towerAttr);
            paper.rect(x2,y2,w,h).attr(towerAttr);
         }
      }
   };

   var addWall = function(rank) {
      nbSteps++;
      hasWall[rank] = true;
      if ((rank >= ghostMin) && (rank <= ghostMax)) {
         var nbLeft = rank - ghostMin;
         var nbRight = ghostMax - rank;
         var keepLeft = true;
         if (nbLeft > nbRight) {
            keepLeft = true;
         } else if (nbLeft < nbRight) {
            keepLeft = false;
         } else {
            keepLeft = Beav.Random.bit(randomSeed, nbSteps);
         }
         if (keepLeft)  {
            ghostMax = rank - 1;
         } else {
            ghostMin = rank + 1;
         }
      }
   };

   var setClick = function(rect, iLig, iCol) {
      cells[iLig][iCol].click(function(){
         if (ghostMin >= ghostMax) // to prevent clicking after the end
            return;
         var rank = cellRank(iLig, iCol);
         if ((rank >= 0) && (!hasWall[rank])) {
            answer.push(rank);
            addWall(rank);
            updateDisplay();
         }
         if (ghostMin >= ghostMax) {
            platform.validate("done");
         }
      });
   };

   var updateDisplay = function() {
      var statusMsg = taskStrings.click;
      if (nbSteps > 0) {
         statusMsg = taskStrings.nbOfDams(nbSteps);
      }
      $("#status").html(statusMsg);
      monster.hide();
      for (var iLig = 0; iLig < nbLines; iLig++) {
         for (var iCol = 0; iCol < nbColumns; iCol++) {
            var rank = cellRank(iLig, iCol);
            var fill = '#808080';
            if (hasWall[rank]) {
               fill = '#ff0000';
            } else if (rank >= 0) {
               if ((rank >= ghostMin) && (rank <= ghostMax)) {
                  fill = '#00FFFF';
                  if (ghostMin == ghostMax) {
                     monster.attr({x: margin + 1 + iCol * cellSize, y: margin + 1 + iLig * cellSize + 2, transform:''}).show();
                  }
               } else {
                  fill = '#ffffff';
               }
            }
            cells[iLig][iCol].attr({fill: fill});
         }
      }
   };

   var innerReloadAnswerNoDisplay = function() {
      hasWall = [];
      ghostMin = 0;
      ghostMax = data[level].ghostMaxInit;
      nbSteps = 0;
      for (var iWall = 0; iWall < answer.length; iWall++) {
         addWall(answer[iWall]);
      }
   };

   var cellRank = function(iLig, iCol) {
      if ((iLig == 0) || (iLig == nbLines - 1) || (iCol == 0) || (iCol == nbColumns - 1)) {
         return -1;
      }
      if(level == "easy"){
         return (iCol - 1);
      // }else if(level == "medium"){

      }else{
         
         var ligDiv4 = Math.floor(iLig / 4);
         if ((iLig % 4 == 0) && (iCol == 1)) {
            return ligDiv4 * 32 - 1;
         }
         if ((iLig % 4 == 2) && (iCol == nbColumns - 2)) {
            return 16 + ligDiv4 * 32 - 1;
         }
         if (iLig % 4 == 1) {
            return ligDiv4 * 32 + (iCol - 1);
         }
         if (iLig % 4 == 3) {
            return ligDiv4 * 32 + 16 + (nbColumns - iCol - 2);
         }
         return -1;
      }
   };

   function cancelLastStep() {
      if (answer.length > 0) {
         answer.pop();
      }
      innerReloadAnswerNoDisplay();
      updateDisplay();
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();

