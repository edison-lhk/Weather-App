// Current Weather Section
const preloader = document.querySelector('.preloader');
const openMenuBtn = document.querySelector('button.location-search-btn');
const currentLocationBtn = document.querySelector('.location-bar > .material-icons');
const currentWeatherIcon = document.querySelector('canvas#current-weather-icon');
const currentTemp = document.querySelector('.temperature-degrees');
const currentFeelsLikeTemp = document.querySelector('.feels-like-temperature');
const currentTempDescription = document.querySelector('.current-weather-section .temperature-description')
const currentDate = document.querySelector('.current-date')
const currentLocation = document.querySelector('.current-location');

// Search Menu Section
const searchMenu = document.querySelector('.search-menu-container');
const closeMenuBtn = document.querySelector('.close-menu-btn');
const locationSearchBar = document.querySelector('input#location-search');
const searchSubmitBtn = document.querySelector('button.submit-search');
const searchSuggestionsContainer = document.querySelector('.search-location-suggestions-container');
const searchSuggestionsDisplay = Array.from(document.querySelectorAll('.search-location-suggestions'));

// One Week Forecast Weather Section
const forecastBoxes = Array.from(document.querySelectorAll('.forecast-box'));
const forecastBoxesDate = Array.from(document.querySelectorAll('.forecast-box > .date'));
const forecastBoxesIcon = Array.from(document.querySelectorAll('.forecast-box > #forecast-weather-icon'));
const forecastBoxesHighestTemp = Array.from(document.querySelectorAll('.highest-temperature > .temperature-degrees'));
const forecastBoxesLowestTemp = Array.from(document.querySelectorAll('.lowest-temperature > .temperature-degrees'));

// Current Weather Highlights Section 
const windStatusBoxValue = document.querySelector('.wind-status-value');
const windStatusBoxDirectionValue = document.querySelector('.wind-direction-value');
const humidityBoxValue = document.querySelector('.humidity-value');
const humidityBoxPercentageBar = document.querySelector('.percentage-value');
const visibilityBoxValue = document.querySelector('.visibility-value');
const airPressureBoxValue = document.querySelector('.air-pressure-value');

// Load user's location weather info every time user entered the page
window.addEventListener('load', function() {
    displayCurrentLocationWeather();
    closeLoadingPage();
});


// Display user's location weather info when user clicked on the current location button
currentLocationBtn.addEventListener('click', displayCurrentLocationWeather);


// Open and close search menu
openMenuBtn.addEventListener('click', () => {
    searchMenu.classList.add('active-menu');

    searchSuggestionsDisplay.forEach(box => {
        box.innerHTML = '';
        box.style.display = 'none';
    })
})

closeMenuBtn.addEventListener('click', () => {
    searchMenu.classList.remove('active-menu');
    locationSearchBar.value = '';
})

// Display search location suggestions when user type sth in the search bar
locationSearchBar.addEventListener('keyup', async function() {

    if (locationSearchBar.value != '') {
        searchSuggestionsDisplay.forEach(box => {
            box.innerHTML = '';
            box.style.display = 'none';
        })
        findLocationName(locationSearchBar.value);
    } else {
        searchSuggestionsDisplay.forEach(box => {
            box.innerHTML = '';
            box.style.display = 'none';
        });
    }

});

// Remove previous search location suggestions after user type more words
locationSearchBar.addEventListener('keydown', () => {
    searchSuggestionsDisplay.forEach(box => {
        box.innerHTML = '';
        box.style.display = 'none';
    })
})

// Display desired location weather info when user searched for a particular location
searchSubmitBtn.addEventListener('click', async function() {

    if (locationSearchBar.value != '') {
        let latitude;
        let longitude;
        [latitude, longitude] = await convertLocationNameToGeoCoordinates(locationSearchBar.value.trim());
        displayLocationWeather(latitude, longitude);
        locationSearchBar.value = '';
        setTimeout(() => {searchMenu.classList.remove('active-menu')}, 800);
    } else {
        return;
    }

});

// Output location search result when user clicked on a location recommedation box
searchSuggestionsDisplay.forEach(box => {
    box.addEventListener('click', async () => {
        locationSearchBar.value = box.firstChild.textContent;
        await updateLocationWeather(box.firstChild);
        setTimeout(() => {searchMenu.classList.remove('active-menu')}, 800);
        locationSearchBar.value = '';
    })
})

// Update location weather info every 30 secs
setInterval(async () => {await updateLocationWeather(currentLocation)}, 30000);

// Close the loading page after the current weather information has rendered
function closeLoadingPage() {

    setTimeout(() => {
        document.documentElement.style.scrollBehavior = "auto";
        window.scrollTo(0, 0);
        preloader.style.display = "none";
    }, 4000);

}

// Find all related city/country list based on search value
async function findLocationName(searchValue) {

    const geocodingAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=ec021a840e27b53a39dd9bb4563c0c3c`;

    const reponse = await fetch(geocodingAPI, {mode: 'cors'});

    const locationInfo = await reponse.json();

    for (let i = 0; i < locationInfo.length; i++) {

        locationValue = document.createElement('p');
        locationValue.style.cssText = 'font-size: 16px;';
        locationValue.textContent = `${locationInfo[i].name}, ${locationInfo[i].country}`;

        locationIcon = document.createElement('span');
        locationIcon.classList.add('material-icons');
        locationIcon.textContent = 'navigate_next';

        searchSuggestionsDisplay[i].appendChild(locationValue);
        searchSuggestionsDisplay[i].appendChild(locationIcon);
        searchSuggestionsDisplay[i].style.display = 'flex';
    }
}

// Convert the location user searched to Geographical Coordinates
async function convertLocationNameToGeoCoordinates(cityName, countryName) {

    const geocodingAPI = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryName}&limit=1&appid=ec021a840e27b53a39dd9bb4563c0c3c`;
    
    const reponse = await fetch(geocodingAPI, {mode: 'cors'});
    
    const locationInfo = await reponse.json();

    const geoCoordinates = [locationInfo[0].lat, locationInfo[0].lon];

    return geoCoordinates;

}

