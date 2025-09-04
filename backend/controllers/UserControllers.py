from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Request
from fastapi.responses import JSONResponse
import uuid

from db import redis_client
import models, schemas
from utils.hashing import hash_password, verify_password


def signup(request: schemas.UserCreate, db: Session):
    user = db.query(models.Users).filter(models.Users.email == request.email).first()
    if user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        ) 
    
    new_user = models.Users(
        first_name = request.first_name,
        last_name = request.last_name,
        username = request.username,
        email = request.email,
        password = hash_password(request.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def login(request: schemas.UserLogin, db: Session):
    user = db.query(models.Users).filter(models.Users.email == request.email).first()
    if not user or not verify_password(request.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    session_id = str(uuid.uuid4())
    redis_client.setex(f"session: {session_id}", 86400, user.id)

    response = JSONResponse(
        content={ "message": "Login successful" }
    )
    response.set_cookie(
        key="session_id", 
        value=session_id, 
        httponly=True,
        samesite="none"
    )
    return response

def logout(request: Request):
    session_id = request.cookies.get("session_id")
    if session_id:
        redis_client.delete(f"session: {session_id}")

    response = JSONResponse(
        content= { "message": "Logged out successfully" }
    )
    response.delete_cookie("session_id")
    return response