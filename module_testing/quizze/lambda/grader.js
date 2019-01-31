(function(exports){

    exports.grade = function(answer) {
        var score = 0;
        if(answer[0] == 0) score++;
        if(answer[1].indexOf(1) !== -1 && answer[1].indexOf(2) !== -1) score++;
        if(answer[2] == '2') score++;
        return score / 3;
    }

})(typeof exports === 'undefined' ? this['QuizzeGrader'] = {} : exports)