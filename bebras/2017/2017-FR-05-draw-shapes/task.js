function initTask(subTask) {
   var state = {};
   var level;
   var answer = null;
   var data = {
      /*
         Format:
         A configuration is an array of objects, which are placed in a row.
         Each object has a "shape" field (triangle/circle/square/empty)
         and a "contents" field, which is an array of three
         sub-objects placed inside.
      */
      easy: {
         target: [
            {
               shape: "triangle",
               contents: []
            },
            {
               shape: "circle",
               contents: []
            },
            {
               shape: "square",
               contents: []
            },
            {
               shape: "circle",
               contents: []
            },
            {
               shape: "square",
               contents: []
            },
            {
               shape: "triangle",
               contents: []
            },
            {
               shape: "circle",
               contents: []
            }
         ]
      },
      medium: {
         target: [
            {
               shape: "triangle",
               contents: [
                  {
                     shape: "circle",
                     contents: []
                  },
                  {
                     shape: "square",
                     contents: []
                  },
                  {
                     shape: "triangle",
                     contents: []
                  }
               ]
            }
         ]
      },
      hard: {
         target: [
            {
               shape: "circle",
               contents: [
                  {
                     shape: "square",
                     contents: [
                        {
                           shape: "triangle",
                           contents: []
                        },
                        {
                           shape: "circle",
                           contents: []
                        },
                        {
                           shape: "square",
                           contents: []
                        }
                     ]
                  },
                  {
                     shape: "triangle",
                     contents: [
                        {
                           shape: "square",
                           contents: []
                        },
                        {
                           shape: "empty",
                           contents: []
                        },
                        {
                           shape: "empty",
                           contents: []
                        }
                     ]
                  },
                  {
                     shape: "circle",
                     contents: [
                        {
                           shape: "empty",
                           contents: []
                        },
                        {
                           shape: "empty",
                           contents: []
                        },
                        {
                           shape: "empty",
                           contents: []
                        }
                     ]
                  }
               ]
            }
         ]
      }
   };

   var examplesData = {
      // Each level has an array of configurations.
      easy: [
         [
            {
               shape: "square",
               contents: []
            },
            {
               shape: "triangle",
               contents: []
            },
            {
               shape: "circle",
               contents: []
            },
            {
               shape: "triangle",
               contents: []
            },
            {
               shape: "square",
               contents: []
            }
         ]
      ],
      medium: [
         [
            {
               shape: "circle",
               contents: [
                  {
                     shape: "square",
                     contents: []
                  },
                  {
                     shape: "triangle",
                     contents: []
                  },
                  {
                     shape: "circle",
                     contents: []
                  }
               ]
            }
         ],
         [
            {
               shape: "square",
               contents: [
                  {
                     shape: "triangle",
                     contents: []
                  },
                  {
                     shape: "square",
                     contents: []
                  },
                  {
                     shape: "circle",
                     contents: []
                  }
               ]
            }
         ]
      ],
      hard: [
         [
            {
               shape: "triangle",
               contents: [
                  {
                     shape: "triangle",
                     contents: [
                        {
                           shape: "empty",
                           contents: []
                        },
                        {
                           shape: "empty",
                           contents: []
                        },
                        {
                           shape: "empty",
                           contents: []
                        }
                     ]
                  },
                  {
                     shape: "square",
                     contents: [
                        {
                           shape: "triangle",
                           contents: []
                        },
                        {
                           shape: "square",
                           contents: []
                        },
                        {
                           shape: "circle",
                           contents: []
                        }
                     ]
                  },
                  {
                     shape: "circle",
                     contents: [
                        {
                           shape: "circle",
                           contents: []
                        },
                        {
                           shape: "empty",
                           contents: []
                        },
                        {
                           shape: "empty",
                           contents: []
                        }
                     ]
                  }
               ]
            }
         ]
      ]
   };

   var paper;
   var buttonsPaper;
   var buttons;
   var exampleInstances;
   var mainInstance;
   var emptyConfig;
   var shapeNames = ["circle", "square", "triangle"];
   var shapeToLetter = {
      "circle": "O",
      "square": "X",
      "triangle": "A",
      "empty": ""
   };
   
   var visualParams = {
      // 3 values that give the scale of small, medium and large shapes in the canvas
      shapesSizes: {
         easy: [40],
         medium: [40, 160],
         hard: [40, 130, 390]
      },
      // 3 values that give the scale of small, medium and large shapes in the buttons
      shapesSizesButtons: {
         easy: [40],
         medium: [40, 80],
         hard: [35, 55, 80]
      },
      // 3 values that give the scale of small, medium and large buttons.
      buttonSize: {
         easy: [60],
         medium: [50, 90],
         hard: [45, 65, 90]
      },
      // Remove button.
      removeButtonWidth: 0,
      removeButtonHeight: 0,
      removeButtonYSpacing: 0,
      // a ratio that when multiplied with shapesSizes, gives the vertical distance between the center of the parent shape and the center of the bottom children shapes
      bottomShapeYRatio: 0.22,
      // same thing with the top shape
      topShapeYRatio: 0.12,
      // same thing on the X axis for the bottom shapes, on the left and on the right
      bottomShapeXRatio: 0.18,
      // a ratio that when multiplied with shapesSizes gives the radius of the circle
      circleRadiusRatio: 0.5,
      // same thing with the side of the square
      squareSideRatio: 0.77,
      // same thing with the base of the triangle
      triangleBaseRatio: 1,
      // same thing with the height of the triangle
      triangleHeightRatio: 0.9,

      attrs: {
         circle: {
            stroke: "#00a2e8",
            "stroke-width": 3,
            fill: "#99d9ea"
         },
         triangle: {
            stroke: "#22b14c",
            "stroke-width": 3,
            fill: "#b5e61d"
         },
         square: {
            stroke: "#ed1c24",
            "stroke-width": 3,
            fill: "#ffaec9"
         }
      },
      dashedAttrs: {
         stroke: "gray",
         "stroke-dasharray": "-",
         "stroke-width": 2,
         fill: "white",
         "fill-opacity": 0
      },
      xPad: 15,
      yPad: 10,
      xSpacing: 5,
      buttonsPaperXPad: 5,
      buttonsPaperYPad: 5,
      buttonsXSpacing: 10,
      buttonsYSpacing: 10,
      buttonShapeAttr: {
         opacity: 1
      },
      buttonMouseDownShapeAttr: {
         opacity: 0.5
      },
      buttonEnabledAttr: {
         fill: "#aaaaaa"
      },
      buttonActiveAttr: {
         fill: "#efefef"
      }
   };

   var mouseupBindID = "mouseup.draw-shapes-bind";

   subTask.loadLevel = function(curLevel) {
      level = curLevel;
      if(data[level].depth === undefined) {
         data[level].depth = getDepth(data[level].target);
      }
   };

   subTask.getStateObject = function() {
      return state;
   };

   subTask.reloadAnswerObject = function(answerObj) {
      answer = answerObj;
   };
   
   subTask.resetDisplay = function() {
      initMainInstance();
      initButtons();
      initExamples();
      $(".hint").hide();
      $(document).bind(mouseupBindID, onMouseUp);
   };

   subTask.getAnswerObject = function() {
      return answer;
   };

   subTask.getDefaultAnswerObject = function() {
      return getEmptyConfig(); // Same format as described in the data.
   };

   subTask.unloadLevel = function(callback) {
      if(buttons) {
         for(var iButton in buttons) {
            buttons[iButton].remove();
         }
      }
      $(document).unbind(mouseupBindID);
      callback();
   };

   function initMainInstance() {
      $("#configString_main").text(configToString(data[level].target));
      mainInstance = new VisualInstance("mainInstance", "anim", answer);
   }

   function initButtons() {
      var paperWidth = 2 * visualParams.buttonsPaperXPad;
      for(var sizeIndex = 0; sizeIndex <= data[level].depth; sizeIndex++) {
         paperWidth += visualParams.buttonSize[level][sizeIndex];
         if(sizeIndex < data[level].depth) {
            paperWidth += visualParams.buttonsXSpacing;
         }
      }

      // The remove button may require a wider paper.
      paperWidth = Math.max(paperWidth, 2 * visualParams.buttonsPaperXPad + visualParams.removeButtonWidth);

      var paperHeight = 2 * visualParams.buttonsPaperYPad + visualParams.buttonSize[level][data[level].depth] * shapeNames.length + visualParams.buttonsYSpacing * shapeNames.length + visualParams.removeButtonHeight + visualParams.removeButtonYSpacing;

      buttonsPaper = subTask.raphaelFactory.create("buttonsAnim", "buttonsAnim", paperWidth, paperHeight);

      // Add the shape buttons.
      drawShapeButtons();

      setButtonsInactive();
   }

   function drawShapeButtons() {
      buttons = [];
      var centerY = visualParams.buttonsPaperYPad + visualParams.buttonSize[level][data[level].depth] / 2;
      for(var shapeIndex = 0; shapeIndex < shapeNames.length; shapeIndex++) {
         var centerX = visualParams.buttonsPaperXPad + visualParams.buttonSize[level][data[level].depth] / 2;
         for(var sizeIndex = data[level].depth; sizeIndex >= 0; sizeIndex--) {
            var button = drawButton(centerX, centerY, shapeNames[shapeIndex], sizeIndex);
            button.click(shapeButtonClick, {
               sizeIndex: sizeIndex,
               shape: shapeNames[shapeIndex]
            });
            button.dragAttempt(shapeButtonClick, {
               sizeIndex: sizeIndex,
               shape: shapeNames[shapeIndex]
            });
            buttons.push(button);
            if(sizeIndex > 0) {
               centerX += visualParams.buttonSize[level][sizeIndex] / 2;
               centerX += visualParams.buttonsXSpacing;
               centerX += visualParams.buttonSize[level][sizeIndex - 1] / 2;
            }
         }
         if(shapeIndex < shapeNames.length - 1) {
            centerY += visualParams.buttonSize[level][data[level].depth];
            centerY += visualParams.buttonsYSpacing;
         }
      }
   }

   function drawButton(centerX, centerY, shape, sizeIndex) {
      var width = visualParams.buttonSize[level][sizeIndex];
      var height = visualParams.buttonSize[level][sizeIndex];
      var button = new Button(buttonsPaper, centerX - width / 2, centerY - height / 2, width, height, "");
      var element = drawShape(buttonsPaper, shape, {
         x: centerX,
         y: centerY
      }, visualParams.shapesSizesButtons[level][sizeIndex], false);
      button.addElement("shape", element);
      button.setAttr("shape", "enabled", visualParams.buttonShapeAttr);
      button.setAttr("shape", "mousedown", visualParams.buttonMouseDownShapeAttr);
      return button;
   }

   function dragAttemptHandler() {
      displayHelper.showPopupMessage(taskStrings.dragAttempt, "blanket");
   }

   function shapeButtonClick(data) {
      setButtonsInactive();
      mainInstance.setMode("addShape", data.shape, data.sizeIndex);
      setButtonActive(this);
   }

   function initExamples() {
      $(".exampleContainer").hide();
      exampleInstances = {};
      for(var iExample in examplesData[level]) {
         $("#exampleContainer" + iExample).show();
         var id = "exampleAnim" + iExample;
         exampleInstances[iExample] = new VisualInstance(id, id, examplesData[level][iExample]);
         var exampleString = configToString(examplesData[level][iExample]);
         $("#configString_example" + iExample).text(exampleString);
      }
   }

   function getDepth(config) {
      // Calculate nesting depth of a top-level object in a configuration. 0 means no nesting.
      function getDepthTopLevel(object) {
         var result = 0;
         if(object.contents) {
            for(var iContent in object.contents) {
               result = Math.max(result, 1 + getDepthTopLevel(object.contents[iContent]));
            }
         }
         return result;
      }

      // Calculate the depth of a configuration (max from depths of all top-level objects).
      var maxDepth = 0;
      for(var iObject in config) {
         maxDepth = Math.max(maxDepth, getDepthTopLevel(config[iObject]));
      }

      return maxDepth;
   }

   function getEmptyConfig() {
      if(!emptyConfig) {
         emptyConfig = generateEmptyConfig();
      }
      return $.extend(true, [], emptyConfig);
   }

   function generateEmptyConfig() {
      var maxDepth = getDepth(data[level].target);
      var numTopLevel = data[level].target.length;

      // Create a nested top-level object with a given depth.
      function generate(depth) {
         var result = {
            shape: "empty"
         };

         if(depth === 0) {
            result.contents = [];
         }
         else {
            result.contents = Beav.Array.init(3, function() {
               return generate(depth - 1);
            });
         }
         return result;
      }

      return Beav.Array.init(numTopLevel, function() {
         return generate(maxDepth);
      });
   }

   function VisualInstance(id, elementID, config) {
      var self = this;

      this.init = function() {
         this.maxDepth = getDepth(config);
         this.paperWidth = 2 * visualParams.xPad + config.length * visualParams.shapesSizes[level][this.maxDepth] + visualParams.xSpacing * (config.length - 1);
         this.paperHeight = 2 * visualParams.yPad + visualParams.shapesSizes[level][this.maxDepth];
         this.paper = subTask.raphaelFactory.create(id, elementID, this.paperWidth, this.paperHeight);

         this.solidElements = {};
         this.dashedElements = {};
         for(var sizeIndex = 0; sizeIndex <= this.maxDepth; sizeIndex++) {
            this.dashedElements[sizeIndex] = {};
            this.solidElements[sizeIndex] = {};
            for(var iShape in shapeNames) {
               this.dashedElements[sizeIndex][shapeNames[iShape]] = [];
               this.solidElements[sizeIndex][shapeNames[iShape]] = [];
            }
         }

         /* Array of info objects. Each shape (both solid and dashed) contains
          * an index of an info object. The info object contains the position,
          * size, Raphael elements associated with that slot, and a pointer
          * to the corresponding object in the config.
          */
         this.slotInfo = [];

         this._drawAll();
         this.setMode(null);
      };

      this._getTopLevelPosition = function(index) {
         return {
            x: visualParams.xPad + index * (visualParams.shapesSizes[level][this.maxDepth] + visualParams.xSpacing) + visualParams.shapesSizes[level][this.maxDepth] / 2,
            y: visualParams.yPad + visualParams.shapesSizes[level][this.maxDepth] / 2
         };
      };

      this._drawAll = function() {
         for(var index = 0; index < config.length; index++) {
            this._recursiveDraw(config[index], this._getTopLevelPosition(index), this.maxDepth);
         }
         this._updateLayers();
      };

      this._addShape = function(slotIndex, shape, dashed) {
         var info = this.slotInfo[slotIndex];
         var element = drawShape(this.paper, shape, info.position, visualParams.shapesSizes[level][info.sizeIndex], dashed);
         element.data("slotIndex", slotIndex);
         element.data("shape", shape);
         element.click(this._onClick);

         if(dashed) {
            element.hide();
            this.dashedElements[info.sizeIndex][shape].push(element);
            this.slotInfo[slotIndex].dashedElements.push(element);
         }
         else {
            this.solidElements[info.sizeIndex][shape].push(element);
            info.object.shape = shape;
            this.slotInfo[slotIndex].solidElement = element;
         }

         return element;
      };

      this._recursiveDraw = function(object, center, sizeIndex) {
         var currentSize = visualParams.shapesSizes[level][sizeIndex];

         this.slotInfo.push({
            position: center,
            sizeIndex: sizeIndex,
            solidElement: null,
            dashedElements: [],
            object: object
         });
         // Draw shape if it exists here.
         if(object.shape !== "empty") {
            this._addShape(this.slotInfo.length - 1, object.shape, false);
         }

         // Draw all dashed shapes.
         for(var iShape in shapeNames) {
            this._addShape(this.slotInfo.length - 1, shapeNames[iShape], true);
         }

         if(object.contents.length === 0) {
            return;
         }

         var childrenPositions = [
            {
               x: center.x,
               y: center.y - currentSize * visualParams.topShapeYRatio
            },
            {
               x: center.x - currentSize * visualParams.bottomShapeXRatio,
               y: center.y + currentSize * visualParams.bottomShapeYRatio
            },
            {
               x: center.x + currentSize * visualParams.bottomShapeXRatio,
               y: center.y + currentSize * visualParams.bottomShapeYRatio
            }
         ];

         for(var iContent = 0; iContent < object.contents.length; iContent++) {
            this._recursiveDraw(object.contents[iContent], childrenPositions[iContent], sizeIndex - 1);
         }
      };

      this._removeShape = function(slotIndex) {
         var info = this.slotInfo[slotIndex];
         var sizeIndex = info.sizeIndex;
         var element = info.solidElement;
         if(!element) {
            return;
         }
         var shape = element.data("shape");
         this.solidElements[sizeIndex][shape].splice($.inArray(element, this.solidElements[sizeIndex][shape]), 1);
         info.solidElement = null;
         info.object.shape = "empty";
         element.remove();
         this._updateLayers();
      };

      this._onClick = function() {
         // Ignore clicks in neutral mode.
         if(!self.mode) {
            return;
         }

         var slotIndex = this.data("slotIndex");
         var info = self.slotInfo[slotIndex];
         var object = info.object;

         // Remove shape.
         if(self.mode === "removeShape") {
            self._removeShape(slotIndex);
            return;
         }

         // If the size doesn't match, ignore the click.
         if(info.sizeIndex !== self.modeParams.sizeIndex) {
            return;
         }

         // If the shape we want to add already exists, we delete it (toggle effect).
         if(object.shape === self.modeParams.shape) {
            self._removeShape(slotIndex);
            return;
         }

         // Remove old shape and add the new one.
         self._removeShape(slotIndex);
         self._addShape(slotIndex, self.modeParams.shape, false);
         self._updateLayers();
      };

      this.setMode = function(mode, shape, sizeIndex) {
         if(!mode) {
            this.mode = null;
            this.modeParams = {};
            this.hideAllDashed();
            return;
         }
         this.mode = mode;
         this.modeParams = {
            shape: shape,
            sizeIndex: sizeIndex
         };

         this.hideAllDashed();
         if(this.mode === "addShape") {
            this.showDashed(shape, sizeIndex);
         }
      };

      this.showDashed = function(shape, sizeIndex) {
         for(var iElement in this.dashedElements[sizeIndex][shape]) {
            var element = this.dashedElements[sizeIndex][shape][iElement];
            element.show();
         }
         $(".hint").show();
      };

      this.hideAllDashed = function() {
         $(".hint").hide();
         for(var sizeIndex in this.dashedElements) {
            for(var shapeName in this.dashedElements[sizeIndex]) {
               for(var iElement in this.dashedElements[sizeIndex][shapeName]) {
                  this.dashedElements[sizeIndex][shapeName][iElement].hide();
               }
            }
         }
      };

      this._updateLayers = function() {
         for(var sizeIndex = 0; sizeIndex <= this.maxDepth; sizeIndex++) {
            for(var iShape in shapeNames) {
               var array = this.solidElements[sizeIndex][shapeNames[iShape]];
               for(var iElement in array) {
                  array[iElement].toBack();
               }
            }
         }
      };

      this.getMode = function() {
         return this.mode;
      };

      this.getModeParams = function() {
         return this.modeParams;
      };

      this.init();
   }

   function drawShape(paper, shape, position, size, dashed) {
      var element;
      if(shape === "circle") {
         element = paper.circle(position.x, position.y, size * visualParams.circleRadiusRatio);
      }
      else if(shape === "square") {
         var squareSide = size * visualParams.squareSideRatio;
         element = paper.rect(position.x - squareSide / 2, position.y - squareSide / 2, squareSide, squareSide);
      }
      else {
         var topY = position.y - size / 2;
         var baseSize = size * visualParams.triangleBaseRatio;
         var height = size * visualParams.triangleHeightRatio;
         var baseLeft = position.x - baseSize / 2;
         var baseY = topY + height;
         element = paper.path([
            "M",
            position.x,
            topY,
            "L",
            baseLeft,
            baseY,
            "L",
            baseLeft + baseSize,
            baseY,
            "Z"
         ]);
      }

      if(dashed) {
         element.attr(visualParams.dashedAttrs);
      }
      else {
         element.attr(visualParams.attrs[shape]);
      }
      return element;
   }

   function onMouseUp(event) {
      // If this click is outside the main anim box and buttons, set mode to null.
      if(event.target.id === "anim") {
         return;
      }
      if(!event.target.parentElement || event.target.parentElement.id === "anim") {
         return;
      }
      if(event.target.parentElement.parentElement && event.target.parentElement.parentElement.id === "anim") {
         return;
      }

      // Shape/remove Raphael buttons (only in buttonsAnim - clicking on the example is still considered outside).
      if((event.target.tagName === "rect" || event.target.tagName === "shape") && event.target.parentElement.parentElement.id === "buttonsAnim") {
         return;
      }

      // Outside all of the above - cancel current mode.
      // DEPRECATED mainInstance.setMode(null);
      mainInstance.setMode("removeShape");
      setButtonsInactive();
   }

   function setButtonsInactive() {
      for(var iButton in buttons) {
         setButtonInactive(buttons[iButton]);
      }
   }

   function setButtonActive(button) {
      button.setAttr("rect", "enabled", visualParams.buttonActiveAttr);
   }

   function setButtonInactive(button) {
      button.setAttr("rect", "enabled", visualParams.buttonEnabledAttr);
   }

   function configToString(config) {
      var maxDepth = getDepth(config);
      
      function recurse(object, depth) {
         var result = shapeToLetter[object.shape];
         if(depth < maxDepth) {
            result += "(";
            var content = "";
            for(var iContent in object.contents) {
               content += recurse(object.contents[iContent], depth + 1);
            }
            if (content == "") {
               content = " ";
            }
            result += content + ")";
         }
         return result;
      }

      var result = "";
      for(var index in config) {
         result += recurse(config[index], 0);
      }
      return result;
   }

   function getResultAndMessage() {
      if(Beav.Object.eq(answer, data[level].target)) {
         return {
            successRate: 1,
            message: taskStrings.success
         };
      }
      return {
         successRate: 0,
         message: taskStrings.error
      };
   }
   
   subTask.getGrade = function(callback) {
      callback(getResultAndMessage());
   };
}
initWrapper(initTask, ["easy", "medium", "hard"]);

