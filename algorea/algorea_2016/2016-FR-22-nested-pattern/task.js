
/*jshint eqnull:true */
function initTask() {
   'use strict';

   var resultCellSide = {
      easy: 15,
      medium: 15,
      hard: 15
   };
   var targetCellSide = {
      easy: 15,
      medium: 15,
      hard: 15
   };
   var instructions = [
      taskStrings.fillOneCell, // Noircir
      taskStrings.right,
      taskStrings.left,
      taskStrings.up,
      taskStrings.down,
      taskStrings.left5Times
      ];
   var instructionsAvailable = {
      easy: [0, 1, 2, 3, 4, 5],
      medium : [0, 1, 2, 3, 4, 5],  
      hard: [0, 1, 2, 3, 4, 5]
   };
   var targetPatterns = {
      easy: [
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],
      /*easy2: [
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ],*/
      medium: [
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
       ],
       hard: [
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
         [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
         [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
         [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
         [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
         [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
         [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
         [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
         [0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
         [0, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
         [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
       ]
   };
   var initPos = {
      easy: { lin: 0, col: 0 },
      medium: { lin: 2, col: 2 },
      hard: { lin: 2, col: 2 }
   };
   // everywhere: inner loop is 0, outer loop is 1
   var containers = ['seq0', 'seq1'];

   var maxSequencesLength = { // [inner loop, outer loop]
      easy: [6, 4], 
      medium: [6, 4],
      hard: [6, 4]
   };  
   var nbIterations = { // [inner loop, outer loop]
      easy: [5, 1], 
      medium: [5, 5],
      hard: [5, 5]
   };
   var simulationSpeeds = {
      easy: 250,
      medium: 250,
      hard: 250
   };
   var containersX = 210;
   var containersY; // [inner loop, outer loop]
   var simulationSpeedSuccess = 70;
   var drawing;
   var curSimulation;
   var dragAndDrop;
   var instructionDefs;
   var highlighter;
   var width = 450;
   var height = 520;
   var widthLabel = 130;
   var heightLabel = 40;
   var simulationSpeed; 
   var outerLoopLabel;
   var innerLoopLabel;
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
   var answer = null; // array of size 2, each storing list of instruction ids
   var state = null;
   var rects = {target:[], result:[]};
   var selectedCell = null;

   task.load = function(views, callback) {      
      displayHelper.hideValidateButton = true;
      displayHelper.timeoutMinutes = 10;
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

   function showHighlighter(height) {
      // arrow.transform("t " + (containersX + 45 + widthLabel) + ", " + (5 + height) + " S 4,6").show();
      highlighter.attr("y", height);

      // Quick and dirty check. Seems there's no clean way to know which container we are highlighting. 
      if(height < containersY[1]) {
         highlighter.attr("x", containersX + 55);
      }
      else {
         highlighter.attr("x", containersX + 25);
      }
      highlighter.show().toFront();
   };

   var buildInstructions = function() {
      paper = new Raphael("program", width, height);

      // arrow = paper.path("m 38.559417,11.191643 -6.761709,0.0221 -0.0065,-1.5166566 -2.159042,2.0027926 2.165514,1.800912 0,-1.35897 6.739612,0.06629 z").attr({id: 'path3761',parent: 'layer1',fill: '#ff0000',"fill-opacity": '1',stroke: '#ff0000',"stroke-width": '0.38',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-opacity": '1',"stroke-miterlimit": '4',"stroke-dasharray": 'none'}).hide();

      highlighter = paper.rect(0, 0, widthLabel, heightLabel).attr({
         stroke: "blue",
         "stroke-width": 5
      });

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
            if (dstCont == containers[0] || dstCont == containers[1]) {
               var iSeq = (dstCont == containers[0]) ? 0 : 1;
               var maxLength = maxSequencesLength[level][iSeq];
               var oldSequence = dragAndDrop.getObjects(dstCont);
               var maxiPos = 0;
               for (var i = 0; i < oldSequence.length; i++) {
                  if (oldSequence[i] != null) 
                     maxiPos = i+1;
               }

               if (srcCont == dstCont)
                  maxiPos--;
               if (dstPos <= maxiPos)
                  return true;
               if (maxiPos < maxLength)
                  return DragAndDropSystem.action(dstCont, maxiPos, 'insert');
            }
            return (dstCont == null);
         }
         
      });
      var margin = 10;
      var backgroundTarget1 = paper.rect(-widthLabel/2,-heightLabel/2,widthLabel,heightLabel)
         .attr('fill', '#F2F2FF');
      var backgroundTarget2 = paper.rect(-widthLabel/2,-heightLabel/2,widthLabel,heightLabel)
         .attr('fill', '#F2F2FF');

      var nb0 = maxSequencesLength[state.level][0];
      var nb1 = maxSequencesLength[state.level][1];
      var spaceTop = 70;
      var yBottom0 = spaceTop+nb0*heightLabel+5;
      var yBottom1 = yBottom0+nb1*heightLabel+35;
      containersY = [spaceTop, yBottom0+30];

      var repeatAttr = {"font-size": "18px", "font-weight": "bold", "text-anchor": "start"};
      outerLoopLabel = paper.text(containersX + 5, 20, taskStrings.repeat(nbIterations[level][1])).attr(repeatAttr);
      innerLoopLabel = paper.text(containersX + 25, 45, taskStrings.repeat(nbIterations[level][0])).attr(repeatAttr);
      var thenLabel = paper.text(containersX + 25, yBottom0 + 15, taskStrings.then).attr(repeatAttr);

      var blockAttr = { "stroke-width": 3, "stroke": "black" };
      var outerBlock = paper.path("M " + (containersX+20) +",35 L " + (containersX+10) +",35 L " + (containersX+10) +"," + yBottom1 + " L " + (containersX+20) +"," + yBottom1).attr(blockAttr);
      var innerBlock = paper.path("M " + (containersX+40) +",60 L " + (containersX+30) +",60 L " + (containersX+30) +"," + yBottom0 + " L " + (containersX+40) +"," + yBottom0).attr(blockAttr);

      if (level == "easy") {
         outerLoopLabel.hide();
         outerBlock.hide();
      }

      dragAndDrop.addContainer({
         ident : containers[0],
         cx : containersX + 55  + widthLabel / 2,
         cy : containersY[0] + (nb0*heightLabel)/2,
         widthPlace : widthLabel, 
         heightPlace : heightLabel,
         nbPlaces : nb0,
         dropMode : 'insertBefore',
         dragDisplayMode : 'preview',
         direction : 'vertical', 
         align : 'top',
         placeBackgroundArray : [backgroundTarget1]
      });
      dragAndDrop.addContainer({
         ident : containers[1],
         cx : containersX + 25 + widthLabel / 2,
         cy : containersY[1] + (nb1*heightLabel)/2,
         widthPlace : widthLabel, 
         heightPlace : heightLabel,
         nbPlaces : nb1,
         dropMode : 'insertBefore',
         dragDisplayMode : 'preview',
         direction : 'vertical', 
         align : 'top',
         placeBackgroundArray : [backgroundTarget2]
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

   var fillGridCell = function(name, lin, col, cellSide, putPain) {
      var x = margin + col * cellSide;
      var y = margin + lin * cellSide;
      if (putPain) {
         rects[name].push(papers[name].rect(x, y, cellSide, cellSide).attr({fill: "black"}));
      }
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
                  fillGridCell(name, iLin, iCol, cellSide, true);
               }
            }
         }
      } else {
         fillGridCell(name, initPos[state.level].lin, initPos[state.level].col, cellSide, false);
         rects[name] = [];
      }
   };

   var updateDisplay = function() {
      if (curSimulation == null) {
         $("#message").html("");
      } else {
         $("#message").html(curSimulation.message);
      }
   };

   var getSimulationInit = function(sequences, curLevel) {
      // build instruction lists by unfolding loops
      var innerInstrs = getInstructionsFromSequence(sequences[0], curLevel);
      var outerInstrs = getInstructionsFromSequence(sequences[1], curLevel);
      var instrs = [];
      var arrows = []; // at which height to show the arrow
      var counters = []; // label for counters of the loops (inner, then outer)
      var nbOuter = nbIterations[level][1];
      var nbInner = nbIterations[level][0];
      for (var iOuter = 0; iOuter < nbOuter; iOuter++) {
         for (var iInner = 0; iInner < nbInner; iInner++) {
            for (var iItem = 0; iItem < innerInstrs.length; iItem++) {
               instrs.push(innerInstrs[iItem]);
               arrows.push(containersY[0] + iItem * heightLabel);
               counters.push([ (iInner+1), (iOuter+1) ]);
            }
         }
         for (var iItem = 0; iItem < outerInstrs.length; iItem++) {
            instrs.push(outerInstrs[iItem]);
            arrows.push(containersY[1] + iItem * heightLabel);
            counters.push([ nbInner, (iOuter+1) ]);
         }
      }
      var simulation = {
         instrs: instrs,
         arrows: arrows,
         counters: counters,
         step: 0,
         message: "",
         grid: [],
         completed: false,
         success: false
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
      //simulation.grid[simulation.robot.lin][simulation.robot.col] = 1;
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

      nbLines = targetPatterns[level].length;
      nbCols = targetPatterns[level][0].length;

      if (display) {
         curSimulation = null;
         updateDisplay();
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
      var sequences = answer[level];
      for (var iSeq = 0; iSeq < containers.length; iSeq++) {
         var sequence = sequences[iSeq];
         while ((sequence.length > 0) && (sequence[sequence.length - 1] == null)) {
            sequence.pop();
         }
         dragAndDrop.removeAllObjects(containers[iSeq]);
         dragAndDrop.insertObjects(containers[iSeq], 0, $.map(sequence,    
            function(iInstr) {
               return { ident : iInstr, elements: getInstructionObject(instructionsAvailable[level][iInstr]) }; })
         );
      }
   };

   task.reloadAnswerObject = function(answerObj) {
      clearDisplay();
      answer = answerObj;
      refreshAnswer();
   };

   var getSequences = function() {
      /* does the following, plus some filtering for null values:
         return [ dragAndDrop.getObjects('seq0'),
                  dragAndDrop.getObjects('seq1') ];*/
      var sequences = [];
      for (var iSeq = 0; iSeq < containers.length; iSeq++) {
         var sequence = dragAndDrop.getObjects(containers[iSeq]);
         var items = $.grep(sequence, function(i) { return i !== null; });
         sequences.push(items);
      }
      return sequences;
   };

   task.getAnswerObject = function() {
      answer[level] = getSequences();
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      return { // For debug: put values here
         "easy": [[],[]],  
         "medium": [[],[]] ,
         "hard": [[],[]] 
      };
   };

   var stopExecution = function() {
      DelayedExec.stopAll();
      if (highlighter) {
         highlighter.hide();
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

   var simulateStep = function(simulation, display) {
      var instrs = simulation.instrs;
      if (simulation.step >= instrs.length) {
         if (instrs.length === 0) {
            //Beav.Exception.throw(taskStrings.noInstruction);
            throw taskStrings.noInstruction;
         } else {
            simulation.completed = true;
            simulation.message = taskStrings.completed;
         }
      } else {
         var robot = simulation.robot;
         var instr = instrs[simulation.step];

         simulation.message = "";
         
         var putPain = false;
         if ((instr === null) || (instr === undefined)) {
         } else if (instr == 0) { // paint
            simulation.grid[robot.lin][robot.col] = 1;
            putPain = true;
         } else { // move 
            var dir; // correspond to an index in delta
            var dist; // distance by which to move
            if (instr < 5) {
               dir = instr-1; 
               dist = 1;
            } else { // move 5 to the left
               dir = 1; // left
               dist = 5;
            }
            for (var iStep = 0; iStep < dist; iStep++) {
               var newLin = robot.lin + deltas[dir][0];
               var newCol = robot.col + deltas[dir][1];
               if ((newCol < 0) || (newCol >= nbCols) || (newLin < 0) || (newLin >= nbLines)) {
                  //Beav.Exception.throw(taskStrings.exitGrid);
                  throw taskStrings.exitGrid;
               }
               robot.lin = newLin;
               robot.col = newCol;
            }
         } 
         if (display) {
            fillGridCell("result", robot.lin, robot.col, resultCellSide[state.level], putPain);
         }
         if (display) {
            showHighlighter(simulation.arrows[simulation.step]);
            var counter = simulation.counters[simulation.step];
            outerLoopLabel.attr({text: taskStrings.repeat(nbIterations[level][1], counter[1])});
            innerLoopLabel.attr({text: taskStrings.repeat(nbIterations[level][0], counter[0])});
         }
         // Remark: this is rather inefficient
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
      for (var iRect = 0; iRect < rects.result.length; iRect++) {
         rects.result[iRect].remove();
      }
      if (selectedCell != null) {
         selectedCell.remove();
      }
      curSimulation = getSimulationInit([[],[]], level);
      fillGridCell("result", initPos[state.level].lin, initPos[state.level].col, resultCellSide[state.level], false);
      simuState = simuStates.initial;
      outerLoopLabel.attr({text: taskStrings.repeat(nbIterations[level][1])});
      innerLoopLabel.attr({text: taskStrings.repeat(nbIterations[level][0])});
      $("#simuButtons input").attr("disabled", "disabled");
      $("#pause").val("Pause");
      $("#message").html("");
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

   task.trySequence = function() {
      task.execute(getSequences()); 
   };

   task.execute = function(sequences) { 
      clearDisplay();
      displayHelper.stopShowingResult();
      simuState = simuStates.animating;
      $("#simuButtons input").removeAttr('disabled');

      // first simulation to determine success
      curSimulation = getSimulationInit(sequences, level);
      fullSimulation(level, curSimulation);
      var success = curSimulation.success;

      // second simulation for step by step.
      curSimulation = getSimulationInit(sequences, level);
      var speed = (success) ? simulationSpeedSuccess : simulationSpeed;
      executeSlow(speed);
   };

   task.pause = function() {
      if (simuState == simuStates.animating) {
         simuState = simuStates.paused;
         $("#pause").val(taskStrings.continue);
      } else {
         simuState = simuStates.animating;
         $("#pause").val(taskStrings.pause);
      }
   };

   task.stop = function() {
      clearDisplay();
   };

   var executeSlow = function(speed) {
      DelayedExec.setInterval("executeStep", function() { 
         if (simuState == simuStates.paused) {
            return;
         }
         try {
            simulateStep(curSimulation, true);
         } catch (exn) {
            //var exception = Beav.Exception.extract(exn);
            stopExecution();
            displayHelper.validate("stay");
         }
         updateDisplay();
         if (curSimulation.completed) {
            stopExecution();
            $("#pause").attr("disabled", "disabled");
            if (curSimulation.success) {
               platform.validate("done");
            } else {
               displayHelper.validate("stay");
            }
         }
      }, speed);
   };

   function fullSimulation(curLevel, simulation) {
      // Note: modifies simulation in place
      try {
         for (var i = 0; i < simulation.instrs.length; i++) {
            simulateStep(simulation, false);
            if (simulation.completed) {
               break;
            }
         }
      } catch (exn) {
         //var exception = Beav.Exception.extract(exn);
         simulation.error = exn;
      }
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      platform.getTaskParams(null, null, function(taskParams) {
         if (strAnswer === '') {
            callback(taskParams.minScore, '');
            return;
         }
         var answer = $.parseJSON(strAnswer);
         var scores = {};
         var messages = {};
         var maxScores = displayHelper.getLevelsMaxScores();
         // clone the state to restore after grading.
         var oldState = $.extend({}, task.getStateObject());
         for (var curLevel in targetPatterns) {
            state.level = curLevel;
            task.reloadStateObject(state, false);
            var simulation = getSimulationInit(answer[curLevel], curLevel);
            fullSimulation(curLevel, simulation);
            if (simulation.error !== undefined) {
               messages[curLevel] = simulation.error;
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
      });
   };
}

initTask();
