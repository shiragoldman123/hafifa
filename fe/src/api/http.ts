import axios from "axios";

export const apiClientWrite = axios.create({
  baseURL: "http://localhost:3001/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export const apiClientRead = axios.create({
  baseURL: "http://localhost:3002/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export async function apiRequestWrite<T>(config: any): Promise<T> {
  const res = await apiClientWrite.request<T>(config);
  return res.data;
}

export async function apiRequestRead<T>(config: any): Promise<T> {
  const res = await apiClientRead.request<T>(config);
  return res.data;
}
