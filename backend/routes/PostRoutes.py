from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException, Request
from sqlalchemy.orm import Session
from pathlib import Path
import shutil

import db, schemas
from models import Posts, Users
from controllers import PostControllers
from utils.Users_dependencies import get_current_user

router = APIRouter(prefix="/pin", tags=["Pin"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)



@router.get("/", response_model=list[schemas.PostResponse])
def get_pins(db: Session=Depends(db.get_db)):
    return PostControllers.get_pins(db)

@router.get("/{id}", response_model=schemas.PostResponse)
def get_pin_by_id(id: int, db: Session=Depends(db.get_db)):
    return PostControllers.get_pin_by_id(id, db)

@router.post("/", response_model=schemas.PostResponse)
async def create_pin(
    request: Request,
    title: str = Form(...),
    description: str = Form(...),
    keywords: str = Form(...),
    file: UploadFile = File(...),
    db: Session = Depends(db.get_db),
    current_user: Users=Depends(get_current_user)
):
    try:
        # save file
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        base_url = str(request.base_url).rstrip("/")
        image_url = f"{base_url}/uploads/{file.filename}"
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

@router.put("/{id}", response_model=schemas.PostResponse)
async def update_pin(id: int, pin: schemas.PostUpdate, db: Session=Depends(db.get_db)):
    return await PostControllers.update_pin(id, pin, db)

@router.delete("/{id}")
def delete_pin(id: int, db: Session=Depends(db.get_db)):
    return PostControllers.delete_pin(id, db)