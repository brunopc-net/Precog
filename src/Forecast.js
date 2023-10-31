import React from 'react';
import './Forecast.css'

import weather from './data/weather.json';

function getTime(hour_fc){
    const time = hour_fc.time.split(" ")[1].replace(":00", "h");
    return time.charAt(0) === "0" ? time.substring(1) : time;
}

function Forecast(){
    return (
        <div className="forecast-box" >
            <table>
                <caption>Forecast</caption>
                <thead>
                    <tr>
                        <td>🕗</td>
                        <td>🌡️</td>
                        <td>{weather.summary.precp.isSnow ? "🌨️" : "🌧️"}</td>
                        <td>☀️</td>
                        <td>🌬️</td>
                    </tr>
                </thead>
                <tbody>
                    {weather.forecast.map((hour_fc, i) => 
                        <tr key={i}>
                            <td>
                                {getTime(hour_fc)}
                            </td>
                            <td>
                                {hour_fc.temp.alert_level + hour_fc.temp.value}
                            </td>
                            <td>
                                {hour_fc.precp.alert_level + hour_fc.precp.value}
                            </td>
                            <td>
                                {hour_fc.uv.alert_level + hour_fc.uv.value}
                            </td>
                            <td>
                                {hour_fc.wind.value}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Forecast;