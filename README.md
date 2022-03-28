# Thundertix GA4
Currently, it is difficult to track GA4 events in third party iframes, due to cross browser cookie blocking.
This is an implementation of Simo Ahava's Cookieless tracking solution to track events in the Thundertix ticketing system.

Details of Simo Ahava's implementation is here: https://www.simoahava.com/analytics/cookieless-tracking-cross-site-iframes/

I don't know whether this will actually be of use to anyone. I thought I'd share it as it took a bit of trial and error for to get it working, so maybe this will save someone else a few headaches. For now, I won't put a lot of detail, as I don't know whether or not it will be useful to anyone else. I may add more details later, of there s sufficient interest.

## Overview
Briefly, the problem is that for security reasons, browsers are blocking cookies from third party iframes. This also prevents analytics from working in some situations including embedding a Thundertix ticketing frame on your website. (See Simo Ahava's post above for more details.)

This solution gets around that by having the child frame pass the event information to the parent window to be recorded.

This means the analytics from the Thundertix events will appear in your main site's analytics account.

## Implementation
### Thundertix Child Frame
- Create an GA4 analytics account for Thundertix, if you don't already have one set up.
- Create a Google Tag Manager account for Thundertix, if you don't already have one.
- Create a "Google Analytics: GA4 Configuration Tag" in Tag Manager, configured for your Thundertix GA4 account.
- Create a "Custom HTML Tag" in Tag Manager, using the script in child_frame.js file. (https://github.com/magicalbrad/thundertixGA4/blob/main/child_frame.js) There are some configuration options in the file. See the comments in the file for more info.
- In the "Integrations & Pixel Tracking" area of the Thundertix admin, add your Google Tag Manager account ID.
- (Optional) Also in the In the "Integrations & Pixel Tracking" area, add the code from conversion.js (https://github.com/magicalbrad/thundertixGA4/blob/main/conversion.js) to "Conversion and Click Tracking," if you wich to track conversions. (You may need to contact their support to get that added.) 

## Parent Window (a.k.a. your site where the Thindertix frame is used)
- Create an GA4 analytics account for your site, if you don't already have one set up.
- Create a Google Tag Manager account for your site, if you don't already have one.
- Create a "Google Analytics: GA4 Configuration Tag" in Tag Manager, configured for your Thundertix GA4 account.
- Create a "Custom HTML Tag" in Tag Manager, using the script in parent_frame.js file. (https://github.com/magicalbrad/thundertixGA4/blob/main/parent_frame.js) There are some configuration options in the file. See the comments in the file for more info. This tag only needs to be triggerred on pages that have a Thndrtix iFrame.
- Install Google Tag Manager on your website.

Note that if you do use conversion tracking, you'll need to set up the "ticket_purchase" custom event in your main site's analytics. Unfortunately, at this time Thundertix does not provide sufficient data to use GA4's recommended "purchase" event.
