function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var lightOrange = "#FFE4AF";
   var lightBlue = "#95B0F4";
   var lightRed = "#F4C0C0";
   var elementTypes = {
      circle: {
         criticalProperties: {
            shape: "circle"
         },
         attrs: {
            "stroke-width": 3,
            stroke: "orange",
            fill: lightOrange
         }
      },
      square: {
         criticalProperties: {
            shape: "square"
         },
         attrs: {
            "stroke-width": 3,
            stroke: "blue",
            fill: lightBlue
         }
      },
      triangle: {
         criticalProperties: {
            shape: "triangle",
            fill: "red"
         },
         attrs: {
            "stroke-width": 3,
            stroke: "red",
            fill: lightRed
         }
      },
      bigCircle: {
         criticalProperties: {
            shape: "circle",
            fill: "dots",
            size: "big"
         },
         attrs: {
            "stroke-width": 3,
            stroke: "orange", 
            fill: lightOrange
         }
      },
      bigSquare: {
         criticalProperties: {
            shape: "square",
            fill: "lines",
            size: "big"
         },
         attrs: {
            "stroke-width": 3,
            stroke: "blue",
            fill: lightBlue
         }
      },
      bigHexagon: {
         criticalProperties: {
            shape: "hexagon",
            fill: "red",
            size: "big"
         },
         attrs: {
            "stroke-width": 3,
            stroke: "red",
            fill: lightRed
         }
      },
      smallCircle: {
         criticalProperties: {
            shape: "circle",
            fill: "dots",
            size: "small",
            sizeCorner: "small"
         },
         attrs: {
            "stroke-width": 3,
            stroke: "orange",
            fill: lightOrange
         }
      },
      smallSquare: {
         criticalProperties: {
            shape: "square",
            fill: "lines",
            size: "small",
            sizeCorner: "small"
         },
         attrs: {
            "stroke-width": 3,
            stroke: "blue",
            fill: lightBlue
         }
      }
   };
   var data = {
      easy: {
         elements: [["circle", "circle", "square", "square", "square", "square", "triangle", "triangle"]],
         validation: validateEasyMedium,
         legalPermutations: [
            ["circle", "square"]
         ]
      },
      medium: {
         elements: [["bigCircle", "bigCircle", "smallCircle", "smallCircle", "bigSquare", "bigSquare", "smallSquare", "smallSquare", "bigHexagon"]],
         validation: validateEasyMedium,
         legalPermutations: [
            ["bigCircle", "smallCircle"],
            ["bigSquare", "smallSquare"],
            ["bigCircle", "bigSquare"],
            ["smallCircle", "smallSquare"]
         ]
      },
      hard: {
         elements: [
            ["bigSquare", "bigSquare", "smallCircle", "smallCircle"],
            ["bigSquare", "bigSquare", "smallCircle", "smallCircle"],
            ["bigCircle", "bigCircle", "smallSquare", "smallSquare"],
            ["bigCircle", "bigCircle", "smallSquare", "smallSquare"]
         ],
         validation: validateHard,
         legalPermutations: [
            ["bigCircle", "smallCircle"],
            ["bigSquare", "smallSquare"],
            ["bigCircle", "bigSquare"],
            ["smallCircle", "smallSquare"]
         ]
      }
      /* DEPRECATED BUT KEEP FOR FUTURE USE
      harder: {
         elements: [
            ["bigSquare", "bigSquare", "bigSquare", "bigSquare", "bigSquare"],
            ["smallCircle", "smallCircle", "smallCircle", "smallCircle", "bigSquare"],
            ["bigCircle", "bigCircle", "bigCircle", "smallSquare", "smallSquare"],
            ["bigCircle", "bigCircle", "bigCircle", "smallSquare", "smallSquare"],
            ["bigCircle", "bigCircle", "bigCircle", "smallSquare", "smallSquare"]
         ],
         validation: validateHard
      } */
   };

   var paper;
   var paperWidth;
   var paperHeight;
   var dragAndDrop;
   var container;
   var cellPositions;
   var wrongCells;

   var unmodifiedTable;

   var validateDirections = {
      right: [1, 0],
      down: [0, 1],
      rightUp: [1, -1],
      rightDown: [1, 1]
   };

   var paperParams = {
      xPad: 20,
      yPad: 20
   };

   var shapeParams = {
      cellSize: 75,
      diameter: 60,
      smallDiameter: 30,
      backgroundAttr: {
         fill: "#EEEEEE"
      },
      wrongAttr: {
         stroke: "#FF0000",
         "stroke-width": 4
      },
      wrongPad: 3
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      displayHelper.hideValidateButton = true;
      initTable();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initPaper();
      initHandlers();
      unhighlightWrong();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return $.extend(true, [], unmodifiedTable);
   };

   subTask.unloadLevel = function(callback) {
      if(dragAndDrop) {
         dragAndDrop.disable();
      }
      $("#execute").unbind(); 
      callback();
   };

   var initTable = function() {
      unmodifiedTable = $.extend(true, [], data[level].elements);

      // We choose a random subset of the legal permutations.
      // For each one we apply it to the entire table.
      var randomGenerator = new RandomGenerator(subTask.taskParams.randomSeed);
      for(var permuteIndex in data[level].legalPermutations) {
         if(randomGenerator.nextBit()) {
            continue;
         }
         var permutation = data[level].legalPermutations[permuteIndex];
         for(var row = 0; row < unmodifiedTable.length; row++) {
            for(var col = 0; col < unmodifiedTable[0].length; col++) {
               if(unmodifiedTable[row][col] == permutation[0]) {
                  unmodifiedTable[row][col] = permutation[1];
               }
               else if(unmodifiedTable[row][col] == permutation[1]) {
                  unmodifiedTable[row][col] = permutation[0];
               }
            }
         }
      }
   };

   var initPaper = function () {
      paperWidth = unmodifiedTable[0].length * shapeParams.cellSize + 2 * paperParams.xPad;
      paperHeight = unmodifiedTable.length * shapeParams.cellSize + 2 * paperParams.yPad;

      paper = subTask.raphaelFactory.create("anim", "anim", paperWidth, paperHeight);

      dragAndDrop = DragAndDropSystem({
         paper: paper,
         actionIfDropped: actionIfDropped,
         drop: onDrop,
         actionIfEjected: actionIfEjected
      });

      var cellBackground = paper.rect(
         - shapeParams.cellSize / 2,
         - shapeParams.cellSize / 2,
         shapeParams.cellSize,
         shapeParams.cellSize);
      
      cellBackground.attr(shapeParams.backgroundAttr);
   
      cellPositions = [];
      var topLeft = {
         x: paperWidth / 2 - unmodifiedTable[0].length * shapeParams.cellSize / 2,
         y: paperHeight / 2 - unmodifiedTable.length * shapeParams.cellSize / 2
      };
      
      for(var row = 0; row < unmodifiedTable.length; row++) {
         for(var col = 0; col < unmodifiedTable[0].length; col++) {
            cellPositions.push([
               topLeft.x + shapeParams.cellSize / 2 + col * shapeParams.cellSize,
               topLeft.y + shapeParams.cellSize / 2 + row * shapeParams.cellSize
            ]);
         }
      }

      container = dragAndDrop.addContainer({
         ident : "container",
         cx: paperWidth / 2,
         cy: paperHeight / 2,
         widthPlace: shapeParams.cellSize,
         heightPlace: shapeParams.cellSize,
         nbPlaces : unmodifiedTable.length * unmodifiedTable[0].length,
         dropMode : 'replace',
         dragDisplayMode: 'preview',
         placeBackgroundArray: [cellBackground],
         places: cellPositions
      });

      answerToContainer();
   };

   var answerToContainer = function() {
      var dragElements = [];
      for(var row = 0; row < answer.length; row++) {
         for(var col = 0; col < answer[0].length; col++) {
            dragElements.push({
               ident: answer[row][col],
               elements: [drawElement(elementTypes[answer[row][col]])]
            });
         }
      }
      dragAndDrop.insertObjects("container", 0, dragElements);
   };

   var drawElement = function(elementType) {
      paper.setStart();

      var element;
      var diameter = shapeParams.diameter;
      if(elementType.criticalProperties.size == "small") {
         diameter = shapeParams.smallDiameter;
      }
      var radius = diameter / 2;

      if(elementType.criticalProperties.shape == "circle") {
         element = paper.circle(0, 0, radius);
      }
      else if(elementType.criticalProperties.shape == "square") {
         element = paper.rect(
            - radius,
            - radius,
            diameter,
            diameter);
      }
      else if(elementType.criticalProperties.shape == "hexagon") {
         element = paper.path([
            "M", 0, - radius,
            "L", - radius, - radius * 0.6,
            "L", - radius, radius * 0.6,
            "L", 0, radius,
            "L", radius, radius * 0.6,
            "L", radius, - radius * 0.6,
            "Z"
         ]);
      }
      else {
         // Draw triangle.
         element = paper.path([
            "M", - radius, radius,
            "L", radius, radius,
            "L", 0, - radius,
            "Z"]);
      }

      element.attr(elementType.attrs);
      
      var overlay = paper.rect(
         - shapeParams.cellSize / 2,
         - shapeParams.cellSize / 2,
         shapeParams.cellSize,
         shapeParams.cellSize);

      overlay.attr({
         fill: "green",
         opacity: 0
      });

      return paper.setFinish();
   };

   var actionIfDropped = function (srcCont, srcPos, dstCont, dstPos, dropType) {
      return dstCont != null;
   };

   var actionIfEjected = function(refElement, srcCont, srcPos) {
      var elements = dragAndDrop.getObjects("container");
      
      for(var iElement = 0; iElement < elements.length; iElement++) {
         if(elements[iElement] === null) {
            return DragAndDropSystem.action("container", iElement, "insert");
         }
      }
      return null;
   };

   var onDrop = function (srcContainerID, srcPos, dstContainerID, dstPos, dropType) {
      unhighlightWrong();
      
      // When one element is dropped on another, replace them in the answer array.
      // There are two onDrop events: one when replacing, and another when the replaced object
      // is relocated (because of actionIfEjected). The latter is ignored.
      if(dropType != "replace") {
         return;
      }
      var position1 = indexToCoordinates(srcPos);
      var position2 = indexToCoordinates(dstPos);
      
      // Swap.
      var temp = answer[position1.row][position1.col];
      answer[position1.row][position1.col] = answer[position2.row][position2.col];
      answer[position2.row][position2.col] = temp;
   };

   var initHandlers = function() {
      $("#execute").unbind();
      $("#execute").click(clickExecute);
   };

   var clickExecute = function() {
      var validationResult = data[level].validation();
      if(validationResult.success) {
         platform.validate("done");
      }
      else {
         highlightWrong(validationResult.wrongCells);
         displayHelper.validate("stay");
      }
   };

   var highlightWrong = function(newWrongCells) {
      unhighlightWrong();
      wrongCells = newWrongCells;
      for(var iCell in wrongCells) {
         var position = cellPositions[coordinatesToIndex(wrongCells[iCell].row, wrongCells[iCell].col)];
         wrongCells[iCell].raphael = paper.rect(
            position[0] - shapeParams.cellSize / 2 + shapeParams.wrongPad,
            position[1] - shapeParams.cellSize / 2 + shapeParams.wrongPad,
            shapeParams.cellSize - 2 * shapeParams.wrongPad,
            shapeParams.cellSize - 2 * shapeParams.wrongPad
         ).attr(shapeParams.wrongAttr);
      }
   };

   var unhighlightWrong = function() {
      if(!wrongCells) {
         return;
      }
      for(var iCell in wrongCells) {
         wrongCells[iCell].raphael.remove();
      }
      wrongCells = null;
   };

   var verifyFormat = function() {
      var flatAnswer = [];
      var flatData = [];

      for(var row = 0; row < data[level].elements.length; row++) {
         for(var col = 0; col < data[level].elements[0].length; col++) {
            flatAnswer.push(answer[row][col]);
            flatData.push(unmodifiedTable[row][col]);
         }
      }

      flatAnswer.sort();
      flatData.sort();

      return Beav.Object.eq(flatAnswer, flatData);
   };

   var getResultAndMessage = function() {
      if(!verifyFormat()) {
         return {
            successRate: 0,
            message: "internal error"
         };
      }
      
      var validationResult = data[level].validation();

      if(validationResult.success) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }
      else {  
         var firstInvalidAttr = validationResult.commonAttributes[0];
         return {
            successRate: 0,
            message: taskStrings.wrong(firstInvalidAttr, level)
         };
      }
   };

   // returns an array that contains a subset of ["shape", "fill" ]
   function computeCommonAttributes(type1, type2) {
      var result = [];
      for(var attr in type1.criticalProperties) {
         if(type1.criticalProperties[attr] === type2.criticalProperties[attr]) {
            result.push(attr);
         }
      }
      return result;
   }

   function validateEasyMedium() {
      for(var col = 0; col < answer[0].length - 1; col++) {
         var currentType = elementTypes[answer[0][col]];
         var nextType = elementTypes[answer[0][col + 1]];
         var commonAttributes = computeCommonAttributes(currentType, nextType);
         if(commonAttributes.length > 0) {
            return {
               success: false,
               wrongCells: [{row: 0, col: col}, {row: 0, col: (col + 1)}],
               commonAttributes: commonAttributes
            };
         }
      }

      return {
         success: true
      };
   }

   // returns an array that contains a subset of ["shape", "fill", "size" ]
   function commonAttributesHardTypes(row1, col1, row2, col2) {
      var type1 = elementTypes[answer[row1][col1]];
      var type2 = elementTypes[answer[row2][col2]];
      
      var result = [];
      // Corners.
      if(Math.abs(row1 - row2) == Math.abs(col1 - col2)) {
         if (type1.criticalProperties.size == type2.criticalProperties.size) {
           result.push("size");
         }
      }
      // Horizontal/vertical.
      else {
         if (type1.criticalProperties.fill == type2.criticalProperties.fill) {
            result.push("fill");
         }
         if (type1.criticalProperties.shape == type2.criticalProperties.shape) {
            result.push("shape");
         }
      }
      return result;
   }

   function validateHard() {
      for(var row = 0; row < answer.length; row++) {
         for(var col = 0; col < answer[0].length; col++) {
            for(var dir in validateDirections) {
               var offset = validateDirections[dir];
               var otherRow = row + offset[1];
               var otherCol = col + offset[0];
               if(!checkValidCoordinates(otherRow, otherCol)) {
                  continue;
               }
               var commonAttributes = commonAttributesHardTypes(row, col, otherRow, otherCol);
               if(commonAttributes.length > 0) {
                  return {
                     success: false,
                     wrongCells: [{row: row, col: col}, {row: otherRow, col: otherCol}],
                     commonAttributes: commonAttributes
                  };
               }
            }
         }
      }
      return {
         success: true
      };
   }

   function indexToCoordinates(index) {
      return {
         row: Math.floor(index / unmodifiedTable[0].length),
         col: index % unmodifiedTable[0].length
      };
   }

   function coordinatesToIndex(row, col) {
      return row * unmodifiedTable[0].length + col;
   }

   function checkValidCoordinates(row, col) {
      return row >= 0 && row < unmodifiedTable.length && col >= 0 && col < unmodifiedTable[0].length;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
