function initTask() {
   var nbToFind;
   var queries;
   var solutions;
   var difficulty;
   // Note: queriesSolutions is copy-pasted from the code displayed when loading the file "solutions.html"
   var queriesSolutions = "eyJlYXN5IjpbeyJxdWVyeSI6IjYxODMiLCJzb2x1dGlvbnMiOlsiUEFSQyJdfSx7InF1ZXJ5IjoiNjkyMyIsInNvbHV0aW9ucyI6WyJGSUxNIl19LHsicXVlcnkiOiI0MTA1Iiwic29sdXRpb25zIjpbIkRBVEUiXX0seyJxdWVyeSI6IjI4MTMiLCJzb2x1dGlvbnMiOlsiVlJBQyJdfSx7InF1ZXJ5IjoiMDk3NSIsInNvbHV0aW9ucyI6WyJUSUdFIl19LHsicXVlcnkiOiIyMjUxIiwic29sdXRpb25zIjpbIkJMRVUiXX0seyJxdWVyeSI6IjIyNTMiLCJzb2x1dGlvbnMiOlsiQkxPQyJdfSx7InF1ZXJ5IjoiMjg1NiIsInNvbHV0aW9ucyI6WyJCUkVGIl19LHsicXVlcnkiOiIwMTc1Iiwic29sdXRpb25zIjpbIkpVR0UiXX0seyJxdWVyeSI6IjM4MTAiLCJzb2x1dGlvbnMiOlsiQ0hVVCIsIkNIQVQiLCJDUlVUIl19LHsicXVlcnkiOiIzOTUyIiwic29sdXRpb25zIjpbIk1JRUwiLCJDSUVMIl19LHsicXVlcnkiOiI2MTYxIiwic29sdXRpb25zIjpbIlBBUEEiXX0seyJxdWVyeSI6IjgxODUiLCJzb2x1dGlvbnMiOlsiUkFSRSIsIkhVUkUiLCJIQVJPIl19LHsicXVlcnkiOiI4NTI1Iiwic29sdXRpb25zIjpbIlJPTEUiLCJST0JFIiwiUkVWRSIsIkhFTEUiXX0seyJxdWVyeSI6Ijg5ODUiLCJzb2x1dGlvbnMiOlsiUklSRSJdfSx7InF1ZXJ5IjoiOTE3NSIsInNvbHV0aW9ucyI6WyJTQUdFIl19XSwiaGFyZCI6W3sicXVlcnkiOiI3NTI2Iiwic29sdXRpb25zIjpbIkdPTEYiXX0seyJxdWVyeSI6Ijg1OTUiLCJzb2x1dGlvbnMiOlsiUk9TRSJdfSx7InF1ZXJ5IjoiMjE3NSIsInNvbHV0aW9ucyI6WyJMVUdFIl19LHsicXVlcnkiOiI0NTk4Iiwic29sdXRpb25zIjpbIk5PSVIiXX0seyJxdWVyeSI6IjE0OTgiLCJzb2x1dGlvbnMiOlsiVU5JUiJdfSx7InF1ZXJ5IjoiMjE5MCIsInNvbHV0aW9ucyI6WyJMQUlUIiwiTFVJVCJdfSx7InF1ZXJ5IjoiMDEyNSIsInNvbHV0aW9ucyI6WyJUVUJFIiwiVEFMRSIsIkpVQkUiLCJKQUxFIl19LHsicXVlcnkiOiIwMTQ1Iiwic29sdXRpb25zIjpbIkpVRE8iLCJUVU5FIiwiVEFYRSIsIkpBREUiXX0seyJxdWVyeSI6IjAxNjUiLCJzb2x1dGlvbnMiOlsiSlVQRSIsIlRBUEUiXX0seyJxdWVyeSI6IjA1MTAiLCJzb2x1dGlvbnMiOlsiVE9VVCJdfSx7InF1ZXJ5IjoiMDUxOCIsInNvbHV0aW9ucyI6WyJUT1VSIiwiSk9VUiJdfSx7InF1ZXJ5IjoiMTk1OCIsInNvbHV0aW9ucyI6WyJVU0VSIl19LHsicXVlcnkiOiIyMTQ1Iiwic29sdXRpb25zIjpbIkxVTkUiLCJMVVhFIiwiTEFEWSIsIkJBREUiXX0seyJxdWVyeSI6IjI1OTgiLCJzb2x1dGlvbnMiOlsiVk9JUiIsIkxPSVIiXX0seyJxdWVyeSI6IjI5NTEiLCJzb2x1dGlvbnMiOlsiTElFVSJdfSx7InF1ZXJ5IjoiMjk4NSIsInNvbHV0aW9ucyI6WyJMSVJFIiwiVklSRSJdfSx7InF1ZXJ5IjoiMzI1MSIsInNvbHV0aW9ucyI6WyJDTE9VIl19LHsicXVlcnkiOiI0MTQ1Iiwic29sdXRpb25zIjpbIkRVTkUiXX0seyJxdWVyeSI6IjQxNDkiLCJzb2x1dGlvbnMiOlsiREFOUyJdfSx7InF1ZXJ5IjoiNDE5MCIsInNvbHV0aW9ucyI6WyJOVUlUIiwiTkFJVCIsIkRVSVQiXX0seyJxdWVyeSI6IjI1NDAiLCJzb2x1dGlvbnMiOlsiVk9OVCIsIlZFTlQiLCJMRU5UIl19LHsicXVlcnkiOiI0NTQwIiwic29sdXRpb25zIjpbIkRPTlQiLCJERU5UIl19LHsicXVlcnkiOiI0NTQzIiwic29sdXRpb25zIjpbIkRPTkMiXX0seyJxdWVyeSI6IjUwODUiLCJzb2x1dGlvbnMiOlsiRVRSRSJdfSx7InF1ZXJ5IjoiNTE4OSIsInNvbHV0aW9ucyI6WyJPVVJTIl19LHsicXVlcnkiOiI2MjUxIiwic29sdXRpb25zIjpbIkZMT1UiXX0seyJxdWVyeSI6IjY1OTIiLCJzb2x1dGlvbnMiOlsiUE9JTCIsIkZPSUwiXX0seyJxdWVyeSI6Ijg1NDQiLCJzb2x1dGlvbnMiOlsiUk9ORCIsIlJFTkQiXX1dfQ==";
   // - queries is an array of 4-digit numbers
   // - answers is an array of the same size that contains arrays of words (the valid answers)
   var addQuerySolution = function(queryAndAnswer) {
      queries.push(queryAndAnswer.query);
      solutions.push(queryAndAnswer.solutions);
   };
   
   var pickQueriesSolutions = function(randomSeed) {
      // loading one easy word and two hard words
      queries = [];
      solutions = [];
      var all = $.parseJSON($.base64.decode(queriesSolutions));
      for (var iQuery = 0; iQuery < 1; iQuery++) {
         addQuerySolution(all.easy[randomSeed % all.easy.length]);
      }
      for (var iQuery = 1; iQuery < 3; iQuery++) {
         addQuerySolution(all.hard[(randomSeed + iQuery * 17)% all.hard.length]);
      }
   };
   
   task.load = function(views, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         difficulty = taskParams.options.difficulty ? taskParams.options.difficulty : "hard";
         if (difficulty == "hard") {
            nbToFind = 2;
         } else {
            nbToFind = 1;
         }
         if (nbToFind == 1) {
            $("#nb_to_find_text").html("un seul");
         } else {
            $("#nb_to_find_text").html(nbToFind);
         }

         pickQueriesSolutions(taskParams.randomSeed);
         var secret = $("#secret");
         var changeWrapper = function(i) {
            return function() { eventChange(i); };
         };
         var restartWrapper = function(i) {
            return function() { eventRestart(i); };
         };
         for (var i = 0; i < queries.length; i++) {
            /* Remark: the following does not work:
               var secret_i = secret.clone().attr('id', "#secret_" + i);
               $(".secret_table").append(secret_i); */
            var secret_i = $("#secret_" + i);
            $("#secret_" + i + " .query").html(queries[i] + " : ");
            $("#secret_" + i + " .answer").keyup(changeWrapper(i));
            $("#secret_" + i + " .restart").click(restartWrapper(i));
            $("#secret_" + i + " .restart").hide();
            secret_i.show();
         }

         if (views.solution) {
            for (var iQuery = 0; iQuery < queries.length; iQuery++) {
               $("#textSolution").append("<li>" + queries[iQuery] + " : " + solutions[iQuery].join( " ou ") + ".</li>");
            }
         }
         callback();
      });
   };

   task.reloadAnswer = function(strAnswer, callback) {
      var answers;
      if (strAnswer != "") {
         answers = $.parseJSON(strAnswer);
      } else {
         answers = Beav.Array.make(queries.length, "");
      }
      for (var i = 0; i < queries.length; i++)  {
         $("#secret_" + i + " .answer").val(answers[i]);
         updateFeedback(i);
      }
      callback();
   };

   task.getAnswer = function(callback) {
      var answers = [];
      for (var i = 0; i < queries.length; i++)
         answers.push(getWord(i));
      callback(JSON.stringify(answers));
   };

   var getWord = function(i) {
      return $("#secret_" + i + " .answer").val();
   };

   var isWordFound = function(i) {
      return Beav.Array.has(solutions[i], getWord(i));
   };

   var nbWordsFound = function() {
      var count = 0;
      for (var i = 0; i < queries.length; i++) {
         if (isWordFound(i)) {
            count++;
         }
      }
      return count;
   };

   var eventRestart = function(i) {
      $("#secret_" + i + " .answer").val('');
      eventChange(i);
      $("#secret_" + i + " .answer").focus();
   };
   
   var updateFeedback = function(i) {
      $("#secret_" + i + " .restart").hide();
      $("#secret_" + i + " .feedback").hide();
      var word = getWord(i);
      if (word.length == 4) {
         var upWord = word.toUpperCase();
         if (upWord !== word) { 
            word = upWord;
            $("#secret_" + i + " .answer").val(word);
         }
         var feedback = "";
         if (isWordFound(i)) { 
            feedback = "C'est bon&nbsp;!";
            // if (i < queries.length - 1)
            //    $("#secret_" + (i+1) + " .answer").focus();
         } else {
            feedback = "Mot incorrect.";
            $("#secret_" + i + " .restart").show();
         }
         $("#secret_" + i + " .feedback").html(feedback);
         $("#secret_" + i + " .feedback").show();
         return true;
      }
      return false;
   };

   var eventChange = function(i) {
      var newWord = updateFeedback(i);
      if (newWord) {
         if (nbWordsFound() >= nbToFind) {  
            platform.validate("done");
         } else {
            displayHelper.validate("stay");
         }
      }
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         if (strAnswer == "") { 
            callback(taskParams.noScore, "Tapez des mots dans les boîtes ci-dessus.");
            return;
         }
         pickQueriesSolutions(taskParams.randomSeed);
         var answers = $.parseJSON(strAnswer);
         var count = 0;
         for (var i = 0; i < queries.length; i++) {
            if (Beav.Array.has(solutions[i], answers[i])) {
               count++;
            }
         }
         
         if (count >= nbToFind) {
            callback(taskParams.maxScore, "Bravo&nbsp;! Vous avez réussi&nbsp;!");
         } else {
            var nbLeft = nbToFind - count;
            var msg = "Il vous reste " + nbLeft + " mot" + ((nbLeft > 1) ? "s" : "") + " à trouver.";
            var score = 0;
            if (count > 0) {
               var full = taskParams.maxScore;
               if (nbLeft <= 0) {
                  score = full;
               } else {
                  score = Math.round(full/2 + full/2 * (count-1) / (nbToFind-1));
               }
            }
            callback(score, msg);
         }
      });
   }
}
initTask();
