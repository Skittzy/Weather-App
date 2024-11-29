const weatherApiKey = '96644debc92617f68e34baefc12f33aa'
// // Logika za samo 1 grad
// const cityInput = 'skopje'

// Ova se podatocite koj vo vid na tekst gi displejnuvame prevzemeni od WeatherApi
const countryTxt = document.querySelector('.country-txt') //Ime na grad
const tempTxt = document.querySelector('.temp-txt') // Temperatura (smeni)
const conditionTxt = document.querySelector('.condition-txt') // Condition (smeni)
const humidityValueTxt = document.querySelector('.humidity-value-txt')
const windValueTxt = document.querySelector('.wind-value-txt')
const weatherSummaryImg = document.querySelector('.weather-summary-img')
const currentDateTxt = document.querySelector('.current-date-txt')

//  FORECAST Podatoci
const forecastItemsContainer = document.querySelector('.forecast-items-container')

// // Logika za samo 1 grad
// document.addEventListener("DOMContentLoaded", function() {
//     updateWeatherInfo(cityInput)// hardkoded zosto samo za sk ni treba, inc moze za poveke gradovi
//   });

// SEARCH LOGIC
const cityInput = document.querySelector('.city-input')
const searchBtn = document.querySelector('.search-btn')

const notFoundSection = document.querySelector('.not-found')
const searchCitySection = document.querySelector('.search-city')
const weatherInfoSection = document.querySelector('.weather-info')

searchBtn.addEventListener('click', () => {
    if (cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        cityInput.value = ''
        cityInput.blur()
    }
})

cityInput.addEventListener('keydown', (event) => {
    if (event.key == 'Enter' && cityInput.value.trim() != '') {
        updateWeatherInfo(cityInput.value)
        // Tuka logika za nova funk updatePolutionData
        cityInput.value = ''
        cityInput.blur()
    }
})

async function getFetchWeatherData(endPoint, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${weatherApiKey}&units=metric`

    const response = await fetch(apiUrl)

    return response.json()
}

function getCurrentDate() {
    const currentDate = new Date()
    const options = {
        weekday: 'short',
        day: '2-digit',
        month: 'short'
    }

    return currentDate.toLocaleDateString('en-GB', options)
}

function getWeatherIcon(id) {
    if(id <= 232) return 'thunderstorm.svg'
    if(id <= 321) return 'drizzle.svg'
    if(id <= 531) return 'rain.svg'
    if(id <= 622) return 'snow.svg'
    if(id <= 781) return 'atmosphere.svg'
    if(id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}

async function updateWeatherInfo(city) {
    const weatherData = await getFetchWeatherData('weather', city)

    if(weatherData.cod != 200) {
        showDisplaySection(notFoundSection)
        return
    }

    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed }
    } = weatherData

    countryTxt.textContent = country
    tempTxt.textContent = Math.round(temp) + ' °C'
    conditionTxt.textContent = main
    humidityValueTxt.textContent = humidity + "%"
    windValueTxt.textContent = speed + ' m/s'

    currentDateTxt.textContent = getCurrentDate()
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`
    

    await updateForecastInfo(city)
    // Logika za menjanje na sekcii, odnosno od search city --> Error ako nepostoi gradot --> weather info ako postoi
    showDisplaySection(weatherInfoSection)
}

// Forcast Logic
async function updateForecastInfo(city) {
    const forecastsData = await getFetchWeatherData('forecast', city);
    
    const timeTaken = '12:00:00'
    const todayDate = new Date().toISOString().split('T')[0]
    
    // vo klasata forecasts
    forecastItemsContainer.innerHTML = ''
    forecastsData.list.forEach(forecastWeather => {
        // gi zemame vrednostite samo za 12:00 od slednite (forecast denovi) i plus da ne go pokazuvame vremeto 12:00 zs ne ni treba
        if (forecastWeather.dt_txt.includes(timeTaken) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather)
        }
    })
}

function updateForecastItems(weatherData) {
    // gi vadime varijablite koj so ni trebaat za forecastov (id za ikona, temperatura, data)
    console.log(weatherData)
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData

    const dateTaken = new Date(date)
    const dateOption = { 
        day: '2-digit',
        month: 'short'
    }

    const dateResult = dateTaken.toLocaleDateString('en-GB', dateOption)

    //drug nacin kako da insertnes API data vo vrednostite na sajtot
    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
        </div>
    `
    forecastItemsContainer.insertAdjacentHTML('beforeend', forecastItem)
}

 // Logika za menjanje na sekcii, odnosno od search city --> Error ako nepostoi gradot --> weather info ako postoi
function showDisplaySection(section) {
    [weatherInfoSection, searchCitySection, notFoundSection]
        .forEach(section => section.style.display = 'none')

    section.style.display = 'flex'
}