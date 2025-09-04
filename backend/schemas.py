from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional, Annotated, List

# Users
class UserCreate(BaseModel):
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    password: Annotated[str, Field(min_length=8)]

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    first_name: str
    last_name: str
    username: str
    email: EmailStr
    bio: Optional[str] = None
    profile_image_url: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes=True

# Posts
class PostCreate(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: str
    keywords: List[str]

class PostUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    image_url: Optional[str] = None
    keywords: Optional[List[str]] = None

class PostResponse(PostCreate):
    id: int
    created_at: Optional[datetime] = None
    user_id: int

    class Config:
        from_attributes=True

class PostPreview(BaseModel):
    id: int
    title: str
    image_url: Optional[str]

    class Config:
        from_attributes = True

# Boards
class BoardCreate(BaseModel):
    name: str
    description: Optional[str] = None

class BoardUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class BoardResponse(BoardCreate):
    id: int
    user_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes=True
    
class BoardWithPreviews(BaseModel):
    id: int
    name: str
    description: Optional[str]
    preview_posts: List[PostPreview] = []

    class Config:
        from_attributes = True

# BoardPosts
class BoardPostWithPost(BaseModel):
    id: int
    board_id: int
    post_id: int
    added_at: Optional[datetime] = None
    post: PostResponse   # include the full post

    class Config:
        from_attributes = True

class BoardWithPosts(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    user_id: int
    created_at: Optional[datetime] = None
    boardposts: List[BoardPostWithPost] = []

    class Config:
        from_attributes = True

class BoardPostResponse(BaseModel):
    id: int
    board_id: int
    post_id: int
    added_at: Optional[datetime] = None

    class Config:
        from_attributes=True

# Likes
class LikeResponse(BaseModel):
    id: int
    user_id: int
    post_id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes=True

# Follows
class FollowResponse(BaseModel):
    id: int
    follower_id: int
    following_id: int
    created_at: Optional[datetime] = None   

    class Config:
        from_attributes=True
    
# Trending
class TrendingResponse(BaseModel):
    id: int
    post_id: int
    like_count: int
    view_count: int
    save_count: int
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes=True