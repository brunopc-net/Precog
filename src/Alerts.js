import React from "react";

import './Alerts.css';
import { 
    getAQIUSIndexAlertLevel,
    getUVIndexAlertLevel,
    getUVTimeAlertLevel,
    getTempAlertLevel,
    getRainAlertLevel,
    getSnowAlertLevel
} from "./AlertLevels";

const PM25_MAX_DOSE = 24 * 35;
const LOW_INTENSITY_VE_RATIO = 3.245;
const CYCLING_VE_RATIO = 8.316;
const RUNNING_VE_RATIO = CYCLING_VE_RATIO * 1.306;
const N95_RISK = 0.21;

function getpm25(aqius){
    if(aqius <= 50)
        return aqius*0.24;
    if(aqius <= 100)
        return ((aqius-50)*0.46)+12;
    if(aqius <= 150)
        return ((aqius-100)*0.42)+35;
    if(aqius <= 200)
        return ((aqius-150)*1.88)+56;
    if(aqius <= 300)
        return ((aqius-200))+150;

    return ((aqius-200)*1.25)+250;
}

function getSportAlerts(aqius){
    if(aqius < 50)
        return [];

    const cyclingLimit = PM25_MAX_DOSE/(getpm25(aqius)+2)*CYCLING_VE_RATIO;
    const runningLimit = PM25_MAX_DOSE/getpm25(aqius)*RUNNING_VE_RATIO;

    var alerts = ["😷🚴 Wear N95 for cycling after "+getTimeString(cyclingLimit*60)];
    if(runningLimit < 3){
        alerts.push("😷🏃‍♂️ Wear N95 for running after "+getTimeString(runningLimit*60))
    }
    return alerts;
}

export function getAirAlerts(aqius){
    let alertLevel = "🏭"+getAQIUSIndexAlertLevel(aqius)+"-"+aqius;

    if(alertLevel.includes("🟢")) //aqius 0-50
        return []
    if(alertLevel.includes("🟡")) //aqius 50-100
        return [
            alertLevel+" Not the best, outside exposure still ok"
        ]
    
    const timeBeforeMask = PM25_MAX_DOSE/(getpm25(aqius)*LOW_INTENSITY_VE_RATIO);
    var alerts = [alertLevel+" put N95😷 outside after "+getTimeString(timeBeforeMask*60)];

    if(alertLevel.includes("🟠")){ //aqius 100-150
        return alerts.concat([
            alertLevel+"🏠 Close windows 🚫🪟, turn on air purifier"
        ]);
    }
    if(alertLevel.includes("🔴")){  //aqius 150-200
        return alerts.concat([
            alertLevel+"🏠 Close windows 🚫🪟, air purifier medium"
        ]);
    }

    alerts.push(alertLevel+" limit your outside time to "+getTimeString((timeBeforeMask/N95_RISK)*60));
    if(alertLevel.includes("🟣")){  //aqius 200-300
        return alerts.concat([
            alertLevel+"🏠 Close windows 🚫🪟, air purifier high"
        ]);
    }
    return alerts.concat([ //aqius 300+
        alertLevel+"🏠 Close windows 🚫🪟, air purifier max",
    ]);
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

    if(time_before_sunscreen >= forecast.length*60)
        return [];

    const max_uv = Math.max(...forecast_uv);
    const time_to_burn = getTimeToBurn(max_uv);

    let recommendations = []
    const timeAlertLevel = getUVTimeAlertLevel(time_before_sunscreen);
    if(timeAlertLevel.includes("🟢")) recommendations.push(
        "☀️"+getUVTimeAlertLevel(time_before_sunscreen)+" You'll need sunscreen in "+getTimeString(time_before_sunscreen)
    ); else recommendations.push(
        "☀️"+getUVTimeAlertLevel(time_before_sunscreen)+" Protect your skin after "+getTimeString(time_before_sunscreen)
    );
    if(time_to_burn !== time_before_sunscreen) recommendations.push(
        "☀️"+getUVIndexAlertLevel(max_uv)+" Max UV predicted: "+max_uv
    );
    
    return recommendations;
}

function getHeatAlerts(temp_avg, temp_max){
    //We check if avg max temp is over the trigger or avg temp within 3° of trigger
    let maxAlertLevel = getTempAlertLevel(temp_avg+2).concat(getTempAlertLevel(temp_max));
    if(maxAlertLevel.includes("💀"))
        return [
            "🌡️🥵💀 Avoid exercice, stay as cool as you can",
            "🌡️🥵💀 Take as much water/electrolytes as possible."
        ];
    if(maxAlertLevel.includes("🟣"))
        return [
            "🌡️🥵🟣 Exercice very lightly, no more then 60min Zone1",
            "🌡️🥵🟣 Take as much water/electrolytes as possible."
        ];
    if(maxAlertLevel.includes("🔴"))
        return [
            "🌡️🥵🔴 Exercice lightly, no more then 120min Zone2",
            "🌡️🥵🔴 Take as much water/electrolytes as possible"
        ];
    if(maxAlertLevel.includes("🟠"))
        return [
            "🌡️🥵🟠 Exercice moderatly, take regular breaks",
            "🌡️🥵🟠 Take a lot of water/electrolytes"
        ];
    if(maxAlertLevel.includes("🟡"))
        return [
            "🌡️🥵🟡 Caution with exercice, listen to your body",
            "🌡️🥵🟡 Drink proactively"
        ];
    return [];
}

function getColdAlerts(temp_avg, temp_min){
    //We check if avg max temp is over the trigger or avg temp within 3° of trigger
    let maxAlertLevel = getTempAlertLevel(temp_avg-2).concat(getTempAlertLevel(temp_min));

    if(maxAlertLevel.includes("💀"))
        return [
            "🌡️🥶💀 Extreme cold, stay indoors"
        ];
    if(maxAlertLevel.includes("🟣"))
        return [
            "🌡️🥶🟣 Wear maximum clothing, goggles",
        ];
    if(maxAlertLevel.includes("🔴"))
        return [
            "🌡️🥶🔴 Put winter gear",
        ];
    if(maxAlertLevel.includes("🟠"))
        return [
            "🌡️🥶🟠 You may need winter gear, watch out for ice🧊",
        ];
    if(maxAlertLevel.includes("🟡"))
        return [
            "🌡️🥶🟡 You may need light jacket/sleeves"
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
    const rainAmount = Math.round(total_prec*10)/10+"mm";

    if(alertLevel.includes("💀"))
        return [
            "🌧️💀 Heavy deluge is expected - "+rainAmount
        ];
    if(alertLevel.includes("🟣"))
        return [
            "🌧️🟣 Deluge is expected - "+rainAmount
        ];
    if(alertLevel.includes("🔴"))
        return [
            "🌧️🔴 A lot of rain is expected - "+rainAmount
        ];
    if(alertLevel.includes("🟠"))
        return [
            "🌧️🟠 Significant rain expected - "+rainAmount
        ];
    if(alertLevel.includes("🟡"))
        return [
            "🌧️🟡 Some rain drops expected"
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
    if(alertLevel.includes("🟣"))
        return [
            "🌨️🟣 Snow storm is expected - "+snowAmount
        ];
    if(alertLevel.includes("🔴"))
        return [
            "🌨️🔴 A lot of snow is expected - "+snowAmount
        ];
    if(alertLevel.includes("🟠"))
        return [
            "🌨️🟠 Significant snow expected - "+snowAmount
        ];
    if(alertLevel.includes("🟡"))
        return [
            "🌨️🟡 A bit of snow is expected"
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

export default Alerts;