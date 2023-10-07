import Apollo from "../assets/Apollo.jpg";

const Leaderboard = () => {
    return (
        <div className="person-div mt-[1vw] max-sm:mt-[2.5vw] max-md:mt-[2vw] max-lg:mt-[2vw] flex justify-between container-1 px-[1.5vw] py-[.5vw] max-sm:py-[1vh] max-md:py-[1vh] max-lg:py-[1vh] items-center">
            <div className="flex items-center gap-[1vw] max-sm:gap-[1vw] max-md:gap-[1vw] max-lg:gap-[1vw]">
                <h1 className="font-black font-satoshi mr-[1vw] text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]">
                    1
                </h1>
                <img
                    className="rounded-full w-[2vw] h-[2vw] max-sm:w-[7vw] max-sm:h-[7vw] max-md:w-[5vw] max-md:h-[5vw] max-lg:w-[3.5vw] max-lg:h-[3.5vw] mr-[.5vw]"
                    src={Apollo}
                    alt="channel-pic"
                />
                <div className="flex flex-col">
                    <h2 className="font-medium font-satoshi lowercase text-[.8vw] max-sm:text-[1.2vh] max-md:text-[1.2vh] max-lg:text-[1.2vh]">
                        username
                    </h2>
                    <div className="flex gap-[1vw] max-sm:gap-[7.5vw] max-md:gap-[7.5vw] max-lg:gap-[2.5vw] items-center">
                        <h3 className="font-normal font-satoshi lowercase text-[.7vw] max-sm:text-[1.1vh] max-md:text-[1.1vh] max-lg:text-[1.1vh]">
                            games won: 24
                        </h3>
                        <h1 className="font-black font-satoshi text-[1vw] max-sm:text-[1.4vh] max-md:text-[1.4vh] max-lg:text-[1.4vh]">
                            /
                        </h1>
                        <h3 className="font-normal font-satoshi lowercase text-[.7vw] max-sm:text-[1.1vh] max-md:text-[1.1vh] max-lg:text-[1.1vh]">
                            games losses: 12
                        </h3>
                        <h1 className="font-black font-satoshi text-[1vw] max-sm:text-[1.4vh] max-md:text-[1.4vh] max-lg:text-[1.4vh]">
                            /
                        </h1>
                        <h3 className="font-normal font-satoshi lowercase text-[.7vw] max-sm:text-[1.1vh] max-md:text-[1.1vh] max-lg:text-[1.1vh]">
                            draws: 6
                        </h3>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Leaderboard;
