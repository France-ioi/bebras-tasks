import React from 'react';
import {call, takeEvery} from 'redux-saga/effects';

import TaskBar from './ui/task_bar';
import Spinner from './ui/spinner';

export default function (bundle, deps) {

    bundle.use('Workspace');

    bundle.defineAction('appInit', 'appInit');
    bundle.addReducer('appInit', function (state, action) {
        const {task_token, options} = action;
        return {...state, task_token, options};
    });


    bundle.defineAction('platformValidate', 'Platform.Validate');
    bundle.addSaga(function* () {
        yield takeEvery(deps.platformValidate, platformValidateSaga);
    });
    function* platformValidateSaga ({payload: {mode}}) {
        yield call(platformValidate, mode);
    }


    function AppSelector (state) {
        const {task, workspace} = state;
        const {Workspace, platformValidate} = deps;
        return {task, workspace, Workspace, platformValidate};
    }


    bundle.defineView('App', AppSelector, App);

}

class App extends React.PureComponent {
    render () {
        const {task, workspace, Workspace} = this.props;
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

function platformValidate (mode) {
    return new Promise((resolve, reject) => {
        window.platform.validate(mode, resolve, reject);
    });
}
