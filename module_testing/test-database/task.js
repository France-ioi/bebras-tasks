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
                includeAll: true
            }
        },
        maxInstructions: 100,
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
            [ 1, 'img/apple.jpg', 'apple', '2018-01-01' ],
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