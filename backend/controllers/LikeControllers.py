from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models import Likes

def like_post(user_id: int, post_id: int, db: Session):
    new_like = Likes(user_id=user_id, post_id=post_id)
    db.add(new_like)
    db.commit()
    db.refresh(new_like)
    return new_like

def unlike_post(user_id: int, post_id: int, db: Session):
    like = db.query(Likes).filter(
        Likes.user_id == user_id, Likes.post_id == post_id
    ).first()
    if not like:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Like not found"
        )
    db.delete(like)
    db.commit()
    return { "message": "Post unliked" }
