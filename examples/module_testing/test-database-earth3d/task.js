function initTask(subTask) {

    subTask.gridInfos = {
        hideSaveOrLoad: false,
        actionDelay: 200,
        buttonScaleDrawing: false,

        includeBlocks: {
            groupByCategory: true,
            generatedBlocks: {
                database: [
                    'loadTable',
                    'loadTableFromCsv',
                    'loadTableFromCsvWithTypes',
                    'joinTables',
                    'displayTable',
                    'unionTables',
                    'displayRecord',
                    'getColumn',
                    'displayTableOnMap',
                    'getRecords',
                    'selectByColumn',
                    'selectByFunction',
                    'selectTopRows',
                    'sortByColumn',
                    'sortByFunction',
                    'selectColumns',
                    'updateWhere',
                    'insertRecord',
                    'printConsole',
                    'displayTableOnGraph'
                ]
            },
            standardBlocks: {
                wholeCategories: ["logic", "loops", "math", "texts", "lists", "dicts", "variables", "functions"]
            }
        },
        maxInstructions: 100,
        checkEndEveryTurn: false,
        checkEndCondition: function(context, lastTurn) {
            
        },
        databaseConfig: {
            /*
            pin_file: 'img/pin.png',
            pin_file_mistake: 'img/pin2.png',
            map_file: 'img/carteDeFrance.png',
            */            
            
            map3d: true,
            camera: {
                lat: 48,
                lng: 3
            },            
            distance: 0.02,            
            
            map_lng_left: -4.85,
            map_lng_right: 9.65,
            map_lat_top: 51.6,
            map_lat_bottom: 41.7,
            //disable_csv_import: true,
            //calculate_hash: true,
            strict_types: true
        },

        startingExample: {
            easy: {
                blockly: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" id="rE`@,@xs]ZIaVgD/FX:L" deletable="false" movable="false" editable="false" x="0" y="0"><next><block type="displayTableOnMap" id="|f|?L.77W]n=n|x!qR{s"><value name="PARAM_0"><block type="loadTable" id="qYAw|Tpim6hPToG]DYTO"><value name="PARAM_0"><shadow type="text" id="[3YKTonF!gn?|`!_]kC("><field name="TEXT">test</field></shadow></value></block></value><value name="PARAM_1"><shadow type="text" id="mz~7Oh-C=0fO4X?I?.cT"><field name="TEXT">name</field></shadow></value><value name="PARAM_2"><shadow type="text" id="{TCfBvl7d!KRYF5-,un+"><field name="TEXT">longitude</field></shadow></value><value name="PARAM_3"><shadow type="text" id="voLaM#BC60AZBE7I-.V-"><field name="TEXT">latitude</field></shadow></value></block></next></block></xml>'
            }
        }
    }


    var table = {
        columnNames: [
            'name', 'num_dpt', 'latitude', 'longitude', 'altitude', 'nb_hab'
        ],
        columnTypes: [
            'string', 'number', 'number', 'number', 'number', 'number'
        ],
        records: [
            ["Dunkerque", 59, 51.069360, 2.376571, 4, 88900],
            ["Calais", 62, 50.979622, 1.855583, 3, 76000],
            ["Lille", 59, 50.650582, 3.056121, 21, 232700],
            ["Béthune", 62, 50.545887, 2.648391, 38, 27800],
            ["Lens", 62, 50.381367, 3.056121, 39, 36200],
            ["Valenciennes", 59, 50.366410, 3.531806, 28, 41300],
            ["Amiens", 80, 49.887806, 2.308616, 34, 132900],
            ["Le Havre", 76, 49.483984, 0.134056, 8, 172400],
            ["Rouen", 76, 49.439114, 1.108078, 16, 110200],
            ["Reims", 51, 49.259638, 4.007492, 88, 184100],
        ]
    }



    subTask.data = {
        easy: [{
            tables: {
                test: {
                    public: true,
                    data: table
                }
            }
        }]
    }
    initBlocklySubTask(subTask)
}
initWrapper(initTask, ['easy'])
