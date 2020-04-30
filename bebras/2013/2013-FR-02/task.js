function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         paperW: 349,
         paperH: 251,
         visualGraphJSON: {
            "vertexVisualInfo":{
               "v_0":{"x":80,"y":169},
               "v_1":{"x":179,"y":204},
               "v_2":{"x":138,"y":81},
               "v_3":{"x":269,"y":143},
               "v_4":{"x":236,"y":47}
            },
            "edgeVisualInfo":{
               "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{}
            },
            "minGraph":{
               "vertexInfo":{
                  "v_0":{ring:true},"v_1":{house:true},"v_2":{},"v_3":{volcano:true},"v_4":{ring:true}
               },
               "edgeInfo":{
                  "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{}
               },
               "edgeVertices":{
                  "e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_2":["v_1","v_3"],
                  "e_3":["v_3","v_4"],"e_4":["v_4","v_2"],"e_5":["v_1","v_2"]
               },
               "directed":false
            }
         }
      },
      medium: {
         paperW: 540,
         paperH: 436,
         visualGraphJSON: {
            "vertexVisualInfo":{
               "v_0":{"x":250,"y":321},
               "v_1":{"x":392,"y":337},
               "v_2":{"x":156,"y":89},
               "v_3":{"x":119,"y":308},
               "v_4":{"x":370,"y":231},
               "v_5":{"x":412,"y":72},
               "v_6":{"x":293,"y":46},
               "v_7":{"x":446,"y":160},
               "v_8":{"x":319,"y":141},
               "v_9":{"x":228,"y":210},
               "v_10":{"x":93,"y":180}
            },
            "edgeVisualInfo":{
               "e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},
               "e_12":{},"e_0":{}
            },
            "minGraph":{
               "vertexInfo":{
                  "v_0":{},"v_1":{ring:true},"v_2":{},"v_3":{ring:true},"v_4":{},"v_5":{ring:true},"v_6":{},
                  "v_7":{volcano:true},"v_8":{},"v_9":{house:true},"v_10":{volcano:true}
               },
               "edgeInfo":{
                  "e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},
                  "e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_0":{}
               },
               "edgeVertices":{
                  "e_1":["v_0","v_3"],"e_2":["v_3","v_10"],"e_3":["v_10","v_2"],"e_4":["v_2","v_6"],"e_5":["v_6","v_5"],"e_6":["v_5","v_7"],
                  "e_7":["v_7","v_4"],"e_8":["v_4","v_1"],"e_9":["v_9","v_4"],"e_10":["v_0","v_9"],"e_11":["v_9","v_8"],"e_12":["v_8","v_6"],"e_0":["v_0","v_1"]
               },
               "directed":false
            }
         }
      },
      hard: {
         paperW: 448,
         paperH: 384,
         visualGraphJSON: {
            "vertexVisualInfo":{
               "v_0":{"x":128,"y":320},
               "v_1":{"x":256,"y":320},
               "v_2":{"x":192,"y":256},
               "v_3":{"x":256,"y":192},
               "v_4":{"x":192,"y":192},
               "v_5":{"x":320,"y":256},
               "v_6":{"x":320,"y":128},
               "v_7":{"x":384,"y":192},
               "v_8":{"x":192,"y":128},
               "v_9":{"x":256,"y":64},
               "v_10":{"x":128,"y":64},
               "v_11":{"x":128,"y":192},
               "v_12":{"x":64,"y":256},
               "v_13":{"x":64,"y":128}
            },
            "edgeVisualInfo":{
               "e_0":{},"e_1":{},"e_3":{},"e_4":{},"e_5":{},"e_2":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},
               "e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_18":{},"e_19":{},"e_20":{}
            },
            "minGraph":{
               "vertexInfo":{
                  "v_0":{ring:true},"v_1":{},"v_2":{},"v_3":{},"v_4":{house:true},"v_5":{},"v_6":{},"v_7":{ring:true},
                  "v_8":{},"v_9":{volcano:true},"v_10":{ring:true},"v_11":{},"v_12":{},"v_13":{volcano:true}
               },
               "edgeInfo":{
                  "e_0":{},"e_1":{},"e_3":{},"e_4":{},"e_5":{},"e_2":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},
                  "e_11":{},"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_18":{},"e_19":{},"e_20":{}
               },
               "edgeVertices":{
                  "e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_3":["v_3","v_4"],"e_4":["v_4","v_2"],"e_5":["v_1","v_2"],
                  "e_2":["v_3","v_5"],"e_6":["v_3","v_6"],"e_7":["v_5","v_7"],"e_8":["v_6","v_7"],"e_9":["v_1","v_5"],
                  "e_10":["v_2","v_11"],"e_11":["v_8","v_9"],"e_12":["v_8","v_10"],"e_13":["v_10","v_9"],"e_14":["v_8","v_6"],
                  "e_15":["v_11","v_13"],"e_16":["v_12","v_11"],"e_18":["v_0","v_12"],
                  "e_19":["v_12","v_13"],"e_20":["v_11","v_10"]
               },
               "directed":false
            }
         }
      }
   };

   var paper;
   var paperW;
   var paperH;
   var graphDrawer;
   var graph;
   var visualGraph;
   var visualGraphJSON;

   var marginX = 10;
   var marginY = 10;
   var houseW = 32;
   var houseH = 36;
   var ringW = 46;
   var ringH = 32;
   var volcanoW = 58;
   var volcanoH = 47;

   var usedChars = [];
   var ringOrders = [];

   var imgURL = [$("#house").attr("src"),$("#ring").attr("src"),$("#volcano").attr("src")];

   var vertexAttr = {
      stroke: "black",
      fill: "blue",
      r: 5
   };
   var lineAttr = {
      stroke: "black",
      "stroke-width": 2
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      paperW = data[level].paperW;
      paperH = data[level].paperH;
      visualGraphJSON = JSON.stringify(data[level].visualGraphJSON);
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(answer){
         // rng.reset(answer.seed);
      }
   };

   subTask.resetDisplay = function () {
      displayError("");
      $("#answer input").val(answer);
      initPaper();
      initGraph();
      initHandlers();
      displayHelper.customValidate = checkResult;
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = "";
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result;
   }

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);
      $("#paper").css("width", paperW);
   };

   function initGraph() {
      graphDrawer = new SimpleGraphDrawer(vertexAttr,lineAttr);
      visualGraph = VisualGraph.fromJSON(visualGraphJSON, "vGraph", paper, null, graphDrawer, true);
      graph = visualGraph.graph;
      addImages();
   };

   function initHandlers() {
      $("#answer input").keydown(function(){
         displayError("");
      });
      $("#answer input").keyup(function(){
         answer = $(this).val();
      });
      var vertices = graph.getAllVertices();
      for(var iVertex = 0; iVertex < vertices.length; iVertex++){
      	var vertex = vertices[iVertex];
         var raph = visualGraph.getRaphaelsFromID(vertex);
         raph[0].click(showVertexID(vertex));
      }
   };

   function showVertexID(vertex) {
      return function() {
         console.log(vertex);
      }
   }; 

   function addImages() {
      var vertices = graph.getAllVertices();
      for(var iVertex = 0; iVertex < vertices.length; iVertex++){
         var vertex = vertices[iVertex];
         switch(vertex){
            case "v_0":
               if(level == "easy"){
                  addImage(vertex, -ringW-marginX, -ringH/2,1);
               }else if(level == "hard"){
                  addImage(vertex, -ringW - marginX, 0, 1);
               }
               break;
            case "v_1":
               if(level == "easy"){
                  addImage(vertex, -houseW/2, marginY,0);
               }else if(level == "medium"){
                  addImage(vertex, marginX, -ringH/4,1);
               }
               break;
            case "v_3":
               if(level == "easy"){
                  addImage(vertex, marginX, -volcanoH/2,2);
               }else if(level == "medium"){
                  addImage(vertex, -ringW - marginX, -ringH/2,1);
               }
               break;
            case "v_4":
               if(level == "easy"){
                  addImage(vertex, marginX, -ringH,1);
               }else if(level == "hard"){
                  addImage(vertex, -houseW-marginX/2, -houseH-marginY/2, 0);
               }
               break;
            case "v_5":
               if(level == "medium"){
                  addImage(vertex, marginX, -ringH,1);
               }
               break;
            case "v_7":
               if(level == "medium"){
                  addImage(vertex, marginX, -volcanoH/2, 2);
               }else if(level == "hard"){
                  addImage(vertex, marginX, -ringH/2, 1);
               }
               break;
            case "v_9":
               if(level == "medium"){
                  addImage(vertex, -houseW - marginX, -houseH*0.7, 0);
               }else if(level == "hard"){
                  addImage(vertex, marginX, -volcanoH*0.7,2);
               }
               break;
            case "v_10":
               if(level == "medium"){
                  addImage(vertex, -volcanoW - marginX, -volcanoH/2, 2);
               }else if(level == "hard"){
                  addImage(vertex, -ringW - marginX, -ringH*0.7, 1);
               }
               break; 
            case "v_13":
               if(level == "hard"){
                  addImage(vertex, -volcanoW - marginX/2, -volcanoH*0.7,2);
               }           
         }
      }
   };

   function addImage(vertex,dx,dy,id) {
      var pos = visualGraph.getVertexVisualInfo(vertex);
      var x = pos.x + dx;
      var y = pos.y + dy;
      var url = imgURL[id];
      var w, h;

      switch(id){
         case 0:
            w = houseW;
            h = houseH;
            break;
         case 1:
            w = ringW;
            h = ringH;
            break;
         case 2:
            w = volcanoW;
            h = volcanoH;
      }

      paper.image(url,x,y,w,h);
   };

   function getMinDistance() {
      var solGraph = Graph.fromJSON(JSON.stringify(data[level].visualGraphJSON.minGraph));
      var vertices = solGraph.getAllVertices();
      var house;
      var rings = [];
      var volcanoes = [];
      for(var iVertex = 0; iVertex < vertices.length; iVertex++){
         var vertex = vertices[iVertex];
         var info = solGraph.getVertexInfo(vertex);
         if(info.house){
            house = vertex;
         }else if(info.ring){
            rings.push(vertex);
         }else if(info.volcano){
            volcanoes.push(vertex);
         }
      }
      var distFromHouse = solGraph.bfs(house).distances;
      var distFromRing = {};
      var distFromVolcano = {};
      for(var iRing = 0; iRing < rings.length; iRing++){
         var ring = rings[iRing];
         distFromRing[ring] = solGraph.bfs(ring).distances;
      }
      for(var iVolcano = 0; iVolcano < volcanoes.length; iVolcano++){
         var volcano = volcanoes[iVolcano];
         distFromVolcano[volcano] = solGraph.bfs(volcano).distances;
      }

      var minDistance = Infinity;
      ringOrders = [];
      usedChars = [];
      permute(rings);
      for(var iRingOrder = 0; iRingOrder < ringOrders.length; iRingOrder++){
         var ringOrder = ringOrders[iRingOrder];
         var distance1 = 0;
         var lastRing;
         for(var iRing = 0; iRing < ringOrder.length; iRing++){
            var vertexID = ringOrder[iRing];
            var step = (iRing == 0) ? distFromHouse[vertexID] : distFromRing[lastRing][vertexID];
            distance1 += step;
            lastRing = vertexID;
         }
         var totalDistances = [];
         for(var iVolcano = 0; iVolcano < volcanoes.length; iVolcano++){
            var volcano = volcanoes[iVolcano];
            var distance2 = distance1;
            distance2 += (distFromRing[lastRing][volcano] + distFromVolcano[volcano][house]);
            totalDistances.push(distance2);
         }
         for(var iTotalDist = 0; iTotalDist < totalDistances.length; iTotalDist++){
            var totalDist = totalDistances[iTotalDist];
            if(totalDist < minDistance){
               minDistance = totalDist;
            }
         }
      }
      return minDistance;
   };

   
   function permute(input) {
     var i, ch;
     for (i = 0; i < input.length; i++) {
       ch = input.splice(i, 1)[0];
       usedChars.push(ch);
       if (input.length == 0) {
         ringOrders.push(usedChars.slice());
       }
       permute(input);
       input.splice(i, 0, ch);
       usedChars.pop();
     }
     return ringOrders
   };

   function checkResult(noVisual) {
      if(answer == "" || isNaN(answer) || answer < 0 || answer%1 != 0){
         var msg = taskStrings.NaN;
         if(!noVisual){
            displayError(msg);
         }
         return { successRate: 0, message: msg };
      }
      var minDistance = getMinDistance();
      if(answer != minDistance){
         var msg = taskStrings.failure;
         if(!noVisual){
            displayError(msg);
         }
         return { successRate: 0, message: msg };
      }
      if(!noVisual){
         platform.validate("done");
      }
      return { successRate: 1, message: taskStrings.success };
   };

   function displayError(msg) {
      $("#error").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
