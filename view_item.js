<script>
  // Little function fo decode HTML entity codes.
  function decodeHTML(html) {
	  var txt = document.createElement('textarea');
	  txt.innerHTML = html;
	  return txt.value;
  };
  
  // Create event using item name scraped from page.
  // As I'm using the embed option that lists all performances, I'm considering the next page
  // where tickets are chosen to be the item page. The URL is "/orders/new" If you wish to use
  // the event page, "/events/{{event id}}," the logic to scrape the event name would need to be updated.
  dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
  dataLayer.push({
    'event': 'view_item',
    'ecommerce': {
      'items': {
        'item_name': decodeHTML(document.querySelector('.performance_name_orders_new').innerHTML)
      }
    }
  });
</script>
