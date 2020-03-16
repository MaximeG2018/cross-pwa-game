import express from "express";
import socketIO from "socket.io";
import { createServer } from "http";
import { config } from "dotenv";

config();

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);
const io = socketIO(server);

let generateMagic = () => {
	const magic: number = Math.floor(Math.random() * 1337);
	console.log(magic);
	return magic;
};

let players: any[] = [];
let magicNumber: number = generateMagic();

app.get("/", (_, res) => {
	res.send("Hello World");
});

io.on("connection", socket => {
	let currPlayer: any;

	socket.on("event::initialize", payload => {
		if (players.length >= 2) {
			socket.emit("event::gameFull");
			return;
		}

		players.push({ nickname: payload.nickname, score: 0 });
		currPlayer = payload.nickname;

		console.log(`Player ${currPlayer} joined`);

		if (players.length === 2) {
			io.emit("event::gameStart", { players });
		} else {
			socket.emit("event::waitingPlayer");
		}
	});

	socket.on("event::checkNumber", payload => {
		const number = payload.number;
		console.log(`${currPlayer} try ${number}`);

		if (number < magicNumber) {
			socket.emit("event::isMore");
		} else if (number > magicNumber) {
			socket.emit("event::isLess");
		} else if (number === magicNumber.toString()) {
			const winner = players.find(player => player.nickname === currPlayer);
			console.log(winner)
			winner.score += 1;
			if (winner.score !== 3) {
				magicNumber = generateMagic();
				io.emit("event::nextRound", { players });
			} else {
				io.emit("event::gameOver", { winner });
			}
		}
	});

	socket.on("disconnect", () => {
		if (currPlayer !== undefined) {
			players = players.filter((player: any) => player.nickname !== currPlayer);
			console.log(`Player ${currPlayer} left game`);
			io.emit("event::waitingPlayer");
			magicNumber = generateMagic();
		}
	});
});

server.listen(PORT, () => {
	console.log("Server is ready to use");
});
