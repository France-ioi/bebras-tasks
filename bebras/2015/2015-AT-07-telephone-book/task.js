function initTask(subTask) {
   // 'use strict';
   var level;
   var answer = null;
   var state = {};
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
         pattern: "c**t",
         taskH: 340
      },
      medium: {
         words: ["tacher", "table", "tartes", "arrive", "rave", "charme", "parer", "mare"],
         pattern: "*a+e",
         taskH: 470
      },
      hard: {
         words: ["attraper", "reproches", "pronostic", "prosterner", "prochains", "reposer", "crocheter", "promesse"],
         pattern: "+pro*+s+",
         taskH: 490
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

   subTask.loadLevel = function(curLevel) {
      if(respEnabled){
          displayHelper.responsive = true;
          convertDOM();
       }else{
          displayHelper.responsive = false;
       }
      level = curLevel;
      displayHelper.customValidate = checkResult;

      displayHelper.taskH = data[level].taskH;
      displayHelper.taskW = 770;
      displayHelper.minTaskW = 500;
      displayHelper.maxTaskW = 900;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      updateAllSelections();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = {};
      defaultAnswer = Beav.Array.make(data[level].words.length, false);
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
      loadWords();
      loadExamples();
      loadHandlers();
      updateAllSelections();
      displayHelper.updateLayout();
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
         displayError("");
         answer[iWord] = !answer[iWord];
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
      if(!answer)
         return
      if(answer[iWord]) {
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

   var patternToRegex = function(pattern) {
      var regexMatcher = function(match) {
         return patternConversion[match];
      };

      var convertedAnswer = pattern.replace(/\*|\+/g, regexMatcher);
      return new RegExp("^" + convertedAnswer + "$");
   };

   function checkResult(noVisual) {
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
         if (answer[iWord]) {
            nbSelected++;
         }
         if (correctSelections[iWord] && !(answer[iWord])) {
            missing++;
         } else if(!correctSelections[iWord] && answer[iWord]) {
            wrong++;
         } else {
            correct++;
         }
      }
      var message = "";
      var result;
      if (wrong == 0 && missing == 0) {
         successRate = 1;
         message = taskStrings.correct;
         if(!noVisual){
            platform.validate("done");
         }
      } else {
         successRate = 0
         if (nbSelected != nbToSelect && level != "hard") {
            message = taskStrings.incorrectNumber(nbToSelect);
         } else {
            message = taskStrings.incorrect;
         }
         if(!noVisual){
            displayError(message);
         }
      }
      return { successRate: successRate, message: message };
   }

   function displayError(msg) {
      if(respEnabled){
         displayHelper.displayError(msg);
      }else{
         $("#displayHelper_graderMessage").html(msg);
      }
   };
   
}
// initTask();
initWrapper(initTask, ["easy", "medium", "hard"],"easy");
displayHelper.useFullWidth();
