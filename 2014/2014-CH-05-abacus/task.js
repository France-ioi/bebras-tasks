function initTask() {
   var seed;
   var difficulty;
   var animateBalls = false;
   var paperWidth = 400;
   var paperHeight = 300;
   var heightSep = 100;
   var radiusX = 14;
   var radiusY = 11;
   var nbDigits = 7;
   var nbUnitBalls = 5;
   var nbFiveBalls = 2;
   var targets = [ // at least a 5 a 0 and a 6/7/8 and a 9, but not on the sides, and first digit less than 5
      1859071,
      2806951,
      4958067,
      1978054,
      4497508,
      3458096,
      2459058,
      3809654,
      1058293
      ];
   var makeInstanceEasy = function() {
      targets = [
         54029, 
         24590,
         29045,
         50945,
         40495
         ];
      nbDigits = 5;
      nbUnitBalls = 9;
      nbFiveBalls = 0;
      heightSep = 0;
   };

   var target;
   var animTask;  // { id, paper, balls, state }
   var animSolution;

   var getTarget = function() {
      var id = seed % targets.length;
      return targets[id];
   };

   task.load = function(views, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         difficulty = taskParams.options.difficulty ? taskParams.options.difficulty : "hard";
         seed = taskParams.randomSeed;
         if (difficulty == "easy") {
            makeInstanceEasy();
         }
         $("." + difficulty).show();

         target = getTarget();
         $("#valueTarget").html(stringOfValue(target));     
         animTask = drawAbacus("abacusTask", true);
         updateDisplay();
         if (views.solution) {
            $("#solutionTarget").html(stringOfValue(target));
            animSolution = drawAbacus("abacusSolution", false);
            animSolution.state = getSolutionState(target);
            updateBalls(animSolution, true);
         }
         callback();
      });
   };

   var getInitState = function() {
      return Beav.Array.init(nbDigits, function(i) { return [0, 0]; });
   };

   var getSolutionState = function() {
      if (difficulty == "easy") {
         return Beav.Array.init(nbDigits, function(i) { 
            var d = Math.floor(target / Math.pow(10, nbDigits-1-i)) % 10;
            return [d, 0]; 
         });         
      } else { // hard
         return Beav.Array.init(nbDigits, function(i) { 
            var d = Math.floor(target / Math.pow(10, nbDigits-1-i)) % 10;
            var a = d % 5;
            var b = Math.floor(d / 5);
            return [a, b]; 
         });
      }
   }

   task.reloadAnswer = function(strAnswer, callback) {
      animTask.state = getInitState();
      if (strAnswer != "") {
         animTask.state = $.parseJSON(strAnswer);
      }
      updateDisplay();
      callback();
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify(animTask.state));
   };

   var stringOfValue = function(value) {
      if (value == 0) {
         return "0";
      }
      var s = "";
      var i = 0;
      while (value > 0) {
         var v = value % 10;
         value = Math.floor(value / 10);
         s = v + s;
         i++;
         if (i % 3 == 0)
            s = " " + s;
      }
      return s;
   };

   var valueOfState = function(state) {
      var value = 0;
      for (var digit = 0; digit < nbDigits; digit++) {
         var pow = Math.pow(10, nbDigits - 1 - digit);
         value += (state[digit][0] + 5 * state[digit][1]) * pow;
      }
      return value;
   };

   var xDigit = function(digit) {
      return (digit + 1) * paperWidth / (nbDigits + 1);
   };

   var drawAbacus = function(objectID, interactive) {
      var paper = Raphael(objectID, paperWidth, paperHeight);   
      paper.clear();
      for (var digit = 0; digit < nbDigits; digit++) {
         Beav.Raphael.lineRelative(paper, xDigit(digit), 0, 0, paperHeight)
              .attr({"stroke-width": 4, stroke: "#DDDDDD"});
      }
      paper.rect(2, 2, paperWidth-4, paperHeight-4)
           .attr({"stroke-width": 4, stroke: "#000000"});
      Beav.Raphael.lineRelative(paper, 0, heightSep, paperWidth, 0)
           .attr({"stroke-width": 4, stroke: "#000000"});
      var balls = [];
      for (var digit = 0; digit < nbDigits; digit++) {
         balls[digit] = [[], []];
         for (var b = 0; b < nbUnitBalls+nbFiveBalls; b++) {
            var id = (b < nbUnitBalls) ? b : b-nbUnitBalls;
            var zone = (b < nbUnitBalls) ? 0 : 1;
            var elem = paper.ellipse(xDigit(digit), 0, radiusX, radiusY)
                    .attr({"stroke-width": 0, stroke: "none", fill: "135-#0000FF:25-#CCCCFF:99"});
              // blue:  .attr({"stroke-width": 0, stroke: "none", fill: "blue"});
              // red:        .attr({"stroke-width": 0, stroke: "none", fill: 135-#CC0000:5-#DDAAAA:95"});
            if (interactive) {
               elem.click(clickHandler(digit, zone, id));
            }
            balls[digit][zone].push(elem);
         }
      }
      return { id: objectID, paper: paper, balls: balls, state: getInitState() };
   };

   var clickHandler = function(digit, zone, id) {
      return function() { toggleAt(digit, zone, id); };
   };

   var toggleAt = function(digit, zone, id) {
      animTask.state[digit][zone] = (animTask.state[digit][zone] > id) ? id : id+1;
      updateDisplay();
      displayHelper.stopShowingResult();
      /* // automatic validation deactivated:
      if (valueOfState(animTask.state) == target) {
         platform.validate("done");
      } 
      */
   };

   var updateBalls = function(anim, skipAnimation) {
      var r = radiusY;
      var y;
      var zone;
      var wd = 2;
      var sp = 2.2;
      var mg = 1.3;
      var speed = 0;
      if (animateBalls) {
         speed = 800;
      }
      var setY = function(elem, y) {
         if (animateBalls && !skipAnimation) {
            elem.animate({cy:y}, speed);
         } else {
            elem.attr({cy:y});
         }
      };
      for (var digit = 0; digit < nbDigits; digit++) {
         zone = 0;
         for (var id = 0; id < nbUnitBalls; id++) {
            if (id < anim.state[digit][zone]) {
               y = heightSep + wd + id * sp * r + mg * r;
            } else {
               y = paperHeight - 2 * wd - (nbUnitBalls - 1 - id) * (sp * r) - mg * r; 
            }
            setY(anim.balls[digit][zone][id], y);
         }
         zone = 1;
         for (var id = 0; id < nbFiveBalls; id++) {
            if (id < anim.state[digit][zone]) {
               y = heightSep - wd - id * (sp * r) - mg * r;
            } else {
               y = 2 * wd + (nbFiveBalls - 1 - id) * sp * r + mg * r;
            }
            setY(anim.balls[digit][zone][id], y);
         }
      }
   }

   task.unload = function(callback) {
      if (animateBalls) {
         stopAnimation();
      }
      callback();
   };

   var stopAnimation = function() {
      for (var digit = 0; digit < nbDigits; digit++) {
         for (var zone = 0; zone < 2; zone++) {
            $.each(balls[digit][zone], function(iElem, elem) {
               elem.stop();
            });
         }
      }
   };

   var updateDisplay = function() {
      var current = valueOfState(animTask.state);
      $("#valueCurrent").html(stringOfValue(current));
      updateBalls(animTask, false);
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null,null, function(taskParams) {
         if (strAnswer == "") {
            callback(taskParams.minScore, 'Les boules ne représentent pas la valeur demandée.');
            return;
         }
         console.error(strAnswer);
         var state = $.parseJSON(strAnswer);
         var value = valueOfState(state);
         var target = getTarget();
         if (value == target) {
            callback(taskParams.maxScore, "Bravo ! vous avez réussi.");
         } else {
            callback(taskParams.minScore, "Les boules ne représentent pas la valeur demandée.");
         }
      });
   }
}
initTask();
