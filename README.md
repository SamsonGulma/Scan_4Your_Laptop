# Scan_4Your_Laptop
Student Laptop Registration and Barcode Scanning System

A **Student Laptop Registration & Barcode Scanning System** built with **Next.js** for the frontend and **FastAPI** for the backend. The system allows registering students, generating barcodes, and scanning them via webcam or uploaded images.  

## Features

- Student registration with laptop details  
- Barcode generation for each student on registration
- Camera-Based Barcode Scanning and Manual barcode scanning  
- Displays scan results with clear success/error/warning alerts  

---

## Prerequisites

- Node.js >= 18.x  
- Python >= 3.10  
- PostgreSQL (or another database supported by SQLAlchemy)  
- Git  

---

## Backend Setup (FastAPI)

1. **Clone the repository**

```bash
git clone https://github.com/SamsonGulma/Scan_4Your_Laptop.git
cd BarIIIII-III-II_Code\Back_End_FastAPI
```

```bash
python -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```

use the requirements.txt file 
```bash
pip install --upgrade pip
pip install -r requirements.txt
```
##or 

use this command
```bash
pip install --upgrade pip
pip install fastapi uvicorn jinja2 sqlalchemy "databases[postgresql]" python-barcode pillow psycopg2-binary pyzbar opencv-python python-multipart google-cloud-vision
```

Setup your database and change the Name of the database I already coded(barcode_db) to yours

and Then Run your FastAPI server

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
##OR

```bash
uvicorn app.main:app --reload
```

## Frontend Setup (NextJS)

```bash
cd Front_End_Next
```

Install Dependencies 
```bash
npm i
```

Run the Nextjs Dev. Server

```bash
npm run dev
```

---

##The Usage

  -Open the frontend in your browser (http://localhost:3000) --(Assuming you're already running the backend and your database)
  
  -Register students via the registration form
  
  -Scan barcodes via webcam or upload
  
  -View scan results with success/error/warning alerts
  
---
