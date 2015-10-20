function initTask() {
   var paperWidth = 320, paperHeight = 290;
   var paper, dragAndDrop;
   var w = 300, h = 35;
   var mode = "";
   var interval_id = -1;

   var actions = [
      { op: "left", it: 8 },
      { op: "take-can", it: 1 },
      { op: "right", it: 5 },
      { op: "wait", it: 3 },
      { op: "close", it: 1 },
      { op: "pour", it: 1 },
      { op: "right", it: 5 },
      { op: "open", it: 1}
   ];
   var texts = [
      "Se déplacer de 8 cases vers la gauche",
      "Prendre l'arrosoir",
      "Se déplacer de 5 cases vers la droite",
      "Attendre 3 secondes",
      "Fermer le robinet",
      "Verser le contenu de l'arrosoir",
      "Se déplacer de 5 cases vers la droite",
      "Ouvrir le robinet"
   ];
   var nb = texts.length;

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
      var t = paper.text(0,0,texts[id]).attr({'font-size' : 15, 'font-weight' : 'bold'});
                $(t.node).css({
                  "-webkit-touch-callout": "none",
                  "-webkit-user-select": "none",
                  "-khtml-user-select": "none",
                  "-moz-user-select": "none",
                  "-ms-user-select": "none",
                  "user-select": "none",
                  "cursor" : "default"
               });
      return [r, t];
   }

   task.load = function(views, callback) {
      mode = views.solution ? 'solution' : 'task';
      paper = Raphael(document.getElementById('anim'),paperWidth, paperHeight);
      // TODO: à quoi servent ces deux lignes ?
      paper.rect(0,0,paperWidth, paperHeight);
      paper.rect(0,0,paperWidth, paperHeight);
      
      dragAndDrop = DragAndDropSystem({
         paper : paper,
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
         dragAndDrop.insertObject('seq',i, {ident : i, elements : getObject(i)});
      }
      reset();
      callback();
   };

   task.unload = function(callback) {
      interval_id = clearInterval(interval_id);
      callback();
   };

   task.getAnswer = function(callback) {
      callback(JSON.stringify(dragAndDrop.getObjects('seq')));
   }

   task.reloadAnswer = function(strAnswer, callback) {
      var answer = [0, 1, 2, 3, 4, 5, 6, 7];
      if (strAnswer != "") {
         answer = $.parseJSON(strAnswer);
      }
      for (var i = 0; i < nb; i++) {
         dragAndDrop.removeObject('seq', i);
      }
      for (var i = 0; i < nb; i++) {
         dragAndDrop.insertObject('seq',i, {ident : answer[i], elements : getObject(answer[i])});
      }
      callback();
   }

   draw = function () {
     $('#play').html('');
     for(var i = 0; i < state.length; i++) {
       var img = null;
       var width = "60";
       switch(state[i]) {
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
       $('#play').append('<td class="cell">' + content + '</td>');
     }
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
           window.clearInterval(interval_id)
           interval_id = -1;
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
            if (x == state.length-1)
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
            if(state[x] == 'tap' && running_tap && has_can) {
               water_amount++;
            }
            break;
         case 'close':
            if(state[x] == 'tap') {
               running_tap = false;
            } else {
               error = "Erreur : le robot doit se trouver devant le robinet pour pouvoir le fermer.";
            }
            break;
         case 'open':
            if(state[x] == 'tap') {
               running_tap = true;
            } else {
               error = "Erreur : le robot doit se trouver devant le robinet pour pouvoir l'ouvrir.";
            }
            break;
         case 'pour':
            if(!has_can) {
               error = "Erreur : le robot ne peut pas verser le contenu de l'arrosoir car il n'a pas l'arrosoir.";
            } else if (state[x] != 'flower') {
               error = "Erreur : le robot essaie de verser le contenu de l'arrosoir mais n'est pas devant la plante.";
            } else if (water_amount != 3) {
               error = "Error : le contenu de l'arrosoir est vide, il n'y a rien à verser.";
            } else {
              is_watered = true;
              water_amount = 0;
            }
            break;
         case 'take-can':
            if(state[x] != 'can') {
               error = "Erreur : le robot ne peut pas prendre l'arrosoir car il ne se trouve pas sur la bonne case."
            } else {
               has_can = true;
               state[x] = '';
            }
            break;
         default:
      }

      if(error != "") {
         $('#error').html(error);
         window.clearInterval(interval_id)
         interval_id = -1;
      }

      draw();
   }

   task.reset_play = function () {
      window.clearInterval(interval_id)
      interval_id = -1;
      x = 3;
      state = ['tap', '', '', '', '', 'flower', '', '', 'can', ''];
      has_can = false;
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
      interval_id = window.setInterval(tick, 300);
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      var solution = [2, 1, 0, 7, 3, 4, 6, 5];
      platform.getTaskParams(null, null, function(taskParams) {
        var score = taskParams.noScore;
        if (strAnswer != "") {
           score = taskParams.maxScore;
           var answer = $.parseJSON(strAnswer);
           for (var iStep = 0; iStep < solution.length; iStep++) {
              if (solution[iStep] != answer[iStep]) {
                 score = taskParams.minScore;
              }
           }
        }
        callback(score, "");
      });
   };
}

initTask();
