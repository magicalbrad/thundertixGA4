<script>
/*************************************************************
**  Parent Frame Custom HTML Tag for Thundertix GA4 tracking
**
** Based on Simo Ahava's Cookieless solution here:
** https://www.simoahava.com/analytics/cookieless-tracking-cross-site-iframes/
************************************************************/
(function() {
	var childOrigin = 'https://kellieshomesteadrestaurant.thundertix.com';

	var trackedEvents = {
		'iframe.gtm.js': 'page_view',
		'iframe.gtm.linkClick': 'click',
		'iframe.gtm.scrollDepth': 'scroll',
		'ticket_purchase': 'ticket_purchase'
	}

    function postCallback(e) {
      if (e.origin !== childOrigin) return;
      if (e.data !== 'childReady' && !e.data.event) return;

      if (e.data === 'childReady') {
        // Send event that parent is ready
        e.source.postMessage('parentReady', e.origin);
      }

	  if (e.data.event && e.data.event in trackedEvents) {
		  // Change iframe event name to desired event
		  e.data.event = trackedEvents[e.data.event];

		  // Override page location and title for event
		  e.data.page_location = e.data.event.iframe.pageData.url;
		  e.data.page_title = e.data.event.iframe.pageData.title;

		  // Push dataLayer message from iframe to dataLayer of parent
		  window.dataLayer.push(event.data);
      }
    };

    // Start listening for messages from child frame
    window.addEventListener('message', postCallback);
})();
</script>
