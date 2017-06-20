function initTask() {
   var data = {
      "easy": {
         samples: [
            { before: {a:0}, instructions: ["a = 4"], after: {a:4}},
            { before: {a:2}, instructions: ["a = a + 1"], after: {a:3}},
            { before: {a:1}, instructions: ["a = a + 1", "a = a + 3"], after: {a:5}},
            { before: {a:4}, instructions: ["a = 1", "a = a + 2"], after: {a:3}}
         ],
         questions: [
            { before: {a:2}, instructions: ["a = 3"], after: {a:3}},
            { before: {a:1}, instructions: ["a = a + 1"], after: {a:2}},
            { before: {a:6}, instructions: ["a = 4", "a = a + 3"], after: {a:7}}
         ]
      },
      "medium": {
         samples: [
            { before: {a:0, b:0}, instructions: ["a = 4", "b = 2"], after: {a:4, b:2}},
            { before: {a:2, b:6}, instructions: ["a = a + 1", "b = a", "a = a + 1"], after: {a:4, b:3}},
            { before: {a:4, b:2}, instructions: ["a = 1", "a = a + b", "b = a"], after: {a:3, b:3}}
         ],
         questions: [
            { before: {a:2, b:1}, instructions: ["a = 3", "b = 5"], after: {a:3, b:5}},
            { before: {a:1, b:4}, instructions: ["a = a + b", "b = a"], after: {a:5, b:5}},
            { before: {a:6, b:2}, instructions: ["a = b", "b = a", "a = a + b"], after: {a:4, b:2}}
         ]
      },
      "hard": {
         samples: [
            { before: {a:0, b:0, c:0}, instructions: ["a = 4", "c = a + b", "b = 2"], after: {a:4, b:2, c:4}},
            { before: {a:2, b:6, c:3}, instructions: ["a = a + c", "b = a", "a = a + 2"], after: {a:7, b:5, c:3}},
            { before: {a:4, b:2, c:0}, instructions: ["a = a + b", "c = b + 2", "b = 1"], after: {a:6, b:1, c:4}}
         ],
         questions: [
            { before: {a:2, b:1, c:3}, instructions: ["a = b + c", "c = a", "a = 3"], after: {a:3, b:1, c:4}},
            { before: {a:1, b:1, c:1}, instructions: ["b = c + a", "c = b + a", "a = b + c"], after: {a:5, b:2, c:3}},
            { before: {a:6, b:2, c:1}, instructions: ["a = c", "b = a", "a = a + b"], after: {a:2, b:1, c:1}}
         ]
      }
   };
   var answer = null;
   var state = null;
   var level = "easy";

   var getHtmlQuestionValues = function(sampleValues, isSample, iQuestion) {
      var row1 = "";
      var html = "<table class='result'>";
      for (var variable in sampleValues) {
         var value = sampleValues[variable];
         html += "<tr><td>"  + variable + " " + taskStrings.equals + " ";
         if (isSample) {
            html += value;
         } else {
            html += "<input type='text' style='width:40px' id='var_" + iQuestion + "_" + variable + "'>";
         }
      }
      return html + "</tr></table>";
   }

   var getQuestions = function(questions, isSample) {
      var htmlQuestions = "<tr><td></td><td><b>" + taskStrings.before + "</b></td><td><b>" + taskStrings.program + "</b></td><td><b>" + taskStrings.after + "</b></td></tr>";
      for (var iQuestion = 0; iQuestion < questions.length; iQuestion++) {
         var question = questions[iQuestion];
         htmlQuestions += "<tr><td><b>";
         if (isSample) {
            htmlQuestions += "Exemple " + (iQuestion + 1);
         } else {
            htmlQuestions += "Question " + (iQuestion + 1);
         }
         htmlQuestions += "</b></td><td>" + getHtmlQuestionValues(question.before, true, iQuestion) + "</td><td><div style='display:inline-block;text-align:left;width:80px;'>";
         for (var iInstr = 0; iInstr < question.instructions.length; iInstr++) {
            htmlQuestions += question.instructions[iInstr] + "<br/>";
         }
         htmlQuestions += "</div></td><td>" + getHtmlQuestionValues(question.after, isSample, iQuestion) + "</td></tr>";
      }
      return htmlQuestions;
   };

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

      if (display) {
         $("#samples").html(getQuestions(data[level].samples, true));
         $("#questions").html(getQuestions(data[level].questions, false));
      }
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      for (var iQuestion = 0; iQuestion < data[level].questions.length; iQuestion++) {
         var question = data[level].questions[iQuestion];
         for (var variable in question.before) {
            $("#var_" + iQuestion + "_" + variable).val(answer[level][iQuestion][variable]);
         }
      }
   };

   task.getAnswerObject = function() {
      answer[level] = [];
      for (var iQuestion = 0; iQuestion < data[level].questions.length; iQuestion++) {
         var question = data[level].questions[iQuestion];
         var questionAnswers = {};
         for (var variable in question.before) {
            questionAnswers[variable] = $.trim($("#var_" + iQuestion + "_" + variable).val());
         }
         answer[level].push(questionAnswers);
      }
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      var answer = {}
      for (var curLevel in data) {
         answer[curLevel] = [];
         for (var iQuestion = 0; iQuestion < data[curLevel].questions.length; iQuestion++) {
            var questionAnswers = {};
            var question = data[curLevel].questions[iQuestion];
            for (var variable in question.before) {
               questionAnswers[variable] = "";
            }
            answer[curLevel].push(questionAnswers);
         }      
      }
      return answer;
   };

   task.unload = function(callback) {
      callback();
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      var answer = $.parseJSON(strAnswer);
      var taskParams = displayHelper.taskParams;
      var scores = {};
      var messages = {};
      var maxScores = displayHelper.getLevelsMaxScores();
      for (var curLevel in data) {
         var nbSolved = 0;
         var nbQuestions = data[curLevel].questions.length;
         for (var iQuestion = 0; iQuestion < nbQuestions; iQuestion++) {
            var questionAnswers = {};
            var question = data[curLevel].questions[iQuestion];
            var questionSolved = true;
            for (var variable in question.after) {
               if (parseInt(answer[curLevel][iQuestion][variable]) !== question.after[variable]) {
                  questionSolved = false;
               }
            }
            if (questionSolved) {
               nbSolved++;
            }
         }
         scores[curLevel] = Math.round(maxScores[curLevel] * nbSolved / nbQuestions);
         messages[curLevel] = taskStrings.questionsSolved(nbSolved, nbQuestions);
      };
      if (gradedLevel == null) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}

initTask();