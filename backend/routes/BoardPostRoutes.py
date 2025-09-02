from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import db, schemas
from controllers import BoardPostControllers

router = APIRouter(prefix="/boards", tags=["Boards"])

@router.post("/{board_id}/posts/{post_id}", response_model=schemas.BoardPostResponse)
def add_post_to_board(board_id: int, post_id: int, db: Session = Depends(db.get_db)):
    return BoardPostControllers.add_post_to_board(board_id, post_id, db)

@router.delete("/{board_id}/posts/{post_id}")
def remove_post_from_board(board_id: int, post_id: int, db: Session = Depends(db.get_db)):
    return BoardPostControllers.remove_post_from_board(board_id, post_id, db)
