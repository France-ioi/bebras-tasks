function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;

   var data = { // "shapeList" items correspond to indices in global variables "shapes"
      easy: {
         nbDistinctShapes : 3,
         shapeList : [ 1, 0, 2, 1, 0 ],
         shapeListRaphael : [],
         visualGraph : '{"vertexVisualInfo":{"start":{"x":64,"y":160},"v_2":{"x":192,"y":160},"v_4":{"x":384,"y":32},"v_5":{"x":448,"y":160},"finish":{"x":576,"y":160},"v_0":{"x":320,"y":160},"v_1":{"x":256,"y":32}},"edgeVisualInfo":{"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_1":{},"e_2":{},"e_3":{}},"minGraph":{"vertexInfo":{"start":{},"v_2":{},"v_4":{},"v_5":{},"finish":{},"v_0":{},"v_1":{}},"edgeInfo":{"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_1":{},"e_2":{},"e_3":{}},"edgeVertices":{"e_4":["v_4","v_5"],"e_5":["v_5","finish"],"e_6":["v_2","v_0"],"e_7":["v_0","v_5"],"e_1":["start","v_2"],"e_2":["v_1","v_4"],"e_3":["v_2","v_1"]},"directed":true}}',
         graphPaperSize : { "width" : 600, "height" : 185 },
         duration: 1000
         },
      medium: {
         nbDistinctShapes : 3,
         shapeList : [ 0, 2, 1, 2, 1, 2, 1, 2, 2, 1, 2, 0 ],
         shapeListRaphael : [],
         visualGraph : '{"vertexVisualInfo":{"start":{"x":32,"y":160},"v_1":{"x":224,"y":160},"finish":{"x":416,"y":160},"v_0":{"x":128,"y":32},"v_3":{"x":352,"y":256},"v_4":{"x":224,"y":320},"v_6":{"x":96,"y":256},"v_8":{"x":320,"y":32}},"edgeVisualInfo":{"e_0":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{}},"minGraph":{"vertexInfo":{"start":{},"v_1":{},"finish":{},"v_0":{},"v_3":{},"v_4":{},"v_6":{},"v_8":{}},"edgeInfo":{"e_0":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{}},"edgeVertices":{"e_0":["start","v_1"],"e_9":["v_1","v_0"],"e_10":["v_0","v_8"],"e_11":["v_8","v_1"],"e_12":["v_1","v_3"],"e_13":["v_3","v_4"],"e_14":["v_4","v_6"],"e_15":["v_6","v_1"],"e_16":["v_1","finish"]},"directed":true}}',
         graphPaperSize : { "width" : 550, "height" : 330 },
         duration: 500
      },
      hard: {
         nbDistinctShapes : 3,
         shapeList : [ 0, 1, 2, 2, 1, 1, 2, 2, 1, 1, 0, 0, 2, 0, 0, 2, 1 ],
         shapeListRaphael : [],
         visualGraph : '{"vertexVisualInfo":{"start":{"x":32,"y":160},"v_1":{"x":192,"y":160},"v_2":{"x":32,"y":32},"v_3":{"x":192,"y":32},"v_4":{"x":192,"y":288},"v_5":{"x":352,"y":288},"finish":{"x":512,"y":160},"v_0":{"x":352,"y":160},"v_8":{"x":352,"y":32},"v_9":{"x":512,"y":32}},"edgeVisualInfo":{"e_0":{},"e_4":{},"e_6":{},"e_7":{},"e_8":{},"e_14":{},"e_15":{},"e_16":{},"e_24":{},"e_25":{},"e_26":{},"e_1":{}},"minGraph":{"vertexInfo":{"start":{},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"finish":{},"v_0":{},"v_8":{},"v_9":{}},"edgeInfo":{"e_0":{},"e_4":{},"e_6":{},"e_7":{},"e_8":{},"e_14":{},"e_15":{},"e_16":{},"e_24":{},"e_25":{},"e_26":{},"e_1":{}},"edgeVertices":{"e_0":["start","v_1"],"e_4":["v_1","v_0"],"e_6":["v_0","v_5"],"e_7":["v_5","v_4"],"e_8":["v_4","v_1"],"e_14":["v_1","v_3"],"e_15":["v_3","v_2"],"e_16":["v_2","v_1"],"e_24":["v_0","v_9"],"e_25":["v_9","v_8"],"e_26":["v_8","v_0"],"e_1":["v_0","finish"]},"directed":true}}',
         graphPaperSize : { "width" : 600, "height" : 310 },
         duration: 300
      }
      /* FUTURE tasks
      very_hard: {
         nbDistinctShapes : 3,
         shapeList : [ 0, 1, 2, 0, 0, 1, 2, 0, 1, 1, 2, 1, 1, 2, 0, 1, 2 ],
         shapeListRaphael : [],
         visualGraph : '{"vertexVisualInfo":{"start":{"x":224,"y":160},"v_1":{"x":64,"y":160},"v_2":{"x":64,"y":32},"v_3":{"x":224,"y":32},"v_4":{"x":224,"y":288},"v_6":{"x":384,"y":32},"finish":{"x":384,"y":288},"v_0":{"x":60,"y":287.90625},"v_5":{"x":382,"y":160.90625}},"edgeVisualInfo":{"e_0":{},"e_3":{},"e_6":{},"e_9":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_18":{},"e_19":{},"e_20":{},"e_21":{}},"minGraph":{"vertexInfo":{"start":{},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_6":{},"finish":{},"v_0":{},"v_5":{}},"edgeInfo":{"e_0":{},"e_3":{},"e_6":{},"e_9":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_18":{},"e_19":{},"e_20":{},"e_21":{}},"edgeVertices":{"e_0":["start","v_1"],"e_3":["v_2","v_3"],"e_6":["v_1","v_2"],"e_9":["v_6","v_3"],"e_14":["start","v_4"],"e_15":["v_3","start"],"e_16":["start","v_5"],"e_17":["v_3","v_5"],"e_18":["v_5","v_6"],"e_19":["v_5","finish"],"e_20":["v_4","v_0"],"e_21":["v_0","start"]},"directed":true}}',
         graphPaperSize : { "width" : 500, "height" : 310 },
         duration: 500
      },
      hard_bis: {
         nbDistinctShapes : 2,
         shapeList : [ 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0 ],
         shapeListRaphael : [],
         visualGraph : '{"vertexVisualInfo":{"start":{"x":32,"y":160},"v_1":{"x":192,"y":160},"v_2":{"x":192,"y":288},"v_3":{"x":352,"y":160},"v_4":{"x":192,"y":32},"v_6":{"x":352,"y":32},"finish":{"x":512,"y":160}},"edgeVisualInfo":{"e_0":{},"e_3":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{},"e_14":{}},"minGraph":{"vertexInfo":{"start":{},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_6":{},"finish":{}},"edgeInfo":{"e_0":{},"e_3":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{},"e_14":{}},"edgeVertices":{"e_0":["start","v_1"],"e_3":["v_2","v_3"],"e_6":["v_1","v_2"],"e_7":["v_1","v_4"],"e_8":["v_4","v_6"],"e_9":["v_6","v_3"],"e_10":["v_3","finish"],"e_11":["v_2","start"],"e_12":["v_3","v_1"],"e_13":["v_4","v_3"],"e_14":["start","v_4"]},"directed":true}}',
         graphPaperSize : { "width" : 770, "height" : 300 },
         duration: 750
      },
      hard_ter: {
         nbDistinctShapes : 3,
         shapeList : [ 0, 1, 2, 2, 1, 1, 2, 2, 1, 1, 0, 0, 2, 0, 0, 2, 1, 2 ],
         shapeListRaphael : [],
         visualGraph : '{"vertexVisualInfo":{"start":{"x":32,"y":160},"v_1":{"x":192,"y":160},"v_2":{"x":32,"y":32},"v_3":{"x":192,"y":32},"v_4":{"x":192,"y":288},"v_5":{"x":352,"y":288},"finish":{"x":704,"y":160},"v_0":{"x":352,"y":160},"v_6":{"x":544,"y":160},"v_7":{"x":544,"y":288},"v_8":{"x":352,"y":32},"v_9":{"x":544,"y":32},"v_10":{"x":704,"y":288}},"edgeVisualInfo":{"e_0":{},"e_4":{},"e_6":{},"e_7":{},"e_8":{},"e_10":{},"e_11":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_20":{},"e_21":{},"e_22":{},"e_23":{},"e_24":{},"e_25":{},"e_26":{}},"minGraph":{"vertexInfo":{"start":{},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"finish":{},"v_0":{},"v_6":{},"v_7":{},"v_8":{},"v_9":{},"v_10":{}},"edgeInfo":{"e_0":{},"e_4":{},"e_6":{},"e_7":{},"e_8":{},"e_10":{},"e_11":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_20":{},"e_21":{},"e_22":{},"e_23":{},"e_24":{},"e_25":{},"e_26":{}},"edgeVertices":{"e_0":["start","v_1"],"e_4":["v_1","v_0"],"e_6":["v_0","v_5"],"e_7":["v_5","v_4"],"e_8":["v_4","v_1"],"e_10":["v_0","v_6"],"e_11":["v_6","v_7"],"e_13":["v_6","finish"],"e_14":["v_1","v_3"],"e_15":["v_3","v_2"],"e_16":["v_2","v_1"],"e_20":["v_9","v_6"],"e_21":["v_7","v_0"],"e_22":["v_6","v_10"],"e_23":["v_10","v_7"],"e_24":["v_0","v_9"],"e_25":["v_9","v_8"],"e_26":["v_8","v_0"]},"directed":true}}',
         graphPaperSize : { "width" : 770, "height" : 320 },
         duration: 750
      },
      medium_bis: {
         nbDistinctShapes : 3,
         shapeList : [ 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 2, 1 ],
         shapeListRaphael : [],
         visualGraph : '{"vertexVisualInfo":{"start":{"x":32,"y":32},"v_1":{"x":224,"y":32},"finish":{"x":32,"y":96},"v_0":{"x":416,"y":32},"v_2":{"x":128,"y":160},"v_3":{"x":320,"y":160},"v_4":{"x":512,"y":160},"v_5":{"x":704,"y":160},"v_6":{"x":608,"y":32}},"edgeVisualInfo":{"e_0":{},"e_4":{},"e_3":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{},"e_14":{}},"minGraph":{"vertexInfo":{"start":{},"v_1":{},"finish":{},"v_0":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"v_6":{}},"edgeInfo":{"e_0":{},"e_4":{},"e_3":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{},"e_14":{}},"edgeVertices":{"e_0":["start","v_1"],"e_4":["v_1","v_0"],"e_3":["v_1","v_3"],"e_5":["v_3","v_2"],"e_6":["v_2","v_1"],"e_7":["v_2","finish"],"e_8":["v_0","v_4"],"e_9":["v_4","v_3"],"e_10":["v_3","v_0"],"e_11":["v_0","v_6"],"e_12":["v_6","v_5"],"e_13":["v_5","v_4"],"e_14":["v_4","v_6"]},"directed":true}}',
         graphPaperSize : { "width" : 750, "height" : 180 },
         duration: 500
      },
      medium_ter: {
         nbDistinctShapes : 3,
         shapeList : [ 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 2, 1 ],
         shapeListRaphael : [],
         visualGraph : '{"vertexVisualInfo":{"start":{"x":32,"y":32},"v_1":{"x":224,"y":32},"finish":{"x":32,"y":96},"v_0":{"x":416,"y":32},"v_2":{"x":128,"y":160},"v_3":{"x":320,"y":160},"v_4":{"x":512,"y":160}},"edgeVisualInfo":{"e_0":{},"e_4":{},"e_3":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{}},"minGraph":{"vertexInfo":{"start":{},"v_1":{},"finish":{},"v_0":{},"v_2":{},"v_3":{},"v_4":{}},"edgeInfo":{"e_0":{},"e_4":{},"e_3":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{}},"edgeVertices":{"e_0":["start","v_1"],"e_4":["v_1","v_0"],"e_3":["v_1","v_3"],"e_5":["v_3","v_2"],"e_6":["v_2","v_1"],"e_7":["v_2","finish"],"e_8":["v_0","v_4"],"e_9":["v_4","v_3"],"e_10":["v_3","v_0"]},"directed":true}}',
         graphPaperSize : { "width" : 550, "height" : 180 },
         duration: 500
      },
      old_medium: {
         nbDistinctShapes : 4,
         shapeList : [ 0, 1, 2, 1, 3, 2, 2, 1, 2, 1, 3, 1, 2, 1, 2, 1, 0, 0, 1 ],
         shapeListRaphael : [],
         visualGraph : '{"vertexVisualInfo":{"start":{"x":46,"y":220},"v_1":{"x":224,"y":186},"v_2":{"x":398,"y":176},"v_3":{"x":546,"y":114},"v_4":{"x":404,"y":113},"v_5":{"x":225,"y":115},"v_6":{"x":402,"y":43},"v_7":{"x":225,"y":43},"v_8":{"x":225,"y":257},"v_9":{"x":402,"y":257},"v_10":{"x":545,"y":292},"v_11":{"x":402,"y":363},"v_12":{"x":225,"y":327},"v_13":{"x":224,"y":399},"finish":{"x":47,"y":398}},"edgeVisualInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{}},"minGraph":{"vertexInfo":{"start":{},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"v_6":{},"v_7":{},"v_8":{},"v_9":{},"v_10":{},"v_11":{},"v_12":{},"v_13":{},"finish":{}},"edgeInfo":{"e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{}},"edgeVertices":{"e_0":["start","v_1"],"e_1":["v_1","v_2"],"e_2":["v_2","v_3"],"e_3":["v_3","v_4"],"e_4":["v_4","v_5"],"e_5":["v_5","start"],"e_6":["v_3","v_6"],"e_7":["v_6","v_7"],"e_8":["v_7","start"],"e_9":["start","v_8"],"e_10":["v_8","v_9"],"e_11":["v_9","v_10"],"e_12":["v_10","v_11"],"e_13":["v_11","v_12"],"e_14":["v_12","start"],"e_15":["v_11","v_13"],"e_16":["v_13","start"],"e_17":["start","finish"]},"directed":true}}',
         graphPaperSize : { "width" : 770, "height" : 420 },
         duration: 750
      } */
   };
   var shapes = [ "circle", "star", "triangle", "diamond" ];
   var shapeDimension = {
      width: 37,
      height: 37,
      margin: 6
   };
   var buttonSide = 40;
   var buttonAttr = {
      "stroke": "black",
      "stroke-width": 1,
      "fill": "rgb(200,200,200)",
      "r": 5
   };
   var shapeContainerDimension = new Array();
   var topBarPaperDim = { "width" : 770 };
   var shapeStroke = {
      "stroke" : "none",
      "stroke-width" : "1px"
   };
   var shapeColor = [ '#33514c', '#3f7bcc', '#ff2f17', '#b97a57' ];
   var vertexAttr = {
      r:8,
      stroke:"black",
      "stroke-width":1,
      fill:"black"
   };
   var edgeAttr = {
      "stroke-width":"4",
      "arrow-end":"long-classic-wide"
   };
   var textAttr = {
      "font-size": 16
   };
   var beaverAttr = {
      width : 38,
      height : 38
   };
   var houseAttr = {
      width : 35,
      height : 35
   };
   var circleAttr = {
   };

   var beaver;
   var house;
   var cursor;
   var vGraph;


   var topBar; // bar that contains the instructions
   var sim;
   var castorImgUrl = $("#castor").attr("src");
   var houseImgUrl = $("#house").attr("src");
   var mouseImgUrl = $("#mouse").attr("src");

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      initTopBar();
      initGraph();
      hideFeedBack();
      displayHelper.setValidateString(taskStrings.validateAnswer);
      displayHelper.customValidate = animation;
      if (typeof(enableRtl) != "undefined") {
         $("body").attr("dir", "rtl");
         $(".largeScreen #zone_1").css("float", "right");
         $(".largeScreen #zone_2").css("float", "right");
      }
   };
   
   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var graph = JSON.parse(data[level].visualGraph).minGraph;
      var path = {};
      $.each(graph.edgeVertices, function(id, vertices) {
         path[id] = -1;
      });
      var defaultAnswer = path;
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      // destroy all objects, timers etc. as needed
      if (sim != null) {
         sim.stop();
      }
      callback();
   };

   function getResultAndMessage() {
      return checkPath();
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initShapeContainerDim() {
      shapeContainerDimension.width = (shapeDimension.width+shapeDimension.margin)*data[level].shapeList.length+shapeDimension.margin;
      shapeContainerDimension.height = shapeDimension.width+shapeDimension.margin;
      shapeContainerDimension.openingEdge = 5;
      var h = shapeContainerDimension.height;
      shapeContainerDimension.x = h/2;
      shapeContainerDimension.y = 10+h;
      // Note: height computations above should take into account textAttr["font-size"], which seems to display at the moment "by luck"
   }


   function initTopBar() {
      initShapeContainerDim();
      var h = shapeContainerDimension.height;
      topBarPaperDim.height = shapeContainerDimension.height+1*shapeContainerDimension.y+15;
      subTask.raphaelFactory.destroy("topBar");
      topBar = subTask.raphaelFactory.create("topBar","topBar",topBarPaperDim.width,topBarPaperDim.height);
      topBar.text(0, textAttr["font-size"], taskStrings.instructions).attr(textAttr).attr({"text-anchor": "start"});
      topBar.rect(shapeContainerDimension.x, shapeContainerDimension.y, shapeContainerDimension.width, shapeContainerDimension.height);
      drawShapeList(topBar,shapeContainerDimension);

      initCursor(0);
   };

   function initGraph(){
      subTask.raphaelFactory.destroy("graph");
      var graphPaper = subTask.raphaelFactory.create("graph","graph",data[level].graphPaperSize.width, data[level].graphPaperSize.height);
      var graphDrawer = new SimpleGraphDrawer(vertexAttr,edgeAttr);
      vGraph = VisualGraph.fromJSON(data[level].visualGraph, "vGraph", graphPaper, null, graphDrawer, true);
      graphDrawer.setDrawVertex(drawVertex);
      graphDrawer.setDrawEdge(drawEdge);
      redraw();
   };

   function initImage(vGraph, imgObject, imgUrl, imgAttr, vertexLabel) {
      if (imgObject){ imgObject.remove() };
      var paper = vGraph.getPaper();
      var position = vGraph.getVertexVisualInfo(vertexLabel);
      var w = imgAttr.width;
      var h = imgAttr.height;
      return paper.image(imgUrl, position.x-w/2, position.y-h/2, w, h);
   };

   function initBeaver(vGraph) {
     beaver = initImage(vGraph, beaver, castorImgUrl, beaverAttr, "start");
   }

   function initHouse(vGraph) {
     house = initImage(vGraph, house, houseImgUrl, houseAttr, "finish");
   }


   function initCursor(xStart) {
      if(cursor){cursor.remove()};
      var paper = topBar;
      var w = shapeContainerDimension.height;
      var h = shapeContainerDimension.height;

      var x = xStart + shapeContainerDimension.x-w/2 + h/4;
      var y = shapeContainerDimension.y;
      var arrowSize = 10;

      var line = paper.path("M"+x+" "+y+"V"+(y+h)).attr({"stroke":"black","stroke-width":2});
      var topArr = drawArrow(x-arrowSize/2,y,arrowSize,-1);
      var bottomArr = drawArrow(x-arrowSize/2,(y+h),arrowSize,1);

      cursor = paper.set(line,topArr,bottomArr);
   };

   function drawArrow(x,y,size,dir) {
      var paper = topBar;
      var margin = 0;
      var frameW = size;
      var innerFrameW = frameW-2*margin;
      var baseW = innerFrameW*0.6;
      var arrowTipLength = innerFrameW;
      var cx = x+frameW/2;
      var cy = y+frameW/2;

      var arrow = paper.path("M"+(x+frameW/2)+" "+(y+margin)+
                              "L"+(x+frameW-margin)+" "+(y+margin+arrowTipLength*dir)+
                              "H"+(x+margin+innerFrameW-(innerFrameW-baseW)/2)+
                              "V"+(y+frameW*dir-margin)+
                              "H"+(x+margin+(innerFrameW-baseW)/2)+
                              "V"+(y+margin+arrowTipLength*dir)+
                              "H"+(x+margin)+
                              "Z");

      arrow.attr("fill","black");
      return arrow;
   };

   function drawShapeList(paper,shapeContainer) {
      for(var iShape = 0; iShape<data[level].shapeList.length; iShape++){

         var shPos = {
            x: (shapeDimension.margin*(iShape+1)+shapeDimension.width*iShape+shapeContainer.x+shapeDimension.width/2),
            y: (shapeDimension.margin/2+shapeContainer.y+shapeDimension.height/2)
         }

         drawShape(data[level].shapeList[iShape],paper,shPos);
      }
   };

   function drawShape(shape,paper,pos) {
      if(shape == -1) return null;
      var radius = shapeDimension.width/2;
      if(shape == 0 || shape == 2) radius -= 2;
      if(shape == 0){
         var sh = paper.circle(pos.x, pos.y, radius);
      }else{
         var sh = paper.path(getShapePath(shapes[shape],pos.x, pos.y, radius));
      }
      sh.attr('fill',shapeColor[shape]).attr(shapeStroke);
      return sh;
   };


   // Used in SimpleGraphDrawer to give a different color to the first and last vertices
   function drawVertex(id, info, visualInfo) {
      var pos = this._getVertexPosition(visualInfo);
      this.originalPositions[id] = pos;

      var vertex = this.paper.circle(pos.x, pos.y).attr(this.circleAttr).attr('r',vertexAttr.r-2);
      if(id == "start"){
         vertex.attr('fill','white');
      }
      return [vertex];
   };

   // Used in SimpleGraphDrawer to add shape and click event to the edge
   function drawEdge(id, vertex1, vertex2, vertex1Info, vertex2Info, vertex1VisualInfo, vertex2VisualInfo, edgeInfo, edgeVisualInfo) {
      var path = this._getEdgePath(vertex1, vertex2);
      var clickAreaWidth = 10;
      var edge = this.paper.path(path).attr(this.lineAttr).toBack();
      //var clickArea = this.paper.path(path).attr({"stroke":"transparent","stroke-width":"20","stroke-opacity":"0"}).toBack();
      var center = { "x" : (path[1]+path[4])/2, "y" : (path[2]+path[5])/2 };
      var shapePosition = {
            x: center["x"],
            y: center["y"]
         }
      var set = this.paper.set();
      var button = this.paper.rect(center.x -buttonSide/2,center.y-buttonSide/2,buttonSide,buttonSide).attr(buttonAttr);

      var shape = drawShape(answer[id],this.paper, shapePosition);
      set.push(edge,button,shape);
      var vGraph = this.visualGraph;
      var nbChoices = data[level].nbDistinctShapes + 1;
      set.click(function(){
         answer[id] = (answer[id]+2)%nbChoices - 1; // next choice, including blank choice
         redraw();
         if((sim != undefined) && (sim.isPlaying())){
            sim.stop();
         }
         subTask.resetDisplay();
      });
      return [set];
   };

   function checkFilled(graph) {
      var result = true;
      $.each(graph.edgeVertices, function(id, vertices) {
         if (answer[id] == -1) {
           result = false;
         }
      });
      return result;
   }

   function checkPath() {
      var graph = Graph.fromMinimized(JSON.parse(data[level].visualGraph).minGraph);
      if (! checkFilled(graph)) {
        return { successRate: 0, message: taskStrings.mustFillAll };
      }
      var nextStep = true;
      var iShape = 0;
      var vId = "start";
      while(nextStep){
         var checkNext = checkNextStep(graph,vId,iShape);
         nextStep = checkNext.nextStep;
         vId = checkNext.vId;
         iShape = checkNext.iShape;
         result = checkNext.result;
      }
      return result;
   }

   function checkNextStep(graph,vId,iShape) {
      var result = { successRate: 0, message: taskStrings.errorOneNotGood };
      var nextStep = false;
      var nShapes = data[level].shapeList.length;
      if(vId == "finish") {
        if(iShape == nShapes){
           result = { successRate: 1, message: taskStrings.success };
        } else {
           result = { successRate: 0, message: taskStrings.errorArrivedEarly };
        }
      } else { // (vId != "finish")
         var children = graph.getChildren(vId);
         if (children.length > 1) {
           result.message = taskStrings.errorSeveralNotGood;
         }
         var cpt = 0;
         var nextVertex = "";
         for(var iChild=0; iChild<children.length; iChild++) {
            var edge = graph.getEdgesFrom(vId,children[iChild]);
            if(answer[edge] == data[level].shapeList[iShape]){
               cpt++;
               nextVertex = graph.getEdgeVertices(edge)[1];
            }
         }
         if(cpt > 1){
            result = { successRate: 0, message: taskStrings.errorMultiplePath };
         }else if(cpt == 1){
            nextStep = true;
            vId = nextVertex;
            iShape++;
         }
      }
      return {
         "nextStep" : nextStep,
         "vId" : vId,
         "iShape" : iShape,
         "result" : result
      };
   };

   function animation() {
      var graph = Graph.fromMinimized(JSON.parse(data[level].visualGraph).minGraph);
      var iShape = 0;
      var vId = "start";
      var nextStep = true;
      var iPosition = vGraph.getVertexVisualInfo("start");
      var delayFactory = new DelayFactory();
      sim = new Simulation("sim",delayFactory);
      displayHelper.setValidateString(taskStrings.stopButton);
      displayHelper.customValidate = function(){
         if((sim != undefined) && (sim.isPlaying())){
            sim.stop();
         }
         subTask.resetDisplay();
      };
      if (! checkFilled(graph)) {

        var simActionValidate = {onExec: validate};
        var simEntryValidate = {name: "entry_validate", action: simActionValidate};
        var step = new SimulationStep();
        step.addEntry(simEntryValidate);
        sim.addStep(step);
        nextStep = false;
      }

      while(nextStep){
         var checkNext = checkNextStep(graph,vId,iShape);
         nextStep = checkNext.nextStep;
         var step = new SimulationStep();
         if(nextStep){
            var nextVertex = checkNext.vId;
            var simActionMoveBeaver = {onExec: moveBeaver,duration: data[level].duration, params: { vId: nextVertex}};

            var simActionMovecursor = {onExec: movecursor,duration: data[level].duration, params: {iShape: iShape}};
            var simEntryMove = {name: "entry_move_"+iShape, action: simActionMoveBeaver, delay: 100};

            var simEntryMoveTop = {name: "entry_moveTop_"+iShape, action: simActionMovecursor, delay: 100};
            step.addEntry(simEntryMove);
            step.addEntry(simEntryMoveTop);
            iShape = checkNext.iShape;
            vId = nextVertex;
         }else if(checkNext.result.successRate == 0){
            var simActionDisplayFeedback = {onExec: showFeedback,duration: 100, params: { "text": checkNext.result.message}};
            var simEntryFeedback = {name: "entry_feedback", action: simActionDisplayFeedback};
            step.addEntry(simEntryFeedback);
         }else{
            var simActionValidate = {onExec: validate};
            var simEntryValidate = {name: "entry_validate", action: simActionValidate};
            step.addEntry(simEntryValidate);
         }
         sim.addStep(step);
      }
      sim.setAutoPlay(true);
      sim.play();
   };

   function moveBeaver(params,duration, callback) {
      var position = vGraph.getVertexVisualInfo(params.vId);
      beaver.animate({x:position.x-beaverAttr.width/2,y:position.y-beaverAttr.height/2},duration, callback);
   };


   function movecursor(params,duration, callback) {
      var h = shapeContainerDimension.height;
      var w = shapeDimension.width;
      var m = shapeDimension.margin;
      var translation = (params.iShape == 0) ? (w+m+h/4+m/2) : (w+m);

      cursor.animate({"transform":"...T"+translation+",0"},duration,function() {
         initCursor(params.iShape * (w+m) + (w+m+h/4+m/2));
         callback();
      });
   };


   function showFeedback(params,duration,callback) {
      var string = params.text;
      $("#displayHelper_graderMessage").html(string);
      $("#displayHelper_graderMessage").css("color", "red");
   };

   function hideFeedBack() {
      $("#displayHelper_graderMessage").html("");
   };

   function redraw() {
      vGraph.redraw();
      initBeaver(vGraph);
      initHouse(vGraph);
      initCursor(0);
      hideFeedBack();
   };

   function validate(params,duration,callback) {
      platform.validate("done");
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
