function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         nbTubes: 3,
         nbTestTubes: 2

      },
      medium: {
         nbTubes: 4,
         nbTestTubes: 2

      },
      hard: {
         nbTubes: 8,
         nbTestTubes: 3

      }
   };

   var paper;
   var paperW = 770;
   var paperH;

   var marginX = 20;
   var marginXExtraForDrop = 20;
   var marginY = 20;
   var marginYSmall = 5;
   var scale = 1.2;
   var tubeH = 121*scale;
   var tubeW = 54*scale;
   var tubeContW;
   var tubeContH = tubeH + marginY;
   var dropTubeContH = tubeContH;
   var dropTubeContW;
   var infoBoxW = 90; // should be <= tubeW + 2*marginXExtraForDrop - 2;
   var labelW = 46;
   var labelH = 20;
   var buttonH = 30;
   var validateButtonW = 186;
   var sendButtonW;
   var textH = 50;
   var text2H = 40;
   var particleR = 10;
   var xValidate, xDropZone, xSend;
   var yLine = tubeContH + marginY + marginYSmall;
   var yDropZone = yLine + 2*marginY + textH;
   var yText2 = yDropZone + tubeContH + 1.5*marginY;
   var yText = yLine + marginYSmall + textH/2;
   var iconSize = 15;
   var infoBoxH = 20;
   var marginXTextTubes = 15;
   var radioR = 7;

   var dragAndDrop, rng;
   var nbTubes;
   var nbParticles = 4;
   var testTubes = [];
   var testTubesID = [];
   var infoBox = [];
   var sendButton, validateButton;
   var maxNbTests = 4;
   var radioButtons = [];

   var tubeSrc = $("#tube").attr("src");
   var pollutedTubeSrc = $("#polluted_tube").attr("src");
   var biohazardSrc = $("#biohazard").attr("src");
   var uploadSrc = $("#upload").attr("src");
   var checkSrc = $("#check").attr("src");

   var letters = ["A","B","C","D","E","F","G","H"];

   var colors = {
      yellow: "#f5a623",
      blue: "#4a90e2",
      black: "#4a4a4a",
      lightGrey: "#ebebeb",
      grey: "#c6c7c9",
      red: "#ff0000",
      green: "#9acc68"
   };
   var particleColors = [
      "135-#900087-#f8004d",
      "135-#8e7d00-#f89900",
      "135-#078282-#55dc31",
      "135-#00678f-#00fdbc",
      "135-#8c0004-#8700fc",
      "135-#8e3e00-#fed400",
      "135-#193c02-#000000",
      "135-#3b8a00-#fd0100"
   ];
   var labelAttr = {
      stroke: colors.lightGrey,
      fill: "white",
      r: 5
   };
   var labelTextAttr = {
      "font-size": 20,
      "font-weight": "bold",
      fill: colors.black
   };
   var particleAttr = {
      stroke: "none",
      r: particleR
   };
   var partLetterAttr = {
      "font-size": 14,
      "font-weight": "bold",
      fill: "white"
   };
   var lineAttr = {
      stroke: colors.grey,
      "stroke-linecap": "round"
   };
   var dropZoneAttr = {
      stroke: colors.grey,
      fill: colors.lightGrey,
      r: 5
   };
   var textAttr = {
      "font-size": 16,
      fill: colors.black
   };
   var textAttrBold = {
      "font-size": 16,
      "font-weight" : "bold",
      fill: colors.black
   };
   var usedNbAttr = {
      "font-size": 16,
      fill: colors.black,
      "text-anchor": "start"
   };
   var buttonTextAttr = {
      "font-size": 13,
      "font-weight": "bold",
      fill: "white"
   };
   var pollutedAttr = {
      stroke: "none",
      fill: colors.red,
      r: 3
   };
   var cleanAttr = {
      stroke: "none",
      fill: colors.green,
      r: 3
   };
   var infoBoxTextAttr = {
      "font-size": 14,
      "font-weight": "bold",
      fill: "white"
   };
   var radioButtonAttr = {
      stroke: colors.grey,
      "stroke-width": 1,
      fill: colors.lightGrey,
      r: radioR
   };
   var selectedRadioAttr = {
      stroke: colors.grey,
      "stroke-width": 1,
      fill: colors.blue,
      r: radioR
   };
   var radioTextAttr = {
      "font-size": 16,
      fill: colors.black,
      "text-anchor": "start"
   };
   var overlayAttr = {
      stroke: "none",
      fill: "red",
      opacity: 0
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      nbTubes = data[level].nbTubes;
      nbTestTubes = data[level].nbTestTubes;
      // paperH = 2*tubeContH + buttonH + textH + 6*marginY;
      paperH = 2*tubeContH + textH + 3*marginY + 3*marginYSmall + text2H;
      xValidate = 3*paperW/4 - validateButtonW/2;
      sendButtonW = 240;
      xSend = paperW/4 - sendButtonW/2;
      if (typeof enableRtl != "undefined") {
         xSend += paperW / 2;
         xValidate -= paperW / 2;
      }
      tubeContW = (level != "hard") ? tubeW + marginX : tubeW + marginX/2;
      dropTubeContW = tubeW + marginX + marginXExtraForDrop;
      xDropZone = xValidate + (validateButtonW - dropTubeContW)/2;
      for(var iTube = 0; iTube < nbTestTubes; iTube++){
         testTubesID[iTube] = "test_"+iTube;
      }
      rng = new RandomGenerator(subTask.taskParams.randomSeed + 1 + level.charCodeAt(0));
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      rng.reset(answer.seed);
   };

   subTask.resetDisplay = function () {
      $(".nbTubes").html(nbTubes);
      displayError("");
      initPaper();
      initDragAndDrop();
      initTubes();
      initDropArea();
      initTestTubes();
      updateUsed();
      initHandlers();
      if(answer.waitingForRetry){
         setRetry(letters[answer.pollutedSample],letters[answer.tube]);
      }

      displayHelper.hideValidateButton = true;
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
         tube: null,
         testTubeContent: [],
         usedTests: [],
         waitingForRetry: false
      };
      for(var iTube = 0; iTube < nbTestTubes; iTube++){
         defaultAnswer.testTubeContent[iTube] = [];
      }
      defaultAnswer.pollutedSample = null;
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true)();
      return result
   };

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);
      Beav.Raphael.loadTextExtensions(paper);

      $("#zone_2").css("position","relative");
      $("#zone_2").css("padding-top","1px");
      var y0 = 16;
      for(var iOver = 1; iOver <= 8; iOver++){
         var id = "overlay_"+iOver;
         $("#zone_2 #"+id).remove();
         $("#zone_2").append("<div id=\""+id+"\"></div>");
         var x,y,w,h;
         switch(iOver) {
            case 1:
               x = 0; y = y0;
               w = paperW;
               h = marginY;
               break;
            case 2:
               x = 0; y = y0;
               w = (paperW - nbTubes*tubeContW)/2;
               h = yLine;
               break;
            case 3:
               x = (paperW + nbTubes*tubeContW)/2;
               y = y0;
               w = paperW - x;
               h = yLine;
               break;
            case 4:
               x = 0; y = y0 + yLine;
               w = paperW;
               h = yDropZone - y + y0;
               break;
            case 5:
               x = 0;
               y = yDropZone + y0;
               h = paperH - y + y0;
               if(window.enableRtl) {
                  w = xDropZone;
               } else {
                  w = xSend + (sendButtonW - nbTestTubes*dropTubeContW)/2;
               }
               break;
            case 6:
               if(window.enableRtl) {
                  x = (level == "hard") ? xDropZone + 200 : xDropZone + 130;
                  w = xSend + (sendButtonW - nbTestTubes*dropTubeContW)/2 - x
               } else {
                  x = xSend + (sendButtonW + nbTestTubes*dropTubeContW)/2;
                  w = (level == "hard") ? xDropZone - 60 - x : xDropZone - 10 - x;
               }
               y = yDropZone + y0;
               h = paperH - y + y0;
               break;
            case 7:
               if(window.enableRtl) {
                  x = xSend + (sendButtonW + nbTestTubes*dropTubeContW)/2;
               } else {
                  x = (level == "hard") ? xDropZone + 170 : xDropZone + 100;
               }
               y = yDropZone + y0;
               w = paperW - x;
               h = paperH - y + y0;
               break;
            case 8:
               x = 0; y = yDropZone + y0 + tubeContH;
               w = paperW - x;
               h = paperH - y + y0;
               break;
         }
         $("#"+id).css({
            position: "absolute",
            top: y,
            left: x,
            width: w,
            height: h,
            background: "red",
            opacity: 0
         });
      }
   };

   function initDragAndDrop() {
      dragAndDrop = new DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            if(answer.waitingForRetry){
               return
            }
            displayError("");
            // answer.tube = this.getObjects("drop")[0];

            if(dstContId && Beav.Array.has(testTubesID,dstContId) && srcContId != "drop"){
               if(answer.usedTests.length > 0){
                  // displayError(taskStrings.errorNoMoreTest);
                  displayHelper.showPopupMessage(taskStrings.errorNoMoreTest,"blanket");
               }else{
                  var testID = Beav.Array.indexOf(testTubesID,dstContId);
                  var currPart = answer.testTubeContent[testID];
                  var newLetter = letters[srcContId];
                  if(!Beav.Array.has(currPart,newLetter,eq)){
                     currPart.push(newLetter);
                  }
                  var raphObj = testTubes[testID];
                  var x = raphObj[0].attr("x");
                  var y = raphObj[0].attr("y");
                  if(raphObj[2]){
                     raphObj[2].remove();
                  }
                  var newPartRaph = addParticles(x,y,currPart,true);
                  raphObj[2] = newPartRaph;
                  if(raphObj[1]){
                     raphObj[1].toFront();
                  }
               }
               this.removeAllObjects(dstContId)
            }
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType)
         {
            if(answer.waitingForRetry){
               return false
            }
            var cont = this.getContainer(srcCont);
            var raphSet = cont.draggableElements[0].component.element;
            var xPos = cont.draggableElements[0].component.cx;
            var yPos = cont.draggableElements[0].component.cy;
            var x = raphSet[0].attr("x");
            var y = raphSet[0].attr("y");
            var cx = x + tubeW/2;
            var cy = y + tubeH/4;
            raphSet.transform("");

            if(dstCont == "drop" || dstCont == null){
               testTubeDrop = null;
               return true
            }
            if(dstCont && isNaN(dstCont) && Beav.Array.has(testTubesID,dstCont) && srcCont != "drop"){
               var minD = Infinity;
               for(var iTube = 0; iTube < nbTestTubes; iTube++){
                  var xTube = testTubes[iTube][0].attr("x") + tubeW/2;
                  var yTube = testTubes[iTube][0].attr("y") + tubeH/2;
                  /* DEPRECATED
                  var d = Beav.Geometry.distance(xPos,yPos,xTube,yTube);
                  if(d < minD){
                     minD = d;
                  }
                  */
                  var d = xPos - xTube;
                  if(Math.abs(d) < Math.abs(minD)){
                     minD = d;
                  }
               }
               var angle = - Math.asin(minD / (tubeH/2)) * 180 / Math.PI;
               // DEPRECATED var angle = 60*(1 - minD/tubeContH);
               raphSet.transform("r"+angle+","+cx+","+cy);
               return true
            }
         },
         ejected : function(refEl, previousCont, previousPos) {

         }
      });
   };

   function initTubes() {
      var y0 = marginY;
      var x0 = (paperW - nbTubes*tubeContW)/2;

      for(var iTube = 0; iTube < nbTubes; iTube++){
         var x = x0 + iTube*tubeContW;
         var y = y0;
         var tube = drawTube(-tubeW/2,-tubeH/2,letters[iTube],[letters[iTube]]);

         dragAndDrop.addContainer({
            ident : iTube,
            cx : x + tubeContW/2, cy: y + tubeContH/2, widthPlace : tubeContW, heightPlace : tubeContH,
            type : 'source',
            sourceElemArray : tube,
            placeBackgroundArray : []
         });
      }

      var x1 = 2*marginX;
      var x2 = paperW - 2*marginX;
      paper.path("M"+x1+" "+yLine+",H"+x2).attr(lineAttr);
   };

   function initDropArea() {
      var xText = xDropZone - 60;
      var xCircle = xText;
      if (typeof enableRtl != "undefined") {
         xText += 200;
         xCircle += 240;
      }
      paper.circle(xCircle,yText,15).attr({fill:colors.blue,stroke:colors.blue});
      paper.text(xCircle, yText, "3").attr({fill:"#FFF","font-size":"16px"});
      paper.text(xText + 20,yText,taskStrings.whenYouKnow).attr(textAttr).attr({'text-anchor': 'start'});

      var x0 = (level == "hard") ? xDropZone - 40 : xDropZone + 10;
      var y0 = yDropZone + 20;
      if (typeof enableRtl != 'undefined') {
          x0 += 100;
      }
      var xSpacing = 120;
      var ySpacing = 30;
      for(var iSample = 0; iSample < nbTubes; iSample++){
         var x = x0 + Math.floor(iSample/4)*xSpacing;
         var y = y0 + (iSample%4)*ySpacing;
         var circle = paper.circle(x,y).attr(radioButtonAttr);
         var xText = x + marginX;
         var xRect = x - marginX;
         var yRect = y - ySpacing/2;
         if (typeof enableRtl != 'undefined') {
            xText -= 50;
         }
         var text = paper.text(xText,y,taskStrings.tube+" "+letters[iSample]).attr(radioTextAttr);
         var w = 120;
         var h = ySpacing;
         var overlay = paper.rect(xRect,yRect,w,h).attr(overlayAttr);
         radioButtons[iSample] = paper.set(circle,text,overlay);
         if(answer.tube == iSample){
            radioButtons[iSample][0].attr(selectedRadioAttr);
         }
      }

      // var rect = paper.rect(-dropTubeContW/2,-dropTubeContH/2,dropTubeContW,dropTubeContH).attr(dropZoneAttr);
      // var iconSize = dropTubeContW - marginX;
      // var icon = paper.image(biohazardSrc,-iconSize/2,-iconSize/2,iconSize,iconSize).attr("opacity",0.1);
      // var backgroundTarget = paper.set(rect,icon);
      // dragAndDrop.addContainer({
      //    ident : 'drop',
      //    cx : xText,
      //    cy : yDropZone + dropTubeContH/2,
      //    widthPlace : dropTubeContW,
      //    heightPlace : dropTubeContH,
      //    nbPlaces : 1,
      //    dropMode : 'replace',
      //    placeBackgroundArray : [ backgroundTarget ]
      // });

      // if(answer.tube != null){
      //    var id = answer.tube;
      //    var element = drawTube(-tubeW/2,-tubeH/2,letters[id],[letters[id]]);
      //    dragAndDrop.insertObject('drop', 0, {ident : id, elements : element });
      // }
   };

   function initTestTubes() {
      var xText = xSend - 20;
      var xCircle = xText;
      if (typeof enableRtl != "undefined") {
         xText += 200;
         xCircle += 250;
      }
      paper.circle(xCircle,yText,15).attr({fill:colors.blue,stroke:colors.blue});
      paper.text(xCircle, yText, "1").attr({fill:"#FFF","font-size":"16px"});
      paper.text(xText + 20,yText,taskStrings.dragSamples).attr(textAttr).attr({'text-anchor': 'start'});
      if (level != "easy") {
         paper.text(xText + 20,yText + 30,taskStrings.youCanMix).attr(textAttrBold).attr({'text-anchor': 'start'});
      }
      paper.circle(xCircle,yText2,15).attr({fill:colors.blue,stroke:colors.blue});
      paper.text(xCircle, yText2, "2").attr({fill:"#FFF","font-size":"16px"});
      paper.text(xText + 20,yText2,taskStrings.analyseThem).attr(textAttr).attr({'text-anchor': 'start'});

      var x0 = xSend + sendButtonW/2 - nbTestTubes*dropTubeContW/2;
      for(var iTube = 0; iTube < nbTestTubes; iTube++){
         var x = x0 + dropTubeContW*iTube;
         var tubeLabel = (nbTestTubes > 1) ? iTube + 1 : null;
         var tubePart = answer.testTubeContent[iTube];
         testTubes[iTube] = drawTube(x + (dropTubeContW - tubeW)/2,yDropZone + (dropTubeContH - tubeH)/2, tubeLabel, tubePart,false,true);
         dragAndDrop.addContainer({
            ident : testTubesID[iTube],
            cx : x + dropTubeContW/2,
            cy : yDropZone + dropTubeContH/2,
            widthPlace : dropTubeContW,
            heightPlace : dropTubeContH,
            nbPlaces : 1,
            dropMode : 'replace',
            placeBackgroundArray : [ testTubes[iTube] ]
         });
      }
   };

   function initHandlers() {
      $("#send").off("click");
      $("#send").click(sendSamples);
      $("#send").css({ opacity: 1, cursor: "pointer" });

      $("#validate").off("click");
      $("#validate").click(checkResult(false));
      $("#validate").css({ opacity: 1, cursor: "pointer" });

      for(var iRadio = 0; iRadio < radioButtons.length; iRadio++){
         radioButtons[iRadio].click(clickRadio(iRadio));
         radioButtons[iRadio].attr("cursor","pointer");
      }
   };

   function clickRadio(id) {
      return function() {
         if(answer.waitingForRetry){
            return
         }
         if(answer.usedTests.length == 0){
            displayHelper.showPopupMessage(taskStrings.noSend,"blanket");
            // displayError(taskStrings.noSend);
            return
         }
         displayError("");
         answer.tube = id;
         radioButtons[id][0].attr(selectedRadioAttr);
         for(var iRadio = 0; iRadio < radioButtons.length; iRadio++){
            if(iRadio != id){
               radioButtons[iRadio][0].attr(radioButtonAttr);
            }
         }
      }
   };

   function sendSamples() {
      displayError("");
      if(answer.usedTests.length > 0){
         displayError(taskStrings.errorNoMoreTest);
         return
      }

      for(var iTube = 0; iTube < nbTestTubes; iTube++){
         answer.usedTests.push(answer.testTubeContent[iTube].slice());
      }
      updateUsed();
      $("#send").css({ opacity: 0.5, cursor: "auto" });
   };

   function updateUsed() {
      var x0 = xSend + sendButtonW/2 - nbTestTubes*dropTubeContW/2 + (dropTubeContW - tubeW)/2;
      var y0 = yDropZone;
      var used = answer.usedTests;
      var pollutedSamples = getPollutedSample(used);
      if(pollutedSamples.length == 1){
         answer.pollutedSample = pollutedSamples[0];
         // console.log(answer.pollutedSample)
      }
      var pollutedSample = pollutedSamples[0];
      for(var iTube = 0; iTube < used.length; iTube++){
         var x = x0 + iTube*dropTubeContW;
         var y = y0 + (tubeContH - tubeH)/2;
         var part = used[iTube];
         var isPolluted = Beav.Array.has(part,letters[pollutedSample]);
         if(isPolluted){
            var raphObj = testTubes[iTube];
            var xTube = raphObj[0].attr("x");
            var yTube = raphObj[0].attr("y");
            raphObj[0].remove();
            raphObj[0] = paper.image(pollutedTubeSrc,xTube,yTube,tubeW,tubeH).toBack();
         }
         var yInfo = y - infoBoxH - 5;
         infoBox[iTube] = drawInfoBox(x,yInfo,isPolluted);
      }
   };

   function getPollutedSample(used) {
      for(var iSample = 0; iSample < nbTubes; iSample++){
         var possibleResult = [];
         var sample = letters[iSample];
         for(var iTestTube = 0; iTestTube < used.length; iTestTube++){
            var testTube = used[iTestTube];
            if(Beav.Array.has(testTube,sample)){
               possibleResult[iTestTube] = true;
            }else{
               possibleResult[iTestTube] = false;
            }
         }
         // console.log(iSample,possibleResult)

         for(var jSample = iSample + 1; jSample < nbTubes; jSample++){
            var altResult = [];
            var altSample = letters[jSample];
            var sameResult = true;
            for(var iTestTube = 0; iTestTube < used.length; iTestTube++){
               var testTube = used[iTestTube];
               if(Beav.Array.has(testTube,altSample)){
                  altResult[iTestTube] = true;
               }else{
                  altResult[iTestTube] = false;
               }
               if(altResult[iTestTube] != possibleResult[iTestTube]){
                  sameResult = false;
                  break;
               }
            }
            if(sameResult == true){
               return [iSample,jSample]
            }
         }
      }
      if(level != "easy"){
         return [rng.nextInt(0,nbTubes - 1)]
      }else{
         for(var iSample = 0; iSample < nbTubes; iSample++){
            var sample = letters[iSample];
            var found = false;
            for(var iTestTube = 0; iTestTube < used.length; iTestTube++){
               var testTube = used[iTestTube];
               if(Beav.Array.has(testTube,sample)){
                  found = true;
                  break;
               }
            }
            if(!found){
               return [iSample]
            }
         }
         return [rng.nextInt(0,nbTubes - 1)]
      }
   };

   function drawTube(x,y,label,particles,polluted,testTube) {
      var src = polluted ? pollutedTubeSrc : tubeSrc;
      var tube = paper.image(src,x,y,tubeW,tubeH);
      var labelRaph = null;
      var particlesRaph = null;
      if(label){
         var xLabel = x + (tubeW - labelW)/2;
         var yLabel = y + 11;
         var xText = xLabel + labelW/2;
         var yText = yLabel + labelH/2;
         var rect = paper.rect(xLabel,yLabel,labelW,labelH).attr(labelAttr);
         var letter = paper.text(xText,yText,label).attr(labelTextAttr);
         labelRaph = paper.set(rect,letter);
      }
      if(particles && particles.length > 0){
         particlesRaph = addParticles(x,y,particles,testTube);
      }
      if(labelRaph){
         labelRaph.toFront();
      }
      // overlay needed to make sure drag works on ie8
      var overlay = paper.rect(x,y,tubeW,tubeH).attr({opacity:0,fill:"white"});
      return [tube,labelRaph,particlesRaph,overlay];
   };

   function drawInfoBox(x,y,polluted) {
      var attr = polluted ? pollutedAttr : cleanAttr;
      var text = polluted ? taskStrings.polluted : taskStrings.clean;
      var w = infoBoxW;
      x += tubeW/2;
      x -= w/2;
      var h = infoBoxH;
      var trW = 10;
      var rect = paper.rect(x,y,w,h).attr(attr);

      var xText = x + w/2;
      var yText = y + h/2;
      var textRaph = paper.text(xText,yText,text).attr(infoBoxTextAttr);

      var x1 = xText - trW/2;
      var x2 = xText + trW/2;
      var x3 = xText;
      var y1 = y + h;
      var y3 = y1 + 5;
      var arrow = paper.path("M"+x1+" "+y1+",H"+x2+",L"+x3+" "+y3).attr(attr);
      return paper.set(rect,textRaph,arrow);
   };

   function addParticles(x,y,particles,testTube) {
      var particlesRaph = paper.set();
      if(!testTube){
         var x0Part = x + tubeW/2 - particleR - particleR/4;
         var y0Part = y + 11 + labelH + 30;
      }else{
         var x0Part = x + tubeW/2 - particleR - particleR/4;
         var y0Part = y + tubeH - 25;
      }
      var particlesRaph = paper.set();
      var nbPart = (!testTube) ? nbParticles : particles.length;
      for(var iPart = 0; iPart < nbPart; iPart++){
         var partLetter = particles[iPart%particles.length];
         if(!testTube){
            var xPart = x0Part + (2*particleR + 2*particleR/4)*(iPart%2);
            var yPart = y0Part + 1.5*particleR*iPart;
         }else{
            var xPart = x0Part + (2*particleR + 2*particleR/4)*(iPart%2);
            var yPart = y0Part - 2.5*particleR*Math.floor(iPart/2);
         }
         var partColor = particleColors[Beav.Array.indexOf(letters, partLetter)];
         var circle = paper.circle(xPart,yPart).attr(particleAttr).attr("fill",partColor);
         var partLetterRaph = paper.text(xPart,yPart,partLetter).attr(partLetterAttr);
         var partRaph = paper.set(circle,partLetterRaph);
         particlesRaph.push(partRaph);
      }
      return particlesRaph
   };

   function eq(val1,val2) {
      if(val1 == val2){
         return true
      }
      return false
   };

   function checkResult(noVisual) {
      return function(){
         // console.log(answer)
         var error = null;
         if(answer.tube == null){
            var error = taskStrings.drag;
         }else if(answer.usedTests.length == 0){
            var error = taskStrings.noSend;
         }
         if(error){
            if(!noVisual){
               displayHelper.showPopupMessage(error,"blanket");
               // displayError(error);
            }
            return { successRate: 0, message: error };
         }
         // console.log(answer.pollutedSample)
         if(answer.pollutedSample == null){
            var pollutedSamples = getPollutedSample(answer.usedTests);
            if(pollutedSamples.length > 1){
               var pollutedSample = (pollutedSamples[0] == answer.tube) ? pollutedSamples[1] : pollutedSamples[0];
            }else{
               var pollutedSample = pollutedSamples[0];
            }
         }else{
            var pollutedSample = answer.pollutedSample;
         }


         if(answer.tube != pollutedSample){
            answer.pollutedSample = pollutedSample;
            var error = taskStrings.fail(letters[pollutedSample],letters[answer.tube]);
            if(!noVisual){
               setRetry(letters[pollutedSample],letters[answer.tube]);
            }
            return { successRate: 0, message: error };
         }

         if(!noVisual){
            platform.validate("done");
         }
         return { successRate: 1, message: taskStrings.success };
      }
   };

   function setRetry(poll,ans) {
      displayError(taskStrings.fail(poll,ans));
      answer.waitingForRetry = true;
      $("#validate").off("click");
      $("#validate").css({ opacity: 0.5, cursor: "auto" });
   };

   function displayError(msg) {
      $("#displayHelper_graderMessage").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
