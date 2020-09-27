function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         gridArray: [
            ["P","\\","-","$","/"],
            ["#","&","%","X","!"],
            ["+","~","Z","8","."]
         ],
         gotoArray: [
            [{row:2,col:"C"},{row:3,col:"C"},{row:3,col:"E"},{row:2,col:"A"},{row:3,col:"A"}],
            [{row:2,col:"D"},{row:3,col:"A"},{row:3,col:"B"},{row:3,col:"C"},{row:1,col:"B"}],
            [{row:1,col:"E"},{row:1,col:"C"},{row:1,col:"D"},{row:2,col:"B"},null]
         ],
         dropAreaNbCol: 5,
         dropAreaNbRows: 1,
         paperHeight: 480,
         paperWidth: 350,
         cellWidth: 60,
         cellHeight: 90,
         solutionLength: 5,
         nbSolutions: 1
      },
      medium: {
         gridArray: [
            ["+","/","\\","8","!","Z"],
            ["#","!","&","X","-","/"],
            ["~","%","+","$","P","."]

         ],
         gotoArray: [
            [{row:3,col:"E"},{row:3,col:"B"},{row:3,col:"A"},{row:2,col:"C"},{row:3,col:"F"},{row:2,col:"F"}],
            [{row:1,col:"D"},{row:1,col:"E"},{row:3,col:"B"},{row:2,col:"B"},{row:1,col:"F"},{row:3,col:"D"}],
            [{row:2,col:"A"},{row:2,col:"E"},{row:2,col:"D"},{row:3,col:"B"},{row:1,col:"B"},null]
         ],
         dropAreaNbCol: 5,
         dropAreaNbRows: 1,
         paperHeight: 480,
         paperWidth: 400,
         cellWidth: 60,
         cellHeight: 90,
         solutionLength: 5,
         nbSolutions: 1
      },
      hard: {
         gridArray: [
            [";","P","8"],
            ["<","~","-"],
            [">","\\","#"],
            ["^","&","X"],
            ["?","+","$"],
            ["!","/","."]
         ],
         gotoArray: [
            [{row:3,col:"B"},{row:2,col:"B"},{row:2,col:"C"}],
            [{row:6,col:"C"},{row:4,col:"B"},{row:5,col:"A"}],
            [{row:4,col:"C"},{row:2,col:"A"},{row:5,col:"B"}],
            [{row:5,col:"C"},{row:3,col:"C"},{row:2,col:"A"}],
            [{row:6,col:"C"},{row:1,col:"B"},{row:3,col:"B"}],
            [{row:1,col:"C"},{row:3,col:"A"},null]
         ],
         dropAreaNbCol: 10,
         dropAreaNbRows: 6,
         paperHeight: 450,
         paperWidth: 730,
         cellWidth: 50,
         cellHeight: 65,
         solutionLength: 5,
         nbSolutions: 3
      }
   };

   var paper;
   var paperWidth;
   var paperHeight;
   var margin = 10;
   var cellWidth;
   var cellHeight;
   var labelSize = 20;
   var frameW;
   var frameH;
   var frameX = margin;
   var frameY = margin;
   var nbRows;
   var nbCol;
   var wordLength;
   var solutionLength;
   var nbSolutions;

   var dropAreaNbRows;
   var dropAreaNbCols;
   var dropLabel;

   var gridArray;
   var gotoArray;
   var grid;
   var dropArea;
   var draggedCard;
   var draggedData;
   var dropSpot;
   var errorArrow;
   var xCoordLabel = [];
   var yCoordLabel = [];

   var letters = ["A","B","C","D","E","F","G","H"];

   var cardColor = "#ffffb3";
   var validColor = "#c7ffa9";
   var invalidColor = "#ffa9a9";
   var hoverColor = "#ffa850";
   var successColor = "#aaff76";

   var frameAttr = {
      fill: "black"
   };
   var labelAttr = {
      "font-size": labelSize,
      fill: "white"
   };
   var cardAttr = {
      r: 7,
      stroke: "none",
      fill: cardColor
   };
   var gotoRectAttr = {
      r: 7,
      stroke: "none",
      fill: "#d4d4d4"
   };
   var cardLetterAttr = {
      fill: "blue",
      "font-weight": "bold"
   };
   var gotoLetterAttr = {
      fill: "black"
   };
   var textAttr = {
      "font-size": 16,
      "text-anchor": "start"
   };
   var arrowAttr = {
      stroke: "red",
      "stroke-width": 3,
      "stroke-linejoin": "round"
   };
   var errorCircleAttr = {
      stroke: "none",
      fill: "red",
      opacity: 0
   };
   var dropLabelAttr = {
      "font-size": 16
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      paperHeight = data[level].paperHeight;
      paperWidth = data[level].paperWidth;
      gridArray = data[level].gridArray;
      gotoArray = data[level].gotoArray;
      dropAreaNbCol = data[level].dropAreaNbCol;
      dropAreaNbRows = data[level].dropAreaNbRows;
      solutionLength = data[level].solutionLength;
      nbSolutions = data[level].nbSolutions;
      cellWidth = data[level].cellWidth;
      cellHeight = data[level].cellHeight;
      nbCol = gridArray[0].length;
      nbRows = gridArray.length;
      frameW = labelSize + margin/2 + cellWidth * nbCol;
      frameH = labelSize + margin/2 + cellHeight * nbRows;
      dragLimits = {
         xMin: 0,
         xMax: paperWidth - cellWidth,
         yMin: 0,
         yMax: paperHeight - cellHeight
      };
      cardAttr.width = cellWidth - 2;
      cardAttr.height = cellHeight - 2;
      cardLetterAttr["font-size"] = 2 * cellHeight/3 - 5;
      gotoLetterAttr["font-size"] = cellWidth/2 - 2;
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function () {
      initPaper();
      initGrid();
      initDropArea();
      displayHelper.customValidate = checkResult;
      displayError("");
      if(errorArrow){
         errorArrow.remove();
         removeErrorHighlight();
      }
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
      var defaultAnswer = [];
      for(var iRow = 0; iRow < data[level].dropAreaNbRows; iRow++){
         defaultAnswer[iRow] = [];
      }
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

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);
      $("#paper").css({
         width: paperWidth+"px"
      })
   };

   function initGrid() {
      initFrame();
      var gridX = frameX + labelSize + margin/2;
      var gridY = frameY + labelSize + margin/2;
      grid = new Grid("paper",paper,nbRows,nbCol,cellWidth,cellHeight,gridX,gridY);
      for(var iRow = 0; iRow < nbRows; iRow++){
         for(var iCol = 0; iCol < nbCol; iCol++){
            grid.addToCell(cellFiller,{row:iRow,col:iCol,sourceRow:iRow,sourceCol:iCol});
         }
      }
   };

   function initDropArea() {
      if(level == "hard"){
         var x = grid.getRightX() + cellWidth/2 + margin;
         var y = grid.getTopY();
      }else{
         var x = frameX;
         var y = grid.getBottomY() + cellHeight/2;
      }
      var w = dropAreaNbCol * cellWidth;
      var h = cellHeight * dropAreaNbRows;
      if((level == "easy") || (level == "medium")){
         paper.rect(x - 1,y - 1,w + 2,h + 2).attr("fill","black");
      }else{
         paper.rect(x,y,w,h).attr("stroke","black");
      }
      dropArea = new Grid("paper",paper,dropAreaNbRows,dropAreaNbCol,cellWidth,cellHeight,x,y,{stroke:"none"});
      for(var iRow = 0; iRow < dropAreaNbRows; iRow++){
         for(var iCol = 0; iCol < dropAreaNbCol; iCol++){
            dropArea.addToCell(cellFiller,{row:iRow,col:iCol,dropArea:true});
         }
      }
      if(level == "hard"){
         dropLabel = paper.text(x + w/2, y + h/2,taskStrings.dropLabel).attr(dropLabelAttr);
      }
   };

   function initFrame() {
      paper.rect(frameX,frameY,frameW,frameH).attr(frameAttr);
      var y0 = frameY + (labelSize + margin/2)/2;
      var x0 = frameX + (labelSize + margin/2)/2;
      for(var iCol = 0; iCol < nbCol; iCol++){
         var x = frameX + labelSize + margin/2 + (iCol + 1/2) * cellWidth;
         var y = y0;
         var circle = paper.circle(x,y,labelSize/2 + 2).attr(errorCircleAttr);
         var letter = paper.text(x,y,letters[iCol]).attr(labelAttr);
         xCoordLabel[iCol] = paper.set(circle,letter);
      }
      for(var iRow = 0; iRow < nbRows; iRow++){
         var x = x0;
         var y = frameY + labelSize + margin/2 + (iRow + 1/2) * cellHeight;
         var circle = paper.circle(x,y,labelSize/2 + 2).attr(errorCircleAttr);
         var digit = paper.text(x,y,iRow + 1).attr(labelAttr);
         yCoordLabel[iRow] = paper.set(circle,digit);
      }
   };

   function cellFiller(data,paper) {
      var row = data.row;
      var col = data.col;
      var sourceRow = data.sourceRow;
      var sourceCol = data.sourceCol;
      var x = data.xPos;
      var y = data.yPos;
      if(data.dropArea){
         if(!answer[row][col]){
            return [paper.rect(x+1,y+1).attr(cardAttr).attr("fill","white")];
         }else{
            sourceRow = answer[row][col].row;
            sourceCol = answer[row][col].col;
         }
      }
      var letter = gridArray[sourceRow][sourceCol];
      var goto = gotoArray[sourceRow][sourceCol];
      var card = drawCard(x+1,y+1,letter,goto);
      card.attr("cursor","grab");
      Beav.dragWithTouch(card, onMove, onStart, onEnd);
      if(data.dropArea){
         return [paper.rect(x+1,y+1).attr(cardAttr).attr("fill","white"),card.toFront()];
      }else{
         if(level == "easy" && row == 0 && col == 0 && grid.isPaperPosOnGrid({left:x,top:y})){
            return [card,paper.rect(x+1,y+1).attr(cardAttr).attr({"fill":"none","stroke":"red"})];
         }
         return [card];
      }
   };

   function drawCard(x,y,letter,goto) {
      if(letter){
         var rect1 = paper.rect(x,y).attr(cardAttr);
         var rect2 = paper.rect(x, y + 2 * cellHeight / 3, cellWidth - 2, cellHeight/3 - 2).attr(gotoRectAttr);
         var rect3 = paper.rect(x, y + 2*cellHeight / 3,cellWidth - 2, cellHeight/6).attr(gotoRectAttr).attr("r",0);
         var letter = paper.text(x + cellWidth/2 - 1, y + cellHeight/3, letter).attr(cardLetterAttr);
         var gotoText = (goto) ? goto.col +" "+ goto.row : " ";
         var goto = paper.text(x + cellWidth/2 - 1, y + 5*cellHeight/6 - 1,gotoText).attr(gotoLetterAttr);
         return paper.set(rect1,rect2,rect3,letter,goto);
      }else{
         var rect1 = paper.rect(x,y,cellWidth - 2,cellHeight - 2).attr(gotoRectAttr);
         var text = paper.text(x + cellWidth/2 - 1, y + cellHeight/2 - 1,taskStrings.end).attr(gotoLetterAttr);
         return paper.set(rect1,text);
      }
   };

   function onStart(x,y,event) {
      if(draggedData){
         return;
      }
      displayError("");
      removeAllCardsHighlight();
      removeErrorHighlight();
      if(errorArrow){
         errorArrow.remove()
      }
      if(event.touches){
         x = event.touches[0].pageX;
         y = event.touches[0].pageY;
      }
      var xMouse = x - $("#paper").offset().left;
      var yMouse = y - $("#paper").offset().top;
      var pos = {left:xMouse,top:yMouse};
      if(grid.isPaperPosOnGrid(pos)){
         var gridPos = grid.paperPosToGridPos(pos);
         var card = grid.getCell(gridPos.row,gridPos.col)[0];
         var pos = grid.getCellPos(gridPos.row,gridPos.col);
         draggedCard = card.clone();
         draggedData = {pos:pos,grid:"source",gridPos:gridPos};
      }else if(dropArea.isPaperPosOnGrid(pos)){
         var dropGridPos = dropArea.paperPosToGridPos(pos);
         var cell = dropArea.getCell(dropGridPos.row,dropGridPos.col);
         var sourceGridPos = JSON.parse(JSON.stringify(answer[dropGridPos.row][dropGridPos.col]));
         var sourcePos = dropArea.getCellPos(sourceGridPos.row,sourceGridPos.col);
         var dropPos = dropArea.getCellPos(dropGridPos.row,dropGridPos.col);
         draggedCard = cell.pop();
         draggedData = {pos:dropPos,grid:"dropArea",gridPos:sourceGridPos};
         answer[dropGridPos.row][dropGridPos.col] = null;
      }
      draggedCard.toFront();

   };

   function onMove(dx,dy,x,y,event) {
      var pos = draggedData.pos;
      var x = pos.x + dx;
      var y = pos.y + dy;
      if(x < dragLimits.xMin){
         dx = dragLimits.xMin - pos.x;
      }else if(x > dragLimits.xMax){
         dx = dragLimits.xMax - pos.x;
      }
      if(y < dragLimits.yMin){
         dy = dragLimits.yMin - pos.y;
      }else if(y > dragLimits.yMax){
         dy = dragLimits.yMax - pos.y;
      }

      draggedCard.transform("t"+dx+" "+dy);

      removeCellHighlight();
      dropSpot = isOverDropSpot(x,y);
      if(dropSpot){
         highlightCell(dropSpot);
      }
   };

   function onEnd(event) {
      if(!dropSpot || !isSpotValid(dropSpot)){
         if(draggedCard){
            draggedCard.remove();
         }
         if(draggedData && draggedData.grid == "dropArea" && gridArray[draggedData.gridPos.row][draggedData.gridPos.col]){
            var sourceCell = grid.getCell(draggedData.gridPos.row,draggedData.gridPos.col);
            sourceCell[0][0].attr("fill",cardColor);
         }

         draggedData = null;
         if(dropSpot){
            displayError(dropSpot.errorMsg);
         }else{
            displayError("");
         }
         removeCellHighlight();

      }else{
         var pos = draggedData.pos;
         var dx = dropSpot.x - pos.x + 1;
         var dy = dropSpot.y - pos.y + 1;
         draggedCard.remove();
         dropArea.addToCell(cellFiller,{row:dropSpot.row,col:dropSpot.col,sourceRow:draggedData.gridPos.row,sourceCol:draggedData.gridPos.col});
         answer[dropSpot.row][dropSpot.col] = {row: draggedData.gridPos.row, col: draggedData.gridPos.col};
         draggedCard = null;
         draggedData = null;
         var cell = dropArea.getCell(dropSpot.row,dropSpot.col);
         cell[1].hover(hoverIn(dropSpot.row,dropSpot.col),hoverOut(dropSpot.row,dropSpot.col));
         if(dropLabel){
            dropLabel.remove();
         }
      }
   };

   function isOverDropSpot(x,y) {
      var dMin = Infinity;
      var spot;
      for(var iRow = 0; iRow < dropAreaNbRows; iRow++){
         for(var iCol = 0; iCol < dropAreaNbCol; iCol++){
            var spotPos = dropArea.getCellPos(iRow,iCol);
            var d = Beav.Geometry.distance(x,y,spotPos.x,spotPos.y);
            if(d < dMin){
               spot = {x:spotPos.x,y:spotPos.y,row:iRow,col:iCol};
               dMin = d;
            }
         }
      }
      if(dMin < cellWidth){
         return spot;
      }
      return null;
   };

   function highlightCell(spot) {
      var cell = dropArea.getCell(spot.row,spot.col);
      cell[0].attr("fill","lightblue");
   };

   function removeCellHighlight() {
      for(var iRow = 0; iRow < dropAreaNbRows; iRow++){
         for(var iCol = 0; iCol < dropAreaNbCol; iCol++){
            var cell = dropArea.getCell(iRow,iCol);
            cell[0].attr("fill","white");
         }
      }
      dropSpot = null;
   };

   function removeAllCardsHighlight() {
      for(var iRow = 0; iRow < dropAreaNbRows; iRow++){
         for(var iCol = 0; iCol < dropAreaNbCol; iCol++){
            hoverOut(iRow,iCol)();
         }
      }
   };

   function isSpotValid(spot) {
      if(answer[spot.row][spot.col]){
         /* spot occupied */
         dropSpot.errorMsg = taskStrings.wrongSpot;
         return false;
      }
      if(level == "easy"){
         if(spot.col == 0 && (draggedData.gridPos.row != 0 || draggedData.gridPos.col != 0)){
            dropSpot.errorMsg = taskStrings.wrongFirstLetter;
            return false;
         }
         if(spot.col > 0 && !answer[spot.row][spot.col - 1]){
            dropSpot.errorMsg = taskStrings.wrongOrder;
            return false;
         }
      }
      return true;
   };

   function matchGoto(goto,gridPos) {
      if(!goto){
         return false;
      }
      var row = goto.row - 1;
      var col = Beav.Array.indexOf(letters,goto.col);
      if(gridPos.row == row && gridPos.col == col){
         return true;
      }
      return false;
   };

   function hoverIn(row,col) {
      return function() {
         var cell = dropArea.getCell(row,col);
         var sourcePos = answer[row][col];
         if(sourcePos){
            if(!gridArray[sourcePos.row][sourcePos.col]){
               return
            }
            var sourceCell = grid.getCell(sourcePos.row,sourcePos.col);
            cell[1][0].attr("fill",hoverColor);
            sourceCell[0][0].attr("fill",hoverColor);
         }
      }
   };

   function hoverOut(row,col) {
      return function() {
         var cell = dropArea.getCell(row,col);
         var sourcePos = answer[row][col];
         if(sourcePos){
            if(!gridArray[sourcePos.row][sourcePos.col]){
               return
            }
            var sourceCell = grid.getCell(sourcePos.row,sourcePos.col);
            cell[1][0].attr("fill",cardColor);
            sourceCell[0][0].attr("fill",cardColor);
         }
      }
   };

   function drawErrorArrow(row,col) {
      var cardPos = dropArea.getCellPos(row,col);
      var x = cardPos.x;
      var y = cardPos.y;
      var arrowH = 20;
      var arrowW = 10;
      var x1 = x + cellWidth/2;
      var y1 = y + cellHeight + margin;
      var y2 = y1 + arrowH;
      var x3 = x1 - arrowW/2;
      var y3 = y1 + arrowW/2;
      var x4  =x1 + arrowW/2;
      var y4 = y3;
      var path = "M"+x1+" "+y1+",V"+y2+",M"+x1+" "+y1+",L"+x3+" "+y3+",M"+x1+" "+y1+",L"+x4+" "+y4;
      errorArrow = paper.path(path).attr(arrowAttr);
   };

   function getWords() {
      var words = [];
      for(var iRow = 0; iRow < dropAreaNbRows; iRow++){
         var word = "";
         var lettersPos = [];
         for(var iCol = 0; iCol < dropAreaNbCol; iCol++){
            var gridPos = answer[iRow][iCol];
            if(!gridPos && word.length > 0){
               words.push({word:word,pos:lettersPos});
               word = "";
               lettersPos = [];
            }else if(gridPos){
               var letter = gridArray[gridPos.row][gridPos.col];
               if(letter){
                  word += letter;
                  lettersPos.push({row:iRow,col:iCol});
               }
               if(word.length > 0 && iCol == dropAreaNbCol - 1){
                  words.push({word:word,pos:lettersPos});
               }
            }
         }
      }
      return words;
   };

   function errorHighlight(dropRow,dropCol) {
      hoverIn(dropRow,dropCol)();
      var sourcePos = answer[dropRow][dropCol];
      yCoordLabel[sourcePos.row][0].attr("opacity",1);
      xCoordLabel[sourcePos.col][0].attr("opacity",1);
   };

   function removeErrorHighlight() {
      for(var iCol = 0; iCol < nbCol; iCol++){
         xCoordLabel[iCol][0].attr("opacity",0);
      }
      for(var iRow = 0; iRow < nbRows; iRow++){
         yCoordLabel[iRow][0].attr("opacity",0);
      }
   };

   /* Specification of the checker:
      - data[level].solution should be replaced with data[level].nbSolutions
        because the checker does not require the exact words
      - every sequence of consequence letters on a same row is considered as a word
        (in other words, empty slots separate words)
      - for each word:
         - iter over the list of cards that compose it
             if card "i" does not have a "goto" that matches coords of card "i+1",
                then report an error "la carte P indique l'emplacement C2, mais la carte N qui le suit se trouve à l'emplacement D3", with highlight on the card P (same highlight as for mouseover).
         - for the last card, if its "goto" is not null,
              then report an error "le mot n'est pas terminé puisque la dernière lettre n'est pas celle de la case C6"
              and highlight the last letter from that word
         - if the word doesn't have the desired length, error.
      - if two words begin with the same card id
           then report an error "un même mot apparaît deux fois".
      - if there are more than data[level].nbSolutions words (only possible in hard version)
           then report error "vous devez constituez seulement 3 mots dans la grille"
      - if there are fewer than data[level].nbSolutions correct words,
           then report error "il vous manque des mots", partial score possible
      - else, there are data[level].nbSolutions correct words,
           then report success

   */
   function checkResult(noVisual) {
      var words = getWords();
      var nbValidWords = 0;
      var firstCards = [];
      var firstCardsAlreadyUsed = [];

      for(var iWord = 0; iWord < words.length; iWord++){
         var word = words[iWord];
         var letterPos = word.pos;
         for(var iLetter = 0; iLetter < letterPos.length; iLetter++){
            var dropPos = letterPos[iLetter];
            var gridPos = answer[dropPos.row][dropPos.col];
            var letter = gridArray[gridPos.row][gridPos.col];
            var goto = gotoArray[gridPos.row][gridPos.col];
            if(iLetter < letterPos.length - 1){
               /* check goto match next letter */
               var nextDropPos = letterPos[iLetter + 1];
               var nextGridPos = answer[nextDropPos.row][nextDropPos.col];
               if(!matchGoto(goto,nextGridPos)){
                  var nextLetter = gridArray[nextGridPos.row][nextGridPos.col];
                  var nextCoord = {row: nextGridPos.row + 1, col: letters[nextGridPos.col]}
                  var msg = taskStrings.wrongGoto(letter,goto,nextLetter,nextCoord);
                  if(!noVisual){
                     displayError(msg);
                     // hoverIn(dropPos.row,dropPos.col + 1)();
                     errorHighlight(dropPos.row,dropPos.col + 1);
                     if (level != "hard") {
                        drawErrorArrow(dropPos.row,dropPos.col);
                     }
                  }
                  return { successRate: 0, message: msg };
               }
            }else if(goto != null){
               var lastLetterRow = gotoArray.length;
               var lastLetterCol = letters[gotoArray[lastLetterRow - 1].length - 1];
               var lastLetterPos = {row: lastLetterRow, col: lastLetterCol};
               var msg = taskStrings.wrongLastLetter(lastLetterPos);
               if(!noVisual){
                  displayError(msg);
                  // hoverIn(dropPos.row,dropPos.col)();
                  errorHighlight(dropPos.row,dropPos.col);
               }
               return { successRate: 0, message: msg };
            }else if(word.word.length != solutionLength){
               var msg = taskStrings.wrongLength(solutionLength);
               if(!noVisual){
                  displayError(msg);
                  for(var jLetter = 0; jLetter < letterPos.length; jLetter++){
                     var pos = letterPos[jLetter];
                     // hoverIn(pos.row,pos.col)();
                     errorHighlight(pos.row,pos.col);
                  }
               }
               return { successRate: 0, message: msg };
            }
         }
         nbValidWords++;
         var firstCardPos = answer[letterPos[0].row][letterPos[0].col];
         var alreadyUsed = false;
         for(var iFirstCard = 0; iFirstCard < firstCards.length; iFirstCard++){
            var pos = firstCards[iFirstCard];
            if(pos.row == firstCardPos.row && pos.col == firstCardPos.col){
               alreadyUsed = true;
               break;
            }

         }
         if(alreadyUsed){
            firstCardsAlreadyUsed.push(firstCardPos);
         }else{
            firstCards.push(firstCardPos);
         }
      }

      if(firstCardsAlreadyUsed.length > 0){
         var msg = taskStrings.sameWordTwice;
         if(!noVisual){
            displayError(msg);
         }
         return { successRate: 0, message: msg };
      }

      if(words.length > nbSolutions){
         var msg = taskStrings.tooManyWords(nbSolutions);
         if(!noVisual){
            displayError(msg);
         }
         return { successRate: 0, message: msg };
      }
      if(words.length < nbSolutions){
         var msg = taskStrings.missingWord(words.length, nbSolutions);
         if(!noVisual){
            displayError(msg);
         }
         return { successRate: 0, message: msg };
      }
      if(!noVisual){
         platform.validate("done");
      }else{
         return { successRate: 1, message: taskStrings.success };
      }

   };

   function displayError(msg) {
      $("#error").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
