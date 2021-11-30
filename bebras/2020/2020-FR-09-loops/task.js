function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         gridArray: [
            [0,0,0,0,1,1,1,1,0,0,0,0,1],
            [1,1,1,0,0,0,0,1,1,1,1,0,0],
            [0,0,1,1,1,1,0,0,0,0,1,1,1],
            [0,0,0,0,0,1,1,1,1,0,0,0,0],
            [1,1,0,0,0,0,0,0,1,1,1,1,2]
         ],
         startPos: [0,0],
         nbDropCont: 4,
         loops: [[0,3]],
         contW: 42,
         contH: 42,
         animTime: 500
      },
      medium: {
         gridArray: [
            [0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,1,0],
            [1,1,0,1,1,0,0,0,0,1,0,0,0,0,0,0,0,0],
            [0,1,0,0,1,1,0,0,0,0,0,0,0,0,1,1,1,1],
            [0,1,1,0,0,1,1,0,0,0,0,1,1,1,1,0,0,0],
            [0,0,1,1,0,0,1,1,1,1,1,1,0,0,0,0,1,0],
            [0,0,0,1,1,0,0,1,1,0,0,0,0,1,1,1,1,0],
            [0,1,0,0,1,1,0,0,0,0,1,1,1,1,0,0,1,2]
         ],
         startPos: [0,0],
         nbDropCont: 15,
         loops: [[4,5],[7,10]],
         contW: 35,
         contH: 35,
         animTime: 200
      },
      hard: {
         gridArray: [
            [0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0],
            [0,0,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
            [1,0,0,1,1,1,1,0,0,0,1,1,0,0,1,1,1,1,1,0,0,0,0,0,0],
            [1,1,0,0,1,0,0,0,1,0,0,1,1,1,1,0,0,0,1,1,0,0,1,1,1],
            [0,1,1,0,0,0,1,1,1,1,0,0,1,0,0,0,1,0,0,1,1,1,1,0,0],
            [0,0,1,1,1,1,1,0,0,1,1,0,0,0,1,1,1,1,0,0,1,0,0,0,0],
            [1,0,0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,1,1,0,0,0,1,1,0],
            [0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,2],
         ],
         startPos: [0,0],
         nbDropCont: 10,
         loops: [[1,2],[4,6],[1,6]],
         contW: 42,
         contH: 42,
         animTime: 200
      }
   };

   var paper;
   var paperW = 770;
   var paperH;
   var marginX = 5;
   var marginY = 20;
   var maxCellSize = 40;
   var cellSize;
   var xGrid, yGrid;
   var contW;
   var contH;
   var srcMargin = 20;
   var dropMargin = 4;
   var xSrc, ySrc;
   var loopBoxMinW = 160;
   var totalDropW;
   var loopPadding = 35;
   var loopUpPadding = 4;
   var xDrop, yDrop;
   var loopTextH = 30;
   var loopButtonR = 16;
   var loopH;
   var stopButtonW = 150;
   var stopButtonH = 35;

   var grid;
   var gridArray;
   var nbRows, nbCol;
   var robot;
   var startPos;
   var dragAndDrop;
   var structure;
   var srcNames = ["right","down","left","up"/*,"wait"*/];
   var dropNames = [];
   var nbDropCont, loops;
   var dropPos = [];
   var loopText = [];
   var loopButtons = [];
   var maxRepeat = 4;
   var minRepeat = 1;
   var animTime;
   var pause = 150;
   var stopButton;

   var wallSrc = $("#wall").attr("src");
   var goalSrc = $("#goal").attr("src");
   var robotSrc = $("#robot").attr("src");

   var colors = {
      yellow: "#f5a623",
      lightYellow: "#fff1c4",
      green: "#1ca169",
      blue: "#4a90e2",
      darkBlue: "#2e5e95",
      lightGrey: "#e5e5e5",
      grey: "#cdcdcd",
      black: "#4a4a4a",
      orange: "#ff945e",
      darkOrange: "#bf5e47"
   };

   var lineAttr = {
      stroke: colors.green,
      "stroke-width": 1
   };
   var groundAttr = {
      stroke: "none",
      fill: colors.lightYellow
   };
   var rectAttr = {
      stroke: "none",
      fill: colors.blue,
      r: 3
   };
   var shadowAttr = {
      stroke: "none",
      fill: colors.darkBlue,
      r: 3
   };
   var selectedRectAttr = {
      stroke: "none",
      fill: colors.orange,
      r: 3
   };
   var selectedShadowAttr = {
      stroke: "none",
      fill: colors.darkOrange,
      r: 3
   };
   var iconAttr = {
      stroke: "none",
      fill: "white"
   };
   var dropRectAttr = {
      stroke: colors.black,
      fill: colors.lightGrey,
      "stroke-width": 2,
      r: 3
   };
   var loopRectAttr = {
      stroke: colors.blue,
      "stroke-width": 3,
      r: 5
   };
   var loopTextAttr = {
      "font-size": 16,
      "font-weight": "bold",
      fill: colors.black
   };
   var loopArrowAttr = {
      stroke: colors.yellow,
      "stroke-width": 2,
      "arrow-end": "block-long-wide"
   };
   var loopButtonAttr = {
      shadow: {
         stroke: "none",
         fill: "black",
         r: loopButtonR
      },
      circle: {
         stroke: "none",
         fill: colors.black,
         r: loopButtonR
      },
      text: {
         "font-size": 20,
         "font-weight": "bold",
         fill: "white"
      }
   };
   var stopButtonAttr = {
      stroke: "none",
      fill: colors.blue,
      width: stopButtonW,
      height: stopButtonH,
      r: stopButtonH/2
   };
   var stopButtonTextAttr = {
      "font-size": 13,
      "font-weight": "bold",
      fill: "white"
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      gridArray = data[level].gridArray;
      startPos = data[level].startPos;
      structure = data[level].structure;
      nbDropCont = data[level].nbDropCont;
      loops = data[level].loops;
      contW = data[level].contW;
      contH = data[level].contH;
      animTime = data[level].animTime;
      loopH = loopUpPadding + contH + loopTextH + 2*loopButtonR + marginY;
      nbRows = gridArray.length;
      nbCol = gridArray[0].length;
      cellSize = Math.min(maxCellSize, (paperW - 2*marginX)/nbCol);
      xGrid = (paperW - nbCol*cellSize)/2;
      yGrid = marginY;
      ySrc = yGrid + nbRows*cellSize + marginY;
      xSrc = (paperW - srcNames.length*(contW + srcMargin) + srcMargin)/2;
      // TODO: set xDrop in level
      if(level == "easy"){
         xDrop = (paperW - (nbDropCont*(contW + dropMargin) - dropMargin))/2;
      }else if(level == "medium"){
         xDrop = 5;
      }else{
         xDrop = 50;
      }
      yDrop = ySrc + contH + 2*marginY;
      paperH = yDrop + loopH + marginY;
      if(level != "easy"){
         paperH += loopUpPadding + loopTextH + 2*loopButtonR + marginY;
      }
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      displayError("");
      initPaper();
      initGrid();
      resetRobot();
      initDragAndDrop();
      initSrc();
      initDrops();
      initLoops();
      initStopButton();
      initHandlers();
      displayHelper.setValidateString(taskStrings.validate);
      displayHelper.customValidate = checkResult;
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
         nbRepeat: [],
         seq: Beav.Array.make(nbDropCont,null)
      };
      for(var iLoop = 0; iLoop < loops.length; iLoop++){
         defaultAnswer.nbRepeat[iLoop] = 2;
      }
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   var initPaper = function () {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);

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
               h = ySrc;
               break;
            case 2:
               x = 0; y = y0 + ySrc;
               w = xSrc;
               h = contH;
               break;
            case 3:
               x = 0; y = y0 + ySrc + contH;
               w = paperW;
               h = yDrop - y + y0;
               break;
            case 4:
               x = 0; y = y0 + yDrop;
               w = xDrop;
               h = paperH - y + y0;
               break;
            case 5:
               if(level == "easy"){
                  x = 475;
               }else if(level == "medium"){
                  x = 745;
               }else{
                  x = 720;
               }
               y = y0 + yDrop;
               w = paperW - x;
               h = paperH - y + y0;
               break;
            case 6:
               x = xDrop; y = y0 + yDrop + contH;
               if(level == "easy"){
                  w = 50;
               }else if(level == "medium"){
                  w = 195;
               }else{
                  w = 120;
               }
               h = paperH - y + y0;
               break;
            case 7:
               if(level == "easy"){
                  x = 425;
               }else if(level == "medium"){
                  x = 515;
               }else{
                  x = 480;
               }
               y = y0 + yDrop + contH;
               w = paperW - x;
               h = paperH - y + y0;
               break;
            case 8:
               x = 0;
               if(level == "easy"){
                  y = 445;
               }else if(level == "medium"){
                  y = 510;
               }else{
                  y = 570;
               }
               w = paperW;
               h = paperH - y + y0;
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

   function initGrid() {
      grid = Grid.fromArray("paper", paper, gridArray, cellFiller, cellSize, cellSize, xGrid, yGrid, lineAttr);
   };

   function initDragAndDrop() {
      dragAndDrop = new DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            stopAnim();
            for(var iDrop = 0; iDrop < nbDropCont; iDrop++){
               var name = dropNames[iDrop];
               answer.seq[iDrop] = this.getObjects(name)[0];
            }

         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType)
         {
            if(Beav.Array.has(srcNames,dstCont,eq)){
               return false
            }
            if(dstCont == null){
               if(Beav.Array.has(dropNames,srcCont)){
                  return true
               }
               return false
            }
            return true
         }
         // actionIfEjected(refElement, previousContainerId, previousPos) {
         //    return DragAndDropSystem.action(refElement.ident,0,'replace');
         // }
      });
   };

   function initSrc() {
      for(var iSrc = 0; iSrc < srcNames.length; iSrc++){
         var name = srcNames[iSrc];
         var x = xSrc + iSrc*(contW + srcMargin);
         var elem = drawSrcElement(name,-contW/2,-contH/2);

         dragAndDrop.addContainer({
            ident : name,
            cx : x + contW/2, cy: ySrc + contH/2, widthPlace : contW, heightPlace : contH,
            nbPlaces: 1,
            type : 'source',
            sourceElemArray : elem,
            placeBackgroundArray : []
         });
      }
   };

   function initDrops() {
      var x = xDrop;
      var y = yDrop;
      var w = contW;
      var h = contH;
      for(var iDrop = 0; iDrop < nbDropCont; iDrop++){
         var rect = paper.rect(-w/2,-h/2,w,h).attr(dropRectAttr);
         var name = 'drop_'+iDrop;
         dropNames[iDrop] = name;
         dropPos[iDrop] = x;
         dragAndDrop.addContainer({
            ident : name,
            cx : x + w/2,
            cy : y + h/2,
            widthPlace : contW,
            heightPlace : contH,
            nbPlaces : 1,
            dropMode : 'replace',
            placeBackgroundArray : [rect]
         });
         if(answer.seq[iDrop]){
            var elemID = answer.seq[iDrop];
            var elem = drawSrcElement(elemID,-contW/2,-contH/2);
            dragAndDrop.insertObject(name, 0, {ident : elemID, elements : elem });
         }
         x += contW + dropMargin;
         for(var iLoop = 0; iLoop < loops.length; iLoop++){
            var start = loops[iLoop][0];
            var end = loops[iLoop][1];
            var nbCellsInside = end - start + 1;
            var widthOfCells = nbCellsInside*(w + dropMargin) - dropMargin;
            var loopW = widthOfCells + 2*loopPadding;
            var isCont = isContainer(iLoop);
            if(start == iDrop + 1){
               if(loopW < loopBoxMinW && !isCont){
                  x += (loopBoxMinW - widthOfCells)/2;
               }else{
                  x += loopPadding;
               }
            }
            if(end == iDrop){
               if(loopW < loopBoxMinW && !isCont){
                  x += (loopBoxMinW - widthOfCells)/2;
               }else{
                  x += loopPadding;
               }
            }
         }
      }
   };

   function initLoops() {
      for(var iLoop = 0; iLoop < loops.length; iLoop++){
         var loop = loops[iLoop];
         var start = loop[0];
         var end = loop[1];
         var isCont = isContainer(iLoop);
         if(!isCont){
            var x0 = dropPos[start] - loopPadding;
            var y0 = yDrop - loopUpPadding;
            var x1 = dropPos[end] + contW + loopPadding;
            var y1 = y0 + loopH;
         }else{
            var x0 = dropPos[start - 1] + contW + dropMargin;
            var y0 = yDrop - 2*loopUpPadding;
            var x1 = dropPos[end + 1] - dropMargin;
            var y1 = y0 + loopUpPadding + loopH + loopTextH + 2*loopButtonR + marginY;
         }
         var w = x1 - x0;
         var h = y1 - y0;
         var nbCellsInside = end - start + 1;
         var widthOfCells = nbCellsInside*(contW + dropMargin) - dropMargin;
         if(w < loopBoxMinW){
            w = loopBoxMinW;
            x0 = dropPos[start] - (loopBoxMinW -  widthOfCells)/2;
            x1 = dropPos[start] + contW - (loopBoxMinW -  widthOfCells)/2;
         }
         paper.rect(x0,y0,w,h).attr(loopRectAttr);
         var xText = x0 + w/2;
         var yText = y0 + h - marginY - 2*loopButtonR - loopTextH/2;
         loopText[iLoop] = paper.text(xText,yText,taskStrings.loopText(answer.nbRepeat[iLoop])).attr(loopTextAttr);

         if(isCont){
            var x1Arr1 = x0 + w - loopPadding + dropMargin;
            var x4Arr2 = x0 + loopPadding - dropMargin;
         }else{
            var x1Arr1 = dropPos[end] + contW + dropMargin;
            var x4Arr2 = dropPos[start] - dropMargin;
         }
         var y1Arr1 = yDrop + contH/2;
         var x2Arr1 = x0 + w - loopPadding/3;
         var y3Arr1 = yText;
         var x4Arr1 = xText + 55;
         var x1Arr2 = xText - 55;
         var y1Arr2 = yText;
         var x2Arr2 = x0 + loopPadding/3;
         var y3Arr2 = y1Arr1;
         paper.path("M"+x1Arr1+" "+y1Arr1+",H"+x2Arr1+",V"+y3Arr1+",H"+x4Arr1).attr(loopArrowAttr);
         paper.path("M"+x1Arr2+" "+y1Arr2+",H"+x2Arr2+",V"+y3Arr2+",H"+x4Arr2).attr(loopArrowAttr);

         var xMinus = xText - loopButtonR - 5;
         var xPlus = xText + loopButtonR + 5;
         var yButton = y0 + h - marginY - loopButtonR;
         var minusButton = drawLoopButton(xMinus,yButton,"-");
         var plusButton = drawLoopButton(xPlus,yButton,"+");
         loopButtons[iLoop] = [minusButton,plusButton];
      }
   };

   function initStopButton() {
      var x = xSrc + srcNames.length*(contW + srcMargin) + 50;
      var y = ySrc + (contH - stopButtonH)/2;
      var rect = paper.rect(x,y).attr(stopButtonAttr);
      var xText = x + stopButtonW/2;
      var yText = y + stopButtonH/2;
      var text = paper.text(xText,yText,taskStrings.stop.toUpperCase()).attr(stopButtonTextAttr);
      stopButton = paper.set(rect,text);
   };

   function initHandlers() {
      for(var iLoop = 0; iLoop < loops.length; iLoop++){
         for(var iButton = 0; iButton < 2; iButton++){
            loopButtons[iLoop][iButton].click(onClick(iLoop,iButton));
            loopButtons[iLoop][iButton].attr("cursor","pointer");
         }
      }
      stopButton.click(stopAnim);
      stopButton.attr("cursor","pointer");
   };

   function onClick(loop,button) {
      return function() {
         stopAnim();
         var currRepeat = answer.nbRepeat[loop];
         if(button == 0){
            if(currRepeat > minRepeat){
               answer.nbRepeat[loop]--;
               updateCounter(loop);
            }else{
               return
            }
         }else if(button == 1){
            if(currRepeat < maxRepeat){
               answer.nbRepeat[loop]++;
               updateCounter(loop);
            }else{
               return
            }
         }
      }
   };

   function stopAnim() {
      subTask.delayFactory.destroy("delay");
      subTask.raphaelFactory.stopAnimate("anim");
      displayError("");
      removeHighlight();
   };

   function removeHighlight() {
      for(var iCell = 0; iCell < answer.seq.length; iCell++){
         var cont = dragAndDrop.getContainer(dropNames[iCell]);
         if(!cont.draggableElements[0]){
            continue
         }
         var elem = cont.draggableElements[0].component.element;
         elem[0].attr(shadowAttr);
         elem[1].attr(rectAttr);
      }
   };

   function updateCounter(loop) {
      loopText[loop].attr("text",taskStrings.loopText(answer.nbRepeat[loop]));
   };

   function isContainer(iLoop) {
      var loop = loops[iLoop];
      var start = loop[0];
      var end = loop[1];
      var isContainer = false;
      for(var jLoop = 0; jLoop < loops.length; jLoop++){
         if(jLoop != iLoop){
            var altLoop = loops[jLoop];
            var altStart = altLoop[0];
            var altEnd = altLoop[1];
            if(start <= altStart && end >= altEnd){
               if(!isContainer){
                  isContainer = [jLoop];
               }else{
                  isContainer.push(jLoop);
               }
            }
         }
      }
      return isContainer
   };

   var cellFiller = function (cellData, paper) {
      var xPos = cellData.xPos;
      var yPos = cellData.yPos;
      var entry = cellData.entry;

      var rect = paper.rect(xPos,yPos,cellSize,cellSize).attr(groundAttr).toBack();
      if(entry == 1){
         var wall = paper.image(wallSrc,xPos,yPos,cellSize,cellSize);
         return [rect,wall]
      }else if(entry == 2){
         var flagZoom = 0.8;
         var flagMargin = cellSize * (1 - flagZoom) / 2;
         var flag = paper.image(goalSrc,xPos+flagMargin,yPos+flagMargin,cellSize*flagZoom,cellSize*flagZoom);
         return [rect,flag]
      }else{
         return [rect]
      }
   };

   var resetRobot = function () {
      var x0 = xGrid + startPos[1]*cellSize;
      var y0 = yGrid + startPos[0]*cellSize;
      if(!robot){
         robot = paper.image(robotSrc,x0,y0,cellSize,cellSize);
      }else{
         robot.attr({x: x0, y: y0});
      }
   };

   function drawSrcElement(name,x,y) {
      var shadow = paper.rect(x,y,contW,contH).attr(shadowAttr);
      var rect = paper.rect(x,y,contW,contW).attr(rectAttr);
      var icon = null;
      if(name == "wait"){
         var path = "M360 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24 0 90.965 51.016 167.734 120.842 192C75.016 280.266 24 357.035 24 448c-13.255 0-24 10.745-24 24v16c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24 0-90.965-51.016-167.734-120.842-192C308.984 231.734 360 154.965 360 64c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24zm-75.078 384H99.08c17.059-46.797 52.096-80 92.92-80 40.821 0 75.862 33.196 92.922 80zm.019-256H99.078C91.988 108.548 88 86.748 88 64h208c0 22.805-3.987 44.587-11.059 64z";
         icon = paper.path(path).transform("t -7 -11 s 0.04 0.04 0 0").attr(iconAttr);
      }else{
         icon = drawArrow(name,x,y);
      }
      return paper.set(shadow,rect,icon);
   };

   function drawArrow(name,x,y) {
      var margin = 5;
      var w = contW;
      var h = contH - 2;
      var baseW = w/3;
      var xc = x + w/2;
      var yc = y + h/2;

      var path = "";
      if (name == "up" || name == "down") {
         var tx = [xc, x + w - margin, xc + baseW / 2, xc - baseW / 2, x + margin];
         var ty = [y + margin, y + h/2, y + h - margin, y + h/2];

         if (name == "down") {
            for (var iY = 0; iY < ty.length; iY++) {
               ty[iY] = 2*y + contH - ty[iY];
            }
         }
         path = "M "+tx[0]+" "+ty[0]+",L "+tx[1]+" "+ty[1]+",H "+tx[2]+", V"+ty[2]+",H"+tx[3]+",V"+ty[3]+",H"+tx[4]+",Z";
      } else {
         var tx = [x + margin, x + w/2, x + w - margin, x + w/2];
         var ty = [yc, y + h - margin, yc + baseW / 2, yc - baseW / 2, y + margin];

         if (name == "right") {
            for (var iX = 0; iX < tx.length; iX++) {
               tx[iX] = 2*x + contW - tx[iX];
            }
         }
         path = "M "+tx[0]+" "+ty[0]+",L "+tx[1]+" "+ty[1]+",V "+ty[2]+", H"+tx[2]+",V"+ty[3]+",H"+tx[3]+",V"+ty[4]+",Z";
      }
      var arrow = paper.path(path).attr(iconAttr);
      return arrow
   };

   function drawLoopButton(x,y,text) {
      var attr = loopButtonAttr;
      var shadow = paper.circle(x,y + 2).attr(attr.shadow);
      var circle = paper.circle(x,y).attr(attr.circle);
      var text = paper.text(x,y,text).attr(attr.text);
      return paper.set(shadow,circle,text)
   };

   function eq(val1,val2) {
      if(val1 == val2){
         return true
      }
      return false
   };

   function checkResult(noVisual) {
      if(!noVisual){
         stopAnim();
      }
      if(answer.seq[0] == null){
         var error = taskStrings.fillFirst;
         if(!noVisual){
            displayError(error);
         }
         return { successRate: 0, message: error }
      }
      if(!noVisual){
         var sim = subTask.simulationFactory.create("sim");
         var simStep = new SimulationStep();
      }
      var currPos = startPos.slice();
      var error = null;
      var goal = false;
      var end = false;
      var repeatCount = Beav.Array.make(loops.length,1);
      var entryIndex = 0;
      for(var iDrop = 0; iDrop < nbDropCont; iDrop++){
         var move = answer.seq[iDrop];
         // if(!move){
         //    continue;
         // }
         var dropIndex = iDrop;
         var prevPos = currPos.slice();
         switch(move){
            case "up":
               currPos[0]--;
               break;
            case "right":
               currPos[1]++;
               break;
            case "down":
               currPos[0]++;
               break;
            case "left":
               currPos[1]--;
         }

         for(var iLoop = 0; iLoop < loops.length; iLoop++){
            var loop = loops[iLoop];
            var endLoop = loop[1];
            var startLoop = loop[0];
            if(iDrop == endLoop){
               var currRepeat = repeatCount[iLoop];
               if(currRepeat < answer.nbRepeat[iLoop]){
                  iDrop = startLoop - 1;
                  repeatCount[iLoop]++;
                  var isCont = isContainer(iLoop);
                  if(isCont){
                     for(var jLoop = 0; jLoop < isCont.length; jLoop++){
                        var loopID = isCont[jLoop];
                        repeatCount[loopID] = 1;
                     }
                  }
               }
            }
         }
         var outside = currPos[0] < 0 || currPos[0] >= nbRows || currPos[1] < 0 || currPos[1] >= nbCol;
         if(outside || gridArray[currPos[0]][currPos[1]] == 1){
            if (outside) {
               error = taskStrings.outside;
            } else {
               error = taskStrings.crash ;
            }
            currPos[0] = (prevPos[0] + currPos[0])/2;
            currPos[1] = (prevPos[1] + currPos[1])/2;
         }else if(gridArray[currPos[0]][currPos[1]] == 2){
            goal = true;
         }
         if(iDrop == nbDropCont - 1){
            end = true;
         }
         if(!noVisual){
            var simAction = { onExec: moveRobot, duration: animTime, params: { pos: currPos.slice(), dropIndex: dropIndex, error: error, goal: goal, end: end, empty: (move == null) } };
            var entryName = "entry_"+entryIndex;
            entryIndex++;
            var simEntry = { name: entryName, action: simAction };
            simStep.addEntryAllParents(simEntry);
         }
         if(error){
            break;
         }
      }
      if(!noVisual){
         sim.addStep(simStep);
         sim.setAutoPlay(true);
         sim.play();
      }
      if(error){
         return { successRate: 0, message: error }
      }
      if(!goal){
         return { successRate: 0, message: taskStrings.notAtGoal }
      }
      return { successRate: 1, message: taskStrings.success }
   };

   function moveRobot(params,duration,callback) {
      var error = params.error;
      if(params.empty){
         if(params.end){
            if(!params.goal){
               displayError(taskStrings.notAtGoal);
            }else{
               platform.validate("done");
            }
         }
         callback();
      }else{
         var cont = dragAndDrop.getContainer(dropNames[params.dropIndex]);
         var elem = cont.draggableElements[0].component.element;
         elem[0].attr(selectedShadowAttr);
         elem[1].attr(selectedRectAttr);
         var newPos = params.pos;
         var newX = xGrid + newPos[1]*cellSize;
         var newY = yGrid + newPos[0]*cellSize;

         var anim = new Raphael.animation({ x: newX, y: newY },duration,function() {
            if(!error && !(params.end && !params.goal)){
               elem[0].attr(shadowAttr);
               elem[1].attr(rectAttr);
            }
            subTask.delayFactory.destroy("delay");
            subTask.delayFactory.create("delay",function() {
               callback();
            },pause);
         });
         subTask.raphaelFactory.animate("anim",robot,anim);
      }

      return { stop: function() {
         if(error){
            displayError(error);
         }else if(params.end && !params.goal){
            displayError(taskStrings.notAtGoal);
         }
         if(error || params.goal || params.end){
            subTask.simulationFactory.destroy("sim");
         }
         if(params.end && params.goal){
            platform.validate("done");
         }
      }};
   };

   function displayError(msg) {
      $("#displayHelper_graderMessage ").html(msg);
      if(!msg && robot){
         resetRobot();
      }
      subTask.simulationFactory.destroy("sim");
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
