# Angular + Spring Boot Messaging App

A real-time chat application built with **Angular 21** (frontend) and **Spring Boot 4** (backend), featuring JWT authentication and WebSocket-based messaging.

## Features

- **User Registration & Login** with BCrypt-hashed passwords and JWT session tokens
- **Real-time messaging** over WebSocket using the STOMP protocol
- **Message history** fetched via REST on login
- **Secured WebSocket channels** — JWT validation on every STOMP frame
- **Docker Compose** for one-command local setup
- **Kubernetes manifests** for production deployment (k3s / any k8s cluster)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 21, TypeScript 5, @stomp/rx-stomp |
| Backend | Spring Boot 4, Spring Security, Spring WebSocket |
| Auth | JWT (jjwt 0.13), BCrypt |
| Database | PostgreSQL (production) / H2 in-memory (development) |
| Build | Maven (backend), npm / Angular CLI (frontend) |
| Container | Docker, Nginx (frontend reverse proxy) |
| Orchestration | Docker Compose, Kubernetes |

---

## Prerequisites

| Tool | Version |
|---|---|
| Java JDK | 25+ |
| Node.js | 18+ |
| npm | 9+ |
| Docker & Docker Compose | Latest stable |
| PostgreSQL | 14+ (only for manual setup without Docker) |

---

## Quick Start with Docker Compose

The fastest way to run the full stack locally:

```bash
git clone https://github.com/AFaseeh/Angular-Springboot-Messaging-App.git
cd Angular-Springboot-Messaging-App
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost |
| Backend API | http://localhost:8080 |
| PostgreSQL | localhost:5432 |

Stop all services:

```bash
docker compose down
```

---

## Manual Local Setup

### Backend (Spring Boot)

```bash
cd messaging-app-backend
./mvnw spring-boot:run
```

The backend starts on **http://localhost:8080** using the H2 in-memory database by default (no external database required).

**H2 console** (development only): http://localhost:8080/h2-console
- JDBC URL: `jdbc:h2:mem:chat`
- Username: `sa`
- Password: _(leave blank)_

Key configuration (`src/main/resources/application.properties`):

```properties
app.jwt.session.minutes=5          # JWT expiry time
app.bcrypt.strength=12             # BCrypt cost factor
```

### Frontend (Angular)

```bash
cd messaging-app-frontend
npm install
npm start
```

The dev server starts on **http://localhost:4200** and proxies `/api` and `/ws` requests to the backend.

### Production Build

```bash
# Frontend
npm run build           # Output: dist/

# Backend
./mvnw clean package    # Output: target/messaging-app-*.jar
java -jar target/messaging-app-*.jar
```

---

## Running Tests

### Frontend

```bash
cd messaging-app-frontend
npm test
```

Tests use **Vitest** with jsdom.

### Backend

```bash
cd messaging-app-backend
./mvnw test
```

---

## API Reference

### Authentication (no JWT required)

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/register/{name}` | Register a new user |
| `POST` | `/api/login` | Log in and receive a JWT |

**Register** — `{name}` in the path is the user's display name; the body carries the login credentials:
```
POST /api/register/Alice
```
```json
{ "username": "alice", "password": "secret" }
```

**Login** — body:
```json
{ "username": "alice", "password": "secret" }
```

Both endpoints return:
```json
{
  "user":  { "id": 1, "name": "Alice" },
  "token": "<jwt>",
  "error": null
}
```

### Messages (JWT required)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/chat/messages` | Fetch full message history |

Include the JWT in the request header:
```
Authorization: Bearer <token>
```

### WebSocket / STOMP

Connect to `/ws`, then:

| Destination | Direction | Description |
|---|---|---|
| `/app/chat` | Send | Publish a new message |
| `/topic/chat` | Subscribe | Receive broadcasted messages |

Send payload:
```json
{ "user": { "id": 1, "name": "Alice" }, "text": "Hello!" }
```

---

## Project Structure

```
Angular-Springboot-Messaging-App/
├── compose.yaml                          # Docker Compose (full stack)
│
├── messaging-app-frontend/               # Angular application
│   ├── src/app/
│   │   ├── components/
│   │   │   ├── frontpage/               # Root layout, auth toggle
│   │   │   ├── login/                   # Login form
│   │   │   ├── register/                # Registration form
│   │   │   ├── chat/                    # Chat room (WebSocket)
│   │   │   └── chat-message/            # Single message display
│   │   ├── services/
│   │   │   ├── auth.service.ts          # JWT + user session storage
│   │   │   ├── chat.service.ts          # Message orchestration
│   │   │   ├── rest.service.ts          # HTTP calls (login, register)
│   │   │   └── web-socket.service.ts    # STOMP WebSocket client
│   │   └── models/                      # TypeScript interfaces/DTOs
│   └── Dockerfile
│
├── messaging-app-backend/                # Spring Boot application
│   └── src/main/java/.../messagingapp/
│       ├── controllers/
│       │   ├── RestApiController.java   # /api/register, /api/login
│       │   └── ChatController.java      # /app/chat, /api/chat/messages
│       ├── services/
│       │   ├── UserService.java
│       │   ├── ChatService.java
│       │   └── JwtService.java
│       ├── config/
│       │   ├── SecurityConfig.java      # Spring Security + CORS
│       │   └── WebSocketConfig.java     # STOMP broker configuration
│       ├── models/
│       │   ├── ChatUser.java
│       │   └── ChatMessage.java
│       └── Dockerfile
│
└── messaging-app-infrastructure/         # Kubernetes deployment
    ├── k8s-manifests/
    │   ├── backend.yaml
    │   ├── frontend.yaml
    │   ├── postgres.yaml
    │   └── ingress.yaml
    └── k8s-config/                       # Cluster-level setup
```

---

## Kubernetes Deployment

Refer to [`messaging-app-infrastructure/README.md`](messaging-app-infrastructure/README.md) for full cluster setup instructions.

Quick summary:

```bash
# Apply all manifests
kubectl apply -f messaging-app-infrastructure/k8s-manifests/

# Verify pods are running
kubectl get pods
```

The Ingress is configured for the hostname `whatsapp.local`. Add an entry to your `/etc/hosts` pointing to the cluster's external IP to access the app.

---

## Environment Variables

When running with Docker Compose or Kubernetes, the following environment variables configure the backend:

| Variable | Description | Example |
|---|---|---|
| `SPRING_DATASOURCE_URL` | JDBC connection string | `jdbc:postgresql://db:5432/messaging_db` |
| `SPRING_DATASOURCE_USERNAME` | DB username | `myuser` |
| `SPRING_DATASOURCE_PASSWORD` | DB password | `mypassword` |
| `SPRING_JPA_HIBERNATE_DDL_AUTO` | Schema strategy | `update` |
| `APP_JWT_SECRET_KEY` | JWT signing key | _(long random string)_ |
| `APP_JWT_SESSION_MINUTES` | Token lifetime (minutes) | `5` |

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## License

This project is open source and available under the [MIT License](LICENSE).
