grader.gradeTask= function(strAnswer, answerToken, callback) {
   platform.getTaskParams(null, null, function(taskParams) {
      var current = task.executeAnswer(strAnswer);
      var score = taskParams.minScore;
      var dest = task.dest[task.level];
      if (current == dest) {
         score = taskParams.maxScore;
      }
      callback(score, '');
   });
};
