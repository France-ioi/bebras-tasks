function initTask(subTask) {

   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         width: 500,
         height: 220,
         visualGraph: '{"vertexVisualInfo":{"v_0":{"x":80,"y":48},"v_1":{"x":192,"y":64},"v_2":{"x":48,"y":144},"v_3":{"x":144,"y":192},"v_12":{"x":256,"y":176},"v_13":{"x":304,"y":48}},"edgeVisualInfo":{"e_0":{}},"minGraph":{"vertexInfo":{"v_0":{"root":true},"v_1":{},"v_2":{"number":2},"v_3":{"number":3},"v_12":{"number":5},"v_13":{}},"edgeInfo":{},"edgeVertices":{},"directed":false}}'
      },
      medium: {
         width: 500,
         height: 400,
         visualGraph: JSON.stringify(
            {"vertexVisualInfo":{"v_0":{"x":192,"y":46},"v_1":{"x":50,"y":139},"v_2":{"x":62,"y":276},"v_3":{"x":204,"y":194},"v_4":{"x":150,"y":365},"v_5":{"x":343,"y":86},"v_6":{"x":354,"y":284},"v_7":{"x":295,"y":360.1875},"v_8":{"x":375,"y":187.18750381469727}},"edgeVisualInfo":{"e_0":{}},"minGraph":{"vertexInfo":{"v_0":{"root":true},"v_1":{},"v_2":{},"v_3":{"number":2},"v_4":{"number":6},"v_5":{},"v_6":{},"v_7":{"number":6},"v_8":{"number":4}},"edgeInfo":{},"edgeVertices":{},"directed":false}}
        )    
      },
      hard: {
         width: 550,
         height: 440,
         visualGraph: JSON.stringify(
            {"vertexVisualInfo":{"v_0":{"x":240,"y":50},"v_1":{"x":33,"y":137},"v_2":{"x":303,"y":138},"v_3":{"x":485,"y":137},"v_4":{"x":88,"y":213},"v_5":{"x":305,"y":220},"v_6":{"x":516,"y":215},"v_7":{"x":40,"y":310},"v_8":{"x":255,"y":305},"v_9":{"x":455,"y":286},"v_10":{"x":121,"y":389},"v_11":{"x":275,"y":389},"v_12":{"x":454,"y":387}},"edgeVisualInfo":{"e_0":{}},"minGraph":{"vertexInfo":{"v_0":{"root":true},"v_1":{},"v_2":{},"v_3":{},"v_4":{"number":2},"v_5":{"number":2},"v_6":{"number":2},"v_7":{},"v_8":{},"v_9":{},"v_10":{"number":5},"v_11":{"number":8},"v_12":{"number":10}},"edgeInfo":{},"edgeVertices":{},"directed":false}}
         )
      }
   };

   var exampleChain = '{"vertexVisualInfo":{"v_0":{"x":23,"y":24},"v_1":{"x":94,"y":24},"v_2":{"x":23,"y":146},"v_8":{"x":94,"y":146},"v_9":{"x":164,"y":24},"v_10":{"x":164,"y":85},"v_11":{"x":164,"y":146}},"edgeVisualInfo":{"e_0":{},"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{}},"minGraph":{"vertexInfo":{"v_0":{"root":true},"v_1":{"number":1},"v_2":{"number":6},"v_8":{},"v_9":{"number":2},"v_10":{},"v_11":{"number":4}},"edgeInfo":{"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{}},"edgeVertices":{"e_12":["v_0","v_1"],"e_13":["v_1","v_9"],"e_14":["v_2","v_8"],"e_15":["v_8","v_11"],"e_16":["v_9","v_10"],"e_17":["v_10","v_11"]},"directed":false}}';
   var exampleComplexTree = '{"vertexVisualInfo":{"v_0":{"x":58.502202643171806,"y":23.400881057268723},"v_1":{"x":23.400881057268723,"y":81.90308370044053},"v_2":{"x":23.400881057268723,"y":140.40528634361235},"v_3":{"x":93.60352422907489,"y":81.90308370044053},"v_4":{"x":93.60352422907489,"y":140.40528634361235},"v_5":{"x":128.70484581497797,"y":23.400881057268723},"v_6":{"x":163.80616740088107,"y":81.90308370044053},"v_7":{"x":198.90748898678416,"y":23.400881057268723},"v_8":{"x":163.80616740088107,"y":140.40528634361235}},"edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{}},"minGraph":{"vertexInfo":{"v_0":{"root":true},"v_1":{"number":1},"v_2":{},"v_3":{"number":3},"v_4":{"number":4},"v_5":{"number":4},"v_6":{},"v_7":{"number":6},"v_8":{"number":6}},"edgeInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{}},"edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_2":["v_2","v_3"],"e_3":["v_3","v_5"],"e_4":["v_3","v_4"],"e_5":["v_5","v_6"],"e_6":["v_6","v_7"],"e_7":["v_6","v_8"]},"directed":false}}';

   var examples = {
      easy: {
         visualGraph: exampleChain,
         width: 187,
         height: 168
      },
      medium: {
         visualGraph: exampleComplexTree,
         width: 230,
         height: 170
      },
      hard: {
         visualGraph: exampleComplexTree,
         width: 230,
         height: 170
      }
   };

   var paper;
   var graph;
   var visualGraph;
   var graphDrawer;
   var graphMouse;
   var vertices;
   var root;

   var paperExample;

   var highlightedEdges;
   var highlightedVertex;

   var fuzzyVertexThreshold = 0;
   var fuzzyEdgeThreshold = 20;
   var fuzzyRemover;

   var graphParams = {
      circleAttr: {
         r: 25,
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
         "stroke-width": 5
      },
      unselectedCircleAttr: {
         stroke: "black",
         "stroke-width": 1
      },
      lineAttr: {
         "stroke-width": 12
      },
      highlightCircle: {
         r: 22,
         stroke: "#FF0000",
         "stroke-width": 7
      },
      highlightedEdge: {
         stroke: "red"
      },
      unhighlightedEdge: {
         stroke: "black"
      },
      numberAttr: {
         "font-size": 22,
         "font-weight": "bold"
      },
      numberedVertexAttr: {
         fill: "#22DD22" //"#DD9900"
      },
      unnumberedVertexAttr: {
         fill: "#22DD22" // #663300"
      }
   };

   var exampleGraphParams = {
      circleAttr: {
         r: 18,
         stroke: "black",
         "stroke-width": 1
      },
      rootAttr: { 
         fill: "#EEEEEE"
      },
      rootImageParams: {
         width: 22,
         height: 22
      },
      unselectedCircleAttr: {
         stroke: "black",
         "stroke-width": 1
      },
      lineAttr: {
         "stroke-width": 9
      },
      numberAttr: {
         "font-size": 18,
         "font-weight": "bold"
      },
      numberedVertexAttr: {
         fill: "#22DD22" //"#DD9900"
      },
      unnumberedVertexAttr: {
         fill: "#22DD22" // #663300"
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
      initExample();
      initHandlers();
      unhighlightError();
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
      vertices = graph.getAllVertices();
      graph.addPreListener("edgeMonitor", preListener);
      for(var iEdge in answer) {
         var edge = answer[iEdge];
         var edgeVertices = edge.split(",");
         var parent = edgeVertices[0];
         var child = edgeVertices[1];
         var id = parent + "," + child;
         graph.addEdge(id, parent, child);
      }
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

   var initExample = function() {
      paperExample = subTask.raphaelFactory.create("exampleAnim", "exampleAnim", examples[level].width, examples[level].height);
      var graphDrawer = new SimpleGraphDrawer(exampleGraphParams.circleAttr, exampleGraphParams.lineAttr);
      var graph = Graph.fromMinimized(JSON.parse(examples[level].visualGraph).minGraph);
      var visualGraph = VisualGraph.fromJSON(examples[level].visualGraph, "visual", paperExample, graph, graphDrawer, true);
      var vertices = graph.getAllVertices();
      var root;
      var iVertex;
      for(iVertex in vertices) {
         if(graph.getVertexInfo(vertices[iVertex]).root) {
            root = vertices[iVertex];
            break;
         }
      }

      visualGraph.getRaphaelsFromID(root)[0].attr(exampleGraphParams.rootAttr);
      var rootPosition = graphDrawer.getVertexPosition(root);
      visualGraph.pushVertexRaphael(root, paperExample.image("start.png", rootPosition.x - exampleGraphParams.rootImageParams.width / 2, rootPosition.y - exampleGraphParams.rootImageParams.height / 2, exampleGraphParams.rootImageParams.width, exampleGraphParams.rootImageParams.height));

      for(iVertex in vertices) {
         var vertex = vertices[iVertex];
         var info = graph.getVertexInfo(vertex);
         var position = graphDrawer.getVertexPosition(vertex);
         if(info.number !== null && info.number !== undefined) {
            var textElement = paperExample.text(position.x, position.y, info.number).attr(exampleGraphParams.numberAttr);
            textElement[0].style.cursor = "default";
            visualGraph.pushVertexRaphael(vertex, textElement);
            visualGraph.getRaphaelsFromID(vertex)[0].attr(exampleGraphParams.numberedVertexAttr);
         }
         else {
            visualGraph.getRaphaelsFromID(vertex)[0].attr(exampleGraphParams.unnumberedVertexAttr);
         }
      }
   };

   var initPaper = function() {
      paper = subTask.raphaelFactory.create("anim", "anim", data[level].width, data[level].height);
      graphDrawer = new SimpleGraphDrawer(graphParams.circleAttr, graphParams.lineAttr);
      visualGraph = VisualGraph.fromJSON(data[level].visualGraph, "visual", paper, graph, graphDrawer, true);

      visualGraph.getRaphaelsFromID(root)[0].attr(graphParams.rootAttr);
      var rootPosition = graphDrawer.getVertexPosition(root);
      visualGraph.pushVertexRaphael(root, paper.image("start.png", rootPosition.x - graphParams.rootImageParams.width / 2, rootPosition.y - graphParams.rootImageParams.height / 2, graphParams.rootImageParams.width, graphParams.rootImageParams.height));

      for(var iVertex in vertices) {
         var vertex = vertices[iVertex];
         var info = graph.getVertexInfo(vertex);
         var position = graphDrawer.getVertexPosition(vertex);
         if(info.number !== null && info.number !== undefined) {
            var textElement = paper.text(position.x, position.y, info.number).attr(graphParams.numberAttr);
            textElement[0].style.cursor = "default";
            visualGraph.pushVertexRaphael(vertex, textElement);
            visualGraph.getRaphaelsFromID(vertex)[0].attr(graphParams.numberedVertexAttr);
         }
         else {
            visualGraph.getRaphaelsFromID(vertex)[0].attr(graphParams.unnumberedVertexAttr);
         }
      }

      graphMouse = new GraphMouse("mouse", graph, visualGraph);
      edgeCreator = new EdgeCreator("edgeCreator", "anim", paper, graph, visualGraph, graphMouse, selectVertex, createEdge, true);
      fuzzyRemover = new FuzzyRemover("fuzzyRemover", "anim", paper, graph, visualGraph, null, false, true, fuzzyVertexThreshold, fuzzyEdgeThreshold, true);
   };

   var preListener = {
      addEdge: function(id, vertex1, vertex2, vertex1Info, vertex2Info, edgeInfo) {
         unhighlightError();
         if(graph.hasNeighbor(vertex1, vertex2)) {
            showFeedback(taskStrings.existsError);
            return false;
         }
         showFeedback(null);
         return true;
      },
      removeEdge: function() {
         unhighlightError();
         return true;
      }
   };

   var postListener = {
      addEdge: function(id) {
         answer.push(id);
         showDistanceError();
      },
      removeEdge: function(id) {
         answer.splice($.inArray(id, answer), 1);
         showDistanceError();
      }
   };

   var showDistanceError = function() {
      var error = findError();
      if(error !== null && error.type === "distanceError") {
         highlightError(error);
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
         unhighlightError();
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

   var highlightError = function(error) {
      unhighlightError();
      if(!error) {
         return;
      }
      var errorType = error.type;
      highlightedVertex = error.vertex;
      highlightedEdges = {};
      showFeedback(taskStrings[errorType]);
      visualGraph.getRaphaelsFromID(highlightedVertex)[0].attr(graphParams.highlightCircle);

      if(errorType === "distanceError") {
         var current = highlightedVertex;
         while(current !== root) {
            var parent = error.bfs.parents[current];
            highlightedEdges[graph.getEdgesFrom(parent, current)[0]] = true;
            current = parent;
         }
      }

      for(var edge in highlightedEdges) {
         visualGraph.getRaphaelsFromID(edge)[0].attr(graphParams.highlightedEdge);
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

      highlightedEdges = null;
      highlightedVertex = null;
   };

   var findError = function() {
      var bfs = graph.bfs(root);

      // We sort the vertices by distance, to make sure that the error shown is minimal/closest to the root.
      // Ties are broken by the visible labels and vertex IDs.
      var sortedVertices = graph.getAllVertices();
      sortedVertices.sort(function(vertex1, vertex2) {
         var distance1 = bfs.distances[vertex1];
         var distance2 = bfs.distances[vertex2];
         
         if(distance1 === distance2) {
            // Put smaller labels first.
            var number1 = graph.getVertexInfo(vertex1).number;
            var number2 = graph.getVertexInfo(vertex2).number;
            if(number1 !== null && number1 !== undefined && number2 !== null && number2 !== undefined) {
               return number1 - number2;
            }
            return vertex1.localeCompare(vertex2);
         }

         // They are not both Infinity, so we can subtract.
         return distance1 - distance2;
      });
      for(var iVertex in sortedVertices) {
         var vertex = sortedVertices[iVertex];
         var info = graph.getVertexInfo(vertex);
         if(info.root || (info.number === null || info.number === undefined)) {
            continue;
         }
         var distance = bfs.distances[vertex];
         if(distance === Infinity) {
            return {
               type: "unconnectedError",
               vertex: vertex
            };
         }
         if(distance !== info.number) {
            return {
               type: "distanceError",
               vertex: vertex,
               bfs: bfs
            };
         }
      }

      return null;
   };

   var getResultAndMessage = function() {
      showFeedback(null);
      var error = findError();
      if(error === null) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }

      return {
         successRate: 0,
         message: taskStrings[error.type]
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
