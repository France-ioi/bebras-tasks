function initTask(subTask) {
   var state = {};
   var level;
   var data = {
      easy: {
         source : [
            ["A","B"],
            ["A","B","C"]
         ],
         repeats : [5,3],
         obj : ["A","B","C","A","B"],
         repeat : 3,
         radius: 13
      },
      medium: {
        source : [
            ["A","B","C","D"],
            ["A","B","C"],
            ["C","D","E"]
         ],
         repeats : [3,4,4],
         obj : ["A","B","C","D","C","E"],
         repeat : 3,
         radius: 13
      },
      hard: {
         source : [
           ["A","A","B","C"],
           ["A","B","C"],
           ["A","A","B","C"],
           ["A","A","A","A","B","C"],
           ["A","A","A","C"]
         ],
         repeats : [4,6,4,3,4],
         obj : ["A","A","A","A","A","A","A","B","B","C","C","C"],
         repeat : 2,
         radius: 11
      }
      /* FUTURE TASK
      very_hard: {
         source : [
           ["A","B","D"],
           ["A","B","C","D"],
           ["C","B","A","D"],
           ["A","C","B","A","D"],
           ["A","B","C","A","B","D"]
         ],
         repeats : [6,4,4,3,3],
         obj : ["A","B","C","A","B","B","C","A","A","B","D","D","D"],
         repeat : 2,
         radius: 11
      } */
   };
   var source; // generated from data[level].source repeated data[level].sourceRepeat
   var sourcePeriodicity; // array storing lengthes of the data[level].source arrays
   var nSource;
   var currentSource = new Array();
   var objArray = new Array();
   var objPeriodicity;
   var bottomMarbles = [];
   var paper;
   var paperWidth = 770;
   var paperTopPadding = 20;
   var paperHeight;
   var objPaperHeight = 150;
   var speed = 0.5; // multiplicative factor, 1.0 is default, smaller is faster
   var speedUndo = 0.5; // multiplicative factor, 1.0 is default, smaller is faster
   var raphButtonAttr = {
      "width" : 100,
      "height" : 30,
      "hMargin" : 10,
      "vMargin" : 10
   };
   var marbleAttr = {
      "r": -1, // defined per level
      "stroke" : "black",
      "stroke-width" : 1,
      "text" : { "fill" : "black", "font-size" : 15, "font-weight" : "normal"},
      "A": { "fill" : "#fff200" }, // TODO_ARTHUR: could become an array of colors, see remark at top of file
      "B": { "fill" : "#00a2e8" },
      "C" : { "fill" : "#ff7f27" },
      "D" : { "fill" : "#ffaec9" },
      "E" : { "fill" : "#b5e61d" }
   };
   var rampAttr = {
      "stroke" : "black",
      "stroke-width" : 5,
      "slope" : 0.075
   };
   var wrongAttr = {
      "stroke":"red",
      "stroke-width":4
   };
   var rampLinEq;   // [array] parameters of the linear equation describing each ramp
   var bottomRampLinEq;
   var objRampLinEq;
   var rampStartX;
   var bottomRampStartX;
   var marblesRaph; // [array] of nSource+1 arrays of raphael objects representing the marbles
   var buttons;
   var undoButton;
   var bufferAnim = [];
   var animationRunning = false;
   var corrCst = (rampAttr["stroke-width"]+marbleAttr["stroke-width"])/2; // correction constant for the marble position
   var indexDelay = 0;
   var answer = null;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      marbleAttr.r = data[level].radius;
      initObjArray();
      initSourceArray();
      initCurrentSource();
      initMarblesRaph();
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
        updateMarblesFromAnswer();
      }
   };

   subTask.resetDisplay = function() {
      paperHeight = nSource*(raphButtonAttr.height+2*raphButtonAttr.vMargin)+paperTopPadding+80;
      rampStartX = raphButtonAttr.width+2*raphButtonAttr.hMargin+4*marbleAttr.r;
      bottomRampStartX = raphButtonAttr.width+2*raphButtonAttr.hMargin + 10;
      initRampLinEq();
      initObjective();
      initPaper();
      hideFeedBack();
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
      var defaultAnswer = [];
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

    function initCurrentSource() {
        currentSource = cloneSource(currentSource);
    };

    function cloneSource(){
        var array = [];
        for(var iRamp = 0; iRamp < nSource; iRamp++) {
            array[iRamp] = [];
            for(var iMarble = 0; iMarble < source[iRamp].length; iMarble++){
                array[iRamp][iMarble] = source[iRamp][iMarble];
            }
        }
        return array;
    };

   function initSourceArray() {
      nSource = data[level].source.length;
      sourcePeriodicity = [];
      source = [];
      for(var iRamp = 0; iRamp < nSource; iRamp++) {
         var src = data[level].source[iRamp];
         source[iRamp] = [];
         sourcePeriodicity[iRamp] = src.length;
         for(var iPattern = 0; iPattern < data[level].repeats[iRamp]; iPattern++) {
            for(var iBall = 0; iBall < sourcePeriodicity[iRamp]; iBall++) {
               source[iRamp].push(src[iBall]);
           }
        }
      }
   };

   function initObjArray() {
      objPeriodicity = data[level].obj.length;
      for(var iPattern = 0; iPattern < data[level].repeat; iPattern++) {
         for(var iBall = 0; iBall < objPeriodicity; iBall++) {
            objArray[iBall+objPeriodicity*iPattern] = data[level].obj[iBall];
         }
      }
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initMarblesRaph() {
    marblesRaph = new Array(nSource+1);
    for(var iRamp = 0; iRamp <= nSource; iRamp++) {
        marblesRaph[iRamp] = new Array();
    }
   };

   function initRampLinEq() {
      rampLinEq = new Array(nSource);
      for(iRamp = 0; iRamp < nSource; iRamp++) {
          var bottomPos = { x: rampStartX, y: (iRamp+1)*(raphButtonAttr.vMargin+raphButtonAttr.height)+paperTopPadding };
          rampLinEq[iRamp] = {
              a: -rampAttr.slope,
              b: bottomPos.y+rampAttr.slope*bottomPos.x
          };
      }
      var wallPos = { x: paperWidth-10, y: paperHeight-10 };
      var rampStartx = raphButtonAttr.width+2*raphButtonAttr.hMargin + 10;
      bottomRampLinEq = {
          a: rampAttr.slope,
          b: wallPos.y-rampAttr.slope*wallPos.x
      };
      var objWallPos = { x: paperWidth-10, y: objPaperHeight-10 };
      objRampLinEq = {
          a: rampAttr.slope,
          b: objWallPos.y-rampAttr.slope*objWallPos.x
      };
   };

   function initObjective() {
      var x = raphButtonAttr.width+2*raphButtonAttr.hMargin;
      var y = 1;
      var w = paperWidth - x;
      var h = objPaperHeight;
      var wallPos = { x: paperWidth-10, y: h-10 };
      var rampStartx = x + 10;
      var objPaper = subTask.raphaelFactory.create("objPaper","objective",paperWidth,h+y);
      objPaper.rect(x,y,w-2,h-2);
      objPaper.text(x+w/2,25,taskStrings.objective).attr("font-size",25);
      drawBottomRamp(objPaper,wallPos,"obj");
      fillRamp(objPaper,wallPos,"obj",objPeriodicity);
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperWidth,paperHeight);
      initRaphaelButtons();
      initSourceRamps();
      initBottomRamp();
   };

   function initRaphaelButtons() {
    buttons = new Array(nSource);
      for(var iButton = 0; iButton < nSource; iButton ++) {
        var x = raphButtonAttr.hMargin;
        var y = iButton*(raphButtonAttr.vMargin+raphButtonAttr.height)+raphButtonAttr.vMargin+paperTopPadding;
         buttons[iButton] = new Button(paper,x,y,raphButtonAttr.width,raphButtonAttr.height,iButton+1,false);

         buttons[iButton].click(pushAnim(iButton));
      }
      undoButton = new Button(paper,x,y+(raphButtonAttr.vMargin+raphButtonAttr.height)+20,raphButtonAttr.width,raphButtonAttr.height,taskStrings.undo,false);
      undoButton.click(reverseAnim);
   };

   function initSourceRamps() {
    for(var iRamp = 0; iRamp < nSource; iRamp++) {
        var a = rampLinEq[iRamp].a;
        var b = rampLinEq[iRamp].b;
        var wallPos = { x: rampStartX, y: a*rampStartX+b };
        var rampTopX = (source[iRamp].length+1)*(2*marbleAttr.r+10/sourcePeriodicity[iRamp])+wallPos.x;
        var rampTopY = a*rampTopX+b;
        paper.path("M"+wallPos.x+" "+wallPos.y+"L"+rampTopX+" "+rampTopY).attr(rampAttr);
        fillRamp(paper,wallPos,iRamp,sourcePeriodicity[iRamp]);
    }
   }

   function initBottomRamp() {
      var wallPos = { x: paperWidth-10, y: paperHeight-10 };
      drawBottomRamp(paper,wallPos,"bottom");
      fillRamp(paper,wallPos,"bottom",objPeriodicity);
   };

   function drawBottomRamp(paper,wallPos,id) {
    var b = ( id == "obj" ? objRampLinEq.b : bottomRampLinEq.b);
    var a = bottomRampLinEq.a;
    var bottomRampStartY = bottomRampStartX*a+b;
    var wallHeight = 2*marbleAttr.r;
    paper.path("M"+wallPos.x+" "+(wallPos.y-wallHeight)+
                  "V"+wallPos.y+
                  "L"+bottomRampStartX+" "+bottomRampStartY).attr(rampAttr);
   };

   function fillRamp(paper,bottomPos,sourceId,gapPeriodicity) {
      var src, a, b, corFactor;
      if($.type(sourceId) != "string" ) {
        src = currentSource[sourceId];
        a = rampLinEq[sourceId].a;
        b = rampLinEq[sourceId].b;
        corFactor = 1;
      }else if(sourceId == "obj") {
        src = objArray;
        a = objRampLinEq.a;
        b = objRampLinEq.b;
        corFactor = -1;
      }else if(sourceId == "bottom") {
        src = bottomMarbles;
        a = bottomRampLinEq.a;
        b = bottomRampLinEq.b;
        corFactor = -1;
      }
      var gap = 0;
      var linearEqConst = b;
      for(var iMarble = 0; iMarble < src.length; iMarble++) {
         if($.type(sourceId) != "string"){
            var shift = source[sourceId].length - src.length;
            gapIndex = (shift%gapPeriodicity == 0) ? 0 : (gapPeriodicity-shift)%gapPeriodicity;
         }else{
            gapIndex = 0;
         }
         gap += ((iMarble > 0 && iMarble%gapPeriodicity == gapIndex) ? 10 : 0);
         var marbleX = bottomPos.x+corFactor*(marbleAttr.r*(2*iMarble+1)+corrCst+gap);
         var marbleY = a*marbleX+b-marbleAttr.r-corrCst;

         if($.type(sourceId) != "string") {
            marblesRaph[sourceId].push(drawMarble(paper,src[iMarble],marbleX,marbleY));
         }else if(sourceId == "obj") {
            drawMarble(paper,src[iMarble],marbleX,marbleY);
         }else if(sourceId == "bottom") {
            marblesRaph[nSource].push(drawMarble(paper,src[iMarble],marbleX,marbleY));
         }
      }
   };

   function drawMarble(paper,letter,cx,cy) {
      var circle = paper.circle(cx,cy).attr(marbleAttr).attr(marbleAttr[letter]);
      var text = paper.text(cx,cy,letter).attr(marbleAttr.text);
      var marble = paper.set(circle,text);
      return marble;
   };

   function pushAnim(iButton) {
      return function(){
         bufferAnim.push(iButton);
         if(!animationRunning){
            animationRunning = true;
            marbleAnim(bufferAnim[0]);
         }
      }
   };

   function playNextAnim() {
      if(bufferAnim.length > 0) {
         marbleAnim(bufferAnim[0]);
      }else{
         indexDelay++;
         subTask.delayFactory.create("delay"+indexDelay,function(){undoButton.enable()},speed*2000);
         animationRunning = false;
      }
   };

   function marbleAnim(buttonId) {
      if(currentSource[buttonId].length == 0 || bottomMarbles.length == objArray.length){
         // the source ramp is empty or the bottom ramp is full
         bufferAnim.shift();
         playNextAnim();
         return;
      }
      bufferAnim.shift();
      undoButton.disable();
      answer.push(buttonId);
      var timeStep0 = speed*200;
      var timeStep1 = speed*50;
      var timeStep2 = speed*100;
      var timeStep3 = speed*1500-marblesRaph[nSource].length*(speed*50);
      rollMarbles(buttonId,timeStep0,"down");
      var marble = marblesRaph[buttonId][0];
      var wallPos = { x: paperWidth-10, y: paperHeight-10 };
      var gap = Math.floor(marblesRaph[nSource].length/objPeriodicity)*10;
      var x1 = rampStartX-marbleAttr.r;
      var y1 = x1*rampLinEq[buttonId].a+rampLinEq[buttonId].b-marbleAttr.r;
      var x2 = x1;
      var y2 = x2*bottomRampLinEq.a+bottomRampLinEq.b-marbleAttr.r-corrCst;
      var x3 = wallPos.x-(marbleAttr.r*(2*marblesRaph[nSource].length+1)+corrCst)-gap;
      var y3 = x3*bottomRampLinEq.a + bottomRampLinEq.b-marbleAttr.r - corrCst;
      var newPos_1 = { "cx" : x1, "cy" : y1,  x: x1, y: y1 };
      var newPos_2 = { "cx" : x2, "cy" : y2, x: x2 ,y: y2 };
      var newPos_3 = { "cx" : x3, "cy" : y3, x:  x3, y: y3 };
      /*/
      var step_1 = new Raphael.animation(newPos_1,timeStep1,"<").delay(timeStep0);
      var step_2 = new Raphael.animation(newPos_2,timeStep2,"<").delay(timeStep0+timeStep1);
      var step_3 = new Raphael.animation(newPos_3,timeStep3,"<").delay(timeStep0+timeStep1+timeStep2);
      subTask.raphaelFactory.animate("step1",marble,step_1);
      setNewCoord(marble,newPos_1);
      subTask.raphaelFactory.animate("step2",marble,step_2);
      setNewCoord(marble,newPos_2);
      subTask.raphaelFactory.animate("step3",marble,step_3);
      setNewCoord(marble,newPos_3);
      /*/
      var step_1 = new Raphael.animation(newPos_1,timeStep1,"<",function(){
         setNewCoord(marble,newPos_1);
         subTask.raphaelFactory.animate("step2",marble,step_2);
      });
      var step_2 = new Raphael.animation(newPos_2,timeStep2,"<",function(){
         setNewCoord(marble,newPos_2);
         subTask.raphaelFactory.animate("step3",marble,step_3);
      });
      var step_3 = new Raphael.animation(newPos_3,timeStep3,"<",function(){
         setNewCoord(marble,newPos_3);
      });
      subTask.raphaelFactory.animate("step1",marble,step_1);
      //*/
      subTask.delayFactory.create("delay",playNextAnim,500);
      bottomMarbles.push(currentSource[buttonId].shift());
      marblesRaph[nSource].push(marblesRaph[buttonId].shift());
      if (compareWithObj()) {
          if (bottomMarbles.length == objArray.length) {
             platform.validate("done");
          }
      }
    };

    function rollMarbles(id,time,direction) {
        var dir = (direction == "up" ? 1 : -1);
        for(var iMarble = 0; iMarble < currentSource[id].length; iMarble++) {
            var gap = 0;
            if(currentSource[id].length < source[id].length && currentSource[id].length%sourcePeriodicity[id] == 1-(dir+1)/2){
               var gap = 10;
            }
            var marble = marblesRaph[id][iMarble];
            var angle = Math.atan(rampLinEq[id].a);
            var deltaX = (2*marbleAttr.r+gap)*Math.cos(angle);
            var deltaY = (2*marbleAttr.r+gap)*Math.sin(angle);
            var newPos = { "cx" : marble[0].attr("cx")+dir*deltaX,
                                "cy" : marble[0].attr("cy")+dir*deltaY,
                            x: marble[1].attr("x")+dir*deltaX,
                            y: marble[1].attr("y")+dir*deltaY
                            };
            var anim = new Raphael.animation(newPos,time,"<");
            subTask.raphaelFactory.animate("rollMarbles",marble,anim);
            setNewCoord(marble,newPos);
        }
    };

    function setNewCoord(marble,pos) {
        marble[0].attr(pos);
        marble[1].attr(pos);
    };

    function reverseAnim() {
        if(answer.length == 0) {
            return;
        }
        undoButton.disable();
        var lastClick = answer.pop();
        var timeStep4 = speedUndo*50;
        var timeStep3 = speedUndo*5;
        var timeStep2 = speedUndo*50;
        var timeStep1 = speedUndo*150-marblesRaph[nSource].length*(speedUndo*5);
        var marble = marblesRaph[nSource][marblesRaph[nSource].length-1];
        marble[0].attr(marbleAttr);
        var wallPos = { x: paperWidth-10, y: paperHeight-10 };
        var x1 = rampStartX-marbleAttr.r;
        var y1 = x1*bottomRampLinEq.a+bottomRampLinEq.b-marbleAttr.r-corrCst;
        var x2 = x1;
        var y2 = x2*rampLinEq[lastClick].a+rampLinEq[lastClick].b-marbleAttr.r;
        var x3 = rampStartX+marbleAttr.r+corrCst;
        var y3 = x3*rampLinEq[lastClick].a+rampLinEq[lastClick].b-marbleAttr.r-corrCst;
        var newPos_1 = { "cx" : x1, "cy" : y1, x: x1, y: y1 };
        var newPos_2 = { "cx" : x2, "cy" : y2, x: x2, y: y2 };
        var newPos_3 = { "cx" : x3, "cy" : y3, x: x3, y: y3 };
        var step_1 = new Raphael.animation(newPos_1,timeStep1);
        var step_2 = new Raphael.animation(newPos_2,timeStep2).delay(timeStep1);
        var step_3 = new Raphael.animation(newPos_3,timeStep3, function(){undoButton.enable()}).delay(timeStep1+timeStep2);
        subTask.raphaelFactory.animate("step1",marble,step_1);
        setNewCoord(marble,newPos_1);
        subTask.raphaelFactory.animate("step2",marble,step_2);
        setNewCoord(marble,newPos_2);
        subTask.raphaelFactory.animate("step3",marble,step_3);
        setNewCoord(marble,newPos_3);
        rollMarbles(lastClick,timeStep4,"up");

        currentSource[lastClick].unshift(bottomMarbles.pop());
        marblesRaph[lastClick].unshift(marblesRaph[nSource].pop());

        compareWithObj();
    };

    function compareWithObj() {
        for(var iMarble = 0; iMarble < bottomMarbles.length; iMarble++) {
            if(bottomMarbles[iMarble] != objArray[iMarble]) {
                marblesRaph[nSource][iMarble][0].attr(wrongAttr);
                var message = taskStrings.errorWrongMarble;
                showFeedback(message);
                return false;
            }
            marblesRaph[nSource][iMarble][0].attr(marbleAttr);
        }
        hideFeedBack();
        return true;
    };

    function getResultAndMessage() {
        var successRate = 1; // default
        var message = taskStrings.success; // default
        if(answer.length < objArray.length ) {
            successRate = 0;
            message = taskStrings.errorMissingMarble;
        }
        var source = cloneSource();
        for(var iMarble = 0; iMarble < answer.length; iMarble++) {
            var marble = source[answer[iMarble]].shift();
            if(marble != objArray[iMarble]) {
                successRate = 0;
                message = taskStrings.errorWrongMarble;
                break;
            }
        }
        return {
            successRate: successRate,
            message: message
        };
    };

    function updateMarblesFromAnswer() {
        for(var iMarble = 0; iMarble < answer.length; iMarble++) {
            bottomMarbles.push(currentSource[answer[iMarble]].shift());
        }
    };

   function showFeedback(string) {
      $("#displayHelper_graderMessage").html(string);
      $("#displayHelper_graderMessage").css("color", "red");
      for(var iButton = 0; iButton < nSource; iButton++) {
         buttons[iButton].disable();
      }
   };

   function hideFeedBack() {
      $("#displayHelper_graderMessage").html("");
      for(var iButton = 0; iButton < nSource; iButton++) {
         buttons[iButton].enable();
      }
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
