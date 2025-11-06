import styles from './Weather.module.css'
import { CiSearch } from "react-icons/ci";
import clear_icon from "../assets/clear.png"
import humidity_icon from "../assets/humidity.png"
import wind_icon from "../assets/wind.png"
import { useState, useRef } from 'react';
import snow_icon from "../assets/snow.png"

const Weather = () => {
  const API_KEY = import.meta.env.VITE_APP_ID;

  const [currTemp, setTemp] = useState("");
  const [humidity, setHumidity] = useState("");
  const [wind, setWind] = useState("");
  const [cityName, setCityName] = useState("");

  const [pic,setPic] = useState(clear_icon);



  const location = useRef();

  // ✅ Fetch weather for a given city
  const search = async () => {
    const city = location.current.value; // ✅ Get input value
    if (!city) return;

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
      const response = await fetch(url);
      const data = await response.json();

      if (data.cod === "404") {
        alert("City not found!");
        location.current.value="";
        return;
      }

      console.log(data);

      setTemp(data.main.temp);
      setHumidity(data.main.humidity);
      setWind(data.wind.speed);
      setCityName(data.name);
      if(data.main.temp<=20){
        setPic(snow_icon);
      }
      location.current.value=""
     
    } catch (error) {
      console.log("Cannot fetch data", error);
    }
    
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
        />
        <CiSearch
          style={{ color: "black", cursor: "pointer" }}
          size={30}
          className={styles.myIcon}
          onClick={search}   // ✅ now properly linked
        />
      </div>

      {/* Weather Data */}
      <>
        <img src={pic} alt="" className={styles.weatherIcon} />
        <p className={styles.temperature}>{currTemp ? `${currTemp}°C` : "--"}</p>
        <p className={styles.location}>{cityName || "Enter a city"}</p>

        <div className={styles.weatherdata}>
          <div className="col">
            <img src={humidity_icon} alt="" className={styles.humid_icon} />
            <div>
              <p>{humidity ? `${humidity}%` : "--"}</p>
              <span>Humidity</span>
            </div>
          </div>
          <div className="col">
            <img src={wind_icon} alt="" className={styles.windy_icon} />
            <div>
              <p>{wind ? `${wind} Km/hr` : "--"}</p>
              <span>Wind Speed</span>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default Weather;

