import React from 'react'
import ReactDOM from 'react-dom/client'
import { MapsApp } from './MapsApp'
import mapboxgl from 'mapbox-gl'

mapboxgl.accessToken = 'pk.eyJ1IjoianVsc2tkaiIsImEiOiJjbGw0OHkwMWswM2p0M2RwZ2N1ZHR1Zm1mIn0.SMXtRW0yK-xaMtYzQG4Q0w'

if (!navigator.geolocation) {
  alert('Tu navegador no soporta geolocalización')
  throw new Error('Geolocalización no soportada')
}


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <MapsApp />
  </React.StrictMode>,
)
