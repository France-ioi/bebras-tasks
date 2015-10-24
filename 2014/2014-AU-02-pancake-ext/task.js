function initTask() {
   var difficulty;
   var pancakeHeight = 20;
   var pancakeMinWidth = 180;
   var pancakeExtraWidth = 60;
   var margin = 10;
   var firstPancakeY = 80;
   var paperWidth = 750;
   var paperHeight = 250;

   var startSizeOfPos = [2, 1, 3, 0, 5, 4];
   var maxScoreNbSteps = 5;
   var makeInstanceEasy = function() {
      startSizeOfPos = [1, 2, 0, 4, 3];
      maxScoreNbSteps = 4;
   };
   var makeInstanceMany = function() {
      startSizeOfPos = [2, 5, 10, 1, 7, 9, 0, 6, 11, 3, 8, 4];
      maxScoreNbSteps = 15;
      firstPancakeY = 60;
      paperHeight = firstPancakeY + startSizeOfPos.length * pancakeHeight + 30;
      pancakeMinWidth = 50;
      pancakeExtraWidth = 55;
   };

   var nbPancakes;
   var centerX;
   var paper;

   var curAnswers = [];
   var curSizeOfPos;     
  
   var rectOfSize = []; 
   var animTime = 700;
   var animating = false;

   var stopAnimation = function() {
      for (var pos = 0; pos < nbPancakes; pos++) {
         var rect = rectOfPos(pos);
         rect.stop();
      }
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

   var setClick = function(rect, sizePancake) {
      rect.node.onclick = function(event) {
         if (animating) {
            return;
         }
         placePancakes();
         var posFlipped = curPosOfSize(sizePancake);
         curAnswers.push(posFlipped);
         flipPancake(curSizeOfPos, posFlipped);
         displayFlipPancake(posFlipped);
         updateStatus();
         if (isSolved(curSizeOfPos)) {
            platform.validate("done");
         }
      }
   };

   var rotateRect = function(rect, centerY, callback) {
      rect.toFront();
      rect.animate({"transform": "r180," + centerX + "," + centerY }, animTime, callback);
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
      if (curAnswers.length == 0) {
         $("#cancelLast").attr('disabled', 'disabled');
         $("#status").html("Cliquez sur une crêpe pour retourner la pile au dessus.");
      } else {
         $("#cancelLast").removeAttr('disabled');
         var plural = "";
         if (curAnswers.length > 1) {
            plural = "s";
         }
         $("#status").html("Vous avez effectué " + curAnswers.length + " retournement" + plural + ".");
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
         setClick(rect, size);
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

   task.load = function(views, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         difficulty = taskParams.options.difficulty ? taskParams.options.difficulty : "hard";
         // LATER: check difficulty is easy or hard

         if (difficulty == "easy" || difficulty == "hard") {
            $(".easy_hard").show();
            if (difficulty == "easy") {
               $(".easy").show();
               makeInstanceEasy();
            } else {
               $(".hard").show();
            }
         } else {
            makeInstanceMany();
            $(".many").show();
            $("#task_title").html("Davantage de crêpes");
         }

         nbPancakes = startSizeOfPos.length;
         if (paperWidth < margin * 2 + pancakeMinWidth + pancakeExtraWidth * nbPancakes) {
            // console.log("Error: paperWidth is too small.");
         }
         centerX = paperWidth / 2;
         paper = Raphael('anim', paperWidth, paperHeight); // pancakeHeight * nbPancakes
         curSizeOfPos = startSizeOfPos.slice(0);
         createPancakes(); 
         task.reloadAnswer("", callback);
      });
   };

   task.unload = function(callback) {
      stopAnimation();
      callback();
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify(curAnswers));
   };

   var answersFromStrAnswer = function(strAnswer) {
      var answers = [];
      if (strAnswer != "") {
         answers = $.parseJSON(strAnswer);
      }
      return answers;
   };

   task.reloadAnswer = function(strAnswer, callback) {
      curAnswers = answersFromStrAnswer(strAnswer);
      curSizeOfPos = playFromStart(curAnswers);
      placePancakes();
      updateStatus();
      callback();
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
      if (curAnswers.length >= 0) {
         curAnswers.pop();
      }
      curSizeOfPos = playFromStart(curAnswers);
      placePancakes();
      updateStatus();
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         var answers = answersFromStrAnswer(strAnswer);
         var sizeOfPos = playFromStart(answers);
         var nbSteps = answers.length;
         if (isSolved(sizeOfPos)) {
            if (nbSteps <= maxScoreNbSteps) {
               callback(taskParams.maxScore, "Bravo, vous avez réussi&nbsp;!");
               // avec le nombre minimum de retournements
            } else {
               var score = Math.max(Math.floor(taskParams.maxScore / 2), taskParams.maxScore - (nbSteps - maxScoreNbSteps));
               var extraMsg = "";
               if (nbSteps <= 2*maxScoreNbSteps)
                  extraMsg = " (mais ce n'est pas facile)";
               callback(score, "Vous avez réussi en " + nbSteps + " retournements. Il est possible de faire mieux" + extraMsg + ".");
            }
         } else {
            callback(taskParams.noScore, "Les crêpes ne sont pas dans le bon ordre.");
         }
      });
   };
}

initTask();