function Task(loadCorrection) {
  this.loadCorrection = loadCorrection;
}

var nbEdgesBest = 32; 
var nodesPerSide = 8;
var nbNodes = nodesPerSide * nodesPerSide;
var nbEdgeIndices = 2 * nbNodes;
var sidePixels = 400;
var margin = 10;
var spacing = sidePixels / nodesPerSide;

function createPoint(x, y) {
  return x + nodesPerSide * (nodesPerSide - 1 - y);
}

var nodesToConnect = [  
  createPoint(0,0),
  createPoint(0,4),
  createPoint(0,5),
  createPoint(0,7),
  createPoint(1,3),
  createPoint(2,4),
  createPoint(2,6),
  createPoint(3,4),
  createPoint(3,7),
  createPoint(4,0),
  createPoint(4,1),
  createPoint(4,6),
  createPoint(5,0),
  createPoint(5,1),
  createPoint(5,7),
  createPoint(6,3),
  createPoint(7,0),
  createPoint(7,2),
  createPoint(7,3),
  createPoint(7,7)
  ];


Task.prototype.load = function(randomSeed, mode) {
  // parameters
  this.bestObtained = 1000; // infinity

  this.mode = mode;
  this.isGrader = (this.mode == 'grader');
  this.editable = (this.mode == 'task');

  // define points
    
  // data
  this.builtEdges = [];
  this.edgesObjects = [];

  // return if grader
  if (this.isGrader)
    return;

  // grid
  var areaName = "graph_" + ((this.mode == 'solution') ? 'solution' : 'task');
  this.paper = Raphael(areaName, sidePixels, sidePixels);
  var paper = this.paper;
  paper.clear();

  // draw edges
  for (var iEdge = 0; iEdge < nbEdgeIndices; iEdge++) {
    if (! this.isValidEdge(iEdge))
      continue;
    var ends = this.getEdgeEnds(iEdge);
    var xyA = this.getNodeAbsoluteCoord(ends[0]);
    var xyB = this.getNodeAbsoluteCoord(ends[1]);
    var sp = spacing / 2;
    var cx = (xyA[0]+xyB[0])/2;
    var cy = (xyA[1]+xyB[1])/2;
    var edgeClickZone = 
      paper.path('M' + (cx + sp) + "," + cy
        + "l" + (-sp) + "," + (+sp) + "l" + (-sp) + "," + (-sp) 
        + "l" + (+sp) + "," + (-sp) + "l" + (+sp) + "," + (+sp))
      .attr({"stroke": "white", fill: "white"});
    var edge = paper.path("M"+xyA[0]+","+xyA[1]+"L"+xyB[0]+","+xyB[1])
      .attr({"stroke-width": 1, stroke: "gray"});
    if (this.editable) {
      edge.click(select(this, iEdge));
      edgeClickZone.click(select(this, iEdge));
    }
    this.edgesObjects[iEdge] = edge;
  }

  // draw nodes to connect
  var radius = 6;
  for (var iNode = 0; iNode < nodesToConnect.length; iNode++) {
    var xy = this.getNodeAbsoluteCoord(nodesToConnect[iNode]);
    var node = paper.circle(xy[0], xy[1], radius)
      .attr({stroke: "black", "stroke-width": 2, fill: "#1DF2FF"});
  }

  // init
  this.reset();
  if (this.loadCorrection) 
    this.executeAnswer(solution_load_edges());
}

Task.prototype.unload = function() {
}

// TODO: possible d'inliner ?
function select(task, iEdge) {
    return function(event) { task.select(iEdge); }
}

Task.prototype.getAnswer = function() {
  return JSON.stringify(this.builtEdges);
}

// converts and iNode to a pair (x,y) in units
Task.prototype.getNodeCoord = function(iNode) {
  var s = nodesPerSide;
  return [ iNode % s, Math.floor(iNode / s) ];
}

// converts and iNode to a pair (x,y) in pixels
Task.prototype.getNodeAbsoluteCoord = function(iNode) {
  var sp = spacing;
  var xy = this.getNodeCoord(iNode);
  return [ margin + xy[0] * sp, 
           margin + xy[1] * sp ];
}

Task.prototype.isValidEdge = function(iEdge) {
  var s = nodesPerSide;
  if (iEdge < nbNodes) { // horizontal edge
    return (((iEdge + 1) % s) != 0); // not at end of line
  } else { // vertical edge
    iEdge -= nbNodes;
    return (iEdge < s * (s-1)); // not on last line
  }
}

