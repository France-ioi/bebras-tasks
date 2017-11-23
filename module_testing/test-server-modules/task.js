'use strict';

function initTask() {

    BebrasTaskWrapper(task, {
        host: 'http://localhost:3000',
        platform_id: 1
    })


    task.onLoad = function(views, callback) {
        $('#ask_hint_a').click(function() {
            task.askHint({ hint_demo_data: 'a'})
        })

        $('#ask_hint_b').click(function() {
            task.askHint({ hint_demo_data: 'b'})
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