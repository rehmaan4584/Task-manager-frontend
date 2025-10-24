import axios from "axios";

export const api = axios.create({
    baseURL: "https://task-manager-backend-production-675e.up.railway.app/api"
})

api.interceptors.request.use((config)=>{
    const noAuthRoutes = ['/auth/signup','/auth/login']
    if(!noAuthRoutes.includes(config.url)){
        const token = localStorage.getItem('token');
        if(token){
            config.headers.Authorization = `Bearer ${token}`
        }
    }
    return config;
})