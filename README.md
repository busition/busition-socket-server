# Busition Socket Server

Busition Socket Server is the real-time backend for the Busition platform. It uses Socket.IO to manage route-based rooms, broadcast live bus data to connected clients, store passenger state in Redis, and query schedule data from AWS DynamoDB.

## Features

- Real-time communication with Socket.IO
- Route room creation and join flows for clients
- Redis-backed passenger state storage
- DynamoDB access for schedule-related operations
- Clustered production runtime with PM2
- Docker and Jenkins deployment support

## Project Structure

- `src/server.js`: Express and Socket.IO server
- `ecosystem.config.cjs`: PM2 cluster configuration
- `Dockerfile`: container image definition
- `Jenkinsfile`: example CI/CD pipeline for rebuilding and redeploying the container

## Prerequisites

- Node.js 19 or later
- npm
- A reachable Redis instance
- AWS credentials with access to DynamoDB
- An environment file available at `/env/.env`

## Environment Variables

The server loads environment variables from an absolute path: `/env/.env`.

| Variable | Required | Description |
| --- | --- | --- |
| `PORT` | No | HTTP and Socket.IO port. Defaults to `3000`. |
| `REDIS` | No | Redis connection URL. Defaults to `redis://localhost:6379`. |
| `REGION` | Yes | AWS region for DynamoDB. |
| `KEY` | Yes | AWS access key ID. |
| `SECRET_KEY` | Yes | AWS secret access key. |

Example:

```dotenv
PORT=3000
REDIS=redis://localhost:6379
REGION=ap-northeast-2
KEY=your-access-key-id
SECRET_KEY=your-secret-access-key
```

For Docker or Jenkins deployments, mount a host directory to `/env` and place the `.env` file inside that directory.

## Run Locally

1. Make sure `/env/.env` exists and contains the required values.
2. Install dependencies.
3. Start the server.

```bash
npm install
node src/server.js
```

## Run with Docker

Build the image:

```bash
docker build -t busition-socket-server:1.0 .
```

Run the container:

```bash
docker run -d \
  --name busition-socket-server \
  -p 3000:3000 \
  -v /path/to/env-dir:/env \
  --restart unless-stopped \
  busition-socket-server:1.0
```

`/path/to/env-dir` must contain a file named `.env`.

## HTTP Endpoint

- `GET /`: returns the list of currently active Socket.IO rooms.

## Socket.IO Namespaces

| Namespace | Purpose | Current Behavior |
| --- | --- | --- |
| `/user` | Main client namespace | Opens rooms, joins rooms, handles passenger-related events, and broadcasts bus data. |
| `/console` | Admin or operator namespace | Supports a test event that scans the `schedules_v2` DynamoDB table. |
| `/mate` | Reserved namespace | Accepts connections, but no custom events are implemented yet. |

## Main `/user` Events

| Event | Direction | Payload |
| --- | --- | --- |
| `open_room` | client -> server | JSON string with `route_id` and `type` |
| `join_room` | client -> server | Room ID string |
| `exit` | client -> server | Object with `route_id` and `type` |
| `check_passenger` | client -> server | JSON string array of `{ uuid, id }` objects |
| `send_location` | client -> server | Object with `latitude`, `longitude`, and `speed` |
| `company user` | client -> server | Object with `uuid` and `id`; server responds with `user uuid` |
| `code` | server -> client | Status code such as `200` or `404` |
| `data` | server -> room | Periodic location payload broadcast to room participants |

Example `data` payload:

```json
{
  "location": [36.611, 126.979],
  "delayed": 330,
  "speed": 0
}
```

## Operations Notes

- The production container runs through `pm2-runtime` using `ecosystem.config.cjs`.
- Socket.IO Admin UI instrumentation is enabled in the server configuration.
- The included Jenkins pipeline rebuilds the Docker image and runs the container with `/socket_sever_data` mounted to `/env`.

## Additional Notes

- CORS is currently configured to allow all origins.
- No automated tests are configured in this repository.
