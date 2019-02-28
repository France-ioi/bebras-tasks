function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         maxDigit: 1,
         slots: 12,
         grid: [
            [0, 1, 1, 0],
            [1, 0, 0, 1],
            [0, 1, 1, 0]
         ],
         gridCellSize: 50,
         prefix: []
      },
      medium: {
         maxDigit: 4,
         slots: 13,
         grid: [
            [0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 0, 0]
         ],
         gridCellSize: 40,
         prefix: []
      },
      hard: {
         maxDigit: 9,
         slots: 13,
         grid: [
            [0, 0, 1, 1, 1, 1, 0, 0],
            [1, 1, 0, 1, 1, 0, 1, 1],
            [0, 1, 0, 1, 1, 0, 1, 0],
            [0, 1, 0, 1, 1, 0, 1, 0],
            [0, 1, 0, 1, 1, 0, 1, 0],
            [0, 0, 1, 0, 0, 1, 0, 0]
         ],
         gridCellSize: 30,
         prefix: [2, 4, 2]
      }
   };

   var paper;
   var digitSources;
   var undoButton;
   var answerSlots;
   var userGrid;
   var targetGrid;
   var marker;
   var gridRows;
   var gridCols;

   var allFilledDigits;

   var paperParams = {
      width: 760,
      userGridCenterX: 180,
      targetGridCenterX: 560,
      gridY: 205,
      gridTextY: 175,
      sourcesY: 40,
      answerY: 110,
      undoY: 20, // = sourcesY - undoHeight/2
      undoWidth: 80,
      undoHeight: 38 // = digitParams.cellSize
   };

   var gridParams = {
      lineAttr: {
         "stroke-width": 1,
         stroke: "#000000"
      },
      rectAttr: {
         "stroke-width": 1
      },
      selectedRectAttr: {
         fill: "#555555"
      }
   };
   
   var textParams = {
      attr: {
         "font-size": 20
      }
   };
   
   var digitParams = {
      cellSize: 38,
      xPad: 20,
      textAttr: {
         "font-size": 16
      },
      rectAttr: {
         fill: "#dddddd"
      },
      slotRectAttr: {
         fill: "#ffffff"
      }
   };

   var markerParams = {
      attr: {
         "stroke-width": 3,
         stroke: "#ff0000",
         width: 3
      }
   };

   subTask.loadLevel = function(curLevel, curState) {
      level = curLevel;
      state = curState;
      gridRows = data[level].grid.length;
      gridCols = data[level].grid[0].length;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer) {
         allFilledDigits = data[level].prefix.concat(answer);
      }
   };

   subTask.resetDisplay = function() {
      initPaper();
      initSlots();
      initGrids();
      initUndo();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return [];
   };

   subTask.getDefaultStateObject = function() {
      return {};
   };

   subTask.unloadLevel = function(callback) {
      if(userGrid) {
         userGrid.remove();
      }
      if(targetGrid) {
         targetGrid.remove();
      }
      for(var iDigit in digitSources) {
         digitSources[iDigit].remove();
      }
      if(undoButton) {
         undoButton.remove();
      }
      callback();
   };

   function initPaper() {
      var height = paperParams.gridY + data[level].gridCellSize * data[level].grid.length + 15;
      paper = subTask.raphaelFactory.create("anim", "anim", paperParams.width, height);

      paper.text(paperParams.userGridCenterX, paperParams.gridTextY, taskStrings.userGrid).attr(textParams.attr);
      paper.text(paperParams.targetGridCenterX, paperParams.gridTextY, taskStrings.targetGrid).attr(textParams.attr);
   }
      
   function initSlots() {
      // Clickable digits.
      digitSources = [];
      var leftmostX = paperParams.width / 2 - ((data[level].maxDigit + 1) * digitParams.cellSize + (data[level].maxDigit + 1) * digitParams.xPad + paperParams.undoWidth) / 2;
      
      for(var digit = 0; digit <= data[level].maxDigit; digit++) {
         var centerX =  leftmostX + digitParams.cellSize / 2 + digit * (digitParams.cellSize + digitParams.xPad);
         digitSources.push(drawDigitButton(digit, centerX, paperParams.sourcesY));
         digitSources[digit].click(clickDigitSource, digit);
      }

      // Answer slots.
      answerSlots = [];
      leftmostX = paperParams.width / 2 - data[level].slots * digitParams.cellSize / 2;
      for(var iSlot = 0; iSlot < data[level].slots; iSlot++) {
         var slotCenterX = leftmostX + iSlot * digitParams.cellSize + digitParams.cellSize / 2;
         var slot = {
            background: drawSlotRect(slotCenterX, paperParams.answerY),
            overlay: drawSlotRect(slotCenterX, paperParams.answerY),
            centerX: slotCenterX
         };
         slot.overlay.attr({
            fill: "green",
            opacity: 0
         });
         slot.overlay.toFront();
         slot.overlay.data("index", iSlot);
         answerSlots.push(slot);
      }

      fillSlotsFromAnswer();
   }

   function drawSlotRect(centerX, centerY) {
      return paper.rect(
         centerX - digitParams.cellSize / 2,
         centerY - digitParams.cellSize / 2,
         digitParams.cellSize,
         digitParams.cellSize).attr(digitParams.slotRectAttr);
   }

   function drawDigitRect(digit, centerX, centerY) {
      paper.setStart();
      paper.rect(
         centerX - digitParams.cellSize / 2,
         centerY - digitParams.cellSize / 2,
         digitParams.cellSize,
         digitParams.cellSize).attr(digitParams.rectAttr);
      paper.text(centerX, centerY, digit).attr(digitParams.textAttr);
      return paper.setFinish();
   }

   function drawDigitButton(digit, centerX, centerY) {
      return new Button(paper, centerX - digitParams.cellSize / 2, centerY - digitParams.cellSize / 2, digitParams.cellSize, digitParams.cellSize, digit);
   }
   
   function fillSlotsFromAnswer() {
      for(var iSlot = 0; iSlot < data[level].slots; iSlot++) {
         if(answerSlots[iSlot].digit) {
            answerSlots[iSlot].digit.remove();
         }
         if(iSlot < allFilledDigits.length) {
            setSlotDigit(iSlot, allFilledDigits[iSlot]);
         }
      }
   }

   function clickDigitSource(digit) {
      if (allFilledDigits.length == data[level].slots) {
         return;
      }
      setSlotDigit(allFilledDigits.length, digit);
      answer.push(digit);
      allFilledDigits.push(digit);
      refreshUserGrid(true);

      undoButton.enable();
   }

   function setSlotDigit(iSlot, digit) {
      var slot = answerSlots[iSlot];
      if(slot.digit) {
         slot.digit.remove();
      }
      slot.digit = drawDigitRect(digit, slot.centerX, paperParams.answerY);
      slot.overlay.toFront();
   }

   function initUndo() {
      var leftX = paperParams.width / 2 + ((data[level].maxDigit + 1) * digitParams.cellSize + (data[level].maxDigit + 1) * digitParams.xPad + paperParams.undoWidth) / 2 - paperParams.undoWidth;
      undoButton = new Button(paper, leftX, paperParams.undoY, paperParams.undoWidth, paperParams.undoHeight, taskStrings.undo);
      undoButton.click(clickUndo);
      if(answer.length === 0) {
         undoButton.disable();
      }
   }

   function clickUndo() {
      if(answer.length === 0) {
         undoButton.disable();
         return;
      }
      var last = answer.pop();
      allFilledDigits.pop();

      fillSlotsFromAnswer();
      refreshUserGrid(true);

      if(answer.length === 0) {
         undoButton.disable();
      }
   }

   function initGrids() {
      var leftX = paperParams.targetGridCenterX - gridCols * data[level].gridCellSize / 2;
      targetGrid = Grid.fromArray("anim", paper, data[level].grid, cellFiller, data[level].gridCellSize, data[level].gridCellSize, leftX, paperParams.gridY, gridParams.lineAttr);

      leftX = paperParams.userGridCenterX - gridCols * data[level].gridCellSize / 2;
      userGrid = new Grid("anim", paper, gridRows, gridCols, data[level].gridCellSize, data[level].gridCellSize, leftX, paperParams.gridY, gridParams.lineAttr);
      refreshUserGrid(false);
   }

   function cellFiller(cellData, paper) {
      var row = cellData.row;
      var col = cellData.col;
      var xPos = cellData.xPos;
      var yPos = cellData.yPos;

      var element = paper.rect(xPos, yPos, data[level].gridCellSize, data[level].gridCellSize).attr(gridParams.rectAttr);
      if(cellData.entry == 1) {
         element.attr(gridParams.selectedRectAttr);
      }
      return [element];
   }

   function refreshUserGrid(validateOnFull) {
      var tableAndPosition = answerToTable();
      refreshGrid(userGrid, tableAndPosition.table);
      removeMarker();

      drawMarker(tableAndPosition.lastPosition);

      if(validateOnFull && allFilledDigits.length === data[level].slots) {
         if(Beav.Object.eq(tableAndPosition.table, data[level].grid)) {
            // do nothing
         }
         else {
            displayHelper.validate("stay");
         }
      }
   }

   function removeMarker() {
      if(marker) {
         userGrid.unhighlightCell(marker.row, marker.col);
         marker = null;
      }
   }

   function drawMarker(position) {
      removeMarker();
      var row = position.row;
      var col = position.col;

      // Advance to next position.
      if(col == gridCols - 1) {
         row++;
         col = 0;
      }
      else {
         col++;
      }
      var xPad = null;
      if(row >= gridRows) {
         // Out of range - highlight the right side of the last cell.
         xPad = data[level].gridCellSize;
         row = gridRows - 1;
         col = gridCols - 1;
      }
      marker = {
         row: row,
         col: col
      };
      userGrid.highlightCell(row, col, markerParams.attr, xPad);
   }

   function refreshGrid(grid, table) {
      for(var row = 0; row < gridRows; row++) {
         for(var col = 0; col < gridCols; col++) {
            grid.setCell(cellFiller, {
               row: row,
               col: col,
               entry: table[row][col]
            });
         }
      }
   }

   function answerToTable() {
      var table = Beav.Matrix.make(gridRows, gridCols, 0);
      var digit, iDigit, row = 0, col = -1, index, tempIndex;

      if(level == "easy") {
         for(iDigit = 0; iDigit < allFilledDigits.length; iDigit++) {
            digit = allFilledDigits[iDigit];
            row = Math.floor(iDigit / gridCols);
            col = iDigit % gridCols;
            if(row >= gridRows) {
               return {
                  table: table,
                  lastPosition: {
                     row: row,
                     col: col
                  }
               };
            }
            if(digit == 1) {
               table[row][col] = 1;
            }
         }
      }
      else if(level == "medium") {
         index = 0;
         for(iDigit = 0; iDigit < allFilledDigits.length; iDigit++) {
            digit = allFilledDigits[iDigit];
            for(tempIndex = 0; tempIndex < digit; tempIndex++) {
               row = Math.floor(index / gridCols);
               col = index % gridCols;
               if(row >= gridRows) {
                  return {
                     table: table,
                     lastPosition: {
                        row: row,
                        col: col
                     }
                  };
               }
               table[row][col] = (iDigit % 2);
               index++;
            }
         }
      }
      else if(level == "hard") {
         index = 0;
         for(iDigit = 0; iDigit < allFilledDigits.length; iDigit++) {
            digit = allFilledDigits[iDigit];
            for(tempIndex = 0; tempIndex < digit; tempIndex++) {
               row = Math.floor(index / gridCols);
               col = index % gridCols;
               if(row >= gridRows) {
                  return {
                     table: table,
                     lastPosition: {
                        row: row,
                        col: col
                     }
                  };
               }
               if(row === 0) {
                  table[row][col] = (iDigit % 2);
               }
               else {
                  table[row][col] = (table[row - 1][col] + (iDigit % 2)) % 2;
               }
               index++;
            }
         }
      }

      return {
         table: table,
         lastPosition: {
            row: row,
            col: col
         }
      };
   }
   
   function verifyFormat() {
      if(!answer || answer.length === undefined || answer.length === null) {
         return false;
      }
      if(answer.length < 0 || answer.length > data[level].slots - data[level].prefix.length) {
         return false;
      }
      for(var iDigit = 0; iDigit < allFilledDigits.length; iDigit++) {
         var num = parseInt(allFilledDigits[iDigit]);
         if(num < 0 || num > data[level].maxDigit) {
            return false;
         }
      }
      return true;
   }

   function getCorrectCount() {
      var table = answerToTable().table;
      var correctCount = 0;
      var correctFlag = true;
      for(var row = 0; row < gridRows && correctFlag; row++) {
         for(var col = 0; col < gridCols && correctFlag; col++) {
            if(table[row][col] !== data[level].grid[row][col]) {
               correctFlag = false;
               break;
            }
            correctCount++;
         }
      }
      return correctCount;
   }

   function getResultAndMessage() {
      if(!verifyFormat()) {
         return {
            successRate: 0,
            message: "internal error"
         };
      }
      var correctFraction = getCorrectCount() / (gridRows * gridCols);
      var usedAllSlots = (allFilledDigits.length === data[level].slots);

      if (correctFraction === 1) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }

      if(correctFraction < 0.5) {
         correctFraction = 0;
      }

      var message = taskStrings.partial;
      if (level == "medium" && usedAllSlots) {
        message += "<br/>" + taskStrings.hint;
      }
      return {
         successRate: 0.75 * correctFraction, 
         message: message
      };
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
