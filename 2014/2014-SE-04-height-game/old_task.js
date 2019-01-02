function initTask () {
   var difficulty;
   var castors;
   var castorPos;
   var containers;
   var nbCastors;
   var nbCells;
   var animWidth = 650;
   var animHeight = 350;
   var tailleLettreCastor = 24;
   var yMargin = 15;
   var cellSide;
   var width;
   var xGrid;
   var dxText;
   var dyText;
   var beaverInCell = [];
  
   var animToContainer = function(castor, container) {
      var x = container.attrs.x;
      var y = container.attrs.y;
      castor.r.animate({x : x, y : y, 'transform' : ''}, 100);
      castor.t.animate({x : x + dxText, y : y + dyText, 'transform' : ''}, 100);
      castor.b.animate({x : x, y : y, 'transform' : ''}, 100);
   }

   var initDragDrop = function(castor) {
      var r = castor.r;
      var t = castor.t;
      var b = castor.b;
      var drag_move  = function (dx, dy) {
         if (isNaN(dx) || isNaN(dy)) {
            return;
         }
         r.attr({x: r.ox + dx, y: r.oy + dy, transform:''});
         t.attr({x: t.ox + dx, y: t.oy + dy, transform:''});
         b.attr({x: r.ox + dx, y: r.oy + dy, transform:''});
      }
     
      var drag_start  = function () {
         r.sx = r.ox = r.attrs.x;
         r.sy = r.oy = r.attrs.y;
         t.sx = t.ox = t.attrs.x;
         t.sy = t.oy = t.attrs.y;
         r.toFront();
         t.toFront();
         b.toFront();
      }
     
      var drag_end = function () {
         var origContainer = containers[castorPos[r.id]];
         var origCell = castorPos[r.id];
         for (var i=0; i < nbCells + nbCastors; i++) {
            if (i < nbCastors*nbCastors || i == nbCastors*nbCastors+r.id) {
               var dropContainer = containers[i];
               if (dropContainer.isPointInside(r.attrs.x + r.attrs.width/2, r.attrs.y + r.attrs.height/2)) {
                  if (i == origCell) {
                     return;
                  }
                  if (beaverInCell[i] != -1) {
                     var iCastor = beaverInCell[i];
                     var returnPos = nbCells + iCastor;
                     var returnContainer = containers[returnPos];
                     beaverInCell[returnPos] = iCastor;
                     castorPos[iCastor] = returnPos;
                     animToContainer(castors[iCastor], returnContainer);
                  }
           
                  beaverInCell[i] = r.id;
                  beaverInCell[origCell] = -1;
                  castorPos[r.id] = i;
                  animToContainer(castor, dropContainer);
                  displayHelper.stopShowingResult();
                  return;
               }
            }
         }
         beaverInCell[origCell] = -1;
         var returnPos = nbCells + r.id;
         var returnContainer = containers[returnPos];
         beaverInCell[returnPos] = r.id;
         castorPos[r.id] = returnPos;
         animToContainer(castor, returnContainer);
      }
      b.drag(drag_move, drag_start, drag_end);
      //t.drag(drag_move, drag_start, drag_end);
   }
  
   task.load = function(views, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         difficulty = taskParams.options.difficulty ? taskParams.options.difficulty : "hard";
         // LATER: vérifier que difficulty est easy ou hard
         $("." + difficulty).show();

         if (difficulty == "easy") {
            nbCastors = 3;
         } else {// hard
            nbCastors = 5;
         }

         nbCells = nbCastors * nbCastors;
         cellSide = Math.min(1000, (animHeight-2*yMargin)/nbCastors);
         if (isIE() && (isIE() <= 8)) {
            dxText = cellSide / 2;
            dyText = cellSide / 2;
            width = cellSide;
         } else {
            width = cellSide*150/220;
            dxText = width + 5;
            dyText = 3*cellSide/4;
         }
         xGrid = 170 + cellSide;

         drawPaper();
         if (views.solution) {
            setTimeout(function(){ // timeout as workaround for raphael          
               drawSolution();
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
      for (var iCastor = 0; iCastor < nbCastors; iCastor++) {
         var castor = castors[iCastor];
         castor.r.stop();
         castor.t.stop();
         castor.b.stop();
      }
   };

   var drawSolution = function() {
      var paperSolution = Raphael('animSolution', animHeight, animHeight); // square
      paperSolution.rect(0, 0, animHeight, animHeight).attr('fill','#D5F2FE');;
      for (var iLin = 0; iLin < nbCastors; iLin++) {
         for (var iCol = 0; iCol < nbCastors; iCol++) {
            var x = yMargin + iCol*cellSide;
            var y = iLin*cellSide + yMargin;
            paperSolution.rect(x, y, cellSide, cellSide);
            var iCastor = -1;
            var iCell = iLin * nbCastors + iCol;
            $.each(task.solutions[difficulty], function(iCastorX, iCellX) {
               if (iCell == iCellX) {
                  iCastor = iCastorX;
               }
            });
            if (iCastor != -1) {
              paperSolution.image("castor2.png", x, y, width, cellSide).attr('fill','gray');
              drawCastor(paperSolution, iCastor, x, y); 
            }
         }
      }
   };

   function isIE () {
     var myNav = navigator.userAgent.toLowerCase();
     return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
   }

   var drawCastor = function(paper, iCastor, x, y) {
      var r;
      var t;
      var name = String.fromCharCode(65+iCastor);
      if (isIE() && (isIE() <= 8)) {
         r = paper.rect(x, y, cellSide, cellSide).attr('fill', '#C0C0C0');
         t = paper.text(x + dxText, y + dyText, name).attr({"font-size": 24, "font-weight": "bold"});
      } else {
         r = paper.image("castor2.png", x, y, width, cellSide).attr('fill','gray');
         t = paper.text(x + dxText, y + dyText, name).attr({"font-size": tailleLettreCastor, "font-weight": "bold"});
      }
      var b = paper.rect(x, y, cellSide, cellSide).attr({'fill': '#FFFFFF', 'opacity': 0});
      return {r: r, t: t, b:b};
   }

   var drawPaper = function() {
      paper = Raphael('anim', animWidth, animHeight);
      paper.rect(0, 0, animWidth, animHeight).attr('fill','#D5F2FE');;
      paper.image("montagne.png", 1, animHeight-301, 100, 300);
      
      containers = [];
      for (var iLin = 0; iLin < nbCastors; iLin++) {
         for (var iCol = 0; iCol < nbCastors; iCol++) {
            containers[iLin * nbCastors + iCol] = paper.rect(xGrid + iCol*cellSide, iLin*cellSide + yMargin, cellSide, cellSide);
            beaverInCell[iLin * nbCastors + iCol] = -1;
         }
      }
      
      castors = [];
      castorPos = [];
      for (var iCastor=0; iCastor < nbCastors; iCastor++) {
         var x = 115;
         var y = iCastor*cellSide + yMargin;
         var castorElems = drawCastor(paper, iCastor, x, y);
         var r = castorElems.r;
         var t = castorElems.t;
         containers[nbCastors*nbCastors + iCastor] = paper.rect(x, y, cellSide, cellSide).attr("stroke-dasharray", ". ");
         beaverInCell[nbCastors*nbCastors + iCastor] = iCastor;
         $(t.node).css({
            "-webkit-touch-callout": "none",
            "-webkit-user-select": "none",
            "-khtml-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none",
            "cursor" : "default"
         });
         r.id = iCastor;
         castors[iCastor] = castorElems;
         initDragDrop(castors[iCastor]);
         castorPos[iCastor] = nbCastors*nbCastors + iCastor;
      }
   };

   var innerReloadAnswer = function(strAnswer) {
      castorPos = [];
      if (strAnswer == "") {
         for (var iCastor = 0; iCastor < nbCastors; iCastor++) {
            castorPos[iCastor] = nbCells + iCastor;
         }
      }
      else {
         castorPos = $.parseJSON(strAnswer);
      }      
      for (var iContainer = 0; iContainer < nbCells + nbCastors; iContainer++) {
         beaverInCell[iContainer] = -1;
      }
      for (var iCastor = 0; iCastor < nbCastors; iCastor++) {
         beaverInCell[castorPos[iCastor]] = iCastor;
      }
   }
    
   task.reloadAnswer = function(strAnswer, callback) { 
      innerReloadAnswer(strAnswer);
      
      for (var iCastor = 0; iCastor < nbCastors; iCastor++) {
         var container = containers[castorPos[iCastor]];
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
         if (castorPos.length != nbCastors) { 
            // TODO: ce n'est pas censé arriver, si ? on peut virer ce test je pense
            callback(taskParams.noScore, taskStrings.placeAllBeaversOnCells);
            return;
         }

         var solution = task.solutions[difficulty];
         var correct = true;
         var allInGrid = true;
         for (var iCastor = 0; iCastor < nbCastors; iCastor++) {
            allInGrid &= (castorPos[iCastor] < nbCells);
            correct &= (castorPos[iCastor] == solution[iCastor]);
          }
         if (! allInGrid) {      
            callback(taskParams.noScore, taskStrings.placeAllBeaversOnCells);
         } else if (correct) {
            callback(taskParams.maxScore, taskStrings.success);
         } else {
            callback(taskParams.minScore, taskStrings.failure);
         }
      });
   };
    
};

initTask();
