import React from "react";
import './Legend.css';

function Legend(){
    return (
        <div className="legend">
            🏭 AQI-US Index<br/>
            ☀️ UV Index<br/>
            🌡️ Temperature, °C<br/>
            🌬️ Wind, kph<br/>
            🕗 Time<br/>
            🌧️ Rain, mm<br/>
            🌨️ Snow, cm
        </div>
    );
}

export default Legend;