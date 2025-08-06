import {useState, useContext, use} from 'react';
import { useNavigate } from 'react-router-dom'
import userProfileContext from "../context/UserProfileContext.jsx";
import userPictureContext from "../context/UserProfileContext.jsx";


export default function ProfileForm() {

    const { setUserProfile } = useContext(userProfileContext)
    const { setUserPicture } = useContext(userPictureContext)
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();

        console.log(event.target[0].value);

        navigate('/home')
        // localStorage.setItem('userProfile', JSON.stringify(userProfile))
        setUserProfile({ userName: event.target[0].value});
    }

    function handleFileChange(event) {
        console.log(event);
        setUserPicture(event.target.value)
    }

    return (
        <form onSubmit={(event) => handleSubmit(event)}>
            <label htmlFor="username-input"></label>
            <input type="text" id="username-input" placeholder="Type here..."/>
            <input type="file" accept="image/*" onChange={(event) => handleFileChange(event)} />
            <button type="submit">Submit</button>
        </form>
    )
}

