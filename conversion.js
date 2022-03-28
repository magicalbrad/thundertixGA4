// Code to record custom event for a ticket purchase.
//
//  Note: Thundertix does not provide enough information
//        to create a standard GA4 purchase event, so a
//        custom event is fired instead.
<script>
window.dataLayer = window.dataLayer || [];
dataLayer.push({
  event: 'ticket_purchase',
  value: {{ORDER_TOTAL}}
});
</script>
