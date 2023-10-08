import { Interval } from '@nestjs/schedule';
import { 
	SubscribeMessage,
	OnGatewayConnection,
	OnGatewayDisconnect,
	WebSocketGateway,
	WebSocketServer,
	MessageBody,
	ConnectedSocket
} from '@nestjs/websockets';

import * as jwt from "jsonwebtoken"

import { Server, Socket } from "socket.io"
import { ConfigService } from '@nestjs/config';


interface Ball {
	x: number;
	y: number;
	velocityX: number;
	velocityY: number;
	speed: number;
}

interface GameData {
	ball: Ball;
	playerY: number;
	botY: number;
	leftScore: number;
	rightScore: number;
}

interface Player {
	socket: Socket;
	id: number;
};

interface Room {
	roomName: string;
	player: Player;
	data: GameData;
	done: boolean;
}

const socketConfig = {
	cors: {
		origin: ['http://client', 'http://10.14.8.7:5173', 'http://10.14.8.7:3000'],
		credentials: true
	},
	namespace: 'bot'
};


@WebSocketGateway( socketConfig )
export class BotGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private config: ConfigService
	) {}

	@WebSocketServer()
	server: Server;

	private roomNames: String[] = [];
    private rooms: Room[] = [];

	async handleConnection(client: Socket) : Promise<void> {

        console.log ("connected in bot socket")

		const cookie = client.handshake.headers.cookie;
		const jwtToken = cookie.split('=')[1];

		const jwtPayload : any = jwt.verify(jwtToken, this.config.get('JWT_SECRET'));
		const userId = jwtPayload.sub;

        let player: Player = {
			socket: client,
			id: userId,
		}

        const roomName: string = this.createNewRoom();
        player.socket.join(roomName);
        let room: Room = {
            roomName: roomName,
            player: player,
            data: {
                ball: {
                    x: 500,
                    y: 300,
                    velocityX: 5,
                    velocityY: 0,
                    speed: 5,
                },
                botY: 250,
                playerY: 250,
                leftScore: 0,
                rightScore: 0
            },
            done: false
        }

        this.server.to(room.roomName).emit("join_room", {
            data: room.data,
            roomName: room.roomName,
            playerId: player.id,
        });

        this.rooms.push(room);
	}

	private createNewRoom() : string {
		let roomName: string;

		do {
			roomName = Math.random().toString(36).substring(7);
		} while (this.roomNames.includes(roomName));

		this.roomNames.push(roomName);

		return roomName;
	}

	// handle disconnection of one of the players
	handleDisconnect(client: Socket) {
		
	}

	@Interval(8)
	async moveBall() {
		for (let room of this.rooms) {
			room.data.ball.x += room.data.ball.velocityX;
			room.data.ball.y += room.data.ball.velocityY;

            await this.moveBotPaddle(room);

			if (room.data.ball.y >= 595 || room.data.ball.y <= 5) {
				room.data.ball.velocityY *= -1;
			}
			if (room.data.ball.x > 1000 || room.data.ball.x < 0) {
				(room.data.ball.x > 1000) ? (room.data.leftScore += 1) : (room.data.rightScore += 1);
				await this.resetBall(room);
			}

			if (room.data.ball.x <= 10 && (room.data.ball.y >= room.data.playerY && room.data.ball.y <= room.data.playerY+80)) {
				this.handlePaddleCollision(room.data.ball, room.data.playerY);
				room.data.ball.velocityX *= -1;
			}
			if (room.data.ball.x >= 990 && (room.data.ball.y >= room.data.botY && room.data.ball.y <= room.data.botY+80)) {
				this.handlePaddleCollision(room.data.ball, room.data.botY);
				room.data.ball.velocityX *= -1;
			}
			this.server.to(room.roomName).emit("update", room.data);

			if ((room.data.leftScore === 9 || room.data.rightScore === 9) &&
				room.done === false)
			{
				room.done = true;
				console.log("MAAAMAAA SALIIIT");
				this.server.to(room.roomName).emit("endMatch");
			}
		}
	}

    private async moveBotPaddle(room: Room) {

            const paddleCenterY  = room.data.botY + 40;
            if (room.data.ball.velocityX < 0)
                return ;
            if (room.data.ball.y >= paddleCenterY + 40) {
                room.data.botY += 3;
            }
            else if (room.data.ball.y <= paddleCenterY - 40) {
                room.data.botY -= 3;
            }

    }


	private handlePaddleCollision(ball: Ball, paddleY: number) {

    	const paddleCenterY = paddleY + 40;
    	const deltaY = ball.y - paddleCenterY;

    	// Calculate the normalized bounce angle
    	const normalizedDeltaY = deltaY / 40;
    	const maxBounceAngle = Math.PI / 4;

    	// Calculate the bounce angle based on the normalized delta
    	const bounceAngle = normalizedDeltaY * maxBounceAngle;

    	// Update the ball's velocity based on the new angle
    	ball.velocityY = Math.sin(bounceAngle) * ball.speed;
	}

	private async resetBall(room: Room) {
		room.data.ball = {
			x: 500, 
			y: 300,
			velocityX: 5,
			velocityY: 0,
			speed: 5,
		};
	}

	@SubscribeMessage("move")
	async movePaddle(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		let room = this.getRoomByName(data.roomName);

		if (room === undefined) {
			return ;
		}

		if (client === room.player.socket && data.posY <= 520) {
			room.data.playerY = data.posY;
		}
		this.server.to(data.roomName).emit("update", room.data);
	}

	private getRoomByName(roomName: string) : Room | undefined {
		for (let room of this.rooms) {
			if (room.roomName === roomName) {
				return room;
			}
		}
		return undefined;
	}

}
