function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         columns : [
         { id : "A", seq : [2,2,1,1,1,1] },
         { id : "B", seq : [1,2,1,2,2,1] },
         { id : "C", seq : [2,1,1,1,2,2] },
         { id : "D", seq : [1,2,2,1,2,2] }
         ],
         timeAnim: 300
      },
      medium: {
         columns : [
         { id : "A", seq : [3,2,1,3,1,3] },
         { id : "B", seq : [2,2,2,2,1,1] },
         { id : "C", seq : [3,2,2,2,1,1] },
         { id : "D", seq : [3,1,3,2,2,3] },
         { id : "E", seq : [1,1,3,2,3,1] },
         { id : "F", seq : [2,1,3,1,3,3] }
         ],
         timeAnim: 300
      },
      hard: {
         columns : [
         { id : "A", seq : [8,2,1,4,2,1,4,1] },
         { id : "B", seq : [7,1,1,4,2,3,3,2] },
         { id : "C", seq : [6,3,2,4,5,4,6,1] },
         { id : "D", seq : [5,4,7,6,5,4,5,2] },
         { id : "E", seq : [4,5,8,6,7,8,2,3] },
         { id : "F", seq : [3,5,3,6,7,8,6,1] },
         { id : "G", seq : [2,7,4,7,4,5,4,2] },
         { id : "H", seq : [1,6,5,7,4,7,5,3] }
         ],
         timeAnim: 100
      }
   };
   var paper;
   var paperDim = {
      width : 770,
      height : -1 // computed
   };
   var smallMargin = 5;
   var additionalVerticalSpacing = 2;
   var bigMargin = 10;
   var buttonWidth = 70;
   var colWidth = ((paperDim.width-(buttonWidth+2*smallMargin))/2-2*bigMargin)/9-2*smallMargin;
   var colHeight;
   var nCol;
   var nSort = 0;
   var nSortText;
   var rowPos = new Array();
   var bufferColPos = new Array();
   var bufferAnim = new Array();
   var textAttr = { "font-size" : 20 };
   var trickAttr = { "font-size" : 16, "fill": "green" }; //"font-weight": "bold",
   var letterAttr = { "font-size" : 16, "font-weight" : "normal" };
   var colLetterAttr = { "font-size" : 16, "font-weight" : "bold" };
   var rowLetterAttr = { "font-size" : 18, "font-weight" : "bold" };
   var titleFontSize = textAttr["font-size"];
   var titleTopMargin = 10;
   var titleBottomMargin = 20;
   var currentCol = new Array(); // keys : id,seq,raph,colPos
   var cloneCurrCol = new Array();
   var buttons = new Array();
   var ballRadius = {
      small : colWidth/6,
      medium : colWidth/3,
      big : colWidth/2
   };
   var ballAttr = [
      // { "stroke" : "black", "stroke-width" : 1, "fill" : "r(0.3, 0.3)rgb(255,255,0)-rgb(190,190,0)" },
      // { "stroke" : "black", "stroke-width" : 1, "fill" : "r(0.3, 0.3)rgb(255,204,0)-rgb(190,153,0)" },
      // { "stroke" : "black", "stroke-width" : 1, "fill" : "r(0.3, 0.3)rgb(255,153,0)-rgb(190,114,0)" },
      // { "stroke" : "black", "stroke-width" : 1, "fill" : "r(0.3, 0.3)rgb(255,102,0)-rgb(190,76,0)" },
      // { "stroke" : "black", "stroke-width" : 1, "fill" : "r(0.3, 0.3)rgb(255,51,0)-rgb(190,38,0)" },
      // { "stroke" : "black", "stroke-width" : 1, "fill" : "r(0.3, 0.3)rgb(204,0,0)-rgb(153,0,0)" },
      // { "stroke" : "black", "stroke-width" : 1, "fill" : "r(0.3, 0.3)rgb(153,0,0)-rgb(114,0,0)" },
      // { "stroke" : "black", "stroke-width" : 1, "fill" : "r(0.3, 0.3)rgb(102,0,0)-rgb(76,0,0)" }
      { "stroke" : "black", "stroke-width" : 1, "fill" : "rgb(255,255,0)" },
      { "stroke" : "black", "stroke-width" : 1, "fill" : "rgb(255,204,0)" },
      { "stroke" : "black", "stroke-width" : 1, "fill" : "rgb(255,153,0)" },
      { "stroke" : "black", "stroke-width" : 1, "fill" : "rgb(255,102,0)" },
      { "stroke" : "black", "stroke-width" : 1, "fill" : "rgb(255,51,0)" },
      { "stroke" : "black", "stroke-width" : 1, "fill" : "rgb(204,0,0)" },
      { "stroke" : "black", "stroke-width" : 1, "fill" : "rgb(153,0,0)" },
      { "stroke" : "black", "stroke-width" : 1, "fill" : "rgb(102,0,0)" }

   ];
   var errorFrameAttr = {
      "stroke" : "red",
      "stroke-width" : 5,
      "fill" : "none"
   };
   var errorFrame;
   var timeAnim;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      colHeight = letterAttr["font-size"]+3*smallMargin+data[level].columns[0].seq.length*(colWidth+smallMargin+additionalVerticalSpacing)+smallMargin;
      paperDim.height = colHeight+titleFontSize+titleTopMargin+titleBottomMargin+3*bigMargin+2*smallMargin+Math.max(letterAttr["font-size"],2*trickAttr["font-size"]);
      nCol = data[level].columns.length;
      timeAnim = data[level].timeAnim;
      initCurrentCol();
      initRowPos();
      initSubmitButton();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer) {
         getCurrentColFromAnswer();
         nSort = answer.nSort;
      }
   };

   subTask.resetDisplay = function() {
      initPaper();
      hideFeedBack();
      initSubmitButton();
      if (typeof(enableRtl) != "undefined") {
         $("body").attr("dir", "rtl");
         $(".largeScreen #zone_1").css("float", "right");
         $(".largeScreen #zone_2").css("float", "right");
      }
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = { col: new Array(), nSort: 0 };
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      return checkResult(false);
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initCurrentCol() {
      for(var iCol = nCol-1; iCol >=0; iCol--) {
         currentCol[nCol-1-iCol] = data[level].columns[iCol];
      }
   };

   function getCurrentColFromAnswer() {
      for(var iCol = 0; iCol < answer.col.length; iCol++) {
         for(var jCol = 0; jCol < answer.col.length; jCol++)
            if(data[level].columns[jCol].id == answer.col[iCol]){
               currentCol[iCol] = data[level].columns[jCol];
            }
      }
   };

   function initRowPos() {
      for(var iRow = 0; iRow < currentCol[0].seq.length; iRow++) {
         rowPos[iRow] = letterAttr["font-size"]+2*smallMargin+smallMargin+(2*iRow+1)*(smallMargin/2+colWidth/2+additionalVerticalSpacing);
      }
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperDim.width, paperDim.height);
      initObjective();
      initColumns();
      initButtons();
      updateNbSortPerformed();
   };

   function initObjective() {
      var wFrame = (nCol+1)*(colWidth+2*smallMargin)+bigMargin;
      var hFrame = colHeight+titleFontSize+titleTopMargin+titleBottomMargin+2*bigMargin;
      var cx = buttonWidth+2*smallMargin+(paperDim.width-buttonWidth-2*smallMargin)*3/4;
      var xFrame = cx-wFrame/2;
      var yFrame = smallMargin;
      var yTitle = yFrame+titleFontSize/2+titleTopMargin;
      var yCol = yFrame+titleFontSize+titleTopMargin+titleBottomMargin;

      paper.rect(xFrame,yFrame,wFrame,hFrame);
      paper.text(cx,yTitle,taskStrings.objective).attr(textAttr);
      var yTrick = yFrame+hFrame+trickAttr["font-size"]+2*smallMargin+additionalVerticalSpacing;
      paper.text(cx,yTrick,taskStrings.trick).attr(trickAttr);

      drawColumns(xFrame,yCol,data[level].columns);
   };

   function initColumns() {
      var x = 2*smallMargin+buttonWidth;
      var y = titleTopMargin+titleFontSize+titleBottomMargin+smallMargin;
      drawColumns(x,y,currentCol);
      resetBufferColPos();
   }

   function initButtons() {
      var y0 = titleTopMargin+titleFontSize+titleBottomMargin+smallMargin;
      var h = colWidth+additionalVerticalSpacing;
      for(var iRow = 0; iRow < currentCol[0].seq.length; iRow++) {
         buttons[iRow] = new Button(paper,smallMargin,y0+rowPos[iRow]-h/2,buttonWidth,h,taskStrings.sort);
         buttons[iRow].click(sort(iRow));
      }
   };

   function sort(row) {
      return function() {
         hideFeedBack();
         if(errorFrame){
           errorFrame.remove();
         }
         nSort++;
         clone(cloneCurrCol,currentCol);
         for(var iCol = 1; iCol < nCol; iCol++){
            var jCol = iCol;
            var memo = cloneCurrCol[jCol].seq[row];
            var memoCol = cloneCurrCol[jCol];
            while(jCol > 0 && cloneCurrCol[jCol-1].seq[row] > memo){
               cloneCurrCol[jCol] = cloneCurrCol[jCol-1];
               jCol--;
            }
            cloneCurrCol[jCol] = memoCol;
         }
         triggerAnim(row);
         clone(currentCol,cloneCurrCol);
         resetBufferColPos();
         updateAnswer();
         updateNbSortPerformed();
      }
   };

   function updateNbSortPerformed() {
      if(level == "easy") return;
      var x = 4*smallMargin+buttonWidth+bigMargin+colWidth;
      var y = colHeight+titleFontSize+titleTopMargin+titleBottomMargin+3*bigMargin+letterAttr["font-size"];
      var text = taskStrings.nSortText(nSort);
      if(nSortText) {
        nSortText.remove();
      };
      nSortText = paper.text(x,y,text).attr(letterAttr).attr("text-anchor","start");
   };

   function clone(clone,original){
      for(var iCol = 0; iCol < nCol; iCol++) {
         clone[iCol] = original[iCol];
      }
   };

   function triggerAnim(row) {
      for(var iCol = 0; iCol < nCol; iCol++) {
         for(var jCol = 0; jCol < nCol; jCol++) {
            if(currentCol[iCol].id == cloneCurrCol[jCol].id) {
               if(iCol == jCol) {
                  break;
               }else{
                  bufferAnim.push({ newIndex: jCol, newX: bufferColPos[jCol] })
               }
            }
         }
      }
      if(bufferAnim.length > 0){
         buttonsDisable();
         var maxTime = getMaxTime(row);
         for(var iAnim = 0; iAnim < bufferAnim.length; iAnim++){
            moveCol(bufferAnim[iAnim].newIndex,bufferAnim[iAnim].newX,maxTime,row);
         }
      }
      bufferAnim = new Array();
   };

   function getMaxTime(row) {
      var maxTime = 0;
      for(var iAnim = 0; iAnim < bufferAnim.length; iAnim++) {
         var time = timeAnim*cloneCurrCol[bufferAnim[iAnim].newIndex].seq[row];
         maxTime = (time >= maxTime ? time : maxTime);
      }
      return maxTime;
   };

   function moveCol(newIndex,newX,maxTime,row) {
      var time = timeAnim*cloneCurrCol[newIndex].seq[row];
      for(var iSetEl = 0; iSetEl < cloneCurrCol[newIndex].raph.length; iSetEl++){
         switch(iSetEl){
            case 1:
               var newPos = { x: newX-colWidth/2 };
               break;
            case 2:
               var newPos = { x: newX-3/2 };
               break;
            case 3:
               var newPos = { x: newX-colWidth/3 };
               break;
            default:
               var newPos = { x: newX, cx: newX };
         }
         if(time >= maxTime){
            var anim = new Raphael.animation(newPos,time,buttonsEnable);
         }else{
            var anim = new Raphael.animation(newPos,time);
         }

         subTask.raphaelFactory.animate("anim",cloneCurrCol[newIndex].raph[iSetEl],anim);
      }
      cloneCurrCol[newIndex].colPos = newX;
   };

   function buttonsDisable() {
      for(var iButton = 0; iButton < buttons.length; iButton++) {
         buttons[iButton].disable();
      }
   };

   function buttonsEnable() {
      for(var iButton = 0; iButton < buttons.length; iButton++) {
         buttons[iButton].enable();
      }
   };

   function resetBufferColPos() {
      for(var iCol = 0; iCol < nCol; iCol++){
         bufferColPos[iCol] = currentCol[iCol].colPos;
      }
   };

   function drawColumns(x,y,array) {
      for(var iRow = 0; iRow < array[0].seq.length; iRow++) {
          var rowLetter = paper.text(x+(smallMargin+colWidth/2),y+rowPos[iRow],intToLowercase(iRow));
          rowLetter.attr(rowLetterAttr);
      }
      for(var iCol = 0; iCol < array.length; iCol++) {
         currentCol[iCol].colPos = x+(smallMargin+colWidth/2)*(2*iCol+3);
         currentCol[iCol].raph = drawCol(currentCol[iCol].colPos,y,array[iCol]);
      }
   };

   function drawCol(x,y,col) {
      var shaftAttr = {
         "fill" : "rgb(150,150,150)",
         "stroke" : "none"
      };
      var letterFrameAttr = {
         "stroke" : "black",
         "stroke-width" : 2,
         "fill" : "white"
      };
      var letterSize = letterAttr["font-size"];
      var letterFrameSize = letterSize+2*smallMargin;
      var shaftHeight = colHeight - letterFrameSize + col.seq.length*additionalVerticalSpacing;
      var shaftWidth = 3;
      var letter = paper.text(x,y+letterFrameSize/2,col.id).attr(colLetterAttr);
      var letterFrame = paper.rect(x-letterFrameSize/2, y,letterFrameSize,letterFrameSize,2).attr(letterFrameAttr).toBack();
      var shaft = paper.rect(x-shaftWidth/2,y+letterFrameSize,shaftWidth,shaftHeight);
      var shaftBottom = paper.rect(x-letterFrameSize/3,y+letterFrameSize+shaftHeight,letterFrameSize*2/3,2,1).attr("fill","black");
      shaft.attr(shaftAttr).toBack();
      var colSet = paper.set(letter,letterFrame,shaft,shaftBottom);

      for(var iBall = 0; iBall < col.seq.length; iBall++) {
         if(level != "hard") {
            switch(col.seq[iBall]){
               case 1:
                  var r = ballRadius.small;
                  var attr = ballAttr[0];
                  break;
               case 2:
                  var r = ballRadius.medium;
                  var attr = ballAttr[4];
                  break;
               case 3:
                  var r = ballRadius.big;
                  var attr = ballAttr[7];
                  break;
            }
         }else{
            var r = ballRadius.big;
            var attr = ballAttr[col.seq[iBall]-1];
         }
         var yBall = y+rowPos[iBall];
         var ball = paper.circle(x,yBall,r).attr(attr);
         colSet.push(ball);
         if(level == "hard") {
            var numberAttr = {
               "font-size" : letterAttr["font-size"],
               "font-weight" : "bold",
               "fill" : (col.seq[iBall] < 5 ? "black" : "white")
            };
            var number = paper.text(x,yBall,col.seq[iBall]).attr(numberAttr);
            colSet.push(number);
         }
      }
      return colSet;
   };

   function intToLowercase(intValue) {
      return String.fromCharCode(97 + intValue);
   };

   function updateAnswer() {
      for(var iCol = 0; iCol < currentCol.length; iCol++) {
         answer.col[iCol] = currentCol[iCol].id;
      }
      answer.nSort = nSort;
   };

   function initSubmitButton() {
      displayHelper.customValidate = function() {
         var res = checkResult(true);
         if(res.successRate > 0) {
            platform.validate("done");
         }else{
            showFeedback(res.message);
         }
      };
   };

   function checkResult(showErr) {
      if(answer.nSort == 0) {
         if(showErr) {
           showError(0);
         }
         return {
           successRate: 0,
           message: taskStrings.wrongAnswer };
      }
      for(var iCol = 0; iCol < answer.col.length; iCol++) {
         if(answer.col[iCol] != data[level].columns[iCol].id) {
            if(showErr) {
              showError(iCol);
            }
            return {
              successRate: 0,
              message: taskStrings.wrongAnswer };
         }
      }
      if(level != "easy" && answer.nSort > 3){
          return {
            successRate: 0.5,
            message: taskStrings.tooManySort };
      }
      return {
        successRate: 1,
        message: taskStrings.success
      };
   };

   function showError(iCol) {
      var x = currentCol[iCol].colPos - colWidth/2;
      var y = titleTopMargin+titleFontSize+titleBottomMargin+smallMargin;
      errorFrame = paper.rect(x,y,colWidth,colHeight+errorFrameAttr["stroke-width"]/2,1).attr(errorFrameAttr).toBack();
   };

   function showFeedback(string) {
      $("#displayHelper_graderMessage").html(string);
      $("#displayHelper_graderMessage").css("color", "red");
   };

   function hideFeedBack() {
      $("#displayHelper_graderMessage").html("");
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
