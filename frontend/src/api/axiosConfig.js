import axios from 'axios';
const instance=axios.create({
    baseURL:'http://localhost:5000/api',
})
instance.interceptors.request.use((config)=>{
    const auth=localStorage.getItem('auth')
    if(auth){
        const {token}=JSON.parse(auth);
        config.headers.Authorization=`Bearer ${token}`;
    }
    return config;
})

export default instance;