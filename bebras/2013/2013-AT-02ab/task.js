function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         passwords: [
            "R5#a",
            "Ouvre-T@1",
            "1Grand-Pere",
            "Sesame7",
            "100%grandpa",
            "P@ss%word"
         ],
         solution: [1,2,4]
      },
      medium: {
         passwords: [
            "R5#a",
            "Ouvre-T@1",
            "1Grand-Pere",
            "Sesame7",
            "100%grandpa",
            "P@ss%word"
         ],
         solution: [1,2]
      },
      hard: {
         passwords: [
            "M0t_de_p4sse",   //wrong _
            "mot-2-passe",    // miss uppercase
            "mOtDePa$$E",  // miss number
            "Mot2passe!",  // good
            "MOT2P&SSE",   // miss lowercase
            "M0t-de-passe",   // good
            "Mo1DEp455E",  // miss char
            "m02P@ss" // too short

         ],
         solution: [3,5]
      }
   };

   var passwords;
   var solution;

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      passwords = data[level].passwords;
      solution = data[level].solution;
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(answer){

      }
   };

   subTask.resetDisplay = function () {
      initMultipleChoice();
      initHandlers();
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = Beav.Array.make(passwords.length,false);
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var nbGood = 0;
      var nbWrong = 0;
      for(var iAnswer = 0; iAnswer < answer.length; iAnswer++){
         if(Beav.Array.has(solution,iAnswer) && answer[iAnswer]){
            nbGood++;
         }else if(!Beav.Array.has(solution,iAnswer) && answer[iAnswer]){
            nbWrong++;
         }
      }
      if(nbWrong > 0){
         return { successRate: 0, message: taskStrings.failure };
      }
      if(nbGood == 0){
         return { successRate: 0, message: taskStrings.check };

      }
      if(nbGood < solution.length){
         return { successRate: 0, message: taskStrings.missing };
      }
      return { successRate: 1, message: taskStrings.success };
   }

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initMultipleChoice() {
      var html = "";
      for(var iPassword = 0; iPassword < passwords.length; iPassword++){
         var password = passwords[iPassword];
         html += "<input type=\"checkbox\" id=\""+iPassword+"\""
         html += (answer[iPassword]) ? " checked" : "";
         html += "><label for=\""+iPassword+"\">"+password+"</label><br/>";
      }
      $("#checkboxes").empty();
      $("#checkboxes").html(html);
   };

   function initHandlers() {
      $("#checkboxes input").change(function(ev){
         var checked = $(this).is(":checked");
         var id = $(this).attr("id");
         answer[id] = checked;
      })
   };
    
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
