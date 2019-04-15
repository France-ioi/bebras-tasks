function initTask(subTask) {
   var state = {};
   var level;
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

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      displayHelper.customValidate = validation;
      paperHeight = data[level].paperHeight;
      wordList = data[level].wordList.slice();
      maxNbStates = data[level].maxNbStates;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer)
         vGraph = JSON.parse(answer);
   };

   subTask.resetDisplay = function() {
      initInstructions();
      initPaper();
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
      $("#input_word").val("");
      callback();
   };

   subTask.getGrade = function(callback) {
      callback({
         successRate: 1, message: taskStrings.success
      });
   };

   function initInstructions() {
      $("#nbStates").text(maxNbStates);
      var html = "";
      for(var word of wordList){
         html += word+"<br>";
      }
      $("#list").html(html);
   };

   function initPaper() {
      graphPaper = subTask.raphaelFactory.create("graph", "graph", paperWidth, paperHeight);
      graphPaper.rect(1,1,paperWidth-2,paperHeight-2);
      sequencePaper = subTask.raphaelFactory.create("sequence","sequence",paperWidth,50);
   };

   function initAutomata() {
      var settings = {
         mode: 6,
         subTask: subTask,
         graphPaper: graphPaper,
         graphPaperElementID: "graph",
         visualGraphJSON: JSON.stringify(vGraph),
         circleAttr: defaultCircleAttr,
         edgeAttr: defaultLineAttr,
         sequencePaper: sequencePaper,
         seqLettersAttr: seqLettersAttr,
         resetCallback: resetCallback,
         callback: onGraphChange,
         alphabet: alphabet,
         wordList: wordList,
         maxNbStates: maxNbStates,
         enabled: true
      };
      automata = new Automata(settings);
   };

   function validation() {
      saveAnswer();
      var res = automata.validate();
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
      answer = automata.visualGraph.toJSON();
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
