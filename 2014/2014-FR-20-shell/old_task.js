function initTask() {
   var difficulty;
   var isEasy;
   var curFiles;
   var inputs;
   var output;

   task.load = function(views, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         difficulty = taskParams.options.difficulty ? taskParams.options.difficulty : "hard";
         isEasy = (difficulty == "easy"); 
         $("." + difficulty).show();

         $("#shell_input").keyup(function (e) {
             if (e.keyCode == 13) { // touche entrée
                 task.executeInput();
             }
         });
         task.reloadAnswer("", callback);
      });
   };

   var commandsOfStrAnswer = function(strAnswer) {
      if (strAnswer == "") { 
         return [];
      }
      return $.parseJSON(strAnswer);
   };

   task.reloadAnswer = function(strAnswer, callback) {
      output = "";
      inputs = commandsOfStrAnswer(strAnswer);
      curFiles = executeCommands(inputs);
      updateDisplay();
      callback();
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify(inputs));
   };

   var getInitFiles = function() {
      if (isEasy)  {
         return [
            { name: "bibi", size: "90" },
            { name: "momo", size: "30" },
            { name: "toto", size: "70" },
            { name: "zora", size: "50" }
            ];
      } else {
         return [
            { name: "momo", size: "50" },
            { name: "zora", size: "90" }
            ];
      }
   };

   var getEndFiles = function() {
      if (isEasy) {
         return [
            { name: "momo", size: "30" },
            { name: "zora", size: "50" }
            ];
      } else {
         return [
            { name: "momo", size: "90" },
            { name: "zora", size: "50" }
            ];
      }
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

   var executeCommands = function(commands) {
      var files = getInitFiles();
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
                  msg += getSpaces(6) + f.name + spaces + f.size + " " + taskStrings.kBUnit;
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
         } else if (op == "cp" && !isEasy) {
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
         } else if (op == "mv" && !isEasy) {
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

   task.executeInput = function() {
      var command = $("#shell_input").val();
      command = command.toLowerCase();
      $("#shell_input").val("");
      inputs.push(command);
      executeCommand(curFiles, command);
      updateDisplay();
      if (isFinished(curFiles)) {
         platform.validate("done");
      }
      $("#shell_input").focus();
   };

   /*
   task.validate = function() {
      if (isFinished(curFiles)) {
         platform.validate("done");
      } else {
         displayHelper.validate("stay");
      }
   };
   */

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
      var b = getEndFiles();
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

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         var commands = commandsOfStrAnswer(strAnswer);
         var files = executeCommands(commands);
         if (isFinished(files)) {
            callback(taskParams.maxScore, taskStrings.success);
         } else {
            callback(taskParams.minScore, taskStrings.failure);
         }
      });
   }
}
initTask();
