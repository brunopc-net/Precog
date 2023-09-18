import React from 'react';
import './Forecast.css'

import { getTempAlertLevel, getUVIndexAlertLevel, getSnowAlertLevel, getRainAlertLevel } from "./AlertLevels";

function getTime(hour_fc){
    const time = hour_fc.time.split(" ")[1].replace(":00", "h");
    return time.charAt(0) === "0" ? time.substring(1) : time;
}

function getTemp(hour_fc){
    const temp = hour_fc.feelslike_c;
    return getTempAlertLevel(temp)+Math.round(temp);
}

function getPrec(hour_fc, precEmoji){
    return precEmoji === "🌨️" ?
        getSnowAlertLevel(hour_fc.precip_mm)+hour_fc.precip_mm/10:
        getRainAlertLevel(hour_fc.precip_mm)+hour_fc.precip_mm
}

function getWind(hour_fc){
    return Math.round(hour_fc.wind_kph)+"@"+hour_fc.wind_degree+"°";
}

function getUVIndex(hour_fc){
    return getUVIndexAlertLevel(hour_fc.uv)+hour_fc.uv;
}

function Forecast({forecast, precEmoji}){
    return (
        <div className="forecast-box" >
            <table>
                <caption>Forecast</caption>
                <thead>
                    <tr>
                        <td>🕗</td>
                        <td>🌡️</td>
                        <td>{precEmoji}</td>
                        <td>☀️</td>
                        <td>🌬️</td>
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
                                {getPrec(hour_fc, precEmoji)}
                            </td>
                            <td>
                                {getUVIndex(hour_fc)}
                            </td>
                            <td>
                                {getWind(hour_fc)}
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Forecast;