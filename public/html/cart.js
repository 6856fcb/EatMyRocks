
// CART:

export function addToCart(productID) {
  const jwt = getCookie('jwt')
  fetch("/addProductToShoppingcart", {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify({
      item: productID
    })
  })
  .then(response => {
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      alert("Please log in");
    } else {
      alert("Item added to cart!");
    }
  });
}

export function removeFromCart(productID) {
  const jwt = getCookie('jwt');
  fetch("/removeProductFromShoppingcart", {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify({
      item: productID
    })
  })
  .then(response => {
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      alert("Please log in");
    } else {
      alert("Item removed from cart!");
      location.reload();
    }
  });
}


export function getCookie(name) {
  let cookieArr = document.cookie.split(";");

  for(let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");

    if(name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}