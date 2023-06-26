import { ElementBuilder, ParentChildBuilder } from "./recipeBuilder.js";

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

function appendRecipe(recipe, element) {
  new ElementBuilder("article").id(recipe.recipeID)
    .append(new ElementBuilder("h1").text(recipe.name))
    //.append(new ParagraphBuilder().childClass("stone").items(recipe.stone))
    .append(new ElementBuilder("h2").pluralizedText("Ingredient", ""))
    .append(new ListBuilder("ul").list(recipe.ingredients))
    .append(new ElementBuilder("h2").pluralizedText("Instruction", ""))
    .append(new ListBuilder("ul").list(recipe.instructions))
    .append(new ElementBuilder("h2").text("Cuisine"))
    .append(new ParagraphBuilder().childClass("cuisine").text(recipe.cuisine))
    .appendTo(element);
}


function loadRecipes(application) {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    const mainElement = document.querySelector("main");

    while (mainElement.childElementCount > 0) {
      mainElement.firstChild.remove();
    }

    if (xhr.status === 200) {
      const recipes = JSON.parse(xhr.responseText);
      for (const recipe of recipes) {
        appendRecipe(recipe, mainElement)
      }
    } else {
      mainElement.append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  };

  const url = new URL("/recipes", location.href);
  /*if (application != undefined) {
    url.searchParams.set("application", application);
  }*/
  xhr.open("GET", url);
  xhr.send();
}

window.onload = function () {
  const xhr = new XMLHttpRequest();
  xhr.onload = function () {
    //const listElement = document.querySelector("nav.filter-nav > ul");

    if (xhr.status === 200) {
      const recipesRes = JSON.parse(xhr.responseText);
      //console.log(applications);
      loadRecipes();
      
    } else {
      document.querySelector("body").append(`Daten konnten nicht geladen werden, Status ${xhr.status} - ${xhr.statusText}`);
    }
  };
  xhr.open("GET", "/recipes");
  xhr.send();
};
