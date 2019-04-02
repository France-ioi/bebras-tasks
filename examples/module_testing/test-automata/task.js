function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;

   var defaultVisualGraph = {
      "vertexVisualInfo":{"v_0":{"x":64,"y":128},"v_1":{"x":192,"y":128},"v_2":{"x":320,"y":128},"v_3":{"x":448,"y":128},"v_4":{"x":576,"y":128},"v_5":{"x":704,"y":128},"v_6":{"x":320,"y":224},"v_7":{"x":448,"y":224}},
      "edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{}},
      "minGraph":{"vertexInfo":{"v_0":{"terminal":true},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{"terminal":true},"v_6":{},"v_7":{}},
      "edgeInfo":{"e_0":{"label":"E"},"e_1":{"label":"B"},"e_2":{"label":"C"},"e_3":{"label":"D"},"e_4":{"label":"E"},"e_5":{"label":"F"},"e_6":{"label":"G"},"e_7":{"label":"H"}},
      "edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_2":["v_2","v_3"],"e_3":["v_3","v_4"],"e_4":["v_4","v_5"],"e_5":["v_1","v_6"],"e_6":["v_6","v_7"],"e_7":["v_7","v_4"]},
      "directed":true}};
   var startID = "v_0";
   var endID = "v_5";

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
   var sequence = ["E","M","I","L","E"];
   var alphabet = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];

   var paperWidth = 750;
   var paperHeight = 350;
   var margin = 10;

   var graphPaper;
   var seqPaper;
   var graph;
   // var visualGraph;
   // var graphMouse;
   // var graphDrawer;
   var automata;
   // var graphEditor;
   // var snapToGrid;

   var selectedCircleAttr = {
      stroke: "blue",
      "stroke-width": 6
   };

   // var gridLineAttr = {
   //    stroke: "black",
   //    opacity: 0.5,
   //    "stroke-width": 1
   // };

   // var vertexTextAttr = {
   //    "font-size": 16,
   //    "fill": "white"
   // };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      displayHelper.customValidate = validation;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initPaper();
      initAlphabet();
      initAutomata();
      initHandlers();
      updateAutomata();
      
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [];
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      if(automata){
         automata.stopAnimation();
         automata.setEnabled(false);
      }
      callback();
   };

   subTask.getGrade = function(callback) {
      callback({
         successRate: 1
      });
   };

   function initPaper() {
      graphPaper = subTask.raphaelFactory.create("graph", "graph", paperWidth, paperHeight);
      sequencePaper = subTask.raphaelFactory.create("sequence","sequence",paperWidth/2,50);
   };

   function initAlphabet() {
      $("#alphabet").empty();
      var text = "<h3>Alphabet:</h3>";
      for(var letter of alphabet){
         text += letter + " ";
      }
      $("#alphabet").append(text);
   };

   function initAutomata() {
      var settings = {
         subTask: subTask,
         graphPaper: graphPaper,
         graphPaperElementID: "graph",
         visualGraphJSON: JSON.stringify(defaultVisualGraph),
         startID: startID,
         endID: endID,
         circleAttr: defaultCircleAttr,
         edgeAttr: defaultLineAttr,
         sequencePaper: sequencePaper,
         sequence: sequence,
         seqLettersAttr: seqLettersAttr,
         resetCallback: resetCallback,
         alphabet: alphabet,
         enabled: true
      };
      automata = new Automata(settings);
   };

   var initHandlers = function() {
      $("#createVertex").off("change");
      $("#createVertex").change(function(){
         automata.setCreateVertexEnabled(this.checked);
      });
      $("#createEdge").off("change");
      $("#createEdge").change(function(){
         automata.setCreateEdgeEnabled(this.checked);
      });
      $("#dragVertex").off("change");
      $("#dragVertex").change(function(){
         automata.setVertexDragEnabled(this.checked);
      });
      $("#dragEdge").off("change");
      $("#dragEdge").change(function(){
         automata.setEdgeDragEnabled(this.checked);
      });
      $("#multipleEdges").off("change");
      $("#multipleEdges").change(function(){
         automata.setMultipleEdgesEnabled(this.checked);
      });
      $("#loop").off("change");
      $("#loop").change(function(){
         automata.setLoopEnabled(this.checked);
      });
      $("#terminal").off("change");
      $("#terminal").change(function(){
         automata.setTerminalEnabled(this.checked);
      });
      $("#editVertexLabel").off("change");
      $("#editVertexLabel").change(function(){
         automata.setEditVertexLabelEnabled(this.checked);
      });
      $("#editEdgeLabel").off("change");
      $("#editEdgeLabel").change(function(){
         automata.setEditEdgeLabelEnabled(this.checked);
      });
      $("#defaultVertexLabel").off("change");
      $("#defaultVertexLabel").change(function(){
         automata.setDefaultVertexLabelEnabled(this.checked);
      });
      $("#defaultEdgeLabel").off("change");
      $("#defaultEdgeLabel").change(function(){
         automata.setDefaultEdgeLabelEnabled(this.checked);
      });
   };

   function updateAutomata() {
      $("#options input").each(function(){
         $(this).trigger("change");
      })
   };

   function validation() {
      automata.resetAnimation();
      automata.try(handleResult);
   };

   function handleResult(result) {
      var text = result.message;
      if(result.nEdges > 1)
         text += " "+result.nEdges+" edges available";
      $("#feedback").text(text);
   };

   function resetCallback() {
      $("#feedback").empty();
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
