function initTask(subTask) {
   'use strict';
   var state = {};
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

   var noVisual = false;

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
   // var taskSeed;

   subTask.loadLevel = function(curLevel) {
      if(respEnabled){
         displayHelper.responsive = true;
         // displayHelper.hideSolutionButton = true;
         convertDOM();
      }else{
         displayHelper.responsive = false;
      }
      level = curLevel;
      displayHelper.customValidate = checkResult;

      displayHelper.taskH = paperHeight + 30;
      displayHelper.taskW = 770;
      displayHelper.minTaskW = 500;
      displayHelper.maxTaskW = 900;
   };

   subTask.getStateObject = function() {
      return state;
   };

    subTask.getAnswerObject = function() {
      updateAnswer();
      return answer;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   var getResultAndMessage = function() {
      noVisual = true;
      var result = checkResult(true);
      return result
   };

   subTask.getDefaultAnswerObject = function() {
      currentSeedOffsets[level]++;
      var defaultAnswer = {};
      var counter = 0;
      // counter++;
      defaultAnswer = {};
      defaultAnswer.permutationIndex = (1237 * counter + subTask.taskParams.randomSeed + currentSeedOffsets[level]) % permutations[level].length;
      defaultAnswer.phase = phases.mark;
      defaultAnswer.bottom = Beav.Array.make(data[level].birds, null);
      defaultAnswer.marks = [];
      defaultAnswer.top = [];
      for (var iBird = 0; iBird < data[level].birds; iBird++) {
         defaultAnswer.marks.push(Beav.Array.make(data[level].marks, false));
         defaultAnswer.top.push(iBird);
      }
      return defaultAnswer;
   };

   subTask.resetDisplay = function() {
      displayError("");
      initPaper();
      loadPhase();
      initBirds();
   };

   function restart() {
      errorLabel.hide();
      displayHelper.stopShowingResult();
      for (var iBird = 0; iBird < data[level].birds; iBird++) {
         for (var iMark = 0; iMark < data[level].marks; iMark++) {
            answer.marks[iBird][iMark] = false;
            marks[iBird][iMark].attr(markParams.unmarkedAttr);
         }
      }
      // loadPhase();
      // initBirds();
   };

   subTask.unloadLevel = function(callback) {
      // stopExecution();
      callback();
   };

   var initPaper = function() {
      var nbMarks = data[level].marks;
      birdParams.legHeight = 2 * markParams.verticalSpaceFirstAndLast + nbMarks * markParams.height + (nbMarks-1) * markParams.verticalSpace;
      var margin = 10;
      slotAttr.height = birdParams.legHeight + birdParams.birdImage.height + 3 * margin;
      birdParams.legOffsetY = slotAttr.height - birdParams.legHeight - margin;
      birdParams.offsetY = birdParams.legOffsetY - birdParams.birdImage.height - margin;
      topContainerCenterY = maxSlotHeight - slotAttr.height/2;
      bottomContainerCenterY = bottomContainerY + slotAttr.height/2;

      if(paper){
         paper.remove();
         subTask.raphaelFactory.remove("anim");
      }
      paper = subTask.raphaelFactory.create("anim", "anim", paperWidth, paperHeight);
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
            displayError("");
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
            var iBird = answer[container][iSlot];
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
         if (answer.marks[iBird][iMark]) {
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
         displayError("");
         displayHelper.stopShowingResult();
         errorLabel.hide();
         if (answer.phase !== phases.mark) {
            return;
         }
         answer.marks[iBird][iMark] = !(answer.marks[iBird][iMark]);
         if (answer.marks[iBird][iMark]) {
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
      displayError("");
      displayHelper.stopShowingResult();
      answer.bottom = Beav.Array.make(data[level].birds, null);
      answer.top = Beav.Array.init(data[level].birds, function(index) {
         return index;
      });
      answer.phase = phases.mark;
      subTask.resetDisplay();
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
      } else if (answer.phase === phases.mark) {
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
      return answer.phase == phases.drag;
   };

   var simulateShuffle = function() {
      displayHelper.stopShowingResult();
      var iBird;
      // FOR DEBUG: comment out this code
      if (true) {
         for (iBird = 0; iBird < data[level].birds; iBird++) {
            for (var jBird = iBird + 1; jBird < data[level].birds; jBird++) {
               if (Beav.Object.eq(answer.marks[iBird], answer.marks[jBird])) {
                  errorLabel.show();
                  return;
               }
            }
         }
      }

      answer.phase = phases.drag;
      loadPhase();
      simulation = new Simulation();
      var step = new SimulationStep();

      for (iBird = 0; iBird < data[level].birds; iBird++) {
         for (var iMark = 0; iMark < data[level].marks; iMark++) {
            // marks[iBird][iMark].hide();
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
               // console.log("shuffle")
               for (var iSlot = 0; iSlot < data[level].birds; iSlot++) {
                  dragAndDrop.handleDrop(topContainer, iSlot, bottomContainer, permutations[level][answer.permutationIndex][iSlot], "replace");
               }
            },
            duration: containerShuffleAnimTime,
            // useTimeout: true
         }
      });

      step.addEntryAllParents({
         name: "show",
         action: {
            onExec: function(params, duration, callback) {
               console.log("show")
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
         // simulation.destroy();
      }
   };

   var updateAnswer = function() {
      answer.top = dragAndDrop.getObjects("top");
      if (isDragPhase()) {
         answer.bottom = dragAndDrop.getObjects("bottom");
      }
   };

   var validate = function() {
      displayHelper.stopShowingResult();
      updateAnswer();
      var result = getResult(answer, level);
      if (result.success) {
         answer.phase = phases.finish;
         loadPhase();
         platform.validate("done");
      } else {
         // displayHelper.validate("stay");
      }
   };

   function checkResult(final) {
      if (answer.phase != phases.drag && answer.phase != phases.finish) {
         // should never be seen by the user
         displayError("You need to first let the bird fly away.");
         return {success: false, message: "You need to first let the bird fly away." };
      }
      var iBird;
      for (iBird = 0; iBird < data[level].birds; iBird++) {
         if (answer.top[iBird] === null) {
            var error = taskStrings.emptySlot
            displayError(error);
            return {successRate: 0, message: error };
         }
      }
      for (iBird = 0; iBird < data[level].birds; iBird++) {
         if (answer.top[iBird] !== iBird) {
            var error = taskStrings.incorrect
            displayError(error);
            return {successRate: 0, message: error };
         } 
      }
      if(!final){
         platform.validate("done");
      }
      return {successRate: 1, message: taskStrings.success };
   };

   function displayError(msg) {
      if(noVisual){
         return
      }
      if(respEnabled){
         displayHelper.displayError(msg);
      }else{
         $("#error").html(msg);
      }
      // $("#displayHelper_graderMessage").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();



