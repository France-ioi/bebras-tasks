function initTask(subTask) {

   subTask.gridInfos = {
      hideSaveOrLoad: true,
      actionDelay: 200,

      includeBlocks: {
         groupByCategory: true,
         generatedBlocks: {
            processing: ["background", "fill", "stroke", "strokeWeight", "rect", "ellipse", "line", "triangle", "quad", "arc", "point"]
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
         var ops = [
            { func: 'fill', args: [0, 0, 0] },
            { func: 'ellipse', args: [150, 180, 180, 180] },
            { func: 'ellipse', args: [70, 70, 100, 100] },
            { func: 'ellipse', args: [230, 70, 100, 100] }
         ];
         if (context.processing.ops.length != ops.length) {
            throw(strings.drawingWrong);
         }
         for (var iOp = 0; iOp < context.processing.ops.length && iOp < ops.length; iOp++) {
            var cOp = context.processing.ops[iOp];
            if (cOp.func != ops[iOp].func || cOp.args.length != ops[iOp].args.length) {
               throw(strings.drawingWrong);
            }
            for (var iArg = 0; iArg < cOp.args.length && iOp < ops[iOp].args.length; iArg++) {
               if (cOp.args[iArg] != ops[iOp].args[iArg]) {
                  throw(strings.drawingWrong);
               }
            }
         }
         throw(strings.drawingCorrect);
      }
   };

   subTask.data = {
      easy: [
         {}
      ],
   };

   initBlocklySubTask(subTask);
}

initWrapper(initTask, null, null);
   
