from sqlalchemy import create_engine
from dotenv import load_dotenv
import os
import redis

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

redis_client = redis.Redis.from_url(
    "redis://default:CFTdP9VZdCERQmr7m6vOkbmUOU2P2XS7@redis-15940.c274.us-east-1-3.ec2.redns.redis-cloud.com:15940",
    decode_responses=True
)

def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()