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
   var names = [
      "Julien", 
      "Paul",   
      "Émilie",    
      "César",
      "Hélène",
      "Rodolf",
      "Yasmine"
   ];
   // var initNames = [ 0, 1, 2, 3, 4, 5, 6 ];
   var initNames = [ 3, 2, 4, 0, 1, 5, 6 ];
   var solution = [ 1, 5, 6, 3, 4, 2, 0 ]; 
   var noScoreNames = initNames;
   var nbNames = names.length;
   var width = 220;
   var height = 250;
   var margin = 10;
   var heightLabel = (height - margin) / nbNames;
   var widthLabel = 160;
   var dragAndDrop;
   var nameDefs;
   var paper;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
      }
   };

   subTask.resetDisplay = function() {
      drawPaper();
      reloadAnswer();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = initNames.slice(0);
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      var result;
      if (Beav.Object.eq(answer, noScoreNames)) {
         result = { successRate: 0, message: taskStrings.moveNames };
      }else if (Beav.Object.eq(answer, solution)) {
         result = { successRate: 1, message: taskStrings.success };
      } else {
         result = { successRate: 0, message: taskStrings.failure };
      }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   var getNameObject = function(iName) {
      var label = paper.rect(-widthLabel/2, -heightLabel/2, widthLabel, heightLabel, heightLabel/5)
                      .attr({'fill': '#E0E0F8'});
      var text = paper.text(0, 0, names[iName])
                      .attr({'font-size' : 15, 'font-weight' : 'bold'});
      $(text.node).css({
         "-webkit-touch-callout": "none",
         "-webkit-user-select": "none",
         "-khtml-user-select": "none",
         "-moz-user-select": "none",
         "-ms-user-select": "none",
         "user-select": "none",
         "cursor" : "default"
      });
      return [label, text];
   }
   
   var drawPaper = function() {
      paper = subTask.raphaelFactory.create("anim","anim",width, height);
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            displayHelper.stopShowingResult();
            answer = dragAndDrop.getObjects('seq');
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType) {
            return (dstCont != null)
         }
      });
      var backgroundTarget = paper.rect(-widthLabel/2,-heightLabel/2,widthLabel,heightLabel)
         .attr('fill', '#6666FF');
      dragAndDrop.addContainer({
         ident : 'seq',
         cx : 120,
         cy : (height-margin)/2,
         widthPlace : widthLabel, 
         heightPlace : heightLabel,
         nbPlaces : nbNames,
         dropMode : 'insertBefore',
         dragDisplayMode : 'preview',
         direction : 'vertical', 
         align : 'top',
         placeBackgroundArray : [backgroundTarget]
      });

      nameDefs = [];
      for (var pos = 0; pos < names.length; pos++) {
         var iName = initNames[pos];
         nameDefs[iName] = dragAndDrop.insertObject('seq', pos, {ident : iName, elements : getNameObject(iName)});
         paper.text(18, margin+heightLabel/4 + pos * heightLabel, (pos+1))
              .attr({'font-size': 22, 'font-weight': 'bold'});

      }
   };

   var reloadAnswer = function() {
      dragAndDrop.removeAllObjects('seq');
      dragAndDrop.insertObjects('seq', 0, $.map(answer, function(iName) {
         return { ident : iName, elements: getNameObject(iName) };
         }
      ));
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
