import axios from "axios";

export const api = axios.create({
    baseURL: "https://lash-design-api.vercel.app/api", // Removi o /api daqui
    // baseURL: "http://localhost:3000/api", // Removi o /api daqui
    timeout: 7000,
});