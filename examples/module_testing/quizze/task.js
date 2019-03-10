task.load = function(views, taskLoadCallback) {
    platform.getTaskParams(null, null, function(taskParams) {
        var q = Quizze({
            parent: $('#task'),
            shuffle_questions: 0, //true,
            shuffle_answers: 0, //true,
            random: Math.floor(Math.random() * 100) //parseInt(taskParams.randomSeed, 10) || 0
        });


        // test
        /*
        q.setAnswer([
            1,
            [0,2],
            'test'
        ]);
        */


        task.getAnswer = function(callback) {
            callback(q.getAnswer());
        };

        task.reloadAnswer = function(answer, callback) {
            q.setAnswer(answer);
            callback();
        };

        task.hackShowViews = function(views) {
            q.toggleSolutions(!!views.solution);
        }

        var height = null;
        setInterval(function() {
            task.getHeight(function(h) {
                if(h !== height) {
                    height = h;
                    platform.updateDisplay({
                        height: height
                    }, function() {});
                }
            });
        }, 1000);



        // grade
        function gradeByData(url, answer, callback) {
            if(window.QuizzeGrader.data) {
                callback(window.QuizzeGrader.grade(window.QuizzeGrader.data, answer));
                return;
            }
            $.getScript(url)
                .done(function(script, textStatus ) {
                    if(window.QuizzeGrader.data)  {
                        callback(window.QuizzeGrader.grade(window.QuizzeGrader.data, answer));
                    } else {
                        console.error('QuizzeGrader data not found in ' + url);
                    }
                }).fail(function( jqxhr, settings, exception ) {
                    console.error('Can\'t load grader data: ' + url);
                });
        }


        function gradeByUrl(url, answer, callback) {
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(answer),
                crossDomain: true
            }).done(function(data) {
                callback(data);
            }).fail(function(jqxhr, settings, exception ) {
                console.error('Grader url not responding: ' + url);
            });
        }



        task.gradeAnswer= function(answer, answer_token, callback) {
            function onGrade(result) {
                var d = taskParams.maxScore - taskParams.minScore;
                var final_score = taskParams.minScore + Math.round(d * result.score);
                q.showMistakes(result.mistakes);
                callback(final_score, 'Your score is ' + final_score, null);
            }
            if(json.graderData) {
                gradeByData(json.graderData, answer, onGrade);
            } else if(json.graderUrl) {
                gradeByUrl(json.graderUrl, answer, onGrade);
            }
        };



        taskLoadCallback();
    });
 };