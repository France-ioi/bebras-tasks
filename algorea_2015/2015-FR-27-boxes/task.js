function initTask() {
   var cellSide = 30;
   var nbLoops = 200;
   var instructions = [
      taskStrings.pickupBox,
      taskStrings.dropBox,
      taskStrings.moveRightOneCell,
      taskStrings.moveRightUntilEdge,
      taskStrings.moveRightUtilBox,
      taskStrings.moveRightWhileBox,
      taskStrings.moveLeftOneCell,
      taskStrings.moveLeftUntilEdge,
      taskStrings.moveLeftUntilBox,
      taskStrings.moveLeftWhileBox
   ];
   var curSimulation;
   var dragAndDrop;
   var instructionDefs;
   var width = 700;
   var height = 360;
   var widthLabel = 300;
   var maxSequenceLength = 10;
   var heightLabel = (height - 16) / maxSequenceLength;
   var simulationSpeeds = { easy: 500, medium: 300, hard: 300 };
   var simulationSpeed; 
   var paper;
   var paperGrid;
   var paperTarget;
   var margin = 10;
   var nbCols = 21;
   var level = "easy";
   var simuStates = {
      initial: 0,
      animating: 1,
      stopped: 2 };
   var simuState = simuStates.initial;
   var data = {
      easy: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      medium: [0, 1, 0, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1],
      hard: [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
   };
   var goalBoxes = {
      easy: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
      medium: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
      hard: [1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1]
   }
   var answer = null;
   var state = null;
   var cells = [];
   var robotCell = null;
   var robotRect = null;

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
   }

   var buildInstructions = function() {
      paper = Raphael("program", width, height);
      dragAndDrop = DragAndDropSystem({
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
               if (maxiPos < maxSequenceLength)
                  return action(dstCont, maxiPos, 'insert');
            }
             return dstCont == null;
         }
         
      });
      var backgroundTarget = paper.rect(-widthLabel/2,-heightLabel/2,widthLabel,heightLabel)
         .attr('fill', '#F2F2FF');
      dragAndDrop.addContainer({
         ident : 'seq',
         cx : 545,
         cy : (height-20)/2 + 10,  
         widthPlace : widthLabel, 
         heightPlace : heightLabel,
         nbPlaces : maxSequenceLength,
         dropMode : 'insertBefore',
         dragDisplayMode : 'preview',
         direction : 'vertical', 
         align : 'top',
         placeBackgroundArray : [backgroundTarget]
      });

      instructionDefs = [];
      var nbInstructions = instructions.length;
      if (level == "easy") {
         nbInstructions -= 5;
      }
      for (var iInstr = 0; iInstr < nbInstructions; iInstr++) {
         instructionDefs[iInstr] = dragAndDrop.addContainer({
            ident : iInstr,
            cx : 15 + widthLabel/2, 
            cy : 25 + iInstr * heightLabel, 
            widthPlace : widthLabel, 
            heightPlace : heightLabel,
            type : 'source',
            dropMode : 'insertBefore',
            sourceElemArray : getInstructionObject(iInstr),
            align: 'left'
         });
      }
      return paper;
   };

   var buildGrid = function() {
      var targetScale = 0.7;
      var paperHeight = cellSide * 2 + 2 * margin;
      var paperWidth = cellSide * nbCols + 2 * margin;
      paperGrid = Raphael("grid", paperWidth, paperHeight);
      paperTarget = Raphael("target", paperWidth * targetScale, cellSide * targetScale);
      for (var col = 0; col < nbCols; col++) {
         var x = col * cellSide + margin;
         var y = cellSide + margin;
         paperGrid.rect(x, y, cellSide, cellSide).attr({"stroke": "black"});
         paperTarget.rect(x * targetScale, 0, cellSide * targetScale, cellSide * targetScale).attr({"stroke": "black"});
         if (goalBoxes[level][col] == 1) {
            paperTarget.rect((x + 4) * targetScale, 4 * targetScale,
               (cellSide - 8) * targetScale, (cellSide - 8) * targetScale).attr({"fill": "blue"});
         }
      }
   };

   var initRobotAndBoxes = function() {
      for (var col = 0; col < nbCols; col++) {
         var x = col * cellSide + margin;
         var y = cellSide + margin;
         if (cells[col] != null) {
            cells[col].remove();
         }
         cells[col] = null;
         if (data[level][col] == 1) {
            cells[col] = paperGrid.rect(x + 4, margin + cellSide + 4, cellSide - 8, cellSide - 8).attr({"fill": "blue"}); 
         }
      }
      if (robotRect != null) {
         robotRect.remove();
      }
      robotRect = paperGrid.rect(margin, margin - 8, cellSide, 8).attr({"fill": "red"});
      if (robotCell != null) {
         robotCell.remove();
      }
      robotCell = null;
   };

   var getSimulationInit = function(sequence, curLevel) {
      var boxes = [];
      for (var col = 0; col < nbCols; col++) {
         boxes.push(data[curLevel][col]);
      }
      return {
         instrs: sequence,
         step: 0,
         message: "",
         robot: {col: 0, hasBox: false},
         boxes: boxes,
         completed: false,
         success: false };
   };

   task.unload = function(callback) {
      DelayedExec.stopAll();
      callback();
   };

   var refreshAnswer = function() {
      var sequence = answer[level];
      while ((sequence.length > 0) && (sequence[sequence.length - 1] == null)) {
         sequence.pop();
      }
      dragAndDrop.removeAllObjects('seq');
      dragAndDrop.insertObjects('seq', 0, $.map(sequence, function(iInstr) {
         return { ident : iInstr, elements: getInstructionObject(iInstr) }; })
      );
   };

   task.getDefaultStateObject = function() {
      return { level: "easy" };
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;

      simulationSpeed = simulationSpeeds[level];
      if (display) {
         DelayedExec.stopAll();
         if (paper != null) {
            paper.remove();
            paperGrid.remove();
            paperTarget.remove();
         }
         buildInstructions();
         buildGrid();
         clearDisplay();
         //refreshAnswer();
      }
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
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
         "hard": []
      };
   };

   var stopExecution = function() {
      DelayedExec.stopAll();
      simuState = simuStates.stopped;
      $("#tryOrReset").attr('value', taskStrings.resetBoxes);
   };

   var simulateStep = function(simulation, display) {
      var instrs = simulation.instrs;
      if (simulation.step >= nbLoops * instrs.length) {
         if (instrs.length == 0) {
            throw taskStrings.noInstruction;
         } else {
            simulation.completed = true;
            simulation.message = taskStrings.executionCompleted;
         }
      } else {
         var robot = simulation.robot;
         var boxes = simulation.boxes;
         var iIteration = simulation.step / instrs.length; 
         var iSequence = simulation.step % instrs.length;
         var instr = instrs[iSequence];

         if (iSequence == 0)
            simulation.message = taskStrings.repetitionNumber + (iIteration+1) + ".";
         if (instr === null) {
         } else if (instr == 0) {
            if (boxes[robot.col] == 0) {
               throw taskStrings.inexistantBox;
            } else if (robot.hasBox) {
               throw taskStrings.alreadyCarryingBox;
            } else {
               robot.hasBox = true;
               boxes[robot.col] = 0;
               if (display) {
                  robotCell = cells[robot.col];
                  cells[robot.col] = null;
                  DelayedExec.animateRaphael("liftBox", robotCell,{y: margin + 4}, simulationSpeed);
               }
            }
         } else if (instr == 1) {
            if (!robot.hasBox) {
               throw taskStrings.notCarryingBox;
            } else if (boxes[robot.col] == 1) {
               throw taskStrings.droppingOnBox;
            } else {
               boxes[robot.col] = 1;
               robot.hasBox = false;
               if (display) {
                  cells[robot.col] = robotCell;
                  robotCell = null;
                  DelayedExec.animateRaphael("dropBox", cells[robot.col],{y: margin + 4 + cellSide}, simulationSpeed);
               }
            }
         } else if (instr == 2) {
            if (robot.col == nbCols - 1) {
               throw taskStrings.exitingGrid;
            } else {
               robot.col++;
            }
         } else if (instr == 3) {
            robot.col = nbCols - 1;
         } else if (instr == 4) {
            while (robot.col < nbCols - 1) {
               if (boxes[robot.col] == 1) {
                  break;
               }
               robot.col++;
            }
         } else if (instr == 5) {
            while (robot.col < nbCols - 1) {
               if (boxes[robot.col] == 0) {
                  break;
               }
               robot.col++;
            }
         } else if (instr == 6) {
            if (robot.col == 0) {
               throw taskStrings.exitingGrid;
            } else {
               robot.col--;
            }
         } else if (instr == 7) {
            robot.col = 0;
         } else if (instr == 8) {
            while (robot.col > 0) {
               if (boxes[robot.col] == 1) {
                  break;
               }
               robot.col--;
            }
         } else if (instr == 9) {
            while (robot.col > 0) {
               if (boxes[robot.col] == 0) {
                  break;
               }
               robot.col--;
            }
         }
         if (display) {
            if (robot.hasBox) {
               DelayedExec.animateRaphael("moveBox", robotCell, {x: margin + 4 + cellSide * robot.col}, simulationSpeed);
            }
            DelayedExec.animateRaphael("robot", robotRect, {x: margin + cellSide * robot.col}, simulationSpeed);
         }

         simulation.success = true;
         for (var col = 0; col < nbCols; col++) {
            if (boxes[col] != goalBoxes[level][col]) {
               simulation.success = false;
            }
         }
         simulation.step++;
      }
   };

   var clearDisplay = function() {
      stopExecution();

      initRobotAndBoxes();

      curSimulation = getSimulationInit([], level);
      simuState = simuStates.initial;
      $("#tryOrReset").attr('value', taskStrings.attempt);
      $("#message").html("");
   };

   var getSequence = function() {
      var sequence = dragAndDrop.getObjects('seq');
      return $.grep(sequence, function(i) { return i !== null; });
   };

   task.tryOrReset = function() {
      displayHelper.stopShowingResult();
      if (simuState == simuStates.initial) {
         simuState = simuStates.animating;
         $("#tryOrReset").attr('value', taskStrings.stop);
         executeSlow();
      } else if (simuState == simuStates.animating) {
         stopExecution();
      } else if (simuState == simuStates.stopped) {
         clearDisplay();
      } 
   }

   var executeSlow = function() {
      curSimulation.instrs = getSequence();
      var subExecuteStep = function() { 
         try {
            simulateStep(curSimulation, true);
         } catch (exception) {
            DelayedExec.setTimeout("stop", stopExecution, simulationSpeed);
            displayHelper.validate("stay");
            return;
         }
         $("#message").html(curSimulation.message);
         if (curSimulation.success){
            DelayedExec.clearInterval("executeStep");
            DelayedExec.setTimeout("stop", stopExecution, simulationSpeed);
            platform.validate("done");
         }
         else if (curSimulation.completed) {
            DelayedExec.setTimeout("stop", stopExecution, simulationSpeed);
            displayHelper.validate("stay");
         }
         if (curSimulation.step > 50) {
            simulationSpeed = 50;
            DelayedExec.setInterval("executeStep", subExecuteStep, simulationSpeed);
         }
      };
      DelayedExec.setInterval("executeStep", subExecuteStep, simulationSpeed);
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      var answer = $.parseJSON(strAnswer);
      var taskParams = displayHelper.taskParams;      
      var scores = {};
      var messages = {};
      var maxScores = displayHelper.getLevelsMaxScores();
      // clone the state to restore after grading.
      var oldState = $.extend({}, task.getStateObject());
      for (var curLevel in data) {
         state.level = curLevel;
         task.reloadStateObject(state, false);
         var simulation = getSimulationInit(answer[curLevel], curLevel);
         try {
            for (var i = 0; i < nbLoops * simulation.instrs.length; i++) {
               simulateStep(simulation, false);
               if (simulation.completed || simulation.success) {
                  break;
               }
            }
         } catch (exception) {
            messages[curLevel] = exception;
            scores[curLevel] = 0;
            continue;
         }
         if (simulation.success) {
            messages[curLevel] = taskStrings.success;
            scores[curLevel] = maxScores[curLevel];
         } else {
            messages[curLevel] = taskStrings.failure;
            scores[curLevel] = 0;
         }
      }
      task.reloadStateObject(oldState, false);
      if (gradedLevel == null) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}

initTask();