
export default function () {

    return {
        showViews,
        getViews,
        updateToken,
        getHeight,
        unload,
        getState,
        getMetaData,
        reloadAnswer,
        reloadState,
        getAnswer,
        load,
        gradeAnswer,
    };

}

function showViews (_views, success, _error) {
    success();
}

function getViews (success, _error) {
    success({});
}

function updateToken (_token, success, _error) {
    success();
}

function getHeight (success, _error) {
    var d = document;
    var h = Math.max(d.body.offsetHeight, d.documentElement.offsetHeight);
    success(h);
}

function unload (success, _error) {
    success();
}

function getState (success, _error) {
    success('');
}

function getMetaData (success, _error) {
    success({});
}

function reloadAnswer (_answer, success, _error) {
    success();
}

function reloadState (_state, success, _error) {
    success();
}

function getAnswer (success, _error) {
    success('');
}

function load (_views, success, _error) {
    success();
}

function gradeAnswer (_answer, _answerToken, success, _error) {
    success(0, '');
}
