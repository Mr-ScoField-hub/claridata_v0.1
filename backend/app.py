from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from io import StringIO

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload-csv")
async def upload_csv(file: UploadFile = File(...)):
    contents = await file.read()

    try:
        df = pd.read_csv(StringIO(contents.decode('utf-8')))
    except Exception as e:
        return {"error": f"Failed to parse CSV: {str(e)}"}

    errors = []
    if df.isnull().any().any():
        errors.append("Missing values found in dataset")

    # Example cleaning: fill missing numeric with 0
    cleaned_df = df.fillna(0)
    cleaned_data = cleaned_df.to_dict(orient="records")

    return {"errors": errors, "cleaned_data": cleaned_data}
