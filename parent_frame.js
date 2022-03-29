<script>
/*************************************************************
**  Parent Frame Custom HTML Tag for Thundertix GA4 tracking
**
** Accepts events from child and puses them to its own dataLayer.
** Triggers & tags must be configured in Tag Manager to create
** GA4 events.
**
** Based on Simo Ahava's Cookieless GA4 solution here:
** https://www.simoahava.com/analytics/cookieless-tracking-cross-site-iframes/
************************************************************/
(function() {
	// By default, this will accept messages from any thundertix.com child frame.
	// Change to your exact domain for increased security.
	// E.g. childOrigin = 'https://mysubdomain.thundertix.com';
	var childOrigin = 'thundertix.com$';

    function postCallback(e) {
      if (!e.origin.match(childOrigin)) return;
      if (e.data !== 'childReady' && !e.data.event) return;

      if (e.data === 'childReady') {
        // Send event that parent is ready
        e.source.postMessage('parentReady', e.origin);
      }

	  if (e.data.event) {
		  // Override page location and title for event
		  e.data.page_location = e.data.iframe.pageData.url;
		  e.data.page_title = e.data.iframe.pageData.title;

		  // Push message from iframe to dataLayer of parent
		  window.dataLayer.push(e.data);
      }
    }

    // Start listening for messages from child frame
    window.addEventListener('message', postCallback);
})();
</script>
