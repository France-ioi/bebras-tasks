function initTask() {
   var radius = 15;
   var names = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
   var fontSize = 14;
   var textStyle = {'font-size' : fontSize, 'font-weight' : 'bold'};
   var nodes = [
     [152,18],
     [33,44],
     [120,103],
     [210,110],
     [38, 140],
     [205, 200],
     [280, 120],
     [72, 230],
     [140, 220],
     [40, 330],
     [251, 305],
     [160, 360]
   ];
   var nbNodes = nodes.length;
   var iNodeTarget = nbNodes - 1;

   var initMatrix = [ // 1 means possible, 2 means selected
      [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0],
      [1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 1],
      [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0]
   ];
   var cells = [];
   var edges;
   var paperGraph;
   var paperMatrix;
   var cellSide = 30;
   var paper2Margin = cellSide+5;
   var paper2Width = paper2Margin + (nbNodes + 1) * cellSide + 5; 
   var paper2Height = paper2Margin + (nbNodes + 1) * cellSide + 5;
   var paper1Width = 300;
   var paper1Height = 400;
   var dash = ".";
   var dashColor = "darkGray";
   var animTime = 400;
   var delayTime = animTime + 50;
   var beavers = [];
   var animating = false;
   var beaverShowing = false;
   var curTimeout = null;

   var curMatrix;
   var curSelected;

   var pickArrows = function(matrix) {
      var nbIsolatedNodes = 0;
      var nextNode = [];
      var nodeState = [];
      var hasCycle = false;
      var recPickArrows = function(iNode) {
         if (nodeState[iNode] == "done") {
            return false;
         }
         if (nodeState[iNode] == "current") {
            hasCycle = true;
            return true;
         }
         nodeState[iNode] = "current";
         for (var iNeigh = 0; iNeigh < nbNodes; iNeigh++) {
            if (matrix[iNode][iNeigh] == 2) {
               nextNode[iNode] = iNeigh;
               if (recPickArrows(iNeigh)) {
                  nodeState[iNode] = "done";
                  return true;
               }
            }
         }
         if ((nextNode[iNode] == iNode) && (iNode != iNodeTarget)) {
            nbIsolatedNodes++;
         }
         nodeState[iNode] = "done";
         return false;
      }
      for (var iNode = 0; iNode < nbNodes; iNode++) {
         nodeState[iNode] = "todo";
         nextNode[iNode] = iNode;
      }
      for (var iNode = 0; iNode < nbNodes; iNode++) {
         if (nodeState[iNode] == "todo") {
            recPickArrows(iNode);
         }
      }
      return { 
         hasCycle: hasCycle, 
         nextNode: nextNode, 
         nbIsolatedNodes: nbIsolatedNodes };
   };

   var playBeavers = function(callback) {
      var simulation = pickArrows(curMatrix);
      var curLocation = [];
      var r = radius - 2;
      for (var iNode = 0; iNode < nbNodes; iNode++) {
         var x = nodes[iNode][0] - r;
         var y = nodes[iNode][1] - r;
         beavers[iNode] = paperGraph.image("castor_tete.png", x, y, r * 2, r * 2);
           // circle(nodes[iNode][0], nodes[iNode][1], r).attr({fill:'red'});
         curLocation[iNode] = iNode;
      }
      var nbSteps = 0;

      var moveStep = function() {
         var hasChanged = false;
         for (var iBeaver = 0; iBeaver < nbNodes; iBeaver++) {
            var destNode = simulation.nextNode[curLocation[iBeaver]];
            if (destNode != curLocation[iBeaver]) {
               curLocation[iBeaver] = destNode;
               var x = nodes[destNode][0] - r;
               var y = nodes[destNode][1] - r;
               var anim = Raphael.animation({x:x, y:y, 'transform' : ''}, animTime, '');
               beavers[iBeaver].animate(anim);
               hasChanged = true;
            }
         }
         nbSteps++;
         var maxNbSteps = nbNodes-1;
         if ((nbSteps < maxNbSteps) && hasChanged) {
            curTimeout = setTimeout(moveStep, delayTime);
         } else {
            stopExecution();
            callback(simulation);
         }
      }
      moveStep();
   };

   var stopExecution = function() {
      if (curTimeout != null) {
         clearTimeout(curTimeout);
         curTimeout = null;
      }
      animating = false;
      for (var iBeaver = 0; iBeaver < nbNodes; iBeaver++) {
         if (beavers[iBeaver] != undefined) {
            beavers[iBeaver].stop();
         }
      }
      $("#tryOrReset").attr('value', taskStrings.removeBeavers);
   };

   var setClick = function(rect, iNodeA, iNodeB) {
      rect.node.onclick = function(event) {
         if (beaverShowing && !animating) {
            cleanBeavers();
         }
         var newStatus = 3 - curMatrix[iNodeA][iNodeB];
         if (newStatus == 1) {
            curSelected = $.grep(curSelected, function(edge) {
               return ((edge[0] != iNodeA) || (edge[1] != iNodeB));
            });
         } else {
            curSelected.push([iNodeA, iNodeB]);
         }
         curMatrix[iNodeA][iNodeB] = newStatus;
         updateDisplayEdge(iNodeA, iNodeB);
         displayHelper.stopShowingResult();
      };
   };

   var updateDisplayEdges = function() {
      Beav.Matrix.forEach(curMatrix, function(value, iNodeA, iNodeB) {
         updateDisplayEdge(iNodeA, iNodeB);
      });
   };

   var updateDisplayEdge = function(iNodeA, iNodeB) {
      var value = curMatrix[iNodeA][iNodeB];
      if (value == 0) {
         return;
      }
      var fill = "white";
      var stroke = dashColor;
      var strokeWidth = 2;
      var strokeDashArray = dash;
      if (value == 2) {
         fill = "green";
         stroke = "black";
         strokeWidth = 3;
         strokeDashArray = "";
      } 
      cells[iNodeA + 1][iNodeB + 1].attr({"fill": fill});
      edges[iNodeA][iNodeB][0].attr({"stroke-width": strokeWidth, "stroke": stroke, "stroke-dasharray": strokeDashArray});
      edges[iNodeA][iNodeB][1].attr({"stroke": stroke});
      edges[iNodeA][iNodeB][2].attr({"stroke": stroke});
   };

   var drawEdges = function() {
      if (edges != undefined) {
         for (var iNodeA = 0; iNodeA < nbNodes; iNodeA++) {
            for (var iNodeB = 0; iNodeB < nbNodes; iNodeB++) {
               if (typeof edges[iNodeA][iNodeB] != "undefined") {
                  for (var iPart = 0; iPart < 3; iPart++) {
                     edges[iNodeA][iNodeB][iPat].remove();
                  }
               }
            }
         }
      }
      edges = [];
      for (var iNodeA = 0; iNodeA < nbNodes; iNodeA++) {
         edges[iNodeA] = [];
         for (var iNodeB = 0; iNodeB < nbNodes; iNodeB++) {
            var vertexType = curMatrix[iNodeA][iNodeB];
            if (vertexType != 0) {
               var attributes = {
                  "stroke-width": 3,
                  "stroke": "black"
                  //"arrow-end": "classic-wide-long"
               };
               if (vertexType == 1) {
                  attributes["stroke-dasharray"] = dash;
                  attributes["stroke"] = dashColor;
                  attributes["stroke-width"] = 2;
               }
               var x1 = nodes[iNodeA][0];
               var y1 = nodes[iNodeA][1];
               var x2 = nodes[iNodeB][0];
               var y2 = nodes[iNodeB][1];
               var length = Math.sqrt((x2 - x1)*(x2 - x1) + (y2 - y1)*(y2 - y1));
               var rateStart = (length - radius) / length;
               var rateEnd = (length - radius - 2) / length;
               var newX2 = Math.floor(x1 + (x2 - x1) * rateEnd);
               var newY2 = Math.floor(y1 + (y2 - y1) * rateEnd);
               var newX1 = Math.floor(x2 - (x2 - x1) * rateStart);
               var newY1 = Math.floor(y2 - (y2 - y1) * rateStart);
               var arrowLength = 6;
               var axL = Math.floor(newX2 + ((y2 - y1) - (x2 - x1)) * arrowLength / length);
               var ayL = Math.floor(newY2 - ((x2 - x1) + (y2 - y1)) * arrowLength / length);
               var axR = Math.floor(newX2 - ((y2 - y1) + (x2 - x1)) * arrowLength / length);
               var ayR = Math.floor(newY2 + ((x2 - x1) - (y2 - y1)) * arrowLength / length);
               var mainPath = paperGraph.path("M" + newX1 + " " + newY1 + "L" + newX2 + " " + newY2).attr(attributes);
               // Regular arrows cause problems with firefox so we draw our own...
               var arrowHead1 = paperGraph.path(
                  "M" + newX2 + " " + newY2 + 
                  "L" + axR + " " + ayR);
               var arrowHead2 = paperGraph.path(
                  "M" + newX2 + " " + newY2 + 
                  "L" + axL + " " + ayL);
               arrowHead1.attr({"stroke-width": 2, "stroke": attributes["stroke"]});
               arrowHead2.attr({"stroke-width": 2, "stroke": attributes["stroke"]});
               edges[iNodeA][iNodeB] = [mainPath, arrowHead1, arrowHead2];
            }
         }
      }
   };

   var drawMatrix = function() {
      paperMatrix = Raphael("matrix", paper2Width, paper2Height);  
      paperMatrix.rect(paper2Margin+cellSide, paper2Margin-cellSide, nbNodes*cellSide, cellSide).attr({"fill": "#CCFFCC"});
      paperMatrix.rect(paper2Margin-cellSide, paper2Margin+cellSide, cellSide, nbNodes*cellSide).attr({"fill": "#CCFFCC"});
      paperMatrix.text(nbNodes*cellSide / 2 + 70, cellSide-10, taskStrings.arrival).attr(textStyle);
      paperMatrix.text(cellSide-10, nbNodes*cellSide / 2 + 70, taskStrings.departure).attr(textStyle).transform("r 270");

      for (var iLig = 0; iLig <= nbNodes; iLig++) {
         cells[iLig] = [];
         for (var iCol = 0; iCol <= nbNodes; iCol++) {
            if (iLig == 0 && iCol == 0) {
               continue;
            }
            var x = paper2Margin + iCol * cellSide;
            var y = paper2Margin + iLig * cellSide;
            var cell = paperMatrix.rect(x, y, cellSide, cellSide);
            cells[iLig][iCol] = cell;
            var iNodeA = iLig - 1;
            var iNodeB = iCol - 1;
            if ((iCol > 0) && (iLig > 0)) {
               if (curMatrix[iNodeA][iNodeB] == 0) {
                  cell.attr({"fill": "#CCCCCC"});
               } else {
                  if (curMatrix[iNodeA][iNodeB] == 1) {
                     cell.attr({"fill": "white"});
                  } else {
                     cell.attr({"fill": "green"});
                  }
                  setClick(cell, iNodeA, iNodeB);
               }
            } else {
               cell.attr({"fill": "#CCCCFF"});
            }
            if ((iCol == 0) && (iLig > 0)) {
               var cx = x + cellSide / 2;
               var cy = y + cellSide / 2;
               paperMatrix.text(cx, cy, names[iNodeA]).attr(textStyle);
            }
            if ((iLig == 0) && (iCol > 0)) {
               var cx = x + cellSide / 2;
               var cy = y + cellSide / 2;
               paperMatrix.text(cx, cy, names[iNodeB]).attr(textStyle);
            }
         }
      }
   };

   task.load = function(views, callback) {
      if (paper1Width > 300 || paper2Width >= 440) {
         // console.log("Paper width too large for space reserved in html file.");
      }
      displayHelper.hideValidateButton = true;
      curMatrix = Beav.Matrix.copy(initMatrix);
      curSelected = [];

      paperGraph = Raphael("graph", paper1Width, paper1Height);
      drawEdges();
      for (var iNodeA = 0; iNodeA < nbNodes; iNodeA++) {
        var cx = nodes[iNodeA][0];
        var cy = nodes[iNodeA][1];
        var color = "white";
        if (iNodeA == iNodeTarget) {
           color = "#FF6666";
        }
        var node = paperGraph.circle(cx, cy, radius)
          .attr({"stroke-width": 2, stroke: "black", fill: color});
        paperGraph.text(cx, cy, names[iNodeA]).attr(textStyle);
      }
      drawMatrix();
      callback();
   };

   task.unload = function(callback) {
      stopExecution();
      callback();
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify(curSelected));
   };

   task.reloadAnswer = function(strAnswer, callback) {
      stopExecution();
      cleanBeavers();
      curSelected = selectedOfStrAnswer(strAnswer);
      curMatrix = Beav.Matrix.copy(initMatrix);
      addSelectedToMatrix(curMatrix, curSelected);
      updateDisplayEdges();
      callback();
   };

   var selectedOfStrAnswer = function(strAnswer) {
      var selected = [];
      if (strAnswer != "") {
         selected = $.parseJSON(strAnswer);
      }
      return selected;
   };

   var addSelectedToMatrix = function(matrix, selected) {
      for (var iEdge = 0; iEdge < selected.length; iEdge++) {
         var edge = selected[iEdge];
         matrix[edge[0]][edge[1]] = 2;
      }
   };

   var cleanBeavers = function() {
      $("#tryOrReset").attr('value', taskStrings.attempt);
      for (var iBeaver = 0; iBeaver < beavers.length; iBeaver++) {
         beavers[iBeaver].attr({x:0, y:0, opacity:0});
         beavers[iBeaver].remove();
      }
      beavers = [];
      beaverShowing = false;
   };

   task.tryOrReset = function() {
      if (animating) {
         stopExecution();
      } else if (beaverShowing) {
         cleanBeavers();
         displayHelper.stopShowingResult();
      } else {
         beaverShowing = true;
         animating = true;
         $("#tryOrReset").attr('value', "Arrêter");
         playBeavers(function(simulation) {
            if ((simulation.hasCycle) || (simulation.nbIsolatedNodes > 0)) {
               displayHelper.validate("stay");
            } else {
               platform.validate("done");
            }
         });
      }
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         var selected = selectedOfStrAnswer(strAnswer);
         var matrix = Beav.Matrix.copy(initMatrix);
         addSelectedToMatrix(matrix, selected);
         var simulation = pickArrows(matrix); 
         if (simulation.hasCycle) {
            callback(taskParams.noScore, taskStrings.failureCycle);
         } else if (simulation.nbIsolatedNodes > 0) {
            callback(taskParams.noScore, taskStrings.failureIsolatedNodes);
         } else {
            callback(taskParams.maxScore, taskStrings.success);
         }
      });
   };
}

initTask();
