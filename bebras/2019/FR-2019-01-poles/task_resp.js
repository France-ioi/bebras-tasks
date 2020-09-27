function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         paperHeight: 200,
         paperWidth: 320,
         nbPoles: 5,
         // window: 300,
         minJumps: 2
      },
      medium: {
         paperHeight: 300,
         paperWidth: 520,
         nbPoles: 7,
         // window: 500,
         minJumps: 2
      },
      hard: {
         paperHeight: 500,
         paperWidth: 720,
         nbPoles: 15,
         // window: 700,
         minJumps: 3
      }
   };
   var paper;
   var paperWidth;
   var paperHeight;
   var initPaperWidth;
   var initPaperHeight;
   var dragWindow = {};
   var dragAndDrop;
   var nbPoles;
   var deltaH;
   var minJumps;
   var path = [];
   var beaversBall;
   var beaverImageSrc = $("#beaversBall").attr("src");
   var ballOriginPos = {};
   var ballSize;
   var animTime = 600;
   var animSteps = 4;
   var poleW;
   var maxPoleW = 40;
   var dragAreaW;

   var poleAttr = {
      // width: 30,
      stroke: "none",
      fill: "0-rgb(0,100,0)-#3fcc48:60"
   };
   var dragAreaAttr = {
      // width: 45,
      stroke: "none",
      fill: "red",
      opacity: 0
   };
   var markedPoleAttr = {
      // width: 30,
      stroke: "none",
      fill: "0-#000070-#3f48cc:60"
   };
   var placeAttr = {
      stroke: "none",
      fill: "white"
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      nbPoles = data[level].nbPoles;
      minJumps = data[level].minJumps;
      initPaperWidth = data[level].paperWidth;
      initPaperHeight = data[level].paperHeight;
      paperHeight = data[level].paperHeight;
      paperWidth = data[level].paperWidth;  
      initSizeAndPos();
      // dragWindow.height = paperHeight - 70;
      // dragWindow.width = data[level].paperWidth - 20;
      // placeAttr.width = dragWindow.width/nbPoles;
      // placeAttr.height = dragWindow.height;
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function () {
      // console.log("reset")
      stopAnimation();
      initPaper();
      initDragDrop();
      displayHelper.setValidateString(taskStrings["try"]);
      displayHelper.customValidate = check;
      displayError("");
      if (typeof(enableRtl) != "undefined") {
         $("body").attr("dir", "rtl");
         $(".largeScreen #zone_1").css("float", "right");
         $(".largeScreen #zone_2").css("float", "right");
      }
      $(window).resize(resize);   
      clearTimeout(timeOut);  
      timeOut = setTimeout(function(){
         resize(true);
      },1000);
      // resize()
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = Beav.Array.init(nbPoles,function(i){
         if(i >= 2){
            return i;
         }else{
            return 1 - i;
         }
      });
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result;
      getLongestPath();
      if (path.length == 1) {
         result = { successRate: 0, message: "error with answer format" };
      }
      if(minJumps < path.length - 1){
         result = { successRate: 0, message: taskStrings.tooManyJumps(path.length-1, minJumps) };
      }else{
         result = { successRate: 1, message: taskStrings.success };
      }
      return result;
   }

   subTask.unloadLevel = function (callback) {
      stopAnimation();
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initSizeAndPos() {
      dragWindow.width = paperWidth - 20;
      placeAttr.width = dragWindow.width/nbPoles;
      dragAreaW = dragWindow.width / nbPoles;
      poleW = (level != "hard") ? Math.min(maxPoleW,dragAreaW - 10) : dragAreaW - 10;
      ballSize = poleW;
      dragWindow.height = paperHeight - ballSize - 20;
      placeAttr.height = dragWindow.height;
   };

   function initPaper() {
      if(paper){
         subTask.raphaelFactory.remove("paper");
         paper.remove();
      }
      paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);
      $("#paper").css("width",paperWidth);
   };

   var initDragDrop = function() {
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            answer = dragAndDrop.getObjects('poles');
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, type) {
            var cont = this.getContainer(srcCont);
            var raphSet = cont.draggableElements[srcPos].component;
            var x = raphSet.cx;
            var y = (2*paperHeight - dragWindow.height)/2;

            if(x < poleW/2){
               x = poleW/2;
            }else if(x > paperWidth - poleW/2){
               x = paperWidth - poleW/2;
            }
            raphSet.placeAt(x,y);
            if (dstCont == null)
               return false;
            return true;
         }
      });
      var backgroundTarget = paper.rect(-placeAttr.width/2,-placeAttr.height/2).attr(placeAttr);
      dragAndDrop.addContainer({
         ident : 'poles',
         cx : (paperWidth)/2,
         cy : (2*paperHeight - dragWindow.height)/2,
         widthPlace : placeAttr.width,
         heightPlace : placeAttr.height,
         nbPlaces : nbPoles,
         direction : 'horizontal',
         dropMode : 'insertBefore',
         dragDisplayMode : 'preview',
         placeBackgroundArray : [ backgroundTarget ]
      });
      var minHeight = 50;
      var maxHeight = placeAttr.height;

      for (var iPole = 0; iPole < nbPoles; iPole++) {
         deltaH = (maxHeight - minHeight)/(nbPoles - 1);
         var poleHeight = maxHeight - answer[iPole]*deltaH;
         var yPole = -placeAttr.height/2 + (placeAttr.height - poleHeight);
         var dragArea = paper.rect(-dragAreaW/2,yPole).attr(dragAreaAttr).attr({width: dragAreaW, height: poleHeight});
         var pole = paper.rect(-poleW/2,yPole).attr(poleAttr).attr({width: poleW, height: poleHeight});
         if(answer[iPole] === 0){
            ballOriginPos.x = -ballSize/2;
            ballOriginPos.y = yPole - ballSize;
            beaversBall = paper.image(beaverImageSrc,ballOriginPos.x,ballOriginPos.y,ballSize,ballSize);
            var element = paper.set(dragArea,pole,beaversBall);
         }else{
            var element = paper.set(dragArea,pole);
         }
         element.mousedown(function(){
            resetPoles();
         });

         dragAndDrop.insertObject('poles', iPole, {ident : answer[iPole], elements : element } );
      }
   };

   function check() {
      // subTask.resetDisplay();
      resetLayout();
      // REVIEW[ARNAUD]: I changed this to better factorize the code
      var result = getResultAndMessage(); // indirectly calls getLongestPath();
      // DEPRECATED(to cut animation after 2 jumps) path.splice(minJumps + 2);
      jumpAnimation(path, result);
   };

   function getLongestPath() {
      // REVIEW[ARNAUD]: what if answer is empty or 0 does not occur in it? are we sure it's not possible?
      // => answer is an array whose length never changes
      var beaverPos = Beav.Array.indexOf(answer,0);
      path = [];
      var currentPath = [beaverPos];
      findPaths(beaverPos,currentPath);
   };

   function findPaths(index,currentPath) {
      var iMin = 0;
      var iMax = nbPoles - 1;
      for(var j = index - 1; j >=0; j--){
         if(answer[j] < answer[index]){
            iMin = j;
            break;
         }
      }
      for(var k = index + 1; k < nbPoles; k++){
         if(answer[k] < answer[index]){
            iMax = k;
            break;
         }
      }
      for(var i = iMin; i <= iMax; i ++){
         var curPath = JSON.parse(JSON.stringify(currentPath));
         if(answer[i] > answer[index]){
            curPath.push(i);
            findPaths(i,curPath);
         }else{
            if(curPath.length > path.length){
               path = JSON.parse(JSON.stringify(curPath));
            }
         }
      }
   };

   function jumpAnimation(pth, result) {
      var localPath = JSON.parse(JSON.stringify(pth));
      markPole(localPath[0],true);
      if(path.length - localPath.length >= minJumps){
         var t = animTime/3;
      }else{
         var t = animTime;
      }
      if(localPath.length <= 1){
         // animation ends
         if (result.successRate == 1) {
            platform.validate("done");
         } else {
            displayError(result.message);
         }

      }else{
         // REVIEW[ARNAUD]: since you're going to change this code, note that
         // there might be easier way to animate a shape along a path, using
         // function "getPointAtLength" on a Bezier curve, as described in
         //   http://jsfiddle.net/gyeSf/17/
         // => not easier in this case because the coordinates of the ball in the drag containers are different from the paper
         // singleJumpAnimation(1,t,localPath,result);
         var x0 = beaversBall.attrs.x;
         var y0 = beaversBall.attrs.y;
         var dx = placeAttr.width * (localPath[1] - localPath[0]);
         var dy = deltaH * (answer[localPath[1]] - answer[localPath[0]]);

         var newPos = {x:x0+dx,y:y0+dy};

         var step1 = { x: x0 + dx/3, y: y0 };
         var step2 = { x: x0 + 2*dx/3, y: y0 + dy/6 };
         var step3 = { x: x0 + 7*dx/8, y: y0 + dy/2 };
         var step4 = { x: x0 + dx, y: y0 + dy };
         var jump = new Raphael.animation(step1,t/4,"linear",function(){
            subTask.raphaelFactory.animate("jumpAnim",beaversBall,jump2);
         });
         var jump2 = new Raphael.animation(step2,0.8*t/4,"linear",function(){
            subTask.raphaelFactory.animate("jumpAnim",beaversBall,jump3);
         });
         var jump3 = new Raphael.animation(step3,0.6*t/4,"linear",function(){
            subTask.raphaelFactory.animate("jumpAnim",beaversBall,jump4);
         });
         var jump4 = new Raphael.animation(step4,0.3*t/4,"linear",function(){
            localPath.shift();
            markPole(localPath[0],true);
            jumpAnimation(localPath, result);
         });
         subTask.raphaelFactory.animate("jumpAnim",beaversBall,jump);
      }
   };

   function markPole(index,mark) {
      var el = dragAndDrop.getContainer("poles").draggableElements[index];
      if(mark){
         el.component.element[1].attr(markedPoleAttr);
      }else{
         el.component.element[1].attr(poleAttr);
      }
   };

   function stopAnimation() {
      subTask.raphaelFactory.stopAnimate("jumpAnim");
   };

   function resetPoles() {
      displayError("");
      stopAnimation();
      beaversBall.attr(ballOriginPos);
      for(var iAns = 0; iAns < nbPoles; iAns++){
         markPole(iAns,false);
      }
   };

   function displayError(msg) {
      $("#error").html(msg);
   };

   function resize(reset) {
      // var windowW = window.innerWidth;
      var windowW = document.body.clientWidth;
      var windowH = window.innerHeight;
      var newPaperSize = {w:initPaperWidth,h:initPaperHeight}
      var windowRatio = windowW/windowH;
      if(windowRatio > 1){
         $('#task').addClass('largeScreen');
         $('#displayHelperAnswering').appendTo($('#zone_1'));
      }else{
         $('#task').removeClass('largeScreen');
         if ($('#showSolutionButton')) {
            $('#displayHelperAnswering').insertBefore($('#showSolutionButton'));
         }
         else {
            $('#displayHelperAnswering').appendTo($('#task'));
         }
      }
      if(level == "hard"){
         newPaperSize = getNewPaperSize(level);
      }else{
         var hardPaperSize = getNewPaperSize("hard");
         var factor = hardPaperSize.w/data["hard"].paperWidth;
         newPaperSize = {w:initPaperWidth*factor,h:initPaperHeight*factor};
         var xMargin = (windowRatio > 1) ? (windowW - initPaperWidth*factor - 0.36*windowW) : 0;
         newPaperSize.xMargin = xMargin;
      //    var hardDragWindowW = hardPaperSize.w - 20;
      //    var hardPlaceAttrW = hardDragWindowW/data["hard"].nbPoles;
      //    poleW = hardPlaceAttrW - 10;
      //    maxPoleW = poleW;
      //    dragAreaW = poleW + 10;
      //    placeAttr.width = poleW + 10;
      //    dragWindow.width = placeAttr.width * nbPoles;
      //    var paperRatio = initPaperWidth/initPaperHeight;

      //    newPaperSize = { w: Math.max(initPaperWidth,dragWindow.width + 20) };
      //    newPaperSize.h = Math.max(initPaperHeight,newPaperSize.w/paperRatio);
      //    if(windowW >= 1200){
      //       var xGap = windowW - $("#zone_1").width() - newPaperSize.w;
      //       newPaperSize.xMargin = xGap;
      //    }else{
      //       newPaperSize.yMargin = windowH - $("#zone_2").position().top - newPaperSize.h;
      //    }
      }
      paperWidth = newPaperSize.w;
      paperHeight = newPaperSize.h;
      // // $("#paper").css({
      // //    "width": newPaperSize.w,
      // //    "margin": "auto"
      // // });
      // // paper.setSize(newPaperSize.w,newPaperSize.h);
      if(windowRatio > 1){
         $("#paper").css({
            "margin-left": newPaperSize.xMargin/2
         });
         if(level == "hard"){
            // $(".largeScreen #zone_1").css("width",(430 + newPaperSize.xMargin/2))
         }else{
            // $(".largeScreen #zone_1").css("width",(430 + hardPaperSize.xMargin/2))
         }
      }else{
         $("#paper").css({
            margin: "auto",
         });
         // $("#zone_1").css({
         //    width: 770
         // });
      }
      // if(reset){
         // resetLayout();
      // }else{
      //    // var timeOut;
         clearTimeout(timeOut);
         timeOut = setTimeout(resetLayout, 100);
      // }
   };

   function getNewPaperSize(lvl) {
      // console.log("getNewPaperSize")
      // var windowW = window.innerWidth;
      var windowW = document.body.clientWidth;
      var windowH = window.innerHeight;
      var windowRatio = windowW/windowH;
      var initPaperW = data[lvl].paperWidth;
      var initPaperH = data[lvl].paperHeight;
      var newPaperW = initPaperW;
      var newPaperH = initPaperH;
      var xMargin = 0;
      var yMargin = 0;

      // var zone1Pos = $("#zone_1").position();
      var zone1Pos = 80;
      // var zone2Pos = $("#zone_2").position();
      var zone1H = $("#zone_1").height();
      var zone2H = initPaperH + 2*16;
      var paperRatio = initPaperW/initPaperH;
      if(windowRatio <= 1){
         var totalH = zone1Pos + zone1H + zone2H + $("#displayHelperAnswering").height();
         // console.log(zone2Pos.top+" "+zone2H+" "+$("#displayHelperAnswering").height())
         // console.log($("#zone_1").position())
         var yCorr = 40;
         var yGap = windowH - totalH - yCorr;
         var xGap = windowW - initPaperW;
         // console.log(yGap);
         if(yGap > 0 && xGap > 0){
            var availRatio = windowW/(initPaperH + yGap);
            // console.log(availRatio+" "+paperRatio);
            if(availRatio > paperRatio){
               var scale = (initPaperH + yGap)/initPaperH;
            }else{
               var scale = windowW/initPaperW;
            }
            // newPaperW = Math.max(770,initPaperW*scale);
            newPaperW = initPaperW*scale;
            // newPaperH = Math.max(770/paperRatio,initPaperH*scale);
            newPaperH = initPaperH*scale;
         }
         yMargin = yGap +(newPaperH - initPaperH);
      }else{
         var zone1W = 0.36*windowW;
         var totalH = zone1Pos + zone2H;
         var totalW = zone1W + initPaperW;
         var availRatio = (windowW - zone1W)/(windowH - zone1Pos);
         if(availRatio > paperRatio){
            var scale = windowH/initPaperH;
         }else{
            var scale = (0.63*windowW)/initPaperW;
         }
         newPaperW = initPaperW*scale;
         newPaperH = initPaperH*scale;

         if(availRatio > paperRatio){
            xMargin = (windowW - zone1W - newPaperW);
         }
      }
      return { w: newPaperW, h: newPaperH, xMargin: xMargin, yMargin: yMargin }
   };

   function resetLayout() {    
      initPaper();
      initSizeAndPos();
      initDragDrop();
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
// displayHelper.useFullWidth();

