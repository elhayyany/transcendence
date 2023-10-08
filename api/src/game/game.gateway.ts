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
import { GameService } from './game.service';
import { UserService } from 'src/user/user.service';
import { Console } from 'console';
import { RouterModule } from '@nestjs/core';
import { Injectable } from '@nestjs/common';
import { StreamGateway } from './stream.gateway';
import { ConfigService } from '@nestjs/config';
import { join } from 'path';
import { EventsGateway } from 'src/events/events.gateway';


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
	done: boolean;
}


const socketConfig = {
	cors: {
		origin: ['http://client', 'http://10.14.8.7:5173', 'http://10.14.8.7:3000'],
		credentials: true
	},
	namespace: 'game'
};


@Injectable()
@WebSocketGateway( socketConfig )
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {

	constructor(
		private gameService: GameService,
		private streamGateway: StreamGateway,
		private config: ConfigService,
		private event: EventsGateway
	) {}

	@WebSocketServer()
	server: Server;

	private queue: Player[] = [];

	private roomNames: String[] = [];
	private map = new Map<Socket, number>();
	private challengers = new Map<number, Socket>();
	private ids: number[] = [];

	async handleConnection(client: Socket) : Promise<void> {
		const cookie = client.handshake.headers.cookie;
		const jwtToken = cookie.split('=')[1];

		const jwtPayload : any = jwt.verify(jwtToken, this.config.get('JWT_SECRET'));
		const userId = jwtPayload.sub;
		if (this.ids.includes(userId)) {
			console.log("user already connected");
			client.emit('inGame');
			client.disconnect();
		}
		else {
			this.map.set(client, userId);
			this.ids.push(userId);
			console.log(`connected ====> ${userId}`);
		}
	}

	@SubscribeMessage("join")
	async joinQueue(@ConnectedSocket() client: Socket) {
		let player: Player = {
			socket: client,
			id: this.map.get(client),
			side: !(this.queue.length % 2) ? "left" : "right"
		}

		this.queue.push(player);

		if (this.queue.length >= 2)
		{
			console.log("CREATING ROOM ...");
			const players = this.queue.splice(0, 2);
			const roomName: string = this.createNewRoom();

			let room: Room = {
				roomName: roomName,
				players: players,
				data: {
					ball: {
						x: 500,
						y: 300,
						velocityX: 5,
						velocityY: 0,
						speed: 5,
					},
					leftPlayerY: 250,
					rightPlayerY: 250,
					leftScore: 0,
					rightScore: 0
				},
				done: false
			};

			players.forEach(player => {
				player.socket.join(roomName);
			});

			this.server.to(room.roomName).emit("join_room", {
				data: room.data,
				roomName: room.roomName,
				playerOneId: players[0].id,
				playerTwoId: players[1].id
			});
			await this.gameService.addRoom(room);
			await this.streamGateway.addRoom(room);
		}
	}

	@SubscribeMessage("spectate")
	async watchMatch(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
		console.log("watch");
		client.join(data.roomName);
		const room = this.getRoomByName(data.roomName);
		console.log(data.roomName);
		if (room) {
			console.log("joined room")
			client.emit("join_room", {
				data: room.data,
				roomName: room.roomName,
				playerOneId: room.players[0].id,
				playerTwoId: room.players[1].id
			});
		}
		else {
			console.log("no room");
			client.emit("no_room");
		}
	}
	

	@SubscribeMessage("challenge")
	async challengeUser(@MessageBody() data: number, @ConnectedSocket() client: Socket) {
		// console.log('challenge');
		await this.event.sendGameRequest(this.map.get(client), data);
		this.challengers.set(this.map.get(client), client)
		
	}

	@SubscribeMessage("acceptChallenge")
	async acceptChallenge(@MessageBody() data: number, @ConnectedSocket() client: Socket) {
		if (this.challengers.has(data)) {
			const players = [
				{
					socket: this.challengers.get(data),
					id: data,
					side: "left"
				},
				{
					socket: client,
					id: this.map.get(client),
					side: "right"
				}
			]

			const roomName: string = this.createNewRoom();

			let room: Room = {
				roomName: roomName,
				players: players,
				data: {
					ball: {
						x: 500,
						y: 300,
						velocityX: 5,
						velocityY: 0,
						speed: 5,
					},
					leftPlayerY: 250,
					rightPlayerY: 250,
					leftScore: 0,
					rightScore: 0
				},
				done: false
			};

			players.forEach(player => {
				player.socket.join(roomName);
			});

			this.server.to(room.roomName).emit("join_room", {
				data: room.data,
				roomName: room.roomName,
				playerOneId: players[0].id,
				playerTwoId: players[1].id
			});
			await this.gameService.addRoom(room);
			await this.streamGateway.addRoom(room);
		}
		else {
			this.server.emit('out');
			this.event.sendnotify('out', this.map.get(client))
		}
	}

	@SubscribeMessage('reject')
  	async reject(@ConnectedSocket() client: Socket, @MessageBody() userId: number) {
    	this.event.sendnotify('rejected', userId)
		client.disconnect();
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
		console.log("DISCONNECTION");
		this.queue = this.queue.filter(player => (player.socket !== client))
		this.ids = this.ids.filter(id => (id !== this.map.get(client)));
		this.challengers.delete(this.map.get(client));
		this.map.delete(client);
	}

	@Interval(10)
	async moveBall() {
		for (let room of this.gameService.getRooms()) {
			room.data.ball.x += room.data.ball.velocityX;
			room.data.ball.y += room.data.ball.velocityY;

			if (room.data.ball.y >= 595 || room.data.ball.y <= 5) {
				room.data.ball.velocityY *= -1;
			}
			if (room.data.ball.x > 1000 || room.data.ball.x < 0) {
				(room.data.ball.x > 1000) ? (room.data.leftScore += 1) : (room.data.rightScore += 1);
				this.resetBall(room);

				this.streamGateway.updateScore(
					room.roomName,
					room.data.leftScore,
					room.data.rightScore
				);
			}

			if (room.data.ball.x <= 10 && (room.data.ball.y > room.data.leftPlayerY && room.data.ball.y < room.data.leftPlayerY+80)) {
				// room.data.speedX += (room.data.speedX > 0) ? 1 : (-1);
				this.handlePaddleCollision(room.data.ball, room.data.leftPlayerY);
				room.data.ball.velocityX *= -1;
			}
			if (room.data.ball.x >= 990 && (room.data.ball.y > room.data.rightPlayerY && room.data.ball.y < room.data.rightPlayerY+80)) {
				// room.data.speedX += (room.data.speedX > 0) ? 1 : (-1);
				this.handlePaddleCollision(room.data.ball, room.data.rightPlayerY);
				room.data.ball.velocityX *= -1;
			}
			this.server.to(room.roomName).emit("update", room.data);

			if ((room.data.leftScore === 9 || room.data.rightScore === 9) &&
				room.done === false)
			{
				room.done = true;
				console.log("MAAAMAAA SALIIIT 1");
				const body = {
					player1Id: room.players[0].id,
					player2Id: room.players[1].id,
					player1Score: room.data.leftScore,
					player2Score: room.data.rightScore,
					type: "classic",
					winnerId: (room.data.leftScore > room.data.rightScore) ? room.players[0].id : room.players[1].id,
					loserId: (room.data.leftScore < room.data.rightScore) ? room.players[0].id : room.players[1].id
				};
				await this.gameService.createGameRecord(body);
				this.server.to(room.roomName).emit("endMatch");
				await this.gameService.removeRoom(room.roomName);
				await this.streamGateway.removeRoom(room.roomName);
			}
			// if ((room.players[0].socket.disconnected || room.players[1].socket.disconnected) && 
			// 	room.done === false)
			// {
			// 	room.done = true;
			// 	console.log("MAAAMAAA SALIIIT 2");
			// 	const body = {
			// 		player1Id: room.players[0].id,
			// 		player2Id: room.players[1].id,
			// 		player1Score: room.data.leftScore,
			// 		player2Score: room.data.rightScore,
			// 		type: "classic",
			// 		winnerId: (room.players[1].socket.disconnected) ? room.players[0].id : room.players[1].id,
			// 		loserId: (room.players[0].socket.disconnected) ? room.players[1].id : room.players[0].id
			// 	};
			// 	await this.gameService.createGameRecord(body);
			// 	this.server.to(room.roomName).emit("endMatch");
			// 	await this.gameService.removeRoom(room.roomName);
			// 	await this.streamGateway.removeRoom(room.roomName);
			// }

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

	private resetBall(room: Room) : void  {
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

		if (client === room.players[0].socket && data.posY <= 520) {
			room.data.leftPlayerY = data.posY;
		}
		else if (client === room.players[1].socket && data.posY <= 520) {
			room.data.rightPlayerY = data.posY;
		}
		this.server.to(data.roomName).emit("update", room.data);
	}

	private getRoomByName(roomName: string) : Room | undefined {
		for (let room of this.gameService.getRooms()) {
			if (room.roomName === roomName) {
				return room;
			}
		}
		return undefined;
	}



}

