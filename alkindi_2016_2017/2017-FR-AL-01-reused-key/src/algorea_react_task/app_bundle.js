import React from 'react'
import EpicComponent from 'epic-component'
import {call, put, take, select, takeLatest} from 'redux-saga/effects'
import TaskBar from './ui/task_bar'
import Spinner from './ui/spinner'

export default function (bundle, deps) {

    bundle.use('Workspace')

    bundle.defineAction('appInit', 'appInit')
    bundle.addReducer('appInit', function (state, action) {
        const { task_token, options } = action
        return {...state, task_token, options}
    })


    function onValidate() {
        platform.validate('done', function(){
            alert('done')
        });
    }


    function AppSelector (state) {
        const { task, workspace } = state
        return { task, workspace }
    }


    bundle.defineView('App', AppSelector, EpicComponent(self => {
        self.render = () => {
            if(!self.props.task || !self.props.workspace) {
                return (<Spinner/>)
            }
            return (
                <div>
                    {React.createElement(deps.Workspace)}
                    <TaskBar onValidate={onValidate}/>
                </div>
            )
        }
    }))

}


