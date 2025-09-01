from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

import db, schemas
from models import Boards, Users
from utils.Users_dependencies import get_current_user
from controllers import BoardControllers

router = APIRouter(prefix="/board", tags=["Board"])

@router.get("/", response_model=list[schemas.BoardResponse])
def get_boards(
    db: Session=Depends(db.get_db),
    current_user: Users=Depends(get_current_user)
):
    return BoardControllers.get_boards(db, current_user)

@router.get("/{id}", response_model=schemas.BoardResponse)
def get_board_by_id(id: int, db: Session=Depends(db.get_db)):
    return BoardControllers.get_board_by_id(id, db)

@router.post("/", response_model=schemas.BoardResponse)
async def create_board(
    board: schemas.BoardCreate, 
    db: Session=Depends(db.get_db),
    current_user: Users = Depends(get_current_user)
):
    return await BoardControllers.create_board(board, db, current_user)

@router.put("/{id}", response_model=schemas.BoardResponse)
async def update_board(id: int, board: schemas.BoardUpdate, db: Session=Depends(db.get_db)):
    return await BoardControllers.update_board(id, board, db)

@router.delete("/{id}")
def delete_board(id: int, db: Session=Depends(db.get_db)):
    return BoardControllers.delete_board(id, db)