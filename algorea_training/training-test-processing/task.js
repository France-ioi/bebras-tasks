function initTask(subTask) {

   subTask.gridInfos = {
      hideSaveOrLoad: true,
      actionDelay: 200,

      includeBlocks: {
         groupByCategory: true,
         generatedBlocks: {
            processing: ["fillCanvas", "setFill", "setStroke", "drawRectangle", "drawEllipse"]
         },
         standardBlocks: {
            includeAll: true,
            wholeCategories: [],
            singleBlocks: []
         },
      },
      maxInstructions: 100,
      checkEndEveryTurn: false,
      checkEndCondition: function(context, lastTurn) {
          throw(strings.drawingCorrect);
      }
   };

   subTask.data = {
      easy: [
         {
         },
         {
         }
      ],
   };

   initBlocklySubTask(subTask);
}

initWrapper(initTask, null, null);
   
