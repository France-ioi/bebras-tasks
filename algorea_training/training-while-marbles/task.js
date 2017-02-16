function initTask(subTask) {
   var cellSide = 60;

   subTask.gridInfos = {
      hideSaveOrLoad: true,
      cellSide: cellSide,
      actionDelay: 200,
      itemTypes: {
         green_robot: { img: "green_robot.png", side: 80, nbStates: 9, isObstacle: true, offsetX: -14, category: "robot", team: 0, zOrder: 2 },
         hole: { num: 2, img: "hole.png", side: cellSide, category: "hole", isObstacle: false, isHole: true, zOrder: 0 },
         marble: { num: 3, img: "marble.png", side: cellSide, category: "marble", isObstacle: false, isTransportable: true, zOrder: 1 }
      },
      maxInstructions: 15,
      includeBlocks: {
         groupByCategory: false,
         generatedBlocks: {
            robot: {
               easy: ["east", "pickTransportable", "dropTransportable", "onHole"],
               medium: ["east", "west", "south", "pickTransportable", "dropTransportable", "onHole", "onTransportable"],
               hard: ["east", "west", "south", "pickTransportable", "dropTransportable", "onHole", "onTransportable"]
            }
         },
         standardBlocks: {
            includeAll: false,
            wholeCategories: [],
            singleBlocks: {
               easy: ["controls_whileUntil", "logic_negate"],
               medium: ["controls_repeat", "controls_whileUntil", "logic_negate"],
               hard: ["controls_whileUntil", "logic_negate", "controls_repeat"]
            }
         },
      },
      ignoreInvalidMoves: false,
      checkEndEveryTurn: false,
      checkEndCondition: function(context, lastTurn) {
         var solved = true;
         for (var iRow = 0; iRow < context.tiles.length; iRow++) {
            var row = subTask.data[subTask.level][subTask.iTestCase].tiles[iRow];
            for (var iCol = 0; iCol < row.length; iCol++) {
               var marbles = context.getItems(iRow, iCol, {category: "marble"});
               var holes = context.getItems(iRow, iCol, {category: "hole"});
               if (marbles.length != holes.length) {
                  solved = false;
               }
            }
         }
         if (solved) {
            context.success = true;
            throw("Bravo, vous avez rangé toutes les billes&nbsp;!");
         }
         if (lastTurn) {
            context.success = false;
            throw("Les billes sont mal rangées !");
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
                   [1, 3, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1]
               ],
            initItems: [
                  { row: 0, col: 0, dir: 0, type: "green_robot" },
               ]
         },
         {
            tiles: [
                   [1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 0, col: 0, dir: 0, type: "green_robot" },
               ]
         }
      ],
      medium: [
         {
            tiles: [
                   [1, 3, 1, 1, 2, 1, 1],
                   [1, 3, 1, 1, 2, 1, 1],
                   [1, 3, 1, 1, 2, 1, 1],
                   [1, 3, 1, 1, 2, 1, 1],
                   [1, 3, 1, 1, 2, 1, 1],
                   [1, 3, 1, 1, 2, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1],
               ],
            initItems: [
                  { row: 0, col: 0, dir: 0, type: "green_robot" },
               ]
         },
         {
            tiles: [
                   [1, 3, 1, 1, 2, 1, 1],
                   [1, 3, 1, 1, 2, 1, 1],
                   [1, 3, 1, 1, 2, 1, 1],
                   [1, 3, 1, 1, 2, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1],
               ],
            initItems: [
                  { row: 0, col: 0, dir: 0, type: "green_robot" },
               ]
         }
      ],
      hard: [
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
                   [1, 1, 1, 1, 3, 1, 1, 1, 2, 1, 1, 1, 1],
                   [1, 1, 1, 3, 1, 2, 1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1],
                   [1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
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
