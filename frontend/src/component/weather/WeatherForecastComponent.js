import React from 'react';
import {
    getDayName,
    getDayTemperatureDailyForecast,
    getHumidityDailyForecast,
    getNightTemperatureDailyForecast,
    getPrecipitationDailyForecast,
    getRainDailyForecast,
    getSnowDailyForecast,
    getWindDailyForecast
} from "./WeatherForecastGetterFunctions";
import {calculateSunriseSunset, getFeatherName} from "./TodayWeatherFunctions";
import {MapPin, Sunrise, Sunset} from "react-feather";

export default function WeatherForecastComponent(props) {

    const weatherForecast = props.weatherForecast;
    const indexOfDailyForecast = props.indexOfDailyForecast;

    const {timezone_offset, daily} = weatherForecast;
    let dailyForecast = [];
    let count = 0;

    if (weatherForecast.length !== 0 ) {daily.forEach( oneDay => {
        if (count > 0 && count < 5) {
            let sunrise = new Date((oneDay.sunrise + timezone_offset - 3600) * 1000);
            let sunset = new Date((oneDay.sunset + timezone_offset - 3600) * 1000);

            dailyForecast.push({
                month: sunrise.getMonth() + 1,
                date: sunrise.getDate(),
                day: sunrise.getDay(),
                sunrise: calculateSunriseSunset(sunrise),
                sunset: calculateSunriseSunset(sunset),
                dailyTemp: (oneDay.temp.day).toFixed(1),
                dayTemp: oneDay.temp.day,
                nightTemp: oneDay.temp.night,
                wind: (oneDay.wind_speed).toFixed(1),
                humidity: (oneDay.humidity).toFixed(0),
                precipitation: (oneDay.pop * 100).toFixed(0),
                rain: (oneDay.rain) ? (oneDay.rain).toFixed(1) : 0,
                snow: (oneDay.snow) ? (oneDay.snow).toFixed(1) : 0,
                weather: oneDay.weather[0].main,
            })
        }
        count += 1;
    })}

    const changeIndexOfDailyForecast = (index) => {
        props.setIndexOfDailyForecast(index);
    }

    const ForecastFeatherTag = (dailyForecast.length !== 0) ?
        getFeatherName(dailyForecast[indexOfDailyForecast].weather) :
        "div";

    return (
        <div className="info-side">
            <div className="today-info-container">
                <div className="today-info">
                    <div className="forecast-icon">
                        <ForecastFeatherTag />
                    </div>
                    <div>
                        <span className="title">DAY</span>
                        <span className="value">{getDayTemperatureDailyForecast(dailyForecast, indexOfDailyForecast)} °C</span>
                    </div>
                    <div>
                        <span className="title">NIGHT</span>
                        <span className="value">{getNightTemperatureDailyForecast(dailyForecast, indexOfDailyForecast)} °C</span>
                    </div>
                    <div>
                        <span className="title">WIND</span>
                        <span className="value">{getWindDailyForecast(dailyForecast, indexOfDailyForecast)} km/h</span>
                    </div>
                </div>
                <div className="today-info">
                    <div>
                        <span className="title">PRECIPITATION</span>
                        <span className="value">{getPrecipitationDailyForecast(dailyForecast, indexOfDailyForecast)} %</span>
                    </div>
                    <div>
                        <span className="title">RAIN</span>
                        <span className="value">{getRainDailyForecast(dailyForecast, indexOfDailyForecast)} mm</span>
                    </div>
                    <div>
                        <span className="title">SNOW</span>
                        <span className="value">{getSnowDailyForecast(dailyForecast, indexOfDailyForecast)} mm</span>
                    </div>
                    <div>
                        <span className="title">HUMIDITY</span>
                        <span className="value">{getHumidityDailyForecast(dailyForecast, indexOfDailyForecast)} %</span>
                    </div>
                </div>
            </div>

            <div className="week-container">
                <ul className="week-list">
                    {dailyForecast.map((oneDayForecast, index) => (
                        <li key={index}
                            data-index={index}
                            className={(index === indexOfDailyForecast) ? "daily-weather-forecast active" : "daily-weather-forecast"}
                            onClick={() => changeIndexOfDailyForecast(index)}>
                            <span className="day-name">{oneDayForecast.month}. {oneDayForecast.date}.</span>
                            <span className="day-name">{getDayName(oneDayForecast.day)}</span>
                            <div className="sunrise-container">
                                <Sunrise className="sunrise-icon"/>
                                <span className="day-name">{oneDayForecast.sunrise}</span>
                            </div>
                            <div className="sunset-container">
                                <Sunset className="sunset-icon"/>
                                <span className="day-name">{oneDayForecast.sunset}</span>
                            </div>
                            <span className="day-temp">{oneDayForecast.dailyTemp}°C</span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="location-container">
                <button className="location-button">
                    <MapPin className="location-icon"/>
                    <span>Change location not working</span>
                </button>
            </div>
        </div>
    );
}
