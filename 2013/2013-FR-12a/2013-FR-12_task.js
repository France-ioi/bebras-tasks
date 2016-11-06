task.load = function(views, callback) {
   task.task = new Task('task');
   callback();
};

task.solutionViewLoaded= false;
task.hackShowViews = function(views) {
   if (views.solution && !this.solutionViewLoaded) {
      $("#solutionContent").html(getSolutionHtml());
      task.sol = new Task('solution');
      task.solutionViewLoaded = true;
   }
}

task.getAnswer= function(callback) {
   callback(task.task.getAnswer());
};

task.reloadAnswer= function(strAnswer, callback) {
   task.task.reloadAnswer(strAnswer);
   callback();
};


function Task(mode) {
  this.isGrader = (mode == 'grader');
  this.editable = (mode == 'task');
  this.nbToSelect = 8;
  this.maxSelected = 0;
  this.nodes = [
    [252,18],
    [133,24],
    [80,73],
    [28,132],
    [48,207],

    [210,259],
    [162,204],
    [102,172],
    [170,115],
    [206,63],

    [258,108],
    [351,73],
    [325,145],
    [405,160],
    [350,210],

    [293,259],
    [233,170]
    ];
  this.edges = [
      [0,1],
      [0,10],
      [1,2],
      [1,9],
      [2,3],
      [2,7],
      [2,8],
      [3,7],
      [3,4],
      [3,8],
      [4,5],
      [5,6],
      [5,16],
      [6,7],
      [6,16],
      [7,8],
      [8,9],
      [8,16],
      [9,10],
      [10,11],
      [10,12],
      [10,16],
      [11,12],
      [12,13],
      [12,14],
      [12,16],
      [13,14],
      [14,15],
      [14,16],
      [15,16]
    ];

  if (this.isGrader) {
    this.resetSelected();
    return;
  }

  // grid
  this.paper = Raphael("graph_" + mode, 450, 280);
  var paper = this.paper;
  paper.clear();
  paper.setStart();
  var radius = 15;
  var nodes = this.nodes;
  var edges = this.edges;
  for (var iEdge = 0; iEdge < edges.length; iEdge++) {
    var iNodeA = edges[iEdge][0];    
    var iNodeB = edges[iEdge][1];
    paper.path("M"+nodes[iNodeA][0]+","+nodes[iNodeA][1]+"L"+nodes[iNodeB][0]+","+nodes[iNodeB][1])
      .attr({"stroke-width": 1.2, stroke: "black"});
  }
  this.paperNodes = [];
  for (var iNode = 0; iNode < nodes.length; iNode++) {
     var node = paper.circle(nodes[iNode][0], nodes[iNode][1], radius)
       .attr({"stroke-width": 2, stroke: "black", fill: "white"});
     if (this.editable)
       node.click(toggle(this, iNode));
     this.paperNodes[iNode] = node;
  }
  var grid = paper.setFinish();

  // init
  this.reset();
  if (mode == 'solution')
    this.executeAnswer(solution_load_nodes());
}

// TODO: comment faire pour inliner la méthode select sans avoir de pb avec le scope des variables ?
function toggle(task, iNode) {
  return function() { task.toggle(iNode); };
}

Task.prototype.getAnswer = function() {
  return JSON.stringify(this.selected);
}

Task.prototype.reset = function() {
  this.resetSelected();
  if (this.isGrader)
    return;
  this.updateDrawings();
  if (this.editable)
    this.updateMessage(false);
}

Task.prototype.resetSelected = function() {
  this.selected = [];
  for (var iNode = 0; iNode < this.nodes.length; iNode++) {
    this.selected[iNode] = 0;
  }
}

Task.prototype.isValid = function() {
  var edges = this.edges;
  for (var iEdge = 0; iEdge < edges.length; iEdge++) {
    var edge = edges[iEdge];
    if (this.selected[edge[0]] && this.selected[edge[1]])
      return false;
  }
  return true;
}
 
Task.prototype.countSelected = function() {
  var nbSelected = 0;
  for (var iNode = 0; iNode < this.nodes.length; iNode++) {
    if (this.selected[iNode])
      nbSelected++;
  }
  return nbSelected;
}

Task.prototype.updateMessage = function(canValidate) {
  $('#success').html("");
  $('#error').html("");
  var extra = '';
  var valid = this.isValid();
  var nbSelected = this.countSelected();
  $('#info').html("Nombre d'invités sélectionnés : <b>" + nbSelected + "</b>.");
  if (! valid) {
    $('#error').html("Attention : certains invités se connaissent.");
    return;
  }
  if (nbSelected == this.nbToSelect) {
     $('#success').html("Félicitations, vous avez réussi !");
     this.maxSelected = nbSelected;
     if (canValidate) {
        platform.validate("done", function(){});
     }
  }
  else if ((task.level == 'easy') && (nbSelected >= this.nbToSelect - 2)) {
     $("#success").html("Vous avez déjà " + nbSelected + " invités, ce qui rapporte une partie des points.");
     if (nbSelected < this.maxSelected) {
        $("#success").html("Vous avez déjà fait mieux avec " + this.maxSelected + " invités.");
     }
     else {
        this.maxSelected = nbSelected;
        if (canValidate) {
           platform.validate("stay", function(){});
        }
     }
  }
}

Task.prototype.nodeColor = function(selected) {
  return (selected) ? "#AAAAFF" : "white";
}

Task.prototype.updateDrawings = function() {
  for (var iNode = 0; iNode < this.nodes.length; iNode++) {
     var color = this.nodeColor(this.selected[iNode]);
     this.paperNodes[iNode].attr({fill: color});
  }
}

Task.prototype.toggle = function(iNode) {
  this.selected[iNode] = 1 - this.selected[iNode];
  var color = this.nodeColor(this.selected[iNode]);
  this.paperNodes[iNode].animate({fill: color}, 200);
  this.updateMessage(true);
}

Task.prototype.executeAnswer = function(selected) {
   this.selected = selected.slice();
   if (this.isGrader)
     return;
   this.updateDrawings();
   if (this.editable)
     this.updateMessage(false);
}

Task.prototype.reloadAnswer = function(strAnswer) {
   this.reset();
   var selected = (strAnswer != "") ? $.parseJSON(strAnswer) : [];
   this.executeAnswer(selected);
};
