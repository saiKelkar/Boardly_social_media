from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
import redis
import models

from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL)

Base = declarative_base()
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

redis_client = redis.Redis(
    host="redis",
    port=6379,
    decode_responses=True
)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)