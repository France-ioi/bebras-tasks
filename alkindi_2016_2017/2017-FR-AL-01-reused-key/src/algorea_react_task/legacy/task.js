export default function () {

    return {

        showViews: function (_views, success, _error) {
            success();
        },

        getViews: function (success, _error) {
            success({});
        },

        updateToken: function (_token, success, _error) {
            success();
        },

        getHeight: function (success, _error) {
            var d = document;
            var h = Math.max(d.body.offsetHeight, d.documentElement.offsetHeight);
            success(h);
        },

        unload: function (success, _error) {
            success();
        },

        getState: function (success, _error) {
            success('');
        },

        getMetaData: function (success, _error) {
            success({});
        },

        reloadAnswer: function (_answer, success, _error) {
            success();
        },

        reloadState: function (_state, success, _error) {
            success();
        },

        getAnswer: function (success, _error) {
            success('');
        },

        load: function (_views, success, _error) {
            success();
        },

        gradeAnswer: function (_answer, _answerToken, success, _error) {
            success(0, '');
        }

    };

}