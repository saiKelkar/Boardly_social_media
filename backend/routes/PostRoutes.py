from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException, Request
from sqlalchemy.orm import Session
from pathlib import Path
import shutil
import httpx, os

import db, schemas
from models import Posts, Users
from controllers import PostControllers
from utils.Users_dependencies import get_current_user

router = APIRouter(prefix="/pin", tags=["Pin"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

TAGPHOTO_API_KEY = "tk_live_QWQP7puxwnuulEKaGMFA2T3Wd6wnnWrc"
TAGPHOTO_URL = "https://api.tagphoto.ai/api/v1/photo"

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
    keywords: str = Form(None),
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

        keyword_list = []
        if keywords:
            keyword_list = [kw.strip() for kw in keywords.split(",") if kw.strip()]
        else:
            async with httpx.AsyncClient() as client:
                with open(file_path, "rb") as img:
                    response = await client.post(
                        TAGPHOTO_URL,
                        headers={"Authorization": f"Bearer {TAGPHOTO_API_KEY}"},
                        files={"image": (file.filename, img, file.content_type)},
                    )
                if response.status_code == 200:
                    data = response.json()
                    keyword_list = data.get("data", {}).get("tags", [])
                else:
                    keyword_list = []

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

@router.post("/suggest_keywords")
async def suggest_keywords(file: UploadFile = File(...)):
    try:
        file_path = UPLOAD_DIR / file.filename
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        async with httpx.AsyncClient() as client:
            with open(file_path, "rb") as img:
                response = await client.post(
                    TAGPHOTO_URL,
                    headers={"Authorization": f"Bearer {TAGPHOTO_API_KEY}"},
                    files={"image": (file.filename, img, file.content_type)},
                    data={
                        "config": """{
                            "tagConfig": {
                                "allowOnlySingleWord": false,
                                "hasTagCountLimits": true,
                                "minTagCount": 1,
                                "maxTagCount": 10
                            },
                            "metadataConfig": {
                                "generateTitle": true,
                                "maxTitleWords": 10,
                                "generateColors": false,
                                "generateDescription": true,
                                "maxDescriptionWords": 10,
                                "minDescriptionWords": 1
                            }
                        }"""
                    }
                )
        if response.status_code == 200:
            return response.json()
        else:
            raise HTTPException(status_code=response.status_code, detail="Keyword suggestion failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
