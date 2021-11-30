function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         beavers: [
            [1,3], [3,5], [5,0], [0,4], [4,7]
         ],
         firstItem: 1,
         target: 7,
         nbPerLine: 3
      },
      medium: {
         beavers: [
            [1,3], [2,5], [3,0], [7,4],
            [1,5], [4,2], [7,5], [1,0],
            [1,4], [4,7], [1,0], [1,2],
            [7,6], [7,2], [4,3], [0,3]
         ],
         firstItem: 1,
         target: 6,
         nbPerLine: 4
      },
      hard: {
         beavers: [
            [4,5], [1,5], [3,1], [0,3],
            [7,6], [1,0], [3,2], [0,4],
            [7,4], [1,7], [2,1], [2,4],
            [7,0], [2,0], [5,2], [3,5]
         ],
         firstItem: -1,
         target: 6,
         nbPerLine: 4
      }
   };

   var paper;
   var paperW = 770;
   var paperH, altPaperH;

   var marginX = 20;
   var marginXBeaversHard = 5;
   var marginY = 20;

   var marginXBeaversNotHard = 36;
   var marginXBeaversHard = 2;
   var marginYBeavers = 6;

   var beaverContW = 90;
   var beaverContH = 100;
   var zoomFactor = 0.95; // TODO: fix image size
   var beaverH = 99 * zoomFactor; // DEPRECATED 99*0.75;
   var beaverW = 86 * zoomFactor; // DEPRECATED 86*0.75;
   // var itemW = 30;
   var itemW = 44;
   var itemH = itemW;
   var shapeR = 15;
   var xDropZone;
   var wDropZone;
   var yText, yDropZone;
   var xTeamArea, yTeamArea, wTeamArea, hTeamArea;
   var xTeamButton, yTeamButton;
   var teamButtonW = 270;
   var tryButtonW = 170;
   var buttonH = 35;
   var iconSize = 15;
   var xNoticeForHard = 90;
   if (typeof enableRtl !== 'undefined') {
      xNoticeForHard = 540;
   }
   var xInstrForHard = 0;
   var x0SmallCurrItem;
   var y0SmallCurrItem;

   var rectExchange;
   var rectExchangeLines = [];
   var textNoticeForHard;
   var textInstrForHard;
   var dragAndDrop, rng;
   var beavers, nbBeavers;
   var items = [ /*0*/"cake", /*1*/"carrot", /*2*/"coin", /*3*/"fish",
               /*4*/"icecream", /*5*/"leaf", /*6*/"apple", /*7*/"gem" ];
   var nbItems = items.length;
   var nbPerLine;
   var nbLines;
   var currentItemRaph;
   var firstItem, currentItem, target;
   var maxSeqLength = 7;
   var tryButton, teamButton;
   var animTime = 500;
   var animOverlay, animFrame;
   var teamID = [];
   var mask;
   var smallCurrItem;
   var questionMark;
   var minSteps = 2;

   var beaverSrc = $("#beaver").attr("src");
   var checkSrc = $("#check").attr("src");

   var colors = {
      yellow: "#f5a623",
      black: "#4a4a4a",
      lightGrey: "#ebebeb",
      grey: "#c6c7c9",
      green: "#9acc68",
      blue: "#4a90e2",
      orange: "#ff6300",
      yellow: "#f5a623",
      pink: "#e24a84",
      purple: "#9d62f1",
      red: "#d5172e",
      cyan: "#4ae2d1"
   };
   var shapes = [ "triangle", "diamond", "roundedRectangle", "hexagon", "star", "pentagon", "squareStar", "reverseTriangle" ]; // IE8
   var shapeColors = [ "red", "green", "blue", "yellow", "pink", "purple", "orange", "cyan" ]; // IE8

   var dropZoneAttr = {
      stroke: colors.grey,
      fill: colors.lightGrey,
      r: 5
   };
   var textAttr = {
      "font-size": 16,
      fill: colors.black,
      "text-anchor": "start"
   };
   var titleAttr = {
      "font-size": 14,
      "font-weight": "bold"
   };
   var currentFrameAttr = {
      stroke: colors.blue,
      "stroke-width": 2,
      fill: "none",
      r: 5
   };
   var targetFrameAttr = {
      stroke: colors.yellow,
      "stroke-width": 2,
      fill: "none",
      r: 5
   };
   var wrongFrameAttr = {
      stroke: "red",
      "stroke-width": 3,
      r: 5
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
   var overlayAttr = {
      stroke : "none",
      fill: "red",
      opacity: 0
   };
   var questionMarkAttr = {
      "font-size": 60,
      "font-weight": "bold",
      fill: colors.black
   };
   var shapeAttr = {
      stroke: colors.black,
      "stroke-width": 1
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      firstItem = data[level].firstItem;
      currentItem = firstItem;
      nbPerLine = data[level].nbPerLine;
      target = data[level].target;
      beavers = data[level].beavers.slice();
      nbBeavers = beavers.length;
      nbLines = Math.ceil(nbBeavers/nbPerLine);

      if(level == "hard"){
         wTeamArea = beaverContW*nbPerLine;
         hTeamArea = beaverContH*(nbLines - 1);
         xTeamArea = paperW - wTeamArea - marginX;
         yTeamArea = marginY;
         xTeamButton = xTeamArea + (wTeamArea - teamButtonW)/2;
         yTeamButton = yTeamArea + hTeamArea + marginY;
         yText = yTeamButton + buttonH;
         altPaperH = yTeamButton + buttonH + marginY; // DEPRECATED ?
      }else {
         yText = nbLines*(beaverContH + marginY);
         if (level == "easy") {
            yText += 20;
         }
      }
      yDropZone = yText + 10; // TODO: cleanup
      if (level == "hard") {
         yDropZone += 115; // TODO: cleanup, should be computed as the height of the init beaver zone.
      }
      paperH = yDropZone + beaverContH + marginY;
      wDropZone = maxSeqLength*beaverContW;
      xDropZone = (paperW - wDropZone)/2;
      x0SmallCurrItem = xDropZone - itemW/2;
      y0SmallCurrItem = yDropZone - itemH;
      rng = new RandomGenerator(subTask.taskParams.randomSeed + level.charCodeAt(0));

   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
      // rng.reset(answer.seed);
   };

   subTask.resetDisplay = function () {
      displayError("");
      initPaper();
      initDragAndDrop();
      initBeavers();
      if(level == "hard"){
         initTeamArea();
      }
      initDropArea();
      initButtons();
      initHandlers();
      if(level == "hard" && answer.teamReady){
         teamReady();
      }
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
         currSeq: [],
         team: {},
         teamSrcPos: {},
         teamReady: false,
         beavers: beavers.slice(),
         beaversID: [],
         permutedItems: items.slice(),
         firstItem: firstItem
      };
      rng.shuffle(defaultAnswer.beavers);
      rng.shuffle(defaultAnswer.permutedItems);
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
      Beav.Raphael.loadTextExtensions(paper);

      $("#zone_2").css({ position: "relative", "padding-top": "1px" });
      var y0 = 16;
      var x,y,w,h;
      for(var iOver = 1; iOver <= 6; iOver++){
         var id = "overlay_"+iOver;
         switch(iOver){
            case 1:
               x = 0; y = y0;
               w = (level == "easy") ? 195 : 130;
               h = (level != "hard") ? yDropZone : 0;
               break;
            case 2:
               if(level != "hard"){
                  x = (level == "easy") ? 545 : 645;
                  y = y0;
               }else{
                  x = xTeamArea - 15;
                  y = y0 + yTeamButton + buttonH;
               }
               w = paperW - x;
               h = yDropZone - y + y0;
               break;
            case 3:
               x = 0;
               y = (level == "easy") ? 240 : 455;
               w = paperW;
               h = yDropZone - y + y0;
               break;
            case 4:
               x = 0; y = y0 + yDropZone;
               w = xDropZone;
               h = beaverContH;
               break;
            case 5:
               x = xDropZone + maxSeqLength*beaverContW;
               y = y0 + yDropZone;
               w = paperW - x;
               h = beaverContH;
               break;
            case 6:
               x = 0;
               y = y0 + yDropZone + beaverContH;
               w = paperW; h = paperH - y;
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
            displayError("");
            resetAnim();
            answer.currSeq = this.getObjects("drop");
            if(level == "hard"){
               answer.team = {};
               for(var iPlace = 0; iPlace < teamID.length; iPlace++){
                  var teamPlace =  teamID[iPlace];
                  answer.team[teamPlace] = this.getObjects(teamPlace)[0];
               }
               // console.log(answer.team)
            }
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType)
         {
            var srcContObj = this.getContainer(srcCont);
            var elements = srcContObj.draggableElements;
            var elementID = elements[srcPos].ident;
            if(answer.teamReady){
               if(dstCont != 'drop'){
                  return DragAndDropSystem.action(answer.teamSrcPos[elementID],0,'insert');
               }
            }else if ((dstCont == 'drop') && (level == "hard")){
               return false
            }
            if(dstCont == null || (dstCont != 'drop' && !Beav.Array.has(teamID,dstCont))){
               return DragAndDropSystem.action(elementID,0,'insert');
            }
            if(Beav.Array.has(teamID,dstCont)){
               return true
            }
            return true
         },
         ejected : function(refEl, previousCont, previousPos) {

         },
         actionIfEjected : function(refElement, previousContainerId, previousPos) {
            var contObj = this.getContainer(previousContainerId);
            var elements = contObj.draggableElements;
            var elementID = elements[previousPos].ident;
            if(answer.teamReady){
               return DragAndDropSystem.action(answer.teamSrcPos[elementID],0,'insert');
            }
            return DragAndDropSystem.action(refElement.ident,0,'insert');
         }
      });
   };

   function initBeavers() {
      var y0 = marginY;
      if(level != "hard"){
         var spacing = marginXBeaversNotHard; // (paperW - 2*marginX - nbPerLine*beaverContW)/nbPerLine;
         var x0 = marginX + (paperW - 2*marginX)/2 - ((spacing+beaverContW)*nbPerLine)/2;
      }else{
         var x0 = marginXBeaversHard;
         var spacing = marginXBeaversHard;
      }
      for(var iBeav = 0; iBeav < nbBeavers; iBeav++){
         var line = Math.floor(iBeav/nbPerLine);
         var x = x0 + (line%2)*spacing + (iBeav%nbPerLine)*(beaverContW + spacing);
         var y = y0 + line*(beaverContH + marginYBeavers);
         var beavItems = answer.beavers[iBeav];
         var id = "beav_"+iBeav;
         answer.beaversID[iBeav] = id;

         dragAndDrop.addContainer({
            ident : id,
            cx : x + beaverContW/2, cy: y + beaverContH/2, widthPlace : beaverContW, heightPlace : beaverContH,
            nbPlaces: 1,
            type : 'list',
            dropMode : 'insert',
            //sourceElemArray : beaver,
            placeBackgroundArray : []
         });

         var xElement = -beaverW/2;
         var yElement = -beaverH/2;
         var element = drawBeaver(xElement,yElement,beavItems);
         dragAndDrop.insertObject(id, 0, {ident : id, elements : element });
      }
   };

   function initTeamArea() { // only for hard
      var x0 = xTeamArea;
      textNoticeForHard = paper.text(marginX + xNoticeForHard,yDropZone+18*1.5,taskStrings.noticeForHard, textAttr['font-size']).attr(textAttr);

      textInstrForHard = paper.text(xTeamArea,yTeamButton+buttonH+15,taskStrings.instrForHard, textAttr['font-size']).attr(textAttr).valign('top');
      textInstrForHard.hide();

      paper.rect(x0,yTeamArea,wTeamArea,hTeamArea).attr(dropZoneAttr);

      var w = beaverContW;
      var h = beaverContH;
      for(var iRow = 0; iRow < nbLines - 1; iRow++){
         var y = yTeamArea + iRow*h;
         var yc = y + h/2;
         for(var iCol = 0; iCol < nbPerLine; iCol++){
            var id = 'team_'+(iRow*nbPerLine + iCol);
            teamID.push(id);
            var x = xTeamArea + iCol*w;
            var xc = x + w/2;
            dragAndDrop.addContainer({
               ident : id,
               cx : xc,
               cy : yc,
               widthPlace : w,
               heightPlace : h,
               nbPlaces : 1,
               dropMode : 'replace',
               dragDisplayMode: 'preview',
               placeBackgroundArray : []
            });
            if(answer.team[id]){
               var name = answer.team[id];
               var beavID = Beav.Array.indexOf(answer.beaversID,name);
               var beavItems = answer.beavers[beavID];
               var element = drawBeaver(-beaverW/2,-beaverH/2,beavItems);
               dragAndDrop.insertObject(id, 0, {ident : name, elements : element });
               dragAndDrop.removeAllObjects(name);
            }
         }
      }
   };

   function initDropArea() {
      var x0 = marginX/2;
      var w = beaverContW;
      var h = beaverContH;
      var wItem = w*0.6;
      var hItem = wItem; // we want a square
      var xTitle1 = x0 + wItem/2;
      var yTitle = yDropZone - 20;
      paper.text(xTitle1,yTitle,taskStrings.startItem).attr(titleAttr);
      paper.rect(x0,yDropZone,wItem,hItem).attr(currentFrameAttr);
      var currentItemCode = answer.permutedItems[currentItem];
      if (level == "hard") {
         questionMark = paper.text(x0 + wItem/2,yDropZone + hItem/2,"?").attr(questionMarkAttr);
      }
      currentItemRaph = drawItem(currentItemCode,x0,yDropZone,wItem,hItem);
      if (level == "hard") {
         // Safari displays undefined images as an interrogation mark, unlike
         // other browsers displaying nothing
         currentItemRaph.hide();
      }

      var xTarget = paperW - marginX/2 - wItem;
      var xTitle2 = xTarget + wItem/2;
      paper.text(xTitle2,yTitle,taskStrings.itemToFind).attr(titleAttr);
      paper.rect(xTarget,yDropZone,wItem,hItem).attr(targetFrameAttr);
      drawItem(answer.permutedItems[target],xTarget,yDropZone,wItem,hItem);

      dragAndDrop.addContainer({
         ident : 'drop',
         cx : xDropZone + wDropZone/2,
         cy : yDropZone + h/2,
         widthPlace : w,
         heightPlace : h,
         nbPlaces : maxSeqLength,
         dropMode : 'insertBefore',
         dragDisplayMode: 'marker',
         placeBackgroundArray : []
      });
      if(answer.currSeq.length > 0){
         var seq = answer.currSeq;
         for(var iPlace = 0; iPlace < seq.length; iPlace++){
            var name = seq[iPlace];
            if(name == null){
               continue
            }
            var id = Beav.Array.indexOf(answer.beaversID,name);
            var beavItems = answer.beavers[id];
            var element = drawBeaver(-beaverW/2,-beaverH/2,beavItems);
            dragAndDrop.insertObject('drop', iPlace, {ident : name, elements : element });
            dragAndDrop.removeAllObjects(name);
         }
      }
      rectExchangeLines = [];
      for (var iPlace = 1; iPlace < maxSeqLength; iPlace++) {
         var xLine = xDropZone + iPlace * w;
         rectExchangeLines.push(paper.path(["M", xLine, yDropZone, "L", xLine, yDropZone + h]).attr(dropZoneAttr).toBack());
      }
      rectExchange = paper.rect(xDropZone,yDropZone,wDropZone,h).attr(dropZoneAttr).toBack();
      if(level == "hard"){
         hideTargetArea();
      }
   };

   function hideTargetArea() {
      // TODO: deactivate this drop area
      rectExchange.attr({stroke: "#FFFFFF", fill: "#FFFFFF"});
      for (var iLine = 0; iLine < rectExchangeLines.length; iLine++) {
         rectExchangeLines[iLine].attr({stroke:"#FFFFFF", fill: "#FFFFFF"});
      }
   }

   function showTargetArea() {
       rectExchange.attr(dropZoneAttr); // TODO: enable the area instead
       for (var iLine = 0; iLine < rectExchangeLines.length; iLine++) {
          rectExchangeLines[iLine].toFront().attr(dropZoneAttr);
       }
   }

   function initButtons() {
      if(level == "hard"){
         displayHelper.hideValidateButton = true;
         teamButton = drawButton(xTeamButton,yTeamButton,teamButtonW,buttonH,taskStrings.myTeam);
      }
   };

   function initHandlers() {
      if(level == "hard"){
         teamButton.click(checkTeam);
         teamButton.attr("cursor","pointer");
      }
   };

   function checkTeam() {
      answer.teamSrcPos = {};
      var nbBeav = 0;
      for(var iPlace = 0; iPlace < nbBeavers - 4; iPlace++){
         var placeID = "team_"+iPlace;
         var obj = dragAndDrop.getObjects(placeID);
         if(obj[0]){
            answer.teamSrcPos[obj[0]] = placeID;
            nbBeav++;
         }
      }

      if(nbBeav == 0){
         displayError(taskStrings.emptyTeam);
      }else{
         teamReady();
      }
   };

   function teamReady() {
      answer.teamReady = true;

      /* mask source */
      var wMask = xTeamArea;
      var hMask = yTeamArea + nbLines*(beaverContH + marginYBeavers);
      mask = paper.rect(0,0,wMask,hMask).attr(overlayAttr);
      paper.setSize(paperW,paperH);
      changeSrcBeaversOpacity(0.5);

      /* change button */
      teamButton[2].attr("text",taskStrings.changeTeam.toUpperCase());
      teamButton.unclick();
      teamButton.click(changeTeam);

      var teamValid = isTeamValid();
      if(teamValid === true){
         var team = [];
         for(var place in answer.team){
            var name = answer.team[place];
            if(name){
               team.push(name);
            }
         }
         do{
            var validFirstItem = true;
            answer.firstItem = rng.nextInt(0,nbItems - 1);
            var nbSteps = getNbStepsFromTarget(team);
            if(nbSteps < minSteps){
               validFirstItem = false;
            }
         }while(!validFirstItem)
      }else{
         answer.firstItem = teamValid;
      }
      var x = marginX/2;
      var w = beaverContW;
      var wItem = w*0.6;
      var hItem = wItem;
      currentItemRaph = drawItem(answer.permutedItems[answer.firstItem],x,yDropZone,wItem,hItem);
      // if(false){
      //    var src = itemSrc[answer.permutedItems[answer.firstItem]];
      //    currentItemRaph.attr("src",src);
      // }else{

      // }
      if(level == "hard"){
         questionMark.hide();
         currentItemRaph.show();
      }

      /* make target area visible in hard */
      if(level == "hard"){
          textNoticeForHard.hide();
          textInstrForHard.show();
          // tryButton.show();
          displayHelper.hideValidateButton = false;
          showTargetArea();
      }
   };

   function changeSrcBeaversOpacity(op) {
      for(var iBeav = 0; iBeav < answer.beaversID.length; iBeav++){
         var id = answer.beaversID[iBeav];
         var cont = dragAndDrop.getContainer(id);
         if(cont.draggableElements[0]){
            var elem = cont.draggableElements[0].component.element;
            if(elem){
               elem.attr("opacity",op);
            }
         }
      }
   };

   function getNbStepsFromTarget(team) {
      var currItem = target;
      var currTeam = team.slice();
      var nbSteps = 0;
      while(currItem != answer.firstItem && nbSteps < minSteps){
         for(var iBeav = 0; iBeav < currTeam.length; iBeav++){
            var beavName = currTeam[iBeav];
            var beavID = Beav.Array.indexOf(answer.beaversID,beavName);
            var beavItems = answer.beavers[beavID];
            if(beavItems[1] == currItem){
               currItem = beavItems[0];
               nbSteps++;
               currTeam.splice(iBeav,1);
               break;
            }
         }
      }
      return nbSteps
   };

   function isTeamValid() {
      var team = [];
      for(var place in answer.team){
         var name = answer.team[place];
         if(name){
            team.push(name);
         }
      }
      for(var iItem = 0; iItem < nbItems; iItem++){
         if(iItem == target){
            continue
         }
         var res = findSequence(iItem,team);
         if(res === false){
            return iItem
         }
      }
      return true
   };

   function findSequence(item,team){
      for(var iBeav = 0; iBeav < team.length; iBeav++){
         var beavName = team[iBeav];
         var beavID = Beav.Array.indexOf(answer.beaversID,beavName);
         var beavItems = answer.beavers[beavID];
         if(beavItems[0] == item){
            if(beavItems[1] == target){
               return true
            }else{
               var newItem = beavItems[1]
               var newTeam = team.slice();
               newTeam.splice(iBeav,1);
               if(findSequence(newItem,newTeam)){
                  return true
               }
            }
         }
      }
      return false
   };

   function changeTeam() {
      displayError("");
      changeSrcBeaversOpacity(1);
      answer.teamReady = false;
      if(mask){
         mask.remove();
      }
      if(animFrame){
         animFrame.remove();
      }

      questionMark.show();
      currentItemRaph.hide();
      if(smallCurrItem){
         smallCurrItem.remove();
      }
      answer.firstItem = -1;

      teamButton[2].attr("text",taskStrings.myTeam.toUpperCase());
      teamButton.unclick();
      teamButton.click(checkTeam);

      var dropSeq = dragAndDrop.getObjects('drop');
      for(var iBeav = 0; iBeav < dropSeq.length; iBeav++){
         var name = dropSeq[iBeav];
         if(name){
            var teamPlace = answer.teamSrcPos[name];
            var id = Beav.Array.indexOf(answer.beaversID,name);
            var beavItems = answer.beavers[id];
            var element = drawBeaver(-beaverW/2,-beaverH/2,beavItems);
            dragAndDrop.insertObject(teamPlace, 0, {ident : name, elements : element });
            answer.team[teamPlace] = name;
         }
      }
      dragAndDrop.removeAllObjects('drop');
      answer.currSeq = [];

      /* make target area unvisible in hard */
      if(level == "hard"){
          textNoticeForHard.show();
          textInstrForHard.hide();
          // tryButton.hide();
          displayHelper.hideValidateButton = true;
          hideTargetArea();
      }
   };

   function drawButton(x,y,w,h,text) {
      var rect = paper.rect(x,y,w,h,h/2).attr(buttonAttr);
      var xIcon = x + 20;
      var yIcon = y + h/2 - iconSize/2;
      var icon = paper.image(checkSrc,xIcon,yIcon,iconSize,iconSize);
      var xText = x + w/2;
      var yText = y + h/2;
      text = text.toUpperCase();
      var textRaph = paper.text(xText,yText,text).attr(buttonTextAttr);
      return paper.set(rect,icon,textRaph);
   };

   function checkResult(noVisual) {
      if(!noVisual){
         displayError("");
         alignBeaversLeft();
      }
      if(!answer.currSeq[0]){
         var error = taskStrings.emptyDrop;
         if(!noVisual){
            displayError(error);
         }
         return { successRate: 0, message: error }
      }
      if(!noVisual){
         animOverlay = paper.rect(0,0,paperW,paperH).attr(overlayAttr);
         var xFrame = xDropZone;
         animFrame = paper.rect(xFrame,yDropZone,beaverContW,beaverContH).attr(currentFrameAttr);
         var sim = subTask.simulationFactory.create("sim");
      }
      var index = 0;
      var stop = false;
      currentItem = answer.firstItem;
      do{
         var error = null;
         var currentBeaver = answer.currSeq[index];
         var nextBeaver = (index < answer.currSeq.length - 1) ? answer.currSeq[index + 1] : null;
         var currBeavID = Beav.Array.indexOf(answer.beaversID,currentBeaver);
         var beavItems = answer.beavers[currBeavID];
         if(!noVisual && index == 0){
            // var src = $("#"+answer.permutedItems[currentItem]).attr("src");
            // var src = itemSrc[answer.permutedItems[currentItem]];
            // smallCurrItem = paper.image(src,x0SmallCurrItem,y0SmallCurrItem,itemW,itemH);
            smallCurrItem = drawItem(answer.permutedItems[currentItem],x0SmallCurrItem,y0SmallCurrItem,itemW,itemH);
         }

         if(index == 0 && beavItems[0] != currentItem){
            var name1 = answer.permutedItems[beavItems[0]];
            var name2 = answer.permutedItems[currentItem];
            var error = taskStrings.errorExchange; // (name1,name2)
            if(!noVisual){

               subTask.simulationFactory.destroy("sim");
               // var x = xDropZone + 10;
               var anim = new Raphael.animation({transform: "t 35 0"},animTime,function() {
                  displayError(error);
                  animFrame.attr(wrongFrameAttr);
                  animOverlay.remove();
               });
               subTask.raphaelFactory.animate("anim",smallCurrItem,anim);
            }
            return { successRate: 0, message: error }
         }

         var newItem = beavItems[1];
         currentItem = newItem;

         if(!noVisual){
            var simStep = new SimulationStep();
         }
         var validate = false;
         var itemError = false;
         if(newItem == target){
            validate = true;
         }
         if(!nextBeaver && newItem != target){
            error = taskStrings.errorWrongItem; // (answer.permutedItems[target]);
            if (level == "hard") {
               error += " " + taskStrings.instrChangeTeam;
            }
            itemError = true;
         }

         if(!noVisual){
            var currX = xDropZone + index*beaverContW;
            var simAction = {onExec: translateFrame(null,index), duration: animTime, params: { x: currX }};
            var simEntry = {name: "entry"+index+"1", action: simAction};
            simStep.addEntryAllParents(simEntry);
         }else if(validate){
            var teamSize = 0;
            for(var iBeav = 0; iBeav < answer.currSeq.length; iBeav++){
               if(answer.currSeq[iBeav]){
                  teamSize++;
               }
            }
            for(var teamPlace in answer.team){
               if(answer.team[teamPlace]){
                  teamSize++;
               }
            }
            if(level != "hard" || teamSize == nbItems - 1){
               return { successRate: 1, message: taskStrings.success }
            }else if(teamSize == nbItems){
               return { successRate: 0.5, message: taskStrings.tooManyBeavers }
            }else{
               return { successRate: 0.25, message: taskStrings.tooManyBeavers }
            }
         }

         if(nextBeaver && !validate){
            var nextBeavID = Beav.Array.indexOf(answer.beaversID,nextBeaver);
            var nextItems = answer.beavers[nextBeavID];

            if(nextItems[0] != currentItem){
               var name1 = answer.permutedItems[nextItems[0]];
               var name2 = answer.permutedItems[currentItem];
               error = taskStrings.errorExchange; // (name1,name2)
               stop = true;
            }
            index++;

            if(!noVisual){
               var newXFrame = xFrame + index*beaverContW;
               var simAction3 = {onExec: translateFrame(error,index,newItem,false,false,itemError), duration: animTime, params: {x:newXFrame}}
               var simEntry3 = {name: "entry"+index+"3", action: simAction3};
               simStep.addEntryAllParents(simEntry3);
            }
         }else{
            if(!noVisual){
               var simAction = {onExec: translateFrame(error,index + 1,newItem,true,validate,itemError), duration: animTime, params: { x: currX }};
               var simEntry = {name: "entry"+index+"3", action: simAction};
               simStep.addEntryAllParents(simEntry);
            }
            stop = true;
         }
         if(!noVisual){
            sim.addStep(simStep);
         }else if(error){
            return { successRate: 0, message: error }
         }

      }while(index < answer.currSeq.length && !stop)

      if(!noVisual && sim.canPlay()){
         sim.setAutoPlay(true);
         sim.play();
      }
   };

   function alignBeaversLeft() {
      var seq = answer.currSeq;
      for(var iCell = 0; iCell < seq.length; iCell++){
         var content = seq[iCell];
         if(content == null && iCell < seq.length - 1){
            for(var jCell = iCell + 1; jCell < seq.length; jCell++){
               var next = seq[jCell];
               if(next != null){
                  seq[iCell] = next;
                  seq[jCell] = null;
                  dragAndDrop.removeObject('drop',jCell);
                  var id = Beav.Array.indexOf(answer.beaversID,next);
                  var beavItems = answer.beavers[id];
                  var element = drawBeaver(-beaverW/2,-beaverH/2,beavItems);
                  dragAndDrop.insertObject('drop', iCell, {ident : next, elements : element });
                  break;
               }
            }
         }
      }
   };

   function translateFrame(error,step,newItem,lastBeaver,validate,itemError) {
      return function(params,duration,callback) {
         var anim = new Raphael.animation(params,duration,callback);
         subTask.raphaelFactory.animate("anim",animFrame,anim);
         if(newItem != undefined){
            // console.log(step,"translate frame",newItem);
            if(smallCurrItem){
               smallCurrItem.remove();
            }
            var x = x0SmallCurrItem + step*beaverContW;
            var y = yDropZone - itemH;
            // var src = $("#"+answer.permutedItems[newItem]).attr("src");
            // var src = itemSrc[answer.permutedItems[newItem]];
            // smallCurrItem = paper.image(src,x,y,itemW,itemH).attr("opacity",0);
            smallCurrItem = drawItem(answer.permutedItems[newItem],x,y,itemW,itemH);
            smallCurrItem.attr("opacity",0);
            // var newOpacity = (lastBeaver) ? 0 : 1;

            var anim = new Raphael.animation({opacity: 1},duration,callback);
            subTask.raphaelFactory.animate("anim",smallCurrItem,anim);
         }else{
            // console.log(step,"translate item");

            // var x = xDropZone + step*beaverContW + 10;
            // var anim = new Raphael.animation({x: x},duration);
            // smallCurrItem.transform("");
            var anim = new Raphael.animation({transform: "t"+35+" 0"},duration);
            subTask.raphaelFactory.animate("anim",smallCurrItem,anim);
         }
         return { stop: function() {
            if(error){
               displayError(error);
               if(!itemError){
                  animFrame.attr(wrongFrameAttr);
               }else{
                  var xError = xDropZone + step*beaverContW - itemW/2;
                  var yError = yDropZone - itemH;
                  var rect = paper.rect(xError,yError,itemW,itemH).attr(wrongFrameAttr);
                  smallCurrItem = paper.set(smallCurrItem,rect);
               }
               animOverlay.remove();
               subTask.simulationFactory.destroy("sim");
            }else if(validate){
               platform.validate("done");
               animOverlay.remove();
               subTask.simulationFactory.destroy("sim");
            }
         }};

      }
   };

   function resetAnim() {
      currentItem = answer.firstItem;
      // currentItemRaph.attr("src",itemSrc[answer.permutedItems[currentItem]]);
      if(level != "hard" || answer.teamReady){
         currentItemRaph.remove();
         var x = marginX/2;
         var w = beaverContW;
         var wItem = w*0.6;
         var hItem = wItem;
         currentItemRaph = drawItem(answer.permutedItems[currentItem],x,yDropZone,wItem,hItem);
      }
      // console.log(x,yDropZone,w,h)
   };

   function drawBeaver(x,y,beavItems) {
      var beaver = paper.image(beaverSrc,x,y,beaverW,beaverH);
      var itemRaph = [];
      for(var iItem = 0; iItem < beavItems.length; iItem++){
         var xRatio = (iItem) ? 0.94 : 0.39;
         var yRatio = (iItem) ? 0.75 : 0.22;
         var xItem = x + beaverW*xRatio - itemW/2;
         var yItem = y + beaverH*yRatio - itemH/2;
         var itemID = beavItems[iItem];
         // var itSrc = itemSrc[answer.permutedItems[itemID]];
         // itemRaph[iItem] = paper.image(itSrc,xItem,yItem,itemW,itemH);
         itemRaph[iItem] = drawItem(answer.permutedItems[itemID],xItem,yItem,itemW,itemH);
      }

      return [beaver,itemRaph[0],itemRaph[1]];
   };

   function drawItem(name,x,y,w,h) {
      var item;
      if(!Beav.Navigator.isIE8()){
         var currentItemSrc = itemSrc[name];
         item = paper.image(currentItemSrc,x,y,w,h).toBack();
      }else{
         var shapeID = Beav.Array.indexOf(items,name);
         var shapeName = shapes[shapeID];
         var color = colors[shapeColors[shapeID]];
         var xShape = x + w/2;
         var yShape = y + h/2;
         item = getShape(paper,shapeName,xShape,yShape,shapeR).attr(shapeAttr).attr("fill",color);
      }
      return item
   };

   function displayError(msg) {
      $("#displayHelper_graderMessage").html(msg);
      if(msg == "" && animFrame){
         animFrame.remove();
         if(smallCurrItem){
            smallCurrItem.remove();
         }
      }
   };

   var itemSrc = {
      apple: "data:image/png;base64,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",
      cake: "data:image/png;base64,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",
      carrot: "data:image/png;base64,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",
      coin: "data:image/png;base64,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",
      fish: "data:image/png;base64,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",
      gem: "data:image/png;base64,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",
      icecream: "data:image/png;base64,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",
      leaf: "data:image/png;base64,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"
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
