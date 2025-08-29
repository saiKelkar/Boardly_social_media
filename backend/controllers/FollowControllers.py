from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models import Follows

def follow_user(follower_id: int, following_id: int, db: Session):
    new_follow = Follows(follower_id=follower_id, following_id=following_id)
    db.add(new_follow)
    db.commit()
    db.refresh(new_follow)
    return new_follow

def unfollow_user(follower_id: int, following_id: int, db: Session):
    follow = db.query(Follows).filter(
        Follows.follower_id == follower_id, Follows.following_id == following_id
    ).first()
    if not follow:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Follow relationship not found"
        )
    db.delete(follow)
    db.commit()
    return { "message": "Unfollowed successfully" }
