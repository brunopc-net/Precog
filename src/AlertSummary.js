import React from "react";

import './Alerts.css';
import { 
    getAirAlerts,
    getSportAlerts,
    getUVAlerts,
    getTempAlerts,
    getPrecAlerts
} from "./AlertFunctions";

function AlertsSummary({aqius, forecast, precEmoji}){
    const summary = getAirAlerts(aqius)
        .concat(getSportAlerts(aqius))
        .concat(getUVAlerts(forecast))
        .concat(getTempAlerts(forecast))
        .concat(getPrecAlerts(forecast, precEmoji))

    if (summary.length === 0)
        summary.push("🟢 All's good, go play outside!")

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

export default AlertsSummary;