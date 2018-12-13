function initTask() {
   var instructions = [
      "Mi", 
      "La",   
      "Si",    
      "Do"
      ];
   var prefix = [0, 0, 1, 1, 2 ];
   var maxSequenceLength = 7;
   var dragAndDrop;
   var instructionDefs;
   var widthLabel = 40;
   var heightLabel = 35;
   var paper;


   function stackSize() {
      var objects = dragAndDrop.getObjects('seq');
      var size = 0;
      while ((size < objects.length) && (objects[size] != null)) {
         size++;
      }
      return size;
   }


   task.load = function(views, callback) {
      // displayHelper.hideValidateButton = true;
      //task.solutions
      drawPaper();
      if (views.solution) {
         $.each(task.solutions, function(idSolution, solution) {
            var labels = $.map(solution, function(iInstr) {return instructions[iInstr]; });
            $("#textSolution" + idSolution).html(labels.join(", "));
         });
      }
      callback();
   }
   
   var makeInstr = function(instr, x, y) {
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
      var width = 512;
      var height = 130;
      var sequenceY = 100;

      paper = Raphael("programming", width, height);
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            displayHelper.stopShowingResult();
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
      for (var iPrefix = 0; iPrefix < prefix.length; iPrefix++) {
         var str = instructions[prefix[iPrefix]];
         var elems = makeInstr(str, 30 + iPrefix * widthLabel, sequenceY);
      }
      var backgroundTarget = paper.rect(-widthLabel/2,-heightLabel/2,widthLabel,heightLabel)
         .attr('fill', '#F2F2FF');
      dragAndDrop.addContainer({
         ident : 'seq',
         cx : 30 + prefix.length * widthLabel + (widthLabel*maxSequenceLength)/2,
         cy : sequenceY,
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
      for (var iInstr = 0; iInstr < instructions.length; iInstr++) {
         var elems = makeInstr(instructions[iInstr], 0, 0);
         var spaceLabel = 40;
         instructionDefs[iInstr] = dragAndDrop.addContainer({
            ident : iInstr,
            cx : 120 + widthLabel/2 + iInstr * (widthLabel+spaceLabel), 
            cy : 10 + heightLabel/2, 
            widthPlace : widthLabel, 
            heightPlace : heightLabel,
            type : 'source',
            sourceElemArray : elems,
            align: 'left'
         });
      }
   };

   var answerOfStrAnswer = function(strAnswer) {
      if (strAnswer == "") {
         return [];
      }
      return $.parseJSON(strAnswer);
   };

   task.reloadAnswer = function(strAnswer, callback) {
      var sequence = answerOfStrAnswer(strAnswer);

      // code avec les nouvelles fonctions :
      dragAndDrop.removeAllObjects('seq');
      dragAndDrop.insertObjects('seq', 0, $.map(sequence, function(iInstr) {
         return {
            ident : iInstr,
            elements: makeInstr(instructions[iInstr], 0, 0)
         };
      }));
      callback();
   };

   task.getAnswer = function(callback) {
      var seq = dragAndDrop.getObjects('seq');
      var sequence = [];
      var iObject = 0;
      while ((iObject < seq.length) && (seq[iObject] != null)) {
         sequence.push(seq[iObject]);
         iObject++;
      }
      callback(JSON.stringify(sequence));
   };

   task.isCorrect = function(sequence) {
      return Beav.Object.eq(sequence, task.solutions[0]) 
          || Beav.Object.eq(sequence, task.solutions[1]);
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         var sequence = answerOfStrAnswer(strAnswer);
         if (sequence.length == 0) {
            callback(taskParams.noScore, taskStrings.placeNotesOnCells);
         } else if (task.isCorrect(sequence)) {
            callback(taskParams.maxScore, taskStrings.success);
         } else {
            callback(taskParams.minScore, taskStrings.failure);
            // <br> (Le robot ne se déplace pas sur l'image, c'est normal.)
         }
      });
   };
}
initTask();