import { useState, useContext, use } from 'react';
import { useNavigate } from 'react-router-dom'
import userNameContext from "../context/UserNameContext.jsx";
import userPictureContext from "../context/UserPictureContext.jsx";


export default function ProfileForm() {

    const { setUserName } = useContext(userNameContext);
    const { setUserPicture } = useContext(userPictureContext);
    const navigate = useNavigate();
    const gamerPics = [
        "https://i.pinimg.com/736x/81/7e/31/817e31e32b2f2fefa062da3ba7bc6a9b.jpg",
        "https://i.pinimg.com/236x/7a/8b/ea/7a8bea29793d95b978244c46165ed567.jpg",
        "https://wallpapers.com/images/hd/xbox-360-profile-pictures-5tsfsz64h3jkz31g.jpg",
        "https://i.pinimg.com/originals/cf/3d/5b/cf3d5bdf61a0db1d65d88517555f4cee.jpg",
        "https://wallpapers.com/images/hd/xbox-360-profile-pictures-lhsi6jgychy82r61.jpg",
        "https://ih1.redbubble.net/image.820767998.6979/flat,800x800,075,f.u1.jpg",
    ];

    function handleSubmit(event) {
        event.preventDefault();
        console.log(event.target[0].value);
        navigate('/home')
        // localStorage.setItem('userProfile', JSON.stringify(userProfile))
        setUserName(event.target[0].value);
    }

    // function handleFileChange(event) {
    //     console.log(event);
    //     setUserPicture(event.target.value)
    // }

    return (
        <form onSubmit={(event) => handleSubmit(event)} className="flex flex-col items-center gap-4 text-xl font-bold mt-6 text-center font-mono">
            <div className="max-w-sm mx-auto p-4">
                <label htmlFor="username-input"></label>
                <input type="text" id="username-input" placeholder="Your Username Here..." className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none foucs:ring-2 focus:ring-blue-500 " />
                {/*<input type="file" accept="image/*" onChange={(event) => handleFileChange(event)} />*/}
            </div>

            <h3>Choose Your Gamer Avatar:</h3>
            <div className="flex flex-wrap gap-4 justify center">
                {gamerPics.map((url, index) => (
                    <img key={index} src={url} alt='cool pic bro' onClick={() => setUserPicture(url)}
                        className="w-20 h-20 rounded-full object-cover border-2 border-transparent hover:border-blue-500 hover: scale-105 transition cursor-pointer" />
                ))}
            </div>

            <div class="relative inline-flex group">
                <div
                    className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#44BCFF] via-[#FF44EC] to-[#FF675E] rounded-xl blur-lg filter group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200">
                </div>
                <button
                    className="relative inline-flex items-center justify-center px-5 py-2 text-base font-bold text-white transition-all duration-200 bg-gray-900 border-2 border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 hover:bg-gray-600 rounded"
                >
                    Submit
                </button>
            </div>
        </form>
    )
}

