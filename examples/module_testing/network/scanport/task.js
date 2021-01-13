function initTask(subTask) {

    var network = [
        {
            ip: '1.1.1.?',
            ports: [23, 80]
        },
        {
            ip: '1.1.1.1?',
            ports: [22, 23]
        }
    ]


    subTask.gridInfos = {
        hideSaveOrLoad: false,
        actionDelay: 500,
        maxIter: 10000000,

        includeBlocks: {
            groupByCategory: true,
            generatedBlocks: {
                scanip: {
                    easy: [
                        'scanPort',
                        'print',
                        'getArgument',
                        'getArgumentsLength'
                    ],
                    medium: [
                        'scanPort',
                        'print',
                        'getArgument',
                        'getArgumentsLength'
                    ],
                    hard: [
                        'scanPort',
                        'print',
                        'getArgument',
                        'getArgumentsLength'
                    ]                                                            
                }
            },
            standardBlocks: {
                includeAll: true,
                wholeCategories: ["logic", "loops", "variables"]
            },
        },
        checkEndEveryTurn: false,
        checkEndCondition: function(context, lastTurn) {
            context.validator.checkScanPort(context, lastTurn);
        },                
        startingExample: {
            easy: {
                python: 
`from scanip import *

cmd = argv[0]
n = len(argv) 
for i in range(1, n):
    ip = argv[i]
    for j in range(1, 100):
        res = scanPort(ip, j)
        if res["status"] == "open":
            print(ip + ":" + str(j) + " open")
`
            }
        }
       
    };

    subTask.data = {
        easy: [{
            network: network,
            cmd: 'scanports 1.1.1.5'
        }],
        medium: [{
            network: network,
            cmd: 'scanports 1.1.1.5 1.1.1.15'
        }],
        hard: [{
            network: network,
            cmd: 'scanports 1?.11.11.11 22.22.22.?2'
        }]
    };

    initBlocklySubTask(subTask);
}
initWrapper(initTask, ['easy', 'medium', 'hard']);