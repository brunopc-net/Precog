Named after the [Egyptian god of rainstorms, weather, sky and war](https://en.wikipedia.org/wiki/Weather_god)

Live at [https://brunopc-net.github.io/weather/](https://brunopc-net.github.io/weather/)

wildfires were terrible this year in Canada. With global warming effects increasing every year, I wanted an algorithm that would advice me on what to do when I'm planning to go play outside. I also wanted something to advice me to protect from the sun, as UV can be high even if it's cloudy outside.

While I was on it, I decided to include precipitation alerts so I won't go for a long bike ride if there will be rain in two hours for exemple. I also included temperature alerts to make sure I'm aware of the conditions for my time outside.

It consists of two sections:

## Alerts

Here's the alerts displayed in the advice section:

### 🏭 Air quality (AQI-US)

You can read about Air Quality Index (U.S.) [here](https://www.airnow.gov/aqi/aqi-basics/). I choose to not use maroon AIQ color for consistency with the other alerts and to make the app more intuitive.

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

### ☀️ UV Index

You can read about UV Index [here](https://en.wikipedia.org/wiki/Ultraviolet_index).

For UV, as it fluctuate during the day, I put two alerts:
- A max UV alert (if max level is later in the day)
- A time to burn alert. Time to burn is calculated by using [Fitzpatrick](https://en.wikipedia.org/wiki/Thomas_B._Fitzpatrick)'s formula<br/>
  `(200 * skin_type_resistance)⁄(3 * UVI)` with skin type II (skin_type_resistance = 3)<br/>
  If you're skin type 1, be aware that this metric is too optimistic for you ; you should protect from sun approximatly 16% faster then what's adviced and at UV Level 2.

#### Max UV Alert
🟢 **0-2**: No alert<br/>
🟡 **3-5**: Max UV predicted: x<br/>
🟠 **6-7**: Max UV predicted: x<br/>
🔴 **8-10**: Max UV predicted: x<br/>
🟣 **11-12**: Max UV predicted: x<br/>
💀 **13+**: Max UV predicted: x<br/>

#### Time to burn

🟢 **Over predicted forecast time**: No alert<br/>
🟢ℹ️ **240+ minutes**: You will need sunscreen in x min<br/>
🟢⚠️ **120-240 minutes**: Protect your skin after x min<br/>
🟡 **30-120 minutes**: Protect your skin after x min<br/>
🟠 **20-30 minutes**: Protect your skin after x min<br/>
🔴 **17-20 minutes**: Protect your skin after x min<br/>
🟣 **15-17 minutes**: Protect your skin after x min<br/>
💀 **15- minutes**: Protect your skin after x min<br/>

### 🌡️ Temperature 

Temperature used is the  "feels like" temperature, so heat index should be considered in the summer and wind index should be considered in the winter. 

#### 🥵 Heat alerts

🟢 **12-28°C**<br/>
No alert<br/>

🟡 **28-32°C**<br/>
Caution with exercice, listen to your body<br/>
Drink proactively<br/>

🟠 **32-36°C**<br/>
Exercice moderatly, take regular breaks<br/>
Take a lot of water/electrolytes<br/>

🔴 **36-40°C**<br/>
Exercice lightly, no more then 120min Zone2<br/>
Take as much water/electrolytes as possible<br/>

🟣 **40-44°C**<br/>
Exercice very lightly, no more then 60min Zone1<br/>
Take as much water/electrolytes as possible<br/>

💀 **44+°C**<br/>
Avoid exercice, stay as cool as you can<br/>
Take as much water/electrolytes as possible<br/>

#### 🥶 Cold alerts

🟢 **12-28°C**<br/>
No alert<br/>

🟡 **6-12°C**<br/>
You may need a light jacket or sleeves<br/>

🟠 **0-6°C**<br/>
You may need winter gear, watch out for ice🧊<br/>

🔴 **-12 to 0°C**<br/>
Put winter gear<br/>

🟣 **-24 to -12°C**<br/>
Wear maximum clothing, goggles<br/>

💀 **<-24°C**<br/>
Extreme cold, stay indoors<br/>

### 🌧️🌨️ Precipitations

Support rain and snow

#### 🌧️ Rain alerts

🟢 **No rain**: No alert<br/>
🟡 **0-2mm**: Some rain drops expected<br/>
🟠 **2-6mm**: Significant rain expected<br/>
🔴 **6-12mm**: A lot of rain is expected<br/>
🟣 **12-24mm**: Deluge is expected<br/>
💀 **24+mm**: Heavy deluge is expected<br/>

#### 🌨️ Snow alerts

🟢 **No rain**: No alert<br/>
🟡 **0-5cm**: A bit of snow is expected<br/>
🟠 **5-12cm**: Significant snow expected<br/>
🔴 **12-20cm**: A lot of snow is expected<br/>
🟣 **20-30cm**: Snow storm is expected<br/>
💀 **30+cm**: Heavy snow storm is expected<br/>