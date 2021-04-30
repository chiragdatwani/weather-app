console.log("live");

//get element form the dom

const cityInput = document.querySelector(".search-city");
const searchForm = document.querySelector(".search-form");
const display = document.querySelector(".display");
const searchUL = document.querySelector(".search-list");
// API Key
const apiKey = "7ee53c6929dacc7f043f92a2e9fc4fc4";

//Event Listeners

searchForm.addEventListener("submit", function (e) {
  e.preventDefault();
  getWeather(cityInput.value);
});

cityInput.addEventListener("input", getCityList);

cityInput.addEventListener("click", function () {
  if (display.style.display != "none") {
    cityInput.value = "";
  }
});

//function to fetch weather update from the Open Weather Map api

async function getWeather(city) {
  const response = await fetch(
    `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`
  );
  console.log(response);
  const currentWeather = await response.json();
  console.log(currentWeather);
  searchUL.innerHTML = "";
  display.style.display = "block";

  display.innerHTML = `<div class="card weather-card" style="width: 200px;">

    <div class="city-name">
        <h4>${currentWeather.name}</h4>
    </div>
    

    <div class="temp"><h1>${Math.floor(
      currentWeather.main.temp - 273
    )}ºC</h1></div>
    <div style="min-height: 10px;"></div>
    <p class="desc">${currentWeather.weather[0].main}</p>
    <div class="other">
        <div class="min-max">
            <div class="max-temp"><p>Max: ${Math.floor(
              currentWeather.main.temp_max - 273
            )}ºC</p></div>
            <div class="min-temp"><p>Min: ${Math.floor(
              currentWeather.main.temp_min - 273
            )}ºC</p></div>
        </div>
        <div class="wind-humid">
            <div class="humidity"><p><i class="fa fa-tint"></i> ${
              currentWeather.main.humidity
            }</p></div>
            <div class="wind"><p><i class="fa fa-paper-plane"></i> ${
              currentWeather.wind.speed
            } km/hr</p></div>
        </div>    
    </div>
    </div>`;

  setTimeout(() => {
    if (window.speechSynthesis) {
      var speech = new SpeechSynthesisUtterance();
      speech.text = `It is currently ${Math.floor(
        currentWeather.main.temp - 273
      )} degree Celsius in ${currentWeather.name}`;
      window.speechSynthesis.speak(speech);
    }
  }, 700);
}

//To fetch cities from local json file and update the suggestion list, as the user types in the search bar

async function getCityList() {
  const response = await fetch("Assets/Cities/cities.json");
  const cityList = await response.json();

  updateCityList(cityList);
}

function updateCityList(arr) {
  display.style.display = "none";
  let regex = new RegExp(`^${cityInput.value}`, "i");

  const searchList = arr.filter((city) => regex.test(city.name));

  if (searchList.length > 7) {
    searchList.splice(7);
  }

  let html = searchList
    .map(
      (item) =>
        `<li class="list-group-item search-item" id ="${item.name}">${item.name}, ${item.country}</li>`
    )
    .join("");
  console.log(html);

  searchUL.innerHTML = html;

  selectCity();
}

//To get weather update of the city that the user selects from the suggestions list

function selectCity() {
  const cities = document.querySelectorAll(".search-item");

  cities.forEach((city) => {
    city.addEventListener("click", function (e) {
      cityInput.value = e.target.id;

      getWeather(e.target.id);
    });
  });
}
