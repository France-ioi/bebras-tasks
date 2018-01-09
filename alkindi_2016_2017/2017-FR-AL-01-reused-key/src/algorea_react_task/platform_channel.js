import {eventChannel} from 'redux-saga';

export default (task) => {

    /* XXX no buffering is specified, new messages will be lost if there are no pending takers */
    return eventChannel(emitter => {

        task.load = function(views, callback) {
            return emitter({type: 'load', views, callback});
        };

        task.getAnswer = function(callback) {
            return emitter({type: 'getAnswer', callback});
        };

        task.reloadAnswer = function(answer, callback) {
            return emitter({type: 'reloadAnswer', answer, callback});
        };

        task.gradeAnswer = function(answer, answer_token, callback) {

            return emitter({type: 'gradeAnswer', answer, answer_token, callback});
        };


        task.getState = function(callback) {
            return emitter({type: 'getState', callback});
        };

        task.reloadState = function(state, callback) {

            return emitter({type: 'reloadState', state, callback});
        };

        return () => {};

    });

};
