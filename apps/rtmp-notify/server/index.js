const {createServer} = require("./createServer");

const port = process.env.PORT || 3000;

// A tiny HTTP server that always returns HTTP 200 OK
const server = createServer();

server.listen(port, () => {
    console.log(`Simple RTMP Notify Server started on port ${port}`);
});
