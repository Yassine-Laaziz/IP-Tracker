import "./index.css"
import { createRoot } from "react-dom/client"
import { useState } from "react"
// Map API
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

const root = createRoot(document.getElementById("root"))

const App = () => {
  const [IP, setIP] = useState()
  const [country, setCountry] = useState()
  const [regionName, setRegionName] = useState()
  const [city, setCity] = useState()
  const [zip, setZip] = useState()
  const [timezone, setTimezone] = useState()
  const [ISP, setISP] = useState()
  const [position, setPosition] = useState([50, 50])

  const getLocation = (query) => {
    if (query === undefined || query === null) query = ""

    fetch(`http://ip-api.com/json/${query}?fields=58361`)
      .then((response) => response.json())
      .then((data) => {
        if (data.status !== "success") {
          alert(
            `An error occured, please try removing adblocker, Message: ${data.message}`
          )
        }

        if (data.query) setIP(data.query)
        if (data.country) setCountry(`${data.country}`)
        if (data.regionName) setRegionName(`, ${data.regionName}`)
        if (data.city) setCity(`, ${data.city}`)
        if (data.zip) setZip(`, ${data.zip}`)
        if (data.timezone) setTimezone(data.timezone)
        if (data.isp) setISP(data.isp)
        if (data.lat && data.lon) setPosition([data.lat, data.lon])

        document.querySelector(".info").scrollIntoView()
      })
  }

  const handleSubmit = () => {
    getLocation(document.querySelector(".search-bar").value)
  }

  window.onload = () => getLocation()
  return (
    <div className="App">
      <div className="banner">
        <h1>IP adress Tracker</h1>
        <div className="search">
          <input
            type="text"
            placeholder="Search for any IP Address Or Domain"
            className="search-bar"
          />
          <div className="searchBtn" onClick={handleSubmit}>
            <div className="icon" />
          </div>
        </div>
      </div>
      <MapContainer
        center={position}
        zoom={13}
        scrollWheelZoom={true}
        className="map"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position}>
          <Popup>Here is your Target, mr 007</Popup>
        </Marker>
      </MapContainer>
      <div className="info">
        <div className="ip-address">
          <p className="title">IP ADDRESS</p>
          <p>{IP}</p>
        </div>
        <div className="location">
          <p className="title">LOCATION</p>
          <p>
            {country} {regionName} {city} {zip}
          </p>
        </div>
        <div className="timezone">
          <p className="title">TIMEZONE</p>
          <p>{timezone}</p>
        </div>
        <div className="ISP">
          <p className="title">ISP</p>
          <p>{ISP}</p>
        </div>
      </div>
    </div>
  )
}

root.render(<App />)
