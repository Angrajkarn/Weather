// script.js
const apiKey = 'fc6154709eefa713ceb8590c5662d7cb';

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    getWeatherByCoordinates(latitude, longitude);
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function getWeatherByCoordinates(latitude, longitude) {
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
    
    fetchWeather(weatherApiUrl, forecastApiUrl);
}

function getWeather() {
    const city = document.getElementById('cityInput').value;
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
    const forecastApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    fetchWeather(weatherApiUrl, forecastApiUrl);
}

function fetchWeather(weatherApiUrl, forecastApiUrl) {
    Promise.all([fetch(weatherApiUrl), fetch(forecastApiUrl)])
        .then(responses => Promise.all(responses.map(response => response.json())))
        .then(data => {
            displayWeather(data[0]);
            displayForecast(data[1]);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data. Please try again later.');
        });
}

function displayWeather(data) {
    const currentWeather = document.getElementById('currentWeather');
    currentWeather.innerHTML = `
    <h2>Current Weather</h2>
    <p class="temperature">${data.main.temp}°C</p>
    <p>Description: ${data.weather[0].description}</p>
    <!-- Display additional weather data here -->
    `;
    currentWeather.classList.add('show'); 
}

function displayForecast(data) {
    const forecastInfo = document.getElementById('forecast');
    forecastInfo.innerHTML = '<h2>5-Day Forecast</h2>';

    for (let i = 0; i < data.list.length; i += 8) { // Fetch data for every 24 hours
        const forecastData = data.list[i];
        const forecastDate = new Date(forecastData.dt * 1000);
        const forecastDateString = forecastDate.toDateString();
        const forecastTime = forecastDate.toLocaleTimeString();
        const forecastTemp = forecastData.main.temp;
        const forecastDescription = forecastData.weather[0].description;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <p>Date: ${forecastDateString}</p>
            <p>Time: ${forecastTime}</p>
            <p>Temperature: ${forecastTemp}°C</p>
            <p>Description: ${forecastDescription}</p>
        `;
        forecastInfo.appendChild(forecastItem);
    }
    forecastInfo.classList.add('show');
}

