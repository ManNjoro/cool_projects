/* eslint-disable react/prop-types */
import { createContext } from "react";


export const GlobalContext = createContext(null)

export default function ContextProvider({children}) {
    return <GlobalContext.Provider>{children}</GlobalContext.Provider>
}