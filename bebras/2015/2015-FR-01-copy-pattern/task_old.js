/*jshint eqnull:true */
function initTask() {
   'use strict';

   var resultCellSide = {
      easy: 14,
      medium: 13,
      hard: 14
   };
   var targetCellSide = {
      easy: 12,
      medium: 12,
      hard: 12
   };
   var instructions = taskStrings.instructions;
   var nbLoops = {
      easy: 6,
      medium: 5,
      hard: 12
   };
   var instructionsAvailable = {
      easy: [0, 1, 2, 3],
      medium : [8, 4, 5, 6, 7],
      hard: [8, 0, 1, 2, 3, 4, 5, 6, 7]
   };
   var targetPatterns = {
      easy: [
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1],
         [1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      medium: [
         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
         [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
         [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
         [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
         [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
         [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
       ],
       hard: [
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
         [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
         [0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0],
         [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
         [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
       ]
   };
   var initPos = {
      easy: { lin: 7, col: 0 },
      medium: { lin: 10, col: 10 },
      hard: { lin: 0, col: 12}
   };

   var samples = {
      easy: [[0, 0, 2]],  // [2, 0, 3]
      medium: [[4, 8, 7]], //  [7, 8, 4, 5]
      hard: [[4, 8, 7]] // , [7, 8, 4, 5]
   };
   var maxSequenceLength = {
      easy: 6,
      medium: 8,
      hard: 10
   };
   var simulationSpeeds = {
      easy: 500,
      medium: 200,
      hard: 200
   };
   var simulationSpeedSuccess = 50;

   var drawing;
   var backgroundTargetContainer;
   var curSimulation;
   var dragAndDrop;
   var instructionDefs;
   var arrow;
   var width = 390;
   var height = 350;
   var widthLabel = 160;
   var heightLabel;
   var simulationSpeed; 
   var paper;
   var papers = {};
   var margin = 5;
   var deltas = [ [0,1], [0,-1], [-1,0], [1,0] ];
   var level = null;
   var nbLines;
   var nbCols;
   var simuStates = {
      initial: 0,
      animating: 1,
      paused: 2,
      stopped: 3
   };
   var simuState = simuStates.initial;
   var answer = null;
   var state = null;
   var rects = {target:[], result:[]};
   var selectedCell = null;

   task.load = function(views, callback) {      
      displayHelper.hideValidateButton = true;
      displayHelper.setupLevels();
      callback();
   };

   var getInstructionObject = function(iInstr) {
      var label = paper.rect(-widthLabel/2, -heightLabel/2, widthLabel, heightLabel, heightLabel/5)
                      .attr({'fill': '#E0E0F8'});
      var text = paper.text(0, 0, instructions[iInstr])
                      .attr({'font-size' : 15, 'font-weight' : 'bold'});
      $(text.node).css({
         "-webkit-touch-callout": "none",
         "-webkit-user-select": "none",
         "-khtml-user-select": "none",
         "-moz-user-select": "none",
         "-ms-user-select": "none",
         "user-select": "none",
         "cursor" : "default"
      });
      return [label, text];
   };

   function showArrow(row) {
      arrow.transform("t 346, " + (25 + heightLabel * row) + " S 4,6").show();
   };

   var buildInstructions = function() {
      paper = new Raphael("program", width, height);

      // LATER: use a helper function for the following
      // arrow = paper.text(arrowAttr.x, arrowAttr.y, arrowAttr.text).attr(arrowAttr);

      arrow = paper.path("m 38.559417,11.191643 -6.761709,0.0221 -0.0065,-1.5166566 -2.159042,2.0027926 2.165514,1.800912 0,-1.35897 6.739612,0.06629 z").attr({id: 'path3761',parent: 'layer1',fill: '#ff0000',"fill-opacity": '1',stroke: '#ff0000',"stroke-width": '0.38',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1',"stroke-miterlimit": '4',"stroke-dasharray": 'none'}).hide();

      dragAndDrop = new DragAndDropSystem({
         paper : paper,
         drop: function(srcCont, srcPos, dstCont, dstPos, dropType) {
            displayHelper.stopShowingResult();
            if (simuState != simuStates.initial) {
               clearDisplay();
            }
         },
         actionIfDropped: function(srcCont, srcPos, dstCont, dstPos, dropType) {
            // return dstCont == 'seq' || dstCont == null;
            if (dstCont == 'seq') {
               var oldSequence = dragAndDrop.getObjects('seq');
               var maxiPos = 0;
               for (var i = 0; i < oldSequence.length; i++) {
                  if (oldSequence[i] != null) 
                     maxiPos = i+1;
               }

               if (srcCont == 'seq')
                  maxiPos--;
               if (dstPos <= maxiPos)
                  return true;
               if (maxiPos < maxSequenceLength[level])
                  return DragAndDropSystem.action(dstCont, maxiPos, 'insert');
            }
            return (dstCont == null);
         }
         
      });
      var cx = 270;
      var cy = (height-20)/2 + 10;
      var margin = 10;
      backgroundTargetContainer = paper.rect(cx - widthLabel / 2 - margin, 0, widthLabel + 2 * margin, height).attr({fill: "#AAFFAA"});
      var backgroundTarget = paper.rect(-widthLabel/2,-heightLabel/2,widthLabel,heightLabel)
         .attr('fill', '#F2F2FF');
      dragAndDrop.addContainer({
         ident : 'seq',
         cx : cx,
         cy : cy,
         widthPlace : widthLabel, 
         heightPlace : heightLabel,
         nbPlaces : maxSequenceLength[state.level],
         dropMode : 'insertBefore',
         dragDisplayMode : 'preview',
         direction : 'vertical', 
         align : 'top',
         placeBackgroundArray : [backgroundTarget]
      });

      instructionDefs = [];
      for (var iInstr = 0; iInstr < instructionsAvailable[level].length; iInstr++) {
         instructionDefs[iInstr] = dragAndDrop.addContainer({
            ident : iInstr,
            cx : 5 + widthLabel/2, 
            cy : 8 + (heightLabel / 2) + iInstr * heightLabel, 
            widthPlace : widthLabel, 
            heightPlace : heightLabel,
            type : 'source',
            dropMode : 'insertBefore',
            sourceElemArray : getInstructionObject(instructionsAvailable[level][iInstr]),
            align: 'left'
         });
      }
      return paper;
   };

   var fillGridCell = function(name, lin, col, cellSide) {
      var x = margin + col * cellSide;
      var y = margin + lin * cellSide;
      rects[name].push(papers[name].rect(x, y, cellSide, cellSide).attr({fill: "black"}));
      if (name == "result") {
         if (selectedCell != null) {
            selectedCell.remove();
         }
         selectedCell = papers[name].rect(x, y, cellSide, cellSide).attr({stroke: "red", "stroke-width":3});
      }
   };

   var buildGrid = function(name, withTarget, cellSide) {
      if (withTarget) {
         cellSide = targetCellSide[state.level];
      } else {
         cellSide = resultCellSide[state.level];
      }
      var paperHeight = cellSide * nbLines + 2 * margin;
      var paperWidth = cellSide * nbCols + 2 * margin;
      if (papers[name] != null) {
         papers[name].remove();
      }
      papers[name] = new Raphael(name, paperWidth, paperHeight); 
      for (var lin = 0; lin <= nbLines; lin++) {
         var y = (margin + lin * cellSide);
         papers[name].path("M" + margin + "," + y + " L" + (margin + nbCols * cellSide) + "," + y).attr({"stroke": "gray"});
      }
      for (var col = 0; col <= nbCols; col++) {
         var x = (margin + col * cellSide);
         papers[name].path("M" + x + "," + margin + " L" + x + "," + (margin + nbLines * cellSide)).attr({"stroke": "gray"});
      }
      if (withTarget) {
         var grid = targetPatterns[level];
         for (var iLin = 0; iLin < nbLines; iLin++) {
            for (var iCol = 0; iCol < nbCols; iCol++) {
               if (grid[iLin][iCol] == 1) {
                  fillGridCell(name, iLin, iCol, cellSide);
               }
            }
         }
      } else {
         fillGridCell(name, initPos[state.level].lin, initPos[state.level].col, cellSide);
         rects[name] = [];
      }
   };

   var updateDisplay = function() {
      if (curSimulation == null) {
         $("#message").html("");
         $("#valueS").html(1);
      } else {
         $("#message").html(curSimulation.message);
         $("#valueS").html(curSimulation.s);
      }
   };

   var getSimulationInit = function(sequence, curLevel) {
      var simulation = {
         instrs: getInstructionsFromSequence(sequence, curLevel),
         step: 0,
         message: "",
         grid: [],
         completed: false,
         success: false,
         s: 1
      };
      simulation.robot = {
         lin: initPos[curLevel].lin,
         col: initPos[curLevel].col
      };
      for (var iLin = 0; iLin < nbLines; iLin++) {
         simulation.grid[iLin] = [];
         for (var iCol = 0; iCol < nbCols; iCol++) {
            simulation.grid[iLin][iCol] = 0;
         }
      }
      simulation.grid[simulation.robot.lin][simulation.robot.col] = 1;
      return simulation;
   };

   task.unload = function(callback) {
      DelayedExec.stopAll();
      callback();
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;
      simulationSpeed = simulationSpeeds[level];

      heightLabel = (height - 16) / maxSequenceLength[level];
      nbLines = targetPatterns[level].length;
      nbCols = targetPatterns[level][0].length;

      if (display) {
         curSimulation = null;
         updateDisplay();
         for (var iSample = 0; iSample < samples[level].length; iSample++) {
            var sample = samples[level][iSample];
            var html = "";
            for (var iStep = 0; iStep  < sample.length; iStep++) {
               html += "<tr><td>" + instructions[sample[iStep]] + "</td></tr>";
            }
            $("#sample" + iSample + "Text").html(html);
         }
         $(".nbLoops").html(nbLoops[level]);
         DelayedExec.stopAll();
         if (paper != null) {
            paper.remove();
         }
         var target = buildGrid("target", true);
         drawing = buildGrid("result", false);
         buildInstructions();
      }
   };

   task.getDefaultStateObject = function() {
      return { level: "easy" };
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   var refreshAnswer = function() {
      var sequence = answer[level];
      while ((sequence.length > 0) && (sequence[sequence.length - 1] == null)) {
         sequence.pop();
      }
      dragAndDrop.removeAllObjects('seq');
      dragAndDrop.insertObjects('seq', 0, $.map(sequence, function(iInstr) {
         return { ident : iInstr, elements: getInstructionObject(instructionsAvailable[level][iInstr]) }; })
      );
   };

   task.reloadAnswerObject = function(answerObj) {
      clearDisplay();
      answer = answerObj;
      refreshAnswer();
   };

   task.getAnswerObject = function() {
      answer[level] = dragAndDrop.getObjects('seq');
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      return {
         "easy": [],
         "medium": [],
         "hard": [] // For debug: 4,5,6,6,5,0 
      };
   };

   var stopExecution = function() {
      DelayedExec.stopAll();
      if (arrow) {
         arrow.hide();
      }
      simuState = simuStates.stopped;
   };

   var checkGrid = function(grid, level) {
      for (var iLin = 0; iLin < nbLines; iLin++) {
         for (var iCol = 0; iCol < nbCols; iCol++) {
            if (grid[iLin][iCol] != targetPatterns[level][iLin][iCol]) {
               return false;
            }
         }
      }
      return true;
   };

   var simulateStep = function(simulation, display, isSample) {
      var instrs = simulation.instrs;
      if (simulation.step >= nbLoops[state.level] * instrs.length) {
         if (instrs.length === 0) {
            throw taskStrings.noInstruction;
         } else {
            simulation.completed = true;
            simulation.message = taskStrings.completed;
         }
      } else {
         var robot = simulation.robot;
         var iIteration = Math.floor(simulation.step / instrs.length); 
         var iSequence = simulation.step % instrs.length;
         var instr = instrs[iSequence];
         
         simulation.message = taskStrings.repetitionNumber + (iIteration+1) + ". ";
         // simulation.message += "Instruction n°" + (iSequence+1) + ".";
         // simulation.message += "Instruction : " + instructions[instr] + ".";

         if ((instr === null) || (instr === undefined)) {
         } else if (instr < 8) {
            var dist = 1;
            if (instr > 3) {
               dist = simulation.s;
            }
            for (var iStep = 0; iStep < dist; iStep++) {
               var newLin = robot.lin + deltas[instr % 4][0];
               var newCol = robot.col + deltas[instr % 4][1];
               if ((newCol < 0) || (newCol >= nbCols) || (newLin < 0) || (newLin >= nbLines)) {
                  throw(taskStrings.exitGrid);
               }
               robot.lin = newLin;
               robot.col = newCol;
               if (display) {
                  fillGridCell("result", robot.lin, robot.col, resultCellSide[state.level]);
               }
               simulation.grid[robot.lin][robot.col] = 1;
            }
         } else if (instr == 8) {
            simulation.s++;
         } else {
            if (simulation.s === 0) {
               throw(taskStrings.cannotDecrease);
            }
            simulation.s--;
         }
         if (display) {
            $("#valueS").html(simulation.s);
            if (!isSample) {
               showArrow(iSequence);
            }
         }
         if (checkGrid(simulation.grid, level)) {
            simulation.message = taskStrings.completed;
            simulation.success = true;
            simulation.completed = true;
         }
         simulation.step++;
      }
   };

   var clearDisplay = function() {
      stopExecution();
      resetSelectedSample();
      for (var iRect = 0; iRect < rects.result.length; iRect++) {
         rects.result[iRect].remove();
      }
      if (selectedCell != null) {
         selectedCell.remove();
      }
      curSimulation = getSimulationInit([], level);
      simuState = simuStates.initial;
      $("#simuButtons input").attr("disabled", "disabled");
      $("#pause").val(taskStrings.pause);
      $("#valueS").html(curSimulation.s);
      $("#message").html("");
   };

   var getSequence = function() {
      var sequence = dragAndDrop.getObjects('seq');
      return $.grep(sequence, function(i) { return i !== null; });
   };

   var getInstructionsFromSequence = function(sequence, level) {
      var instrs = [];
      for (var iInstr = 0; iInstr < sequence.length; iInstr++) {
         if (sequence[iInstr] !== null) {
            instrs.push(instructionsAvailable[level][sequence[iInstr]]);
         }
      }
      return instrs;
   };

   var resetSelectedSample = function() {
      $(".examples td").css("background-color", "");
      backgroundTargetContainer.hide();
   };

   task.executeSample = function(numSample) {
      task.execute(samples[level][numSample], true);
      var buttonID = "#sample" + numSample;
      $(buttonID).parent().css("background-color", "#AAFFAA");
   };

   task.trySequence = function() {
      task.execute(getInstructionsFromSequence(getSequence(), state.level), false);
      backgroundTargetContainer.show();
   };

   task.execute = function(instrs, isSample) {
      clearDisplay();
      displayHelper.stopShowingResult();
      simuState = simuStates.animating;
      $("#simuButtons input").removeAttr('disabled');

      // first simulation to determine success
      curSimulation = getSimulationInit([], level);
      curSimulation.instrs = instrs;
      fullSimulation(level, curSimulation);
      var success = curSimulation.success;

      // second simulation for step by step.
      curSimulation = getSimulationInit([], level);
      curSimulation.instrs = instrs;
      var speed = (success) ? simulationSpeedSuccess : simulationSpeed;
      executeSlow(isSample, speed);
   };

   task.pause = function() {
      if (simuState == simuStates.animating) {
         simuState = simuStates.paused;
         $("#pause").val(taskStrings.resume);
      } else {
         simuState = simuStates.animating;
         $("#pause").val(taskStrings.pause);
      }
   };

   task.stop = function() {
      clearDisplay();
   };

   var executeSlow = function(isSample, speed) {
      DelayedExec.setInterval("executeStep", function() { 
         if (simuState == simuStates.paused) {
            return;
         }
         try {
            simulateStep(curSimulation, true, isSample);
         } catch (exception) {
            stopExecution();
            if (!isSample) {
               displayHelper.validate("stay");
            }
         }
         updateDisplay();
         if (curSimulation.completed) {
            stopExecution();
            $("#pause").attr("disabled", "disabled");
            if (!isSample) {
               if (curSimulation.success) {
                  platform.validate("done");
               } else {
                  displayHelper.validate("stay");
               }
            }
         }
      }, speed);
   };

   function fullSimulation(curLevel, simulation) {
      // Note: modifies simulation in place
      try {
         for (var i = 0; i < nbLoops[curLevel] * simulation.instrs.length; i++) {
            simulateStep(simulation, false, false);
            if (simulation.completed) {
               break;
            }
         }
      } catch (exception) {
         simulation.error = exception;
      }
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      var taskParams = displayHelper.taskParams;
      var scores = {};
      var messages = {};
      var maxScores = displayHelper.getLevelsMaxScores();
      if (strAnswer === '') {
         callback(taskParams.minScore, '');
         return;
      }
      var answer = $.parseJSON(strAnswer);
      // clone the state to restore after grading.
      var oldState = $.extend({}, task.getStateObject());
      for (var curLevel in targetPatterns) {
         state.level = curLevel;
         task.reloadStateObject(state, false);
         var simulation = getSimulationInit(answer[curLevel], curLevel);
         fullSimulation(curLevel, simulation);
         if (simulation.error !== undefined) {
            messages[curLevel] = simulation.error
            scores[curLevel] = 0;
         } else if (simulation.success) {
            messages[curLevel] = taskStrings.success;
            scores[curLevel] = maxScores[curLevel];
         } else if (simulation.instrs.length == 0) { 
            messages[curLevel] = taskStrings.missingInstr;
            scores[curLevel] = 0;
         } else {
            messages[curLevel] = taskStrings.incorrect;
            scores[curLevel] = 0;
         }
      }
      task.reloadStateObject(oldState, false);
      if (!gradedLevel) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}

initTask();
