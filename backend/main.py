from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.dashboard_routes import router as dashboard_router
from routes.dashboard3_routes import router as dashboard3_router
from routes.dashboard4_routes import router4 as dashboard4_router
from routes.dashboard2_routes import router2 as dashboard2_router
app = FastAPI()

# ✅ ADD THIS BLOCK
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# optional root
@app.get("/")
def home():
    return {"message": "Backend running"}

# routers
app.include_router(dashboard_router, prefix="/api")
app.include_router(dashboard3_router, prefix="/api")
app.include_router(dashboard4_router, prefix="/api")
app.include_router(dashboard2_router, prefix="/api")
