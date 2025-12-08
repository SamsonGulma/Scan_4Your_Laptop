from fastapi import FastAPI, Request, Form, UploadFile, File, Depends
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from .database import SessionLocal, engine, Base
from .models import User
from .utils import generate_barcode
from .barcode_reader import read_barcode_from_image

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Barcode Access System")
templates = Jinja2Templates(directory="app/templates")
app.mount("/static", StaticFiles(directory="app/static"), name="static")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def build_user_message(user: User) -> str:
    if not user:
        return "Student not found"
    if user.has_laptop:
        return f"{user.name} has laptop: {user.laptop_name}"
    return f"{user.name} has NO laptop"

@app.get("/register", response_class=HTMLResponse)
def register_form(request: Request):
    return templates.TemplateResponse("register.html", {"request": request})

@app.post("/register", response_class=JSONResponse)
async def register_user_api(
    name: str = Form(...),
    has_laptop: bool = Form(False),
    laptop_name: str = Form(None),
    db: Session = Depends(get_db)
):
    if db.query(User).filter(User.name == name).first():
        return JSONResponse({"error": "User with this name already exists."}, status_code=400)

    new_user = User(name=name, has_laptop=has_laptop, laptop_name=laptop_name)
    db.add(new_user)
    try:
        db.commit()
        db.refresh(new_user)
    except IntegrityError:
        db.rollback()
        return JSONResponse({"error": "Database error: Duplicate entry detected."}, status_code=500)

    barcode_path = generate_barcode(new_user.id)

    return {
        "id": new_user.id,
        "name": new_user.name,
        "has_laptop": new_user.has_laptop,
        "laptop_name": new_user.laptop_name,
        "barcode_path": barcode_path
    }

@app.get("/scan", response_class=HTMLResponse)
def scan_form(request: Request):
    return templates.TemplateResponse("scan.html", {"request": request})

@app.post("/scan", response_class=HTMLResponse)
def scan_user(request: Request, db: Session = Depends(get_db), barcode_input: str = Form(...)):
    user = db.query(User).filter(User.id == barcode_input).first()
    message = build_user_message(user)
    return templates.TemplateResponse("scan.html", {"request": request, "message": message})

@app.post("/scan/camera", response_class=JSONResponse)
async def scan_camera(data: dict = Form(...), db: Session = Depends(get_db)):
    barcode_value = data.get("barcode")
    if not barcode_value:
        return JSONResponse({"message": "Invalid barcode received."}, status_code=400)
    user = db.query(User).filter(User.id == barcode_value).first()
    return {"message": build_user_message(user)}

@app.post("/scan/upload", response_class=JSONResponse)
async def scan_from_upload(barcode_image: UploadFile = File(...), db: Session = Depends(get_db)):
    image_bytes = await barcode_image.read()
    barcode_value = read_barcode_from_image(image_bytes)
    if not barcode_value:
        return JSONResponse({"message": "Barcode not detected"}, status_code=400)
    user = db.query(User).filter(User.id == int(barcode_value)).first()
    return {"message": build_user_message(user), "barcode": barcode_value}
