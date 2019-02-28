function initTask (subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         graph: { "vertexInfo": { "0":{}, "1":{}, "2":{}, "3":{} },
                  "edgeInfo": { "01":{}, "02":{}, "12":{}, "13":{}, "23":{} },
                  "edgeVertices": { "01": ["0","1"], "02": ["0","2"], "12": ["1","2"], "13": ["1","3"], "23": ["2","3"] },
                  "directed": true },
         vertexPos: { 
            "0":{ "x": 345, "y": 150 }, 
            "1":{ "x": 195, "y": 300 }, 
            "2":{ "x": 495, "y": 300 }, 
            "3":{ "x": 345, "y": 450 } },
         initState: [0, 1, 2, 3],
         solution: [3, 0, 2, 1]
      },
      medium: {
         graph: { "vertexInfo": { "0":{}, "1":{}, "2":{}, "3":{}, "4":{} },
                  "edgeInfo": { "02":{}, "03":{}, "12":{}, "23":{}, "24":{} },
                  "edgeVertices": { "02": ["0","2"], "03": ["0","3"], "12": ["1","2"], "23": ["2","3"], "24": ["2","4"] },
                  "directed": true },
         vertexPos: { 
            "0":{ "x": 195, "y": 150 }, 
            "1":{ "x": 495, "y": 150 }, 
            "2":{ "x": 345, "y": 300 }, 
            "3":{ "x": 195, "y": 450 },
            "4":{ "x": 495, "y": 450 } },
         initState: [0, 1, 2, 3, 4],
         solution: [2, 3, 0, 4, 1]
      },
      hard: {
         graph: { "vertexInfo": { "0":{}, "1":{}, "2":{}, "3":{}, "4":{}, "5":{} },
                  "edgeInfo": { "01":{}, "02":{}, "03":{}, "04":{}, "23":{}, "25":{}, "34":{}, "35":{} },
                  "edgeVertices": { "01": ["0","1"], "02": ["0","2"], "03": ["0","3"], "04": ["0","4"], "23": ["2","3"], "25": ["2","5"], "34": ["3","4"], "35": ["3","5"] },
                  "directed": true },
         vertexPos: { 
            "0":{ "x": 345, "y": 150 }, 
            "1":{ "x": 495, "y": 150 }, 
            "2":{ "x": 195, "y": 300 }, 
            "3":{ "x": 345, "y": 300 },
            "4":{ "x": 495, "y": 300 },
            "5":{ "x": 345, "y": 450 } },
         initState: [0, 1, 2, 3, 4, 5 ],
         solution: [0, 2, 4, 5, 1, 3 ]
      }
   };
   var nbStickers;
   var paper;
   var vGraph;
   var graphJSON;
   var vertices;
   var animWidth = 770;
   var animHeight = 550;
   var widthPlace = 90;
   var heightPlace = 90;
   var placeAttr = {
      "width": 90,
      "height": 90,
      'fill': '#F2F2FF'
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
   var solution;
   var stickerImages = ["easy0.png", "easy1.png", "easy2.png", "easy3.png","fish_3.png", "aquarium_plant.png"];
   var labels = ["Algues \nvertes", "Cailloux", "Poisson \nrouge", "Castor", "Poisson \nblanc", "Algues \nrouges"];   // IE8

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      graphJSON = data[level].graph;
      graph = Graph.fromJSON(JSON.stringify(graphJSON));
      vertices = graph.getAllVertices();
      initState = JSON.parse(JSON.stringify(data[level].initState));
      solution = JSON.parse(JSON.stringify(data[level].solution));
      nbStickers = initState.length;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
      }
   };

   subTask.resetDisplay = function() {
      paper = subTask.raphaelFactory.create("anim","anim",animWidth, animHeight);
      initDragDrop();
      initGraph();
      for (var iPlace = 0; iPlace < nbStickers; iPlace++) {
         if (answer[iPlace] != null) {
            var id = answer[iPlace];
            dragAndDrop.removeObject('src', id);
            dragAndDrop.insertObject(""+iPlace, 0, {ident : id, elements : drawSticker(id) });
         }
      }
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [];
      for(var iVertex = 0; iVertex < vertices.length; iVertex++) {
         defaultAnswer.push(null);
      }
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      var result;
      if (answer.length < vertices.length || answerIncludesNull()) {
         result = { successRate: 0, message: taskStrings.missingStickers };
      } else if(Beav.Object.eq(answer, solution)){
         result = { successRate: 1, message: taskStrings.success };
      }else{
         result = { successRate: 0, message: taskStrings.failure };
      }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   var drawSticker = function(iSticker) {
      var margin = 5;
      var sticker;
      if (Beav.Navigator.isIE8()) {
         sticker = paper.text(0, 0, labels[iSticker]).attr("font-size", 20);
      } else {
         sticker = paper.image(stickerImages[iSticker], margin-widthPlace/2, margin-heightPlace/2, widthPlace-2*margin, heightPlace-2*margin);
      }
      var rect1 = paper.rect(-widthPlace/2, -heightPlace/2, widthPlace, heightPlace).attr({fill: "#E0E0F8"});
      var rect2 = paper.rect(margin-widthPlace/2, margin-heightPlace/2, widthPlace-2*margin, heightPlace-2*margin).attr({fill: "white"});
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
      var vertex = paper.rect(pos.x,pos.y).attr(placeAttr).toBack();
      var cont = dragAndDrop.getContainer(id)
      if(cont){
         dragAndDrop.removeContainer(cont);
      }
      dragAndDrop.addContainer({
         ident : id,
         cx : pos.x + placeAttr.width/2, 
         cy : pos.y + placeAttr.height/2, 
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

   function drawEdge(id, vertex1, vertex2, vertex1Info, vertex2Info, vertex1VisualInfo, vertex2VisualInfo, edgeInfo, edgeVisualInfo) {
      var w = placeAttr.width;
      var h = placeAttr.height;
      var x1 = vertex1VisualInfo.x + w/2;
      var y1 = vertex1VisualInfo.y + h/2;
      var x2 = vertex2VisualInfo.x + w/2;
      var y2 = vertex2VisualInfo.y + h/2;
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

   function answerIncludesNull() {  // because Array.includes doesn't work with IE8
      for(var iPlace = 0; iPlace < answer.length; iPlace++){
         if(answer[iPlace] === null)
            return true;
      }
      return false;
   };
  
};
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();

