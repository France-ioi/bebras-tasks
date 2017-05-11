function initTask() {
   'use strict';
   var level;
   var state = null;
   var answer = null;
   var grid;
   var paper;
   var examplePaper;
   var data = {
      "easy": {
         table: [
            ["X", ".", ".", ".", "X"],
            [".", ".", ".", "X", "X"],
            ["X", "X", "0", ".", "."],
            ["X", ".", ".", ".", "."],
            ["X", ".", ".", "X", "X"]
            ],
         target: 2,
         given: 1
         },
      "medium": {
         table: [
            [".", ".", "X", ".", ".", ".", "."],
            [".", ".", "X", "X", ".", ".", "."],
            [".", ".", ".", ".", "X", ".", "."],
            [".", "X", ".", "0", ".", ".", "."],
            [".", "X", ".", ".", ".", ".", "."],
            [".", ".", ".", "X", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", "."]
            ],
         target: 5,
         given: 4
         },
      "hard": {
         table: [
            [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
            [".", "X", ".", ".", ".", ".", "X", ".", ".", "."],
            [".", "X", ".", "X", ".", "X", ".", ".", ".", "."],
            [".", "X", ".", "X", ".", ".", "X", "X", ".", "."],
            [".", ".", "X", ".", ".", "0", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", "X", "X", ".", ".", "X", ".", "."],
            [".", ".", ".", ".", "X", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", "X", ".", ".", "."],
            [".", ".", ".", ".", ".", "X", ".", ".", ".", "."]
            ],
         target: 7,
         given: 5
         }
   };
   var exampleData = {
      easy: {
         table: [
            ["X", ".", "X", "X", "X"],
            ["X", ".", "X", ".", "."],
            [".", ".", "0", ".", "."],
            [".", "X", "X", ".", "."],
            [".", ".", "X", "X", "."]
            ],
         given: 1,
         target: 2
      },
      medium: {
         table: [
            [".", ".", ".", ".", "."],
            ["X", ".", "X", ".", "."],
            [".", ".", ".", ".", "."],
            [".", "X", "X", ".", "."],
            ["0", ".", ".", ".", "."]
            ],
         given: 4,
         target: 5
      },
      hard: {
         table: [
            [".", ".", ".", "X", "."],
            ["X", ".", ".", ".", "."],
            [".", "X", ".", ".", "X"],
            [".", ".", ".", ".", "."],
            ["0", "X", ".", "X", "."]
            ],
         given: 5,
         target: 7
      }
   };
   var exampleGrid;
   var solutionClickCounts = {};
   var steps = [[1, 0], [-1, 0], [0, 1], [0, -1]];
   var cellSide = 50;
   var exampleCellSide = 30;
   var commonBackground = "#555555"; // "#808080";
   var lineAttr = {'stroke-width': 1, 'stroke': commonBackground };
   var margin = 5;// 10;
   var zeroColor = "#829EED";
   var markColor = "#4BFC05";
   var textAttr = {"font-size": 24}; // , "font-weight": "bold"
   var textExampleAttrExtra = {"font-size": 17, "font-weight": "normal"};
   var crossAttr = {"stroke-width": 4, "stroke": "#831313"};
   var crossExampleAttrExtra = {"stroke-width": 3};
   var crossPadding = 4;
   var beaverImage = "castor_tete.png";
   var beaverCellScale = 0.75;
   var wrongRectAttr = {"stroke-width": 5, "stroke": "blue"};
   var wrongRectPadding = 4;
   var wrongCell = null;


   task.load = function(views, callback) {
      initSolutionClicks();
      initData();
      initHandlers();

      displayHelper.hideValidateButton = true;
      displayHelper.setupLevels();

      if (views.solutions) {
         $("#solutions").show();
      }

      callback();
   };

   task.getDefaultStateObject = function() {
      return {level: "easy"};
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;

      if (display) {
         initGrid();
         initExample(level);
      }
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      updateDisplay();
   };

   task.getAnswerObject = function() {
      return answer;
   };

   task.getEmptyGrid = function(level) {
      return Beav.Matrix.map(data[level].table, function() { return false; });
      /*
      var table = data[level].table;
      var result = [];
      for (var iRow = 0; iRow < table.length; iRow++) {
        result.push([]);
        for (var iCol = 0; iCol < table[0].length; iCol++) {
           result[iRow].push(false);
        }
      }
      return result;
      */
   };

   task.getDefaultAnswerObject = function() {
      var answer = {};
      for (var level in data) {
         answer[level] = task.getEmptyGrid(level);
      }
      return answer;
   };

   var initSolutionClicks = function() {
      for (var level in data) {
         var table = data[level].table;
         var target = data[level].target;
         var solution = solveBFS(table);
         solutionClickCounts[level] = 0;
         for (var iRow = 0; iRow < table.length; iRow++) {
            for (var iCol = 0; iCol < table[0].length; iCol++) {
               if (solution[iRow][iCol] == target) {
                  solutionClickCounts[level]++;
               }
            }
         }
      }
   };

   var initData = function() {
      for (var level in data) {
         var table = data[level].table;
         var given = data[level].given;
         var solution = solveBFS(table);

         for (var iRow = 0; iRow < table.length; iRow++) {
            for (var iCol = 0; iCol < table[0].length; iCol++) {
               if (solution[iRow][iCol] == given) {
                  table[iRow][iCol] = given;
               }
            }
         }
      }
   };

   var initGrid = function() {
      if (grid) {
         grid.remove();
         paper.remove();
      }
      $("#feedback").html("");
      var paperSide = cellSide * data[level].table.length + 2 * margin;
      paper = new Raphael("grid", paperSide, paperSide);
      paper.rect(margin, margin, data[level].table.length*cellSide, data[level].table[0].length*cellSide).attr({"fill": "white", "stroke": commonBackground}).toBack();
      paper.rect(0, 0, paperSide, paperSide).attr({"stroke": commonBackground, "fill": commonBackground}).toBack();
      grid = Grid.fromArray("grid", paper, data[level].table, cellFiller, cellSide, cellSide, margin, margin, lineAttr);
      grid.clickCell(cellClickHandler);
   };

   var initExample = function(level) {
      var exampleCellFiller = function(data, paper) {
         if (data.entry == exampleData[level].target) {
            data.mark = true;
         } else if ((data.entry != "0") && (data.entry != "X") && (data.entry != exampleData[level].given)) {
            data.entry = ".";
         }
         return cellFiller(data, paper);
      };

      if (exampleGrid) {
         exampleGrid.remove();
         examplePaper.remove();
      }
      // LATER: avoid copy-paste;
      var exampleMargin = margin * exampleCellSide / cellSide;
      var exampleSide = exampleCellSide * exampleData[level].table.length + 2 * exampleMargin;
      examplePaper = new Raphael("example_grid", exampleSide, exampleSide);
      examplePaper.rect(exampleMargin, exampleMargin, exampleData[level].table.length*exampleCellSide, exampleData[level].table[0].length*exampleCellSide).attr({"fill": "white", "stroke": commonBackground}).toBack();
      examplePaper.rect(0, 0, exampleSide, exampleSide).attr({"stroke": commonBackground, "fill": commonBackground}).toBack();

      exampleGrid = Grid.fromArray("example_grid", examplePaper, solveBFS(exampleData[level].table), exampleCellFiller, exampleCellSide, exampleCellSide, exampleMargin, exampleMargin, lineAttr);
   };

   var initHandlers = function() {
      $("#execute").click(clickExecute);
   };

   var clickExecute = function() {
      $("#feedback").html("");
      var mistakes = countMistakes(answer[level], level);
      if (mistakes.mistakesCount === 0) {
         platform.validate("done", function() {});
         return;
      }
      if (level == "hard" && mistakes.mistakesCount <= 2) {
         platform.validate("stay", function() {});
         return;
      }
      if (level == "easy" || level == "medium") {
        var msg = "";
        if (mistakes.wrongCount > 0) {
           highlightWrong(mistakes.wrong[0], mistakes.wrong[1]);
           msg = taskStrings.incorrectExplain;
        } else { // (mistakes.missingCount > 0)
           msg = taskStrings.missingExplain;
        }
        $("#feedback").html(msg);
      }
      displayHelper.validate("stay");
   };

   var highlightWrong = function(row, col) {
      wrongCell = [row, col];
      var data = {
         row: row,
         col: col,
         wrong: true
      };
      grid.addToCell(cellFiller, data);
   };

   var cellFiller = function(data, paper) {
      if (data.entry == ".") {
         return;
      }

      if (data.entry == "X") {
         return drawObstacle(paper, data);
      }

      if (data.entry == "0") {
         return [drawBeaver(paper, data)];
      }

      if (data.mark) {
         return drawFillAndText(paper, data, markColor);
      }

      if(data.wrong) {
         return [drawWrongRect(paper, data)];
      }

      return [drawTextCell(paper, data)];
   };

   var drawFilledCell = function(paper, data, color) {
      var rect = paper.rect(data.xPos, data.yPos, data.cellWidth, data.cellHeight);
      rect.attr(lineAttr);
      rect.attr({
         "fill": color
      });
      return rect;
   };

   var drawTextCell = function(paper, data) {
      var paperText = paper.text(data.xPos + data.cellWidth / 2, data.yPos + data.cellHeight / 2, data.entry);
      paperText.attr(textAttr);
      if (paper == examplePaper) {
         paperText.attr(textExampleAttrExtra); 
      }
      paperText[0].style.cursor = "default";
      return paperText;
   };

   var drawFillAndText = function(paper, data, color) {
      return [drawFilledCell(paper, data, color), drawTextCell(paper, data)];
   };

   var drawObstacle = function(paper, data) {
      var cellFill = drawFilledCell(paper, data, commonBackground);
      return [cellFill];

      /*------- black background with red cross
      var obstacleBackground = "black";
      var cellFill = drawFilledCell(paper, data, obstacleBackground);
      var cellCross1 = paper.path(["M", data.xPos + crossPadding, data.yPos + crossPadding, "L", data.xPos + data.cellWidth - crossPadding, data.yPos + data.cellHeight - crossPadding]);
      var cellCross2 = paper.path(["M", data.xPos + data.cellWidth - crossPadding, data.yPos + crossPadding, "L", data.xPos + crossPadding, data.yPos + data.cellHeight - crossPadding]);
      cellCross1.attr(crossAttr);
      cellCross2.attr(crossAttr);
      if (paper == examplePaper) {
        var exampleCrossAttr = (crossExampleAttrExtra);
        cellCross1.attr(exampleCrossAttr);
        cellCross2.attr(exampleCrossAttr);
      }
      return [cellFill, cellCross1, cellCross2];
      -------*/
      
      /*------- mountain image
      // image source: https://commons.wikimedia.org/wiki/File:Mountain_icon_(Noun_Project).svg
      var mountain = paper.path("M 72.55,34.283 65.53,48.321 48.987,15.026 25.436,62.129 19.55,50.283 2.191,85 14,85 36.8,85 47.191,85 83.755,85    97.75,85   z").attr({parent: 'Your_Icon','stroke-width': '0','stroke-opacity': '1','fill': '#000000'}).transform("s0.45, 0.45, 23, 30");
      if (paper == examplePaper) {
         mountain.transform("s0.25, 0.25, 18, 18");
      }
         // does not work:
         // mountain.transform("t" + (data.xPos + crossPadding) + "," + (data.yPos + crossPadding));
      return [mountain];
      -------*/
   };

   var drawBeaver = function(paper, data) {
      var width = data.cellWidth * beaverCellScale;
      var height = data.cellHeight * beaverCellScale;
      var xPos = data.xPos + data.cellWidth / 2 - width / 2;
      var yPos = data.yPos + data.cellHeight / 2 - height / 2;
      return paper.image(beaverImage, xPos, yPos, width, height);
   };

   var drawWrongRect = function(paper, data) {
      var xPos = data.xPos + wrongRectPadding;
      var yPos = data.yPos + wrongRectPadding;
      var width = data.cellWidth - 2 * wrongRectPadding;
      var height = data.cellHeight - 2 * wrongRectPadding;
      return paper.rect(xPos, yPos, width, height).attr(wrongRectAttr);
   };

   var cellClickHandler = function(event) {
      displayHelper.stopShowingResult();
      $("#feedback").html("");
      if(wrongCell) {
         grid.popFromCell(wrongCell[0], wrongCell[1]);
         wrongCell = null;
      }
      var row = event.data.row;
      var col = event.data.col;

      if (data[level].table[row][col] != ".") {
         return;
      }
      answer[level][row][col] = !(answer[level][row][col]);
      updateCellDisplay(row, col);
   };

   var updateDisplay = function() {
      var table = data[level].table;
      for (var iRow = 0; iRow < table.length; iRow++) {
         for (var iCol = 0; iCol < table[0].length; iCol++) {
            updateCellDisplay(iRow, iCol);
         }
      }
   };

   var updateCellDisplay = function(row, col) {
      if (data[level].table[row][col] != ".") {
         return;
      }

      if (!answer[level][row][col]) {
         grid.clearCell(row, col);
         return;
      }

      grid.setCell(cellFiller, {
         row: row,
         col: col,
         entry: data[level].target,
         mark: true
      });
   };

   var solveBFS = function(table) {
      var entry;
      var solutions = [];
      var queue = [];

      for (var iRow = 0; iRow < table.length; iRow++) {
         solutions.push([]);
         for (var iCol = 0; iCol < table[iRow].length; iCol++) {
            entry = table[iRow][iCol];
            if (entry == "0") {
               queue.push({
                  row: iRow,
                  col: iCol,
                  distance: 0
               });
            }
            if (entry != "X") {
               entry = ".";
            }
            solutions[iRow].push(entry);
         }
      }

      while (queue.length > 0) {
         var current = queue.shift();
         entry = solutions[current.row][current.col];
         var distance = current.distance;

         if (entry != ".") {
            continue;
         }

         solutions[current.row][current.col] = distance;

         for (var iStep = 0; iStep < steps.length; iStep++) {
            var step = steps[iStep];
            var newRow = step[1] + current.row;
            var newCol = step[0] + current.col;

            if (newRow < 0 || newRow >= solutions.length || newCol < 0 || newCol >= solutions[0].length) {
               continue;
            }

            queue.push({
               row: newRow,
               col: newCol,
               distance: (distance + 1)
            });
         }
      }

      return solutions;
   };

   var countMistakes = function(table, level) {
      var solution = solveBFS(data[level].table);
      var target = data[level].target;
      var wrongCount = 0;
      var missingCount = 0;
      var wrong, missing;

      for (var iRow = 0; iRow < table.length; iRow++) {
         for (var iCol = 0; iCol < table[0].length; iCol++) {
            if (solution[iRow][iCol] == target && !(table[iRow][iCol])) {
               missingCount++;
               missing = [iRow, iCol];
            }
            if (solution[iRow][iCol] != target && table[iRow][iCol]) {
               wrongCount++;
               wrong = [iRow, iCol];
            }
         }
      }
      return {
         wrongCount: wrongCount,
         missingCount: missingCount,
         mistakesCount: wrongCount + missingCount,
         wrong: wrong,
         missing: missing
      };
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
      // clone the state to restore after grading.
      var oldState = $.extend({}, task.getStateObject());
      for (var curLevel in data) {
         state.level = curLevel;
         task.reloadStateObject(state, false);

         var mistakes = countMistakes(answer[curLevel], curLevel);
         var solutionClicks = solutionClickCounts[curLevel];
      
         var relativeScore = 0.0;
         if (mistakes.mistakesCount === 0) {
            relativeScore = 1.0;
            messages[curLevel] = taskStrings.success;
         } else if (curLevel == "hard" && mistakes.mistakesCount <= 2) {
            relativeScore = 0.5;
            messages[curLevel] = taskStrings.incorrect;
         } else {
            relativeScore = 0.0;
            // if (curLevel == "hard") 
            messages[curLevel] = taskStrings.incorrect;
         }
         scores[curLevel] = levelScoreInterpolate(maxScores, curLevel, relativeScore);
      }

      task.reloadStateObject(oldState, false);
      if (!gradedLevel) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}
initTask();

