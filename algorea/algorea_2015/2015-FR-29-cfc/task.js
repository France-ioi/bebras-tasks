function initTask() {

   var width = 750;
   var heights = {easy: 320, medium: 290, hard: 390};
   var level = null;
   var answer = null;
   var paper;
   var drawing;
   var message;
   
   var nbColors;
   var nbColorsLevel = {easy: 3, medium: 4, hard: 5};
   var nbColorsInit = 1;
   var nbColorsMax = 6;
   var heightColor = 50;
   var widthColor = 80;
   var radiusColor = 0;
   var color = ["#FF2222", "#597AFF", "#0EE138", "#FFFF00", "#F48A00", "#00FFFF"];
   var colorLabel = [taskStrings.red, taskStrings.blue, taskStrings.green, taskStrings.yellow, taskStrings.organge, taskStrings.t];
   var selectedColor;
   
   var graph;
   var component;
   var graphLevel = {
      easy: { nodes: [{x: 250, y: 50},
                      {x: 220, y: 120},
                      {x: 300, y: 120},
                      {x: 400, y: 90},
                      {x: 400, y: 180},
                      {x: 250, y: 200},
                      {x: 260, y: 280},
                      {x: 340, y: 210}],
              edges: [[2],
                      [0, 5],
                      [1, 3],
                      [4],
                      [3],
                      [6],
                      [7],
                      [5]] },
      medium: { nodes: [{x: 290, y: 50},
                        {x: 290, y: 250},
                        {x: 610, y: 50},
                        {x: 50, y: 150},
                        {x: 210, y: 150},
                        {x: 450, y: 150},
                        {x: 610, y: 250},
                        {x: 130, y: 50},
                        {x: 130, y: 250},
                        {x: 370, y: 150},
                        {x: 450, y: 250},
                        {x: 530, y: 150},
                        {x: 450, y: 50}],
                edges: [[4, 7],
                        [4, 5],
                        [6],
                        [4],
                        [3, 9],
                        [0, 2, 9, 11],
                        [5],
                        [3, 8],
                        [3, 1],
                        [10], 
                        [11],
                        [12],
                        [9]] },
      hard: { nodes: [{x: 320, y: 30},
                      {x: 400, y: 30},
                      {x: 320, y: 110},
                      {x: 400, y: 190},
                      {x: 240, y: 190},
                      {x: 240, y: 270},
                      {x: 160, y: 270},
                      {x: 160, y: 350},
                      {x: 320, y: 270},
                      {x: 80, y: 270},
                      {x: 80, y: 350},
                      {x: 80, y: 110},
                      {x: 480, y: 110},
                      {x: 160, y: 190},
                      {x: 480, y: 270}],
              edges: [[1],
                      [3],
                      [0, 3, 4, 8, 12],
                      [0],
                      [3, 0],
                      [4, 6, 8],
                      [9, 10],
                      [5, 6, 9],
                      [3, 13],
                      [11], 
                      [7, 9],
                      [2],
                      [3, 14],
                      [9],
                      [3, 8]] }
   };
   
   task.load = function(views, callback) {      
      answer = task.getDefaultAnswerObject();
      displayHelper.setupLevels();
      callback();
   };

   task.unload = function(callback) {
      callback();
   };
   
   var selectColor = function(idColor) {
      if (selectedColor != null)
         drawing.colors[selectedColor].attr("stroke-width", 2);
      drawing.colors[idColor].attr("stroke-width", 4);
      selectedColor = idColor;
   };
   
   var drawEdge = function(from, to) {
      var angle = Math.atan2(graph.nodes[to].y - graph.nodes[from].y,
                             graph.nodes[to].x - graph.nodes[from].x);
      var x1 = Math.round(graph.nodes[from].x + 20 * Math.cos(angle));
      var x2 = Math.round(graph.nodes[to].x - 20 * Math.cos(angle));
      var y1 = Math.round(graph.nodes[from].y + 20 * Math.sin(angle));
      var y2 = Math.round(graph.nodes[to].y - 20 * Math.sin(angle));
      paper.path("M" + x1 + "," + y1 + "L" + x2 + "," + y2)
           .attr("stroke-width", 2)
           .attr("arrow-end", "classic-wide-long");
   }
   
   var getMessageForAnswer = function(curAnswer, curLevel, component) {
      var nbRestant = curAnswer.length;
      for (var i=0; i < curAnswer.length; i++) {
         if (curAnswer[i] != null) {
            nbRestant--;
         }
      }
      var notColored = (nbRestant > 0);
      var wrongSameColor = false;
      var wrongDifferentColor = false;
      var nodes = graphLevel[curLevel].nodes;
      for (var i=0; i < nodes.length; i++) {
         for (var j = i + 1; j < nodes.length; j++) {
            if (curAnswer[i] != null
             && curAnswer[i] == curAnswer[j]
             && (!component[i][j] || !component[j][i])) {
               wrongSameColor = true;
            }
            if (curAnswer[i] != null && curAnswer[j] != null
             && curAnswer[i] != curAnswer[j]
             && (component[i][j] && component[j][i])) {
               wrongDifferentColor = true;
            }
         }
      }
      
      var message = "";
      if (notColored) {
         message += taskStrings.stillNbPlanets(nbRestant)
      }
      if (!notColored || level == "easy") {
         if (wrongSameColor) {
            if (message != "") {
               message += "<br />";
            }
            message += taskStrings.errorSameColor;
         }
         if (wrongDifferentColor) {
            if (message != "") {
               message += "<br />";
            }
            message += taskStrings.errorDifferentColor;
         }
      }
      return message;
   }

   var colorNode = function(id) {
      if (answer[level][id] == selectedColor) {
         answer[level][id] = null;
         drawing.nodes[id].attr("fill", "#EEEEEE");
         drawing.nodes[id].label.attr("text", "");
      } else {
         answer[level][id] = selectedColor;
         drawing.nodes[id].attr("fill", color[selectedColor]);
         drawing.nodes[id].label.attr("text", colorLabel[selectedColor]);
      }
      /*
      var message = getMessageForAnswer(answer[level], level, component);
      if (message == "") {
         platform.validate("done");
      } else {
         displayHelper.validate("stay");
      }
      */
   }
   
   var buildComponent = function(curLevel) {
      var nodes = graphLevel[curLevel].nodes;
      var edges = graphLevel[curLevel].edges;
      var component = Array(nodes.length);
      for (var i=0; i < nodes.length; i++) {
         component[i] = Array(nodes.length); 
         for (var j = 0; j < nodes.length; j++) {
            component[i][j] = false;
         }
         for (var j = 0;  j < edges[i].length; j++) {
            component[i][edges[i][j]] = true;
         }
      }
      
      for (var p=0; p< nodes.length; p++) {
         for (var d=0; d< nodes.length; d++) {
            for (var f=0; f< nodes.length; f++) {
              if (component[d][p] && component[p][f]) {
                component[d][f] = true;
              }
            }
         }
      }
      return component;
   }
   
   var buildDisplay = function() {
      drawing = { colors: [], nodes: [] };
      paper = Raphael("display", width, heights[level]);
      selectedColor = null;
      
      drawing.colors = Array(nbColors);
      for (var i=0; i<nbColors; i++) {
         drawing.colors[i] = paper.rect(width - widthColor - 10, 20 + (10 + heightColor) * i, widthColor, heightColor, radiusColor)
                                  .attr("stroke-width", 2)
                                  .attr("fill", color[i])
                                  .click(function(event) { selectColor(this.id) } );
         drawing.colors[i].label = paper.text(width - widthColor/2 - 10, 20 + heightColor/2 + (10 + heightColor) * i, colorLabel[i])
                                        .attr("font-size", 20)
                                        .click(function(event) { selectColor(this.id) } );
         $(drawing.colors[i].label.node).css({
            "-webkit-touch-callout": "none",
            "-webkit-user-select": "none",
            "-khtml-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none",
            "cursor" : "default"
         });;
         drawing.colors[i].id = i;
         drawing.colors[i].label.id = i;
      }
      
      drawing.nodes = Array(graph.length);
      for (var i=0; i<graph.nodes.length; i++) {
         drawing.nodes[i] = paper.circle(graph.nodes[i].x, graph.nodes[i].y, 20)
                                 .attr("stroke-width", 2)
                                 .attr("fill", "#EEEEEE")
                                 .click( function(event) { colorNode(this.id) } );
         drawing.nodes[i].label = paper.text(graph.nodes[i].x, graph.nodes[i].y, "")
                                       .attr("font-size", 18)
                                       .click( function(event) { colorNode(this.id) } );
         $(drawing.nodes[i].label.node).css({
            "-webkit-touch-callout": "none",
            "-webkit-user-select": "none",
            "-khtml-user-select": "none",
            "-moz-user-select": "none",
            "-ms-user-select": "none",
            "user-select": "none",
            "cursor" : "default"
         });;
         drawing.nodes[i].id = i;
         drawing.nodes[i].label.id = i;
         for (var j=0; j<graph.edges[i].length; j++)
            drawEdge(i, graph.edges[i][j]);
      }
   }

   task.getDefaultStateObject = function() {
      return { level: "easy" };
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;
      graph = graphLevel[level];
      nbColors = nbColorsLevel[level];
      component = buildComponent(level);
      if (display) {
         if (paper != null)
            paper.remove();
         buildDisplay();
      }
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };
   
   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      for (var i=0; i<graph.nodes.length; i++)
         if (answer[level][i] != null) {
            drawing.nodes[i].attr("fill", color[answer[level][i]]);
            drawing.nodes[i].label.attr("text", colorLabel[answer[level][i]]);
         } else {
            drawing.nodes[i].attr("fill", "#EEEEEE");
            drawing.nodes[i].label.attr("text", "");
         }
   };

   task.getAnswerObject = function() {
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      var res = {};
      for (var lvl in graphLevel) {
         res[lvl] = Array(graphLevel[lvl].nodes.length);
         for (var i=0; i<graphLevel[lvl].nodes.length; i++)
            res[lvl][i] = null;
      }
      return res;
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      var answer = $.parseJSON(strAnswer);
      var taskParams = displayHelper.taskParams;
      var scores = {};
      var messages = {};
      var maxScores = displayHelper.getLevelsMaxScores();

      // clone the state to restore after grading.
      var oldState = $.extend({}, task.getStateObject());
      for (var curLevel in graphLevel) {
         state.level = curLevel;
         task.reloadStateObject(state, false);
         var component = buildComponent(curLevel);
         var message = getMessageForAnswer(answer[curLevel], curLevel, component);
         if (message == "") {
            scores[curLevel] = maxScores[curLevel];
            messages[curLevel] = taskStrings.success;
         } else {
            scores[curLevel] = 0;
            messages[curLevel] = message;
         }
      }
      task.reloadStateObject(oldState, false);
      if (gradedLevel == null) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}

initTask();
