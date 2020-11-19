function initTask(subTask) {


    var network = [
        {
            // ip, required
            ip: '100.100.100.100',

            // host name, required
            domain: 'host1'
        },
        {
            ip: '101.100.100.100',
            domain: 'host2',
            
            // round trip time, optional
            rtt: {
                min: 1,
                max: 5
            }
        },
        {
            ip: '102.100.100.100',
            domain: 'host3',

            // rtt can be constant
            rtt: 20
            
        },
        {
            ip: '103.100.100.100',
            domain: 'host4'
            // if rtt not defined then random value in range [0..10] used
        }
    ]


    subTask.gridInfos = {
        hideSaveOrLoad: false,
        actionDelay: 500,

        includeBlocks: {
            groupByCategory: true,
            generatedBlocks: {
                traceroute: {
                    easy: [
                        'parseArgument',
                        'getAddrInfo',
                        'sendPacket',
                        'print'
                    ],
                    medium: [
                        'parseArgument',
                        'getAddrInfo',
                        'sendPacket',
                        'print'
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
        startingExample: {
            easy: {
                python: 
`from traceroute import *

domain = parseArgument()
ip = getAddrInfo(domain)

max_ttl = 10

for ttl in range(1, max_ttl + 1):
    res = sendPacket(ip, ttl)
    print(str(ttl) + " " + res["domain"] + " " + res["ip"] + " " + str(res["rtt"]) + "ms")
    if res["ip"] == ip:
        break
`
            }
        }
    };

    subTask.data = {
        easy: [{
            network: network,
            cmd: 'traceroute host4'
        },
        ],
        medium: [{
            network: network,
            cmd: 'traceroute host4'
        }]
    };

    initBlocklySubTask(subTask);
}
initWrapper(initTask, ["easy", "medium"], "easy", true);