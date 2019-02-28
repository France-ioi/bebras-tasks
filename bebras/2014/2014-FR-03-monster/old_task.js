function initTask() {
   var difficulty;
   var paperWidth = 445;
   var paperHeight = 450;
   var nbColumns = 17;
   var nbLines = 17;
   var cellSize = 25;
   var margin = 10;
   var hasWall = [];
   var wallRanks = [];
   var bestSteps = 6; 
   var ghostMaxInit = 126; 
   var makeDebugVersion = function() {
      bestSteps = 3;
      ghostMaxInit = 5;
   };
   var ghostMin;
   var ghostMax; 
   var nbSteps = 0;
   var minNbSteps = 10000;
   var cells;
   var monster;
   var randomSeed;

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
      rect.node.onclick = function() {
         if (ghostMin >= ghostMax) // to prevent clicking after the end
            return;
         var rank = cellRank(iLig, iCol);
         if ((rank >= 0) && (!hasWall[rank])) {
            wallRanks.push(rank);
            addWall(rank);
            updateDisplay();
         }
         if (ghostMin >= ghostMax) {
            platform.validate("done");
         }
      }
   };

   var updateDisplay = function() {
      var statusMsg = "Cliquez pour placer des barrages.";
      if (nbSteps > 0) {
         statusMsg = "Nombre de barrages utilisés&nbsp;: " + nbSteps + ".";
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
      // assumes wallRanks has been set
      hasWall = [];
      ghostMin = 0;
      ghostMax = ghostMaxInit;
      nbSteps = 0;
      for (var iWall = 0; iWall < wallRanks.length; iWall++) {
         addWall(wallRanks[iWall]);
      }
   };

   var reloadAnswerNoDisplay = function(strAnswer) {
      if (strAnswer == "") {
         wallRanks = [];
      } else {
         wallRanks = $.parseJSON(strAnswer);
      }
      innerReloadAnswerNoDisplay();
   };

   var cellRank = function(iLig, iCol) {
      if ((iLig == 0) || (iLig == nbLines - 1) || (iCol == 0) || (iCol == nbColumns - 1)) {
         return -1;
      }
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
   };

   task.load = function(views, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         difficulty = taskParams.options.difficulty ? taskParams.options.difficulty : "hard";
         if (difficulty == "debug") { 
            makeDebugVersion(); 
         }
         randomSeed = taskParams.randomSeed;
         
         ghostMin = 0;
         ghostMax = ghostMaxInit;

         $("#anim").width(paperWidth).height(paperHeight);
         paper = Raphael(document.getElementById('anim'), nbColumns * cellSize + 2 * margin, nbLines * cellSize + 2 * margin);

         var setRectGrille = paper.set();

         // tower code assumes nbColmuns = nbLines
         var towerPos = [ Math.floor(nbColumns/4), Math.floor(nbColumns/2), Math.floor(nbColumns*3/4), 0, Math.floor(nbColumns-1) ];
         var towerSize = 7;
         var towerAttr = {'fill': '#FF8888', 'stroke': '#000000'};
         for (var iTower = 0; iTower < towerPos.length; iTower++) {
            paper.rect(margin + towerPos[iTower] * cellSize, margin - towerSize, cellSize, towerSize).attr(towerAttr);
            paper.rect(margin + towerPos[iTower] * cellSize, margin + nbColumns * cellSize, cellSize, towerSize).attr(towerAttr);
            paper.rect(margin - towerSize, margin + towerPos[iTower] * cellSize, towerSize, cellSize).attr(towerAttr);
            paper.rect(margin + nbColumns * cellSize, margin + towerPos[iTower] * cellSize, 8, cellSize).attr(towerAttr);
         }

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
         callback();
      });
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify(wallRanks));
   };

   task.reloadAnswer = function(strAnswer, callback) {
      reloadAnswerNoDisplay(strAnswer);
      updateDisplay();
      callback();
   };

   task.cancelLastStep = function() {
      if (wallRanks.length > 0) {
         wallRanks.pop();
      }
      innerReloadAnswerNoDisplay();
      updateDisplay();
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         randomSeed = taskParams.randomSeed;
         reloadAnswerNoDisplay(strAnswer);
         if (ghostMin >= ghostMax) {
            var msg = "";
            if (nbSteps > bestSteps) {
               msg = "Vous avez capturé le monstre&nbsp;! Essayez maintenant d'utiliser moins de barrages.";
            } else {
               msg = "Bravo, vous avez capturé le monstre avec le nombre minimum de barrages&nbsp;!";
            }
            var extraSteps = nbSteps - bestSteps;
            var score = Math.max(taskParams.minScore, taskParams.maxScore - extraSteps);
            callback(score, msg);
         } else {
            callback(taskParams.minScore, "Vous n'avez pas capturé le monstre.");
         }
      });
   };
}

initTask();
