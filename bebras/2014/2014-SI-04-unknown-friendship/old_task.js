function initTask () {
   var difficulty;
   var castors;
   var castorPos;
   var containers;
   var nbCastors = 5;
   var animWidth = 700;
   var animHeight = 350;
   var tailleLettreCastor = 20;
   var cellHeight = 40;
   var cellWidth = 80;
   var beaverInCell = [[], []];

   // note: in "easy" mode, only 6 first nodes are considered
   var names = ["Anna", "Bob", "Julie", "Léa", "Marc", "Paul", "Théo", "Yann"];
   var positions = [
      [200, 160],
      [550, 250],
      [560, 120],
      [380, 90],
      [170, 260],
      [370, 190],
      [170, 20], // only in hard
      [510, 30]  // only in hard (see load function)
      ]
   var edges = [
      [5, 3],
      [0, 3],
      [5, 4],
      [1, 2],
      [4, 1],
      [5, 2],
      [5, 1],
      [2, 3], // only in easy
      [7, 6], // only in hard
      [6, 3], // only in hard
      [2, 7] // only in hard (see load function)
   ];
   var nbNodes;
   var nbEdges;
   var dxText = cellWidth / 2;
   var dyText = cellHeight / 2;
  
   var animToContainer = function(castor, container) {
      var x = container.attrs.x;
      var y = container.attrs.y;
      castor.r.animate({x : x, y : y}, 100);
      castor.t.animate({x : x + dxText, y : y + dyText}, 100);
      castor.b.animate({x : x, y : y}, 100);
   };

   var initDragDrop = function(castor) {
      var r = castor.r;
      var t = castor.t;
      var b = castor.b;

      var drag_move  = function (dx, dy) {
         if (isNaN(dx) || isNaN(dy)) {
            return;
         }
         r.attr({x: r.ox + dx, y: r.oy + dy});
         t.attr({x: t.ox + dx, y: t.oy + dy});
         b.attr({x: r.ox + dx, y: r.oy + dy});
      };
     
      var drag_start  = function () {
         r.ox = r.attrs.x;
         r.oy = r.attrs.y;
         t.ox = t.attrs.x;
         t.oy = t.attrs.y;
         r.toFront();
         t.toFront();
         b.toFront();
      };
     
      var drag_end = function () {
         for (var objType = 1; objType < 2; objType++) {
            for (var iObject = 0; iObject < nbNodes; iObject++) {
               var container = containers[objType][iObject];
               if (container.isPointInside(r.attrs.x + r.attrs.width/2, r.attrs.y + r.attrs.height/2)) {
                  if (beaverInCell[objType][iObject] != -1) {
                     var iCastor = beaverInCell[objType][iObject];
                     beaverInCell[0][iCastor] = iCastor;
                     castorPos[iCastor] = [0, iCastor];
                     animToContainer(castors[iCastor], containers[0][iCastor]);
                  }
                  beaverInCell[objType][iObject] = r.id;
                  beaverInCell[castorPos[r.id][0]][castorPos[r.id][1]] = -1;
                  castorPos[r.id] = [objType, iObject];
                  animToContainer(castor, container);
                  displayHelper.stopShowingResult();
                  /* // automatic validation deactivated:
                  if (isCorrect()) {
                     platform.validate("done");
                  } 
                  */
                  return;
               }
            }
         }
         beaverInCell[castorPos[r.id][0]][castorPos[r.id][1]] = -1;
         castorPos[r.id] = [0, r.id];
         animToContainer(castor, containers[0][r.id]);
         /* // automatic validation deactivated:
         if (isCorrect()) {
            platform.validate("done");
         }
         */
      };
      b.drag(drag_move, drag_start, drag_end);
   };
  
   var writeNames = function() {
      var s = "<table><tr>";
      // assumes an even number of edges
      for (var col = 0; col < edges.length/2; col++) {
         s += "<td><ul>";
         for (var row = 0; row < 2; row++) {
            var s1 = names[edges[2*col+row][0]];
            var s2 = names[edges[2*col+row][1]];
            s += "<li>" + s1 + " " + taskStrings.and + " " + s2 + "</li>";
         }
         s += "</ul></td>";
      }
      s += "</tr></table>";
      $("#relations").html(s);
   };

   task.load = function(views, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         difficulty = taskParams.options.difficulty ? taskParams.options.difficulty : "hard";
         // LATER: vérifier que difficulty est easy ou hard
         $("." + difficulty).show();
            
         if (difficulty == "easy") {
            nbNodes = names.length - 2;
            nbEdges = edges.length - 3;
            names = names.slice(0, nbNodes);
            positions = positions.slice(0, nbNodes);
            edges = edges.slice(0, nbEdges);
            for (var i = 0; i < positions.length; i++) {
               positions[i][1] -= 50;
            }
            animHeight -= 80;
         } else if (difficulty == "hard") {
            edges.splice(7, 1);
         }
         nbNodes = names.length;
         nbEdges = edges.length;

         var seed = taskParams.randomSeed;
         Beav.Array.shuffle(names, seed);

         writeNames();
         drawPaper();

         if (views.solution) {
            setTimeout(function(){ // timeout as workaround for raphael
               var paperSolution = Raphael('animSolution', animWidth, animHeight);
               drawEdges(paperSolution);
               for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
                  var x = positions[iCastor][0];
                  var y = positions[iCastor][1];
                  paperSolution.rect(x, y, cellWidth, cellHeight).attr({"stroke": "black ", "fill": '#E0E0F8'});
                  paperSolution.text(x + cellWidth/2, y + cellHeight/2, names[iCastor]).attr("font-size", tailleLettreCastor);
               }
            });
         }
         callback();
      });
   };

   task.unload = function(callback) {
      stopAnimation();
      callback();
   };

   var stopAnimation = function() {
      for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
         var castor = castors[iCastor];
         castor.r.stop();
         castor.t.stop();
         castor.b.stop();
      }
   };

   var drawEdges = function(paper) {
      for (var iEdge = 0; iEdge < nbEdges; iEdge++) {
         var edge = edges[iEdge];
         var pos1 = positions[edge[0]];
         var pos2 = positions[edge[1]];
         var x1 = pos1[0] + cellWidth / 2;
         var y1 = pos1[1] + cellHeight / 2;
         var x2 = pos2[0] + cellWidth / 2;
         var y2 = pos2[1] + cellHeight / 2;
         paper.path(["M", x1, y1, "L", x2, y2]).attr({'stroke': 'black', 'stroke-width': 3});
      }
   };

   var drawPaper = function() {
      paper = Raphael('anim', animWidth, animHeight);
      //paper.rect(0, 0, animWidth, animHeight);
      drawEdges(paper);

      containers = [[],[]];
      for (var iLin = 0; iLin < nbNodes; iLin++) {
         containers[1][iLin] = paper.rect(positions[iLin][0], positions[iLin][1], cellWidth, cellHeight).attr({'fill' : '#F2F2FF'});
      }
      
      castors = [];
      castorPos = [];
      for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
         var x = 20;
         var y = iCastor*cellHeight + 15;
         var r = paper.rect(x, y, cellWidth, cellHeight, 4).attr({'fill': '#E0E0F8', 'opacity':1});
         var name = names[iCastor];
         var t = paper.text(x + dxText, y + dyText, name).attr("font-size", tailleLettreCastor);
         var b = paper.rect(x, y, cellWidth, cellHeight, 4).attr({'fill': '#FFFFFF', 'opacity':0});
         containers[0][iCastor] = paper.rect(x, y, cellWidth, cellHeight).attr("stroke-dasharray", ". ");
         beaverInCell[0][iCastor] = iCastor;
         beaverInCell[1][iCastor] = -1;
         r.id = iCastor;
         $(t.node).css({
            "-webkit-touch-callout": "none",
            "-webkit-user-select": "none",
            "-khtml-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none",
            "cursor" : "default"
         });
         castors[iCastor] = {r:r, t:t, b:b};
         initDragDrop(castors[iCastor]);
         castorPos[iCastor] = [0, iCastor];
      }
   };

   var innerReloadAnswer = function(strAnswer) {
      castorPos = [];
      if (strAnswer == "") {
         for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
            castorPos[iCastor] = [0, iCastor];
         }
      }
      else {
         castorPos = $.parseJSON(strAnswer);
      }
      for (var iType = 0; iType < 2; iType++) {
         for (var iBeaver = 0; iBeaver < nbNodes; iBeaver++) {
            beaverInCell[iType][iBeaver] = -1;
         }
      }
      for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
         beaverInCell[castorPos[iCastor][0]][castorPos[iCastor][1]] = iCastor;
      }
   };

   var allPlaced = function() {
      for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
         if (castorPos[iCastor][0] != 1) {
            return false;
         }
      }
      return true;
   };

   var isCorrect = function() {
      for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
         if ((castorPos[iCastor][0] != 1) || (castorPos[iCastor][1] != iCastor)) {
            return false;
         }
      }
      return true;
   };

   task.reloadAnswer = function(strAnswer, callback) { 
      innerReloadAnswer(strAnswer);
      
      for (var iCastor = 0; iCastor < nbNodes; iCastor++) {
         var container = containers[castorPos[iCastor][0]][castorPos[iCastor][1]];
         animToContainer(castors[iCastor], container);
      }
      callback();
   };
        
   task.getAnswer = function(callback) {
      callback(JSON.stringify(castorPos));
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         innerReloadAnswer(strAnswer);
         if (! allPlaced()) {
            callback(taskParams.noScore, taskStrings.placeNamesOnRectangles);
         } else if (isCorrect()) {
            callback(taskParams.maxScore, taskStrings.success);
         } else {
            callback(taskParams.noScore, taskStrings.failure);
         }
      });
   };
    
};

initTask();
