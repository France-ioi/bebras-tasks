function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;

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
         given: 1,
         example: {
               table: [
                  ["X", ".", "X", "X", "X"],
                  ["X", ".", "X", ".", "."],
                  [".", ".", "0", ".", "."],
                  [".", "X", "X", ".", "."],
                  [".", ".", "X", "X", "."]
                  ],
               given: 1,
               target: 2
            }
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
         given: 4,
         example: { 
               table: [
                  [".", ".", ".", ".", "."],
                  ["X", ".", "X", ".", "."],
                  [".", ".", ".", ".", "."],
                  [".", "X", "X", ".", "."],
                  ["0", ".", ".", ".", "."]
                  ],
               given: 4,
               target: 5
            }
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
         given: 5,
         example: {
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
         }
   };
   var grid;
   var paper;
   var examplePaper;
   var exampleData;
   var exampleGrid;
   var table;
   var target;
   var solutionClickCounts;
   var steps = [[1, 0], [-1, 0], [0, 1], [0, -1]];
   var cellSide = 50;
   var exampleCellSide = 30;
   var commonBackground = "#555555";
   var lineAttr = {'stroke-width': 1, 'stroke': commonBackground };
   var margin = 5;// 10;
   var zeroColor = "#829EED";
   var markColor = "#4BFC05";
   var textAttr = {"font-size": 24}; 
   var textExampleAttrExtra = {"font-size": 17, "font-weight": "normal"};
   var crossAttr = {"stroke-width": 4, "stroke": "#831313"};
   var crossExampleAttrExtra = {"stroke-width": 3};
   var crossPadding = 4;
   var beaverImage = "castor_tete.png";
   var beaverCellScale = 0.75;
   var wrongRectAttr = {"stroke-width": 5, "stroke": "blue"};
   var wrongRectPadding = 4;
   var wrongCell = null;

   
   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      exampleData = data[level].example;
      table = data[level].table;
      target = data[level].target;
      initData();
      initSolutionClicks();
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function () {
      initGrid();
      initExample();
      initHandlers();
      updateDisplay();

      displayHelper.hideValidateButton = true;
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = Beav.Matrix.map(table, function() { return false; });
      return defaultAnswer;
   };


   function getResultAndMessage() {
      var result = checkResult(true);
      return result;
   }

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   var initData = function() {
      var given = data[level].given;
      var solution = solveBFS(table);

      for (var iRow = 0; iRow < table.length; iRow++) {
         for (var iCol = 0; iCol < table[0].length; iCol++) {
            if (solution[iRow][iCol] == given) {
               table[iRow][iCol] = given;
            }
         }
      }
   };

   var initExample = function(level) {
      var exampleCellFiller = function(data, paper) {
         if (data.entry == exampleData.target) {
            data.mark = true;
         } else if ((data.entry != "0") && (data.entry != "X") && (data.entry != exampleData.given)) {
            data.entry = ".";
         }
         return cellFiller(data, paper);
      };

      if (exampleGrid) {
         exampleGrid.remove();
      }
      // LATER: avoid copy-paste;
      var exampleMargin = margin * exampleCellSide / cellSide;
      var exampleSide = exampleCellSide * exampleData.table.length + 2 * exampleMargin;
      examplePaper = subTask.raphaelFactory.create("example_grid","example_grid",exampleSide,exampleSide);
      examplePaper.rect(exampleMargin, exampleMargin, exampleData.table.length*exampleCellSide, exampleData.table[0].length*exampleCellSide).attr({"fill": "white", "stroke": commonBackground}).toBack();
      examplePaper.rect(0, 0, exampleSide, exampleSide).attr({"stroke": commonBackground, "fill": commonBackground}).toBack();

      exampleGrid = Grid.fromArray("example_grid", examplePaper, solveBFS(exampleData.table), exampleCellFiller, exampleCellSide, exampleCellSide, exampleMargin, exampleMargin, lineAttr);
      $("#example_container").css({
         width: exampleSide + 26
      });
   };

   var initGrid = function() {
      if (grid) {
         grid.remove();
      }
      $("#feedback").html("");
      var paperSide = cellSide * table.length + 2 * margin;
      paper = subTask.raphaelFactory.create("grid","grid",paperSide,paperSide);
      $("#grid").css("width",paperSide);
      paper.rect(margin, margin, table.length*cellSide, table[0].length*cellSide).attr({"fill": "white", "stroke": commonBackground}).toBack();
      paper.rect(0, 0, paperSide, paperSide).attr({"stroke": commonBackground, "fill": commonBackground}).toBack();
      grid = Grid.fromArray("grid", paper, table, cellFiller, cellSide, cellSide, margin, margin, lineAttr);
      grid.clickCell(cellClickHandler);
   };

   var initSolutionClicks = function() {
      var target = data[level].target;
      var solution = solveBFS(table);
      solutionClickCounts = 0;
      for (var iRow = 0; iRow < table.length; iRow++) {
         for (var iCol = 0; iCol < table[0].length; iCol++) {
            if (solution[iRow][iCol] == target) {
               solutionClickCounts++;
            }
         }
      }
   };

   var initHandlers = function() {
      $("#execute").off("click");
      $("#execute").click(function() {
         checkResult(false)
      });
   };

   var checkResult = function(noVisual) {
      if(!noVisual){
         $("#feedback").html("");
      }
      var mistakes = countMistakes(answer);

      if (mistakes.mistakesCount === 0) {
         var msg = taskStrings.success;
         if(!noVisual){
            platform.validate("done");
         }
         return { successRate: 1, message: msg };
      }else if(level == "hard" && mistakes.mistakesCount <= 2){
         var msg = taskStrings.incorrect;
         if(!noVisual){
            platform.validate("stay");
         }
         return { successRate: 0.5, message: msg };
      }
               
         var msg = "";

      if (level == "easy" || level == "medium") {
         if (mistakes.wrongCount > 0) {
            if(!noVisual){
               highlightWrong(mistakes.wrong[0], mistakes.wrong[1]);
            }
            msg = taskStrings.incorrectExplain;
         } else { // (mistakes.missingCount > 0)
            msg = taskStrings.missingExplain;
         }
      }else{
         msg = taskStrings.incorrect;
      }
      if(!noVisual){
         $("#feedback").html(msg);
      }
      return { successRate: 0, message: msg }
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

      if (table[row][col] != ".") {
         return;
      }
      answer[row][col] = !(answer[row][col]);
      updateCellDisplay(row, col);
   };

   var updateDisplay = function() {
      for (var iRow = 0; iRow < table.length; iRow++) {
         for (var iCol = 0; iCol < table[0].length; iCol++) {
            updateCellDisplay(iRow, iCol);
         }
      }
   };

   var updateCellDisplay = function(row, col) {
      if (table[row][col] != ".") {
         return;
      }

      if (!answer[row][col]) {
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

   var countMistakes = function() {
      var solution = solveBFS(table);
      var wrongCount = 0;
      var missingCount = 0;
      var wrong, missing;
      for (var iRow = 0; iRow < answer.length; iRow++) {
         for (var iCol = 0; iCol < answer[0].length; iCol++) {
            if (solution[iRow][iCol] == target && !(answer[iRow][iCol])) {
               missingCount++;
               missing = [iRow, iCol];
            }
            if (solution[iRow][iCol] != target && answer[iRow][iCol]) {
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
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();

