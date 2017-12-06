const seedrandom = require('seedrandom')
const words = require('./words')


module.exports = {

    config: {
        cache_task_data: false,
    },


    taskData: (args, callback) => {
        const rng = seedrandom(args.task.random_seed);
        //const rng = function() { return 0.1 }
        // TODO choose ciphers and plain word.
        var minLength = words[0][0].length;
        var cipherLengths = [
            [7, 10, 8, 7],
            [10, 9, 9, 4],
            [5, 10, 7, 10],
            [4, 5, 6, 4, 5, 6]
        ];

        var ciphers = [];
        var plainWord = "";
        for (var iCipher = 0; iCipher < cipherLengths.length; iCipher++) {
            var cipher = "";
            for (var iWord = 0; iWord < cipherLengths[iCipher].length; iWord++) {
                if (iWord != 0) {
                    cipher += " ";
                }
                var length = cipherLengths[iCipher][iWord];
                var iChoice = Math.trunc(rng() * words[length - minLength].length);
                var word = words[length - minLength][iChoice];
                cipher += word;
                if ((iCipher == 0) && (iWord == cipherLengths[iCipher].length - 1)) {
                    plainWord = word;
                }
            }
            ciphers.push(cipher);
        }

        var secretKey = [];
        for (let iKey = 0; iKey < ciphers[0].length; iKey++) {
            secretKey.push(Math.trunc(rng() * 26));
        }

        for (let iCipher = 0; iCipher < ciphers.length; iCipher++) {
            var newCipher = "";
            for (let iLetter = 0; iLetter < secretKey.length; iLetter++) {
                var letter = ciphers[iCipher][iLetter];
                if ((letter == ' ') || (letter == '_')) {
                    newCipher += ' ';
                } else {
                    var rank = letter.charCodeAt(0) - "A".charCodeAt(0);
                    rank = (rank - secretKey[iLetter] + 26) % 26;
                    newCipher += String.fromCharCode(rank + "A".charCodeAt(0));
                }
            }
            ciphers[iCipher] = newCipher;
        }
        callback(null, {
            ciphers,
            secretKey,
            //plainWord
        })
    },


    taskHintData: (args, task_data, callback) => {
        const hints = {}
        const hr = args.task.hints_requested || []
        hr.forEach(function(idx) {
            if(typeof idx !== 'number' || idx < 0 || idx >= task_data.secretKey.length) {
                return callback(new Error('Wrong key index'));
            }
            hints[idx] = task_data.secretKey[idx]
        })
        callback(null, hints);
    },


    gradeAnswer: (args, task_data, callback) => {
        //TODO: move JSON.parse to server-modules
        const answer = JSON.parse(args.answer.value) || [] // because Algorea support strings only

        let nCorrect = 0;
        task_data.secretKey.forEach(function (value, index) {
            if (value === answer.key[index]) {
                nCorrect += 1;
            }
        });
        callback(null, {
            score: nCorrect == task_data.secretKey.length ? args.max_score : args.min_score,
            message: ''
        })
    }
}