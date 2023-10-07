import { Link } from "react-router-dom";
import Apollo from "../assets/Apollo.jpg";

const MsgNotification = () => {
    return (
        <>
            <div className="bg-red-600 font-bold font-satoshi absolute -top-[.7vw] -right-[.5vw] text-[.6vw] w-[1vw] h-[1vw] text-center rounded-full">
                3
            </div>
            <div className="box messages-box overflow-y-scroll no-scrollbar w-[20vw]">
                <div className="display">
                    <div className="cont ">
                        <div className="container-1 m-[.6vw] p-[.5vw] flex justify-center items-center ">
                            <Link to="/chat">
                                <div className="flex justify-between items-center gap-[.6vw] max-sm:gap-[2vw] max-md:gap-[2vw] max-lg:gap-[2vw]">
                                    <img
                                        className="w-[2.5vw] h-[2.5vw] max-sm:w-[7vw] max-sm:h-[7vw] max-md:w-[4vw] max-md:h-[4vw] max-lg:w-[4vw] max-lg:h-[4vw] rounded-full"
                                        src={Apollo}
                                    />
                                    <p className="font-satoshi font-normal text-[.8vw] max-sm:text-[1vh] max-md:text-[1.1vh] max-lg:text-[1.1vh]">
                                        mamella sent you a message
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MsgNotification;
