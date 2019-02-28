//import './shim'
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import link from 'epic-linker';
import queryString from 'query-string';
import ServerTools from 'bebras-server-modules-libs';

import './ui/styles.css';

import Task from './legacy/task';
import makePlatformAdapter from './legacy/platform_adapter';
import AppBundle from './app_bundle';
import PlatformBundle from './platform_bundle';
import HintsBundle from './hints_bundle';

export default function (container, options, TaskBundle) {
    const app = linkApp(TaskBundle);
    const query = queryString.parse(location.search);
    startApp(app, query.sToken, options);
    container && mountApp(app, container);
    return app;
}


function linkApp (TaskBundle) {
    return link(function (bundle) {
        bundle.include(AppBundle);
        bundle.include(PlatformBundle);
        bundle.include(HintsBundle);
        bundle.include(TaskBundle);
    });
}


function startApp (app, taskToken, options) {
    const {store, scope, start} = app;
    options = options || {};
    if (process.env.NODE_ENV === 'development') window.platform.debug = true;
    const platformAdapter = makePlatformAdapter(window.platform);
    const task = new Task(store, scope);
    const serverTools = promisifiedServerTools(options.server_module);
    start();
    store.dispatch({type: scope.appInit, payload: {platformAdapter, task, taskToken, serverTools, options}});
}


function mountApp (app, container) {
    const {store, scope} = app;
    const App = scope.App;
    ReactDOM.render(<Provider store={store}><App/></Provider>, container);
}

function promisifiedServerTools (config) {
    const tools = ServerTools.connect(options.server_module);
    const serviceMap = {
        tasks: 'taskInterface',
        assetsPublisher: 'assets',
        dataStore: 'data'
    };
    return function (service, action, params) {
        return new Promise(function (resolve, reject) {
            tools[serviceMap[service]]({})[action]({...params, success: resolve, error: reject});
        });
    };
}
