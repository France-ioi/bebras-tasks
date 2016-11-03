

// TODO raphael extension, to move to Beav (functions also used in FR-13)
Raphael.fn.arc = function(startX, startY, endX, endY, radius1, radius2, xAxisRotation) {
  // arc (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
  var elems = ['M', startX, startY, 'A', radius1, radius2, xAxisRotation, 0, 0, endX, endY].join(' ');
  return this.path(elems);
};

// TODO raphael extension, to move to Beav
Raphael.fn.circularArc = function(centerX, centerY, radius, startAngle, endAngle) {
  var startX = centerX + radius * Math.cos(startAngle); 
  var startY = centerY - radius * Math.sin(startAngle);
  var endX = centerX + radius * Math.cos(endAngle); 
  var endY = centerY - radius * Math.sin(endAngle);
  return this.arc(startX, startY, endX, endY, radius, radius, 0);
};

function initTask(subTask) {
   'use strict';
   var level;
   var answer = null; // anwer[row][col] is a 2D array of boolean values, of size dimensions[level]
   var state = {};

   var nbRows, nbCols;
   var data = { // rows, cols
      dimensions: {
         easy: [1, 17],
         medium: [2, 15],
         hard: [9, 12] }
      };

   var quarter = Math.PI/2;
      // steps: [deltaRow, deltaCol, waveRot]
   var steps = [[0, 1, 2*quarter], [-1, 0, 3*quarter], [0, -1, 0*quarter], [1, 0, 1*quarter] ];

   var cellSide = 44;
   var margin = 8;
   var lineAttr = {'stroke-width': 1, 'stroke': "#000000"};

   var backgroundEmpty = "#FF0000";
   var backgroundBorder = "#DDDDDD";
   var backgroundCovered = "#CCFFCC";

   var waveAttr = {'stroke-width': 2, 'stroke': "#000000"};
   var waveAngle1 = 0.20;
   var waveAngle2 = 0.25;
   var waveAngle3 = 0.36;
   var waveDist1 = cellSide-14;
   var waveDist2 = cellSide-2;
   var waveDist3 = cellSide+12;

   var grid;
   var paper;

   //-------------------------------------------------------------------------

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      var dimensions = data.dimensions[level];
      nbRows = dimensions[0];
      nbCols = dimensions[1];
      if (subTask.display) {
         initGraphics();
      }
   };

   subTask.getDefaultAnswerObject = function() {
      return Beav.Matrix.init(nbRows, nbCols, function() { return 0; });
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      clearFeedback();
      Beav.Matrix.forEach(answer, function(value, row, col) {
         updateCell(row, col);
      });
   };

   //-------------------------------------------------------------------------

   function initGraphics() {
      if (grid) {
         grid.remove();
         paper.remove();
      }
      var paperWidth = cellSide * nbCols + 2 * margin;
      var paperHeight = cellSide * nbRows + 2 * margin;
      paper = subTask.raphaelFactory.create("grid", "grid", paperWidth, paperHeight);
      grid = new Grid("grid", paper, nbRows, nbCols, cellSide, cellSide, margin, margin, lineAttr);
      grid.clickCell(cellClickHandler);
   }
   
   function drawAntenna(row, col) {
      var pos = grid.getCellCenter(row, col);
      var c1 = paper.circle(pos.x, pos.y, 8).attr({'fill': 'none', 'stroke-width': 3, 'stroke': 'black'});
      var c2 = paper.circle(pos.x, pos.y, 3).attr({'fill': 'black'});
      var baseHeight = cellSide/2-7;
      var baseWidth = 6;
      var b1 = paper.rect(pos.x-1, pos.y, 2, baseHeight).attr({'fill': 'black'});
      var b2 = paper.rect(pos.x-baseWidth, pos.y+baseHeight, 2*baseWidth, 3).attr({'fill': 'black'});
      return [b1, b2, c1, c2];
   }

   function drawWave(row, col, waveRot) {
      // row and col corresponds to the position of the antenna
      var pos = grid.getCellCenter(row, col);
      var a1 = paper.circularArc(pos.x, pos.y, waveDist1, waveRot-waveAngle1, waveRot+waveAngle1)
       .attr(waveAttr);
      var a2 = paper.circularArc(pos.x, pos.y, waveDist2, waveRot-waveAngle2, waveRot+waveAngle2)
       .attr(waveAttr);
      var a3 = paper.circularArc(pos.x, pos.y, waveDist3, waveRot-waveAngle3, waveRot+waveAngle3)
       .attr(waveAttr);
      return [a1, a2, a3];
   }

   function isBorder(row, col) {
      if (level == "hard") {
         return (row === 0 || row == nbRows-1 || col === 0 || col == nbCols-1);
      } else {
         return (col === 0 || col == nbCols-1);
      }
   }

   function isInGrid(row, col) {
      return row >= 0 && row < nbRows && col >= 0 && col < nbCols; 
   }

   function cellFiller(data, paper) {
      var elems = [];
      var row = data.row;
      var col = data.col;
      var count = 0;
      if (answer[row][col]) {
         elems = elems.concat(drawAntenna(row, col));
         count++;
      }

      for (var iStep in steps) {
         var stepRow = row + steps[iStep][0];
         var stepCol = col + steps[iStep][1];
         var waveRot = steps[iStep][2];
         if (isInGrid(stepRow, stepCol) && answer[stepRow][stepCol]) {
            elems = elems.concat(drawWave(stepRow, stepCol, waveRot));
            count++;
         }
      }
      var background = "";
      if (count > 1) {
         background = backgroundEmpty;   
      } else if (isBorder(row, col)) {
         background = backgroundBorder;
      } else if (elems.length > 0) {
         background = backgroundCovered;
      } 
      if (background) {
         var rect = paper.rect(data.xPos+2, data.yPos+2, data.cellWidth-4, data.cellHeight-4)
           .attr({"stroke": background, "fill": background}).toBack();
         elems = elems.concat(rect);
        // TODO: fix the background color for the cell.
         //  .attr({"fill": background});  TODO; ne marche pas, on ne voit que le rectangle
         // elems = [rect].concat(elems);
      }

      return elems;
   }

   function updateCell(row, col) {
      grid.setCell(cellFiller, { row: row, col: col });
   }

   function clearFeedback() {
      $("#error_text").html("&nbsp;");
   }

   function cellClickHandler(event) {
      displayHelper.stopShowingResult();
      clearFeedback();
      var row = event.data.row;
      var col = event.data.col;
      if (! isInGrid(row, col)) {
         alert("ERROR event not in grid"); // TODO: check does not happen
      } 

      answer[row][col] = 1 - answer[row][col];

      var newOverlap = false;
      updateCell(row, col);
      for (var iStep in steps) {
         var stepRow = row + steps[iStep][0];
         var stepCol = col + steps[iStep][1];  
         if (isInGrid(stepRow, stepCol)) {
            // Note: grid.getCell(stepRow, stepCol).length > 1 means other objects 
            // are drawn in the cell, and not just a background rectangle
            if (answer[row][col] && grid.getCell(stepRow, stepCol).length > 1) {
               newOverlap = true;
            }
            updateCell(stepRow, stepCol);
         }
      }
      if (newOverlap) {
         $("#error_text").html(taskStrings.warning);
      }
      
      // FOR DEBUG
       //var res = subTask.grade(100);
      // $("#error_text").append(((newOverlap) ? "overlap" : "") + " -- score = " + res.score);

   }

   //-------------------------------------------------------------------------

   // returns "overlap" or "success" or "hole"
   var evalSolution = function() {
      var reaching = [ [0, 0] ].concat(steps);
      var covered = Beav.Matrix.init(nbRows, nbCols, function() { return 0; });
      var row, col;
      for (row = 0; row < nbRows; row++) {
         for (col = 0; col < nbCols; col++) {
            if (answer[row][col]) {
               for (var iReaching in reaching) {
                  var stepRow = row + reaching[iReaching][0];
                  var stepCol = col + reaching[iReaching][1];  
                  if (isInGrid(stepRow, stepCol)) {
                     if (covered[stepRow][stepCol]) {
                        return "overlap";
                     }
                     covered[stepRow][stepCol] = 1;
                  }
               }
            } 
         }
      }

      for (row = 0; row < nbRows; row++) {
         for (col = 0; col < nbCols; col++) {
            if (! isBorder(row,col) && ! covered[row][col]) {
               return "hole";
            }
         }
      }
      return "success";
   };

   subTask.getGrade = function(callback) {
      var score = 0;
      var message = "";
      var res = evalSolution();
      if (res == "overlap") {
         message = taskStrings.overlap;
      } else if (res == "hole") {
         message = taskStrings.missing;
      } else if (res == "success") {
         score = 1;
         message = taskStrings.success;
      }
      callback({
         successRate: score,
         message: message
       });
   };
   
   subTask.unloadLevel = function(callback) {
      if(grid) {
         grid.remove();
      }
      callback();
   };
}

initWrapper(initTask, ["easy", "medium", "hard"]);

