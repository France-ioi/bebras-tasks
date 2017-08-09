function initTask(subTask) {
   var cellSide = 60;

   subTask.gridInfos = {
      cellSide: cellSide,
      actionDelay: 200,
      showLabels: true,
      maxIterWithoutAction: 2000,
      itemTypes: {
         green_robot: { img: "green_robot.png", side: 80, nbStates: 9, isObstacle: true, offsetX: -14, category: "robot", team: 0, zOrder: 2 },
         marker: { num: 2, img: "marker.png", side: cellSide, category: "marker", isObstacle: false, isMarker: true, hasColor: true, color: "marker", zOrder: 0 },
         initialPaint: { num: 3, img: "paint.png", side: cellSide, category: "paint", isPaint: true, isMarker: true, color: "gris", zOrder: 1 },
         paint: { img: "paint.png", side: cellSide, category: "paint", isPaint: true, color: "gris", zOrder: 1 }
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
               hard: ["south", "east", "west", "paint", "paintOnCell", "col"]
            }
         },
         standardBlocks: {
            includeAll: false,
            wholeCategories: ["variables"],
            singleBlocks: {
               easy: ["lists_repeat", "lists_getIndex", "lists_setIndex", "controls_repeat_ext", "controls_if", "math_number", "logic_compare", "logic_boolean"],
               medium: ["lists_repeat", "lists_getIndex", "lists_setIndex", "controls_repeat_ext", "controls_if", "math_number", "math_arithmetic", "logic_compare"],
               hard: ["lists_repeat", "lists_create_with_empty", "lists_getIndex", "lists_setIndex", "controls_repeat_ext", "controls_if", "math_number", "math_arithmetic", "logic_compare"]
            }
         }
      },
      checkEndEveryTurn: false,
      checkEndCondition: robotEndConditions.checkMarkersPainted
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
