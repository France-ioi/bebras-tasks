function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         graph: { 
            "vertexInfo": { 
               "00":{}, "01":{}, "02":{}, "03":{}, "04":{}, "05":{}, "06":{}, "07":{}, "08":{}, "09":{}, "10":{}, 
               "11":{}, "12":{} },
            "edgeInfo": { 
               "00_02":{}, "00_04":{}, "00_06":{}, "01_02":{}, "02_03":{}, "03_04":{}, "04_05":{}, "05_06":{}, "06_01":{}, "01_07":{}, 
               "07_08":{}, "08_09":{}, "09_10":{}, "10_11":{}, "11_12":{}, "12_07":{}, "02_08":{}, "03_09":{}, "04_10":{}, "05_11":{}, 
               "06_12":{} },
            "edgeVertices": { 
               "00_02": ["00","02"], "00_04": ["00","04"], "00_06": ["00","06"], "01_02": ["01","02"], "02_03": ["02","03"],
               "03_04": ["03","04"], "04_05": ["04","05"], "05_06": ["05","06"], "06_01": ["06","01"], "01_07": ["01","07"],
               "07_08": ["07","08"], "08_09": ["08","09"], "09_10": ["09","10"], "10_11": ["10","11"], "11_12": ["11","12"],
               "12_07": ["12","07"], "02_08": ["02","08"], "03_09": ["03","09"], "04_10": ["04","10"], "05_11": ["05","11"],
               "06_12": ["06","12"] },
            "directed": false 
         },
         vertexPos: { 
            "00":{ "x":172,"y":162 }, 
            "01":{ "x":171,"y":91 }, 
            "02":{ "x":233,"y":129 }, 
            "03":{ "x":232,"y":203 },
            "04":{ "x":171,"y":241 }, 
            "05":{ "x":103,"y":203 }, 
            "06":{ "x":103,"y":123 }, 
            "07":{ "x":173,"y":22 },
            "08":{ "x":309,"y":99 }, 
            "09":{ "x":309,"y":233 }, 
            "10":{ "x":170,"y":311 },
            "11":{ "x":35,"y":229 }, 
            "12":{ "x":37,"y":83 }
         },
         maxGuests: 7,
         paperWidth: 345,
         paperHeight: 335
      },
      medium: {
         graph: { 
            "vertexInfo": { 
               "00":{}, "01":{}, "02":{}, "03":{}, "04":{}, "05":{}, "06":{}, "07":{}, "08":{}, "09":{}, "10":{}, 
               "11":{}, "12":{} },
            "edgeInfo": { 
               "11_05":{}, "11_02":{}, "12_08":{}, "12_07":{}, "07_08":{}, "05_02":{}, "02_01":{}, "05_03":{}, "03_01":{}, "08_06":{}, 
               "06_04":{}, "04_07":{}, "02_00":{}, "00_03":{}, "05_00":{}, "09_05":{}, "03_09":{}, "07_09":{}, "01_06":{}, "09_06":{},
               "10_06":{}, "10_07":{}, "08_10":{}, "03_04":{}, "04_08":{} },
            "edgeVertices": { 
               "11_05": ["11","05"], "11_02": ["11","02"], "12_08": ["12","08"], "12_07": ["12","07"], "07_08": ["07","08"],
               "05_02": ["05","02"], "02_01": ["02","01"], "05_03": ["05","03"], "03_01": ["03","01"], "08_06": ["08","06"],
               "06_04": ["06","04"], "04_07": ["04","07"], "02_00": ["02","00"], "00_03": ["00","03"], "05_00": ["05","00"],
               "09_05": ["09","05"], "03_09": ["03","09"], "07_09": ["07","09"], "01_06": ["01","06"], "04_08": ["04","08"],
               "10_06": ["10","06"], "10_07": ["10","07"], "08_10": ["08","10"], "03_04": ["03","04"], "09_06": ["09","06"] },
            "directed": false 
         },
         vertexPos: { 
            "00":{ "x":130,"y":90 }, 
            "01":{ "x":65,"y":37 }, 
            "02":{ "x":43,"y":116 }, 
            "03":{ "x":184,"y":74 },
            "04":{ "x":234,"y":63 }, 
            "05":{ "x":126,"y":161 }, 
            "06":{ "x":324,"y":39 }, 
            "07":{ "x":263,"y":216 },
            "08":{ "x":367,"y":135 }, 
            "09":{ "x":189,"y":226 }, 
            "10":{ "x":295,"y":149 },
            "11":{ "x":90,"y":212 }, 
            "12":{ "x":402,"y":192 }
         },
         maxGuests: 7,
         paperWidth: 450,
         paperHeight: 280
      },
      hard: {
         graph: { 
            "vertexInfo": { 
               "00":{}, "01":{}, "02":{}, "03":{}, "04":{}, "05":{}, "06":{}, "07":{}, "08":{}, "09":{}, "10":{}, 
               "11":{}, "12":{}, "13":{}, "14":{}, "15":{}, "16":{} },
            "edgeInfo": { 
               "00_01":{}, "00_10":{}, "01_02":{}, "01_09":{}, "02_03":{}, "02_07":{}, "02_08":{}, "03_07":{}, "03_04":{}, "03_08":{}, 
               "04_05":{}, "05_06":{}, "05_16":{}, "06_07":{}, "06_16":{}, "07_08":{}, "08_09":{}, "08_16":{}, "09_10":{}, "10_11":{}, 
               "10_12":{}, "10_16":{}, "11_12":{}, "12_13":{}, "12_14":{}, "12_16":{}, "13_14":{}, "14_15":{}, "14_16":{}, "15_16":{} },
            "edgeVertices": { 
               "00_01": ["00","01"], "00_10": ["00","10"], "01_02": ["01","02"], "01_09": ["01","09"], "02_03": ["02","03"],
               "02_07": ["02","07"], "02_08": ["02","08"], "03_07": ["03","07"], "03_04": ["03","04"], "03_08": ["03","08"],
               "04_05": ["04","05"], "05_06": ["05","06"], "05_16": ["05","16"], "06_07": ["06","07"], "06_16": ["06","16"],
               "07_08": ["07","08"], "08_09": ["08","09"], "08_16": ["08","16"], "09_10": ["09","10"], "10_11": ["10","11"],
               "10_12": ["10","12"], "10_16": ["10","16"], "11_12": ["11","12"], "12_13": ["12","13"], "12_14": ["12","14"],
               "12_16": ["12","16"], "13_14": ["13","14"], "14_15": ["14","15"], "14_16": ["14","16"], "15_16": ["15","16"] },
            "directed": false 
         },
         vertexPos: { 
            "00":{ "x": 252, "y": 18 }, 
            "01":{ "x": 133, "y": 24 }, 
            "02":{ "x": 80, "y": 73 }, 
            "03":{ "x": 28, "y": 132 },
            "04":{ "x": 48, "y": 207 }, 
            "05":{ "x": 210, "y": 259 }, 
            "06":{ "x": 162, "y": 204 }, 
            "07":{ "x": 102, "y": 172 },
            "08":{ "x": 170, "y": 115 }, 
            "09":{ "x": 206, "y": 63 }, 
            "10":{ "x": 258, "y": 108 },
            "11":{ "x": 351, "y": 73 }, 
            "12":{ "x": 325, "y": 145 }, 
            "13":{ "x": 405, "y": 160 },
            "14":{ "x": 350, "y": 210 },  
            "15":{ "x": 293, "y": 259 },
            "16":{ "x": 233, "y": 170 } 
         },
         maxGuests: 8,
         paperWidth: 450,
         paperHeight: 280
      }
   };
   var paper;
   var paperWidth;
   var paperHeight;
   var graph;
   var vGraph;
   var graphMouse;
   var vertexToggler;
   var vertexAttr = {
      r:15,
      "stroke-width": 2, 
      stroke: "black", 
      fill: "white"
   };
   var selectedAttr = {
      fill: "#AAAAFF"
   };
   var edgeAttr = {
      "stroke-width": 1.2, 
      stroke: "black"
   };
   var maxGuests;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      graph = Graph.fromJSON(JSON.stringify(data[level].graph));
      maxGuests = data[level].maxGuests;
      paperWidth = data[level].paperWidth;
      paperHeight = data[level].paperHeight;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };

   subTask.resetDisplay = function() {
      paper = subTask.raphaelFactory.create("graph_task","graph_task",paperWidth,paperHeight);
      initGraph();
      updateMessage();
      $("#error").html("");
      reloadAnswer();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [];
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      callback();
   };

   function getResultAndMessage() {
      var nbGuests = answer.length;
      if(nbGuests === 0){
         return { success: 0, message: taskStrings.click }
      }
      if(checkNeighbors()){
         return { success: 0, message: taskStrings.neighbors }
      }
      if(nbGuests < (maxGuests - 1)){
         return { success: 0, message: taskStrings.notEnough }
      }
      if(nbGuests === (maxGuests - 1)){
         return { successRate: 0.5, message: taskStrings.partialSuccess(nbGuests) };
      }else{
         return { successRate: 1, message: taskStrings.success };
      }
   };

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initGraph() {
      var graphDrawer = new SimpleGraphDrawer(vertexAttr,edgeAttr);
      vGraph = new VisualGraph("vGraph", paper, graph, graphDrawer, true);
      initVertexPos();
      vGraph.redraw();
      graphMouse = new GraphMouse("graphMouse", graph, vGraph);
      vertexToggler = new VertexToggler("vTog", graph, vGraph, graphMouse, vertexToggle, true);
   }

   function initVertexPos() {
      for(var id in data[level].vertexPos){
         var posX = data[level].vertexPos[id].x;
         var posY = data[level].vertexPos[id].y;
         vGraph.setVertexVisualInfo(id,{"x":posX,"y":posY});
      }
   }

   function vertexToggle(id,selected) {
      $('#error').html("");
      if(selected){
         var attr = selectedAttr;
         answer.push(id);
      }else{
         var attr = vertexAttr;
         removeFromAnswer(id);
      }
      if(checkNeighbors()){
        $('#error').html(taskStrings.warning); 
      }else if(answer.length === maxGuests){
         platform.validate("done");
      }
      vGraph.getRaphaelsFromID(id)[0].attr(attr);
      updateMessage();
   }

   function removeFromAnswer(id) {
      for(var iAnswer = 0; iAnswer < answer.length; iAnswer++){
         if(answer[iAnswer] === id){
            answer.splice(iAnswer,1);
            break;
         }
      }
   }

   function checkNeighbors() {
      for(var iAnswer = 0; iAnswer < answer.length; iAnswer++){
         for(var jAnswer = iAnswer + 1; jAnswer < answer.length; jAnswer++){
            if(graph.hasNeighbor(answer[iAnswer],answer[jAnswer]))
               return true;
         }
      }
      return false;
   }

   function updateMessage() {
      $('#info').html(taskStrings.numberOfGuests(answer.length));
   }

   function reloadAnswer() {
      for(var iAns = 0; iAns < answer.length; iAns++) {
         vGraph.getRaphaelsFromID(answer[iAns])[0].attr(selectedAttr);
         graph.setVertexInfo(answer[iAns],{selected:true});
      }
      if(checkNeighbors()){
        $('#error').html(taskStrings.warning);
     }
   }
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
