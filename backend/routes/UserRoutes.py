from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

import db, models
import schemas
from controllers import UserControllers
from utils.Users_dependencies import get_current_user

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.get("/home")
def get_dashboard(current_user: models.Users = Depends(get_current_user)):
    return {
        "message": f"Welcome {current_user.first_name}",
        "username": current_user.first_name
    }

@router.post("/signup", response_model=schemas.UserResponse)
def signup(user: schemas.UserCreate, db: Session=Depends(db.get_db)):
    return UserControllers.signup(user, db)

@router.post("/login")
def login(user: schemas.UserLogin, db: Session=Depends(db.get_db)):
    return UserControllers.login(user, db)

@router.post("/logout")
def logout(request: Request):
    return UserControllers.logout(request)