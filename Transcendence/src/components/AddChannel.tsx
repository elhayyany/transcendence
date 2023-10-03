import { BsCheck, BsImage } from "react-icons/bs";
import { useState } from "react";
import "../styles/AddChannel.css";

type Props = {
    togglePopup: () => void;
    addChannel: (channelProps: { name: string; img: File | null }) => void;
};

const AddChannel = ({ togglePopup, addChannel }: Props) => {
    const [channelName, setChannelName] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [isProtected, setIsProtected] = useState(false);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const handleChange = (e: any) => {
        setChannelName(e.target.value);
    };

    const handleSave = () => {
        if (channelName !== "" && (isPublic || isPrivate || isProtected) && selectedImage) {
            addChannel({ name: channelName, img: selectedImage });
            setChannelName("");
            setSelectedImage(null);
            togglePopup();
        }
    };

    const handlePublicCheck = () => {
        setIsPublic(!isPublic);
        setIsPrivate(false);
        setIsProtected(false);
    };

    const handlePrivateCheck = () => {
        setIsPrivate(!isPrivate);
        setIsPublic(false);
        setIsProtected(false);
    };

    const handleProtectedCheck = () => {
        setIsProtected(!isProtected);
        setIsPublic(false);
        setIsPrivate(false);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        setSelectedImage(file);
    };

    return (
        <div className="pop-up">
            <div className="overlay">
                <div className="pop-up-container">
                    <div className="flex justify-center items-center relative">
                        <div className="add-channel w-[30em] max-sm:w-[80vw] max-dm:w-[80vw] text-white font-satoshi flex justify-center items-center overflow-y-scroll no-scrollbar overflow-hidden py-[2vh] max-sm:py-[4vw] max-md:py-[4vw]">
                            <div className="pop-up w-[25em] max-sm:w-full max-md:w-full flex flex-col gap-[.5vw] max-sm:gap-[2vw] max-md:gap-[2vw] max-sm:mx-[4vw] max-md:mx-[4vw]">
                                <div className="flex flex-col items-center gap-[.5vw] max-sm:gap-[2.5vw] max-md:gap-[2.5vw]">
                                    <h3 className="text-[1em] uppercase font-semibold max-sm:text-[3vw] max-md:text-[2vw]">
                                        Add a new Channel
                                    </h3>
                                    <label
                                        htmlFor="imageInput"
                                        className=" label relative"
                                    >
                                        <img
                                            src={
                                                selectedImage
                                                    ? URL.createObjectURL(
                                                          selectedImage
                                                      )
                                                    : ""
                                            }
                                            className="uploaded w-[8vw] h-[8vw] max-sm:w-[25vw] max-sm:h-[25vw] max-md:w-[20vw] max-md:h-[20vw] rounded-full bgwhite cursor-pointer object-cover"
                                        />
                                        <h2
                                            className={`absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2 ${
                                                selectedImage ? "hidden" : ""
                                            }`}
                                        >
                                            <BsImage className="text-[2vw] max-sm:text-[5vw] max-md:text-[5vw] max-lg:text-[2vw] cursor-pointer" />
                                        </h2>
                                    </label>
                                </div>
                                <div className="flex flex-col items-start mt-[1vw]">
                                    <h3 className="text-[1em] uppercase max-sm:text-[3vw] max-md:text-[2vw]">
                                        Channel Name
                                    </h3>
                                    <input
                                        onChange={handleChange}
                                        type="text"
                                        maxLength={25}
                                        className="w-full h-[3vw] mt-2 max-sm:w-full max-sm:h-[5vh] max-md:w-full max-md:h-[5vh] rounded-[.5vw] max-sm:rounded-[1.2vw] max-md:rounded-[1.2vw] input-container outline-none indent-[1vw] text-[1vw] max-sm:text-[3vw] max-md:text-[2vw]"
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <h3 className="text-[1em] uppercase max-sm:text-[3vw] max-md:text-[2vw]">
                                        Private Channel
                                    </h3>
                                    <span
                                        className="check-span w-[3vw] h-[3vw] max-sm:w-[10vw] max-sm:h-[10vw] max-md:w-[6vw] max-md:h-[6vw] rounded-[.5vw] max-sm:rounded-[1.2vw] flex justify-center items-center cursor-pointer"
                                        onClick={handlePrivateCheck}
                                    >
                                        {isPrivate && (
                                            <BsCheck className="check-icon text-[1.5vw] max-sm:text-[5vw] max-md:text-[4vw]" />
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <h3 className="text-[1em] uppercase max-sm:text-[3vw] max-md:text-[2vw]">
                                        Public Channel
                                    </h3>
                                    <span
                                        className="check-span w-[3vw] h-[3vw] max-sm:w-[10vw] max-sm:h-[10vw] max-md:w-[6vw] max-md:h-[6vw] rounded-[.5vw] max-sm:rounded-[1.2vw] flex justify-center items-center cursor-pointer"
                                        onClick={handlePublicCheck}
                                    >
                                        {isPublic && (
                                            <BsCheck className="check-icon text-[1.5vw] max-sm:text-[5vw] max-md:text-[4vw]" />
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center ">
                                    <h3 className="text-[1em] uppercase max-sm:text-[3vw] max-md:text-[2vw]">
                                        Protected Channel
                                    </h3>
                                    <span
                                        className="check-span w-[3vw] h-[3vw] max-sm:w-[10vw] max-sm:h-[10vw] max-md:w-[6vw] max-md:h-[6vw] rounded-[.5vw] max-sm:rounded-[1.2vw] flex justify-center items-center cursor-pointer"
                                        onClick={handleProtectedCheck}
                                    >
                                        {isProtected && (
                                            <BsCheck className="check-icon text-[1.5vw] max-sm:text-[5vw] max-md:text-[4vw]" />
                                        )}
                                    </span>
                                </div>
                                {isProtected && (
                                    <>
                                        <h3 className="text-[1em] uppercase max-sm:text-[3vw] max-md:text-[2vw]">
                                            Password
                                        </h3>
                                        <input
                                            type="password"
                                            maxLength={42}
                                            className="w-full h-[3vw] mt-2 max-sm:w-full max-sm:h-[5vh] max-md:w-full max-md:h-[5vh] rounded-[.5vw] max-sm:rounded-[1.2vw] max-md:rounded-[1.2vw] input-container outline-none indent-[1vw] text-[1vw] max-sm:text-[3vw] max-md:text-[2vw]"
                                        />
                                    </>
                                )}
                                <div className="pt-[1vw] max-sm:pt-[.5vw] max-md:pt-[.5vw]">
                                    <div className="child flex gap-[2vw] max-sm:gap-[8vw] max-md:gap-[6vw] justify-end items-end">
                                        <h3 className="text-[.8vw] font-light max-sm:text-[3.5vw] max-md:text-[2vw]">
                                            <a
                                                className="cursor-pointer"
                                                onClick={togglePopup}
                                            >
                                                CANCEL
                                            </a>
                                        </h3>
                                        <h3 className="text-[1.2vw] font-bold max-sm:text-[4.5vw] max-md:text-[3vw]">
                                            <a
                                                className="cursor-pointer"
                                                onClick={handleSave}
                                            >
                                                SAVE
                                            </a>
                                        </h3>
                                    </div>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                    id="imageInput"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddChannel;
