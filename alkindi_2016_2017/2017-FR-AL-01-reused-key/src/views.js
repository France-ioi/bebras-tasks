import React from 'react';
import {Button} from 'react-bootstrap';
import classnames from 'classnames';
import EpicComponent from 'epic-component';

import {decrypt} from './utils';
import PropTypes from 'prop-types';

// A button for increasing/decreasing one key number.
// props: index, direction, onChange
export const KeyButton = EpicComponent(self => {
  const onClick = function () {
    self.props.onChange(self.props.index, self.props.direction);
  };
  self.render = function () {
    const {direction} = self.props;
    const iconClasses = ["fa", direction == "-1" ? "fa-caret-down" : "fa-caret-up"];
    return <Button onClick={onClick}><i className={classnames(iconClasses)} aria-hidden='true'></i></Button>;
  };
}, {displayName: 'KeyButton'});


// Display a number in the key, click to get a hint.
// props: index, value, isHint, onRequestHint, hintRequest, hintMismatch.
export const KeyValue = EpicComponent(self => {
  const onClick = function () {
    if (!self.props.isHint) {
      self.props.onRequestHint(self.props.index);
    }
  };
  self.render = function () {
    const {isHint, hintMismatch, hintRequest, value} = self.props;
    const classes = [
      isHint && "is-hint",
      hintMismatch && "is-hint-mismatch",
      hintRequest && "is-hint-request",
      "keyValue"
    ];
    return <span className={classnames(classes)} onClick={onClick}>{value}</span>;
  };
}, {displayName: 'KeyValue'});


// A cell containing an encrypted character.
// props: cipherIndex, charIndex, onHover, onMouseDown, className
export const CipherChar = EpicComponent(self => {
  function onHover () {
    self.props.onHover(self.props.cipherIndex, self.props.charIndex);
  }
  function onMouseDown () {
    self.props.onMouseDown(self.props.cipherIndex, self.props.charIndex);
  }
  self.render = function () {
    const {className, value} = self.props;
    return <span className={className} onMouseMove={onHover} onMouseDown={onMouseDown}>{value}</span>;
  };
}, {displayName: 'CipherChar'});

// A cell containing a decrypted character.
// props: cipherIndex, charIndex, onHover, onMouseDown, className, hintMismatch.
export const PlainChar = EpicComponent(self => {
  function onHover () {
    self.props.onHover(self.props.cipherIndex, self.props.charIndex);
  }
  function onMouseDown () {
    self.props.onMouseDown(self.props.cipherIndex, self.props.charIndex);
  }
  self.render = function () {
    const {className, value, hintMismatch} = self.props;
    const classes = [className, hintMismatch && "is-hint-mismatch"];
    return <span className={classnames(classes)} onMouseDown={onMouseDown} onMouseMove={onHover}>{value}</span>;
  };
}, {displayName: 'PlainChar'});

// A displayed cipher (table of cipher character cells).
// props: value, index, onHover, onMouseDown
export const Cipher = EpicComponent(self => {
  self.render = function () {
    const {value, index, onHover, onMouseDown} = self.props;
    const cipherArray = value.split("");
    return (
      <div className="cipherTable">
        {cipherArray.map(function (charValue, charIndex) {
          return <CipherChar key={charIndex} cipherIndex={index} charIndex={charIndex} value={charValue} onHover={onHover} onMouseDown={onMouseDown} />;
        })}
      </div>
    );
  };
}, {displayName: 'Cipher'});

// A displayed decryption (table of plain character cells).
// props: cipherValue, wordCharIndex, wordCipherIndex, keyWithWord, cipherIndex, plainWord,
//        onHover, onMouseDown
export const Plain = EpicComponent(self => {
  self.render = function () {
    const {cipherValue, wordCharIndex, wordCipherIndex, keyWithWord, cipherIndex, plainWord, onMouseDown, onHover} = self.props;
    const plainArray = decrypt(cipherValue, keyWithWord).split("");
    let startIndex;
    if (plainWord && wordCipherIndex === cipherIndex) {
      startIndex = Math.max(0, Math.min(wordCharIndex, cipherValue.length - plainWord.length));
      for (let index = startIndex; index < startIndex + plainWord.length; index++) {
        plainArray[index] = plainWord[index - startIndex];
      }
    }
    return (
      <div className="plainTable">
        {plainArray.map(function (charValue, charIndex) {
          const inPlain = wordCipherIndex === cipherIndex && charIndex >= startIndex && charIndex < startIndex + plainWord.length;
          return <PlainChar key={charIndex} className={inPlain && "plainChar"} cipherIndex={cipherIndex} charIndex={charIndex} value={charValue} onMouseDown={onMouseDown} onHover={onHover} hintMismatch={keyWithWord[charIndex].hintMismatch}/>;
        })}
      </div>
    );
  };
}, {
  displayName: 'Plain',
  propTypes: {
    cipherValue: PropTypes.string.isRequired,
    wordCharIndex: PropTypes.number.isRequired,
    wordCipherIndex: PropTypes.number,
    keyWithWord: PropTypes.arrayOf(PropTypes.object).isRequired,
    cipherIndex: PropTypes.number.isRequired,
    plainWord: PropTypes.string,
    onHover: PropTypes.func.isRequired,
    onMouseDown: PropTypes.func.isRequired
  }
});

const preventDefault = function (event) {
  event.preventDefault();
};

