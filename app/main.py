from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers.auth_router import router as auth_router
from app.routers.users_router import router as users_router
from app.routers.billing_router import router as billing_router

app = FastAPI(title="Drone API", version="1.0.0")

# CORS middleware for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Update with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "API is working for drone"}

# Include route modules
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(billing_router)