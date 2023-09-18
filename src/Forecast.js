import React from 'react';
import './Forecast.css'

function getTime(hour_fc){
    const time = hour_fc.time.split(" ")[1].replace(":00", "h");
    return time.charAt(0) === "0" ? time.substring(1) : time;
}

function getTemp(hour_fc){
    return Math.round(hour_fc.feelslike_c);
}

function getPrec(hour_fc){
    return hour_fc.precip_mm;
}

function getWind(hour_fc){
    return Math.round(hour_fc.wind_kph)+"@"+hour_fc.wind_degree+"°";
}

function getUVIndex(hour_fc){
    return hour_fc.uv;
}

function getPrecEmoji(forecast){
    const chancesOfRain = forecast
        .reduce((acc, hour_fc) => acc + hour_fc.chance_of_rain, 0);
    const chancesOfSnow = forecast
        .reduce((acc, hour_fc) => acc + hour_fc.chance_of_snow, 0);

    return chancesOfSnow > chancesOfRain ? "🌨️" : "🌧️";
}

function Forecast({forecast}){
    return (
        <div className="forecast-box" >
            <table>
                <caption>Forecast</caption>
                <thead>
                    <tr>
                        <td>🕗</td>
                        <td>🌡️</td>
                        <td>{getPrecEmoji(forecast)}</td>
                        <td>🌬️</td>
                        <td>☀️</td>
                    </tr>
                </thead>
                <tbody>
                    {forecast.map((hour_fc, i) => 
                        <tr key={i}>
                            <td>
                                {getTime(hour_fc)}
                            </td>
                            <td>
                                {getTemp(hour_fc)}
                            </td>
                            <td>
                                {getPrec(hour_fc)}
                            </td>
                            <td>
                                {getWind(hour_fc)}
                            </td>
                            <td>
                                {getUVIndex(hour_fc)}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Forecast;