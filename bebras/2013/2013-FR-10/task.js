function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         source: 
            "rouge&bleu: violet\n" +
            "jaune&bleu: vert\n" +
            "jaune&rouge: orange\n" +
            "rouge&vert: marron\n" +
            "vert&jaune: vert clair\n" +
            "bleu&vert: bleu-vert\n" +
            "bleu&rouge: violet\n" +
            "bleu&jaune: vert\n" +
            "rouge&jaune: orange\n" +
            "vert&rouge: marron\n" +
            "jaune&vert: vert clair\n" +
            "vert&bleu: bleu-vert\n",
         dest:
            "rouge + bleu = violet\n" +
            "jaune + bleu = vert\n" +
            "jaune + rouge = orange\n" +
            "rouge + vert = marron\n" +
            "vert + jaune = vert clair\n" +
            "bleu + vert = bleu-vert\n" +
            "bleu + rouge = violet\n" +
            "bleu + jaune = vert\n" +
            "rouge + jaune = orange\n" +
            "vert + rouge = marron\n" +
            "jaune + vert = vert clair\n" +
            "vert + bleu = bleu-vert\n"
      },
      medium: {
         source: 
            "mix(rouge,bleu)=violet\n" +
            "mix(jaune,bleu)=vert\n" +
            "mix(jaune,rouge)=orange\n" +
            "mix(rouge,vert)=marron\n" +
            "mix(vert,jaune)=vert clair\n" +
            "mix(bleu,vert)=bleu-vert\n" +
            "mix(bleu,rouge)=violet\n" +
            "mix(bleu,jaune)=vert\n" +
            "mix(rouge,jaune)=orange\n" +
            "mix(vert,rouge)=marron\n" +
            "mix(jaune,vert)=vert clair\n" +
            "mix(vert,bleu)=bleu-vert\n",
         dest:
            "rouge + bleu = violet\n" +
            "jaune + bleu = vert\n" +
            "jaune + rouge = orange\n" +
            "rouge + vert = marron\n" +
            "vert + jaune = vert clair\n" +
            "bleu + vert = bleu-vert\n" +
            "bleu + rouge = violet\n" +
            "bleu + jaune = vert\n" +
            "rouge + jaune = orange\n" +
            "vert + rouge = marron\n" +
            "jaune + vert = vert clair\n" +
            "vert + bleu = bleu-vert\n"
      },
      hard: {
         source:
            "((42-3)+5),8:5,72\n" +
            "((33-2)+4),9:4,33\n" +
            "((25-6)+7),3:3,17\n" +
            "((70-1)+2),5:3,11\n" +
            "((12-5)+5),3:2,10\n" +
            "((12-3)+5),8:5,72\n" +
            "((23-2)+4),4:4,23\n" +
            "((35-6)+7),2:6,14\n" +
            "((50-1)+2),5:3,15\n" +
            "((23-5)+2),7:3,56\n" +
            "((99-3)+6),1:4,72\n" +
            "((22-5)+5),3:2,10\n",
         dest: 
            "(42-3+5):8,5::72\n" +
            "(33-2+4):9,4::33\n" +
            "(25-6+7):3,3::17\n" +
            "(70-1+2):5,3::11\n" +
            "(12-5+5):3,2::10\n" +
            "(12-3+5):8,5::72\n" +
            "(23-2+4):4,4::23\n" +
            "(35-6+7):2,6::14\n" +
            "(50-1+2):5,3::15\n" +
            "(23-5+2):7,3::56\n" +
            "(99-3+6):1,4::72\n" +
            "(22-5+5):3,2::10\n"
      }
   };

   var source, dest;

   var maxNbSteps = 11;

   var grid, targetGrid;
   var nbRows, nbCol;

   var compassURL = $("#compass").attr("src");

   var greyCellAttr = {
      stroke: "black",
      fill: "grey"
   };
   var redCellAttr = {
      stroke: "black",
      fill: "red"
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      source = data[level].source;
      dest = data[level].dest;
      // target = data[level].target;
      // nbRows = target.length;
      // nbCol = target[0].length;
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(answer){
         // rng.reset(answer.seed);
      }
   };

   subTask.resetDisplay = function () {
      displayError("");
      initData();
      $("#search, #replace").val("");
      initHandlers();
      // // displayHelper.customValidate = checkResult;
      // displayHelper.hideValidateButton = true;
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = [];
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result;
   }

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initData() {
      $("#source").val(source);
      $("#dest").val(dest);
      updateCurrent();
      $('#nbSteps').html(answer.length);
   };

   function initHandlers() {
      $("#replace_all").off("click");
      $("#replace_all").click(replace);
      $("#cancel").off("click");
      $("#cancel").click(cancel);
      $("#search, #replace").off("keydown");
      $("#search, #replace").keydown(function(){
         displayError("");
      });
      // $("#answer input").keyup(function(){
      //    answer = $(this).val();
      // });
      // $("#validate").off("click");
      // $("#validate").click(function() {
      //    checkResult(false);
      // });
   };

   function replace() {
      displayError("");
      var nbStepsLeft = maxNbSteps - answer.length;
      if (nbStepsLeft <= 0) {
        displayError(taskStrings.tooManySteps);
        return;
      }
      var search = $('#search').val();
      var replace = $('#replace').val();
      var current = $('#current').val();
      answer.push([search, replace]);
      var new_val = executeAnswer();
      if (new_val == current) {
         displayError(taskStrings.noModification);
         answer.pop();
         return
      } 
      updateCurrent();
      $('#nbSteps').html(answer.length);
      if (new_val == dest) {
         platform.validate("done");
      } else if (answer.length == maxNbSteps) {
         displayError(taskStrings.tooManySteps);
      } 
   };

   function cancel() {
      displayError("");
      if (answer.length == 0)
        return;
      answer.pop();
      updateCurrent();
      $('#nbSteps').html(answer.length);
   };

   function updateCurrent() {
      var current = executeAnswer();
      $("#current").val(current);
   };

   var executeAnswer = function() {
      var current = source;
      for (var iStep = 0; iStep < answer.length; iStep++) {
         var step = answer[iStep];
         if (step[0] != "") {
            current = current.replaceAll(step[0], step[1]);
         }
      }
      return current;
  };

   String.prototype.replaceAll = function(target, replacement) {
      return this.split(target).join(replacement);
   };

   function checkResult() {
      if(answer.length > maxNbSteps){
         return { successRate: 0, message: taskStrings.tooManySteps };
      }
      var result = executeAnswer();
      if(result == dest){
         return { successRate: 1, message: taskStrings.success };
      }
      return { successRate:0, message: taskStrings.failure };
   };

   function displayError(msg) {
      $("#error").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
