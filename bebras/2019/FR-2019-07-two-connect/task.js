function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         visualGraphJSON: {
            "vertexVisualInfo": {
               "00":{ "x": 222, "y": 167 },
               "01":{ "x":266, "y":81 },
               "02":{ "x":167, "y":41 },
               "03":{ "x":361,"y":197 },
               "04":{ "x":275,"y":252 },
               "05":{ "x":254,"y":322 },
               "06":{ "x":166,"y":292 },
               "07":{ "x":108,"y":206 },
               "08":{ "x":125,"y":121 },
               "09":{ "x":84,"y":44 }
            },
            "edgeVisualInfo":{
               "00_01":{}, "01_02":{}, "00_03":{}, "00_04":{}, "03_04":{}, "04_05":{}, "00_06":{},
               "00_07":{}, "00_08":{}, "07_08":{}, "08_09":{}
            },
            "minGraph": {
               "vertexInfo": {
                  "00":{}, "01":{}, "02":{}, "03":{}, "04":{}, "05":{}, "06":{}, "07":{}, "08":{}, "09":{} },
               "edgeInfo": {
                  "00_01":{"critical":true}, "01_02":{"critical":true}, "00_03":{}, "00_04":{}, "03_04":{}, "04_05":{"critical":true}, "00_06":{"critical":true},
                  "00_07":{}, "00_08":{}, "07_08":{}, "08_09":{"critical":true} },
               "edgeVertices": {
                  "00_01": ["00","01"], "01_02": ["01","02"], "00_03": ["00","03"], "00_04": ["00","04"], "03_04": ["03","04"], "04_05": ["04","05"],
                  "00_06": ["00","06"], "00_07": ["00","07"], "00_08": ["00","08"], "07_08": ["07","08"], "08_09": ["08","09"] },
               "directed": false
            }
         },
         minEdges: 2,
         paperHeight: 350,
         paperWidth: 400
      },
      medium: {
         visualGraphJSON: {
           "vertexVisualInfo": {
             "00": {
               "x": 146,
               "y": 281
             },
             "v_2": {
               "x": 22,
               "y": 368,
             },
             "v_3": {
               "x": 212,
               "y": 330,
             },
             "v_4": {
               "x": 208,
               "y": 246,
             },
             "v_5": {
               "x": 246,
               "y": 288,
             },
             "v_6": {
               "x": 304,
               "y": 368,
             },
             "v_7": {
               "x": 150,
               "y": 214,
             },
             "v_8": {
               "x": 160,
               "y": 150,
             },
             "v_9": {
               "x": 85,
               "y": 208,
             },
             "v_10": {
               "x": 80,
               "y": 272,
             },
             "v_11": {
               "x": 144,
               "y": 50,
             },
             "v_1": {
               "x": 140,
               "y": 338,
             },
             "v_12": {
               "x": 80,
               "y": 98,
             },
             "v_13": {
               "x": 208,
               "y": 48,
             },
             "v_14": {
               "x": 206,
               "y": 107,
             },
             "v_15": {
               "x": 272,
               "y": 22,
             },
             "v_16": {
               "x": 23,
               "y": 23,
             }
           },
           "edgeVisualInfo": {
             "e_2": {},
             "e_3": {},
             "e_4": {},
             "e_5": {},
             "e_6": {},
             "e_0": {},
             "e_1": {},
             "e_7": {},
             "e_8": {},
             "e_9": {},
             "e_10": {},
             "e_12": {},
             "e_13": {},
             "e_14": {},
             "e_15": {},
             "e_16": {},
             "e_17": {},
             "e_11": {}
           },
           "minGraph": {
             "vertexInfo": {
               "00": {
                 "label": "00"
               },
               "v_2": {
                 "label": "v_2"
               },
               "v_3": {
                 "label": "v_3"
               },
               "v_4": {
                 "label": "v_4"
               },
               "v_5": {
                 "label": "v_5"
               },
               "v_6": {
                 "label": "v_6"
               },
               "v_7": {
                 "label": "v_7"
               },
               "v_8": {
                 "label": "v_8",
                 "terminal": false
               },
               "v_9": {
                 "label": "v_9"
               },
               "v_10": {
                 "label": "v_10"
               },
               "v_11": {
                 "label": "v_11"
               },
               "v_1": {
                 "label": "v_1"
               },
               "v_12": {
                 "label": "v_12"
               },
               "v_13": {
                 "label": "v_13"
               },
               "v_14": {
                 "label": "v_14"
               },
               "v_15": {
                 "label": "v_15"
               },
               "v_16": {
                 "label": "v_16"
               }
             },
             "edgeInfo": {
               "e_2": {
                 "critical":true
               },
               "e_3": {},
               "e_4": {},
               "e_5": {},
               "e_6": {
                 "critical":true
               },
               "e_0": {
                 "critical":true
               },
               "e_1": {
                 "critical":true
               },
               "e_7": {},
               "e_8": {},
               "e_9": {},
               "e_10": {},
               "e_12": {
                 "critical":true
               },
               "e_13": {
                 "critical":true
               },
               "e_14": {
                 "critical":true
               },
               "e_15": {
                 "critical":true
               },
               "e_16": {
                 "critical":true
               },
               "e_17": {
                 "critical":true
               },
               "e_11": {
                 "critical":true
               }
             },
             "edgeVertices": {
               "e_2": [
                 "00",
                 "v_3"
               ],
               "e_3": [
                 "v_3",
                 "v_4"
               ],
               "e_4": [
                 "v_4",
                 "v_5"
               ],
               "e_5": [
                 "v_5",
                 "v_3"
               ],
               "e_6": [
                 "v_6",
                 "v_3"
               ],
               "e_0": [
                 "v_1",
                 "00"
               ],
               "e_1": [
                 "v_1",
                 "v_2"
               ],
               "e_7": [
                 "00",
                 "v_10"
               ],
               "e_8": [
                 "v_10",
                 "v_9"
               ],
               "e_9": [
                 "v_7",
                 "v_9"
               ],
               "e_10": [
                 "v_7",
                 "00"
               ],
               "e_12": [
                 "v_8",
                 "v_11"
               ],
               "e_13": [
                 "v_11",
                 "v_12"
               ],
               "e_14": [
                 "v_13",
                 "v_11"
               ],
               "e_15": [
                 "v_14",
                 "v_13"
               ],
               "e_16": [
                 "v_15",
                 "v_13"
               ],
               "e_17": [
                 "v_16",
                 "v_11"
               ],
               "e_11": [
                 "v_8",
                 "v_7"
               ]
             }
          },
          "directed": false
         },
         minEdges: 3,
         paperHeight: 420,
         paperWidth: 330
      },
      hard: {
         visualGraphJSON: {
            "vertexVisualInfo": {
               "00":{"x":235,"y":304},
               "01":{"x":432,"y":176},
               "02":{"x":80,"y":80},
               "03":{"x":336,"y":304},
               "04":{"x":80,"y":400},
               "05":{"x":480,"y":448},
               "06":{"x":365,"y":240},
               "07":{"x":32,"y":450},
               "08":{"x":32,"y":32},
               "09":{"x":480,"y":32},
               "10":{"x":400,"y":400},
               "11":{"x":304,"y":400},
               "12":{"x":416,"y":304},
               "13":{"x":176,"y":304},
               "14":{"x":207,"y":82},
               "15":{"x":125,"y":350},
               "16":{"x":192,"y":400},
               "17":{"x":128,"y":176},
               "18":{"x":160,"y":240},
               "19":{"x":305,"y":80},
               "20":{"x":400,"y":80}
            },
            "edgeVisualInfo": {
               "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},
               "e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},
               "e_10":{},"e_11":{},"e_12":{},"e_13":{},
               "e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_18":{},
               "e_19":{},"e_20":{},"e_21":{},"e_22":{},
               "e_23":{},"e_24":{}            },
            "minGraph": {
               "vertexInfo": {
                  "00":{},"01":{},"02":{},"03":{},"04":{},
                  "05":{},"06":{},"07":{},"08":{},"09":{},
                  "10":{},"11":{},"12":{},"13":{},"14":{},
                  "15":{},"16":{},"17":{},"18":{},"19":{},"20":{}
               },
               "edgeInfo": {
                  "e_0":{"critical":true},"e_1":{"critical":true},"e_2":{},"e_3":{},"e_4":{},"e_5":{},
                  "e_6":{},"e_7":{"critical":true},"e_8":{},"e_9":{},"e_10":{},
                  "e_11":{},"e_12":{"critical":true},"e_13":{},"e_14":{},
                  "e_15":{},"e_16":{},"e_17":{},"e_18":{"critical":true},
                  "e_19":{"critical":true},"e_20":{"critical":true},
                  "e_21":{},"e_22":{},"e_23":{"critical":true},"e_24":{}
               },
               "edgeVertices": {
                  "e_0":["00","20"],
                  "e_1":["00","02"],
                  "e_2":["02","03"],
                  "e_3":["03","04"],
                  "e_4":["02","04"],
                  "e_5":["20","01"],
                  "e_6":["06","01"],
                  "e_7":["01","05"],
                  "e_8":["05","09"],
                  "e_9":["09","08"],
                  "e_10":["08","07"],
                  "e_11":["07","05"],
                  "e_12":["06","10"],
                  "e_13":["11","10"],
                  "e_14":["12","10"],
                  "e_15":["11","12"],
                  "e_16":["13","19"],
                  "e_17":["18","19"],
                  "e_18":["18","17"],
                  "e_19":["17","15"],
                  "e_20":["17","14"],
                  "e_21":["13","16"],
                  "e_22":["13","18"],
                  "e_23":["19","00"],
                  "e_24":["20","06"]
               },
               "directed": false
            }
         },
         minEdges: 3,
         paperHeight: 480,
         paperWidth: 505
      }
   };
   var paper;
   var paperHeight;
   var paperWidth;
   var graph;
   var vGraph;
   var visualGraphJSON;
   var graphMouse;
   var vertexDragAndConnect;
   var newEdges = {};
   var minEdges;
   var maxEdges;
   var obstacle;
   var unreachableVertex = null;
   var images = [$("#flower").attr("src"),$("#faucet").attr("src")];
   var waterColor = "#6ba6ff";
   var newEdgeAttr = {"stroke-width": 20, stroke: "#2222AA"};
   var vertexAttr = {
      r: 20,
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
      "stroke-width": 2,
      fill: "white"
   };
   var highlightedAttr = {
      stroke: "red",
      "stroke-width": 4
   };
   var edgeAttr = {
      "stroke-width": 2,
      stroke: "black"
   };
   var pipeOutlineAttr = {
      stroke: "black",
      "stroke-width": 10
   };
   var pipeInsideAttr = {
      stroke: "lightgrey",
      "stroke-width": 7
   };
   var obstacleAttr = {
      fill: "black",
      stroke: "none"
   }

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      visualGraphJSON = JSON.stringify(data[level].visualGraphJSON);
      minEdges = data[level].minEdges;
      maxEdges = minEdges;
      paperHeight = data[level].paperHeight;
      paperWidth = data[level].paperWidth;   
      displayHelper.customValidate = checkResult;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      $("#minEdges").text(minEdges);
      initGraph();
      reloadAnswerDisplay(graph);
      if(level == "hard") {
         $("#instructions").css({
            background:"lightblue",
            padding: "1em",
            "border-radius": "5px"
         });
      }
      displayError("");
      if (typeof(enableRtl) != "undefined") {
         $("body").attr("dir", "rtl");
         $(".largeScreen #zone_1").css("float", "right");
         $(".largeScreen #zone_2").css("float", "right");
      }
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = {
         vertexVisualInfo: JSON.stringify(data[level].visualGraphJSON.vertexVisualInfo),
         connectedPairs: []
      };
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      return result = checkResult(true);
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initGraph() {
      if(!paper){
         paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);
         $("#paper").css("width",paperWidth);
      }
      var graphDrawer = new SimpleGraphDrawer(vertexAttr,edgeAttr,null,true,null,true);
      graphDrawer.setDrawVertex(vertexDrawer);
      graphDrawer.setDrawEdge(edgeDrawer);

      var currentVisualGraph = JSON.parse(visualGraphJSON);
      currentVisualGraph.vertexVisualInfo = JSON.parse(answer.vertexVisualInfo);
      var currentVisualGraphJSON = JSON.stringify(currentVisualGraph);

      vGraph = VisualGraph.fromJSON(currentVisualGraphJSON, "vGraph", paper, null, graphDrawer, true);
      graph = vGraph.graph;

      graphMouse = new GraphMouse("graphMouse", graph, vGraph);
      vertexDragAndConnect = new VertexDragAndConnect({
         paper: paper,
         paperElementID: "paper",
         graph: graph,
         visualGraph: vGraph,
         graphMouse: graphMouse,
         onVertexSelect: vertexToggle,
         onPairSelect: checkPair,
         onEdgeSelect: onEdgeSelect,
         onDragEnd: saveAnswer,
         startDragCallback: startDragCallback,
         vertexThreshold: 0,
         edgeThreshold: 10,
         dragThreshold: 5,
         dragLimits: {
            minX: vertexAttr.r + 5,
            maxX: paperWidth - vertexAttr.r - 5,
            minY: vertexAttr.r + 5,
            maxY: paperHeight - vertexAttr.r - 5
         },
         enabled: true

      });
      if(Beav.Navigator.isIE8()){
         vertexDragAndConnect.disableDrag();
      }
   }

   function vertexDrawer(id,info,vInfo) {
      var pos = this._getVertexPosition(vInfo);
      var R = vertexAttr.r;
      this.originalPositions[id] = pos;
      var vertex = paper.circle(pos.x,pos.y).attr(vertexAttr);
      if(id === "00"){
         vertex.attr({"fill":waterColor,r:1.5*R});
         var faucetSize = 2.5*R - 10;
         var faucet = paper.image(images[1],pos.x - faucetSize/2,pos.y - faucetSize/2,faucetSize,faucetSize);
         return [vertex,faucet];
      }else{
         var flowerSize = 2*R - 10;
         var flower = paper.image(images[0],pos.x - flowerSize/2,pos.y - flowerSize/2,flowerSize,flowerSize);
         this._addCustomElements(id, [flower]);
         return [vertex,flower];
      }

   }

   function edgeDrawer(id, vertex1, vertex2) {
      var clickArea = this.paper.path(this._getEdgePath(id)).attr(this.edgeClickAreaAttr).toBack();
      var pipeInside = this.paper.path(this._getEdgePath(id)).attr(pipeInsideAttr).toBack();
      var pipeOutline = this.paper.path(this._getEdgePath(id)).attr(pipeOutlineAttr).toBack();
      var info = this.graph.getEdgeInfo(id);
      if(info["new"]){
         pipeOutline.attr(newEdgeAttr);
      }
      var labelText = info.label || "";
      var labelPos = this.getLabelPos(id, vertex1, vertex2);
      var label = this.paper.text(labelPos.x,labelPos.y,labelText).attr(this.edgeLabelAttr);
      return [pipeOutline,pipeInside,label,clickArea];
   }

   function vertexToggle(id,selected) {
      var attr = (selected) ? selectedAttr : unselectedAttr;
      vGraph.getRaphaelsFromID(id)[0].attr(attr);
   }

   function checkPair(id1,id2) {
      if(Beav.Navigator.isIE8()){
         displayError("");
         resetWaterFlow();
      }
      var edgeId = id1+"_"+id2;
      var revEdgeId = id2+"_"+id1;
      var nbNewEdges = getNewEdgesCount();
      if(nbNewEdges >= maxEdges){
         displayError(taskStrings.max(maxEdges));
      }else if(graph.hasNeighbor(id1,id2) || newEdges[edgeId] || newEdges[revEdgeId]){
         displayError(taskStrings.alreadyExist);
      }else{
         createEdge(id1,id2,graph);
         saveAnswer();
      }
   }

   function createEdge(v1,v2,grph) {
      var edgeID = v1+"_"+v2;
      grph.addEdge(edgeID, v1, v2, {"new": true});
   }

   function onEdgeSelect(id) {
      var info = graph.getEdgeInfo(id);
      if(info["new"]){
         removeEdge(id);
      }
   }

   function removeEdge(id) {
      displayError("");
      resetWaterFlow();
      graph.removeEdge(id);
      saveAnswer();
   }

   function saveAnswer() {
      answer.connectedPairs = [];
      var edges = graph.getAllEdges();
      for(var iEdge = 0; iEdge < edges.length; iEdge++){
         var edge = edges[iEdge];
         var info = graph.getEdgeInfo(edge);
         if(info["new"]){
            var vertices = graph.getEdgeVertices(edge);
            answer.connectedPairs.push(vertices);
         }
      }
      answer.vertexVisualInfo = JSON.stringify(JSON.parse(vGraph.toJSON()).vertexVisualInfo);
      // console.log(answer)
   }

   function getNewEdgesCount() {
      var initialGraph = Graph.fromJSON(JSON.stringify(JSON.parse(visualGraphJSON).minGraph));
      var currentGraph = vGraph.graph;
      var nbOfLines = currentGraph.getEdgesCount() - initialGraph.getEdgesCount();
      return nbOfLines;
   };


   function startDragCallback(id,x,y) {
      // console.log("startDragCallback")
      displayError("");
      resetWaterFlow();
      if(id == "00"){
         vertexDragAndConnect.dragThreshold = 50000;
      }else{
         vertexDragAndConnect.dragThreshold = (level == "hard") ? 5 : Infinity;
      }
   };

   function displayError(text) {
      $("#error").html(text);
   }

   function checkResult(noVisual) {
      var solGraph = Graph.fromJSON(JSON.stringify(data[level].visualGraphJSON.minGraph));
      reloadAnswerDisplay(solGraph);
      var nbNewEdge = 0;
      var nVert = solGraph.getVerticesCount();
      var criticalEdges = [];
      var edges = solGraph.getAllEdges();
      for(var iEdge = 0; iEdge < edges.length; iEdge++){
         var info = solGraph.getEdgeInfo(edges[iEdge]);
         if(info.critical){
            criticalEdges.push(edges[iEdge]);
         }
         if(info["new"]){
            nbNewEdge++;
         }
      }
      for(var iEdge = 0; iEdge < criticalEdges.length; iEdge++){
         var tempGraph = Graph.fromJSON(solGraph.toJSON());
         tempGraph.removeEdge(criticalEdges[iEdge]);
         var reachVert = tempGraph.getReachableVertices("00");
         var nMissing = nVert - reachVert.length;
         if(nMissing > 0){
            var msg = taskStrings.isolatedHouse;
            if(!noVisual){
               displayError(msg);
               showWaterFlow(criticalEdges[iEdge],reachVert);
            }
            return { successRate: 0, message: msg };
         }
      }
      if(!noVisual){
         showWaterFlow(criticalEdges[iEdge],reachVert);
         platform.validate("done");
      }else{
         if(nbNewEdge > minEdges){
            return { successRate: 0, message: "Internal error: too many edges were inserted." };
         }else{
            return { successRate: 1, message: taskStrings.success };
         }
      }
   };

   function showWaterFlow(criticalEdge,reachableVertices){
      if(!graph){
         return
      }
      var edges = graph.getAllEdges();
      var goodEdges = [];
      for(var iEdge = 0; iEdge < edges.length; iEdge++){
         var edge = edges[iEdge];
         if(edge != criticalEdge){
            var vertices = graph.getEdgeVertices(edge);
            for(var iVertex = 0; iVertex < vertices.length; iVertex++){
               var vertex = vertices[iVertex];
               if(Beav.Array.has(reachableVertices,vertex)){
                  goodEdges.push(edge);
               }
            }
         }
      }
      for(var iEdge = 0; iEdge < goodEdges.length; iEdge++){
         var edge = goodEdges[iEdge];
         var raphEdge = vGraph.getRaphaelsFromID(edge);
         raphEdge[1].attr("stroke",waterColor);
      }
      if(criticalEdge){
         var criticalVertices = graph.getEdgeVertices(criticalEdge);
         for(var iVertex = 0; iVertex < criticalVertices.length; iVertex++){
            var vertex = criticalVertices[iVertex];
            if(!Beav.Array.has(reachableVertices,vertex)){
               unreachableVertex = vertex;
               break;
            }
         }
         var pos1 = vGraph.getVertexVisualInfo(criticalVertices[0]);
         var pos2 = vGraph.getVertexVisualInfo(criticalVertices[1]);
         var obstacleX = (pos1.x + pos2.x)/2;
         var obstacleY = (pos1.y + pos2.y)/2;
         obstacle = paper.circle(obstacleX,obstacleY,5).attr(obstacleAttr);
         var unreachVertRaph = vGraph.getRaphaelsFromID(unreachableVertex);
         unreachVertRaph[0].attr(highlightedAttr);
      }
   };

   function resetWaterFlow() {
      if(obstacle){
         obstacle.remove();
      }
      var edges = graph.getAllEdges();
      for(var iEdge = 0; iEdge < edges.length; iEdge++){
         var edgeRaph = vGraph.getRaphaelsFromID(edges[iEdge]);
         edgeRaph[1].attr("stroke","lightgrey");
         if(unreachableVertex != null){
            var unreachVertRaph = vGraph.getRaphaelsFromID(unreachableVertex);
            unreachVertRaph[0].attr(unselectedAttr);
            unreachableVertex = null;
         }
      }
   };

   function reloadAnswerDisplay(grph) {
      var cPairs = answer.connectedPairs;
      for(var iPair = 0; iPair < cPairs.length; iPair++){
         var pair = cPairs[iPair];
         var v1 = pair[0];
         var v2 = pair[1];
         createEdge(v1,v2,grph);
      }
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();


