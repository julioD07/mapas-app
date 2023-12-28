import { useEffect, useReducer } from "react";
import { PlacesContext } from "./PlacesContext";
import { placesReducer } from "./placesReducer";
import { getUserLocation } from "../../helpers";
import { searchApi } from "../../apis";
import { Feature, PlacesResponseInterface } from "../../interfaces/places";

export interface PlacesState {
  isLoading: boolean;
  userLocation?: [number, number];
  isLoadingPlaces: boolean;
  places: Feature[];
}

const INITIAL_STATE: PlacesState = {
  isLoading: true,
  userLocation: undefined,
  isLoadingPlaces: false,
  places: [],
};

interface props {
  children: JSX.Element | JSX.Element[];
}

export const PlacesProvider = ({ children }: props) => {
  const [state, dispatch] = useReducer(placesReducer, INITIAL_STATE);

  useEffect(() => {
    getUserLocation().then((lngLat) =>
      dispatch({ type: "setUserLocation", payload: lngLat })
    );
  }, []);

  const searchPlacesByTerm = async (query: string): Promise<Feature[]> => {
    if (query.length === 0){
      dispatch({ type: "setPlaces", payload: [] });
       return [] //TODO Limpiar State
    }

    if (!state.userLocation)
      throw new Error("No se ha podido obtener la ubicación del usuario");

    //? Iniciamos la carga de lugares
    dispatch({ type: "setLoadingPlaces" });

    //? Hacemos la petición a la API
    const resp = await searchApi.get<PlacesResponseInterface>(
      `/${query}.json`,
      {
        params: {
          proximity: state.userLocation.join(","),
        },
      }
    );
    
    //? Guardamos los lugares en el state
    dispatch({ type: "setPlaces", payload: resp.data.features });

    return resp.data.features;
  };

  return (
    <PlacesContext.Provider
      value={{
        ...state,

        //? Methods
        searchPlacesByTerm,
      }}
    >
      {children}
    </PlacesContext.Provider>
  );
};
