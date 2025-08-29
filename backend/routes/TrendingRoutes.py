from fastapi import APIRouter, Depends, List
from sqlalchemy.orm import Session

import db, schemas
from controllers import TrendingControllers

router = APIRouter(prefix="/trending", tags=["Trending"])

@router.get("/", response_model=List[schemas.TrendingResponse])
def get_trending(limit: int = 10, db: Session = Depends(db.get_db)):
    return TrendingControllers.get_trending_posts(limit, db)
