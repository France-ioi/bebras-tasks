task.load = function(views, taskLoadCallback) {
    platform.getTaskParams(null, null, function(taskParams) {
        console.log(taskParams)
        var q = Quizze({
            parent: $('#task'),
            shuffle_questions: 0, //true,
            shuffle_answers: 0, //true,
            random: Math.floor(Math.random() * 100) //parseInt(taskParams.randomSeed, 10) || 0
        });


        // test
        /*
        q.setAnswer([
            2,
            [1,2],
            'test'
        ])
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
        function gradeByScript(url, answer, callback) {
            if(window.QuizzeGrader) {
                callback(window.QuizzeGrader.grade(answer));
                return;
            }
            $.getScript(url)
                .done(function(script, textStatus ) {
                    if(window.QuizzeGrader)  {
                        callback(window.QuizzeGrader.grade(answer));
                    } else {
                        console.error('QuizzeGrader not found in ' + url);
                    }
                }).fail(function( jqxhr, settings, exception ) {
                    console.error('Can\'t load grader script: ' + url);
                });
        }


        function gradeByUrl(url, answer, callback) {
            $.ajax({
                type: 'POST',
                url: url,
                data: JSON.stringify(answer),
                crossDomain: true
            }).done(function(data) {
                callback(data.score);
            }).fail(function(jqxhr, settings, exception ) {
                console.error('Grader url not responding: ' + url);
            });
        }



        task.gradeAnswer= function(answer, answer_token, callback) {
            function onGrade(score) {
                var d = taskParams.maxScore - taskParams.minScore;
                var final_score = taskParams.minScore + Math.round(d * score);
                callback(final_score, 'Your score is ' + final_score, null);
            }
            if(json.graderScript) {
                gradeByScript(json.graderScript, answer, onGrade);
            } else if(json.graderUrl) {
                gradeByUrl(json.graderUrl, answer, onGrade);
            }
        };



        taskLoadCallback();
    });
 };