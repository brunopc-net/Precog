import React from "react";

import './Alerts.css';

function getUVIndexAlertLevel(uv_index){
    if(uv_index <= 2)
        return "🟢";
    if(uv_index <= 5)
        return "🟡";
    if(uv_index <= 7)
        return "🟠";
    if(uv_index <= 10)
        return "🔴";
    if(uv_index <= 12)
        return "🟣";
    //13+
        return "💀";
}

function getUVTimeAlertLevel(time_before_sunscreen_min){
    if(time_before_sunscreen_min > 240)
        return "🟢ℹ️"
    if(time_before_sunscreen_min > 120)
        return "🟢⚠️"
    if(time_before_sunscreen_min > 30)
        return "🟡"
    if(time_before_sunscreen_min > 20)
        return "🟠";
    if(time_before_sunscreen_min > 17)
        return "🔴";
    if(time_before_sunscreen_min > 15)
        return "🟣";
    //15-
        return "💀";
}

function getTempAlertLevel(temp_c){
    //Heat
    if(temp_c >= 44)
        return "💀";
    if(temp_c >= 40)
        return "🟣";
    if(temp_c >= 36)
        return "🔴";
    if(temp_c >= 32)
        return "🟠";
    if(temp_c >= 28)
        return "🟡";
    //Cold
    if(temp_c <= 12)
        return "🟡";
    if(temp_c <= 6)
        return "🟠";
    if(temp_c <= 0)
        return "🔴";
    if(temp_c <= -12)
        return "🟣";
    if(temp_c <= -24)
        return "💀";
    //Between 12 and 28
        return "🟢";
}

function getRainAlertLevel(rain_mm){
    if (rain_mm === 0)
        return "🟢";
    if (rain_mm < 2)
        return "🟡";
    if (rain_mm < 6)
        return "🟠";
    if (rain_mm < 12)
        return "🔴";
     if (rain_mm < 24)
        return "🟣";
    //24+
        return "💀";
}

function getSnowAlertLevel(prec_mm){
    if (prec_mm === 0)
        return "🟢";
    
    const snow_cm = prec_mm/10;
    if (snow_cm < 5)
        return "🟡";
    if (snow_cm < 12)
        return "🟠";
    if (snow_cm < 20)
        return "🔴";
    if (snow_cm < 30)
        return "🟣";
    //32+
        return "💀";
}

function getpm25(aqius){
    var pm25 = aqius*0.24

    if(aqius > 50)
        pm25 = ((aqius-50)*0.46)+12;
    if(aqius > 100)
        pm25 = ((aqius-100)*0.42)+35;
    if(aqius > 150)
        pm25 = ((aqius-150)*1.88)+56;
    if(aqius > 200)
        pm25 = ((aqius-200))+150;
    if(aqius > 300)
        pm25 = ((aqius-300)*1.25)+250;

    return Math.round(pm25*10)/10;
}

function getAQIUSIndexAlertLevel(aqius){
    if(aqius < 50)
        return "🟢";
    if(aqius < 100)
        return "🟡";
    if(aqius < 150)
        return "🟠";
    if(aqius < 200)
        return "🔴";
    if(aqius < 300)
        return "🟣";
    //300+
        return "💀";
}

function getAirAlerts(aqius){

    if(aqius < 50)
        return [];

    const pm25 = getpm25(aqius);
    var alerts = [
        "🏭"+getAQIUSIndexAlertLevel(aqius)+" AQI "+aqius+", PM2.5 "+pm25+"µm/m3"
    ];

    const PM25_MAX_DOSE = 24 * 35;
    const LOW_INTENSITY_VE_RATIO = 3.245;
    const CYCLING_VE_RATIO = 8.316;
    const RUNNING_VE_RATIO = CYCLING_VE_RATIO * 1.306;
    const N95_RISK = 0.21;
    
    const cyclingLimit = PM25_MAX_DOSE/((pm25+2)*CYCLING_VE_RATIO);
    const runningLimit = PM25_MAX_DOSE/(pm25*RUNNING_VE_RATIO);

    var insideAlert = "🏠🚫🪟 Close windows, use air purifier";
    var cyclingAlert = "🚴😷 Cycling: N95 after "+getTimeString(cyclingLimit*60);
    var runningAlert = "🏃‍♂️😷 Running: N95 after "+getTimeString(runningLimit*60);
    if(aqius < 100)
        return alerts.concat([cyclingAlert, runningAlert, insideAlert]);

    const outsideLimit = PM25_MAX_DOSE/(pm25*LOW_INTENSITY_VE_RATIO);
    var outsideAlert = "🏞️😷 Outside: N95 after "+getTimeString(outsideLimit*60);
    if(aqius > 200){
        cyclingAlert = "🚴😷 Cycling: N95, max "+getTimeString(cyclingLimit/N95_RISK*60);
        runningAlert = "🏃‍♂️😷 Running: N95, max "+getTimeString(runningLimit/N95_RISK*60);
    }
    if(aqius > 300){
        outsideAlert = "🏞️😷 Outside: put N95, max "+getTimeString(outsideLimit*60/N95_RISK);
    }
    return alerts.concat([outsideAlert, cyclingAlert, runningAlert, insideAlert]);
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

function AlertsSummary({aqius, forecast, precEmoji}){
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

export {
    getUVIndexAlertLevel,
    getTempAlertLevel,
    getRainAlertLevel,
    getSnowAlertLevel,
    AlertsSummary
};