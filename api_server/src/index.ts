import {Server} from "./classes/Server";
import {PublishDoneController} from "./controllers/PublishDoneController";
import {PublishController} from "./controllers/PublishController";
import {IndexController} from "./controllers/IndexController";

const server = new Server();

server.registerController(new IndexController());
server.registerController(new PublishController());
server.registerController(new PublishDoneController());

const port = process.env.PORT || 3000;

server.start(port);

