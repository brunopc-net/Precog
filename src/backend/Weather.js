const config = require('./config');

const N95_RISK = 0.21; //https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8438762/
const RUNNING_VE_RATIO = 1.3; //https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1334197/

function getTimeString(minutes_amount) {
    var hours = (minutes_amount / 60);
    var rhours = Math.floor(hours);
    var rminutes = Math.round((hours - rhours) * 60);

    if(rminutes < 10)
        rminutes = "0"+rminutes
    if (rhours > 0)
        return rhours+"h"+rminutes;
        
    return rminutes;
}

function between(metric, threshold1, threshold2){
    return (metric >= threshold1 && metric < threshold2) ||
           (metric <= threshold1 && metric > threshold2);
}

function getAlertLevel(metric, thresholds){
    if((thresholds[0] < thresholds[1] && metric <= thresholds[0]) ||
       (thresholds[0] > thresholds[1] && metric >  thresholds[0]))
        return "🟢";
    if(between(metric, thresholds[0], thresholds[1]))
        return "🟡";
    if(between(metric, thresholds[1], thresholds[2]))
        return "🟠";
    if(between(metric, thresholds[2], thresholds[3]))
        return "🔴";
    if(between(metric, thresholds[3], thresholds[4]))
        return "🟣";

    return "💀";
}

class AirSummary {
    constructor(aqius, forecast_amount, user){
        const summary = {
            aqius: aqius,
            pm25: this.calcPM25(aqius)
        }
        Object.assign(summary, {alerts: this.getAlerts(summary, forecast_amount, user)})
        return summary;
    }

