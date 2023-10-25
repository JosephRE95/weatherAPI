async function weatherAPI() {
    // Array containing weather descriptions and corresponding emojis
    let descriptions = [
      ["Sunny", "😃"],
      ["Cloudy", "😵"],
      ["Rainy", "🌧️"],
      ["Thunderstorm", "⛈️"],
      ["Snowy", "❄️"],
      ["Partly Cloudy", "⛅️"]
    ]
  
    // Hide the weather widget and set up a change event listener for the city selection
    document.querySelector('#weatherWidget').style.display = 'none'
    document.querySelector('#citySelect').addEventListener('change', async evt => {
      console.log('action changed')
  
      try {
        // Disable the city selection dropdown
        document.querySelector('#citySelect').setAttribute('disabled', 'disabled')
  
        // Hide the weather widget and show a "fetching weather data" message
        document.querySelector('#weatherWidget').style.display = 'none'
        document.querySelector('.info').textContent = 'fetching weather data...'
  
        // Get the selected city from the dropdown
        console.log(evt.target.value)
        let city = evt.target.value
  
        // Build the URL for the weather API request
        let url = `http://localhost:3003/api/weather?city=${city}`
        console.log(url)
  
        // Send a GET request to the weather API using Axios
        const res = await axios.get(url)
  
        // Show the weather widget, clear the "fetching weather data" message, and re-enable the city selection
        document.querySelector('#weatherWidget').style.display = 'block'
        document.querySelector('.info').textContent = ''
        evt.target.removeAttribute('disabled')
  
        // Extract data from the API response
        let { data } = res
  
        // Update the apparent temperature element
        document.querySelector('#apparentTemp div:nth-child(2)')
          .textContent = `${data.current.apparent_temperature}°`
  
        // Update the weather description using emojis
        document.querySelector('#todayDescription')
          .textContent = descriptions.find(d => d[0] === data.current.weather_description)[1]
  
        // Update today's weather statistics
        document.querySelector('#todayStats div:nth-child(1)')
          .textContent = `${data.current.temperature_min}°/${data.current.temperature_max}°`
  
        document.querySelector('#todayStats div:nth-child(2)')
          .textContent = ` Precipitation: ${data.current.precipitation_probability * 100}%`
        console.log(data.current.precipitation_probability * 100)
  
        document.querySelector('#todayStats div:nth-child(3)')
          .textContent = ` Humidity: ${data.current.humidity}%`
  
        document.querySelector('#todayStats div:nth-child(4)')
          .textContent = `Wind: ${data.current.wind_speed}m/s`
  
        // Function to get the day of the week from a Date object
        function getDayOfWeek(date) {
          const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
          const dayIndex = date.getDay();
          return daysOfWeek[dayIndex];
        }
  
        // Update the forecast for the upcoming days
        data.forecast.daily.forEach((day, idx) => {
          let card = document.querySelectorAll('.next-day')[idx];
  
          let weekDay = card.children[0];
          let apparent = card.children[1];
          let minMax = card.children[2];
          let precipit = card.children[3];
  
          const date = new Date(day.date); // Convert the date string to a Date object
          weekDay.textContent = getDayOfWeek(date); // Set the day of the week
  
          apparent.textContent = descriptions.find(d => d[0] === day.weather_description)[1];
          minMax.textContent = `${day.temperature_min}°/${day.temperature_max}°`;
          precipit.textContent = `Precipitation: ${day.precipitation_probability * 100}%`;
        });
  
        // Update the location name
        document.querySelector('#location').firstElementChild.textContent = data.location.city;
  
      } catch (err) {
        // Handle errors, if any
        console.log(`Promise rejected with an error message --> `, err.message)
      }
    })
  
    // Update the footer with the current year
    const footer = document.querySelector('footer')
    const currentYear = new Date().getFullYear()
    footer.textContent = ` ${currentYear}`
  }
  