// Display the weather information for the respective location
async function displayLocationWeather(latitude, longitude) {

    const currentWeatherAPI = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=ec021a840e27b53a39dd9bb4563c0c3c&units=metric`;

    const currentWeatherInfoReponse = await fetch(currentWeatherAPI, {mode: 'cors'});
            
    const currentWeatherInfo = await currentWeatherInfoReponse.json();

    const oneCallAPI = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=ec021a840e27b53a39dd9bb4563c0c3c&units=metric`;

    const oneCallInfoReponse = await fetch(oneCallAPI, {mode: 'cors'});

    const oneCallInfo = await oneCallInfoReponse.json();

    console.log(currentWeatherInfo);

    // Display current weather information
            
    currentTemp.textContent = Math.round(currentWeatherInfo.main.temp);

    currentFeelsLikeTemp.textContent = Math.round(currentWeatherInfo.main.feels_like);

    currentTempDescription.textContent = currentWeatherInfo.weather[0].main;

    const currentGMTTimzone = new Date();

    currentDate.textContent = new Date(currentGMTTimzone.getTime() + oneCallInfo.timezone_offset * 1000).toUTCString().slice(0, 11);

    currentLocation.textContent = currentWeatherInfo.name + ', ' + currentWeatherInfo.sys.country;

    new Icon(currentWeatherIcon, currentWeatherInfo.weather[0].icon).setIcon();

    // Display 1 week forecast weather information

    for (let i = 0; i < forecastBoxes.length; i++) {
        forecastBoxesDate[i].textContent = new Date(currentGMTTimzone.getTime() + oneCallInfo.timezone_offset * 1000 + (i + 1) * 1000 * 60 * 60 *24).toUTCString().slice(0, 11);
        new Icon(forecastBoxesIcon[i], oneCallInfo.daily[i + 1].weather[0].icon).setIcon();
        forecastBoxesHighestTemp[i].textContent = Math.round(oneCallInfo.daily[i + 1].temp.max);
        forecastBoxesLowestTemp[i].textContent = Math.round(oneCallInfo.daily[i + 1].temp.min);
    }

    // Display today's weather highlights (wind status, humidity, etc) for the respective location

    windStatusBoxValue.textContent = (currentWeatherInfo.wind.speed * 2.23693629).toFixed(1);
    windStatusBoxDirectionValue.textContent = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW", "N"][(currentWeatherInfo.wind.deg / 22.5).toFixed(0)];

    humidityBoxValue.textContent = currentWeatherInfo.main.humidity;
    humidityBoxPercentageBar.style.width = `${currentWeatherInfo.main.humidity}%`; 

    visibilityBoxValue.textContent = (currentWeatherInfo.visibility / 1000).toFixed(1);

    airPressureBoxValue.textContent = currentWeatherInfo.main.pressure;
}

// Display the current location weather
function displayCurrentLocationWeather() {

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            displayLocationWeather(latitude, longitude);
        })
    }
}

// Update the location weather info
async function updateLocationWeather(location) {
    let latitude, longitude, cityName, countryName;
    [cityName, countryName] = location.textContent.split(', ');
    [latitude, longitude] = await convertLocationNameToGeoCoordinates(cityName, countryName);
    displayLocationWeather(latitude, longitude);
}

class Icon {
    constructor(iconDOM, icon) {
        this.iconDom = iconDOM;
        this.icon = icon;
        this.iconType = null;
    }

    convertIconType() {
        if (this.icon === "01d") {
            return "CLEAR_DAY";
        } else if (this.icon === "01n") {
            return "CLEAR_NIGHT";
        } else if (this.icon === "02d" || this.icon === "04d") {
            return "PARTLY_CLOUDY_DAY";
        } else if (this.icon === "02n" || this.icon === "04n") {
            return "PARTLY_CLOUDY_NIGHT";
        } else if (this.icon === "03d" || this.icon === "03n") {
            return "CLOUDY";
        } else if (this.icon === "09d" || this.icon === "09n") {
            return "RAIN";
        } else if (this.icon === "10d") {
            return "SHOWERS_DAY";
        } else if (this.icon === "10n") {
            return "SHOWERS_NIGHT";
        } else if (this.icon === "11d") {
            return "THUNDER_SHOWERS_DAY";
        } else if (this.icon === "11n") {
            return "THUNDER_SHOWERS_NIGHT";
        } else if (this.icon === "13d"){
            return "SNOW_SHOWERS_DAY";
        } else if (this.icon === "13n") {
            return "SNOW_SHOWERS_NIGHT";
        } else if (this.icon === "50d" || this.icon === "50n") {
            return "FOG";
        }
    }

    setIcon() {
        this.iconType = this.convertIconType();
        const skycons = new Skycons({"monochrome": false});
        skycons.add(this.iconDom, Skycons[`${this.iconType}`]);
        skycons.play();
    } 
}
