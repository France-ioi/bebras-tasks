
import runTask from 'alkindi-task-lib';

import Task from './intro';
import {Workspace} from './views';
import {generateKeyWithWord, ALPHABET_SIZE} from './utils';

import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'rc-tooltip/assets/bootstrap.css';
import './style.css';

export function run (container, options) {
   runTask(container, options, TaskBundle);
};

function TaskBundle (bundle, deps) {

  /*** Start of required task definitions ***/

  const workspaceOperations = {
    taskLoaded,
    taskUpdated,
    workspaceLoaded,
    dumpWorkspace,
    isWorkspaceReady
  };

  /* The 'init' action sets the workspace operations in the global state. */
  bundle.addReducer('init', function (state, action) {
    return {...state, workspaceOperations};
  });

  /* The 'Task' view displays the task introduction to the contestant. */
  bundle.defineView('Task', TaskSelector, Task);
  function TaskSelector (state) {
    const {task} = state;
    return {task};
  }

  /* The 'Workspace' view displays the main task view to the contestant. */
  bundle.defineView('Workspace', WorkspaceSelector, Workspace(deps));
  function WorkspaceSelector (state, props) {
    const {score, task, workspace, hintRequest, submitAnswer} = state;
    return {score, task, workspace, hintRequest, submitAnswer: submitAnswer || {}};
  }

  /*** End of required task definitions ***/

  /* These are passed to WorkspaceView. */
  bundle.use('showHintRequest', 'requestHint', 'submitAnswer', 'SaveButton', 'dismissAnswerFeedback');

  /* taskInitialized is called to update the global state when the task is first loaded. */
  function taskLoaded (state) {
    const {ciphers} = state.task;
    const key = [];
    for (let index = 0; index < ciphers[0].length; index++) {
      key.push(0);
    }
    const dump = {key, wordCharIndex: 0, wordCipherIndex: null};
    const workspace = updateWorkspace(state.task, dump);
    return {...state, dump, workspace};
  }

  /* taskUpdated is called to update the global state when the task is updated. */
  function taskUpdated (state) {
    const workspace = updateWorkspace(state.task, state.dump);
    /* state.dump could be reconciled with new state.task here */
    return {...state, workspace};
  }

  /* workspaceLoaded is called to update the global state when a workspace dump is loaded. */
  function workspaceLoaded (state, dump) {
    const workspace = updateWorkspace(state.task, dump);
    return {...state, dump, workspace};
  }

  /* dumpWorkspace is called to build a serializable workspace dump.
     It should return the smallest part of the workspace that is needed to
     rebuild it.  */
  function dumpWorkspace (state) {
    const {key, wordCharIndex, wordCipherIndex} = state.workspace;
    return {key, wordCharIndex, wordCipherIndex};
  }

  function isWorkspaceReady (state) {
    return ('workspace' in state) && ('keyWithWord' in state.workspace);
  }

  /* keyChange {index, direction} updates the key by incrementing/decrementing
     a value in the key. */
  bundle.defineAction('keyChange', 'Workspace.KeyChange');
  bundle.addReducer('keyChange', function keyChangeReducer (state, action) {
    const {index, direction} = action;
    let {dump, task} = state;
    const key = dump.key.slice();
    key[index] = (key[index] + parseInt(direction) + ALPHABET_SIZE) % ALPHABET_SIZE;
    dump = {...dump, key};
    const workspace = updateWorkspace(task, dump);
    return {...state, dump, workspace};
  });

  /* setPlainWordPosition {cipherIndex, charIndex} updates the key so that the
     plain word appears at a specific position in the deciphered text. */
  bundle.defineAction('setPlainWordPosition', 'Workspace.SetPlainWordPosition');
  bundle.addReducer('setPlainWordPosition', function (state, action) {
    const {cipherIndex, charIndex} = action;
    let {dump} = state;
    dump = {...dump, wordCharIndex: charIndex, wordCipherIndex: cipherIndex};
    const workspace = updateWorkspace(state.task, dump);
    return {...state, dump, workspace};
  });

}

/* Helper function to compute the workspace when the task or workspace has
  changed.  The workspace includes enriched versions of the key including
  hints and the placed plain-text word. */
function updateWorkspace (task, dump) {
  const {plainWord, ciphers, hints} = task;
  const {key, wordCharIndex, wordCipherIndex} = dump;
  // Update the key with hints.
  const keyWithHints = key.map(function (value, index) {
    if (index in hints) {
      return {value: hints[index], isHint: true};
    } else {
      return {value: value, isHint: false};
    }
  });
  // Update the key with the positioned word.
  const keyWithWord = (wordCipherIndex !== null) ? generateKeyWithWord(keyWithHints, plainWord, wordCharIndex, ciphers[wordCipherIndex]) : keyWithHints;
  return {...dump, keyWithHints, keyWithWord};
}
