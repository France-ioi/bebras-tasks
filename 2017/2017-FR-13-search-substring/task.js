function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         lines: [
            ["Excellent nageur"],
            ["Et bon constructeur"],
            ["Grâce à mes dents"],
            ["Merveilleux instruments"],
            ["Je coupe sans souci"],
            ["Les arbres pour mon abri"]
         ],
         stripWidth: 1,
         maxZerosInStrip: [2, 3, 3, 3, 2, 1],
         optimal: 100
      },
      medium: {
         lines: [
            ["Excellent nageur"],
            ["Et bon constructeur"],
            ["Grâce à mes dents"],
            ["Merveilleux instruments"],
            ["Je coupe sans souci"],
            ["Les arbres pour mon abri"],
            ["Au milieu de la rivière"],
            ["Et j'en suis bien fier"]
         ],
         stripWidth: 2,
         maxZerosInStrip: [3, 5, 6, -1], // max : 15, 11, 7, 3
         optimal: 100 // number of strings
      },
      hard: {
         lines: [
            ["Excellent nageur"],
            ["Et bon constructeur"],
            ["Grâce à mes dents"],
            ["Merveilleux instruments"],
            ["Je coupe sans souci"],
            ["Les arbres que je choisis"],
            ["Au milieu de la rivière"],
            ["Et j'en suis bien fier"],
            ["J'ai construit un abri"],
            ["Pour tous mes petits"],
            ["Ainsi, ils n'ont pas peur"],
            ["Loin des prédateurs"]
         ],
         stripWidth: 2,
         maxZerosInStrip: [3, 5, 7, 5, 6, -1], // max : 23, 19, 15, 11, 7, 3
         optimal: 12
      }
   };

   var randomGenerator;
   var words;
   var lines;
   var enemyTable;
   var currentBestLength;
   var numWords;
   var currentSelection;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      lines = data[level].lines;
      words = [];
      for(var iLine in lines) {
         for(var iWord in lines[iLine]) {
            words.push(lines[iLine][iWord]);
         }
      }
      numWords = words.length;
      randomGenerator = new RandomGenerator(subTask.taskParams.randomSeed);
      displayHelper.hideRestartButton = (level != "hard");
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      randomGenerator.reset(answer.seed);
      initEnemy();
      currentSelection = {
         index1: null,
         index2: null
      };
   };

   subTask.resetDisplay = function() {
      var wordsHTML = "";
      var wordIndex = 0;
      for(var iLine = 0; iLine < lines.length; iLine++) {
         for(var iWord in lines[iLine]) {
            wordsHTML += "<div class=\"word\" id=\"word_" + wordIndex + "\">" + words[wordIndex] + "</div>";
            wordIndex++;
         }
         if(iLine < lines.length - 1) {
            wordsHTML += "<br>";
         }
      }
      $(".wordsDiv").html(wordsHTML);
      $("#history").html("");

      $(".word").mousedown(onMouseDown);
      $(document).bind("mouseup.SEARCH_SUBSTRING_TASK", onMouseUp);
      $("#maxAttempts").html(data[level].optimal);
      $("#hideSearches").click(hideSearches);

      onSelectionUpdate();
      
      if(answer.searches.length > 0) {
         var lastSearch = answer.searches[answer.searches.length - 1];
         updateColors(lastSearch);
         updateFeedback(shouldIgnore(lastSearch));
      } else {
         updateFeedback(false);
      }

      showSearches();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      /*
       * The field "searches" holds the previously searched substrings,
       * each is has "start" and "end" fields, which are word indices.
       */
      return {
         seed: randomGenerator.nextInt(0, 1000000),
         searches: [],
         firstVisible: 0
      };
   };

   subTask.unloadLevel = function(callback) {
      $(document).unbind(".SEARCH_SUBSTRING_TASK");
      callback();
   };

   function onMouseDown(event) {
      var parts = this.id.split("_");
      var index = parseInt(parts[1]);

      // If the current selection has already been searched, or is empty,
      // start a new search with this new index.
      if(currentSelection.index2 !== null || currentSelection.index1 === null) {
         currentSelection = {
            index1: index,
            index2: null
         };
      }

      // Otherwise, index1 is set and index2 isn't, so we finish a search.
      else {
         currentSelection.index2 = index;
      }

      onSelectionUpdate();
   }

   function onMouseUp(event) {
      // Mouse up events are meant only for background, ignoreLast when clicking words.
      if(event && event.target && event.target.id && event.target.id.substr(0, 4) === "word") {
         return;
      }
      currentSelection = {
         index1: null,
         index2: null
      };
      onSelectionUpdate();
   }

   function onSelectionUpdate() {
      if(isLongestSubstring(getBestFound())) {
         return;
      }
      $(".word").removeClass("selectedWord wordFound wordNotFound");
      $("#currentSearch").html("");

      var ignoreLast = false;
      if(currentSelection.index1 !== null) {
         if(currentSelection.index2 === null) {
            $("#word_" + currentSelection.index1).addClass("selectedWord");
         }
         else {
            var start = Math.min(currentSelection.index1, currentSelection.index2);
            var end = Math.max(currentSelection.index1, currentSelection.index2);
            var search = {
               start: start,
               end: end
            };
            answer.searches.push(search);
            updateColors(search);
            ignoreLast = shouldIgnore(search);
            for (var iSearch = 0; iSearch < answer.searches.length; iSearch++) {
               var oldSearch = answer.searches[iSearch];
               if ((search.start == oldSearch.start) && (search.end == oldSearch.end)) {
                  if (ignoreLast || (iSearch < answer.searches.length - 1)) {
                     answer.searches[iSearch].hide = true;
                  }
               }
            }
         }
      }
      updateFeedback(ignoreLast);
      showSearches();
      if(isLongestSubstring(getBestFound())) {
         platform.validate("done");
      }
   }

   function shouldIgnore(search) {
      if ((level == "easy") && (search.end - search.start + 1 != 3)) {
         return true;
      }
      return false;
   }

   function updateColors(search) {
      var found = processSearch(search);
      var isLongest = isLongestSubstring(search);

      var wordClass;
      if(found) {
         if(isLongest) {
            wordClass = "wordFoundLongest";
         }
         else {
            wordClass = "wordFound";
         }
      }
      else {
         wordClass = "wordNotFound";
      }

      for(var index = search.start; index <= search.end; index++) {
         $("#word_" + index).addClass(wordClass);
      }
   }

   function hideSearches() {
      answer.firstVisible = answer.searches.length;
      showSearches();
   }

   function showSearches() {
      var nbTests = 18;
      var marginBotton = 10;
      var word = $('.word');
      word.css('margin-bottom', marginBotton + "px");
      var wordHeight = word.outerHeight() + marginBotton; // add margin bottom value
      for (var test = 0; test < nbTests; test++) {
         $("#test" + test).css("border-right", "solid white 3px");
         $("#test" + test).css("border-top", "solid white 3px");
         $("#test" + test).css("border-bottom", "solid white 3px");
      }
      var firstTest = Math.max(answer.firstVisible, answer.searches.length - nbTests);
      var curTest = 0;
      for (var test = firstTest; test < answer.searches.length; test++) {
         var search = answer.searches[test];
         if (search.hide != undefined) {
            continue;
         }
         var result = enemyTable[search.start][search.end];
         var isLongest = isLongestSubstring(search);
         var color = "orange";
         var type = "solid";
         var letter = "O";
         var borderWidth = 3;
         if (result == 0) {
            color = "#CC0000";
            type = "dashed";
         } else if (isLongest) {
            color = "lightgreen";
         }
         var height = ((search.end - search.start + 1) * wordHeight - marginBotton - borderWidth * 2);
         // console.log(height);
         var element = $("#test" + curTest);
         element.css("margin-top", (search.start * wordHeight) + "px");
         element.css("height", height + "px");
         element.css("border-right", type + " " + color + " " + borderWidth + "px");
         element.css("border-top", type + " " + color + " " + borderWidth + "px");
         element.css("border-bottom", type + " " + color + " " + borderWidth + "px");
         curTest++;
      }
   }

   function initEnemy() {
      /*
       * Every substring (start, end) corresponds to a cell (row, col)
       * in the table. Initially, all cells are null, which indicates undecided.
       * 1 indicates that the substring exists, and 0 that it doesn't.
       * 
       * When the user selects an undecide cell, the enemy must decide whether
       * to put 1 or 0 there. Putting 1 means all cells below and to the left are
       * also 1, and similarly putting 0 means all cells above and to the right are
       * also 0. The enemy will choose the answer while taking into account
       * the amount of information given (i.e. the amount of nulls that need to be changed).
       * 
       * We ignore cells below the main diagonal, because cells where row > col
       * don't correspond to a valid substring.
       */
      enemyTable = Beav.Matrix.make(numWords, numWords, null);
      var minLength = 2;
      var maxLength = numWords;
      if (level == "easy") {
         minLength = 3;
         maxLength = 3;
      }
      for (var col = 0; col < numWords; col++) {
         for (var row = 0; row <= col; row++) {          
            if (col - row + 1 < minLength) {
               enemyTable[row][col] = 1;
            }
            if (col - row + 1 > maxLength) {
               enemyTable[row][col] = 0;
            }
         }
      }
      
      currentBestLength = 0;

      for(var iSearch in answer.searches) {
         processSearch(answer.searches[iSearch]);
      }
   }

   function processSearch(search) {
      var row = search.start;
      var col = search.end;

      if(row > col) {
         throw "Invalid substring";
      }

      if(enemyTable[row][col] !== null) {
         return enemyTable[row][col];
      }


      /*
       * Four useful values:
       * - potentials0: the amount of undecided cells which correspond
       *   to longer strings than the current best, which would still
       *   be undecided if this substring was decided to not exist.
       * - potentials1: similar value for deciding this substring exists.
       * - nulls0 - the amount of undecided cellls which would still be
       *   undecided if this substring was decided to not exist.
       * - nulls1: similar value for deciding this substring exists.
       */

      // Up-right corresponds to containing substrings (start before, end after).
      // Down-left corresponds to contained substrings (start after, end before).
      /*
      var allNulls = countNulls(0, 0, "down", "right", 0);
      var potentials0 = countNulls(row, col, "up", "right", currentBestLength);
      var potentials1 = countNulls(row, col, "down", "left", currentBestLength);
      var nulls0 = countNulls(row, col, "up", "right", 0);
      var nulls1 = countNulls(row, col, "down", "left", 0);
      */

      var allWinners = countNulls(0, 0, "down", "right", currentBestLength);
      var removedWinnersIf0 = countNulls(row, col, "up", "right", currentBestLength);
      var remainingWinnersIf0 = allWinners - removedWinnersIf0;
      var remainingWinnersIf1 = countNulls(0, 0, "down", "right", col - row + 1);

      var targetValue;
      if (remainingWinnersIf0 > remainingWinnersIf1) {
         targetValue = 0;
      } else if ((remainingWinnersIf0 < remainingWinnersIf1) || (remainingWinnersIf0 == 0)) {
         targetValue = 1;
      } else {
         targetValue = randomGenerator.nextInt(0, 1);
      }
      
      var targetRowDir;
      var targetColDir;

      if (targetValue == 0) {
         targetRowDir = "up";
         targetColDir = "right";
         targetValue = 0;
      }
      else {
         targetRowDir = "down";
         targetColDir = "left";
         targetValue = 1;
         currentBestLength = Math.max(currentBestLength, col - row + 1);
      }
      changeNulls(row, col, targetRowDir, targetColDir, targetValue);

      return targetValue;
   }

   // Count how many nulls in the given direction from the given cell.
   function countNulls(row, col, rowDir, colDir, limit) {
      var count = 0;
      iterateTable(row, col, rowDir, colDir, function(row, col) {
         if(enemyTable[row][col] === null && (col - row + 1 > limit)) {
            count++;
         }
      });
      return count;
   }

   // Set all nulls to the given value.
   function changeNulls(row, col, rowDir, colDir, value) {
      iterateTable(row, col, rowDir, colDir, function(row, col) {
         enemyTable[row][col] = value;
      });
   }

   // Iterate over the enemy table from the given cell in the given direction.
   // Invoke callback for each cell, excluding the irrelevant ones below the main diagonal.
   function iterateTable(row, col, rowDir, colDir, callback) {
      var minRow;
      var maxRow;
      var minCol;
      var maxCol;

      if(rowDir === "down") {
         minRow = row;
         maxRow = numWords - 1;
      }
      else {
         minRow = 0;
         maxRow = row;
      }
      if(colDir === "left") {
         minCol = 0;
         maxCol = col;
      }
      else {
         minCol = col;
         maxCol = numWords - 1;
      }

      for(var iRow = minRow; iRow <= maxRow; iRow++) {
         for(var iCol = Math.max(minCol, iRow); iCol <= maxCol; iCol++) {
            callback(iRow, iCol);
         }
      }
   }

   function isLongestSubstring(search) {
      if(search === null) {
         return false;
      }
      var row = search.start;
      var col = search.end;
      var length = col - row + 1;

      if(enemyTable[row][col] === null) {
         return false;
      }

      var result = true;
      iterateTable(0, 0, "down", "right", function(row, col) {
         var currentLength = col - row + 1;

         // If there is any longer substring which is possibly in the book, the result is negative.
         if(currentLength > length && enemyTable[row][col] !== 0) {
            result = false;
         }
      });

      return result;
   }

   function countSearches() {
      var nbSearches = 0;
      for (var iSearch = 0; iSearch < answer.searches.length; iSearch++) {
         var search = answer.searches[iSearch];
         if (search.hide == undefined) {
            nbSearches++;
         }
      }
      return nbSearches;
   }

   function updateFeedback(ignoreLast) {
      if (currentSelection.index1 == null) {
         $("#currentSearch").html(taskStrings.selectFirstLine);
      }
      else if (currentSelection.index2 == null) {
         $("#currentSearch").html(taskStrings.selectSecondLine);
      }
      else if(answer.searches.length > 0) {
         var lastSearch = answer.searches[answer.searches.length - 1];
         var lastSearchLength = lastSearch.end - lastSearch.start + 1;
         var searchResult = processSearch(lastSearch);
         var isLongest = isLongestSubstring(lastSearch);
         $("#currentSearch").html(taskStrings.searchResult(searchResult, isLongest, level));
      }

      var bestSearch = getBestFound();
      var longestSub = null;
      if(bestSearch) {
         longestSub = linesFromSearch(bestSearch);
      }
      var nbSearches = countSearches();
      if (ignoreLast) {
         length--;
      }
      $("#history").html(taskStrings.history(nbSearches, longestSub, level));
   }

   function linesFromSearch(search) {
      var result = [[]];
      var wordIndex = 0;
      for(var iLine = 0; iLine < lines.length; iLine++) {
         var line = lines[iLine];
         for(var iWord = 0; iWord < line.length; iWord++) {
            if(wordIndex >= search.start && wordIndex <= search.end) {
               result[result.length - 1].push(words[wordIndex]);
               if(wordIndex < search.end && iWord === line.length - 1) {
                  result.push([]);
               }
            }
            wordIndex++;
         }
      }
      return result;
   }

   function getBestFound() {
      var longestFound = null;
      var longestFoundLength = 0;
      for(var iSearch in answer.searches) {
         var search = answer.searches[iSearch];
         var row = search.start;
         var col = search.end;
         var length = col - row + 1;
         if(enemyTable[row][col] === 1 && length > longestFoundLength) {
            longestFound = search;
            longestFoundLength = length;
         }
      }
      return longestFound;
   }

   function getResultAndMessage() {
      if(answer.searches.length === 0) {
         return {
            successRate: 0,
            message: taskStrings.empty
         };
      }

      var bestFound = getBestFound();
      if(bestFound === null || !isLongestSubstring(bestFound)) {
         return {
            successRate: 0,
            message: taskStrings.wrong
         };
      }

      var userSearches = countSearches();

      if(userSearches <= data[level].optimal) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }

      var diff = userSearches - data[level].optimal;
      return {
         successRate: Math.max(0, 1 - diff * 0.25),
         message: taskStrings.partial
      };
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
