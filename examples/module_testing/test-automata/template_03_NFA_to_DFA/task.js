function initTask(subTask) {
   var level = null;
   var data = {
      easy: {
         vGraph: {
            "vertexVisualInfo":{"v_0":{"x":192,"y":128},"v_1":{"x":320,"y":64},"v_2":{"x":320,"y":192},"v_3":{"x":448,"y":128},"v_4":{"x":576,"y":128}},
            "edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{}},
            "minGraph":{
               "vertexInfo":{"v_0":{"label":"","initial":true},"v_1":{"label":""},"v_2":{"label":""},"v_3":{"label":""},"v_4":{"label":"","terminal":true}},
               "edgeInfo":{"e_0":{"label":"A"},"e_1":{"label":"A","selected":false},"e_2":{"label":"C"},"e_3":{"label":"B"},"e_4":{"label":"D"}},
               "edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_2":["v_2","v_3"],"e_3":["v_1","v_3"],"e_4":["v_3","v_4"]},
               "directed":true
            }
         },
         paperHeight: 270
      },
      medium: {
         vGraph: {
            "vertexVisualInfo":{"v_0":{"x":227,"y":132.953125},"v_1":{"x":352,"y":132.953125},"v_3":{"x":483,"y":68.953125},"v_4":{"x":611,"y":132.953125},"v_5":{"x":131,"y":196.953125},"v_6":{"x":131,"y":68.953125},"v_2":{"x":480,"y":192}},
            "edgeVisualInfo":{"e_0":{},"e_3":{},"e_4":{"radius-ratio":0,"sweep":0,"large-arc":0},"e_5":{},"e_6":{},"e_1":{},"e_2":{},"e_7":{"angle":-90,"radius-ratio":1.5}},
            "minGraph":{
               "vertexInfo":{"v_0":{"label":"","initial":false},"v_1":{"label":""},"v_3":{"label":""},"v_4":{"label":"","terminal":true},"v_5":{"label":"","initial":true},"v_6":{"label":"","initial":true},"v_2":{"label":""}},
               "edgeInfo":{"e_0":{"label":"C"},"e_3":{"label":"D"},"e_4":{"label":"E"},"e_5":{"label":"B"},"e_6":{"label":"A"},"e_1":{"label":"D"},"e_2":{"label":"F"},"e_7":{"label":"F"}},
               "edgeVertices":{"e_0":["v_0","v_1"],"e_3":["v_1","v_3"],"e_4":["v_3","v_4"],"e_5":["v_5","v_0"],"e_6":["v_6","v_0"],"e_1":["v_1","v_2"],"e_2":["v_2","v_4"],"e_7":["v_2","v_2"]},
               "directed":true
            }
         },
         paperHeight: 300
      },
      hard: {
         vGraph: {
            "vertexVisualInfo":{"v_0":{"x":160,"y":192},"v_1":{"x":256,"y":96},"v_2":{"x":256,"y":288},"v_3":{"x":384,"y":96},"v_4":{"x":384,"y":288},"v_5":{"x":480,"y":192},"v_6":{"x":256,"y":416},"v_7":{"x":544,"y":64},"v_8":{"x":608,"y":192}},
            "edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{"radius-ratio":0,"sweep":0,"large-arc":0},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{"angle":-239.06992945688341,"radius-ratio":1.5},"e_12":{},"e_13":{"sweep":1,"large-arc":1,"radius-ratio":0.5}},
            "minGraph":{
               "vertexInfo":{"v_0":{"label":"","initial":true},"v_1":{"label":""},"v_2":{"label":""},"v_3":{"label":""},"v_4":{"label":""},"v_5":{"label":""},"v_6":{"label":"","initial":true},"v_7":{"label":"","initial":true},"v_8":{"label":"","terminal":true}},
               "edgeInfo":{"e_0":{"label":"A"},"e_1":{"label":"A"},"e_2":{"label":"D","selected":false},"e_3":{"label":"C"},"e_4":{"label":"E"},"e_5":{"label":"D"},"e_6":{"label":"G"},"e_7":{"label":"F"},"e_8":{"label":"I"},"e_9":{"label":"B"},"e_10":{"label":"H"},"e_11":{"label":"B"},"e_12":{"label":"H"},"e_13":{"label":"I"}},
               "edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_2":["v_6","v_2"],"e_3":["v_1","v_3"],"e_4":["v_2","v_4"],"e_5":["v_6","v_4"],"e_6":["v_4","v_5"],"e_7":["v_3","v_5"],"e_8":["v_5","v_8"],"e_9":["v_1","v_4"],"e_10":["v_7","v_5"],"e_11":["v_1","v_1"],"e_12":["v_7","v_8"],"e_13":["v_5","v_4"]},
               "directed":true
            }
         },
         paperHeight: 500
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

   var nfaPaper;
   var dfaPaper;
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
      nfaPaper = subTask.raphael("nfa", "nfa", paperWidth, paperHeight);
      nfaPaper.rect(1,1,paperWidth-2,paperHeight-2);
      sequencePaper = subTask.raphael("sequence","sequence",paperWidth,50);
      dfaPaper = subTask.raphael("dfa", "dfa", paperWidth, paperHeight);
      dfaPaper.rect(1,1,paperWidth-2,paperHeight-2);
   };

   function getAutomataSettings() {
      return {
         mode: 3,
         graphPaper: dfaPaper,
         graphPaperElementID: "dfa",
         visualGraphJSON: JSON.stringify(vGraph),
         staticGraphPaper: nfaPaper,
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
