function initTask(subTask) {

    subTask.gridInfos = {
        hideSaveOrLoad: false,
        actionDelay: 100,

        includeBlocks: {
            groupByCategory: false,
            generatedBlocks: {
                quickpi: {
                    easy: ["turnLedOn",],
                    medium: ["turnLedOn", "turnLedOff", "sleep"],
                    hard: ["turnLedOn", "turnLedOff", "sleep"],
                }
            },
            standardBlocks: {

            },
        },
        //maxInstructions: 22,
        maxInstructions: {
            easy: 2,
            medium: 10,
            hard: 11
        },
        quickPiSensors: [
            { type: "led", name: 'led1' },
        ]
    };

    subTask.data = {
        easy: [{
            autoGrading: false,
            testName: "Expérimenter",
        },
        {
            testName: "Test 1",
            autoGrading: true,
            output: [
                { time: 0, type: "led", name: "led1", state: true },
            ],
        }],
        medium: [{
            autoGrading: false,
            testName: "Expérimenter",
        },
        {
            testName: "Test 1",
            autoGrading: true,
            output: [
                { time: 0, type: "led", name: "led1", state: true },
                { time: 1000, type: "led", name: "led1", state: false },
            ],
        }],
        hard: [{
            autoGrading: false,
            testName: "Expérimenter",
        },
        {
            testName: "Test 1",
            autoGrading: true,
            output: [
                { time: 0, type: "led", name: "led1", state: true },
                { time: 3000, type: "led", name: "led1", state: false },
                { time: 5000, type: "led", name: "led1", state: true },
                { time: 6000, type: "led", name: "led1", state: false },
            ],
        }]

    };

    initBlocklySubTask(subTask);
}

//initWrapper(initTask, null, null);
initWrapper(initTask, ["easy", "medium", "hard"], "easy", true);

