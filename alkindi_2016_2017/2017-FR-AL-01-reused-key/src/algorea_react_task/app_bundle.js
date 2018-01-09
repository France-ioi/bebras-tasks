import React from 'react';
import {call, put, take, select, takeLatest} from 'redux-saga/effects';

import TaskBar from './ui/task_bar';
import Spinner from './ui/spinner';

export default function (bundle, deps) {

    bundle.use('Workspace');

    bundle.defineAction('appInit', 'appInit');
    bundle.addReducer('appInit', function (state, action) {
        const {task_token, options} = action;
        return {...state, task_token, options};
    });


    function onValidate () {
        platform.validate('done', function (){
            alert('done');
        });
    }


    function AppSelector (state) {
        const {task, workspace} = state;
        const {Workspace} = deps;
        return {task, workspace, Workspace, onValidate};
    }


    bundle.defineView('App', AppSelector, App);

}

class App extends React.PureComponent {
    render () {
        const {task, workspace, Workspace, onValidate} = this.props;
        if (!task || !workspace) {
            return (<Spinner/>);
        }
        return (
            <div>
                <Workspace/>
                <TaskBar onValidate={onValidate}/>
            </div>
        );
    }
}
