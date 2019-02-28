function initTask() {
   var nbCols = 13;
   var nbLines = 14;
   var cellSide = 20;
   var nbLoops = 200;
   var instructions = [
      taskStrings.forward,
      taskStrings.turnLeft,
      taskStrings.turnRight,
      taskStrings.turnLeftIfNoTrack,
      taskStrings.turnRightIfNoTrack
   ];
   var allPathSteps = {
      "easy": [0, 0, 0, 0, -1, 0, 0, 0, 0, -1, 0, 0, 0, 0],
      "medium": [-1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0, 0, 1,
                     0, 0, 0, 0],
      "hard": [0, 0, 0, -1,
               0, 0, 0, 1,
               0, 0, 0, -1,
               0, 0, 0, 0, 0, -1,
               0, 0, 0, -1,
               0, 0, 0, 0, 1,
               0, 0, 1,
               0, 0, 0, 0, 0, 0, 0, 0, 1,
               0, 0, 0, 0, 0, 0, 0, 1,
               0, 0, 0, 0, -1,
               0, 1, 0, -1, 0, 1, 0, -1, 0, 1, 0, 0, 0, 0, 0, 0]
   };
   var pathSteps = allPathSteps["medium"];
   var initDir = { easy: 0, medium: 3, hard: 0 };
   var pathLocations;
   var maxSequenceLength = 8;
   var drawing;
   var curSimulation;
   var dragAndDrop;
   var instructionDefs;
   var width = 450;
   var height = 350;
   var widthLabel = 200;
   var heightLabel = (height - 16) / maxSequenceLength;
   var simulationSpeeds = { easy: 500, medium: 60, hard: 60 };
   var simulationSpeed; 
   var paper;
   var paperGrid;
   var margin = 5;
   var robotSize = 15;
   var deltas = [ [1,0], [0,-1], [-1,0], [0,1] ];
   var level = null;
   var simuStates = {
      initial: 0,
      animating: 1,
      stopped: 2 };
   var simuState = simuStates.initial;
   var answer = null;
   var state = null;


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
         cx : 350,
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
         nbInstructions = 3;
      }
      for (var iInstr = 0; iInstr < nbInstructions; iInstr++) {
         instructionDefs[iInstr] = dragAndDrop.addContainer({
            ident : iInstr,
            cx : 15 + widthLabel/2, 
            cy : 60 + iInstr * heightLabel, 
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

   var fillPathLocations = function() {
      var x = 1;
      var y = 1;
      var dir = 0;
      pathLocations = [{x:x, y:y}];
      for (var iStep = 0; iStep < pathSteps.length; iStep++) {
         var action = pathSteps[iStep];
         if (action != 0) {
            dir = (dir + action + 4) % 4;
         } else {
            x += deltas[dir][0];
            y += deltas[dir][1];
            pathLocations.push({x:x, y:y});
         }
      }
   }

   var buildGrid = function(name) {
      var paperHeight = cellSide * nbLines + 2 * margin;
      var paperWidth = cellSide * nbCols + 2 * margin;
      paperGrid = Raphael(name, paperWidth, paperHeight); 
      for (var lin = 0; lin <= nbLines; lin++) {
         var y = (margin + lin * cellSide);
         paperGrid.path("M" + margin + "," + y + " L" + (margin + nbCols * cellSide) + "," + y).attr({"stroke": "gray"});
      }
      for (var col = 0; col <= nbCols; col++) {
         var x = (margin + col * cellSide);
         paperGrid.path("M" + x + "," + margin + " L" + x + "," + (margin + nbLines * cellSide)).attr({"stroke": "gray"});
      }
      for (var iStep = 0; iStep < pathLocations.length - 1; iStep++) {
         var x = pathLocations[iStep].x;
         var y = pathLocations[iStep].y;
         var newX = pathLocations[iStep + 1].x;
         var newY = pathLocations[iStep + 1].y;
         paperGrid.path("M" + (margin + x * cellSide) + "," + (margin + y * cellSide) +
            "L" + (margin + newX * cellSide) + "," + (margin + newY * cellSide)).attr({"stroke-width": 3});
      }
      return { paper: paperGrid };
   };

   var updateGrid = function(drawing, colors) {
   };

   var updateRobot = function(drawing, robot) {
      var rot = [ 0, 270, 180, 90 ][robot.idDir];
      var shift = drawing.robot.size / 2;
      drawing.robot.transform(["T", margin + (robot.x * cellSide) - shift, ",", margin + (robot.y * cellSide) - shift, "R", rot]);
   };

   var updateDisplay = function() {
      updateRobot(drawing, curSimulation.robot);
      $("#message").html(curSimulation.message);
   };

   var getSimulationInit = function(sequence, curLevel) {
      return {
         instrs: sequence,
         step: 0,
         message: "",
         robot: {x: 1, y: 1, idDir: initDir[curLevel], color: "black", iLocation: 0},
         completed: false,
         success: false };
   };

   task.unload = function(callback) {
      DelayedExec.stopAll();
      callback();
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;
      simulationSpeed = simulationSpeeds[level];
      pathSteps = allPathSteps[level];
      fillPathLocations();

      if (display) {
         DelayedExec.stopAll();
         if (paper != null) {
            paper.remove();
            paperGrid.remove();
         }
         drawing = buildGrid("drawing");
         drawing.robot = drawing.paper.image("robot.png", 0, 0, robotSize, robotSize);
         drawing.robot.size = robotSize;
         buildInstructions();
      }
   }

   task.getDefaultStateObject = function() {
      return { level: "easy" };
   }

   task.getStateObject = function() {
      state.level = level;
      return state;
   }

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
      $("#tryOrReset").attr('value', taskStrings.resetTrack);
   };

   var simulateStep = function(simulation) {
      var instrs = simulation.instrs;
      if (simulation.step >= nbLoops * instrs.length) {
         if (instrs.length == 0) {
            throw taskStrings.noInstructionProvided;
         } else {
            simulation.completed = true;
            simulation.message = taskStrings.executionCompleted;
         }
      } else {
         var robot = simulation.robot;
         var iIteration = simulation.step / instrs.length; 
         var iSequence = simulation.step % instrs.length;
         var instr = instrs[iSequence];

         
         var idDir = robot.idDir;
         var newX = robot.x + deltas[idDir][0];
         var newY = robot.y + deltas[idDir][1];
         var nextLocation = pathLocations[robot.iLocation + 1];
         var prevLocation = {x: -1, y: -1};
         if (robot.iLocation > 0) {
            prevLocation = pathLocations[robot.iLocation - 1];
         }
         var movingBackwards = ((newX == prevLocation.x) && (newY == prevLocation.y));
         var movingForward = ((newX == nextLocation.x) && (newY == nextLocation.y));
         var trackAhead = movingBackwards || movingForward;
         if (iSequence == 0)
            simulation.message = taskStrings.repetitionNumber + (iIteration+1) + ".";
         if (instr === null) {
         } else if (instr == 0) {
            var idDir = robot.idDir;
            if (movingBackwards) {
               throw taskStrings.robotMovingBackwards;
            } else if (!movingForward) {
               throw taskStrings.robotExitingTrack;
            } else {
               robot.x = newX;
               robot.y = newY;
               robot.iLocation++;
               if (robot.iLocation == pathLocations.length - 1) {
                  simulation.message = taskStrings.executionCompleted;
                  simulation.success = true;
                  simulation.completed = true;
               }
            }
         } else if ((instr == 1) || ((instr == 3) && !trackAhead)) { // Turn left
            robot.idDir = (robot.idDir+1) % 4;
         } else if ((instr == 2) || ((instr == 4) && !trackAhead)) { // Turn right
            robot.idDir = (robot.idDir+3) % 4;
         }
         simulation.step++;
      }
   };

   var clearDisplay = function() {
      stopExecution();
      curSimulation = getSimulationInit([], level);
      simuState = simuStates.initial;
      $("#tryOrReset").attr('value', taskStrings.attempt);
      updateDisplay();
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
      DelayedExec.setInterval("executeStep", function() { 
         try {
            simulateStep(curSimulation);
         } catch (exception) {
            stopExecution();
            displayHelper.validate("stay");
         }
         updateDisplay();
         if (curSimulation.completed) {
            stopExecution();
            if (curSimulation.success) {
               platform.validate("done");
            } else {
               displayHelper.validate("stay");
            }
         }
      }, simulationSpeed);
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
      for (var curLevel in allPathSteps) {
         state.level = curLevel;
         task.reloadStateObject(state, false);
         var simulation = getSimulationInit(answer[curLevel], curLevel);
         try {
            for (var i = 0; i < nbLoops * simulation.instrs.length; i++) {
               simulateStep(simulation);
               if (simulation.completed) {
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
