import React from 'react';
import './Forecast.css'

function getTime(hour_fc){
    const time = hour_fc.time.split(" ")[1].replace(":00", "h");
    console.log(time.charAt(0) === "0" ? time.substring(1) : time)
    return time.charAt(0) === "0" ? time.substring(1) : time;
}

function getTemp(hour_fc){
    return Math.round(hour_fc.feelslike_c);
}

function getPrec(hour_fc){
    console.log(hour_fc.precip_mm);
    return hour_fc.precip_mm;
}

function getUVIndex(hour_fc){
    return hour_fc.uv;
}

function Forecast({forecast}){
    console.log(forecast);
    return (
        <div className="forecast-box" >
            <table>
                <caption>Forecast</caption>
                <thead>
                    <tr>
                        <td>🕗</td>
                        <td>🌡️</td>
                        <td>🌧️</td>
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