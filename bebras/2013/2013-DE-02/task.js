function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         nbLoops: 3
      },
      medium: {
         nbLoops: 4
      },
      hard: {
         nbLoops: 5
      }
   };

   var paper;
   var cellW = 200;
   var paperW = 3*cellW;
   var paperH = 2*cellW;
   var marginX = 10;
   var marginY = 10;
   var imageW = cellW - 2*marginX;

   var nbImages = 6;
   var nbLoops;

   var clickArea = [];
   var selectionFrame = [];

   var imgAttr = {
      width: imageW,
      height: imageW,
      stroke: "none",
      fill: "grey"
   };
   var circleAttr = {
      stroke: "grey"
   };
   var rectAttr = {
      stroke: "grey"
   };
   var clickAreaAttr = {
      stroke: "none",
      fill: "red",
      opacity: 0
   };
   var unselectedAttr = {
      stroke: "none",
      fill: "none",
      r: 5
   };
   var selectedAttr = {
      stroke: "lightGreen",
      fill: "lightGreen",
      r: 5
   };
   var wrongImageAttr = {
      stroke: "red",
      fill: "red",
      r: 5
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      nbLoops = data[level].nbLoops;
      rng = new RandomGenerator(subTask.taskParams.randomSeed + level.charCodeAt(0));
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(answer){
         rng.reset(answer.seed);
      }
   };

   subTask.resetDisplay = function () {
      displayError("");
      initPaper();
      initImages();
      if(!answer.waitForRetry){
         initHandlers();
         displayHelper.setValidateString(taskStrings.validate);
         displayHelper.customValidate = checkResult;
      }else{
         displayHelper.setValidateString(taskStrings.retry);
         displayHelper.customValidate = retry;
         displayError(taskStrings.failure);
         for(var iImage = 0; iImage < nbImages; iImage++){
            if(answer.selected[iImage]){
               var imgID = answer.order[iImage];
               if(imgID > 2){
                  selectionFrame[iImage].attr(wrongImageAttr);
               }
            }
         }
      }
      displayHelper.confirmRestartAll = false;
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = { 
         seed: rng.nextInt(0,10000), 
         order: [0,1,2,3,4,5], 
         selected: Beav.Array.make(nbImages,false),
         waitForRetry: false
      };
      rng.shuffle(defaultAnswer.order);
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result;
   }

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);
      $("#paper").css("width", paperW);
   };

   function initImages() {
      for(var iImage = 0; iImage < nbImages; iImage++){
         var x = marginX + (iImage%3)*cellW;
         var y = (iImage < 3) ? marginY : marginY + cellW;
         selectionFrame[iImage] = paper.rect(x - marginX/2,y - marginY/2, cellW - marginX, cellW - marginY);
         if(answer.selected[iImage]){
            selectionFrame[iImage].attr(selectedAttr);
         }else{
            selectionFrame[iImage].attr(unselectedAttr);
         }
         drawImage(x,y,answer.order[iImage]);
         clickArea[iImage] = paper.rect(x, y, imageW, imageW).attr(clickAreaAttr);
      }
   };

   function initHandlers() {
      for(var iImage = 0; iImage < nbImages; iImage++){
         clickArea[iImage].click(select(iImage));
         clickArea[iImage].attr("cursor","pointer");
      }
   };

   function removeHandlers() {
      for(var iImage = 0; iImage < nbImages; iImage++){
         clickArea[iImage].unclick();
         clickArea[iImage].attr("cursor","auto");
      }
   };

   function drawImage(x,y,id) {
      var greyBG = true;
      var fixedR = true;
      var nbCircles = nbLoops;
      var nbSquares = nbLoops;
      var squareBehindCircle = false;
      var addWhiteCircle = false;
      var addBlackSquare = false;
      var circleColors = (level == "easy") ? ["black"] : ["black","white"];
      var squareColors = (level != "hard") ? ["white"] : ["black","white"]; 

      switch(id){
         case 3:
            if(level == "easy"){
               nbCircles = nbLoops - 1;
            }else if (level == "medium"){
               addBlackSquare = true;
            }else{
               squareBehindCircle = true;
            }
            break;
         case 4:
            if(level == "easy"){
               nbSquares = nbLoops + 1;
               break;
            }
         case 5:
            if(level == "easy"){
               addWhiteCircle = true;
            }else{
               fixedR = false;
            }
            break;
      }

      runAlgo({
         x: x,
         y: y,
         greyBG: greyBG,
         fixedR: fixedR,
         nbCircles: nbCircles,
         nbSquares: nbSquares,
         squareBehindCircle: squareBehindCircle,
         circleColors: circleColors,
         squareColors: squareColors,
         addWhiteCircle: addWhiteCircle,
         addBlackSquare: addBlackSquare
      });
   };

   function runAlgo(data) {
      var x = data.x;
      var y = data.y;
      var circleColors = data.circleColors;
      var squareColors = data.squareColors;
      var minSize = 10;
      var R = rng.nextInt(1,10)*2 + minSize;
      var bg = paper.rect(x,y).attr(imgAttr);
      var currCirclePos = [];
      var currRectPos = [];
      for(var iDraw = 0; iDraw < Math.max(data.nbCircles,data.nbSquares); iDraw++){
         var circleR = (data.fixedR) ? R : minSize + iDraw*4;
         var circleColorID = rng.nextInt(0,circleColors.length - 1);
         var squareColorID = rng.nextInt(0,squareColors.length - 1);
         var rectW = rng.nextInt(1,10)*2 + 2*minSize;
         if(!data.squareBehindCircle){
            if(currCirclePos.length < data.nbCircles){
               var circlePos = generateNewPos(x,y,currCirclePos,currRectPos,circleR,"circle");
               currCirclePos.push(circlePos);
               if(data.addWhiteCircle && iDraw == 1){
                  addShape(circlePos,"white",circleR,"circle");
               }else{
                  addShape(circlePos,circleColors[circleColorID],circleR,"circle");
               }
            }
            if(currRectPos.length < data.nbSquares){
               var rectPos = generateNewPos(x,y,currCirclePos,currRectPos,rectW,"rect");
               currRectPos.push(rectPos);
               var rect = paper.rect(rectPos.x,rectPos.y,rectW,rectW).attr(rectAttr);
               if(data.addBlackSquare && iDraw == 1){
                  addShape(rectPos,"black",rectW,"rect");
               }else{
                  addShape(rectPos,squareColors[squareColorID],rectW,"rect");
               }
            }
         }else{
            if(currRectPos.length < data.nbSquares){
               var rectPos = generateNewPos(x,y,currCirclePos,currRectPos,rectW,"rect");
               currRectPos.push(rectPos);
               if(data.addBlackSquare && iDraw == 1){
                  addShape(rectPos,"black",rectW,"rect");
               }else{
                  addShape(rectPos,squareColors[squareColorID],rectW,"rect");
               }
            } 
            if(currCirclePos.length < data.nbCircles){
               var circlePos = generateCirclePosAboveRect(x,y,currCirclePos,rectPos,circleR);
               currCirclePos.push(circlePos);
               if(data.addWhiteCircle && iDraw == 1){
                  addShape(circlePos,"white",circleR,"circle");
               }else{
                  addShape(circlePos,circleColors[circleColorID],circleR,"circle");
               }
            }
         }
      }
   };

   function addShape(pos,color,size,type) {
      if(type == "circle"){
         var shape = paper.circle(pos.x,pos.y,size).attr(circleAttr);
      }else{
         var shape = paper.rect(pos.x,pos.y,size,size).attr(rectAttr);
      }
      shape.attr("fill",color);
   };

   function generateNewPos(x,y,currCirclePos,currRectPos,size,type) {
      if(type == "circle"){
         var minX = x + size;
         var minY = y + size;
      }else{
         var minX = x;
         var minY = y;
      }
      var maxX = x + imageW - size;
      var maxY = y + imageW - size;
      var nbIter = 0;
      do{
         var newX = rng.nextInt(minX,maxX);
         var newY = rng.nextInt(minY,maxY);
         var safeDist = true;
         for(var iType = 0; iType < 2; iType++){
            var currPos = (iType) ? currRectPos : currCirclePos;
            for(var iPos = 0; iPos < currPos.length; iPos++){
               var pos = currPos[iPos];
               if((type == "circle" && iType == 0) || (type == "rect" && iType == 1)){
                  var d = Beav.Geometry.distance(pos.x,pos.y,newX,newY);
                  var minDist = (type == "circle") ? Math.max(pos.size,size) : Math.max(pos.size/2,size/2);
               }else if(iType == 0 && type == "rect"){
                  var d = Beav.Geometry.distance(pos.x,pos.y,newX + size/2,newY + size/2);
                  var minDist = Math.max(pos.size,size/2);
               }else{
                  var d = Beav.Geometry.distance(pos.x + pos.size/2,pos.y + pos.size/2,newX,newY);
                  var minDist = Math.max(pos.size/2,size);
               }
               if(d < minDist){
                  safeDist = false;
                  iType = 3;
                  iPos = 1000;
               }
            }
         }
         nbIter++;
      }while(!safeDist && nbIter < 20)
      if(nbIter >= 20){
         console.log("infinite loop")
      }
      return { x: newX, y: newY, size: size};
   };

   function generateCirclePosAboveRect(x,y,currCirclePos,rectPos,R) {
      var minX = Math.max(x + R,rectPos.x - R/2);
      var minY = Math.max(y + R,rectPos.y - R/2);
      var maxX = Math.min(x + imageW - R,rectPos.x + rectPos.size + R/2);
      var maxY = Math.min(y + imageW - R,rectPos.y + rectPos.size + R/2);
      var nbIter = 0;
      do{
         var newX = rng.nextInt(minX,maxX);
         var newY = rng.nextInt(minY,maxY);
         var safeDist = true;
         for(var iPos = 0; iPos < currCirclePos.length; iPos++){
            var pos = currCirclePos[iPos];
            var d = Beav.Geometry.distance(pos.x,pos.y,newX,newY);
            if(d < Math.max(R,pos.size)){
               safeDist = false;
               break;
            }
         }
      }while(!safeDist && nbIter < 20)
      if(nbIter >= 20){
         console.log("infinite loop")
      }
      return { x: newX, y: newY, size: R};
   };

   function select(id) {
      return function() {
         if(!answer.selected[id]){
            answer.selected[id] = true;
            selectionFrame[id].attr(selectedAttr);
         }else{
            answer.selected[id] = false;
            selectionFrame[id].attr(unselectedAttr);
         }
      }
   };

   function checkResult(noVisual) {
      var nbSelected = 0;
      for(var iImage = 0; iImage < nbImages; iImage++){
         if(answer.selected[iImage]){
            nbSelected++;
         }
      }
      if(nbSelected != 3){
         var msg = (nbSelected > 3) ? taskStrings.tooMany : taskStrings.tooFew;
         if(!noVisual){
            displayError(msg)
         }
         return { successRate: 0, message: msg };
      }

      for(var iImage = 0; iImage < nbImages; iImage++){
         if(answer.selected[iImage]){
            var imgID = answer.order[iImage];
            if(imgID > 2){
               var msg = taskStrings.failure;
               if(!noVisual){
                  displayError(msg);
                  selectionFrame[iImage].attr(wrongImageAttr);
                  answer.waitForRetry = true;
                  displayHelper.setValidateString(taskStrings.retry);
                  displayHelper.customValidate = retry;
                  removeHandlers();
               }
               return { successRate: 0, message: msg };
            }
         }
      }

      if(!noVisual){
         platform.validate("done");
      }
      return { successRate: 1, message: taskStrings.success };
   };

   function retry() {
      answer.waitForRetry = false;
      displayHelper.restartAll();
   };

   function displayError(msg) {
      $("#error").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
