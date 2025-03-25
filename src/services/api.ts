import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.1.5:4444/api", // Substitua pelo IP da sua máquina
    timeout: 7000,
});