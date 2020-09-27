function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         gridArray: [
            [0,1,2,0,1,2,1,2,1,2,1,2],
            [2,0,0,1,2,0,1,0,2,1,0,0]
         ],
         paperHeight: 275,
         nbPatterns: 4,
         cellSize: 55
      },
      medium: {
         gridArray: [
            [1,2,2,1,2,2],
            [2,1,0,2,1,0],
            [1,0,2,2,0,2],
            [0,2,2,1,0,2],
            [2,1,1,0,2,1],
            [0,2,0,2,2,0]
         ],
         paperHeight: 455,
         nbPatterns: 5,
         cellSize: 45
      },
      hard: {
         gridArray: [
            [0,1,0,2,1],
            [1,2,0,1,0],
            [1,2,0,1,2],
            [2,1,2,1,1],
            [0,0,1,2,0]
         ],
         paperHeight: 430,
         nbPatterns: 5,
         cellSize: 48
      }
   };

   var paper;
   var paperWidth = 770;
   var paperHeight;
   var cellSize;
   var imageSize;
   var margin = 10;
   var nbPatterns;
   var textHeight = 20;
   var labelHeight = 16;
   var trashSize = 1.2*cellSize;
   var x0 = margin;
   var y0 = margin;

   var gridArray;
   var grid;
   var nbRows;
   var nbCol;
   var patterns = [];
   var draggedID = null;
   var dragLimits;
   var srcPos = [];
   var highlight;
   var button;
   var tx;
   var ty;

   var images = [$("#wifi").attr("src"),$("#bluetooth").attr("src"),$("#usb").attr("src"),$("#trash").attr("src")];

   var lineAttr = {
      "stroke": "black",
      "stroke-width": 1
   };
   var patternAttr = {
      stroke: "blue",
      "stroke-width": 5,
      fill: "grey",
      "fill-opacity": 0.3,
      cursor: "grab"
   };
   var highlightAttr = {
      stroke: "black",
      "stroke-width": 3
   };
   var errorHighlightAttr = {
      stroke: "red",
      "stroke-width": 5
   };
   var arrowAttr = {
      "stroke": "black",
      "stroke-width": 3,
      "arrow-end": "classic-wide-midium"
   };
   var trashAttr = {
      "width": trashSize,
      "height": trashSize,
      "stroke": "black",
      "fill": "lightgrey",
      r: 5
   };
   var labelAttr = {
      "font-size": labelHeight,
      "font-weight": "bold"
   };
   var anchorStartAttr = {
      "text-anchor": "start"
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      cellSize = data[level].cellSize;
      imageSize = cellSize * 0.8;
      gridArray = data[level].gridArray;
      nbPatterns = data[level].nbPatterns;
      nbRows = gridArray.length;
      nbCols = gridArray[0].length;
      paperHeight = data[level].paperHeight;
      initSrcPos();
      dragLimits = {
         xMin: margin - cellSize,
         yMin: margin - cellSize,
         xMax: paperWidth - cellSize,
         yMax: paperHeight - cellSize
      };
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function () {
      $(".nbPatterns").text(nbPatterns);
      initPaper();
      initGrid();
      initPattern();
      reloadAnswerDisplay();
      displayHelper.customValidate = checkResult;
      displayError("");
      removeCellHighlight();
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
      var defaultAnswer = {patternsPos:[],selectedSpots:[],rotation:0};
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result;
   };

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initSrcPos() {
      for(var iSrc = 0; iSrc < nbPatterns; iSrc++){
         var y = y0 + margin;
         var x = Math.round(x0 + iSrc*(3.2*cellSize) + cellSize);
         srcPos[iSrc] = {x:x,y:y};
      }
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);
   };

   function initGrid() {
      var y = srcPos[0].y + 2.5*cellSize;
      if (level != "easy") {
         y += cellSize;
      }
      var x = (paperWidth - (nbCols * cellSize)) / 2;
      grid = Grid.fromArray("paper", paper, gridArray, cellFiller, cellSize, cellSize, x, y, lineAttr);
   };

   function cellFiller(data,paper) {
      var x = data.xPos + (cellSize - imageSize) / 2;
      var y = data.yPos + (cellSize - imageSize) / 2;
      var img = paper.image(images[data.entry],x,y,imageSize,imageSize).toBack();
      return [img];
   };

   function initPattern() {
      for(var iPattern = 0; iPattern < nbPatterns; iPattern++){
         var x = srcPos[iPattern].x;
         var y = srcPos[iPattern].y;
         var newPattern = drawPattern(x,y);
         newPattern.attr(patternAttr).toBack();
         patterns[iPattern] = newPattern;
         Beav.dragWithTouch(newPattern, onMove, onStart, onEnd);
         if(!answer.patternsPos[iPattern]){
            answer.patternsPos[iPattern] = {x:x,y:y,rotation:answer.rotation};
         }
         if(level == "hard"){
            initButton();
         }
      }
   };

   function initButton() {
      var buttonX = srcPos[0].x;
      var buttonY = srcPos[2].y + cellSize*4;
      button = new Button(paper, buttonX, buttonY, cellSize, cellSize, "");
      var arrowMargin = 8;
      var arrowR = cellSize/2 - arrowMargin;
      var arrow = paper.path("M"+(buttonX + cellSize/2 + 1)+" "+(buttonY + arrowMargin)+",A"+arrowR+" "+arrowR+" 0 1 1 "+(buttonX + cellSize/2)+" "+(buttonY + arrowMargin));
      arrow.attr(arrowAttr);
      button.addElement("arrow",arrow);
      button.unclick()
      button.click(rotatePattern);
      paper.text(buttonX,buttonY + cellSize + textHeight,taskStrings.rotationText).attr(labelAttr).attr(anchorStartAttr);
   };

   function drawPattern(x0,y0) {
      if(level == "easy"){
         var x1 = x0 + 2 * cellSize;
         var y2 = y0 + 2 * cellSize;
         var x3 = x1 - cellSize;
         var y4 = y2 - cellSize;
         var path = "M"+x0+" "+y0+",H"+x1+",V"+y2+",H"+x3+",V"+y4+",H"+x0+",Z";
      }else if(level == "medium") {
         var x1 = x0 + cellSize;
         var y2 = y0 + 2 * cellSize;
         var x3 = x1 + cellSize;
         var y4 = y2 + cellSize;
         var path = "M"+x0+" "+y0+",H"+x1+",V"+y2+",H"+x3+",V"+y4+",H"+x0+",Z";
      }else if(level == "hard"){
         var x1 = x0 + cellSize;
         var y2 = y0 + 3 * cellSize;
         var y3 = y2 - cellSize;
         var x4 = x0 - cellSize;
         var y5 = y3 - cellSize;
         var path = "M"+x0+" "+y0+",H"+x1+",V"+y2+",H"+x0+",V"+y3+",H"+x4+",V"+y5+",H"+x0+",Z";
      }
      return paper.path(path);
   };

   function rotatePattern() {
      answer.rotation = (answer.rotation + 90)%360;
      for(var iPattern = 0; iPattern < nbPatterns; iPattern++){
         if(!answer.selectedSpots[iPattern] || answer.selectedSpots[iPattern].length == 0){
            patterns[iPattern].transform("");
            patterns[iPattern].transform("r"+answer.rotation+" "+(srcPos[iPattern].x + cellSize/2)+" "+(srcPos[iPattern].y + cellSize*1.5));
            answer.patternsPos[iPattern].rotation = answer.rotation;
         }
      }
   };

   function onStart(x,y,event){
      var xMouse = x - $("#paper").offset().left;
      var yMouse = y - $("#paper").offset().top;
      draggedID = getDraggedID(xMouse,yMouse);
      if(draggedID == null){
         return
      }
      displayError("");
      removeCellHighlight();
      resetHighlight();
      patterns[draggedID].toFront();

      if(answer.selectedSpots[draggedID]){
         answer.selectedSpots[draggedID] = null;
      }
      
   };
   
   function onMove(dx,dy,x,y,event) {
      if(draggedID != null){
         var xi = answer.patternsPos[draggedID].x;
         var yi = answer.patternsPos[draggedID].y;
         var xf = xi + dx;
         var yf = yi + dy;
         if(xf < dragLimits.xMin){
            xf = dragLimits.xMin;
         }
         if(yf < dragLimits.yMin){
            yf = dragLimits.yMin;
         }
         if(xf > dragLimits.xMax){
            xf = dragLimits.xMax;
         }
         if(yf > dragLimits.yMax){
            yf = dragLimits.yMax;
         }
         patterns[draggedID].transform("");
         var rot = answer.patternsPos[draggedID].rotation;
         tx = (xf - srcPos[draggedID].x);
         ty = (yf - srcPos[draggedID].y);
         patterns[draggedID].transform("t"+tx+" "+ty+"r"+rot+" "+(srcPos[draggedID].x + cellSize/2)+" "+(srcPos[draggedID].y + cellSize*1.5));
 
         highlightCells(xf,yf,draggedID);
         patterns[draggedID].toFront();
      }
   };

   function onEnd(event) {
      if(draggedID != null){
         var x = srcPos[draggedID].x + tx;
         var y = srcPos[draggedID].y + ty;
         var rot = answer.patternsPos[draggedID].rotation;
         var patternSpot = isOverPatternSpot(x,y,draggedID);
         if(patternSpot && !isSpotOccupied(patternSpot.row,patternSpot.col,true)){
            var dx = patternSpot.x - x;
            var dy = patternSpot.y - y;
            var transX = tx + dx;
            var transY = ty + dy;
            patterns[draggedID].transform("");
            patterns[draggedID].transform("t"+transX+","+transY+",r"+rot+" "+(srcPos[draggedID].x + cellSize/2)+" "+(srcPos[draggedID].y + cellSize*1.5));
            x += dx;
            y += dy;
            if(highlight){
               highlight.remove();
            }
            selectSpot(draggedID,patternSpot.row,patternSpot.col);
         }else{
            patterns[draggedID].transform("");
            x = srcPos[draggedID].x;
            y = srcPos[draggedID].y;
            answer.patternsPos[draggedID].rotation = answer.rotation;
            rot = answer.patternsPos[draggedID].rotation;
            if(rot > 0){
               patterns[draggedID].transform("r"+rot+" "+(srcPos[draggedID].x + cellSize/2)+" "+(srcPos[draggedID].y + cellSize*1.5));
            }
         }

         answer.patternsPos[draggedID] = {x:Math.round(x),y:Math.round(y),rotation:rot};
         draggedID = null;
      }
   };

   function getDraggedID(x,y) {
      if(level != "hard"){
         var wp = 2*cellSize;
         var hp = (level == "easy") ? 2*cellSize : 3*cellSize;
         for(var iPattern = 0; iPattern < nbPatterns; iPattern++){
            var xp = answer.patternsPos[iPattern].x;
            var yp = answer.patternsPos[iPattern].y;
            if(x > xp && y > yp && x < xp + wp && y < yp + hp){
               if(level == "easy"){
                  return iPattern
               }else if(x < xp + wp/2 || y > yp + 2*cellSize){
                  return iPattern
               }
            }
         }
      }else{
         for(var iPattern = 0; iPattern < nbPatterns; iPattern++){
            var pos = answer.patternsPos[iPattern];
            var xp = pos.x;
            var yp = pos.y;
            var rot = pos.rotation;
            var xMin = xp - cellSize;
            var xMax = xp + 2*cellSize;
            var yMin = yp;
            var yMax = yp + 3*cellSize;
            if(x > xMin && y > yMin && x < xMax && y < yMax){
               if((x > xp || y > yp + cellSize) && 
                  (x < xp + cellSize || y > yp + cellSize) &&
                  (x > xp || y < yp + 2*cellSize) &&
                  (x < xp + cellSize || y < yp + 2*cellSize)){
                  switch(rot){
                     default:
                     case 0:
                        var condition = (x < xp + cellSize);
                        break;
                     case 90:
                        var condition = (y < yp + 2*cellSize);
                        break;
                     case 180:
                        var condition = (x > xp);
                        break;
                     case 270:
                        var condition = (y > yp + cellSize);
                        break;
                  }
                  if(condition){
                     return iPattern
                  }
               }

            }
         }
      }
      return null
   };

   function highlightCells(x,y,id) {
      if(highlight){
         highlight.remove();
      }
      var patternSpot = isOverPatternSpot(x,y,id);
      if(patternSpot && !isSpotOccupied(patternSpot.row,patternSpot.col,false) && !Beav.Navigator.isIE8()){
         drawHighlight(patternSpot.x,patternSpot.y,id);
      }
   };

   function drawHighlight(x,y,id) {
      highlight = drawPattern(x,y).attr(highlightAttr).toFront();
      highlight.transform("r"+answer.patternsPos[id].rotation+" "+(x+cellSize/2)+" "+(y+cellSize*1.5));
   };

   function isOverPatternSpot(x,y,id) {
      var dMin = Infinity;
      var spot;
      if(level == "easy"){
         var minRow = 0;
         var maxRow = 0;
         var minCol = 0;
         var maxCol = nbCols - 2;
      }else if(level == "medium"){
         var minRow = 0;
         var maxRow = 3;
         var minCol = 0;
         var maxCol = nbCols - 2;
      }else{
         switch(answer.patternsPos[id].rotation){
            case 0:
               var minRow = 0;
               var maxRow = 2;
               var minCol = 1;
               var maxCol = nbCols - 1;
               break;
            case 90:
               var minRow = 0;
               var maxRow = 3;
               var minCol = 1;
               var maxCol = 3;
               break;
            case 180:
               var minRow = 0;
               var maxRow = 2;
               var minCol = 0;
               var maxCol = nbCols - 2;
               break;
            case 270:
               var minRow = -1;
               var maxRow = 2;
               var minCol = 1;
               var maxCol = nbCols - 2;
               break;
         }
      }
      for(var iRow = minRow; iRow <= maxRow; iRow++){
         for(var iCol = minCol; iCol <= maxCol; iCol++){
            if(iRow >= 0){
               var cellPos = grid.getCellPos(iRow,iCol);
               var yc = cellPos.y;
            }else{
               var cellPos = grid.getCellPos(0,iCol);
               var yc = cellPos.y - cellSize;
            }
            var xc = cellPos.x;

            var d = getDistance(x,y,xc,yc);
            if(d < dMin){
               spot = {x:xc,y:yc,row:iRow,col:iCol};
               dMin = d;
            }
         }
      }
      if(dMin < cellSize){
         return spot;
      }
      return null;
   };

   function isSpotOccupied(row,col,reportOverlap) {
      var cellsToCheck = getSpot(row,col,null);
      if (reportOverlap) {
        for(var iCell = 0; iCell < cellsToCheck.length; iCell++){
           if(isCellSelected(cellsToCheck[iCell][0],cellsToCheck[iCell][1])){
              displayError(taskStrings.spotOccupied);
              return true;
           }
        }
      }
      displayError("");
      removeCellHighlight();
      return false;
   };

   function isCellSelected(row,col) {
      for(var iSpot = 0; iSpot < answer.selectedSpots.length; iSpot++){
         var spot = answer.selectedSpots[iSpot];
         if(spot){
            for(var iCell = 0; iCell < spot.length; iCell++){
               cell = spot[iCell];
               if(cell[0] == row && cell[1] == col){
                  return true;
               }
            }
         }
      }
   };

   function selectSpot(id,row,col) {
      var spot = getSpot(row,col,id);
      answer.selectedSpots[id] = spot;
   };

   function getSpot(row,col,id) {
      if(level == "easy"){
         var spot = [
            [row,col],
            [row,col + 1],
            [row + 1,col + 1]
         ];
      }else if(level == "medium"){
         var spot = [
            [row,col],
            [row + 1,col],
            [row + 2,col],
            [row + 2,col + 1]
         ];
      }else{
         var rot = (id != null) ? answer.patternsPos[id].rotation : answer.rotation;
         switch(rot){
            case 0:
               var spot = [
                  [row,col],
                  [row + 1, col],
                  [row + 1, col - 1],
                  [row + 2,col]
               ];
               break;
            case 90:
               var spot = [
                  [row + 1,col + 1],
                  [row + 1, col],
                  [row, col],
                  [row + 1, col - 1]
               ];
               break;
            case 180:
               var spot = [
                  [row + 2,col],
                  [row + 1, col],
                  [row + 1, col + 1],
                  [row, col]
               ];
               break;
            case 270:
               var spot = [
                  [row + 1, col - 1],
                  [row + 1, col],
                  [row + 2, col],
                  [row + 1, col + 1]
               ];
               break;
         }
      }
      return spot
   };

   function removeCellHighlight() {
      for(var iRow = 0; iRow < nbRows; iRow++){
         for(var iCol = 0; iCol < nbCols; iCol++){
            if(grid.isCellHighlighted(iRow,iCol)){
               grid.unhighlightCell(iRow,iCol);
            }
         }
      }
   };

   function getDistance(x1,y1,x2,y2) {
      return Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
   };

   function reloadAnswerDisplay() {
      for(var iPattern = 0; iPattern < nbPatterns; iPattern++){
         var pos = answer.patternsPos[iPattern];
         if(pos){
            var dx = pos.x - srcPos[iPattern].x;
            var dy = pos.y - srcPos[iPattern].y;
            var rot = pos.rotation;
            patterns[iPattern].transform("t"+dx+","+dy).toFront();
            patterns[iPattern].transform("...r"+rot+" "+(srcPos[iPattern].x + cellSize/2)+" "+(srcPos[iPattern].y + cellSize*1.5));
         }
         if(iPattern == nbPatterns){
            patterns[iPattern].transform("...r"+answer.rotation+" "+(srcPos[iPattern].x + cellSize/2)+" "+(srcPos[iPattern].y + cellSize*1.5));
         }
      }
   };

   function checkResult(noVisual) {
      if(answer.selectedSpots.length < nbPatterns){
         if(!noVisual)
            displayError(taskStrings.missingPattern(nbPatterns));
         return { successRate: 0, message: taskStrings.missingPattern(nbPatterns) };
      }
      var pattern = [];
      var nEmptySpot = 0;
      var referencePos = [];
      for(var iSpot = 0; iSpot < answer.selectedSpots.length; iSpot++){
         var spot = answer.selectedSpots[iSpot];
         if(spot){
            for(var iCell = 0; iCell < spot.length; iCell++){
               if(iSpot == 0){
                  pattern[iCell] = gridArray[spot[iCell][0]][spot[iCell][1]];
                  referencePos[iCell] = spot[iCell];
               }else if(pattern[iCell] != gridArray[spot[iCell][0]][spot[iCell][1]]){
                  if(!noVisual){
                     grid.highlightCell(spot[iCell][0],spot[iCell][1],errorHighlightAttr);
                     grid.highlightCell(referencePos[iCell][0],referencePos[iCell][1],errorHighlightAttr);
                     displayError(taskStrings.errorMismatch);
                  }
                  return { successRate: 0, message: taskStrings.errorMismatch }
               }
            }
         }else{
            nEmptySpot++;
            if(nEmptySpot > 0){
               if(!noVisual)
                  displayError(taskStrings.missingPattern(nbPatterns));
               return { successRate: 0, message: taskStrings.missingPattern(nbPatterns) };
            }
         }
      }
      if(!noVisual){
         platform.validate("done");
      }else{
         return { successRate: 1, message: taskStrings.success };
      }
   };

   function displayError(msg) {
      $("#error").text(msg);
   };

   function resetHighlight() {
      for(var iPattern = 0; iPattern < patterns.length; iPattern++){
         patterns[iPattern].attr(patternAttr);
      }
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
