function getGraderFunc(n) {
    return function(v) {
        return {
            score: v == n ? 1 : 0,
            message: v != n ? 'Must be ' + n : ''
        }
    }
}

window.Quiz.grader.data = [
    [
        getGraderFunc('1'),
        getGraderFunc('2'),
        getGraderFunc('3')
    ],
    [
        'a',
        'b',
        'c'
    ]
]