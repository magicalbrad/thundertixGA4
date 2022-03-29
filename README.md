# Thundertix GA4 Google Analytics Tracking
Currently, it is difficult to track GA4 events in third party iframes, due to cross browser cookie blocking. This makes impacts tracking of events from embedded Thundertix ticketing windows. This is a sample implementation of a way to get GA4 working through Google Tag manager using JavaScript postMessage for cross-origin communication.

I don't know whether this will actually be of use to anyone. I thought I'd share it as it took a bit of trial and error for me to get it working, so maybe this will save someone else a few headaches. For now, I won't put a lot of detail, as I don't know how useful to anyone else. I may can more details later, if there s sufficient interest.

## Credit
This is an implementation of Simo Ahava's Cookieless tracking solution applied to tracking for embeded Thundertix ticketing iframes.

Details of Simo Ahava's implementation is here: https://www.simoahava.com/analytics/cookieless-tracking-cross-site-iframes/

## Overview
Briefly, the problem is that for security reasons, browsers are blocking cookies from third party iframes. This blocking prevents analytics from working in some situations including for embedded Thundertix ticketing frame on your website. (See Simo Ahava's post above for more details of the issue.)

This solution gets around that by having the child frame pass the event information to the parent window to be recorded. The basic flow is something like this:

- Google Analytics creates an event on the embedded Thundertix page.
- A custom Google Tag Manager tag on the Thundrtix page sends a copy of the event to the parent window.
- A custom Google Tag Manager tag on the main window listens for these messages, records the event in the parent window.
- Custom Tag Manager GA4 events are triggered, sending the data to the parent window's Google Analytics account. 

This means the analytics from the Thundertix events will appear in your main site's analytics account. 

## Implementation
### Thundertix Child Frame Setup
#### Google Analytics Analytics
- Create an GA4 analytics account for Thundertix, if you don't already have one set up.
#### Google Tag Manager
- Create a Google Tag Manager account for Thundertix, if you don't already have one.
- Create a "Google Analytics: GA4 Configuration Tag" in Tag Manager, configured for your Thundertix GA4 account.
- Create a "Custom HTML Tag" in Tag Manager, using the script in child_frame.js file. (https://github.com/magicalbrad/thundertixGA4/blob/main/child_frame.js) There are some configuration options in the file. See the comments in the file for more info.
#### Thundertix Admin
- In the "Integrations & Pixel Tracking" area of the Thundertix admin, add your Google Tag Manager account ID.
- Also in the In the "Integrations & Pixel Tracking" area, add the code from conversion.js (https://github.com/magicalbrad/thundertixGA4/blob/main/conversion.js) to "Conversion and Click Tracking," if you witch to track conversions. (You may need to contact their support to get that added.) 

### Parent Window (a.k.a. your site where the Thindertix frame is used)
#### Google Analytics
- Create an GA4 analytics account for your site, if you don't already have one set up.
#### Google Tag Manager
- Create a Google Tag Manager account for your site, if you don't already have one.
- Create a "Google Analytics: GA4 Configuration Tag" in Tag Manager, configured for your website's GA4 account.
- Create a "Custom HTML Tag" in Tag Manager, using the script in parent_frame.js file. (https://github.com/magicalbrad/thundertixGA4/blob/main/parent_frame.js) There are some configuration options in the file. See the comments in the file for more info. This tag only needs to be triggered on pages that have a Thundertix iframe.
- Create the following Tag Manager Variables: (Value is only required of you are implementing conversion tracking.)

| Name | Variable Type | Variable Name |
|---|---|---|
| Thundertix Page Title  | Data Layer Variable | iframe.pageData.title |
| Thundertix Page URL  | Data Layer Variable | iframe.pageData.url |
| value | Data Layer Variable | value |

- Create the any of the following triggers for events you wish to track:

| Name | Trigger Type | Event Name | Trigger Fires on |
|---|---|---|---|
| Thundertix Link Click  | Data Layer Variable | iframe.gtm.linkClick | All Custom Events |
| Thundertix Page View  | Data Layer Variable | iframe.gtm.js | All Custom Events |
| Thundertix Scroll  | Data Layer Variable | iframe.gtm.scrollDepth | All Custom Events | 
| Thundertix Purchase  | Data Layer Variable | ticket_purchase | All Custom Events |

- Create the any of the following tags you for events you wish to track:<br>Note, all of these examples use the standard GA4 events except for the custom event "ticket_purchase." At this time, Thundertix does not provide sufficient data to support using the standard GA4 purchase event. Of course, you can choose to use custom events for any or all of the events. Any custom events must be configured in Google Analytics as "Custom Definitions," and you will likely want to mark the ticket_purchase custom event as a conversion. 

| Name | Tag Type | Event Name | Event Parameters | Triggering |
|---|---|---|---|---|
| Thundertix Click  | Google Analytics: GA4 event | click | page_title {{Thundertix Page Title}}<br>page_location {{Thundertix Page URL}} | Thundertix Link Click |
| Thundertix Page View  | Google Analytics: GA4 event | page_view | page_title {{Thundertix Page Title}}<br>page_location {{Thundertix Page URL}} | Thundertix Page View |
| Thundertix Scroll  | Google Analytics: GA4 event | scroll | page_title {{Thundertix Page Title}}<br>page_location {{Thundertix Page URL}} | Thundertix Scroll |
| Thundertix Purchase  | Google Analytics: GA4 event | ticket_purchase | page_title {{Thundertix Page Title}}<br>page_location {{Thundertix Page URL}}<br>value {{value}} | Ticket Purchase |

#### Your Website
- Install Google Tag Manager on your website.

Note that if you do use conversion tracking, you'll need to set up the "ticket_purchase" custom event in your main site's analytics. It shold be added as a custom definition, and marked as a conversion.
