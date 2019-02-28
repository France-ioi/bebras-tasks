function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         maxWeight: 6,
         weights: [ 5, 4, 1, 2],
         solution: [2, 4, 1, 5]
      },
      medium: {
         maxWeight: 10,
         weights: [3, 6, 7, 4, 9, 2, 1, 8],
         solution: [4, 6, 3, 7, 2, 8, 1, 9]
      },
      hard: {
         maxWeight: 14,
         weights: [2, 6, 12, 1, 9, 11, 5, 3, 13, 8, 4, 10],
         solution: [6, 8, 5, 9, 4, 10, 3, 11, 2, 12, 1, 13]
      }
   };
   var paper;
   var dragAndDrop;
   var weights; 
   var maxWeight;
   var colors = ["#FFFF00", "#00FFFF", "#FF00FF", "#8080FF", "#FF8080", "#00FF00", "#FFFFFF", "#A0A0A0", "#FF8080", "#00FF00", "#FFFFFF", "#A0A0A0"];
   var nbBalls; 
   var nbSpacesAfter;
   var bridgeY;
   var bridge;
   var circles = [];
   var radius = 20;
   var space = radius * 2 + 4;
   var fontSize = 20;
   var timeoutId;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      weights = JSON.parse(JSON.stringify(data[level].weights));
      nbBalls = weights.length;
      maxWeight = data[level].maxWeight;
      nbSpacesAfter = nbBalls / 2;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
      }
   };

   subTask.resetDisplay = function() {
      drawBridge();
      replaceCircles();
      initButton();
      displayHelper.hideValidateButton = true;
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = getInitAnswer();
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      stopAnimation();
      callback();
   };

   function getResultAndMessage() {
      var result;
      var nbBallsCrossing = getNbBallsCrossing(answer);
      if (nbBallsCrossing == nbBalls) {
         result = { successRate: 1, message: taskStrings.success };
      } else {
         result = { successRate: 0, message: taskStrings.failure };
      }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initButton() {
      $("#cross_or_retry").off("click");
      $("#cross_or_retry").click(crossOrRetry);
   };

   var getObject = function(id) {
      var circle = paper.circle(0, 0, radius).attr('fill', colors[id]);
      var text = paper.text(0, 0, weights[id]).attr({'font-size' : fontSize, 'font-weight' : 'bold'});
      return [circle, text];
   };

   var getInitAnswer = function() {
      return Beav.Array.init(nbBalls, function(iBall) { return iBall; });
   };

   var getNbBallsCrossing = function(answer) {
      for (var iBall = nbBalls - 2; iBall >= 0; iBall--) {
         if (weights[answer[iBall]] + weights[answer[iBall + 1]] > maxWeight) {
            return nbBalls - iBall - 2;
         }
      }
      return nbBalls;
   };

   var drawBridge = function() {
      paper = subTask.raphaelFactory.create("anim","anim",740, space * 2 + 2 * radius);
      
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, type)
         {
            if (dstCont == null)
               return false;
            return true;
         },
         drop : function(srcCont, srcPos, dstCont, dstPos, type)
         {
            answer = dragAndDrop.getObjects('seq');
         },
         over : function(srcCont, srcPos, dstCont, dstPos)
         {
         }
      });
      dragAndDrop.addContainer({
         ident : 'seq',
         cx : space * (nbBalls / 2), 
         cy : space, 
         widthPlace: space, 
         heightPlace: space,
         nbPlaces : nbBalls,
         dropMode : 'insertBefore',
         dragDisplayMode : 'marker',
         placeBackgroundArray : []
      });
      for (var col = nbBalls; col < nbBalls + 3; col += 2) {
         paper.rect(col * space, space + radius + 3, 1, 20).attr('stroke-width', 3);
      }
      paper.rect(0, space + radius + 3, nbBalls * space, 1).attr('stroke-width',5);
      bridge = paper.rect(nbBalls * space + 5, space + radius + 3, 2 * space - 9, 1).attr({'stroke-width':5, 'stroke': 'orange'});
      paper.rect((nbBalls + 2) * space + 2, space + radius + 3, nbSpacesAfter * space, 1).attr({'stroke-width':5});
      paper.text((nbBalls + 1) * space, space * 2 + radius, "Max " + maxWeight + " kg").attr({'font-size': fontSize, 'font-weight':'bold'});
   };

   var replaceCircles = function() {
      var objects = dragAndDrop.getObjects('seq');
      for (var i = 0; i < objects.length; i++) {
         if (objects[i] != null) {
            dragAndDrop.removeObject('seq', i);
         }
      }
      for (var i = 0; i < nbBalls; i++) {
         dragAndDrop.insertObject('seq',i, {ident : answer[i], elements : getObject(answer[i])});
      }
      for (var iCircle = 0; iCircle < circles.length; iCircle++) {
         circles[iCircle][0].remove();
         circles[iCircle][1].remove();
      }
      circles = [];
      bridgeY = space + radius + 3;
      bridge.attr('y', bridgeY);
      $("#cross_or_retry").text(taskStrings.attempt);
      $("#cross_or_retry").removeAttr('disabled');
      displayHelper.stopShowingResult();
   };

   crossOrRetry = function() {
      if ($("#cross_or_retry").text() == taskStrings.attempt) {
         checkSolution();
      } else {
         replaceCircles();
      }
   };

   var stopAnimation = function() {
      if (timeoutId != -1) {
         clearTimeout(timeoutId);
      }
      if(bridge) {
         bridge.stop();
      }
      for (var iCircle = 0; iCircle < circles.length; iCircle++) {
         circles[iCircle][0].stop();
         circles[iCircle][1].stop();
      }
   };

   function checkSolution() {
      if (circles.length > 0) { // TODO: est-ce censé arriver ?
         return;
      }
      $("#cross_or_retry").attr('disabled', 'disabled');
      var answer = dragAndDrop.getObjects('seq');
      circles = [];
      for (var i = 0; i < nbBalls; i++) {
         dragAndDrop.removeObject('seq', i);
         circles.push(getObject(answer[i]));
      }
      var nbBallsCrossing = getNbBallsCrossing(answer);
      var time = ((nbBallsCrossing + 2) * 200);
      for (var i = 0; i < nbBalls; i++) {
         var ball = answer[i];
         circles[i][0].attr({cx: space * i + radius + 7, cy: space});
         circles[i][1].attr({x: space * i + radius + 7, y: space});
         var x = (i + nbBallsCrossing + 2) * space + radius + 7;
         var crossAnim = new Raphael.animation({"x":x,"cx":x},time);
         subTask.raphaelFactory.animate("crossAnim",circles[i][0],crossAnim);
         subTask.raphaelFactory.animate("crossAnim",circles[i][1],crossAnim);
      }
      if (nbBallsCrossing != nbBalls) {
         var animBridge = Raphael.animation({y: bridgeY + radius}, 100).delay(time);
         subTask.raphaelFactory.animate("animBridge",bridge,animBridge);
         var firstBallFalling = nbBalls - nbBallsCrossing - 2;
         var fallAnim = Raphael.animation({cy: bridgeY, y: bridgeY}, 100).delay(time);
         if (firstBallFalling >= 0) {
            subTask.raphaelFactory.animate("fallAnim",circles[firstBallFalling][0],fallAnim);
            subTask.raphaelFactory.animate("fallAnim",circles[firstBallFalling][1],fallAnim);
         }
         if (firstBallFalling + 1 < nbBalls) {
            subTask.raphaelFactory.animate("fallAnim",circles[firstBallFalling + 1][0],fallAnim);
            subTask.raphaelFactory.animate("fallAnim",circles[firstBallFalling + 1][1],fallAnim);
         }
      }
      timeoutId = setTimeout(function() {
         $("#cross_or_retry").text(taskStrings.putLogsBack);
         $("#cross_or_retry").removeAttr('disabled');
         if (nbBallsCrossing == nbBalls) {
            platform.validate("done");
         } else {
            displayHelper.validate("stay");
         }
      }, time);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
