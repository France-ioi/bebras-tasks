//import './shim'
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import link from 'epic-linker';
import queryString from 'query-string';

import './ui/styles.css';

import makeTask from './legacy/task';
import AppBundle from './app_bundle';
import PlatformBundle from './platform_bundle';
import HintsBundle from './hints_bundle';

export default function (container, options, TaskBundle) {
    const app = linkApp(TaskBundle);
    const query = queryString.parse(location.search);
    startApp(app, query.sToken, options);
    container && mountApp(app, container);
}


function linkApp (TaskBundle) {
    return link(function (bundle) {
        bundle.include(AppBundle);
        bundle.include(PlatformBundle);
        bundle.include(HintsBundle);
        bundle.include(TaskBundle);
    });
}


function startApp (app, task_token, options) {
    const {store, scope, start} = app;
    options = options || {};
    const task = makeTask();
    /* let initWithTask set window.task */
    window.platform.initWithTask(task);
    store.dispatch({type: scope.appInit, task_token, options});
    start();
}


function mountApp (app, container) {
    const {store, scope} = app;
    const App = scope.App;
    ReactDOM.render(<Provider store={store}><App/></Provider>, container);
}