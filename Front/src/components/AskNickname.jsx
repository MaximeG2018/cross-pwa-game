import React, { useState } from "react";

const AskNickname = ({ io }) => {
	const [nickname, setNickname] = useState("");

	const handleNickname = event => {
		setNickname(event.target.value);
	};

	const sendNickname = () => {
		io.emit("event::initialize", { nickname });
		setNickname("")
	};

	return (
		<div className="field">
			<div className="control">
				<input className="input" onChange={handleNickname} value={nickname} />
			</div>
			<div className="control">
				<a className="button is-info" onClick={sendNickname}>
					Go Play
				</a>
			</div>
		</div>
	);
};

export default AskNickname;
