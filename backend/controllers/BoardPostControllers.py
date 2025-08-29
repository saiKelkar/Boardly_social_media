from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models import BoardPosts

def add_post_to_board(board_id: int, post_id: int, db: Session):
    new_entry = BoardPosts(board_id=board_id, post_id=post_id)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    return new_entry

def remove_post_from_board(board_id: int, post_id: int, db: Session):
    entry = db.query(BoardPosts).filter(
        BoardPosts.board_id == board_id,
        BoardPosts.post_id == post_id
    ).first()
    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found in board"
        )
    db.delete(entry)
    db.commit()
    return { "message": "Post removed from board" }