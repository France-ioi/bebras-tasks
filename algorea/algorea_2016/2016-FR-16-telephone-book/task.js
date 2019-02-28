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
   var disallowedChars = {
       easy:    /[^A-Za-z\*]/,
       medium:  /[^A-Za-z\*\+]/,
       hard:    /[^A-Za-z\*\+]/
   };
   var data = {
      // 1 = selected, 0 = not selected.
      easy: [
         ["dine",  0],
         ["dire",  1],
         ["rire",  0],
         ["dort",  1],
         ["dure",  1]
         ],
      medium: [
         ["loutre", 1],
         ["lardon", 0],
         ["lard",   1],
         ["mure",   0],
         ["livre",  1] // litre
         ],
      hard: [
         ["attraper",   0],
         ["prosterner",  0],
         ["reproches",   1],
         ["accroches",   0],
         ["prochains",   1],
         ["decrochera",  0],
         ["crocheter",   0],
         ["proposer",    1]
         ]
   };
   var samplePatterns = {
      easy:    ["*i**", "di**", "***e"],
      medium:  ["l+", "+re+", "*a+"],
      hard:    [ "+s", "+och+", "**p+"]
   };
   var dataSpecialChars = {
      easy:    "*",
      medium:  "*+",
      hard:    "*+"
   };
   var inputMaxLen = {
      easy:    5,
      medium:  7,
      hard:    9
   };

   var currentSource;
   var currentPattern;
   var words;
   var maxWordLength;
   var currentSelections;
   var keyboard;

   task.load = function(views, callback) {
      displayHelper.hideValidateButton = true;
      displayHelper.timeoutMinutes = 10;
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
         loadKeyboard();
         loadWords();
         loadExamples();
         loadHandlers();
      }
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      $("#keyboard_input").text(answer[level]);
      currentPattern = answer[level];
      if (currentPattern === "") {
         currentSource = "";
      } else {
         currentSource = "user_pattern_container";
      }
      updateDisplay();
   };

   task.getAnswerObject = function() {
      answer[level] = $("#keyboard_input").text().toLowerCase();
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      return {
         easy: "",
         medium: "",
         hard: ""
      };
   };

   var loadKeyboard = function() {
      if(keyboard) {
         keyboard.remove();
      }

      keyboard = new Keyboard();
      keyboard.addMap($("#keyboard"), getVisualKeys());
      keyboard.registerInputBox($("#keyboard_input"), inputMaxLen[level]);
   };

   var getVisualKeys = function() {
      var iChar, key;
      var keysObj = {};

      for(var iWord in data[level]) {
         var word = data[level][iWord][0];
         for(iChar = 0; iChar < word.length; iChar++) {
            var letter = displayPatch(word.charAt(iChar));
            keysObj[letter] = true;
         }
      }

      var keyCodesArr = [];
      for(key in keysObj) {
         keyCodesArr.push(key);
      }
      keyCodesArr.sort();

      var keysArr = [];
      for(var iKey in keyCodesArr) {
         key = keyCodesArr[iKey];
         keysArr.push({keyCode: key.charCodeAt(0), buttonText: key});
      }
      for(iChar = 0; iChar < dataSpecialChars[level].length; iChar++) {
         key = dataSpecialChars[level].charAt(iChar);
         keysArr.push({keyCode: key.charCodeAt(0), buttonText: displayPatch(key)});
      }
      var backspace = {keyCode: Keyboard.BACKSPACE, buttonText: taskStrings.backSpace}; //  "annuler une lettre"
      return [keysArr, [backspace]];
   };

   var loadWords = function() {
      words = data[level];
      var maxWordLength = 0;
      var iWord, iChar;

      for (iWord = 0; iWord < words.length; iWord++) {
         maxWordLength = Math.max(maxWordLength, words[iWord][0].length);
      }

      var wordsHTML = "";
      for (iWord = 0; iWord < words.length; iWord++) {
         var word = words[iWord][0];
         var selected = words[iWord][1];

         wordsHTML += "<tr><td class=\"cell" + iWord + "\"><span class=\"word word" + iWord;
         if (selected) {
            wordsHTML += " selected";
         }
         wordsHTML += "\">";

         for (iChar = 0; iChar < maxWordLength; iChar++) {

            if (iChar < word.length) {
               wordsHTML += "<span class=\"char\">" +  displayPatch(word.charAt(iChar)) + "</span>";
            } else {
               // wordsHTML += "&nbsp;";
            }
         }

         wordsHTML += "</span></td></tr>";
      }

      $(".words").html(wordsHTML);
   };

   var patternToHtml= function(pattern) {
      var txt = "";
      for (var iLetter = 0; iLetter < pattern.length; iLetter++) {
         txt += displayPatch(pattern.charAt(iLetter)) + "&nbsp;";
      }
      return txt;
   };

   var loadExamples = function() {
      var examples = samplePatterns[level];
      for (var iExample = 0; iExample < examples.length; iExample++) {
         $("#example" + iExample + "pattern").html(patternToHtml(examples[iExample]));
      }
   };

   var updatePattern = function() {
      clearResults();
      currentPattern = $("#keyboard_input").text().toLowerCase();
      displayPattern();
   };

   var loadHandlers = function() {
      $("#try").click(clickExecute);

      $(".keyboard_button").click(updatePattern);

      for (var iExample = 0; iExample < samplePatterns[level].length; iExample++) {
         $("#example" + iExample).click({index: iExample}, clickExample);
      }
   };

   var loadGrid = function() {
      if (level == "easy") {
         $("#results .char").addClass("grid_char");
      }
   };

   var clickExecute = function() {
      currentSource = "user_pattern_container";
      updateDisplay();
      answer[level] = $("#keyboard_input").text().toLowerCase();
      currentPattern = answer[level];

      var compl = completion(answer, level, currentSelections);
      if (compl > 0.99) {
         platform.validate("done", function() {});
      } else {
         displayHelper.validate("stay");
      }
   };

   var clickExample = function(event) {
      var exampleIndex = event.data.index;
      currentSource = "example" + exampleIndex + "src";
      $("#keyboard_input").text("");
      currentPattern = samplePatterns[level][exampleIndex];
      updateDisplay();
   };

   var getSelectionsAndMessage = function(pattern, level) {
      var words = data[level];
      var result = {
         message: "",
         selections: null
      };
      if (!pattern) {
         return result;
      }

      var badMatch = pattern.match(disallowedChars[level]);
      if (badMatch) {
         // TODO: cannot happen now that the keyboard is used
         var badChar = pattern.charAt(badMatch.index);
         if (badChar == " ") {
            result.message = taskStrings.noSpacesInPattern;
         } else {
            result.message = taskStrings.illegalCharacter + " " + badChar + ".";
         }
         return result;
      }

      result.selections = [];
      var regex = patternToRegex(pattern);
      for (var iWord = 0; iWord < words.length; iWord++) {
         var word = words[iWord][0];
         if (word.match(regex)) {
            result.selections.push(1);
         } else {
            result.selections.push(0);
         }
      }
      return result;
   };

   var getCorrectIndices = function(answer, level, selections) {
      var words = data[level];
      if (!selections) {
         return [];
      }
      var result = [];
      for (var iWord = 0; iWord < words.length; iWord++) {
         if (selections[iWord] == words[iWord][1]) {
            result.push(iWord);
         }
      }
      return result;
   };

   var patternToRegex = function(pattern) {
      var regexMatcher = function(match) {
         return patternConversion[match];
      };

      var convertedAnswer = pattern.replace(/\*|\+/g, regexMatcher);
      return new RegExp("^" + convertedAnswer + "$");
   };

   var updateDisplay = function() {
      currentSelections = getSelectionsAndMessage(currentPattern, level).selections;
      if (!currentSelections) {
         currentPattern = "";
      }
      padResults();
      displayPattern();
      loadGrid();
      displayResults();
      displaySources();
   };

   var displayPattern = function() {
      $("#current_pattern").html(patternToHtml(currentPattern));
   };

   var padResults = function() {
      $(".pad_char").remove();

      if (!currentPattern) {
         return;
      }

      for (var iWord = 0; iWord < words.length; iWord++) {
         var word = words[iWord][0];
         var padHTML = "";
         for (var iColumn = maxWordLength; iColumn < currentPattern.length; iColumn++) {
            padHTML += "<td class=\"char pad_char\">&nbsp;</td>";
         }
         $("#results .word" + iWord).append(padHTML);
      }
   };

   var clearResults = function() {
      $("#results .word").removeClass("selected");
      $("#results .char").removeClass("highlighted");
      $("#hint").hide();
   };

   var displayResults = function() {
      clearResults();

      if (!currentSelections) {
         return;
      }

      for (var iWord = 0; iWord < currentSelections.length; iWord++) {
         if (currentSelections[iWord]) {
            $("#results .word" + iWord).addClass("selected");
         }
      }
   };

   var displaySources = function() {
      $(".sources").removeClass("selected");
      if (currentSource) {
         $("#" + currentSource).addClass("selected");
      }
   };

   var completion = function(answer, level, selections) {
      if (!selections) {
         return 0;
      }
      var nbIndices = getCorrectIndices(answer, level, selections).length;
      if (nbIndices == data[level].length) {
         return 1;
      } else if (level == "hard" && (nbIndices == data[level].length-1)) {
         return 0.5;
      } else {
         return 0;
      }
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      platform.getTaskParams(null, null, function(taskParams) {
         if (strAnswer === '') {
            callback(taskParams.minScore, '');
            return;
         }
         var answer = $.parseJSON(strAnswer);
         var scores = {};
         var messages = {};
         var maxScores = displayHelper.getLevelsMaxScores();

         for (var curLevel in data) {
            var selectionsAndMessage = getSelectionsAndMessage(answer[curLevel], curLevel);
            if (answer[curLevel] === "") {
               scores[curLevel] = taskParams.noScore;
               messages[curLevel] = taskStrings.buildPattern;
            } else {
               if (selectionsAndMessage.message) {
                  scores[curLevel] = taskParams.noScore;
                  messages[curLevel] = selectionsAndMessage.message;
               } else {
                  var compl = completion(answer, curLevel, selectionsAndMessage.selections);
                  if (compl > 0.99) {
                     scores[curLevel] = maxScores[curLevel];
                     messages[curLevel] = taskStrings.success;
                  } else {
                     scores[curLevel] = Math.round(maxScores[curLevel] * compl); 
                     // TODO: this code should be done in a better way, using a count function
                     var nbSelected = 0;
                     for (var iSel = 0; iSel < selectionsAndMessage.selections.length; iSel++) {
                        if (selectionsAndMessage.selections[iSel]) {
                           nbSelected++;
                        }
                     }
                     if (nbSelected == 0) {
                        messages[curLevel] = taskStrings.emptySelection;
                     } else {
                        messages[curLevel] = taskStrings.incorrectSelection;
                     }
                  }
               }
            }
         }

         if (!gradedLevel) {
            displayHelper.sendBestScore(callback, scores, messages);
         } else {
            callback(scores[gradedLevel], messages[gradedLevel]);
         }
      });
   };
}
initTask();

