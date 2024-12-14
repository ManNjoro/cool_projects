import { create } from "apisauce";
import cache from '../utility/cache'

const apiClient = create({
  baseURL: "http://192.168.100.11:9000/api",
});

// We are changing the implementation of the get function so that
// if one is offline the data is fetched from the cache

const get = apiClient.get
apiClient.get =async (url, params, axiosConfig) => {
  const response = await get(url, params, axiosConfig)
  if (response.ok) {
    cache.store(url, response.data)
    return response
  }
  const data = await cache.get(url)
  console.log(data);
  
  return data ? {ok: true, data} : response
}

export default apiClient;
