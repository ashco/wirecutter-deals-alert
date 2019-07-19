const Twitter = require('twitter');
const cron = require('node-cron');
const isAfter = require('date-fns/is_after');

const handleEmail = require('./lib/handleEmail');
const { config } = require('./config');

require('dotenv').config();

const client = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
});

let latestScrapeDate = new Date('Sun Jul 12 16:39:05 +0000 2019');

const params = { screen_name: config.username };

function handleScrape() {
  client.get('statuses/user_timeline', params, (error, tweets, res) => {
    if (!error) {
      // filter only new tweets
      const newTweets = tweets
        .filter(tweet => isAfter(new Date(tweet.created_at), latestScrapeDate))
        .filter(tweet => tweet.text[0] !== '@');

      // Check for keywords in each tweet, if present, send email;
      newTweets.forEach((tweet) => {
        config.keywords.forEach((keyword) => {
          if (tweet.text.toLowerCase().includes(keyword.toLowerCase())) {
            handleEmail(tweet, keyword);
          }
        });
      });

      // update scrape time for next cron
      latestScrapeDate = new Date(tweets[0].created_at);
    }
  });
}

handleScrape();

cron.schedule('*/5 * * * *', () => {
  console.log(`[${new Date().toISOString()}] - Checking for deals`);
  handleScrape();
});

console.log(`Starting watch for the greatest of deals 👀 [@${config.username}]`);
