function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         grid: [
            ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
            ["X", "S", "X", ".", ".", ".", "X", ".", ".", ".", "X", ".", ".", ".", "X", ".", ".", "G", ".", "X"],
            ["X", ".", "X", ".", "X", ".", "X", ".", "X", ".", "X", ".", "X", ".", "X", ".", "X", "G", ".", "X"],
            ["X", ".", ".", ".", "X", ".", ".", ".", "X", ".", ".", ".", "X", ".", ".", ".", "X", "G", ".", "X"],
            ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"]
         ],
         verticalLineFirst: 1,
         verticalLineJump: 4,
         maxInstructions: 8,
         cellSize: 31,
         instructionSize: 40,
         cycles: 4,
         enableMarkers: false
      },
      medium: {
         grid: [
            ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
            ["X", "S", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "X", ".", ".", ".", ".", ".", ".", "G", ".", "X"],
            ["X", ".", "X", ".", ".", ".", "X", ".", ".", "X", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "G", ".", "X"],
            ["X", "X", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "X", ".", "G", ".", "X"],
            ["X", ".", ".", ".", "X", ".", ".", ".", "X", ".", ".", ".", ".", ".", "X", ".", "X", ".", "X", ".", ".", "G", ".", "X"],
            ["X", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "X", ".", ".", ".", ".", ".", ".", ".", ".", ".", "G", ".", "X"],
            ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"]
         ],
         verticalLineFirst: 1,
         verticalLineJump: 5,
         maxInstructions: 15,
         cellSize: 31,
         instructionSize: 40,
         cycles: 4,
         enableMarkers: true
      },
      hard: {
         grid: [
            ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"],
            ["X", "S", ".", ".", "X", ".", "X", ".", ".", ".", ".", ".", ".", "X", ".", ".", ".", ".", ".", ".", ".", "G", ".", "X"],
            ["X", ".", ".", ".", ".", ".", ".", ".", ".", "X", ".", ".", ".", ".", ".", ".", ".", ".", "X", ".", ".", "G", ".", "X"],
            ["X", "X", ".", ".", ".", ".", "X", ".", "X", ".", ".", ".", ".", ".", "X", "X", ".", ".", ".", ".", "X", "G", ".", "X"],
            ["X", ".", ".", ".", ".", ".", ".", ".", ".", ".", "X", ".", ".", "X", ".", ".", ".", ".", ".", ".", ".", "G", ".", "X"],
            ["X", ".", "X", ".", ".", ".", ".", ".", ".", ".", ".", "X", ".", ".", ".", "X", ".", ".", "X", ".", ".", "G", ".", "X"],
            ["X", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", ".", "X", "G", ".", "X"],
            ["X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X", "X"]
         ],
         verticalLineFirst: 1,
         verticalLineJump: 5,
         maxInstructions: 16,
         cellSize: 31,
         instructionSize: 40,
         cycles: 4,
         enableMarkers: true
      }
   };

   var paper1;
   var paper2;
   var paperWidth;
   
   var paper2Height = 220;
   var instructionsSourceCenterY = 50;
   var instructionsCenterY = 130;

   var grid;
   var simulation;
   var dragAndDrop;
   var robot;
   var robotInitCell;
   var arrowContainers;
   var instructionContainer;
   var instructionContainerX;
   var instructionContainerY;
   var highlighter;
   var animTime = 200;
   
   var editMode = false;

   var directions = ["right", "down", "left", "up"];

   var dirIncrements = {
      right: [1, 0],
      down: [0, 1],
      left: [-1, 0],
      up: [0, -1]
   };

   var paperParams = {
      xPad: 10,
      yPad: 30
   };

   var gridParams = {
      topPad: 30,
      lineAttr: {
         stroke: "black",
         "stroke-width": 2
      },
      obstaclePadding: 1,
      obstacleAttr: {
         fill: "#888888",
         "stroke-width": 0
      },
      goalAttr: {
         fill: "#00ff00",
         "stroke-width": 0
      },
      verticalLines: {
         verticalMargin: 20,
         attr: {
            "stroke-width": 3,
            "stroke": "blue"
         }
      }
   };
   var markerParams = {
      path: [
         "M", -10, -10,
         "L", -10, 10,
         "L", 10, 10,
         "L", 10, -10,
         "Z"
      ],
      attr: {
         fill: "black"
      }
   };
   var robotParams = {
      headAttr: {
         fill: "green",
         "stroke-width": 1,
         stroke: "green"
      },
      bodyAttr: {
         fill: "green",
         stroke: "green",
         "stroke-width": 1
      },
      legAttr: {
         fill: "#333333",
         stroke: ""
      },
      separatorAttr: {
         fill: "white",
         stroke: ""
      },
      radius: 6
   };
   var instructionParams = {
      placeBackgroundAttr: {
         "stroke-width": 2,
         fill: "white"
      },
      arrowLength: 30,
      arrowAttr: {
         "stroke-width": 5,
         "arrow-end": "block-wide-medium"
      },
      arrowXPad: 40,
      highlighterAttr: {
         "stroke-width": 5,
         stroke: "blue"
      }
   };
   var loopTextAttr = {
      "font-size": 20
   };
   var containerLoopParams = {
      xPad: 30,
      yPad: 40,
      attr: {
         "stroke-width": 3,
         "arrow-end": "classic-wide-long"
      },
      textYPad: 20,
      textAttr: {
         "font-size": 20
      }
   };

   var zoneParams = {
      backgroundColors: ["#AB0000", "#0000D0", "#AB0000", "#0000D0"],
          // ["#8B0000", "#545400", "#000080", "#006400"],
      textColors: ["white", "white", "white", "white"],
      textOffsetY: 15,
      rectHeight: 30,
      textAttr: {
         "font-size": 16
      }
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      displayHelper.hideValidateButton = true;
      initStartPosition();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initPaper();
      resetRobot();
      initButtons();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return {
         markers: {},
         instructions: []
      };
   };

   subTask.unloadLevel = function(callback) {
      killSimulation();
      if (grid) {
         grid.remove();
      }
      if(dragAndDrop) {
         dragAndDrop.disable();
      }
      callback();
   };

   var initButtons = function() {
      resetButtonsState();

      $("#stop").unbind("click");
      $("#execute").unbind("click");

      $("#execute").click(clickExecute);
      $("#stop").click(clickStop);
   };

   var resetButtonsState = function () {
      setButtonState("stop", false);
      setButtonState("execute", true);
      setExecuteText(taskStrings.executeButtonPlay);
   };

   var initPaper = function () {
      paperWidth = data[level].cellSize * data[level].grid[0].length + paperParams.xPad * 2;
      paper1Height = data[level].cellSize * data[level].grid.length + paperParams.yPad * 2;
   
      paper1 = subTask.raphaelFactory.create("anim1", "anim1", paperWidth, paper1Height);
      paper2 = subTask.raphaelFactory.create("anim2", "anim2", paperWidth, paper2Height);
      
      var gridLeft = paperWidth / 2 - data[level].grid[0].length * data[level].cellSize / 2;      
      grid = Grid.fromArray("anim1", paper1, data[level].grid, cellFiller, data[level].cellSize, data[level].cellSize, gridLeft, gridParams.topPad, gridParams.lineAttr);
      grid.clickCell(clickCell);
      initGridLines();

      initText();
      initDragAndDrop();

      drawRobot();
      resetRobot();
   };
   
   var initGridLines = function() {
      for(var col = data[level].verticalLineFirst, index = 0; col <= data[level].grid[0].length; col += data[level].verticalLineJump, index++) {
         var cellPosition = grid.getCellPos(0, col);
         var bottom = cellPosition.y + data[level].grid.length * data[level].cellSize + gridParams.verticalLines.verticalMargin;
         paper1.path([
            "M", cellPosition.x, cellPosition.y - gridParams.verticalLines.verticalMargin,
            "V", bottom
         ]).attr(gridParams.verticalLines.attr);

         /* DEPRECATED BUT KEEP FOR FUTURE USE
         if(index > 0) {
            var zoneWidth = data[level].verticalLineJump * data[level].cellSize;
            var rectX = cellPosition.x - zoneWidth;
            var rectY = cellPosition.y - zoneParams.rectHeight;
            var textX = cellPosition.x - zoneWidth / 2;
            var textY = cellPosition.y - zoneParams.textOffsetY;
            paper1.rect(rectX, rectY, zoneWidth, zoneParams.rectHeight).attr("fill", zoneParams.backgroundColors[index - 1]);
            paper1.text(textX, textY, taskStrings.zone(index)).attr(zoneParams.textAttr).attr("fill", zoneParams.textColors[index - 1]);
         }
         */

      }
   };

   var initText = function () {
      $("#loopTimes").text(data[level].cycles);

      if (data[level].enableMarkers) {
         $("#markersUsage").show();
      }
      else {
         $("#markersUsage").hide();
      }
   };

   var cellFiller = function (cellData, paper1) {
      var row = cellData.row;
      var col = cellData.col;
      var xPos = cellData.xPos;
      var yPos = cellData.yPos;
      var entry = data[level].grid[row][col];
      if (entry == 'X') {
         return [paper1.rect(
            xPos + gridParams.obstaclePadding,
            yPos + gridParams.obstaclePadding,
            cellData.cellWidth - 2 * gridParams.obstaclePadding,
            cellData.cellHeight - 2 * gridParams.obstaclePadding
         ).attr(gridParams.obstacleAttr)];
      }
      if(entry == 'G') {
         return [paper1.rect(
            xPos + gridParams.obstaclePadding,
            yPos + gridParams.obstaclePadding,
            cellData.cellWidth - 2 * gridParams.obstaclePadding,
            cellData.cellHeight - 2 * gridParams.obstaclePadding
         ).attr(gridParams.goalAttr)];
      }
      if (isMarked(row, col)) {
         var xOffset = xPos + cellData.cellWidth / 2;
         var yOffset = yPos + cellData.cellHeight / 2;
         var markerPath = Raphael.transformPath(markerParams.path, ["T", xOffset, yOffset]);
         var marker = paper1.path(markerPath).attr(markerParams.attr);
         return [marker];
      }
   };

   var initStartPosition = function () {
      for (var row = 0; row < data[level].grid.length; row++) {
         for (var col = 0; col < data[level].grid[0].length; col++) {
            if (data[level].grid[row][col] == 'S') {
               robotInitCell = {
                  row: row,
                  col: col
               };
               return;
            }
         }
      }
   };
   
   var drawRobot = function() {
      var radius = robotParams.radius;
      paper1.setStart();

      // Head.
      paper1.circle(0, - radius, radius).attr(robotParams.headAttr);

      // Body.
      paper1.rect(
         - radius,
         - radius,
         radius * 2,
         radius * 2
      ).attr(robotParams.bodyAttr);

      // Head separator.
      paper1.rect(
         - radius - 1,
         - radius,
         2 * radius + 2,
         1
      ).attr(robotParams.separatorAttr);

      var legWidth = radius * 2 / 3;
      var legHeight = radius * 1.2;

      // Left leg.
      paper1.rect(
         - radius - legWidth / 2,
         radius / 2,
         legWidth,
         legHeight
      ).attr(robotParams.legAttr);

      // Right leg.
      paper1.rect(
         radius - legWidth / 2,
         radius / 2,
         legWidth,
         legHeight
      ).attr(robotParams.legAttr);

      robot = paper1.setFinish();
   };

   var resetRobot = function () {
      transformRobot(robotInitCell.row, robotInitCell.col);
   };

   var transformRobot = function (row, col) {
      var cellCenter = grid.getCellCenter(row, col);
      robot.transform(["T", cellCenter.x, cellCenter.y]);
      robot.toFront();
   };

   var clickExecute = function() {
      if (!simulation) {
         killSimulation();
         resetRobot();
         simulation = subTask.simulationFactory.create("sim");
         simulate(simulation);
         simulation.setAutoPlay(true);
         setButtonState("stop", true);
         setExecuteText(taskStrings.executeButtonPause);
         simulation.play();
      }
      else if (simulation.isPlaying()) {
         simulation.stop();
         setExecuteText(taskStrings.executeButtonContinue);
      }
      else {
         simulation.setAutoPlay(true);
         simulation.play();
         setExecuteText(taskStrings.executeButtonPause);
      }
   };

   var clickStop = function() {
      killSimulation();
      resetRobot();
      resetButtonsState();
   };

   var clickCell = function (event) {
      var cellData = event.data;
      var row = cellData.row;
      var col = cellData.col;

      if (editMode) {
         if (data[level].grid[row][col] == 'X') {
            data[level].grid[row][col] = '.';
         }
         else {
            data[level].grid[row][col] = 'X';
         }
         grid.setCell(cellFiller, {
            row: row,
            col: col
         });
         console.log(JSON.stringify(data[level].grid));
         return;
      }

      if (!data[level].enableMarkers) {
         return;
      }

      if (data[level].grid[row][col] == 'S') {
         return;
      }
      
      if (!answer.markers[row]) {
         answer.markers[row] = {};
         answer.markers[row][col] = true;
      }
      else {
         answer.markers[row][col] = !answer.markers[row][col];
         if (!answer.markers[row][col]) {
            delete answer.markers[row][col];
         }
         if ($.isEmptyObject(answer.markers[row])) {
            delete answer.markers[row];
         }
      }

      grid.setCell(cellFiller, {
         row: row,
         col: col
      });
      robot.toFront();
   };

   var isMarked = function (row, col) {
      return answer.markers[row] && answer.markers[row][col];
   };

   var simulate = function (simulation) {
      simulation.clear();
      var row = robotInitCell.row;
      var col = robotInitCell.col;
      var grid = data[level].grid;
      var instructions = truncateNull(answer.instructions);

      if (answer.instructions.length === 0 || answer.instructions[0] == null) {
         simulationAddValidationStep(simulation, false);
         return {
            successRate: 0,
            message: taskStrings.noInstructions
         };
      }

      var stepFunction = function(params) {
         transformRobot(params.row, params.col);
      };

      simulation.addStepWithEntry({
         name: "step",
         action: {
            onExec: stepFunction,
            params: {
               row: row,
               col: col
            },
            duration: animTime,
            useTimeout: true
         }
      });

      for (var iCycle = 0; iCycle < data[level].cycles; iCycle++) {
         for (var iInstruction = 0; iInstruction < instructions.length; iInstruction++) {
            var dir = instructions[iInstruction];

            row += dirIncrements[dir][1];
            col += dirIncrements[dir][0];

            if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
               simulationAddValidationStep(simulation, false);
               return {
                  successRate: 0,
                  message: taskStrings.outside
               };
            }

            var step = new SimulationStep();
            step.addEntry({
               name: "step",
               action: {
                  onExec: stepFunction,
                  params: {
                     row: row,
                     col: col
                  },
                  duration: animTime,
                  useTimeout: true
               }
            });

            step.addEntry({
               name: "highlight",
               action: {
                  onExec: highlightInstruction,
                  params: {
                     index: iInstruction
                  },
                  duration: animTime,
                  useTimeout: true
               }
            });
            simulation.addStep(step);

            if (grid[row][col] == 'X') {
               simulationAddValidationStep(simulation, false);
               return {
                  successRate: 0,
                  message: taskStrings.collision
               };
            }

            // Check if the robot did not enter next zone exactly at the end of this cycle.
            var isCycleFinished = (iInstruction === instructions.length - 1);
            var isNextZone = (col === data[level].verticalLineFirst + (iCycle + 1) * data[level].verticalLineJump);
            if(isNextZone && !isCycleFinished) {
               simulationAddValidationStep(simulation, false);
               return {
                  successRate: 0,
                  message: taskStrings.zoneTooEarly
               };
            }
            if(!isNextZone && isCycleFinished) {
               simulationAddValidationStep(simulation, false);
               return {
                  successRate: 0,
                  message: taskStrings.zoneNoExit
               };
            }
         }
      }

      if(grid[row][col] == 'G') {
         simulationAddValidationStep(simulation, true);
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }
      
      return {
         successRate: 0,
         message: taskStrings.noGoal
      };
   };

   var truncateNull = function(array) {
      var result = $.extend([], array);
      while(result.length > 0 && result[result.length - 1] === null) {
         result.pop();
      }
      return result;
   };

   var simulationAddValidationStep = function(simulation, success) {
      simulation.addStepWithEntry({
         name: "validate",
         action: {
            onExec: onSimulationFinish,
            params: {
               success: success
            }
         }
      });
   };

   var highlightInstruction = function(params) {
      if(!highlighter) {
         createHighlighter();
      }
      highlighter.attr({
         x: instructionContainerX + (params.index * data[level].instructionSize),
         y: instructionContainerY
      });
      highlighter.toFront();
   };

   var createHighlighter = function() {
      destroyHighlighter();
      highlighter = paper2.rect(0, 0, data[level].instructionSize, data[level].instructionSize).attr(instructionParams.highlighterAttr);
   };

   var destroyHighlighter = function() {
      if(highlighter) {
         highlighter.remove();
         highlighter = null;
      }
   };

   var onSimulationFinish = function (params, duration, callback) {
      if (params.success) {
         platform.validate("done");
      }
      else {
         displayHelper.validate("stay");
      }
      setExecuteText(taskStrings.executeButtonPlay);
      if (answer.instructions.length === 0 || answer.instructions[0] === null) {
         setButtonState("stop", false);
      }
      simulation = null;
      callback();
   };

   var initDragAndDrop = function () {
      dragAndDrop = DragAndDropSystem({
         paper: paper2,
         actionIfDropped: actionIfDropped,
         drop: onDrop
      });

      var slotSize = data[level].instructionSize;

      // Main container.      
      instructionContainer = dragAndDrop.addContainer({
         ident : "instructions",
         cx: paperWidth / 2,
         cy: instructionsCenterY,
         widthPlace: slotSize,
         heightPlace: slotSize,
         nbPlaces : data[level].maxInstructions,
         dropMode : 'insertBefore',
         dragDisplayMode: 'preview',
         placeBackgroundArray: [paper2.rect(-slotSize / 2, -slotSize / 2, slotSize, slotSize).attr(instructionParams.placeBackgroundAttr)]
      });
      
      dragAndDrop.insertObjects("instructions", 0, $.map(answer.instructions, function (dir) {
         if (dir == null) {
            return null;
         }
         return {
            ident: dir,
            elements: [getInstructionObjectsSet(dir)] 
         };
      }));

      // Arrow sources/bank.      
      var arrowStartX = paperWidth / 2 - ((data[level].instructionSize + instructionParams.arrowXPad) * directions.length - instructionParams.arrowXPad) / 2;

      arrowContainers = {};

      for (var iDir = 0; iDir < directions.length; iDir++) {
         var dir = directions[iDir];
         
         arrowContainers[iDir] = dragAndDrop.addContainer({
            ident : dir,
            cx: arrowStartX + data[level].instructionSize / 2 + iDir * (data[level].instructionSize + instructionParams.arrowXPad),
            cy: instructionsSourceCenterY,
            widthPlace: slotSize,
            heightPlace: slotSize,
            type : 'source',
            sourceElemArray: [getInstructionObjectsSet(dir)],
            placeBackgroundArray: [drawInstructionBox()]
         });
      }

      // Arrow around main container.
      var containerWidth = slotSize * data[level].maxInstructions;
      var loopStartX = paperWidth / 2 + containerWidth / 2;
      var loopStartY = instructionsCenterY;
      var loopEndX = loopStartX - containerWidth;
      var path = [
         "M", loopStartX, loopStartY,
         "H", loopStartX + containerLoopParams.xPad,
         "V", loopStartY + containerLoopParams.yPad,
         "H", loopEndX - containerLoopParams.xPad,
         "V", loopStartY,
         "H", loopEndX
      ];
      paper2.path(path).attr(containerLoopParams.attr);

      // Loop text: "4x".
      var loopTextY = instructionsCenterY + containerLoopParams.yPad + containerLoopParams.textYPad;
      var loopText = taskStrings.loopText(data[level].cycles);
      paper2.text(paperWidth / 2, loopTextY, loopText).attr(containerLoopParams.textAttr);

      // Container top left position (used later for highlighting).
      instructionContainerX = paperWidth / 2 - containerWidth / 2;
      instructionContainerY = instructionsCenterY - slotSize / 2;
   };

   var drawArrow = function (dir) {
      var xShift = - dirIncrements[dir][0] * instructionParams.arrowLength / 2;
      var yShift = - dirIncrements[dir][1] * instructionParams.arrowLength / 2;
      var path = [
         "M", xShift, yShift,
         "L",
         xShift + dirIncrements[dir][0] * instructionParams.arrowLength,
         yShift + dirIncrements[dir][1] * instructionParams.arrowLength
      ];
      return paper2.path(path).attr(instructionParams.arrowAttr);
   };

   var drawInstructionBox = function () {
      return paper2.rect(
         - data[level].instructionSize / 2,
         - data[level].instructionSize / 2,
         data[level].instructionSize,
         data[level].instructionSize).attr(instructionParams.placeBackgroundAttr);
   };

   var getInstructionObjectsSet = function (dir) {
      paper2.setStart();
      drawInstructionBox();
      drawArrow(dir);
      return paper2.setFinish();
   };

   var actionIfDropped = function (srcCont, srcPos, dstCont, dstPos, dropType) {
      // Allow throwing objects away.
      if (dstCont != "instructions") {
         return dstCont == null;
      }

      var oldSequence = dragAndDrop.getObjects("instructions");

      // Search for rightmost index for insertion.      
      var newIndex = 0;
      for (var i = 0; i < oldSequence.length; i++) {
         if (oldSequence[i] != null) {
            newIndex = i + 1;
         }
      }
      // If this instruction was already here, one more slot is available.
      if (srcCont == "instructions") {
         newIndex--;
      }
      // Allow insertion in the middle of the list.
      if (dstPos <= newIndex) {
         return true;
      }
      // Only allow appending the current list, no dropping further away to the right.
      if (newIndex < data[level].maxInstructions) {
         return DragAndDropSystem.action(dstCont, newIndex, 'insert');
      }
   };

   var onDrop = function (srcContainerID, srcPos, dstContainerID, dstPos, dropType) {
      answer.instructions = dragAndDrop.getObjects("instructions");

      if (srcContainerID == "instructions" || dstContainerID == "instructions") {
         clickStop();
      }
   };
   
   var setButtonState = function(id, enabled) {
      $("#" + id).attr("disabled", !enabled);
   };

   var setExecuteText = function(text) {
      $("#execute").val(text);
   };

   var stopExecution = function() {
      if (simulation) {
         simulation.stop();
      }
   };

   var killSimulation = function() {
      stopExecution();
      subTask.simulationFactory.destroy("sim");
      simulation = null;
      destroyHighlighter();
   };

   var getResultAndMessage = function() {
      return simulate(new Simulation());
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
