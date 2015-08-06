String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function Task(level) {
  this.level = level;
  this.steps = [];
  this.maxNbSteps = 11;

  this.max_modify_reached_message = 'Vous avez effectué trop d\'étapes. Recommencez en procédant autrement.';
  this.nb_steps_message = 'Nombre d\'étapes utilisées : ';
  this.no_modification_message = 'La séquence n\'apparaît pas dans le texte.';
  this.success_message = 'Félicitations, vous avez réussi !';

  this.source = {
    hard:
      "((42-3)+5),8:5,72\n" +
      "((33-2)+4),9:4,33\n" +
      "((25-6)+7),3:3,17\n" +
      "((70-1)+2),5:3,11\n" +
      "((12-5)+5),3:2,10\n" +
      "((12-3)+5),8:5,72\n" +
      "((23-2)+4),4:4,23\n" +
      "((35-6)+7),2:6,14\n" +
      "((50-1)+2),5:3,15\n" +
      "((23-5)+2),7:3,56\n" +
      "((99-3)+6),1:4,72\n" +
      "((22-5)+5),3:2,10\n",
    easy:
      "mix(rouge,bleu)=violet\n" +
      "mix(jaune,bleu)=vert\n" +
      "mix(jaune,rouge)=orange\n" +
      "mix(rouge,vert)=marron\n" +
      "mix(vert,jaune)=vert clair\n" +
      "mix(bleu,vert)=bleu-vert\n" +
      "mix(bleu,rouge)=violet\n" +
      "mix(bleu,jaune)=vert\n" +
      "mix(rouge,jaune)=orange\n" +
      "mix(vert,rouge)=marron\n" +
      "mix(jaune,vert)=vert clair\n" +
      "mix(vert,bleu)=bleu-vert\n"
  };

  this.dest = {
    hard:
      "(42-3+5):8,5::72\n" +
      "(33-2+4):9,4::33\n" +
      "(25-6+7):3,3::17\n" +
      "(70-1+2):5,3::11\n" +
      "(12-5+5):3,2::10\n" +
      "(12-3+5):8,5::72\n" +
      "(23-2+4):4,4::23\n" +
      "(35-6+7):2,6::14\n" +
      "(50-1+2):5,3::15\n" +
      "(23-5+2):7,3::56\n" +
      "(99-3+6):1,4::72\n" +
      "(22-5+5):3,2::10\n",
    easy:
      "rouge + bleu = violet\n" +
      "jaune + bleu = vert\n" +
      "jaune + rouge = orange\n" +
      "rouge + vert = marron\n" +
      "vert + jaune = vert clair\n" +
      "bleu + vert = bleu-vert\n" +
      "bleu + rouge = violet\n" +
      "bleu + jaune = vert\n" +
      "rouge + jaune = orange\n" +
      "vert + rouge = marron\n" +
      "jaune + vert = vert clair\n" +
      "vert + bleu = bleu-vert\n"
  };
};

Task.prototype.load = function(views, callback) {
  $(".easy, .hard").hide();
  $("." + this.level).show();
  this.reloadAnswer('', function() {
     $('#cancel').off("click").click(cancel(task));
     $('#reset').off("click").click(function () { task.reloadAnswer('', function() {}) });
     $('#replace_all').off("click").click(replace(task));
     callback();
  });
};

Task.prototype.unload = function(callback) {
  callback();
};

Task.prototype.getAnswer = function(callback) {
   callback(JSON.stringify(this.steps));
};

Task.prototype.reloadAnswer = function(strAnswer, callback) {
   this.steps = [];
   $("#source, #current").val(this.source[this.level]);
   $("#dest").val(this.dest[this.level]);
   $("#info, #success, #error").html("");
   var current = this.executeAnswer(strAnswer);
   $("#current").val(current);
   var nbStepsLeft = this.maxNbSteps - this.steps.length;
   $('#info').html(this.nb_steps_message +  this.steps.length + '.');
   callback();
};

Task.prototype.showViews = function(views, callback) {
   if (views['forum'] || views['hint'] || views['editor']) {
      views['task'] = true;
   }
   $.each(['task', 'solution'], function(i, view) {
      if (view in views) $('#'+view).show(); else $('#'+view).hide();
   });
   if (typeof task.hackShowViews === 'function') {task.hackShowViews(views);}
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
};

Task.prototype.getHeight = function(callback) {
   callback(parseInt($("html").height()));
};

Task.prototype.executeAnswer = function(strAnswer) {
   var steps = [];
   if (strAnswer != "") {
      steps = $.parseJSON(strAnswer);
   }
   this.steps = steps;

   var current = this.source[this.level];
   for (var iStep = 0; iStep < steps.length; iStep++) {
      var step = steps[iStep];
      if (step[0] != "") {
         current = current.replaceAll(step[0], step[1]);
      }
   }
   return current;
}

function cancel(task) {
  return function() {
    $('#error, #success').html('');
    if (task.steps.length == 0)
      return;
    task.steps.pop();
    var strAnswer = JSON.stringify(task.steps);
    task.reloadAnswer(strAnswer, function() {});
  }
}

function replace(task) {
  return function() {
    $('#error, #success').html('');
    var nbStepsLeft = task.maxNbSteps - task.steps.length;
    if (nbStepsLeft <= 0) {
      $('#error').html(task.max_modify_reached_message);
      return;
    }
    var search = $('#search').val();
    var replace = $('#replace').val();
    var current = $('#current').val();
    var oldAnswer = JSON.stringify(task.steps);
    task.steps.push([search, replace]);
    var strAnswer = JSON.stringify(task.steps);
    var new_val = task.executeAnswer(strAnswer);
    $("#current").val(new_val);
    var nbStepsLeft = task.maxNbSteps - task.steps.length;
    $('#info').html(task.nb_steps_message +  task.steps.length + '.');
    if (new_val == current) {
      task.reloadAnswer(oldAnswer, function() {});
      $('#error').html(task.no_modification_message);
    } else if (new_val == task.dest[task.level]) {
      $('#success').html(task.success_message);
      platform.validate("done", 1);
    } else if (task.steps.length == task.maxNbSteps) {
      $('#error').html(task.max_modify_reached_message);
    } 
  };
}
