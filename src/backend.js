const axios = require('axios');
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2));

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

function output(api_call, filename){
    axios(api_call).then((resp) => {
        let data_json = JSON.stringify(resp.data);
        fs.writeFile(filename, data_json, (err) => {
            if (err) console.log(err);
        });
    });
}

if (!fs.existsSync(DATA_DIR))
    fs.mkdirSync(DATA_DIR);

output(AQIUS_API_CALL, AQIUS_FILE);
output(WEATHER_API_CALL, WEATHER_FILE);