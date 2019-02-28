function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         walls: [
            "##########",
            "#.#......#",
            "#........#",
            "###..#...#",
            "#....#...#",
            "#.......##",
            "#........#",
            "#.#.......",
            "##########" ],
         startPos: [[1,1],[7,1]],
         solution: [ 0, 1, 2, 1, 2, 3, 2, 1 ] 
      },
      medium: {
         walls: [
            "##########",
            "#.#......#",
            "#........#",
            "###..#...#",
            "#....#...#",
            "#.......##",
            "#........#",
            "#.#..#....",
            "##########" ],
         startPos: [[1,1],[7,1]],
         solution: [ 0, 1, 0, 1, 2, 1, 2, 3, 2, 1, 2, 1 ] 
      },
      hard: {
         walls: [
            "##########",
            "#.#.....##",
            "#........#",
            "#.#..#...#",
            "#....#...#",
            "#......###",
            "##.......#",
            "##.#.#.#..",
            "##########" ],
         startPos: [[1,1],[5,1]],
         solution: [ 1, 0, 3, 2, 1, 2, 1, 0, 3, 2, 1, 2, 1 ] 
      }
   };

   var borderSize = 2;
   var movingTime = 300;
   var speedFactor = 2;
   var cellSize = 30;

   var nbMarbles = 2;
   var nbLines = 9
   var nbColumns = 10;
   var walls;
   var startPos;
   var margin = 10;
   var animTime = 300;
   var animDelay = 600;
   var marbles = [];
   var curSimulation;

   var paperLaby;  
   var paperWidth = 380;
   var paperHeight = 400;
   var dragAndDrop;
   var placeWidth = 140;
   var placeHeight = 24;
   var nbPlaces = 14;
   var nbRec = 0;
   var curStep = 0;

   var texts = [
      taskStrings.up,
      taskStrings.right,
      taskStrings.down,
      taskStrings.left
   ];
   
   var playModes = {
      stopped: 0,
      playing: 1,
      paused: 2,
      stepByStep: 3
   };
   var playMode = 0;

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      walls = data[level].walls;
      startPos = data[level].startPos;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer){
      }
   };

   subTask.resetDisplay = function() {
      curSimulation = initSimulation();
      createLaby();
      drawLaby();
      initButtons();
      reloadAnswer();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var defaultAnswer = [0, 2, 1, 3, 0];
      return defaultAnswer;
   };

   subTask.unloadLevel = function(callback) {
      stopAnimation();
      if(dragAndDrop) {
         dragAndDrop.disable();
      }
      callback();
   };

   function getResultAndMessage() {
      var result;
      var simulation = initSimulation();
      var iStep = 0;
      var nbSteps = 0;
      while ((iStep < answer.length) && (answer[iStep] != null)) {
         updateMarblesPos(simulation, answer[iStep], false);
         iStep++;
      }
      if (simulation.nbArrivees == 2) {
         result = { successRate: 1, message: taskStrings.success };
      } else if (simulation.nbArrivees == 1) {
         result = { successRate: 0.5, message: taskStrings.partialFailure };
      } else {
         result = { successRate: 0, message: taskStrings.failure };
      }
      return result;
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };

   function initSimulation() {
      var pos = [[0,0],[0,0]];
      for (var iMarble = 0; iMarble < nbMarbles; iMarble++) {
         pos[iMarble] = [startPos[iMarble][0], startPos[iMarble][1]];
      }
      return {
         pos: pos,
         iArrivee: [0, 0],
         nbArrivees: 0 };
   };

   function initButtons() {
      $("#play, #step, #restart").off("click");
      $("#play").click(play);
      $("#step").click(step);
      $("#restart").click(resetLaby);
   };

   var updateMarblesPos = function(simulation, dir, updateDisplay) {
      var pos = simulation.pos;
      var delta = [[-1, 0], [0, 1], [1, 0], [0, -1]];
      var diff = delta[dir][0] * (pos[0][0] - pos[1][0]) + delta[dir][1] * (pos[0][1] - pos[1][1]);
      for (var rankMarble = 0; rankMarble < nbMarbles; rankMarble++) {
         var iMarble = rankMarble;
         if (diff < 0) {
            iMarble = 1 - iMarble;
         }
         var lin = pos[iMarble][0];
         var col = pos[iMarble][1];
         while((col != nbColumns - 1) && (walls[lin + delta[dir][0]].charAt(col + delta[dir][1]) != '#')) {
            var newLin = lin + delta[dir][0];
            var newCol = col + delta[dir][1];

            if ((newCol == pos[1 - iMarble][1]) && (newLin == pos[1 - iMarble][0])) {
               if (simulation.iArrivee[1 - iMarble] == 0) {
                  break;
               }
            }
         
            col = newCol;
            lin = newLin;
            if (col == nbColumns-1) { // La bille sort
               simulation.iArrivee[iMarble] = 2 - simulation.nbArrivees;
               simulation.nbArrivees++;
               if (updateDisplay) {
                  marbles[iMarble].toFront();
               }
               break;
            }
         }
         pos[iMarble][0] = lin;
         pos[iMarble][1] = col;
      }
   }

   var tilt = function(dir) {
      updateMarblesPos(curSimulation, dir, true);
      for (var iMarble = 0; iMarble < nbMarbles; iMarble++) {
         animMarble(iMarble);
      }
   };

   var stopAnimation = function() {
      subTask.delayFactory.destroy("play");
      for (var iMarble = 0; iMarble < nbMarbles; iMarble++) {
         subTask.raphaelFactory.destroy("anim"+iMarble);
      }
   };

   function resetLaby() {
      playMode = playModes.stopped;
      stopAnimation();
      displayHelper.stopShowingResult();
      curStep = 0;
      curSimulation = initSimulation();
      for (var iMarble = 0; iMarble < nbMarbles; iMarble++) {
         animMarble(iMarble);
      }
      $(".play, .step").removeAttr('disabled');
   }

   var executeStep = function() {
      var validate = false;
      var prg = dragAndDrop.getObjects('seq');
      if ((curStep >= prg.length) || (prg[curStep] == null) || (curSimulation.nbArrivees == 2)) {
         if (playModes.playing) {
            playMode = playModes.stopped;
            validate = true;
         }
      } else {
         var dir = prg[curStep];
         tilt(dir);
         curStep++;
         if (curSimulation.nbArrivees == 2) {
            validate = true;
         }
         if (prg[curStep] == null) {
            $(".step").attr('disabled', 'disabled');
         }
      }
      if (playMode != playModes.playing){
         subTask.delayFactory.destroy("play");
      }
      if (validate) {
         if (curSimulation.nbArrivees == 2) {
            platform.validate("done");
         } else {
            displayHelper.validate("stay");
         }
      }
   }

   function step() {
      if (playMode != playModes.stepByStep) {
         resetLaby();   
      }
      $(".play").attr('disabled', 'disabled');
      playMode = playModes.stepByStep;
      executeStep();
   }

   function play() {
      if (playMode == playModes.stop) {
         executeStep();
      } else {
         resetLaby();
      }
      $(".play, .step").attr('disabled', 'disabled');
      playMode = playModes.playing;
      subTask.delayFactory.createInterval("play",executeStep, animDelay);
   }

   var animMarble = function(iMarble) {
      var centreX = margin + curSimulation.pos[iMarble][1] * cellSize + cellSize/2 + curSimulation.iArrivee[iMarble] * cellSize;	
      var centreY = margin + curSimulation.pos[iMarble][0] * cellSize + cellSize/2;	

      var anim;
      if (curSimulation.pos[iMarble][1] == nbColumns)
         anim = Raphael.animation({'cx' : centreX, 'cy' : centreY}, animTime);
      else
         anim = Raphael.animation({'cx' : centreX, 'cy' : centreY}, animTime, 'bounce');
      subTask.raphaelFactory.animate("anim"+iMarble,marbles[iMarble],anim);
   };


   function drawCommand(paper, id) {
      var rect = paper.rect(-placeWidth/2, -placeHeight/2, placeWidth, placeHeight, placeHeight/5).attr('fill', '#E0E0F8');
      var text = paper.text(0, 0, texts[id]).attr({'font-size': 16, 'font-weight': 'bold'});
      var cover = paper.rect(-placeWidth/2, -placeHeight/2, placeWidth, placeHeight).attr({'fill': '#FF0000', 'opacity': 0, 'transparent': true});
       $(text.node).css({
         "-webkit-touch-callout": "none",
         "-webkit-user-select": "none",
         "-khtml-user-select": "none",
         "-moz-user-select": "none",
         "-ms-user-select": "none",
         "user-select": "none",
         "cursor" : "default"
      });
      var commandElt = paper.set();
      commandElt.push(rect, text, cover);
      return commandElt;
   };

   var createLaby = function() {
      paperLaby = subTask.raphaelFactory.create("laby","laby", (nbColumns + 2) * cellSize + 2 * margin, nbLines * cellSize + 2 * margin);

      //Quadrillage
      var setRectGrille = paperLaby.set();
      for (var iLig = 0; iLig < nbLines; iLig++) {
         for (var iCol = 0; iCol < nbColumns; iCol++) {
            var rect = paperLaby.rect(margin + iCol * cellSize, margin + iLig * cellSize, cellSize, cellSize);
            var fill = '#ffffff';
            if (walls[iLig].charAt(iCol) == '#') {
               fill = '#808080';
            }
            rect.attr({'stroke': '#000000', 'fill': fill});
            setRectGrille.push(rect);
         }
      }

      var couleurBille = ['#0000ff', '#ff0000'];

      //Billes
      marbles = new Array();
      for (var iMarble = 0; iMarble < nbMarbles; iMarble++) {
         var yCentre = margin + startPos[iMarble][0] * cellSize + cellSize / 2;
         var xCentre = margin + startPos[iMarble][1] * cellSize + cellSize / 2;
         marbles[iMarble] = paperLaby.circle(xCentre, yCentre, cellSize / 2 - cellSize / 20);
         marbles[iMarble].attr({'fill' : couleurBille[iMarble]});
      }
   }

   var drawLaby = function() {
      paper = subTask.raphaelFactory.create("anim","anim",paperWidth, paperHeight);

      paper.text(paperWidth / 4, 15, taskStrings.availableCommands).attr({'font-size':16, 'font-weight': 'bold'});
      paper.text(3 * paperWidth / 4, 15, taskStrings.yourProgram).attr({'font-size':16, 'font-weight': 'bold'});


      //DragAndDropSystem
      dragAndDrop = DragAndDropSystem({
         paper : paper,
         canBeTaken : function(contId, pos) { 
            return true; 
         },
         actionIfDropped : function(srcCont, srcPos, dstCont, dstPos, dropType) {
            if (dstCont == null) {
               return true;
            }
            if (dstCont == 'seq') {
               if (srcCont == 'seq') {
                  if (dstPos < nbRec) {
                     return true;
                  } else {
                     return { dstCont: dstCont, dstPos: nbRec - 1, dropType: dropType };
                  }
               } else {
                  if (dstPos <= nbRec) {
                     return true;
                  } else {
                     return { dstCont: dstCont, dstPos: nbRec, dropType: dropType };
                  }
               }
            }
            return false;
         },
         drop : function(srcContId, srcPos, dstContId, dstPos, type) {
            answer = dragAndDrop.getObjects('seq');
            if (dstContId == 'seq') {
               nbRec++;
            }
            if (srcContId == 'seq') {
               nbRec--;
            }
            if (dstPos == undefined) {
               return;
            }
            if (dstPos < curStep) {
               resetLaby();
            } else if (playMode == playModes.stepByStep) {
               $(".step").removeAttr('disabled');
            }
         }	
      });

      var backgroundTarget = paper.rect(-placeWidth/2,-placeHeight/2,placeWidth,placeHeight)
                            .attr('fill', '#F0F0FF');
      var receiver = dragAndDrop.addContainer({
         ident : 'seq',
         cx : 3 * paperWidth / 4, cy: 200,
         widthPlace : placeWidth, 
         heightPlace : placeHeight,
         nbPlaces : nbPlaces,
         direction : 'vertical',
         placeBackgroundArray : [backgroundTarget],
         dropMode : 'insertBefore',
         dragDisplayMode : 'preview'
      });
      
      var perlImage = [
         drawCommand(paper, 0),
         drawCommand(paper, 1),
         drawCommand(paper, 2),
         drawCommand(paper, 3)
      ];

      for (var iSource = 0; iSource < 4; iSource++)
      {
         dragAndDrop.addContainer({
            ident : iSource,
            cx : 90,
            cy: 70*(1+iSource),
            widthPlace : placeWidth,
            heightPlace : placeHeight,
            type : 'source',
            placeBackgroundArray : [],
            sourceElemArray : [perlImage[iSource]]
         });
      }
   };

   var reloadAnswer = function() {
      var prg = dragAndDrop.getObjects('seq');
      for (var iObject = 0; iObject < prg.length; iObject++) {
         if (prg[iObject] != null) {
            dragAndDrop.removeObject('seq', iObject);
         }
      }
      nbRec = 0;
      for (var iObject = 0; iObject < answer.length; iObject++) {
         var id = answer[iObject];
         if (id != null) {
            var element = [drawCommand(paper, id)];
            dragAndDrop.insertObject('seq', nbRec, {ident : id, elements : element });
            nbRec++;
         }
      }
      resetLaby();
   };

};
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
