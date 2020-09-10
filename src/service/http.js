import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: `http://dummy.restapiexample.com/api/v1/employees`,
});
