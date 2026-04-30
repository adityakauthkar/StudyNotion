import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = async (
  method,
  url,
  bodyData = null,
  headers = {},
  params = {}
) => {
  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers,      
    params,
  });
};
