function initTask(subTask) {

    subTask.gridInfos = {
        hideSaveOrLoad: false,
        actionDelay: 200,
        buttonScaleDrawing: false,

        includeBlocks: {
            groupByCategory: false,
            generatedBlocks: {
                p5: [
                    'playSignal',
                    'playRecord',
                    'playStop',
                    'sleep'
                ]
            },
            standardBlocks: {
                includeAll: false
            }
        },
        maxInstructions: 100,
        checkEndEveryTurn: false,
        checkEndCondition: function(context, lastTurn) {
            context.success = true;
            throw(strings.complete);
        }
    }

    subTask.data = {
        easy: [{}]
    }
    initBlocklySubTask(subTask)
}
initWrapper(initTask, null, null)