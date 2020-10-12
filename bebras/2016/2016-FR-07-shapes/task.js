function initTask(subTask) {
   var state = {};
   var rtl = false;
   var level;
   var answer = null;
   var bank = ["diamond", "circle", "triangle", "hexagon", "star"];
   var paperWidth = 760;
   var paperHeight = null; // calculated
   var data = {
      easy: {
         start: [null, null, null],
         rules: [
            {
               oldPattern: [null],
               newPattern: [null, null]
            }
         ],
         //target: ["hexagon", "star", "circle", "hexagon"]
         target: ["diamond", "triangle", "diamond", "triangle", "diamond", "triangle"]
      },
      medium: {
         start: [null],
         rules: [
            {
               oldPattern: [null],
               newPattern: [null, null, null]
            },
            {
               oldPattern: [null],
               newPattern: [null, null]
            }
         ],
         target: ["circle", "star", "circle", "star", "circle"]
      },
      hard: {
         start: [null, null, null, null],
         rules: [
            {
               oldPattern: [null],
               newPattern: [null, null]
            },
            {
               oldPattern: [null],
               newPattern: [null, null]
            }
         ],
         target: ["triangle", "hexagon", "star", "circle", "circle", "triangle", "hexagon", "star"]
      }
   };

   var paper;
   var dragAndDrop;
   var visualResults;
   var levelTarget;

   var ruleMaxX;
   var resultsX;

   var shapeParams = {
      cellDiameter: 45,
      shapeSpacing: 35,
      shapeDiameter: 30,
      bankCenterX: 210,
      bankCenterY: 25,
      startCenterY: 110,
      slotAttr: {
         "stroke-width": 2,
         fill: "#DDDDDD"
      },
      shapeAttr: {
         circle: {
            fill: "red"
         },
         triangle: {
            fill: "green"
         },
         diamond: {
            fill: "yellow"
         },
         hexagon: {
            fill: "cyan"
         },
         star: {
            fill: "purple"
         },
         ellipsis: {
            "stroke-width": 1,
            fill: "black",
            r: 2
         }
      }
   };

   var textParams = {
      startY: shapeParams.startCenterY,
      ruleX: 0,
      ruleYSpacing: 70,
      textShapePadX: 9,
      textSuffixPadX: 10,
      targetY: null, // calculated
      targetYPad: 10,
      attr: {
         "font-size": 16,
         "text-anchor": "start"
      },
      targetAttr: {
         "text-anchor": "end",
         "font-weight": "bold"
      }
   };

   var separatorParams = {
      attr: {
         "stroke-width": 2
      }
   };

   var targetRectAttr = {
      "stroke-width": 2
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      initPermutation();
      if (typeof(enableRtl) != "undefined") {
         rtl = true;
      }
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!validateFormat()) {
         answer = subTask.getDefaultAnswerObject();
      }
   };

   subTask.resetDisplay = function() {
      initPaper();
      fillFromAnswer();
      refreshResults();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return {
         start: $.extend(true, [], data[level].start),
         rules: $.extend(true, [], data[level].rules)
      };
   };

   subTask.unloadLevel = function(callback) {
      if(dragAndDrop) {
         dragAndDrop.disable();
      }
      callback();
   };

   var initPermutation = function() {
      var randomGenerator = new RandomGenerator(subTask.taskParams.randomSeed);
      var permutation = $.extend([], bank);

      // No need to safeShuffle - the original order is arbitrary and doesn't hint at anything.
      randomGenerator.shuffle(permutation);
      
      var permutationObject = {};
      for(var index = 0; index < bank.length; index++) {
         permutationObject[bank[index]] = permutation[index];
      }
      levelTarget = $.map(data[level].target, function(shape) {
         return permutationObject[shape];
      });
   };

   var initPaper = function() {
      textParams.targetY = textParams.startY + textParams.ruleYSpacing * (data[level].rules.length + 1); 
      paperHeight = textParams.targetY + shapeParams.shapeDiameter;

      paper = subTask.raphaelFactory.create("anim", "anim", paperWidth, paperHeight);

      // This fixes a bug that causes Raphael's element.getBBox() method to return wrong values for texts in IE6.
      // Taken from here: https://github.com/DmitryBaranovskiy/raphael/issues/410#issuecomment-17374032 
      if (Raphael.vml) {
         var OriginalFunc = Raphael._engine.create;
         Raphael._engine.create = function() {
            res = OriginalFunc.apply(Raphael, arguments);
            res.span.style.cssText += ";white-space:nowrap;";
            return res;
         };
      }

      dragAndDrop = DragAndDropSystem({
         paper: paper,
         actionIfDropped: actionIfDropped,
         drop: onDrop
      });

      initStart();
      for(var iRule = 0; iRule < data[level].rules.length; iRule++) {
         initRule(iRule);
      }

      initResults();

      initTarget();
      initBank();

      initSeparators();
   };

   var initSeparators = function() {
      paper.path(["M", 0, shapeParams.startCenterY - 40, "H", paperWidth]).attr(separatorParams.attr);
      paper.path(["M", 0, textParams.targetY - 30, "H", paperWidth]).attr(separatorParams.attr);
   };

   var initStart = function() {
      var textX = textParams.ruleX;
      if (rtl) {
         textX = paper.width - textX;
      }
      var start = paper.text(textX, textParams.startY, taskStrings.start).attr(textParams.attr);
      var leftX = textParams.ruleX + start.getBBox().width + textParams.textShapePadX;

      var array = data[level].start;
      var arrayWidth = array.length * shapeParams.cellDiameter;
      var centerX = leftX + arrayWidth / 2;
      if (rtl) {
         centerX = paper.width-centerX;
      }
      createShapeArray(array, centerX, shapeParams.startCenterY, "start");
      ruleMaxX = leftX + arrayWidth + textParams.textSuffixPadX;
   };

   var initBank = function() {
      var firstCenterX = shapeParams.bankCenterX - (bank.length * (shapeParams.cellDiameter)) / 2 + (shapeParams.cellDiameter) / 2;
      for(var iShape = 0; iShape < bank.length; iShape++) {
         dragAndDrop.addContainer({
            ident: "bank_" + bank[iShape],
            type: "source",
            cx: firstCenterX + shapeParams.cellDiameter * iShape * 1.5,
            cy: shapeParams.bankCenterY,
            dropMode: "replace",
            dragDisplayMode: "preview",
            nbPlaces: 1,
            widthPlace: shapeParams.cellDiameter,
            heightPlace: shapeParams.cellDiameter,
            placeBackgroundArray: [],
            sourceElemArray: [drawShape(bank[iShape])]
         });
      }
   };

   var initRule = function(iRule) {
      // Prefix.
      var leftX = textParams.ruleX;
      var centerY = textParams.startY + textParams.ruleYSpacing * (iRule + 1);
      var textX = leftX;
      if (rtl) {
         textX = paper.width - textX;
      }
      var prefix = paper.text(textX, centerY, taskStrings.rulePrefix(iRule)).attr(textParams.attr);
      leftX += prefix.getBBox().width + textParams.textShapePadX;

      // Old pattern.
      var array = data[level].rules[iRule].oldPattern;
      var arrayWidth = array.length * shapeParams.cellDiameter;
      var centerX = leftX + arrayWidth / 2;
      if (rtl) {
         centerX = paper.width - centerX;
      }
      createShapeArray(array, centerX, centerY, "rule_" + iRule + "_old");
      leftX += arrayWidth + textParams.textShapePadX;

      // Infix.
      textX = leftX;
      if (rtl) {
         textX = paper.width - leftX;
      }
      var infix = paper.text(textX, centerY, taskStrings.ruleInfix).attr(textParams.attr);
      leftX += infix.getBBox().width + textParams.textShapePadX;

      // New pattern.
      array = data[level].rules[iRule].newPattern;
      arrayWidth = array.length * shapeParams.cellDiameter;
      centerX = leftX + arrayWidth / 2;
      var shapesCenterX = centerX;
      if (rtl) {
         shapesCenterX = paper.width - centerX;
      }
      createShapeArray(array, shapesCenterX, centerY, "rule_" + iRule + "_new");
      ruleMaxX = Math.max(ruleMaxX, centerX + arrayWidth / 2 + textParams.textSuffixPadX);
   };

   var initResults = function() {
      var textObject;
      var textX = ruleMaxX;
      if (rtl) {
         textX = paper.width - ruleMaxX;
      }
      for(var row = 0; row < data[level].rules.length + 1; row++) {
         textObject = paper.text(textX, textParams.startY + row * textParams.ruleYSpacing, taskStrings.ruleSuffix).attr(textParams.attr);
      }
      resultsX = ruleMaxX + textObject.getBBox().width + textParams.textShapePadX;
   };

   var initTarget = function() {
      var textX = resultsX - textParams.textShapePadX;
      if (rtl) {
         textX = paper.width - textX;
      }
      paper.text(textX, textParams.targetY, taskStrings.target).attr(textParams.attr).attr(textParams.targetAttr);

      var targetCenterX = resultsX + (levelTarget.length * shapeParams.shapeSpacing / 2);
      if (rtl) {
         targetCenterX = paper.width - targetCenterX;
      }
      createShapeArray(levelTarget, targetCenterX, textParams.targetY, "target");
   };

   var createShapeArray = function(array, centerX, centerY, iden) {
      var leftX;
      if(array[0] === null) {
         leftX = centerX - (array.length * shapeParams.cellDiameter) / 2;
         var elements = Beav.Array.init(array.length, drawSlot);
         var positions = Beav.Array.init(array.length, function(index) {
            return [
               leftX + shapeParams.cellDiameter / 2 + (shapeParams.cellDiameter * index),
               centerY
            ];
         });
         dragAndDrop.addContainer({
            cx: centerX,
            cy: centerY,
            ident: iden,
            // type: "list",
            dropMode : 'replace',
            dragDisplayMode: "preview",
            nbPlaces: elements.length,
            widthPlace: shapeParams.cellDiameter,
            heightPlace: shapeParams.cellDiameter,
            placeBackgroundArray: elements
            // places: positions
         });
      }
      else {
         leftX = centerX - (array.length * shapeParams.shapeSpacing) / 2;
         for(var iShape = 0; iShape < array.length; iShape++) {
            var shapeSet = drawShape(array[iShape]);
            shapeSet.transform(["T", leftX + shapeParams.shapeSpacing / 2 + iShape * shapeParams.shapeSpacing, centerY]);
         }
      }
   };

   var drawSlot = function() {
      return paper.rect(- shapeParams.cellDiameter / 2, - shapeParams.cellDiameter / 2, shapeParams.cellDiameter, shapeParams.cellDiameter).attr(shapeParams.slotAttr);
   };

   var drawShape = function(shape) {
      var set = paper.set();
      set.push(drawSlot().attr({
         fill: "green",
         opacity: 0
      }));

      var radius = shapeParams.shapeDiameter / 2;
      var element;

      if(shape == "circle") {
         element = paper.circle(0, 0, radius);
      }
      else if(shape == "triangle") {
         element = paper.path(["M", -radius, radius,
                               "L", radius, radius,
                               "L", 0, -radius,
                               "Z"]);
      }
      else if(shape == "diamond") {
         element = paper.path(["M", 0, -radius,
                               "L", radius, 0,
                               "L", 0, radius,
                               "L", -radius, 0,
                               "Z"]);
      }
      else if(shape == "hexagon") {
         element = paper.path(["M", 0, -radius,
                               "L", -radius, -radius / 2,
                               "L", -radius, radius / 2,
                               "L", 0, radius,
                               "L", radius, radius / 2,
                               "L", radius, -radius / 2,
                               "Z"]);
      }
      else if(shape == "star") {
         element = paper.path(["M", 0, -radius,
                               "L", 0.27 * radius, -0.3 * radius,
                               "L", radius, -0.3 * radius,
                               "L", 0.4 * radius, 0.2 * radius,
                               "L", 0.6 * radius, 0.8 * radius,
                               "L", 0, 0.4 * radius,
                               "L", - 0.6 * radius, 0.8 * radius,
                               "L", - 0.4 * radius, 0.2 * radius,
                               "L", - radius, -0.3 * radius,
                               "L", - 0.27 * radius, -0.3 * radius,
                               "Z"]);
      }
      else if(shape == "ellipsis") {
         element = paper.set();
         element.push(paper.circle(0, 0));
         element.push(paper.circle(-8, 0));
         element.push(paper.circle(8, 0));
      }

      if(shapeParams.shapeAttr[shape]) {
         element.attr(shapeParams.shapeAttr[shape]);
      }
      set.push(element);
      return set;
   };

   var actionIfDropped = function(srcCont, srcPos, dstCont, dstPos, dropType) {
      if(dstCont == null) {
         return true;
      }
      if(dstCont.substring(0, 4) == "bank") {
         return false;
      }
      return true;
   };

   var convertToAnswerFormat = function(array) {
      return Beav.Array.init(array.length, function(index) {
         if(array[index] === null) {
            return null;
         }
         return array[index].replace("bank_", "");
      });
   };

   var convertFromAnswerFormat = function(array) {
      return Beav.Array.init(array.length, function(index) {
         if(array[index] === null) {
            return null;
         }
         return "bank_" + array[index];
      });
   };

   var onDrop = function() {
      if(data[level].start[0] === null) {
         answer.start = convertToAnswerFormat(dragAndDrop.getObjects("start"));
      }

      for(var iRule = 0; iRule < answer.rules.length; iRule++) {
         if(data[level].rules[iRule].oldPattern[0] === null) {
            answer.rules[iRule].oldPattern = convertToAnswerFormat(dragAndDrop.getObjects("rule_" + iRule + "_old"));
         }
         if(data[level].rules[iRule].newPattern[0] === null) {
            answer.rules[iRule].newPattern = convertToAnswerFormat(dragAndDrop.getObjects("rule_" + iRule + "_new"));
         }
      }

      refreshResults();
   };

   var refreshResults = function() {
      removeVisualResults();
      visualResults = [];

      var allResults = getGradualResults();

      for(var iResult = 0; iResult < allResults.length; iResult++) {
         var centerY;
         if(iResult === 0) {
            centerY = shapeParams.startCenterY;
         }
         else {
            centerY = textParams.startY + textParams.ruleYSpacing * (iResult);
         }

         var pattern = allResults[iResult];
         for(var iShape = 0, offScreen = false; iShape < pattern.length && !offScreen; iShape++) {
            var centerX;
            if (!rtl) {
               centerX = resultsX + (iShape + 0.5) * shapeParams.shapeSpacing;
            } else {
               centerX = (paper.width-resultsX) - (pattern.length-iShape - 0.5) * shapeParams.shapeSpacing;
            }
            
            var shapeSet;

            // If the right edge of this shape is off screen, or if there is another shape
            // and its right edge is going to be off screen, draw ellipsis instead. 
            if((centerX + shapeParams.shapeSpacing / 2 >= paperWidth) || (iShape < pattern.length - 1 && centerX + shapeParams.shapeSpacing * 1.5 >= paperWidth)) {
               shapeSet = drawShape("ellipsis");
               offScreen = true;
            }
            else {
               shapeSet = drawShape(pattern[iShape]);
            }
            shapeSet.transform(["T", centerX, centerY]);
            visualResults.push(shapeSet);
         }
      }
   };

   var removeVisualResults = function() {
      if(!visualResults || visualResults.length === 0) {
         return;
      }
      while(visualResults.length > 0) {
         visualResults.pop().remove();
      }
   };

   var fillContainer = function(iden, array) {
      var dragFormatArray = convertFromAnswerFormat(array);
      for(var iPos = 0; iPos < array.length; iPos++) {
         if(array[iPos] !== null) {
            dragAndDrop.insertObject(iden, iPos, {
               ident: dragFormatArray[iPos],
               elements: drawShape(array[iPos])
            });
         }
      }
   };

   var fillFromAnswer = function() {
      if(data[level].start[0] === null) {
         fillContainer("start", answer.start);
      }

      for(var iRule = 0; iRule < data[level].rules.length; iRule++) {
         var rule = data[level].rules[iRule];
         if(rule.oldPattern[0] === null) {
            fillContainer("rule_" + iRule + "_old", answer.rules[iRule].oldPattern);
         }
         if(rule.newPattern[0] === null) {
            fillContainer("rule_" + iRule + "_new", answer.rules[iRule].newPattern);
         }
      }
   };

   var validateFormat = function() {
      if(!answer || !answer.start || !answer.rules || !answer.rules.length) {
         return false;
      }
      if(answer.start.length !== data[level].start.length || answer.rules.length !== data[level].rules.length) {
         return false;
      }
      for(var iRule in data[level].rules) {
         if(!(answer.rules[iRule].oldPattern) || !(answer.rules[iRule].newPattern)) {
            return false;
         }
         if(answer.rules[iRule].oldPattern.length !== data[level].rules[iRule].oldPattern.length) {
            return false;
         }
         if(answer.rules[iRule].newPattern.length !== data[level].rules[iRule].newPattern.length) {
            return false;
         }
      }
      return true;
   };

   var getGradualResults = function() {
      var allResults = [];

      var isOccurrence = function(array, index, subarray) {
         if(index + subarray.length > array.length) {
            return false;
         }
         for(var checkIndex = index; checkIndex < index + subarray.length; checkIndex++) {
            if(array[checkIndex] !== subarray[checkIndex - index]) {
               return false;
            }
         }
         return true;
      };
      var applyRule = function(array, rule) {
         var oldPattern = rule.oldPattern;
         var newPattern = rule.newPattern;

         if(array.length === 0 || hasNull(oldPattern) || hasNull(newPattern)) {
            return [];
         }

         var newArray = [];
         var index = 0;
         while(index < array.length) {
            if(isOccurrence(array, index, oldPattern)) {
               newArray = newArray.concat(newPattern);
               index += oldPattern.length;
            }
            else {
               newArray.push(array[index]);
               index++;
            }
         }
         return newArray;
      };

      if(hasNull(answer.start)) {
         return Beav.Array.init(answer.rules.length + 1, function() {
            return [];
         });
      }
      
      var pattern = $.extend(true, [], answer.start);
      allResults.push(pattern);
      for(var iRule = 0; iRule < answer.rules.length; iRule++) {
         var rule = answer.rules[iRule];
         pattern = applyRule(pattern, rule);
         allResults.push(pattern);
      }
      return allResults;
   };

   var hasNull = function(array) {
      for(var index = 0; index < array.length; index++) {
         if(array[index] === null) {
            return true;
         }
      }
      return false;
   };

   var checkAnswer = function() {
      var allResults = getGradualResults();
      var pattern = allResults[allResults.length - 1];

      if(pattern.length > levelTarget.length) {
         return false;
      }
      while(pattern.length < levelTarget.length) {
         pattern.push(null);
      }
      for(var iTarget = 0; iTarget < levelTarget.length; iTarget++) {
         if(pattern[iTarget] !== levelTarget[iTarget]) {
            return false;
         }
      }
      return true;
   };

   var getResultAndMessage = function() {
      if(!validateFormat()) {
         return {
            successRate: 0,
            message: taskStrings.missing
         };
      }
      if(!checkAnswer()) {
         return {
            successRate: 0,
            message: taskStrings.wrong
         };
      }
      return {
         successRate: 1,
         message: taskStrings.success
      };
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
