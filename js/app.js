// Current Weather Section
const preloader = document.querySelector('.preloader');
const openMenuBtn = document.querySelector('button.location-search-btn');
const currentLocationBtn = document.querySelector('.location-bar > .material-icons');
const currentWeatherIcon = document.querySelector('canvas#current-weather-icon');
const currentTemp = document.querySelector('.temperature-degrees');
const currentTempUnit = document.querySelector('.current-temperature-display > span');
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
const degreeCelsiusIcon = document.querySelector('.degree-celsius-icon');
const degreeFahrenheitIcon = document.querySelector('.degree-fahrenheit-icon');
let temperatureUnitState = 'Degree Celsius';
const forecastBoxes = Array.from(document.querySelectorAll('.forecast-box'));
const forecastBoxesDate = Array.from(document.querySelectorAll('.forecast-box > .date'));
const forecastBoxesIcon = Array.from(document.querySelectorAll('.forecast-box > #forecast-weather-icon'));
const forecastBoxesHighestTemp = Array.from(document.querySelectorAll('.highest-temperature > .temperature-degrees'));
const forecastBoxesHighestTempUnit = Array.from(document.querySelectorAll('.highest-temperature > span'));
const forecastBoxesLowestTemp = Array.from(document.querySelectorAll('.lowest-temperature > .temperature-degrees'));
const forecastBoxesLowestTempUnit = Array.from(document.querySelectorAll('.lowest-temperature > span'));

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
        findLocationName(locationSearchBar.value.trim());
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
        setTimeout(() => {
            searchMenu.classList.remove('active-menu');
            window.scrollTo(0, 0);
        }, 800);
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

// Switch between Degree Celsius & Degree Fahrenheit 
degreeCelsiusIcon.addEventListener('click', () => {
    if (temperatureUnitState != 'Degree Celsius') {
        degreeCelsiusIcon.style.cssText = 'background-color: #E7E7EB; border: 10px solid #E7E7EB; color: #110E3C';
        degreeFahrenheitIcon.style.cssText = 'background-color: #6E707A; border: 10px solid #6E707A; color: #E7E7EB';
        temperatureUnitState = 'Degree Celsius';
        switchTemperatureUnit();
    } else {
        return;
    }
})

degreeFahrenheitIcon.addEventListener('click', () => {
    if (temperatureUnitState != 'Degree Fahrenheit') {
        degreeFahrenheitIcon.style.cssText = 'background-color: #E7E7EB; border: 10px solid #E7E7EB; color: #110E3C';
        degreeCelsiusIcon.style.cssText = 'background-color: #6E707A; border: 10px solid #6E707A; color: #E7E7EB';
        temperatureUnitState = 'Degree Fahrenheit';
        switchTemperatureUnit();
    } else {
        return;
    }
})

