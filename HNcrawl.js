'use latest';

var rp = require('request-promise');

var base_url = 'https://hacker-news.firebaseio.com/v0';
var job_page = '/jobstories.json';
var jobs = [];

function sendRequest(end_point) {
    return rp({
        method: 'GET',
        uri: base_url + end_point
    });
};

module.exports = 
function (context, cb) {
    sendRequest(job_page).then(response => {
        var str = '';
        response = response.substr(1, response.length - 2);
        var story_ids = response.split('\,');
        for (var i = 0; i < story_ids.length; i++) {
            story_url = '/item/' + story_ids[i] + '.json?print=pretty';
            sendRequest(story_url).then(story => {
                story = JSON.parse(story);
                var job_own_url = story.url;
                if (job_own_url) {
                    rp(job_own_url).then(jobDescription => {
                        jobs.push({
                            // 'title':story.title, 
                            // 'text':story.text,
                            // 'url':story.url
                            'desc':jobDescription
                        });
                    });
                }
            });
        }

        for (var i in jobs) {
            console.log(jobs[i]);
        }
    });
}   
