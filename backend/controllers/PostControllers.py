from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from controllers.websocket_manager import manager
from models import Posts
import schemas

def get_pins(db: Session):
    return db.query(Posts).all()

def get_pin_by_id(id: int, db: Session):
    pin = db.query(Posts).filter(Posts.id == id).first()
    if not pin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pin with ID {id} not found"
        )
    return pin

async def create_pin(pin: schemas.PostCreate, db: Session):
    new_pin = Posts(**pin.model_dump())
    db.add(new_pin)
    db.commit()
    db.refresh(new_pin)

    await manager.broadcast({
        "type": "new_pin",
        "data": {
            "title": new_pin.title,
            "description": new_pin.description,
            "image_url": new_pin.image_url,
            "keywords": new_pin.keywords
        }
    })
    return new_pin

async def update_pin(id: int, pin: schemas.PostUpdate, db: Session):
    pin_update = db.query(Posts).filter(Posts.id == id).first()
    if not pin_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pin with id {id} not found"
        )
    
    update_data = pin.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(pin_update, key, value)

    db.commit()
    db.refresh(pin_update)

    await manager.broadcast({
        "type": "update_pin",
        "data": {
            "title": pin_update.title,
            "description": pin_update.description,
            "image_url": pin_update.image_url,
            "keywords": pin_update.keywords
        }
    })
    return pin_update

def delete_pin(id: int, db: Session):
    pin = db.query(Posts).filter(Posts.id == id).first()
    if not pin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Pin with id {id} not found"
        )
    db.delete(pin)
    db.commit()
    return { "message": f"Pin with id {id} deleted successfully" }