// Update location weather info every 30 secs
setInterval(async () => {await updateLocationWeather(currentLocation)}, 60000);

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

    const geocodingAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${searchValue}&limit=5&appid=ec021a840e27b53a39dd9bb4563c0c3c`;

    const reponse = await fetch(geocodingAPI, {mode: 'cors'});

    const locationInfo = await reponse.json();

    for (let i = 0; i < locationInfo.length; i++) {

        const locationValue = document.createElement('p');
        locationValue.style.cssText = 'font-size: 16px;';
        locationValue.textContent = `${locationInfo[i].name}, ${locationInfo[i].country}`;

        const locationIcon = document.createElement('span');
        locationIcon.classList.add('material-icons');
        locationIcon.textContent = 'navigate_next';

        searchSuggestionsDisplay[i].appendChild(locationValue);
        searchSuggestionsDisplay[i].appendChild(locationIcon);
        searchSuggestionsDisplay[i].style.display = 'flex';
    }
}

// Convert the location user searched to Geographical Coordinates
async function convertLocationNameToGeoCoordinates(cityName, countryName) {

    const geocodingAPI = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${countryName}&limit=1&appid=ec021a840e27b53a39dd9bb4563c0c3c`;
    
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

    // Display current weather information
    if (temperatureUnitState == 'Degree Celsius') {

        currentTemp.textContent = Math.round(currentWeatherInfo.main.temp);

        currentTempUnit.textContent = '°C';

        currentFeelsLikeTemp.textContent = Math.round(currentWeatherInfo.main.feels_like);

    } else if (temperatureUnitState == 'Degree Fahrenheit') {

        currentTemp.textContent = Math.round(currentWeatherInfo.main.temp * 1.8 + 32);

        currentTempUnit.textContent = '°F';

        currentFeelsLikeTemp.textContent = Math.round(currentWeatherInfo.main.feels_like * 1.8 + 32);

    }

    currentTempDescription.textContent = currentWeatherInfo.weather[0].main;

    const currentGMTTimzone = new Date();

    currentDate.textContent = new Date(currentGMTTimzone.getTime() + oneCallInfo.timezone_offset * 1000).toUTCString().slice(0, 11);

    currentLocation.textContent = currentWeatherInfo.name + ', ' + currentWeatherInfo.sys.country;

    new Icon(currentWeatherIcon, currentWeatherInfo.weather[0].icon).setIcon();

    // Display 1 week forecast weather information

    for (let i = 0; i < forecastBoxes.length; i++) {

        forecastBoxesDate[i].textContent = new Date(currentGMTTimzone.getTime() + oneCallInfo.timezone_offset * 1000 + (i + 1) * 1000 * 60 * 60 *24).toUTCString().slice(0, 11);
        new Icon(forecastBoxesIcon[i], oneCallInfo.daily[i + 1].weather[0].icon).setIcon();

        if (temperatureUnitState == 'Degree Celsius') {

            forecastBoxesHighestTemp[i].textContent = Math.round(oneCallInfo.daily[i + 1].temp.max);
            forecastBoxesHighestTempUnit[i].textContent = '°C';

            forecastBoxesLowestTemp[i].textContent = Math.round(oneCallInfo.daily[i + 1].temp.min);
            forecastBoxesLowestTempUnit[i].textContent = '°C';

        } else if (temperatureUnitState == 'Degree Fahrenheit') {

            forecastBoxesHighestTemp[i].textContent = Math.round(oneCallInfo.daily[i + 1].temp.max * 1.8 + 32);
            forecastBoxesHighestTempUnit[i].textContent = '°F';

            forecastBoxesLowestTemp[i].textContent = Math.round(oneCallInfo.daily[i + 1].temp.min * 1.8 + 32);
            forecastBoxesLowestTempUnit[i].textContent = '°F';

        }
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

// Switch temperature between Degree Celsius & Degree Fahrenheit 
function switchTemperatureUnit() {
    if (temperatureUnitState == 'Degree Celsius') {
        currentTemp.textContent = Math.round((currentTemp.textContent - 32) / 1.8);
        currentTempUnit.textContent = '°C';
        currentFeelsLikeTemp.textContent = Math.round((currentFeelsLikeTemp.textContent - 32) / 1.8);
        forecastBoxesHighestTemp.forEach(temp => {
            temp.textContent = Math.round((temp.textContent - 32) / 1.8);
        })
        forecastBoxesHighestTempUnit.forEach(unit => {
            unit.textContent = '°C';
        });
        forecastBoxesLowestTemp.forEach(temp => {
            temp.textContent = Math.round((temp.textContent - 32) / 1.8);
        })
        forecastBoxesLowestTempUnit.forEach(unit => {
            unit.textContent = '°C';
        });
    } else if (temperatureUnitState == 'Degree Fahrenheit') {
        currentTemp.textContent = Math.round(currentTemp.textContent * 1.8 + 32);
        currentTempUnit.textContent = '°F';
        currentFeelsLikeTemp.textContent = Math.round(currentFeelsLikeTemp.textContent * 1.8 + 32);
        forecastBoxesHighestTemp.forEach(temp => {
            temp.textContent = Math.round(temp.textContent * 1.8 + 32);
        })
        forecastBoxesHighestTempUnit.forEach(unit => {
            unit.textContent = '°F';
        });
        forecastBoxesLowestTemp.forEach(temp => {
            temp.textContent = Math.round(temp.textContent * 1.8 + 32);
        })
        forecastBoxesLowestTempUnit.forEach(unit => {
            unit.textContent = '°F';
        });
    }
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
