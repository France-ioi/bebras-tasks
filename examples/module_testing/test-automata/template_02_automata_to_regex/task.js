function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         // regex: '(A|B)C',
         vGraph: {
            "vertexVisualInfo":{"v_0":{"x":224,"y":128},"v_2":{"x":384,"y":128},"v_1":{"x":544,"y":128}},
            "edgeVisualInfo":{"e_1":{"sweep":1,"large-arc":0,"radius-ratio":0.53},"e_3":{},"e_0":{"sweep":0,"large-arc":0,"radius-ratio":0.53}},
            "minGraph":{
               "vertexInfo":{"v_0":{"label":"","initial":true},"v_2":{"label":""},"v_1":{"label":"","terminal":true}},
               "edgeInfo":{"e_1":{"label":"A"},"e_3":{"label":"C"},"e_0":{"label":"B"}},
               "edgeVertices":{"e_1":["v_0","v_2"],"e_3":["v_2","v_1"],"e_0":["v_0","v_2"]},
               "directed":true
            }
         },
         transitionTable: {
            "s0":{"A":["s1"],"B":["s1"]},
            "s1":{"C":["s2"]},
            "s2":{}
         },
         start: "s0",
         end: "s2",
         paperHeight: 270
      },
      medium: {
         // regex: 'A+B[C-E]{3}',
         vGraph: {
            "vertexVisualInfo":{"v_0":{"x":96,"y":128},"v_2":{"x":192,"y":128},"v_5":{"x":672,"y":128},"v_1":{"x":288,"y":128},"v_3":{"x":416,"y":128},"v_4":{"x":544,"y":128}},
            "edgeVisualInfo":{"e_1":{"sweep":1,"large-arc":0,"radius-ratio":0},"e_0":{"angle":89.6948823410121,"radius-ratio":1.5},"e_2":{"radius-ratio":0,"sweep":0,"large-arc":0},"e_3":{},"e_4":{"radius-ratio":0,"sweep":0,"large-arc":0},"e_5":{"radius-ratio":0,"sweep":0,"large-arc":0},"e_6":{"sweep":0,"large-arc":0,"radius-ratio":0.51},"e_7":{"sweep":0,"large-arc":0,"radius-ratio":0.51},"e_8":{"sweep":0,"large-arc":0,"radius-ratio":0.51},"e_9":{"sweep":1,"large-arc":0,"radius-ratio":0.52},"e_10":{"sweep":1,"large-arc":0,"radius-ratio":0.52},"e_11":{"sweep":1,"large-arc":0,"radius-ratio":0.52}},
            "minGraph":{
               "vertexInfo":{"v_0":{"label":"","initial":true},"v_2":{"label":""},"v_5":{"label":"","terminal":true},"v_1":{"label":""},"v_3":{"label":""},"v_4":{"label":""}},
               "edgeInfo":{"e_1":{"label":"A"},"e_0":{"label":"A"},"e_2":{"label":"D"},"e_3":{"label":"B"},"e_4":{"label":"D"},"e_5":{"label":"D"},"e_6":{"label":"E"},"e_7":{"label":"E"},"e_8":{"label":"E"},"e_9":{"label":"C"},"e_10":{"label":"C"},"e_11":{"label":"C"}},
               "edgeVertices":{"e_1":["v_0","v_2"],"e_0":["v_0","v_0"],"e_2":["v_1","v_3"],"e_3":["v_2","v_1"],"e_4":["v_3","v_4"],"e_5":["v_4","v_5"],"e_6":["v_1","v_3"],"e_7":["v_3","v_4"],"e_8":["v_4","v_5"],"e_9":["v_1","v_3"],"e_10":["v_3","v_4"],"e_11":["v_4","v_5"]},
               "directed":true
            }
         },
         transitionTable: {
            "s0":{"A":["s0","s1"]},
            "s1":{"B":["s2"]},
            "s2":{"C":["s3"],"D":["s3"],"E":["s3"]},
            "s3":{"C":["s4"],"D":["s4"],"E":["s4"]},
            "s4":{"C":["s5"],"D":["s5"],"E":["s5"]},
            "s5":{}
         },
         start: "s0",
         end: "s5",
         paperHeight: 300
      },
      hard: {
         // regex: 'A(B?|FG)[CH][DE]*',
         vGraph: {
            "vertexVisualInfo":{"v_0":{"x":128,"y":128},"v_1":{"x":384,"y":128},"v_2":{"x":256,"y":128},"v_3":{"x":192,"y":256},"v_4":{"x":512,"y":128},"v_5":{"x":640,"y":128}},
            "edgeVisualInfo":{"e_0":{"radius-ratio":0.51,"sweep":1,"large-arc":0},"e_1":{"sweep":1,"large-arc":0,"radius-ratio":0},"e_2":{"radius-ratio":0,"sweep":0,"large-arc":0},"e_3":{},"e_4":{},"e_5":{"sweep":1,"large-arc":0,"radius-ratio":0.51},"e_6":{"angle":90.26286209784908,"radius-ratio":1.5},"e_7":{"angle":-88.69127686273137,"radius-ratio":1.5},"e_8":{},"e_9":{}},
            "minGraph":{
               "vertexInfo":{"v_0":{"label":"","initial":true},"v_1":{"label":"","terminal":false},"v_2":{"label":""},"v_3":{"label":""},"v_4":{"label":""},"v_5":{"label":"","terminal":true}},
               "edgeInfo":{"e_0":{"label":""},"e_1":{"label":"B"},"e_2":{"label":"C"},"e_3":{"label":"F"},"e_4":{"label":"G"},"e_5":{"label":"H"},"e_6":{"label":"D"},"e_7":{"label":"E"},"e_8":{"label":""},"e_9":{"label":""}},
               "edgeVertices":{"e_0":["v_0","v_2"],"e_1":["v_0","v_2"],"e_2":["v_2","v_1"],"e_3":["v_0","v_3"],"e_4":["v_3","v_2"],"e_5":["v_2","v_1"],"e_6":["v_4","v_4"],"e_7":["v_4","v_4"],"e_8":["v_1","v_4"],"e_9":["v_4","v_5"]},
               "directed":true
            }
         },
         transitionTable: {
            "s0":{"A":["s1"]},
            "s1":{"B":["s3"],"F":["s2"],"":["s3"]},
            "s2":{"G":["s3"]},
            "s3":{"C":["s4"],"H":["s4"]},
            "s4":{"D":["s4"],"E":["s4"],"":["s5"]},
            "s5":{}
         },
         start: "s0",
         end: "s5",
         paperHeight: 350
      }
   };

   var vGraph;
   var regex;

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

   var targetNFA;

   var selectedCircleAttr = {
      stroke: "blue",
      "stroke-width": 6
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      displayHelper.customValidate = validation;
      vGraph = JSON.parse(JSON.stringify(data[level].vGraph));
      // regex = data[level].regex;
      // targetNFA = new NFA(alphabet,data[level].transitionTable,[data[level].start],[data[level].end]);
      paperHeight = data[level].paperHeight;
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
      initPaper();
      initAutomata();
      // initRegex();
      // updateAutomata();
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
      $("#input_regex").val("");
      callback();
   };

   subTask.getGrade = function(callback) {
      callback({
         successRate: 1, message: taskStrings.success
      });
   };

   function initPaper() {
      graphPaper = subTask.raphaelFactory.create("graph", "graph", paperWidth, paperHeight);
      graphPaper.rect(1,1,paperWidth-2,paperHeight-2);
      sequencePaper = subTask.raphaelFactory.create("sequence","sequence",paperWidth,50);
   };

   // function initRegex() {
   //    // $("#alphabet").append(text);
   // };

   function initAutomata() {
      var settings = {
         subTask: subTask,
         graphPaper: graphPaper,
         graphPaperElementID: "graph",
         visualGraphJSON: JSON.stringify(vGraph),
         circleAttr: defaultCircleAttr,
         edgeAttr: defaultLineAttr,
         sequencePaper: sequencePaper,
         // sequence: sequence,
         seqLettersAttr: seqLettersAttr,
         resetCallback: resetCallback,
         callback: saveAnswer,
         alphabet: alphabet,
         // targetNFA: targetNFA,
         enabled: true
      };
      automata = new Automata(settings);
      automata.setEditEnabled(false);
   };

   function validation() {
      automata.resetAnimation();
      var regex = $("#input_regex").val();
      var error = automata.regexToNFA(regex);
      if(error){
         $("#feedback").text(error);
         return;
      }
      var res = automata.compareWithTarget();
      if(res.error){
         $("#feedback").text(res.error);
         return;
      }
      if(res.equivalent){
         displayHelper.validate("stay");
      }else{
         if(res["e_c"][0]){
            automata.setSequence(res["e_c"][0]);
            var text = "The following string is accepted by the automata but doesn't match the regex:<br>"+res["e_c"][0];
         }else{
            automata.setSequence(res["e_c"][1]);
            var text = "The following string is not accepted by the automata but matches the regex:<br>"+res["e_c"][1];
         }
         automata.run();
         $("#feedback").html(text);
      }
   };

   function handleResult(result) {
      var text = result.message;
      if(result.nEdges > 1)
         text += " "+result.nEdges+" edges available";
      $("#feedback").text(text);
   };

   function resetCallback() {
      // $("#result").empty();
      $("#feedback").empty();
   };

   function saveAnswer() {
      answer = automata.visualGraph.toJSON();
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
