function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         source: 4,
         heard: [0,5],
         notHeard: [2], 
         solution: 6,
         visualGraphJSON: {
            "vertexVisualInfo": {
               "v_2":{"x":67,"y":160},
               "v_3":{"x":145,"y":237},
               "v_5":{"x":354,"y":237},
               "v_6":{"x":249,"y":160},
               "v_7":{"x":171,"y":59},
               "v_8":{"x":249,"y":84},
               "v_9":{"x":354,"y":34}
            },
            "edgeVisualInfo": {
               "e_4":{}, "e_5":{}, "e_6":{}, "e_7":{}, "e_8":{}, "e_9":{}, "e_10":{}, "e_11":{}, "e_12":{}, "e_13":{}
            },
            "minGraph": {
               "vertexInfo": {
                  "v_2":{},"v_3":{},"v_5":{},"v_6":{},"v_7":{},"v_8":{},"v_9":{}
               },
               "edgeInfo": {
                  "e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{}, "e_13":{}
               },
               "edgeVertices": { 
                  "e_4":["v_3","v_6"],"e_5":["v_5","v_3"],
                  "e_6":["v_9","v_5"],"e_7":["v_2","v_3"],"e_8":["v_6","v_2"],"e_9":["v_8","v_6"],"e_10":["v_7","v_2"],"e_11":["v_7","v_8"],
                  "e_12":["v_7","v_9"], "e_13":["v_6","v_9"]
               },
               "directed":true
            }
         },
         paperW: 421,
         paperH: 270
      },
      medium: {
         source: 0,
         heard: [1,9],
         notHeard: [5,6], 
         solution: 3,
         visualGraphJSON: {
            "vertexVisualInfo": {
               "v_0":{"x":67,"y":313},
               "v_1":{"x":249,"y":313},
               "v_2":{"x":67,"y":160},
               "v_3":{"x":145,"y":237},
               "v_4":{"x":249,"y":237},
               "v_5":{"x":354,"y":237},
               "v_6":{"x":249,"y":160},
               "v_7":{"x":171,"y":59},
               "v_8":{"x":249,"y":84},
               "v_9":{"x":354,"y":34}
            },
            "edgeVisualInfo": {
               "e_0":{}, "e_1":{}, "e_2":{}, "e_3":{}, "e_4":{}, "e_5":{}, "e_6":{}, "e_7":{}, "e_8":{}, "e_9":{}, "e_10":{}, "e_11":{}, "e_12":{}, "e_13":{}
            },
            "minGraph": {
               "vertexInfo": {
                  "v_0":{},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"v_6":{},"v_7":{},"v_8":{},"v_9":{}
               },
               "edgeInfo": {
                  "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_9":{},"e_10":{},"e_11":{},"e_12":{}, "e_13":{}
               },
               "edgeVertices": { 
                  "e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_2":["v_3","v_0"],"e_3":["v_3","v_4"],"e_4":["v_3","v_6"],"e_5":["v_4","v_5"],
                  "e_6":["v_5","v_9"],"e_7":["v_2","v_3"],"e_8":["v_6","v_2"],"e_9":["v_6","v_8"],"e_10":["v_2","v_7"],"e_11":["v_7","v_8"],
                  "e_12":["v_8","v_9"], "e_13":["v_6","v_9"]
               },
               "directed":true
            }
         },
         paperW: 421,
         paperH: 348  
      },
      hard: {
         source: 8,
         heard: [7,4],
         notHeard: [3,11], 
         solution: 0,
         visualGraphJSON: {
            "vertexVisualInfo":{
               "v_0":{"x":96,"y":416},
               "v_1":{"x":288,"y":416},
               "v_2":{"x":96,"y":224},
               "v_3":{"x":416,"y":512},
               "v_4":{"x":416,"y":416},
               "v_5":{"x":192,"y":320},
               "v_6":{"x":288,"y":320},
               "v_7":{"x":416,"y":320},
               "v_8":{"x":288,"y":224},
               "v_9":{"x":288,"y":128},
               "v_10":{"x":169,"y":82},
               "v_11":{"x":288,"y":32},
               "v_12":{"x":413,"y":81}
            },
            "edgeVisualInfo":{
               "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_10":{},
               "e_9":{},"e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_18":{},"e_19":{},"e_12":{},
               "e_11":{},"e_20":{}
            },
            "minGraph":{
               "vertexInfo":{
                  "v_0":{},"v_1":{},"v_2":{},"v_3":{},"v_4":{},"v_5":{},"v_6":{},"v_7":{},"v_8":{},"v_9":{},
                  "v_10":{},"v_11":{},"v_12":{}
               },
               "edgeInfo":{
                  "e_0":{},"e_1":{},"e_2":{},"e_3":{},"e_4":{},"e_5":{},"e_6":{},"e_7":{},"e_8":{},"e_10":{},"e_9":{},
                  "e_13":{},"e_14":{},"e_15":{},"e_16":{},"e_17":{},"e_18":{},"e_19":{},"e_12":{},"e_11":{},"e_20":{}
               },
               "edgeVertices":{
                  "e_0":["v_0","v_1"],"e_1":["v_0","v_2"],"e_2":["v_2","v_5"],"e_3":["v_5","v_0"],"e_4":["v_1","v_3"],
                  "e_5":["v_1","v_4"],"e_6":["v_3","v_4"],"e_7":["v_5","v_6"],"e_8":["v_6","v_4"],"e_10":["v_7","v_12"],
                  "e_9":["v_6","v_7"],"e_13":["v_2","v_10"],"e_14":["v_10","v_9"],"e_15":["v_10","v_11"],"e_16":["v_9","v_12"],
                  "e_17":["v_11","v_12"],"e_18":["v_8","v_9"],"e_19":["v_8","v_12"],"e_12":["v_2","v_8"],"e_11":["v_8","v_5"],
                  "e_20":["v_7","v_8"]
               },
               "directed":true
            }
         },
         paperW: 512,
         paperH: 550    
      }
   };

   var paper;
   var paperW;
   var paperH;

   var graph;
   var vGraph;
   var graphDrawer;
   var visualGraphJSON;
   var rng;

   var names = [
     "Mounira",
     "Nicolas",
     "Kevin",
     "Angela",
     "Farid",
     "Boris",
     "Nathan",
     "Yamina",
     "Anna",
     "Hasna",
     "Barbara",
     "Daniela",
     "Clara"
   ];
   var source;
   var heard;
   var notHeard;
   var solution;

   var vertexAttr = {
      r: 15,
      "stroke-width": 2,
      stroke: "blue",
      fill: "white"
   };
   var edgeAttr = {
      "stroke-width": 3,
      "arrow-end": "long-classic-wide"
   };
   var vertexLabelAttr = {
      "font-size": 16,
      "font-weight": "bold"
   };

   subTask.loadLevel = function (curLevel) {
      level = curLevel;
      source = data[level].source;
      heard = data[level].heard;
      notHeard = data[level].notHeard;
      solution = data[level].solution;
      paperW = data[level].paperW;
      paperH = data[level].paperH;
      visualGraphJSON = JSON.stringify(data[level].visualGraphJSON);
      rng = new RandomGenerator(subTask.taskParams.randomSeed);
   };

   subTask.getStateObject = function () {
      return state;
   };

   subTask.reloadAnswerObject = function (answerObj) {
      answer = answerObj;
      if(answer){
         rng.reset(answer.seed);
      }
   };

   subTask.resetDisplay = function () {
      displayError("");
      initPaper();
      initGraph();
      initMultipleChoice();
      if(!answer.waitForRetry){
         initHandlers();
         displayHelper.setValidateString(taskStrings.validate);
         displayHelper.customValidate = checkResult;
      }else{
         displayHelper.setValidateString(taskStrings.retry);
         displayHelper.customValidate = retry;
         displayError(taskStrings.failure);
      }
      displayHelper.confirmRestartAll = false;
   };

   subTask.getAnswerObject = function () {
      return answer;
   };

   subTask.getDefaultAnswerObject = function () {
      var defaultAnswer = { 
         missingID: null, 
         names: JSON.parse(JSON.stringify(names)), 
         seed: rng.nextInt(1,10000),
         waitForRetry: false 
      };
      rng.shuffle(defaultAnswer.names);
      return defaultAnswer;
   };

   function getResultAndMessage() {
      var result = checkResult(true);
      return result;
   }

   subTask.unloadLevel = function (callback) {
      callback();
   };

   subTask.getGrade = function (callback) {
      callback(getResultAndMessage());
   };

   function initPaper() {
      paper = subTask.raphaelFactory.create("paper","paper",paperW,paperH);
      $("#paper").css("width", paperW);
   };

   function initGraph() {
      var graphDrawer = new SimpleGraphDrawer(vertexAttr,edgeAttr,null,true);
      graphDrawer.setVertexLabelAttr(vertexLabelAttr);

      vGraph = VisualGraph.fromJSON(visualGraphJSON, "vGraph", paper, null, graphDrawer, true);
      graph = vGraph.graph;
      setNames();
      vGraph.redraw();
      fixNamePos();
   };

   function initMultipleChoice() {
      var html = "<table>";
      for(var iLine = 0; iLine < 2; iLine++){
         html += "<tr>"
         for(var iName = 0; iName < names.length/2; iName++){
            var id = iName + iLine*Math.floor(names.length/2);
            var name = names[id];
            html += "<td><input type=\"radio\" name=\"names\" id=\""+id+"\""
            html += (answer.missingID == id) ? " checked" : "";
            html += "><label for=\""+id+"\">"+name+"</label></td>";
         }
         html += "</tr>";
      }
      html += "</table>";
      $("#checkboxes").empty();
      $("#checkboxes").html(html);
   };

   function initHandlers() {
      $("#checkboxes input").change(function(ev){
         displayError("");
         var checked = $(this).is(":checked");
         var id = $(this).attr("id");
         answer.missingID = id;
      })
   };

   function setNames() {
      var vertices = graph.getAllVertices();
      for(var iVertex = 0; iVertex < vertices.length; iVertex++){
         var vertex = vertices[iVertex];
         var info = graph.getVertexInfo(vertex);
         info.label = answer.names[iVertex];
      }
      var sourceHtml = "<b>"+answer.names[source]+"</b>";
      $("#source").html(sourceHtml);
      var heardHtml = taskStrings.names(answer.names[heard[0]],answer.names[heard[1]]);
      $("#heard").html(heardHtml);
      var notHeardHtml = (notHeard.length < 2) ? "<b>"+answer.names[notHeard[0]]+"</b>" : taskStrings.names(answer.names[notHeard[0]],answer.names[notHeard[1]]);
      $("#notHeard").html(notHeardHtml);
   };

   function fixNamePos() {
      var vertices = graph.getAllVertices();
      for(var iVertex = 0; iVertex < vertices.length; iVertex++){
         var vertex = vertices[iVertex];
         var raphObj = vGraph.getRaphaelsFromID(vertex);
         var text = raphObj[1];
         var dx = 0, dy = 0;
         var cx = raphObj[0].attr("cx");
         var cy = raphObj[0].attr("cy");
         if(level != "hard"){
            switch(vertex){
               case "v_0":
               case "v_1":
               case "v_4":
               case "v_5":
                  dy = 25;
                  break;
               case "v_7":
               case "v_9":
                  dy = -25;
                  break;
               case "v_2":
                  text.attr("text-anchor","end");
                  dy = -25;
                  break;
               case "v_3":
                  text.attr("text-anchor","start");
                  dy = 25;
                  break;
               case "v_6":
                  text.attr("text-anchor","start");
                  dy = 25;
                  dx = 10;
                  break;
               case "v_8":
                  text.attr("text-anchor","end");
                  dy = 25;
                  dx = -15;
            }
         }else{
            switch(vertex){
               case "v_0":
               case "v_3":
               case "v_11":
               case "v_7":
                  dy = 25;
                  break;
               case "v_1":
               case "v_6":
               case "v_10":
               case "v_12":
                  dy = -25;
                  break;
               case "v_2":
                  text.attr("text-anchor","end");
                  dy = -25;
                  break;
               case "v_5":
                  text.attr("text-anchor","start");
                  dy = 25;
                  dx = 10;
                  break;
               case "v_8":
                  text.attr("text-anchor","start");
                  dx = 25;
                  break;
               case "v_9":
                  text.attr("text-anchor","end");
                  dy = 20;
                  dx = -10;   
                  break;
               case "v_4":
                  text.attr("text-anchor","start");
                  dy = -25;           
            }
         }
         text.attr("y",cy + dy);
         text.attr("x",cx + dx);
      }
   };

   function checkResult(noVisual) {
      var error = null;
      if(answer.missingID == null){
         var error = taskStrings.check;
         if(!noVisual){
            displayError(error);
         }
         return { successRate: 0, message: error };
      }else if(Beav.Array.indexOf(answer.names,names[answer.missingID]) != solution){
         var error = taskStrings.failure;
         if(!noVisual){
            displayError(error);
            answer.waitForRetry = true;
            displayHelper.setValidateString(taskStrings.retry);
            displayHelper.customValidate = retry;
            $("#checkboxes input").off("change");
         }
         return { successRate: 0, message: error };
      }

      if(!noVisual){
         platform.validate("done");
      }
      return { successRate: 1, message: taskStrings.success };
   };

   function retry() {
      answer.waitForRetry = false;
      displayHelper.restartAll();
   };

   function displayError(msg) {
      $("#error").html(msg);
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
