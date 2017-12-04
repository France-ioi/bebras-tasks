//import './shim'
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import link from 'epic-linker';
import queryString from 'query-string'
import './ui/styles.css'

//import Peer from 'peer'
import AppBundle from './app_bundle'
import TaskDataBundle from './task_data_bundle'
import HintsBundle from './hints_bundle';
import AnswerBundle from './answer_bundle';

export default function(container, options, TaskBundle) {
    const task = linkTask(TaskBundle)
    const query = queryString.parse(location.search)
    startTask(task, query.sToken, options)
    container && mountTask(task, container)
}


function linkTask(TaskBundle) {
    return link(function (bundle) {
        bundle.include(AppBundle)
        bundle.include(TaskDataBundle)
        bundle.include(HintsBundle)
        bundle.include(TaskBundle)
        bundle.include(AnswerBundle)
    })
}


function startTask(task, task_token, options) {
    const {store, scope, start} = task
    options = options || {}
    store.dispatch({type: scope.taskInit, task_token, options})
    start()
}


function mountTask(task, container) {
    const {store, scope} = task
    const App = scope.App
    ReactDOM.render(<Provider store={store}><App/></Provider>, container)
}