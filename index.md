**08/10/2022: Updated with simplified approach**

# Thundertix GA4 Google Analytics Tracking
Thundertix is an event ticketing service. They promote easy Google Analytics integration as a feature, but in reality it's not so simple.

First, their built in integration only supports the older, soon to be discontinued "UA" version of Google Analytics. 

Second, their implementation only works when visitors purchase tickets directly from the Thundertix website. At least in most modern browsers, it won't work if you are selling tickets from your website by embedding their page in an iframe.

Finally, they don't support ecommerce in analytics, which is arguably the most important data.

This represents my attempt to work around those limitations and get Google Analytics 4 implemented and working, including ecommerce.

## Overview
The first hurdle is that for security reasons, browsers are blocking cookies from third party iframes. This blocking prevents analytics from working in some situations including embedded Thundertix ticketing iframe on your website.

A workaround was developed by Simo Ahava. Details of Simo Ahava's implementation can be found [here.](https://www.simoahava.com/analytics/cookieless-tracking-cross-site-iframes/) I have implementd his solution specifically to work through Tag Manager for Thundertix embeds.

Instead of reporting events directly to Google Analytics, the Thundertix events will be sent to your website which can then report it to Analytics.  

- Google Tag Manager triggers events on the embedded Thundertix page.

- A custom Google Tag Manager tag on the Thundrtix page sends a copy of each event to the parent window.

- A custom Google Tag Manager tag on the main window listens for these messages, records the events in the parent window.

- Custom Tag Manager GA4 events are triggered, sending the data to the parent window's Google Analytics account. 

This means the analytics from the Thundertix events will appear in your main site's analytics account. 

## Implementation
Note: this is just the basic implementation. Ecommerce is more complicated, and will be discussed later in this document. This section will set up communication between the Thundertix iframe and your website, and will allow tracking of page views. If desired, viewing the "Thank You" page can be set up as a GA4 conversion.

