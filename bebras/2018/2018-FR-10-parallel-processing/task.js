function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         startPos: [[0,1],[0,3]],
         startOrientation: [2,2],
         goals: [],
         controlsSeq: [[0, 0,1,0,0,0, 0,7],[0,0,0,2,0,0,0,7]],
         paperHeight: 500
      },
      medium: {
         startPos: [[0,2],[3,0]],
         startOrientation: [2,1],
         goals: [[5,2],[3,5]],
         controlsSeq: [[4,0,6,7]],
         paperHeight: 570
      },
      hard: {
         startPos: [[0,1],[3,0],[5,2],[2,5]],
         startOrientation: [2,1,0,3],
         goals: [[5,1],[3,5],[0,2],[2,0]],
         controlsSeq: [[5,3,6,7]],
         paperHeight: 600
      }
   };

   var controls = ["moveForward","turnLeft","turnRight","moveForwardIf","ifRobAhead","ifRob2Ahead","ifWhiteCell","end"];
   var paper;
   var paperWidth = 770;
   var paperHeight;
   var grid;
   var gridCols = 6;
   var gridSize = paperWidth/3;
   var gridPos;
   var rightSide = paperWidth-gridSize;
   var gridMargin = 20;
   var gridLineAttr = {
      "stroke": "black",
      "stroke-width": 1
   };
   var goalAttr = {
      "stroke": "none",
      "fill": "#b5e61d"
   };
   var robAttr = {
      "stroke": "black",
      "stroke-width": 1,
      "fill": "#c3c3c3"
   };
   var controlsGrid = [];
   var controlsGridDim;
   var controlsTextAttr = {
      "font-size": 16,
      "fill": "black"
   };
   var controlsIndexAttr = {
      "font-size": 16,
      "fill": "black",
      "font-weight": "bold"
   };
   var controlsSeq;
   var selectedControl = [];
   var selectedContAttr = {
      "stroke": "black",
      "fill": "white"
   };
   var selectedContTextAttr = {
      "font-size": 16,
      "fill": "black"
   };
   var feedbacksAttr = {
      "font-size": 16,
      "fill": "orange"
      // "font-weight": "bold"
   };
   var nbRobots;
   var robotsPos = [];
   var robotsOr = [];
   var buttons = [];
   var buttonsAttr = [];
   var buttonsDisabled = [];
   var feedbacks = [];
   var arrow = [];
   var arrowAttr = {
      "stroke": "black",
      "stroke-width": 3,
      "arrow-end": "block"
   };
   var undoButton;

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      nbRobots = data[level].startPos.length;
      controlsSeq = JSON.parse(JSON.stringify(data[level].controlsSeq));
      initRobotsParams();
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if (answer && answer.length > 0){
         replay(true);
         var last = answer.length-1;
         checkState(answer[last]);
      }
   };

   subTask.resetDisplay = function () {
      initPaper();
      updateControls();
      updateArrows();
      hideFeedBack();
      initUndo();
      updateButtons();
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
      return defaultAnswer;
   };

   function getResultAndMessage() {
      replay(true);
      var last = answer.length-1;
      return checkState(answer[last]);
   }

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initRobotsParams(){
      for(var iRob = 0; iRob < nbRobots; iRob++){
         selectedControl[iRob] = 0;
         robotsPos[iRob] = [data[level].startPos[iRob][0],data[level].startPos[iRob][1]];
         robotsOr[iRob] = data[level].startOrientation[iRob];
         buttonsDisabled[iRob] = false;
      }
   };

   function initPaper() {
      paperHeight = data[level].paperHeight;
      paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);
      initGrid();
      initControlsGrid();
      initButtons();
   };

   function initGrid() {
      if(grid) grid.remove();
      var cellSize = gridSize/gridCols;
      gridPos = { "top": (level == "easy") ? gridMargin : 260,
                  "left": gridMargin };
      grid = new Grid("grid",paper,gridCols,gridCols,cellSize,cellSize,gridPos.left,gridPos.top,gridLineAttr);

      for (var iGoal = 0; iGoal < data[level].goals.length; iGoal++) {
         var goal = data[level].goals[iGoal];
         var dataGoal = {row:goal[0],col:goal[1]};
         grid.addToCell(addGoal,dataGoal);
      }
      
      for(var iRobot = nbRobots-1; iRobot >= 0; iRobot--){
         var rob = robotsPos[iRobot];
         
         var dataRob = {
            "row": rob[0],
            "col": rob[1],
            "or": robotsOr[iRobot],
            "id": iRobot+1
         };
         grid.addToCell(addRob,dataRob);
      }
   };

   function initControlsGrid() {
      initControlsGridDim();
      resetControlsGrid();
   };

   function initControlsGridDim() {
      if(level == "easy"){
         var width = rightSide/3;
         var rows = [controlsSeq[0].length,controlsSeq[1].length];
         var cols = 1;
         var left = [gridSize+3*gridMargin,gridSize+3*gridMargin+width+70];
         var top = [gridMargin,gridMargin];
         var cellHeight = controlsTextAttr["font-size"]+gridMargin;
         var height = [cellHeight*rows[0],cellHeight*rows[1]];
      }else{
         var width = (level == "medium") ? 350 : 400;
         var rows = [controlsSeq[0].length];
         var cols = 1;
         var left = [gridMargin];
         var top = [gridMargin];
         var cellHeight = 2*controlsTextAttr["font-size"]+gridMargin;
         var height = [cellHeight*rows[0]];
      }
      controlsGridDim = {
         "width": width,
         "height": height,
         "rows": rows,
         "cols": cols,
         "left": left,
         "top": top,
         "cellHeight": cellHeight
      }
   };

   function initButtons() {
      for(var iButton = 0; iButton < nbRobots; iButton++){
         var h = 3*controlsTextAttr["font-size"]+2*gridMargin;
         if(level == "easy") {
            var x = controlsGridDim.left[iButton];
            var y = controlsGridDim.top[iButton]+controlsGridDim.height[iButton]+2*gridMargin;
            var w = controlsGridDim.width;
         }else{
            var y = controlsGridDim.top[0]+controlsGridDim.height[0]+3*gridMargin;
            if(level == "medium"){
               var w = rightSide/3;
               var x = gridSize+rightSide/4+iButton*(gridMargin+w);
            }else{
               var w = rightSide*0.3;
               var x = gridSize+3*gridMargin+iButton*(rightSide-2*gridMargin)/(nbRobots+1);
               if(iButton%2 == 1) y+=(h+2*gridMargin+2*feedbacksAttr["font-size"]);
            }
         }
         var text = taskStrings.execute+" "+(iButton+1);
         buttons[iButton] = new Button(paper,x,y,w,h,text);
         buttonsAttr[iButton] = {"x":x,"y":y,"w":w,"h":h};
         addArrow(iButton,0);
         buttons[iButton].click(execute(iButton));
         if(buttonsDisabled[iButton]) {
            disableButton(iButton); // to make sure the buttons that should be disabled are disabled when reloading the level
         }
      }
   };

   function initUndo() {
      var w = 100;
      var h = 30;
      var x = gridPos.left + (gridSize - w)/2;
      var y = gridPos.top + gridSize + gridMargin;
      undoButton = new Button(paper,x,y,w,h,taskStrings.undo);
      undoButton.click(function(){
         if(!answer) return;
         answer.pop();
         replay(false);
         updateButtons();
         updateControls();
         updateArrows();
         initGrid();
         hideFeedBack();
         if(answer.length == 0) undoButton.disable();
      });
      if(answer.length == 0) undoButton.disable();
   }

   function addGoal(data,paper) {
      var goal = paper.rect(data.xPos,data.yPos,data.cellWidth,data.cellHeight).attr(goalAttr).toBack();
      return [goal];
   };

   function addRob(data,paper) {
      var x = data.xPos;
      var y = data.yPos;
      var frameW = data.cellWidth;
      var innerFrameW = 0.8*frameW;
      var margin = (frameW-innerFrameW)/2;
      var baseW = innerFrameW*0.6;
      var arrowTipLength = innerFrameW/3;
      var angle = data.or*90;
      var cx = x+frameW/2;
      var cy = y+frameW/2;
      var textAttr = {
         "font-size": baseW*0.9,
         "font-weight": "bold"
      };
      var arrow = paper.path("M"+(x+frameW/2)+" "+(y+margin)+
                              "L"+(x+frameW-margin)+" "+(y+margin+arrowTipLength)+
                              "H"+(x+margin+innerFrameW-(innerFrameW-baseW)/2)+
                              "V"+(y+frameW-margin)+
                              "H"+(x+margin+(innerFrameW-baseW)/2)+
                              "V"+(y+margin+arrowTipLength)+
                              "H"+(x+margin)+
                              "Z");

      arrow.attr(robAttr);
      arrow.transform("r"+angle);
      var text = paper.text(cx,cy,data.id).attr(textAttr);
      var arrowSet = paper.set();
      arrowSet.push(arrow,text);
      return [arrowSet];
   };

   function addControl(data,paper) {
      var cx = data.xPos+data.cellWidth/2;
      var cy = data.yPos+data.cellHeight/2;
      if(level == "easy"){
         if(data.selected){
            var background = paper.rect(data.xPos,data.yPos,data.cellWidth,data.cellHeight).attr(selectedContAttr);
            var text = paper.text(cx,cy,data.text).attr(selectedContTextAttr);
            var cell = paper.set(background,text);
         }else{
            var cell = paper.text(cx,cy,data.text).attr(controlsTextAttr);
         }
      }else{
         var indexFrameWidth = controlsIndexAttr["font-size"]+gridMargin;
         var indexX = data.xPos+indexFrameWidth/2;
         var indexText = (data.row+1)+".";
         var textX = cx+indexFrameWidth/2;
         var indexFrame = paper.rect(data.xPos,data.yPos,indexFrameWidth,data.cellHeight).attr(gridLineAttr).toBack();
         var index = paper.text(indexX,cy,indexText).attr(controlsIndexAttr);
         var text = paper.text(textX,cy,data.text).attr(controlsTextAttr);
         var cell = paper.set(indexFrame,index,text);
      }

      return [cell];
   };

   function addArrow(button,row) {
      var b = buttonsAttr[button];
      var indexGrid = (level == "easy") ? button : 0;
      var gridRightBorder = controlsGridDim.left[indexGrid] + controlsGridDim.width;
      var targetPos = controlsGrid[indexGrid].getCellPos(row,0);
      var x1 = b.x+b.w/2;
      var y1 = b.y;
      var x2 = x1;
      var y2 = y1-gridMargin;
      if(x1 < gridRightBorder+gridMargin){
         var x3 = gridRightBorder+gridMargin;
      }else{
         var x3 = x2;
      }
      var y3 = y2;
      var x4 = x3;
      if(level == "easy"){
         var y4 = targetPos.y + controlsGridDim.cellHeight/2;
      }else if(level == "medium"){
         var y4 = targetPos.y + (2-button)*controlsGridDim.cellHeight/3;
      }else if(level == "hard"){
         var y4 = targetPos.y + (4-button)*controlsGridDim.cellHeight/5;
      }
      var x5 = gridRightBorder;
      var y5 = y4;
      arrow[button] = paper.path("M"+x1+" "+y1+"V"+y2+"H"+x3+"V"+y4+"H"+x5).attr(arrowAttr);
   };

   function resetControlsGrid() {
      var nGrid = (level == "easy") ? 2 : 1;
      for(var iGrid = 0; iGrid < nGrid; iGrid++){
         if(controlsGrid[iGrid]) controlsGrid[iGrid].remove();
         var id = "controlsGrid"+iGrid;
         var rows = controlsGridDim.rows;
         var cols = controlsGridDim.cols;
         var width = controlsGridDim.width;
         var cellHeight = controlsGridDim.cellHeight;
         var left = controlsGridDim.left;
         var top = controlsGridDim.top;
         controlsGrid[iGrid] = new Grid(id,paper,rows[iGrid],cols,width,cellHeight,left[iGrid],top[iGrid],gridLineAttr);
         for(var iRow = 0; iRow < rows[iGrid]; iRow++){
            var dataControl = {
               "row": iRow,
               "col": 0,
               "text": taskStrings[controls[controlsSeq[iGrid][iRow]]],
               "selected": false
            };
            controlsGrid[iGrid].addToCell(addControl,dataControl);
         }
      }
   };

   function updateControls() {
      resetControlsGrid();
      if(level == "easy") {
         for(var iGrid = 0; iGrid < 2; iGrid++) {
            var dataCell = {
               "row":selectedControl[iGrid],
               "col":0,
               "text": taskStrings[controls[controlsSeq[iGrid][selectedControl[iGrid]]]],
               "selected": true
            };
            controlsGrid[iGrid].setCell(addControl,dataCell);
         }
      }
   };

   function updateArrow(button) {
      arrow[button].remove();
      addArrow(button,selectedControl[button]);
   };

   function updateArrows() {
      for(var iArrow = 0; iArrow < nbRobots; iArrow++){
         updateArrow(iArrow);
      }
   };

   function execute(iButton) {
      return function(){
         answer.push(iButton);
         undoButton.enable();
         hideFeedBack();
         var iRob = iButton;
         var gridIndex = (level == "easy") ? iButton : 0;
         var controlIndex = selectedControl[iRob];
         var step = controlsSeq[gridIndex][controlIndex];
         action(iRob,step,false);
         updateControls();
         updateButtons();
         updateArrow(iButton);
         initGrid();
      }
   };

   function action(rob,step,finalCheck) {
      var showFeedback = !finalCheck && (level != "easy");
      switch(step){
         case 0:
            moveForward(rob,finalCheck);
             if(showFeedback) {
               showButtonFeedback(taskStrings.cellForward,rob);
             }
            break;
         case 1:
            turn(rob,"left");
            break;
         case 2:
            turn(rob,"right");
            break;
         case 3:
            if(isNextSquareEmpty(rob,1)){
               if(showFeedback) {
                 showButtonFeedback(taskStrings.cellAheadFreeForward,rob);
               }
               moveForward(rob,finalCheck);
            }else{
               if(showFeedback) {
                 showButtonFeedback(taskStrings.cellAheadNotFreeHard,rob);
               }
            }
            break;
         case 4:
         case 5:
            if(!isNextSquareEmpty(rob,step-3)){
               selectedControl[rob] = 2;
               if(step == 4) {
                  if(showFeedback) {
                    showButtonFeedback(taskStrings.cellAheadNotFreeMedium,rob);
                  }
               }else{
                  if(showFeedback) {
                    showButtonFeedback(taskStrings.cell2AheadNotFree,rob);
                  }
               }
            }else{
               selectedControl[rob]++;
               if(step == 4) {
                  if(showFeedback) {
                    showButtonFeedback(taskStrings.cellAheadFree,rob);
                  }
               }else{
                  if(showFeedback) {
                    showButtonFeedback(taskStrings.cell2AheadFree,rob);
                  }
               }

            }
            break;
         case 6:
            if(!isGoal(robotsPos[rob])){
               if(showFeedback) {
                 showButtonFeedback(taskStrings.onWhiteCell,rob);
               }
               selectedControl[rob] = 0;
            }else{
               selectedControl[rob]++;
               if(showFeedback) {
                 showButtonFeedback(taskStrings.cellAheadNotFreeHard,rob);
               }
            }
            break;
         default:
      }
      if(!finalCheck) {
        var result = checkState(rob);
        updateButtons();
        if (result.successRate == 1) {
           platform.validate("done");
        }
        else if (robotsCrashed()){
            displayHelper.showPopupMessage(result.message, "blanket");
        }
      }
   };

   function moveForward(rob,finalCheck) {
      var gridIndex = (level == "easy") ? rob : 0;
      switch(robotsOr[rob]) {
         case 0:
            if(robotsPos[rob][0] > 0)
              robotsPos[rob][0]--;
            break;
         case 1:
            if(robotsPos[rob][1] < gridCols-1)
              robotsPos[rob][1]++;
            break;
         case 2:
            if(robotsPos[rob][0] < gridCols-1)
              robotsPos[rob][0]++;
            break;
         case 3:
            if(robotsPos[rob][1] > 0)
              robotsPos[rob][1]--;
            break;
      }
      if(selectedControl[rob] < controlsSeq[gridIndex].length-1)
         selectedControl[rob]++;
      if(!finalCheck) {
          checkState(rob);
      }
   };

   function turn(rob,side) {
      var gridIndex = (level == "easy") ? rob : 0;
      var next = (side == "left") ? -1 : 1;
      robotsOr[rob] = (robotsOr[rob]+next)%4;
      if(selectedControl[rob] < controlsSeq[gridIndex].length-1)
        selectedControl[rob]++;
   };

   function isNextSquareEmpty(rob,nSquare) {
      if(isGoal(robotsPos[rob])) {
         return false;
      }
      var row = parseInt(robotsPos[rob][0]);
      var col = parseInt(robotsPos[rob][1]);
      for(var iSquare = 1; iSquare <= nSquare; iSquare++){
         switch(robotsOr[rob]) {
            case 0:
               var next = [row-iSquare,col];
               break;
            case 1:
               var next = [row,col+iSquare];
               break;
            case 2:
               var next = [row+iSquare,col];
               break;
            case 3:
               var next = [row,col-iSquare];
               break;
         }
         if(next[0] >= 0 && next[1] >= 0 && next[0] < gridCols && next[1] < gridCols){
            if(!isEmpty(next)){
               return false;
            }
         }
      }
      return true;
   };

   function isEmpty(pos) {
      for(var iRob = 0; iRob < nbRobots; iRob++){
         if(robotsPos[iRob][0] == pos[0] && robotsPos[iRob][1] == pos[1])
            return false;
      }
      return true;
   };

   function isGoal(pos) {
      for(var iGoal = 0; iGoal < data[level].goals.length; iGoal++){
         if(pos[0] == data[level].goals[iGoal][0] && pos[1] == data[level].goals[iGoal][1])
            return true;
      }
      return false;
   };

   function programEnded(iRobot) {
      var gridIndex = (level == "easy") ? iRobot : 0;
      return (selectedControl[iRobot] == controlsSeq[gridIndex].length - 1);
   };
   
   function robotsCrashed() {
      var pos = robotsPos;
      return (pos[0][0] == pos[1][0] && pos[0][1] == pos[1][1]);
   }
   
   function replay(finalCheck) {
      if(!answer) return;
      initRobotsParams();
      var maxStep = answer.length;
      for(var iStep = 0; iStep < maxStep; iStep++) {
         var gridIndex = (level == "easy") ? answer[iStep] : 0;
         action(answer[iStep],controlsSeq[gridIndex][selectedControl[answer[iStep]]],finalCheck);
      }
   };

   function updateButtons() {
      enableButtons();
      for(var iRob = 0; iRob < nbRobots; iRob++){
         if (programEnded(iRob)) {
            disableButton(iRob);
         }
      }
      if (robotsCrashed()) {
         disableButtons();
      }
   }

   function checkState(rob) {
      var same = false;
      var allDone = true;
      for(var iRob = 0; iRob < nbRobots; iRob++){
         if (!programEnded(iRob)) {
            allDone = false;
         } 
      }
      var success = false;
      var message = "";
      if (allDone) {
         message = (level != "hard") ? taskStrings.failureEndNoCrash : taskStrings.failureEndNoStuck;
      } else if(level != "hard") {
        if (robotsCrashed()){
           same = true;
           if(rob == 0){
              success = true;
              message = taskStrings.success;
           } else {
              message = taskStrings.failureSwapped;
           }
        } else {
          message = taskStrings.failureNoCrash;
        }
      }else{
         var nbRobotsNotStuck = 0
         for (var iRob = 0; iRob < nbRobots; iRob++) {
            if(isNextSquareEmpty(iRob,2)) {
              nbRobotsNotStuck++;
              message = taskStrings.robotNotStuck(iRob+1);
              break;
            }
            if (isGoal(robotsPos[iRob])) {
              nbRobotsNotStuck++;
              message = taskStrings.failureEndNoStuck;
              break;
            }
         }
         if (nbRobotsNotStuck == 0) {
           success = true; // unless a robot is not stuck, see below
           message = taskStrings.success;
         }
      }
      return {
        successRate: (success) ? 1 : 0,
        message: message
      }
   };

   function disableButton(iRobot){
      buttonsDisabled[iRobot] = true;
      if(buttons[iRobot]) {
         buttons[iRobot].disable();
      }
   };

   function disableButtons(){
      for(var iButton = 0; iButton < nbRobots; iButton++) {
          disableButton(iButton);
      }
   };

   function enableButton(iRobot){
      buttonsDisabled[iRobot] = false;
      if(buttons[iRobot]) {
        buttons[iRobot].enable();
      }
   };

   function enableButtons(){
      for(var iButton = 0; iButton < nbRobots; iButton++) {
         enableButton(iButton);
      }
   };

   function hideFeedBack() {
      for(var iButton = 0; iButton < nbRobots; iButton++){
         hideButtonFeedback(iButton);
      }
   };

   function showButtonFeedback(string,index) {
      var x = buttonsAttr[index].x + buttonsAttr[index].w/2;
      var y = buttonsAttr[index].y + buttonsAttr[index].h + 2*feedbacksAttr["font-size"];
      if(feedbacks[index]) feedbacks[index].remove();
      feedbacks[index] = paper.text(x,y,string).attr(feedbacksAttr);
   };

   function hideButtonFeedback(index) {
      if(feedbacks[index]) feedbacks[index].remove();
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
