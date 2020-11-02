function initTask(subTask) {
   var data = {
      easy: {
         regex: '(A|B)C',
         vGraph: {
            "vertexVisualInfo":{
               "v_0":{"x":224,"y":96},
               "v_1":{"x":320,"y":96},
               "v_2":{"x":416,"y":96},
               "v_3":{"x":512,"y":96}},
            "edgeVisualInfo":{
               "e_0":{},"e_1":{},"e_2":{}},
            "minGraph":{
               "vertexInfo":{"v_0":{"initial":true},"v_1":{},"v_2":{},"v_3":{"terminal":true}},
               "edgeInfo":{"e_0":{"label":"A"},"e_1":{"label":"B"},"e_2":{"label":"C"}},
               "edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_2":["v_2","v_3"]},
            "directed":true}
         },
         transitionTable: {
            "s0":{"A":["s1"],"B":["s1"]},
            "s1":{"C":["s2"]},
            "s2":{}
         },
         start: "s0",
         end: "s2",
         paperHeight: 200
      },
      medium: {
         regex: 'A+B[C-E]{3}',
         vGraph: {
            "vertexVisualInfo":{"v_0":{"x":64,"y":128},"v_1":{"x":192,"y":128},"v_2":{"x":320,"y":128},"v_3":{"x":448,"y":128},"v_4":{"x":576,"y":128},"v_5":{"x":704,"y":128},"v_6":{"x":320,"y":224},"v_7":{"x":448,"y":224}},
            "edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{}},
            "minGraph":{"vertexInfo":{"v_0":{"initial":true},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{"terminal":true},"v_6":{},"v_7":{}},
            "edgeInfo":{"e_0":{"label":"A"},"e_1":{"label":"B"},"e_2":{"label":"C"},"e_3":{"label":"D"},"e_4":{"label":"E"},"e_5":{"label":"F"},"e_6":{"label":"G"},"e_7":{"label":"H"}},
            "edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_2":["v_2","v_3"],"e_3":["v_3","v_4"],"e_4":["v_4","v_5"],"e_5":["v_1","v_6"],"e_6":["v_6","v_7"],"e_7":["v_7","v_4"]},
            "directed":true}
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
         paperHeight: 350
      },
      hard: {
         regex: 'A(B?|FG)[CH][DE]*',
         vGraph: {
            "vertexVisualInfo":{"v_0":{"x":64,"y":128},"v_1":{"x":192,"y":128},"v_2":{"x":320,"y":128},"v_3":{"x":448,"y":128},"v_4":{"x":576,"y":128},"v_5":{"x":704,"y":128},"v_6":{"x":320,"y":224},"v_7":{"x":448,"y":224}},
            "edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{}},
            "minGraph":{"vertexInfo":{"v_0":{"initial":true},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{"terminal":true},"v_6":{},"v_7":{}},
            "edgeInfo":{"e_0":{"label":"A"},"e_1":{"label":"B"},"e_2":{"label":"C"},"e_3":{"label":"D"},"e_4":{"label":"E"},"e_5":{"label":"F"},"e_6":{"label":"G"},"e_7":{"label":"H"}},
            "edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_2":["v_2","v_3"],"e_3":["v_3","v_4"],"e_4":["v_4","v_5"],"e_5":["v_1","v_6"],"e_6":["v_6","v_7"],"e_7":["v_7","v_4"]},
            "directed":true}
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

   var targetNFA;

   var selectedCircleAttr = {
      stroke: "blue",
      "stroke-width": 6
   };

   function loadLevel(level) {
      vGraph = JSON.parse(JSON.stringify(data[level].vGraph));
      regex = data[level].regex;
      targetNFA = new NFA(alphabet,data[level].transitionTable,[data[level].start],[data[level].end]);
      paperHeight = data[level].paperHeight;
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
      sequencePaper = subTask.raphael("sequence", "sequence", paperWidth, 50);
   };

   function getAutomataSettings() {
      return {
         mode: 1,
         subTask: subTask,
         graphPaper: graphPaper,
         graphPaperElementID: "graph",
         visualGraphJSON: JSON.stringify(vGraph),
         circleAttr: defaultCircleAttr,
         edgeAttr: defaultLineAttr,
         sequencePaper: sequencePaper,
         sequence: sequence,
         seqLettersAttr: seqLettersAttr,
         alphabet: alphabet,
         targetNFA: targetNFA,
         enabled: true
      };
   };

   AutomataTask(subTask, loadLevel, loadAnswer, saveAnswer, initPaper, getAutomataSettings);

   subTask.resetDisplay = function() {
      $("#regex").text(regex);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
