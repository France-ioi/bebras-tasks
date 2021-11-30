function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         paperH: 450,
         visualGraphJSON: {
            "vertexVisualInfo":{
               "v_0":{"x":0,"y":0},
               "v_1":{"x":0,"y":0},
               "v_2":{"x":0,"y":0},
               "v_3":{"x":0,"y":0},
               "v_4":{"x":0,"y":0},
               "v_5":{"x":0,"y":0},
               "v_6":{"x":0,"y":0},
               "v_7":{"x":0,"y":0}
            },
            "edgeVisualInfo":{
               "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{}
            },
            "minGraph":{
               "vertexInfo":{
                  "v_0":{start:true},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},
                  "v_6":{},"v_7":{}
               },
               "edgeInfo":{
                  "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{}
               },
               "edgeVertices":{
                  "e_0": ["v_0", "v_1"],
                  "e_1": ["v_1", "v_2"],
                  "e_2": ["v_2", "v_3"],
                  "e_3": ["v_3", "v_4"],
                  "e_4": ["v_4", "v_5"],
                  "e_5": ["v_4", "v_6"],
                  "e_6": ["v_1", "v_7"]
               },
               "directed":false
            }
         }
      },
      medium: {
         paperH: 400,
         visualGraphJSON: {
            "vertexVisualInfo":{
               "v_0":{"x":0,"y":0},
               "v_1":{"x":0,"y":0},
               "v_2":{"x":0,"y":0},
               "v_3":{"x":0,"y":0},
               "v_4":{"x":0,"y":0} ,
               "v_5":{"x":0,"y":0},
               "v_6":{"x":0,"y":0},
               "v_7":{"x":0,"y":0},
               "v_8":{"x":0,"y":0},
               "v_9":{"x":0,"y":0},
               "v_10":{"x":0,"y":0}
            },
            "edgeVisualInfo":{
               "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},
               "e_8":{},"e_9":{}
            },
            "minGraph":{
               "vertexInfo":{
                  "v_0":{start: true},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},
                  "v_6":{},"v_7":{},"v_8":{},"v_9":{},"v_10":{}
               },
               "edgeInfo":{
                  "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},
                  "e_8":{},"e_9":{}
               },
               "edgeVertices":{
                  "e_0":["v_0","v_1"],
                  "e_1":["v_0","v_2"],
                  "e_2":["v_0","v_3"],
                  "e_3":["v_1","v_4"],
                  "e_4":["v_2","v_5"],
                  "e_5":["v_2","v_6"],
                  "e_6":["v_3","v_7"],
                  "e_7":["v_4","v_8"],
                  "e_8":["v_4","v_9"],
                  "e_9":["v_5","v_10"]
               },
               "directed":false
            }
         }
      },
      hard: {
         paperH: 480,
         visualGraphJSON: {
            "vertexVisualInfo":{
               "v_0":{"x":0,"y":0},
               "v_1":{"x":0,"y":0},
               "v_2":{"x":0,"y":0},
               "v_3":{"x":0,"y":0},
               "v_4":{"x":0,"y":0},
               "v_5":{"x":0,"y":0},
               "v_6":{"x":0,"y":0},
               "v_7":{"x":0,"y":0},
               "v_8":{"x":0,"y":0},
               "v_9":{"x":0,"y":0},
               "v_10":{"x":0,"y":0},
               "v_11":{"x":0,"y":0},
               "v_12":{"x":0,"y":0},
               "v_13":{"x":0,"y":0},
               "v_14":{"x":0,"y":0}
            },
            "edgeVisualInfo":{
               "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},
               "e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_18":{},"e_19":{},"e_20":{}
            },
            "minGraph":{
               "vertexInfo":{
                  "v_0":{start:true},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},
                  "v_6":{},"v_7":{},"v_8":{},"v_9":{},"v_10":{},"v_11":{},"v_12":{},"v_13":{},"v_14":{}
               },
               "edgeInfo":{
                  "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},
                  "e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_18":{},"e_19":{},"e_20":{},"e_21":{}
               },
               "edgeVertices":{
                  "e_0":["v_0","v_1"],
                  "e_1":["v_0","v_8"],

                  "e_2":["v_1","v_9"],
                  "e_3":["v_1","v_7"],
                  "e_4":["v_1","v_5"],
                  "e_5":["v_8","v_5"],
                  "e_6":["v_8","v_2"],

                  "e_7":["v_2","v_9"],
                  "e_8":["v_2","v_6"],
                  "e_9":["v_2","v_3"],
                  "e_10":["v_7","v_4"],
                  "e_11":["v_7","v_6"],
                  "e_12":["v_9","v_12"],
                  "e_13":["v_9","v_13"],

                  "e_14":["v_4","v_6"],
                  "e_15":["v_4","v_3"],
                  "e_16":["v_4","v_11"],
                  "e_16":["v_6","v_10"],
                  "e_18":["v_12","v_10"],
                  "e_19":["v_13","v_11"],
                  "e_20":["v_6","v_14"],
                  "e_21":["v_14","v_12"]
               },
               "directed":false
            }
         }
      }
   };

   var paper;
   var paperW = 770;
   var paperH;
   var marginX = 5;
   var marginY = 10;
   var marginYTextZone = 10;
   var circleR = 25;
   var animCircleR = 10;
   var dropZoneW = 180;
   var dropZoneH;
   var xDropZone = paperW - dropZoneW - marginX;
   var yDropZone = marginY;
   var shuffleAreaW = xDropZone;
   var vertMinDistance = 2*circleR + 10;
   var edgeMinDistance = circleR + 5;
   var beaverW = 2*circleR - 10;
   var beaverH = beaverW;
   var startZoneW = Math.max(2*circleR + 20, 110);
   var startZoneH;
   var startZoneX = 5+marginX;
   var startZoneY = yDropZone;
   var marginArea = 15;
   var minX = startZoneX + startZoneW + circleR + marginArea;
   var maxX = shuffleAreaW - circleR - marginArea;
   var minY = circleR + marginArea;
   var maxY;

   var graph, vGraph, graphMouse, visualGraphJSON;
   var vertexDragger;
   var animTime = 1200;
   var animCircles = {};
   var knowJoke = [];
   var overlay;
   var rng;

   var beaverSrc = $("#beaver").attr("src");

   var colors = {
      black: "#4a4a4a",
      grey: "#c6c7c9",
      lightGrey: "#ebebeb",
      green: "#b7d995",
      blue: "#0000FF",
      lightBlue: "#cbcbFF"
   };

   var circleAttr = {
      fill: "white",
      stroke: colors.black,
      "stroke-width": 2,
      r: circleR
   };
   var startCircleAttr = {
      fill: colors.lightBlue,
      stroke: colors.black,
      "stroke-width": 2,
      r: circleR
   };
   var animCircleAttr = {
      fill: colors.blue,
      stroke: "none",
      r: animCircleR
   };
   var lineAttr = {
      stroke: colors.black,
      "stroke-width": 3
   };
   var dropZoneAttr = {
      stroke: colors.blue,
      "stroke-width": 3,
      "stroke-dasharray": "- ",
      fill: colors.lightBlue,
      "fill-opacity": 0.5,
      r: 5
   };
   var overlayAttr = {
      stroke: "none",
      fill: "red",
      opacity: 0
   };
   var startZoneAttr = {
      stroke: "green",
      "stroke-width": 3,
      "stroke-dasharray": "- ",
      fill: colors.green,
     "fill-opacity": 0.5,
     r: 5
   };
   var zoneLabelAttr = {
      "font-size": 16,
      "font-weight": "bold",
      fill: colors.black
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      paperH = data[level].paperH;
      maxY = paperH - circleR - marginArea;
      visualGraphJSON = data[level].visualGraphJSON;
      dropZoneH = paperH - 2*marginY;
      startZoneH = paperH - 2*marginY;
      rng = new RandomGenerator(subTask.taskParams.randomSeed + level.charCodeAt(0));
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      rng.reset(answer.seed);
   };

   subTask.resetDisplay = function () {
      displayError("");
      // updateDay(0);
      initPaper();
      initStartZone();
      initDropZone();
      initGraph();
      if(answer.waitingForRetry){
         setRetry();
      }else{
         displayHelper.setValidateString(taskStrings.validate);
         displayHelper.customValidate = runAnimation;
      }
      if (typeof(enableRtl) != "undefined") {
         $("body").attr("dir", "rtl");
         $(".largeScreen #zone_1").css("float", "right");
         $(".largeScreen #zone_2").css("float", "right");
      }
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = {
         seed: rng.nextInt(0,20),
         vGraphJSON: visualGraphJSON,
         waitingForRetry: false,
         shuffled: false
      };

      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result
   };

   subTask.unloadLevel = function (callback) {
      subTask.raphaelFactory.destroyAll();
      subTask.simulationFactory.destroyAll();
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function updateDay(day) {
      $("#day").html(taskStrings.day+" "+day);
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);
      Beav.Raphael.loadTextExtensions(paper);
   };

   function initStartZone() {
      paper.rect(startZoneX,startZoneY,startZoneW,startZoneH).attr(startZoneAttr);
      paper.text(startZoneX + startZoneW/2, startZoneY + marginYTextZone + 20, taskStrings.startZone).attr(zoneLabelAttr).valign('top');
   };

   function initDropZone() {
      paper.rect(xDropZone,yDropZone,dropZoneW,dropZoneH).attr(dropZoneAttr);
      var t = paper.text(xDropZone + dropZoneW/2, yDropZone + marginYTextZone + 20, taskStrings.endZone).attr(zoneLabelAttr).valign('top');
   };

   function initGraph() {
      graphDrawer = new SimpleGraphDrawer(circleAttr, lineAttr, null, true);
      graphDrawer.setDrawVertex(drawVertex);
      vGraph = VisualGraph.fromJSON(JSON.stringify(answer.vGraphJSON), "vGraph", paper, null, graphDrawer, true);
      graph = vGraph.graph;
      if(!answer.shuffled){
         shuffleGraph();
      }
      initGraphDragger();
   };

   function initGraphDragger() {
      graphMouse = new GraphMouse("mouse", graph, vGraph);
      vertexDragger = new VertexDragger({
         id: "vertexDragger",
         graphMouse: graphMouse,
         visualGraph: vGraph,
         enabled: true,
         callback: endDragCallback,
         startCallback: startDragCallback,
         dragLimits: {
            minX: minX,
            maxX: paperW - circleR,
            minY: circleR,
            maxY: paperH - circleR
         },
         stillVertices: ["v_0"],
         ie8compat: true // temporary?
      });
   };

   function drawVertex(id,info,visualInfo) {
      var pos = this._getVertexPosition(visualInfo);
      this.originalPositions[id] = pos;
      var attr = (info.start) ? startCircleAttr : circleAttr;

      var node = this.paper.circle(pos.x, pos.y).attr(attr);
      var xBeaver = pos.x - beaverW/2;
      var yBeaver = pos.y - beaverH/2;
      var beaver = paper.image(beaverSrc,xBeaver,yBeaver,beaverW,beaverH);

      var result = [node,beaver];
      this._addCustomElements(id, [beaver]);
      return result;
   };

   function shuffleGraph() {
      var vertices = graph.getAllVertices();
      var shuffledVert = [];
      for(var iVert = 0; iVert < vertices.length; iVert++){
         var vertexID = vertices[iVert];
         if(iVert == 0){
            var newPos = { x: startZoneX + startZoneW/2, y: startZoneY + startZoneH/2, id: vertexID };
            shuffledVert.push(vertexID);
            vGraph.setVertexVisualInfo(vertexID, newPos);
            continue
         }
         var nbLoops = 0
         var cross = false;
         do{
            var x = rng.nextInt(minX,maxX);
            var y = rng.nextInt(minY,maxY);
            var vertMinD = Infinity;
            var edgeMinD = Infinity;
            for(var jVert = 0; jVert < shuffledVert.length; jVert++){
               var nextID = shuffledVert[jVert];
               var nextPos = vGraph.getVertexVisualInfo(nextID);
               var d = Beav.Geometry.distance(x,y,nextPos.x,nextPos.y);
               if(d < vertMinD){
                  vertMinD = d;
               }

               /* check distance of new vertex from existing edges */
               var nextNeighbors = graph.getNeighbors(nextID);
               for(var iNeigh = 0; iNeigh < nextNeighbors.length; iNeigh++){
                  var neighbor = nextNeighbors[iNeigh];
                  if(Beav.Array.has(shuffledVert,neighbor)){
                     // get distance from edge
                     var neighborPos = vGraph.getVertexVisualInfo(neighbor);
                     var edgeD = getDistanceFromSegment(x,y,nextPos.x,nextPos.y, neighborPos.x,neighborPos.y);
                     if(edgeD < edgeMinD){
                        edgeMinD = edgeD;
                     }
                  }
               }
            }

            /* check distance of existing vertices from new edges */
            var neighbors = graph.getNeighbors(vertexID);
            for(var iNeigh = 0; iNeigh < neighbors.length; iNeigh++){
               var neighbor = neighbors[iNeigh];
               if(Beav.Array.has(shuffledVert,neighbor)){
                  var neighborPos = vGraph.getVertexVisualInfo(neighbor);
                  for(var kVert = 0; kVert < shuffledVert.length; kVert++){
                     var thirdVert = shuffledVert[kVert];
                     if(thirdVert != neighbor){
                        var thirdVertPos = vGraph.getVertexVisualInfo(thirdVert);
                        var edgeD = getDistanceFromSegment(thirdVertPos.x,thirdVertPos.y,x,y, neighborPos.x,neighborPos.y);
                        if(edgeD < edgeMinD){
                           edgeMinD = edgeD;
                        }
                     }
                  }
                  if(level == "easy"){
                     /* check new edge don't cross existing edge */
                     for(var jVert = 0; jVert < shuffledVert.length; jVert++){
                        var nextID = shuffledVert[jVert];
                        if(nextID == neighbor){
                           continue
                        }
                        var nextPos = vGraph.getVertexVisualInfo(nextID);
                        var nextNeighbors = graph.getNeighbors(nextID);
                        for(var jNeigh = 0; jNeigh < nextNeighbors.length; jNeigh++){
                           var nextNeighbor = nextNeighbors[jNeigh];
                           if(nextNeighbor == neighbor){
                              continue
                           }
                           var nextNeighborPos = vGraph.getVertexVisualInfo(nextNeighbor);
                           if(Beav.Array.has(shuffledVert,neighbor)){
                              var cross = doEdgesCross({x:x,y:y},neighborPos,nextPos,nextNeighborPos)
                              if(cross){
                                 jVert = shuffledVert.length;
                                 break;
                              }
                           }
                        }
                     }
                  }
               }
            }
            nbLoops++;
         }while((vertMinD < vertMinDistance || edgeMinD < edgeMinDistance || cross) && nbLoops < 50)
         if(nbLoops >= 50){
            shuffleGraph();
            // console.log("reshuffle")
            return
         }
         var newPos = { x: x, y: y, id: vertexID };
         shuffledVert.push(vertexID);
         vGraph.setVertexVisualInfo(vertexID, newPos);
      }
      vGraph.redraw();
      saveAnswer();
      answer.shuffled = true;
      rng.reset(answer.seed);
      answer.seed = rng.nextInt(0,1000);
   };

   function saveAnswer() {
      answer.vGraphJSON = JSON.parse(vGraph.toJSON());
   };

   function startDragCallback() {
      displayError("");
   };

   function endDragCallback(id) {
      checkOverlap(id)
      saveAnswer();
   };

   function checkOverlap(id) {
      var pos = vGraph.getVertexVisualInfo(id);
      if(overlapOtherVertex(pos.x,pos.y,id)){
         findEmptySpace(id);
      }
   };

   function overlapOtherVertex(x,y,id) {
      var vertices = graph.getAllVertices();
      for(var iVert = 0; iVert < vertices.length; iVert++) {
         var vertex = vertices[iVert];
         if(vertex != id){
            var pos = vGraph.getVertexVisualInfo(vertex);
            if(Beav.Geometry.distance(x,y,pos.x,pos.y) < vertMinDistance){
               return true;
            }
         }
      }
      return false;
   };

   function findEmptySpace(id) {
      var d = paperW;
      var pos = vGraph.getVertexVisualInfo(id);
      var newX = 0;
      var newY = 0;
      for (var x = minX; x < maxX; x += circleR){
         for (var y = minY; y < maxY; y += circleR){
            if (!overlapOtherVertex(x,y,id)){
               newD = Beav.Geometry.distance(pos.x,pos.y,x,y);
               if(newD < d){
                  d = newD;
                  newX = x;
                  newY = y;
               }
            }
         }
      }
      vGraph.graphDrawer.moveVertex(id, newX, newY);
   };

   function runAnimation() {
      displayError("");
      overlay = paper.rect(0,0,paperW,paperH).attr(overlayAttr);
      knowJoke = ["v_0"];
      var bfs = graph.bfs("v_0");
      var sol = [];
      var maxD = 0;

      for(var vertex in bfs.distances){
         var d = bfs.distances[vertex];
         if(d > maxD){
            maxD = d;
         }
      }
      for(var vertex in bfs.distances){
         var d = bfs.distances[vertex];
         if(d == maxD){
            sol.push(vertex);
         }
      }
      var sim = subTask.simulationFactory.create("sim");
      runPropagation(sim,sol,bfs);
      sim.setAutoPlay(true);
      sim.play();
   };

   function runPropagation(sim,sol,bfs) {
      var simStep = new SimulationStep();
      var dayParent = null;
      for(var iVert = 0; iVert < knowJoke.length; iVert++){
         var vertex = knowJoke[iVert];
         var vInfo = vGraph.getVertexVisualInfo(vertex);
         var neighbors = graph.getNeighbors(vertex);
         var parents = (vertex != "v_0") ? ["entry_"+vertex] : [];
         for(var iNeigh = 0; iNeigh < neighbors.length; iNeigh++){
            var neighbor = neighbors[iNeigh];
            if(!Beav.Array.has(knowJoke,neighbor)){
               knowJoke.push(neighbor);
               var final = (knowJoke.length == graph.getVerticesCount());
               animCircles[neighbor] = paper.circle(vInfo.x,vInfo.y).attr(animCircleAttr);
               var vInfo2 = vGraph.getVertexVisualInfo(neighbor);
               var day = bfs.distances[neighbor];
               var simAction = { onExec: moveCircle(neighbor,final,sol,day), duration: animTime, params: { cx: vInfo2.x, cy: vInfo2.y } };
               var entryName = "entry_"+neighbor;
               var simEntry = { name: entryName, action: simAction, parents:parents };
               simStep.addEntry(simEntry);
            }
         }

         var parentRaph = vGraph.getRaphaelsFromID(vertex);
         for(var iElem = 0; iElem < parentRaph.length; iElem++){
            parentRaph[iElem].toFront();
         }
         overlay.toFront();
      }
      if(knowJoke.length < graph.getVerticesCount()){
         runPropagation(sim,sol);
      }
      sim.addStep(simStep);
   };

   function moveCircle(id,final,sol,day) {
      return function(params,duration,callback) {
         // updateDay(day);
         var anim = new Raphael.animation(params,duration,function() {
            var obj = vGraph.getRaphaelsFromID(id);
            obj[0].attr(startCircleAttr);
            if(Beav.Array.has(sol,id)){
               animCircles[id].toFront();
            }
            callback();
         });
         subTask.raphaelFactory.animate("anim",animCircles[id],anim);
         if(final){
            return { stop: function() {
               // removeAnimCircles();
               subTask.simulationFactory.destroyAll();
               var result = checkResult();
               if(!result.successRate){
                  setRetry();
               }
            }};
         }
      }
   };

   function removeAnimCircles() {
      for(var vert in animCircles){
         animCircles[vert].remove();
      }
   };

   function setRetry() {
      answer.waitingForRetry = true;
      displayHelper.setValidateString(taskStrings.retry);
      displayHelper.customValidate = retry;
   };

   function retry() {
      // updateDay(0);
      removeAnimCircles();
      answer.waitingForRetry = false;
      displayError("");
      displayInfo(taskStrings.afterRetry);
      if(overlay){
         overlay.remove();
      }
      shuffleGraph();
      initGraphDragger();
      displayHelper.setValidateString(taskStrings.validate);
      displayHelper.customValidate = runAnimation;
   };

   function getDistanceFromSegment(x, y, x1, y1, x2, y2) {
      var A = x - x1;
      var B = y - y1;
      var C = x2 - x1;
      var D = y2 - y1;

      var dot = A * C + B * D;
      var len_sq = C * C + D * D;
      var param = -1;
      if (len_sq != 0) //in case of 0 length line
         param = dot / len_sq;

      var xx, yy;

      if (param < 0) {
       xx = x1;
       yy = y1;
      }
      else if (param > 1) {
       xx = x2;
       yy = y2;
      }
      else {
       xx = x1 + param * C;
       yy = y1 + param * D;
      }

      var dx = x - xx;
      var dy = y - yy;
      return Math.sqrt(dx * dx + dy * dy);
   };

   function doEdgesCross(pos1,pos2,pos3,pos4) {
      if(crossProduct(pos1,pos2,pos3,pos4) == 0){
         // console.log("check0")
         return false;
      }
      if(crossProduct(pos1,pos2,pos1,pos4)*crossProduct(pos1,pos2,pos1,pos3) > 0){
         // console.log("check1")
         return false;
      }
      if(crossProduct(pos3,pos4,pos3,pos2)*crossProduct(pos3,pos4,pos3,pos1) > 0){
         // console.log("check2")
         return false;
      }
      // console.log("check3")

      return true;
   };

   function crossProduct(pos1A,pos1B,pos2A,pos2B) {
      var u1 = pos1B.x - pos1A.x;
      var v1 = pos1B.y - pos1A.y;
      var u2 = pos2B.x - pos2A.x;
      var v2 = pos2B.y - pos2A.y;
      return (u1*v2 - u2*v1)
   };

   function eq(val1,val2) {
      if(val1 == val2){
         return true
      }
      return false
   };

   function checkResult(noVisual) {
      var corrVisualGraph = answer.vGraphJSON;
      var vInfos = corrVisualGraph.vertexVisualInfo;
      var insideZone = [];
      var w = dropZoneW;
      var h = dropZoneH;
      var corrGraph = Graph.fromJSON(JSON.stringify(corrVisualGraph.minGraph));
      var bfs = corrGraph.bfs("v_0");
      var sol = [];
      var maxD = 0;

      for(var vertex in bfs.distances){
         var d = bfs.distances[vertex];
         if(d > maxD){
            maxD = d;
         }
      }
      for(var vertex in bfs.distances){
         var d = bfs.distances[vertex];
         if(d == maxD){
            sol.push(vertex);
         }
      }

      for(var vertex in vInfos){
         var pos = vInfos[vertex];
         if(pos.x > xDropZone && pos.x < xDropZone + w &&
            pos.y > yDropZone && pos.y < yDropZone + h){
            insideZone.push(vertex);
         }
      }

      if(insideZone.length == 0){
         var error = taskStrings.clickRetry;
         if(!noVisual){
            displayError(error);
         }
         return { successRate: 0, message: error }
      }

      for(var iVert = 0; iVert < sol.length; iVert++){
         var vertex = sol[iVert];
         if(!Beav.Array.has(insideZone,vertex)){
            var error = taskStrings.clickRetry;
            if(!noVisual){
               displayError(error);
            }
            return { successRate: 0, message: error }
         }
      }

      if(insideZone.length > sol.length){
         var error = taskStrings.clickRetry;
         if(!noVisual){
            displayError(error);
         }
         return { successRate: 0, message: error }
      }

      if(!noVisual){
         platform.validate("done");
      }
      return { successRate: 1, message: taskStrings.success }
   };

   function displayInfo(msg) {
      $("#error").html(msg).css({color: "orange" });
   }

   function displayError(msg) {
      $("#displayHelper_graderMessage").html(msg).css({color: "red" });
      // TODO: devrait ce coder avec un while (length) { pop()... }
      // TODO: est-ce que ce code est deprecated de toutes manières ?
      if(!msg && knowJoke.length > 1){
         do{
            var vert = knowJoke.pop();
            var raph = vGraph.getRaphaelsFromID(vert);
            raph[0].attr(circleAttr);
         }while(knowJoke.length > 1)
      }
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
