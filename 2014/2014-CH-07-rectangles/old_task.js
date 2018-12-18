function initTask() {
   var difficulty;
   var intervalId = -1;
   var side = 6;
   var instructions = [
      taskStrings.takeRedPencil, 
      taskStrings.takeBlackPencil,
      taskStrings.move1Cell,
      taskStrings.move2Cells,
      taskStrings.move3Cells,
      taskStrings.turnLeft,
      taskStrings.turnRight
      ];
   var solution;
   var targetColors;
   var maxSequenceLength = 12;
   var drawing1;
   var drawing2;
   var curSimulation;
   var dragAndDrop;
   var instructionDefs;
   var width = 440;
   var height = 300;
   var widthLabel = 180;
   var heightLabel = (height - 16) / maxSequenceLength;
   var simulationSpeeds = { easy: 400, hard: 300 };
   var simulationSpeed; 
   var paper;
   var states = {
      initial: 0,
      animating: 1,
      stopped: 2 };
   var state = states.initial;

   task.load = function(views, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         difficulty = taskParams.options.difficulty ? taskParams.options.difficulty : "hard";
         // LATER: vérifier que difficulty est easy ou hard
         solution = task.solutions[difficulty];
         simulationSpeed = simulationSpeeds[difficulty];

         var dimension1 = 150;
         drawing1 = buildGrid("drawing1", dimension1);
         var solSimulation = simulateAll(solution);
         updateGrid(drawing1, solSimulation.colors);
         targetColors = solSimulation.colors;

         var dimension2 = 200;
         drawing2 = buildGrid("drawing2", dimension2);
         var robotSize = 15;
         drawing2.robot = drawing2.paper.image("robot.png", 0, 0, robotSize, robotSize);
         drawing2.robot.size = robotSize;

         buildInstructions();
         clearDisplay();

         if (views.solution) {
            $.each(task.solutions[difficulty], function(iStep, iInstr) {
              $("#textSolution").append("<li>" + instructions[iInstr] + "</li>");
            });
         }

         if (taskParams.showSolutionOnLoad == 1) {
            task.reloadAnswer(JSON.stringify(solution), callback);
            return;
         } 
         
         callback();
      });
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
      paper = Raphael("programming", width, height);
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         drop: function(srcCont, srcPos, dstCont, dstPos, dropType) {
            displayHelper.stopShowingResult();
            if (state != states.initial) {
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
      for (var iInstr = 0; iInstr < instructions.length; iInstr++) {
         instructionDefs[iInstr] = dragAndDrop.addContainer({
            ident : iInstr,
            cx : 15 + widthLabel/2, 
            cy : 20 + iInstr * heightLabel, 
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

   var answerOfStrAnswer = function(strAnswer) {
      if (strAnswer == "") {
         return [];
      }
      return $.parseJSON(strAnswer);
   };

   task.reloadAnswer = function(strAnswer, callback) {
      clearDisplay();
      var sequence = answerOfStrAnswer(strAnswer);
      while ((sequence.length > 0) && (sequence[sequence.length - 1] == null)) {
         sequence.pop();
      }
      dragAndDrop.removeAllObjects('seq');
      dragAndDrop.insertObjects('seq', 0, $.map(sequence, function(iInstr) {
         return { ident : iInstr, elements: getInstructionObject(iInstr) }; })
      );
      curSimulation = simulateAll(sequence);
      updateDisplay();
      if (sequence.length > 0) {
         stopExecution();
      }
      callback();
   };

   task.getAnswer = function(callback) {               
      callback(JSON.stringify(dragAndDrop.getObjects('seq')));
   };

   var getSize = function(dimension) {
      var margin = 10;
      return (dimension - 2 * margin) / (side - 1);
   };

   var getCorner = function(dimension, x, y) {
      var size = getSize(dimension);
      var margin = 10;
      return {x: margin + x * size, y: margin + y * size };
   };

   var buildGrid = function(name, dimension) {
      var paper = Raphael(name, dimension, dimension); 
      var size = getSize(dimension);
      var segments = Beav.Matrix.init(side, side, function(x,y) {
         var corner = getCorner(dimension, x, y);
         var color = function(inside) { return (inside) ? "#808080" : "none"; };
         var hori = Beav.Raphael.lineRelative(paper, corner.x, corner.y, size, 0)
            .attr({ "stroke-width": 1, stroke: color(x < side - 1) });
         var vert = Beav.Raphael.lineRelative(paper, corner.x, corner.y, 0, size)
            .attr({ "stroke-width": 1, stroke: color(y < side - 1) });
         return [ hori, vert ];
      });
      return { paper: paper, segments: segments, dimension: dimension };
   };

   var updateGrid = function(drawing, colors) {
      Beav.Matrix.forEach(colors, function(b,x,y) {
         for (var dir = 0; dir < 2; dir++) {
            var seg = drawing.segments[x][y][dir];
            if (seg.attrs.stroke != "none") {
               var color = b[dir];
               var width = (color == "#808080") ? 1 : 3;
               if (color == "#808080")
                  color = "#D0D0D0"; 
               seg.attr({stroke: color, "stroke-width": width });
            } 
         }
      });
   };

   var updateRobot = function(drawing, robot) {
      var corner = getCorner(drawing.dimension, robot.x, robot.y);
      var rot = [ 0, 270, 180, 90 ][robot.idDir];
      var shift = drawing.robot.size / 2;
      drawing.robot.transform(["T", corner.x-shift, ",", corner.y-shift, "R", rot]);
   };

   var updateDisplay = function() {
      updateGrid(drawing2, curSimulation.colors);
      updateRobot(drawing2, curSimulation.robot);
      $("#message").html(curSimulation.message);
   };

   var getSimulationInit = function(sequence) {
      return {
         instrs: sequence,
         step: 0,
         colors: Beav.Matrix.init(side, side, function(x,y) {
                  return [ "#808080", "#808080" ]; }),
         message: "",
         robot: {x: 1, y: 1, idDir: 0, color: "#000000"},
         completed: false,
         success: false };
   };

   task.unload = function(callback) {
      stopExecution();
      callback();
   };

   var stopExecution = function() {
      if (intervalId != -1) {
         clearInterval(intervalId);
         intervalId = -1;
      }
      state = states.stopped;
      $("#tryOrReset").attr('value', taskStrings.deleteDrawing);
   };

   var simulateAll = function(sequence) {
      var simulation = getSimulationInit(sequence);
      for (var i = 0; i < 4 * simulation.instrs.length; i++) {
         simulateStep(simulation);
      }
      return simulation;
   };

   var simulateStep = function(simulation) {
      var instrs = simulation.instrs;
      if (simulation.step >= 4 * instrs.length) {
         if (instrs.length == 0) {
            simulation.message = taskStrings.noInstructionProvided;
         } else {
            simulation.completed = true;
            simulation.message = taskStrings.exercutionOver;
         }
         if (Beav.Object.eq(targetColors, simulation.colors)) {
            simulation.success = true;
         }
         stopExecution();         
      } else {
         var colors = simulation.colors;
         var robot = simulation.robot;
         var error = false;
         var iIteration = simulation.step / instrs.length; 
         var iSequence = simulation.step % instrs.length;
         var instr = instrs[iSequence];
         if (iSequence == 0)
            simulation.message = taskStrings.repetitionNumber + (iIteration+1) + ".";
         if (instr === null) {
         } else if (instr == 0) {
            robot.color = "#ff0000";
         } else if (instr == 1) {
            robot.color = "#000000";
         } else if (instr == 2 || instr == 3 || instr == 4) {
            var nb = instr-1;
            for (var iNb = 0; iNb < nb; iNb++) {
               var idDir = robot.idDir;
               var dirs = [ [1,0], [0,-1], [-1,0], [0,1] ];
               var newx = robot.x + dirs[idDir][0];
               var newy = robot.y + dirs[idDir][1];
               if (newx < 0 || newy < 0 || newx >= side || newy >= side) {
                  simulation.message = taskStrings.robotExitsGrid;
                  error = true;
                  break;
               }
               var cdir = (idDir == 0 || idDir == 2) ? 0 : 1;
               var cx = (idDir == 2) ? robot.x - 1 : robot.x;
               var cy = (idDir == 1) ? robot.y - 1 : robot.y;
               colors[cx][cy][cdir] = robot.color;
               robot.x = newx;
               robot.y = newy;
            }
         } else if (instr == 5) {
            robot.idDir = (robot.idDir+1) % 4;
         } else if (instr == 6) {
            robot.idDir = (robot.idDir+3) % 4;
         }
         simulation.step++;
         if (error) { 
            stopExecution();
            simulation.step = 4 * instrs.length;
         }
      }
   };

   var clearDisplay = function() {
      stopExecution();
      curSimulation = getSimulationInit([]);
      state = states.initial;
      $("#tryOrReset").attr('value', taskStrings.attempt);
      updateDisplay();
   };

   var getSequence = function() {
      var sequence = dragAndDrop.getObjects('seq');
      return $.grep(sequence, function(i) { return i !== null; });
   };

   task.tryOrReset = function() {
      displayHelper.stopShowingResult();
      if (state == states.initial) {
         state = states.animating;
         $("#tryOrReset").attr('value', taskStrings.stop);
         executeSlow();
      } else if (state == states.animating) {
         stopExecution();
      } else if (state == states.stopped) {
         clearDisplay();
      } 
   }

   var executeSlow = function() {
      curSimulation.instrs = getSequence();
      if (intervalId == -1) {
         intervalId = setInterval(function() { 
            simulateStep(curSimulation);
            updateDisplay();
            if (curSimulation.completed) {
               platform.validate("done");
            }
         }, simulationSpeed);
      }
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         var sequence = answerOfStrAnswer(strAnswer);
         if (sequence.length == 0) {
            callback(taskParams.noScore, taskStrings.moveInstructions);
            return;
         }
         var simulation = simulateAll(sequence);
         var finalColors = simulation.colors;
         if (Beav.Object.eq(targetColors, finalColors)) {
            callback(taskParams.maxScore, taskStrings.success);
         } else {
            callback(taskParams.minScore, taskStrings.failure);
         }
      });
   }
}
initTask();
