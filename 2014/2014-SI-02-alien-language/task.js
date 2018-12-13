function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         instructions: [ "Mi", "La", "Si", "Do" ],
         prefix: [0, 2, 2, 1, 3 ],
         maxSequenceLength: 5,
         solution: [ [ 1, 2, 1, 3, 3 ] ]
      },
      medium: {
         instructions: [ "Mi", "La", "Si", "Do" ],
         prefix: [0, 0, 1, 1, 2 ],
         maxSequenceLength: 7,
         solution: [
            [ 3, 2, 2, 1, 0, 1, 2 ],
            [ 1, 0, 1, 2, 2, 3, 2 ] ]
      },
      hard: {
         instructions: [ "Mi", "La", "Si" ],
         prefix: [1, 1, 2, 1, 1, 2, 1, 2 ],
         maxSequenceLength: 12,
         solution: [ [ 1, 0, 1, 1, 0, 1, 0, 1, 2, 1, 2, 1 ] ]
      }
   };
   var instructions;
   var prefix;
   var maxSequenceLength;
   var solution;
   var dragAndDrop;
   var instructionDefs;
   var widthLabel = 40;
   var heightLabel = 35;
   var spaceLabel = 40;
   var paper;
   var paperWidth = 770;
   var paperHeight = 130;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      prefix = data[level].prefix;
      instructions = data[level].instructions;
      maxSequenceLength = data[level].maxSequenceLength;
      solution = data[level].solution;
      paperHeight += (level == "hard") ? (widthLabel + spaceLabel) : 0;
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
      initPrefix();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [];
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      var result;
      if (answer.length == 0) {
            result = { successRate: 0, message: taskStrings.placeNotesOnCells};
         } else if (isCorrect(answer)) {
            result = { successRate: 1, message: taskStrings.success };
         } else {
            result = { successRate: 0, message: taskStrings.failure };
            // <br> (Le robot ne se déplace pas sur l'image, c'est normal.)
         }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initPrefix() {
      var text = "";
      for(var iPrefix = 0; iPrefix < prefix.length; iPrefix++){
         text += instructions[prefix[iPrefix]];
         if(iPrefix < prefix.length - 1){
            text += ", ";
         }
      }
      $("#prefix").text(text);
   };

   function stackSize() {
      var objects = dragAndDrop.getObjects('seq');
      var size = 0;
      while ((size < objects.length) && (objects[size] != null)) {
         size++;
      }
      return size;
   }

   var makeInstr = function(instr, x, y) {
      if(!instr){
         return [];
      }
      var label = paper.rect(x-widthLabel/2, y-heightLabel/2, widthLabel, heightLabel, heightLabel/5)
                      .attr({'fill': '#E0E0F8'});
      var text = paper.text(x, y, instr)
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
   };

   var drawPaper = function() {
      var width = paperWidth;
      var height = paperHeight;
      var sequenceY = 100;
      paper = subTask.raphaelFactory.create("programming","programming",width,height);
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            displayHelper.stopShowingResult();
            answer = dragAndDrop.getObjects('seq');
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType)
         {
            if (dstCont == 'seq') {
               var maxiPos = stackSize();
               if (srcCont == 'seq')
                  maxiPos--;
               if (dstPos <= maxiPos)
                  return true;
               if (maxiPos < maxSequenceLength)
                  return action(dstCont, maxiPos, 'insert');
            }
            return dstCont == null;
         }
      });
      var prefixW = prefix.length * widthLabel;
      var containerW = maxSequenceLength * widthLabel;
      if(level != "hard"){
         var spacing = 10;
         var prefixX = (paperWidth - (prefixW + containerW + spacing))/2;
         var containerY = sequenceY;
         var containerX = spacing + prefixX + prefixW + (widthLabel*maxSequenceLength)/2;
      }else{
         var prefixX = (paperWidth - prefixW)/2 + widthLabel/2;
         var containerY = sequenceY + widthLabel + spaceLabel;
         var containerX = (paperWidth - containerW)/2 + (widthLabel*maxSequenceLength)/2;
      }
      for (var iPrefix = 0; iPrefix < prefix.length; iPrefix++) {
         var str = instructions[prefix[iPrefix]];
         var elems = makeInstr(str, prefixX + iPrefix * widthLabel, sequenceY);
      }
      var backgroundTarget = paper.rect(-widthLabel/2,-heightLabel/2,widthLabel,heightLabel)
         .attr('fill', '#F2F2FF');
      dragAndDrop.addContainer({
         ident : 'seq',
         cx : containerX,   // container pos
         cy : containerY,
         widthPlace : widthLabel, 
         heightPlace : heightLabel,
         nbPlaces : maxSequenceLength,
         dropMode : 'insertBefore',
         dragDisplayMode : 'preview',
         direction : 'horizontal', 
         align : 'left',
         placeBackgroundArray : [backgroundTarget]
      });
      instructionDefs = [];
      var instructionsW = instructions.length*widthLabel + (instructions.length - 1)*spaceLabel;
      var instructionsX = (paperWidth - instructionsW)/2;
      for (var iInstr = 0; iInstr < instructions.length; iInstr++) {
         var elems = makeInstr(instructions[iInstr], 0, 0);
         instructionDefs[iInstr] = dragAndDrop.addContainer({
            ident : iInstr,
            cx : instructionsX + widthLabel/2 + iInstr * (widthLabel+spaceLabel),      // source pos
            cy : 10 + heightLabel/2, 
            widthPlace : widthLabel, 
            heightPlace : heightLabel,
            type : 'source',
            sourceElemArray : elems,
            align: 'left'
         });
      }
      dragAndDrop.insertObjects('seq', 0, $.map(answer, function(iInstr) {
         return {
            ident : iInstr,
            elements: makeInstr(instructions[iInstr], 0, 0)
         };
      }));
   };

   var isCorrect = function(sequence) {
      for(var iSol = 0; iSol < solution.length; iSol++){
         if(Beav.Object.eq(sequence, solution[iSol])){
            return true;
         }
      }
      return false;
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();