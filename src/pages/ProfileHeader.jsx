import { useState} from "react";

export default function ProfileHeader(){

    const userName = JSON.parse(localStorage.getItem('userName'))
    const userPicture = JSON.parse(localStorage.getItem('userPicture'))

    const [ showProfileMenu, setShowProfileMenu ] = useState(false);

    return (
        <div className="flex justify-end items-center bg-transparent font-bold text-gray-500 gap-4">
            <span>Waddup {userName || "Playa"} </span>


            <img onClick-={() => setShowProfileMenu(true)} src={userPicture} alt="profile-picture" className="inline w-20 h-20 rounded-full object-cover border-2 border-transparent hover: cursor-pointer" />
            {showProfileMenu && (
            <div>
                <ul>
                    <li>option 1</li>
                    <li>option 2</li>
                    <li>option 3</li>
                </ul>
            </div>
        )}
        </div>
    )
}