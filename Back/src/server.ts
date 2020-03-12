import express from "express";
import socketIO from "socket.io";
import { createServer } from "http";
import { config } from "dotenv";

config();

const PORT = process.env.PORT;

const app = express();
const server = createServer(app);
const io = socketIO(server);
let players = [];

app.get("/", (_, res) => {
	res.send("Hello World !");
});

io.on("connection", socket => {
	console.log("new connection");
	socket.emit("event::hello");

	socket.on("event::initialize", payload => {
		if (players.length >= 2) {
			socket.emit("event::gameFull");
			return;
		}

		players.push(payload);
		console.log("new name received: ", payload.nickname);

		if (players.length === 2) {
			io.emit("event::gameStart");
		}
	});
});

server.listen(PORT, () => {
	console.log("Server ready at ...");
});
