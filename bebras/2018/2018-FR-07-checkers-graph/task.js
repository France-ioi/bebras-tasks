function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: { // 4 rooks, specific diagram
         rows: 7,
         columns: 7,
         nTokens : 4,
         tokens : {
            "A" : { "col" : 1, "row" : 1 },
            "B" : { "col" : 4, "row" : 2 },
            "C" : { "col" : 1, "row" : 5 },
            "D" : { "col" : 5, "row" : 4 }
         },
         graphPos : [
            {"x":20,"y":30},
            {"x":120,"y":50},
            {"x":40,"y":130},
            {"x":140,"y":150}
         ],
         targetGraph : '{"vertexInfo":{"A":{},"B":{},"C":{},"D":{}},"edgeInfo":{"AB":{},"BC":{},"CD":{}},"edgeVertices":{"AB":["A","B"],"BC":["B","C"],"CD":["C","D"]},"directed":false}',
         initialGraph : '{"vertexInfo":{"A":{},"B":{},"C":{},"D":{}},"edgeInfo":{"AB":{},"AD":{},"BC":{},"BD":{}},"edgeVertices":{"AB":["A","B"],"AD":["A","D"],"BC":["B","C"],"BD":["B","D"]},"directed":false}'

      },
      medium: { // 5 rooks, specific diagram
         rows: 7,
         columns: 7,
         nTokens : 5,
         tokens : {
            "A" : { "col" : 1, "row" : 1 },
            "B" : { "col" : 6, "row" : 0 },
            "C" : { "col" : 5, "row" : 4 },
            "D" : { "col" : 1, "row" : 5 },
            "E" : { "col" : 4, "row" : 2 }
         },
         graphPos : [
            {"x":55,"y":30},
            {"x":145,"y":30},
            {"x":30,"y":115},
            {"x":170,"y":115},
            {"x":100,"y":160}
         ],
         targetGraph : '{"vertexInfo":{"A":{},"B":{},"C":{},"D":{},"E":{}},"edgeInfo":{"AB":{},"AC":{},"BC":{},"BD":{},"CE":{},"DE":{}},"edgeVertices":{"AB":["A","B"],"AC":["A","C"],"BC":["B","C"],"BD":["B","D"],"CE":["C","E"],"DE":["D","E"]},"directed":false}',
         initialGraph : '{"vertexInfo":{"A":{},"B":{},"C":{},"D":{},"E":{}},"edgeInfo":{"AB":{},"AD":{},"BC":{},"BD":{}},"edgeVertices":{"AB":["A","B"],"AD":["A","D"],"BC":["B","C"],"BD":["B","D"]},"directed":false}'

      },
      hard: {
         rows: 7,
         columns: 7,
         nTokens : 8,
         tokens : {
            "A" : { "col" : 5, "row" : 1 },
            "B" : { "col" : 3, "row" : 3 },
            "C" : { "col" : 4, "row" : 6 },
            "D" : { "col" : 1, "row" : 5 },
            "E" : { "col" : 6, "row" : 2 },
            "F" : { "col" : 1, "row" : 1 },
            "G" : { "col" : 3, "row" : 0 },
            "H" : { "col" : 5, "row" : 5 }
         },
         graphPos : [
            {"x":20,"y":60},
            {"x":20,"y":120},
            {"x":140,"y":170},
            {"x":70,"y":20},
            {"x":70,"y":170},
            {"x":180,"y":120},
            {"x":180,"y":60},
            {"x":140,"y":20}
         ],
         targetGraph : '{"vertexInfo":{"A":{},"B":{},"C":{},"D":{},"E":{},"F":{},"G":{},"H":{}},"edgeInfo":{"AB":{},"AC":{},"AD":{},"BC":{},"BE":{},"CF":{},"DE":{},"DF":{},"FE":{}},"edgeVertices":{"AD":["A","D"],"AG":["A","G"],"DG":["D","G"],"DF":["D","F"],"CD":["C","D"],"CF":["C","F"],"CH":["C","H"],"EH":["E","H"],"CE":["C","E"],"EB":["E","B"],"BF":["B","F"]},"directed":false}',
         initialGraph : '{"vertexInfo":{"A":{},"B":{},"C":{},"D":{},"E":{},"F":{},"G":{},"H":{}},"edgeInfo":{"AB":{},"AD":{},"BC":{},"BD":{}},"edgeVertices":{"AB":["A","B"],"AD":["A","D"],"BC":["B","C"],"BD":["B","D"]},"directed":false}'
      },
      queens_6: { // 6 queens on 7x7
         rows: 7,
         columns: 7,
         nTokens : 6,
         tokens : {
            "A" : { "col" : 1, "row" : 1 },
            "B" : { "col" : 1, "row" : 4 },
            "C" : { "col" : 5, "row" : 4 },
            "D" : { "col" : 1, "row" : 5 },
            "E" : { "col" : 4, "row" : 2 },
            "F" : { "col" : 3, "row" : 6 }
         },
         graphPos : [
            {"x":30,"y":50},
            {"x":20,"y":120},
            {"x":140,"y":170},
            {"x":110,"y":20},
            {"x":70,"y":170},
            {"x":180,"y":120},
            {"x":180,"y":50}
         ],
         targetGraph : '{"vertexInfo":{"A":{},"B":{},"C":{},"D":{},"E":{},"F":{}},"edgeInfo":{"AB":{},"AC":{},"AD":{},"BC":{},"BE":{},"CF":{},"DE":{},"DF":{},"FE":{}},"edgeVertices":{},"directed":false}',
         initialGraph : '{"vertexInfo":{"A":{},"B":{},"C":{},"D":{},"E":{},"F":{}},"edgeInfo":{"AB":{},"AD":{},"BC":{},"BD":{}},"edgeVertices":{"AB":["A","B"],"AD":["A","D"],"BC":["B","C"],"BD":["B","D"]},"directed":false}'
      },
      queens_7: { // 7 queens on 8x8
         rows: 8,
         columns: 8,
         nTokens : 7,
         tokens : {
            "A" : { "col" : 1, "row" : 1 },
            "B" : { "col" : 1, "row" : 4 },
            "C" : { "col" : 5, "row" : 4 },
            "D" : { "col" : 1, "row" : 5 },
            "E" : { "col" : 7, "row" : 2 },
            "F" : { "col" : 3, "row" : 6 },
            "G" : { "col" : 2, "row" : 0 }
         },
         graphPos : [
            {"x":30,"y":50},
            {"x":20,"y":120},
            {"x":140,"y":170},
            {"x":110,"y":20},
            {"x":70,"y":170},
            {"x":180,"y":120},
            {"x":180,"y":50}
         ],
         targetGraph : '{"vertexInfo":{"A":{},"B":{},"C":{},"D":{},"E":{},"F":{},"G":{}},"edgeInfo":{"AB":{},"AC":{},"AD":{},"BC":{},"BE":{},"CF":{},"DE":{},"DF":{},"FE":{}},"edgeVertices":{},"directed":false}',
         initialGraph : '{"vertexInfo":{"A":{},"B":{},"C":{},"D":{},"E":{},"F":{},"G":{}},"edgeInfo":{"AB":{},"AD":{},"BC":{},"BD":{}},"edgeVertices":{"AB":["A","B"],"AD":["A","D"],"BC":["B","C"],"BD":["B","D"]},"directed":false}'
      },
      queens_8: { // 8 queens on 8x8
         rows: 8,
         columns: 8,
         nTokens : 8,
         tokens : {
            "A" : { "col" : 1, "row" : 1 },
            "B" : { "col" : 1, "row" : 4 },
            "C" : { "col" : 5, "row" : 4 },
            "D" : { "col" : 1, "row" : 5 },
            "E" : { "col" : 7, "row" : 2 },
            "F" : { "col" : 3, "row" : 6 },
            "G" : { "col" : 2, "row" : 0 },
            "H" : { "col" : 2, "row" : 7 }
         },
         graphPos : [
            {"x":20,"y":60},
            {"x":20,"y":160},
            {"x":140,"y":210},
            {"x":100,"y":60},
            {"x":70,"y":210},
            {"x":180,"y":160},
            {"x":80,"y":110},
            {"x":140,"y":110}
         ],
         targetGraph : '{"vertexInfo":{"A":{},"B":{},"C":{},"D":{},"E":{},"F":{},"G":{},"H":{}},"edgeInfo":{"AB":{},"AC":{},"AD":{},"BC":{},"BE":{},"CF":{},"DE":{},"DF":{},"FE":{}},"edgeVertices":{},"directed":false}',
         initialGraph : '{"vertexInfo":{"A":{},"B":{},"C":{},"D":{},"E":{},"F":{},"G":{},"H":{}},"edgeInfo":{"AB":{},"AD":{},"BC":{},"BD":{}},"edgeVertices":{"AB":["A","B"],"AD":["A","D"],"BC":["B","C"],"BD":["B","D"]},"directed":false}'
      }
   };
   var rows; // set to data[level].rows
   var columns; // set to data[level].columns
   var gridAttr = {
      cellWidth: 50,
      cellHeight: 50,
      line : {
         "stroke" : "none"
      }
   };
   var graphAttr = {
     width: 300,
     height: 190
   };
   var frameAttr = {
      "r" : 10,
      "fill" : "#9e5a2c",
      "stroke" : "none"
   };
   var cellAttr = {
      "empty" : {
         "stroke" : "black",
         "fill" : "#ccffcc"
      }
      /* for chessboard
      "dark" : {
         "stroke" : "none",
         "fill" : "#e1b191"
      },
      "light" : {
         "stroke" : "none",
         "fill" : "#ffffff"
      } */
   };
   var tokenAttr = {
      "r" : 18,
      "stroke" : "black",
      "stroke-width" : 1
   };
   var letterAttr = {
      "font-weight":"bold"
   };
   var vertexAttr = {
      "r" : 18,
      "stroke" : "black",
      "stroke-width" : 1,
      "fill" : "white"
   };
   var edgeAttr = {
      "stroke" : "black",
      "stroke-width" : "2"
   };
   var errorEdgeAttr = {
      "stroke" : "red",
      "stroke-width" : 6
   };
   var vertexColor = "white";
   var highlightColor = "#8080FF";
   var targetVG;
   var currentVG;
   var currentTokens;
   var grid;
   var gridArray;
   var draggedToken = null; // token ID currently being dragged
   var boardHighlightedRects = [];
   var nbHighlightRect; // number of directions to be highlighted
   var tokenCircles = {};
   var graphCircles = {};
   var graphLines = {};

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      rows = data[level].rows;
      columns = data[level].columns;
      currentTokens = JSON.parse(JSON.stringify(data[level].tokens));
      initGridArray();
      nbHighlightRect = (level == "queens") ? 4 : 2;
      displayHelper.customValidate = compareWithTarget;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer) {
         currentTokens = answer.tokens;
         initGridArray();
      }
   };

   subTask.resetDisplay = function() {
      initGrid();
      initTargetGraph();
      initCurrentGraph();
      $("#message").html("");
      hideFeedBack();
      if (typeof(enableRtl) != "undefined") {
         $("body").attr("dir", "rtl");
         $(".largeScreen #zone_1").css("float", "right");
         $(".largeScreen #zone_2").css("float", "right");
      }
   };
   
   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = { "tokens" : JSON.parse(JSON.stringify(data[level].tokens)) };
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      // destroy all objects, timers etc. as needed
      callback();
   };

   function getResultAndMessage() {
      return checkResult();
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initGridArray() {
      gridArray = new Array(rows);
      for(iRow = 0; iRow < rows; iRow++) {
         gridArray[iRow] = new Array(columns);
      }
      for(iToken = 0; iToken < data[level].nTokens; iToken++) {
         var letter = toLetter(iToken);
         gridArray[currentTokens[letter].row][currentTokens[letter].col] = letter;
      }
   };

   function initGrid() {
      if(grid) grid.remove();
      var border = 10;
      var margin = 5;
      var gridWitdh = columns*gridAttr.cellWidth;
      var frameWidth = gridWitdh+2*border;
      var totalWidth = gridWitdh+2*(border+margin);
      var gridHeight = rows*gridAttr.cellHeight;
      var frameHeight = gridHeight+2*border;
      var totalHeight = gridHeight+2*(border+margin);
      var boardPaper = subTask.raphaelFactory.create("board","board",totalWidth,totalHeight);
      var frame = boardPaper.rect(margin, margin,frameWidth,frameHeight).attr(frameAttr);
      grid = new Grid("board", boardPaper, rows, columns, gridAttr.cellWidth, gridAttr.cellHeight, (border+margin), (border+margin), gridAttr.line);

      cellColoring();
      for (var iRect = 0; iRect < nbHighlightRect; iRect++) {
         boardHighlightedRects[iRect] = boardPaper.rect(-1,-1,0,0).attr({fill:highlightColor,opacity:0.3});
      }
      initTokens();
      var dragSelectionBoxAttr = {
         "stroke" : "none",
         "stroke-width" : 1
      };
      var dragMargin = {
         "top" : 0,
         "left" : 0,
         "right" : 0,
         "bottom" : 0
      };
      grid.enableDragSelection(onMouseDown, onMouseMove, onMouseUp, onSelectionChange,dragSelectionBoxAttr,dragMargin, null);
   };

   function onMouseDown(x, y, event, anchorPaperPos, anchorGridPos) {
      if(draggedToken != null) {
        var successRate = updateTokenPosition(draggedToken.token,draggedToken.pos,draggedToken.pos);
      }
      hideFeedBack();
   };

   function onMouseMove(dx, dy, x, y, event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos) {
      if(gridArray[anchorGridPos.row][anchorGridPos.col] != null){
         var tok = grid.getCell(anchorGridPos.row,anchorGridPos.col)[1];
         if(tok) tok.attr('x',currentPaperPos.left).attr('y',currentPaperPos.top).attr('cx',currentPaperPos.left).attr('cy',currentPaperPos.top);
         draggedToken = { "token": gridArray[anchorGridPos.row][anchorGridPos.col], "pos": anchorGridPos };
      }
   };

   function onMouseUp(event, anchorPaperPos, anchorGridPos, currentPaperPos, currentGridPos) {
      subTask.raphaelFactory.destroy("target"); // doesn't work on ie8 if we put it in onMouseDown, for some reason
      initTargetGraph();
      if(gridArray[anchorGridPos.row][anchorGridPos.col] != null){
         if(currentGridPos.row < rows && currentGridPos.row >= 0 && currentGridPos.col < columns && currentGridPos.col >= 0) {
            if(gridArray[currentGridPos.row][currentGridPos.col] == null) {
               var tokenId = gridArray[anchorGridPos.row][anchorGridPos.col];
               var successRate = updateTokenPosition(tokenId,anchorGridPos,currentGridPos);
               if (level !== "queens") {
                  explainTokenConnexions(tokenId,currentGridPos,successRate);
               }
               answer.tokens = currentTokens;
               draggedToken = null;
               return;
            }
         }
      }
      var tok = grid.getCell(anchorGridPos.row,anchorGridPos.col)[1];
      var originalPos = grid.getCellCenter(anchorGridPos.row,anchorGridPos.col);
      if(tok) tok.attr('cx',originalPos.x).attr('cy',originalPos.y).attr('x',originalPos.x).attr('y',originalPos.y);
   };

   function explainTokenConnexions(tokenId, newPos, successRate) {
      var message = "";
      if (successRate != 1) {
        for(iToken = 0; iToken < data[level].nTokens; iToken++) {
           var letter = toLetter(iToken);
           if (tokenId != letter) {
              var token = currentTokens[letter];
              if (token.row == newPos.row) {
                 message += taskStrings.connectTokens(tokenId, letter, "horizontal") + "<br/>";
              } else if (token.col == newPos.col) {
                 message += taskStrings.connectTokens(tokenId, letter, "vertical") + "<br/>";
              }
           }
        }
        if (message == "") {
           message = taskStrings.noConnexions(tokenId);
        } else {
           message += taskStrings.connexionsInBlue;
        }
      }
      $("#message").html(message);
   }

   function updateTokenPosition(tokenId,oldPos,newPos) {
      gridArray[oldPos.row][oldPos.col] = null;
      gridArray[newPos.row][newPos.col] = tokenId;
      currentTokens[tokenId].row = newPos.row;
      currentTokens[tokenId].col = newPos.col;
      updateCurrentGraph();
      removeToken(oldPos.row,oldPos.col);
      addToken(newPos.row,newPos.col,tokenId);
      var successRate = checkResult().successRate;
      highlight(tokenId,newPos,successRate);
      return successRate;
   };

   function highlight(tokenId,newPos,successRate) {
      var tokenX = grid.getCellCenter(newPos.row,newPos.col).x;
      var tokenY = grid.getCellCenter(newPos.row,newPos.col).y;
      var halfWidth = gridAttr.cellWidth / 3;
      var fromLeft = newPos.col*gridAttr.cellWidth+tokenAttr.r/2;
      var fromTop = newPos.row*gridAttr.cellWidth+tokenAttr.r/2;
      var fromRight = (columns - newPos.col-1)*gridAttr.cellWidth+tokenAttr.r/2;
      var fromBottom = (rows - newPos.row-1)*gridAttr.cellWidth+tokenAttr.r/2;
      var fromLeftTop = Math.min(fromLeft,fromTop)*Math.sqrt(2);
      var fromRightBottom = Math.min(fromRight,fromBottom)*Math.sqrt(2);
      var fromLeftBottom = Math.min(fromLeft,fromBottom)*Math.sqrt(2);
      var fromRightTop = Math.min(fromRight,fromTop)*Math.sqrt(2);
      var diagLength = [
            fromLeftTop+fromRightBottom,
            fromLeftBottom+fromRightTop
         ];
      var diagPos = [
            { "x": tokenX-halfWidth, "y": tokenY-fromLeftTop },
            { "x": tokenX-halfWidth, "y": tokenY-fromRightTop }
         ];
      var cells = [
         [
            grid.getCellCenter(0, newPos.col),
            grid.getCellCenter(rows - 1, newPos.col)
         ],
         [
            grid.getCellCenter(newPos.row, 0),
            grid.getCellCenter(newPos.row, columns - 1)
         ]
      ];
      for (var dir = 0; dir < nbHighlightRect; dir++) {
         if(dir < 2){
            boardHighlightedRects[dir].attr({
               x: cells[dir][0].x - halfWidth,
               y: cells[dir][0].y - halfWidth,
               width: cells[dir][1].x - cells[dir][0].x + 2 * halfWidth,
               height: cells[dir][1].y - cells[dir][0].y + 2 * halfWidth
            });
         }else{
            boardHighlightedRects[dir].attr({
               x: diagPos[dir-2].x,
               y: diagPos[dir-2].y,
               width: 2*halfWidth,
               height: diagLength[dir-2]
            });
            var angle = (dir == 2) ? -45 : 45;
            boardHighlightedRects[dir].transform("R"+angle+","+tokenX+","+tokenY);
         }
      }

      for(iToken = 0; iToken < data[level].nTokens; iToken++) {
         var letter = toLetter(iToken);
         var token = currentTokens[letter];
         if ((token.row == newPos.row)
             || (token.col == newPos.col)
             || ((level == "queens")
                && (((token.row-token.col) == (newPos.row-newPos.col))
                   || ((token.row+token.col) == (newPos.row+newPos.col)))
                )
            ) {
            color = (successRate == 1) ? vertexColor : highlightColor;
         } else {
            color = vertexColor;
         }
         tokenCircles[letter].attr({fill:color});
         graphCircles[letter].attr({fill:color});
         if(letter != tokenId){
            var lineId = (iToken > tokenId.charCodeAt(0)-65) ? tokenId+letter : letter+tokenId;
            /* Alternative: used to highlight edges in the target graph
            if (graphLines[lineId] != undefined) {
               graphLines[lineId].attr({stroke:color,"stroke-width":5});
            }*/
         }
      }
   };

   /**
   *  Empty function to avoid error messages from grid.enableDragSelection
   */
   function onSelectionChange() {};

   function cellColoring() {
      for(iRow = 0; iRow < rows; iRow++) {
         for(iCol= 0; iCol < columns; iCol++) {
            var data = {
               "row" : iRow,
               "col" : iCol,
               "type" : "empty" // For chessboard (iRow+iCol)%2 == 0 ? "dark" : "light"
            };
            grid.addToCell(cellFiller,data);
         }
      }
   };

   function cellFiller(data,paper) {
      if(data.type == "empty"){
         return [paper.rect(data.xPos,data.yPos,data.cellWidth, data.cellHeight).attr(cellAttr.empty)];
      }
      /* For chessboard
      if(data.type == "dark"){
         return [paper.rect(data.xPos,data.yPos,data.cellWidth, data.cellHeight).attr(cellAttr.dark)];
      }else{
         return [paper.rect(data.xPos,data.yPos,data.cellWidth, data.cellHeight).attr(cellAttr.light)];
      }
      */
   };

   function initTokens() {
      for(iToken = 0; iToken < data[level].nTokens; iToken++) {
         var letter = toLetter(iToken);
         var col = currentTokens[letter].col;
         var row = currentTokens[letter].row;
         addToken(row,col,letter);
      }
   };

   function addToken(row,col,letter) {
      var data = {
         "col" : col,
         "row" : row,
         "letter" : letter,
         "fill" : "white"
      }
      grid.addToCell(drawToken,data);
   };

   function removeToken(row,col) {
      grid.popFromCell(row,col);
   };

   function drawToken(data,paper) {
      var x = data.xPos+(gridAttr.cellWidth/2);
      var y = data.yPos+(gridAttr.cellHeight/2);
      var circle = paper.circle(x,y).attr(tokenAttr).attr("fill","white");
      tokenCircles[data.letter] = circle;
      var text = paper.text(x,y,displayLetter(data.letter)).attr({"font-size": tokenAttr.r}).attr(letterAttr);
      var token = paper.set();
      token.push(circle,text);
      token.attr("cursor","pointer");
      return [token];
   };

   function initTargetGraph(){
      var graphPaper = subTask.raphaelFactory.create("target","target",graphAttr.width,graphAttr.height);
      var graphDrawer = new SimpleGraphDrawer(vertexAttr,edgeAttr);
      var targetG = Graph.fromJSON(data[level].targetGraph);
      targetVG = new VisualGraph("targetVG", graphPaper, targetG, graphDrawer, true);
      setVerticesPosition(targetVG);

      graphDrawer.setDrawVertex(drawVertex);
      graphDrawer.setDrawEdge(drawEdge);

      targetVG.redraw();
    };

    function initCurrentGraph(){
      var graphPaper = subTask.raphaelFactory.create("current","current",graphAttr.width,graphAttr.height);
      var graphDrawer = new SimpleGraphDrawer(vertexAttr,edgeAttr);
      var currentG = Graph.fromJSON(data[level].initialGraph);
      currentVG = new VisualGraph("currentVG", graphPaper, currentG, graphDrawer, true);
      setVerticesPosition(currentVG);

      graphDrawer.setDrawVertex(drawVertex);
      graphDrawer.setDrawEdge(drawEdge);
      updateCurrentGraph();
    };

    function setVerticesPosition(vGraph) {
      for(iVertex = 0; iVertex < data[level].nTokens; iVertex++) {
         var iLetter = toLetter(iVertex);
         var randomN = 0;
         if (level != "easy") {
            randomN = (subTask.taskParams.randomSeed)%data[level].nTokens;
         }
         // Note: to set coordinates, use:
         var randomN = 0;
         vGraph.setVertexVisualInfo(iLetter, data[level].graphPos[(iVertex+randomN)%data[level].nTokens]);
      }
    };

    /**
   * Used in SimpleGraphDrawer to add the letters
   */
   function drawVertex(id, info, visualInfo) {
      var pos = this._getVertexPosition(visualInfo);
      this.originalPositions[id] = pos;
      var circle = this.paper.circle(pos.x, pos.y).attr(this.circleAttr);
      graphCircles[id] = circle;
      var vertex = this.paper.set();
      var letter = this.paper.text(pos.x, pos.y, displayLetter(id)).attr("font-size", vertexAttr.r+2).attr(letterAttr);
      vertex.push(circle, letter);
      return [vertex];
   };

   /**
   * Used in SimpleGraphDrawer to put missing or wrong edges in red
   */
   function drawEdge(id, vertex1, vertex2, vertex1Info, vertex2Info, vertex1VisualInfo, vertex2VisualInfo, edgeInfo, edgeVisualInfo) {
      var lineAttr = this.lineAttr;
      if(edgeVisualInfo == "red") {
        lineAttr = errorEdgeAttr;
      }
      var edge = this.paper.path(this._getEdgePath(vertex1, vertex2)).attr(lineAttr).toBack();
      if(this.paper == subTask.raphaelFactory.get("current")) graphLines[id] = edge;
      return [edge];
   };

   function eraseAllEdges(vGraph) {
      var graph = vGraph.getGraph();
      var edgesList = graph.getAllEdges();
      for(iEdge = 0; iEdge < edgesList.length; iEdge++) {
         graph.removeEdge(edgesList[iEdge]);
      }
   };

   function updateCurrentGraph() {
      var tokens = answer.tokens;
      eraseAllEdges(currentVG);
      var graph = currentVG.getGraph();
      for(iToken = 0; iToken < data[level].nTokens; iToken++) {
         for(jToken = iToken+1; jToken < data[level].nTokens; jToken++) {
            var iLetter = toLetter(iToken);
            var jLetter = toLetter(jToken);
            var dcol = tokens[iLetter].col - tokens[jLetter].col;
            var drow = tokens[iLetter].row - tokens[jLetter].row;
            if((dcol == 0) || (drow == 0)
              || (level == "queens" && (dcol == drow || dcol == -drow))){
               graph.addEdge(iLetter+jLetter,iLetter,jLetter);
            }
         }
      }
      currentVG.redraw();
   };

   function createGraphFromAnswer() {
      var graph = new Graph(false);
      var tokens = answer.tokens;
      var nTokens = data[level].nTokens;
      for(var iTok = 0; iTok < nTokens; iTok++) {
         graph.addVertex(toLetter(iTok));
      }
      for(iToken = 0; iToken < nTokens; iToken++) {
         for(jToken = iToken+1; jToken < nTokens; jToken++) {
            var iLetter = toLetter(iToken);
            var jLetter = toLetter(jToken);
            if((tokens[iLetter].col == tokens[jLetter].col) || (tokens[iLetter].row == tokens[jLetter].row)){
               graph.addEdge(iLetter+jLetter,iLetter,jLetter);
            }
         }
      }

      return graph;
   };

   function toLetter(id) {
      return String.fromCharCode(65 + id);
   }

   function displayLetter(letter) {
     // rotate characters using random shift
      var code = letter.charCodeAt(0) - 65;
      var seed = (0+subTask.taskParams.randomSeed) % data[level].nTokens;
      var code2 = (code + seed) % data[level].nTokens;
      return toLetter(code2);
   }

   function compareWithTarget() {
      updateCurrentGraph();
      var targetGraph = targetVG.getGraph();
      var answerGraph = currentVG.getGraph();
      var edgesList = answerGraph.getAllEdges();
      var targetEdgesList = targetGraph.getAllEdges();
      var result = { successRate : 1, message : taskStrings.success };
      var wrongEdges = 0;
      var missingEdges = 0;
      for(var iEdge = 0; iEdge < edgesList.length; iEdge++) {
         var vertices = answerGraph.getEdgeVertices(edgesList[iEdge]);
         if(wrongEdges == 0 && (!targetGraph.hasNeighbor(vertices[0],vertices[1]))){
            wrongEdges++;
            currentVG.setEdgeVisualInfo(edgesList[iEdge],"red");
         }else{
            currentVG.setEdgeVisualInfo(edgesList[iEdge],"");
         }
      }
      for(var iEdge = 0; iEdge < targetEdgesList.length; iEdge++) {
         var vertices = targetGraph.getEdgeVertices(targetEdgesList[iEdge]);
         if((wrongEdges == 0) && (missingEdges == 0) && !answerGraph.hasNeighbor(vertices[0],vertices[1])){
            missingEdges++;
            targetVG.setEdgeVisualInfo(targetEdgesList[iEdge],"red");
         }else{
            targetVG.setEdgeVisualInfo(targetEdgesList[iEdge],"");
         }
      }
      if(wrongEdges >= 1) {
         result = { successRate : 0, message : taskStrings.errorWrongEdge };
      }else if(missingEdges >= 1) {
         result = { successRate : 0, message : taskStrings.errorMissingEdge };
      }
      currentVG.redraw();
      targetVG.redraw();
      showFeedback(result.message);
      if(wrongEdges == 0 && missingEdges == 0) {
         hideFeedBack();
         platform.validate("done");
      }
   };

   function checkResult() {
      var answerGraph = createGraphFromAnswer();
      var targetGraph = Graph.fromJSON(data[level].targetGraph);
      var edgesList = answerGraph.getAllEdges();
      var targetEdgesList = targetGraph.getAllEdges();

      var wrongEdges = 0;
      for(var iEdge = 0; iEdge < edgesList.length; iEdge++) {
         var vertices = answerGraph.getEdgeVertices(edgesList[iEdge]);
         if(!targetGraph.hasNeighbor(vertices[0],vertices[1])){
            wrongEdges++;
         }
      }

      var missingEdges = 0;
      for(var iEdge = 0; iEdge < targetEdgesList.length; iEdge++) {
         var vertices = targetGraph.getEdgeVertices(targetEdgesList[iEdge]);
         if(!answerGraph.hasNeighbor(vertices[0],vertices[1])){
            missingEdges++;
         }
      }

      var successRate = 0;
      var message = "";
      if (wrongEdges >= 1) {
        message = taskStrings.errorWrongEdge;
      } else if (missingEdges >= 1) {
        message = taskStrings.errorMissingEdge;
      } else {
        successRate = 1;
        message = taskStrings.success;
      }
      return {
        successRate: successRate,
        message: message
      };
   };

   function showFeedback(string) {
      $("#displayHelper_graderMessage").html(string);
      $("#displayHelper_graderMessage").css("color", "red");
   };

   function hideFeedBack() {
      $("#displayHelper_graderMessage").html("");
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]); // "queens"
displayHelper.useFullWidth();

// Note: for N-queens, partial score if only one edge differs