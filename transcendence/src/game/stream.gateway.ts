import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets";
import { GameService } from "./game.service";
import { Injectable } from "@nestjs/common";
import { Server, Socket } from "socket.io"

interface Ball {
	x: number;
	y: number;
	velocityX: number;
	velocityY: number;
	speed: number;
}

interface GameData {
	ball: Ball;
	leftPlayerY: number;
	rightPlayerY: number;
	leftScore: number;
	rightScore: number;
}

interface Player {
	socket: Socket;
	id: number;
	side: string;
};

interface Room {
	roomName: string;
	players: Player[];
	data: GameData;
}

const socketConfig = {
	cors: {
    origin: [
      'http://client',
      'http://localhost:3000',
      'http://localhost:8000',
      'http://nginx:80',
    ],
      credentials: true,
	},
	namespace: 'stream',
};


@Injectable()
@WebSocketGateway( socketConfig )
export class StreamGateway implements OnGatewayConnection, OnGatewayDisconnect {

    constructor(private gameService: GameService) {}

    @WebSocketServer()
    server: Server;
    private rooms = [];
    private map = new Map<string , {score1: number, score2: number}>();

    async handleConnection(client: Socket) {
        client.emit("initRooms", {
            rooms: this.rooms,
            map: Array.from(this.map.entries())
        });
    }

    async handleDisconnect(client: any) {
        
    }

    async updateScore(roomName: string, score1: number, score2: number) {

        this.map.set(roomName, {
            score1: score1,
            score2: score2
        });
        this.server.emit("updateScore", Array.from(this.map.entries()));
    }

    async addRoom(room: Room) {

        this.map.set(room.roomName, {
            score1: room.data.leftScore,
            score2: room.data.rightScore
        });
        this.rooms.push({
            roomName: room.roomName,
            playerOneId: room.players[0].id,
			playerTwoId: room.players[1].id,
        });

        this.server.emit("addRoom", {
            room: {
                roomName: room.roomName,
                playerOneId: room.players[0].id,
			    playerTwoId: room.players[1].id,
            },
            map: Array.from(this.map.entries())
        });
    }

    async removeRoom(roomName: string) {
        this.map.delete(roomName);
        this.rooms = this.rooms.filter(room => (room.roomName !== roomName));
        this.server.emit("removeRoom", {
            roomName: roomName,
            map: Array.from(this.map.entries())
        });
    }
}
