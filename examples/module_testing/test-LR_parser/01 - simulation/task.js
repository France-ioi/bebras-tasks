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
               "v_0":{"x":113,"y":113,"tableMode":true},
               "v_1":{"x":216,"y":350,"tableMode":true},
               "v_2":{"x":322,"y":60.046875,"tableMode":true},
               "v_3":{"x":285,"y":234.046875,"tableMode":true},
               "v_4":{"x":487,"y":57.046875,"tableMode":true},
               "v_5":{"x":461,"y":243.046875,"tableMode":true},
               "v_6":{"x":437,"y":421.046875,"tableMode":true},
               "v_7":{"x":664,"y":253.046875,"tableMode":true},
               "v_8":{"x":665,"y":420.046875,"tableMode":true},
               "v_9":{"x":655,"y":65.046875,"tableMode":true},
               "v_10":{"x":73,"y":434.046875,"tableMode":true}
            },
            "edgeVisualInfo":{
               "e_0":{"radius-ratio":2.16,"sweep":0,"large-arc":0},
               "e_1":{"sweep":0,"large-arc":0,"radius-ratio":0},
               "e_2":{"sweep":0,"large-arc":0,"radius-ratio":1.07},
               "e_3":{"sweep":0,"large-arc":0,"radius-ratio":0.99},
               "e_4":{"sweep":0,"large-arc":0,"radius-ratio":2.58},
               "e_5":{"sweep":0,"large-arc":0,"radius-ratio":1.04},
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
                  "v_1":{"label":"1","content":"S -> E. * c\nE -> E.* B\nE -> E.+ B"},
                  "v_2":{"label":"2","content":"E -> B."},
                  "v_3":{"label":"3","content":"B -> a."},
                  "v_4":{"label":"4","content":"B -> b."},
                  "v_5":{"label":"5","content":"S -> E * .c\nE -> E *.B\nB -> .a\nB -> .b"},
                  "v_6":{"label":"6","content":"E -> E +.B\nB -> .a\nB -> .b"},
                  "v_7":{"label":"8","content":"E -> E * B."},
                  "v_8":{"label":"9","content":"E -> E + B."},
                  "v_9":{"label":"7","content":"S -> E * c.","terminal":false},
                  "v_10":{"label":"10","terminal":true,"content":"S' -> S. $"}
               },
               "edgeInfo":{
                  "e_0":{"label":"E"},"e_1":{"label":"B"},"e_2":{"label":"a"},"e_3":{"label":"b"},"e_4":{"label":"*"},"e_5":{"label":"+"},
                  "e_6":{"label":"B"},"e_7":{"label":"a"},"e_8":{"label":"b"},"e_9":{"label":"B"},"e_10":{"label":"a"},"e_11":{"label":"b"},
                  "e_12":{"label":"c"},"e_13":{"label":"S"}
               },
               "edgeVertices":{
                  "e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_2":["v_0","v_3"],"e_3":["v_0","v_4"],"e_4":["v_1","v_5"],"e_5":["v_1","v_6"],
                  "e_6":["v_5","v_7"],"e_7":["v_5","v_3"],"e_8":["v_5","v_4"],"e_9":["v_6","v_8"],"e_10":["v_6","v_3"],"e_11":["v_6","v_4"],
                  "e_12":["v_5","v_9"],"e_13":["v_0","v_10"]
               },
               "directed":true
            }
         }

      },
      medium: {
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
               "v_0":{"x":113,"y":113,"tableMode":true},
               "v_1":{"x":216,"y":350,"tableMode":true},
               "v_2":{"x":322,"y":60.046875,"tableMode":true},
               "v_3":{"x":285,"y":234.046875,"tableMode":true},
               "v_4":{"x":487,"y":57.046875,"tableMode":true},
               "v_5":{"x":461,"y":243.046875,"tableMode":true},
               "v_6":{"x":437,"y":421.046875,"tableMode":true},
               "v_7":{"x":664,"y":253.046875,"tableMode":true},
               "v_8":{"x":665,"y":420.046875,"tableMode":true},
               "v_9":{"x":655,"y":65.046875,"tableMode":true},
               "v_10":{"x":73,"y":434.046875,"tableMode":true}
            },
            "edgeVisualInfo":{
               "e_0":{"radius-ratio":2.16,"sweep":0,"large-arc":0},
               "e_1":{"sweep":0,"large-arc":0,"radius-ratio":0},
               "e_2":{"sweep":0,"large-arc":0,"radius-ratio":1.07},
               "e_3":{"sweep":0,"large-arc":0,"radius-ratio":0.99},
               "e_4":{"sweep":0,"large-arc":0,"radius-ratio":2.58},
               "e_5":{"sweep":0,"large-arc":0,"radius-ratio":1.04},
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
                  "v_1":{"label":"1","content":"S -> E. * c\nE -> E.* B\nE -> E.+ B"},
                  "v_2":{"label":"2","content":"E -> B."},
                  "v_3":{"label":"3","content":"B -> a."},
                  "v_4":{"label":"4","content":"B -> b."},
                  "v_5":{"label":"5","content":"S -> E * .c\nE -> E *.B\nB -> .a\nB -> .b"},
                  "v_6":{"label":"6","content":"E -> E +.B\nB -> .a\nB -> .b"},
                  "v_7":{"label":"8","content":"E -> E * B."},
                  "v_8":{"label":"9","content":"E -> E + B."},
                  "v_9":{"label":"7","content":"S -> E * c.","terminal":false},
                  "v_10":{"label":"10","terminal":true,"content":"S' -> S. $"}
               },
               "edgeInfo":{
                  "e_0":{"label":"E"},"e_1":{"label":"B"},"e_2":{"label":"a"},"e_3":{"label":"b"},"e_4":{"label":"*"},"e_5":{"label":"+"},
                  "e_6":{"label":"B"},"e_7":{"label":"a"},"e_8":{"label":"b"},"e_9":{"label":"B"},"e_10":{"label":"a"},"e_11":{"label":"b"},
                  "e_12":{"label":"c"},"e_13":{"label":"S"}
               },
               "edgeVertices":{
                  "e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_2":["v_0","v_3"],"e_3":["v_0","v_4"],"e_4":["v_1","v_5"],"e_5":["v_1","v_6"],
                  "e_6":["v_5","v_7"],"e_7":["v_5","v_3"],"e_8":["v_5","v_4"],"e_9":["v_6","v_8"],"e_10":["v_6","v_3"],"e_11":["v_6","v_4"],
                  "e_12":["v_5","v_9"],"e_13":["v_0","v_10"]
               },
               "directed":true
            }
         }
      },
      hard: {
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
               "v_0":{"x":113,"y":113,"tableMode":true},
               "v_1":{"x":216,"y":350,"tableMode":true},
               "v_2":{"x":322,"y":60.046875,"tableMode":true},
               "v_3":{"x":285,"y":234.046875,"tableMode":true},
               "v_4":{"x":487,"y":57.046875,"tableMode":true},
               "v_5":{"x":461,"y":243.046875,"tableMode":true},
               "v_6":{"x":437,"y":421.046875,"tableMode":true},
               "v_7":{"x":664,"y":253.046875,"tableMode":true},
               "v_8":{"x":665,"y":420.046875,"tableMode":true},
               "v_9":{"x":655,"y":65.046875,"tableMode":true},
               "v_10":{"x":73,"y":434.046875,"tableMode":true}
            },
            "edgeVisualInfo":{
               "e_0":{"radius-ratio":2.16,"sweep":0,"large-arc":0},
               "e_1":{"sweep":0,"large-arc":0,"radius-ratio":0},
               "e_2":{"sweep":0,"large-arc":0,"radius-ratio":1.07},
               "e_3":{"sweep":0,"large-arc":0,"radius-ratio":0.99},
               "e_4":{"sweep":0,"large-arc":0,"radius-ratio":2.58},
               "e_5":{"sweep":0,"large-arc":0,"radius-ratio":1.04},
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
                  "v_1":{"label":"1","content":"S -> E. * c\nE -> E.* B\nE -> E.+ B"},
                  "v_2":{"label":"2","content":"E -> B."},
                  "v_3":{"label":"3","content":"B -> a."},
                  "v_4":{"label":"4","content":"B -> b."},
                  "v_5":{"label":"5","content":"S -> E * .c\nE -> E *.B\nB -> .a\nB -> .b"},
                  "v_6":{"label":"6","content":"E -> E +.B\nB -> .a\nB -> .b"},
                  "v_7":{"label":"8","content":"E -> E * B."},
                  "v_8":{"label":"9","content":"E -> E + B."},
                  "v_9":{"label":"7","content":"S -> E * c.","terminal":false},
                  "v_10":{"label":"10","terminal":true,"content":"S' -> S. $"}
               },
               "edgeInfo":{
                  "e_0":{"label":"E"},"e_1":{"label":"B"},"e_2":{"label":"a"},"e_3":{"label":"b"},"e_4":{"label":"*"},"e_5":{"label":"+"},
                  "e_6":{"label":"B"},"e_7":{"label":"a"},"e_8":{"label":"b"},"e_9":{"label":"B"},"e_10":{"label":"a"},"e_11":{"label":"b"},
                  "e_12":{"label":"c"},"e_13":{"label":"S"}
               },
               "edgeVertices":{
                  "e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_2":["v_0","v_3"],"e_3":["v_0","v_4"],"e_4":["v_1","v_5"],"e_5":["v_1","v_6"],
                  "e_6":["v_5","v_7"],"e_7":["v_5","v_3"],"e_8":["v_5","v_4"],"e_9":["v_6","v_8"],"e_10":["v_6","v_3"],"e_11":["v_6","v_4"],
                  "e_12":["v_5","v_9"],"e_13":["v_0","v_10"]
               },
               "directed":true
            }
         }
      }
   };

   var rules;
   var input;
   var lrParser;

   var paperHeight = 500;
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

      visualGraphJSON = JSON.stringify(data[level].visualGraphJSON);
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initParser();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = null;
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
      lrParser = new LR_Parser({
         divID: "lrParser",
         mode: 1,
         rules: rules,
         input: input,

         paperHeight: paperHeight,
         paperWidth: paperWidth,
         visualGraphJSON: visualGraphJSON,
      },subTask);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
