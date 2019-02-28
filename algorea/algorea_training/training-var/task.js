function initTask(subTask) {
   var cellSide = 60;

   subTask.gridInfos = {
      cellSide: cellSide,
      actionDelay: 200,
      itemTypes: {
         green_robot: { img: "green_robot.png", side: 80, nbStates: 9, isObstacle: true, offsetX: -14, category: "robot", team: 0, zOrder: 2 },
         0: { num: 100, side: cellSide, category: "number", value: 0 },
         1: { num: 101, side: cellSide, category: "number", value: 1 },
         2: { num: 2, side: cellSide, category: "number", value: 2 },
         3: { num: 3, side: cellSide, category: "number", value: 3 },
         4: { num: 4, side: cellSide, category: "number", value: 4 },
         5: { num: 5, side: cellSide, category: "number", value: 5 },
         6: { num: 6, side: cellSide, category: "number", value: 6 },
         7: { num: 7, side: cellSide, category: "number", value: 7 },
         8: { num: 8, side: cellSide, category: "number", value: 8 },
         9: { num: 9, side: cellSide, category: "number", value: 9 },
         10: { num: 10, side: cellSide, category: "number", value: 10 },
         11: { num: 11, side: cellSide, category: "number", value: 11 },
         12: { num: 12, side: cellSide, category: "number", value: 12 },
         13: { num: 13, side: cellSide, category: "number", value: 13 },
         14: { num: 14, side: cellSide, category: "number", value: 14 },
         15: { num: 15, side: cellSide, category: "number", value: 15 },
         16: { num: 16, side: cellSide, category: "number", value: 16 },
         17: { num: 17, side: cellSide, category: "number", value: 17 },
         18: { num: 18, side: cellSide, category: "number", value: 18 },
         19: { num: 19, side: cellSide, category: "number", value: 19 },
         20: { num: 20, side: cellSide, category: "number", value: 20 },
         paint: { img: "paint.png", side: cellSide, category: "paint", color: "gris" }
      },
      maxInstructions: 40,
      includeBlocks: {
         groupByCategory: {
            easy: false,
            medium: false,
            hard: false
         },
         generatedBlocks: {
            robot: ["east", "west", "south", "numberUnder", "writeNumber"]
         },
         standardBlocks: {
            includeAll: false,
            wholeCategories: [],
            singleBlocks: {
               easy: ["controls_repeat_ext"],
               medium: ["controls_repeat_ext", "math_arithmetic", "math_number"],
               hard: ["controls_repeat_ext", "math_arithmetic", "math_number"]
            }
         },
         variables: ["mémoire du robot"]
      },
      checkEndEveryTurn: true,
      checkEndCondition: function(context, lastTurn) {
         if (lastTurn) {
            for (var iRow = 0; iRow < context.tiles.length; iRow++) {
               var row = subTask.data[subTask.level][subTask.iTestCase].tiles[iRow];
               var total = 0;
               for (var iCol = 0; iCol < row.length; iCol++) {
                  var items = context.getItems(iRow, iCol, {category: "number"});
                  var hasNumber = (items.length != 0);
                  if (hasNumber) {
                     var oldNumber = row[iCol];
                     var item = items[0];
                     var itemType = this.itemTypes[item.type];
                     if (oldNumber != 100) {
                        if (itemType.num != oldNumber) {
                           context.success = false;
                           throw("Vous ne devez modifier que les cases contenant un zéro.");
                        }
                        total += itemType.value;
                     } else {
                        if (total != itemType.value) {
                           context.success = false;
                           throw("Nombre incorrect.");
                        }
                     }
                  }
               }
            }
            context.success = true;
            throw("Bravo, vous avez inscrit les bons nombres !");
         }
      }
   };

   subTask.data = {
      easy: [
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 3, 1, 100, 1, 1],
                   [1, 1, 6, 1, 100, 1, 1],
                   [1, 1, 2, 1, 100, 1, 1],
                   [1, 1, 3, 1, 100, 1, 1],
                   [1, 1, 5, 1, 100, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 1, col: 0, dir: 0, type: "green_robot" }
               ]
         }
      ],
      medium: [
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 1],
                   [1, 4, 3, 1, 100, 1, 1],
                   [1, 3, 6, 1, 100, 1, 1],
                   [1, 5, 2, 1, 100, 1, 1],
                   [1, 6, 3, 1, 100, 1, 1],
                   [1, 2, 5, 1, 100, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 1, col: 0, dir: 0, type: "green_robot" }
               ]
         }
      ],
      hard: [
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 2, 3, 4, 3, 2, 1, 100, 1],
                   [1, 1, 3, 5, 3, 2, 2, 1, 100, 1],
                   [1, 1, 4, 6, 2, 4, 2, 1, 100, 1],
                   [1, 1, 5, 5, 101, 101, 2, 1, 100, 1],
                   [1, 1, 6, 4, 2, 3, 101, 1, 100, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 1, col: 0, dir: 0, type: "green_robot" }
               ]
         }
      ]
   };

   initBlocklySubTask(subTask);
   displayHelper.thresholdEasy = 5000;
   displayHelper.thresholdMedium = 10000;
}

initWrapper(initTask, ["easy", "medium", "hard"], null, true);
