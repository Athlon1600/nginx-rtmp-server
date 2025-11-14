# Video Streaming Server

![GitHub last commit](https://img.shields.io/github/last-commit/athlon1600/nginx-rtmp-server)
![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/athlon1600/nginx-rtmp-server/docker-build-push.yml?label=Docker%20build%20and%20push)
![Top language](https://img.shields.io/github/languages/top/athlon1600/nginx-rtmp-server)

Self-host your own streaming server without relying on any external and expensive services (like **Amazon IVS**).

See a demo here - https://demo.streamplanet.tv/

## Installation

Clone this repository:

```shell
git clone https://github.com/Athlon1600/nginx-rtmp-server.git
```

Next, you need Docker.

**Windows**  
If you are testing this from your local Windows computer, download Docker from here:
https://docs.docker.com/docker-for-windows/install/

**Linux**  
Install Docker with just this one command:

```shell
bash <(wget -O - https://raw.githubusercontent.com/Athlon1600/nginx-rtmp-server/master/install.sh)
```

Once Docker is installed, run:

```shell
docker-compose up --build -d
```

and that is it! This will launch two services:

- HTTP Nginx Server on http://localhost:8090
- RTMP Ingest Server on `rtmp://localhost:1935`

## Usage

Once the two services are up and running, you can now start streaming to your newly launched RTMP server at this endpoint:

```shell
rtmp://localhost:1935/live/{stream_key}
```

`{stream_key}` can be anything you want. In all the examples below we just use `test`.

If you are using OBS, point your streaming settings to:

```shell
rtmp://localhost:1935/live/test
```

![OBS Stream Settings](https://i.imgur.com/iH5Zp2Q.png)


otherwise, you can just stream any mp4-like video file using `ffmpeg`:

```shell
ffmpeg -stream_loop -1 -nostdin -re -i "video.mp4" -copy -f flv rtmp://localhost/live/test
```

Your stream is now ready to be consumed via HTTP as `.m3u8` playlist by any supporting client such as VLC Media Player:
- `Media -> Open Network Stream -> Network`
- Paste the link there:

```shell
http://localhost:8090/hls/test/master.m3u8
```

|  |                                                                  |
|---------|------------------------------------------------------------------|
| ![VLC Media Player Open Network Stream](https://i.imgur.com/gSBSZqO.png) | ![VLC Media Player Network URL](https://i.imgur.com/j6P9AGv.png) |


or you can embed that video stream on your website by using `hls.js` Javascript library:
- https://hlsjs.video-dev.org

## Technical Notes

Powered by RTMP module for nginx.  
https://www.nginx.com/products/nginx/modules/rtmp-media-streaming/

The original codebase stopped receiving updates years ago:  
https://github.com/arut/nginx-rtmp-module

so we will be using this fork instead:  
https://github.com/sergey-dryabzhinsky/nginx-rtmp-module

## Projects using this library

- https://watchseinfeld.net

## Links

- https://github.com/arut/nginx-rtmp-module/wiki/Directives
- https://developer.apple.com/library/archive/documentation/NetworkingInternet/Conceptual/StreamingMediaGuide/Introduction/Introduction.html
