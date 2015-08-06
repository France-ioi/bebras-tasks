var paperWidth = 320, paperHeight = 290;
var paper, dragAndDrop;
var w = 300, h = 35;


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

function Task() {
  this.mode = "";
  this.interval_id = -1;
  this.reset();
};

Task.prototype.load = function(views, callback) {
   this.mode = views.solution ? 'solution' : 'task';
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
   this.reset();
   $('#execute').click(execute(this));
   callback();
};

Task.prototype.showViews = function(views, callback) {
   if (views['forum'] || views['hint'] || views['editor']) {
      console.error("this task does not have forum, hint nor editor specific view, showing task view instead.");
      views['task'] = true;
   }
   $.each(['task', 'solution'], function(i, view) {
      if (view in views) $('#'+view).show(); else $('#'+view).hide();
   });
   callback();
}

Task.prototype.getViews = function(callback) {
    // all beaver tasks have the same views
    var views = {
        task: {},
        solution: {},
        "hint" : {requires: "task"},
        "forum" : {requires: "task"},
        "editor" : {requires: "task"}
    };
    callback(views);
}

Task.prototype.updateToken = function(token) {
   console.warning("sorry, token system not available on Beaver platform");
};

Task.prototype.getHeight = function(callback) {
   callback(parseInt($("html").height()));
};

Task.prototype.unload = function(callback) {
   task.interval_id = clearInterval(task.interval_id);
   callback();
};

Task.prototype.getAnswer = function(callback) {
   callback(JSON.stringify(dragAndDrop.getObjects('seq')));
}

Task.prototype.reloadAnswer = function(strAnswer, callback) {
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

Task.prototype.draw = function () {
  $('#play').html('');
  for(var i = 0; i < this.state.length; i++) {
    var img = null;
    var width = "60";
    switch(this.state[i]) {
      case 'tap':
        if(this.running_tap) {
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
    if(this.x == i) {
      if(!this.has_can) {
        img = "robot";
      } else {
        if(this.water_amount == 3) {
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

Task.prototype.tick = function () {
   if (this.curActionCount == 0) {
      this.curInstruction++;
      if (this.curInstruction >= nb) {
        if (! this.is_watered) {
          $('#error').html("Erreur : la plante n'a pas été arrosée.");
        } else if (this.running_tap == true) {
          $('#error').html("Erreur : le robinet coule encore.");
        } else {
            $('#success').html('Bravo ! Vous avez réussi.');
            platform.validate("done", 1);
        }
        window.clearInterval(this.interval_id)
        this.interval_id = -1;
        return;
      }
      var iAction = dragAndDrop.getObjects('seq')[this.curInstruction];
      this.curActionCount = actions[iAction].it;
      this.curAction = actions[iAction].op;
   }
   this.curActionCount--;

   var error = "";

   switch(this.curAction) {
      case 'right':
         if (this.x == this.state.length-1)
           error = "Erreur : le robot est sorti de la zone.";
         else
           this.x++;
         break;
      case 'left':
         if (this.x == 0)
           error = "Erreur : le robot est sorti de la zone.";
         else
           this.x--;
         break;
      case 'wait':
         if(this.state[this.x] == 'tap' && this.running_tap && this.has_can) {
            this.water_amount++;
         }
         break;
      case 'close':
         if(this.state[this.x] == 'tap') {
            this.running_tap = false;
         } else {
            error = "Erreur : le robot doit se trouver devant le robinet pour pouvoir le fermer.";
         }
         break;
      case 'open':
         if(this.state[this.x] == 'tap') {
            this.running_tap = true;
         } else {
            error = "Erreur : le robot doit se trouver devant le robinet pour pouvoir l'ouvrir.";
         }
         break;
      case 'pour':
         if(!this.has_can) {
            error = "Erreur : le robot ne peut pas verser le contenu de l'arrosoir car il n'a pas l'arrosoir.";
         } else if (this.state[this.x] != 'flower') {
            error = "Erreur : le robot essaie de verser le contenu de l'arrosoir mais n'est pas devant la plante.";
         } else if (this.water_amount != 3) {
            error = "Error : le contenu de l'arrosoir est vide, il n'y a rien à verser.";
         } else {
           this.is_watered = true;
           this.water_amount = 0;
         }
         break;
      case 'take-can':
         if(this.state[this.x] != 'can') {
            error = "Erreur : le robot ne peut pas prendre l'arrosoir car il ne se trouve pas sur la bonne case."
         } else {
            this.has_can = true;
            this.state[this.x] = '';
         }
         break;
      default:
   }

   if(error != "") {
      $('#error').html(error);
      window.clearInterval(this.interval_id)
      this.interval_id = -1;
   }

   task.draw();
}

Task.prototype.reset_play = function () {
   window.clearInterval(this.interval_id)
   this.interval_id = -1;
   this.x = 3;
   this.state = ['tap', '', '', '', '', 'flower', '', '', 'can', ''];
   this.has_can = false;
   this.running_tap = false;
   this.water_amount = 0;
   this.is_watered = false;
   this.curInstruction = -1;
   this.curAction = "";
   this.curActionCount = 0;
   this.draw();
}

Task.prototype.reset = function () {
   $("#success, #error").html("");
   this.reset_play();
}


function execute(task) {
   return function() {
      if (typeof Tracker !== 'undefined') {Tracker.trackData({dataType:"clickitem", item:"execute"});}
      task.reset();
      task.interval_id = window.setInterval(tick(task), 300);
   };
}

function tick(task) {
   return function() {
      task.tick();
   };
}

var task = new Task();
