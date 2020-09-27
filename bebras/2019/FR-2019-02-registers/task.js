function initTask(subTask) {
   var rtl = false;
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         paperHeight: 340,
         paperWidth: 584,
         graph: {
            "vertexInfo": {
               "00": {}, "01": {}, "02": {}, "03": {}, "04": {}, "05": {}, "06": {} },
            "edgeInfo": {
               "e_0": {}, "e_1": {}, "e_2": {}, "e_3": {}, "e_4": {}, "e_5": {} },
            "edgeVertices": {
               "e_0": ["01","00"], "e_1": ["02","00"], "e_2": ["03","01"], "e_3": ["04","01"],"e_4": ["05","02"],"e_5": ["06","02"] },
            "directed": true
         },
         vertexVisualInfo: {
            "00": { "x": 293, "y": 48 },
            "01": { "x": 196, "y": 147 },
            "02": { "x": 386, "y": 146 },
            "03": { "x": 148, "y": 240 },
            "04": { "x": 246, "y": 241 },
            "05": { "x": 341, "y": 240 },
            "06": { "x": 436, "y": 239 }
         },
         max: 4
      },
      medium: {
         paperHeight: 435,
         paperWidth: 646,
         graph: {
            "vertexInfo": {
               "00": {}, "01": {}, "02": {}, "03": {}, "04": {},
               "05": {}, "06": {}, "07": {}, "08": {}, "09": {},
               "10": {}, "11": {}, "12": {}, "13": {}, "14": {},
               "15": {}, "16": {}, "17": {}
            },
            "edgeInfo": {
               "e_0": {}, "e_1": {}, "e_2": {}, "e_3": {}, "e_4": {},
               "e_5": {}, "e_6": {}, "e_7": {}, "e_8": {}, "e_9": {},
               "e_10": {}, "e_11": {}, "e_13": {}, "e_14": {}, "e_15": {},
               "e_16": {}, "e_17": {}
            },
            "edgeVertices": {
               "e_0": [ "01", "00" ],
               "e_1": [ "02", "00" ],
               "e_2": [ "16", "06" ],
               "e_3": [ "08", "02" ],
               "e_4": [ "10", "08"],
               "e_5": [ "03", "00" ],
               "e_6": [ "04", "01" ],
               "e_7": [ "05", "02" ],
               "e_8": [ "06", "02" ],
               "e_9": [ "07", "03" ],
               "e_10": [ "17", "04" ],
               "e_11": [ "09", "04" ],
               "e_13": [ "11", "05" ],
               "e_14": [ "12", "05" ],
               "e_15": [ "13", "06" ],
               "e_16": [ "14", "06" ],
               "e_17": [ "15", "07" ]
            },
            "directed": true
         },
         vertexVisualInfo: {
            "00": { "x": 321, "y": 54  },

            "01": { "x": 190, "y": 152 },
            "02": { "x": 320, "y": 152 },
            "03": { "x": 449, "y": 152 },

            "04": { "x": 58, "y": 248 },
            "05": { "x": 186, "y": 248 },
            "06": { "x": 442, "y": 248 },
            "07": { "x": 513, "y": 248 },
            "08": { "x": 314, "y": 248 },

            "09": { "x": 90, "y": 344},
            "10": { "x": 314, "y": 344 },
            "11": { "x": 154, "y": 344 },
            "12": { "x": 218, "y": 344 },
            "13": { "x": 381, "y": 344 },
            "14": { "x": 455, "y": 344 },
            "15": { "x": 573, "y": 344 },
            "16": { "x": 509, "y": 344 },
            "17": { "x": 26, "y": 344 },

         },
         max: 4
      },
      hard: {
         paperHeight: 430,
         paperWidth: 760,
         graph: {
            "vertexInfo": {
               "00":{val:1},"01":{val:1},"02":{val:2},"03":{val:1},"04":{val:1},"05":{val:1},"06":{val:1},"07":{val:1},"08":{val:1},"09":{val:1},"10":{val:1},
               "11":{val:5},"12":{val:1},"13":{val:1},"14":{val:1},"15":{val:2},"16":{val:2},"17":{val:2},"18":{val:1},"19":{val:4},"20":{val:4},
               "21":{val:3},"22":{val:1},"23":{val:1},"24":{val:1},"25":{val:5},"26":{val:2},"27":{val:1},"28":{val:1} },
            "edgeInfo": {
               "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},
               "e_11":{},"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_18":{},"e_19":{},"e_20":{},
               "e_21":{},"e_22":{},"e_23":{},"e_25":{},"e_26":{},"e_27":{},"e_28":{} },
            "edgeVertices": {
               "e_0":["01","00"],"e_1":["02","00"],"e_2":["03","00"],"e_3":["04","00"],"e_4":["05","00"],"e_5":["06","00"],"e_6":["07","01"],
               "e_7":["08","02"],"e_8":["09","02"],"e_9":["10","03"],"e_10":["11","04"],"e_11":["12","05"],"e_12":["13","05"],"e_13":["14","05"],
               "e_14":["15","06"],"e_15":["16","06"],"e_16":["17","06"],"e_17":["18","07"],"e_18":["19","08"],"e_19":["20","09"],"e_20":["21","09"],
               "e_21":["22","10"],"e_22":["23","10"],"e_23":["24","11"],"e_25":["26","17"],"e_26":["27","17"],"e_27":["25","16"],"e_28":["28","18"] },
            "directed": true
         },
         vertexVisualInfo: {
            "00":{"x":352,"y":39},
            "01":{"x":38,"y":114},
            "02":{"x":147,"y":114},
            "03":{"x":302,"y":114},
            "04":{"x":387,"y":114},
            "05":{"x":498,"y":114},
            "06":{"x":663,"y":114},
            "07":{"x":38,"y":190},
            "08":{"x":99,"y":190},
            "09":{"x":188,"y":190},
            "10":{"x":301,"y":190},
            "11":{"x":388,"y":190},
            "12":{"x":450,"y":190},
            "13":{"x":498,"y":190},
            "14":{"x":549,"y":190},
            "15":{"x":612,"y":190},
            "16":{"x":663,"y":190},
            "17":{"x":712,"y":190},
            "18":{"x":38,"y":264},
            "19":{"x":99,"y":264},
            "20":{"x":162,"y":264},
            "21":{"x":213,"y":264},
            "22":{"x":275,"y":264},
            "23":{"x":325,"y":264},
            "24":{"x":388,"y":264},
            "25":{"x":610,"y":264},
            "26":{"x":665,"y":264},
            "27":{"x":714,"y":264},
            "28":{"x":38,"y":339}
         },
         max: 8
      },
   };
   var paper;
   var paperWidth;
   var paperHeight;
   var margin = 10;

   var text;
   var graph;
   var vGraph;
   var graphMouse;
   var vertexToggler;
   var undoButton;

   var vertexAttr = {
      r: 20,
      fill: "white",
      stroke: "black",
      "stroke-width": 1
   };
   var vertexAttrDisabled = {
      fill: "lightgrey"
   }
   var vertexAttrFilled = {
      fill: "#FFF080"
   }
   var pebbleRinNumber = vertexAttr.r/5;
   var pebbleRinCircle = vertexAttr.r - 6
   var pebbleRinReserve = pebbleRinCircle;

   var reserveX = 300;
   var reserveY;

   var markerAttr = {
      r: 20,
      fill: "none",
      stroke: "none",
      /*
      fill: "#6060FF",
      stroke: "#3333ff",*/
      "stroke-width": 4
   };
   var highlightedVertexAttr = {
      r: 20,
      fill: "none",
      stroke: "red",
      "stroke-width": 4
   };
   var edgeAttr = {
      "stroke-width": 2,
      "arrow-end": "classic-long-wide"
   };
   var textAttr = {
      "font-size": 18
   };
   var buttonAttr = {
      "font-size": 16
   };
   var valueAttr = {
      "font-size": 20,
      "font-weight": "bold"
   };
   var markerValueAttr = {
      "font-size": 20,
      "font-weight": "bold"
   };
   var pebbleAttr = {
      fill: "#853b3b"
   };
   var undoButtonAttr = {
      fill: "lightgrey",
   };
   // REVIEW[ARNAUD]:QUESTION: peux-tu me confirmer qu'on pourrait factoriser le code en considérant que dans easy/medium le "info.val" de chaque cercle vaut "1",
   // et ainsi on peut utiliser "sum" à la place de "nbMarkers" partout. (et renommer "sum" en "sumMarkers" au passage pour la clareté).
   // var nMarkers = 0;
   // var sum = 0;
   //
   // => fait
   var sumMarkers = 0;
   var markers = {};
   var highlights = [];
   var reserve = [];
   var max;

   subTask.loadLevel = function (curLevel) {
      if (typeof(enableRtl) != "undefined") {
         rtl = enableRtl;
      }
      level = curLevel;
      paperHeight = data[level].paperHeight;
      paperWidth = data[level].paperWidth;
      reserveY = paperHeight - margin - pebbleRinReserve - 20; // TODO: variable name for 20
      max = data[level].max;
      graph = Graph.fromJSON(JSON.stringify(data[level].graph));
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function () {
      $(".max").text(max);
      displayError("");
      initPaper();
      initGraph();
      initReserve();
      updateUndo();
      reloadAnswerDisplay();
      updateGraph();
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
      var defaultAnswer = [];
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = replayAnswer();      
      return result;
   }

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      $("#paper").css("width", paperWidth);
      if(paper){
         paper.remove();
         subTask.raphaelFactory.remove("paper");
      }
      paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);

   };

   function initGraph() {
      var graphDrawer = new SimpleGraphDrawer(vertexAttr,edgeAttr);
      graphDrawer.setDrawVertex(vertexDrawer);
      vGraph = new VisualGraph("vGraph", paper, graph, graphDrawer, true, data[level].vertexVisualInfo);

      graphMouse = new GraphMouse("graphMouse", graph, vGraph);
      vertexToggler = new VertexToggler("vTog", graph, vGraph, graphMouse, vertexToggle, true);
   };

   function initReserve() {
      var labelX = reserveX;
      if (rtl) {
         labelX = paperWidth-200;
      }
      paper.text(labelX,reserveY,taskStrings.reserve).attr(textAttr).attr({"text-anchor": "end"});
      updateReserve();
   };

   function updateUndo() {
      if(answer.length > 0){
         $("#undo").off("click");
         $("#undo").click(undo);  
         $("#undo").css({
            cursor: "pointer",
            opacity: 1
         })   
      }else{
         $("#undo").off("click");
         $("#undo").css({
            cursor: "auto",
            opacity: 0.5
         });
      }
   };

   function vertexDrawer(id,info,vInfo) {
      var pos = this._getVertexPosition(vInfo);
      this.originalPositions[id] = pos;
      var vertex = paper.circle(pos.x,pos.y).attr(vertexAttr);
      if(level === "hard"){
         var value = paper.text(pos.x,pos.y,info.val).attr(valueAttr);
         return [vertex,value];
      }
      return [vertex];
   };

   function vertexToggle(id,selected) {
      if((id != "00" || !selected) && answer.length > 0 && Beav.Array.has(answer[answer.length - 1],"00")){
         var info = graph.getVertexInfo(id);
         info.selected = !selected;
         displayError(taskStrings.validateNow);
         return
      }
      displayError("");
      removeHighlights();
      if(selected){
         var info = graph.getVertexInfo(id);
         var verticesBelow = getVerticesBelow(id,graph);
         var nBelow = verticesBelow.length;
         if(nBelow > 0){ // REVIEW[ARNAUD]: this test is unnecessary, right?
            for(var iVert = 0; iVert < nBelow; iVert++){
               var vInfo = graph.getVertexInfo(verticesBelow[iVert]);
               if(!vInfo.selected){
                  graph.setVertexInfo(id,{val:info.val,selected:false});
                  displayError(taskStrings.noMarkerBelow);
                  highlightWrongVertex([id]);
                  break;
               }
            }
         }
      }
      placeMarker(id);
      if(sumMarkers > max){
         var vInfo = graph.getVertexInfo(id);
         graph.setVertexInfo(id,{val:vInfo.val,selected:false});
         placeMarker(id);
         var message = (level === "hard") ? taskStrings.sumGreaterThan(max) : taskStrings.tooManyMarkers(max);
         displayError(message);
         highlightWrongVertex([id]);
      }else{
         saveAnswer();
         updateGraph();
         updateReserve();
      }

   };

   function getVerticesBelow(id,graph) {
      var verticesBelow = [];
      // REVIEW[ARNAUD]: n'as-t-on pas dans la lib une fonction
      // qui permet directement de récupérer les voisins entrants sans avoir besoin
      // de les filtrer à la main ? il faudrait noter ça en feature wish dans ce cas.
      //
      // => non, uniquement les voisins sortants
      var neighbors = graph.getNeighbors(id);
      for(var iNeighbor = 0; iNeighbor < neighbors.length; iNeighbor++){
         if(id < neighbors[iNeighbor]){
            verticesBelow.push(neighbors[iNeighbor])
         }
      }
      return verticesBelow;
   };

   /**
   *  place or remove a marker depending on the selected state of the vertex
   **/
   function placeMarker(id) {
      var info = graph.getVertexInfo(id);
      if(info.selected){
         var vertexPos = vGraph.getVertexVisualInfo(id);
         if(level === "hard"){
            var value = paper.text(vertexPos.x,vertexPos.y,info.val).attr(markerValueAttr);
            var pebbles = paper.set();
            for(var iPebble = 0; iPebble < info.val; iPebble++){
               var x = vertexPos.x;
               var y = vertexPos.y - vertexAttr.r + pebbleRinNumber + 2;
               var pebble = getShape(paper,"hexagon",x,y,pebbleRinNumber).attr(pebbleAttr);
               var angle = iPebble * 360/info.val;
               // pebble.rotate(angle,vertexPos.x,vertexPos.y);
               pebble.transform("r"+angle+" "+vertexPos.x+" "+vertexPos.y);
               pebbles.push(pebble);
            }
            markers[id] = paper.set(value,pebbles);
         }else{
            var pebble = getShape(paper,"hexagon",vertexPos.x,vertexPos.y,pebbleRinCircle);
            pebble.attr(pebbleAttr);
            markers[id] = paper.set(pebble);
         }
         markers[id].click(function(){
            var vInfo = graph.getVertexInfo(id);
            graph.setVertexInfo(id,{val:vInfo.val,selected:false});
            vertexToggle(id,false);
         });
         if(level === "hard"){
            sumMarkers += info.val;
         }else{
            sumMarkers++;
         }

      }else if(markers[id]){
         markers[id].remove();
         delete markers[id];
         if(level === "hard"){
            sumMarkers -= info.val;
         }else{
            sumMarkers--;
         }
      }
   };

   function updateGraph() {
      graph.forEachVertex(updateVertex);
   };

   function updateVertex(id,info) {
      var parents = getVerticesBelow(id,graph);
      var disabled = false;
      if(!info.selected && parents.length > 0){
         for(var iParent = 0; iParent < parents.length; iParent++){
            var parent = parents[iParent];
            var parentInfo = graph.getVertexInfo(parent);
            if(!parentInfo.selected){
               disabled = true;
            }
         }
      }
      var vertex = vGraph.getRaphaelsFromID(id)[0];
      if(disabled){
         vertex.attr(vertexAttrDisabled);
      } else if (level == "hard" && info.selected) {
         vertex.attr(vertexAttrFilled);
      } else {
         vertex.attr(vertexAttr);
      }
   };

   function updateReserve() {
      clearReserve();
      var nPebbles = max - sumMarkers;
      for(var iPeb = 0; iPeb < nPebbles; iPeb++){
         var x = reserveX + 3*margin + iPeb * (margin + 2*pebbleRinReserve);
         if (rtl) {
            x -= reserveX;
         }
         var y = reserveY;
         var pebble = getShape(paper,"hexagon",x,y,pebbleRinReserve);
         pebble.unclick();
         pebble.click(function(){displayError(taskStrings.pebbleClick)});
         pebble.attr(pebbleAttr);
         reserve.push(pebble);
      }
      if (nPebbles == 0) {
         var msg1 = paper.text(reserveX+margin,reserveY,taskStrings.empty).attr(textAttr).attr({"text-anchor": "start"});
         var msg2= paper.text(reserveX+margin,reserveY+27,taskStrings.takeBack).attr(textAttr);
         reserve.push(msg1,msg2);
      }
   };

   function clearReserve() {
      for(var iPeb = 0; iPeb < reserve.length; iPeb++){
         var peb = reserve[iPeb];
         if(peb){
            peb.remove();
         }
      }
   };

   function highlightWrongVertex(vertices) {
      for(var iVert = 0; iVert < vertices.length; iVert++){
         if(!graph.getVertexInfo(vertices[iVert]).selected){
            var vInfo = vGraph.getVertexVisualInfo(vertices[iVert]);
            highlights.push(paper.circle(vInfo.x,vInfo.y).attr(highlightedVertexAttr));
         }
      }
   };

   function removeHighlights() {
      for(var i = 0; i < highlights.length; i++){
         highlights[i].remove();
      }
   };

   function saveAnswer() {
      var selectedVertices = [];
      var vertices = graph.getAllVertices();
      for(var iVertex = 0; iVertex < vertices.length; iVertex++){
         var vertex = vertices[iVertex];
         var info = graph.getVertexInfo(vertex);
         if(info.selected){
            selectedVertices.push(vertex);
         }
      }
      answer.push(selectedVertices);
      updateUndo();
   };

   function reloadAnswerDisplay() {
      if(answer.length > 0){
         var selectedVertices = answer[answer.length - 1];
         for(var iVert = 0; iVert < selectedVertices.length; iVert++){
            var id = selectedVertices[iVert];
            var info = graph.getVertexInfo(id);
            info.selected = true;
            placeMarker(id);
         }
         updateReserve();
      }
   };

   function undo() {
      sumMarkers = 0;
      answer.pop();
      subTask.resetDisplay();
   };

   function displayError(msg) {
      $("#error").text(msg);
   };

   function replayAnswer() {
      while(answer.length > 1){
         var prevSelected = answer.shift();
         var currSelected = answer[0];
         var prevGraph = Graph.fromJSON(JSON.stringify(data[level].graph));
         var currGraph = Graph.fromJSON(JSON.stringify(data[level].graph));

         for(var iVertex = 0; iVertex < prevSelected.length; iVertex++){
            var id = prevSelected[iVertex];
            prevGraph.setVertexInfo(id,{selected:true});
         }

         for(var iVertex = 0; iVertex < currSelected.length; iVertex++){
            var id = currSelected[iVertex];
            currGraph.setVertexInfo(id,{selected:true});
         }
         
         var vertices = currGraph.getAllVertices();
         var nbSelected = 0;

         for(var iVertex = 0; iVertex < vertices.length; iVertex++){
            var vertex = vertices[iVertex];
            var currInfo = currGraph.getVertexInfo(vertex);
            var prevInfo = prevGraph.getVertexInfo(vertex);
            if(currInfo.selected != prevInfo.selected){
               if(currInfo.selected){
                  /* new vertex selection */
                  var verticesBelow = getVerticesBelow(vertex,currGraph);
                  for(var jVertex = 0; jVertex < verticesBelow.length; jVertex++){
                     var vertexBelow = verticesBelow[jVertex];
                     if(!prevGraph.getVertexInfo(vertexBelow).selected){
                        return { successRate: 0, message: taskStrings.noMarkerBelow };
                     }
                  }
                  if(nbSelected < max){
                     nbSelected++;
                  }else{
                     return { successRate: 0, message: taskStrings.empty };
                  }
                  if(vertex == "00"){
                     return { successRate: 1, message: taskStrings.success };
                  }
               }else{
                  /* vertex deselected */
                  nbSelected--;
               }

            }
         }
      };
      return { successRate:0, message: taskStrings.failure };
   };

}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
