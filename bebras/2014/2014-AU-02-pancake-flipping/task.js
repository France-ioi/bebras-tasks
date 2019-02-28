function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         startSizeOfPos: [1, 2, 0, 4, 3],
         maxScoreNbSteps: 4,
         firstPancakeY: 80,
         pancakeMinWidth: 180,
         pancakeExtraWidth: 60
      },
      medium: {
         startSizeOfPos: [2, 1, 3, 0, 5, 4],
         maxScoreNbSteps: 5,
         firstPancakeY: 80,
         pancakeMinWidth: 180,
         pancakeExtraWidth: 60
      },
      hard: {
         startSizeOfPos: [2, 5, 10, 1, 7, 9, 0, 6, 11, 3, 8, 4],
         maxScoreNbSteps: 15,
         firstPancakeY: 60,
         pancakeMinWidth: 50,
         pancakeExtraWidth: 55
      }
   };
   var pancakeHeight = 20;
   var pancakeMinWidth;
   var pancakeExtraWidth;
   var margin = 10;
   var firstPancakeY;
   var paperWidth = 750;
   var paperHeight;

   var startSizeOfPos;
   var maxScoreNbSteps;

   var nbPancakes;
   var centerX = paperWidth / 2;
   var paper;

   var curSizeOfPos;     
  
   var rectOfSize = []; 
   var animTime = 700;
   var animating = false;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      startSizeOfPos = JSON.parse(JSON.stringify(data[level].startSizeOfPos));
      maxScoreNbSteps = data[level].maxScoreNbSteps;
      firstPancakeY = data[level].firstPancakeY;
      pancakeMinWidth = data[level].pancakeMinWidth;
      pancakeExtraWidth = data[level].pancakeExtraWidth;
      paperHeight = firstPancakeY + startSizeOfPos.length * pancakeHeight + 30;
      nbPancakes = startSizeOfPos.length;
      curSizeOfPos = startSizeOfPos.slice(0);
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
         curSizeOfPos = playFromStart(answer);
      }
   };

   subTask.resetDisplay = function() {
      initPaper();
      placePancakes();
      updateStatus();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [];
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      stopAnimation();
      callback();
   };

   function getResultAndMessage() {
      var result;
      var sizeOfPos = playFromStart(answer);
      var nbSteps = answer.length;
      if (isSolved(sizeOfPos)) {
         if (nbSteps <= maxScoreNbSteps) {
            result = { successRate: 1, message: taskStrings.success };
            // avec le nombre minimum de retournements
         } else {
            var message = taskStrings.almost(nbSteps);
            if (nbSteps <= 2*maxScoreNbSteps){
               message += taskStrings.almost_2;
            }
            result = { successRate: 0.5, message: message };
         }
      } else {
         result = { successRate: 0, message: taskStrings.failure };
      }
      return result;
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("anim","anim",paperWidth, paperHeight);
      createPancakes(); 
   };

   var stopAnimation = function() {
      // for (var pos = 0; pos < nbPancakes; pos++) {
      //    var rect = rectOfPos(pos);
      //    rect.stop();
      // }
      subTask.raphaelFactory.stopAnimate("flipAnim");
      animating = false;
   }

   var curPosOfSize = function(sizePancake) {
      for (var pos = 0; pos < nbPancakes; pos++) {
         if (curSizeOfPos[pos] == sizePancake) {
            return pos;
         }
      }
      alert("Erreur");
   };

   var rectOfPos = function(pos) {
      return rectOfSize[curSizeOfPos[pos]];
   };

   function flip(sizePancake) {
      return function() {
         if (animating) {
            return;
         }
         placePancakes();
         var posFlipped = curPosOfSize(sizePancake);
         answer.push(posFlipped);
         flipPancake(curSizeOfPos, posFlipped);
         displayFlipPancake(posFlipped);
         updateStatus();
         if (isSolved(curSizeOfPos)) {
            platform.validate("done");
         }
      };
   };

   var rotateRect = function(rect, centerY, callback) {
      rect.toFront();
      var flipAnim = new Raphael.animation({"transform": "r180," + centerX + "," + centerY },animTime,callback);
      subTask.raphaelFactory.animate("flipAnim",rect,flipAnim);
   };

   var isSolved = function(sizeOfPos) {
      for (var pos = 0; pos < nbPancakes; pos++) {
         if (sizeOfPos[pos] != pos) {
            return false;
         }
      }
      return true;
   };

   var flipPancake = function(sizeOfPos, posFlipped) {
    for (var pos = 0; pos < posFlipped / 2; pos++) {
         var posOther = posFlipped - pos;
         sizePancake = sizeOfPos[pos];
         sizeOfPos[pos] = sizeOfPos[posOther];
         sizeOfPos[posOther] = sizePancake;
      }
   };

   var displayFlipPancake = function(posFlipped) {
      animating = true;
      var centerY = (heightOfPos(0) + heightOfPos(posFlipped) + pancakeHeight) / 2;
      for (var pos = 0; pos <= posFlipped; pos++) {
         var callback = undefined;
         if (pos == posFlipped)
            callback = function() { stopAnimation(); };
         rotateRect(rectOfPos(pos), centerY, callback);
      }
   };

   var updateStatus = function() {
      if (answer.length == 0) {
         $("#cancelLast").attr('disabled', 'disabled');
         $("#status").html(taskStrings.click);
      } else {
         $("#cancelLast").removeAttr('disabled');
         $("#status").html(taskStrings.status(answer.length));
      }
   };

   var heightOfPos = function(pos) {
      return firstPancakeY + pancakeHeight * pos;
   };

   var createPancakes = function() {
      for (var pos = 0; pos < nbPancakes; pos++) {
         var size = curSizeOfPos[pos];
         var width = size * pancakeExtraWidth + pancakeMinWidth;
         var rect = paper.rect(centerX - width / 2, heightOfPos(pos), width, pancakeHeight, 5);
         rect.attr({'fill': '#D09657'});
         rectOfSize[size] = rect;
         rect.click(flip(size));
      }
   };

   var placePancakes = function() { 
      stopAnimation();
      for (var pos = 0; pos < nbPancakes; pos++) {
         var rect = rectOfPos(pos);
         rect.stop();
         rect.transform("");
         rect.attr({y: firstPancakeY + pancakeHeight * pos});
      }
   };

   var playFromStart = function(answers) {
      var sizeOfPos = startSizeOfPos.slice(0);
      for (var iFlip = 0; iFlip < answers.length; iFlip++) {
         flipPancake(sizeOfPos, answers[iFlip]);
      }
      return sizeOfPos;
   };

   task.cancelLastStep = function() {
      stopAnimation();
      if (answer.length > 0) {
         answer.pop();
      }
      curSizeOfPos = playFromStart(answer);
      placePancakes();
      updateStatus();
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
