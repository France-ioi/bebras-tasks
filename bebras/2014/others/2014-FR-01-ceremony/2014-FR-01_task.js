var paperWidth = 320, paperHeight = 320;
var paper, dragAndDrop;
var w = 300, h = 30;


var actions = [
];
var texts = [
   "Fireworks",
   "Announce prize winner",
   "Thank everyone",
   "Long speech",
   "Drum rolls",
   "Minute of silence",
   "Sing a song",
   "10 minutes break",
   "Play the clairon",
   "Dance performance"
];

var nb = texts.length;

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

Task.prototype.load = function(random_seed, mode) {
   this.mode = mode;
   paper = Raphael(document.getElementById('anim'),paperWidth, paperHeight);
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
   
   for (var i = 0; i < nb; i++) {
      dragAndDrop.insertObject('seq',i, {ident : i, elements : getObject(i)});
   }
   this.reset();
   $('#execute').click(execute(this));
};

Task.prototype.unload = function() {
   task.interval_id = clearInterval(task.interval_id);
   return true;
};

Task.prototype.getAnswer = function() {
   return JSON.stringify(dragAndDrop.getObjects('seq'));
}

Task.prototype.reloadAnswer = function(strAnswer) {
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
}

Task.prototype.draw = function () {
}


Task.prototype.reset_play = function () {
   window.clearInterval(this.interval_id)
   this.interval_id = -1;
   this.draw();
}

Task.prototype.reset = function () {
   $("#success, #error").html("");
   this.reset_play();
}


function execute(task) {
   return function() {
      Tracker.trackData({dataType:"clickitem", item:"execute"});
      task.reset();
      //task.interval_id = window.setInterval(tick(task), 300);
   };
}

function tick(task) {
   return function() {
      task.tick();
   };
}

var task = new Task();