### Thundertix Child Frame Setup
#### Google Tag Manager
- Create a separate [Google Tag Manager](https://tagmanager.google.com/) account for use on Thundertix, if you don't already have one.

- Create a "Custom HTML Tag" in Tag Manager, using the script in the [child_frame.js file.](https://github.com/magicalbrad/thundertixGA4/blob/main/child_frame.js) It should be triggered on all pages. There are some optional configuration options in the file. See the comments in the file for more info. 

<details style="cursor: pointer;margin-bottom: 1.5em">
  <summary>Example Image</summary>
  
 <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag-sent-to-parent.png"><img alt="Tag: Send to Parent" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag-sent-to-parent.png"></a>

</details>


#### Thundertix Admin
- In the "Integrations & Pixel Tracking" area of the Thundertix admin, add your Google Tag Manager account ID.

### Parent Window (a.k.a. your site where the Thundertix frame is used)
#### Google Tag Manager
- Create a [Google Tag Manager](https://tagmanager.google.com/) account and implement it on your site, if you don't already have it set up.

- Create a "Google Analytics: GA4 Configuration Tag" in Tag Manager, configured for your website's GA4 account, if you don't already have one set up.

<details style="cursor: pointer;margin-bottom: 1.5em">
  <summary>Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag-ga4.png"><img alt="Tag: GA4" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag-ga4.png"></a>
  
</details>


- Create a "Custom HTML Tag" in Tag Manager, using the script in [parent_frame.js file.](https://github.com/magicalbrad/thundertixGA4/blob/main/parent_frame.js) There is an optional configuration option in the file. See the comments in the file for more info. This tag should only be triggered on pages of your site that have a Thundertix iframe embed.

<details style="cursor: pointer;margin-bottom: 1.5em">
  <summary>Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag_parent_logic.png"><img alt="Tag: Parent Logic" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag_parent_logic.png"></a>

</details>


- Create the following Tag Manager Variables:

| Name | Variable Type | Variable Name |
|---|---|---|
| Thundertix Page Title  | Data Layer Variable | iframe.pageData.title |
| Thundertix Page URL  | Data Layer Variable | iframe.pageData.url |

<details style="cursor: pointer;">
  <summary>Thundertix Page Title Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_page_title.png"><img alt="Tag: Thundertix Page Title" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_page_title.png"></a>

</details>

<details style="cursor: pointer;margin-bottom: 1.5em">
  <summary>Thundertix Page URL Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_page_url.png"><img alt="Tag: Thundertix Page URL" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_page_url.png"></a>

</details>


- Create the following trigger:

| Name | Trigger Type | Event Name | Trigger Fires on |
|---|---|---|---|
| Thundertix Page View | Custom Event | iframe.gtm.js | All Custom Events |

<details style="cursor: pointer;margin-bottom: 1.5em">
  <summary>Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/trigger_page_view.png"><img alt="Trigger: Thundertix Page View" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/trigger_page_view.png"></a>

</details>


- Create the following tag:

{% raw %}
| Name | Tag Type | Event Name | Event Parameters | Triggering |
|---|---|---|---|---|
| Thundertix Page View  | GA4 event | page_view | page_title:<br>{{Thundertix Page Title}}<br><br>page_location:<br>{{Thundertix Page URL}} | Thundertix Page View |

{% endraw %}

<details style="cursor: pointer;margin-bottom: 1.5em">
  <summary>Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag_page_view.png"><img alt="Tag: Page View" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag_page_view.png"></a>

</details>


#### Your Website
- Install Google Tag Manager on your website.

#### Notes and Additional Options
You can set up customers viewing the "Thank You" page to be a conversion in Analytics. You'd need to create a custom event in Analytics, named something like "thank_you_page_view." That event will use the following matching conditions:

- event_name equals page_view

- page_location contains thank_you

You'll then need to mark this new event as a conversion.

If you wish to track more events, you can manually add them to the data layer. You also could install GA4 on the Thundertix page through tag manager. All GA4 events would be pased up to your page. In either case, you'd also need to add tags in your main website's tag manager to monitor for those events and trigger the appropriate GA4 event on your site.

## Ecommerce Implementation

Thundertix doesn't support GA4 ecommerce. This is my attempt to make it work anyway. It scrapes the necessary data off the page, which is a fragile hack that will break if they make even minor changes to the ticketing pages. 

As your needs may be different than mine, you should probably consider this as an example reference implementation, rather than a plug-and-play solution. Also be aware it could stop working at any time if Thundertix changes anything on their ticketing pages.

### Ecommerce Approach
There are a number of decisions to be made in setting up ecommerce. Among them are: 

- What are we considering an "item?" The show? The performance? The ticket?

- Which ecommerce events are worth tracking?

- How do we map Thundertix's checkout flow to what Google expects for?

Your decisions may be different than mine. If so, this won't be a "plug and play" solution, and may require tweaking to meet your needs. 

I decided to consider the show to be the item. The ticket type isbeing used as the item variant--though that field doesn't apper to be exposed n Google Analytics in any meangful way. I am ignoring the performance date and time for the sake of ecommerce tracking. 

Given that each action tracked requires manual setup and may require ongoing maintenence to keep working, I am minimizing the events I track. Purchase is obviously the critical event. I'm also tracking item views. (I'm also trigering an add_payment_info event. I don't care about this event per se, but I need to fire an event at that point to gather the necessary data for ecommerce to work.)

I am considering the page where ticket quantities are selected, "/orders/new?performance_id=XXXXXXXX," to be the "item page." This is the first page in the purchasing flow that displays a price.  

The add_payment_info event is triggered on the cart page when it is payment is submitted. There are two URLs used for the cart, /orders and /new. This tag creates a full ecommerce object based on what was in the cart at the time payment was attempted. (I actually don't bother tracking this event, as I'm only triggering this to get the ecommerce object. However, you could track it if you wish.)

A purchase event is triggered when the "Thank You" page is viewed. There isn't sufficient information on this page to create an ecommerce object. However, the ecommerce object created for the add_payment_info trigger still exists and will be used instead.

### Thundertix Child Frame Setup

#### Google Tag Manager
- Create the following triggers:

| Name | Trigger Type | Trigger Fires on |
|---|---|---|
| View Item | Page View - Window Loaded |  Some Window Loaded Events: Page Path equals /orders/new |
| Purchase Form Submit | Form Submission | Wait for Tags: 1000 ms <br><br> Form ID equals purchase_order_form <br><br> All Forms | 

<details style="cursor: pointer;">
  <summary>View Item Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/trigger_view_item.png"><img alt="Trigger: View Item" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/trigger_view_item.png"></a>

</details>

<details style="cursor: pointer;margin-bottom: 1.5em">
  <summary>Purchase Form Submit Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/trigger_purchase_form_submit.png"><img alt="Trigger: Purchase Form Submit" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/trigger_purchase_form_submit.png"></a>

</details>

- Create the following tags:

| Name | Tag Type | HTML | Triggering |
|---|---|---|---|
| View Item  | Custom HTML | Contents of [view_item.js file](https://github.com/magicalbrad/thundertixGA4/blob/main/view_item.js) | View Item |
| Add Payment Info  | Custom HTML | Contents of [add_payment_info.js file](https://github.com/magicalbrad/thundertixGA4/blob/main/add_payment_info.js) | Purchase Form Submit |

<details style="cursor: pointer;">
  <summary>View Item Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag_view_item.png"><img alt="Tag: View Item" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag_view_item.png"></a>

</details>

<details style="cursor: pointer;margin-bottom: 1.5em">
  <summary>Add Payment Info Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag_add_payment_info.png"><img alt="Tag: Add Payment Info" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag_add_payment_info.png"></a>

</details>

### Parent Window (a.k.a. your site)

#### Google Tag Manager

- Create the following additional Tag Manager Variables:

(This assumes the Thundertix Page Title and URL variables from earlier on this page have already been created.)

| Name | Variable Type | Variable Name |
|---|---|---|
| Currency | Data Layer Variable | iframe.currency |
| Ecommerce Currency | Data Layer Variable | iframe.ecommerce.currency |
| Ecommerce Items | Data Layer Variable | iframe.ecommerce.items |
| Ecommerce Transaction ID | Data Layer Variable | iframe.ecommerce.transaction_id |
| Ecommerce Value | Data Layer Variable | iframe.ecommerce.value |
| Value | Data Layer Variable | iframe.value |

<details style="cursor: pointer;">
  <summary>Currency Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_currency.png"><img alt="Variable: Currency" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_currency.png"></a>

</details>

<details style="cursor: pointer;">
  <summary>Ecommerce Currency Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_ecommerce_currency.png"><img alt="Variable: Ecommerce Currency" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_ecommerce_currency.png"></a>

</details>

<details style="cursor: pointer;">
  <summary>Ecommerce Items Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_ecommerce_items.png"><img alt="Variable: Ecommerce Items" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_ecommerce_items.png"></a>

</details>

<details style="cursor: pointer;">
  <summary>Ecommerce Transaction ID Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_ecommerce_transaction_id.png"><img alt="Variable: Ecommerce Transaction ID" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_ecommerce_transaction_id.png"></a>

</details>

<details style="cursor: pointer;">
  <summary>Ecommerce Value Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_ecommerce_value.png"><img alt="Variable: Ecommerce Value" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_ecommerce_value.png"></a>

</details>

<details style="cursor: pointer;margin-bottom: 1.5em">
  <summary>Value Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_value.png"><img alt="Variable: Value" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/var_value.png"></a>

</details>

- Create the following triggers:

| Name | Trigger Type | Event Name | Trigger Fires on |
|---|---|---|---|
| Thundertix Thank You Page View  | Custom Event | iframe.gtm.js | Some Custom Events: Thundertix Page URL contains thank_you |
| Thundertix View Item  | Data Layer Variable | iframe.view_item | All Custom Events |

<details style="cursor: pointer;">
  <summary>Thundertix Thank You Page View Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/trigger_thank_you.png"><img alt="Trigger: Thundertix Thank You Page View" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/trigger_thank_you.png"></a>

</details>

<details style="cursor: pointer;margin-bottom: 1.5em">
  <summary>Thundertix View Item Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/trigger_thundertix_view_item.png"><img alt="Trigger: Thundertix View Item" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/trigger_thundertix_view_item.png"></a>

</details>

- Create the following tags.

{% raw %}
| Name | Tag Type | Event Name | Event Parameters | Triggering |
|---|---|---|---|---|
| Purchase  | GA4 event | purchase | page_title:<br>{{Thundertix Page Title}}<br><br>page_location:<br>{{Thundertix Page URL}}<br>value:<br>{{Ecommerce Value}}<br><br>currency:<br>{{Ecommerce Currency}}<br><br>transaction_id:<br>{{Ecommerce Transaction ID}}<br><br>items:<br>{{Ecommerce Items}} | Thundertix Thank You Page View |
| Thundertix View Item  | GA4 event | view_item | page_title:<br>{{Thundertix Page Title}}<br><br>page_location:<br>{{Thundertix Page URL}}<br><br>value:<br>{{Value}}<br><br>currency:<br>{{Currency}}<br><br>items:<br>{{Ecommerce Items}} | Thundertix View Item |

{% endraw %}
<details style="cursor: pointer;">
  <summary>Purchase Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag_purchase.png"><img alt="Tag: Purchase" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag_purchase.png"></a>

</details>

<details style="cursor: pointer;margin-bottom: 1.5em">
  <summary>Thundertix View Item Example Image</summary>
  
   <a href="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag_thundertix_view_item.png"><img alt="Tag: Thundertix View Item" src="https://github.com/magicalbrad/thundertixGA4/raw/main/docs/assets/images/tag_thundertix_view_item.png"></a>

</details>

## Notes
You can add tags to track additional ecommerce events. For example, you can find sample code for an HTML tag to trigger a begin_checkout event when the cart is viewed [here.](https://github.com/magicalbrad/thundertixGA4/blob/main/begin_checkout.js) (It is basically just a clone of the add payment info code with a different event.) It would need to be triggered on page load of the cart page.

Using custom Javascript variables in Tag Manager would have simplified some aspects of this implementation. However this was not possible, as Thundertix's Content Seciurity Policy prevents custom Javascript variables from working. (I can't really fault them for having a strong CSP. It's good that they seem to take security seriously. However, it does lead to further complexity in working around their shortcommings related to analytics integration.)
