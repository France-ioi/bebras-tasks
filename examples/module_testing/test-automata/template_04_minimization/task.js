function initTask(subTask) {
   var level = null;
   var data = {
      easy: {
         vGraph: {
            "vertexVisualInfo":{"v_0":{"x":128,"y":128},"v_1":{"x":256,"y":128},"v_2":{"x":384,"y":64},"v_3":{"x":384,"y":192},"v_4":{"x":512,"y":192},"v_5":{"x":512,"y":64},"v_6":{"x":608,"y":128}},
            "edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{}},
            "minGraph":{
               "vertexInfo":{"v_0":{"label":"","initial":true},"v_1":{"label":""},"v_2":{"label":""},"v_3":{"label":""},"v_4":{"label":""},"v_5":{"label":""},"v_6":{"label":"","terminal":true}},
               "edgeInfo":{"e_0":{"label":"A"},"e_1":{"label":"B"},"e_2":{"label":"C"},"e_3":{"label":"D","selected":false},"e_4":{"label":"D"},"e_5":{"label":"E"},"e_6":{"label":"E"}},
               "edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_2":["v_1","v_3"],"e_3":["v_3","v_4"],"e_4":["v_2","v_5"],"e_5":["v_5","v_6"],"e_6":["v_4","v_6"]},
               "directed":true
            }
         },
         paperHeight: 270
      },
      medium: {
         vGraph: {
            "vertexVisualInfo":{"v_0":{"x":224,"y":256},"v_1":{"x":224,"y":64},"v_2":{"x":385,"y":65.046875},"v_3":{"x":384,"y":256},"v_4":{"x":544,"y":64},"v_5":{"x":448,"y":160}},
            "edgeVisualInfo":{"e_0":{"radius-ratio":0.85,"sweep":0,"large-arc":0},"e_1":{"sweep":0,"large-arc":0,"radius-ratio":0.94},"e_2":{},"e_3":{},"e_4":{},"e_5":{"sweep":1,"large-arc":0,"radius-ratio":0},"e_6":{"sweep":0,"large-arc":0,"radius-ratio":0},"e_7":{"sweep":0,"large-arc":0,"radius-ratio":0.52},"e_8":{"angle":-1.4673213547123112,"radius-ratio":1.5}},
            "minGraph":{
               "vertexInfo":{"v_0":{"label":"","initial":true},"v_1":{"label":""},"v_2":{"label":""},"v_3":{"label":""},"v_4":{"label":"","terminal":true},"v_5":{"label":"","terminal":true}},
               "edgeInfo":{"e_0":{"label":"A"},"e_1":{"label":"A"},"e_2":{"label":"B"},"e_3":{"label":"B"},"e_4":{"label":"B"},"e_5":{"label":"C"},"e_6":{"label":"C"},"e_7":{"label":"B"},"e_8":{"label":"D"}},
               "edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_0"],"e_2":["v_1","v_2"],"e_3":["v_0","v_3"],"e_4":["v_2","v_4"],"e_5":["v_3","v_5"],"e_6":["v_2","v_5"],"e_7":["v_3","v_4"],"e_8":["v_5","v_5"]},
               "directed":true
            }
         },
         paperHeight: 330
      },
      hard: {
         vGraph: {
            "vertexVisualInfo":{"v_0":{"x":256,"y":64},"v_1":{"x":384,"y":64},"v_2":{"x":512,"y":64},"v_3":{"x":608,"y":160},"v_4":{"x":544,"y":256},"v_5":{"x":416,"y":256},"v_6":{"x":288,"y":256},"v_7":{"x":192,"y":160}},
            "edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{"angle":0,"radius-ratio":1.5},"e_11":{"angle":-179.65080073383618,"radius-ratio":1.5}},
            "minGraph":{
               "vertexInfo":{"v_0":{"label":"","initial":true,"terminal":true},"v_1":{"label":""},"v_2":{"label":""},"v_3":{"label":""},"v_4":{"label":"","terminal":true},"v_5":{"label":""},"v_6":{"label":""},"v_7":{"label":""}},
               "edgeInfo":{"e_0":{"label":"A"},"e_1":{"label":"B"},"e_2":{"label":"C","selected":false},"e_3":{"label":"D"},"e_4":{"label":"A"},"e_5":{"label":"B"},"e_6":{"label":"C"},"e_7":{"label":"D"},"e_8":{"label":"E"},"e_9":{"label":"E"},"e_10":{"label":"F"},"e_11":{"label":"F"}},
               "edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_2":["v_2","v_3"],"e_3":["v_3","v_4"],"e_4":["v_4","v_5"],"e_5":["v_5","v_6"],"e_6":["v_6","v_7"],"e_7":["v_7","v_0"],"e_8":["v_5","v_2"],"e_9":["v_1","v_6"],"e_10":["v_3","v_3"],"e_11":["v_7","v_7"]},
               "directed":true
            }
         },
         paperHeight: 330
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

   var notMinimizedPaper;
   var minimizedPaper;
   var seqPaper;
   var graph;
   var automata;

   var selectedCircleAttr = {
      stroke: "blue",
      "stroke-width": 6
   };

   function loadLevel(curLevel) {
      level = curLevel;
      vGraph = JSON.parse(JSON.stringify(data[level].vGraph));
      paperHeight = data[level].paperHeight;
      $("#input_regex").val("");
   };

   function loadAnswer(answer) {
      vGraph = JSON.parse(answer);
   };

   function saveAnswer() {
      return subTask.automata.visualGraph.toJSON();
   };

   function initPaper() {
      notMinimizedPaper = subTask.raphael("not_minimized", "not_minimized", paperWidth, paperHeight);
      notMinimizedPaper.rect(1,1,paperWidth-2,paperHeight-2);
      sequencePaper = subTask.raphael("sequence","sequence",paperWidth,50);
      minimizedPaper = subTask.raphael("minimized", "minimized", paperWidth, paperHeight);
      minimizedPaper.rect(1,1,paperWidth-2,paperHeight-2);
   };

   function getAutomataSettings() {
      return {
         mode: 4,
         graphPaper: minimizedPaper,
         graphPaperElementID: "minimized",
         visualGraphJSON: JSON.stringify(vGraph),
         subTask: subTask,
         staticGraphPaper: notMinimizedPaper,
         staticVisualGraphJSON: JSON.stringify(data[level].vGraph),
         circleAttr: defaultCircleAttr,
         edgeAttr: defaultLineAttr,
         sequencePaper: sequencePaper,
         seqLettersAttr: seqLettersAttr,
         alphabet: alphabet,
         enabled: true
      };
   };

   AutomataTask(subTask, loadLevel, loadAnswer, saveAnswer, initPaper, getAutomataSettings);
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
