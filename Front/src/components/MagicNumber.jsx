import React, { useState } from "react";
import { toaster } from "evergreen-ui";

const MagicNumber = ({ io, players, setPlayers, setGameStarted, setIsWaiting }) => {
	const [numberProposal, setNumberProposal] = useState("");
	const [previousProposal, setPreviousProposal] = useState("");
	const [hint, setHint] = useState("");
	const [round, setRound] = useState(1);

	const handleNumberProposal = event => {
		setNumberProposal(event.target.value);
		setPreviousProposal(event.target.value);
	};

	const sendNumberProposal = () => {
		io.emit("event::checkNumber", { number: numberProposal });
		setNumberProposal("");
	};

	io.on("event::isMore", () => {
		setHint(`More than ${previousProposal}`);
	});

	io.on("event::isLess", () => {
		setHint(`Less than ${previousProposal}`);
	});

	io.on("event::nextRound", payload => {
		setRound(round + 1);
		setPlayers(payload.players);
	});

	io.on("event::gameOver", payload => {
		toaster.success(`${payload.winner.nickname} win the game`, {
			id: "game-over",
		});
		setGameStarted(false);
		setIsWaiting(false);
	});

	return (
		<div className="field">
			<div>Round {round}</div>
			<div>
				{players.length === 2
					? `${players[0].nickname} ${players[0].score} - ${players[1].score} ${players[1].nickname}`
					: null}
			</div>
			<div className="control">
				<input className="input" onChange={handleNumberProposal} value={numberProposal} />
				<div>{hint}</div>
			</div>
			<div className="control">
				<a className="button is-info" onClick={sendNumberProposal}>
					Check
				</a>
			</div>
		</div>
	);
};

export default MagicNumber;
