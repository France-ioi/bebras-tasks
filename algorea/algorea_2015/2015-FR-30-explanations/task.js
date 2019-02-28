function initTask() {
   var answer = null;
   var state = null;

   task.load = function(views, callback) {
      displayHelper.setupLevels();
      callback();
   };

   task.getDefaultStateObject = function() {
      var state = { level: "easy" };
      return state;
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      for (var numQ = 0; numQ < 5; numQ++) {
         $("#ans_" + numQ + "_0").parent().css("background-color", "white");
         $("#ans_" + numQ + "_1").parent().css("background-color", "white");
         if (answer[level][numQ] != undefined) {
            $("#ans_" + numQ + "_" + answer[level][numQ]).parent().css("background-color", "blue");
         }
      }
   };

   task.getAnswerObject = function() {
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      var answer = {easy: {}, medium: {}, hard: {}};
      return answer;
   };

   task.unload = function(callback) {
      callback();
   };

   task.selectAnswer = function(numQuestion, numAnswer) {
      $("#ans_" + numQuestion + "_" + numAnswer).parent().css("background-color", "blue");
      $("#ans_" + numQuestion + "_" + (1 - numAnswer)).parent().css("background-color", "white");
      answer[level][numQuestion] = numAnswer;
      try {
         checkAnswer(answer, level);
         //platform.validate("done");
      } catch (exception) {
         //displayHelper.validate("stay");
      }
   };

   var checkAnswer = function(curAnswer, curLevel) {
      var expectedAnswers = {
         easy: {0: 1, 4: 1},
         medium: {1: 1},
         hard: {2: 0, 3: 1}
      }
      for (var numQ in expectedAnswers[curLevel]) {
         if (curAnswer[curLevel][numQ] == undefined) {
            if (curLevel != "medium") {
               throw "Répondez aux deux questions ci-dessus.";
            } else {
               throw "Cliquez sur le bouton de la réponse.";
            }
         }
      }
      for (var numQ in expectedAnswers[curLevel]) {
         if (curAnswer[curLevel][numQ] != expectedAnswers[curLevel][numQ]) {
            throw "Votre réponse est incorrecte ; relisez bien.";
         }
      }
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      var answer = $.parseJSON(strAnswer);
      var taskParams = displayHelper.taskParams;
      var scores = {};
      var messages = {};
      var versions = {easy: true, medium: true, hard: true};
      var maxScores = displayHelper.getLevelsMaxScores();
      for (var curLevel in versions) {
         try {
            checkAnswer(answer, curLevel);
            messages[curLevel] = "Bravo, vous avez réussi !";
            if (curLevel == "hard") {
               messages[curLevel] += " Passez à la question suivante.";
            } else {
               messages[curLevel] += " Passez à une version plus difficile.";
            }
            scores[curLevel] = maxScores[curLevel];
         } catch (exception) {
            messages[curLevel] = exception;
            scores[curLevel] = 0;
         }
      };
      if (gradedLevel == null) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}

initTask();
