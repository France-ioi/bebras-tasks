
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

function Task(level) {
   this.level = level;
   this.isGrader = false; // set by load function
   this.setIntervalHandle = null;
   this.paper = null;
   this.cells = [];
   this.state = [];
   this.curLin = 0;
   this.curCol = 0;

   this.data = allData[this.level];
   this.nbLins = this.data.length;
   this.nbCols = this.data[0].length;
}

Task.prototype.load = function(views, callback) {
   loadImageCompass();
   this.drawGrids();
   $(".easy, .hard").hide();
   $("." + this.level).show();
   callback();
};

Task.prototype.showViews = function(views, callback) {
   if (views['forum'] || views['hint'] || views['editor']) {
      //console.error("this task does not have forum, hint nor editor specific view, showing task view instead.");
      views['task'] = true;
   }
   $.each(['task', 'solution'], function(i, view) {
      if (view in views) {
         $('#'+view).show();
      } else {
         $('#'+view).hide();
      }
   });
   if (typeof task.hackShowViews === 'function') {
      task.hackShowViews(views);
   }
   callback();
}

Task.prototype.getViews = function(callback) {
    // all beaver tasks have the same views
    var views = {
        task: {},
        solution: {},
        "hint" : {requires: "task"},
        "forum" : {requires: "task"},
        "editor" : {requires: "task"}
    };
    callback(views);
}

Task.prototype.updateToken = function(token) {
   console.warning("sorry, token system not available on Beaver platform");
};

Task.prototype.getHeight = function(callback) {
   callback(parseInt($("html").height()));
};

Task.prototype.unload = function(callback) {
   if(this.setIntervalHandle != null) {
      clearInterval(this.setIntervalHandle);
      this.setIntervalHandle = null;
   }
   callback();
};

Task.prototype.reloadAnswer = function(strAnswer, callback) {
   // assumes !this.isGrader
   this.clearGrid();
   $("#answer").val(strAnswer);
   callback();
   /* uncomment lines below if you want reloadAnswer to launch execution 
      automatically (including after grading).
   if (strAnswer != '') {
      this.execute();
   }  
   */
};

Task.prototype.getAnswer = function(callback) {
   callback($("#answer").val());
}; 

Task.prototype.drawGrids = function() {
   // assumes this.isGrader = false
   var cellSize = 18;
   this.paper = Raphael("tableLeft", this.nbCols * (cellSize + 1), this.nbLins * (cellSize + 1));
   for (var lin = 0; lin < this.nbLins; lin++) {
      for (var col = 0; col < this.nbCols; col++) {
         var fill = "white";
         if (this.data[lin][col] == 1) {
            fill = "gray";
         }
         this.paper.rect(1 + col * cellSize, 1 + lin * cellSize, cellSize , cellSize).attr({"stroke-width": 1, "fill": fill});
      }
   }
   this.paper = Raphael("tableRight", this.nbCols * (cellSize + 1), this.nbLins * (cellSize + 1));
   this.cells = [];
   for (var lin = 0; lin < this.nbLins; lin++) {
      this.cells[lin] = [];
      for (var col = 0; col < this.nbCols; col++) {
         this.cells[lin][col] = this.paper.rect(1 + col * cellSize, 1 + lin * cellSize, cellSize , cellSize).attr({"stroke-width": 1});
      }
   }
   this.clearGrid();
};

Task.prototype.clearGrid = function() {
   if(this.setIntervalHandle != null) {
      clearInterval(this.setIntervalHandle);
      this.setIntervalHandle = null;
   }
   this.state = [];
   for (var lin = 0; lin < this.nbLins; lin++) {
      this.state[lin] = [];
      for (var col = 0; col < this.nbCols; col++) {
         this.state[lin][col] = 0;
         if (! this.isGrader)
            this.cells[lin][col].attr({"fill": "white"});
      }
   }
   if (! this.isGrader)
      this.cells[0][0].attr({"fill": "red"});
   this.state[0][0] = 1;
   this.curLin = 0;
   this.curCol = 0;
};

