import axios from "axios";

export const apiClient = axios.create({
  baseURL: "http://localhost:3002/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function apiRequest<T>(config: any): Promise<T> {
  const res = await apiClient.request<T>(config);
  return res.data;
}
