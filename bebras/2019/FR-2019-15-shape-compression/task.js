function initTask(subTask) {
   var rtl = false;
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         firstTransformation: [[0],[0,1]],
         maxLength:7,
         bestLength: 7,
         target: [0,1,0,0,1,0,0,0,1,0,1],
         paperHeight: 370,
         additionalSpaces: 2
      },
      medium: {
         firstTransformation: [[0,1],[1,0]],
         maxLength: 8,
         bestLength: 7,
         target: [1,0,1,0,0,0,1,0,0,1,0],
         paperHeight: 550,
         additionalSpaces: 2
      },
      hard: {
         firstTransformation: [[0,1],[1,1],[0,0]],
         maxLength: 8,
         bestLength: 6,
         target: [1,0,0,1,1,1,0,1,1,0,1,0,1,1,1,0],
         paperHeight: 550,
         additionalSpaces: 2
      }
   };

   var paper;
   var paperWidth = 770;
   var paperHeight;
   var margin = 10;
   var shapeSize = 40;
   var transformationFrameW;
   var transformationFrameH;
   var ruleW;
   var controlButtonSize = 25;
   var x0 = margin - 1;
   var y0 = margin;
   var sequenceW;
   var sequenceH;
   var sequenceX;
   var sequenceY;
   var frameSequenceX;
   var frameSequenceY;
   var frameResultX;
   var frameResultY;
   var frameResultW;
   var nbShapes;
   var nbTransformationShapes;
   var firstTransformation;
   var maxLength;
   var bestLength;
   var labelHeight = 16;
   var maxTransformationLength = 3;
   var additionalSpaces;

   var sequenceRaph = [];
   var resultRaph = [];
   var targetPos = [];
   var targetFrame;
   var sequenceButtons = [];
   var transformationRaph = [];
   var transformationButtons = [];
   var highlight = [];

   var shapes = ["star","triangle","pentagon"];
   var transformedShapes = ["circle","rectangle"];

   var target;

   var labelAttr = {
      "font-size": labelHeight,
      "text-anchor": "start"
   };
   var shapeAttr = {
      "star":{fill: "#4591af"},
      "triangle":{fill: "#115975"},
      "pentagon":{fill: "#0a3242"},
      "circle":{fill: "#c05252"},
      "rectangle":{fill: "#6d1717"}
   };
   var arrowAttr = {
      stroke: "black",
      "stroke-width": 5,
      "stroke-linecap": "round",
      "stroke-linejoin": "round"
   };
   var frameAttr = {
      stroke: "black",
      r: 12
   };
   var targetBackgroundColor = "#ffffc6";
   var buttonAttr = {
      fill: "lightgrey",
      r: 5
   };
   var buttonLabelAttr = {
      "font-size": controlButtonSize - 5,
      "font-weight": "bold",
   };
   var buttonOffAttr = {
      opacity: 0.5,
      cursor: "auto"
   };
   var buttonOnAttr = {
      opacity: 1,
      cursor: "pointer"
   };
   var highlightAttr = {
      width: shapeSize,
      height: shapeSize,
      stroke: "red",
      "stroke-width": 3,
      r: 5
   };
   var ellipsisAttr = {
      fill: "black",
      stroke: "none"
   };
   var clickHerePathAttr = {
      stroke: "black",
      "stroke-width": 3
   };
   var clickHereTextAttr = {
      fill: "red",
      "font-size": 16,
      "text-anchor": "start"
   };
   var clickAreaAttr = {
      stroke: "none",
      fill: "red",
      opacity: 0
   };

   subTask.loadLevel = function (curLevel) {
      if (typeof(enableRtl) != "undefined") {
         rtl = enableRtl;
      }
      level = curLevel;
      target = data[level].target;
      paperHeight = data[level].paperHeight;
      firstTransformation = data[level].firstTransformation;
      maxLength = data[level].maxLength;
      bestLength = data[level].bestLength;
      additionalSpaces = data[level].additionalSpaces;
      nbShapes = firstTransformation.length;
      nbTransformationShapes = transformedShapes.length;
      if(level == "easy"){
         ruleW = 2 * (shapeSize + margin);
         sequenceW = (maxLength + 0.5) * shapeSize;
         sequenceH = 2 * (controlButtonSize + margin);
         transformationFrameW = ruleW;
         transformationFrameH = 2 * sequenceH + shapeSize + margin;
         sequenceX = x0 + 2 * transformationFrameW + 2*margin;
         sequenceY = y0;
      }else{
         ruleW = 3 * (shapeSize + margin);
         sequenceW = 8 * (shapeSize + margin) + margin;
         sequenceH = 2 * (controlButtonSize + margin);
         transformationFrameW = ruleW + margin + controlButtonSize;
         transformationFrameH = 3 * (shapeSize + margin);
         sequenceX = x0;
         sequenceY = y0 + labelHeight + transformationFrameH + 2*margin;
      }
      frameSequenceX = sequenceX;
      frameSequenceY = sequenceY + labelHeight + margin;
      frameResultW = target.length * (shapeSize) + 2*margin;
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function () {
      initPaper();
      initTransformationRules();
      initSequence();
      initButtons();
      initTarget();
      initClickHere();
      updateResult();
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
      if(level == "easy"){
         var defaultAnswer = {sequence:Beav.Array.make(maxLength,0),transformation:firstTransformation};
      }else{
         var defaultAnswer = {sequence:[0],transformation:firstTransformation};
      }
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
   };

   function initTransformationRules() {
      var xLabel = x0 + 10;
      var yLabel = y0 + labelHeight/2;
      if (rtl) {
         xLabel += transformationFrameW * nbShapes;
      }
      paper.text(xLabel,yLabel,taskStrings.transformationRules).attr(labelAttr);
      for(var iRule = 0; iRule < nbShapes; iRule++){
         var x = x0 + iRule * (transformationFrameW + margin/2);
         var y = y0 + labelHeight + margin;
         paper.rect(x,y,transformationFrameW,transformationFrameH);
         var xShape = x + ruleW/2;
         var yShape = y + margin + shapeSize/2;
         var shape = shapes[iRule];
         drawShape(shape,xShape,yShape);

         updateTransformation(iRule);

         var y1 = yShape + shapeSize/2 + margin;
         var y2 = y + transformationFrameH - 2*margin - shapeSize;
         drawArrow(xShape,y1,y2);

         if(level != "easy"){
            var yButton1 = y2 + margin + shapeSize/2 - controlButtonSize - margin/2;
            var yButton2 = y2 + margin + shapeSize/2;
            var xButton = x + transformationFrameW - controlButtonSize - margin;
            transformationButtons[iRule] = drawButtons(xButton,yButton1,yButton2);
            transformationButtons[iRule][0].click(changeTransformation(iRule,"+"));
            transformationButtons[iRule][1].click(changeTransformation(iRule,"-"));
            transformationButtons[iRule][0].attr(buttonOnAttr);
            transformationButtons[iRule][1].attr(buttonOnAttr);
         }
      }
   };

   function initSequence() {
      var xLabel = sequenceX;
      var yLabel = sequenceY + labelHeight/2;
      if (rtl) {
         xLabel += sequenceW;
      }
      var frameX = frameSequenceX;
      var frameY = frameSequenceY;
      paper.text(xLabel,yLabel,taskStrings.yourSequence).attr(labelAttr);
      paper.rect(frameX,frameY,sequenceW,sequenceH).attr(frameAttr);

      var xArrow = sequenceX + sequenceW/2;
      var y1 = frameY + sequenceH + margin;
      var y2 = y1 + shapeSize;
      drawArrow(xArrow,y1,y2);

      frameResultX = sequenceX;
      frameResultY = y2 + margin;
      var xLabel2 = sequenceX;
      var yLabel2 = frameResultY - labelHeight/2 - margin;
      if (rtl) {
         xLabel2 += frameResultW + additionalSpaces * shapeSize;
      }
      paper.text(xLabel2,yLabel2,taskStrings.result).attr(labelAttr);
      paper.rect(frameResultX,frameResultY,frameResultW + additionalSpaces * shapeSize,sequenceH).attr(frameAttr);
   };

   function initTarget() {
      var xLabel = sequenceX;
      var yLabel = frameResultY + sequenceH + 2*margin + labelHeight/2;
      var frameX = sequenceX;
      var frameY = yLabel + labelHeight/2 + margin;
      if (rtl) {
         xLabel += frameResultW;
      }
      paper.text(xLabel,yLabel,taskStrings.target).attr(labelAttr);
      targetFrame = paper.rect(frameX,frameY,frameResultW,sequenceH).attr(frameAttr).attr("fill",targetBackgroundColor);
      var yShape = frameY + sequenceH/2;
      for(var iShape = 0; iShape < target.length; iShape++){
         var xShape = frameX + margin + shapeSize/2 + iShape * (shapeSize);
         var shape = transformedShapes[target[iShape]];
         drawShape(shape,xShape,yShape);
         targetPos[iShape] = {x:xShape,y:yShape};
      }
   };

   function initButtons() {
      if(level == "easy"){
         return;
      }
      var x = frameSequenceX + sequenceW - shapeSize;
      var y1 = frameSequenceY + sequenceH/2 - controlButtonSize - margin/4;
      var y2 = frameSequenceY + sequenceH/2 + margin/4;
      var buttons = drawButtons(x,y1,y2);
      sequenceButtons[0] = buttons[0];
      sequenceButtons[1] = buttons[1];
   };

   function initClickHere() {
      if(level == "easy"){
         var x = frameSequenceX + sequenceW + margin;
         var y = frameSequenceY;
         var h = sequenceH;
      }else{
         var x = Math.max(frameSequenceX + sequenceW + margin, x0 + nbShapes * (transformationFrameW + margin/2) + margin);
         var y = y0 + labelHeight + margin + transformationFrameH - 2 * controlButtonSize - margin;
         var h = (frameSequenceY + sequenceH) - y;
      }
      paper.path("M"+x+" "+y+",H"+(x + margin)+",V"+(y + h)+",H"+x).attr(clickHerePathAttr);
      if (rtl) {
         x += 12 * margin;
      }
      paper.text(x + 2*margin, y + h/2,taskStrings.clickHere).attr(clickHereTextAttr);
   };

   function drawButtons(x,y1,y2) {
      var rect1 = paper.rect(x,y1,controlButtonSize,controlButtonSize).attr(buttonAttr);
      var rect2 = paper.rect(x,y2,controlButtonSize,controlButtonSize).attr(buttonAttr);
      var label1 = paper.text(x + controlButtonSize/2,y1 + controlButtonSize/2,"+").attr(buttonLabelAttr);
      var label2 = paper.text(x + controlButtonSize/2,y2 + controlButtonSize/2,"-").attr(buttonLabelAttr);
      var button1 = paper.set(rect1,label1);
      var button2 = paper.set(rect2,label2);
      return [button1,button2];
   };

   function addShape() {
      displayError("");
      removeHighlight();
      if(answer.sequence.length < maxLength ){
         answer.sequence.push(0);
         updateResult();
      }
   };

   function removeShape() {
      displayError("");
      removeHighlight();
      if(answer.sequence.length > 1){
         answer.sequence.pop();
         updateResult();
      }
   };

   function drawShape(shape,x,y,clickable) {
      var radius = (clickable) ? shapeSize/2 - 2 : shapeSize/2;
      var shapeObj;
      if(shape == "triangle" || shape == "pentagon"){
         radius = radius/1.3;
      }
      if(shape == "circle"){
         radius = radius/1.3;
         var shape = paper.circle(x,y,radius).attr(shapeAttr[shape]);
      }else if(shape == "rectangle"){
         var xRect = x - radius/2;
         var yRect = (clickable) ? y - radius + 2 : y - radius;
         var wRect = radius;
         var hRect = (clickable) ? 2 * radius - 4 : 2 * radius;
         var shape = paper.rect(xRect,yRect,wRect,hRect).attr(shapeAttr[shape]);
      }else{
         var path = getShapePath(shape,x,y,radius);
         var shape = paper.path(path).attr(shapeAttr[shape]);
      }

      var clickArea = paper.rect(x - shapeSize/2 + 1,y - shapeSize/2 + 1,shapeSize - 2,shapeSize - 2).attr(clickAreaAttr);
      if(clickable){
         // DEPRECATED? (more spacing around star, less between buttons)
         // var button = paper.rect(x - shapeSize/2 ,y - shapeSize/2 ,shapeSize ,shapeSize).attr(buttonAttr).toBack();
         var button = paper.rect(x - shapeSize/2 + 1,y - shapeSize/2 + 1,shapeSize - 2,shapeSize - 2).attr(buttonAttr).toBack();
      }else{
         var button = null;
      }
      return paper.set(shape,clickArea,button);
   };

   function drawEllipsis(x,y) {
      var radius = shapeSize/12;
      var x1 = x - shapeSize/4;
      var x2 = x;
      var x3 = x + shapeSize/4;
      var circle1 = paper.circle(x1,y,radius);
      var circle2 = paper.circle(x2,y,radius);
      var circle3 = paper.circle(x3,y,radius);
      return paper.set(circle1,circle2,circle3).attr(ellipsisAttr);
   };

   function drawArrow(x,y1,y2) {
      path = "M"+x+" "+y1+", V"+y2+", L"+(x - shapeSize/4)+" "+(y2 - shapeSize/4)+", M"+x+" "+y2+", L"+(x + shapeSize/4)+" "+(y2 - shapeSize/4);
      paper.path(path).attr(arrowAttr);
   };

   function updateResult() {
      for(var iShape = 0; iShape < sequenceRaph.length; iShape++){
         if(sequenceRaph[iShape])
            sequenceRaph[iShape].remove();
      }
      for(var iShape = 0; iShape < resultRaph.length; iShape++){
         if(resultRaph[iShape])
            resultRaph[iShape].remove();
      }
      var ySeq = frameSequenceY + sequenceH/2;
      var yRes = frameResultY + sequenceH/2;
      var result = [];
      for(var iEl = 0; iEl < answer.sequence.length; iEl++){
         var x = frameSequenceX + margin + shapeSize/2 + iEl * (shapeSize);
         var shapeID = answer.sequence[iEl];
         var shape = shapes[shapeID];
         sequenceRaph[iEl] = drawShape(shape,x,ySeq,true);
         sequenceRaph[iEl].click(changeShape(iEl));
         sequenceRaph[iEl].attr("cursor","pointer");
         var transformation = answer.transformation[shapeID];
         for(var iShape = 0; iShape < transformation.length; iShape++){
            result.push(transformation[iShape]);
         }
      }
      var nbSlots = target.length + additionalSpaces;
      for(var iEl = 0; iEl < result.length; iEl++){
         if(iEl < nbSlots){
            var x = frameSequenceX + margin + shapeSize/2 + iEl * shapeSize;
            if(iEl == nbSlots - 1){ // DEPRECATED && result.length > nbSlots
               resultRaph[iEl] = drawEllipsis(x,yRes);
            }else{
               var shape = transformedShapes[result[iEl]];
               resultRaph[iEl] = drawShape(shape,x,yRes);
            }
         }
      }
      updateButtons();
   };

   function updateButtons() {
      if(level == "easy"){
         return;
      }
      if(answer.sequence.length <= 1){
         sequenceButtons[1].unclick();
         sequenceButtons[1].attr(buttonOffAttr);
      }else{
         sequenceButtons[1].unclick();
         sequenceButtons[1].click(removeShape);
         sequenceButtons[1].attr(buttonOnAttr);
      }
      if(answer.sequence.length >= maxLength){
         sequenceButtons[0].unclick();
         sequenceButtons[0].attr(buttonOffAttr);
      }else{
         sequenceButtons[0].unclick();
         sequenceButtons[0].click(addShape);
         sequenceButtons[0].attr(buttonOnAttr);
      }

   };

   function updateTransformation(rule) {
      var x = x0 + rule * (transformationFrameW + margin/2) + ruleW/2;
      var y = y0 + labelHeight + margin;

      var transformation = answer.transformation[rule];
      var yShape2 = y + transformationFrameH - margin - shapeSize/2;
      if(transformationRaph[rule]){
         for(var iShape = 0; iShape < transformationRaph[rule].length; iShape++){
            if(transformationRaph[rule][iShape]){
               transformationRaph[rule][iShape].remove();
            }
         }
      }
      transformationRaph[rule] = [];
      for(var iShape = 0; iShape < transformation.length; iShape++){
         var xShape2 = x - (transformation.length - 1) * shapeSize/2 + iShape * shapeSize;
         var shape = transformedShapes[transformation[iShape]];
         transformationRaph[rule][iShape] = drawShape(shape,xShape2,yShape2,(level != "easy"));
         if(level != "easy"){
            transformationRaph[rule][iShape].click(changeTransformationShape(rule,iShape));
            transformationRaph[rule][iShape].attr("cursor","pointer");
         }
      }
   };

   function changeShape(id) {
      return function() {
         displayError("");
         removeHighlight();
         answer.sequence[id] = (answer.sequence[id] + 1)%nbShapes;
         updateResult();
      }
   };

   function changeTransformationShape(rule,id) {
      return function() {
         displayError("");
         removeHighlight();
         answer.transformation[rule][id] = (answer.transformation[rule][id] + 1)%nbTransformationShapes;
         updateTransformation(rule);
         updateResult();
      }
   };

   function changeTransformation(rule,direction) {
      return function() {
         displayError("");
         removeHighlight();
         var transformation = answer.transformation[rule];
         if(direction == "+"){
            if(transformation.length < maxTransformationLength){
               transformation.push(0);
               if(transformation.length >= maxTransformationLength){
                  transformationButtons[rule][0].unclick();
                  transformationButtons[rule][0].attr(buttonOffAttr);
               }
               if(transformation.length == 2){
                  transformationButtons[rule][1].unclick();
                  transformationButtons[rule][1].click(changeTransformation(rule,"-"));
                  transformationButtons[rule][1].attr(buttonOnAttr);
               }
            }
         }else{
            if(transformation.length > 1){
               transformation.pop();
               if(transformation.length <= 1){
                  transformationButtons[rule][1].unclick();
                  transformationButtons[rule][1].attr(buttonOffAttr);
               }
               if(transformation.length == maxTransformationLength - 1){
                  transformationButtons[rule][0].unclick();
                  transformationButtons[rule][0].click(changeTransformation(rule,"+"));
                  transformationButtons[rule][0].attr(buttonOnAttr);
               }
            }
         }
         updateTransformation(rule);
         updateResult();
      }
   };

   function highlightError(id) {
      removeHighlight();
      var x = targetPos[id].x - shapeSize/2;
      var yTarget = targetPos[id].y - shapeSize/2;
      var yResult = frameResultY + sequenceH/2 - shapeSize/2;
      highlight[0] = paper.rect(x,yTarget).attr(highlightAttr);
      highlight[1] = paper.rect(x,yResult).attr(highlightAttr);
   };

   function removeHighlight() {
      for(var i = 0; i < highlight.length; i++){
         if(highlight[i]){
            highlight[i].remove();
         }
      }
   };

   function isResultLengthOk() {
      var result = getResult();
      if(result.length > target.length){
         return false;
      }
      return true;
   };

   function getResult() {
      var result = [];
      for(var iShape = 0; iShape < answer.sequence.length; iShape++){
         var shapeID = answer.sequence[iShape];
         var transformation = answer.transformation[shapeID];
         for(var iEl = 0; iEl < transformation.length; iEl++){
            result.push(transformation[iEl]);
         }
      }
      return result;
   };

   function checkResult(noVisual) {
      var result = getResult();
      for(var iShape = 0; iShape < target.length; iShape++){
         if(!result[iShape] && result[iShape] != 0){
            if(!noVisual){
               displayError(taskStrings.missingShape);
               highlightError(iShape);
            }
            return { successRate: 0, message: taskStrings.missingShape };
         }else if(result[iShape] != target[iShape]){
            if(!noVisual){
               displayError(taskStrings.wrongShape);
               highlightError(iShape);
            }
            return { successRate: 0, message: taskStrings.wrongShape };
         }
      }
      if(result.length > target.length){
         var msg = taskStrings.wrongLength;
         if(!noVisual){
            displayError(msg);
         }
         return { successRate: 0, message: msg };
      }

      if(noVisual){
         if(level == "hard" && answer.sequence.length > bestLength){
            return { successRate: 0.5, message: taskStrings.partialSuccess };
         } else {
            return { successRate: 1, message: taskStrings.success };
         }
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
