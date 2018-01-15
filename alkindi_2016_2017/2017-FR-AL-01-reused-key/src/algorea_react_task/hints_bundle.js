import {call, put, select, takeEvery} from 'redux-saga/effects';

export default function (bundle, deps) {

    bundle.use('taskRefresh');

    bundle.defineAction('requestHint', 'Hint.Request');
    bundle.defineAction('hintRequestFulfilled', 'Hint.Request.Fulfilled');
    bundle.defineAction('hintRequestRejected', 'Hint.Request.Rejected');

    bundle.addReducer('hintRequestFulfilled', function (state, {payload: {hints}}) {
        return {...state, hints};
    });

    bundle.addReducer('hintRequestRejected', function (state, {payload: {error}}) {
        return {...state, hintRequestError: error};
    });

    bundle.addSaga(function* () {
        yield takeEvery(deps.requestHint, requestHintSaga);
    });

    function* requestHintSaga (action) {
        const {askHint} = yield select(state => state.platformAdapter);
        yield call(askHint, action.request);
        /* Once askHint returns, the updated token can be obtained from the store. */
        const {taskToken, serverTools} = yield select(state => state);
        const hints = yield call(serverTools, 'tasks', 'taskHintData', {task: taskToken});
        if (hints) {
            yield put({type: deps.hintRequestFulfilled, payload: {hints}});
            yield put({type: deps.taskRefresh});
        } else {
            yield put({type: deps.hintRequestRejected, payload: {error: 'server error'}});
        }
    }

}