function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         nbColumns: 16,
         nbLines: 5,
         colStart: 0,
         colEnd: 10,
         nbSelectedMinimum: 2
      },
      medium: {
         nbColumns: 16,
         nbLines: 5,
         colStart: 1,
         colEnd: 15,
         nbSelectedMinimum: 3
      },
      hard: {
         nbColumns: 32,
         nbLines: 6,
         colStart: 13,
         colEnd: 31,
         nbSelectedMinimum: 4
      }
   };
   var nbSelectedMinimum;
   var nbColumns;
   var nbCells = 2*nbColumns - 1;
   var nbLines;
   var cellWidth = 24;
   var cellHeight = 40;
   var margin = 2;
   var cellSpan = []; // map cellID to the pair left/right
   var cells = [];
   var texts = [];
   var isCellSelected = [];
   var nbSelected = 0;
   var colStart;
   var colEnd;
   var selectedColor = '#80FF80';

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      nbColumns = data[level].nbColumns;
      nbLines = data[level].nbLines;
      nbSelectedMinimum = data[level].nbSelectedMinimum;
      colStart = data[level].colStart;
      colEnd = data[level].colEnd;
      initCellSpan();
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
      buildTree('sample', 3, 4, 0, 2, "sample");
      buildTree('anim', nbLines, nbColumns, colStart, colEnd, "task");
      for (var iCell = 0; iCell < answer.length; iCell++) {
         setCellSelected(answer[iCell], true, true);
      }
      updateMessage();
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
      var nbSelected = answer.length;
      if (nbSelected == 0) {
         result = { successRate: 0, message: taskStrings.clickOnCells }; 
      } else if (! isCovered(answer)) {
         result = { successRate: 0, message: taskStrings.failure }; 
      } else {
         if (nbSelected <= nbSelectedMinimum) {
            result = { successRate: 1, message: taskStrings.boxesSelectedFinal(nbSelected)+taskStrings.success }; 
         } else {
            result = { successRate: 0, message: taskStrings.boxesSelectedFinal(nbSelected)+taskStrings.partialFailure };  
         }
      }
      return result;
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initCellSpan() {
      var cellID = 1;
      var cellColumns = nbColumns;
      for (var iLin = 0; iLin < nbLines; iLin++) {
         for (var iCol = 0; iCol < nbColumns; iCol += cellColumns) {
            cellSpan[cellID] = [iCol, iCol+cellColumns];
            cellID++;
         }
         cellColumns /= 2;
      }
   };

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
         if($.inArray(cellID,answer) == -1) {
            answer.push(cellID);
         }
      } else {
         if (display) {
            cells[cellID].attr({'fill': 'white'});
         }
         deltaSelected = -1;
         answer.splice($.inArray(cellID, answer),1);
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
      var paper = subTask.raphaelFactory.create(divID,divID,cols * cellWidth + 2, lines * cellHeight + 2 * margin);
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

   var getSelectedCells = function() {
      var selectedCells = [];
      for (var iCell = 1; iCell <= nbCells; iCell++) {
         if (isCellSelected[iCell]) {
            selectedCells.push(iCell);
         }
      }
      return selectedCells;
   };

}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
