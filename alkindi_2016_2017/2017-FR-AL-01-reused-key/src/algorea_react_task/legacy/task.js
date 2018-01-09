export default function () {

    return {

        showViews: function (views, success, error) {
            success();
        },

        getViews: function (success, error) {
            success({});
        },

        updateToken: function (token, success, error) {
            success();
        },

        getHeight: function (success, error) {
            var d = document;
            var h = Math.max(d.body.offsetHeight, d.documentElement.offsetHeight);
            success(h);
        },

        unload: function (success, error) {
            success();
        },

        getState: function (success, error) {
            success('');
        },

        getMetaData: function (success, error) {
            success({});
        },

        reloadAnswer: function (answer, success, error) {
            success();
        },

        reloadState: function (state, success, error) {
            success();
        },

        getAnswer: function (success, error) {
            success('');
        },

        load: function (views, success, error) {
            success();
        },

        gradeAnswer: function (answer, answerToken, success, error) {
            success(0, '');
        }

    };

};