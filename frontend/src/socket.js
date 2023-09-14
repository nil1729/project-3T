import { io } from "socket.io-client";

const URL = process.env.REACT_APP_SOCKET_SERVER_HOST;

const socket = io(URL);

export { socket };
