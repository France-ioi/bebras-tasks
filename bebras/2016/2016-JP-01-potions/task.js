function initTask(subTask) {
   var state = null;
   var level;
   var answer = null;
   var data = {
      easy: {
         height1: 180,
         totalCups: 4,
         experimentCups: 2,
         beavers: 3,
         experiments: [
            ["A", "B"],
            ["B", "C"],
            ["C", "D"]
         ],
         showText: true
      },
      medium: {
         height1: 140,
         totalCups: 6,
         experimentCups: 3,
         beavers: 3,
         experiments: [
            ["A", "B", "C"],
            ["A", "D", "E"],
            ["C", "D", "F"]
         ]
      },
      hard: {
         height1: 220,
         totalCups: 8,
         experimentCups: 4,
         beavers: 3
      }
   };

   var allProperties = [
      "curlyWhiskers",
      "bigTeeth",
      "bigEars",
      "blackTeeth",
      "blackEars",
      "whiteSkin",
      "whiteNose",
      "whiteEyes"
   ];

   var levelProperties;

   var cupToLabel = ["A", "B", "C", "D", "E", "F", "G", "H"];
   var labelToCup = {
      A: 0,
      B: 1,
      C: 2,
      D: 3,
      E: 4,
      F: 5,
      G: 6,
      H: 7
   };

   var cupToProperty;
   var paper1;
   var paper2;

   var experimentBeavers;
   var dragAndDrop1;
   var dragAndDrop2;
   var drinkButton;
   var reshuffleButton;
   var randomGenerator;
   var internalSeed = null;

   var wrongHighlighter;

   var dragContainers = {
      sourceCups: null,
      beaverCups: null,
      sourceBeavers: null,
      answerSlots: null
   };

   var paperParams = {
      width: 760,
      height2: 360
   };

   var experimentParams = {
      firstCenterX: 240,
      beaverXPad: 140,
      beaverCenterY: {
         easy: 100,
         medium: 100,
         hard: 170
      },
      beaverTopPad: 70,
      fixedBeaverX: 80,
      cupXPad: 2,
      cupSlotWidth: 30,
      cupSlotHeight: 50,
      cupSlotAttr: {
         fill: "white"
      },
      cupSlotSpacing: 20,
      cupSourceY: 30,
      drinkButton: {
         width: 154,
         height: 56,
         x: 600
      },
      reshuffleButton: {
         width: 154,
         height: 56,
         x: 600
      }
   };

   var beaverParams = {
      bottomPad: 58,
      textYJump: 24,
      textYJumpSqueezed: 10,
      propertyAttr: {
         "font-size": 18
      },
      width: 106, // For calculations. Actual size is in drawBeaver.
      height: 95,
      scale: 0.8
   };

   var beaverPNGParams = {
      width: 85,
      height: 79
   };

   var cupParams = {
      labelAttr: {
         "font-size": 22,
         "font-weight": "bold"
      },
      labelYOffset: 4,
      width: 28, // For calculations. Actual size is in drawCup paths.
      height: 45
   };

   var answerSlotParams = {
      width: 90,
      height: 145,
      centerY: 140,
      backgroundAttr: {
         "stroke-width": 2
      },
      cupYOffset: -110,
      bottomPad: 120
   };

   var highlightParams = {
      attr: {
         stroke: "red",
         "stroke-width": 4
      }
   };

   subTask.loadLevel = function(curLevel, curState) {
      level = curLevel;
      state = curState;
      displayHelper.hideValidateButton = true;

      initProperties();
      if(internalSeed === null) {
         internalSeed = subTask.taskParams.randomSeed;
         randomGenerator = new RandomGenerator(internalSeed);
      }
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      if(answer) {
         randomizePotions();
      }
   };

   subTask.resetDisplay = function() {
      initPaper();
      initTexts();
      drawFixedBeaver();
      initAnswer();
      if(data[level].experiments) {
         drawDataExperiments();
      }
      else {
         initUserExperiments();
         if(answer.state == "after") {
            performUserExperiments();
         }
      }
      showFeedback(null);
      unhighlightWrong();
      initButtons();
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      var answerObject = {
         seed: randomGenerator.nextInt(0, 100000),
         cupToIndex: Beav.Array.make(data[level].totalCups, null),
         state: "irrelevant",
         safeShuffling: true // This flag is to distinguish the participants' answers before and after the safe shuffling fix.
      };
      if(!data[level].experiments) {
         answerObject.experiments = Beav.Matrix.make(data[level].beavers, data[level].experimentCups, null);
         answerObject.state = "before";
      }
      return answerObject;
   };

   subTask.getDefaultStateObject = function() {
      return {};
   };

   subTask.unloadLevel = function(callback) {
      if(drinkButton) {
         drinkButton.remove();
         drinkButton = null;
      }
      if(reshuffleButton) {
         reshuffleButton.remove();
         reshuffleButton = null;
      }
      if(dragAndDrop1) {
         dragAndDrop1.disable();
      }
      if(dragAndDrop2) {
         dragAndDrop2.disable();
      }
      callback();
   };

   function initButtons() {
      $("#execute").unbind("click");
      $("#execute").click(clickValidate);
   }

   function initProperties() {
      // Pick the properties for this level (once per level - doesn't change across answer seeds).
      var tempGenerator = new RandomGenerator(subTask.taskParams.randomSeed);
      levelProperties = $.extend(true, [], allProperties);
      levelProperties = levelProperties.slice(0, data[level].totalCups);
      tempGenerator.shuffle(levelProperties);
   }

   function randomizePotions() {
      randomGenerator.reset(answer.seed);
      cupToProperty = $.extend(true, [], levelProperties);

      // We need safe shuffling so that the order of the answer beavers
      // doesn't resemble the answer too much.
      if(answer.safeShuffling) {
         randomGenerator.safeShuffle(cupToProperty);
      }
      else {
         randomGenerator.shuffle(cupToProperty);
      }
   }

   function initPaper() {
      paper1 = subTask.raphaelFactory.create("anim1", "anim1", paperParams.width, data[level].height1);
      paper2 = subTask.raphaelFactory.create("anim2", "anim2", paperParams.width, paperParams.height2);
     
      dragAndDrop1 = DragAndDropSystem({
         paper: paper1,
         actionIfDropped: actionIfDropped1,
         drop: onDrop,
         canBeTaken: canBeTaken1
      });

      dragAndDrop2 = DragAndDropSystem({
         paper: paper2,
         actionIfDropped: actionIfDropped2,
         drop: onDrop,
         actionIfEjected: actionIfEjected2,
         canBeTaken: canBeTaken2
      });
   }

   function initTexts() {
      $(".totalCups").html(data[level].totalCups);
      $(".experimentCups").html(data[level].experimentCups);
   }

   function drawFixedBeaver() {
      paper1.text(experimentParams.fixedBeaverX, experimentParams.beaverCenterY[level] - experimentParams.beaverTopPad, taskStrings.noDrink).attr("font-size", 16);
      drawBeaver(paper1, experimentParams.fixedBeaverX, experimentParams.beaverCenterY[level], false);
   }

   function drawCup(paper, centerX, centerY, label) {
      var transform = ["t", -396.89313 - 20 - 14 + centerX, -512.87486 - 20 - 22 + centerY];
      
      paper.setStart();
      paper.path(Raphael.transformPath("m 417.83263,537.22917 c 0,0 1.56065,25.47683 2.72137,31.89977 1.16072,6.42295 1.69067,7.78504 10.37,7.6968 4.75521,-0.0483 9.95597,0.21638 10.72067,-7.01808 l 3.45535,-32.68929", transform)).attr({
         id: 'path5105',
         parent: 'layer1',
         fill: 'white', 
         "fill-rule": 'evenodd',
         stroke: '#000000',
         "stroke-width": '1.47',
         "stroke-linecap": 'butt',
         "stroke-linejoin": 'miter',
         "stroke-opacity": '1'
      });
      paper.ellipse(431.40475 + transform[1], 537.31726 + transform[2], 13.705804, 3.6365776).attr({
         id: 'path5107',
         parent: 'layer1',
         opacity: '1',
         fill: '#77f442',
         "fill-opacity": '1',
         stroke: '#000000',
         "stroke-width": '1.61',
         "stroke-linecap": 'round',
         "stroke-linejoin": 'round',
         "stroke-miterlimit": '4',
         "stroke-dasharray": 'none',
         "stroke-dashoffset": '0',
         "stroke-opacity": '1'
      });

      paper.text(centerX, centerY + cupParams.labelYOffset, label).attr(cupParams.labelAttr);

      var overlay = paper.rect(
         centerX - cupParams.width / 2,
         centerY - cupParams.height / 2,
         cupParams.width,
         cupParams.height
      );
      overlay.attr({
         fill: "green",
         opacity: 0
      });
      return paper.setFinish();
   }

   function drawBeaver(paper, centerX, centerY, properties, writeText, squeezeText, loadImage) {
      if(!properties) {
         properties = {};
      }

      // Constants are SVG artifacts.
      var transform1 = ["t", centerX - 20 - 53, -918.12717 - 30 - 38 + centerY, "S", beaverParams.scale, beaverParams.scale, centerX, centerY];
      var transform2 = ["m", 1.0150258, 0, 0, 0.74760486, 0, 0, "T" ,-493 - 53 + centerX, - 210 - 16 + centerY, "S", beaverParams.scale, beaverParams.scale, centerX, centerY];

      paper.setStart();

      if(loadImage) {
         var singleProperty;
         for(var _property in properties) {
            singleProperty = _property;
         }
         var imageName = $("#" + singleProperty + "_image").attr("src");
         paper.image(imageName, centerX - beaverPNGParams.width / 2, centerY - beaverPNGParams.height / 2, beaverPNGParams.width, beaverPNGParams.height);
      }

      else {

         /***************
          *  Ears
          ***************/

         var leftEar, rightEar;
         if (properties.bigEars) {
            var bigEarScaleX = 1.05;
            var bigEarScaleY = 1.05;

            // Big right ear.
            rightEar = paper.path(
               Raphael.transformPath(
                  Raphael.transformPath("m 83.829933,958.67743 c 0,0 11.007933,-32.88261 20.214677,-13.91954 2.61603,5.3882 -11.177504,17.2872 -11.177504,17.2872 z", transform1),
                  ["S", bigEarScaleX, bigEarScaleY, centerX, centerY]
                  )).attr({
               id: 'path3874-0-29-1',
               parent: 'layer1',
               fill: '#e58f56',
               "fill-opacity": '1',
               stroke: '#000000',
               "stroke-width": '1.49',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            // Big left ear.
            leftEar = paper.path(
               Raphael.transformPath(
                  Raphael.transformPath("m 60.090893,961.44278 c 0,0 -12.47312,-33.51026 -22.90529,-14.18524 -2.964215,5.49106 12.66528,17.61715 12.66528,17.61715 z", transform1),
                  ["S", bigEarScaleX, bigEarScaleY, centerX, centerY]
                  )).attr({
               id: 'path3874-7-7-7-0',
               parent: 'layer1',
               fill: '#e58f56',
               "fill-opacity": '1',
               stroke: '#000000',
               "stroke-width": '1.49',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
         } else {
            // Normal right ear.
            rightEar = paper.path(Raphael.transformPath("m 86.280666,960.64094 c 0,0 6.36777,-18.79121 11.6936,-7.95451 1.5133,3.07916 -6.46586,9.879 -6.46586,9.879 z", transform1)).attr({
               id: 'path3874-0-29-4',
               parent: 'layer1',
               fill: '#e58f56',
               "fill-opacity": '1',
               stroke: '#000000',
               "stroke-width": '1.41',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            // Normal left ear.
            leftEar = paper.path(Raphael.transformPath("m 57.706166,960.60394 c 0,0 -6.77158,-18.40586 -12.43514,-7.79139 -1.60926,3.01602 6.8759,9.6764 6.8759,9.6764 z", transform1)).attr({
               id: 'path3874-0-29-4',
               parent: 'layer1',
               fill: '#e58f56',
               "fill-opacity": '1',
               stroke: '#000000',
               "stroke-width": '1.41',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
         }

         if(properties.blackEars) {
            leftEar.attr("fill", "black");
            rightEar.attr("fill", "black");
         }

         /***************
          *  Skin
          ***************/
         var skin = paper.path(Raphael.transformPath("m 44.199853,984.31305 c 0,0 -6.46966,-27.32056 25.39523,-28.56374 22.02416,-0.85925 33.048767,6.31221 29.268463,30.08454 0,0 21.208654,29.43315 -10.794543,37.10065 0,0 -15.61102,3.2184 -33.47555,0 0,0 -29.286385,-5.9847 -10.3936,-38.62145 z", transform1)).attr({
            id: 'path3801-6-2-2',
            parent: 'layer1',
            fill: '#e58f56',
            "fill-opacity": '1',
            stroke: '#000000',
            "stroke-width": '1.41',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'round',
            "stroke-miterlimit": '4',
            "stroke-dasharray": 'none',
            "stroke-opacity": '1'
         });

         if(properties.whiteSkin) {
            skin.attr("fill", "white");
         }

         /***************
          *  Teeth
          ***************/
         var teethInline, teethOutline;

         if(properties.bigTeeth) {
            // Big teeth outline
            teethOutline = paper.path(Raphael.transformPath("m 57.649003,1002.6017 c 0,0 1.67017,26.7616 2.50523,28.0064 0.8351,1.2447 21.30903,1.5559 22.35288,-0.3112 1.04385,-1.8671 2.0877,-28.0064 2.0877,-28.0064", transform1)).attr({
               id: 'path3830-7-4-8',
               parent: 'layer1',
               display: 'inline',
               fill: '#ffffff',
               stroke: '#000000',
               "stroke-width": '1.49',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            // Big teeth inline.
            teethInline = paper.path(Raphael.transformPath("m 70.586823,1030.5349 c 0,0 0,-30.4769 0.34544,-30.4769", transform1)).attr({
               id: 'path3850-83-6-6-1',
               parent: 'layer1',
               display: 'inline',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.49',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
         } else {
            // Teeth outline.
            teethOutline = paper.path(Raphael.transformPath("m 57.429856,1001.2609 c 0,0 1.6974,14.9676 2.54609,15.6638 0.84872,0.6961 21.65661,0.8702 22.71748,-0.1741 1.06088,-1.0442 2.12176,-15.6637 2.12176,-15.6637", transform1)).attr({
               id: 'path3830-7-4-5',
               parent: 'layer1',
               display: 'inline',
               fill: '#ffffff',
               stroke: '#000000',
               "stroke-width": '1.35',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            // Teeth inline.
            teethInline = paper.path(Raphael.transformPath("m 70.578706,1016.8837 c 0,0 0,-17.04547 0.35108,-17.04547", transform1)).attr({
               id: 'path3850-83-6-6-5',
               parent: 'layer1',
               display: 'inline',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.35',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
         }

         if(properties.blackTeeth) {
            teethOutline.attr("fill", "black");
            teethInline.attr("stroke", "white");
         }

         /***************
          *  Eyes
          ***************/
         var leftEye, rightEye;

         // Left eye.
         leftEye = paper.path(Raphael.transformPath("m 62.378043,979.43698 c 0,0 3.5782,0.83497 3.82637,-3.49829 0.20605,-3.59778 -0.0463,-6.15326 -3.50967,-5.92238 -3.27189,0.21813 -2.57377,5.40741 -2.57377,5.40741 0,0 0.38526,4.01326 2.25707,4.01326 z", transform1)).attr({
            id: 'path3853-64-3-2',
            parent: 'layer1',
            display: 'inline',
            fill: '#000000',
            stroke: '#000000',
            "stroke-width": '0.98',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'round',
            "stroke-miterlimit": '4',
            "stroke-dasharray": 'none',
            "stroke-opacity": '1'
         });

         // Right eye.
         rightEye = paper.path(Raphael.transformPath("m 79.386193,970.37636 c 0,0 3.86283,-1.81492 4.11163,3.41344 0.16525,3.47214 -0.20413,5.85902 -3.51885,5.71218 -3.28423,-0.14542 -2.58047,-5.21547 -2.58047,-5.21547 0,0 0.22893,-3.24163 1.98769,-3.91015 z", transform1)).attr({
            id: 'path3853-1-4-8-7',
            parent: 'layer1',
            display: 'inline',
            fill: '#000000',
            stroke: '#000000',
            "stroke-width": '0.96',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'round',
            "stroke-miterlimit": '4',
            "stroke-dasharray": 'none',
            "stroke-opacity": '1'
         });

         if(properties.whiteEyes) {
            leftEye.attr("fill", "white");
            leftEye.attr("stroke-width", 2);
            rightEye.attr("fill", "white");
            rightEye.attr("stroke-width", 2);
         }

         /***************
          *  Cheeks
          ***************/
         // Bottom left cheek.
         paper.path(Raphael.transformPath("m 71.011363,1000.8735 c 0,0 -20.89069,16.405 -26.91437,-2.81955", transform1)).attr({
            id: 'path3812-1-1',
            parent: 'layer1',
            display: 'inline',
            fill: '#ffad76',
            "fill-opacity": '1',
            stroke: '#000000',
            "stroke-width": '1.41',
            "stroke-linecap": 'square',
            "stroke-linejoin": 'round',
            "stroke-miterlimit": '4',
            "stroke-dasharray": 'none',
            "stroke-opacity": '1'
         });

         // Top left cheek.
         paper.path(Raphael.transformPath("m 44.632843,998.33775 c 0,0 -0.76897,-10.5095 8.20248,-9.9968 0,0 10.50942,-0.5333 14.61064,6.3876 4.3908,7.40945 3.84492,6.17235 3.84492,6.17235", transform1)).attr({
            id: 'path3977-2-5-8-1',
            parent: 'layer1',
            fill: '#ffad76',
            "fill-opacity": '1',
            stroke: 'none',
            'stroke-width': '1',
            'stroke-opacity': '1'
         });

         // Bottom right cheek.
         paper.path(Raphael.transformPath("m 71.267703,1000.8735 c 0,0 20.890673,16.405 26.914353,-2.81955", transform1)).attr({
            id: 'path3827-9-9-5',
            parent: 'layer1',
            display: 'inline',
            fill: '#ffad76',
            "fill-opacity": '1',
            stroke: '#000000',
            "stroke-width": '1.41',
            "stroke-linecap": 'square',
            "stroke-linejoin": 'round',
            "stroke-miterlimit": '4',
            "stroke-dasharray": 'none',
            "stroke-opacity": '1'
         });

         // Top right cheek.
         paper.path(Raphael.transformPath("m 97.287486,998.72215 c 0,0 3.844924,-11.022 -11.022073,-9.4841 0,0 -10.25308,3.0554 -11.79104,5.875 -4.1242,7.56105 -3.84492,6.17235 -3.84492,6.17235", transform1)).attr({
            id: 'path3977-2-7-5-9-9',
            parent: 'layer1',
            fill: '#ffad76',
            "fill-opacity": '1',
            stroke: 'none',
            'stroke-width': '1',
            'stroke-opacity': '1'
         });

         /***************
          *  Whiskers
          ***************/
         if(properties.curlyWhiskers) {
            // Right whiskers.
            paper.path(Raphael.transformPath("m 89.634026,985.56156 c 0,0 13.215534,-3.73847 27.559214,-3.45142 3.57094,0.0715 5.8498,0.11582 6.48581,-3.21999 0.59976,-3.14569 -2.08057,-4.09658 -3.74654,-3.98206 -1.72852,0.11883 -3.77252,2.13975 -1.98145,4.13821", transform1)).attr({
               id: 'path3895-7-79-6',
               parent: 'layer1',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.27',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            paper.path(Raphael.transformPath("m 90.015356,989.51547 c 0,0 12.930294,-1.42769 26.260384,1.32369 3.31859,0.68499 4.57594,1.77731 5.7096,-1.41554 1.06906,-3.01087 -0.48027,-4.27604 -2.05247,-4.44923 -1.63124,-0.17965 -3.42382,1.47522 -2.07733,3.76165", transform1)).attr({
               id: 'path3895-7-79-6-1',
               parent: 'layer1',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.24',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            paper.path(Raphael.transformPath("m 89.407216,994.03229 c 0,0 13.283954,1.01867 26.257994,6.21531 3.22994,1.2938 5.07123,2.7426 6.75938,-0.18 1.59191,-2.7561 -0.44613,-4.82181 -2.00216,-5.28615 -1.61445,-0.48177 -4.01627,0.34451 -3.04849,2.84144", transform1)).attr({
               id: 'path3895-7-79-6-2',
               parent: 'layer1',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.25',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            // Left whiskers.
            paper.path(Raphael.transformPath("m 54.895696,985.33855 c 0,0 -13.21553,-3.73847 -27.55921,-3.45142 -3.57094,0.0715 -5.8498,0.11582 -6.48581,-3.21999 -0.59976,-3.14569 2.08057,-4.09658 3.74654,-3.98206 1.72852,0.11883 3.77252,2.13975 1.98145,4.13821", transform1)).attr({
               id: 'path3895-7-79-6-6',
               parent: 'layer1',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.27',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            paper.path(Raphael.transformPath("m 54.514366,989.29246 c 0,0 -12.93029,-1.42769 -26.26038,1.32369 -3.31859,0.68499 -4.57594,1.77731 -5.7096,-1.41554 -1.06906,-3.01087 0.48027,-4.27604 2.05247,-4.44923 1.63124,-0.17965 3.42382,1.47522 2.07733,3.76165", transform1)).attr({
               id: 'path3895-7-79-6-1-9',
               parent: 'layer1',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.24',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            paper.path(Raphael.transformPath("m 55.122506,993.80928 c 0,0 -13.28395,1.01867 -26.25799,6.21532 -3.22994,1.2938 -5.07123,2.7426 -6.75938,-0.18006 -1.59191,-2.75605 0.44613,-4.82176 2.00216,-5.2861 1.61445,-0.48177 4.01627,0.34451 3.04849,2.84144", transform1)).attr({
               id: 'path3895-7-79-6-2-2',
               parent: 'layer1',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.25',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
         } else {
            // Left whiskers.
            paper.path(Raphael.transformPath("m 53.196623,984.53185 c 0,0 -16.91762,-3.8449 -32.553565,-3.5886", transform1)).attr({
               id: 'path3895-4-3-3-2',
               parent: 'layer1',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.27',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'miter',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            paper.path(Raphael.transformPath("m 52.940273,990.17105 c 0,0 -30.502925,-1.2816 -31.528225,-0.769", transform1)).attr({
               id: 'path3897-0-4-0-3',
               parent: 'layer1',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.27',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'miter',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            paper.path(Raphael.transformPath("m 53.452953,994.78495 -31.528255,3.5886", transform1)).attr({
               id: 'path3899-9-0-4-7',
               parent: 'layer1',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.27',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'miter',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            // Right whiskers.
            paper.path(Raphael.transformPath("m 89.633423,985.56195 c 0,0 18.220107,-3.8367 35.059867,-3.5809", transform1)).attr({
               id: 'path3895-7-79-9',
               parent: 'layer1',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.27',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            paper.path(Raphael.transformPath("m 89.909493,991.18915 c 0,0 32.851377,-1.2789 33.955627,-0.7674", transform1)).attr({
               id: 'path3897-4-8-5',
               parent: 'layer1',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.27',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
            paper.path(Raphael.transformPath("m 89.357363,995.79315 33.955627,3.5809", transform1)).attr({
               id: 'path3899-7-6-9',
               parent: 'layer1',
               fill: 'none',
               stroke: '#000000',
               "stroke-width": '1.27',
               "stroke-linecap": 'round',
               "stroke-linejoin": 'round',
               "stroke-miterlimit": '4',
               "stroke-dasharray": 'none',
               "stroke-opacity": '1'
            });
         }

         /***************
          *  Nose
          ***************/
         var leftNose, rightNose;
         // Left nose.
         leftNose = paper.path(Raphael.transformPath("m 533.36054,323.53712 c 0,0 -19.44544,-21.1318 -0.50507,-21.2132", transform2)).attr({
            id: 'path3804-8-0-8',
            parent: 'layer1',
            fill: '#000000',
            "fill-opacity": '1',
            stroke: '#000000',
            "stroke-width": '1.54',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'round',
            "stroke-miterlimit": '4',
            "stroke-dasharray": 'none',
            "stroke-opacity": '1'
         });
         // Right nose.
         rightNose = paper.path(Raphael.transformPath("m 531.34024,302.32392 8.50453,0 -2.44361,0 2.44361,0 c 18.68783,0.0814 -1.01015,21.2132 -1.01015,21.2132 0,0 -2.56988,3.53554 -5.97915,-0.50508", transform2)).attr({
            id: 'path3806-1-7-5',
            parent: 'layer1',
            fill: '#000000',
            "fill-opacity": '1',
            stroke: '#000000',
            "stroke-width": '1.54',
            "stroke-linecap": 'round',
            "stroke-linejoin": 'round',
            "stroke-miterlimit": '4',
            "stroke-dasharray": 'none',
            "stroke-opacity": '1'
         });

         if(properties.whiteNose) {
            leftNose.attr("fill", "white");
            rightNose.attr("fill", "white");
         }
      }
      if(writeText) {
         var textY = centerY + beaverParams.bottomPad;
         var array = [];
         for(var property in properties) {
            array.push(property);
         }
         randomGenerator.shuffle(array);
         for(var index = 0; index < array.length; index++) {
            var name = taskStrings.names[array[index]];
            if (squeezeText) { 
               textY += beaverParams.textYJumpSqueezed;
               name = name.replace(" ", "\n");
            }
            paper.text(centerX, textY, name).attr(beaverParams.propertyAttr).transform(["S", beaverParams.scale, beaverParams.scale, centerX, centerY]);
            textY += beaverParams.textYJump;
         }
      }

      var overlay = paper.rect(
         centerX - beaverParams.width / 2,
         centerY - beaverParams.height / 2,
         beaverParams.width,
         beaverParams.height
      );
      overlay.attr({
         fill: "green",
         opacity: 0
      });
      overlay.transform(["S", beaverParams.scale, beaverParams.scale, centerX, centerY]);

      return paper.setFinish();
   }

   function initAnswer() {
      dragContainers.answerSlots = dragAndDrop2.addContainer({
         ident: "answerSlots",
         cx: paperParams.width / 2,
         cy: answerSlotParams.centerY,
         widthPlace: answerSlotParams.width,
         heightPlace: answerSlotParams.height,
         nbPlaces: data[level].totalCups,
         dropMode: "replace",
         placeBackgroundArray: [drawAnswerSlot()]
      });

      dragContainers.sourceBeavers = {};
      for(var index = 0; index < data[level].totalCups; index++) {
         var xPos = dragContainers.answerSlots.placeCenter(index)[0];
         drawCup(paper2, xPos, answerSlotParams.centerY + answerSlotParams.cupYOffset, cupToLabel[index]);

         dragContainers.sourceBeavers[index] = dragAndDrop2.addContainer({
            ident: "sourceBeavers_" + index,
            cx: xPos,
            cy: answerSlotParams.centerY + answerSlotParams.bottomPad,
            widthPlace: beaverParams.width * beaverParams.scale,
            heightPlace: beaverParams.height * beaverParams.scale,
            nbPlaces: 1,
            dropMode: "replace",
            placeBackgroundArray: []
         });
      }

      fillAnswerContainers();

      for(var cup = 0; cup < data[level].totalCups; cup++) {
         var propertyIndex = answer.cupToIndex[cup];
         if(propertyIndex === null) {
            continue;
         }
         var property = levelProperties[propertyIndex];
         var userProperties = {};
         userProperties[property] = true;
         dragAndDrop2.insertObjects("answerSlots", cup, [{
            ident: "beaver_" + propertyIndex,
            elements: [drawBeaver(paper2, 0, 0, userProperties, true, true, true)]
         }]);
         dragAndDrop2.removeAllObjects("sourceBeavers_" + propertyIndex);
      }
   }

   function fillAnswerContainers() {
      for(var index = 0; index < data[level].totalCups; index++) {
         var properties = {};
         properties[levelProperties[index]] = true;
         dragAndDrop2.removeAllObjects("sourceBeavers_" + index);
         dragAndDrop2.insertObjects("sourceBeavers_" + index, 0, [{
            ident: "beaver_" + index,
            elements: [drawBeaver(paper2, 0, 0, properties, true, true, true)]
         }]);
      }
   }

   function drawAnswerSlot() {
      return paper2.rect(
         - answerSlotParams.width / 2,
         - answerSlotParams.height / 2,
         answerSlotParams.width,
         answerSlotParams.height
      ).attr(answerSlotParams.backgroundAttr);
   }

   function drawDataExperiments() {
      experimentBeavers = {};
      for(var iExperiment in data[level].experiments) {
         experimentBeavers[iExperiment] = {
            raphael: drawDataExperiment(iExperiment)
         };
      }
   }

   function drawDataExperiment(index) {
      var centerX = experimentParams.firstCenterX + index * (experimentParams.beaverXPad);
      var properties = {};
      var experiment = data[level].experiments[index];

      var leftCupX = centerX - experiment.length * cupParams.width / 2 - (experiment.length - 1) * experimentParams.cupXPad / 2 + cupParams.width / 2;
      for(var iLabel in experiment) {
         var cupX = leftCupX + iLabel * (cupParams.width + experimentParams.cupXPad);
         var label = experiment[iLabel];
         drawCup(paper1, cupX, experimentParams.beaverCenterY[level] - experimentParams.beaverTopPad, label);

         properties[cupToProperty[labelToCup[label]]] = true;
      }
      drawBeaver(paper1, centerX, experimentParams.beaverCenterY[level], properties, data[level].showText, false);
   }

   function initUserExperiments() {
      drawInitialExperimentBeavers();
      dragContainers.beaverCups = {};
      for(var index = 0; index < data[level].beavers; index++) {
         var centerX = experimentParams.firstCenterX + index * (experimentParams.beaverXPad);

         dragContainers.beaverCups[index] = dragAndDrop1.addContainer({
            ident: "cupSlots_" + index,
            cx: centerX,
            cy: experimentParams.beaverCenterY[level] - experimentParams.beaverTopPad,
            widthPlace: experimentParams.cupSlotWidth,
            heightPlace: experimentParams.cupSlotHeight,
            nbPlaces: data[level].experimentCups,
            dropMode: "insertBefore",
            placeBackgroundArray: [drawCupSlot()]
         });

         for(var iCup = 0; iCup < data[level].experimentCups; iCup++) {
            var cupIndex = answer.experiments[index][iCup];
            if(cupIndex === null) {
               continue;
            }
            dragAndDrop1.insertObjects("cupSlots_" + index, iCup, [{
               ident: "sourceCup_" + cupIndex,
               elements: [drawCup(paper1, 0, 0, cupToLabel[cupIndex])]
            }]);
         }
      }

      var leftX = paperParams.width / 2 - data[level].totalCups * experimentParams.cupSlotWidth / 2 - (data[level].totalCups - 1) * experimentParams.cupSlotSpacing / 2 + experimentParams.cupSlotWidth / 2;
      for(var cup = 0; cup < data[level].totalCups; cup++) {
         var currentCenterX = leftX + cup * (experimentParams.cupSlotWidth + experimentParams.cupSlotSpacing);
         dragContainers.sourceCups = dragAndDrop1.addContainer({
            ident: "sourceCup_" + cup,
            type: "source",
            cx: currentCenterX,
            cy: experimentParams.cupSourceY,
            placeBackgroundArray: [],
            sourceElemArray: [drawCup(paper1, 0, 0, cupToLabel[cup])]
         });
      }

      drinkButton = new Button(
         paper1,
         experimentParams.drinkButton.x,
         experimentParams.beaverCenterY[level] - experimentParams.beaverTopPad - experimentParams.drinkButton.height / 2,
         experimentParams.drinkButton.width,
         experimentParams.drinkButton.height,
         taskStrings.drinkButton(data[level].beavers));
      drinkButton.click(clickDrink);

      reshuffleButton = new Button(
         paper1,
         experimentParams.reshuffleButton.x,
         experimentParams.beaverCenterY[level] - experimentParams.beaverTopPad - experimentParams.reshuffleButton.height / 2,
         experimentParams.reshuffleButton.width,
         experimentParams.reshuffleButton.height,
         taskStrings.reshuffleButton);
      reshuffleButton.click(clickReshuffle);

      updateButtonState();
   }

   function clickDrink() {
      if(answer.state == "after") {
         return;
      }
      if(!data[level].experiments) {
         for(var iBeaver in answer.experiments) {
            if(answer.experiments[iBeaver][0] === null) {
               showFeedback(taskStrings.emptyExperiment);
               return;
            }
         }
      }
      showFeedback(null);
      answer.state = "after";
      performUserExperiments();
      updateButtonState();
   }

   function clickReshuffle() {
      if(answer.state == "before") {
         return;
      }
      answer.state = "before";
      var experiments = answer.experiments;
      answer = subTask.getDefaultAnswerObject();
      answer.experiments = experiments;
      randomizePotions();
      drawInitialExperimentBeavers();
      dragAndDrop2.removeAllObjects("answerSlots");
      fillAnswerContainers();
      unhighlightWrong();

      updateButtonState();
   }

   function updateButtonState() {
      if(answer.state == "before") {
         reshuffleButton.hide();
         drinkButton.show();
      }
      else {
         drinkButton.hide();
         reshuffleButton.show();
      }
   }

   function drawInitialExperimentBeavers() {
      if(!experimentBeavers) {
         experimentBeavers = {};
      }
      for(var index = 0; index < data[level].beavers; index++) {
         var centerX = experimentParams.firstCenterX + index * (experimentParams.beaverXPad);
         if(experimentBeavers[index] && experimentBeavers[index].raphael) {
            experimentBeavers[index].raphael.remove();
         }
         experimentBeavers[index] = {
            raphael: drawBeaver(paper1, centerX, experimentParams.beaverCenterY[level], null, data[level].showText, false),
            centerX: centerX
         };
      }
   }

   function performUserExperiments() {
      for(var iBeaver = 0; iBeaver < data[level].beavers; iBeaver++) {
         var properties = {};
         var cupsIDs = dragAndDrop1.getObjects("cupSlots_" + iBeaver);
         for(var iCup = 0; iCup < data[level].experimentCups; iCup++) {
            var cup = dragIDToCup(cupsIDs[iCup]);
            if(cup === null) {
               continue;
            }
            var property = cupToProperty[cup];
            properties[property] = true;
         }
         experimentBeavers[iBeaver].raphael.remove();
         experimentBeavers[iBeaver].raphael = drawBeaver(paper1, experimentBeavers[iBeaver].centerX, experimentParams.beaverCenterY[level], properties, data[level].showText, false);
      }
   }

   function drawCupSlot() {
      return paper1.rect(
         - experimentParams.cupSlotWidth / 2,
         - experimentParams.cupSlotHeight / 2,
         experimentParams.cupSlotWidth,
         experimentParams.cupSlotHeight
      ).attr(experimentParams.cupSlotAttr);
   }

   function actionIfDropped1(srcCont, srcPos, dstCont, dstPos, dropType) {
      showFeedback(null);
      var srcSequence = dragAndDrop1.getObjects(srcCont);

      // If we are dragging a cup from the cup slots outside:
      if(srcCont.substring(0, 8) == "cupSlots" && dstCont == null) {
         return true;
      }

      // If we are dragging a cup onto something, it must be the cup slots.
      if(dstCont == null || dstCont.substring(0, 8) != "cupSlots") {
         return false;
      }
      
      var dstSequence = dragAndDrop1.getObjects(dstCont);

      // Search for rightmost index for insertion.      
      var newIndex = 0;
      for (var i = 0; i < dstSequence.length; i++) {
         if (dstSequence[i] != null) {
            newIndex = i + 1;
         }
      }
      // If this element was already here, one more slot is available.
      if (srcCont == dstCont) {
         newIndex--;
      }
      // Allow insertion in the middle of the list.
      if (dstPos <= newIndex) {
         return true;
      }
      // Only allow appending the current list, no dropping further away to the right.
      if (newIndex < data[level].experimentCups) {
         return DragAndDropSystem.action(dstCont, newIndex, 'insert');
      }
   }

   function actionIfDropped2(srcCont, srcPos, dstCont, dstPos, dropType) {
      showFeedback(null);
      var srcSequence = dragAndDrop2.getObjects(srcCont);

      // If we are dragging a beaver from the answer slots:
      if(srcCont == "answerSlots") {
         var cup = dragIDToCup(srcSequence[srcPos]);
         if(dstCont == "answerSlots") {
            return true;
         }
         // Dragging anywhere else means going back to the original container.
         return DragAndDropSystem.action("sourceBeavers_" + cup, 0, "insert");
      }
      
      // If we are dragging a beaver from its original place:
      if(srcCont.substring(0, 13) == "sourceBeavers") {
         // We can only drag to the answer slots.
         return dstCont == "answerSlots";
      }
   }

   function actionIfEjected2(refElement, srcCont, srcPos) {
      if(srcCont != "answerSlots") {
         return null;
      }
      // Ejected beavers go back to their place.
      var cup = dragIDToCup(refElement.ident);
      return DragAndDropSystem.action("sourceBeavers_" + cup, 0, "insert");
   }

   function canBeTaken1(containerID, position) {
      unhighlightWrong();
      if(answer.state != "before") {
         showFeedback(taskStrings.cupsTooLate);
         return false;
      }
      return true;
   }

   function canBeTaken2(containerID, position) {
      unhighlightWrong();
      if(answer.state == "before") {
         showFeedback(taskStrings.answerTooEarly);
         return false;
      }
      return true;
   }

   function onDrop(srcContainerID, srcPos, dstContainerID, dstPos, dropType) {
      var slots = dragAndDrop2.getObjects("answerSlots");
      for(var cup = 0; cup < data[level].totalCups; cup++) {
         answer.cupToIndex[cup] = dragIDToCup(slots[cup]);
      }
      if(!data[level].experiments) {
         for(var iBeaver = 0; iBeaver < data[level].beavers; iBeaver++) {
            slots = dragAndDrop1.getObjects("cupSlots_" + iBeaver);
            for(var iCup = 0; iCup < data[level].experimentCups; iCup++) {
               answer.experiments[iBeaver][iCup] = dragIDToCup(slots[iCup]);
            }
         }
      }
   }

   function dragIDToCup(id) {
      if(id == null) {
         return null;
      }
      return id.split("_")[1];
   }

   function createFlowGraph() {
      var graph = new Graph(true);
      graph.addVertex("source");
      graph.addVertex("sink");

      var leftID, rightID;
      for(var index = 0; index < data[level].totalCups; index++) {
         leftID = "cup_" + index;
         graph.addVertex(leftID);
         graph.addEdge("source_" + leftID, "source", leftID, {capacity: 1});

         rightID = "property_" + levelProperties[index];
         graph.addVertex(rightID);
         graph.addEdge(rightID + "_sink", rightID, "sink", {capacity: 1});
      }

      for(var leftIndex = 0; leftIndex < data[level].totalCups; leftIndex++) {
         leftID = "cup_" + leftIndex;
         for(var rightIndex = 0; rightIndex < data[level].totalCups; rightIndex++) {
            rightID = "property_" + levelProperties[rightIndex];
            graph.addEdge(leftID + "_" + rightID, leftID, rightID, {capacity: 1});
         }
      }

      return graph;
   }

   function applyExperimentsToFlow(graph) {
      var cup, property;
      var leftID, rightID, edgeID;

      for(var iBeaver = 0; iBeaver < data[level].beavers; iBeaver++) {
         var experiment = answer.experiments[iBeaver];
         
         var participatingCups = {};
         var participatingProperties = {};
         var otherCups = {};
         var otherProperties = {};

         // Get all cups and beaver properties that are present in the experiment.
         for(var iCup = 0; iCup < data[level].experimentCups; iCup++) {
            cup = experiment[iCup];
            if(cup === null) {
               continue;
            }
            participatingCups[cup] = true;
            participatingProperties[cupToProperty[cup]] = true;
         }

         // Get all others.
         for(cup = 0; cup < data[level].totalCups; cup++) {
            if(!participatingCups[cup]) {
               otherCups[cup] = true;
               otherProperties[cupToProperty[cup]] = true;
            }
         }

         // Remove edges from participating to non-participating.
         for(cup in participatingCups) {
            leftID = "cup_" + cup;
            for(property in otherProperties) {
               rightID = "property_" + property;
               edgeID = leftID + "_" + rightID;
               if(graph.isEdge(edgeID)) {
                  graph.removeEdge(edgeID);
               }
            }
         }

         // Remove edges from non-participating to participating.
         for(cup in otherCups) {
            leftID = "cup_" + cup;
            for(property in participatingProperties) {
               rightID = "property_" + property;
               edgeID = leftID + "_" + rightID;
               if(graph.isEdge(edgeID)) {
                  graph.removeEdge(edgeID);
               }
            }
         }
      }
   }

   function checkEdgeDeduction(graph, cup, property) {
      var vertex1ID = "cup_" + cup;
      var vertex2ID = "property_" + property;
      var edgeID = vertex1ID + "_" + vertex2ID;
      var edgeInfo = graph.getEdgeInfo(edgeID);

      if(!graph.isEdge(edgeID)) {
         return false;
      }

      graph.removeEdge(edgeID);
      var maxFlow = graph.getMaxFlow("source", "sink").totalFlow;
      graph.addEdge(edgeID, vertex1ID, vertex2ID, edgeInfo);

      return maxFlow < data[level].totalCups;
   }

   function checkDeduction() {
      var graph = createFlowGraph();
      applyExperimentsToFlow(graph);
      
      for(var cup in answer.cupToIndex) {
         var index = answer.cupToIndex[cup];
         if(index === null) {
            continue;
         }
         var property = levelProperties[index];
         if(!checkEdgeDeduction(graph, cup, property)) {
            return {
               success: false,
               wrongCup: cup,
               wrongProperty: property
            };
         }
      }
      return {
         success: true
      };
   }

   function getResultAndMessage() {
      var numCorrect = 0;
      for(var cup in answer.cupToIndex) {
         var index = answer.cupToIndex[cup];
         if(index !== null && cupToProperty[cup] == levelProperties[index]) {
            numCorrect++;
         }
      }

      if(!data[level].experiments) {
         var deduction = checkDeduction();
         if(!deduction.success) {
            return {
               successRate: 0,
               message: taskStrings.wrongLogic,
               wrongCup: deduction.wrongCup,
               wrongProperty: deduction.wrongProperty
            };
         }
      }

      if(numCorrect === data[level].totalCups) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      } 

      if (level == "hard") {
        if (data[level].totalCups <= 4) {
          alert("Problem with the scoring function, which assumes more than 4 potions.");
        }
        return {
           successRate: (numCorrect - 4) / (data[level].totalCups - 4),
           message: taskStrings.wrongHard(numCorrect, data[level].totalCups)
        };
      } else {
        return {
           successRate: 0,
           message: taskStrings.wrong
        };
      }
   }

   function highlightWrong(cup, property) {
      unhighlightWrong();
      var center = dragContainers.answerSlots.placeCenter(cup);
      wrongHighlighter = paper2.rect(
         center[0] - answerSlotParams.width / 2,
         center[1] - answerSlotParams.height / 2,
         answerSlotParams.width,
         answerSlotParams.height
      ).attr(highlightParams.attr);
   }

   function unhighlightWrong() {
      if(wrongHighlighter) {
         wrongHighlighter.remove();
      }
      wrongHighlighter = null;
   }

   function clickValidate() {
      var resultAndMessage = getResultAndMessage();
      if(resultAndMessage.successRate == 1) {
         platform.validate("done");
         return;
      }
      else {
         if(resultAndMessage.wrongCup !== undefined) {
            highlightWrong(resultAndMessage.wrongCup, resultAndMessage.wrongProperty);
         }
         displayHelper.validate("stay");
      }
   }

   function showFeedback(string) {
      if(string) {
         $("#feedback").html(string);
         $("#feedback").show();
      }
      else {
         $("#feedback").html("");
         $("#feedback").hide();
      }
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
