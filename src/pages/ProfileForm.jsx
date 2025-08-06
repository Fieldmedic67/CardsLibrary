import { useState } from 'react';
import { useNavigate } from 'react-router-dom'

export default function ProfileForm({ userProfile, setUserProfile }) {

    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();

        console.log(event.target[0].value);

        navigate('/home')
        // localStorage.setItem('userProfile', JSON.stringify(userProfile))

    }

    return (
        <form onSubmit={(event) => handleSubmit(event)}>
            <label htmlFor="username-input"></label>
            <input type="text" id="username-input" placeholder="Type here..."/>
            <button type="submit">Submit</button>
        </form>
    )
}

