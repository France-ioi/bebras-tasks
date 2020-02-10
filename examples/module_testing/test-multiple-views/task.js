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
                        pin_file: 'database/pin.png',
                        pin_file_mistake: 'database/pin2.png',
                        map_file: 'database/carteDeFrance.png',
                        map_lng_left: -4.85,
                        map_lng_right: 9.65,
                        map_lat_top: 51.6,
                        map_lat_bottom: 41.7,
                        //disable_csv_import: true,
                        //calculate_hash: true,
                        //strict_types: true
                    }
                },
                turtle: {
                    overlayFileName: "turtle/grid5.png"
                }
            },

            conceptViewer: true,
            maxInstructions: { easy: 50, medium: 50 },
            includeBlocks: {
                groupByCategory: true,
                generatedBlocks: {
                    robot: {
                        shared: ['north', 'south', 'east', 'west'],
                    },
                    database: {
                        shared: ['loadTable', 'displayTable' ]
                    },
                    p5: {
                        shared: ['playSignal', 'playRecord', 'playStop', 'sleep', 'echo']
                    },
                    turtle: {
                        shared: ['moveamountvalue', 'turnleftamountvalue', 'turnrightamountvalue', 'colourvalue']
                    }
                },
                standardBlocks: {
                    includeAll: false,
                    wholeCategories: [],
                    singleBlocks: {
                        shared: ['controls_repeat'],
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
                [ 1, 'database/apple.jpg', 'apple', '2018-01-01' ],
                [ 2, 'database/banana.jpg', 'banana', '2019-01-01' ],
                [ 3, 'database/kiwi.jpg', 'kiwi', '2020-01-01' ],
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
                    },
                    turtle: {
                        drawSolution : function(turtle) {
                            turtle.move(100);
                        },
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
                    },
                    turtle: {
                        drawSolution : function(turtle) {
                            turtle.move(100);
                        },
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
                    },
                    turtle: {
                        drawSolution : function(turtle) {
                            turtle.move(100);
                        },
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