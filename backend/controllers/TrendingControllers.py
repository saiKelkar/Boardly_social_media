from sqlalchemy.orm import Session

from models import Trending

def update_trending(post_id: int, db: Session, like_inc=0, view_inc=0, save_inc=0):
    trending = db.query(Trending).filter(Trending.post_id == post_id).first()
    if not trending:
        trending = Trending(post_id=post_id, like_count=0, view_count=0, save_count=0)
        db.add(trending)

    trending.like_count += like_inc
    trending.view_count += view_inc
    trending.save_count += save_inc

    db.commit()
    db.refresh(trending)
    return trending

def get_trending_posts(db: Session, limit: int = 10):
    return db.query(Trending).order_by(
        (Trending.like_count + Trending.view_count + Trending.save_count).desc()
    ).limit(limit).all()
