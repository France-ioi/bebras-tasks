function initTask() {
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

   task.load = function(views, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         if (taskParams.initState == "solution") {
            initNames = task.solution;
         } 

         if (views.solution) {
            var labels = $.map(task.solution, function(pos) {return names[pos]; });
            $("#textSolution").html(labels.join(", "));
         }

         drawPaper();
         callback();
      });
   }

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
      paper = Raphael("anim", width, height);
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            displayHelper.stopShowingResult();
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

   var answerOfStrAnswer = function(strAnswer) {
      if (strAnswer == "") {
         return initNames.slice(0);
      }
      return $.parseJSON(strAnswer);
   };

   task.reloadAnswer = function(strAnswer, callback) {
      sequence = answerOfStrAnswer(strAnswer);
      dragAndDrop.removeAllObjects('seq');
      dragAndDrop.insertObjects('seq', 0, $.map(sequence, function(iName) {
         return { ident : iName, elements: getNameObject(iName) };
         }
      ));
      callback();
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify(dragAndDrop.getObjects('seq')));
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         var sequence = answerOfStrAnswer(strAnswer);
         if (Beav.Object.eq(sequence, noScoreNames)) {
            callback(taskParams.noScore, "Déplacez les noms pour les mettre dans le bon ordre.");
            return;
         }
         if (Beav.Object.eq(sequence, task.solution)) {
            callback(taskParams.maxScore, "Bravo ! Vous avez réussi.");
         } else {
            callback(taskParams.minScore, "Ce n'est pas le bon ordre. Essayez avec une autre séquence.");
         }
      });
   }
}

initTask(); 
