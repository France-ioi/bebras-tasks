module.exports = {

        config: {
            cache_task_data: true,
        },

        taskData: (args, callback) => {
            callback(false, {
                task_id: args.task.id,
                random_seed: args.task.random_seed
            })
        },

        taskHintData: (args, task_data, callback) => {
            callback(false, {
                task_data,
                hints_requested: args.task.hints_requested
            })
        },

        gradeAnswer: (args, task_data, callback) => {
            callback(false, {
                task_data,
                score: args.answer.value,
                message: 'Your answer was ' + args.answer.value
            })
        }
    }