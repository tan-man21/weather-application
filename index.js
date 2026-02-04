const searchInput = document.getElementById('location-search');
const temp = document.querySelector('.temp')
const time = document.querySelector('.time')

const getLocation = async () => {

    let searchedName = searchInput.value

    try {
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${searchedName}`)
        const data = await res.json();
        
        const latitude = data.results[0].latitude;
        const longitude = data.results[0].longitude;
        console.log(latitude, longitude)

        const res2 = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min&hourly=temperature_2m&current=temperature_2m,is_day&temperature_unit=fahrenheit`)
        const data2 = await res2.json();

        const days = data2.daily.time;
        for (let i = 0; i < days.length; i++) {
            const day = document.createElement('li');
            day.textContent = `${days[i]} Low: ${data2.daily.temperature_2m_min[i]}°F - High ${data2.daily.temperature_2m_max[i]}°F`;
            document.querySelector('.forecast').appendChild(day);
        }
        
        // console.log(data2)

        temp.textContent = `${data2.current.temperature_2m}°F`;
        if (data2.current.is_day === 1) {
            time.textContent = '🌞'
        } else {
            time.textContent = '🌙'
        }
    } catch(e) {
    console.log(e)
  }
}

document.querySelector('button').addEventListener('click', getLocation)