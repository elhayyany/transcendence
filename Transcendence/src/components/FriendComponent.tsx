import { useState } from "react";
import { Link } from "react-router-dom";

interface Friend {
    id: number;
    online: boolean;
    username: string;
    photo: string;
}

interface FriendComponent {
    index: number;
    friend: Friend;
}

const FriendComponent = ({ index, friend }: FriendComponent) => {
    const [isHovered, setIsHovered] = useState(null);
    const [isActiveUser, setIsActiveUser] = useState(null);
    const handleMouseEnter = (userId: any) => {
        setIsHovered(userId);
    };
    const handleMouseLeave = () => {
        setIsHovered(null);
    };
    const handleUserClick = (userId: any) => {
        setIsActiveUser(userId === isActiveUser ? null : userId);
    };

    return (
        <Link
            key={index}
            to={`/view-profile?id=${friend.id}`}
            className="userdiv w-[2.5vw] h-[2.5vw] max-sm:w-[4vw] max-sm:h-[4vw] flex justify-center items-center mr-[2vw]"
        >
            <button
                className="friend-bn absolute"
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                onClick={() => handleUserClick(index)}
            >
                <div className="hover:scale-105">
                    <img
                        className="w-[2.5vw] h-[2.5vw] max-sm:w-[4vw] max-sm:h-[4vw] rounded-full"
                        src={friend.photo}
                        alt="friend-pic"
                    />
                    <span
                        className={`rounded-full ${
                            friend.online ? "bg-green-400" : "bg-gray-400"
                        } w-[0.5vw] h-[0.5vw] max-sm:w-[.8vw] max-sm:h-[.8vw] absolute top-0 right-0`}
                    ></span>
                </div>
                {isHovered == index && (
                    <div className="absolute top-1/2 left-[3vw] max-sm:left-[5vw] -translate-y-1/2 rounded-[.5vw] px-[.8vw] py-[.4vw] bg-black font-bold font-satoshi text-[.6vw] max-sm:text-[1.2vw] ">
                        {friend.username}
                    </div>
                )}
            </button>
        </Link>
    );
};

export default FriendComponent;
