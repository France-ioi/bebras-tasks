function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var allVertices = ["circle", "smallStar", "bigStar", "diamond", "hexagon", "triangle", "doubleTriangle", "squareHole", "bigI"];
   var data = {
      easy: {
         separatorRadius: 160,
         steps: 1,
         target: ["smallStar", "diamond", "hexagon", "bigStar", "circle"]
      },
      medium: {
         separatorRadius: 175,
         steps: 2,
         target: ["hexagon", "triangle", "smallStar", "circle", "diamond", "bigStar"]
      },
      hard: {
         separatorRadius: 200,
         steps: 3, // Remark: very interesting task with steps=6.
         target: ["hexagon", "squareHole", "smallStar", "triangle", "doubleTriangle", "bigI", "circle", "bigStar", "diamond"]
      }
   };

   var paper;
   var graph;
   var visualGraph;
   var graphDrawer;
   var graphMouse;
   var vertexToIndex;
   var levelVertices;
   var levelTarget;
   var angleOffset;

   // From back to front.
   var zOrder = ["circle", "squareHole", "hexagon", "bigI", "bigStar", "diamond", "doubleTriangle", "triangle", "smallStar"];
   
   var fuzzyVertexThreshold = 0;
   var fuzzyEdgeThreshold = 20;
   var fuzzyRemover;

   var errorCell;
   var errorVertex;

   var stickers;
   var stickersObject;
   var stickerPositions;
   var simulation;
   var animTime = 1200;
   var animCenterTime = 1000;
   var animDelayTime = 50;

   var paperParams = {
      width: null, // calculated
      height: null,
      errorAttr: {
         stroke: "#ff0000",
         "stroke-width": 5
      },
      errorRectParams: {
         pad: 4
      },
      errorCircleParams: {
         radius: 36
      }
   };

   var graphParams = {
      graphShapeToRadius: 36,
      circleAttr: {
         r: 36,
         fill: "white",
         stroke: "black",
         "stroke-width": 1,
         opacity: 1,
         "stroke-opacity": 0
      },
      selectedCircleAttr: {
         stroke: "blue",
         "stroke-width": 3,
         "stroke-opacity": 1
      },
      lineAttr: {
         "stroke-width": 4,
         "arrow-end": "classic-wide-long"
      },
      grayCircleAttr: {
         stroke : "#DDDDDD",
         fill: "none",
         "stroke-width": 72 // should be twice graphShapeToRadius
      }
   };

   var shapeParams = {
      vertexRadius: 28, // should be even
      stickerRadius: 28,
      attr: {
         circle: {
            fill: "orange"
         },
         triangle: {
            fill: "cyan"
         },
         bigStar: {
            fill: "yellow"
         },
         smallStar: {
            fill: "purple"
         },
         diamond: {
            fill: "green"
         },
         hexagon: {
            fill: "blue"
         },
         doubleTriangle: {
            fill: "red"
         },
         squareHole: {
            fill: "brown"
         },
         bigI: {
            fill: "pink"
         },
         squareHoleCircle: {
            fill: "white"
         }
      }
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      displayHelper.hideValidateButton = true;
      initPermutation();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      initGraph();
   };

   subTask.resetDisplay = function() {
      initPaper();
      initHandlers();
      refreshResult();
      unhighlightError();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return {};
   };

   subTask.unloadLevel = function(callback) {
      killSimulation();
      if (visualGraph) {
         fuzzyRemover.setEnabled(false);
         edgeCreator.setEnabled(false);
         visualGraph.remove();
      }
      $("#execute").unbind("click");
      callback();
   };

   var initPermutation = function() {
      levelVertices = allVertices.slice(0, data[level].target.length);
      levelTarget = $.extend([], data[level].target);

      // Shuffle both the level vertices and the target in the same way.
      var seed = subTask.taskParams.randomSeed;
      var randomGenerator = new RandomGenerator(seed);
      randomGenerator.shuffle(levelVertices);
      randomGenerator.reset(seed);
      randomGenerator.shuffle(levelTarget);

      vertexToIndex = {};
      for(var iVertex in levelVertices) {
         vertexToIndex[levelVertices[iVertex]] = iVertex;
      }

      // Graph circle rotation.
      angleOffset = randomGenerator.nextReal() * 2 * Math.PI;
   };

   var initGraph = function() {
      graph = new Graph(true);
      for(var iVertex in levelVertices) {
         graph.addVertex(levelVertices[iVertex]);
      }
      
      graph.addPreListener("edgeMonitor", preListener);

      for(var vertex in answer) {
         var child = answer[vertex];
         var id = vertex + "," + child;
         graph.addEdge(id, vertex, child);
      }

      graph.addPostListener("updateAnswer", postListener);
   };

   var initHandlers = function() {
      $("#execute").unbind("click");
      $("#execute").click(clickExecute);
      $("#resetSim").unbind("click");
      $("#resetSim").click(killSimulation);
   };

   var initPaper = function() {
      var graphOuterRadius = data[level].separatorRadius + graphParams.graphShapeToRadius;
      paperParams.width = graphOuterRadius * 2 + shapeParams.vertexRadius * 3;
      paperParams.height = graphOuterRadius * 2 + shapeParams.vertexRadius * 3;
      paper = subTask.raphaelFactory.create("anim", "anim", paperParams.width, paperParams.height);

      paper.circle(paperParams.width / 2, paperParams.height / 2, graphOuterRadius).attr(graphParams.grayCircleAttr);

      graphDrawer = new SimpleGraphDrawer(graphParams.circleAttr, graphParams.lineAttr, vertexDrawer);
      visualGraph = new VisualGraph("visual", paper, graph, graphDrawer, false);

      initVertexPositions();
      visualGraph.redraw();
      visualGraph.setAutoDraw(true);

      graphMouse = new GraphMouse("mouse", graph, visualGraph);
      edgeCreator = new EdgeCreator("edgeCreator", "anim", paper, graph, visualGraph, graphMouse, selectVertex, createEdge, true);
      fuzzyRemover = new FuzzyRemover("fuzzyRemover", "anim", paper, graph, visualGraph, null, false, true, fuzzyVertexThreshold, fuzzyEdgeThreshold, true);

      drawStickers();
   };

   var initVertexPositions = function() {
      // Place the vertices on a large virtual circle.
      for(var iVertex = 0; iVertex < levelVertices.length; iVertex++) {
         var vertex = levelVertices[iVertex];
         var graphInnerRadius = data[level].separatorRadius - graphParams.graphShapeToRadius;
         var position = getPositionOnCircle(iVertex / levelVertices.length, graphInnerRadius);
         visualGraph.setVertexVisualInfo(vertex, position);
      }
   };

   var drawStickers = function() {
      if(stickers) {
         for(var index in stickers) {
            stickers[index].remove();
         }
      }

      stickers = [];
      stickerPositions = [];
      stickersObject = {};
      var iVertex;
      for(iVertex in levelVertices) {
         var vertex = levelVertices[iVertex];
         var graphInnerRadius = data[level].separatorRadius - graphParams.graphShapeToRadius;
         var position = getPositionOnCircle(iVertex / levelVertices.length, graphInnerRadius);
         stickerPositions.push(position);
         var sticker = levelTarget[iVertex];
         var element = drawShape(sticker, position.x, position.y, shapeParams.stickerRadius);
         stickers.push(element);
         if(!stickersObject[sticker]) {
            stickersObject[sticker] = [];
         }
         stickersObject[sticker].push(element);
      }

      for(iVertex = 0; iVertex < zOrder.length; iVertex++) {
         var current = zOrder[iVertex];
         if(stickersObject[current]) {
            for(var iElement in stickersObject[current]) {
               stickersObject[current][iElement].toFront();
            }
         }
      }
      
      // Bring the invisible circles to front, so clicking the sticker counts as clicking the vertex.
      for(iVertex in levelVertices) {
         visualGraph.getRaphaelsFromID(levelVertices[iVertex])[2].toFront();
      }
   };

   var vertexDrawer = function(id, info, centerX, centerY) {
      if(!id) {
         return [];
      }
      var graphOuterRadius = data[level].separatorRadius + graphParams.graphShapeToRadius;
      var position = getPositionOnCircle(vertexToIndex[id] / levelVertices.length, graphOuterRadius);

      var shape = drawShape(id, position.x, position.y, shapeParams.vertexRadius);
      var overlay1 = paper.circle(centerX, centerY, graphParams.circleAttr.r).attr({
         fill: "green",
         opacity: 0
      });
      var overlay2 = paper.circle(position.x, position.y, graphParams.circleAttr.r).attr({
         fill: "green",
         opacity: 0
      });

      return [shape, overlay1, overlay2];
              
   };

   var drawShape = function(id, centerX, centerY, radius) {
      paper.setStart();
      var element;
      if(id == "circle") {
         element = paper.circle(centerX, centerY, radius);
      }
      else if(id == "triangle") {
         element = paper.path(["M", centerX - radius * 0.75, centerY + radius * 0.75,
                               "L", centerX + radius * 0.75, centerY + radius * 0.75,
                               "L", centerX, centerY - radius * 0.75,
                               "Z"]);
      }
      else if(id == "diamond") {
         element = paper.path(["M", centerX, centerY - radius,
                               "L", centerX + radius, centerY,
                               "L", centerX, centerY + radius,
                               "L", centerX - radius, centerY,
                               "Z"]);
      }
      else if(id == "hexagon") {
         element = paper.path(["M", centerX, centerY - radius,
                               "L", centerX - radius, centerY - radius * 0.4,
                               "L", centerX - radius, centerY + radius * 0.4,
                               "L", centerX, centerY + radius,
                               "L", centerX + radius, centerY + radius * 0.4,
                               "L", centerX + radius, centerY - radius * 0.4,
                               "Z"]);
      }
      else if(id == "bigStar") {
         element = paper.path(["M", centerX, centerY - radius,
                               "L", centerX + 0.27 * radius, centerY - 0.3 * radius,
                               "L", centerX + radius, centerY - 0.3 * radius,
                               "L", centerX + 0.4 * radius, centerY + 0.2 * radius,
                               "L", centerX + 0.6 * radius, centerY + 0.8 * radius,
                               "L", centerX + 0, centerY + 0.4 * radius,
                               "L", centerX - 0.6 * radius, centerY + 0.8 * radius,
                               "L", centerX - 0.4 * radius, centerY + 0.2 * radius,
                               "L", centerX - radius, centerY - 0.3 * radius,
                               "L", centerX - 0.27 * radius, centerY - 0.3 * radius,
                               "Z"]);
      }
      else if(id == "smallStar") {
         element = paper.path(["M", centerX, centerY - radius,
                               "L", centerX + radius * 0.2, centerY - radius * 0.2,
                               "L", centerX + radius, centerY,
                               "L", centerX + radius * 0.2, centerY + radius * 0.2,
                               "L", centerX, centerY + radius,
                               "L", centerX - radius * 0.2, centerY + radius * 0.2,
                               "L", centerX - radius, centerY,
                               "L", centerX - radius * 0.2, centerY - radius * 0.2,
                               "Z"]);
      }
      else if(id == "doubleTriangle") {
         element = paper.path(["M", centerX - 2, centerY,
                               "L", centerX - radius * 0.8, centerY - radius * 0.8,
                               "L", centerX + radius * 0.8, centerY - radius * 0.8,
                               "L", centerX + 2, centerY,
                               "L", centerX + radius * 0.8, centerY + radius * 0.8,
                               "L", centerX - radius * 0.8, centerY + radius * 0.8,
                               "Z"
         ]);
      }
      else if(id == "squareHole") {
         element = paper.rect(centerX - radius * 0.8, centerY - radius * 0.8, 2 * radius * 0.8, 2 * radius * 0.8);
         paper.circle(centerX, centerY, radius / 4).attr(shapeParams.attr.squareHoleCircle);
      }
      else if(id == "bigI") {
         element = paper.path(["M", centerX - radius / 3, centerY - radius / 3,
                               "H", centerX - radius * 0.8,
                               "V", centerY - radius * 0.8,
                               "H", centerX + radius * 0.8,
                               "V", centerY - radius / 3,
                               "H", centerX + radius / 3,
                               "V", centerY + radius / 3,
                               "H", centerX + radius * 0.8,
                               "V", centerY + radius * 0.8,
                               "H", centerX - radius * 0.8,
                               "V", centerY + radius / 3,
                               "H", centerX - radius / 3,
                               "Z"
         ]);
      }

      element.attr(shapeParams.attr[id]);
      return paper.setFinish();
   };

   var getPositionOnCircle = function(circleFraction, radius) {
      var angle = angleOffset + circleFraction * 2 * Math.PI;
      return {
         x: paperParams.width / 2 + radius * Math.cos(angle),
         y: paperParams.height / 2 + radius * Math.sin(angle)
      };
   };

   var preListener = {
      addEdge: function(id, vertex1, vertex2, vertex1Info, vertex2Info, edgeInfo) {
         if(graph.hasChild(vertex1, vertex2)) {
            return false;
         }
         if(graph.hasChild(vertex2, vertex1)) {
            graph.removeChild(vertex2, vertex1);
         }
         return true;
      }
   };

   var postListener = {
      addEdge: function(id, parent, child) {
         var children = graph.getChildren(parent);
         for(var iChild in children) {
            if(children[iChild] != child) {
               graph.removeChild(parent, children[iChild]);
            }
         }
         answer[parent] = child;
         refreshResult();
      },
      removeEdge: function(id, parent, child) {
         delete answer[parent];
         refreshResult();
         killSimulation();
      }
   };

   var createEdge = function(id1, id2) {
      graph.addEdge(id1 + "," + id2, id1, id2);
      unhighlightError();
   };

   var selectVertex = function(id, selected) {
      killSimulation();
      var attr;
      if(selected) {
         attr = graphParams.selectedCircleAttr;
         fuzzyRemover.setEnabled(false);
      }
      else {
         attr = graphParams.circleAttr;
         fuzzyRemover.setEnabled(true);
      }
      visualGraph.getRaphaelsFromID(id)[0].attr(attr);
      unhighlightError();
   };

   var clickExecute = function() {
      unhighlightError();
      killSimulation();
      simulation = subTask.simulationFactory.create("sim");
      simulate(simulation);
      simulation.setAutoPlay(true);
      simulation.play();
   };

   var simulate = function(simulation) {
      simulation.clear();
      var iVertex, vertex;
      var gradualArrays = getGradualArrays();
      var finalArray = gradualArrays[gradualArrays.length - 1];

      var allStickerSteps = Beav.Matrix.init(levelVertices.length, data[level].steps, function(iVertex, iStep) {
         return gradualArrays[iStep][iVertex];
      });

      // Initialize counter.
      var counterSteps = {0: true};
      var step = new SimulationStep();
      step.addEntry({
         name: "counter",
         action: {
            onExec: simulationUpdateCounter,
            params: {
               step: 0
            }
         }
      });

      step = new SimulationStep();

      // Animate each vertex.
      if(stickers) {
         for(iVertex in levelVertices) {
            var stickerSteps = allStickerSteps[iVertex];
            vertex = levelVertices[iVertex];
            for(var iStep = 0; iStep < data[level].steps; iStep++) {
               if(stickerSteps[iStep] === null) {
                  break;
               }

               simulationAnimateSet(step, stickerSteps, iVertex, vertex, iStep);

               if(!counterSteps[iStep + 1]) {
                  counterSteps[iStep + 1] = true;
                  var entry = {
                     name: "counter " + (iStep + 1),
                     action: {
                        onExec: simulationUpdateCounter,
                        params: {
                           step: (iStep + 1)
                        }
                     }
                  };
                  if(iStep > 0) {
                     entry.parents = ["vertex " + vertex + " step " + (iStep - 1) + " element 0"];
                  }
                  step.addEntry(entry);
               }
            }
         }
         simulation.addStep(step);
      }

      // destinationContent maps each big shape to the sticker indices that arrived there,
      // if they finished their journey.
      var destinationContent = {};
      for(iVertex in finalArray) {
         vertex = finalArray[iVertex];
         if(!vertex) {
            continue;
         }
         if(destinationContent[vertex] === undefined) {
            destinationContent[vertex] = [];
         }
         destinationContent[vertex].push(iVertex);
      }

      var lastDestination = [];
      for(iVertex in levelVertices) {
         if(allStickerSteps[iVertex][0] === null) {
            lastDestination.push(levelVertices[iVertex]);
            continue;
         }
         var lastIndex = allStickerSteps[iVertex].length - 1;
         while(allStickerSteps[iVertex][lastIndex] === null) {
            lastIndex--;
         }
         lastDestination.push(allStickerSteps[iVertex][lastIndex]);
      }

      // Error on any mismatch.
      for(iVertex in levelTarget) {
         if(levelTarget[iVertex] !== lastDestination[iVertex]) {
            simulation.addStepWithEntry({
               name: "validate",
               action: {
                  onExec: onSimulationFinish,
                  params: {
                     success: false,
                     error: {
                        wrong: lastDestination[iVertex]
                     }
                  }
               }
            });
            return {
               successRate: 0,
               message: taskStrings.wrong
            };
         }
      }

      // Success.
      simulation.addStepWithEntry({
         name: "validate",
         action: {
            onExec: onSimulationFinish,
            params: {
               success: true
            }
         }
      });

      return {
         successRate: 1,
         message: taskStrings.success
      };
   };

   function simulationAnimateSet(step, stickerSteps, iVertex, vertex, iStep) {
      var index = 0;
      stickers[iVertex].forEach(function(element) {
         var entry = {
            name: "vertex " + vertex + " step " + iStep + " element " + index,
            action: {
               onExec: stepFunction,
               params: {
                  element: element,
                  stickerIndex: iVertex,
                  target: stickerSteps[iStep]
               },
               duration: animTime
            }
         };
         if(iStep === 0) {
            // First step: sticker starts from its big shape.
            entry.action.params.from = levelVertices[iVertex];
         }
         else {
            // Sticker starts from the previous big shape it visited.
            entry.action.params.from = stickerSteps[iStep - 1];

            // Dependency: the previous step must finish.
            entry.parents = ["vertex " + vertex + " step " + (iStep - 1) + " element " + index];
         }
         step.addEntry(entry);
         index++;
      });
   }

   var stepFunction = function(params, duration, callback) {
      var targetPosition = graphDrawer.getVertexPosition(params.target);
      var sourcePosition = graphDrawer.getVertexPosition(params.from);
      
      return simulationAnimateSticker(params.element, sourcePosition, targetPosition, duration, callback);
   };

   var simulationUpdateCounter = function(params, duration, callback) {
      callback();
   };

   var simulationAnimateSticker = function(element, sourcePosition, targetPosition, duration, callback) {
      var animation;
      if(element.type == "circle") {
         animation = {
            cx: targetPosition.x,
            cy: targetPosition.y
         };
      }
      else if(element.type == "path") {
         var transform = ["T", targetPosition.x - sourcePosition.x, targetPosition.y - sourcePosition.y];
         animation = {
            path: Raphael.transformPath(element.attrs.path, transform)
         };
      }
      else {
         animation = {
            x: targetPosition.x - element.attrs.width / 2,
            y: targetPosition.y - element.attrs.height / 2
         };
      }
      return element.animate(animation, duration, callback);
   };

   var onSimulationFinish = function(params, duration, callback) {
      if(params.success) {
         platform.validate("done");
      }
      else {
         highlightError(params.error);
         displayHelper.validate("stay");
      }
      simulation = null;
      callback();
   };

   var highlightError = function(error) {
      unhighlightError();
      if(error.wrong === undefined) {
         return;
      }
      var vertex = error.wrong;
      var vertexPosition = graphDrawer.getVertexPosition(vertex);
      errorVertex = paper.circle(vertexPosition.x, vertexPosition.y, paperParams.errorCircleParams.radius).attr(paperParams.errorAttr);
   };

   var unhighlightError = function(index) {
      if(errorCell) {
         errorCell.remove();
         errorCell = null;
      }
      if(errorVertex) {
         errorVertex.remove();
         errorVertex = null;
      }
   };

   var refreshResult = function() {
      var gradualArrays = getGradualArrays();
      var resultArray = gradualArrays[gradualArrays.length - 1];
   };

   var applyTransformation = function(array) {
      return Beav.Array.init(array.length, function(index) {
         var vertex = array[index];
         if(vertex === null || vertex === undefined) {
            return null;
         }
         if(answer[vertex]) {
            return answer[vertex];
         }
         return null;
      });
   };

   var getGradualArrays = function() {
      var result = [];
      var current = $.extend(true, [], levelVertices);
      for(var index = 0; index < data[level].steps; index++) {
         current = applyTransformation(current);
         result.push(current); 
      }
      return result;
   };

   var getResultAndMessage = function() {
      return simulate(new Simulation());
   };

   var killSimulation = function() {
      if(simulation) {
         simulation.stop();
      }
      if(paper && stickers) {
         drawStickers();
      }
      subTask.simulationFactory.destroy("sim");
      simulation = null;
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
