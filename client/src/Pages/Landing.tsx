    import "../styles/Landing.css";
import backgroundImg from "../assets/ping.gif";
import { Link } from "react-router-dom";

const Landing = () => {
    return (
        <>
            <div
                className="back"
                style={{
                    backgroundImage: "url(" + backgroundImg + ")",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100vh",
                    zIndex: -1,
                }}
            ></div>
            <div className="text-white flex font-satoshi flex-col items-center justify-center h-screen absolute top-0 left-0 w-full">
                <div className="containe flex flex-col justify-center items-center mb-[2vw]">
                    <div className="flex flex-col justify-center items-center">
                        <p className="font-black text-[8vw] max-sm:text-[12vw] font-satoshi">
                            SpinFrenzy
                        </p>
                        <p className="font-light text-center text-[1.2vw] max-sm:text-[3vw] font-satoshi uppercae -mt-[2vw] mb-[1.5vw] max-sm:-mt-[3.5vw] max-sm:mb-[5vw]">
                            aka, ft_transcendence
                        </p>
                    </div>
                </div>
                <div className="w-[20vw] max-sm:w-[50vw] font-semibold text-[1vw] max-sm:text-[2.5vw] flex flex-col justify-between gap-[1vw]">
                    <Link
                        className="container h-[2.5vw] max-sm:h-[5vw] rounded-[.6vw] flex justify-center items-center font-bold hover:scale-105"
                        to="/api/auth/signin"
                    >
                        42 Intra
                    </Link>
                    <Link
                        className="container h-[2.5vw] max-sm:h-[5vw] rounded-[.6vw] flex justify-center items-center font-bold hover:scale-105"
                        to="/api/auth/google/signin"
                    >
                        Google
                    </Link>
                </div>
            </div>
        </>
    );
};

export default Landing;
