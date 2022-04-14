# Thundertix GA4 Google Analytics Tracking
Currently, it is difficult to track GA4 events in third party iframes, due to cross browser cookie blocking. This makes it difficult to track events from embedded Thundertix ticketing windows. This is a sample implementation of a way to get GA4 working through Google Tag manager using JavaScript postMessage for cross-origin communication.

I don't know whether this will actually be of use to anyone. I thought I'd share it as it took a bit of trial and error for me to get it working, so maybe this will save someone else a few headaches. For now, I won't put a lot of detail, as I don't know how useful to anyone else. I can more details later, if there is sufficient interest.

## Credit
This is an implementation of Simo Ahava's Cookieless tracking solution applied to tracking for embeded Thundertix ticketing iframes.

Details of Simo Ahava's implementation can be found [here.](https://www.simoahava.com/analytics/cookieless-tracking-cross-site-iframes/)

## Overview
Briefly, the problem is that for security reasons, browsers are blocking cookies from third party iframes. This blocking prevents analytics from working in some situations including for embedded Thundertix ticketing frame on your website. (See Simo Ahava's post above for more details of the issue.)

This solution gets around that by having the child frame pass the event information to the parent window to be recorded. The basic flow is something like this:

- Google Tag Manager triggers events on the embedded Thundertix page.
- A custom Google Tag Manager tag on the Thundrtix page sends a copy of each event to the parent window.
- A custom Google Tag Manager tag on the main window listens for these messages, records the events in the parent window.
- Custom Tag Manager GA4 events are triggered, sending the data to the parent window's Google Analytics account. 

This means the analytics from the Thundertix events will appear in your main site's analytics account. 

## Implementation
### Thundertix Child Frame Setup
#### Google Tag Manager
- Create a Google Tag Manager account for Thundertix, if you don't already have one.
- Create a "Custom HTML Tag" in Tag Manager, using the script in the [child_frame.js file.](https://github.com/magicalbrad/thundertixGA4/blob/main/child_frame.js) It should be triggerred on all pages. There are some configuration options in the file. See the comments in the file for more info.
#### Thundertix Admin
- In the "Integrations & Pixel Tracking" area of the Thundertix admin, add your Google Tag Manager account ID.
- Also in the In the "Integrations & Pixel Tracking" area, add the code from [conversion.js](https://github.com/magicalbrad/thundertixGA4/blob/main/conversion.js) to "Conversion and Click Tracking," if you witch to track conversions. (You may need to contact their support to get that added.) 

### Parent Window (a.k.a. your site where the Thindertix frame is used)
#### Google Tag Manager
- Create a Google Tag Manager account for your site, if you don't already have one.
- Create a "Google Analytics: GA4 Configuration Tag" in Tag Manager, configured for your website's GA4 account.
- Create a "Custom HTML Tag" in Tag Manager, using the script in [parent_frame.js file.](https://github.com/magicalbrad/thundertixGA4/blob/main/parent_frame.js) There are some configuration options in the file. See the comments in the file for more info. This tag only needs to be triggered on pages that have a Thundertix iframe.
- Create the following Tag Manager Variables: (Value is only required of you are implementing conversion tracking.)

| Name | Variable Type | Variable Name |
|---|---|---|
| Thundertix Page Title  | Data Layer Variable | iframe.pageData.title |
| Thundertix Page URL  | Data Layer Variable | iframe.pageData.url |
| value | Data Layer Variable | iframe.value |

- Create the any of the following triggers for events you wish to track:

| Name | Trigger Type | Event Name | Trigger Fires on |
|---|---|---|---|
| Thundertix Link Click  | Data Layer Variable | iframe.gtm.linkClick | All Custom Events |
| Thundertix Page View  | Data Layer Variable | iframe.gtm.js | All Custom Events |
| Thundertix Scroll  | Data Layer Variable | iframe.gtm.scrollDepth | All Custom Events | 
| Thundertix Purchase  | Data Layer Variable | iframe.ticket_purchase | All Custom Events |

- Create the any of the following tags you for events you wish to track:<br>Note, all of these examples use the standard GA4 events except for the custom event "ticket_purchase." At this time, Thundertix does not provide sufficient data to support using the standard GA4 purchase event. Of course, you can choose to use custom events for any or all of the events. Any custom events must be configured in Google Analytics as "Custom Definitions," and you will likely want to mark the ticket_purchase custom event as a conversion. 

{% raw %}
| Name | Tag Type | Event Name | Event Parameters | Triggering |
|---|---|---|---|---|
| Thundertix Click  | GA4 event | click | page_title {{Thundertix Page Title}}<br>page_location {{Thundertix Page URL}} | Thundertix Link Click |
| Thundertix Page View  | GA4 event | page_view | page_title {{Thundertix Page Title}}<br>page_location {{Thundertix Page URL}} | Thundertix Page View |
| Thundertix Scroll  | GA4 event | scroll | page_title {{Thundertix Page Title}}<br>page_location {{Thundertix Page URL}} | Thundertix Scroll |
| Thundertix Purchase  | GA4 event | ticket_purchase | page_title {{Thundertix Page Title}}<br>page_location {{Thundertix Page URL}}<br>value {{value}}<br>currency USD | Ticket Purchase |
{% endraw %}

#### Your Website
- Install Google Tag Manager on your website.

Note that if you do use conversion tracking, you'll need to set up the "ticket_purchase" custom event in your main site's Google Analytics account. It should be added as a custom definition, and marked as a conversion.

## Really Ugly Ecommerce Implementation Experiment

Thundertix doesn't support GA4 ecommerce. This is my attempt to make it work anyway. It scrapes the necessary data off the page, which is a fragile hack that will break if they make even minor changes to the ticketing pages. 

As your needs may be diferent than mine, you should probably consider this as an example reference implementation, rather than a plug-and-play solution. Also be aware it could stop working at any time. 

Here's my approach. I am considering the show name to be the item name, and the ticket type to be the item variant. I am ignoring the date. 

I am triggerring a view_item event with a minimal ecommerce object with an item array containing just the show name displayed on that page. As I am using the "list of performances" embed, I am considering the next page, where the tickets are selected, to be the item page. If you are usng the normal event embed, the same approach should work for the event page.

The view_cart event is triggerred on the page where the payemt info is entered. (For some reason, there are two URLs for this page, /orders and /cart.) This creates a full ecommerce object. 

The custom "ticket_purchase" event is used to trigger the ecommerce purchase. Thundertix does not supply enough information to create the required ecommerce object, but the ecommerce object from the view_cart event still exists and can be used instead. I do use the Thundertix provided value passed from the custom event, as I expect that to be more reliable than my scraped value from the cart page.

### Thundertix Child Frame Setup

#### Google Tag Manager
- Create a "Custom HTML Tag" for item views in Tag Manager, using the script in the [view_item.js file.](https://github.com/magicalbrad/thundertixGA4/blob/main/view_item.js) It should be triggerred only on the item page. For my purposes, that is /orders/new. Depending on which embed code you're using, you may need to triger on pages with a URL like /events/(event id). 
- Create a "Custom HTML Tag" for cart views in Tag Manager, using the script in the [view_cart.js file.](https://github.com/magicalbrad/thundertixGA4/blob/main/view_cart.js) It should be triggerred on the cart page, which has a URL of either /orders/new or /cart, depending on whether the user is coming to it for the first time, or returning later.

### Parent Window (a.k.a. your site)

#### Google Tag Manager

- Create the following Tag Manager Variables:

| Name | Variable Type | Variable Name |
|---|---|---|
| Ecommerce Currency | Data Layer Variable | iframe.ecommerce.currency |
| Ecommerce Items | Data Layer Variable | iframe.ecommerce.items |
| Ecommerce Transaction ID | Data Layer Variable | iframe.ecommerce.transaction_id |
| Ecommerce Value | Data Layer Variable | iframe.ecommerce.value |


- Create the following triggers:

| Name | Trigger Type | Event Name | Trigger Fires on |
|---|---|---|---|
| Thundertix View Cart  | Data Layer Variable | iframe.view_cart | All Custom Events |
| Thundertix View Item  | Data Layer Variable | iframe.view_item | All Custom Events |

- Create the following tags.

{% raw %}
| Name | Tag Type | Event Name | Event Parameters | Triggering |
|---|---|---|---|---|
| Purchase  | GA4 event | Ticket Purchase | page_title {{Thundertix Page Title}}<br>page_location {{Thundertix Page URL}}<br>value {{Value}}<br>currency {{Ecommerce Currency}}<br>transaction_id {{Ecommerce Transaction ID}}<br>items {{Ecommerce Items}} | Ticket Purchase |
| Thundertix View Cart | GA4 event | page_view | page_title {{Thundertix Page Title}}<br>page_location {{Thundertix Page URL}}<br>value {{Value}}<br>currency {{Ecommerce Currency}}<br>items {{Ecommerce Items}} | Thundertix View Cart |
| Thundertix View Item  | GA4 event | scroll | page_title {{Thundertix Page Title}}<br>page_location {{Thundertix Page URL}}<br>items {{Ecommerce Items}} | Thundertix View Item |
{% raw %}
