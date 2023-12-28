import axios from "axios";

const searchApi = axios.create({
    baseURL: "https://api.mapbox.com/geocoding/v5/mapbox.places",
    params: {
        limit: 5,
        languaje: "es",
        access_token: "pk.eyJ1IjoianVsc2tkaiIsImEiOiJjbGw0OHkwMWswM2p0M2RwZ2N1ZHR1Zm1mIn0.SMXtRW0yK-xaMtYzQG4Q0w"
    }
});

export default searchApi
