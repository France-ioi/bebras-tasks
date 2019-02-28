// [note: pour la version facile : tac gact]
function initTask() {
   var cellWidth = 24;
   var cellHeight = 40;
   var margin = 10;
   var nbSteps;
   var minNbSteps = 10000;
   var letters;
   var startImpossible;
   var nbSetLettersForStart;
   var nbPossibleStarts;
   var paper;
   var texts;
   var cells = [];
   var texts = [];
   var solved;
   var alphabetLetters = ['A', 'C', 'T', 'S'];
   var fullScoreThreshold;
   var nbColumns;
   var nbLines;
   var target;
   var difficulty;
   var turnedCards = [];

   var seed = 1;
   function random() {
       var x = Math.sin(seed++) * 10000;
       return x - Math.floor(x);
   }

   var getLetter = function(iLin, iCol) {
      if (letters[iLin][iCol] != undefined) {
         return letters[iLin][iCol];
      }
      var nbStartsRemovedByLetter = [];
      var isTargetForcedByLetter = [];
      for (var iLetter = 0; iLetter < alphabetLetters.length; iLetter++) {
         var letter = alphabetLetters[iLetter];
         nbStartsRemovedByLetter[iLetter] = 0;
         isTargetForcedByLetter[iLetter] = false;
         for (var start = Math.max(0, iCol - target.length - 1); start <= Math.min(iCol, nbColumns - target.length); start++) {
            if (!startImpossible[iLin][start]) {
               if (letter != target.charAt(iCol - start)) {
                  nbStartsRemovedByLetter[iLetter]++;
               } else if (nbSetLettersForStart[iLin][start] == target.length - 1) {
                  isTargetForcedByLetter[iLetter] = true;
               }
            }
         }
      }
      var sortedILetters = [0, 1, 2, 3];
      sortedILetters.sort(function(iLetter1, iLetter2) {
         if (isTargetForcedByLetter[iLetter1] != isTargetForcedByLetter[iLetter2]) {
            if (isTargetForcedByLetter[iLetter2]) {
               return -1;
            }
            return 1;
         }
         if (nbStartsRemovedByLetter[iLetter1] > nbStartsRemovedByLetter[iLetter2]) {
            return -1;
         }
         if (nbStartsRemovedByLetter[iLetter1] < nbStartsRemovedByLetter[iLetter2]) {
            return 1;
         }
         return 0;
      });
      var minLetter = 0;
      while ((nbPossibleStarts <= nbStartsRemovedByLetter[sortedILetters[minLetter]]) && (minLetter < 3)) {
         minLetter++;
      }
      var maxLetter = 3;
      while ((isTargetForcedByLetter[sortedILetters[maxLetter]]) && (maxLetter > 0)) {
         maxLetter--;
      }
      if (nbPossibleStarts == 1) {
         minLetter = 3;
         maxLetter = 3;
      }
      var letter = alphabetLetters[sortedILetters[Math.min(3, Math.floor(random() * 3) + minLetter)]];
      letters[iLin][iCol] = letter;
      if (nbPossibleStarts == 1) {
         return letter;
      }
      for (var start = Math.max(0, iCol - (target.length - 1)); start <= Math.min(iCol, nbColumns - target.length); start++) {
         if ((!startImpossible[iLin][start]) && (letter != target.charAt(iCol - start))) {
               startImpossible[iLin][start] = true;
               nbPossibleStarts--;
         }
      }
      //updateDebug();
      return letter;
   };

   var checkSolved = function(iLin, iCol) {
      for (var start = Math.max(0, iCol - target.length - 1); start <= Math.min(iCol, nbColumns - target.length); start++) {
         var isFound = true;
         for (var iLetter = 0; iLetter < target.length; iLetter++) {
            if (letters[iLin][start + iLetter] != target.charAt(iLetter)) {
               isFound = false;
               break;
            }
         }
         if (isFound) {
            for (var iLetter = 0; iLetter < target.length; iLetter++) {
               cells[iLin][start + iLetter].attr({fill: '#80FF80'});
            }
            return true;
         }
      }
      return false;
   };

   var updateDebug = function() {
      for (var iLin = 0; iLin < nbLines; iLin++) {
         for (var iCol = 0; iCol < nbColumns - target.length + 1; iCol++) {
            if (startImpossible[iLin][iCol]) {
               cells[iLin][iCol].attr({stroke: '#ff0000'});
            } else {
               cells[iLin][iCol].attr({stroke: '#008000'});
            }
         }
      }
   };

   var turnCard = function(iLin, iCol, display) {
      var letter = getLetter(iLin, iCol);
      nbSteps++;
      if (checkSolved(iLin, iCol)) {
         solved = true;
      }
      if (display) {
         texts[iLin][iCol].attr({text: letter});
         $("#status").html(taskStrings.numberOfLetters + " " + nbSteps + ".");
      }
   }

   var setClick = function(rect, iLin, iCol) {
      rect.node.onclick = function() {
         if (solved) {
            return;
         }
         if (texts[iLin][iCol].attr("text") != " ") {
            return;
         }
         displayHelper.stopShowingResult();
         turnCard(iLin, iCol, true);
         turnedCards.push([iLin, iCol]);
         if (solved) {
            platform.validate("done");
         }
      }
   };

   task.load = function(views, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         difficulty = taskParams.options.difficulty ? taskParams.options.difficulty : "hard";
         // LATER: vérifier que difficulty est easy ou hard
         if (difficulty == "debug") {
             nbColumns = 8;
             nbLines = 1;
             target = "CATS";
             fullScoreThreshold = 5;
         } else if (difficulty == "easy") {
             nbColumns = 20;
             nbLines = 1;
             target = "CATS";
             fullScoreThreshold = 10;
          } else if (difficulty == "very_hard") { 
             target = "SATTACA";
             nbLines = 2;
             fullScoreThreshold = 22;
             $(".twolines").show();
         } else  { // hard
             nbColumns = 30;
             nbLines = 1;
             target = "CATS";
             fullScoreThreshold = 14;
         }
         $("#target_pattern").html(target);
         $("#anim").css({height: 20 + nbLines * (cellHeight + margin)});

         paper = Raphael(document.getElementById('anim'), nbColumns * cellWidth + 2, nbLines * cellHeight + 2 * margin);

         for (var iLin = 0; iLin < nbLines; iLin++) {
            cells[iLin] = [];
            texts[iLin] = [];
            for (var iCol = 0; iCol < nbColumns; iCol++) {
               var x = iCol * cellWidth + 2;
               var y = margin + iLin * cellHeight + 2;
               var rect = paper.rect(x, y, cellWidth - 2, cellHeight - 2);
               cells[iLin].push(rect);
               rect.attr({'stroke': 'black', 'fill': 'white'});
               var text = paper.text(x + cellWidth / 2, y + cellHeight / 2, "");
               text.attr({"font-size": 20, "font-weight": "bold"});
               texts[iLin].push(text);
               setClick(rect, iLin, iCol);
               setClick(text, iLin, iCol);
            }
         }
         task.reloadAnswer("", callback);
      });
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify({startSeed: startSeed, turnedCards: turnedCards}));
   };

   innerReloadAnswer = function(strAnswer, display) {
      solved = false;
      nbSteps = 0;
      letters = [[], [], []];
      startImpossible = [[], [], []];
      nbSetLettersForStart = [[], [], []];
      turnedCards = [];
      for (var lin = 0; lin < nbLines; lin++) {
         for (var col = 0; col < nbColumns; col++) {
            nbSetLettersForStart[lin][col] = 0;
            if (display) {
               texts[lin][col].attr({text: ' '});// an empty string wouldn't work on ie8
               cells[lin][col].attr({fill: '#ffffff'});
            }
         }
      }
      nbPossibleStarts = nbLines * (nbColumns - target.length + 1);
      if (strAnswer != "") {
         var answer = $.parseJSON(strAnswer);
         turnedCards = answer.turnedCards;
         startSeed = answer.startSeed;
      } else {
         startSeed = Math.floor(Math.random() * 100);
      }
      seed = startSeed;
      for (var iCard = 0; iCard < turnedCards.length; iCard++) {
         card = turnedCards[iCard];
         turnCard(card[0], card[1], display);
      }
      if (display) {
         $("#status").html(taskStrings.clickOnCells);
      }
   };

   task.reloadAnswer = function(strAnswer, callback) {
      innerReloadAnswer(strAnswer, true);
      callback();
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         innerReloadAnswer(strAnswer, false);
         var score = taskParams.minScore;
         var msg = taskStrings.failure + " «&nbsp;" + target + "&nbsp;».";
         if (solved) {
            score = Math.max(taskParams.minScore + 1, Math.min(taskParams.maxScore, taskParams.maxScore - (nbSteps - fullScoreThreshold)));
            if (score == taskParams.maxScore) {
               msg = taskStrings.success(nbSteps);
            } else {
               msg = taskStrings.partialSuccess(nbSteps);
            }
         }
         callback(score, msg);
      });
   };
}

initTask();
