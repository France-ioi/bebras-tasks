function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         balls: [1,4,2,0,5]
      },
      medium: {
         balls: [1,2,0,2,3,0,2,1,3,2]
      },
      hard: {
         balls: [4,3,5,2,4,5,1,2,0,5,4,1,3,2,5],
         removeFromCorrSeq: [5,6,8] // indices in array corrSeq
      }
   };

   var paper;
   var paperW = 770;
   var marginX = 20;
   var marginY = 20;
   var flipperW = 731;
   var flipperH = 489;
   var ballR = 17;
   var innerBallR = 10;
   var xFlipper = (paperW - flipperW)/2;
   var yFlipper = marginY;
   var leverW = [14,28];
   var leverH = [46,29];
   var paperH = flipperH + leverH[0] + marginY;
   var springW = 11;
   var springH = 23;
   var xMiddle = xFlipper + 354;
   var yMiddle = 266 - ballR + yFlipper;
   var xLeft = 101 + xFlipper;
   var yLeft = 251 - ballR + yFlipper;
   var xRight = 604 + xFlipper;
   var yRight = 251 - ballR + yFlipper;
   var xSpring = 682 - springW/2 + xFlipper - 1;
   var ySpring = 471 + yFlipper - springH;
   var buttonW = 160;
   var buttonH = 35;
   var xButton = xFlipper + marginX;
   var yButton = yFlipper + flipperH - buttonH; //- marginY;
   var iconSize = 15;

   var rng;
   var balls;
   var nbBalls;
   var ballRaph = [];
   var ballPos = [];
   var baseline, baselineLeft, baselineRight;
   var leverRaph, springRaph;
   var overlay, leverOverlay, backOverlay;
   var animTime = 1000;
   var leverAnimTime = 100;
   var shiftAnimTime = 200;
   var leftPath, rightPath, middlePath;
   var maxHole = 3;
   var maxSeq = 12;
   var undoButton;
   var sim;
   var canBePlayed;
   var lid;

   var backgroundSrc = $("#background").attr("src");
   var backgroundHardSrc = $("#background_hard").attr("src");
   var lidSrc = $("#lid").attr("src");
   // var lever1Src = $("#lever_1").attr("src");
   // var lever2Src = $("#lever_2").attr("src");
   var leverSrc = $("#lever").attr("src");
   // var springSrc = $("#spring").attr("src");
   // var spring2Src = $("#spring_2").attr("src");
   var undoSrc = $("#undo").attr("src");


   var colors = {
      yellow: "#f5a623",
      blue: "#4a90e2",
      black: "#4a4a4a",
      darkBlue: "#285a8c",
      red: "#fa004c",
      purple: "#f900eb",
      deepBlue: "#2e5ee9",
      lightGreen: "#0bfb9c",
      orange: "#fea307",
      cyan: "#07f1ec"
   };
   var ballColors = [ "red", "purple", "deepBlue", "lightGreen", "orange", "cyan" ];

   var baselineAttr = {
      stroke: "red",
      "stroke-width": 3,
      opacity: 0.5
   };
   var numberAttr = {
      "font-size": 14,
      "font-weight": "bold",
      fill: colors.black
   };
   var overlayAttr = {
      stroke : "none",
      fill: "red",
      opacity: 0
   };
      var buttonAttr = {
      stroke: "none",
      fill: colors.blue,
      width: buttonW,
      height: buttonH,
      r: buttonH/2
   };
   var buttonTextAttr = {
      "font-size": 13,
      "font-weight": "bold",
      fill: "white"
   };

   var ballAttr = {
      stroke: "none",
      r: ballR
   };
   var innerCircleAttr = {
      stroke: "none",
      fill: "white",
      r: innerBallR
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      balls = data[level].balls.slice();
      nbBalls = balls.length;

      // subTask.taskParams.randomSeed = Math.floor(Date.now()); // FOR TESTING
      rng = new RandomGenerator(subTask.taskParams.randomSeed + level.charCodeAt(0));

      randomizeInstance();
   };

   function randomizeInstance() {
      // compute the maxDigit from the array balls
      var maxDigit = 0;
      for (var iBall = 0; iBall < nbBalls; iBall++) {
         maxDigit = Math.max(maxDigit, balls[iBall]);
      }
      // prepare an array to represent the shifting of the digits
      var nbDigitsUsed = maxDigit + 1;
      var shift = Beav.Array.make(nbDigitsUsed, 0);
      // pick random positions for shifting by one unit
      var nbShifts = rng.nextInt(0, 10 - nbDigitsUsed);
      for (var iShift = 0; iShift < nbShifts; iShift++) {
         var digit = rng.nextInt(0, nbDigitsUsed);
         shift[digit]++;
      }

      // compute prefix-sum array
      for (var digit = 1; digit < nbDigitsUsed; digit++) {
         shift[digit] += shift[digit-1];
      }
      // apply the translation to digits from the array balls
      for (var iBall = 0; iBall < nbBalls; iBall++) {
         var digit = balls[iBall];
         balls[iBall] = digit + shift[digit];
      }
   }

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      rng.reset(answer.seed);
      canBePlayed = answer.hist.length;
   };

   subTask.resetDisplay = function () {
      displayError("");
      initPaper();
      initFlipper();
      initTrajectories();
      initUndo();
      initHandlers();

      displayHelper.customValidate = checkResult;
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
      var defaultAnswer = {
         seed: rng.nextInt(0,1000),
         hist: []
      };
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result
   };

   subTask.unloadLevel = function (callback) {
      if(sim){
         subTask.raphaelFactory.destroyAll();
         subTask.simulationFactory.destroyAll();
      }
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);
   };

   function initFlipper() {
      var w = flipperW;
      var h = flipperH;
      var x0 = xFlipper;
      var y0 = yFlipper;
      var bgSrc = (level != "hard") ? backgroundSrc : backgroundHardSrc;

      paper.image(bgSrc,x0,y0,w,h);
      initBalls();
      initLever();

      var lid = paper.image(lidSrc,x0,y0,w,h);

      var yOverlay = y0 + 20;
      var hOverlay = 45;
      var middle = x0 + flipperW / 2;
      var backStart = 180;
      backOverlay = paper.rect(x0,y0+backStart,w,h-backStart).attr(overlayAttr);
      overlay = [];
      overlay[0] = paper.rect(middle - 155,yOverlay,90,90).attr(overlayAttr);
      overlay[2] = paper.rect(middle -  60,yOverlay,90,90).attr(overlayAttr);
      overlay[1] = paper.rect(middle +  40,yOverlay,90,90).attr(overlayAttr);
      leverOverlay.toFront();
   };

   function initBalls() {
      var x1 = 682 + xFlipper;
      var y1 = 442 - ballR + yFlipper;
      var x2 = 181 + xFlipper;
      var y2 = 415 - ballR + yFlipper;
      baseline = paper.path("M"+x1+" "+y1+",L"+x2+" "+y2).attr(baselineAttr).toBack();

      baselineLeft = paper.path("M"+xMiddle+" "+yMiddle+",L"+xLeft+" "+yLeft).attr(baselineAttr).toBack();
      baselineRight = paper.path("M"+xMiddle+" "+yMiddle+",L"+xRight+" "+yRight).attr(baselineAttr).toBack();

      updateBallPos();
   };

   function initLever() {
      // paper.setStart();
      // for(var iLever = 0; iLever < 2; iLever++){
      //    var src = (iLever == 0) ? lever1Src : lever2Src;
      //    var w = leverW[iLever];
      //    var h = leverH[iLever];
      //    var xLever = 682 - w/2 + xFlipper - iLever;
      //    var yLever = 471 + yFlipper - iLever*leverH[1];
      //    paper.image(src,xLever,yLever,w,h);
      // }
      // leverRaph = paper.setFinish();
      var w = 28;
      var h = 75;
      var yLever = 471 + yFlipper - leverH[1];
      var xLever = 681 - w/2 + xFlipper;

      leverRaph = paper.image(leverSrc,xLever,yLever,w,h);

      // springRaph = paper.image(spring2Src,xSpring,ySpring,springW,springH);
      var xOverlay = xFlipper + 657;
      var yOverlay = yFlipper + flipperH - 70;
      var wOverlay = 50;
      var hOverlay = 110;
      leverOverlay = paper.rect(xOverlay,yOverlay,wOverlay,hOverlay).attr(overlayAttr);
   };

   function initTrajectories() {
      var path1 = "m 702.47444,445.2953 0.056,-224.59706 C 704.18093,176.94479 653.69497,117.3312 624.77935,97.50696 585.88848,69.22269 525.27932,67.20238 507.09658,68.21253 488.91383,69.22269 419.21331,63.16177 344.46202,103.56787 269.71073,143.97398 118.04571,228.82679 118.04571,228.82679 l 8.14105,25.54968 246.55953,14.85642";
      var path2 = "m 702.47444,445.2953 0.056,-224.59706 C 704.18093,176.94479 653.69497,117.3312 624.77935,97.50696 585.88848,69.22269 542.95699,71.74807 524.77425,72.75822 c -12.89857,0.5161 -72.44124,11.96242 -77.80205,59.11423 74.75129,40.40611 182.11753,88.52577 182.11753,88.52577 l -12.28391,33.97825 -244.05953,14.85642";
      leftPath = paper.path(path1).attr(baselineAttr).toBack();
      rightPath = paper.path(path2).attr(baselineAttr).toBack();
      if(level == "hard"){
         var path3 = "m 702.47444,445.2953 0.056,-224.59706 C 704.18093,176.94479 653.69497,117.3312 624.77935,97.50696 585.88848,69.22269 525.27932,67.20237 507.09658,68.21253 c -9.09137,0.50508 -66.41754,-3.15672 -117.87218,32.89309 -24.18052,22.41277 -15.72049,55.7478 -17.48826,104.99273";
         middlePath = paper.path(path3).attr(baselineAttr).toBack();
      }
   };

   function initUndo() {
      var rect = paper.rect(xButton,yButton).attr(buttonAttr);
      var xText = xButton + buttonW/2;
      var yText = yButton + buttonH/2;
      var text = paper.text(xText,yText,taskStrings.undo.toUpperCase()).attr(buttonTextAttr);
      var xIcon = xButton + marginX;
      var yIcon = yText - iconSize/2;
      var icon = paper.image(undoSrc,xIcon,yIcon,iconSize,iconSize);
      undoButton = paper.set(rect,text,icon);
   };

   function initHandlers() {
      function getClickHandler(side) {
         return function(ev) {
            clickHandler(ev, side);
         }
      }
      for (var side = 0; side < 3; side++) {
         if (level != "hard" && side == 2) {
            continue;
         }
         overlay[side].click(getClickHandler(side));
         overlay[side].attr("cursor","pointer");
      }
      backOverlay.click(function() {
         displayHelper.showPopupMessage(taskStrings.click, "blanket");
      });
      leverOverlay.click(function() {
         displayHelper.showPopupMessage(taskStrings.click, "blanket");
      });

      undoButton.click(undo);
      undoButton.attr("cursor","pointer");
   };

   function undo() {
      displayError("");
      if(answer.hist.length < 1 || sim && sim.isPlaying()){
         return
      }
      answer.hist.pop();
      updateBallPos();
      canBePlayed = answer.hist.length;
   };

   function updateBallPos() {
      updateBottomBalls();
      updateTopBalls();
   };

   function updateBottomBalls() {
      var firstIndex = answer.hist.length;
      for(var iBall = firstIndex; iBall < nbBalls; iBall++){
         var length = (iBall - firstIndex)*2*ballR;
         var pos = baseline.getPointAtLength(length);
         placeBall(iBall,pos.x,pos.y);
      }
   };

   function updateTopBalls() {
      var launched = getSeqAndHole();
      var seq = launched.seq;
      var hole = launched.hole;
      for(var iBall = 0; iBall < seq.length; iBall++){
         var length = Math.abs(seq.length/2 - iBall - 1/2)*2*ballR;;
         if(iBall < seq.length/2){
            var pos = baselineLeft.getPointAtLength(length);
         }else{
            var pos = baselineRight.getPointAtLength(length);
         }
         var ballID = seq[iBall];
         placeBall(ballID,pos.x,pos.y);
      }
      for(var iBall = 0; iBall < hole.length; iBall++){
         var y = yFlipper + 185 - iBall*2*ballR;
         var ballID = hole[iBall];
         placeBall(ballID,xMiddle,y);
      }
   };


   function placeBall(id,x,y) {
      // var src = $("#ball_"+(id%6 + 1)).attr("src");
      var ballCol = colors[ballColors[id%6]];
      var number = balls[id];
      // var xBall = x - ballR;
      // var yBall = y - ballR;
      if(!ballRaph[id]){
         // var ball = paper.image(src,xBall,yBall,2*ballR,2*ballR);
         var circle = paper.circle(x,y,ballR).attr(ballAttr).attr("fill",ballCol);
         var innerCircle = paper.circle(x,y,innerBallR).attr(innerCircleAttr);
         // var ball = paper.set(circle,)
         var numberRaph = paper.text(x,y,number).attr(numberAttr);
         // ballRaph[id] = paper.set(ball,numberRaph);
         ballRaph[id] = paper.set(circle,innerCircle,numberRaph);
      }else{
         // ballRaph[id][0].attr({x: xBall, y: yBall });
         // ballRaph[id][1].attr({x: x, y: y });
         ballRaph[id].attr({x: x, y: y, cx: x, cy: y });
      }
      ballPos[id] = { x: x, y: y };
   };

   function clickHandler(ev, dir) {
      displayError("");
      var ballID = answer.hist.length;
      if(canBePlayed != ballID || ballID >= nbBalls){
         return
      }
      var launched = getSeqAndHole();
      if (dir == 2 && launched.hole.length == maxHole){
         // displayError(taskStrings.maxHole);
         displayHelper.showPopupMessage(taskStrings.maxHole,"blanket");
         return
      }
      if(level == "hard" && dir != 2 && launched.seq.length >= maxSeq){
         displayError(taskStrings.maxSeq(maxSeq));
         return
      }
      runAnim(dir,ballID);
   };

   function getSeqAndHole() {
      var hole = [];
      var seq = [];
      for(var iBall = 0; iBall < answer.hist.length; iBall++){
         var dir = answer.hist[iBall];
         if(dir == 2){
            hole.push(iBall);
         }else if(dir == 0){
            seq.unshift(iBall);
         }else{
            seq.push(iBall);
         }
      }
      return { seq: seq, hole: hole }
   };

   function runAnim(dir,ballID) {
      sim = subTask.simulationFactory.create("sim_"+ballID);
      if(dir == 0){
         var path = leftPath;
      }else if(dir == 1){
         var path = rightPath;
      }else{
         var path = middlePath;
      }
      var launched = getSeqAndHole();
      var currLength = 0;
      var totalLength = path.getTotalLength();
      var stepLength = 10;
      var nbSteps = Math.floor(totalLength/stepLength);
      var finalX, finalY;

      if(launched.seq.length == 0){
         finalX = xMiddle;
      }else{
         var lastBall = (dir == 0) ? launched.seq[0] : launched.seq[launched.seq.length - 1];
         var x = ballPos[lastBall].x;
         finalX = (dir == 0) ? x - 2*ballR : x + 2*ballR;
      }
      if(dir == 2){
         if(launched.hole.length == 0){
            finalY = yFlipper + 185;
         }else{
            var lastBall = launched.hole[launched.hole.length - 1];
            finalY = ballPos[lastBall].y - 2*ballR;
         }
      }

      answer.hist.push(dir);

      var simStep = new SimulationStep();
      animLever(simStep);
      var shiftParent;
      var stop = false;
      do{
         var currPos = path.getPointAtLength(currLength);
         var duration = animTime/nbSteps;
         var allowNext = false;
         var currStep = setCurrStep(dir,currLength,stepLength,totalLength);
         if(currLength > 300){
            allowNext = true;
         }
         var simAction = { onExec: moveBall(ballID,dir,false,allowNext), duration: duration, params: { x: currPos.x, y: currPos.y } };
         var entryName = "entry"+currLength;
         var simEntry = { name: entryName, action: simAction };
         simStep.addEntryAllParents(simEntry);
         currLength += currStep;
         if(currLength > ballR && !shiftParent){
            shiftParent = entryName;
         }
         if(dir == 0 && currLength > 950 && currPos.x > finalX - stepLength){
            stop = true;
         }else if(dir == 1 && currLength > 820 && currPos.x < finalX + stepLength){
            stop = true;
         }else if(dir == 2 && currLength > 600 && currPos.y > finalY - stepLength){
            stop = true;
         }
      }while(currLength < totalLength && !stop);

      var final = false;
      if((dir == 0 && currPos.x < finalX) || (dir == 1 && currPos.x > finalX) || launched.seq.length == nbBalls - 1){
         var simAction = { onExec: moveBall(ballID,dir,true), duration: duration, params: { x: finalX, y: getYFromX(finalX,dir) } };
         var simEntry = { name: "final_entry", action: simAction };
         simStep.addEntryAllParents(simEntry);
         final = true;
      }else if(dir == 2 && currPos.y < finalY){
         var simAction = { onExec: moveBall(ballID,dir,true), duration: duration, params: { x: xMiddle, y: finalY } };
         var simEntry = { name: "final_entry", action: simAction };
         simStep.addEntryAllParents(simEntry);
         final = true;
         ballPos[ballID] = { x: xMiddle, y: finalY };
      }
      if(final){
         if(dir == 0){
            launched.seq.unshift(ballID);
         }else if(dir == 1){
            launched.seq.push(ballID);
         }else if(dir == 2){
            launched.hole.push(ballID);
         }
      }
      sim.addStep(simStep);
      animBallShift(simStep,shiftParent);
      if(dir != 2){
         var simStep2 = new SimulationStep();
         animCenterBalls(simStep2,dir,ballID);
         sim.addStep(simStep2);
      }
      sim.setAutoPlay(true);
      sim.play();
   };

   function setCurrStep(dir,currLength,stepLength,totalLength) {
      var currStep;
      if(dir == 0){
         if(currLength < 200){
            currStep = stepLength*2.5;
         }else if(currLength < 300){
            currStep = stepLength*2;
         }else if(currLength < 700){
            currStep = stepLength*1.5;
         }else if(currLength < 900){
            currStep = 1.5*stepLength*currLength/900;
         }else if(currLength < 950){
            currStep = stepLength;
         }else{
            currStep = 0.5*stepLength*totalLength/currLength;
         }
      }else if(dir == 1){
         if(currLength < 200){
            currStep = stepLength*2;
         }else if(currLength < 300){
            currStep = stepLength*1.5;
         }else if(currLength < 450){
            currStep = stepLength*(1.5 - currLength/600);
         }else if(currLength < 585){
            currStep = stepLength*currLength/585;
         }else if(currLength < 765){
            currStep = stepLength*0.6*currLength/765;
         }else if(currLength < 820){
            currStep = stepLength;
         }else{
            currStep = 0.5*stepLength*totalLength/currLength;
         }
      }else{
         if(currLength < 200){
            currStep = stepLength*3.5;
         }else if(currLength < 300){
            currStep = stepLength*2.5;
         }else if(currLength < 470){
            currStep = stepLength*(2 - currLength/600);
         }else if(currLength < 640){
            currStep = 1.5*stepLength*currLength/620;
         }else{
            currStep = 0.5*stepLength*totalLength/currLength;
         }
      }
      return currStep
   };

   function moveBall(id,dir,final,allowNext){
      return function(params,duration,callback) {
         if(allowNext && canBePlayed == id){
            canBePlayed++;
         }
         var newPos = { x: params.x, y: params.y, cx: params.x, cy: params.y };

         // var paramsImg = { x: params.x - ballR, y: params.y - ballR };
         var anim = new Raphael.animation(newPos,duration,callback);
         // var animImg = new Raphael.animation(paramsImg,duration,callback);
         // subTask.raphaelFactory.animate("anim0",ballRaph[id][0],animImg);
         // subTask.raphaelFactory.animate("anim1",ballRaph[id][1],anim);
         subTask.raphaelFactory.animate("anim1",ballRaph[id],anim);
         if(final){
            return { stop: function() {
               subTask.simulationFactory.destroy("sim_"+id);
            }};
         }
      }
   };

   function animBallShift(simStep,parent) {
      var firstBall = answer.hist.length;
      for(var iBall = firstBall; iBall < nbBalls; iBall++){
         var length = (iBall - firstBall)*2*ballR;
         var pos = baseline.getPointAtLength(length);
         var simAction = { onExec: shiftBall(iBall), duration: 200, params: pos };
         var simEntry = { name: "shift_entry"+iBall, action: simAction, parents: [parent] };
         simStep.addEntry(simEntry);
         ballPos[iBall] = pos;
      }
   };

   function animCenterBalls(simStep,dir,id) {
      var launched = getSeqAndHole();
      var seq = launched.seq;
      for(var iBall = 0; iBall < seq.length; iBall++){
         var length = Math.abs(seq.length/2 - iBall - 1/2)*2*ballR;;
         if(iBall < seq.length/2){
            var pos = baselineLeft.getPointAtLength(length);
         }else{
            var pos = baselineRight.getPointAtLength(length);
         }
         var end = (iBall == seq.length - 1);
         var final = (seq.length + launched.hole.length == nbBalls);
         var simAction = { onExec: shiftBall(seq[iBall],end,final), duration: shiftAnimTime, params: pos };
         var simEntry = { name: "center_entry"+iBall, action: simAction };
         simStep.addEntry(simEntry);
         ballPos[seq[iBall]] = pos;
      };
   };

   function shiftBall(id,end,final) {
      return function(params,duration,callback) {
         var newPos = { x: params.x, y: params.y, cx: params.x, cy: params.y };
         var anim = new Raphael.animation(newPos,duration,callback);
         // var animImg = new Raphael.animation({ x: params.x - ballR, y: params.y - ballR },duration,callback);
         // subTask.raphaelFactory.animate("anim0",ballRaph[id][0],animImg);
         // subTask.raphaelFactory.animate("anim1",ballRaph[id][1],anim);
         subTask.raphaelFactory.animate("anim1",ballRaph[id],anim);
         if(end){
            return { stop: function() {
               subTask.simulationFactory.destroy("sim_"+id);
               if(final){
                  checkResult();
               }
            }};
         }
      }
   };

   function animLever(simStep) {
      var duration1 = leverAnimTime;
      var duration2 = leverAnimTime/10;
      var simAction1 = { onExec: moveLever, duration: duration1, params: { step: 0 } };
      var simEntry1 = { name: "lever_entry1", action: simAction1 };
      var simAction2 = { onExec: moveLever, duration: duration2, params: { step: 1 } };
      var simEntry2 = { name: "lever_entry2", action: simAction2 };
      simStep.addEntryAllParents(simEntry1);
      simStep.addEntryAllParents(simEntry2);
   };

   function moveLever(params,duration,callback) {
      var step = params.step;
      if(step == 0){
         var trLever = { transform: "t 0 "+(springH - 5) };
         var trSpring = { transform: "s 1 "+(1 - (springH - 5)/springH)+" "+xSpring+" "+(ySpring + springH) };
         var easing = ">";
      }else{
         var trLever = { transform: "" };
         var trSpring = { transform: "" };
         var easing = "elastic"
      }
      var anim = new Raphael.animation(trLever,duration,easing,callback);
      subTask.raphaelFactory.animate("anim0",leverRaph,anim);
      // var animSpring = new Raphael.animation(trSpring,duration,easing,callback);
      // subTask.raphaelFactory.animate("anim1",springRaph,animSpring);
   };

   function getYFromX(x,dir) {
      if(dir == 0){
         var a = (yMiddle - yLeft)/(xMiddle - xLeft);
         var b = yMiddle - a*xMiddle;
      }else{
         var a = (yMiddle - yRight)/(xMiddle - xRight);
         var b = yMiddle - a*xMiddle;
      }
      var y = a*x + b;
      return y
   };

   function eq(val1,val2) {
      if(val1 == val2){
         return true
      }
      return false
   };

   function checkResult(noVisual) {
      var launched = getSeqAndHole();
      var seq = launched.seq;
      var error = null;
      if(seq.length == 0){
         error = taskStrings.click;
      }else if(seq.length + launched.hole.length < nbBalls){
         error = taskStrings.missingBall;
      }
      if(error){
         if(!noVisual){
            displayError(error)
         }
         return { successRate: 0, message: error }
      }
      var corrSeq = [];
      for(var iBall = 0; iBall < nbBalls; iBall++){
         var number = balls[iBall];
         if(corrSeq.length == 0 || corrSeq[0] <= number){
            corrSeq.unshift(number);
         }else{
            corrSeq.push(number);
         }
      }
      if(level == "hard"){
         var removals = data[level].removeFromCorrSeq;
         for(var iRemove = removals.length-1; iRemove >= 0; iRemove--) {
            var index = removals[iRemove];
            corrSeq.splice(index,1);
         }
      }

      var nb = "";
      for(var iBall = 0; iBall < seq.length; iBall++){
         nb += balls[seq[iBall]];
      }

      for(var iBall = 0; iBall < corrSeq.length; iBall++){
         if(balls[seq[iBall]] != corrSeq[iBall]){
            var error = taskStrings.fail(nb);
            if(!noVisual){
               displayError(error)
            }
            return { successRate: 0, message: error }
         }
      }

      if(!noVisual){
         platform.validate("done");
      }
      return { successRate: 1, message: taskStrings.success(nb) }
   };

   function displayError(msg) {
      $("#displayHelper_graderMessage").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
