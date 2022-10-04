import "./index.css"
import { createRoot } from "react-dom/client"
import { useState } from "react"
// Map API
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"

const root = createRoot(document.getElementById("root"))

const App = () => {
  const [IP, setIP] = useState()
  const [location, setLocation] = useState()
  const [timezone, setTimezone] = useState()
  const [ISP, setISP] = useState()
  const [position, setPosition] = useState([51.505, -0.09])

  const getLocation = (IP) => {
    if (IP === undefined) IP = ""
    const User = new XMLHttpRequest()

    User.onreadystatechange = function() {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(User.responseText)
        if (data.status !== "success")
          alert("An error occured, please try removing adblocker")
        setIP(data.query)
        setLocation(`${data.country}, ${data.regionName}, ${data.city}, ${data.zip}`)
        setTimezone(data.timezone)
        setISP(data.isp)
        setPosition([data.lat, data.lon])
      }
    }

    User.open(
      "GET",
      `https://ip-api.com/json/${IP}?fields=status,message,country,regionName,city,zip,lat,lon,timezone,isp,query`,
      true
    )
    User.send()
  }
  window.addEventListener("load", () => getLocation())

  const handleSubmit = () => getLocation(document.querySelector(".search-bar").value)

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
      <div className="map">
        <MapContainer center={position} zoom={13} scrollWheelZoom={true} className="map">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position}>
            <Popup>Here is your Target, mr 007</Popup>
          </Marker>
        </MapContainer>
      </div>
      <div className="info">
        <div className="ip-address">
          <p className="title">IP ADDRESS</p>
          <p>{IP}</p>
        </div>
        <div className="location">
          <p className="title">LOCATION</p>
          <p>{location}</p>
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
