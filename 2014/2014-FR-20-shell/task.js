function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         initFiles: [
            { name: "bibi", size: "90" }
            ],
         endFiles: [
            { name: "baba", size: "90" },
            { name: "bibi", size: "90" }
            ]
      },
      medium: {
         initFiles: [
            { name: "bibi", size: "90" },
            { name: "momo", size: "30" },
            { name: "toto", size: "70" },
            { name: "zora", size: "50" }
            ],
         endFiles: [
            { name: "momo", size: "30" },
            { name: "zora", size: "50" }
            ]
      },
      hard: {
         initFiles: [
            { name: "momo", size: "50" },
            { name: "zora", size: "90" }
            ],
         endFiles: [
            { name: "momo", size: "90" },
            { name: "zora", size: "50" }
            ]
      }
   };
   var curFiles;
   var output = "";

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      curFiles = JSON.parse(JSON.stringify(data[level].initFiles));
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
         curFiles = executeCommands(answer);
      }
   };

   subTask.resetDisplay = function() {
      initHandlers();
      updateDisplay();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [];
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      var result = { successRate: 1, message: taskStrings.success };
      var files = executeCommands(answer,true);
         if (!isFinished(files)) {
            result = { successRate: 0, message: taskStrings.failure };
         }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initHandlers() {
      $("#shell_input").off("keyup");
      $("#shell_input").keyup(function (e) {
          if (e.keyCode == 13) { // touche entrée
              executeInput();
          }
      });
      $("#execute").off("click");
      $("#execute").click(executeInput);
   };

   var isValidName = function(fname) {
      return /^[a-zA-Z0-9_]+$/.test(fname) && fname.length <= 12;
   };

   var indexOfFile = function(files, fname) {
      for (var i = 0; i < files.length; i++) {
         if (files[i].name == fname) {
            return i;
         }
      }
      return -1;
   };

   var getSpaces = function(nb) {
      return Array(nb+1).join(" ");
   };

   var sortFiles = function(files) {
      files.sort(function(f1, f2){
            return (f1.name < f2.name) ? -1 : 1;
         });
   };

   var executeCommands = function(commands,final) {
      var files = (final) ? JSON.parse(JSON.stringify(data[level].initFiles)) : curFiles;
      for (var i = 0; i < commands.length; i++) {
         executeCommand(files, commands[i]);
      }
      return files;
   };

   var executeCommand = function(files, command) {
      var msg = '';
      var pieces = $.grep(command.split(" "), function(s) { return s != ""});
      var nb = pieces.length;
      if (nb == 0 || pieces[0] == "") { // split is not supposed to return the empty array
         msg = "";
      } else {
         var op = pieces[0];
         if ((op == "ls")) {
            if (nb != 1) {
                msg = taskStrings.lsNotFollowedByText;
            } else {
               sortFiles(files);
               if (files.length == 0)
                  msg = taskStrings.noFilePresent;
               for (var i = 0; i < files.length; i++) {
                  var f = files[i]; 
                  // assert (f.name.length <= 12)
                  var spaces = getSpaces(13 - f.name.length);
                  msg += getSpaces(3) + f.name + spaces + f.size + " " + taskStrings.kBUnit;
                  msg += "\n";
               }

            }  
         } else if (op == "rm") {
            if (nb != 2) {
               msg = taskStrings.rmFollowedByFileName;
            } else {
               var fname = pieces[1];
               if (! isValidName(fname)) {
                  msg = taskStrings.invalidFileName;
               } else {
                  var idx = indexOfFile(files, fname);
                  if (idx == -1) {
                     msg = taskStrings.nonexistentFileName;
                  } else {
                     files.splice(idx, 1);
                     msg = taskStrings.fileDeleted;
                  }
               }
            }
         } else if (op == "cp" && level != "medium") {
            if (nb != 3) {
               msg = taskStrings.commandFollowedByTwoFileNames(op);
            } else { 
               var fname1 = pieces[1];
               var fname2 = pieces[2];
               if (! isValidName(fname1)) {
                  msg = taskStrings.invalidFirstFileName;
               } else if (!isValidName(fname2)) {
                  msg = taskStrings.invalidSecondFileName;
               } else if (fname1 == fname2) {
                  msg = taskStrings.twoFileNamesMustBeDifferent;
               } else {
                  var idx1 = indexOfFile(files, fname1);
                  if (idx1 == -1) {
                     msg = taskStrings.nonexistentFirstFileName + taskStrings.cantCopyIt + "\n";
                  } else {
                     var size = files[idx1].size;
                     var idx2 = indexOfFile(files, fname2);
                     if (idx2 != -1) {
                        msg = taskStrings.fileAlreadyExists + taskStrings.cantCopy + "\n";
                      } else {
                        files.push({ name: fname2, size: size });
                        msg = taskStrings.fileCopied + "\n";
                      }
                  }
               }
            }
         } else if (op == "mv" && level == "hard") {
            if (nb != 3) {
               msg = taskStrings.commandFollowedByTwoFileNames(op);
            } else {
               var fname1 = pieces[1];
               var fname2 = pieces[2];
               if (! isValidName(fname1)) {
                  msg = taskStrings.invalidFirstFileName;
               } else if (! isValidName(fname2)) {
                  msg = taskStrings.invalidSecondFileName;
               } else if (fname1 == fname2) {
                  msg = taskStrings.twoFileNamesMustBeDifferent;
               } else {
                  var idx1 = indexOfFile(files, fname1);
                  if (idx1 == -1) {
                     msg = taskStrings.nonexistentFirstFileName + taskStrings.cantRenameIt;
                  } else {
                     var idx2 = indexOfFile(files, fname2);
                     if (idx2 != -1) {
                        msg = taskStrings.fileAlreadyExists + taskStrings.cantRename;
                     } else {
                        files[idx1].name = fname2;
                        msg = taskStrings.fileCopied;
                     }
                  }
               }
            }
         } else {
            msg = taskStrings.unrecognizedCommand;
            if (op == "1s") {
               msg += "\n" + taskStrings.unrecognized1s;
            }
         }
      }
      output = "$ " + command + "\n" + msg + "\n"; // Note: utiliser += pour faire du append
   };

   function executeInput() {
      var command = $("#shell_input").val();
      command = command.toLowerCase();
      $("#shell_input").val("");
      answer.push(command);
      executeCommand(curFiles, command);
      updateDisplay();
      if (isFinished(curFiles)) {
         platform.validate("done");
      }
      $("#shell_input").focus();
   };

   var updateDisplay = function() {
      var shell = $("#shell_output");
      shell.val(output);
      shell.scrollTop(shell[0].scrollHeight);
      $("#infos").html("");
      $("#shell_input").val("");
      if (isFinished(curFiles)) {
         displayHelper.validate("stay");
      }
   };

   var isFinished = function(files) {
      sortFiles(files);
      var a = files;
      var b = data[level].endFiles;
      if (a.length != b.length) {
         return false;
      }
      for (var i = 0; i < a.length; i++) {
         if (! (a[i].name == b[i].name && a[i].size == b[i].size)) {
            return false;
         }
      }
      return true;
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
