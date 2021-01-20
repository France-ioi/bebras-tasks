function initTask(subTask) {
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

   var paper, exPaper;
   var paperW = 770;
   var paperH = 300;
   var exPaperW = 100;
   var exPaperH = 100;

   var marginX = 20;
   var marginY = 20;
   var rectW = paperW - 2*marginX;
   var rectH = paperH - 2*marginY;
   var exRectW = exPaperW - 2;
   var exRectH = exPaperH - 2;

   var colors = {
      green: "#88BB88",
      lightGreen: "#a7e2a7",
      darkGreen: "#5a885a",
      black: "#30242B",
      grey: "#eaeaea",
      lightGrey: "#F9F9F9",
      darkGrey: "#bebebe",
      altGrey: "#cad9ca",
      altGrey2: "#bccabc",
      veryLightGreen: "#d3e5d3"
   };

   var backgroundAttr = {
      stroke: "none",
      fill: colors.grey,
      r: 5
   };
   var rectAttr = {
      stroke: colors.green,
      "stroke-width": 3,
      fill: "none",
      r: 5
   };
   var titleAttr = {
      "font-size": 20,
      "font-weight": "bold",
      fill: colors.green
   };
   var exampleAttr = {
      "font-size": 16,
      "font-weight": "bold",
      fill: colors.green
   };

   subTask.loadLevel = function(curLevel) {
      displayHelper.avatarType = "laptop";
      displayHelper.responsive = true;
      level = curLevel;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(!answer) {
         return;
      }
   };

   subTask.resetDisplay = function() {
      displayError("message d'erreur");
      initExample();
      initPaper();
      // initCodedFrame();
      // initResultFrame();
      // initHandlers();
      // updateColumns();
      // updateResult();
      // displayHelper.customValidate = checkResult;
      displayError("message d'erreur");
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = { 
         // selectedCol: Beav.Array.make(nbCol,0)
      };
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      // subTask.delayFactory.destroy("delay");
      callback();
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function getResultAndMessage() {
      var res = checkResult(true);
      return res
   };

   function initExample() {
      $("#example").append('<div id="exPaper"></div>');
      exPaper = subTask.raphaelFactory.create("exPaper","exPaper",exPaperW,exPaperH);
      $("#exPaper").css({
         width: exPaperW+"px",
         margin: "auto"
      });
      exPaper.rect(1,1,exRectW,exRectH).attr(rectAttr);
      exPaper.text(exPaperW/2,exPaperH/2,"EXEMPLE").attr(exampleAttr);
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);
      paper.rect(0,0,paperW,paperH).attr(backgroundAttr);
      paper.rect(marginX,marginY,rectW,rectH).attr(rectAttr);
      $("#paper").css({
         width: paperW+"px",
         margin: marginY+"px auto"
      });
      paper.text(paperW/2,paperH/2,level.toUpperCase()).attr(titleAttr);

   };

   // function initCodedFrame() {
   //    var x0 = xCodedFrame;
   //    var y0 = yCodedFrame;
   //    var w = codedFrameW;
   //    var h = codedFrameH;
   //    paper.rect(x0,y0,w,h).attr(frameAttr);

   //    var xTitle = paperW/2;
   //    var yTitle = y0 + headerH/2;
   //    paper.text(xTitle,yTitle,taskStrings.coded.toUpperCase()).attr(titleAttr);

   //    var yLine = y0 + headerH;
   //    paper.path("M"+x0+" "+yLine+",H"+(x0 + w)).attr(headerLineAttr);

   //    var yCol = yLine + lockRowH;
   //    for(var iCol = 0; iCol < nbCol; iCol++){
   //       var x = x0 + iCol*colW;

   //       var eyeState = answer.selectedCol[iCol];
   //       var xEye = x + (colW - eyeW[eyeState])/2;
   //       var yEye = yLine + (eyeRowH - eyeH[eyeState])/2;
   //       var eye = paper.image(eyeSrc[eyeState],xEye,yEye,eyeW[eyeState],eyeH[eyeState]);
   //       eyes[iCol] = eye;
         
   //       var rect = paper.rect(x + colPad,yCol,colW - 2*colPad,colH).attr(colAttr);
   //       var border = paper.path("M"+(x + colPad)+" "+(yCol + colH)+",H"+(x + colW - colPad)+",V"+yCol).attr(shadowBorderAttr);
   //       var colLetters = paper.set();
   //       for(var iRow = 0; iRow < nbRows; iRow++){
   //          if(!coded[iRow]){
   //             continue; // IE8 bug fix
   //          }
   //          var letter = coded[iRow][iCol];
   //          var xLetter = x + colW/2;
   //          var yLetter = yCol + letterSpacing*(iRow + 0.5);
   //          colLetters.push(paper.text(xLetter,yLetter,letter).attr(colLetterAttr));
   //       }
   //       var overlay = paper.rect(x,yLine,colW,colH).attr(overlayAttr);
   //       columns[iCol] = paper.set(rect,border,colLetters,overlay);
   //    }
   // };

   // function initResultFrame() {
   //    var x0 = xResultFrame;
   //    var y0 = yResultFrame;
   //    var w = resultFrameW;
   //    var h = resultFrameH;
   //    paper.rect(x0,y0,w,h).attr(frameAttrResult);

   //    var xTitle = paperW/2;
   //    var yTitle = y0 + headerH/2;
   //    paper.text(xTitle,yTitle,taskStrings.result.toUpperCase()).attr(titleAttr);

   //    var yLine = y0 + headerH;
   //    paper.path("M"+x0+" "+yLine+",H"+(x0 + w)).attr(headerLineAttr);

   //    $("#zone_2").css("position","relative");
   //    $("#result").empty();
   //    var html = "";
   //    for(var iRow = 0; iRow < nbRows; iRow++){
   //       for(var iCol = 0; iCol < nbCol; iCol++){
   //          if(!coded[iRow]){
   //             continue; // IE8 bug fix
   //          }
   //          var letter = coded[iRow][iCol];
   //          html += '<div class="letter" col="'+iCol+'">'+letter+'</div>';
   //       }
   //    }
   //    $("#result").html(html);
   //    $("#result").css({
   //       position: "absolute",
   //       top: (yLine + marginY)+"px",
   //       left: (x0 + marginX)+"px",
   //       width: resultLineW+"px"
   //    });
   //    $(".letter").css({
   //       display: "inline-block",
   //       width: resultLetterSpacing+"px",
   //       height: resultLineH+"px",
   //       'text-align': "center",
   //       color: colors.black
   //    });
   // };

   // function initHandlers() {
   //    for(var iCol = 0; iCol < nbCol; iCol++) {
   //       columns[iCol].click(clickCol(iCol));
   //       columns[iCol].attr("cursor","pointer");
   //    }
   // };

   // function clickCol(col) {
   //    return function() {
   //       displayError("");
   //       answer.selectedCol[col] = 1 - answer.selectedCol[col];
   //       updateCol(col);
   //       changeAnim(col);
   //    }
   // };

   // function updateCol(col) {
   //    var state = answer.selectedCol[col];
   //    var attr = (state) ? selectedColAttr : colAttr;
   //    var letterAttr = (state) ? selectedColLetterAttr : colLetterAttr;
   //    var borderAttr = (state) ? selectedShadowBorderAttr : shadowBorderAttr;
   //    columns[col][0].attr(attr);
   //    columns[col][1].attr(borderAttr);
   //    columns[col][2].attr(letterAttr);
   //    eyes[col].attr({
   //       src: eyeSrc[state],
   //       width: eyeW[state],
   //       height: eyeH[state],
   //       x: columns[col][0].attr("x") + (colW - eyeW[state])/2,
   //       y: columns[col][0].attr("y") - (eyeRowH + eyeH[state])/2
   //    });
   // };

   // function updateColumns() {
   //    for(var iCol = 0; iCol < nbCol; iCol++){
   //       updateCol(iCol);
   //    }
   // };

   // function updateResult() {
   //    for(var iCol = 0; iCol < nbCol; iCol++){
   //       var sel = answer.selectedCol[iCol];
   //       if(sel){
   //          $("[col="+iCol+"]").hide();
   //       }else{
   //          $("[col="+iCol+"]").show();
   //       }
   //    }
   // };

   // function changeAnim(col) {
   //    var sel = answer.selectedCol[col];
   //    if(sel == 0){
   //       updateResult();
   //    }
   //    highlightResult(col);

   //    var delayIdentifier = "delay-" + col;
   //    if (subTask.delayFactory.get(delayIdentifier)) {
   //        subTask.delayFactory.destroy(delayIdentifier);
   //    }

   //    subTask.delayFactory.create(delayIdentifier,function() {
   //       unhighlightResult();
   //       subTask.delayFactory.destroy(delayIdentifier);
   //       if(sel == 1){
   //          updateResult();
   //       }
   //    },animTime);
   // };

   // function highlightResult(col) {
   //    $("[col="+col+"]").css(highlightedCss);
   // };

   // function unhighlightResult(col) {
   //    $(".letter").css(unhighlightedCss);
   // };

   function checkResult(noVisual) {
      // for(var iCol = 0; iCol < nbCol; iCol++){
      //    var sel = answer.selectedCol[iCol];
      //    if(sel == 0 && Beav.Array.has(extraCol,iCol) || sel == 1 && !Beav.Array.has(extraCol,iCol)){
      //       var error = taskStrings.error;
      //       if(!noVisual){
      //          displayError(error);
      //       }
      //       return { successRate: 0, message: error }
      //    }
      // }
      // if(!noVisual){
      //    platform.validate("done");
      // }
      return { successRate: 1, message: taskStrings.success }
   };

   function displayError(msg) {
      console.log(msg)
      $("#error").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
