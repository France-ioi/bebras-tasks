function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         grid: [
            // '.' = empty.
            // 'I' = Initial position of beaver.
            // 'X' = Blocked.
            // 'T' = Target.
            // 1, 2, 3, ... = Initial positions of ghosts.
            ['I', '.', '.', '.', '.', '.', '.'],
            ['.', '.', 'X', 'X', 'X', '.', '.'],
            ['.', '.', 'X', '.', '.', '.', '.'],
            ['.', '.', 'X', 'X', 'X', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', 'X', 'X'],
            ['.', '.', '.', '.', '.', '1', 'T']
         ]
      },
      medium: {
         grid: [
            // '.' = empty.
            // 'I' = Initial position of beaver.
            // 'X' = Blocked.
            // 'T' = Target.
            // 1, 2, 3, ... = Initial positions of ghosts.
            ['I', 'X', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', 'X', '.', 'X', '.', '.'],
            ['.', '.', '.', 'X', '.', 'X', '.', 'X'],
            ['.', 'X', 'X', 'X', '.', '.', '.', '.'],
            ['.', '.', '.', 'X', '.', '.', '.', '.'],
            ['.', '.', '.', 'X', 'X', 'X', '.', '.'],
            ['X', 'X', '.', 'X', '.', '.', '.', '.'],
            ['.', '.', '.', 'X', '.', '.', 'X', 'X'],
            ['.', '.', '.', '.', '.', '.', '1', 'T']
         ]
      },
      hard: {
         grid: [
            // '.' = empty.
            // 'I' = Initial position of beaver.
            // 'X' = Blocked.
            // 'T' = Target.
            // 1, 2, 3, ... = Initial positions of ghosts.
            ['I', '.', '.', '.', '.', '.', '.', '.', '.', '.', 'X', '.', '2'],
            ['.', '.', '.', '.', 'X', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', 'X', '.', 'X', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', 'X', '.', 'X', '.', '.', '.', '.', 'X', '.'],
            ['.', 'X', 'X', 'X', 'X', '.', 'X', 'X', 'X', '.', '.', 'X', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', 'X', '.', '.', '.', 'X', 'X', 'X', 'X', '.', '.', '.'],
            ['.', '.', 'X', '.', '.', '.', 'X', '.', '.', '.', '.', '.', '.'],
            ['.', '.', 'X', '.', '.', '.', 'X', '.', '.', '.', '.', '.', '.'],
            ['.', '.', 'X', 'X', 'X', '.', 'X', '.', '.', '.', 'X', '.', '.'],
            ['.', '.', 'X', '.', '.', '.', 'X', '.', '.', 'X', 'X', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.', '.'],
            ['.', '.', '.', '.', '.', '.', '.', '.', '.', 'X', '.', '1', 'T']
         ]
      }
   };

   var paper;
   var raphaelButtons;
   var grid;
   var rows;
   var cols;
   var cellWidth;
   var cellHeight;
   var gridWidth;
   var gridHeight;
   var virtualGrid;
   var beaverRaphael;
   var targetRaphael;
   var targetPosition;
   var beaverPosition;

   var initialBeaverPosition;
   var initialGhostsPositions;

   var ghostsPositions;
   var ghostsRaphael;
   var simulation;
   var initialLives = 1;
   var gameState;
   var animTime = 0;
   var animDelayTime = 40;
   var animLifeLostTime = 500;
   var autoValidate;

   var beaverWidth;
   var beaverHeight;
   var beaverScale;
   var ghostWidth;
   var ghostHeight;
   var ghostScale;
   var targetRadius;
   var acceptingInput;

   var inPlaceMove = 5;
   var ghostOccupiedMove = 4;
   
   var directions = {
      right: [0, 1],
      up: [-1, 0],
      left: [0, -1],
      down: [1, 0]
   };

   var directionKeys = {
      37: "left",
      38: "up",
      39: "right",
      40: "down"
   };

   var ghostDirections = {
      right: [0, 1],
      up: [-1, 0],
      left: [0, -1],
      down: [1, 0],
      upRight: [-1, 1],
      upLeft: [-1, -1],
      downRight: [1, 1],
      downLeft: [1, -1]
   };

   var arrowParams = {
      paperWidth: 44,
      paperHeight: 44,
      arrowLength: 20,
      attr: {
         "stroke-width": 3
      },
      enabledAttr: {
         stroke: "black"
      },
      mousedownAttr: {
         stroke: "#676767"
      },
      disabledAttr: {
         stroke: "#878787"
      }
   };

   var gridParams = {
      backgroundAttr: {
         fill: "#000"
      },
      xPad: 5,
      yPad: 5,
      paperWidth: 500,
      paperHeight: 500,
      cellXPad: 1,
      cellYPad: 1,
      elementPad: 4,
      lineAttr: {
         stroke: "#00ccff",
         "stroke-width": 1
      },
      blockedAttr: {
         fill: "#888",
         stroke: "#888"
      },
      targetAttr: {
         fill: "yellow"
      },
      targetOriginalRadius: 20,
      beaverImage: "castor.png",
      beaverOriginalWidth: 75,
      beaverOriginalHeight: 67,
      ghostImageFunc: function(type) {
         return $("#image_ghost" + type).attr("src");
      },
      ghostOriginalWidth: 37,
      ghostOriginalHeight: 38
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      rows = data[level].grid.length;
      cols = data[level].grid[0].length;
      displayHelper.hideValidateButton = true;
      displayHelper.hideRestartButton = true;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      createVirtualGrid();
      createSimulation();
   };
   
   subTask.resetDisplay = function() {
      initPaper();
      autoValidate = false;
      if(simulation.canPlay()) {
         simulation.setExpedite(true);
         simulation.play();
      }
      updateUndoState();
      initHandlers();
      acceptingInput = true;
      updateFeedback(null);
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      /*
         An answer is a list of positions the user chose to click on.
         A position is an object with two fields, row and col.
         
         Arrows are not treated differently: clicking on an arrow is the same as choosing
         the corresponding adjacent square.
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
      $("#restart").unbind("click");
      $("#undo").unbind("click");
      $(document).unbind(".pacmanKeys");
      callback();
   };

   function initHandlers() {
      $("#restart").unbind("click");
      $("#undo").unbind("click");
      $("#restart").click(clickRestart);
      $("#undo").click(clickUndo);

      $(document).unbind(".pacmanKeys");
      $(document).bind("keydown.pacmanKeys", keyHandler);
   }

   function keyHandler(event) {
      var key = event.keyCode;
      if(directionKeys[key]) {
         event.preventDefault();
         userMoveClick(addDirection(beaverPosition, directionKeys[key]), false);
      }
   }

   function clickRestart() {
      // Restart without confirmation.
      subTask.simulationFactory.destroyAll();
      answer = subTask.getDefaultAnswerObject();
      resetPositions();
      createSimulation();
      updateLives(initialLives);
      updateUndoState();
      acceptingInput = true;
   }

   function clickUndo() {
      simulation.stop();
      answer.pop();
      resetPositions();
      createSimulation();
      if(simulation.canPlay()) {
         simulation.setExpedite(true);
         simulation.play();
      }
      updateUndoState();
      acceptingInput = true;
   }

   function initPaper() {
      initSizes();
      ghostsRaphael = {};
      paper = subTask.raphaelFactory.create("anim", "anim", gridParams.paperWidth, gridParams.paperHeight);
      paper.rect(gridParams.xPad, gridParams.yPad, gridWidth, gridHeight).attr(gridParams.backgroundAttr);
      grid = Grid.fromArray("anim", paper, data[level].grid, cellFiller, cellWidth, cellHeight, gridParams.xPad, gridParams.yPad, gridParams.lineAttr);
      grid.clickCell(clickCell);
      initGridElements();
   }

   function initSizes() {
      // Grid and cell.
      gridWidth = gridParams.paperWidth - 2 * gridParams.xPad;
      gridHeight = gridParams.paperHeight - 2 * gridParams.yPad;
      cellWidth = gridWidth / cols;
      cellHeight = gridHeight / rows;

      // Beaver.
      beaverScale = getCellImageScale(gridParams.beaverOriginalWidth, gridParams.beaverOriginalHeight);
      beaverWidth = beaverScale * gridParams.beaverOriginalWidth;
      beaverHeight = beaverScale * gridParams.beaverOriginalHeight;

      // Ghost.
      ghostScale = getCellImageScale(gridParams.ghostOriginalWidth, gridParams.ghostOriginalHeight);
      ghostWidth = ghostScale * gridParams.ghostOriginalWidth;
      ghostHeight = ghostScale * gridParams.ghostOriginalHeight;

      // Target
      var targetScale = getCellImageScale(gridParams.targetOriginalRadius * 2, gridParams.targetOriginalRadius * 2);
      targetRadius = targetScale * gridParams.targetOriginalRadius;
   }

   function initGridElements() {
      initTarget(targetPosition.row, targetPosition.col);
      initBeaver(beaverPosition.row, beaverPosition.col);
      for(var iGhost in ghostsPositions) {
         initGhost(iGhost, ghostsPositions[iGhost].row, ghostsPositions[iGhost].col);
      }
   }

   // Returns the coefficient by which to multiply the image dimensions,
   // so that the image fits in a cell (keep proportions).
   function getCellImageScale(width, height) {
      var scaleX = Math.min(1, (cellWidth - 2 * gridParams.elementPad) / width);
      var scaleY = Math.min(1, (cellHeight - 2 * gridParams.elementPad) / height);
      return Math.min(scaleX, scaleY);
   }

   function cellFiller(cellData, paper) {
      var entry = virtualGrid[cellData.row][cellData.col];
      if(entry !== 'X') {
         return;
      }

      var left = cellData.xPos + gridParams.cellXPad;
      var top = cellData.yPos + gridParams.cellYPad;
      var right = cellData.xPos + cellWidth - gridParams.cellXPad;
      var bottom = cellData.yPos + cellHeight - gridParams.cellYPad;

      return [paper.rect(left, top, right - left, bottom - top).attr(gridParams.blockedAttr)];
   }

   function initBeaver(row, col) {
      beaverRaphael = drawImage(gridParams.beaverImage, row, col, beaverWidth, beaverHeight);
   }

   function initTarget(row, col) {
      var position = grid.getCellCenter(row, col);
      paper.circle(position.x, position.y, targetRadius).attr(gridParams.targetAttr);
   }

   function initGhost(type, row, col) {
      ghostsRaphael[type] = drawImage(gridParams.ghostImageFunc(type), row, col, ghostWidth, ghostHeight);
   }

   function resetPositions() {
      beaverPosition = initialBeaverPosition;
      beaverRaphael.attr(getImageCellPosition(initialBeaverPosition.row, initialBeaverPosition.col, beaverWidth, beaverHeight));

      ghostsPositions = $.extend({}, initialGhostsPositions);
      for(var iGhost in ghostsPositions) {
         ghostsRaphael[iGhost].attr(getImageCellPosition(initialGhostsPositions[iGhost].row, initialGhostsPositions[iGhost].col, ghostWidth, ghostHeight));
      }
   }

   function drawImage(path, row, col, width, height) {
      var position = getImageCellPosition(row, col, width, height);
      return paper.image(path, position.x, position.y, width, height);
   }

   function getImageCellPosition(row, col, width, height) {
      var position = grid.getCellCenter(row, col);
      position.x -= width / 2;
      position.y -= height / 2;
      return position;
   }

   function createVirtualGrid() {
      virtualGrid = $.extend(true, [], data[level].grid);
      ghostsPositions = {};
      initialGhostsPositions = {};
      for(var row = 0; row < rows; row++) {
         for(var col = 0; col < cols; col++) {
            var entry = virtualGrid[row][col];
            if(entry === '.' || entry === 'X') {
               continue;
            }

            var position = {
               row: row,
               col: col
            };
            if(entry === 'I') {
               beaverPosition = position;
               initialBeaverPosition = position;
            }
            else if(entry === 'T') {
               targetPosition = position;
            }
            else {
               ghostsPositions[entry] = position;
               initialGhostsPositions[entry] = position;
            }
         }
      }
   }

   function createSimulation() {
      subTask.simulationFactory.destroy("sim");
      simulation = subTask.simulationFactory.create("sim");
      simulation.setAutoPlay(true);
      gameState = {
         lives: initialLives,
         outcome: null,
         previousBeaverPosition: $.extend(true, {}, initialBeaverPosition)
      };

      addLivesStatusEntry(0);

      for(var index = 0; index < answer.length; index++) {
         // Move not valid - ignore rest of moves, including this one.
         if(!isValidPosition(answer[index])) {
            answer.splice(index);
            return;
         }

         createMove(answer[index]);

         // Move ended the game - ignore rest of moves.
         if(gameState.outcome !== null) {
            answer.splice(index + 1);
            return;
         }
      }
   }

   function isValidPosition(position) {
      var row = position.row;
      var col = position.col;
      return row >= 0 && row < rows && col >= 0 && col < cols && virtualGrid[row][col] !== 'X';
   }

   // Return true if the move results in beaver changing cell.
   // If beaver doesn't change cell, the ghosts don't move.
   function createMove(target) {
      addLivesStatusEntry(0);

      var nextBeaverPosition = getNextPosition(beaverPosition, target, false);

      // If the beaver doesn't move, create an in-place animation.
      if(nextBeaverPosition === null) {
         addBeaverEntry(target);
         return false;
      }

      // Loop while the beaver is on its way to the target.
      //while(nextBeaverPosition)
      {
         // The new beaver position is the next one getting it closer to the target.
         gameState.previousBeaverPosition = $.extend(true, {}, beaverPosition);
         beaverPosition = nextBeaverPosition;
         addBeaverEntry();

         // Beaver may have reached the target, or stepped on ghost(s).
         // Update the state accordingly and finish if the game is over.
         var livesLost = countGhostsOnBeaver();
         if(livesLost > 0) {
            gameState.lives = Math.max(0, gameState.lives - livesLost);
            addLivesStatusEntry(livesLost);
         }
         addCheckResultEntry();
         if(gameState.outcome !== null) {
            return true;
         }

         // Each ghost will make a move towards beaver.
         // If beaver stepped on a ghost, that ghost will move to beaver's
         // previous position.
         for(var iGhost in ghostsPositions) {
            addGhostEntry(iGhost);

            // A ghost might have stepped on beaver and decreased lives.
            addCheckResultEntry();
            if(gameState.outcome !== null) {
               return true;
            }
         }
         
         // Next iteration - get closer to target.
         nextBeaverPosition = getNextPosition(beaverPosition, target, false);
      }

      return true;
   }

   function addLivesStatusEntry(livesLost) {
      simulation.addStepWithEntry({
         name: "lives",
         action: {
            onExec: function(params, duration, callback) {
               updateFeedback(null);
               updateLives(params.livesLeft);
               callback();
            },
            duration: 0,
            params: {
               livesLost: livesLost,
               livesLeft: gameState.lives
            }
         }
      });

      if(livesLost > 0) {
         // If a life is lost, we show a feedback message, and ignore input
         // for a duration of animLifeLostTime.
         simulation.addStepWithEntry({
            name: "lives",
            action: {
               onExec: function(params, duration, callback) {
                  showLivesFeedback(params.livesLost, params.livesLeft);
                  acceptingInput = false;
               },
               duration: animLifeLostTime,
               useTimeout: true,
               params: {
                  livesLost: livesLost,
                  livesLeft: gameState.lives
               }
            }
         });

         // Restore input.
         simulation.addStepWithEntry({
            name: "lives",
            action: {
               onExec: function(params, duration, callback) {
                  acceptingInput = true;
               },
               duration: 0,
               useTimeout: true
            }
         });
      }
   }

   function addCheckResultEntry() {
      updateGameState();
      if(gameState.outcome === null) {
         return;
      }
      simulation.addStepWithEntry({
         name: "gameOver",
         action: {
            onExec: simulationValidate,
            params: {
               gameState: $.extend(true, {}, gameState)
            }
         },
         delay: animDelayTime
      });
   }

   function simulationValidate(params, duration, callback) {
      if(!autoValidate) {
         callback();
         return;
      }
      if(params.gameState.outcome === "win") {
         platform.validate("done");
      }
      else if(params.gameState.outcome === "lose") {
         platform.validate("stay");
         showGhostPopup();
      }
      callback();
   }

   function showGhostPopup() {
      displayHelper.showPopupMessage(taskStrings.error, "blanket", taskStrings.restartOption, clickRestart, taskStrings.undoOption, undefined, undefined, clickUndo);
   }

   function updateGameState() {
      if(Beav.Object.eq(targetPosition, beaverPosition)) {
         gameState.outcome = "win";
      }
      else if(gameState.lives <= 0) {
         gameState.lives = 0;
         gameState.outcome = "lose";
      }
   }
   
   function countGhostsOnBeaver() {
      var count = 0;
      for(var iGhost in ghostsPositions) {
         if(isGhostOnBeaver(iGhost)) {
            count++;
         }
      }
      return count;
   }

   function isGhostOnBeaver(iGhost) {
      return Beav.Object.eq(ghostsPositions[iGhost], beaverPosition);
   }

   function addBeaverEntry(fakeDirectionTarget) {
      // Same position - move beaver in place.
      if(fakeDirectionTarget) {
         var fakeDirection = getOrientation(beaverPosition, fakeDirectionTarget);
         genericAddEntry("beaver", "beaver", beaverPosition, fakeDirection);
         genericAddEntry("beaver", "beaver", beaverPosition, null);
      }

      // Regular move.
      else {
         genericAddEntry("beaver", "beaver", beaverPosition, null);
      }
   }

   function addGhostEntry(iGhost) {
      var oldGhostPosition = ghostsPositions[iGhost];
      var nextPosition;
      if(isGhostOnBeaver(iGhost)) {
         nextPosition = gameState.previousBeaverPosition;
      }
      else {
         nextPosition = getNextPosition(oldGhostPosition, beaverPosition, true);
      }
      if(nextPosition) {
         ghostsPositions[iGhost] = nextPosition;
      }

      var entryName = "ghost" + iGhost;

      // No change in position - the ghost should only move in-place.
      if(nextPosition === null) {
         var fakeDirection = getOrientation(oldGhostPosition, beaverPosition);
         genericAddEntry(entryName, iGhost, ghostsPositions[iGhost], fakeDirection);
         genericAddEntry(entryName, iGhost, ghostsPositions[iGhost], null);
      }
      
      // Regular move.
      else {
         genericAddEntry(entryName, iGhost, ghostsPositions[iGhost], null);

         if(isGhostOnBeaver(iGhost)) {
            // Decrease lives.
            gameState.lives--;
            updateGameState();
            addLivesStatusEntry(1);

            // If the game isn't over now, the ghost goes back to the previous cell.
            if(gameState.outcome === null) {
               ghostsPositions[iGhost] = oldGhostPosition;
               genericAddEntry(entryName, iGhost, ghostsPositions[iGhost], null);
            }
         }
      }
   }

   function genericAddEntry(entryName, objectName, newPosition, fakeDirection) {
      // If we are moving a ghost to an existing cell, shift its X position.
      var ghostShift = 0;
      var otherGhostShift = 0;
      var otherGhost = null;
      if(objectName !== "beaver") {
         otherGhost = getExistingGhost(objectName, newPosition);
         if(otherGhost !== null) {
            // One ghost gets the positive shift, and the other negative.
            ghostShift = ghostOccupiedMove * ghostScale;
            otherGhostShift = -ghostShift;

            // Shift the same ghosts consistently.
            if(parseInt(objectName) < parseInt(otherGhost)) {
               ghostShift *= -1;
               otherGhostShift *= -1;
            }
         }
      }
      simulation.addStepWithEntry({
         name: entryName,
         action: {
            onExec: genericAnim,
            duration: animTime,
            params: {
               objectName: objectName,
               newPosition: $.extend(true, {}, newPosition),
               fakeDirection: fakeDirection,
               shiftX: ghostShift
            }
         },
         delay: animDelayTime
      });

      // We moved to another ghost's cell, so it should be moved immediately (no delay).
      if(otherGhost) {
         simulation.addStepWithEntry({
         name: entryName,
         action: {
            onExec: genericAnim,
            duration: 0,
            params: {
               objectName: otherGhost,
               newPosition: $.extend(true, {}, newPosition),
               shiftX: otherGhostShift
            }
         }
      });
      }
   }

   // Return the ghost index of another, existing ghost at the give cell,
   // not including the given ghost which is to be placed there.
   function getExistingGhost(iGhost, position) {
      for(var jGhost in ghostsPositions) {
         if(iGhost !== jGhost && Beav.Object.eq(position, ghostsPositions[jGhost])) {
            return jGhost;
         }
      }
      return null;
   }

   function genericAnim(params, duration, callback) {
      var object;
      var cellPos = grid.getCellPos(params.newPosition.row, params.newPosition.col);
      if(params.objectName === "beaver") {
         object = beaverRaphael;
         attr = getImageCellPosition(params.newPosition.row, params.newPosition.col, beaverWidth, beaverHeight);
      }
      else {
         object = ghostsRaphael[params.objectName];
         attr = getImageCellPosition(params.newPosition.row, params.newPosition.col, ghostWidth, ghostHeight);

         // If this cell is occupied, ghost will move slightly to make the other one visible.
         if(params.shiftX) {
            attr.x += params.shiftX;
         }
      }

      // No cell change - move in-place.
      if(params.fakeDirection) {
         attr.x += directions[params.fakeDirection][1] * inPlaceMove * ghostScale;
         attr.y += directions[params.fakeDirection][0] * inPlaceMove * ghostScale;
      }

      if(duration === 0) {
         object.attr(attr);
         callback();
         return;
      }

      return object.animate(attr, duration, callback);
   }

   function getOrientation(position1, position2) {
      if(position1.row < position2.row) {
         return "down";
      }
      else if(position1.row > position2.row) {
         return "up";
      }
      else if(position1.col < position2.col) {
         return "right";
      }
      return "left";
   }

   // Returns the adjacent position to source that is closest to target.
   // If source is strictly closer to target than any of its neighbors, returns null.
   function getNextPosition(source, target, isGhost) {
      var bestDistance = getDistance(source, target);
      var bestPosition = null;
      var dirs = directions;
      if (isGhost) {
         dirs = ghostDirections;
      }
      for(var direction in dirs) {
         var position = addDirection(source, direction, isGhost);
         if(!isValidPosition(position)) {
            continue;
         }
         var distance = getDistance(position, target, isGhost);

         // Non-strict check means that an adjacent position is relevant
         // if it's the same distance as the source.
         if(distance <= bestDistance) {
            bestDistance = distance;
            bestPosition = position;
         }
      }

      return bestPosition;
   }

   function addDirection(position, direction, isGhost) {
      if (isGhost) {
         return {
            row: position.row + ghostDirections[direction][0],
            col: position.col + ghostDirections[direction][1]
         };
      }
      return {
         row: position.row + directions[direction][0],
         col: position.col + directions[direction][1]
      };
   }

   function getDistance(position1, position2, isGhost) {
      var dr = (position1.row - position2.row);
      var dc = (position1.col - position2.col);
      return dr * dr + dc * dc;
      // Manhattan distance.
      //return Math.abs(position1.row - position2.row) + Math.abs(position1.col - position2.col);
   }

   function clickCell(event) {
      userMoveClick({
         row: event.data.row,
         col: event.data.col
      }, true);
   }

   function userMoveClick(position, invalidAlert) {
      if(!acceptingInput) {
         return;
      }

      autoValidate = true;

      // If the game is over, don't allow another move.
      if(gameState.outcome !== null) {
         // If the simulation is over, attempting another move triggerse validation.
         if(!simulation.canPlay()) {
            if(gameState.outcome === "win") {
               platform.validate("done");
            }
            else {
               //displayHelper.validate("stay");
               showGhostPopup();
            }
         }
         return;
      }
      
      if(!isValidPosition(position)) {
        return;
      }
      if(createMove(position)) {
         // The move only counts if beaver changed cell.
         answer.push(position);
      }
      if(simulation.canPlay() && !simulation.isPlaying()) {
         simulation.setExpedite(false);
         simulation.play();
      }
      updateUndoState();
   }

   function updateLives(lives) {
      $(".livesStatus").html(taskStrings.livesLeft(lives));
   }

   function updateUndoState() {
      $("#undo").attr("disabled", answer.length === 0);
   }

   function showLivesFeedback(livesLost, livesLeft) {
      updateFeedback(taskStrings.livesFeedback(livesLost, livesLeft));
   }

   function updateFeedback(string) {
      if(string === null || string === undefined) {
         string = "&nbsp;";
      }
      $("#feedback").html(string);
   }

   function getResultAndMessage() {
      if(gameState.outcome === null) {
         // The user is not supposed to be able to get here with normal usage.
         return {
            successRate: 0
         };
      }
      if(gameState.outcome === "win") {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }
      
      var dRow = beaverPosition.row - targetPosition.row;
      var dCol = beaverPosition.col - targetPosition.col;
      var distance = Math.sqrt(dRow * dRow + dCol * dCol);
      var successRate = 0;
      if(level === "easy") {
         if(distance === 1) {
            successRate = 0.75;
         }
         else if(distance > 1 && distance < 3) {
            successRate = 0.3;
         }
      }
      else if(level === "medium") {
         if(distance >= 1 && distance <= 3) {
            successRate = 0.5;
         }
      }
      else {
         if(distance >= 1 && distance <= 6) {
            successRate = 0.5;
         }
      }

      if(successRate === 0) {
         return {
            successRate: 0,
            message: taskStrings.error
         };
      }
      return {
         successRate: successRate,
         message: taskStrings.partial
      };
   }
   
   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);

