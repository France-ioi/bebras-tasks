/*
window.Quiz.grader.data = [
    0,
    [1, 2],
    {
        strict: true,
        value: ['ipsum', 'amet']
    },
    function(val) {
        if(val != '') {
            return {
                score: 0,
                message: 'Grader msg: value must be non empty string'
            }
        }
        return 1;
    }
]
*/


window.Quiz.grader.data = [
    {
        messages: [
            'Grader msg: question 1, wrong answer idx 0',
            'Grader msg: question 1, wrong answer idx 1',
            'Grader msg: question 1, wrong answer idx 2',
            null
        ],
        value: 3
    },
    {
        messages: [
            'Grader msg: question 2, wrong answer idx 0',
            null,
            'Grader msg: question 2, wrong answer idx 2',
            null
        ],
        value: [1, 3]
    },
    {
        strict: true,
        value: ['ipsum', 'amet']
    },
    function(val) {
        if(val == '') {
            return {
                score: 0,
                message: 'Grader msg: value must be non empty string'
            }
        }
        return 1;
    }
]