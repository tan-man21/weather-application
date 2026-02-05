const searchInput = document.getElementById('location-search');
const temp = document.querySelector('.temp')
const time = document.querySelector('.time')
const forecast = document.querySelector('.forecast')
const title = document.querySelector('.title')

// let searchedName = searchInput.value;

let latitude = '';
let longitude = '';

const cloudy = [2,3]

const getLocation = async () => {

    let searchedName = searchInput.value;

    

    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchedName}`)
        const data = await res.json();

        for(let i = 0; i < data.results.length; i++) {
            const result = document.createElement('button');
            result.classList.add(`result-${i}`);
            const searchLocation = data.results[i].name;
            const country = data.results[i].country;
            const admin1 = data.results[i].admin1;
            result.textContent = `${searchLocation} - ${admin1} - ${country}`;
            document.querySelector('.searchResults').appendChild(result);

            result.addEventListener('click', () => {
                latitude = data.results[i].latitude;
                longitude = data.results[i].longitude;
                document.querySelector('dialog').close();
                getWeather();
                document.querySelector('.searchContainer').style.display = 'none';
                title.textContent = `${searchLocation} - ${admin1}`;
                setTimeout(() => {document.querySelector('.weatherResults').style.display = 'flex';}, 500)
            })
        }

        
    } catch(e) {
    console.log(e)

    alert('Location not found')
  }
}

const getMyLocation = async () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            latitude = position.coords.latitude;
            longitude = position.coords.longitude;
            getWeather();
            document.querySelector('.weatherResults').style.display = 'flex';
            setTimeout(() => {title.textContent = 'Current Location';}, 500)
        })
      } else {
        alert("Geolocation is not supported by this browser.");
      }
}

const getWeather = async () => {
    const res2 = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=temperature_2m,is_day,weather_code&temperature_unit=fahrenheit`)

    const data2 = await res2.json();

    const days = data2.daily.time;

    forecast.innerHTML = '';
        
    for (let i = 0; i < days.length; i++) {
        const day = document.createElement('li');
        const date = new Date(days[i]);
        const weekday = date.toLocaleDateString('en', { weekday: 'long' });
        day.textContent = `${weekday} Low: ${data2.daily.temperature_2m_min[i]}°F - High ${data2.daily.temperature_2m_max[i]}°F`;
        forecast.appendChild(day);
    }
    

    temp.textContent = `${data2.current.temperature_2m}°F`;
    // if (data2.current.is_day === 1) {
    //     time.textContent = '🌞'
    // } else {
    //     time.textContent = '🌙'
    // }

    const weatherCode = data2.current.weather_code;

    if (cloudy.includes(weatherCode)) {
    const icon = document.createElement('img');
    icon.style.width = '100px';
    icon.src = `./assets/cloudy.png`;
    document.querySelector('.imgContainer').appendChild(icon);
    }
}

document.querySelector('.searchLocation').addEventListener('click', getLocation)

document.querySelector('.searchModal').addEventListener('click', () => {
    document.querySelector('dialog').showModal();
})

document.querySelector('.myLocation').addEventListener('click', getMyLocation)

document.querySelector('.myLocation').addEventListener('click', () => {
    document.querySelector('.searchContainer').style.display = 'none';
    setTimeout(() => {document.querySelector('.weatherResults, .title').style.display = 'flex';}, 500)
})