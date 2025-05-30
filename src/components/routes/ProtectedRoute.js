import {useContext } from "react"
import { MyUserContext } from "../../configs/Context"
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({children, allowedRoles}) =>{
    const user = useContext(MyUserContext);
    if (user === null){
       return <Navigate to="/login" replace />;
    }

    if(!allowedRoles.includes(user.role)){
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

export default ProtectedRoute;