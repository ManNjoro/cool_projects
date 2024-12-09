import { create } from "apisauce";

const apiClient = create({
  baseURL: "http://192.168.100.60:8081",
});

export default apiClient;
