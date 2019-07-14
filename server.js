const Twitter = require('twitter');
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
client.get('statuses/user_timeline', params, (error, tweets, res) => {
  if (!error) {
    // filter only new tweets
    const newTweets = tweets.filter(tweet => isAfter(new Date(tweet.created_at), latestScrapeDate));

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

// {
//   created_at: 'Sun Jul 14 16:39:05 +0000 2019',
//   id: 1150444617147531300,
//   id_str: '1150444617147531266',
//   text: 'Our top pick for best pet water fountain, the Catit Flower Pet ' +
//     'Water Fountain, is down to $17 (from $27)… ' +
//     'https://t.co/5BIgXArt9B',
//   truncated: true,
//   entities: { hashtags: [], symbols: [], user_mentions: [], urls: [ [Object] ] },
//   source: '<a ' +
//     'href="https://about.twitter.com/products/tweetdeck" ' +
//     'rel="nofollow">TweetDeck</a>',
//   in_reply_to_status_id: null,
//   in_reply_to_status_id_str: null,
//   in_reply_to_user_id: null,
//   in_reply_to_user_id_str: null,
//   in_reply_to_screen_name: null,
//   user: {
//     id: 3255034008,
//     id_str: '3255034008',
//     name: 'Wirecutter Deals',
//     screen_name: 'WirecutterDeals',
//     location: '',
//     description: 'The best deals on the best gear and gadgets, hand picked by ' +
//       '@wirecutter. We may earn an affiliate commission on the deals we ' +
//       'tweet.',
//     url: 'https://t.co/waAylMNEAY',
//     entities: { url: [Object], description: [Object] },
//     protected: false,
//     followers_count: 62698,
//     friends_count: 10,
//     listed_count: 1334,
//     created_at: 'Thu Jun 25 01:37:57 +0000 2015',
//     favourites_count: 1282,
//     utc_offset: null,
//     time_zone: null,
//     geo_enabled: false,
//     verified: true,
//     statuses_count: 16133,
//     lang: null,
//     contributors_enabled: false,
//     is_translator: false,
//     is_translation_enabled: false,
//     profile_background_color: '000000',
//     profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
//     profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
//     profile_background_tile: false,
//     profile_image_url: 'http://pbs.twimg.com/profile_images/915086219414929408/maYnBT8j_normal.jpg',
//     profile_image_url_https: 'https://pbs.twimg.com/profile_images/915086219414929408/maYnBT8j_normal.jpg',
//     profile_banner_url: 'https://pbs.twimg.com/profile_banners/3255034008/1562963131',
//     profile_link_color: '33C69F',
//     profile_sidebar_border_color: '000000',
//     profile_sidebar_fill_color: '000000',
//     profile_text_color: '000000',
//     profile_use_background_image: false,
//     has_extended_profile: false,
//     default_profile: false,
//     default_profile_image: false,
//     following: false,
//     follow_request_sent: false,
//     notifications: false,
//     translator_type: 'none'
//   },
//   geo: null,
//   coordinates: null,
//   place: null,
//   contributors: null,
//   is_quote_status: false,
//   retweet_count: 0,
//   favorite_count: 0,
//   favorited: false,
//   retweeted: false,
//   possibly_sensitive: false,
//   lang: 'en'
// }
