from fastapi import APIRouter, Depends, Form, UploadFile, File, HTTPException, Request
from sqlalchemy.orm import Session
from pathlib import Path
from openai import OpenAI
import base64

import db, schemas
from models import Posts, Users
from controllers import PostControllers
from utils.Users_dependencies import get_current_user

router = APIRouter(prefix="/pin", tags=["Pin"])

UPLOAD_DIR = Path("uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

client = OpenAI(api_key="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")

@router.get("/", response_model=list[schemas.PostResponse])
def get_pins(db: Session=Depends(db.get_db)):
    return PostControllers.get_pins(db)

@router.post("/suggest_keywords")
async def suggest_keywords(file: UploadFile = File(...)):
    try:
        file_content = await file.read()
        base64_image = base64.b64encode(file_content).decode("utf-8")

        response = client.chat.completions.create(
            model="gpt-4o-mini",  # vision-enabled model
            messages=[
                {"role": "system", "content": "You are an assistant that generates SEO-friendly keywords/tags from images."},
                {"role": "user", "content": [
                    {"type": "text", "text": "Generate 10 descriptive, human-friendly tags for this image. Output as a JSON list."},
                    {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                ]}
            ],
            max_tokens=200
        )

        tags = response.choices[0].message.content

        return {"tags": tags}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Keyword suggestion failed: {str(e)}"
        )

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
        file_content = await file.read()
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)

        base_url = str(request.base_url).rstrip("/")
        image_url = f"{base_url}/uploads/{file.filename}"

        keyword_list = []
        if keywords:
            keyword_list = [kw.strip() for kw in keywords.split(",") if kw.strip()]
        else:
            base64_image = base64.b64encode(file_content).decode("utf-8")

            response = client.chat.completions.create(
                model="gpt-4o-mini",  # vision model
                messages=[
                    {"role": "system", "content": "You are an assistant that generates SEO-friendly keywords/tags from images."},
                    {"role": "user", "content": [
                        {"type": "text", "text": "Generate 10 descriptive, human-friendly tags for this image. Output as a JSON list of strings."},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                    ]}
                ],
                max_tokens=200
            )
            try:
                keyword_list = eval(response.choices[0].message.content)
            except Exception:
                keyword_list = [response.choices[0].message.content]

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
