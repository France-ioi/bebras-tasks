function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         corridors: {
            Y: [
               [2,2,2,2],
               [3,3,3,3],
               [2,2,2,2],
               [3,3,3,3]
            ],
            X: [
               [0,1,0,1,0],
               [0,1,0,1,0],
               [0,1,0,1,0]
            ]
         },
         princePos: [2,3]
      },
      medium: {
         corridors: {
            Y: [
               [2,3,0,3,2,1],
               [null,2,2,null,3,null],
               [3,null,3,4,null,4],
               [1,1,null,null,2,1],
               [3,3,3,1,4,0]
            ],
            X: [
               [0,1,4,1,4,0,3],
               [0,1,null,1,null,0,1],
               [0,null,2,1,3,null,3],
               [2,0,null,2,0,3,4]
            ]
         },
         princePos: [2,5]
      },
      hard: {
         corridors: {
            Y: [
               [3,1,0,2,0,2],
               [2,null,3,0,2,null],
               [null,2,0,null,null,1],
               [1,0,2,0,3,3],
               [0,2,0,3,0,1]
            ],
            X: [
               [1,0,2,1,null,1,3],
               [0,1,null,1,3,1,0],
               [0,3,null,3,null,null,2],
               [2,null,1,null,1,2,0]
            ]
         },
         princePos: [2,4]
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
   var letters = ["A","B","C","D","E"];

   var rng;

   var corridors;
   var nbCol;
   var nbRows;
   var princePos;
   var princess;
   var initPos = {};
   var roomPos = [];
   var corrRaph = {};

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
      rng = new RandomGenerator(subTask.taskParams.randomSeed);
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
      $("#answer").val(answer.seq);
      initPaper();
      initHandlers();
      displayHelper.hideValidateButton = true;
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = { 
         seq: "", 
         letters: JSON.parse(JSON.stringify(letters)),
         seed: rng.nextInt(1,10000) 
      };
      if(level != "hard"){
         rng.shuffle(defaultAnswer.letters);
      }else{
         var shift = rng.nextInt(0,letters.length);
         for(var iLetter = 0; iLetter < letters.length; iLetter++){
            defaultAnswer.letters[iLetter] = letters[(iLetter + shift)%letters.length];
         }
      }
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result;
   }

   subTask.unloadLevel = function (callback) {
      subTask.raphaelFactory.stopAnimate("anim");
      subTask.delayFactory.destroy("delay");
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
      answer.seq = command;
      checkResult();
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
      corrRaph.Y = [];
      for(var iRow = 0; iRow < corridors.Y.length; iRow++){
         corrRaph.Y[iRow] = [];
         var y = yWallTop + wallThickness + marginY + iRow*(roomSize + corridorLength);
         for(var iCol = 0; iCol < corridors.Y[0].length; iCol++){
            var x = xWallTop + wallThickness + marginX + corridorLength + roomSize/2 - corridorW/2 + iCol*(roomSize + corridorW);
            var corrID = corridors.Y[iRow][iCol];
            if(corrID != null){
               var letter = answer.letters[corrID];
               var rect = paper.rect(x,y,corridorW,corridorLength).attr(corridorAttr);
               var text = paper.text(x + corridorW/2,y + corridorLength/2,letter).attr(letterAttr);
               corrRaph.Y[iRow][iCol] = paper.set(rect,text);
            }else{
               corrRaph.Y[iRow][iCol] = null;
            }
         }
      }
      corrRaph.X = [];
      var xHall, yHall;
      for(var iRow = 0; iRow < corridors.X.length; iRow++){
         corrRaph.X[iRow] = [];
         var y = yWallTop + wallThickness + marginY + corridorLength + roomSize/2 - corridorW/2 + iRow*(roomSize + corridorW);
         for(var iCol = 0; iCol < corridors.X[0].length; iCol++){
            var x = xWallTop + wallThickness + marginX + iCol*(roomSize + corridorW);
            var corrID = corridors.X[iRow][iCol];
            if(corrID != null){
               var letter = answer.letters[corrID];
               if(iRow == 1 && iCol == 0){
                  xHall = x - hallLength + corridorLength;
                  yHall = y;
                  var rect = paper.rect(xHall,yHall,hallLength,corridorW).attr(hallAttr);
               }else{
                  var rect = paper.rect(x,y,corridorLength,corridorW).attr(corridorAttr);
               }
               var text = paper.text(x + corridorLength/2,y + corridorW/2,letter).attr(letterAttr);
               corrRaph.X[iRow][iCol] = paper.set(rect,text);
            }else{
               corrRaph.X[iRow][iCol] = null;
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
      if(answer.seq.length == 0){
         error = taskStrings.empty;
      }else if(answer.seq.length > 50){
         error = taskStrings.tooLong;
      }else{
         for(var iChar = 0; iChar < answer.seq.length; iChar++){
            if(answer.seq.charAt(iChar) < "A" || answer.seq.charAt(iChar) > "Z") {
              	error = taskStrings.invalidChar;
               break;
            }
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
         runAnimation(path,error,0);
      }else if(error){
         return { successRate: 0, message: error }
      }else{
         return { successRate: 1, message: taskStrings.success };
      }      
   };

   function nextMove(path) {
      var index = path.length;
      var currCorr = JSON.parse(JSON.stringify(corridors))
      var nextChar = (path.length <= answer.seq.length) ? answer.seq.charAt(index) : null;
      if(level == "hard"){
         for(var dir in currCorr){
            for(var iRow = 0; iRow < currCorr[dir].length; iRow++){
               for(var iCol = 0; iCol < currCorr[dir][iRow].length; iCol++){
                  if(currCorr[dir][iRow][iCol] != null){
                     var newCorrID = (currCorr[dir][iRow][iCol] + index)%letters.length;
                     currCorr[dir][iRow][iCol] = newCorrID;
                  }
               }
            }
         }
      }
      if(index == 0 && nextChar != answer.letters[currCorr.X[1][0]]){
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
         top: currCorr.Y[row][col],
         bottom: currCorr.Y[row + 1][col],
         left: currCorr.X[row][col],
         right: currCorr.X[row][col + 1]
      };

      for(var dir in availCorr){
         if(nextChar == answer.letters[availCorr[dir]]){
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

   function runAnimation(path,error,index) {
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
         if(level == "hard"){
            updateCorridors(index + 1);
            subTask.delayFactory.create("delay",function(){
               runAnimation(path,error,index + 1);
            },animTime);
         }else{
            runAnimation(path,error,index + 1);
         }
      });
      subTask.raphaelFactory.animate("anim",princess,anim);
   };

   function displayError(msg) {
      $("#error").html(msg);
   };

   function resetPrincess() {
      princess.attr(initPos);
      if(level == "hard"){
         updateCorridors(0);
      }
   };

   function updateCorridors(shift) {
      for(var dir in corridors){
         for(var iRow = 0; iRow < corridors[dir].length; iRow++){
            for(var iCol = 0; iCol < corridors[dir][iRow].length; iCol++){
               if(corridors[dir][iRow][iCol] != null){
                  var newCorrID = (corridors[dir][iRow][iCol] + shift)%letters.length;
                  corrRaph[dir][iRow][iCol][1].attr("text",answer.letters[newCorrID]);
               }
            }
         }
      }
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
