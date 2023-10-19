const axios = require('axios');
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2));
const { getAirAlerts } = require("./Alerts");

const DATA_DIR = "src/data";
const AQIUS_FILE = DATA_DIR+"/aqius.json";
const WEATHER_FILE = DATA_DIR+"/weather.json";

const AQIUS_API_CALL = {
    method: 'GET',
    url: 'https://api.airvisual.com/v2/city',
    params: {
        key: args.AQIUS_API_KEY,
        city: 'Montreal',
        state: 'quebec',
        country: 'canada'
    }
}

const WEATHER_API_CALL = {
    method: 'GET',
    url: 'https://weatherapi-com.p.rapidapi.com/forecast.json',
    params: {
      q: "Montreal",
      days: '2'
    },
    headers: {
      'X-RapidAPI-Key': args.WEATHER_API_KEY,
      'X-RapidAPI-Host': 'weatherapi-com.p.rapidapi.com'
    }
}

function sendSms(message){
    const accountSid = args.TWILLIO_ACCOUNT_SID;
    const authToken = args.TWILLIO_AUTH_TOKEN;
    const twillio = require('twilio')(accountSid, authToken);
    twillio.messages.create({
        body: message,
        from: '+18063046209',
        to: args.MY_PHONE_NUMBER
    })
    .then(message =>
        console.log(message.sid)
    )
    .done();
}

function outputFile(resp, filename){
    let data_json = JSON.stringify(resp.data);
    fs.writeFile(filename, data_json, (err) => {
        if (err) console.log(err);
    });
}

function getHours(){
    return new Date()
        .toLocaleTimeString('fr-CA', {
            timeZone: 'America/Montreal'
        })
        .substring(0, 2)
}

if (!fs.existsSync(DATA_DIR))
    fs.mkdirSync(DATA_DIR);


axios(AQIUS_API_CALL).then((resp) => {
    const alertTime = ["08", "12", "16", "20"].includes(getHours);
    const highAqius = 100 < resp.data.data.current.pollution.aqius;
    if(alertTime && highAqius){
        sendSms(getAirAlerts(aqius).join(" "));
    }
    outputFile(resp, AQIUS_FILE)
});
axios(WEATHER_API_CALL).then((resp) => 
    outputFile(resp, WEATHER_FILE)
);