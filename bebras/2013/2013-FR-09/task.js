function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         corridors: {
            Y: [
               ["C","D","A","D","C","B"],
               [null,"C","C",null,"D",null],
               ["D",null,"D","E",null,"E"],
               ["B","B",null,null,"C","B"],
               ["D","D","D","B","E","A"]
            ],
            X: [
               ["A","B","E","B","E","A","D"],
               ["A","B",null,"B",null,"A","B"],
               ["A",null,"C","B","D",null,"D"],
               ["C","A",null,"C","A","D","E"]
            ]
         },
         princePos: [2,5]
         
      },
      medium: {
         corridors: {
            Y: [
               ["C","D","A","D","C","B"],
               [null,"C","C",null,"D",null],
               ["D",null,"D","E",null,"E"],
               ["B","B",null,null,"C","B"],
               ["D","D","D","B","E","A"]
            ],
            X: [
               ["A","B","E","B","E","A","D"],
               ["A","B",null,"B",null,"A","B"],
               ["A",null,"C","B","D",null,"D"],
               ["C","A",null,"C","A","D","E"]
            ]
         },
         princePos: [2,5]
      },
      hard: {
         corridors: {
            Y: [
               ["C","D","A","D","C","B"],
               [null,"C","C",null,"D",null],
               ["D",null,"D","E",null,"E"],
               ["B","B",null,null,"C","B"],
               ["D","D","D","B","E","A"]
            ],
            X: [
               ["A","B","E","B","E","A","D"],
               ["A","B",null,"B",null,"A","B"],
               ["A",null,"C","B","D",null,"D"],
               ["C","A",null,"C","A","D","E"]
            ]
         },
         princePos: [2,5]
      }
   };

   var paper;
   var paperWidth;
   var paperHeight;

   var marginX = 10;
   var marginY = 10;
   var wallThickness = 10;
   var roomSize = 50;
   var corridorLength = 20;
   var corridorW = 20;
   var hallLength = 90;
   var labelSpace = 70;
   var princeW = 35;
   var princeH = 28;
   var princeSrc = $("#prince").attr("src");
   var princessSrc = $("#princess").attr("src");
   var towerW = 40;
   var towerH = 60;
   var animTime = 500;

   var corridors;
   var nbCol;
   var nbRows;
   var princePos;
   var princess;
   var initPos = {};
   var roomPos = [];

   var wallAttr = {
      stroke: "black",
      fill: "grey"
   };
   var roomAttr = {
      stroke: "black",
      fill: "#e3d7f4"
   };
   var corridorAttr = {
      stroke: "black",
      fill: "#440055"
   };
   var hallAttr = {
      stroke: "black",
      fill: "#803300"
   };
   var letterAttr = {
      "font-size": 14,
      "font-weight": "bold",
      fill: "white"
   };
   var labelAttr = {
      "font-size": 16,
      "font-weight": "bold",
      "text-anchor": "start"
   };
   var arrowAttr = {
      stroke: "black",
      "stroke-width": 2,
      "arrow-end": "classic-wide-long"
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      corridors = data[level].corridors;
      princePos = data[level].princePos;
      nbRows = corridors.X.length;
      nbCol = corridors.Y[0].length;
      paperWidth = marginX + 2*labelSpace + hallLength + nbCol*(roomSize + corridorLength) + wallThickness;
      paperHeight = 4*marginY + 2*wallThickness + nbRows*(roomSize + corridorLength) + corridorLength;
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(answer){
         // rng.reset(answer.seed);
      }
   };

   subTask.resetDisplay = function () {
      displayError("");
      $("#answer").val(answer);
      initPaper();
      initHandlers();
      displayHelper.hideValidateButton = true;
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = "";
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result;
   }

   subTask.unloadLevel = function (callback) {
      subTask.raphaelFactory.stopAnimate("anim");
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);
      $("#paper").css({
         width: paperWidth
      });
      drawPalace();
   };

   function initHandlers() {
      $("#answerButton").off("click");
      $("#answerButton").click(enterCommand);
      $("#answer").keydown(function(){
         displayError("");
         resetPrincess();
      });
   };

   function enterCommand() {
      displayError("");
      resetPrincess();
      var command = $("#answer").val();
      command = command.replace(/\s+/g, '').toUpperCase();
      answer = command;
      checkResult();
      // console.log("commande:"+command);
   };

   function drawPalace() {
      var xPrince, xPrincess;
      var yPrince, yPrincess;
      var xWallTop = labelSpace + hallLength - corridorLength - marginX - wallThickness;
      var yWallTop = marginY;
      var wallTopW = 2*marginX + nbCol*roomSize + (nbCol + 1)*corridorLength + 2*wallThickness;
      var wallTopH = wallThickness;
      var xWallRight = xWallTop + wallTopW - wallThickness;
      var yWallRight = yWallTop;
      var wallRightW = wallThickness;
      var wallRightH = 2*wallThickness + 2*marginY + nbRows*roomSize + (nbRows + 1)*corridorLength;
      var xWallBottom = xWallTop;
      var yWallBottom = yWallTop + wallRightH - wallThickness;
      var wallBottomW = wallTopW;
      var wallBottomH = wallThickness;
      var xWallLeft1 = xWallTop;
      var yWallLeft1 = yWallTop + wallThickness + marginY + 2*(roomSize + corridorLength);
      var wallLeft1W = wallThickness;
      var wallLeft1H = yWallBottom - yWallLeft1;
      var xWallLeft2 = xWallTop;
      var yWallLeft2 = yWallTop;
      var wallLeft2W = wallThickness;
      var wallLeft2H = wallThickness + marginY + roomSize + 2*corridorLength;
      paper.rect(xWallTop,yWallTop,wallTopW,wallTopH).attr(wallAttr); 
      paper.rect(xWallRight,yWallRight,wallRightW,wallRightH).attr(wallAttr); 
      paper.rect(xWallBottom,yWallBottom,wallBottomW,wallBottomH).attr(wallAttr); 
      paper.rect(xWallLeft1,yWallLeft1,wallLeft1W,wallLeft1H).attr(wallAttr); 
      paper.rect(xWallLeft2,yWallLeft2,wallLeft2W,wallLeft2H).attr(wallAttr); 
      var xTower = xWallTop - marginX - towerW;
      var yTower1 = yWallLeft2 + wallLeft2H;
      var yTower2 = yWallLeft1 + towerH;
      drawTower(xTower,yTower1);
      drawTower(xTower,yTower2);

      xPrincess = xTower - princeW - marginX;

      for(var iRow = 0; iRow < nbRows; iRow++){
         roomPos[iRow] = [];
         var y = yWallTop + wallThickness + marginY + corridorLength + iRow*(roomSize + corridorLength);
         if(iRow == 1){
            yPrincess = y + roomSize/2 - princeH/2;
         }
         for(var iCol = 0; iCol < nbCol; iCol++){
            var x = xWallTop + wallThickness + marginX + corridorLength + iCol*(roomSize + corridorLength);
            roomPos[iRow][iCol] = { x: x + roomSize/2, y: y + roomSize/2 };
            paper.rect(x,y,roomSize,roomSize).attr(roomAttr);
            if(princePos[0] == iRow && princePos[1] == iCol){
               xPrince = x + roomSize/2 - princeW/2;
               yPrince = y + roomSize/2 - princeH/2,
               paper.image(princeSrc,xPrince,yPrince,princeW,princeH);
            }
         }
      }
      for(var iRow = 0; iRow < corridors.Y.length; iRow++){
         var y = yWallTop + wallThickness + marginY + iRow*(roomSize + corridorLength);
         for(var iCol = 0; iCol < corridors.Y[0].length; iCol++){
            var x = xWallTop + wallThickness + marginX + corridorLength + roomSize/2 - corridorW/2 + iCol*(roomSize + corridorW);
            var corr = corridors.Y[iRow][iCol];
            if(corr){
               paper.rect(x,y,corridorW,corridorLength).attr(corridorAttr);
               paper.text(x + corridorW/2,y + corridorLength/2,corr).attr(letterAttr);
            }
         }
      }
      var xHall, yHall;
      for(var iRow = 0; iRow < corridors.X.length; iRow++){
         var y = yWallTop + wallThickness + marginY + corridorLength + roomSize/2 - corridorW/2 + iRow*(roomSize + corridorW);
         for(var iCol = 0; iCol < corridors.X[0].length; iCol++){
            var x = xWallTop + wallThickness + marginX + iCol*(roomSize + corridorW);
            var corr = corridors.X[iRow][iCol];
            if(corr){
               if(iRow == 1 && iCol == 0){
                  xHall = x - hallLength + corridorLength;
                  yHall = y;
                  paper.rect(xHall,yHall,hallLength,corridorW).attr(hallAttr);
               }else{
                  paper.rect(x,y,corridorLength,corridorW).attr(corridorAttr);
               }
               paper.text(x + corridorLength/2,y + corridorW/2,corr).attr(letterAttr);
            }
         }
      }

      var xPrinceLabel = xWallRight + wallThickness + marginX;
      var yPrinceLabel = yPrince + princeH + 2*marginY;
      paper.text(xPrinceLabel,yPrinceLabel,taskStrings.prince).attr(labelAttr);
      var xStart1 = xPrinceLabel - marginX/2;
      var yStart1 = yPrinceLabel;
      var xEnd1 = xPrince + princeW;
      var yEnd1 = yPrince + princeH;
      paper.path("M"+xStart1+" "+yStart1+",L"+xEnd1+" "+yEnd1).attr(arrowAttr);

      princess = paper.image(princessSrc,xPrincess,yPrincess,princeW,princeH);
      initPos = { x: xPrincess, y: yPrincess };
   };

   function drawTower(x,y) {
      var crenelH = 10;
      var nbCrenels = 3;
      var crenelW = towerW/(2*nbCrenels - 1);
      var wallH = towerH - crenelH;
      var yWall = y - wallH;
      paper.rect(x,yWall,towerW,wallH).attr(wallAttr);
      var yCrenel = y - towerH;
      for(var iCrenel = 0; iCrenel < nbCrenels; iCrenel++){
         var xCrenel = x + iCrenel*2*crenelW;
         paper.rect(xCrenel,yCrenel,crenelW,crenelH).attr(wallAttr);
      }
   };

   function checkResult(noVisual) {
      var error;
      if(answer.length == 0){
         error = taskStrings.empty;
      }else if(answer.length > 50){
         error = taskStrings.tooLong;
      }else{
         for(var iChar = 0; iChar < answer.length; iChar++)
            if(answer.charAt(iChar) < "A" || answer.charAt(iChar) > "Z") {
              error = taskStrings.invalidChar;
         }
      }
      if(error){
         if(!noVisual){
            displayError(error);
         }
         return { successRate: 0, message: error }
      }

      var path = [];
      error = nextMove(path);
      if(!error){
         lastPos = path[path.length - 1];
         if(lastPos[0] != princePos[0] || lastPos[1] != princePos[1]){
            error = taskStrings.wrongPath;
         }
      }

      if(!noVisual){
         runAnimation(path,error);
      }else if(error){
         return { successRate: 0, message: error }
      }else{
         return { successRate: 1, message: taskStrings.success };
      }      
   };

   function nextMove(path) {
      var index = path.length;
      var nextChar = (path.length <= answer.length) ? answer.charAt(index) : null;
      if(index == 0 && nextChar != corridors.X[1][0]){
         return taskStrings.errorFirstDoor;
      }else if(index == 0){
         path.push([1,0]);
         return nextMove(path);
      }else if(!nextChar){
         return
      }

      var currPos = path[path.length - 1];
      var row = currPos[0];
      var col = currPos[1];
      var availCorr = {
         top: corridors.Y[row][col],
         bottom: corridors.Y[row + 1][col],
         left: corridors.X[row][col],
         right: corridors.X[row][col + 1]
      };

      for(var dir in availCorr){
         if(nextChar == availCorr[dir]){
            switch(dir){
               case "top":
                  var newRow = row - 1;
                  if(newRow < 0){
                     return taskStrings.window;
                  }else{
                     var newPos = [newRow,col];
                  }
                  break;
               case "bottom":
                  var newRow = row + 1;
                  if(newRow >= nbRows){
                     return taskStrings.window;
                  }else{
                     var newPos = [newRow,col];
                  }
                  break;
               case "left":
                  var newCol = col - 1;
                  if(newCol < 0){
                     return (row == 1) ? taskStrings.out : taskStrings.window;
                  }else{
                     var newPos = [row,newCol];
                  }
                  break;
               case "right":
                  var newCol = col + 1;
                  if(newCol >= nbCol){
                     return taskStrings.window;
                  }else{
                     var newPos = [row,newCol];
                  }
                  break;   

            }
            path.push(newPos);
            return nextMove(path);
         }
      }
      return taskStrings.noDoor(nextChar);
   };

   function runAnimation(path,error) {
      if(path.length == 0){
         if(error){
            displayError(error);
         }else{
            platform.validate("done");
         }
         return
      }
      var nextPos = path.shift();
      var nextRoomPos = roomPos[nextPos[0]][nextPos[1]];
      var nextCoord = { x: nextRoomPos.x - princeW/2, y: nextRoomPos.y - princeH/2 };
      var anim = new Raphael.animation(nextCoord,animTime,function(){
         runAnimation(path,error);
      });
      subTask.raphaelFactory.animate("anim",princess,anim);
   };

   function displayError(msg) {
      $("#error").html(msg);
   };

   function resetPrincess() {
      princess.attr(initPos);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
