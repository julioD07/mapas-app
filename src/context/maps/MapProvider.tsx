import { useContext, useEffect, useReducer } from "react";
import { AnySourceData, LngLatBounds, Map, Marker, Popup } from "mapbox-gl";
import { MapContext } from "./MapContext";
import { mapReducer } from "./MapReducer";
import { PlacesContext } from "..";
import { directionsApi } from "../../apis";
import { DirectionsResponseInterface } from "../../interfaces/directions";

export interface MapState {
  isMapReady: boolean;
  map: Map | undefined;
  markers: Marker[];
}

const INITIAL_STATE: MapState = {
  isMapReady: false,
  map: undefined,
  markers: [],
};

interface props {
  children: JSX.Element | JSX.Element[];
}

export const MapProvider = ({ children }: props) => {
  const [state, dispatch] = useReducer(mapReducer, INITIAL_STATE);
  const { places } = useContext(PlacesContext);

  useEffect(() => {
    state.markers.forEach((marker) => marker.remove());

    const newMarkers: Marker[] = [];

    for (const place of places) {
      //? Obtener las coordenadas
      const [lng, lat] = place.center;
      // ? Crear el popup
      const popup = new Popup().setHTML(`
        <h6>${place.text}</h6>
        <p>${place.place_name}</p>`);
      //? Crear el marcador
      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(state.map!);
      // ? Agregar el marcador al array
      newMarkers.push(newMarker);
    }

    //TODO Limpiar el polyline
    dispatch({ type: "setMarkers", payload: newMarkers });
    //TODO Nuevos marcadores
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [places]);

  const setMap = (map: Map) => {
    const myLocationPopup = new Popup().setHTML(`
            <h4>Aqui estoy</h4>
            <p>${map.getCenter().lat},${map.getCenter().lng}</p>
        `);
    new Marker({
      color: "#61DAFB",
    })
      .setLngLat(map.getCenter())
      .setPopup(myLocationPopup)
      .addTo(map);
    dispatch({ type: "setMap", payload: map });
  };

  const getRouteBetweenPoints = async (
    start: [number, number],
    end: [number, number]
  ) => {
    const resp = await directionsApi.get<DirectionsResponseInterface>(
      `/${start.join(",")};${end.join(",")}`
    );
    const { distance, geometry, duration } = resp.data.routes[0];
    const { coordinates: coords } = geometry;

    let kms = distance / 1000;
    kms = Math.round(kms * 100);
    kms /= 100;

    const minutes = Math.floor(duration / 60);
    console.log({ kms, minutes });

    const bounds = new LngLatBounds(start, start);

    coords.forEach((coord) => {
      const newCoord: [number, number] = [coord[0], coord[1]];
      bounds.extend(newCoord);
    });

    state.map?.fitBounds(bounds, {
      padding: 200,
    });

    //? Polyline
    const sourceData: AnySourceData = {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coords,
            },
          },
        ],
      },
    };

    //TODO Limpiar el polyline si existe
    if (state.map?.getSource("RouteString")) {
      state.map?.removeLayer("RouteString");
      state.map?.removeSource("RouteString");
    } 

    state.map?.addSource("RouteString", sourceData);

    state.map?.addLayer({
      id: "RouteString",
      type: "line",
      source: "RouteString",
      layout: {
        "line-join": "round",
        "line-cap": "round",
      },
      paint: {
        "line-color": "#61DAFB",
        "line-width": 8,
      },
    });
  };

  return (
    <MapContext.Provider
      value={{
        ...state,

        //? Methods
        setMap,
        getRouteBetweenPoints,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
