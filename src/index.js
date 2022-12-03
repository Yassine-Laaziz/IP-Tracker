import "./index.css"
import { createRoot } from "react-dom/client"
import { useCallback, useEffect, useRef, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import axios from "axios"

const root = createRoot(document.getElementById("root"))

const App = () => {
  // country details
  const [population, setPopulation] = useState(0)
  const [capital, setCapital] = useState("")
  const [callingCode, setCallingCode] = useState("")
  const [currency, setCurrency] = useState("")
  const [languages, setLanguages] = useState("")
  // location
  const [country, setCountry] = useState("")
  const [region, setRegion] = useState("")
  const [city, setCity] = useState("")
  const [zip, setZip] = useState("")
  // timezone
  const [timezone, setTimezone] = useState("")
  const [utcOffset, setUtcOffset] = useState("")
  // query
  const [IP, setIP] = useState("")
  const [queryVersion, setQueryVersion] = useState("")
  const [network, setNetwork] = useState("")
  const [asn, setAsn] = useState("")
  // map
  const [position, setPosition] = useState([0, 0])
  const [zoom, setZoom] = useState(1)

  const mapJson = (Json) => {
    // country details
    setPopulation(Json.country_population)
    setCapital(Json.country_capital)
    setCallingCode(Json.country_calling_code)
    setCurrency(Json.currency_name)
    setLanguages(Json.languages)
    // location
    setCountry(Json.country_name)
    setRegion(Json.region)
    setCity(Json.city)
    setZip(Json.postal)
    // timezone
    setTimezone(Json.timezone)
    setUtcOffset(Json.utc_offset)
    // query
    setIP(Json.ip)
    setQueryVersion(Json.version)
    setNetwork(Json.network)
    setAsn(Json.asn)
    // map
    if (Json.latitude && Json.longitude) setPosition([Json.latitude, Json.longitude])
  }

  const input = useRef()
  const getLocation = useCallback(async () => {
    const query = input.current.value
    try {
      if (query) {
        const res = await axios.get(`https://ipapi.co/${query}/json/`)
        if (!res?.data?.error) mapJson(res.data)
        else alert("Invalid IP Address")
      } else {
        const foundIp = (
          await axios.get("https://api.ipify.org?format=json&callback=?")
        ).data.ip
        if (!foundIp || foundIp === IP) return
        const res = await axios.get(`https://ipapi.co/${foundIp}/json/`)
        if (res) mapJson(res.data)
      }
      setZoom(1)
    } catch (e) {
      alert("something went wrong, try to remove adblocker")
    }
  }, [IP])

  useEffect(() => {
    getLocation()
  }, [getLocation])

  return (
    <div className="App">
      <div className="banner">
        <h1>IP adress Tracker</h1>
        <div className="search">
          <input
            type="text"
            placeholder="Search for any IP Address"
            className="search-bar"
            ref={input}
          />
          <div className="searchBtn" onClick={() => getLocation()}>
            <div className="icon" />
          </div>
        </div>
      </div>
      <MapContainer
        center={position}
        zoom={zoom}
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
        <div className="country-details">
          <p className="title">Country details</p>
          {population ? <p>population: {population}</p> : null}
          {capital && <p>capital: {capital}</p>}
          {callingCode && <p>calling code: {callingCode}</p>}
          {currency && <p>currency: {currency}</p>}
          {languages && <p>languages: {languages}</p>}
        </div>
        <div className="location">
          <p className="title">LOCATION</p>
          {country && <p>country: {country}</p>}
          {region && <p>region: {region}</p>}
          {city && <p>city: {city}</p>}
          {zip && <p>zip: {zip}</p>}
        </div>
        <div className="timezone">
          <p className="title">TIMEZONE</p>
          {timezone && <p>timezone: {timezone}</p>}
          {utcOffset && <p>utc offset: {utcOffset}</p>}
        </div>
        <div className="query">
          <p className="title">QUERY</p>
          {IP && <p>ip: {IP}</p>}
          {queryVersion && <p>version: {queryVersion}</p>}
          {network && <p>network: {network}</p>}
          {asn && <p>asn: {asn}</p>}
        </div>
      </div>
    </div>
  )
}

root.render(<App />)
