Named after the [Egyptian god of rainstorms, weather, sky and war](https://en.wikipedia.org/wiki/Weather_god)

As the wildfires was terrible this year in Canada, I wanted an algorithm that would advice me on what to do when I'm planning to go play outside. I alco wanted something to advice me to protect from the sun, as UV can be high even if it's cloudy outside.

While I was on it, I decided to include precipitation alerts so I won't go for a long bike ride if there will be rain in two hours for exemple. I also included temperature alerts to make sure I'm aware of the conditions for my time outside.

It consists of two sections:

## Advice section

Here's the alerts displayed in the advice section:

### Air quality (AQI-US) 🏭

You can read about Air Quality Index (U.S.) [here](https://www.airnow.gov/aqi/aqi-basics/). I choose to not use tmaroon AIQ color for consistency with the other alerts and to make the app more intuitive. I also choose to use the purple alert level 🟣 for AQI > 250 to have the same range between each AQI Index levels.

🟢 **0-50** <br/>
No alert<br/>

🟡 **50-100** <br/>
Not the best, outside exposure still ok<br/>

🟠 **100-150** <br/>
Play outside with N95 mask😷<br/>
Close windows, turn on air purifier<br/>

🔴 **150-200** <br/>
Play outside max 120min with N95😷<br/>
Close windows, air purifier at moderate level<br/>

🟣 **200-250** <br/>
No exercice, 60min max outside exposure with N95😷<br/>
Close windows, air purifier at high level<br/>

🟣 **250-300** <br/>
Stay inside<br/>
Close windows, air purifier at max level<br/>

💀 **300+**<br/>
Stay inside with N95😷<br/>
Close windows, air purifier at max level<br/>

### UV Index 🏭

You can read about UV Index [here](https://en.wikipedia.org/wiki/Ultraviolet_index).

For UV, as it fluctuate during the day, I put two alerts:
- A max UV alert
- A time to burn alert. Time to burn is calculated by using [Fitzpatrick](https://en.wikipedia.org/wiki/Thomas_B._Fitzpatrick)'s formula: `(200 * skin_type_resistance)⁄(3 * UVI)` with skin type II (skin_type_resistance = 3). If you're skin type 1, be aware that this metric is too optimistic for you ; you should protect from sun approximatly 16% faster then what's adviced and at UV Level 2.

#### Max UV Alert
🟢 **0-2**: No alert<br/>
🟡 **3-5** <br/>
🟠 **6-7** <br/>
🔴 **8-10** <br/>
🟣 **11-12** <br/>
💀 **13+**<br/>

#### Time to burn

🟢 **Over predicted forecast time**: No alert<br/>
🟢ℹ️ **240+ minutes**<br/>
🟢⚠️ **120-240 minutes**<br/>
🟡 **30-120 minutes**<br/>
🟠 **20-30 minutes**<br/>
🔴 **17-20 minutes**<br/>
🟣 **15-17 minutes**<br/>
💀 **15- minutes**<br/>

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
    if (snow_cm < 4)
        return "🟡";
    if (snow_cm < 8)
        return "🟠";
    if (snow_cm < 16)
        return "🔴";
    if (snow_cm < 32)
        return "🟣";
    //32+
        return "💀";
}