function initTask(subTask) {
   'use strict';
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         sequence: "BBRB",
         options: ["B", "BB", "R"],
         target: 1 // note that 2 are possible
      },
      medium: {
         sequence: "RRBR",
         options: ["R", "RR", "B", "RBR"],
         target: 3
      },
      hard: {
         sequence: "BRRBBRRRBB",
         options: ["RB", "RRR", "BRR", "RBB", "BR", "BB"], // BBR can also be given
         target: 3
      }

   };
   var words = taskStrings.words;

   var paper;
   var paperWidth = 770;
   var paperHeight = {
      easy: 230,
      medium: 330,
      hard: 545
      /*
      hard_bof: 580
      old_easy: 330,
      old_medium: 580,
      old_hard: 530 */
   };
   var textParams = {
      bankTitleAttr: {
         text: taskStrings.availableWords,
         x: 70,
         y: 20,
         "font-size": 16,
         "font-weight": 600
      },
      bankTextAttr: {
         text: taskStrings.clickToAdd,
         x: 70,
         y: 60,
         "font-size": 16,
         "fill": "#CC2222" // "#337777"
      },
      targetTitleAttr: {
         text: taskStrings.message,
         x: 210,
         y: 20,
         "font-size": 16,
         "font-weight": 600
      },
      userSentenceTitle: {
         text: taskStrings.yourSequence,
         x: 340,
         y: 20,
         "font-size": 16,
         "font-weight": 600
      },
      userSentenceText: {
         text: taskStrings.clickToRemove,
         x: 340,
         y: 60,
         "font-size": 16,
         "fill": "#CC2222"
      },
      otherSequence1: {
         text: taskStrings.otherSequence,
         x: 520,
         y: 20,
         "font-size": 16,
         "font-weight": 600
      },
      otherSequence2: {
         text: taskStrings.otherSequence,
         x: 680,
         y: 20,
         "font-size": 16,
         "font-weight": 600
      },
      equalSign: {
         text: "=",
         x: 252,
         y: 115,
         "font-size": 26,
         "fill": "black"
      }
   };
   var marginCompleted = 20;
   var labelBank;
   var raphaelLabelBank;
   var bankParams = {
      xPos: 10,
      yPos: 100,
      verticalSpace: 10
   };
   var currentSentenceParams = {
      xPos: 280,
      yPos: 100,
      verticalSpace: 0
   };
   var marginBorder = 2;
   var otherSentenceParams = {
      xPosById: [460, 620],
      yPos: 100,
      verticalSpace: 0,
      otherBorderAttr: {
         x: -marginBorder,
         y: 100 - marginBorder,
         width: 120 + 2*marginBorder,
         stroke: "black",
         "stroke-width": 3
      }
   };
   var targetParams = {
      xPos: 200,
      yPos: 103,
      borderAttr: {
         x: 194 - marginBorder,
         y: 100 - marginBorder,
         width: 32 + 2*marginBorder,
         stroke: "black",
         "stroke-width": 3
      },
      userBorderAttr: {
         x: 280 - marginBorder,
         y: 100 - marginBorder,
         width: 120 + 2*marginBorder,
         stroke: "black",
         "stroke-width": 3
      }
   };
   var labelParams = {
      width: 120,
      verticalPadding: 3,
      star: {
         leftPadding: 5,
         diameter: 20,
         verticalSpace: 6,
         colors: {
            "R": "orange",
            "B": "blue"
         }
      },
      xText: 40,
      textAttr: {
         "font-size": 16,
         "text-anchor": "start"
      },
      backAttr: {
         "fill": "#ececec"
      }
   };

   var visualSentence;
   var visualCompleted;

   var numSeeds = 50;
   var taskSeed;
   var currentSeedOffsets = {
      easy: 0,
      medium: 0,
      hard: 0
   };
   if (typeof(enableRtl) != "undefined") {
      var screenWidth = 740;
      textParams.bankTitleAttr.x = screenWidth - textParams.bankTitleAttr.x;
      textParams.bankTextAttr.x = screenWidth - textParams.bankTextAttr.x;
      textParams.targetTitleAttr.x = 535;//screenWidth - textParams.targetTitleAttr.x;
      textParams.userSentenceTitle.x = screenWidth - textParams.userSentenceTitle.x;
      textParams.userSentenceText.x = screenWidth - textParams.userSentenceText.x;
      textParams.otherSequence1.x = 110; //screenWidth - textParams.otherSequence1.x;
      textParams.otherSequence2.x = 260; //screenWidth - textParams.otherSequence2.x;
      textParams.equalSign.x = 495; //screenWidth - textParams.equalSign.x;
      textParams.equalSign.y = 150;
      bankParams.xPos = 610;
      currentSentenceParams.xPos = 345;
      otherSentenceParams.xPosById = [200, 55];
      targetParams.xPos = 526;
      targetParams.borderAttr.x = 520 - marginBorder;
      targetParams.userBorderAttr.x = 345 - marginBorder;
      labelParams.star.leftPadding = 90;
      labelParams.xText = 50;
   }

   subTask.loadLevel = function(curLevel) {
      if(respEnabled){
          displayHelper.responsive = true;
          convertDOM();
       }else{
          displayHelper.responsive = false;
       }
      level = curLevel;
      displayHelper.customValidate = checkResult;

      displayHelper.taskH = paperHeight[level] + 70;
      displayHelper.taskW = paperWidth;
      displayHelper.minTaskW = 500;
      displayHelper.maxTaskW = 900;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer)
         return
      labelBank = generateBank(level, answer.seed);
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
       // TODO: why are the answers array of strings and not just arrays of ints?
      // currentSeedOffsets[level]++;

      var defaultAnswer = {
         seed: 1000 + (subTask.taskParams.randomSeed + currentSeedOffsets[level]) % numSeeds,
         completed: [],
         current: []
      };
      return defaultAnswer
   };

   var getResultAndMessage = function() {
      var result = checkResult(true);
      return result
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   subTask.resetDisplay = function() {
      displayError("");
      initPaper();
      initHandlers();
   };

   var initHandlers = function() {
      $("#clear_current").click(clearCurrentMessage);
   };

   var generateBank = function(level, seed) {
      var randomGenerator = new RandomGenerator(seed);
      var randomWords = $.extend([], words);
      randomGenerator.shuffle(randomWords);
      var labelBank = [];
      for (var iOption in data[level].options) {
         labelBank.push({
            index: iOption,
            word: randomWords[iOption],
            stars: data[level].options[iOption]
         });
      }
      return labelBank;
   };

   var initPaper = function() {
      paper = subTask.raphaelFactory.create("anim", "anim", paperWidth, paperHeight[level]);
      drawBank();
      drawTarget();
      drawCurrentSentence();
      drawCompletedSentences();
      drawTexts();
   };

   var drawTexts = function() {
      paper.text().attr(textParams.bankTitleAttr);
      paper.text().attr(textParams.bankTextAttr);
      paper.text().attr(textParams.targetTitleAttr);
      paper.text().attr(textParams.userSentenceTitle);
      paper.text().attr(textParams.userSentenceText);
      paper.text().attr(textParams.equalSign);
      if (level != "easy") {
         paper.text().attr(textParams.otherSequence1);
         paper.text().attr(textParams.otherSequence2);
      }
   };

   var drawBank = function() {
      raphaelLabelBank = drawLabelList(labelBank, bankParams);
      for (var iLabel in raphaelLabelBank) {
         labelApplyRaphael(raphaelLabelBank[iLabel], "click", [clickBankLabel(iLabel)]);
      }
   };

   var drawTarget = function() {
      var targetHeight = targetParams.yPos + (labelParams.star.diameter + labelParams.star.verticalSpace) * data[level].sequence.length;
      var height = targetHeight - targetParams.yPos + 2*marginBorder;
      paper.rect().attr({height: height}).attr(targetParams.borderAttr);
      paper.rect().attr({height: height}).attr(targetParams.userBorderAttr);

      if (level != "easy") {
         var paramsOther1 = $.extend({}, otherSentenceParams.otherBorderAttr);
         paramsOther1.x += otherSentenceParams.xPosById[0];
         paper.rect().attr({height: height}).attr(paramsOther1);
         var paramsOther2 = $.extend({}, otherSentenceParams.otherBorderAttr);
         paramsOther2.x += otherSentenceParams.xPosById[1];
         paper.rect().attr({height: height}).attr(paramsOther2);
      }
      for (var iStar = 0; iStar < data[level].sequence.length; iStar++) {
         drawStar(data[level].sequence.charAt(iStar), targetParams.xPos, targetParams.yPos + (labelParams.star.diameter + labelParams.star.verticalSpace) * iStar);
      }
   };

   var drawCurrentSentence = function() {
      var iWord;
      if (visualSentence) {
         for (iWord in visualSentence) {
            removeLabel(visualSentence[iWord]);
         }
      }
      var sentence = answer.current;
      if (answer.completed.length == data[level].target) {
         sentence = answer.completed[answer.completed.length - 1];
      }
      visualSentence = [];
      for (iWord in sentence) {
         addToSentence(sentence[iWord]);
      }
   };

   var drawCompletedSentences = function() {
      var iSentence;
      if (visualCompleted) {
         for (iSentence in visualCompleted) {
            for (var iWord in visualCompleted[iSentence]) {
               removeLabel(visualCompleted[iSentence][iWord]);
            }
         }
      }
      visualCompleted = [];
      for (iSentence in answer.completed) {
         visualCompleted.push(drawCompletedSentence(iSentence));
      }
   };

   var drawCompletedSentence = function(iSentence) {
      if (iSentence == data[level].target - 1) {
         return;
      }
      var params = $.extend({}, otherSentenceParams);
      params.xPos = otherSentenceParams.xPosById[iSentence];
        // += iSentence * (labelParams.width + marginCompleted);
      var sentence = answer.completed[iSentence];
      var labelList = [];
      for (var iWord in sentence) {
         var iLabel = sentence[iWord];
         labelList.push(labelBank[iLabel]);
      }
      return drawLabelList(labelList, params);
   };

   var drawLabelList = function(list, listParams) {
      var result = [];
      var xPos = listParams.xPos;
      var yPos = listParams.yPos;
      for (var iLabel in list) {
         var element = drawLabel(list[iLabel], xPos, yPos);
         result.push(element);
         yPos += element.height + listParams.verticalSpace;
      }
      return result;
   };

   var drawLabel = function(label, xPos, yPos) {
      var visualLabel = {};
      visualLabel.xPos = xPos;
      visualLabel.yPos = yPos;
      visualLabel.index = label.index;
      visualLabel.height = labelParams.verticalPadding * 2 + labelParams.star.diameter * label.stars.length + labelParams.star.verticalSpace * (label.stars.length - 1);
      visualLabel.background = paper.rect(xPos, yPos, labelParams.width, visualLabel.height).attr(labelParams.backAttr);
      visualLabel.text = paper.text(xPos + labelParams.xText, yPos + visualLabel.height / 2, label.word).attr(labelParams.textAttr);
      visualLabel.text[0].style.cursor = "default";
      visualLabel.stars = [];

      for (var iStar = 0; iStar < label.stars.length; iStar++) {
         var star = drawStar(label.stars.charAt(iStar), xPos + labelParams.star.leftPadding, yPos + labelParams.verticalPadding + (labelParams.star.diameter + labelParams.star.verticalSpace) * iStar);
         visualLabel.stars.push(star);
      }

      return visualLabel;
   };

   var drawStar = function(type, xPos, yPos) {
      var size = labelParams.star.diameter;
      if (type == "R") {
         xPos += size / 2;
         yPos += size / 2;
         return paper.circle(xPos, yPos, size / 2).attr({fill: labelParams.star.colors[type]});
      } else if (type == "B") {
         var m = 2;
         return paper.rect(xPos+m, yPos+m, size-2*m, size-2*m).attr({fill: labelParams.star.colors[type]});
      } // else unsupported
   };

   var labelApplyRaphael = function(label, funcName, argList) {
      if (!argList) {
         argList = [];
      }
      label.background[funcName].apply(label.background, argList);
      label.text[funcName].apply(label.text, argList);
      for (var iStar in label.stars) {
         var star = label.stars[iStar];
         star[funcName].apply(star, argList);
      }
   };

   var removeLabel = function(label) {
      labelApplyRaphael(label, "remove");
   };

   var clickBankLabel = function(iLabel) {
      var handler = function() {
         displayError("");
         displayHelper.stopShowingResult();
         if (answer.completed.length === data[level].target ||
               isTooLong(answer.current, level)) {
            return;
         }
         answer.current.push(iLabel);
         addToSentence(iLabel);
      };
      return handler;
   };

   var addToSentence = function(iLabel) {
      var xPos = currentSentenceParams.xPos;
      var yPos = currentSentenceParams.yPos;
      if (visualSentence.length > 0) {
         var previousVisualLabel = visualSentence[visualSentence.length - 1];
         yPos = previousVisualLabel.yPos + previousVisualLabel.height + currentSentenceParams.verticalSpace;
      }
      var visualLabel = drawLabel(labelBank[iLabel], xPos, yPos);
      labelApplyRaphael(visualLabel, "click", [removeFromSentence(visualSentence.length)]);
      visualSentence.push(visualLabel);
      onSentenceChange();
   };

   var removeFromSentence = function(iWord) {
      var handler = function() {
         answer.current.splice(iWord, 1);
         drawCurrentSentence();
         onSentenceChange();
      };
      return handler;
   };

   var clearCurrentMessage = function() {
      displayError("");
      answer.current = [];
      drawCurrentSentence();
   };

   var onSentenceChange = function() {
      if (isTooLong(answer.current, level)) {
         // displayHelper.validate("stay", function() {});
         return;
      }
      if (!checkSentenceMatch(answer.current, level)) {
         return;
      }
      if (isCurrentDuplicate(answer)) {
         checkResult();
         // displayHelper.validate("stay", function() {});
         return;
      }
      if (answer.completed === data[level].target) {
         return;
      }
      answer.completed.push(answer.current);
      answer.current = [];
      drawCurrentSentence();
      drawCompletedSentence(answer.completed.length - 1);
      // platform.validate("done", function() {});
      checkResult();
   };

   var getSequenceLength = function(sentence, level) {
      var count = 0;
      for (var iWord in sentence) {
         count += data[level].options[sentence[iWord]].length;
      }
      return count;
   };

   var isTooShort = function(sentence, level) {
      return getSequenceLength(sentence, level) < data[level].sequence.length;
   };

   var isTooLong = function(sentence, level) {
      return getSequenceLength(sentence, level) > data[level].sequence.length;
   };

   var checkSentenceMatch = function(sentence, level) {
      var sequence = "";
      for (var iWord in sentence) {
         sequence += labelBank[sentence[iWord]].stars;
      }
      return sequence == data[level].sequence;
   };

   var equalSentences = function(sentence1, sentence2) {
      return Beav.Object.eq(sentence1, sentence2);
   };

   var verifyCompletedSentences = function(input, level) {
      for (var iSentence = 0; iSentence < input.completed.length; iSentence++) {
         if (!checkSentenceMatch(input.completed[iSentence], level)) {
            return false;
         }
         for (var jSentence = iSentence + 1; jSentence < input.completed.length; jSentence++) {
            if (equalSentences(input.completed[iSentence], input.completed[jSentence])) {
               return false;
            }
         }
      }
      return true;
   };

   var isCurrentDuplicate = function(input) {
      for (var iSentence = 0; iSentence < input.completed.length; iSentence++) {
         if (equalSentences(input.completed[iSentence], input.current)) {
            return true;
         }
      }
      return false;
   };


   function checkResult(noVisual) {
      if (!verifyCompletedSentences(answer, level)) {
         return {
            score: 0,
            result: "error",
            message: "ERREUR. Les séquences complétées sont invalides."};
      }

      var nbCompleted = answer.completed.length;
      var nbToComplete = data[level].target;
      var score = 0;
      var maxScore = 1;
      if (level == "easy") {
         if (nbCompleted >= 1) {
            score = maxScore;
         }
      } else {
         if (nbCompleted == nbToComplete) {
            score = maxScore;
         } else if (nbCompleted == nbToComplete-1) {
            score = maxScore * 6/10;
         } else if (nbCompleted == nbToComplete-2) {
            score = maxScore * 3/10;
         }
      }
      var message = "";
      if (answer.completed.length === nbToComplete) {
         message = taskStrings.success;
      } else if (isCurrentDuplicate(answer)) {
         /*if (level == "easy") {
            message = "Cette séquence apparaît déjà à droite. Cherchez-en une autre.";
         } */
         message = taskStrings.already;
         if (level == "medium" || level == "hard") {
            message += taskStrings.hint;
         }
      } else if (isTooLong(answer.current, level)) {
         message = taskStrings.tooLong;
      } else if (answer.current.length > 0 && isTooShort(answer.current, level)) {
         message = taskStrings.tooShort;
      } else if (answer.current.length > 0 && !checkSentenceMatch(answer.current, level)) {
         message = taskStrings.notMatch;
      } else if (answer.completed.length === 0) {
         message = taskStrings.clickLeft;
      } else {
         message = taskStrings.foundSoFar(nbCompleted);
         if (level == "medium" || level == "hard") {
            message += taskStrings.hint;
         }
      }
      if(!noVisual && score < maxScore){
         displayError(message);
      }else 
      if(!noVisual && score == maxScore){
         platform.validate("done");
      }
      return { successRate: score, message: message }

   };

   function displayError(msg) {
      if(respEnabled){
         displayHelper.displayError(msg);
      }else{
         $("#displayHelper_graderMessage").html(msg).css({color:"red","font-weight":"bold"});
      }
   };

}
initWrapper(initTask, ["easy", "medium", "hard"],"easy");
displayHelper.useFullWidth();

