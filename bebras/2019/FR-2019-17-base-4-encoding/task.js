function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         nSliders: 2,
         nGraduations: 8,
         target: ["R"],
         paperHeight: 310
      },
      medium: {
         nSliders: 6,
         nGraduations: 4,
         target: ["Z","h"],
         paperHeight: 380
      },
      hard: {
         nSliders: 18,
         nGraduations: 2,
         target: ["H","w","b"],
         paperHeight: 470
      }
   };

   var paper;
   var paperWidth = 770;
   var paperHeight;
   var sliderW;
   var graduationH;
   var graduationY = [];
   var sliderHeight;
   var sliderButtonH = 10;
   var margin = 10;
   var symbolSize = 40;
   var labelHeight = 20;
   var x0 = margin;
   var y0 = margin;
   var nGraduations;

   var nSliders;
   var nSymbols;
   var frameWidth;
   var frameHeight;
   var target;
   var startVal = null;
   var nSliderPerLetter;

   var sliderRaph = [];
   var clickAreas = [];
   var result = [];
   var resultRaph = [];
   var targetUnderline = [];
   var resultUnderline = [];

   var resultMarkers = [];
   var listMarkers = [];

   var symbols = [
      "A","B","C","D","E","F","G","H","I","J",
      "K","L","M","N","O","P","Q","R","S","T",
      "U","V","W","X","Y","Z",
      "0","1","2","3","4","5","6","7","8","9",
      "a","b","c","d","e","f","g","h","i","j",
      "k","l","m","n","o","p","q","r","s","t",
      "u","v","w","x","y","z","#","@"];

   var frameAttr = {
      fill: "lightgrey",
      stroke: "none"
   };
   var sliderButtonAttr = {
      stroke: "none",
      fill: "#0066ff"
   };
   var bigSymbolAttr = {
      "font-size": symbolSize,
      "font-weight": "bold"
   };
   var instructionAttr = {
      "font-size": 16
   };
   var labelAttr = {
      "font-size": labelHeight
   };
   var bigUnderlineAttr = {
      width: symbolSize,
      height: 7,
      stroke: "none"
   };
   var smallUnderlineAttr = {
      width: labelHeight,
      height: 7,
      stroke: "none"
   };
   var dragAreaAttr = {
      stroke: "none",
      fill: "red",
      opacity: 0
   };
   var clickAreaAttr = {
      stroke: "none",
      fill: "red",
      opacity: 0
   };
   var targetMarkerAttr = {
      stroke:"black",
      fill:"none"
   };
   var resultMarkerAttr = {
      stroke: "none",
      fill: "#ACFFFC"
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      nSliders = data[level].nSliders;
      nGraduations = data[level].nGraduations;
      target = data[level].target;
      nSymbols = target.length;
      paperHeight = data[level].paperHeight;
      graduationH = (level == "hard") ? 40 : 50;
      sliderW = (level == "hard") ? 20 : 30;
      sliderHeight = (nGraduations - 1)*graduationH;
      frameWidth = (level == "easy") ? sliderHeight + 4*margin : nSliders * (sliderW + 2*margin) + 2*margin;
      frameHeight = (level == "easy") ? nSliders * (sliderW + 2*margin) + 2*margin : sliderHeight + 4*margin;
      sliderButtonAttr.width = (level == "easy") ? sliderButtonH : sliderW;
      sliderButtonAttr.height = (level == "easy") ? sliderW : sliderButtonH;
      dragAreaAttr.width = (level == "easy") ? sliderButtonH + margin : sliderW + 2*margin;
      dragAreaAttr.height = (level == "easy") ? sliderW + 2*margin : sliderButtonH + margin;
      nSliderPerLetter = nSliders/target.length;
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function () {
      initPaper();
      initSliders();
      initResult();
      initSymbolList();
      initHandlers();
      reloadAnswerDisplay();
      displayHelper.customValidate = checkResult;
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
      var defaultAnswer = {sliders:Beav.Array.make(nSliders,0),lastChanged:0};
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result;
   };

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);
      $("#zone_2").css("position","relative");
      if(level != "hard"){
         var x1 = x0 + frameWidth;
         var y1 = 0;
         var w1 = paperWidth - x1;
         var h1 = y0 + labelHeight + 2*margin + frameHeight;
         $("#overlay_1").css({
            display: "block",
            position: "absolute",
            top: y1,
            left: x1,
            width: w1,
            height: h1
         });
      }else{
         $("#overlay_1").css({
            display: "none"
         });
      }
      var x2 = 0;
      var y2 = y0 + labelHeight + 2*margin + frameHeight;
      var w2 = paperWidth;
      var h2 = paperHeight - y2;
      $("#overlay_2").css({
            position: "absolute",
            top: y2,
            left: x2,
            width: w2,
            height: h2
         });
   };

   function initSliders() {
      var xLabel = x0 + frameWidth/2;
      var yLabel = y0 + labelHeight;
      paper.text(xLabel,yLabel,taskStrings.sliders).attr(instructionAttr);
      paper.rect(x0,y0 + 2*margin + labelHeight,frameWidth,frameHeight).attr(frameAttr);
      for(var iSlider = 0; iSlider < nSliders; iSlider++){
         sliderRaph[iSlider] = drawSlider(iSlider);
      }
   };

   function initResult() {
      var verticalMarginForUnderline = 3;
      var w = nSymbols * symbolSize + 2 * (margin*2);
      var h = symbolSize + 2 * margin + labelHeight + verticalMarginForUnderline + bigUnderlineAttr.height;
      if(level != "hard"){
         var x = x0 + frameWidth + (margin*2);
         var y = y0;
      }else{
         var x = x0;
         var y = y0 + frameHeight + (margin*2) + 2*margin + labelHeight;
      }
      var xLabel1 = x + w/2;
      var xLabel2 = xLabel1 + w + margin;
      var yLabel = y + labelHeight;
      paper.text(xLabel1,yLabel,taskStrings.result).attr(instructionAttr);
      paper.text(xLabel2,yLabel,taskStrings.target).attr(instructionAttr);
      paper.rect(x + w + margin,y,w,h);
      for(var iSymbol = 0; iSymbol < nSymbols; iSymbol++){
         var xResult = x + (margin*2) + (iSymbol + 1/2)*symbolSize;
         var xTarget = xResult + w + margin;
         var ySymbol = y + h/2 + margin;
         var xResultUnderline = xResult - symbolSize/2;
         var xTargetUnderline = xTarget - symbolSize/2;
         var yUnderline = ySymbol + symbolSize/2 + verticalMarginForUnderline;
         paper.text(xTarget,ySymbol,target[iSymbol]).attr(bigSymbolAttr);
         resultRaph[iSymbol] = paper.text(xResult,ySymbol,"").attr(bigSymbolAttr);
        resultMarkers[iSymbol] = paper.rect(xResultUnderline,ySymbol - symbolSize/2,symbolSize,symbolSize+5).attr(resultMarkerAttr).attr("fill","none").toBack();
        resultUnderline[iSymbol] = paper.rect(xResultUnderline,yUnderline+3).attr(bigUnderlineAttr).attr("fill","white");
        targetUnderline[iSymbol] = paper.rect(xTargetUnderline,yUnderline+3).attr(bigUnderlineAttr).attr("fill","white");
      }
   };

   function initSymbolList() {
      var horizontalMargin = 30;
      var verticalSpacing = 20;
      var horizontalSymbolSpacing = 21;

      var x = x0;
      var y = y0 + frameHeight + 2*margin + 2*margin + labelHeight;
      if(level == "hard"){
         y += symbolSize + 3 * margin + labelHeight;
      }
      for(var iSymbol = 0; iSymbol < symbols.length; iSymbol++){
         var xs = x + horizontalSymbolSpacing * (iSymbol%32) + horizontalMargin;
         var ys = y + 2*labelHeight + 2*margin;
         if(iSymbol >= 32){
            ys += labelHeight + verticalSpacing;
         }
         paper.text(xs, ys,symbols[iSymbol]).attr(labelAttr);

         listMarkers[iSymbol] = paper.rect(xs - labelHeight/2, ys - labelHeight/2-3,labelHeight,labelHeight+5).attr({stroke:"none",fill:"none"}).toBack();
      }
   };

   function initHandlers() {
      for(var iSlider = 0; iSlider < sliderRaph.length; iSlider++){
         var slider = sliderRaph[iSlider];
         slider.attr("cursor","grab");
         // clickAreas[iSlider].drag(onMove(iSlider),onStart,onEnd);
         Beav.dragWithTouch(clickAreas[iSlider], onMove, onStart, onEnd);
         clickAreas[iSlider].attr("cursor","pointer");
      }
   };

   function drawSlider(id) {
      if(level == "easy"){
         var x = x0 + frameWidth/2;
         var y = y0 + 2*margin + sliderW/2 + id * (2*margin + sliderW) + 2*margin + labelHeight;
         var y1 = y - sliderW/2;
         var y2 = y + sliderW/2;
         for(var iGrad = 0; iGrad < nGraduations; iGrad++){
            graduationY[iGrad] = x - sliderHeight/2 + iGrad * graduationH;
         }
         var axis = paper.path("M"+graduationY[0]+" "+y+",H"+graduationY[7]);
         var graduations = paper.path("M"+graduationY[0]+" "+y1+",V"+y2+
            ",M"+graduationY[1]+" "+y1+",V"+y2+
            ",M"+graduationY[2]+" "+y1+",V"+y2+
            ",M"+graduationY[3]+" "+y1+",V"+y2+
            ",M"+graduationY[4]+" "+y1+",V"+y2+
            ",M"+graduationY[5]+" "+y1+",V"+y2+
            ",M"+graduationY[6]+" "+y1+",V"+y2+
            ",M"+graduationY[7]+" "+y1+",V"+y2);

         var xSlider = graduationY[0] - sliderButtonH/2 + answer.sliders[id] * graduationH;
         var slider = paper.rect(xSlider,y1).attr(sliderButtonAttr);
         var dragArea = paper.rect(graduationY[0] - sliderButtonH/2 - margin/2, y1 - margin).attr(dragAreaAttr);
         clickAreas[id] = paper.rect(graduationY[0] - margin,y1 - margin,sliderHeight + 2*margin,sliderW + 2*margin).attr(clickAreaAttr);
      }else{
         var x = x0 + 2*margin + sliderW/2 + id * (2*margin + sliderW);
         var y = y0 + frameHeight/2 + 2*margin + labelHeight;
         var x1 = x - sliderW/2;
         var x2 = x + sliderW/2;
         for(var iGrad = 0; iGrad < nGraduations; iGrad++){
            graduationY[iGrad] = y + sliderHeight/2 - iGrad * graduationH;
         }

         var axis = paper.path("M"+x+" "+graduationY[0]+",V"+graduationY[nGraduations - 1]);
         var graduations = paper.path("M"+x1+" "+graduationY[0]+",H"+x2+
            ",M"+x1+" "+graduationY[1]+",H"+x2+
            ",M"+x1+" "+graduationY[2]+",H"+x2+
            ",M"+x1+" "+graduationY[3]+",H"+x2);

         var ySlider = graduationY[0] - sliderButtonH/2 - answer.sliders[id] * graduationH;
         var slider = paper.rect(x1,ySlider).attr(sliderButtonAttr);
         var dragArea = paper.rect(x1 - margin, graduationY[0] - sliderButtonH/2 - margin/2).attr(dragAreaAttr);
         clickAreas[id] = paper.rect(x1 - margin,graduationY[nGraduations - 1] - margin,sliderW + 2*margin,sliderHeight + 2*margin).attr(clickAreaAttr);
      }
      return paper.set(slider,dragArea);
   };

   function onStart(x,y,event) {
      onMove(null,null,x,y,event);
   };

   function onEnd(event) {
      if(Beav.Navigator.isIE8()){
         updateResult();
      }
   };

   function onMove(dx,dy,x,y,event) {
      displayError("");
      var xMouse = x - $("#paper").offset().left;
      var yMouse = y - $("#paper").offset().top;
      var id = getSliderID(xMouse,yMouse);
      if(id == null){
         return
      }
      var closestGrad, dir;
      if(level == "easy"){
         closestGrad = Math.round((xMouse - graduationY[0])/graduationH);
         dir = "x";
      }else{
         closestGrad = Math.round((graduationY[0] - yMouse)/graduationH);
         dir = "y";
      }
      closestGrad = Math.max(0,closestGrad);
      closestGrad = Math.min(nGraduations - 1,closestGrad);
      answer.sliders[id] = closestGrad;
      sliderRaph[id][0].attr(dir,graduationY[answer.sliders[id]] - sliderButtonH/2);
      sliderRaph[id][1].attr(dir,graduationY[answer.sliders[id]] - sliderButtonH/2 - margin/2);
      if(!Beav.Navigator.isIE8()){
         updateResult();
      }
      
   };

   function getSliderID(x,y) {
      for(var iSlider = 0; iSlider < clickAreas.length; iSlider++){
         var raph = clickAreas[iSlider];
         var xs = raph.attr("x");
         var ys = raph.attr("y");
         var ws = raph.attr("width");
         var hs = raph.attr("height");
         if(x > xs && y > ys && x < xs + ws && y < ys + hs){
            return iSlider;
         }
      }
      return null;
   };

   function updateResult(noVisual) {
      for(var iSymbol = 0; iSymbol < nSymbols; iSymbol++){
         var val = 0;
         var start = iSymbol * nSliderPerLetter;
         for(var iSlider = start; iSlider < start + nSliderPerLetter; iSlider++){
            var exp = start + nSliderPerLetter - 1 - iSlider;
            val += answer.sliders[iSlider] * Math.pow(nGraduations,exp);
         }
         if(result[iSymbol] && result[iSymbol] != symbols[val]){
            answer.lastChanged = iSymbol;
         }
         result[iSymbol] = symbols[val];
         if(!noVisual){
            if(!Beav.Navigator.isIE8()){
               resultRaph[iSymbol].attr("text",result[iSymbol]);
            }else{
               var x = resultRaph[iSymbol].attr("x");
               var y = resultRaph[iSymbol].attr("y");
               resultRaph[iSymbol].remove();
               resultRaph[iSymbol] = paper.text(x,y,result[iSymbol]).attr(bigSymbolAttr);
            }
         }
      }
      if(!noVisual){
         updateMarkers(answer.lastChanged);
      }
   };

   function updateMarkers(id) {
      eraseUnderlines();
      resetMarkers();
      displayError("");

      resultMarkers[id].attr(resultMarkerAttr);
      var targetID = Beav.Array.indexOf(symbols,target[id]);
      var resultID = Beav.Array.indexOf(symbols,result[id]);

      listMarkers[targetID].attr(targetMarkerAttr);
      listMarkers[resultID].attr(resultMarkerAttr);
      if (resultID == targetID) {
         listMarkers[resultID].attr({stroke:"black"});
      }
   };

   function resetMarkers() {
      for(var iMarker = 0; iMarker < listMarkers.length; iMarker++){
         listMarkers[iMarker].attr({"fill":"none","stroke":"none"});
      }
      for(var iMarker = 0; iMarker < resultMarkers.length; iMarker++){
         resultMarkers[iMarker].attr({"fill":"none","stroke":"none"});
      }
   };

   function highlightError(id) {
      resultUnderline[id].attr("fill","red");
      targetUnderline[id].attr("fill","red");
   };

   function eraseUnderlines() {
      for(var iSymbol = 0; iSymbol < nSymbols; iSymbol++){
         resultUnderline[iSymbol].attr("fill","white");
         targetUnderline[iSymbol].attr("fill","white");
      }
   };

   function reloadAnswerDisplay() {
      updateResult();
   };

   function checkResult(noVisual) {
      updateResult(noVisual);
      for(var iSymbol = 0; iSymbol < nSymbols; iSymbol++){
         if(result[iSymbol] != target[iSymbol]){
            if(result[iSymbol].toUpperCase() == target[iSymbol].toUpperCase()){
               var msg = taskStrings.wrongCase;
            }else{
               var msg = taskStrings.error;
            }
            if(!noVisual){
               displayError(msg);
               highlightError(iSymbol);
            }
            return { successRate: 0, message: msg };
         }
      }
      if(noVisual){
         return { successRate: 1, message: taskStrings.success };
      }else{
         platform.validate("done");
      }
   };

   function displayError(msg) {
      $("#error").text(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
