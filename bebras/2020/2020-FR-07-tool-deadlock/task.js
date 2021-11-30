function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var rng;
   var data = {
      easy: {
         lineLength: 17,
         toolSeq: [
            [
               { type: 0, size: 3, startPos: 0 },
               { type: 2, size: 3, startPos: 4 },
               { type: 1, size: 4, startPos: 8 }
            ],
            [
               { type: 1, size: 4, startPos: 0 },
               { type: 2, size: 2, startPos: 4 },
               { type: 1, size: 2, startPos: 6 },
               { type: 0, size: 2, startPos: 8 },
               { type: 1, size: 3, startPos: 11 }
            ]
         ]
      },
      medium: {
         lineLength: 10,
         toolSeq: [
            [
               { type: 2, size: 1, startPos: 0 },
               { type: 0, size: 1, startPos: 1 },
               { type: 2, size: 2, startPos: 3 },
               { type: 1, size: 2, startPos: 5 },
               { type: 2, size: 1, startPos: 7 }
            ],
            [
               { type: 1, size: 3, startPos: 0 },
               { type: 2, size: 2, startPos: 3 },
               { type: 0, size: 3, startPos: 5 }
            ],
            [
               { type: 0, size: 1, startPos: 0 },
               { type: 1, size: 1, startPos: 1 },
               { type: 0, size: 1, startPos: 3 },
               { type: 1, size: 1, startPos: 4 },
               { type: 0, size: 1, startPos: 5 },
               { type: 1, size: 2, startPos: 7 }
            ]
         ]
      },
      hard: {
         lineLength: 16,
         toolSeq: [
            [
               { type: 1, size: 5, startPos: 1 },
               { type: 2, size: 2, startPos: 6 },
               { type: 0, size: 2, startPos: 9 }
            ],
            [
               { type: 1, size: 3, startPos: 0 },
               { type: 2, size: 1, startPos: 3 },
               { type: 0, size: 3, startPos: 4 },
               { type: 2, size: 1, startPos: 8 },
               { type: 0, size: 5, startPos: 9 },
               { type: 1, size: 2, startPos: 14 }
            ],
            [
               { type: 0, size: 2, startPos: 0 },
               { type: 1, size: 1, startPos: 2 },
               { type: 0, size: 1, startPos: 3 },
               { type: 2, size: 3, startPos: 5 },
               { type: 1, size: 2, startPos: 8 },
               { type: 2, size: 4, startPos: 11 }
            ],
            [
               { type: 2, size: 1, startPos: 0 },
               { type: 0, size: 1, startPos: 3 },
               { type: 2, size: 1, startPos: 4 },
               { type: 1, size: 3, startPos: 6 },
               { type: 2, size: 1, startPos: 10 }
            ]
         ]
      }
   };
   // LATER: DEPRECATED support for displaying toolbox

   var paper;
   var paperW = 770;
   var paperH;
   var marginY = 20;
   //var toolboxW = 131;
   //var toolboxH = 72;
   //var xToolbox = (paperW - toolboxW)/2;
   //var yToolbox = marginY;
   var toolW = [31,31,31];
   var toolH = [31,31,31];
   var beaverW = 44;
   var beaverH = 40;
   var cellSize = 38;
   var marginYLines = 30;

   var x0Beaver;
   var y0Beaver = /*yToolbox + toolboxH +*/ marginY;
   var x0Line;
   var y0Line = y0Beaver;
   var lineW;
   var crossW = 18;
   var crossH = 19;
   var buttonH = 35;
   var buttonW = 160;
   var xUndo = (paperW - buttonW) * .75;
   var yUndo;

   var tools = [];
   var toolSeq;
   var toolBlocks = [];
   var nbTools = 3;
   var lineLength;
   var nbLines;
   var dragData;
   var animLine;
   var animTime = 200;
   var beaverTools = [];
   var iconSize = 15;
   var undoButton;
   var history = [];

   var undoSrc = $("#undo").attr("src");
   var beaverSrc = $("#beaver").attr("src");
   var crossSrc = $("#cross").attr("src");
   var origToolSrc = [ $("#hammer").attr("src"), $("#screwdriver").attr("src"), $("#saw").attr("src") ];
   var toolPerm;
   var toolSrc;

   var colors = {
      grey: "#e5e5e5",
      darkGrey: "#cdcdcd",
      blue: "#4a90e2",
      lightBlue: "#8fc7ff",
      darkBlue: "#2e5e95",
      pink: "#ff8fbe",
      orange: "#ffb336"
   };

   var lineBackgroundAttr = {
      stroke: colors.darkGrey,
      "stroke-width": 2,
      fill: colors.grey,
      r: 7
   };
   var cellLineAttr = {
      stroke: colors.darkGrey,
      "stroke-width": 2
   };
   var origToolBlockAttr = [
      {
         stroke: "none",
         fill: colors.orange,
         r: 7
      },
      {
         stroke: "none",
         fill: colors.lightBlue,
         r: 7
      },
      {
         stroke: "none",
         fill: colors.pink,
         r: 7
      }
   ];
   var toolBlockAttr;
   var animLineAttr = {
      stroke: colors.darkBlue,
      "stroke-width": 3
   };
   var buttonAttr = {
      rect: {
         stroke: "none",
         fill: colors.blue,
         r: buttonH/2
      },
      text: {
         "font-size": 13,
         "font-weight": "bold",
         fill: "white"
      }
   };


   subTask.loadLevel = function (curLevel) {
      level = curLevel;

      rng = new RandomGenerator(subTask.taskParams.randomSeed + level.charCodeAt(0));
      toolPerm = rng.generateSafePermutation(origToolSrc.length);
      toolSrc = [];
      toolBlockAttr = [];
      for(var i = 0 ; i < toolPerm.length; i++) {
         toolSrc.push(origToolSrc[toolPerm[i]]);
         toolBlockAttr.push(origToolBlockAttr[toolPerm[i]]);
      }

      lineLength = data[level].lineLength;
      toolSeq = data[level].toolSeq;
      nbLines = toolSeq.length;
      x0Beaver = 8; // (paperW - (lineLength + 2)*cellSize)/2;
      x0Line = x0Beaver + 3*cellSize;
      lineW = lineLength*cellSize;
      yUndo = y0Line + (cellSize + marginYLines)*nbLines + marginYLines;
      paperH = yUndo + buttonH + marginY;
      initHistory();

   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      // answer = {"blockPos":[[0,4,6],[0,8,10,12,14]]};
      if(!answer) {
         return;
      }
      // rng.reset(answer.seed);
   };

   subTask.resetDisplay = function () {
      displayError("");
      initPaper();
      initLines();
      initUndo();
      initHandlers();

      displayHelper.customValidate = checkResult;
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
      var defaultAnswer = history[0];
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result
   };

   subTask.unloadLevel = function (callback) {
      subTask.raphaelFactory.destroy("anim");
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initHistory() {
      var blockPos = [];
      for(var iLine = 0; iLine < nbLines; iLine++){
         blockPos[iLine] = [];
         var lineSeq = toolSeq[iLine];
         for(var iBlock = 0; iBlock < lineSeq.length; iBlock++){
            var blockData = lineSeq[iBlock];
            blockPos[iLine][iBlock] = blockData.startPos;
         }
      }
      history[0] = { blockPos: blockPos };
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);

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
               w = paperW;
               h = y0Beaver; 
               break;
            case 2:
               x = 0; y = y0;
               w = x0Line;
               h = paperH - y + y0; 
               break;
            case 3:
               x = 0; 
               y = y0 + y0Beaver + cellSize;
               w = paperW;
               h = marginYLines; 
               break;
            case 4:
               x = 0; 
               y = y0 + y0Beaver + 2*cellSize + marginYLines;
               w = paperW;
               h = (level == "easy") ? yUndo - y + y0 : marginYLines; 
               break;
            case 5:
               x = 0; 
               y = y0 + y0Beaver + 3*cellSize + 2*marginYLines;
               w = (level == "easy") ? 0 : paperW;
               h = (level == "medium") ? yUndo - y + y0 : marginYLines; 
               break;
            case 6:
               x = 0; 
               y = y0 + y0Beaver + 4*cellSize + 3*marginYLines;
               w = paperW;
               h = (level == "hard") ? yUndo - y + y0 : 0; 
               break;
            case 7:
               x = 0; 
               y = y0 + yUndo;
               w = xUndo;
               h = buttonH; 
               break;
            case 8:
               x = 0; 
               y = y0 + yUndo + buttonH;
               w = paperW;
               h = paperH - y + y0; 
               break;
            case 9:
               x = x0Line + lineLength*cellSize; 
               y = y0;
               w = paperW - x;
               h = yUndo; 
               break;
            case 10:
               x = xUndo + buttonW; 
               y = y0 + yUndo;
               w = paperW - x;
               h = buttonH; 
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

   function initLines() {
      for(var iLine = 0; iLine < nbLines; iLine++){
         var x = x0Beaver;
         var y = y0Beaver + (cellSize + marginYLines)*iLine;
         paper.image(beaverSrc,x,y,beaverW,beaverH);

         var xLine = x0Line;
         var yLine = y;
         paper.rect(xLine,yLine,lineW,cellSize).attr(lineBackgroundAttr);
         for(var iCell = 1; iCell < lineLength; iCell++){
            var xCellLine = xLine + iCell*cellSize;
            paper.path("M"+xCellLine+" "+yLine+",V"+(yLine + cellSize)).attr(cellLineAttr);
         }
      }
      initToolBlocks();
   };

   function initToolBlocks() {
      // var lastMove = answer.history[answer.history.length - 1];
      for(var iLine = 0; iLine < nbLines; iLine++){
         var x = x0Line;
         var y = y0Line + (cellSize + marginYLines)*iLine;
         var lineSeq = toolSeq[iLine];
         toolBlocks[iLine] = [];
         for(var iBlock = 0; iBlock < lineSeq.length; iBlock++){
            var blockData = lineSeq[iBlock];
            var pos = answer.blockPos[iLine][iBlock];
            var xBlock = x + pos*cellSize;
            toolBlocks[iLine][iBlock] = drawBlock(xBlock,y,blockData);
         }
      }
   };

   function initUndo() {
      var attr = buttonAttr;
      var rect = paper.rect(xUndo,yUndo,buttonW,buttonH).attr(attr.rect);
      var xText = xUndo + buttonW/2;
      var yText = yUndo + buttonH/2;
      var text = paper.text(xText,yText,taskStrings.undo.toUpperCase()).attr(attr.text);
      var xIcon = xUndo + 20;
      var yIcon = yText - iconSize/2;
      var icon = paper.image(undoSrc,xIcon,yIcon,iconSize,iconSize);
      undoButton = paper.set(rect,text,icon);
   };

   function initHandlers() {
      for(var iLine = 0; iLine < nbLines; iLine++){
         var lineBlocks = toolBlocks[iLine];
         for(var iBlock = 0; iBlock < lineBlocks.length; iBlock++){
            var raph = lineBlocks[iBlock];
            raph.drag(onMove,onStart(iLine,iBlock),onEnd);
            raph.attr("cursor","grab");
         }
      }
      undoButton.unclick();
      undoButton.click(undo);
      undoButton.attr("cursor","pointer");
   };

   function onStart(line,blockID) {
      return function(x,y,ev) {
         displayError("");
         dragData = { line: line, id: blockID, pushed: {}, move: false };
      }
   };

   function onMove(dx,dy,x,y,ev) {
      dragData.move = true;
      var line = dragData.line;
      var id = dragData.id;
      // var lastMove = answer.history[answer.history.length - 1];
      var startPos = answer.blockPos[line][id];
      var startX = x0Line + startPos*cellSize;
      var spaceLeft = getSpace(line,id,0);
      var spaceRight = getSpace(line,id,1);
      var minX = startX - spaceLeft*cellSize;
      var maxX = startX + spaceRight*cellSize;
      var newX = startX + dx;
      if(newX < minX){
         newX = minX;
      }else if(newX > maxX){
         newX = maxX;
      }
      var newPos = startPos + Math.round((newX - startX)/cellSize);
      newX = x0Line + newPos*cellSize;

      var lineSeq = toolSeq[line];
      var type = lineSeq[id].type;
      var size = lineSeq[id].size;
      moveBlock(line,id,newX);
      dragData.newPos = newPos;

      if(id < lineSeq.length - 1){
         var rightX = newX + size*cellSize;
         for(var iBlock = id + 1; iBlock < lineSeq.length; iBlock++){
            var blockData = lineSeq[iBlock];
            var blockRaph = toolBlocks[line][iBlock];
            if(blockRaph[0].attr("x") < rightX){
               var newBlockPos = Math.round((rightX - x0Line)/cellSize);
               moveBlock(line,iBlock,rightX);
               dragData.pushed[iBlock] = newBlockPos;
            }
            rightX += blockData.size*cellSize;
         }
      }
      if(id > 0){
         var leftX = newX;
         for(var iBlock = id - 1; iBlock >= 0; iBlock--){
            var blockData = lineSeq[iBlock];
            var blockW = blockData.size*cellSize;
            var blockRaph = toolBlocks[line][iBlock];
            if(blockRaph[0].attr("x") + blockW > leftX){
               var newBlockX = leftX - blockW;
               var newBlockPos = Math.round((newBlockX - x0Line)/cellSize);
               moveBlock(line,iBlock,newBlockX);
               dragData.pushed[iBlock] = newBlockPos;
            }
            leftX = newBlockX;
         }
      }

   };

   function onEnd(ev) {
      if(!dragData.move){
         return
      }
      var line = dragData.line;
      var id = dragData.id;
      // var lastMove = answer.history[answer.history.length - 1];
      // var newMove = JSON.parse(JSON.stringify(answer));
      answer.blockPos[line][id] = dragData.newPos;

      for(var blockID in dragData.pushed){
         answer.blockPos[line][blockID] = dragData.pushed[blockID];
      }
      history.push(JSON.parse(JSON.stringify(answer)));
   };

   function moveBlock(line,id,x) {
      var blockData = toolSeq[line][id];
      var size = blockData.size;
      var type = blockData.type;

      var toolX = x + (size*cellSize - toolW[type])/2;
      toolBlocks[line][id][0].attr("x",x);
      toolBlocks[line][id][1].attr("x",toolX);
   };

   function getSpace(line,block,dir) {
      // var lastMove = answer.history[answer.history.length - 1];
      var lineSeq = toolSeq[line];
      if(dir == 0){
         var space = answer.blockPos[line][block];
         for(var iBlock = 0; iBlock < block; iBlock++){
            var blockData = lineSeq[iBlock];
            space -= blockData.size;
         }
      }else{
         var space = lineLength - answer.blockPos[line][block];
         for(var iBlock = block; iBlock < lineSeq.length; iBlock++){
            var blockData = lineSeq[iBlock];
            space -= blockData.size;
         }
      }
      return space
   };

   function drawBlock(x,y,blockData) {
      var type = blockData.type;
      var size = blockData.size;
      var w = size*cellSize;
      var h = cellSize;
      var rect = paper.rect(x,y,w,h).attr(toolBlockAttr[type]);
      var xTool = x + (w - toolW[type])/2;
      var yTool = y + (h - toolH[type])/2;
      var tool = paper.image(toolSrc[type],xTool, yTool, toolW[type], toolH[type]);
      return paper.set(rect,tool)
   };

   function undo() {
      displayError("");
      subTask.simulationFactory.destroy("sim");
      if(history.length > 1){
         history.pop();
         answer = history[history.length - 1];
         loadLastMove();
      }
   };

   function loadLastMove() {
      // var lastMove = answer.history[answer.history.length - 1];
      for(var iLine = 0; iLine < nbLines; iLine++){
         var lineSeq = toolSeq[iLine];
         for(var iBlock = 0; iBlock < lineSeq.length; iBlock++){
            var blockData = lineSeq[iBlock];
            var size = blockData.size;
            var type = blockData.type;
            var pos = answer.blockPos[iLine][iBlock];
            var x = x0Line + pos*cellSize;
            var toolX = x + (size*cellSize - toolW[type])/2;
            toolBlocks[iLine][iBlock][0].attr("x",x);
            toolBlocks[iLine][iBlock][1].attr("x",toolX);
         }
      }
   };

   function eq(val1,val2){
      return (val1 == val2)
   };

   function checkResult(noVisual) {
      if(!noVisual){
         if(animLine){
            animLine.remove();
         }
         var y1 = y0Line - 5;
         var y2 = y0Line + nbLines*(cellSize + marginYLines) - 5;
         animLine = paper.path("M"+x0Line+" "+y1+",V"+y2).attr(animLineAttr);
         // if(sim)
            // sim.gotoAndStop(0);
         subTask.simulationFactory.destroy("sim");
         var sim = subTask.simulationFactory.create("sim");
         // sim.gotoAndStop(0);
         var simStep = new SimulationStep();
      }

      var error = null;
      for(var iCell = 0; iCell < lineLength; iCell++){
         var usedTools = [];
         for(var iLine = 0; iLine < nbLines; iLine++){
            var currTool = findTool(iLine,iCell);
            usedTools[iLine] = null;
            if(currTool != null){
               var iLineAlreadyUsed = Beav.Array.indexOf(usedTools,currTool,eq); // or -1
               if (iLineAlreadyUsed == -1) { // no conflict
                  usedTools[iLine] = currTool;
               } else { // conflict
                  if (error == null) { // generate at most one error
                     // if iLine was already using the tool at the previous time step,
                     // then the error should be located on line iLineAlreadyUsed, and not on iLine
                     if (iCell > 0 && findTool(iLine,iCell-1) == currTool) {
                        var iLineErr = iLineAlreadyUsed;
                        usedTools[iLineErr] = -1;
                        usedTools[iLine] = currTool;
                     } else {
                        var iLineErr = iLine;
                     }
                     error = taskStrings.sameTool(iLineErr, toolPerm[currTool]);
                     usedTools[iLineErr] = -1;
                  }
               }
            }
         }
         if(!noVisual){
            var duration = (error) ? 100 : animTime;
            var simAction = {
               onExec: translateLine,
               duration: duration,
               params: {
                  cell: iCell,
                  error: error,
                  final: (iCell == lineLength - 1),
                  usedTools: usedTools.slice()
               }
            }
            var simEntry = {
               name: "entry"+iCell,
               action: simAction
            };
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

      return { successRate: 1, message: taskStrings.success }

   };

   function findTool(line,cell) {
      // var lastMove = answer.history[answer.history.length - 1];
      var lineBlocks = answer.blockPos[line];
      for(var iBlock = 0; iBlock < lineBlocks.length; iBlock++){
         var blockData = toolSeq[line][iBlock];
         var size = blockData.size;
         var pos = lineBlocks[iBlock];
         if(pos > cell){
            return null;
         }
         if(pos + size > cell){
            return blockData.type;
         }
      }
      return null
   };

   function translateLine(params, duration, callback) {
      var tx = (params.error) ? cellSize*params.cell : cellSize*(params.cell + 1);
      var anim = new Raphael.animation({transform: "t"+tx+" 0"},duration,callback);
      subTask.raphaelFactory.animate("anim",animLine,anim);
      for(var iLine = 0; iLine < nbLines; iLine++){
         if(beaverTools[iLine]){
            beaverTools[iLine].remove();
         }
         if(tool == null){
            beaverTools[iLine] = null;
         }
         var tool = params.usedTools[iLine];
         var yTool0 = y0Beaver + iLine*(cellSize + marginYLines) + cellSize/2;
         if (tool != null) {
            if(tool != -1){
               var w = toolW[tool];
               var h = toolH[tool];
               var src = toolSrc[tool];
               var xTool = x0Beaver + beaverW + (cellSize - w)/2;
               var yTool = yTool0 - h/2;
            }else{
               var w = crossW;
               var h = crossH;
               var src = crossSrc;
               var xTool = x0Line + tx + 5;
               var yTool = yTool0 + h + 2;
            }
            beaverTools[iLine] = paper.image(src,xTool,yTool,w,h);
         }
      }
      return {
         stop: function() {
            if(params.error){
               displayError(params.error);
               subTask.simulationFactory.destroy("sim");
            }else if(params.final){
               subTask.simulationFactory.destroy("sim");
               platform.validate("done");
            }
         }
      }
   };

   function displayError(msg) {
      $("#displayHelper_graderMessage").html(msg);
      if(!msg){
         subTask.raphaelFactory.destroy("anim");
         subTask.simulationFactory.destroy("sim");
      }
      if(!msg && animLine){
         animLine.remove();
         animLine = null;
         for(var iLine = 0; iLine < nbLines; iLine++){
            if(beaverTools[iLine]){
               beaverTools[iLine].remove();
            }
         }
      }

   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
