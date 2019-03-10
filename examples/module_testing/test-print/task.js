function initTask(subTask) {

   subTask.gridInfos = {
      hideSaveOrLoad: true,
      actionDelay: 200,

      includeBlocks: {
         groupByCategory: true,
         generatedBlocks: {
             printer: ["print", "read", "readInteger", "readFloat", "eof"],
         },
         standardBlocks: {
            includeAll: false,
            wholeCategories: [ "logic", "loops", "math", "variables"],
            singleBlocks: [],
         },
      },
      maxInstructions: 22,
      checkEndEveryTurn: false,
      checkEndCondition: function(context, lastTurn) {
          context.checkOutputHelper();
          context.success = true;
          throw(strings.outputCorrect);
      }
   };

   subTask.data = {
      easy: [
         {
            input: "2\n",
            output: "2\n",
         },
         {
            input: "3\n",
            output: "3\n",
         }
      ],
   };

   initBlocklySubTask(subTask);
}

initWrapper(initTask, null, null);
   
