import { ElementBuilder, ParentChildBuilder } from "./builder.js";
import { addToCart} from "./cart.js";

class ParagraphBuilder extends ParentChildBuilder {
  constructor() {
    super("p", "span");
  }
}

class ListBuilder extends ElementBuilder {
  constructor(tag) {
    super(tag);
  }
  appendElementToList(content){
    let li = new ElementBuilder("li").text(content)
    this.append(li)
    return this;
  }
  list(values){
    let li = Object.values(values)
    li.forEach(e => {
      this.appendElementToList(e)
    })
    return this;
  }
}

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
    .append(new ElementBuilder("button").append(new ElementBuilder("i").class("fa-solid").class("fa-cart-shopping")))
    .appendTo(element);}

}
    //addToCart(stone)
function loadStones(application) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const mainElement = document.querySelector("main");

    while (mainElement.childElementCount > 0) {
      mainElement.firstChild.remove();
    }

    if (xhr.status === 200) {
      const stones = JSON.parse(xhr.responseText);
      for (const stone of stones) {
        appendStone(stone, mainElement)
      }
    } else {
      mainElement.append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  };

  const url = new URL("/stones", location.href);
  if (application != undefined) {
    url.searchParams.set("application", application);
  }
  xhr.open("GET", url);
  xhr.send();
}

window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const listElement = document.querySelector("nav.filter-nav > ul");

    if (xhr.status === 200) {
      const applications = JSON.parse(xhr.responseText);

      const allButton = document.createElement("button");
      allButton.textContent = "All";
      allButton.addEventListener("click", function () {
        loadStones();
      });
      const allLi = document.createElement("li");
      allLi.appendChild(allButton);
      listElement.appendChild(allLi);

      for (let i = 0; i < applications.length; i++) {
        const applicationButton = document.createElement("button");
        applicationButton.textContent = applications[i];
        applicationButton.addEventListener("click", function () {
          loadStones(applications[i]);
        });
        const applicationLi = document.createElement("li");
        applicationLi.appendChild(applicationButton);
        listElement.appendChild(applicationLi);
      }

      const firstButton = document.querySelector("nav button");
      if (firstButton) {
        firstButton.click();
      }
    } else {
      document.querySelector("body").append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  };
  xhr.open("GET", "/applications");
  xhr.send();
};
