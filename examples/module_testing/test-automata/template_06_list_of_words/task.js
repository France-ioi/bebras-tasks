function initTask(subTask) {
   var answer = null;
   var data = {
      easy: {
         wordList: [ "AC", "BC" ],
         maxNbStates: 3,
         paperHeight: 270
      },
      medium: {
         wordList: [ "BC", "BD", "BE", "ABC", "ABD", "ABE" ],
         maxNbStates: 4,
         paperHeight: 300
      },
      hard: {
         wordList: [ "CD", "HD", "BCD", "BHD", "FGCD", "FGHD" ],
         maxNbStates: 5,
         paperHeight: 350
      }
   };

   var vGraph = {
      "vertexVisualInfo":{"v_0":{"x":192,"y":128},"v_1":{"x":320,"y":128},"v_2":{"x":448,"y":128},"v_3":{"x":576,"y":128}},
      "edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{}},
      "minGraph":{
         "vertexInfo":{"v_0":{"label":"","initial":true},"v_1":{"label":""},"v_2":{"label":""},"v_3":{"label":"","terminal":true}},
         "edgeInfo":{"e_0":{"label":"A"},"e_1":{"label":"B"},"e_2":{"label":"C"}},
         "edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_2":["v_2","v_3"]},
         "directed":true
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

   var paperWidth = 770;
   var paperHeight;
   var margin = 10;

   var graphPaper;
   var seqPaper;
   var graph;
   var automata;
   var regex;
   var wordlist;
   var maxNbStates;


   var selectedCircleAttr = {
      stroke: "blue",
      "stroke-width": 6
   };

   function initInstructions() {
      $("#nbStates").text(maxNbStates);
      var html = "";
      for(var word of wordList){
         html += word+"<br>";
      }
      $("#list").html(html);
   };

   subTask.resetDisplay = function() {
      initInstructions();
   };

   function loadLevel(level) {
      paperHeight = data[level].paperHeight;
      wordList = data[level].wordList.slice();
      maxNbStates = data[level].maxNbStates;
      $("#input_word").val("");
   };

   function loadAnswer(answer) {
      vGraph = JSON.parse(answer);
   };

   function saveAnswer() {
      return subTask.automata.visualGraph.toJSON();
   };

   function initPaper() {
      graphPaper = subTask.raphael("graph", "graph", paperWidth, paperHeight);
      graphPaper.rect(1,1,paperWidth-2,paperHeight-2);
      sequencePaper = subTask.raphael("sequence","sequence",paperWidth,50);
   };

   function onGraphChange() {
      var nVertices = subTask.automata.graph.getVerticesCount();
      if(nVertices > maxNbStates){
         $("#feedback").text("The number of states is greater than "+maxNbStates);
      }
   }

   function getAutomataSettings() {
      return {
         mode: 6,
         graphPaper: graphPaper,
         graphPaperElementID: "graph",
         visualGraphJSON: JSON.stringify(vGraph),
         circleAttr: defaultCircleAttr,
         edgeAttr: defaultLineAttr,
         sequencePaper: sequencePaper,
         seqLettersAttr: seqLettersAttr,
         callback: onGraphChange,
         alphabet: alphabet,
         wordList: wordList,
         maxNbStates: maxNbStates,
         enabled: true
      };
   };

   AutomataTask(subTask, loadLevel, loadAnswer, saveAnswer, initPaper, getAutomataSettings);
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
