function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         path: ["start","v_1","v_5","v_9","v_12","v_13","v_16","end"],
         graph: { 
            "vertexInfo": { 
               "start":{tree:4},"v_1":{tree:0},"v_2":{tree:2},"v_3":{tree:0},"v_4":{tree:3},"v_5":{tree:1},"v_6":{tree:4},"v_7":{tree:1},"v_8":{tree:0},"v_9":{tree:5},"v_10":{tree:0},
               "v_11":{tree:3},"v_12":{tree:3},"v_13":{tree:3},"v_14":{tree:4},"v_15":{tree:2},"v_16":{tree:4},"v_17":{tree:1},"end":{tree:3} },
            "edgeInfo": {
               "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},
               "e_11":{},"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_18":{},"e_19":{},"e_20":{},
               "e_21":{},"e_22":{},"e_23":{},"e_24":{} },
            "edgeVertices": {
               "e_0":["start","v_1"],"e_1":["start","v_2"],"e_2":["start","v_3"],"e_3":["start","v_4"],"e_4":["v_1","v_5"],
               "e_5":["v_2","v_5"],"e_6":["v_3","v_6"],"e_7":["v_4","v_7"],"e_8":["v_7","v_10"],"e_9":["v_5","v_8"],
               "e_10":["v_5","v_9"],"e_11":["v_6","v_12"],"e_12":["v_10","v_13"],"e_13":["v_8","v_11"],"e_14":["v_9","v_12"],
               "e_15":["v_11","v_14"],"e_16":["v_12","v_14"],"e_17":["v_12","v_13"],"e_18":["v_13","v_15"],"e_19":["v_15","v_14"],
               "e_20":["v_14","v_17"],"e_21":["v_17","end"],"e_22":["v_15","end"],"e_23":["v_13","v_16"],"e_24":["v_16","end"] },
            "directed":false 
         },
         vertexVisualInfo: {
            "start":{"x":113,"y":113},
            "v_1":{"x":197,"y":54},
            "v_2":{"x":213,"y":134},
            "v_3":{"x":218,"y":207},
            "v_4":{"x":144,"y":241},
            "v_5":{"x":289,"y":92},
            "v_6":{"x":319,"y":208},
            "v_7":{"x":220,"y":297},
            "v_8":{"x":370,"y":55},
            "v_9":{"x":381,"y":136},
            "v_10":{"x":324,"y":315},
            "v_11":{"x":459,"y":67},
            "v_12":{"x":452,"y":200},
            "v_13":{"x":414,"y":282},
            "v_14":{"x":519,"y":132},
            "v_15":{"x":531,"y":243},
            "v_16":{"x":516,"y":329},
            "v_17":{"x":599,"y":158},
            "end":{"x":627,"y":256} 
         }
      },
      medium: {
         path: ["start","v_4","v_7","v_10","v_13","v_15","v_14","v_17","end"],
         hidden: [6],
         graph: { 
            "vertexInfo": { 
               "start":{tree:4},"v_1":{tree:0},"v_2":{tree:2},"v_3":{tree:0},"v_4":{tree:3},"v_5":{tree:1},"v_6":{tree:4},"v_7":{tree:1},"v_8":{tree:0},"v_9":{tree:5},"v_10":{tree:0},
               "v_11":{tree:3},"v_12":{tree:3},"v_13":{tree:3},"v_14":{tree:4},"v_15":{tree:2},"v_16":{tree:4},"v_17":{tree:1},"end":{tree:3} },
            "edgeInfo": {
               "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},
               "e_11":{},"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_18":{},"e_19":{},"e_20":{},
               "e_21":{},"e_22":{},"e_23":{},"e_24":{} },
            "edgeVertices": {
               "e_0":["start","v_1"],"e_1":["start","v_2"],"e_2":["start","v_3"],"e_3":["start","v_4"],"e_4":["v_1","v_5"],
               "e_5":["v_2","v_5"],"e_6":["v_3","v_6"],"e_7":["v_4","v_7"],"e_8":["v_7","v_10"],"e_9":["v_5","v_8"],
               "e_10":["v_5","v_9"],"e_11":["v_6","v_12"],"e_12":["v_10","v_13"],"e_13":["v_8","v_11"],"e_14":["v_9","v_12"],
               "e_15":["v_11","v_14"],"e_16":["v_12","v_14"],"e_17":["v_12","v_13"],"e_18":["v_13","v_15"],"e_19":["v_15","v_14"],
               "e_20":["v_14","v_17"],"e_21":["v_17","end"],"e_22":["v_15","end"],"e_23":["v_13","v_16"],"e_24":["v_16","end"] },
            "directed":false 
         },
         vertexVisualInfo: {
            "start":{"x":113,"y":113},
            "v_1":{"x":197,"y":54},
            "v_2":{"x":213,"y":134},
            "v_3":{"x":218,"y":207},
            "v_4":{"x":144,"y":241},
            "v_5":{"x":289,"y":92},
            "v_6":{"x":319,"y":208},
            "v_7":{"x":220,"y":297},
            "v_8":{"x":370,"y":55},
            "v_9":{"x":381,"y":136},
            "v_10":{"x":324,"y":315},
            "v_11":{"x":459,"y":67},
            "v_12":{"x":452,"y":200},
            "v_13":{"x":414,"y":282},
            "v_14":{"x":519,"y":132},
            "v_15":{"x":531,"y":243},
            "v_16":{"x":516,"y":329},
            "v_17":{"x":599,"y":158},
            "end":{"x":627,"y":256} 
         }
      },
      hard: {
         path: ["start","v_3","v_6","v_12","v_9","v_5","v_8","v_11","v_14","v_15","end"],
         hidden: [2,4,6],
         graph: { 
            "vertexInfo": { 
               "start":{tree:4},"v_1":{tree:0},"v_2":{tree:2},"v_3":{tree:0},"v_4":{tree:3},"v_5":{tree:1},"v_6":{tree:4},"v_7":{tree:1},"v_8":{tree:0},"v_9":{tree:5},"v_10":{tree:0},
               "v_11":{tree:3},"v_12":{tree:3},"v_13":{tree:3},"v_14":{tree:4},"v_15":{tree:2},"v_16":{tree:4},"v_17":{tree:1},"end":{tree:3} },
            "edgeInfo": {
               "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},
               "e_11":{},"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_18":{},"e_19":{},"e_20":{},
               "e_21":{},"e_22":{},"e_23":{},"e_24":{} },
            "edgeVertices": {
               "e_0":["start","v_1"],"e_1":["start","v_2"],"e_2":["start","v_3"],"e_3":["start","v_4"],"e_4":["v_1","v_5"],
               "e_5":["v_2","v_5"],"e_6":["v_3","v_6"],"e_7":["v_4","v_7"],"e_8":["v_7","v_10"],"e_9":["v_5","v_8"],
               "e_10":["v_5","v_9"],"e_11":["v_6","v_12"],"e_12":["v_10","v_13"],"e_13":["v_8","v_11"],"e_14":["v_9","v_12"],
               "e_15":["v_11","v_14"],"e_16":["v_12","v_14"],"e_17":["v_12","v_13"],"e_18":["v_13","v_15"],"e_19":["v_15","v_14"],
               "e_20":["v_14","v_17"],"e_21":["v_17","end"],"e_22":["v_15","end"],"e_23":["v_13","v_16"],"e_24":["v_16","end"] },
            "directed":false 
         },
         vertexVisualInfo: {
            "start":{"x":113,"y":113},
            "v_1":{"x":197,"y":54},
            "v_2":{"x":213,"y":134},
            "v_3":{"x":218,"y":207},
            "v_4":{"x":144,"y":241},
            "v_5":{"x":289,"y":92},
            "v_6":{"x":319,"y":208},
            "v_7":{"x":220,"y":297},
            "v_8":{"x":370,"y":55},
            "v_9":{"x":381,"y":136},
            "v_10":{"x":324,"y":315},
            "v_11":{"x":459,"y":67},
            "v_12":{"x":452,"y":200},
            "v_13":{"x":414,"y":282},
            "v_14":{"x":519,"y":132},
            "v_15":{"x":531,"y":243},
            "v_16":{"x":516,"y":329},
            "v_17":{"x":599,"y":158},
            "end":{"x":627,"y":256} 
         }
      }
   };
   var paperPath;
   var paperGraph;
   var pathHeight;
   var pathWidth;
   var path;
   var graph;
   var graphMouse;
   var vertexToggler;
   var graphWidth = 740;
   var graphHeight = 384;
   var vGraph;
   var graphDrawer;
   var src = [];
   var treeSize = 47;
   var margin = 20;
   var vertexAttr = {
      r: treeSize/2 + 5,
      stroke: "none",
      fill: "white"
   };
   var markedVertexAttr = {
      r: treeSize/2 + 5,
      stroke: "black",
      "stroke-width": 3,
      fill: "white"
   };
   var edgeAttr = {
      stroke: '#a05000',
      "stroke-width": 5
   };
   var markedEdgeAttr = {
      stroke: 'black',
      "stroke-width": 7
   };
   var arrowAttr = {
      width: 40,
      height: 30
   };
   var hidden;
   var buttons = [];

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      getSrc();
      path = data[level].path;
      pathHeight = treeSize + margin;
      pathWidth = path.length * treeSize + margin;
      graph = Graph.fromJSON(JSON.stringify(data[level].graph));
      hidden = (level !== "easy") ? data[level].hidden : null;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initPath();
      initGraph();
      reloadAnswer();
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
      var result = { successRate: 1, message: taskStrings.success };
      if(level === "easy"){
         if(answer.length === 0){
            result = { successRate: 0, message: taskStrings.click };
         }else if(answer.length < path.length){
            result = { successRate: 0, message: taskStrings.notEnoughTrees };
         }else if(answer.length > path.length){
            result = { successRate: 0, message: taskStrings.tooManyTrees };
         }else{
            for(var iNode = 0; iNode < path.length; iNode++){
               if(!Beav.Array.has(answer,path[iNode])){
                  result = { successRate: 0, message: taskStrings.wrongTree };
                  break;
               }
            }
         }  
      }else if(answer.length === 0){
         result = { successRate: 0, message: taskStrings.clickButton };
      }else if(answer.length < hidden.length){
         result = { successRate: 0, message: taskStrings.missingTrees };
      }else{
         for(var iAns = 0; iAns < answer.length; iAns++){
            var vertex = path[hidden[iAns]];
            var vertexTree = graph.getVertexInfo(vertex).tree;
            if(answer[iAns] !== vertexTree){
               result = { successRate: 0, message: taskStrings.wrongPath };
               break;
            }
         }
      } 
      return result;
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initPath() {
      paperPath = subTask.raphaelFactory.create('path','path',pathWidth,pathHeight);
      paperPath.rect(2,2,pathWidth-4,pathHeight-4);
      for(var iTree = 0; iTree < path.length; iTree++){
         var x = margin/2 + iTree*treeSize;
         var y = margin/2;
         var tree = graph.getVertexInfo(path[iTree]).tree;
         var source = src[tree];
         if(level !== "easy" && Beav.Array.has(hidden,iTree)){
            var button = new Button(paperPath,x,y - 3,treeSize,treeSize + 6,"?");
            buttons.push(button);
         }else{
            paperPath.image(source,x,y,treeSize,treeSize);
         }
      }
      initHandlers();
   };

   function initGraph() {
      paperGraph = subTask.raphaelFactory.create('graph','graph',graphWidth,graphHeight);
      var graphDrawer = new SimpleGraphDrawer(vertexAttr,edgeAttr);
      graphDrawer.setDrawVertex(drawVertex);
      vGraph = new VisualGraph("vGraph", paperGraph, graph, graphDrawer, true, data[level].vertexVisualInfo);

      placeArrows();
      if(level === "easy"){
         graphMouse = new GraphMouse("graphMouse", graph, vGraph);
         vertexToggler = new VertexToggler("vTog", graph, vGraph, graphMouse, vertexToggle, true);
      }
   };

   function initHandlers() {
      if(level !== "easy"){
         for(var iButton = 0; iButton < buttons.length; iButton++){
            buttons[iButton].click(clickButton(iButton));
         }
      }
   };

   function drawVertex(id,info,visualInfo) {
      var pos = this._getVertexPosition(visualInfo);
      this.originalPositions[id] = pos;
      var background = paperGraph.circle(pos.x,pos.y).attr(vertexAttr);
      var tree = paperGraph.image(src[info.tree],pos.x - treeSize/2,pos.y - treeSize/2, treeSize, treeSize);
      var vertex = paperGraph.set(background,tree);
      this._addCustomElements(id, vertex);
      return [vertex];
   };

   function placeArrows() {
      var startPos = vGraph.getVertexVisualInfo("start");
      var endPos = vGraph.getVertexVisualInfo("end");
      var arrowSrc = $("#arrow").attr("src");
      var x1 = startPos.x - arrowAttr.width - vertexAttr.r;
      var y1 = startPos.y - arrowAttr.height/2;
      var x2 = endPos.x + vertexAttr.r;
      var y2 = endPos.y - arrowAttr.height/2;
      paperGraph.image(arrowSrc, x1, y1).attr(arrowAttr);
      paperGraph.image(arrowSrc, x2, y2).attr(arrowAttr);
   };

   function vertexToggle(id,selected) {
      var vertex = vGraph.getRaphaelsFromID(id);
      
      if(selected){
         vertex[0].attr(markedVertexAttr);
         answer.push(id);
      }else{
         vertex[0].attr(vertexAttr);
         var index = Beav.Array.indexOf(answer,id);
         answer.splice(index,1);
      }
      updateEdges(id,selected);
      var res = getResultAndMessage();
      if(res.successRate === 1){
         displayHelper.validate("stay");
      }
   };

   function updateEdges(id,selected) {
      var neighbors = graph.getNeighbors(id);
      for(var iNeigh = 0; iNeigh < neighbors.length; iNeigh++){
         if(graph.getVertexInfo(neighbors[iNeigh]).selected){
            var edgeId = graph.getEdgesBetween(id,neighbors[iNeigh])[0];
            var edge = vGraph.getRaphaelsFromID(edgeId);
            var newAttr = (selected) ? markedEdgeAttr : edgeAttr;
            edge[0].attr(newAttr);
         }
      }
   };

   function clickButton(i) {
      return function() {
         var x = buttons[i].elements.rect.attrs.x;
         var y = buttons[i].elements.rect.attrs.y;
         if(!answer[i] && answer[i] !== 0){
            answer[i] = 0;
            buttons[i].elements.text.remove();
         }else{
            answer[i] = (answer[i] + 1)%6;
            buttons[i].elements.tree.remove();
         }
         var tree = paperPath.image(src[answer[i]],x,y,treeSize,treeSize);
         buttons[i].addElement("tree",tree);
      }
   }

   function getSrc() {
      for(var iTree = 0; iTree < 6; iTree++){
         src[iTree] = $("#tree_"+(iTree+1)).attr("src")
      }
   };

   function reloadAnswer() {
      if(level === "easy"){
         for(var iVert = 0; iVert < answer.length; iVert++){
            var id = answer[iVert];
            graph.setVertexInfo(id,{selected:true});
            var vertex = vGraph.getRaphaelsFromID(id);
            vertex[0].attr(markedVertexAttr);
            updateEdges(id,true);
         }
      }else{
         for(var iAns = 0; iAns < answer.length; iAns++){
            var x = buttons[iAns].elements.rect.attrs.x;
            var y = buttons[iAns].elements.rect.attrs.y;
            var tree = paperPath.image(src[answer[iAns]],x,y,treeSize,treeSize);
            buttons[iAns].elements.text.remove();
            buttons[iAns].addElement("tree",tree);
         }
      }
   };

}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();


