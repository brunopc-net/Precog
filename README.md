Named after the [Egyptian god of rainstorms, weather, sky and war](https://en.wikipedia.org/wiki/Weather_god)

As the wildfires was terrible this year in Canada, I wanted an algorithm that would advice me on what to do when I'm planning to go play outside.

It consists of two sections:

## Advice section

Here's the alerts displayed in the advice section:

### Air quality 🏭

You can read about Air Quality Index (U.S.) [here](https://www.airnow.gov/aqi/aqi-basics/). I choose to not use the purple/maroon AIQ color for consistency with the other alerts and to make the app more intuitive.

💀 **AQI US >= 300**<br/>
Stay inside with N95😷<br/>
Close windows, air purifier at max level<br/>

🔴 **AQI US >= 250** <br/>
Stay inside<br/>
Close windows, air purifier at max level<br/>

🟠 **AQI US >= 200** <br/>
60min max outside exposure with N95😷<br/>
Close windows, air purifier at high level<br/>

🟠 **AQI US >= 150** <br/>
120min max outside exposure with N95😷<br/>
Close windows, air purifier at moderate level<br/>

🟡 **AQI US >= 100** <br/>
Play outside with N95 mask😷<br/>
Close windows, turn on air purifier<br/>

⚠️ **AQI US >= 50** <br/>
Not the best, outside exposure still ok<br/>

🟢 **AQI US < 50** <br/>
No alert<br/>