from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd

app = FastAPI()

df = pd.read_csv('data\CLIENT 1 combined_data(2025-3-1-2026-2-28).csv')

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/kpis')
def get_kpis():

    total_uploaded = df['Uploaded Count'].sum()
    total_published = df['Published Count'].sum()
    total_created = df['Created Count'].sum()
    published_rate = total_published/total_uploaded *100 
    
    return{
        "total_uploaded": int(total_uploaded),
        "total_published": int(total_published),
        "total_created": int(total_created),
        "published_rate": float(published_rate)
    }
