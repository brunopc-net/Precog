import React from 'react';
import './Forecast.css'

function Forecast({forecast}){
    return (
        <div className="forecast-box" >
            <table>
                <caption>Forecast</caption>
                <thead>
                    <tr>
                        <td>🕗</td>
                        {forecast
                            .map((hour) => hour.time.split(" ")[1].replace(":00", "h"))
                            .map((time) => time.charAt(0) === "0" ? time.substring(1) : time)
                            .map((time, i) =>
                                <td key={i}>{time}</td>
                            )
                        }
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>🌡️</td>
                        {forecast.map((hour, i) => 
                            <td key={i}>{hour.feelslike_c}</td>
                        )}
                    </tr>
                    <tr>
                        <td>🌧️</td>
                        {forecast.map((hour, i) => 
                            <td key={i}>{hour.precip_mm}</td>
                        )}
                    </tr>
                    <tr>
                        <td>☀️</td>
                        {forecast.map((hour, i) => 
                            <td key={i}>{hour.uv}</td>
                        )}
                    </tr>
                </tbody>
            </table>
        </div>
    );
}

export default Forecast;