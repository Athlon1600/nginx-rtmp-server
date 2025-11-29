import {Server} from "./Server";

const server = new Server();
const port = process.env.PORT || 3000;
server.start(port);
