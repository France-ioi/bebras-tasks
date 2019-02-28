
// TODO raphael extension, to move to Beav (functions also used in FR-02)
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
   var counter; // nb steps
   var found; // array of int values tried from possibleCodes  
   var state = null; // an array of size 4 giving the select digits

   var nbValues = 10;
   var nbDigits = 4;

   var rectAttr = {"stroke-width": 2, stroke: "black", fill: "white"};
   var digitAttr = {'font-size': 16};
   var bracketDigitAttr = {'font-size': 16, 'font-weight': 'bold'};
   var ringAttr = { stroke: '#C3C3C3', 'stroke-width': 26, fill: 'none' };
   var lockAttr = { stroke: '#2C2B29', 'stroke-width': 4, fill: '#FFD962' };
   var bracketAttr = { stroke: '#2C2B29', 'stroke-width': 3, fill: 'none' };
   var digitSelectedColor = '#33FF33';
   var digitUnselectedColor = 'white';
   var digitSize = 46; 
   var lockStartX = 2;
   var lockStartY = 105;
   var lockWidth = 220;
   var bracketWidth = 40;
   var digitHorizontalSpacing = 45;
   var digitVerticalSpacing = 14;
   var digitStartY = lockStartY + digitVerticalSpacing;
   var digitStartX = lockStartX + lockWidth + digitHorizontalSpacing;
   var lockHeight = nbDigits * (digitVerticalSpacing + digitSize) + digitVerticalSpacing;
   var ringShift = 20;
   var ringRadius = lockWidth/2 - ringShift;
   var ringCenterX = lockStartX + ringShift + ringRadius;
   var infoAttr = {'font-size': 16};
   var infoX = lockStartX + lockWidth + digitHorizontalSpacing + 220;
   var infoY = lockStartY - 50;
   var feedbackAttr = {'font-size': 16, 'font-weight': 'bold', "fill": '#CC6633'};
   var feedbackX = lockStartX + lockWidth + digitHorizontalSpacing + 220;
   var feedbackY = lockStartY - 15;
   var feedback;
   var paperWidth = 740;
   var paperHeight = 365;

   var paper;
   var ringClosed = null; // represents the closed ring; hidden when lock is open
   var items = []; // items[digit][value] is a raphael object (the cells for the digits)
   var brackets = []; // items[digit] is a raphael object (the digit)

   var margin = 1;

   var data = { 
      possibleCodes: {
         // TODO: obfuscate, bidirectional, needed for solutions
         easy: [ 8355, 8535, 8553 ],
         medium: [ 8155, 8255, 8515, 8525, 8551, 8552 ],
         hard : [ 3355, 3535, 3553, 5335, 5353, 5533 ] } 
   };
   var possibleCodes; // optional (useful to write possibleCodes instead of subTask.data.possibleCodes)

   var bestCounterHard = 14;

   //-------------------------------------------------------------------------

   subTask.loadLevel = function(curLevel, curState) {
      // console.log("loadLevel " + display);
      level = curLevel;
      displayHelper.hideValidateButton = true;
      possibleCodes = data.possibleCodes[level];
      
      if(curState) {
         state = curState;
      }
   };
   
   subTask.getDefaultStateObject = function() {
      return [0,0,0,0];
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.getDefaultAnswerObject = function() {
      return { found: [], counter: 0};
   };

   subTask.getAnswerObject = function() {
      return { found: found, counter: counter };
   };

   subTask.reloadAnswerObject = function(answerObj) {
      if(answerObj === null || answerObj === undefined) {
         return;
      }
      found = answerObj.found;
      counter = answerObj.counter;
   };

   //-------------------------------------------------------------------------

   function update() {
      if (level == "hard") {
         $("#step_counter").html(counter); 
      }
      for (var digit = 0; digit < nbDigits; digit++) {
         brackets[digit].attr('text', state[digit]);
         for (var value = 0; value < nbValues; value++) {
            var color = (state[digit] == value) ? digitSelectedColor : digitUnselectedColor;
            items[digit][value].attr({ 'fill': color });
         }
      }
      if (found.length == possibleCodes.length) {
        ringClosed.hide();
      } else {
        ringClosed.show();
      }
      // FOR DEBUG (always display opened lock):
      // ringClosed.hide();
   }

   subTask.resetDisplay = function() {
      if (paper) {
         paper.remove();
      }
      paper = subTask.raphaelFactory.create("anim", "anim", paperWidth, paperHeight);
      paper.circularArc(ringCenterX, lockStartY, ringRadius, 0.5, Math.PI).attr(ringAttr);
      ringClosed = paper.circularArc(ringCenterX, lockStartY, ringRadius, 0, Math.PI).attr(ringAttr);
      ringClosed.hide();
      // FOR DEBUG (to hide lock), comment next line
      paper.rect(lockStartX, lockStartY, lockWidth, lockHeight).attr(lockAttr);
      paper.text(infoX, infoY, taskStrings.instruction).attr(infoAttr);
      feedback = paper.text(feedbackX, feedbackY, "").attr(feedbackAttr);
      var setPointer = function(e) {
        this[0].style.cursor = "pointer";
      };
      for (var digit = 0; digit < nbDigits; digit++) {
        items[digit] = [];
        var digitY = digitStartY + digit * (digitSize + digitVerticalSpacing);
        var bracketX = lockStartX+lockWidth;
        var textY = digitY + 1 + digitSize/2;
        paper.rect(bracketX-bracketWidth, digitY, bracketWidth, digitSize).attr(bracketAttr);
        brackets[digit] = paper.text(bracketX-bracketWidth/2, textY, digit).attr(bracketDigitAttr);
        for (var value = 0; value < nbValues; value++) {
           var digitX = digitStartX + value * digitSize;
           var itemRect = paper.rect(digitX, digitY, digitSize, digitSize)
                               .attr(rectAttr);
           var itemText = paper.text(digitX + digitSize/2, textY, value)
                               .attr(digitAttr); 
           itemRect.click(clickDigit(digit, value));
           itemText.click(clickDigit(digit, value));
           itemText.mouseover(setPointer);
           itemRect.mouseover(setPointer);
           items[digit][value] = itemRect;
        }
      }
      update();
   };

   function getCurrentCode() {
      var t = state;
      return 1000 * t[0] + 100 * t[1] + 10 * t[2] + t[3];
   }

   function checkCode() {
      var code = getCurrentCode();
      var msg = "";
      if (Beav.Array.has(possibleCodes, code)) {
         if (! Beav.Array.has(found, code)) {
            found.push(code);
            msg = taskStrings.freshlyTried;
            if (level == "easy") {
               msg = taskStrings.alreadyFound(found);
            }
         } else {
            msg = taskStrings.alreadyTried;
         }
         var nbRemaining = possibleCodes.length - found.length;
         msg += " " + taskStrings.remaining(nbRemaining);
      } else if (level == "easy") {
         if (found.length > 0) {
            msg = taskStrings.alreadyFound(found);
         }
      }
      feedback.attr('text', msg);
   }

   function clickDigit(digit, value) {
      return function() {
        if (found.length == possibleCodes.length) {
           return; // already terminated
        }
        // FOR DEBUG (force immediate resolution):
        // found = possibleCodes;
        displayHelper.stopShowingResult();
        feedback.attr('text', "");
        if (state[digit] == value)
           return; // no change to digit
        state[digit] = value;
        counter++;
        checkCode();
        update();
         if (found.length === possibleCodes.length) {
            feedback.attr('text', "");
            platform.validate("stay", function() {});
         }
        // FOR DEBUG (display answers found): 
        // console.log(found);
      };
   }

   //-------------------------------------------------------------------------

   subTask.getGrade = function(callback) {
     var maxScore = 1.0;
     var checked = Beav.Array.make(possibleCodes.length, false);
     var nbChecked = 0;
     for (var iTried = 0; iTried < found.length; iTried++) {
        var code = found[iTried];
        var index = Beav.Array.indexOf(possibleCodes, code);
        if (index != -1) {
           checked[index] = true;
           nbChecked++;
        }
     }
     var completed = (nbChecked == possibleCodes.length);

     var score = 0;
     var message = "";
     if (completed) {
        if (level == "hard") {
           // 100% for 14 moves, 60% for <=16 moves, 40% for <=20 moves, 20% for any number.
           if (counter == bestCounterHard) {
              score = maxScore;
              message = taskStrings.success;
           } else {
              var frac = 2 / 10;
              if (counter <= bestCounterHard+2) {
                 frac = 6 / 10;
              } else if (counter <= bestCounterHard+6) {
                 frac = 4 / 10;
              } 
              score = Math.round(maxScore * frac);
              message = taskStrings.successPartial(counter, bestCounterHard);
          }
        } else {
           score = maxScore;
           message = taskStrings.success;
        }
     }
     callback({
        successRate: score,
        message: message
     });
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);


