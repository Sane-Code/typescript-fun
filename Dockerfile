
FROM ubuntu:14.04.2

ENV DEBIAN_FRONTEND=noninteractive

RUN apt-get update && apt-get install -y \
nginx \
node \
npm \
 && rm -rf /var/lib/apt/lists/*

RUN ln -s /usr/bin/nodejs /usr/bin/node
RUN rm /usr/sbin/node # probably dont need this :P

RUN npm install -g typescript webpack typings

#remove default nginx files (except mime.types)
RUN mv /etc/nginx/mime.types /etc/tmp
RUN rm -rf /etc/nginx/*
RUN mv /etc/tmp /etc/nginx/mime.types
COPY   nginx.conf         /etc/nginx/

RUN mkdir /opt/code
WORKDIR /opt/code
RUN npm link typescript

COPY package.json /opt/code/
COPY typings.json /opt/code/
RUN npm install
RUN typings install

COPY webpack.config.js /opt/code/
COPY tsconfig.json /opt/code/
COPY src/ /opt/code/src

RUN webpack 
COPY build/index.html /var/www/
RUN mv build/bundle.js /var/www/


CMD ["nginx"]

EXPOSE 80
