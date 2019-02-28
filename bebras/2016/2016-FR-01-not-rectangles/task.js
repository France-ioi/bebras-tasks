function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         grid: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 0, 1, 1, 1, 0],
            [0, 1, 1, 1, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0]
         ],
         limit: 4
      },
      medium: {
         grid: [
            [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
            [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
            [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
            [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1]
         ],
         limit: 5
      },
      /* DEPRECATED BUT KEEP FOR FUTURE UES
         medium: {
         grid: [
            [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
            [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
            [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
            [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0],
            [0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0]
         ],
         limit: 6
      }, */
      hard: {
         grid: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
            [0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
         ],
         limit: 5
      }
   };

   var paper1;
   var paper2;

   var userGrid;
   var targetGrid;
   var virtualGrid = null;
   var wrongRow;
   var wrongCol;

   var clickCounter;
   var clicksUntilPopup = 2;

   var dragThreshold = 10;

   var gridParams = {
      xPad: 10,
      yPad: 15,
      cellWidth: 30,
      cellHeight: 30,
      cellXPad: 1,
      cellYPad: 1,
      lineAttr: {
         stroke: "#666",
         "stroke-width": 1
      },
      selectionBoxAttr: {
         stroke: "#00AA00",
         "stroke-width": 2
      },
      rectAttr: {
         0: {
            "fill": "#FFF",
            "stroke-opacity": 0,
            width: 28,
            height: 28
         },
         1: {
            "fill": "#000",
            "stroke-opacity": 0,
            width: 28,
            height: 28
         }
      },
      wrongAttr: {
         "stroke": "#CC0000",
         "stroke-width": 4
      },
      selectionMargins: {
         left: 10,
         right: 10,
         top: 15,
         bottom: 15
      }
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      virtualGrid = Beav.Matrix.make(data[level].grid.length, data[level].grid[0].length, 0);
      displayHelper.hideValidateButton = true;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      resetVirtualGrid();
   };
   
   subTask.resetDisplay = function() {
      initPaper();
      initHandlers();
      updateSteps();
      showFeedback(null);
      updateUserGridStatus();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return [];
   };

   subTask.unloadLevel = function(callback) {
      if (userGrid) {
         userGrid.remove();
      }
      if(targetGrid) {
         targetGrid.remove();
      }
      $("#undo").unbind("click");
      $("#execute").unbind("click");
      callback();
   };

   var initHandlers = function() {
      $("#execute").unbind("execute");
      $("#execute").click(clickExecute);
      $("#undo").unbind("click");
      $("#undo").click(clickUndo);
      if(answer && answer.length > 0) {
         $("#undo").attr("disabled", false);
      }
      else {
         $("#undo").attr("disabled", true);
      }
   };

   var clickUndo = function() {
      var rectangle = answer.pop();
      applyRectangleVirtual(rectangle);
      updateRectangleVisual(rectangle);
      updateSteps();
      unhighlightWrong();
      if(answer.length === 0) {
         $("#undo").attr("disabled", true);
      }
      updateUserGridStatus();
   };
   
   var updateSteps = function() {
      $("#steps").text(taskStrings.steps(answer.length, data[level].limit));
   };

   var initPaper = function() {
      var rows = data[level].grid.length;
      var cols = data[level].grid[0].length;
      
      var paperWidth = cols * gridParams.cellWidth + 2 * gridParams.xPad;
      var paperHeight = rows * gridParams.cellHeight + 2 * gridParams.yPad;

      paper1 = subTask.raphaelFactory.create("anim1", "anim1", paperWidth, paperHeight);
      paper2 = subTask.raphaelFactory.create("anim2", "anim2", paperWidth, paperHeight);
      targetGrid = Grid.fromArray("anim1", paper1, data[level].grid, targetCellFiller, gridParams.cellWidth, gridParams.cellHeight, gridParams.xPad, gridParams.yPad, gridParams.lineAttr);
      userGrid = Grid.fromArray("anim2", paper2, virtualGrid, userCellFiller, gridParams.cellWidth, gridParams.cellHeight, gridParams.xPad, gridParams.yPad, gridParams.lineAttr);
   };

   var updateUserGridStatus = function() {
      if(answer.length === data[level].limit) {
         userGrid.disableDragSelection();
         clickCounter = 0;
         userGrid.clickCell(onMoveLimit);
      }
      else {
         userGrid.enableDragSelection(onMouseDown, null, onMouseUp, onGridSelectionChange, gridParams.selectionBoxAttr, gridParams.selectionMargins, dragThreshold);
         userGrid.unclickCell();
         showFeedback(null);
      }
   };

   var onMoveLimit = function() {
      showFeedback(taskStrings.moveLimit);
      clickCounter++;
      if(clickCounter >= clicksUntilPopup) {
         displayHelper.showPopupMessage(taskStrings.moveLimit, "blanket");
      }
   };

   var onMouseDown = function() {
      showFeedback(null);
      unhighlightWrong();
   };
   
   var onMouseUp = function(event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos) {
      if(currentGridPos == null) {
         showFeedback(taskStrings.drag);
         return;
      }
      var rectangle = positionPairToRectangle(anchorGridPos, currentGridPos);
      if(rectangle === null) {
         return;
      }
      applyRectangleVirtual(rectangle);
      updateRectangleVisual();
      answer.push(rectangle);
      updateSteps();
      $("#undo").attr("disabled", false);
      updateUserGridStatus();
   };
   
   var onGridSelectionChange = function(dx, dy, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos) {
      var rectangle = positionPairToRectangle(anchorGridPos, currentGridPos);
      if(rectangle === null) {
         rectangle = {
            top: -1,
            bottom: -1,
            left: -1,
            right: -1
         };
      }
      var black;
      for(var row = 0; row < data[level].grid.length; row++) {
         for(var col = 0; col < data[level].grid[0].length; col++) {
            black = virtualGrid[row][col];
            if(row >= rectangle.top && row <= rectangle.bottom && col >= rectangle.left && col <= rectangle.right) {
               black ^= 1;
            }
            userGrid.getCell(row, col)[0].attr(gridParams.rectAttr[black]);
         }
      }
   };
   
   var positionPairToRectangle = function(position1, position2) {
      if(!position1 || !position2) {
         return null;
      }
      result = {
         top: Math.min(position1.row, position2.row),
         bottom: Math.max(position1.row, position2.row),
         left: Math.min(position1.col, position2.col),
         right: Math.max(position1.col, position2.col)
      };
      if(result.bottom < 0 || result.top >= data[level].grid.length) {
         return null;
      }
      if(result.right < 0 || result.left >= data[level].grid[0].length) {
         return null;
      }
      result.top = Math.min(data[level].grid.length - 1, Math.max(result.top, 0));
      result.bottom = Math.min(data[level].grid.length - 1, Math.max(result.bottom, 0));
      result.left = Math.min(data[level].grid[0].length - 1, Math.max(result.left, 0));
      result.right = Math.min(data[level].grid[0].length - 1, Math.max(result.right, 0));
      return result;
   };

   var cellFiller = function(cellData, paper, array) {
      var dataEntry = array[cellData.row][cellData.col];
      var left = cellData.xPos + gridParams.cellXPad;
      var top = cellData.yPos + gridParams.cellYPad;
      var right = cellData.xPos + gridParams.cellWidth - gridParams.cellXPad;
      var bottom = cellData.yPos + gridParams.cellHeight - gridParams.cellYPad;
      return [paper.rect(left, top, right - left, bottom - top).attr(gridParams.rectAttr[dataEntry])];
   };
   
   var targetCellFiller = function(cellData, paper) {
      return cellFiller(cellData, paper, data[level].grid);
   };
   
   var userCellFiller = function(cellData, paper) {
      return cellFiller(cellData, paper, virtualGrid);
   };
   
   var updateRectangleVisual = function(rectangle) {
      if(!rectangle) {
         rectangle = {
            top: 0,
            bottom: data[level].grid.length - 1,
            left: 0,
            right: data[level].grid[0].length - 1
         };
      }
      var minRow = Math.max(0, rectangle.top);
      var maxRow = Math.min(data[level].grid.length - 1, rectangle.bottom);
      var minCol = Math.max(0, rectangle.left);
      var maxCol = Math.min(data[level].grid[0].length - 1, rectangle.right);
      
      for(var row = minRow; row <= maxRow; row++) {
         for(var col = minCol; col <= maxCol; col++) {
            userGrid.getCell(row, col)[0].attr(gridParams.rectAttr[virtualGrid[row][col]]);
         }
      }
   };
   
   var resetVirtualGrid = function() {
      virtualGrid = Beav.Matrix.make(data[level].grid.length, data[level].grid[0].length, 0);
      for(var iAnswer in answer) {
         applyRectangleVirtual(answer[iAnswer]);
      }
   };
   
   var applyRectangleVirtual = function(rectangle) {
      for(var row = rectangle.top; row <= rectangle.bottom; row++) {
         for(var col = rectangle.left; col <= rectangle.right; col++) {
            virtualGrid[row][col] = 1 - virtualGrid[row][col];
         }
      }
   };

   var clickExecute = function() {
      showFeedback(null);
      unhighlightWrong();
      var resultAndMessage = getResultAndMessage();
      if(resultAndMessage.successRate == 1) {
         platform.validate("done");
         return;
      }
      if(resultAndMessage.wrongRow !== undefined) {
         highlightWrong(resultAndMessage.wrongRow, resultAndMessage.wrongCol);
      }
      
      displayHelper.validate("stay");
   };
   
   var highlightWrong = function(row, col) {
      wrongRow = row;
      wrongCol = col;
      userGrid.highlightCell(wrongRow, wrongCol, gridParams.wrongAttr);
   };
   
   var unhighlightWrong = function() {
      if(wrongCol === null || wrongCol === undefined) {
         return;
      }
      userGrid.unhighlightCell(wrongRow, wrongCol);
   };

   var showFeedback = function(string) {
      if(!string) {
         string = "";
      }
      $("#feedback").html(string);
   };

   var getResultAndMessage = function() {
      for(var row = 0; row < data[level].grid.length; row++) {
         for(var col = 0; col < data[level].grid[0].length; col++) {
            if(data[level].grid[row][col] !== virtualGrid[row][col]) {
               return {
                  successRate: 0,
                  message: taskStrings.patternError,
                  wrongRow: row,
                  wrongCol: col
               };
            }
         }
      }

      var successRate = 0;
      var nb = answer.length;
      if(level == "easy") {
         if(nb <= 2) {
            successRate = 1;
         } else if (nb <= 4) { 
            successRate = 0.5;
         }
        }
      else if(level == "medium") {
         if(nb <= 5) {
            successRate = 1;
         }
      }
      else if(level == "hard") {
         if(nb <= 4) {
            successRate = 1;
         }
         else if(nb <= 5) {
            successRate = 0.5;
         }
      }
      if(successRate == 1) {   
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }
      return {
         successRate: successRate,
         message: taskStrings.suboptimal
      };
   };
   
   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);

