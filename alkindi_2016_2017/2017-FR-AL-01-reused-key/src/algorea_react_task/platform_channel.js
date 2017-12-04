
import {eventChannel, END, buffers} from 'redux-saga'

export default (target) => {

  return eventChannel(emitter => {

    window.task.getAnswer = function(callback) {
      return emitter({ type: 'getAnswer', callback })
    }

    window.task.gradeAnswer = function(answer, answer_token, callback, error) {
      return emitter({ type: 'gradeAnswer', answer, answer_token, callback, error })
    }

    return () => {}

  })

}
