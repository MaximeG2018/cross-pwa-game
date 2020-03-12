import React, { useState, useEffect } from "react";
import socketIO from "socket.io-client";
import AskNickname from "./components/AskNickname";
import MagicNumber from "./components/MagicNumber";

const App = () => {

	const io = socketIO("http://localhost:"+ process.env.PORT_SOCKET);

	const [isGameStarted, setGameStarted] = useState(false);
	const [isWaiting, setIsWaiting] = useState(false);
	const [players, setPlayers] = useState([]);


		io.on("event::gameFull", () => {
			toaster.warning("Game is full");
		});

		io.on("event::waitingPlayer", () => {
			setGameStarted(false);
			setIsWaiting(true);
		});

		io.on("event::gameStart", payload => {
			setGameStarted(true);
			toaster.success("Game started", {
				id: "game-started",
			});
			setPlayers(payload.players);
		});

		function renderScreen() {
			if (isGameStarted === true) {
				return (
					<MagicNumber
						io={io}
						players={players}
						setPlayers={setPlayers}
						setGameStarted={setGameStarted}
						setIsWaiting={setIsWaiting}
					/>
				);
			} else {
				if (isWaiting === true) {
					return <WaitPlayer />;
				} else {
					return <AskNickname io={io} />;
				}
			}
		}

		return (
			<section className="hero is-fullheight is-light">
				<div className="hero-head">
					<div className="container">
						<div className="tabs is-centered">
							<ul>
								<li>
									<a>PWA Games</a>
								</li>
							</ul>
						</div>
					</div>
				</div>

				<div className="hero-body">
					<div className="container">
						<header className="bd-index-header">{renderScreen()}</header>
					</div>
				</div>

				<div className="hero-foot">
					<div className="container">
						<div className="tabs is-centered">
							<ul>
								<li>
									<a>Let's Rock!</a>
								</li>
							</ul>
						</div>
					</div>
				</div>
			</section>
		);
	};

	export default App;
