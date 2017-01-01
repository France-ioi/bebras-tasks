function initTask(subTask) {
   var cellSide = 60;

   subTask.gridInfos = {
      hideSaveOrLoad: true,
      cellSide: cellSide,
      actionDelay: 200,
      itemTypes: {
         green_robot: { img: "green_robot.png", side: 80, nbStates: 9, isObstacle: true, offsetX: -14, category: "robot", team: 0 },
         obstacle: { num: 2, img: "obstacle.png", side: cellSide, category: "obstacle", isObstacle: true },
         green: { num: 3, img: "green.png", side: cellSide, category: "paint", isObstacle: false, hasColor: true, color: "vert" }
      },
      maxInstructions: 6,
      generators: {
         robot: ["east", "north"]
      },
      ignoreInvalidMoves: false,
      groupByCategory: false,
      includedAll: false,
      includedCategories: [ ],
      includedBlocks: [],
      checkEndEveryTurn: true,
      checkEndCondition: function(context, lastTurn) {
         var robot = context.getRobotItem(context.curRobot);
         var paints = context.getItems(robot.row, robot.col, {color: "vert"});
         if (paints.length != 0) {
            context.success = true;
            throw("Bravo, le robot a atteint la zone verte !");
         }
         if (lastTurn) {
            context.success = false;
            throw("Le robot n'a pas atteint la zone verte !");
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
                   [2, 2, 2, 2, 2, 2, 2, 2],
                   [2, 1, 1, 1, 1, 1, 1, 2],
                   [2, 1, 1, 2, 2, 1, 1, 2],
                   [2, 1, 1, 2, 1, 3, 1, 2],
                   [2, 1, 1, 1, 1, 2, 1, 2],
                   [2, 1, 1, 1, 1, 1, 1, 2],
                   [2, 2, 2, 2, 2, 2, 2, 2]
               ],
            initItems: [
                  { row: 4, col: 3, dir: 0, type: "green_robot" },
               ]
         }
      ]
   };

   initBlocklySubTask(subTask);
}

initWrapper(initTask, null, null, true);
   