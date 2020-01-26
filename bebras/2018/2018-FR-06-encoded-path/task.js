function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var cycleMode = false;
   var data = {
      easy: {
         /*
          * '.' = Empty
          * 'S' = Start (black dot)
          * 'X' = Blocked
          * 'P' = Cell is part of the path (used during execution)
          */
         grid: [
            ['S', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.']
         ],
         // Scale the default grid for the main interactive one (big) and the discovered paths (small)
         bigScale: 0.8,
         smallScale: 0.5,
         target: [0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1],
         shownEncodingLength: 7
         /* Calculated fields:
          * startPosition: the {row, col} of 'S' in the grid.
          * numCells: the number of valid cells in the grid (anything but 'X').
          */
      },
      medium: {
         grid: [
            ['S', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.']
         ],
         bigScale: 0.8,
         smallScale: 0.4,
         target: [1, 2, 3, 2, 1, 1, 0, 1, 1, 2, 2, 2, 3, 0, 3],
         shownEncodingLength: 7
      },
      hard: {
         grid: [
            ['S', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.']
         ],
         bigScale: 0.8,
         smallScale: 0.4,
         target: [0, 0, 1, 0, 2, 2, 0, 1, 0, 1, 0, 0, 1, 2, 0, 1, 0, 0, 1, 1, 0],
         shownEncodingLength: 9
      }
     /* FUTURE task -- encoding using second derivative
      hard_other: {
         grid: [
            ['S', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.']
         ],
         bigScale: 0.8,
         smallScale: 0.3,
         target: [0, 0, 1, -1, 0, 0, -1, 0, 2, 0, -2, 1, 0, 1, -2, 0, 1, 0, -1, 1, -1, 2, 0, -1, 1, -1, 0, 0, -1, 0],
         shownEncodingLength: 14
     }
     */
    /* FUTURE task -- encoding using direction and length of straight lines
      medium_other: {
         grid: [
            ['S', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.']
         ],
         bigScale: 0.8,
         smallScale: 0.3,
         target: [2, R, 1, R, 1, L, 2, L, 2, L, R, R, L, L, 4, L, 1, L, 2, R],
         shownEncodingLength: 10
     }
     */
   };
   var directions = {
      right: [0, 1],
      up: [-1, 0],
      left: [0, -1],
      down: [1, 0]
   };

   var mainInstance;
   var highlightedIndex;
   var rows;
   var cols;

   var gridParams = {
      xPad: 2,
      yPad: 2,
      cellWidth: 80,
      cellHeight: 80,
      gridLineAttr: {
         "stroke-width": 2,
         stroke: "black"
      },
      placeHolderLineAttr: {
         "stroke-width": 1,
         stroke: "gray"
      },
      pipeWidth: 8,
      pipeAttr: {
         "stroke-width": 1,
         stroke: "black",
         fill: "green"
      },
      circleRadius: 15,
      startCircleAttr: {
         stroke: "black",
         "stroke-width": 2,
         fill: "black"
      },
      endCircleAttr: {
         stroke: "black",
         "stroke-width": 2,
         fill: "white"
      },
      blockedAttr: {
         fill: "gray",
         "stroke-width": 2,
         stroke: "black"
      },
      maskedFillAttr: {
        "stroke-dasharray":"-",
        fill: "#000055"
      },
      maskedAttr: {
         "font-size": 18,
         fill: "white"
         // "font-weight": "bold"
      },
      labelAttr: {
         "text-anchor": "start",
         "font-size": 18,
         fill: "black"
      },
      digitAttr: {
         "font-size": 18,
         "font-weight": "bold",
         fill: "black"
      },
      errorAttr: {
         fill: "red"
      },
      highlightAttr: {
         stroke: "red",
         "stroke-width": 5
      }
   };
   var stepWidth = 20;
   var targetPathY = 20;
   var encodedPathY = 60;
   var maskHeight = 30;
   var pathStartX = 150;
   var paperCodesAttr = { width : 750, height: 100 };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      rows = data[level].grid.length;
      cols = data[level].grid[0].length;
      initLevelData();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
   };

   subTask.resetDisplay = function() {
      initPaperGrid();
      displayCodes();
      showFeedback(null);
      if (typeof(enableRtl) != "undefined") {
         $("body").attr("dir", "rtl");
         $(".largeScreen #zone_1").css("float", "right");
         $(".largeScreen #zone_2").css("float", "right");
      }
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return {
         discoveredPaths: [],
         currentPath: []
      };
   };

   subTask.unloadLevel = function(callback) {
      if (mainInstance) {
         mainInstance.remove();
      }
      callback();
   };

   function initLevelData() {
      if(data[level].numCells) {
         return;
      }

      data[level].numCells = 0;
      for(var row = 0; row < rows; row++) {
         for(var col = 0; col < cols; col++) {
            var entry = data[level].grid[row][col];
            if(entry === 'S') {
               data[level].startPosition = {
                  row: row,
                  col: col
               };
            }
            if(entry !== 'X') {
               data[level].numCells++;
            }
         }
      }
   }

   function getNeighbors(grid, position) {
      var result = {};
      var rows = grid.length;
      var cols = grid[0].length;
      for(var direction in directions) {
         var newPosition = {
            row: position.row + directions[direction][0],
            col: position.col + directions[direction][1]
         };
         if(isValidPosition(grid, newPosition)) {
            result[direction] = newPosition;
         }
      }
      return result;
   }

   function isValidPosition(grid, position, allowBlocked) {
      var rows = grid.length;
      var cols = grid[0].length;
      var row = position.row;
      var col = position.col;
      var result = row >= 0 && row < rows && col >= 0 && col < cols;
      if(result && !allowBlocked) {
         result &= (grid[row][col] !== 'X');
      }
      return result;
   }

   function getNeighborDirection(grid, position1, position2) {
      if(!isValidPosition(grid, position1)) {
         return null;
      }
      var neighbors = getNeighbors(grid, position1);
      for(var direction in neighbors) {
         if(Beav.Object.eq(neighbors[direction], position2)) {
            return direction;
         }
      }
      return null;
   }

   function initPaperGrid() {
      mainInstance = new VisualInstance("anim", data[level].grid, data[level].startPosition, data[level].numCells, answer.currentPath, cycleMode, data[level].bigScale, true, false, onPathChange);
   }

   function VisualInstance(elementID, initialGrid, startPosition, numCells, initialPath, cycleMode, scale, interactive, placeHolder, onPathChange) {
      var self = this;
      var rows = initialGrid.length;
      var cols = initialGrid[0].length;
      var paperWidth = (2 * gridParams.xPad + gridParams.cellWidth * cols) * scale;
      var paperHeight = (2 * gridParams.yPad + gridParams.cellHeight * rows) * scale;
      var paper = subTask.raphaelFactory.create(elementID, elementID, paperWidth, paperHeight);
      var virtualGrid;
      var visualGrid;
      var currentPath;
      var highlightRect;

      this.init = function() {
         var lineAttr;
         if(placeHolder) {
            lineAttr = gridParams.placeHolderLineAttr;
         }
         else {
            lineAttr = gridParams.gridLineAttr;
         }

         visualGrid = new Grid(elementID, paper, rows, cols, gridParams.cellWidth * scale, gridParams.cellHeight * scale, gridParams.xPad * scale, gridParams.yPad * scale, lineAttr);
         // Placeholder instances have a grid, a question mark, and nothing else.
         if(placeHolder) {
            paper.text(paperWidth / 2, paperHeight / 2, taskStrings.unknown).attr(gridParams.labelAttr).toBack();
            return;
         }

         // If the given path has content, copy from it. Otherwise, the path is just the starting position.
         if(initialPath.length > 0) {
            currentPath = $.extend(true, [], initialPath);
         }
         else {
            currentPath = [startPosition];
         }

         this.refreshVirtualGrid();

         this.redrawAllCells();

         if(interactive) {
            this.enableMouse();
         }
      };

      this.refreshVirtualGrid = function() {
         virtualGrid = $.extend(true, [], initialGrid);
         for(var iPosition in currentPath) {
            var position = currentPath[iPosition];
            virtualGrid[position.row][position.col] = 'P';
         }
      };

      this.redrawAllCells = function() {
         // Clear all cells and draw blocked ones.
         visualGrid.setAllCells(blockFiller, {grid: initialGrid});

         // Draw entire path.
         for(var iPosition = 0; iPosition < currentPath.length; iPosition++) {
            this.drawPathCell(iPosition);
         }
      };

      this.drawPathCell = function(iPosition) {
         var row = currentPath[iPosition].row;
         var col = currentPath[iPosition].col;
         var isStart = (iPosition === 0);
         var isEnd = (iPosition === currentPath.length - 1);
         var directions = this.getPipeDirections(iPosition);
         var numDirs = 0;
         for(var dir in directions) {
            numDirs++;
         }

         visualGrid.setCell(pathCellFiller, {
            row: row,
            col: col,
            isStart: isStart,
            isEnd: isEnd,
            dirs: directions,
            numDirs: numDirs,
            scale: scale
         });
      };

      this.getPipeDirections = function(iPosition) {
         var result = {};

         // If there is a previous cell in the path, add the direction to it.
         if(iPosition > 0) {
            result[getNeighborDirection(initialGrid, currentPath[iPosition], currentPath[iPosition - 1])] = true;
         } else {
            result["left"] = true;
         }
         // Same for next cell.
         if(iPosition < currentPath.length - 1) {
            result[getNeighborDirection(initialGrid, currentPath[iPosition], currentPath[iPosition + 1])] = true;
         }
         // Same for next cell in a cycle.
         if(iPosition === currentPath.length - 1 && this.isCycle()) {
            result[getNeighborDirection(initialGrid, currentPath[0], currentPath[1])] = true;
         }

         return result;
      };

      this.isPathComplete = function() {
         return currentPath.length === numCells;
      };

      this.isCycleComplete = function() {
         return this.isCycle() && (currentPath.length === numCells + 1);
      };

      this.isCycle = function() {
         return cycleMode && (currentPath.length >= 3) && Beav.Object.eq(currentPath[currentPath.length - 1], startPosition);
      };

      this.enableMouse = function() {
         var boxAttr = {
            fill: "none",
            stroke: "none"
         };
         var dragMargins = {
            right: 0,
            top: 0,
            left: 0,
            bottom: 0
         };
         visualGrid.enableDragSelection(null, null, null, this.gridDragChange, boxAttr, dragMargins, 0);

      };

      this.gridDragChange = function(dx, dy, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos) {
         var position;

         // In the beginning of the drag, only anchorGridPos is present.
         if(currentGridPos === null) {
            position = anchorGridPos;
         }
         else {
            position = currentGridPos;
         }

         self.onCellClick(position);
      };

      this.isCellBlocked = function(position) {
         return initialGrid[position.row][position.col] === 'X';
      };

      this.isCellOnPath = function(position) {
         return virtualGrid[position.row][position.col] === 'P';
      };

      // Check whether the given position would close a cycle (not necessarily complete).
      this.isAlmostCycle = function(position) {
         if(!cycleMode || currentPath.length <= 2 || this.isCycle()) {
            return false;
         }
         return Beav.Object.eq(startPosition, position);
      };

      this.onCellClick = function(position) {
         // Ignore invalid positions.
         if(!isValidPosition(initialGrid, position, true)) {
            return;
         }

         // Ignore blocked cells.
         if(self.isCellBlocked(position)) {
            showFeedback(taskStrings.blockedCell);
            return;
         }

         var direction = getNeighborDirection(initialGrid, currentPath[currentPath.length - 1], position);

         // If a cycle is closed, clicking on the start position does nothing.
         if(self.isCycle() && Beav.Object.eq(startPosition, position)) {
            return;
         }

         // Cell is on the path - cut the path, unless this closes a cycle.
         if(self.isCellOnPath(position) && (direction === null || !self.isAlmostCycle(position))) {
            self.cutPathToPosition(position);
            return;
         }

         // Ignore cells that aren't neighbors of the last path cell.
         if(direction === null) {
            showFeedback(taskStrings.notAdjacentToHead);
            return;
         }

         // If a cycle is closed, the only available move is to click on it to cut it.
         if(this.isCycle()) {
            return;
         }
         // We prevent creating a path longer than the target
         if (getEncodedPath(currentPath).length < data[level].target.length) {
            this.addPositionToPath(position);
         }

         if (getEncodedPath(currentPath).length == data[level].target.length) {
            var result = getResultAndMessage(false);
            if (result.successRate < 1) {
               showFeedback(taskStrings.failure);
            }
            return;
         }
      };

      this.addPositionToPath = function(position) {
         currentPath.push(position);
         this.drawPathCell(currentPath.length - 1);
         if(currentPath.length > 1) {
            this.drawPathCell(currentPath.length - 2);
         }
         virtualGrid[position.row][position.col] = 'P';
         this.pathUpdate();
      };

      this.cutPathToPosition = function(position) {
         // Find the index of the position.
         var iPosition;
         for(iPosition = 0; iPosition < currentPath.length; iPosition++) {
            if(Beav.Object.eq(currentPath[iPosition], position)) {
               break;
            }
         }

         // Pop all others.
         while(iPosition !== currentPath.length - 1) {
            this.popPathCell();
         }

         this.drawPathCell(iPosition);

         // The initial position must always be refreshed, because of closing cycles.
         this.drawPathCell(0);
         this.pathUpdate();
      };

      this.popPathCell = function() {
         var position = currentPath[currentPath.length - 1];
         virtualGrid[position.row][position.col] = '.';

         // The start position is always part of the path.
         virtualGrid[startPosition.row][startPosition.col] = 'P';

         currentPath.pop();
         visualGrid.clearCell(position.row, position.col);
      };

      this.pathUpdate = function() {
         onPathChange($.extend(true, [], currentPath));
      };

      this.highlight = function() {
         if(!highlightRect) {
            highlightRect = paper.rect(0, 0, paperWidth, paperHeight).attr(gridParams.highlightAttr);
         }
         highlightRect.show().toFront();
      };

      this.unhighlight = function() {
         if(highlightRect) {
            highlightRect.hide();
         }
      };

      this.remove = function() {
         visualGrid.remove();
         subTask.raphaelFactory.destroy(elementID);
      };

      this.init();
   }

   function blockFiller(cellData, paper) {
      if(cellData.grid[cellData.row][cellData.col] === 'X') {
         return [paper.rect(cellData.xPos, cellData.yPos, cellData.cellWidth, cellData.cellHeight).attr(gridParams.blockedAttr)];
      }
      return null;
   }

   function pathCellFiller(cellData, paper) {
      var dirs = cellData.dirs;
      var numDirs = cellData.numDirs;
      var scale = cellData.scale;

      var width = cellData.cellWidth;
      var height = cellData.cellHeight;
      var leftX = cellData.xPos;
      var topY = cellData.yPos;
      var centerX = leftX + width / 2;
      var centerY = topY + height / 2;
      var rightX = leftX + width;
      var bottomY = topY + height;
      var pipeWidth = gridParams.pipeWidth * scale;
      var pipeXAnchors = [centerX - pipeWidth / 2, centerX + pipeWidth / 2];
      var pipeYAnchors = [centerY - pipeWidth / 2, centerY + pipeWidth / 2];
      var smallRadius = width / 2 - pipeWidth / 2;
      var bigRadius = width / 2 + pipeWidth / 2;

      // Draw pipe.
      var pathArray;
      if(numDirs === 1) {
         if(dirs.left) {
            pathArray = [
               "M", leftX, pipeYAnchors[0],
               "H", centerX,
               "V", pipeYAnchors[1],
               "H", leftX,
               "Z"
            ];
         }
         else if(dirs.right) {
            pathArray = [
               "M", rightX, pipeYAnchors[0],
               "H", centerX,
               "V", pipeYAnchors[1],
               "H", rightX,
               "Z"
            ];
         }
         else if(dirs.up) {
            pathArray = [
               "M", pipeXAnchors[0], topY,
               "V", centerY,
               "H", pipeXAnchors[1],
               "V", topY,
               "Z"
            ];
         }
         else if(dirs.down) {
            pathArray = [
               "M", pipeXAnchors[0], bottomY,
               "V", centerY,
               "H", pipeXAnchors[1],
               "V", bottomY,
               "Z"
            ];
         }
      }
      else if(numDirs === 2) {
         if(dirs.up && dirs.down) {
            pathArray = [
               "M", pipeXAnchors[0], topY,
               "V", bottomY,
               "H", pipeXAnchors[1],
               "V", topY,
               "Z"
            ];
         }
         else if(dirs.left && dirs.right) {
            pathArray = [
               "M", leftX, pipeYAnchors[0],
               "H", rightX,
               "V", pipeYAnchors[1],
               "H", leftX,
               "Z"
            ];
         }
         else if(dirs.up && dirs.left) {
            pathArray = [
               "M", pipeXAnchors[0], topY,
               "A", smallRadius, smallRadius, 0, 0, 1, leftX, pipeYAnchors[0],
               "V", pipeYAnchors[1],
               "A", bigRadius, bigRadius, 0, 0, 0, pipeXAnchors[1], topY,
               "Z"
            ];
         }
         else if(dirs.up && dirs.right) {
            pathArray = [
               "M", pipeXAnchors[1], topY,
               "A", smallRadius, smallRadius, 0, 0, 0, rightX, pipeYAnchors[0],
               "V", pipeYAnchors[1],
               "A", bigRadius, bigRadius, 0, 0, 1, pipeXAnchors[0], topY,
               "Z"
            ];
         }
         else if(dirs.down && dirs.right) {
            pathArray = [
               "M", pipeXAnchors[1], bottomY,
               "A", smallRadius, smallRadius, 0, 0, 1, rightX, pipeYAnchors[1],
               "V", pipeYAnchors[0],
               "A", bigRadius, bigRadius, 0, 0, 0, pipeXAnchors[0], bottomY,
               "Z"
            ];
         }
         else if(dirs.down && dirs.left) {
            pathArray = [
               "M", pipeXAnchors[0], bottomY,
               "A", smallRadius, smallRadius, 0, 0, 0, leftX, pipeYAnchors[1],
               "V", pipeYAnchors[0],
               "A", bigRadius, bigRadius, 0, 0, 1, pipeXAnchors[1], bottomY,
               "Z"
            ];
         }
      }

      var result = [];
      if(pathArray) {
         result.push(paper.path(pathArray).attr(gridParams.pipeAttr));
      }

      var circleRadius = gridParams.circleRadius * scale;

      if(cellData.isEnd) {
         result.push(paper.circle(centerX, centerY, circleRadius).attr(gridParams.endCircleAttr));
      }

      return result;
   }

   function getPathDirections(path) {
      var directions = [];
      for(var iPosition = 1; iPosition < path.length; iPosition++) {
         directions.push(getNeighborDirection(data[level].grid, path[iPosition - 1], path[iPosition]));
      }
      return directions;
    }

   function encodePathEasy(path) {
     var encodedPath = [];
     var prevCol = path[0].col;
     var prevRow = path[0].row;
     for(var iPosition = 1; iPosition < path.length; iPosition++) {
        var position = path[iPosition];
        //var pipeDirections = mainInstance.getPipeDirections(iPosition);
        if (position.col > prevCol) {
           encodedPath.push(0);
        } else if (position.col < prevCol) {
           encodedPath.push(2);
        } else {
           encodedPath.push(1);
        }
        prevCol = position.col;
     }
     return encodedPath;
   }

   function encodePathMedium(path) {
      var directions = getPathDirections(path);
      var dirNameToNumber = {"up": 0, "right": 1, "down": 2, "left": 3};
      var encodedPath = [];
      for (var iDir = 0; iDir < directions.length; iDir++) {
         var dirNumber = dirNameToNumber[directions[iDir]];
         encodedPath.push(dirNumber);
      }
      return encodedPath;
   }

   function encodePathHard(path) {
      var directions = getPathDirections(path);
      var dirNameToNumber = {"up": 0, "right": 1, "down": 2, "left": 3};
      var relDirections = [];
      var prevDirNumber = 1;
      for (var iDir = 0; iDir < directions.length; iDir++) {
         var dirNumber = dirNameToNumber[directions[iDir]];
         var relDir;
         if (dirNumber == prevDirNumber) {
            relDir = 0; // straight
         } else if ((dirNumber + 1) % 4 == prevDirNumber) {
            relDir = 2; // left
         } else {
            relDir = 1; // right
         }
         relDirections.push(relDir);
         prevDirNumber = dirNumber;
      }
      return relDirections;
   }

   /* FUTURE task -- encoding using second derivative
   function encodePathHardOther(path) {
      var encodedPath = [];
      var dirNameToNumber = {"up": 0, "right": 1, "down": 2, "left": 3};
      var directions = getPathDirections(path);
      var prevRot = 0;
      var prevDir = 1;
      for (var iDir = 0; iDir < directions.length; iDir++) {
         var curDir = dirNameToNumber[directions[iDir]];
         var curRot = (curDir - prevDir + 4) % 4;
         if (curRot == 3) {
            curRot = -1;
         }
         var code = curRot - prevRot;
         encodedPath.push(code);
         prevDir = curDir;
         prevRot = curRot;
      }
      return encodedPath;
   }
   */

   /* FUTURE task -- encoding using direction and length of straight lines
   function encodePathMediumOther(path) {
      var encodedPath = [];
      var dirNameToNumber = {"up": 0, "right": 1, "down": 2, "left": 3};
      var prevDirNumber = 1;
      var straightLength = 0;
      var flushStraight = function() {
        if (straightLength > 0) {
          encodedPath.push(straightLength);
          straightLength = 0;
        }
      };
      var directions = getPathDirections(path);
      for (var iDir = 0; iDir < directions.length; iDir++) {
         var dirNumber = dirNameToNumber[directions[iDir]];
         if (dirNumber == prevDirNumber) {
            straightLength++;
         } else if ((dirNumber + 1) % 4 == prevDirNumber) {
            flushStraight();
            encodedPath.push(-1); // turn one direction
         } else {
            flushStraight();
            encodedPath.push(-2); // turn other direction
         }
         prevDirNumber = dirNumber;
      }
      flushStraight();
      return encodedPath;
   }*/

   function getEncodedPath(path) {
      if (path.length == 0) {
         return [];
      } else if (level == "easy") {
         return encodePathEasy(path);
      } else if (level == "medium") {
         return encodePathMedium(path);
      } else if (level == "hard") {
         return encodePathHard(path);
      }
   }

   function displayCodes() {
      subTask.raphaelFactory.destroy("codes");
      var paper = subTask.raphaelFactory.create("codes", "codes", paperCodesAttr.width, paperCodesAttr.height);
      var xLabel = 0;
      if (typeof(enableRtl) == "undefined") {
         xLabel = paper.width;
      }
      paper.text(xLabel, targetPathY, taskStrings.yourTarget).attr(gridParams.labelAttr);
      var targetPath = data[level].target;
      for (var iStep = 0; iStep < targetPath.length; iStep++) {
         paper.text(pathStartX + iStep * stepWidth, targetPathY, targetPath[iStep]).attr(gridParams.digitAttr);
      }
      paper.text(xLabel, encodedPathY, taskStrings.yourSequence).attr(gridParams.labelAttr);
      var encodedPath = getEncodedPath(answer.currentPath);
      var maxShownLength = data[level].shownEncodingLength;
      var shownLength = Math.min(encodedPath.length, maxShownLength);
      var isHidden = (encodedPath.length != targetPath.length);
      var maskX = pathStartX - (stepWidth / 2) + stepWidth * maxShownLength;
      var maskWidth = stepWidth * (targetPath.length - maxShownLength);
      var maskTop = encodedPathY - maskHeight/2;
      var mask = paper.rect(maskX, maskTop, maskWidth, maskHeight);
      if (isHidden) {
         mask.attr(gridParams.maskedFillAttr);
         paper.text(maskX + maskWidth / 2, encodedPathY, taskStrings.masked).attr(gridParams.maskedAttr);
      } else {
         mask.attr({fill:"none"});
         shownLength = targetPath.length;
      }
      for (var iStep = 0; iStep < shownLength; iStep++) {
         var elem = paper.text(pathStartX + iStep * stepWidth, encodedPathY, encodedPath[iStep]).attr(gridParams.digitAttr);
         if (encodedPath[iStep] != targetPath[iStep]) {
           elem.attr(gridParams.errorAttr);
         }
      }
      var limitX = pathStartX + encodedPath.length * stepWidth - stepWidth / 2;
      paper.path(["M", limitX, 0, "L", limitX, maskTop + maskHeight + 10]);
      var comment = "";
      if (isHidden && (encodedPath.length >= maxShownLength) && level != "hard") {
         comment = taskStrings.continuePath;
      }
      $("#comment").html(comment);
   }

   function onPathChange(path) {
      showFeedback(null);

      answer.currentPath = path;

      displayCodes();

      var result = getResultAndMessage(false);
      if(result.successRate > 0) {
         showFeedback(result.message);
      }
   }

   function showFeedback(string) {
      if (string != "") {
        $("#comment").html("");
      }
      $("#displayHelper_graderMessage").html(string);
      $("#displayHelper_graderMessage").css("color", "red");
   }

   function getResultAndMessage(isGrading) {
      var encodedPath = getEncodedPath(answer.currentPath);
      var targetPath = data[level].target;
      var matched = 0;
      for (var iPos = 0; iPos < encodedPath.length; iPos++) {
         if (encodedPath[iPos] != targetPath[iPos]) {
            break;
         }
         matched++;
      }
      var minLengthForPartial = data[level].shownEncodingLength - 2;
      var successRate;
      var message;
      if (matched == targetPath.length) {
         successRate = 1;
         if (isGrading) {
            message = taskStrings.success;
         } else {
            message = "";
         }
      }
      else if (matched >= minLengthForPartial && level != "hard") {
         successRate = 0.3;
         message = "";
         if (isGrading) {
            message = taskStrings.partialSuccess
            if (encodedPath.length == targetPath.length) {
               message += taskStrings.secondPartIncorrect;
            }
         } else if (matched == minLengthForPartial) {
            var comment = taskStrings.partialSuccess + taskStrings.willGetPoints;
            $("#comment").html(comment);
            platform.validate("silent");
         }
      } else {
         successRate = 0;
         message = taskStrings.failure;
      }
      return {
         successRate: successRate,
         message: message
      };
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage(true));
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
displayHelper.hideScoreDetails = true;
