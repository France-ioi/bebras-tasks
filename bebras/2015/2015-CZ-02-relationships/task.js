function initTask () {
   'use strict';
   var level;
   var paper = null;
   var drawnEdges = null;
   var answer = null;
   var state = {};
   var difficulty;
   var castors;
   var containers;
   var nbCastors = 5;
   var animWidth = 700;
   var animHeight = {
      easy: 320,
      medium: 500,
      hard: 500
   };
   var tailleLettreCastor = 20;
   var cellHeight = 60;
   var cellWidth = 80;
   var beaverInCell = [[], []];
   var selectedCastor;

   var names = taskStrings.names;
   var positions = {
      easy: [
         [150, 120],
         [300, 40],
         [300, 190],
         [450, 190],
         [450, 40]
      ],
      medium: [
         [170, 60],
         [560, 60],
         [360, 150],
         [560, 180],
         [360, 300],
         [560, 400],
         [360, 400],
         [170, 400]
      ],
      hard: [
         [170, 20],
         [560, 20],
         [360, 110],
         [560, 140],
         [360, 260],
         [560, 330],
         [360, 360],
         [170, 180]
      ]
   };
   var edges = {
      easy: [
         [0, 1],
         [1, 2],
         [0, 2],
         [2, 3],
         [3, 4]
      ],
      medium: [
         [0, 1],
         [0, 2],
         [1, 2],
         [2, 3],
         [2, 4],
         [2, 5],
         [4, 7],
         [4, 5],
         [6, 7],
         [5, 6],
         [3, 4]
      ],
      hard: [
         [0, 1],
         [0, 2],
         [1, 2],
         [2, 3],
         [2, 4],
         [5, 2],
         [7, 4],
         [4, 5],
         [6, 7],
         [5, 6],
         [3, 4]
      ]
   };
   var nbToPlace = {
      easy: 5,
      medium: 8,
      hard: 7
   };
   var nbNodes;
   var nbEdges;
   var dxText = cellWidth / 2;
   var dyText = cellHeight / 2;

   var oldIE = false;
   if (/MSIE\s([\d.]+)/.test(navigator.userAgent))
      oldIE = parseInt(RegExp.$1, 10) <= 8;

   var animToContainer = function(castor, container) {
      var x = container.attrs.x;
      var y = container.attrs.y;
      if (oldIE) {
         moveCastor(castor, x, y);
      } else {
         castor.cx = x;
         castor.cy = y;
         castor.g.animate({transform: 't'+x+','+y}, 100);
      }
   };

   var moveCastor = function (castor, cx, cy) {
      castor.cx = cx;
      castor.cy = cy;
      if (Raphael.vml) {
         castor.g.node.style.left = cx + 'px';
         castor.g.node.style.top = cy + 'px';
      } else {
         castor.g.transform('t'+cx+' '+cy);
      }
   };

   var initDragDrop = function(castor) {
      var g = castor.g, ox, oy;

      var drag_move  = function (dx, dy) {
         if (isNaN(dx) || isNaN(dy)) {
            return;
         }
         moveCastor(castor, ox + dx, oy + dy);
      };

      var drag_start  = function () {
         cleanEdges();
         g.toFront();
         ox = castor.cx;
         oy = castor.cy;
      };

      var drag_end = function () {
         var castorPos = answer[level];
         var lx = castor.cx + castor.r.attrs.width / 2;
         var ly = castor.cy + castor.r.attrs.height / 2;
         for (var objType = 1; objType < 2; objType++) {
            for (var iObject = 0; iObject < nbNodes; iObject++) {
               var container = containers[objType][iObject];
               if (container.isPointInside(lx, ly)) {
                  moveToContainer(castor.i, objType, iObject);
                  return;
               }
            }
         }
         beaverInCell[castorPos[castor.i][0]][castorPos[castor.i][1]] = -1;
         castorPos[castor.i] = [0, castor.i];
         animToContainer(castor, containers[0][castor.i]);
      };
      g.drag(drag_move, drag_start, drag_end);
   };

   var moveToContainer = function(iCastor, iType, iContainer) {
      var castorPos = answer[level];
      if (beaverInCell[iType][iContainer] != -1) {
         var oldCastor = beaverInCell[iType][iContainer];
         beaverInCell[0][oldCastor] = oldCastor;
         castorPos[oldCastor] = [0, oldCastor];
         animToContainer(castors[oldCastor], containers[0][oldCastor]);
      }
      beaverInCell[iType][iContainer] = iCastor;
      beaverInCell[castorPos[iCastor][0]][castorPos[iCastor][1]] = -1;
      castorPos[iCastor] = [iType, iContainer];
      animToContainer(castors[iCastor], containers[iType][iContainer]);
      displayHelper.stopShowingResult();
   };

   var writeNames = function() {
      var s = "<table><tr>";
      // assumes an even number of edges
      for (var col = 0; col < edges[level].length/2; col++) {
         s += "<td><ul>";
         for (var row = 0; row < 2; row++) {
            var s1 = names[level][edges[level][2*col+row][0]];
            var s2 = names[level][edges[level][2*col+row][1]];
            s += "<li>" + s1 + " et " + s2 + "</li>";
         }
         s += "</ul></td>";
      }
      s += "</tr></table>";
      $("#relations").html(s);
   };

   task.load = function(views, callback) {
      initHandlers();

      displayHelper.hideValidateButton = true;
      displayHelper.setupLevels();

      if (views.solution) {
         $("#solution").show();
      }

      callback();
   };

   task.getDefaultStateObject = function() {
      return { level: "easy" };
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;

      nbNodes = positions[level].length;
      nbEdges = edges[level].length;

      if (display) {
         drawPaper();
         cleanEdges();
      }
   };

   task.getDefaultAnswerObject = function() {
      var answer = {};
      for (var level in {easy:true, medium: true, hard: true}) {
         var pos = [];
         for (var iBeaver = 0; iBeaver < names[level].length; iBeaver++) {
            pos.push([0, iBeaver]);
         }
         answer[level] = pos;
      }
      return answer;
   };

   task.reloadAnswerObject = function(answerObj) {
      cleanEdges();
      answer = answerObj;
      var castorPos = answer[level];

      beaverInCell = [[], []];
      for (var iType = 0; iType < 2; iType++) {
         for (var iNode = 0; iNode < nbNodes; iNode++) {
            beaverInCell[iType].push(-1);
         }
      }
      for (var iCastor = 0; iCastor < names[level].length; iCastor++) {
         beaverInCell[castorPos[iCastor][0]][castorPos[iCastor][1]] = iCastor;
      }

      for (iCastor = 0; iCastor < names[level].length; iCastor++) {
         var container = containers[castorPos[iCastor][0]][castorPos[iCastor][1]];
         var x = container.attrs.x;
         var y = container.attrs.y;
         moveCastor(castors[iCastor], x, y);
      }
   };

   task.getAnswerObject = function() {
      return answer;
   };

   task.unload = function(callback) {
      stopAnimation();
      callback();
   };

   var stopAnimation = function() {
      for (var iCastor = 0; iCastor < names[level].length; iCastor++) {
         var castor = castors[iCastor];
         castor.g.stop();
      }
   };

   var cleanEdges = function() {
      for (var iEdge = 0; iEdge < drawnEdges.length; iEdge++) {
         for (var iPath = 0; iPath < drawnEdges[iEdge].length; iPath++) {
            var path = drawnEdges[iEdge][iPath];
            path.attr({stroke: 'black', 'stroke-width': 3});
         }
      }
   };

   var drawEdges = function() {
      drawnEdges = [];
      for (var iEdge = 0; iEdge < nbEdges; iEdge++) {
         var edge = edges[level][iEdge];
         var pos1 = positions[level][edge[0]];
         var pos2 = positions[level][edge[1]];
         var x1 = pos1[0] + cellWidth / 2;
         var y1 = pos1[1] + cellHeight / 2;
         var x2 = pos2[0] + cellWidth / 2;
         var y2 = pos2[1] + cellHeight / 2;
         var xm = (x1 + x2) / 2;
         var ym = (y1 + y2) / 2;
         var drawnEdge = [
            paper.path(["M", x1, y1, "L", xm, ym]).attr({'stroke': 'black', 'stroke-width': 3, 'arrow-end': 'classic-wide-long'}),
            paper.path(["M", xm, ym, "L", x2, y2]).attr({'stroke': 'black', 'stroke-width': 3})
         ];
         drawnEdges.push(drawnEdge);

      }
   };

   function makeGroup (elements) {
      var groupNode, i, j;
      if (Raphael.vml) {
         groupNode = document.createElement("group");
         groupNode.style.position = 'absolute';
      } else {
         groupNode = document.createElementNS("http://www.w3.org/2000/svg", "g");
      }
      paper.canvas.appendChild(groupNode);
      for (i = 0, j = elements.length; i < j; i++)
         groupNode.appendChild(elements[i].node);
      return new Raphael.el.constructor(groupNode, paper);
   }

   var drawPaper = function() {
      if (paper) {
         paper.remove();
         paper = null;
      }
      paper = new Raphael('anim', animWidth, animHeight[level]);
      //paper.rect(0, 0, animWidth, animHeight);
      drawEdges();

      containers = [[],[]];
      for (var iLin = 0; iLin < nbNodes; iLin++) {
         containers[1][iLin] = paper.rect(positions[level][iLin][0], positions[level][iLin][1], cellWidth, cellHeight).attr({'fill' : '#F2F2FF'});
      }

      castors = [];
      var castorPos = [];
      for (var iCastor = 0; iCastor < names[level].length; iCastor++) {
         var x = 20;
         var y = iCastor*cellHeight + 15;
         containers[0][iCastor] = paper.rect(x, y, cellWidth, cellHeight).attr({"stroke-dasharray": ". ", 'fill': '#FFFFFF'});
         beaverInCell[0][iCastor] = iCastor;
         beaverInCell[1][iCastor] = -1;

         var r = paper.rect(0, 0, cellWidth, cellHeight, 4).attr({'fill': '#E0E0F8', 'opacity':1});
         var name = names[level][iCastor];
         var t = paper.text(dxText, dyText, name).attr("font-size", tailleLettreCastor);
         var b = paper.rect(0, 0, cellWidth, cellHeight, 4).attr({'fill': '#FFFFFF', 'opacity':0});
         $(t.node).css({
            "-webkit-touch-callout": "none",
            "-webkit-user-select": "none",
            "-khtml-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none",
            "cursor" : "default"
         });
         var g = makeGroup([r, t, b]);
         castors[iCastor] = {i: iCastor, r: r, t: t, b: b, g: g, cx: x, cy: y};

         initDragDrop(castors[iCastor]);
      }
   };

   var allPlaced = function(castorPos, level) {
      var nbPlaced = 0;
      for (var iCastor = 0; iCastor < castorPos.length; iCastor++) {
         if (castorPos[iCastor][0] == 1) {
            nbPlaced++;
         }
      }
      return (nbPlaced == nbToPlace[level]);
   };

   var areEdgesCorrect = function(castorPos, level, display) {
      var castorInCell = [];
      for (var iCastor = 0; iCastor < castorPos.length; iCastor++) {
         castorInCell[iCastor] = -1;
      }
      for (iCastor = 0; iCastor < castorPos.length; iCastor++) {
         if (castorPos[iCastor][0] == 1) {
            castorInCell[castorPos[iCastor][1]] = iCastor;
         }
      }
      for (var iEdge = 0; iEdge < edges[level].length; iEdge++) {
         var edge = edges[level][iEdge];
         if ((castorInCell[edge[0]] != -1) && (castorInCell[edge[1]] != -1)) {
            if (castorInCell[edge[0]] > castorInCell[edge[1]]) {
               if (display) {
                  for (var iPath = 0; iPath < drawnEdges[iEdge].length; iPath++) {
                     var path = drawnEdges[iEdge][iPath];
                     path.attr({stroke: 'red', 'stroke-width': 5});
                  }
               }
               return false;
            }
         }
      }
      return true;
   };

   var initHandlers = function() {
      $("#execute").click(clickExecute);
   };

   var clickExecute = function() {
      if (areEdgesCorrect(answer[level], level, true) && allPlaced(answer[level], level)) {
         platform.validate("stay");
      } else {
         displayHelper.validate("stay");
      }
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      var taskParams = displayHelper.taskParams;
      var scores = {};
      var messages = {};
      var maxScores = displayHelper.getLevelsMaxScores();

      if (strAnswer === '') {
         callback(taskParams.minScore, '');
         return;
      }
      var answer = $.parseJSON(strAnswer);
      for (var curLevel in names) {
         var castorPos = answer[curLevel];
         if (! areEdgesCorrect(castorPos, curLevel, false)) {
            scores[curLevel] = taskParams.noScore;
            messages[curLevel] = taskStrings.error;
         } else if (! allPlaced(castorPos, curLevel)) {
            scores[curLevel] = taskParams.noScore;
            messages[curLevel] = taskStrings.remains;
         } else {
            scores[curLevel] = maxScores[curLevel];
            messages[curLevel] = taskStrings.success;
         }
      }
      if (!gradedLevel) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
   //grader.gradeTask = task.gradeTask;
   
}

initTask();
