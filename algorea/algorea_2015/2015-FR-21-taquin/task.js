function initTask() {
   var data = {
      hard: {
         cells: [
            [43, 10, 23,  3, 37, 27, 16, 52, 40, 32, 13, 21, 31],
            [47, 33, 26, 17, 41, 50, 22, 28,  3, 44, 36,  5, 12],
            [11, 48, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1],
            [ 2, 25,  9, 42,  7, 51, 19, 15, 49, 39,  6, 20,  1],
            [24, 46, 34, 18, 38,  8, 29, 45, 14, 30,  4, 35,  0]
         ],
/*         cells: [
            [ 1, 26, 19, -1, 17, 57, 23, 41, 27, -1, 42, 33, 44],
            [ 0, 34, 29, -1, 45, 28, 55,  5, 54, -1,  6, 48, 22],
            [-1, 39,  9, -1, 11, 40, -1, 52, 20, -1, 14, 21, -1],
            [-1, 12, 24, -1, 50, 16, -1, 30, 53, -1, 49,  8, -1],
            [-1,  2, 38, 13,  3, 35, -1,  4, 10, 56, 32, 15, -1],
            [-1, 25, 18, 51, 37, 47, -1, 46, 36, 31,  7, 43, -1]
         ],
*/
         animDelay: 100
      },
      medium: {
         cells: [
            [1, 3, 14, 12, 21, 20, 19, 15, 2, 4, 9, 23],
            [0, 5, 11, 16, 6, 10, 13, 7, 8, 17, 22, 18]
         ],
         animDelay: 150
      },
      easy: {
         cells: [
            [9, 3, 11, 5, 7, 2],
            [0, 4, 6, 8, 10, 1]
         ],
         animDelay: 400
      }
   };
   var sampleRunning = false;
   var level = null;
   var cells = [];
   var texts = [];
   var curLin;
   var curCol;
   var linCell1;
   var colCell1;
   var nbLins;
   var nbCols;
   var paper;
   var isGrader = false;
   var answer = null;

   task.load = function(views, callback) {
      displayHelper.hideValidateButton = true;
      displayHelper.setupLevels();
      callback();
   };

   task.unload = function(callback) {
      DelayedExec.stopAll();
      callback();
   };

   task.getDefaultStateObject = function() {
      return { level: "easy", isGrader: false };
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;

      nbLins = data[level].cells.length;
      nbCols = data[level].cells[0].length;
      curLin = 0;
      curCol = 0;
      // TODO : position du 1
      if (display) {
         DelayedExec.stopAll();
         cells = [];
         texts = [];
         if (paper != null) {
            paper.remove();
         }
         drawGrids();
         task.resetExecution();
      }
   };

   task.getDefaultAnswerObject = function() {
      return {
         easy: "",
         medium: "",
         hard: ""
      }
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      clearGrid();
      $("#answer").val(answer[level]);
   };

   task.getAnswerObject = function() {
      answer[level] = $("#answer").val();
      return answer;
   };

   var initLinCol = function() {
      for (var lin = 0; lin < nbLins; lin++) {
         for (var col = 0; col < nbCols; col++) {
            var curValue = data[level].cells[lin][col];
            if (curValue == 1) {
               linCell1 = lin;
               colCell1 = col;
            } else if (curValue == 0) {
               curLin = lin;
               curCol = col;
            }
         }
      }
   }

   var drawGrids = function() {
      // assumes isGrader = false
      var cellSize = 24;
      paper = Raphael("taquin", nbCols * (cellSize + 1), nbLins * (cellSize + 1));
      cells = [];
      for (var lin = 0; lin < nbLins; lin++) {
         cells[lin] = [];
         texts[lin] = [];
         for (var col = 0; col < nbCols; col++) {
            cells[lin][col] = paper.rect(1 + col * cellSize, 1 + lin * cellSize, cellSize , cellSize).attr({"stroke-width": 1});
            texts[lin][col] = paper.text(1 + col * cellSize + cellSize / 2, 1 + lin * cellSize + cellSize / 2).attr({"text": " ", "font-size": 15});
         }
      }
      clearGrid();
   };

   var clearGrid = function() {
      DelayedExec.stopAll();
      for (var lin = 0; lin < nbLins; lin++) {
         for (var col = 0; col < nbCols; col++) {
            var text = data[level].cells[lin][col];
            var fill = "white";
            if (text == -1) {
               text = " ";
               fill = "#A02020";
            } else if (text == 0) {
               text = " ";
               fill = "gray";
            }
            if ((text != " ") && (text == "1")) {
               fill = "lightblue";
            }
            cells[lin][col].attr({"fill": fill});
            texts[lin][col].attr({"text": text});
         }
      }
   };

   var parseAnswer = function(strAnswer) {
      var command = strAnswer.replace(/\s+/g, '').toUpperCase();
      if(command.length > 100) {
         throw taskStrings.programTooLong;
      }
      return doParse(command);
   };

   var doParse = function(command) {
    if(command == "")
      return "";

    //Parse le nombre qui doit se trouver en tete
    /*
    if(command.charAt(0) < '0' || command.charAt(0) > '9') {
      throw "Je ne comprends pas votre programme.";
      return undefined;
    }
    */
    var pos = 0;
    var num = 0;
    while(command.charAt(pos) >= '0' && command.charAt(pos) <= '9') {
      num = num * 10 + command.charCodeAt(pos) - "0".charCodeAt(0);
      pos++;
    }
    if (num == 0) {
       num = 1;
    }
    var end = pos;
    var commandCur;
    if(command.charAt(pos) == '(') {
      var idx = 1;
      while(idx > 0) {
        end++;
        if(end == command.length) {
          throw taskStrings.cantUnderstandProgram;
        }
        if(command.charAt(end) == '(')
          idx++;
        if(command.charAt(end) == ')')
          idx--;
      }
      var commandCur = doParse(command.substr(pos+1, end-pos-1));
      if(commandCur == undefined)
        return undefined;
      end++;
    }
    else if(command.charAt(pos) == taskStrings.down || command.charAt(pos) == taskStrings.up ||
            command.charAt(pos) == taskStrings.left || command.charAt(pos) == taskStrings.right) {
      end++;
      commandCur = command.charAt(pos);
    } else {
      throw taskStrings.cantUnderstandProgram;
    }
    var commandNext = doParse(command.substring(end));
    if(commandNext == undefined)
      return undefined;

    if(commandCur.length * num + commandNext.length > 2000) {
      throw taskStrings.executionTooLong;
    }
    return new Array(num+1).join(commandCur) + commandNext;
   };

   task.resetSelectedSample = function() {
      $(".examples td").css("background-color", "");
      $("#answer").parent().css("background-color", "");
   }

   task.executeSample = function(numSample) {
      task.resetSelectedSample();
      var buttonID = "#sample" + numSample;
      $(buttonID).parent().css("background-color", "#AAFFAA");
      var program = $(buttonID).val();
      execute(program, 400, false);
   }

   task.executeAnswer = function() {
      task.resetSelectedSample();
      $("#answer").parent().css("background-color", "#AAFFAA");
      execute(answer[level], data[level].animDelay, true);
   }

   task.resetExecution = function() {
      clearGrid();
      sampleRunning = false;
      task.resetSelectedSample();
      $("#programRan").html("&nbsp;");
      $("#resetButton").attr("disabled", true);
   };

   var execute = function(strAnswer, delay, displayResult) {
      displayHelper.stopShowingResult();
      initLinCol();
      var command;
      try {
         command = parseAnswer(strAnswer);
      } catch (exception) {
         displayHelper.validate("stay");
         return;
      }
      if(command == undefined) {
         displayHelper.validate("stay");
         return;
      }
      var executionDelay = 0;
      if (sampleRunning) {
         clearGrid();
         executionDelay = 1500;
         $("#programRan").html(taskStrings.resetting);
         $("#resetButton").attr("disabled", true);
      }
      sampleRunning = true;
      DelayedExec.setTimeout("execute", function() {
         clearGrid();
         $("#resetButton").attr("disabled", false);
         $("#programRan").html(taskStrings.programExecuted + " " + strAnswer);
         var pos = 0;
         var subExecuteStep = function() {
            try {
               if (pos == command.length) {
                  DelayedExec.clearInterval("executeStep");
                  displayHelper.validate("stay");
                  return;
               }
               if (executeStep(command.charAt(pos), true)) {
                  DelayedExec.clearInterval("executeStep");
                  if (displayResult) {
                     platform.validate("done", function() {});
                  }
                  return;
               }
            } catch (exception) {
               DelayedExec.clearInterval("executeStep");
               displayHelper.validate("stay");
            }
            pos++;
            if (pos > 100) {
               DelayedExec.setInterval("executeStep", subExecuteStep, 10);
            }
         }
         DelayedExec.setInterval("executeStep", subExecuteStep, delay);
      }, executionDelay);
   };

   var executeStep = function(letter, display) {
      var oldCol = curCol;
      var oldLin = curLin;
      if (letter == taskStrings.right) {
         curCol++;
      } else if (letter == taskStrings.left) {
         curCol--;
      } else if (letter == taskStrings.down) {
         curLin++;
      } else if (letter == taskStrings.up) {
         curLin--;
      }

      if ((curCol < 0) || (curCol >= nbCols) || (curLin < 0) || (curLin >= nbLins)) {
         throw taskStrings.holeExitingGrid;
      }

      if (data[level].cells[curLin][curCol] == -1) {
         throw taskStrings.holeIntoObstacle;
      }

      if ((curLin == linCell1) && (curCol == colCell1)) {
         linCell1 = oldLin;
         colCell1 = oldCol;
      }
      
      if (display) {
         var oldHoleCell = cells[oldLin][oldCol];
         var oldHoleText = texts[oldLin][oldCol];
         var newHoleText = texts[curLin][curCol];
         var text = newHoleText.attr("text");

         oldHoleText.attr("text", text);
         newHoleText.attr("text", " ");
         var newHoleCell = cells[curLin][curCol];
         var fill = "white";
         if ((text != " ") && (text == "1")) {
            fill = "lightgreen";
         }
         oldHoleCell.attr("fill", fill);
         newHoleCell.attr("fill", "gray");
      }
      return ((linCell1 == 0) && (colCell1 == nbCols - 1));
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
      // clone the state to restore after grading.
      var oldState = $.extend({}, task.getStateObject());
      for (var curLevel in data) {
         state.level = curLevel;
         task.reloadStateObject(state, false);
         var command;
         try {
            command = parseAnswer(answer[curLevel]);
            if (command == undefined) {
               throw "Erreur (TODO: quand est-ce possible ?)";
            }
         } catch (exception) {
            messages[curLevel] = exception;
            scores[curLevel] = 0;
            continue;
         }
         initLinCol();
         var success = false;
         for (var pos = 0; pos < command.length; pos++) {
            try {
               success = executeStep(command.charAt(pos));
               if (success) {
                  break;
               }
            } catch (exception) {
               messages[curLevel] = exception;
               scores[curLevel] = 0;
               break;
            }
         }
         if (success) {
            messages[curLevel] = taskStrings.success;
            scores[curLevel] = maxScores[curLevel];
         } else if (messages[curLevel] == undefined) {
            messages[curLevel] = taskStrings.failure;
            scores[curLevel] = 0;
         }
      }
      task.reloadStateObject(oldState, false);
      if (gradedLevel == null) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}

initTask();