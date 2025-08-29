from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import db, schemas
from controllers import FollowControllers

router = APIRouter(prefix="/users", tags=["Users"])

@router.post("/{following_id}/follow", response_model=schemas.FollowResponse)
def follow_user(following_id: int, follower_id: int, db: Session = Depends(db.get_db)):
    return FollowControllers.follow_user(follower_id, following_id, db)

@router.delete("/{following_id}/follow")
def unfollow_user(following_id: int, follower_id: int, db: Session = Depends(db.get_db)):
    return FollowControllers.unfollow_user(follower_id, following_id, db)
