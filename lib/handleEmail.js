const nodemailer = require('nodemailer');

function formatEmail(tweet, keyword) {
  const linkArr = tweet.text.split(' ').filter(word => word.includes('http'));

  const emailObj = {
    subject: `New Deal Match! [${keyword}] 🐦`,
    html: `<h3>New Deal Match! [${keyword}] 🐦</h3>
    <p>Date: ${tweet.created_at}</p>
    <p>${tweet.text}</p>
    ${linkArr.map(link => `<a href='${link}'>${link}</a><br/>`)}`,
  };

  return emailObj;
}

async function sendEmail(emailObj) {
  // create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_SENDER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // send mail with defined transport object
  await transporter.sendMail({
    from: `"Twitter Alerts" ${process.env.EMAIL_SENDER}`,
    to: process.env.EMAIL_RECIPIENT,
    subject: emailObj.subject,
    html: emailObj.html,
  });
}


function handleEmail(tweet, keyword) {
  console.log(`New ${keyword} match detected, sending email for tweet ID: ${tweet.id}`);

  const emailObj = formatEmail(tweet, keyword);
  sendEmail(emailObj).catch(console.error);
}


module.exports = handleEmail;
