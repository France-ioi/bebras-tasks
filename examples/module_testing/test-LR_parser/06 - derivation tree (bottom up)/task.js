function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         rules: [ 
            "S -> E * c",
            "E -> E * B",
            "E -> E + B",
            "E -> B",
            "B -> a",
            "B -> b" ],
         input: "a + b * c"
      },
      medium: {
         rules: [ 
            "S -> J H",
            "H -> E G",
            "E -> c d",
            "G -> e D",
            "D -> f g",
            "J -> a b" ],
         input: "a b c d e f g"
      },
      hard: {
         rules: [ 
            "S -> J H",
            "H -> E G",
            "E -> c d",
            "G -> e D",
            "D -> f g",
            "J -> a b" ],
         input: "a b c d e f g"
      }
   };

   var rules;
   var input;
   var lrParser;

   var paperHeight;
   var paperWidth = 770;
   var graph;
   var visualGraph;
   var visualGraphJSON;
   var graphDrawer;
   var graphMouse;
   var vertexClicker;


   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      rules = data[level].rules.slice();
      input = data[level].input;
      paperHeight = data[level].paperHeight;
      
      visualGraphJSON = JSON.stringify(data[level].visualGraphJSON);
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
         initParser();
         lrParser.reloadAnswer();
      }
   };

   subTask.resetDisplay = function() {
      initParser();
      displayHelper.customValidate = validation;
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [{}];
      var altInput = input.replace(/ /g,"");
      for(var iChar = 0; iChar < altInput.length; iChar++){
         defaultAnswer[0][2* iChar + 1] = altInput.charAt(iChar);
      }      
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      if(lrParser){
         lrParser.pauseSimulation(null,true);
      }
      callback();
   };

   subTask.getGrade = function(callback) {
      callback({
         successRate: 1, message: taskStrings.success
      });
   };

   function initParser() {
      if(lrParser){
         return;
      }
      lrParser = new LR_Parser({
         divID: "lrParser",
         mode: 6,
         rules: rules,
         input: input,
      },subTask,answer);
   };

   function validation() {
      var res = lrParser.validation();
      if(res){
         displayHelper.validate("stay");
      }
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
