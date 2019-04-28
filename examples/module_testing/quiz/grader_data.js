window.QuizGrader.data = [
    0,
    [1, 2],
    "A",
    2,
    function(val) {
        return {
            valid: val.length > 0,
            message: 'Test message'
        }
    }
]