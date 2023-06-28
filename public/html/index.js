async function addCityListItem() {
    console.log("here");

    const ipResponse = await fetch("https://api.ipify.org%27/");
    const ipAddress = await ipResponse.text();

    const locationResponse = await fetch("https://ip-db.io/api/"+`${ipAddress}`);
    const locationData = await locationResponse.json();

    if (locationData && locationData.city) {
      let city = locationData.city;

      let shoppingCart = document.querySelector('.footer-right ul li:last-child');
      let newItem = document.createElement('li');
      newItem.textContent = "Your location: " + city;
      shoppingCart.parentNode.insertBefore(newItem, shoppingCart.nextSibling);
    }

    const weatherResponse = await fetch("http://api.weatherapi.com/v1/current.json?key=e3017a61d4a6488590994235232806&q=${locationData.latitude},${locationData.longitude}&aqi=no");
    const weatherData = await weatherResponse.json();

    if (weatherData && weatherData.current && weatherData.current.condition && weatherData.current.condition.text) {
      let weather = weatherData.current.condition.text;
      let Location = document.querySelector('.footer-right ul li:last-child');
      let nextItem = document.createElement('li');
      nextItem.textContent = "Weather: " + weather;
      Location.parentNode.insertBefore(nextItem, Location.nextSibling);
    }
  }

  addCityListItem();