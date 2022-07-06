<script>
  // A little functtion to decode HTML entity codes.
  function decodeHTML(html) {
	  var txt = document.createElement('textarea');
	  txt.innerHTML = html;
	  return txt.value;
  };
  
  // Scrape the item information off the cart page.
  // Cart page has URL of either /orders or /cart (Why two URLs? Who knows!)
  var orderItems = document.querySelectorAll('.order-item');
  var items = [];
  orderItems.forEach(function (i) {
    var item = {};
    
    // ticket type, show name, and performance date are in a single element, separated by newlines. 
    // This isn't pretty, but it's the best I can do with what I have.
    // Array element 1 = ticket type, 3 = show name, and 4 = date
    var nameparts = i.querySelector('td:nth-child(4)').innerHTML.split(/\r?\n|\r/);
    
	  item.item_name = decodeHTML(nameparts[3]); // Show Name
    item.item_variant = decodeHTML(nameparts[1]); // Ticket type
	  item.price = parseFloat(i.querySelector('td:nth-child(2) span').innerHTML.replace(/(\r\n|\n|\r|\$)/gm, ""), 10);
	  item.quantity = parseInt(i.querySelector('td:nth-child(1)').innerHTML, 10);
    
	  items.push(item);
  });

  var value = parseFloat(document.querySelector('#order_total_value').innerHTML.replace(/\$/g, ""), 10);
  var orderId = document.querySelector('#order_id').value;
  
  // Push the event onto the dataLayer
  dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
  dataLayer.push({
    'event': 'view_cart',
    'ecommerce': {
      'transaction_id': orderId,
      'value': value, // Using unit price. Should this be line item total?
      'currency': 'USD',
      'items': items
    }
  });
</script>
