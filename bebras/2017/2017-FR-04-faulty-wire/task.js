function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         visualGraphStr: '{"vertexVisualInfo":{"v_6":{"x":224,"y":112,"angle":0},"v_7":{"x":352,"y":112,"angle":0},"v_9":{"x":480,"y":112,"angle":0},"v_10":{"x":32,"y":256,"angle":0},"v_11":{"x":160,"y":256,"angle":0},"v_12":{"x":288,"y":256,"angle":0},"v_13":{"x":416,"y":256,"angle":0},"v_14":{"x":544,"y":256,"angle":0},"v_15":{"x":672,"y":256,"angle":0}},"edgeVisualInfo":{"e_5":{},"e_6":{},"e_7":{},"e_9":{},"e_10":{},"e_0":{}},"minGraph":{"vertexInfo":{"v_6":{},"v_7":{},"v_9":{},"v_10":{},"v_11":{},"v_12":{},"v_13":{},"v_14":{},"v_15":{}},"edgeInfo":{"e_5":{},"e_6":{},"e_7":{},"e_9":{},"e_10":{},"e_0":{}},"edgeVertices":{"e_5":["v_6","v_7"],"e_6":["v_10","v_11"],"e_7":["v_11","v_12"],"e_9":["v_13","v_14"],"e_10":["v_14","v_15"],"e_0":["v_7","v_9"]},"directed":false}}',
         paperWidth: 720,
         paperHeight: 285,
         optimal: 4,
         bigScale: 1,
         smallScale: 0.7
      },
      medium: {
         visualGraphStr: '{"vertexVisualInfo":{"v_0":{"x":32,"y":112,"angle":0},"v_1":{"x":128,"y":112,"angle":0},"v_2":{"x":224,"y":112,"angle":0},"v_3":{"x":320,"y":112,"angle":0},"v_4":{"x":416,"y":112,"angle":0},"v_5":{"x":512,"y":112,"angle":0},"v_6":{"x":608,"y":112,"angle":45},"v_7":{"x":608,"y":208,"angle":90},"v_8":{"x":608,"y":304,"angle":135},"v_9":{"x":512,"y":304,"angle":180},"v_10":{"x":416,"y":304,"angle":180},"v_11":{"x":320,"y":304,"angle":180},"v_12":{"x":224,"y":304,"angle":180},"v_13":{"x":128,"y":304,"angle":180},"v_14":{"x":32,"y":304,"angle":180}},"edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"v_6":{},"v_7":{},"v_8":{},"v_9":{},"v_10":{},"v_11":{},"v_12":{},"v_13":{},"v_14":{}},"edgeInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{}},"edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_2":["v_2","v_3"],"e_3":["v_3","v_4"],"e_4":["v_4","v_5"],"e_5":["v_5","v_6"],"e_6":["v_6","v_7"],"e_7":["v_7","v_8"],"e_8":["v_8","v_9"],"e_9":["v_9","v_10"],"e_10":["v_10","v_11"],"e_11":["v_11","v_12"],"e_12":["v_12","v_13"],"e_13":["v_13","v_14"]},"directed":false}}',
         paperWidth: 740,
         paperHeight: 402,
         optimal: 5,
         bigScale: 1,
         smallScale: 0.7
      },
      hard: {
         visualGraphStr: '{"vertexVisualInfo":{"v_0":{"x":389.21768707482994,"y":107.58095238095238,"angle":0},"v_1":{"x":204.79319727891158,"y":169.05578231292517,"angle":-30},"v_2":{"x":573.6421768707484,"y":169.05578231292517,"angle":30},"v_3":{"x":112.58095238095238,"y":261.2680272108844,"angle":-30},"v_4":{"x":297.00544217687076,"y":261.2680272108844,"angle":30},"v_5":{"x":481.4299319727891,"y":261.2680272108844,"angle":-30},"v_6":{"x":665.8544217687075,"y":261.2680272108844,"angle":30},"v_7":{"x":66.47482993197279,"y":353.48027210884356,"angle":-30},"v_8":{"x":158.687074829932,"y":353.48027210884356,"angle":30},"v_9":{"x":250.89931972789117,"y":353.48027210884356,"angle":-30},"v_10":{"x":343.11156462585035,"y":353.48027210884356,"angle":30},"v_11":{"x":435.32380952380953,"y":353.48027210884356,"angle":-30},"v_12":{"x":527.5360544217688,"y":353.48027210884356,"angle":30},"v_13":{"x":619.748299319728,"y":353.48027210884356,"angle":-30},"v_14":{"x":711.9605442176871,"y":353.48027210884356,"angle":30}},"edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"v_6":{},"v_7":{},"v_8":{},"v_9":{},"v_10":{},"v_11":{},"v_12":{},"v_13":{},"v_14":{}},"edgeInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{}},"edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_2":["v_1","v_3"],"e_3":["v_1","v_4"],"e_4":["v_3","v_7"],"e_5":["v_3","v_8"],"e_6":["v_4","v_9"],"e_7":["v_4","v_10"],"e_8":["v_2","v_5"],"e_9":["v_2","v_6"],"e_10":["v_5","v_11"],"e_11":["v_5","v_12"],"e_12":["v_6","v_13"],"e_13":["v_6","v_14"]},"directed":false}}',
         paperWidth: 770,
         paperHeight: 395,
         optimal: 5,
         bigScale: 1,
         smallScale: 0.7
      }
   };

   var exampleVisualGraphStr = '{"vertexVisualInfo":{"v_0":{"x":32,"y":80,"angle":0},"v_1":{"x":128,"y":80,"angle":0},"v_2":{"x":224,"y":80,"angle":0}},"edgeVisualInfo":{"e_0":{},"e_1":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_1":{},"v_2":{}},"edgeInfo":{"e_0":{},"e_1":{}},"edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"]},"directed":false}}';

   var exampleInstances;
   var graph;
   var mainInstance;
   var provenIntact;
   var numProvenIntact;
   var numEdges;

   var examplePaperWidth = 256;
   var examplePaperHeight = 100;

   var generalParams = {
      castorImage: "castor.png"
   };
   
   var pipeColor = "gray";
   var pipeBorderColor = "black";
   var mainVisualParams = {
      circleAttr: {
         fill: pipeColor,
         stroke: pipeBorderColor
      },
      vertexRadius: 25,
      pipeBorderWidth: 3,
      pipeWidth: 30,
      lineAttr: {
         stroke: pipeBorderColor
      },
      innerLineAttr: {
         stroke: pipeColor
      },
      vertexThreshold: 70,
      edgeThreshold: 0,
      beaverSize: {
         width: 40,
         height: 35
      },
      beaverDistance: 80,
      arrowLength: 30,
      arrowWidth: 7,
      arrowDistance: 32,
      arrowAttr: {
         "arrow-end": "classic-normal-medium",
         stroke: "green"
      },
      lidBaseWidth: 30,
      lidBaseHeight: 10,
      lidBaseDistance: 20,
      lidBaseAttr: {
         stroke: pipeBorderColor,
         fill: pipeColor
      },
      lidDistance: 36,
      lidWide: 38,
      lidSmall: 32,
      lidHeight: 5,
      lidAttr: {
         stroke: pipeBorderColor
      },
      lidOpenAngle: -90,
      lidRotationOffset: {
         x: 2,
         y: 6
      },
      animMoveTime: 300,
      animWaitTime: 400,
      clearEdgeAttr: {
         stroke: "#ffaaaa"
      },
      obstructedEdgeAttr: {
         stroke: "#ffffaa"
      },
      foundEdgeAttr: {
         stroke: "#aaffaa"
      },
      tickPoints: [
         {x: -6, y: -2},
         {x: 0, y: 7},
         {x: 10, y: -11}
      ],
      tickWidth: 3,
      tickAttr: {
         stroke: "green"
      },
      crossWidth: 4,
      crossSize: 5,
      crossAttr: {
         stroke: "#aa0000"
      },
      edgeTextAttr: {
         "font-size": 18
      },
      seedRadii: [5, 10],
      seedBeaverOffset: [
         {x: 40, y: 0},
         {x: 48, y: 20}
      ],
      seedAttr: {
         fill: "yellow"
      }
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      initGraph();
      numEdges = graph.getEdgesCount();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      provenIntact = {};
      numProvenIntact = 0;
      for(var iPair in answer.userVertexPairs) {
         processPair(answer.userVertexPairs[iPair]);
      }
   };
   
   subTask.resetDisplay = function() {
      initMainInstance();
      updateCounter();

      $("#descriptionSteps").text(data[level].optimal);
      showFeedback(null);
      setRestartConfirmation(true);
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return {
         userVertexPairs: [],    // Array of pairs that were tested (vertexIDs)
         userEdge: null          // Selected faulty wire (edgeID)
      };
   };

   subTask.unloadLevel = function(callback) {
      if(mainInstance) {
         mainInstance.remove();
      }
      if(exampleInstances) {
         for(var iExample in exampleInstances) {
            exampleInstances[iExample].remove();
         }
      }
      callback();
   };

   function initGraph() {
      graph = Graph.fromMinimized(JSON.parse(data[level].visualGraphStr).minGraph);
   }

   function initMainInstance() {
      mainInstance = new VisualInstance({
         id: "mainInstance",
         elementID: "anim",
         visualGraphStr: data[level].visualGraphStr,
         paperWidth: data[level].paperWidth,
         paperHeight: data[level].paperHeight,
         interactive: true,
         onUserPairChoice: onUserPairChoice,
         onUserEdgeChoice: onUserEdgeChoice, 
         visualParams: mainVisualParams,
         expedite: false,
         scale: data[level].bigScale,
         feedback: true
      });
   }

   function VisualInstance(settings) {
      var self = this;
      var paper;
      var graph;
      var visualGraph;
      var graphDrawer;
      var fuzzyClicker;
      var params = $.extend(true, {}, settings.visualParams);
      var scale = settings.scale;
      var vertexRadius = params.vertexRadius * scale;
      var pipeBorderWidth = params.pipeBorderWidth * scale;
      var pipeWidth = params.pipeWidth * scale;
      var userPair = {};
      var images = {};
      var beaverArrows = {};
      var edgeMarks = {};
      var seeds = {};
      var simulation;
      var beaverWidth = params.beaverSize.width * scale;
      var beaverHeight = params.beaverSize.height * scale;

      this.init = function() {
         params.circleAttr.r = vertexRadius;
         params.circleAttr["stroke-width"] = pipeBorderWidth;
         params.lineAttr["stroke-width"] = pipeWidth + 2 * pipeBorderWidth;
         params.innerLineAttr["stroke-width"] = pipeWidth;
         params.lidBaseAttr["stroke-width"] = pipeBorderWidth;
         params.lidAttr["stroke-width"] = params.lidHeight * scale;
         params.arrowAttr["stroke-width"] = params.arrowWidth * scale;
         params.clearEdgeAttr["stroke-width"] = pipeWidth;
         params.obstructedEdgeAttr["stroke-width"] = pipeWidth;
         params.foundEdgeAttr["stroke-width"] = pipeWidth;
         params.edgeTextAttr["font-size"] *= scale;
         params.tickAttr["stroke-width"] = params.tickWidth * scale;
         params.crossAttr["stroke-width"] = params.crossWidth * scale;
         graphDrawer = new SimpleGraphDrawer(params.circleAttr, params.lineAttr, this._vertexDrawer, false, null, true, params.innerLineAttr);
         paper = subTask.raphaelFactory.create(settings.id, settings.elementID, settings.paperWidth, settings.paperHeight);
         visualGraph = VisualGraph.fromJSON(settings.visualGraphStr, settings.id + "_visualGraph", paper, null, graphDrawer, false);
         graph = visualGraph.getGraph();
         visualGraph.redraw();

         if(settings.interactive) {
            fuzzyClicker = new FuzzyClicker(settings.id + "_fuzzy", settings.elementID, paper, graph, visualGraph, this._onClick, true, true, true, params.vertexThreshold, params.edgeThreshold, true);
         }

         images.beaver = paper.image(generalParams.castorImage, 0, 0, beaverWidth, beaverHeight).toBack().hide();
      };

      this.clearChoices = function() {
         images.beaver.hide();
         for(var iArrow in beaverArrows) {
            beaverArrows[iArrow].remove();
         }
         for(var iMark in edgeMarks) {
            edgeMarks[iMark].remove();
         }
         for(var iSeed in seeds) {
            seeds[iSeed].remove();
         }
         beaverArrows = {};
         edgeMarks = {};
         seeds = {};
         this.setVertexState(userPair.from, false);
         this.setVertexState(userPair.to, false);
         userPair = {};
      };

      this.setVertexState = function(id, open) {
         if(id === undefined || id === null) {
            return;
         }
         var lid = visualGraph.getRaphaelsFromID(id)[2];
         if(open) {
            var rotationPoint = visualGraph.getVertexVisualInfo(id).lidRotationPoint;
            lid.transform(["R", params.lidOpenAngle, rotationPoint.x, rotationPoint.y]);
         }
         else {
            lid.transform([]);
         }
      };

      this._onClick = function(elementType, id, xPos, yPos) {
         // Don't allow click during simulations.
         if(simulation && simulation.isPlaying()) {
            return;
         }

         if(settings.feedback) {
            showFeedback(null);
            setRestartConfirmation(true);
         }

         // Clicking on a vertex is handled by another function.
         if(elementType === "vertex") {
            self._onVertexClick(id);
         }
         // Clicking on the background clears.
         else {
            self.clearChoices();
         }
      };

      this._vertexDrawer = function(id, info, x, y) {
         var visualInfo = visualGraph.getVertexVisualInfo(id);
         var angle = visualInfo.angle;
         
         // Draw the base on top of the circle, then rotate.
         var basePath = [
            "M", x - params.lidBaseWidth * scale / 2, y - params.lidBaseDistance * scale,
            "V", y - (params.lidBaseHeight + params.lidBaseDistance) * scale,
            "H", x + params.lidBaseWidth * scale / 2,
            "V", y - params.lidBaseDistance * scale
         ];
         basePath = Raphael.transformPath(basePath, ["R", angle, x, y]);
         var lidBase = paper.path(basePath).attr(params.lidBaseAttr);

         var lidDistance = params.lidDistance * scale;
         var lidPath = [
            "M", x - params.lidWide * scale / 2, y - lidDistance,
            "H", x + params.lidWide * scale / 2,
            "M", x - params.lidSmall * scale / 2, y - lidDistance + params.lidHeight * scale,
            "H", x + params.lidSmall * scale / 2
         ];
         lidPath = Raphael.transformPath(lidPath, ["R", angle, x, y]);
         var lid = paper.path(lidPath).attr(params.lidAttr);

         var rotationPointPath = ["M", x - params.lidWide * scale / 2 + params.lidRotationOffset.x * scale, y - lidDistance + params.lidRotationOffset.y * scale];
         rotationPointPath = Raphael.transformPath(rotationPointPath, ["R", angle, x, y]);
         visualInfo.lidRotationPoint = {
            x: rotationPointPath[0][1],
            y: rotationPointPath[0][2]
         };

         var beaverFarPoint = ["M", x, y];
         beaverFarPoint = Raphael.transformPath(beaverFarPoint, [
            "T", 0, - params.beaverDistance * scale,
            "R", angle, x, y
         ]);

         visualInfo.beaverFarPoint = {
            x: beaverFarPoint[0][1] - beaverWidth / 2,
            y: beaverFarPoint[0][2] - beaverHeight / 2
         };
         visualInfo.beaverClosePoint = {
            x: x - beaverWidth / 2,
            y: y - beaverHeight / 2
         };

         var arrowClosePoint = ["M", x, y];
         arrowClosePoint = Raphael.transformPath(arrowClosePoint, [
            "T", 0, - params.arrowDistance * scale,
            "R", angle, x, y
         ]);
         var arrowFarPoint = ["M", x, y];
         arrowFarPoint = Raphael.transformPath(arrowFarPoint, [
            "T", 0, - (params.arrowDistance + params.arrowLength) * scale,
            "R", angle, x, y
         ]);

         visualInfo.arrowFarPoint = {
            x: arrowFarPoint[0][1],
            y: arrowFarPoint[0][2]
         };
         visualInfo.arrowClosePoint = {
            x: arrowClosePoint[0][1],
            y: arrowClosePoint[0][2]
         };

         return [lidBase, lid];
      };

      this._onVertexClick = function(id) {
         var userSteps = answer.userVertexPairs.length;
         var optimal = data[level].optimal;
         if (userSteps >= optimal + 1) {
//            displayHelper.showPopupMessage(taskStrings.testLimit(userSteps), "blanket");
         }

         // If two vertices have been chosen, reset and choose this one as first.
         if(userPair.from && userPair.to) {
            this.clearChoices();
            this.setChosenVertex(id, "from");
            return;
         }

         // Clicking on the same vertex again unselects it.
         if(userPair.from === id) {
            this.clearChoices();
            return;
         }

         // Start a new pair.
         if(!userPair.from) {
            this.setChosenVertex(id, "from");
            return;
         }

         // Complete a pair.
         this.setChosenVertex(id, "to");
         
         var pairData = onUserPairChoice(userPair.from, userPair.to);
         if(!pairData.clear && graph.hasNeighbor(userPair.from, userPair.to)) {
            settings.onUserEdgeChoice(graph.getEdgesBetween(userPair.from, userPair.to)[0]);
         }
         this.simulate(pairData);
      };

      this.setChosenVertex = function(id, type) {
         userPair[type] = id;
         this.setVertexState(id, true);
         if(type === "from") {
            this.setBeaverVertex(id);
         }
      };

      this.setBeaverVertex = function(id) {
         var visualInfo = visualGraph.getVertexVisualInfo(id);
         var distance = params.beaverDistance * scale;
         images.beaver.attr(visualInfo.beaverFarPoint);
         images.beaver.show().toBack();
      };

      this.setArrowVertex = function(id, type) {
         var visualInfo = visualGraph.getVertexVisualInfo(id);
         var origin;
         var destination;
         if(type === "from") {
            origin = visualInfo.arrowFarPoint;
            destination = visualInfo.arrowClosePoint;
         }
         else {
            origin = visualInfo.arrowClosePoint;
            destination = visualInfo.arrowFarPoint;
         }
         
         beaverArrows[type] = paper.path([
            "M", origin.x, origin.y,
            "L", destination.x, destination.y
         ]).attr(params.arrowAttr);
      };

      this.setEdgeMark = function(id, type) {
         var edgeElement = visualGraph.getRaphaelsFromID(id)[0];
         var edgePath = edgeElement.attrs.path;
         var edgeLength = Raphael.getTotalLength(edgePath);
         var subpath = Raphael.getSubpath(edgePath, vertexRadius, edgeLength - vertexRadius);
         var attr;
         if(type === "clear") {
            attr = params.clearEdgeAttr;
         }
         else if(type === "found") {
            attr = params.foundEdgeAttr;
         }
         else {
            attr = params.obstructedEdgeAttr;
         }
         edgeMarks["background_" + id] = paper.path(subpath).attr(attr);
         
         var vertices = graph.getEdgeVertices(id);
         var visualInfo1 = visualGraph.getVertexVisualInfo(vertices[0]);
         var visualInfo2 = visualGraph.getVertexVisualInfo(vertices[1]);
         var centerX = (visualInfo1.x + visualInfo2.x) / 2;
         var centerY = (visualInfo1.y + visualInfo2.y) / 2;
         var tickPoints = params.tickPoints;
         var crossSize = params.crossSize;

         if(type === "found") {
            edgeMarks["tick_" + id] = paper.path([
               "M", centerX + tickPoints[0].x * scale, centerY + tickPoints[0].y * scale,
               "L", centerX + tickPoints[1].x * scale, centerY + tickPoints[1].y * scale,
               "L", centerX + tickPoints[2].x * scale, centerY + tickPoints[2].y * scale
            ]).attr(params.tickAttr);
         }
         else if(type === "clear") {
            edgeMarks["cross_" + id] = paper.path([
               "M", centerX - crossSize, centerY - crossSize,
               "L", centerX + crossSize, centerY + crossSize,
               "M", centerX - crossSize, centerY + crossSize,
               "L", centerX + crossSize, centerY - crossSize
            ]).attr(params.crossAttr);
         }
         else {
            edgeMarks["question_" + id] = paper.text(centerX, centerY, taskStrings.obstructedPathText).attr(params.edgeTextAttr);
         }
      };

      this.simulate = function(pairData) {
         subTask.simulationFactory.destroy("sim_" + settings.id);
         simulation = subTask.simulationFactory.create("sim_" + settings.id);

         var origin = userPair.from;
         var destination = userPair.to;
         if(!pairData.path) {
            destination = origin;
         }
         this.addBeaverEntry(true, origin, false);
         this.addBeaverEntry(false, destination, false);
         this.addBeaverEntry(true, destination, true);

         if(pairData.path) {
            this.addArrowEntry(userPair.from, "from");
            this.addArrowEntry(userPair.to, "to");
            this.addEdgeMarkEntry(pairData);
         }

         if(!pairData.clear && pairData.path && pairData.path.length == 1) {
            this.addSeedEntry(userPair.to);
         }

         if(settings.feedback) {
            this.addFeedbackEntry(pairData);
         }

         simulation.setAutoPlay(true);
         simulation.setExpedite(settings.expedite);
         simulation.play();
      };

      this.addBeaverEntry = function(isAnimation, vertexID, toFar) {
         var time;
         if(isAnimation) {
            time = params.animMoveTime;
         }
         else {
            time = params.animWaitTime;
         }

         var newPosition;
         var visualInfo = visualGraph.getVertexVisualInfo(vertexID);
         if(toFar) {
            newPosition = visualInfo.beaverFarPoint;
         }
         else {
            newPosition = visualInfo.beaverClosePoint;
         }

         simulation.addStepWithEntry({
            name: "beaver",
            action: {
               onExec: beaverMoveFunc,
               params: {
                  newPosition: newPosition,
                  isAnimation: isAnimation
               },
               duration: time,
               useTimeout: !isAnimation
            }
         });
      };

      this.addArrowEntry = function(id, type) {
         simulation.addStepWithEntry({
            name: "arrow",
            action: {
               onExec: arrowFunc,
               params: {
                  id: id,
                  type: type
               },
               duration: 0
            }
         });
      };

      this.addEdgeMarkEntry = function(pairData) {
         simulation.addStepWithEntry({
            name: "edge",
            action: {
               onExec: markEdgeFunc,
               params: pairData,
               duration: 0
            }
         });
      };

      this.addSeedEntry = function(vertex) {
         simulation.addStepWithEntry({
            name: "seeds",
            action: {
               onExec: seedFunc,
               params: {
                  id: vertex
               },
               duration: 0
            }
         });
      };

      this.addFeedbackEntry = function(pairData) {
         var success = false;
         var string;
         if(pairData.clear) {
            string = taskStrings.noSeeds;
         }
         else if(!pairData.path) {
            string = taskStrings.noPath;
         }
         else if(pairData.path.length === 1) {
            string = taskStrings.found;
            success = true;
         }
         else {
            string = taskStrings.seedsInPath(pairData.path.length);
         }

         simulation.addStepWithEntry({
            name: "feedback",
            action: {
               onExec: feedbackFunc,
               params: {
                  string: string,
                  success: success
               },
               duration: 0
            }
         });
      };

      function feedbackFunc(params, duration, callback) {
         showFeedback(params.string);
         setRestartConfirmation(!params.success);
         if(params.success) {
            self.disable();
            platform.validate("done");
         }
         callback();
      }

      function seedFunc(_params, duration, callback) {
         var visualInfo = visualGraph.getVertexVisualInfo(_params.id);
         var beaverFarPoint = visualInfo.beaverFarPoint;
         for(var iSeed in params.seedBeaverOffset) {
            seeds[iSeed] = paper.ellipse(
               beaverFarPoint.x + params.seedBeaverOffset[iSeed].x * scale,
               beaverFarPoint.y + params.seedBeaverOffset[iSeed].y * scale,
               params.seedRadii[0] * scale,
               params.seedRadii[1] * scale
            ).attr(params.seedAttr);
         }
         callback();
      }

      function markEdgeFunc(params, duration, callback) {
         if(params.path) {
            var type;
            if(params.clear) {
               type = "clear";
            }
            else if(params.path.length === 1) {
               type = "found";
            }
            else {
               type = "obstructed";
            }
            for(var iEdge in params.path) {
               self.setEdgeMark(params.path[iEdge], type);
            }
         }
         callback();
      }

      function arrowFunc(params, duration, callback) {
         self.setArrowVertex(params.id, params.type);
         callback();
      }

      function beaverMoveFunc(params, duration, callback) {
         if(params.isAnimation) {
            return images.beaver.animate(params.newPosition, duration, callback);
         }
         else {
            images.beaver.attr(params.newPosition);
            // When simulation is expediting and timeout is used, duration is omitted.
            if(duration === 0) {
               callback();
            }
         }
      }
      
      this.disable = function() {
         if(fuzzyClicker) {
            fuzzyClicker.setEnabled(false);
         }
      };

      this.remove = function() {
         this.disable();
         visualGraph.remove();
      };

      this.init();
   }

   // User has selected a pair. Run processPair and return the result (see below).
   function onUserPairChoice(vertex1, vertex2) {
      answer.userVertexPairs.push([vertex1, vertex2]);
      updateCounter();
      return processPair([vertex1, vertex2]);
   }

   /*
    * Process a pair of chosen vertices and update the data structures accordingly.
    * Return an object with the fields:
    * clear: boolean, whether or not there is a clear unobstructed path between the vertices.
    * path: an array of edge IDs describing a shortest path between the vertices, if it exists
    *       (an obstructed path is still considered a path). If there is no such path, this field
    *       is omitted.
    */
   function processPair(vertices) {
      var vertex1 = vertices[0];
      var vertex2 = vertices[1];
      var bfs = graph.bfs(vertex1);

      // Vertices are in different connected components.
      if(!bfs.parents[vertex2]) {
         return {
            clear: false
         };
      }

      // Get path (of edges) between the vertices.
      var path = [];
      var current = vertex2;
      while(bfs.parents[current]) {
         path.push(graph.getEdgesBetween(current, bfs.parents[current])[0]);
         current = bfs.parents[current];
      }
      
      // Count how many edges proven intact are in the path.
      var numProvenIntactPath = 0;
      var iEdge;
      for(iEdge in path) {
         if(provenIntact[path[iEdge]]) {
            numProvenIntactPath++;
         }
      }

      // If the number of edges not proven intact is less than half
      // of the total not proven intact, the path is clear.
      if(path.length - numProvenIntactPath <= (numEdges - numProvenIntact) / 2) {
         // Mark entire path as intact.
         for(iEdge in path) {
            setProvenIntact(path[iEdge]);
         }
         return {
            clear: true,
            path: path
         };
      }

      // Otherwise, the path is obstructed, and the complement of the graph is proven intact.
      var isInPath = {};
      for(iEdge in path) {
         isInPath[path[iEdge]] = true;
      }
      graph.forEachEdge(function(edgeID) {
         if(!isInPath[edgeID]) {
            setProvenIntact(edgeID);
         }
      });
      return {
         clear: false,
         path: path
      };
   }

   function setProvenIntact(edgeID) {
      if(provenIntact[edgeID]) {
         return;
      }
      provenIntact[edgeID] = true;
      numProvenIntact++;
   }

   function onUserEdgeChoice(edge) {
      answer.userEdge = edge;
   }

   function updateCounter() {
      $("#stepCounter").text(answer.userVertexPairs.length);
   }

   function showFeedback(string) {
      if(string === null || string === undefined) {
         string = "&nbsp;";
      }
      $("#feedback").html(string);
   }

   function setRestartConfirmation(confirm) {
      displayHelper.confirmRestartAll = confirm;
   }

   function getResultAndMessage() {
      if(!answer.userEdge) {
         return {
            successRate: 0,
            message: taskStrings.notFound
         };
      }
      if(provenIntact[answer.userEdge] || numProvenIntact < numEdges - 1) {
         return {
            successRate: 0,
            message: taskStrings.deductionError
         };
      }

      var userSteps = answer.userVertexPairs.length;
      var optimal = data[level].optimal;
      if(userSteps <= optimal) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }
      if(userSteps === optimal + 1) {
         return {
            successRate: 0.5,
            message: taskStrings.partial(userSteps, optimal, true)
         };
      }
      return {
         successRate: 0,
         message: taskStrings.partial(userSteps, optimal, false)
      };
   }
   
   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);

