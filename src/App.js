import { useState, useEffect } from 'react'

import Forecast from './Forecast';
import FORECAST_AMOUNT from './config';

import Alerts from './Alerts';
import Weather from './Weather';
import axios from 'axios';

const WEATHER_API_CALL = {
  method: 'GET',
  url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
  params: {
    q: "Montreal",
    days: '2'
  },
  headers: {
    'X-RapidAPI-Key': '70d30c54d9msh877d7c78dedb92cp15c5b3jsn5b512496413f',
    'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
  }
}

const AQIUS_API_CALL = {
  method: 'GET',
  url: 'https://api.airvisual.com/v2/city',
  params: {
    key: '4a75527e-cd94-40ae-a17e-e7fa1c2b7f2c',
    city: 'Montreal',
    state: 'quebec',
    country: 'canada'
  }
}

function getLocalEpoch(){
	const now =  new Date();
	const local_offset = now.getTimezoneOffset() * 60;

    //The previous hour should be included in forecast
    //Removing 10 minutes from epoch time
    const localEpoch = (new Date(now - local_offset).getTime())-(50*60);

    //Converting to seconds to match weather data
	return localEpoch/1000;
}

function filter(forecast){
    const forecast_filtered = forecast.forecastday[0].hour
      .filter((hour_fc) => hour_fc.time_epoch > getLocalEpoch()) //Ignore the forecast for the past
      .slice(0, FORECAST_AMOUNT); //Keep only the next x hours
  
    //If time > 4:00pm, we need to fill the forecast with some of tomorrow's data
    if(forecast_filtered.length < FORECAST_AMOUNT){
      const missing_hours = FORECAST_AMOUNT-forecast_filtered.length
      for(var i = 0; i < missing_hours; i++)
        forecast_filtered.push(forecast.forecastday[1].hour[i])
    }
  
    return forecast_filtered;
}

function App() {

  const [aqius, setAqius] = useState(0);
  const [weather, setWeather] = useState({});
  const [forecast, setForecast] = useState({});

  useEffect(() => {
    try {
      axios(AQIUS_API_CALL).then((resp) => {
        setAqius(resp.data.data.current.pollution.aqius)
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    try {
      axios(WEATHER_API_CALL).then((resp) => {
        setWeather(resp.data.current)
        setForecast(filter(resp.data.forecast))
      });
    } catch (error) {
      console.error(error);
    }
  }, []);

  return (
    <div className="App" >
      {aqius !== 0 && <Weather aqius={aqius} weather={weather}/>}
      <div>
        {forecast.length > 0 && <>
          <Forecast forecast={forecast} />
          <Alerts aqius={aqius} forecast={forecast}/>
        </>}
      </div>
      <div>
        🏭AQI-US Index&nbsp;&nbsp;&nbsp;
        ☀️UV Index&nbsp;&nbsp;&nbsp;
        🌡️Temperature°C&nbsp;&nbsp;&nbsp;
        🌬️Wind&nbsp;&nbsp;&nbsp;
        🕗Time&nbsp;&nbsp;&nbsp;
        🌧️Precipitations, mm
      </div>
    </div>
  );
}

export default App;
