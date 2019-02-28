function initTask() {
   var nbColumns = 32;
   var nbLines = 6;
   var cellWidth = 24;
   var cellHeight = 40;
   var margin = 2;
   var cells = [];
   var texts = [];
   var isCellSelected = [];
   var nbTimesCovered = [];
   var nbCellsCovered = 0;
   var seed = 1;
   var solved = false;
   var nbSelected = 0;
   var colStart = 13;
   var colEnd = 31;
   var selectedColor = '#80FF80';

   var isCovered = function() {
      for (var cellID = colStart; cellID < colEnd; cellID++) {
         if (nbTimesCovered[cellID] == 1) {
            return false;
         }
      }
      if (nbCellsCovered != (colEnd - colStart)) {
         return false;
      }
      return true;
   }

   var setCellSelected = function(cellID, selected, display) {
      var deltaSelected = 0;
      if (selected) {
         if (display) {
            cells[cellID].attr({'fill': selectedColor});
         }
         deltaSelected = 1;
      } else {
         if (display) {
            cells[cellID].attr({'fill': 'white'});
         }
         deltaSelected = -1;
      }
      if (isCellSelected[cellID] == selected) {
         deltaSelected = 0;
      }
      isCellSelected[cellID] = selected;
      nbSelected += deltaSelected;
      var cellInterval = getCellInterval(cellID);
      for (var coveredCellID = cellInterval.start; coveredCellID < cellInterval.end; coveredCellID++) {
         nbTimesCovered[coveredCellID] += deltaSelected;
         nbCellsCovered += deltaSelected;
      }
      if (display) {
         updateMessage();
      }
   }

   var updateMessage = function() {
      var plural = "";
      if (nbSelected > 1) {
         plural = "s";
      }
      var msg = "Cliquez sur les cases pour les sélectionner";
      if (nbSelected > 0) {
         msg = nbSelected + " case" + plural + " sélectionnée" + plural + ".";
      }
      $("#result").html(msg);
   }

   var setClick = function(rect, cellID) {
      rect.node.onclick = function() {
         if (solved) {
            return;
         }
         setCellSelected(cellID, !isCellSelected[cellID], true);
      }
   };

   var getCellInterval = function(cellID) {
      var interval = {start: cellID, end: cellID + 1};
      while (interval.start < 32) {
         interval.start = interval.start * 2;
         interval.end = interval.end * 2;
      }
      return interval;
   };

   var buildTree = function(divID, lines, cols, selStart, selEnd, type) {
      // type = "sample", or "task" or "solution"
      var sampleValues = [0, 16, 5, 11, 1, 4, 3, 8];
      var solutionCells = [6, 14, 23, 30, 45, 62];
      var paper = Raphael(divID, cols * cellWidth + 2, lines * cellHeight + 2 * margin);
      var cellColumns = cols;
      var cellID = 1;
      for (var iLin = 0; iLin < lines; iLin++) {
         for (var iCol = 0; iCol < cols; iCol += cellColumns) {
            var x = iCol * cellWidth + 2;
            var y = margin + iLin * cellHeight + 2;
            var width = cellWidth * cellColumns;
            var rect = paper.rect(x, y, width - 2, cellHeight - 4);
            var fill = 'white';
            if (type == "sample") {
               var text = paper.text(x + width / 2, y + cellHeight / 2, sampleValues[cellID]);
               text.attr({"font-size": 20, "font-weight": "bold"});
               texts[cellID] = text;
               if (cellID == 2) {
                  fill = selectedColor;
               }
            } else if (type == "task") {
               cells[cellID] = rect;
               nbTimesCovered[cellID] = 0;
               setClick(rect, cellID);
            } else if (type == "solution") {
               if (Beav.Array.has(solutionCells, cellID)) {
                  fill = selectedColor;
               }
            }
            rect.attr({'stroke': 'black', 'fill': fill});
            cellID++;
         }
         cellColumns /= 2;
      }
      var x = selStart * cellWidth + 2;
      var y = margin + (lines - 1) * cellHeight;
      var width = (selEnd - selStart) * cellWidth;
      var bigRect = paper.rect(x, y, width, cellHeight);
      bigRect.attr({'stroke': 'black', 'stroke-width': 4});
   }

   task.load = function(views, callback) {
      buildTree('sample', 3, 4, 0, 2, "sample");
      buildTree('anim', nbLines, nbColumns, colStart, colEnd, "task");
      if (views.solution) {
         buildTree('animSolution', nbLines, nbColumns, colStart, colEnd, "solution");
      }
      updateMessage();
      callback();
   };

   task.getAnswer = function(callback) {
      var selectedCells = [];
      for (var iCell = 1; iCell <= 64; iCell++) {
         if (isCellSelected[iCell]) {
            selectedCells.push(iCell);
         }
      }
      callback(JSON.stringify(selectedCells));
   };

   var innerReloadAnswer = function(strAnswer, display) {
      var answer = [];
      if (strAnswer != "") {
         answer = $.parseJSON(strAnswer);
      }
      for (var cellID = 1; cellID <= 64; cellID++) {
         if (isCellSelected[cellID]) {
            setCellSelected(cellID, false, true);
         }
      }
      for (var iCell = 0; iCell < answer.length; iCell++) {
         setCellSelected(answer[iCell], true, true);
      }
   }

   task.reloadAnswer = function(strAnswer, callback) {
      innerReloadAnswer(strAnswer, true);
      callback();
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      innerReloadAnswer(strAnswer, false);
      platform.getTaskParams(null, null, function(taskParams) {
         if (!isCovered()) {
            callback(taskParams.minScore, "La somme des cases sélectionnées ne correspond pas à la somme du cadre noir.");
         } else {
            var score = Math.max(taskParams.minScore, taskParams.maxScore - (nbSelected - 6));
            var msg = "La somme correspond. Vous avez selectionné " + nbSelected + " cases.";
            if (nbSelected == 6) {
               msg += " Bravo ! C'est le minimum possible.";
            } else {
               msg += " Essayez de sélectionner moins de cases.";
            }
            callback(score, msg);
         }   
      });
   };
}

initTask();
