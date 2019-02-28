function initTask() {
   'use strict';
   var level;
   var state = null;
   var answer = null;
   var gameContainer;
   var paper;
   var paperParams = {
      width: 760,
      height: 480
   };
   var paperText = null;
   var gameVisualData = {
      shapeInitialXOffset: 10,
      shapeDiameter: 20,
      shapeSpacing: 10,
      shapePlatformSpacing: 12,
      bucketWidth: 64,
      bucketHeight: 40,
      bucketShapeOffset: 20,
      bucketSpacing: 10,
      bucketStartX: 200,
      floorAttr: {
         "stroke-width": 4
      },
      shapeAttr: {
         circle: {
            fill: "red"
         },
         square: {
            fill: "cyan"
         },
         diamond: {
            fill: "lightgreen"
         },
         triangle: {
            fill: "yellow"
         }
      },
      platformYDiff: 75,
      platformTree: {
         bucketY: 360,
         lowestPlatformY: 310,
         platformsWidth: [65, 120, 240, 240]
      },
      platformPyramid: {
         bucketY: 420,
         lowestPlatformY: 370,
         platformsWidth: [70, 80, 80, 120, 240]
      },
      slotWidth: 60,
      slotHeight: 65,
      slotPlatformSpacing: 2,
      slotBorderAttr: {
         "stroke-dasharray": "--"
      },
      inventoryX: 2,
      inventoryY: 2,
      inventoryWidth: 150,
      inventoryHeight: 400,
      signWidth: 60,
      signHeight: 65,
      signEllipse: {
         width: 60,
         height: 40
      },
      signRect: {
         width: 120,
         height: 44
      },
      signStickHeight: 25,
      signTextAttr: {
         "font-size": 16,
         "font-weight": "bold"
      },
      signShapeSpacing: 3,
      inventoryHorizontalSpacing: 5,
      inventoryVerticalSpacing: 5,
      markerAttr: {
         "stroke-width": 3,
         "stroke": "blue"
      },
      textValueAttr: {
         "x": 700,
         "y": 20,
         "font-size": 24
      },
      helpTextAttr: {
         x: 655,
         y: 57,
         text: taskStrings.signHelp, 
         "font-size": 16,
         "font-weight": "bold",
         "fill": "red"
      }
   };
   var loopMaxSteps = 3;
   var pixelsPerSecond = 400;
   var milliPerSecond = 1000;
   var signTypes = {
      "circle": new SignType(["circle"]),
      "square": new SignType(["square"]),
      "diamond": new SignType(["diamond"]),
      "triangle": new SignType(["triangle"]),
      "square_triangle":  new SignType(["square", "triangle"]),
      "diamond_circle": new SignType(["diamond", "circle"]),
      "diamond_triangle": new SignType(["diamond", "triangle"]),
      "circle_square": new SignType(["circle", "square"]),
      "circle_triangle": new SignType(["circle", "triangle"]),
      "square_diamond": new SignType(["square", "diamond"]),
      "A3": generateTypeLessThan(3),
      "A4": generateTypeLessThan(4),
      "A5": generateTypeLessThan(5),
      "A6": generateTypeLessThan(6),
      "A+": generateTypeIncrement()
   };
   var data = {
      easy: {
         shapeTypes: ["circle", "square", "diamond", "triangle"],
         bucketTypes: ["circle", undefined, undefined, undefined, "square", undefined, "diamond", "triangle"],
         signIDs: ["circle", "square", "diamond", "triangle"],
         structure: gameVisualData.platformTree
      },
      medium: {
         shapeTypes: ["circle", "square", "diamond", "triangle"],
         bucketTypes: ["circle", undefined, undefined, "diamond", "square", undefined, undefined, "triangle"],
         signIDs: ["square_triangle", "diamond_circle", "diamond_triangle", "circle_square", "circle_triangle", "square_diamond"],
         structure: gameVisualData.platformTree
      },
      hard: {
         shapeTypes: ["circle", "square", "diamond", "triangle", "circle", "square", "diamond", "triangle"],
         bucketTypes: ["circle", "triangle", "diamond", "diamond", "square", "circle", "square", "triangle"],
         signIDs: ["square_triangle", "diamond_circle", "diamond_triangle", "circle_square", "circle_triangle", "square_diamond", "A3", "A4", "A5", "A6"],
         structure: gameVisualData.platformPyramid
      }
   };

   task.load = function(views, callback) {
      initHandlers();
      
      displayHelper.hideValidateButton = true;
      displayHelper.timeoutMinutes = 10;
      displayHelper.setupLevels();

      if (views.solution) {
         $("#solution").show();
      }

      callback();
   };

   task.getDefaultStateObject = function() {
      return { level: "easy" };
   };

   task.getStateObject = function() {
      state.level = level;
      return state;
   };

   task.reloadStateObject = function(stateObj, display) {
      state = stateObj;
      level = state.level;
      
      if(gameContainer) {
         gameContainer.resetSimulation();
      }
      
      gameContainer = new GameContainer(level, gameVisualData);

      if (display) {
         if(paper) {
            paper.remove();
            paperText = null;
         }
         paper = new Raphael("anim", paperParams.width, paperParams.height);
         gameContainer.draw(paper);
         updatePlayButton();
      }
   };

   task.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
      gameContainer.resetSimulation();
      gameContainer.loadUserSigns(answer[level]);
      updatePlayButton();
   };

   task.getAnswerObject = function() {
      answer[level] = gameContainer.getUserSigns();
      return answer;
   };

   task.getDefaultAnswerObject = function() {
      return {
         easy: {},
         medium: {},
         hard: {}
      };
   };
   
   var initData = function(curLevel) {
      var processedData = $.extend(true, {}, data[curLevel]);
      var structure = data[curLevel].structure;
      // Bottom up.
      var buckets = [];
      for(var iBucket = 0; iBucket < processedData.bucketTypes.length; iBucket++) {
         buckets.push(new Bucket(iBucket, gameVisualData.bucketStartX + iBucket * (gameVisualData.bucketWidth + gameVisualData.bucketSpacing), structure.bucketY, processedData.bucketTypes[iBucket], gameVisualData));
      }
      
      var platforms = [];
      var numHeights = structure.platformsWidth.length;
      var platformsByHeight = [];
      var iPlatform, xPos, iHeight, yPos, currentWidth;
      var platform;
      
      for(iHeight = 0; iHeight < numHeights; iHeight++) {
         platformsByHeight.push([]);
      }
      
      // Lowest platforms.
      for(iPlatform = 0; iPlatform < processedData.bucketTypes.length / 2; iPlatform++) {
         xPos = buckets[2 * iPlatform].centerX + gameVisualData.bucketWidth / 2 + gameVisualData.bucketSpacing / 2;
         platform = new Platform("0-" + iPlatform, xPos, structure.lowestPlatformY, structure.platformsWidth[0], [], [], buckets[2 * iPlatform], buckets[2 * iPlatform + 1], gameVisualData);
         platforms.push(platform);
         platformsByHeight[0].push(platform);
      }
      
      // All the mid-heights (between lowest and top, exclusive).
      for(iHeight = 1; iHeight < numHeights - 1; iHeight++) {
         currentWidth = structure.platformsWidth[iHeight];
         yPos = structure.lowestPlatformY - iHeight * gameVisualData.platformYDiff;
         var previousRow = platformsByHeight[iHeight - 1];
         if(structure == gameVisualData.platformPyramid) {
            for(iPlatform = 0; iPlatform < previousRow.length - 1; iPlatform++) {
               xPos = (previousRow[iPlatform].centerX + previousRow[iPlatform + 1].centerX) / 2;
               platform = new Platform(iHeight + "-" + iPlatform, xPos, yPos, currentWidth, [], [], previousRow[iPlatform], previousRow[iPlatform + 1], gameVisualData);
               platformsByHeight[iHeight].push(platform);
               platforms.push(platform);
            }
         }
         else {
            for(iPlatform = 0; iPlatform < previousRow.length / 2; iPlatform++) {
               xPos = (previousRow[2 * iPlatform].centerX + previousRow[2 * iPlatform + 1].centerX) / 2;
               platform = new Platform(iHeight + "-" + iPlatform, xPos, yPos, currentWidth, [], [], previousRow[2 * iPlatform], previousRow[2 * iPlatform + 1], gameVisualData);
               platformsByHeight[iHeight].push(platform);
               platforms.push(platform);
            }
         }
      }
      
      // Top platform.
      currentWidth = structure.platformsWidth[numHeights - 1];
      xPos = gameVisualData.bucketStartX + currentWidth / 2;
      yPos = structure.lowestPlatformY - (numHeights - 1) * gameVisualData.platformYDiff;
      platform = new Platform("top", xPos, yPos, currentWidth, [], [], undefined, platformsByHeight[numHeights - 2][0], gameVisualData);
      platforms.push(platform);
      
      // Slots on all platforms except the top one.
      for(iPlatform = 0; iPlatform < platforms.length - 1; iPlatform++) {
         platforms[iPlatform].addSlot(new Slot(iPlatform + "-left", platforms[iPlatform].left, platforms[iPlatform].centerY, gameVisualData));
         platforms[iPlatform].addSlot(new Slot(iPlatform + "-right", platforms[iPlatform].right, platforms[iPlatform].centerY, gameVisualData));
      }
      
      // A++ sign on the top of hard.
      if(curLevel == "hard") {
         var topPlatform = platforms[platforms.length - 1];
         var incSign = new Sign("A+", signTypes["A+"], topPlatform.right, topPlatform.centerY, gameVisualData);
         platforms[platforms.length - 1].addFixedSign(incSign);
      }
      
      processedData.platforms = platforms;
      processedData.buckets = buckets;
      processedData.initialPlatform = platforms[platforms.length - 1];
      return processedData;
   };
   
   function generateTypeLessThan(conditionValue) {
      var conditionFunc = function(simulationData) {
         return simulationData.visualData.valueA < conditionValue;
      };
      return new SignType([], "≤ " + (conditionValue - 1), conditionFunc);
   }
   
   function generateTypeIncrement() {
      var actionFunc = function(simulationData) {
         if(simulationData.visualData.valueA === undefined) {
            simulationData.visualData.valueA = 1;
         }
         else {
            simulationData.visualData.valueA++;
         }
      };
      var visualActionFunc = function(visualData) {
         setVisualVariable(visualData.valueA);
      };
      
      return new SignType([], taskStrings.add1ToA, undefined, actionFunc, visualActionFunc, gameVisualData.signRect);
   }
   
   var initHandlers = function() {
      $("#playPause").click(function() {
         gameContainer.playPauseSimulation();
         updatePlayButton();
      });
      $("#stop").click(function() {
         gameContainer.resetSimulation();
      });
   };
   
   var updatePlayButton = function() {
      var text;
      if(!gameContainer || !gameContainer.simulation || gameContainer.simulationDone) {
         $("#playPause").val(taskStrings.playButton);
         return;
      }
      
      if(gameContainer.simulation.isPlaying()) {
         $("#playPause").val(taskStrings.pauseButton);
      }
      else {
         $("#playPause").val(taskStrings.playButton);
      }
   };
   
   function Slot(id, centerX, bottomY, gameVisualData) {
      this.id = id;
      this.draw = function(paper) {
         this.border = paper.rect(centerX - gameVisualData.slotWidth / 2, bottomY - gameVisualData.slotHeight - gameVisualData.slotPlatformSpacing, gameVisualData.slotWidth, gameVisualData.slotHeight).attr(gameVisualData.slotBorderAttr).hide();
         this.overlay = paper.rect(centerX - gameVisualData.slotWidth / 2, bottomY - gameVisualData.slotHeight - gameVisualData.slotPlatformSpacing, gameVisualData.slotWidth, gameVisualData.slotHeight).attr({fill: "red", opacity: 0});
         this.overlay.data("slot", this);
         this.drawSign(paper);
      };
      this.drawSign = function(paper) {
         if(this.sign) {
            this.sign.draw(paper);
         }
         this.overlay.toFront();
      };
      this.setSign = function(signID) {
         this.sign = new Sign(signID, signTypes[signID], centerX, bottomY, gameVisualData);
      };
      this.getSign = function() {
         return this.sign;
      };
      this.removeSign = function() {
         if(this.sign) {
            this.sign.remove();
         }
         this.sign = undefined;
      };
      this.click = function(handler) {
         this.overlay.click(handler);
      };
      this.showBorder = function() {
         this.border.show();
      };
      this.hideBorder = function() {
         this.border.hide();
      };
   }
   
   function SignType(blockedShapes, text, conditionFunc, actionFunc, visualActionFunc, signContentAttr) {
      /*
      Sign data holder.
      blockedShapes is the list of shape types to block (and draw on sign).
      text is optional string on the sign.
      conditionFunc is optional function to test if blocking is needed, when a shape meets the sign.
      It gets the simulation data, and should return true if need to block.
      actionFunc will be executed when the shape meets the sign.
      visualActionFunc will be executed when the shape meets the sign visually.
      Both action functions get the simulation data object.
      */
      this.init = function() {
         this.text = text;
         this.conditionFunc = conditionFunc;
         this.actionFunc = actionFunc;
         this.visualActionFunc = visualActionFunc;
         this.signContentAttr = signContentAttr;
         if(!signContentAttr) {
            this.signContentAttr = gameVisualData.signEllipse;
         }
         
         this.blockedShapes = {};
         for(var iShape in blockedShapes) {
            this.blockedShapes[blockedShapes[iShape]] = true;
         }
      };
      this.isBlocked = function(simulationData) {
         if(this.blockedShapes[simulationData.currentShape.shapeType] !== undefined) {
            return true;
         }
         if(conditionFunc !== undefined && conditionFunc !== null) {
            return conditionFunc(simulationData);
         }
         return false;
      };
      this.performAction = function(simulationData) {
         if(actionFunc) {
            actionFunc(simulationData);
         }
      };
      this.performVisualAction = function(params, duration, callback) {
         if(visualActionFunc) {
            visualActionFunc(params);
         }
         callback();
      };
      this.getBlockedShapes = function() {
         return blockedShapes;
      };
      
      this.init();
   }
   
   function Sign(id, signType, centerX, baseY, gameVisualData) {
      this.id = id;
      this.signType = signType;
      this.centerX = centerX;
      this.draw = function(paper) {
         this.stick = paper.path(["M", centerX, baseY, "V", baseY - gameVisualData.signStickHeight]);
         
         var signContentY = baseY - gameVisualData.signStickHeight - signType.signContentAttr.height / 2;
         if(signType.signContentAttr == gameVisualData.signEllipse) {
            this.contentBorder = paper.ellipse(centerX, signContentY, signType.signContentAttr.width / 2, signType.signContentAttr.height / 2);
         }
         else if(signType.signContentAttr == gameVisualData.signRect) {
            this.contentBorder = paper.rect(centerX - signType.signContentAttr.width / 2, signContentY - signType.signContentAttr.height / 2, signType.signContentAttr.width, signType.signContentAttr.height);
         }
         
         this.shapes = [];
         var blockedShapes = signType.getBlockedShapes();
         var totalShapesWidth = blockedShapes.length * gameVisualData.shapeDiameter + (blockedShapes.length - 1) * gameVisualData.signShapeSpacing;
         var baseX = centerX - totalShapesWidth / 2;
         var yPos = baseY - gameVisualData.signStickHeight - signType.signContentAttr.height / 2;
         for(var iShape = 0; iShape < blockedShapes.length; iShape++) {
            var shapeType = blockedShapes[iShape];
            var xPos = baseX + iShape * (gameVisualData.shapeDiameter + gameVisualData.signShapeSpacing) + gameVisualData.shapeDiameter / 2;
            var shape = new Shape(shapeType, xPos, yPos, gameVisualData);
            shape.draw(paper);
            this.shapes.push(shape);
         }
         
         if(signType.text !== undefined && signType.text !== null) {
            this.text = paper.text(centerX, yPos, signType.text).attr(gameVisualData.signTextAttr);
         }
      };
      this.remove = function() {
         if(!this.stick) {
            return;
         }
         this.stick.remove();
         this.contentBorder.remove();
         for(var iShape = 0; iShape < this.shapes.length; iShape++) {
            this.shapes[iShape].remove();
         }
         if(this.text) {
            this.text.remove();
         }
      };
      this.isBlocked = function(simulationData) {
         return signType.isBlocked(simulationData);
      };
   }
   
   function Bucket(id, centerX, centerY, shapeType, gameVisualData) {
      this.id = id;
      this.left = centerX - gameVisualData.bucketWidth / 2;
      this.right = this.left + gameVisualData.bucketWidth;
      this.top = centerY - gameVisualData.bucketHeight / 2;
      this.bottom = this.top + gameVisualData.bucketHeight;
      this.centerX = centerX;
      this.centerY = centerY;
      this.shapeType = shapeType;
      
      this.draw = function(paper) {
         this.raphael = paper.path(["M", this.left, this.top, "V", this.bottom, "H", this.right, "V", this.top]).attr(gameVisualData.floorAttr);
         if(shapeType !== undefined) {
            this.shape = new Shape(shapeType, centerX, this.bottom + gameVisualData.bucketShapeOffset, gameVisualData);
            this.shape.draw(paper);
         }
         return this.raphael;
      };
      this.getRaphael = function() {
         return this.raphael;
      };
   }
   
   function Shape(shapeType, centerX, centerY, gameVisualData) {
      this.shapeType = shapeType;
      this.centerX = centerX;
      this.radius = gameVisualData.shapeDiameter / 2;
      this.diameter = gameVisualData.shapeDiameter;
      
      this.draw = function(paper) {
         if(shapeType == "square") {
            this.raphael = paper.rect(- this.radius, - this.radius, this.diameter, this.diameter);
         }
         else if(shapeType == "circle") {
            this.raphael = paper.circle(0, 0, this.radius);
         }
         else if(shapeType == "diamond") {
            this.originalPath = ["M", - this.radius, 0, "L", 0, - this.radius, "L", this.radius, 0, "L", 0, this.radius, "Z"];
            this.raphael = paper.path(this.originalPath);
         }
         else if(shapeType == "triangle") {
            this.originalPath = ["M", - this.radius, this.radius, "L", this.radius, this.radius, "L", 0, - this.radius, "Z"];
            this.raphael = paper.path(this.originalPath);
         }
         this.raphael.attr(gameVisualData.shapeAttr[shapeType]);
         this.defaultPositionObject = this.getAnimationObject({
            x: centerX,
            y: centerY
         });
         this.resetPosition();
         return this.raphael;
      };
      this.getRaphael = function() {
         return this.raphael;
      };
      this.toFront = function() {
         if(this.raphael) {
            this.raphael.toFront();
         }
      };
      this.remove = function() {
         this.raphael.remove();
      };
      this.resetPosition = function() {
         if(!this.raphael) {
            return;
         }
         this.raphael.attr(this.defaultPositionObject);
      };
      this.getAnimationObject = function(targetPosition) {
         if(this.originalPath) {
            return {
               path: Raphael.transformPath(this.originalPath, ["T", targetPosition.x, targetPosition.y])
            };
         }
         if(this.shapeType == "circle") {
            return {
               cx: targetPosition.x,
               cy: targetPosition.y
            };
         }
         if(this.shapeType == "square") {
            return {
               x: targetPosition.x - this.radius,
               y: targetPosition.y - this.radius
            };
         }
      };
   }
   
   function Platform(id, centerX, centerY, length, fixedSigns, slots, nextLeft, nextRight, gameVisualData) {
      this.id = id;
      this.left = centerX - length / 2;
      this.right = this.left + length;
      this.bottom = centerY;
      this.centerX = centerX;
      this.centerY = centerY;
      this.nextLeft = nextLeft;
      this.nextRight = nextRight;
      this.slots = slots;
      this.fixedSigns = fixedSigns;
      
      this.draw = function(paper) {
         this.raphael = paper.path(["M", this.left, centerY, "H", this.right]).attr(gameVisualData.floorAttr);
         for(var iSign in fixedSigns) {
            //fixedSigns[iSign].draw(paper);
         }
         for(var iSlot in slots) {
            slots[iSlot].draw(paper);
         }
      };
      this.getAllSigns = function() {
         var signs = $.extend([], this.fixedSigns);
         for(var iSlot in slots) {
            var slotSign = slots[iSlot].getSign();
            if(slotSign) {
               signs.push(slotSign);
            }
         }
         return signs;
      };
      this.addSlot = function(slot) {
         slots.push(slot);
      };
      this.getSlots = function() {
         return slots;
      };
      this.addFixedSign = function(sign) {
         this.fixedSigns.push(sign);
      };
   }
   
   function Inventory(signIDs, slots, setSignHandler, gameVisualData) {
      var self = this;
      this.rowSize = Math.floor((gameVisualData.inventoryWidth - gameVisualData.inventoryHorizontalSpacing) / (gameVisualData.signWidth + gameVisualData.inventoryHorizontalSpacing));
      this.draw = function(paper) {
         this.paper = paper;
         paper.rect(gameVisualData.inventoryX, gameVisualData.inventoryY, gameVisualData.inventoryWidth, gameVisualData.inventoryHeight);
         this.signOverlays = [];
         for(var iSign = 0; iSign < signIDs.length; iSign++) {
            var left = gameVisualData.inventoryHorizontalSpacing + gameVisualData.inventoryX + (iSign % this.rowSize) * (gameVisualData.signWidth + gameVisualData.inventoryHorizontalSpacing);
            var centerX = left + gameVisualData.signWidth / 2;
            var top = gameVisualData.inventoryVerticalSpacing + gameVisualData.inventoryY + Math.floor(iSign / this.rowSize) * (gameVisualData.signHeight + gameVisualData.inventoryVerticalSpacing);
            var bottom = top + gameVisualData.signHeight;
            var signID = signIDs[iSign];
            var sign = new Sign(signID, signTypes[signID], centerX, bottom, gameVisualData);
            sign.draw(paper);
            
            var overlay = paper.rect(left, top, gameVisualData.signWidth, gameVisualData.signHeight).attr({fill: "red", opacity: 0});
            overlay.data("index", iSign);
            overlay.mousedown(this.clickInventory);
            this.signOverlays.push(overlay);
         }
         for(var iSlot in slots) {
            slots[iSlot].click(this.clickSlot);
         }
         
         this.marker = paper.rect(0, 0, gameVisualData.signWidth, gameVisualData.signHeight).attr(gameVisualData.markerAttr).hide();
         this.markerIndex = null;
         this.helpText = paper.text().attr(gameVisualData.helpTextAttr).hide();
      };
      this.setMarker = function(index) {
         if(!(this.paper)) {
            return;
         }
         this.markerIndex = index;
         if(index === null || index === undefined) {
            this.marker.hide();
            this.hideSlots();
            this.hideHelp();
         }
         else {
            this.marker.attr({
               x: this.signOverlays[index].attrs.x,
               y: this.signOverlays[index].attrs.y
            });
            this.marker.show();
            this.showSlots();
            this.showHelp();
         }
      };
      this.hideSlots = function() {
         for(var iSlot in slots) {
            slots[iSlot].hideBorder();
         }
      };
      this.showSlots = function() {
         for(var iSlot in slots) {
            slots[iSlot].showBorder();
         }
      };
      this.clickInventory = function() {
         var index = this.data("index");
         if(self.markerIndex === index) {
            self.setMarker(null);
         }
         else {
            self.setMarker(index);
         }
         setSignHandler();
      };
      this.clickSlot = function() {
         var slot = this.data("slot");
         if(self.markerIndex === undefined || self.markerIndex === null) {
            setSignHandler(self.paper, slot, undefined);
         }
         else {
            setSignHandler(self.paper, slot, signIDs[self.markerIndex]);
         }
         self.setMarker(null);
      };
      this.showHelp = function() {
         if(!this.helpText) {
            return;
         }
         this.helpText.show();
      };
      this.hideHelp = function() {
         if(!this.helpText) {
            return;
         }
         this.helpText.hide();
      };
   }
   
   function GameContainer(curLevel, gameVisualData) {
      var gameData = initData(curLevel);
      var self = this;
      this.init = function() {
         this.platforms = gameData.platforms;
         this.buckets = gameData.buckets;
         this.shapeTypes = gameData.shapeTypes;
         this.userSignTypes = gameData.userSignTypes;
         this.initialPlatform = gameData.initialPlatform;
         
         this.shapeInitialX = this.initialPlatform.left + gameVisualData.shapeInitialXOffset;
         this.shapes = [];
         for(var iShapeType = 0; iShapeType < this.shapeTypes.length; iShapeType++) {
            var xPos = this.shapeInitialX + iShapeType * (gameVisualData.shapeDiameter + gameVisualData.shapeSpacing);
            var yPos = this.initialPlatform.centerY - gameVisualData.shapePlatformSpacing;
            var shape = new Shape(this.shapeTypes[iShapeType], xPos, yPos, gameVisualData);
            this.shapes.push(shape);
         }
         this.slots = [];
         for(var iPlatform in gameData.platforms) {
            var currentSlots = gameData.platforms[iPlatform].getSlots();
            this.slots = this.slots.concat(currentSlots);
         }
         this.inventory = new Inventory(gameData.signIDs, this.slots, this.setSignHandler, gameVisualData);
         this.slotsToSignIDs = {};
      };
      this.draw = function(paper) {
         this.paper = paper;
         setVisualVariable(0);
         for(var iPlatform in this.platforms) {
            this.platforms[iPlatform].draw(paper);
         }
         for(var iBucket in this.buckets) {
            this.buckets[iBucket].draw(paper);
         }
         for(var iShape in this.shapes) {
            this.shapes[iShape].draw(paper);
         }
         this.inventory.draw(paper);
      };
      this.setSignHandler = function(paper, slot, signID) {
         self.resetSimulation();
         if(!paper) {
            return;
         }
         self.slotsToSignIDs[slot.id] = signID;
         slot.removeSign();
         if(signID !== undefined && signID !== null) {
            slot.setSign(signID);
            slot.drawSign(paper);
         }
      };
      this.loadUserSigns = function(slotsToSignIDs) {
         this.slotsToSignIDs = slotsToSignIDs;
         for(var iSlot in this.slots) {
            var slot = this.slots[iSlot];
            var slotID = this.slots[iSlot].id;
            slot.removeSign();
            if(slotsToSignIDs && slotsToSignIDs[slotID] !== undefined) {
               slot.setSign(slotsToSignIDs[slotID]);
               if(this.paper) {
                  slot.drawSign(this.paper);
               }
            }
         }
      };
      this.getUserSigns = function() {
         return this.slotsToSignIDs;
      };
      this.createSimulation = function() {
         this.inventory.setMarker(null);
         this.simulation = new Simulation();
         this.simulationDone = false;
         var simulationData = {
            currentShape: null,
            currentDir: 1,
            currentFloor: this.initialPlatform,
            currentPosition: null,
            visualData: {},
            bucketContents: {}
         };
         for(var iShape = this.shapes.length - 1; iShape >= 0; iShape--) {
            var shape = this.shapes[iShape];
            simulationData.currentShape = shape;
            simulationData.currentPosition = {
               x: shape.centerX,
               y: this.initialPlatform.centerY - gameVisualData.shapePlatformSpacing
            };
            simulationData.currentDir = 1;
            simulationData.currentFloor = this.initialPlatform;
            var resultAndMessage = this.simulationShape(simulationData);
            if(resultAndMessage.result != "correct") {
               this.simulationAddValidate(false);
               if(curLevel == "hard" && iShape <= 2) {
                  resultAndMessage.completion = (38 - (iShape + 1) * 2) / 40;
               }
               else {
                  resultAndMessage.completion = 0;
               }
               return resultAndMessage;
            }
         }
         
         this.simulationAddValidate(true);
         return {
            result: "correct",
            completion: 1
         };
      };
      this.simulationAddValidate = function(success) {
         function validate(params, duration, callback) {
            if(success) {
               platform.validate("done");
            }
            else {
               displayHelper.validate("stay");
            }
            self.simulationDone = true;
            updatePlayButton();
            callback();
         }
         this.simulation.addStepWithEntry({
            name: "validate",
            action: {
               onExec: validate
            }
         });
      };
      this.simulationShape = function(simulationData) {
         var shape = simulationData.currentShape;
         shape.toFront();
         while(!(simulationData.currentFloor instanceof Bucket)) {
            var success = this.simulationShapePlatform(simulationData);
            if(!success) {
               return {
                  result: "shape_loop",
                  message: taskStrings.shapeLoop
               };
            }
         }
         var bucketID = simulationData.currentFloor.id;
         if(simulationData.bucketContents[bucketID] !== undefined) {
            return {
               result: "bucket_filled",
               message: taskStrings.fullBucket
            };
         }
         if(simulationData.currentFloor.shapeType === shape.shapeType) {
            simulationData.bucketContents[bucketID] = shape.shapeType;
            return {
               result: "correct"
            };
         }
         return {
            result: "incorrect_bucket",
            message: taskStrings.wrongBucket
         };
      };
      this.simulationShapePlatform = function(simulationData) {
         var signs = simulationData.currentFloor.getAllSigns();
         signs.sort(function(sign1, sign2) {
            return sign1.centerX - sign2.centerX;
         });
         
         var signHitCounts = {};
         var nextSignIndex = this.getNextSignIndex(simulationData, signs);
         while(nextSignIndex !== null && nextSignIndex < signs.length && nextSignIndex >= 0) {
            var currentSign = signs[nextSignIndex];
            if(signHitCounts[nextSignIndex] === undefined) {
               signHitCounts[nextSignIndex] = 1;
            }
            else {
               signHitCounts[nextSignIndex]++;
               if(signHitCounts[nextSignIndex] >= loopMaxSteps) {
                  return false;
               }
            }
            this.simulationShapeSign(simulationData, currentSign);
            nextSignIndex += simulationData.currentDir;
         }
         
         var targetX, targetY;
         if(simulationData.currentDir == 1) {
            targetX = simulationData.currentFloor.right + gameVisualData.shapeDiameter / 2;
            targetY = simulationData.currentFloor.nextRight.bottom;
            simulationData.currentFloor = simulationData.currentFloor.nextRight;
         }
         else {
            targetX = simulationData.currentFloor.left - gameVisualData.shapeDiameter / 2;
            targetY = simulationData.currentFloor.nextLeft.bottom;
            simulationData.currentFloor = simulationData.currentFloor.nextLeft;
         }
         targetY -= gameVisualData.shapePlatformSpacing;
         this.simulationShapeMove("go to edge", simulationData, {
            x: targetX
         });
         simulationData.currentPosition.x = targetX;
         this.simulationShapeMove("jump down", simulationData, {
            y: targetY
         });
         simulationData.currentPosition.y = targetY;
         return true;
      };
      this.getNextSignIndex = function(simulationData, signs) {
         if(signs.length === 0) {
            return null;
         }
         if(simulationData.currentDir == -1 && simulationData.currentPosition.x > signs[signs.length - 1].centerX) {
            return signs.length - 1;
         }
         if(simulationData.currentDir == 1 && simulationData.currentPosition.x < signs[0].centerX) {
            return 0;
         }
         for(var iSign = 0; iSign < signs.length - 1; iSign++) {
            if(signs[iSign].centerX < simulationData.currentPosition.x && simulationData.currentPosition.x < signs[iSign + 1].centerX) {
               if(simulationData.currentDir == 1) {
                  return iSign + 1;
               }
               else {
                  return iSign;
               }
            }
         }
      };
      this.simulationShapeSign = function(simulationData, sign) {
         var targetX = sign.centerX - simulationData.currentDir * (gameVisualData.shapeDiameter / 2);
         this.simulationShapeMove("go to sign", simulationData, {
            x: targetX
         });
         simulationData.currentPosition.x = targetX;
         sign.signType.performAction(simulationData);
         this.simulation.addStepWithEntry({
            name: "visual action",
            action: {
               onExec: sign.signType.performVisualAction,
               params: $.extend(true, {}, simulationData.visualData)
            }
         });
         
         if(sign.isBlocked(simulationData)) {
            simulationData.currentDir *= -1;
         }
      };
      this.simulationShapeMove = function(name, simulationData, targetPosition) {
         var shape = simulationData.currentShape;
         if(targetPosition.x === undefined) {
            targetPosition.x = simulationData.currentPosition.x;
         }
         if(targetPosition.y === undefined) {
            targetPosition.y = simulationData.currentPosition.y;
         }
         
         function animation(params, duration, callback) {
            return shape.getRaphael().animate(shape.getAnimationObject(targetPosition), duration, callback);
         }
         
         var duration = distanceToDuration(simulationData.currentPosition, targetPosition);
         this.simulation.addStepWithEntry({
            name: name,
            action: {
               onExec: animation,
               duration: duration
            }
         });
      };
      this.createAndPlaySimulation = function() {
         this.resetSimulation();
         this.createSimulation();
         this.simulation.setAutoPlay(true);
         this.simulation.play();
      };
      this.playPauseSimulation = function() {
         if(!this.simulation) {
            this.createAndPlaySimulation();
            return;
         }
         if(this.simulation.isPlaying()) {
            this.simulation.stop();
            return;
         }
         if(!this.simulationDone) {
            this.simulation.play();
            return;
         }
         this.createAndPlaySimulation();
      };
      this.resetSimulation = function() {
         this.simulationDone = false;
         if(this.paper) {
            setVisualVariable(0);
         }
         if(this.simulation) {
            this.simulation.stop();
            this.simulation = null;
         }
         this.resetPositions();
         updatePlayButton();
      };
      this.resetPositions = function() {
         for(var iShape in this.shapes) {
            this.shapes[iShape].resetPosition();
         }
      };
      
      this.init();
   }
   function setVisualVariable(value) {
      if(!paper || level != "hard") {
         return;
      }
      if(paperText === null || paperText === undefined) {
         paperText = paper.text().attr(gameVisualData.textValueAttr);
      }
      paperText.attr({text: "Objet " + value});
   }
   var distanceToDuration = function(currentPosition, targetPosition) {
      var distance = 0;
      if(targetPosition.x !== undefined) {
         distance += Math.abs(currentPosition.x - targetPosition.x);
      }
      if(targetPosition.y !== undefined) {
         distance += Math.abs(currentPosition.y - targetPosition.y);
      }
      return milliPerSecond * distance / pixelsPerSecond;
   };
   grader.gradeTask = function(strAnswer, token, callback) {
      task.getLevelGrade(strAnswer, token, callback, null);
   };

   task.getLevelGrade = function(strAnswer, token, callback, gradedLevel) {
      platform.getTaskParams(null, null, function(taskParams) {
         if (strAnswer === '') {
            callback(taskParams.minScore, '');
            return;
         }
         var answer = $.parseJSON(strAnswer);
         var scores = {};
         var messages = {};
         var maxScores = displayHelper.getLevelsMaxScores();

         for (var curLevel in data) {
            var gameContainer = new GameContainer(curLevel, gameVisualData);
            gameContainer.loadUserSigns(answer[curLevel]);
            var resultAndMessage = gameContainer.createSimulation();
            if(resultAndMessage.result == "correct") {
               scores[curLevel] = maxScores[curLevel];
               messages[curLevel] = taskStrings.success;
            }
            else if(resultAndMessage.completion > 0) {
               scores[curLevel] = maxScores[curLevel] * resultAndMessage.completion;
               messages[curLevel] = resultAndMessage.message;
            }
            else {
               scores[curLevel] = taskParams.noScore;
               messages[curLevel] = resultAndMessage.message;
            }
         }

         if (!gradedLevel) {
            displayHelper.sendBestScore(callback, scores, messages);
         } else {
            callback(scores[gradedLevel], messages[gradedLevel]);
         }
      });
   };
}
initTask();
