(function() {
    function initTask(subTask) {
        subTask.gridInfos = {
            mergedMode: true,

            mergedModeOptions: {
                robot: {
                    contextType: 'course',
                },
                database: {
                    databaseConfig: {
                        pin_file: 'img/pin.png',
                        pin_file_mistake: 'img/pin2.png',
                        map_file: 'img/carteDeFrance.png',
                        map_lng_left: -4.85,
                        map_lng_right: 9.65,
                        map_lat_top: 51.6,
                        map_lat_bottom: 41.7,
                        //disable_csv_import: true,
                        //calculate_hash: true,
                        //strict_types: true
                    }
                }
            },

            conceptViewer: true,
            maxInstructions: { easy: 50, medium: 50 },
            includeBlocks: {
                groupByCategory: false,
                generatedBlocks: {
                    robot: {
                        shared: ['east'],
                        easy: ['north', 'south', 'east', 'west'],
                        medium: ['north', 'south', 'east', 'west'],
                        hard: ['north', 'south', 'east', 'west']
                    },
                    database: {
                        shared: ['loadTable', 'displayTable' ]
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
            },

        };

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
                //[ 4, null, 'null_image_here_null_image_here_null_image_here_null_image_here', '2021-01-01' ],
            ]
        }

        subTask.data = {
            easy: [
                {
                    robot: {
                        tiles: [[2, 2, 2, 2, 2, 2], [2, 1, 1, 1, 3, 2], [2, 2, 2, 2, 2, 2]],
                        initItems: [{ row: 1, col: 1, type: 'red_robot' }],
                    },
                    database: {
                        tables: {
                            test_table: {
                                public: true,
                                data: test_table
                            }
                        }
                    }
                },
                {
                    robot: {
                        tiles: [[2, 2, 2, 2, 2], [2, 1, 1, 1, 2], [2, 1, 2, 1, 2], [2, 2, 3, 1, 2], [2, 2, 2, 2, 2]],
                        initItems: [{ row: 2, col: 1, type: 'red_robot', dir: null }]
                    },
                    database: {
                        tables: {
                            test_table: {
                                public: true,
                                data: test_table
                            },
                            test_table2: {
                                public: true,
                                data: test_table
                            }
                        }
                    }
                }
            ],
            medium: [
                {
                    robot: {
                        tiles: [[0, 0, 0, 0, 0, 0, 2, 3, 2, 0], [0, 0, 0, 0, 0, 2, 2, 1, 2, 2], [0, 0, 0, 0, 0, 2, 1, 1, 1, 2], [2, 2, 2, 2, 2, 2, 2, 1, 1, 2], [2, 1, 1, 2, 2, 1, 2, 1, 1, 2], [2, 1, 2, 2, 1, 1, 2, 2, 1, 2], [2, 1, 1, 1, 1, 1, 1, 1, 1, 2], [2, 2, 2, 2, 2, 2, 2, 2, 2, 2]],
                        initItems: [{ row: 4, col: 2, type: 'red_robot' }]
                    },
                    database: {
                        tables: {
                            test_table: {
                                public: true,
                                data: test_table
                            }
                        }
                    }
                }
            ]
        };
        initBlocklySubTask(subTask);
        displayHelper.thresholdEasy = 5000;
        displayHelper.thresholdMedium = 10000;
    }

    initWrapper(initTask, ['easy', 'medium'], null, true);
})()