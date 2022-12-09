import React, { useEffect, useState } from "react";

import sdk from "matrix-js-sdk";

function App() {
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<Array<string>>([]);
  const [roomId, setRoomId] = useState("!LGdwqwGzNMDBhONJkt:matrix.org");
  console.log(roomId);
  const [client, setClient] = useState(
    sdk.createClient({
      baseUrl: "https://matrix.org",
      accessToken: "syt_dHJhaW5lZTEyMw_MGRdFTvCsJcVDIImqtUY_0zhwVu",
      userId: "@trainee123:matrix.org",
    })
  );

  useEffect(() => {
    if (!client) return;

    client.startClient();

    client.once("sync", function (state: any, prevState: any, res: any) {
      console.log(state); // state will be 'PREPARED' when the client is ready to use
    });

    client.on("event", function (event: any) {
      const eventType = event.getType();

      if (eventType === "m.room.message") {
        const currentMessage = event.event.content.body;
        setHistory([...history, currentMessage]);
      }
    });
  }, [client, history]);

  const handleOnClick = (e: any) => {
    var content = {
      body: message,
      msgtype: "m.text",
    };

    client
      .sendEvent(roomId, "m.room.message", content, "")
      .then((res: any) => {
        // message sent successfully
        console.log("message sent successfully", res);
        setMessage("");
      })
      .catch((err: any) => {
        console.log(err);
      });
  };

  const handleOnSendMessage = (e: any) => {
    setMessage(e.target.value);
  };

  const allRooms = client.getRooms();

  return (
    <div className="App">
      <h1>Matrix Chat</h1>
      <div>
        <input
          type="text"
          value={message}
          onChange={handleOnSendMessage}
          placeholder="Type your message here"
        />
        <button onClick={handleOnClick}>Send</button>
      </div>
      <div>
        {history.map((message: string, index: number) => (
          <p key={index}>{message}</p>
        ))}
      </div>
      <h3>Select a room</h3>
      <select onChange={(e) => setRoomId(e.target.value)}>
        {allRooms.map((room: any) => (
          <option key={room.roomId} value={room.roomId}>
            {room.name}
          </option>
        ))}
      </select>
      <h2>Room Details</h2>
      <p>Room ID {roomId}</p>
    </div>
  );
}

export default App;
