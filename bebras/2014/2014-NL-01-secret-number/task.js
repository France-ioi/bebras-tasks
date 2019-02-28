function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         nbToFind: 1,
         nEasy: 3,
         nHard: 0
      },
      medium: {
         nbToFind: 2,
         nEasy: 1,
         nHard: 2
      },
      hard: {
         nbToFind: 3,
         nEasy: 0,
         nHard: 3
      }
   };
   var nbToFind;
   var nEasy;
   var nHard;
   var queries;
   var solutions;
   // Note: queriesSolutions is copy-pasted from the code displayed when loading the file "solutions.html"
   var queriesSolutions = "eyJlYXN5IjpbeyJxdWVyeSI6IjYxODMiLCJzb2x1dGlvbnMiOlsiUEFSQyJdfSx7InF1ZXJ5IjoiNjkyMyIsInNvbHV0aW9ucyI6WyJGSUxNIl19LHsicXVlcnkiOiI0MTA1Iiwic29sdXRpb25zIjpbIkRBVEUiXX0seyJxdWVyeSI6IjI4MTMiLCJzb2x1dGlvbnMiOlsiVlJBQyJdfSx7InF1ZXJ5IjoiMDk3NSIsInNvbHV0aW9ucyI6WyJUSUdFIl19LHsicXVlcnkiOiIyMjUxIiwic29sdXRpb25zIjpbIkJMRVUiXX0seyJxdWVyeSI6IjIyNTMiLCJzb2x1dGlvbnMiOlsiQkxPQyJdfSx7InF1ZXJ5IjoiMjg1NiIsInNvbHV0aW9ucyI6WyJCUkVGIl19LHsicXVlcnkiOiIwMTc1Iiwic29sdXRpb25zIjpbIkpVR0UiXX0seyJxdWVyeSI6IjM4MTAiLCJzb2x1dGlvbnMiOlsiQ0hVVCIsIkNIQVQiLCJDUlVUIl19LHsicXVlcnkiOiIzOTUyIiwic29sdXRpb25zIjpbIk1JRUwiLCJDSUVMIl19LHsicXVlcnkiOiI2MTYxIiwic29sdXRpb25zIjpbIlBBUEEiXX0seyJxdWVyeSI6IjgxODUiLCJzb2x1dGlvbnMiOlsiUkFSRSIsIkhVUkUiLCJIQVJPIl19LHsicXVlcnkiOiI4NTI1Iiwic29sdXRpb25zIjpbIlJPTEUiLCJST0JFIiwiUkVWRSIsIkhFTEUiXX0seyJxdWVyeSI6Ijg5ODUiLCJzb2x1dGlvbnMiOlsiUklSRSJdfSx7InF1ZXJ5IjoiOTE3NSIsInNvbHV0aW9ucyI6WyJTQUdFIl19XSwiaGFyZCI6W3sicXVlcnkiOiI3NTI2Iiwic29sdXRpb25zIjpbIkdPTEYiXX0seyJxdWVyeSI6Ijg1OTUiLCJzb2x1dGlvbnMiOlsiUk9TRSJdfSx7InF1ZXJ5IjoiMjE3NSIsInNvbHV0aW9ucyI6WyJMVUdFIl19LHsicXVlcnkiOiI0NTk4Iiwic29sdXRpb25zIjpbIk5PSVIiXX0seyJxdWVyeSI6IjE0OTgiLCJzb2x1dGlvbnMiOlsiVU5JUiJdfSx7InF1ZXJ5IjoiMjE5MCIsInNvbHV0aW9ucyI6WyJMQUlUIiwiTFVJVCJdfSx7InF1ZXJ5IjoiMDEyNSIsInNvbHV0aW9ucyI6WyJUVUJFIiwiVEFMRSIsIkpVQkUiLCJKQUxFIl19LHsicXVlcnkiOiIwMTQ1Iiwic29sdXRpb25zIjpbIkpVRE8iLCJUVU5FIiwiVEFYRSIsIkpBREUiXX0seyJxdWVyeSI6IjAxNjUiLCJzb2x1dGlvbnMiOlsiSlVQRSIsIlRBUEUiXX0seyJxdWVyeSI6IjA1MTAiLCJzb2x1dGlvbnMiOlsiVE9VVCJdfSx7InF1ZXJ5IjoiMDUxOCIsInNvbHV0aW9ucyI6WyJUT1VSIiwiSk9VUiJdfSx7InF1ZXJ5IjoiMTk1OCIsInNvbHV0aW9ucyI6WyJVU0VSIl19LHsicXVlcnkiOiIyMTQ1Iiwic29sdXRpb25zIjpbIkxVTkUiLCJMVVhFIiwiTEFEWSIsIkJBREUiXX0seyJxdWVyeSI6IjI1OTgiLCJzb2x1dGlvbnMiOlsiVk9JUiIsIkxPSVIiXX0seyJxdWVyeSI6IjI5NTEiLCJzb2x1dGlvbnMiOlsiTElFVSJdfSx7InF1ZXJ5IjoiMjk4NSIsInNvbHV0aW9ucyI6WyJMSVJFIiwiVklSRSJdfSx7InF1ZXJ5IjoiMzI1MSIsInNvbHV0aW9ucyI6WyJDTE9VIl19LHsicXVlcnkiOiI0MTQ1Iiwic29sdXRpb25zIjpbIkRVTkUiXX0seyJxdWVyeSI6IjQxNDkiLCJzb2x1dGlvbnMiOlsiREFOUyJdfSx7InF1ZXJ5IjoiNDE5MCIsInNvbHV0aW9ucyI6WyJOVUlUIiwiTkFJVCIsIkRVSVQiXX0seyJxdWVyeSI6IjI1NDAiLCJzb2x1dGlvbnMiOlsiVk9OVCIsIlZFTlQiLCJMRU5UIl19LHsicXVlcnkiOiI0NTQwIiwic29sdXRpb25zIjpbIkRPTlQiLCJERU5UIl19LHsicXVlcnkiOiI0NTQzIiwic29sdXRpb25zIjpbIkRPTkMiXX0seyJxdWVyeSI6IjUwODUiLCJzb2x1dGlvbnMiOlsiRVRSRSJdfSx7InF1ZXJ5IjoiNTE4OSIsInNvbHV0aW9ucyI6WyJPVVJTIl19LHsicXVlcnkiOiI2MjUxIiwic29sdXRpb25zIjpbIkZMT1UiXX0seyJxdWVyeSI6IjY1OTIiLCJzb2x1dGlvbnMiOlsiUE9JTCIsIkZPSUwiXX0seyJxdWVyeSI6Ijg1NDQiLCJzb2x1dGlvbnMiOlsiUk9ORCIsIlJFTkQiXX1dfQ==";
   // - queries is an array of 4-digit numbers
   // - answers is an array of the same size that contains arrays of words (the valid answers)
   var randGen;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      nbToFind = data[level].nbToFind;
      nEasy = data[level].nEasy;
      nHard = data[level].nHard;
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
      if (level == "easy") {
         $("#nb_to_find_text").html("un seul");
      } else {
         $("#nb_to_find_text").html(nbToFind);
      }
      pickQueriesSolutions(randGen.nextInt(0,1000));
      
      for (var i = 0; i < queries.length; i++) {
      //     Remark: the following does not work:
      //       var secret_i = secret.clone().attr('id', "#secret_" + i);
      //       $(".secret_table").append(secret_i); 
         var secret_i = $("#secret_" + i);
         $("#secret_" + i + " .query").html(queries[i] + " : ");
         $("#secret_" + i + " .answer").off("keyup");
         $("#secret_" + i + " .restart").off("click");
         $("#secret_" + i + " .answer").keyup(changeWrapper(i));
         $("#secret_" + i + " .restart").click(restartWrapper(i));
         $("#secret_" + i + " .restart").hide();
      }
      reloadAnswer();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = { "words": Beav.Array.make(3, ""), "seed": randGen.nextInt(0,100000) };
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      var result;
      if(Beav.Object.eq(answer.words,["","",""])){
         result = { successRate: 0, message: taskStrings.empty };
      }else{
         pickQueriesSolutions(randGen.nextInt(0,1000));
         var count = 0;
         for (var i = 0; i < queries.length; i++) {
            if (Beav.Array.has(solutions[i], answer.words[i])) {
               count++;
            }
         }
         if (count >= nbToFind) {
            result = { successRate: 1, message: taskStrings.success };
         }else{
            var nbLeft = nbToFind - count;
            if (count > 0) {
               result = { successRate: 0.5, message: taskStrings.remaining(nbLeft) };
            }else{
               result = { successRate: 0, message: taskStrings.failure };
            }
         }
      }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   var changeWrapper = function(i) {
         return function() { eventChange(i); };
      };

   var restartWrapper = function(i) {
      return function() { eventRestart(i); };
   };

   var addQuerySolution = function(queryAndAnswer) {
      queries.push(queryAndAnswer.query);
      solutions.push(queryAndAnswer.solutions);
   };
   
   var pickQueriesSolutions = function(randomSeed) {
      // loading one easy word and two hard words
      queries = [];
      solutions = [];
      var all = $.parseJSON($.base64.decode(queriesSolutions));
      for (var iQuery = 0; iQuery < nEasy; iQuery++) {
         addQuerySolution(all.easy[(randomSeed + iQuery + level.charCodeAt(0)) % all.easy.length]);
      }
      for (var iQuery = nEasy; iQuery < (nEasy + nHard); iQuery++) {
         addQuerySolution(all.hard[(randomSeed + iQuery + level.charCodeAt(0))% all.hard.length]);
      }
   };
   
   var reloadAnswer = function() {
      for (var i = 0; i < queries.length; i++)  {
         $("#secret_" + i + " .answer").val(answer.words[i]);
         updateFeedback(i);
      }
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
      answer.words[i] = getWord(i);
      if (answer.words[i].length == 4) {
         var upWord = answer.words[i].toUpperCase();
         if (upWord !== answer.words[i]) { 
            answer.words[i] = upWord;
            $("#secret_" + i + " .answer").val(answer.words[i]);
         }
         var feedback = "";
         if (isWordFound(i)) { 
            feedback = taskStrings.good;
         } else {
            feedback = taskStrings.wrong;
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
            displayHelper.showPopupMessage(taskStrings.wrong,"blanket");
         }
      }
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
