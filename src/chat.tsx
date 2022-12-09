import React from "react";

let [client, setClient] = React.useState();
let [roomId, setRoomId] = React.useState();
let [rooms, setRooms] = React.useState([]);
let [initialized, setInitialized] = React.useState(false);

const init = async () => {
  const sdk = await import("matrix-js-sdk");
  const client = sdk.createClient({
    baseUrl: "https://matrix.org",
    accessToken: "syt_dHJhaW5lZTcyODU_SPRORPbQuUUyWoCrOMxQ_1AaGFX",
    userId: "@trainee7285:matrix.org",
  });
  setClient(client);
  client.startClient();
  client.once("sync", function (state: any, prevState: any, res: any) {
    //console.log(state); // state will be 'PREPARED' when the client is ready to use
  });
  const rooms = client.getRooms();
  setRooms(rooms);
  setInitialized(true);
};
