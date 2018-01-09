import {eventChannel, END, buffers} from 'redux-saga';

export default (target) => {

    return eventChannel(emitter => {

        window.task.load = function(views, callback) {
            return emitter({ type: 'load', views, callback });
        };

        window.task.getAnswer = function(callback) {
            return emitter({ type: 'getAnswer', callback });
        };

        window.task.reloadAnswer = function(answer, callback) {
            return emitter({ type: 'reloadAnswer', answer, callback });
        };


        window.task.gradeAnswer = function(answer, answer_token, callback) {
            return emitter({ type: 'gradeAnswer', answer, answer_token, callback });
        };


        window.task.getState = function(callback) {
            return emitter({ type: 'getState', callback });
        };


        window.task.reloadState = function(state, callback) {
            return emitter({ type: 'reloadState', state, callback });
        };

        return () => {};

    });

};
