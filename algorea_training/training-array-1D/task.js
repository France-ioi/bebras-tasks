function initTask(subTask) {
   var cellSide = 60;

   subTask.gridInfos = {
      cellSide: cellSide,
      actionDelay: 200,
      showLabels: true,
      maxIterWithoutAction: 2000,
      itemTypes: {
         green_robot: { img: "green_robot.png", side: 80, nbStates: 9, isObstacle: true, offsetX: -14, category: "robot", team: 0, zOrder: 2 },
         marker: { num: 2, img: "marker.png", side: cellSide, category: "paint", isObstacle: false, hasColor: true, color: "marker" },
         paint: { num: 3, img: "paint.png", side: cellSide, category: "paint", isPaint: true, color: "gris" }
      },
      maxInstructions: {
         easy: 40,
         medium: 30,
         hard: 60
      },
      includeBlocks: {
         groupByCategory: {
            easy: true,
            medium: true,
            hard: true
         },
         generatedBlocks: {
            robot: {
               easy: ["south", "east", "west", "paint", "paintOnCell", "col"],
               medium: ["south", "east", "west", "paint", "paintOnCell", "col"],
               hard: ["north", "south", "east", "west", "paint", "paintOnCell", "col"]
            }
         },
         standardBlocks: {
            includeAll: false,
            wholeCategories: ["variables"],
            singleBlocks: {
               easy: ["lists_create_with_empty", "lists_getIndex", "lists_setIndex", "controls_repeat_ext", "controls_if"],
               medium: ["lists_create_with_empty", "lists_getIndex", "lists_setIndex", "controls_repeat_ext", "controls_if", "math_number", "math_arithmetic", "logic_compare"],
               hard: ["lists_repeat", "lists_create_with_empty", "lists_getIndex", "lists_setIndex", "controls_repeat_ext", "controls_if", "math_number", "math_arithmetic", "logic_compare"]
            }
         }
      },
      checkEndEveryTurn: false,
      checkEndCondition: function(context, lastTurn) {
         if (lastTurn) {
            for (var iRow = 0; iRow < context.tiles.length; iRow++) {
               var row = subTask.data[subTask.level][subTask.iTestCase].tiles[iRow];
               for (var iCol = 0; iCol < row.length; iCol++) {
                  var tile = row[iCol];
                  var paints = context.getItems(iRow, iCol, {color: "gris"});
                  if (((paints.length > 0) != (tile == 2)) && (iRow == context.tiles.length - 1)) {
                     context.success = false;
                     throw("Le robot n'a pas peint les cases exactement comme souhaité.");
                  }
               }
            }
            context.success = true;
            throw("Bravo, vous avez reproduit le motif !");
         }
      },
      computeGrade: function(context, message) {
         var rate = 0;
         if (context.success) {
            rate = 1;
         }
         return {
            successRate: rate,
            message: message
         };
      }
   };

   subTask.data = {
      easy: [
         {
            tiles: [
                   [1, 3, 1, 3, 3, 1, 1, 3, 1, 3, 3, 3, 1, 3, 3, 1],
                   [1, 2, 1, 2, 2, 1, 1, 2, 1, 2, 2, 2, 1, 2, 2, 1],
               ],
            initItems: [
                  { row: 0, col: 0, dir: 0, type: "green_robot" },
               ]
         },
         {
            tiles: [
                   [1, 1, 3, 3, 3, 1, 3, 1, 3, 3, 1, 3, 1, 1, 3, 1],
                   [1, 1, 2, 2, 2, 1, 2, 1, 2, 2, 1, 2, 1, 1, 2, 1],
               ],
            initItems: [
                  { row: 0, col: 0, dir: 0, type: "green_robot" },
               ]
         }
      ],
      medium: [
         {
            tiles: [
                   [1, 3, 1, 3, 3, 1, 1, 3, 1, 3, 3, 3, 1, 3, 3, 1],
                   [1, 2, 2, 1, 2, 2, 2, 1, 2, 1, 1, 2, 2, 1, 2, 1],
               ],
            initItems: [
                  { row: 0, col: 0, dir: 0, type: "green_robot" },
               ]
         },
         {
            tiles: [
                   [1, 1, 3, 3, 3, 1, 3, 1, 3, 3, 1, 3, 1, 1, 3, 1],
                   [1, 2, 1, 1, 2, 1, 2, 2, 1, 2, 1, 2, 2, 2, 1, 1],
               ],
            initItems: [
                  { row: 0, col: 0, dir: 0, type: "green_robot" },
               ]
         }
      ],
      hard: [
         {
            tiles: [
                   [1, 3, 1, 3, 3, 3, 1, 1, 1, 1, 3, 1, 1, 3, 3, 1],
                   [1, 3, 3, 1, 3, 1, 1, 1, 3, 1, 3, 1, 3, 1, 3, 1],
                   [1, 3, 1, 3, 1, 1, 3, 1, 3, 3, 3, 1, 1, 3, 1, 1],
                   [1, 2, 1, 2, 2, 1, 1, 1, 2, 1, 2, 1, 1, 2, 2, 1]
               ],
            initItems: [
                  { row: 0, col: 0, dir: 0, type: "green_robot" },
               ]
         },
         {
            tiles: [
                   [1, 1, 1, 1, 3, 1, 1, 3, 3, 3, 1, 3, 3, 3, 1, 1],
                   [1, 3, 1, 3, 1, 3, 1, 3, 3, 3, 1, 3, 1, 1, 1, 1],
                   [1, 3, 3, 3, 1, 1, 3, 1, 3, 1, 3, 1, 1, 3, 1, 1],
                   [1, 2, 1, 2, 1, 1, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1]
               ],
            initItems: [
                  { row: 0, col: 0, dir: 0, type: "green_robot" },
               ]
         }
      ]
   };

   initBlocklySubTask(subTask);
   displayHelper.thresholdEasy = 5000;
   displayHelper.thresholdMedium = 10000;
}

initWrapper(initTask, ["easy", "medium", "hard"], null, true);
