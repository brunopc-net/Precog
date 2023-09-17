import React from "react";
import './Alerts.css';

import forecast_amount from './config.js'
import { getAQIUSIndexAlertLevel, getUVIndexAlertLevel, getUVTimeAlertLevel, getTempAlertLevel } from "./AlertLevels";

function getAirAlerts(aqius){
    let alertLevel = getAQIUSIndexAlertLevel(aqius);
    if(alertLevel.includes("💀"))
        return [
            "🏭💀 Stay inside with N95😷",
            "🏭💀 Close windows, air purifier at max level"
        ]
    if(alertLevel.includes("🟣"))
        return [
            "🏭🟣 Stay inside",
            "🏭🟣 Close windows, air purifier at max level"
        ]
    if(alertLevel.includes("🔴") && aqius > 250)
        return [
            "🏭🔴 60 minutes max outside exposure with N95😷",
            "🏭🔴 Close windows, air purifier at high level"
        ]
    if(alertLevel.includes("🔴"))
        return [
            "🏭🔴 120 minutes max outside exposure with N95😷",
            "🏭🔴 Close windows, air purifier at moderate level"
        ]   
    if(alertLevel.includes("🟠"))
        return [
            "🏭🟠 Play outside with N95 mask😷",
            "🏭🟠 Close windows, turn on air purifier"
        ]
    if(alertLevel.includes("🟡"))
        return [
            "🏭🟡 Play outside if you want",
            "🏭🟡 Open windows if you want"
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
        "☀️"+getUVTimeAlertLevel(time_before_sunscreen)+" Need sunscreen after "+getTimeString(time_before_sunscreen),
    ];
    if(time_to_burn !== time_before_sunscreen) recommendations.push(
        "☀️"+getUVIndexAlertLevel(max_uv)+" At level "+max_uv+", skin burns after "+time_to_burn+"min"
    );
    
    return recommendations;
}

function getHeatAlerts(temp_avg, temp_max){
    //We check if avg max temp is over the trigger or avg temp within 3° of trigger
    let maxAlertLevel = getTempAlertLevel(temp_avg+3).concat(getTempAlertLevel(temp_max));

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
    let maxAlertLevel = getTempAlertLevel(temp_avg-3).concat(getTempAlertLevel(temp_min));

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
    const forecast_temp = forecast.map(hour => hour.feelslike_c);
    const temp_avg = forecast_temp.reduce((acc, temp) => acc + temp, 0) / forecast_temp.length;

    let recommendations = temp_avg >= 21 ?
        getHeatAlerts(temp_avg, Math.max(...forecast_temp)): //Hot
        getColdAlerts(temp_avg, Math.min(...forecast_temp)) //Cold

    return recommendations
}
  
function getPrecAlerts(forecast){
    let total_prec = 0;
    forecast.map(hour => hour.precip_mm)
        .forEach(prec => total_prec += prec)
  
    if(total_prec === 0)
        return [];
    if(total_prec < 2)
        return [
            "🌧️🟡 A few drops of rain are expected"
        ];
    if(total_prec < 5)
        return [
            "🌧️🟠 Rain is expected, dress properly or bring umbrella ☔ ella-ella hey hey 🎶"
        ];
  
    return [
        "⛈️🔴 Lots of rain is expected, I would stay inside"
    ];
 }

function Alerts({aqius, forecast}){
    const recommendations = getAirAlerts(aqius)
        .concat(getUVAlerts(forecast))
        .concat(getTempAlerts(forecast))
        .concat(getPrecAlerts(forecast));

    return (
        <div className="alert-box">
                <ul className="alerts vertical-centered">
                    {recommendations.map((rec) => 
                        <li key={rec}>{rec}</li>
                    )}
                </ul>
        </div>
    );
}

export default Alerts;