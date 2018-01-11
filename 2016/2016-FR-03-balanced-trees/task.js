function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         width: 500,
         height: 320,
         visualGraph: '{"vertexVisualInfo":{"v_0":{"x":293,"y":24},"v_1":{"x":117,"y":99},"v_2":{"x":141,"y":257},"v_3":{"x":235,"y":174},"v_4":{"x":322,"y":295},"v_5":{"x":342,"y":161},"v_6":{"x":442,"y":263}},"edgeVisualInfo":{"e_0":{}},"minGraph":{"vertexInfo":{"v_0":{"root":true},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"v_6":{}},"edgeInfo":{"e_0":{"permanent":true}},"edgeVertices":{},"directed":true}}',
         maxEdges: 6
      },
      medium: {
         width: 500,
         height: 290,
         visualGraph: '{"vertexVisualInfo":{"v_0":{"x":248,"y":30},"v_1":{"x":111,"y":103},"v_2":{"x":64,"y":226},"v_3":{"x":194,"y":265},"v_4":{"x":294,"y":199},"v_5":{"x":391,"y":113},"v_6":{"x":407,"y":264}},"edgeVisualInfo":{"e_0":{}},"minGraph":{"vertexInfo":{"v_0":{"root":true},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"v_6":{}},"edgeInfo":{},"edgeVertices":{},"directed":true}}',
         maxEdges: 6,
         maxOut: 2,
         maxDepth: 2
      },
      hard: {
         width: 600,
         height: 400,
         visualGraph: '{"vertexVisualInfo":{"v_0":{"x":306,"y":26},"v_1":{"x":187,"y":97},"v_2":{"x":459,"y":77},"v_3":{"x":378,"y":148},"v_4":{"x":268,"y":189},"v_5":{"x":112,"y":219},"v_6":{"x":525,"y":165},"v_7":{"x":421,"y":245},"v_8":{"x":282,"y":286},"v_9":{"x":174,"y":306},"v_10":{"x":46,"y":332},"v_11":{"x":565,"y":257},"v_12":{"x":471,"y":326},"v_13":{"x":375,"y":350},"v_14":{"x":251,"y":374}},"edgeVisualInfo":{"e_0":{"permanent":true}},"minGraph":{"vertexInfo":{"v_0":{"root":true},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"v_6":{},"v_7":{},"v_8":{},"v_9":{},"v_10":{},"v_11":{},"v_12":{},"v_13":{},"v_14":{}},"edgeInfo":{"e_0":{"permanent": true}},"edgeVertices":{},"directed":true}}',
         maxEdges: 14,
         maxOut: 2,
         maxDepth: 3
      }
   };

   var paper;
   var graph;
   var visualGraph;
   var graphDrawer;
   var graphMouse;
   var root;
   var numPermanent;

   var highlightedEdges;
   var highlightedVertex;

   var fuzzyVertexThreshold = 0;
   var fuzzyEdgeThreshold = 20;
   var fuzzyRemover;

   var graphParams = {
      circleAttr: {
         r: 22,
         fill: "#EEEEEE",
         stroke: "black",
         "stroke-width": 1
      },
      rootAttr: {
         fill: "#EEEEEE"
      },
      rootImageParams: {
         width: 28,
         height: 28
      },
      selectedCircleAttr: {
         stroke: "blue",
         "stroke-width": 3
      },
      unselectedCircleAttr: {
         stroke: "black",
         "stroke-width": 1
      },
      lineAttr: {
         "stroke-width": 7,
         "arrow-end": "wide-classic-long"
      },
      highlightCircle: {
         r: 22,
         stroke: "#FF0000",
         "stroke-width": 5
      },
      highlightedEdge: {
         stroke: "red"
      },
      unhighlightedEdge: {
         stroke: "black"
      }
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
      resetGraph();
   };

   subTask.resetDisplay = function() {
      initPaper();
      initHandlers();
      updateCounters();
      findAndHighlightError(false);
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return [];
   };

   subTask.unloadLevel = function(callback) {
      if (visualGraph) {
         fuzzyRemover.setEnabled(false);
         edgeCreator.setEnabled(false);
         visualGraph.remove();
      }
      $("#execute").unbind("click");
      callback();
   };

   var resetGraph = function() {
      graph = Graph.fromMinimized(JSON.parse(data[level].visualGraph).minGraph);
      graph.addPreListener("edgeMonitor", preListener);
      numPermanent = graph.getEdgesCount();
      for(var iEdge in answer) {
         var edge = answer[iEdge];
         var edgeVertices = edge.split(",");
         var parent = edgeVertices[0];
         var child = edgeVertices[1];
         var id = parent + "," + child;
         graph.addEdge(id, parent, child);
      }
      var vertices = graph.getAllVertices();
      for(var iVertex in vertices) {
         if(graph.getVertexInfo(vertices[iVertex]).root) {
            root = vertices[iVertex];
            break;
         }
      }
      graph.addPostListener("edgeCounter", postListener, 20000);
   };

   var initHandlers = function() {
      $("#execute").unbind("execute");
      $("#execute").click(clickExecute);
   };

   var updateCounters = function() {
      $("#verticesLeft").text(taskStrings.verticesLeftCount + ": " + (graph.getVerticesCount() - graph.getReachableVertices(root).length));
      $("#edges").text(taskStrings.edgesCount + ": " + answer.length);
   };

   var initPaper = function() {
      paper = subTask.raphaelFactory.create("anim", "anim", data[level].width, data[level].height);
      graphDrawer = new SimpleGraphDrawer(graphParams.circleAttr, graphParams.lineAttr);
      visualGraph = VisualGraph.fromJSON(data[level].visualGraph, "visual", paper, graph, graphDrawer, true);

      visualGraph.getRaphaelsFromID(root)[0].attr(graphParams.rootAttr);
      var rootPosition = graphDrawer.getVertexPosition(root);
      visualGraph.pushVertexRaphael(root, paper.image("castor.png", rootPosition.x - graphParams.rootImageParams.width / 2, rootPosition.y - graphParams.rootImageParams.height / 2, graphParams.rootImageParams.width, graphParams.rootImageParams.height));

      graphMouse = new GraphMouse("mouse", graph, visualGraph);
      edgeCreator = new EdgeCreator("edgeCreator", "anim", paper, graph, visualGraph, graphMouse, selectVertex, createEdge, true);
      fuzzyRemover = new FuzzyRemover("fuzzyRemover", "anim", paper, graph, visualGraph, null, false, true, fuzzyVertexThreshold, fuzzyEdgeThreshold, true);
   };

   var preListener = {
      addEdge: function(id, vertex1, vertex2, vertex1Info, vertex2Info, edgeInfo) {
         if(graph.hasNeighbor(vertex1, vertex2)) {
            showFeedback(taskStrings.existsError);
            return false;
         }
         if(graph.numEdges >= data[level].maxEdges + numPermanent) {
            showFeedback(taskStrings.numError);
            return false;
         }
         return true;
      },
      removeEdge: function(id, vertex1, vertex2, vertex1Info, vertex2Info, edgeInfo) {
          // DEPRECATED
          if(edgeInfo.permanent) {
            showFeedback(taskStrings.removeError);
            return false;
         }
         return true;
      }
   };

   var postListener = {
      addEdge: function(id) {
         answer.push(id);
         updateCounters();
         findAndHighlightError(false);
      },
      removeEdge: function(id) {  // DEPRECATED
         answer.splice($.inArray(id, answer), 1);
         updateCounters();
         findAndHighlightError(false);
      }
   };

   var createEdge = function(id1, id2) {
      graph.addEdge(id1 + "," + id2, id1, id2);
   };

   var selectVertex = function(id, selected) {
      var attr;
      if(selected) {
         attr = graphParams.selectedCircleAttr;
         fuzzyRemover.setEnabled(false);
      }
      else {
         attr = graphParams.unselectedCircleAttr;
         fuzzyRemover.setEnabled(true);
      }
      visualGraph.getRaphaelsFromID(id)[0].attr(attr);
   };

   var clickExecute = function() {
      unhighlightError();
      var error = findError();
      if(error === null) {
         platform.validate("done");
      }
      else {
         highlightError(error);
         displayHelper.validate("stay");
      }
   };

   var findAndHighlightError = function(validateOnSuccess) {
      unhighlightError();
      var error = findError();
      if(!error) {
         if(validateOnSuccess) {
            platform.validate("done");
         }
         return;
      }
      if(error.type == "reach") {
         return;
      }
      highlightError(error);
   };

   var highlightError = function(error) {
      unhighlightError();
      if(!error) {
         return;
      }
      var vertex = error.vertex;
      if(error.type == "degree") {
         var children = graph.getChildren(vertex);
         for(var iChild in children) {
            highlightedEdges[graph.getEdgesFrom(vertex, children[iChild])[0]] = true;
         }
         showFeedback(taskStrings.degreeError);
      }
      else if(error.type == "depth") {
         var current = error.vertex;
         while(current != root) {
            var parent = error.bfs.parents[current];
            highlightedEdges[graph.getEdgesFrom(parent, current)[0]] = true;
            current = parent;
         }
         showFeedback(taskStrings.depthError);
      }
      else if(error.type == "reach") {
         highlightedVertex = error.vertex;
      }

      for(var edge in highlightedEdges) {
         visualGraph.getRaphaelsFromID(edge)[0].attr(graphParams.highlightedEdge);
      }

      if(highlightedVertex) {
         visualGraph.getRaphaelsFromID(highlightedVertex)[0].attr(graphParams.highlightCircle);
      }
   };

   var unhighlightError = function() {
      showFeedback(null);

      if(highlightedEdges) {
         for(var edge in highlightedEdges) {
            var elements = visualGraph.getRaphaelsFromID(edge);
            if(elements && elements.length > 0) {
               elements[0].attr(graphParams.unhighlightedEdge);
            }
         }
      }
      if(highlightedVertex !== null && highlightedVertex !== undefined) {
         visualGraph.getRaphaelsFromID(highlightedVertex)[0].attr(graphParams.circleAttr);
      }

      highlightedEdges = {};
      highlightedVertex = null;
   };

   var findError = function() {
      if(graph.numEdges > numPermanent + data[level].maxEdges) {
         return {
            type: "edgeCount"
         };
      }

      var vertices = graph.getAllVertices();
      var iVertex;

      if(data[level].maxOut) {
         for(iVertex in vertices) {
            var outdegree = graph.getOutDegree(vertices[iVertex]);
            if(outdegree > data[level].maxOut) {
               return {
                  type: "degree",
                  vertex: vertices[iVertex]
               };
            }
         }
      }

      if(data[level].maxDepth) {
         var bfs = graph.bfs(root);
         var deepestVertex = root;
         var depth = 0;
         for(iVertex in vertices) {
            var vertex = vertices[iVertex];
            if(bfs.distances[vertex] != Infinity && bfs.distances[vertex] > depth) {
               deepestVertex = vertex;
               depth = bfs.distances[vertex];
            }
         }
         if(depth > data[level].maxDepth) {
            return {
               type: "depth",
               vertex: deepestVertex,
               bfs: bfs,
               depth: depth
            };
         }
      }

      var reachable = graph.getReachableVertices(root);
      if(reachable.length != graph.numVertices) {
         var reachableObj = {};
         for(iVertex in reachable) {
            reachableObj[reachable[iVertex]] = true;
         }
         var wrongVertex;
         for(iVertex in vertices) {
            if(!reachableObj[vertices[iVertex]]) {
               wrongVertex = vertices[iVertex];
               break;
            }
         }
         return {
            type: "reach",
            vertex: wrongVertex
         };
      }

      return null;
   };

   var getResultAndMessage = function() {
      showFeedback(null);
      var error = findError();
      if(error === null) {
         return {
            successRate: 1,
            message: taskStrings.congratulations
         };
      }

      if(error.type == "edgeCount") {
         return {
            successRate: 0,
            message: taskStrings.numError
         };
      }

      else if(error.type == "degree") {
         return {
            successRate: 0,
            message: taskStrings.degreeError
         };
      }

      else if(error.type == "depth") {
         return {
            successRate: 0,
            message: taskStrings.depthError
         };
      }

      else if(error.type == "reach") {
         return {
            successRate: 0,
            message: taskStrings.reachError
         };
      }
      
      return {
         successRate: 1,
         message: taskStrings.congratulations
      };
   };

   var showFeedback = function(string) {
      if(!string) {
         string = "";
      }
      $("#feedback").html(string);
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
