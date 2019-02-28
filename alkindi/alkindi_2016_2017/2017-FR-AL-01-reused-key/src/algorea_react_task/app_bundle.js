import React from 'react';
import {call, takeEvery, select, put} from 'redux-saga/effects';

import TaskBar from './ui/task_bar';
import Spinner from './ui/spinner';

export default function (bundle, deps) {

    bundle.use('Workspace');

    bundle.defineAction('appInit', 'App.Init');
    bundle.addReducer('appInit', function (state, {payload: {platformAdapter, task, taskToken, serverTools, options}}) {
        return {...state, platformAdapter, task, taskToken, serverTools, options};
    });

    bundle.defineAction('appInitFailed', 'App.Init.Failed');
    bundle.addReducer('appInitFailed', function (state, {payload: {message}}) {
        return {...state, fatalError: message};
    });

    bundle.defineAction('platformValidate', 'Platform.Validate');

    bundle.addSaga(function* () {
        yield takeEvery(deps.appInit, appInitSaga);
        yield takeEvery(deps.platformValidate, platformValidateSaga);
    });

    function* appInitSaga ({payload: {platformAdapter, task}}) {
        try {
            yield call(platformAdapter.initWithTask, task);
        } catch (ex) {
            yield put({type: deps.appInitFailed, payload: {message: ex.toString()}});
        }
    }

    function* platformValidateSaga ({payload: {mode}}) {
        const {validate} = yield select(state => state.platformAdapter);
        /* TODO: error handling, wrap in try/catch block */
        yield call(validate, mode);
    }

    function AppSelector (state) {
        const {task, workspace, fatalError} = state;
        const {Workspace, platformValidate} = deps;
        return {task, workspace, Workspace, platformValidate, fatalError};
    }
    bundle.defineView('App', AppSelector, App);

}

class App extends React.PureComponent {
    render () {
        const {task, workspace, Workspace, fatalError} = this.props;
        if (fatalError) {
            return (
                <div>
                    <h1>{"A fatal error has occurred"}</h1>
                    <p>{fatalError}</p>
                </div>
            );
        }
        if (!task || !workspace) {
            return (<Spinner/>);
        }
        return (
            <div>
                <Workspace/>
                <TaskBar onValidate={this._validate}/>
            </div>
        );
    }
    _validate = () => {
        this.props.dispatch({type: this.props.platformValidate, payload: {mode: 'done'}});
    };
}
