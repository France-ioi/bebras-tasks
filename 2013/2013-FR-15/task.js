function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         squares: ['','tap', '', '', 'flower', '', '',''],
         actions: [
            { op: "wait", it: 3, text: taskStrings.wait },
            { op: "left", it: 5, text: taskStrings.move(5,"L") },
            { op: "close", it: 1, text: taskStrings.closeTap },
            { op: "pour", it: 1, text: taskStrings.pour },
            { op: "right", it: 3, text: taskStrings.move(3,"R")  },
            { op: "open", it: 1, text: taskStrings.openTap }
         ],
         solutions: [[1, 5, 0, 2, 4, 3]],
         has_can: true,
         x: 6,
         paperWidth: 320, 
         paperHeight: 220
      },
      medium: {
         squares: ['tap', '', '', '', '', 'flower', '', '', 'can', ''],
         actions: [
            { op: "left", it: 8, text: taskStrings.move(8,"L") },
            { op: "take-can", it: 1, text: taskStrings.takeWateringCan },
            { op: "right", it: 5, text: taskStrings.move(5,"R") },
            { op: "wait", it: 3, text: taskStrings.wait },
            { op: "close", it: 1, text: taskStrings.closeTap },
            { op: "pour", it: 1, text: taskStrings.pour },
            { op: "right", it: 5, text: taskStrings.move(5,"R")  },
            { op: "open", it: 1, text: taskStrings.openTap }
         ],
         solutions: [
            [2, 1, 0, 7, 3, 4, 6, 5],
            [6, 1, 0, 7, 3, 4, 2, 5]

         ],
         has_can: false,
         x: 3,
         paperWidth: 320, 
         paperHeight: 290
      },
      hard: {
         squares: ['flower', '', '', '', '', '', '', 'tap', '', '','can'],
         actions: [
            { op: "left", it: 3, text: taskStrings.move(3,"L") },
            { op: "left", it: 2, text: taskStrings.move(2,"L") },
            { op: "take-can", it: 1, text: taskStrings.takeWateringCan },
            { op: "right", it: 9, text: taskStrings.move(9,"R") },
            { op: "wait", it: 3, text: taskStrings.wait },
            { op: "close", it: 1, text: taskStrings.closeTap },
            { op: "left", it: 9, text: taskStrings.move(9,"L") },
            { op: "pour", it: 1, text: taskStrings.pour },
            { op: "right", it: 2, text: taskStrings.move(2,"R")  },
            { op: "open", it: 1, text: taskStrings.openTap }
         ],
         solutions: [[1, 3, 2, 0, 9, 4, 5, 8, 6, 7]],
         has_can: false,
         x: 3,
         paperWidth: 320, 
         paperHeight: 360
      }
   };
   var paperWidth, paperHeight;
   var paper, dragAndDrop;
   var w = 300, h = 35;
   var mode = "";

   var actions;
   var squares;
   var nb;
   var solutions;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      solutions = data[level].solutions;
      actions = data[level].actions;
      squares = data[level].squares;
      nb = actions.length;
      has_can = data[level].has_can;
      x = data[level].x;
      paperWidth = data[level].paperWidth;
      paperHeight = data[level].paperHeight;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){

      }
   };

   subTask.resetDisplay = function() {
      paper = subTask.raphaelFactory.create('anim','anim',paperWidth, paperHeight);
      paper.rect(0,0,paperWidth, paperHeight);
      
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            answer = dragAndDrop.getObjects('seq');
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, type) {
            if (dstCont == null)
               return false;
            return true;
         }
      });
      
      dragAndDrop.addContainer({
         ident : 'seq',
         cx : paperWidth/2, cy : paperHeight/2,
         widthPlace : w, heightPlace : h, 
         nbPlaces : nb,
         direction : 'vertical',
         dropMode : 'insertBefore',
         placeBackgroundArray : []
      });
      
      for(var i = 0; i < nb; i++) {
         dragAndDrop.insertObject('seq',i, {ident : i, elements : getObject(answer[i])});
      }
      reset();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [];
      for(var index = 0; index < nb; index++){
         defaultAnswer[index] = index;
      }
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      for(var iSolution = 0; iSolution < solutions.length; iSolution++){
         if (Beav.Object.eq(answer,solutions[iSolution])) {
            return { successRate: 1, message: taskStrings.success };
         }
      }
      return { successRate: 0, message: taskStrings.failure };
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function loadImages() {
      loadWCan();
      loadCloseTap();
      loadFlower();
      loadRobot();
      loadRobotWithCan();
      loadRobotWithFullCan();
      loadTap();
   }

   function getObject(id) {
      var r = paper.rect(-w/2,-h/2,w,h, h/5).attr('fill','#E0E0F8');
      var t = paper.text(0,0,actions[id].text).attr({'font-size' : 15, 'font-weight' : 'bold'});
      return [r, t];
   }

   task.unload = function(callback) {
      subTask.delayFactory.destroy("delay");

      callback();
   };

   draw = function () {
     $('#play').html('');
     var html = "<table id=\"squares\"><tr>";
     for(var i = 0; i < squares.length; i++) {
       var img = null;
       var width = "60";
       switch(squares[i]) {
         case 'tap':
           if(running_tap) {
             img = "tap";
           } else {
             img = "closedtap";
           }
           width = "60";
           break;
         case 'flower':
           img = "flower";
           break;
         case 'can':
           img = "wcan";
           break;
         default:
       }
       if(x == i) {
         if(!has_can) {
           img = "robot";
         } else {
           if(water_amount == 3) {
             img = "robotwithfullcan";
           } else {
             img = "robotwithcan";
           }
         }
         width = "60";
       }
       var content = 0
       if(img == null) {
         content = '&nbsp;';
       } else {
         content = '<div id="' + img + '" style="width:' + width + 'px;height:' + width + 'px"></div>';
       }
       html += '<td class="cell">' + content + '</td>';
       
     }
     html += "</tr></table>"
     $('#play').append(html);
     loadImages();

   }

   function tick() {
      if (curActionCount == 0) {
         curInstruction++;
         if (curInstruction >= nb) {
           if (! is_watered) {
             $('#error').html("Erreur : la plante n'a pas été arrosée.");
           } else if (running_tap == true) {
             $('#error').html("Erreur : le robinet coule encore.");
           } else {
               $('#success').html('Bravo ! Vous avez réussi.');
               platform.validate("done", function(){});
           }
           subTask.delayFactory.destroy("delay");
           return;
         }
         var iAction = dragAndDrop.getObjects('seq')[curInstruction];
         curActionCount = actions[iAction].it;
         curAction = actions[iAction].op;
      }
      curActionCount--;

      var error = "";

      switch(curAction) {
         case 'right':
            if (x == squares.length-1)
              error = "Erreur : le robot est sorti de la zone.";
            else
              x++;
            break;
         case 'left':
            if (x == 0)
              error = "Erreur : le robot est sorti de la zone.";
            else
              x--;
            break;
         case 'wait':
            if(squares[x] == 'tap' && running_tap && has_can) {
               water_amount++;
            }
            break;
         case 'close':
            if(squares[x] == 'tap') {
               running_tap = false;
            } else {
               error = "Erreur : le robot doit se trouver devant le robinet pour pouvoir le fermer.";
            }
            break;
         case 'open':
            if(squares[x] == 'tap') {
               running_tap = true;
            } else {
               error = "Erreur : le robot doit se trouver devant le robinet pour pouvoir l'ouvrir.";
            }
            break;
         case 'pour':
            if(!has_can) {
               error = "Erreur : le robot ne peut pas verser le contenu de l'arrosoir car il n'a pas l'arrosoir.";
            } else if (squares[x] != 'flower') {
               error = "Erreur : le robot essaie de verser le contenu de l'arrosoir mais n'est pas devant la plante.";
            } else if (water_amount != 3) {
               error = "Error : le contenu de l'arrosoir est vide, il n'y a rien à verser.";
            } else {
              is_watered = true;
              water_amount = 0;
            }
            break;
         case 'take-can':
            if(squares[x] != 'can') {
               error = "Erreur : le robot ne peut pas prendre l'arrosoir car il ne se trouve pas sur la bonne case."
            } else {
               has_can = true;
               squares[x] = '';
            }
            break;
         default:
      }

      if(error != "") {
         $('#error').html(error);
         subTask.delayFactory.destroy("delay");
      }

      draw();
   }

   task.reset_play = function () {
      subTask.delayFactory.destroy("delay");
      running_tap = false;
      water_amount = 0;
      is_watered = false;
      curInstruction = -1;
      curAction = "";
      curActionCount = 0;
      draw();
   }

   reset = function () {
      $("#success, #error").html("");
      task.reset_play();
   }


   task.execute = function() {
      if (typeof Tracker !== 'undefined') {Tracker.trackData({dataType:"clickitem", item:"execute"});}
      reset();
      subTask.delayFactory.create("delay",tick,300,true); 
   };

}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
