import tools from 'bebras-server-modules-libs'

var task_interface = null

function getTaskInterface(host) {
    if(!task_interface) {
        task_interface = tools.connect({host}).taskInterface()
    }
    return task_interface
}


export function fetchTaskData(host, task_token) {
    return new Promise(resolve => {
        getTaskInterface(host).taskData({
            task: task_token,
            success: resolve,
            error: (error) => {
                console.error(error)
            }
        })
    })
}


export function fetchTaskHintData(host, task_token) {
    return new Promise(resolve => {
        getTaskInterface(host).taskHintData({
            task: task_token,
            success: resolve,
            error: (error) => {
                console.error(error)
            }
        })
    })
}


export function gradeAnswer(host, token, answer_token, task_params) {
    return new Promise(resolve => {
        getTaskInterface(host).gradeAnswer({
            task: token,
            answer: answer_token,
            min_score: task_params.minScore,
            max_score: task_params.maxScore,
            no_score: task_params.noScore,
            success: resolve,
            error: (error) => {
                console.error(error)
            }
        })
    })
}