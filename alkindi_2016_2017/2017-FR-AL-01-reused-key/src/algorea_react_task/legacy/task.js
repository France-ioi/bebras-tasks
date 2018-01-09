
export default class Task {
    constructor (store, scope) {
        this._store = store;
        this._scope = scope;
    }
    showViews (views, success, error) {
        this._store.dispatch({type: this._scope.taskShowViewsEvent, payload: {views, success, error}});
    }
    getViews (success, error) {
        this._store.dispatch({type: this._scope.taskGetViewsEvent, payload: {success, error}});
    }
    updateToken (token, success, error) {
        this._store.dispatch({type: this._scope.taskUpdateTokenEvent, payload: {token, success, error}});
    }
    getHeight (success, error) {
        this._store.dispatch({type: this._scope.taskGetHeightEvent, payload: {success, error}});
    }
    unload (success, error) {
        this._store.dispatch({type: this._scope.taskUnloadEvent, payload: {success, error}});
    }
    getState (success, error) {
        this._store.dispatch({type: this._scope.taskGetStateEvent, payload: {success, error}});
    }
    getMetaData (success, error) {
        this._store.dispatch({type: this._scope.taskGetMetaDataEvent, payload: {success, error}});
    }
    reloadAnswer (answer, success, error) {
        this._store.dispatch({type: this._scope.taskReloadAnswerEvent, payload: {answer, success, error}});
    }
    reloadState (state, success, error) {
        this._store.dispatch({type: this._scope.taskReloadStateEvent, payload: {state, success, error}});
    }
    getAnswer (success, error) {
        this._store.dispatch({type: this._scope.taskGetAnswerEvent, payload: {success, error}});
    }
    load (views, success, error) {
        this._store.dispatch({type: this._scope.taskLoadEvent, payload: {views, success, error}});
    }
    gradeAnswer (answer, answerToken, success, error) {
        this._store.dispatch({type: this._scope.taskGradeAnswerEvent, payload: {answer, answerToken, success, error}});
    }
}
