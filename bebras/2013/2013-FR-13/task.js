function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         nbBalls: 3
      },
      medium: {
         nbBalls: 4
      },
      hard: {
         nbBalls: 6
      }
   };

   var paper;
   var paperW = 650;
   var paperH = 320;
   var r = 30;
   var margin = 10;
   var scaleW = 300;

   var nbBalls;
   var rng;
   var dragAndDrop;
   var weights = [];
   var scale;
   var yScale, xScale;
   var lightLeft, heavyLeft, lightRight, heavyRight;

   var colors = ["#FFFF00", "#00FFFF", "#FF00FF", "#0000FF", "#FF0000", "#00FF00"];
   var texts = ["A", "B", "C", "D", "E", "F"];

   var textAttr = {
      "font-size": 12
   };


   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      nbBalls = data[level].nbBalls;
      rng = new RandomGenerator(subTask.taskParams.randomSeed);
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(answer){
         rng.reset(answer.seed);
      }
   };

   subTask.resetDisplay = function () {
      displayError("");
      initPaper();
      initScale();
      initDragAndDrop();
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = {
         weights: [],
         order: [],
         seed: rng.nextInt(1,10000)
      };
      for(var iBall = 0; iBall < nbBalls; iBall++){
         defaultAnswer.weights[iBall] = iBall + 1;
         defaultAnswer.order[iBall] = iBall;
      }
      rng.shuffle(defaultAnswer.weights);
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result;
   }

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);
      $("#paper").css("width", paperW);
   };

   function initScale() {
      yScale = 130;
      xScale = (paperW - scaleW)/2;
      paper.rect(xScale - 50,yScale - 40,scaleW + 100,1).attr('stroke-width',5);
      scale = new Scale(paper, xScale);
      lightLeft = paper.text(xScale + 50,yScale + 100,taskStrings.lighter).attr(textAttr).hide();
      heavyLeft = paper.text(xScale + 50,yScale + 135,taskStrings.heavier).attr(textAttr).hide();
      lightRight = paper.text(xScale + 250,yScale + 100,taskStrings.lighter).attr(textAttr).hide();
      heavyRight = paper.text(xScale + 250,yScale + 135,taskStrings.heavier).attr(textAttr).hide();
   };

   function initDragAndDrop() {
      dragAndDrop = new DragAndDropSystem({
         paper : paper,
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, type)
         {
            if(dstCont == null)
               return false;
            return true;
         },
         drop : function(srcCont, srcPos, dstCont, dstPos, type)
         {
            displayError("");
            answer.order = dragAndDrop.getObjects('seq');
            scale.reset(-1);
            lightLeft.hide(); heavyLeft.hide(); lightRight.hide(); heavyRight.hide();  
         },
         over : function(srcCont, srcPos, dstCont, dstPos)
         {
            lightLeft.hide(); heavyLeft.hide(); lightRight.hide(); heavyRight.hide();  
            if(dstCont == null)
               scale.reset(-1);
            else
            {
               var objs = dragAndDrop.getObjects('seq');
               scale.reset(-1);
               scale.compare(weights[objs[srcPos]],weights[objs[dstPos]],0);
               // not used: if(weighted_circles[objs[srcPos]].weight < weighted_circles[objs[dstPos]].weight)
               lightLeft.show();
               heavyRight.show();
            }
         }
      });
      var x = paperW/2;
      var y = margin + r;
      dragAndDrop.addContainer({
         ident : 'seq',
         cx : x, cy : y, widthPlace : 2*r, heightPlace : 2*r,
         nbPlaces : nbBalls,
         dropMode : 'insertBefore',
         dragDisplayMode : 'marker',
         placeBackgroundArray : []
      });

      for(var iBall = 0; iBall < nbBalls; iBall++) {
         var circle = getObject(iBall);
         dragAndDrop.insertObject('seq',iBall, {ident : iBall, elements : circle} );
      }
   };

   function initHandlers() {
      $("#replace_all").off("click");
      $("#replace_all").click(replace);
      $("#cancel").off("click");
      $("#cancel").click(cancel);
      $("#search, #replace").off("keydown");
      $("#search, #replace").keydown(function(){
         displayError("");
      });
   };

   function getObject(id) {
      var c = paper.circle(0,0,26).attr('fill', colors[id]);
      var t = paper.text(0,0,texts[id]).attr({'font-size' : 25, 'font-weight' : 'bold'});

      weights[id] = paper.set();
      weights[id].push(c, t);
      weights[id].weight = answer.weights[id];
      return [c, t];
   };

   function Scale(paper, xScale) {
       paper.setStart();
       paper.rect(xScale, yScale + 145, scaleW, 5);
       paper.rect(xScale + 147.5, yScale, 5, 150);
       this.balanceBody = paper.setFinish().attr({
           fill: "#000000"
       });
       this.center = [xScale + 150, yScale];

       this.balanceTop = paper.rect(xScale + 50, yScale - 1, 200, 2).attr({
           fill: "#000000"
       });

       paper.setStart();
       paper.path("M"+parseInt(xScale + 50)+" " + yScale + "L"+parseInt(xScale)+" " + (yScale + 100));
       paper.path("M"+parseInt(xScale + 50)+" " + yScale + "L"+parseInt(xScale + 100)+" " + (yScale + 100));
       paper.rect(xScale, yScale + 97.50, 100, 5).attr({
           fill: "#000000"
       });
       this.leftThing = paper.setFinish();

       paper.setStart();
       paper.path("M"+parseInt(xScale + 250)+" " + yScale + "L"+parseInt(xScale + 200)+" " + (yScale + 100));
       paper.path("M"+parseInt(xScale + 250)+" " + yScale + "L"+parseInt(xScale + 300)+" " + (yScale + 100));
       paper.rect(xScale + 200, yScale + 97.50, 100, 5).attr({
           fill: "#000000"
       });
       this.rightThing = paper.setFinish();
       //
       this.comparing = -1;
       this.clones = [];
   };

   Scale.prototype.cleanClones = function() {
      for (var iClone = 0; iClone < this.clones.length; iClone++) {
         var clone = this.clones[iClone];
         clone.remove();
      };
      this.clones = [];
   }

   Scale.prototype.compare = function compare(a, b, i) {
       if (a.weight > b.weight) {
         t = a;
         a = b;
         b = t;
       }
       // assume now a.weight < b.weight
       if (this.comparing == i){
           return;
       }
       if (this.comparing != -1) {
          this.cleanClones();
       }
       this.comparing = i;
       var rotation = 10;
       // if (a.weight > b.weight) rotation = -10;
       var toRadian = Math.PI / 180;
       var move = [-(1 - Math.cos(rotation * toRadian)) * 100,
                   Math.sin(rotation * toRadian) * 100];

       this.clones.push(a.clone().attr({
           cx: xScale + 50,
           cy: yScale + 67.5,
           x : xScale + 50,
           y : yScale + 67.5 
       }));
       this.leftThing.push(this.clones[0]);
       this.clones.push(b.clone().attr({
           cx: xScale + 250,
           cy: yScale + 67.5,
           x: xScale + 250,
           y: yScale + 67.5
       }));
       this.rightThing.push(this.clones[1]);

       this.balanceTop.transform("R" + rotation + "," + this.center[0] + "," + this.center[1]);
       this.leftThing.transform("T" + (-move[0]) + "," + (-move[1]));
       this.rightThing.transform("T" + move[0] + "," + move[1]);
   };

   Scale.prototype.reset = function reset(i) {
       this.cleanClones();

       var rotation = 0;
       var toRadian = Math.PI / 180;
       var move = [-(1 - Math.cos(rotation * toRadian)) * 100, Math.sin(rotation * toRadian) * 100];
       this.balanceTop.transform("R" + rotation + "," + this.center[0] + "," + this.center[1]);
       this.leftThing.transform("T" + (-move[0]) + "," + (-move[1]));
       this.rightThing.transform("T" + move[0] + "," + move[1]);
       this.comparing = i;
   };

   function checkResult() {
      for(var iBall = 0; iBall < nbBalls - 1; iBall++){
         if(answer.weights[answer.order[iBall]] > answer.weights[answer.order[iBall + 1]]){
            return { successRate:0, message: taskStrings.failure };
         }
      }
      return { successRate: 1, message: taskStrings.success };
   };

   function displayError(msg) {
      $("#error").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
