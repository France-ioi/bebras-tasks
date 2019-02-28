function initTask(subTask) {
   var cellSide = 60;

   subTask.gridInfos = {
      hideSaveOrLoad: true,
      cellSide: cellSide,
      showLabels: true,
      actionDelay: 200,
      itemTypes: {
         green_robot: { img: "green_robot.png", category: "robot", side: 80, nbStates: 9, offsetX: -14, zOrder: 2 },
         paint: { img: "paint.png", side: cellSide, isPaint: true, zOrder: 1 },
         marker: { num: 2, img: "marker.png", side: cellSide, isMarker: true, zOrder: 0 }
      },
      maxInstructions: {
         easy: 20,
         medium: 25,
         hard: 30
      },
      includeBlocks: {
         groupByCategory: false,
         generatedBlocks: {
            robot: {
               easy: ["east", "paint", "col"],
               medium: ["east", "west", "north", "paint", "col", "row"],
               hard: ["east", "north", "west", "paint", "col", "row"]
            }
         },
         standardBlocks: {
            includeAll: false,
            wholeCategories: [],
            singleBlocks: ["controls_repeat", "logic_compare", "math_number", "controls_if", "logic_operation"]
         }
      },
      ignoreInvalidMoves: false,
      checkEndEveryTurn: false,
      checkEndCondition: robotEndConditions.checkMarkersPainted
   };

   subTask.data = {
      easy: [
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1]
               ],
            initItems: [
                  { row: 0, col: 1, dir: 0, type: "green_robot" }
               ]
         },
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 0, col: 3, dir: 0, type: "green_robot" }
               ]
         }
      ],
      medium: [
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1],
                   [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
                   [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
                   [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
                   [2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1],
                   [2, 2, 2, 2, 1, 1, 1, 2, 1, 1, 1],
                   [2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 10, col: 0, dir: 0, type: "green_robot" }
               ]
         }
      ],
      hard: [
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1],
                   [1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1],
                   [1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1],
                   [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                   [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],
                   [1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1],
                   [1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1],
                   [1, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 8, col: 0, dir: 0, type: "green_robot" }
               ]
         }
      ]
   };

   initBlocklySubTask(subTask);
   displayHelper.thresholdEasy = 5000;
   displayHelper.thresholdMedium = 10000;
}

initWrapper(initTask, ["easy", "medium", "hard"], null, true);
