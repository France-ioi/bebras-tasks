function initTask() {
   'use strict';
   var level;
   var answer = null;
   var state = null;
   var data = {
      easy: {
         horses: 9,
         race: 3,
         optimal: 4,
         target: 1
      },
      medium: {
         horses: 9,
         race: 3,
         optimal: 5,
         target: 2
      },
      hard: {
         horses: 9,
         race: 3,
         optimal: 6,
         target: 3
      }
   };
   var horseColors = {
      0: "black",
      1: "#505050",
      2: "brown",
      3: "darkblue",
      4: "darkgreen",
      5: "#800000",
      6: "#556B2F",
      7: "#4B0082",
      8: "purple"
   };
   var horseLetters = {
      0: "A",
      1: "B",
      2: "C",
      3: "D",
      4: "E",
      5: "F",
      6: "G",
      7: "H",
      8: "I"
   };

   var paper;
   var paperParams = {
      width: 770,
      height: 560,
      canvasAttr: {
         width: 530,
         height: 450,
         x: 230,
         y: 2
      },
      validateAttr: {
         width: 200,
         height: 30,
         x: 545,
         y: 185
      }
   };
   var horseLetterSize = 26;
   var historyParams = {
      width: 180, // LATER: unused?
      x: 25,
      titleOffsetY: 0,
      horseSize: 35,
      verticalSpace: 15,
      horizontalSpace: 30,
      bottomY: 400,
      titleAttr: {
         "font-size": 20,
         "fill": "black",
         "text": taskStrings.pastRaces,
         x: 96
      },
      horseLetterAttr: {
         fill: "#888888",
         "font-size": horseLetterSize
      },
      horseBorderAttr: {
         fill: "none",
         "stroke": "#888888",
         "stroke-width": 3
      },
      slotAttr: {
         "font-size": 20,
         y: 460
      },
      separatorAttr: {
         width: 0.5,
         fill: "black",
         height: 0
      }
   };
   var podiumParams = {
      slotWidth: 70,
      heights: {
         1: 100,
         2: 75,
         3: 50
      },
      bottomRightX: 750,
      bottomRightY: 180,
      pathAttr: {
         "fill": "#8cc3eb",
         "stroke": "black"
      },
      slotPositions: {
         1: {
            x: 620,
            y: 20
         },
         2: {
            x: 550,
            y: 45
         },
         3: {
            x: 690,
            y: 70
         }
      },
      slotAttr: {
         width: 54,
         height: 54
      },
      textAttr: {
         "font-size": 24,
         "font-weight": 600
      },
      textOffsetY: 80,
      snap: 40
   };
   var racePanel = {
      startButton: null,
      prepareText: null,
      slotSquares: [],
      horses: null
   };
   var racePanelParams = {
      startButton: {
         x: 210,
         y: 490,
         width: 150,
         height: 30,
         text: taskStrings.launch
      },
      prepareText: {
         x: 470,
         y: 505,
         "font-size": 16
      },
      maxRaceText: {
         x: 455,
         y: 505,
         text: taskStrings.maxRacesReached,
         "font-size": 16
      },
      slot: {
         x: 585,
         y: 480,
         width: 54,
         height: 54
      },
      slotPadding: 10
   };
   var horseParams = {
      width: 54,
      height: 54,
      image: "horse.png",
      textOffset: {
         x: 40,
         y: 40
      },
      elements: [
         "background",
         "image",
         "letter",
         "selection",
         "tag"
      ],
      selection: {
         width: 54,
         height: 54,
         "stroke": "#aa0000",
         "stroke-width": 5
      },
      letterAttr: {
         "fill": "white",
         "font-size": horseLetterSize,
         "stroke": "black",
         "stroke-width": 1,
         "font-weight": 700
      },
      tagAttr: {
         "font-size": 16, 
         "font-weight": 600,
         fill: "black"
      },
      tagOffset: {
         x: 8,
         y: 8
      },
      placeHolderLetterAttr: {
         fill: "#aaaaaa",
         "font-size": horseLetterSize
      },
      placeHolderBorderAttr: {
         fill: "none",
         "stroke": "#aaaaaa",
         "stroke-width": 3
      },
      repelDistance: 10,
      repelLimit: 10,
      repelRandomOffset: 5,
      dragThreshold: 5
   };
   var horseMax = {
      x: paperParams.canvasAttr.x + paperParams.canvasAttr.width - horseParams.width,
      y: paperParams.canvasAttr.y + paperParams.canvasAttr.height - horseParams.height
   };
   var horseMinPos = {
      x: paperParams.canvasAttr.x,
      y: paperParams.canvasAttr.y
   };
   var startLineParams = {
      padding: 10,
      x: 720,
      y: 480
   };
   var finishLineX = 15;
   var horses;
   var permutation;
   var maxRaces = 9; // 12

   var taskSeed;
   var numSeeds = 50;
   var currentSeedOffsets = {
      easy: 0,
      medium: 0,
      hard: 0
   };
   var randomGenerator;

   var podium;
   var podiumSlots;

   var historyPanel = {
      title: null,
      races: null
   };

   var validateButton;

   var simulation;
   var sortedHorses;
   var animPreparing = 600;
   var animRacing = [200, 400, 600, 800, 1000];

   task.load = function(views, callback) {
      platform.getTaskParams('randomSeed', null, function(randomSeed) {
         taskSeed = randomSeed;
         randomGenerator = new RandomGenerator(taskSeed);

         // displayHelper.hideValidateButton = true;
         displayHelper.setupLevels();

         if (views.solutions) {
            $("#solution").show();
         }

         callback();
      });
   };

   task.getDefaultStateObject = function() {
      return {
         level: "easy"
      };
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;

      if (display) {
         initPaper();
      }
   };

   task.reloadAnswerObject = function(answerObj) {
      stopExecution();
      answer = answerObj;
      loadPermutation();
      loadHorsesPositions();
      loadHistory();
      loadRacePanel();
      bindHorsesMouseEvents();
   };

   task.getAnswerObject = function() {
      saveHorsesPositions();
      return answer;
   };

   task.getDefaultAnswerObject = function() {

      currentSeedOffsets[level]++;
      currentSeedOffsets[level] %= numSeeds;

      return {
         easy: {
            seed: 1000 + taskSeed + currentSeedOffsets.easy,
            positions: {
               0: {
                  x: 250,
                  y: 250
               },
               1: {
                  x: 350,
                  y: 250
               },
               2: {
                  x: 450,
                  y: 250
               },
               3: {
                  x: 550,
                  y: 250
               },
               4: {
                  x: 650,
                  y: 250
               },
               5: {
                  x: 300,
                  y: 350
               },
               6: {
                  x: 400,
                  y: 350
               },
               7: {
                  x: 500,
                  y: 350
               },
               8: {
                  x: 600,
                  y: 350
               }
            },
            podium: {},
            races: [[0,1,2],[3,4,5],[6,7,8]]
         },
         medium: {
            seed: 2000 + taskSeed + currentSeedOffsets.medium,
            positions: {
               0: {
                  x: 250,
                  y: 250
               },
               1: {
                  x: 350,
                  y: 250
               },
               2: {
                  x: 450,
                  y: 250
               },
               3: {
                  x: 550,
                  y: 250
               },
               4: {
                  x: 650,
                  y: 250
               },
               5: {
                  x: 300,
                  y: 350
               },
               6: {
                  x: 400,
                  y: 350
               },
               7: {
                  x: 500,
                  y: 350
               },
               8: {
                  x: 600,
                  y: 350
               }
            },
            podium: {},
            races: [[0,1,2],[3,4,5],[6,7,8]]
         },
         hard: {
            seed: 3000 + taskSeed + currentSeedOffsets.hard,
            positions: {
               0: {
                  x: 250,
                  y: 250
               },
               1: {
                  x: 350,
                  y: 250
               },
               2: {
                  x: 450,
                  y: 250
               },
               3: {
                  x: 550,
                  y: 250
               },
               4: {
                  x: 650,
                  y: 250
               },
               5: {
                  x: 300,
                  y: 350
               },
               6: {
                  x: 400,
                  y: 350
               },
               7: {
                  x: 500,
                  y: 350
               },
               8: {
                  x: 600,
                  y: 350
               }
            },
            podium: {},
            races: [[0,1,2],[3,4,5],[6,7,8]]
         }
      };
   };

   task.unload = function(callback) {
      stopExecution();
      callback();
   };

   var initPaper = function() {
      if (paper) {
         if (validateButton) {
            validateButton.remove();
         }
         if(racePanel.startButton) {
            racePanel.startButton.remove();
         }
         paper.remove();
      }
      paper = new Raphael("anim", paperParams.width, paperParams.height);
      initCanvas();
      initHorses();
      initRacePanel();
      initHistory();
      initPodium();
      //initValidate();
      initDrag();      
   };

   var initCanvas = function() {
      paper.rect().attr(paperParams.canvasAttr);
   };

   var initHorses = function() {
      horses = [];
      for (var iHorse = 0; iHorse < data[level].horses; iHorse++) {
         horses.push(drawHorse(iHorse, 0, 0));
      }
   };

   var initHistory = function() {
      historyPanel.title = paper.text().attr(historyParams.titleAttr);
      historyPanel.title.attr("text", "");

      var iSlot;
      for(iSlot = 0; iSlot < data[level].race; iSlot++) {
         var text = paper.text().attr(historyParams.slotAttr);
         text.attr({text: taskStrings.arrival[iSlot] });
         text.attr({x: historyParams.x + iSlot * (historyParams.horseSize + historyParams.horizontalSpace) + historyParams.horseSize / 2});
         text.hide();
         historyPanel["slot" + iSlot] = text;
      }

      /*
      historyPanel.separators = {};
      for(iSlot = 0; iSlot < data[level].race - 1; iSlot++) {
         var separator = paper.rect().attr(historyParams.separatorAttr);
         separator.attr({x: historyParams.x + iSlot * (historyParams.horseSize + historyParams.horizontalSpace) + historyParams.horseSize + historyParams.horizontalSpace / 2});
         historyPanel.separators[iSlot] = separator;
      }
      */
   };

   /*var initValidate = function() {
      validateButton = new Button(paper, paperParams.validateAttr.x, paperParams.validateAttr.y, paperParams.validateAttr.width, paperParams.validateAttr.height, "Valider ma réponse");
      validateButton.click(validate);
   };*/

   var loadPermutation = function() {
      permutation = getRandomPermutation(data[level].horses, answer[level].seed);
   };

   var getRandomPermutation = function(size, seed) {
      var result = [];
      for (var index = 0; index < size; index++) {
         result.push(index);
      }
      var generator = new RandomGenerator(seed);
      generator.shuffle(result);
      return result;
   };

   var loadHorsesPositions = function() {
      for (var iHorse in horses) {
         setHorsePosition(horses[iHorse], answer[level].positions[iHorse], true, true);
      }
   };

   var setHorsePosition = function(horse, position, updateCanvas, forceCanvas) {
      var x = position.x;
      var y = position.y;
      if(forceCanvas) {
         x = Math.min(horseMax.x, Math.max(horseMinPos.x, x));
         y = Math.min(horseMax.y, Math.max(horseMinPos.y, y));
         horse.placeHolderRect.attr({x: x, y: y});
         horse.placeHolderLetter.attr({x: x + horseParams.width / 2, y: y + horseParams.height / 2});
      }
      if(updateCanvas) {
         horse.canvasPosition = {
            x: x,
            y: y
         };
      }
      horse.image.attr({
         x: x,
         y: y
      });
      horse.background.attr({
         x: x,
         y: y
      });
      horse.letter.attr({
         x: x + horseParams.textOffset.x,
         y: y + horseParams.textOffset.y
      });
      if (horse.selection) {
         horse.selection.attr({
            x: x,
            y: y
         });
      }
      if (horse.tag) {
         horse.tag.attr({
            x: x + horseParams.tagOffset.x,
            y: y + horseParams.tagOffset.y
         });
      }
   };

   var getHorsePositions = function(horse) {
      var x = horse.image.attrs.x;
      var y = horse.image.attrs.y;
      return {
         x: x,
         y: y
      };
   };

   var saveHorsesPositions = function() {
      for (var iHorse in horses) {
         answer[level].positions[iHorse] = horses[iHorse].canvasPosition;
      }
   };

   var drawHorse = function(index, x, y) {
      var horse = {
         index: index
      };
      horse.background = paper.rect(x, y, horseParams.width, horseParams.height).attr("fill", horseColors[index]);
      horse.image = paper.image(horseParams.image, x, y, horseParams.width, horseParams.height);
      horse.letter = paper.text(x, y, horseLetters[index]).attr(horseParams.letterAttr);
      horse.letter[0].style.cursor = "default";

      horse.placeHolderLetter = paper.text(x + horseParams.width / 2, y + horseParams.height / 2, horseLetters[index]).attr(horseParams.placeHolderLetterAttr).toBack();
      horse.placeHolderRect = paper.rect(x, y, horseParams.width, horseParams.height).attr(horseParams.placeHolderBorderAttr).toBack();

      setHorsePosition(horse, {
         x: x,
         y: y
      });
      return horse;
   };

   var initPodium = function() {
      if (podium) {
         podium.remove();
      }
      var path = ["M", podiumParams.bottomRightX, podiumParams.bottomRightY,
         "L", podiumParams.bottomRightX - 3 * podiumParams.slotWidth, podiumParams.bottomRightY,
         "L", podiumParams.bottomRightX - 3 * podiumParams.slotWidth, podiumParams.bottomRightY - podiumParams.heights[2],
         "L", podiumParams.bottomRightX - 2 * podiumParams.slotWidth, podiumParams.bottomRightY - podiumParams.heights[2],
         "L", podiumParams.bottomRightX - 2 * podiumParams.slotWidth, podiumParams.bottomRightY - podiumParams.heights[1],
         "L", podiumParams.bottomRightX - podiumParams.slotWidth, podiumParams.bottomRightY - podiumParams.heights[1],
         "L", podiumParams.bottomRightX - podiumParams.slotWidth, podiumParams.bottomRightY - podiumParams.heights[3],
         "L", podiumParams.bottomRightX, podiumParams.bottomRightY - podiumParams.heights[3],
         "Z"
      ];
      podium = paper.path(path).attr(podiumParams.pathAttr);

      var iSlot;
      for(iSlot in podiumSlots) {
         if (podiumSlots[iSlot]) {
            podiumSlots[iSlot].remove();
         }
      }
      podiumSlots = {};
      for (iSlot = 1; iSlot <= data[level].target; iSlot++) {
         podiumSlots[iSlot] = paper.rect().attr(podiumParams.slotAttr);
         podiumSlots[iSlot].attr("x", podiumParams.slotPositions[iSlot].x);
         podiumSlots[iSlot].attr("y", podiumParams.slotPositions[iSlot].y);

         paper.text(podiumParams.slotPositions[iSlot].x + podiumParams.slotAttr.width / 2, podiumParams.slotPositions[iSlot].y + podiumParams.textOffsetY, iSlot).attr(podiumParams.textAttr);
      }
      paper.text(podiumParams.bottomRightX - 1.5 * podiumParams.slotWidth, podiumParams.bottomRightY - 20, taskStrings.podium).attr(podiumParams.textAttr).attr({"font-size": 16});
      // {"font-size": 16, "font-weight": "bold"}
   };

   var loadHistory = function() {
      for (var iElement in historyPanel.races) {
         if (historyPanel.races[iElement]) {
            historyPanel.races[iElement].remove();
         }
      }
      historyPanel.title.attr({
         y: historyParams.bottomY + historyParams.titleOffsetY - answer[level].races.length * (historyParams.horseSize + historyParams.verticalSpace)
      });

      if(answer[level].races.length > 0) {
         historyPanel.title.attr("text", historyParams.titleAttr.text);
         for (var iSlot = 0; iSlot < data[level].race; iSlot++) {
            historyPanel["slot" + iSlot].show();
         }
      }
      else {
         historyPanel.title.attr("text", "");
         for (var iSlot = 0; iSlot < data[level].race; iSlot++) {
            historyPanel["slot" + iSlot].hide();
         }
      }

      /*
      for(var iSlot in historyPanel.separators) {
         historyPanel.separators[iSlot].attr({
            y: historyParams.bottomY - (answer[level].races.length - 1) * (historyParams.horseSize + historyParams.verticalSpace),
            height: answer[level].races.length * (historyParams.horseSize + historyParams.verticalSpace)
         });
      }
      */

      historyPanel.races = {};
      for (var iRace in answer[level].races) {
         var result = getRaceResult(answer[level].races[iRace], permutation);
         for (var index in result) {
            var x = historyParams.x + index * (historyParams.horseSize + historyParams.horizontalSpace);
            var y = historyParams.bottomY - (answer[level].races.length - 1 - iRace) * (historyParams.horseSize + historyParams.verticalSpace);
            var iHorse = result[index];
            var border = paper.rect().attr(historyParams.horseBorderAttr);
            border.attr({
               x: x,
               y: y,
               width: historyParams.horseSize,
               height: historyParams.horseSize
            });
            var letter = paper.text().attr(historyParams.horseLetterAttr);
            letter.attr({
               text: horseLetters[result[index]]
            });
            letter.attr({
               x: x + historyParams.horseSize / 2,
               y: y + historyParams.horseSize / 2
            });

            historyPanel.races["race_" + iRace + "_index_" + index + "_border"] = border;
            historyPanel.races["race_" + iRace + "_index_" + index + "_letter"] = letter;
         }
      }
   };

   var initRacePanel = function() {
      racePanel.startButton = new Button(paper, racePanelParams.startButton.x, racePanelParams.startButton.y, racePanelParams.startButton.width, racePanelParams.startButton.height, racePanelParams.startButton.text);
      racePanel.startButton.click(clickStart);

      racePanel.prepareText = paper.text().attr(racePanelParams.prepareText);
      racePanel.prepareText.attr("text", taskStrings.prepareRaceText(data[level].race));
      racePanel.maxRaceText = paper.text().attr(racePanelParams.maxRaceText).hide();
      racePanel.maxRaceText.attr("text", racePanelParams.maxRaceText.text.replace(/#/g, maxRaces));

      clearRace();
      racePanel.slotSquares = [];
      for (var iSlot = 0; iSlot < data[level].race; iSlot++) {
         var slot = paper.rect().attr(racePanelParams.slot);
         slot.attr("x", racePanelParams.slot.x + iSlot * (racePanelParams.slot.width + racePanelParams.slotPadding));
         racePanel.slotSquares.push(slot);
      }
   };

   var loadRacePanel = function() {
      racePanel.prepareText.show();
      racePanel.maxRaceText.hide();
      racePanel.startButton.disable();
      racePanel.startButton.show();
      setSlotsDisplay(true);
      clearRace();
      checkMaxRaces();
   };

   var clearRace = function() {
      racePanel.horses = {};
      racePanel.raceSize = 0;
   };

   var applyHorseRaphael = function(horse, funcName, argsList) {
      if (!argsList) {
         argsList = [];
      }
      for (var iElement in horseParams.elements) {
         var elementName = horseParams.elements[iElement];
         if (horse[elementName]) {
            horse[elementName][funcName].apply(horse[elementName], argsList);
         }
      }
   };

   var setSlotsDisplay = function(display) {
      for (var iSlot in racePanel.slotSquares) {
         if (display) {
            racePanel.slotSquares[iSlot].show();
         } else {
            racePanel.slotSquares[iSlot].hide();
         }
      }
   };

   var initDrag = function() {
      bindHorsesMouseEvents();

      clearRace();
      untagHorses();
      racePanel.startButton.disable();

      racePanel.prepareText.show();
      racePanel.maxRaceText.hide();
      setSlotsDisplay(true);
   };

   var bindHorsesMouseEvents = function() {
      unbindHorsesMouseEvents();
      for (var iHorse in horses) {
         applyHorseRaphael(horses[iHorse], "drag", [horseDragMove(iHorse), horseDragStart(iHorse), horseDragEnd(iHorse)]);
      }
   };

   var unbindHorsesMouseEvents = function() {
      for (var iHorse in horses) {
         applyHorseRaphael(horses[iHorse], "undrag");
      }
   };

   var horseDragStart = function(iHorse) {
      var handler = function() {
         var horse = horses[iHorse];
         horse.originalX = horse.image.attrs.x;
         horse.originalY = horse.image.attrs.y;
         horse.maxDiffX = 0;
         horse.maxDiffY = 0;
         applyHorseRaphael(horse, "toFront");
         horse.fromPodium = undefined;

         for (var iSlot in podiumSlots) {
            if(answer[level].podium[iSlot] === iHorse) {
               horse.fromPodium = iSlot;
               break;
            }
         }
         racePanel.prepareText.attr("text", taskStrings.prepareRaceText(data[level].race));
      };
      return handler;
   };

   var horseDragMove = function(iHorse) {
      var horse = horses[iHorse];
      var handler = function(dx, dy) {
         if (isNaN(dx) || isNaN(dy)) {
            return;
         }

         var x = horse.originalX + dx;
         var y = horse.originalY + dy;
         horse.maxDiffX = Math.max(Math.abs(dx), horse.maxDiffX);
         horse.maxDiffY = Math.max(Math.abs(dy), horse.maxDiffY);
         var iSlot;

         for (iSlot in podiumSlots) {
            if (checkSnap(x, y, podiumParams.slotPositions[iSlot].x, podiumParams.slotPositions[iSlot].y, podiumParams.snap)) {
               if (!answer[level].podium[iSlot] || answer[level].podium[iSlot] === iHorse) {
                  x = podiumParams.slotPositions[iSlot].x;
                  y = podiumParams.slotPositions[iSlot].y;
                  answer[level].podium[iSlot] = iHorse;
               }
            } else {
               if (answer[level].podium[iSlot] === iHorse) {
                  delete answer[level].podium[iSlot];
               }
            }
         }

         if(answer[level].races.length < maxRaces && (horse.fromPodium === undefined)) {
            for (iSlot in racePanel.slotSquares) {
               if (checkSnap(x, y, racePanel.slotSquares[iSlot].attrs.x, racePanel.slotSquares[iSlot].attrs.y, podiumParams.snap)) {
                  if(racePanel.horses[iSlot] && racePanel.horses[iSlot] !== iHorse) {
                     continue;
                  }

                  x = racePanel.slotSquares[iSlot].attrs.x;
                  y = racePanel.slotSquares[iSlot].attrs.y;
                  if (racePanel.horses[iSlot] !== iHorse) {
                     racePanel.horses[iSlot] = iHorse;
                     racePanel.raceSize++;
                     onRaceChange();
                  }
               } else {
                  if (racePanel.horses[iSlot] === iHorse) {
                     delete racePanel.horses[iSlot];
                     racePanel.raceSize--;
                     onRaceChange();
                  }
               }
            }
         }

         setHorsePosition(horse, {
            x: x,
            y: y
         });
      };
      return handler;
   };

   var checkSnap = function(horseX, horseY, targetX, targetY, snapDistance) {
      return Math.abs(horseX - targetX) < snapDistance && Math.abs(horseY - targetY) < snapDistance;
   };

   var horseDragEnd = function(iHorse) {
      var horse = horses[iHorse];
      var handler = function() {
         var jHorse;
         var inRace = false;
         var raceSlot = null;
         var x = horse.image.attrs.x;
         var y = horse.image.attrs.y;
         for(jHorse in racePanel.horses) {
            if(racePanel.horses[jHorse] === iHorse) {
               inRace = true;
               raceSlot = jHorse;
               break;
            }
         }
          
         var cannotRaceFromPodium = "Cannot put horse from\nthe podium on a race";

         if(checkSnap(horse.originalX + horse.maxDiffX, horse.originalY + horse.maxDiffY, horse.originalX, horse.originalY, horseParams.dragThreshold)) {
            if(inRace) {
               setHorsePosition(horse, horse.canvasPosition);
               delete racePanel.horses[raceSlot];
               racePanel.raceSize--;
               onRaceChange();
               return;
            }
            if(isHorseOutside(horse)) {
               setHorsePosition(horse, horse.canvasPosition);
               onRaceChange();
               return;
            }
            else if(answer[level].races.length < maxRaces && racePanel.raceSize < data[level].race) {
               if(horse.fromPodium !== undefined) {
                  setHorsePosition(horse, horse.canvasPosition, true, true);
                  racePanel.prepareText.attr("text", cannotRaceFromPodium);
                  return;
               }
               for(var iSlot = 0; iSlot < data[level].race; iSlot++) {
                  if(racePanel.horses[iSlot] === undefined) {
                     setHorsePosition(horse, {
                        x: racePanel.slotSquares[iSlot].attrs.x,
                        y: racePanel.slotSquares[iSlot].attrs.y
                     });
                     racePanel.horses[iSlot] = iHorse;
                     racePanel.raceSize++;
                     onRaceChange();
                     break;
                  }
               }
               return;
            }
         }
         else {
            if(horse.fromPodium !== undefined) {
               for (var jSlot in racePanel.slotSquares) {
                  if (checkSnap(x, y, racePanel.slotSquares[jSlot].attrs.x, racePanel.slotSquares[jSlot].attrs.y, podiumParams.snap)) {
                     setHorsePosition(horse, horse.canvasPosition, true, true);
                     answer[level].podium[horse.fromPodium] = iHorse;
                     racePanel.prepareText.attr("text", cannotRaceFromPodium);
                     return;
                  }
               }
            }
         }
         if(!isHorseOutside(horse)) {
            for(jHorse in horses) {
               if(iHorse === jHorse) {
                  continue;
               }
               var otherHorse = horses[jHorse];
               if(checkSnap(x, y, otherHorse.image.attrs.x, otherHorse.image.attrs.y, horseParams.repelLimit)) {
                  x += horseParams.repelDistance + randomGenerator.nextInt(0, horseParams.repelRandomOffset);
                  y += horseParams.repelDistance + randomGenerator.nextInt(0, horseParams.repelRandomOffset);
               }
            }
            setHorsePosition(horse, {x: x, y: y}, true, true);
         }
         else if(!inRace) {
            setHorsePosition(horse, horse.canvasPosition, true);
         }
         onRaceChange();
      };
      return handler;
   };

   var isHorseOutside = function(horse) {
      var x = horse.image.attrs.x;
      var y = horse.image.attrs.y;
      return x < horseMinPos.x || x > horseMax.x ||
             y < horseMinPos.y || y > horseMax.y;
   };

   var onRaceChange = function() {
      if(answer[level].races.length >= maxRaces) {
         return;
      }
      if(racePanel.raceSize === data[level].race) {
         racePanel.startButton.enable();
      }
      else {
         racePanel.startButton.disable();
      }
   };

   var cleanFinishLine = function() {
      for(var iHorse in horses) {
         if(horses[iHorse].image.attrs.x < paperParams.canvasAttr.x) {
            setHorsePosition(horses[iHorse], horses[iHorse].canvasPosition);
         }
      }
   };

   var clickStart = function() {
      cleanFinishLine();
      var race = [];
      for (var iHorse in racePanel.horses) {
         race.push(racePanel.horses[iHorse]);
      }
      answer[level].races.push(race);
      unbindHorsesMouseEvents();
      simulateRace();
   };

   var simulateRace = function() {
      stopExecution();
      setSlotsDisplay(false);
      racePanel.prepareText.hide();
      racePanel.startButton.hide();
      racePanel.maxRaceText.hide();
      racePanel.startButton.disable();

      simulation = new Simulation();
      var step = new SimulationStep();
      var params;
      var iHorse;

      for (iHorse in racePanel.horses) {
         params = {
            x: startLineParams.x + iHorse * startLineParams.padding,
            y: startLineParams.y
         };
         step.addEntries(getHorseAnimationEntries("startLine", horses[racePanel.horses[iHorse]], params, animPreparing));
      }
      simulation.addStep(step);
      sortedHorses = [];
      for (iHorse in racePanel.horses) {
         sortedHorses.push(iHorse);
      }
      sortedHorses.sort(function(iHorse, jHorse) {
         return permutation[racePanel.horses[iHorse]] - permutation[racePanel.horses[jHorse]];
      });
      step = new SimulationStep();
      for (iHorse in sortedHorses) {
         var horse = horses[racePanel.horses[sortedHorses[iHorse]]];
         params = {
            x: finishLineX + iHorse * (racePanelParams.slotPadding + racePanelParams.slot.width)
         };
         step.addEntries(getHorseAnimationEntries("finishLine", horse, params, animRacing[iHorse]));
      }
      simulation.addStep(step);

      simulation.addStepWithEntry({
         name: "finish",
         action: {
            onExec: onSimulationFinish
         }
      });

      simulation.setAutoPlay(true);
      simulation.play();
   };

   var getHorseAnimationEntries = function(name, horse, params, duration) {
      var animateImage = function(params, duration, callback) {
         return horse.image.animate(params, duration, callback);
      };
      var animateBackground = function(params, duration, callback) {
         return horse.background.animate(params, duration, callback);
      };
      var animateLetter = function(params, duration, callback) {
         var animParams = {};
         if (params.x) {
            animParams.x = params.x + horseParams.textOffset.x;
         }
         if (params.y) {
            animParams.y = params.y + horseParams.textOffset.y;
         }

         return horse.letter.animate(animParams, duration, callback);
      };
      return [{
         name: name + horse.index + "image",
         action: {
            onExec: animateImage,
            params: params,
            duration: duration
         }
      }, {
         name: name + horse.index + "background",
         action: {
            onExec: animateBackground,
            params: params,
            duration: duration
         }
      }, {
         name: name + horse.index + "letter",
         action: {
            onExec: animateLetter,
            params: params,
            duration: duration
         }
      }];
   };

   var onSimulationFinish = function(params, duration, callback) {
      loadHistory();
      setSlotsDisplay(true);
      racePanel.prepareText.show();
      racePanel.startButton.show();
      clearRace();
      checkMaxRaces();
      bindHorsesMouseEvents();
      callback();
   };

   var checkMaxRaces = function() {
      if(answer[level].races.length < maxRaces) {
         racePanel.maxRaceText.hide();
         return;
      }
      racePanel.startButton.hide();
      racePanel.prepareText.hide();
      racePanel.maxRaceText.show();
      setSlotsDisplay(false);
   };

   var tagHorses = function() {
      for (var iHorse in sortedHorses) {
         var horse = horses[racePanel.horses[sortedHorses[iHorse]].index];
         tagHorse(horse, parseInt(iHorse) + 1);

         horse = racePanel.horses[sortedHorses[iHorse]];
         tagHorse(horse, parseInt(iHorse) + 1);
      }
   };

   var tagHorse = function(horse, number) {
      horse.tag = paper.text().attr("text", number).attr(horseParams.tagAttr);
      var x = horse.image.attrs.x + horseParams.tagOffset.x;
      var y = horse.image.attrs.y + horseParams.tagOffset.y;
      horse.tag.attr({
         x: x,
         y: y
      });
   };

   var untagHorses = function() {
      for (var iHorse in horses) {
         var horse = horses[iHorse];
         if (horse.tag) {
            horse.tag.remove();
            delete horse.tag;
         }
      }
   };

   var getRaceResult = function(race, permutation) {
      var result = $.extend([], race);
      result.sort(function(iHorse, jHorse) {
         return permutation[iHorse] - permutation[jHorse];
      });
      return result;
   };

   var stopExecution = function() {
      if (simulation) {
         simulation.stop();
      }
   };

   /*
   var validate = function() {
      var resultAndMessage = getResultAndMessage(answer, level);
      if (resultAndMessage.message) {
         platform.validate("stay", function() {});
         return;
      }
      platform.validate("done", function() {});
   };
   */

   var getResultAndMessage = function(answer, level) {
      // FOR DEBUG PERF
      // var maxRaces = -1;
      
      if (answer[level].races.length > maxRaces) {
         return {
            result: "error",
            message: "Trop de courses." 
               // Note: should never be displayed to the user
         };
      }
      var iSlot;
      for (iSlot = 1; iSlot <= data[level].target; iSlot++) {
         if (answer[level].podium[iSlot] === undefined) {
            return {
               result: "error",
               message: taskStrings.incomplete
            };
         }
      }

      var matrix = racesToMatrix(data[level].horses, answer[level].races, answer[level].seed);
      floydWarshall(matrix);

      var accumulatingPodium = {};
      for (iSlot = 1; iSlot <= data[level].target; iSlot++) {
         var iHorse = answer[level].podium[iSlot];
         accumulatingPodium[iHorse] = true;
         if(countLosses(matrix, iHorse, accumulatingPodium) > 0) {
            return {
               result: "wrong",
               message: taskStrings.incorrect
            };
         }
         if(countWins(matrix, iHorse) !== matrix.length - iSlot) {
            return {
               result: "bad",
               message: taskStrings.incorrectCannotBeSure
            };
         }
      }
      if (data[level].optimal < answer[level].races.length) {
         return {
            result: "suboptimal",
            steps: answer[level].races.length,
            stepsOptimal: data[level].optimal
         };
      }
      return {
         result: "optimal"
      };
   };

   var countWins = function(matrix, iHorse) {
      var count = 0;
      for (var iCol = 0; iCol < matrix.length; iCol++) {
         if (matrix[iHorse][iCol] !== Infinity && iHorse != iCol) {
            count++;
         }
      }
      return count;
   };

   var countLosses = function(matrix, iHorse, ignore) {
      var count = 0;
      for(var iRow = 0; iRow < matrix.length; iRow++) {
         if(matrix[iRow][iHorse] !== Infinity && iHorse != iRow && !ignore[iRow]) {
            count++;
         }
      }
      return count;
   };

   var racesToMatrix = function(size, races, seed) {
      var matrix = Beav.Matrix.init(size, size, function(row, col) {
         if (row == col) {
            return 0;
         }
         return Infinity;
      });
      var permutation = getRandomPermutation(size, seed);
      for (var iRace in races) {
         var result = getRaceResult(races[iRace], permutation);
         for (var iHorse = 0; iHorse < result.length; iHorse++) {
            for (var jHorse = iHorse + 1; jHorse < result.length; jHorse++) {
               matrix[result[iHorse]][result[jHorse]] = 1;
            }
         }
      }
      return matrix;
   };

   var floydWarshall = function(matrix) {
      for (var midNode = 0; midNode < matrix.length; midNode++) {
         for (var startNode = 0; startNode < matrix.length; startNode++) {
            for (var endNode = 0; endNode < matrix.length; endNode++) {
               if (matrix[startNode][endNode] > matrix[startNode][midNode] + matrix[midNode][endNode]) {
                  matrix[startNode][endNode] = matrix[startNode][midNode] + matrix[midNode][endNode];
               }
            }
         }
      }
   };

   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      var taskParams = displayHelper.taskParams;
      var scores = {};
      var messages = {};
      var maxScores = displayHelper.getLevelsMaxScores();

      if (strAnswer === '') {
         callback(taskParams.minScore, '');
         return;
      }
      var answer = $.parseJSON(strAnswer);
      // clone the state to restore after grading.
      var oldState = $.extend({}, task.getStateObject());
      for (var curLevel in data) {
         state.level = curLevel;
         task.reloadStateObject(state, false);
         var resultAndMessage = getResultAndMessage(answer, curLevel);
         var relativeScore = 0.0;
         if (resultAndMessage.message) {
            relativeScore = 0.0;
            messages[curLevel] = resultAndMessage.message;
         } else {
            if (resultAndMessage.result == "optimal") {
               relativeScore = 1.0;
               messages[curLevel] = taskStrings.success;
            } else { // "suboptimal"
               // 60% if only one race way, else 40%
               relativeScore = 4/10;
               if (resultAndMessage.steps <= resultAndMessage.stepsOptimal + 1) {
                  relativeScore = 6/10;
               }
               messages[curLevel] = taskStrings.successPartial(resultAndMessage.steps, resultAndMessage.stepsOptimal);
            }
         }
         scores[curLevel] = levelScoreInterpolate(maxScores, curLevel, relativeScore);
      }

      task.reloadStateObject(oldState, false);
      if (!gradedLevel) {
         displayHelper.sendBestScore(callback, scores, messages);
      } else {
         callback(scores[gradedLevel], messages[gradedLevel]);
      }
   };
}
initTask();

