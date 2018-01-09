import {call, put, select, takeEvery} from 'redux-saga/effects';
import {fetchTaskData, gradeAnswer} from './server_module';

import PlatformChannel from './platform_channel';

export default function (bundle, deps) {


    bundle.use('taskInit', 'taskRefresh');



    bundle.defineAction('taskData', 'taskData');
    bundle.addReducer('taskData', function (state, action) {
        const {task} = action;
        return {...state, task};
    });


    bundle.defineAction('taskToken', 'taskToken');
    bundle.addReducer('taskToken', function (state, action) {
        const {task_token} = action;
        return {...state, task_token};
    });


    bundle.defineAction('reloadState', 'reloadState');
    bundle.addReducer('reloadState', function (state, action) {
        const {hints} = action;
        return {...state, hints};
    });


    bundle.defineAction('reloadAnswer', 'reloadAnswer');
    bundle.addReducer('reloadAnswer', function (state, action) {
        const answer = action.answer;
        return {...state, answer};
    });







    bundle.addSaga(function* () {
        /* TODO: select task from global state */
        const channel = yield call(PlatformChannel, window.task);
        yield takeEvery(channel, handlePlatformEventSaga);
    });

    function* handlePlatformEventSaga (event) {
        let callback = event.callback || function (){};
        switch (event.type) {
            case 'load': {
                const task_token = yield select(state => state.task_token);
                const host = yield select(state => state.options.server_module.host);
                const task = yield call(fetchTaskData, host, task_token);
                yield put({type: deps.taskData, task});
                yield put({type: deps.taskInit});
                yield call(callback);
                break;
            }

            case 'getState': {
                const hints = yield select(state => state.hints);
                console.log('getState', JSON.stringify(hints));
                yield call(callback, JSON.stringify(hints));
                break;
            }

            case 'reloadState': {
                console.log('reloadState', event.state);
                try {
                    const hints = JSON.parse(event.state);
                    yield put({type: deps.reloadState, hints});
                    yield put({type: deps.taskRefresh});
                } catch (e) {
                    console.error(e.message, 'reloadState wrong JSON');
                }
                yield call(callback);
                break;
            }

            case 'getAnswer': {
                const answer = yield select(state => state.answer);
                console.log('getAnswer', JSON.stringify(answer));
                yield call(callback, JSON.stringify(answer));
                break;
            }

            case 'reloadAnswer': {
                console.log('reloadAnswer');
                try {
                    const answer = JSON.parse(event.answer);
                    yield put({type: deps.reloadAnswer, answer});
                    yield put({type: deps.taskRefresh});
                } catch (e) {
                    console.error(e.message, 'reloadAnswer wrong JSON');
                }
                yield call(callback);
                break;
            }

            case 'gradeAnswer': {
                const {host, task_token, getTaskParams} = yield select(function (state) {
                    return {
                        host: state.options.server_module.host,
                        task_token: state.task_token,
                        getTaskParams: state.platformAdapter.getTaskParams
                    };
                });
                const task_params = yield call(getTaskParams, null, null);
                const grading = yield call(gradeAnswer, host, task_token, event.answer_token, task_params);
                /* XXX do something and eventually call callback? */
                alert('Score: ' + grading.score);
                break;
            }
        }
    }
}
