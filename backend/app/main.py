from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.core.database import close_db, connect_db
from app.routers import auth, billing, farmers, users


# ─── Application lifecycle ────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Open the database connection on startup and close it on shutdown."""
    await connect_db()
    yield
    await close_db()


# ─── App instance ─────────────────────────────────────────────────────────────

app = FastAPI(
    title="Drone Operations API",
    version="1.0.0",
    description=(
        "REST API for drone management, operator billing, and user administration. "
        "Authentication uses JWT Bearer tokens."
    ),
    lifespan=lifespan,
)


# ─── Middleware ───────────────────────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Routes ───────────────────────────────────────────────────────────────────
#
#  /auth/*     — public authentication (register, login, password reset)
#  /users/*    — user management (profile, admin CRUD)
#  /billing/*  — billing records (operators see own; admins see all)
#  /farmers/*  — farmer management (CRUD)
#
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(billing.router)
app.include_router(farmers.router)


# ─── Health check ─────────────────────────────────────────────────────────────

@app.get("/", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "Drone Operations API", "version": "1.0.0"}