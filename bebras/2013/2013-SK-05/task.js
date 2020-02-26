function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         nbShapes: 4,
         nbRepeat: 7,
         solution: [3,2,0,2]
      },
      medium: {
         nbShapes: 5,
         nbRepeat: 5,
         solution: [2,4,1,3,0]
      },
      hard: {
         nbShapes: 5,
         nbRepeat: 5,
         solution: [3,2,0,2,4]
      }
   };
   var patternPaper;
   var patternPaperWidth = 400, patternPaperHeight = 170;
   var necklacePaper;
   var neckLacePaperW = 770;
   var necklaceW = 300;
   var necklaceH = 148;
   var titleH = 30;
   var marginY = 20;
   var necklacePaperH = titleH + 2*marginY + necklaceH;
   var nb, w = 80, h = 80;
   var r = w * 3/8;
   var rBeads = 11;

   var dragAndDrop;
   var rng;
   var targetRaph = {};
   var currRaph = {};
   var iYellow = 3;
   var solution;
   var nbRepeat;
   var shapes = [ "pentagon", "triangle", "circle", "square", "diamond" ];
   var shapeColors = [ "blue", "green", "red", "yellow", "cyan" ];
   var stringAttr = {
      stroke: "black",
      "stroke-width": 2
   };
   var titleAttr = {
      fill: "black",
      "font-size": 16,
      "font-weight": "bold"
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      nb = data[level].nbShapes;
      nbRepeat = data[level].nbRepeat;
      solution = data[level].solution;
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
      initPaper();
      loadNecklace();
      initDragAndDrop();
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = { seed: rng.nextInt(1,10000) };
      if(level == "easy"){
         defaultAnswer.necklace = [];
         for(var iBead = 0; iBead < nb; iBead++){
         	defaultAnswer.necklace[iBead] = (iBead == 0) ? iYellow : null;
         }
      }else{
         defaultAnswer.necklace = Beav.Array.make(nb,null);
         defaultAnswer.beadChange = [];
         for(var iBead = 0; iBead < nb; iBead++){
         	defaultAnswer.beadChange[iBead] = iBead;
         }
         var different = false;
         do{
            rng.shuffle(defaultAnswer.beadChange);
            for(var iBead = 0; iBead < nb; iBead++){
               if(defaultAnswer.beadChange[iBead] != iBead){
                  different = true;
               }
            }
         }while(!different)
      }
      return defaultAnswer;
   };

   function getResultAndMessage() {
      for(var iPearl = 0; iPearl < answer.necklace.length; iPearl++){
         var pearl = (level == "easy") ? answer.necklace[iPearl] : answer.beadChange[answer.necklace[iPearl]];
         if(pearl != solution[iPearl]){
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

   function initPaper() {
      patternPaper = subTask.raphaelFactory.create("paper","paper",patternPaperWidth,patternPaperHeight);
      $("#paper").css({
         width: patternPaperWidth
      });
      necklacePaper = subTask.raphaelFactory.create('necklace','necklace', neckLacePaperW, necklacePaperH);
   };

   function initDragAndDrop() {
      dragAndDrop = DragAndDropSystem({
         paper : patternPaper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            answer.necklace = dragAndDrop.getObjects('seq');
            updateNecklace();
         },
         canBeTaken : function(contId, pos) { 
            return (level == "easy") ? !(contId == 'seq' && pos == 0) : true; 
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType) {
            return (level == "easy") ? ((dstCont == 'seq' && dstPos > 0) || dstCont == null) : (dstCont == 'seq'|| dstCont == null);
         }
      });
      
      dragAndDrop.addContainer({
         ident : 'seq',
         cx : patternPaperWidth/2, cy: 120, widthPlace : w, heightPlace : h,
         nbPlaces : nb,
         placeBackgroundArray : [patternPaper.rect(-w/2,-h/2,w,h)],
         dropMode : 'insertBefore',
         dragDisplayMode : 'preview'
      });
      
      for(var iSource = 0; iSource < nb; iSource++){
         dragAndDrop.addContainer({
            ident : iSource,
            cx : patternPaperWidth/2 -(nb/2)*w +(1/2+iSource)*w, cy: 40, widthPlace : w, heightPlace : h,
            type : 'source',
            placeBackgroundArray : [],
            sourceElemArray : [drawBead(iSource,patternPaper,0,0,r)]
         });
      }
      for(var iPearl = 0; iPearl < nb; iPearl++){
         var pearl = answer.necklace[iPearl];
         if(pearl != null){
            dragAndDrop.insertObject('seq', iPearl, {ident : pearl, elements : [drawBead(pearl,patternPaper,0,0,r)] });
         }
      }
   };

   function loadNecklace() {
      var x0 = -170;
      var y0 = -239;
      var yNecklace = y0 + titleH + marginY;
      var necklacePath = "m 425.27606,257.29435 c -0.61717,-1.08632 -1.29609,-2.27651 -2.51534,-4.31829 -3.0244,-3.22511 -4.02932,-3.5442 -8.65557,-2.6414 -10.63197,-1.60136 -72.85291,-10.75907 -105.70264,-10.72621 -1.16004,0.001 -2.28258,0.0138 -3.36414,0.0388 -33.53821,0.77727 -72.87836,-0.74381 -98.56766,13.79072 -23.95811,13.55506 -37.68958,37.77776 -34.63611,58.74461 3.88008,26.64285 30.14575,54.23166 64.70956,67.47271 29.07208,11.1372 67.05194,5.10161 100.28082,2.51533 33.78047,-2.62921 107.47192,-22.47997 107.47192,-22.47997 34.55015,-10.35231 24.76299,-24.00574 24.87441,-24.00574 M 425.27606,257.2943 c 1.10982,1.95346 1.96074,3.46881 4.96935,8.26614 2.75237,4.26557 8.17541,8.54758 15.13344,8.88266 8.38111,0.40361 12.57752,-1.98774 12.57752,-1.98774";
      var xCurrent = (neckLacePaperW/2 - necklaceW)/2;
      var xTarget = (3*neckLacePaperW/2 - necklaceW)/2;
      var currString = necklacePaper.path(necklacePath);
      var targetString = necklacePaper.path(necklacePath);
      currString.transform("t "+(x0 + xCurrent)+" "+yNecklace).attr(stringAttr);
      targetString.transform("t "+(x0 + xTarget)+" "+yNecklace).attr(stringAttr);
      necklacePaper.text(xCurrent + necklaceW/2,titleH/2,taskStrings.current).attr(titleAttr);
      necklacePaper.text(xTarget + necklaceW/2,titleH/2,taskStrings.target).attr(titleAttr);
      currRaph.string = currString;
      targetRaph.string = targetString;
      threadBeads("target");
      threadBeads("current");
   };

   function threadBeads(necklace) {
      var x0 = -170;
      var y0 = -239 + titleH + marginY;
      var path;
      var source;
      if(necklace == "target"){
         x0 += (3*neckLacePaperW/2 - necklaceW)/2;
         path = targetRaph.string;
         source = solution;
      }else{
         x0 += (neckLacePaperW/2 - necklaceW)/2;
         path = currRaph.string;
         if(level == "easy"){
            source = answer.necklace;
         }else{
            source = [];
            for(var iBead = 0; iBead < nb; iBead++){
               source[iBead] = answer.beadChange[answer.necklace[iBead]];
            }
         }
         currRaph.beads = necklacePaper.set(); 
      }
      var length = (level == "easy") ? path.getTotalLength() - 50 : path.getTotalLength() - 90;
      for(var iRepeat = 0; iRepeat < nbRepeat; iRepeat++){
         for(var iBead = 0; iBead < source.length; iBead++){
            if(level != "hard"){
               var beadID = source[iBead];
            }else{
               var beadID = (source[iBead] != null) ? (source[iBead] + 2*iRepeat)%nb : null;
            }
            if(beadID != null){
               length -= rBeads*2;
            }
            if(length < rBeads){
               continue
            }
            var pos = path.getPointAtLength(length);
            var bead = drawBead(beadID,necklacePaper,x0 + pos.x,y0 + pos.y,rBeads);
            bead.transform("r"+pos.alpha);
            if(necklace == "current"){
               currRaph.beads.push(bead);
            }
         }
      }
   }; 

   function drawBead(id,paper,x,y,r) {
      var shape = shapes[id];

      if(shape == "circle"){
         var raphObj = paper.circle(x,y,r);
      }else if(shape == "square"){
         var raphObj = paper.rect(x-r,y-r,2*r,2*r);
      }else{
         var raphObj = getShape(paper,shape,x,y,r);
      }

      return raphObj.attr({
         stroke: "none",
         fill: shapeColors[id],
         opacity: 0.9
      });
   };

   function updateNecklace() {
      currRaph.beads.remove();
      threadBeads("current");
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
