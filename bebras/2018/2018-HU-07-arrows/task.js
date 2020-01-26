function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         arrowDirections : [
            [4,2,6],
            [0,2,4],
            [2,6,0]
         ],
         aim : [1,1]
      },
      medium: {
         arrowDirections : [
            [2,3,5,6],
            [0,6,4,6],
            [1,2,6,0]
         ],
         aim : [1,1]
      },
      hard: {
         arrowDirections : [
            [4,4,5,4],
            [3,3,5,6],
            [2,0,0,0],
            [1,2,6,7]
         ],
         aim : [2,1]
      },
      medium_easier: {
         arrowDirections : [
            [2,5,5],
            [2,4,0],
            [1,2,7]
         ],
         aim : [1,1]
      },
      very_hard: {
         arrowDirections : [
            [2,4,4,6,4],
            [3,2,3,5,6],
            [3,1,1,5,5],
            [2,0,0,6,7],
            [2,1,1,0,6]
         ],
         aim : [2,2]
      }
   };
   var nRows;  // number of rows in the grid
   var nCols;  // number of columns in the grid
   var colorsToSymbol = [ taskStrings.blueSymbol, taskStrings.yellowSymbol, " " ];
   var colorsToText = [ taskStrings.blue, taskStrings.yellow ];
   var arrowColors;  // array
   var initArrCol = [];
   var arrowSameColor;  // array
   var actualArrDir; // array arrowDirections with a random rotation
   var paper;
   var paperWidth = 420;
   var cellWidth = 70;
   var arrowAttr = {
      "stroke" : "black",
      "stroke-width" : 2,
      0 : { "color" : "#3f48cc", "textColor" : "#ffffff" },
      1 : { "color" : "#fff200", "textColor" : "#000000" },
      2 : { "color" : "#ffffff", "textColor" : "#000000" },
      "margin" : 10
   };
   var grid;
   var gridWidth;
   var gridHeight;
   var gridPos;
   var undoButton;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      initRowCol();
      initActualArrDir();
      initArrowColors();
      initArrowSameColor();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      updateArrowSameColor();
      if(answer){
         arrowColors = answer.colors;
      }
   };

   subTask.resetDisplay = function() {
      displayHelper.customValidate = function(){
         updateArrowSameColor();
         updateGrid(false, false);
         checkResult(true);
      }
      initInstructionsArrows();
      initGrid();
      initUndo();
      hideFeedBack();
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
      // var lastChanged = null;
      var lastChanged = [];
      if (level == "easy") {
         lastChanged = [{row: 1, col: 1}];
      }
      var defaultAnswer = {
        colors: JSON.parse(JSON.stringify(initArrCol)),
        changedArrowSeq: lastChanged
      };
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      // destroy all objects, timers etc. as needed
      if (grid) {
         grid.remove();
         grid = null;
      }
      callback();
   };

   function getResultAndMessage() {
      var result = checkResult(false);
      var successRate = 0;
      if(result.validGrid) {
         successRate = 1;
      }
      return {
         successRate: successRate,
         message: result.message
      };
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initRowCol() {
      nRows = data[level].arrowDirections.length;
      nCols = data[level].arrowDirections[0].length;
      gridWidth = nCols*cellWidth;
      gridHeight = nRows*cellWidth;
      gridPos = { "x": 0,
                  "y": 20 };
   };

   /**
   * Rotation of the array arrowDirection by a random angle
   */
   function initActualArrDir() {
      var randomN = (subTask.taskParams.randomSeed)%4;
      if (nRows != nCols) {
         randomN -= randomN % 2;
      }
      actualArrDir = new Array(nRows);
      for(var iRow = 0; iRow < nRows; iRow++) {
         actualArrDir[iRow] = new Array(nCols);
         for(var iCol = 0; iCol < nCols; iCol++) {
            switch(randomN) {
               case 0 :
                  var jRow = iRow;
                  var jCol = iCol;
                  var angle = 0;
                  break;
               case 1 :
                  var jRow = (nCols-1 - iCol);
                  var jCol = iRow;
                  var angle = 90;
                  break;
               case 2 :
                  var jRow = (nRows-1 - iRow);
                  var jCol = (nCols-1 - iCol);
                  var angle = 180;
                  break;
               case 3 :
                  var jRow = iCol;
                  var jCol = (nRows-1 - iRow);
                  var angle = 270;
            }
            actualArrDir[iRow][iCol] = ((data[level].arrowDirections[jRow][jCol]*45+angle)%360)/45;
         }
      }
   };

   /**
   * Initialization of the array arrowColors
   */
   function initArrowColors() {
      arrowColors = new Array(nRows);
      for(var iRow = 0; iRow < nRows; iRow++) {
         arrowColors[iRow] = new Array(nCols);
         initArrCol[iRow] = [];
         for(var iCol = 0; iCol < nCols; iCol++) {
            arrowColors[iRow][iCol] = 2;
            initArrCol[iRow][iCol] = 2;
         }
      }
      if (level == "easy") {
         arrowColors[1][1] = 0;
         initArrCol[1][1] = 0;
      }
   };

   /**
   * Initialization of the array arrowSameColor
   */
   function initArrowSameColor() {
      arrowSameColor = new Array(nRows);
      for(var iRow = 0; iRow < nRows; iRow++) {
         arrowSameColor[iRow] = new Array(nCols);
         for(var iCol = 0; iCol < nCols; iCol++) {
            arrowSameColor[iRow][iCol] = 0;
         }
      }
   };

   /**
   * Creation of the 2 arrows in the intruction text
   */
   function initInstructionsArrows() {
      var bPaper = subTask.raphaelFactory.create("bPaper","instructions_blue",cellWidth,cellWidth);
      var yPaper = subTask.raphaelFactory.create("yPaper","instructions_yellow",cellWidth,cellWidth);
      var dataBlue = {
         "xPos" : 0,
         "yPos" : 0,
         "margin" : arrowAttr.margin,
         "frameWidth" : cellWidth,
         "color" : arrowAttr[0].color,
         "orientation" : 2,
         "text" : data[level].aim[0]+taskStrings.blueSymbol,
         "textColor" : arrowAttr[0].textColor
      };
      var dataYellow = {
         "xPos" : 0,
         "yPos" : 0,
         "margin" : arrowAttr.margin,
         "frameWidth" : cellWidth,
         "color" : arrowAttr[1].color,
         "orientation" : 2,
         "text" : data[level].aim[1]+taskStrings.yellowSymbol,
         "textColor" : arrowAttr[1].textColor
      };
      drawArrow(dataBlue,bPaper);
      drawArrow(dataYellow,yPaper);
   };

   function initGrid() {
      paper = subTask.raphaelFactory.create("gridPaper","grid",paperWidth,gridPos.y + gridHeight + 10);
      grid = new Grid("grid", paper, nRows, nCols, cellWidth, cellWidth, gridPos.x, gridPos.y);
      updateGrid(true, true);
      grid.clickCell(function(event){
         /*if(level == "easy" && event.data.row == 1 && event.data.col == 1) {
            displayHelper.showPopupMessage(taskStrings.fixedArrow, "blanket");
            answer.changedArrowSeq.push({row: 1, col: 1});
            updateGrid(false, true);
            return;
         }*/
         hideFeedBack();
         changeArrowColor(event.data,false);
         answer.colors = arrowColors;
      });
   };

   function initUndo() {
      var w = 100;
      var h = 30;
      var x = gridPos.x + gridWidth + 20;
      var y = gridPos.y + gridHeight/2 - h/2;
      undoButton = new Button(paper,x,y,w,h,taskStrings.undo);
      undoButton.click(undo);
      if(answer.changedArrowSeq.length == 0 || (level == "easy" && answer.changedArrowSeq.length <= 1)){
         undoButton.disable();
      }
   };

   function undo() {
      var last = answer.changedArrowSeq.length-1;
      var row = answer.changedArrowSeq[last].row;
      var col = answer.changedArrowSeq[last].col;
      changeArrowColor({"row": row, "col": col},true);
      if(answer.changedArrowSeq.length == 0 || (level == "easy" && answer.changedArrowSeq.length <= 1)){
         undoButton.disable();
      }
   };

   function drawArrow(arrowData,paper) {
      var x = arrowData.xPos;
      var y = arrowData.yPos;
      var margin = arrowData.margin;
      var frameW = arrowData.frameWidth;
      var innerFrameW = frameW-2*margin;
      var baseW = innerFrameW*0.6;
      var arrowTipLength = innerFrameW/3;
      var angle = arrowData.orientation*45;
      var cx = x+frameW/2;
      var cy = y+frameW/2;
      var arrowSet = paper.set();
      if (arrowData.background != null) {
           arrowSet.push(paper.rect(x, y, frameW, frameW).attr({fill:arrowData.background}));
      }
      var arrow = paper.path("M"+(x+frameW/2)+" "+(y+margin)+
                              "L"+(x+frameW-margin)+" "+(y+margin+arrowTipLength)+
                              "H"+(x+margin+innerFrameW-(innerFrameW-baseW)/2)+
                              "V"+(y+frameW-margin)+
                              "H"+(x+margin+(innerFrameW-baseW)/2)+
                              "V"+(y+margin+arrowTipLength)+
                              "H"+(x+margin)+
                              "Z");

      arrow.attr(arrowAttr).attr("fill",arrowData.color);
      arrow.transform("r"+angle);
      var text = paper.text(cx,cy,arrowData.text).attr({"font-size":(baseW*0.7), "fill" : arrowData.textColor});
      arrowSet.push(arrow,text);
      return [arrowSet];
   };

   function changeArrowColor(arrowData,undo) {
      var oldColor = arrowColors[arrowData.row][arrowData.col];
      var newColor = (undo) ? (oldColor+2)%3 : (oldColor+1)%3;
      arrowColors[arrowData.row][arrowData.col] = newColor;
      if(undo){
         answer.changedArrowSeq.pop();
      }else{
         answer.changedArrowSeq.push({row: arrowData.row, col: arrowData.col});
         undoButton.enable();
      }
      updateGrid(false, true);
   };

   function updateArrowSameColor() {
      for(var iRow = 0; iRow < nRows; iRow++) {
         for(var iCol = 0; iCol < nCols; iCol++) {
            arrowSameColor[iRow][iCol] = countSameColor(iRow,iCol);
         }
      }
   };

   function getCellsPointedBy(srcRow, srcCol) {
      var arrowDir = actualArrDir[srcRow][srcCol];
      var row = srcRow;
      var col = srcCol;
      var cells = [];
      while(row < nRows && col < nCols && row >= 0 && col >= 0) {
         if(arrowDir <= 1 || arrowDir == 7) {
            row--;
         }else if(arrowDir>= 3 && arrowDir <= 5) {
            row++;
         }
         if(arrowDir >= 5 && arrowDir <= 7) {
            col--;
         }else if(arrowDir>= 1 && arrowDir <= 3) {
            col++;
         }
         if(row < nRows && col < nCols && row >= 0 && col >= 0) {
            cells.push({row: row, col: col});
         }
      }
      return cells;
   }

   function countSameColor(row,col) {
      if($.type(answer) == "undefined"){
         var arrowColor = arrowColors[row][col];
      }else{
         var arrowColor = answer.colors[row][col];
      }

      var cpt = 0;
      if(arrowColor == 2) {
         return 0;
      }
      var cellsPointed = getCellsPointedBy(row, col);
      for (var iCell = 0; iCell < cellsPointed.length; iCell++) {
         var cell = cellsPointed[iCell];
         if($.type(answer) == "undefined" && arrowColors[cell.row][cell.col] == arrowColor) {
            cpt++;
         }else if($.type(answer) != "undefined" && answer.colors[cell.row][cell.col] == arrowColor) {
            cpt++;
         }
      }
      return cpt;
   };

   function updateGrid(isInit, highlightPointedCells) {
      var cellsPointed = [];
      var lastChanged = (answer.changedArrowSeq.length > 0) ? answer.changedArrowSeq[answer.changedArrowSeq.length-1] : null;
      if (lastChanged != null && arrowColors[lastChanged.row][lastChanged.col] != 2) {
         cellsPointed = getCellsPointedBy(lastChanged.row, lastChanged.col);
      }
      for(var iRow = 0; iRow < nRows; iRow++) {
         for(var iCol = 0; iCol < nCols; iCol++) {
            var arrowColor = arrowColors[iRow][iCol];
            var text = (arrowColor == 2 ? "" : data[level].aim[arrowColor]+colorsToSymbol[arrowColor]);
            var background = null;
            if (highlightPointedCells) {
               for (var iCell = 0; iCell < cellsPointed.length; iCell++) {
                  var cell = cellsPointed[iCell];
                  if ((cell.row == iRow) && (cell.col == iCol)) {
                     background = "lightgray";
                  }
               }
            }
            var dat = {
               "row": iRow,
               "col": iCol,
               "margin": arrowAttr.margin,
               "frameWidth": cellWidth,
               "color": arrowAttr[arrowColor].color,
               "orientation": actualArrDir[iRow][iCol],
               "text": text,
               "textColor": arrowAttr[arrowColor]["textColor"],
               "click": true,
               "background": background
            };
            if (isInit) {
               grid.addToCell(drawArrow,dat);
            } else {
               grid.setCell(drawArrow,dat);
            }
         }
      }
   };

   function setRed(data,paper) {
      return [paper.rect(data.xPos,data.yPos,cellWidth,cellWidth).attr("fill","red").toBack()];
   };

   function checkResult(precheck) {
      var validGrid = true; // default
      var message = taskStrings.success; // default
      loops: for(var iRow = 0; iRow < nRows; iRow++) {
         for(var iCol = 0; iCol < nCols; iCol++) {
            var dat = { "row" : iRow, "col" : iCol };
            var color = answer.colors[iRow][iCol];
            var sameColor = arrowSameColor[iRow][iCol];
            if(color == 2) {
               validGrid = false;
               message = taskStrings.errorWhiteArrow;
               if(precheck) {
                  grid.addToCell(setRed,dat);
                  showFeedback(message);
                  return;
               }else{
                  break loops;
               }
            }
            if(data[level].aim[color] != sameColor) {
               validGrid = false;
               message = taskStrings.errorWrongArrow(colorsToText[color],sameColor,data[level].aim[color]);
               if(precheck){
                  grid.addToCell(setRed,dat);
                  showFeedback(message);
                  return;
               }else{
                  break loops;
               }
            }
         }
      }
      if(precheck) {
         platform.validate("done");
      }else{
         return {
           validGrid: validGrid,
           message: message
         };
      }
   };

   function showFeedback(string) {
      $("#displayHelper_graderMessage").html(string);
      $("#displayHelper_graderMessage").css("color", "red");
   };

   function hideFeedBack() {
      $("#displayHelper_graderMessage").html("");
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
