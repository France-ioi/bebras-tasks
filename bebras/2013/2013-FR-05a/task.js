function initTask() {
   var allData = {
      hard: [
      [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
      [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1],
      [0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 1, 0, 0, 0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 1, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 1],
      [0, 0, 0, 1, 1, 0, 0, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1],
      [0, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 1],
      [0, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1],
      [0, 0, 0, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1],
      [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1]
      ],
      easy: [
      [1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
      ]
   };

   task.isGrader = false; // set by load function
   var setIntervalHandle = null;
   var paper = null;
   var cells = [];
   var state = [];
   var curLin = 0;
   var curCol = 0;

   var data = allData[level];
   var nbLins = data.length;
   var nbCols = data[0].length;

   task.load = function(views, callback) {
      loadImageCompass();
      drawGrids();
      $(".easy, .hard").hide();
      $("." + level).show();
      callback();
   };

   task.unload = function(callback) {
      if(setIntervalHandle != null) {
         clearInterval(setIntervalHandle);
         setIntervalHandle = null;
      }
      callback();
   };

   task.reloadAnswer = function(strAnswer, callback) {
      // assumes !isGrader
      task.clearGrid();
      $("#answer").val(strAnswer);
      callback();
      /* uncomment lines below if you want reloadAnswer to launch execution 
         automatically (including after grading).
      if (strAnswer != '') {
         task.execute();
      }  
      */
   };

   task.getAnswer = function(callback) {
      callback($("#answer").val());
   }; 

   drawGrids = function() {
      // assumes isGrader = false
      var cellSize = 18;
      paper = Raphael("tableLeft", nbCols * (cellSize + 1), nbLins * (cellSize + 1));
      for (var lin = 0; lin < nbLins; lin++) {
         for (var col = 0; col < nbCols; col++) {
            var fill = "white";
            if (data[lin][col] == 1) {
               fill = "gray";
            }
            paper.rect(1 + col * cellSize, 1 + lin * cellSize, cellSize , cellSize).attr({"stroke-width": 1, "fill": fill});
         }
      }
      paper = Raphael("tableRight", nbCols * (cellSize + 1), nbLins * (cellSize + 1));
      cells = [];
      for (var lin = 0; lin < nbLins; lin++) {
         cells[lin] = [];
         for (var col = 0; col < nbCols; col++) {
            cells[lin][col] = paper.rect(1 + col * cellSize, 1 + lin * cellSize, cellSize , cellSize).attr({"stroke-width": 1});
         }
      }
      task.clearGrid();
   };

   task.clearGrid = function() {
      if(setIntervalHandle != null) {
         clearInterval(setIntervalHandle);
         setIntervalHandle = null;
      }
      state = [];
      for (var lin = 0; lin < nbLins; lin++) {
         state[lin] = [];
         for (var col = 0; col < nbCols; col++) {
            state[lin][col] = 0;
            if (! task.isGrader)
               cells[lin][col].attr({"fill": "white"});
         }
      }
      if (! task.isGrader)
         cells[0][0].attr({"fill": "red"});
      state[0][0] = 1;
      curLin = 0;
      curCol = 0;
   };

   giveError = function(msg) {
     if (!task.isGrader)
       $("#error").html(msg);
   }

   doParse = function(command) {
    if(command == "")
      return "";

    //Parse le nombre qui doit se trouver en tete
    if(command.charAt(0) < '0' || command.charAt(0) > '9') {
      giveError("Je ne comprends pas votre programme.");
      return undefined;
    }
    var pos = 0;
    var num = 0;
    while(command.charAt(pos) >= '0' && command.charAt(pos) <= '9') {
      num = num * 10 + command.charCodeAt(pos) - "0".charCodeAt(0);
      pos++;
    }
    var end = pos;
    var commandCur;
    if(command.charAt(pos) == '(') {
      var idx = 1;
      while(idx > 0) {
        end++;
        if(end == command.length) {
          giveError("Je ne comprends pas votre programme.");
          return undefined;
        }
        if(command.charAt(end) == '(')
          idx++;
        if(command.charAt(end) == ')')
          idx--;
      }
      var commandCur = doParse(command.substr(pos+1, end-pos-1));
      if(commandCur == undefined)
        return undefined;
      end++;
    }
    else if(command.charAt(pos) == 'S' || command.charAt(pos) == 'N' ||
            command.charAt(pos) == 'O' || command.charAt(pos) == 'E') {
      end++;
      commandCur = command.charAt(pos);
    } else {
      giveError("Je ne comprends pas votre programme.");
      return undefined;
    }
    var commandNext = doParse(command.substring(end));
    if(commandNext == undefined)
      return undefined;

    if(commandCur.length * num + commandNext.length > 1000) {
      giveError("Votre programme mettrait trop de temps à s'exécuter.");
      return undefined;
    }
    return new Array(num+1).join(commandCur) + commandNext;
   };

   task.executeAnswer = function() {
      task.getAnswer(function(strAnswer) {
         task.execute(strAnswer);
      });
   }

   task.execute = function(command) {
     task.clearGrid();
     if (!task.isGrader)
       $("#error, #success").html("");
     command = command.replace(/\s+/g, '').toUpperCase();
     if(command.length > 50) {
       giveError("Le programme est trop long&nbsp;! Vous ne devez pas dépasser 50 caractères.");
       return;
     }
     command = doParse(command);
     if(command == undefined)
       return;
     var pos = 0;
     if (task.isGrader) {
        for (var pos = 0; pos < command.length; pos++) {
           if (!executeStep(command.charAt(pos))) {
              break;
           }
        }
        // to be called by the grader: successState();
     } else {
        if (typeof Tracker !== 'undefined') {Tracker.trackData({dataType:"clickitem", item:"execute"});}
        setIntervalHandle = setInterval(function () {
          if(pos == command.length) {
            clearInterval(setIntervalHandle);
            if (task.successState()) {
               platform.validate("done", function(){});
            }
            return;
          }
         if (!executeStep(command.charAt(pos))) {
            giveError("Aïe, le robot est sorti de la zone à peindre&nbsp;!");
            clearInterval(setIntervalHandle);
         }
          pos++;
        }, 200);
     }
   };

   task.successState = function() {
     if (!task.isGrader)
        $("#error, #success").html();
      for (var lin = 0; lin < nbLins; lin++) {
         for (var col = 0; col < nbCols; col++) {
            if (state[lin][col] != data[lin][col]) {
               return false;
            }
         }
      }
     if (!task.isGrader)
        $("#success").html("Bravo ! Le robot a bien reproduit le motif.");
      return true;
   };

   executeStep = function(letter) {
      if (! task.isGrader)
         cells[curLin][curCol].attr({"fill": "gray"});
      if(letter == 'E') curCol++;
      else if(letter == 'O') curCol--;
      else if(letter == 'S') curLin++;
      else if(letter == 'N') curLin--;
      if ((curCol < 0) || (curCol >= nbCols) || (curLin < 0) || (curLin >= nbLins)) {
         return false;
      } else {
         if (! task.isGrader)
            cells[curLin][curCol].attr({"fill": "red"});
         state[curLin][curCol] = 1;
      }
      return true;
   };
}
initTask();
