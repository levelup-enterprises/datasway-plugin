import React, { useReducer } from "react";

let reducer = (location, newLocation) => {
  return { ...location, ...newLocation };
};

// Set states
const initialState = { region: null, county: null };

// Create contexts
const LocationContext = React.createContext();

function LocationProvider(props) {
  const [location, setLocation] = useReducer(reducer, initialState);

  return (
    <LocationContext.Provider value={{ location, setLocation }}>
      {props.children}
    </LocationContext.Provider>
  );
}

export { LocationContext, LocationProvider };
