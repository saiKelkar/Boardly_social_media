from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import db, schemas
from controllers import LikeControllers

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.post("/{post_id}/like", response_model=schemas.LikeResponse)
def like_post(post_id: int, user_id: int, db: Session = Depends(db.get_db)):
    return LikeControllers.like_post(user_id, post_id, db)

@router.delete("/{post_id}/like")
def unlike_post(post_id: int, user_id: int, db: Session = Depends(db.get_db)):
    return LikeControllers.unlike_post(user_id, post_id, db)