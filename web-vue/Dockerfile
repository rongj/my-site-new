FROM node:10.16.3-alpine

MAINTAINER rongj
ENV REGISTRYURL "https://registry.npm.taobao.org"

RUN mkdir /app
WORKDIR /app
COPY . .

RUN npm install --production --registry=${REGISTRYURL}

ENV HOST 0.0.0.0
ENV PORT 80
EXPOSE 80

CMD ["npm", "start"]