(function() {
    var data = {
        easy: {
            video_id: "XN5NXT0g1lg",
            introduction: 'Introduction text',
            conclusion: 'Conclusion text',
            sections: [
                {
                    title: 'Section 1',
                    description: 'Description text 1',
                    parts: 4,
                    start: 0,
                    end: 7.5
                },
                {
                    title: 'Section 2',
                    description: 'Description text 2',
                    start: 7.5,
                    end: 15
                }
            ],
            show_viewed: true,
            youtube: {
                rel: 0,
                autoplay: 0
            }
        },
        medium: {
            video_id: "XN5NXT0g1lg",
            introduction: 'Introduction text',
            conclusion: 'Conclusion text',
            sections: [
                {
                    title: 'Section 1',
                    description: 'Description text 1',
                    start: 0,
                    end: 5
                },
                {
                    title: 'Section 2',
                    description: 'Description text 2',
                    start: 5,
                    end: 10
                },
                {
                    title: 'Section 3',
                    description: 'Description text 3',
                    start: 10,
                    end: 15
                }
            ],
            show_viewed: true,
            youtube: {
                rel: 0,
                autoplay: 0
            }        
        },
        hard: {
            video_id: "XN5NXT0g1lg",
            introduction: 'Introduction text',
            conclusion: 'Conclusion text',
            sections: 3,
            show_viewed: true,
            youtube: {
                rel: 0,
                autoplay: 0
            }                
        }
    };


    function grader(level, state) {
        var l = state.viewed.length;
        return {
            targetReached: l > 0,
            successRate: l,
            message: taskStrings.message(state.viewed)
        };
    }

    taskVideo(data, grader);
})();