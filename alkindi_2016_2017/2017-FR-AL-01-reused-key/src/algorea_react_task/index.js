//import './shim'
import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import link from 'epic-linker';
import queryString from 'query-string';
import './ui/styles.css';

import './legacy/task';
import AppBundle from './app_bundle';
import PlatformBundle from './platform_bundle';
import HintsBundle from './hints_bundle';

export default function(container, options, TaskBundle) {
    const bundles = linkBundles(TaskBundle);
    const query = queryString.parse(location.search);
    startBundles(bundles, query.sToken, options);
    container && mountBundles(bundles, container);
}


function linkBundles(TaskBundle) {
    return link(function (bundle) {
        bundle.include(AppBundle);
        bundle.include(PlatformBundle);
        bundle.include(HintsBundle);
        bundle.include(TaskBundle);
    });
}


function startBundles(bundles, task_token, options) {
    const {store, scope, start} = bundles;
    options = options || {};
    store.dispatch({type: scope.appInit, task_token, options});
    start();
}


function mountBundles(bundles, container) {
    const {store, scope} = bundles;
    const App = scope.App;
    ReactDOM.render(<Provider store={store}><App/></Provider>, container);
}