import axios from "axios";

const directionsApi = axios.create({
    baseURL: "https://api.mapbox.com/directions/v5/mapbox/driving",
    params: {
        alternatives: false,
        geometries: "geojson",
        overview: "simplified",
        steps: false,
        language: "es",
        access_token: "pk.eyJ1IjoianVsc2tkaiIsImEiOiJjbGw0OHkwMWswM2p0M2RwZ2N1ZHR1Zm1mIn0.SMXtRW0yK-xaMtYzQG4Q0w"
    }
});

export default directionsApi
