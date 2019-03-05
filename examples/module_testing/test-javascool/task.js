function initTask(subTask) {

    subTask.gridInfos = {
        hideSaveOrLoad: false,
        actionDelay: 200,
        buttonScaleDrawing: false,
        conceptViewer: true,
        hideValidate: true,

        includeBlocks: {
            groupByCategory: false,
            generatedBlocks: {
                javascool: [
                    'setPoint',
                    'addString',
                    'addLine',
                    'addCircle',
                    'waitForClick',
                    'getX',
                    'getY',
                    'reset',
                    'resetSize'
                ]
            },
            standardBlocks: {
                includeAll: false
            }
        },
        maxInstructions: 100,
        checkEndEveryTurn: false,
        checkEndCondition: function(context, lastTurn) {
            context.success = false;
            //throw(strings.complete);
        }
    }

    subTask.data = {
        easy: [{}]
    }
    initBlocklySubTask(subTask)
}
initWrapper(initTask, null, null)
