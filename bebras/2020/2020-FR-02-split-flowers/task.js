function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         mushroomPos: [
            { x: 81, y: 73, type: 0 },
            { x: 160, y: 120, type: 0 },
            { x: 250, y: 60, type: 0 },
            { x: 330, y: 160, type: 0 },
            { x: 400, y: 65, type: 0 },
            { x: 480, y: 120, type: 0 },
            { x: 550, y: 203, type: 0 },
            { x: 600, y: 73, type: 0 },
            { x: 690, y: 150, type: 0 },
            { x: 192, y: 218, type: 0 },
            { x: 407, y: 250, type: 0 },
            { x: 640, y: 357, type: 0 },
            { x: 101, y: 300, type: 1 },
            { x: 261, y: 330, type: 1 },
            { x: 88, y: 496, type: 1 },
            { x: 187, y: 421, type: 1 },
            { x: 285, y: 526, type: 1 },
            { x: 423, y: 492, type: 1 },
            { x: 349, y: 403, type: 1 },
            { x: 477, y: 407, type: 1 },
            { x: 566, y: 515, type: 1 },
            { x: 688, y: 512, type: 1 },
            { x: 80, y: 410, type: 1 }
         ],
         nbLines: 1
      },
      medium: {
         mushroomPos: [
            { x: 111, y: 73, type: 0 },
            { x: 160, y: 120, type: 0 },
            { x: 250, y: 60, type: 0 },
            { x: 250, y: 215, type: 0 },
            { x: 400, y: 65, type: 0 },
            { x: 480, y: 120, type: 0 },
            { x: 550, y: 183, type: 0 },
            { x: 600, y: 73, type: 0 },
            { x: 690, y: 150, type: 0 },
            { x: 407, y: 250, type: 0 },
            { x: 285, y: 526, type: 0 },
            { x: 350, y: 422, type: 0 },
            { x: 678, y: 525, type: 0 },
            { x: 477, y: 407, type: 0 },
            { x: 566, y: 515, type: 0 },
            { x: 82, y: 190, type: 1 },
            { x: 640, y: 357, type: 1 },
            { x: 191, y: 300, type: 1 },
            { x: 281, y: 330, type: 1 },
            { x: 72, y: 496, type: 1 },
            { x: 80, y: 371, type: 1 },
            { x: 688, y: 252, type: 1 },
            { x: 180, y: 410, type: 1 }
         ],
         nbLines: 2
      },
      hard: {
         mushroomPos: [
            { x: 81, y: 73, type: 0 },
            { x: 160, y: 120, type: 0 },
            { x: 250, y: 60, type: 0 },
            { x: 330, y: 160, type: 0 },
            { x: 400, y: 65, type: 0 },
            { x: 480, y: 120, type: 0 },
            { x: 530, y: 203, type: 0 },
            { x: 600, y: 73, type: 0 },
            { x: 690, y: 170, type: 2 },
            { x: 192, y: 218, type: 0 },
            { x: 425, y: 315, type: 2 },
            { x: 640, y: 357, type: 1},
            { x: 101, y: 300, type: 1 },
            { x: 261, y: 330, type: 1 },
            { x: 88, y: 496, type: 1 },
            { x: 187, y: 421, type: 1 },
            { x: 285, y: 526, type: 1 },
            { x: 423, y: 492, type: 2 },
            { x: 349, y: 403, type: 1 },
            { x: 477, y: 407, type: 1 },
            { x: 566, y: 515, type: 1 },
            { x: 688, y: 512, type: 1 },
            { x: 80, y: 410, type: 1 }
         ],
         nbLines: 3
      }
   };

   var paper;
   var paperW = 770;
   var marginX = 20;
   var marginY = 20;
   var handlerW = 52;
   var handlerH = 52;
   var orMushroomW = [58,39,31];
   var orMushroomH = [55,60,66];
   var scale = 0.5   ;
   var mushroomW = [orMushroomW[0]*scale,orMushroomW[1]*scale,orMushroomW[2]*scale];
   var mushroomH = [orMushroomH[0]*scale,orMushroomH[1]*scale,orMushroomH[2]*scale];
   var mushroomAreaR = 10;
   var xField = marginX;
   var yField = marginY;
   var fieldW = paperW - 2*xField;
   var fieldH = 550;
   var paperH = fieldH + marginY + yField;
   var highlightCircleR = 30;
   var xAx1 = handlerW/2 + marginX + xField;
   var xAx2 = fieldW - handlerW/2 - marginX + xField;
   var yAx1 = handlerH/2 + marginY + yField;
   var yAx2 = fieldH - handlerH/2 - marginY + yField;
   var axisX = [xAx1,xAx2];
   var axisY = [yAx1,yAx2];
   var shapeR = 15; // IE8

   var mushroomPos, nbMushrooms;
   var field, overlay;
   var lines = [];
   var nbLines;
   var handlers = [];
   var dragData;
   var mushroomArea = [];
   var highlights = [];
   var clickPosEnabled = false;

   // var handlerSrc = $("#handler").attr("src");
   // var mushroomSrc = [ $("#mushroom_1").attr("src"), $("#mushroom_2").attr("src"), $("#mushroom_3").attr("src") ];
   var mushapes = [ "triangle", "diamond", "star" ]; // IE8
   var shapeColors = [ "red", "grey", "purple" ]; // IE8

   var colors = {
      black: "#4a4a4a",
      grey: "#c6c7c9",
      green: "#b7d995",
      orange: "#f5a623",
      darkOrange: "#b77913",
      pink: "#e24a84",
      purple: "#9d62f1",
      red: "#d5172e",
      cyan: "#4ae2d1"
   };

   var lineAttr = {
      stroke: colors.black,
      "stroke-width": 3,
      "stroke-dasharray": "- ",
      opacity: 0.7
   };
   var areaAttr = {
      stroke : "none",
      fill: "red",
      opacity: 0
   };
   var highlightedAreaAttr = {
      stroke : "red",
      "stroke-width": 4,
      fill: "none",
      r: highlightCircleR,
      opacity: 1
   };
   var fieldAttr = {
      stroke: "none",
      fill: colors.green,
      r: 5
   };
   var overlayAttr = {
      stroke: "none",
      fill: "red",
      opacity: 0
   };
   var handlerAttr = {
      stroke: colors.darkOrange,
      "stroke-width": 2,
      fill: colors.orange,
      r: 20
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      mushroomPos = data[level].mushroomPos;
      nbLines = data[level].nbLines;
      nbMushrooms = mushroomPos.length;

      // rng = new RandomGenerator(subTask.taskParams.randomSeed + level.charCodeAt(0));
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
      initField();
      initLines();
      initHandlers();

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
         handlerPos: []
      };
      for(var iLine = 0; iLine < nbLines; iLine++){
         var x1 = xAx1;
         var x2 = xAx2;
         var y = (handlerH/2 + marginY)*(iLine + 1) + yField;
         defaultAnswer.handlerPos.push([{x:x1,y:y},{x:x2,y:y}]);
      }
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
   };

   function initField() {
      field = paper.rect(xField,yField,fieldW,fieldH).attr(fieldAttr);
      // overlay = paper.rect(xField,yField,fieldW,fieldH).attr(overlayAttr);
      for(var iMush = 0; iMush < nbMushrooms; iMush++){
         var pos = mushroomPos[iMush];
         // var src = mushroomSrc[pos.type];
         if(!Beav.Navigator.isIE8()){
            var src = imgSrc.mushrooms[pos.type];
            var w = mushroomW[pos.type];
            var h = mushroomH[pos.type];
            var x = pos.x - w/2;
            var y = pos.y - h/2;
            paper.image(src,x,y,w,h);
            mushroomArea[iMush] = paper.circle(pos.x,pos.y,mushroomAreaR).attr(areaAttr);
         }else{
            var shape = mushapes[pos.type];
            var color = shapeColors[pos.type];
            mushroomArea[iMush] = getShape(paper,shape,pos.x,pos.y,shapeR).attr({stroke: "none", fill: color });
         }
      }
   };

   function initLines() {
      for(var iLine = 0; iLine < nbLines; iLine++){
         var handlerPos = answer.handlerPos[iLine];
         handlers[iLine] = [];
         var w = handlerW;
         var h = handlerH;
         lines[iLine] = drawLine(handlerPos);
         for(var iHandler = 0; iHandler < 2; iHandler++){
            var pos = handlerPos[iHandler];
            var x = pos.x - w/2;
            var y = pos.y - h/2;
            // handlers[iLine][iHandler] = paper.image(handlerSrc,x,y,w,h);
            if(!Beav.Navigator.isIE8()){
               handlers[iLine][iHandler] = paper.image(imgSrc.handler,x,y,w,h);
            }else{
               handlers[iLine][iHandler] = paper.circle(pos.x,pos.y).attr(handlerAttr);
            }
         }
      }
      // overlay.toFront();
   };

   function initHandlers() {
      if(clickPosEnabled){
         field.click(function(e){
            console.log(e.pageX - $("#paper").offset().left, e.pageY - $("#paper").offset().top);
         });
         field.attr("cursor","pointer");
      }

      for(var iLine = 0; iLine < nbLines; iLine++){
         for(var iHandler = 0; iHandler < 2; iHandler++){
//            Beav.dragWithTouch(handlers[iLine][iHandler],onMove,onStart(iLine,iHandler),onEnd);
            Beav.dragWithTouch(handlers[iLine][iHandler],onMove,onStart,onEnd);
            handlers[iLine][iHandler].attr("cursor","grab");
         }
      }
      // Beav.dragWithTouch(overlay,onMove,onStart,onEnd);
      // overlay.attr("cursor","grab");
   };

