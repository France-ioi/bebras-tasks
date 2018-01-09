import {eventChannel} from 'redux-saga';

export default (task) => {

    /* XXX no buffering is specified, new messages will be lost if there are no pending takers */
    return eventChannel(emitter => {

        task.load = function(views, callback) {
            emitter({type: 'load', views, callback});
        };

        task.getAnswer = function(callback) {
            emitter({type: 'getAnswer', callback});
        };

        task.reloadAnswer = function(answer, callback) {
            emitter({type: 'reloadAnswer', answer, callback});
        };

        task.gradeAnswer = function(answer, answer_token, callback) {
            emitter({type: 'gradeAnswer', answer, answer_token, callback});
        };


        task.getState = function(callback) {
            emitter({type: 'getState', callback});
        };

        task.reloadState = function(state, callback) {
            emitter({type: 'reloadState', state, callback});
        };

        return () => {
            task.load = null;
            task.getAnswer = null;
            task.reloadAnswer = null;
            task.gradeAnswer = null;
            task.getState = null;
            task.reloadState = null;
        };

    });

};
