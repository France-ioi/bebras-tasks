function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         grid: [
            [2, 1, 0, 2, 2, 7],
            [0, 1, 1, 2, 2, 6],
            [1, 2, 3, 0, 1, 6],
            [0, 1, 2, 1, 0, 4],
            [1, 0, 0, 0, 0, 1],
            [0, 2, 1, 1, 0, 4],
            [4, 7, 6, 6, 5, 28]
         ],
         errors: 1
      },
      medium: {
         grid: [
            [2, 0, 1, 3, 0, 6],
            [1, 1, 1, 2, 3, 9],
            [3, 1, 2, 1, 0, 7],
            [1, 3, 2, 0, 1, 7],
            [2, 0, 0, 1, 1, 3],
            [0, 1, 0, 2, 3, 6],
            [9, 7, 6, 8, 8, 38]
         ],
         errors: 2
      },
      hard: {
         grid: [
            [1, 3, 0, 0, 3, 7],
            [1, 0, 2, 4, 1, 8],
            [0, 1, 2, 0, 3, 4],
            [1, 3, 2, 0, 1, 7],
            [0, 2, 1, 1, 0, 3],
            [2, 0, 0, 2, 1, 4],
            [5, 5, 7, 7, 9, 32]
         ],
         errors: 5
      }
   };

   var paper;
   var paperWidth;
   var paperHeight;

   var digitSources;
   var cellContainers;
   var dragAndDrop;
   var grid;
   var gridWidth;
   var gridHeight;
   var numericRows;
   var numericCols;
   var errorLabels;

   var paperParams = {
      xPad: 40,
      yPad: 20,
      gridTopPad: 60,
      digitSourceY: 40
   };

   var digitParams = {
      leftX: 10,
      width: 68,
      height: 44,
      rectAttr: {
         fill: "#ccccff"
      },
      textAttr: {
         "font-size": 18,
         "font-weight": "bold"
      }
   };

   var gridParams = {
      leftX: 50,
      numericWidth: 76,
      firstWidth: 120,
      cellHeight: 50,
      cellPadX: 1,
      cellPadY: 1,
      lineAttr: {
         "stroke-width": 2,
         stroke: "#000000"
      },
      digitTextAttr: {
         "font-size": 18
      },
      headerTextAttr: {
         "font-size": 16
      },
      totalRectAttr: {
         fill: "#bbbbbb",
         "stroke-width": 0
      },
      errorRectAttr: {
         stroke: "#ff0000",
         "stroke-width": 4
      },
      errorOffset: {
         x: 100,
         y: 50,
         yOddExtra: 40
      },
      errorTextAttr: {
         "font-size": 16,
         fill: "#ff0000",
         "font-weight": "bold"
      },
      headerRectAttr: {
         fill: "#aaffaa",
         "stroke-width": 0
      }
   };

   subTask.loadLevel = function(curLevel, curState) {
      level = curLevel;
      state = curState;
      numericRows = data[level].grid.length;
      numericCols = data[level].grid[0].length;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initPaper();
      initGrid();
      initDragAndDrop();

      errorLabels = {};
      refreshErrors(false);
      showFeedback(null);
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return {};
   };

   subTask.getDefaultStateObject = function() {
      return {};
   };

   subTask.unloadLevel = function(callback) {
      if(grid) {
         grid.remove();
      }
      if(dragAndDrop) {
         dragAndDrop.disable();
      }
      callback();
   };

   function initPaper() {
      gridWidth = gridParams.firstWidth + gridParams.numericWidth * numericCols;
      gridHeight = paperParams.gridTopPad + gridParams.cellHeight * (numericRows + 1);

      paperWidth = digitParams.width * 10 + 2 * paperParams.xPad;
      paperHeight = paperParams.digitSourceY + gridHeight + 2 * paperParams.yPad + gridParams.errorOffset.yOddExtra;
      paper = subTask.raphaelFactory.create("anim", "anim", paperWidth, paperHeight);
   }
   
   function initGrid() {
      var leftX = gridParams.leftX;
      var cellWidths = [gridParams.firstWidth].concat(Beav.Array.make(numericCols, gridParams.numericWidth));
      grid = new Grid("anim", paper, numericRows + 1, numericCols + 1, cellWidths, gridParams.cellHeight, leftX, paperParams.digitSourceY + paperParams.gridTopPad, gridParams.lineAttr);

      for(var row = 0; row < numericRows + 1; row++) {
         for(var col = 0; col < numericCols + 1; col++) {
            grid.addToCell(cellFiller, {row: row, col: col});
         }
      }
   }

   function cellFiller(cellData) {
      var row = cellData.row;
      var col = cellData.col;
      var xPos = cellData.xPos;
      var yPos = cellData.yPos;
      var width = cellData.cellWidth;
      var height = cellData.cellHeight;
      var centerX = xPos + width / 2;
      var centerY = yPos + height / 2;
      
      var result = [];

      var background;
      var text;

      if((row === 0 && col < numericCols) || (col === 0 && row < numericRows)) {
         background = paper.rect(xPos + gridParams.cellPadX, yPos + gridParams.cellPadY, width - 2 * gridParams.cellPadX, height - 2 * gridParams.cellPadY).attr(gridParams.headerRectAttr);
      }

      if((row == numericRows) || col == numericCols) {
         background = paper.rect(xPos + gridParams.cellPadX, yPos + gridParams.cellPadY, width - 2 * gridParams.cellPadX, height - 2 * gridParams.cellPadY).attr(gridParams.totalRectAttr);
      }

      if(row === 0 && col > 0) {
         text = paper.text(centerX, centerY, taskStrings.colNames[col - 1]).attr(gridParams.headerTextAttr);
      }

      if(col === 0 && row > 0) {
         text = paper.text(centerX, centerY, taskStrings.rowNames[row - 1]).attr(gridParams.headerTextAttr);
      }

      if(row > 0 && col > 0) {
         text = paper.text(centerX, centerY, data[level].grid[row - 1][col - 1]).attr(gridParams.digitTextAttr);
      }

      if(background) {
         result.push(background);
      }
      if(text) {
         result.push(text);
      }

      return result;
   }

   function initDragAndDrop() {
      dragAndDrop = DragAndDropSystem({
         paper: paper,
         actionIfDropped: actionIfDropped,
         drop: onDrop,
         canBeTaken: canBeTaken
      });

      var leftX = digitParams.leftX; 
      digitSources = {};
      for(var digit = 0; digit < 10; digit++) {
         digitSources[digit] = dragAndDrop.addContainer({
            ident: "source_" + digit,
            cx: leftX + digit * digitParams.width + digitParams.width / 2,
            cy: paperParams.digitSourceY,
            widthPlace: digitParams.width,
            heightPlace: digitParams.height,
            type: "source",
            sourceElemArray: [drawUserDigit(digit)]
         });
      }

      cellContainers = Beav.Matrix.make(numericRows, numericCols, null);
      for(var numericRow = 0; numericRow < numericRows - 1; numericRow++) {
         for(var numericCol = 0; numericCol < numericCols - 1; numericCol++) {
            var center = grid.getCellCenter(numericRow + 1, numericCol + 1);
            cellContainers[numericRow][numericCol] = dragAndDrop.addContainer({
               ident: "cell_" + numericRow + "_" + numericCol,
               cx: center.x,
               cy: center.y,
               widthPlace: gridParams.numericWidth,
               heightPlace: gridParams.cellHeight,
               nbPlaces: 1,
               dropMode: "replace",
               placeBackgroundArray: []
            });
         }
      }

      for(var cell in answer) {
         var curDigit = dragIDToDigit(answer[cell]);
         dragAndDrop.insertObjects(cell, 0, [{
            ident: answer[cell],
            elements: drawUserDigit(curDigit)
         }]);
      }
   }

   function canBeTaken() {
      showFeedback(null);
      return true;
   }

   function actionIfDropped(srcCont, srcPos, dstCont, dstPos, dropType) {
      return dstCont == null || dstCont.substring(0, 4) == "cell";
   }

   function onDrop(srcContainerID, srcPos, dstContainerID, dstPos, dropType) {
      // Same container means no effect.
      if(srcContainerID == dstContainerID) {
         return;
      }

      var fromCell = srcContainerID.substring(0, 4) == "cell";

      // From cell digit anywhere, deletes that cell.
      if(fromCell) {
         delete answer[srcContainerID];
      }

      // Dragging to outside, we are done.
      if(dstContainerID == null) {
         if(fromCell) {
            refreshErrors(false);
         }
         else {
            // Dragging from a source digit to an invalid location.
            showFeedback(taskStrings.invalidDrop);
         }
         return;
      }

      answer[dstContainerID] = dragAndDrop.getObjects(dstContainerID)[0];
      refreshErrors(false);
   }

   function drawUserDigit(digit) {
      paper.setStart();
      paper.rect(
         - digitParams.width / 2,
         - digitParams.height / 2,
         digitParams.width,
         digitParams.height
      ).attr(digitParams.rectAttr);
      paper.text(0, 0, digit).attr(digitParams.textAttr);
      return paper.setFinish();
   }

   function refreshErrors(validateOnSuccess) {
      var allErrors = getErrors();
      var cell;
      var hasError = false;
      for(var numericRow = 0; numericRow < numericRows - 1; numericRow++) {
         if(allErrors.rows[numericRow] !== undefined && allErrors.rows[numericRow] !== null) {
            highlightError(numericRow + 1, numericCols, allErrors.rows[numericRow]);
            hasError = true;
         }
         else {
            unhighlightError(numericRow + 1, numericCols);
         }
      }
      for(var numericCol = 0; numericCol < numericCols - 1; numericCol++) {
         if(allErrors.cols[numericCol] !== undefined && allErrors.cols[numericCol] !== null) {
            hasError = true;
            highlightError(numericRows, numericCol + 1, allErrors.cols[numericCol]);
         }
         else {
            unhighlightError(numericRows, numericCol + 1);
         }
      }
      if(!hasError && validateOnSuccess) {
         platform.validate("done");
      }
   }

   function highlightError(row, col, userSum) {
      // grid.highlightCell(row, col, gridParams.errorRectAttr); DEPRECATED

      var id = row + "_" + col;
      if(errorLabels[id]) {
         errorLabels[id].remove();
      }
      var cellCenter = grid.getCellCenter(row, col);
      if(row == numericRows) {
         cellCenter.y += gridParams.errorOffset.y;
         var parityShiftedLabel = (level == "easy") ? 0 : 1;
         if (col % 2 == parityShiftedLabel) {
           cellCenter.y += gridParams.errorOffset.yOddExtra;
         }
      }
      if(col == numericCols) {
         cellCenter.x += gridParams.errorOffset.x;
      }
      errorLabels[id] = paper.text(cellCenter.x, cellCenter.y, taskStrings.errorLabel(userSum)).attr(gridParams.errorTextAttr);
   }

   function unhighlightError(row, col) {
      grid.unhighlightCell(row, col);

      var id = row + "_" + col;
      if(errorLabels[id]) {
         errorLabels[id].remove();
         delete errorLabels[id];
      }
   }

   function getErrors() {
      var result = {
         rows: {},
         cols: {}
      };

      var sum, numericRow, numericCol, cellID;

      for(numericRow = 0; numericRow < numericRows - 1; numericRow++) {
         sum = 0;
         for(numericCol = 0; numericCol < numericCols - 1; numericCol++) {
            cellID = "cell_" + numericRow + "_" + numericCol;
            if(answer[cellID] !== undefined) {
               sum += dragIDToDigit(answer[cellID]);
            }
            else {
               sum += data[level].grid[numericRow][numericCol];
            }
         }
         if(sum !== data[level].grid[numericRow][numericCols - 1]) {
            result.rows[numericRow] = sum;
         }
      }

      for(numericCol = 0; numericCol < numericCols - 1; numericCol++) {
         sum = 0;
         for(numericRow = 0; numericRow < numericRows - 1; numericRow++) {
            cellID = "cell_" + numericRow + "_" + numericCol;
            if(answer[cellID] !== undefined) {
               sum += dragIDToDigit(answer[cellID]);
            }
            else {
               sum += data[level].grid[numericRow][numericCol];
            }
         }
         if(sum !== data[level].grid[numericRows - 1][numericCol]) {
            result.cols[numericCol] = sum;
         }
      }

      return result;
   }

   function countAnswerCells() {
      var result = 0;
      for(var cell in answer) {
         result++;
      }
      return result;
   }

   function dragIDToDigit(id) {
      return parseInt(id.split("_")[1]);
   }

   function showFeedback(string) {
      if(string) {
         $("#feedback").html(string);
         // $("#feedback").show(); DEPRECATED
      }
      else {
         $("#feedback").html("");
         // $("#feedback").hide(); DEPRECATED
      }
   }

   function verifyFormat() {
      for(var cell in answer) {
         var parts = cell.split("_");
         var numericRow = parseInt(parts[1]);
         var numericCol = parseInt(parts[2]);
         if(parts[0] != "cell" || numericRow < 0 || numericRow >= numericRows - 1 || numericCol < 0 || numericCol >= numericCols - 1) {
            return false;
         }
         parts = answer[cell].split("_");
         var digit = parseInt(parts[1]);
         if(parts[0] != "source" || digit < 0 || digit > 9) {
            return false;
         }
      }
      return true;
   }

   function getResultAndMessage() {
      if(!verifyFormat()) {
         return {
            successRate: 0,
            message: "internal error"
         };
      }
      
      var allErrors = getErrors();
      if(!$.isEmptyObject(allErrors.rows) || !$.isEmptyObject(allErrors.cols)) {
         return {
            successRate: 0,
            message: taskStrings.wrong
         };
      }

      var used = countAnswerCells();
      var target = data[level].errors;
      if (used > target) {
        var successRate = 0;
        if (level == "hard" && used == target+1) {
          successRate = 0.5;
        }
        return {
            successRate: successRate,
            message: taskStrings.wrongCount(used, target)
        };
      }

      return {
         successRate: 1,
         message: taskStrings.success
      };
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
