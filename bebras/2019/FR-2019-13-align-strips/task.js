function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         wheels: [[1,1,1]],
         propagationLines: [
            [[0,0],[0,1],[0,2]]
         ],
         initRotation: [[1,0,1]],
         target: [[0,0,0]],
         sourcePos: [0,0],
         beaverPos: [
            {row:0,col:2,side:"R"}
         ],
         paperHeight: 260,
         minDisconnect: 2
      },
      medium: {
         wheels: [[1,1,1,1,1,1]],
         propagationLines: [
            [[0,0],[0,1],[0,2],[0,3],[0,4],[0,5]]
         ],
         initRotation: [[1,0,1,0,0,1]],
         target: [[0,0,0,0,0,0]],
         sourcePos: [0,0],
         beaverPos: [
            {row:0,col:5,side:"R"}
         ],
         paperHeight: 260,
         minDisconnect: 3
      },
      hard: {
         wheels: [
            [null,null,2, 1, 3, 2],
            [1,3,2, null, 1, null],
            [null,1,null, null, 2, null],
            [1,3,1, 1, null, null]
         ],
         propagationLines: [
            [[1,0],[1,1],[2,1],[3,1],[3,0]],
            [[1,0],[1,1],[2,1],[3,1],[3,2],[3,3]],
            [[1,0],[1,1],[1,2],[0,2],[0,3],[0,4],[0,5]],
            [[1,0],[1,1],[1,2],[0,2],[0,3],[0,4],[1,4],[2,4]]
         ],
         initRotation: [
            [null,null,1, 1, 1, 0],
            [1,1,3, null, 0, null],
            [null,1,null,null, 0, null],
            [1,1,1, 0, null, null]
         ],
         target: [
            [null,null,1, 0, 2, 3],
            [0,2,3, null, 1, null],
            [null,1,null, null, 0, null],
            [0,0,0, 0, null, null]
         ],
         sourcePos: [1,0],
         beaverPos: [
            {row:0,col:5,side:"T"},
            {row:3,col:0,side:"L"},
            {row:2,col:4,side:"R"},
            {row:3,col:3,side:"R"}
         ],
         paperHeight: 500,
         minDisconnect: 6
      }
   };

   var paper;
   var paperWidth = 770;
   var paperHeight;
   var minDisconnect;
   var scaleUnit = 1.5;
   var loweredScale = 0.8;
   var wheelSize = 50 * scaleUnit;
   var beaverSize = 40 * scaleUnit;
   var margin = 10 * scaleUnit;
   var x0;
   var y0;
   var animTime = 300;
   var undoButtonW = 150;
   var undoButtonH = 30;

   var wheels;
   var wheelsPos = [];
   var target;
   var sourcePos;
   var beaverPos;
   var wheelsRaph = [];
   var rotatingWheels = [];
   var handleRaph;
   var lowerHandleRaph;
   var handleRotCenter = {};
   var handleControls = [];
   var beaverRaph = [];
   var propagationLines;
   var undoButton;
   var disconnectCounter;

   var beaverImageSrc = $("#beaversBall").attr("src");
   var waterColor = "#418DFF";
   var pipeColor = "#a2a2a2"; // "#d2d2d2";
   var pipeWidth = 6.5 * scaleUnit;
   var wheelWidth = 4 * scaleUnit;
   var wheelAttr = {
      fill: "#F6FFD5", // "#a371d2",
      stroke: "black",
      "stroke-width": wheelWidth
   };
   var pipeAttr = {
      stroke: pipeColor,
      "stroke-width": pipeWidth
   };
   var wheelHandleAttr = {
      stroke: "black",
      "stroke-width": wheelWidth
   };
   var handleAttr = {
      stroke: "none",
      fill: "black",
      r: 8 * scaleUnit
   };
   var controlAttr = {
      stroke: "none",
      fill: "grey",
      r: 8 * scaleUnit
   };
   var trajectoryAttr = {
      stroke: "grey",
      "stroke-width": 2 * scaleUnit,
      "stroke-dasharray": ["-"]
   };
   var clickAreaAttr = {
      stroke: "none",
      fill: "red",
      opacity: 0
   };
   var labelAttr = {
      "font-size": 16
      // "text-anchor": "start"
   };
   var undoButtonAttr = {
      fill: "lightgrey",
      r: 5
   };
   var waterOverlayAttr = {
      stroke: "none",
      fill: waterColor,
      opacity: 0
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      wheels = data[level].wheels;
      sourcePos = data[level].sourcePos;
      beaverPos = data[level].beaverPos;
      propagationLines = data[level].propagationLines;
      target = data[level].target;
      paperHeight = data[level].paperHeight;
      minDisconnect = data[level].minDisconnect;
      x0 = 3*margin;
      y0 = (level != "hard") ? 4*margin : 2*margin;
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function () {
      $("#minDisconnect").html(minDisconnect);
      initPaper();
      initWheels();
      initHandle();
      if(level == "hard"){
         initUndo();
      }
      initHandlers();
      getRotatingWheels();
      displayHelper.customValidate = checkResult;
      displayError("");
      showWaterFlow();
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
      var defaultAnswer = {rotation:JSON.parse(JSON.stringify(data[level].initRotation))};
      defaultAnswer.lowered = null;
      defaultAnswer.nbDisconnect = 0;
      defaultAnswer.actions = [];
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
   };

   function initWheels() {
      for(var iRow = 0; iRow < wheels.length; iRow++){
         wheelsRaph[iRow] = [];
         for(var iCol = 0; iCol < wheels[iRow].length; iCol++){
            var wheel = wheels[iRow][iCol];
            if(wheel){
               var x = x0 + wheelSize * (1.5 + iCol);
               var y = y0 + wheelSize * (1.5 + iRow);
               wheelsRaph[iRow][iCol] = drawWheel(wheel,x,y);
               var rotation = answer.rotation[iRow][iCol];
               var lowered = answer.lowered;
               wheelsRaph[iRow][iCol].transform("r"+rotation*90+" "+x+" "+y);
               if(lowered && lowered[0] == iRow && lowered[1] == iCol){
                  wheelsRaph[iRow][iCol].transform("...s"+0.8+" "+0.8+" "+x+" "+y);
               }
            }
         }
      }
      drawSource();
      drawBeavers();

      var xLabel = x0 + wheelSize *(1 + wheels[0].length/2);
      var yLabel = y0 + wheelSize *(1 + wheels.length) + 2*margin;
      paper.text(xLabel,yLabel,taskStrings.clickToLower).attr(labelAttr);
   };

   function initHandle() {
      var x = x0 + wheelSize * (1.5 + sourcePos[1]);
      var y = y0 + wheelSize * (1.5 + sourcePos[0]);
      handleRotCenter.x = x;
      handleRotCenter.y = y - wheelSize;

      initLowerHandle(x,y);

      var shaft = paper.path("M"+x+" "+handleRotCenter.y+",V"+(handleRotCenter.y - wheelSize)).attr(wheelHandleAttr);
      var handle = paper.circle(x,(handleRotCenter.y - wheelSize)).attr(handleAttr);
      handleRaph = paper.set(shaft,handle);
      paper.circle((x - wheelSize),handleRotCenter.y).attr(controlAttr).toBack();
      paper.path("M"+x+" "+(handleRotCenter.y - wheelSize)+",A"+wheelSize+" "+wheelSize+" 0 0 0 "+(x - wheelSize)+" "+handleRotCenter.y).attr(trajectoryAttr).toBack();
      var clickAreaX = x - wheelSize - controlAttr.r;
      var clickAreaY = handleRotCenter.y - wheelSize - controlAttr.r;
      var clickAreaW = (level == "hard") ? wheelSize + controlAttr.r : wheelSize + 2*controlAttr.r;
      var clickAreaH = wheelSize + 2*controlAttr.r;
      handleControls[0] = paper.rect(clickAreaX,clickAreaY,clickAreaW,clickAreaH).attr(clickAreaAttr);
      if(level == "hard"){
         paper.circle((x + wheelSize),handleRotCenter.y).attr(controlAttr).toBack();
         paper.path("M"+x+" "+(handleRotCenter.y - wheelSize)+",A"+wheelSize+" "+wheelSize+" 0 0 1 "+(x + wheelSize)+" "+handleRotCenter.y).attr(trajectoryAttr).toBack();
         handleControls[1] = paper.rect(clickAreaX + clickAreaW,clickAreaY,clickAreaW,clickAreaH).attr(clickAreaAttr);
         var xLabel = handleRotCenter.x;
         var yLabel = handleRotCenter.y - wheelSize - controlAttr.r - margin;
         paper.text(xLabel,yLabel,taskStrings.clickToTurn).attr(labelAttr);
      }else{
         var xLabel = handleRotCenter.x + controlAttr.r + margin;
         var yLabel = handleRotCenter.y - wheelSize;
         paper.text(xLabel,yLabel,taskStrings.clickToTurn).attr(labelAttr).attr("text-anchor","start");
      }

   };

   function initLowerHandle(x,y) {
      paper.setStart();
      paper.circle(x,y,wheelSize/4).attr("stroke-width",5);
      paper.circle(x,y - wheelSize,wheelSize/4).attr("stroke-width",5);
      paper.path("M"+(x - wheelSize/4)+" "+y+",V"+(y - wheelSize)).attr("stroke-width",4);
      paper.path("M"+(x + wheelSize/4)+" "+y+",V"+(y - wheelSize)).attr("stroke-width",4);
      lowerHandleRaph = paper.setFinish();
   };

   function initHandlers() {
      for(var iRow = 0; iRow < wheels.length; iRow++){
         for(var iCol = 0; iCol < wheels[iRow].length; iCol++){
            var wheel = wheelsRaph[iRow][iCol];
            if(wheel){
               addWheelHandler(iRow,iCol);
            }
         }
      }
      setControlsHandlers(true);
      if(level == "hard"){
         enableUndo(true);
      }
   };

   function initUndo() {
      var x = x0;
      var y = y0 + wheelSize *(1 + wheels.length) + 4*margin;
      var rect = paper.rect(x,y,undoButtonW,undoButtonH).attr(undoButtonAttr);
      var text = paper.text(x + undoButtonW/2,y + undoButtonH/2,taskStrings.undo).attr(labelAttr);
      undoButton = paper.set(rect,text);
      updateUndo();

      disconnectCounter = paper.text(x + undoButtonW + margin, y + undoButtonH/2,taskStrings.nbDisconnect(answer.nbDisconnect)).attr(labelAttr).attr("text-anchor","start");
   };

   function enableUndo(enable){
      if(enable){
         undoButton.unclick();
         undoButton.click(undo);
         undoButton.attr("cursor","pointer");
      }else{
         undoButton.unclick();
         undoButton.attr("cursor","auto");
      }
   }

   function undo() {
      var actions = answer.actions;
      if(actions.length > 0){
         var lastAction = actions.pop();
         if(lastAction.action == "lower"){
            var row = lastAction.row;
            var col = lastAction.col;
            lower(row,col,true)();
            if(lastAction.previous){
               var lastRow = lastAction.previous[0];
               var lastCol = lastAction.previous[1];
               if(lastRow != row || lastCol != col){
                  lower(lastRow,lastCol,true)();
               }
            }
         }else if(lastAction.action == "rotate"){
            rotateWheels(1 - lastAction.direction,true)();
         }
      }
      updateUndo();
   };

   function updateUndo() {
      if(undoButton){
         if(answer.actions.length > 0){
            undoButton.attr({"opacity":1,"cursor":"pointer"});
         }else{
            undoButton.attr({"opacity":0.5,"cursor":"auto"});
         }
      }
   };

   function updateCounter() {
      if(disconnectCounter){
         disconnectCounter.attr("text",taskStrings.nbDisconnect(answer.nbDisconnect));
      }
   };

   function setControlsHandlers(on) {
      for(var iControl = 0; iControl < handleControls.length; iControl++){
         var cont = handleControls[iControl];
         cont.unmousedown();
         if(on){
            cont.mousedown(rotateWheels(iControl));
            cont.attr("cursor","pointer");
         }else{
            cont.attr("cursor","auto");
         }
      }
   };

   function addWheelHandler(row,col) {
      var wheel = wheelsRaph[row][col];
      wheel.unclick();
      wheel.click(lower(row,col));
      wheel.attr("cursor","pointer");
   };

   function removeHandlers() {
      for(var iRow = 0; iRow < wheels.length; iRow++){
         for(var iCol = 0; iCol < wheels[iRow].length; iCol++){
            var wheel = wheelsRaph[iRow][iCol];
            if(wheel && (sourcePos[0] != iRow || sourcePos[1] != iCol)){
               wheel.unclick();
               wheel.attr("cursor","auto");
            }
         }
      }
      setControlsHandlers(false);
      if(level == "hard"){
         enableUndo(false);
      }
   };

   function drawWheel(type,x,y,lowered) {
      if(lowered){
         var r = loweredScale*wheelSize/2;
      }else{
         var r = wheelSize/2;
      }
      var circle = paper.circle(x,y,r-2*scaleUnit).attr(wheelAttr);
      switch(type){
         case 1:
            var path = "M"+(x + r)+" "+y+",H"+(x - r);
            break;
         case 2:
            var path = "M"+(x + r)+" "+y+",H"+x+",V"+(y - r);
            break;
         case 3:
            var path = "M"+(x + r)+" "+y+",H"+(x - r)+",M"+x+" "+y+",V"+(y - r);
      }
      var pipe = paper.path(path).attr(pipeAttr);
      if(lowered){
         pipe.attr("stroke-width",pipeWidth*loweredScale);
      }
      return paper.set(circle,pipe);
   };

   function drawSource() {
      var x = x0 + (sourcePos[1] + 1) * wheelSize/2;
      var y = y0 + (sourcePos[0] + 1.5) * wheelSize;
      var r = (wheelSize - margin)/2;
      paper.rect(x - margin - r,y - r,2*r,2*r).attr("fill",waterColor);
      paper.rect(x - margin + r, y - pipeWidth/2,2*margin - 4*scaleUnit,pipeWidth).attr("fill",waterColor).toBack();
      paper.rect(x - margin + r - 1*scaleUnit, y - pipeWidth/2 + 1*scaleUnit,2*margin - 4*scaleUnit,pipeWidth-2*scaleUnit).attr({fill:waterColor,stroke:"none"});
   };

   function drawBeavers() {
      for(var iBeav = 0; iBeav < beaverPos.length; iBeav++){
         var pos = beaverPos[iBeav];
         if(pos.side == "R"){
            var x = x0 + (pos.col + 2.5) * wheelSize;
            var y = y0 + wheelSize * (1.5 + pos.row);
            var xB = x;
            var yB = y - beaverSize/2;
            var pipe = paper.path("M"+(x - wheelSize/2)+" "+y+",H"+x).attr(pipeAttr);
         }else if(pos.side == "L"){
            var x = x0 + (pos.col + 1) * wheelSize/2;
            var y = y0 + (pos.row + 1.5) * wheelSize;
            var xB = x - beaverSize;
            var yB = y - beaverSize/2;
            var pipe = paper.path("M"+x+" "+y+",H"+(x + wheelSize/2)).attr(pipeAttr);
         }else if(pos.side == "T"){
            var x = x0 + (pos.col + 1.5) * wheelSize;
            var y = y0 + wheelSize/2;
            var xB = x - beaverSize/2;
            var yB = y - beaverSize;
            var pipe = paper.path("M"+x+" "+y+",V"+(y + wheelSize/2)).attr(pipeAttr);
         }
         var beaver = paper.image(beaverImageSrc,xB,yB,beaverSize,beaverSize);
         var waterOverlay = paper.circle(xB + beaverSize/2, yB + beaverSize/2, beaverSize/2).attr(waterOverlayAttr).toBack();
         beaverRaph[iBeav] = paper.set(beaver,pipe,waterOverlay);
      }
   };

   function lower(row,col,undo) {
      return function() {
         displayError("");
         resetWaterFlow();
         var lastAction = (answer.actions.length > 0) ? answer.actions[answer.actions.length - 1] : null;
         var low = answer.lowered;
         if(low){
            updateWheel(low[0],low[1],false);
         }
         if(!low || low[0] != row || low[1] != col){
            updateWheel(row,col,true);

            answer.lowered = [row,col];
         }else{
            answer.lowered = null;
         }
         if(!undo){
            var action = {action:"lower",row:row,col:col,previous:low};
            answer.actions.push(action);
            updateUndo();
         }
         getNbOfDisconnections();
         updateCounter();
         showWaterFlow();
         getRotatingWheels();
      }
   };

   function getNbOfDisconnections() {
      var actions = answer.actions;
      var count = 0;
      for(var iAction = 0; iAction < actions.length; iAction++){
         var action = actions[iAction];
         if(action.action == "lower"){
            var lastAction = (iAction > 0) ? actions[iAction - 1] : null;

            if(!lastAction || lastAction.action != "lower"){
               if(!action.previous || action.previous[0] != action.row || action.previous[1] != action.col){
                  count++;
               }
            }else if(lastAction && lastAction.action == "lower"){
               if(lastAction.row == action.row && lastAction.col == action.col && action.previous){
                  count--;
               }else if(!action.previous){
                  count++;
               }
            }
         }
      }
      answer.nbDisconnect = count;
   };

   function updateWheel(row,col,lowered) {
      var raph = wheelsRaph[row][col];
      var xc = raph[0].attr("cx");
      var yc = raph[0].attr("cy");
      var type = wheels[row][col];
      raph.remove();
      wheelsRaph[row][col] = drawWheel(type,xc,yc,lowered);
      wheelsRaph[row][col].transform("...r"+answer.rotation[row][col]*90+" "+xc+" "+yc);
      addWheelHandler(row,col);
      if(sourcePos[0] == row && sourcePos[1] == col){
         lowerHandleRaph.toFront();
      }
   };

   function rotateWheels(direction,undo) {
      return function(){
         displayError("");
         resetWaterFlow();
         var increment = (2 * direction - 1);
         for(var iRow = 0; iRow < rotatingWheels.length; iRow++){
            for(var iCol = 0; iCol < rotatingWheels[iRow].length; iCol++){
               if(rotatingWheels[iRow][iCol]){
                  if((iRow + iCol)%2 != (sourcePos[0] + sourcePos[1])%2){
                     var localIncrement = -increment;
                  }else{
                     var localIncrement = increment;
                  }
                  answer.rotation[iRow][iCol] = (answer.rotation[iRow][iCol] + localIncrement + 4)%4;
               }
            }
         }
         if(!undo){
            answer.actions.push({action:"rotate",direction:direction});
            updateUndo();
         }
         rotationAnim(rotatingWheels,direction,Beav.Navigator.isIE8());
      }
   };

   function getRotatingWheels() {
      rotatingWheels = [];
      var nonRotatingWheels = [];
      var low = answer.lowered;
      if(low){
         for(var iLine = 0; iLine < propagationLines.length; iLine++){
            var line = propagationLines[iLine];
            var lineObstructed = false;
            for(var iWheel = 0; iWheel < line.length; iWheel++){
               var pos = line[iWheel];
               if(lineObstructed || low[0] == pos[0] && low[1] == pos[1]){
                  addPosTo(nonRotatingWheels,pos);
                  lineObstructed = true;
               }
            }
         }
      }
      var rotating;
      for(var iRow = 0; iRow < wheels.length; iRow++){
         rotatingWheels[iRow] = [];
         for(var iCol = 0; iCol < wheels[iRow].length; iCol++){
            rotating = false;
            if(wheels[iRow][iCol] && !hasPos(nonRotatingWheels,[iRow,iCol])){
               rotating = true;
            }
            if(rotating){
               rotatingWheels[iRow][iCol] = true;
            }
         }
      }
      if(!rotatingWheels[sourcePos[0]][sourcePos[1]]){
         rotatingWheels[sourcePos[0]][sourcePos[1]] = true;
      }
   };

   function addPosTo(wheelsArr,pos) {
      if(hasPos(wheelsArr,pos)){
         return;
      }
      wheelsArr.push(pos);
   };

   function hasPos(posArr,pos) {
      for(var iPos = 0; iPos < posArr.length; iPos++){
         if(posArr[iPos][0] == pos[0] && posArr[iPos][1] == pos[1]){
            return true;
         }
      }
      return false;
   }

   function rotationAnim(rotatingWheels,direction,ie8) {
      removeHandlers();
      var angle = (2 * direction - 1) * 90;
      for(var iRow = 0; iRow < rotatingWheels.length; iRow++){
         for(var iCol = 0; iCol < rotatingWheels[iRow].length; iCol++){
            var wheel = wheelsRaph[iRow][iCol];
            if(rotatingWheels[iRow][iCol]){
               if((iRow + iCol)%2 != (sourcePos[0] + sourcePos[1])%2){
                  var rotAngle = -angle;
               }else{
                  var rotAngle = angle;
               }
               var xc = wheel[0].attr("cx");
               var yc = wheel[0].attr("cy");
               if(!ie8){
                  var anim = new Raphael.animation({transform: "...r"+rotAngle+" "+xc+" "+yc},animTime,function(){});
                  subTask.raphaelFactory.animate("anim_"+iRow+"_"+iCol,wheel,anim);
               }else{
                  var alpha = answer.rotation[iRow][iCol] * 90;
                  wheel.transform("r"+alpha+" "+xc+" "+yc);
               }
            }
         }
      }
      
      var animHandle = new Raphael.animation({transform:"r "+angle+" "+handleRotCenter.x+" "+handleRotCenter.y},animTime,function(){
         subTask.raphaelFactory.animate("anim_Handle2",handleRaph,animHandle2);
         showWaterFlow();
      });
      if(!ie8){
         var animHandle2 = new Raphael.animation({transform:"...r "+(-angle)+" "+handleRotCenter.x+" "+handleRotCenter.y},animTime,"<",function(){
            initHandlers();
         });
      }else{
         var animHandle2 = new Raphael.animation({transform:"...r 0 "+handleRotCenter.x+" "+handleRotCenter.y},animTime,function(){
            initHandlers();
         });
      }
      subTask.raphaelFactory.animate("anim_Handle",handleRaph,animHandle);
   };

   function showWaterFlow() {
      // var rot = answer.rotation;
      var low = answer.lowered;
      for(var iLine = 0; iLine < propagationLines.length; iLine++){
         var line = propagationLines[iLine];
         var lineObstructed = false;
         var flowing = true;
         for(var iWheel = 0; iWheel < line.length; iWheel++){
            var pos = line[iWheel];
            if(lineObstructed){
               flowing = false;
            }else if(low && low[0] == pos[0] && low[1] == pos[1]){
               flowing = false;
            }else{
               var connected = isConnectedToPreviousWheel(line,iWheel);
               if(!connected){
                  flowing = false;
               }else{
                  for(var iBeav = 0; iBeav < beaverPos.length; iBeav++){
                     beavPos = beaverPos[iBeav];
                     if(pos[0] == beavPos.row && pos[1] == beavPos.col){
                        if(isConnectedToPreviousWheel(line,iWheel,true,iBeav)){
                           beaverRaph[iBeav][1].attr("stroke",waterColor);
                           beaverRaph[iBeav][2].attr("opacity",1);
                        }
                     }
                  }
               }
            }
            if(flowing){
               wheelsRaph[pos[0]][pos[1]][1].attr("stroke",waterColor);
            }else{
               lineObstructed = true;
            }
         }
      }
   };

   function isConnectedToPreviousWheel(line,iWheel,beav,iBeav) {
      if(beav){
         var posRelativeToPrevious = beaverPos[iBeav].side;
         var previousPos = line[iWheel];
         var previousWheel = wheels[previousPos[0]][previousPos[1]];
         var previousRot = answer.rotation[previousPos[0]][previousPos[1]];
      }else if(iWheel == 0){
         var posRelativeToPrevious = "R";
         var previousWheel = 1;
         var previousRot = 0;
      }else{
         var previousPos = line[iWheel - 1];
         var previousWheel = wheels[previousPos[0]][previousPos[1]];
         var previousRot = answer.rotation[previousPos[0]][previousPos[1]];
         var posRelativeToPrevious;
      }
      var currentPos = line[iWheel];
      var currentWheel = (beav) ? "beav" : wheels[currentPos[0]][currentPos[1]];
      var currentRot = (beav) ? 0 : answer.rotation[currentPos[0]][currentPos[1]];

      // REVIEW: décider avec Mathias si on veut refactoriser ce code.
      //
      // Si on code les directions R=0, T=1, L=2, B=3,
      // Et qu'un type de roue est décrite par ses connecteurs, par ex pour un "T" horizontal on a [1,0,1,1]
      // alors la fonction permettant de savoir si une roue est connectée à sa voisine du côté dir est :
      // en utilisant un tableau auxiliaire des déplacements dirs = [[1,0],[0,-1],[-1,0],[0,1]]
      //
      //   wheelHasPipeInDir(idWheel, dir) {
      //      rot = wheelRot[idWheel]  // entre 0 en 3
      //      wheel = getWheelDescr(idWheel)  // par ex  [1,0,1,1] pour un T
      //      return wheel[(dir+rot)%4]
      //
      //   wheelIsConnectedInDir(idWheel1, dir1) {
      //      p = idWheel1.pos
      //      d = dirs[dir1]
      //      idWheel2 = wheels[ p[0]+d[0] ][ p[1]+d[1] ]
      //      dir2 = (dir1+2)%4 // direction opposée
      //      return hasPipeInDir(idWheel1, dir1) && hasPipeInDir(idWheel2, dir2)

      if(iWheel != 0 && !beav){
         if(previousPos[0] == currentPos[0]){
            if(previousPos[1] > currentPos[1]){
               posRelativeToPrevious = "L";
            }else{
               posRelativeToPrevious = "R"
            }
         }else{
            if(previousPos[0] < currentPos[0]){
               posRelativeToPrevious = "B";
            }else{
               posRelativeToPrevious = "T"
            }
         }
      }
      if(previousWheel == 1) {
         if(previousRot%2 == 0){
            if(posRelativeToPrevious == "R" || posRelativeToPrevious == "L"){
               return isConnected(currentWheel,currentRot,posRelativeToPrevious);
            }
         }else{
            if(posRelativeToPrevious == "T" || posRelativeToPrevious == "B"){
               return isConnected(currentWheel,currentRot,posRelativeToPrevious);
            }
         }
      }else if(previousWheel == 2){
         switch(previousRot%4){
            case 0:
               if(posRelativeToPrevious == "R" || posRelativeToPrevious == "T"){
                  return isConnected(currentWheel,currentRot,posRelativeToPrevious);
               }
               break;
            case 1:
            case -3:
               if(posRelativeToPrevious == "R" || posRelativeToPrevious == "B"){
                  return isConnected(currentWheel,currentRot,posRelativeToPrevious);
               }
               break;
            case 2:
            case -2:
               if(posRelativeToPrevious == "L" || posRelativeToPrevious == "B"){
                  return isConnected(currentWheel,currentRot,posRelativeToPrevious);
               }
               break;
            case 3:
            case -1:
               if(posRelativeToPrevious == "L" || posRelativeToPrevious == "T"){
                  return isConnected(currentWheel,currentRot,posRelativeToPrevious);
               }
               break;
         }
      }else if(previousWheel == 3){
         switch(previousRot%4){
            case 0:
               if(posRelativeToPrevious == "R" || posRelativeToPrevious == "T" || posRelativeToPrevious == "L"){
                  return isConnected(currentWheel,currentRot,posRelativeToPrevious);
               }
               break;
            case 1:
            case -3:
               if(posRelativeToPrevious == "R" || posRelativeToPrevious == "T" || posRelativeToPrevious == "B"){
                  return isConnected(currentWheel,currentRot,posRelativeToPrevious);
               }
               break;
            case 2:
            case -2:
               if(posRelativeToPrevious == "R" || posRelativeToPrevious == "B" || posRelativeToPrevious == "L"){
                  return isConnected(currentWheel,currentRot,posRelativeToPrevious);
               }
               break;
            case 3:
            case -1:
               if(posRelativeToPrevious == "L" || posRelativeToPrevious == "T" || posRelativeToPrevious == "B"){
                  return isConnected(currentWheel,currentRot,posRelativeToPrevious);
               }

               break;
         }
      }
      return false;

   };

   function isConnected(wheel,rot,side) {
      // REVIEW[ARNAUD]:
      //  Utiliser l'astuce "(x%modulo + modulo) % modulo" pour avoir toujours une valeur positive.
      //  De plus, si on maintient l'invariant rot>=0, on n'a pas le pb, pour cela, il suffit de faire
      //     rot = (rot+increment+4)%4  lorsqu'on fait tourner une roue, ça marche si increment = -1 ou +1.
      // => fait
      switch(wheel){
         case 1:
            if(side == "T" || side == "B"){
               return rot%2 != 0;
            }else{
               return rot%2 == 0;
            }
            break;
         case 2:
            if(side == "R"){
               return (rot%4 == 3 || rot%4 == 2);
            }
            if(side == "L"){
               return (rot%4 == 1 || rot%4 == 0);
            }
            if(side == "B"){
               return (rot%4 == 0 || rot%4 == 3);
            }
            if(side == "T"){
               return (rot%4 == 2 || rot%4 == 1);
            }
            break;
         case 3:
            if(side == "R"){
               return (rot%4 != 1);
            }
            if(side == "L"){
               return (rot%4 != 3);
            }
            if(side == "T"){
               return (rot%4 != 0);
            }
            if(side == "B"){
               return (rot%4 != 2);
            }
            break;
         case "beav":
            return true;
      }
   };

   function resetWaterFlow() {
      for(var iRow = 0; iRow < wheelsRaph.length; iRow++){
         for(var iCol = 0; iCol < wheelsRaph[iRow].length; iCol++){
            if(wheelsRaph[iRow][iCol]){
               wheelsRaph[iRow][iCol][1].attr("stroke",pipeColor);
            }
         }
      }
      for(var iBeav = 0; iBeav < beaverRaph.length; iBeav++){
         beaverRaph[iBeav][1].attr("stroke",pipeColor);
         beaverRaph[iBeav][2].attr("opacity",0);
      }
   };

   function matchTarget(row,col) {
      var type = wheels[row][col];
      var targetVal = target[row][col];
      var currentVal = answer.rotation[row][col];

      // REVIEW[ARNAUD]:QUESTION: est-ce que tu confirmes que l'ensemble du code ci-dessous est je crois équivalent à :
      //   var modulo = (type == 1) ? 2 : 4;
      //   return (currentVal+modulo)%modulo == targetVal;
      // (D'ailleurs, le "+modulo" n'est pas utile si on maintient l'invariant que les rotations sont >= 0)
      // => fait

      var modulo = (type == 1) ? 2 : 4;
      return currentVal%modulo == targetVal;
   };


   function checkResult(noVisual) {
      if(answer.lowered){
         if(!noVisual){
            lower(answer.lowered[0],answer.lowered[1])();
         }else{
            answer.lowered = null;
         }
      }
      var rot = answer.rotation;
      for(var iRow = 0; iRow < wheels.length; iRow++){
         for(var iCol = 0; iCol < wheels[iRow].length; iCol++){
            if(wheels[iRow][iCol]){
               if(!matchTarget(iRow,iCol)){
                  var msg = taskStrings.wrong(beaverPos.length);
                  if(!noVisual){
                     displayError(msg);
                  }
                  return { successRate: 0, message: msg };
               }
            }
         }
      }

      if(noVisual){
         if(level == "hard" && answer.nbDisconnect > minDisconnect){
            var extraDisconnect = answer.nbDisconnect - minDisconnect;
            var score = Math.max(0.5, 1 - extraDisconnect * 0.2);
            return { successRate: score, message: taskStrings.tooManyDisconnect };
         }else{
            return { successRate: 1, message: taskStrings.success };
         }
      }else{
         platform.validate("done");
      }
   };

   function displayError(msg) {
      $("#error").text(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
