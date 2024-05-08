/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from "react";

const StateContext = createContext({
  notification: null,
  setNotification: () => {},
});

export const ContextProvider = ({ children }) => {
  const [notification, _setNotification] = useState("");

  const setNotification = (message) => {
    _setNotification(message);
    setTimeout(() => {
      _setNotification("");
    }, 5000);
  };
  return (
    <StateContext.Provider
      value={{
        notification,
        setNotification,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
