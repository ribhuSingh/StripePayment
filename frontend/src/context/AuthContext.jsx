import {createContext,useState,useEffect} from 'react';
export const AuthContext=createContext();
export const AuthProvider=({children})=>{
    const [authData,setAuthData]=useState(()=>{
        const stored=localStorage.getItem('auth');
        try{
            const parsed=JSON.parse(stored);
            return parsed && typeof parsed==='object'?parsed:null;
        }
        catch(err){
            console.warn('Invalid JSON in localStorage.auth - clearing it.');
            localStorage.removeItem('auth');
            return null;
        }
    });
    const login=(userData)=>{
        localStorage.setItem('auth',JSON.stringify(userData));
        console.log('localstoragedata',localStorage.getItem('auth'))
        setAuthData(userData);
        console.log(authData)
    };
    const logout=()=>{
        localStorage.removeItem('auth');
        setAuthData(null)
    }
    return (
        <AuthContext.Provider value={{authData,login,logout}}>
            {children}
        </AuthContext.Provider>
    )
}