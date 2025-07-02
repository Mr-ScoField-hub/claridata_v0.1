from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import os
import uuid

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all for dev. Restrict in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

class UploadResponse(BaseModel):
    errors: list[str]
    cleaned_data: list[dict]

@app.post("/upload", response_model=UploadResponse)
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files allowed.")

    file_path = os.path.join(UPLOAD_DIR, f"{uuid.uuid4()}.csv")

    try:
        # Save uploaded file temporarily
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        df = pd.read_csv(file_path)

        missing_values = []
        for col in df.columns:
            missing_count = df[col].isnull().sum()
            if missing_count > 0:
                missing_values.append(f"{col}: {missing_count} missing")

        data_type_issues = []
        for col in df.columns:
            try:
                inferred_type = pd.api.types.infer_dtype(df[col])
                if inferred_type == "mixed":
                    data_type_issues.append(f"{col}: mixed data types detected")
            except Exception as e:
                data_type_issues.append(f"{col}: error inferring type ({e})")

        errors = missing_values + data_type_issues

        cleaned_data = df.fillna("").to_dict(orient="records")

        os.remove(file_path)

        return {"errors": errors, "cleaned_data": cleaned_data}

    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=f"Failed to process CSV: {e}")

@app.get("/")
async def root():
    return {"message": "ClariData API running ✅"}
