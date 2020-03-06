function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         
      },
      medium: {
         
      },
      hard: {
        
      }
   };

   var paper;
   var paperWidth = 320;
   var paperHeight = 320;

   var rng;
   var flowerRaph = [];

   var nbPetals = 10;
   var names = [ "Bijou", "Calin", "Demon", "Fripon", "Mini", "Nino", "Perle", "Pirate", "Tigris", "Yuki" ];
   
   var flowerAttr = {
      circle: {
         stroke: "none",
         fill: "yellow"
      },
      petal: {
         stroke: "#6464ff",
         "stroke-width": 3,
         fill: "#d7d7f4"
      },
      text: {
         "font-size": 22
      }
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      rng = new RandomGenerator(subTask.taskParams.randomSeed);
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(answer){
         rng.reset(answer.seed);
      }
   };

   subTask.resetDisplay = function () {
      if(level == "medium"){
         $("#lastPetal").text(answer.names[answer.last]);
      }else if(level == "hard"){
         $("#firstPetal").text(answer.names[answer.first]);
      }
      displayError("");
      initFlower();
      initNames();
      if(!answer.waitForRetry){
         initHandlers();
         displayHelper.setValidateString(taskStrings.validate);
         displayHelper.customValidate = checkResult;
      }else{
         displayHelper.setValidateString(taskStrings.retry);
         displayHelper.customValidate = retry;
      }
      displayHelper.confirmRestartAll = false;
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = { 
         names: JSON.parse(JSON.stringify(names)), 
         selectedName: null, 
         waitForRetry: false,
         seed: rng.nextInt(1,10000) };
      rng.shuffle(defaultAnswer.names);
      if(level == "medium"){
         defaultAnswer.last = rng.nextInt(0,nbPetals);
      }else if(level == "hard"){
         defaultAnswer.first = rng.nextInt(0,nbPetals);
      }
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

   function initFlower() {
      paper = subTask.raphaelFactory.create("flower","flower",paperWidth,paperHeight);
      $("#flower").css({
         width: paperWidth
      });
      drawFlower();
   };

   function initNames() {
      $("#names").empty();
      var html = "<table>";
      for(var iLine = 0; iLine < 2; iLine++){
         html += "<tr>";
         for(var iName = iLine*5; iName < 5*(iLine + 1); iName++){
            var name = names[iName];
            html += "<td><span>"+name+"</span></td>";
         }
         html += "</tr>";
      }
      html += "</table>";
      $("#names").append(html);
   };

   function initHandlers() {
      $("#names td span").click(clickName);
      for(var iPetal = 0; iPetal < nbPetals; iPetal++){
         flowerRaph[iPetal].click(clickPetal(iPetal));
         flowerRaph[iPetal].attr("cursor","pointer");
      }
   };

   function removeHandlers() {
      $("#names td span").off("click");
      for(var iPetal = 0; iPetal < nbPetals; iPetal++){
         flowerRaph[iPetal].unclick();
         flowerRaph[iPetal].attr("cursor","auto");
      }
   };

   function clickName(ev) {
      displayError("");
      var name = $(this).text();
      $("#names span").removeClass("selected");
      if(answer.selectedName == name){
         answer.selectedName = null;
      }else{
         answer.selectedName = name;
         $(this).addClass("selected");
      }
   };

   function clickPetal(id) {
      return function() {
         displayError("");
         var selectedColor = "#404040";
         if(flowerRaph[id][0].attr("fill") === selectedColor){
            var color = (level == "hard" && id%2 == 0) ? "white" : "#d7d7f4";
            flowerRaph[id][0].animate({fill: color }, 200);      
         }else{
            flowerRaph[id][0].animate({fill: selectedColor}, 200);
         }

      }
   };

   function drawFlower() {
      var attr = flowerAttr;
      var xc = paperWidth/2;
      var yc = paperHeight/2;
      var petalPath = "m 258.89894,342.10423 c 0,0 32.77005,24.26712 29.74635,53.04765 -7.1824,68.36485 -29.74635,104.60799 -29.74635,104.60799 0,0 -17.84781,-26.45267 -29.74634,-107.58262 -4.1469,-28.2756 29.74634,-50.07302 29.74634,-50.07302 z";
      var x0 = -95.875;
      var y0 = -339.84375;
      for(var iPetal = 0; iPetal < nbPetals; iPetal++){
         var angle = iPetal*(360/nbPetals);
         var petal = paper.path(petalPath).transform("t"+x0+" "+y0+",r"+angle+" "+(xc - x0)+" "+(yc - y0)).attr(attr.petal);
         if(level == "hard" && iPetal%2 == 0){
            petal.attr("fill","white");
         }
         var xText = xc;
         var yText = yc*0.4;
         var name = paper.text(xText,yText,answer.names[iPetal]).attr(attr.text);
         var textAngle = (angle <= 180) ? -90 : 90
         // name.transform("r"+angle+" "+xc+" "+yc+",r"+textAngle);
         name.transform("r"+angle+" "+xc+" "+yc+",r"+textAngle+" "+xText+" "+yText);
         flowerRaph[iPetal] = paper.set(petal,name);
      }
      paper.circle(xc,yc,36).attr(attr.circle);
   };

   function checkResult(noVisual) {
      if(answer.selectedName == null){
         var msg = taskStrings.click;
         if(!noVisual){
            displayError(msg);
         }
         return { successRate: 0, message: msg }
      }

      if(level == "easy"){
         var solID = 3;
      }else if(level == "medium"){
         var solID = (nbPetals + (answer.last - 3))%nbPetals;
      }else{
         var remaining = JSON.parse(JSON.stringify(answer.names));
         remaining[answer.first] = null;
         var nbRemoved = 1;
         var solID = applyInstructions(remaining,nbRemoved,1,answer.first);
      }
      var sol = answer.names[solID];

      if(answer.selectedName != sol){
         var msg = taskStrings.failure;
         if(!noVisual){
            displayError(msg);
            answer.waitForRetry = true;
            displayHelper.setValidateString(taskStrings.retry);
            displayHelper.customValidate = retry;
            removeHandlers();
         }
         return { successRate: 0, message: msg }
      }else{
         if(!noVisual){
            platform.validate("done");
         }
         return { successRate: 1, message: taskStrings.success };
      }
   };

   function applyInstructions(remaining,nbRemoved,step,currPos) {
      switch(step){
         case 1:
            var nextWhite = (currPos + 1)%nbPetals;
            var nbIt = 0;
            while(nbIt < nbPetals && (nextWhite%2 != 0 || !remaining[nextWhite])){
               nextWhite = (nextWhite + 1)%nbPetals;
               nbIt++;
            }
            if(nbIt < nbPetals){
               var petalToRemove = nextWhite;
            }else{
               return applyInstructions(remaining,nbRemoved,step + 1,currPos);
            }
            break;
         case 2:
            var prev = (nbPetals + (currPos - 1))%nbPetals;
            var nbIt = 0;
            while(nbIt < nbPetals && !remaining[prev]){
               prev = (nbPetals + (prev - 1))%nbPetals;
               nbIt++;
            }
            if(nbIt < nbPetals){
               var petalToRemove = prev;
            }else{
               return applyInstructions(remaining,nbRemoved,step + 1,currPos);
            }
            break;
         case 3:
            var prev = (nbPetals + (currPos - 1))%nbPetals;
            var nbIt = 0;
            while(nbIt < nbPetals && (!remaining[prev] || prev%2 == 0)){
               prev = (nbPetals + (prev - 1))%nbPetals;
               nbIt++;
            }
            if(nbIt < nbPetals){
               var petalToRemove = prev;
            }else{
               return applyInstructions(remaining,nbRemoved,step + 1,currPos);
            }
            break;
         case 4:
         default:
            return applyInstructions(remaining,nbRemoved,1,currPos);

      }
      remaining[petalToRemove] = null;
      nbRemoved++;
      if(nbRemoved < nbPetals - 1){
         return applyInstructions(remaining,nbRemoved,step + 1,petalToRemove);
      }else{
         for(var iName = 0; iName < nbPetals; iName++){
            if(remaining[iName]){
               return iName;
            }
         }
      }
   };

   function retry() {
      answer.waitForRetry = false;
      displayHelper.restartAll();
   };

   function displayError(msg) {
      $("#error").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
