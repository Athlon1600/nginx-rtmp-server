const http = require("http");
const {onPublish} = require("./hooks");

function objectFromQueryString(queryString) {
    const params = new URLSearchParams(queryString);
    return Object.fromEntries(params);
}

function formatNanoseconds(ns) {
    ns = Number(ns);
    const NS_PER_MS = 1e6;

    // more than 0.1 ms?
    if (ns > 1e5) {
        const milliseconds = ns / 1e5;

        if (milliseconds >= 1000) {
            return Math.ceil(milliseconds).toLocaleString() + ' ms';
        }

        return milliseconds.toFixed(2) + ' ms';
    }
}

const createServer = () => {

    return http.createServer((req, res) => {

        const timeStart = process.hrtime.bigint();

        // send as little as possible to save time
        // TODO: send either OK or Error
        const sendResponse = (statusCode, responseText = "OK") => {
            res.writeHead(statusCode, {"Content-Type": "text/plain"});
            res.end(responseText + "\n");
        }

        const readInput = async () => {

            let body = "";

            return new Promise((resolve, reject) => {

                // Collect incoming data
                req.on("data", chunk => {
                    body += chunk.toString();
                });

                req.on("error", (err) => {
                    reject(err)
                });

                // When all data is received
                req.on("end", () => {
                    resolve(body);
                });

                req.on('close', () => {
                    // was all data received?
                });

            });
        }

        res.on('finish', () => {

            const duration = process.hrtime.bigint() - timeStart;
            const durationFormatted = formatNanoseconds(duration);

            const dateString = (new Date()).toLocaleDateString();
            const timeString = (new Date()).toLocaleTimeString();

            const logLine = `${dateString} ${timeString} --- ${req.method} ${req.url} - ${durationFormatted}`;
            console.log(logLine);
        });

        readInput().then((result) => {

            result = objectFromQueryString(result);

            if (req.url === '/on_publish') {
                // return okay: 200 or 201 if stream key is valid
                sendResponse(200);
            } else if (req.url === '/on_play') {
                // return 401 unauthorized or 403 forbidden if not transcoder
                sendResponse(200);
            } else {
                sendResponse(200);
            }

        }).catch((err) => {

            const errorMessage = (err && err.message) ? err.message : "Bad Request";
            sendResponse(400, errorMessage);
        });

    });
}

module.exports = {
    createServer
}
