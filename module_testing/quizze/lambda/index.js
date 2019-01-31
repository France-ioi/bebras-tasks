const grader = require('grader');

exports.handler = async (event) => {
    let answer = JSON.parse(event.body)
    let score = grader.grade(answer)

    const response = {
        statusCode: 200,
        body: JSON.stringify({ score }),
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };

    return response;
};
