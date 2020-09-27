function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         initRollers: [{stamps:[2,1,0,1,0]}],
         target: [1,0,1,2,1,0,1,2,1,0,1,2,1,0,1,2],
         paperHeight: 220,
         tileW: 40,
         maxLength: 5
      },
      medium: {
         initRollers: [
            {stamps:[2,1,0,1,0], start:1, end:5},
            {stamps:[0,1,0,1,2], start:5, end:10}
         ],
         target: [0,1,0,1,2,2,0,1,1,2,2,0,1,1,0,1],
         paperHeight: 320,
         tileW: 40,
         maxLength: 5
      },
      hard: {
         initRollers: [
            {stamps:[2,1,0,1], start:1, end:5},
            {stamps:[0,1,0,1], start:4, end:9},
            {stamps:[0,1,1,2], start:8, end:13}
         ],
         target: [1,0,1,2,1,0,2,2,1,2,0,1,2,0,2,2,1,0,2,0],
         paperHeight: 410,
         tileW: 34,
         maxLength: 4
     }
   };

   var paper;
   var paperWidth = 770;
   var paperHeight;
   var stampsPaper;
   var stampsPaperW;
   var stampsPaperH;
   var margin = 10;
   var x0 = margin + 2;
   var y0 = margin;
   var parametersH;
   var tileH = 25;
   var tileW;
   var tilePatternH = 10;
   var rollersH;
   var rollerSize;
   var rollerCenterR = 10;
   var rollerFrameSize;

   var minLength = 2;
   var maxLength;
   var itineraryH = 10;
   var animTime = 200;

   var nbRollers;
   var target;
   var animationRunning = false;
   var initRollers;

   var stampsRaph = [];
   var tilesRaph = [];
   var tilesLabel = [];
   var tileX = [];
   var tileY;
   var targetRaph = [];
   var rollersRaph = [];
   var itinerariesRaph = [];

   var stampColors = ["#00c14e","#ffff97","#9500b4"];
   var labelAttr = {
      "font-size": 16
   };
   var itineraryAttr = {
      stroke: "grey",
      "stroke-width": 3
   };
   var wrongTileAttr = {
      stroke: "red",
      "stroke-width": 3,
      fill: "rgb(250,150,150)"
   };
   var rollerFrameAttr = {
      stroke: "blue",
      "stroke-width": 3,
      fill: "lightblue",
      opacity: 0
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      paperHeight = data[level].paperHeight;
      initRollers = data[level].initRollers;
      target = data[level].target;
      tileW = data[level].tileW;
      maxLength = data[level].maxLength;
      rollerSize = tileW * 5/(Math.PI);
      rollerFrameSize = rollerSize + 2*margin;
      nbRollers = initRollers.length;
      rollersH = margin + nbRollers*(rollerSize + itineraryH + margin);
      stampsPaperW = maxLength * tileW + margin;
      stampsPaperH = tileH + tilePatternH + margin;
      for(var iRoller = 0; iRoller < nbRollers; iRoller++){
         stampsRaph[iRoller] = [];
      }
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function () {
      initPapers();
      initParameters();
      initTiles();
      initTarget();
      updateRollers();
      displayHelper.customValidateString = taskStrings["try"];
      displayHelper.customValidate = roll;
      displayError("");
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
      var defaultAnswer = [];
      for(var iRoller = 0; iRoller < nbRollers; iRoller++){
         defaultAnswer[iRoller] = JSON.parse(JSON.stringify(initRollers[iRoller]));
         if(level == "easy") {
            defaultAnswer[iRoller].start = 1;
            defaultAnswer[iRoller].end = target.length;
         }
         if(iRoller == 0){
            defaultAnswer[iRoller].selected = true;
         }
      }
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);

      return result;
   };

   subTask.unloadLevel = function (callback) {
      subTask.raphaelFactory.stopAnimate("anim");
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPapers() {
      paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);
      stampsPaper = subTask.raphaelFactory.create("stampsPaper","stampsPaper",stampsPaperW,stampsPaperH);
   };

   function initParameters() {
      var rollerID = getSelectedRollerID();
      var displayedID = (level == "easy") ? "" : rollerID + 1;
      $("#rollerParameters").html(taskStrings.rollerParameters(displayedID));
      $("#nbStamps").html(taskStrings.nbStamps);
      initSelect("nbStamps_",rollerID);
      $("#stamps").html(taskStrings.stamps);
      drawStamps(rollerID);
      $("#clickHere").html(taskStrings.clickHere);
      if(level != "easy"){
         $("#startPos").html(taskStrings.startPos);
         $("#endPos").html(taskStrings.endPos);
         $("#startPos, #endPos").parent().show();
         initSelect("startPos_",rollerID);
         initSelect("endPos_",rollerID);
      }else{
         $("#startPos, #endPos").parent().hide();
      }
      parametersH = $("#parameters").height();
   };

   function initSelect(id,rollerID) {
      var nOptions = (id == "nbStamps_") ? (maxLength - minLength + 1) : target.length;
      var html = "<select id=\""+(id+"select")+"\">";
      for(var iOption = 0; iOption < nOptions; iOption++){
         var val = (id == "nbStamps_") ? minLength + iOption : iOption + 1;
         if(id == "nbStamps_" && val == answer[rollerID].stamps.length ||
            id == "startPos_" && val == answer[rollerID].start ||
            id == "endPos_" && val == answer[rollerID].end){
            html += "<option value="+val+" selected>"+val+"</option>";
         }else{
            html += "<option value="+val+">"+val+"</option>";
         }
      }
      html += "</select>";
      $("#"+id).html(html);

      $("#"+id+"select").change({type:id,rollerID:rollerID},selectHandler);
   };

   function initTiles() {
      var x1 = x0 + rollerSize/2;
      var y1 = y0 + rollersH;
      tileY = y1;
      for(var iTile = 0; iTile < target.length; iTile++){
         x = x1 + iTile * tileW;
         tilesRaph[iTile] = paper.rect(x,y1,tileW,tileH);
         tileX[iTile] = x;
         if(level != "easy"){
            var xLabel = x + tileW/2;
            var yLabel = y1 + tileH + 1.5*margin;
            tilesLabel[iTile] = paper.text(xLabel,yLabel,(iTile + 1)).attr(labelAttr);
         }
      }
   };

   function initTarget() {
      var x1 = x0 + rollerSize/2;
      var yLabel = y0 + rollersH + tileH + 3*margin;
      if(level != "easy"){
         yLabel += margin;
      }
      paper.text(x1,yLabel,taskStrings.target).attr(labelAttr);

      var y1 = yLabel + 2*margin;
      for(var iTile = 0; iTile < target.length; iTile++){
         x = x1 + iTile * tileW;
         var type = target[iTile];
         targetRaph[iTile] = drawTile(x,y1,type);
      }
   };

   function updateRollers() {
      for(var iRoller = 0; iRoller < nbRollers; iRoller++){
         updateRoller(iRoller);
      }
   };

   function updateRoller(id) {
      if(rollersRaph[id]){
         rollersRaph[id].remove();
      }
      if(itinerariesRaph[id]){
         itinerariesRaph[id].remove();
      }
      var x = x0 + rollerSize/2 + (answer[id].start - 1) * tileW;
      var y = y0 + rollersH - (margin/2 + rollerSize/2 + itineraryH) - (rollerSize + 1.5*margin + itineraryH) * (nbRollers - id - 1);

      var center = paper.set();
      center.push(paper.circle(x,y,rollerCenterR)).attr("fill","white");
      if(level == "easy"){
         var label = paper.circle(x,y,rollerCenterR - 5).attr("fill","black");
      }else{
         var label = paper.text(x,y,(id + 1)).attr(labelAttr);
      }
      center.push(label);

      var patternWheel = drawPatternWheel(id,x,y);
      patternWheel.toBack();
      var frame = paper.rect(x - rollerFrameSize/2, y - rollerFrameSize/2,rollerFrameSize,rollerFrameSize,5).attr(rollerFrameAttr).toBack();
      if(answer[id].selected && level != "easy"){
         frame.attr("opacity",1);
      }
      var roller = paper.set(center,patternWheel,frame);
      if(level != "easy"){
         roller.click(changeRoller(id));
         roller.attr("cursor","pointer");
      }
      rollersRaph[id] = roller;

      if(level != "easy"){
         var xStart = x;
         // var yStart = y + rollerFrameSize/2 + itineraryH;
         var yStart = y;
         var xEnd = xStart + tileW * (answer[id].end - answer[id].start + 1);
         itinerariesRaph[id] = paper.path("M"+xStart+" "+(yStart - itineraryH/2)+",V"+(yStart + itineraryH/2)+
            ",M"+xStart+" "+yStart+",H"+xEnd+
            ",M"+xEnd+" "+(yStart - itineraryH/2)+",V"+(yStart + itineraryH/2)).attr(itineraryAttr).toBack();
         frame.toBack();
      }
   };

   function drawPatternWheel(id,x,y) {
      var stamps = answer[id].stamps;
      var L = stamps.length;
      var angle = 360/L;
      var wheel = paper.set();
      for(var iStamp = 0; iStamp < L; iStamp++){
         var rotAngle = -angle * (iStamp);
         var pattern = drawPattern(x,y,angle,stamps[iStamp],L);
         pattern.transform("r"+rotAngle+" "+x+" "+y);
         wheel.push(pattern);
      }
      return wheel;
   };

   function drawPattern(x,y,angle,stamp,nStamps) {
      var R = rollerSize/2 * nStamps/5;
      var wheelPatternH = 7;
      var angleRad = angle * Math.PI / 180;
      var anglePattern = Math.asin(wheelPatternH/R);
      var angle1 = angleRad/2 - anglePattern;
      var angle2 = 2*anglePattern;
      var y1 = y + R;
      var x2 = x + R*Math.sin(angle1);
      var y2 = y + R*Math.cos(angle1);
      var x3 = x + R*Math.sin(angle1 + angle2);
      var y3 = y + R*Math.cos(angle1 + angle2);
      var x4 = x + R*Math.sin(angleRad);
      var y4 = y + R*Math.cos(angleRad);
      var path = "M"+x+" "+y+",V"+y1+",A "+R+" "+R+" 0 0 0 "+x2+" "+y2;
      switch(stamp){
         case 0:
            var rx = wheelPatternH;
            var ry = wheelPatternH;
            path += ",A "+rx+" "+ry+" 0 0 0 "+x3+" "+y3;
            break;
         case 1:
            var x5 = x + (R + wheelPatternH)*Math.sin(angleRad/2);
            var y5 = y + (R + wheelPatternH)*Math.cos(angleRad/2);
            path += ",L"+x5+" "+y5+",L"+x3+" "+y3;
            break;
         case 2:
            var x5 = x + (R + wheelPatternH*0.8)*Math.sin(angle1);
            var y5 = y + (R + wheelPatternH*0.8)*Math.cos(angle1);
            var x6 = x + (R + wheelPatternH*0.8)*Math.sin(angle1 + angle2);
            var y6 = y + (R + wheelPatternH*0.8)*Math.cos(angle1 + angle2);
            path += ",L"+x5+" "+y5+",L"+x6+" "+y6+",L"+x3+" "+y3;
      }
      path += ",A "+R+" "+R+" 0 0 0 "+x4+" "+y4+",Z";
      return paper.path(path).attr("fill",stampColors[stamp]);;
   };

   function selectHandler(event) {
      if(animationRunning){
         return;
      }
      reset();
      var type = event.data.type;
      var rollerID = event.data.rollerID;
      var newVal = parseInt($("#"+type+"select option:selected").attr("value"));
      switch(type) {
         case "nbStamps_":
            for(var iStamp = 0; iStamp < stampsRaph[rollerID].length; iStamp++){
               var raph = stampsRaph[rollerID][iStamp];
               if(raph){
                  raph.remove();
               }
            }
            var currentVal = answer[rollerID].stamps.length;
            if(newVal < currentVal){
               answer[rollerID].stamps.splice(newVal,currentVal - newVal)
            }else if(newVal > currentVal){
               do{
                  answer[rollerID].stamps.push(0)
               }while(answer[rollerID].stamps.length < newVal);
            }
            drawStamps(rollerID);
            break;
         case "startPos_":
            answer[rollerID].start = newVal;
            if(answer[rollerID].end < newVal){
               answer[rollerID].end = newVal;
               $("#endPos_select option:selected").prop("selected",false);
               $("#endPos_select option[value="+newVal+"]").prop("selected",true);
            }
            break;
         case "endPos_":
            answer[rollerID].end = newVal;
            if(answer[rollerID].start > newVal){
               answer[rollerID].start = newVal;
               $("#startPos_select option:selected").prop("selected",false);
               $("#startPos_select option[value="+newVal+"]").prop("selected",true);
            }
            break;
      }
      updateRoller(rollerID);
   };

   function getSelectedRollerID() {
      for(var iRoller = 0; iRoller < answer.length; iRoller++){
         if(answer[iRoller].selected){
            return iRoller;
         }
      }
   };

   function drawStamps(id) {
      var roller = answer[id];
      var stamps = roller.stamps
      for(var iStamp = 0; iStamp < stamps.length; iStamp++){
         drawStamp(id,iStamp);
      }
   };

   function drawStamp(rollerID,stampID) {
      var type = answer[rollerID].stamps[stampID];
      var x = margin/2 + stampID * tileW;
      var y = margin/2;
      var path = getStampPath(x,y,type);
      var stamp = stampsPaper.path(path).attr("fill",stampColors[type]);
      stamp.click(changeStamp(rollerID,stampID));
      stamp.attr("cursor","pointer");
      stampsRaph[rollerID][stampID] = stamp;
   };

   function drawTile(x,y,type) {
      var path = getStampPath(x,y,type,true);
      return paper.path(path).attr("fill",stampColors[type]);
   };

   function getStampPath(x1,y1,type,tile) {
      if(!tile){
         var x2 = x1 + tileW;
         var y3 = y1 + tileH;
         var x4 = x1 + tileW/2 + tilePatternH;
         var x5 = x1 + tileW/2 - tilePatternH;
      }else{
         var x2 = x1 + tileW/2 - tilePatternH;
         var x3 = x1 + tileW/2 + tilePatternH;
         var x4 = x1 + tileW;
         var y5 = y1 + tileH;
      }
      switch(type){
         case 0:
            var rx = tilePatternH;
            var ry = tilePatternH;
            if(!tile){
               var path = "M"+x1+" "+y1+",H"+x2+",V"+y3+",H"+x4+",A "+rx+" "+ry+" 0 0 1 "+x5+" "+y3+",H"+x1+",Z";
            }else{
               var path = "M"+x1+" "+y1+",H"+x2+",A "+rx+" "+ry+" 0 0 0 "+x3+" "+y1+",H"+x4+",V"+y5+",H"+x1+",Z";
            }
            break;
         case 1:
            var x6 = x1 + tileW/2;
            if(!tile){
               var y6 = y1 + tileH + tilePatternH;
               var path = "M"+x1+" "+y1+",H"+x2+",V"+y3+",H"+x4+",L "+x6+" "+y6+",L "+x5+" "+y3+",H"+x1+",Z";
            }else{
               var y6 = y1 + tilePatternH;
               var path = "M"+x1+" "+y1+",H"+x2+",L "+x6+" "+y6+",L"+x3+" "+y1+",H"+x4+",V "+y5+",H"+x1+",Z";
            }
            break;
         case 2:
         if(!tile){
            var y6 = y1 + tileH + tilePatternH;
            var path = "M"+x1+" "+y1+",H"+x2+",V"+y3+",H"+x4+",V "+y6+",H "+x5+",V "+y3+",H"+x1+",Z";
         }else{
            var y6 = y1 + tilePatternH;
            var path = "M"+x1+" "+y1+",H"+x2+",V"+y6+",H"+x3+",V "+y1+",H "+x4+",V "+y5+",H"+x1+",Z";
         }
      }
      return path;
   };

   function changeStamp(rollerID,stampID) {
      return function(){
         if(animationRunning){
            return;
         }
         reset();
         var oldStamp = answer[rollerID].stamps[stampID];
         answer[rollerID].stamps[stampID] = (oldStamp + 1)%3;
         if(stampsRaph[rollerID][stampID]){
            stampsRaph[rollerID][stampID].remove();
         }
         drawStamp(rollerID,stampID);
         updateRoller(rollerID);
      }
   };


   function changeRoller(id) {
      return function() {
         if(animationRunning){
            return;
         }
         reset();
         var previous = getSelectedRollerID();
         if(previous != id){
            answer[previous].selected = false;
            answer[id].selected = true;
            rollersRaph[previous][2].attr("opacity",0);
            rollersRaph[id][2].attr("opacity",1).toBack();
            clearParameters(previous);
            initParameters();
         }
      }
   };

   function clearParameters(prevID) {
      for(var iStamp = 0; iStamp < stampsRaph[prevID].length; iStamp++){
         if(stampsRaph[prevID][iStamp]){
            stampsRaph[prevID][iStamp].remove();
         }
      }
   };

   function rotationAnim(rollerID,start,stampID) {
      var roller = rollersRaph[rollerID];
      var stamps = answer[rollerID].stamps;
      var stamp = stamps[stampID];
      var end = answer[rollerID].end;
      var tileID = start - 1;
      var tile = tilesRaph[tileID];
      var x = tileX[tileID];
      var y = tileY;
      var tx =  tileW;
      var cx = roller[0][0].attr("cx");
      var cy = roller[0][0].attr("cy");
      var rotAngle = 360/stamps.length;
      animationRunning = true;
      var callback = false;
      var transform = (Beav.Navigator.isIE8()) ? {fill:"lightblue"} : {"transform":"...T"+tx+" 0,r"+rotAngle+" "+cx+" "+cy};
      var animRoller = new Raphael.animation(transform,animTime,function(){
         if(callback){  // to avoid multiple callbacks when animated object is a set
            return;
         }else{
            callback = true;
            tile.remove();
            tilesRaph[tileID] = drawTile(x,y,stamp);
            if(tileID < end - 1){
               rotationAnim(rollerID,(start+1),(stampID + 1)%stamps.length);
            }else if(rollerID < (nbRollers - 1)){
               rotationAnim(rollerID+1,answer[rollerID+1].start,0);
            }else{
               animationRunning = false;
               checkResult();
            }
         }
      });
      subTask.raphaelFactory.animate("anim",roller,animRoller);
   };

   function roll() {
      if(animationRunning){
         return;
      }
      reset();
      for(var iRoller = 0; iRoller < rollersRaph.length; iRoller++){
         rollersRaph[iRoller][2].attr("opacity",0);
      }
      rotationAnim(0,answer[0].start,0);
   };

   function reset() {
      displayError("");
      updateRollers();
      for(var iTile = 0; iTile < tilesRaph.length; iTile++){
         tilesRaph[iTile].remove();
         if(level != "easy"){
            tilesLabel[iTile].remove();
         }
      }
      initTiles();
   };

   function highlightTile(id) {
      tilesRaph[id].attr(wrongTileAttr).toFront();
   };

   function checkResult(noVisual) {
      var result = [];
      for(var iRoller = 0; iRoller < nbRollers; iRoller++){
         var start = answer[iRoller].start;
         var end = answer[iRoller].end;
         var stamps = answer[iRoller].stamps;
         for(var iTile = start; iTile <= end; iTile++){
            var stamp = stamps[(iTile - start)%stamps.length];
            result[iTile-1] = stamp;
         }
      }
      for(var iTile = 0; iTile < target.length; iTile++){
         if(result[iTile] != target[iTile]){
            var msg = taskStrings.error;
            if(!noVisual){
               displayError(msg);
               highlightTile(iTile);
            }
            return { successRate: 0, message: msg };
         }
      }
      if(!noVisual){
         platform.validate("done");
      }else{
         return { successRate: 1, message: taskStrings.success };
      }
   };

   function displayError(msg) {
      $("#error").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
