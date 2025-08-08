import { useState} from "react";
import '../CSS-sheets/ProfileHeader.css';


export default function ProfileHeader(){

    const userName = JSON.parse(localStorage.getItem('userName'))
    const userPicture = JSON.parse(localStorage.getItem('userPicture'))

    const [ showProfileMenu, setShowProfileMenu ] = useState(false);
    const [ showUserNameForm, setShowUserNameForm ] = useState(false);

    return (
        <div className="flex justify-end items-center bg-transparent font-bold text-gray-500 gap-4">
            <span>Waddup {userName || "Playa"} </span>


            <img onClick={() => setShowProfileMenu(!showProfileMenu)} src={userPicture} alt="profile-picture" id="profile-picture" className="inline w-20 h-20 rounded-full object-cover border-2 border-transparent hover: cursor-pointer" />
            {showProfileMenu && (
            <div className='hidden-menu-container'>
                <ul className="option-list">
                    <li><button onClick={(event) => console.log(event)} className="hidden-menu-option" key="change-username" type="button">Change Username</button></li>
                    <li className="hidden-menu-option" key="change-profile-picture">Change Profile Picture</li>
                </ul>
            </div>
        )}

            {showUserNameForm && (
                <div className="hidden-change-username">
                    <form onSubmit={(event) => console.log(event)}>
                        <label>
                            Change Username
                            <input type="text"/>
                        </label>
                        <button type="submit">Submit</button>
                    </form>
                </div>
            )}

        </div>
    )
}