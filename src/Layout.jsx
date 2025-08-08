import { Outlet } from "react-router-dom";
import ProfileForm from "./pages/ProfileForm.jsx";
import React, {useState} from "react";
import UserProfileContext from "./context/UserNameContext.jsx";
import UserPictureContext from "./context/UserPictureContext.jsx";

export function Layout() {

    const [userName, setUserName] = useState('default');
    const [userPicture, setUserPicture] = useState("https://static1.thegamerimages.com/wordpress/wp-content/uploads/2022/01/Anime.png")



    return (
    <div>
        <>
            <UserProfileContext.Provider value={{ userName, setUserName }}>
            <UserPictureContext.Provider value={{ userPicture, setUserPicture}}>
                <Outlet />
            </UserPictureContext.Provider>
            </UserProfileContext.Provider>
        </>
</div>
)
}