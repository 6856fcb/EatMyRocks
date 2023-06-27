import { getCookie, removeFromCart } from "./cart.js";
import { ElementBuilder } from "./builder.js";
import { ListBuilder, ParagraphBuilder } from "./shop.js";

window.onload = function () {

  const xhr = new XMLHttpRequest();
  const mainElement = document.querySelector("main");

  xhr.onload = function () {
    let products = JSON.parse(xhr.responseText)
    products.forEach(stone => appendStone(stone, mainElement))
  };

  const url = new URL("/shoppingcart", "http://localhost:3000")
  const token = getCookie('jwt')

  
  xhr.open("GET", url);
  xhr.setRequestHeader('Authorization', `Bearer ${token}`)
  xhr.send();
};


function appendStone(stone, element) {
  new ElementBuilder("article").id(stone.productID)
    .append(new ElementBuilder("img").with("src", stone.image))
    .append(new ElementBuilder("h1").text(stone.name))
    .append(new ParagraphBuilder().childClass("applications").items(stone.applications))
    .append(new ParagraphBuilder().childClass("tasteProfile").items(stone.tasteProfile))
    .append(new ParagraphBuilder().childClass("texture").items(stone.texture))
    .append(new ElementBuilder("p").text(stone.description))
    .append(new ElementBuilder("h2").pluralizedText("Nutritional Value", ""))
    .append(new ListBuilder("ul").list(stone.nutritionalValues))
    .append(new ElementBuilder("h3").text("Price: " + stone.price + "€"))
    .append(new ElementBuilder("button").listener("click", function(){removeFromCart(stone.productID)}).append(new ElementBuilder("i").text("Remove")))
    .appendTo(element);
  };