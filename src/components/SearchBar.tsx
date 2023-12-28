import { ChangeEvent, useContext, useRef } from "react";
import { PlacesContext } from "../context";
import { SearchResults } from ".";

export const SearchBar = () => {

  const {searchPlacesByTerm} = useContext(PlacesContext)

  const debounceRef = useRef<NodeJS.Timeout>();

  const onQueryChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      //? TODO: Buscar o ejecutar la busqueda
      // console.log(e.target.value);

      //? Ejecutar la busqueda
      searchPlacesByTerm(e.target.value);

    }, 1000);
  };

  return (
    <div className="search-container">
      <input
        type="text"
        className="form-control"
        placeholder="Buscar Lugar..."
        onChange={onQueryChange}
      />
      <SearchResults />
    </div>
  );
};
