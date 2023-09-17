import React from "react";
import './Weather.css';
import { getAQIUSIndexAlertLevel, getUVIndexAlertLevel, getTempAlertLevel } from "./AlertLevels";

function WeatherBox({content}){
    return (
        <div className="weather-box">
            <div className="vertical-centered">
                {content}
            </div>
        </div>
    );
}

function Weather({aqius, weather}){
    const airLevel = "🏭"+getAQIUSIndexAlertLevel(aqius)+" "+aqius;
    const uvLevel = "☀️"+getUVIndexAlertLevel(weather.uv)+" "+weather.uv;
    const tempLevel = "🌡️"+getTempAlertLevel(weather.feelslike_c)+" "+weather.feelslike_c+"°C";
    const windLevel = "🌬️ "+weather.wind_kph+"kph "+weather.wind_degree+"°";

    return (
        <div>
            <WeatherBox content={airLevel} />
            <WeatherBox content={uvLevel} />
            <WeatherBox content={tempLevel} />
            <WeatherBox content={windLevel} />
        </div>
    );
}

export default Weather;