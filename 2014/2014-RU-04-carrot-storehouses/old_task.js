function initTask() {
   var nbSelectedMinimum = 4;
   var nbColumns = 32;
   var nbCells = 2*nbColumns - 1;
   var nbLines = 6;
   var cellWidth = 24;
   var cellHeight = 40;
   var margin = 2;
   var cellSpan = []; // map cellID to the pair left/right
   var cells = [];
   var texts = [];
   var isCellSelected = [];
   var seed = 1;
   var nbSelected = 0;
   var colStart = 13;
   var colEnd = 31;
   var selectedColor = '#80FF80';

   var isCovered = function(selectedCells) {
      var visited = Beav.Array.init(nbColumns+1, function(col) { return false; });
      var adjList = Beav.Array.init(nbColumns+1, function(col) { return []; });
      $.each(selectedCells, function(i, cellID) {
         var span = cellSpan[cellID];
         adjList[span[0]].push(span[1]);
         adjList[span[1]].push(span[0]);
      });
      var dfs = function dfs(col) {
         if (visited[col]) {
            return;
         }
         visited[col] = true;
         $.each(adjList[col], function(i, colTarget) {
            dfs(colTarget);
         });
      };
      dfs(colStart);
      return visited[colEnd];
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
      if (display) {
         updateMessage();
      }
   }

   var updateMessage = function() {
      var msg = taskStrings.clickOnCells;
      if (nbSelected > 0) {
         msg = taskStrings.boxesSelected(nbSelected);
      }
      $("#result").html(msg);
   }

   var setClick = function(rect, cellID) {
      rect.node.onclick = function() {
         displayHelper.stopShowingResult();
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
      // type = "sample", or "task" or "solutionHalf" or "solutionFull"
      var sampleValues = [0, 16, 5, 11, 1, 4, 3, 8];
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
               setClick(rect, cellID);
            } else if (type == "solutionHalf") {
               if (Beav.Array.has(task.solutions.half, cellID)) {
                  fill = selectedColor;
               }
            } else if (type == "solutionFull") {
               if (Beav.Array.has(task.solutions.full, cellID)) {
                  fill = selectedColor;
               }
            }
            rect.attr({'stroke': 'black', 'fill': fill});
            cellSpan[cellID] = [iCol, iCol+cellColumns];
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
         setTimeout(function(){ // timeout as workaround for raphael
            buildTree('animSolutionHalf', nbLines, nbColumns, colStart, colEnd, "solutionHalf");
            // buildTree('animSolutionFull', nbLines, nbColumns, colStart, colEnd, "solutionFull");
         });
      }
      updateMessage();
      callback();
   };

   var getSelectedCells = function() {
      var selectedCells = [];
      for (var iCell = 1; iCell <= nbCells; iCell++) {
         if (isCellSelected[iCell]) {
            selectedCells.push(iCell);
         }
      }
      return selectedCells;
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify(getSelectedCells()));
   };

   var selectedCellsOfStrAnswer = function(strAnswer) {
      var answer = [];
      if (strAnswer != "") {
         answer = $.parseJSON(strAnswer);
      }
      return answer;
   };

   var innerReloadAnswer = function(strAnswer, display) {
      var selectedCells = selectedCellsOfStrAnswer(strAnswer);
      for (var cellID = 1; cellID <= nbCells; cellID++) {
         if (isCellSelected[cellID]) {
            setCellSelected(cellID, false, true);
         }
      }
      for (var iCell = 0; iCell < selectedCells.length; iCell++) {
         setCellSelected(selectedCells[iCell], true, true);
      }
   }

   task.reloadAnswer = function(strAnswer, callback) {
      innerReloadAnswer(strAnswer, true);
      callback();
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      var selectedCells = selectedCellsOfStrAnswer(strAnswer);
      taskParams = platform.getTaskParams(null, null, function(taskParams) {
         var nbSelected = selectedCells.length;
         if (nbSelected == 0) {
            callback(taskParams.noScore, "");         
         } else if (! isCovered(selectedCells)) {
            callback(taskParams.minScore, taskStrings.failure);
         } else {
            var score = Math.max(taskParams.minScore + 1, taskParams.maxScore - (nbSelected - nbSelectedMinimum));
            var msg = taskStrings.boxesSelectedFinal(nbSelected) + " ";
            if (nbSelected == nbSelectedMinimum) {
               msg += taskStrings.success;
            } else {
               msg += taskStrings.partialFailure;
            }
            callback(score, msg);
         }
      });
   };
}

initTask();
