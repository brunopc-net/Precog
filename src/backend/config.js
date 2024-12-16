const args = require('minimist')(process.argv.slice(2));

function requireArguments(to_be_supplied){
    for(const arg of to_be_supplied) {
        if(args[arg]) continue;
        console.log("Argument '"+arg+"' not supplied");
        process.exit(1);
    }
}

requireArguments([
    'AQIUS_API_KEY',
    'WEATHER_API_KEY',
    'MY_PHONE_NUMBER',
    'TWILLIO_ACCOUNT_SID',
    'TWILLIO_AUTH_TOKEN'
]);

const config = {
    forecast_amount: 12,
    user: {
        birth: "1990/09/01",
        phone: args.MY_PHONE_NUMBER,
        skin_type: 3, //https://www.openuv.io/dashboard?tab=4
        zones: [
            {
                hr: 55,
                fb: 15
            },
            {
                hr: 110,
                fb: 15
            },
            {
                hr: 155,
                fb: 28
            }
        ],
        thresholds: {
            uv: {
                index: [2, 5, 7, 10, 12],
                time: [240, 120, 60, 30, 15]
            },
            temp: {
                heat: [28, 32, 36, 40, 44],
                cold: [12, 6, 0, -12, -24]
            },
            precp: {
                rain: [0, 2, 6, 12, 24],
                snow: [0, 5, 12, 20, 30]
            },
            aqi: [
                50, 100, 150, 200, 300
            ],
            pm25_24h: 35
        },
        alert_schedule: ["08", "12", "16", "20"]
    },
    api:{
        twillio: {
            sid: args.TWILLIO_ACCOUNT_SID,
            token: args.TWILLIO_AUTH_TOKEN,
            from: '+18063046209'
        },
        airvisual: {
            req: {
                method: 'GET',
                url: 'https://api.airvisual.com/v2/city',
                params: {
                    key: args.AQIUS_API_KEY,
                    city: 'Montreal',
                    state: 'quebec',
                    country: 'canada'
                }
            }
        },
        weatherapi: {
            req: {
                method: 'GET',
                url: 'http://api.weatherapi.com/v1/forecast.json',
                params: {
                  key: args.WEATHER_API_KEY,
                  q: "Montreal",
                  days: '3',
                  aqi: "yes"
                }
            }
        }
    },
    data: {
        dir: "src/data",
        weatherfile: "/weather.json",
        userfile: "/user.json"
    }
};

module.exports = config;