function initTask(subTask) {
   var cellSide = 60;

   subTask.gridInfos = {
      hideSaveOrLoad: true,
      cellSide: cellSide,
      actionDelay: 200,
      itemTypes: {
         green_robot: { img: "green_robot.png", side: 80, nbStates: 9, isObstacle: true, offsetX: -14, category: "robot", team: 0, zOrder: 2 },
         hole: { num: 2, img: "hole.png", side: cellSide, category: "hole", isObstacle: false, isHole: true, zOrder: 0 },
         marble: { num: 3, img: "marble.png", side: cellSide, category: "marble", isObstacle: false, isTransportable: true, zOrder: 1 },
      },
      maxInstructions: 20,
      generators: {
         robot: ["east", "west", "pickTransportable", "dropTransportable"],
         transport: ["col"]
      },
      ignoreInvalidMoves: false,
      groupByCategory: false,
      includedAll: false,
      includedCategories: [ ],
      includedBlocks: {
            easy: [],
            medium: [],
            hard: []
         },
      checkEndEveryTurn: false,
      checkEndCondition: function(context, lastTurn) {
         var solved = true;
         var nbMarbles = 0;
         for (var iRow = 0; iRow < context.tiles.length; iRow++) {
            var row = subTask.data[subTask.level][subTask.iTestCase].tiles[iRow];
            for (var iCol = 0; iCol < row.length; iCol++) {
               var marbles = context.getItems(iRow, iCol, {category: "marble"});
               var holes = context.getItems(iRow, iCol, {category: "hole"});
               if (marbles.length != holes.length) {
                  solved = false;
               }
               nbMarbles += marbles.length;
            }
         }
         if (solved) {
            context.success = true;
            if (nbMarbles == 1) {
               throw("Bravo, vous avez rangé la bille&nbsp;!");
            } else {
               throw("Bravo, vous avez rangé les billes&nbsp;!");
            }
         }
         if (lastTurn) {
            context.success = false;
            if (nbMarbles <= 1) {
               throw("La bille est mal rangée !");
            } else {
               throw("Les billes sont mal rangées !");
            }
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
                   [1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 1, 3, 1, 1, 2, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 1, col: 1, dir: 0, type: "green_robot" },
               ]
         }
      ],
      medium: [
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 1, 2, 1, 3, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 1, col: 1, dir: 0, type: "green_robot" },
               ]
         }
      ],
      hard: [
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 1, 3, 3, 1, 2, 2, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 1, col: 1, dir: 0, type: "green_robot" },
               ]
         }
      ]
   };

   initBlocklySubTask(subTask);
   displayHelper.thresholdEasy = 5000;
   displayHelper.thresholdMedium = 10000;
}

initWrapper(initTask, ["easy", "medium", "hard"], null, true);
