export function getAQIUSIndexAlertLevel(aqius_index){
    if(aqius_index >= 300)
        return "💀";
    if(aqius_index >= 200)
        return "🔴";
    if(aqius_index >= 150)
        return "🟠";
    if(aqius_index >= 100)
        return "🟡";
    if(aqius_index >= 50)
        return "⚠️";

    return "🟢";
}

export function getUVIndexAlertLevel(uv_index){
    if(uv_index >= 12)
        return "💀";
    if(uv_index >= 9)
        return "🔴";
    if(uv_index >= 7)
        return "🟠";
    if(uv_index >= 5)
        return "🟡";
    if(uv_index >= 3)
        return "⚠️";

    return "🟢";
}

export function getUVTimeAlertLevel(time_before_sunscreen_min){
    if(time_before_sunscreen_min <= 17)
        return "💀"
    if(time_before_sunscreen_min <= 23)
        return "🔴";
    if(time_before_sunscreen_min <= 30)
        return "🟠";
    if(time_before_sunscreen_min <= 40)
        return "🟡";
    if(time_before_sunscreen_min <= 120)
        return "⚠️";
    if(time_before_sunscreen_min <= 240)
        return "ℹ️";

    return "🟢";
}

export function getTempAlertLevel(temp_c){
    if(temp_c >= 45)
        return "💀";
    if(temp_c >= 40)
        return "🔴";
    if(temp_c >= 36)
        return "🟠";
    if(temp_c >= 32)
        return "🟡";
    if(temp_c >= 28)
        return "⚠️";

    if(temp_c <= 10)
        return "⚠️";
    if(temp_c <= 5)
        return "🟡";
    if(temp_c <= 0)
        return "🟠";
    if(temp_c <= -15)
        return "🔴";
    if(temp_c <= -25)
        return "💀";

    return "🟢";
}

export function getRainAlertLevel(rain_mm){
    if (rain_mm >= 32)
        return "💀";
    if (rain_mm >= 16)
        return "🔴";
    if (rain_mm >= 8)
        return "🟠";
    if (rain_mm >= 2)
        return "🟡";
    if (rain_mm > 0)
        return "⚠️";

    return "🟢";
}

export function getSnowAlertLevel(prec_mm){
    const snow_cm = prec_mm/10;
    if (snow_cm >= 35)
        return "💀";
    if (snow_cm >= 25)
        return "🔴";
    if (snow_cm >= 15)
        return "🟠";
    if (snow_cm >= 5)
        return "🟡";
    if (snow_cm > 0)
        return "⚠️";

    return "🟢";
}