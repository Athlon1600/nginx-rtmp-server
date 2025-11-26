FROM debian:bookworm-slim

## forked rtmp-module was last updated May 15, 2022
## Nginx version is from 19 Oct 2022
ENV NGINX_VERSION=1.22.1

## nginx compile dependencies
RUN apt-get update && apt-get install -y build-essential libpcre3 libpcre3-dev libssl-dev

# optional. useful for debugging
RUN apt-get install -y curl vim htop procps

## Compile nginx from source
RUN curl -OL https://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz
RUN tar -zxf nginx-${NGINX_VERSION}.tar.gz

## Original rtmp module by arut stopped updating years ago, so we use this fork instead
RUN curl -OL "https://github.com/sergey-dryabzhinsky/nginx-rtmp-module/archive/dev.tar.gz"
RUN tar -xvz -f "dev.tar.gz" && \
    cd nginx-${NGINX_VERSION} && \
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

EXPOSE 80
EXPOSE 1935

# CMD ["sleep", "1d"]
CMD ["/usr/local/nginx/sbin/nginx", "-g", "daemon off;"]

