import {call, put, take, select, takeEvery} from 'redux-saga/effects'
import {fetchTaskHintData} from './task_interface'


export default function (bundle, deps) {

    bundle.use('taskToken')

    bundle.defineAction('showHintRequest', 'Hint.ShowRequest');
    bundle.defineAction('requestHint', 'Hint.Request');
    bundle.defineAction('hintRequestFulfilled', 'Hint.Request.Fulfilled');
    bundle.defineAction('hintRequestRejected', 'Hint.Request.Rejected');

    bundle.addReducer('showHintRequest', function (state, action) {
        const {request} = action;
        return {...state, hintRequest: request, hintRequestError: undefined};
    });

    bundle.addReducer('hintRequestFulfilled', function (state, action) {
        const { hints } = action
        return state.workspaceOperations.taskUpdated({...state, hints, hintRequest: undefined, hintRequestError: undefined})
    });

    bundle.addReducer('hintRequestRejected', function (state, action) {
        return {...state, hintRequestError: action.error};
    });

    bundle.addSaga(function* () {
        yield takeEvery(deps.requestHint, function* (action) {
            const task_token = yield call(platformAskHint, action.request)
            yield put({type: deps.taskToken, task_token})
            const host = yield select(state => state.options.server_modules.host)
            const hints = yield call(fetchTaskHintData, host, task_token)
            if(hints) {
                yield put({type: deps.hintRequestFulfilled, hints})
            } else {
                yield put({type: deps.hintRequestRejected, error: 'server error'})
            }
        });
    })


    function platformAskHint(hint_params) {
        return new Promise(resolve => {
            window.task.updateToken = (task_token, callback) => {
                callback()
                resolve(task_token)
            }
            window.platform.askHint(hint_params)
        })
    }
}