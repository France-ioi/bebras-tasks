function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var rng;
   var data = {
      easy: {
         seq: [0,0,1,0,0,1,1,1,0,0,1,0],
         nbOptimal: 3
      },
      medium: {
         seq: [0,3,0,1,1,0,0,3,1,0,1,1],
         nbOptimal: 3
      },
      hard: {
         seq: [0, 2, 1, 0, 3, 0, 2, 3, 1, 2, 1, 1, 3, 0, 3],
         nbOptimal: 5
      }
   };

   var paper;
   var paperW = 770;
   var paperH;
   var marginX = 20;
   var marginY = 80;
   var cellW = 50;
   var cellH = cellW;
   var shapeR = cellW/2 - 7;
   var xGrid, yGrid;
   var buttonW = 230;
   var buttonH = 35;
   var iconSize = 15;
   var xUndo, yUndo;
   var xCounter, yCounter;

   var seq, nbCells;
   var grid;
   var shapes;
   var nbOptimal;
   var animTime = 500;
   var counter;
   var undoButton;
   var sim;
   var undoSrc = $("#undo").attr("src");

   var colors = {
      black: "#4a4a4a",
      grey: "#c6c7c9",
      blue: "#4a90e2",
      yellow: "#f5a623",
      pink: "#e24a84",
      purple: "#9d62f1",
      cyan: "#4ae2d1"
   };
   var origShapeNames = [ "hexagon", "star", "pentagon", "reverseTriangle" ];
   var origShapeColor = [ "yellow", "pink", "purple", "cyan" ];
   var shapeNames, shapeColor;

   var dragThreshold = 10;
   var selectionMargins = {
      left: 10,
      right: 10,
      top: 10,
      bottom: 10
   };

   var lineAttr = {
      stroke: colors.black,
      "stroke-width": 1
   };
   var selectionBoxAttr = {
      stroke: colors.blue,
      "stroke-width": 3,
      opacity: 0.5
   };
   var rectAttr = {
      stroke: "none",
      fill: "white"
   };
   var selectedRectAttr = {
      stroke: "none",
      fill: colors.grey
   };
   var trajAttr = {
      stroke: "red",
      "stroke-width": 2,
      "arrow-end": "classic-long-wide",
      opacity: 0
   };
   var counterAttr = {
      "font-size": 16,
      "font-weight": "bold",
      fill: colors.black
   };
   var buttonAttr = {
      stroke: "none",
      fill: colors.blue,
      width: buttonW,
      height: buttonH,
      r: buttonH/2
   };
   var buttonTextAttr = {
      "font-size": 13,
      "font-weight": "bold",
      fill: "white"
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      rng = new RandomGenerator(subTask.taskParams.randomSeed + level.charCodeAt(0));
      seq = data[level].seq.slice();
      nbOptimal = data[level].nbOptimal;
      nbCells = seq.length;

      paperH = nbCells*cellH*0.7;
      xGrid = (paperW - cellW*nbCells)/2;
      yGrid = (paperH - cellH)/2;
      yButton = yGrid + cellH + marginY;
      yCounter = yButton + buttonH/2;
      xButton = 0.75*paperW - buttonW/2;
      xCounter = 0.25*paperW;

      shapeNames = $.extend([], origShapeNames);
      rng.safeShuffle(shapeNames);
      shapeColor = $.extend([], origShapeColor);
      rng.safeShuffle(shapeColor);
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      replayHistory();
      rng.reset(answer.seed);
   };

   subTask.resetDisplay = function() {
      displayError("");
      initPaper();
      initUndo();
      initHandlers();
      updateCounter();
      if(answer.waitingForRestart){
         checkResult();
      }
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
         seed: rng.nextInt(0, 1000),
         history: [],
         waitingForRestart: false
      };

      return defaultAnswer;
   };

   var getResultAndMessage = function() {
      var result = checkResult(true);
      return result
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper", "paper", paperW, paperH);
      grid = Grid.fromArray("paper", paper, [seq], cellFiller, cellW, cellH, xGrid, yGrid, lineAttr);

      var x,y,w,h;
      $("#zone_2").css("position","relative");
      $("#zone_2").css("padding-top","1px");
      var y0 = 16;
      for(var iOver = 1; iOver <= 6; iOver++){
         var id = "overlay_"+iOver;
         $("#zone_2 #"+id).remove();
         $("#zone_2").append("<div id=\""+id+"\"></div>");
         switch(iOver){
            case 1:
               x = 0;
               y = y0;
               w = paperW;
               h = yGrid;
               break;
            case 2:
               x = xGrid + nbCells*cellW;
               y = y0;
               w = xGrid;
               h = paperH;
               break;
            case 3:
               x = 0;
               y = y0 + yGrid + cellH;
               w = paperW;
               h = yButton - (yGrid + cellH);
               break;
            case 4:
               x = 0;
               y = y0;
               w = xGrid;
               h = paperH;
               break;
            case 5:
               x = xGrid;
               y = y0 + yGrid + cellH;
               w = xButton - xGrid;
               h = paperH - y + y0;
               break;
            case 6:
               x = xButton;
               y = y0 + yButton + buttonH;
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

   function initUndo() {
      var rect = paper.rect(xButton,yButton).attr(buttonAttr);
      var xText = xButton + buttonW/2;
      var yText = yCounter;
      var text = paper.text(xText,yText,taskStrings.undo.toUpperCase()).attr(buttonTextAttr);
      var xIcon = xButton + 20;
      var yIcon = yText - iconSize/2;
      var icon = paper.image(undoSrc,xIcon,yIcon,iconSize,iconSize);
      undoButton = paper.set(rect,text,icon);
   };

   var initHandlers = function() {
      updateUndo();
      grid.enableDragSelection(onMouseDown, null, onMouseUp, onGridSelectionChange, selectionBoxAttr, selectionMargins, dragThreshold);
   };

   function undo() {
      displayError("");
      subTask.simulationFactory.destroy("sim");
      if(answer.history.length == 0) {
         return;
      }
      answer.history.pop();
      replayHistory();
      updateGrid();
      updateUndo();
      updateCounter();
   };

   function updateUndo() {
      undoButton.unclick();
      if(answer.history.length > 0) {
         undoButton.click(undo);
         undoButton.attr("cursor","pointer");
         undoButton[0].attr("opacity",1);
      } else {
         undoButton.attr("cursor","auto");
         undoButton[0].attr("opacity",0.5);
      }
   };


   var onMouseDown = function() {
      displayError("");
   };

   var onMouseUp = function(event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos) {
      if(sim && sim.isPlaying()){
         return
      }
      if(currentGridPos == null) {
         updateGrid();
         return
      }

      var startPos = anchorGridPos;
      var endPos = currentGridPos;
      if(!startPos || !endPos){
         return
      }
      start = Math.max(Math.min(startPos.col,nbCells - 1),0);
      end = Math.max(Math.min(endPos.col,nbCells - 1),0);
      if(start == end){
         grid.getCell(0, start)[0].attr(rectAttr);
         return
      }
      var min = Math.min(start,end);
      var max = Math.max(start,end);
      answer.history.push([min,max]);
      updateSeq([min,max]);
      moveShapes([min,max]);
      updateCounter();
      updateUndo();
   };

   var onGridSelectionChange = function(dx, dy, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos) {
      if(sim && sim.isPlaying()){
         return
      }
      var start = anchorGridPos;
      var end = currentGridPos;
      if(!start || !end){
         return
      }

      for(var col = 0; col < nbCells; col++) {
         if(col >= start.col && col <= end.col || col <= start.col && col >= end.col){
            grid.getCell(0, col)[0].attr(selectedRectAttr);
         }else{
            grid.getCell(0, col)[0].attr(rectAttr);
         }
      }
   };

   function updateCounter() {
      var text = taskStrings.counter+" "+answer.history.length;
      if(!counter){
         counter = paper.text(xCounter,yCounter,text).attr(counterAttr);
      }else{
         counter.attr("text",text);
      }
   };

   function updateSeq(lastMove) {
      var start = lastMove[0];
      var end = lastMove[1];
      var tempSeq = seq.slice();
      for(var iCell = start; iCell <= end; iCell++){
         seq[iCell] = tempSeq[end - iCell + start];
      }
   };

   function updateGrid() {
      for(var iCell = 0; iCell < nbCells; iCell++){
         var entry = seq[iCell];
         var x = xGrid + iCell*cellW;
         var y = yGrid + iCell*cellH;
         var dataCell = { entry: entry, xPos: x, yPos: y, row: 0, col: iCell };
         grid.setCell(cellFiller, dataCell)
      }
   };

   function replayHistory() {
      seq = data[level].seq.slice();
      for(var iStep = 0; iStep < answer.history.length; iStep++){
         var step = answer.history[iStep];
         updateSeq(step);
      }
   };

   function moveShapes(lastMove) {
      var start = lastMove[0];
      var end = lastMove[1];
      var yShape = yGrid + cellH/2;
      var trajectories = paper.set();
      sim = subTask.simulationFactory.create("sim");
      var toMove = [];
      for(var iShape = start; iShape <= end; iShape++){
         if(iShape < (start + end)/2){
            var dir = 0;
         }else if(iShape > (start + end)/2){
            var dir = 1;
         }else{
            continue
         }
         var xi = xGrid + iShape*cellW + cellW/2;
         var xf = xGrid + (end - iShape + start)*cellW + cellW/2;
         var xMid = (xi + xf)/2;
         var dirMult = (dir) ? 1 : -1;
         var yControl = yShape + dirMult * Math.abs(xi - xMid);
         var path = "M"+xi+" "+yShape+",C"+xi+" "+yControl+" "+xf+" "+yControl+" "+xf+" "+yShape;
         var traj = paper.path(path).attr(trajAttr);
         if(dir){
            traj.attr("stroke",colors.blue);
         }
         trajectories.push(traj);
         var shape = grid.getCell(0,iShape)[1];
         toMove.push([shape,traj,dir]);
      }

      var nbSteps = 10;
      var duration = animTime/nbSteps;
      for(var iStep = 0; iStep <= nbSteps + 1; iStep++){
         var simStep = new SimulationStep();
         for(var iShape = 0; iShape < toMove.length; iShape++){
            var shape = toMove[iShape][0];
            var traj = toMove[iShape][1];
            var dir = toMove[iShape][2];
            var totalLength = traj.getTotalLength();
            var stepLength = totalLength/nbSteps;
            var currLength = iStep*stepLength;
            var currPos = traj.getPointAtLength(currLength);
            var startPos = traj.getPointAtLength(0);
            var simAction = { onExec: moveShape(shape,(iStep == nbSteps + 1)), duration: duration, params: { x: currPos.x - startPos.x, y: currPos.y - startPos.y } };
            var entryName = "entry_"+iShape+"_"+iStep;
            var simEntry = { name: entryName, action: simAction };
            simStep.addEntry(simEntry);
         }
         sim.addStep(simStep);
      }
      sim.setAutoPlay(true);
      sim.play();
   };

   function moveShape(shape,final) {
      return function(params,duration,callback) {
         var anim = new Raphael.animation({transform:"t"+params.x+" "+params.y},duration,callback);
         subTask.raphaelFactory.animate("anim",shape,anim);
         return { stop: function() {
            if(final){
               subTask.simulationFactory.destroy("sim");
               updateGrid();
            }
         }};
      }
   };

   function cellFiller(cellData, paper) {
      var entry = cellData.entry;
      var xCell = cellData.xPos;
      var yCell = cellData.yPos;
      var rect = paper.rect(xCell,yCell,cellW,cellH).attr(rectAttr);
      rect.toBack();
      var x = xCell + cellW/2;
      var y = yCell + cellH/2;
      var shape = drawShape(entry,x,y);
      return [rect,shape]
   };

   function drawShape(id,x,y) {
      var shapeName = shapeNames[id];
      var shape = getShape(paper,shapeName,x,y,shapeR);
      shape.attr({stroke: "none", fill: colors[shapeColor[id]] })
      return shape
   };

   function checkResult(noVisual) {
      if(!noVisual){
         displayError("");
      }
      if(!noVisual && answer.waitingForRestart){
         grid.disableDragSelection();
         undoButton.unclick();
         platform.validate("done");
         return
      }
      replayHistory();
      // console.log(seq)
      var found = [];
      var lastShape = null;
      for(var iCell = 0; iCell < nbCells; iCell++){
         var currShape = seq[iCell];
         if(lastShape != currShape){
            if(!Beav.Array.has(found,currShape)){
               found.push(currShape);
               lastShape = currShape;
            }else{
               var error = taskStrings.error;
               if(!noVisual){
                  var currIndex = iCell;
                  var prevIndex = null;
                  for(var jCell = iCell - 1; jCell >= 0; jCell--){
                     var prevShape = seq[jCell];
                     if(prevShape == currShape){
                        prevIndex = jCell;
                        break;
                     }
                  }
                  if(grid && !noVisual) {
                     displayError(error);
                     grid.highlightCell(0, currIndex);
                     grid.highlightCell(0, prevIndex);
                  }
               }
               return { successRate: 0, message: error }
            }
         }
      }

      var nbMoves = answer.history.length;
      if(nbMoves > nbOptimal){
         var msg = taskStrings.tooMany;
         var score;
         if(nbMoves == nbOptimal + 1){
            if (level == "easy") {
               score = 0.5;
            } else {
               score = 0.2;
            }
         } else if (level == "easy") {
            score = 0.25;
         }
      }else{
         var msg = taskStrings.success;
         var score = 1;
      }

      if(grid && !noVisual){
         answer.waitingForRestart = true;
         // displayHelper.hideValidateButton = true;
         grid.disableDragSelection();
         undoButton.unclick();
         platform.validate("done");
      }
      return { successRate: score, message: msg };
   };

   function displayError(msg) {
      $("#displayHelper_graderMessage").html(msg);
      if(!msg && grid){
         unhighlightCells();
      }
   };

   function unhighlightCells() {
      for(var iCell = 0; iCell < nbCells; iCell++){
         if(grid.isCellHighlighted(0, iCell)){
            grid.unhighlightCell(0,iCell);
         }
      }
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();

