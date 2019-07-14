const Twitter = require('twitter');
const { config } = require('./config');

require('dotenv').config();

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

const params = { screen_name: config.username };
client.get('statuses/user_timeline', params, (error, tweets, response) => {
  if (!error) {
    // console.log(tweets);
    tweets.forEach(tweet => console.log(`${tweet.created_at}: ${tweet.text}\n`));
  }
});
