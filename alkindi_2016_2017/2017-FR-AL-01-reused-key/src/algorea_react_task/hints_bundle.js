import {call, put, take, select, takeEvery} from 'redux-saga/effects';
import {fetchTaskHintData} from './server_module';


export default function (bundle, deps) {

    bundle.use('taskToken', 'taskRefresh');

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
        yield takeEvery(deps.requestHint, function* (action) {
            const task_token = yield call(platformAskHint, action.request);
            yield put({type: deps.taskToken, task_token});
            const host = yield select(state => state.options.server_module.host);
            const hints = yield call(fetchTaskHintData, host, task_token);
            if(hints) {
                yield put({type: deps.hintRequestFulfilled, hints});
                yield put({type: deps.taskRefresh});
            } else {
                yield put({type: deps.hintRequestRejected, error: 'server error'});
            }
        });
    });


    function platformAskHint(hint_params) {
        return new Promise(resolve => {
            var tmp = window.task.updateToken;
            window.task.updateToken = function(task_token, callback) {
                callback();
                window.task.updateToken = tmp;
                resolve(task_token);
            };
            window.platform.askHint(hint_params);
        });
    }
}