<script>
    /*************************************************************
     **  Child Frame Custom HTML Tag for Thundertix GA4 tracking
     **
     ** Based on Simo Ahava's Cookieless solution here:
     ** https://www.simoahava.com/analytics/cookieless-tracking-cross-site-iframes/
     ************************************************************/
    (function() {
        // If not in iframe, do nothing
        try {
            if (window.top === window.self) return;
        } catch (e) {}

        // By default, this will send messages to any parent window.
        // Change to your exact domain for increased security.
        // E.g. parentOrigin = 'https://www.mydomain.com';
        var parentOrigin = '*';

        // Prefix for iframe events.
        var dataLayerMessagePrefix = 'iframe';

        // Maximum time in milliseconds to poll the parent frame for ready signal
        var maxTime = 2000;

        // Don't touch anything that follows
        var pollInterval = 200;
        var parentReady = false;

        var postCallback = function(event) {
            if (event.origin !== parentOrigin) return;
            if (event.data !== 'parentReady') return;

            if (event.data === 'parentReady' && !parentReady) {
                window.clearInterval(poll);
                startDataLayerMessageCollection();
                parentReady = true;
            }
        };

        var pollCallback = function() {
            // If maximum time is reached, stop polling
            maxTime -= pollInterval;
            if (maxTime <= 0) window.clearInterval(poll);
            // Send message to parent that iframe is ready to retrieve Client ID
            window.top.postMessage('childReady', parentOrigin);
        };

        var createMessage = function(obj) {
            if (!Array.isArray(obj) && typeof obj === 'object') {
                var flattenObj = JSON.parse(JSON.stringify(obj));
                var message = {};
                // Add metadata about the page into the message
                message[dataLayerMessagePrefix] = {
                    pageData: {
                        url: document.location.href,
                        title: document.title
                    }
                };
                for (var prop in flattenObj) {
                    if (flattenObj.hasOwnProperty(prop) && prop !== 'gtm.uniqueEventId') {
                        if (prop === 'event') {
                            message.event = dataLayerMessagePrefix + '.' + flattenObj[prop];
                        } else {
                            message[dataLayerMessagePrefix][prop] = flattenObj[prop];
                        }
                    }
                }
                if (!message.event) message.event = dataLayerMessagePrefix + '.Message';
                return message;
            }
            return false;
        };

        var startDataLayerMessageCollection = function() {
            // Send the current dataLayer content to top frame, flatten the object
            window.dataLayer.forEach(function(obj) {
                var message = createMessage(obj);
                if (message) window.top.postMessage(message, parentOrigin);
            });
            // Create the push listener for future messages
            var oldPush = window.dataLayer.push;
            window.dataLayer.push = function() {
                var states = [].slice.call(arguments, 0);
                states.forEach(function(arg) {
                    var message = createMessage(arg);
                    if (message) window.top.postMessage(message, parentOrigin);
                });
                return oldPush.apply(window.dataLayer, states);
            };
        };

        // Start polling the parent page with "childReady" message
        var poll = window.setInterval(pollCallback, pollInterval);

        // Start listening for messages from the parent page
        window.addEventListener('message', postCallback);
    })();
</script>
