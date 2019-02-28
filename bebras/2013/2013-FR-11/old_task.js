
var allNodes = [
    [208,168],

    [130,152],
    [93,69],
    [160,83],
    [162,18],

    [162,217],
    [85,203],
    [32,142],
    [107,272],
    [215,281],
    [261,238],

    [292,198],
    [340,140],
    [401,154],
    [277,112],

    [298,56],
    [368,76],
    [242,34],
    [202,106]
   ];

var allEdges = [
    [0,1],
    [1,2],
    [1,3],
    [3,4],

    [0,5],
    [5,6],
    [6,7],
    [6,8],
    [5,8],
    [5,9],
    [9,10],
    [10,0],

    [0,11],
    [11,12],
    [12,13],
    [12,14],
    [14,15],
    [15,16],
    [15,17],
    [14,18],
    [18,0]
   ];

function Task(mode) {
  this.mode = mode;
  this.isGrader = (mode == 'grader');
  this.editable = (mode == 'task');

  // data
  this.builtEdges = [];

  if (this.isGrader) 
    return;

  // graphics
  this.curSelect = -1;
  this.builtObjects = [];

  // grid
  this.paper = Raphael("graph_" + mode, 450, 310);
  var paper = this.paper;
  paper.clear();
  var radius = 15;
  for (var iEdge = 0; iEdge < allEdges.length; iEdge++) {
    var iNodeA = allEdges[iEdge][0];
    var iNodeB = allEdges[iEdge][1];
    paper.path("M"+allNodes[iNodeA][0]+","+allNodes[iNodeA][1]+"L"+allNodes[iNodeB][0]+","+allNodes[iNodeB][1])
      .attr({"stroke-width": 1.2, stroke: "black"});
  }
  paper.text(allNodes[0][0] + 42, allNodes[0][1] - 15, "barrage").attr({'font-size': 16, 'font-weight': "bold"});
  this.nodesObject = [];
  for (var iNode = 0; iNode < allNodes.length; iNode++) {
    var color = (iNode == 0) ? "#1DF2FF" : "white";
    var node = paper.circle(allNodes[iNode][0], allNodes[iNode][1], radius)
      .attr({"stroke-width": 2, stroke: "black", fill: color});
    if (this.editable) {
      node.click(select(this, iNode));
    }
    this.nodesObject[iNode] = node;
  }
  // buttons
  if (this.editable) {
    var task = this;
    $('#reset').off("click").click(function() { task.reset(); });
  }

  // init
  this.reset();
  if (mode == 'solution') 
    this.executeAnswer(solution_load_edges());
}

// TODO: comment faire pour inliner la méthode select sans avoir de pb avec le scope des variables ?
function select(task, iNode, eventType) {
  return function() { task.select(iNode, eventType); };
}

Task.prototype.getAnswer = function() {
  return JSON.stringify(this.builtEdges);
}

Task.prototype.reset = function() {
  this.builtEdges = [];
  if (this.isGrader) 
    return;
  for (var iBuilt = 0; iBuilt < this.builtObjects.length; iBuilt++) {
    this.builtObjects[iBuilt].remove();
  }
  this.builtObjects = [];
  this.resetSelectedNode();
  if (this.editable) {
    this.resetError();
    this.updateMessage();
  }
}

Task.prototype.updateMessage = function() {
  $('#message').html("Nombre de lignes construites : <b>" + this.builtEdges.length + "</b>. ");
}

Task.prototype.resetError = function() {
  $('#error').html("");
}

Task.prototype.findBuilt = function(table, iNodeA, iNodeB) {
  for (var iBuilt = 0; iBuilt < table.length; iBuilt++) {
    var edge = table[iBuilt];
    if (   (edge[0] == iNodeA && edge[1] == iNodeB)
        || (edge[0] == iNodeB && edge[1] == iNodeA)) 
      return iBuilt;
  }
  return -1;
}

Task.prototype.createEdge = function(iNodeA, iNodeB) {
  if (   this.findBuilt(this.builtEdges, iNodeA, iNodeB) != -1
      || this.findBuilt(allEdges, iNodeA, iNodeB) != -1) {
    $('#error').html("Il existe déjà une ligne <br />entre ces deux points.");
    return;
  }
  this.builtEdges.push([ iNodeA, iNodeB ]);
  if (this.isGrader) 
    return;

  var task = this;
  var edgeObject = this.paper.path("M"+allNodes[iNodeA][0]+","+allNodes[iNodeA][1]+"L"+allNodes[iNodeB][0]+","+allNodes[iNodeB][1])
    .attr({"stroke-width": 10, stroke: "#6666FF"})
    .toBack();
  if (this.editable) {
    edgeObject.click(function() { deselect(task, iNodeA, iNodeB); });
  }
  this.builtObjects.push(edgeObject);
}

function deselect(task, iNodeA, iNodeB) {
  task.deselect(iNodeA, iNodeB);
}

Task.prototype.deselect = function(iNodeA, iNodeB) {
  this.resetError();
  this.resetSelectedNode();
  var iBuilt = this.findBuilt(this.builtEdges, iNodeA, iNodeB);
  if (iBuilt != -1) {
    this.builtEdges.splice(iBuilt, 1);
    this.builtObjects[iBuilt].remove(); // TODO: animate?
    this.builtObjects.splice(iBuilt, 1);
  } else {
    // TODO: internal error if reaching this point
  }
  this.updateMessage();
}
      
Task.prototype.resetSelectedNode = function() {
  var iNode = this.curSelect;
  if (iNode != -1) {
    this.nodesObject[iNode].animate({stroke: "black", "stroke-width": 2}, 0);
    this.curSelect = -1;
  }
}

Task.prototype.setSelectedNode = function(iNode) {
  this.curSelect = iNode;
  this.nodesObject[iNode].animate({stroke: "#6666FF", "stroke-width": 4}, 0);    
}

Task.prototype.select = function(iNode) {
   this.resetError();
   if (this.curSelect == -1) {
      this.setSelectedNode(iNode);
   } else if (iNode != this.curSelect) {
      this.createEdge(this.curSelect, iNode);
      this.resetSelectedNode();
   } else {
      this.resetSelectedNode();
   }
   this.updateMessage();
}

Task.prototype.edgesFromAnswer = function(strAnswer) {
  var edges = [];
  if (strAnswer != "") {
    edges = $.parseJSON(strAnswer);
  } 
  // sanity checker (optional)
  for (var iBuilt = 0; iBuilt < edges.length; iBuilt++) {
    var edge = edges[iBuilt];
    if (edge[0] < 0 || edge[0] > allNodes.length ||
        edge[1] < 0 || edge[1] > allNodes.length) {
      edges = []; // TODO: comment gérer les indices invalides dans les strAnswer ?
      break; }
  }
  return edges;
}

Task.prototype.executeAnswer = function(edges) {
  for (var iBuilt = 0; iBuilt < edges.length; iBuilt++) {
    var edge = edges[iBuilt];
    this.createEdge(edge[0], edge[1]);
  }
  if (this.editable)
    this.updateMessage();
}

Task.prototype.reloadAnswer = function(strAnswer) {
  this.reset();
  var edges = this.edgesFromAnswer(strAnswer);
  this.executeAnswer(edges);
};


