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
            context.expectTable('valid_table_map');
        },
        databaseConfig: {
            width: 200,
            height: 200,
            pin_file: 'img/pin.png',
            pin_file_mistake: 'img/pin2.png',
            map_file: 'img/carteDeFrance.png',
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
                // displayTable
                //blockly: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" id="7].xKgsd)es/lp`gMaa6" deletable="false" movable="false" editable="false" x="0" y="0"><next><block type="variables_set" id="1@PSOoPoyip2+8PkX7CU"><field name="VAR">testTable</field><value name="VALUE"><block type="loadTableFromCsv" id="IbS=W{_;wCRDMAx_RN}J"><value name="PARAM_0"><shadow type="text" id="s-deWk2cy/rlDAD-ZajW"><field name="TEXT">1</field></shadow></value><value name="PARAM_1"><shadow type="math_number" id=")H:LCPk*e]lmU}oWc+I4"><field name="NUM">1</field></shadow><block type="lists_create_with" id="hm_#53Wfo80tP(FkscP5"><mutation items="6"></mutation><value name="ADD0"><block type="text" id="C+vla|xRN*Zfp1kO0q#O"><field name="TEXT">string</field></block></value><value name="ADD1"><block type="text" id="tJi.A?G|l(~,e}C?[Hb,"><field name="TEXT">number</field></block></value><value name="ADD2"><block type="text" id="iC6]RtDQ;f}4ZoL}+LG2"><field name="TEXT">number</field></block></value><value name="ADD3"><block type="text" id="424~3]7F~eDj1!1yd3@."><field name="TEXT">number</field></block></value><value name="ADD4"><block type="text" id="8/KWa=B-fcSM0br,Jx4v"><field name="TEXT">number</field></block></value><value name="ADD5"><block type="text" id="PiTF_W.Rc]_{l|_1t-Uw"><field name="TEXT">number</field></block></value></block></value></block></value><next><block type="displayTable" id="?jL`FJm`gVT1Gbtk]eOj"><value name="PARAM_0"><block type="variables_get" id="8kxnzpZMG|:Lr7g[NpTp"><field name="VAR">testTable</field></block></value></block></next></block></next></block></xml>'

                // displayTableOnMap
                blockly: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" id="STPaXdlEm-h;3/Ztbl?S" deletable="false" movable="false" editable="false" x="0" y="0"><next><block type="variables_set" id="a]yR,?2V:Y{m[l@LB21d"><field name="VAR">testTable</field><value name="VALUE"><block type="loadTable" id="fk_p6Sad,f:)m!aga1=/"><value name="PARAM_0"><shadow type="text" id="kzOpIV1e?gT;WG;vkW(0"><field name="TEXT">test_table2</field></shadow></value></block></value><next><block type="displayTableOnMap" id=",x,8`ZVwjoKAnleP:W;-"><value name="PARAM_0"><block type="variables_get" id="eX}C#H;I@ep@`krGs._m"><field name="VAR">testTable</field></block></value><value name="PARAM_1"><shadow type="text" id="q`aYiOA?dh9Yp_W[)HOK"><field name="TEXT">city</field></shadow></value><value name="PARAM_2"><shadow type="text" id="?sQ7~(yu!6_m*6(=6m.("><field name="TEXT">lng</field></shadow></value><value name="PARAM_3"><shadow type="text" id="I{y@bHZdc[JK6mp@*LN6"><field name="TEXT">lat</field></shadow></value></block></next></block></next></block></xml>'
            }
        }
    }


    var test_table = {
        columnNames: [
            'id', 'image', 'name', 'date'
        ],
        columnTypes: [
            'number', 'image', 'string', 'date'
        ],
        records: [
            [ 1, 'img/apple.jpg', 'apple1', '2018-01-01' ],
            [ 2, 'img/banana.jpg', 'banana', '2019-01-01' ],
            [ 3, 'img/kiwi.jpg', 'kiwi', '2020-01-01' ],
            [ 4, null, 'null_image_here_null_image_here_null_image_here_null_image_here', '2021-01-01' ],
        ]
    }


    var valid_table = {
        columnNames: [
            'id', 'image', 'name', 'date'
        ],
        columnTypes: [
            'number', 'image', 'string', 'date'
        ],
        records: [
            [ 1, 'img/apple.jpg', 'apple', '2018-01-01' ],
            [ 2, 'img/banana.jpg', 'banana', '2019-01-01' ],
            [ 3, 'img/kiwi.jpg', 'kiwi', '2020-01-01' ]
        ]
    }



    var test_table2 = {
        columnNames: [
            'city', 'lng', 'lat'
        ],
        columnTypes: [
            'string', 'number', 'number'
        ],
        records: [
            ["Tours", 0.700347, 47.405046],
            ["Besançon", 6.023490, 47.270439],
            ["Lille", 3.056121, 50.650582]
        ]
    }


    var valid_table2 = {
        // column names order important here, must be: city, lng, lat
        columnNames: [
            'city', 'lng', 'lat'
        ],
        columnTypes: [
            'string', 'number', 'number'
        ],
        records: [
            ["Tours", 0.700347, 47.405046],
            ["Besançon", 6.023490, 47.270439],
            //["Lille", 3.056121, 50.650582]
        ]
    }

    var valid_table3 = {
        columnNames: [
            'nom', 'num_dpt', 'latitude', 'longitude', 'altitude', 'nb_hab'
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


    var valid_table_map = {
        // columns names are important for grader, reference table must have "name", "lng" and "lat" columns
        columnNames: [
            'lng', 'name', 'lat'
        ],
        columnTypes: [
            'string', 'number', 'number'
        ],
        records: [
            [0,'P1',46],
            [8,'P2',50]
        ]
    }

    subTask.data = {
        easy: [{
            tables: {
                test_table2: {
                    public: true, // false,
                    data: test_table2
                },                
                valid_table3: {
                    public: true, // false,
                    data: valid_table3
                },
                valid_table_map: {
                    public: true, // false,
                    data: valid_table_map
                }
            }
        }]
    }
    initBlocklySubTask(subTask)
}
initWrapper(initTask, ['easy'])
