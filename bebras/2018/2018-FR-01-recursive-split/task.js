function initTask(subTask) {
    var state = {};
    var level;
    var answer = null;
    var data = {
        easy: {
            grid: [
                [1, 2, 2, 1],
                [2, 0, 0, 2],
                [1, 2, 2, 1],
                [2, 0, 0, 2]
            ],
            transformation: [
                [
                    [2,1],
                    [2,1]
                ],
                [
                    [0,0],
                    [0,0]
                ],
                [
                    [0,0],
                    [0,0]
                ]
            ],
            transformationCounter: 3
        },
        medium: {
            grid: [
                [1, 2, 2, 1],
                [2, 1, 1, 2],
                [2, 1, 1, 2],
                [1, 2, 2, 1]
            ],
            transformation: [
                [
                    [1,1],
                    [1,1]
                ],
                [
                    [1,1],
                    [1,1]
                ],
                [
                    [1,1],
                    [1,1]
                ]
            ],
            transformationCounter: 3
        },
        hard: {
            grid: [
                [2,0,2,2,2,0,2,2],
                [0,1,1,0,0,1,1,0],
                [2,2,2,1,2,2,2,1],
                [1,0,0,0,1,0,0,0],
                [2,0,2,1,2,0,2,0],
                [0,1,0,0,0,1,0,1],
                [2,2,2,2,2,1,2,2],
                [1,0,1,0,0,0,1,0]
            ],
            transformation: [
                [
                    [0,0],
                    [0,0]
                ],
                [
                    [0,0],
                    [0,0]
                ],
                [
                    [0,0],
                    [0,0]
                ]
            ],
            transformationCounter: 3
        }
    };

    subTask.loadLevel = function(curLevel) {
        level = curLevel;
    };

    subTask.getStateObject = function() {
        return state;
    };

    subTask.reloadAnswerObject = function(answerObj) {
        answer = answerObj;
        if(!answer) {
            return;
        }
    };

    subTask.resetDisplay = function() {
        $("#objective").empty();
        $('.option-1').empty();
        $('.option-2').empty();
        $('.option-3').empty();
        data[level].transformation = (answer.length > 0) ? answer : data[level].transformation;
        $("#objective").append(createTable(data[level].grid, level));
        if (level == 'hard') {
            $("#objective").addClass('hard_table');
        }else{
        	$("#objective").removeClass('hard_table');
        }
        initTransformation(level);
        initHandlers();
        if (typeof(enableRtl) != "undefined") {
           $("body").attr("dir", "rtl");
           $(".largeScreen #zone_1").css("float", "right");
           $(".largeScreen #zone_2").css("float", "right");
        }
    };

    subTask.getAnswerObject = function() {
        return answer;
    };

    subTask.getDefaultAnswerObject = function() {
        return [];
    };

    subTask.unloadLevel = function(callback) {
        $("#objective").empty();
        $('.option-1').empty();
        $('.option-2').empty();
        $('.option-3').empty();
        callback();
    };

    var initHandlers = function() {
        $('.after1-situation').empty();
        $('.after2-situation').empty();
        $("#start").unbind("click");
        start()
        $("#start").click(start);
     };

    var start = function() {
        $('.after1-situation').empty();
        $('.after2-situation').empty();
        $('.after3-situation').empty();
        var after1Arr = data[level].transformation[0];
        var after2Arr = transformArr(after1Arr, data[level].transformation);
        $('.after1-situation').append(createTable(after1Arr, level));
        $('.after2-situation').append(createTable(after2Arr, level));
        answer = data[level].transformation;
        if (level == "hard") {
            var after3Arr = transformArr(after2Arr, data[level].transformation);
            $('.after3-situation').append(createTable(after3Arr, level));
            for(var iRowCol = 0; iRowCol < 2; iRowCol++){
                var rowCol = iRowCol*4+1;
                $('#objective td[data-row='+rowCol+'], .after3-situation td[data-row='+rowCol+']').css("border-bottom","3px solid black");
                $('#objective td[data-column='+rowCol+'], .after3-situation td[data-column='+rowCol+']').css("border-right","3px solid black");
            }
            $('#objective td[data-row=3], .after3-situation td[data-row=3]').css("border-bottom","5px solid black");
            $('#objective td[data-column=3], .after3-situation td[data-column=3]').css("border-right","5px solid black");
        } else if (level == "easy" || level == "medium"){
            $('.after2-situation td[data-row=1], #objective td[data-row=1], .after1-situation td[data-row=0]').css("border-bottom","3px solid black");
            $('.after2-situation td[data-column=1], #objective td[data-column=1], .after1-situation td[data-column=0]').css("border-right","3px solid black");
        }
    }

    var transformArr = function(arr, transformation) {
        var result = []
        for (var row=0; row<arr.length; row++) {
            var arrRow = [];
            for (var col=0; col<arr[0].length; col++) {
                arrRow = arrRow.concat(transformation[arr[row][col]][0]);
            }
            result.push(arrRow);
            arrRow = [];
            for (var col=0; col<arr[0].length; col++) {
                arrRow = arrRow.concat(transformation[arr[row][col]][1]);
            }
            result.push(arrRow);
        }
        return result;
    }

    var createTable = function(data, level, transform_id) {
        var grid = "<table data-transform='"+transform_id+"'>";
        for (var row = 0; row < data.length; row++) {
            grid = grid.concat("<tr>");
            for (var col = 0; col < data[0].length; col++) {
                grid = grid.concat("<td class='background-" + data[row][col] + "' data-row='"+row+"' data-column='"+col+"' ></td>");
            }
            grid = grid.concat("</tr>");
        }
        grid = grid.concat("</table>");
        return $(grid);
    };

    var initTransformation = function (level) {
        for (var i = 0; i<3; i++) {
            var transform = createTable(data[level].transformation[i], level, i);
            $('.option-' + (i+1)).append(transform);
        }
        $(".after td").click(function() {
            var transform_id = $(this).parent().parent().parent().attr("data-transform");
            var t_row = $(this).attr("data-row");
            var t_col = $(this).attr("data-column");
            if (t_row != undefined && t_col != undefined) {
                if (level == "easy" && transform_id == 0) {
                   // edits are disabled in first transform of easy
                } else if (level == "medium") {
                   // only two colors are used in medium
                   data[level].transformation[transform_id][t_row][t_col] = 3 - data[level].transformation[transform_id][t_row][t_col];
                } else {
                   // rotate between three colors
                   data[level].transformation[transform_id][t_row][t_col] = (data[level].transformation[transform_id][t_row][t_col] + 1) % data[level].transformationCounter;
                }

                $(this).removeClass();
                $(this).addClass("background-" + data[level].transformation[transform_id][t_row][t_col]);
                start();
            }
        });
    }

    var compareAnswer = function () {
        var after1Arr = answer[0];
        var after2Arr = transformArr(after1Arr, answer);
        if (level == 'hard') {
            after2Arr = transformArr(after2Arr, answer);
        }
        var nPixels = 0;
        var correctPixels = 0;
        for(var iRow = 0; iRow < after2Arr.length; iRow++){
            for(var iCol = 0; iCol < after2Arr[iRow].length; iCol++){
                nPixels++;
                if(after2Arr[iRow][iCol] == data[level].grid[iRow][iCol]){
                    correctPixels++;
                }
            }
        }
        return correctPixels/nPixels;
    }

    var getResultAndMessage = function() {
        if (answer.length > 0){
            var res = compareAnswer();
            if(res == 1){
                return {
                    successRate: 1,
                    message: taskStrings.success
                };
            }else if(level == "hard" && res >= 0.75){
                return {
                    successRate: 0.5,
                    message: taskStrings.almost
                };
            }
        }
        return {
            successRate: 0,
            message: taskStrings.error
        };
    };

    subTask.getGrade = function(callback) {
        callback(getResultAndMessage());
    };
}
initWrapper(initTask, ["easy", "medium", "hard"]);
displayHelper.useFullWidth();