Task.prototype.giveError = function(msg) {
  if (!this.isGrader)
    $("#error").html(msg);
}

Task.prototype.doParse = function(command) {
 if(command == "")
   return "";

 //Parse le nombre qui doit se trouver en tete
 if(command.charAt(0) < '0' || command.charAt(0) > '9') {
   this.giveError("Je ne comprends pas votre programme.");
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
       this.giveError("Je ne comprends pas votre programme.");
       return undefined;
     }
     if(command.charAt(end) == '(')
       idx++;
     if(command.charAt(end) == ')')
       idx--;
   }
   var commandCur = this.doParse(command.substr(pos+1, end-pos-1));
   if(commandCur == undefined)
     return undefined;
   end++;
 }
 else if(command.charAt(pos) == 'S' || command.charAt(pos) == 'N' ||
         command.charAt(pos) == 'O' || command.charAt(pos) == 'E') {
   end++;
   commandCur = command.charAt(pos);
 } else {
   this.giveError("Je ne comprends pas votre programme.");
   return undefined;
 }
 var commandNext = this.doParse(command.substring(end));
 if(commandNext == undefined)
   return undefined;

 if(commandCur.length * num + commandNext.length > 1000) {
   this.giveError("Votre programme mettrait trop de temps à s'exécuter.");
   return undefined;
 }
 return new Array(num+1).join(commandCur) + commandNext;
};

Task.prototype.executeAnswer = function() {
   var that = this;
   this.getAnswer(function(strAnswer) {
      that.execute(strAnswer);
   });
}

Task.prototype.execute = function(command) {
  this.clearGrid();
  if (!this.isGrader)
    $("#error, #success").html("");
  command = command.replace(/\s+/g, '').toUpperCase();
  if(command.length > 50) {
    this.giveError("Le programme est trop long&nbsp;! Vous ne devez pas dépasser 50 caractères.");
    return;
  }
  command = this.doParse(command);
  if(command == undefined)
    return;
  var pos = 0;
  if (this.isGrader) {
     for (var pos = 0; pos < command.length; pos++) {
        if (!this.executeStep(command.charAt(pos))) {
           break;
        }
     }
     // to be called by the grader: successState();
  } else {
     if (typeof Tracker !== 'undefined') {Tracker.trackData({dataType:"clickitem", item:"execute"});}
     var theTask = this;
     this.setIntervalHandle = setInterval(function () {
       if(pos == command.length) {
         clearInterval(theTask.setIntervalHandle);
         if (theTask.successState()) {
            platform.validate("done", 1);
         }
         return;
       }
      if (!theTask.executeStep(command.charAt(pos))) {
         theTask.giveError("Aïe, le robot est sorti de la zone à peindre&nbsp;!");
         clearInterval(theTask.setIntervalHandle);
      }
       pos++;
     }, 200);
  }
};

Task.prototype.successState = function() {
  if (!this.isGrader)
     $("#error, #success").html();
   for (var lin = 0; lin < this.nbLins; lin++) {
      for (var col = 0; col < this.nbCols; col++) {
         if (this.state[lin][col] != this.data[lin][col]) {
            return false;
         }
      }
   }
  if (!this.isGrader)
     $("#success").html("Bravo ! Le robot a bien reproduit le motif.");
   return true;
};

Task.prototype.executeStep = function(letter) {
   if (! this.isGrader)
      this.cells[this.curLin][this.curCol].attr({"fill": "gray"});
   if(letter == 'E') this.curCol++;
   else if(letter == 'O') this.curCol--;
   else if(letter == 'S') this.curLin++;
   else if(letter == 'N') this.curLin--;
   if ((this.curCol < 0) || (this.curCol >= this.nbCols) || (this.curLin < 0) || (this.curLin >= this.nbLins)) {
      return false;
   } else {
      if (! this.isGrader)
         this.cells[this.curLin][this.curCol].attr({"fill": "red"});
      this.state[this.curLin][this.curCol] = 1;
   }
   return true;
};
