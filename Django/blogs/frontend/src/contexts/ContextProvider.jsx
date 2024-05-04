import { createContext, useState } from "react";

const StateContext = createContext({
    currentUser: null,
    token:null
})

export const ContextProvider = ({children}) => {
    const [user,  setUser] = useState({})
    const [token, _setToken] = useState(null)
    const setToken = (token) => {
        _setToken()
    }
    return (
        <StateContext.Provider value={{}}>

        </StateContext.Provider>
    )
}