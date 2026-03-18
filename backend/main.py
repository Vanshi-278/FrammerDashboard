from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.dashboard_routes import router as dashboard_router
from routes.dashboard3_routes import router as dashboard3_router
from routes.usage_routes import router as usage_router  # if using

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
app.include_router(usage_router, prefix="/api")  # if needed