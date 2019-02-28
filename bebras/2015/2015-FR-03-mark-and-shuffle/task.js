function initTask() {
   'use strict';
   var state = null;
   var level;
   var answer = null;
   var data = {
      easy: {
         birds: 5,
         marks: 5
      },
      medium: {
         birds: 8,
         marks: 4
      },
      hard: {
         birds: 8,
         marks: 3
      }
   };
   var birdLetters = "ABCDEFGH";
   var phases = {
      mark: 1,
      drag: 2,
      finish: 3
   };

   var maxSlotHeight = 244;
   var bottomContainerY = maxSlotHeight + 84; 
   var topContainerCenterY = 122; // changes according to the level 
   var bottomContainerCenterY = 430; // changes according to the level

   var paper;
   var paperWidth = 700;
   var paperHeight = 570;
   var topContainer;
   var bottomContainer;
   var dragAndDrop;
   var birds;
   var marks;
   var simulation;
   var shuffleButton;
   var restartButton;
   var validateButton;
   var backButton;
   var instructionLabel;
   var errorLabel;

   var containerDefaultAnimTime = 10;
   var containerShuffleAnimTime = 10;

   var birdParams = {
      birdImage: {
         name: "bird.png",
         width: 71,
         height: 71
      },
      legWidth: 40,
      legHeight: 150, // changes according to the level
      legOffsetY: 75, // changes according to the level
      offsetY: 5  // changes according to the level
   };
   var slotAttr = {
      width: 80, 
      height: 240 // changes according to the level
   };
   var markParams = {
      offsetX: 0,
      verticalSpaceFirstAndLast: 10,
      width: 20,
      height: 20,
      verticalSpace: 5,
      rectAttr: {
         "stroke-width": 0.5
      },
      markedAttr: {
         fill: "gray"
      },
      unmarkedAttr: {
         fill: "white"
      }
   };
   var buttonParams = {
      restart: {
         xPos: 370,
         yPos: 280,
         width: 250,
         height: 32,
         text: taskStrings.restart
      },
      validate: {
         xPos: 100,
         yPos: 280,
         width: 250,
         height: 32,
         text: taskStrings.validate
      },
      shuffle: {
         xPos: 100,
         yPos: 280,
         width: 250,
         height: 32,
         text: taskStrings.shuffle
      },
      back: {
         xPos: 370,
         yPos: 280,
         width: 250,
         height: 32,
         text: taskStrings.backToPrevious
      }
   };
   var instructionLabelAttr = {
      xPos: paperWidth/2,
      yPos: 262,
      text: taskStrings.moveBirds,
      "font-size": 16,
      "font-weight": "bold"
   };
   var errorLabelAttr = {
      xPos: paperWidth/2,
      yPos: 262,
      text: taskStrings.notDifferent,
      "font-size": 16,
      "font-weight": "bold",
      "fill": "red"
   };
   var letterAttr = {
      y: 20,
      "font-size": 32
   };

   // TODO fill permutations
   var permutations = {
      easy: [
         [3, 2, 4, 0, 1],
         [4, 1, 2, 3, 0]
      ],
      medium: [
         [6, 1, 3, 5, 0, 2, 7, 4]
      ],
      hard: [
         [6, 1, 3, 5, 0, 2, 7, 4]
      ]
   };
   var currentSeedOffsets = {
      easy: 0,
      medium: 0,
      hard: 0
   };
   var taskSeed;

   task.load = function(views, callback) {
      platform.getTaskParams("randomSeed", null, function(randomSeed) {
         taskSeed = randomSeed;
         // displayHelper.hideValidateButton = true;
         // displayHelper.hideRestartButton = true;
         displayHelper.setupLevels();

         if (views.solutions) {
            $("#solution").show();

            // TODO: temporary
         }

         // FOR DEBUG (display a locked hard version):
         // $("#tab_hard").addClass("lockedLevel");

         callback();
      });
   };

   task.getDefaultStateObject = function() {
      return {
         level: "easy"
      };
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;

      if (display) {}
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      initPaper();
      loadPhase();
      initBirds();
      //initLetters();
   };

   task.getAnswerObject = function() {
      updateAnswer();
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      currentSeedOffsets[level]++;
      var answer = {};
      var counter = 0;
      for (var curLevel in data) {
         counter++;
         answer[curLevel] = {};
         answer[curLevel].permutationIndex = (1237 * counter + taskSeed + currentSeedOffsets[curLevel]) % permutations[curLevel].length;
         answer[curLevel].phase = phases.mark;
         answer[curLevel].bottom = Beav.Array.make(data[curLevel].birds, null);
         answer[curLevel].marks = [];
         answer[curLevel].top = [];
         for (var iBird = 0; iBird < data[curLevel].birds; iBird++) {
            answer[curLevel].marks.push(Beav.Array.make(data[curLevel].marks, false));
            answer[curLevel].top.push(iBird);
         }
      }
      return answer;
   };

   function restart() {
      errorLabel.hide();
      displayHelper.stopShowingResult();
      for (var iBird = 0; iBird < data[level].birds; iBird++) {
         for (var iMark = 0; iMark < data[level].marks; iMark++) {
            answer[level].marks[iBird][iMark] = false;
            marks[iBird][iMark].attr(markParams.unmarkedAttr);
         }
      }
      // loadPhase();
      // initBirds();
   };

   task.unload = function(callback) {
      stopExecution();
      callback();
   };

   var initPaper = function() {
      if (paper) {
         if(shuffleButton) {
            shuffleButton.remove();
         }
         if(restartButton) {
            restartButton.remove();
         }
         if(validateButton) {
            validateButton.remove();
         }
         if(backButton) {
            backButton.remove();
         }
         paper.remove();
      }
      var nbMarks = data[level].marks;
      birdParams.legHeight = 2 * markParams.verticalSpaceFirstAndLast + nbMarks * markParams.height + (nbMarks-1) * markParams.verticalSpace;
      var margin = 10;
      slotAttr.height = birdParams.legHeight + birdParams.birdImage.height + 3 * margin;
      birdParams.legOffsetY = slotAttr.height - birdParams.legHeight - margin;
      birdParams.offsetY = birdParams.legOffsetY - birdParams.birdImage.height - margin;
      topContainerCenterY = maxSlotHeight - slotAttr.height/2;
      bottomContainerCenterY = bottomContainerY + slotAttr.height/2;

      paper = new Raphael("anim", paperWidth, paperHeight);
      initDragAndDrop();
      initButtonsAndLabels();
   };

   var initLetters = function() {
      for (var iBird = 0; iBird < data[level].birds; iBird++) {
         paper.text().attr({
            text: birdLetters.charAt(iBird),
            x: paperWidth / 2 - slotAttr.width * data[level].birds / 2 + iBird * slotAttr.width + slotAttr.width / 2
         }).attr(letterAttr);
      }
   };

   var initDragAndDrop = function() {
      dragAndDrop = new DragAndDropSystem({
         paper: paper,
         canBeTaken: isDragPhase,
         actionIfDropped: function(srcCont, srcPos, dstCont, dstPos, dropType) {
            if (srcCont == dstCont && srcPos == dstPos) {
               return true;
            }
            return !!dstCont && dragAndDrop.getObjects(dstCont)[dstPos] === null;
         },
         actionIfEjected: function(refEl, previousContId, previousPos) {
            return action(previousContId, getRightmostAvailable(previousContId), 'replace');
         }
      });

      var topBackground = paper.rect(-slotAttr.width / 2, -slotAttr.height / 2).attr(slotAttr);
      topContainer = dragAndDrop.addContainer({
         ident: "top",
         cx: paperWidth / 2,
         cy: topContainerCenterY,
         widthPlace: slotAttr.width,
         heightPlace: slotAttr.height,
         nbPlaces: data[level].birds,
         dropMode: "replace",
         dragDisplayMode: "preview",
         direction: "horizontal",
         //align: "left",
         placeBackgroundArray: [topBackground]
      });
      topContainer.timeAnim = containerDefaultAnimTime;
   };

   var getRightmostAvailable = function(container) {
      var slots = dragAndDrop.getObjects(container);
      for (var iSlot = slots.length - 1; iSlot >= 0; iSlot--) {
         if (slots[iSlot] === null) {
            return iSlot;
         }
      }
      return -1;
   };

   var initBirds = function() {
      birds = Beav.Array.make(data[level].birds, null);
      marks = Beav.Array.make(data[level].birds, null);
      var containers = ["top"];
      if (isDragPhase()) {
         containers.push("bottom");
      }
      for (var iContainer in containers) {
         var container = containers[iContainer];
         dragAndDrop.removeAllObjects(container);
         for (var iSlot = 0; iSlot < data[level].birds; iSlot++) {
            var iBird = answer[level][container][iSlot];
            if (iBird === null) {
               continue;
            }
            drawBird(iBird);
            dragAndDrop.insertObject(container, iSlot, {
               ident: iBird,
               elements: birds[iBird]
            });
         }
      }
   };

   var drawBird = function(iBird) {
      birds[iBird] = paper.set();
      marks[iBird] = paper.set();
      var bgRect = paper.rect(-slotAttr.width/2, -slotAttr.height/2, slotAttr.width, slotAttr.height).attr({"fill": "white"}).toBack();
      var birdImage = paper.image(birdParams.birdImage.name, -birdParams.birdImage.width / 2, -slotAttr.height / 2 + birdParams.offsetY, birdParams.birdImage.width, birdParams.birdImage.height);
      var leg = paper.rect(-birdParams.legWidth / 2, -slotAttr.height / 2 + birdParams.legOffsetY, birdParams.legWidth, birdParams.legHeight).attr({"fill":"pink"});
      for (var iMark = 0; iMark < data[level].marks; iMark++) {
         var xPos = -markParams.width / 2 + markParams.offsetX;
         var yPos = -slotAttr.height / 2 + birdParams.legOffsetY + markParams.verticalSpaceFirstAndLast + iMark * (markParams.height + markParams.verticalSpace);
         var mark = paper.rect(xPos, yPos, markParams.width, markParams.height).attr(markParams.rectAttr);
         if (answer[level].marks[iBird][iMark]) {
            mark.attr(markParams.markedAttr);
         } else {
            mark.attr(markParams.unmarkedAttr);
         }
         mark.mousedown(clickMark(iBird, iMark));
         marks[iBird].push(mark);
      }
      birds[iBird].push(bgRect, birdImage, leg, marks[iBird]);
   };

   var clickMark = function(iBird, iMark) {
      var handler = function() {
         displayHelper.stopShowingResult();
         errorLabel.hide();
         if (answer[level].phase !== phases.mark) {
            return;
         }
         answer[level].marks[iBird][iMark] = !(answer[level].marks[iBird][iMark]);
         if (answer[level].marks[iBird][iMark]) {
            this.attr(markParams.markedAttr);
         } else {
            this.attr(markParams.unmarkedAttr);
         }
      };
      return handler;
   };

   var initButtonsAndLabels = function() {
      // LATER: factoriser ce code avec des fonctions dans la lib Button => mybutton.draw(paper, ...)

      shuffleButton = new Button(paper, buttonParams.shuffle.xPos, buttonParams.shuffle.yPos, buttonParams.shuffle.width, buttonParams.shuffle.height, buttonParams.shuffle.text);
      shuffleButton.click(simulateShuffle);

      validateButton = new Button(paper, buttonParams.validate.xPos, buttonParams.validate.yPos, buttonParams.validate.width, buttonParams.validate.height, buttonParams.validate.text);
      validateButton.click(validate);
      validateButton.hide();

      restartButton = new Button(paper, buttonParams.restart.xPos, buttonParams.restart.yPos, buttonParams.restart.width, buttonParams.restart.height, buttonParams.restart.text);
      restartButton.click(restart);
      restartButton.hide();

      backButton = new Button(paper, buttonParams.back.xPos, buttonParams.back.yPos, buttonParams.back.width, buttonParams.back.height, buttonParams.back.text);
      backButton.click(clickBack);
      backButton.hide();

      instructionLabel = paper.text(instructionLabelAttr.xPos, instructionLabelAttr.yPos, instructionLabelAttr.text).attr(instructionLabelAttr);
      instructionLabel.hide();

      errorLabel = paper.text(errorLabelAttr.xPos, errorLabelAttr.yPos, errorLabelAttr.text).attr(errorLabelAttr);
      errorLabel.hide();
};

   var clickBack = function() {
      displayHelper.stopShowingResult();
      answer[level].bottom = Beav.Array.make(data[level].birds, null);
      answer[level].top = Beav.Array.init(data[level].birds, function(index) {
         return index;
      });
      answer[level].phase = phases.mark;
      task.reloadAnswerObject(answer);
   };

   var loadPhase = function() {
      stopDragMode();
      shuffleButton.hide();
      validateButton.hide();
      restartButton.hide();
      backButton.hide();
      instructionLabel.hide();
      errorLabel.hide();

      if (isDragPhase()) {
         validateButton.show();
         backButton.show();
         instructionLabel.show();
         startDragMode();
      } else if (answer[level].phase === phases.mark) {
         restartButton.show();
         shuffleButton.show();
      }
   };

   var startDragMode = function() {
      stopDragMode();
      var bottomBackground = paper.rect(-slotAttr.width / 2, -slotAttr.height / 2).attr(slotAttr);
      bottomContainer = dragAndDrop.addContainer({
         ident: "bottom",
         cx: paperWidth / 2,
         cy: bottomContainerCenterY,
         widthPlace: slotAttr.width,
         heightPlace: slotAttr.height,
         nbPlaces: data[level].birds,
         dropMode: "replace",
         dragDisplayMode: "preview",
         direction: "horizontal",
         //align: "left",
         placeBackgroundArray: [bottomBackground]
      });
      bottomContainer.timeAnim = containerDefaultAnimTime;
   };

   var stopDragMode = function() {
      dragAndDrop.removeAllObjects("bottom");
      dragAndDrop.removeContainer("bottom");
   };

   var isDragPhase = function() {
      return answer[level].phase == phases.drag;
   };

   var simulateShuffle = function() {
      displayHelper.stopShowingResult();
      var iBird;
      // FOR DEBUG: comment out this code
      if (true) {
         for (iBird = 0; iBird < data[level].birds; iBird++) {
            for (var jBird = iBird + 1; jBird < data[level].birds; jBird++) {
               if (Beav.Object.eq(answer[level].marks[iBird], answer[level].marks[jBird])) {
                  errorLabel.show();
                  return;
               }
            }
         }
      }

      answer[level].phase = phases.drag;
      loadPhase();
      simulation = new Simulation();
      var step = new SimulationStep();

      for (iBird = 0; iBird < data[level].birds; iBird++) {
         for (var iMark = 0; iMark < data[level].marks; iMark++) {
            marks[iBird][iMark].hide();
         }
      }

      shuffleButton.hide();
      validateButton.hide();
      topContainer.timeAnim = containerShuffleAnimTime;
      bottomContainer.timeAnim = containerShuffleAnimTime;

      step.addEntry({
         name: "shuffle",
         action: {
            onExec: function() {
               for (var iSlot = 0; iSlot < data[level].birds; iSlot++) {
                  dragAndDrop.handleDrop(topContainer, iSlot, bottomContainer, permutations[level][answer[level].permutationIndex][iSlot], "replace");
               }
            },
            duration: containerShuffleAnimTime,
            useTimeout: true
         }
      });

      step.addEntryAllParents({
         name: "show",
         action: {
            onExec: function(params, duration, callback) {
               for (var iBird = 0; iBird < data[level].birds; iBird++) {
                  for (var iMark = 0; iMark < data[level].marks; iMark++) {
                     marks[iBird][iMark].show();
                  }
               }
               validateButton.show();

               topContainer.timeAnim = containerDefaultAnimTime;
               bottomContainer.timeAnim = containerDefaultAnimTime;
               callback();
            }
         }
      });
      simulation.addStep(step);
      simulation.setAutoPlay(true);
      simulation.play();
   };

   var stopExecution = function() {
      if (simulation) {
         simulation.stop();
      }
   };

   var getResult = function(answer, level) {
      if (answer[level].phase != phases.drag && answer[level].phase != phases.finish) {
         // should never be seen by the user
         return {success: false, message: "You need to first let the bird fly away." };
      }
      var iBird;
      for (iBird = 0; iBird < data[level].birds; iBird++) {
         if (answer[level].top[iBird] === null) {
            return {success: false, message: taskStrings.emptySlot };
         }
      }
      for (iBird = 0; iBird < data[level].birds; iBird++) {
         if (answer[level].top[iBird] !== iBird) {
            return {success: false, message: taskStrings.incorrect };
         } 
      }
      return {success: true, message: taskStrings.success };
   };

   var updateAnswer = function() {
      answer[level].top = dragAndDrop.getObjects("top");
      if (isDragPhase()) {
         answer[level].bottom = dragAndDrop.getObjects("bottom");
      }
   };

   var validate = function() {
      displayHelper.stopShowingResult();
      updateAnswer();
      var result = getResult(answer, level);
      if (result.success) {
         answer[level].phase = phases.finish;
         loadPhase();
         platform.validate("done");
      } else {
         displayHelper.validate("stay");
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

         var result = getResult(answer, curLevel);
         messages[curLevel] = result.message;
         if (result.success) {
            scores[curLevel] = maxScores[curLevel];
         } else {
            scores[curLevel] = taskParams.noScore;
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


