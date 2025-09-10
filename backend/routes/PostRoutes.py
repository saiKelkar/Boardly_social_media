from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException
import requests
from sqlalchemy.orm import Session
from pathlib import Path
import traceback, os, shutil, uuid
from dotenv import load_dotenv
load_dotenv()

import db, schemas
from models import Posts, Users
from controllers import PostControllers
from utils.Users_dependencies import get_current_user

router = APIRouter(prefix="/pin", tags=["Pin"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
IMAGGA_API_KEY = os.getenv("IMAGGA_API_KEY")
IMAGGA_API_SECRET = os.getenv("IMAGGA_API_SECRET")

@router.post("/suggest_keywords")
async def suggest_keywords(file: UploadFile = File(...)):
    try:
        upload_response = requests.post(
            "https://api.imagga.com/v2/uploads",
            auth=(IMAGGA_API_KEY, IMAGGA_API_SECRET),
            files={"image": (file.filename, file.file, file.content_type)},
        )

        if upload_response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Upload error: {upload_response.text}")

        upload_id = upload_response.json()["result"]["upload_id"]

        tags_response = requests.get(
            f"https://api.imagga.com/v2/tags?image_upload_id={upload_id}",
            auth=(IMAGGA_API_KEY, IMAGGA_API_SECRET),
        )

        if tags_response.status_code != 200:
            raise HTTPException(status_code=500, detail=f"Tagging error: {tags_response.text}")

        tags_result = tags_response.json()
        tags = [
            {"tag": t["tag"]["en"], "confidence": t["confidence"]}
            for t in tags_result["result"]["tags"][:10]
        ]

        return {"tags": tags}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Keyword suggestion failed: {str(e)}")


@router.post("/", response_model=schemas.PostResponse)
async def create_pin(
    title: str = Form(...),
    description: str = Form(...),
    keywords: str = Form(None),
    file: UploadFile = File(...),
    db: Session = Depends(db.get_db),
    current_user: Users=Depends(get_current_user)
):
    try:
        # save file
        ext = os.path.splitext(file.filename)[1]
        safe_filename = f"{uuid.uuid4().hex}{ext}"
        file_path = UPLOAD_DIR / safe_filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        BACKEND_URL = "http://127.0.0.1:8000"
        image_url = f"{BACKEND_URL}/uploads/{safe_filename}"

        keyword_list = []
        if keywords:
            keyword_list = [kw.strip() for kw in keywords.split(",") if kw.strip()]

        # create db object
        pin = Posts(
            title=title,
            description=description,
            keywords=keyword_list,
            image_url=image_url,
            user_id=current_user.id
        )

        db.add(pin)
        db.commit()
        db.refresh(pin)

        return pin
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Pin creation failed: {str(e)}")

@router.get("/", response_model=list[schemas.PostResponse])
def get_pins(db: Session=Depends(db.get_db)):
    return PostControllers.get_pins(db)

@router.get("/{id}", response_model=schemas.PostResponse)
def get_pin_by_id(id: int, db: Session=Depends(db.get_db)):
    return PostControllers.get_pin_by_id(id, db)

@router.put("/{id}", response_model=schemas.PostResponse)
async def update_pin(id: int, pin: schemas.PostUpdate, db: Session=Depends(db.get_db)):
    return await PostControllers.update_pin(id, pin, db)

@router.delete("/{id}")
def delete_pin(id: int, db: Session=Depends(db.get_db)):
    return PostControllers.delete_pin(id, db)
