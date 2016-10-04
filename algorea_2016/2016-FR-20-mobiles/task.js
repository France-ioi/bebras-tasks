/*

For testing various possible errors in the hard version, use the following patterns:
   [nothing]
   1
   a
   12
   0 0 0 0
   1 2 3
   1 3 3 (3 4 5 2 4 3)
   1 3 3 (3 4 4)
   1 2 3
   1 2 3 (1 3 4 4)
   1 2 3 (1 1 1 1
   1 2 (3 3 3 3) 4
   1 2 3 (1 3 4 4) 4)
   1 2 3 (1 3 4 4) 4

*/

function initTask() {
   var level;
   var answer = null;
   var state = null;
   var disallowedChars = /[^1234\(\)\s]/;
     ///[^\d\(\)\s]/;
   var expectedAnswer = {
      easy:    "2 2 4 1",
      medium:  "2 (2 2 1 4) 3 (2 2 2 2)",
      hard:    "4 (1 3 2 (1 2 2 1)) 4 (2 (1 3 1 3) 3 (3 1 1 1))"
   };
   var examples = {
      easy: [
         "1 1 1 1",
         "2 1 1 3",
         "3 2 1 4"
      ],
      medium: [
         "3 2 1 4",
         "1 2 3 (3 2 1 4)",
         "1 (3 2 1 4) 2 3"
      ],
      hard: [
         "3 (3 2 1 4) 1 2",
         "1 (3 2 1 (2 1 2 1)) 4 3"
      ]
   };
   var easyMediumTokens;

   var paper;
   var paperParams = {
      width: 350,
      height: 240,
      startX: 160,
      startY: 0,
      widthUnit: 22,
      ropeLength: 40,
      imageHeight: 18,
      extraRopeLength: 10,
      imageAttr: {fill: "135-#0000FF:25-#CCCCFF:99"},
      ropeAttr: {"stroke-width": 1},
      stickAttr: {"stroke-width": 3, stroke: "brown"},
      stickUnitAttr: {fill: "black"},
      stickUnitRadius: 2
   };

   var targetPaper;
   var targetParams = paperParams;
   var mobilePartsCount = 4;
   var mobileLeftDistIndex = 0;
   var mobileLeftIndex = 1;
   var mobileRightDistIndex = 2;
   var mobileRightIndex = 3;
   var mobileRangeMin = 1;
   var mobileRangeMax = 9;
   var easyMediumRangeMin = 1;
   var easyMediumRangeMax = 4;

   task.load = function(views, callback) {
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
         initTarget();
         initPaper();
         initExamples();
         initInput();
         setSelectedSource(null);
         initHandlers();
      }
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      loadAnswerToInput();
      if (paper) {
         paper.clear();
      }
      $("#mobile_desc").html("");
      clickExecute(false);
   };

   task.getAnswerObject = function() {
      answer[level] = getCurrentLevelAnswer();
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      return {
         easy:    "",
         medium:  "",
         hard:    ""
      };
   };

   var getCurrentLevelAnswer = function() {
      return $("#user_input_text").val();
   };

   var loadAnswerToInput = function() {
      $("#user_input_text").val(answer[level]);
      $("#user_input_text").focus();
   };

   var initTarget = function() {
      if (targetPaper) {
         targetPaper.remove();
      }

      targetPaper = new Raphael("target_anim", targetParams.width, targetParams.height);
      drawMobile(targetPaper, targetParams, getMobileAndMessage(expectedAnswer[level]).mobile, targetParams.startX, targetParams.startY);
   };

   var initPaper = function() {
      if (paper) {
         paper.remove();
      }
      paper = new Raphael("anim", paperParams.width, paperParams.height);
   };

   var initInput = function() {
      if (!answer) {
         easyMediumTokens = [];
         return;
      }
    };

   var initHandlers = function() {
      $("#execute").unbind("click");
      $("#execute").click(function() {
         clickExecute(true);
      });
      $("#user_input_text").unbind("keyup");
      $("#user_input_text").keyup(function(event) {
         $("#mobile_desc").html("");
         if (event.keyCode == 13) {
            clickExecute(true);
         }
      });
      $("#user_input_text").on("input", function() {
         if (paper) {
            paper.clear();
         }
         setSelectedSource(null);
      });

      for (var iExample in examples[level]) {
         $("#example" + iExample + "button").unbind("click");
         $("#example" + iExample + "button").click({
            index: iExample
         }, clickExample);
      }
   };

   var clickExecute = function(validate) {
      setSelectedSource("user_input_container");
      paper.clear();
      var userString = getCurrentLevelAnswer();
      mobileAndMessage = getMobileAndMessage(userString);
      userString = getCurrentLevelAnswer(); // may be updated by previous function
      displayMobileText(userString, mobileAndMessage.index);
      
      var curMobile = getMobileAndMessage(expectedAnswer[level]);

      if (mobileAndMessage.message) {
         if (validate) {
            displayHelper.validate("stay");
         }
         return;
      }
      drawMobile(paper, paperParams, mobileAndMessage.mobile);
      if (validate) {
         if (equalMobiles(mobileAndMessage.mobile, curMobile.mobile)) {
            platform.validate("done", function() {});
         } else {
            displayHelper.validate("stay");
         }
      }
   };

   var clickExample = function(event) {
      var iExample = event.data.index;
      setSelectedSource("example" + iExample + "src");
      paper.clear();
      mobileAndMessage = getMobileAndMessage(examples[level][iExample]);
      displayMobileText(examples[level][iExample]);
      drawMobile(paper, paperParams, mobileAndMessage.mobile);
   };

   var initExamples = function() {
      for (var iExample in examples[level]) {
         var example = examples[level][iExample];
         $("#example" + iExample).html(example);
      }
   };

   var setSelectedSource = function(source) { // source may be null
      $(".sources").removeClass("source_selected");
      if (source) {
         $("#" + source).addClass("source_selected");
      }
   };

   var displayMobileText = function(mobileText, badIndex) {
      var escape = Beav.Html.escape;

      if (badIndex === undefined) {
         $("#mobile_desc").html(""); 
         return;
      }

      var prefix = escape(mobileText.substring(0, badIndex));
      var badChar = escape(mobileText.charAt(badIndex));
      var suffix = escape(mobileText.substring(badIndex + 1));
      if (badIndex >= mobileText.length) {
         badChar = "&nbsp;";
      }
      var htmlString = prefix + "<span class=\"syntax_error\">" + badChar + "</span>" + suffix;
      $("#mobile_desc").html(htmlString);
   };

   /*var mobileToString = function(mobile) {
      var type = typeof(mobile);
      if(type == "number" || type == "string") {
         return mobile;
      }
      return "( " + mobile[mobileLeftDistIndex] + " "
                 + mobileToString(mobile[mobileLeftIndex]) + " "
                 + mobile[mobileRightDistIndex] + " "
                 + mobileToString(mobile[mobileRightIndex]) + " )";
   };*/

   var drawMobile = function(paper, params, mobile) {
      paper.clear();
      drawMobileRecurse(paper, params, mobile, params.startX, params.startY, false);
   };

   var drawMobileRecurse = function(paper, params, mobile, xPos, yPos, extraRope) {
      var newYPos = yPos + params.ropeLength;
      if (extraRope) {
         newYPos += params.extraRopeLength;
      }

      drawRope(paper, params, xPos, yPos, newYPos);

      if (typeof(mobile) == "string" || typeof(mobile) == "number") {
         drawMobileImages(paper, params, parseInt(mobile, 10), xPos, newYPos);
         return;
      }

      drawStick(paper, params, mobile[mobileLeftDistIndex], xPos, newYPos, "left");
      drawStick(paper, params, mobile[mobileRightDistIndex], xPos, newYPos, "right");
      drawMobileRecurse(paper, params, mobile[mobileLeftIndex], xPos - mobile[mobileLeftDistIndex] * params.widthUnit, newYPos, false);
      drawMobileRecurse(paper, params, mobile[mobileRightIndex], xPos + mobile[mobileRightDistIndex] * params.widthUnit, newYPos, true);
   };

   var drawRope = function(paper, params, xPos, yPos, newYPos) {
      paper.path(["M", xPos, yPos, "L", xPos, newYPos]).attr(params.ropeAttr);
   };

   var drawMobileImages = function(paper, params, mobile, xPos, yPos) {
      for (var index = 0; index < mobile; index++) {
         paper.circle(xPos, yPos + index * params.imageHeight, params.imageHeight / 2).attr(params.imageAttr);
      }
   };

   var drawStick = function(paper, params, length, xPos, yPos, direction) {
      var sign;
      if (direction == "right") {
         sign = 1;
      } else {
         sign = -1;
      }
      var targetX = xPos + sign * length * params.widthUnit;

      paper.path(["M", xPos, yPos, "L", targetX, yPos]).attr(params.stickAttr);

      for (var iUnit = 0; iUnit <= length; iUnit++) {
         paper.circle(xPos + sign * iUnit * params.widthUnit, yPos, params.stickUnitRadius).attr(params.stickUnitAttr);
      }
   };

   var getMobileAndMessage = function(input) {
      if ($.trim(input) === "") {
         return {
            message: taskStrings.instruction
         };
      }

      // ensure space between every two keywords
      var new_input = "";
      var prev_is_digit = false;
      for (var iLetter = 0; iLetter < input.length; iLetter++) {
         var curLetter = input.charAt(iLetter);
         var cur_is_digit = ((0 + curLetter) >= 1 && (0 + curLetter) <= 9);
         if (prev_is_digit && cur_is_digit) {
            new_input += " ";
         }
         new_input += curLetter;
         prev_is_digit = cur_is_digit;
      }
      if (new_input != input) {
         $("#user_input_text").val(new_input);
         input = new_input;
      }

      input = "(" + input + ")";

      var badMatch = input.match(disallowedChars);
      if (badMatch) {
         var badChar = input.charAt(badMatch.index);
         return {
            message: taskStrings.invalidChar(Beav.Html.escape(badChar)),
            index: badMatch.index-1 // to compensate for "(" at the front
         };
      }

      var index = 0;
      var stack = [];

      while (index < input.length) {
         var realIndex = index - 1; // due to insertion of "(" at the front
         var curChar = input.charAt(index);
         if (curChar.match(/\s/)) {
            index++;
            continue;
         }
         if (stack.length > 0 && stack[stack.length - 1].length == mobilePartsCount && curChar != ")") {
            if(stack.length == 1) {
               return {
                  message: taskStrings.unusedChars,
                  index: realIndex
               };
            }
            else {
               return {
                  message: taskStrings.missingClosingPar,
                  index: realIndex
               };
            }
         }

         if (curChar == "(") {
            if (stack.length > 0 && stack[stack.length - 1].length != mobileLeftIndex && stack[stack.length - 1].length != mobileRightIndex) {
               return {
                  message: taskStrings.expecteDigit,
                  index: realIndex
               };
            }
            stack.push([]);
         } else if (curChar == ")") {
            if (stack[stack.length - 1].length < mobilePartsCount) {
               return {
                  message: taskStrings.expectedInformation,
                     // "avant la parenthèse fermante" => mais ça peut être tout à la fin...
                  index: realIndex
               };
            }
            if (stack.length == 1) {
               if (index == input.length - 1) {
                  return {
                     mobile: stack[0]
                  };
               }
               break;
            }
            stack[stack.length - 2].push(stack.pop());
         } else if (curChar.match(/\d/)) {
            var numberStart = index;
            index++;
            while (index < input.length && input.charAt(index).match(/\d/)) {
               index++;
            }
            var number = parseInt(input.substring(numberStart, index), 10);

            if (number < mobileRangeMin || number > mobileRangeMax) {
               //return {message: "Seuls les nombres entre " + mobileRangeMin + " et " + mobileRangeMax + " sont autorisés.", index: numberStart};
               if (number === 0) {
                  return {
                     message: taskStrings.digitZero,
                     index: numberStart - 1
                  };
               }
               return {
                  message: taskStrings.needSpaces,
                  index: numberStart
               };
            }

            stack[stack.length - 1].push(number);
            continue;
         }
         index++;
      }

      if (stack.length > 1) {
         return {
            message: taskStrings.incompleteDescr,
            index: index
         };
      }

      if (index < input.length) {
         return {
            message: taskStrings.unusedChars,
            index: index
         };
      }

      return {
         message: taskStrings.incompleteDescr,
         index: index
      };
   };

   var equalMobiles = function(mobile1, mobile2) {
      var type1 = typeof(mobile1);
      var type2 = typeof(mobile2);
      if (type1 != type2) {
         return false;
      }
      if (type1 == "number" || type1 == "string") {
         return mobile1 == mobile2;
      }
      if (mobile1.length != mobile2.length) {
         return false;
      }
      for (var index in mobile1) {
         if (!equalMobiles(mobile1[index], mobile2[index])) {
            return false;
         }
      }
      return true;
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
         var scores = {};
         var messages = {};
         var maxScores = displayHelper.getLevelsMaxScores();

         var answer = $.parseJSON(strAnswer);
         // clone the state to restore after grading.
         var oldState = $.extend({}, task.getStateObject());
         for (var curLevel in expectedAnswer) {
            state.level = curLevel;
            task.reloadStateObject(state, false);

            var mobileAndMessage = getMobileAndMessage(answer[curLevel]);

            if (mobileAndMessage.message) {
               scores[curLevel] = taskParams.noScore;
               messages[curLevel] = mobileAndMessage.message;
            } else {
               var userMobile = mobileAndMessage.mobile;
               var answerMobile = getMobileAndMessage(expectedAnswer[curLevel]).mobile;

               if (equalMobiles(userMobile, answerMobile)) {
                  scores[curLevel] = maxScores[curLevel];
                  messages[curLevel] = taskStrings.success;
               } else {
                  scores[curLevel] = taskParams.noScore;
                  messages[curLevel] = taskStrings.incorrect;
               }
            }
         }

         task.reloadStateObject(oldState, false);
         if (!gradedLevel) {
            displayHelper.sendBestScore(callback, scores, messages);
         } else {
            callback(scores[gradedLevel], messages[gradedLevel]);
         }
      });
   };
}
initTask();


