
export const ALPHABET_SIZE = 26;
export const ALPHABET_START = 'A'.charCodeAt(0);

// Auxiliary function to decrypt a cipher string given a key.
export function decrypt (cipher, key) {
  var result = "";
  for (var index = 0; index < cipher.length; index++) {
    var letter;
    if (cipher[index] === ' ') {
      letter = ' ';
    } else {
      letter = String.fromCharCode(((cipher.charCodeAt(index) - ALPHABET_START + key[index].value) % ALPHABET_SIZE) + ALPHABET_START);
    }
    result += letter;
  }
  return result;
}

// Generate a keyWithWord from a key (keyWithWord takes the decrypted word into account).
export function generateKeyWithWord (key, plainWord, wordCharIndex, cipher) {
  const keyWithWord = key.slice();
  const wordStartIndex = Math.max(0, Math.min(wordCharIndex, key.length - plainWord.length));
  for (var index = wordStartIndex; index < wordStartIndex + plainWord.length; index++) {
    if (cipher[index] !== ' ') {
      const newValue = (plainWord.charCodeAt(index - wordStartIndex) - cipher.charCodeAt(index) + ALPHABET_SIZE) % ALPHABET_SIZE;
      const cell = keyWithWord[index] = {...key[index], inWord: true};
      if (cell.isHint) {
        if (cell.value !== newValue) {
          cell.hintMismatch = true;
        }
      } else {
        cell.value = newValue;
      }
    }
  }
  return keyWithWord;
}
