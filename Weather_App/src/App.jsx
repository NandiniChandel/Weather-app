import './App.css'
import { CiSearch } from "react-icons/ci";
import { useState, useRef } from 'react';

const getWeatherIcon = (condition, temp) => {
  if (!condition) return "/clear.png";
  const c = condition.toLowerCase();
  if (c.includes("snow") || temp <= 0) return "/snow.png";
  if (c.includes("rain") || c.includes("drizzle")) return "/rain.png";
  if (c.includes("cloud")) return "/cloud.png";
  return "/clear.png";
};

const App = () => {
  const API_KEY = import.meta.env.VITE_APP_ID;

  const [currTemp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [wind, setWind] = useState("");
  const [cityName, setCityName] = useState("");
  const [pic, setPic] = useState("/clear.png");
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter") search();
  };

  return (
    <div className="Weather">
      <div className="searchbar">
        <input
          type="text"
          placeholder="Enter the City"
          className="input"
          ref={location}
          onKeyDown={handleKeyDown}
        />
        <CiSearch
          style={{ color: "black", cursor: "pointer" }}
          size={30}
          className="myIcon"
          onClick={search}
        />
      </div>

      {error && <p className="error">{error}</p>}

      {loading ? (
        <p className="loading">Fetching weather...</p>
      ) : (
        <>
          <img src={pic} alt="weather icon" className="weatherIcon" />
          <p className="temperature">{currTemp !== "" ? `${currTemp}°C` : "--"}</p>
          <p className="location">{cityName || "Enter a city"}</p>

          <div className="weatherdata">
            <div className="col">
              <img src="/humidity.png" alt="humidity" className="humid_icon" />
              <div>
                <p>{humidity !== "" ? `${humidity}%` : "--"}</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src="/wind.png" alt="wind" className="windy_icon" />
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

export default App;