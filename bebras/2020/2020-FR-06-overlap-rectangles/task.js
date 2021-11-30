   function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         target: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
            [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
         ],
         limit: 2
      },
      medium: {
         target: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
            [0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
         ],
         limit: 5
      },
      hard: {
         target: [
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
            [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
         ],
         limit: 10
      }
   };

   var paper;
   var paperW = 770;

   var marginX = 20;
   var marginXColors = 0;
   var marginY = 20;
   var cellW = 28;
   var cellH = cellW;
   var xGrid;
   var yGrid = marginY;
   var dragThreshold = 10;
   var cellXPad = 1;
   var cellYPad = 1;
   var selectionMargins = {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
   };
   var circleR = 5;
   var rectW = cellW - 2*cellXPad;
   var rectH = cellH - 2*cellYPad;
   var colorRectW = 0;//50;
   var colorRectH = 30;
   var undoButtonW = 160;
   var undoButtonH = 35;
   var xUndo = paperW/2 + marginX;
   var yUndo, yCounter;
   var xCounter = paperW/2 - marginX;
   if (typeof enableRtl != 'undefined') {
      xCounter -= 200;
   }
   var iconSize = 15;

   var rng;
   var target;
   var nbRows, nbCol;
   var limit;

   var userGrid;
   var virtualGrid = null;
   var wrongRow;
   var wrongCol;
   var colorRect = [];
   var undoButton, counter;
   var showRedCross = false;

   var clickCounter;
   var clicksUntilPopup = 1;

   var undoSrc = $("#undo").attr("src");
   var crossSrc = $("#cross").attr("src");

   var colors = {
      yellow: "#f5a623",
      black: "#4a4a4a",
      blue: "#4a90e2"
   };
   var lineAttr = {
      stroke: "#baa15a",
      "stroke-width": 1
   };
   var selectionBoxAttr = {
      stroke: "#203f67",
      "stroke-width": 5
   };
   var circleAttr = {
      stroke: "#333",
      "stroke-width": 2,
      fill: "#333",
      r: circleR
   };
   var rectAttr = [
      {
         "fill": "#f7dd9b",
         "fill-opacity": 0.7,
         "stroke-opacity": 0,
         width: rectW,
         height: rectH
      },
      {
         "fill": "#4c72d6",
         "fill-opacity": 0.9,
         "stroke-opacity": 0,
         width: rectW,
         height: rectH
      }
   ];
   var colorRectAttr = [
      {
         fill: "white",
         width: colorRectW,
         height: colorRectH,
         r: 5
      },
      {
         fill: "black",
         width: colorRectW,
         height: colorRectH,
         r: 5
      }
   ];

   var selectedColorAttr = {
      stroke: colors.yellow,
      "stroke-width": 4
   };
   var unselectedColorAttr = {
      stroke: colors.black,
      "stroke-width": 1
   };
   var wrongAttr = {
      "stroke": "#CC0000",
      "stroke-width": 4
   };
   var titleAttr = {
      "font-size": 14,
      "font-weight": "bold",
      fill: colors.black
   };
   var undoButtonAttr = {
      stroke: "none",
      fill: colors.blue,
      width: undoButtonW,
      height: undoButtonH,
      r: undoButtonH/2
   };
   var buttonTextAttr = {
      "font-size": 13,
      "font-weight": "bold",
      fill: "white"
   };
   var counterAttr = {
      "font-size": 16,
      "font-weight": "bold",
      fill: colors.black,
      "text-anchor": "end"
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      rng = new RandomGenerator(subTask.taskParams.randomSeed + level.charCodeAt(0));
      target = randomMirror(data[level].target);
      limit = data[level].limit;
      nbRows = target.length;
      nbCol = target[0].length;
      yUndo = yGrid + nbRows*cellH + marginY;
      yCounter = yUndo + undoButtonH/2;
      paperH = yUndo + undoButtonH + marginY;
      xGrid = (paperW - nbCol*cellW - (marginXColors+colorRectW))/2;

      $('#textLimit').html(limit);
      virtualGrid = Beav.Matrix.make(nbRows, nbCol, 0);
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      rng.reset(answer.seed);
   };

   subTask.resetDisplay = function() {
      displayError("");
      initPaper();
      initCounter();
      initHandlers();
      updateSteps();
      updateUserGridStatus();
      updateGrid();
      displayHelper.customValidate = checkResult;
      if (typeof(enableRtl) != "undefined") {
         $("body").attr("dir", "rtl");
         $(".largeScreen #zone_1").css("float", "right");
         $(".largeScreen #zone_2").css("float", "right");
      }
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = {
         seed: rng.nextInt(0,1000),
         history: []
      };

      return defaultAnswer;
   };

   var getResultAndMessage = function() {
      var result = checkResult(true);
      return result
   };

   subTask.unloadLevel = function(callback) {
      $("#undo").unbind("click");
      callback();
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function randomMirror(grid) {
      var horAxisSym = rng.nextBit();
      var vertAxisSym = rng.nextBit();
      var nbRows = grid.length;
      var nbCol = grid[0].length;
      var res = JSON.parse(JSON.stringify(grid));
      if(horAxisSym){
         var newGrid = [];
         for(var iRow = 0; iRow < nbRows; iRow++){
            newGrid[iRow] = res[nbRows - 1 - iRow].slice();
         }
         res = JSON.parse(JSON.stringify(newGrid));
      }
      if(vertAxisSym){
         var newGrid = [];
         for(var iRow = 0; iRow < nbRows; iRow++){
            newGrid[iRow] = [];
            for(var iCol = 0; iCol < nbCol; iCol++){
               newGrid[iRow][iCol] = res[iRow][nbCol - 1 - iCol];
            }
         }
         res = JSON.parse(JSON.stringify(newGrid));
      }
      return res
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper", "paper", paperW, paperH);
      userGrid = Grid.fromArray("paper", paper, virtualGrid, userCellFiller, cellW, cellH, xGrid, yGrid, lineAttr);

      $("#zone_2").css("position","relative");
      $("#zone_2").css("padding-top","1px");
      var y0 = 16;
      for(var iOver = 1; iOver <= 5; iOver++){
         var id = "overlay_"+iOver;
         var y = (iOver != 3 && iOver != 5) ? y0 : yGrid + y0 + nbRows*cellH;
         var x,w,h;
         switch(iOver) {
            case 1:
               x = 0;
               w = paperW;
               h = yGrid;
               break;
            case 2:
               x = xGrid + nbCol*cellW;
               w = paperW - x;
               h = yGrid + nbRows*cellH;
               break;
            case 3:
               x = 0;
               w = xUndo;
               h = paperH - y;
               break;
            case 4:
               x = 0;
               w = xGrid;
               h = yGrid + nbRows*cellH;
               break;
            case 5:
               x = xUndo + undoButtonW;
               w = paperW - x;
               h = paperH - y;
         }
         $("#"+id).css({
            position: "absolute",
            top: y,
            left: x,
            width: w,
            height: h,
            background: "red",
            opacity: 0
         });
      }
   };

   function initCounter() {
      var rect = paper.rect(xUndo,yUndo).attr(undoButtonAttr);
      var xIcon = xUndo + 20;
      var yIcon = yUndo + (undoButtonH - iconSize)/2;
      var icon = paper.image(undoSrc,xIcon,yIcon,iconSize,iconSize);
      var xText = xUndo + undoButtonW/2 + 10;
      var yText = yCounter;
      var text = taskStrings.undo.toUpperCase();
      var textRaph = paper.text(xText,yText,text).attr(buttonTextAttr);
      undoButton = paper.set(rect,icon,textRaph);

      counter = paper.text(xCounter,yCounter,taskStrings.steps(answer.history.length,limit)).attr(counterAttr);
   };

   var initHandlers = function() {
      updateUndo();

      userGrid.enableDragSelection(onMouseDown, null, onMouseUp, onGridSelectionChange, selectionBoxAttr, selectionMargins, dragThreshold);
   };

   var clickUndo = function() {
      displayError("");
      if(answer.history.length == 0) {
         return;
      }
      answer.history.pop();
      updateGrid();
      updateUndo();
      updateSteps();
      updateUserGridStatus();
   };

   function updateUndo() {
      if(answer.history.length > 0) {
         undoButton.unclick();
         undoButton.click(clickUndo);
         undoButton.attr("cursor","pointer");
         undoButton[0].attr("opacity",1);
      } else {
         undoButton.unclick();
         undoButton.attr("cursor","auto");
         undoButton[0].attr("opacity",0.5);
      }
   };

   var updateSteps = function() {
      counter.attr("text",taskStrings.steps(answer.history.length,limit));
   };

   var updateUserGridStatus = function() {
      var max = (level =="easy") ? limit : limit + 2;
      if(answer.history.length >= max) {
         userGrid.disableDragSelection();
         clickCounter = 0;
         userGrid.clickCell(onMoveLimit);
      }else{
         userGrid.enableDragSelection(onMouseDown, null, onMouseUp, onGridSelectionChange, selectionBoxAttr, selectionMargins, dragThreshold);
         userGrid.unclickCell();
         displayError("");
      }
   };

   var onMoveLimit = function() {
      if(clickCounter == 0){
         var res = checkResult(true);
         if(res.successRate != 1){
            displayError(taskStrings.moveLimit);
         }
      }
      if(clickCounter >= clicksUntilPopup) {
         displayHelper.showPopupMessage(taskStrings.moveLimit, "blanket");
      }
      clickCounter++;
   };

   var onMouseDown = function() {
      displayError("");
      unhighlightWrong();
   };

   var onMouseUp = function(event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos) {
      if(currentGridPos == null) {
         drawVirtualGrid();
         displayError(taskStrings.drag);
         return;
      }
      var rectangle = positionPairToRectangle(anchorGridPos, currentGridPos);
      if(rectangle === null) {
         return;
      }
      if (rectangleIsRedundant(rectangle)) {
         return;
      }
      addRectToVirtualGrid(rectangle);
      drawVirtualGrid();

      // answer.history.push(JSON.parse(JSON.stringify(virtualGrid)));
      answer.history.push(rectangle);

      updateSteps();
      updateUserGridStatus();
      updateUndo();
      if(showRedCross){
         displayError(taskStrings.cross,true);
      }
   };

   // Cache for colors during rectangle creation
   var currentGridColors = [];

   var onGridSelectionChange = function(dx, dy, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos) {
      var rectangle = positionPairToRectangle(anchorGridPos, currentGridPos);
      var cellColor;
      for(var row = 0; row < nbRows; row++) {
         var vGridRow = virtualGrid[row];
         if(!currentGridColors[row]) {
            currentGridColors[row] = [];
         }
         var cGridRow = currentGridColors[row];
         for(var col = 0; col < nbCol; col++) {
            var currentColor = cGridRow[col];
            cellColor = vGridRow[col];
            if(rectangle != null) {
               if((row == rectangle.top || row == rectangle.bottom ||
                  col == rectangle.left || col == rectangle.right) &&
                  row >= rectangle.top && row <= rectangle.bottom && col <= rectangle.right && col >= rectangle.left) {
                  // cellColor = answer.color;
                  cellColor = 1;
               }
            }
            if(currentColor != cellColor) {
               userGrid.getCell(row, col)[0].attr(rectAttr[cellColor]);
            }
            cGridRow[col] = cellColor;
         }
      }
   };

   var positionPairToRectangle = function(position1, position2) {
      if(!position1 || !position2) {
         return null;
      }
      if ((position1.row == position2.row) || (position1.col == position2.col)) {
         return null;
      }
      result = {
         top: Math.min(position1.row, position2.row),
         bottom: Math.max(position1.row, position2.row),
         left: Math.min(position1.col, position2.col),
         right: Math.max(position1.col, position2.col)
      };
      if(result.bottom < 0 || result.top >= nbRows) {
         return null;
      }
      if(result.right < 0 || result.left >= nbCol) {
         return null;
      }
      result.top = Math.min(nbRows - 1, Math.max(result.top, 0));
      result.bottom = Math.min(nbRows - 1, Math.max(result.bottom, 0));
      result.left = Math.min(nbCol - 1, Math.max(result.left, 0));
      result.right = Math.min(nbCol - 1, Math.max(result.right, 0));
      return result;
   };

   var cellFiller = function(cellData, paper, array) {
      var dataEntry = array[cellData.row][cellData.col];
      var x = cellData.xPos + cellXPad;
      var y = cellData.yPos + cellYPad;
      var w = cellW - 2*cellXPad;
      var h = cellH - 2*cellYPad;

      var elems = [];
      var rect = paper.rect(x, y, w, h).attr(rectAttr[dataEntry]);
      elems.push(rect);

      var cross = paper.image(crossSrc,x,y,w,h);
      elems.push(cross);
      if(!cellData.cross){
         cross.hide();
      }

      if(target[cellData.row][cellData.col]){
         var circle = paper.circle(x + w/2, y + h/2).attr(circleAttr);
         elems.push(circle);
      }

      rect.toFront();
      cross.toFront();

      // Elements must be : rect, cross, circle (if present), the first two are
      // modified directly in the code
      return elems;
   };

   var userCellFiller = function(cellData, paper) {
      return cellFiller(cellData, paper, virtualGrid);
   };

   var updateGrid = function(noVisual) {
      virtualGrid = Beav.Matrix.make(nbRows, nbCol, 0);
      for(var iRect = 0; iRect < answer.history.length; iRect++){
         var rect = answer.history[iRect];
         addRectToVirtualGrid(rect);
      }
      // virtualGrid = JSON.parse(JSON.stringify(answer.history[answer.history.length - 1]));
      if(!noVisual){
         drawVirtualGrid();
      }
   };

   var drawVirtualGrid = function(rectangle) {
      if(!rectangle) {
         rectangle = {
            top: 0,
            bottom: nbRows - 1,
            left: 0,
            right: nbCol - 1
         };
      }
      var minRow = Math.max(0, rectangle.top);
      var maxRow = Math.min(nbRows - 1, rectangle.bottom);
      var minCol = Math.max(0, rectangle.left);
      var maxCol = Math.min(nbCol - 1, rectangle.right);

      showRedCross = false;
      for(var row = minRow; row <= maxRow; row++) {
         for(var col = minCol; col <= maxCol; col++) {
            var cell = userGrid.getCell(row, col);
            cell[0].attr(rectAttr[virtualGrid[row][col]]);

            var cross = virtualGrid[row][col] && !target[row][col];
            showRedCross = cross || showRedCross;

            if(cross) {
               cell[1].show();
            } else {
               cell[1].hide();
            }
         }
      }
   };

   var rectangleIsRedundant = function(rectangle) {
      for(var row = rectangle.top; row <= rectangle.bottom; row++) {
         for(var col = rectangle.left; col <= rectangle.right; col++) {
            if (row == rectangle.top || row == rectangle.bottom ||
                col == rectangle.left || col == rectangle.right) {
                   if (virtualGrid[row][col] != 1) {
                      return false;
                   }
            }
         }
      }
      return true;
   };

   var addRectToVirtualGrid = function(rectangle) {
      for(var row = rectangle.top; row <= rectangle.bottom; row++) {
         for(var col = rectangle.left; col <= rectangle.right; col++) {
            if (row == rectangle.top || row == rectangle.bottom ||
                col == rectangle.left || col == rectangle.right) {
               virtualGrid[row][col] = 1;
            }
         }
      }
   };

   function checkResult(noVisual) {
      if(!noVisual){
         displayError("");
         unhighlightWrong();
      }
      // var currGrid = answer.history[answer.history.length - 1];
      updateGrid(true);
      for(var row = 0; row < nbRows; row++) {
         for(var col = 0; col < nbCol; col++) {
            if(target[row][col] !== virtualGrid[row][col]) {
               var hasDot = target[row][col];
               var error = (hasDot) ? taskStrings.patternMissing : taskStrings.patternUnwanted;
               if(!noVisual){
                  displayError(error);
                  if (hasDot) {
                     highlightWrong(row, col);
                  }
               }
               return { successRate: 0, message: error }
            }
         }
      }
      if(answer.history.length > limit){
         error = taskStrings.tooManyRect(limit);
         if(!noVisual){
            displayError(error);
         }
         return { successRate: 0, message: error }
      }
      if(!noVisual){
         platform.validate("done");
      }
      return { successRate: 1, message: taskStrings.success };
   };

   var highlightWrong = function(row, col) {
      wrongRow = row;
      wrongCol = col;
      userGrid.highlightCell(wrongRow, wrongCol, wrongAttr);
   };

   var unhighlightWrong = function() {
      if(wrongCol === null || wrongCol === undefined) {
         return;
      }
      userGrid.unhighlightCell(wrongRow, wrongCol);
   };

   function displayError(msg,belowPaper) {
      if(!msg){
         $("#error").html(msg);
         $("#displayHelper_graderMessage").html(msg);
      }else{
         var id = (belowPaper) ? "#error" : "#displayHelper_graderMessage";
         $(id).html(msg);
      }
   };


}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();

