![GitHub last commit](https://img.shields.io/github/last-commit/athlon1600/nginx-rtmp-server)
![Top language](https://img.shields.io/github/languages/top/athlon1600/nginx-rtmp-server)

# Video Streaming Server

Self-host your own **Amazon IVS** like service for cheap.

See a demo here - https://demo.streamplanet.tv/

## Installation

Download all the files first:

```shell
git clone https://github.com/Athlon1600/nginx-rtmp-server.git
```

Next, you need docker.

**Windows**  
If you are testing this from your local windows computer, download Docker from here:
https://docs.docker.com/docker-for-windows/install/

**Linux**  
On your linux machine, just run this command on your fresh box

```shell
bash <(wget -O - https://raw.githubusercontent.com/Athlon1600/nginx-rtmp-server/master/install.sh)
```

Once installed, run either:

```shell
docker-compose up --build --abort-on-container-exit
docker-compose up --build -d
```

and that is it! This will launch to services:

- HTTP Nginx Server on `http://localhost:8090`
- RTMP Ingest Server on `rtmp://localhost:1935`

## Technical Notes

Powered by RTMP module for nginx.  
https://www.nginx.com/products/nginx/modules/rtmp-media-streaming/

The original codebase stopped receiving updates years ago:  
https://github.com/arut/nginx-rtmp-module

We will be using this fork instead:  
https://github.com/sergey-dryabzhinsky/nginx-rtmp-module

## Projects using this library

- https://watchseinfeld.net

## Links

- https://www.nginx.com/products/nginx/modules/rtmp-media-streaming/
- https://github.com/arut/nginx-rtmp-module/wiki/Directives
- https://groups.google.com/g/nginx-rtmp/
- https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/StreamingMediaGuide/Introduction/Introduction.html
