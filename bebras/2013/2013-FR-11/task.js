function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         graph: { 
            "vertexInfo": { 
               "00":{}, "01":{}, "02":{}, "03":{}, "04":{}, "05":{}, "06":{}, "07":{}, "08":{}, "09":{} },
            "edgeInfo": { 
               "00_01":{critical:true}, "01_02":{critical:true}, "00_03":{}, "00_04":{}, "03_04":{}, "04_05":{critical:true}, "00_06":{critical:true}, 
               "00_07":{}, "00_08":{}, "07_08":{}, "08_09":{critical:true} },
            "edgeVertices": { 
               "00_01": ["00","01"], "01_02": ["01","02"], "00_03": ["00","03"], "00_04": ["00","04"], "03_04": ["03","04"], "04_05": ["04","05"],
               "00_06": ["00","06"], "00_07": ["00","07"], "00_08": ["00","08"], "07_08": ["07","08"], "08_09": ["08","09"] },
            "directed": false 
         },
         vertexPos: { 
            "00":{ "x": 222, "y": 167 }, 
            "01":{ "x":266, "y":61 }, 
            "02":{ "x":167, "y":41 }, 
            "03":{ "x":361,"y":197 },
            "04":{ "x":295,"y":252 }, 
            "05":{ "x":284,"y":302 }, 
            "06":{ "x":166,"y":252 }, 
            "07":{ "x":108,"y":206 },
            "08":{ "x":125,"y":121 }, 
            "09":{ "x":64,"y":44 }
         },
         minEdges: 2,
         paperHeight: 320
      },
      medium: {
         graph: { 
            "vertexInfo": { 
               "00":{}, "01":{}, "02":{}, "03":{}, "04":{}, "05":{}, "06":{}, "07":{}, "08":{}, "09":{}, "10":{}, 
               "11":{}, "12":{}, "13":{}, "14":{}, "15":{}, "16":{}, "17":{} },
            "edgeInfo": { 
               "00_01":{critical:true}, "01_02":{critical:true}, "01_04":{critical:true}, "02_03":{critical:true}, "00_05":{}, "05_06":{}, "06_07":{critical:true}, 
               "07_08":{critical:true}, "07_09":{critical:true}, "00_10":{}, "10_11":{}, "11_12":{critical:true}, "06_11":{}, "00_13":{}, "13_14":{}, "00_15":{}, 
               "14_15":{}, "15_16":{}, "15_17":{}, "16_17":{}, "17_18":{critical:true} },
            "edgeVertices": { 
               "00_01": ["00","01"], "01_02": ["01","02"], "01_04": ["01","04"], "02_03": ["02","03"], "00_05": ["00","05"],
               "05_06": ["05","06"], "06_07": ["06","07"], "07_08": ["07","08"], "07_09": ["07","09"], "00_10": ["00","10"],
               "10_11": ["10","11"], "11_12": ["11","12"], "06_11": ["06","11"], "00_13": ["00","13"], "13_14": ["13","14"],
               "00_15": ["00","15"], "14_15": ["14","15"], "15_16": ["15","16"], "15_17": ["15","17"], "16_17": ["16","17"],
               "17_18": ["17","18"] },
            "directed": false 
         },
         vertexPos: { 
            "00":{ "x": 208, "y": 168 }, 
            "01":{ "x": 130, "y": 152 }, 
            "02":{ "x": 160, "y": 83 }, 
            "03":{ "x": 162, "y": 18 },
            "04":{ "x": 93, "y": 69 }, 
            "05":{ "x": 202, "y": 106 }, 
            "06":{ "x": 277, "y": 112 }, 
            "07":{ "x": 298, "y": 56 },
            "08":{ "x": 242, "y": 34 }, 
            "09":{ "x": 368, "y": 76 }, 
            "10":{ "x": 292, "y": 198 },
            "11":{ "x": 340, "y": 140 }, 
            "12":{ "x": 401, "y": 154 }, 
            "13":{ "x": 261, "y": 238 },
            "14":{ "x": 215, "y": 281 },  
            "15":{ "x": 162, "y": 217 },
            "16":{ "x": 107, "y": 272 }, 
            "17":{ "x": 85, "y": 203 }, 
            "18":{ "x": 32, "y": 142 }
         },
         minEdges: 3,
         paperHeight: 310
      },
      hard: {
         graph: { 
            "vertexInfo": { 
               "00":{}, "01":{}, "02":{}, "03":{}, "04":{}, "05":{}, "06":{}, "07":{}, "08":{}, "09":{}, "10":{}, 
               "11":{}, "12":{}, "13":{}, "14":{}, "15":{}, "16":{}, "17":{}, "18":{}, "19":{}, "20":{}, "21":{}, },
            "edgeInfo": { 
               "00_01":{critical:true}, "01_02":{}, "01_03":{}, "02_03":{}, "03_04":{critical:true}, "00_05":{critical:true}, "05_06":{critical:true}, "06_07":{critical:true}, 
               "06_08":{critical:true}, "08_09":{critical:true}, "00_10":{critical:true}, "10_11":{}, "11_12":{}, "12_13":{}, "10_13":{}, "00_14":{critical:true}, 
               "14_16":{critical:true}, "14_15":{critical:true}, "15_17":{}, "15_18":{}, "17_18":{}, "15_19":{critical:true}, "19_20":{}, "19_21":{}, "20_21":{} },
            "edgeVertices": { 
               "00_01": ["00","01"], "01_02": ["01","02"], "01_03": ["01","03"], "02_03": ["02","03"], "03_04": ["03","04"], "00_05": ["00","05"],
               "05_06": ["05","06"], "06_07": ["06","07"], "06_08": ["06","08"], "08_09": ["08","09"], 
               "00_10": ["00","10"], "10_11": ["10","11"], "11_12": ["11","12"], "12_13": ["12","13"], "10_13": ["10","13"],
               "00_14": ["00","14"], "14_16": ["14","16"], "14_15": ["14","15"], "15_17": ["15","17"], "15_18": ["15","18"],
               "17_18": ["17","18"], "15_19": ["15","19"], "19_20": ["19","20"], "20_21": ["20","21"], "19_21": ["19","21"] },
            "directed": false
         },
         vertexPos: {
            "00":{"x":225,"y":168},
            "01":{"x":145,"y":149},
            "02":{"x":48,"y":134},
            "03":{"x":97,"y":60},
            "04":{"x":197,"y":33.046875},
            "05":{"x":264,"y":75.046875},
            "06":{"x":355,"y":85.046875},
            "07":{"x":416,"y":33.046875},
            "08":{"x":405,"y":168.046875},
            "09":{"x":333,"y":225.046875},
            "10":{"x":181,"y":253.046875},
            "11":{"x":49,"y":232.046875},
            "12":{"x":36,"y":320.046875},
            "13":{"x":129,"y":333.046875},
            "14":{"x":264,"y":299.046875},
            "15":{"x":240,"y":377.046875},
            "16":{"x":386,"y":324.046875},
            "17":{"x":371,"y":449.046875},
            "18":{"x":241,"y":456.046875},
            "19":{"x":163,"y":398.046875},
            "20":{"x":59,"y":403.046875},
            "21":{"x":111,"y":455.046875}
         },
         minEdges: 3,
         paperHeight: 480
      }
   };
   var paper;
   var paperHeight;
   var graph;
   var vGraph;
   var graphMouse;
   var vertexToggler;
   var pair = [];
   var newEdges = {};
   var newEdgeAttr = {"stroke-width": 10, stroke: "#6666FF"};
   var vertexAttr = {
      r: 15,
      "stroke-width": 2, 
      stroke: "black",
      fill: "white"
   };
   var selectedAttr = {
      stroke: "#6666FF", 
      "stroke-width": 4
   };
   var unselectedAttr = {
      stroke: "black", 
      "stroke-width": 2
   };
   var edgeAttr = {
      "stroke-width": 2, 
      stroke: "black"
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      graph = Graph.fromJSON(JSON.stringify(data[level].graph));
      minEdges = data[level].minEdges;
      paperHeight = data[level].paperHeight;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initPaper();
      reloadAnswer();
      updateMessage();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [];
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      var nbNewEdge = answer.length;
      var nVert = graph.getVerticesCount();
      var solGraph = Graph.fromJSON(JSON.stringify(data[level].graph));
      for(var iAns = 0; iAns < nbNewEdge; iAns++){
         var vIds = answer[iAns].split("_");
         solGraph.addEdge(answer[iAns],vIds[0],vIds[1]);
      }
      var criticalEdges = [];
      var edges = solGraph.getAllEdges();
      for(var iEdge = 0; iEdge < edges.length; iEdge++){
         var info = solGraph.getEdgeInfo(edges[iEdge]);
         if(info.critical)
            criticalEdges.push(edges[iEdge]);
      }
      for(var iEdge = 0; iEdge < criticalEdges.length; iEdge++){
         var tempGraph = Graph.fromJSON(solGraph.toJSON());
         tempGraph.removeEdge(criticalEdges[iEdge]);
         var reachVert = tempGraph.getReachableVertices("00");
         if(reachVert.length < nVert){
            return { successRate: 0, message: taskStrings.isolatedHouse };
         }
      }
      if(nbNewEdge > minEdges){
         return { successRate: 0.5, message: taskStrings.tooManyLines };
      }else{
         return { successRate: 1, message: taskStrings.success };
      }
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("graph_task","graph_task",450,paperHeight);
      initGraph();
   }

   function initGraph() {
      var graphDrawer = new SimpleGraphDrawer(vertexAttr,edgeAttr);
      graphDrawer.setDrawVertex(vertexDrawer);
      vGraph = new VisualGraph("vGraph", paper, graph, graphDrawer, true);
      initVertexPos();
      vGraph.redraw();

      var damPos = vGraph.getVertexVisualInfo("00");
      paper.text(damPos.x + 42, damPos.y - 15, taskStrings.dam).attr({'font-size': 16, 'font-weight': "bold"});

      graphMouse = new GraphMouse("graphMouse", graph, vGraph);
      vertexToggler = new VertexToggler("vTog", graph, vGraph, graphMouse, vertexToggle, true);
   }

   function initVertexPos() {
      for(var id in data[level].vertexPos){
         var posX = data[level].vertexPos[id].x;
         var posY = data[level].vertexPos[id].y;
         vGraph.setVertexVisualInfo(id,{"x":posX,"y":posY});
      }
   }

   function vertexDrawer(id,info,vInfo) {
      var pos = this._getVertexPosition(vInfo);
      this.originalPositions[id] = pos;
      var vertex = paper.circle(pos.x,pos.y).attr(vertexAttr);
      if(id === "00"){
         vertex.attr("fill","#1DF2FF");
      }
      return [vertex];
   }

   function vertexToggle(id,selected) {
      $('#error').html("");
      if(!inArray(pair,id)){
         pair.push(id);
      }else{
         pair = [];
      }
      if(pair.length === 2){
         checkPair();
         for(var iPair = 0; iPair < 2; iPair++){
            unselect(pair[iPair]);
         }
         pair = [];
      }else{
         var attr = (selected) ? selectedAttr : unselectedAttr;
         vGraph.getRaphaelsFromID(id)[0].attr(attr);
      }
   }

   function unselect(id) {
      graph.setVertexInfo(id,{selected: false});
      vGraph.getRaphaelsFromID(id)[0].attr(unselectedAttr);
   }

   function checkPair() {
      var edgeId = pair[0]+"_"+pair[1];
      var revEdgeId = pair[1]+"_"+pair[0];
      if(graph.hasNeighbor(pair[0],pair[1]) || newEdges[edgeId] || newEdges[revEdgeId]){
         $('#error').html(taskStrings.alreadyExist);
      }else{
         createEdge(pair[0],pair[1]);
         answer.push(edgeId);
         updateMessage();
      }
   }

   function createEdge(v1,v2) {
      var edgeId = v1+"_"+v2;
      var pos1 = vGraph.getVertexVisualInfo(v1);
      var pos2 = vGraph.getVertexVisualInfo(v2);
      var path = "M"+pos1.x+" "+pos1.y+"L"+pos2.x+" "+pos2.y;
      newEdges[edgeId] = paper.path(path).attr(newEdgeAttr).toBack();
      newEdges[edgeId].click(removeEdge(edgeId));
   }

   function removeEdge(id) {
      return function(){
         newEdges[id].remove();
         delete newEdges[id];
         for(var iAnswer = 0; iAnswer < answer.length; iAnswer++){
            if(answer[iAnswer] === id){
               answer.splice(iAnswer,1);
               break;
            }
         }
         updateMessage();
      }
   }

   function getCriticalVertices() {
      var vertices = graph.getAllVertices();
      var criticalVertices = [];
      for(var iVertex = 0; iVertex < vertices.length; iVertex++){
         if(graph.getDegree(vertices[iVertex]) === 1)
            criticalVertices.push(vertices[iVertex]);
      }
      return criticalVertices;
   }

   function getNewEdgesVertices() {
      var vertices = [];
      for(var iAnswer = 0; iAnswer < answer.length; iAnswer++){
         var vIds = answer[iAnswer].split("_");
         for(var i = 0; i < 2; i++){
            if(!inArray(vertices,vIds[i])){
               vertices.push(vIds[i]);
            }
         }
      }
      return vertices;
   }

   function reloadAnswer() {
      for(var iAnswer = 0; iAnswer < answer.length; iAnswer++){
         var vIds = answer[iAnswer].split("_");
         createEdge(vIds[0],vIds[1]);
      }
   }

   function updateMessage() {
      $('#message').html(taskStrings.numberOfLines(answer.length));
   }

   function inArray(array,value) {  // IE8-9 bug fix
      for(var i = 0; i < array.length; i++){
         if(array[i] === value){
            return true;
         }
      }
      return false;
   }
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();


