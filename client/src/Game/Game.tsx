import { ReactP5Wrapper } from "@p5-wrapper/react";
import { io, Socket } from "socket.io-client";
import { useEffect, useState } from "react";
import GameField from "./GameField";
import axios from "axios";
import "../styles/Game.css";
import waiting from "../assets/waiting.json";
import Lottie from "lottie-react";

interface Ball {
    x: number;
    y: number;
    velocityX: number;
    velocityY: number;
    speed: number;
}

interface GameData {
    ball: Ball;
    leftPlayerY: number;
    rightPlayerY: number;
    leftScore: number;
    rightScore: number;
}

interface PlayerData {
    username: string;
    photo: string;
}

function Game() {
    const [started, setStarted] = useState<boolean>(false);

    const [roomName, setRoomName] = useState<string>();

    const [socket, setSocket] = useState<Socket | null>(null);

    const [data, setData] = useState<GameData>();
    const [playerOne, setPlayerOne] = useState<PlayerData>();
    const [playerTwo, setPlayerTwo] = useState<PlayerData>();
    const [scale, setScale] = useState<number>(1);
    const [endMatch, setEndMatch] = useState<boolean>(false);

    const handleWindowResize = () => {
        if (window.innerWidth <= 600) {
            setScale(0.4);
        } else if (window.innerWidth <= 800) {
            setScale(0.5);
        } else if (window.innerWidth <= 1000) {
            setScale(0.6);
        } else if (window.innerWidth <= 1400) {
            setScale(0.8);
        } else {
            setScale(1);
        }
    };

    useEffect(() => {
        setSocket(io("/api/game", { withCredentials: true }));
    }, []);

    useEffect(() => {
        handleWindowResize();
        window.addEventListener("resize", handleWindowResize);

        return () => {
            window.removeEventListener("resize", handleWindowResize);
        };
    }, []);

    useEffect(() => {
        console.log("SOCKET ...");
        socket?.on("join_room", (obj: any) => {
            console.log("JOINING ROOM ...");
            setData(obj.data);
            setRoomName(obj.roomName);

            axios
                .get(
                    `/api/users/userinfos?id=${obj.playerOneId}`,
                    { withCredentials: true }
                )
                .then((res) => {
                    setPlayerOne({
                        username: res.data.username,
                        photo: res.data.photo,
                    });
                });

            axios
                .get(
                    `/api/users/userinfos?id=${obj.playerTwoId}`,
                    { withCredentials: true }
                )
                .then((res) => {
                    setPlayerTwo({
                        username: res.data.username,
                        photo: res.data.photo,
                    });
                });

            setStarted(true);
        });

        socket?.on("update", (data: GameData) => {
            setData(data);
        });

        socket?.on("endMatch", () => {
            setEndMatch(true);
        });

        return () => {
            socket?.off("update");
            socket?.off("join_room");
            socket?.disconnect();
        };
    }, [socket]);

    const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
        const divY = event.currentTarget.getBoundingClientRect().top;
        const posY = (event.clientY - divY) * (1 / scale);

        socket?.emit("move", { posY, roomName });
    };

    if (endMatch) {
        socket?.disconnect();
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen absolute">
                <h2 className="font-bold font-satoshi text-[1.5vw] text-center leading-[2.2vw]">
                    The match has ended.
                    <br />
                    Would you like to play again?
                </h2>
                <div className="flex gap-[3vw] mt-[2vw]">
                    <button
                        className="hover:scale-105 text-white font-bold font-satoshi w-[10vw] h-[3vw] container-1 text-[1vw]"
                        onClick={() => window.location.reload()}
                    >
                        Yes
                    </button>

                    <button
                        className="hover:scale-105 text-white font-bold font-satoshi w-[10vw] h-[3vw] container-1 text-[1vw]"
                        onClick={() => window.location.replace("/home")}
                    >
                        No
                    </button>
                </div>
            </div>
        );
    } else if (!started) {
        return (
            <div className="flex flex-col items-center justify-center w-full h-screen absolute">
                <h2 className="font-bold font-satoshi text-[1.5vw] text-center">
                    Waiting for a Player to join...
                </h2>
                <Lottie animationData={waiting} loop={true} className="w-60" />
            </div>
        );
    }
    return (
        <div className="bg-black h-screen flex flex-col py-12  items-center space-y-4  overflow-y-scroll">
            <div className="absolute top-4 left-4 flex items-center space-x-2">
                <div className=" w-12 h-12 rounded-full bg-gray-400 "></div>
                <span className="text-white text-xl font-bold">
                    leave the match
                </span>
            </div>
            <div className="flex space-x-16 lg:space-x-48 items-center">
                <span className="flex flex-col items-center space-y-2">
                    <img
                        src={playerOne?.photo}
                        className="h-16 lg:h-20 w-16 lg:w-20 rounded-full"
                    />
                    <span className="text-white text-lg font-mono font-bold">
                        {playerOne?.username}
                    </span>
                </span>
                <span className="text-4xl lg:text-6xl text-white font-bold">
                    VS
                </span>
                <span className="flex flex-col items-center space-y-2">
                    <img
                        src={playerTwo?.photo}
                        className="h-16 lg:h-20 w-16 lg:w-20 rounded-full"
                    />
                    <span className="text-white text-lg font-mono font-bold">
                        {playerTwo?.username}
                    </span>
                </span>
            </div>
            <div className="canvas" onMouseMove={handleMouseMove}>
                <ReactP5Wrapper
                    sketch={GameField}
                    leftPlayerY={data?.leftPlayerY}
                    rightPlayerY={data?.rightPlayerY}
                    ball={data?.ball}
                />
            </div>
            <div className="flex flex-col items-center">
                <span className="text-2xl lg:text-4xl text-white font-bold underline">
                    score
                </span>
                <div className="flex space-x-16 lg:space-x-48 items-center">
                    <span className="text-white text-2xl lg:text-4xl font-black">
                        {data?.leftScore}
                    </span>
                    <span className="text-white text-2xl lg:text-4xl font-black">
                        -
                    </span>
                    <span className="text-white text-2xl lg:text-4xl font-black">
                        {data?.rightScore}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Game;
