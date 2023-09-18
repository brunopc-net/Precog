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

export function getUVTimeAlertLevel(time_before_sunscreen){
    if(time_before_sunscreen <= 17)
        return "💀"
    if(time_before_sunscreen <= 23)
        return "🔴";
    if(time_before_sunscreen <= 30)
        return "🟠";
    if(time_before_sunscreen <= 40)
        return "🟡";
    if(time_before_sunscreen <= 120)
        return "⚠️";
    if(time_before_sunscreen <= 240)
        return "ℹ️";

    return "🟢";
}

export function getTempAlertLevel(temp){
    if(temp >= 45)
        return "💀";
    if(temp >= 40)
        return "🔴";
    if(temp >= 36)
        return "🟠";
    if(temp >= 32)
        return "🟡";
    if(temp >= 28)
        return "⚠️";

    if(temp <= 10)
        return "⚠️";
    if(temp <= 5)
        return "🟡";
    if(temp <= 0)
        return "🟠";
    if(temp <= -15)
        return "🔴";
    if(temp <= -25)
        return "💀";

    return "🟢";
}

export function getPrecAlertLevel(prec){
    if (prec >= 30)
        return "💀";
    if (prec >= 15)
        return "🔴";
    if (prec >= 8)
        return "🟠";
    if (prec >= 4)
        return "🟡";
    if (prec >= 2)
        return "⚠️";
    if (prec > 0)
        return "ℹ️";

    return "🟢";
}