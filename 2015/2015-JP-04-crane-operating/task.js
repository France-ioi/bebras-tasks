function initTask() {
   'use strict';
   var state = null;
   var level;
   var answer = null;
   var data = {
      easy: {
         initial: ["R", ".", "B"],
         target:  ["B", ".", "R"],
         optimal: 6
      },
      medium: {
         initial: [".", "R", "B", "R", "B", "R", "B", "."],
         target:  [".", "B", "R", "B", "R", "B", "R", "."],
         optimal: 14
      },
      hard: {
         initial: [".", "R", "R", "J", "B", "B", "J", "."],
         target:  [".", "J", "J", "B", "R", "R", "B", "."],
         optimal: 14
      }
   };
   var letterToColor = {
      "R":  "#FF0000",
      "B":  "#00AAFF",
      "J":  "#FFFF00"
   };
   var disallowedChars = /[^\d\s]/;
   var examples = {
      easy:    "1 2 2 1",
      medium:  "4 1 6 4",
      hard:    "2 8 3 1 5 2"
   };
   var maxUserCommands = 20;
   var digitButtons;

   var initialSlotToBlock;
   var simulationData = {};

   var animStepTime = 300; // TODO: mettre 500 en easy.
   var animTimeVertical = animStepTime / 2;
   var animTimeHorizontal = animStepTime / 2;

   var simulation;
   var paper;
   var paperParams = {
      width: 650,
      height: 240,
      centerX: 320,
      centerY: 160,
      squareSide: 50,
      squareAttr: {"r": 5},
      lineAttr: {"stroke-width": 4},
      blockTextAttr: {"font-size": 30},
      numberTextAttr: {"font-size": 20},
      buttons: true,
      buttonContainerAttr: {width: 40, height: 40}
   };
   var lineWidth = 4; // old: params.lineAttr["stroke-width"];

   var armMagnet;
   var armRope;
   var armParams = {
      ceilingWidth: 580,
      ceilingY: 2,
      ceilingAttr: {"stroke-width" : 1, "stroke": "black", "fill": "orange"},
      leftPadding: 40,
      ropeLength: 20,
      magnetImage: "magnet.png",
      magnetWidth: 55,
      magnetHeight: 54
   };

   var targetPaper;
   var targetPaperParams = {
      /*width:  600,
      height:  100,
      centerX: 300,
      centerY: 40,
      squareSide:  50,
      squareAttr: {"r": 5},
      lineAttr:  {"stroke-width": 4},
      blockTextAttr:  {"font-size": 30},
      numberTextAttr:  {"font-size": 20}*/
      width:  320,
      height:  60,
      centerX: 160,
      centerY: 20,
      squareSide:  30,
      squareAttr: {"r": 5},
      lineAttr:  {"stroke-width": 2},
      blockTextAttr:  {"font-size": 16},
      numberTextAttr:  {"font-size": 14}
   };

   task.load = function(views, callback) {
      initHandlers();

      //displayHelper.hideRestartButton = true;
      displayHelper.hideValidateButton = true;
      displayHelper.setupLevels();

      if (views.solutions) {
         $("#solution").show();
      }

      callback();
   };

   task.getDefaultStateObject = function() {
      return { level: "easy" };
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;

      if (display) {
         stopExecution();
         initTargetPaper();
         initPaper();
      }
   };

   task.reloadAnswerObject = function(answerObj) {
      stopExecution();
      answer = answerObj;
      initSimulationData(simulationData, level);
      resetPaperPositions();

      $("#anim").css("visibility", "hidden");
      // displaySequence();
      playAllSteps(true);
      $("#anim").css("visibility", "visible");

      updateButtonDisabled();
   };

   task.getAnswerObject = function() {
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      return { easy: [], medium: [], hard: []};
   };

   task.unload = function(callback) {
      stopExecution();
      callback();
   };

   var updateButtonDisabled = function() {
      var disabled = (answer[level].length === 0);
      $("#undo").attr("disabled", disabled);
      // $("#reset").attr("disabled", disabled);
   };

   var initHandlers = function() {
      /* $("#reset").click(function() {
         stopExecution();
         answer[level] = [];
         playAllSteps(true);
         updateButtonDisabled();
      }); */
      $("#undo").click(function() {
         stopExecution();
         answer[level].pop();
         playAllSteps(true);
         updateButtonDisabled();
      });
   };

   var initTargetPaper = function() {
      if (targetPaper) {
         targetPaper.remove();
      }
      targetPaper = new Raphael("target_anim", targetPaperParams.width, targetPaperParams.height);
      drawBlockBase(data[level].target, targetPaper, targetPaperParams);
   };

   var initPaper = function() {
      if (paper) {
         for(var digit in digitButtons) {
            digitButtons[digit].remove();
         }
         paper.remove();
      }
      paper = new Raphael("anim", paperParams.width, paperParams.height);
      initialSlotToBlock = drawBlockBase(data[level].initial, paper, paperParams);
      drawArm();
      initButtons();
   };

   var initButtons = function() {
      for(var digit in digitButtons) {
         digitButtons[digit].click(clickDigit(digit));
      }
   };

   var clickDigit = function(digit) {
      var handler = function() {
         if(simulationData.simulation && simulationData.simulation.isPlaying()) {
            return;
         }
         playStep(digit);
      };
      return handler;
   };

   var drawBlockBase = function(dataArray, paper, params) {
      var slotToBlock = {};
      var baseWidth = (params.squareSide + lineWidth) * dataArray.length + lineWidth;
      var baseHeight = params.squareSide + lineWidth;
      var leftEdge = params.centerX - baseWidth / 2;
      var bottomEdge = params.centerY + baseHeight / 2;
      var rightEdge = leftEdge + baseWidth;
      var topEdge = bottomEdge - baseHeight;

      var iSlot, xPos, yPos, text;

      // Floor.
      paper.path(["M", leftEdge, bottomEdge, "L", rightEdge, bottomEdge]).attr(params.lineAttr);

      // Vertical lines between blocks.
      for (var iColumn = 0; iColumn <= dataArray.length; iColumn++) {
         var posX = leftEdge + iColumn * (params.squareSide + lineWidth) + lineWidth / 2;
         var posY = topEdge + 3 * params.squareSide / 4;
         paper.path(["M", posX, posY, "L", posX, bottomEdge]).attr(params.lineAttr);
      }

      // Blocks.
      for (iSlot = 0; iSlot < dataArray.length; iSlot++) {
         var slotPosition = slotToPosition(level, params, iSlot);
         xPos = slotPosition.xPos;
         yPos = slotPosition.yPos;

         if (dataArray[iSlot] == ".") {
            continue;
         }

         var rect = paper.rect(xPos, yPos, params.squareSide, params.squareSide);
         rect.attr({
            "fill": letterToColor[dataArray[iSlot]]
         });
         rect.attr(params.squareAttr);

         text = paper.text(xPos + params.squareSide / 2, yPos + params.squareSide / 2, dataArray[iSlot]);
         text.attr(params.blockTextAttr);

         slotToBlock[iSlot] = [rect, text];
      }

      
      // Slot numbering or buttons.
      if(params.buttons) {
         // When creating the target, we must not touch digitButtons.
         digitButtons = [];
      }
      for (iSlot = 0; iSlot < dataArray.length; iSlot++) {
         xPos = leftEdge + iSlot * (params.squareSide + lineWidth) + lineWidth + params.squareSide / 2;
         yPos = bottomEdge + lineWidth + params.numberTextAttr["font-size"];

         if (!params.buttons) { // for target
            text = paper.text(xPos, yPos, (iSlot + 1));
            text.attr(params.numberTextAttr);
         } else { // for main
            xPos -= params.buttonContainerAttr.width / 2;
            yPos -= params.buttonContainerAttr.height / 2 - 5; // - 5 for padding
            var button = new Button(paper, xPos, yPos, params.buttonContainerAttr.width, params.buttonContainerAttr.height, parseInt(iSlot) + 1);
            digitButtons.push(button);
         }  
      }

      /*
      if (params == paperParams) {
         xPos = leftEdge - 56;
         yPos = bottomEdge + 27;
         paper.text(xPos, yPos, "Cliquez sur\nles boutons : ").attr({"font-size": 16, "font-weight": "bold", "fill": "#FF3333"});
      }*/

      return slotToBlock;
   };

   var slotToPosition = function(level, params, slot) {
      if(!level) {
         return {xPos: 0, yPos: 0};
      }
      var baseWidth = (params.squareSide + lineWidth) * data[level].initial.length + lineWidth;
      var baseHeight = params.squareSide + lineWidth;
      var leftEdge = params.centerX - baseWidth / 2;
      var bottomEdge = params.centerY + baseHeight / 2;
      var rightEdge = leftEdge + baseWidth;
      var topEdge = bottomEdge - baseHeight;

      return {
         xPos: leftEdge + slot * (params.squareSide + lineWidth) + lineWidth,
         yPos: topEdge + lineWidth / 2
      };
   };

   var drawArm = function() {
      var leftEdge = paperParams.width / 2 - armParams.ceilingWidth / 2;
      var rightEdge = leftEdge + armParams.ceilingWidth;

      // paper.path(["M", leftEdge, armParams.ceilingY, "L", rightEdge, armParams.ceilingY]).attr(armParams.ceilingAttr);
      var ceilingHeight = 8;
      paper.rect(leftEdge, armParams.ceilingY, rightEdge-leftEdge, ceilingHeight).attr(armParams.ceilingAttr);

      armParams.armX = leftEdge + armParams.leftPadding;
      armRope = paper.path(["M", armParams.armX, armParams.ceilingY, "L", armParams.armX, armParams.ceilingY + armParams.ropeLength]);

      armParams.magnetX = armParams.armX - armParams.magnetWidth / 2;
      armParams.magnetY = armParams.ceilingY + armParams.ropeLength;
     
      // with png image... 
      armMagnet = paper.image(armParams.magnetImage, armParams.magnetX, armParams.magnetY, armParams.magnetWidth, armParams.magnetHeight);

      /* svg image
      var armMagnet = paper.set();
      var path3144 = paper.path("m0.570251,55.542221l-0.069092,-19.435974c-0.0634,-17.845062 14.532913,-35.998962 27.640945,-35.598846c13.108047,0.400131 27.46846,17.207123 27.354614,35.598846l0.205948,19.460953l-12.682236,0.000336l-0.011292,-19.461288c-0.512833,-9.964554 -6.865524,-22.041916 -15.493393,-21.744858c-8.410645,0.289597 -14.582611,12.360153 -14.584702,21.744858l-0.003998,19.471451l-12.356796,-0.035477z").attr({id: 'path3144',parent: 'layer1',fill: '#d40000',stroke: '#000000',"stroke-width": '2',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '4',"stroke-opacity": '1',"stroke-dasharray": 'none'});
      var path3928 = paper.path("m43.695038,49.199799l0,-5.662125l5.547256,0l5.547241,0l0,5.662125l0,5.662125l-5.547241,0l-5.547256,0l0,-5.662125z").attr({id: 'path3928',parent: 'layer1',fill: '#b3b3b3',"fill-opacity": '1',"fill-rule": 'evenodd',stroke: '#b3b3b3',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '10',"stroke-opacity": '1',"stroke-dasharray": 'none',"stroke-dashoffset": '0'});
      var path3934 = paper.path("m1.090225,49.199799l0,-5.662125l5.547241,0l5.547241,0l0,5.662125l0,5.662125l-5.547241,0l-5.547241,0l0,-5.662125z").attr({id: 'path3934',parent: 'layer1',fill: '#b3b3b3',"fill-opacity": '1',"fill-rule": 'evenodd',stroke: '#b3b3b3',"stroke-width": '1',"stroke-linecap": 'butt',"stroke-linejoin": 'miter',"stroke-miterlimit": '10',"stroke-opacity": '1',"stroke-dasharray": 'none',"stroke-dashoffset": '0'});
      armMagnet.push(path3144, path3928, path3934);    
      */

      armParams.ropeExtension = slotToPosition(level, paperParams, 0).yPos - (armParams.ceilingY + armParams.ropeLength) - armParams.magnetHeight;
   };

   var getResultAndMessage = function(input, level) {
      var simulationData = {};
      initSimulationData(simulationData, level);
      var success = createSimulation(simulationData, input);
      if (!success) {
         return {
            result: "invalid_command"
         };
      }
      var finalArray = simulationData.currentArray;
      if (!(Beav.Object.eq(data[level].target, finalArray))) {
         return {
            result: "wrong"
         };
      }
      if (input.length > data[level].optimal) {
         return {
            result: "suboptimal",
            steps: input.length,
            minSteps: data[level].optimal
         };
      }
      return {
         result: "optimal"
      };
   };

   var resetPaperPositions = function() {
      $("#feedback").html("");
      if (answer[level].length === 0) {
         $("#feedback").html(taskStrings.instructions);
      }

      for (var iSlot in initialSlotToBlock) {
         initialSlotToBlock[iSlot][0].attr({
            x: slotToPosition(level, paperParams, iSlot).xPos,
            y: slotToPosition(level, paperParams, iSlot).yPos
         });
         initialSlotToBlock[iSlot][1].attr({
            x: slotToPosition(level, paperParams, iSlot).xPos + paperParams.squareSide / 2,
            y: slotToPosition(level, paperParams, iSlot).yPos + paperParams.squareSide / 2
         });
      }

      armRope.attr({
         path: ["M", armParams.armX, armParams.ceilingY, "L", armParams.armX, armParams.ceilingY + armParams.ropeLength]
      });
      // with SVG:
      // armMagnet.transform("t" + armParams.magnetX + "," + armParams.magnetY);
      armMagnet.attr({
         x: armParams.magnetX,
         y: armParams.magnetY
      });
   };

   var playAllSteps = function(expedite) {
      resetPaperPositions();
      displaySequence();
      initSimulationData(simulationData, level);
      if(answer[level].length === 0) {
         return;
      }
      createSimulation(simulationData, answer[level]);
      simulationData.simulation.setAutoPlay(true);
      simulationData.simulation.setExpedite(expedite);
      simulationData.simulation.play();
   };

   var playStep = function(digit, expedite) {
      $("#feedback").html("");
      var result = createStep(simulationData, digit);
      if (! result.success) {
         $("#feedback").html(result.message);
         return;
      }
      answer[level].push(digit);
      displaySequence();
      simulationData.simulation.gotoLastStep();
      var step = new SimulationStep();
      step.addEntry({
         name: "validate",
         action: {
            onExec: function(params, duration, callback) {
               if (simulationData.success) {
                  platform.validate("done");
               }
               callback();
            }
         }
      });
      simulationData.simulation.addStep(step);
      simulationData.simulation.setAutoPlay(true);
      simulationData.simulation.setExpedite(expedite);
      simulationData.simulation.play();
      updateButtonDisabled();
   };

   var initSimulationData = function(simulationData, level) {
      simulationData.currentArray = $.extend([], data[level].initial);
      simulationData.currentMagnetLetter = null;
      simulationData.simulation = new Simulation();
      simulationData.currentMagnetBlock = null;
      simulationData.currentSlotToBlock = $.extend({}, initialSlotToBlock);
      simulationData.magnetSlot = null;
      simulationData.success = false;
   };

   var createSimulation = function(simulationData, input) {
      simulationData.simulation = new Simulation();
      for (var iDigit in input) {
         var result = createStep(simulationData, input[iDigit]);
         if (! result.success) {
            return false;
         }
      }
      return true;
   };

   var createStep = function(simulationData, slot) {
      var step = new SimulationStep();
      if(simulationData.magnetSlot === slot) {
         simulationData.animTimeHorizontal = 0;
      }
      else{
         simulationData.animTimeHorizontal = animTimeHorizontal;
         simulationData.magnetSlot = slot;
      }
      simulateArmHorizontal(step, slot);
      if (simulationData.currentMagnetLetter) {
         simulateBlockHorizontal(step, slot);
      }

      var targetFree = (simulationData.currentArray[slot] == ".");
      var craneFree = (simulationData.currentMagnetLetter === null);
      if (!targetFree && craneFree) {
         simulatePickup(step, slot);
         simulationData.currentMagnetLetter = simulationData.currentArray[slot];
         simulationData.currentArray[slot] = ".";
      } else if (targetFree && !craneFree) {
         simulateDrop(step, slot);
         simulationData.currentArray[slot] = simulationData.currentMagnetLetter;
         simulationData.currentMagnetLetter = null;
      } else if (!targetFree && !craneFree) {
         return { success: false, message: taskStrings.cannotDrop };
      } else if (targetFree && craneFree) {
         return { success: false, message: taskStrings.cannotGrab };
      }
      simulateCheckFinish(step, $.extend([], simulationData.currentArray));
      simulationData.simulation.addStep(step);
      return {success: true};
   };

   var simulateHighlight = function(step, iToken) {
      var highlightToken = function(params, duration, callback) {   
         /* FOR TOKENS
         $("#tokens span").removeClass("highlighted");
         $("#token" + params).addClass("highlighted");
          */
         callback();
      };
      step.addEntry({
         name: "highlight",
         action: {
            onExec: highlightToken,
            params: iToken
         }
      });
   };

   var simulateArmHorizontal = function(step, slot) {
      var animTime = simulationData.animTimeHorizontal;
      var moveMagnetX = function(params, duration, callback) {
         var magnetTargetX = slotToPosition(level, paperParams, slot).xPos + paperParams.squareSide / 2 - armParams.magnetWidth / 2;
         return genericAnimation(armMagnet, {x: magnetTargetX}, duration, callback);
      };

      var moveRopeX = function(params, duration, callback) {
         var ropeTargetX = slotToPosition(level, paperParams, slot).xPos + paperParams.squareSide / 2;
         var path = ["M", ropeTargetX, armParams.ceilingY, "L", ropeTargetX, armParams.ceilingY + armParams.ropeLength];
         return genericAnimation(armRope, {path: path}, duration, callback);
      };

      step.addEntry({
         name: "magnetSide",
         action: {
            onExec: moveMagnetX,
            duration: animTime
         }
      });
      step.addEntry({
         name: "ropeSide",
         action: {
            onExec: moveRopeX,
            duration: animTime
         }
      });
   };

   var simulatePickup = function(step, slot) {
      var down = getArmVerticalEntries(step, slot, "down");
      var up = getArmVerticalEntries(step, slot, "up");
      up = up.concat(getBlockVerticalEntries(step, slot, "up"));
      step.addEntriesAllParents(down);
      step.addEntriesAllParents(up);
   };

   var simulateDrop = function(step, slot) {
      var down = getArmVerticalEntries(step, slot, "down");
      down = down.concat(getBlockVerticalEntries(step, slot, "down"));
      var up = getArmVerticalEntries(step, slot, "up");

      step.addEntriesAllParents(down);
      step.addEntriesAllParents(up);
   };

   var getArmVerticalEntries = function(step, slot, direction) {
      var magnetTargetY = armParams.magnetY;
      var ropeTargetLength = armParams.ropeLength;
      if (direction == "down") {
         magnetTargetY += armParams.ropeExtension;
         ropeTargetLength += armParams.ropeExtension;
      }

      var moveMagnetY = function(params, duration, callback) {
         return genericAnimation(armMagnet, {y: magnetTargetY}, duration, callback);
      };

      var changeRopeLength = function(params, duration, callback) {
         var xPos = slotToPosition(level, paperParams, slot).xPos + paperParams.squareSide / 2;
         var path = ["M", xPos, armParams.ceilingY, "L", xPos, armParams.ceilingY + ropeTargetLength];
         return genericAnimation(armRope, {path: path}, duration, callback);
      };

      var magnetEntry = {
         name: "magnet" + direction,
         action: {
            onExec: moveMagnetY,
            duration: animTimeVertical
         }
      };
      var ropeEntry = {
         name: "rope" + direction,
         action: {
            onExec: changeRopeLength,
            duration: animTimeVertical
         }
      };
      return [magnetEntry, ropeEntry];
   };

   var getBlockVerticalEntries = function(step, slot, direction) {
      var rectTargetY, textTargetY;
      if (direction == "down") {
         rectTargetY = slotToPosition(level, paperParams, 0).yPos;
      } else {
         rectTargetY = armParams.magnetY + armParams.magnetHeight;
      }
      textTargetY = rectTargetY + paperParams.squareSide / 2;

      var updateMagnetBlock = function(params, duration, callback) {
         if (direction == "down") {
            simulationData.currentSlotToBlock[slot] = simulationData.currentMagnetBlock;
            simulationData.currentMagnetBlock = null;
         } else {
            simulationData.currentMagnetBlock = simulationData.currentSlotToBlock[slot];
            delete simulationData.currentSlotToBlock[slot];
         }
         callback();
      };

      var rectEntry = {
         name: "rect" + direction,
         action: {
            onExec: moveBlockRect,
            duration: animTimeVertical,
            params: {
               y: rectTargetY
            }
         },
         parents: ["state_update"]
      };
      var textEntry = {
         name: "text" + direction,
         action: {
            onExec: moveBlockText,
            duration: animTimeVertical,
            params: {
               y: textTargetY
            }
         },
         parents: ["state_update"]
      };
      var stateEntry = {
         name: "state_update",
         action: {
            onExec: updateMagnetBlock
         }
      };

      if (direction == "down") {
         return [rectEntry, textEntry, stateEntry];
      } else {
         return [stateEntry, rectEntry, textEntry];
      }
   };

   var simulateBlockHorizontal = function(step, slot) {
      var animTime = simulationData.animTimeHorizontal;
      var xPos = slotToPosition(level, paperParams, slot).xPos;
      var rectHorizontalEntry = {
         name: "rectHorizontal",
         action: {
            onExec: moveBlockRect,
            duration: animTime,
            params: {
               x: xPos
            }
         }
      };
      var textHorizontalEntry = {
         name: "textSide",
         action: {
            onExec: moveBlockText,
            duration: animTime,
            params: {
               x: xPos + paperParams.squareSide / 2
            }
         }
      };
      step.addEntry(rectHorizontalEntry);
      step.addEntry(textHorizontalEntry);
   };

   var moveBlockRect = function(params, duration, callback) {
      return genericAnimation(simulationData.currentMagnetBlock[0], params, duration, callback);
   };

   var moveBlockText = function(params, duration, callback) {
      return genericAnimation(simulationData.currentMagnetBlock[1], params, duration, callback);
   };

   var genericAnimation = function(object, params, duration, callback) {
      if(duration === 0) {
         object.attr(params);
         callback();
      }
      else {
         return object.animate(params, duration, callback);
      }
   };

   var displaySequence = function() {
      $("#step_counter").html(answer[level].length);
      return;
   /*
   // FOR TOKENS
      var tokensHTML = "";
      var tokens = answer[level];
      for (var iToken in tokens) {
         tokensHTML += "<span id=\"token" + iToken + "\">" + (parseInt(tokens[iToken]) + 1);
         if(iToken % 2 === 0) {
            tokensHTML += "&#8593;";
         }
         else {
            tokensHTML += "&#8595;";
         }
         tokensHTML += "</span>&nbsp;&nbsp;";
      }

      $("#tokens").html(tokensHTML);
   */
   };

   var simulateCheckFinish = function(step, currentArray) {
      step.addEntryAllParents({
         name: "validate",
         action: {
            onExec: function(params, duration, callback) {
               if (!simulationData.simulation.expediting) {
                  if ((Beav.Object.eq(data[level].target, currentArray))) {
                     simulationData.success = true;
                  }
               }
               callback();
            }
         }
      });
   };

   var stopExecution = function() {
      if (simulationData.simulation) {
         simulationData.simulation.stop();
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
      for (var curLevel in data) {
         state.level = curLevel;
         task.reloadStateObject(state, false);

         var resultAndMessage = getResultAndMessage(answer[curLevel], curLevel);
         var result = resultAndMessage.result;
         var relativeScore = 0.0;
         if (result == "error") {
            messages[curLevel] = resultAndMessage.message;
         } else if (result == "wrong") {
            // Note: normally should never be displayed; only used if the answer is boggus.
            messages[curLevel] = "La configuration finale ne correspond pas à l'objectif.";
         } else if (result == "invalid_command") {
            scores[curLevel] = taskParams.noScore;
            // Note: normally should never be displayed; only used if the answer is boggus.
            messages[curLevel] = "Commande invalide : chaque commande doit permettre à la grue de prendre ou poser un bloc.";
         } else if (result == "suboptimal") {
            if (resultAndMessage.steps <= resultAndMessage.minSteps + 2) {
               relativeScore = 6/10;
            } else {
               relativeScore = 3/10;
            }
            messages[curLevel] = taskStrings.successPartial(resultAndMessage.steps, resultAndMessage.minSteps);
         } else if(result == "optimal") {
            relativeScore = 1.0;
            messages[curLevel] = taskStrings.success;
         }
         scores[curLevel] = levelScoreInterpolate(maxScores, curLevel, relativeScore); 
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

