function initTask (subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         graph: { "vertexInfo": { "0":{}, "1":{}, "2":{}, "3":{}, "4":{}, "5":{} },
                  "edgeInfo": { "53":{}, "03":{}, "54":{}, "12":{}, "41":{}, "52":{}, "51":{}, "23":{} },
                  "edgeVertices": { "53": ["5","3"], "03": ["0","3"], "54": ["5","4"], "12": ["1","2"], 
                                    "41": ["4","1"], "52": ["5","2"], "51": ["5","1"], "23": ["2","3"] },
                  "directed": false },
         vertexPos: { 
            "0":{ "x": 200, "y": 110 }, 
            "1":{ "x": 550, "y": 200 }, 
            "2":{ "x": 560, "y": 70 }, 
            "3":{ "x": 380, "y": 40 }, 
            "4":{ "x": 170, "y": 210 }, 
            "5":{ "x": 370, "y": 140 } }, 
         animHeight: 270
      },
      medium: {
         graph: { "vertexInfo": { "0":{}, "1":{}, "2":{}, "3":{}, "4":{}, "5":{}, "6":{}, "7":{} },
                  "edgeInfo": { "53":{}, "03":{}, "54":{}, "12":{}, "41":{}, "52":{}, "51":{}, "76":{}, "63":{}, "27":{} },
                  "edgeVertices": { "53": ["5","3"], "03": ["0","3"], "54": ["5","4"], "12": ["1","2"], 
                                    "41": ["4","1"], "52": ["5","2"], "51": ["5","1"], "76": ["7","6"],
                                    "63": ["6","3"], "27": ["2","7"] },
                  "directed": false },
         vertexPos: { 
            "0":{ "x": 200, "y": 160 }, 
            "1":{ "x": 550, "y": 250 }, 
            "2":{ "x": 560, "y": 120 }, 
            "3":{ "x": 380, "y": 90 }, 
            "4":{ "x": 170, "y": 260 }, 
            "5":{ "x": 370, "y": 190 },
            "6":{ "x": 170, "y": 20 },
            "7":{ "x": 510, "y": 30 } }, 
         animHeight: 350
      },
      hard: {
         graph: { "vertexInfo": { "0":{}, "1":{}, "2":{}, "3":{}, "4":{}, "5":{}, "6":{}, "7":{}, "8":{}, "9":{}, "10":{}, "11":{} },
                  "edgeInfo": { "56":{}, "02":{}, "510":{}, "12":{}, "41":{}, "52":{}, "711":{}, "76":{}, "68":{}, "24":{}, "811":{}, "43":{}, "01":{}, "31":{}, "23":{}, "59":{}, "98":{}, "1110":{}, "410":{} },
                  "edgeVertices": { "56": ["5","6"], "02": ["0","2"], "510": ["5","10"], "12": ["1","2"], 
                                    "41": ["4","1"], "52": ["5","2"], "711": ["7","11"], "76": ["7","6"],
                                    "68": ["6","8"], "24": ["2","4"], "811": ["8","11"], "43": ["4","3"],
                                    "01": ["0","1"], "31": ["3","1"], "23": ["2","3"], "59": ["5","9"],
                                    "98": ["9","8"], "1110": ["11","10"], "410": ["4","10"] },
                  "directed": false },
         vertexPos: { 
            "0":{ "x": 600, "y": 120 }, 
            "1":{ "x": 320, "y": 20 }, 
            "2":{ "x": 460, "y": 220 }, 
            "3":{ "x": 300, "y": 120 }, 
            "4":{ "x": 120, "y": 120 }, 
            "5":{ "x": 270, "y": 260 },
            "6":{ "x": 500, "y": 300 },
            "7":{ "x": 600, "y": 400 },
            "8":{ "x": 360, "y": 440 }, 
            "9":{ "x": 270, "y": 350 }, 
            "10":{ "x": 120, "y": 400 },  
            "11":{ "x": 320, "y": 520 } }, 
            
         animHeight: 600
      }
   };
   var graph;
   var vGraph;
   var cellHeight = 40;
   var cellWidth = 80;
   var edgeAttr = {'stroke': 'black', 'stroke-width': 3};
   var vertexAttr = {'width': cellWidth, 'height': cellHeight, 'fill': '#E0E0F8', 'opacity':1}
   var castors;
   var containers = [[],[]];
   var nbCastors = 5;
   var animWidth = 700;
   var animHeight;
   var tailleLettreCastor = 20;
   var beaverInCell = [[], []];

   // note: in "easy" mode, only 6 first nodes are considered
   var names = ["Anna", "Bob", "Julie", "Léa", "Marc", "Paul", "Théo", "Yann", "Noé", "Éva", "Mehdi", "Sam"];
   var positions;
   var edges;
   var nbNodes;
   var nbEdges;
   var dxText = cellWidth / 2;
   var dyText = cellHeight / 2;
   var randGen;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      graph = Graph.fromJSON(JSON.stringify(data[level].graph));
      nbNodes = graph.getVerticesCount();
      nbEdges = graph.getEdgesCount();
      animHeight = data[level].animHeight;
      randGen = new RandomGenerator(subTask.taskParams.randomSeed + level.charCodeAt(0));
      randGen.shuffle(names);
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
         randGen.reset(answer.seed);
      }
   };

   subTask.resetDisplay = function() {
      writeNames();
      drawPaper();
      reloadAnswer();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = { "pos": [], "seed": randGen.nextInt(0,1000) };
      for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
         defaultAnswer.pos[iCastor] = [0, iCastor];
      }
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      stopAnimation();
      callback();
   };

   function getResultAndMessage() {
      var result;
      innerReloadAnswer();
      if (! allPlaced()) {
         result = { successRate: 0, message: taskStrings.placeNamesOnRectangles };
      } else if (isCorrect()) {
         result = { successRate: 1, message: taskStrings.success };
      } else {
         result = { successRate: 0, message: taskStrings.failure };
      }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
  
   var animToContainer = function(castor, container) {
      var x = container.attrs.x;
      var y = container.attrs.y;
      var animR = Raphael.animation({x : x, y : y}, 100);
      var animT = Raphael.animation({x : x + dxText, y : y + dyText}, 100);
      subTask.raphaelFactory.animate("animR",castor.r,animR);
      subTask.raphaelFactory.animate("animT",castor.t,animT);
      subTask.raphaelFactory.animate("animB",castor.b,animR);
   };

   var initDragDrop = function(castor) {
      var r = castor.r;
      var t = castor.t;
      var b = castor.b;

      var drag_move  = function (dx, dy) {
         if (isNaN(dx) || isNaN(dy)) {
            return;
         }
         r.attr({x: r.ox + dx, y: r.oy + dy});
         t.attr({x: t.ox + dx, y: t.oy + dy});
         b.attr({x: r.ox + dx, y: r.oy + dy});
      };
     
      var drag_start  = function () {
         r.ox = r.attrs.x;
         r.oy = r.attrs.y;
         t.ox = t.attrs.x;
         t.oy = t.attrs.y;
         r.toFront();
         t.toFront();
         b.toFront();
      };
     
      var drag_end = function () {
         for (var objType = 1; objType < 2; objType++) {
            for (var iObject = 0; iObject < nbNodes; iObject++) {
               var container = containers[objType][iObject];
               if (container.isPointInside(r.attrs.x + r.attrs.width/2, r.attrs.y + r.attrs.height/2)) {
                  if (beaverInCell[objType][iObject] != -1) {
                     var iCastor = beaverInCell[objType][iObject];
                     beaverInCell[0][iCastor] = iCastor;
                     answer.pos[iCastor] = [0, iCastor];
                     animToContainer(castors[iCastor], containers[0][iCastor]);
                  }
                  beaverInCell[objType][iObject] = r.id;
                  beaverInCell[answer.pos[r.id][0]][answer.pos[r.id][1]] = -1;
                  answer.pos[r.id] = [objType, iObject];
                  animToContainer(castor, container);
                  displayHelper.stopShowingResult();
                  /* // automatic validation deactivated:
                  if (isCorrect()) {
                     platform.validate("done");
                  } 
                  */
                  for (var iCastor = 0; iCastor < nbNodes; iCastor++){
                     initDragDrop(castors[iCastor]);   // bug fix IE8
                  }
                  return;
               }
            }
         }
         beaverInCell[answer.pos[r.id][0]][answer.pos[r.id][1]] = -1;
         answer.pos[r.id] = [0, r.id];
         animToContainer(castor, containers[0][r.id]);
         /* // automatic validation deactivated:
         if (isCorrect()) {
            platform.validate("done");
         }
         */
         for (var iCastor = 0; iCastor < nbNodes; iCastor++){
            initDragDrop(castors[iCastor]);   // bug fix IE8
         }
         
      };
      b.undrag();
      b.drag(drag_move, drag_start, drag_end);
   };
  
   var writeNames = function() {
      var list = "<ul>";
      var edges = graph.getAllEdges();
      for(var iEdge in edges){
         var vertices = graph.getEdgeVertices(edges[iEdge]);
         var name1 = names[vertices[0]];
         var name2 = names[vertices[1]];
         list += "<li>"+name1+" "+taskStrings.and+" "+name2+"</li>";
      }
      list += "</ul>";
      $("#relations").html(list);
   };

   var stopAnimation = function() {
      subTask.raphaelFactory.destroy("animR");
      subTask.raphaelFactory.destroy("animT");
      subTask.raphaelFactory.destroy("animB");
   };

   var drawEdges = function(paper) {
      for (var iEdge = 0; iEdge < nbEdges; iEdge++) {
         var edge = edges[iEdge];
         var pos1 = positions[edge[0]];
         var pos2 = positions[edge[1]];
         var x1 = pos1[0] + cellWidth / 2;
         var y1 = pos1[1] + cellHeight / 2;
         var x2 = pos2[0] + cellWidth / 2;
         var y2 = pos2[1] + cellHeight / 2;
         paper.path(["M", x1, y1, "L", x2, y2]).attr({'stroke': 'black', 'stroke-width': 3});
      }
   };

   var drawPaper = function() {
      paper = subTask.raphaelFactory.create("anim","anim",animWidth, animHeight);
      
      var graphDrawer = new SimpleGraphDrawer(vertexAttr,edgeAttr);
      graphDrawer.setDrawVertex(drawVertex);
      graphDrawer.setDrawEdge(drawEdge);
      vGraph = new VisualGraph("vGraph", paper, graph, graphDrawer, true);
      initVertexPos();
      vGraph.redraw();
      
      castors = [];
      for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
         var x = 20;
         var y = iCastor*cellHeight + 15;
         var r = paper.rect(x, y, cellWidth, cellHeight, 4).attr({'fill': '#E0E0F8', 'opacity':1});
         var name = names[iCastor];
         var t = paper.text(x + dxText, y + dyText, name).attr("font-size", tailleLettreCastor);
         var b = paper.rect(x, y, cellWidth, cellHeight, 4).attr({'fill': '#FFFFFF', 'opacity':0});
         containers[0][iCastor] = paper.rect(x, y, cellWidth, cellHeight).attr("stroke-dasharray", ". ");
         beaverInCell[0][iCastor] = iCastor;
         beaverInCell[1][iCastor] = -1;
         r.id = iCastor;
         $(t.node).css({
            "-webkit-touch-callout": "none",
            "-webkit-user-select": "none",
            "-khtml-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none",
            "cursor" : "default"
         });
         castors[iCastor] = {r:r, t:t, b:b};
         initDragDrop(castors[iCastor]);
      }
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

      var vertex = this.paper.rect(pos.x,pos.y).attr(this.circleAttr);
      containers[1][id] = vertex;
      
      return [vertex];
   };

   function drawEdge(id, vertex1, vertex2, vertex1Info, vertex2Info, vertex1VisualInfo, vertex2VisualInfo, edgeInfo, edgeVisualInfo) {
      var x1 = vertex1VisualInfo.x + cellWidth/2;
      var y1 = vertex1VisualInfo.y + cellHeight/2;
      var x2 = vertex2VisualInfo.x + cellWidth/2;
      var y2 = vertex2VisualInfo.y + cellHeight/2;
      var path = "M"+x1+" "+y1+"L"+x2+" "+y2;
      var edge = this.paper.path(path).attr(this.lineAttr).toBack();
      edge.attr(edgeVisualInfo);
      return [edge];
   };

   var innerReloadAnswer = function() {
      for (var iType = 0; iType < 2; iType++) {
         for (var iBeaver = 0; iBeaver < nbNodes; iBeaver++) {
            beaverInCell[iType][iBeaver] = -1;
         }
      }
      for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
         beaverInCell[answer.pos[iCastor][0]][answer.pos[iCastor][1]] = iCastor;
      }
   };

   var allPlaced = function() {
      for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
         if (answer.pos[iCastor][0] != 1) {
            return false;
         }
      }
      return true;
   };

   var isCorrect = function() {
      for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
         if ((answer.pos[iCastor][0] != 1) || (answer.pos[iCastor][1] != iCastor)) {
            return false;
         }
      }
      return true;
   };

   var reloadAnswer = function() { 
      innerReloadAnswer();
      
      for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
         var container = containers[answer.pos[iCastor][0]][answer.pos[iCastor][1]];
         castors[iCastor].r.attr({"x":container.attrs.x,"y":container.attrs.y});
         castors[iCastor].t.attr({"x":container.attrs.x+dxText,"y":container.attrs.y+dyText});
         castors[iCastor].b.attr({"x":container.attrs.x,"y":container.attrs.y});
      }
   };
        
};
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
