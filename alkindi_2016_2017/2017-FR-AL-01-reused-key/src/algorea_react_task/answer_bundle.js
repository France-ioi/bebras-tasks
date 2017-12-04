import {call, put, take, select, takeLatest} from 'redux-saga/effects'
import {gradeAnswer} from './task_interface'

import platformChannel from './platform_channel'

export default function (bundle, deps) {


    bundle.defineAction('validateAnswer', 'Answer.Validate');


    bundle.addSaga(function* () {
        const channel = yield call(platformChannel)
        while(true) {
            const action = yield take(channel)
            if(action.type == 'getAnswer') {
                const answer = yield select(state => state.workspace.key)
                action.callback && action.callback(JSON.stringify(answer))
            } else if(action.type == 'gradeAnswer') {
                const host = yield select(state => state.options.server_modules.host)
                const task_token = yield select(state => state.task_token)
                const task_params = yield call(getTaskParams)
                const grading = yield call(gradeAnswer, host, task_token, action.answer_token, task_params)
                alert('Score: ' + grading.score)
            }
        }
    })
}


function getTaskParams() {
    return new Promise(resolve => {
        platform.getTaskParams(null, null, resolve)
    })
}