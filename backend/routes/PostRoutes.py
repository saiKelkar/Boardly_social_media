from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import db, schemas, models
from controllers import PostControllers
from utils.Users_dependencies import get_current_user

router = APIRouter(prefix="/pin", tags=["Pin"])

@router.get("/", response_model=list[schemas.PostResponse])
def get_pins(db: Session=Depends(db.get_db)):
    return PostControllers.get_pins(db)

@router.get("/{id}", response_model=schemas.PostResponse)
def get_pin_by_id(id: int, db: Session=Depends(db.get_db)):
    return PostControllers.get_pin_by_id(id, db)

@router.post("/", response_model=schemas.PostResponse)
async def create_pin(pin: schemas.PostCreate, db: Session=Depends(db.get_db), current_user: models.Users=Depends(get_current_user)):
    return await PostControllers.create_pin(pin, db, user_id=current_user.id)

@router.put("/{id}", response_model=schemas.PostResponse)
async def update_pin(id: int, pin: schemas.PostUpdate, db: Session=Depends(db.get_db)):
    return await PostControllers.update_pin(id, pin, db)

@router.delete("/{id}")
def delete_pin(id: int, db: Session=Depends(db.get_db)):
    return PostControllers.delete_pin(id, db)