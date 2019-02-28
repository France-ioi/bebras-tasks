function initTask() {
   var paper;
   var paperWidth = 700;
   var paperHeight = 100;
   var cursorSpace = 40;
   var cursorMargin = 6;
   var cursorHeight = 17;
   var railWidth = 4;
   var railHeight = 60;
   var yCursorTrue = 5;
   var yCursorFalse = 40;
   var yLabel = 60;
   var labelFontSize = "17";

   var level = "easy";
   var data = {
      "easy": {
         nbCursors: 5,
         showLabels: true,
         targets: [ 11, 13, 19, 21, 22 ]
         },
      "medium": {
         nbCursors: 10,
         showLabels: true,
         targets: [ 219, 283, 227, 421, 382 ]
         }, 
      "hard": {
         nbCursors: 17,
         showLabels: false,
         targets: [ 49723 ]
         }
      };
   var levelData = null;
   var target = null;
   var objCursors = null;
   var answer = null;
   var state = null;

   var stringOfValue = function(value) {
      if (value == 0) {
         return "0";
      }
      var s = "";
      var i = 0;
      while (value > 0) {
         var v = value % 10;
         value = Math.floor(value / 10);
         s = v + s;
         i++;
         if (i % 3 == 0)
            s = " " + s;
      }
      return s;
   };

   var clickHandler = function(cursor) {
      return function() { toggleAt(cursor); };
   };

   var toggleAt = function(cursor) {
      answer[level][cursor] = 1 - answer[level][cursor];
      updateDisplay();
      if (valueOfState(answer[level], level) == target) {
         platform.validate("stay");
      }
      // TODO? displayHelper.stopShowingResult();
   };

   var valueOfState = function(state, curLevel) {
      var value = 0;
      var nbCursors = data[curLevel].nbCursors;
      for (var cursor = 0; cursor < nbCursors; cursor++) {
         value += state[cursor] * Math.pow(2, nbCursors-1-cursor);
      }
      return value;
   };

   var updateDisplay = function() {
      if (answer == null) {
         return;
      }
      var current = valueOfState(answer[level], level);
      $("#valueCurrent").html(stringOfValue(current));
      for (var cursor = 0; cursor < nbCursors; cursor++) {
         var yCursor = (answer[level][cursor] == 1) ? yCursorTrue : yCursorFalse; 
         objCursors[cursor].attr({y: yCursor});
      }
      var message = taskStrings.good;
      var color = "green";
      if (current > target) {
         message = taskStrings.tooMuch;
         color = "black";
      } else if (current < target) {
         message = taskStrings.notEnough;
         color = "black";
      }
      $("#valueRelative").html(message).css({"color": color});
   };

   var displayCursors = function(paper, nbCursors, showLabels) {
      objCursors = [];
      paper.clear();
      //paper.rect(2, 2, paperWidth-4, paperHeight-4).attr({"stroke-width": 4, stroke: "black"});
      var xFirstCursor = paperWidth/2 - (nbCursors/2)*cursorSpace;
      for (var cursor = 0; cursor < nbCursors; cursor++) {
         var xCursor = xFirstCursor + cursor*cursorSpace;
         var yCursor = yCursorFalse;
         paper.rect(xCursor, 0, cursorSpace, railHeight)
              .attr({"stroke-width": 1, stroke: "black", fill: "#FFFFFF" })
              .click(clickHandler(cursor));
         Beav.Raphael.lineRelative(paper, xCursor+cursorSpace/2, 1, 0, railHeight-2)
              .attr({"stroke-width": railWidth, stroke: "#DDDDDD"})
              .click(clickHandler(cursor));
         objCursors[cursor] = paper.rect(xCursor+cursorMargin, yCursor, cursorSpace-2*cursorMargin, cursorHeight)
           .attr({"stroke-width": 0, stroke: "red", fill: "135-#0000FF:25-#CCCCFF:99"})
           .click(clickHandler(cursor));
         if (levelData.showLabels) {
           paper.text(xCursor+cursorSpace/2, yLabel+20, Math.pow(2, nbCursors-1-cursor))
              .attr("font-size", labelFontSize);
         }
      }
      if (! levelData.showLabels) {
        paper.text(paperWidth/2, yLabel+20, taskStrings.canBeSolvedWithoutValues)
           .attr("font-size", labelFontSize);
      }
   };


   task.load = function(views, callback) {
      paper = Raphael("abacusTask", paperWidth, paperHeight);
      displayHelper.setupLevels();
      callback();
   };

   task.unload = function(callback) {
      callback();
   };

   task.getDefaultStateObject = function() {
      var state = { level: "easy" };
      return state;
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;;

      levelData = data[level];
      nbCursors = levelData.nbCursors;
      var taskParams = displayHelper.taskParams;
      target = levelData.targets[parseInt(taskParams.randomSeed) % levelData.targets.length];
      if (display) {
         $("#valueTarget").html(stringOfValue(target));
         displayCursors(paper, levelData.nbCursors, levelData.showLabels);
         updateDisplay();
      }
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      updateDisplay();
   };

   task.getAnswerObject = function() {
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      var answerObj = {};
      for (var curLevel in data) {
         var nbCursors = data[curLevel].nbCursors;
         answerObj[curLevel] = [];
         for (var cursor = 0; cursor < nbCursors; cursor++) {
            answerObj[curLevel][cursor] = 0;
         }
      }
      return answerObj;
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
         if (valueOfState(answer[curLevel], curLevel) == data[curLevel].targets[parseInt(taskParams.randomSeed) % data[curLevel].targets.length]) {
            messages[curLevel] = taskStrings.success;
            scores[curLevel] = maxScores[curLevel];
         } else {
            messages[curLevel] = taskStrings.failure;
            scores[curLevel] = 0;
         }
      }
      if (!gradedLevel) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}

initTask();