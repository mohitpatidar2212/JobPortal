import {React, useEffect} from "react";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
    let user
    useEffect(() => {
        const updateUser = () => {
          const storedUser = localStorage.getItem('user');
          user = storedUser ? JSON.parse(storedUser) : null
        };
    
        updateUser(); 
        window.addEventListener('userChanged', updateUser);
    
        return () => {
          window.removeEventListener('userChanged', updateUser);
        };
      }, []);

    return !user?<Outlet/>:<Navigate to="login"/>;
}

export default ProtectedRoute;