    calcPM25(aqius){
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

    getAlerts(aq, forecast_amount, user){
        if(aq.aqius <= 50)
            return [];

        const age = this.calcUserAge(user.birth);
        const ve = {
            rest: this.calcUserVe(user.zones[0], age),
            walking: this.calcUserVe(user.zones[1], age),
            cycling: this.calcUserVe(user.zones[2], age),
            running: this.calcUserVe(user.zones[2], age) * RUNNING_VE_RATIO
        };
        const limit = {
            walking: {
                noMask: this.calcTimeLimit(ve.walking/ve.rest, aq.pm25, user.thresholds.pm25_24h),
                withN95: this.calcTimeLimit(ve.walking/ve.rest, aq.pm25, user.thresholds.pm25_24h, true)
            },
            running: {
                noMask: this.calcTimeLimit(ve.running/ve.rest, aq.pm25, user.thresholds.pm25_24h),
                withN95: this.calcTimeLimit(ve.running/ve.rest, aq.pm25, user.thresholds.pm25_24h, true)
            },
            cycling: {
                noMask: this.calcTimeLimit(ve.cycling/ve.rest, aq.pm25+2, user.thresholds.pm25_24h),
                withN95: this.calcTimeLimit(ve.cycling/ve.rest, aq.pm25+2, user.thresholds.pm25_24h, true)
            }
        };
        const alerts = [
            "🏭"+getAlertLevel(aq.aqius, user.thresholds.aqi)+" AQI "+aq.aqius+", PM2.5 "+aq.pm25+"µm/m3",
        ];
        if(aq.aqius > 100)
            alerts.push("🏠🚫🪟 Close windows, use air purifier");
        return alerts.concat([
            this.getActivityAlert("🚴 Cycling", limit.cycling, forecast_amount)||[],
            this.getActivityAlert("🏃‍♂️ Running", limit.running, forecast_amount)||[],
            this.getActivityAlert("🏞️ Outside", limit.walking, forecast_amount)||[]
        ])
    }

    getActivityAlert(activity, limit, forecast_amount){
        //Doesn't make sense to have a limit over forecasted time
        if(limit.noMask < forecast_amount){
            const alert = "😷"+activity+": N95 after "+getTimeString(limit.noMask*60);
            return limit.withN95 >= forecast_amount ? alert :
                alert+", max "+getTimeString(limit.withN95*60);
        }
    }

    calcTimeLimit(ve_ratio, pm25, pm25_24h_max, mask){
        const maxRisk = 24*this.calcRisk(pm25_24h_max);
        let currentRisk = this.calcRisk(pm25)*ve_ratio;
        if(mask){
            currentRisk *= N95_RISK;
        }
        return Math.round((maxRisk/currentRisk)*100)/100;
    }

    calcRisk(pm25){
        return 0.346 + (0.144*pm25)
            -(1.24*Math.pow(10,-3)*Math.pow(pm25, 2))
            +(6.94*Math.pow(10,-6)*Math.pow(pm25, 3))
            -(2.25*Math.pow(10,-8)*Math.pow(pm25, 4))
            +(3.83*Math.pow(10,-11)*Math.pow(pm25, 5))
            -(2.65*Math.pow(10,-14)*Math.pow(pm25, 6));
    }

    calcUserVe(zone, age){
        //Reference https://journals.plos.org/plosone/article/file?id=10.1371%2Fjournal.pone.0218673&type=printable
        const ve = Math.pow(Math.E, -8.57)
            *Math.pow(zone.hr, 1.72)
            *Math.pow(zone.fb, 0.611)
            *Math.pow(age, 0.298)
            //Removing the FVC from the equation as we are interested at the ratio. Any value will give us the same result
            //*Math.pow(fvc, 0.614);
        return Math.round(ve*100)/100
    }

    calcFvc(age, height){
        //Reference https://pubmed.ncbi.nlm.nih.gov/16204786/
        return (0.0756*height) - (0.0649*age) - 4.904
    }

    calcUserAge(birth){
        var today = new Date();
        var birthDate = new Date(birth);
        var age = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
}

class UvSummary {
    constructor(forecast_uv, user){
        const time_to_burn = this.calcTimeToBurn(forecast_uv, user.skin_type);
        return {
            time_to_burn: time_to_burn,
            alerts: this.getAlerts(forecast_uv, time_to_burn, user.thresholds.uv)
        }
    }

    getAlerts(forecast_uv, time_to_burn, thresholds){
        const timeAlert = this.getTimeAlert(
            forecast_uv,
            time_to_burn,
            thresholds.time
        );
        return timeAlert ? [timeAlert,
            this.getMaxUvAlert(forecast_uv, timeAlert.charAt(0), thresholds.index)||[]
        ]: [];
    }

    getTimeAlert(forecast_uv, time_to_burn, thresholds){
        if(time_to_burn < forecast_uv.length*60){
            const timeAlertLevel = getAlertLevel(time_to_burn, thresholds);
            return timeAlertLevel+"☀️ You'll need sunscreen in "+getTimeString(time_to_burn);
        }
    }

    getMaxUvAlert(forecast_uv, timeAlertLevel, thresholds){
        const max_uv = Math.max(...forecast_uv);
        const maxUvAlertlevel = getAlertLevel(max_uv, thresholds);

        if(maxUvAlertlevel !== timeAlertLevel)
            return "☀️"+maxUvAlertlevel+" Max UV predicted: "+max_uv;
    }

    calcTimeToBurn(forecast_uv, skin_type){
        let time_to_burn = 0;
        for(const uv of forecast_uv) {
            const time = Math.floor((200 * skin_type)/(3*uv));
            time_to_burn += time;
            if(time < 60) break;
        }
        return time_to_burn;
    }
}

class TempSummary {
    constructor(forecast_temp, thresholds){
        const summary = {
            avg: Math.round((forecast_temp.reduce((acc, temp) => acc + temp, 0) / forecast_temp.length)*10)/10,
            max: Math.max(...forecast_temp),
            min: Math.min(...forecast_temp),
        }
        Object.assign(summary, {alerts: this.getAlerts(summary, thresholds)})
        return summary;
    }

    getAlerts(summary, thresholds){
        return summary.avg > 20 ?
            [this.getHeatAlert(summary.avg, summary.max, thresholds.heat)]:
            [this.getColdAlert(summary.avg, summary.min, thresholds.cold)];
    }

    getHeatAlert(avg, max, thresholds){
        const avgAlertLvl = getAlertLevel(avg+3, thresholds);
        const maxAlertLvl = getAlertLevel(max, thresholds);
        const alertLvl = avgAlertLvl+maxAlertLvl;

        if(alertLvl.includes("💀"))
            return "🌡️🥵💀 No exercicing, stay max cool";
        if(alertLvl.includes("🟣"))
            return "🌡️🥵🟣 Max 60min Zone1, max hydratation";
        if(alertLvl.includes("🔴"))
            return "🌡️🥵🔴 Max 120min Zone2, max hydratation";
        if(alertLvl.includes("🟠"))
            return "🌡️🥵🟠 Moderate exercice, regular hydratation";
        if(alertLvl.includes("🟡"))
            return "🌡️🥵🟡 Drink proactively";
    }

    getColdAlert(avg, min, thresholds){
        //We check if avg max temp is over the trigger or avg temp within 3° of trigger
        const avgAlertLvl = getAlertLevel(avg-3, thresholds);
        const minAlertLvl = getAlertLevel(min, thresholds);
        const alertLvl = avgAlertLvl+minAlertLvl;

        if(alertLvl.includes("💀"))
            return "🌡️🥶💀 Extreme cold, stay indoors";
        if(alertLvl.includes("🟣"))
            return "🌡️🥶🟣 Wear maximum clothing, goggles";
        if(alertLvl.includes("🔴"))
            return "🌡️🥶🔴 Put winter gear, 🧊 ice warning";
        if(alertLvl.includes("🟠"))
            return "🌡️🥶🟠 Put warm jacket";
        if(alertLvl.includes("🟡"))
            return "🌡️🥶🟡 Put a light jacket or sleeves";
    }
}

class PrecpSummary {
    constructor(forecast_precp, thresholds){
        const total = forecast_precp.reduce((acc, precp) => acc + precp, 0);
        const snow = this.isSnow(forecast_precp);
        return {
            total: total,
            isSnow: snow,
            alerts: this.getAlerts(total, snow, thresholds)
        }
    }

    isSnow(forecast_precp){
        const chanceOfRain = forecast_precp.reduce((tot, hour) => tot + hour.chance_of_rain, 0);
        const chanceOfSnow = forecast_precp.reduce((tot, hour) => tot + hour.chance_of_snow, 0);
        return chanceOfSnow > chanceOfRain;
    }

    getAlerts(total, isSnow, thresholds){
        return isSnow ?
            [this.getSnowAlert(total, thresholds.snow)]:
            [this.getRainAlert(total, thresholds.rain)];
    }

    getSnowAlert(total_prec, thresholds){
        const alertLevel = getAlertLevel(total_prec, thresholds);
        const snowAmount = Math.round(total_prec/10)+"cm"

        if(alertLevel.includes("💀"))
            return "🌨️💀 Heavy snow storm is expected - "+snowAmount;
        if(alertLevel.includes("🟣"))
            return "🌨️🟣 Snow storm is expected - "+snowAmount;
        if(alertLevel.includes("🔴"))
            return "🌨️🔴 A lot of snow is expected - "+snowAmount;
        if(alertLevel.includes("🟠"))
            return "🌨️🟠 Significant snow expected - "+snowAmount;
        if(alertLevel.includes("🟡"))
            return "🌨️🟡 A bit of snow is expected";
    }

    getRainAlert(total_prec, thresholds){
        const alertLevel = getAlertLevel(total_prec, thresholds);
        const rainAmount = Math.round(total_prec*10)/10+"mm";
    
        if(alertLevel.includes("💀"))
            return "🌧️💀 Heavy deluge is expected - "+rainAmount;
        if(alertLevel.includes("🟣"))
            return "🌧️🟣 Deluge is expected - "+rainAmount
        if(alertLevel.includes("🔴"))
            return "🌧️🔴 A lot of rain is expected - "+rainAmount
        if(alertLevel.includes("🟠"))
            return "🌧️🟠 Significant rain expected - "+rainAmount
        if(alertLevel.includes("🟡"))
            return "🌧️🟡 Some rain drops expected";
    }
}

class Forecast {
    constructor(weatherData, thresholds){
        const forecast = this.getForecast(weatherData);
        return this.enrichedForecast(forecast, thresholds);
    }

    getForecast(weatherData){
        const today_fc = weatherData.forecast.forecastday[0].hour;
        const tomorrow_fc = weatherData.forecast.forecastday[1].hour;
        const localEpoch = weatherData.location.localtime_epoch
        return today_fc.concat(tomorrow_fc)
            .filter((hour_fc) => hour_fc.time_epoch > (localEpoch-60*60)) //Ignore the forecast until past hour
            .slice(0, config.forecast_amount); //Keep only the next relevent hours
    }

    enrichedForecast(forecast, thresholds){
        const enrichedForecast = [];
        forecast.map((hour_fc) => {
            const h_temp = hour_fc.feelslike_c;
            const h_precp = hour_fc.precip_mm;
            const h_uv = hour_fc.uv;
            
            enrichedForecast.push({
                time: hour_fc.time,
                temp: {
                    value: h_temp,
                    alert_level: h_temp < 20 ?
                        getAlertLevel(h_temp, thresholds.temp.cold):
                        getAlertLevel(h_temp, thresholds.temp.heat)
                },
                precp: {
                    value: h_precp,
                    alert_level: hour_fc.chance_of_snow > hour_fc.chance_of_rain ?
                        getAlertLevel(h_precp/10, thresholds.precp.snow):
                        getAlertLevel(h_precp, thresholds.precp.rain)
                },
                uv: {
                    value: h_uv,
                    alert_level: getAlertLevel(h_uv, thresholds.uv.index)
                },
                wind: {
                    value: Math.round(hour_fc.wind_kph)+"@"+hour_fc.wind_degree+"°"
                }
            });
        })

        return enrichedForecast;
    }

}

module.exports = class Weather {
    constructor(weatherData, aqius){
        const forecast = new Forecast(weatherData, config.user.thresholds);
        return {
            summary: {
                air: new AirSummary(
                    aqius,
                    forecast.length,
                    config.user
                ),
                uv: new UvSummary(
                    forecast.map(hour => hour.uv.value),
                    config.user
                ),
                temp: new TempSummary(
                    forecast.map(hour => hour.temp.value),
                    config.user.thresholds.temp
                ),
                precp: new PrecpSummary(
                    forecast.map(hour => hour.precp.value),
                    config.user.thresholds.precp
                )
            },
            forecast: forecast
        }
    }

    getForecast(weatherData){
        const today_fc = weatherData.forecast.forecastday[0].hour;
        const tomorrow_fc = weatherData.forecast.forecastday[1].hour;
        const localEpoch = weatherData.location.localtime_epoch
        return today_fc.concat(tomorrow_fc)
            .filter((hour_fc) => hour_fc.time_epoch > (localEpoch-60*60)) //Ignore the forecast until past hour
            .slice(0, config.forecast_amount); //Keep only the next relevent hours
    }
}