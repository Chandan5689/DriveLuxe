import { useEffect, useState } from "react";
import { AuthContext } from "./authContextValue";

export const AuthProvider = ({children}) => {
   
    const [authToken,setAuthToken] = useState(localStorage.getItem('authToken'));
    const [userId,setUserId] = useState(localStorage.getItem('userId'));
    const [username, setUsername] = useState(localStorage.getItem('username'));
    const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));

    //EFfect to keep localstorage in sync with auth state
    useEffect(()=>{
        if (authToken) {
            localStorage.setItem('authToken',authToken);
        }else{
            localStorage.removeItem('authToken')
        }
        if (userId) {
            localStorage.setItem('userId',userId);
        } else {
            localStorage.removeItem('userId');
        }
        if (username) {
            localStorage.setItem('username', username);
        } else {
            localStorage.removeItem('username');
        }
        if (userEmail) {
            localStorage.setItem('userEmail', userEmail);
        } else {
            localStorage.removeItem('userEmail');
        }
    },[authToken,userId,username,userEmail]);

    // Logs in a user by setting their token and ID
    const login = (token,id,name,email) =>{
        setAuthToken(token);
        setUserId(id);
        setUsername(name || null);
        setUserEmail(email || null);
    }


    const logout = () =>{
        setAuthToken(null);
        setUserId(null);
        setUsername(null);
        setUserEmail(null);
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new Event('popstate'));
    }

    const authContextValue = {
        authToken,userId,username,userEmail,
        isAuthenticated: !!authToken, //Boolean flag for quick check
        login,
        logout,
    };

    return(
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    )
}