from fastapi import FastAPI
from app.routers.auth_router import router as auth_router
from app.routers.users_router import router as users_router

app = FastAPI()

@app.get("/")
def home():
    return {"message": "API is working for drone"}

# include route modules
# app.include_router(auth_router) #TODO need to remove once db is done
# app.include_router(users_router)
