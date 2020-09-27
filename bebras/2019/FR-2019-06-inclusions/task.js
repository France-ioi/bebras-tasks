function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         initialRect: [
            {x:140,y:30,width:200,height:80},
            {x:260,y:130,width:280,height:140},
            {x:310,y:150,width:70,height:40}
         ],
         targetRect: [
            {x:21,y:17,width:304,height:267},
            {x:43,y:36,width:249,height:116},
            {x:38,y:165,width:255,height:91}
         ],
         diagramHeight: 150
      },
      medium: {
         initialRect: [
            {x:80,y:60,width:70,height:60},
            {x:300,y:60,width:70,height:60},
            {x:520,y:60,width:70,height:60},
            {x:80,y:180,width:70,height:60},
            {x:300,y:180,width:70,height:60},
            {x:520,y:180,width:70,height:60},
            {x:490,y:40,width:130,height:220}
         ],
         targetRect: [
            {x:21,y:17,width:304,height:267},
            {x:43,y:36,width:249,height:116},
            {x:38,y:165,width:255,height:91},
            {x:57,y:52,width:94,height:81},
            {x:179,y:55,width:87,height:78},
            {x:496,y:21,width:225,height:260},
            {x:530,y:40,width:150,height:220}
         ],
         diagramHeight: 250
      },
      hard: {
         initialRect: [
            {x:80,y:60,width:70,height:60},
            {x:300,y:60,width:70,height:60},
            {x:520,y:60,width:70,height:60},
            {x:80,y:180,width:70,height:60},
            {x:300,y:180,width:70,height:60},
            {x:520,y:180,width:70,height:60},
            {x:270,y:40,width:130,height:220},
            {x:490,y:40,width:130,height:220}
         ],
         targetRect: [
            {x:168,y:79,width:540,height:145},
            {x:331,y:14,width:275,height:269},
            {x:189,y:93,width:99,height:103},
            {x:344,y:31,width:244,height:26},
            {x:405,y:105,width:191,height:100},
            {x:343,y:88,width:176,height:90},
            {x:341,y:230,width:254,height:44},
            {x:430,y:124,width:69,height:42}
         ],
         diagramHeight: 250
      }
   };
   var targetPaper;
   var currentPaper;
   var rectPaper;
   var examplePaper;
   var diagramWidth = 350;
   var exampleWidth = 135;
   var exampleHeight = 70;
   var diagramHeight;
   var rectPaperWidth = 690;
   var rectPaperHeight = 300;
   var minSize = 19;
   var minCornerSpacing = 10;
   var rectDragLimits = {
      xMin: 20,
      yMin: 20,
      xMax: rectPaperWidth - 20,
      yMax: rectPaperHeight - 20
   };

   var rectanglesRaph = [];
   var bigRect;
   var rectID = null;
   var cornerData;
   var draggedCorner;
   var draggedRect;
   var initPos;
   var initRectPos;
   var dragLimits;
   var currentGraph;
   var targetGraph;
   var currentVisualGraph;
   var targetVisualGraph;
   var graphDrawer;
   var letters = ["A","B","C","D","E","F","G","H"];
   var exampleVisualGraph = {
      "vertexVisualInfo":{
         "v_0":{"x":15,"y":60},
         "v_1":{"x":15,"y":10}
      },
      "edgeVisualInfo":{"e_0":{}},
      "minGraph":{
         "vertexInfo":{"v_0":{"label":"A"},"v_1":{"label":"B"}},
         "edgeInfo":{"e_0":{}},
         "edgeVertices":{"e_0":["v_1","v_0"]},
         "directed":true
      }
   };

   var rectAttr = {
      stroke: "black",
      "stroke-width": 1,
      fill: "none",
      r: 5
   };
   var cornerAttr = {
      stroke: "blue",
      "stroke-width": 3,
      cursor: "pointer"
   };
   var cornerClickAreaAttr = {
      stroke: "red",
      "stroke-width": 30,
      cursor: "pointer",
      opacity: 0
   };
   var vertexCircleAttr = {
      r: 10
   };
   var vertexAttr = {
      "stroke-width": 1,
      stroke: "black",
      fill: "black",
      width: 20,
      height: 20,
      r: 2
   };
   var edgeAttr = {
      "stroke-width": 2,
      stroke: "black",
      "arrow-end": "long-classic-wide"
   };
   var highlightedEdgeAttr = {
      "stroke-width": 4,
      stroke: "red",
      "arrow-end": "long-classic-wide"
   };
   var letterAttr = {
      "font-size": minSize - 3,
      "font-weight": "bold"
   };
   var vertexLabelAttr = {
      "font-size": 16,
      "font-weight": "bold",
      "fill": "white"
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      diagramHeight = data[level].diagramHeight;
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function () {
      $("hr").css("height",diagramHeight+"px");
      initPapers();
      initRectangles();
      initGraph();
      initExample();
      updateGraph(true,true);
      updateGraph(true,false);
      displayHelper.customValidate = checkResult;
      displayError("");
      removeHighlight();
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
      var defaultAnswer = data[level].initialRect;
      return defaultAnswer;
   };

   function getResultAndMessage() {
      return checkResult(true);
   };

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initExample() {
      $("#example").width(exampleWidth);
      examplePaper = subTask.raphaelFactory.create("example","example",exampleWidth,exampleHeight);
      VisualGraph.fromJSON(JSON.stringify(exampleVisualGraph), "example", examplePaper, null, graphDrawer,true);
      var pos1 = {
         x: 50,
         y: 5,
         width: 80,
         height: 60
      };
      var pos2 = {
         x: 70,
         y: 20,
         width: 40,
         height: 30
      };
      getRectangle(examplePaper,pos1,"A");
      getRectangle(examplePaper,pos2,"B");
   };

   function initPapers() {
      targetPaper = subTask.raphaelFactory.create("target","target",diagramWidth,diagramHeight);
      currentPaper = subTask.raphaelFactory.create("current","current",diagramWidth,diagramHeight);
      rectPaper = subTask.raphaelFactory.create("rectangles","rectangles",rectPaperWidth,rectPaperHeight);
      $("#rectangles").css("width",rectPaperWidth);
   }

   function initRectangles() {
      bigRect = rectPaper.rect(0,0,rectPaperWidth,rectPaperHeight).attr("fill","rgb(240,240,240)");
      if(!Beav.Navigator.isIE8()){
         Beav.dragWithTouch(bigRect, onDragMove, onDragStart, onDragEnd);
      }

      for(var iRect = 0; iRect < answer.length; iRect++){
         initRectangle(iRect);
      }
   };

   function initRectangle(id) {
      rectanglesRaph[id] = getRectangle(rectPaper,answer[id],letters[id]);
      var tlCorner = rectanglesRaph[id].topLeft;
      var brCorner = rectanglesRaph[id].bottomRight;
      Beav.dragWithTouch(tlCorner, onDragCornerMove, onDragCornerStart, onDragCornerEnd);
      Beav.dragWithTouch(brCorner, onDragCornerMove, onDragCornerStart, onDragCornerEnd);
   };

   function initGraph() {
      graphDrawer = new SimpleGraphDrawer(vertexCircleAttr,edgeAttr);
      graphDrawer.setDrawVertex(vertexDrawer);
      graphDrawer.setVertexLabelAttr(vertexLabelAttr);
      targetGraph = new Graph(true);
      currentGraph = new Graph(true);
      for(var iRect = 0; iRect < answer.length; iRect++){
         targetGraph.addVertex(letters[iRect],{label:letters[iRect]});
         currentGraph.addVertex(letters[iRect],{label:letters[iRect]});
      }
   };

   function getRectangle(paper,pos,letter) {
      var rect = paper.rect().attr(pos).attr(rectAttr);
      var tlCorner = getCorner(paper,pos,"topLeft");
      var brCorner = getCorner(paper,pos,"bottomRight");
      var letter = paper.text(pos.x + pos.width - minSize/2,pos.y + minSize/2,letter).attr(letterAttr);
      return {
         rect:rect,
         topLeft: tlCorner,
         bottomRight: brCorner,
         letter: letter
      };
   };

   function getCorner(paper,pos,type) {
      var x = pos.x;
      var y = pos.y;
      var w = pos.width;
      var h = pos.height;
      if(type == "topLeft"){
         var path = "M"+x+" "+(y + minSize)+"V"+y+"H"+(x + minSize);
      }else{
         var path = "M"+(x + w)+" "+(y + h - minSize)+"V"+(y + h)+"H"+(x + w - minSize);
      }
      var clickArea = paper.path(path).attr(cornerClickAreaAttr);
      var corner = paper.path(path).attr(cornerAttr);
      return paper.set(corner,clickArea);
   };

   function vertexDrawer(id,info,vInfo) {
      var pos = this._getVertexPosition(vInfo);
      this.originalPositions[id] = pos;
      var label = (info.label) ? info.label : "";
      var vertex = this.paper.rect(pos.x - vertexAttr.width/2,pos.y - vertexAttr.height/2).attr(vertexAttr);
      var labelRaph = this.paper.text(pos.x,pos.y,label).attr(this.vertexLabelAttr);
      // console.log(label)
      return [vertex,labelRaph];
   };

   function updateGraph(visual,target) {
      if(target){
         var graph = targetGraph;
         var paper = targetPaper;
      }else{
         var graph = currentGraph;
         var paper = currentPaper;
      }
      var edges = graph.getAllEdges();
      for(var iEdge = 0; iEdge < edges.length; iEdge++){
         graph.removeEdge(edges[iEdge]);
      }
      if(visual && currentVisualGraph){
         currentVisualGraph.remove();
      }

      var parents = getParents(target)
      var levels = getLevels(parents);

      addEdges(levels,parents,graph);
      invertEdges(graph);
      var vertexVisualInfo = getVertexVisualInfo(levels);
      if(visual){
         if(target){
            targetVisualGraph = new VisualGraph("currentVisualGraph",paper,graph,graphDrawer,true,vertexVisualInfo);
         }else{
            currentVisualGraph = new VisualGraph("currentVisualGraph",paper,graph,graphDrawer,true,vertexVisualInfo);
         }
      }else{
         return vertexVisualInfo;
      }
   };

   function invertEdges(graph) {
      var edges = graph.getAllEdges();
      for(var iEdge = 0; iEdge < edges.length; iEdge++){
         var edge = edges[iEdge];
         var vertices = graph.getEdgeVertices(edge);
         var v1 = vertices[0];
         var v2 = vertices[1];
         graph.removeEdge(edge);
         graph.addEdge(v2+"_"+v1,v2,v1);
      }
   };

   function getParents(target) {
      var containers = [];
      var parents = [];
      for(var iRect = 0; iRect < answer.length; iRect++){
         containers[iRect] = getContainers(iRect,target);
      }
      for(var iRect = 0; iRect < answer.length; iRect++){
         var cont = containers[iRect];
         var par = JSON.parse(JSON.stringify(cont));
         for(var iCont = 0; iCont < cont.length; iCont++){
            for(var jCont = 0; jCont < cont.length; jCont++){
               if(Beav.Array.has(containers[cont[iCont]],cont[jCont])){
                  par[jCont] = null;
               }
            }
         }
         parents[iRect] = [];
         for(var iPar = 0; iPar < par.length; iPar++){
            if(par[iPar] !== null){
               parents[iRect].push(par[iPar]);
            }
         }
      }
      return parents;
   };

   function getContainers(id,target) {
      if(target){
         var pos = data[level].targetRect[id];
      }else{
         var pos = answer[id];
      }
      var containers = [];
      for(var iRect = 0; iRect < answer.length; iRect++){
         if(iRect != id){
            var contPos = (target) ? data[level].targetRect[iRect] : answer[iRect];
            if(contPos.x < pos.x && contPos.y < pos.y && (contPos.x + contPos.width) > (pos.x + pos.width) && (contPos.y + contPos.height) > (pos.y + pos.height)){
               containers.push(iRect);
            }
         }
      }
      return containers;
   };

   function getLevels(parents) {
      var levels = [];
      for(var iRect = 0; iRect < answer.length; iRect++){
         if(parents[iRect].length == 0){
            if(!levels[0]){
               levels[0] = [];
            }
            levels[0].push(iRect);
         }
      }
      var level = 0;
      do{
         var levelContent = levels[level];
         var newLevel = false;
         for(var iRect = 0; iRect < levelContent.length; iRect++){
            for(var jRect = 0; jRect < answer.length; jRect++){
               if(Beav.Array.has(parents[jRect],levelContent[iRect])){
                  if(!levels[level + 1]){
                     levels[level + 1] = [];
                  }
                  if(!Beav.Array.has(levels[level + 1],jRect))
                     levels[level + 1].push(jRect);
                  newLevel = true;
               }
            }
         }
         level++;
      }while(newLevel)
      return levels;
   };

   function addEdges(levels,parents,graph) {
      for(var iLevel = 1; iLevel < levels.length; iLevel++){
         var level = levels[iLevel];
         for(var i = 0; i < level.length; i++){
            var rectID = level[i];
            var vID = letters[rectID];
            var rectParents = parents[rectID];
            for(var iParent = 0; iParent < rectParents.length; iParent++){
               var parentID = rectParents[iParent];
               var parentVertexID = letters[parentID];
               var edgeID = parentVertexID+"-"+vID;
               graph.addEdge(edgeID,parentVertexID,vID);
            }
         }
      }
   };

   function getVertexVisualInfo(levels) {
      var vInfo = {};
      var minY = 20;
      var maxY = diagramHeight - minY;
      var minX = 20;
      var maxX = diagramWidth - 20;
      for(var iLevel = 0; iLevel < levels.length; iLevel++){
         var floor = levels[iLevel];
         if(level == "easy"){
            var y = (levels.length < 2) ? Math.round((maxY - iLevel * (maxY - minY)/2)) : Math.round((maxY - iLevel * (maxY - minY)/(levels.length - 1)));
         }else{
            var y = (levels.length <= 3) ? Math.round((maxY - iLevel * (maxY - minY)/2)) : Math.round((maxY - iLevel * (maxY - minY)/(levels.length - 1)));
         }
         floor.sort();
         for(var i = 0; i < floor.length; i++){
            var rectID = floor[i];
            var vID = letters[rectID];
            var x = Math.round(minX + (i + 1) * (maxX - minX)/(floor.length + 1));
            vInfo[vID] = {x:x,y:y};
         }
      }
      return vInfo;
   };

   function onDragStart(x,y,event) {
      // console.log("onDragStart"+rectID);
      displayError("");
      removeHighlight();
      if(event.touches){
         x = event.touches[0].pageX;
         y = event.touches[0].pageY;
      }
      var paperPos = $("#rectangles").offset();
      var xc = x - paperPos.left;
      var yc = y - paperPos.top;
      initPos = {x:xc,y:yc};
      if(rectID == null){
         rectID = findRectangle(xc,yc);
      }else{
         onDragEnd();
         return;
      }
      if(rectID != null){
         initRectPos = JSON.parse(JSON.stringify(answer[rectID]));
         draggedRect = rectanglesRaph[rectID];
      }
   };

   function onDragMove(dx,dy,x,y,event) {
      var paperPos = $("#rectangles").offset();
      var xc = x - paperPos.left;
      var yc = y - paperPos.top;
      if(!draggedRect || rectID == null){
         return
      }
      // REVIEW[ARNAUD]: je n'arrive pas bien à suivre la logique et l'exhaustivité de ces tests et soustractions. Sans doute lié au bug que l'on a (?)
      // => pour éviter que le rectangle ne sorte de la fenêtre de drag
      if(xc < rectDragLimits.xMin){
         dx = rectDragLimits.xMin - initPos.x;
      }else if(xc > rectDragLimits.xMax){
         dx = rectDragLimits.xMax - initPos.x;
      }
      if(yc < rectDragLimits.yMin){
         dy = rectDragLimits.yMin - initPos.y;
      }else if(yc > rectDragLimits.yMax){
         dy = rectDragLimits.yMax - initPos.y;
      }
      var set = rectPaper.set(draggedRect.rect,draggedRect.topLeft,draggedRect.bottomRight,draggedRect.letter);
      set.transform("T"+dx+" "+dy);

      answer[rectID] = {
         x: initRectPos.x + dx,
         y: initRectPos.y + dy,
         width: initRectPos.width,
         height: initRectPos.height
      };
   };

   function onDragEnd(event) {
      // console.log("dragend")
      if(!draggedRect || rectID == null){
         return
      }else{
         var set = rectPaper.set(draggedRect.rect,draggedRect.topLeft,draggedRect.bottomRight,draggedRect.letter);
         set.remove();
         initRectangle(rectID);
         draggedRect = null;
         rectID = null;
      }
      updateGraph(true,false); 
   };

   function findRectangle(xc,yc) {
      var smallestSize = Infinity;
      var id = null;
      for(var iRect = 0; iRect < answer.length; iRect++) {
         // REVIEW[ARNAUD]: Pour une prochaine fois : ce serait plus court et plus lisible avec les fonctions auxiliaires
         // rectContains(r, x, y) { return (x > r.x && y > r.y && x < r.x + r.width && y < r.y + r.height);}
         // rectArea(r) { return r.width * r.height; }
         var x = answer[iRect].x;
         var y = answer[iRect].y;
         var w = answer[iRect].width;
         var h = answer[iRect].height;
         if(xc > x && yc > y && xc < x + w && yc < y + h){
            if(w * h < smallestSize){
               smallestSize = w * h;
               id = iRect;
            }
         }
      }
      return id;
   };

   function onDragCornerStart(x,y,event) {
      // console.log("onDragCornerStart")
      displayError("");
      removeHighlight();

      if(event.touches){
         x = event.touches[0].pageX;
         y = event.touches[0].pageY;
      }
      var paperPos = $("#rectangles").offset();
      var xc = x - paperPos.left;
      var yc = y - paperPos.top;
      if(!cornerData){
         cornerData = findCorner(xc,yc);
      }else{
         cornerData = null;
         return
      }
      if(cornerData){
         draggedCorner = rectanglesRaph[cornerData.rectID][cornerData.type];
         draggedRect = rectanglesRaph[cornerData.rectID]["rect"];
         draggedRect.toFront();
         draggedCorner.toFront();
         if(cornerData.type == "topLeft"){
            rectanglesRaph[cornerData.rectID]["bottomRight"].toFront();
            dragLimits = {
               xMin: 10,
               yMin: 10,
               xMax: Math.min(draggedRect.attr("x") + draggedRect.attr("width") - minSize,rectPaperWidth - minSize),
               yMax: Math.min(draggedRect.attr("y") + draggedRect.attr("height") - minSize,rectPaperHeight - minSize)
            }
         }else{
            rectanglesRaph[cornerData.rectID]["topLeft"].toFront();
            dragLimits = {
               xMin: Math.max(draggedRect.attr("x") + minSize,minSize),
               yMin: Math.max(draggedRect.attr("y") + minSize,minSize),
               xMax: rectPaperWidth - 10,
               yMax: rectPaperHeight - 10
            }
         }
      }
   };

   function onDragCornerMove(dx,dy,x,y,event) {
      var paperPos = $("#rectangles").offset();
      var xc = x - paperPos.left;
      var yc = y - paperPos.top;
      if(!draggedCorner || !cornerData){
         return
      }
      var rect = answer[cornerData.rectID]; // REVIEW[ARNAUD]: j'ai factorisé une vingtaine d'occurences avec cette variable
      if(cornerData.type == "topLeft"){
         if(xc <= dragLimits.xMin){
            dx = dragLimits.xMin - rect.x;
         }
         if(yc <= dragLimits.yMin){
            dy = dragLimits.yMin - rect.y;
         }
         if(xc >= dragLimits.xMax){
            dx = dragLimits.xMax - rect.x;
         }
         if(yc >= dragLimits.yMax){
            dy = dragLimits.yMax - rect.y;
         }
      }else{
         if(xc <= dragLimits.xMin){
            dx = dragLimits.xMin - rect.x - rect.width;
         }
         if(yc <= dragLimits.yMin){
            dy = dragLimits.yMin - rect.y - rect.height;
         }
         if(xc >= dragLimits.xMax){
            dx = dragLimits.xMax - rect.x - rect.width;
         }
         if(yc >= dragLimits.yMax){
            dy = dragLimits.yMax - rect.y - rect.height;
         }
      }
      draggedCorner.transform("t"+dx+","+dy);
      if(cornerData.type == "topLeft"){
         var newX = rect.x + dx;
         var newY = rect.y + dy;
         var newW = rect.width - dx;
         var newH = rect.height - dy;
         if(newX > rect.x + rect.width){
            newX = rect.x;
            newW = rect.width;
         }
         if(newY > rect.y + rect.height){
            newY = rect.y;
            newH = rect.height;
         }
         draggedRect.attr({
            x: newX,
            y: newY,
            width: newW,
            height: newH
         });
         rectanglesRaph[cornerData.rectID]["letter"].attr({
            y: newY + minSize/2
         })
      }else{
         var newW = rect.width + dx;
         if(newW < minSize){
            newW = minSize;
         }
         var newH = rect.height + dy;
         if(newH < minSize){
            newH = minSize;
         }
         draggedRect.attr({
            width: newW,
            height: newH
         });
         rectanglesRaph[cornerData.rectID]["letter"].attr({
            x: rect.x + newW - minSize/2
         })
      }
   };

   function onDragCornerEnd(event) {
      if(!draggedCorner || !cornerData){
         return
      }else{
         var id = cornerData.rectID;
         var rect = draggedRect;

         fixEdgeOverlap(id,rect);

         var x = rect.attr("x");
         var y = rect.attr("y");
         var w = rect.attr("width");
         var h = rect.attr("height");

         var type = cornerData.type;

         answer[id] = {
            x: x,
            y: y,
            width: w,
            height: h
         };
         draggedCorner.remove();
         // REVIEW[ARNAUD] renommer "topLeft" en "topleft" et "BR" en "bottomright", ce sera plus clair
         // => fait
         var oppositeType = (type == "topLeft") ? "bottomRight" : "topLeft";
         rectanglesRaph[id][oppositeType].remove();
         draggedCorner = null;
         draggedRect = null;
         cornerData = null;
         rectanglesRaph[id][type] = getCorner(rectPaper,answer[id],type);
         rectanglesRaph[id][type].undrag();
         rectanglesRaph[id][type].drag(onDragCornerMove,onDragCornerStart,onDragCornerEnd);
         rectanglesRaph[id][oppositeType] = getCorner(rectPaper,answer[id],oppositeType);
         rectanglesRaph[id][oppositeType].undrag();
         rectanglesRaph[id][oppositeType].drag(onDragCornerMove,onDragCornerStart,onDragCornerEnd);
      }
      updateGraph(true,false);  // REVIEW[ARNAUD]: missing argument (false?).
   };

   function findCorner(x,y) {
      var distance = Infinity;
      var corner = {};
      for(var iRect = 0; iRect < answer.length; iRect++) {
         var TLx = answer[iRect].x;
         var TLy = answer[iRect].y;
         var BRx = TLx + answer[iRect].width;
         var BRy = TLy + answer[iRect].height;
         var distanceTL = getDistanceBetween(x,y,TLx,TLy);
         var distanceBR = getDistanceBetween(x,y,BRx,BRy);
         if(distanceTL < distance){
            distance = distanceTL;
            corner.rectID = iRect;
            corner.type = "topLeft";
         }
         if(distanceBR < distance){
            distance = distanceBR;
            corner.rectID = iRect;
            corner.type = "bottomRight";
         }
      }
      return corner
   };

   function fixEdgeOverlap(id,rect) {
      var edgeOverlap = checkEdgeOverlap(id,rect);
      var nOverlap = 0;
      do{
         if(edgeOverlap){
            if(edgeOverlap.overlappingEdge == "left" || edgeOverlap.overlappingEdge == "top"){
               limits = {
                  xMin: 10,
                  yMin: 10,
                  xMax: draggedRect.attr("x") + draggedRect.attr("width") - minSize,
                  yMax: draggedRect.attr("y") + draggedRect.attr("height") - minSize
               }
            }else{
               limits = {
                  xMin: draggedRect.attr("x") + minSize,
                  yMin: draggedRect.attr("y") + minSize,
                  xMax: rectPaperWidth - 10,
                  yMax: rectPaperHeight - 10
               }
            }
            if(edgeOverlap.overlappingEdge == "left" || edgeOverlap.overlappingEdge == "right"){
               var X = (edgeOverlap.edge == "left") ? answer[edgeOverlap.id].x : answer[edgeOverlap.id].x + answer[edgeOverlap.id].width;
               var rectX = rect.attr("x");
               var rectW = rect.attr("width");
               var letterX = rectanglesRaph[id].letter.attr("x");

               if(edgeOverlap.side == "left"){
                  /* dragged edge on the left side */
                  var newX = X - minCornerSpacing;
                  var dx = Math.abs(rectX - newX);
                  var newW = (edgeOverlap.overlappingEdge == "left") ? dx + rectW : newX - rectX;
                  if(newX > limits.xMin){
                     if(edgeOverlap.overlappingEdge == "left"){
                        rect.attr("x",newX);
                        rect.attr("width",newW);
                     }else{
                        rectanglesRaph[id].letter.attr("x",letterX - rectW + newW);
                        rect.attr("width",newW);
                     }
                  }else{
                     rect.attr("x",answer[id].x);
                     rect.attr("width",answer[id].width);
                  }
               }else{
                  /* dragged edge on the right side */
                  var newX = X + minCornerSpacing;
                  var dx = Math.abs(rectX - newX);
                  var newW = (edgeOverlap.overlappingEdge == "left") ? rectW - dx : newX - rectX;
                  if(newX < limits.xMax){
                     if(edgeOverlap.overlappingEdge == "left"){
                        rect.attr("x",newX);
                        rect.attr("width",newW);
                     }else{
                        rectanglesRaph[id].letter.attr("x",letterX - rectW + newW);
                        rect.attr("width",newW);
                     }
                  }else{
                     rect.attr("x",answer[id].x);
                     rect.attr("width",answer[id].width);
                  }
               }
            }else if(edgeOverlap.overlappingEdge == "top" || edgeOverlap.overlappingEdge == "bottom"){
               var Y = (edgeOverlap.edge == "top") ? answer[edgeOverlap.id].y : answer[edgeOverlap.id].y + answer[edgeOverlap.id].height;
               var rectY = rect.attr("y");
               var rectH = rect.attr("height");
               var letterY = rectanglesRaph[id].letter.attr("y");
               if(edgeOverlap.side == "top"){
                  /* dragged edge at the top */
                  var newY = Y - minCornerSpacing;
                  var dy = Math.abs(rectY - newY);
                  var newH = (edgeOverlap.overlappingEdge == "top") ? rectH + dy : newY - rectY;
                  if(newY > limits.yMin){
                     if(edgeOverlap.overlappingEdge == "top"){
                        rect.attr("y",newY);
                        rect.attr("height",newH);
                        rectanglesRaph[id].letter.attr("y",letterY - dy);
                     }else{
                        rect.attr("height", newH);
                     }
                  }else{
                     rect.attr("y",answer[id].y);
                     rect.attr("height",answer[id].height);
                  }
               }else{
                  /* dragged edge at the bottom */
                  var newY = Y + minCornerSpacing;
                  var dy = Math.abs(rectY - newY);
                  var newH = (edgeOverlap.overlappingEdge == "top") ? rectH - dy : newY - rectY;
                  if(newY < limits.yMax){
                     if(edgeOverlap.overlappingEdge == "top"){
                        rect.attr("y",newY);
                        rect.attr("height",newH);
                        rectanglesRaph[id].letter.attr("y",letterY + dy);
                     }else{
                        rect.attr("height",newH);
                     }
                  }else{
                     rect.attr("y",answer[id].y);
                     rect.attr("height",answer[id].height);
                  }
               }
            }
         }
         nOverlap++;
         edgeOverlap = checkEdgeOverlap(id,rect);
      }while(edgeOverlap && nOverlap < 5)
   };

   function checkEdgeOverlap(id,rect) {
      // var rect = draggedRect;
      var pos = {
            x: rect.attr("x"),
            y: rect.attr("y"),
            w: rect.attr("width"),
            h: rect.attr("height")
      };

      for(var iRect = 0; iRect < answer.length; iRect++){
         if(iRect != id){
            var x = answer[iRect].x;
            var y = answer[iRect].y;
            var w = answer[iRect].width;
            var h = answer[iRect].height;
            // REVIEW[ARNAUD]: un moyen de factoriser ça ?
            // => fait
            if(pos.y < (y + h) && (pos.y + pos.h) > y){
               for(var iEdge = 0; iEdge < 2; iEdge++){
                  var X1 = x - pos.x + iEdge*w;
                  var X2 = x - pos.x - pos.w + iEdge*w;
                  var edge = (iEdge == 0) ? "left" : "right";
                  if(Math.abs(X1) < minCornerSpacing){
                     var side = (X1 > 0) ? "left" : "right";
                     return {id:iRect,edge:edge,overlappingEdge:"left",side:side};
                  }else if(Math.abs(X2) < minCornerSpacing){
                     var side = (X2 > 0) ? "left" : "right";
                     return {id:iRect,edge:edge,overlappingEdge:"right",side:side};
                  }
               }
            }
            if(pos.x < (x + w) && (pos.x + pos.w) > x){
               for(var iEdge = 0; iEdge < 2; iEdge++){
                  var Y1 = y - pos.y + iEdge*h;
                  var Y2 = y - pos.y - pos.h + iEdge*h;
                  var edge = (iEdge == 0) ? "top" : "bottom";
                  if(Math.abs(Y1) < minCornerSpacing){
                     var side = (Y1 > 0) ? "top" : "bottom";
                     return {id:iRect,edge:edge,overlappingEdge:"top",side:side};
                  }else if(Math.abs(Y2) < minCornerSpacing){
                     var side = (Y2 > 0) ? "top" : "bottom";
                     return {id:iRect,edge:edge,overlappingEdge:"bottom",side:side};
                  }
               }
            }
         }
      }
      return null
   };

   function getDistanceBetween(x1,y1,x2,y2) {
      return Math.sqrt(Math.pow(x1 - x2,2) + Math.pow(y1 - y2,2));
   };

   function compareGraphs(target,current,targetVisual,currentVisual,noVisual) {
      var result = { successRate: 1, message: taskStrings.success };
      var targetEdgesCount = target.getEdgesCount();
      var targetEdges = target.getAllEdges();
      var currentEdges = current.getAllEdges();
      for(var iEdge = 0; iEdge < targetEdgesCount; iEdge++){
         var targetEdge = targetEdges[iEdge];
         if(!Beav.Array.has(currentEdges,targetEdge)){
            result =  { successRate: 0, message: taskStrings.errorGraph };
            if (!noVisual) {
               highlightEdge(targetEdge);
            }
            break;
         }
      }
      return result;
   };

   function highlightEdge(id) {
      var edge = targetVisualGraph.getRaphaelsFromID(id);
      edge[0].attr(highlightedEdgeAttr);
   };

   function removeHighlight() {
      var edges = targetGraph.getAllEdges();
      for(var iEdge = 0; iEdge < edges.length; iEdge++){
         var edge = edges[iEdge];
         var edgeRaph = targetVisualGraph.getRaphaelsFromID(edge);
         edgeRaph[0].attr(edgeAttr);
      }
   }

   function checkResult(noVisual) {
      var result = { successRate: 1, message: taskStrings.success };
      initGraph();
      var targetVertexVisualInfo = updateGraph(false,true);
      var currentVertexVisualInfo = updateGraph(false,false);

      result = compareGraphs(targetGraph,currentGraph,targetVertexVisualInfo,currentVertexVisualInfo,noVisual);
      
      if(!noVisual){
         if(result.successRate){
            platform.validate("done");
         }else{
            displayError(result.message);
         }
      }

      return result;
   };

   function displayError(msg) {
      $("#error").text(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();


//console.log(JSON.stringify(typeof window.ontouchstart));