export const Workspace = actions => EpicComponent(self => {

  self.state = {dragging: false, dropOutside: false};

  const onKeyChange = function (index, direction) {
    self.props.dispatch({type: actions.keyChange, index, direction});
  };

  const onMouseDown = function (cipherIndex, charIndex) {
    if (!self.props.task.plainWord) return;
    self.setState({dragging: true, dropOutside: false});
    self.props.dispatch({type: actions.setPlainWordPosition, cipherIndex, charIndex});
  };

  const onHover = function (cipherIndex, charIndex) {
    if (self.state.dragging) {
      self.setState({dropOutside: false});
      self.props.dispatch({type: actions.setPlainWordPosition, cipherIndex, charIndex});
    }
  };

  const onMouseLeave = function () {
    if (self.state.dragging) {
      self.setState({dropOutside: true});
    }
  };

  const onShowHintRequest = function (keyIndex) {
    self.props.dispatch({type: actions.showHintRequest, hintRequest: keyIndex});
  };

  const onCloseHintRequest = function () {
    self.props.dispatch({type: actions.showHintRequest, hintRequest: undefined});
  };

  const onRequestHint = function () {
    const {hintRequest} = self.props.workspace;
    self.props.dispatch({type: actions.callHintRequest, hintRequest});
  };

  const onMouseUp = function () {
    self.setState({dragging: false});
    if (self.state.dropOutside) {
      self.props.dispatch({type: actions.setPlainWordPosition, cipherIndex: null, charIndex: 0});
    }
  };

  const clickDeleteWord = function () {
    self.props.dispatch({type: actions.setPlainWordPosition, cipherIndex: null, charIndex: 0});
  };

  self.componentDidMount = function () {
    document.addEventListener('mouseup', onMouseUp);
  };

  self.componentWillUnmount = function () {
    document.removeEventListener('mouseup', onMouseUp);
  };

  self.render = function () {
    const {task, workspace, answer} = self.props;
    const {keyWithWord, hintRequest} = workspace;
    const {wordCharIndex, wordCipherIndex} = answer;
    const {ciphers, plainWord} = task;
    return (
      /* preventDefault is called because browsers default to a visual dragging of HTML elements */
      <div onMouseMove={preventDefault} className="taskWrapper">

        <div className="taskInstructions">
          {plainWord &&
            <div>
              <p className="text-bold">Pour vous aider, voici le mot à placer dans l'un des quatre messages :</p>
              <div>{renderWord()}</div>
              <p>Vous pouvez cliquer à divers endroits des messages pour tenter de placer ce mot. La clé est alors modifiée automatiquement pour que cela corresponde à cette partie du message déchiffré, et vous pouvez voir l'effet sur les autres messages.</p>
            </div>}
          <p className="text-bold">Obtenir un indice</p>
          <p>Cliquez sur un élément de la clé pour pouvoir demander sa valeur comme un indice.</p>
          <p className="text-bold">Modifier la clé</p>
          <p>Cliquez sur les flèches au-dessus et en dessous des éléments de la clé pour modifier leur valeur. La version
         déchiffrée avec cette clé s'affiche sous chacun des quatre messages.</p>
          {hintRequest !== undefined && renderHintRequest()}
        </div>


        <div className="keyTable">
          <div>
            {keyWithWord.map(function (keyValue, keyIndex) {
              if (keyValue.inWord) {
                return <span key={keyIndex}></span>;
              } else {
                return (
                  <span key={keyIndex}>
                    {keyValue.isHint || <KeyButton index={keyIndex} direction="1" onChange={onKeyChange} />}
                  </span>
                );
              }
            })}
          </div>
          <div>
            {keyWithWord.map(function (keyValue, keyIndex) {
              return (
                <KeyValue key={keyIndex} index={keyIndex} value={keyValue.value} isHint={keyValue.isHint} hintMismatch={keyValue.hintMismatch} hintRequest={hintRequest !== undefined && (hintRequest === keyIndex)} onRequestHint={onShowHintRequest}/>
              );
            })}
          </div>
          <div>
            {keyWithWord.map(function (keyValue, keyIndex) {
              if (keyValue.inWord) {
                return <span key={keyIndex}></span>;
              } else {
                return (
                  <span key={keyIndex}>
                    {keyValue.isHint || <KeyButton index={keyIndex} direction="-1" onChange={onKeyChange} />}
                  </span>
                );
              }
            })}
          </div>
        </div>
        <div className="ciphersAndPlains">
          {ciphers.map(function (cipherValue, cipherIndex) {
            return (
              <div key={cipherIndex} onMouseLeave={onMouseLeave}>
                <Cipher index={cipherIndex} value={cipherValue} onHover={onHover} onMouseDown={onMouseDown} />
                <Plain cipherIndex={cipherIndex} cipherValue={cipherValue} keyWithWord={keyWithWord} wordCharIndex={wordCharIndex} wordCipherIndex={wordCipherIndex} plainWord={plainWord} onMouseDown={onMouseDown} onHover={onHover} />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  function renderHintRequest () {
    const {hintRequest} = self.props.workspace;
    return (
      <div className="hintsDialog">
        <p><strong>{"Indice demandé : "}</strong>{"Valeur pour la position "}<strong>{hintRequest}</strong></p>
        <p className="text-center">
          <Button onClick={onRequestHint}>{"Valider"}</Button>
          <Button onClick={onCloseHintRequest}>{"Annuler"}</Button>
        </p>
      </div>
    );
  }

  const renderWord = function () {
    const {task, workspace} = self.props;
    const {plainWord} = task;
    const {wordCipherIndex} = workspace;
    return (
      <div className="topPlainWordContainer">
        <span className="topPlainWord">{plainWord}</span>
        {(wordCipherIndex !== null) && renderDelete()}
      </div>
    );
  };

  const renderDelete = function () {
    return <Button className="deleteWordContainer" onClick={clickDeleteWord}>Effacer <i className="fa fa-times" aria-hidden="true"></i></Button>;
  };

}, {displayName: 'View'});