import axios from "axios";
import { router } from '@inertiajs/react';
import { toast } from "sonner"
axios.defaults.withCredentials = true
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    cors:false,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});
API.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            // Session дууссан үед login руу чиглүүлэх
            toast.error("Хэрэглэгчийн session дууссан байна. Дахин нэвтэрнэ үү.",{position:"top-center"});
            router.visit('/login')
        } else if (error.response?.status === 419) {
            // CSRF token expired үед reload хийх
            toast.error("CSRF token хүчингүй байна. Хуудас шинэчлэгдэж байна.")
            window.location.reload()
        }
        return Promise.reject(error)
    }
)
export default API;