function initTask(subTask) {

    subTask.gridInfos = {
        hideSaveOrLoad: false,
        actionDelay: 200,
        buttonScaleDrawing: false,
        hideValidate: true,

        includeBlocks: {
            groupByCategory: true,
            generatedBlocks: {
                database: [
                    'loadTable',
                    'loadTableFromCsv',
                    'joinTables',
                    'displayTable',
                    'unionTables',
                    'displayRecord',
                    'getColumn',
                    'displayTableOnMap',
                    'getRecords',
                    'selectByColumn',
                    'selectByFunction',
                    'sortByColumn',
                    'sortByFunction',
                    'selectColumns',
                    'updateWhere',
                    'insertRecord'
                ]
            },
            standardBlocks: {
                wholeCategories: ["logic", "loops", "math", "texts", "lists", "dicts", "variables", "functions"]
            }
        },
        maxInstructions: 0,
        checkEndEveryTurn: false,
        checkEndCondition: function(context, lastTurn) {
            // subTask.data.easy.tables
            if(context.expectTable('valid_table')) {
                context.success = true;
                throw(strings.complete);
            }
        },
        databaseOptions: {
            render_row_height: '20px',
            render_max_rows: 10,
        },
        example: {
           blockly: '<xml xmlns="http://www.w3.org/1999/xhtml"><block type="robot_start" id="cwD?Km9#D6D_9NH{A6z." deletable="false" movable="false" editable="false" x="0" y="0"><next><block type="variables_set" id="a]yR,?2V:Y{m[l@LB21d"><field name="VAR">testTable</field><value name="VALUE"><block type="loadTable" id="fk_p6Sad,f:)m!aga1=/"><value name="PARAM_0"><shadow type="text" id="kzOpIV1e?gT;WG;vkW(0"><field name="TEXT">test_table</field></shadow></value></block></value><next><block type="displayTable" id=",`vFND|DG-thvpo?[!*h"><value name="PARAM_0"><block type="variables_get" id="eX}C#H;I@ep@`krGs._m"><field name="VAR">testTable</field></block></value><value name="PARAM_1"><block type="lists_create_with" id="eJck9xqe(BAu+[+YwNzR"><mutation items="4"></mutation><value name="ADD0"><block type="text" id="~(IMsSdX=oJfbw:F;prx"><field name="TEXT">id</field></block></value><value name="ADD1"><block type="text" id="!vX`z7e]|Vwz)sj*~)dN"><field name="TEXT">image</field></block></value><value name="ADD2"><block type="text" id="s6GeqLT,t)Znb::/f=r;"><field name="TEXT">name</field></block></value><value name="ADD3"><block type="text" id="h!`nE@pJO#)gvd@HEc7U"><field name="TEXT">date</field></block></value></block></value></block></next></block></next></block></xml>'
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
            //[ 4, null, 'null_image_here_null_image_here_null_image_here_null_image_here', '2021-01-01' ],
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
            'city', 'lat', 'lng'
        ],
        columnTypes: [
            'string', 'number', 'number'
        ],
        records: [
            ["Dunkerque", 51.069360, 2.376571],
            ["Calais", 50.979622, 1.855583],
            ["Lille", 50.650582, 3.056121]
        ]
    }


    var valid_table2 = {
        columnNames: [
            'city', 'lat', 'lng'
        ],
        columnTypes: [
            'string', 'number', 'number'
        ],
        records: [
            ["Dunkerque", 51.069360, 2.376571],
            ["Calais", 50.979622, 1.855583]
        ]
    }

    subTask.data = {
        easy: [{
            tables: {
                test_table: test_table,
                valid_table: valid_table,
                test_table2: test_table2,
                valid_table2: valid_table2
            }
        }]
    }
    initBlocklySubTask(subTask)
}
initWrapper(initTask, null, null)