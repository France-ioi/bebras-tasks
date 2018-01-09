import {call, put, take, select, takeLatest} from 'redux-saga/effects';
import {fetchTaskData, gradeAnswer} from './server_module';

import PlatformChannel from './platform_channel';

export default function (bundle, deps) {


    bundle.use('taskInit', 'taskRefresh');



    bundle.defineAction('taskData', 'taskData');
    bundle.addReducer('taskData', function (state, action) {
        let {task} = action;
        return {...state, task};
    });


    bundle.defineAction('taskToken', 'taskToken');
    bundle.addReducer('taskToken', function (state, action) {
        let {task_token} = action;
        return {...state, task_token};
    });


    bundle.defineAction('reloadState', 'reloadState');
    bundle.addReducer('reloadState', function(state, action) {
        const {hints} = action;
        return {...state, hints};
    });


    bundle.defineAction('reloadAnswer', 'reloadAnswer');
    bundle.addReducer('reloadAnswer', function(state, action) {
        const answer = action.answer;
        return {...state, answer};
    });







    bundle.addSaga(function* () {
        const channel = yield call(PlatformChannel, window.task);
        while(true) {
            let action = yield take(channel);
            let callback = action.callback || function(){};
            switch(action.type) {
                case 'load':
                    var task_token = yield select(state => state.task_token);
                    var host = yield select(state => state.options.server_module.host);
                    var task = yield call(fetchTaskData, host, task_token);
                    yield put({type: deps.taskData, task});
                    yield put({type: deps.taskInit});
                    callback();
                    break;

                case 'getState':
                    var hints = yield select(state => state.hints);
                    console.log('getState', JSON.stringify(hints));
                    callback(JSON.stringify(hints));
                    break;

                case 'reloadState':
                    console.log('reloadState', action.state);
                    try {
                        var hints = JSON.parse(action.state);
                        yield put({type: deps.reloadState, hints});
                        yield put({type: deps.taskRefresh});
                    } catch(e) {
                        console.error(e.message, 'reloadState wrong JSON');
                    }
                    callback();
                    break;

                case 'getAnswer':
                    var answer = yield select(state => state.answer);
                    console.log('getAnswer', JSON.stringify(answer));
                    callback(JSON.stringify(answer));
                    break;

                case 'reloadAnswer':
                    console.log('reloadAnswer');
                    try {
                        var answer = JSON.parse(action.answer);
                        yield put({type: deps.reloadAnswer, answer});
                        yield put({type: deps.taskRefresh});
                    } catch(e) {
                        console.error(e.message, 'reloadAnswer wrong JSON');
                    }
                    callback();
                    break;

                case 'gradeAnswer':
                    var host = yield select(state => state.options.server_module.host);
                    var task_token = yield select(state => state.task_token);
                    var task_params = yield call(getTaskParams);
                    var grading = yield call(gradeAnswer, host, task_token, action.answer_token, task_params);
                    alert('Score: ' + grading.score);
                    break;
            }
        }

    });
}


function getTaskParams() {
    return new Promise(resolve => {
        platform.getTaskParams(null, null, resolve);
    });
}