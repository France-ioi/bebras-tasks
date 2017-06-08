function initTask() {
   var difficulty;
   var paper;
   var dragAndDrop;
   var weighted_circles; // TODO: n'a pas l'air de servir à quoi que ce soit
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
   var fontSize = 20; // 14;
   var timeoutId;

   var getObject = function(id) {
      var circle = paper.circle(0, 0, radius).attr('fill', colors[id]);
         // circle = paper.image("log. png", -radius, -radius, 2*radius, 2*radius);
      var text = paper.text(0, 0, weights[id] /*+ "\nkg"*/ ).attr({'font-size' : fontSize, 'font-weight' : 'bold'});
       $(text.node).css({
         "-webkit-touch-callout": "none",
         "-webkit-user-select": "none",
         "-khtml-user-select": "none",
         "-moz-user-select": "none",
         "-ms-user-select": "none",
         "user-select": "none",
         "cursor" : "default"
      });
      weighted_circles[id] = paper.set();
      weighted_circles[id].push(circle, text);
      weighted_circles[id].weight = weights[id];
      return [circle, text];
   };

   var getInitAnswer = function() {
      return Beav.Array.init(nbBalls, function(iBall) { return iBall; });
   };

   var strAnswerToAnswer = function(strAnswer) {
      if (strAnswer != "") {
         return $.parseJSON(strAnswer);
      }
      return getInitAnswer();
   };

   var getNbBallsCrossing = function(answer) {
      for (var iBall = nbBalls - 2; iBall >= 0; iBall--) {
         if (weights[answer[iBall]] + weights[answer[iBall + 1]] > maxWeight) {
            return nbBalls - iBall - 2;
         }
      }
      return nbBalls;
   };

   task.load = function(views, callback) {
      displayHelper.hideValidateButton = true;
      platform.getTaskParams(null, null, function(taskParams) {
         var difficulty = taskParams.options.difficulty ? taskParams.options.difficulty : "hard";
         if (difficulty == "easy") {
            $(".easy").show();
            maxWeight = 10;
            weights = [3, 6, 7, 4, 9, 2, 1, 8];
         } else {
            $(".hard").show();
            maxWeight = 14;
            weights = [2, 6, 12, 1, 9, 11, 5, 3, 13, 8, 4, 10];
         }

         if (taskParams.initState == "solution") {
            weights = task.solutions[difficulty];
         } 
         
         nbBalls = weights.length;
         nbSpacesAfter = nbBalls / 2;
         if (views.solution) {
            var solution = task.solutions[difficulty];
            $("#textSolution").html(solution.join(", "));
         }

         drawBridge();
         lastAnswer = getInitAnswer();
         task.reloadAnswer("", callback);
      });
   }


   var drawBridge = function() {
      paper = Raphael("anim", 740, space * 2 + 2 * radius);
      weighted_circles = new Array();
      
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
            lastAnswer = dragAndDrop.getObjects('seq');
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

   task.getAnswer = function(callback) {
      callback(JSON.stringify(lastAnswer));
   };
   
   var replaceCircles = function() {
      var objects = dragAndDrop.getObjects('seq');
      for (var i = 0; i < objects.length; i++) {
         if (objects[i] != null) {
            dragAndDrop.removeObject('seq', i);
         }
      }
      for (var i = 0; i < nbBalls; i++) {
         dragAndDrop.insertObject('seq',i, {ident : lastAnswer[i], elements : getObject(lastAnswer[i])});
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

   task.reloadAnswer = function(strAnswer, callback) {      
      stopAnimation();
      var answer = strAnswerToAnswer(strAnswer);
      lastAnswer = answer;
      replaceCircles();
      callback();
   };

   task.crossOrRetry = function() {
      if ($("#cross_or_retry").text() == taskStrings.attempt) {
         task.checkSolution();
      } else {
         replaceCircles();
      }
   };

   task.unload = function(callback) {
      stopAnimation();
      callback();
   };

   var stopAnimation = function() {
      if (timeoutId != -1) {
         clearTimeout(timeoutId);
      }
      bridge.stop();
      for (var iCircle = 0; iCircle < circles.length; iCircle++) {
         circles[iCircle][0].stop();
         circles[iCircle][1].stop();
      }
   };

   task.checkSolution = function() {
      if (circles.length > 0) { // TODO: est-ce censé arriver ?
         return;
      }
      $("#cross_or_retry").attr('disabled', 'disabled');
      var answer = dragAndDrop.getObjects('seq');
      lastAnswer = answer;
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
         circles[i][0].animate({cx: x}, time);
         circles[i][1].animate({x: x}, time);
      }
      if (nbBallsCrossing != nbBalls) {
         var animBridge = Raphael.animation({y: bridgeY + radius}, 100);
         bridge.animate(animBridge.delay(time));
         var firstBallFalling = nbBalls - nbBallsCrossing - 2;
         var anim = Raphael.animation({cy: bridgeY, y: bridgeY}, 100);
         if (firstBallFalling >= 0) {
            circles[firstBallFalling][0].animate(anim.delay(time));
            circles[firstBallFalling][1].animate(anim.delay(time));
         }
         if (firstBallFalling + 1 < nbBalls) {
            circles[firstBallFalling + 1][0].animate(anim.delay(time));
            circles[firstBallFalling + 1][1].animate(anim.delay(time));
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

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         var answer = strAnswerToAnswer(strAnswer);
         var nbBallsCrossing = getNbBallsCrossing(answer);
         if (nbBallsCrossing == nbBalls) {
            callback(taskParams.maxScore, taskStrings.success);
         } else {
            callback(taskParams.noScore, taskStrings.failure);
         }
      });
   }
}

initTask();
