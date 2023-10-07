import { Link } from "react-router-dom";

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

interface LiveGameProps {
    game: Game;
    index: number;
    gamesMap: Map<string, Score>;
}

const LiveGame = ({ game, index, gamesMap }: LiveGameProps) => {
    return (
        <Link key={index} to="/game">
            <div
                className="game-div mt-[1vw] max-sm:mt-[2.5vw] max-md:mt-[2vw] max-lg:mt-[2vw] flex container-1 px-[1.5vw] py-[.5vw] max-sm:py-[1vh] max-md:py-[1vh] max-lg:py-[1vh] justify-between items-center"
                title="Click to watch the game"
            >
                <div className="flex items-center gap-5 max-sm:gap-[1vw] max-md:gap-[1vw] max-lg:gap-[1vw]">
                    <img
                        className="ppic rounded-full w-[2vw] h-[2vw] max-sm:w-[7vw] max-sm:h-[7vw] max-md:w-[5vw] max-md:h-[5vw] max-lg:w-[3.5vw] max-lg:h-[3.5vw] mr-[.5vw]"
                        src={game.player1.photo}
                        alt="profile-pic"
                    />
                    <h2 className="username font-medium font-satoshi text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]">
                        {game.player1.username}
                    </h2>
                </div>
                <h1 className="font-black font-satoshi text-[1vw] max-sm:text-[1.4vh] max-md:text-[1.4vh] max-lg:text-[1.4vh]">
                    {gamesMap.get(game.roomName)?.score1}
                </h1>
                <h1 className="vs font-black font-satoshi text-[1vw] max-sm:text-[1.4vh] max-md:text-[1.4vh] max-lg:text-[1.4vh]">
                    VS
                </h1>
                <h1 className="font-black font-satoshi text-[1vw] max-sm:text-[1.4vh] max-md:text-[1.4vh] max-lg:text-[1.4vh]">
                    {gamesMap.get(game.roomName)?.score2}
                </h1>
                <div className="flex items-center gap-5 max-sm:gap-[1vw] max-md:gap-[1vw] max-lg:gap-[1vw]">
                    <h2 className="username font-medium font-satoshi text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]">
                        {game.player2.username}
                    </h2>
                    <img
                        className="ppic rounded-full w-[2vw] h-[2vw] max-sm:w-[7vw] max-sm:h-[7vw] max-md:w-[5vw] max-md:h-[5vw] max-lg:w-[3.5vw] max-lg:h-[3.5vw] ml-[.5vw]"
                        src={game.player2.photo}
                        alt="profile-pic"
                    />
                </div>
            </div>
        </Link>
    );
};

export default LiveGame;
