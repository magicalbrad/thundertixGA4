**08/10/2022: Updated with simplified approach**

# Thundertix GA4 Google Analytics Tracking
Thundertix is an event ticketing service. They promote easyGoogle Analytics integration as a feature, but in reality it's not so simple.

First, their built in integration only supports the older, soon to be discontinued "UA" version of Google Analytics.

Second, their implementaion only works when visitors purchase tickets directly from the Thundertix website. At least in most modern browsers, it won't work if you are selling tickets from your website by embedding their page in an iFrame.

Finally, they don't support ecommerce in analytics, which is arguably the most important data.

This represents my attempt to work around those limitations and get Google Analytics 4 implemented and working, including ecommerce.

[Read Documentation](https://magicalbrad.github.io/thundertixGA4/)
