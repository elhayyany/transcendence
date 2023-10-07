import Apollo from "../assets/Apollo.jpg";

type props = {
    message: string;
    isSentByMe: boolean;
    img: string;
};

const MessageContainer = ({ message, isSentByMe, img }: props) => {
    console.log(img);
    return (
        <>
            {isSentByMe ? (
                <div className="flex justify-end items-end ml-[15vw] mb-[.5vw] gap-[.5vw]">
                    <span className="text-[.6vw] max-sm:text-[1.1vw] opacity-40 whitespace-nowrap">
                        23:16 PM
                    </span>
                    <div className="flex justify-end items-end">
                        <div className="flex justify-end">
                            <div className="msg-container rounded-[.5vw]">
                                <p className="text-start p-[1vw] text-[.9vw] max-sm:text-[1.5vw]">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex justify-start items-end mr-[15vw] mb-[.5vw] gap-[.5vw]">
                    <div className="flex justify-start items-end gap-[.5vw]">
                        <img
                            className="w-[2.2vw] h-[2.2vw] rounded-full"
                            src={img}
                            alt="Apollo"
                        />
                        <div className="msg-container rounded-[.5vw]">
                            <p className="text-start p-[1vw] text-[.9vw] max-sm:text-[1.5vw]">
                                {message}
                            </p>
                        </div>
                        <span className="text-[.6vw] max-sm:text-[1.1vw] opacity-40 whitespace-nowrap">
                            23:16 PM
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};

export default MessageContainer;
