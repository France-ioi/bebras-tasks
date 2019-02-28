function initTask() {
   'use strict';
   var level;
   var answer = null;
   var state = null;
   function displayPatch(letter) {
      if (letter == "*") {
         return "?";
      } else if (letter == "+") {
         return "&#8230;";  
      } else {
         return letter;
      }
   };
   var patternConversion = {
      "*":     "[A-Za-z]",
      "+":     "[A-Za-z]*"
   };
   var data = {
      easy: {
         words: ["chat", "chut", "char", "plat", "cuit"],
         pattern: "c**t"
      },
      medium: {
         words: ["tacher", "table", "tartes", "arrive", "rave", "charme", "parer", "mare"],
         pattern: "*a+e"
      },
      hard: {
         words: ["attraper", "reproches", "pronostic", "prosterner", "prochains", "reposer", "crocheter", "promesse"],
         pattern: "+pro*+s+"
      }
   };
   var examples = {
      easy: [
         {
            words: ["chat", "chut", "char", "plat", "cuit"],
            pattern: "ch**"
         },
         {
            words: ["chat", "chut", "char", "plat", "cuit"],
            pattern: "**a*"
         }
      ],
      medium: [
         {
            words: [ "train", "tacher", "tarte", "tableau","tenir", "attire"],
            pattern: "t+e+"
         },
         {
            words: ["train", "tacher", "tarte", "tableau","tenir", "attire"],
            pattern: "t+e*"
         }
      ],
      hard: [
         {
               words: ["train", "tacher", "tarte", "tableau","tenir", "attire"],
            pattern: "t+e+"
         },
         {
               words: ["train", "tacher", "tarte", "tableau","tenir", "attire"],
            pattern: "t+e*"
         }
      ]
   };

   task.load = function(views, callback) {
      // displayHelper.hideValidateButton = true;
      displayHelper.setupLevels();

      if (views.solution) {
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
         loadWords();
         loadExamples();
         loadHandlers();
      }
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      updateAllSelections();
   };

   task.getAnswerObject = function() {
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      var answer = {};
      for(var level in data) {
         answer[level] = Beav.Array.make(data[level].words.length, false);
      }
      return answer;
   };

   var loadWords = function() {
      $("#main_words").html(generateWordsHTML(data[level], "pattern_target"));
   };

   var loadExamples = function() {
      for (var iExample = 0; iExample < examples[level].length; iExample++) {
         $("#example" + iExample).html(generateWordsHTML(examples[level][iExample], "pattern_example_" + iExample));
         var correctSelections = getCorrectSelections(examples[level][iExample]);
         for(var iWord = 0; iWord < correctSelections.length; iWord++) {
            if(correctSelections[iWord]) {
               $("#example" + iExample + " .word" + iWord).addClass("selected");
            }
         }
      }
   };

   var generateWordsHTML = function(elements, patternId) {
      var words = elements.words;
      var pattern = elements.pattern;
      var maxWordLength = 0;
      var iWord, iChar;

      for (iWord = 0; iWord < words.length; iWord++) {
         maxWordLength = Math.max(maxWordLength, words[iWord].length);
      }
      var wordsHTML = "";
      var wordPattern = "";
      for (iChar = 0; iChar < pattern.length; iChar++) {
         if (iChar !== 0) {
            wordPattern += "&nbsp;";
         }
         wordPattern += displayPatch(pattern.charAt(iChar));
      }
      $("#" + patternId).html(wordPattern);

      for (iWord = 0; iWord < words.length; iWord++) {
         var word = words[iWord];

         wordsHTML += "<tr><td class=\"cell" + iWord + "\"><span class=\"word word" + iWord + "\">";

         for (iChar = 0; iChar < maxWordLength; iChar++) {

            if (iChar < word.length) {
               wordsHTML += "<span class=\"char\">" +  displayPatch(word.charAt(iChar)) + "</span>";
            } else {
               // wordsHTML += "&nbsp;";
            }
         }

         wordsHTML += "</span></td></tr>";
      }
      return wordsHTML;
   };

   var loadHandlers = function() {
      for(var iWord = 0; iWord < data[level].words.length; iWord++) {
         $("#main_words .cell" + iWord).click(clickWord(iWord));
      }
   };

   var clickWord = function(iWord) {
      var handler = function() {
         answer[level][iWord] = !answer[level][iWord];
         updateWordSelection(iWord);
      };
      return handler;
   };

   var updateAllSelections = function() {
      for(var iWord = 0; iWord < data[level].words.length; iWord++) {
         updateWordSelection(iWord);
      }
   };

   var updateWordSelection = function(iWord) {
      if(answer[level][iWord]) {
         $("#main_words .word" + iWord).addClass("selected");
      }
      else {
         $("#main_words .word" + iWord).removeClass("selected");
      }
   };

   var getCorrectSelections = function(elements) {
      var words = elements.words;
      var regex = patternToRegex(elements.pattern);
      return Beav.Array.init(words.length, function(index) {
         return Boolean(words[index].match(regex));
      });
   };

   var getResultAndMessage = function(answer, level) {
      var correctSelections = getCorrectSelections(data[level]);
      var wrong = 0;
      var missing = 0;
      var correct = 0;
      var nbToSelect = 0;
      var nbSelected = 0;
      for(var iWord = 0; iWord < data[level].words.length; iWord++) {
         if (correctSelections[iWord]) {
            nbToSelect++;
         }
         if (answer[level][iWord]) {
            nbSelected++;
         }
         if (correctSelections[iWord] && !(answer[level][iWord])) {
            missing++;
         } else if(!correctSelections[iWord] && answer[level][iWord]) {
            wrong++;
         } else {
            correct++;
         }
      }
      var message = "";
      var result;
      if (wrong == 0 && missing == 0) {
         result = "correct";
         message = taskStrings.correct;
      } else {
         result = "wrong";
         if (nbSelected != nbToSelect && level != "hard") {
            message = taskStrings.incorrectNumber(nbToSelect);
         } else {
            message = taskStrings.incorrect;
         }
      }
      return { result: result, message: message };
   };

   var patternToRegex = function(pattern) {
      var regexMatcher = function(match) {
         return patternConversion[match];
      };

      var convertedAnswer = pattern.replace(/\*|\+/g, regexMatcher);
      return new RegExp("^" + convertedAnswer + "$");
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
      for (var curLevel in data) {
         var resultAndMessage = getResultAndMessage(answer, curLevel);
         if (resultAndMessage.result == "correct") {
            scores[curLevel] = maxScores[curLevel];
         } else {
            scores[curLevel] = 0;
         }
         messages[curLevel] = resultAndMessage.message;
      }

      if (!gradedLevel) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}
initTask();
