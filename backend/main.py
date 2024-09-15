from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import pandas as pd
import csv

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS for the frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain if needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Sample route for testing
@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

# Function to read and process the hospital data CSV
def read_csv():
    csv_file_path = "us_hospital_locations_modified_v4.csv"  # Path to the CSV file
    try:
        # Read the CSV file

        with open(csv_file_path, mode='r', encoding='utf-8') as csv_file:
            # Use csv.DictReader to map each row's information into a dictionary
            csv_reader = csv.DictReader(csv_file)
            
            # Convert the rows into a list of dictionaries
            hospital_data = list(csv_reader)

        '''
        hospital_data = pd.read_csv(csv_file_path)

        return [1,2,3]
        # Ensure necessary columns are present in the CSV
        if not {'NAME', 'X', 'Y', 'WEBSITE'}.issubset(hospital_data.columns):
            raise ValueError("CSV file must contain 'NAME', 'X', 'Y', and 'WEBSITE' columns")
        
    
        # Convert CSV data to dictionary format
        
        hospitals = hospital_data.to_dict(orient='records')
        return hospitals
        '''
        return hospital_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading CSV file: {e}")

# API endpoint to serve hospital data
@app.get("/api/hospitals")
def get_hospitals():
    try:
        hospitals = read_csv()
        return {"hospitals": hospitals}
    except HTTPException as e:
        return {"error": e.detail}
