import {call, put, select, takeEvery} from 'redux-saga/effects';

import {fetchTaskHintData} from './server_module';

export default function (bundle, deps) {

    bundle.use('taskRefresh');

    bundle.defineAction('requestHint', 'Hint.Request');
    bundle.defineAction('hintRequestFulfilled', 'Hint.Request.Fulfilled');
    bundle.defineAction('hintRequestRejected', 'Hint.Request.Rejected');

    bundle.addReducer('hintRequestFulfilled', function (state, action) {
        const {hints} = action;
        return {...state, hints};
    });

    bundle.addReducer('hintRequestRejected', function (state, action) {
        return {...state, hintRequestError: action.error};
    });

    bundle.addSaga(function* () {
        yield takeEvery(deps.requestHint, requestHintSaga);
    });

    function* requestHintSaga (action) {
        const {askHint} = yield select(state => state.platformAdapter);
        yield call(askHint, action.request);
        /* Once askHint returns, the updated token can be obtained from the store. */
        const taskToken = yield select(state => state.taskToken);
        const host = yield select(state => state.options.server_module.host);
        const hints = yield call(fetchTaskHintData, host, taskToken);
        if (hints) {
            yield put({type: deps.hintRequestFulfilled, hints});
            yield put({type: deps.taskRefresh});
        } else {
            yield put({type: deps.hintRequestRejected, error: 'server error'});
        }
    }

}