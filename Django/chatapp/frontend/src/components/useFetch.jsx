import { useEffect } from "react"
import { useState } from "react"
import api from "../api"


export default function useFetch(url, options={}, method="GET") {
    const [data, setData] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchData = async() => {
        try {
            setLoading(true)
            let res;
            if (method.toUpperCase === 'POST')
                res = await api.post(url, options)
            else if (method.toUpperCase === 'PUT')
                res = await api.put(url, options)
            else if (method.toUpperCase === 'DELETE')
                res = await api.delete(url)
            else
                res = await api.get(url)
            setData(res.data)
        } catch (error) {
            setError(error.response)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchData()
    }, [url])
  return {data, loading, error}
}
