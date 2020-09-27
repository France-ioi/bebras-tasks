function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         target: [
            [255, 0, 0],
            [255, 0, 255],
            [0, 0, 255],
            [0, 255, 0],
            [255, 255, 0],
            [255, 0, 0]
         ],
         nbRows: 2,
         shades: [100],
         minSpots: 4, // using 6 with a naive solution
         scale: 1.5,
         colorBar: true,
         show_progressBar: true
      },
      medium: {
        target: [
            [0, 0, 255],
            [255, 0, 255],
            [255, 0, 0],
            [255, 255, 255],
            [0, 255, 0],
            [0, 255, 0],
            [0, 255, 255],
            [0, 255, 0]
         ],
         nbRows: 3,
         shades: [100],
         minSpots: 6, // using 9 with a naive solution
         scale: 1.15,
         colorBar: true,
         show_progressBar: false
      },
      hard: {
         target: [
            [127, 0, 255],
            [255, 0, 0],
            [127, 0, 0],
            [127, 127, 127],
            [127, 0, 127],
            [0, 255, 127],
            [0, 255, 255],
            [255, 255, 255],
            [255, 255, 0],
            [255, 127, 0]
         ],
         nbRows: 4,
         shades: [100,50],
         minSpots: 9, // using 15 with a naive solution
         scale: 1.05,
         colorBar: true,
         show_progressBar: false
      }
   };
   var targetLighting;
   var currentLighting;

   var paper;
   var dragAndDrop;
   var nbColors = 3;  // REVIEW[ARNAUD]: mieux qu'un 3 en dur dans les boucles
   var paperWidth = 770;
   var paperHeight;
   var scale;
   var lineHeight = 22;
   var labelHeight;
   var tableHeight;
   var tableWidth;
   var colWidth;
   var dotHeight;
   var nbRows;
   var shades;
   var roomHeight;
   var spotsPaperWidth;
   var spotsPaperHeight;
   var leftSideWidth = 130;
   var spotSize = 20;
   var buttonSize = 45;
   var trashSize = buttonSize - 15;
   // REVIEW[ARNAUD]: it is useful in general to distinguish the various kinds of margins that occur in the task; i did the split here
   var marginX = 10;
   var marginY = 15;
   var leftMargin = 80;
   var dCeiling = buttonSize/2 + marginX;
   var separationBarH = 8;
   var colorBarH = 1.5 * lineHeight;

   var table = []; // for the raphael objects
   var lightGrid = [];
   var dragText;

   var trashImageSrc = $("#trash").attr("src");
   var colors = [
      ["rgb(255,0,0)","rgb(0,255,0)","rgb(0,0,255)"],
      ["rgb(127,0,0)","rgb(0,127,0)","rgb(0,0,127)"]
   ];
   var colorLetters = [taskStrings.redInitial,taskStrings.greenInitial,taskStrings.blueInitial];
   var colorNames = [taskStrings.red,taskStrings.green,taskStrings.blue];

   var boldTextAttr = {
      "font-size": 16,
      "font-weight": "bold",
      "fill": "white"
   };
   var targetTextAttr = {
      "font-size": 14,
      "font-weight": "bold",
      "fill": "black"
      // "text-anchor": "start"
   };
   var darkBoldTextAttr = {
      "font-size": 16,
      "font-weight": "bold",
      "fill": "black"
   };
   var colorTextAttr = {
      "font-size": 16,
      "fill": "white"
   };
   var numberTextAttr = {
      "font-size": 16,
      "fill": "white"
   };
   var dragTextAttr = {
      "font-size": 16,
      fill: "black",
      "text-anchor": "start"
   };
   var tableBorderAttr = {
      "stroke": "black",
      "stroke-width": 1
   };
   var tableBackgroundAttr = {
      "fill": "rgb(150,150,150)",
      "stroke": "none"
   };
   var dotAttr = {
      r: 6,
      "stroke": "none",
      "fill": "rgb(140,140,140)"
   };
   var roomBackgroundAttr = {
      "fill":"rgb(50,50,50)"
   };
   var shadeLabelAttr = {
      "font-size": 16,
      "fill": "black",
      "text-anchor": "start"
   };
   var backgroundTargetAttr = {
      "width": buttonSize,
      "height": buttonSize,
      "stroke": "black",
      "fill": "lightgrey",
      r: 5
   };
   var dragAreaAttr = {
      stroke: "none",
      fill: "red",
      opacity: 0,
      cursor: "grab"
   };
   var separationBarAttr = {
      fill: "white",
      stroke: "none"
   };
   var arrowAttr = {
      "stroke-width": 2,
      "arrow-end": "classic-wide-long"
   }

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      scale = data[level].scale;
      colorBar = data[level].colorBar;
      show_progressBar = data[level].show_progressBar;
      colWidth = 50 * scale;
      dotHeight = 50 * scale;
      targetLighting = data[level].target;
      nbRows = data[level].nbRows;
      shades = data[level].shades;
      tableWidth = (targetLighting.length * colWidth) + 2;
      tableHeight = 3 * lineHeight + 2 + separationBarH;
      labelHeight = marginY + darkBoldTextAttr["font-size"];
      if(colorBar){
         tableHeight += colorBarH;
      }
      roomHeight = nbRows * dotHeight + dCeiling;
      spotsPaperWidth = shades.length * (buttonSize + marginX) + 2 * marginX;
      spotsPaperHeight = lineHeight + 5 * marginY + 4 * buttonSize;
      // paperWidth = tableWidth + marginX + Math.max(spotsPaperWidth,leftSideWidth);
      paperHeight = 2 * tableHeight + 3*marginY + roomHeight + labelHeight;
      currentLighting = [];
      for(var iCol = 0; iCol < targetLighting.length; iCol++){
         currentLighting[iCol] = [0, 0, 0];
      }
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function () {
      $(".nbLampsTarget").text(data[level].minSpots);
      initPaper();
      initDragAndDrop();
      initRoom();
      initTable(true);
      initTable(false);
      initSpots();
      updateLighting(true);
      reloadAnswer();
      displayError("");
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
      for(var iRow = 0; iRow < nbRows; iRow++){
         defaultAnswer[iRow] = [];
         for(var iCol = 0; iCol < data[level].target.length - iRow; iCol++){
            defaultAnswer[iRow][iCol] = null;
         }
      }
      if (level == "easy") {
         defaultAnswer[0][1] = "spot_2_0";
         defaultAnswer[1][0] = "spot_0_0";         
      }
      return defaultAnswer;
   };

   function countSpots() {
      var nbSpots = 0; // REVIEW[ARNAUD]: j'ai renommé "cpt" en nbSpots, car je ne savais pas ce que ça veut dire
      for(var iRow = 0; iRow < nbRows; iRow++){
         for(var iCol = 0; iCol < answer[iRow].length; iCol++){
            if(answer[iRow][iCol]){
               nbSpots++;
            }
         }
      }
      return nbSpots;
   }

   function getResultAndMessage() {
      // REVIEW[ARNAUD]: j'ai changé le code ci-dessous pour préférer une structure montrant systématiquement dans chaque branche une instruction return, c'est un shéma à privilégier en général.
      updateLighting();
      for(var iCol = 0; iCol < targetLighting.length; iCol++){
         for(var iColor = 0;iColor < nbColors; iColor++){
            if(targetLighting[iCol][iColor] != Math.floor(currentLighting[iCol][iColor])){
               return { successRate: 0, message: taskStrings.error };
            }
         }
      }
      // REVIEW[ARNAUD]: j'ai sorti le code qui compte dans une fonction auxiliaire pour clarifier
      var nbExtraSpots = countSpots() - data[level].minSpots;
      if(level != "easy" && nbExtraSpots > 0) {
          // at least 0.5,, at most 0.8, loosing 0.2 for the first extra lamp, and 0.1 for the others
         var score = Math.max(0.5, 0.8 - nbExtraSpots * 0.1);
         return { successRate: score, message: taskStrings.tooManySpots };
      } else {
         return { successRate: 1, message: taskStrings.success };
      }
   };

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);

      $("#zone_2").css("position","relative");
      var x1 = 0;
      var y1 = 0;
      var w1 = paperWidth;
      var h1 = tableHeight + labelHeight + 2*marginY;
      $("#overlay_1").css({
         display: "block",
         position: "absolute",
         top: y1,
         left: x1,
         width: w1,
         height: h1,
         background: "red",
         opacity: 0
      });
      var x2 = 0;
      var y2 = tableHeight + labelHeight + 2*marginY + 3 * (marginY + buttonSize) + buttonSize / 2 + marginY + buttonSize/2 - 5;
      y2 += (level == "hard") ? 2 * lineHeight : 0;
      var w2 = paperWidth;
      var h2 = paperHeight - y2;
      $("#overlay_2").css({
         position: "absolute",
         top: y2,
         left: x2,
         width: w2,
         height: h2,
         background: "red",
         opacity: 0
      });
      var x3 = 0;
      var y3 = 0;
      var w3 = leftMargin + marginX;
      var h3 = paperHeight;
      $("#overlay_3").css({
         display: "block",
         position: "absolute",
         top: y3,
         left: x3,
         width: w3,
         height: h3,
         background: "red",
         opacity: 0
      });
      var x4 = (level != "hard") ? tableWidth + marginX + leftMargin + spotsPaperWidth : leftMargin + marginX + tableWidth;
      var y4 = 0;
      var w4 = paperWidth - x4;
      var h4 = (level != "hard") ? paperHeight : tableHeight + labelHeight + 2*marginY + 2*lineHeight + marginY - 1;
      $("#overlay_4").css({
         display: "block",
         position: "absolute",
         top: y4,
         left: x4,
         width: w4,
         height: h4,
         background: "red",
         opacity: 0
      });
   };

   function initDragAndDrop() {
      dragAndDrop = new DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            displayError("");
            var cont = this.getContainer(dstContId);
            if(dstContId != null && dstContId != "trash"){
                // REVIEW[ARNAUD] on va pas changer, mais en général on évite des "substr" sur des identifiants, ça donne du code difficile à comprendre. Ici on pourrait utiliser un tableau qui map les ID des éléments vers leurs positions [row,col].
               var row = dstContId.substr(4,1);
               var col = dstContId.substr(6,1);
               if(srcContId.substr(0,4) == "spot"){
                  answer[row][col] = srcContId;
               }else{
                  var previousRow = srcContId.substr(4,1);
                  var previousCol = srcContId.substr(6,1);
                  answer[row][col] = answer[previousRow][previousCol];
                  if(previousRow != row || previousCol != col){
                     answer[previousRow][previousCol] = null;
                  }
               }
               var raphSet = cont.draggableElements[0].component.element;
               raphSet.transform("");
               updateLighting(true);
            }
            if(dstContId == "trash" || dstContId == null){
               if(srcContId.substr(0,3) == "dot"){
                  var row = srcContId.substr(4,1);
                  var col = srcContId.substr(6,1);
                  answer[row][col] = null;
                  updateLighting(true);
               }
               if(dstContId == "trash"){
                  cont.draggableElements[0].remove();
               }
            }
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType)
         {
            if (dstCont == null || dstCont == "trash") {
               return true;
            }
            if (dstCont.substr(0,3) == "dot") {
               var row = dstCont.substr(4,1);
               var col = dstCont.substr(6,1);
               if(answer[row][col] != null){
                  displayError(taskStrings.spotOccupied);
                  return false;
               }
               displayError("");

               return true;
            }
         },
         ejected : function(refEl, previousCont, previousPos) {

         }
      });

   };

   function initTable(current) {
      if(current){
         var x = leftMargin;
         var y = roomHeight + tableHeight + labelHeight + 2*marginY;
         paper.text(leftMargin/2, y - marginY,taskStrings.lightingCurrent).attr(targetTextAttr);
         drawArrow(y + marginY);
      }else{
         var x = leftMargin;
         var y = labelHeight;
         paper.text(leftMargin/2, y - marginY,taskStrings.lightingToReproduce).attr(targetTextAttr);
         drawArrow(y + marginY);
      }
      if(colorBar){
         paper.rect(x,y,tableWidth - 2,colorBarH).attr(tableBorderAttr);
         paper.rect(x, y + colorBarH, tableWidth - 2, separationBarH).attr(separationBarAttr);
      }else{
         paper.rect(x, y, tableWidth - 2, separationBarH).attr(separationBarAttr);
      }

      for(var iCol = 0; iCol < targetLighting.length; iCol++){
         if(current)
            table[iCol] = {};
         initCol(current,iCol);
      }
   };

   function initCol(current,index) {
      var x = index * colWidth + leftMargin;
      if(!current){
         var y0 = labelHeight;
         var lighting = targetLighting;
      }else{
         var y0 = roomHeight + tableHeight + labelHeight + 2*marginY;
         var lighting = currentLighting;
      }
      if(colorBar){
         var color = "rgb("+lighting[index][0]+","+lighting[index][1]+","+lighting[index][2]+")";
         var hue = paper.rect(x,y0,colWidth, colorBarH).attr({
            "fill": color,
            "stroke": color,
            "stroke-width": 0.5
         }).toBack();
         if(current)
            table[index].hue = hue;
      }

      for(var iLine = 0; iLine < nbColors; iLine++){
         initLine(current,index,iLine);
      }
   };

   function initLine(current,col,line) {
      var x = col * colWidth + leftMargin;
      if(!current){
         var y0 = labelHeight;
         var y = y0 + line * lineHeight + separationBarH;
         var lighting = targetLighting;
      }else{
         var y0 = tableHeight + labelHeight + 2*marginY;
         var y = y0 + roomHeight + line * lineHeight + separationBarH;
         var lighting = currentLighting;
      }
      if(colorBar){
         y += colorBarH;
      }

      paper.rect(x,y,colWidth,lineHeight).attr(tableBorderAttr);

      var color = colors[0][line];
      var colorLetter = colorLetters[line];
      paper.rect(x,y,lineHeight,lineHeight).attr({"fill":color,"stroke":"none"}).toBack();
      paper.text(x + lineHeight/2,y + lineHeight/2,colorLetter).attr(colorTextAttr);
      var text = paper.text(x + lineHeight + (colWidth - lineHeight)/2,y + lineHeight/2, lighting[col][line]).attr(numberTextAttr);
      if(show_progressBar){
         var progressBar = paper.rect(x + lineHeight,y,(colWidth - lineHeight) * lighting[col][line]/255,lineHeight).attr({stroke:"none",fill:color}).toBack();
      }else{
         var progressBar = null;
      }
      if(current){
         table[col][line] = {
            text:text,
            pb:progressBar
         };
      }
      paper.rect(x,y,colWidth,lineHeight).attr(tableBackgroundAttr).toBack();

   };

   function initRoom() {
      var x0 = leftMargin - 1;
      var y0 = tableHeight + labelHeight + 2*marginY;
      paper.rect(x0 + 1,y0,tableWidth - 2,roomHeight).attr(roomBackgroundAttr);
      for(var iRow = 0; iRow < nbRows; iRow++){
         lightGrid[iRow] = [];
         for(var iCol = 0; iCol < targetLighting.length - iRow; iCol++){
            var y = y0 + dotHeight * (nbRows - iRow - 1) + dCeiling;
            var x = x0 + (2 * iCol + 1 + iRow) * colWidth / 2;
            var backgroundTarget = paper.circle(0,0).attr(dotAttr);
            dragAndDrop.addContainer({
               ident : 'dot_'+iRow+"_"+iCol,
               cx : x,
               cy : y,
               widthPlace : buttonSize + marginX,
               heightPlace : buttonSize + marginY,
               nbPlaces : 1,
               dropMode : 'replace',
               placeBackgroundArray : [ backgroundTarget ]
            });
            lightGrid[iRow][iCol] = getLightGridCell(iRow,iCol);
         }
      }
   };

   function initSpots() {
      var y0 = tableHeight + labelHeight + 2*marginY;
      var x0 = tableWidth + marginX + leftMargin;
      for(var iColor = 0; iColor < nbColors; iColor++){
         var y = y0 + iColor * (marginY + buttonSize) + buttonSize / 2 + marginY;
         y += (level == "hard") ? 2*lineHeight : 0;
         for(var iShade = 0; iShade < shades.length; iShade++){
            var x = x0 + iShade * (2*marginX + buttonSize) + buttonSize / 2 + marginX;
            var backgroundTarget = paper.rect(-buttonSize/2,-buttonSize/2).attr(backgroundTargetAttr);
            var spot = drawSpot(0,0,iShade,iColor);
            dragAndDrop.addContainer({
               ident : "spot_"+iColor+"_"+iShade,
               cx : x, cy: y, widthPlace : spotSize, heightPlace : spotSize,
               type : 'source',
               sourceElemArray : spot,
               placeBackgroundArray : [ backgroundTarget ]
            });
         }
      }

      var xTrash = x0 + spotsPaperWidth / 2;
      var yTrash = y0 + 3 * (marginY + buttonSize) + buttonSize / 2 + marginY;
      yTrash += (level == "hard") ? 2 * lineHeight : 0;
      var wTrash = spotsPaperWidth - 2*marginX;
      var hTrash = buttonSize - 10;
      var backgroundTarget = paper.rect(-wTrash/2,-hTrash/2).attr(backgroundTargetAttr).attr({width:wTrash,height:hTrash});
      if(!Beav.Navigator.isIE8()){
         var trash = paper.image(trashImageSrc,-trashSize/2,-trashSize/2,trashSize,trashSize);
      }else{
         var trash = paper.text(0,0,taskStrings.trash);
      }
      dragAndDrop.addContainer({
         ident : "trash",
         cx : xTrash, cy: yTrash, widthPlace : wTrash, heightPlace : hTrash,
         type: 'source',
         sourceElemArray : [],
         placeBackgroundArray : [ backgroundTarget, trash ]
      });

      if(level == "hard"){
         var y1 = (marginY + lineHeight)/2 + tableHeight + labelHeight + 2*marginY;
         var x1 = x0; // DEPRECATED (for centered text) + spotsPaperWidth/2;
         paper.text(x1,y1,taskStrings.lightIntensity).attr(shadeLabelAttr);

         for(var iShade = 0; iShade < shades.length; iShade++){
            var x2 = x0 + iShade * (2*marginX + buttonSize) + buttonSize / 2 + marginX;
            var y2 = y1 + lineHeight;
            paper.text(x2,y2,shades[iShade]+"%").attr(darkBoldTextAttr);
         }
      }
      if(level != "hard"){
         dragText = paper.text(x0 + buttonSize + 2*marginX, 1.5 * (marginY + buttonSize) + tableHeight + labelHeight + 2*marginY,taskStrings.drag).attr(dragTextAttr);
      }
   };

   function drawArrow(y) {
      var x1 = marginX/2;
      var x2 = leftMargin - marginX/2;
      var path = "M"+x1+" "+y+"H"+x2;
      paper.path(path).attr(arrowAttr);
   };

   function drawSpot(x,y,shade,color) {
      var size = buttonSize - 10;
      if(level == "hard" && shade == 0){
         size = buttonSize - 7;
      }
      if(level == "hard" && shade == 1){
         size = buttonSize - 16;
      }
      var lamp = paper.circle(x,y - size/4,size/4).attr("fill","black");
      var x1 = x - size/4;
      var y1 = y - size/4;
      var x2 = x1 + size/2;
      var x3 = x + size/2;
      var y3 = y + size/4;
      var x4 = x - size/2;
      var y4 = y3;

      var hue = colors[shade][color];
      var light = paper.path("M"+x1+" "+y1+",H"+x2+",L"+x3+" "+y3+",A"+(size/2)+" "+(size/4)+" 0 0 1 "+x4+" "+y4+",Z").attr("fill",hue);
      var letter = paper.text(x,y + 3,colorLetters[color]).attr(boldTextAttr);
      var dragArea = paper.rect(x - buttonSize/2 - marginY/2,y - buttonSize/2 - marginY/2,buttonSize + marginY,buttonSize + marginY).attr(dragAreaAttr);
      return [lamp,light,letter,dragArea];
   };

   function updateLighting(visual) {
      for(var tableCol = 0; tableCol < targetLighting.length; tableCol++){
         currentLighting[tableCol] = [0,0,0];
         var light = currentLighting[tableCol];
         for(var iRow = 0; iRow < nbRows; iRow++){
            if(answer[iRow]){
               for(var iCol = tableCol - iRow; iCol <= tableCol; iCol++){
                  if(typeof answer[iRow][iCol] != "undefined"){
                     var spot = answer[iRow][iCol];
                     if(answer[iRow][iCol]){
                        var color = spot.substr(5,1);
                        var shade = spot.substr(7,1);
                        light[color] = Math.min((light[color] + 255/(parseInt(shade) + 1)),255);
                     }
                  }
               }
            }
         }
         if(visual){
            for (var iColor = 0; iColor < nbColors; iColor++) {
               if(!Beav.Navigator.isIE8()){
                  table[tableCol][iColor].text.attr("text",Math.floor(light[iColor]));
               }else{
                  var x = table[tableCol][iColor].text.attr("x");
                  var y = table[tableCol][iColor].text.attr("y");
                  table[tableCol][iColor].text.remove();
                  table[tableCol][iColor].text = paper.text(x,y,Math.floor(light[iColor])).attr(colorTextAttr);
               }
               if(show_progressBar){
                  table[tableCol][iColor].pb.attr("width",(colWidth - lineHeight) * light[iColor]/255);
               }
            }
            if(colorBar){
               var hue = "rgb("+light[0]+","+light[1]+","+light[2]+")";
               table[tableCol].hue.attr({"fill":hue,stroke:hue,"stroke-width":0.5});
            }
         }
      }
      if(visual)
         updateLightGrid();
   };

   function getLightGridCell(row,col) {
      var y0 = dotHeight * (nbRows - 1 - row) + dCeiling + labelHeight + tableHeight + 2*marginY;
      var x0 = (2 * col + 1 + row) * colWidth / 2 + leftMargin;
      var x1 = x0 + colWidth/2;
      var y1 = y0 + dotHeight;
      var x2 = x0;
      var y2 = y1 + dotHeight;
      var x3 = x0 - colWidth/2;
      var y3 = y1;
      if(row > 0){
         var path = "M"+x0+" "+y0+",L"+x1+" "+y1+",L"+x2+" "+y2+",L"+x3+" "+y3+",Z";
      }else{
         var path = "M"+x0+" "+y0+",L"+x1+" "+y1+",H"+x3+",Z";
      }
      return paper.path(path).attr({
         stroke: "none",
         "fill": "none"
      });
   };

   function updateLightGrid() {
      for(var iRow = 0; iRow < nbRows; iRow++){
         for(var iCol = 0; iCol < lightGrid[iRow].length; iCol++){
            var color = [0, 0, 0];
            var enlightened = false;
            for(var jRow = iRow; jRow < nbRows; jRow++){
               for(var jCol = iCol - jRow + iRow; jCol <= iCol; jCol++){
                  var spot = answer[jRow][jCol];
                  if(spot){
                     var spotColor = spot.substr(5,1);
                     var shade = spot.substr(7,1);
                     color[spotColor] = Math.min((color[spotColor] + 255/(parseInt(shade) + 1)),255);
                     enlightened = true;
                  }
               }
            }
            if(!enlightened){
               lightGrid[iRow][iCol].attr({
                  "fill":"none",
                  "stroke": "none"
               });
            }else{
               var hue = "rgb("+color[0]+","+color[1]+","+color[2]+")";
               lightGrid[iRow][iCol].attr({
                  "fill": hue,
                  "stroke": hue,
                  "stroke-width": 0.2,
                  "opacity": "0.7"
               });
            }
         }
      }
   };

   function reloadAnswer() {  // for dragAndDropSystem
      if(!answer){
         return
      }
      for(var iRow = 0; iRow < nbRows; iRow++){
         for(var iCol = 0; iCol < answer[iRow].length; iCol++){
            var spot = answer[iRow][iCol];
            if(spot){
               var color = spot.substr(5,1);
               var shade = spot.substr(7,1);
               var dotID = 'dot_'+iRow+'_'+iCol;
               var spotID = 'spot_'+color+'_'+shade;
               var element = drawSpot(0,0,shade,color);
               dragAndDrop.insertObject(dotID, 0, {ident : spotID, elements : element });
            }
         }
      }
   }

   function displayError(msg) {
      $("#error").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
