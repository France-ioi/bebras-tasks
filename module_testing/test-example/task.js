function initTask(subTask) {

   subTask.gridInfos = {
      hideSaveOrLoad: false,
      actionDelay: 200,

      includeBlocks: {
         groupByCategory: true,
         generatedBlocks: {
            example: ["doAction", "doNothing", "readSensor"]
         },
         standardBlocks: {}
      },
      maxInstructions: 100,
      checkEndEveryTurn: false,
      checkEndCondition: function(context) {
         throw("Terminé.");
      }
   };

   subTask.data = {
      easy: []
   };

   initBlocklySubTask(subTask);
}

initWrapper(initTask, null, null);
