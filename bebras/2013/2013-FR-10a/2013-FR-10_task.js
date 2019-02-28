String.prototype.replaceAll = function(target, replacement) {
    return this.split(target).join(replacement);
};

function initTask(level) {
  var steps = [];
  var maxNbSteps = 11;

  var max_modify_reached_message = 'Vous avez effectué trop d\'étapes. Recommencez en procédant autrement.';
  var nb_steps_message = 'Nombre d\'étapes utilisées : ';
  var no_modification_message = 'La séquence n\'apparaît pas dans le texte.';
  var success_message = 'Félicitations, vous avez réussi !';

  var source = {
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

  var dest = {
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

  task.dest = dest; // for grader

  task.load = function(views, callback) {
    $(".easy, .hard").hide();
    $("." + level).show();
    task.reloadAnswer('', function() {
       $('#cancel').off("click").click(cancel(task));
       $('#replace_all').off("click").click(replace(task));
       callback();
    });
  };

  task.getAnswer = function(callback) {
     callback(JSON.stringify(steps));
  };

  task.reloadAnswer = function(strAnswer, callback) {
     steps = [];
     $("#source, #current").val(source[level]);
     $("#dest").val(dest[level]);
     $("#info, #success, #error").html("");
     var current = executeAnswer(strAnswer);
     $("#current").val(current);
     var nbStepsLeft = maxNbSteps - steps.length;
     $('#info').html(nb_steps_message + steps.length + '.');
     callback();
  };

  var executeAnswer = function(strAnswer) {
     var resSteps = [];
     if (strAnswer != "") {
        resSteps = $.parseJSON(strAnswer);
     }
     steps = resSteps;

     var current = source[level];
     for (var iStep = 0; iStep < steps.length; iStep++) {
        var step = steps[iStep];
        if (step[0] != "") {
           current = current.replaceAll(step[0], step[1]);
        }
     }
     return current;
  };

  task.executeAnswer = executeAnswer; // for grader

  var cancel = function() {
    return function() {
      $('#error, #success').html('');
      if (steps.length == 0)
        return;
      steps.pop();
      var strAnswer = JSON.stringify(steps);
      task.reloadAnswer(strAnswer, function() {});
    }
  };

  function replace() {
    return function() {
      $('#error, #success').html('');
      var nbStepsLeft = maxNbSteps - steps.length;
      if (nbStepsLeft <= 0) {
        $('#error').html(max_modify_reached_message);
        return;
      }
      var search = $('#search').val();
      var replace = $('#replace').val();
      var current = $('#current').val();
      var oldAnswer = JSON.stringify(steps);
      steps.push([search, replace]);
      var strAnswer = JSON.stringify(steps);
      var new_val = executeAnswer(strAnswer);
      $("#current").val(new_val);
      var nbStepsLeft = maxNbSteps - steps.length;
      $('#info').html(nb_steps_message + steps.length + '.');
      if (new_val == current) {
        task.reloadAnswer(oldAnswer, function() {});
        $('#error').html(no_modification_message);
      } else if (new_val == dest[level]) {
        $('#success').html(success_message);
        platform.validate("done", function(){});
      } else if (steps.length == maxNbSteps) {
        $('#error').html(max_modify_reached_message);
      } 
    };
  }
}

initTask(level);