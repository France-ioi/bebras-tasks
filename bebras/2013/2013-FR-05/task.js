function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         paperW:720,
         paperH: 180,
         target: [
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
         ]
      },
      medium: {
         paperW:720,
         paperH: 180,
         target: [
            [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
         ]
      },
      hard: {
         paperW:770,
         paperH: 220,
         target: [
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
            [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
            [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
            [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
            [0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1],
            [0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1],
            [0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
            [0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1],
            [0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1],
            [0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
            [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1]
         ]
      }
   };

   var paper;
   var paperW;
   var paperH;

   var marginX = 10;
   var marginY = 10;
   var cellW = 18;
   var compassW = 70;

   var animTime = 200;
   var currRow = 0; 
   var currCol = 0; 

   var target;
   var grid, targetGrid;
   var nbRows, nbCol;

   var compassURL = $("#compass").attr("src");

   var greyCellAttr = {
      stroke: "black",
      fill: "grey"
   };
   var redCellAttr = {
      stroke: "black",
      fill: "red"
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      paperW = data[level].paperW;
      paperH = data[level].paperH;
      target = data[level].target;
      nbRows = target.length;
      nbCol = target[0].length;
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
      $("#program").val(answer);
      initPaper();
      initGrid();
      initHandlers();
      // displayHelper.customValidate = checkResult;
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
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);
      $("#paper").css("width", paperW);
   };

   function initGrid() {
      targetGrid = Grid.fromArray("paper", paper, target, cellFiller, cellW, cellW, marginX, marginY);

      var xGrid = targetGrid.getRightX() + 40;
      var yGrid = marginY;
      grid = new Grid("paper", paper, nbRows, nbCol, cellW, cellW, xGrid, yGrid);
      grid.addToCell(cellFiller,{
         row: currRow,
         col: currCol,
         xPos: xGrid,
         yPos: yGrid,
         entry: 2
      });

      var xCompass = grid.getRightX() + 2*marginX;
      var yCompass = marginY;
      paper.image(compassURL,xCompass,yCompass,compassW,compassW);
   };

   function initHandlers() {
      $("#answer input").keydown(function(){
         resetGrid();
         displayError("");
      });
      $("#answer input").keyup(function(){
         answer = $(this).val();
      });
      $("#validate").off("click");
      $("#validate").click(function() {
         checkResult(false);
      });
   };

   function cellFiller(data,paper) {
      var entry = data.entry;
      if(entry){
         var elem = paper.rect(data.xPos,data.yPos,cellW,cellW);
      }
      var attr = (entry == 1) ? greyCellAttr : redCellAttr;      
      if(elem){
         elem.attr(attr);
         return [elem];
      }
   };

   function resetGrid() {
      currRow = 0;
      currCol = 0;
      for(var iRow = 0; iRow < nbRows; iRow++){
         for(var iCol = 0; iCol < nbCol; iCol++){
            grid.clearCell(iRow,iCol);
         }
      }
      grid.setCell(cellFiller,{
         row: currRow,
         col: currCol,
         xPos: grid.getLeftX(),
         yPos: grid.getTopY(),
         entry: 2
      });
   };

   doParse = function(command) {
      if(command == "")
      return "";

      //Parse le nombre qui doit se trouver en tete
      if(command.charAt(0) < '0' || command.charAt(0) > '9') {
         displayError(taskStrings.noSense);
         return undefined;
      }
      var pos = 0;
      var num = 0;
      while(command.charAt(pos) >= '0' && command.charAt(pos) <= '9') {
         num = num * 10 + command.charCodeAt(pos) - "0".charCodeAt(0);
         pos++;
      }
      var end = pos;
      var commandCur;
      if(command.charAt(pos) == '(') {
         var idx = 1;
         while(idx > 0) {
            end++;
            if(end == command.length) {
               displayError(taskStrings.noSense);
               return undefined;
            }
            if(command.charAt(end) == '(')
               idx++;
            if(command.charAt(end) == ')')
               idx--;
         }
         var commandCur = doParse(command.substr(pos+1, end-pos-1));
         if(commandCur == undefined)
            return undefined;
         end++;
         }else if(command.charAt(pos) == 'S' || command.charAt(pos) == 'N' ||
                  command.charAt(pos) == 'O' || command.charAt(pos) == 'E') {
            end++;
            commandCur = command.charAt(pos);
         } else {
            displayError(taskStrings.noSense);
            return undefined;
         }
         var commandNext = doParse(command.substring(end));
         if(commandNext == undefined)
            return undefined;

         if(commandCur.length * num + commandNext.length > 1000) {
            displayError(taskStrings.tooLong1);
            return undefined;
         }
      return new Array(num+1).join(commandCur) + commandNext;
   };

   function checkResult(noVisual) {
      command = answer.replace(/\s+/g, '').toUpperCase();
      if(command.length > 50) {
         var error = taskStrings.tooLong2;
      }else if(command == ""){
         var error = taskStrings.empty;
      }
      if(error){
         if(!noVisual){
            displayError(error);
         }
         return { successRate: 0, message: error };
      }

      command = doParse(command);
      if(!command){
         return
      }
      var currArray = [];
      for(var iRow = 0; iRow < nbRows; iRow++){
         currArray[iRow] = [];
         for(var iCol = 0; iCol < nbCol; iCol++){
            currArray[iRow][iCol] = 0;
         }
      }
      if(!noVisual){
         var iChar = 0;
         subTask.delayFactory.create("anim",function() {
            var res = executeStep(command.charAt(iChar),currArray,noVisual);
            if(res !== true){
               subTask.delayFactory.destroy("anim");
               return res
            }
            iChar++;
            if(iChar == command.length){
               subTask.delayFactory.destroy("anim");
               if(compareWithTarget(currArray)){
                  platform.validate("done");
               }else{
                  displayError(taskStrings.failure);
               }
            }
         },animTime,true);
      }else{
         for(var iChar = 0; iChar < command.length; iChar++){
            var res = executeStep(command.charAt(iChar),currArray,noVisual);
            if(res !== true){
               return res
            }
         }
         if(compareWithTarget(currArray)){
            return { successRate: 1, message: taskStrings.success };
         }else{
            return { successRate: 0, message: taskStrings.failure };
         }
      }
   };

   function compareWithTarget(currArray) {
      for(var iRow = 0; iRow < nbRows; iRow++){
         for(var iCol = 0; iCol < nbCol; iCol++){
            if(currArray[iRow][iCol] != target[iRow][iCol] && !(currArray[iRow][iCol] == 2 && target[iRow][iCol] == 1)){
               return false
            }
         }
      }
      return true
   };

   function executeStep(step,currArray,noVisual) {
      if(!noVisual){
         var x = grid.getLeftX() + grid.getCellPos(currRow,currCol).x;
         var y = grid.getTopY() + grid.getCellPos(currRow,currCol).y;
         grid.setCell(cellFiller,{
            row: currRow,
            col: currCol,
            xPos: x,
            yPos: y,
            entry: 1
         });
      }
      currArray[currRow][currCol] = 1;
      switch(step){
         case "N":
            currRow--;
            break;
         case "S":
            currRow++;
            break;
         case "E":
            currCol++;
            break;
         case "O":
            currCol--;
            break;
      }
      if(currRow < 0 || currRow >= nbRows || currCol < 0 || currCol >= nbCol){
         var msg = taskStrings.out;
         if(!noVisual){
            displayError(taskStrings.out);
         }
         return { successRate: 0, message: msg };
      }
      if(!noVisual){
         var x = grid.getLeftX() + grid.getCellPos(currRow,currCol).x;
         var y = grid.getTopY() + grid.getCellPos(currRow,currCol).y;
         grid.setCell(cellFiller,{
            row: currRow,
            col: currCol,
            xPos: x,
            yPos: y,
            entry: 2
         });
      }
      currArray[currRow][currCol] = 2;
      return true
   };

   function displayError(msg) {
      $("#error").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
