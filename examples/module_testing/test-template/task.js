function initTask(subTask) {

   subTask.gridInfos = {
      hideSaveOrLoad: true,
      actionDelay: 200,

      includeBlocks: {
         groupByCategory: true,
         generatedBlocks: {
            template: ["doAction", "doNothing", "readSensor"]
         },
         standardBlocks: {
            includeAll: false,
            wholeCategories: ["logic", "loops", "math", "variables"],
            singleBlocks: [],
         },
      },
      maxInstructions: 22,
      checkEndEveryTurn: false,
      checkEndCondition: function(context, lastTurn) {
          context.success = true;
          throw(strings.outputCorrect);
      }
   };

   subTask.data = {
      easy: [{}]
   };

   initBlocklySubTask(subTask);
}

initWrapper(initTask, null, null);
   