/*   function onStart(line, handler) {
      return function(x,y,ev) {
         displayError("");
         dragData = { line: line, handler: handler, startPos: answer.handlerPos[line][handler] };
      }
   };*/

   function onStart(x, y, ev) {
      // The above closure doesn't work on IE8, so we just determine which
      // handler is being dragged from the target/srcElement attribute
      displayError("");
      var target = ev.target || ev.srcElement;
      for(var iLine = 0; iLine < nbLines; iLine++){
         for(var iHandler = 0; iHandler < 2; iHandler++){
            if(handlers[iLine][iHandler].node === target) {
               dragData = { line: iLine, handler: iHandler, startPos: answer.handlerPos[iLine][iHandler] };
               return;
            }
         }
      }
   };

   // function onStart(x,y,ev) {
   //    displayError("");
   //    var xMouse = ev.pageX - $("#paper").offset().left;
   //    var yMouse = ev.pageY - $("#paper").offset().top;

   //    var minD = Infinity;
   //    var line = null;
   //    var handler = null;
   //    for(var iLine = 0; iLine < nbLines; iLine++){
   //       for(var iHandler = 0; iHandler < 2; iHandler++){
   //          var raph = handlers[iLine][iHandler];
   //          var xHandler = raph.attr("x") + handlerW/2;
   //          var yHandler = raph.attr("y") + handlerH/2;
   //          var d = Beav.Geometry.distance(xMouse,yMouse,xHandler,yHandler);
   //          if(d < minD){
   //             minD = d;
   //             if(minD <= Math.max(handlerW,handlerH)){
   //                line = iLine;
   //                handler = iHandler;
   //             }
   //          }
   //       }
   //    }
   //    dragData = { line: line, handler: handler, startPos: answer.handlerPos[line][handler] };
   // };

   function onMove(dx,dy,x,y,ev) {
      if(!dragData){
         return
      }
      var line = dragData.line;
      var handler = dragData.handler;

      var newX = dragData.startPos.x + dx;
      var newY = dragData.startPos.y + dy;
      // var minD = Infinity;
      // var axis = null;
      // for(var iAxis = 0; iAxis < 4; iAxis++){
      //    var d;
      //    if(iAxis < 2){
      //       d = Math.abs(newX - axisX[iAxis]);
      //    }else{
      //       d = Math.abs(newY - axisY[iAxis - 2]);
      //    }
      //    if(d < minD){
      //       minD = d;
      //       axis = iAxis;
      //    }
      // }
      // if(axis < 2){
      //    newX = axisX[axis];
      // }else{
      //    newY = axisY[axis - 2];
      // }
      // if(newX < axisX[0]){
      //    newX = axisX[0];
      // }else if(newX > axisX[1]){
      //    newX = axisX[1];
      // }
      // if(newY < axisY[0]){
      //    newY = axisY[0];
      // }else if(newY > axisY[1]){
      //    newY = axisY[1];
      // }
      if(newX < axisX[0]){
         newX = axisX[0];
      }else if(newX > axisX[1]){
         newX = axisX[1];
      }
      if(newY < axisY[0]){
         newY = axisY[0];
      }else if(newY > axisY[1]){
         newY = axisY[1];
      }
      handlers[line][handler].attr({ x: newX - handlerW/2, y: newY - handlerH/2, cx: newX, cy: newY });
      answer.handlerPos[line][handler] = {x:newX,y:newY};
      updateLine(line);
      // overlay.toFront();
   };

   function onEnd(ev) {
      // console.log("end")
      var line = dragData.line;
      var handler = dragData.handler;
      putHandlerAside(line,handler);
   };

   function putHandlerAside(line,handler) {
      var pos1 = answer.handlerPos[line][handler];
      var pos2 = answer.handlerPos[line][1 - handler];
      var x1 = pos1.x;
      var y1 = pos1.y;
      var x2 = pos2.x;
      var y2 = pos2.y;
      var newX = x1;
      var newY = y1;
      if(x1 == x2){
         newX = x1;
         newY = (y2 == axisY[0]) ? axisY[1] : axisY[0];
      }else if(y1 == y2){
         newY = y1;
         newX = (x2 == axisX[0]) ? axisX[1] : axisX[0];
      }else{
         var a = (y2 - y1)/(x2 - x1);
         var b = y1 - a*x1;
         for(var iAxis = 0; iAxis < 4; iAxis++){
            if(iAxis < 2){
               var currX = axisX[iAxis];
               var currY = a*currX + b;
            }else{
               var currY = axisY[iAxis - 2];
               var currX = (currY - b)/a;
            }
            if(currX >= axisX[0] && currX <= axisX[1] &&
               currY >= axisY[0] && currY <= axisY[1] &&
               currX != x2 && currY != y2){
               newX = currX;
               newY = currY;
            }
         }
      }
      handlers[line][handler].attr({ x: newX - handlerW/2, y: newY - handlerH/2, cx: newX, cy: newY });
      answer.handlerPos[line][handler] = {x:newX,y:newY};
   };

   function updateLine(line) {
      var handlerPos = answer.handlerPos[line];
      if(lines[line]){
         lines[line].attr('path', getLinePath(handlerPos));
      } else {
         lines[line] = drawLine(handlerPos);
      }
      handlers[line][0].toFront();
      handlers[line][1].toFront();
   };

   function getLinePath(handlerPos) {
      var x1 = handlerPos[0].x;
      var y1 = handlerPos[0].y;
      var x2 = handlerPos[1].x;
      var y2 = handlerPos[1].y;
      var path;
      if(x1 == x2){
         path = "M"+x1+" "+yField+",V"+(yField + fieldH);
      }else if(y1 == y2){
         path = "M"+xField+" "+y1+",H"+(xField + fieldW);
      }else{
         var a = (y2 - y1)/(x2 - x1);
         var b = y1 - a*x1;
         var pointPos = [];
         for(var iPoint = 0; iPoint < 2; iPoint++){
            var x = (iPoint == 0) ? xField : xField + fieldW;
            var y = a*x + b;
            if(y < yField){
               y = yField;
               x = (y - b)/a;
            }else if(y > yField + fieldH){
               y = yField + fieldH;
               x = (y - b)/a;
            }
            pointPos.push({x:x,y:y});
         }
         path = "M"+pointPos[0].x+" "+pointPos[0].y+",L"+pointPos[1].x+" "+pointPos[1].y;
      }
      return path;
   };

   function drawLine(handlerPos) {
      return paper.path(getLinePath(handlerPos)).attr(lineAttr);
   };
   // function eq(val1,val2) {
   //    if(val1 == val2){
   //       return true
   //    }
   //    return false
   // };

   function getLineEq(pos) {
      var x1 = pos[0].x;
      var y1 = pos[0].y;
      var x2 = pos[1].x;
      var y2 = pos[1].y;
      var a,b,c;
      if(x1 == x2){
         a = 1;
         b = 0;
         c = -x1
      }else if(y1 == y2){
         a = 0;
         b = 1;
         c = -y1;
      }else{
         a = -(y2 - y1)/(x2 - x1);
         b = 1;
         c = -(y1 + a*x1);
      }
      return { a: a, b: b, c: c }
   };

   function checkResult(noVisual) {
      // compute line equations
      var handlerPos = answer.handlerPos;
      var lineEq = [];
      for(var iLine = 0; iLine < nbLines; iLine++){
         var pos = handlerPos[iLine];
         lineEq[iLine] = getLineEq(pos);
      }
      // initialize zone type description
      var nbZones = (1 << (nbLines+1));
      var noTypeDefined = -1;
      var typeOfZone = Beav.Array.make(nbZones, noTypeDefined);
      var firstMushOfZone = Beav.Array.make(nbZones, null);
      // place mushrooms in zone
      for(var iMush = 0; iMush < nbMushrooms; iMush++){
         var mush = mushroomPos[iMush];
         var type = mush.type;
         var idZones = [ 0 ];
         for(var iLine = 0; iLine < nbLines; iLine++){
            var coef = lineEq[iLine];
            var relativeDist = coef.a * mush.x + coef.b * mush.y + coef.c;
            var idZonesNext = [];
            // mushroom can be considered to be above the line
            if(relativeDist > -mushroomAreaR) {
               for (var iZone = 0; iZone < idZones.length; iZone++) {
                  idZonesNext.push(idZones[iZone]);
               }
            }
            // mushroom can be considered to be below the line
            if(relativeDist < mushroomAreaR) {
               for (var iZone = 0; iZone < idZones.length; iZone++) {
                  idZonesNext.push(idZones[iZone] + (1 << (iLine+1)));
               }
            }
            idZones = idZonesNext;
         }
         for (var iZone = 0; iZone < idZones.length; iZone++) {
            var idZone = idZones[iZone];
            if (typeOfZone[idZone] == noTypeDefined) {
               typeOfZone[idZone] = type;
               firstMushOfZone[idZone] = iMush;
            } else if (typeOfZone[idZone] != type) {
               var error = taskStrings.incorrect;
               if(!noVisual){
                  displayError(error);
                  var mush2 = mushroomPos[firstMushOfZone[idZone]];
                  highlights.push(paper.circle(mush.x,mush.y).attr(highlightedAreaAttr));
                  highlights.push(paper.circle(mush2.x,mush2.y).attr(highlightedAreaAttr));
               }
               return { successRate: 0, message: error }
            }
         }
      }

      if(!noVisual){
         platform.validate("done");
      }
      return { successRate: 1, message: taskStrings.success }
   };

   function displayError(msg) {
      $("#displayHelper_graderMessage").html(msg);
      if(!msg && highlights.length > 0){
         for(var iHighlight = 0; iHighlight < highlights.length; iHighlight++){
            var highlight = highlights[iHighlight];
            highlight.remove();
         }
         highlights = [];
      }
   };

   var imgSrc = {
      handler: "data:image/png;base64,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",
      mushrooms: [
         "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA3CAYAAABdJVn2AAAABGdBTUEAALGPC/xhBQAACiVJREFUaAXVWntsm1cVP/f7/IztPNwkTpOuI1tpu62qSksH1RijCLWsaEA7YGKC7i+kreVZDcGqMiKmbX1qQ9NCJ3UwrZ20URqVTmxooCJtBfoY9LE2TfpynEfj2E78tuPH913O+dzPseNHHNtpwpFuvuv7OPf87jn33HPvDYMZIO52W4CH7k4moYWJrAZANjNgJgGTLHMzMJ4URBaSJB4GEDDxsAgsCILYD00LHIyxRLXFYtVgyD39q2VJ/iJwvhr53c+Bt5fLlzFAkOwT7H+aMzgtitq/sXkLBsvlp/YrGyj33rhTjgnfAyZv5hwWqwyr/UXtyjhxx5Hvm2JzTRdjLWgB06dpA+Uux7ckWd6KM/8Q5zjnt5HQ/MPA4IigFfcw68KL0xm6ZEH5SN8aCfg+NM810xlgJtqiliXk+7oANc8ym22klDGmBMq99k/JMdiF5vOdUhjezjZoVUHgwi7Bxvcx1j5ebOyiQLnb8YgsS2/hGrQUYzLbdajhc4JW/w1mbe0vJItQqEJy2X8py/LRuQ6S5EdfsUKOj5/hI44HCuHJ0Sh20suuvt/j9/FCnZRynRGYAbdEUQSeTOBO6MPtkpbO7BGCiXOBPalpbv/DZCmygCI4ATX5R+Dw6OSGmb9ZbaMCMrOMQMqjuN2hCcwmoRmjBPwJje2ug5lyZJmu7LLvnhKkqSEXJHEUMLZBDc82obLQR8Hr3G1/KFOWNFA+Yl+PEcm2zMqcPKMgri6nOF2AYP0eFyRiRR1guvlMZVClWgw1D3Gfo0EdQwHK+YBRBn6AZkOtyPvVGfIWq4U8EYMRxzWQMMidbUKwC+QY36XKoQDDdfkLLvOdamHBLzogod6Wv1pK4Bodyl83S6UUWKCRLWON7T0CalFEkD8tSRbUGHA5tymWyX53bvkslxA29JEKNgHcDlyb0FKSTATIhxEXai9F6GFjkZQmk/GSWMSjEeg59SHOV54JK4nD9BpxLj/O+SWdBo9XX8VAuXRCrSomSr5N2Umm3k64JEPQ54Haec0garXQumgpMCHtB0sfu6yWzAJj5k+zqP1Sr9ZonLFjVlmyVbmTlIw/JgTC4QVV5lsyO597uOS2lTTsv+FYIfiCoeJ7RiUjTNG3vmn+FC0AKp0MSZJgdMxzlxAIBCCRUJ3LlOPe9galTEYxobw+P/BEQidIiQRzusrfGiqd8WJCVlqH2ws43W6Q4gkuyOORpHt0DCKRaFl8K53xsgYtsdPwiAvi8QTgljYixENou0j9QzdL7P7/0SwWi8OI26MIm/S5e4WIc+g0Ha0i0SjQDMwUBUZdYL/4n5lin8WXTLZvYJAO5JAMhyDo9Z4Von7/B/GAX2lIQF2e1Cxk9azCDwoW2petqgKn4iwI3DV7H4QjEaVh2DkITCv1CDqBH/b39aavBgZvOtEde4tzm8O1Nxz9EAylrn7leAyCQ30nN3XsdwmPPL9/aHzU815sdOLW0DE4lLbvOYwpSzTaL6/3OcAfCKbL/dd7KaZ+jQqUgFMQxGc93Rc4zYBKQ8NOuHrDDsk5cLZUZSr0DYXD0H3lahbIcbcTgsODvVZdyyHqJ9Kfdz464/z2AyvbcK2uqrHNB4Y3CUTkmke9PjDo9UpSCufQH1qP5FfIAvHGMi2ZhMBdn5whLW5++Lm9V6gifYSwWM0/i/nGrnq7z2cdoUijZBJXrtuBZm4uEAH04N5/sacXJgc70ngERs6dBDmZfHXjC797X5U364B27Fdb70skkyf09fPqG5etBEGrU9ulvxazCebbmsFsMqXLbleGAJKjpGiHrG0yxf1ecF34GEO++IfGVt26DT9+Jb0Ws4BSx6PPPPVgEvh7Gr3B3LziftDU5L/Z0+t00FBfBw11dWA0zuy5IBAMgtcXAB/GNuR08lEUtxH35Qt0Rj4rGgxf3tjxMl40T1AOUKrq2v7kMpnzY0zQtDfdsxwMTXgBQQftAkSg6+tqwVRTAzUIWoe/yyXS2vh4TAlgQuFIUXA0Bsel5bdfgcCAHWWELovVsnn9z/fmrLGC0nc9s3WezKU/IasvGeqs0LD4XtBailx1ZiAT8fbeaDBg0oNGowFRFEAj0ldU8gRGwlsH0k4SE30TiaQCbjwWUyKaDHb5s8gj6hqCsas9gLsFXuYKz218obODLrDzdSgIlBr/o6NDMzbu3Ikz9RMUTmOZ3wa17UtANBjz8bptZTG8lvFe6YZ4iPZM5hSYsHXTi51dxQQoClTt+OcdTy1JSnw3gv06mbCp0Qbm1gWgb2hCv5123GrzGfnK8ThEPU4IDfZDLEQhK4ui8vZZ9eKutR2doakGLQmoyuTI9i1rgUt70WpWUhlDs6xtXQg1za2gNaPTwkvUapKMj1cJ3xiEhgcg7L4VueFTPwr9Fui12x/teKXk/22YFlAVBK7fNTJLbsYhH8MHndS1P2raUFcPelzP+to60JhrAT13aeBx5jit12gYEqEAxHxeiCJA+q0SPutfRn9xEAy6g9MBONFfzZXxffr760y6uGbLIlvTw2aD7jOCINTnsMEJwBATE86p8kWto7tAR6eAw4fmrAAls39Ckgb84ei/Lg+MHP7tu38/klk33XxZGs0YhF7C01elX/vs8ravfH7Vg/cuXfJ0POhTNKK8w2SEZxl901mGEyDilqQ1WSAOrPujE//uPH7+8qVzfYNqhE6b57l0hzIylQK14pjtk8c98Zcjf9VqNI1qOW0ndLifuJ3nygU2miMu9FvpVuOe69f3PLFl2ztq34zvWcxPBLQZFaVkK3WZefvXWSynai0TERXubQowAZ1XKmnxN5oweWwCikT7bWuLTT5x6vSJAoLnHatA25ziSt2kFjmSVrOozdYy+M0N6zY1zbMyk9EIJlONcvqhiIkCB/rqcORaDECs1noldr6jdT4kktI/v/uDHx3OYpb6QZqs6FJLk4fpdIrSQXNmpx0791zbsH5t5/J7lv5QCvvB1rYwrbnMdpQPjnlw67gJpjsXRV586dW9k+tv/S7tBatAZyquyBywPz1t5xVi5doNb3x8/sLexraF6F9S5pnvJRxfu0BvsoTePvrutpdeO1BoX0xdapHEZVKlpkvDkvlOLMgMQQ4cevti/83hY/ctWSwZDHoTBv9WjElTqLEdHpYDzjFf129e3v/rHc/vVg7IGd0zszQBueeyzBZT5NODTtGuWDUBXYZpSutYuvRu/RdWf67+jrYW08n/nht9/4PjpWiKtphik1BMtnRdNYASM3pIbktzrV6GTiLdmGiJVETVMF0SgGI1/AdkqPYJfAB5BjBVTNUCSoLQib4WU/mnbuIyQfR4OnEHO1FeVq6aQMnMxjDRmiXtlku0ZzowVfV9pJpACRiBJQdDa4pO59Pdp8kqbmBSY1zMVoeq5YzySUO86TRDkRMF/4UmlfZhmhwPptSDCWaqTTMJNFNWGoccFZk1JTJP+vcyApk3usLyqtL/AOTAFr1CIF44AAAAAElFTkSuQmCC",
         "data:image/png;base64,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",
         "data:image/png;base64,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"
      ]
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
