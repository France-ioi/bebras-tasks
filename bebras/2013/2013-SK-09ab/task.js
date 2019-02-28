function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         target: 4,
         nbMax: 6
      },
      medium: {
         target: 3,
         nbMax: 6
      },
      hard: {
         target: 5,
         nbMax: 5
      }
   };
   var paper;
   var dragAndDrop;
   var src= {
      add: 0,
      add: 1,
      add: 2,
      rot: -90
   };
   var target;
   var contSeq;
   var source = new Array();
   var largeurBoite = 60;
   var hauteurBoite = 60;
   var largeurPaper = 500;
   var hauteurPaper = 300;
   var nbMax;
   var posSimX = largeurPaper / 2,
      posSimY = 260;
   
   var enCoursDeSimulation = false;
   var patterns = [
      [
         [0, 0, 0],
         [0, 1, 0],
         [0, 0, 0]
      ],
      [
         [0, 0, 1],
         [0, 0, 0],
         [1, 0, 0]
      ],
      [
         [0, 0, 0],
         [1, 0, 1],
         [0, 0, 0]
      ],
      [
         [1, 0, 1],
         [1, 0, 1],
         [1, 0, 1]
      ],
      [
         [1, 0, 0],
         [0, 1, 0],
         [0, 0, 1]
      ],
      [
         [1, 1, 1],
         [1, 0, 1],
         [1, 1, 1]
      ]
   ];

   var dotAttr = {
      r: largeurBoite/10,
      fill: '#0B0B61',
      'stroke-width': 0
   };

   //simulation
   var tempsTour = 1000;
   var delayDem = 400;
   var die = [];
   var angle = [];
   var marker;
   var markerAttr = {
      stroke: 'red',
      'stroke-width': 4,
      opacity: 0
   };
   
   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      target = data[level].target;
      nbMax = data[level].nbMax;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initTargetDice();
      initPaper();
      initDragAndDrop();
      initButton();
      reloadAnswer();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [];
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      stopSimulation();
      callback();
   };

   function getResultAndMessage() {
      var curPattern = emptyPattern();
      for (var iStep = 0; iStep < answer.length; iStep++) {
         var step = answer[iStep];
         if (step == null) {
            break;
         }
         if (step == 3) {
            curPattern = rotatePattern(curPattern);
         } else {
            curPattern = addPatterns(curPattern, patterns[step]);
         }
      }
      if (patternsEqual(curPattern, patterns[target])) {
         return { successRate: 1, message: taskStrings.success };
      }
      return { successRate: 0, message: taskStrings.failure };
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create('anim', 'anim', largeurPaper, hauteurPaper);
      $('#anim').css({width:largeurPaper,height:hauteurPaper});
   };

   function initTargetDice() {
      paperTarget = subTask.raphaelFactory.create('target', 'target', 3 * largeurBoite / 2, 3 * hauteurBoite / 2);
      var targetDie = paperTarget.set(paperTarget.rect(largeurBoite/4, hauteurBoite/4, largeurBoite, hauteurBoite, 8).attr('fill', 'white'));
      var dotsPos = getDotsCoordinates(target);
      for (var iDot = 0; iDot < dotsPos.length; iDot++) {
         var cx = dotsPos[iDot].cx + 3*largeurBoite/4;
         var cy = dotsPos[iDot].cy + 3*hauteurBoite/4;
         targetDie.push(paperTarget.circle(cx, cy).attr(dotAttr));
      }
      $("#target").css("width",3 * largeurBoite / 2);
   };

   function initDragAndDrop() {
      dragAndDrop = DragAndDropSystem({
         paper: paper,
         canBeTaken: function(srcCont, srcPos) {
            return !enCoursDeSimulation;
         },
         actionIfDropped: function(srcCont, srcPos, dstCont, dstPos, dropType) {
            if (dstCont == 'seq') {
               var maxiPos = stackSize();
               if (srcCont == 'seq')
                  maxiPos--;
               if (dstPos <= maxiPos)
                  return true;
               if (maxiPos < nbMax)
                  return {dstCont: dstCont, dstPos: maxiPos, dropType: 'insert'};
            }
            return dstCont == null;
         },
         drop: function(srcCont, srcPos, dstCont, dstPos, dropType) {
            answer = dragAndDrop.getObjects("seq");
            stopSimulation();
         }
      });
      var background = paper.rect(-largeurBoite/2,-hauteurBoite/2,largeurBoite,hauteurBoite)
         .attr('fill', '#F2F2FF');
      contSeq = dragAndDrop.addContainer({
         ident: 'seq',
         cx: largeurPaper / 2,
         cy: 150,
         widthPlace: largeurBoite,
         heightPlace: hauteurBoite,
         nbPlaces: nbMax,
         dropMode: 'insertBefore',
         dragDisplayMode: 'preview',
         placeBackgroundArray : [ background ]
      });
      for (iSource = 0; iSource < 4; iSource++) {
         var elem = getObject(iSource);
         source[iSource] = dragAndDrop.addContainer({
            ident: iSource,
            cx: (1 + iSource) * largeurPaper / 5,
            cy: 50,
            widthPlace: largeurBoite,
            heightPlace: hauteurBoite,
            type: 'source',
            sourceElemArray: elem,
            placeBackgroundArray: []
         });
      }
   };

   function initButton() {
        $('#run').val(taskStrings.run);
        $('#run').off("click");
        $('#run').click(simuler);
    };

   function reloadAnswer() {
      for (var i = 0; i < nbMax; i++) {
         if (answer[i] != null) {
            dragAndDrop.insertObject('seq', i, {
               ident: answer[i],
               elements: getObject(answer[i])
            });
         }
      }
   };

   function getObject(iSource) {
      var r = paper.rect(-largeurBoite / 2, -hauteurBoite / 2, largeurBoite, hauteurBoite, 8).attr('fill', 'white');
      var ar_elem = [r];
      if (iSource < 3) {
         var dotsPos = getDotsCoordinates(iSource);
         for (var iDot = 0; iDot < dotsPos.length; iDot++) {
            var cx = dotsPos[iDot].cx;
            var cy = dotsPos[iDot].cy;
            ar_elem.push(paper.circle(cx, cy).attr(dotAttr));
         }
      } else {
         var l = 2 * largeurBoite / 7;

         ar_elem.push(paper.path('M ' + l + ' ' + (-l) + ' S 0 ' + (-3 * l / 2) + ' ' + (-l) + ' ' + (-l))
            .attr({
               'arrow-end': 'classic-midium-long',
               'stroke-width': '2'
            }));
         ar_elem.push(paper.text(0, 0, '90').attr('font-size', 30));
      }
      return ar_elem;
   };

   function getDotsCoordinates(patternIndex) {
      var pattern = patterns[patternIndex];
      var dots = [];
      for(var iLine = 0; iLine < pattern.length; iLine++){
         for(var iCol = 0; iCol < pattern[iLine].length; iCol++){
            if(pattern[iLine][iCol] === 1){
               var x = (iCol - 1) * 2 * largeurBoite / 6;
               var y = (iLine - 1) * 2 * hauteurBoite / 6;
               dots.push({cx:x,cy:y});
            }
         }
      }
      return dots;
   };

   function simuler() {
      enleverSimulation();
      enCoursDeSimulation = true;
      var contenu = dragAndDrop.getObjects('seq');
      var taillePile = stackSize();
      die[0] = paper.set(paper.rect(posSimX - largeurBoite / 2, posSimY - hauteurBoite / 2, largeurBoite, hauteurBoite, 8).attr('fill', 'white'));
      angle[0] = 0;
      animSeq(0,taillePile,contenu);
   };

   function animSeq(i,size,seq) {
      var centre = contSeq.placeCenter(i);
      marker = paper.rect(centre[0] - largeurBoite / 2, centre[1] - hauteurBoite / 2, largeurBoite, hauteurBoite).attr(markerAttr);
      var animMarkerTime = (i === 0) ? (tempsTour + delayDem) : tempsTour;
      var animMarker = Raphael.animation({ opacity: 1 }, animMarkerTime, function(){
         marker.remove();
         i++;
         if(i < size){
            animSeq(i,size,seq);
         }else{
            enCoursDeSimulation = false;
            var res = getResultAndMessage();
            if(res.successRate === 1){
               displayHelper.validate("stay");
            }
         }
      });
      subTask.raphaelFactory.animate("markerAnim",marker,animMarker);
      var action = seq[i];
      if(action !== 3){ 
         var dots = paper.set();
         var dotsPos = getDotsCoordinates(action);
         for (var iDot = 0; iDot < dotsPos.length; iDot++) {
            var cx = dotsPos[iDot].cx;
            var cy = dotsPos[iDot].cy;
            dots.push(paper.circle(posSimX + cx, posSimY + cy).attr(dotAttr));
         }
         dots.attr('opacity', '0');
         var dotsFadeIn = Raphael.animation({opacity: 1}, tempsTour);
         subTask.raphaelFactory.animate("dotsAnim",dots,dotsFadeIn);
         die.push(dots);
         angle.push(0);
      }else{
         for(var iElement = 0; iElement < die.length; iElement++){
            angle[iElement] -= 90;
            var rotation = Raphael.animation({'transform': 'r'+angle[iElement]+',' + posSimX + ',' + posSimY }, tempsTour);
            subTask.raphaelFactory.animate("rotateDie"+iElement,die[iElement],rotation);
         }
      }
   };

   function enleverSimulation() {
      if(die.length > 0){
         for(var iElement = 0; iElement < die.length; iElement++){
            die[iElement].remove();
         }
      }
      if(marker){
         marker.remove();
      }
   };

   function stopSimulation() {
      subTask.raphaelFactory.stopAnimate("markerAnim");
      subTask.raphaelFactory.stopAnimate("dotsAnim");
      for(var iElement = 0; iElement <= nbMax; iElement++){
         subTask.raphaelFactory.stopAnimate("rotateDie"+iElement);
      }
      enleverSimulation();
      enCoursDeSimulation = false;
   };

   function stackSize() {
      var objects = dragAndDrop.getObjects('seq');
      var size = 0;
      while ((size < objects.length) && (objects[size] != null)) {
         size++;
      }
      return size;
   };

   function emptyPattern() {
      return [
         [0, 0, 0],
         [0, 0, 0],
         [0, 0, 0]
      ];
   };

   function rotatePattern(pattern) {
      var newPattern = emptyPattern();
      for (var lin = 0; lin < 3; lin++) {
         for (var col = 0; col < 3; col++) {
            newPattern[lin][col] = pattern[col][2 - lin];
         }
      }
      return newPattern;
   };

   function addPatterns(pattern1, pattern2) {
      var newPattern = emptyPattern();
      for (var lin = 0; lin < 3; lin++) {
         for (var col = 0; col < 3; col++) {
            newPattern[lin][col] = pattern1[lin][col] | pattern2[lin][col];
         }
      }
      return newPattern;
   };

   function patternsEqual(pattern1, pattern2) {
      for (var lin = 0; lin < 3; lin++) {
         for (var col = 0; col < 3; col++) {
            if (pattern1[lin][col] != pattern2[lin][col]) {
               return false;
            }
         }
      }
      return true;
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
