function initTask(subTask) {

    var network = [
        {
            ip: '1.1.1.1?',
            status: 'online'
        },
        {
            ip: '1.1.1.2?',
            status: 'offline'
        }
    ]


    subTask.gridInfos = {
        hideSaveOrLoad: false,
        actionDelay: 500,

        includeBlocks: {
            groupByCategory: true,
            generatedBlocks: {
                scanip: {
                    basic: [
                        'sendPacket',
                        'print',
                        'getArgument',
                        'getArgumentsLength'
                    ],
                    easy: [
                        'sendPacket',
                        'print',
                        'getArgument',
                        'getArgumentsLength'
                    ],
                    medium: [
                        'sendPacket',
                        'print',
                        'getArgument',
                        'getArgumentsLength'
                    ],
                    hard: [
                        'sendPacket',
                        'print',
                        'getArgument',
                        'getArgumentsLength'
                    ]                                                            
                }
            },
            standardBlocks: {
                includeAll: true,
                wholeCategories: ["logic", "loops", "variables"],
                //wholeCategories: ["loops"],
                /*
                singleBlocks: {
                    basic: ["controls_if_else"],
                    easy: ["controls_infiniteloop", "logic_boolean", "controls_if_else", "controls_if"],
                    medium: ["controls_whileUntil", "logic_boolean", "controls_if_else", "controls_if"],
                    hard: ["controls_whileUntil", "logic_boolean"]
                },
                */
            },
        },
        checkEndEveryTurn: false,
        checkEndCondition: function(context, lastTurn) {
            context.validator.checkScanIP(context, lastTurn);
        },                        
        startingExample: {
            basic: {
                python: 
`from scanip import *

cmd = argv[0]
if cmd == "scanip":
    ip = argv[1]
    res = sendPacket(ip)
    print(ip + " " + res["status"] + " " + str(res["latency"]) + "ms")
elif cmd == "scanips": 
    n = len(argv) 
    for i in range(1, n):
        ip = argv[i]
        res = sendPacket(ip)
        print(ip + " " + res["status"] + " " + str(res["latency"]) + "ms")    
elif cmd == "scaniprange": 
    print("scaniprange")
    # TODO?
`
            }
        }
    };

    subTask.data = {
        basic: [{
            network: network,
            cmd: 'scanip 1.1.1.15'
        }],
        easy: [{
            network: network,
            cmd: 'scanips 1.1.1.5 1.1.1.15 1.1.1.25'
        }],
        medium: [{
            network: network,
            cmd: 'scaniprange 1.1.1.5 1.1.1.25'
        }],
        hard: [{
            network: network,
            cmd: 'scanips 3?.22.45.26 32.12?.12.11'
        }]
    };

    initBlocklySubTask(subTask);
}
initWrapper(initTask, ['basic', 'easy', 'medium', 'hard']);