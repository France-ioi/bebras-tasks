import {call, put, take, select, takeEvery} from 'redux-saga/effects'
import {fetchTaskHintData} from './task_interface'


export default function (bundle, deps) {


    bundle.defineAction('validateAnswer', 'Answer.Validate');


    bundle.addSaga(function* () {
        yield takeEvery(deps.validateAnswer, function* (action) {
            const token = yield select(state => state.task_token)
            const host = yield select(state => state.options.server_modules.host)
            const hints = yield call(fetchTaskHintData, host, token)
            if(hints) {
                yield put({type: deps.hintRequestFulfilled, hints})
            } else {
                yield put({type: deps.hintRequestRejected, error: 'server error'})
            }
        });
    });

}



