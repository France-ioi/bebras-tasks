window.Quiz.grader.data = [
    [
        {
            value: [1],
            messages: [
                'Q0-A0 is mistake',
                'Q0-A1 is correct',
                'Q0-A2 is mistake'
            ]
        }
    ],
    [
        {
            value: [1,2],
            messages: [
                'Q1.1-A0 is mistake',
                'Q1.1-A1 is correct',
                'Q1.1-A2 is correct',
                'Q1.1-A3 is mistake',
                'Q1.1-A4 is mistake'
            ]
        },
        {
            value: [1,2],
            messages: [
                'Q1.2-A0 is mistake',
                'Q1.2-A1 is correct',
                'Q1.2-A2 is correct',
                'Q1.2-A3 is mistake',
                'Q1.2-A4 is mistake'
            ]
        }
    ],
    [
        {
            value: ['test'],
            messages: [
                'Q2-A0 answer is mistake'
            ]
        }
    ],
    [
        {
            value: ['ipsum','amet'],
            strict: true,
            messages: [
                'Q3 ipsum is correct',
                'Q3 amet is correct'
            ]
        }
    ],
    [
        {
            value: [5,0,1,2,3,4],
            strict: true,
            messages: [
                'Q5 wrong order',
                'Q5 success'
            ]
        }
    ],
    [
        {
            value: [[0,1],[2,3],[4,5]],
            twoDimArray: true,
            messages: [
                'Q6 some items are not in the right container' ,
                'Q6 success'
            ]
        }
    ]
]