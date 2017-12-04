import {call, put, take, select, takeLatest} from 'redux-saga/effects'
import {fetchTaskData} from './task_interface'

export default function (bundle, deps) {

    bundle.use('hintRequestFulfilled')

    bundle.defineAction('init', 'Init')

    // task data
    bundle.defineAction('taskData', 'Task.Data')
    bundle.defineAction('taskToken', 'Task.token')

    bundle.addSaga(function* () {
        const task_token = yield select(state => state.task_token)
        const host = yield select(state => state.options.server_modules.host)
        const task = yield call(fetchTaskData, host, task_token)
        yield put({type: deps.taskData, task})
        yield put({type: deps.init})
    })

    bundle.addReducer('taskData', function (state, action) {
        let { task } = action
        return {...state, task}
    })


    bundle.addReducer('taskToken', function (state, action) {
        let { task_token } = action
        return {...state, task_token}
    })

}