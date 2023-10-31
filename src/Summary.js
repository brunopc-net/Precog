import React from "react";
import weather from './data/weather.json';

import './Alerts.css';

function Summary(){
    const summary = weather.summary.air.alerts
        .concat(weather.summary.uv.alerts)
        .concat(weather.summary.temp.alerts)
        .concat(weather.summary.precp.alerts)

    if (summary.length === 0)
        summary.push("🟢 All is good, go play outside!")

    return (
        <div className="alert-box">
                <ul className="alerts">
                    {summary.map((alert, i) => 
                        <li key={i}>{alert}</li>
                    )}
                </ul>
        </div>
    );
}

export default Summary;