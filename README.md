# Twitter Deal Alerts

Running this app will trigger a chron job that checks a specified Twitter account for key words, then sends an alert via email when a match is found.

A lot of the variables can be switched around to customize your need. I set this up to monitor a deal feed (@WirecutterDeals) for certain items so I could stay on top of things and not be tempted by random purchases.

To get it working, you should just need to fill in the .env variables then run the following command.

`node index.js`

Happy hacking!
-AshCo