import { Link } from "react-router-dom";
import "../styles/Gamemode.css";

const GameMode = () => {
    return (
        <>
            <div className="flex flex-col justify-center items-center h-screen">
                <h1 className="xs:text-5xl xl:text-6xl font-satoshi font-black">
                    GAME MODE
                </h1>
                <p className="font-satoshi font-normal uppercase">
                    Please select a level to play in
                </p>
                <Link
                    to="/home"
                    className="absolute top-10 left-14 font-satoshi font-black"
                >
                    ← back to home
                </Link>
                <div className="mt-10 xs:flex xs:flex-wrap xs:justify-center xs:items-center xs:gap-2 xl:gap-5">
                    <Link to="/game" className="card xs:w-40 xs:h-40 xl:w-52 xl:h-52 flex justify-center items-center hover:cursor-pointer hover:scale-105">
                        <p className="font-black text-2xl">EASY</p>
                    </Link>
                    <div className="card xs:w-40 xs:h-40 xl:w-52 xl:h-52 flex justify-center items-center hover:cursor-pointer hover:scale-105">
                        <p className="font-black text-2xl">MEDIUM</p>
                    </div>
                    <div className="card xs:w-40 xs:h-40 xl:w-52 xl:h-52 flex justify-center items-center hover:cursor-pointer hover:scale-105">
                        <p className="font-black text-2xl">HARD</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default GameMode;
