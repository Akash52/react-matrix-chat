import React, { useEffect, useState } from "react";

import sdk from "matrix-js-sdk";

function App() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState("");
  const [history, setHistory] = useState<Array<string>>([]);
  const [client, setClient] = useState(
    sdk.createClient({
      baseUrl: "https://matrix.org",
      accessToken: "syt_dHJhaW5lZTEyMw_MGRdFTvCsJcVDIImqtUY_0zhwVu",
      userId: "@trainee123:matrix.org",
    })
  );

  const testRoomId = "!LGdwqwGzNMDBhONJkt:matrix.org";

  useEffect(() => {
    if (!client) return;

    client.startClient();

    client.once("sync", function (state: any, prevState: any, res: any) {
      console.log(state); // state will be 'PREPARED' when the client is ready to use
    });

    client.on("event", function (event: any) {
      const eventType = event.getType();

      if (eventType === "m.typing") {
        const username = event.event.content.user_ids;
        setIsTyping(username ? `${username} is typing ...` : "");
      }

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
      .sendEvent(testRoomId, "m.room.message", content, "")
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

  //map room list
  const mapRoomList = () => {
    if (!client) return;

    const rooms = client.getRooms();
    console.log("rooms", rooms);
  };

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
    </div>
  );
}

export default App;
