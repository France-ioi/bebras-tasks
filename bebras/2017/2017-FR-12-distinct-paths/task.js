function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         /*
          * '.' = Empty
          * 'S' = Start (black dot)
          * 'X' = Blocked
          * 'P' = Cell is part of the path (used during execution)
          */
         grid: [
            ['.', '.', '.', '.'],
            ['.', 'X', '.', '.'],
            ['.', 'S', '.', '.']
         ],
         // Scale the default grid for the main interactive one (big) and the discovered paths (small)
         bigScale: 1,
         smallScale: 0.5,
         cycleMode: false
         /* Calculated fields:
          * target: the number of distinct paths.
          * startPosition: the {row, col} of 'S' in the grid.
          * numCells: the number of valid cells in the grid (anything but 'X').
          */
      },
      medium: {
         grid: [
            ['S', '.', '.', '.'],
            ['.', '.', '.', '.'],
            ['.', '.', 'X', 'X']
         ],
         bigScale: 1,
         smallScale: 0.4,
         cycleMode: false
      },
      hard: {
         grid: [
            ['.', '.', '.', '.', 'X', 'X'],
            ['.', 'X', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', 'S']
         ],
         bigScale: 1,
         smallScale: 0.3,
         cycleMode: false
      }
      /* challenge: {
         grid: [
            ['X', 'S', '.', '.', 'X'],
            ['X', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.'],
            ['.', '.', '.', 'X', 'X']
         ],
         bigScale: 1,
         smallScale: 0.25,
         cycleMode: false
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
   var discoveredInstances;
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
      textAttr: {
         "font-size": 40,
         "font-weight": "bold",
         fill: "gray"
      },
      highlightAttr: {
         stroke: "red",
         "stroke-width": 5
      }
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      rows = data[level].grid.length;
      cols = data[level].grid[0].length;
      processLevelData();
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
      initPaper();
      showFeedback(null);
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

   function processLevelData() {
      if(data[level].target) {
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

      // Calculate the number of distinct paths with backtracking.
      var visited = Beav.Matrix.make(rows, cols, false);
      var branch = [];
      var branchMaxLen = data[level].numCells;
      if(data[level].cycleMode) {
         branchMaxLen++;
      }
      data[level].target = 0;
      data[level].allPaths = [];
      function dfs(position) {
         if(visited[position.row][position.col]) {
            // Closed a cycle.
            if(data[level].cycleMode && branch.length === data[level].numCells && Beav.Object.eq(position, data[level].startPosition)) {
               data[level].target++;
            }
            return;
         }
         branch.push(position);
         visited[position.row][position.col] = true;
         if(branch.length < branchMaxLen) {
            var neighbors = getNeighbors(data[level].grid, position);
            for(var iNeighbor in neighbors) {
               dfs(neighbors[iNeighbor]);
            }
         }
         else {
            // We are in the end of a full length branch - path found.
            if(!data[level].cycleMode) {
               data[level].target++;
               data[level].allPaths.push($.extend(true, [], branch));
            }
         }
         visited[position.row][position.col] = false;
         branch.pop();
      }

      dfs(data[level].startPosition);

      // Each cycle was counted twice, for each direction.
      if(data[level].cycleMode) {
         data[level].target /= 2;
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

   function initPaper() {
      mainInstance = new VisualInstance("anim", data[level].grid, data[level].startPosition, data[level].numCells, answer.currentPath, data[level].cycleMode, data[level].bigScale, true, false, onPathChange);

      discoveredInstances = [];
      var index;
      var html = "";
      for(index = 0; index < data[level].target; index++) {
         html += '<div class="discoveredPath" id="discoveredPaper' + index + '"></div>';
      }
      $("#discoveredPaths").html(html);
      for(index = 0; index < data[level].target; index++) {
         var initialPath = [];
         var placeHolder = true;
         if(getAnswerPathIndex(data[level].allPaths[index]) !== null) {
            initialPath = data[level].allPaths[index];
            placeHolder = false;
         }
         discoveredInstances.push(new VisualInstance("discoveredPaper" + index, data[level].grid, data[level].startPosition, data[level].numCells, initialPath, data[level].cycleMode, data[level].smallScale, false, placeHolder, null));
      }
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
         // Placeholder instanes have a grid, a question mark, and nothing else.
         if(placeHolder) {
            paper.text(paperWidth / 2, paperHeight / 2, taskStrings.unknown).attr(gridParams.textAttr).toBack();
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
            if (currentPath.length == 1) {
              showFeedback(taskStrings.notAdjacentToStart);
            } else {
              showFeedback(taskStrings.notAdjacentToHead);
            }
            return;
         }

         // If a cycle is closed, the only available move is to click on it to cut it.
         if(this.isCycle()) {
            return;
         }

         this.addPositionToPath(position);
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

      if(cellData.isStart) {
         result.push(paper.circle(centerX, centerY, circleRadius).attr(gridParams.startCircleAttr));
      }
      else if(cellData.isEnd) {
         result.push(paper.circle(centerX, centerY, circleRadius).attr(gridParams.endCircleAttr));
      }

      return result;
   }

   function onPathChange(path) {
      unhighlightDiscovered();
      showFeedback(null);
      
      // If the user completes a path and then immediately clicks on the last cell again,
      // we don't show "path exists" message.
      if(mainInstance.isPathComplete() && Beav.Object.eq(path, answer.currentPath)) {
         return;
      }

      answer.currentPath = path;

      // If the appropriate path/cycle is completed, add it to the discovered paths.
      if((data[level].cycleMode && mainInstance.isCycleComplete()) || (!data[level].cycleMode && mainInstance.isPathComplete())) {
         addPathToAnswer(path);
      }

      // If the path is complete but not a cycle, show a specific message.
      // We don't show the message if the end point is a neighbor of the start point,
      // because that happens even when solving correctly.
      else if(data[level].cycleMode && mainInstance.isPathComplete() && !getNeighborDirection(data[level].grid, path[0], path[path.length - 1])) {
         showFeedback(taskStrings.notCycle);
      }

      // If the path is a cycle but not complete, show a specific message.
      else if(data[level].cycleMode && mainInstance.isCycle() && !mainInstance.isCycleComplete()) {
         showFeedback(taskStrings.cycleNotComplete);
      }
   }

   // Returns the index of the path in the discovered paths, or null if this path is new.
   function getAnswerPathIndex(path) {
      var reversedPath = path.slice().reverse();
      
      for(var iPath = 0; iPath < answer.discoveredPaths.length; iPath++) {
         if(Beav.Object.eq(path, answer.discoveredPaths[iPath])) {
            return iPath;
         }

         // Cycles only count once for both directions.
         if(data[level].cycleMode && Beav.Object.eq(reversedPath, answer.discoveredPaths[iPath])) {
            return iPath;
         }
      }
      return null;
   }

   function addPathToAnswer(path) {
      if(answer.discoveredPaths.length === data[level].target) {
         showFeedback(taskStrings.success);
         return;
      }

      var existingIndex = getAnswerPathIndex(path);
      if(existingIndex !== null) {
         showFeedback(taskStrings.pathExists);
         highlightDiscovered(getPathIndex(answer.discoveredPaths[existingIndex]));
         return;
      }
      answer.discoveredPaths.push(path);

      var instanceIndex = getPathIndex(path);
      discoveredInstances[instanceIndex].remove();
      discoveredInstances[instanceIndex] = new VisualInstance("discoveredPaper" + instanceIndex, data[level].grid, data[level].startPosition, data[level].numCells, path, data[level].cycleMode, data[level].smallScale, false, false, null);

      if(answer.discoveredPaths.length === data[level].target) {
         platform.validate("done");
      }
      else {
         showFeedback(taskStrings.pathDiscovered(answer.discoveredPaths.length, data[level].target));
         // TODO: displayHelper.validate("stay");
      }
   }

   function getPathIndex(path) {
      for(var iPath = 0; iPath < data[level].allPaths.length; iPath++) {
         if(Beav.Object.eq(path, data[level].allPaths[iPath])) {
            return iPath;
         }
      }
   }

   function highlightDiscovered(index) {
      unhighlightDiscovered();
      highlightedIndex = index;
      discoveredInstances[highlightedIndex].highlight();
   }

   function unhighlightDiscovered() {
      if(highlightedIndex !== null && highlightedIndex !== undefined) {
         discoveredInstances[highlightedIndex].unhighlight();
      }
   }

   function showFeedback(string) {
      if(string === null || string === undefined || string === "") {
         string = "&nbsp;";
      }
      $("#feedback").html(string);
   }

   function validatePath(path) {
      var validLength = data[level].numCells;
      if(data[level].cycleMode) {
         validLength++;
      }
      
      if(path.length !== validLength) {
         return false;
      }

      if(!Beav.Object.eq(path[0], data[level].startPosition)) {
         return false;
      }

      if(data[level].cycleMode && !Beav.Object.eq(path[path.length - 1], data[level].startPosition)) {
         return false;
      }

      var virtualGrid = $.extend(true, [], data[level].grid);
      for(var iPosition = 1; iPosition < path.length; iPosition++) {
         var position = path[iPosition];
         if(virtualGrid[position.row][position.col] === 'P' || virtualGrid[position.row][position.col] === 'X') {
            return false;
         }
         virtualGrid[position.row][position.col] = 'P';
      }

      return true;
   }

   function validateUnique(paths) {
      for(var iPath = 0; iPath < paths.length; iPath++) {
         var reversedPath = paths[iPath].slice().reverse();
         for(var jPath = iPath + 1; jPath < paths.length; jPath++) {
            if(Beav.Object.eq(paths[iPath], paths[jPath]) || (data[level].cycleMode && Beav.Object.eq(reversedPath, paths[jPath]))) {
               return false;
            }
         }
      }
      return true;
   }

   function getResultAndMessage() {
      // Not supposed to happen in regular use.
      if(!validateUnique(answer.discoveredPaths)) {
         return {
            successRate: 0
         };
      }
      for(var iPath in answer.discoveredPaths) {
         if(!validatePath(answer.discoveredPaths[iPath])) {
            return {
               successRate: 0
            };
         }
      }

      if(answer.discoveredPaths.length === data[level].target) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }

      // Score is 75% of the fraction found, rounded to nearest 10%.
      var fraction = answer.discoveredPaths.length / data[level].target;
      var rate = Math.round(7.5 * fraction) / 10;
      return {
         successRate: rate,
         message: taskStrings.notAllFound(answer.discoveredPaths.length, data[level].target)
      };
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
