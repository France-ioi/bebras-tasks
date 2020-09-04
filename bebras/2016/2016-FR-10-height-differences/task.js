function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         containerWidth: 400,
         elements: [
            [15, 20, 9, 12],
            [10, 6, 16, 13]
         ]
      },
      medium: {
         containerWidth: 500,
         elements: [
            [32, 23, 28, 30, 27],
            [29, 24, 20, 36, 31]
         ]
      },
      hard: {
         containerWidth: 636,
         elements: [
            [30, 21, 36, 14, 33, 39, 24, 17, 27],
            [31, 37, 22, 34, 15, 29, 25, 19, 13]
         ]
      }
   };

   var paper;
   var dragAndDrop;
   var containers;
   var diffTexts;
   var sumText;
   
   var levelElements;
   var levelOptimal;
   var levelMaxHeight;

   var paperParams = {
      width: 760,
      height: 435,
      xPad: 50,
      yPad: 50,
      containersX: 120,
      containersY: [80, 270]
   };
   var cellParams = {
      width: undefined, // Calculated in initPaper.
      height: 150,
      backgroundAttr: {
         fill: "white"
      },
      imageOffset: {
         x: 0,
         y: -10
      },
      imageXPad: 1,
      textOffsetY: 60,
      borderAttr: {
         fill: "white"
      }
   };
   var arrowParams = {
      arrowsY: [162, 188],
      attr: {
        "arrow-start": "classic-wide-long",
        "arrow-end": "classic-wide-long",
        "stroke": "gray",
        "stroke-width" : 2
      }
   };
   var textParams = {
      attr: {
         "font-size": 20
      },
      boldAttr: {
         "font-weight": "bold"
      },
      diffsY: 375,
      teamX: 0,
      totalX: taskParams.totalX,
      sumX: 430, // totalX-20
      sumY: 420
   };
   var leftTextParams = {
      attr: { "text-anchor": "start" }
   };
   var rightTextParams = {
      attr: { "text-anchor": "end" }
   };
   var imageParams = {
      // Maximal size to be displayed, calculated in initPaper.
      maxWidth: undefined,
      maxHeight: undefined,

      // Original png size.
      originalWidth: 108,
      originalHeight: 100,

      names: ["blue.png", "yellow.png"]
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      initElements();
      levelOptimal = solve();
      levelMaxHeight = calcHeight();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initPaper();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return $.extend(true, [], levelElements);
   };

   subTask.unloadLevel = function(callback) {
      if(dragAndDrop) {
         dragAndDrop.disable();
      }
      callback();
   };

   var initElements = function() {
      var randomGenerator = new RandomGenerator(subTask.taskParams.randomSeed);
      var shift = randomGenerator.nextInt(0, 5);
      levelElements = Beav.Matrix.init(data[level].elements.length, data[level].elements[0].length, function(row, col) {
         return data[level].elements[row][col] + shift;
      });
   };

   var solve = function() {
      var result = 0;
      var sortedLists = {};
      for(var iList in levelElements) {
         sortedLists[iList] = $.extend(true, [], levelElements[iList]);
         sortNumeric(sortedLists[iList]);
      }
      for(var iElement = 0; iElement < levelElements[0].length; iElement++) {
         result += Math.abs(sortedLists[0][iElement] - sortedLists[1][iElement]);
      }
      return result;
   };

   var calcHeight = function() {
      var result = 0;
      for(var iList in levelElements) {
         for(var iElement in levelElements[iList]) {
            result = Math.max(result, levelElements[iList][iElement]);
         }
      }
      return result;
   };

   var initPaper = function () {
      paper = subTask.raphaelFactory.create("anim", "anim", paperParams.width, paperParams.height);

      // Set cell width to fill the container area.
      cellParams.width = Math.floor(data[level].containerWidth / levelElements[0].length);

      // Set the image size to fit in the cell.
      imageParams.maxWidth = Math.min(imageParams.originalWidth, cellParams.width - 2 * cellParams.imageXPad);
      imageParams.maxHeight = imageParams.originalHeight * (imageParams.maxWidth / imageParams.originalWidth);

      dragAndDrop = DragAndDropSystem({
         paper: paper,
         actionIfDropped: actionIfDropped,
         drop: onDrop,
         actionIfEjected: actionIfEjected
      });

      for(var iList in levelElements) {
         dragAndDrop.addContainer({
            ident : iList,
            cx: paperParams.containersX + data[level].containerWidth / 2, 
            cy: paperParams.containersY[iList],
            widthPlace: cellParams.width,
            heightPlace: cellParams.height,
            nbPlaces : levelElements[iList].length,
            dropMode : 'replace',
            dragDisplayMode: 'preview',
            placeBackgroundArray: []
         });
      }
      
      answerToContainers();
      initNumbers();
      initText();
   };

   var answerToContainers = function() {
      for(var iList in levelElements) {
         var dragElements = [];
         for(var iElement = 0; iElement < levelElements[iList].length; iElement++) {
            dragElements.push({
               ident: answer[iList][iElement],
               elements: [drawCell(iList, answer[iList][iElement])]
            });
         }
         dragAndDrop.insertObjects(iList, 0, dragElements);
      }
   };

   var drawCell = function(teamIndex, height) {
      paper.setStart();

      var border = paper.rect(
         - cellParams.width / 2,
         - cellParams.height / 2,
         cellParams.width,
         cellParams.height);
      border.attr(cellParams.borderAttr);

      var ratio = height / levelMaxHeight;
      var imageWidth = Math.floor(imageParams.maxWidth * ratio);
      var imageHeight = Math.floor(imageParams.maxHeight * ratio);
      var imageX = - imageWidth / 2 + cellParams.imageOffset.x;
      var imageY = - imageHeight / 2 + cellParams.imageOffset.y;
      paper.image(imageParams.names[teamIndex], imageX, imageY, imageWidth, imageHeight);

      paper.text(0, cellParams.textOffsetY, height).attr(textParams.attr);

      var overlay = paper.rect(
         - cellParams.width / 2,
         - cellParams.height / 2,
         cellParams.width,
         cellParams.height);

      overlay.attr({
         fill: "green",
         opacity: 0
      });

      return paper.setFinish();
   };

   var actionIfDropped = function (srcCont, srcPos, dstCont, dstPos, dropType) {
      return srcCont === dstCont;
   };

   var actionIfEjected = function(refElement, srcCont, srcPos) {
      var elements = dragAndDrop.getObjects(srcCont);
      for(var iElement = 0; iElement < elements.length; iElement++) {
         if(elements[iElement] === null) {
            return DragAndDropSystem.action(srcCont, iElement, "insert");
         }
      }
      return null;
   };

   var onDrop = function (srcContainerID, srcPos, dstContainerID, dstPos, dropType) {
      // When one element is dropped on another, replace them in the answer array.
      // There are two onDrop events: one when replacing, and another when the replaced object
      // is relocated (because of actionIfEjected). The latter is ignored.
      if(dropType != "replace") {
         return;
      }

      // Swap.
      var temp = answer[srcContainerID][srcPos];
      answer[srcContainerID][srcPos] = answer[dstContainerID][dstPos];
      answer[dstContainerID][dstPos] = temp;

      refreshNumbers();
   };
   
   var initText = function() {
      for(var iList in levelElements) {
         paper.text(textParams.teamX, paperParams.containersY[iList], taskStrings.teamNames[iList]).attr(textParams.attr).attr(leftTextParams.attr);
      }
      paper.text(textParams.teamX, textParams.diffsY, taskStrings.difference).attr(textParams.attr).attr(textParams.boldAttr).attr(leftTextParams.attr);
      paper.text(textParams.sumX, textParams.sumY, taskStrings.total).attr(textParams.attr).attr(rightTextParams.attr).attr(textParams.boldAttr);
   };

   var initNumbers = function() {
      diffTexts = [];
      var firstX = paperParams.containersX + cellParams.width / 2;

      for(var iElement = 0; iElement < levelElements[0].length; iElement++) {
         var xPos = firstX + iElement * cellParams.width;
         var text = paper.text(xPos, textParams.diffsY, "0").attr(textParams.attr);
         diffTexts.push(text);
         var arrow = paper.path(["M", xPos, arrowParams.arrowsY[0],
                                 "L", xPos, arrowParams.arrowsY[1]]).attr(arrowParams.attr);

      }

      sumText = paper.text(textParams.totalX, textParams.sumY, "0").attr(textParams.attr).attr(textParams.boldAttr);

      refreshNumbers();
   };

   var refreshNumbers = function() {
      var diffsAndSum = getDiffsAndSum();
      for(var iElement in diffsAndSum.diffs) {
         diffTexts[iElement].attr("text", diffsAndSum.diffs[iElement]);
      }
      sumText.attr("text", diffsAndSum.sum);
   };

   var verifyFormat = function() {
      var answerCopy = $.extend(true, [], answer);
      var dataCopy = $.extend(true, [], levelElements);

      for(var iList in dataCopy) {
         sortNumeric(dataCopy[iList]);
         sortNumeric(answerCopy[iList]);
      }

      return Beav.Object.eq(answerCopy, dataCopy);
   };

   var getDiffsAndSum = function() {
      var diffs = [];
      var sum = 0;
      for(var iElement = 0; iElement < levelElements[0].length; iElement++) {
         var diff = Math.abs(answer[0][iElement] - answer[1][iElement]);
         diffs.push(diff);
         sum += diff;
      }
      return {
         diffs: diffs,
         sum: sum
      };
   };

   var getResultAndMessage = function() {
      if(!verifyFormat()) {
         return {
            successRate: 0,
            message: "internal error"
         };
      }

      var diffsAndSum = getDiffsAndSum();
      if(diffsAndSum.sum === levelOptimal) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }
      else {
         return {
            successRate: 0,
            message: taskStrings.wrong(diffsAndSum.sum)
         };
      }
   };

   function sortNumeric(array) {
      array.sort(function(a, b) {
         return a - b;
      });
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
