const searchInput = document.getElementById('location-search');
const temp = document.querySelector('.temp')
const forecast = document.querySelector('.forecast')
const title = document.querySelector('.title')
const searchResultsList = document.querySelector('.searchResults')
const highslows = document.querySelector('.highlows')
const hourly = document.querySelector('.hourly')
const chart = document.querySelector('.chart');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');

// let searchedName = searchInput.value;

let latitude = '';
let longitude = '';

const cloudy = [2,3,45,48];
const sunny = [0,1];
const rainy = [51,53,55,61,63,65,80,81,82];
const snowy = [56,57,66,67,71,73,75,77,85,86];
const thunderstorm = [95,96,99];


const getLocation = async () => {

    let searchedName = searchInput.value;

    searchResultsList.innerHTML = '';

    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchedName}`)
        const data = await res.json();

        for(let i = 0; i < data.results.length; i++) {
            const result = document.createElement('button');
            result.classList.add(`result-${i}`);
            const searchLocation = data.results[i].name;
            const country = data.results[i].country;
            const admin1 = data.results[i].admin1;
            if (admin1 === null || admin1 === undefined) {
                result.textContent = `${searchLocation}`;
            } else {
                result.textContent = `${searchLocation} - ${admin1} - ${country}`;
            }
            document.querySelector('.searchResults').appendChild(result);

            result.addEventListener('click', () => {
                latitude = data.results[i].latitude;
                longitude = data.results[i].longitude;
                document.querySelector('dialog').close();
                getWeather();
                document.querySelector('.searchContainer').style.display = 'none';
                if (admin1 === null || admin1 === undefined) {
                    title.textContent = `${searchLocation}`;
                } else {
                    title.textContent = `${searchLocation} - ${admin1}`;
                }
                setTimeout(() => {document.querySelector('.weatherResults').style.display = 'flex';}, 500)
            })
        }

        
    } catch(e) {
    console.log(e)

    searchResultsList.textContent = 'No results found';
  }
}

const getMyLocation = async () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            getWeather();
            document.querySelector('.weatherResults').style.display = 'flex';
            setTimeout(() => {title.textContent = `Current Location`;}, 100)
        })
      } else {
        alert("Geolocation is not supported by this browser.");
      }
}

const getWeather = async () => {

    const res2 = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=temperature_2m,is_day,weather_code,wind_speed_10m,relative_humidity_2m&temperature_unit=fahrenheit`)

    const data2 = await res2.json();

    const days = data2.daily.time;

    forecast.innerHTML = '';
    hourly.innerHTML = '';

    const chartLabel = [];
    const chartData1 = [];
    const chartData2 = [];
        
    for (let i = 0; i < days.length; i++) {
        const day = document.createElement('li');
        const date = new Date(`${days[i]}T00:00:00-05:00`);
        const weekday = date.toLocaleDateString('en', { weekday: 'short' });
        day.textContent = `${weekday} Low: ${data2.daily.temperature_2m_min[i]}°F - High ${data2.daily.temperature_2m_max[i]}°F`;
        forecast.appendChild(day);

        chartLabel.push(weekday);

        chartData1.push(data2.daily.temperature_2m_max[i]);
        chartData2.push(data2.daily.temperature_2m_min[i]);

        if (i === 0) {
            highslows.textContent = `H:${data2.daily.temperature_2m_max[i]}°  L:${data2.daily.temperature_2m_min[i]}°`;
            highslows.style.marginTop = '0';
            highslows.style.marginBottom = '25px';
            highslows.style.fontWeight = 'normal';
        }
    }

    const res3 = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=temperature_2m,is_day,weather_code&timezone=auto&forecast_days=2&temperature_unit=fahrenheit`)

    const data3 = await res3.json();
    const hours = data3.hourly.time;

    // const currentTime = data3.current.time.split('T')[1];
    const currentTime = data3.current.time;

    // console.log(hours);
    // console.log(currentTime);

    let n = 0;
    
    for (let i = 0; i < hours.length; i++) {
        // const date = new Date(`${date[i]}`);
        // const theHour = date.toLocaleDateString([], {hour12: false});
        // console.log(currentTime);
        // console.log(date)
        if (hours[i] < currentTime) {
            continue;
        } else if (n === 24) {

        break;

        } else {
        
        n++;

        const hour = document.createElement('li');
        const date = new Date(`${hours[i]}`);
        const time = date.toLocaleTimeString('en', { hour: 'numeric', minute: 'numeric' });
        hour.textContent = `${time} ${data2.hourly.temperature_2m[i]}°F`;
        if (n === 24) {
            hour.style.borderRight = 'none';
        }
        hourly.appendChild(hour);
        }
    }

    temp.textContent = `${data2.current.temperature_2m}°F`;
    temp.style.marginBottom = '0';

    const weatherCode = data2.current.weather_code;

    document.querySelector('.imgContainer').innerHTML = '';

    if (cloudy.includes(weatherCode)) {
        const icon = document.createElement('img');
        icon.style.width = '100px';
        icon.src = `./assets/cloudy.png`;
        document.querySelector('.imgContainer').appendChild(icon);
    } else if (sunny.includes(weatherCode)) {
        const icon = document.createElement('img');
        icon.style.width = '100px';
        icon.src = `./assets/sunny.png`;
        document.querySelector('.imgContainer').appendChild(icon);
    } else if (rainy.includes(weatherCode)) {
        const icon = document.createElement('img');
        icon.style.width = '100px';
        icon.src = `./assets/rainy.png`;
        document.querySelector('.imgContainer').appendChild(icon);
    } else if (snowy.includes(weatherCode)) {
        const icon = document.createElement('img');
        icon.style.width = '100px';
        icon.src = `./assets/snowy.png`;
        document.querySelector('.imgContainer').appendChild(icon);
    } else if (thunderstorm.includes(weatherCode)) {
        const icon = document.createElement('img');
        icon.style.width = '100px';
        icon.src = `./assets/thunderstorm.png`;
        document.querySelector('.imgContainer').appendChild(icon);
    }

    const windText = document.createElement('p');
    windText.textContent = `Wind: ${data2.current.wind_speed_10m} kmh`;
    wind.appendChild(windText);

    const humidityText = document.createElement('p');
    humidityText.textContent = `Humidity: ${data2.current.relative_humidity_2m}%`;
    humidity.appendChild(humidityText);

    const chartData = `https://quickchart.io/chart/render/zm-30a7d9b6-94f3-4d09-80ba-39f41a87eeeb?labels=${chartLabel}&data1=${chartData2}&data2=${chartData1}&width=500&height=500`;

    chart.src = chartData;
    chart.style.borderRadius = '10px';

    const chartTitle = document.querySelector('.chartTitle');
    chartTitle.textContent = '7 Day Forecast';

}
        

document.querySelector('.searchLocation').addEventListener('click', getLocation)

document.querySelector('.searchModal').addEventListener('click', () => {
    document.querySelector('dialog').showModal();
})

document.querySelector('.fa-xmark').addEventListener('click', () => {
    document.querySelector('dialog').close();
})

document.querySelector('.myLocation').addEventListener('click', getMyLocation)

document.querySelector('.myLocation').addEventListener('click', () => {
    document.querySelector('.searchContainer').style.display = 'none';
    setTimeout(() => {document.querySelector('.weatherResults, .title').style.display = 'flex';}, 500)
})

document.querySelector('.fa-circle-xmark').addEventListener('click', () => {
    searchInput.value = '';
    searchResultsList.innerHTML = '';
})

searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        getLocation();
    }
})

document.querySelector('.back').addEventListener('click', () => {
    document.querySelector('.weatherResults, .title').style.display = 'none';
    setTimeout(() => {document.querySelector('.searchContainer').style.display = 'block';}, 500)
})