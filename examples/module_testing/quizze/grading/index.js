const grader = require('grader');
const data = require('data');

exports.handler = async (event) => {
    let answer = JSON.parse(event.body)
    let result = grader.grade(data, answer)
    const response = {
        statusCode: 200,
        body: JSON.stringify(result),
        headers: {
            'Access-Control-Allow-Origin': '*'
        }
    };
    return response;
};
