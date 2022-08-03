<script>
  // Create event using item name scraped from page.
  // As I'm using the embed option that lists all performances, I'm considering the next page
  // where tickets are chosen to be the item page. That URL is "/orders/new" 
  // This logic *should* also work on the The event page, with URL format of"/events/(event id)"
  dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
  dataLayer.push({
    'event': 'view_item',
    'currency': 'USD',
    'value': parseFloat(document.querySelector("[itemprop='price']").innerText.replace("$", ""), 10),
    'ecommerce': {
      'items': [{
        'item_name': document.querySelector("[itemprop='name']").innerText 
      }]
    }
  });
</script>
