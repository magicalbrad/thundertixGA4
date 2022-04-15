<script>
  // Little function fo decode HTML entity codes.
  function decodeHTML(html) {
	  var txt = document.createElement('textarea');
	  txt.innerHTML = html;
	  return txt.value;
  };
  
  // Create event using item name scraped from page.
  // As I'm using the embed option that lists all performances, I'm considering the next page
  // where tickets are chosen to be the item page. That URL is "/orders/new" 
  // This logic *should* also work on the The event page, with URL format of"/events/(event id)"
  dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
  dataLayer.push({
    'event': 'view_item',
    'ecommerce': {
      'items': {
        'item_name': decodeHTML(document.querySelector("[itemprop='name']").innerHTML.replace(/(\r\n|\n|\r)/gm, "")) 
      }
    }
  });
</script>
