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
         gridCellSize: 50
      },
      medium: {
         maxDigit: 4,
         slots: 12,
         grid: [
            [0, 0, 1, 1, 0, 0],
            [0, 1, 1, 1, 1, 0],
            [1, 1, 0, 0, 1, 1],
            [0, 1, 1, 1, 1, 0],
            [0, 0, 1, 1, 0, 0]
         ],
         gridCellSize: 30
      },
      hard: {
         maxDigit: 9,
         slots: 24,
         grid: [
            [0, 0, 1, 1, 1, 1, 0, 0],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 1, 1, 0, 0, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 0, 0, 0, 0, 1, 1],
            [1, 1, 0, 0, 0, 0, 1, 1],
            [0, 0, 1, 1, 1, 1, 0, 0]
         ],
         gridCellSize: 30
      }
   };

   var paper;
   var dragAndDrop;
   var digitSources;
   var answerContainer;
   var userGrid;
   var targetGrid;

   var paperParams = {
      width: 760,
      height: 600,
      userGridCenterX: 200,
      targetGridCenterX: 560,
      gridY: 340,
      gridTextY: 300,
      sourcesY: 150,
      instructionsY: 50,
      answerY: 225,
      maxRowSlots: 12
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
      cellSize: 40,
      xPad: 20,
      textAttr: {
         "font-size": 16
      },
      rectAttr: {
         fill: "#dddddd"
      },
      backgroundAttr: {
         fill: "#ffffff"
      }
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initPaper();
      initDragAndDrop();
      initGrids();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return [];
   };

   subTask.unloadLevel = function(callback) {
      if(userGrid) {
         userGrid.remove();
      }
      if(targetGrid) {
         targetGrid.remove();
      }
      if(dragAndDrop) {
         dragAndDrop.disable();
      }
      callback();
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("anim", "anim", paperParams.width, paperParams.height);

      paper.text(paperParams.width / 2, paperParams.instructionsY, taskStrings.instructions).attr(textParams.attr);
      paper.text(paperParams.userGridCenterX, paperParams.gridTextY, taskStrings.userGrid).attr(textParams.attr);
      paper.text(paperParams.targetGridCenterX, paperParams.gridTextY, taskStrings.targetGrid).attr(textParams.attr);
   }
      
   function initDragAndDrop() {
      dragAndDrop = DragAndDropSystem({
         paper: paper,
         actionIfDropped: actionIfDropped,
         drop: onDrop
      });

      digitSources = {};
      var leftmostX = paperParams.width / 2 - (data[level].maxDigit + 1) * digitParams.cellSize / 2 - data[level].maxDigit * digitParams.xPad / 2;

      for(var digit = 0; digit <= data[level].maxDigit; digit++) {
         var centerX =  leftmostX + digitParams.cellSize / 2 + digit * (digitParams.cellSize + digitParams.xPad);
         digitSources[digit] = dragAndDrop.addContainer({
            ident : digit,
            type: "source",
            cx: centerX,
            cy: paperParams.sourcesY,
            widthPlace: digitParams.cellSize,
            heightPlace: digitParams.cellSize,
            sourceElemArray: [drawDigit(digit)]
         });
      }

      var slotPositions = [];
      var numRows = Math.ceil(data[level].slots / paperParams.maxRowSlots);
      var numCols = Math.min(paperParams.maxRowSlots, data[level].slots);
      leftmostX = paperParams.width / 2 - numCols * digitParams.cellSize / 2;
      topY = paperParams.answerY - numRows * digitParams.cellSize / 2;
      for(var row = 0; row < numRows; row++) {
         var slotCenterY = topY + row * digitParams.cellSize + digitParams.cellSize / 2;
         for(var col = 0; col < numCols; col++) {
            var slotCenterX = leftmostX + col * digitParams.cellSize + digitParams.cellSize / 2;
            slotPositions.push([slotCenterX, slotCenterY]);
         }
      }

      answerContainer = dragAndDrop.addContainer({
         ident: "container",
         cx: paperParams.width / 2,
         cy: paperParams.answerY,
         widthPlace: digitParams.cellSize,
         heightPlace: digitParams.cellSize,
         dropMode : "insertBefore",
         dragDisplayMode : "preview",
         placeBackgroundArray: [drawDigitCellBackground()],
         nbPlaces: data[level].slots,
         places: slotPositions
      });

      dragAndDrop.insertObjects("container", 0, $.map(answer, function(digit) {
         if(digit == null) {
            return null;
         }
         return {
            ident: digit,
            elements: [drawDigit(digit)]
         };
      }));
   }

   function drawDigitCellBackground() {
      return paper.rect(
         - digitParams.cellSize / 2,
         - digitParams.cellSize / 2,
         digitParams.cellSize,
         digitParams.cellSize).attr(digitParams.backgroundAttr);
   }

   function drawDigit(digit) {
      paper.setStart();
      paper.rect(
         - digitParams.cellSize / 2,
         - digitParams.cellSize / 2,
         digitParams.cellSize,
         digitParams.cellSize).attr(digitParams.rectAttr);
      paper.text(0, 0, digit).attr(digitParams.textAttr);
      return paper.setFinish();
   }
   
   function actionIfDropped(srcCont, srcPos, dstCont, dstPos, dropType) {
      // Allow throwing objects away.
      if (dstCont != "container") {
         return dstCont == null;
      }

      var oldSequence = dragAndDrop.getObjects("container");

      // Search for rightmost index for insertion.      
      var newIndex = 0;
      for (var i = 0; i < oldSequence.length; i++) {
         if (oldSequence[i] != null) {
            newIndex = i + 1;
         }
      }
      // If this element was already here, one more slot is available.
      if (srcCont == "container") {
         newIndex--;
      }
      // Allow insertion in the middle of the list.
      if (dstPos <= newIndex) {
         return true;
      }
      // Only allow appending the current list, no dropping further away to the right.
      if (newIndex < data[level].slots) {
         return DragAndDropSystem.action(dstCont, newIndex, 'insert');
      }
   }

   function onDrop(srcContainerID, srcPos, dstContainerID, dstPos, dropType) {
      answer = dragAndDrop.getObjects("container");
      while(answer.length > 0 && answer[answer.length - 1] === null) {
         answer.pop();
      }
      refreshUserGrid();
   }

   function initGrids() {
      var leftX = paperParams.targetGridCenterX - data[level].grid[0].length * data[level].gridCellSize / 2;
      targetGrid = Grid.fromArray("anim", paper, data[level].grid, cellFiller, data[level].gridCellSize, data[level].gridCellSize, leftX, paperParams.gridY, gridParams.lineAttr);

      leftX = paperParams.userGridCenterX - data[level].grid[0].length * data[level].gridCellSize / 2;
      userGrid = new Grid("anim", paper, data[level].grid.length, data[level].grid[0].length, data[level].gridCellSize, data[level].gridCellSize, leftX, paperParams.gridY, paperParams.lineAttr);
      refreshUserGrid();
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

   function refreshUserGrid() {
      refreshGrid(userGrid, answerToTable());
   }

   function refreshGrid(grid, table) {
      for(var row = 0; row < data[level].grid.length; row++) {
         for(var col = 0; col < data[level].grid[0].length; col++) {
            grid.setCell(cellFiller, {
               row: row,
               col: col,
               entry: table[row][col]
            });
         }
      }
   }

   function answerToTable() {
      var rows = data[level].grid.length;
      var cols = data[level].grid[0].length;
      var table = Beav.Matrix.make(rows, cols, 0);
      var digit, iDigit, row, col, index, tempIndex;

      if(level == "easy") {
         for(iDigit = 0; iDigit < answer.length; iDigit++) {
            digit = answer[iDigit];
            row = Math.floor(iDigit / cols);
            col = iDigit % cols;
            if(digit == 1) {
               table[row][col] = 1;
            }
         }
      }
      else if(level == "medium") {
         index = 0;
         for(iDigit = 0; iDigit < answer.length; iDigit++) {
            digit = answer[iDigit];
            for(tempIndex = 0; tempIndex < digit; tempIndex++) {
               row = Math.floor(index / cols);
               col = index % cols;
               if(row >= rows) {
                  return table;
               }
               table[row][col] = (iDigit % 2);
               index++;
            }
         }
      }
      else if(level == "hard") {
         index = 0;
         for(iDigit = 0; iDigit < answer.length; iDigit++) {
            digit = answer[iDigit];
            for(tempIndex = 0; tempIndex < digit; tempIndex++) {
               row = Math.floor(index / cols);
               col = index % cols;
               if(row >= rows) {
                  return table;
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

      return table;
   }
   
   function verifyFormat() {
      if(!answer || answer.length === undefined || answer.length === null) {
         return false;
      }
      if(answer.length < 0 || answer.length > data[level].slots) {
         return false;
      }
      for(var iDigit = 0; iDigit < answer.length; iDigit++) {
         var num = parseInt(answer[iDigit]);
         if(num < 0 || num > data[level].maxDigit) {
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

      var table = answerToTable();
      if(Beav.Object.eq(table, data[level].grid)) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }
      else {
         return {
            successRate: 0,
            message: taskStrings.wrong
         };
      }
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
