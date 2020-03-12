function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         tunnels: [1,0],
         nbBeavers: 4
      },
      medium: {
         tunnels: [0,1,0],
         nbBeavers: 4
      },
      hard: {
         tunnels: [1,0,2,1],
         nbBeavers: 5
      }
   };

   var paper;
   var paperWidth = 740;
   var paperHeight = 80;
   var exampleW = 430;
   var exampleH = 100;

   var dragAndDrop;

   var marginX = 10;
   var marginY = 10;
   var cellW = 42;
   var cellH = 60;

   var nbBeavers;
   var nbTunnels;
   var tunnels;
   var letters = ["A","B","C","D","E"];

   var beaverSrc = [ 
      $("#beaver_1").attr("src"), 
      $("#beaver_2").attr("src"), 
      $("#beaver_3").attr("src"), 
      $("#beaver_4").attr("src") 
   ];
   var tunnelSrc = [ 
      $("#tunnel_black").attr("src"), 
      $("#tunnel_white").attr("src"), 
      $("#tunnel_striped").attr("src") 
   ];

   var exampleLetterAttr = {
      "font-size": 16,
      "font-weight": "bold"
   };
   var arrowAttr = {
      "stroke-width": 3,
      "arrow-end": "classic-long-wide"
   };
   var rectAttr = {
      r: 10,
      fill: "lightblue"
   };
   var letterAttr = {
      "font-size": 20,
      "font-weight": "bold"
   };


   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      tunnels = data[level].tunnels;
      nbBeavers = data[level].nbBeavers;
      nbTunnels = tunnels.length;
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
      initExamples();
      initPaper();
      initDragAndDrop();
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = Beav.Array.make(nbBeavers,null);
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var error = null;
      for(var iBeaver = 0; iBeaver < nbBeavers; iBeaver++){
         if(answer[iBeaver] == null){
            return { successRate: 0, message: taskStrings.missingBeaver };
         }
      }
      var beavers = [];
      for(var iBeaver = 0; iBeaver < nbBeavers; iBeaver++){
         beavers[iBeaver] = iBeaver;
      }
      for(var iTunnel = 0; iTunnel < nbTunnels; iTunnel++){
         switch(tunnels[iTunnel]){
            case 0:
               beavers.reverse();
               break;
            case 1:
               var first = beavers[0];
               beavers[0] = beavers[nbBeavers - 1];
               beavers[nbBeavers - 1] = first;
               break;
            case 2:
               var third = beavers[2];
               beavers[2] = beavers[1];
               beavers[1] = third;
               break;
         }
      }
      for(var iOut = 0; iOut < nbBeavers; iOut++){
         if(answer[iOut] != beavers[iOut]){
            return { successRate: 0, message: taskStrings.failure };
         }
      }
      return { successRate: 1, message: taskStrings.success };
   }

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initExamples() {
      initExample(1);
      initExample(2);
      if(level == "hard"){
         initExample(3);
      }
   };

   function initExample(id) {
      var example = subTask.raphaelFactory.create("example_"+id,"example_"+id,exampleW,exampleH);
      $("#example_"+id).css({
         width: exampleW
      });
      var beaversIn = [0,1,2,3];
      var beaversOut = JSON.parse(JSON.stringify(beaversIn));
      if(id == 1){
         beaversOut.reverse();
      }else if(id == 2){
         beaversOut[0] = beaversIn[beaversIn.length - 1];
         beaversOut[beaversIn.length - 1] = beaversIn[0];
      }else{
         beaversOut[1] = beaversIn[2];
         beaversOut[2] = beaversIn[1];
      }
      tunnel = tunnelSrc[id - 1];
      var beaverW = exampleW/10;
      var beaverH = 55;
      var tunnelW = exampleW/5;
      var xTunnel = beaversIn.length * beaverW;
      var yTunnel = 0;
      var tunnelH = beaverH + marginY;

      for(var iSide = 0; iSide < 2; iSide++){
         var beavers = (iSide) ? beaversOut : beaversIn;
         for(var iBeaver = 0; iBeaver < beavers.length; iBeaver++){
            var beaverID = beavers[iBeaver];
            var x = iBeaver*beaverW;
            if(iSide){
               x += xTunnel + tunnelW;
            }
            var y = 0;
            var scale = 1 - beaverID/10;
            example.image(beaverSrc[beaverID],x,y,beaverW,beaverH).transform("s"+scale+" "+scale+" "+(x + beaverW/2)+" "+(y + beaverH));
            var xLetter = x + beaverW/2;
            var yLetter = y + beaverH + 2*marginY;
            example.text(xLetter,yLetter,letters[beaverID]).attr(exampleLetterAttr);
         }
      }
      
      example.image(tunnel,xTunnel,yTunnel,tunnelW,tunnelH);

      var yArrow = yTunnel + tunnelH + 2*marginY; 
      example.path("M"+xTunnel+" "+yArrow+",H"+(xTunnel + tunnelW)).attr(arrowAttr);
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);
      $("#paper").css({
         width: paperWidth
      });

      var tunnelW = (paperWidth - (2*nbBeavers*cellW) - 4*marginX)/nbTunnels;
      var tunnelH = cellH;
      var yTunnel = marginY;
      for(var iTunnel = 0; iTunnel < nbTunnels; iTunnel++){
         var xTunnel = (paperWidth - nbTunnels*tunnelW)/2 + iTunnel*tunnelW;
         paper.image(tunnelSrc[tunnels[iTunnel]],xTunnel,yTunnel,tunnelW,tunnelH);
      }
   };

   function initDragAndDrop() {
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            answer = dragAndDrop.getObjects("out");
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType) {
            var cont = this.getContainer(srcCont);
            var raphSet = cont.draggableElements[srcPos].component;
            var x = raphSet.cx;
            var y = cellH/2 + marginY;
            if(x < cellW/2){
               x = cellW/2;
            }else if(x > paperWidth - cellW/2){
               x = paperWidth - cellW/2;
            }
            raphSet.placeAt(x,y);

            if(dstCont == "out"){
               return true;
            }
            var idEl = this.getObjects(srcCont)[srcPos];
            if(dstCont == "in"){
               return {
                  dstCont: "in",
                  dstPos: idEl,
                  dropType: dropType
               }
            }
            return false;
         },
         actionIfEjected : function(refEl,previousContId, previousPos) {
            return {
               dstCont: "in",
               dstPos: refEl.ident,
               dropType: "replace"
            }
         }
      });

      var yContainer = cellH/2 + marginY;
      var xContainer1 = cellW*nbBeavers/2 + marginX;
      var xContainer2 = paperWidth - cellW*nbBeavers/2 - marginX;
      dragAndDrop.addContainer({
         ident : "in",
         cx : xContainer1, cy : yContainer,
         widthPlace : cellW, heightPlace : cellH, 
         nbPlaces : nbBeavers,
         dropMode : 'replace',
         dragDisplayMode : 'preview',
         placeBackgroundArray : [paper.rect(-cellW/2,-cellH/2,cellW,cellH)]
      });

      dragAndDrop.addContainer({
         ident : "out",
         cx : xContainer2, cy : yContainer,
         widthPlace : cellW, heightPlace : cellH, 
         nbPlaces : nbBeavers,
         dropMode : 'replace',
         dragDisplayMode : 'preview',
         placeBackgroundArray : [paper.rect(-cellW/2,-cellH/2,cellW,cellH)]
      });

      for(var iIn = 0; iIn < nbBeavers; iIn++) {
         var rect = paper.rect(-cellW/2,-cellH/2,cellW,cellH).attr(rectAttr);
         var letter = paper.text(0,0,letters[iIn]).attr(letterAttr);

         var idOut = null;
         for(var iOut = 0; iOut < answer.length; iOut++){
            if(answer[iOut] == iIn){
               idOut = iOut;
               break;
            }
         }
         if(idOut === null){ 
            dragAndDrop.insertObject("in",iIn,{ident : iIn, elements : paper.set(rect,letter)});
         }else{
            dragAndDrop.insertObject("out",idOut,{ident : iIn, elements : paper.set(rect,letter)});
         }
      }
   };   
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
