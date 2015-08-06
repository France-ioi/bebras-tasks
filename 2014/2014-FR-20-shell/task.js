
function initTask() {
   var difficulty;
   var isEasy;
   var curFiles;
   var inputs;
   var output;

   task.load = function(views, callback) {
      // displayHelper.hideValidateButton = true;
      difficulty = platform.getTaskParams("difficulty", "hard");
      isEasy = (difficulty == "easy"); 
      $("." + difficulty).show();

      $("#shell_input").keyup(function (e) {
          if (e.keyCode == 13) { // touche entrée
              task.executeInput();
          }
      });
      task.reloadAnswer("", callback);
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
                msg = "La commande ls ne doit pas être suivie par du texte.\n";
            } else {
               sortFiles(files);
               if (files.length == 0)
                  msg = "Aucun fichier présent.\n"
               for (var i = 0; i < files.length; i++) {
                  var f = files[i]; 
                  // assert (f.name.length <= 12)
                  var spaces = getSpaces(13 - f.name.length);
                  msg += getSpaces(6) + f.name + spaces + f.size + " ko\n";
               }

            }  
         } else if (op == "rm") {
            if (nb != 2) {
               msg = "La commande rm doit être suivie d'un nom de fichier.\n"
            } else {
               var fname = pieces[1];
               if (! isValidName(fname)) {
                  msg = "Le nom de fichier spécifié est invalide.\n";
               } else {
                  var idx = indexOfFile(files, fname);
                  if (idx == -1) {
                     msg = "Le fichier spécifié n'existe pas. Impossible de le supprimer.\n";
                  } else {
                     files.splice(idx, 1);
                     msg = "Le fichier a été supprimé.\n";
                  }
               }
            }
         } else if (op == "cp" && !isEasy) {
            if (nb != 3) {
               msg = "La commande cp doit être suivie de deux noms de fichiers.\n"
            } else { 
               var fname1 = pieces[1];
               var fname2 = pieces[2];
               if (! isValidName(fname1)) {
                  msg = "Le premier nom de fichier spécifié est invalide.\n";
               } else if (!isValidName(fname2)) {
                  msg = "Le second nom de fichier spécifié est invalide.\n";
               } else if (fname1 == fname2) {
                  msg = "Les deux noms fournis doivent être différents\n(majuscules et minuscules sont considérées comme équivalentes).\n";
               } else {
                  var idx1 = indexOfFile(files, fname1);
                  if (idx1 == -1) {
                     msg = "Le premier fichier n'existe pas. Impossible de le copier.\n";
                  } else {
                     var size = files[idx1].size;
                     var idx2 = indexOfFile(files, fname2);
                     if (idx2 != -1) {
                        msg = "Il existe déjà un fichier portant ce nom. Impossible de copier.\n";
                      } else {
                        files.push({ name: fname2, size: size });
                        msg = "Le fichier a été copié.\n";
                      }
                  }
               }
            }
         } else if (op == "mv" && !isEasy) {
            if (nb != 3) {
               msg = "La commande mv doit être suivie de deux noms de fichiers.\n"
            } else {
               var fname1 = pieces[1];
               var fname2 = pieces[2];
               if (! isValidName(fname1)) {
                  msg = "Le premier nom de fichier spécifié est invalide.\n";
               } else if (! isValidName(fname2)) {
                  msg = "Le second nom de fichier spécifié est invalide.\n";
               } else if (fname1 == fname2) {
                  msg = "Les deux noms fournis doivent être différents\n(majuscules et minuscules sont considérées comme équivalentes).\n";
               } else {
                  var idx1 = indexOfFile(files, fname1);
                  if (idx1 == -1) {
                     msg = "Le fichier spécifié n'existe pas. Impossible de le renommer.\n";
                  } else {
                     var idx2 = indexOfFile(files, fname2);
                     if (idx2 != -1) {
                        msg = "Il existe déjà un fichier portant ce nom. Impossible de renommer.\n";
                     } else {
                        files[idx1].name = fname2;
                        msg = "Le fichier a été renommé.\n";
                     }
                  }
               }
            }
         } else if (op == "1s") {
            msg = "Commande non reconnue.\nNotez que 'ls' commence par la lettre 'L' et non par le chiffre '1'.\n";
         } else {
            msg = "Commande non reconnue.\n";
         }
      }
      output = "$ " + command + "\n" + msg; // Note: utiliser += pour faire du append
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
      var taskParams = platform.getTaskParams();
      var commands = commandsOfStrAnswer(strAnswer);
      var files = executeCommands(commands);
      if (isFinished(files)) {
         callback(taskParams.maxScore, "Bravo, vous avez réussi&nbsp;!");
      } else {
         callback(taskParams.minScore, "Vous n'avez pas obtenu l'état souhaité. <br />Essayez d'autres commandes, ou bien recommencez tout.");
      }
   }
}
initTask();