// converts a valid iEdge to a pair of iNodes
Task.prototype.getEdgeEnds = function(iEdge) {
  var s = nodesPerSide;
  if (iEdge < nbNodes) { // horizontal edge
    return [ iEdge, iEdge + 1 ];
  } else { // vertical edge
    iEdge -= nbNodes;
    return [ iEdge, iEdge + s ];
  }
}

Task.prototype.validate = function(mode) {
  if (! this.isNetworkCompleted()) {
    $('#error').html("<b>Pour l'instant, tous les ordinateurs ne sont pas connectés entre eux.</b>");
    platform.validate("stay", function(){});
    return;
  }
  platform.validate(mode, function(){});
}

Task.prototype.mark = function(iEdge, marked) {
  // assumes not grader
  var edge = this.edgesObjects[iEdge];
  var width = (marked) ? 5 : 1;
  var color = (marked) ? "black" : "gray";
  edge.attr({"stroke-width": width, "stroke": color});
}

Task.prototype.reset = function() {
  if (! this.isGrader) {
    for (var iBuilt = 0; iBuilt < this.builtEdges.length; iBuilt++)
      this.mark(this.builtEdges[iBuilt], false);  
  }
  this.builtEdges = [];
  if (this.editable) 
    this.updateMessage(false);
}

Task.prototype.updateMessage = function(canValidate) {
  // assumes not grader
  $("#error").html("");
  $("#success").html("");
  $("#advice").html("");
  var nbUsed = this.builtEdges.length;
  var nbExtra = nbUsed - nbEdgesBest;
  $("#info").html("Votre réseau utilise <b>" + nbUsed + "</b> câble" + ((nbUsed > 1) ? "s" : "") + ".");
  if (! this.isNetworkCompleted()) {
    $('#error').html("Il reste des ordinateurs non connectés entre eux.");
    $("#advice").html("Cliquez sur les traits de la grille pour placer des câbles.");
  } else {
    if (nbUsed < this.bestObtained) {
       if (canValidate) {
          this.validate("stay");
       }
       this.bestObtained = nbUsed;
    }
    if (nbExtra == 0) {
       $("#success").html("Félicitations, vous avez trouvé la meilleure solution !");
       if (canValidate) {
          this.validate("done");
       }
       return;
    } else {
      $('#error').html("Il est possible d'utiliser <b>" + nbExtra + "</b> câble" + ((nbExtra > 1) ? "s" : "") + " de moins. Essayez de faire mieux.");
    }
  }
}

// create an edge that is assumed not to be there already
Task.prototype.createEdge = function(iEdge) {
  this.builtEdges.push(iEdge);
  if (!this.isGrader)
    this.mark(iEdge, true);
}

// rename an edge that is assumed to be there already
Task.prototype.removeEdge = function(iEdge, iBuilt) {
  this.builtEdges.splice(iBuilt, 1);
  if (!this.isGrader)
    this.mark(iEdge, false);
}

Task.prototype.select = function(iEdge, eventType) {
  // assumes not grader
  var iBuilt = $.inArray(iEdge, this.builtEdges);
  if (iBuilt == -1) {
    this.createEdge(iEdge);
  } else {
    this.removeEdge(iEdge, iBuilt);
  }
  this.updateMessage(true);
}

var parentNode = [];

Task.prototype.isNetworkCompleted = function() {
  // union find
  for (var i = 0; i < nbNodes; i++) // initialize
    parentNode[i] = i;
  function repr(a) {
    if (parentNode[a] == a)
       return a;
    var b = repr(parentNode[a]);
    parentNode[a] = b;
    return b;
  }
  function link(a, b) {
    parentNode[repr(a)] = repr(b);
  }
  // connectivity
  var edges = this.builtEdges;
  for (var e = 0; e < edges.length; e++) {
    var ends = this.getEdgeEnds(edges[e]);
    link(ends[0], ends[1]);
  }
  var nodes = nodesToConnect;
  var compo = repr(nodes[0]);
  for (var i = 1; i < nodes.length; i++)
    if (repr(nodes[i]) != compo)
       return false;
  return true;
}

Task.prototype.executeAnswer = function(edges) {
  for (var iBuilt = 0; iBuilt < edges.length; iBuilt++) 
    this.createEdge(edges[iBuilt]);
  if (this.editable)
    this.updateMessage(false);
}

Task.prototype.reloadAnswer = function(strAnswer) {
  this.reset(); 
  var edges = (strAnswer != "") ? $.parseJSON(strAnswer) : [];
  this.executeAnswer(edges);
};


