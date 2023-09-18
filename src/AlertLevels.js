export function getAQIUSIndexAlertLevel(aqius){
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

    return "💀";
}

export function getUVIndexAlertLevel(max_uv){
    if(max_uv <= 3)
        return "🟢";
    if(max_uv <= 5)
        return "🟡";
    if(max_uv <= 7)
        return "🟠";
    if(max_uv <= 9)
        return "🔴";
    
    return "💀";
}

export function getUVTimeAlertLevel(time_before_sunscreen){
    if(time_before_sunscreen > 240)
        return "ℹ️";
    if(time_before_sunscreen > 120)
        return "⚠️";
    if(time_before_sunscreen > 60)
        return "🟡";
    if(time_before_sunscreen > 30)
        return "🟠";
    if(time_before_sunscreen > 15)
        return "🔴";

    return "💀"
}

export function getTempAlertLevel(temp){
    if(temp >= 45)
        return "🥵💀";
    if(temp >= 40)
        return "🥵🔴";
    if(temp >= 36)
        return "🥵🟠";
    if(temp >= 32)
        return "🥵🟡";
    if(temp >= 28)
        return "🥵⚠️";

    if(temp <= 10)
        return "🥶⚠️";
    if(temp <= 5)
        return "🥶🟡";
    if(temp <= 0)
        return "🥶🟠";
    if(temp <= -15)
        return "🥶🔴";
    if(temp <= -25)
        return "🥶💀";

    return "🟢";
}

export function getPrecAlertLevel(total_prec){
    if(total_prec === 0)
        return "🟢";
    if(total_prec < 2)
        return "🟡";
    if(total_prec < 6)
        return "🟠";

    return "🔴";
 }