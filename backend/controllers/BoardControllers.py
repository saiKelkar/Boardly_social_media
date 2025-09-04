from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from typing import List

from controllers.websocket_manager import manager
from models import Boards, Posts, BoardPosts
import schemas

def get_boards(db: Session, current_user):
    boards = db.query(Boards).filter(Boards.user_id == current_user.id).all()
    result = []
    for board in boards:
        previews = (
            db.query(Posts)
            .join(BoardPosts, BoardPosts.post_id == Posts.id)
            .filter(BoardPosts.board_id == board.id)
            .limit(3)
            .all()
        )
        preview_schemas: List[schemas.PostPreview] = [
            schemas.PostPreview.model_validate(p, from_attributes=True) for p in previews
        ]
        result.append({
            "id": board.id,
            "name": board.name,
            "description": board.description,
            "preview_posts": preview_schemas
        })
    return result

def get_board_by_id(id: int, db: Session):
    board = db.query(Boards).filter(Boards.id == id).first()
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Board with ID {id} not found"
        )
    boardposts = (
        db.query(BoardPosts)
        .filter(BoardPosts.board_id == id)
        .all()
    )
    return schemas.BoardWithPosts(
        id=board.id,
        name=board.name,
        description=board.description,
        user_id=board.user_id,
        created_at=board.created_at,
        boardposts=[
            schemas.BoardPostWithPost.model_validate(bp, from_attributes=True)
            for bp in boardposts
        ]
    )

async def create_board(board: schemas.BoardCreate, db: Session, current_user):
    new_board = Boards(
        name=board.name,
        description=board.description,
        user_id=current_user.id
    )
    db.add(new_board)
    db.commit()
    db.refresh(new_board)

    await manager.broadcast({
        "type": "new_board",
        "data": {
            "name": new_board.name,
            "description": new_board.description
        }
    })
    return {
        "id": new_board.id,
        "name": new_board.name,
        "description": new_board.description,
        "preview_posts": []
    }

async def update_board(id: int, board: schemas.BoardUpdate, db: Session):
    board_update = db.query(Boards).filter(Boards.id == id).first()
    if not board_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Board with id {id} not found"
        )
    
    update_data = board.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(board_update, key, value)

    db.commit()
    db.refresh(board_update)

    await manager.broadcast({
        "type": "update_board",
        "data": {
            "name": board_update.name,
            "description": board_update.description
        }
    })
    previews = (
        db.query(Posts)
        .join(BoardPosts, BoardPosts.post_id == Posts.id)
        .filter(BoardPosts.board_id == id)
        .limit(3)
        .all()
    )
    preview_schemas = [
        schemas.PostPreview.model_validate(p, from_attributes=True) for p in previews
    ]
    return {
        "id": board_update.id,
        "name": board_update.name,
        "description": board_update.description,
        "preview_posts": preview_schemas
    }

def delete_board(id: int, db: Session):
    board = db.query(Boards).filter(Boards.id == id).first()
    if not board:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Board with id {id} not found"
        )
    db.delete(board)
    db.commit()
    return { "message": f"Board with id {id} deleted successfully" }