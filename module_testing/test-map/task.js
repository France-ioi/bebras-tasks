function initTask(subTask) {

    subTask.gridInfos = {
        hideSaveOrLoad: false,
        actionDelay: 200,
        buttonScaleDrawing: false,

        includeBlocks: {
            groupByCategory: false,
            generatedBlocks: {
                map: [
                    'clearMap',
                    'addLocation',
                    'addRoad',
                    'geoDistance',
                    'getLatitude',
                    'getLongitude',
                    'getNeighbors',
                    'shortestPath'
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
        },
        mapConfig: {
            pin_file: 'img/pin.png',
            map_file: 'img/carteDeFrance.png',
            map_lng_left: -4.85,
            map_lng_right: 9.65,
            map_lat_top: 51.6,
            map_lat_bottom: 41.7
        }
    }

    subTask.data = {
        easy: [{}]
    }
    initBlocklySubTask(subTask)
}
initWrapper(initTask, null, null)