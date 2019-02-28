function initTask() {
   var nbSteps;
   var castor;
   var castorCor;
   var castorLig;
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
   var minReflection = 4;
   var x1 = margin;
   var x2 = margin + nbColumns * cellWidth;
   var y1 = margin;
   var y2 = margin + nbLines * cellHeight;
   var mainRect = null;
   var solved = false;
   var mirrors = [ // using > to mean \
      "......>....................>..",
      "..........>...................",
      "..............................",
      "..................../.>.......",
      "..............................",
      "/................/........./..",
      ".../....../...................",
      "..............................",
      "...>.....>....................",
      "................./../....>....",
      "............>.................",
      "............/.................",
      ".................>..../../....",
      ">...../.......................",
      ".............................."
   ];

   var setClick = function(rect) {
      rect.node.onclick = function(event) {
         if (event == undefined) {
            event = window.event; // fix for ie <= 8
         }
         event = $.event.fix(event);
         var offset = $("#anim").offset();
         var x = event.pageX - offset.left - x1;
         var y = event.pageY - offset.top - y1;
         var iCol = Math.floor(x / cellWidth);
         var iLig = Math.floor(y / cellHeight);
         if ((iCol < 0) || (iLig < 0) || (iCol >= nbColumns) || (iLig >= nbLines) ||
            (mirrors[iLig].charAt(iCol) != '.')) {
            return;
         }
         if ((iLig == castorLig) && (iCol == castorCol)) {
            castorLig = -1;
            castorCol = -1;
         } else {
            castorLig = iLig;
            castorCol = iCol;
         }
         drawLaser(true);
         drawCastor();
         drawMainRect();
         if (solved) {
            platform.validate('done');
         }
      }
   };

   var drawCastor = function() {
       if ((castorLig != -1) && (castorCol != -1)) {
          castor.show();
          var x = margin + castorCol * cellWidth;
          var y = margin + castorLig * cellHeight;
          castor.attr({x: x, y: y, transform:''});
       } else {
          castor.hide();
       }
   };

   var drawMirror = function(lig, col, mirror, color) {
      var x = margin + col * cellWidth;
      var y = margin + lig * cellHeight;
      var line;
      if (mirror == '/') {
         line = paper.path( ["M", x, y + cellHeight, "L", x + cellWidth, y] );
      } else if (mirror == '>') {
         line = paper.path( ["M", x, y, "L", x + cellWidth, y + cellHeight] );
      } else {
         // console.log("invalid character: " + mirror);
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
         var x = x1 + castorCol * cellWidth + cellWidth / 2;
         var y = y1 + castorLig * cellWidth + cellWidth / 2;
         var path = ["M", x, y];
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
      var lig = castorLig;
      var col = castorCol;
      var dir = 2;
      nbUsed = 0;
      solved = false;
      while ((lig >= 0) && (lig < nbLines) && (col >= 0) && (col < nbColumns)) {
         var mirror = mirrors[lig].charAt(col);
         if ((lig == castorLig) && (col == castorCol)) {
            mirror = '>';
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
         if (col == castorCol && lig == castorLig) {
            solved = true;
            break;
         }
      }
      addToPath(col, lig);
      if (display) {
         laserPath = paper.path(path);
         laserPath.attr({'stroke': 'red', 'stroke-width': '3'});
         bringMirrorsToFront();
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
      for (var iLig = 0; iLig < nbLines; iLig++) {
         for (var iCol = 0; iCol < nbColumns; iCol++) {
            var mirror = mirrors[iLig].charAt(iCol);
            if (mirror != '.') {
               mirrorsObjects.push(drawMirror(iLig, iCol, mirror, 'black'));
            }
         }
      }
      castor = paper.image("castor_tete.png", 0, 0, cellWidth-1, cellHeight-1).hide();
      drawMainRect();
   };

   var drawMainRect = function() {
      if (mainRect != null) {
         mainRect.remove();
      }
      mainRect = paper.rect(x1, y1, x2 - x1, y2 - y1);
      mainRect.attr({'fill': 'white', 'opacity': 0, 'stroke': 'gray'});
      setClick(mainRect);
   };
   
   var showSolution = function() {
      castorLig = task.solution.lig;
      castorCol = task.solution.col;
      drawCastor();
      drawLaser(true);
      drawMainRect();
   };

   task.load = function(views, callback) {
      nbSteps = 0;   
      castorCol = -1;
      castorLig = -1;
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

      if (views.solution) {
         $("#buttonShowSolution").click(showSolution);
      }
      callback();
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify([castorCol, castorLig]));
   };

   task.reloadAnswer = function(strAnswer, callback) {
      innerReloadAnswer(strAnswer);
      drawCastor();
      drawLaser(true);
      drawMainRect();
      callback();
   };

   var innerReloadAnswer = function(strAnswer) {
      var answer = [-1, -1];
      if (strAnswer != "") {
         answer = $.parseJSON(strAnswer);
      }
      castorCol = answer[0];
      castorLig = answer[1];
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         innerReloadAnswer(strAnswer);
         drawLaser(false);
         if (solved) {
            /*
            var score = Math.max(taskParams.noScore + 1, taskParams.maxScore - (nbUsed - minReflection));
            var msg = "Vous avez atteint la cible en " + nbUsed + " miroirs.";
            if (score <= taskParams.maxScore) {
               msg += " Bravo ! Vous avez réussi.";
            } else {
               msg += " Il est possible de faire mieux.";
            }
            callback(score, msg);
            */
             callback(taskParams.maxScore, "Bravo ! Vous avez réussi.");
           
         } else {
            callback(taskParams.minScore, "Le laser ne revient pas sur Castor.");
         }
      });
   };
}

initTask();