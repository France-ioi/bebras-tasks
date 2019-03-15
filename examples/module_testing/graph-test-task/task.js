function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;

   var defaultVisualGraphJSON = {
      "vertexVisualInfo": {
         "v_0":{"x":64,"y":92},
         "v_1":{"x":169,"y":100},
         "v_2":{"x":212,"y":197},
         "v_3":{"x":113,"y":290} },
      "edgeVisualInfo": {
         "e_0":{},
         "e_1":{},
         "e_2":{},
         "e_3":{} },
      "minGraph": {
         "vertexInfo": {
            "v_0":{label:"v_0"},
            "v_1":{label:"v_1"},
            "v_2":{label:"v_2"},
            "v_3":{label:"v_3"} },
         "edgeInfo": {
            "e_0":{label:"e_0"},
            "e_1":{label:"e_1"},
            "e_2":{label:"e_2"},
            "e_3":{label:"e_3"} },
         "edgeVertices": {
            "e_0":["v_0","v_3"],
            "e_1":["v_3","v_2"],
            "e_2":["v_2","v_1"],
            "e_3":["v_2","v_0"]},
         "directed":true } 
      };
   var defaultCircleAttr = {
      "r": 20, 
      "fill": "#AA0000", 
      "stroke": "black", 
      "stroke-width": 1
   };
   var defaultLineAttr = {
      "stroke": "black",
      "stroke-width": 4, 
      "arrow-end": "long-classic-wide" 
   };

   var paperWidth = 750;
   var paperHeight = 500;

   var paper;
   var graph;
   var visualGraph;
   var graphMouse;
   var graphDrawer;
   var graphEditor;
   var snapToGrid;
   var dragOverlay;
   var dragInitialPositions;
   var dragInitialMouse;
   var keepProportions;

   var mode = "graphEditor";
   var showGrid = true;
   var gridSize = 32;
   var grid;

   var vertexGuid = 0;
   var edgeGuid = 0;

   var circleAttr;
   var lineAttr;

   var selectedCircleAttr = {
      stroke: "blue",
      "stroke-width": 6
   };

   var gridLineAttr = {
      stroke: "black",
      opacity: 0.5,
      "strok-width": 1
   };

   var vertexTextAttr = {
      "font-size": 16,
      "fill": "white"
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      displayHelper.hideValidateButton = true;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initJSON();
      initPaper();
      initHandlers();
      applyAttr();
      fromJSON();
      updateJSON(false);
      changeMode(mode);
      updateGridVisibility(showGrid);
      updateInfo();
   };

   subTask.getAnswerObject = function() {
      answer.visual_json[answer.visual_json.length - 1] = $("#visual_json").val();
      answer.circleAttr = $("#circleAttr").val();
      answer.lineAttr = $("#lineAttr").val();
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return {
         visual_json: [JSON.stringify(defaultVisualGraphJSON)],
         circleAttr: JSON.stringify(defaultCircleAttr),
         lineAttr: JSON.stringify(defaultLineAttr)
      };
   };

   subTask.unloadLevel = function(callback) {
      if(visualGraph) {
         disableAllMouse();
      }
      callback();
   };

   var initJSON = function() {
      $("#visual_json").val(answer.visual_json[answer.visual_json.length - 1]);
      $("#circleAttr").val(JSON.stringify(JSON.parse(answer.circleAttr), null, 2));
      $("#lineAttr").val(JSON.stringify(JSON.parse(answer.lineAttr), null, 2));
   };

   var initHandlers = function() {
      $('input[type=radio][name=mode]').unbind('change');
      $('input[type=radio][name=mode]').change(function() {
         changeMode(this.id);
      });
      $("#pretty").unbind('change');
      $("#pretty").change(updateJSON);
      $("#import").unbind('click');
      $("#import").click(fromJSON);
      $("#directed").unbind('change');
      $("#directed").change(function() {
         updateDirected(this.checked);
      });
      $("#snapToGrid").change(function() {
         snapToGrid = this.checked;
         if(mode === "graphEditor") {
            // graphEditor.vertexDragger.setGridEnabled(snapToGrid, gridSize, gridSize);
         }
      });
      $("#keepProportions").change(function() {
         keepProportions = this.checked;
      });
      $("#useGrid").unbind('change');
      $("#useGrid").change(function() {
         updateGridVisibility(this.checked);
      });
      $("#gridSize").unbind('change');
      $("#gridSize").change(function() {
         updateGridSize(this.value);
      });
      $("#apply_attr").unbind('click');
      $("#apply_attr").click(applyAttr);
      $("#undo").unbind('click');
      $("#undo").click(clickUndo);
      $("#undo").attr("disabled", answer.visual_json.length == 1);
   };

   var clickUndo = function() {
      if(answer.visual_json.length == 1) {
         return;
      }
      answer.visual_json.pop();
      $("#visual_json").val(answer.visual_json[answer.visual_json.length - 1]);
      fromJSON();
      if(answer.visual_json.length == 1) {
         $("#undo").attr("disabled", true);
      }
   };

   var applyAttr = function() {
      circleAttr = JSON.parse($("#circleAttr").val());
      lineAttr = JSON.parse($("#lineAttr").val());
      if(visualGraph) {
         graphDrawer.setCircleAttr(circleAttr);
         graphDrawer.setLineAttr(lineAttr);
         visualGraph.redraw();
         changeMode(mode);
      }
   };

   var changeMode = function(newMode) {
      mode = newMode;
      disableAllMouse();
      if(mode == 'graphEditor') {
         graphEditor.setEnabled(true);
      }
      else if(mode == 'dragGraph') {
         enableGraphDrag();
      }
      else if(mode == 'scaleGraph') {
         enableScaleDrag();
      }
   };

   var updateDirected = function(directed) {
      graph.directed = directed;
      updateJSON();
   };

   var updateGridVisibility = function(show) {
      showGrid = show;
      removeGrid();
      if(showGrid) {
         drawGrid();
      }
   };

   var updateGridSize = function(size) {
      size = parseInt(size);
      if (isNaN(size) || size <= 0) {
        return;
      }
      gridSize = size;
      updateGridVisibility(showGrid);
      
      // if(mode === "dragVertex" && snapToGrid) {
      //    vertexDragger.setGridEnabled(true, gridSize, gridSize);
      // }
      // TODO: keep track of the value in JSON?
   };

   var removeGrid = function() {
      if(grid) {
         grid.remove();
         grid = null;
      }
   };

   var drawGrid = function() {
      removeGrid();
      if(!showGrid) {
         return;
      }

      var rows = Math.ceil(paperHeight / gridSize);
      var cols = Math.ceil(paperWidth / gridSize);

      grid = new Grid("anim", paper, rows, cols, gridSize, gridSize, 0, 0, gridLineAttr);
      grid.linesToBack();
   };

   var disableAllMouse = function() {
      if(!graphEditor){
         return;
      }
      graphEditor.setEnabled(false);
      disableOverlayDrag();
   };

   var initPaper = function() {
      paper = subTask.raphaelFactory.create("anim", "anim", paperWidth, paperHeight);
      paper.rect(0, 0, paperWidth, paperHeight).attr("stroke-width", 2);
      dragOverlay = paper.rect(0, 0, paperWidth, paperHeight).attr({
         fill: "green",
         opacity: 0
      }).hide();
   };

   var enableGraphDrag = function() {
      dragOverlay.drag(onGraphDragMove, onOverlayDragStart, onOverlayDragEnd);
      dragOverlay.toFront().show();
   };

   var enableScaleDrag = function() {
      dragOverlay.drag(onScaleDragMove, onOverlayDragStart, onOverlayDragEnd);
      dragOverlay.toFront().show();
   };

   var disableOverlayDrag = function() {
      dragOverlay.undrag();
      dragOverlay.hide();
   };

   var onOverlayDragStart = function(x, y, event) {
      dragInitialMouse = {
         x: event.offsetX,
         y: event.offsetY
      };
      dragInitialPositions = $.map(graph.getAllVertices(), function(id) {
         return {
            id: id,
            position: graphDrawer.getVertexPosition(id)
         };
      });
   };

   var onGraphDragMove = function(dx, dy) {
      if(snapToGrid) {
         dx -= (dx % gridSize);
         dy -= (dy % gridSize);
      }
      $.each(dragInitialPositions, function(index, element) {
         graphDrawer.moveVertex(element.id, element.position.x + dx, element.position.y + dy);
      });
   };

   var onScaleDragMove = function(dx, dy) {
      var endX = dragInitialMouse.x + dx;
      var endY = dragInitialMouse.y + dy;
      var ratioX = endX / dragInitialMouse.x;
      var ratioY = endY / dragInitialMouse.y;
      if(keepProportions) {
         ratioY = ratioX;
      }
      $.each(dragInitialPositions, function(index, element) {
         graphDrawer.moveVertex(element.id, element.position.x * ratioX, element.position.y * ratioY);
      });
   };

   var onOverlayDragEnd = function() {
      onVisualGraphChange();
   };

   var onVisualGraphChange = function() {
      updateJSON(true);
      updateInfo();
   };

   var updateInfo = function() {
      var size = getVisualSize();
      var html = "Size: " + size.width + " x " + size.height + "<br>";
      var margins = getVisualMargins();
      html += "With symmetric margins: " + (size.width + margins.x) + " x " + (size.height + margins.y);
      $("#info").html(html);
   };

   var getVisualSize = function() {
      var maxX = 0;
      var maxY = 0;
      graph.forEachVertex(function (id) {
         var position = graphDrawer.getVertexPosition(id);
         maxX = Math.max(maxX, position.x + circleAttr.r);
         maxY = Math.max(maxY, position.y + circleAttr.r);
      });
      return {
         width: Math.ceil(maxX),
         height: Math.ceil(maxY)
      };
   };

   var getVisualMargins = function() {
      var minX = paperWidth;
      var minY = paperHeight;
      graph.forEachVertex(function (id) {
         var position = graphDrawer.getVertexPosition(id);
         minX = Math.min(minX, position.x - circleAttr.r);
         minY = Math.min(minY, position.y - circleAttr.r);
      });
      return {
         x: Math.floor(minX),
         y: Math.floor(minY)
      };
   };

   var vertexSelector = function(id, selected) {
      var attr;
      if(selected) {
         attr = selectedCircleAttr;
      }else{
         attr = circleAttr;
      }
      visualGraph.getRaphaelsFromID(id)[0].attr(attr);
   };

   var createEdge = function(id1, id2) {
      while(graph.isEdge("e_" + edgeGuid)) {
         edgeGuid++;
      }
      var edgeID = "e_" + edgeGuid;
      graph.addEdge(edgeID, id1, id2,{label:edgeID});
      onVisualGraphChange();
   };

   var createVertex = function(x, y) {
      while(graph.isVertex("v_" + vertexGuid)) {
         vertexGuid++;
      }
      var vertexId = "v_" + vertexGuid;
      var point = {x: x, y: y};
      visualGraph.setVertexVisualInfo(vertexId, point);
      graph.addVertex(vertexId,{label:vertexId});
      onVisualGraphChange();
      return vertexId;
   };

   var fromJSON = function() {
      if(visualGraph) {
         disableAllMouse();
         visualGraph.remove();
      }
      graphDrawer = new SimpleGraphDrawer(circleAttr, lineAttr, null, true);
      graphDrawer.setVertexLabelAttr(vertexTextAttr);
      visualGraph = VisualGraph.fromJSON($("#visual_json").val(), "visual", paper, null, graphDrawer, true);
      graph = visualGraph.graph;
      graphMouse = new GraphMouse("mouse", graph, visualGraph);
      $("#directed").prop('checked', graph.directed);
      initVisuals();
      // changeMode(mode);
   };

   var initVisuals = function() {
      var settings = {
         id: "graphEditor",
         paper: paper,
         graph: graph,
         paperElementID: "anim",
         visualGraph: visualGraph,
         graphMouse: graphMouse,
         dragThreshold: circleAttr.r,
         edgeThreshold: 10,
         vertexLabelAttr: vertexTextAttr,
         onPairSelect: createEdge,
         createVertex: createVertex,
         onDragEnd: onVisualGraphChange,
         callback: onVisualGraphChange,
         enabled: true
      };
      graphEditor = new GraphEditor(settings);
   };

   var updateJSON = function(updateAnswer) {
      var visualJSON = visualGraph.toJSON();
      if($("#pretty").is(":checked")) {
         visualJSON = JSON.stringify(JSON.parse(visualJSON), null, 2);
      }
      $("#visual_json").val(visualJSON);
      if(updateAnswer) {
         answer.visual_json.push(visualJSON);
         $("#undo").attr("disabled", false);
      }
   };

   subTask.getGrade = function(callback) {
      callback({
         successRate: 1
      });
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
