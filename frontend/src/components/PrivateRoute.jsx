import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
export default function PrivateRoute({children}){
    console.log('private route ran')
    const {authData}=useContext(AuthContext);
    console.log(authData)
    return authData?.token?children:<Navigate to='/login'/>;
}