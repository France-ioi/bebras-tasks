function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         targets: [
            54029, 
            24590,
            29045,
            50945,
            40495
         ],
         nbDigits: 5,
         nbUnitBalls: 9,
         nbFiveBalls: 0,
         heightSep: 0
      },
      medium: {
         targets: [ // at least a 5 a 0 and a 6/7/8 and a 9, but not on the sides, and first digit less than 5
            1859071,
            2806951,
            4958067,
            1978054,
            4497508,
            3458096,
            2459058,
            3809654,
            1058293
         ],
         nbDigits: 7,
         nbUnitBalls: 5,
         nbFiveBalls: 2,
         heightSep: 100
      },
      hard: {
         targets: [ // at least a 5 a 0 and a 6/7/8 and a 9, but not on the sides, and first digit less than 5
            185907134,
            280695113,
            495806711,
            197805471,
            449750847,
            345809684,
            245905868,
            380965486,
            105829348
         ],
         nbDigits: 7,
         nbUnitBalls: 5,
         nbFiveBalls: 2,
         heightSep: 100
      }
   };
   var seed;
   var animateBalls = false;
   var paperWidth = 400;
   var paperHeight = 300;
   var radiusX = 14;
   var radiusY = 11;
   var targets;
   var target;
   var nbDigits;
   var nbUnitBalls;
   var nbFiveBalls;
   var heightSep;
   var animTask;  // { id, paper, balls, state }
   var animSolution;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      targets = data[level].targets;
      nbDigits = data[level].nbDigits;
      nbUnitBalls = data[level].nbUnitBalls;
      nbFiveBalls = data[level].nbFiveBalls;
      heightSep = data[level].heightSep;
      seed = subTask.taskParams.randomSeed;
      target = getTarget();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      $("#valueTarget").html(stringOfValue(target));
      animTask = drawAbacus("abacusTask", true); 
      updateDisplay(false);
      if($("#abacusSolution").length > 0){
         $("#solutionTarget").html(stringOfValue(target));
         animSolution = drawAbacus("abacusSolution", false);
         updateBalls(animSolution, true, true);
      }
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = getInitState();
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      if (animateBalls) {
         stopAnimation();
      }
      callback();
   };

   function getResultAndMessage() {
      var value = valueOfState(answer);
      var result = { successRate: 1, message: taskStrings.success };
      if(value != target){
         result = { successRate: 0, message: taskStrings.ballsIncorrectValue };
      }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   var getTarget = function() {
      var id = seed % targets.length;
      return targets[id];
   };

   var getInitState = function() {
      return Beav.Array.init(nbDigits, function(i) { return [0, 0]; });
   };

   var getSolutionState = function() {
      if (level == "easy") {
         return Beav.Array.init(nbDigits, function(i) { 
            var d = Math.floor(target / Math.pow(10, nbDigits-1-i)) % 10;
            return [d, 0]; 
         });         
      } else{ 
         var base = (level == "hard") ? 16 : 10;
         return Beav.Array.init(nbDigits, function(i) { 
            var d = Math.floor(target / Math.pow(base, nbDigits-1-i)) % base;
            var a = d % 5;
            var b = Math.floor(d / 5);
            return [a, b]; 
         });
      }
   }

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
      var base = (level == "hard") ? 16 : 10;
      for (var digit = 0; digit < nbDigits; digit++) {
         var pow = Math.pow(base, nbDigits - 1 - digit);
         value += (state[digit][0] + 5 * state[digit][1]) * pow;
      }
      return value;
   };

   var xDigit = function(digit) {
      return (digit + 1) * paperWidth / (nbDigits + 1);
   };

   var drawAbacus = function(objectID, interactive) {
      var paper = subTask.raphaelFactory.create(objectID,objectID,paperWidth,paperHeight);  
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
      return { id: objectID, paper: paper, balls: balls };
   };

   var clickHandler = function(digit, zone, id) {
      return function() { toggleAt(digit, zone, id); };
   };

   var toggleAt = function(digit, zone, id) {
      answer[digit][zone] = (answer[digit][zone] > id) ? id : id+1;
      updateDisplay(false);
      displayHelper.stopShowingResult();
   };

   var updateBalls = function(anim, skipAnimation, solution) {
      var r = radiusY;
      var y;
      var zone;
      var wd = 2;
      var sp = 2.2;
      var mg = 1.3;
      var speed = 0;
      var state = (!solution) ? answer : getSolutionState(target);
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
            if (id < state[digit][zone]) {
               y = heightSep + wd + id * sp * r + mg * r;
            } else {
               y = paperHeight - 2 * wd - (nbUnitBalls - 1 - id) * (sp * r) - mg * r; 
            }
            setY(anim.balls[digit][zone][id], y);
         }
         zone = 1;
         for (var id = 0; id < nbFiveBalls; id++) {
            if (id < state[digit][zone]) {
               y = heightSep - wd - id * (sp * r) - mg * r;
            } else {
               y = 2 * wd + (nbFiveBalls - 1 - id) * sp * r + mg * r;
            }
            setY(anim.balls[digit][zone][id], y);
         }
      }
   }

   var stopAnimation = function() {
      for (var digit = 0; digit < nbDigits; digit++) {
         for (var zone = 0; zone < 2; zone++) {
            $.each(balls[digit][zone], function(iElem, elem) {
               elem.stop();
            });
         }
      }
   };

   var updateDisplay = function(solution) {
      var current = valueOfState(answer);
      $("#valueCurrent").html(stringOfValue(current));
      updateBalls(animTask,false,solution);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
