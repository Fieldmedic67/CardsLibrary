import { useState, useContext, use } from 'react';
import { useNavigate } from 'react-router-dom'
import userNameContext from "../context/UserNameContext.jsx";
import userPictureContext from "../context/UserPictureContext.jsx";
import avatar1 from "../assets/avatar1.jpg"
import avatar2 from "../assets/avatar2.jpg"
import avatar3 from "../assets/avatar3.jpg"
import avatar4 from "../assets/avatar4.jpg"
import avatar5 from "../assets/avatar5.jpg"
import avatar6 from "../assets/avatar6.jpg"


export default function ProfileForm() {

    const { setUserName } = useContext(userNameContext);
    const { userPicture, setUserPicture} = useContext(userPictureContext);
    const navigate = useNavigate();
    const gamerPics = [
        avatar1, avatar2, avatar3, avatar4, avatar5, avatar6
    ];

    function handleSubmit(event) {
        event.preventDefault();
        const userInput = event.target[0].value;

        setUserName(userInput);

        localStorage.setItem('userName', JSON.stringify(userInput));
        localStorage.setItem('userPicture', JSON.stringify(userPicture));

        navigate('home')
    }


    return (
        <div>

            <form onSubmit={(event) => handleSubmit(event)}
                  className="flex flex-col items-center gap-4 text-xl font-bold mt-6 text-center font-mono">
                <div className="max-w-sm mx-auto p-4">
                    <label htmlFor="username-input"></label>
                    <input type="text" id="username-input" placeholder="Your Username Here..."
                           className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none foucs:ring-2 focus:ring-blue-500 "/>
                    {/*<input type="file" accept="image/*" onChange={(event) => handleFileChange(event)} />*/}
                </div>

                <h3>Choose Your Gamer Avatar:</h3>
                <div className="flex flex-wrap gap-4 justify center">
                    {gamerPics.map((url, index) => (
                        <label>
                            <img key={index} src={url} alt='cool pic bro' onClick={() => setUserPicture(url)}
                                 className="w-20 h-20 rounded-full object-cover border-2 border-transparent hover:border-blue-500 hover: scale-105 transition cursor-pointer active:border-red-500 "/>
                            <input type="radio" name="gamerpic" id="gamerpic"/>
                        </label>

                    ))}
                </div>

                <div className="relative inline-flex group">
                    <div
                        className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg filter group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200">
                    </div>
                    <button
                        className="relative inline-flex items-center justify-center px-5 py-2 text-base font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-600 rounded"
                    >
                        Submit
                    </button>
                </div>

                <button>Click Me!</button>
            </form>
        </div>





)
}

