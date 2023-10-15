const axios = require('axios');
const fs = require('fs');

const now =  new Date();
const localdate = now.toISOString().slice(0, -14);

function getEpochMinusHours(hours){
	const local_offset = now.getTimezoneOffset() * 60;
    const local_epoch = Math.floor((new Date(now - local_offset).getTime())/1000);
	return local_epoch-(hours*60*60);
}

const epoch_min =  getEpochMinusHours(1);

const filename = "/home/bruno/horus/aqius_history.csv";

const API_TOKEN = "9fae673cccebdd595fcd3142ea113cc26b631b46";
const API_URL = "http://api.waqi.info/feed/";

const AQI_STATIONS = [
    {id: "@8695", desc: "Jardin Botanique"},
    {id: "@5463", desc: "Hochelaga (Letourneux/Ontario)"},
    {id: "@10138", desc: "St-Dominique (coin Ontario)"},
    {id: "A200071", desc: "Mile-end (Rue Waverly)"},
    {id: "A373375", desc: "Place De Chelsea (Sud du Mont-Royal)"},
    {id: "A18871", desc: "Plateau (Laurier/St-Hubert)"},
    {id: "A379009", desc: "UdeM-MIL"},
    {id: "@5922", desc: "Montreal (Vieux-port)"},
    {id: "@5448", desc: "Ride-sud (Longueuil Chambly/Briggs)"},
    {id: "@10134", desc: "Brossard (Parc Sorbonne)"},
    {id: "@8595", desc: "Échangeur Décarie"},
    {id: "@5428 ", desc: "Laval (centre)"},
    {id: "@5461", desc: "Caserne 17 (Charleroi/Pie-IX)"},
    {id: "A409114", desc: "Ahunsic (Pont viau)"},
    {id: "@10716", desc: "Roberval, York (Messorem)"},
    {id: "@8594", desc: "Verdun (Desmarchais/Wellington)"}
];

async function aqiStationCall(station) {
    return new Promise(resolve => {
        axios({
            method: 'GET',
            url: API_URL.concat(station.id),
            params: {
                token: API_TOKEN
            }
        }).then((resp) => {
            const aqi_epoch = resp.data.data.time.v;
            aqi_epoch >= epoch_min 
                ? resolve({
                    "station": station.desc,
                    aqi: resp.data.data.aqi
                }): resolve({
                    "station": station.desc,
                    aqi: 0
                });
            return;
        })
    });
}

async function getAqiReadings() {
    const promises = [];
    for(const station of AQI_STATIONS) {
        promises.push(aqiStationCall(station));
    }
    return Promise.all(promises);
}

function getAqiAvg(aqi_readings){
    const valid_readings = aqi_readings.filter(
        reading => reading.aqi > 0
    );
    console.log("aqicn.org readings from the past hour:");
    console.log(valid_readings)

    const avg_aqi = valid_readings.reduce(
        (total, reading) => total + reading.aqi, 0
    )/valid_readings.length;

    return Math.round(avg_aqi);
}

const IQAir_API_CALL = {
    method: 'GET',
    url: 'https://api.airvisual.com/v2/city',
    params: {
        key: "9bdc6823-61a5-4ee5-9e76-46b735298557",
        city: 'Montreal',
        state: 'quebec',
        country: 'canada'
    }
}

axios({
    method: 'GET',
    url: API_URL.concat('montreal'),
    params: {
        token: API_TOKEN
    }
}).then((resp) => {
    const forecast_daily = resp.data.data.forecast.daily;
    const day_forecast_pm25 = forecast_daily.pm25.filter((forecast) => {
        return forecast.day === localdate
    })[0];
    console.log("PM2.5 forecast:")
    console.log(day_forecast_pm25)

    const day_forecast_pm10 = forecast_daily.pm10.filter(forecast => {
        return localdate === forecast.day
    })[0];
    console.log("PM10 forecast:")
    console.log(day_forecast_pm10)

    const forecast_aqi_min = Math.max(day_forecast_pm25.min, day_forecast_pm10.min);
    const forecast_aqi_max = Math.max(day_forecast_pm25.max, day_forecast_pm10.max);
    const forecast_aqi_avg = Math.max(day_forecast_pm25.avg, day_forecast_pm10.avg);

    if(!fs.readFileSync(filename).includes(localdate)){
        fs.appendFileSync(filename, localdate+","+forecast_aqi_min+","+forecast_aqi_max+","+forecast_aqi_avg+",");
    }
})

getAqiReadings().then(aqi_readings => {
    const aqicn_avg = getAqiAvg(aqi_readings);
    console.log("Average AQI (past hour readings) from aqicn.org: "+aqicn_avg);
    axios(IQAir_API_CALL).then((resp) => {
        const iqair_aqi = resp.data.data.current.pollution.aqius;
        console.log("AQI from IQAir: "+iqair_aqi);
        const avg = Math.round((aqicn_avg+iqair_aqi)/2);
        console.log("AQI Average from the 2 sources: "+avg);
        
        if(now.getHours()-4 === 23){
            fs.appendFileSync(filename, avg+"\n");
        }else{
            fs.appendFileSync(filename, avg+",");
        }
    })
})
