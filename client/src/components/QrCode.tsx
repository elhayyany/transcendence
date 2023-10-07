import { BsXLg } from "react-icons/bs";
import { useEffect } from "react";
import "../styles/QrCode.css";

interface QrCodeProps {
    toggleQrCode: () => void;
}

const QrCode = ({ toggleQrCode }: QrCodeProps) => {
    useEffect(() => {
        const form: HTMLElement | null = document.getElementById("form");
        const inputs = form?.querySelectorAll("input");

        function handleInput(e: { target: any }) {
            const input = e.target;
            const nextInput = input.nextElementSibling;
            if (nextInput && input.value) {
                nextInput.focus();
                if (nextInput.value) {
                    nextInput.select();
                }
            }
        }

        function handleBackspace(e: { target: any }) {
            const input = e.target;
            if (input.value) {
                input.value = "";
                return;
            }
            input.previousElementSibling.focus();
        }

        function handleArrowLeft(e: { target: any }) {
            const previousInput = e.target.previousElementSibling;
            if (!previousInput) return;
            previousInput.focus();
        }

        function handleArrowRight(e: { target: any }) {
            const nextInput = e.target.nextElementSibling;
            if (!nextInput) return;
            nextInput.focus();
        }

        form?.addEventListener("input", handleInput);

        inputs?.forEach((input) => {
            input.addEventListener("focus", (e) => {
                setTimeout(() => {
                    e.target?.select();
                }, 0);
            });

            input.addEventListener("keydown", (e) => {
                switch (e.key) {
                    case "Backspace" || "8":
                        handleBackspace(e);
                        break;
                    case "ArrowLeft" || "37":
                        handleArrowLeft(e);
                        break;
                    case "ArrowRight" || "39":
                        handleArrowRight(e);
                        break;
                    default:
                }
            });
        });
    }, []);

    return (
        <div className="pop-up">
            <div className="overlay">
                <div className="pop-up-container">
                    <div className="flex justify-center items-center relative">
                        <div className="add-channel w-[30em] h-[60vh] max-sm:w-[80vw] max-dm:w-[80vw] text-white font-satoshi flex justify-center items-center overflow-y-scroll no-scrollbar overflow-hidden py-[2vh] max-sm:py-[4vw] max-md:py-[4vw]">
                            <div className="qr-code-container mt-[2vw]">
                                <div className="qr-code">
                                    <div className="flex flex-col justify-between items-center gap-[1.4vw]">
                                        <BsXLg
                                            className="absolute top-[1vw] right-[1vw] text-[1.5vw] hover:cursor-pointer"
                                            onClick={toggleQrCode}
                                        />
                                        <h3 className="font-medium font-satoshi text-[1.2vw]">
                                            scan to activate 2 factor
                                            authentication
                                        </h3>
                                        <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Example" />
                                        <form action="#" id="form">
                                            <div className="flex justify-center items-center">
                                                <input
                                                    type="tel"
                                                    maxLength={1}
                                                    pattern="[0-9]"
                                                    className="form-control"
                                                />
                                                <input
                                                    type="tel"
                                                    maxLength={1}
                                                    pattern="[0-9]"
                                                    className="form-control"
                                                />
                                                <input
                                                    type="tel"
                                                    maxLength={1}
                                                    pattern="[0-9]"
                                                    className="form-control"
                                                />
                                                <input
                                                    type="tel"
                                                    maxLength={1}
                                                    pattern="[0-9]"
                                                    className="form-control"
                                                />
                                                <input
                                                    type="tel"
                                                    maxLength={1}
                                                    pattern="[0-9]"
                                                    className="form-control"
                                                />
                                                <input
                                                    type="tel"
                                                    maxLength={1}
                                                    pattern="[0-9]"
                                                    className="form-control"
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="verify-btn font-medium font-satoshi"
                                            >
                                                Verify account
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QrCode;
