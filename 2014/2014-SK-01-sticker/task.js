function initTask (subTask) {
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
   var nbStickers = 4;
   var paper;
   var animWidth = 200;
   var animHeight = 400;
   var widthPlace = 90;
   var heightPlace = 90;
   var initState = [0, 1, 2, 3];
   var solution = [3, 0, 2, 1];
   var stickerImages = ["easy0.png", "easy1.png", "easy2.png", "easy3.png"];

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
      paper = subTask.raphaelFactory.create("anim","anim",animWidth, animHeight);
      initDragDrop();
      for (var iObject = 0; iObject < 4; iObject++) {
         if (answer[iObject] != null) {
            dragAndDrop.removeObject('seq', iObject);
            var id = answer[iObject];
            dragAndDrop.insertObject('seq', iObject, {ident : id, elements : drawSticker(id) });
         }
      }
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = JSON.parse(JSON.stringify(initState));
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      var result;
      if (Beav.Object.eq(answer, solution)) {
         result = { successRate: 1, message: taskStrings.success };
      } else {
         result = { successRate: 0, message: taskStrings.failure };
      }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   // function isIE () {
   //   var myNav = navigator.userAgent.toLowerCase();
   //   return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
   // }

   var drawSticker = function(iSticker) {
      var labels = ["Algues", "Cailloux", "Poisson", "Castor"];
      var margin = 5;
      var sticker;
      if (Beav.Navigator.isIE8()) {
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
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            answer = dragAndDrop.getObjects('seq');
         },
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
  
};
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();

