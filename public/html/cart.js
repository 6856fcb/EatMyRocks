
// CART:

function updateCart(newCart) {
  cart = newCart;
}

export function addToCart(product) {
  const jwt = getCookie('jwt');
  console.log("add " + product.productID)
  fetch("/addProduct", {
    method: "PUT",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify({
      product: product
    })
  })
  .then(response => {
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      alert("Please log in");
    } else {
      alert("Item added to cart!");
      loadCart();
    }
  });
}

function removeFromCart(productID) {
  const jwt = getCookie('jwt');
  console.log("remove " + productID)
  fetch("/removeProduct", {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    },
    body: JSON.stringify({
      productID: productID
    })
  })
  .then(response => {
    if (response.status === 401 || response.status === 403 || response.status === 404) {
      alert("Please log in");
    } else {
      alert("Item removed from cart!");
      loadCart();
    }
  });
}

export function loadCart() {
  const jwt = getCookie('jwt');
  fetch('/shoppingcart', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${jwt}`
    }
  })
  .then(response => {
    if (response.status === 401 || response.status === 403|| response.status === 404) {
      alert("Please log in");
    } else {
      return response.json();
    }
  })
  .then(data => displayCart(data))
}

function displayCart(cart) {
  loadStones(cart)
}


function getCookie(name) {
  let cookieArr = document.cookie.split(";");

  for(let i = 0; i < cookieArr.length; i++) {
    let cookiePair = cookieArr[i].split("=");

    if(name == cookiePair[0].trim()) {
      return decodeURIComponent(cookiePair[1]);
    }
  }

  return null;
}


function countProducts(cart, productID) {
  let count = 0;
  for (const product of cart) {
    if (product.productID === productID) {
      count++;
    }
  }
  return count;
}

function appendStone(stone, element, cart) {
  let article = document.createElement("article");
  article.id = stone.productID;

  let img = document.createElement("img");
  img.src = stone.image;
  article.appendChild(img);

  let h1 = document.createElement("h1");
  h1.textContent = stone.name;
  article.appendChild(h1);

  let h3 = document.createElement("h3");
  let count = countProducts(cart, stone.productID);
  h3.textContent = "Price: " + (stone.price * count) + "€";
  article.appendChild(h3);

  let p = document.createElement("p");
  p.textContent = "Quantity: " + count;
  article.appendChild(p);

  let buttonAdd = document.createElement("button");
  buttonAdd.textContent = "+";
  buttonAdd.onclick = function () {
    addToCart(stone);
    loadCart();
  };
  article.appendChild(buttonAdd);

  let buttonRemove = document.createElement("button");
  buttonRemove.textContent = "-";
  buttonRemove.onclick = function () {
    removeFromCart(stone.productID);
    loadCart();
  };
  article.appendChild(buttonRemove);

  element.appendChild(article);
}

function loadStones(cart) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const mainElement = document.querySelector("main");

    while (mainElement.childElementCount > 0) {
      mainElement.firstChild.remove();
    }

    if (xhr.status === 200) {
      const stones = JSON.parse(xhr.responseText);
      for (const stone of stones) {
        if (cart.some(function (product) { return product.productID === stone.productID; })) {
          appendStone(stone, mainElement);
        }
      }
    } else {
      mainElement.append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  };
}

async function getCity() {
  // Get the IP address
  const ipResponse = await fetch('https://api.ipify.org');
  const ipAddress = await ipResponse.text();

  // Get the location data
  const locationResponse = await fetch(`https://ip-db.io/api/${ipAddress}`);
  const locationData = await locationResponse.json();

  // Print the city to the console
  return locationData.city
}
