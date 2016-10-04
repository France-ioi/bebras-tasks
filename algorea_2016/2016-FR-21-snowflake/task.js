function initTask() {
   var instructions;
   var instructionsLevel = {
      easy:   ["A", "R", "D", "G"],
      medium: ["A", "R", "D", "G", "F1"],
      hard:   ["A", "R", "D", "G", "F1", "F2"]
   };
   var instructionId;
   var instructionIdLevel = {
      easy:   { avance: 0, recule: 1, droite90: 2, gauche90: 3, f1: 4 },
      medium: { avance: 0, recule: 1, droite90: 2, gauche90: 3, f1: 4 },
      hard:   { avance: 0, recule: 1, droite60: 2, gauche60: 3, f1: 4, f2: 5 }
   };
   var nbFonctions;
   var nbFonctionsLevel = {
      easy: 0,
      medium: 1,
      hard: 2
   };
   var examples = [{
      easy:   {main: [1, 0, 0, 1, 2] },
      medium: {main: [4, 1, 0], f1: [0, 0, 2, 0, 1] }, 
      hard:   {main: [2, 0, 0, 1, 3, 0], f1: [], f2: [] }
   },
   {
      easy:   {main: [1, 0, 2]},
      medium: {main: [4, 2, 4, 2, 4], f1: [0, 1]}, 
      hard:   {main: [2, 4, 4], f1: [5, 2, 2], f2: [0, 0, 1, 1] } 
   }];
   // {u0, u1, u2, u3}
   // avec x = u0 + u2*1/2 + u1*sqrt(3)/2
   // avec y = u3 + u1*1/2 + u2*sqrt(3)/2
   var allPaths = {
   easy: [
      [[0,0,0,0], [1,0,0,0]],
      [[0,0,0,0], [-1,0,0,0]],
      [[0,0,0,0], [0,0,0,1]],
      [[0,0,0,0], [0,0,0,-1]]
   ],
   medium: [

   [[0,0,0,0], [1,0,0,0]],
   [[3,0,0,0], [2,0,0,0]],
   [[2,0,0,0], [1,0,0,0]],

   [[2,0,0,0], [2,0,0,1]],
   [[2,0,0,0], [2,0,0,-1]],

   [[0,0,0,0], [-1,0,0,0]],
   [[-3,0,0,0], [-2,0,0,0]],
   [[-2,0,0,0], [-1,0,0,0]],

   [[-2,0,0,0], [-2,0,0,1]],
   [[-2,0,0,0], [-2,0,0,-1]],


   [[0,0,0,0], [0,0,0,1]],
   [[0,0,0,3], [0,0,0,2]],
   [[0,0,0,2], [0,0,0,1]],

   [[0,0,0,2], [1,0,0,2]],
   [[0,0,0,2], [-1,0,0,2]],

   [[0,0,0,0], [0,0,0,-1]],
   [[0,0,0,-3], [0,0,0,-2]],
   [[0,0,0,-2], [0,0,0,-1]],

   [[0,0,0,-2], [1,0,0,-2]],
   [[0,0,0,-2], [-1,0,0,-2]]
],
   hard: [ // Generated by running the solution and displaying the coordinates
      [[0,0,0,0],[0,0,1,0]],
      [[0,0,1,0],[1,0,1,0]],
      [[1,0,1,0],[2,0,1,0]],
      [[1,0,1,0],[2,0,0,0]],
      [[0,0,1,0],[0,0,2,0]],
      [[0,0,2,0],[0,0,3,0]],
      [[0,0,2,0],[1,0,2,0]],
      [[0,0,1,0],[-1,0,2,0]],
      [[-1,0,2,0],[-2,0,3,0]],
      [[-1,0,2,0],[-1,0,3,0]],
      [[0,0,0,0],[-1,0,0,0]],
      [[-1,0,0,0],[-2,0,1,0]],
      [[-2,0,1,0],[-3,0,2,0]],
      [[-2,0,1,0],[-2,0,2,0]],
      [[-1,0,0,0],[-2,0,0,0]],
      [[-2,0,0,0],[-3,0,0,0]],
      [[-2,0,0,0],[-3,0,1,0]],
      [[-1,0,0,0],[-1,0,-1,0]],
      [[-1,0,-1,0],[-1,0,-2,0]],
      [[-1,0,-1,0],[-2,0,-1,0]],
      [[0,0,0,0],[1,0,-1,0]],
      [[1,0,-1,0],[1,0,-2,0]],
      [[1,0,-2,0],[1,0,-3,0]],
      [[1,0,-2,0],[0,0,-2,0]],
      [[1,0,-1,0],[2,0,-2,0]],
      [[2,0,-2,0],[3,0,-3,0]],
      [[2,0,-2,0],[2,0,-3,0]],
      [[1,0,-1,0],[2,0,-1,0]],
      [[2,0,-1,0],[3,0,-1,0]],
      [[2,0,-1,0],[3,0,-2,0]]
   ]};
 
   var path;
   var dragAndDrop;
   var instructionDefs;
   var widthProgram = 750;
   var heightProgram = {easy: 110, medium: 160, hard: 210};
   var widthDrawing = {easy: 500, medium: 500, hard: 500 };
   var heightDrawing = { easy: 150, medium: 300, hard: 300 };
   var stepDist = 45;
   var widthLabel = 40;
   var heightLabel = 40;
   var maxSequenceLength = 15;
   var simulationSpeeds = { easy: 200, medium: 200, hard: 200 };
   var simulationSpeed; 
   var paper;
   var paperDrawing;
   var drawing;
   var robotSize = 20;
   var level = null;
   var simuStates = {
      initial: 0,
      animating: 1,
      stopped: 2
   };
   var simuState = simuStates.initial;
   var answer = null;
   
   var getCoordinateX = function(t) {
      if (t == null) t = [0, 0, 0, 0];
      return parseInt((t[0] + t[2]/2 + Math.sqrt(3)*t[1]/2) * stepDist + widthDrawing[level]/2, 10);
   };
   var getCoordinateY = function(t) {
      if (t == null) t = [0, 0, 0, 0];
      return parseInt((t[3] + t[1]/2 + Math.sqrt(3)*t[2]/2) * stepDist + heightDrawing[level]/2, 10);
   };
   
   var compare = function(a, b) {
      for (var i=0; i<2; i++)
        for (var j=0; j<4; j++)
          if (a[i][j] != b[i][j])
            return a[i][j] - b[i][j];
      return 0;
   };
   
   var dichotomie = function(e, t, inf, sup) {
      var med = Math.floor((inf + sup) / 2);
      if (inf+1 == sup) {
         if (compare(e, t[med]) == 0)
            return inf;
         else
            return -1;
      }
      if (compare(e, t[med]) < 0)
        return dichotomie(e, t, inf, med);
      else
        return dichotomie(e, t, med, sup);
   };
   
   task.load = function(views, callback) {      
      answer = task.getDefaultAnswerObject();
      displayHelper.hideValidateButton = true;
      displayHelper.timeoutMinutes = 10;
      displayHelper.setupLevels();
      callback();
   };

   var getInstructionObject = function(iInstr) {
      var label = paper.rect(-widthLabel/2, -heightLabel/2, widthLabel, heightLabel, heightLabel/5)
                       .attr({'fill': '#E0E0F8'});
      var text = paper.text(0, 0, instructions[iInstr]).attr({"font-size": 16, "font-weight": "bold"});
      //var text = paper.image(instructions[iInstr], -widthLabel/2, -heightLabel/2, widthLabel, heightLabel);
      return [label, text];
   };

   var buildProgram = function() {
      if (paper != null) {
         paper.remove();
      }
      paper = Raphael("program", widthProgram, heightProgram[level]);
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         drop: function(srcCont, srcPos, dstCont, dstPos, dropType) {
            if (simuState != simuStates.initial) {
               stopExecution();
            }
         },
         actionIfDropped: function(srcCont, srcPos, dstCont, dstPos, dropType) {
            var dropOk = dstCont == 'main';
            for (var iFonct=1; iFonct<=nbFonctions; iFonct++)
              dropOk = dropOk || dstCont == ('f' + iFonct);
            if (dropOk) {
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
                if (maxiPos < maxSequenceLength)
                   return DragAndDropSystem.action(dstCont, maxiPos, 'insert');
             } else {
                return dstCont == null;
             }
         }
      });
      
      // Function main
      dragAndDrop.addContainer({
         ident : 'main',
         cx : 140 + maxSequenceLength * widthLabel / 2,
         cy : 20 + 3 * heightLabel / 2,  
         widthPlace : widthLabel, 
         heightPlace : heightLabel,
         nbPlaces : maxSequenceLength,
         dropMode : 'insertBefore',
         dragDisplayMode : 'preview',
         direction : 'horizontal', 
         align : 'left',
         placeBackgroundArray : [paper.rect(-widthLabel/2,-heightLabel/2,widthLabel,heightLabel).attr('fill', '#F2F2FF')]
      });
      paper.text(65, 20 + 3 * heightLabel / 2, taskStrings.programLabel).attr({"font-size": "20px", "font-weight": "bold"});
      
      for (var iFonct=1; iFonct<=nbFonctions; iFonct++) {
         dragAndDrop.addContainer({
            ident : 'f' + iFonct,
            cx : 140 + maxSequenceLength * widthLabel / 2,
            cy : 20 + 10 * iFonct + (3 + 2*iFonct) * heightLabel / 2,  
            widthPlace : widthLabel, 
            heightPlace : heightLabel,
            nbPlaces : maxSequenceLength,
            dropMode : 'insertBefore',
            dragDisplayMode : 'preview',
            direction : 'horizontal', 
            align : 'left',
            placeBackgroundArray : [paper.rect(-widthLabel/2,-heightLabel/2,widthLabel,heightLabel).attr('fill', '#F2F2FF')]
         });
         paper.text(67, 20 + 10 * iFonct + (3 + 2*iFonct) * heightLabel / 2, taskStrings.functionLabel("F" + iFonct)).attr({"font-size": "20px", "font-weight": "bold"});
      }

      // Sources (Drag&Drop)
      instructionDefs = [];
      for (var iInstr = 0; iInstr < instructions.length; iInstr++) {
         instructionDefs[iInstr] = dragAndDrop.addContainer({
            ident : iInstr,
            cx : 210 + widthLabel / 2 + iInstr * widthLabel, 
            cy : 10 + widthLabel / 2, 
            widthPlace : widthLabel, 
            heightPlace : heightLabel,
            type : 'source',
            dropMode : 'insertBefore',
            sourceElemArray : getInstructionObject(iInstr)
         });
      }
      paper.text(110, 10 + widthLabel / 2, taskStrings.instructionsLabel).attr({"font-size": "20px", "font-weight": "bold"});
      
      return paper;
   };
   
   var buildDrawing = function(name) {
      if (paperDrawing != null) {
         paperDrawing.remove();
      }
      paperDrawing = Raphael(name, widthDrawing[level], heightDrawing[level]);
      return { paper: paperDrawing };
   };
   
   var clearDrawing = function() {
      stopExecution();
      simuState = simuStates.initial;
      $("#resetExecution").attr("disabled", true);
      $(".examples td").css("background-color", "");
      $("#completedMessage").html("");
      
      var pathString = "";
      
      for (var i = 0; i < path.length; i++) {
        var segment = path[i];
        pathString += "M" + getCoordinateX(segment[0]) + "," + getCoordinateY(segment[0]);        
        pathString += "L" + getCoordinateX(segment[1]) + "," + getCoordinateY(segment[1]);
      }
      drawing.paper.clear();
      drawing.paper.path(pathString).attr("stroke", "gray");
      for (var i = 0; i < path.length; i++) {
        var segment = path[i];
        for (var side = 0; side < 2; side++) {
           drawing.paper.circle(getCoordinateX(segment[side]), getCoordinateY(segment[side]), 2).attr({"stroke": "black", "fill": "black"});
        }
      }
      drawing.robot = drawing.paper.image("robot.png", getCoordinateX(null) - robotSize/2,
                                                       getCoordinateY(null) - robotSize/2,
                                                       robotSize, robotSize);
   };

   task.unload = function(callback) {
      DelayedExec.stopAll();
      callback();
   };
   
   var refreshAnswer = function() {
      var sequence = answer[level];
      for (var l in sequence) {
         while ((sequence[l].length > 0) && (sequence[l][sequence[l].length - 1] == null)) {
            sequence[l].pop();
         }
         dragAndDrop.removeAllObjects(l);
         dragAndDrop.insertObjects(l, 0, $.map(sequence[l], function(iInstr) {
            return { ident: iInstr, elements: getInstructionObject(iInstr) };
         }));
      }
   };

   task.getDefaultStateObject = function() {
      return { level: "easy" };
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;

      instructions = instructionsLevel[level];
      instructionId = instructionIdLevel[level];
      nbFonctions = nbFonctionsLevel[level];
      path = allPaths[level];
      path.sort(compare);
      if (display) {
         DelayedExec.stopAll();
         if (paper != null) {
            paper.remove();
            paperDrawing.remove();
         }
         simulationSpeed = simulationSpeeds[level];
         drawing = buildDrawing("drawing");
         displayExamples();
         buildProgram();
      }
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadAnswerObject = function(answerObj) {
      clearDrawing();
      answer = answerObj;
      refreshAnswer();
   };

   task.getAnswerObject = function() {
      answer[level] = { 'main': dragAndDrop.getObjects('main') };
      for (var iFonct=1; iFonct<=nbFonctions; iFonct++)
        answer[level]['f' + iFonct] = dragAndDrop.getObjects('f' + iFonct);
      return answer;
   };

   task.getDefaultAnswerObject = function() { // Todo, automatiser ici (nb variable de fonctions) ?
      return {
         'easy': { 'main': [] },
         'medium': { 'main': [], 'f1': [] },
         'hard': { 'main': [], 'f1': [], 'f2': [], 'f3': [] }
      };
   };
   
   var displayExamples = function() {
      for (var iExample = 0; iExample < examples.length; iExample++) {
         var buttonText = "";
         var example = examples[iExample][level];
         var description = { 
            main: taskStrings.programLabel, 
            f1: taskStrings.functionLabel("F1"), 
            f2: taskStrings.functionLabel("F2"),
            f3: taskStrings.functionLabel("F3") };
         for (var idFonct in example) {
             if (example[idFonct].length > 0) {
                buttonText += "<table class='exampleProgramRow'><tr><td width='112px'><b>" + description[idFonct] + "</b>&nbsp;</td><td>";
                buttonText += "<table class='exampleProgram' cellspacing=0><tr>";
                for (var i = 0; i < example[idFonct].length; i++) {
                   buttonText += "<td>" + instructions[example[idFonct][i]] + "</td>";
                }
                buttonText += "</tr></table>";
                buttonText += "</td></tr></table>";
             }
        }
         $("#example" + iExample).html(buttonText);
      }
   };
   
   var stopExecution = function() {
     DelayedExec.stopAll();
     simuState = simuStates.stopped;
     $("#tryExecution").attr('value', taskStrings.tryLabel);
   };
   
   var simulateStep = function(simulation, display) {
     if (simulation.stack.length == 0) {
       simulation.completed = true;
       return;
     } else {
       var act = simulation.stack.pop();
       if (act.id < simulation.seq[act.name].length) {
         simulation.stack.push({name: act.name, id: act.id+1});
         var rotation = [[1, 0, 0, 0],
                         [0, 1, 0, 0],
                         [0, 0, 1, 0],
                         [0, 0, 0, 1],
                         [-1, 0, 1, 0],
                         [0, -1, 0, 1],
                         [-1, 0, 0, 0],
                         [0, -1, 0, 0],
                         [0, 0, -1, 0],
                         [0, 0, 0, -1],
                         [1, 0, -1, 0],
                         [0, 1, 0, -1]];
         var decalage = 0;
         switch (simulation.seq[act.name][act.id]) {
            case instructionId.f1:
               simulation.stack.push({name: "f1", id: 0});
               break;
            case instructionId.f2:
               simulation.stack.push({name: "f2", id: 0});
               break;
            case instructionId.f3:
               simulation.stack.push({name: "f3", id: 0});
               break;
            case instructionId.droite90:
               if (display) {
                  drawing.robot.transform("...r90");
               }
               decalage = 3;
               break;
            case instructionId.gauche90:
               if (display) {
                  drawing.robot.transform("...r-90");
               }
               decalage = 12 - 3;
               break;
            case instructionId.droite60:
               if (display) {
                  drawing.robot.transform("...r60");
               }
               decalage = 2;
               break;
            case instructionId.gauche60:
               if (display) {
                  drawing.robot.transform("...r-60");
               }
               decalage = 12 - 2;
               break;
            case instructionId.avance:
            case instructionId.recule:
               var reculer = simulation.seq[act.name][act.id] == instructionId.recule;
               var oldPosition = simulation.position.slice(0);
               for (var i=0; i<4; i++) {
                  if (reculer)
                     simulation.position[i] -= simulation.direction[i];
                  else
                     simulation.position[i] += simulation.direction[i];
               }
               var actPosition = simulation.position.slice(0);
               var indice = Math.max(dichotomie([oldPosition, actPosition], path, 0, path.length),
                                     dichotomie([actPosition, oldPosition], path, 0, path.length));
               if (display) {
                  var pathString = "M" + getCoordinateX(oldPosition) + "," + getCoordinateY(oldPosition)
                                 + "L" + getCoordinateX(actPosition) + "," + getCoordinateY(actPosition);
                  drawing.paper.path(pathString).attr("stroke", "blue").attr("stroke-opacity", 1).attr("stroke-width", 4);
                  if (reculer)
                     drawing.robot.transform("...t-" + stepDist + "," + 0);
                  else
                     drawing.robot.transform("...t" + stepDist + "," + 0);
                  drawing.robot.toFront();
               }               
               if (indice == -1) {
                  throw taskStrings.outOfZone;
               } else {
                  if (!simulation.segmentSeen[indice])
                     //console.log(JSON.stringify([oldPosition, actPosition]) + ",");
                     simulation.segmentSeenNb++;
                  simulation.segmentSeen[indice] = true;
                  if (simulation.segmentSeenNb == path.length) {
                     simulation.success = true;
                  }
               }               
               break;
         }
         
         for (var i=0; i<12; i++) {
           if (simulation.direction[0] == rotation[i][0]
            && simulation.direction[1] == rotation[i][1]
            && simulation.direction[2] == rotation[i][2]
            && simulation.direction[3] == rotation[i][3]) {
              simulation.direction = rotation[(i + decalage) % 12];
              break;
           }
         }
       }
     }
   };

   var getSimulation = function(curAnswer) {
      var curSimulation = {
        stack: [],
        direction: [1, 0, 0, 0],
        position: [0, 0, 0, 0],
        seq: {},
        pathStatus: [],
        message: "",
        success: false,
        fail: false,
        segmentSeen: new Array(path.length),
        segmentSeenNb: 0
      };

     for (var iSeg = 0; iSeg < path.length; iSeg++) {
        curSimulation.segmentSeen[iSeg] = false;
      }
      
      curSimulation.seq.main = $.grep(curAnswer.main, function(i) { return i !== null; });
      for (var iFonct=1; iFonct<=nbFonctions; iFonct++)
        curSimulation.seq['f' + iFonct] = $.grep(curAnswer['f' + iFonct], function(i) { return i !== null; });
      curSimulation.stack = [{name: "main", id: 0}];
      curSimulation.pathStatus = new Array(path.length);
      for (var i=0; i<path.length; i++) {
        curSimulation.pathStatus[i] = false;
      }
      
      var recursivite = Array(nbFonctions);
      for (iFonct=0; iFonct<=nbFonctions; iFonct++) {
         recursivite[iFonct] = new Array(nbFonctions);
         for (jFonct=0; jFonct<=nbFonctions; jFonct++) {
            recursivite[iFonct][jFonct] = $.inArray(instructionId["f" + (iFonct + 1)], curSimulation.seq["f" + (jFonct + 1)]) != -1;
         }
      }
      
      for (pFonct=0; pFonct<nbFonctions; pFonct++) {
         for (dFonct=0; dFonct<nbFonctions; dFonct++) {
            for (fFonct=0; fFonct<nbFonctions; fFonct++) {
               if (recursivite[dFonct][pFonct] && recursivite[pFonct][fFonct]) {
                  recursivite[dFonct][fFonct] = true;
               }
            }
         }
      }
      
      for (iFonct=0; iFonct<nbFonctions; iFonct++) {
        if (recursivite[iFonct][iFonct]) {
           throw taskStrings.infiniteLoop("F" + (iFonct+1));
        }
      }
           
      return curSimulation;
   };
   
   var executeSlow = function(curAnswer, isExample) {
      simuState = simuStates.animating;
      $("#tryExecution").attr('value', taskStrings.stopLabel);
      $("#resetExecution").attr("disabled", false);
      
      try {
         var simulation = getSimulation(curAnswer);
      } catch(exception) {
         stopExecution();
         if (!isExample) {
            displayHelper.validate("stay");
         }
         return;
      }
      DelayedExec.setInterval("executeStep", function() {
         try {
            simulateStep(simulation, true);
         } catch (exception) {
            stopExecution();
            if (!isExample) {
               displayHelper.validate("stay");
            }
            return;
         }
         if (simulation.completed) {
            stopExecution();
            $("#completedMessage").html(taskStrings.executionComplete);
            if (!isExample) {
               if (simulation.success) {
                  platform.validate("done");
               } else {
                  displayHelper.validate("stay");
               }
            }
         }
      }, simulationSpeed);
   };

   task.tryExecution = function() {
      var curAnswer = task.getAnswerObject()[level];
      if (simuState == simuStates.initial) {
         executeSlow(curAnswer, false);
      } else if (simuState == simuStates.animating) {
         stopExecution();
      } else if (simuState == simuStates.stopped) {
         task.resetExecution();
         DelayedExec.setTimeout("execute", task.tryExecution , 500);
      }
   };
   
   task.resetExecution = function() {
      var curAnswer = task.getAnswerObject()[level];
      if (simuState == simuStates.initial) {
      } else if (simuState == simuStates.animating) {
         stopExecution();
         clearDrawing();
      } else if (simuState == simuStates.stopped) {
         clearDrawing();
      }
   };
   
   task.loadExample = function(iExample) {
      if (simuState == simuStates.initial) {
         $("#example" + iExample).parent().css("background-color", "#AAFFAA");
         executeSlow(examples[iExample][level], true);
      } else {
         task.resetExecution();
         DelayedExec.setTimeout("executeExample", function() { task.loadExample(iExample); } , 500);
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
        var simulation;
        var messages = {};
        var maxScores = displayHelper.getLevelsMaxScores();
        // clone the state to restore after grading.
        var oldState = $.extend({}, task.getStateObject());
        for (var curLevel in allPaths) {
           state.level = curLevel;
           task.reloadStateObject(state, false);
           scores[curLevel] = 0;
           try {
              simulation = getSimulation(answer[level]);
              while (!simulation.completed) {
                 simulateStep(simulation, false);
              }
           } catch(exception) {
              messages[curLevel] = exception;
              continue;
           }
           if (simulation.success) {
              scores[curLevel] = maxScores[curLevel];
              messages[curLevel] = taskStrings.success;
           } else {
              messages[curLevel] = taskStrings.incomplete;
           }
        }
        task.reloadStateObject(oldState, false);

        if (gradedLevel == null) {
           displayHelper.sendBestScore(callback, scores, messages);
        } else {
           callback(scores[gradedLevel], messages[gradedLevel]);
        }
      });
   };
}

initTask();

