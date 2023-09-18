import React from "react";
import './Alerts.css';

import forecast_amount from './config.js'
import { getAQIUSIndexAlertLevel, getUVIndexAlertLevel, getUVTimeAlertLevel, getTempAlertLevel, getRainAlertLevel, getSnowAlertLevel } from "./AlertLevels";

function getAirAlerts(aqius){
    let alertLevel = getAQIUSIndexAlertLevel(aqius);
    if(alertLevel.includes("💀"))
        return [
            "🏭💀 Stay inside with N95😷",
            "🏭💀 Close windows, air purifier at max level"
        ]
    if(alertLevel.includes("🔴"))
        return [
            "🏭🔴 Stay inside",
            "🏭🔴 Close windows, air purifier at max level"
        ]
    if(alertLevel.includes("🟠") && aqius >= 250)
        return [
            "🏭🟠 60min max outside exposure with N95😷",
            "🏭🟠 Close windows, air purifier at high level"
        ]
    if(alertLevel.includes("🟠"))
        return [
            "🏭🟠 120min max outside exposure with N95😷",
            "🏭🟠 Close windows, air purifier at moderate level"
        ]   
    if(alertLevel.includes("🟡"))
        return [
            "🏭🟡 Play outside with N95 mask😷",
            "🏭🟡 Close windows, turn on air purifier"
        ]
    if(alertLevel.includes("⚠️"))
        return [
            "🏭⚠️ Not the best, outside exposure still ok"
        ]

    return []
}

function getTimeToBurn(uv_index){
    return Math.floor((200 * 3)/(3*uv_index))
}

function getTimeString(minutes_amount) {
    var hours = (minutes_amount / 60);
    var rhours = Math.floor(hours);
    var rminutes = Math.round((hours - rhours) * 60);

    if (rhours > 0)
        return rhours+"h"+rminutes+"min";
        
    return rminutes+"min";
}

function getTimeBeforeSunscreen(forecast_uv){
    let time_before_sunscreen = 0;
    for (let i = 0; i < forecast_uv.length; i++){
        let time_to_burn = getTimeToBurn(forecast_uv[i]);
        if(time_to_burn < 60){
            time_before_sunscreen += time_to_burn;
            break;
        }
        time_before_sunscreen += 60;
    }
    return time_before_sunscreen;
}

function getUVAlerts(forecast){
    const forecast_uv = forecast.map(hour => hour.uv);
    const time_before_sunscreen = getTimeBeforeSunscreen(forecast_uv);

    if(time_before_sunscreen >= forecast_amount*60)
        return [];

    const max_uv = Math.max(...forecast_uv);
    const time_to_burn = getTimeToBurn(max_uv);

    let recommendations = [
        "☀️"+getUVTimeAlertLevel(time_before_sunscreen)+" Protect skin after "+getTimeString(time_before_sunscreen),
    ];
    if(time_to_burn !== time_before_sunscreen) recommendations.push(
        "☀️"+getUVIndexAlertLevel(max_uv)+" Max level for today: "+max_uv
    );
    
    return recommendations;
}

function getHeatAlerts(temp_avg, temp_max){
    //We check if avg max temp is over the trigger or avg temp within 3° of trigger
    let maxAlertLevel = getTempAlertLevel(temp_avg+2).concat(getTempAlertLevel(temp_max));

    if(maxAlertLevel.includes("💀"))
        return [
            "🌡️🥵💀 Avoid exercice",
            "🌡️🥵💀 Stay as cool as you can.",
            "🌡️🥵💀 Take as much water/electrolytes as possible."
        ];
    if(maxAlertLevel.includes("🔴"))
        return [
            "🌡️🥵🔴 Exercice very lightly, no more then Zone1",
            "🌡️🥵🔴 Limit exercice to 60min",
            "🌡️🥵🔴 Take as much water/electrolytes as possible."
        ];
    if(maxAlertLevel.includes("🟠"))
        return [
            "🌡️🥵🟠 Train lightly, no more then Zone2",
            "🌡️🥵🟠 Limit exercice to 120min",
            "🌡️🥵🟠 Take as much water/electrolytes as possible"
        ];
    if(maxAlertLevel.includes("🟡"))
        return [
            "🌡️🥵🟡 Train moderatly, take regular breaks",
            "🌡️🥵🟡 Take a lot of water/electrolytes"
        ];
    if(maxAlertLevel.includes("⚠️"))
        return [
            "🌡️🥵⚠️ Caution with exercice, listen to your body",
            "🌡️🥵⚠️ Drink proactively"
        ];
    return [];
}

