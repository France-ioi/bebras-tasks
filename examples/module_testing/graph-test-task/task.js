function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         defaultVisualGraphJSON: {
            "vertexVisualInfo": {
               "v_0":{"x":250,"y":250},
               "v_1":{"x":550,"y":250} },
            "edgeVisualInfo": {
               "e_0":{} },
            "minGraph": {
               "vertexInfo": {
                  "v_0":{label:"v_0",content:"test, virgule\nTEST, VIRGULE\nAAAAAAAAAAAAA\ntest\ntest"},
                  "v_1":{label:"v_1",content:"test, virgule\ntest"} },
               "edgeInfo": {
                  "e_0":{label:"e_0"} },
               "edgeVertices": {
                  "e_0":["v_0","v_1"]},
               "directed":true 
            } 
         },
         defaultCircleAttr: {
            "r": 20, 
            "fill": "#AA0000", 
            "stroke": "black", 
            "stroke-width": 1,
            "opacity": 0.5
         }
      },
      medium: {
         defaultVisualGraphJSON: {
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
               "directed":true 
            } 
         },
         defaultCircleAttr: {
            "r": 20, 
            "fill": "#AA0000", 
            "stroke": "black", 
            "stroke-width": 1
         }
      },
      hard: {
         defaultVisualGraphJSON: {
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
               "directed":true 
            } 
         },
         defaultCircleAttr: {
            "r": 20, 
            "fill": "#AA0000", 
            "stroke": "black", 
            "stroke-width": 1
         }
      }
   };

   var defaultVisualGraphJSON;
   var defaultCircleAttr;
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
      "stroke-width": 1
   };

   var vertexLabelAttr = {
      "font-size": 16,
      "fill": "white"
   };
   var vertexContentAttr = {
      "font-size": 16,
      "fill": "white",
      "text-anchor": "start"
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      displayHelper.hideValidateButton = true;
      defaultVisualGraphJSON = data[level].defaultVisualGraphJSON;
      defaultCircleAttr = data[level].defaultCircleAttr;
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
      optionsFromJSON();
      updateJSON(false);
      // updateGridVisibility(showGrid); // remove click event on paper?
      // $("#anim").click(function() {
      //    console.log("click")
      // });
      updateInfo();

   };

   subTask.getAnswerObject = function() {
      answer.visual_json[answer.visual_json.length - 1] = $("#visual_json").val();
      answer.circleAttr = $("#circleAttr").val();
      answer.lineAttr = $("#lineAttr").val();
      answer.vertexLabelAttr = $("#vertexLabelAttr").val();
      answer.vertexContentAttr = $("#vertexContentAttr").val();
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return {
         visual_json: [JSON.stringify(defaultVisualGraphJSON)],
         circleAttr: JSON.stringify(defaultCircleAttr),
         lineAttr: JSON.stringify(defaultLineAttr),
         vertexLabelAttr: JSON.stringify(vertexLabelAttr),
         vertexContentAttr: JSON.stringify(vertexContentAttr)
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
      $("#vertexContentAttr").val(JSON.stringify(JSON.parse(answer.vertexContentAttr), null, 2));
      $("#vertexLabelAttr").val(JSON.stringify(JSON.parse(answer.vertexLabelAttr), null, 2));
   };

   var initHandlers = function() {
      $("#pretty").unbind('change');
      $("#pretty").change(updateJSON);
      $("#import").unbind('click');
      $("#import").click(fromJSON);
      $("#directed").unbind('change');
      $("#directed").change(function() {
         updateDirected(this.checked);
      });
      $("#createVertex").off("change");
      $("#createVertex").change(function(){
         // graphEditor.vertexCreator.setEnabled(this.checked);
         // graphEditor.removeVertexEnabled = this.checked;
         graphEditor.setCreateVertexEnabled(this.checked);
         updateOptionsJSON();
      });
      $("#createEdge").off("change");
      $("#createEdge").change(function(){
         // graphEditor.createEdgeEnabled = this.checked;
         // graphEditor.removeEdgeEnabled = this.checked;
         graphEditor.setCreateEdgeEnabled(this.checked);
         updateOptionsJSON();
      });
      $("#dragVertex").off("change");
      $("#dragVertex").change(function(){
         graphEditor.setVertexDragEnabled(this.checked);
         updateOptionsJSON();
      });
      $("#dragEdge").off("change");
      $("#dragEdge").change(function(){
         // graphEditor.arcDragger.setEnabled(this.checked);
         graphEditor.setEdgeDragEnabled(this.checked);
         updateOptionsJSON();
      });
      $("#multipleEdges").off("change");
      $("#multipleEdges").change(function(){
         graphEditor.setMultipleEdgesEnabled(this.checked);
         updateOptionsJSON();
      });
      $("#loop").off("change");
      $("#loop").change(function(){
         graphEditor.setLoopEnabled(this.checked);
         updateOptionsJSON();
      });
      $("#editVertexLabel").off("change");
      $("#editVertexLabel").change(function(){
         graphEditor.setEditVertexLabelEnabled(this.checked);
         updateOptionsJSON();
      });
      $("#editEdgeLabel").off("change");
      $("#editEdgeLabel").change(function(){
         graphEditor.setEditEdgeLabelEnabled(this.checked);
         updateOptionsJSON();
      });
      $("#defaultVertexLabel").off("change");
      $("#defaultVertexLabel").change(function(){
         graphEditor.setDefaultVertexLabelEnabled(this.checked);
         updateOptionsJSON();
      });
      $("#defaultEdgeLabel").off("change");
      $("#defaultEdgeLabel").change(function(){
         graphEditor.setDefaultEdgeLabelEnabled(this.checked);
         updateOptionsJSON();
      });
      $("#dragGraph").off("change");
      $("#dragGraph").change(function(){
         graphEditor.setGraphDragEnabled(this.checked);
         updateOptionsJSON();
      });
      $("#scaleGraph").off("change");
      $("#scaleGraph").change(function(){
         graphEditor.setScaleGraphEnabled(this.checked);
         updateOptionsJSON();
      });
      $("#snapToGrid").change(function() {
         snapToGrid = this.checked;
         graphEditor.setGridEnabled(snapToGrid, gridSize, gridSize);
         updateOptionsJSON();
      });
      $("#useGrid").unbind('change');
      $("#useGrid").change(function() {
         updateGridVisibility(this.checked);
         updateOptionsJSON();
      });
      $("#gridSize").unbind('change');
      $("#gridSize").change(function() {
         updateGridSize(this.value);
         updateOptionsJSON();
      });
      $("#globalTableMode").unbind('change');
      $("#globalTableMode").change(function() {
         graphEditor.setTableMode(this.checked);
         onVisualGraphChange();
         updateOptionsJSON();
      });
      $("#localTableMode").unbind('change');
      $("#localTableMode").change(function() {
         graphEditor.setLocalTableMode(this.checked);
         updateOptionsJSON();
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
      vertexLabelAttr = JSON.parse($("#vertexLabelAttr").val());
      vertexContentAttr = JSON.parse($("#vertexContentAttr").val());
      if(visualGraph) {
         graphDrawer.setCircleAttr(circleAttr);
         graphDrawer.setLineAttr(lineAttr);
         graphDrawer.setVertexContentAttr(vertexContentAttr);
         graphDrawer.setVertexLabelAttr(vertexLabelAttr);
         visualGraph.redraw();
         disableAllMouse();
         graphEditor.setEnabled(true);
      }
   };

   var updateDirected = function(directed) {
      graph.directed = directed;
      updateJSON();
      updateDirectedDisplay(directed);
   };

   var updateDirectedDisplay = function(directed) {
      if(!directed){
         var lineAttr = JSON.parse($("#lineAttr").val());
         lineAttr["arrow-end"] = "none";
         graphDrawer.setLineAttr(lineAttr);
      }else{
         var lineAttr = JSON.parse($("#lineAttr").val());
         graphDrawer.setLineAttr(lineAttr);
      }
      visualGraph.redraw();
      graphEditor.updateHandlers();
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
      
      if(snapToGrid) {
         graphEditor.setGridEnabled(true, gridSize, gridSize);
      }
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
   };

   var initPaper = function() {
      paper = subTask.raphaelFactory.create("anim", "anim", paperWidth, paperHeight);
      paper.rect(0, 0, paperWidth, paperHeight).attr("stroke-width", 2);
      dragOverlay = paper.rect(0, 0, paperWidth, paperHeight).attr({
         fill: "green",
         opacity: 0
      }).hide();
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

   var fromJSON = function() {
      if(visualGraph) {
         disableAllMouse();
         visualGraph.remove();
      }
      graphDrawer = new SimpleGraphDrawer(circleAttr, lineAttr, null, true);
      graphDrawer.setVertexLabelAttr(vertexLabelAttr);
      graphDrawer.setVertexContentAttr(vertexContentAttr);
      visualGraph = VisualGraph.fromJSON($("#visual_json").val(), "visual", paper, null, graphDrawer, true);
      graph = visualGraph.graph;
      graphMouse = new GraphMouse("mouse", graph, visualGraph);
      $("#directed").prop('checked', graph.directed);
      initVisuals();
      updateDirectedDisplay(graph.directed);
   };

   var initVisuals = function() {
      var settings = {
         // id: "graphEditor",
         paper: paper,
         graph: graph,
         paperElementID: "anim",
         visualGraph: visualGraph,
         graphMouse: graphMouse,
         dragThreshold: 10,
         edgeThreshold: 20,
         dragLimits: {
            minX: circleAttr.r,
            maxX: paperWidth - circleAttr.r,
            minY: circleAttr.r,
            maxY: paperHeight - circleAttr.r
         },
         vertexLabelAttr: vertexLabelAttr,
         onDragEnd: onVisualGraphChange,
         callback: onVisualGraphChange,
         enabled: true
      };
      graphEditor = new GraphEditor(settings);
   };

   var updateJSON = function(updateAnswer) {
      updateOptionsJSON();
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

   var updateOptionsJSON = function() {
      var optionsJSON = optionsToJSON();
      if($("#pretty").is(":checked")) {
         optionsJSON = JSON.stringify(JSON.parse(optionsJSON), null, 2);
      }
      $("#options_json").val(optionsJSON);
   };


   function optionsToJSON() {
      var obj = {
         createVertex:$("#createVertex").is(":checked"),
         createEdge:$("#createEdge").is(":checked"),
         dragVertex:$("#dragVertex").is(":checked"),
         dragEdge:$("#dragEdge").is(":checked"),
         dragGraph:$("#dragGraph").is(":checked"),
         scaleGraph:$("#scaleGraph").is(":checked"),
         multipleEdges:$("#multipleEdges").is(":checked"),
         loop:$("#loop").is(":checked"),
         editVertexLabel:$("#editVertexLabel").is(":checked"),
         editEdgeLabel:$("#editEdgeLabel").is(":checked"),
         snapToGrid:$("#snapToGrid").is(":checked"),
         useGrid:$("#useGrid").is(":checked"),
         gridSize:$("#gridSize").val(),
         globalTableMode: $("#globalTableMode").is(":checked"),
         localTableMode: $("#localTableMode").is(":checked"),
         defaultVertexLabel: $("#defaultVertexLabel").is(":checked"),
         defaultEdgeLabel: $("#defaultEdgeLabel").is(":checked")
      };
      return JSON.stringify(obj);
   };

   function optionsFromJSON() {
      var text = $("#options_json").val();
      if(!text){
         return
      }
      var optionsJSON = JSON.parse(text);
      for(var option in optionsJSON){
         var checked = optionsJSON[option];
         switch(option){
            case "createVertex":
               graphEditor.setCreateVertexEnabled(checked);
               break;
            case "createEdge":
               graphEditor.setCreateEdgeEnabled(checked);
               break;
            case "dragVertex":
               graphEditor.setVertexDragEnabled(checked);
               break;
            case "dragEdge":
               graphEditor.setEdgeDragEnabled(checked);
               break;
            case "dragGraph":
               graphEditor.setGraphDragEnabled(checked);
               break;
            case "scaleGraph":
               graphEditor.setScaleGraphEnabled(checked);
               break;
            case "multipleEdges":
               graphEditor.setMultipleEdgesEnabled(checked);
               break;
            case "loop":
               graphEditor.setLoopEnabled(checked);
               break;
            case "editVertexLabel":
               graphEditor.setEditVertexLabelEnabled(checked);
               break;
            case "editEdgeLabel":
               graphEditor.setEditEdgeLabelEnabled(checked);
               break;
            case "snapToGrid":
               snapToGrid = checked;
               graphEditor.setGridEnabled(snapToGrid, gridSize, gridSize);
               break;
            case "useGrid":
               updateGridVisibility(checked);
               break;
            case "gridSize":
               var val = checked;
               updateGridSize(val);
               break;
            case "globalTableMode":
               graphEditor.setTableMode(checked);
               break;
            case "localTableMode":
               graphEditor.setLocalTableMode(checked);
               break;
            case "defaultVertexLabel":
               graphEditor.setDefaultVertexLabelEnabled(checked);
               break;
            case "defaultEdgeLabel":
               graphEditor.setDefaultEdgeLabelEnabled(checked);
         }
      }
   };

   subTask.getGrade = function(callback) {
      callback({
         successRate: 1
      });
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
