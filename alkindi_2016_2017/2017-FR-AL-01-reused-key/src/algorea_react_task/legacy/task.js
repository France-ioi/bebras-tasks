
export default class Task {
    constructor (store, scope) {
        this._store = store;
        this._scope = scope;
    }
    showViews (_views, success, _error) {
        success();
    }
    getViews (success, _error) {
        success({});
    }
    updateToken (token, success, _error) {
        this._store.dispatch({type: this._scope.taskTokenChanged, payload: {token}});
        success();
    }
    getHeight (success, _error) {
        var d = document;
        var h = Math.max(d.body.offsetHeight, d.documentElement.offsetHeight);
        success(h);
    }
    unload (success, _error) {
        success();
    }
    getState (success, _error) {
        success('');
    }
    getMetaData (success, _error) {
        success({});
    }
    reloadAnswer (_answer, success, _error) {
        success();
    }
    reloadState (_state, success, _error) {
        success();
    }
    getAnswer (success, _error) {
        success('');
    }
    load (_views, success, _error) {
        success();
    }
    gradeAnswer (_answer, _answerToken, success, _error) {
        success(0, '');
    }
}
