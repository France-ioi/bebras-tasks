(function () {
    var subTaskData = { basic:[ { tiles:[ [ 2,
          2,
          2,
          2 ],
        [ 2,
          1,
          3,
          2 ],
        [ 2,
          2,
          2,
          2 ] ],
      initItems:[ { col:1,
          row:1,
          type:"red_robot" } ],
      images:[ "chticode_abs/obstacle.png",
        "chticode_abs/red_robot.png" ] } ] }
    var checkEndCondition = "checkReachExit"

    function initTask(subTask) {
        subTask.gridInfos = { contextType:"chticode_abs",
  conceptViewer:false }
        subTask.gridInfos.maxInstructions = 10
        subTask.gridInfos.variables = [  ]
        subTask.gridInfos.includeBlocks = { groupByCategory:false,
  generatedBlocks:{ robot:[  ] },
  standardBlocks:{ includeAll:false,
    wholeCategories:[  ],
    singleBlocks:[  ] } }

        if(checkEndCondition) {
            subTask.gridInfos.checkEndCondition = robotEndConditions[checkEndCondition];
        }

        subTask.data = subTaskData;

        initBlocklySubTask(subTask);

        displayHelper.thresholdEasy = 5000
        displayHelper.thresholdMedium = 10000
    }

    initWrapper(initTask, Object.keys(subTaskData), null, true);
})();

window.task.reloadAnswer = function(strAnswer, success, error) {
  error("error text");
};