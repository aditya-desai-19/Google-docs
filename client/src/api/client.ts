import { DefaultApi } from "../../generated/api";
import axios from "axios";
import { Configuration } from "../../generated/configuration";

// Set your Basic Auth credentials
const username = "myuser";
const password = "mypassword";

// Encode credentials in Base64
const basicAuth = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;

// Create an Axios instance with headers
const axiosInstance = axios.create({
  baseURL: "http://localhost:8000", // Update with your API URL
  headers: {
    Authorization: basicAuth,
  },
});

// Initialize the API client with auth
const apiClient = new DefaultApi(new Configuration(), undefined, axiosInstance);

export default apiClient