function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         nCircles : 3,
         maxComparisons: 100
      },
      medium: {
         nCircles : 4,
         maxComparisons: 100
      },
      hard: {
         nCircles : 6,
         maxComparisons: 16
      }
   };
   var paperDim = {
      width: -1, // computed below as the sum of leftColWidth and rightColWidth, should be < 770
      height: 420,
      leftColWidth: 540,
      rightColWidth: 230
   };
   paperDim.width = paperDim.leftColWidth + paperDim.rightColWidth;
   var paper;
   var weightInitMargin = 10;
   var shiftInitWeightX = 0;
   var weightSize = paperDim.leftColWidth/8-1.5*weightInitMargin;
   var radius = weightSize/2;
   var answerSpotAttr = {
      "stroke" : "#c3c3c3",
      "stroke-width" : "3"
   };
   var weightLetterAttr = {
      "font-size" : 25,
      "font-weight" : "bold"
   }
   var answerSpotPos;
   var leftLoadPos;
   var rightLoadPos;
   var magnetPos;
   var textAttr = {
      "font-size" : 16
   };
   var instrAttr = {
     "font-size" : 16,
     "fill": "#afafaf",
     "font-weight": "bold"
   };

   var scaleInstAttr = {
      "font-size" : 16,
      "font-weight": "bold",
      "fill": "#afafaf" // alternative: red
   };
   var scaleComparisonsAttr = {
      "font-size" : 16,
      "font-weight": "bold"
   };

   var attractionRadius = weightSize;
   var weightsRaph;  // array of raphael objects representing the weights
   var weightPos = [];
   var weightsInitPos;
   var circlesWeight;
   var pentCircle;
   var scale;
   var topMargin = 25;
   var scaleMarginX = 20;
   var scaleMarginY = 15; // needs to be sufficient for the scale to fit in when it balances
   var scaleDim = {
      x: paperDim.leftColWidth+scaleMarginX,
      y: scaleMarginY,
      width: paperDim.rightColWidth-2*scaleMarginX,
      height: 170
   };
   var scaleInfoTopMargin = 40;
   var panPosRaph;   // raphael set representing the drop spots on the scale
   var nComparisons = 0;
   var maxHistory = 18; // max number of comparisons that can be displayed at the same time
   var comparisons = [];
   var compRaph; // raphael text object
   var randGen;
   var nWeights; // total number of weights
   var nCircles;
   var balanceFeedback;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      nCircles = data[level].nCircles;
      nWeights = level == "easy" ? data[level].nCircles : 2*nCircles;
      weightsRaph = new Array(nWeights);
      weightsInitPos = new Array(nWeights);
      randGen = new RandomGenerator(subTask.taskParams.randomSeed);
      initWeightValues();
      initWeightPos();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
         randGen.reset(answer.seed);
         initWeightValues();
         comparisons = answer.comparisons;
         nComparisons = answer.comparisons.length;
         weightPos = answer.wPos;
      }
   };

   subTask.resetDisplay = function() {
      initPaper();
      initAnswerBar();
      initScale();
      initWeights();
      initDrag();
      initComp();
      hideFeedBack();
      initSubmitButton();
      if (typeof(enableRtl) != "undefined") {
         $("body").attr("dir", "rtl");
         $(".largeScreen #zone_1").css("float", "right");
         $(".largeScreen #zone_2").css("float", "right");
      }
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = {
         "id": [],
         "comparisons": [],
         "seed": randGen.nextInt(0,1000),
         "wPos": weightsInitPos,
         "validated": false
      };
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      if(isAnswerEmpty()) {
         return { successRate: 0, message: taskStrings.emptyAnswer };
      }
      var result = { successRate: 1, message: taskStrings.success };
      var alternativePath = genDifferentPath(answer.id);
      for(var iAnswerId = 0; iAnswerId < answer.id.length; iAnswerId++) {
         if(alternativePath[iAnswerId] != answer.id[iAnswerId]){
            return { successRate: 0, message: taskStrings.wrongAnswer };
         }
      }
      var extraUsed = answer.comparisons.length - data[level].maxComparisons;
      if (level == "hard" && extraUsed > 0) {
         var score = Math.max(0.2, 1 - extraUsed/5);
         return { successRate: score, message: taskStrings.tooManyComp };
      }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initWeightValues() {
      circlesWeight = new Array(nCircles);
      pentCircle = new Array(nCircles);
      for(var iCircle = 0; iCircle < nCircles; iCircle++) {
         circlesWeight[iCircle] = iCircle+1;
         pentCircle[iCircle] = iCircle;
      }
      randomize(circlesWeight);
      randomize(pentCircle);
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperDim.width, paperDim.height);
      paper.path("M"+paperDim.leftColWidth+" "+"0"+"V"+paperDim.height);
      paper.text(paperDim.leftColWidth/2,paperDim.height*2/3,taskStrings.drag).attr(instrAttr);
   };

   function initAnswerBar() {
      magnetPos = new Array();
      answerSpotPos = new Array(nCircles);
      var weightSpaceX = (weightInitMargin+radius);
      var marginX = (8 - nCircles) * weightSpaceX;
      for(var iCircle = 0; iCircle < nCircles; iCircle++) {
         var cx = weightSpaceX*(2*iCircle+0.5) + marginX;
         var cy = topMargin + weightInitMargin+radius;
         paper.circle(cx,cy,radius).attr(answerSpotAttr);
         answerSpotPos[iCircle] = { "x" : cx, "y" : cy };
         magnetPos.push(answerSpotPos[iCircle]);
      }
      paper.text(answerSpotPos[0].x - radius, instrAttr["font-size"],taskStrings.lighterInstr).attr({'text-anchor': 'start'}).attr(instrAttr);
      paper.text(answerSpotPos[nCircles-1].x + radius, instrAttr["font-size"],taskStrings.heavierInstr).attr({'text-anchor': 'end'}).attr(instrAttr);
   };

   function initWeightPos() {
      var leftMargin = (paperDim.leftColWidth - nCircles*(weightSize+2*weightInitMargin))/2;
      for(iCircle = 0; iCircle < nWeights; iCircle++){
         weightPos[iCircle] = { cx: 0, cy: 0 };
         if(iCircle < nCircles){
            weightPos[iCircle].cx = leftMargin+(weightInitMargin+radius)*(2*iCircle+0.5);
            weightPos[iCircle].cy = topMargin + 3*(weightInitMargin+radius);
         }else{
            weightPos[iCircle].cx = weightPos[iCircle-nCircles].cx;
            weightPos[iCircle].cy = weightPos[iCircle-nCircles].cy+2*(weightInitMargin+radius);
         }
         weightsInitPos[iCircle] = { cx: weightPos[iCircle].cx, cy: weightPos[iCircle].cy };
      }
   };

   function initWeights() {
      var circleImgUrl = $("#circle").attr("src");
      var squareImgUrl = $("#square").attr("src");
      for(iCircle = 0; iCircle < nWeights; iCircle++){
         var cx = weightPos[iCircle].cx + shiftInitWeightX;
         var cy = weightPos[iCircle].cy;
         var x = cx - radius;
         var y = cy - radius;
         var letter = toLetter(iCircle);
         var shape;
         var text;
         if(iCircle < nCircles){
            shape = paper.image(circleImgUrl,x,y,weightSize,weightSize);
            text = paper.text(cx,cy,letter).attr(weightLetterAttr);
         }else{
            shape = paper.image(squareImgUrl,x,y,weightSize,weightSize);
            text = paper.text(cx,cy,letter).attr(weightLetterAttr);
         }
         var mask = paper.rect(x,y, weightSize, weightSize).attr({opacity: 0,fill:"white"});
         weightsRaph[iCircle] = paper.set(shape, text, mask);
      }
   };

   function pathExists(neighbors, src, dst) {
      if (src == dst) {
         return true;
      }
      for (var iNeigh = 0; iNeigh < neighbors[src].length; iNeigh++) {
         var newSrc = neighbors[src][iNeigh];
         if (pathExists(neighbors, newSrc, dst)) {
            return true;
         }
      }
      return false;
   }


   function graphScore(neighbors) {
      var lengths = [];
      function getLongestPathLength(src) {
         if (lengths[src] !== undefined) {
            return lengths[src];
         }
         var length = 1;
         for (var iNeigh = 0; iNeigh < neighbors[src].length; iNeigh++) {
            var newSrc = neighbors[src][iNeigh];
            var newLength = 1 + getLongestPathLength(newSrc);
            length = Math.max(length, newLength);
         }
         lengths[src] = length;
         return length;
      }
      var sumLengths = 0;
      for (var src = 0; src < nCircles; src++) {
         sumLengths += getLongestPathLength(src);
      }
      return sumLengths;
   }

   function toCircle(id) {
      if (id >= nCircles) {
         return pentCircle[id - nCircles];
      }
      return id;
   }

   function computeNeighbors() {
      var neighbors = [];
      for (var id = 0; id < nCircles; id++) {
         neighbors.push([]);
      }
      for (var iCmp = 0; iCmp < comparisons.length; iCmp++) {
         var cmp = comparisons[iCmp];
         var left = toCircle(cmp[0]);
         var right = toCircle(cmp[1]);
         if (left == right) {
            continue;
         }
         if (cmp[2] < 0) {
            neighbors[left].push(right);
         } else if (cmp[2] > 0) {
            neighbors[right].push(left);
         }
      }
      return neighbors;
   }

   function compareObjects(id1, id2) {
      id2 = toCircle(id2);
      if (id1 == id2) {
         return 0;
      }

      var neighbors = computeNeighbors();

      if (pathExists(neighbors, id1, id2)) {
         return -1;
      }
      if (pathExists(neighbors, id2, id1)) {
         return 1;
      }
      neighbors[id1].push(id2);
      var score1 = graphScore(neighbors);
      neighbors[id1].pop();
      neighbors[id2].push(id1);
      var score2 = graphScore(neighbors);

      // if there's no difference, we pick "randomly"
      if (score1 == score2) {
         if (comparisons.length % 2 == 0) {
            return -1;
         } else {
            return 1;
         }
      }
      // We make it hard by default
      var sign = -1;
      if (score1 > score2) {
         sign = 1;
      }
      if (level != "hard") {
         return sign;
      }
      if (comparisons.length % 3 == 1) {
         return sign;
      } else {
         return -sign;
      }
   };

   function genDifferentPath(proposedPath) {
      var neighbors = computeNeighbors();
      var path = [];
      var nbParents = [];
      for (var iCircle = 0; iCircle < nCircles; iCircle++) {
         nbParents.push(0);
      }
      for (var iCircle = 0; iCircle < nCircles; iCircle++) {
         for (var iNeigh = 0; iNeigh < neighbors[iCircle].length; iNeigh++) {
            var neigh = neighbors[iCircle][iNeigh];
            nbParents[neigh]++;
         }
      }

      for (var iStep = 0; iStep < nCircles; iStep++) {
         var bestCircle = -1;
         for (var iCircle = 0; iCircle < nCircles; iCircle++) {
            if ((nbParents[iCircle] == 0) && ((bestCircle == -1) || (iCircle != proposedPath[iStep]))) {
               bestCircle = iCircle;
            }
         }
         for (var iNeigh = 0; iNeigh < neighbors[bestCircle].length; iNeigh++) {
            nbParents[neighbors[bestCircle][iNeigh]]--;
         }
         nbParents[bestCircle] = -1;
         path.push(bestCircle);
      }
      return path;
   }


   function initScale() {
      var margin = scaleMarginX;
      var left = scaleDim.x;
      var top = scaleDim.y;
      var width = scaleDim.width;
      var height = scaleDim.height;
      scale = new Scale(paper,left,top,width,height, compareObjects);
      var panPos = scale.getPanPos();
      leftLoadPos = { "x" : panPos.left.x, "y" : panPos.left.y - radius - margin/2 };
      rightLoadPos = { "x" : panPos.right.x, "y" : panPos.right.y - radius - margin/2 };
      var leftPanPosRaph = paper.circle(leftLoadPos.x,leftLoadPos.y,radius).attr(answerSpotAttr).toBack();
      var rightPanPosRaph;
      if(level == "easy") {
         rightPanPosRaph = paper.circle(rightLoadPos.x,rightLoadPos.y,radius).attr(answerSpotAttr).toBack();
      }else{
         rightPanPosRaph = paper.rect(rightLoadPos.x - weightSize / 2, rightLoadPos.y - weightSize / 2, weightSize, weightSize)
                                    .attr(answerSpotAttr).toBack();
      }
      panPosRaph = paper.set(leftPanPosRaph,rightPanPosRaph);
      magnetPos.push(leftLoadPos);
      magnetPos.push(rightLoadPos);
   };

   function initComp() {
      var title = "";
      var scaleInfoAttr;
      if (nComparisons == 0) {
        title = (level == "easy") ? taskStrings.scaleInstEasy : taskStrings.scaleInstElse;
        scaleInfoAttr = scaleInstAttr;
      } else {
        title = taskStrings.comparisons(nComparisons);
        scaleInfoAttr = scaleComparisonsAttr;
      }
      var titleX = paperDim.leftColWidth+paperDim.rightColWidth/2;
      var titleY = scaleDim.y+scaleDim.height+scaleInfoTopMargin;
      var titleRaph = paper.text(titleX,titleY,title).attr(scaleInfoAttr);
      var textSet = paper.set(titleRaph);
      if (nComparisons > 0) {
         var nbCols = 3;
         var firstIndex = 0;
         var useDotsForFirst = false;
         if (nComparisons > maxHistory) {
            firstIndex = nComparisons - maxHistory;
            useDotsForFirst = true;
         }
         for(iComp = firstIndex; iComp < nComparisons; iComp++) {
            var relIndex = iComp - firstIndex;
            var x = paperDim.leftColWidth+paperDim.rightColWidth/(nbCols+1)*(relIndex%nbCols+1);
            var y = titleY + 5 + 1.7*textAttr["font-size"]*Math.floor(relIndex/nbCols+1);
            var signs = ["<", "=", ">"];
            var sign = signs[comparisons[iComp][2] + 1];
            var text = toLetter(comparisons[iComp][0])+" "+sign+" "+toLetter(comparisons[iComp][1]);
            if (useDotsForFirst && iComp == firstIndex) {
               text = "...";
            }
            var textRaph = paper.text(x,y,text);
            textSet.push(textRaph);
          }
      }
      textSet.attr(scaleComparisonsAttr);
      compRaph = textSet;
   };

   function initSubmitButton() {
      displayHelper.customValidate = function(){
         if(isAnswerEmpty()){
            showFeedback(taskStrings.emptyAnswer);
            return;
         }
         undrag();
         answer.validated = true;
         var res = getResultAndMessage();
         if(res.successRate > 0) {
            platform.validate("done");
         }else{
            showFeedback(res.message);
            showWeightValues();
         }
      };
      if (answer.validated) {
         var res = getResultAndMessage();
         if(res.successRate == 0) {
            showFeedback(res.message);
            showWeightValues();
         }
      }
   }

   function initDrag() {
      for(var iWeight = 0; iWeight < nWeights; iWeight++) {
         weightsRaph[iWeight].drag(dragMove(iWeight),dragStart(iWeight),dragEnd(iWeight));
      }
   };

   function undrag() {
      for(var iWeight = 0; iWeight < nWeights; iWeight++) {
         weightsRaph[iWeight].undrag();
      }
   };

   function dragStart(id) {
      return function(x,y) {
         if (answer.validated){
            return;
         }
         weightsRaph[id].toFront();
         fromMagnet(id);
      }
   };


   function dragMove(id) {
      return function(dx,dy,x,y) {      
         if (answer.validated){
            return;
         }
         var paperPos = $("#paper").offset();
         var mouseX = x - paperPos.left;
         var mouseY = y - paperPos.top;
         if((mouseX - radius) > 0 && (mouseX + radius) < paperDim.width && (mouseY - radius) > 0 && (mouseY + radius) < paperDim.height) {
            setPosition(id,mouseX,mouseY);
         }
      };
   };


   function dragEnd(id) {
      return function() {
         if (answer.validated){
            return;
         }
         var x = weightPos[id].cx;
         var y = weightPos[id].cy;
         if(x > 0 && x < paperDim.width && y > 0 && y < paperDim.height) {
            if((x-radius) > 0 && (x+radius) < paperDim.width && (y-radius) > 0 && (y+radius) < paperDim.height) {
               var iMagnet = isNearMagnetPos(x,y)
               if(iMagnet !== false) {
                  var oldPos = weightsInitPos[id];
                  toMagnet(id,iMagnet,oldPos);
               }else{
                  setPosition(id,x,y);
                  checkOverlap(id);
               }
            }else{
                  setPosition(id,weightsInitPos[id].cx,weightsInitPos[id].cy);
            }
         }
         undrag(); // needed at least for ie8. For some reason it drags it with the next dragged object otherwise.
         initDrag();
      }
   };

   function randomize(array) {
      randGen.shuffle(array);
   };

   function isCircle(id) {
      var res = id < nCircles ? true : false;
      return res;
   };

   function isNearMagnetPos(x,y) {
      for(var iMagnet = 0; iMagnet < magnetPos.length; iMagnet++) {
         if(Math.sqrt(Math.pow(x-magnetPos[iMagnet].x,2)+Math.pow(y-magnetPos[iMagnet].y,2)) < attractionRadius) {
            return iMagnet;
         }
      }
      return false;
   };



   function replaceLoad(id,side){
      var oldLoadId = scale.load[side].id;
      scale.removeLoad(side);
      weightsRaph[oldLoadId].attr({ "transform" : "T0,0"});
      setPosition(oldLoadId,weightsInitPos[oldLoadId].cx,weightsInitPos[oldLoadId].cy);
      checkOverlap(oldLoadId);
      if(side === 0){
         scale.setLoad(0,id,weightsRaph[id]);
      }else if(id < nCircles){
         scale.setLoad(1,id,weightsRaph[id]);
      }else{
         scale.setLoad(1,id,weightsRaph[id]);
      }
   };

   function toMagnet(id,iMagnet,oldPos) {
      var drawIn = false;
      var magnet = magnetPos[iMagnet];
      if(magnet != leftLoadPos && magnet != rightLoadPos && isCircle(id)) {
         drawIn = true;
         if ((answer.id[iMagnet] === null) || (answer.id[iMagnet] === undefined)) {
            answer.id[iMagnet] = id;
            answer.comparisons = comparisons;
         }
      }else if(magnet == leftLoadPos && isCircle(id) && scale.load[0] == null) {
         drawIn = true;
         scale.setLoad(0,id,weightsRaph[id]);

      }else if(magnet == leftLoadPos && isCircle(id) && scale.load[0] != null){
         drawIn = true;
         replaceLoad(id,0);
      }else if(magnet == leftLoadPos && !isCircle(id) && scale.load[0] == null) {
         showBalanceFeedback(taskStrings.pentOnLeftPan);
      }else if(magnet == rightLoadPos && level != "easy"  && isCircle(id) && scale.load[1] == null) {
         showBalanceFeedback(taskStrings.circleOnRightPan);
         setPosition(id,weightsInitPos[id].cx,weightsInitPos[id].cy);
      }else if(magnet == rightLoadPos && level == "easy"  && scale.load[1] == null) {
         drawIn = true;
         scale.setLoad(1,id,weightsRaph[id]);
      }else if(magnet == rightLoadPos && !isCircle(id)  && scale.load[1] == null) {
         drawIn = true;
         scale.setLoad(1,id,weightsRaph[id]);

      }else if(magnet == rightLoadPos && (level == "easy" || !isCircle(id))  && scale.load[1] != null){
         drawIn = true;
         replaceLoad(id,1);
      }
      if(drawIn) {
         var cx = magnet.x;
         var cy = magnet.y;
         setPosition(id,cx,cy);
      }
      checkOverlap(id);
      checkScale();
   };

   function fromMagnet(id) {
      hideFeedBack();
      var side = scale.isOnPan(id);
      if(side !== false){
         scale.backInPlace();
         scale.removeLoad(side);
         panPosRaph.attr(answerSpotAttr);
      }
      for(var iAnswerId = 0; iAnswerId < answer.id.length; iAnswerId++) {
         if(answer.id[iAnswerId] === id){
            answer.id[iAnswerId] = null;
         }
      }
   };

   function setPosition(id,cx,cy) {
      // if(cx > radius && cx < (paperDim.width - radius) && cy > radius && cy < (paperDim.height - radius)){
         // var inPaper = true;
         var newCx = cx;
         var newCy = cy;
      // }else{
      //    var inPaper = false;
      //    var newCx = weightsInitPos[id].cx;
      //    var newCy = weightsInitPos[id].cy;
      // }
      var x = newCx-radius;
      var y = newCy-radius;
      weightsRaph[id][0].attr("x",x).attr("y",y);
      weightsRaph[id][1].attr("x",newCx).attr("y",newCy);
      weightsRaph[id][2].attr("x",x).attr("y",y);
      weightPos[id] = { cx: cx, cy: cy };
      // if(!inPaper) checkOverlap(id);
   };

   function checkScale() {
      var check = scale.checkLoad();
      if(!check) {
         return;
      }else{
         var comp = scale.compare();
         panPosRaph.attr("stroke","white");
         var newComp = checkNewComp(comp);
         if(newComp) {
            nComparisons++;
            comparisons.push(comp);
            compRaph.remove();
            initComp();
         }
      }
   };

   function checkNewComp(res) {
      for(var iComp = 0; iComp < nComparisons; iComp++) {
         if((comparisons[iComp][0] == res[0] && comparisons[iComp][1] == res[1])
           || (comparisons[iComp][0] == res[1] && comparisons[iComp][1] == res[0])) {
            return false;
         }
      }
      return true;
   };

   function toLetter(nb) {
      return String.fromCharCode(65+nb);
   };

   function isAnswerEmpty() {
      if(answer.id.length < nCircles) return true;
      for(var iAnswerId = 0; iAnswerId < answer.id.length; iAnswerId++) {
         if(answer.id[iAnswerId] === null || $.type(answer.id[iAnswerId]) == "undefined") return true;
      }

      return false;
   };

   function showWeightValues() {
      var alternativePath = genDifferentPath(answer.id);
      for(var iWeight = 0; iWeight < nWeights; iWeight++) {
         var iCircle = toCircle(iWeight);
         var weight = 0;
         for (var iStep = 0; iStep < alternativePath.length; iStep++) {
            if (alternativePath[iStep] == iCircle) {
               weight = iStep + 1;
            }
         }
         var newText = toLetter(iWeight)+" : "+weight;
         weightsRaph[iWeight].attr("text",newText).attr("font-size",weightLetterAttr["font-size"]*2/3);
      }
   };

   function checkOverlap(id) {
      var cx = weightsRaph[id][1].attr("x");
      var cy = weightsRaph[id][1].attr("y");
      if(overlapShape(cx,cy,id)){
         findEmptySpace(id);
      }
   };

   function overlapShape(cx1,cy1,id) {
      var leeway = 21;
      for(var iWeight = 0; iWeight < weightsRaph.length; iWeight++) {
         if(iWeight != id){
            var cx2 = weightsRaph[iWeight][1].attr("x");
            var cy2 = weightsRaph[iWeight][1].attr("y");
            if(Math.abs(cx1-cx2) <= leeway && Math.abs(cy1-cy2) <= leeway){
               return true;
            }
         }
      }
      return false;
   };

   function findEmptySpace(id) {
      var d = paperDim.width;
      var cx0 = weightsRaph[id][1].attr("x");
      var cy0 = weightsRaph[id][1].attr("y");
      var newCx = 0;
      var newCy = 0;
      for (var x = radius; x < (paper.width - radius); x += radius){
         for (var y = radius; y < (paper.height - radius); y += radius){
            if (!overlapShape(x,y,id) && isNearMagnetPos(x,y) === false){
               newD = Math.sqrt(Math.pow((x - cx0),2) + Math.pow((y - cy0),2));
               if(newD < d){
                  d = newD;
                  newCx = x;
                  newCy = y;
               } 
            }
         }
      }
      setPosition(id,newCx,newCy);
   };

   function showBalanceFeedback(string) {
      if(balanceFeedback) balanceFeedback.remove();
      if(string === null || string === undefined) {
         string = "&nbsp;";
      }
      var x = scaleDim.x;
      var y = scaleDim.y + scaleDim.height + 10;
      var w = scaleDim.width;
      var h = 4*textAttr["font-size"] + 20;
      paper.setStart();
      paper.rect(x,y,w,h).attr({"stroke":"red","fill":"white"});
      paper.text(x+w/2,y+textAttr["font-size"]*2+10,string).attr(scaleComparisonsAttr).attr({"fill":"red"});
      balanceFeedback = paper.setFinish();
   };

   function showFeedback(string) {

      $("#displayHelper_graderMessage").html(string);
      $("#displayHelper_graderMessage").css("color", "red");
   };

   function hideFeedBack() {

      $("#displayHelper_graderMessage").html("");
      if(balanceFeedback) {
        balanceFeedback.remove();
      }
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
