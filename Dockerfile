FROM node:19

LABEL maintainer="wookingwoo@gmail.com"

RUN mkdir -p /busition_socket_server
WORKDIR /busition_socket_server

# 현재 Dockerfile 있는 경로의 모든 파일을 /busition_socket_server 에 복사
ADD . /busition_socket_server

RUN npm install
RUN npm install -g @socket.io/pm2
RUN npm install -g typescript
RUN pm2 install typescript
# RUN yarn global add pm2

#가상 머신에 오픈할 포트
EXPOSE 3000

#컨테이너에서 실행될 명령을 지정
# CMD [ "npm", "start" ]
# CMD [ "forever", "start", "-c", "npm start", "." ]
# CMD ["pm2-runtime", "start", "ecosystem.config.js", "--watch", "--env", "production"]
CMD ["pm2", "start", "ecosystem.config.js", "--watch", "--env", "production"]
