/********* CHECKING WEATHER IN CURRENT LOCATION *********/
// DOM elements
const locationTimezone = document.querySelector('.location__timezone');
const temperatureDesription = document.querySelector('.temperature__description');
const temperatureDegree = document.querySelector('.temperature__degree');
const temperatureSection = document.querySelector('.temperature__section');
const temperatureElement = document.querySelector('.temperature');
const temperatureSymbol = temperatureSection.querySelector('span');

async function getWeather(latitude, longitude) {
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const APIkey = '';
    const api = `${proxy}https://api.darksky.net/forecast/${APIkey}/${latitude},${longitude}`;

    const resp = await fetch(api);
    return resp;
}

function displayWeather(data) {
    const { temperature, summary, icon } = data.currently;

    temperatureDegree.textContent = Math.round(temperature);
    temperatureDesription.textContent = summary;
    locationTimezone.textContent = data.timezone;
}

function changeTemperatureUnit(temp) {
    const celsius = Math.round(((temp - 32) * 5) / 9);

    if (temperatureSymbol.textContent === 'F') {
        temperatureSymbol.textContent = 'C';
        temperatureDegree.textContent = celsius;
    } else {
        temperatureSymbol.textContent = 'F';
        temperatureDegree.textContent = Math.round(temp);
    }
}

function setIcons(icon, iconID) {
    const skycons = new Skycons({ color: 'white' });
    const currentIcon = icon.replace(/-/g, '_').toUpperCase();
    skycons.play();
    return skycons.set(iconID, Skycons[currentIcon]);
}

window.addEventListener('load', () => {
    // Get weather to current location
    let weatherInfo = {};
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const long = position.coords.longitude;
            //console.log(position);
            //console.log(lat, long);

            const obj = getWeather(lat, long);
            obj.then(response => response.json()).then(data => {
                displayWeather(data);
                setIcons(data.currently.icon, document.querySelector('.icon'));

                temperatureDegree.addEventListener('click', () => changeTemperatureUnit(data.currently.temperature));
            });
        });
    } else {
        locationTimezone.textContent = "You didn't allow to use geo location";
    }
});

/********* CHECKING WEATHER IN CURRENT LOCATION **********/
const searchInput = document.querySelector('#search__input');
const searchBtn = document.querySelector('#search__btn');

async function searchPlace() {
    // Place Search
    const place = searchInput.value;
    const proxy = 'https://cors-anywhere.herokuapp.com/';
    const APIkey = '';
    const api = `${proxy}https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${place}&inputtype=textquery&key=${APIkey}`;
    let placeID;
    await fetch(api)
        .then(response => response.json())
        .then(data => {
            placeID = data.candidates[0].place_id;
        });

    // Place Detail
    const apiDetail = `${proxy}https://maps.googleapis.com/maps/api/place/details/json?placeid=${placeID}&key=${APIkey}`;
    let lat;
    let long;
    await fetch(apiDetail)
        .then(response => response.json())
        .then(data => {
            //console.log(data.result.geometry);
            lat = data.result.geometry.location.lat;
            long = data.result.geometry.location.lng;
        });

    const obj = getWeather(lat, long);
    obj.then(response => response.json()).then(data => {
        displayWeather(data);
        setIcons(data.currently.icon, document.querySelector('.icon'));

        temperatureDegree.addEventListener('click', () => changeTemperatureUnit(data.currently.temperature));
    });
}

searchBtn.addEventListener('click', () => {
    if (searchInput.value != null) {
        searchPlace();
    }
});