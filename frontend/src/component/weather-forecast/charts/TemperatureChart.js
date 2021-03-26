import React, {useContext} from 'react';
import Chart from "./Chart";
import {WeatherForecastDataContext} from "../../../context/WeatherForecastData";

function TemperatureChart() {
    const [weatherForecastData] = useContext(WeatherForecastDataContext);

    return (
        <div className="charts">
            <Chart data={weatherForecastData.avgTemp} title={'Daily average temperature'} color={"#ff8c00"}/>
            <Chart data={weatherForecastData.maxTemp} title={'Daily max temperature'} color={"#d40505"}/>
            <Chart data={weatherForecastData.minTemp} title={'Daily min temperature'} color={"#00adfc"}/>
            {/*<Chart data={weatherForecastData.wind} title={'Daily min temperature'} color={"#00adfc"}/>*/}
        </div>
    );
}

export default TemperatureChart;