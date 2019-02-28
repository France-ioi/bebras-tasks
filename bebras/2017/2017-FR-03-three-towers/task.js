function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         initial: [[0, 1, 2], [], []],
         target: [[], [], [0, 1, 2]],
         optimal: 5,
         partial: 5
      },
      medium: {
         initial: [[0, 3, 1, 4, 2], [], [], []],
         target: [[], [], [], [0, 1, 2, 3, 4]],
         optimal: 9,
         partial: 10
      },
      hard: {
         initial: [[0, 4], [2], [1, 5], [3, 6]],
         target: [[], [], [], [0, 1, 2, 3, 4, 5, 6]],
         optimal: 13,
         partial: 15
      }
      /* 
      challenge: {
         initial: [[0, 3, 1, 4, 2], [], []],
         target: [[], [], [0, 1, 2, 3, 4]],
         optimal: 11 
      },
      */
   };

   var paper;
   var crane;
   var targetPaper;
   var targetCrane;
   var numBlocks;

   var craneParams = {
      paperWidth: 350,
      blockWidth: 50,
      blockHeight: 50,
      blockAttr: {
         "r": 5
      },
      blockTextAttr: {
         "font-size": 24
      },
      floorHeight: 4,
      separatorWidth: 4,
      ceilingCenterY: 4,
      ceilingHeight: 6,
      ceilingAttr: {
         "stroke-width": 1,
         "stroke":
         "black",
         "fill": "orange"
      },
      magnetPadTop: 20,
      magnetWidth: 50,
      magnetHeight: 50,
      buttonWidth: 40,
      buttonHeight: 40,
      buttonPadTop: 20,
      blockColors: ["red", "lightblue", "yellow", "green", "pink", "cyan", "white", "lightgreen"]
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      crane = new Crane(subTask.simulationFactory, {
         initialBlockState: data[level].initial
      });
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      crane.setActionSequence(answer);
   };
   
   subTask.resetDisplay = function() {
      updateFeedback(null);
      initTargets();
      initPaper();
      initTargetPaper();
      initHandlers();
      updateUndo();
      updateCounter();
   };

   subTask.getAnswerObject = function() {
      answer = crane.getActionSequence();
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return [];
   };

   subTask.unloadLevel = function(callback) {
      if(crane) {
         crane.remove();
      }
      if(targetCrane) {
         targetCrane.remove();
      }
      unbindButtons();
      callback();
   };
   function unbindButtons() {
      $("#undo").unbind("click");
   }

   function initTargets() {
      $("#nbStepsPartial").html(data[level].partial);
      $("#nbStepsOptimal").html(data[level].optimal);
   }

   function initHandlers() {
      unbindButtons();
      $("#undo").click(clickUndo);
   }

   function initPaper() {
      numBlocks = 0;
      for(var column in data[level].initial) {
         numBlocks += data[level].initial[column].length;
      }
      var paperHeight = craneParams.blockHeight * (numBlocks + 0.5) + craneParams.ceilingCenterY + craneParams.magnetPadTop + craneParams.magnetHeight + craneParams.buttonHeight + craneParams.buttonPadTop;
      paper = subTask.raphaelFactory.create("anim", "anim", craneParams.paperWidth, paperHeight);
      crane = new Crane(subTask.simulationFactory, {
         initialBlockState: data[level].initial,
         paper: paper,
         targetMode: false,
         // canDrop: 
         onError: onError,
         onClick: onClick,
         onBlockClick: onBlockClick,
         onSimulationFinish: onSimulationFinish,
         // animTimeVertical: 
         // animTimeHorizontal
         blockWidth: craneParams.blockWidth,
         blockHeight: craneParams.blockHeight,
         blockDrawer: blockDrawer,
         separatorWidth: craneParams.separatorWidth,
         // separatorHeight
         // separatorAttr:
         floorCenterX: craneParams.paperWidth / 2,
         floorCenterY: paperHeight - craneParams.buttonHeight - craneParams.buttonPadTop - 4,
         floorHeight: craneParams.floorHeight,
         // floorAttr:
         ceilingCenterX: craneParams.paperWidth / 2,
         ceilingCenterY: craneParams.ceilingCenterY,
         ceilingWidth: craneParams.paperWidth - 4,
         ceilingHeight: craneParams.ceilingHeight,
         ceilingAttr: craneParams.ceilingAttr,
         magnetWidth: craneParams.magnetWidth,
         magnetHeight: craneParams.magnetHeight,
         magnetImageName: "magnet.png",
         magnetPadTop: craneParams.magnetPadTop,
         // ropeWidth: 
         // ropeAttr
         // buttonWidth
         // buttonHeight
         buttonPadTop: craneParams.buttonPadTop,
         columnTextFunction: columnTextFunction
      });

      crane.draw();
      crane.setActionSequence(answer);
      crane.expediteVisual();
   }

   function initTargetPaper() {
      var paperWidth = (craneParams.blockWidth + craneParams.separatorWidth) * data[level].initial.length + craneParams.separatorWidth;
      var paperHeight = craneParams.blockHeight * numBlocks + craneParams.floorHeight + craneParams.buttonPadTop + craneParams.buttonHeight;

      targetPaper = subTask.raphaelFactory.create("target_anim", "target_anim", paperWidth, paperHeight);
      targetCrane = new Crane(subTask.simulationFactory, {
         initialBlockState: data[level].target,
         paper: targetPaper,
         targetMode: true,
         blockWidth: craneParams.blockWidth,
         blockHeight: craneParams.blockHeight,
         blockDrawer: blockDrawer,
         floorCenterX: paperWidth / 2,
         floorCenterY: paperHeight - craneParams.buttonHeight - craneParams.buttonPadTop,
         buttonPadTop: craneParams.buttonPadTop,
         columnTextFunction: columnTextFunction
      });

      targetCrane.draw();
   }

   function getNbMoves() {
     // We define the displayed number of steps to be the number of drops.
     return Math.floor(crane.getActionCount() / 2);
   }

   function updateCounter() {
      $("#stepCounter").text(getNbMoves());
   }

   function onError(errorType, blockState, column) {
      updateFeedback(taskStrings.pickupError);
   }

   function onBlockClick() {
      updateFeedback(taskStrings.blockClick);
   }

   function onClick() {
      updateFeedback(null);
      updateUndo();
      updateCounter();
   }

   function onSimulationFinish() {
      /* Uncomment to enable automatic validation.*/
      /* We need it, otherwise they go to harder version even if they used too many moves */
      var resultAndMessage = getResultAndMessage();
      if(resultAndMessage.successRate === 1) {
         platform.validate("done");
      }
      else if(resultAndMessage.targetReached) {
         platform.validate("stay");
      }
   }

   function blockDrawer(paper, blockID, centerX, centerY) {
      var leftX = centerX - craneParams.blockWidth / 2;
      var topY = centerY - craneParams.blockHeight / 2;
      var rect = paper.rect(leftX, topY, craneParams.blockWidth, craneParams.blockHeight).attr(craneParams.blockAttr);
      rect.attr({
         fill: craneParams.blockColors[blockID]
      });
      var text = paper.text(centerX, centerY, blockID + 1).attr(craneParams.blockTextAttr);
      text[0].style.cursor = "default";
      return [rect, text];
   }

   function columnTextFunction(column) {
      return String.fromCharCode("A".charCodeAt(0) + column);
   }

   function updateUndo() {
      $("#undo").attr("disabled", !crane.canUndo());
   }

   function clickUndo() {
      crane.undoVisual();
      updateUndo();
      updateCounter();
      updateFeedback(null);
   }

   function updateFeedback(html) {
      if (html === undefined || html === null) {
         html = "";
      }
      $("#feedback").html(html);
   }

   function getResultAndMessage() {
      var blockState = crane.getBlockState();
      if (!Beav.Object.eq(blockState, data[level].target)) {
         return {
            targetReached: false,
            successRate: 0,
            message: taskStrings.error
         };
      }
      var steps = getNbMoves();
      var optimal = data[level].optimal; 
      if (steps <= optimal) {
         return {
            targetReached: true,
            successRate: 1,
            message: taskStrings.success
         };
      }
      var score = 0; 
      if (level == 'medium') {
        if (steps == optimal+1) {
          score = 0.5;
        }
      } else if (level == 'hard') {
        if (steps == optimal+1) {
         score = 0.7;
        } else if (steps == optimal+2) {
         score = 0.5;
        } else if (steps == optimal+3) {
         score = 0.3;
        } 
      }
      return {
         targetReached: true,
         successRate: score,
         message: taskStrings.partial(steps, optimal, level)
      };
   }
   
   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);

