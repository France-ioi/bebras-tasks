var grader = {
   gradeTask: function(strAnswer, answerToken, callback) {
      var taskParams = platform.getTaskParams();
      var current = task.executeAnswer(strAnswer);
      var score = taskParams.minScore;
      var dest = task.dest[task.level];
      if (current == dest) {
         score = taskParams.maxScore;
      }
      if (typeof callback !== 'undefined') {
         callback(score);
      } else {
         return score;
      }
   }
}
