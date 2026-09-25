# Drone Operations & Billing API (Backend)

High-performance asynchronous REST API powering the Shamuga Drone Operations and Billing Management platform. Built with **FastAPI**, **Motor (Async MongoDB)**, **Pydantic v2**, and **JWT Bearer Authentication**.

---

## ⚡ Tech Stack & Updated Packages

- **Framework**: [FastAPI](https://fastapi.tiangolo.com/) `0.141.1`
- **ASGI Server**: [Uvicorn](https://www.uvicorn.org/) `0.53.0`
- **Database Driver**: [Motor](https://motor.readthedocs.io/) `3.7.1` (Async driver for MongoDB)
- **MongoDB Client**: [PyMongo](https://pymongo.readthedocs.io/) `4.18.1`
- **Data Validation & Settings**: [Pydantic](https://docs.pydantic.dev/) `2.13.5` & [pydantic-settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/) `2.15.0`
- **Security & Authentication**: [python-jose](https://python-jose.readthedocs.io/) `3.5.0` & [bcrypt](https://github.com/pyca/bcrypt/) `5.0.0`
- **Configuration**: [python-dotenv](https://github.com/theskumar/python-dotenv) `1.2.3`

---

## 📁 Directory Structure

```
backend/
├── app/
│   ├── core/
│   │   ├── config.py         # Pydantic BaseSettings (MONGO_URL, JWT secret, CORS)
│   │   ├── database.py       # Async Motor client, connect/disconnect lifecycle
│   │   └── security.py       # Bcrypt hashing & JWT token issuance/verification
│   ├── models/               # MongoDB entity data structures
│   │   ├── billing.py
│   │   ├── drone.py
│   │   ├── farmer.py
│   │   ├── password_reset.py
│   │   └── user.py
│   ├── routers/              # API Route handlers
│   │   ├── auth.py           # /auth (login, register, reset password)
│   │   ├── billing.py        # /billing (create, list, update, delete bills)
│   │   └── users.py          # /users (profile, user CRUD, admin listing)
│   ├── schemas/              # Pydantic validation models (request/response)
│   │   ├── auth.py
│   │   ├── billing.py
│   │   ├── common.py
│   │   └── users.py
│   ├── services/             # Business logic layer
│   │   ├── auth.py
│   │   ├── billing.py
│   │   └── users.py
│   ├── dependencies.py       # FastAPI dependency injection (JWT auth & RBAC)
│   ├── enums.py              # User roles and enumeration constants
│   └── main.py               # Application factory, lifespan, CORS, router mounting
├── docs/
│   └── MONGODB_SCHEMA.md     # Detailed database schema and collection definitions
├── scripts/
│   ├── clean_database.py     # Database cleanup utility
│   ├── seed_data.py          # Database seeder with sample accounts and data
│   └── README.md             # Scripts documentation
├── .env                      # Environment configuration
└── requirements.txt          # Python dependencies
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
- Python 3.10+ (tested with Python 3.10, 3.11, 3.12, 3.14)
- A running MongoDB instance (local or MongoDB Atlas)

### 2. Create and Activate Virtual Environment
```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create or verify `.env` in `backend/`:
```env
# Database configuration (supports either MONGO_URL or MONGO_URI)
MONGO_URL=mongodb://localhost:27017/shamuga_drone
DB_NAME=shamuga_drone_dev

# Security (minimum 32 characters for production)
JWT_SECRET_KEY=super-secret-jwt-key-for-development-min-32-chars
JWT_ALGORITHM=HS256
JWT_EXPIRE_MINUTES=10080  # 7 days

# Allowed CORS origins (comma-separated list)
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### 5. Seed the Database
Populate roles, admin, operators, drones, farmers, and sample billing records:
```bash
python3 scripts/seed_data.py
```

### 6. Start Development Server
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- API Base URL: `http://localhost:8000`
- Interactive Swagger UI: `http://localhost:8000/docs`
- ReDoc Documentation: `http://localhost:8000/redoc`

---

## 🔑 Default Credentials (from seed data)

| Role | Email | Password |
|---|---|---|
| **Admin** | `admin@shamuga.com` | `admin123` |
| **Operator 1** | `drone1@shamuga.com` | `password123` |
| **Operator 2** | `drone2@shamuga.com` | `password123` |
| **Operator 3** | `drone3@shamuga.com` | `password123` |

---

## 📡 API Overview

### Authentication (`/auth`)
- `POST /auth/register` - Create user account
- `POST /auth/login` - Authenticate & obtain JWT access token
- `POST /auth/forgot-password` - Request password reset token
- `POST /auth/reset-password` - Reset password with token
- `POST /auth/change-password` - Change password (authenticated)

### Users (`/users`)
- `GET /users/me` - Current logged-in user profile
- `PUT /users/me` - Update current user profile
- `GET /users/` - List users with pagination (Admin only)
- `GET /users/{user_id}` - Get user details by ID
- `PUT /users/{user_id}` - Update user (Admin only)
- `DELETE /users/{user_id}` - Delete user (Admin only)

### Billing (`/billing`)
- `POST /billing/` - Create spray billing record (requires drone, farmer, acres, duration, amount, mode)
- `GET /billing/` - List bills (Operators see own bills; Admins see all with filters)
- `GET /billing/{id}` - Get bill by ID
- `PUT /billing/{id}` - Update bill (Admin or creator)
- `DELETE /billing/{id}` - Delete bill (Admin only)
