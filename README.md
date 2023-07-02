# busition-socket-server

## Get started in local

```bash
npm install
npm start
```

## Get started with Dockerfile

```bash
docker build . -t busition_socket_server:1.0
docker run -i -t -d -p <host port number>:3000 --name busition_socket_server --restart always busition_socket_server:1.0
```

github web hook test
