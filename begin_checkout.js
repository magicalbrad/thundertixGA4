<script>
  // Scrape the item information off the cart page.
  // The DOM is different for mobile vs desktop layout, so code has to check.
  // Cart page has URL of either /orders or /cart (Why two URLs? Who knows!)
  var orderItems = document.querySelectorAll('.order-item');
  var itemDescriptionMobile = document.querySelectorAll('.item-description'); // Only exists on mobile
  var items = [];
  orderItems.forEach(function (orderItem, i) {
    var item = {};
    
    // ticket type, show name, and performance date are in a single element. 
    // This isn't pretty, but it's the best I can do with what I have.
    // Array element 0 = ticket type, 1 = show name, and 2 = date
    var itemDesc = orderItem.querySelector('td:nth-child(4)').innerText; // Will be empty on mobile
    if (itemDescriptionMobile.length > 0) { // Need to use the mobile version of the DOM
      itemDesc = itemDescriptionMobile[i].innerText;
    }
    var nameparts = itemDesc.split(/ : |Sunday,|Monday,|Tuesday,|Wednesday,|Thursday,|Friday,|Saturday,/);
    
	  item.item_name = nameparts[1].trim(); // Show Name
	  item.item_variant = nameparts[0].trim(); // Ticket type
	  item.price = parseFloat(orderItem.querySelector('td:nth-child(2) span').innerText.replace("$", ""), 10);
	  item.quantity = parseInt(orderItem.querySelector('td:nth-child(1)').innerText, 10);
    
	  items.push(item);
  });

  var value = parseFloat(document.querySelector('#order_total_value').innerText.replace(/(,|\$)/g, ""), 10);
  var orderId = document.querySelector('#order_id').value;
  
  // Push the event onto the dataLayer
  dataLayer.push({ ecommerce: null });  // Clear the previous ecommerce object.
  dataLayer.push({
    'event': 'begin_checkout',
    'ecommerce': {
      'transaction_id': orderId,
      'value': value,
      'currency': 'USD',
      'items': items
    }
  });
</script>
