function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         nbShapes: 1,
         nbRows: 5,
         nbCols: 7
      },
      medium: {
         nbShapes: 1,
         nbRows: 5,
         nbCols: 6
      },
      hard: {
         nbShapes: 2,
         nbRows: 5,
         nbCols: 7
      }
   };

   var paper;
   var paperWidth = 770;
   var paperHeight;
   var cellSize = 70;
   var margin = 10;
   var nbCols;
   var nbRows;
   var imageSize = cellSize - margin;
   var x0 = cellSize;
   var y0 = margin;

   var markedCells = [];
   var grid;
   var gridLineAttr = {
      "stroke": "black",
      "stroke-width": 1
   };

   var nbShapes;
   // var nbSelected = 0; // DEPRECATED
   var random;
   var minNbChange = 1; // minimum number of change required on a random grid // DEPRECATED
   var images = [$("#kangourou").attr("src"),$("#crocodile").attr("src"),$("#ours").attr("src"),$("#flower").attr("src"),$("#pot").attr("src")];

   var circleAttr = {
      r: cellSize/3,
      stroke: "black",
      "stroke-width": 1,
      fill: "lightblue"
   };
   var triangleAttr = {
      stroke: "black",
      "stroke-width": 1,
      fill: "lightgreen"
   };
   var diamondAttr = {
      stroke: "black",
      "stroke-width": 1,
      fill: "rgb(200,100,100)"
   };
   var highlightAttr = {
      stroke: "red",
      "fill-opacity": 0
   };
   var selectedAttr = {
      stroke: "none",
      fill: "lightblue"
   };
   var textAttr = {
      "font-size": 18
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      nbShapes = data[level].nbShapes;
      nbCols = data[level].nbCols;
      nbRows = data[level].nbRows;
      paperHeight = y0 + cellSize * nbRows + margin;
      random = new RandomGenerator(subTask.taskParams.randomSeed);
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(answer){
         random.reset(answer.seed);
      }
   };

   subTask.resetDisplay = function () {
      initPaper();
      initGrid();
      displayHelper.setValidateString(taskStrings["try"]);
      displayHelper.customValidate = check;
      displayError("");
      reloadAnswer();
      if(answer.tried){
         check(true);
      }
      displayHelper.confirmRestartAll = false;
      if (typeof(enableRtl) != "undefined") {
         $("body").attr("dir", "rtl");
         $(".largeScreen #zone_1").css("float", "right");
         $(".largeScreen #zone_2").css("float", "right");
      }
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = {seed:random.nextInt(1,10000),gridArray:[],prediction:[],tried:false};
      do {
         var nbPerShape = [0,0,0,0];
         var nbNone = 0;
         markedCells = [];
         for(var iRow = 0; iRow < nbRows; iRow++){
            defaultAnswer.gridArray[iRow] = [];
            defaultAnswer.prediction[iRow] = [];
            for(var iCol = 0; iCol < nbCols; iCol++){
               var shape = 0;
               if (level == "easy") {
                  if (iCol % 2 == 0) {
                     if (iRow % 3 == 1) {
                        shape = 1;
                     } else if (iRow % 3 == 0) {
                        if (random.nextInt(0,1) == 1) {
                           shape = 2;
                        }
                     }
                  }
               } else if (level == "medium") {
                  if (iRow % 2 == 1) {
                     shape = 1;
                  } else if (random.nextInt(0,1) == 1) {
                        shape = 2;
                  }
               } else {
                  if (iRow % 2 == 1) {
                     shape = 1;
                  } else {
                     shape = random.nextInt(0,2) + 2;
                     if (shape == 4) {
                        shape = 0;
                        nbNone++;
                     }
                  }
               }
               nbPerShape[shape]++;
               defaultAnswer.gridArray[iRow][iCol] = shape;
               defaultAnswer.prediction[iRow][iCol] = 0;
            }
         }
         var valid = false;
         var typesPresentData = getTypesPresentData(defaultAnswer.gridArray);
         var nbTypesPresent = typesPresentData.nbTypesPresent;
         if ((level == "easy") || (level == "medium")) {
            valid = ((nbPerShape[2] > 3) && (nbPerShape[2] < nbPerShape[1] - 2));
            if (level == "medium") {
               valid = valid && (nbTypesPresent == 4);
            }
         } else {
            // all but one scenarios represented
            // at least one occurence of each of the three interesting cases
            // at least 5 flowers
            var c1 = typesPresentData.nbPerType[1];
            var c2 = typesPresentData.nbPerType[5];
            var c3 = typesPresentData.nbPerType[6];
            var c4 = typesPresentData.nbPerType[8];
            valid = (nbTypesPresent == 8) && (c1 >= 1) && (c2 >= 1) && (c3 >= 1) && (c4 >= 1) && (c1+c2+c3 >= 5);
         }
      } while(!valid);
      markCells(defaultAnswer.gridArray);
      return defaultAnswer;
   };

   function getTypesPresentData(cellsContent) {
      var nbPerType = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      var nbTypesPresent = 0;
      for (var iRow = 1; iRow < nbRows - 1; iRow += 2) {
         for (var iCol = 0; iCol < nbCols; iCol++) {
            var type = 0;
            var shapeAbove = cellsContent[iRow - 1][iCol];
            var shapeBelow = cellsContent[iRow + 1][iCol];
            if (shapeAbove == 2) {
               type += 3;
            } else if (shapeAbove == 3) {
               type += 6;
            }
            if (shapeBelow == 2) {
               type += 1;
            } else if (shapeBelow == 3) {
               type += 2;
            }
            if (nbPerType[type] == 0) {
               nbTypesPresent++;
            }
            nbPerType[type]++;
         }
      }
      return { nbPerType: nbPerType, nbTypesPresent: nbTypesPresent };
   }

   function getResultAndMessage() {
      markCells(answer.gridArray);
      // console.log("markedCells : " + JSON.stringify(markedCells));
      var result = compareWithPrediction(true);
      return result;
   }

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);
   };

   function initGrid() {
      if(grid){
         grid.remove();
      }
      grid = Grid.fromArray("paper", paper, answer.gridArray, cellFiller, cellSize, cellSize, x0, y0, gridLineAttr);
      grid.clickCell(clickHandler);
   };

   function cellFiller(data, paper) {
      var x = data.xPos;
      var y = data.yPos;
      var entry = data.entry;
      switch(entry){
         case 1:
         case 2:
         case 3:
            var el = paper.image(images[entry - 1],x - margin/3, y + margin/2, imageSize, imageSize);
            return [el];
         case 4:
            var el = paper.image(images[3],x + 0.6*cellSize, y + 0.4*cellSize, 0.35*cellSize, 0.5*cellSize).toBack();
            // var el = paper.image(images[entry - 1],x + cellSize/2, y + cellSize/2, cellSize/2, cellSize/2);
            return [el];
         case 5:
            var el = paper.image(images[3],x + 0.6*cellSize, y + 0.14*cellSize, 0.35*cellSize, 0.5*cellSize);
            // var el = paper.image(images[entry - 1],x + cellSize/2, y + cellSize/2, cellSize/2, cellSize/2);
            return [el];
         case 6:
            var el = paper.image(images[4],x + 0.52*cellSize, y + 0.55*cellSize, cellSize/2, 0.4*cellSize).toBack();
            // var el = paper.rect(x,y,cellSize,cellSize).attr(selectedAttr).toBack();
            return [el];
         default:
            return [];
      }
   };

   function clickHandler(event) {
      if(answer.tried){
         next()
         //displayHelper.showPopupMessage(taskStrings.clickNext,"blanket"); // DEPRECATED
         return
      }
      var row = event.data.row;
      var col = event.data.col;
      if(answer.gridArray[row][col] != 1){
         displayError(taskStrings.noBeaver);
         return;
      }
      answer.prediction[row][col] = 1 - answer.prediction[row][col];
      if(answer.prediction[row][col]){
         event.data.entry = 6;
         grid.addToCell(cellFiller,event.data);
      }else{
         event.data.entry = answer.gridArray[row][col];
         grid.clearCell(row,col);
         grid.addToCell(cellFiller,event.data);
      }
      displayError("");
      displayHelper.confirmRestartAll = true;
   };

   function check(reload) {
      markCells(answer.gridArray);
      applyChange();
      compareWithPrediction(false,reload);
      // grid.unclickCell(); // DEPRECATED
      answer.tried = true;
   };

   function markCells(array) {
      markedCells = [];
      target = [];
      for(iRow = 0; iRow < nbRows; iRow++){
         target[iRow] = [];
         for(iCol = 0; iCol < nbCols; iCol++){
            target[iRow][iCol] = 0;
            if(array[iRow][iCol]){
               var shape = array[iRow][iCol];
               switch(level){
                  case "easy":
                  // REVIEW: veut-on mettre la solution en clair dans le code source ?
                  /* only gift kangaroos that have a crocodile above them */
                     if (iRow > 0) {
                        var shapeAbove = array[iRow - 1][iCol];
                        if ((shape == 1) && (shapeAbove == 2)) {
                           markCell(iRow, iCol);
                        }
                     }
                     break;
                  case "medium":
                  /* only gift kangaroos that have exactly one crocodile above or under them */
                     if ((iRow > 0) && (iRow < nbRows - 1)) {
                        var shapeAbove = array[iRow - 1][iCol];
                        var shapeBelow = array[iRow + 1][iCol];
                        if ((shape == 1) &&
                            (((shapeAbove == 2) && (shapeBelow == 0)) ||
                             ((shapeAbove == 0) && (shapeBelow == 2)))) {
                           markCell(iRow, iCol);
                        }
                     }
                     break;
                  case "hard":
                  /* only gift kangaroos that have
                     - crocodile ontop and grizzly below
                     - or grillzy above
                     - or crocodile below */
                     if ((iRow > 0) && (iRow < nbRows - 1)) {
                        var shapeAbove = array[iRow - 1][iCol];
                        var shapeBelow = array[iRow + 1][iCol];
                        if ((shape == 1) &&
                            (((shapeAbove == 2) && (shapeBelow == 3)) ||
                             ((shapeAbove == 3) && (shapeBelow == 0)) ||
                             ((shapeAbove == 0) && (shapeBelow == 2)))) {
                           markCell(iRow, iCol);
                        }
                     }
                     break;
               }
            }
         }
      }
   };

   function markCell(row,col,action) {
      if(!target[row][col]){
         markedCells.push({row:row,col:col});
      }
      target[row][col] = 1;
   };

   function applyChange() {
      for(var iCell = 0; iCell < markedCells.length; iCell++){
         var row = markedCells[iCell].row;
         var col = markedCells[iCell].col;
         if(answer.prediction[row][col]){
            var data = {row:row,col:col,entry:5};
         }else{
            var data = {row:row,col:col,entry:4};
         }
         grid.addToCell(cellFiller,data);
      }
      markedCells = [];
   };

   function compareWithPrediction(validation,reload) {
      var nbSelected = 0;
      for(var iRow = 0; iRow < nbRows; iRow++){
         for(var iCol = 0; iCol < nbCols; iCol++){
            if(answer.prediction[iRow][iCol]){
               nbSelected++;
            }
         }
      }
      if(nbSelected == 0){
         if (!validation) {
            var msg = taskStrings.tryToUnderstand;
            displayError(msg,true);
            displayHelper.setValidateString(taskStrings.next);
            displayHelper.customValidate = next;
         }
         return { successRate: 0, message: msg };
      }
      // REVIEW: on pourrait remplir nbSelected et errors en même temps.
      var errors = [];
      for(iRow = 0; iRow < nbRows; iRow++){
         for(iCol = 0; iCol < nbCols; iCol++){
            if(answer.prediction[iRow][iCol] != target[iRow][iCol]){
               errors.push({row:iRow,col:iCol,gift: answer.prediction[iRow][iCol]});
            }
         }
      }
      if(errors.length > 0){
         var hasExtraGift = false;
         var hasMissingGift = false;
         for(var iError = 0; iError < errors.length; iError++){
            var error = errors[iError];
            if (error.gift) {
               hasExtraGift = true;
            } else {
               hasMissingGift = true;
            }
         }
         if (hasExtraGift) {
            if (hasMissingGift) {
               msg = taskStrings.errorMissingAndExtraGift;
            } else {
               msg = taskStrings.errorExtraGift;
            }
         } else {
            msg = taskStrings.errorMissingGift;
         }
         msg += " " + taskStrings.clickNext;

         if (!validation) {
            displayError(msg);
            displayHelper.setValidateString(taskStrings.next);
            displayHelper.customValidate = next;
         }
         return { successRate: 0, message: msg };
      }

      if(validation){
         return { successRate: 1, message: taskStrings.success };
      }else{
         if(!reload){
            platform.validate("done");
         }
      }
   };

   function next() {
      displayError(taskStrings.clickNow,true);
      random.reset(answer.seed);
      answer = subTask.getDefaultAnswerObject();
      initGrid();
      displayHelper.setValidateString(taskStrings["try"]);
      displayHelper.customValidate = check;
      $("#topGrid h4").text(taskStrings.startingGrid+":");
      // nbSelected = 0;// DEPRECATED
   };

   function reloadAnswer() {
      for(var iRow = 0; iRow < nbRows; iRow++){
         for(var iCol = 0; iCol < nbCols; iCol++){
            if(answer.prediction[iRow][iCol]){
               var data = {
                  row: iRow,
                  col: iCol,
                  entry: 6
               };
               grid.addToCell(cellFiller,data);
            }
         }
      }
   }

   function displayError(msg,black) {
      $("#error").html(msg);
      var color = (black) ? "black" : "red";
      $("#error").css({color: color});
      //REVIEW: pas top si un jour la couleur par défaut du feedback n'est plus "red"
   };

}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
