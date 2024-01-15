import apiFactory from "@/api/factory.api"
import axios from "axios";

export function mockAxios() {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  apiFactory.setAxiosInstance(mockedAxios);
  return mockedAxios;
}

export function mockAxiosJWT() {
  const mockedAxios = axios as jest.Mocked<typeof axios>;
  apiFactory.setAxiosJWTInstance(mockedAxios);
  return mockedAxios;
}

