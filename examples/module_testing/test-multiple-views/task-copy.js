(function() {
    function initTask(subTask) {
        subTask.gridInfos = {
            conceptViewer: true,
            contextType: 'course',
            maxInstructions: { basic: 8, easy: 10, medium: 12, hard: 15 },
            includeBlocks: {
                groupByCategory: false,
                generatedBlocks: {
                    robot: {
                        shared: ['east'],
                        easy: ['north', 'south', 'east', 'west'],
                        medium: ['north', 'south', 'east', 'west'],
                        hard: ['north', 'south', 'east', 'west']
                    }
                },
                standardBlocks: {
                    includeAll: false,
                    wholeCategories: [],
                    singleBlocks: {
                        shared: [],
                        easy: [],
                        medium: ['controls_repeat'],
                        hard: ['controls_repeat']
                    }
                }
            }
        };

        subTask.data = {
            easy: [
                {
                    tiles: [[2, 2, 2, 2, 2, 2], [2, 1, 1, 1, 3, 2], [2, 2, 2, 2, 2, 2]],
                    initItems: [{ row: 1, col: 1, type: 'red_robot' }]
                }
            ],
            medium: [
                {
                    tiles: [[2, 2, 2, 2, 2], [2, 1, 1, 1, 2], [2, 1, 2, 1, 2], [2, 2, 3, 1, 2], [2, 2, 2, 2, 2]],
                    initItems: [{ row: 2, col: 1, type: 'red_robot', dir: null }]
                }
            ]
        };

        initBlocklySubTask(subTask);
        displayHelper.thresholdEasy = 5000;
        displayHelper.thresholdMedium = 10000;
    }

    initWrapper(initTask, ['easy', 'medium'], null, true);
})()