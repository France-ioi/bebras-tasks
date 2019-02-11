(function(exports){

    exports.data = [
        0,
        [1, 2],
        function(val) {
            return val == '2';
        }
    ]

})(typeof exports === 'undefined' ? (this['QuizzeGrader'] ? this['QuizzeGrader'] : this['QuizzeGrader'] = {}) : exports)