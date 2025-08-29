from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Index
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy import UniqueConstraint
from db import Base

class Users(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    
    username = Column(String, nullable=False, unique=True, index=True)
    email = Column(String, nullable=False, unique=True, index=True)
    password = Column(String, nullable=False)
    bio = Column(String, nullable=True)
    profile_image_url = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=True, index=True)

    # Relationship
    posts = relationship("Posts", back_populates="user", cascade="all, delete-orphan")
    boards = relationship("Boards", back_populates="user")
    likes = relationship("Likes", back_populates="user")
    follower = relationship("Follows", back_populates="user_following", foreign_keys="Follows.following_id")
    following = relationship("Follows", back_populates="user_follower", foreign_keys="Follows.follower_id")

class Posts(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)

    # Relationship
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("Users", back_populates="posts")
    boardposts = relationship("BoardPosts", back_populates="post")
    likes = relationship("Likes", back_populates="post")
    trending = relationship("Trending", back_populates="post")

    title = Column(String, nullable=False)
    description = Column(String, nullable=True)
    image_url = Column(String, nullable=False)
    keywords = Column(JSONB, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=True, index=True)

    __table_args__ = (
        Index("ix_posts_keywords_gin", "keywords", postgresql_using="gin"),
    )

class Boards(Base):
    __tablename__ = "boards"

    id = Column(Integer, primary_key=True, index=True)

    # Relationship
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("Users", back_populates="boards")
    boardposts = relationship("BoardPosts", back_populates="board", cascade="all, delete-orphan")

    name = Column(String, nullable=False)
    description = Column(String, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=True)

class BoardPosts(Base):
    __tablename__ = "boardposts"
    __table_args__ = (UniqueConstraint("board_id", "post_id", name="uq_board_post"),)

    id = Column(Integer, index=True, primary_key=True)

    # Relationship
    board_id = Column(Integer, ForeignKey("boards.id"), nullable=False)
    board = relationship("Boards", back_populates="boardposts")
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    post = relationship("Posts", back_populates="boardposts")

    added_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=True)

class Likes(Base):
    __tablename__ = "likes"
    __table_args__ = (UniqueConstraint("user_id", "post_id", name="uq_user_post_like"),)

    id = Column(Integer, index=True, primary_key=True)

    # Relationship
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("Users", back_populates="likes")
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    post = relationship("Posts", back_populates="likes")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=True)

class Follows(Base):
    __tablename__ = "follows"

    id = Column(Integer, primary_key=True, index=True)

    # Relationships
    follower_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_follower = relationship("Users", back_populates="follower")
    following_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user_following = relationship("Users", back_populates="following")

    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=True)

class Trending(Base):
    __tablename__ = "trending"

    id = Column(Integer, primary_key=True, index=True)

    # Relationship
    post_id = Column(Integer, ForeignKey("posts.id"), nullable=False)
    post = relationship("Posts", back_populates="trending")

    like_count = Column(Integer, nullable=False, default=0)
    view_count = Column(Integer, nullable=False, default=0)
    save_count = Column(Integer, nullable=False, default=0)

    last_updated = Column(DateTime(timezone=True), server_default=func.now(), nullable=True)