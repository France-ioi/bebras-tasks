function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var rng;
   var data = {
      easy: {
         nbCells: 2,
         score: [1,0,0,1,4,1,3,4,1,0,3],
         maxNbMoves: 6
      },
      medium: {
         nbCells: 3,
         // score: [0,1,2,4,0,4,2,3,1,4,2,0],
         score: [3,4,1,0,4,0,2,3,1,0,4,1,2,3,0,3],
         maxNbMoves: 9
      },
      hard: {
         nbCells: 3,
         score: [1,3,2,3,4,0,4,1,2,0,2,3,0,3,0,4],
         maxNbMoves: 5
      }
   };

   var paper;
   var paperW = 770;
   var paperH;

   var marginX = 20;
   var marginY = 20;
   var instrW = 90;
   var instrH = 90;
   var yInstr;
   var srcCellW = instrW + marginX;
   var srcCellH = instrH;
   var beaverW = 166;
   var beaverH = 148;
   var xBeaver = (paperW - beaverW)/2;
   var yBeaver;

   var xDropZone, wDropZone;
   var yDropZone;
   var buttonW = 220;
   var buttonH = 35;
   var xUndo, yUndo;
   var dxMoves = 0;
   if (typeof enableRtl != 'undefined') {
      dxMoves = 150;
   }
   var iconSize = 15;
   var scoreMarginX = 0;
   var xScore = marginX;
   var yScore;
   var wScore = paperW - 2*scoreMarginX;
   var hScore = 55;
   var scoreInstrW = 45;
   var scoreInstrH = scoreInstrW;
   var arrowW = 18;
   var arrowH = 17;
   var yArrow;

   var dragAndDrop;
   var srcID = [];
   var origInstruments = [ /*0*/"caisse", /*1*/"sax", /*2*/"trompette", /*3*/"vibraphone", /*4*/"violon" ];
   var instruments;
   var nbInstruments = origInstruments.length;
   var nbCells;
   var maxNbMoves;
   var movesRaph;
   var score;
   var nbInstrPerLine = Math.floor(wScore/(scoreInstrW + scoreMarginX)) - 1;
   var nbLines;
   var animFrame;
   var animTime = 800;
   var arrows;
   var doubleSrc = null;
   var doubleRaph = null;
   var dropFrame = null;
   var dropFramePos = null;
   var dropCells = [];
   // var overlay;
   var scoreDrop = false;

   var beaverSrc = $("#beaver").attr("src");
   var undoSrc = $("#undo").attr("src");
   var arrowLeftSrc = $("#arrowLeft").attr("src");
   var arrowRightSrc = $("#arrowRight").attr("src");


   var colors = {
      // yellow: "#f5a623",
      blue: "#4a90e2",
      black: "#4a4a4a",
      lightGrey: "#ebebeb",
      midGrey: "#dfdfdf",
      grey: "#c6c7c9",
      green: "#9acc68"
   };

   var srcRectAttr = {
      stroke: colors.grey,
      "stroke-width": 1,
      fill: colors.lightGrey,
      r: 5
   };
   var srcLineAttr = {
      stroke: colors.grey,
      "stroke-width": 1
   };
   var textAttr = {
      "font-size": 18,
      fill: colors.black,
      "text-anchor": "start"
   };
   var movesAttr = {
      "font-size": 18,
      fill: colors.black,
      "text-anchor": "start",
      "font-weight": "bold",
   };
   var redMovesAttr = {
      fill: "red"
   };
   var buttonAttr = {
      stroke: "none",
      fill: colors.blue
   };
   var buttonTextAttr = {
      "font-size": 13,
      "font-weight": "bold",
      fill: "white"
   };
   var staffLineAttr = {
      stroke: colors.midGrey,
      "stroke-width": 1
   };
   var animFrameAttr = {
      width: scoreInstrW,
      height: scoreInstrH,
      stroke: colors.blue,
      "stroke-width": 2,
      fill: "none",
      r: 3
   };
   var plusAttr = {
      "font-size": 40,
      "font-weight": "bold",
      fill: colors.blue
   };
   var dropFrameAttr = {
      stroke: 'yellow',
      'stroke-width': 2,
      'stroke-dasharray': '-'
   };
   var overlayAttr = {
      stroke : "none",
      fill: colors.green,
      opacity: 0
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;

      rng = new RandomGenerator(subTask.taskParams.randomSeed + level.charCodeAt(0));
      instruments = $.extend([], origInstruments);
      rng.safeShuffle(instruments);

      nbCells = data[level].nbCells;
      score = data[level].score;
      maxNbMoves = data[level].maxNbMoves;
      wDropZone = nbCells*instrW;
      xDropZone = (paperW - wDropZone)/2;
      xUndo = xDropZone + wDropZone + (paperW - xDropZone - wDropZone - buttonW)/2;
      nbLines = Math.ceil(score.length/nbInstrPerLine);

      yInstr = marginY;
      yArrow = yInstr + (instrH - arrowH)/2;
      yBeaver = yInstr + marginY + srcCellH;
      yDropZone = yBeaver + 1.25*beaverH - instrH;
      yScore = yDropZone + instrH + 50;
      paperH = yScore + nbLines*hScore;
      yUndo = yDropZone + instrH/2 - buttonH/2;

      for(var iInstr = 0; iInstr < nbInstruments; iInstr++){
         var id = "instr_"+iInstr;
         srcID[iInstr] = id;
      }
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      rng.reset(answer.seed);
   };

   subTask.resetDisplay = function () {
      $("#nbMoves").html(maxNbMoves);
      displayError("");
      initPaper();
      initDragAndDrop();
      initInstruments();
      initDropArea();
      initMoves();
      initUndoButton();
      initScore();
      loadLastMove();
      initHandlers();
      updateUndoButton();
      updateAnimFrame();

      displayHelper.hideValidateButton = true;
      displayHelper.customValidate = checkResult;
      if (typeof(enableRtl) != "undefined") {
         $("body").attr("dir", "rtl");
         $(".largeScreen #zone_1").css("float", "right");
         $(".largeScreen #zone_2").css("float", "right");
      }
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = {
         seed: rng.nextInt(0,1000),
         moves: [ {seq: Beav.Array.make(nbCells,null), scoreProgress: 0} ]
      };
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result
   };

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);

      $("#zone_2").css("position","relative");
      $("#zone_2").css("padding-top","1px");
      var y0 = 16;
      for(var iOver = 1; iOver <= 6; iOver++){
         var id = "overlay_"+iOver;
         $("#zone_2 #"+id).remove();
         $("#zone_2").append("<div id=\""+id+"\"></div>");
         var x,y,w,h;
         switch(iOver) {
            case 1:
               x = 0; y = y0;
               w = paperW;
               h = yInstr; 
               break;
            case 2:
               x = 0; y = y0 + yInstr;
               w = (paperW - srcCellW*nbInstruments)/2;
               h = instrH; 
               break;
            case 3:
               x = (paperW + srcCellW*nbInstruments)/2;; 
               y = y0 + yInstr;
               w = paperW - x;
               h = instrH; 
               break;
            case 4:
               x = 0; 
               y = y0 + yInstr + instrH;
               w = paperW;
               h = yDropZone - y + y0; 
               break;
            case 5:
               x = 0; 
               y = y0 + yDropZone;
               w = xDropZone;
               h = instrH; 
               break;
            case 6:
               x = 0; 
               y = y0 + yDropZone + instrH;
               w = paperW;
               h = paperH - y + y0; 
               break;
         }
         $("#"+id).css({
            position: "absolute",
            top: y,
            left: x,
            width: w,
            height: h,
            background: "red",
            opacity: 0
         });
      }
   };

   function initDragAndDrop() {
      dragAndDrop = new DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            if(srcContId != 'drop'){
               displayError("");
            }
            if(scoreDrop){
               displayError(taskStrings.scoreDrop);
            }
            if(level == "hard"){
               if(arrows){
                  arrows.remove();
                  arrows = null;
               }
               if(doubleRaph){
                  doubleRaph.remove();
                  doubleRaph = null;
               }
               if(dropFrame){
                  dropFrame.remove();
                  dropFrame = null;
               }
               /* reset img src in case of right double drag */
               var cont = dragAndDrop.getContainer(dstContId);
               var component = cont.draggableElements[dstPos].component;
               var raph = component.element;
               var instrID = Beav.Array.indexOf(srcID,srcContId,eq);
               var newSrc = $("#"+instruments[instrID]).attr("src");
               raph.attr("src",newSrc);
            }
            if(srcContId != 'temporaryContainer' && (srcContId != dstContId || srcPos != dstPos)){
               if(level == "hard" && doubleSrc){
                  var currSeq = this.getObjects('drop');
                  var ejected = currSeq[dropFramePos];
                  if(ejected){
                     var element = drawInstrument(ejected,-instrW/2,-instrH/2);
                     this.insertObject(ejected, 0, {ident : ejected, elements : element });
                     this.removeObject('drop', dropFramePos);
                  }
                  if(srcContId > doubleSrc && dstPos != 0 || srcContId < doubleSrc && dstPos == 0){
                     var element = drawInstrument(doubleSrc,-instrW/2,-instrH/2);
                     this.insertObject('drop', dropFramePos, {ident : doubleSrc, elements : element });
                  }else{
                     this.removeObject('drop',dstPos);
                     var element = drawInstrument(doubleSrc,-instrW/2,-instrH/2);
                     this.insertObject('drop', dstPos, {ident : doubleSrc, elements : element });
                     var element2 = drawInstrument(srcContId,-instrW/2,-instrH/2);
                     this.insertObject('drop', dropFramePos, {ident : srcContId, elements : element2 });
                  }
                  this.removeObject(doubleSrc,0);
                  doubleSrc = null;
               }else if(level == "hard" && !doubleSrc && answer.moves.length == 1){
                  // displayError(taskStrings.takeTwo);
                  displayHelper.showPopupMessage(taskStrings.takeTwo, "blanket");
               }
               var newMove = { seq: this.getObjects("drop"), scoreProgress: answer.moves[answer.moves.length - 1].scoreProgress };
               answer.moves.push(newMove);

               updateMovesCount();
               updateUndoButton();
               checkScore();
            }else{
               if(level == "hard" && doubleSrc){
                  var doubleSeq = this.getObjects(doubleSrc);
                  if(!doubleSeq[0]){
                     var element = drawInstrument(doubleSrc,-instrW/2,-instrH/2);
                     dragAndDrop.insertObject(doubleSrc, 0, {ident : doubleSrc, elements : element });
                  }
                  doubleSrc = null;
               }
            }
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType)
         {
            if(srcCont == 'drop'){
               displayError(taskStrings.youCant);
               return false
            }
            if(level == "hard"){
               if(Beav.Array.has(srcID,srcCont,eq) && Beav.Array.has(srcID,dstCont,eq)){
                  /* drag over src area */
                  if(doubleRaph){
                     doubleRaph.remove();
                     doubleRaph = null;
                  }
                  if(dropFrame){
                     dropFrame.remove();
                     dropFrame = null;
                  }
                  var instrID = Beav.Array.indexOf(srcID,srcCont,eq);
                  handleArrows(instrID);
                  if(doubleSrc){
                     var dblCont = this.getContainer(doubleSrc);
                     var elements = dblCont.draggableElements;
                     if(elements[0]){
                        elements[0].show();
                     }
                     if(dstCont != doubleSrc){
                        /* reset img src in case of right double drag */
                        var srcContObj = this.getContainer(srcCont);
                        var component = srcContObj.draggableElements[0].component;
                        var raph = component.element;
                        var instrID = Beav.Array.indexOf(srcID,srcCont,eq);
                        var newSrc = $("#"+instruments[instrID]).attr("src");
                        raph.attr("src",newSrc);
                     }
                  }

                  if(dstCont != srcCont){
                     var instrDstID = Beav.Array.indexOf(srcID,dstCont,eq);
                     if(Math.abs(instrID - instrDstID) == 1){
                        /* over adjacent instrument */
                        var currMove = answer.moves[answer.moves.length - 1];
                        doubleSrc = (Beav.Array.has(currMove.seq,dstCont,eq)) ? null : dstCont;
                        var xc = (paperW - nbInstruments*srcCellW)/2 + (instrDstID + 1/2)*srcCellW;
                        var yc = yInstr + srcCellH/2;
                        handleDoubleInstr(srcCont,doubleSrc);
                        if(arrows){
                           arrows.remove();
                           arrows = null;
                        }
                     }
                  }
               }else{
                  /* drag leaves src area */
                  if(arrows){
                     arrows.remove();
                     arrows = null;
                  }
                  if(doubleSrc){
                     handleDoubleInstr(srcCont,doubleSrc);
                     if(dstCont == 'drop'){
                        handleDropFrame(dstPos);
                     }else{
                        if(dropFrame){
                           dropFrame.remove();
                           dropFrame = null;
                        }
                     }
                  }
               }
            }
            var srcContObj = this.getContainer(srcCont);
            var elements = srcContObj.draggableElements;
            var elementID = elements[srcPos].ident;
            var elem = elements[srcPos].component;
            var x = elem.cx;
            var y = elem.cy;
            if(y >= yScore - instrH/2 && y < paperH){
               scoreDrop = true;
            }else{
               scoreDrop = false;
            }
            if(dstCont != 'drop'){
               return DragAndDropSystem.action(elementID,0,'replace');
            }
            return true
         },
         ejected : function(refEl, previousCont, previousPos) {

         },
         actionIfEjected: function(refElement, previousContainerId, previousPos) {
            return DragAndDropSystem.action(refElement.ident,0,'replace');
         }
      });
   };

   function initInstruments() {
      var rectW = srcCellW*nbInstruments;
      var x0 = (paperW - rectW)/2;
      var y0 = yInstr;

      paper.rect(x0,y0,rectW,srcCellH).attr(srcRectAttr);
      for(var iInstr = 0; iInstr < nbInstruments - 1; iInstr++){
         var xLine = x0 + (iInstr + 1)*srcCellW;
         paper.path("M"+xLine+" "+y0+",V"+(y0 + srcCellH)).attr(srcLineAttr);
      }

      for(var iInstr = 0; iInstr < nbInstruments; iInstr++){
         var x = x0 + iInstr*srcCellW;
         // var id = "instr_"+iInstr;
         // srcID[iInstr] = id;
         var id = srcID[iInstr];

         var src = $("#"+instruments[iInstr]).attr("src");
         var xElement = -instrW/2;
         var yElement = -instrH/2;
         var shadow = paper.image(src,xElement,yElement,instrW,instrH);
         shadow.attr({opacity: 0.2});
         dragAndDrop.addContainer({
            ident : id,
            cx : x + srcCellW/2, cy: y0 + srcCellH/2, widthPlace : srcCellW, heightPlace : srcCellH,
            nbPlaces: 1,
            type : 'list',
            dropMode : 'replace',
            placeBackgroundArray : [shadow]
         });

         var element = paper.image(src,xElement,yElement,instrW,instrH);
         dragAndDrop.insertObject(id, 0, {ident : id, elements : element });
      }
   };

   function initDropArea() {
      paper.image(beaverSrc,xBeaver,yBeaver,beaverW,beaverH);

      var x0 = xDropZone;
      var y0 = yDropZone;
      paper.rect(x0,y0,wDropZone,instrH).attr(srcRectAttr);
      for(var iCell = 0; iCell < nbCells; iCell++){
         var xCell = x0 + iCell*instrW;
         dropCells[iCell] = paper.rect(xCell,y0,instrW,instrH,5).attr(overlayAttr);
         if(iCell > 0){
            paper.path("M"+xCell+" "+y0+",V"+(y0 + instrH)).attr(srcLineAttr);
         }
      }

      dragAndDrop.addContainer({
         ident : 'drop',
         cx : x0 + wDropZone/2,
         cy : y0 + instrH/2,
         widthPlace : instrW,
         heightPlace : instrH,
         nbPlaces : nbCells,
         dropMode : 'replace',
         align: 'left',
         placeBackgroundArray : []
      });
   };

   function initMoves() {
      var xMoves = xUndo + 20 + dxMoves;
      var yMoves = yDropZone;
      movesRaph = paper.text(xMoves,yMoves,"").attr(movesAttr).attr("text-anchor","start");
      updateMovesCount();
   };

   function initUndoButton() {
      undoButton = drawButton(xUndo,yUndo,buttonW,buttonH,taskStrings.undo);
   };

   function initScore() {
      var yText = yScore - 20;
      var xTextScore = xScore;
      if (typeof enableRtl != 'undefined') {
         xTextScore += 750;
      }
      paper.text(xTextScore,yText,taskStrings.score).attr(textAttr);

      var nbStaffLines = 5;
      var staffLineSpacing = hScore/nbStaffLines;
      var x1 = xScore;
      var x2 = xScore + wScore;
      for(var iLine = 0; iLine < nbLines; iLine++){
         var yLine = yScore + iLine*(hScore + marginY) - 5;
         for(var jLine = 0; jLine < nbStaffLines; jLine++){
            var yStaffLine = yLine + staffLineSpacing/2 + jLine*staffLineSpacing;
            paper.path("M"+x1+" "+yStaffLine+",H"+x2).attr(staffLineAttr);
         }
      }
      for(var iInstr = 0; iInstr < score.length; iInstr++){
         var xInstr = xScore + (scoreInstrW + scoreMarginX)*(iInstr%nbInstrPerLine);
         var yInstr = yScore + Math.floor(iInstr/nbInstrPerLine)*(hScore + marginY);
         var instrID = score[iInstr];
         var imgSrc = $("#"+instruments[instrID]).attr("src");
         paper.image(imgSrc,xInstr,yInstr,scoreInstrW,scoreInstrH);
      }
   };

   function initHandlers() {
      undoButton.click(undo);
      undoButton.attr("cursor","pointer");
   };

   function updateMovesCount() {
      var count = answer.moves.length - 1;
      var movesText = taskStrings.moves + " " + count+" / "+maxNbMoves;
      movesRaph.attr("text",movesText);
      if(count > maxNbMoves){
         movesRaph.attr(redMovesAttr);
      }else{
         movesRaph.attr(movesAttr);
      }
   };

   function loadLastMove() {
      var dropSeq = answer.moves[answer.moves.length - 1].seq;
      var dropElements = dragAndDrop.getContainer('drop').draggableElements;
      for(var iCell = 0; iCell < dropSeq.length; iCell++){
         var name = dropSeq[iCell];
         if(!name){
            if(dropElements[iCell]){
               dragAndDrop.removeObject('drop',iCell);
            }
            continue
         }
         if(dropElements[iCell]){
            dragAndDrop.removeObject('drop',iCell);
         }
         dragAndDrop.removeAllObjects(name);
         addInstrument(name,'drop',iCell);
      }

      for(var iInstr = 0; iInstr < srcID.length; iInstr++){
         var id = srcID[iInstr];
         var instrElements = dragAndDrop.getContainer(id).draggableElements;
         if(Beav.Array.has(dropSeq,id,eq) && instrElements[0]){
            dragAndDrop.removeObject(id,0);
         }else if(!Beav.Array.has(dropSeq,id,eq) && !instrElements[0]){
            addInstrument(id,id,0);
         }
      }
   };

   function undo() {
      if(answer.moves.length <= 1){
         return
      }
      displayError("");
      answer.moves.pop();
      loadLastMove();
      updateMovesCount();
      updateUndoButton();
      updateAnimFrame();
   };

   function updateUndoButton() {
      if(answer.moves.length > 1){
         undoButton[0].attr("opacity",1);
      }else{
         undoButton[0].attr("opacity",0.5);
      }
   };

   function checkScore() {
      var move = answer.moves[answer.moves.length - 1];
      var progress = move.scoreProgress;
      var nextInstr = score[progress];
      var currSeq = move.seq;
      var found = false;
      for(var iInstr = 0; iInstr < currSeq.length; iInstr++){
         var name = currSeq[iInstr];
         var id = Beav.Array.indexOf(srcID,name,eq);
         if(id == nextInstr){
            found = { name: name, pos: iInstr };
            break;
         }
      }
      if(!found){
         return
      }
      // if(!progress){
      //    var x = xScore + scoreInstrW + scoreMarginX;
      //    var y = yScore;
      //    // animFrame = paper.rect(x,y).attr(animFrameAttr).attr("opacity",0);
      //    // var params = {opacity:1}
      //    var params = {x:x,y:y};
      // }else{
         var x = xScore + (progress%nbInstrPerLine + 1)*(scoreInstrW + scoreMarginX);
         var y = yScore + Math.floor(progress/nbInstrPerLine)*(hScore + marginY);
         var opacity = (progress >= score.length - 1) ? 0 : 1;
         var params = { x: x, y: y, opacity: opacity};
      // }
      move.scoreProgress++;
      dropCells[found.pos].attr("opacity", 1);
      var anim = new Raphael.animation(params,animTime,function() {
         subTask.delayFactory.destroy("delay");
         subTask.delayFactory.create("delay",checkScore,animTime);
         dropCells[found.pos].attr("opacity", 0);
         if(progress >= score.length - 1){
            checkResult(false);
         }
      });
      subTask.raphaelFactory.animate("anim",animFrame,anim);
      shakeInstr(found);
   };

   function shakeInstr(instrData) {
      var dropCont = dragAndDrop.getContainer('drop');
      var component = dropCont.draggableElements[instrData.pos].component;
      var raphObj = component.element;
      var step = 1;
      shakeAnim(raphObj,step);
   };

   function shakeAnim(raph,step) {
      var x = raph.attr("x");
      var y = raph.attr("y");
      var nbSteps = 16;
      var shakeTime = animTime/nbSteps;
      var cxRot = x + instrW/2;
      var cyRot = y + 3*instrH/4;
      var angle;
      if(step%2 == 0){
         angle = 0;
      }else{
         angle = (step%4 == 1) ? -5 : 5;
      }
      var params = { "transform": "r"+angle+","+cxRot+","+cyRot}
      var anim = new Raphael.animation(params,shakeTime,function() {
         step++;
         if(step <= nbSteps){
            shakeAnim(raph,step);
         }
      });
      subTask.raphaelFactory.animate("animShake",raph,anim);
   };

   function updateAnimFrame() {
      var lastMove = answer.moves[answer.moves.length - 1];
      var progress = lastMove.scoreProgress;
      // console.log(progress)
      // if(!progress){
      //    if(animFrame){
      //       animFrame.remove();
      //    }
      //    return
      // }

      var x = xScore + ((progress - 1)%nbInstrPerLine + 1)*(scoreInstrW + scoreMarginX);
      // var y = yScore + Math.floor((progress - 1)/nbInstrPerLine)*(hScore + marginY);
      var y = yScore;
      // console.log(progress);
      var opacity = (progress >= score.length) ? 0 : 1;
      if(!animFrame){
         animFrame = paper.rect(x,y).attr(animFrameAttr).attr("opacity",opacity);
      }else{
         animFrame.attr({x:x,y:y, opacity: opacity});
      }
   };

   function handleArrows(instrID) {
      if(!arrows){
         var xArrowL = (paperW - nbInstruments*srcCellW)/2 + instrID*srcCellW - arrowW/2;
         var xArrowR = (paperW - nbInstruments*srcCellW)/2 + (instrID + 1)*srcCellW - arrowW/2;
         var arrowL = paper.image(arrowLeftSrc,xArrowL,yArrow,arrowW,arrowH);
         var arrowR = paper.image(arrowRightSrc,xArrowR,yArrow,arrowW,arrowH);
         arrows = paper.set(arrowL,arrowR);
      }else{
         arrows.toFront();
      }
      if(instrID == 0){
         arrows[0].hide();
      }else if(instrID == nbInstruments - 1){
         arrows[1].hide();
      }
   };

   function handleDropFrame(dstPos) {
      var yDropFrame = yDropZone;
      if(dstPos == 0 || dstPos == 2){
         var xDropFrame = xDropZone + instrW;
         dropFramePos = 1;
      }else if(dstPos == 1){
         var xDropFrame = xDropZone;
         dropFramePos = 0;
      }
      if(!dropFrame){
         dropFrame = paper.rect(xDropFrame,yDropFrame,instrW,instrH).attr(dropFrameAttr);
      }else{
         dropFrame.attr({x: xDropFrame, y: yDropFrame});
      }
   };

   function handleDoubleInstr(srcCont,doubleSrc) {
      if(!doubleSrc){
         return
      }
      var switchPlace = srcCont < doubleSrc;
      var cont = dragAndDrop.getContainer(srcCont);
      var component = cont.draggableElements[0].component;
      var xPos = component.cx;
      var yPos = component.cy;
      var xPlus = xPos - instrW/2 - marginX/2;
      var yPlus = yPos;
      var xInstr = xPlus - instrW - marginX/2;
      var yInstr = yPos - instrH/2;

      if(!doubleRaph){
         var plus = paper.text(xPlus, yPlus, "+").attr(plusAttr);
         var instr = drawInstrument(doubleSrc,xInstr,yInstr);
         doubleRaph = paper.set(plus,instr);
      }else{
         doubleRaph[0].attr({x:xPlus,y:yPlus}).toFront();
         doubleRaph[1].attr({x:xInstr,y:yInstr}).toFront();
      }
      var doubleSrcSeq = dragAndDrop.getObjects(doubleSrc);
      if(doubleSrcSeq[0]){
         var dblContObj = dragAndDrop.getContainer(doubleSrc);
         var elements = dblContObj.draggableElements[0];
         elements.component.hide();
      }
      if(switchPlace){
         var mainID = Beav.Array.indexOf(srcID,srcCont,eq);
         var doubleID = Beav.Array.indexOf(srcID,doubleSrc,eq);
         var mainRaph = component.element;
         var newMainSrc = $("#"+instruments[doubleID]).attr("src");
         var newDoubleSrc = $("#"+instruments[mainID]).attr("src");
         mainRaph.attr("src",newMainSrc);
         doubleRaph[1].attr("src",newDoubleSrc);
         // var shift = xPos - xInstr - instrW/2;
         // mainRaph.transform("t"+(-shift)+" 0");
         // doubleRaph[1].transform("t"+(shift)+" 0");
      }
   };

   function addInstrument(name,contID,pos) {
      var xElement = -instrW/2;
      var yElement = -instrH/2;
      var element = drawInstrument(name,xElement,yElement);
      dragAndDrop.insertObject(contID, pos, {ident : name, elements : element });
   };

   function drawInstrument(name,x,y) {
      var id = Beav.Array.indexOf(srcID,name,eq);
      var imgSrc = $("#"+instruments[id]).attr("src");
      return paper.image(imgSrc,x,y,instrW,instrH);
   };

   function drawButton(x,y,w,h,text) {
      var rect = paper.rect(x,y,w,h,h/2).attr(buttonAttr);
      var xIcon = x + 20;
      var yIcon = y + h/2 - iconSize/2;
      var icon = paper.image(undoSrc,xIcon,yIcon,iconSize,iconSize);
      var xText = x + w/2 + 10;
      var yText = y + h/2;
      text = text.toUpperCase();
      var textRaph = paper.text(xText,yText,text).attr(buttonTextAttr);
      return paper.set(rect,icon,textRaph);
   };

   function eq(val1,val2) {
      if(val1 == val2){
         return true
      }
      return false
   };

   function checkResult(noVisual) {
      if(answer.moves.length <= 1){
         var error = taskStrings.noMove;
         if(!noVisual){
            displayError(error)
         }
         return { successRate: 0, message: error }
      }

      var scoreProgress = 0;
      for(var iMove = 0; iMove < answer.moves.length; iMove++){
         var currSeq = answer.moves[iMove].seq;
         do{
            var found = false;
            var nextInstrID = score[scoreProgress];
            if(Beav.Array.has(currSeq,srcID[nextInstrID],eq)){
               scoreProgress++;
               found = true;
            }
         }while(found && scoreProgress < score.length)
      }
      // console.log(scoreProgress);
      if(scoreProgress < score.length){
         var error = taskStrings.notComplete;
         if(!noVisual){
            displayError(error)
         }
         return { successRate: 0, message: error }
      }
      if(!noVisual){
         platform.validate("done");
      }

      var nbMoves = answer.moves.length - 1;
      if(nbMoves <= maxNbMoves){
         return { successRate: 1, message: taskStrings.success }
      }else if(nbMoves == maxNbMoves + 1){
         return { successRate: 0.5, message: taskStrings.tooManyMoves(maxNbMoves) }
      }else{
         return { successRate: 0, message: taskStrings.tooManyMoves(maxNbMoves) }
      }
   };

   function displayError(msg) {
      $("#displayHelper_graderMessage").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
