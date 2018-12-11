// [note: pour la version facile : tac gact]
function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         nbColumns: 20,
         nbLines: 1,
         target: "CATS",
         fullScoreThreshold: 10
      },
      medium: {
         nbColumns: 30,
         nbLines: 1,
         target: "CATS",
         fullScoreThreshold: 14
      },
      hard: {
         nbColumns: 30,
         nbLines: 2,
         target: "SATTACA",
         fullScoreThreshold: 20,
        
      }
   };
   var cellWidth = 24;
   var cellHeight = 40;
   var margin = 10;
   var nbSteps = 0;
   var minNbSteps = 10000;
   var startImpossible = [[], [], []];;
   var nbSetLettersForStart = [[], [], []];
   var nbPossibleStarts;
   var paper;
   var texts;
   var cells = [];
   var texts = [];
   var solved = false;
   var alphabetLetters = ['A', 'C', 'T', 'S'];
   var fullScoreThreshold;
   var nbColumns;
   var nbLines;
   var target;
   var randGen;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      target = data[level].target;
      nbLines = data[level].nbLines;
      nbColumns = data[level].nbColumns;
      fullScoreThreshold = data[level].fullScoreThreshold;
      nbPossibleStarts = nbLines * (nbColumns - target.length + 1);
      randGen = new RandomGenerator(subTask.taskParams.randomSeed);
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
         randGen.reset(answer.seed);
      }
   };

   subTask.resetDisplay = function() {
      $("#target_pattern").html(target);
      $("#status").html(taskStrings.clickOnCells);
      initPaper();
      for (var lin = 0; lin < nbLines; lin++) {
         for (var col = 0; col < nbColumns; col++) {
            nbSetLettersForStart[lin][col] = 0;
            texts[lin][col].attr({text: ' '});// an empty string wouldn't work on ie8
            cells[lin][col].attr({fill: '#ffffff'});
         }
      }
      for (var iCard = 0; iCard < answer.turnedCards.length; iCard++) {
         card = answer.turnedCards[iCard];
         turnCard(card[0], card[1], true);
      }
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = {"turnedCards": [], "letters": [[], [], []], "seed": randGen.nextInt(0,1000) };
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      var result;
      var success = checkResult();
      var nbSteps = answer.turnedCards.length;
      if (success) {
         if (nbSteps <= fullScoreThreshold) {
            result = { successRate: 1, message: taskStrings.success(nbSteps) };
         } else {
            result = { successRate: 0.5, message: taskStrings.partialSuccess(nbSteps) };
         }
      }else{
         result = { successRate: 0, message: taskStrings.failure + " «&nbsp;" + target + "&nbsp;»." };
      }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
   
   function initPaper() {
      paper = subTask.raphaelFactory.create("anim","anim",nbColumns * cellWidth + 2, nbLines * cellHeight + 2 * margin);
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
            cells[iLin][iCol].click(setClick(iLin,iCol));
         }
      }
   };

   var setClick = function(iLin, iCol) {
      return function() {
         if (solved) {
            return;
         }
         if (texts[iLin][iCol].attr("text") != " ") {
            return;
         }
         displayHelper.stopShowingResult();
         turnCard(iLin, iCol, true);
         answer.turnedCards.push([iLin, iCol]);
         if (solved) {
            platform.validate("done");
         }
      }
   };

   function random() {
       return randGen.nextReal();
   }

   var getLetter = function(iLin, iCol) {
      if (answer.letters[iLin][iCol]) {
         return answer.letters[iLin][iCol];
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
      answer.letters[iLin][iCol] = letter;
      if (nbPossibleStarts == 1) {
         return letter;
      }
      for (var start = Math.max(0, iCol - (target.length - 1)); start <= Math.min(iCol, nbColumns - target.length); start++) {
         if ((!startImpossible[iLin][start]) && (letter != target.charAt(iCol - start))) {
               startImpossible[iLin][start] = true;
               nbPossibleStarts--;
         }
      }
      return letter;
   };

   var checkSolved = function(iLin, iCol, display) {
      for (var start = Math.max(0, iCol - target.length - 1); start <= Math.min(iCol, nbColumns - target.length); start++) {
         var isFound = true;
         for (var iLetter = 0; iLetter < target.length; iLetter++) {
            if (answer.letters[iLin][start + iLetter] != target.charAt(iLetter)) {
               isFound = false;
               break;
            }
         }
         if (isFound) {
            if(display){
               for (var iLetter = 0; iLetter < target.length; iLetter++) {
                  cells[iLin][start + iLetter].attr({fill: '#80FF80'});
               }   
            }
            return true;
         }
      }
      return false;
   };

   var turnCard = function(iLin, iCol, display) {
      var letter = getLetter(iLin, iCol);
      nbSteps++;
      if (checkSolved(iLin, iCol,true)) {
         solved = true;
      }
      if (display) {
         texts[iLin][iCol].attr({text: letter});
         $("#status").html(taskStrings.numberOfLetters + " " + nbSteps + ".");
      }
   };

   function checkResult() {
      for(var iCard = 0; iCard < answer.turnedCards.length; iCard++){
         if(checkSolved(answer.turnedCards[iCard][0],answer.turnedCards[iCard][1], false)){
            return true;
         }
      }
      return false;
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
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