function getColdAlerts(temp_avg, temp_min){
    //We check if avg max temp is over the trigger or avg temp within 3° of trigger
    let maxAlertLevel = getTempAlertLevel(temp_avg-2).concat(getTempAlertLevel(temp_min));

    if(maxAlertLevel.includes("💀"))
        return [
            "🌡️🥶💀 Stay indoors"
        ];
    if(maxAlertLevel.includes("🔴"))
        return [
            "🌡️🥶🔴 Wear maximum clothing, winter goggles",
        ];
    if(maxAlertLevel.includes("🟠"))
        return [
            "🌡️🥶🟠 Put a winter jacket",
            "🌡️🥶🟠 Keep your hands, feet and ears warm",
        ];
    if(maxAlertLevel.includes("🟡"))
        return [
            "🌡️🥶🟡 Put a winter jacket",
            "🌡️🥶🟡 Keep your hands, feet and ears covered",
            "🌡️🥶🟡 It may freeze, watch out for ice🧊",
        ];
    if(maxAlertLevel.includes("⚠️"))
        return [
            "🌡️🥶⚠️ Put a light jacket or sleeves"
        ];
    return [];
}

function getTempAlerts(forecast){
    const forecast_temp = forecast.map(hour => 
        hour.feelslike_c
    );
    const temp_avg = forecast_temp.reduce((acc, temp) =>
        acc + temp, 0
    ) / forecast_temp.length;
    return temp_avg > 20 ?
        getHeatAlerts(temp_avg, Math.max(...forecast_temp)):
        getColdAlerts(temp_avg, Math.min(...forecast_temp))
}

function getRainAlerts(total_prec){
    const alertLevel = getRainAlertLevel(total_prec);
    const rainAmount = total_prec+"mm";

    if(alertLevel.includes("💀"))
        return [
            "🌧️💀 Heavy deluge is expected - "+rainAmount
        ];
    if(alertLevel.includes("🔴"))
        return [
            "🌧️🔴 Deluge is expected - "+rainAmount
        ];
    if(alertLevel.includes("🟠"))
        return [
            "🌧️🟠 A lot of rain is expected - "+rainAmount
        ];
    if(alertLevel.includes("🟡"))
        return [
            "🌧️🟡 Significant rain expected - "+rainAmount
        ];
    if(alertLevel.includes("⚠️"))
        return [
            "🌧️⚠️ Some rain drops expected"
        ];
    return [];
}

function getSnowAlerts(total_prec){
    const alertLevel = getSnowAlertLevel(total_prec);
    const snowAmount = Math.round(total_prec/10)+"cm"

    if(alertLevel.includes("💀"))
        return [
            "🌨️💀 Heavy snow storm is expected - "+snowAmount
        ];
    if(alertLevel.includes("🔴"))
        return [
            "🌨️🔴 Snow storm is expected - "+snowAmount
        ];
    if(alertLevel.includes("🟠"))
        return [
            "🌨️🟠 A lot of snow is expected - "+snowAmount
        ];
    if(alertLevel.includes("🟡"))
        return [
            "🌨️🟡 Significant snow expected - "+snowAmount
        ];
    if(alertLevel.includes("⚠️"))
        return [
            "🌨️⚠️ A bit of snow is expected"
        ];
    return [];
}

function getPrecAlerts(forecast, precEmoji){
    let total_prec = forecast.reduce((acc, hour_fc) => 
        acc + hour_fc.precip_mm, 0
    );
    return precEmoji === "🌨️" ?
        getSnowAlerts(total_prec):
        getRainAlerts(total_prec)
}

function Alerts({aqius, forecast, precEmoji}){
    const summary = getAirAlerts(aqius)
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

export default Alerts;