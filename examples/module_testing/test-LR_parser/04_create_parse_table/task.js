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
         input: "a + b * c",
         visualGraphJSON: {
            "vertexVisualInfo":{
               "v_0":{"x":99,"y":87,"tableMode":true},
               "v_1":{"x":209,"y":307,"tableMode":true},
               "v_2":{"x":307,"y":51.046875,"tableMode":true},
               "v_3":{"x":271,"y":205.046875,"tableMode":true},
               "v_4":{"x":479,"y":52.046875,"tableMode":true},
               "v_5":{"x":453,"y":208.046875,"tableMode":true},
               "v_6":{"x":451,"y":354.046875,"tableMode":true},
               "v_7":{"x":669,"y":190.046875,"tableMode":true},
               "v_8":{"x":658,"y":355.046875,"tableMode":true},
               "v_9":{"x":649,"y":52.046875,"tableMode":true},
               "v_10":{"x":74,"y":355.046875,"tableMode":true}
            },
            "edgeVisualInfo":{
               "e_0":{"radius-ratio":2.16,"sweep":0,"large-arc":0},
               "e_1":{"sweep":0,"large-arc":0,"radius-ratio":0},
               "e_2":{"sweep":0,"large-arc":0,"radius-ratio":1.07},
               "e_3":{"sweep":0,"large-arc":0,"radius-ratio":0.99},
               "e_4":{"sweep":0,"large-arc":0,"radius-ratio":2.79},
               "e_5":{"sweep":0,"large-arc":0,"radius-ratio":1.3},
               "e_6":{"sweep":0,"large-arc":0,"radius-ratio":0.68},
               "e_7":{"sweep":0,"large-arc":0,"radius-ratio":2.31},
               "e_8":{"sweep":0,"large-arc":0,"radius-ratio":4.02},
               "e_9":{"sweep":0,"large-arc":0,"radius-ratio":0},
               "e_10":{"sweep":1,"large-arc":0,"radius-ratio":1.01},
               "e_11":{"sweep":0,"large-arc":0,"radius-ratio":0.7},
               "e_12":{"sweep":0,"large-arc":0,"radius-ratio":2.5},
               "e_13":{"sweep":0,"large-arc":0,"radius-ratio":2}
            },
            "minGraph":{
               "vertexInfo":{
                  "v_0":{"label":"0","content":"S' -> .S $\nS -> .E * c\nE -> .E * B\nE -> .E + B\nE -> .B \nB -> .a \nB -> .b"},
                  "v_1":{"label":"1","content":"S -> E. * c\nE -> E. * B\nE -> E. + B"},
                  "v_2":{"label":"2","content":"E -> B."},
                  "v_3":{"label":"3","content":"B -> a."},
                  "v_4":{"label":"4","content":"B -> b."},
                  "v_5":{"label":"5","content":"S -> E * .c\nE -> E * .B\nB -> .a\nB -> .b"},
                  "v_6":{"label":"6","content":"E -> E + .B\nB -> .a\nB -> .b"},
                  "v_7":{"label":"8","content":"E -> E * B."},
                  "v_8":{"label":"9","content":"E -> E + B."},
                  "v_9":{"label":"7","content":"S -> E * c.","terminal":false},
                  "v_10":{"label":"10","terminal":true,"content":"S' -> S. $"}
               },
               "edgeInfo":{
                  "e_0":{"label":"E"},
                  "e_1":{"label":"B"},
                  "e_2":{"label":"a"},
                  "e_3":{"label":"b"},
                  "e_4":{"label":"*"},
                  "e_5":{"label":"+"},
                  "e_6":{"label":"B"},
                  "e_7":{"label":"a"},
                  "e_8":{"label":"b"},
                  "e_9":{"label":"B"},
                  "e_10":{"label":"a"},
                  "e_11":{"label":"b"},
                  "e_12":{"label":"c"},
                  "e_13":{"label":"S"}
               },
               "edgeVertices":{
                  "e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_2":["v_0","v_3"],"e_3":["v_0","v_4"],"e_4":["v_1","v_5"],
                  "e_5":["v_1","v_6"],"e_6":["v_5","v_7"],"e_7":["v_5","v_3"],"e_8":["v_5","v_4"],"e_9":["v_6","v_8"],
                  "e_10":["v_6","v_3"],"e_11":["v_6","v_4"],"e_12":["v_5","v_9"],"e_13":["v_0","v_10"]
               },
               "directed":true
            }
         },
         paperHeight: 410
      },
      medium: {
         rules: [ 
            "S -> E * c",
            "E -> E * B",
            "E -> E + B",
            "E -> B",
            "B -> a",
            "B -> ''" ],
         input: "a + * c",
         visualGraphJSON: {
            "vertexVisualInfo":{
               "v_0":{"x":110,"y":90,"tableMode":true},
               "v_1":{"x":252,"y":289,"tableMode":true},
               "v_2":{"x":282,"y":57.046875,"tableMode":true},
               "v_3":{"x":282,"y":180.046875,"tableMode":true},
               "v_5":{"x":468,"y":76.046875,"tableMode":true},
               "v_6":{"x":480,"y":280.046875,"tableMode":true},
               "v_7":{"x":654,"y":175.046875,"tableMode":true},
               "v_8":{"x":654,"y":293.046875,"tableMode":true},
               "v_9":{"x":652,"y":57.046875,"tableMode":true},
               "v_10":{"x":78,"y":294.046875,"tableMode":true}
            },
            "edgeVisualInfo":{
               "e_0":{"radius-ratio":2.16,"sweep":0,"large-arc":0},
               "e_1":{"sweep":0,"large-arc":0,"radius-ratio":0},
               "e_2":{"sweep":0,"large-arc":0,"radius-ratio":1.07},
               "e_4":{"sweep":0,"large-arc":0,"radius-ratio":2.58},
               "e_5":{"sweep":0,"large-arc":0,"radius-ratio":1.04},
               "e_6":{"sweep":0,"large-arc":0,"radius-ratio":0.68},
               "e_7":{"sweep":0,"large-arc":0,"radius-ratio":2.31},
               "e_9":{"sweep":0,"large-arc":0,"radius-ratio":0},
               "e_10":{"sweep":1,"large-arc":0,"radius-ratio":1.01},
               "e_12":{"sweep":0,"large-arc":0,"radius-ratio":2.5},
               "e_13":{"sweep":0,"large-arc":0,"radius-ratio":2}
            },
            "minGraph":{
               "vertexInfo":{
                  "v_0":{"label":"0","content":"S' -> .S $\nS -> .E * c\nE -> .E * B\nE -> .E + B\nE -> .B \nB -> .a \nB -> ."},
                  "v_1":{"label":"1","content":"S -> E. * c\nE -> E.* B\nE -> E.+ B"},
                  "v_2":{"label":"2","content":"E -> B."},
                  "v_3":{"label":"3","content":"B -> a."},
                  "v_5":{"label":"4","content":"S -> E * .c\nE -> E *.B\nB -> .a\nB -> ."},
                  "v_6":{"label":"5","content":"E -> E +.B\nB -> .a\nB -> ."},
                  "v_7":{"label":"7","content":"E -> E * B."},
                  "v_8":{"label":"8","content":"E -> E + B."},
                  "v_9":{"label":"6","content":"S -> E * c.","terminal":false},
                  "v_10":{"label":"9","terminal":true,"content":"S' -> S. $"}
               },
               "edgeInfo":{
                  "e_0":{"label":"E"},"e_1":{"label":"B"},"e_2":{"label":"a"},"e_4":{"label":"*"},"e_5":{"label":"+"},"e_6":{"label":"B"},"e_7":{"label":"a"},"e_9":{"label":"B"},
                  "e_10":{"label":"a"},"e_12":{"label":"c"},"e_13":{"label":"S"}
               },
               "edgeVertices":{
                  "e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_2":["v_0","v_3"],"e_4":["v_1","v_5"],"e_5":["v_1","v_6"],"e_6":["v_5","v_7"],"e_7":["v_5","v_3"],
                  "e_9":["v_6","v_8"],"e_10":["v_6","v_3"],"e_12":["v_5","v_9"],"e_13":["v_0","v_10"]
               },
               "directed":true
            }
         },
         paperHeight: 370
      },
      hard: {
         rules: [ 
            "S -> E * c",
            "E -> E * B",
            "E -> E + B",
            "E -> B",
            "B -> ''",
            "B -> b" ],
         input: "+ b * c",
         visualGraphJSON: {
            "vertexVisualInfo":{
               "v_0":{"x":107,"y":99,"tableMode":true},
               "v_1":{"x":221,"y":286,"tableMode":true},
               "v_2":{"x":287,"y":64.046875,"tableMode":true},
               "v_3":{"x":283,"y":163.046875,"tableMode":true},
               "v_5":{"x":453,"y":80.046875,"tableMode":true},
               "v_6":{"x":460,"y":261.046875,"tableMode":true},
               "v_7":{"x":652,"y":167.046875,"tableMode":true},
               "v_8":{"x":646,"y":284.046875,"tableMode":true},
               "v_9":{"x":652,"y":62.046875,"tableMode":true},
               "v_10":{"x":78,"y":300.046875,"tableMode":true}
            },
            "edgeVisualInfo":{
               "e_0":{"radius-ratio":2.16,"sweep":0,"large-arc":0},
               "e_1":{"sweep":0,"large-arc":0,"radius-ratio":0},
               "e_2":{"sweep":0,"large-arc":0,"radius-ratio":1.07},
               "e_4":{"sweep":0,"large-arc":0,"radius-ratio":2.58},
               "e_5":{"sweep":0,"large-arc":0,"radius-ratio":1.04},
               "e_6":{"sweep":0,"large-arc":0,"radius-ratio":0.68},
               "e_7":{"sweep":0,"large-arc":0,"radius-ratio":2.31},
               "e_9":{"sweep":0,"large-arc":0,"radius-ratio":0},
               "e_10":{"sweep":1,"large-arc":0,"radius-ratio":1.01},
               "e_12":{"sweep":0,"large-arc":0,"radius-ratio":2.5},
               "e_13":{"sweep":0,"large-arc":0,"radius-ratio":0.87}
            },
            "minGraph":{
               "vertexInfo":{
                  "v_0":{"label":"0","content":"S' -> .S $\nS -> .E * c\nE -> .E * B\nE -> .E + B\nE -> .B \nB -> .\nB -> .b"},
                  "v_1":{"label":"1","content":"S -> E. * c\nE -> E.* B\nE -> E.+ B"},
                  "v_2":{"label":"2","content":"E -> B."},
                  "v_3":{"label":"3","content":"B -> b."},
                  "v_5":{"label":"4","content":"S -> E * .c\nE -> E *.B\nB -> .\nB -> .b"},
                  "v_6":{"label":"5","content":"E -> E +.B\nB -> .\nB -> .b"},
                  "v_7":{"label":"7","content":"E -> E * B."},
                  "v_8":{"label":"8","content":"E -> E + B."},
                  "v_9":{"label":"6","content":"S -> E * c.","terminal":false},
                  "v_10":{"label":"9","terminal":true,"content":"S' -> S. $"}
               },
               "edgeInfo":{
                  "e_0":{"label":"E"},"e_1":{"label":"B"},"e_2":{"label":"b","selected":false},"e_4":{"label":"*"},"e_5":{"label":"+"},
                  "e_6":{"label":"B"},"e_7":{"label":"b"},"e_9":{"label":"B"},"e_10":{"label":"b"},"e_12":{"label":"c"},"e_13":{"label":"S"}
               },
               "edgeVertices":{
                  "e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_2":["v_0","v_3"],"e_4":["v_1","v_5"],"e_5":["v_1","v_6"],"e_6":["v_5","v_7"],
                  "e_7":["v_5","v_3"],"e_9":["v_6","v_8"],"e_10":["v_6","v_3"],"e_12":["v_5","v_9"],"e_13":["v_0","v_10"]
               },
               "directed":true
            }
         },
         paperHeight: 360
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
      var defaultAnswer = [];
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
         mode: 4,
         rules: rules,
         input: input,

         paperHeight: paperHeight,
         paperWidth: paperWidth,
         visualGraphJSON: visualGraphJSON,
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
