function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         grid: [
            ['B', '.', '.'],
            ['O', '.', '.'],
            ['.', 'O', 'O']
         ],
         visualGraphStr: '{"vertexVisualInfo":{},"edgeVisualInfo":{},"minGraph":{"vertexInfo":{},"edgeInfo":{},"edgeVertices":{},"directed":false}}', // TODO: factorize with others
         allowDragging: true
      },
      medium: {
         grid: [
            ['B', 'O', '.'],
            ['O', 'O', '.'],
            ['.', 'O', '.']
         ],
         visualGraphStr: '{"vertexVisualInfo":{},"edgeVisualInfo":{},"minGraph":{"vertexInfo":{},"edgeInfo":{},"edgeVertices":{},"directed":false}}',
         allowDragging: true
      },
      hard: {
         grid: [
            ['B', 'O', '.'],
            ['B', '.', '.'],
            ['O', '.', '.']
         ],
         visualGraphStr: '{"vertexVisualInfo":{},"edgeVisualInfo":{},"minGraph":{"vertexInfo":{},"edgeInfo":{},"edgeVertices":{},"directed":false}}',
         allowDragging: true
      }
   };

   var rows;
   var cols;
   var grid;

   var paperConfig;
   var paperGraph;
   var paperGraphBorder;
   var graph;

   var dragAndDrop;
   var dragContainer;

   var initialConfig;
   var validPositions;
   var positionToIndex;
   var numBalls;
   var ballShadow;
   var configPlaces;
   var droppingOnBall;

   var visualGraph;
   var graphDrawer;
   var graphMouse;
   var vertexConnector;
   var fuzzyRemover;

   var visualConfig;
   
   var fuzzyVertexThreshold = 0;
   var fuzzyEdgeThreshold = 20;
   var dragThreshold = 5;
   var dragLimits;
   var vertexRadius;
   var minimalDropDistance = { easy: 95, medium: 80, hard: 80 };
   var targetGraph;

   var graphParams;
   var radius = { easy: 40, medium: 35, hard: 35 };
   var rectSide = { easy: 80, medium: 67, hard: 67 };
   var graphParamsLevels = {
      circleAttr: {
         r: radius,
         stroke: "black",
         "stroke-width": 1,
         fill: "gray",
         opacity: 0
      },
      squareAttr: {
         fill: "#222222",
         stroke: "white",
         "stroke-width": 2
      },
      lineAttr: {
         "stroke-width": 9
      },
      highlightCircle: {
         r: radius,
         stroke: "red",
         "stroke-width": 3,
         fill: "gray"
      },
      highlightSquare: {
         stroke: "red",
         "stroke-width": 7
      },
      gridOffset: {
         easy: {x: 0, y: 0},
         medium: {x: 0, y: 3},
         hard: {x: 0, y: 0}
      }
   };

   var paperGraphParams = {
      width: 700,
      height: 450,
      borderAttr: {
         "stroke-width": 3,
         fill: "#9999aa"
      }
   };

   var paperConfigParams = {
      xPad: 20,
      yPad: 20,
      borderAttr: {
         "stroke-width": 3,
         "fill": "#222222"
      }
   };

   var cellParams = {
      width: 76,
      height: 72,
      midRatio: 0.5,
      xJump: 76,
      yJump: 54,
      oddXOffset: 38,
      ballRadius: 24,
      attrs: {
         big: {
            scale: 0.8,
            line: {
               "stroke-width": 3,
               "fill": "white"
            },
            ball: {
               "stroke-width": 3,
               "fill": "red"
            }
         },
         small: {
            scale: 0.3,
            line: {
               "stroke-width": 1,
               "fill": "white"
            },
            ball: {
               "stroke-width": 1,
               "fill": "red"
            }
         },
         placeHolder: {
            scale: 0.8,
            "stroke" : "yellow",
            "stroke-width" : "2",
            "stroke-dasharray": "-"
         }
      },
      shadowAttr: {
         opacity: 0.2
      }
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      grid = data[level].grid;
      rows = grid.length;
      cols = grid[0].length;
      graphParams = extractLevelSpecific(graphParamsLevels, level);
      initConfig();
      initTargetGraph();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      resetGraph();
   };

   subTask.resetDisplay = function() {
      $(".hexCount").text(validPositions.length);
      initPaperConfig();
      initPaperGraph();
      initHandlers();
      showMessage(null);
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return {
         visualGraphStr: data[level].visualGraphStr,
         config: $.extend(true, [], initialConfig)
      };
   };

   subTask.unloadLevel = function(callback) {
      if(dragAndDrop) {
         dragAndDrop.disable();
      }
      if (visualGraph) {
         vertexConnector.setEnabled(false);
         if(fuzzyRemover) {
            fuzzyRemover.setEnabled(false);
         }
         visualGraph.remove();
      }
      $("#addSituation").unbind("click");
      callback();
   };

   function initConfig() {
      validPositions = [];
      initialConfig = [];
      for(var row = 0; row < rows; row++) {
         for(var col = 0; col < cols; col++) {
            if(grid[row][col] === 'B') {
               initialConfig.push({row: row, col: col});
            }
            if(grid[row][col] !== '.') {
               validPositions.push({row: row, col: col});
            }
         }
      }
      numBalls = initialConfig.length;

      positionToIndex = {};
      for(var iPosition = 0; iPosition < validPositions.length; iPosition++) {
         var currentRow = validPositions[iPosition].row;
         var currentCol = validPositions[iPosition].col;
         if(!positionToIndex[currentRow]) {
            positionToIndex[currentRow] = {};
         }
         positionToIndex[currentRow][currentCol] = iPosition;
      }
   }

   function initTargetGraph() {
      if(data[level].target) {
         return;
      }

      targetGraph = new Graph(false);

      // Generate all vertices recursively.
      function recurse(config, index) {
         if(config.length === numBalls) {
            targetGraph.addVertex(configToString(config));
         }
         for(var next = index; next < validPositions.length; next++) {
            config.push(validPositions[next]);
            recurse(config, next + 1);
            config.pop();
         }
      }

      recurse([], 0);

      // Find all edges.
      targetGraph.forEachVertex(function(id) {
         var neighbors = getConfigNeighbors(configFromString(id));
         for(var iNeighbor in neighbors) {
            var neighborID = configToString(neighbors[iNeighbor]);
            var edgeID = vertexPairToString(id, neighborID);
            if(!targetGraph.isEdge(edgeID)) {
               targetGraph.addEdge(edgeID, id, neighborID);
            }
         }
      });

      data[level].target = targetGraph;
   }

   function resetGraph() {
      if(answer.visualGraphStr) {
         graph = Graph.fromMinimized(JSON.parse(answer.visualGraphStr).minGraph);
      }
      else {
         graph = new Graph(false);
      }
   }

   function initHandlers() {
      $("#addSituation").unbind("click");
      $("#addSituation").click(clickAdd);
   }

   function initPaperConfig() {
      visualConfig = new VisualConfig([], cellParams.attrs.big);
      var width = visualConfig.getWidth() + 2 * paperConfigParams.xPad;
      var height = visualConfig.getHeight() + 2 * paperConfigParams.yPad;
      paperConfig = subTask.raphaelFactory.create("anim_config", "anim_config", width, height);
      paperConfig.rect(0, 0, width, height).attr(paperConfigParams.borderAttr);
      visualConfig.draw(paperConfig, width / 2, height / 2);
      visualConfig.onClick(showDragError);

      initDragAndDrop();
      initDragContainer();
   }

   function initDragAndDrop() {
      dragAndDrop = DragAndDropSystem({
         paper: paperConfig,
         actionIfDropped: actionIfDropped,
         actionIfEjected: actionIfEjected,
         drop: onDrop
      });

      configPlaces = visualConfig.getValidPlaces();
      dragContainer = dragAndDrop.addContainer({
         ident: "cells",
         dropMode: "replace",
         cx: 0,
         cy: 0,
         nbPlaces: configPlaces.length,
         places: configPlaces,
         placeBackgroundArray: []
      });

      /* 
       * This is a dirty trick to get a hexagon placeholder in drag and drop library.
       * The library creates a "container.placeHolder" object, which is a "component" object
       * (defined in the library).
       * 
       * A component is a custom implementation of a Raphael-element-container (like set),
       * with several auxiliary methods.
       * 
       * The only such method actually used for "container.placeHolder" is "placeAt", so we define it here.
       */
      var placeHolderElement = drawCell(paperConfig, 0, 0, cellParams.attrs.placeHolder.scale * cellParams.width, cellParams.attrs.placeHolder.scale * cellParams.height, cellParams.attrs.placeHolder).hide();
      var placeHolderPath = placeHolderElement.attrs.path;
      placeHolderElement.placeAt = function(centerX, centerY) {
         placeHolderElement.attr({
            path: Raphael.transformPath(placeHolderPath, ["T", centerX, centerY])
         });
      };
      dragContainer.placeHolder = placeHolderElement;
      /* End of trick */
   }

   function initDragContainer() {
      for(var iBall in answer.config) {
         var ballPosition = answer.config[iBall];
         var positionIndex = positionToIndex[ballPosition.row][ballPosition.col];
         var ball = drawBall(paperConfig, 0, 0, cellParams.attrs.big.scale * cellParams.ballRadius, cellParams.attrs.big.ball);
         ball.mouseup(showDragError);
         dragAndDrop.insertObjects("cells", positionIndex, [
            {
               ident: iBall,
               elements: [ball]
            }
         ]);
      }
   }

   function showDragError() {
      showMessage(taskStrings.dragError);
   }

   function initPaperGraph() {
      paperGraph = subTask.raphaelFactory.create("anim_graph", "anim_graph", paperGraphParams.width, paperGraphParams.height);
      paperGraphBorder = paperGraph.rect(0, 0, paperGraphParams.width, paperGraphParams.height).attr(paperGraphParams.borderAttr);

      graphDrawer = new SimpleGraphDrawer(graphParams.circleAttr, graphParams.lineAttr, vertexDrawer, true, null);

      if(answer.visualGraphStr) {
         visualGraph = VisualGraph.fromJSON(answer.visualGraphStr, "visual_graph", paperGraph, graph, graphDrawer, true);
      }
      else {
         visualGraph = new VisualGraph("visual_graph", paperGraph, graph, graphDrawer, true);
      }

      graphMouse = new GraphMouse("mouse", graph, visualGraph);
      vertexRadius = graphParams.circleAttr.r;
      dragLimits = {
         minX: vertexRadius,
         maxX: paperGraphParams.width - vertexRadius,
         minY: vertexRadius,
         maxY: paperGraphParams.height - vertexRadius
      };

      if(data[level].allowDragging) {
         vertexConnector = new VertexDragAndConnect({
            id: "connector",
            paperElementID: "anim_graph",
            paper: paperGraph,
            graph: graph,
            visualGraph: visualGraph,
            graphMouse: graphMouse,
            onDragEnd: onDragEnd,
            onVertexSelect: onVertexSelect,
            onPairSelect: onPairSelect,
            onEdgeSelect: deleteEdge,
            vertexThreshold: fuzzyVertexThreshold,
            edgeThreshold: fuzzyEdgeThreshold,
            dragThreshold: dragThreshold,
            dragLimits: dragLimits,
            snapToLastGoodPosition: true,
            isGoodPosition: isGoodPosition,
            enabled: true
         });
         fuzzyRemover = null;
      }
      else {
         vertexConnector = new EdgeCreator("connector", "anim_graph", paperGraph, graph, visualGraph, graphMouse, onVertexSelect, onPairSelect, true);
         fuzzyRemover = new FuzzyRemover("fuzzyRemover", "anim_graph", paperGraph, graph, visualGraph, null, false, true, fuzzyVertexThreshold, fuzzyEdgeThreshold, true);
      }

      graph.addPostListener("answerUpdater", answerUpdater, 10000);
      paperGraphBorder.toBack();
   }

   var answerUpdater = {
      addVertex: onVisualGraphChange,
      addEdge: onVisualGraphChange,
      removeVertex: onVisualGraphChange,
      removeEdge: onVisualGraphChange
   };

   function VisualConfig(config, attrs) {
      var self = this;

      this.init = function() {
         this.cellWidth = attrs.scale * cellParams.width;
         this.cellHeight = attrs.scale * cellParams.height;
         this.xJump = attrs.scale * cellParams.xJump;
         this.yJump = attrs.scale * cellParams.yJump;
         this.oddXOffset = attrs.scale * cellParams.oddXOffset;
         this.ballRadius = attrs.scale * cellParams.ballRadius;
         this.height = (rows - 1) * this.yJump + this.cellHeight;
         this.calculateWidth();
         
      };

      this.calculateWidth = function() {
         this.width = 0;
         for(var row = 0; row < rows; row++) {
            this.width = Math.max(this.width, this.calculateRowWidth(row));
         }
      };

      this.calculateRowWidth = function(row) {
         // The rightmost cell determines the width.
         var result;
         for(var col = cols - 1; col >= 0; col--) {
            if(grid[row][col] !== '.') {
               result = col * this.xJump + this.cellWidth;
               break;
            }
         }

         // This row has no cells.
         if(!result) {
            return 0;
         }

         // Odd rows are given an offset.
         if(row % 2 === 1) {
            result += this.oddXOffset;
         }
         return result;
      };

      this.getWidth = function() {
         return this.width;
      };

      this.getHeight = function() {
         return this.height;
      };

      this.draw = function(paper, centerX, centerY) {
         this.paper = paper;
         this.centerX = centerX;
         this.centerY = centerY;
         this.leftX = centerX - this.width / 2;
         this.topY = centerY - this.height / 2;
         this.elements = {
            cells: [],
            balls: []
         };

         for(var row = 0; row < rows; row++) {
            for(var col = 0; col < cols; col++) {
               if(grid[row][col] === '.') {
                  continue;
               }
               var center = this.getCellCenter(row, col);
               var cell = drawCell(paper, center.x, center.y, this.cellWidth, this.cellHeight, attrs.line);
               this.elements.cells.push(cell);
            }
         }

         for(var iBall = 0; iBall < config.length; iBall++) {
            var ballCenter = this.getCellCenter(config[iBall].row, config[iBall].col);
            var ball = drawBall(paper, ballCenter.x, ballCenter.y, this.ballRadius, attrs.ball);
            this.elements.balls.push(ball);
         }
      };

      this.getCellCenter = function(row, col) {
         var leftX = this.leftX + (col * this.xJump);
         var topY = this.topY + (row * this.yJump);

         // Hexagon rows shift alternately.
         if(row % 2 === 1) {
            leftX += this.oddXOffset;
         }

         return {
            x: leftX + this.cellWidth / 2,
            y: topY + this.cellHeight / 2
         };
      };

      this.getValidPlaces = function() {
         var result = [];
         for(var iPosition = 0; iPosition < validPositions.length; iPosition++) {
            var position = validPositions[iPosition];
            var center = self.getCellCenter(position.row, position.col);
            result.push([center.x, center.y]);
         }
         return result;
      };

      this.getRaphaels = function() {
         return this.elements.cells.concat(this.elements.balls);
      };

      this.onClick = function(handler) {
         for(var iCell in this.elements.cells) {
            this.elements.cells[iCell].click(handler);
         }
      };

      this.init();
   }

   function drawCell(paper, centerX, centerY, width, height, attr) {
      var leftX = centerX - width / 2;
      var rightX = centerX + width / 2;
      var topY = centerY - height / 2;
      var bottomY = centerY + height / 2;
      //return paper.rect(leftX, topY, rightX, bottomY).attr(attr);
      var midHigh = centerY - (cellParams.midRatio / 2) * height;
      var midLow = centerY + (cellParams.midRatio / 2) * height;
      return paper.path([
         "M",
         centerX, topY,
         "L",
         rightX, midHigh,
         "V",
         midLow,
         "L",
         centerX, bottomY,
         "L",
         leftX, midLow,
         "V",
         midHigh,
         "Z"
      ]).attr(attr);
   }

   function drawBall(paper, centerX, centerY, radius, attr) {
      return paper.circle(centerX, centerY, radius).attr(attr);
   }

   function drawShadowBall(index) {
      var place = configPlaces[index];
      ballShadow = drawBall(paperConfig, place[0], place[1], cellParams.attrs.big.scale * cellParams.ballRadius, cellParams.attrs.big.ball);
      ballShadow.attr(cellParams.shadowAttr);
   }

   function actionIfDropped(srcCont, srcPos, dstCont, dstPos, dropType) {
      // If we are dragging, draw (once) a copy of the ball in the original location.
      if(!ballShadow) {
         drawShadowBall(srcPos);
      }

      // We will set this to true if overlap is detected.
      droppingOnBall = false;

      // Allow ejecting the ball. This causes it to be re-inserted, in actionIfEjected below.
      if(dstCont === null) {
         return true;
      }

      // Allow dropping back in place.
      if(srcPos === dstPos) {
         return true;
      }

      // Don't allow dropping on non-neighbors.
      if(!isPositionNeighbor(validPositions[srcPos], validPositions[dstPos])) {
         return false;
      }

      // If a ball exists here, the action is to put the ball back in the original cell.
      // We set droppingOnBall to true, so that onDrop will be able to show the relevant error message.
      var contents = dragAndDrop.getObjects("cells");
      if(contents[dstPos]) {
         droppingOnBall = true;
         return DragAndDropSystem.action("cells", srcPos, "insert");
      }
      return true;
   }

   function actionIfEjected(refElement, srcCont, srcPos) {
      // The ball has been ejected, we show an error and re-insert.
      return DragAndDropSystem.action("cells", srcPos, "insert");
   }

   function onDrop(srcContainerID, srcPos, dstContainerID, dstPos, dropType) {
      if(ballShadow) {
         ballShadow.remove();
         ballShadow = null;
      }
      updateUserConfig();
      
      // When the ball is re-inserted after ejection, the source container is
      // "temporaryContainer" and the destination is "cells".
      if (srcContainerID !== "cells") {
         showMessage(taskStrings.wrongCell);
      } else if(droppingOnBall) {
         showMessage(taskStrings.droppingOnBall);
      } else {
         showMessage(null);
      }
   }

   function onDragEnd(id, isSnappedToGoodPosition) {
      onVisualGraphChange();
   }

   // A photo position is good if it's not too close to another.
   // The distance is: max(|dx|,|dy|).
   function isGoodPosition(originalID, position) {
      var result = true;
      graph.forEachVertex(function(id) {
         if(!result || id === originalID) {
            return;
         }
         var info = visualGraph.getVertexVisualInfo(id);
         var distance = Math.max(Math.abs(info.x - position.x), Math.abs(info.y - position.y));
         if(distance < minimalDropDistance[level]) {
            result = false;
         }
      });
      return result;
   }

   function updateUserConfig() {
      var contents = dragAndDrop.getObjects("cells");
      answer.config = [];
      for(var index = 0; index < contents.length; index++) {
         if(contents[index]) {
            answer.config.push(validPositions[index]);
         }
      }
   }

   function isValidPosition(position) {
      return position.row < rows && position.row >= 0 &&
             position.col < cols && position.col >= 0 &&
             grid[position.row][position.col] !== '.';
   }

   function isPositionNeighbor(position1, position2) {
      if(!isValidPosition(position1) || !isValidPosition(position2)) {
         return false;
      }

      var row1 = position1.row;
      var col1 = position1.col;
      var row2 = position2.row;
      var col2 = position2.col;

      // Same row - must be adjacent cols.
      if(row1 === row2) {
         return Math.abs(col1 - col2) === 1;
      }

      // Must be adjacent rows.
      if(Math.abs(row1 - row2) !== 1) {
         return false;
      }

      // Same col means they are adjacent.
      if(col1 === col2) {
         return true;
      }

      // Diagonals - on even rows (0-based), hexagon adjacencies go up/down and left.
      if(row1 % 2 === 0) {
         return col2 === col1 - 1;
      }

      // On odd rows, they go up/down and right.
      return col2 === col1 + 1;
   }

   function getPositionNeighbors(position) {
      var result = [];
      for(var dRow = -1; dRow <= 1; dRow++) {
         for(var dCol = -1; dCol <= 1; dCol++) {
            var neighbor = {
               row: position.row + dRow,
               col: position.col + dCol
            };
            if(isPositionNeighbor(position, neighbor)) {
               result.push(neighbor);
            }
         }
      }
      return result;
   }

   function clickAdd() {
      var id = configToString(answer.config);
      if(graph.getVerticesCount() === targetGraph.getVerticesCount()) {
         showMessage(taskStrings.needEdges);
         return;
      }
      if(graph.isVertex(id)) {
         showMessage(taskStrings.vertexExists);
         return;
      }

      var position = findNewVertexPosition();
      graph.addVertex(id);
      graphDrawer.moveVertex(id, position.x, position.y);
      onVisualGraphChange();

      if(graph.getVerticesCount() === targetGraph.getVerticesCount()) {
         showMessage(taskStrings.needEdges);
      } else {
         showMessage(taskStrings.vertexAdded);
      }
   }

   function findNewVertexPosition() {
      // Try to find a position that isn't too close to any existing vertex.
      var positions = [];
      graph.forEachVertex(function(id) {
         positions.push(graphDrawer.getVertexPosition(id));
      });

      var generator = new RandomGenerator(1);
      var bestPosition;
      var bestDistance = 0;

      // Try 100 times, then settle for best found.
      for(var attempt = 0; attempt < 100; attempt++) {
         position = {
            x: generator.nextInt(dragLimits.minX, dragLimits.maxX),
            y: generator.nextInt(dragLimits.minY, dragLimits.maxY)
         };
         var distance = Infinity;

         // Find the minimal distance to a vertex. Distance is max(|dx|,|dy|).
         for(var iVertex in positions) {
            distance = Math.min(distance, Math.max(Math.abs(position.x - positions[iVertex].x), Math.abs(position.y - positions[iVertex].y)));
         }

         // If the minimal distance is big enough, this is a good position.
         if(distance >= minimalDropDistance[level]) {
            bestPosition = position;
            break;
         }

         // Record this position if it's the best so far.
         if(distance > bestDistance) {
            bestDistance = distance;
            bestPosition = position;
         }
      }

      return bestPosition;
   }

   function vertexDrawer(id, info, centerX, centerY) {
      var result = [];
      var side = rectSide[level];
      var rect = paperGraph.rect(centerX - side / 2, centerY - side / 2, side, side).attr(graphParams.squareAttr);
      result.push(rect);

      var config = configFromString(id);
      var visualConfig = new VisualConfig(config, cellParams.attrs.small);
      visualConfig.draw(paperGraph, centerX + graphParams.gridOffset.x, centerY + graphParams.gridOffset.y);
      result = result.concat(visualConfig.getRaphaels());

      return result;
   }

   function onVisualGraphChange() {
      showMessage(null);
      answer.visualGraphStr = visualGraph.toJSON();
   }

   function onVertexSelect(id, selected, pairCompleted) {
      if(!pairCompleted) {
         /*
          * If pairCompleted is true, this means that onPairSelect
          * has been called, which handled any feedback message necessary
          * (if an edge has been added, then onVisualGraphChange was invoked,
          * and if not, then a suitable feedback message was displayed).
          * Otherwise, the feedback should be reset.
          */
         showMessage(null);
      }
      var attr;
      if(selected) {
         attr = graphParams.highlightSquare;
      }
      else {
         attr = graphParams.squareAttr;
      }
      visualGraph.getRaphaelsFromID(id)[1].attr(attr);
   }

   function onPairSelect(id1, id2) {
      var id = vertexPairToString(id1, id2);
      if(graph.isEdge(id)) {
         showMessage(taskStrings.edgeExists);
         return;
      }
      graph.addEdge(id, id1, id2);
      paperGraphBorder.toBack();
   }

   function deleteEdge(id) {
      showMessage(null);
      graph.removeEdge(id);
   }

   function getConfigNeighbors(config) {
      // Remember which positions are occupied.
      var configPositionObj = {};
      for(var iPosition in config) {
         configPositionObj[positionToString(config[iPosition])] = true;
      }

      var result = [];

      /*
       * Each neighbor of each ball position contributes a neighboring configuration.
       * We ignore neighboring positions that overlap other balls.
       */
      for(var iBall = 0; iBall < config.length; iBall++) {
         var position = config[iBall];
         var positionNeighbors = getPositionNeighbors(position);
         for(var iNeighbor in positionNeighbors) {
            var neighbor = positionNeighbors[iNeighbor];
            var neighborString = positionToString(neighbor);
            if(configPositionObj[neighborString]) {
               continue;
            }
            var configCopy = $.extend(true, [], config);
            configCopy[iBall] = neighbor;
            result.push(configCopy);
         }
      }
      return result;
   }

   function vertexPairToString(id1, id2) {
      // We sort the array, because the edge direction is not distinguished.
      var ids = [id1, id2];
      ids.sort();
      return ids.join(" ");
   }

   function configToString(config) {
      // We sort the array, because the balls are not distinguished.
      var result = $.map(config, positionToString);
      result.sort();
      return result.join("_");
   }

   function positionToString(position) {
      return position.row + "," + position.col;
   }

   function positionFromString(string) {
      var parts = string.split(",");
      return {
         row: parseInt(parts[0]),
         col: parseInt(parts[1])
      };
   }

   function configFromString(string) {
      var parts = string.split("_");
      return $.map(parts, positionFromString);
   }

   function showMessage(string) {
      if(string === null || string === undefined || string === "") {
         string = "&nbsp;";
      }
      $("#messageConfig").html(string);
   }

   function checkUser(schoolArray, userArray, missingMessage, wrongMessage, emptyMessage) {
      // Check that the user's array is identical to the school array.
      // To display helpful errors, we also check if an entry is wrong
      // or missing.
      var schoolObj = {};
      var userObj = {};

      var index;
      for(index in schoolArray) {
         schoolObj[schoolArray[index]] = true;
      }
      for(index in userArray) {
         userObj[userArray[index]] = true;
      }
      
      // Special case if no edges
      if(userArray.length == 0) {
          return {
             success: false,
             message: emptyMessage
          };
       }

      // Wrong entries.
      var key;
      for(key in userObj) {
         if(!schoolObj[key]) {
            return {
               success: false,
               message: wrongMessage
            };
         }
      }

      for(key in schoolObj) {
         if(!userObj[key]) {
            return {
               success: false,
               message: missingMessage
            };
         }
      }

      return {
         success: true
      };
   }

   function getResultAndMessage() {
      /*
       * The vertex and edge IDs are the same in the target graph
       * and in the user's graph. We check that they are identical.
       */
      var vertexResult = checkUser(data[level].target.getAllVertices(), graph.getAllVertices(), taskStrings.missingVertex);
      if(!vertexResult.success) {
         return {
            successRate: 0,
            message: vertexResult.message
         };
      }

      var edgeResult = checkUser(data[level].target.getAllEdges(), graph.getAllEdges(), taskStrings.missingEdge, taskStrings.wrongEdge, taskStrings.shouldAddVertices);
      if(!edgeResult.success) {
         return {
            successRate: 0,
            message: edgeResult.message
         };
      }

      return {
         successRate: 1,
         message: taskStrings.success
      };
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
