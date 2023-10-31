//=====================================================================================================================
//=================================================== Modules =========================================================

const axios = require('axios');
const fs = require('fs');

const config = require('./config');

const Weather = require('./Weather');

//=====================================================================================================================
//=================================================== Classes =========================================================

class SmsService {
    constructor(){
        this.twillio = require('twilio')(
            config.api.twillio.sid,
            config.api.twillio.token
        );
    }

    sendSms(message){
        this.twillio.messages.create({
            body: message,
            from: config.api.twillio.from,
            to: config.user.phone
        })
        .then(message =>
            console.log(message.sid)
        )
        .done();
    }
}

class AlertService {
    constructor(){
    }

    alert(msg){
        new SmsService().sendSms(msg);
    }

    isAlertTime(){
        const hour = new Date()
            .toLocaleTimeString('fr-CA', {
                timeZone: 'America/Montreal'
            })
            .substring(0, 2)
        return config.user.alert_schedule.includes(hour);
    }
}

class FileService {
    constructor(file){
        this.file = file;
    }

    export(data){
        if (!fs.existsSync(config.data.dir)){
            fs.mkdirSync(config.data.dir);
        }
        const data_json = JSON.stringify(data);
        const fullpath = config.data.dir+this.file;
        fs.writeFile(fullpath, data_json, (err) => {
            if (err) console.log(err);
            else console.log("Data exported to "+fullpath);
        });
    }
}

class ApiService {
    constructor(request){
        this.request = request;
    }

    execute(func){
        axios(this.request)
            .then((resp) => {
                console.log(this.request.method+" request to "+this.request.url);
                func(resp);
            }).catch(function (error) {
                console.log(error);
            })
    }
}

//=====================================================================================================================
//====================================================== Main =========================================================

function alertPollutionIfNeeded(aqius){
    const as = new AlertService();
    if(as.isAlertTime()){
        if(aqius > 100)
            as.alert("🏭AQI is high("+aqius+"). Close windows, use air purifier");
        else
            console.log("🏭AQI is low("+aqius+"), SMS alert not needed");
    }
}

new ApiService(config.api.airvisual.req).execute((aq_resp) => {
    const aqius = aq_resp.data.data.current.pollution.aqius;
    alertPollutionIfNeeded(aqius);
    new ApiService(config.api.weatherapi.req).execute((weather_resp) => {
        new FileService(config.data.weatherfile).export(
            new Weather(weather_resp.data, aqius)
        );
    });
});