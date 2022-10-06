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

  const getLocation = query => {
    if (query === undefined || query === null) query=""
    const User = new XMLHttpRequest()

    User.open("GET", `https://ip-api.com/json/${query}?fields=2122745`, true)

    User.onreadystatechange = function () {
      if (this.readyState === 4 && this.status === 200) {
        const data = JSON.parse(User.responseText)

        if (data.status !== "success") {
          alert("An error occured, please try removing adblocker")
        }

        // here i'm trying to clear variables so they don't throw an error
        const check = (variable) => {
          let truth;
          variable === undefined ||
          variable === null
            ? truth = false
            : truth = true
          return truth
        }
        if (check(data.query)) setIP(data.query)
        if (check(data.country)) setCountry(`${data.country}`)
        if (check(data.regionName)) setRegionName(`, ${data.regionName}`)
        if (check(data.city)) setCity(`, ${data.city}`)
        if (check(data.zip)) setZip(`, ${data.zip}`)
        if (check(data.timezone)) setTimezone(data.timezone)
        if (check(data.isp)) setISP(data.isp)
        if (check(data.lat) && check(data.lon))setPosition([data.lat, data.lon])

        document.querySelector('.info').scrollIntoView()
      }
    }
    User.send()
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
          <p>{country} {regionName} {city} {zip}</p>
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
