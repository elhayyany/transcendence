import { io } from "socket.io-client";

const socket = io("/api/user", {
    withCredentials: true,
});
const setOnline = async () => {
    socket.on("connect", () => {
        console.log("connected");
    });
};

const setOffline = () => {
    socket.on('disconnect', () => {
        console.log('disconnected')
    })
}

const setInGame = () => {
    socket.on('inGame', () => {
        console.log('inGame')
    })
}


const recieveNotification = () => {
    socket.on("notification", (data) => {
        console.log(data);
    });
};

export { setOnline, recieveNotification };
