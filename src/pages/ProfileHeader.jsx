
export default function ProfileHeader(){

    const userName = JSON.parse(localStorage.getItem('userName'))
    const userPicture = JSON.parse(localStorage.getItem('userPicture'))

    return (
        <div className="flex justify-end items-center bg-transparent font-bold text-gray-500 gap-4">
            <span>Waddup {userName || "Playa"} </span>
            <img src={userPicture} alt="profile-picture" className="inline w-20 h-20 rounded-full object-cover border-2 border-transparent"/>
        </div>
    )
}