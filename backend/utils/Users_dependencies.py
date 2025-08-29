from fastapi import Request, Depends, HTTPException, status
from sqlalchemy.orm import Session

import models, db
from db import redis_client

def get_current_user(request: Request, db: Session=Depends(db.get_db)):
    session_id = request.cookies.get("session_id")
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    
    user_id = redis_client.get(f"session: { session_id }")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session expired or invalid"
        )
    
    user = db.query(models.Users).get(int(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user