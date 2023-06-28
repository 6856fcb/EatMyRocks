
// CART:

export async function addToCart(productID) {
  const jwt = getCookie('jwt')
  await fetch("/addProductToShoppingcart", {
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

export async function removeFromCart(productID) {
  const jwt = getCookie('jwt');
  await fetch("/removeProductFromShoppingcart", {
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
      removeElementFromDOM(productID);
    }
  });
}

function removeElementFromDOM(productID) {
  const element = document.getElementById(productID);
  if (element) {
    element.remove();
  }
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