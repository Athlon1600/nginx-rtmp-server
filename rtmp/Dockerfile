FROM debian:buster-slim

RUN apt-get update

## nginx dependencies
RUN apt-get install -y build-essential libpcre3 libpcre3-dev libssl-dev
# RUN apt-get install -y zlib1g zlib1g-dev

RUN apt-get install -y ffmpeg

# optional. useful for debugging
RUN apt-get install -y curl vim glances

## Install nginx
RUN curl -OL https://nginx.org/download/nginx-1.18.0.tar.gz
RUN tar -zxf nginx-1.18.0.tar.gz

RUN curl -OL "https://github.com/sergey-dryabzhinsky/nginx-rtmp-module/archive/dev.tar.gz"
RUN tar -xvz -f "dev.tar.gz" && \
    cd nginx-1.18.0 && \
    ./configure \
        --prefix=/usr/local/nginx \
        --conf-path=/usr/local/nginx/conf/nginx.conf \
        --without-http_gzip_module \
        --with-http_ssl_module \
        --with-http_v2_module \
        --with-debug \
        --with-threads \
        --with-ipv6 \
        --add-module=../nginx-rtmp-module-dev && \
    make -j$(nproc) && \
    make install

COPY nginx.conf /usr/local/nginx/conf
COPY /html /usr/local/nginx/html

EXPOSE 80
EXPOSE 1935

#CMD ["sleep", "1d"]

CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]

