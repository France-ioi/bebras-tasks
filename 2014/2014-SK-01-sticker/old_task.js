function initTask () {
   var level = "easy";
   var nbStickers = 4;
   var paper;
   var animWidth = 200;
   var animHeight = 400;
   var widthPlace = 90;
   var heightPlace = 90;
   var initState = [0, 1, 2, 3];
   var stickerImages = ["easy0.png", "easy1.png", "easy2.png", "easy3.png"];

   function isIE () {
     var myNav = navigator.userAgent.toLowerCase();
     return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
   }

   var drawSticker = function(iSticker) {
      var labels = ["Algues", "Cailloux", "Poisson", "Castor"];
      var margin = 5;
      var sticker;
      if (isIE() && (isIE() <= 8)) {
         sticker = paper.text(0, 0, labels[iSticker]).attr("font-size", 20);
      } else {
         sticker = paper.image(stickerImages[iSticker], margin-widthPlace/2, margin-heightPlace/2, widthPlace-2*margin, heightPlace-2*margin);
      }
      var rect1 = paper.rect(-widthPlace/2, -heightPlace/2, widthPlace, heightPlace).attr({fill: "#E0E0F8"});
      var rect2 = paper.rect(margin-widthPlace/2, margin-heightPlace/2, widthPlace-2*margin, heightPlace-2*margin).attr({fill: "white"});
      return [rect1, rect2, sticker];
   }

   var initDragDrop = function() {
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, type) {
            if (dstCont == null)
               return false;
            return true;
         }
      });
      var backgroundTarget = paper.rect(-widthPlace/2,-heightPlace/2,widthPlace,heightPlace)
         .attr('fill', '#F2F2FF');
      dragAndDrop.addContainer({
         ident : 'seq',
         cx : 110, 
         cy : 190, 
         widthPlace : widthPlace,
         heightPlace : heightPlace,
         nbPlaces : nbStickers,
         direction : 'vertical',
         dropMode : 'insertBefore',
         dragDisplayMode : 'marker',
         placeBackgroundArray : [ backgroundTarget ]
      });

      for (var pos = 0; pos < nbStickers; pos++) {
         var iSticker = initState[pos];
         dragAndDrop.insertObject('seq', iSticker, {ident : iSticker, elements : drawSticker(iSticker)} );
         paper.text(47, 72 + pos * heightPlace, (pos+1))
              .attr({'font-size': 24, 'font-weight': 'bold'});
      }
   }
  
   task.load = function(views, callback) {
      // displayHelper.hideRestartButton = true;

      $("#anim").width = animWidth;
      $("#anim").height = animHeight;
      
      paper = Raphael('anim', animWidth, animHeight);

      initDragDrop();

      if (views.solution) {
         $.each(task.solution, function(i, iSticker) {
           $("#textSolution").append("<img src=\"" + stickerImages[iSticker] + "\" style=\"width:80px;height:80px\" />");
         });
      }
      
      callback();
   };
   
   var answerOfStrAnswer = function(strAnswer) {
      if (strAnswer == "") {
         return initState.slice(0);
      }
      return $.parseJSON(strAnswer);
   };

   task.reloadAnswer = function(strAnswer, callback) {
      var answer = answerOfStrAnswer(strAnswer);
      var current = dragAndDrop.getObjects('seq');
      for (var iObject = 0; iObject < 4; iObject++) {
         if (current[iObject] != null) {
            dragAndDrop.removeObject('seq', iObject);
         }
         var id = answer[iObject];
         dragAndDrop.insertObject('seq', iObject, {ident : id, elements : drawSticker(id) });
      }
      callback();
   };
    
   task.getAnswer = function(callback) {
      callback(JSON.stringify(dragAndDrop.getObjects('seq')));
   }

   grader.gradeTask = function(strAnswer, token, callback) {
      platform.getTaskParams(null, null, function(taskParams) {
         var answer = answerOfStrAnswer(strAnswer);
         if (Beav.Object.eq(answer, task.solution)) {
            callback(taskParams.maxScore, taskStrings.success);
         // } else if (Beav.Object.eq(answer, initState)) {
         //   callback(taskParams.noScore, "Ce n'est pas le bon ordre.");
         } else {
            callback(taskParams.minScore, taskStrings.failure);
         }
      });
   };
};

initTask();
