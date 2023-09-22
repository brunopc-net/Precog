export function getAQIUSIndexAlertLevel(aqius_index){
    if(aqius_index < 50)
        return "🟢";
    if(aqius_index < 100)
        return "🟡";
    if(aqius_index < 150)
        return "🟠";
    if(aqius_index < 200)
        return "🔴";
    if(aqius_index < 300)
        return "🟣";
    //300+
        return "💀";
}

export function getUVIndexAlertLevel(uv_index){
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

export function getUVTimeAlertLevel(time_before_sunscreen_min){
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

export function getTempAlertLevel(temp_c){
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

export function getRainAlertLevel(rain_mm){
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

export function getSnowAlertLevel(prec_mm){
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