function initTask (subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         nbCastors: 3,
         solution: [8, 1, 3]
      },
      medium: {
         nbCastors: 4,
         solution: [9, 7, 2, 12] 
      },
      hard: {
         nbCastors: 5,
         solution: [18, 21, 7, 4, 10]
      }
   };
   var castors;
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
   var solution;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      nbCastors = data[level].nbCastors;
      solution = data[level].solution;
      nbCells = nbCastors * nbCastors;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
         innerReloadAnswer();
      }
   };

   subTask.resetDisplay = function() {
      initDim();
      drawPaper();
      reloadAnswer();
      // drawSolution();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [];
      for (var iCastor = 0; iCastor < nbCastors; iCastor++) {
         defaultAnswer[iCastor] = nbCells + iCastor;
      }
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      stopAnimation();
      callback();
   };

   function getResultAndMessage() {
      var result;
      if (answer.length != nbCastors) { 
         result = { successRate: 0, message: taskStrings.placeAllBeaversOnCells }; 
      }else{
         var correct = true;
         var allInGrid = true;
         for (var iCastor = 0; iCastor < nbCastors; iCastor++) {
            allInGrid &= (answer[iCastor] < nbCells);
            correct &= (answer[iCastor] == solution[iCastor]);
          }
         if (! allInGrid) {   
            result = { successRate: 0, message: taskStrings.placeAllBeaversOnCells };
         } else if (correct) {
            result = { successRate: 1, message: taskStrings.success };
         } else {
            result = { successRate: 0, message: taskStrings.failure };
         }
      }
      return result;
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initDim() {
      cellSide = Math.min(1000, (animHeight-2*yMargin)/nbCastors);
      if (Beav.Navigator.isIE8()) {
         dxText = cellSide / 2;
         dyText = cellSide / 2;
         width = cellSide;
      } else {
         width = cellSide*150/220;
         dxText = width + 5;
         dyText = 3*cellSide/4;
      }
      xGrid = 170 + cellSide;
   };
  
   var animToContainer = function(castor, container) {
      var x = container.attrs.x;
      var y = container.attrs.y;
      var anim1 = new Raphael.animation({x : x, y : y, 'transform' : ''}, 100);
      var anim2 = new Raphael.animation({x : x + dxText, y : y + dyText, 'transform' : ''}, 100);
      subTask.raphaelFactory.animate("anim1r",castor.r,anim1);
      subTask.raphaelFactory.animate("anim1b",castor.b,anim1);
      subTask.raphaelFactory.animate("anim2",castor.t,anim2);
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
         var origContainer = containers[answer[r.id]];
         var origCell = answer[r.id];
         for (var i=0; i < nbCells + nbCastors; i++) {
            if (i < nbCastors*nbCastors || i == nbCastors*nbCastors+r.id) {
               var dropContainer = containers[i];
               if (dropContainer.isPointInside(r.attrs.x + r.attrs.width/2, r.attrs.y + r.attrs.height/2)) {
                  if (i == origCell) {
                     reinitDragDrop(); // IE8 bug fix
                     return;
                  }
                  if (beaverInCell[i] != -1) {
                     var iCastor = beaverInCell[i];
                     var returnPos = nbCells + iCastor;
                     var returnContainer = containers[returnPos];
                     beaverInCell[returnPos] = iCastor;
                     answer[iCastor] = returnPos;
                     animToContainer(castors[iCastor], returnContainer);
                  }
           
                  beaverInCell[i] = r.id;
                  beaverInCell[origCell] = -1;
                  answer[r.id] = i;
                  animToContainer(castor, dropContainer);
                  displayHelper.stopShowingResult();
                  reinitDragDrop(); // IE8 bug fix
                  return;
               }
            }
         }
         beaverInCell[origCell] = -1;
         var returnPos = nbCells + r.id;
         var returnContainer = containers[returnPos];
         beaverInCell[returnPos] = r.id;
         answer[r.id] = returnPos;
         animToContainer(castor, returnContainer);
         reinitDragDrop(); // IE8 bug fix
      }
      b.undrag();
      b.drag(drag_move, drag_start, drag_end);
   }

   function reinitDragDrop() {
      for(var iCastor = 0; iCastor < nbCastors; iCastor++){
         initDragDrop(castors[iCastor]);
      }
   };
  
   var stopAnimation = function() {
      subTask.raphaelFactory.stopAnimate("anim1r");
      subTask.raphaelFactory.stopAnimate("anim1b");
      subTask.raphaelFactory.stopAnimate("anim2");
   };

   var drawSolution = function() {
      var paperSolution = subTask.raphaelFactory.create('animSolution','animSolution', animHeight, animHeight)
      paperSolution.rect(0, 0, animHeight, animHeight).attr('fill','#D5F2FE');;
      for (var iLin = 0; iLin < nbCastors; iLin++) {
         for (var iCol = 0; iCol < nbCastors; iCol++) {
            var x = yMargin + iCol*cellSide;
            var y = iLin*cellSide + yMargin;
            paperSolution.rect(x, y, cellSide, cellSide);
            var iCastor = -1;
            var iCell = iLin * nbCastors + iCol;
            $.each(solution, function(iCastorX, iCellX) {
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

   var drawCastor = function(paper, iCastor, x, y) {
      var r;
      var t;
      var name = String.fromCharCode(65+iCastor);
      if (Beav.Navigator.isIE8()) {
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
      paper = subTask.raphaelFactory.create('anim','anim', animWidth, animHeight);
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
      }
   };

   var innerReloadAnswer = function() {
      for (var iContainer = 0; iContainer < nbCells + nbCastors; iContainer++) {
         beaverInCell[iContainer] = -1;
      }
      for (var iCastor = 0; iCastor < nbCastors; iCastor++) {
         beaverInCell[answer[iCastor]] = iCastor;
      }
   }
    
   var reloadAnswer = function() { 
      for (var iCastor = 0; iCastor < nbCastors; iCastor++) {
         var container = containers[answer[iCastor]];
         var castor = castors[iCastor];
         var x = container.attrs.x;
         var y = container.attrs.y;
         castor.r.attr({"x": x, "y": y});
         castor.b.attr({"x": x, "y": y});
         castor.t.attr({"x": x+dxText, "y": y+dyText});
      }
   };
};
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();

