function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         width: 380,
         height: 380,
         initialStr: '{"vertexVisualInfo":{"v_0":{"x":320,"y":192},"v_1":{"x":128,"y":256},"v_2":{"x":96,"y":64},"v_3":{"x":160,"y":160},"v_4":{"x":284,"y":278.87499237060547}},"edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_5":{},"e_3":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_1":{},"v_2":{},"v_3":{},"v_4":{}},"edgeInfo":{"e_0":{},"e_1":{},"e_2":{},"e_5":{},"e_3":{}},"edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_2":["v_0","v_2"],"e_5":["v_2","v_3"],"e_3":["v_3","v_4"]},"directed":false}}',
         targetStr: '{"vertexVisualInfo":{"v_0":{"x":192,"y":256},"v_1":{"x":64,"y":224},"v_2":{"x":160,"y":64},"v_3":{"x":288,"y":96},"v_5":{"x":295,"y":209.87499237060547}},"edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_5":{},"e_4":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_1":{},"v_2":{},"v_3":{},"v_5":{}},"edgeInfo":{"e_0":{},"e_1":{},"e_2":{},"e_5":{},"e_4":{}},"edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_2":["v_0","v_2"],"e_5":["v_2","v_3"],"e_4":["v_3","v_5"]},"directed":false}}'
      },
      medium: {
         width: 380,
         height: 380,
         initialStr: '{"vertexVisualInfo":{"v_0":{"x":51,"y":90},"v_1":{"x":209,"y":141},"v_2":{"x":169,"y":236},"v_4":{"x":313,"y":101},"v_5":{"x":320,"y":208},"v_3":{"x":56,"y":226.77778244018555},"v_6":{"x":133,"y":334.77777433395386},"v_7":{"x":137,"y":39.77777433395386},"v_8":{"x":261,"y":293.77777433395386}},"edgeVisualInfo":{"e_0":{},"e_1":{},"e_3":{},"e_4":{},"e_2":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_1":{},"v_2":{},"v_4":{},"v_5":{},"v_3":{},"v_6":{},"v_7":{},"v_8":{}},"edgeInfo":{"e_0":{},"e_1":{},"e_3":{},"e_4":{},"e_2":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{}},"edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_3":["v_1","v_4"],"e_4":["v_4","v_5"],"e_2":["v_0","v_2"],"e_5":["v_0","v_3"],"e_6":["v_1","v_7"],"e_7":["v_1","v_8"],"e_8":["v_8","v_5"],"e_9":["v_7","v_4"],"e_10":["v_2","v_6"],"e_11":["v_2","v_3"]},"directed":false}}',
         targetStr: '{"vertexVisualInfo":{"v_0":{"x":256,"y":240},"v_1":{"x":160,"y":192},"v_2":{"x":208,"y":96},"v_4":{"x":64,"y":192},"v_5":{"x":64,"y":288},"v_3":{"x":304,"y":144},"v_6":{"x":288,"y":80},"v_7":{"x":112,"y":128},"v_8":{"x":160,"y":288}},"edgeVisualInfo":{"e_0":{},"e_1":{},"e_3":{},"e_4":{},"e_2":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_1":{},"v_2":{},"v_4":{},"v_5":{},"v_3":{},"v_6":{},"v_7":{},"v_8":{}},"edgeInfo":{"e_0":{},"e_1":{},"e_3":{},"e_4":{},"e_2":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{}},"edgeVertices":{"e_0":["v_0","v_1"],"e_1":["v_1","v_2"],"e_3":["v_1","v_4"],"e_4":["v_4","v_5"],"e_2":["v_0","v_2"],"e_5":["v_0","v_3"],"e_6":["v_1","v_7"],"e_7":["v_1","v_8"],"e_8":["v_8","v_5"],"e_9":["v_7","v_4"],"e_10":["v_2","v_6"],"e_11":["v_2","v_3"]},"directed":false}}' 
      },
      hard: {
         width: 380,
         height: 480,
         initialStr: '{"vertexVisualInfo":{"v_0":{"x":112,"y":64},"v_1":{"x":208,"y":64},"v_4":{"x":32,"y":32},"v_5":{"x":288,"y":32},"v_6":{"x":208,"y":192},"v_7":{"x":208,"y":128},"v_9":{"x":112,"y":128},"v_10":{"x":112,"y":192},"v_11":{"x":32,"y":288},"v_13":{"x":288,"y":288},"v_14":{"x":208,"y":256},"v_15":{"x":112,"y":256}},"edgeVisualInfo":{"e_4":{},"e_5":{},"e_7":{},"e_10":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_21":{},"e_22":{},"e_24":{},"e_27":{},"e_1":{},"e_2":{},"e_18":{},"e_19":{},"e_23":{},"e_25":{},"e_3":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_1":{},"v_4":{},"v_5":{},"v_6":{},"v_7":{},"v_9":{},"v_10":{},"v_11":{},"v_13":{},"v_14":{},"v_15":{}},"edgeInfo":{"e_4":{},"e_5":{},"e_7":{},"e_10":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_21":{},"e_22":{},"e_24":{},"e_27":{},"e_1":{},"e_2":{},"e_18":{},"e_19":{},"e_23":{},"e_25":{},"e_3":{}},"edgeVertices":{"e_4":["v_7","v_6"],"e_5":["v_7","v_5"],"e_7":["v_0","v_1"],"e_10":["v_0","v_4"],"e_13":["v_4","v_11"],"e_14":["v_11","v_10"],"e_15":["v_9","v_10"],"e_16":["v_5","v_13"],"e_17":["v_13","v_14"],"e_21":["v_6","v_13"],"e_22":["v_5","v_4"],"e_24":["v_10","v_15"],"e_27":["v_11","v_13"],"e_1":["v_15","v_14"],"e_2":["v_7","v_1"],"e_18":["v_0","v_9"],"e_19":["v_6","v_14"],"e_23":["v_1","v_5"],"e_25":["v_15","v_11"],"e_3":["v_9","v_1"]},"directed":false}}',
         targetStr: '{"vertexVisualInfo":{"v_0":{"x":38,"y":188},"v_1":{"x":182,"y":204},"v_4":{"x":150,"y":284},"v_5":{"x":214,"y":284},"v_6":{"x":310,"y":316},"v_7":{"x":326.3298969072165,"y":185.36082474226805},"v_9":{"x":54,"y":316},"v_10":{"x":38,"y":444},"v_11":{"x":150,"y":348},"v_13":{"x":214,"y":348},"v_14":{"x":326,"y":444},"v_15":{"x":182,"y":428}},"edgeVisualInfo":{"e_4":{},"e_5":{},"e_7":{},"e_10":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_21":{},"e_22":{},"e_24":{},"e_27":{},"e_1":{},"e_2":{},"e_18":{},"e_19":{},"e_23":{},"e_25":{},"e_26":{}},"minGraph":{"vertexInfo":{"v_0":{},"v_1":{},"v_4":{},"v_5":{},"v_6":{},"v_7":{},"v_9":{},"v_10":{},"v_11":{},"v_13":{},"v_14":{},"v_15":{}},"edgeInfo":{"e_4":{},"e_5":{},"e_7":{},"e_10":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_21":{},"e_22":{},"e_24":{},"e_27":{},"e_1":{},"e_2":{},"e_18":{},"e_19":{},"e_23":{},"e_25":{},"e_26":{}},"edgeVertices":{"e_4":["v_7","v_6"],"e_5":["v_7","v_5"],"e_7":["v_0","v_1"],"e_10":["v_0","v_4"],"e_13":["v_4","v_11"],"e_14":["v_11","v_10"],"e_15":["v_9","v_10"],"e_16":["v_5","v_13"],"e_17":["v_13","v_14"],"e_21":["v_6","v_13"],"e_22":["v_5","v_4"],"e_24":["v_10","v_15"],"e_27":["v_11","v_13"],"e_1":["v_15","v_14"],"e_2":["v_7","v_1"],"e_18":["v_0","v_9"],"e_19":["v_6","v_14"],"e_23":["v_1","v_5"],"e_25":["v_15","v_11"],"e_26":["v_9","v_1"]},"directed":false}}' 
      }
   };

   var paperUser;
   var paperTarget;

   var graphUser;
   var graphTarget;

   var visualGraphUser;
   var visualGraphTarget;
   var visualGraphShadow;

   var graphDrawerUser;
   var graphDrawerTarget;
   var graphDrawerShadow;

   var targetVertices;
   var userVertices;
   var targetPositions;
   var userDefaultPositions;
   var dragLimits;
   var dragLimitsPad = 2;

   var vertexDragger;
   var graphMouse;
   var snapThreshold = 20;
   var overlapThreshold = 10;
   var kickSize = 20;
   var highlightedEdge;

   var graphParams = {
      borderAttr: {
         "stroke-width": 1
      },
      user: {
         circleAttr: {
            r: 20,
            stroke: "black",
            "stroke-width": 0,
            fill: "#0000cc"
         },
         lineAttr: {
            "stroke-width": 3,
            stroke: "black"
         },
         highlightedLineAttr: {
            "stroke-width": 3,
            stroke: "red"
         }
      },
      target: {
         circleAttr: {
            r: 20,
            stroke: "black",
            "stroke-width": 0,
            fill: "#cc0000"
         },
         lineAttr: {
            "stroke-width": 3
         }
      },
      shadow: {
         circleAttr: {
            r: 20,
            stroke: "#df8282",
            "stroke-width": 1, 
             "stroke-dasharray":"--",
            fill: "#eee5e5"
         },
         lineAttr: {
            "stroke-width": 3,
            stroke: "#b2b2b2",
            opacity: 0
         }
      }
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      visualGraphTarget = VisualGraph.fromJSON(data[level].targetStr, "visualTarget");
      graphTarget = visualGraphTarget.getGraph();
      targetVertices = graphTarget.getAllVertices();
      targetPositions = getAllPositions(graphTarget, visualGraphTarget);
      visualGraphUser = VisualGraph.fromJSON(data[level].initialStr, "visualUser");
      graphUser = visualGraphUser.getGraph();
      userVertices = graphUser.getAllVertices();
      userDefaultPositions = getAllPositions(graphUser, visualGraphUser);

      displayHelper.hideValidateButton = true;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      for(var iVertex in userVertices) {
         var position = answer[iVertex];
         var info = visualGraphUser.getVertexVisualInfo(userVertices[iVertex]);
         info.x = position.x;
         info.y = position.y;
      }
   };

   subTask.resetDisplay = function() {
      initPaper();
      initHandlers();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return userDefaultPositions;
   };

   subTask.unloadLevel = function(callback) {
      if (vertexDragger) {
         vertexDragger.setEnabled(false);
         visualGraphUser.remove();
      }
      $("#execute").unbind("click");
      callback();
   };

   function initPaper() {
      paperUser = subTask.raphaelFactory.create("animUser", "animUser", data[level].width, data[level].height);
      paperUser.rect(0, 0, data[level].width, data[level].height).attr(graphParams.borderAttr);
      graphDrawerUser = new SimpleGraphDrawer(graphParams.user.circleAttr, graphParams.user.lineAttr);
      visualGraphUser.setDrawer(graphDrawerUser);
      visualGraphUser.setPaper(paperUser);
      visualGraphUser.redraw();

      graphDrawerShadow = new SimpleGraphDrawer(graphParams.shadow.circleAttr, graphParams.shadow.lineAttr);
      visualGraphShadow = VisualGraph.fromJSON(data[level].targetStr, "shadow", paperUser, graphTarget, graphDrawerShadow, true);

      graphUser.forEachEdge(function(id) {
         visualGraphUser.elementToFront(id);
      });
      graphUser.forEachVertex(function(id) {
         visualGraphUser.elementToFront(id);
      });

      paperTarget = subTask.raphaelFactory.create("animTarget", "animTarget", data[level].width, data[level].height);
      paperTarget.rect(0, 0, data[level].width, data[level].height).attr(graphParams.borderAttr);
      graphDrawerTarget = new SimpleGraphDrawer(graphParams.target.circleAttr, graphParams.target.lineAttr);
      visualGraphTarget.setDrawer(graphDrawerTarget);
      visualGraphTarget.setPaper(paperTarget);
      visualGraphTarget.redraw();

      dragLimits = {
         minX: graphParams.user.circleAttr.r + dragLimitsPad,
         maxX: data[level].width - graphParams.user.circleAttr.r - dragLimitsPad,
         minY: graphParams.user.circleAttr.r + dragLimitsPad,
         maxY: data[level].height - graphParams.user.circleAttr.r - dragLimitsPad
      };

      graphMouse = new GraphMouse("mouse", graphUser, visualGraphUser);
      vertexDragger = new VertexDragger({
         id: "dragger",
         visualGraph: visualGraphUser,
         graphMouse: graphMouse,
         snapThreshold: snapThreshold,
         snapPositions: targetPositions,
         dragLimits: dragLimits,
         callback: onVisualChange,
         enabled: true
      });
   }

   function initHandlers() {
      $("#execute").unbind("click");
      $("#execute").click(clickExecute);
      $("#animUser").unbind("mousedown");
      $("#animUser").mousedown(unhighlightEdge);
   }

   function clickExecute() {
      var result = checkIsomorphism();
      if(result.success) {
         platform.validate("done");
      }
      else {
         if(result.param === "edge") {
            highlightEdge(result.id);
         }
         platform.validate("stay");
      }
   }

   function unhighlightEdge() {
      if(highlightedEdge) {
         visualGraphUser.getRaphaelsFromID(highlightedEdge)[0].attr(graphParams.user.lineAttr);
         highlightedEdge = null;
      }
   }

   function highlightEdge(id) {
      unhighlightEdge();
      highlightedEdge = id;
      visualGraphUser.getRaphaelsFromID(highlightedEdge)[0].attr(graphParams.user.highlightedLineAttr);
   }

   function onVisualChange(id) {
      unhighlightEdge();
      var position = graphDrawerUser.getVertexPosition(id);
      for(var iVertex in userVertices) {
         var otherID = userVertices[iVertex];
         if(id === otherID) {
            continue;
         }
         var otherPosition = graphDrawerUser.getVertexPosition(otherID);
         if(checkOverlap(position, otherPosition)) {
            kickVertex(id, position);
         }
      }
      answer = getAllPositions(graphUser, visualGraphUser);
   }

   function getAllPositions(graph, visualGraph) {
      var vertices = graph.getAllVertices();
      return $.map(vertices, function(id) {
         return $.extend(true, {}, visualGraph.getVertexVisualInfo(id));
      });
   }

   function getRandomInt(from, to) {
      return Math.round(from + (to - from) * Math.random());
   }

   function kickVertex(id, position) {
      var x = position.x + getRandomInt(-kickSize, kickSize);
      var y = position.y + getRandomInt(-kickSize, kickSize);
      x = Math.max(dragLimits.minX, Math.min(dragLimits.maxX, x));
      y = Math.max(dragLimits.minY, Math.min(dragLimits.maxY, y));
      graphDrawerUser.moveVertex(id, x, y);
   }

   function checkOverlap(position1, position2) {
      return (position1.x - position2.x) * (position1.x - position2.x) + (position1.y - position2.y) * (position1.y - position2.y) <= overlapThreshold * overlapThreshold;
   }

   function checkIsomorphism() {
      // Store all target and all user vertex positions in objects, for fast checking.
      var targetPositionsObject = positionArrayToObject(targetPositions);
      var userPositionsObject = positionArrayToObject(answer);

      // Check whether any vertices are not in place.
      for(var targetPosition in targetPositionsObject) {
         if(userPositionsObject[targetPosition] === undefined) {
            return {
               success: false,
               param: "vertex"
            };
         }
      }

      // Map each user vertex to the corresponding target vertex.
      var userIsomorphism = {};
      for(var userPosition in userPositionsObject)  {
         var userIndex = userPositionsObject[userPosition];
         var targetIndex = targetPositionsObject[userPosition];
         var userID = userVertices[userIndex];
         var targetID = targetVertices[targetIndex];
         userIsomorphism[userID] = targetID;
      }

      // Check that every edge in the user's graph appears in the target.
      var userEdges = graphUser.getAllEdges();
      for(var iEdge in userEdges) {
         var userEdgeID = userEdges[iEdge];
         var userEdgeVertices = graphUser.getEdgeVertices(userEdgeID);
         var userVertex1 = userEdgeVertices[0];
         var userVertex2 = userEdgeVertices[1];
         var targetVertex1 = userIsomorphism[userVertex1];
         var targetVertex2 = userIsomorphism[userVertex2];
         if(!graphTarget.hasNeighbor(targetVertex1, targetVertex2)) {
            return {
               success: false,
               param: "edge",
               id: userEdgeID
            };
         }
      }
      return {
         success: true
      };
   }

   function positionArrayToObject(positions) {
      // Take an array of positions and return an object that maps positions to their indices.
      var result = {};
      $.each(positions, function(iPosition, position) {
         result[positionToString(position)] = iPosition;
      });
      return result;
   }

   function positionToString(position) {
      return position.x + "_" + position.y;
   }

   function getResultAndMessage() {
      var result = checkIsomorphism();
      if(result.success) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }
      if(result.param === "vertex") {
         return {
            successRate: 0,
            message: taskStrings.vertexError
         };
      }
      return {
         successRate: 0,
         message: taskStrings.edgeError
      };
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
