import { Link } from "react-router-dom";
import "../styles/Navbar.css";
import { useState } from "react";

const Navbar = () => {
    const [navOpen, setNavOpen] = useState(false);

    return (
        <div className="nav">
            <div className="nav-container">
                <div className="navbar">
                    <div
                        className="menu-toggle"
                        onClick={() => setNavOpen(!navOpen)}
                    >
                        <div
                            className={navOpen ? "hamBox hamBoxOpen" : "hamBox"}
                        >
                            <span
                                className={navOpen ? "lineTop spin" : "lineTop"}
                            ></span>
                            <span
                                className={
                                    navOpen ? "lineBottom spin" : "lineBottom"
                                }
                            ></span>
                        </div>
                    </div>
                </div>
                <div
                    className="nav-overlay"
                    style={{
                        top: navOpen ? "0" : "-100%",
                        transitionDelay: navOpen ? "0s" : "0s",
                    }}
                >
                    <ul className="nav-links">
                        <li className="nav-item flex items-start">
                            1 •
                            <Link
                                to="/home"
                                onClick={() => setNavOpen(!navOpen)}
                                style={{
                                    top: navOpen ? "0" : "120px",
                                    transitionDelay: navOpen ? "0.6s" : "0s",
                                }}
                            >
                                Home
                            </Link>
                            <div className="nav-item-wrapper"></div>
                        </li>
                        <li className="nav-item flex items-start">
                            2 •
                            <Link
                                to="/chat"
                                onClick={() => setNavOpen(!navOpen)}
                                style={{
                                    top: navOpen ? "0" : "120px",
                                    transitionDelay: navOpen ? "0.7s" : "0s",
                                }}
                            >
                                Chat
                            </Link>
                            <div className="nav-item-wrapper"></div>
                        </li>
                        <li className="nav-item flex items-start">
                            3 •
                            <Link
                                to="/profile"
                                onClick={() => setNavOpen(!navOpen)}
                                style={{
                                    top: navOpen ? "0" : "120px",
                                    transitionDelay: navOpen ? "0.8s" : "0s",
                                }}
                            >
                                Profile
                            </Link>
                            <div className="nav-item-wrapper"></div>
                        </li>
                        <li className="nav-item flex items-start">
                            4 •
                            <Link
                                to="/friends"
                                onClick={() => setNavOpen(!navOpen)}
                                style={{
                                    top: navOpen ? "0" : "120px",
                                    transitionDelay: navOpen ? "0.8s" : "0s",
                                }}
                            >
                                Friends
                            </Link>
                            <div className="nav-item-wrapper"></div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
