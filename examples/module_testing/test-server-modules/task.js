'use strict';

function initTask() {

    BebrasTaskWrapper(task, {
        host: 'http://localhost:3101',
        fetch_task_data: true
    })


    task.onLoad = function(views, callback) {
        $('#ask_hint_a').click(function() {
            task.askHint('a')
        })

        $('#ask_hint_b').click(function() {
            task.askHint('b')
        })

        $('#validate').click(function() {
            platform.validate('done', function(){
                alert('done')
            });
        })
        callback()
    }


    task.onTaskData = function(data) {
        $('#loading').hide()
        $('#task_ready').show()
        $('#task_data').html(JSON.stringify(data))
    }


    task.onTaskHintData = function(data) {
        $('#hint_data').html(JSON.stringify(data))
    }


    task.getAnswer = function(callback) {
        var a = parseInt($('#task_answer').val(), 10)
        callback(a)
    }


 }
 initTask()