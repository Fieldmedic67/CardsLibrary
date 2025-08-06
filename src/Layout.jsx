import { Outlet } from "react-router-dom";
import ProfileForm from "./pages/ProfileForm.jsx";
import React, {useState} from "react";
import UserProfileContext from "./context/UserProfileContext.jsx";

export function Layout() {

    const [userProfile, setUserProfile ] = useState({userName : 'default'});

    return (
    <div> 
        <>
            <UserProfileContext.Provider value={{ userProfile, setUserProfile }}>
                <Outlet />
            </UserProfileContext.Provider>
        </>
</div>
)
}