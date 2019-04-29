window.QuizGrader.data = [
    0,
    [1, 2],
    "A",
    2,
    function(val) {
        return {
            score: val.length <= 10 ? val.length / 10 : 0,
            message: 'Test message'
        }
    }
]