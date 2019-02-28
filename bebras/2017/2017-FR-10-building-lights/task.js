function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      easy: {
         initial: [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, null, null, 0]
         ],
         target: [
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [0, 1, 1, 0],
            [0, 1, 1, 0],
            [0, null, null, 0]
         ],
         allowInvert: false,
         numSlots: 4,
         animTime: 1000
      },
      medium: {
         initial: [
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, 1, 1, 1],
            [1, null, null, 1]
         ],
         target: [
            [1, 0, 0, 1],
            [0, 0, 0, 0],
            [1, 0, 0, 1],
            [1, 0, 0, 1],
            [0, 0, 0, 0],
            [1, 0, 0, 1],
            [1, null, null, 1]
         ],
         allowInvert: true,
         numSlots: 8,
         animTime: 1000
      },
      hard: {
         initial: [
            [0, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 0, 0],
            [0, 1, 1, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 0],
            [0, null, null, 0]
         ],
         target: [
            [0, 0, 0, 0],
            [1, 1, 1, 1],
            [1, 0, 0, 1],
            [1, 1, 1, 1],
            [1, 0, 0, 1],
            [0, 0, 0, 0],
            [0, null, null, 0]
         ],
         allowInvert: true,
         numSlots: 15,
         animTime: 700
      }
   };

   var paperDrag;
   var simulation;
   var dragAndDrop;
   var userVisual;
   var userVisualConfig;
   var slotPlaces;
   var slotHighlight;

   var rows;
   var cols;

   var buildingParams = {
      xPad: 2,
      topPad: 30,
      scale: 1,
      windows: {
         xPad: 10,
         topPad: 10,
         bottomPad: 20,
         xSpacing: 10,
         ySpacing: 10,
         width: 20,
         height: 24,
         attr: {
            0: {
               fill: "#512ca0",
               stroke: "#905298"
            },
            1: {
               fill: "#ffff00",
               stroke: "#dac05c"
            }
         }
      },
      floor: {
         width: 360,
         height: 15,
         attr: {
            fill: "#006100",
            stroke: "#006100"
         }
      },
      wall: {
         attr: {
            fill: "#afb8c1"
         }
      },
      doors: {
         width: 20,
         height: 45,
         xSpacing: 5,
         bottomPad: 4,
         attr: {
            fill: "#aa1314",
            stroke: "#aa1314"
         }
      },
      trees: {
         // Horizontal ratios where trees should be placed.]
         xRatios: [0.08, 0.2, 0.8, 0.92],
         height: 50,
         baseWidth: 25,
         baseAttr: {
            fill: "#006100",
            stroke: "#006100"
         },
         pieRadius: 18,
         pieAngle: 60,
         pieAttr: {
            fill: "#b36100",
            stroke: "#b36100"
         }
      },
      text: {
         xPad: 16,
         yPad: 16,
         attr: {
            "font-size": 18
         }
      }
   };

   var dragParams = {
      xPad: 2,
      yPad: 2,
      slot: {
         width: 46,
         height: 80,
         borderAttr: {
            fill: "white",
            "stroke-width": 1,
            r: 10
         },
         yRatiosText: [0.33, 0.66],
         yRatiosInvert: [0.25, 0.75],
         textAttr: {
            "font-size": 18
         },
         windowScale: 1,
         arrowYPad: 1,
         arrowAttr: {
            "stroke-width": 1,
            "arrow-end": "classic-wide-long"
         }
      },
      source: {
         xSpacing: 4,
         borderAttr: {
            fill: "#c3c3c3"
         }
      },
      midSpacing: 10,
      containerBorder: {
         xPad: 8,
         yPad: 8,
         xSpacing: 4,
         attr: {
            fill: "#c3c3c3"
         }
      },
      highlightAttr: {
         stroke: "blue",
         "stroke-width": 3,
         fill: "none"
      }
   };

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      rows = data[level].initial.length;
      cols = data[level].initial[0].length;
      displayHelper.hideValidateButton = true;
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;

      // Not supposed to happen in regular usage.
      if(answer && answer.length !== data[level].numSlots) {
         throw "Answer array has wrong size";
      }
   };

   subTask.resetDisplay = function() {
      initBuildings();
      initDragAndDrop();
      initHandlers();
      setExecuteEnabled(true);
      setStopEnabled(false);
      showFeedback(null);
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return Beav.Array.make(data[level].numSlots, null);
   };

   subTask.unloadLevel = function(callback) {
      if(dragAndDrop) {
         dragAndDrop.disable();
      }
      $("#execute").unbind("click");
      $("#stop").unbind("click");
      callback();
   };

   function initBuildings() {
      userVisual = createVisualInstance("animUser", buildingParams, data[level].initial, true);
      createVisualInstance("animTarget", buildingParams, data[level].target, false);
   }

   function createVisualInstance(elementID, params, config, user) {
      var scale = params.scale;

      // Building size.
      var buildingWidth = (2 * params.windows.xPad + cols * params.windows.width + (cols - 1) * params.windows.xSpacing) * scale;
      var buildingHeight = (params.windows.bottomPad + params.windows.topPad + rows * params.windows.height + (rows - 1) * params.windows.ySpacing) * scale;

      // Paper size.
      var paperWidth = (params.floor.width + 2 * params.xPad) * scale;
      var paperHeight = (params.topPad + params.floor.height) * scale + buildingHeight;
      var paper = subTask.raphaelFactory.create(elementID, elementID, paperWidth, paperHeight);

      // Draw floor.
      var floorY = paperHeight - params.floor.height * scale;
      paper.rect(params.xPad * scale, floorY, params.floor.width * scale, params.floor.height * scale).attr(params.floor.attr);

      // Draw trees.
      var treeHeight = params.trees.height * scale;
      var treeWidth = params.trees.baseWidth * scale;
      var treeTop = floorY - treeHeight;
      var pieRadius = params.trees.pieRadius * scale;
      var pieStartAngle = 90 + params.trees.pieAngle / 2;
      var pieEndAngle = 90 - params.trees.pieAngle / 2;
      for(var iTree in params.trees.xRatios) {
         var xRatio = params.trees.xRatios[iTree];
         var treeCenterX = paperWidth * xRatio;
         paper.path([
            "M", treeCenterX - treeWidth / 2, floorY,
            "L", treeCenterX, treeTop,
            "L", treeCenterX + treeWidth / 2, floorY,
            "Z"
         ]).attr(params.trees.baseAttr);
         var pie = drawPie(paper, treeCenterX, treeTop, pieRadius, pieStartAngle, pieEndAngle);
         pie.attr(params.trees.pieAttr);
      }

      // Draw wall.
      var buildingX = paperWidth / 2 - buildingWidth / 2;
      var buildingY = params.topPad * scale;
      paper.rect(buildingX, buildingY, buildingWidth, buildingHeight).attr(params.wall.attr);
      
      // Draw doors.
      var doorHeight = params.doors.height * scale;
      var doorWidth = params.doors.width * scale;
      var doorSpacing = params.doors.xSpacing * scale;
      var doorsTotalWidth = 2 * doorWidth + doorSpacing;
      var doorY = buildingY + buildingHeight - doorHeight - params.doors.bottomPad * scale;
      var door1X = paperWidth / 2 - doorsTotalWidth / 2;
      var door2X = paperWidth / 2 + doorSpacing / 2;
      paper.rect(door1X, doorY, doorWidth, doorHeight).attr(params.doors.attr);
      paper.rect(door2X, doorY, doorWidth, doorHeight).attr(params.doors.attr);

      // Draw windows.
      var windowWidth = params.windows.width * scale;
      var windowHeight = params.windows.height * scale;
      var windows = Beav.Matrix.init(rows, cols, function(row, col) {
         if(config[row][col] === null) {
            return null;
         }
         var windowX = buildingX + (params.windows.xPad + (params.windows.xSpacing + params.windows.width) * col) * scale;
         var windowY = buildingY + (params.windows.topPad + (params.windows.ySpacing + params.windows.height) * row) * scale;
         return paper.rect(windowX, windowY, windowWidth, windowHeight).attr(params.windows.attr[0]);
      });

      // Draw text.
      var rowLabelX = buildingX - params.text.xPad * scale;
      for(var iRow = 0; iRow < rows; iRow++) {
         var rowLabelY = buildingY + (params.windows.topPad + (params.windows.ySpacing + params.windows.height) * iRow + params.windows.height / 2) * scale;
         paper.text(rowLabelX, rowLabelY, rowToDisplayString(iRow)).attr(params.text.attr);
      }

      var colLabelY = buildingY - params.text.yPad;
      for(var iCol = 0; iCol < cols; iCol++) {
         var colLabelX = buildingX + (params.windows.xPad + (params.windows.xSpacing + params.windows.width) * iCol + params.windows.width / 2) * scale;
         paper.text(colLabelX, colLabelY, colToDisplayString(iCol)).attr(params.text.attr);
      }

      var visualInsance = {
         paper: paper,
         windows: windows,
         params: params
      };

      setVisualConfig(visualInsance, config, user);
      return visualInsance;
   }

   function drawPie(paper, centerX, centerY, radius, startAngle, endAngle) {
      var startPoint = polarToCartesian(centerX, centerY, radius, startAngle);
      var endPoint = polarToCartesian(centerX, centerY, radius, endAngle);
      var path = [
         "M", centerX, centerY,
         "L", startPoint.x, startPoint.y,
         "A", radius, radius, 0, 1, 1, endPoint.x, endPoint.y,
         "Z"
      ];
      return paper.path(path);
   }

   function polarToCartesian(centerX, centerY, radius, angle) {
      return {
         x: centerX + radius * Math.cos(Math.PI * angle / 180),
         y: centerY + radius * Math.sin(Math.PI * angle / 180)
      };
   }

   function setVisualConfig(visualInstance, config, user) {
      if(user) {
         userVisualConfig = config;
      }
      for(var row = 0; row < rows; row++) {
         for(var col = 0; col < cols; col++) {
            var entry = config[row][col];
            if(entry === null) {
               continue;
            }
            visualInstance.windows[row][col].attr(visualInstance.params.windows.attr[entry]);
         }
      }
   }

   function initDragAndDrop() {
      // Initialize all source slots.
      var rowParams = Beav.Array.init(rows, function(row) {
         return {type: "row", index: row, text: rowToDisplayString(row)};
      });
      var colParams = Beav.Array.init(cols, function(col) {
         return {type: "col", index: col, text: colToDisplayString(col)};
      });
      var sources = rowParams.concat(colParams);
      if(data[level].allowInvert) {
         sources.push({type: "invert"});
      }
      sources.sort(sourcesComparator);

      // Container/source size variables.
      var sourcesTotalWidth = sources.length * dragParams.slot.width + (sources.length - 1) * dragParams.source.xSpacing;
      var containerWidth = 2 * dragParams.containerBorder.xPad + data[level].numSlots * dragParams.slot.width + (data[level].numSlots - 1) * dragParams.containerBorder.xSpacing;
      var containerHeight = 2 * dragParams.containerBorder.yPad + dragParams.slot.height;
      var paperWidth = 2 * dragParams.xPad + Math.max(containerWidth, sourcesTotalWidth);
      var paperHeight = 2 * dragParams.yPad + containerHeight + dragParams.midSpacing + dragParams.slot.height;
      var containerX = paperWidth / 2 - containerWidth / 2;
      var containerY = dragParams.yPad + dragParams.slot.height + dragParams.midSpacing;

      var sourceCenterY = dragParams.yPad + dragParams.slot.height / 2;
      var sourcesLeftX = paperWidth / 2 - sourcesTotalWidth / 2;
      var sourcePlaces = Beav.Array.init(sources.length, function(index) {
         return [
            sourcesLeftX + index * (dragParams.source.xSpacing + dragParams.slot.width) + dragParams.slot.width / 2,
            sourceCenterY
         ];
      });


      paperDrag = subTask.raphaelFactory.create("animDrag", "animDrag", paperWidth, paperHeight);
      paperDrag.rect(containerX, containerY, containerWidth, containerHeight).attr(dragParams.containerBorder.attr);

      dragAndDrop = DragAndDropSystem({
         paper: paperDrag,
         actionIfDropped: actionIfDropped,
         actionIfEjected: actionIfEjected,
         drop: onDrop
      });

      var containerCenterX = containerX + containerWidth / 2;
      var containerCenterY = containerY + containerHeight / 2;

      // One extra slot for drag preview (the drag and drop library relies on it).
      slotPlaces = Beav.Array.init(data[level].numSlots + 1, function(index) {
         return [
            containerX + dragParams.containerBorder.xPad + index * (dragParams.containerBorder.xSpacing + dragParams.slot.width) + dragParams.slot.width / 2,
            containerCenterY
         ];
      });

      dragAndDrop.addContainer({
         ident: "sequence",
         cx: containerCenterX,
         cy: containerCenterY,
         widthPlace: dragParams.slot.width,
         heightPlace: dragParams.slot.height,
         nbPlaces: data[level].numSlots,
         dropMode: "insertBefore",
         dragDisplayMode: "preview",
         places: slotPlaces,
         placeBackgroundArray: [drawSlot()]
      });

      

      for(var index = 0; index < sources.length; index++) {
         var source = sources[index];
         dragAndDrop.addContainer({
            ident: sourceParamsToID(source),
            cx: sourcePlaces[index][0],
            cy: sourcePlaces[index][1],
            widthPlace: dragParams.slot.width,
            heightPlace: dragParams.slot.height,
            type: "source",
            sourceElemArray: [drawSlot(source)],
            placeBackgroundArray: [drawSlot()]
         });
      }

      dragAndDrop.insertObjects("sequence", 0, $.map(answer, function(entry) {
         if(entry === null) {
            return null;
         }
         return {
            ident: entry,
            elements: [drawSlot(idToSourceParams(entry))]
         };
      }));
   }

   function sourcesComparator(params1, params2) {
      // Invert is the last slot.
      if(params1.type === "invert") {
         return 1;
      }
      if(params2.type === "invert") {
         return -1;
      }
      if(params1.type === params2.type) {
         // All other slots have texts. Sort increasing.
         return params1.text.localeCompare(params2.text);
      }

      // Columns come first.
      if(params1.type === "col") {
         return -1;
      }
      if(params2.type === "col") {
         return 1;
      }
      // Can't reach here.
   }

   function sourceParamsToID(source) {
      if(source.type === "invert") {
         return "invert";
      }
      return source.type + "_" + source.index;
   }

   function idToSourceParams(id) {
      if(id === "invert") {
         return {type: "invert"};
      }
      var parts = id.split("_");
      var result = {
         type: parts[0],
         index: parseInt(parts[1])
      };
      if(result.type === "row") {
         result.text = rowToDisplayString(result.index);
      }
      else {
         result.text = colToDisplayString(result.index);
      }
      return result;
   }

   function drawSlot(contentParams, highlightBorder) {
      var width = dragParams.slot.width;
      var height = dragParams.slot.height;
      var leftX = - width / 2;
      var topY = - height / 2;
      paperDrag.setStart();

      // Border.
      var border = paperDrag.rect(leftX, topY, width, height).attr(dragParams.slot.borderAttr);

      if(contentParams) {
         // Fill color.
         border.attr(dragParams.source.borderAttr);
         // Text.
         if(contentParams.text) {
            paperDrag.text(0, -height / 2 + height * dragParams.slot.yRatiosText[0], contentParams.text).attr(dragParams.slot.textAttr);
         }
         var windowWidth = buildingParams.windows.width * dragParams.slot.windowScale;
         var windowHeight = buildingParams.windows.height * dragParams.slot.windowScale;
         if(contentParams.type === "invert") {
            var windowY1 = - height / 2 + height * dragParams.slot.yRatiosInvert[0] - windowHeight / 2;
            var windowY2 = - height / 2 + height * dragParams.slot.yRatiosInvert[1] - windowHeight / 2;
            paperDrag.rect(- windowWidth / 2, windowY1, windowWidth, windowHeight).attr(buildingParams.windows.attr[0]);
            paperDrag.rect(- windowWidth / 2, windowY2, windowWidth, windowHeight).attr(buildingParams.windows.attr[1]);

            var windowBottom1 = windowY1 + windowHeight;
            paperDrag.path(["M", 0, 0, "V", windowBottom1 + dragParams.slot.arrowYPad]).attr(dragParams.slot.arrowAttr);
            paperDrag.path(["M", 0, 0, "V", windowY2 - dragParams.slot.arrowYPad]).attr(dragParams.slot.arrowAttr);
         }
         else {
            paperDrag.rect(- windowWidth / 2, - height / 2 + height * dragParams.slot.yRatiosText[1] - windowHeight / 2, windowWidth, windowHeight).attr(buildingParams.windows.attr[1]);
         }
      }

      if(highlightBorder) {
         border.attr(dragParams.highlightAttr);
      }

      return paperDrag.setFinish();
   }

   function actionIfDropped(srcCont, srcPos, dstCont, dstPos, dropType) {
      showFeedback(null);

      // Allow getting rid of existing objects in the sequence.
      if(dstCont !== "sequence") {
         return dstCont == null;
      }

      // Don't allow dragging from one source to another.
      if(srcCont !== "sequence" && dstCont !== "sequence" && dstCont !== null) {
         return false;
      }

      var oldSequence = dragAndDrop.getObjects("sequence");

      // Search for rightmost index for insertion.      
      var newIndex = 0;
      for(var index = 0; index < oldSequence.length; index++) {
         if (oldSequence[index] != null) {
            newIndex = index + 1;
         }
      }
      // If this instruction was already here, one more slot is available.
      if(srcCont === "sequence") {
         newIndex--;
      }

      // If the sequence is full, don't allow insertion.
      if(newIndex === data[level].numSlots) {
         return false;
      }

      // Allow insertion in the middle of the list.
      if(dstPos !== null && dstPos <= newIndex) {
         return true;
      }
      // Only allow appending the current list, no dropping further away to the right.
      if(newIndex < data[level].numSlots) {
         return DragAndDropSystem.action("sequence", newIndex, 'insert');
      }
   }

   function actionIfEjected(refElement, srcCont, srcPos) {
      // If the sequence is full, and the user tries to insert a new item, show message.
      var filledSlots;
      for(filledSlots = 0; filledSlots < answer.length; filledSlots++) {
         if(answer[filledSlots] === null) {
            break;
         }
      }
      if(filledSlots === data[level].numSlots && srcCont !== "sequence") {
         showFeedback(taskStrings.fullError);
      }

      // null tells the library that the rejection should destroy the item.
      return null;
   }

   function onDrop(srcContainerID, srcPos, dstContainerID, dstPos, dropType) {
      answer = dragAndDrop.getObjects("sequence");
      if(srcContainerID === "sequence" || dstContainerID === "sequence") {
         killSimulation();
      }
   }

   function initHandlers() {
      $("#execute").click(clickExecute);
      $("#stop").click(killSimulation);
   }

   function clickExecute() {
      showFeedback(null);
      createSimulation();
      setExecuteEnabled(false);
      setStopEnabled(true);
      simulation.setAutoPlay(true);
      simulation.play();
   }

   function createSimulation() {
      // Check whether we should show the initial state as the first step.
      // This needs to be done here because killSimulation overwrites userVisualConfig.
      var needInitial = userVisual && !Beav.Object.eq(userVisualConfig, data[level].initial);

      killSimulation();
      simulation = subTask.simulationFactory.create("sim");
      var config = $.extend(true, [], data[level].initial);

      // If the current display is not the initial state, the first step is to initialize it.
      if(needInitial) {
         simulation.addStepWithEntry({
            name: "step",
            action: {
               onExec: stepFunction,
               params: {
                  config: $.extend(true, [], config),
                  index: null
               },
               duration: data[level].animTime,
               useTimeout: true
            }
         });
      }


      for(var index = 0; index < data[level].numSlots; index++) {
         var entry = answer[index];
         if(entry === null) {
            break;
         }
         var entryParams = idToSourceParams(entry);
         applyTransformation(config, entryParams);
         simulation.addStepWithEntry({
            name: "step",
            action: {
               onExec: stepFunction,
               params: {
                  config: $.extend(true, [], config),
                  index: index
               },
               duration: data[level].animTime,
               useTimeout: true
            }
         });
      }

      var success = Beav.Object.eq(config, data[level].target);

      simulation.addStepWithEntry({
         name: "validate",
         action: {
            onExec: onSimulationFinish,
            params: success
         }
      });
      
      return success;
   }

   function stepFunction(params) {
      setVisualConfig(userVisual, params.config, true);
      if(params.index !== null) {
         highlightSlot(params.index);
      }
   }

   function unhighlightSlot() {
      if(slotHighlight) {
         slotHighlight.remove();
         slotHighlight = null;
      }
   }

   function highlightSlot(index) {
      unhighlightSlot();
      slotHighlight = drawSlot(null, true);
      slotHighlight.transform(["T", slotPlaces[index][0], slotPlaces[index][1]]);
   }

   function onSimulationFinish(success) {
      setExecuteEnabled(true);
      if(success) {
         platform.validate("done");
      }
      else {
         platform.validate("stay");
      }
   }

   function applyTransformation(config, params) {
      if(data[level].allowInvert && params.type === "invert") {
         for(var row = 0; row < rows; row++) {
            for(var col = 0; col < cols; col++) {
               if(config[row][col] !== null) {
                  config[row][col] ^= 1;
               }
            }
         }
      }
      else if(params.type === "row") {
         for(var iCol = 0; iCol < cols; iCol++) {
            if(config[params.index][iCol] !== null) {
               config[params.index][iCol] = 1;
            }
         }
      }
      else if(params.type === "col") {
         for(var iRow = 0; iRow < rows; iRow++) {
            if(config[iRow][params.index] !== null) {
               config[iRow][params.index] = 1;
            }
         }
      }
      else {
         throw "Unidentified params type";
      }
   }

   function setExecuteEnabled(enabled) {
      $("#execute").attr("disabled", !enabled);
   }

   function setStopEnabled(enabled) {
      $("#stop").attr("disabled", !enabled);
   }

   function killSimulation() {
      if(simulation) {
         subTask.simulationFactory.destroy("sim");
         simulation = null;
      }
      if(userVisual) {
         setVisualConfig(userVisual, data[level].initial, true);
         unhighlightSlot();
         setExecuteEnabled(true);
         setStopEnabled(false);
      }
   }

   function rowToDisplayString(row) {
      // The bottom most row is 0.
      return (rows - 1 - row).toString();
   }

   function colToDisplayString(col) {
      // The leftmost column is A.
      return String.fromCharCode("A".charCodeAt(0) + col);
   }

   function showFeedback(string) {
      if(string === null || string === undefined) {
         string = "";
      }
      $("#feedback").html(string);
   }

   function getResultAndMessage() {
      if(answer[0] === null) {
         return {
            successRate: 0,
            message: taskStrings.emptyError
         };
      }
      var success = createSimulation();
      if(success) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }
      else {
         return {
            successRate: 0,
            message: taskStrings.mismatchError
         };
      }
   }

   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
