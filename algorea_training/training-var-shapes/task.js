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
         marker: { num: 9, img: "marker.png", side: cellSide, isMarker: true, category: "marker", isObstacle: false, hasColor: true, color: "marker", zOrder: 0 },
         paint: { img: "paint.png", side: cellSide, isPaint: true, category: "paint", color: "gris", zOrder: 1 }
      },
      maxInstructions: {
         easy: 15,
         medium: 25,
         hard: 30
      },
      includeBlocks: {
         groupByCategory: {
            easy: false,
            medium: true,
            hard: true
         },
         generatedBlocks: {
            robot: {
               easy: ["east", "numberUnder", "paint"],
               medium: ["east", "west", "south", "numberUnder", "paint"],
               hard: ["east", "west", "south", "numberUnder", "paint"]
            }
         },
         standardBlocks: {
            includeAll: false,
            wholeCategories: {
               easy: [],
               medium: ["variables"],
               hard: ["variables"]
            },
            singleBlocks: {
               easy: ["controls_repeat_ext"],
               medium: ["controls_repeat_ext"],
               hard: ["controls_repeat_ext", "math_arithmetic", "math_number"]
            }
         },
         variables: {
            easy: ["nombreMarquées"],
            medium: [],
            hard: []
         }
      },
      checkEndEveryTurn: false,
      checkEndCondition: robotEndConditions.checkMarkersPainted
   };

   subTask.data = {
      easy: [
         {
            tiles: [
                   [1, 5, 1, 9, 9, 9, 9, 9, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 0, col: 0, dir: 0, type: "green_robot" }
               ]
         },
         {
            tiles: [
                   [1, 7, 1, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1]
               ],
            initItems: [
                  { row: 0, col: 0, dir: 0, type: "green_robot" }
               ]
         }
      ],
      medium: [
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 3, 5, 1, 1, 1, 1, 1],
                   [1, 1, 9, 9, 9, 9, 9, 1],
                   [1, 1, 9, 9, 9, 9, 9, 1],
                   [1, 1, 9, 9, 9, 9, 9, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 1, col: 0, dir: 0, type: "green_robot" }
               ]
         },
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 4, 6, 1, 1, 1, 1, 1, 1],
                   [1, 1, 9, 9, 9, 9, 9, 9, 1],
                   [1, 1, 9, 9, 9, 9, 9, 9, 1],
                   [1, 1, 9, 9, 9, 9, 9, 9, 1],
                   [1, 1, 9, 9, 9, 9, 9, 9, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 1, col: 0, dir: 0, type: "green_robot" }
               ]
         }
      ],
      hard: [
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 5, 1, 1, 1, 1, 1, 1],
                   [1, 1, 9, 1, 1, 1, 1, 1],
                   [1, 1, 9, 9, 1, 1, 1, 1],
                   [1, 1, 9, 9, 9, 1, 1, 1],
                   [1, 1, 9, 9, 9, 9, 1, 1],
                   [1, 1, 9, 9, 9, 9, 9, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1]
               ],
            initItems: [
                  { row: 1, col: 0, dir: 0, type: "green_robot" }
               ]
         },
         {
            tiles: [
                   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 8, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 9, 1, 1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 9, 9, 1, 1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 9, 9, 9, 1, 1, 1, 1, 1, 1, 1],
                   [1, 1, 9, 9, 9, 9, 1, 1, 1, 1, 1, 1],
                   [1, 1, 9, 9, 9, 9, 9, 1, 1, 1, 1, 1],
                   [1, 1, 9, 9, 9, 9, 9, 9, 1, 1, 1, 1],
                   [1, 1, 9, 9, 9, 9, 9, 9, 9, 1, 1, 1],
                   [1, 1, 9, 9, 9, 9, 9, 9, 9, 9, 1, 1],
                   [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
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
