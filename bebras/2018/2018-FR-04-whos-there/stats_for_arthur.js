function initTask(subTask) {
   var state = {};
    /* state contains:
       { steps: an array of integers,
                - a nonnegative value i indicate that shape i enters
                - a negative value i indicates that shape "-i-100" leaves
         iStep: an index in steps }
    */
   var level;
   var answer = null;
   var data = {
      easy: {
         nShapes: 5,
         nCombi: 5, // 5 distinct shapes
         animationDuration: 2500
      },
      medium: {
         nShapes: 4,
         nCombi: 4, // 4 distinct shapes
         animationDuration: 2500 // 1500 for debug
      },
      hard: {
         nShapes: 3,
         nCombi: 6, // 6 distinct pairs
         animationDuration: 3500
      }
   };
   var pairsForHard = [
     [0,0],
     [0,1],
     [0,2],
     [1,1],
     [1,2],
     [2,2] ];
   var maxHouseSize = 20; // should be greater than 2*nShapes+1
   var thresholdClick = 5; // considered a dot belo
   var clickPaintWidth = 10;
   var paperWidth = 770;
   var housePaper;
   var housePaperDim = {
      "width": paperWidth,
      "height": 280
   };
   var textAttr = {
      "font-size": 16
   };
   var errorTextAttr = {
      "font-size": 16,
      "text-anchor": "start",
      "fill": "red"
   };
   var restartMsgAttr = {
      "font-size": 18,
      "fill": "blue",
      "font-weight": "bold"
   };
   var margin = 20;
   var marginButton = 20;
   var marginShapeList = 45;
   var houseAttr = {
   	"stroke": "black",
   	"stroke-width": 2,
   	"fill": "#ffffaa"
   };
   var roofAttr = {
   	"stroke": "black",
   	"stroke-width": 2,
   	"fill": "red",
   	"thickness": 5
   };
   var chimneyAttr = {
   	"stroke": "black",
   	"stroke-width": 2,
   	"fill": "grey"
   }
   var houseDim = {
      "width": housePaperDim.width/2,
      "height": housePaperDim.height - 2*margin
   };
   var roofHeight = houseDim.height/4;
   var housePos = {
      "x": (housePaperDim.width - houseDim.width)/2,
      "y": margin
   };
   var shapeSize = 40;
   var coupleSize = shapeSize*1.2;
   // var shapeListSize = 60;
   var shapeListPaper;
   var shapeListPaperDim = {
      "width": paperWidth,
      "height": textAttr["font-size"]+shapeSize+margin
   };
   var pathDim = {
      "width": housePos.x - margin,
      "height": shapeSize+margin/2
   };
   var pathInPos = {
      "x": margin,
      "y": housePos.y + houseDim.height - pathDim.height-margin/2
   };
   var pathOutPos = {
      "x": housePos.x + houseDim.width,// + margin,
      "y": housePos.y + houseDim.height - pathDim.height-margin/2
   };
   var pathAttr = {
      "stroke": "black",
      "stroke-width": 1
   };
   var arrowDim = {
      "width": 70,
      "height": 15
   };
   var startButton;
   var startButtonDim = {
      "width": houseDim.width - marginButton * 2,
      "height": houseDim.height - roofHeight - shapeSize - margin
   };
   var startButtonPos = {
   	"x": housePos.x + marginButton,
   	"y": housePos.y + roofHeight + shapeSize + margin/2
   };
   var canvasAttr = {
      "width": 600,
      "height": 200,
      "editing": true
   };
   var canvasInstr;
   var nShapes;
   var nCombi;
   var shapesInHouse;
   var randomGenerator;
   var delayFactory = new DelayFactory();
   var sketchpad = null;
   var currentShapesIndex = 0;
   var prevShapesIndex = 0;
   var currentShapeRaphElement;
   var currentShapeRaphElement;
   var clickDelay = 2000;
   var shapes = [];
   var clickedAddShapesGroup = 0;
   var img = [];
   for (var iImg = 0; iImg < 5; iImg++) {
      img[iImg] = $("#shape" + (iImg + 1)).attr("src");
   }
   var restartMsg;
   var lengthNbInHouse;
   var house;
   var errorState = false;
   var nbElemsAnim = 0;


   var shuffle = function(t, randomSeed) {
     var nbValues = t.length;
     for (var iValue = 0; iValue < nbValues-1; iValue++) {
        randomShift = randomGenerator.nextInt(0, nbValues - iValue - 1);
        var pos = iValue + randomShift;
        var tmp = t[iValue];
        t[iValue] = t[pos];
        t[pos] = tmp;
     }
    };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      randomGenerator = new RandomGenerator(subTask.taskParams.randomSeed + 152486);
      delayFactory = this.delayFactory;
      nShapes = data[level].nShapes;
      nCombi = data[level].nCombi;
      lengthNbInHouse = nShapes;
      if (level == "hard") {
         lengthNbInHouse *= nShapes;
         houseDim.width = housePaperDim.width*2/3;
         startButtonDim.width = houseDim.width - marginButton * 2;
      }


      // TODO DEBUG
      //console.log(steps);

      // This array will be used to pick tasks
      initState();
   };

   function initState() {
      var steps = [];
      if (level != "medium") {
        // Fill an array with 5 copies of each (combination of) shape, and shuffle
        for (var i = 0; i < 5*nCombi; i++) {
          steps.push(i % nCombi);
        }
        shuffle(steps, subTask.taskParams.randomSeed);
      } else {
var nbStats = 20;
var totalStats = 0;
for (var stat = 0; stat < nbStats; stat++) {
       var steps = [];
        var house = [];
        var occurences = [];
        for (var shape = 0; shape < nCombi; shape++) {
          occurences[shape] = 0;
        }
        var remainingRemoval = 5; // cap on the number of removal
        var length = 5*nCombi + remainingRemoval;
        var nbGroups = 0; // for stats
        for (var i = 0; i < length; i++) {
          // one chance in 2 to 4 to leave the house, up to the quota
          // don't remove from house if fewer than 4 inside
           var probaDenom = (remainingRemoval >= 3) ? 2 : 2;
           if (remainingRemoval > 0
             && house.length >= 4
             && randomGenerator.nextInt(0, probaDenom-1) == 0) {
            // a random item leaves from the house
            var leavingIndex = randomGenerator.nextInt(0, house.length-1);
            var leavingShape = house[leavingIndex];
            steps.push(-leavingShape-100);
            occurences[leavingShape]--;
            house.splice(leavingIndex, 1);
            remainingRemoval--;
          } else {
            // a random shape enters the house
            var enteringShape = randomGenerator.nextInt(0, nCombi-1);
            steps.push(enteringShape);
            house.push(enteringShape);
            occurences[enteringShape]++;
            if (occurences[enteringShape] == 3) {
              // clear group that might be created
              var newHouse = [];
              for (var iElem = 0; iElem < house.length; iElem++) {
                 var elem = house[iElem];
                 if (elem != enteringShape) {
                    newHouse.push(elem);
                 }
              }
              nbGroups++;
              if (nbGroups == 3) {
                totalStats += (i+1);
              }
              house = newHouse;
              occurences[enteringShape] = 0;
            }
          }
        }
          console.log(steps);

}
console.log(totalStats / nbStats);
      }
      state.steps = steps;
      state.iStep = 0;
   }

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer) {
         randomGenerator.reset(answer.seed);
         errorState = false;
      }
      initState();
   };

   subTask.resetDisplay = function() {
      initHouse();
      // initAnswerFrame();
      initShapeList();
      initCanvas();
      displayHelper.hideValidateButton = true;
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = {
        seed: randomGenerator.nextInt(0, 20),
        house: [],
        groups: [],
        canvas: "" };
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getShapesIndex(shapes) {
      var shapesIndex = 0;
      for (var iShape = 0; iShape < shapes.length; iShape++) {
         shapesIndex = shapesIndex * nShapes + shapes[iShape];
      }
      return shapesIndex;
   }

   function getNbInHouse(shapes) {
      var nbInHouse = [];
      for (var shapeIndex = 0; shapeIndex < lengthNbInHouse; shapeIndex++) {
         nbInHouse.push(0);
      }
      for(var iShape = 0; iShape < shapes.length; iShape++) {
         nbInHouse[shapes[iShape]]++;
      }
      return nbInHouse;
   };

   function initHouse() {
      housePaper = subTask.raphaelFactory.create("housePaper","housePaper",housePaperDim.width,housePaperDim.height);
      drawHouse();
      drawPath(pathInPos,taskStrings.inHouse);
      if(level == "medium") {
         drawPath(pathOutPos,taskStrings.outHouse);
      }
      initButton("start",start);
   };

   function initShapeList() {
      shapeListPaper = subTask.raphaelFactory.create("shapeListPaper","shapeListPaper",shapeListPaperDim.width,shapeListPaperDim.height);
      var text = (level == "hard") ? taskStrings.shapeListInPairs : taskStrings.shapeList;
      shapeListPaper.text(shapeListPaperDim.width/2,margin,text).attr(textAttr);
      drawShapeList();
   };

   function initButton(label,clickFct) {
   	if(startButton) startButton.remove();
   	if(label != "restart"){
   		var h = startButtonDim.height;
   		var y = startButtonPos.y;
   	}else{
   		var h = 1.5*textAttr["font-size"];
   		var y = startButtonPos.y + startButtonDim.height - h;
   	}
    var text = taskStrings[label];
    if (label == "resume" || label == "clickGroup") {
      var isPair = (level == "hard");
      var isFirst = (clickedAddShapesGroup == 0);
      text = text(isPair, isFirst);
    }
   	startButton = new Button(housePaper, startButtonPos.x, y, startButtonDim.width, h, text);
      startButton.unclick();
      startButton.click(clickFct);
   };

   function drawHouse() {
		var w = houseDim.width;
		var h = houseDim.height;
		var roofH = roofHeight;
		var x = housePos.x;
		var y = housePos.y;
		var cx = x + w/2;
		var walls = housePaper.path("M"+cx+" "+y+"L"+(x + w)+" "+(y + roofH)+"V"+(y + h)+"H"+x+"V"+(y + roofH)+"Z");
		walls.attr(houseAttr);
		var roofPath = "M"+(x - margin)+" "+(y + roofH*(1 + margin/w))+"L"+cx+" "+y+"L"+(x + w + margin)+" "+(y + roofH*(1 + margin/w));
		var roofOutline = housePaper.path(roofPath);
		var tiles = housePaper.path(roofPath);
		roofOutline.attr({
			"stroke":roofAttr["stroke"],
			"stroke-width":(roofAttr["thickness"] + 2*roofAttr["stroke-width"]),
			"stroke-linecap": "round"
		});
		tiles.attr({
			"stroke":roofAttr["fill"],
			"stroke-width":roofAttr["thickness"],
			"stroke-linecap": "round"
		});
		var roof = housePaper.set(roofOutline,tiles);
		var chimney = housePaper.rect((x + w/7),y,w/8,h/2).attr(chimneyAttr).toBack();
		house = housePaper.set(walls,roof,chimney);
   };

   function drawPath(pos,string) {
   	var x = pos.x;
   	var y = pos.y;
   	var w = pathDim.width;
   	var h = pathDim.height;
      housePaper.path("M"+x+" "+y+"H"+(x + w)).attr(pathAttr);
      housePaper.path("M"+x+" "+(y + h)+"H"+(x + w)).attr(pathAttr);
      var arrowUrl = $("#arrow").attr("src");
      housePaper.image(arrowUrl,x + (w - arrowDim.width)/2,y + h + margin/2,arrowDim.width,arrowDim.height);
      housePaper.text((x + w/2),(y - margin),string).attr(textAttr);
   };

   function drawShapeList() {
      for(var iShape = 0; iShape < nShapes; iShape++) {
         var x = marginShapeList/2+(paperWidth-nShapes*(shapeSize+marginShapeList))/2+(shapeSize+marginShapeList)*iShape;
         var y = textAttr["font-size"] + margin;
         shapeListPaper.image(img[iShape],x,y,shapeSize,shapeSize);
      }
   };

   function initCanvas() {
      $("#canvas").empty();
      sketchpad = Raphael.sketchpad("canvas", canvasAttr, subTask.raphaelFactory);
      var defaultData = sketchpad.json();
      function resetInstr() {
         if (canvasInstr != null) {
            canvasInstr.remove();
         };
         canvasInstr = sketchpad.paper().text(canvasAttr.width / 2, canvasAttr.height / 2, taskStrings.drawInCanvas).attr(
            {"font-size": 18,"fill":"gray","font-weight":"bold"});
         var curData = sketchpad.json();
         if (curData != defaultData) {
            canvasInstr.attr({opacity:0.3});
         } else {
            canvasInstr.attr({opacity:1});
         }
      }

      sketchpad.change(resetInstr);
      resetInstr();

      if(answer.canvas.length > 0) {
         sketchpad.strokes(answer.canvas)
      }
      $("#undoCanvas").unbind("click");
      $("#undoTagButton").click(canvasUndo);
      $("#redoTagButton").click(canvasRedo);
   };

   function canvasUndo() {
      sketchpad.undo();
   };

   function canvasRedo() {
      sketchpad.redo();
   };

   var start = function(event) {
   	errorState = false;
      initButton("clickGroup",addShapesGroup);
      enterShape();
   };

   function shapeAction() {
      if (errorState) {
         return;
      }
      if(   state.iStep >= state.steps.length
         || answer.house.length === maxHouseSize) {
         // Safety test, should never be triggered, because we
         // cannot have more than 2*nShapes+1 items inside the house
         // without a group being completed
         completed();
      }
      if (state.steps[state.iStep] >= 0) {
        enterShape();
      } else {
        leaveShape();
      }
   };

   function pause() {
      if (Beav.Navigator.isIE8()) {
         return; // pauseAnimate not supported by IE8
      }
      initButton("resume",unpause);
      subTask.raphaelFactory.pauseAnimate("anim1");
      subTask.raphaelFactory.pauseAnimate("anim2");
   };

   function unpause() {
   	subTask.raphaelFactory.resumeAnimate("anim1");
   	subTask.raphaelFactory.resumeAnimate("anim2");
   	initButton("clickGroup",addShapesGroup);
   };

   function drawShapes(shapesIndex, xi, yi, shorten) {
      if (level != 'hard') {
         return housePaper.image(img[shapesIndex],xi,yi,shapeSize,shapeSize);
      } else {
         var shapes = getShapesFromIndex(shapesIndex);
         housePaper.setStart();
         var width = 2 * shapeSize;
         if (shorten) {
            width = coupleSize;
         }
         housePaper.rect(xi,yi,width,shapeSize);
         housePaper.image(img[shapes[0]],xi,yi,shapeSize,shapeSize);
         housePaper.image(img[shapes[1]],xi+width - shapeSize,yi,shapeSize,shapeSize);
         return housePaper.setFinish();
      }
   }

   function enterShape() {
      var xi = (level != "hard") ? -shapeSize : -2*shapeSize;
      var yi = pathInPos.y+margin/4;
      if(currentShapeRaphElement) {
         currentShapeRaphElement.remove();
      }
      prevShapesIndex = currentShapesIndex;

      currentShapesIndex = state.steps[state.iStep];
      state.iStep++;
      currentShapeRaphElement = drawShapes(currentShapesIndex, xi, yi, false);
      currentShapeRaphElement.toBack();
      answer.house.push(currentShapesIndex);
      animateShapes(currentShapesIndex, xi, yi, true);
      saveAnswer();
   };

   function leaveShape() {
      if(currentShapeRaphElement) {
         currentShapeRaphElement.remove();
      }
      var xi = (level != "hard") ? housePos.x+houseDim.width-shapeSize : housePos.x+houseDim.width-2*shapeSize-2;
      var yi = pathInPos.y+margin/4;
      var leavingShape = - state.steps[state.iStep] - 100;
      state.iStep++;
      var posInHouse = Beav.Array.indexOf(answer.house, leavingShape);
      if (posInHouse == -1) {
         console.log("error");
      }
      var shapesIndex = answer.house.splice(posInHouse, 1)[0];
      saveAnswer();
      currentShapeRaphElement = drawShapes(shapesIndex, xi, yi, false).toBack();
      animateShapes(shapesIndex, xi, yi, false);
   }

   function animateShapes(shapesIndex, x, y, entering) {
      var duration = data[level].animationDuration;
      var translation = level != "hard" ? housePos.x+shapeSize : housePos.x+2*shapeSize+2;
      nbElemsAnim = 1;
      if (level == "hard") {
         nbElemsAnim = 3;
      }
      var anim2 = new Raphael.animation({"transform":"T"+translation/2+",0"},duration/3,"linear", function() {
         nbElemsAnim--; // TODO: find a better way that's compatible with pauses. This function is called for each element animated (3 times for 2 shapes in a rectangle)
         if (nbElemsAnim > 0) {
            return;
         }
         currentShapeRaphElement.remove();
         // we don't count the shape that just entered, we give the user until the next shape to react.
         var nbInHouse = getNbInHouse(answer.house.slice(0, answer.house.length - 1));
         if (nbInHouse[prevShapesIndex] >= 3) {
            callError('missed');
         }
         shapeAction();
      }).delay(duration/3);
      var anim1 = new Raphael.animation({"transform":"T"+translation/2+",0"},duration/3, "linear", function() {
         currentShapeRaphElement.remove();
         currentShapeRaphElement = drawShapes(shapesIndex, x + translation / 2, y, false).toBack();
         subTask.raphaelFactory.animate("anim2",currentShapeRaphElement,anim2);
      });
      subTask.raphaelFactory.animate("anim1",currentShapeRaphElement,anim1);
   };

   function getShapesFromIndex(shapesIndex) {
      return pairsForHard[shapesIndex];
   }

   function addShapesGroup() {
      clickedAddShapesGroup++;
      pause();

      var shapesIndexes = [prevShapesIndex, currentShapesIndex];
      for(var iShapeIndex = 0; iShapeIndex < 2; iShapeIndex++){
         var shapesIndex = shapesIndexes[iShapeIndex]
         var nbInHouse = getNbInHouse(answer.house);
         if (nbInHouse[shapesIndex] >= 3) {
            answer.groups.push(shapesIndex);
            saveAnswer();
            if (answer.groups.length>3) {
               answer.groups.splice(0, 3)
            }
            for (var iShape = 0; iShape < 3; iShape++) {
               answer.house.splice( $.inArray(shapesIndex, answer.house), 1);
            }
            drawGroup(shapesIndex,(answer.groups.length-1));
            if (answer.groups.length>2) {
               completed()
            } else {
               platform.validate("silent");
            }
            return;
         }
      }
      callError('wrong');
   };

   function drawGroup(shapesIndex,col) {
   	var shSize = (level != "hard") ? shapeSize : coupleSize;
   	var x = housePos.x + houseDim.width/2 - (shSize*4.5 + margin/2) + col*(3*shSize + margin/2);
      var y = housePos.y + roofHeight + margin/4;
      for (var iShape = 0; iShape < 3; iShape++) {
         drawShapes(shapesIndex, x, y, true);
         x += shSize;
      }
   };

   function drawGroups() {
      for(var iGroup = 0; iGroup < answer.groups.length; iGroup++) {
         drawGroup(answer.groups[iGroup],iGroup);
      }
   };

   function callError(type) {
      var errMsg = "";
      delayFactory.destroyAll();
      errorState = true;
      if(subTask.raphaelFactory.get("anim1")) {
         subTask.raphaelFactory.stopAnimate("anim1");
      }
      if(subTask.raphaelFactory.get("anim2")) {
         subTask.raphaelFactory.stopAnimate("anim2");
      }
      nbElemsAnim = 0;
      if(currentShapeRaphElement) {
         currentShapeRaphElement.hide();
      }
      var isPair = (level == "hard");
      if (type == 'missed') {
         var isFirst = (clickedAddShapesGroup == 0);
         errMsg = taskStrings.errorMiss(isPair, isFirst);
      } if (type == 'wrong') {
         var isFirst = (clickedAddShapesGroup == 1);
         errMsg = taskStrings.errorWrong(isPair, isFirst);
      }
      displayHelper.showPopupMessage(errMsg, "blanket");
      initButton("restart",function(){displayHelper.restartAll()});
      showShapesInHouse();
   };

   function showShapesInHouse() {
   	var frameW = houseDim.width;
   	if(shapesInHouse) shapesInHouse.remove();
   	shapesInHouse = housePaper.set();
   	for(var iShape = 0; iShape < answer.house.length; iShape++) {
         var eachSize = shapeSize;
         if (level == 'hard') {
            eachSize = (coupleSize+2);
            if(iShape > 20) {
               return;
            }
         }
         var maxShape = Math.floor(frameW/eachSize);
         var x = (iShape < maxShape) ? startButtonPos.x+iShape*eachSize : startButtonPos.x+(iShape-maxShape)*eachSize;
         var y = startButtonPos.y + (shapeSize+margin/2)*Math.floor(iShape/maxShape);
         shapesInHouse.push(drawShapes(answer.house[iShape], x, y, true));
      }
   };

   function displayRestartMsg() {
      var x = housePos.x+houseDim.width/2;
      var y = housePos.y + houseDim.height +arrowDim.height+margin+restartMsgAttr["font-size"];
      restartMsg = housePaper.text(x,y,taskStrings.restartMsg).attr(restartMsgAttr);
   };

   var completed = function () {
      delayFactory.destroyAll();
      startButton.disable();
      platform.validate("done");
   };

   function saveAnswer() {
      answer.canvas = JSON.parse(sketchpad.json());
   };

   var getResultAndMessage = function() {
      var nbGroups = answer.groups.length;
      if (nbGroups == 3) {
        return {
          successRate: 1,
          message: taskStrings.success };
      } else if (nbGroups == 2) {
        return {
          successRate: 0.5,
          message: taskStrings.partial };
      } else if (nbGroups == 1 && level == "easy") {
        return {
          successRate: 0.3,
          message: taskStrings.partial };
      } else {
        return {
          successRate: 0,
          message: taskStrings.failure };
      }
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
displayHelper.timeoutMinutes = 0;
displayHelper.hideScoreDetails = true;