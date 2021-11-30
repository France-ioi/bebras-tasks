function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         events: [0,0,1,0,0,0,1,0,1,0,1]
      },
      medium: {
         events: [0,0,0,1,0,0,0,0,2,1,2,1,0,0,0,1,2,1]
      },
      hard: {
         events: [0,0,0,0,0,1,2,1,0,0,0,0,0,2,1,2,1,0,0,0,0,1,0,2,1]
      }
   };

   var paper;
   var paperW = 770;
   var paperH;
   var marginX = 20;
   var marginY = 20;
   var beaverW = 60;
   var beaverH = 57;
   var cellSize = 80;
   var xNewBeav = (paperW - beaverW)/2;
   var yNewBeav = marginY;
   var xNewInfoBox = xNewBeav + beaverW + marginX;
   var wNewInfoBox = 230;
   var hNewInfoBox = 60;
   var yNewInfoBox = yNewBeav + (beaverH - hNewInfoBox)/2;

   var grid;
   var nbRows = 3;
   var nbCol = 3;
   var gridW = nbCol*cellSize;
   var gridH = nbRows*cellSize;
   var xGrid = (paperW - gridW)/2;
   var yGrid = yNewBeav + beaverH + marginY;
   var xBlue = xGrid + gridW + cellSize;
   var yBlue = yGrid + cellSize;
   var xGreen = xGrid - 2*cellSize;
   var yGreen = yBlue;
   var wRightInfoBox = 170;
   var xRightInfoBox = xBlue + (cellSize - wRightInfoBox)/2;
   var hRightInfoBox = 80;
   var yRightInfoBox = yBlue - hRightInfoBox - marginY;
   var wLeftInfoBox = wRightInfoBox;
   var xLeftInfoBox = xGreen + (cellSize - wLeftInfoBox)/2;
   var hLeftInfoBox = hRightInfoBox;
   var yLeftInfoBox = yGreen - hLeftInfoBox - marginY;
   var xInfoBox = [xNewInfoBox,xRightInfoBox,xLeftInfoBox];
   var yInfoBox = [yNewInfoBox,yRightInfoBox,yLeftInfoBox];
   var wInfoBox = [wNewInfoBox,wRightInfoBox,wLeftInfoBox];
   var hInfoBox = [hNewInfoBox,hRightInfoBox,hLeftInfoBox];
   var animTime = 500;

   var events;
   var infoBox = [];
   var beavers = [];
   var blueSquare, greenSquare;
   var dragData;

   var beaverSrc = $("#beaver").attr("src");

   var colors = {
      black: "#4a4a4a",
      grey: "#e5e5e5",
      blue: "#4a90e2",
      green: "#9acc68",
      yellow: "#f5a623"
   };

   var gridLineAttr = {
      stroke: colors.black,
      "stroke-width": 1
   };
   var gridRectAttr = {
      stroke: "none",
      fill: colors.grey
   };
   var blueSquareAttr = {
      stroke: colors.blue,
      "stroke-width": 2,
      "stroke-dasharray": "- ",
      r: 5
   };
   var squareHighlightAttr = {
      stroke: colors.yellow,
      "stroke-width": 3,
      "stroke-dasharray": "- ",
      r: 5
   };
   var greenSquareAttr = {
      stroke: colors.green,
      "stroke-width": 2,
      "stroke-dasharray": "- ",
      r: 5
   };
   var infoBoxAttr = {
      rect: {
         stroke: "none",
         fill: colors.blue,
         r: 5
      },
      text: {
         "font-size": 16,
         "font-weight": "bold",
         fill: "white"
      },
      arrow: {
         stroke: "none",
         fill: colors.blue
      }
   };
   var highlightAttr = {
      stroke: colors.yellow,
      "stroke-width": 3
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      events = data[level].events;
      paperH = yGrid + gridH + marginY;
      // rng = new RandomGenerator(subTask.taskParams.randomSeed + level.charCodeAt(0));
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      // rng.reset(answer.seed);
   };

   subTask.resetDisplay = function () {
      displayError("");
      initPaper();
      initGrid();
      initSideSquares();
      // if(answer.history.length <= events.length){
         proceed();
      // }

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
         history: [ {
            grid: Beav.Matrix.make(nbRows,nbCol,null),
            blue: null,
            green: null
         }],
         progress: 0
      };

      return defaultAnswer;
   };

   function getResultAndMessage() {
      if(answer.history.length != events.length + 1){
         return { successRate: 0, message: taskStrings.notComplete }
      }
      for(var iMove = 1; iMove < answer.history.length; iMove++){
         var currMove = answer.history[iMove];
         var lastMove = answer.history[iMove - 1];
         if(currMove.blue != null && currMove.blue != getFirst(lastMove)){
            return { successRate: 0, message: taskStrings.notFirst }
         }
         if(currMove.green != null && currMove.green != getLast(lastMove)){
            return { successRate: 0, message: taskStrings.notLast }
         }
      }
      return { successRate: 1, message: taskStrings.success }
   };

   subTask.unloadLevel = function (callback) {
      subTask.raphaelFactory.destroy("anim");
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
      for(var iOver = 1; iOver <= 10; iOver++){
         var id = "overlay_"+iOver;
         $("#zone_2 #"+id).remove();
         $("#zone_2").append("<div id=\""+id+"\"></div>");
         var x,y,w,h;
         switch(iOver) {
            case 1:
               x = 0; y = y0;
               w = xNewBeav;
               h = yGrid; 
               break;
            case 2:
               x = xNewBeav + beaverW; 
               y = y0;
               w = paperW - x;
               h = yGrid; 
               break;
            case 3:
               x = 0; 
               y = y0 + yGrid;
               w = xGrid;
               h = (level == "easy") ? paperH - y + y0 : yGreen - y + y0; 
               break;
            case 4:
               x = xGrid + nbCol*cellSize; 
               y = y0 + yGrid;
               w = xGrid;
               h = yBlue - y + y0; 
               break;
            case 5:
               x = 0; 
               y = y0 + yGreen;
               w = xGreen;
               h = cellSize; 
               break;
            case 6:
               x = xGreen + cellSize; 
               y = y0 + yGreen;
               w = cellSize;
               h = cellSize; 
               break;
            case 7:
               x = xGrid + nbCol*cellSize; 
               y = y0 + yBlue;
               w = cellSize;
               h = cellSize; 
               break;
            case 8:
               x = xBlue + cellSize; 
               y = y0 + yBlue;
               w = paperW - x;
               h = cellSize; 
               break;
            case 9:
               x = 0; 
               y = y0 + yGreen + cellSize;
               w = xGrid;
               h = paperH - y + y0; 
               break;
            case 10:
               x = xGrid + nbCol*cellSize; 
               y = y0 + yGreen + cellSize;
               w = paperW - x;
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
      paper.rect(xGrid,yGrid,nbCol*cellSize,nbRows*cellSize).attr(gridRectAttr);
      var lastMove = getLastMove();
      grid = new Grid.fromArray("paper", paper, lastMove.grid, cellFiller, cellSize, cellSize, xGrid, yGrid, gridLineAttr);
   };

   function initSideSquares() {
      blueSquare = paper.rect(xBlue,yBlue,cellSize,cellSize).attr(blueSquareAttr);
      var xShadow = xBlue + (cellSize - beaverW)/2;
      var yShadow = yBlue + (cellSize - beaverH)/2;
      paper.image(beaverSrc,xShadow,yShadow,beaverW,beaverH).attr({opacity: 0.2});

      if(level != "easy"){
         greenSquare = paper.rect(xGreen,yGreen,cellSize,cellSize).attr(greenSquareAttr);
         var xShadow = xGreen + (cellSize - beaverW)/2;
         var yShadow = yGreen + (cellSize - beaverH)/2;
         paper.image(beaverSrc,xShadow,yShadow,beaverW,beaverH).attr({opacity: 0.2});
      }
   };

   function initDrag(id,type,row,col) {
      var raph = beavers[id];
      Beav.dragWithTouch(raph,onMove,onStart(id,type,row,col),onEnd);
      raph.attr("cursor","grab");
   };

   function proceed() {
      if(answer.progress >= events.length){
         platform.validate("done");
         return
      }
      var nextStep = events[answer.progress];
      var infoText = [ taskStrings.place, taskStrings.longest, taskStrings.shortest ];
      if(infoBox[nextStep]){
         infoBox[nextStep].show();
      }else{
         infoBox[nextStep] = drawInfoBox(xInfoBox[nextStep],yInfoBox[nextStep],wInfoBox[nextStep],hInfoBox[nextStep],infoText[nextStep],nextStep);
      }

      if(nextStep == 0){
         var beav = paper.image(beaverSrc,xNewBeav,yNewBeav,beaverW,beaverH);
         beavers.push(beav);
         var beavID = beavers.length - 1;
         initDrag(beavID,0);
      }else{
         var lastMove = getLastMove();
         for(var iRow = 0; iRow < nbRows; iRow++){
            for(var iCol = 0; iCol < nbCol; iCol++){
               var beavID = lastMove.grid[iRow][iCol];
               if(beavID != null){
                  initDrag(beavID,nextStep,iRow,iCol);
               }
            }
         }
      }
   };

   function onStart(id,type,row,col) {
      return function(x,y,ev) {
         displayError("");
         if(type == 0){
            var startX = xNewBeav;
            var startY = yNewBeav;
         }else{
            var startX = xGrid + col*cellSize + (cellSize - beaverW)/2;
            var startY = yGrid + row*cellSize + (cellSize - beaverH)/2;
         }
         dragData = { id: id, type: type, startPos: { x: startX, y: startY } };
         if(type == 0){
            infoBox[0].hide();
         }else{
            dragData.row = row;
            dragData.col = col;
         }
         beavers[id].toFront();
      }
   };

   function onMove(dx,dy,x,y,ev) {
      var id = dragData.id;
      var type = dragData.type;
      var newX = dragData.startPos.x + dx;
      var newY = dragData.startPos.y + dy;
      if(newX < 0){
         newX = 0;
      }else if(newX > paperW - beaverW){
         newX = paperW - beaverW;
      }
      if(newY < 0){
         newY = 0;
      }else if(newY > paperH - beaverH){
         newY = paperH - beaverH;
      }
      beavers[id].attr({ x: newX, y: newY });
      var cx = newX + beaverW/2;
      var cy = newY + beaverH/2;
      if(type == 0){
         if(newX + beaverW > xGrid && newX < xGrid + gridW &&
            newY + beaverH > yGrid && newY < yGrid + gridH){
            var minD = Infinity;
            var closest = null;
            for(var iRow = 0; iRow < nbRows; iRow++){
               for(var iCol = 0; iCol < nbCol; iCol++){
                  var cellPos = grid.getCellPos(iRow,iCol);
                  var d = Beav.Geometry.distance(cx,cy, cellPos.x + cellSize/2, cellPos.y + cellSize/2);
                  if(d < minD){
                     minD = d;
                     closest = { row: iRow, col: iCol };
                  }
                  if(grid.isCellHighlighted(iRow,iCol)){
                     grid.unhighlightCell(iRow,iCol);
                  }
               }
            }
            grid.highlightCell(closest.row,closest.col,highlightAttr);
            beavers[id].toFront();
            dragData.closest = closest;
         }else{
            unhighlightAllCells();
            dragData.closest = null;
         }
      }else{
         var xCell = (type == 1) ? xBlue : xGreen;
         var yCell = (type == 1) ? yBlue : yGreen;
         var square = (type == 1) ? blueSquare : greenSquare;
         var attr = (type == 1) ? blueSquareAttr : greenSquareAttr;
         if(newX + beaverW > xCell && newX < xCell + cellSize &&
            newY + beaverH > yCell && newY < yCell + cellSize){
            square.attr(squareHighlightAttr);
            dragData.closest = true;
         }else{
            square.attr(blueSquareAttr);
            dragData.closest = false;
         }
      }
   };

   function onEnd(ev) {
      var id = dragData.id;
      var type = dragData.type;
      var lastMove = getLastMove();
      if(!dragData.closest){
         var newX = dragData.startPos.x;
         var newY = dragData.startPos.y;
         if(type == 0 && infoBox[0]){
            infoBox[0].show();
         }
      }else{
         if(type == 0){
            var row = dragData.closest.row;
            var col = dragData.closest.col;
            if(lastMove.grid[row][col] != null){
               displayError(taskStrings.occupied);
               var newX = xNewBeav;
               var newY = yNewBeav;
               if(infoBox[0]){
                  infoBox[0].show();
               }
            }else{
               var cellPos = grid.getCellPos(row,col);
               var newX = cellPos.x + (cellSize - beaverW)/2;
               var newY = cellPos.y + (cellSize - beaverH)/2;

               var newMove = JSON.parse(JSON.stringify(lastMove));
               newMove.grid[row][col] = id;
               newMove.blue = null;
               newMove.green = null;
               answer.history.push(newMove);

               beavers[id].undrag();
               beavers[id].untouchstart();
               beavers[id].untouchend();
               beavers[id].untouchcancel();
               beavers[id].untouchmove();
               beavers[id].attr("cursor","auto");
               answer.progress++;
               proceed();
            }
            unhighlightAllCells();
         }else{
            undragAll();
            var square = (type == 1) ? blueSquare : greenSquare;
            var attr = (type == 1) ? blueSquareAttr : greenSquareAttr;
            square.attr(attr);
            if(infoBox[type]){
               infoBox[type].hide()
            }
            var newX = square.attr("x") + (cellSize - beaverW)/2;
            var newY = square.attr("y") + (cellSize - beaverH)/2;
            var wanted = (type == 1) ? getFirst() : getLast();
            if(wanted != id){
               var error = (type == 1) ? taskStrings.notFirst : taskStrings.notLast;
               displayError(error);
            }else{
               var newMove = JSON.parse(JSON.stringify(lastMove));
               newMove.grid[dragData.row][dragData.col] = null;
               if(type == 1){
                  newMove.blue = id;
                  newMove.green = null;
               }else{
                  newMove.green = id;
                  newMove.blue = null;
               }
               answer.history.push(newMove);

               answer.progress++;
               var anim = new Raphael.animation({opacity:0},animTime,function(){
                  beavers[id].remove();
                  proceed();
               });
               subTask.raphaelFactory.animate("anim",beavers[id],anim);
            }
         }
      }
      beavers[id].attr({ x: newX, y: newY });
   };

   function getFirst(move) {
      var minID = Infinity;
      var first = null;
      if(!move){
         move = getLastMove();
      }
      for(var iRow = 0; iRow < nbRows; iRow++){
         for(var iCol = 0; iCol < nbCol; iCol++){
            var id = move.grid[iRow][iCol];
            if(id != null && id < minID){
               minID = id;
               first = id;
            }
         }
      }
      return first
   };

   function getLast(move) {
      var maxID = -Infinity;
      var last = null;
      if(!move){
         move = getLastMove();
      }
      for(var iRow = 0; iRow < nbRows; iRow++){
         for(var iCol = 0; iCol < nbCol; iCol++){
            var id = move.grid[iRow][iCol];
            if(id != null && id > maxID){
               maxID = id;
               last = id;
            }
         }
      }
      return last
   };

   function getLastMove() {
      return answer.history[answer.history.length - 1]
   };

   function cellFiller(data,paper) {
      var entry = data.entry;
      var x = data.xPos;
      var y = data.yPos;
      if(entry == null){
         return []
      }else{
         var xBeaver = x + (cellSize - beaverW)/2;
         var yBeaver = y + (cellSize - beaverH)/2;
         beavers[entry] = paper.image(beaverSrc,xBeaver,yBeaver,beaverW,beaverH);
         return [beavers[entry]]
      }
   };

   function unhighlightAllCells() {
      for(var iRow = 0; iRow < nbRows; iRow++){
         for(var iCol = 0; iCol < nbCol; iCol++){
            if(grid.isCellHighlighted(iRow,iCol)){
               grid.unhighlightCell(iRow,iCol);
            }
         }
      }
   };

   function undragAll() {
      for(var iBeav = 0; iBeav < beavers.length; iBeav++){
         var raph = beavers[iBeav];
         if(raph){
            raph.undrag();
            raph.untouchstart();
            raph.untouchend();
            raph.untouchcancel();
            raph.untouchmove();
            raph.attr("cursor","auto");
         }
      }
   };

   function drawInfoBox(x,y,w,h,text,arrowSide) {
      var attr = infoBoxAttr;
      var rect = paper.rect(x,y,w,h).attr(attr.rect);
      var xText = x + w/2;
      var yText = y + h/2;
      var textRaph = paper.text(xText,yText,text, attr.text['font-size']).attr(attr.text);
      if(arrowSide == 0){
         var xTr = x - 4;
         var yTr = y + h/2;
         var angle = -90;
      }else{
         var xTr = x + w/2;
         var yTr = y + h + 4;
         var angle = 180;
      }
      var triangle = getShape(paper,"triangle",xTr,yTr,5).transform("r"+angle).attr(attr.arrow);
      return paper.set(rect,textRaph,triangle)
   };

   function displayError(msg) {
      $("#displayHelper_graderMessage").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
