function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         wordList: [ "AC", "BC" ],
         maxNbChar: 5,
         paperHeight: 270
      },
      medium: {
         wordList: [ "BC", "BD", "BE", "ABC", "ABD", "ABE" ],
         maxNbChar: 8,
         paperHeight: 300
      },
      hard: {
         wordList: [ "CD", "HD", "BCD", "BHD", "FGCD", "FGHD" ],
         maxNbChar: 12,
         paperHeight: 350
      }
   };

   var defaultCircleAttr = {
      "r": 15, 
      "fill": "white", 
      "stroke": "black", 
      "stroke-width": 1
   };
   var defaultLineAttr = {
      "stroke": "black",
      "stroke-width": 2, 
      "arrow-end": "long-classic-wide" 
   };
   var seqLettersAttr = {
      "font-family": "monospace",
      "font-size": 20
   };
   var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

   var margin = 10;

   var graphPaper;
   var seqPaper;
   var graph;
   var automata;
   var regex;
   var wordlist;
   var maxNbChar;


   var selectedCircleAttr = {
      stroke: "blue",
      "stroke-width": 6
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      displayHelper.customValidate = validation;
      wordList = data[level].wordList.slice();
      maxNbChar = data[level].maxNbChar;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer)
         $("#input_regex").val(answer);
   };

   subTask.resetDisplay = function() {
      initInstructions();
      initHandlers();
      initAutomata();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = null;
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      if(automata){
         automata.stopAnimation();
         automata.setEnabled(false);
      }
      resetCallback();
      $("#input_regex").off("keyup");
      $("#input_regex").val("");
      callback();
   };

   subTask.getGrade = function(callback) {
      callback({
         successRate: 1, message: taskStrings.success
      });
   };

   function initInstructions() {
      $("#nbChar").text(maxNbChar);
      var html = "";
      for(var word of wordList){
         html += word+"<br>";
      }
      $("#list").html(html);
   };

   function initHandlers() {
      $("#input_regex").off("keyup");
      $("#input_regex").keyup(function(){
         if($(this).val().length > maxNbChar){
            $("#feedback").text("The regex is longer than "+maxNbChar);
         }else{
            $("#feedback").text("");
         }
      });
   };

   function initAutomata() {
      var settings = {
         mode: 7,
         subTask: subTask,
         alphabet: alphabet,
         wordList: wordList,
         maxNbChar: maxNbChar,
         enabled: true
      };
      automata = new Automata(settings);
   };

   function validation() {
      saveAnswer();
      var res = automata.validate(answer);
      if(res.error){
         $("#feedback").text(res.error);
      }else{
         displayHelper.validate("stay");
      }
   };

   function onGraphChange() {
      saveAnswer();
      var nVertices = automata.graph.getVerticesCount();
      if(nVertices > maxNbStates){
         $("#feedback").text("The number of states is greater than "+maxNbStates);
      }
   }

   function resetCallback() {
      $("#feedback").empty();
   };

   function saveAnswer() {
      answer = $("#input_regex").val();
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
