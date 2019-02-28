function initTask() {
   var nbSteps;
   var extraCol;
   var extraLig;
   var extraMirror;
   var laserPath;
   var mirrorsObjects;
   var status;
   var nbUsed;
   var paper;
   var nbColumns = 30;
   var nbLines = 15;
   var cellWidth = 24;
   var cellHeight = 24;
   var margin = 10;
   var minReflection = 14;
   var x1 = margin;
   var x2 = margin + nbColumns * cellWidth;
   var y1 = margin;
   var y2 = margin + nbLines * cellHeight;
   var mainRect = null;
   var solved = false;
   var mirrors = [ // note : & signifie \
      "...&..&../.................&..",
      "............../...............",
      "./........../............../..",
      "..............................",
      "../...........................",
      "/................&......&.....",
      "..............................",
      ".........................../..",
      "..&......&.....&..............",
      "......./..../.........../.....",
      "..............................",
      "...............&..............",
      ".......&........./&......&.../",
      "&../../.......................",
      "........&..........&.....&...."
   ];
   var cells = [];
   var rects = [];

   function isIE () {
     var myNav = navigator.userAgent.toLowerCase();
     return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
   }


   var setClickNonIE = function(rect, iLig, iCol) {
      rect.node.onclick = function() {
         if ((iLig == extraLig) && (iCol == extraCol)) {
            extraMirror.remove();
            extraLig = -1;
            extraCol = -1;
         } else if (mirrors[iLig][iCol] != "."
             || (iLig == 0 && iCol == 0)
             || (iLig == nbLines-1 && iCol == nbColumns-1)) {
            return;         
         } else {
             extraLig = iLig;
             extraCol = iCol;
         }
         drawExtraMirror();
         drawLaser(true);
         for(var lig = 0; lig < nbLines; lig++) {
            for(var col = 0; col < nbColumns; col++) {
               cells[lig][col].toFront();
            }
         }
         if (solved) {
            platform.validate("done");
         }
      }
   }

   var setClickIE = function(rect) {
      rect.node.onclick = function(event) {
         if (event == undefined) {
            event = window.event; // fix for ie <= 8
         }
         //var offset = $("#anim").offset();
         //event = $.event.fix(event);
         //var x = event.pageX - offset.left - x1;
         //var y = event.pageY - offset.top - y1;
         var x;
         var y;
         if (event.offsetX != undefined) {
            if (isIE()) {
               x = event.offsetX;
               y = event.offsetY;
            } else {
               x = event.offsetX - x1;
               y = event.offsetY - y1;
            }
         } else {
            x = event.layerX - x1;
            y = event.layerY - y1;
         }
         var iCol = Math.floor(x / cellWidth);
         var iLig = Math.floor(y / cellHeight);
         if ((iCol < 0) || (iLig < 0) || (iCol >= nbColumns) || (iLig >= nbLines) ||
            (mirrors[iLig].charAt(iCol) != '.')) {
            return;
         }
         if ((iLig == extraLig) && (iCol == extraCol)) {
            extraLig = -1;
            extraCol = -1;
         } else {
            extraLig = iLig;
            extraCol = iCol;
         }
         drawExtraMirror();
         drawLaser(true);
         drawMainRect();
         if (solved) {
            platform.validate('done');
         }
      }
   };

   var drawExtraMirror = function() {
       if (extraMirror != null) {
         extraMirror.remove();
       }
       if ((extraLig != -1) && (extraCol != -1)) {
         extraMirror = drawMirror(extraLig, extraCol, '&', '#0000ff');
       }
   };

   var drawMirror = function(lig, col, mirror, color) {
      var x = margin + col * cellWidth;
      var y = margin + lig * cellHeight;
      var line;
      if (mirror == '/') {
         line = paper.path( ["M", x, y + cellHeight, "L", x + cellWidth, y] );
      }
      if (mirror == '&') {
         line = paper.path( ["M", x, y, "L", x + cellWidth, y + cellHeight] );
      }
      line.attr({'stroke-width': 3, 'stroke': color});
      return line;
   };

   var drawLaser = function(display) {
      if (display) {
         if (laserPath != null) {
            laserPath.remove();
         }
         // to get the laser to come from outside:
         // var path = ["M", margin - cellWidth / 2, margin + cellWidth / 2];
         var path = ["M", margin + cellWidth / 2, margin + cellWidth / 2];
      }

      var delta = [{dx: 0, dy: -1}, {dx: 1, dy: 0}, {dx: 0, dy: 1}, {dx: -1, dy: 0}];
      var addToPath = function(col, lig) {
         if (!display) {
            return;
         }
         var x = x1 + col * cellWidth + cellWidth / 2;
         var y = y1 + lig * cellWidth + cellWidth / 2;
         path.push("L");
         path.push(x);
         path.push(y);
      }
      var lig = 0;
      var col = 0;
      var dir = 1;
      nbUsed = 0;
      solved = false;
      while ((lig >= 0) && (lig < nbLines) && (col >= 0) && (col < nbColumns)) {
         var mirror = mirrors[lig].charAt(col);
         if ((lig == extraLig) && (col == extraCol)) {
            mirror = '&';
         }
         if (mirror != '.') {
            nbUsed++;
            var newDir;
            if (mirror == '/') {
               newDir = [1, 0, 3, 2];
            } else {
               newDir = [3, 2, 1, 0];
            }
            addToPath(col, lig);
            dir = newDir[dir];
         }
         col += delta[dir].dx;
         lig += delta[dir].dy;
         if (col == nbColumns-1 && lig == nbLines-1) {
            solved = true;
         }
      }
      addToPath(col, lig);
      if (display) {
         laserPath = paper.path(path);
         laserPath.attr({'stroke': '#ff0000', 'stroke-width': '3'});
         bringMirrorsToFront();
         if (!solved) {
            displayHelper.stopShowingResult();
         } else {
            displayHelper.validate('stay');
         }
      }
   };

   var bringMirrorsToFront = function() {
      if (mirrorsObjects != null) {
         for (var iMirror = 0; iMirror < mirrorsObjects.length; iMirror++) {
            mirrorsObjects[iMirror].toFront();
         }
      }
      if (extraMirror != null) {
         extraMirror.toFront();
      }
   };

   var drawAll = function() {
      if (mirrorsObjects != null) {
         for (var iMirror = 0; iMirror < mirrorsObjects.length; iMirror++) {
            mirrorsObjects[iMirror].remove();
         }
      }
      mirrorsObjects = [];
      if (status == null) {
         status = paper.text(350, 390, "");
         status.attr({"font-size": 18, "font-weight": "bold"});
      }
      drawLaser(true);
      for (var iLig = 0; iLig <= nbLines; iLig++) {
         var y = margin + iLig * cellHeight;
         paper.path(["M", x1, y, "L", x2, y]).attr({'stroke': '#D0D0D0'});;
      }
      for (var iCol = 0; iCol <= nbColumns; iCol++) {
         var x = margin + iCol * cellWidth;
         paper.path(["M", x, y1, "L", x, y2]).attr({'stroke': '#D0D0D0'});
      }

      if (!isIE()) {
         for(var iLig = 0; iLig < nbLines; iLig++) {
            cells[iLig] = [];
            rects[iLig] = [];
            for(var iCol = 0; iCol < nbColumns; iCol++) {
               var x = margin + iCol * cellWidth;
               var y = margin + iLig * cellHeight;
               var rect = paper.rect(x, y, cellWidth, cellHeight );
               rect.attr({'fill': '#ffffff', 'opacity': 0});
               if ((iCol == nbColumns-1) && (iLig == nbLines-1)){
                  rect.attr({'fill': '#808080', 'opacity': 0.6})	;
                   //rect.attr({'fill': 'green', 'opacity': 0.3});
               }
               if ((iCol == 0) && (iLig == 0)){
                  // rect.attr({'fill': 'black', 'opacity': 1});
                  paper.image("castor_tete.png", x, y, cellWidth-1, cellHeight-1);
               }
               cells[iLig].push(rect);
               setClickNonIE(rect, iLig, iCol);
               var rectBorder = paper.rect(x, y, cellWidth, cellHeight );
               rectBorder.attr({'stroke': '#808080', 'fill': 'none'});
               rects[iLig].push(rectBorder);
            }
         }
      }


      for (var iLig = 0; iLig < nbLines; iLig++) {
         for (var iCol = 0; iCol < nbColumns; iCol++) {
            var mirror = mirrors[iLig].charAt(iCol);
            if (mirror != '.') {
               mirrorsObjects.push(drawMirror(iLig, iCol, mirror, 'black'));
            }
            var x = margin + iCol * cellWidth;
            var y = margin + iLig * cellHeight;
            if ((iCol == nbColumns-1) && (iLig == nbLines-1)){
               var rect = paper.rect(x, y, cellWidth, cellHeight);
               rect.attr({'fill': '#808080', 'opacity': 0.6})	;
            }
            if ((iCol == 0) && (iLig == 0)){
               var rect = paper.rect(x, y, cellWidth, cellHeight);
               rect.attr({'fill': '#ffffff', 'opacity': 0});
               paper.image("castor_tete.png", x, y, cellWidth-1, cellHeight-1);
            }
         }
      }
      if (isIE()) {
         drawMainRect();
      }
   };

   var drawMainRect = function() {
      if (mainRect != null) {
         mainRect.remove();
      }
      mainRect = paper.rect(x1, y1, x2 - x1, y2 - y1);
      mainRect.attr({'fill': '#ffffff', 'opacity': 0, 'stroke': '#808080'});
      setClickIE(mainRect);
   };

   task.load = function(views, callback) {
      nbSteps = 0;   
      extraCol = -1;
      extraLig = -1;
      extraMirror = null;
      laserPath = null;
      mirrorsObjects = null;
      var paperWidth = nbColumns * cellWidth + 2 * margin;
      var paperHeight = nbLines * cellHeight + 2 * margin;
      paper = Raphael('anim', paperWidth, paperHeight);
      if (paperWidth > 750) {
         // console.log("Paper width is too large for the page.");
      }
      drawAll();
      callback();
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify([extraCol, extraLig]));
   };

   task.reloadAnswer = function(strAnswer, callback) {
      innerReloadAnswer(strAnswer);
      drawExtraMirror();
      drawLaser(true);
      if (isIE()) {
         drawMainRect();
      }
      callback();
   };

   var innerReloadAnswer = function(strAnswer) {
      var answer = [-1, -1];
      if (strAnswer != "") {
         answer = $.parseJSON(strAnswer);
      }
      extraCol = answer[0];
      extraLig = answer[1];
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         innerReloadAnswer(strAnswer);
         drawLaser(false);
         if (solved) {
            var score = Math.max(taskParams.noScore + 1, taskParams.maxScore - (nbUsed - minReflection)/2);
            var msg = taskStrings.targetReached(nbUsed) + " ";
            if (score >= taskParams.maxScore) {
               msg += taskStrings.success;
            } else {
               msg += taskStrings.partialSuccess;
            }
            callback(score, msg);
         } else {
            callback(taskParams.minScore, taskStrings.failure);
         }
      });
   };
}

initTask();
