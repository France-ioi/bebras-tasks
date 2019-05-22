/*
window.Quiz.grader.data = [
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
*/

window.Quiz.grader.data = [
    0,
    [1, 2],
    {
        strict: true,
        value: ['ipsum', 'amet']
    }
]