function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         width: 540,
         height: 350,
         visualGraph: '{"vertexVisualInfo":{"v_0":{"x":110,"y":166},"v_1":{"x":268,"y":76},"v_2":{"x":337,"y":187},"v_3":{"x":434,"y":86},"v_4":{"x":482,"y":212},"v_5":{"x":375,"y":315},"v_6":{"x":209,"y":317}},"edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"v_6":{"target":true}},"edgeInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{}},"edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_2":["v_3","v_2"],"e_3":["v_3","v_4"],"e_4":["v_2","v_6"],"e_5":["v_2","v_5"]},"directed":true}}'
      },
      medium: {
         width: 540,
         height: 360,
         visualGraph: '{"vertexVisualInfo":{"v_0":{"x":96,"y":293},"v_1":{"x":232,"y":325},"v_2":{"x":371,"y":332},"v_3":{"x":378,"y":236},"v_4":{"x":250,"y":211},"v_5":{"x":84,"y":190},"v_6":{"x":178,"y":108},"v_7":{"x":479,"y":168},"v_8":{"x":352,"y":122},"v_9":{"x":434,"y":71},"v_10":{"x":258,"y":55},"v_11":{"x":72,"y":70},"v_12":{"x":480,"y":279}},"edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"v_6":{},"v_7":{},"v_8":{},"v_9":{},"v_10":{},"v_11":{"target":true},"v_12":{"target":true}},"edgeInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{}},"edgeVertices":{"e_0":["v_6","v_11"],"e_1":["v_8","v_10"],"e_2":["v_9","v_8"],"e_3":["v_5","v_6"],"e_4":["v_4","v_5"],"e_5":["v_4","v_6"],"e_6":["v_0","v_1"],"e_7":["v_1","v_4"],"e_8":["v_1","v_2"],"e_9":["v_2","v_3"],"e_10":["v_3","v_12"],"e_11":["v_3","v_7"],"e_12":["v_8","v_4"],"e_13":["v_4","v_3"]},"directed":true}}'
      },
      hard: {
         width: 700,
         height: 580,
         edgeMarking: true,
         visualGraph: '{"vertexVisualInfo":{"v_0":{"x":251,"y":171},"v_4":{"x":356,"y":171},"v_5":{"x":182,"y":237},"v_6":{"x":183,"y":317},"v_7":{"x":423,"y":237},"v_8":{"x":421,"y":328},"v_9":{"x":253,"y":368},"v_10":{"x":338,"y":368},"v_11":{"x":106,"y":441},"v_12":{"x":106,"y":102},"v_13":{"x":23,"y":237},"v_14":{"x":106,"y":238},"v_17":{"x":24,"y":321},"v_18":{"x":107,"y":321},"v_19":{"x":251,"y":22},"v_20":{"x":250,"y":103},"v_23":{"x":355,"y":22},"v_24":{"x":356,"y":103},"v_25":{"x":503,"y":106},"v_26":{"x":503,"y":237},"v_27":{"x":603,"y":237},"v_30":{"x":504,"y":329},"v_31":{"x":603,"y":329},"v_32":{"x":249,"y":442},"v_33":{"x":252,"y":527},"v_36":{"x":348,"y":444},"v_37":{"x":349,"y":528},"v_38":{"x":503,"y":444},"v_1":{"x":28,"y":30},"v_2":{"x":582,"y":32},"v_3":{"x":587,"y":515},"v_15":{"x":33,"y":517}},"edgeVisualInfo":{"e_0":{},"e_1":{},"e_5":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{},"e_16":{},"e_17":{},"e_20":{},"e_22":{},"e_23":{},"e_26":{},"e_27":{},"e_31":{},"e_32":{},"e_33":{},"e_34":{},"e_37":{},"e_38":{},"e_46":{},"e_48":{},"e_49":{},"e_50":{},"e_51":{},"e_52":{},"e_53":{},"e_54":{},"e_55":{},"e_56":{},"e_57":{},"e_58":{},"e_59":{},"e_60":{},"e_61":{},"e_62":{},"e_63":{},"e_64":{},"e_65":{},"e_69":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_14":{},"e_15":{},"e_18":{},"e_19":{},"e_24":{},"e_25":{},"e_2":{},"e_3":{},"e_4":{},"e_21":{},"e_28":{},"e_29":{},"e_30":{},"e_35":{},"e_36":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_4":{},"v_5":{},"v_6":{},"v_7":{},"v_8":{},"v_9":{},"v_10":{},"v_11":{},"v_12":{},"v_13":{},"v_14":{},"v_17":{},"v_18":{},"v_19":{},"v_20":{},"v_23":{},"v_24":{},"v_25":{},"v_26":{},"v_27":{},"v_30":{},"v_31":{},"v_32":{},"v_33":{},"v_36":{},"v_37":{},"v_38":{},"v_1":{"target":true},"v_2":{"target":true},"v_3":{"target":true},"v_15":{"target":true}},"edgeInfo":{"e_0":{},"e_1":{},"e_5":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{},"e_16":{},"e_17":{},"e_20":{},"e_22":{},"e_23":{},"e_26":{},"e_27":{},"e_31":{},"e_32":{},"e_33":{},"e_34":{},"e_37":{},"e_38":{},"e_46":{},"e_48":{},"e_49":{},"e_50":{},"e_51":{},"e_52":{},"e_53":{},"e_54":{},"e_55":{},"e_56":{},"e_57":{},"e_58":{},"e_59":{},"e_60":{},"e_61":{},"e_62":{},"e_63":{},"e_64":{},"e_65":{},"e_69":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_14":{},"e_15":{},"e_18":{},"e_19":{},"e_24":{},"e_25":{},"e_2":{},"e_3":{},"e_4":{},"e_21":{},"e_28":{},"e_29":{},"e_30":{},"e_35":{},"e_36":{}},"edgeVertices":{"e_0":["v_12","v_19"],"e_1":["v_20","v_12"],"e_5":["v_24","v_23"],"e_10":["v_25","v_23"],"e_11":["v_24","v_25"],"e_12":["v_25","v_26"],"e_13":["v_27","v_25"],"e_16":["v_38","v_30"],"e_17":["v_31","v_38"],"e_20":["v_27","v_26"],"e_22":["v_30","v_31"],"e_23":["v_11","v_32"],"e_26":["v_32","v_33"],"e_27":["v_33","v_11"],"e_31":["v_38","v_37"],"e_32":["v_36","v_38"],"e_33":["v_13","v_12"],"e_34":["v_12","v_14"],"e_37":["v_11","v_18"],"e_38":["v_17","v_11"],"e_46":["v_12","v_5"],"e_48":["v_0","v_12"],"e_49":["v_4","v_0"],"e_50":["v_4","v_7"],"e_51":["v_7","v_8"],"e_52":["v_10","v_8"],"e_53":["v_9","v_10"],"e_54":["v_9","v_6"],"e_55":["v_5","v_6"],"e_56":["v_0","v_10"],"e_57":["v_10","v_7"],"e_58":["v_7","v_0"],"e_59":["v_4","v_25"],"e_60":["v_25","v_7"],"e_61":["v_38","v_8"],"e_62":["v_10","v_38"],"e_63":["v_11","v_6"],"e_64":["v_9","v_11"],"e_65":["v_36","v_37"],"e_69":["v_0","v_5"],"e_6":["v_31","v_27"],"e_7":["v_30","v_26"],"e_8":["v_37","v_33"],"e_9":["v_36","v_32"],"e_14":["v_20","v_24"],"e_15":["v_23","v_19"],"e_18":["v_19","v_24"],"e_19":["v_20","v_19"],"e_24":["v_37","v_32"],"e_25":["v_31","v_26"],"e_2":["v_13","v_17"],"e_3":["v_17","v_14"],"e_4":["v_17","v_18"],"e_21":["v_18","v_14"],"e_28":["v_13","v_14"],"e_29":["v_12","v_1"],"e_30":["v_11","v_15"],"e_35":["v_38","v_3"],"e_36":["v_25","v_2"]},"directed":true}}'
         /* Reduced graph used for building screenshot for the solution:
         '{"vertexVisualInfo":{"v_0":{"x":251,"y":171},"v_7":{"x":423,"y":237},"v_10":{"x":338,"y":368},"v_11":{"x":105,"y":444},"v_12":{"x":106,"y":102},"v_25":{"x":501,"y":102},"v_38":{"x":501,"y":444},"v_1":{"x":28,"y":30},"v_2":{"x":582,"y":32},"v_3":{"x":587,"y":515},"v_15":{"x":33,"y":517}},"edgeVisualInfo":{"e_48":{},"e_56":{},"e_58":{},"e_60":{},"e_62":{},"e_29":{},"e_30":{},"e_35":{},"e_36":{},"e_0":{},"e_1":{},"e_2":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_7":{},"v_10":{},"v_11":{},"v_12":{},"v_25":{},"v_38":{},"v_1":{"target":true},"v_2":{"target":true},"v_3":{"target":true},"v_15":{"target":true}},"edgeInfo":{"e_48":{},"e_56":{},"e_58":{},"e_60":{},"e_62":{},"e_29":{},"e_30":{},"e_35":{},"e_36":{},"e_0":{},"e_1":{},"e_2":{}},"edgeVertices":{"e_48":["v_0","v_12"],"e_56":["v_0","v_10"],"e_58":["v_7","v_0"],"e_60":["v_25","v_7"],"e_62":["v_10","v_38"],"e_29":["v_12","v_1"],"e_30":["v_11","v_15"],"e_35":["v_38","v_3"],"e_36":["v_25","v_2"],"e_0":["v_12","v_25"],"e_1":["v_38","v_25"],"e_2":["v_38","v_11"]},"directed":true}}'*/
       }
   };

   var paper;
   var graph;
   var visualGraph;
   var graphDrawer;
   var graphMouse;
   var clicker;

   var vertexThreshold = 0;
   var edgeThreshold = 20;

   var graphParams = {
      circleAttr: {
         r: 20,
         fill: "#EEEEEE",
         stroke: "black",
         "stroke-width": 1
      },
      targetAttr: {
         fill: "#BB0000"
      },
      selectedAttr: {
         fill: "#7777FF" 
      },
      lineAttr: {
         "stroke-width": 5,
         "arrow-end": "wide-classic-long",
         stroke: "black"
      },
      selectedLineAttr: {
         "stroke-width": 5,
         "stroke": "#22FF22"
      }
   };

   subTask.loadLevel = function(curLevel, curState) {
      level = curLevel;
      state = curState;
      initGraph();
      initSolution();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      loadSelection();
   };

   subTask.resetDisplay = function() {
      initPaper();
      updateVisualSelection();
      showFeedback(null);
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return {
         vertices: {},
         markedEdges: {}
      };
   };

   subTask.getDefaultStateObject = function() {
      return {};
   };

   subTask.unloadLevel = function(callback) {
      if(clicker) {
         clicker.setEnabled(false);
      }
      if (visualGraph) {
         visualGraph.remove();
      }
      callback();
   };
   
   var initGraph = function() {
      graph = Graph.fromMinimized(JSON.parse(data[level].visualGraph).minGraph);
      initTargets();
      initSolution();
   };
   
   var initTargets = function() {
      if(data[level].targets) {
         return;
      }
      data[level].targets = {};
      graph.forEachVertex(function(vertex, info) {
         if(info.target) {
            data[level].targets[vertex] = true;
         }
      });
   };
   
   var initSolution = function() {
      if(data[level].solution) {
         return;
      }
      data[level].solution = {};
      graph.forEachVertex(function(vertex, info) {
         if(info.target) {
            return;
         }
         if(reachesAllTargets(vertex)) {
            data[level].solution[vertex] = true;
         }
      });
   };
   
   var reachesAllTargets = function(vertex) {
      var reachable = graph.getReachableVertices(vertex);
      var reachableObject = {};
      for(var iVertex in reachable) {
         reachableObject[reachable[iVertex]] = true;
      }
      for(var target in data[level].targets) {
         if(!reachableObject[target]) {
            return false;
         }
      }
      return true;
   };

   var loadSelection = function() {
      graph.forEachVertex(function(vertex, info) {
         if(info.target) {
            return;
         }
         if(answer === undefined || answer === null) {
            info.selected = false;
         }
         else {
            info.selected = !!(answer.vertices[vertex]);
         }
      });
   };

   var initPaper = function() {
      paper = subTask.raphaelFactory.create("anim", "anim", data[level].width, data[level].height);
      graphDrawer = new SimpleGraphDrawer(graphParams.circleAttr, graphParams.lineAttr);
      visualGraph = VisualGraph.fromJSON(data[level].visualGraph, "visual", paper, graph, graphDrawer, true);
      graphMouse = new GraphMouse("mouse", graph, visualGraph);
      clicker = new FuzzyClicker("clicker", "anim", paper, graph, visualGraph, onClick, true, true, false, vertexThreshold, edgeThreshold, true);

      graph.forEachEdge(updateVisualEdge);
   };

   var onClick = function(type, id) {
      if(type == "vertex") {
         if(data[level].targets[id]) {
            showFeedback(taskStrings.cannotSelect);
            return;
         }
         showFeedback(null);
         var info = graph.getVertexInfo(id);
         info.selected = !info.selected;
         updateVisualVertex(id, info);
      }
      else {
         if(!data[level].edgeMarking) {
            return;
         }
         if(answer.markedEdges[id]) {
            delete answer.markedEdges[id];
         }
         else {
            answer.markedEdges[id] = true;
         }
         updateVisualEdge(id);
      }
   };

   var updateVisualEdge = function(id) {
      var element = visualGraph.getRaphaelsFromID(id)[0];
      if(answer.markedEdges[id]) {
         element.attr(graphParams.selectedLineAttr);
      }
      else {
         element.attr(graphParams.lineAttr);
      }
   };
   
   var updateVisualVertex = function(id, info) {
      var attr;
      if(info.selected) {
         attr = graphParams.selectedAttr;
         answer.vertices[id] = true;
      }
      else {
         if(data[level].targets[id]) {
            attr = graphParams.targetAttr;
         }
         else {
            attr = graphParams.circleAttr;
         }
         if(answer.vertices[id]) {
            delete answer.vertices[id];
         }
      }
      visualGraph.getRaphaelsFromID(id)[0].attr(attr);
   };
   
   var updateVisualSelection = function() {
      graph.forEachVertex(updateVisualVertex);
   };

   var getResultAndMessage = function() {
      var vertex;
      var wrong = 0;
      for(vertex in data[level].solution) {
         if(!answer.vertices[vertex]) {
            if (level == "hard") {
              wrong++;
            } else {
              return {
                 successRate: 0,
                 message: taskStrings.tooFew
              };
            }
         }
      }
      for(vertex in answer.vertices) {
         if(!reachesAllTargets(vertex)) {
            if (level == "hard") {
              wrong++;
            } else {
              return {
                 successRate: 0,
                 message: (level == "easy") ? taskStrings.tooManyEasy : taskStrings.tooMany
              };
            }
         }
      }
      if (level == "hard" && wrong > 0) {
        if (wrong <= 3) { 
          return {
             successRate: 0.5,
             message: taskStrings.wrong + " " + taskStrings.close
          };
        } else {
          return {
             successRate: 0,
             message: taskStrings.wrong
          };
        }
      }
      return {
         successRate: 1,
         message: taskStrings.success
      };
   };

   var showFeedback = function(string) {
      if(!string) {
         string = "";
      }
      $("#feedback").html(string);
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
