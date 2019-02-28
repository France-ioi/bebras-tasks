function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         grid: [
            // '.' = empty.
            // 't' = (t)arget, needs to be drawn.
            // 'i' = (i)nitially drawn.
            // 'f' = (f)illed target (not used here, but appears during play).
            // 'w' = (w)rongly filled (not used here, but appears during play).
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', 'i', 'i', '.', 'i', 'i', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', 'i', 'i', 'i', 'i', 'i', 'i', 'i', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', 'i', 'i', 'i', 'i', 'i', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', 'i', 'i', 'i', '.', '.', '.', 't', 't', '.', 't', 't', '.', '.'],
            ['.', '.', '.', '.', '.', 'i', '.', '.', '.', 't', 't', 't', 't', 't', 't', 't', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 't', 't', 't', 't', 't', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', 't', 't', 't', '.', '.', '.'],
            ['.', '.', 't', 't', '.', 't', 't', '.', '.', '.', '.', '.', 't', '.', '.', '.', '.'],
            ['.', 't', 't', 't', 't', 't', 't', 't', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', 't', 't', 't', 't', 't', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', 't', 't', 't', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', 't', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']
         ]
      },
      medium: {
         pasteLimit: 7,
         grid: [
            // '.' = empty.
            // 't' = (t)arget, needs to be drawn.
            // 'i' = (i)nitially drawn.
            // 'f' = (f)illed target (not used here, but appears during play).
            // 'w' = (w)rongly filled (not used here, but appears during play).
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', 'i', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', 't', 't', 't', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', 't', '.', '.', '.', 't', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', 't', 't', 't', '.', 't', 't', 't', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', 't', '.', '.', '.', '.', '.', '.', '.', 't', '.', '.', '.', '.'],
            ['.', '.', '.', 't', 't', 't', '.', '.', '.', '.', '.', 't', 't', 't', '.', '.', '.'],
            ['.', '.', 't', '.', '.', '.', 't', '.', '.', '.', 't', '.', '.', '.', 't', '.', '.'],
            ['.', 't', 't', 't', '.', 't', 't', 't', '.', 't', 't', 't', '.', 't', 't', 't', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']
         ]
      },
      hard: {
         pasteLimit: 7,
         grid: [
            // '.' = empty.
            // 't' = (t)arget, needs to be drawn.
            // 'i' = (i)nitially drawn.
            // 'f' = (f)illed target (not used here, but appears during play).
            // 'w' = (w)rongly filled (not used here, but appears during play).
            ['i', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.'],
            ['.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't'],
            ['t', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.'],
            ['.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't'],
            ['t', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.'],
            ['.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't'],
            ['t', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.'],
            ['.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't'],
            ['t', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.'],
            ['.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't'],
            ['t', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.'],
            ['.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't'],
            ['t', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.'],
            ['.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't'],
            ['t', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.'],
            ['.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't', '.', 't']
         ]
      }
   };

   var paper;
   var buttonPapers;
   var raphaelButtons;
   var grid;
   var rows;
   var cols;
   var virtualGrid;
   var virtualCopy;
   var rowOffset;
   var colOffset;
   var rowAnchor;
   var colAnchor;
   var minRowOffsetInside;
   var maxRowOffsetInside;
   var minColOffsetInside;
   var maxColOffsetInside;
   var steps;
   
   var directions = {
      right: [0, 1],
      up: [-1, 0],
      left: [0, -1],
      down: [1, 0]
   };

   var arrowParams = {
      paperWidth: 44,
      paperHeight: 44,
      arrowLength: 20,
      attr: {
//         "arrow-end": "classic-wide-long",
         "stroke-width": 3
      },
      enabledAttr: {
         stroke: "black"
      },
      mousedownAttr: {
         stroke: "#676767"
      },
      disabledAttr: {
         stroke: "#A5A5A5"
      }
   };

   var gridParams = {
      xPad: 10,
      yPad: 15,
      cellWidth: 30,
      cellHeight: 30,
      cellXPad: 1,
      cellYPad: 1,
      copyXPad: 1,
      copyYPad: 1,
      lineAttr: {
         stroke: "#666",
         "stroke-width": 1
      },
      drawnAttr: {
         fill: "#333",
         stroke: "#333"
      },
      targetCircleAttr: {
         r: 5,
         fill: "#999"
      },
      copyAttr: {
         "stroke-width": 3,
         stroke: "#00AA00",
         fill: "red",
         "fill-opacity": 0
      }
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      rows = data[level].grid.length;
      cols = data[level].grid[0].length;
      createVirtualGrid();
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
      showFeedback(null);
      updateSteps();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      /*
         An answer is a list of objects.
         Each object has a field "type", which can be "copy" or "paste".
         Each type corresponds to a user action ("copy all"/"paste" buttons).
         Type "paste" objects also have two additional fields:
         "rowOffset" and "colOffset". They indicate how the user
         moved the copy before pasting, where 0,0 means no movement.
         
         Several consecutive "paste" objects can appear. Their offsets are
         all relative to the position of the original copy.
      */
      return [];
   };

   subTask.unloadLevel = function(callback) {
      if (grid) {
         grid.remove();
      }
      if(raphaelButtons) {
         for(var direction in directions) {
            raphaelButtons[direction].remove();
         }
      }
      unbindButtons();
      callback();
   };

   function unbindButtons() {
      $("#execute").unbind("click");
      $("#copyAll").unbind("click");
      $("#paste").unbind("click");
      $("#undo").unbind("click");
   }

   function initHandlers() {
      unbindButtons();
      $("#execute").click(clickExecute);
      $("#copyAll").click(clickCopy);
      $("#paste").click(clickPaste);
      $("#undo").click(clickUndo);
      refreshCopyMode();
      refreshUndo();
   }

   function initPaper() {
      var paperWidth = cols * gridParams.cellWidth + 2 * gridParams.xPad;
      var paperHeight = rows * gridParams.cellHeight + 2 * gridParams.yPad;

      paper = subTask.raphaelFactory.create("anim", "anim", paperWidth, paperHeight);
      grid = Grid.fromArray("anim", paper, virtualGrid, cellFiller, gridParams.cellWidth, gridParams.cellHeight, gridParams.xPad, gridParams.yPad, gridParams.lineAttr);
      grid.enableDragSelection(null, null, null, onGridDrag, {opacity: 0},
         {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
         }
      );

      initRaphaelButtons();
   }

   function initRaphaelButtons() {
      raphaelButtons = {};
      buttonPapers = {};
      for(var direction in directions) {
         buttonPapers[direction] = subTask.raphaelFactory.create("paper_" + direction, "paper_" + direction, arrowParams.paperWidth, arrowParams.paperHeight);
         var button = new Button(buttonPapers[direction], 0, 0, arrowParams.paperWidth, arrowParams.paperHeight, "");
         raphaelButtons[direction] = button;

         var centerX = arrowParams.paperWidth / 2;
         var centerY = arrowParams.paperHeight / 2;
         var startX = centerX - directions[direction][1] * arrowParams.arrowLength / 2;
         var endX = centerX + directions[direction][1] * arrowParams.arrowLength / 2;
         var startY = centerY - directions[direction][0] * arrowParams.arrowLength / 2;
         var endY = centerY + directions[direction][0] * arrowParams.arrowLength / 2;

         var arrow = buttonPapers[direction].path(["M", startX, startY, "L", endX, endY,
            "M", endX - (endY - startY) / 20, endY - (endX - startX) / 20, 
            "L", endX + (-endX + startX + endY - startY) / 3, endY + (-endY + startY + endX - startX) / 3,
            "M", endX + (endY - startY) / 20, endY + (endX - startX) / 20, 
            "L", endX + (-endX + startX - endY + startY) / 3, endY + (-endY + startY - endX + startX) / 3]
         ).attr(arrowParams.attr);

         button.addElement("arrow", arrow);
         button.setAttr("arrow", "enabled", arrowParams.enabledAttr);
         button.setAttr("arrow", "mousedown", arrowParams.mousedownAttr);
         button.setAttr("arrow", "disabled", arrowParams.disabledAttr);
         button.click(clickArrow, {direction: direction});
         button.disable();
      }
   }
   function cellFiller(cellData, paper) {
      var entry = virtualGrid[cellData.row][cellData.col];
      var left = cellData.xPos + gridParams.cellXPad;
      var top = cellData.yPos + gridParams.cellYPad;
      var right = cellData.xPos + gridParams.cellWidth - gridParams.cellXPad;
      var bottom = cellData.yPos + gridParams.cellHeight - gridParams.cellYPad;
      var centerX = (left + right) / 2;
      var centerY = (top + bottom) / 2;

      var result = [];

      // Drawn.
      if(entry === 'i' || entry === 'w' || entry === 'f') {
         result.push(paper.rect(left, top, right - left, bottom - top).attr(gridParams.drawnAttr));
      }
      // Target.
      if(entry === 'i' || entry === 't' || entry === 'f') {
         result.push(paper.circle(centerX, centerY).attr(gridParams.targetCircleAttr));
      }

      if(isCellUnderCopy(cellData.row, cellData.col)) {
         result.push(paper.rect(left + gridParams.copyXPad, top + gridParams.copyYPad, right - left - 2 * gridParams.copyXPad, bottom - top  - 2 * gridParams.copyYPad).attr(gridParams.copyAttr).toFront());
      }  

      return result;
   }

   function createVirtualGrid() {
      virtualGrid = [];
      for(var row = 0; row < rows; row++) {
         virtualGrid.push([]);
         for(var col = 0; col < cols; col++) {
            virtualGrid[row].push(data[level].grid[row][col]);
         }
      }
   }
   
   function resetVirtualGrid() {
      virtualCopy = null;
      steps = 0;
      createVirtualGrid();
      if(!answer) {
         return;
      }
      for(var index = 0; index < answer.length; index++) {
         applyActionVirtual(answer[index]);
      }
   }

   function applyActionVirtual(action) {
      if(action.type === "copy") {
         createVirtualCopy();
      }
      else {
         pasteVirtualCopy(action.rowOffset, action.colOffset);
      }
   }

   function createVirtualCopy() {
      rowOffset = 0;
      colOffset = 0;
      minRowOffsetInside = -Infinity;
      maxRowOffsetInside = Infinity;
      minColOffsetInside = -Infinity;
      maxColOffsetInside = Infinity;

      virtualCopy = {};

      // Anchors are calculated by center of mass.
      var rowSum = 0;
      var colSum = 0;
      var count = 0;

      for(var row = 0; row < rows; row++) {
         for(var col = 0; col < cols; col++) {
            var entry = virtualGrid[row][col];
            if(entry === '.' || entry === 't') {
               continue;
            }

            // Store this entry in copy.
            if(!virtualCopy[row]) {
               virtualCopy[row] = {};
            }
            virtualCopy[row][col] = true;

            // Center of mass calculation.
            rowSum += row;
            colSum += col;
            count++;

            // Boundary calculation.
            minRowOffsetInside = Math.max(minRowOffsetInside, -row);
            maxRowOffsetInside = Math.min(maxRowOffsetInside, rows - 1 - row);
            minColOffsetInside = Math.max(minColOffsetInside, -col);
            maxColOffsetInside = Math.min(maxColOffsetInside, cols - 1 - col);
         }
      }
      rowAnchor = Math.round(rowSum / count);
      colAnchor = Math.round(colSum / count);
   }

   function isCellUnderCopy(row, col) {
      return virtualCopy && virtualCopy[row - rowOffset] && virtualCopy[row - rowOffset][col - colOffset];
   }

   function isVirtualCopyEffective(rowOffset, colOffset) {
      // Check whether pasting here will change anything.
      for(var rowStr in virtualCopy) {
         for(var colStr in virtualCopy[rowStr]) {
            var targetRow = parseInt(rowStr) + rowOffset;
            var targetCol = parseInt(colStr) + colOffset;
            if(targetRow < 0 || targetRow >= rows || targetCol < 0 || targetCol >= cols) {
               continue;
            }
            var entry = virtualGrid[targetRow][targetCol];
            if(entry === '.' || entry === 't') {
               return true;
            }
         }
      }
      return false;
   }

   function pasteVirtualCopy(rowOffset, colOffset) {
      steps++;
      for(var rowStr in virtualCopy) {
         for(var colStr in virtualCopy[rowStr]) {
            var targetRow = parseInt(rowStr) + rowOffset;
            var targetCol = parseInt(colStr) + colOffset;
            if(targetRow < 0 || targetRow >= rows || targetCol < 0 || targetCol >= cols) {
               continue;
            }
            var entry = virtualGrid[targetRow][targetCol];
            if(entry === '.') {
               // Cell was filled, but it's not a target.
               virtualGrid[targetRow][targetCol] = 'w';
            }
            else if(entry === 't') {
               // Cell was filled, and it's a target.
               virtualGrid[targetRow][targetCol] = 'f';
            }
         }
      }
   }

   function refreshVisualGrid() {
      grid.setAllCells(cellFiller);
   }

   function onGridDrag(dx, dy, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos) {
      if(!virtualCopy) {
         return;
      }
      setOffset(currentGridPos.row - rowAnchor, currentGridPos.col - colAnchor, true);
      refreshVisualGrid();
   }

   function setOffset(_rowOffset, _colOffset, keepInside) {
      if(keepInside) {
         rowOffset = Math.max(minRowOffsetInside, Math.min(maxRowOffsetInside, _rowOffset));
         colOffset = Math.max(minColOffsetInside, Math.min(maxColOffsetInside, _colOffset));
         return;
      }

      // Look for one cell still in the grid. If not found, don't allow the new offset.
      for(var rowStr in virtualCopy) {
         for(var colStr in virtualCopy[rowStr]) {
            var newRow = parseInt(rowStr) + _rowOffset;
            var newCol = parseInt(colStr) + _colOffset;
            if(newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
               rowOffset = _rowOffset;
               colOffset = _colOffset;
               return;
            }
         }
      }
   }

   function clickExecute() {
      showFeedback(null);
      var resultAndMessage = getResultAndMessage();
      if(resultAndMessage.successRate == 1) {
         platform.validate("done");
         return;
      }
      displayHelper.validate("stay");
   }

   function clickCopy() {
      // Don't allow consecutive 'copy' actions in history.
      if(answer.length === 0 || answer[answer.length - 1].type !== "copy") {
         answer.push({type: "copy"});
      }
      createVirtualCopy();
      refreshVisualGrid();
      enableCopyMode();
      refreshUndo();
   }

   function refreshCopyMode() {
      if(virtualCopy) {
         enableCopyMode();
      }
      else {
         disableCopyMode();
      }
   }

   function enableCopyMode() {
      for(var direction in directions) {
         raphaelButtons[direction].enable();
      }
      $("#paste").attr("disabled", false);
   }

   function disableCopyMode() {
      for(var direction in directions) {
         raphaelButtons[direction].disable();
      }
      $("#paste").attr("disabled", true);
   }

   function clickArrow(data) {
      var direction = data.direction;
      setOffset(rowOffset + directions[direction][0], colOffset + directions[direction][1]);
      refreshVisualGrid();
   }

   function clickPaste() {
      var limit = data[level].pasteLimit;
      if(limit && limit === steps) {
         displayHelper.showPopupMessage(taskStrings.pasteLimit(limit), "blanket");
         return;
      }

      // If pasting does nothing, ignore the action.
      if(!isVirtualCopyEffective(rowOffset, colOffset)) {
         return;
      }

      answer.push({
         type: "paste",
         rowOffset: rowOffset,
         colOffset: colOffset
      });
      pasteVirtualCopy(rowOffset, colOffset);
      updateSteps();
      refreshVisualGrid();
      refreshUndo();

      var result = getResultAndMessage();
      if (result.successRate == 1) {
         platform.validate("done");
      }
      // If this is the last paste, and target was not reached, show message.
      else  if(limit && limit === steps) {
         displayHelper.showPopupMessage(taskStrings.pasteLimit(limit), "blanket");
      }
   }

   function showFeedback(string) {
      if(!string) {
         string = "";
      }
      $("#feedback").html(string);
   }

   function updateSteps() {
      if(!data[level].pasteLimit) {
         return;
      }
      $("#stepsCount").text(taskStrings.stepCounter(steps, data[level].pasteLimit));
   }

   function refreshUndo() {
      var canUndo = (answer && answer.length > 0);
      $("#undo").attr("disabled", !canUndo);
   }

   function clickUndo() {
      if(answer && answer.length > 0) {
         answer.pop();

         // We replay the entire history.
         resetVirtualGrid();
         refreshVisualGrid();
         refreshCopyMode();
         updateSteps();
      }
      refreshUndo();
   }

   function getResultAndMessage() {
      if(data[level].pasteLimit && data[level].pasteLimit < steps) {
         // The user is not supposed to be able to get here with normal usage.
         return {
            successRate: 0
         };
      }
      var hasError = false;
      var missingCells = false;
      for(var row = 0; row < rows; row++) {
         for(var col = 0; col < cols; col++) {
            var original = data[level].grid[row][col];
            var user = virtualGrid[row][col];
            if (original === '.' && user !== '.') {
               hasError = true;
            }
            if (original === 't' && user !== 'f') {
               missingCells = true;
            }
         }
      }
      if (hasError) {
         return {
            successRate: 0,
            message: taskStrings.patternError
         };
      }
      if (missingCells) {
         return {
            successRate: 0,
            message: taskStrings.patternMissing
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

