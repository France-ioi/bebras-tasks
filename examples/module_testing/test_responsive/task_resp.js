function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         paperH: 300,
         minTaskW: 500,
         maxTaskW: 900
      },
      medium: {
         paperH: 600,
         minTaskW: 500,
         maxTaskW: 900
      },
      hard: {
         paperH: 800,
         minTaskW: 500,
         maxTaskW: 900
      }
   };

   var paper, exPaper;
   var paperW = 770;
   var paperH;
   var exPaperW = 100;
   var exPaperH = 100;

   var marginX = 20;
   var marginY = 20;
   var rectW = paperW - 2*marginX;
   var rectH;
   var exRectW = exPaperW - 2;
   var exRectH = exPaperH - 2;

   var colors = {
      green: "#88BB88",
      lightGreen: "#a7e2a7",
      darkGreen: "#5a885a",
      black: "#30242B",
      grey: "#eaeaea",
      lightGrey: "#F9F9F9",
      darkGrey: "#bebebe",
      altGrey: "#cad9ca",
      altGrey2: "#bccabc",
      veryLightGreen: "#d3e5d3"
   };

   var backgroundAttr = {
      stroke: "none",
      fill: colors.grey,
      r: 5
   };
   var rectAttr = {
      stroke: colors.green,
      "stroke-width": 3,
      fill: "none",
      r: 5
   };
   var titleAttr = {
      "font-size": 20,
      "font-weight": "bold",
      fill: colors.green
   };
   var exampleAttr = {
      "font-size": 16,
      "font-weight": "bold",
      fill: colors.green
   };

   subTask.loadLevel = function(curLevel) {
      displayHelper.avatarType = "laptop";
      // console.log(Beav.Navigator.supportsResponsive())
      if(Beav.Navigator.supportsResponsive()){
         displayHelper.responsive = true;
      }else{
         displayHelper.responsive = false;
      }
      // console.log(Beav.Navigator.getVersion())
      // displayHelper.hideSolutionButton = true;
      level = curLevel;
      paperH = data[level].paperH;
      rectH = paperH - 2*marginY;
      displayHelper.taskH = paperH;
      displayHelper.minTaskW = data[level].minTaskW;
      displayHelper.maxTaskW = data[level].maxTaskW;
      displayHelper.sideZoneEnabled = true;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
   };

   subTask.resetDisplay = function() {
      displayError("");
      initExample();
      initPaper();
      // displayHelper.customValidate = checkResult;
      displayError("message d'erreur");
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = { 
         // selectedCol: Beav.Array.make(nbCol,0)
      };
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      // subTask.delayFactory.destroy("delay");
      callback();
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function getResultAndMessage() {
      var res = checkResult(true);
      return res
   };

   function initExample() {
      $("#example").append('<div id="exPaper"></div>');
      exPaper = subTask.raphaelFactory.create("exPaper","exPaper",exPaperW,exPaperH);
      $("#exPaper").css({
         width: exPaperW+"px",
         margin: "auto"
      });
      exPaper.rect(1,1,exRectW,exRectH).attr(rectAttr);
      exPaper.text(exPaperW/2,exPaperH/2,"EXEMPLE").attr(exampleAttr);
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);
      paper.rect(0,0,paperW,paperH).attr(backgroundAttr);
      paper.rect(marginX,marginY,rectW,rectH).attr(rectAttr);
      paper.text(paperW/2,paperH/2,level.toUpperCase()).attr(titleAttr);
   };

   function checkResult(noVisual) {
      // for(var iCol = 0; iCol < nbCol; iCol++){
      //    var sel = answer.selectedCol[iCol];
      //    if(sel == 0 && Beav.Array.has(extraCol,iCol) || sel == 1 && !Beav.Array.has(extraCol,iCol)){
      //       var error = taskStrings.error;
      //       if(!noVisual){
      //          displayError(error);
      //       }
      //       return { successRate: 0, message: error }
      //    }
      // }
      // if(!noVisual){
      //    platform.validate("done");
      // }
      return { successRate: 1, message: taskStrings.success }
   };

   function displayError(msg) {
      // console.log('displayError');
      displayHelper.displayError(msg);
      // $("#errorMsg").html(msg);
      // if(msg){
      //    $("#error").show();
      // }else{
      //    $("#error").hide();
      // }
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
