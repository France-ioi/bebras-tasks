function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         paperW: 370,
         paperH: 480,
         nbRound: 0,
         nbSquare: 40,
         threshold: 20,
         step: 10
      },
      medium: {
         paperW: 370,
         paperH: 480,
         nbRound: 2,
         nbSquare: 80,
         threshold: 5,
         step: 1
      },
      hard: {
         paperW: 370,
         paperH: 480,
         nbRound: 10,
         nbSquare: 30,
         threshold: 17,
         step: 3
      }
   };

   var paper;
   var paperW;
   var paperH;

   var marginX = 10;
   var marginY = 10;

   var nbRound;
   var nbSquare;
   var threshold;
   var step;

   var algoData;

   var arrowData = [
      { start: { id: 0, side: "right" }, end: { id: 1, side: "left" } },
      { start: { id: 1, side: "bottom" }, end: { id: 2, side: "top" } },
      { start: { id: 2, side: "bottom" }, end: { id: 3, side: "top" } },
      { start: { id: 3, side: "bottom" }, end: { id: 4, side: "top" } },
      { start: { id: 4, side: "bottom" }, end: { id: 5, side: "top" } },
      { start: { id: 3, side: "bottom" }, end: { id: 6, side: "top" } }
   ];

   var textAttr = {
      "font-size": 16
   };
   var arrowAttr = {
      stroke: "black",
      "stroke-width": 2,
      "arrow-end": "classic-long-wide"
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      paperW = data[level].paperW;
      paperH = data[level].paperH;
      nbRound = data[level].nbRound;
      nbSquare = data[level].nbSquare;
      threshold = data[level].threshold;
      step = data[level].step;
      algoData = [
         { x: marginX, y: marginY, width: 67, height: 54, text: taskStrings.start, initial: true },
         { x: 132, y: marginY, width: 186, height: 55, text: taskStrings.addRound(nbRound) },
         { x: 132, y: 99, width: 186, height: 55, text: taskStrings.addSquare(nbSquare) },
         { x: 90, y: 189, width: 270, height: 55, text: taskStrings.moreThanInSquare(threshold) },
         { x: 51, y: 301, width: 186, height: 55, text: taskStrings.removeFromSquare(step) },
         { x: 52, y: 387, width: 186, height: 55, text: taskStrings.addRound(step) },
         { x: 281, y: 387, width: 67, height: 54, text: taskStrings.end, terminal: true }
      ];
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
      $("#answer input").val(answer);
      initPaper();
      initAlgo();
      initHandlers();
      displayHelper.customValidate = checkResult;
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

   function initAlgo() {
      for(var iAlgo = 0; iAlgo < algoData.length; iAlgo++){
         var data = algoData[iAlgo];
         var rect = paper.rect().attr(data);
         if(data.initial || data.terminal){
            rect.attr("fill","#afdde9");
         }
         paper.text(data.x + data.width/2, data.y + data.height/2, data.text).attr(textAttr);
      }

      for(var iArrow = 0; iArrow < arrowData.length; iArrow++){
         var data = arrowData[iArrow];
         var startPos = getArrowPos(data.start.id,data.start.side);
         var endPos = getArrowPos(data.end.id,data.end.side);
         paper.path("M"+startPos.x+" "+startPos.y+", L"+endPos.x+" "+endPos.y).attr(arrowAttr);
      }

      var pos1 = getArrowPos(5,"bottom");
      var y2 = pos1.y + 2*marginY;
      var x3 = algoData[5].x - 2*marginX;
      var y4 = algoData[3].y + algoData[3].height/2;
      var pos5 = getArrowPos(3,"left");
      paper.path("M"+pos1.x+" "+pos1.y+",V"+y2+",H"+x3+",V"+y4+",H"+pos5.x).attr(arrowAttr);

      var xYes = getArrowPos(3,"bottom").x  - 6*marginX;
      var yYes = getArrowPos(3,"bottom").y  + 2*marginY;
      var xNo = getArrowPos(3,"bottom").x  + 4*marginX;
      var yNo = yYes;
      paper.text(xYes,yYes,taskStrings.yes).attr(textAttr);
      paper.text(xNo,yNo,taskStrings.no).attr(textAttr);
   };

   function initHandlers() {
      $("#answer input").keydown(function(){
         displayError("");
      });
      $("#answer input").keyup(function(){
         answer = $(this).val();
      });
   };

   function getArrowPos(id,side) {
      var xBox = algoData[id].x;
      var yBox = algoData[id].y;
      var wBox = algoData[id].width;
      var hBox = algoData[id].height;
      var x,y;
      switch(side) {
         case "top":
            x = xBox + wBox/2;
            y = yBox;
            break;
         case "right":
            x = xBox + wBox;
            y = yBox + hBox/2;
            break;
         case "bottom":
            x = xBox + wBox/2;
            y = yBox + hBox;
            break;
         case "left":
            x = xBox;
            y = yBox + hBox/2;
            break;
      }
      return { x: x, y: y }
   };

   function checkResult(noVisual) {
      if(answer == "" || isNaN(answer) || answer < 0 || answer%1 != 0){
         var msg = taskStrings.NaN;
         if(!noVisual){
            displayError(msg);
         }
         return { successRate: 0, message: msg };
      }
      var currSquare = nbSquare;
      var currRound = nbRound;
      while(currSquare > threshold){
         currSquare -= step;
         currRound += step;
      }
      var sol = currRound;
      if(answer != sol){
         var msg = taskStrings.failure;
         if(!noVisual){
            displayError(msg);
         }
         return { successRate: 0, message: msg };
      }
      if(!noVisual){
         platform.validate("done");
      }
      return { successRate: 1, message: taskStrings.success };
   };

   function displayError(msg) {
      $("#error").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
