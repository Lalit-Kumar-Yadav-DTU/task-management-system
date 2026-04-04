# 📝 Task Management System

A full-stack Task Management System built using Next.js, Node.js, TypeScript, Prisma, and MySQL, developed as part of a Software Engineering assessment. It demonstrates secure JWT-based authentication and scalable task management with pagination, filtering, and search.

---

## 🌐 Live Demo

- 🔗 **Frontend:** https://task-management-frontend-g9vb.onrender.com
- 🔗 **Backend API:** https://task-manager-backend-b5zb.onrender.com

---

## 📌 Features

### 🔐 Authentication
- User Registration & Login
- JWT Authentication (Access + Refresh Tokens)
- Secure password hashing using bcrypt
- Persistent login across page refresh

### 🛠️ Task Management
- Create, Update, Delete tasks
- Toggle task status (TODO / DONE)
- User-specific task isolation

### 🔎 Advanced Features
- Server-side Pagination
- Filtering by status
- Search by task title
- Debounced search (optimized API calls)

### 🔔 User Experience
- Toast notifications
- Clean responsive UI (mobile + desktop)
- Smooth interactions with modal-based forms

---

## 🧱 Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | Next.js (App Router), TypeScript, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MySQL (Aiven), Prisma ORM |
| **Security** | JWT (Access + Refresh Tokens), bcrypt, HttpOnly Cookies |

---

## 🏗️ System Architecture

This project utilizes a **Service-Layer Pattern** to decouple business logic from HTTP concerns, ensuring the system remains maintainable as it scales.
```text
┌──────────────────────────────────────────────────────────────────┐
│                      BROWSER (Next.js 14)                        │
│          Zod Validation │ Axios Interceptors │ AuthContext       │
└──────────────────────────┬───────────────────────────────────────┘
                           │  HTTPS + JWT Bearer Token
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                  REST API — Render Web Service                   │
│               Node.js  +  Express  +  TypeScript                 │
│                                                                  │
│   ┌─────────────────┐   ┌─────────────────┐   ┌──────────────┐   │
│   │  Auth Services  │   │  Task Services  │   │  Middleware  │   │
│   │ /register/login │   │ CRUD Logic      │   │ JWT Guard    │   │
│   │ /refresh session│   │ Pagination/Sort │   │ Error Handler│   │
│   └────────┬────────┘   └────────┬────────┘   └──────────────┘   │
│            └────────────┬────────┘                               │
│                         ▼                                        │
│               ┌─────────────────────┐                            │
│               │     Prisma ORM      │                            │
│               └──────────┬──────────┘                            │
└──────────────────────────┼───────────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────────┐
│                  MySQL Database — Render Managed                 │
│           Relational Schema: User (1) ←──→ Task (N)              │
└──────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

1. User logs in → receives **Access Token** + **Refresh Token**
2. Access Token is used for all API requests
3. Refresh Token is used to generate new Access Tokens when they expire
4. Tasks are fetched with pagination, filtering, and search

---

## 🔐 Authentication Strategy

This project uses a **hybrid authentication approach**:

| Token | Storage | Expiry |
|-------|---------|--------|
| Access Token | `localStorage` | 15 minutes |
| Refresh Token | HttpOnly Cookie | 7 days |

### Why this approach?

Since the frontend and backend are deployed on different domains (Render), third-party cookie restrictions can prevent cookies from being sent reliably. To ensure a stable user experience:

- `localStorage` is used for persistence across page refresh
- Refresh tokens are used when available for session renewal

> **Note:** In production systems, this can be improved using a shared domain or in-memory token strategy.

---

## 🗃️ Database Schema

### User
| Field | Type | Notes |
|-------|------|-------|
| `id` | Int | Primary Key |
| `fullName` | String | |
| `email` | String | Unique |
| `password` | String | Hashed |
| `refreshToken` | String | Optional |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

### Task
| Field | Type | Notes |
|-------|------|-------|
| `id` | Int | Primary Key |
| `title` | String | |
| `description` | String | Optional |
| `status` | Enum | `TODO` / `DONE` |
| `userId` | Int | Foreign Key → User |
| `createdAt` | DateTime | |
| `updatedAt` | DateTime | |

**Relationship:** One User → Many Tasks (each task belongs to exactly one user)

---

## 📁 Project Structure
```bash
task-management-system/
├── backend/
│   ├── prisma/
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── validators/
│       └── types/
│
├── frontend/
│   └── src/
│       ├── app/
│       │   ├── (auth)/
│       │   └── (dashboard)/
│       ├── components/
│       ├── services/
│       ├── lib/
│       ├── hooks/
│       ├── store/
│       └── types/
│
└── README.md
```

---

## 📸 Project Gallery

### 🚀 Dashboard
![Dashboard](./screenshots/dashboard.png)

### 🔐 Authentication

| Login | Register |
|-------|---------|
| ![Login](./screenshots/loginPage.png) | ![Register](./screenshots/registerPage.png) |

### 🛠️ Features

#### ➕ Create Task
![New Task](./screenshots/newTask.png)

#### 📄 Pagination
![Pagination](./screenshots/pagination.png)

---

## 📊 API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register a new user |
| `POST` | `/auth/login` | Login and receive tokens |
| `POST` | `/auth/refresh` | Refresh access token |
| `POST` | `/auth/logout` | Logout and clear session |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tasks` | Get tasks (pagination + filter + search) |
| `POST` | `/tasks` | Create a new task |
| `PATCH` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |
| `PATCH` | `/tasks/:id/toggle` | Toggle task status |

---

## ⚙️ Local Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/task-management-system.git
cd task-management-system
```

### 2. Install Dependencies
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend/` directory:
```env
DATABASE_URL=your_mysql_connection_string
JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret
FRONTEND_URL=http://localhost:3000
```

### 4. Run the Project
```bash
# Backend
cd backend
npm run dev

# Frontend (in a separate terminal)
cd frontend
npm run dev
```

---

## 🧠 Key Highlights

- Clean service-layer backend architecture
- Secure JWT authentication with refresh mechanism
- Efficient task handling with pagination, filtering, and search

---

## 👨‍💻 Author

**Lalit Kumar Yadav**
Developed for Software Engineering Assessment (Track A)

---

## 💡 Note to Reviewers

This project focuses on building a secure, scalable, and user-friendly task management system.

Due to cross-domain deployment on Render, refresh token cookies may be affected by browser restrictions. This is handled using a hybrid authentication approach for stability.

The implementation prioritizes:
- Clean architecture
- Secure authentication
- Real-world deployment considerations

