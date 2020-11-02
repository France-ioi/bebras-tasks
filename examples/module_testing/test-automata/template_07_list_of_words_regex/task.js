function initTask(subTask) {
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

   subTask.resetDisplay = function() {
      initInstructions();
      initHandlers();
   };

   function loadLevel(level) {
      wordList = data[level].wordList.slice();
      maxNbChar = data[level].maxNbChar;
      $("#input_regex").off("keyup");
      $("#input_regex").val("");
   };

   function loadAnswer(answer) {
      $("#input_regex").val(answer);
   };

   function initPaper() {};

   function getAutomataSettings() {
      return {
         mode: 7,
         alphabet: alphabet,
         wordList: wordList,
         maxNbChar: maxNbChar,
         enabled: true
      };
   };

   function saveAnswer() {
      return $("#input_regex").val();
   };

   AutomataTask(subTask, loadLevel, loadAnswer, saveAnswer, initPaper, getAutomataSettings);
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
