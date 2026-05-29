import styles from './Weather.module.css'
import { CiSearch } from "react-icons/ci";
import clear_icon from "../assets/clear.png"
import humidity_icon from "../assets/humidity.png"
import wind_icon from "../assets/wind.png"
import snow_icon from "../assets/snow.png"
import { useState, useRef } from 'react';

const weatherIcons = {
  clear: clear_icon,
  snow: snow_icon,
};

const getWeatherIcon = (condition, temp) => {
  if (!condition) return clear_icon;
  const c = condition.toLowerCase();
  if (c.includes("snow") || temp <= 0) return snow_icon;
  return clear_icon;
};

const Weather = () => {
  const API_KEY = import.meta.env.VITE_APP_ID;

  const [currTemp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [wind, setWind] = useState("");
  const [cityName, setCityName] = useState("");
  const [pic, setPic] = useState(clear_icon);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const location = useRef();

  const search = async () => {
    const city = location.current.value.trim();
    if (!city) return;

    setLoading(true);
    setError("");

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
      const response = await fetch(url);

      // Fix: check HTTP status, not data.cod string
      if (!response.ok) {
        setError("City not found. Please try again.");
        setLoading(false);
        location.current.value = "";
        return;
      }

      const data = await response.json();

      setTemp(Math.round(data.main.temp));
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setCityName(data.name);

      // Fix: proper icon selection based on weather condition
      const weatherCondition = data.weather?.[0]?.main || "";
      setPic(getWeatherIcon(weatherCondition, data.main.temp));

      location.current.value = "";
    } catch (err) {
      setError("Network error. Please check your connection.");
      console.error("Cannot fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  // Allow search on Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") search();
  };

  return (
    <div className={styles.Weather}>
      {/* Search Bar */}
      <div className={styles.searchbar}>
        <input
          type="text"
          placeholder="Enter the City"
          className={styles.input}
          ref={location}
          onKeyDown={handleKeyDown}
        />
        <CiSearch
          style={{ color: "black", cursor: "pointer" }}
          size={30}
          className={styles.myIcon}
          onClick={search}
        />
      </div>

      {/* Error message */}
      {error && <p className={styles.error}>{error}</p>}

      {/* Loading state */}
      {loading ? (
        <p className={styles.loading}>Fetching weather...</p>
      ) : (
        <>
          <img src={pic} alt="weather icon" className={styles.weatherIcon} />
          <p className={styles.temperature}>{currTemp !== "" ? `${currTemp}°C` : "--"}</p>
          <p className={styles.location}>{cityName || "Enter a city"}</p>

          <div className={styles.weatherdata}>
            <div className={styles.col}>
              <img src={humidity_icon} alt="humidity" className={styles.humid_icon} />
              <div>
                <p>{humidity !== "" ? `${humidity}%` : "--"}</p>
                {/* Fix: span is a tag not a class */}
                <span>Humidity</span>
              </div>
            </div>
            <div className={styles.col}>
              <img src={wind_icon} alt="wind" className={styles.windy_icon} />
              <div>
                <p>{wind !== "" ? `${wind} km/h` : "--"}</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;