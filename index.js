const searchInput = document.getElementById('location-search');
const temp = document.querySelector('.temp')
const time = document.querySelector('.time')
const forecast = document.querySelector('.forecast')

// let searchedName = searchInput.value;

let latitude = '';
let longitude = '';

const getLocation = async () => {

    let searchedName = searchInput.value;

    

    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchedName}`)
        const data = await res.json();

        // const locations = data.results.name;

        // console.log(data);
        
        // const latitude = data.results[0].latitude;
        // const longitude = data.results[0].longitude;

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
                getWeather();
                document.querySelector('dialog').close();
            })
        }

        // const res2 = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=temperature_2m,is_day&temperature_unit=fahrenheit`)
        // const data2 = await res2.json();

        // const days = data2.daily.time;


        // forecast.innerHTML = '';
        
        // for (let i = 0; i < days.length; i++) {
        //     const day = document.createElement('li');
        //     const date = new Date(days[i]);
        //     const weekday = date.toLocaleDateString('en', { weekday: 'long' });
        //     day.textContent = `${weekday} Low: ${data2.daily.temperature_2m_min[i]}°F - High ${data2.daily.temperature_2m_max[i]}°F`;
        //     forecast.appendChild(day);
        // }
        

        // temp.textContent = `${data2.current.temperature_2m}°F`;
        // if (data2.current.is_day === 1) {
        //     time.textContent = '🌞'
        // } else {
        //     time.textContent = '🌙'
        // }

        
    } catch(e) {
    console.log(e)
  }
}

const getWeather = async () => {
    const res2 = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=temperature_2m,is_day&temperature_unit=fahrenheit`)

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
    if (data2.current.is_day === 1) {
        time.textContent = '🌞'
    } else {
        time.textContent = '🌙'
    }
}

document.querySelector('.searchLocation').addEventListener('click', getLocation)

document.querySelector('.searchModal').addEventListener('click', () => {
    document.querySelector('dialog').showModal();
})