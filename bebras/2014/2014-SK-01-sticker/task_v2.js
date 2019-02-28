function initTask (subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         graph: { "vertexInfo": { "0":{}, "1":{}, "2":{}, "3":{} },
                  "edgeInfo": { "01":{}, "12":{}, "23":{} },
                  "edgeVertices": { "01": ["0","1"], "12": ["1","2"], "23": ["2","3"] },
                  "directed": true },
         vertexPos: { 
            "0":{ "x": 165, "y": 245 }, 
            "1":{ "x": 315, "y": 245 }, 
            "2":{ "x": 465, "y": 245 }, 
            "3":{ "x": 615, "y": 245 } },
         initState: [0, 1, 2, 3],
         solutions: [[3, 0, 2, 1]],
         animHeight: 350
      },
      medium: {
         graph: { "vertexInfo": { "0":{}, "1":{}, "2":{}, "3":{}, "4":{}, "5":{} },
                  "edgeInfo": { "02":{}, "12":{}, "15":{}, "23":{}, "24":{} },
                  "edgeVertices": { "02": ["0","2"], "12": ["1","2"], "15": ["1","5"], "23": ["2","3"], "24": ["2","4"] },
                  "directed": true },
         vertexPos: { 
            "0":{ "x": 240, "y": 195 }, 
            "1":{ "x": 540, "y": 195 }, 
            "2":{ "x": 390, "y": 345 }, 
            "3":{ "x": 240, "y": 495 },
            "4":{ "x": 390, "y": 495 },
            "5":{ "x": 540, "y": 495 } },
         initState: [0, 1, 2, 3, 4, 5],
         solutions: [
            [2, 3, 0, 5, 1, 4],
            [2, 3, 0, 1, 5, 4]
            ],
         animHeight: 550
      },
      hard: {
         graph: { "vertexInfo": { "0":{}, "1":{}, "2":{}, "3":{}, "4":{}, "5":{}, "6":{} },
                  "edgeInfo": {},
                  "edgeVertices": {},
                  "directed": true },
         vertexPos: { 
            "0":{ "x": 230, "y": 160 }, 
            "1":{ "x": 390, "y": 95 }, 
            "2":{ "x": 550, "y": 160 }, 
            "3":{ "x": 220, "y": 305 },
            "4":{ "x": 560, "y": 305 },
            "5":{ "x": 300, "y": 435 },
            "6":{ "x": 480, "y": 435 } },
         initState: [0, 1, 2, 3, 4, 5, 6 ],
         solutions: { "vertexInfo": { "0":{}, "1":{}, "2":{}, "3":{}, "4":{}, "5":{}, "6":{} },
                  "edgeInfo": { "40":{}, "02":{}, "05":{}, "56":{}, "61":{}, "63":{} },
                  "edgeVertices": { "40": ["4","0"], "02": ["0","2"], "05": ["0","5"], "56": ["5","6"], "61": ["6","1"], "63": ["6","3"] },
                  "directed": true },
         animHeight: 550
      }
   };
   var nbStickers;
   var paper;
   var paperGraphBorder;
   var vGraph;
   var graphJSON;
   var graphMouse;
   var vertexDrag;
   var vertexToggler;
   var vertexConnector;
   var vertices;
   var dragAndDrop;
   var animWidth = 770;
   var animHeight;
   var widthPlace = 90;
   var heightPlace = 90;
   var placeAttr = {
      "width": 90,
      "height": 90,
      'fill': '#F2F2FF'
   };
   var borderAttr = {
      normal: {
         fill: "#E0E0F8",
         stroke: "black",
         "stroke-width": 1
      },
      highlight: {
         stroke: "red",
         "stroke-width": 5
      }
   };
   var vertexAttr = {
      r: 65
   };
   var edgeAttr = {
      "stroke": "black",
      "stroke-width": 3,
      "arrow-end": "block-wide-long"

   };
   var margin = 10;
   var initState;
   var solutions;
   var stickerImages = ["easy0.png", "easy1.png", "easy2.png", "easy3.png","fish_2.png","fish_3.png", "aquarium_plant.png"];
   var labels = ["Algues \nvertes", "Cailloux", "Poisson \nrouge", "Castor", "Poisson \norange","Poisson \nblanc", "Algues \nrouges"];   // IE8

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      graphJSON = data[level].graph;
      graph = Graph.fromJSON(JSON.stringify(graphJSON));
      vertices = graph.getAllVertices();
      initState = JSON.parse(JSON.stringify(data[level].initState));
      solutions = JSON.parse(JSON.stringify(data[level].solutions));
      nbStickers = initState.length;
      animHeight = data[level].animHeight;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer && level === "hard"){
         graph = Graph.fromJSON(answer.graph);
      }
   };

   subTask.resetDisplay = function() {
      paper = subTask.raphaelFactory.create("anim","anim",animWidth, animHeight);
      if(level != "hard"){
         initDragDrop();
         initGraph();
         for (var iPlace = 0; iPlace < nbStickers; iPlace++) {
            if (answer[iPlace] != null) {
               var id = answer[iPlace];
               dragAndDrop.removeObject('src', id);
               dragAndDrop.insertObject(""+iPlace, 0, {ident : id, elements : drawSticker(id) });
            }
         }
      }else{
         initGraphHard();
      }
      displayHelper.customValidate = checkResult;
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer; 
      if(level === "hard"){
         defaultAnswer = { graph: JSON.stringify(graphJSON) };
      }else{
         defaultAnswer = [];
         for(var iVertex = 0; iVertex < vertices.length; iVertex++) {
            defaultAnswer.push(null);
         }
      }
      
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      if(dragAndDrop) {
         dragAndDrop.disable();
      }
      if(vertexConnector){
         vertexConnector.setEnabled(false);
      }
      if(graphMouse){
         graphMouse.destroy();
      }
      if(vGraph)
         vGraph.remove();
      callback();
   };

   function getResultAndMessage() {
      if(level !== "hard"){
         if (answer.length < vertices.length || answerIncludesNull()) {
            return { successRate: 0, message: taskStrings.missingStickers };
         } 
         for(var iSolution = 0; iSolution < solutions.length; iSolution++){
            if(Beav.Object.eq(answer, solutions[iSolution])){
               return { successRate: 1, message: taskStrings.success };
            }
         }
         return { successRate: 0, message: taskStrings.failure };
      }else{
         var graphSol = Graph.fromJSON(JSON.stringify(solutions));
         var graphAnswer = Graph.fromJSON(answer.graph);
         var nbEdgesSol = graphSol.getEdgesCount();
         var nbEdgesAnswer = graphAnswer.getEdgesCount();
         if(nbEdgesAnswer === 0){
            return { successRate: 0, message: taskStrings.noEdge };
         }else if(nbEdgesSol > nbEdgesAnswer){
            return { successRate: 0, message: taskStrings.missingEdge };
         }else if(nbEdgesSol < nbEdgesAnswer){
            return { successRate: 0, message: taskStrings.tooManyEdges };
         }else{
            var edgesSol = graphSol.getAllEdges();
            var edgesAnswer = graphAnswer.getAllEdges();
            for(var iEdge = 0; iEdge < nbEdgesAnswer; iEdge++){
               if(!graphAnswer.isEdge(edgesSol[iEdge])){
                  return { successRate: 0, message: taskStrings.wrongEdge };
               }
            }
            return { successRate: 1, message: taskStrings.success };
         }
      } 
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   var drawSticker = function(iSticker,x,y,w,h) {
      var margin = 5;
      var sticker;
      w = w || widthPlace;
      h = h || heightPlace;
      x = x || -w/2;
      y = y || -h/2;
      var rect1 = paper.rect(x, y, w, h).attr(borderAttr.normal);
      var rect2 = paper.rect(margin + x, margin + y, w - 2*margin, h - 2*margin).attr({fill: "white"});
      if (Beav.Navigator.isIE8()) {
         sticker = paper.text(x + w/2, y + h/2, labels[iSticker]).attr("font-size", 20);
      } else {
         sticker = paper.image(stickerImages[iSticker], margin + x, margin + y, w - 2*margin, h - 2*margin);
      }
      return [rect1, rect2, sticker];
   }

   var initDragDrop = function() {
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            answer = [];
            for(var iVertex = 0; iVertex < vertices.length; iVertex++){
               var stickerId = dragAndDrop.getObjects(vertices[iVertex])[0]
               answer.push(stickerId);
            }
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, type) {
            if (dstCont == null)
               return false;
            return true;
         },
         actionIfEjected : function(refElement, previousContainerId, previousPos) {
            return {dstCont: 'src',dstPos: 0,dropType:'insert'};
         }
      });
      var backgroundTarget = paper.rect(-widthPlace/2,-heightPlace/2,widthPlace,heightPlace)
         .attr('fill', '#F2F2FF');
      dragAndDrop.addContainer({
         ident : 'src',
         cx : animWidth/2, 
         cy : heightPlace/2 + margin, 
         widthPlace : widthPlace,
         heightPlace : heightPlace,
         nbPlaces : nbStickers,
         direction : 'horizontal',
         dropMode : 'insert',
         dragDisplayMode : 'preview',
         placeBackgroundArray : [ backgroundTarget ]
      });

      for (var pos = 0; pos < nbStickers; pos++) {
         var iSticker = initState[pos];
         dragAndDrop.insertObject('src', iSticker, {ident : iSticker, elements : drawSticker(iSticker)} );

      }
   };


   function initGraph() {
      var graphDrawer = new SimpleGraphDrawer(vertexAttr,edgeAttr);
      graphDrawer.setDrawVertex(drawVertex);
      graphDrawer.setDrawEdge(drawEdge);  
      vGraph = new VisualGraph("vGraph", paper, graph, graphDrawer, true);
      initVertexPos();
      vGraph.redraw();
   };

   function initGraphHard() {
      paperGraphBorder = paper.rect(0, 0, animWidth, animHeight).attr({"stroke-width": 3,fill: "#9999aa"});
      var graphDrawer = new SimpleGraphDrawer(vertexAttr,edgeAttr,null,true);
      graphDrawer.setDrawVertex(drawVertexHard);
      graphDrawer.setDrawEdge(drawEdge);  
      if(answer.vGraph){
         vGraph =  VisualGraph.fromJSON(answer.vGraph,"vGraph",paper,graph,graphDrawer,true);
         paperGraphBorder.toBack();
      }else{
         vGraph =  new VisualGraph("vGraph", paper, graph, graphDrawer, true);
         initVertexPos();
         vGraph.redraw();
      }

      var dragLimits = {
         minX: widthPlace/2 + 1, // +1 to prevent bug at reload when a vertex is close to the border
         minY: heightPlace/2 + 1,
         maxX: animWidth - widthPlace/2,
         maxY: animHeight - heightPlace/2
      };
      
      graphMouse = new GraphMouse("graphMouse", graph, vGraph);
      vertexConnector = new VertexDragAndConnect({
         id: "connector",
         paperElementID: "anim",
         paper: paper,
         graph: graph,
         visualGraph: vGraph,
         graphMouse: graphMouse,
         onVertexSelect: onVertexSelect,
         onPairSelect: onPairSelect,
         onEdgeSelect: deleteEdge,
         onDragEnd: onDragEnd,
         vertexThreshold: 0,
         edgeThreshold: 10,
         dragThreshold: 5,
         dragLimits: dragLimits,
         snapToLastGoodPosition: true,
         isGoodPosition: isGoodPosition,
         enabled: true
      });
   };

   function initVertexPos() {
      for(var id in data[level].vertexPos){
         var posX = data[level].vertexPos[id].x;
         var posY = data[level].vertexPos[id].y;
         vGraph.setVertexVisualInfo(id,{"x":posX,"y":posY});
      }
   };

   function drawVertex(id,info,visualInfo) {
      var pos = this._getVertexPosition(visualInfo);
      this.originalPositions[id] = pos;
      var vertex = paper.rect(pos.x - widthPlace/2,pos.y - heightPlace/2).attr(placeAttr).toBack();
      var cont = dragAndDrop.getContainer(id)
      if(cont){
         dragAndDrop.removeContainer(cont);
      }
      dragAndDrop.addContainer({
         ident : id,
         cx : pos.x, 
         cy : pos.y, 
         widthPlace : widthPlace,
         heightPlace : heightPlace,
         nbPlaces : 1,
         direction : 'horizontal',
         dropMode : 'insertBefore',
         dragDisplayMode : 'preview',
         placeBackgroundArray : [ ]
      });
      
      return [vertex];
   };

   function drawVertexHard(id,info,visualInfo) {
      var pos = this._getVertexPosition(visualInfo);
      this.originalPositions[id] = pos;
      var vertex = drawSticker(id,pos.x - widthPlace/2,pos.y - heightPlace/2);
      this._addCustomElements(id, vertex);
      return vertex;
   };

   function drawEdge(id, vertex1, vertex2, vertex1Info, vertex2Info, vertex1VisualInfo, vertex2VisualInfo, edgeInfo, edgeVisualInfo) {
      var w = placeAttr.width;
      var h = placeAttr.height;
      var x1 = vertex1VisualInfo.x;
      var y1 = vertex1VisualInfo.y;
      var x2 = vertex2VisualInfo.x;
      var y2 = vertex2VisualInfo.y;
      var r = this.circleAttr.r;
      var path = getEdgePath(x1,y1,x2,y2,r);

      var edge = this.paper.path(path).attr(this.lineAttr).toBack();
      edge.attr(edgeVisualInfo);
      return [edge];
   };

   function getEdgePath(x1,y1,x2,y2,r) {
      if(x1 == x2) {
         if(y1 < y2) {
            return ["M", x1, y1 + r, "L", x2, y2 - r];
         }
         else {
            return ["M", x1, y1 - r, "L", x2, y2 + r];
         }
      }
      var swap = false;
      if(x1 > x2) {
         swap = true;
         var temp = x1;
         x1 = x2;
         x2 = temp;
         temp = y1;
         y1 = y2;
         y2 = temp;
      }
      var slope = 1.0 * (y2 - y1) / (x2 - x1);
      var w = (r / Math.sqrt((1 + slope * slope)));
      var h = (slope * w);
      if(!swap) {
         return ["M", x1 + w, y1 + h, "L", x2 - w, y2 - h];
      }
      else {
         return ["M", x2 - w, y2 - h, "L", x1 + w, y1 + h];
      }
   };

   function onVertexSelect(id, selected, pairCompleted) {
      var attr;
      if(selected) {
         attr = borderAttr.highlight;
      }
      else {
         attr = borderAttr.normal;
      }
      vGraph.getRaphaelsFromID(id)[0].attr(attr);
   };

   function onPairSelect(id1, id2) {
      var id = id1+id2;
      var reverseId = id2+id1;
      if(graph.isEdge(id)) {
         return;
      }
      if(graph.isEdge(reverseId)) {
         deleteEdge(reverseId);
      }
      graph.addEdge(id, id1, id2);
      paperGraphBorder.toBack();
      saveAnswer();
   };

   function onDragEnd(id, isSnappedToGoodPosition) {
      saveAnswer();
   };

   function deleteEdge(id) {
      graph.removeEdge(id);
      saveAnswer();
   };

   function isGoodPosition(originalID, position) {
      var result = true;
      graph.forEachVertex(function(id) {
         if(!result || id === originalID) {
            return;
         }
         var info = vGraph.getVertexVisualInfo(id);
         var distance = Math.max(Math.abs(info.x - position.x), Math.abs(info.y - position.y));
         if(distance < 130) {
            result = false;
         }
      });
      return result;
   };

   function saveAnswer() {
      answer.graph = graph.toJSON();
      answer.vGraph = vGraph.toJSON();
   };

   function answerIncludesNull() {  // because Array.includes doesn't work with IE8
      for(var iPlace = 0; iPlace < answer.length; iPlace++){
         if(answer[iPlace] === null)
            return true;
      }
      return false;
   };

   function checkResult() {
      var result = getResultAndMessage();
      if(!result.successRate){
         displayHelper.showPopupMessage(result.message, "blanket");
      }else{
         platform.validate("done");
      }
   };
  
};
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();

