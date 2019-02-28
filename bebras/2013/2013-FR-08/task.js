function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         para_init_pos: [
            [100, 170],
            [265, 80],
            [470, 120]
         ],
         beachLimit: [ 255, 390 ],
         para_attr: [
            ["#ff7f27", 200, 50],
            ["#b5e61d", 100, 40],
            ["#ed1c24", 150, 60]
         ]
      },
      medium: {
         para_init_pos: [
            [100, 100],
            [265, 70],
            [420, 180],
            [585, 130]
         ],
         beachLimit: [ 255, 445 ],
         para_attr: [
            ["#ff7f27", 180, 40],
            ["#b5e61d", 60, 50],
            ["#ed1c24", 250, 60],
            ["#00a2e8", 140, 50]
         ]
      },
      hard: {
         para_init_pos: [
            [60, 100],
            [165, 170],
            [270, 100],
            [345, 130],
            [420, 60],
            [525, 150],
            [630, 70]
         ],
         beachLimit: [ 68, 384 ],
         para_attr: [
            ["#ff7f27", 110, 40],
            ["#b5e61d", 200, 50],
            ["#ed1c24", 80, 40],
            ["#00a2e8", 140, 50],
            ["#22b14c", 110, 40],
            ["#b8b8b8", 170, 40],
            ["#ffaec9", 50, 60]
         ]
      }
   };
   var paper;
   var paperWidth = 770;
   var paperHeight = 355;
   var gridWidth = 15;
   var solved = false;
   var nbPar;
   var para_attr;
   var borderAttr = {
      "stroke-width": 4,
      "opacity": 0
   };
   var beachLimit; 
   var para_init_pos;
   var parasols;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      para_init_pos = data[level].para_init_pos;
      beachLimit = data[level].beachLimit;
      para_attr = data[level].para_attr;
      nbPar = para_init_pos.length;
      parasols = Beav.Array.make(nbPar,null);
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initPaper();
      displayHelper.customValidate = validation;
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = {};
      defaultAnswer.parasolPos = Beav.Array.make(nbPar,[0,0]);
      defaultAnswer.parasolBBox = [];
      defaultAnswer.handleBBox = [];
      defaultAnswer.topBBox = [];
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      var result;
      if (task.checkCollisions(false)){
         result = { successRate: 0, message: taskStrings.parasolTouching };
      }else if(!task.checkAllOnBeach()){
         result = { successRate: 0, message: taskStrings.parasolNotInSand };
      }else{
         result = { successRate: 1, message: taskStrings.success };
      }
      return result;
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("beach","beach",paperWidth,paperHeight);

      // delimiters
      border_left = paper.path("M"+(beachLimit[0] + borderAttr["stroke-width"]/2)+","+paperHeight+" L"+(beachLimit[0] + borderAttr["stroke-width"]/2)+","+(paperHeight - 50));
      border_right = paper.path("M"+(beachLimit[1] - borderAttr["stroke-width"]/2)+","+paperHeight+" L"+(beachLimit[1] - borderAttr["stroke-width"]/2)+","+(paperHeight - 50));
      border_left.attr(borderAttr);
      border_right.attr(borderAttr);

      // beach
      paper.rect(0,paperHeight-8,paperWidth,8).attr({stroke:'none', fill:'#AAAAFF'});
      var beachHeight = 355 - (beachLimit[1] - beachLimit[0])/5;
      paper.path('M'+beachLimit[0]+',355 C'+(beachLimit[0] - 5)+','+beachHeight+' '+(beachLimit[1] + 5)+','+beachHeight+' '+beachLimit[1]+',355').attr({stroke:'none', fill:'#EDF000'});

      // parasols
      for(var i = 0 ; i < nbPar; i++) {
         parasols[i] = drawParasol(paper, para_attr[i][0], para_attr[i][1], para_attr[i][2]);
         moveTo(i, parasols[i].el, para_init_pos[i][0], para_init_pos[i][1]);
         drag(i, parasols[i]);

         // reload answer
         for (var iElem = 0; iElem < parasols[i].length; iElem++) {
            var el = parasols[i][iElem];
            el.origTransform = el.transform();
         }
         moveTo(i, parasols[i].el, answer.parasolPos[i][0], answer.parasolPos[i][1]);

         // update answer
         answer.parasolBBox[i] = parasols[i].el.getBBox();
         answer.handleBBox[i] = parasols[i].handle.getBBox();
         answer.topBBox[i] = parasols[i].main.getBBox();
      }
      task.checkCollisions(true);
   };

   function moveTo(iParasol, set, x, y) {
      for (var iElem = 0; iElem < set.length; iElem++) {
         var el = set[iElem];
         el.transform(el.origTransform + 'T' + x + ',' + y);
      }
   };

   function drawParasol(paper, color, width, height) {
      var handle = paper.rect(- 1, 14, 3, 10000);
      handle.attr({fill: "black"});
      paper.setStart();
      var main = paper.path("m 356,686.8 c 0,0 -101.7,-57.2 -177.6,-1 -64.5,-35.8 -97.5,-37 -176.3,0 C 82.1,600.7 178.3,516.5 354.6,516.5 c 176.3,0 278.1,84.2 352.6,169.3 -113.3,-66.5 -176.3,0 -176.3,0 -57.8,-25.3 -93.5,-47.1 -176.9,1.0");
      var bl = paper.path("m 178.3,685.8 c 0,0 36.7,-142.7 176.3,-169.3");
      var br = paper.path("m 530.8,685.8 c 0,0 -24.5,-152.7 -176.3,-169.3");
      var top = paper.setFinish();
      top.attr({
       fill: color,
       "stroke-width": '2'
      });
      top.transform('S' + (1.06 * width / 750) + ',' + (0.2 * height / 50) + ',0,0T' + (-width / 2) + ',' + (-90 + (50 - height) * 2.065));

      var hat = paper.path("m 336,515 c 0,0 16.5,-33.5 37.5,-0.5");
      hat.attr({
       "stroke-width": '2'
      });
      hat.transform('S' + (1.06 * width / 750) + ',0.2,0,0T' + (-width / 2) + ',-90');

      var parasol = paper.set();
      parasol.push(main);
      parasol.push(br);
      parasol.push(bl);
      parasol.push(hat);
      for (var iElem = 0; iElem < parasol.length; iElem++) {
        var el = parasol[iElem];
        el.origTransform = el.transform();
      }
      parasol.push(handle);
      return {
       el: parasol,
       main: main,
       handle: handle
      };
   };

   function collideBBox(a, b) {
     return !(a.x > b.x2 || a.x2 < b.x ||
              a.y > b.y2 || a.y2 < b.y)
   }

   function collideEllipse(a, b) {
     if(!collideBBox(a, b)) {
       return false;
     }

     // a = a.getBBox();
     a = {x: a.x, x2: a.x2, y: a.y, y2: a.y2};
     // b = b.getBBox();
     b = {x: b.x, x2: b.x2, y: b.y, y2: b.y2};

     radius = (a.x2 - a.x) / 2.0;
     height = (a.y2 - a.y);

     // Transform to unit circle
     a.y  /= height;
     a.y2 /= height;
     b.y  /= height;
     b.y2 /= height;
     a.x  /= radius;
     a.x2 /= radius;
     b.x  /= radius;
     b.x2 /= radius;

     // Center circle to origin
     b.y -= (a.y + 1);
     b.y2 -= (a.y + 1);
     b.x -= (a.x + 1);
     b.x2 -= (a.x + 1);

     // If circle is inside rectangle
     if(b.x <= 0 && b.x2 >=0 && b.y <= 0 && b.y2 >= 0) {
       return true;
     }

     if( b.x <= 0 && b.x2 >= 0 && Math.abs(b.y) <= 1
      || b.x <= 0 && b.x2 >= 0 && Math.abs(b.y2) <= 1
      || b.y <= 0 && b.y2 >= 0 && Math.abs(b.x) <= 1
      || b.y <= 0 && b.y2 >= 0 && Math.abs(b.x2) <= 1) {
        return true;
      }

     if( b.x * b.x + b.y * b.y <= 1
      || b.x2 * b.x2 + b.y * b.y <= 1
      || b.x2 * b.x2 + b.y2 * b.y2 <= 1
      || b.x * b.x + b.y2 * b.y2 <= 1) {
        return true;
      }
      return false;
   }


   function collideWithAny(i) {
     var parasol = parasols[i];
     for(var j = 0; j < nbPar; j++) {
       if(i == j) continue;
     }
     return false;
   }

   task.checkCollisions = function(draw) {
      var hasCollision = false;
      if(draw){
         var colliding = paper.set();
      }
      for(var par1 = 0; par1 < nbPar; par1++) {
         for(var par2 = 0; par2 < nbPar; par2++) {
            if (par1 == par2) {
               continue;
            }
            if((collideEllipse(answer.topBBox[par1], answer.topBBox[par2]) && collideEllipse(answer.topBBox[par2], answer.topBBox[par1]))
                || collideBBox(answer.topBBox[par1], answer.handleBBox[par2])
                || collideBBox(answer.topBBox[par2], answer.handleBBox[par1])) {

            } else {
               continue;
            }
            hasCollision = true;
            if(draw){
               var parasol1 = parasols[par1];
               colliding.push(parasol1.el);
            }
            break;
         }
      }
      if (draw) {
         collidingAnimation(colliding);
      }
      return hasCollision;
   }

   function collidingAnimation(set) {
      var fadeIn = new Raphael.animation({opacity : 1},500);
      var fadeOut = new Raphael.animation({opacity : 0.3},500,function(){
         subTask.raphaelFactory.animate("fadeIn",set,fadeIn);
      });
      subTask.delayFactory.destroy("delay");
      subTask.raphaelFactory.animate("fadeOut",set,fadeOut);
      subTask.delayFactory.create("delay",function(){
         subTask.raphaelFactory.animate("fadeOut",set,fadeOut);
      },1000,true);
   };

   function boundX(iParasol) {
     var parasol = parasols[iParasol];

     var x = parasol.handle.getBBox().x;
     var startX = x;
     if (x < 0) {
        x = 0;
     }
        
     if (x > 700) {
        x = 700;
     }
     
     if(iParasol > 0) {
       var left = parasols[iParasol-1];
       if(left.handle.getBBox().x + gridWidth > x) {
          x = left.handle.getBBox().x + gridWidth;
       }
     }

     if(iParasol < nbPar - 1) {
        var right = parasols[iParasol+1];
        if(x > right.handle.getBBox().x - gridWidth) {
          x = right.handle.getBBox().x - gridWidth;
        }
     }
     return x - startX;
   }

   function boundY(iParasol) {
     var parasol = parasols[iParasol];

     var y = parasol.handle.getBBox().y;
     var startY = y;
     if (y < 20) {
        y = 20;
     }
        
     if (y > 300) {
        y = 300;
     }
     return y - startY;
   }

   task.checkAllOnBeach = function() {
       var last = beachLimit[0];
       for(var iPar = 0; iPar < nbPar; iPar++) {
         if(!(last < answer.handleBBox[iPar].x)) {
           return false;
         }
         last = answer.handleBBox[iPar].x;
       }

       if(!(last <= beachLimit[1])) {
         return false;
       }
       return true;
   }

   function checkSuccess() {
       if (!task.checkAllOnBeach()) {
          return false;
       }
       if (task.checkCollisions(false)) {
          return false; 
       }
       solved = true;
       $('#reset').hide();
       return true;
   }

   function drag(iParasol, parasol) {
     lx = 0,
     ly = 0,
     ox = 0,
     oy = 0,
     moveFnc = function(dx, dy) {
       if (solved) {
          return;
       }
       var nlx = Math.round((dx + ox) / gridWidth) * gridWidth;
       var nly = dy + oy;
       moveTo(iParasol, parasol.el, nlx, nly);
       nlx += boundX(iParasol);
       nly += boundY(iParasol);
       lx = nlx;
       ly = nly;
       moveTo(iParasol, parasol.el, nlx, nly);
     },
     startFnc = function() {
        ox = answer.parasolPos[iParasol][0];
        oy = answer.parasolPos[iParasol][1];
     },
     endFnc = function() {
       ox = lx;
       oy = ly;
       answer.parasolBBox[iParasol] = parasols[iParasol].el.getBBox();
       answer.handleBBox[iParasol] = parasols[iParasol].handle.getBBox();
       answer.topBBox[iParasol] = parasols[iParasol].main.getBBox();
       answer.parasolPos[iParasol] = [lx,ly];
       task.checkCollisions(true);
       if (checkSuccess()) {
          platform.validate("done");
       }
     };
     for (iElem = 0; iElem < parasol.el.length; iElem++) {
        var elem = parasol.el[iElem];
        elem.origTransform = elem.transform();
     }
     parasol.el.drag(moveFnc, startFnc, endFnc);
   }

   function validation() {
      var res = getResultAndMessage();
      if(res.succesRate){
         platform.validate("done");
      }else{
         displayHelper.showPopupMessage(res.message, "blanket");
      }
   }

   function isAnswerToZero() {
      for(var iPos = 0; iPos < answer.parasolPos.length; iPos++){
         if(answer.parasolPos[iPos][0] !== 0 || answer.parasolPos[iPos][1] !== 0){
            return false;
         }
      }
      return true;
   }
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();

