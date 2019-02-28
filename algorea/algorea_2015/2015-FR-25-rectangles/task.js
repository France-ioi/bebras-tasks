function initTask() {
   var level = "easy";
   var tokens = [];
   var iToken = 0;
   var papers = [];
   var cellSide = 20;
   var margin = 20;
   var nbCols = 10;
   var nbRows = 7;
   var curRectangle = 0;
   var state = null;
   var data = {
      "easy": {
         targetGrid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
            ],
         nbRectangles: 2
      },
      "medium": {
         targetGrid: [
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0]
            ],
         nbRectangles: 4
      },
      "hard": {
         targetGrid: [
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 1, 1, 1, 1, 1, 0, 0],
            [1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 0, 0, 1, 1, 1, 1],
            [1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 1, 1, 1, 1, 1, 1, 1],
            [1, 0, 0, 0, 1, 1, 1, 1, 1, 1]
            ],
         nbRectangles: 4
      }
   };
   var samples = [
      [{x1:2, y1: 1, x2:5, y2: 4, color:0}],
      [{x1:2, y1: 3, x2:4, y2: 6, color:0}, {x1:6, y1:2, x2:9, y2:5, color:0}],
      [{x1:3, y1: 0, x2:8, y2: 3, color:0}, {x1:4, y1:1, x2:6, y2:2, color:1}]
   ];

   var paramNames = ['x1', 'y1', 'x2', 'y2', 'color'];

   var buildGrid = function() {
      papers[0] = Raphael("target", nbCols * cellSide + 3 * margin, nbRows * cellSide + 2 * margin);
      papers[1] = Raphael("grid", nbCols * cellSide + 3 * margin, nbRows * cellSide + 2 * margin);
      cells = [[], []];
      for (var iRow = 0; iRow < nbRows; iRow++) {
         var y = iRow * cellSide;
         for (var iGrid = 0; iGrid < papers.length; iGrid++) {
            cells[iGrid].push([]);
            papers[iGrid].text(margin + margin / 2, y + (cellSide / 2), iRow).attr({"font-size": 14});
         }
         for (var iCol = 0; iCol < nbCols; iCol++) {
            var x = 2 * margin + iCol * cellSide;
            for (var iGrid = 0; iGrid < papers.length; iGrid++) {
               cells[iGrid][iRow].push(papers[iGrid].rect(x, y, cellSide, cellSide));
            }
         }
      }
      
      for (var iGrid = 0; iGrid < papers.length; iGrid++) {
         for (var iCol = 0; iCol < nbCols; iCol++) {
            var x = 2 * margin + iCol * cellSide + cellSide / 2;
            papers[iGrid].text(x, nbRows * cellSide + cellSide / 2, iCol).attr({"font-size": 14});
         }
         /*
         if (nbRows > 1) {
            papers[iGrid].text(cellSide / 2, (nbRows / 2) * cellSide, "y").attr({"font-size": 14});
         }
         papers[iGrid].text(2 * margin + (nbCols / 2) * cellSide, (nbRows + 1) * cellSide + cellSide / 2, "x").attr({"font-size": 14});
         */
      }
      fillGrid(0, data[level].targetGrid);
   }

   var displaySamples = function() {
      for (var iSample = 0; iSample < samples.length; iSample++) {
         var buttonText = "";
         var sample = samples[iSample];
         for (var iRect = 0; iRect < sample.length; iRect++) {
            var rect = sample[iRect];
            buttonText += "rectangle(" + rect.x1 + ", " + rect.y1 + ", " + rect.x2 + ", " + rect.y2 + ", " + rect.color + ")";
            if (iRect != sample.length - 1) {
               buttonText += "<br/>";
            }
         }
         $("#sample" + iSample).html(buttonText);
      }
   }

   var genGrid = function(rectangles) {
      var grid = [];
      for (var y = 0; y < nbRows; y++) {
         grid.push([]);
         for (var x = 0; x < nbCols; x++) {
            var color = 1;
            for (var iRect = 0; iRect < rectangles.length; iRect++) {
               var rect = rectangles[iRect];
               if ((x >= rect.x1) && (x <= rect.x2) && (y >= rect.y1) && (y <= rect.y2)) {
                  color = rect.color;
               }
            }
            grid[y].push(color);
         }
      }
      return grid;
   }

   var fillGrid = function(iGrid, grid) {
      for (var y = 0; y < nbRows; y++) {
         var iRow = nbRows - 1 - y;
         for (var x = 0; x < nbCols; x++) {
            var iCol = x;
            var color = "white";
            if (grid[iRow][iCol] == 0) {
               color = "black";
            }
            cells[iGrid][iRow][iCol].attr({"fill": color});
         }
      }
   }

   task.addRectangle = function(numRectangle) {
      var htmlRectangle = "<tr id='rectangle" + numRectangle + "'><td>rectangle(";
      for (var iParam = 0; iParam < 5; iParam++) {
         htmlRectangle += "<input id='param_" + numRectangle + "_" + iParam + "' onkeydown='task.resetSelectedProgram()' type='text' style='width:30px;text-align:center'/>";
         if (iParam != 4) {
            htmlRectangle += ", ";
         }
      }
      htmlRectangle += ")";
      $("#rectangles").html($("#rectangles").html() + htmlRectangle);
   };

   task.load = function(views, callback) {
      displayHelper.hideValidateButton = true;
      displayHelper.setupLevels();
      callback();
   };

   task.unload = function(callback) {
      callback();
   };

   checkRectangle = function(rectangle, iRect) {
      for (var iParam = 0; iParam < 5; iParam++) {
         var value = parseInt(rectangle[paramNames[iParam]]);
         if (isNaN(value)) {
            return taskStrings.paramInvalidAtInstr(iParam + 1, iRect + 1);
         }
      }
      if ((rectangle.color != 0) && (rectangle.color != 1)) {
         return taskStrings.param5Invalid(iRect + 1);
      }
      if (rectangle.x1 > rectangle.x2) {
         return taskStrings.leftAfterRight(iRect + 1);
      }
      if (rectangle.y1 > rectangle.y2) {
         return taskStrings.topBelowBottom(iRect + 1);
      }
      return "";
   }

   var getAnswerGridAndMessage = function(levelAnswer) {
      var validRectangles = [];
      var lastMessage = "";
      for (var iRect = 0; iRect < levelAnswer.length; iRect++) {
         var rectangle = levelAnswer[iRect];
         var message = checkRectangle(rectangle, iRect);
         if (message != "") {
            lastMessage = message;
            break;
         } else {
            validRectangles.push(rectangle);
         }
      }
      return {message: lastMessage, grid: genGrid(validRectangles)};
   }

   task.tryAnswer = function() {
      task.resetSelectedProgram();
      $("#rectangles").css("background-color", "#AAFFAA");
      var answer = task.getAnswerObject();
      var gridAndMessage = getAnswerGridAndMessage(answer[level]);
      fillGrid(1, gridAndMessage.grid);
      if (isGridSuccess(gridAndMessage.grid, level)) {
         platform.validate("done");
      } else {
         displayHelper.validate("stay");
      }
   };

   task.resetSelectedProgram = function() {
      $("#rectangles").css("background-color", "");
      $(".examples td").css("background-color", "");
      fillGrid(1, genGrid([]));
   }

   task.testSample = function(numSample) {
      task.resetSelectedProgram();
      $("#sample" + numSample).parent().css("background-color", "#AAFFAA");
      fillGrid(1, genGrid(samples[numSample]));
   };

   task.getDefaultStateObject = function() {
      return { level: "easy" };
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;
      if (display) {
         for (var iPaper = 0; iPaper < papers.length; iPaper++) {
            papers[iPaper].remove();
         }
         buildGrid();
         task.resetSelectedProgram();
         $("#rectangles").html("");
         $("#nbRectangles").html(data[level].nbRectangles);
         for (var iRect = 0; iRect < data[level].nbRectangles; iRect++) {
            task.addRectangle(iRect);
         }
         displaySamples();
      }
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      for (var iRect = 0; iRect < data[level].nbRectangles; iRect++) {
         var rectangle = {}
         if (answerObj[level][iRect] == undefined) {
            for (var iParam = 0; iParam < 5; iParam++) {
               rectangle[paramNames[iParam]] = "";
            }
         } else {
            rectangle = answerObj[level][iRect];
         }
         for (var iParam = 0; iParam < 5; iParam++) {
            $("#param_" + iRect + "_" + iParam).val(rectangle[paramNames[iParam]]);
         }
      }
   };

   task.getAnswerObject = function() {
      var rectangles = [];
      for (var iRect = 0; iRect < data[level].nbRectangles; iRect++) {
         var rectangle = {};
         for (var iParam = 0; iParam < 5; iParam++) {
            rectangle[paramNames[iParam]] = $.trim($("#param_" + iRect + "_" + iParam).val());
         }
         rectangles.push(rectangle);
      }
      answer[level] = rectangles;
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      return { easy: [], medium: [], hard: [] };
   };

   var isGridSuccess = function(grid, curLevel) {
      var success = true;
      var nbRows = data[curLevel].targetGrid.length;
      var nbCols = data[curLevel].targetGrid[0].length;
      for (var iRow = 0; iRow < nbRows; iRow++) {
         for (var iCol = 0; iCol < nbCols; iCol++) {
            if (data[curLevel].targetGrid[iRow][iCol] != grid[iRow][iCol]) {
               return false;
            }
         }
      }
      return true;
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
         var gridAndMessage = getAnswerGridAndMessage(answer[curLevel]);
         if (gridAndMessage.message != "") {
            messages[curLevel] = gridAndMessage.message;
            scores[curLevel] = 0;
         } else {
            var success = isGridSuccess(gridAndMessage.grid, curLevel);
            if (success) {
               messages[curLevel] = taskStrings.success;
               scores[curLevel] = maxScores[curLevel];
            } else {
               messages[curLevel] = taskStrings.failure;
               scores[curLevel] = 0;
            }
         }
      }

      if (gradedLevel == null) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}

initTask();