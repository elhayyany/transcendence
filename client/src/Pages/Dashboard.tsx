import {
    BsFillBellFill,
    BsFillChatLeftTextFill,
    BsFillPersonFill,
    BsSearch,
} from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
    LiveGame,
    PublicChannel,
    Leaderboard,
    Notifications,
    MsgNotification,
    FriendComponent,
} from "./index";
import { io, Socket } from "socket.io-client";
import axios from "axios";
import "../styles/Dashboard.css";

interface User {
    id: number;
    username: string;
    photo: string;
    firstname: string;
    lastname: string;
    online: boolean;
}

interface Friend {
    id: number;
    online: boolean;
    username: string;
    photo: string;
}

interface Player {
    photo: string;
    username: string;
}

interface Game {
    roomName: string;
    player1: Player;
    player2: Player;
}

interface Score {
    score1: number;
    score2: number;
}

const Dashboard = () => {
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

    // const [userHover, setUserHover] = useState(null);
    // const handleUserHoverEnter = (userId: any) => {
    //     setUserHover(userId);
    // };
    // const handleUserHoverLeave = () => {
    //     setUserHover(null);
    // };

    const [users, setUsers] = useState<User[]>([]);
    const [query, setQuery] = useState("");
    const searchContainerRef = useRef<HTMLDivElement | null>(null);

    const [friends, setFriends] = useState<Friend[]>([]);
    const [socket, setSocket] = useState<Socket>();
    const [games, setGames] = useState<Game[]>([]);
    const [gamesMap, setGamesMap] = useState(new Map<string, Score>());

    useEffect(() => {
        setSocket(
            io("/api/stream", { withCredentials: true })
        );
    }, []);

    async function fetchPlayersData(room: any) {
        try {
            const [res1, res2] = await Promise.all([
                axios.get(
                    `/api/users/userinfos?id=${room.playerOneId}`,
                    { withCredentials: true }
                ),
                axios.get(
                    `/api/users/userinfos?id=${room.playerTwoId}`,
                    { withCredentials: true }
                ),
            ]);

            const game: Game = {
                roomName: room.roomName,
                player1: res1.data,
                player2: res2.data,
            };
            setGames((prevGames) => [...prevGames, game]);
        } catch (error) {
            console.log("error fetching ...");
        }
    }

    useEffect(() => {
        socket?.on("initRooms", (data) => {
            for (let room of data.rooms) {
                fetchPlayersData(room);
            }
            setGamesMap(new Map<string, any>(data.map));
        });

        socket?.on("addRoom", (data) => {
            fetchPlayersData(data.room);
            console.log("add ===> \n", data.map);
            setGamesMap(new Map<string, any>(data.map));
        });

        socket?.on("updateScore", (map: Map<string, Score>) => {
            console.log("update ===> \n", map);
            setGamesMap(new Map<string, any>(map));
            console.log(games);
        });

        return () => {
            socket?.off("initRooms");
            socket?.off("addRoom");
            socket?.off("updateScore");
            socket?.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        socket?.on("removeRoom", (data) => {
            console.log("remove ===> \n");
            setGamesMap(new Map<string, any>(data.map));
            const newGames: Game[] = games.filter(
                (game) => game.roomName !== data.roomName
            );
            console.log(newGames);
            setGames(newGames);
        });

        return () => {
            socket?.off("removeRoom");
        };
    }, [games]);

    useEffect(() => {
        try {
            axios
                .get("/api/users/me/friends", {
                    withCredentials: true,
                })
                .then((res) => {
                    const newFriends = res.data.friends;
                    setFriends((prevFriends) => [
                        ...prevFriends,
                        ...newFriends,
                    ]);
                });
        } catch (error) {
            console.error("Error fetching friends:", error);
        }
    }, []);

    useEffect(() => {
        const fetshData = async () => {
            try {
                const res = await axios.get(
                    `/api/users/search/all?query=${query}`,
                    { withCredentials: true }
                );
                setUsers(res.data);
            } catch (error) {
                console.log(error);
            }
        };
        fetshData();
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (
                searchContainerRef.current &&
                !searchContainerRef.current.contains(event.target)
            ) {
                setQuery("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchContainerRef]);

    return (
        <div className="my-[1vw] max-sm:my-[2vw] flex flex-col">
            <div className="first-container h-[8vh] max-sm:h-[6vh] max-md:h-[5vh] max-lg:h-[5vh] max-sm:mb-[.8vh] container-1 mx-[3vw] px-[2vw] flex justify-between items-center">
                <Link
                    to="/home"
                    className="font-black font-satoshi text-[1vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh] tracking-wider"
                >
                    SpinFrenzy
                </Link>
                <div className="flex gap-[2vw] items-center max-sm:gap-[5vw] max-md:gap-[5vw] max-lg:gap-[4vw]">
                    <div
                        className="flex flex-col items-center"
                        ref={searchContainerRef}
                    >
                        <div className="search flex items-center container-1 outline-none absolute z-10 h-[2vw] max-sm:h-[3vh] max-md:h-[2.5vh] max-lg:h-[2.5vh] top-[2.3vw] right-[13.5vw] max-sm:top-[5.2vw] max-sm:right-[27.5vw] max-md:top-[2.8vw] max-md:right-[24.5vw] max-lg:top-[2.3vw] max-lg:right-[19.5vw]">
                            <input
                                className="search-txt border-none outline-none bg-transparent float-left px-[.5vw] max-sm:px-[1vw] max-md:px-[1vw] max-lg:px-[1vw] text-[.6vw] max-sm:text-[2vw] max-md:text-[1.1vw] max-lg:text-[.8vw]"
                                type="text"
                                placeholder="search for a user"
                                onChange={(e) => setQuery(e.target.value)}
                                value={query}
                            />
                            <BsSearch className="text-[.8vw] mr-[.5vw] max-sm:mr-[1.5vw] max-md:mr-[1.5vw] max-lg:mr-[1.5vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1vh]" />
                        </div>
                        {query && (
                            <div className="results cursor-context-menu flex flex-col justify-start items-start bg-[#101010] py-[.4vw] -mr-[.8vw] mt-[23vw] w-[15vw] h-[20vw] max-sm:w-[28vw] max-sm:h-[25vw] max-sm:mt-[33vw] max-sm:py-[.6vw] max-md:w-[28vw] max-md:h-[25vw] max-md:mt-[30vw] max-md:py-[.6vw] max-lg:w-[22vw] max-lg:h-[25vw] max-lg:mt-[30vw] max-lg:py-[.6vw] overflow-y-scroll no-scrollbar overflow-hidden z-50 rounded-[.5vw]">
                                {users.map((user) => (
                                    <div
                                        className="result w-full"
                                        key={user.id}
                                    >
                                        <Link
                                            to={`/view-profile?id=${user.id}`}
                                        >
                                            <div className="container-1 flex justify-start items-center mx-[.4vw] my-[.2vw] p-[.4vw] max-sm:mx-[1vw] max-sm:my-[.5vw] max-sm:p-[.4vw] max-md:mx-[1vw] max-md:my-[.5vw] max-md:p-[.4vw]">
                                                <div className="flex justify-start items-center gap-[.6vw] max-sm:gap-[1.2vw] max-md:gap-[2vw]">
                                                    <img
                                                        className="w-[2.5vw] h-[2.5vw] max-sm:w-[6vw] max-sm:h-[6vw] max-md:w-[5vw] max-md:h-[5vw] rounded-full"
                                                        src={user.photo}
                                                        alt={user.username}
                                                    />
                                                    <p className="font-satoshi font-normal text-[.8vw] max-sm:text-[.9vh] max-md:text-[1.1vh]">
                                                        {user.username}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="iconBtn">
                        <Link to="/chat">
                            <BsFillChatLeftTextFill className="hover:scale-110 text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]" />
                        </Link>
                        <MsgNotification />
                    </div>
                    <div className="iconBtn">
                        <BsFillBellFill className="hover:scale-110 text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]" />
                        <Notifications />
                    </div>
                    <div className="iconBtn user-btn">
                        <BsFillPersonFill className="hover:scale-110 text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]" />
                        <div className="box user-box overflow-y-scroll no-scrollbar w-[8vw]">
                            <div className="display">
                                <div className="cont">
                                    <Link to="/profile">
                                        <div className="container-1 m-[.6vw] p-[.5vw] flex justify-center items-center">
                                            <div className="flex justify-between items-center gap-[.6vw]">
                                                <BsFillPersonFill className="text-[.8vw] max-sm:text-[1vh] max-md:text-[1.1vh] max-lg:text-[1.1vh]" />
                                                <h2 className="font-satoshi font-bold text-[.8vw] max-sm:text-[1vh] max-md:text-[1.1vh] max-lg:text-[1.1vh]">
                                                    profile
                                                </h2>
                                            </div>
                                        </div>
                                    </Link>
                                    <Link to="/api/logout">
                                        <div className="container-1 m-[.6vw] p-[.5vw] flex justify-center items-center">
                                            <div className="flex justify-between items-center gap-[.6vw]">
                                                <FiLogOut className="text-[.8vw] max-sm:text-[1vh] max-md:text-[1.1vh] max-lg:text-[1.1vh]" />
                                                <h2 className="font-satoshi font-bold text-[.8vw] max-sm:text-[1vh] max-md:text-[1.1vh] max-lg:text-[1.1vh]">
                                                    logout
                                                </h2>
                                            </div>
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container-1 max-sm:h-[6vh] max-md:h-[5vh] md:hidden max-md:mt-[1vw] max-sm:mb-[1vw] mx-[3vw] px-[2vw] flex justify-start items-center overflow-x-scroll no-scrollbar overflow-hidden ">
                {friends?.map((friend, index) => (
                    <FriendComponent
                        key={index}
                        index={index}
                        friend={friend}
                    />
                ))}
            </div>
            <div className="flex mx-[3vw]">
                <div className="friends-container container-1 mt-[1vw] py-[1vh] flex flex-col w-[5vw] max-sm:w-[8vw] max-sm:mr-[2vw] max-h-[100vh] justify-start items-center overflow-y-scroll no-scrollbar max-sm:hidden max-md:hidden space-y-4">
                    {friends?.map((friend, index) => (
                        <Link
                            key={index}
                            to={`/view-profile?id=${friend.id}`}
                            className="userdiv w-[2.5vw] h-[2.5vw] max-sm:w-[4vw] max-sm:h-[4vw] flex justify-center items-center"
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
                                            friend.online
                                                ? "bg-green-400"
                                                : "bg-gray-400"
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
                    ))}
                </div>
                <div className="w-full">
                    <div className="flex gap-[1vw] h-[50vh] max-sm:flex-col max-md:flex-col">
                        <div className="second-container container-1 mt-[1vw] ml-[1vw] p-[1vw] max-sm:p-[3vw] w-1/2 pb-[5vw] max-sm:ml-0 max-sm:w-full max-sm:h-full max-md:ml-0 max-md:w-full max-md:h-full max-lg:ml-[1vw]">
                            <h2 className="font-bold font-satoshi uppercase text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]">
                                Play a Game
                            </h2>
                            <div className="handler flex justify-center items-center w-full h-full mt-[2vw] max-sm:mt-0 max-md:mt-0 max-lg:mt-0">
                                <nav className="no-scrollbar gap-[.4vw] max-sm:gap-[1.2vw] max-md:gap-[1.2vw] max-lg:gap-[.5vw] flex">
                                    <Link to="/game">
                                        <div className="card easy-mode flex justify-center items-center">
                                            <p className="font-bold font-satoshi lowercase text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]">
                                                EASY
                                            </p>
                                        </div>
                                    </Link>
                                    <Link to="/game">
                                        <div className="card medium-mode flex justify-center items-center">
                                            <p className="font-bold font-satoshi lowercase text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]">
                                                Medium
                                            </p>
                                        </div>
                                    </Link>
                                    <Link to="/game">
                                        <div className="card hard-mode flex justify-center items-center">
                                            <p className="font-bold font-satoshi lowercase text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]">
                                                Hard
                                            </p>
                                        </div>
                                    </Link>
                                </nav>
                            </div>
                        </div>
                        <div className="third-container container-1 mt-[1vw] p-[1.5vw] max-sm:p-[3vw] w-1/2 overflow-y-scroll no-scrollbar max-sm:w-full max-sm:h-full max-md:w-full max-md:h-full">
                            <h2 className="font-bold font-satoshi uppercase text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]">
                                live games
                            </h2>
                            {games?.map((game, index) => (
                                <LiveGame
                                    key={index}
                                    game={game}
                                    index={index}
                                    gamesMap={gamesMap}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-[1vw] h-[50vh] max-sm:flex-col max-md:flex-col">
                        <div className="forth-container container-1 mt-[1vw] ml-[1vw] p-[1.5vw] max-sm:p-[3vw] w-1/2 overflow-y-scroll no-scrollbar max-sm:ml-0 max-sm:mt-[1.2vh] max-sm:w-full max-sm:h-full max-md:ml-0 max-md:mt-[1.2vh] max-md:w-full max-md:h-full max-lg:ml-[1vw]">
                            <h2 className="font-bold font-satoshi uppercase text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]">
                                popular public channels
                            </h2>
                            <PublicChannel />
                        </div>
                        <div className="forth-container container-1 mt-[1vw] p-[1.5vw] max-sm:p-[3vw] w-1/2 overflow-y-scroll no-scrollbar max-sm:w-full max-sm:h-full max-md:w-full max-md:h-full">
                            <h2 className="font-bold font-satoshi uppercase text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]">
                                leaderboard
                            </h2>
                            <Leaderboard />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
