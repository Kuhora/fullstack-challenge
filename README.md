# Collaborative Task Management System

<img width="768" height="516" alt="Carousel_Image_Boards_2x" src="https://github.com/user-attachments/assets/d7dd978f-0c39-4205-8b20-49b860893b55" />

(Illustrative image)

**Collaborative Task Management System** is a full-stack productivity and collaboration platform inspired by tools like Trello and Asana.  
It allows authenticated users to create **boards**, **columns**, and **tasks**, interact in real time through **comments**, and receive **live notifications** powered by WebSockets and RabbitMQ.  

This project demonstrates a complete microservices architecture using **NestJS**, **React**, and **TypeScript**, designed for scalability and modularity.

---

## 🚀 Key Features

- **Boards & Tasks Management** — Create, update, delete, and organize boards, columns, and tasks  
- **Comments System** — Real-time comment feed for each task  
- **Notifications Center** — WebSocket-based notifications when tasks or boards are updated  
- **Microservices Architecture** — Each service (Auth, Tasks, Notifications) runs independently and communicates via RabbitMQ  
- **Gateway API** — Single entry point using NestJS Gateway to route requests to internal services  
- **Authentication & Authorization** — JWT-based system with token validation across services  
- **Pagination & Filtering** — Efficient task and notification retrieval  
- **Dockerized Setup** — All services run via Docker Compose for easy deployment  
- **Scalable Event System** — RabbitMQ handles async communication between services  

---

## 🧩 Technologies Used

### **Backend**
- **NestJS** (modular microservices)
- **TypeORM** + **PostgreSQL**
- **RabbitMQ** (inter-service communication)
- **JWT Authentication**
- **Swagger** for API documentation
- **WebSocket Gateway** for real-time updates
- **Docker** + **Docker Compose** for containerized setup

### **Frontend** (Planned for future development.)
- **React.js (Vite + TypeScript)**
- **TanStack Router** for routing
- **Zustand** for global state management
- **TanStack Query** for async data caching
- **Tailwind CSS + shadcn/ui** for styled components
- **React Hook Form + Zod** for form validation
- **Socket.io Client** for notifications in real time
- **Lucide Icons** and **Framer Motion** for visuals & animations

---

## 🔌 API Endpoints Overview

### **Auth Service**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Authenticate user and return JWT |
| `GET`  | `/auth/profile` | Retrieve current user profile |

### **Tasks Service**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/tasks` | List all tasks |
| `POST` | `/tasks` | Create a new task |
| `PUT` | `/tasks/:id` | Update an existing task |
| `DELETE` | `/tasks/:id` | Delete a task |
| `GET` | `/boards/:id` | Retrieve board details with columns and tasks |

### **Notifications Service**
| Method | Endpoint | Description |
|--------|-----------|-------------|
| `GET` | `/notifications?userId={id}` | Get paginated notifications for a user |
| `GET` | `/notifications/unread?userId={id}` | Get unread notifications |
| `PUT` | `/notifications/:id/read` | Mark a notification as read |



